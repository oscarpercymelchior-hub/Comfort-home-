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
      ['screen', 'grid', () => 'Screen'],
      ['home', 'home', () => L('Overview', 'Overzicht')],
      ['lights', 'light', () => L('Lights', 'Verlichting')],
      ['climate', 'climate', () => L('Climate', 'Klimaat')],
      ['devices', 'devices', () => L('Devices', 'Apparaten')],
      ['sensors', 'thermo', () => L('Sensors', 'Sensoren')],
      ['autos', 'auto', () => L('Automations', 'Automations')],
      ['calendar', 'clock', () => L('Calendar', 'Kalender')]
    ];
    const W = { page: null, sub: null, lastTouch: Date.now(), minute: -1, press: {} };
    // Homepage: 'house' (whole house = Screen), 'room:<area id>' (that room's own dashboard) or one of the pages. Stored per device.
    const startValue = () => { const v = settings.wallStart || 'home'; return v === 'screen' ? 'house' : v; };
    const startPage = () => { const v = startValue(); if (v === 'house' || /^room:/.test(v)) return 'screen'; return PAGES.some((p) => p[0] === v) ? v : 'home'; };
    const startSub = () => { const v = startValue(); return /^room:/.test(v) ? { t: 'room', id: v.slice(5) } : null; };
    const atStart = () => { const s0 = startSub(); return W.page === startPage() && (s0 ? !!W.sub && W.sub.t === 'room' && W.sub.id === s0.id : !W.sub); };
    function goStart() { W.page = startPage(); W.sub = startSub(); }
    function startOptions() {
      const m = core.model(); const out = [['house', L('Whole house (Screen)', 'Hele huis (Screen)')]]; const seen = {};
      screenRooms(m).forEach(({ r, label }) => { seen[r.id] = 1; out.push(['room:' + r.id, label]); });
      m.rooms.filter((r) => !seen[r.id] && r.id !== '_none').forEach((r) => out.push(['room:' + r.id, r.name]));
      PAGES.filter((p) => p[0] !== 'screen').forEach(([id, , lbl]) => out.push([id, lbl()]));
      return out;
    }
    let MOODS = null; // created after panel() exists (see below)
    let FX = null; // animated scenes (fx.js)
    // season for the Screen animations: setting wallScene = auto | winter | spring | summer | autumn | off
    function seasonKey() { const v = settings.wallScene || 'auto'; if (v !== 'auto') return v; const m = new Date().getMonth(); return m === 11 || m <= 1 ? 'winter' : m <= 4 ? 'spring' : m <= 7 ? 'summer' : 'autumn'; }
    const SEASON_NAME = () => ({ winter: L('Winter', 'Winter'), spring: L('Spring', 'Lente'), summer: L('Summer', 'Zomer'), autumn: L('Autumn', 'Herfst') });
    function isXmasTime() { const d = new Date(); return d.getMonth() === 11 || (d.getMonth() === 0 && d.getDate() <= 6); }
    function stageHTML(scene, title, sub, room, trans, big) {
      return `<section class="fx-wrap${big ? ' big' : ''} sc-${esc(scene)}" data-k="fx-wrap"><div class="fx-stage" data-static="1" data-k="fx-stage" data-scene="${esc(scene)}" data-room="${esc(room || '')}" data-trans="${esc(String(trans || 1.6))}"><canvas class="fx-cv"></canvas></div>
<div class="fx-lab"><b>${esc(title)}</b>${sub ? `<span>${esc(sub)}</span>` : ''}</div><button class="fx-fw" data-wact="fx-fireworks" aria-label="${L('Fireworks', 'Vuurwerk')}">${ic('auto')}<span>${L('Fireworks', 'Vuurwerk')}</span></button><i class="fx-wood" aria-hidden="true"></i></section>`;
    }

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
      const conn = S.conn === 'connected' ? 'ok' : S.conn === 'error' || S.conn === 'auth_invalid' ? 'bad' : 'warn';
      const connTxt = S.conn === 'connected' ? L('Connected', 'Verbonden') : S.conn === 'reconnecting' ? L('Reconnecting', 'Opnieuw verbinden') : S.conn === 'idle' ? L('Not logged in', 'Niet ingelogd') : S.conn === 'error' ? L('No connection', 'Geen verbinding') : L('Connecting', 'Verbinden');
      return `<header class="w-top" data-k="w-top"><div class="w-clock"><span class="w-time num">${hh}<i class="w-colon">:</i>${mm}</span><span class="w-date">${esc(date)}</span></div>
<div class="w-weather">${out.v != null ? `<span class="w-wi">${ic(WI[cond] || 'sun')}</span><span class="w-out num">${T(out.v)}</span><span class="w-wl">${esc(cond ? wName(cond) : L('Outside', 'Buiten'))}</span>` : ''}</div>
<div class="w-stat"><span class="w-chip" title="${L('Lights on', 'Lampen aan')}">${ic('light')}<b class="num">${lamps}</b></span><span class="w-chip" title="${L('Air conditioners on', 'Airco’s aan')}">${ic('climate')}<b class="num">${acsOn}</b></span><span class="w-conn ${conn}"><i></i>${esc(connTxt)}</span></div></header>`;
    }
    const cap = (s) => s.charAt(0).toUpperCase() + s.slice(1);
    const WNL = { sunny: 'Zonnig', 'clear night': 'Helder', cloudy: 'Bewolkt', partlycloudy: 'Half bewolkt', rainy: 'Regen', pouring: 'Stortregen', snowy: 'Sneeuw', 'snowy rainy': 'Natte sneeuw', fog: 'Mist', hail: 'Hagel', lightning: 'Onweer', 'lightning rainy': 'Onweer en regen', windy: 'Winderig', 'windy variant': 'Winderig', exceptional: 'Uitzonderlijk' };
    const WEN = { partlycloudy: 'Partly cloudy', 'clear night': 'Clear night' };
    const wName = (c) => (nl() ? WNL[c] : WEN[c]) || cap(c);
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
${ok && ['light', 'fan', 'cover', 'media'].indexOf(k) >= 0 ? `<button class="w-more" data-act="sheet" data-eid="${esc(e)}" aria-label="${L('More', 'Meer')}">${ic('settings')}</button>` : ''}${pencil(e)}</div>`;
    }
    const pencil = (e, cls) => `<button class="w-ren${cls ? ' ' + cls : ''}" data-wact="rename" data-eid="${esc(e)}" aria-label="${L('Rename', 'Naam aanpassen')}">${ic('pencil')}</button>`;
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
      const cs = climStatus(e); const f = a.supported_features || 0;
      const chips = (title, icon, list, cur, act, lab) => (list && list.length ? `<div class="w-crow"><span class="w-crl">${ic(icon)}${esc(title)}</span><div class="w-chips">${list.map((v) => `<button class="w-cchip${v === cur ? ' on' : ''}" data-act="${act}" data-eid="${esc(e)}" data-v="${esc(v)}" aria-pressed="${v === cur}" ${ok ? '' : 'disabled'}>${esc(lab(v))}</button>`).join('')}</div></div>` : '');
      return `<div class="w-acc${on ? ' on m-' + esc(s.state) : ''} st-${cs.k}${S.pending[e] ? ' busy' : ''}" data-k="wacc-${esc(e)}" style="--tc:${core.tColor(rv)}">
