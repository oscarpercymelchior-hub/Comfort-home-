/* Comfort Home – iPad Wall Panel (separate layout module).
   Only used when Settings → Device Layout = iPad (or automatically on the old iPad mini 2 build).
   It draws its own screens, but uses the app's existing Home Assistant connection, live data and
   controls (toggle, climate, sheets, automations) through the small "core" object app.js passes in.
   Written for Safari 12 / A7: no flex gap, no blur, only opacity/transform animations. */
(function () {
  'use strict';
  window.ComfortWall = function (core) {
    const { S, settings, t, ic, esc } = core;
    const nl = () => settings.lang === 'nl' || (settings.lang !== 'en' && settings.lang !== 'mc' && /^nl/i.test(navigator.language || ''));
    const L = (en, du) => (nl() ? du : en);
    const PAGES = [
      ['home', 'home', () => L('Overview', 'Overzicht')],
      ['lights', 'light', () => L('Lights', 'Verlichting')],
      ['climate', 'climate', () => L('Climate', 'Klimaat')],
      ['devices', 'devices', () => L('Devices', 'Apparaten')],
      ['sensors', 'thermo', () => L('Sensors', 'Sensoren')],
      ['autos', 'auto', () => L('Automations', 'Automations')]
    ];
    const W = { page: null, lastTouch: Date.now(), minute: -1, press: {} };
    const startPage = () => (PAGES.some((p) => p[0] === settings.wallStart) ? settings.wallStart : 'home');

    function active() {
      const lay = settings.layout || 'auto';
      if (lay === 'ipad') return true;
      if (lay !== 'auto') return false;
      const d = window.__COMFORT_DEVICE; // set by the iPad start page
      return !!(d && d.legacy && /iPad/.test(navigator.userAgent));
    }

    /* ------------ helpers on real Home Assistant data ------------ */
    const num = (e) => { const s = S.states[e]; if (!s || !core.avail(s)) return null; const v = parseFloat(s.state); return isFinite(v) ? v : null; };
    const dc = (e) => ((S.states[e] || {}).attributes || {}).device_class;
    function powerSensors() {
      return Object.keys(S.states).filter((e) => e.startsWith('sensor.') && dc(e) === 'power' && /^(W|kW)$/.test(S.states[e].attributes.unit_of_measurement || '') && num(e) != null && !(S.ents[e] || {}).disabled)
        .map((e) => ({ e, w: num(e) * (S.states[e].attributes.unit_of_measurement === 'kW' ? 1000 : 1) })).sort((a, b) => b.w - a.w);
    }
    function energyToday() {
      return Object.keys(S.states).filter((e) => e.startsWith('sensor.') && dc(e) === 'energy' && /daily|dag|today|vandaag/i.test(e + ' ' + (S.states[e].attributes.friendly_name || '')) && num(e) != null)
        .map((e) => ({ e, v: num(e), u: S.states[e].attributes.unit_of_measurement || 'kWh' }));
    }
    const IMPORTANT_BIN = ['door', 'window', 'opening', 'garage_door', 'motion', 'occupancy', 'smoke', 'moisture', 'gas', 'safety', 'problem'];
    function importantBins(m) {
      const out = []; m.rooms.forEach((r) => r.bins.forEach((e) => { if (IMPORTANT_BIN.indexOf(dc(e)) >= 0) out.push(e); }));
      return out;
    }
    function humAvg(m) { const v = m.hums.map(num).filter((x) => x != null && x > 0 && x <= 100); return v.length ? v.reduce((a, b) => a + b, 0) / v.length : null; }
    const lights = (m) => m.controls.filter((e) => m.kind[e] === 'light');
    const switches = (m) => m.controls.filter((e) => ['switch', 'plug', 'fan', 'cover', 'media', 'lock'].indexOf(m.kind[e]) >= 0);
    function keyDevices(m) {
      const fav = (settings.favorites || []).filter((e) => S.states[e] && m.kind[e] && m.kind[e] !== 'climate');
      if (fav.length) return fav.slice(0, 8);
      const on = (e) => core.isOn(e, S.states[e]);
      const ls = lights(m).filter((e) => core.avail(S.states[e])); const sw = switches(m).filter((e) => core.avail(S.states[e]) && ['switch', 'plug'].indexOf(m.kind[e]) >= 0);
      return ls.filter(on).concat(ls.filter((e) => !on(e))).slice(0, 5).concat(sw.slice(0, 3));
    }
    function fmtW(w) { return w >= 1000 ? (Math.round(w / 100) / 10).toString().replace('.', nl() ? ',' : '.') + ' kW' : Math.round(w) + ' W'; }
    const T = (v) => (v == null ? '—' : (Math.round(v * 10) / 10).toFixed(1).replace('.', nl() ? ',' : '.') + '°');
    const tempBig = (v) => { if (v == null) return '<span class="wv">—</span>'; const s = (Math.round(v * 10) / 10).toFixed(1).split('.'); return `<span class="wv">${s[0]}<small>${nl() ? ',' : '.'}${s[1]}°</small></span>`; };

    /* ------------ pieces ------------ */
    function topbar(m) {
      const now = new Date();
      const hh = String(now.getHours()).padStart(2, '0'); const mm = String(now.getMinutes()).padStart(2, '0');
      const date = now.toLocaleDateString(nl() ? 'nl-NL' : undefined, { weekday: 'long', day: 'numeric', month: 'long' });
      const out = core.outsideTemp(); const w = m.weather && core.st(m.weather);
      const cond = w && core.avail(w) ? String(w.state).replace(/-/g, ' ') : '';
      const WI = { sunny: 'sun', 'clear night': 'moon', cloudy: 'sunmoon', partlycloudy: 'sunmoon', rainy: 'drop', pouring: 'drop', snowy: 'snow', fog: 'sunmoon', lightning: 'bolt', 'lightning rainy': 'bolt', windy: 'wind' };
      const lamps = lights(m).filter((e) => core.isOn(e, core.st(e))).length;
      const acsOn = core.acList(m).filter((e) => core.isOn(e, core.st(e))).length;
      const unav = m.controls.filter((e) => !core.avail(S.states[e])).length;
      const conn = S.conn === 'connected' ? 'ok' : S.conn === 'error' || S.conn === 'auth_invalid' ? 'bad' : 'warn';
      const connTxt = S.conn === 'connected' ? L('Connected', 'Verbonden') : S.conn === 'reconnecting' ? L('Reconnecting', 'Opnieuw verbinden') : S.conn === 'idle' ? L('Not logged in', 'Niet ingelogd') : S.conn === 'error' ? L('No connection', 'Geen verbinding') : L('Connecting', 'Verbinden');
      return `<header class="w-top" data-k="w-top"><div class="w-clock"><span class="w-time num">${hh}<i class="w-colon">:</i>${mm}</span><span class="w-date">${esc(date)}</span></div>
<div class="w-weather">${out.v != null ? `<span class="w-wi">${ic(WI[cond] || 'sun')}</span><span class="w-out num">${T(out.v)}</span><span class="w-wl">${esc(cond ? cap(cond) : L('Outside', 'Buiten'))}</span>` : ''}</div>
<div class="w-stat"><span class="w-chip" title="${L('Lights on', 'Lampen aan')}">${ic('light')}<b class="num">${lamps}</b></span><span class="w-chip" title="${L('Air conditioners on', 'Airco’s aan')}">${ic('climate')}<b class="num">${acsOn}</b></span>${unav ? `<span class="w-chip warn">${ic('alert')}<b class="num">${unav}</b></span>` : ''}<span class="w-conn ${conn}"><i></i>${esc(connTxt)}</span></div></header>`;
    }
    const cap = (s) => s.charAt(0).toUpperCase() + s.slice(1);
    function rail() {
      const cur = W.page;
      return `<nav class="w-rail" data-k="w-rail" aria-label="Dashboard"><div class="w-logo" aria-hidden="true"><i></i></div>${PAGES.map(([id, icon, lbl]) => `<button class="w-nav${cur === id ? ' on' : ''}" data-wact="page" data-v="${id}" data-k="wn-${id}" aria-label="${esc(lbl())}" ${cur === id ? 'aria-current="page"' : ''}>${ic(icon)}<span>${esc(lbl())}</span></button>`).join('')}
<div class="w-rail-sp"></div><button class="w-nav${cur === 'settings' ? ' on' : ''}" data-wact="page" data-v="settings" data-k="wn-settings" aria-label="${L('Settings', 'Instellingen')}">${ic('settings')}<span>${L('Settings', 'Instellingen')}</span></button></nav>`;
    }
    function tile(e, big) {
      const s = core.st(e); if (!s) return '';
      const m = core.model(); const k = m.kind[e]; const on = core.isOn(e, s); const ok = core.avail(s);
      const bri = k === 'light' && on && s.attributes.brightness != null ? Math.round(s.attributes.brightness / 2.55) : null;
      const act = k === 'scene' || k === 'script' ? 'run' : ['light', 'plug', 'switch', 'fan', 'media', 'cover', 'lock'].indexOf(k) >= 0 ? 'toggle' : 'sheet';
      return `<div class="w-tile${on ? ' on' : ''}${ok ? '' : ' na'}${S.pending[e] ? ' busy' : ''}${big ? ' big' : ''}" data-k="wt-${esc(e)}">
<button class="w-tb" data-act="${act}" data-eid="${esc(e)}" ${ok ? '' : 'disabled'} aria-pressed="${on}" aria-label="${esc(core.nameOf(e))}"><span class="w-ti">${ic(core.devIcon(e, s))}</span><span class="w-tn">${esc(core.nameOf(e))}</span><span class="w-ts">${esc(ok ? core.stateText(e, s) : L('Unavailable', 'Niet beschikbaar'))}</span>${bri != null ? `<span class="w-bar"><i style="width:${bri}%"></i></span>` : ''}</button>
${ok && ['light', 'fan', 'cover', 'media'].indexOf(k) >= 0 ? `<button class="w-more" data-act="sheet" data-eid="${esc(e)}" aria-label="${L('More', 'Meer')}">${ic('settings')}</button>` : ''}</div>`;
    }
    function panel(title, body, cls, extra) { return `<section class="w-panel ${cls || ''}" data-k="wp-${esc(cls || title)}"><div class="w-ph"><h2>${esc(title)}</h2>${extra || ''}</div>${body}</section>`; }
    function acCard(e, compact) {
      const s = core.st(e); if (!s) return ''; const r = core.roomOfEid(e); const te = r ? core.mainTemp(r) : null; const rv = te ? core.tempOf(te) : null;
      const a = s.attributes; const on = core.isOn(e, s); const ok = core.avail(s) && S.conn === 'connected';
      const tgt = S.draft[e] ? S.draft[e].v : a.temperature != null ? +a.temperature : null;
      const mode = on ? (core.HVAC[s.state] || cap(s.state)) : L('Off', 'Uit');
      const name = core.shortRoom(r ? r.name : core.nameOf(e));
      if (compact) return `<button class="w-ac${on ? ' on m-' + esc(s.state) : ''}" data-wact="page" data-v="climate" data-k="wac-${esc(e)}" style="--tc:${core.tColor(rv)}"><span class="w-acn">${esc(name)}</span><span class="w-acv num">${T(rv)}</span><span class="w-acs">${esc(mode)}${on && tgt != null ? ' · ' + T(tgt) : ''}</span></button>`;
      const modes = (a.hvac_modes || []).filter((x) => ['heat', 'cool', 'dry', 'fan_only', 'auto', 'heat_cool'].indexOf(x) >= 0);
      const MI = { heat: 'flame', cool: 'snow', dry: 'drop', fan_only: 'fan', auto: 'auto', heat_cool: 'auto' };
      return `<div class="w-acc${on ? ' on m-' + esc(s.state) : ''}${S.pending[e] ? ' busy' : ''}" data-k="wacc-${esc(e)}" style="--tc:${core.tColor(rv)}">
<div class="w-acc-h"><div><b>${esc(name)}</b><span>${esc(mode)}${a.hvac_action && on ? ' · ' + esc(core.ACTION[a.hvac_action] || a.hvac_action) : ''}</span></div><button class="w-pwr${on ? ' on' : ''}" data-act="clim-power" data-eid="${esc(e)}" ${ok ? '' : 'disabled'} aria-label="${esc(name)} aan/uit" aria-pressed="${on}">${ic('power')}</button></div>
<div class="w-acc-m"><div class="w-room"><span class="w-lbl">${L('Room', 'Kamer')}</span>${tempBig(rv)}</div>
<div class="w-tgt"><button class="w-step" data-act="clim-step" data-eid="${esc(e)}" data-d="-1" ${ok && tgt != null ? '' : 'disabled'} aria-label="${L('Lower', 'Lager')}">${ic('minus')}</button><div class="w-tv"><span class="w-lbl">${L('Target', 'Doel')}</span><span class="num">${T(tgt)}</span></div><button class="w-step" data-act="clim-step" data-eid="${esc(e)}" data-d="1" ${ok && tgt != null ? '' : 'disabled'} aria-label="${L('Higher', 'Hoger')}">${ic('plus')}</button></div></div>
<div class="w-modes">${modes.map((x) => `<button class="w-mode${on && s.state === x ? ' on' : ''}" data-act="clim-mode" data-eid="${esc(e)}" data-v="${esc(x)}" ${ok ? '' : 'disabled'}>${ic(MI[x])}<span>${esc(core.HVAC[x] || x)}</span></button>`).join('')}</div></div>`;
    }
    function statusPanel(m) {
      const ht = core.houseTemp(); const out = core.outsideTemp(); const h = humAvg(m);
      const bins = importantBins(m); const openB = bins.filter((e) => S.states[e] && S.states[e].state === 'on');
      const pw = powerSensors(); const total = pw.reduce((a, b) => a + b.w, 0);
      const devOn = m.controls.filter((e) => ['scene', 'script'].indexOf(m.kind[e]) < 0 && core.isOn(e, S.states[e])).length;
      const unav = m.controls.filter((e) => !core.avail(S.states[e])).length;
      bins.forEach((e) => core.st(e)); pw.slice(0, 3).forEach((p) => core.st(p.e));
      const row = (icon, label, val, cls) => `<div class="w-sr ${cls || ''}"><span class="w-si">${ic(icon)}</span><span class="w-sl">${esc(label)}</span><span class="w-sv num">${val}</span></div>`;
      let b = `<div class="w-duo"><div><span class="w-lbl">${L('Inside', 'Binnen')}</span>${tempBig(ht.v)}</div><div><span class="w-lbl">${L('Outside', 'Buiten')}</span>${tempBig(out.v)}</div></div>`;
      b += row('drop', L('Humidity', 'Luchtvochtigheid'), h != null ? Math.round(h) + '%' : '—');
      b += row('power', L('Devices on', 'Apparaten aan'), String(devOn), devOn ? 'hl' : '');
      if (bins.length) b += row('window', L('Open / detected', 'Open / gedetecteerd'), openB.length ? String(openB.length) : L('none', 'geen'), openB.length ? 'warn' : 'ok');
      if (pw.length) b += row('bolt', L('Power now', 'Verbruik nu'), fmtW(total), 'hl');
      if (unav) b += row('alert', L('Unavailable', 'Niet beschikbaar'), String(unav), 'warn');
      if (openB.length) b += `<div class="w-alerts">${openB.slice(0, 4).map((e) => `<span>${ic('window')}${esc(core.nameOf(e))}</span>`).join('')}</div>`;
      return panel(L('Status', 'Status'), b, 'w-status');
    }
    function quick(m) {
      const scenes = m.controls.filter((e) => m.kind[e] === 'scene').slice(0, 2);
      const osc = core.oscEnt && core.oscEnt();
      return `<div class="w-quick" data-k="w-quick"><button class="w-q off" data-wact="alloff">${ic('power')}<span>${L('All off', 'Alles uit')}</span></button>
<button class="w-q" data-wact="page" data-v="lights">${ic('light')}<span>${L('Lighting', 'Verlichting')}</span></button>
<button class="w-q" data-wact="page" data-v="climate">${ic('climate')}<span>${L('Climate', 'Klimaat')}</span></button>
${osc ? `<button class="w-q${S.states[osc].state === 'on' ? ' on' : ''}" data-act="osc-toggle">${ic('flame')}<span>Oscar ${L('heating', 'verwarming')}</span></button>` : `<button class="w-q" data-wact="page" data-v="autos">${ic('auto')}<span>Automations</span></button>`}
${scenes.map((e) => `<button class="w-q" data-act="run" data-eid="${esc(e)}">${ic('auto')}<span>${esc(core.nameOf(e))}</span></button>`).join('')}</div>`;
    }

    /* ------------ pages ------------ */
    function pHome(m) {
      const acs = core.acList(m); const ht = core.houseTemp();
      const heroClim = acs.length ? `<div class="w-climhero"><div class="w-ch-l"><span class="w-lbl">${L('House', 'Huis')}</span>${tempBig(ht.v)}<span class="w-sub">${esc(ht.label || '')}</span></div><div class="w-acs">${acs.map((e) => acCard(e, true)).join('')}</div></div>` : '';
      const keys = keyDevices(m);
      let main = '';
      if (heroClim) main += panel(L('Climate', 'Klimaat'), heroClim, 'w-clim', `<button class="w-link" data-wact="page" data-v="climate">${L('Control', 'Bedienen')}${ic('chev')}</button>`);
      main += panel(L('Important devices', 'Belangrijke apparaten'), keys.length ? `<div class="w-tiles">${keys.map((e) => tile(e)).join('')}</div>` : `<p class="w-empty">${L('No devices found.', 'Geen apparaten gevonden.')}</p>`, 'w-keys', `<button class="w-link" data-wact="page" data-v="lights">${L('All lights', 'Alle lampen')}${ic('chev')}</button>`);
      return `<div class="w-grid-home"><div class="w-col-main">${main}${quick(m)}</div><div class="w-col-side">${statusPanel(m)}${energyPanel(m, true)}</div></div>`;
    }
    function energyPanel(m, small) {
      const pw = powerSensors(); const en = energyToday(); if (!pw.length && !en.length) return '';
      pw.slice(0, small ? 3 : 12).forEach((p) => core.st(p.e)); en.forEach((x) => core.st(x.e));
      const max = pw.length ? pw[0].w || 1 : 1;
      let b = pw.slice(0, small ? 3 : 12).map((p) => `<div class="w-en"><span class="w-enn">${esc(core.nameOf(p.e))}</span><span class="w-enb"><i style="width:${Math.max(2, Math.round(p.w / max * 100))}%"></i></span><span class="w-env num">${fmtW(p.w)}</span></div>`).join('');
      if (!small && en.length) b += `<div class="w-sub2">${L('Today', 'Vandaag')}</div>` + en.map((x) => `<div class="w-en"><span class="w-enn">${esc(core.nameOf(x.e))}</span><span class="w-env num">${(Math.round(x.v * 100) / 100).toString().replace('.', nl() ? ',' : '.')} ${esc(x.u)}</span></div>`).join('');
      return panel(L('Energy', 'Energie'), b, 'w-energy');
    }
    function pLights(m) {
      let out = ''; const groups = m.rooms.concat(m.unassigned ? [m.unassigned] : []).map((r) => [r, r.devs.filter((e) => m.kind[e] === 'light')]).filter((g) => g[1].length);
      if (!groups.length) return `<p class="w-empty">${L('No lights found in Home Assistant.', 'Geen lampen gevonden in Home Assistant.')}</p>`;
      const anyOn = lights(m).some((e) => core.isOn(e, core.st(e)));
      out += `<div class="w-pagebar"><h1>${L('Lighting', 'Verlichting')}</h1>${anyOn ? `<button class="w-btn" data-act="all-lights-off">${ic('power')}${L('All lights off', 'Alle lampen uit')}</button>` : ''}</div>`;
      out += groups.map(([r, ls]) => { const on = ls.some((e) => core.isOn(e, S.states[e])); return panel(t(r.name), `<div class="w-tiles">${ls.map((e) => tile(e)).join('')}</div>`, 'wl-' + r.id, r.id !== '_none' ? `<button class="w-link" data-act="room-lights" data-id="${esc(r.id)}">${on ? L('All off', 'Alles uit') : L('All on', 'Alles aan')}</button>` : ''); }).join('');
      return out;
    }
    function pClimate(m) {
      const acs = core.acList(m); const others = m.climates.filter((e) => acs.indexOf(e) < 0);
      if (!m.climates.length) return `<p class="w-empty">${L('No climate devices found.', 'Geen klimaatapparaten gevonden.')}</p>`;
      let out = `<div class="w-pagebar"><h1>${L('Climate', 'Klimaat')}</h1>`;
      if (acs.length > 1) { const on = acs.some((e) => core.isOn(e, S.states[e])); const ok = S.conn === 'connected'; out += `<div class="w-grp"><button class="w-step" data-act="grp-step" data-d="-1" ${ok ? '' : 'disabled'} aria-label="${L('All lower', 'Alles lager')}">${ic('minus')}</button><span>${L('All air conditioners', 'Alle airco’s')}</span><button class="w-step" data-act="grp-step" data-d="1" ${ok ? '' : 'disabled'} aria-label="${L('All higher', 'Alles hoger')}">${ic('plus')}</button><button class="w-pwr${on ? ' on' : ''}" data-act="grp-power" ${ok ? '' : 'disabled'} aria-label="${L('All on/off', 'Alles aan/uit')}">${ic('power')}</button></div>`; }
      out += '</div>';
      out += `<div class="w-acgrid">${acs.map((e) => acCard(e)).join('')}</div>`;
      if (others.length) out += panel(L('Heating', 'Verwarming'), `<div class="w-heat">${others.map((e) => { const s = core.st(e); const a = (s && s.attributes) || {}; return `<div class="w-sr"><span class="w-si">${ic('flame')}</span><span class="w-sl">${esc(core.nameOf(e))}</span><span class="w-sv num">${a.current_temperature != null ? T(+a.current_temperature) : '—'}${a.temperature != null ? ' → ' + T(+a.temperature) : ''}</span></div>`; }).join('')}</div>`, 'w-heatp');
      return out;
    }
    function pDevices(m) {
      const groups = [['switch', L('Switches', 'Schakelaars')], ['plug', L('Plugs', 'Stekkers')], ['fan', L('Fans', 'Ventilatoren')], ['cover', L('Blinds', 'Zonwering')], ['media', 'Media'], ['lock', L('Locks', 'Sloten')], ['scene', L('Scenes', 'Scènes')]];
      let out = `<div class="w-pagebar"><h1>${L('Devices', 'Apparaten')}</h1></div>`; let any = false;
      groups.forEach(([k, label]) => { const ds = m.controls.filter((e) => m.kind[e] === k || (k === 'scene' && m.kind[e] === 'script')); if (!ds.length) return; any = true; out += panel(label, `<div class="w-tiles">${ds.map((e) => tile(e)).join('')}</div>`, 'wd-' + k); });
      return any ? out : out + `<p class="w-empty">${L('No switches or other devices found.', 'Geen schakelaars of andere apparaten gevonden.')}</p>`;
    }
    function pSensors(m) {
      let out = `<div class="w-pagebar"><h1>${L('Sensors', 'Sensoren')}</h1></div>`;
      const rooms = m.rooms.filter((r) => core.tempOf(core.mainTemp(r)) != null || core.roomHum(r) != null);
      if (rooms.length) out += panel(L('Rooms', 'Kamers'), `<div class="w-rooms">${rooms.map((r) => { const v = core.tempOf(core.mainTemp(r)); const h = core.roomHum(r); return `<div class="w-rt" style="--tc:${core.tColor(v)}" data-k="wr-${esc(r.id)}"><span class="w-rtn">${esc(core.shortRoom(r.name))}</span>${tempBig(v)}<span class="w-rth">${h != null ? ic('drop') + Math.round(h) + '%' : ''}</span></div>`; }).join('')}</div>`, 'w-roomsp');
      const bins = importantBins(m);
      if (bins.length) out += panel(L('Doors, windows & motion', 'Deuren, ramen en beweging'), `<div class="w-bins">${bins.map((e) => { const s = core.st(e); const on = s && s.state === 'on'; return `<div class="w-bin${on ? ' on' : ''}${core.avail(s) ? '' : ' na'}"><span class="w-si">${ic(dc(e) === 'motion' || dc(e) === 'occupancy' ? 'motion' : 'window')}</span><span class="w-sl">${esc(core.nameOf(e))}<small>${esc(core.roomNameOf(e))}</small></span><span class="w-sv">${esc(core.stateText(e, s))}</span></div>`; }).join('')}</div>`, 'w-binp');
      out += energyPanel(m, false);
      return out;
    }
    function pAutos() {
      const all = Object.keys(S.states).filter((e) => e.startsWith('automation.')).sort((a, b) => core.nameOf(a).localeCompare(core.nameOf(b)));
      all.forEach((e) => core.st(e));
      let out = `<div class="w-pagebar"><h1>Automations</h1></div>`;
      const osc = core.oscEnt && core.oscEnt();
      if (osc) {
        const st0 = core.oscStatus(); const OSC = core.OSC;
        const lbl = { disabled: L('Disabled', 'Uitgeschakeld'), heating: L('Heating', 'Verwarmen'), reached: L('Temperature reached', 'Temperatuur bereikt'), maxed: L('Maximum time reached', 'Maximale verwarmingsduur bereikt'), cooldown: L('Waiting time active', 'Wachttijd actief'), idle: L('Inactive', 'Inactief') }[st0.key] || '';
        out += `<section class="w-panel w-osc st-${esc(st0.key)}" data-k="w-osc"><div class="w-ph"><h2>Oscar Airco Heating</h2><button class="w-tg${S.states[osc].state === 'on' ? ' on' : ''}" data-act="osc-toggle" role="switch" aria-checked="${S.states[osc].state === 'on'}" aria-label="Oscar Airco Heating"><i></i></button></div>
<div class="w-oscs"><span class="w-dot"></span><b>${esc(lbl)}</b>${st0.next && st0.next > Date.now() ? `<span>${L('Next allowed', 'Volgende toegestaan')}: ${String(st0.next.getHours()).padStart(2, '0')}:${String(st0.next.getMinutes()).padStart(2, '0')}</span>` : ''}</div>
<div class="w-oscg"><span>${L('Start', 'Start')} <b>${OSC.start}°</b></span><span>${L('Target', 'Doel')} <b>${OSC.target}°</b></span><span>Stop <b>${OSC.stop}°</b></span><span>Max <b>${OSC.maxMin} min</b></span></div></section>`;
      }
      out += `<div class="w-alist">${all.filter((e) => e !== osc).map((e) => { const s = S.states[e]; const on = s.state === 'on'; return `<div class="w-auto${on ? ' on' : ''}" data-k="wa-${esc(e)}"><span class="w-dot"></span><div class="w-at"><b>${esc(s.attributes.friendly_name || e)}</b><span>${on ? L('Active', 'Actief') : L('Disabled', 'Uitgeschakeld')}${s.attributes.last_triggered ? ' · ' + esc(ago(s.attributes.last_triggered)) : ''}</span></div><button class="w-tg${on ? ' on' : ''}" data-act="auto-toggle" data-eid="${esc(e)}" role="switch" aria-checked="${on}" aria-label="${esc(s.attributes.friendly_name || e)}" ${core.avail(s) ? '' : 'disabled'}><i></i></button></div>`; }).join('') || `<p class="w-empty">${L('No automations.', 'Geen automatiseringen.')}</p>`}</div>`;
      return out;
    }
    function ago(iso) { const mnt = Math.round((Date.now() - Date.parse(iso)) / 60000); if (!isFinite(mnt)) return ''; return mnt < 1 ? L('just now', 'zojuist') : mnt < 60 ? mnt + ' min' : mnt < 1440 ? Math.round(mnt / 60) + L(' h', ' uur') : Math.round(mnt / 1440) + L(' d', ' d'); }
    function pSettingsWrap() {
      const st = `<div class="w-pagebar"><h1>${L('Settings', 'Instellingen')}</h1></div>
<section class="w-panel" data-k="w-wallset"><div class="w-ph"><h2>${L('Wall panel', 'Muurpaneel')}</h2></div>
<div class="w-setrow"><span>${L('Start page', 'Startpagina')}</span><select data-set="wallStart" aria-label="${L('Start page', 'Startpagina')}">${PAGES.map(([id, , lbl]) => `<option value="${id}" ${startPage() === id ? 'selected' : ''}>${esc(lbl())}</option>`).join('')}</select></div>
<div class="w-setrow"><span>Device Layout</span><select data-set="layout" aria-label="Device Layout">${[['auto', L('Automatic', 'Automatisch')], ['iphone', 'iPhone'], ['ipad', 'iPad'], ['laptop', 'Laptop']].map(([v, l]) => `<option value="${v}" ${(settings.layout || 'auto') === v ? 'selected' : ''}>${l}</option>`).join('')}</select></div>
<p class="w-note">${L('The panel returns to the start page after 3 minutes without touch.', 'Het paneel gaat na 3 minuten zonder aanraking terug naar de startpagina.')}</p></section>`;
      return st + `<div class="w-embed">${core.pSettings()}</div>`;
    }

    function render() {
      if (!W.page) W.page = startPage();
      const m = core.model();
      const loading = !Object.keys(S.states).length;
      let body;
      if (W.page === 'settings') body = pSettingsWrap();
      else if (loading) body = `<div class="w-load" data-k="w-load"><div class="w-ring"><i></i></div><p>${S.conn === 'idle' ? L('Log in to Home Assistant to start.', 'Log in bij Home Assistant om te beginnen.') : L('Connecting to Home Assistant…', 'Verbinden met Home Assistant…')}</p></div>`;
      else body = W.page === 'lights' ? pLights(m) : W.page === 'climate' ? pClimate(m) : W.page === 'devices' ? pDevices(m) : W.page === 'sensors' ? pSensors(m) : W.page === 'autos' ? pAutos() : pHome(m);
      core.st('__clock');
      return `<div class="page w-root" data-k="w-root">${rail()}<div class="w-main">${topbar(m)}<div class="w-page w-pg-${esc(W.page)}" data-k="w-page-${esc(W.page)}">${body}</div></div></div>`;
    }

    function go(page) {
      if (page === W.page) { window.scrollTo(0, 0); return; }
      W.page = page; S.sheet = null; core.schedule(true); window.scrollTo(0, 0);
    }
    function allOff() {
      const m = core.model();
      const ls = lights(m).filter((e) => core.isOn(e, S.states[e]));
      const acs = core.acList(m).filter((e) => core.isOn(e, S.states[e]));
      if (!ls.length && !acs.length) { core.toast(L('Everything is already off', 'Alles staat al uit'), 'ok'); return; }
      const msg = L(`Turn off ${ls.length} light(s) and ${acs.length} air conditioner(s)? Plugs and switches (like the freezer) stay on.`, `${ls.length} lamp(en) en ${acs.length} airco('s) uitzetten? Stekkers en schakelaars (zoals de vriezer) blijven aan.`);
      if (!window.confirm(msg)) return;
      if (ls.length) core.svc('light', 'turn_off', { entity_id: ls });
      acs.forEach((e) => core.climatePower(e));
      core.toast(L('Turning everything off', 'Alles gaat uit'), 'ok');
    }

    // own events: page navigation and "all off" (device controls use the app's existing data-act handlers)
    document.addEventListener('click', (ev) => {
      const el = ev.target.closest && ev.target.closest('[data-wact]'); if (!el || !active()) return;
      const a = el.dataset.wact;
      if (a === 'page') go(el.dataset.v); else if (a === 'alloff') allOff();
    });
    // feedback on touch + idle timer
    const touch = (ev) => {
      W.lastTouch = Date.now();
      const b = ev.target.closest && ev.target.closest('.w-root button'); if (!b) return;
      b.classList.add('w-hit'); setTimeout(() => b.classList.remove('w-hit'), 260);
    };
    document.addEventListener('touchstart', touch, { passive: true }); document.addEventListener('mousedown', touch);
    setInterval(() => {
      if (!active()) return;
      const now = new Date();
      if (now.getMinutes() !== W.minute) { W.minute = now.getMinutes(); core.schedule(true); }
      if (Date.now() - W.lastTouch > 180000 && (W.page !== startPage() || S.sheet)) { W.lastTouch = Date.now(); S.sheet = null; W.page = startPage(); core.schedule(true); window.scrollTo(0, 0); }
    }, 5000);

    return { active, render, go, page: () => W.page };
  };
})();
