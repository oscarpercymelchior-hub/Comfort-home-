/* Comfort Home – extras for the iPad and Laptop layouts (separate module):
   - Decorations (seasonal themes with preview) – never on the iPhone layout
   - Calendar (month / week / day) from real Home Assistant calendar entities
   - Auto-update: devices that stay open (wall iPad, phone) reload themselves when a new version is on GitHub
   Safari 12 friendly: no flex gap, only transform/opacity animations, no blur, few animated elements. */
(function () {
  'use strict';
  window.ComfortExtra = function (core) {
    const { S, settings, ic, esc } = core;
    const nl = () => settings.lang === 'nl' || (settings.lang !== 'en' && settings.lang !== 'mc' && /^nl/i.test(navigator.language || ''));
    const L = (en, du) => (nl() ? du : en);
    const BASE = window.__COMFORT_BASE || 'https://oscarpercymelchior-hub.github.io/Comfort-home-/';

    /* =============================== DECORATIONS =============================== */
    const DECOS = [
      ['none', () => L('No decoration (standard)', 'Geen decoratie (standaard)'), ''],
      ['xmas', () => L('Christmas', 'Kerst'), '🎄'],
      ['halloween', () => 'Halloween', '🎃'],
      ['easter', () => L('Easter', 'Pasen'), '🐣'],
      ['newyear', () => L('New Year', 'Oud en Nieuw'), '🥂'],
      ['birthday', () => L('Birthday', 'Verjaardag'), '🎈']
    ];
    let decoNow = null;
    const allowed = (eff) => eff === 'ipad' || eff === 'laptop';
    function pieces(kind, n, f) { let s = ''; for (let i = 0; i < n; i++) s += f(i); return s; }
    function overlayHTML(d) {
      // deterministic positions (no Math.random → no layout jumps on re-render)
      const pos = (i, n) => ((i * 61) % 97) / 97 * 100;
      if (d === 'xmas') return `<div class="dc-garland">${pieces('b', 18, (i) => `<i style="left:${(i + 0.5) / 18 * 100}%;-webkit-animation-delay:${(i % 4) * 0.6}s;animation-delay:${(i % 4) * 0.6}s" class="c${i % 4}"></i>`)}</div>`
        + pieces('s', 12, (i) => `<span class="dc-snow" style="left:${pos(i)}%;-webkit-animation-duration:${11 + (i % 5) * 2}s;animation-duration:${11 + (i % 5) * 2}s;-webkit-animation-delay:-${i * 1.7}s;animation-delay:-${i * 1.7}s">❄</span>`);
      if (d === 'halloween') return `<span class="dc-corner tl">🦇</span><span class="dc-corner tr dc-float">🦇</span><span class="dc-corner br">🎃</span><div class="dc-glow"></div>`;
      if (d === 'easter') return `<span class="dc-corner tl">🌷</span><span class="dc-corner tr">🐣</span><span class="dc-corner br">🥚</span><div class="dc-glow"></div>`;
      if (d === 'newyear') return `<span class="dc-corner tr">✨</span><span class="dc-corner br">🥂</span>` + pieces('c', 14, (i) => `<span class="dc-conf c${i % 5}" style="left:${pos(i)}%;-webkit-animation-duration:${9 + (i % 4) * 2}s;animation-duration:${9 + (i % 4) * 2}s;-webkit-animation-delay:-${i * 1.3}s;animation-delay:-${i * 1.3}s"></span>`);
      if (d === 'birthday') return pieces('b', 3, (i) => `<span class="dc-balloon" style="left:${12 + i * 37}%;-webkit-animation-duration:${16 + i * 4}s;animation-duration:${16 + i * 4}s;-webkit-animation-delay:-${i * 5}s;animation-delay:-${i * 5}s">🎈</span>`)
        + pieces('c', 10, (i) => `<span class="dc-conf c${i % 5}" style="left:${pos(i)}%;-webkit-animation-duration:${10 + (i % 4) * 2}s;animation-duration:${10 + (i % 4) * 2}s;-webkit-animation-delay:-${i * 1.5}s;animation-delay:-${i * 1.5}s"></span>`);
      return '';
    }
    function applyDeco(eff) {
      const pv = S.decoPreview || null;
      const d = allowed(eff) ? (pv || settings.deco || 'none') : 'none';
      const key = d + '|' + (pv ? 1 : 0) + '|' + settings.lang;
      if (key === decoNow) return; decoNow = key;
      const h = document.documentElement;
      DECOS.forEach(([id]) => h.classList.remove('deco-' + id)); if (d !== 'none') h.classList.add('deco-' + d);
      let box = document.getElementById('deco');
      if (!box) { box = document.createElement('div'); box.id = 'deco'; box.setAttribute('aria-hidden', 'true'); document.body.appendChild(box); }
      box.innerHTML = d === 'none' ? '' : overlayHTML(d);
      let bar = document.getElementById('deco-preview');
      if (pv && allowed(eff)) {
        if (!bar) { bar = document.createElement('div'); bar.id = 'deco-preview'; document.body.appendChild(bar); }
        const lbl = (DECOS.find((x) => x[0] === pv) || DECOS[0])[1]();
        bar.innerHTML = `<span>${L('Preview', 'Voorbeeld')}: <b>${esc(lbl)}</b></span><button data-xact="deco-apply">${L('Apply', 'Toepassen')}</button><button class="ghost" data-xact="deco-cancel">${L('Cancel', 'Annuleren')}</button>`;
      } else if (bar) bar.parentNode.removeChild(bar);
    }
    function decoSettingsHTML(eff) {
      if (!allowed(eff)) return '';
      const cur = settings.deco || 'none'; const pv = S.decoPreview;
      return `<div class="sec-h" style="margin-top:24px"><h2>Decorations</h2><span class="aux">${eff === 'ipad' ? 'iPad' : 'Laptop'}</span></div><div class="card set" data-k="decoset"><div class="blk">
<p class="meta-sm" style="margin:0 0 12px">${L('Tap a theme to preview it, then choose Apply. Decorations never block buttons.', 'Tik op een thema voor een voorbeeld en kies dan Toepassen. Decoraties zitten de bediening nooit in de weg.')}</p>
<div class="deco-grid">${DECOS.map(([id, lbl, emo]) => `<button class="deco-opt${cur === id ? ' cur' : ''}${pv === id ? ' pv' : ''}" data-xact="deco-preview" data-v="${id}" data-k="deco-${id}"><span class="deco-sw deco-sw-${id}">${emo || '◻︎'}</span><span class="deco-l">${esc(lbl())}</span>${cur === id ? `<span class="deco-cur">${L('Active', 'Actief')}</span>` : ''}</button>`).join('')}</div></div></div>`;
    }

    /* ================================= CALENDAR ================================= */
    const CAL = { view: 'month', date: startOfDay(new Date()), cache: {}, upcoming: null, loading: {} };
    function startOfDay(d) { const x = new Date(d); x.setHours(0, 0, 0, 0); return x; }
    const addDays = (d, n) => { const x = new Date(d); x.setDate(x.getDate() + n); return x; };
    const sameDay = (a, b) => a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate();
    const monday = (d) => { const x = startOfDay(d); const wd = (x.getDay() + 6) % 7; return addDays(x, -wd); };
    const ymd = (d) => d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0');
    const locale = () => (nl() ? 'nl-NL' : undefined);
    const calendars = () => Object.keys(S.states).filter((e) => e.startsWith('calendar.')).sort();
    const COLORS = ['#c79a6b', '#38bdf8', '#a78bfa', '#34d399', '#f59e0b', '#f472b6'];
    function range() {
      const d = CAL.date;
      if (CAL.view === 'day') return [startOfDay(d), addDays(startOfDay(d), 1)];
      if (CAL.view === 'week') { const m = monday(d); return [m, addDays(m, 7)]; }
      const first = new Date(d.getFullYear(), d.getMonth(), 1); const s = monday(first); return [s, addDays(s, 42)];
    }
    function parseEv(ev, cal, ci) {
      const allDay = !!(ev.start && ev.start.date && !ev.start.dateTime);
      const s = allDay ? new Date(ev.start.date + 'T00:00:00') : new Date(ev.start.dateTime || ev.start);
      const e = allDay ? new Date((ev.end && ev.end.date ? ev.end.date : ev.start.date) + 'T00:00:00') : new Date((ev.end && (ev.end.dateTime || ev.end)) || s);
      return { s, e, allDay, title: ev.summary || L('(no title)', '(geen titel)'), loc: ev.location || '', cal, color: COLORS[ci % COLORS.length] };
    }
    /* ---- school timetable from Zermelo (zportal.nl). The one-time "koppelcode" is exchanged for a token,
       which stays on this device only (like the Home Assistant login). Lessons appear in the calendar automatically. ---- */
    const ZM = { err: '', busy: false };
    const zget = () => { try { const z = JSON.parse(localStorage.getItem('ch.zermelo') || 'null'); return z && z.school && z.token ? z : null; } catch (e) { return null; } };
    function zreq(method, url, body) {
      return new Promise((ok, bad) => { const x = new XMLHttpRequest(); x.open(method, url, true); x.timeout = 12000;
        if (body) x.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
        x.onload = () => { if (x.status >= 200 && x.status < 300) { try { ok(JSON.parse(x.responseText)); } catch (e) { bad(new Error('bad response')); } } else bad(new Error(x.status === 401 || x.status === 403 ? L('Zermelo refused the code/token', 'Zermelo weigerde de code/token') : 'HTTP ' + x.status)); };
        x.onerror = () => bad(new Error(L('Zermelo not reachable from this device', 'Zermelo niet bereikbaar vanaf dit apparaat'))); x.ontimeout = () => bad(new Error('timeout')); x.send(body || null); });
    }
    function zconnect(school, code) {
      school = String(school || '').trim().toLowerCase().replace(/^https?:\/\//, '').replace(/\.zportal\.nl.*$/, ''); code = String(code || '').replace(/\s+/g, '');
      if (!/^[a-z0-9-]{2,40}$/.test(school)) { ZM.err = L('Fill in the school name as in the Zermelo address (e.g. "myschool" from myschool.zportal.nl).', 'Vul de schoolnaam in zoals in het Zermelo-adres (bijv. "mijnschool" uit mijnschool.zportal.nl).'); core.schedule(true); return; }
      if (!/^[0-9a-z]{6,40}$/i.test(code)) { ZM.err = L('Fill in the code from Zermelo (Koppelingen → Koppel App).', 'Vul de koppelcode uit Zermelo in (Koppelingen → Koppel App).'); core.schedule(true); return; }
      ZM.busy = true; ZM.err = ''; core.schedule(true);
      zreq('POST', 'https://' + school + '.zportal.nl/api/v3/oauth/token', 'grant_type=authorization_code&code=' + encodeURIComponent(code))
        .then((r) => { if (!r.access_token) throw new Error('no token'); localStorage.setItem('ch.zermelo', JSON.stringify({ school, token: r.access_token })); ZM.busy = false; CAL.cache = {}; core.toast(L('School timetable connected', 'Schoolrooster gekoppeld'), 'ok'); core.schedule(true); })
        .catch((e) => { ZM.busy = false; ZM.err = e.message; core.schedule(true); });
    }
    function zfetch(a, b) {
      const z = zget(); if (!z) return Promise.resolve([]);
      const url = 'https://' + z.school + '.zportal.nl/api/v3/appointments?user=~me&valid=true&start=' + Math.floor(a / 1000) + '&end=' + Math.floor(b / 1000) + '&fields=start,end,subjects,locations,teachers,cancelled,changeDescription,appointmentType,groups&access_token=' + encodeURIComponent(z.token);
      return zreq('GET', url).then((r) => (((r || {}).response || {}).data || []).map((x) => {
        const subj = (x.subjects || []).join(', ').toUpperCase() || (x.appointmentType === 'activity' ? L('Activity', 'Activiteit') : L('Lesson', 'Les'));
        return { s: new Date(x.start * 1000), e: new Date(x.end * 1000), allDay: false, title: subj + (x.cancelled ? ' · ' + L('cancelled', 'vervalt') : ''), loc: [(x.locations || []).join(', '), (x.teachers || []).join(', ')].filter(Boolean).join(' · ') + (x.changeDescription ? ' · ' + x.changeDescription : ''), cal: 'zermelo', color: x.cancelled ? '#9ca3af' : '#e05a4f', school: true, cancelled: !!x.cancelled };
      })).catch((e) => { ZM.err = e.message; return []; });
    }
    function fetchRange(a, b, key, cb) {
      const cals = calendars(); if ((!cals.length && !zget()) || CAL.loading[key]) return;
      const c = CAL.cache[key]; if (c && Date.now() - c.at < 5 * 60e3) return;
      CAL.loading[key] = true;
      Promise.all(cals.map((cal, ci) => core.api('GET', 'calendars/' + cal + '?start=' + encodeURIComponent(a.toISOString()) + '&end=' + encodeURIComponent(b.toISOString()))
        .then((list) => (list || []).map((ev) => parseEv(ev, cal, ci))).catch((er) => { CAL.err = er.message; return []; })).concat([zfetch(a, b)]))
        .then((lists) => { const all = [].concat.apply([], lists).sort((x, y) => x.s - y.s); CAL.cache[key] = { at: Date.now(), ev: all }; CAL.loading[key] = false; if (cb) cb(all); core.schedule(true); });
    }
    function evsOn(day, evs) { const d0 = startOfDay(day), d1 = addDays(d0, 1); return evs.filter((x) => x.s < d1 && (x.e > d0 || (x.allDay ? false : sameDay(x.s, d0)))); }
    const hm = (d) => String(d.getHours()).padStart(2, '0') + ':' + String(d.getMinutes()).padStart(2, '0');
    function title() {
      const d = CAL.date;
      if (CAL.view === 'day') return d.toLocaleDateString(locale(), { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });
      if (CAL.view === 'week') { const m = monday(d), e = addDays(m, 6); return d.toLocaleDateString(locale(), { month: 'long', year: 'numeric' }) + ' · ' + L('week of ', 'week van ') + m.getDate() + '–' + e.getDate() + (e.getMonth() !== m.getMonth() ? ' ' + e.toLocaleDateString(locale(), { month: 'short' }) : ''); }
      return d.toLocaleDateString(locale(), { month: 'long', year: 'numeric' });
    }
    const evChip = (x) => `<span class="cal-ev" style="border-left-color:${x.color}"><b>${x.allDay ? '' : hm(x.s) + ' '}</b>${esc(x.title)}</span>`;
    function calendarHTML(wall) {
      calendars().forEach((e) => core.st(e));
      const [a, b] = range(); const key = CAL.view + ymd(a);
      fetchRange(a, b, key);
      const today = startOfDay(new Date());
      const upKey = 'up' + ymd(today); fetchRange(today, addDays(today, 30), upKey);
      const evs = (CAL.cache[key] && CAL.cache[key].ev) || []; const up = ((CAL.cache[upKey] && CAL.cache[upKey].ev) || []).filter((x) => x.e >= new Date()).slice(0, 12);
      const noCal = !calendars().length && !zget(); const z = zget();
      const days = nl() ? ['ma', 'di', 'wo', 'do', 'vr', 'za', 'zo'] : ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
      let body = '';
      if (CAL.view === 'month') {
        body = `<div class="cal-month"><div class="cal-dow">${days.map((d) => `<span>${d}</span>`).join('')}</div><div class="cal-grid">${pieces('d', 42, (i) => { const d = addDays(a, i); const es = evsOn(d, evs); const out = d.getMonth() !== CAL.date.getMonth();
          return `<button class="cal-cell${out ? ' out' : ''}${sameDay(d, today) ? ' today' : ''}${sameDay(d, CAL.date) ? ' sel' : ''}" data-xact="cal-day" data-v="${ymd(d)}"><span class="cal-dn">${d.getDate()}</span>${es.slice(0, 2).map(evChip).join('')}${es.length > 2 ? `<span class="cal-more">+${es.length - 2}</span>` : ''}</button>`; })}</div></div>`;
      } else if (CAL.view === 'week') {
        body = `<div class="cal-week">${pieces('w', 7, (i) => { const d = addDays(a, i); const es = evsOn(d, evs);
          return `<div class="cal-wd${sameDay(d, today) ? ' today' : ''}"><button class="cal-wh" data-xact="cal-day" data-v="${ymd(d)}"><span>${days[i]}</span><b>${d.getDate()}</b></button><div class="cal-wl">${es.map(evChip).join('') || '<span class="cal-none">—</span>'}</div></div>`; })}</div>`;
      } else {
        const es = evsOn(CAL.date, evs);
        body = `<div class="cal-day">${es.length ? es.map((x) => `<div class="cal-item" style="border-left-color:${x.color}"><span class="cal-time">${x.allDay ? L('All day', 'Hele dag') : hm(x.s) + ' – ' + hm(x.e)}</span><b>${esc(x.title)}</b>${x.loc ? `<span class="cal-loc">${esc(x.loc)}</span>` : ''}</div>`).join('') : `<p class="cal-empty">${noCal ? L('No calendar connected yet.', 'Nog geen agenda gekoppeld.') : L('No appointments on this day.', 'Geen afspraken op deze dag.')}</p>`}</div>`;
      }
      const head = `<div class="cal-head"><div class="cal-nav"><button class="cal-btn" data-xact="cal-prev" aria-label="${L('Previous', 'Vorige')}">${ic('back')}</button><button class="cal-btn today" data-xact="cal-today">${L('Today', 'Vandaag')}</button><button class="cal-btn" data-xact="cal-next" aria-label="${L('Next', 'Volgende')}"><span class="cal-flip">${ic('back')}</span></button><h2 class="cal-title">${esc(title())}</h2></div>
<div class="cal-tools"><input type="date" class="cal-date" data-xin="cal-date" value="${ymd(CAL.date)}" aria-label="${L('Choose date', 'Kies datum')}"><div class="cal-seg">${[['month', L('Month', 'Maand')], ['week', L('Week', 'Week')], ['day', L('Day', 'Dag')]].map(([v, l]) => `<button class="${CAL.view === v ? 'on' : ''}" data-xact="cal-view" data-v="${v}">${l}</button>`).join('')}</div></div></div>`;
      const info = noCal ? `<div class="cal-info">${ic('info')}<div><b>${L('No calendar in Home Assistant yet', 'Nog geen agenda in Home Assistant')}</b><span>${L('Add a calendar integration in Home Assistant (for example Local Calendar or Google Calendar). Your appointments then appear here automatically.', 'Voeg in Home Assistant een agenda-integratie toe (bijvoorbeeld Lokale agenda of Google Agenda). Je afspraken verschijnen dan hier vanzelf.')}</span></div></div>` : CAL.err ? `<div class="cal-info bad">${ic('alert')}<div><b>${L('Could not load appointments', 'Afspraken laden lukte niet')}</b><span>${esc(CAL.err)}</span></div></div>` : '';
      const side = `<aside class="cal-side"><h3>${L('Upcoming', 'Binnenkort')}</h3>${noCal ? `<p class="cal-empty">${L('Nothing to show yet.', 'Nog niets om te tonen.')}</p>` : up.length ? up.map((x) => `<div class="cal-up" style="border-left-color:${x.color}"><span>${esc(x.s.toLocaleDateString(locale(), { weekday: 'short', day: 'numeric', month: 'short' }))}${x.allDay ? '' : ' · ' + hm(x.s)}</span><b>${esc(x.title)}</b></div>`).join('') : `<p class="cal-empty">${CAL.cache[upKey] ? L('No appointments in the next 30 days.', 'Geen afspraken in de komende 30 dagen.') : L('Loading…', 'Laden…')}</p>`}</aside>`;
      const zbox = z ? `<div class="cal-zm on">${ic('office')}<div><b>${L('School timetable', 'Schoolrooster')} · ${esc(z.school)}</b><span>${ZM.err ? esc(ZM.err) : L('Lessons from Zermelo appear automatically (red; grey = cancelled).', 'Lessen uit Zermelo staan er vanzelf in (rood; grijs = vervalt).')}</span></div><button class="cal-btn" data-xact="zm-off">${L('Disconnect', 'Ontkoppelen')}</button></div>`
        : `<details class="cal-zm"${ZM.err || ZM.open ? ' open' : ''}><summary>${ic('office')}<b>${L('Connect school timetable (Zermelo)', 'Schoolrooster koppelen (Zermelo)')}</b></summary><div class="cal-zf"><p>${L('In the Zermelo portal go to <b>Koppelingen → Koppel App</b> and copy the code. The school name is the first part of the address, e.g. <b>myschool</b>.zportal.nl.', 'Ga in het Zermelo-portaal naar <b>Koppelingen → Koppel App</b> en neem de code over. De schoolnaam is het eerste deel van het adres, bijv. <b>mijnschool</b>.zportal.nl.')}</p>
<div class="cal-zrow"><input type="text" data-xin="zm-school" placeholder="${L('school name', 'schoolnaam')}" autocomplete="off" autocapitalize="off" value="${esc(ZM.school || '')}"><input type="text" data-xin="zm-code" placeholder="${L('code', 'koppelcode')}" autocomplete="off" inputmode="numeric" value=""><button class="cal-btn today" data-xact="zm-on" ${ZM.busy ? 'disabled' : ''}>${ZM.busy ? L('Connecting…', 'Koppelen…') : L('Connect', 'Koppelen')}</button></div>${ZM.err ? `<p class="cal-zerr">${esc(ZM.err)}</p>` : ''}<p class="cal-zsm">${L('The code is used once; the token stays on this device only.', 'De code wordt één keer gebruikt; de token blijft alleen op dit apparaat.')}</p></div></details>`;
      const inner = `${info}${zbox}<div class="cal-wrap"><section class="cal-main">${head}${body}</section>${side}</div>`;
      if (wall) return `<div class="w-pagebar"><h1>${L('Calendar', 'Kalender')}</h1></div>${inner}`;
      return `<div class="page cal-page" data-k="p-calendar"><div class="topbar"><h1>${L('Calendar', 'Kalender')}</h1>${core.pill()}</div>${inner}</div>`;
    }

    /* ================================ events ================================ */
    document.addEventListener('click', (ev) => {
      const el = ev.target.closest && ev.target.closest('[data-xact]'); if (!el) return;
      const a = el.dataset.xact;
      if (a === 'deco-preview') { S.decoPreview = el.dataset.v === (settings.deco || 'none') ? null : el.dataset.v; decoNow = null; core.schedule(true); }
      else if (a === 'deco-apply') { if (S.decoPreview) settings.deco = S.decoPreview; S.decoPreview = null; core.saveSettings(); decoNow = null; core.schedule(true); core.toast(L('Decoration saved', 'Decoratie opgeslagen'), 'ok'); }
      else if (a === 'deco-cancel') { S.decoPreview = null; decoNow = null; core.schedule(true); }
      else if (a === 'zm-on') { const sc = document.querySelector('[data-xin=zm-school]'); const cd = document.querySelector('[data-xin=zm-code]'); ZM.school = sc ? sc.value : ''; zconnect(ZM.school, cd ? cd.value : ''); }
      else if (a === 'zm-off') { if (window.confirm(L('Disconnect the school timetable on this device?', 'Schoolrooster op dit apparaat ontkoppelen?'))) { localStorage.removeItem('ch.zermelo'); CAL.cache = {}; ZM.err = ''; core.schedule(true); } }
      else if (a === 'cal-view') { CAL.view = el.dataset.v; core.schedule(true); }
      else if (a === 'cal-today') { CAL.date = startOfDay(new Date()); core.schedule(true); }
      else if (a === 'cal-prev' || a === 'cal-next') { const k = a === 'cal-next' ? 1 : -1; const d = new Date(CAL.date); if (CAL.view === 'month') d.setMonth(d.getMonth() + k, 1); else d.setDate(d.getDate() + (CAL.view === 'week' ? 7 : 1) * k); CAL.date = startOfDay(d); core.schedule(true); }
      else if (a === 'cal-day') { const p = el.dataset.v.split('-').map(Number); CAL.date = new Date(p[0], p[1] - 1, p[2]); CAL.view = 'day'; core.schedule(true); }
    });
    document.addEventListener('change', (ev) => { const el = ev.target; if (el.dataset && el.dataset.xin === 'cal-date' && el.value) { const p = el.value.split('-').map(Number); CAL.date = new Date(p[0], p[1] - 1, p[2]); core.schedule(true); } });

    /* ============================== auto-update ============================== */
    // Devices that stay open for days (wall iPad, phone app) check GitHub for a new version and reload when idle.
    let lastAct = Date.now();
    document.addEventListener('touchstart', () => { lastAct = Date.now(); }, { passive: true }); document.addEventListener('mousedown', () => { lastAct = Date.now(); });
    function checkUpdate() {
      const x = new XMLHttpRequest();
      x.open('GET', BASE + 'version.json?t=' + Date.now(), true); x.timeout = 8000;
      x.onload = () => {
        try {
          const v = JSON.parse(x.responseText).version;
          if (v && v !== core.VERSION) {
            const busy = S.sheet || (document.activeElement && /INPUT|SELECT|TEXTAREA/.test(document.activeElement.tagName)) || Date.now() - lastAct < 60000;
            if (!busy) location.reload(); else setTimeout(checkUpdate, 90000);
          }
        } catch (e) { /* offline or no file */ }
      };
      x.send();
    }
    setTimeout(checkUpdate, 15000); setInterval(checkUpdate, 20 * 60e3);
    document.addEventListener('visibilitychange', () => { if (document.visibilityState === 'visible') setTimeout(checkUpdate, 3000); });

    return { applyDeco, decoSettingsHTML, calendarHTML, DECOS };
  };
})();