<div class="w-acc-h"><div><b>${esc(name)}</b><span class="w-cst ${cs.k}"><i></i>${esc(cs.t)}</span></div><div class="w-acc-hb">${pencil(e, 'inl')}<button class="w-pwr${on ? ' on' : ''}" data-act="clim-power" data-eid="${esc(e)}" ${ok ? '' : 'disabled'} aria-label="${esc(name)} aan/uit" aria-pressed="${on}">${ic('power')}</button></div></div>
<div class="w-acc-m"><button class="w-step" data-act="clim-step" data-eid="${esc(e)}" data-d="-1" ${ok && tgt != null ? '' : 'disabled'} aria-label="${L('Lower', 'Lager')}">${ic('minus')}</button>${dial(rv, tgt, a, cs.k)}<button class="w-step" data-act="clim-step" data-eid="${esc(e)}" data-d="1" ${ok && tgt != null ? '' : 'disabled'} aria-label="${L('Higher', 'Hoger')}">${ic('plus')}</button></div>
<div class="w-modes">${modes.map((x) => `<button class="w-mode${on && s.state === x ? ' on' : ''}" data-act="clim-mode" data-eid="${esc(e)}" data-v="${esc(x)}" ${ok ? '' : 'disabled'}>${ic(MI[x])}<span>${esc(core.HVAC[x] || x)}</span></button>`).join('')}</div>
${(f & 8) || !f ? chips(L('Fan', 'Ventilator'), 'fan', a.fan_modes, a.fan_mode, 'clim-fan', prettyV) : ''}${(f & 16) || !f ? chips('Preset', 'leaf', a.preset_modes, a.preset_mode, 'clim-preset', presetName) : ''}${(f & 32) || !f ? chips(L('Swing', 'Lamellen'), 'wind', a.swing_modes, a.swing_mode, 'clim-swing', prettyV) : ''}</div>`;
    }
    const prettyV = (v) => { const x = String(v).replace(/_/g, ' '); return /^auto$/i.test(x) ? 'Auto' : nl() && /^off$/i.test(x) ? 'Uit' : cap(x.toLowerCase()); };
    function presetName(v) { const P = { none: L('Normal', 'Normaal'), quiet: L('Quiet', 'Stil'), powerful: 'Powerful', eco: 'Eco', boost: 'Boost', sleep: L('Sleep', 'Slaap'), comfort: 'Comfort', away: L('Away', 'Afwezig') }; return P[String(v).toLowerCase()] || prettyV(v); }
    // clear heating / cooling status for climate cards
    function climStatus(e) {
      const s = S.states[e]; if (!s || !core.avail(s)) return { k: 'na', t: L('Unavailable', 'Niet beschikbaar') };
      const a = s.attributes; if (!core.isOn(e, s)) return { k: 'off', t: L('Off', 'Uit') };
      const act = a.hvac_action;
      if (act === 'heating') return { k: 'heat', t: L('Heating', 'Verwarmt') };
      if (act === 'cooling') return { k: 'cool', t: L('Cooling', 'Koelt') };
      if (act === 'drying') return { k: 'dry', t: L('Drying', 'Ontvochtigt') };
      if (act === 'fan') return { k: 'fan', t: L('Fan', 'Ventileert') };
      if (act === 'idle') return { k: 'idle', t: L('At temperature', 'Op temperatuur') };
      const M = { heat: ['heat', L('Heating', 'Verwarmt')], cool: ['cool', L('Cooling', 'Koelt')], dry: ['dry', L('Drying', 'Ontvochtigt')], fan_only: ['fan', L('Fan', 'Ventileert')] };
      const x = M[s.state]; return x ? { k: x[0], t: x[1] } : { k: 'idle', t: core.HVAC[s.state] || cap(s.state) };
    }
    // round temperature dial; the arc animates smoothly when the target changes
    function dial(cur, tgt, a, k) {
      const min = a.min_temp != null ? +a.min_temp : 16; const max = a.max_temp != null ? +a.max_temp : 30;
      const C = 2 * Math.PI * 70; const arc = C * 0.75; const p = tgt == null ? 0 : Math.max(0, Math.min(1, (tgt - min) / ((max - min) || 1)));
      const cp = cur == null ? null : Math.max(0, Math.min(1, (cur - min) / ((max - min) || 1))); const ang = cp == null ? 0 : (135 + cp * 270) * Math.PI / 180;
      return `<div class="w-dial d-${k}"><svg viewBox="0 0 180 180" aria-hidden="true"><circle class="d-bg" cx="90" cy="90" r="70" style="stroke-dasharray:${arc.toFixed(1)} ${C.toFixed(1)}" transform="rotate(135 90 90)"></circle><circle class="d-fg" cx="90" cy="90" r="70" style="stroke-dasharray:${(arc * p).toFixed(1)} ${C.toFixed(1)}" transform="rotate(135 90 90)"></circle>${cp == null ? '' : `<circle class="d-now" cx="${(90 + 70 * Math.cos(ang)).toFixed(1)}" cy="${(90 + 70 * Math.sin(ang)).toFixed(1)}" r="6"></circle>`}</svg>
