/* Comfort Home — simulated Home Assistant (WebSocket protocol).
   Used ONLY for the clearly-labelled "Preview with sample data" mode and for automated tests.
   It is never loaded when you connect to your real Home Assistant. */
(function (root) {
  'use strict';
  function iso(t) { return new Date(t).toISOString(); }
  function clone(o) { return JSON.parse(JSON.stringify(o)); }

  function DemoHA(opts) {
    opts = opts || {};
    this.opts = opts;
    this.delay = opts.delay == null ? 350 : opts.delay;
    this.sessions = new Set();
    this.failServices = new Set();      // entity_ids whose service calls return an error
    this.ignoreServices = new Set();    // entity_ids that accept calls but never change (timeout test)
    this.ctx = 1;
    this._build();
    if (opts.drift !== false) this._driftTimer = setInterval(() => this._drift(), opts.driftMs || 15000);
  }

  DemoHA.prototype._build = function () {
    const now = Date.now();
    this.floors = [
      { floor_id: 'ground', name: 'Ground floor', level: 0 },
      { floor_id: 'first', name: 'First floor', level: 1 },
      { floor_id: 'top', name: 'Attic', level: 2 }
    ];
    this.areas = [
      { area_id: 'living_room', name: 'Living room', icon: 'mdi:sofa', floor_id: 'ground' },
      { area_id: 'kitchen', name: 'Kitchen', icon: 'mdi:stove', floor_id: 'ground' },
      { area_id: 'bedroom', name: 'Bedroom', icon: 'mdi:bed', floor_id: 'first' },
      { area_id: 'bathroom', name: 'Bathroom', icon: null, floor_id: 'first' },
      { area_id: 'office', name: 'Office', icon: null, floor_id: 'first' },
      { area_id: 'attic', name: 'Attic', icon: null, floor_id: 'top' }
    ];
    this.devices = [];
    this.ents = [];
    this.states = {};
    const dev = (id, name, area, manufacturer, model) => { this.devices.push({ id, name, name_by_user: null, area_id: area, manufacturer: manufacturer || 'Demo', model: model || '' }); return id; };
    const ent = (entity_id, state, attributes, device_id, extra) => {
      this.ents.push(Object.assign({ entity_id, device_id: device_id || null, area_id: null, entity_category: null, hidden_by: null, disabled_by: null, name: null, platform: 'demo' }, extra || {}));
      this.states[entity_id] = { entity_id, state: String(state), attributes, last_changed: iso(now - 3600e3), last_updated: iso(now - 600e3), context: { id: 'c0' } };
    };
    const T = (name) => ({ unit_of_measurement: '°C', device_class: 'temperature', state_class: 'measurement', friendly_name: name });
    const H = (name) => ({ unit_of_measurement: '%', device_class: 'humidity', state_class: 'measurement', friendly_name: name });

    let d = dev('d_lr_th', 'Living room sensor', 'living_room', 'Aqara', 'Temperature and humidity sensor');
    ent('sensor.living_room_temperature', 21.4, T('Living room Temperature'), d);
    ent('sensor.living_room_humidity', 48, H('Living room Humidity'), d);
    ent('sensor.living_room_sensor_battery', 87, { unit_of_measurement: '%', device_class: 'battery', friendly_name: 'Living room sensor Battery' }, d, { entity_category: 'diagnostic' });
    d = dev('d_lr_lux', 'Living room motion', 'living_room', 'Philips', 'Hue motion sensor');
    ent('sensor.living_room_illuminance', 142, { unit_of_measurement: 'lx', device_class: 'illuminance', friendly_name: 'Living room Illuminance' }, d);
    d = dev('d_k_th', 'Kitchen sensor', 'kitchen');
    ent('sensor.kitchen_temperature', 22.1, T('Kitchen Temperature'), d);
    ent('sensor.kitchen_humidity', 45, H('Kitchen Humidity'), d);
    d = dev('d_b_th', 'Bedroom sensor', 'bedroom');
    ent('sensor.bedroom_temperature', 19.3, T('Bedroom Temperature'), d);
    ent('sensor.bedroom_humidity', 53, H('Bedroom Humidity'), d);
    d = dev('d_ba_th', 'Bathroom sensor', 'bathroom');
    ent('sensor.bathroom_temperature', 22.8, T('Bathroom Temperature'), d);
    ent('sensor.bathroom_humidity', 68, H('Bathroom Humidity'), d);
    d = dev('d_o_th', 'Office sensor', 'office');
    ent('sensor.office_temperature', 20.6, T('Office Temperature'), d);
    d = dev('d_o_desk', 'Desk sensor', 'office');
    ent('sensor.office_desk_temperature', 21.2, T('Desk sensor Temperature'), d);
    ent('sensor.office_desk_humidity', 44, H('Desk sensor Humidity'), d);
    d = dev('d_a_th', 'Attic sensor', 'attic');
    ent('sensor.attic_temperature', 16.7, T('Attic Temperature'), d);
    ent('sensor.attic_humidity', 61, H('Attic Humidity'), d);

    // lights
    d = dev('d_l1', 'Ceiling light', 'living_room', 'Philips', 'Hue White Ambiance');
    ent('light.living_room_ceiling', 'on', { friendly_name: 'Living room Ceiling', brightness: 178, color_mode: 'color_temp', color_temp_kelvin: 3200, min_color_temp_kelvin: 2200, max_color_temp_kelvin: 6500, supported_color_modes: ['color_temp'], supported_features: 40 }, d);
    d = dev('d_l2', 'Floor lamp', 'living_room', 'IKEA', 'TRADFRI');
    ent('light.living_room_floor_lamp', 'off', { friendly_name: 'Living room Floor lamp', supported_color_modes: ['brightness'], supported_features: 32 }, d);
    d = dev('d_l3', 'Kitchen spots', 'kitchen');
    ent('light.kitchen_spots', 'on', { friendly_name: 'Kitchen Spots', brightness: 255, color_mode: 'hs', hs_color: [30, 60], supported_color_modes: ['hs', 'color_temp'] }, d);
    d = dev('d_l4', 'Bedside lamp', 'bedroom');
    ent('light.bedroom_bedside', 'off', { friendly_name: 'Bedroom Bedside lamp', supported_color_modes: ['brightness'] }, d);
    d = dev('d_l5', 'Attic light', 'attic');
    ent('light.attic', 'off', { friendly_name: 'Attic Light', supported_color_modes: ['onoff'] }, d);
    d = dev('d_l6', 'Mirror light', 'bathroom');
    ent('light.bathroom_mirror', 'unavailable', { friendly_name: 'Bathroom Mirror light', supported_color_modes: ['onoff'] }, d);

    // plugs & switches
    d = dev('d_p1', 'TV plug', 'living_room', 'Shelly', 'Plug S');
    ent('switch.tv_plug', 'on', { friendly_name: 'TV plug', device_class: 'outlet' }, d);
    ent('sensor.tv_plug_power', 86.4, { friendly_name: 'TV plug Power', unit_of_measurement: 'W', device_class: 'power' }, d);
    ent('switch.tv_plug_child_lock', 'off', { friendly_name: 'TV plug Child lock' }, d, { entity_category: 'config' });
    ent('sensor.tv_plug_wifi_signal', -61, { friendly_name: 'TV plug Wi-Fi signal', unit_of_measurement: 'dBm' }, d, { entity_category: 'diagnostic' });
    d = dev('d_p2', 'Coffee machine', 'kitchen', 'Shelly', 'Plug S');
    ent('switch.coffee_machine', 'off', { friendly_name: 'Coffee machine', device_class: 'outlet' }, d);
    d = dev('d_p3', 'Attic heater plug', 'attic');
    ent('switch.attic_heater', 'off', { friendly_name: 'Attic Heater', device_class: 'outlet' }, d);
    ent('input_boolean.guest_mode', 'off', { friendly_name: 'Guest mode', icon: 'mdi:account' }, null);

    // media / fans / covers
    d = dev('d_tv', 'Living room TV', 'living_room', 'LG', 'webOS TV');
    ent('media_player.living_room_tv', 'playing', { friendly_name: 'Living room TV', device_class: 'tv', volume_level: 0.22, is_volume_muted: false, media_title: 'Evening News', source: 'NPO 1', supported_features: 152461 }, d);
    d = dev('d_f1', 'Bedroom fan', 'bedroom', 'Dyson');
    ent('fan.bedroom', 'off', { friendly_name: 'Bedroom Fan', percentage: 0, percentage_step: 10, oscillating: false, supported_features: 3 }, d);
    d = dev('d_f2', 'Desk fan', 'office');
    ent('fan.office_desk', 'on', { friendly_name: 'Office Desk fan', percentage: 40, percentage_step: 20, supported_features: 1 }, d);
    d = dev('d_c1', 'Living room blinds', 'living_room', 'Somfy');
    ent('cover.living_room_blinds', 'open', { friendly_name: 'Living room Blinds', device_class: 'blind', current_position: 100, supported_features: 15 }, d);
    d = dev('d_c2', 'Bedroom blinds', 'bedroom', 'Somfy');
    ent('cover.bedroom_blinds', 'closed', { friendly_name: 'Bedroom Blinds', device_class: 'blind', current_position: 0, supported_features: 15 }, d);

    // climate (Comfort-Cloud-like air conditioners)
    const acAttrs = (name, cur, tgt, fan, swing) => ({ friendly_name: name, hvac_modes: ['off', 'auto', 'cool', 'heat', 'dry', 'fan_only'], min_temp: 16, max_temp: 30, target_temp_step: 0.5,
      fan_modes: ['Auto', 'Low', 'LowMid', 'Mid', 'HighMid', 'High'], swing_modes: ['Auto', 'Up', 'UpMid', 'Mid', 'DownMid', 'Down'], preset_modes: ['none', 'eco', 'boost', 'quiet'],
      current_temperature: cur, temperature: tgt, fan_mode: fan, swing_mode: swing, preset_mode: 'none', hvac_action: 'idle', supported_features: 1 | 8 | 16 | 32 | 128 | 256 });
    d = dev('d_ac1', 'Living room AC', 'living_room', 'Panasonic', 'CS-Z25');
    ent('climate.living_room_ac', 'cool', acAttrs('Living room AC', 21.4, 21, 'Auto', 'Auto'), d);
    this.states['climate.living_room_ac'].attributes.hvac_action = 'cooling';
    d = dev('d_ac2', 'Bedroom AC', 'bedroom', 'Panasonic', 'CS-Z20');
    ent('climate.bedroom_ac', 'off', acAttrs('Bedroom AC', 19.3, 20, 'Low', 'Mid'), d);
    this.states['climate.bedroom_ac'].attributes.hvac_action = 'off';
    d = dev('d_th', 'Boiler', null, 'OpenTherm', 'OTGW');
    ent('climate.opentherm_gateway_otgw_dhw_control', 'auto', { friendly_name: 'OpenTherm Gateway (OTGW) DHW Control', hvac_modes: ['auto', 'heat', 'cool', 'off'], min_temp: 30, max_temp: 70, temperature: 60, supported_features: 1 }, d);
    ent('climate.thermostat', 'heat', { friendly_name: 'Thermostaat', hvac_modes: ['heat', 'cool', 'off'], min_temp: 5, max_temp: 30, target_temp_step: 0.5, current_temperature: 19.5, temperature: 19.5, hvac_action: 'idle', supported_features: 1 }, d);
    d = 'd_ac2';
    ent('sensor.bedroom_ac_inside_temperature', 19, T('Bedroom AC Inside Temperature'), d);
    ent('sensor.bedroom_ac_outside_temperature', 0, T('Bedroom AC Outside Temperature'), d);
    d = 'd_ac1';
    ent('sensor.living_room_ac_inside_temperature', 21, T('Living room AC Inside Temperature'), d);
    ent('sensor.living_room_ac_outside_temperature', 7, T('Living room AC Outside Temperature'), d);

    // misc
    d = dev('d_lock', 'Front door lock', null, 'Nuki');
    ent('lock.front_door', 'locked', { friendly_name: 'Front door' }, d);
    ent('binary_sensor.front_door', 'off', { friendly_name: 'Front door contact', device_class: 'door' }, null, { area_id: 'living_room' });
    ent('binary_sensor.bedroom_window', 'on', { friendly_name: 'Bedroom Window', device_class: 'window' }, null, { area_id: 'bedroom' });
    ent('binary_sensor.kitchen_motion', 'off', { friendly_name: 'Kitchen Motion', device_class: 'motion' }, null, { area_id: 'kitchen' });
    ent('scene.movie_night', iso(now - 86400e3), { friendly_name: 'Movie night' }, null, { area_id: 'living_room' });
    ent('script.goodnight', 'off', { friendly_name: 'Goodnight' }, null);
    ent('weather.home', 'cloudy', { friendly_name: 'Home', temperature: 7.5, temperature_unit: '°C', humidity: 81 }, null);
    ent('sun.sun', 'below_horizon', { friendly_name: 'Sun' }, null);
    ent('sensor.outdoor_temperature_hidden', 7.4, T('Old outdoor sensor'), null, { hidden_by: 'user' });

    if (this.opts.flaky) {
      d = dev('d_bad1', 'Garden plug', null, 'Generic');
      ent('switch.garden_plug', 'off', { friendly_name: 'Garden plug', device_class: 'outlet' }, d);
      this.failServices.add('switch.garden_plug');
      d = dev('d_bad2', 'Hallway light', null, 'Generic');
      ent('light.hallway', 'off', { friendly_name: 'Hallway light', supported_color_modes: ['onoff'] }, d);
      this.ignoreServices.add('light.hallway');
    }
    this.lastMode = { 'climate.living_room_ac': 'cool', 'climate.bedroom_ac': 'heat' };
    this.autos = {};
    const auto = (id, alias, cfg, state) => { this.autos[id] = Object.assign({ id, alias, description: '', mode: 'single' }, cfg); ent('automation.' + alias.toLowerCase().replace(/[^a-z0-9]+/g, '_'), state || 'on', { id, friendly_name: alias, last_triggered: null, mode: 'single' }, null); };
    auto('1700000001', 'Morning lights', { triggers: [{ trigger: 'time', at: '07:00:00' }], conditions: [{ condition: 'time', weekday: ['mon', 'tue', 'wed', 'thu', 'fri'] }], actions: [{ action: 'light.turn_on', target: { entity_id: ['light.living_room_ceiling', 'light.kitchen_spots'] } }] });
    auto('1700000002', 'Lights out at night', { triggers: [{ platform: 'time', at: '23:30:00' }], action: [{ service: 'light.turn_off', target: { entity_id: 'all' } }] });
    auto('1700000003', 'Coffee on weekend', { triggers: [{ trigger: 'time', at: '09:15:00' }], conditions: [{ condition: 'time', weekday: ['sat', 'sun'] }], actions: [{ action: 'switch.turn_on', target: { entity_id: 'switch.coffee_machine' } }] }, 'off');
    auto('1700000004', 'Hall light on motion', { triggers: [{ trigger: 'state', entity_id: 'binary_sensor.kitchen_motion', to: 'on' }], actions: [{ action: 'light.turn_on', target: { entity_id: 'light.kitchen_spots' } }] });
  };

  DemoHA.prototype.setState = function (eid, state, attrPatch) {
    const old = this.states[eid] ? clone(this.states[eid]) : null;
    const now = iso(Date.now());
    let ns;
    if (state === null) { delete this.states[eid]; ns = null; }
    else {
      ns = old ? clone(old) : { entity_id: eid, attributes: {}, last_changed: now };
      if (String(state) !== ns.state) ns.last_changed = now;
      ns.state = String(state);
      ns.attributes = Object.assign({}, ns.attributes, attrPatch || {});
      ns.last_updated = now;
      ns.context = { id: 'c' + (this.ctx++) };
      this.states[eid] = ns;
    }
    this._emit('state_changed', { entity_id: eid, old_state: old, new_state: ns });
  };

  DemoHA.prototype._emit = function (event_type, data) {
    const ev = { event_type, data, origin: 'LOCAL', time_fired: iso(Date.now()), context: { id: 'e' + this.ctx } };
    this.sessions.forEach(s => s._event(event_type, ev));
  };

  DemoHA.prototype._drift = function () {
    Object.values(this.states).forEach(s => {
      if (s.attributes.device_class === 'temperature' && s.entity_id.startsWith('sensor.') && Math.random() < 0.4) {
        const v = parseFloat(s.state) + (Math.random() < 0.5 ? -0.1 : 0.1);
        this.setState(s.entity_id, v.toFixed(1));
      }
      if (s.entity_id.startsWith('climate.') && s.state !== 'off') {
        const a = s.attributes; let cur = a.current_temperature;
        if (s.state === 'cool' && cur > a.temperature) cur = +(cur - 0.1).toFixed(1);
        else if (s.state === 'heat' && cur < a.temperature) cur = +(cur + 0.1).toFixed(1);
        if (cur !== a.current_temperature) this.setState(s.entity_id, s.state, { current_temperature: cur, hvac_action: this._action(s.state, cur, a.temperature) });
      }
    });
  };
  DemoHA.prototype._action = function (mode, cur, tgt) {
    if (mode === 'off') return 'off';
    if (mode === 'cool') return cur > tgt ? 'cooling' : 'idle';
    if (mode === 'heat') return cur < tgt ? 'heating' : 'idle';
    if (mode === 'dry') return 'drying';
    if (mode === 'fan_only') return 'fan';
    return cur > tgt + 0.5 ? 'cooling' : (cur < tgt - 0.5 ? 'heating' : 'idle');
  };

  DemoHA.prototype._history = function (msg) {
    const out = {}; const start = Date.parse(msg.start_time) / 1000; const end = msg.end_time ? Date.parse(msg.end_time) / 1000 : Date.now() / 1000;
    (msg.entity_ids || []).forEach(eid => {
      const s = this.states[eid]; if (!s) return;
      const cur = parseFloat(s.state); if (!isFinite(cur)) { out[eid] = [{ s: s.state, lu: start }]; return; }
      const pts = []; const seed = eid.length;
      for (let t = start; t <= end; t += 600) {
        const k = (end - t) / 3600; // hours ago
        const v = cur + Math.sin((t / 3600 + seed) / 3) * 0.8 - Math.sin((end / 3600 + seed) / 3) * 0.8 + (k > 0 ? Math.sin(k * 1.7 + seed) * 0.15 : 0);
        pts.push({ s: v.toFixed(1), lu: t });
      }
      pts[pts.length - 1].s = s.state;
      out[eid] = pts;
    });
    return out;
  };

  DemoHA.prototype._service = function (domain, service, data, cb) {
    this.calls = this.calls || []; this.calls.push({ domain, service, data: JSON.parse(JSON.stringify(data)), at: Date.now() });
    this.logbook = this.logbook || []; this.scenes = this.scenes || {};
    if (domain === 'logbook' && service === 'log') { this.logbook.push({ when: Date.now() / 1000, name: data.name, message: data.message, entity_id: data.entity_id }); return cb(null); }
    if (domain === 'scene' && service === 'create') { const snap = {}; [].concat(data.snapshot_entities || []).forEach((e) => { if (this.states[e]) snap[e] = JSON.parse(JSON.stringify(this.states[e])); }); this.scenes[data.scene_id] = snap; this.setState('scene.' + data.scene_id, 'unknown', { friendly_name: data.scene_id, entity_id: Object.keys(snap) }); return cb(null); }
    if (domain === 'scene' && service === 'turn_on' && [].concat(data.entity_id || []).some((e) => this.scenes[e.replace('scene.', '')])) {
      [].concat(data.entity_id).forEach((sid) => { const snap = this.scenes[sid.replace('scene.', '')] || {}; Object.keys(snap).forEach((e) => setTimeout(() => this.setState(e, snap[e].state, snap[e].attributes), this.delay)); });
      return cb(null);
    }
    const ids = [].concat(data.entity_id || []);
    for (const eid of ids) {
      if (!this.states[eid]) return cb({ code: 'not_found', message: 'Entity ' + eid + ' not found' });
      if (this.failServices.has(eid)) return cb({ code: 'home_assistant_error', message: 'Device is offline' });
      if (this.states[eid].state === 'unavailable') return cb({ code: 'home_assistant_error', message: 'Entity is unavailable' });
    }
    cb(null);
    setTimeout(() => ids.forEach(eid => { if (!this.ignoreServices.has(eid)) this._apply(domain, service, data, eid); }), this.delay);
  };

  DemoHA.prototype._apply = function (domain, service, data, eid) {
    const s = this.states[eid]; const a = s.attributes; const d = eid.split('.')[0];
    const on = (st, patch) => this.setState(eid, st, patch);
    if (domain === 'homeassistant' || service === 'toggle') {
      const isOn = !['off', 'closed', 'locked', 'standby'].includes(s.state);
      service = isOn ? 'turn_off' : 'turn_on';
    }
    switch (d) {
      case 'light':
        if (service === 'turn_on') { const p = { brightness: data.brightness != null ? data.brightness : (a.brightness || 255) };
          if (data.brightness_pct != null) p.brightness = Math.round(data.brightness_pct * 2.55);
          if (data.color_temp_kelvin) { p.color_temp_kelvin = data.color_temp_kelvin; p.color_mode = 'color_temp'; }
          if (data.hs_color) { p.hs_color = data.hs_color; p.color_mode = 'hs'; }
          if (a.supported_color_modes && a.supported_color_modes[0] === 'onoff') delete p.brightness;
          on('on', p); }
        else on('off', { brightness: null });
        break;
      case 'switch': case 'input_boolean': on(service === 'turn_on' ? 'on' : 'off'); break;
      case 'fan':
        if (service === 'set_percentage') on(data.percentage > 0 ? 'on' : 'off', { percentage: data.percentage });
        else if (service === 'oscillate') on(s.state, { oscillating: !!data.oscillating });
        else if (service === 'turn_on') on('on', { percentage: data.percentage || a.percentage || 50 });
        else on('off', { percentage: 0 });
        break;
      case 'cover': {
        const target = service === 'open_cover' ? 100 : service === 'close_cover' ? 0 : service === 'set_cover_position' ? data.position : a.current_position;
        if (service === 'stop_cover') { on(a.current_position > 0 ? 'open' : 'closed'); break; }
        on(target > a.current_position ? 'opening' : 'closing');
        setTimeout(() => on(target > 0 ? 'open' : 'closed', { current_position: target }), 1200);
        break; }
      case 'media_player':
        if (service === 'turn_off') on('off', { media_title: null });
        else if (service === 'turn_on') on('on');
        else if (service === 'media_play_pause') on(s.state === 'playing' ? 'paused' : 'playing');
        else if (service === 'media_play') on('playing');
        else if (service === 'media_pause') on('paused');
        else if (service === 'volume_set') on(s.state, { volume_level: data.volume_level });
        break;
      case 'lock': on(service === 'lock' ? 'locked' : 'unlocked'); break;
      case 'automation': on(service === 'turn_off' ? 'off' : 'on'); break;
      case 'scene': on(iso(Date.now())); break;
      case 'script': on('on'); setTimeout(() => on('off'), 1500); break;
      case 'climate': {
        let mode = s.state; const p = {};
        if (service === 'turn_off') mode = 'off';
        else if (service === 'turn_on') mode = this.lastMode[eid] || 'cool';
        else if (service === 'set_hvac_mode') mode = data.hvac_mode;
        else if (service === 'set_temperature') { if (data.temperature != null) p.temperature = data.temperature; if (data.hvac_mode) mode = data.hvac_mode; }
        else if (service === 'set_fan_mode') p.fan_mode = data.fan_mode;
        else if (service === 'set_swing_mode') p.swing_mode = data.swing_mode;
        else if (service === 'set_preset_mode') p.preset_mode = data.preset_mode;
        if (mode !== 'off') this.lastMode[eid] = mode;
        p.hvac_action = this._action(mode, a.current_temperature, p.temperature != null ? p.temperature : a.temperature);
        on(mode, p);
        break; }
    }
  };

  /* REST config API for automations (what Home Assistant offers at /api/config/automation/config/<id>) */
  DemoHA.prototype.api = function (method, path, body) {
    const m = /^config\/automation\/config\/([^/]+)$/.exec(path);
    if (!m) return { status: 404, body: { message: 'Not found' } };
    const id = m[1]; const slug = (c) => 'automation.' + String(c.alias || id).toLowerCase().replace(/[^a-z0-9]+/g, '_').replace(/^_|_$/g, '');
    if (method === 'GET') return this.autos[id] ? { status: 200, body: clone(this.autos[id]) } : { status: 404, body: { message: 'Resource not found' } };
    if (method === 'POST') {
      const old = this.autos[id]; const cfg = Object.assign({}, body, { id });
      if (old && slug(old) !== slug(cfg)) this.setState(slug(old), null);
      this.autos[id] = cfg;
      this.setState(slug(cfg), old && this.states[slug(cfg)] ? this.states[slug(cfg)].state : 'on', { id, friendly_name: cfg.alias, mode: cfg.mode || 'single' });
      return { status: 200, body: { result: 'ok' } };
    }
    if (method === 'DELETE') { const old = this.autos[id]; if (!old) return { status: 404, body: {} }; delete this.autos[id]; this.setState(slug(old), null); return { status: 200, body: { result: 'ok' } }; }
    return { status: 405, body: {} };
  };

  /* A session = one WebSocket connection. send(text) delivers a message to the client. */
  DemoHA.prototype.session = function (send) {
    const ha = this; const subs = new Map(); let authed = false; let closed = false;
    const out = (o) => { if (!closed) send(JSON.stringify(o)); };
    const ok = (id, result) => out({ id, type: 'result', success: true, result: result === undefined ? null : result });
    const err = (id, code, message) => out({ id, type: 'result', success: false, error: { code, message } });
    const s = {
      _event(type, ev) { subs.forEach((t, id) => { if (t === '*' || t === type) out({ id, type: 'event', event: ev }); }); },
      receive(text) {
        let m; try { m = JSON.parse(text); } catch (e) { return; }
        if (!authed) {
          if (m.type !== 'auth') return;
          if (ha.opts.token && m.access_token !== ha.opts.token) { out({ type: 'auth_invalid', message: 'Invalid access token or password' }); s.close(); return; }
          authed = true; out({ type: 'auth_ok', ha_version: '2026.11.2' }); return;
        }
        const id = m.id;
        switch (m.type) {
          case 'ping': return out({ id, type: 'pong' });
          case 'get_states': return ok(id, Object.values(ha.states));
          case 'get_config': return ok(id, { location_name: 'Home', version: '2026.11.2', time_zone: 'Europe/Amsterdam', unit_system: { temperature: '°C', length: 'km' } });
          case 'config/area_registry/list': return ok(id, clone(ha.areas));
          case 'config/floor_registry/list': return ok(id, clone(ha.floors));
          case 'config/device_registry/list': return ok(id, clone(ha.devices));
          case 'config/entity_registry/list': return ok(id, clone(ha.ents));
          case 'subscribe_events': subs.set(id, m.event_type || '*'); return ok(id);
          case 'unsubscribe_events': subs.delete(m.subscription); return ok(id);
          case 'history/history_during_period': return ok(id, ha._history(m));
          case 'logbook/get_events': { const st0 = Date.parse(m.start_time) / 1000 || 0; const ids = m.entity_ids || null; return ok(id, (ha.logbook || []).filter((x) => x.when >= st0 && (!ids || ids.includes(x.entity_id)))); }
          case 'call_service': return ha._service(m.domain, m.service, Object.assign({}, m.service_data || {}, m.target || {}), (e) => e ? err(id, e.code, e.message) : ok(id, { context: { id: 'x' } }));
          default: return err(id, 'unknown_command', 'Unknown command.');
        }
      },
      close() { closed = true; ha.sessions.delete(s); if (s.onclose) s.onclose(); }
    };
    ha.sessions.add(s);
    setTimeout(() => out({ type: 'auth_required', ha_version: '2026.11.2' }), 0);
    return s;
  };

  /* Browser: a fake WebSocket object backed by a session. */
  DemoHA.prototype.socket = function () {
    const ws = { readyState: 0, onmessage: null, onclose: null, onerror: null, onopen: null };
    const sess = this.session((text) => setTimeout(() => { if (ws.readyState === 1 && ws.onmessage) ws.onmessage({ data: text }); }, 4));
    sess.onclose = () => { if (ws.readyState === 3) return; ws.readyState = 3; setTimeout(() => ws.onclose && ws.onclose({ code: 1000 }), 0); };
    ws.readyState = 1;
    ws.send = (text) => setTimeout(() => sess.receive(text), 4);
    ws.close = () => { if (ws.readyState === 3) return; sess.close(); };
    return ws;
  };

  root.DemoHA = DemoHA;
  if (typeof module !== 'undefined' && module.exports) module.exports = DemoHA;
})(typeof self !== 'undefined' ? self : globalThis);
