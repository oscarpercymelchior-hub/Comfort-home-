/* Comfort Home – Moods per room (iPad layout). Separate module.
   Light scenes the user can edit: which lights, on/off, colour or white temperature, brightness, transition.
   Stored in the Home Assistant user profile (via core.saveUD) so every device shows the same moods.
   Only real light entities of the room are used. */
(function () {
  'use strict';
  window.ComfortMoods = function (core) {
    const { S, settings, ic, esc } = core;
    const nl = () => settings.lang === 'nl' || (settings.lang !== 'en' && settings.lang !== 'mc' && /^nl/i.test(navigator.language || ''));
    const L = (en, du) => (nl() ? du : en);
    const caps = (e) => { const m = ((S.states[e] || {}).attributes || {}).supported_color_modes || []; return { ct: m.indexOf('color_temp') >= 0, color: m.some((x) => ['hs', 'xy', 'rgb', 'rgbw', 'rgbww'].indexOf(x) >= 0), bri: m.length && !(m.length === 1 && m[0] === 'onoff') }; };
    const ICONS = { christmas: 'auto', sleep: 'moon', read: 'list', wake: 'sun', movie: 'tv', relax: 'sunmoon', bright: 'light' };
    let ramp = null; // running Wake Up
    try { S.moodLast = Object.assign({}, JSON.parse(localStorage.getItem('ch.moodLast') || '{}'), S.moodLast || {}); } catch (e) { S.moodLast = S.moodLast || {}; }
    const remember = (room, id) => { S.moodLast = S.moodLast || {}; S.moodLast[room] = id; try { localStorage.setItem('ch.moodLast', JSON.stringify(S.moodLast)); } catch (e) { /* private mode */ } };
    const SCENE = { christmas: 'christmas', sleep: 'sleep', read: 'read', wake: 'wake', movie: 'movie', relax: 'relax', bright: 'bright' };
    const sceneOf = (md) => SCENE[md.key] || 'relax';
    // each mood card gets its own small living animation (CSS, transform/opacity only)
    const fxBits = () => '<span class="m-fx" aria-hidden="true"><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i></span>';

    function roomLights(r) {
      const m = core.model(); const add = ((S.ud.roomAdd || {})[r.id] || []).filter((e) => S.states[e] && e.startsWith('light.'));
      return r.devs.filter((e) => m.kind[e] === 'light').concat(add.filter((e) => r.devs.indexOf(e) < 0));
    }
    function cfg(e, on, bri, ct, hs) { const c = caps(e); return { use: true, on, bri, mode: hs && c.color ? 'color' : 'ct', ct: ct || 2700, hs: hs || [30, 80] }; }
    function defaults(r) {
      const ls = roomLights(r); const living = /woon|living|lounge/i.test(r.name);
      const map = (f) => { const o = {}; ls.forEach((e, i) => { o[e] = f(e, i); }); return o; };
      const xmas = { id: 'xmas', key: 'christmas', name: 'Old Christmas', trans: 3, lights: map((e, i) => (i % 2 === 0 ? cfg(e, true, 55, 2700) : cfg(e, true, 45, 2200, i % 4 === 1 ? [4, 92] : [24, 95]))) };
      if (living) return [xmas,
        { id: 'movie', key: 'movie', name: 'Movie', trans: 4, lights: map((e, i) => (i === 0 ? cfg(e, true, 12, 2200) : Object.assign(cfg(e, false, 10, 2200), { on: false }))) },
        { id: 'relax', key: 'relax', name: 'Relax', trans: 3, lights: map((e) => cfg(e, true, 45, 2700)) },
        { id: 'bright', key: 'bright', name: 'Bright', trans: 1, lights: map((e) => cfg(e, true, 100, 4000)) }];
      return [xmas,
        { id: 'sleep', key: 'sleep', name: 'Sleep', trans: 5, lights: map((e, i) => (i === 0 ? cfg(e, true, 8, 2200) : Object.assign(cfg(e, false, 8, 2200), { on: false }))) },
        { id: 'read', key: 'read', name: 'Read', trans: 2, lights: map((e) => cfg(e, true, 90, 4000)) },
        { id: 'wake', key: 'wake', name: 'Wake Up', wake: true, minutes: 10, trans: 20, lights: map((e) => cfg(e, true, 100, 4000)) }];
    }
    function moodsOf(r) {
      const saved = (S.ud.moods || {})[r.id]; const list = saved && saved.length ? saved : defaults(r);
      const ls = roomLights(r);
      list.forEach((md) => { md.lights = md.lights || {}; ls.forEach((e) => { if (!md.lights[e]) md.lights[e] = Object.assign(cfg(e, true, 60, 2700), { use: false }); }); });
      return list;
    }
    function lightData(e, c, extra) {
      const cp = caps(e); const d = { entity_id: e };
      if (cp.bri) d.brightness_pct = Math.max(1, Math.min(100, Math.round(c.bri)));
      if (c.mode === 'color' && cp.color) d.hs_color = [Math.round(c.hs[0]), Math.round(c.hs[1])];
      else if (cp.ct) d.color_temp_kelvin = Math.round(c.ct);
      return Object.assign(d, extra || {});
    }
    // other devices in a mood (any room): on/off only. Air conditioners are deliberately not offered (their settings stay untouched).
    const DEV_KINDS = ['light', 'plug', 'switch', 'fan', 'cover', 'media', 'scene', 'script'];
    const devsOf = (md) => Object.keys(md.devs || {}).filter((e) => S.states[e]);
    function devCall(e, on) {
      const d = e.split('.')[0];
      if (d === 'scene' || d === 'script') { if (on) core.svc(d, 'turn_on', { entity_id: e }); return; }
      if (d === 'cover') { core.svc('cover', on ? 'open_cover' : 'close_cover', { entity_id: e }); return; }
      core.svc(['switch', 'fan', 'media_player', 'input_boolean'].indexOf(d) >= 0 ? d : 'homeassistant', on ? 'turn_on' : 'turn_off', { entity_id: e });
    }
    const lightKeys = (r, md) => { const ls = roomLights(r); Object.keys(md.lights).forEach((e) => { if (ls.indexOf(e) < 0 && S.states[e]) ls.push(e); }); return ls; };
    function stopRamp(msg) { if (ramp) { clearInterval(ramp.t); ramp = null; if (msg) core.toast(msg, 'ok'); core.schedule(true); } }
    function apply(r, md) {
      if (!core.canSend()) return;
      stopRamp();
      const entries = Object.keys(md.lights).filter((e) => md.lights[e].use && S.states[e]);
      const devs = devsOf(md).filter((e) => md.devs[e].use);
      if (!entries.length && !devs.length) { core.toast(L('Choose lights or devices for this mood first (pencil)', 'Kies eerst lampen of apparaten voor deze mood (potlood)'), 'bad'); return; }
      devs.forEach((e) => devCall(e, md.devs[e].on !== false));
      if (md.wake) {
        // Wake Up: start very low and warm, then step up to the mood's brightness and white over N minutes.
        const total = Math.max(1, md.minutes || 10) * 60; const step = 20; const n = Math.ceil(total / step); let i = 0;
        const doStep = () => {
          const f = Math.min(1, i / n);
          entries.forEach((e) => { const c = md.lights[e]; if (!c.on) { if (i === 0) core.svc('light', 'turn_off', { entity_id: e }); return; } core.svc('light', 'turn_on', lightData(e, { bri: 2 + (c.bri - 2) * f, mode: 'ct', ct: 2200 + ((c.mode === 'ct' ? c.ct : 4000) - 2200) * f, hs: c.hs }, { transition: i === 0 ? 1 : step })); });
          i++; if (ramp) ramp.i = i; if (i > n) stopRamp(L('Wake Up finished', 'Wake Up klaar'));
          core.schedule(true);
        };
        ramp = { room: r.id, id: md.id, n, i: 0, t: setInterval(doStep, step * 1000) }; remember(r.id, md.id); if (core.fx && core.fx()) core.fx().mood(r.id, md); doStep();
        core.toast(L(`Wake Up: ${md.minutes || 10} minutes`, `Wake Up: ${md.minutes || 10} minuten`), 'ok'); return;
      }
      entries.forEach((e) => { const c = md.lights[e]; const tr = Math.max(0, +md.trans || 0); if (!c.on) core.svc('light', 'turn_off', { entity_id: e, transition: tr }); else core.svc('light', 'turn_on', lightData(e, c, { transition: tr })); });
      remember(r.id, md.id); if (core.fx && core.fx()) core.fx().mood(r.id, md);
      core.toast(md.name + ' ✓', 'ok'); core.schedule(true);
    }
    function sectionHTML(r) {
      const ls = roomLights(r);
      if (!ls.length) return core.panel(L('Moods', 'Moods'), `<p class="w-empty" style="padding:8px 2px">${L('No lights in this room yet. Add lights with "Add device".', 'Nog geen lampen in deze kamer. Voeg lampen toe met "Apparaat toevoegen".')}</p>`, 'm-sec');
      const list = moodsOf(r); const last = (S.moodLast || {})[r.id];
      const body = `<div class="m-grid">${list.map((md) => { const running = ramp && ramp.room === r.id && ramp.id === md.id; const n = Object.keys(md.lights).filter((e) => md.lights[e].use && S.states[e]).length + devsOf(md).filter((e) => md.devs[e].use).length;
        return `<div class="m-card${last === md.id ? ' last' : ''}${running ? ' run' : ''} k-${esc(md.key || 'custom')}" data-k="m-${esc(r.id)}-${esc(md.id)}">${fxBits()}<button class="m-go" data-wact="mood-apply" data-room="${esc(r.id)}" data-v="${esc(md.id)}"><span class="m-ic">${ic(ICONS[md.key] || 'auto')}</span><b>${esc(md.name)}</b><span class="m-sub">${running ? L(`running ${Math.round(ramp.i / ramp.n * 100)}%`, `bezig ${Math.round(ramp.i / ramp.n * 100)}%`) : md.wake ? L(`${md.minutes || 10} min gradual`, `${md.minutes || 10} min geleidelijk`) : (n === 1 ? L('1 light', '1 lamp') : L(`${n} lights`, `${n} lampen`))}</span></button>
<button class="m-edit" data-wact="mood-edit" data-room="${esc(r.id)}" data-v="${esc(md.id)}" aria-label="${L('Edit mood', 'Mood aanpassen')}">${ic('pencil')}</button>${running ? `<button class="m-stop" data-wact="mood-stop">${L('Stop', 'Stop')}</button>` : ''}</div>`; }).join('')}
<button class="m-card m-new" data-wact="mood-new" data-room="${esc(r.id)}">${ic('plus')}<b>${L('New mood', 'Nieuwe mood')}</b></button></div>`;
      return core.panel('Moods', body, 'm-sec');
    }
    /* ---------- editor ---------- */
    let E = null; // { room, md (copy), isNew }
    function edit(r, id) {
      const list = moodsOf(r); const md = id ? list.find((x) => x.id === id) : null;
      const base = md || { id: 'm' + Date.now().toString(36), key: 'custom', name: L('My mood', 'Mijn mood'), trans: 2, lights: {} };
      E = { room: r.id, md: JSON.parse(JSON.stringify(base)), isNew: !md };
      moodsOf({ id: r.id, name: r.name, devs: r.devs }); roomLights(r).forEach((e) => { if (!E.md.lights[e]) E.md.lights[e] = Object.assign(cfg(e, true, 60, 2700), { use: false }); });
      core.openSheet('__wmood');
    }
    const HUES = [0, 12, 25, 40, 55, 120, 200, 270, 320];
    function sheetHTML() {
      if (!E) return '';
      const md = E.md; const r = core.model().roomById[E.room]; const ls = r ? lightKeys(r, md) : Object.keys(md.lights); const own = r ? roomLights(r) : [];
      let b = `<div class="scrim" data-act="close-sheet" data-k="scrim"></div><div class="sheet m-sheet" role="dialog" aria-modal="true" aria-label="Mood" data-k="sheet-wmood"><div class="grab"></div><div class="sh"><span class="dico" style="background:var(--accent-soft);color:var(--accent)">${ic('pencil')}</span><div class="t"><b>${E.isNew ? L('New mood', 'Nieuwe mood') : L('Edit mood', 'Mood aanpassen')}</b><span>${esc(r ? r.name : '')}</span></div><button class="star" data-act="close-sheet" aria-label="Close">${ic('x')}</button></div>`;
      b += `<div class="m-form"><label class="m-row"><span>${L('Name', 'Naam')}</span><input type="text" data-win="m-name" value="${esc(md.name)}" maxlength="30"></label>`;
      b += md.wake ? `<label class="m-row"><span>${L('Duration (from warm & dim to full)', 'Duur (van warm en zacht naar vol)')}</span><select data-win="m-min">${[5, 10, 15, 20, 30, 45].map((v) => `<option value="${v}" ${+md.minutes === v ? 'selected' : ''}>${v} min</option>`).join('')}</select></label>`
        : `<label class="m-row"><span>${L('Transition', 'Overgang')}</span><select data-win="m-trans">${[0, 1, 2, 3, 5, 10, 20, 30].map((v) => `<option value="${v}" ${+md.trans === v ? 'selected' : ''}>${v} s</option>`).join('')}</select></label>`;
      b += `<div class="m-lights">${ls.map((e) => { const c = md.lights[e]; const cp = caps(e); const nm = core.nameOf(e);
        return `<div class="m-l${c.use ? ' use' : ''}" data-k="ml-${esc(e)}"><div class="m-lh"><label class="m-chk"><input type="checkbox" data-win="m-use" data-eid="${esc(e)}" ${c.use ? 'checked' : ''}><span>${esc(nm)}${own.indexOf(e) < 0 ? `<small class="m-from">${esc(core.roomNameOf(e) || L('other room', 'andere kamer'))}</small>` : ''}</span></label>${own.indexOf(e) < 0 ? `<button class="m-rm" data-wact="m-rm" data-eid="${esc(e)}" aria-label="${L('Remove', 'Verwijderen')}">${ic('x')}</button>` : ''}${c.use ? `<div class="m-seg"><button class="${c.on ? 'on' : ''}" data-wact="m-on" data-eid="${esc(e)}" data-v="1">${L('On', 'Aan')}</button><button class="${!c.on ? 'on' : ''}" data-wact="m-on" data-eid="${esc(e)}" data-v="0">${L('Off', 'Uit')}</button></div>` : ''}</div>
${c.use && c.on ? `${cp.bri ? `<label class="m-sl"><span>${L('Brightness', 'Helderheid')} <b>${Math.round(c.bri)}%</b></span><input type="range" min="1" max="100" value="${Math.round(c.bri)}" data-win="m-bri" data-eid="${esc(e)}"></label>` : ''}
${cp.color && cp.ct ? `<div class="m-seg m-mode"><button class="${c.mode === 'ct' ? 'on' : ''}" data-wact="m-mode" data-eid="${esc(e)}" data-v="ct">${L('White', 'Wit')}</button><button class="${c.mode === 'color' ? 'on' : ''}" data-wact="m-mode" data-eid="${esc(e)}" data-v="color">${L('Colour', 'Kleur')}</button></div>` : ''}
${(c.mode === 'ct' || !cp.color) && cp.ct ? `<label class="m-sl"><span>${L('Colour temperature', 'Kleurtemperatuur')} <b>${Math.round(c.ct)} K</b></span><input type="range" class="m-ct" min="2200" max="6500" step="100" value="${Math.round(c.ct)}" data-win="m-ct" data-eid="${esc(e)}"></label>` : ''}
${c.mode === 'color' && cp.color ? `<div class="m-hues">${HUES.map((h) => `<button class="m-hue${Math.abs(c.hs[0] - h) < 3 ? ' on' : ''}" style="background:hsl(${h},85%,55%)" data-wact="m-hue" data-eid="${esc(e)}" data-v="${h}" aria-label="${h}"></button>`).join('')}</div>` : ''}` : ''}</div>`; }).join('')}</div>`;
      const dv = devsOf(md);
      if (dv.length) b += `<div class="m-lights">${dv.map((e) => { const c = md.devs[e]; const d = e.split('.')[0]; const once = d === 'scene' || d === 'script';
        return `<div class="m-l${c.use ? ' use' : ''}" data-k="md-${esc(e)}"><div class="m-lh"><label class="m-chk"><input type="checkbox" data-win="m-duse" data-eid="${esc(e)}" ${c.use ? 'checked' : ''}><span>${esc(core.nameOf(e))}<small class="m-from">${esc(core.roomNameOf(e) || e)}</small></span></label><button class="m-rm" data-wact="m-rm" data-eid="${esc(e)}" aria-label="${L('Remove', 'Verwijderen')}">${ic('x')}</button>
${c.use ? (once ? `<span class="m-once">${L('runs', 'start')}</span>` : `<div class="m-seg"><button class="${c.on !== false ? 'on' : ''}" data-wact="m-don" data-eid="${esc(e)}" data-v="1">${d === 'cover' ? L('Open', 'Open') : L('On', 'Aan')}</button><button class="${c.on === false ? 'on' : ''}" data-wact="m-don" data-eid="${esc(e)}" data-v="0">${d === 'cover' ? L('Close', 'Dicht') : L('Off', 'Uit')}</button></div>`) : ''}</div></div>`; }).join('')}</div>`;
      if (E.pick) {
        const m = core.model(); const q = (E.q || '').toLowerCase();
        const cand = m.controls.filter((e) => DEV_KINDS.indexOf(m.kind[e]) >= 0 && S.states[e] && ls.indexOf(e) < 0 && !(md.devs || {})[e] && (!q || (core.nameOf(e) + ' ' + e + ' ' + core.roomNameOf(e)).toLowerCase().indexOf(q) >= 0))
          .sort((x, y) => (m.kind[x] === 'light' ? 0 : 1) - (m.kind[y] === 'light' ? 0 : 1) || core.nameOf(x).localeCompare(core.nameOf(y))).slice(0, 60);
        b += `<div class="m-pick" data-k="m-pick"><label class="m-row"><span>${L('Add a device to this mood', 'Apparaat toevoegen aan deze mood')}</span><input type="text" data-win="m-q" value="${esc(E.q || '')}" placeholder="${L('Search…', 'Zoeken…')}" autocomplete="off"></label>
<div class="w-alist2">${cand.map((e) => `<button class="w-arow" data-wact="m-add" data-eid="${esc(e)}" data-k="mp-${esc(e)}"><span class="w-si">${ic(core.devIcon(e, S.states[e]))}</span><span class="w-sl">${esc(core.nameOf(e))}<small>${esc(e)}${core.roomNameOf(e) ? ' · ' + esc(core.roomNameOf(e)) : ''}</small></span><span class="w-ack">${ic('plus')}</span></button>`).join('') || `<p class="w-empty" style="padding:10px 2px">${L('Nothing found.', 'Niets gevonden.')}</p>`}</div></div>`;
      } else b += `<button class="btn m-addbtn" data-wact="m-pick">${ic('plus')}${L('Add device', 'Apparaat toevoegen')}</button>`;
      b += `<div class="m-btns"><button class="btn" data-wact="m-test">${ic('play')}${L('Try', 'Proberen')}</button><button class="btn pri" data-wact="m-save">${ic('ok')}${L('Save', 'Opslaan')}</button></div>
<div class="m-btns"><button class="btn" data-act="close-sheet">${L('Cancel', 'Annuleren')}</button>${!E.isNew ? `<button class="btn danger" data-wact="m-del">${ic('x')}${L('Delete', 'Verwijderen')}</button>` : ''}</div></div></div>`;
      return b;
    }
    function persist(list) { S.ud.moods = Object.assign({}, S.ud.moods || {}); S.ud.moods[E.room] = list; return core.saveUD(); }
    function onAct(a, el) {
      const r = el.dataset.room && core.model().roomById[el.dataset.room];
      if (a === 'mood-apply' && r) { const md = moodsOf(r).find((x) => x.id === el.dataset.v); if (md) apply(r, md); return true; }
      if (a === 'mood-edit' && r) { edit(r, el.dataset.v); return true; }
      if (a === 'mood-new' && r) { edit(r, null); return true; }
      if (a === 'mood-stop') { stopRamp(L('Wake Up stopped', 'Wake Up gestopt')); return true; }
      if (!E) return false;
      const e = el.dataset.eid; const c = e && E.md.lights[e];
      if (a === 'm-on' && c) { c.on = el.dataset.v === '1'; core.schedule(true); return true; }
      if (a === 'm-mode' && c) { c.mode = el.dataset.v; core.schedule(true); return true; }
      if (a === 'm-hue' && c) { c.hs = [+el.dataset.v, 88]; core.schedule(true); return true; }
      if (a === 'm-pick') { E.pick = true; E.q = ''; core.schedule(true); return true; }
      if (a === 'm-add') { const id = el.dataset.eid; const m = core.model();
        if (m.kind[id] === 'light') E.md.lights[id] = cfg(id, true, 70, 2700); else { E.md.devs = Object.assign({}, E.md.devs || {}); E.md.devs[id] = { use: true, on: true }; }
        E.pick = false; core.schedule(true); return true; }
      if (a === 'm-rm') { const id = el.dataset.eid; if (E.md.devs && E.md.devs[id]) delete E.md.devs[id]; else delete E.md.lights[id]; core.schedule(true); return true; }
      if (a === 'm-don') { const d = (E.md.devs || {})[el.dataset.eid]; if (d) { d.on = el.dataset.v === '1'; core.schedule(true); } return true; }
      if (a === 'm-test') { const rr = core.model().roomById[E.room]; if (rr) apply(rr, E.md); return true; }
      if (a === 'm-save') { const rr = core.model().roomById[E.room]; const list = moodsOf(rr).map((x) => JSON.parse(JSON.stringify(x))); const i = list.findIndex((x) => x.id === E.md.id); if (i >= 0) list[i] = E.md; else list.push(E.md); persist(list); E = null; core.closeSheet(); core.toast(L('Mood saved', 'Mood opgeslagen'), 'ok'); return true; }
      if (a === 'm-del') { if (!window.confirm(L('Delete this mood?', 'Deze mood verwijderen?'))) return true; const rr = core.model().roomById[E.room]; persist(moodsOf(rr).filter((x) => x.id !== E.md.id).map((x) => JSON.parse(JSON.stringify(x)))); E = null; core.closeSheet(); return true; }
      return false;
    }
    function onInput(k, el) {
      if (!E) return false; const e = el.dataset.eid; const c = e && E.md.lights[e];
      if (k === 'm-name') { E.md.name = el.value.slice(0, 30) || E.md.name; return true; }
      if (k === 'm-trans') { E.md.trans = +el.value; return true; }
      if (k === 'm-min') { E.md.minutes = +el.value; return true; }
      if (k === 'm-q') { E.q = el.value; core.schedule(true); return true; }
      if (k === 'm-duse') { const d = (E.md.devs || {})[e]; if (d) { d.use = el.checked; core.schedule(true); } return true; }
      if (k === 'm-use' && c) { c.use = el.checked; core.schedule(true); return true; }
      if (k === 'm-bri' && c) { c.bri = +el.value; const b = el.parentNode.querySelector('b'); if (b) b.textContent = el.value + '%'; return true; }
      if (k === 'm-ct' && c) { c.ct = +el.value; const b = el.parentNode.querySelector('b'); if (b) b.textContent = el.value + ' K'; return true; }
      return false;
    }
    function active(r) { const id = (S.moodLast || {})[r.id]; return id ? moodsOf(r).find((x) => x.id === id) || null : null; }
    return { sectionHTML, sheetHTML, onAct, onInput, roomLights, running: () => ramp, active, sceneOf };
  };
})();