<div class="d-c"><div class="w-tv"><span class="w-lbl">${L('Target', 'Doel')}</span><span class="num">${T(tgt)}</span></div><div class="w-room"><span class="w-lbl">${L('Room', 'Kamer')}</span><span class="d-r num">${T(cur)}</span></div></div></div>`;
    }
    function statusPanel(m) {
      const ht = core.houseTemp(); const out = core.outsideTemp(); const h = humAvg(m);
      const bins = importantBins(m); const openB = bins.filter((e) => S.states[e] && S.states[e].state === 'on');
      const pw = powerSensors(); const total = pw.reduce((a, b) => a + b.w, 0);
      const devOn = m.controls.filter((e) => ['scene', 'script'].indexOf(m.kind[e]) < 0 && core.isOn(e, S.states[e])).length;
      bins.forEach((e) => core.st(e)); pw.slice(0, 3).forEach((p) => core.st(p.e));
      const row = (icon, label, val, cls) => `<div class="w-sr ${cls || ''}"><span class="w-si">${ic(icon)}</span><span class="w-sl">${esc(label)}</span><span class="w-sv num">${val}</span></div>`;
      let b = `<div class="w-duo"><div><span class="w-lbl">${L('Inside', 'Binnen')}</span>${tempBig(ht.v)}</div><div><span class="w-lbl">${L('Outside', 'Buiten')}</span>${tempBig(out.v)}</div></div>`;
      b += row('drop', L('Humidity', 'Luchtvochtigheid'), h != null ? Math.round(h) + '%' : '—');
      b += row('power', L('Devices on', 'Apparaten aan'), String(devOn), devOn ? 'hl' : '');
      if (bins.length) b += row('window', L('Open / detected', 'Open / gedetecteerd'), openB.length ? String(openB.length) : L('none', 'geen'), openB.length ? 'warn' : 'ok');
      if (pw.length) b += row('bolt', L('Power now', 'Verbruik nu'), fmtW(total), 'hl');
      // 1.12: the "unavailable" count is no longer shown here (the devices themselves are untouched; see Info → Unavailable)
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
    /* ------------ SCREEN (wall dashboard for the acoustic wood wall) ------------ */
    const SCREEN_ROOMS = [['woonkamer', 'Woonkamer'], ['oscar', 'Kamer Oscar'], ['rosa', 'Kamer Rosa'], ['ouders', 'Kamer Ouders']];
    function screenRooms(m) {
      const taken = {}; const out = [];
      SCREEN_ROOMS.forEach(([re, label]) => { const r = m.rooms.find((x) => !taken[x.id] && new RegExp(re, 'i').test(x.name)); if (r) { taken[r.id] = 1; out.push({ r, label }); } });
      if (out.length < 4) core.acList(m).map((e) => core.roomOfEid(e)).filter(Boolean).forEach((r) => { if (out.length < 4 && !taken[r.id]) { taken[r.id] = 1; out.push({ r, label: r.name }); } });
      return out;
    }
    const HOTWATER = /dhw|hot.?water|warm.?water|tapwater|boiler.?water/i;
    const heaters = (m) => m.climates.filter((e) => !HOTWATER.test(e + ' ' + core.nameOf(e)) && ((S.states[e].attributes.hvac_modes || []).indexOf('heat') >= 0 || core.isAC(e)));
    function heatStatus(e) {
      const s = S.states[e]; if (!s || !core.avail(s)) return { k: 'na', t: L('Unavailable', 'Niet beschikbaar') };
      const a = s.attributes; const on = core.isOn(e, s);
      if (!on) return { k: 'off', t: L('Off', 'Uit') };
      if (a.hvac_action === 'heating' || (s.state === 'heat' && a.hvac_action == null)) return { k: 'heat', t: L('Heating', 'Verwarmt') };
      if (s.state === 'heat') return { k: 'idle', t: L('Heat · idle', 'Verwarmen · wacht') };
      return { k: 'other', t: core.HVAC[s.state] || cap(s.state) };
    }
    function roomHeat(r) {
      const cs = r.devs.filter((e) => core.model().kind[e] === 'climate'); if (!cs.length) return null;
      const st0 = cs.map(heatStatus); return st0.find((x) => x.k === 'heat') || st0.find((x) => x.k === 'idle') || st0.find((x) => x.k === 'other') || st0[0];
    }
    function deadSensors(r) { return r.temps.filter((e) => !(core.isOutside && core.isOutside(e)) && !(core.isJunkT && core.isJunkT(e)) && S.states[e] && !core.avail(S.states[e])); }
    function gauge(v) {
      const p = v == null ? null : Math.max(0, Math.min(100, (v - 14) / 12 * 100));
      return `<span class="s-gauge"><i class="s-gfill" style="width:${p == null ? 0 : p.toFixed(0)}%"></i>${p == null ? '' : `<b style="left:${p.toFixed(0)}%"></b>`}</span><span class="s-gl"><span>14°</span><span>20°</span><span>26°</span></span>`;
    }
    function screenMain(m) {
      const rooms = screenRooms(m);
      rooms.forEach((x) => { const te = core.mainTemp(x.r); if (te) core.st(te); x.r.devs.forEach((e) => core.st(e)); });
      const vals = rooms.map((x) => ({ x, v: core.tempOf(core.mainTemp(x.r)) }));
      const ok = vals.filter((y) => y.v != null); const bad = vals.filter((y) => y.v == null || deadSensors(y.x.r).length);
      const avg = ok.length ? ok.reduce((s2, y) => s2 + y.v, 0) / ok.length : null;
      const heatingNow = heaters(m).filter((e) => heatStatus(e).k === 'heat').length;
      const sk = seasonKey(); const pre = sk !== 'off' ? stageHTML(sk, SEASON_NAME()[sk] || '', sk === 'winter' && isXmasTime() ? L('Happy holidays', 'Fijne feestdagen') : '', '', 2, false) : '';
      let out = pre + `<button class="s-avg" data-wact="screen-heat" data-k="s-avg"><span class="s-slats" aria-hidden="true"></span><span class="s-avg-l"><span class="s-cap">${L('Average house temperature', 'Gemiddelde huistemperatuur')}</span>${tempBig(avg)}<span class="s-avg-sub">${ok.length ? L(`Average of ${ok.length} rooms`, `Gemiddelde van ${ok.length} kamers`) : L('No valid sensor values', 'Geen geldige sensorwaarden')}${bad.length ? ' · ' + bad.map((y) => esc(y.x.label) + (y.v == null ? '' : L(' (backup sensor)', ' (reservesensor)'))).join(', ') + L(': sensor unavailable', ': sensor niet beschikbaar') : ''}</span></span>
