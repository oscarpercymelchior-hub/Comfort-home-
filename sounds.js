/* Comfort Home – Sounds tab + speaker cards (Google Nest Mini and other Google Cast speakers in Home Assistant).
   Christmas music = Christmas internet radio stations, found live in the free Radio Browser directory
   (radio-browser.info) and played on the chosen speaker with media_player.play_media.
   Announcements use the text-to-speech entity that already exists in Home Assistant (tts.speak).
   Only existing entities are used; nothing in Home Assistant is changed. */
(function () {
  'use strict';
  window.ComfortSounds = function (core) {
    const { S, settings, ic, esc } = core;
    const nl = () => settings.lang === 'nl' || (settings.lang !== 'en' && settings.lang !== 'mc' && /^nl/i.test(navigator.language || ''));
    const L = (en, du) => (nl() ? du : en);
    const avail = (e) => S.states[e] && core.avail(S.states[e]);
    const SN = { player: null, q: '', msg: '', sleep: null, loading: false, err: '', list: null, cat: 'christmas' };
    const CATS = [['christmas', () => L('Christmas', 'Kerst'), 'christmas'], ['nl', () => L('Dutch Christmas', 'Nederlandse kerst'), 'christmas'], ['xmasjazz', () => 'Christmas jazz', 'christmas jazz'], ['sleep', () => L('Sleep & calm', 'Slapen & rust'), 'sleep'], ['lofi', () => 'Lo-fi', 'lofi']];

    /* ---------- speakers ---------- */
    function speakers() {
      const m = core.model();
      const castLike = (e) => { const en = S.ents[e] || {}; if (en.platform) return en.platform === 'cast'; return /google|nest|chromecast|cast/i.test(modelOf(e) + ' ' + ((((S.devices || {})[en.device_id]) || {}).manufacturer || '')); };
      return Object.keys(S.states).filter((e) => e.startsWith('media_player.') && castLike(e) && !(S.ents[e] || {}).disabled)
        .sort((a, b) => (avail(b) ? 1 : 0) - (avail(a) ? 1 : 0) || core.nameOf(a).localeCompare(core.nameOf(b))).filter(() => m);
    }
    const isGroup = (e) => /group/i.test(((S.devices || {})[(S.ents[e] || {}).device_id] || {}).model || '') || /^(all|overal|heel huis|thuisgroep)$/i.test(core.nameOf(e));
    const modelOf = (e) => (((S.devices || {})[(S.ents[e] || {}).device_id] || {}).model) || '';
    // speakers that belong to a room: in the room in HA, added in the app, or named after the room (e.g. "kamer Oscar")
    function roomSpeakers(r) {
      const key = r.name.toLowerCase().replace(/kamer|room|de |het /g, '').trim();
      const added = ((S.ud.roomAdd || {})[r.id] || []);
      return speakers().filter((e) => !isGroup(e) && (r.devs.indexOf(e) >= 0 || added.indexOf(e) >= 0 || (key.length > 2 && core.nameOf(e).toLowerCase().indexOf(key) >= 0)));
    }
    function player() {
      if (SN.player && S.states[SN.player]) return SN.player;
      const saved = settings.soundPlayer; if (saved && S.states[saved]) return saved;
      const sp = speakers(); return sp.find((e) => /oscar/i.test(e)) || sp[0] || null;
    }
    const ttsEntity = () => Object.keys(S.states).filter((e) => e.startsWith('tts.'))[0] || null;

    /* ---------- radio stations (Radio Browser, cached for a day) ---------- */
    const API = ['https://de1.api.radio-browser.info', 'https://fi1.api.radio-browser.info', 'https://de2.api.radio-browser.info'];
    function get(url, ok, bad, i) {
      i = i || 0; const x = new XMLHttpRequest(); x.open('GET', API[i] + url, true); x.timeout = 9000;
      x.onload = () => { try { if (x.status !== 200) throw new Error(x.status); ok(JSON.parse(x.responseText)); } catch (e) { if (i + 1 < API.length) get(url, ok, bad, i + 1); else bad(e); } };
      x.onerror = x.ontimeout = () => { if (i + 1 < API.length) get(url, ok, bad, i + 1); else bad(new Error('offline')); };
      x.send();
    }
    function load(cat, force) {
      const key = 'ch.radio.' + cat;
      if (!force) { try { const c = JSON.parse(localStorage.getItem(key) || 'null'); if (c && Date.now() - c.at < 864e5 && c.list.length) { SN.list = c.list; SN.err = ''; return; } } catch (e) { /* ignore */ } }
      if (SN.loading) return; SN.loading = true; SN.err = '';
      const c = CATS.find((x) => x[0] === cat) || CATS[0];
      const url = '/json/stations/search?tag=' + encodeURIComponent(c[2]) + (cat === 'nl' ? '&countrycode=NL' : '') + '&order=votes&reverse=true&hidebroken=true&limit=60';
      get(url, (rows) => {
        const seen = {}; const list = (rows || []).filter((r) => r.url_resolved && /mp3|aac/i.test(r.codec || 'mp3') && !seen[r.name.trim().toLowerCase()] && (seen[r.name.trim().toLowerCase()] = 1))
          .map((r) => ({ id: r.stationuuid, name: r.name.trim().slice(0, 48), url: r.url_resolved.replace(/^http:\/\//, location.protocol === 'https:' ? 'https://' : 'http://'), cc: r.countrycode || '', tags: (r.tags || '').split(',').slice(0, 3).join(', '), icon: r.favicon || '' })).slice(0, 30);
        SN.list = list; SN.loading = false; try { localStorage.setItem(key, JSON.stringify({ at: Date.now(), list })); } catch (e) { /* full */ }
        core.schedule(true);
      }, () => { SN.loading = false; SN.err = L('Could not reach the radio directory. Check the internet connection.', 'De radiolijst is niet bereikbaar. Controleer de internetverbinding.'); core.schedule(true); });
    }
    function stations() { if (!SN.list) load(SN.cat); return SN.list || []; }

    /* ---------- actions ---------- */
    function playStation(st, e, vol) {
      e = e || player(); if (!e || !core.canSend()) return;
      if (!avail(e)) { core.toast(L('This speaker is offline in Home Assistant', 'Deze speaker is offline in Home Assistant'), 'bad'); return; }
      if (vol != null) core.svc('media_player', 'volume_set', { entity_id: e, volume_level: Math.max(0, Math.min(1, vol / 100)) });
      core.svc('media_player', 'play_media', { entity_id: e, media_content_id: st.url, media_content_type: 'music', extra: { metadata: { title: st.name, metadataType: 3 } } });
      SN.now = { e, id: st.id, name: st.name }; try { localStorage.setItem('ch.radio.last', JSON.stringify(st)); } catch (er) { /* ignore */ }
      core.toast('▶ ' + st.name, 'ok'); core.schedule(true);
    }
    function say(text, e) {
      e = e || player(); const tts = ttsEntity(); text = String(text || '').trim().slice(0, 300);
      if (!text || !core.canSend()) return;
      if (!tts) { core.toast(L('No text-to-speech in Home Assistant', 'Geen tekst-naar-spraak in Home Assistant'), 'bad'); return; }
      if (!avail(e)) { core.toast(L('This speaker is offline in Home Assistant', 'Deze speaker is offline in Home Assistant'), 'bad'); return; }
      core.svc('tts', 'speak', { entity_id: tts, media_player_entity_id: e, message: text, language: nl() ? 'nl' : 'en', cache: false });
      core.toast(L('Announced', 'Omgeroepen') + ': ' + text.slice(0, 40), 'ok');
    }
    function setSleep(min, e) {
      if (SN.sleep) { clearTimeout(SN.sleep.t); SN.sleep = null; }
      if (min) { const until = Date.now() + min * 60e3; SN.sleep = { e, until, t: setTimeout(() => { core.svc('media_player', 'media_stop', { entity_id: e }); SN.sleep = null; core.schedule(true); }, min * 60e3) }; core.toast(L(`Music stops in ${min} min`, `Muziek stopt over ${min} min`), 'ok'); }
      core.schedule(true);
    }
    const PHRASES = () => [L('Dinner is ready!', 'Het eten is klaar!'), L('Good night, sleep well', 'Welterusten, slaap lekker'), L('Can you come downstairs?', 'Kun je even naar beneden komen?'), L('Time to get up!', 'Tijd om op te staan!'), L('Time for homework', 'Tijd voor huiswerk')];

    /* ---------- pieces of UI ---------- */
    function stateTxt(e) {
      const s = S.states[e]; if (!s || !core.avail(s)) return L('Offline', 'Offline');
      const a = s.attributes; const t = a.media_title ? ' · ' + a.media_title : (SN.now && SN.now.e === e && s.state === 'playing' ? ' · ' + SN.now.name : '');
      return ({ playing: L('Playing', 'Speelt'), paused: L('Paused', 'Gepauzeerd'), idle: L('Ready', 'Klaar'), off: L('Off', 'Uit'), on: L('On', 'Aan'), buffering: L('Loading…', 'Laden…') }[s.state] || s.state) + t;
    }
    function volume(e) { const a = (S.states[e] || {}).attributes || {}; return a.volume_level != null ? Math.round(a.volume_level * 100) : null; }
    function controls(e) {
      const ok = avail(e) && S.conn === 'connected'; const s = S.states[e] || {}; const v = volume(e); const playing = s.state === 'playing';
      return `<div class="sp-ctl"><button class="sp-b" data-wact="sp-pp" data-eid="${esc(e)}" ${ok ? '' : 'disabled'} aria-label="${playing ? 'Pauze' : 'Play'}">${ic(playing ? 'pause' : 'play')}</button><button class="sp-b" data-wact="sp-stop" data-eid="${esc(e)}" ${ok ? '' : 'disabled'} aria-label="Stop">${ic('stop')}</button>
<div class="sp-vol"><button class="sp-b sm" data-wact="sp-vol" data-d="-5" data-eid="${esc(e)}" ${ok ? '' : 'disabled'} aria-label="${L('Volume down', 'Zachter')}">${ic('minus')}</button><input type="range" min="0" max="100" value="${v == null ? 30 : v}" data-win="sp-vol" data-eid="${esc(e)}" ${ok ? '' : 'disabled'} aria-label="Volume"><button class="sp-b sm" data-wact="sp-vol" data-d="5" data-eid="${esc(e)}" ${ok ? '' : 'disabled'} aria-label="${L('Volume up', 'Harder')}">${ic('plus')}</button><b class="num">${v == null ? '–' : v + '%'}</b></div></div>`;
    }
    const offlineNote = (e) => (avail(e) ? '' : `<p class="sp-off">${ic('alert')}<span>${L('This speaker is offline in Home Assistant. Check that it is plugged in and on the same Wi-Fi; otherwise reload the Google Cast integration in Home Assistant.', 'Deze speaker is offline in Home Assistant. Controleer of hij aan staat en op hetzelfde wifi zit; herlaad anders de Google Cast-integratie in Home Assistant.')}</span></p>`);
    // the card on a room page (e.g. the Nest Mini in Kamer Oscar)
    function speakerCard(e) {
      const ok = avail(e) && S.conn === 'connected'; const st = stations().slice(0, 4); const last = (() => { try { return JSON.parse(localStorage.getItem('ch.radio.last') || 'null'); } catch (er) { return null; } })();
      const sl = SN.sleep && SN.sleep.e === e ? Math.max(1, Math.round((SN.sleep.until - Date.now()) / 60e3)) : 0;
      return `<div class="sp-card${S.states[e] && S.states[e].state === 'playing' ? ' playing' : ''}" data-k="sp-${esc(e)}"><div class="sp-h"><span class="sp-ic">${ic('speaker')}<i class="sp-eq"><b></b><b></b><b></b></i></span><div class="sp-t"><b>${esc(core.nameOf(e))}</b><span>${esc(modelOf(e) || 'Google Cast')} · ${esc(stateTxt(e))}</span></div><button class="w-ren inl" data-wact="rename" data-eid="${esc(e)}" aria-label="${L('Rename', 'Naam aanpassen')}">${ic('pencil')}</button></div>
${offlineNote(e)}${controls(e)}
<div class="sp-sec"><span class="sp-l">${ic('auto')}${L('Christmas radio', 'Kerstradio')}</span><div class="sp-chips">${last ? `<button class="sp-chip" data-wact="sp-play" data-v="${esc(last.id)}" data-eid="${esc(e)}" ${ok ? '' : 'disabled'}>↺ ${esc(last.name)}</button>` : ''}${st.filter((x) => !last || x.id !== last.id).slice(0, 3).map((x) => `<button class="sp-chip" data-wact="sp-play" data-v="${esc(x.id)}" data-eid="${esc(e)}" ${ok ? '' : 'disabled'}>${esc(x.name)}</button>`).join('')}<button class="sp-chip ghost" data-wact="page" data-v="sounds">${L('All sounds', 'Alle sounds')} ›</button></div></div>
<div class="sp-sec"><span class="sp-l">${ic('speaker')}${L('Announce', 'Omroepen')}</span><div class="sp-say"><input type="text" data-win="sp-msg" value="${esc(SN.msg)}" maxlength="300" placeholder="${L('Type a message…', 'Typ een bericht…')}" ${ok ? '' : 'disabled'}><button class="btn pri" data-wact="sp-say" data-eid="${esc(e)}" ${ok ? '' : 'disabled'}>${L('Say', 'Spreek uit')}</button></div>
<div class="sp-chips">${PHRASES().map((p) => `<button class="sp-chip" data-wact="sp-phrase" data-v="${esc(p)}" data-eid="${esc(e)}" ${ok ? '' : 'disabled'}>${esc(p)}</button>`).join('')}</div></div>
<div class="sp-sec"><span class="sp-l">${ic('moon')}${L('Sleep timer', 'Slaaptimer')}${sl ? ` · <b>${sl} min</b>` : ''}</span><div class="sp-chips">${[15, 30, 45, 60].map((m) => `<button class="sp-chip" data-wact="sp-sleep" data-v="${m}" data-eid="${esc(e)}" ${ok ? '' : 'disabled'}>${m} min</button>`).join('')}${sl ? `<button class="sp-chip ghost" data-wact="sp-sleep" data-v="0" data-eid="${esc(e)}">${L('Cancel', 'Annuleren')}</button>` : ''}</div></div></div>`;
    }
    // the Sounds page (bottom of the rail)
    function pageHTML() {
      const sp = speakers(); const e = player(); const list = stations(); const q = SN.q.toLowerCase();
      const shown = list.filter((x) => !q || (x.name + ' ' + x.tags).toLowerCase().indexOf(q) >= 0);
      let out = `<div class="w-pagebar"><h1>Sounds</h1></div>`;
      if (!sp.length) return out + `<p class="w-empty">${L('No Google Cast speakers found in Home Assistant.', 'Geen Google Cast-speakers gevonden in Home Assistant.')}</p>`;
      out += `<section class="w-panel" data-k="snd-sp"><div class="w-ph"><h2>${L('Play on', 'Afspelen op')}</h2></div><div class="sp-pick">${sp.map((x) => `<button class="sp-p${x === e ? ' on' : ''}${avail(x) ? '' : ' na'}" data-wact="sp-pick" data-eid="${esc(x)}" data-k="spp-${esc(x)}">${ic('speaker')}<span>${esc(core.nameOf(x))}<small>${avail(x) ? esc(stateTxt(x)) : 'Offline'}</small></span></button>`).join('')}</div>${e ? offlineNote(e) + controls(e) : ''}</section>`;
      out += `<section class="w-panel" data-k="snd-list"><div class="w-ph"><h2>${L('Radio', 'Radio')}</h2></div><div class="sp-cats">${CATS.map(([id, l]) => `<button class="${SN.cat === id ? 'on' : ''}" data-wact="sp-cat" data-v="${id}">${esc(l())}</button>`).join('')}</div>
<label class="m-row"><input type="text" data-win="sp-q" value="${esc(SN.q)}" placeholder="${L('Search a station…', 'Zoek een zender…')}" autocomplete="off"></label>
${SN.err ? `<p class="sp-off">${ic('alert')}<span>${esc(SN.err)}</span></p>` : ''}${SN.loading && !list.length ? `<p class="w-empty">${L('Loading stations…', 'Zenders laden…')}</p>` : ''}
<div class="snd-grid">${shown.map((x) => { const on = SN.now && SN.now.id === x.id && S.states[SN.now.e] && S.states[SN.now.e].state === 'playing';
        return `<button class="snd${on ? ' on' : ''}" data-wact="sp-play" data-v="${esc(x.id)}" data-k="snd-${esc(x.id)}"><span class="snd-i">${on ? '<i class="sp-eq"><b></b><b></b><b></b></i>' : ic('play')}</span><span class="snd-t"><b>${esc(x.name)}</b><small>${esc([x.cc, x.tags].filter(Boolean).join(' · '))}</small></span></button>`; }).join('')}</div>
<p class="w-note">${L('Stations come from the free Radio Browser directory. Individual songs need a music service (e.g. Spotify) in Home Assistant.', 'Zenders komen uit de gratis Radio Browser-lijst. Losse liedjes kiezen kan alleen met een muziekdienst (zoals Spotify) in Home Assistant.')}</p></section>`;
      return out;
    }
    function find(id) { const all = [].concat(SN.list || []); CATS.forEach(([c]) => { try { const x = JSON.parse(localStorage.getItem('ch.radio.' + c) || 'null'); if (x) all.push.apply(all, x.list); } catch (e) { /* ignore */ } }); try { const l = JSON.parse(localStorage.getItem('ch.radio.last') || 'null'); if (l) all.push(l); } catch (e) { /* ignore */ } return all.find((x) => x.id === id) || null; }
    function onAct(a, el) {
      const e = el.dataset.eid || player();
      if (a === 'sp-pick') { SN.player = el.dataset.eid; settings.soundPlayer = SN.player; core.saveSettings(); core.schedule(true); return true; }
      if (a === 'sp-cat') { SN.cat = el.dataset.v; SN.list = null; load(SN.cat); core.schedule(true); return true; }
      if (a === 'sp-play') { const st = find(el.dataset.v); if (st) playStation(st, e); return true; }
      if (!core.canSend()) return true;
      if (a === 'sp-pp') { core.svc('media_player', 'media_play_pause', { entity_id: e }); return true; }
      if (a === 'sp-stop') { core.svc('media_player', 'media_stop', { entity_id: e }); return true; }
      if (a === 'sp-vol') { const v = Math.max(0, Math.min(100, (volume(e) || 0) + +el.dataset.d)); core.svc('media_player', 'volume_set', { entity_id: e, volume_level: v / 100 }); return true; }
      if (a === 'sp-say') { const inp = el.parentNode.querySelector('[data-win=sp-msg]'); say(inp ? inp.value : SN.msg, e); SN.msg = ''; if (inp) inp.value = ''; return true; }
      if (a === 'sp-phrase') { say(el.dataset.v, e); return true; }
      if (a === 'sp-sleep') { setSleep(+el.dataset.v, e); return true; }
      return false;
    }
    function onInput(k, el, ev) {
      if (k === 'sp-q') { SN.q = el.value; core.schedule(true); return true; }
      if (k === 'sp-msg') { SN.msg = el.value; return true; }
      if (k === 'sp-vol') { const b = el.parentNode.querySelector('b'); if (b) b.textContent = el.value + '%'; if (ev && ev.type === 'change' && core.canSend()) core.svc('media_player', 'volume_set', { entity_id: el.dataset.eid, volume_level: +el.value / 100 }); return true; }
      return false;
    }
    return { pageHTML, speakerCard, roomSpeakers, speakers, stations, find, playStation, say, onAct, onInput, load, player };
  };
})();
