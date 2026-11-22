/* Comfort Home — a calm smart-home app for Home Assistant. */
(function () {
  'use strict';
  const VERSION = '1.3.0';
  const $ = (s, r) => (r || document).querySelector(s);
  const ESC = { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' };
  const esc = (s) => String(s == null ? '' : s).replace(/[&<>"']/g, (c) => ESC[c]);
  const ic = (n, cls) => `<svg class="i${cls ? ' ' + cls : ''}" viewBox="0 0 24 24" aria-hidden="true">${window.ICONS[n] || window.ICONS.room}</svg>`;
  const clamp = (v, a, b) => Math.min(b, Math.max(a, v));
  const cap = (s) => String(s || '').charAt(0).toUpperCase() + String(s || '').slice(1);

  /* ---------------- storage ---------------- */
  const store = {
    get(k, d, ss) { try { const v = (ss ? sessionStorage : localStorage).getItem(k); return v == null ? d : JSON.parse(v); } catch (e) { return d; } },
    set(k, v, ss) { try { (ss ? sessionStorage : localStorage).setItem(k, JSON.stringify(v)); } catch (e) { /* quota / private mode */ } },
    del(k) { try { localStorage.removeItem(k); sessionStorage.removeItem(k); } catch (e) { /* ignore */ } }
  };
  const DEFAULTS = { theme: 'auto', autoSource: 'time', dayStart: '07:00', nightStart: '20:00', houseSource: 'auto', showHum: true,
    favorites: [], roomMain: {}, devGroup: 'type', climate: null, lastMode: {} };
  const settings = Object.assign({}, DEFAULTS, store.get('ch.settings', {}));
  const saveSettings = () => store.set('ch.settings', settings);
  function loadAuth() { return store.get('ch.auth', null) || store.get('ch.auth', null, true); }
  function saveAuth(a) { store.del('ch.auth'); if (a) store.set('ch.auth', a, !a.remember); }
  /* ---- "Log in with Home Assistant" (OAuth2 authorization-code flow, the same one the official apps use) ---- */
  const canOAuth = () => /^https?:$/.test(location.protocol);
  const oauthClientId = () => location.origin + '/';
  const oauthRedirect = () => location.origin + location.pathname + '?auth_callback=1';
  function randomState() { const b = new Uint8Array(16); (window.crypto || window.msCrypto).getRandomValues(b); return Array.from(b, (x) => x.toString(16).padStart(2, '0')).join(''); }
  function startLogin(url, remember) {
    const state = randomState();
    store.set('ch.pending', { url, state, remember, at: Date.now() });
    location.href = `${url}/auth/authorize?response_type=code&client_id=${encodeURIComponent(oauthClientId())}&redirect_uri=${encodeURIComponent(oauthRedirect())}&state=${state}`;
  }
  async function tokenRequest(url, params) {
    const r = await fetch(url + '/auth/token', { method: 'POST', headers: { 'Content-Type': 'application/x-www-form-urlencoded' }, body: new URLSearchParams(params).toString(), credentials: 'omit' });
    if (!r.ok) { const e = new Error(r.status === 400 || r.status === 403 ? 'Your login has expired. Please log in again.' : 'Home Assistant login failed (' + r.status + ')'); e.authExpired = r.status === 400 || r.status === 403; throw e; }
    return r.json();
  }
  async function finishLogin(q) {
    const p = store.get('ch.pending', null); store.del('ch.pending');
    history.replaceState(null, '', location.pathname + '#/home');
    if (!p || p.state !== q.get('state') || Date.now() - p.at > 15 * 60e3) { toast('Login was interrupted. Please try again.', 'bad'); location.hash = '#/settings'; return null; }
    try {
      const t = await tokenRequest(p.url, { grant_type: 'authorization_code', code: q.get('code'), client_id: oauthClientId() });
      const auth = { url: p.url, mode: 'oauth', token: t.access_token, refresh: t.refresh_token, exp: Date.now() + (t.expires_in || 1800) * 1000, remember: p.remember !== false };
      saveAuth(auth); store.del('ch.cache');
      toast('Logged in to Home Assistant', 'ok');
      return auth;
    } catch (e) {
      toast(friendlyFetchError(e, p.url), 'bad', 7000); location.hash = '#/settings'; return null;
    }
  }
  function friendlyFetchError(e, url) {
    if (e && e.authExpired) return e.message;
    if (location.protocol === 'https:' && /^http:/i.test(url)) return 'This app is opened from an https:// website, so it cannot log in to an http:// Home Assistant. Open the app from your Home Assistant server instead.';
    return (e && e.message && !/fetch/i.test(e.message)) ? e.message : `Could not reach Home Assistant at ${url}.`;
  }
  let refreshing = null;
  async function getToken(auth) {
    if (auth.mode !== 'oauth') return auth.token;
    if (auth.token && Date.now() < auth.exp - 60e3) return auth.token;
    if (!refreshing) refreshing = tokenRequest(auth.url, { grant_type: 'refresh_token', refresh_token: auth.refresh, client_id: oauthClientId() })
      .then((t) => { auth.token = t.access_token; auth.exp = Date.now() + (t.expires_in || 1800) * 1000; const cur = loadAuth(); if (cur && cur.refresh === auth.refresh) saveAuth(auth); return auth.token; })
      .finally(() => { refreshing = null; });
    return refreshing;
  }

  /* ---------------- app state ---------------- */
  const S = {
    conn: 'idle', err: '', demo: false, stale: false, everConnected: false,
    states: {}, areas: [], devices: {}, ents: {}, floors: {}, config: null, haVersion: '',
    hist: {}, spark: {}, pending: {}, draft: {}, sheet: null, q: '', cat: 'all', revealToken: false, testing: false
  };
  let C = null;            // active connection
  let M = null;            // derived model
  let modelDirty = true;

  /* ---------------- Home Assistant WebSocket connection ---------------- */
  class HAConn {
    constructor(o) { this.o = o; this.id = 1; this.pend = new Map(); this.subs = new Map(); this.ws = null; this.user = false; this.retry = 0; this.authed = false; }
    open() {
      clearTimeout(this.rt); this.user = false; this.authInvalid = false;
      if (!(S.conn === 'error' && this.retry > 3 && !S.everConnected)) this.o.status(S.everConnected && this.retry ? 'reconnecting' : 'connecting');
      let ws;
      try { ws = this.o.factory(); } catch (e) { this.o.status('error', friendlyOpenError(e)); return this._schedule(true); }
      this.ws = ws; this.authed = false;
      const guard = setTimeout(() => { if (!this.authed && ws === this.ws) try { ws.close(); } catch (e) { /* */ } }, 12000);
      ws.onmessage = (ev) => { let m; try { m = JSON.parse(ev.data); } catch (e) { return; } if (Array.isArray(m)) m.forEach((x) => this._msg(x, ws)); else this._msg(m, ws); };
      ws.onclose = () => { clearTimeout(guard); if (ws === this.ws) this._down(); };
      ws.onerror = () => { /* onclose follows */ };
    }
    _msg(m, ws) {
      switch (m.type) {
        case 'auth_required':
          Promise.resolve().then(() => this.o.token()).then((t) => { if (ws.readyState === 1) ws.send(JSON.stringify({ type: 'auth', access_token: t })); })
            .catch((e) => { if (e && e.authExpired) { this.authInvalid = true; this.user = true; this.o.status('auth_invalid', 'Your Home Assistant login has expired. Log in again in Settings.'); } try { ws.close(); } catch (x) { /* reconnect follows */ } });
          return;
        case 'auth_ok': this.authed = true; this.retry = 0; this.haVersion = m.ha_version; this._ping(); this.o.ready(this); return;
        case 'auth_invalid': if (this.o.retryAuth && this.o.retryAuth()) { try { ws.close(); } catch (e) { /* */ } return; } this.authInvalid = true; this.user = true; this.o.status('auth_invalid', 'Home Assistant rejected the access token. Create a new long-lived token and try again.'); try { ws.close(); } catch (e) { /* */ } return;
        case 'result': case 'pong': {
          const p = this.pend.get(m.id); if (!p) return;
          this.pend.delete(m.id); clearTimeout(p.t);
          if (m.type === 'pong' || m.success) p.res(m.result);
          else { const e = new Error((m.error && m.error.message) || 'Request failed'); e.code = m.error && m.error.code; p.rej(e); }
          return; }
        case 'event': { const cb = this.subs.get(m.id); if (cb) try { cb(m.event); } catch (e) { console.error('event handler', e); } return; }
      }
    }
    _raw(msg, id, timeout) {
      return new Promise((res, rej) => {
        if (!this.ws || this.ws.readyState !== 1 || !this.authed) return rej(new Error('Not connected to Home Assistant'));
        const t = setTimeout(() => { this.pend.delete(id); rej(new Error('Home Assistant did not respond in time')); }, timeout || 15000);
        this.pend.set(id, { res, rej, t });
        try { this.ws.send(JSON.stringify(Object.assign({}, msg, { id }))); } catch (e) { clearTimeout(t); this.pend.delete(id); rej(e); }
      });
    }
    send(msg, timeout) { return this._raw(msg, this.id++, timeout); }
    subscribe(event_type, cb) { const id = this.id++; this.subs.set(id, cb); return this._raw({ type: 'subscribe_events', event_type }, id).catch((e) => { this.subs.delete(id); throw e; }); }
    _ping() {
      clearInterval(this.pt);
      this.pt = setInterval(() => { if (!this.authed) return; this.send({ type: 'ping' }, 10000).catch(() => { try { this.ws.close(); } catch (e) { /* */ } }); }, 25000);
    }
    _down() {
      clearInterval(this.pt); this.authed = false; this.ws = null;
      this.pend.forEach((p) => { clearTimeout(p.t); p.rej(new Error('Connection to Home Assistant was lost')); }); this.pend.clear(); this.subs.clear();
      if (this.user) { if (!this.authInvalid) this.o.status('disconnected'); return; }
      this._schedule();
    }
    _schedule(keep) {
      clearTimeout(this.rt); if (this.user) return;
      const delay = Math.min(30000, 1000 * Math.pow(2, this.retry)) + Math.random() * 400;
      this.retry++;
      if (keep) { /* keep the error message that is already shown */ }
      else if (this.retry > 3 && !S.everConnected) this.o.status('error', `Can't reach Home Assistant at ${this.o.url}. Check the address and that your phone is on the same network. Still retrying…`);
      else this.o.status(S.everConnected ? 'reconnecting' : 'connecting');
      this.rt = setTimeout(() => this.open(), delay);
    }
    retryNow() { if (this.authed) { this.send({ type: 'ping' }, 5000).catch(() => { try { this.ws && this.ws.close(); } catch (e) { /* */ } }); return; } if (this.user) return; clearTimeout(this.rt); this.retry = Math.min(this.retry, 1); this.open(); }
    close() { this.user = true; clearTimeout(this.rt); clearInterval(this.pt); if (this.ws) try { this.ws.close(); } catch (e) { /* */ } this.ws = null; this.authed = false; }
  }
  /* Embedded mode: the app runs on top of Home Assistant's own web interface, which handles login and reconnecting. */
  class HassConn {
    constructor(E) { this.E = E; this.authed = false; this.user = false; this.haVersion = ''; this.conn = null; }
    start() { setStatus('connecting'); const tick = () => { const h = this.E.getHass(); if (h && h.connection) this.attach(h); else setTimeout(tick, 150); }; tick(); }
    attach(h) {
      this.conn = h.connection; this.haVersion = (h.config && h.config.version) || ''; S.userName = h.user && h.user.name;
      this.conn.addEventListener('ready', () => { this.authed = true; onReady(this); });
      this.conn.addEventListener('disconnected', () => { this.authed = false; setStatus('reconnecting'); });
      this.conn.addEventListener('reconnect-error', () => { this.authed = false; setStatus('error', 'Home Assistant is not reachable right now. Retrying…'); });
      if (this.conn.connected !== false) { this.authed = true; onReady(this); }
    }
    send(msg) {
      if (!this.authed) return Promise.reject(new Error('Not connected to Home Assistant'));
      return this.conn.sendMessagePromise(msg).catch((e) => { throw e instanceof Error ? e : Object.assign(new Error((e && e.message) || 'Request failed'), { code: e && e.code }); });
    }
    subscribe(type, cb) { return this.conn.subscribeEvents(cb, type); }
    retryNow() { try { if (!this.authed && this.conn && this.conn.reconnect) this.conn.reconnect(true); } catch (e) { /* */ } }
    close() { /* Home Assistant owns this connection */ }
  }
  const EMBED = window.__comfortEmbed || null;
  function friendlyOpenError(e) {
    if (e && e.name === 'SecurityError') return 'This app is open over HTTPS, so it cannot connect to an http:// Home Assistant address. Use an https:// address, or open the app from Home Assistant itself.';
    return (e && e.message) || 'Could not open the connection';
  }
  function normalizeUrl(u) {
    u = String(u || '').trim().replace(/\/+$/, '');
    if (!u) return '';
    if (!/^https?:\/\//i.test(u)) u = 'http://' + u;
    try { const x = new URL(u); return x.origin; } catch (e) { return ''; }  // ignore copied paths like /lovelace/0 or /local/comfort/index.html
  }
  const wsUrl = (u) => u.replace(/^http/i, 'ws') + '/api/websocket';

  function setStatus(s, err) { S.conn = s; S.err = err || ''; schedule(true); }

  function startConnection(auth) {
    if (C) C.close();
    S.demo = false;
    let retried = false;
    C = new HAConn({
      url: auth.url,
      factory: () => new WebSocket(wsUrl(auth.url)),
      token: () => getToken(auth),
      retryAuth: () => { if (auth.mode !== 'oauth' || retried) return false; retried = true; auth.exp = 0; return true; },
      status: setStatus,
      ready: (c) => { retried = false; onReady(c); }
    });
    C.open();
  }
  function startDemo() {
    if (C) C.close();
    const go = () => {
      S.demo = true; S.stale = false; clearData();
      const ha = window.__demoHA || (window.__demoHA = new window.DemoHA({ delay: 450, driftMs: 12000 }));
      C = new HAConn({ url: 'preview', factory: () => ha.socket(), token: () => 'demo', status: setStatus, ready: (c) => onReady(c) });
      C.open();
    };
    if (window.DemoHA) go();
    else { const s = document.createElement('script'); s.src = 'demo-ha.js'; s.onload = go; s.onerror = () => toast('Could not load preview data', 'bad'); document.head.appendChild(s); }
  }
  function clearData() { S.states = {}; S.areas = []; S.devices = {}; S.ents = {}; S.floors = {}; S.hist = {}; S.spark = {}; S.pending = {}; S.draft = {}; modelDirty = true; }

  async function onReady(c) {
    if (c !== C) return;
    S.everConnected = true; S.haVersion = c.haVersion || '';
    c.send({ type: 'auth/current_user' }).then((u) => { S.userName = u && u.name; schedule(true); }).catch(() => { /* optional */ });
    try {
      const first = !c._subscribed; c._subscribed = true;
      if (first) await c.subscribe('state_changed', (ev) => onStateChanged(ev.data));
      const [states, config] = await Promise.all([c.send({ type: 'get_states' }, 30000), c.send({ type: 'get_config' })]);
      await loadRegistries(c);
      S.states = {};
      for (const s of states) S.states[s.entity_id] = s;
      S.config = config; S.stale = false; modelDirty = true;
      setStatus('connected');
      if (first) ['area_registry_updated', 'device_registry_updated', 'entity_registry_updated', 'floor_registry_updated']
        .forEach((t) => c.subscribe(t, () => reloadRegistriesSoon()).catch(() => { /* non-admin users may not subscribe */ }));
      loadHistory(c);
      if (S.route.name === 'room') loadSpark(S.route.id);
      saveCacheSoon();
    } catch (e) {
      if (c !== C) return;
      setStatus('error', 'Connected, but loading data failed: ' + e.message);
      try { c.ws && c.ws.close(); } catch (x) { /* reconnect follows */ }
    }
  }
  async function loadRegistries(c) {
    const r = await Promise.allSettled([
      c.send({ type: 'config/area_registry/list' }), c.send({ type: 'config/device_registry/list' }),
      c.send({ type: 'config/entity_registry/list' }), c.send({ type: 'config/floor_registry/list' })
    ]);
    S.areas = r[0].status === 'fulfilled' ? r[0].value : [];
    S.devices = {}; if (r[1].status === 'fulfilled') r[1].value.forEach((d) => { S.devices[d.id] = { id: d.id, area_id: d.area_id, name: d.name_by_user || d.name, manufacturer: d.manufacturer, model: d.model }; });
    S.ents = {};
    if (r[2].status === 'fulfilled') r[2].value.forEach((e) => { S.ents[e.entity_id] = { device_id: e.device_id, area_id: e.area_id, entity_category: e.entity_category, hidden: !!e.hidden_by, disabled: !!e.disabled_by }; });
    else {
      try { // fallback for restricted users: compact display registry
        const d = await c.send({ type: 'config/entity_registry/list_for_display' });
        const cats = d.entity_categories || {};
        (d.entities || []).forEach((e) => { S.ents[e.ei] = { device_id: e.di || null, area_id: e.ai || null, entity_category: e.ec != null ? cats[e.ec] : null, hidden: !!e.hb, disabled: false }; });
      } catch (e) { /* no registry access: entities will be shown without rooms */ }
    }
    S.floors = {}; if (r[3].status === 'fulfilled') r[3].value.forEach((f) => { S.floors[f.floor_id] = f; });
    modelDirty = true;
  }
  let regTimer;
  function reloadRegistriesSoon() { clearTimeout(regTimer); regTimer = setTimeout(() => { if (C && C.authed) loadRegistries(C).then(() => schedule(true)); }, 800); }

  /* History: used for the trend arrows (value ~1 hour ago) */
  async function loadHistory(c) {
    const ids = model().temps; if (!ids.length) return;
    const start = new Date(Date.now() - 75 * 60e3).toISOString();
    try {
      const res = await c.send({ type: 'history/history_during_period', start_time: start, entity_ids: ids, minimal_response: true, no_attributes: true, significant_changes_only: false }, 20000);
      for (const eid of Object.keys(res || {})) {
        S.hist[eid] = (res[eid] || []).map((p) => ({ t: p.lu != null ? p.lu * 1000 : Date.parse(p.last_updated || p.last_changed), v: parseFloat(p.s != null ? p.s : p.state) })).filter((p) => isFinite(p.v) && isFinite(p.t));
      }
      schedule(true);
    } catch (e) { /* history is optional: trend arrows simply stay hidden */ }
  }
  async function loadSpark(roomId) {
    const r = model().roomById[roomId]; if (!r || !C || !C.authed) return;
    const eid = mainTemp(r); if (!eid || !eid.startsWith('sensor.')) return;
    const cached = S.spark[eid]; if (cached && Date.now() - cached.at < 5 * 60e3) return;
    try {
      const res = await C.send({ type: 'history/history_during_period', start_time: new Date(Date.now() - 24 * 3600e3).toISOString(), entity_ids: [eid], minimal_response: true, no_attributes: true }, 20000);
      const pts = ((res || {})[eid] || []).map((p) => ({ t: p.lu != null ? p.lu * 1000 : Date.parse(p.last_updated || p.last_changed), v: parseFloat(p.s != null ? p.s : p.state) })).filter((p) => isFinite(p.v) && isFinite(p.t));
      S.spark[eid] = { at: Date.now(), pts };
      schedule(true);
    } catch (e) { /* optional */ }
  }

  /* ---------------- live updates ---------------- */
  const changed = new Set();
  function onStateChanged(d) {
    const eid = d.entity_id; const ns = d.new_state;
    if (!ns) { delete S.states[eid]; modelDirty = true; }
    else { if (!S.states[eid]) modelDirty = true; S.states[eid] = ns; }
    const p = S.pending[eid];
    if (p && ns && p.check(ns)) { clearTimeout(p.timer); delete S.pending[eid]; if (p.draftKey) delete S.draft[p.draftKey]; }
    if (ns && S.hist[eid]) { const v = parseFloat(ns.state); if (isFinite(v)) { const h = S.hist[eid]; h.push({ t: Date.now(), v }); pruneHist(h); } }
    if (ns && eid.startsWith('climate.') && ns.state !== 'off' && settings.lastMode[eid] !== ns.state) { settings.lastMode[eid] = ns.state; saveSettings(); }
    changed.add(eid);
    if (modelDirty) schedule(true); else schedule(false);
    saveCacheSoon();
  }
  function pruneHist(h) { const cut = Date.now() - 2 * 3600e3; let i = 0; while (i < h.length - 1 && h[i + 1].t < cut) i++; if (i) h.splice(0, i); }

  /* ---------------- offline cache for instant startup ---------------- */
  let cacheTimer;
  function saveCacheSoon() { if (S.demo) return; clearTimeout(cacheTimer); cacheTimer = setTimeout(saveCache, 4000); }
  function saveCache() {
    if (S.demo || !M) return;
    const keep = new Set([].concat(M.temps, M.hums, M.controls, M.climates, M.weather ? [M.weather] : []));
    M.rooms.forEach((r) => r.other.concat(r.bins).forEach((e) => keep.add(e)));
    const states = {}; const ents = {};
    keep.forEach((e) => { const s = S.states[e]; if (s) states[e] = { entity_id: e, state: s.state, attributes: s.attributes, last_changed: s.last_changed, last_updated: s.last_updated }; if (S.ents[e]) ents[e] = S.ents[e]; });
    store.set('ch.cache', { v: 1, at: Date.now(), states, ents, areas: S.areas, devices: S.devices, floors: S.floors, config: S.config });
  }
  function loadCache() {
    const c = store.get('ch.cache', null); if (!c || c.v !== 1) return false;
    S.states = c.states || {}; S.ents = c.ents || {}; S.areas = c.areas || []; S.devices = c.devices || {}; S.floors = c.floors || {}; S.config = c.config; S.stale = true; modelDirty = true; return true;
  }

  /* ---------------- model ---------------- */
  const ROOM_COLORS = ['blue', 'mint', 'warm', 'lav', 'rose', 'sand'];
  const CONTROL_KINDS = new Set(['light', 'plug', 'switch', 'fan', 'cover', 'media', 'climate', 'lock', 'scene', 'script']);
  function kindOf(eid, st) {
    const d = eid.slice(0, eid.indexOf('.')); const a = (st && st.attributes) || {};
    switch (d) {
      case 'light': return 'light';
      case 'switch': { const n = (a.friendly_name || eid).toLowerCase(); return a.device_class === 'outlet' || /plug|socket|outlet|stekker|stopcontact/.test(n) ? 'plug' : 'switch'; }
      case 'input_boolean': return 'switch';
      case 'fan': return 'fan';
      case 'cover': return 'cover';
      case 'media_player': return 'media';
      case 'climate': return 'climate';
      case 'lock': return 'lock';
      case 'scene': return 'scene';
      case 'script': return 'script';
      case 'sensor': return a.device_class === 'temperature' ? 'temp' : a.device_class === 'humidity' ? 'hum' : 'sensor';
      case 'binary_sensor': return 'binary';
      case 'weather': return 'weather';
      default: return null;
    }
  }
  const CATS = [
    { id: 'light', label: 'Lights', icon: 'light' }, { id: 'plug', label: 'Plugs', icon: 'plug' }, { id: 'switch', label: 'Switches', icon: 'switch' },
    { id: 'media', label: 'Media', icon: 'tv' }, { id: 'fan', label: 'Fans', icon: 'fan' }, { id: 'cover', label: 'Blinds', icon: 'blinds' },
    { id: 'climate', label: 'Climate', icon: 'climate' }, { id: 'lock', label: 'Locks', icon: 'lock' }, { id: 'scene', label: 'Scenes', icon: 'auto' }
  ];
  const catOf = (k) => (k === 'script' ? 'scene' : k);

  function model() {
    if (M && !modelDirty) return M;
    modelDirty = false;
    const areaById = {}; S.areas.forEach((a) => { areaById[a.area_id] = a; });
    const rooms = {}; const mk = (id) => rooms[id] || (rooms[id] = { id, temps: [], hums: [], devs: [], other: [], bins: [] });
    const m = { temps: [], hums: [], controls: [], climates: [], weather: null, areaOf: {}, kind: {} };
    const ids = Object.keys(S.states).sort((a, b) => nameOf(a).localeCompare(nameOf(b)));
    for (const eid of ids) {
      const st = S.states[eid]; const reg = S.ents[eid] || {};
      if (reg.hidden || reg.disabled || reg.entity_category) continue;
      const k = kindOf(eid, st); if (!k) continue;
      if (k === 'weather') { if (!m.weather) m.weather = eid; continue; }
      const dev = reg.device_id && S.devices[reg.device_id];
      let area = reg.area_id || (dev && dev.area_id) || null;
      if (area && !areaById[area]) area = null;
      m.kind[eid] = k; m.areaOf[eid] = area;
      const r = area ? mk(area) : null;
      if (k === 'temp') { if (st.attributes.unit_of_measurement && !/°|K$/.test(st.attributes.unit_of_measurement)) continue; m.temps.push(eid); r && r.temps.push(eid); }
      else if (k === 'hum') { m.hums.push(eid); r && r.hums.push(eid); }
      else if (CONTROL_KINDS.has(k)) { m.controls.push(eid); if (k === 'climate') m.climates.push(eid); (r || mk('_none')).devs.push(eid); }
      else if (k === 'binary') { r && r.bins.push(eid); }
      else if (k === 'sensor' && r && isFinite(parseFloat(st.state))) { r.other.push(eid); }
    }
    const list = Object.values(rooms).filter((r) => r.id !== '_none' && (r.temps.length || r.hums.length || r.devs.length || r.bins.length));
    list.forEach((r) => { const a = areaById[r.id]; r.name = a.name; r.icon = roomIcon(a.name, a.icon); r.floor = a.floor_id && S.floors[a.floor_id]; });
    list.sort((a, b) => ((a.floor ? a.floor.level : 0) - (b.floor ? b.floor.level : 0)) || a.name.localeCompare(b.name));
    list.forEach((r, i) => { r.color = ROOM_COLORS[i % ROOM_COLORS.length]; });
    m.rooms = list; m.roomById = {}; list.forEach((r) => { m.roomById[r.id] = r; });
    if (rooms._none && rooms._none.devs.length) { const u = rooms._none; u.name = 'Other devices'; u.icon = 'grid'; u.color = 'sand'; m.unassigned = u; m.roomById._none = u; }
    M = m; return m;
  }
  const ROOM_WORDS = [
    [/living|lounge|woon|sofa|family/, 'sofa'], [/bed|slaap|master|guest/, 'bed'], [/kitchen|keuken|stove|cook/, 'kitchen'], [/attic|zolder|loft/, 'attic'],
    [/bath|badkamer|toilet|wc|shower|douche/, 'bath'], [/office|study|werk|kantoor|desk/, 'office'], [/kid|child|nursery|kinder|baby/, 'baby'],
    [/garage|car|auto/, 'garage'], [/garden|tuin|yard|terrace|balcon|outdoor|patio/, 'garden'], [/hall|gang|entr|porch|hal\b|door|foyer/, 'door'],
    [/stair|trap|landing|overloop/, 'stairs'], [/dining|eet/, 'dining'], [/laundry|wash|utility|bijkeuken/, 'laundry'], [/game|play|speel/, 'game'], [/gym|fitness/, 'gym']
  ];
  function roomIcon(name, mdi) { const s = ((mdi || '') + ' ' + (name || '')).toLowerCase(); for (const [re, n] of ROOM_WORDS) if (re.test(s)) return n; return 'room'; }

  /* state access with dependency tracking (only re-render when something on screen changed) */
  let used = new Set();
  const st = (eid) => { used.add(eid); return S.states[eid]; };
  const avail = (s) => !!s && s.state !== 'unavailable' && s.state !== 'unknown';
  const numOf = (eid) => { const s = st(eid); if (!avail(s)) return null; const v = parseFloat(s.state); return isFinite(v) ? v : null; };
  function nameOf(eid, room) {
    const s = S.states[eid]; let n = (s && s.attributes.friendly_name) || eid.split('.')[1].replace(/_/g, ' ');
    if (room && room.name && n.toLowerCase().startsWith(room.name.toLowerCase() + ' ') && n.length > room.name.length + 1) n = cap(n.slice(room.name.length + 1));
    return n;
  }
  const roomNameOf = (eid) => { const a = model().areaOf[eid]; const r = a && model().roomById[a]; return r ? r.name : ''; };
  const roomOfEid = (eid) => { const a = model().areaOf[eid]; return (a && model().roomById[a]) || null; };
  const unit = () => (S.config && S.config.unit_system && S.config.unit_system.temperature) || '°C';
  function mainTemp(r) {
    const pick = settings.roomMain[r.id];
    if (pick && r.temps.includes(pick) && numOf(pick) != null) return pick;
    for (const e of r.temps) if (numOf(e) != null) return e;
    for (const e of r.devs) { const s = st(e); if (e.startsWith('climate.') && s && s.attributes.current_temperature != null) return e; }
    return r.temps[0] || null;
  }
  function tempOf(eid) { if (!eid) return null; if (eid.startsWith('climate.')) { const s = st(eid); return s && avail(s) && s.attributes.current_temperature != null ? +s.attributes.current_temperature : null; } return numOf(eid); }
  function roomHum(r) {
    for (const e of r.hums) { const v = numOf(e); if (v != null) return v; }
    for (const e of r.devs) { const s = st(e); if (e.startsWith('climate.') && avail(s) && s.attributes.current_humidity != null) return +s.attributes.current_humidity; }
    return null;
  }
  function trendOf(eid) {
    const h = S.hist[eid]; const now = tempOf(eid); if (!h || !h.length || now == null) return null;
    const cut = Date.now() - 3600e3; let past = null;
    for (const p of h) { if (p.t <= cut) past = p.v; else break; }
    if (past == null) return null;
    const d = now - past; return { d, dir: d >= 0.3 ? 'up' : d <= -0.3 ? 'down' : 'flat' };
  }
  function houseTemp() {
    const m = model(); const src = settings.houseSource;
    if (src !== 'auto' && S.states[src]) { const v = tempOf(src); return { v, label: nameOf(src) }; }
    const vals = m.rooms.map((r) => tempOf(mainTemp(r))).filter((v) => v != null);
    if (!vals.length) return { v: null, label: m.temps.length ? 'Sensors unavailable' : 'No temperature sensors' };
    return { v: vals.reduce((a, b) => a + b, 0) / vals.length, label: vals.length === 1 ? 'Indoor' : `Average of ${vals.length} rooms` };
  }
  function isOn(eid, s) {
    s = s || st(eid); if (!avail(s)) return false;
    switch (eid.slice(0, eid.indexOf('.'))) {
      case 'cover': return s.state !== 'closed';
      case 'media_player': return !['off', 'standby'].includes(s.state);
      case 'climate': return s.state !== 'off';
      case 'lock': return s.state === 'unlocked' || s.state === 'open';
      case 'scene': return false;
      default: return s.state === 'on';
    }
  }
  const canToggle = (eid, s) => {
    const k = model().kind[eid]; if (!avail(s)) return false;
    if (k === 'media') { const f = s.attributes.supported_features || 0; return isOn(eid, s) ? !!(f & 256) : !!(f & 128); }
    return ['light', 'plug', 'switch', 'fan', 'cover', 'climate'].includes(k);
  };
  function devIcon(eid, s) {
    const k = model().kind[eid] || kindOf(eid, s); const a = (s && s.attributes) || {};
    if (k === 'media') return a.device_class === 'speaker' ? 'speaker' : 'tv';
    if (k === 'plug') return /heat/.test(eid) ? 'heater' : 'plug';
    if (k === 'switch') return /heat/.test(eid) ? 'heater' : /tv/.test(eid) ? 'tv' : /fan/.test(eid) ? 'fan' : 'switch';
    if (k === 'cover') return 'blinds';
    if (k === 'scene' || k === 'script') return 'auto';
    if (k === 'binary') return { door: 'door', window: 'window', garage_door: 'garage', motion: 'motion', occupancy: 'motion', presence: 'motion', moisture: 'drop', battery: 'battery', smoke: 'alert' }[a.device_class] || 'info';
    if (k === 'sensor') return { illuminance: 'sun', power: 'bolt', energy: 'bolt', battery: 'battery', carbon_dioxide: 'leaf', pm25: 'wind', pressure: 'motion' }[a.device_class] || 'info';
    if (k === 'temp') return 'thermo'; if (k === 'hum') return 'drop';
    return { light: 'light', fan: 'fan', climate: 'climate', lock: 'lock' }[k] || 'power';
  }
  const pct = (v) => Math.round(v) + '%';
  function fmtNum(v, dec) { return (Math.round(v * Math.pow(10, dec)) / Math.pow(10, dec)).toFixed(dec); }
  const fmtT = (v) => (v == null ? '—' : fmtNum(v, 1) + '°');
  function bigT(v, cls) { if (v == null) return `<span class="${cls || 'bigt'} num">—</span>`; const s = fmtNum(v, 1).split('.'); return `<span class="${cls || 'bigt'} num">${s[0]}<small>.${s[1]}°</small></span>`; }
  function smallT(v) { if (v == null) return '—'; const s = fmtNum(v, 1).split('.'); return `${s[0]}<small>.${s[1]}°</small>`; }
  const HVAC = { off: 'Off', auto: 'Auto', heat_cool: 'Heat/Cool', cool: 'Cool', heat: 'Heat', dry: 'Dry', fan_only: 'Fan' };
  const ACTION = { cooling: 'Cooling', heating: 'Heating', drying: 'Drying', idle: 'Idle', fan: 'Fan running', off: 'Off', preheating: 'Preheating', defrosting: 'Defrosting' };
  function stateText(eid, s) {
    s = s || st(eid);
    if (!s || s.state === 'unavailable') return 'Unavailable';
    if (s.state === 'unknown') return 'Unknown';
    const a = s.attributes; const k = model().kind[eid] || kindOf(eid, s);
    switch (k) {
      case 'light': return s.state === 'on' ? (a.brightness != null ? 'On · ' + pct(a.brightness / 2.55) : 'On') : 'Off';
      case 'fan': return s.state === 'on' ? (a.percentage ? 'On · ' + pct(a.percentage) : 'On') : 'Off';
      case 'cover': { const p = a.current_position; const n = { open: 'Open', closed: 'Closed', opening: 'Opening…', closing: 'Closing…' }[s.state] || cap(s.state); return p != null && s.state === 'open' && p < 100 ? `Open · ${p}%` : n; }
      case 'media': { const n = { off: 'Off', on: 'On', idle: 'Idle', standby: 'Standby', playing: 'Playing', paused: 'Paused', buffering: 'Buffering' }[s.state] || cap(s.state); return a.media_title && s.state === 'playing' ? `${n} · ${a.media_title}` : n; }
      case 'climate': { if (s.state === 'off') return 'Off'; const t = a.temperature != null ? ' · ' + fmtT(+a.temperature) : ''; return (ACTION[a.hvac_action] && a.hvac_action !== 'idle' ? ACTION[a.hvac_action] : HVAC[s.state] || cap(s.state)) + t; }
      case 'lock': return { locked: 'Locked', unlocked: 'Unlocked', locking: 'Locking…', unlocking: 'Unlocking…', jammed: 'Jammed', open: 'Open' }[s.state] || cap(s.state);
      case 'scene': return 'Scene';
      case 'script': return s.state === 'on' ? 'Running…' : 'Script';
      case 'binary': { const on = s.state === 'on'; const m = { door: ['Closed', 'Open'], window: ['Closed', 'Open'], garage_door: ['Closed', 'Open'], opening: ['Closed', 'Open'], motion: ['Clear', 'Motion'], occupancy: ['Clear', 'Occupied'], presence: ['Away', 'Home'], moisture: ['Dry', 'Wet'], smoke: ['Clear', 'Smoke!'], battery: ['Normal', 'Low'] }[a.device_class] || ['Off', 'On']; return m[on ? 1 : 0]; }
      case 'temp': case 'hum': case 'sensor': { const v = parseFloat(s.state); if (!isFinite(v)) return cap(s.state); const u = a.unit_of_measurement || ''; const dec = k === 'temp' ? 1 : Math.abs(v) < 10 && v % 1 ? 1 : 0; return fmtNum(v, dec) + (u === '%' || u.startsWith('°') ? '' : ' ') + u; }
      default: return s.state === 'on' ? 'On' : s.state === 'off' ? 'Off' : cap(s.state);
    }
  }

  /* ---------------- commands (state only changes when Home Assistant confirms) ---------------- */
  function canSend() { if (C && C.authed) return true; toast(S.conn === 'idle' ? 'Connect to Home Assistant in Settings first' : 'Not connected to Home Assistant', 'bad'); return false; }
  async function command(eid, domain, service, data, check, opts) {
    opts = opts || {};
    if (!canSend()) return false;
    if (S.pending[eid] && !opts.replace) return false;
    if (S.pending[eid]) clearTimeout(S.pending[eid].timer);
    const label = nameOf(eid);
    const timeoutMs = opts.timeout || (domain === 'climate' ? 15000 : 10000);
    const p = { check: check || ((ns) => true), draftKey: opts.draftKey };
    p.timer = setTimeout(() => { if (S.pending[eid] !== p) return; delete S.pending[eid]; if (p.draftKey) delete S.draft[p.draftKey]; toast(`${label} didn't confirm the change yet`, 'bad'); schedule(true); }, timeoutMs);
    S.pending[eid] = p; schedule(true);
    try {
      await C.send({ type: 'call_service', domain, service, service_data: Object.assign({ entity_id: eid }, data || {}) });
      if (opts.noState) { clearTimeout(p.timer); delete S.pending[eid]; schedule(true); if (opts.okMsg) toast(opts.okMsg, 'ok'); }
      return true;
    } catch (e) {
      clearTimeout(p.timer); if (S.pending[eid] === p) delete S.pending[eid]; if (p.draftKey) delete S.draft[p.draftKey];
      toast(`Couldn't update ${label}: ${e.message}`, 'bad'); schedule(true); return false;
    }
  }
  function toggle(eid) {
    const s = S.states[eid]; if (!s) return;
    if (!avail(s)) return toast(`${nameOf(eid)} is unavailable`, 'bad');
    const k = model().kind[eid]; const was = isOn(eid, s); const d = eid.slice(0, eid.indexOf('.'));
    const changedState = (ns) => ns.state !== s.state;
    if (k === 'cover') return command(eid, 'cover', was ? 'close_cover' : 'open_cover', null, changedState);
    if (k === 'climate') return climatePower(eid);
    if (k === 'scene' || k === 'script') return run(eid);
    if (k === 'lock') { openSheet(eid); return; }
    if (k === 'media' && !canToggle(eid, s)) return openSheet(eid);
    return command(eid, d === 'input_boolean' ? 'input_boolean' : d, was ? 'turn_off' : 'turn_on', null, (ns) => isOn(eid, ns) !== was || !avail(ns));
  }
  function run(eid) {
    const d = eid.slice(0, eid.indexOf('.'));
    return command(eid, d, 'turn_on', null, null, { noState: true, okMsg: `${nameOf(eid)} ${d === 'scene' ? 'activated' : 'started'}` });
  }
  function climatePower(eid) {
    const s = S.states[eid]; if (!avail(s)) return toast(`${nameOf(eid)} is unavailable`, 'bad');
    const a = s.attributes; const f = a.supported_features || 0; const modes = a.hvac_modes || [];
    if (s.state !== 'off') {
      if (modes.includes('off')) return command(eid, 'climate', 'set_hvac_mode', { hvac_mode: 'off' }, (ns) => ns.state === 'off');
      return command(eid, 'climate', 'turn_off', null, (ns) => ns.state === 'off');
    }
    if (f & 256) return command(eid, 'climate', 'turn_on', null, (ns) => ns.state !== 'off');
    const last = settings.lastMode[eid]; const mode = last && modes.includes(last) ? last : ['auto', 'heat_cool', 'cool', 'heat'].find((m) => modes.includes(m)) || modes.find((m) => m !== 'off');
    if (!mode) return toast('This climate device has no mode to turn on', 'bad');
    return command(eid, 'climate', 'set_hvac_mode', { hvac_mode: mode }, (ns) => ns.state !== 'off');
  }
  function climStep(eid, which) { const a = S.states[eid].attributes; return +a.target_temp_step || (unit() === '°F' ? 1 : 0.5); }
  function setTarget(eid, v, which) {
    const s = S.states[eid]; if (!s || !avail(s)) return;
    const a = s.attributes; const step = climStep(eid); const min = a.min_temp != null ? +a.min_temp : 7; const max = a.max_temp != null ? +a.max_temp : 35;
    v = clamp(Math.round(v / step) * step, min, max); v = +v.toFixed(2);
    const key = eid + (which ? ':' + which : '');
    const dr = S.draft[key] || (S.draft[key] = {});
    dr.v = v; clearTimeout(dr.t); schedule(true);
    dr.t = setTimeout(() => {
      if (!canSend()) { delete S.draft[key]; schedule(true); return; }
      if (which) {
        const lo = which === 'low' ? v : (S.draft[eid + ':low'] ? S.draft[eid + ':low'].v : +a.target_temp_low);
        const hi = which === 'high' ? v : (S.draft[eid + ':high'] ? S.draft[eid + ':high'].v : +a.target_temp_high);
        if (lo === +a.target_temp_low && hi === +a.target_temp_high) { delete S.draft[key]; schedule(true); return; }
        command(eid, 'climate', 'set_temperature', { target_temp_low: lo, target_temp_high: hi }, (ns) => +ns.attributes.target_temp_low === lo && +ns.attributes.target_temp_high === hi, { replace: true, draftKey: key });
      } else {
        if (v === +a.temperature) { delete S.draft[key]; schedule(true); return; }
        command(eid, 'climate', 'set_temperature', { temperature: v }, (ns) => Math.abs(+ns.attributes.temperature - v) < 0.01, { replace: true, draftKey: key });
      }
    }, 650);
  }

  /* ---------------- theme ---------------- */
  const mql = window.matchMedia ? window.matchMedia('(prefers-color-scheme: dark)') : null;
  function minutes(hhmm) { const [h, m] = String(hhmm || '0:0').split(':').map(Number); return (h || 0) * 60 + (m || 0); }
  function effectiveTheme() {
    if (settings.theme === 'light' || settings.theme === 'dark') return settings.theme;
    if (settings.autoSource === 'system') return mql && mql.matches ? 'dark' : 'light';
    const n = new Date(); const t = n.getHours() * 60 + n.getMinutes(); const d = minutes(settings.dayStart); const nt = minutes(settings.nightStart);
    const day = d < nt ? t >= d && t < nt : t >= d || t < nt;
    return day ? 'light' : 'dark';
  }
  function applyTheme() {
    const t = effectiveTheme(); const root = document.documentElement;
    if (root.dataset.theme !== t) { root.dataset.theme = t; const m = $('meta[name="theme-color"]'); if (m) m.content = t === 'dark' ? '#15181d' : '#f2f4f7'; if (window.ComfortAndroid) try { window.ComfortAndroid.setTheme(t === 'dark'); } catch (e) { /* older wrapper */ } }
  }
  if (mql && mql.addEventListener) mql.addEventListener('change', applyTheme);

  /* ---------------- router ---------------- */
  const TABS = [['home', 'Home', 'home'], ['climate', 'Climate', 'climate'], ['rooms', 'Rooms', 'rooms'], ['devices', 'Devices', 'devices'], ['settings', 'Settings', 'settings']];
  const scrollPos = {};
  function parseRoute() {
    const h = decodeURIComponent(location.hash.replace(/^#\/?/, '')); const [name, id] = h.split('/');
    if (name === 'room' && id) return { name: 'room', id, key: 'room/' + id };
    const n = TABS.some((t) => t[0] === name) ? name : 'home'; return { name: n, key: n };
  }
  function onRoute() {
    const prev = S.route.key; if (prev) scrollPos[prev] = window.scrollY;
    S.route = parseRoute();
    if (S.sheet) { S.sheet = null; }
    render();
    window.scrollTo(0, scrollPos[S.route.key] || 0);
    if (S.route.name === 'room') loadSpark(S.route.id);
  }
  window.addEventListener('hashchange', onRoute);

  /* ---------------- rendering ---------------- */
  let queued = false; let full = false;
  function schedule(force) {
    if (force) full = true;
    if (queued) return; queued = true;
    requestAnimationFrame(() => {
      queued = false;
      if (!full) { let hit = false; changed.forEach((e) => { if (used.has(e) || e === S.sheet) hit = true; }); if (!hit) { changed.clear(); return; } }
      full = false; changed.clear(); render();
    });
  }
  function render() {
    used = new Set(['__clock']);
    applyTheme();
    let html;
    try {
      const r = S.route.name;
      html = r === 'climate' ? pClimate() : r === 'rooms' ? pRooms() : r === 'room' ? pRoom(S.route.id) : r === 'devices' ? pDevices() : r === 'settings' ? pSettings() : pHome();
    } catch (e) { console.error(e); html = `<div class="page" data-k="err"><div class="msg bad">${ic('alert')}<div>Something went wrong showing this page. ${esc(e.message)}</div></div></div>`; }
    morphInto($('#view'), html);
    morphInto($('#nav'), navHTML());
    morphInto($('#sheet'), S.sheet ? sheetHTML(S.sheet) : '');
  }

  /* tiny DOM morph: keeps elements alive so transitions play and scroll/focus survive live updates */
  function morphInto(el, html) { const t = document.createElement('template'); t.innerHTML = html; morphKids(el, t.content); }
  const keyOf = (n) => (n.nodeType === 1 ? n.getAttribute('data-k') : null);
  function morphKids(from, to) {
    const nk = Array.from(to.childNodes); const keyed = new Map();
    Array.from(from.childNodes).forEach((n) => { const k = keyOf(n); if (k) keyed.set(k, n); });
    nk.forEach((nn, i) => {
      const cur = from.childNodes[i] || null; const k = keyOf(nn);
      if (k) { const m = keyed.get(k); if (m) { keyed.delete(k); if (m !== cur) from.insertBefore(m, cur); morphNode(m, nn); } else from.insertBefore(nn, cur); }
      else if (cur && !keyOf(cur) && cur.nodeName === nn.nodeName) morphNode(cur, nn);
      else from.insertBefore(nn, cur);
    });
    while (from.childNodes.length > nk.length) from.removeChild(from.lastChild);
  }
  function morphNode(a, b) {
    if (a.nodeType !== 1) { if (a.nodeValue !== b.nodeValue) a.nodeValue = b.nodeValue; return; }
    if (a.nodeName !== b.nodeName) { a.replaceWith(b); return; }
    const ba = b.attributes;
    for (let i = ba.length - 1; i >= 0; i--) { const at = ba[i]; if (a.getAttribute(at.name) !== at.value) a.setAttribute(at.name, at.value); }
    for (let i = a.attributes.length - 1; i >= 0; i--) { const n = a.attributes[i].name; if (!b.hasAttribute(n)) a.removeAttribute(n); }
    if (a.nodeName === 'INPUT') {
      if (a.type === 'range' && a !== dragging) a.value = b.getAttribute('value');
      else if (a.type === 'checkbox' && a.hasAttribute('data-set')) a.checked = b.hasAttribute('checked');
      return; // text inputs keep what the user typed
    }
    if (a.nodeName === 'SELECT') { morphKids(a, b); if (a !== document.activeElement) { const sel = b.querySelector('option[selected]'); if (sel) a.value = sel.value; } return; }
    if (a.hasAttribute('data-static')) return;
    morphKids(a, b);
  }

  /* ---------------- shared components ---------------- */
  function navHTML() {
    const cur = S.route.name === 'room' ? 'rooms' : S.route.name;
    return `<nav class="bn" aria-label="Main"><div class="in">${TABS.map(([id, label, icon]) => `<a href="#/${id}" class="${cur === id ? 'sel' : ''}" ${cur === id ? 'aria-current="page"' : ''} data-k="n-${id}"><span class="ic">${ic(icon)}</span>${label}</a>`).join('')}</div></nav>`;
  }
  function pill() {
    if (S.demo) return `<span class="pill demo"><span class="dot"></span>Preview</span>`;
    const t = { idle: 'Not set up', connecting: 'Connecting', reconnecting: 'Reconnecting', connected: 'Connected', disconnected: 'Disconnected', error: 'Error', auth_invalid: 'Token rejected' }[S.conn];
    return `<span class="pill ${S.conn}"><span class="dot"></span>${t}</span>`;
  }
  function banner() {
    if (S.demo) return `<div class="banner demo" data-k="bn-demo">${ic('eye')}<span class="grow">Preview with sample data — not your home</span><button data-act="exit-demo">Exit</button></div>`;
    if (S.conn === 'connected' || S.conn === 'idle') return '';
    if (S.conn === 'connecting' || S.conn === 'reconnecting') return `<div class="banner ${S.conn}" data-k="bn">${ic('refresh', 'spin')}<span class="grow">${S.conn === 'connecting' ? 'Connecting to Home Assistant…' : 'Connection lost. Reconnecting…'}${S.stale ? '<br><span style="font-weight:500">Showing last known values</span>' : ''}</span>${S.conn === 'reconnecting' ? '<button data-act="retry">Retry</button>' : ''}</div>`;
    const msg = S.conn === 'disconnected' ? 'Disconnected from Home Assistant' : S.err || 'Home Assistant is unavailable';
    return `<div class="banner ${S.conn}" data-k="bn">${ic('wifioff')}<span class="grow">${esc(msg)}</span>${S.conn === 'auth_invalid' ? '<button data-act="go-settings">Settings</button>' : '<button data-act="retry">Retry</button>'}</div>`;
  }
  function toggleHTML(eid, s, cls) {
    const k = model().kind[eid];
    if (k === 'scene' || k === 'script') return `<button class="runbtn${S.pending[eid] ? ' pending' : ''}" data-act="run" data-eid="${esc(eid)}" ${avail(s) ? '' : 'disabled'} aria-label="Run ${esc(nameOf(eid))}">Run</button>`;
    if (k === 'lock') return '';
    const on = isOn(eid, s); const dis = !canToggle(eid, s) || !C || !C.authed;
    return `<button class="tg${S.pending[eid] ? ' pending' : ''}${cls ? ' ' + cls : ''}" role="switch" aria-checked="${on}" aria-label="${esc(nameOf(eid))}" data-act="toggle" data-eid="${esc(eid)}"${dis ? ' disabled' : ''}><span class="kn"></span></button>`;
  }
  function tileHTML(eid, room) {
    const s = st(eid); const k = model().kind[eid]; const on = isOn(eid, s);
    const sub = stateText(eid, s) + (room ? '' : (roomNameOf(eid) ? ' · ' + roomNameOf(eid) : ''));
    return `<div class="tile k-${k}${on ? ' on' : ''}${avail(s) ? '' : ' na'}" data-k="t-${esc(eid)}" data-act="sheet" data-eid="${esc(eid)}" role="button" tabindex="0" aria-label="${esc(nameOf(eid, room))}, ${esc(sub)}">
<div class="top"><span class="dico">${ic(devIcon(eid, s))}</span>${toggleHTML(eid, s)}</div>
<div><div class="tn">${esc(nameOf(eid, room))}</div><div class="ts">${esc(sub)}</div></div></div>`;
  }
  function rowHTML(eid, opts) {
    opts = opts || {}; const s = st(eid); const k = model().kind[eid]; const on = isOn(eid, s); const fav = settings.favorites.includes(eid);
    const rn = roomNameOf(eid); const sub = (opts.room === false || !rn ? '' : rn + ' · ') + stateText(eid, s);
    return `<div class="row k-${k}${on ? ' on' : ''}${avail(s) ? '' : ' na'}" data-k="d-${esc(eid)}">
<span class="dico">${ic(devIcon(eid, s))}</span>
<button class="rb" data-act="sheet" data-eid="${esc(eid)}"><div class="rn">${esc(nameOf(eid))}</div><div class="rs">${esc(sub)}</div></button>
<button class="star${fav ? ' fav' : ''}" data-act="fav" data-eid="${esc(eid)}" aria-label="${fav ? 'Remove from' : 'Add to'} favorites" aria-pressed="${fav}">${ic('star')}</button>
${toggleHTML(eid, s)}</div>`;
  }
  function roomCardHTML(r) {
    const e = mainTemp(r); const t = tempOf(e); const h = settings.showHum ? roomHum(r) : null; const tr = e && trendOf(e);
    const trI = tr ? `<span class="trend" title="${tr.d > 0 ? '+' : ''}${fmtNum(tr.d, 1)}° in the last hour">${ic(tr.dir === 'up' ? 'up' : tr.dir === 'down' ? 'down' : 'flat')}</span>` : '';
    const body = r.temps.length || t != null ? `<span class="rt num">${smallT(t)}</span>` : `<span class="rt" style="font-size:15px;font-weight:600;margin-top:8px">${devCount(r)}</span>`;
    return `<button class="room c-${r.color}${t == null && r.temps.length ? ' na' : ''}" data-k="r-${esc(r.id)}" data-act="room" data-id="${esc(r.id)}" aria-label="${esc(r.name)} ${t != null ? fmtT(t) : ''}">
<span class="ri">${ic(r.icon)}</span>${trI}<span class="rn">${esc(r.name)}</span>${body}${h != null ? `<span class="rh">${ic('drop')}${pct(h)}</span>` : r.temps.length && t == null ? '<span class="rh">Unavailable</span>' : '<span class="rh">&nbsp;</span>'}</button>`;
  }
  function devCount(r) { const on = r.devs.filter((e) => isOn(e)).length; return `${r.devs.length} device${r.devs.length === 1 ? '' : 's'}${on ? ` · ${on} on` : ''}`; }
  function emptyHTML(icon, text, k) { return `<div class="empty" data-k="${k || 'empty'}">${ic(icon)}<span>${text}</span></div>`; }
  function greeting(h) { return h >= 5 && h < 12 ? 'Good morning' : h >= 12 && h < 18 ? 'Good afternoon' : h >= 18 && h < 23 ? 'Good evening' : 'Good night'; }
  function welcomeHTML() {
    return `<div class="card welcome" data-k="welcome"><div class="logo">${ic('home')}</div><h2>Welcome to Comfort Home</h2><p>Connect your Home Assistant to see your rooms, temperatures and devices.</p>
<div class="btns" style="flex-direction:column"><a class="btn pri" href="#/settings" style="text-decoration:none">${ic('link')}Connect Home Assistant</a><button class="btn" data-act="demo">${ic('eye')}Preview with sample data</button></div></div>`;
  }
  const configured = () => !!EMBED || !!loadAuth() || S.demo;
  /* iPhone/iPad: explain "Add to Home Screen" when the app is opened in Safari instead of from the home screen */
  const isIOS = /iPhone|iPad|iPod/.test(navigator.userAgent) || (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
  const isStandalone = () => window.navigator.standalone === true || (window.matchMedia && window.matchMedia('(display-mode: standalone)').matches);
  function installHint() {
    if (!isIOS || isStandalone() || store.get('ch.installHintOff', false)) return '';
    return `<div class="banner install" data-k="bn-install">${ic('smartphone')}<div class="grow">Install Comfort Home on your iPhone<span>Tap the Share button, then “Add to Home Screen”. ${EMBED ? 'Open it from your home screen and log in once.' : 'Set up the connection after opening it from your home screen.'}</span></div><button data-act="dismiss-install" aria-label="Hide tip">${ic('x')}</button></div>`;
  }

  /* ---------------- HOME ---------------- */
  function pHome() {
    const now = new Date(); const m = model();
    const date = now.toLocaleDateString(undefined, { weekday: 'long', day: 'numeric', month: 'long' });
    const time = now.toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' });
    const loading = (S.conn === 'connecting' || S.conn === 'reconnecting') && !Object.keys(S.states).length;
    let out = `<div class="page" data-k="p-home">`;
    out += `<div class="hero" data-k="hero"><div class="hero-top"><div><h1 class="greet">${greeting(now.getHours())}</h1><div class="when num">${esc(date)} · ${esc(time)}</div></div>${pill()}</div>`;
    if (!configured()) { out += `<div class="hero-temp"><span class="bigt">—</span></div></div><div class="sec" data-k="w">${installHint()}${welcomeHTML()}</div></div>`; return out; }
    const ht = houseTemp();
    const w = m.weather && st(m.weather); const wt = w && avail(w) && w.attributes.temperature != null ? +w.attributes.temperature : null;
    out += `<div class="hero-temp">${bigT(ht.v)}<div class="hero-meta"><b>${esc(ht.label)}</b>${wt != null ? `<span>Outside ${fmtT(wt)}</span>` : ''}</div></div>`;
    const onNow = m.controls.filter((e) => isOn(e) && !['scene', 'script', 'lock'].includes(m.kind[e]));
    const unav = m.controls.concat(m.temps).filter((e) => !avail(st(e))).length;
    const clim = m.climates.map((e) => st(e)).filter((s) => s && avail(s) && s.state !== 'off');
    out += `<div class="status-row">`;
    out += `<span class="stat">${ic('power')}${onNow.length ? `${onNow.length} on` : 'All off'}</span>`;
    if (clim.length) { const a = clim[0].attributes; const act = a.hvac_action; out += `<span class="stat">${ic(act === 'heating' || (!act && clim[0].state === 'heat') ? 'flame' : act === 'cooling' || (!act && clim[0].state === 'cool') ? 'snow' : act === 'drying' ? 'droplet' : 'climate')}${esc(ACTION[a.hvac_action] && a.hvac_action !== 'idle' ? ACTION[a.hvac_action] : HVAC[clim[0].state] || 'On')}${a.temperature != null ? ' to ' + fmtT(+a.temperature) : ''}</span>`; }
    const open = m.rooms.reduce((n, r) => n + r.bins.filter((e) => { const s = st(e); return s && s.state === 'on' && ['door', 'window', 'garage_door', 'opening'].includes(s.attributes.device_class); }).length, 0);
    if (open) out += `<span class="stat warn">${ic('window')}${open} open</span>`;
    if (unav) out += `<span class="stat bad">${ic('alert')}${unav} unavailable</span>`;
    out += `</div></div>`;
    out += `<div class="sec" data-k="bnr">${installHint()}${banner()}</div>`;

    // rooms
    out += `<div class="sec" data-k="s-rooms"><div class="sec-h"><h2>Rooms</h2><a href="#/rooms">All rooms</a></div>`;
    if (loading) out += `<div class="rooms-grid">${'<div class="skel"></div>'.repeat(4)}</div>`;
    else if (!m.rooms.length) out += emptyHTML('rooms', S.conn === 'connected' || S.stale ? 'No rooms yet. Assign devices to areas in Home Assistant to see them here.' : 'Rooms appear once connected.');
    else out += `<div class="rooms-grid">${m.rooms.map(roomCardHTML).join('')}</div>`;
    out += `</div>`;

    // quick switches
    const favs = settings.favorites.filter((e) => S.states[e] && m.kind[e]);
    const auto = favs.length ? favs : m.controls.filter((e) => ['light', 'plug', 'switch', 'fan', 'cover', 'media'].includes(m.kind[e])).sort((a, b) => (isOn(b) - isOn(a)) || (avail(st(b)) - avail(st(a)))).slice(0, 8);
    out += `<div class="sec" data-k="s-quick"><div class="sec-h"><h2>${favs.length ? 'Favorites' : 'Quick switches'}</h2><a href="#/devices">All devices</a></div>`;
    if (loading) out += `<div class="tiles">${'<div class="skel" style="min-height:104px"></div>'.repeat(4)}</div>`;
    else if (!auto.length) out += emptyHTML('devices', 'No switchable devices found.');
    else out += `<div class="tiles">${auto.map((e) => tileHTML(e)).join('')}</div>${favs.length ? '' : `<p class="hint">Tip: tap ${ic('star')} on the Devices page to pin your own favorites here.</p>`}`;
    out += `</div>`;

    // on now
    if (!loading && m.controls.length) {
      out += `<div class="sec" data-k="s-on"><div class="sec-h"><h2>On now</h2><span class="aux">${onNow.length}</span></div>`;
      out += onNow.length ? `<div class="chips">${onNow.map((e) => `<button class="chip${m.kind[e] === 'light' ? ' on-light' : ''}" data-k="c-${esc(e)}" data-act="sheet" data-eid="${esc(e)}">${ic(devIcon(e, st(e)))}${esc(nameOf(e))}</button>`).join('')}</div>` : emptyHTML('ok', 'Everything is off.', 'e-on');
      out += `</div>`;
    }
    // climate mini
    if (m.climates.length) {
      const e = selectedClimate(m); const s = st(e); const a = (s && s.attributes) || {}; const on = isOn(e, s);
      out += `<div class="sec" data-k="s-clim"><div class="sec-h"><h2>Climate</h2><a href="#/climate">Controls</a></div>
<a class="card climini${on ? ' on' : ''}" href="#/climate" style="text-decoration:none;color:inherit"><span class="dico">${ic('climate')}</span><div><div style="font-weight:650">${esc(nameOf(e))}</div><div style="font-size:12.5px;color:var(--muted);font-weight:500">${esc(stateText(e, s))}</div></div><span class="t num">${a.current_temperature != null && avail(s) ? smallT(+a.current_temperature) : '—'}</span></a></div>`;
    }
    return out + `</div>`;
  }

  /* ---------------- CLIMATE ---------------- */
  function pClimate() {
    const m = model();
    let out = `<div class="page" data-k="p-climate"><div class="topbar"><h1>Climate</h1>${pill()}</div>${banner()}`;
    if (!configured()) return out + welcomeHTML() + '</div>';
    if (!m.climates.length) return out + emptyHTML('climate', S.conn === 'connected' ? 'No climate devices found in Home Assistant.' : 'Climate devices appear once connected.') + '</div>';
    const eid = selectedClimate(m);
    if (m.climates.length > 1) out += `<div class="chips" style="margin-bottom:12px">${m.climates.map((e) => `<button class="chip${e === eid ? ' sel' : ''}" data-k="cs-${esc(e)}" data-act="clim-sel" data-eid="${esc(e)}">${ic('climate')}${esc(nameOf(e))}</button>`).join('')}</div>`;
    return out + climateHTML(eid) + '</div>';
  }
  function selectedClimate(m) {
    if (m.climates.includes(settings.climate)) return settings.climate;
    if (!m.climates.includes(S.climSel)) S.climSel = m.climates.find((e) => isOn(e)) || m.climates[0]; // sticky for this session
    return S.climSel;
  }
  function climateHTML(eid) {
    const s = st(eid);
    if (!s) return emptyHTML('alert', 'This climate device no longer exists.');
    const a = s.attributes; const f = a.supported_features || 0; const ok = avail(s) && C && C.authed; const on = isOn(eid, s);
    const room = roomOfEid(eid); const unitS = unit();
    const min = a.min_temp != null ? +a.min_temp : 7; const max = a.max_temp != null ? +a.max_temp : 35; const step = avail(s) ? climStep(eid) : 0.5;
    const range = (f & 2) && a.target_temp_low != null && a.target_temp_high != null && (a.temperature == null || s.state === 'heat_cool');
    const single = (f & 1) && a.temperature != null;
    const dr = S.draft[eid]; const target = dr ? dr.v : single ? +a.temperature : null;
    const pending = !!S.pending[eid] || !!dr;
    let out = `<div class="card clim" data-k="clim-${esc(eid)}"><div class="clim-head"><div><div class="cn">${esc(nameOf(eid))}</div><div class="cs">${esc([room && room.name, !avail(s) ? 'Unavailable' : on ? (ACTION[a.hvac_action] || HVAC[s.state] || cap(s.state)) : 'Off'].filter(Boolean).join(' · '))}</div></div>
<button class="pwr${on ? ' on' : ''}${S.pending[eid] && !dr ? ' pending' : ''}" data-act="clim-power" data-eid="${esc(eid)}" aria-label="Power ${on ? 'off' : 'on'}" aria-pressed="${on}" ${ok ? '' : 'disabled'}>${ic('power')}</button></div>`;
    if (single || !range) {
      const p = target != null ? clamp((target - min) / (max - min || 1), 0, 1) : 0;
      const R = 100, CX = 120, CY = 120, L = 2 * Math.PI * R * 0.75, CIRC = 2 * Math.PI * R;
      const ang = (135 + 270 * p) * Math.PI / 180; const kx = CX + R * Math.cos(ang), ky = CY + R * Math.sin(ang);
      out += `<div class="dial${on ? '' : ' off'}"><svg viewBox="0 0 240 240" aria-hidden="true"><defs><linearGradient id="dg" x1="0" y1="1" x2="1" y2="0"><stop offset="0" stop-color="#7cc2f0"/><stop offset="1" stop-color="${s.state === 'heat' ? '#ef8d4b' : '#2f86d6'}"/></linearGradient></defs>
<circle class="trk" cx="120" cy="120" r="${R}" stroke-dasharray="${L.toFixed(1)} ${CIRC.toFixed(1)}" transform="rotate(135 120 120)"/>
${target != null ? `<circle class="arc" cx="120" cy="120" r="${R}" stroke-dasharray="${(L * p).toFixed(1)} ${CIRC.toFixed(1)}" transform="rotate(135 120 120)"/><circle class="knob" cx="${kx.toFixed(1)}" cy="${ky.toFixed(1)}" r="11"/>` : ''}</svg>
<div class="mid"><span class="lbl">${target != null ? 'Target' : 'Current'}</span><span class="tt num">${target != null ? smallT(target) : a.current_temperature != null ? smallT(+a.current_temperature) : '—'}</span>
${target != null ? `<span class="ct">${ic('thermo')}Room ${a.current_temperature != null ? fmtT(+a.current_temperature) : '—'}</span>` : ''}<span class="sending">${pending ? 'Sending…' : ''}</span></div></div>`;
      if (target != null) {
        out += `<div class="steppers"><button class="step" data-act="clim-step" data-eid="${esc(eid)}" data-d="-1" aria-label="Lower temperature" ${ok && target > min ? '' : 'disabled'}>${ic('minus')}</button><button class="step" data-act="clim-step" data-eid="${esc(eid)}" data-d="1" aria-label="Raise temperature" ${ok && target < max ? '' : 'disabled'}>${ic('plus')}</button></div>
<input class="range" type="range" min="${min}" max="${max}" step="${step}" value="${target}" style="--p:${(p * 100).toFixed(1)}%" data-in="clim-range" data-eid="${esc(eid)}" aria-label="Target temperature" ${ok ? '' : 'disabled'}><div class="rlab num"><span>${fmtT(min)}</span><span>${fmtT(max)}</span></div>`;
      }
    }
    if (range) {
      const lo = S.draft[eid + ':low'] ? S.draft[eid + ':low'].v : +a.target_temp_low; const hi = S.draft[eid + ':high'] ? S.draft[eid + ':high'].v : +a.target_temp_high;
      out += `<div class="range2">${[['low', 'Heat to', lo], ['high', 'Cool to', hi]].map(([w, l, v]) => `<div class="mini-step"><button data-act="clim-rstep" data-w="${w}" data-d="-1" data-eid="${esc(eid)}" aria-label="${l} lower" ${ok ? '' : 'disabled'}>${ic('minus')}</button><div><div class="l">${l}</div><div class="v num">${fmtT(v)}</div></div><button data-act="clim-rstep" data-w="${w}" data-d="1" data-eid="${esc(eid)}" aria-label="${l} higher" ${ok ? '' : 'disabled'}>${ic('plus')}</button></div>`).join('')}</div>`;
    }
    out += `</div>`;
    const modes = (a.hvac_modes || []).filter((x) => x !== 'off');
    const MI = { auto: 'auto', heat_cool: 'heatcool', cool: 'snow', heat: 'flame', dry: 'droplet', fan_only: 'fan' };
    const order = ['auto', 'heat_cool', 'cool', 'heat', 'dry', 'fan_only'];
    modes.sort((x, y) => (order.indexOf(x) + 1 || 99) - (order.indexOf(y) + 1 || 99));
    if (modes.length) out += `<div class="sec card ctl-card" data-k="cm"><h3>${ic('sunmoon')}Mode</h3><div class="modes">${modes.map((md) => `<button class="mode m-${esc(md)}${s.state === md ? ' sel' : ''}" data-act="clim-mode" data-eid="${esc(eid)}" data-v="${esc(md)}" aria-pressed="${s.state === md}" ${ok ? '' : 'disabled'}>${ic(MI[md] || 'climate')}${esc(HVAC[md] || cap(md.replace(/_/g, ' ')))}</button>`).join('')}</div></div>`;
    const opt = (title, icon, list, cur, act, bars) => `<div class="sec card ctl-card" data-k="${act}"><h3>${ic(icon)}${title}</h3><div class="fan">${list.map((v, i) => {
      const lv = bars && !/auto/i.test(v) ? list.filter((x) => !/auto/i.test(x)).indexOf(v) + 1 : 0; const n = list.filter((x) => !/auto/i.test(x)).length;
      return `<button class="${v === cur ? 'sel' : ''}" data-act="${act}" data-eid="${esc(eid)}" data-v="${esc(v)}" aria-pressed="${v === cur}" ${ok ? '' : 'disabled'}>${lv && n > 1 ? `<span class="bars">${Array.from({ length: Math.min(n, 6) }, (_, j) => `<i class="${j < lv ? 'f' : ''}" style="height:${4 + j * 2}px"></i>`).join('')}</span>` : ''}${esc(prettyMode(v))}</button>`; }).join('')}</div></div>`;
    if ((f & 8) && (a.fan_modes || []).length) out += opt('Fan speed', 'fan', a.fan_modes, a.fan_mode, 'clim-fan', true);
    if ((f & 32) && (a.swing_modes || []).length) out += opt('Air direction', 'wind', a.swing_modes, a.swing_mode, 'clim-swing', false);
    if ((f & 16) && (a.preset_modes || []).length) out += opt('Preset', 'leaf', a.preset_modes, a.preset_mode, 'clim-preset', false);
    if (!avail(s)) out += `<p class="hint" data-k="cu">${esc(nameOf(eid))} is unavailable in Home Assistant right now.</p>`;
    return out;
  }
  function prettyMode(v) { const s = String(v); if (s === 'none') return 'None'; return cap(s.replace(/_/g, ' ').replace(/([a-z])([A-Z])/g, '$1 $2').toLowerCase()); }

  /* ---------------- ROOMS ---------------- */
  function pRooms() {
    const m = model();
    let out = `<div class="page" data-k="p-rooms"><div class="topbar"><h1>Rooms</h1>${pill()}</div>${banner()}`;
    if (!configured()) return out + welcomeHTML() + '</div>';
    const list = m.rooms.concat(m.unassigned ? [m.unassigned] : []);
    if (!list.length) return out + emptyHTML('rooms', S.conn === 'connected' ? 'No rooms found. Create areas in Home Assistant and assign your devices to them.' : 'Rooms appear once connected.') + '</div>';
    let floor; out += '<div class="list">';
    list.forEach((r) => {
      if (r.floor && r.floor !== floor && Object.keys(S.floors).length > 1) { floor = r.floor; out += `<div class="grp-h" data-k="f-${esc(r.floor.floor_id)}">${esc(r.floor.name)}</div>`; }
      if (r.id === '_none' && floor) { floor = null; out += `<div class="grp-h" data-k="f-none">No room</div>`; }
      const e = mainTemp(r); const t = tempOf(e); const h = roomHum(r);
      out += `<button class="roomrow c-${r.color}" data-k="rr-${esc(r.id)}" data-act="room" data-id="${esc(r.id)}"><span class="ri">${ic(r.icon)}</span><span class="rb"><div class="rn">${esc(r.name)}</div><div class="rs">${devCount(r)}</div></span>
<span>${r.temps.length || t != null ? `<div class="rt num">${smallT(t)}</div>` : ''}${h != null ? `<div class="rh">${ic('drop')} ${pct(h)}</div>` : ''}</span><span class="chev">${ic('chev')}</span></button>`;
    });
    return out + '</div></div>';
  }
  function pRoom(id) {
    const m = model(); const r = m.roomById[id];
    let out = `<div class="page sub" data-k="p-room-${esc(id)}"><div class="topbar"><button class="iconbtn" data-act="back" aria-label="Back">${ic('back')}</button><h1>${esc(r ? r.name : 'Room')}</h1>${pill()}</div>${banner()}`;
    if (!r) return out + emptyHTML('alert', Object.keys(S.states).length ? 'This room was not found. It may have been removed in Home Assistant.' : 'Loading…') + '</div>';
    const e = mainTemp(r); const t = tempOf(e); const h = roomHum(r); const tr = e && trendOf(e);
    if (r.id !== '_none') {
      const sp = e && S.spark[e];
      out += `<div class="rhero c-${r.color}" data-k="rh"><span class="ri" style="color:var(--${r.color}-i)">${ic(r.icon)}</span><div style="flex:1;min-width:0">${bigT(t)}
<div class="meta">${h != null ? `${ic('drop')} ${pct(h)} humidity · ` : ''}${tr ? `${tr.d > 0 ? '+' : ''}${fmtNum(tr.d, 1)}° last hour` : e ? esc(nameOf(e, r)) : 'No temperature sensor'}</div>
${sp && sp.pts.length > 2 ? sparkHTML(sp.pts, r.color) : ''}</div></div>`;
    }
    const sensors = r.temps.concat(r.hums);
    if (sensors.length > 1 || (sensors.length && r.temps.length > 1)) {
      out += `<div class="sec" data-k="rs"><div class="sec-h"><h2>Sensors</h2></div><div class="list">${sensors.map((x) => {
        const s = st(x); const isMain = x === e; const isT = r.temps.includes(x);
        return `<div class="row${avail(s) ? '' : ' na'}" data-k="sn-${esc(x)}"><span class="dico">${ic(isT ? 'thermo' : 'drop')}</span><button class="rb" ${isT && r.temps.length > 1 ? `data-act="main-sensor" data-room="${esc(r.id)}" data-eid="${esc(x)}"` : `data-act="sheet" data-eid="${esc(x)}"`}><div class="rn">${esc(nameOf(x, r))}</div><div class="rs">${isMain ? 'Room temperature' : isT && r.temps.length > 1 ? 'Tap to use as room temperature' : isT ? 'Temperature sensor' : 'Humidity sensor'}</div></button><span class="rvalue num">${esc(stateText(x, s))}</span></div>`; }).join('')}</div></div>`;
    }
    out += `<div class="sec" data-k="rc"><div class="sec-h"><h2>Controls</h2><span class="aux">${r.devs.length ? devCount(r) : ''}</span></div>`;
    out += r.devs.length ? `<div class="tiles">${r.devs.map((x) => tileHTML(x, r)).join('')}</div>` : emptyHTML('devices', 'No controllable devices in this room.');
    out += `</div>`;
    const status = r.bins.concat(r.other);
    if (status.length) out += `<div class="sec" data-k="rst"><div class="sec-h"><h2>Status</h2></div><div class="list">${status.map((x) => { const s = st(x); return `<div class="row${avail(s) ? '' : ' na'}" data-k="st-${esc(x)}"><span class="dico">${ic(devIcon(x, s))}</span><div class="rb"><div class="rn">${esc(nameOf(x, r))}</div><div class="rs">${esc(ago(s))}</div></div><span class="rvalue num">${esc(stateText(x, s))}</span></div>`; }).join('')}</div></div>`;
    return out + '</div>';
  }
  function sparkHTML(pts, color) {
    const W = 300, H = 56; const t0 = pts[0].t, t1 = pts[pts.length - 1].t || t0 + 1; let lo = Infinity, hi = -Infinity;
    pts.forEach((p) => { lo = Math.min(lo, p.v); hi = Math.max(hi, p.v); }); if (hi - lo < 1) { const c = (hi + lo) / 2; lo = c - 0.5; hi = c + 0.5; }
    const xy = pts.map((p) => [((p.t - t0) / (t1 - t0 || 1)) * W, H - 4 - ((p.v - lo) / (hi - lo)) * (H - 8)]);
    const d = xy.map((q, i) => (i ? 'L' : 'M') + q[0].toFixed(1) + ' ' + q[1].toFixed(1)).join('');
    return `<svg class="spark" viewBox="0 0 ${W} ${H}" preserveAspectRatio="none" style="color:var(--${color}-i)" role="img" aria-label="Temperature over the last 24 hours, ${fmtT(lo)} to ${fmtT(hi)}"><path class="a" d="${d}L${W} ${H}L0 ${H}Z"/><path class="l" d="${d}" vector-effect="non-scaling-stroke"/></svg><div class="rlab num" style="margin-top:2px"><span>24 h ago</span><span>${fmtT(lo)} – ${fmtT(hi)}</span><span>Now</span></div>`;
  }
  function ago(s) {
    if (!s) return ''; if (!avail(s)) return 'Unavailable';
    const t = Date.parse(s.last_changed); if (!isFinite(t)) return ''; const m = Math.round((Date.now() - t) / 60000);
    return m < 1 ? 'Changed just now' : m < 60 ? `Changed ${m} min ago` : m < 1440 ? `Changed ${Math.round(m / 60)} h ago` : `Changed ${Math.round(m / 1440)} d ago`;
  }

  /* ---------------- DEVICES ---------------- */
  function pDevices() {
    const m = model();
    let out = `<div class="page" data-k="p-devices"><div class="sticky"><div class="topbar"><h1>Devices</h1>${pill()}</div>`;
    if (!configured()) return out + `</div>${welcomeHTML()}</div>`;
    out += `<label class="search" data-static>${ic('search')}<input type="search" placeholder="Search devices" value="${esc(S.q)}" data-in="search" aria-label="Search devices" autocomplete="off" enterkeyhint="search"></label></div>${banner()}`;
    const q = S.q.trim().toLowerCase();
    const all = m.controls.filter((e) => !q || nameOf(e).toLowerCase().includes(q) || roomNameOf(e).toLowerCase().includes(q) || e.includes(q));
    const favs = settings.favorites.filter((e) => all.includes(e));
    const counts = {}; all.forEach((e) => { const c = catOf(m.kind[e]); counts[c] = (counts[c] || 0) + 1; });
    const cats = CATS.filter((c) => counts[c.id]);
    if (S.cat !== 'all' && S.cat !== 'fav' && !counts[S.cat]) S.cat = 'all';
    out += `<div class="chips" style="margin-top:10px">${[{ id: 'all', label: 'All', icon: 'grid', n: all.length }].concat(favs.length ? [{ id: 'fav', label: 'Favorites', icon: 'star', n: favs.length }] : [], cats.map((c) => Object.assign({ n: counts[c.id] }, c)))
      .map((c) => `<button class="chip${S.cat === c.id ? ' sel' : ''}" data-k="cat-${c.id}" data-act="cat" data-v="${c.id}" aria-pressed="${S.cat === c.id}">${ic(c.icon)}${c.label}<span class="cnt">${c.n}</span></button>`).join('')}</div>`;
    out += `<div class="seg" style="margin-top:6px" role="group" aria-label="Group by"><button class="${settings.devGroup === 'type' ? 'sel' : ''}" data-act="group" data-v="type">${ic('list')}By type</button><button class="${settings.devGroup === 'room' ? 'sel' : ''}" data-act="group" data-v="room">${ic('rooms')}By room</button></div>`;
    let list = S.cat === 'all' ? all : S.cat === 'fav' ? favs : all.filter((e) => catOf(m.kind[e]) === S.cat);
    if (!m.controls.length) return out + `<div class="sec">${emptyHTML('devices', S.conn === 'connected' ? 'No devices found in Home Assistant.' : 'Devices appear once connected.')}</div></div>`;
    if (!list.length) return out + `<div class="sec">${emptyHTML('search', `No devices match “${esc(S.q)}”.`)}</div></div>`;
    const groups = [];
    if (settings.devGroup === 'room') {
      m.rooms.concat(m.unassigned ? [m.unassigned] : []).forEach((r) => { const g = list.filter((e) => (m.areaOf[e] || '_none') === r.id); if (g.length) groups.push([r.id, r.name, g]); });
    } else {
      CATS.forEach((c) => { const g = list.filter((e) => catOf(m.kind[e]) === c.id); if (g.length) groups.push([c.id, c.label, g]); });
    }
    out += groups.map(([id, label, g]) => `<div data-k="g-${esc(id)}"><div class="grp-h">${esc(label)} · ${g.length}</div><div class="list">${g.map((e) => rowHTML(e, { room: settings.devGroup !== 'room' })).join('')}</div></div>`).join('');
    return out + '</div>';
  }

  /* ---------------- SETTINGS ---------------- */
  function pSettings() {
    const auth = loadAuth() || {}; const m = model();
    const sameOrigin = /^https?:$/.test(location.protocol) && location.pathname.includes('/local/') ? location.origin : '';
    let out = `<div class="page" data-k="p-settings"><div class="topbar"><h1>Settings</h1>${pill()}</div>`;
    // connection
    out += `<div class="sec-h" style="margin-top:8px"><h2>Home Assistant</h2></div><div class="card set" data-k="conn"><div class="blk">`;
    if (EMBED) {
      out += S.conn === 'connected' ? `<div class="msg ok">${ic('ok')}<div>Logged in to <b>${esc((S.config && S.config.location_name) || 'Home Assistant')}</b>${S.userName ? ' as ' + esc(S.userName) : ''}<br>${m.controls.length} devices · ${m.temps.length} temperature sensors · ${m.rooms.length} rooms</div></div>`
        : S.conn === 'error' ? `<div class="msg bad">${ic('alert')}<div>${esc(S.err)}</div></div>` : `<div class="msg warn">${ic('refresh', 'spin')}<div>Connecting…</div></div>`;
      out += `<p style="font-size:13px;color:var(--muted);margin:0 2px 12px">Your login is handled by Home Assistant itself. The app stays logged in and reconnects automatically.</p><div class="btns"><button class="btn danger" data-act="embed-logout">${ic('logout')}Log out</button></div></div></div>`;
    } else {
    if (S.demo) out += `<div class="msg info">${ic('eye')}<div>You're previewing with sample data. Enter your Home Assistant details below to use your real home.</div></div>`;
    else if (S.conn === 'connected') out += `<div class="msg ok">${ic('ok')}<div>Connected to <b>${esc((S.config && S.config.location_name) || 'Home Assistant')}</b>${S.userName ? ' as ' + esc(S.userName) : ''}${S.haVersion ? ' · Home Assistant ' + esc(S.haVersion) : ''}<br>${m.controls.length} devices · ${m.temps.length} temperature sensors · ${m.rooms.length} rooms</div></div>`;
    else if (S.conn === 'error' || S.conn === 'auth_invalid') out += `<div class="msg bad">${ic('alert')}<div>${esc(S.err)}</div></div>`;
    else if (S.conn === 'connecting' || S.conn === 'reconnecting') out += `<div class="msg warn">${ic('refresh', 'spin')}<div>${S.conn === 'connecting' ? 'Connecting…' : 'Reconnecting…'}</div></div>`;
    else if (S.conn === 'disconnected') out += `<div class="msg warn">${ic('wifioff')}<div>Disconnected.</div></div>`;
    const httpsWarn = location.protocol === 'https:' && /^http:/i.test(auth.url || '');
    if (httpsWarn) out += `<div class="msg warn">${ic('alert')}<div>This app is opened from an https:// website, so Safari blocks connections to an http:// address. Use an https:// address for Home Assistant, or install the app from your Home Assistant server instead (see the install guide).</div></div>`;
    out += `<div class="field"><label for="ha-url">Server address</label><div class="inp">${ic('server')}<input id="ha-url" type="url" inputmode="url" autocomplete="url" spellcheck="false" placeholder="http://homeassistant.local:8123" value="${esc(auth.url || sameOrigin)}"></div><span class="help">Local address (http://192.168.x.x:8123) or your remote https:// address.</span></div>
${canOAuth() && !S.showToken && auth.mode !== 'token' ? `<div class="btns"><button class="btn pri" data-act="login">${ic('key')}${auth.mode === 'oauth' ? 'Log in again' : 'Log in with Home Assistant'}</button></div>
<p class="help" style="font-size:12.5px;color:var(--muted);margin:8px 2px 12px">You'll log in on your own Home Assistant page with your normal username and password. The app then stays logged in.</p>
${auth.mode === 'oauth' ? `<div class="btns"><button class="btn" data-act="${S.conn === 'disconnected' ? 'retry' : 'disconnect'}">${S.conn === 'disconnected' ? 'Reconnect' : 'Disconnect'}</button><button class="btn danger" data-act="forget">${ic('logout')}Log out</button></div>` : ''}
<div class="btns" style="margin-top:10px"><button class="btn" data-act="show-token" style="font-weight:600;color:var(--text2)">Use an access token instead</button></div>
${!auth.token && !S.demo ? `<div class="btns" style="margin-top:10px"><button class="btn" data-act="demo">${ic('eye')}Preview with sample data</button></div>` : ''}
${S.demo ? `<div class="btns" style="margin-top:10px"><button class="btn" data-act="exit-demo">Exit preview</button></div>` : ''}</div></div>` : `${canOAuth() ? `<div class="btns" style="margin-bottom:12px"><button class="btn" data-act="hide-token">${ic('back')}Log in with username and password instead</button></div>` : ''}
<div class="field"><label for="ha-token">Long-lived access token</label><div class="inp">${ic('key')}<input id="ha-token" type="${S.revealToken ? 'text' : 'password'}" autocomplete="off" spellcheck="false" placeholder="${auth.token ? 'Saved — leave empty to keep' : 'Paste token'}" value=""><button class="star" data-act="reveal" aria-label="${S.revealToken ? 'Hide' : 'Show'} token" type="button">${ic(S.revealToken ? 'eyeoff' : 'eye')}</button></div><span class="help">In Home Assistant: your profile → Security → Long-lived access tokens → Create token.</span></div>
<label class="it" style="padding:4px 0 12px;border:0" data-k="remember"><span class="lb"><b>Remember on this device</b><span>Off: you'll need the token again after closing the app</span></span><input type="checkbox" id="ha-remember" ${auth.remember !== false ? 'checked' : ''} style="width:22px;height:22px;accent-color:var(--accent)"></label>
<div class="btns"><button class="btn pri" data-act="connect" ${S.testing ? 'disabled' : ''}>${S.testing ? ic('refresh', 'spin') + 'Testing…' : ic('link') + (auth.token ? 'Save & reconnect' : 'Connect')}</button>${auth.token ? `<button class="btn" data-act="${S.conn === 'disconnected' ? 'retry' : 'disconnect'}">${S.conn === 'disconnected' ? 'Reconnect' : 'Disconnect'}</button>` : ''}</div>
${auth.token ? `<div class="btns" style="margin-top:10px"><button class="btn danger" data-act="forget">${ic('logout')}Forget this server</button></div>` : ''}
${!auth.token && !S.demo ? `<div class="btns" style="margin-top:10px"><button class="btn" data-act="demo">${ic('eye')}Preview with sample data</button></div>` : ''}
${S.demo ? `<div class="btns" style="margin-top:10px"><button class="btn" data-act="exit-demo">Exit preview</button></div>` : ''}</div></div>`}`;
    }
    // appearance
    const eff = effectiveTheme();
    out += `<div class="sec-h" style="margin-top:24px"><h2>Appearance</h2><span class="aux">Now: ${eff === 'dark' ? 'Night' : 'Day'}</span></div><div class="card set" data-k="app"><div class="blk"><div class="seg" role="group" aria-label="Theme">${[['auto', 'Automatic', 'sunmoon'], ['light', 'Day', 'sun'], ['dark', 'Night', 'moon']].map(([v, l, i]) => `<button class="${settings.theme === v ? 'sel' : ''}" data-act="theme" data-v="${v}" aria-pressed="${settings.theme === v}">${ic(i)}${l}</button>`).join('')}</div></div>`;
    if (settings.theme === 'auto') {
      out += `<div class="it"><span class="ic">${ic('clock')}</span><span class="lb"><b>Switch automatically by</b></span><select data-set="autoSource" aria-label="Automatic mode source"><option value="time" ${settings.autoSource === 'time' ? 'selected' : ''}>Time of day</option><option value="system" ${settings.autoSource === 'system' ? 'selected' : ''}>Phone setting</option></select></div>`;
      if (settings.autoSource === 'time') out += `<div class="it"><span class="ic">${ic('sun')}</span><span class="lb"><b>Day starts</b></span><input type="time" data-set="dayStart" value="${esc(settings.dayStart)}" aria-label="Day starts"></div><div class="it"><span class="ic">${ic('moon')}</span><span class="lb"><b>Night starts</b></span><input type="time" data-set="nightStart" value="${esc(settings.nightStart)}" aria-label="Night starts"></div>`;
    }
    out += `</div>`;
    // home
    const opts = [['auto', 'Average of rooms']].concat(m.temps.map((e) => [e, nameOf(e)]), m.climates.map((e) => [e, nameOf(e) + ' (room temp)']));
    out += `<div class="sec-h" style="margin-top:24px"><h2>Home screen</h2></div><div class="card set" data-k="homeset">
<div class="it"><span class="ic">${ic('thermo')}</span><span class="lb"><b>House temperature</b></span><select data-set="houseSource" aria-label="House temperature source">${opts.map(([v, l]) => `<option value="${esc(v)}" ${settings.houseSource === v ? 'selected' : ''}>${esc(l)}</option>`).join('')}</select></div>
<label class="it"><span class="ic">${ic('drop')}</span><span class="lb"><b>Show humidity on room cards</b></span><input type="checkbox" data-set="showHum" ${settings.showHum ? 'checked' : ''} style="width:22px;height:22px;accent-color:var(--accent)"></label>
<div class="it"><span class="ic">${ic('star')}</span><span class="lb"><b>Favorites</b><span>${settings.favorites.length ? settings.favorites.length + ' pinned to Home' : 'Star devices on the Devices page'}</span></span>${settings.favorites.length ? '<button class="runbtn" data-act="clear-favs">Clear</button>' : ''}</div></div>`;
    // about
    out += `<div class="sec-h" style="margin-top:24px"><h2>App</h2></div><div class="card set" data-k="about">
<div class="it"><span class="ic">${ic('smartphone')}</span><span class="lb"><b>Comfort Home</b><span>Version ${VERSION}</span></span></div>
<button class="it" data-act="reload" ${C && C.authed ? '' : 'disabled'}><span class="ic">${ic('refresh')}</span><span class="lb"><b>Reload from Home Assistant</b><span>Refresh rooms and devices</span></span></button>
<div class="it"><span class="ic">${ic('shield')}</span><span class="lb"><b>Privacy</b><span>Your token stays on this device and is only sent to your Home Assistant.</span></span></div></div>`;
    return out + '</div>';
  }

  /* ---------------- device sheet ---------------- */
  function openSheet(eid) { if (!S.states[eid]) return; S.sheet = eid; history.pushState({ sheet: 1 }, ''); schedule(true); }
  function closeSheet(fromPop) { if (!S.sheet) return; S.sheet = null; schedule(true); if (!fromPop && history.state && history.state.sheet) history.back(); }
  window.addEventListener('popstate', () => { if (S.sheet) closeSheet(true); });
  function sheetHTML(eid) {
    const s = st(eid); if (!s) return '';
    const k = model().kind[eid] || kindOf(eid, s); const a = s.attributes; const f = a.supported_features || 0; const on = isOn(eid, s); const ok = avail(s) && C && C.authed;
    const fav = settings.favorites.includes(eid); const room = roomNameOf(eid);
    const dev = S.ents[eid] && S.ents[eid].device_id && S.devices[S.ents[eid].device_id];
    let b = `<div class="scrim" data-act="close-sheet" data-k="scrim"></div><div class="sheet k-${k}${on ? ' on' : ''}" role="dialog" aria-modal="true" aria-label="${esc(nameOf(eid))}" data-k="sheet-${esc(eid)}"><div class="grab"></div>
<div class="sh"><span class="dico">${ic(devIcon(eid, s))}</span><div class="t"><b>${esc(nameOf(eid))}</b><span>${esc([room, stateText(eid, s)].filter(Boolean).join(' · '))}</span></div>
${CONTROL_KINDS.has(k) ? `<button class="star${fav ? ' fav' : ''}" data-act="fav" data-eid="${esc(eid)}" aria-label="${fav ? 'Remove from' : 'Add to'} favorites" aria-pressed="${fav}">${ic('star')}</button>` : ''}<button class="star" data-act="close-sheet" aria-label="Close">${ic('x')}</button></div>`;
    if (!avail(s)) b += `<div class="msg warn">${ic('alert')}<div>${esc(nameOf(eid))} is ${s.state === 'unknown' ? 'in an unknown state' : 'unavailable'} in Home Assistant. Check that the device is powered and reachable.</div></div>`;
    if (['light', 'plug', 'switch', 'fan'].includes(k) || (k === 'media' && canToggle(eid, s)) || (k === 'media' && !avail(s)))
      b += `<div class="bigtg"><b>${on ? 'On' : 'Off'}</b>${toggleHTML(eid, s)}</div>`;
    const slider = (label, val, min, max, stepv, act, fmt) => `<div class="ctl"><div class="hd"><span>${label}</span><b class="num" data-out="${act}">${fmt(val)}</b></div><input class="range" type="range" min="${min}" max="${max}" step="${stepv}" value="${val}" style="--p:${((val - min) / (max - min) * 100).toFixed(1)}%" data-in="${act}" data-eid="${esc(eid)}" aria-label="${label}" ${ok ? '' : 'disabled'}></div>`;
    if (k === 'light') {
      const modes = a.supported_color_modes || []; const dim = modes.some((x) => x !== 'onoff');
      if (dim) b += slider('Brightness', a.brightness != null ? Math.max(1, Math.round(a.brightness / 2.55)) : 0, 1, 100, 1, 'bri', (v) => (s.state === 'on' ? v + '%' : 'Off'));
      if (modes.includes('color_temp') && a.min_color_temp_kelvin) b += slider('Warmth', a.color_temp_kelvin || a.min_color_temp_kelvin, a.min_color_temp_kelvin, a.max_color_temp_kelvin, 50, 'ct', (v) => v + ' K');
    }
    if (k === 'fan' && (f & 1)) b += slider('Speed', a.percentage || 0, 0, 100, a.percentage_step ? Math.max(1, Math.round(a.percentage_step)) : 1, 'fanpct', (v) => v + '%');
    if (k === 'fan' && (f & 2)) b += `<div class="bigtg"><b>Oscillate</b><button class="tg${S.pending[eid] ? ' pending' : ''}" role="switch" aria-checked="${!!a.oscillating}" data-act="osc" data-eid="${esc(eid)}" ${ok ? '' : 'disabled'} aria-label="Oscillate"><span class="kn"></span></button></div>`;
    if (k === 'cover') {
      b += `<div class="btnrow" style="margin-bottom:12px">${(f & 1) || !f ? `<button class="btn" data-act="cover" data-v="open_cover" data-eid="${esc(eid)}" ${ok && s.state !== 'open' || ok && a.current_position < 100 ? '' : 'disabled'}>${ic('open')}Open</button>` : ''}${f & 8 ? `<button class="btn" data-act="cover" data-v="stop_cover" data-eid="${esc(eid)}" ${ok ? '' : 'disabled'}>${ic('stop')}Stop</button>` : ''}${(f & 2) || !f ? `<button class="btn" data-act="cover" data-v="close_cover" data-eid="${esc(eid)}" ${ok && s.state !== 'closed' ? '' : 'disabled'}>${ic('close')}Close</button>` : ''}</div>`;
      if ((f & 4) && a.current_position != null) b += slider('Position', a.current_position, 0, 100, 1, 'pos', (v) => v + '% open');
    }
    if (k === 'media') {
      if (a.media_title) b += `<div class="ctl"><div class="hd"><span>Now playing</span></div><div style="font-weight:600;margin-top:4px">${esc(a.media_title)}</div>${a.source ? `<div style="font-size:12.5px;color:var(--muted)">${esc(a.source)}</div>` : ''}</div>`;
      if ((f & 1 || f & 16384) && on) b += `<div class="btnrow" style="margin-bottom:12px"><button class="btn" data-act="media" data-v="media_play_pause" data-eid="${esc(eid)}" ${ok ? '' : 'disabled'}>${ic(s.state === 'playing' ? 'pause' : 'play')}${s.state === 'playing' ? 'Pause' : 'Play'}</button></div>`;
      if ((f & 4) && a.volume_level != null && on) b += slider('Volume', Math.round(a.volume_level * 100), 0, 100, 1, 'vol', (v) => v + '%');
    }
    if (k === 'lock') b += `<div class="btnrow" style="margin-bottom:12px"><button class="btn${s.state === 'locked' ? '' : ' pri'}" data-act="lock" data-v="lock" data-eid="${esc(eid)}" ${ok && s.state !== 'locked' ? '' : 'disabled'}>${ic('lock')}Lock</button><button class="btn" data-act="lock" data-v="unlock" data-eid="${esc(eid)}" ${ok && s.state === 'locked' ? '' : 'disabled'}>${ic('door')}Unlock</button></div>`;
    if (k === 'climate') b += `<div class="bigtg"><b>${on ? 'On' : 'Off'}</b>${toggleHTML(eid, s)}</div><a class="btn pri" style="text-decoration:none;width:100%;margin-bottom:12px" href="#/climate" data-act="clim-open" data-eid="${esc(eid)}">${ic('climate')}Open climate controls</a>`;
    if (k === 'scene' || k === 'script') b += `<button class="btn pri" style="width:100%;margin-bottom:12px" data-act="run" data-eid="${esc(eid)}" ${ok ? '' : 'disabled'}>${ic('play')}${k === 'scene' ? 'Activate scene' : 'Run script'}</button>`;
    if (S.pending[eid]) b += `<p class="meta-sm">${ic('refresh', 'spin')} Waiting for Home Assistant to confirm…</p>`;
    b += `<p class="meta-sm">${esc([dev && [dev.manufacturer, dev.model].filter(Boolean).join(' '), ago(s)].filter(Boolean).join(' · '))}</p></div>`;
    return b;
  }

  /* ---------------- toasts ---------------- */
  function toast(msg, kind, ms) {
    const box = $('#toasts'); if (!box) return;
    while (box.children.length > 2) box.firstChild.remove();
    const el = document.createElement('div'); el.className = 'toast ' + (kind || ''); el.setAttribute('role', kind === 'bad' ? 'alert' : 'status');
    el.innerHTML = ic(kind === 'bad' ? 'alert' : kind === 'ok' ? 'ok' : 'info') + `<span>${esc(msg)}</span>`;
    box.appendChild(el);
    setTimeout(() => { el.classList.add('out'); setTimeout(() => el.remove(), 300); }, ms || (kind === 'bad' ? 4500 : 2800));
  }

  /* ---------------- events ---------------- */
  let dragging = null;
  document.addEventListener('pointerdown', (e) => { if (e.target.matches && e.target.matches('input[type=range]')) dragging = e.target; }, { passive: true });
  document.addEventListener('pointerup', () => { setTimeout(() => { dragging = null; }, 50); }, { passive: true });
  document.addEventListener('pointercancel', () => { dragging = null; }, { passive: true });

  document.addEventListener('click', (e) => {
    const el = e.target.closest('[data-act]'); if (!el || el.disabled) return;
    const act = el.dataset.act; const eid = el.dataset.eid;
    switch (act) {
      case 'toggle': e.stopPropagation(); toggle(eid); break;
      case 'run': run(eid); break;
      case 'sheet': openSheet(eid); break;
      case 'close-sheet': closeSheet(); break;
      case 'room': location.hash = '#/room/' + encodeURIComponent(el.dataset.id); break;
      case 'back': if (window.__navCount > 0) history.back(); else location.hash = '#/rooms'; break;
      case 'fav': { const i = settings.favorites.indexOf(eid); if (i >= 0) settings.favorites.splice(i, 1); else settings.favorites.push(eid); saveSettings(); schedule(true); break; }
      case 'clear-favs': settings.favorites = []; saveSettings(); schedule(true); break;
      case 'cat': S.cat = el.dataset.v; schedule(true); break;
      case 'group': settings.devGroup = el.dataset.v; saveSettings(); schedule(true); break;
      case 'theme': settings.theme = el.dataset.v; saveSettings(); schedule(true); break;
      case 'clim-sel': settings.climate = eid; saveSettings(); schedule(true); break;
      case 'clim-open': settings.climate = eid; saveSettings(); S.sheet = null; break;
      case 'clim-power': climatePower(eid); break;
      case 'clim-step': { const a = S.states[eid].attributes; const cur = S.draft[eid] ? S.draft[eid].v : +a.temperature; setTarget(eid, cur + climStep(eid) * +el.dataset.d); break; }
      case 'clim-rstep': { const w = el.dataset.w; const a = S.states[eid].attributes; const key = eid + ':' + w; const cur = S.draft[key] ? S.draft[key].v : +a['target_temp_' + w]; setTarget(eid, cur + climStep(eid) * +el.dataset.d, w); break; }
      case 'clim-mode': { const v = el.dataset.v; if (S.states[eid].state !== v) command(eid, 'climate', 'set_hvac_mode', { hvac_mode: v }, (ns) => ns.state === v); break; }
      case 'clim-fan': case 'clim-swing': case 'clim-preset': {
        const attr = act.slice(5) + '_mode'; const v = el.dataset.v; if (S.states[eid].attributes[attr] === v) break;
        command(eid, 'climate', 'set_' + attr, { [attr]: v }, (ns) => ns.attributes[attr] === v); break; }
      case 'cover': command(eid, 'cover', el.dataset.v, null, (ns) => ns.state !== S.states[eid].state || ns.attributes.current_position !== S.states[eid].attributes.current_position); break;
      case 'media': command(eid, 'media_player', el.dataset.v, null, (ns) => ns.state !== S.states[eid].state); break;
      case 'osc': { const v = !S.states[eid].attributes.oscillating; command(eid, 'fan', 'oscillate', { oscillating: v }, (ns) => !!ns.attributes.oscillating === v); break; }
      case 'lock': {
        const v = el.dataset.v; if (v === 'unlock' && !confirm(`Unlock ${nameOf(eid)}?`)) break;
        command(eid, 'lock', v, null, (ns) => ns.state !== S.states[eid].state); break; }
      case 'main-sensor': settings.roomMain[el.dataset.room] = eid; saveSettings(); S.spark = {}; loadSpark(el.dataset.room); schedule(true); break;
      case 'reveal': S.revealToken = !S.revealToken; schedule(true); break;
      case 'connect': doConnect(); break;
      case 'login': { const url = normalizeUrl($('#ha-url').value); if (!url) { toast('Enter your Home Assistant address first, like http://192.168.1.20:8123', 'bad'); break; }
        if (location.protocol === 'https:' && url.startsWith('http:')) { toast('This app is opened from an https:// website, so it cannot log in to an http:// Home Assistant. Open the app from your Home Assistant server instead.', 'bad', 7000); break; }
        startLogin(url, true); break; }
      case 'show-token': S.showToken = true; schedule(true); break;
      case 'embed-logout': if (confirm('Log out of Home Assistant on this device?')) { store.del('ch.cache'); EMBED.logout(); } break;
      case 'hide-token': S.showToken = false; schedule(true); break;
      case 'disconnect': if (C) C.close(); setStatus('disconnected'); break;
      case 'retry': { const a = loadAuth(); if (C && !C.user) C.retryNow(); else if (a) startConnection(a); break; }
      case 'forget': { if (!confirm('Log out and forget this Home Assistant server on this device?')) break; const fa = loadAuth();
        if (fa && fa.mode === 'oauth' && fa.refresh) fetch(fa.url + '/auth/token', { method: 'POST', headers: { 'Content-Type': 'application/x-www-form-urlencoded' }, body: new URLSearchParams({ action: 'revoke', token: fa.refresh }).toString() }).catch(() => { /* best effort */ });
        if (C) C.close(); C = null; saveAuth(null); store.del('ch.cache'); clearData(); S.config = null; S.everConnected = false; setStatus('idle'); S.userName = ''; toast('Logged out. Nothing is stored on this device anymore.', 'ok'); break; }
      case 'demo': startDemo(); location.hash = '#/home'; break;
      case 'exit-demo': { if (C) C.close(); C = null; S.demo = false; clearData(); const a = loadAuth(); if (a) { loadCache(); startConnection(a); } else setStatus('idle'); break; }
      case 'go-settings': location.hash = '#/settings'; break;
      case 'dismiss-install': store.set('ch.installHintOff', true); schedule(true); break;
      case 'reload': if (C && C.authed) { loadRegistries(C).then(() => C.send({ type: 'get_states' })).then((states) => { S.states = {}; states.forEach((x) => { S.states[x.entity_id] = x; }); modelDirty = true; schedule(true); toast('Reloaded from Home Assistant', 'ok'); }).catch((er) => toast('Reload failed: ' + er.message, 'bad')); } break;
    }
  });
  document.addEventListener('keydown', (e) => {
    if ((e.key === 'Enter' || e.key === ' ') && e.target.matches('[role=button][data-act]')) { e.preventDefault(); e.target.click(); }
    if (e.key === 'Escape' && S.sheet) closeSheet();
  });
  document.addEventListener('input', (e) => {
    const el = e.target; const k = el.dataset && el.dataset.in; if (!k) return;
    if (k === 'search') { S.q = el.value; schedule(true); return; }
    if (el.type === 'range') {
      const p = ((el.value - el.min) / (el.max - el.min)) * 100; el.style.setProperty('--p', p.toFixed(1) + '%');
      const out = el.parentElement.querySelector(`[data-out="${k}"]`); const v = +el.value;
      if (out) out.textContent = k === 'ct' ? v + ' K' : k === 'pos' ? v + '% open' : v + '%';
      if (k === 'clim-range') setTarget(el.dataset.eid, v);
    }
  });
  document.addEventListener('change', (e) => {
    const el = e.target;
    if (el.dataset && el.dataset.set) { const key = el.dataset.set; settings[key] = el.type === 'checkbox' ? el.checked : el.value; saveSettings(); schedule(true); return; }
    const k = el.dataset && el.dataset.in; if (!k || el.type !== 'range') return;
    const eid = el.dataset.eid; const s = S.states[eid]; if (!s) return; const v = +el.value; const a = s.attributes;
    dragging = null;
    if (k === 'bri') { const b = Math.round(v * 2.55); command(eid, 'light', 'turn_on', { brightness_pct: v }, (ns) => ns.state === 'on' && Math.abs((ns.attributes.brightness || 0) - b) <= 3); }
    else if (k === 'ct') command(eid, 'light', 'turn_on', { color_temp_kelvin: v }, (ns) => Math.abs((ns.attributes.color_temp_kelvin || 0) - v) <= 60);
    else if (k === 'fanpct') command(eid, 'fan', 'set_percentage', { percentage: v }, (ns) => (ns.attributes.percentage || 0) === v || (v === 0 && ns.state === 'off'));
    else if (k === 'pos') { if (v !== a.current_position) command(eid, 'cover', 'set_cover_position', { position: v }, (ns) => ns.attributes.current_position === v); }
    else if (k === 'vol') command(eid, 'media_player', 'volume_set', { volume_level: v / 100 }, (ns) => Math.abs((ns.attributes.volume_level || 0) * 100 - v) < 1.5);
    schedule(true);
  });

  async function doConnect() {
    const url = normalizeUrl($('#ha-url').value); const tokIn = $('#ha-token').value.trim(); const remember = $('#ha-remember').checked;
    const prev = loadAuth() || {}; const token = tokIn || prev.token;
    if (!url) return toast('Enter a valid Home Assistant address, like http://192.168.1.10:8123', 'bad');
    if (!token) return toast('Paste a long-lived access token', 'bad');
    if (location.protocol === 'https:' && url.startsWith('http:')) return toast('An HTTPS page cannot connect to an http:// address. Use https://', 'bad');
    S.testing = true; schedule(true);
    // test first, so a typo doesn't replace a working configuration
    const result = await testConnection(url, token);
    S.testing = false;
    if (!result.ok) { toast(result.msg, 'bad', 6000); schedule(true); return; }
    if (S.demo) { S.demo = false; }
    saveAuth({ url, token, remember, mode: 'token' });
    $('#ha-token').value = ''; S.revealToken = false;
    clearData(); S.everConnected = false; store.del('ch.cache');
    toast('Connected to Home Assistant', 'ok');
    startConnection({ url, token });
  }
  function testConnection(url, token) {
    return new Promise((resolve) => {
      let ws; let done = false; const finish = (r) => { if (done) return; done = true; clearTimeout(t); try { ws && ws.close(); } catch (e) { /* */ } resolve(r); };
      const t = setTimeout(() => finish({ ok: false, msg: `No answer from ${url}. Check the address, port and network.` }), 10000);
      try { ws = new WebSocket(wsUrl(url)); } catch (e) { return finish({ ok: false, msg: friendlyOpenError(e) }); }
      ws.onmessage = (ev) => { let m; try { m = JSON.parse(ev.data); } catch (e) { return; }
        if (m.type === 'auth_required') ws.send(JSON.stringify({ type: 'auth', access_token: token }));
        else if (m.type === 'auth_ok') finish({ ok: true });
        else if (m.type === 'auth_invalid') finish({ ok: false, msg: 'Home Assistant rejected this token. Check that you copied the whole token.' }); };
      ws.onclose = () => finish({ ok: false, msg: `Could not connect to ${url}. Check the address and that Home Assistant is running.` });
    });
  }

  /* swipe the sheet down to close */
  (function () {
    let y0 = null, sh = null, dy = 0;
    document.addEventListener('touchstart', (e) => { const s = e.target.closest('.sheet'); if (!s || s.scrollTop > 0 || e.target.closest('input')) return; sh = s; y0 = e.touches[0].clientY; dy = 0; }, { passive: true });
    document.addEventListener('touchmove', (e) => { if (!sh) return; dy = Math.max(0, e.touches[0].clientY - y0); sh.style.transform = dy ? `translateY(${dy}px)` : ''; sh.style.transition = 'none'; }, { passive: true });
    document.addEventListener('touchend', () => { if (!sh) return; const s = sh; sh = null; s.style.transition = 'transform .2s'; if (dy > 110) { s.style.transform = 'translateY(100%)'; setTimeout(() => { s.style.transform = ''; closeSheet(); }, 180); } else s.style.transform = ''; }, { passive: true });
  })();

  /* wake up: reconnect quickly when the phone comes back */
  document.addEventListener('visibilitychange', () => { if (document.visibilityState === 'visible') { applyTheme(); if (C) C.retryNow(); schedule(true); } });
  window.addEventListener('online', () => { if (C) C.retryNow(); });
  window.addEventListener('pageshow', (e) => { if (e.persisted && C) C.retryNow(); });  // iOS restores pages from memory
  window.addEventListener('offline', () => { if (C && C.ws) try { C.ws.close(); } catch (e) { /* */ } });
  setInterval(() => { applyTheme(); if (S.route.name === 'home' || S.route.name === 'room') { changed.add('__clock'); schedule(false); } }, 20000);
  window.__navCount = 0; window.addEventListener('hashchange', () => { window.__navCount++; });

  /* ---------------- boot ---------------- */
  S.route = parseRoute();
  applyTheme();
  const q = new URLSearchParams(location.search);
  const auth = loadAuth();
  if (EMBED) { loadCache(); C = new HassConn(EMBED); C.start(); }
  else if (q.get('auth_callback') && q.get('code')) { S.route = parseRoute(); finishLogin(q).then((a) => { if (a) { clearData(); S.everConnected = false; startConnection(a); } schedule(true); }); }
  else if (q.get('auth_callback')) { history.replaceState(null, '', location.pathname + '#/settings'); S.route = parseRoute(); toast('Login was cancelled', 'bad'); }
  else if (auth && auth.url && auth.token) { loadCache(); startConnection(auth); }
  else if (/[?&]preview\b/.test(location.search)) startDemo();
  render();
  if (!EMBED && 'serviceWorker' in navigator && window.isSecureContext && location.protocol !== 'file:') navigator.serviceWorker.register('sw.js', { updateViaCache: 'none' }).catch(() => { /* optional */ });
  window.__comfort = { S, settings, model: () => model(), version: VERSION }; // for debugging; contains no token
})();