<span class="s-avg-r"><span class="s-heatnow${heatingNow ? ' on' : ''}">${ic('flame')}<b>${heatingNow ? L(`${heatingNow} heating`, `${heatingNow} verwarmt`) : L('No heating active', 'Geen verwarming actief')}</b></span><span class="s-go">${L('All heating', 'Alle verwarmingen')}${ic('chev')}</span></span></button>`;
      out += `<div class="s-rooms">${rooms.map(({ r, label }) => { const v = core.tempOf(core.mainTemp(r)); const h = core.roomHum(r); const hs = roomHeat(r);
        return `<button class="s-room${hs && hs.k === 'heat' ? ' heat' : ''}" data-wact="screen-room" data-v="${esc(r.id)}" data-k="s-room-${esc(r.id)}"><span class="s-rn">${esc(label)}</span>
<span class="s-rt">${v == null ? `<span class="wv na">—</span><span class="s-na">${L('Sensor unavailable', 'Sensor niet beschikbaar')}</span>` : tempBig(v) + (deadSensors(r).length ? `<span class="s-na">${L('Room sensor unavailable · backup sensor used', 'Kamersensor niet beschikbaar · reservesensor gebruikt')}</span>` : '')}</span>
<span class="s-rmeta">${h != null ? `<span>${ic('drop')}${Math.round(h)}%</span>` : ''}${hs ? `<span class="s-hs ${hs.k}">${ic('flame')}${esc(hs.t)}</span>` : ''}</span>${gauge(v)}</button>`; }).join('')}</div>`;
      if (!rooms.length) out += `<p class="w-empty">${L('No rooms with temperature sensors found.', 'Geen kamers met temperatuursensoren gevonden.')}</p>`;
      return out;
    }
    function heaterCard(e) {
      const s = core.st(e); if (!s) return ''; const a = s.attributes; const r = core.roomOfEid(e); const hs = heatStatus(e);
      const te = r && core.isAC(e) ? core.mainTemp(r) : null; const cur = te ? core.tempOf(te) : a.current_temperature != null ? +a.current_temperature : null;
      const tgt = S.draft[e] ? S.draft[e].v : a.temperature != null ? +a.temperature : null; const ok = core.avail(s) && S.conn === 'connected';
      const canOff = (a.hvac_modes || []).indexOf('off') >= 0; const on = core.isOn(e, s);
      const name = core.isAC(e) && r ? core.shortRoom(r.name) : core.nameOf(e);
      return `<div class="s-heater ${hs.k}${S.pending[e] ? ' busy' : ''}" data-k="s-h-${esc(e)}"><div class="s-hh"><div><b>${esc(name)}</b><span class="s-hs ${hs.k}">${ic('flame')}${esc(hs.t)}</span></div><span class="s-hb">${pencil(e, 'inl')}${canOff ? `<button class="s-pwr${on ? ' on' : ''}" data-act="clim-power" data-eid="${esc(e)}" ${ok ? '' : 'disabled'} aria-pressed="${on}" aria-label="${esc(name)} ${L('on/off', 'aan/uit')}">${ic('power')}</button>` : ''}</span></div>
<div class="s-hm"><div><span class="s-cap">${L('Now', 'Nu')}</span>${tempBig(cur)}</div><div class="s-set"><button class="s-step" data-act="clim-step" data-eid="${esc(e)}" data-d="-1" ${ok && tgt != null ? '' : 'disabled'} aria-label="${L('Lower', 'Lager')}">${ic('minus')}</button><div class="s-tv"><span class="s-cap">${L('Set', 'Ingesteld')}</span><span class="num">${T(tgt)}</span></div><button class="s-step" data-act="clim-step" data-eid="${esc(e)}" data-d="1" ${ok && tgt != null ? '' : 'disabled'} aria-label="${L('Higher', 'Hoger')}">${ic('plus')}</button></div></div></div>`;
    }
    function screenHeat(m) {
      const hs = heaters(m);
      return `<div class="s-bar"><button class="s-back" data-wact="screen-back">${ic('back')}<span>Screen</span></button><h1>${L('All heating', 'Alle verwarmingen')}</h1></div>
${hs.length ? `<div class="s-heaters">${hs.map(heaterCard).join('')}</div>` : `<p class="w-empty">${L('No heating found in Home Assistant.', 'Geen verwarming gevonden in Home Assistant.')}</p>`}`;
    }
    function screenRoom(m, id) {
      const r = m.roomById[id]; if (!r) return `<div class="s-bar"><button class="s-back" data-wact="screen-back">${ic('back')}<span>Screen</span></button></div><p class="w-empty">${L('Room not found.', 'Kamer niet gevonden.')}</p>`;
      const v = core.tempOf(core.mainTemp(r)); const h = core.roomHum(r);
      const added = roomAdded(r).filter((e) => r.devs.indexOf(e) < 0);
      const ctl = r.devs.filter((e) => m.kind[e] !== 'climate').concat(added.filter((e) => m.kind[e] !== 'climate')); const cl = r.devs.filter((e) => m.kind[e] === 'climate').concat(added.filter((e) => m.kind[e] === 'climate'));
      const sens = r.temps.concat(r.hums, r.other); sens.forEach((e) => core.st(e)); r.bins.forEach((e) => core.st(e));
      const label = (SCREEN_ROOMS.find((x) => new RegExp(x[0], 'i').test(r.name)) || [0, r.name])[1];
      let out = `<div class="s-bar"><button class="s-back" data-wact="screen-back">${ic('back')}<span>Screen</span></button><h1>${esc(label)}</h1><span class="s-bar-t">${tempBig(v)}${h != null ? `<span class="s-bar-h">${ic('drop')}${Math.round(h)}%</span>` : ''}</span></div>`;
      { const md = MOODS && MOODS.active(r); const sk = seasonKey();
        if (md) out += stageHTML(MOODS.sceneOf(md), 'Mood: ' + md.name, label, r.id, md.wake ? 3 : Math.max(1.2, +md.trans || 1.6), true);
        else if (sk !== 'off') out += stageHTML(sk, label, L('No mood active – choose one below', 'Geen mood actief – kies er hieronder een'), r.id, 2, true); }
      const addBtn = `<button class="w-link" data-wact="add-open" data-room="${esc(r.id)}">${ic('plus')}<span>${L('Add device', 'Apparaat toevoegen')}</span></button>`;
      out += panel(L('Control', 'Bediening'), ctl.length ? `<div class="w-tiles">${ctl.map((e) => tile(e)).join('')}</div>` : `<p class="w-empty" style="padding:8px 2px">${L('No devices to control yet.', 'Nog geen apparaten om te bedienen.')}</p>`, 's-p-ctl', addBtn);
      if (MOODS) out += MOODS.sectionHTML(r);
      if (cl.length) out += panel(L('Heating & air conditioning', 'Verwarming en airco'), `<div class="s-heaters">${cl.map((e) => (core.isAC(e) ? acCard(e) : heaterCard(e))).join('')}</div>`, 's-p-cl');
      if (sens.length || r.bins.length) out += panel(L('Sensors', 'Sensoren'), `<div class="w-bins">${sens.concat(r.bins).map((e) => { const s = S.states[e]; return `<div class="w-bin${core.avail(s) ? '' : ' na'}${s && s.state === 'on' && e.startsWith('binary_sensor.') ? ' on' : ''}"><span class="w-si">${ic(r.temps.indexOf(e) >= 0 ? 'thermo' : r.hums.indexOf(e) >= 0 ? 'drop' : e.startsWith('binary_sensor.') ? 'window' : (dc(e) === 'power' || dc(e) === 'energy') ? 'bolt' : 'info')}</span><span class="w-sl">${esc(core.nameOf(e))}</span><span class="w-sv num">${esc(core.stateText(e, s))}</span></div>`; }).join('')}</div>`, 's-p-sens');
      return out;
    }
    // devices the user added to a room in this app (S.ud.roomAdd); only existing entities, never duplicates
    function roomAdded(r) { return (((S.ud || {}).roomAdd || {})[r.id] || []).filter((e) => S.states[e]); }
    function pScreen(m) { return W.sub && W.sub.t === 'heat' ? screenHeat(m) : W.sub && W.sub.t === 'room' ? screenRoom(m, W.sub.id) : screenMain(m); }

    function ago(iso) { const mnt = Math.round((Date.now() - Date.parse(iso)) / 60000); if (!isFinite(mnt)) return ''; return mnt < 1 ? L('just now', 'zojuist') : mnt < 60 ? mnt + ' min' : mnt < 1440 ? Math.round(mnt / 60) + L(' h', ' uur') : Math.round(mnt / 1440) + L(' d', ' d'); }
    function pSettingsWrap() {
      const sel = (key, val, opts, lbl) => `<div class="w-setrow"><span>${esc(lbl)}</span><select data-set="${key}" aria-label="${esc(lbl)}">${opts.map(([v, l]) => `<option value="${esc(v)}" ${val === v ? 'selected' : ''}>${esc(l)}</option>`).join('')}</select></div>`;
      const st = `<div class="w-pagebar"><h1>${L('Settings', 'Instellingen')}</h1></div>
<section class="w-panel" data-k="w-wallset"><div class="w-ph"><h2>${L('Wall panel', 'Muurpaneel')}</h2></div>
${sel('wallStart', startValue(), startOptions(), L('Homepage', 'Homepage'))}
${sel('wallTheme', settings.wallTheme === 'dark' ? 'dark' : 'light', [['light', L('Light & warm', 'Licht en warm')], ['dark', L('Dark', 'Donker')]], L('Theme', 'Thema'))}
${sel('wallDim', settings.wallDim === 'off' ? 'off' : 'on', [['on', L('After 30 seconds', 'Na 30 seconden')], ['off', L('Never', 'Nooit')]], L('Dim screen', 'Scherm dimmen'))}
${sel('wallScene', settings.wallScene || 'auto', [['auto', L('Automatic (current season)', 'Automatisch (huidig seizoen)')], ['winter', L('Winter', 'Winter')], ['spring', L('Spring', 'Lente')], ['summer', L('Summer', 'Zomer')], ['autumn', L('Autumn', 'Herfst')], ['off', L('Off', 'Uit')]], L('Season animation (Screen)', 'Seizoensanimatie (Screen)'))}
${sel('wallFireworks', settings.wallFireworks === 'off' ? 'off' : 'on', [['on', L('On holidays and Old Christmas', 'Op feestdagen en bij Old Christmas')], ['off', L('Only with the button', 'Alleen met de knop')]], L('Fireworks', 'Vuurwerk'))}
${sel('wallSeason', settings.wallSeason === 'on' || settings.wallSeason === 'off' ? settings.wallSeason : 'auto', [['auto', L('Automatic (1 Dec – 6 Jan)', 'Automatisch (1 dec – 6 jan)')], ['on', L('Always on', 'Altijd aan')], ['off', L('Off', 'Uit')]], L('Christmas on standby', 'Kerst op stand-by'))}
<div class="w-setrow"><span>Device Layout</span><select data-set="layout" aria-label="Device Layout">${[['auto', L('Automatic', 'Automatisch')], ['iphone', 'iPhone'], ['ipad', 'iPad'], ['laptop', 'Laptop']].map(([v, l]) => `<option value="${v}" ${(settings.layout || 'auto') === v ? 'selected' : ''}>${l}</option>`).join('')}</select></div>
<p class="w-note">${L('Homepage and these options are stored on this device. The screen dims softly after 30 seconds without touch (never fully black, the iPad brightness itself is not changed); one tap wakes it. After 3 minutes the panel returns to the homepage.', 'Homepage en deze opties worden op dit apparaat bewaard. Het scherm dimt zacht na 30 seconden zonder aanraking (nooit helemaal zwart, de helderheid van de iPad zelf verandert niet); één tik maakt het weer normaal. Na 3 minuten gaat het paneel terug naar de homepage.')}</p></section>`;
      return st + `<div class="w-embed">${core.pSettings()}</div>`;
    }

    /* ------------ rename + add device sheets (display names only, entity_id never changes) ------------ */
    function renameSheet() {
      const e = W.ren; if (!e || !S.states[e]) return '';
      const base = core.baseNameOf ? core.baseNameOf(e) : (S.states[e].attributes.friendly_name || e); const own = ((S.ud || {}).names || {})[e] || '';
      return `<div class="scrim" data-act="close-sheet" data-k="scrim"></div><div class="sheet w-rsheet" role="dialog" aria-modal="true" aria-label="${L('Rename', 'Naam aanpassen')}" data-k="sheet-wname"><div class="grab"></div><div class="sh"><span class="dico" style="background:var(--accent-soft);color:var(--accent)">${ic('pencil')}</span><div class="t"><b>${L('Rename device', 'Apparaat hernoemen')}</b><span>${esc(e)}</span></div><button class="star" data-act="close-sheet" aria-label="Close">${ic('x')}</button></div>
<div class="m-form"><label class="m-row"><span>${L('Name in this app', 'Naam in deze app')}</span><input type="text" data-win="ren" value="${esc(own || base)}" placeholder="${esc(base)}" maxlength="40" autocomplete="off"></label>
<p class="w-note">${L('Only the name shown in Comfort changes (on all your devices). The Home Assistant entity ID stays', 'Alleen de naam in Comfort verandert (op al je apparaten). De Home Assistant entity-ID blijft')} <b>${esc(e)}</b>. ${L('Original name', 'Oorspronkelijke naam')}: ${esc(base)}</p>
<div class="m-btns"><button class="btn" data-act="close-sheet">${L('Cancel', 'Annuleren')}</button><button class="btn pri" data-wact="ren-save">${ic('ok')}${L('Save', 'Opslaan')}</button></div>
${own ? `<div class="m-btns"><button class="btn" data-wact="ren-reset">${ic('refresh')}${L('Use original name', 'Oorspronkelijke naam gebruiken')}</button></div>` : ''}</div></div>`;
    }
    const ADDABLE = ['light', 'plug', 'switch', 'fan', 'cover', 'media', 'climate'];
    function addSheet() {
      const r = W.addRoom && core.model().roomById[W.addRoom]; if (!r) return '';
      const m = core.model(); const mine = roomAdded(r);
      const cand = m.controls.filter((e) => ADDABLE.indexOf(m.kind[e]) >= 0 && r.devs.indexOf(e) < 0 && S.states[e])
        .sort((x, y) => (m.kind[x] === 'light' ? 0 : 1) - (m.kind[y] === 'light' ? 0 : 1) || core.nameOf(x).localeCompare(core.nameOf(y)));
      const q = (W.addQ || '').toLowerCase(); const list = cand.filter((e) => !q || (core.nameOf(e) + ' ' + e).toLowerCase().indexOf(q) >= 0).slice(0, 80);
      return `<div class="scrim" data-act="close-sheet" data-k="scrim"></div><div class="sheet w-asheet" role="dialog" aria-modal="true" aria-label="${L('Add device', 'Apparaat toevoegen')}" data-k="sheet-wadd"><div class="grab"></div><div class="sh"><span class="dico" style="background:var(--accent-soft);color:var(--accent)">${ic('plus')}</span><div class="t"><b>${L('Add device', 'Apparaat toevoegen')}</b><span>${esc(r.name)}</span></div><button class="star" data-act="close-sheet" aria-label="Close">${ic('x')}</button></div>
<div class="m-form"><p class="w-note" style="margin:0 0 10px">${L('Shows an existing Home Assistant device in this room of the app. Nothing changes in Home Assistant itself.', 'Toont een bestaand Home Assistant-apparaat in deze kamer van de app. In Home Assistant zelf verandert niets.')}</p>
<label class="m-row"><span>${L('Search', 'Zoeken')}</span><input type="text" data-win="add-q" value="${esc(W.addQ || '')}" placeholder="${L('e.g. ceiling', 'bijv. plafond')}" autocomplete="off"></label>
<div class="w-alist2">${list.map((e) => { const on = mine.indexOf(e) >= 0; const rr = core.roomOfEid(e); return `<button class="w-arow${on ? ' on' : ''}" data-wact="add-tog" data-eid="${esc(e)}" data-k="wa2-${esc(e)}" aria-pressed="${on}"><span class="w-si">${ic(core.devIcon(e, S.states[e]))}</span><span class="w-sl">${esc(core.nameOf(e))}<small>${esc(e)}${rr ? ' · ' + esc(rr.name) : ''}</small></span><span class="w-ack">${ic(on ? 'ok' : 'plus')}</span></button>`; }).join('') || `<p class="w-empty" style="padding:12px 2px">${L('No other devices found.', 'Geen andere apparaten gevonden.')}</p>`}</div>
<div class="m-btns"><button class="btn pri" data-act="close-sheet">${L('Done', 'Klaar')}</button></div></div></div>`;
    }
    function sheet(name) { return name === '__wname' ? renameSheet() : name === '__wadd' ? addSheet() : name === '__wmood' && MOODS ? MOODS.sheetHTML() : ''; }

    function render() {
      if (!W.page) goStart();
      const m = core.model();
      const loading = !Object.keys(S.states).length;
      document.documentElement.classList.toggle('w-light', settings.wallTheme !== 'dark');
      let body;
      if (W.page === 'settings') body = pSettingsWrap();
      else if (loading) body = `<div class="w-load" data-k="w-load"><div class="w-ring"><i></i></div><p>${S.conn === 'idle' ? L('Log in to Home Assistant to start.', 'Log in bij Home Assistant om te beginnen.') : L('Connecting to Home Assistant…', 'Verbinden met Home Assistant…')}</p></div>`;
      else body = W.page === 'screen' ? pScreen(m) : W.page === 'calendar' ? (core.extra() ? core.extra().calendarHTML(true) : '') : W.page === 'lights' ? pLights(m) : W.page === 'climate' ? pClimate(m) : W.page === 'devices' ? pDevices(m) : W.page === 'sensors' ? pSensors(m) : W.page === 'autos' ? pAutos() : pHome(m);
      core.st('__clock');
      if (FX) setTimeout(FX.kick, 0);
      return `<div class="page w-root${W.page === 'screen' ? ' w-warm' : ''}" data-k="w-root">${rail()}<div class="w-main">${topbar(m)}<div class="w-page w-pg-${esc(W.page)}" data-k="w-page-${esc(W.page)}${W.sub ? '-' + esc(W.sub.t + (W.sub.id || '')) : ''}">${body}</div></div></div>`;
    }

    function go(page) {
      if (page === W.page && !W.sub) { window.scrollTo(0, 0); return; }
      W.page = page; W.sub = null; S.sheet = null; core.schedule(true); window.scrollTo(0, 0);
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
    function saveName(e, v) {
      S.ud.names = Object.assign({}, S.ud.names || {});
      const base = core.baseNameOf ? core.baseNameOf(e) : '';
      v = String(v || '').replace(/\s+/g, ' ').trim().slice(0, 40);
      if (!v || v === base) delete S.ud.names[e]; else S.ud.names[e] = v;
      core.saveUD(); core.closeSheet(); core.toast(L('Name saved', 'Naam opgeslagen'), 'ok');
    }

    // own events: page navigation, "all off", rename, add device, moods (device controls use the app's existing data-act handlers)
    document.addEventListener('click', (ev) => {
      const el = ev.target.closest && ev.target.closest('[data-wact]'); if (!el || !active()) return;
      const a = el.dataset.wact;
      if (a === 'page') go(el.dataset.v); else if (a === 'alloff') allOff();
      else if (a === 'screen-heat') { W.sub = { t: 'heat' }; core.schedule(true); window.scrollTo(0, 0); }
      else if (a === 'screen-room') { W.sub = { t: 'room', id: el.dataset.v }; core.schedule(true); window.scrollTo(0, 0); }
      else if (a === 'screen-back') { W.sub = null; core.schedule(true); window.scrollTo(0, 0); }
      else if (a === 'fx-fireworks') { if (FX) { if (FX.reduced()) core.toast(L('Animations are reduced on this device', 'Animaties staan beperkt op dit apparaat'), 'ok'); else FX.show('big'); } }
      else if (a === 'rename') { W.ren = el.dataset.eid; W.renVal = null; core.openSheet('__wname'); }
      else if (a === 'ren-save') { const inp = document.querySelector('[data-win=ren]'); saveName(W.ren, inp ? inp.value : W.renVal); }
      else if (a === 'ren-reset') saveName(W.ren, '');
      else if (a === 'add-open') { W.addRoom = el.dataset.room; W.addQ = ''; core.openSheet('__wadd'); }
      else if (a === 'add-tog') {
        const e = el.dataset.eid; const ra = Object.assign({}, S.ud.roomAdd || {}); const cur = (ra[W.addRoom] || []).slice(); const i = cur.indexOf(e);
        if (i >= 0) cur.splice(i, 1); else cur.push(e);
        ra[W.addRoom] = cur; S.ud.roomAdd = ra; core.saveUD();
      }
      else if (MOODS) MOODS.onAct(a, el);
    });
    const onWin = (ev) => {
      const el = ev.target; const k = el.dataset && el.dataset.win; if (!k) return;
      if (k === 'ren') { W.renVal = el.value; return; }
      if (k === 'add-q') { W.addQ = el.value; core.schedule(true); return; }
      if (MOODS) MOODS.onInput(k, el);
    };
    document.addEventListener('input', onWin); document.addEventListener('change', (ev) => { const el = ev.target; if (el.dataset && el.dataset.win && (el.type === 'checkbox' || el.nodeName === 'SELECT')) onWin(ev); });
    document.addEventListener('keydown', (ev) => { if (ev.key === 'Enter' && ev.target.dataset && ev.target.dataset.win === 'ren') { ev.preventDefault(); saveName(W.ren, ev.target.value); } });

    /* ------------ standby: soft dim after 30 s, Christmas sleigh (seasonal) ------------ */
    let dimEl = null; let fxEl = null; let dimmed = false; let lastFly = 0; let dimSince = 0;
    function layers() {
      if (dimEl || !document.body) return;
      dimEl = document.createElement('div'); dimEl.id = 'wdim'; dimEl.setAttribute('aria-hidden', 'true');
      fxEl = document.createElement('div'); fxEl.id = 'wfx'; fxEl.setAttribute('aria-hidden', 'true');
      let fx = '<div class="fx-lights">'; for (let i = 0; i < 18; i++) fx += `<i style="left:${(i * 5.6 + 1.5).toFixed(1)}%;-webkit-animation-delay:${(i % 5) * 0.7}s;animation-delay:${(i % 5) * 0.7}s"></i>`; fx += '</div>'; // snow and Santa are drawn by fx.js (animated canvas)
      fxEl.innerHTML = fx; document.body.appendChild(dimEl); document.body.appendChild(fxEl);
      const wake = (ev) => { if (!dimmed) return; if (ev.cancelable) ev.preventDefault(); ev.stopPropagation(); W.lastTouch = Date.now(); setDim(false); };
      dimEl.addEventListener('touchstart', wake, { passive: false }); dimEl.addEventListener('mousedown', wake); dimEl.addEventListener('click', (ev) => { ev.preventDefault(); ev.stopPropagation(); });
    }
    function setDim(on) {
      if (on === dimmed) return; dimmed = on; dimSince = on ? Date.now() : 0;
      if (!dimEl) return;
      if (on) dimEl.className = 'on'; else { dimEl.className = 'waking'; setTimeout(() => { if (!dimmed && dimEl) dimEl.className = ''; }, 450); }
    }
    function season() {
      const v = settings.wallSeason || 'auto'; if (v === 'off') return false; if (v === 'on' || settings.deco === 'xmas') return true;
      const d = new Date(); return d.getMonth() === 11 || (d.getMonth() === 0 && d.getDate() <= 6);
    }
    function fly() { lastFly = Date.now(); return FX ? FX.fly() : false; }
    setInterval(() => {
      const on = active(); if (on) layers();
      const html = document.documentElement;
      if (!on) { setDim(false); html.classList.remove('w-season'); html.classList.remove('w-season-own'); return; }
      const idle = Date.now() - W.lastTouch;
      setDim(settings.wallDim !== 'off' && idle > 30000);
      const sea = season(); html.classList.toggle('w-season', sea); html.classList.toggle('w-season-own', sea && settings.deco !== 'xmas');
      // the sleigh flies now and then, only while nobody is using the panel (not constantly)
      if (FX) FX.standby(sea && idle > 30000);
    }, 1000);

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
      if (Date.now() - W.lastTouch > 180000 && (!atStart() || S.sheet)) { W.lastTouch = Date.now() - 60000; S.sheet = null; goStart(); core.schedule(true); window.scrollTo(0, 0); }
    }, 5000);

    if (window.ComfortMoods) MOODS = window.ComfortMoods(Object.assign({}, core, { panel, fx: () => FX }));
    if (window.ComfortFX) FX = window.ComfortFX(Object.assign({}, core, { wallInfo: () => ({ active: active(), page: W.page, dimmed }), moods: () => MOODS }));
    return { active, render, go, page: () => W.page, sheet, startOptions, startValue, dimmed: () => dimmed, fly };
  };
})();
