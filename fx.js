/* Comfort Home – animated scenes for the Screen tab ("Session") and the Moods (iPad layout). Separate module.
   Canvas 2D (works on Safari 12 / A7): pre-rendered sprites, additive light, particle budgets per device,
   frame cap, and the loop stops completely when nothing is visible (other tab, app hidden, scrolled away).
   Respects "reduce motion": then only a still picture is drawn, without Santa or fireworks.
   Nothing here talks to Home Assistant; it only reads light states to follow the real light. */
(function () {
  'use strict';
  window.ComfortFX = function (core) {
    const { S, settings } = core;
    const LEGACY = !!(window.__COMFORT_DEVICE && window.__COMFORT_DEVICE.legacy) || /OS (9|10|11|12)_\d[^)]*like Mac/.test(navigator.userAgent);
    const RM = window.matchMedia ? window.matchMedia('(prefers-reduced-motion: reduce)') : null;
    const reduced = () => !!(RM && RM.matches);
    const Q = LEGACY ? 0.55 : 1; // particle budget
    const FPS = LEGACY ? 30 : 60;
    const rnd = (a, b) => a + Math.random() * (b - a);
    const clamp = (v, a, b) => (v < a ? a : v > b ? b : v);
    const ease = (x) => (x <= 0 ? 0 : x >= 1 ? 1 : x * x * (3 - 2 * x));
    const mixc = (a, b, k) => [a[0] + (b[0] - a[0]) * k, a[1] + (b[1] - a[1]) * k, a[2] + (b[2] - a[2]) * k];
    const css = (c, al) => 'rgba(' + (c[0] | 0) + ',' + (c[1] | 0) + ',' + (c[2] | 0) + ',' + (al == null ? 1 : al) + ')';
    const P = (n, f) => { const a = []; for (let i = 0; i < n; i++) a.push(f(i)); return a; };
    const seeded = (s) => () => { s = (s * 9301 + 49297) % 233280; return s / 233280; };
    const TAU = Math.PI * 2;

    const E = { st: null, sc: null, sEl: null, sW: 0, sH: 0, sTop: 0, sRect: null, sVis: false, dpr: 1, ov: null, oc: null, odpr: 1, W: 0, H: 0,
      raf: 0, lastNow: 0, t: 0, frames: 0, scene: null, prev: null, mix: 1, mixDur: 1, key: '', room: '', level: 0, ct: 2700, wp: 0,
      wind: 0, gust: 0, fg: [], fgOld: [], fgK: '', fgA: 0, santa: null, nextSanta: 0, sKey: '', standby: false, lastCheck: 0, lastShow: -1e9,
      rectT: 0, needSize: true, ovOn: false, staticDrawn: '', fw: { r: [], p: [], f: [], q: [] } };

    /* ---------------- sprites (drawn once) ---------------- */
    function mk(w, h, fn) { const c = document.createElement('canvas'); c.width = Math.max(1, w | 0); c.height = Math.max(1, h | 0); fn(c.getContext('2d'), w, h); return c; }
    const GL = {}; const SF = {};
    function glow(c) { const k = c.join(','); if (!GL[k]) GL[k] = mk(64, 64, (g) => { const r = g.createRadialGradient(32, 32, 0, 32, 32, 32); r.addColorStop(0, 'rgba(255,255,255,1)'); r.addColorStop(0.16, css(c, 1)); r.addColorStop(0.45, css(c, 0.32)); r.addColorStop(1, css(c, 0)); g.fillStyle = r; g.fillRect(0, 0, 64, 64); }); return GL[k]; }
    function soft(c) { const k = c.join(','); if (!SF[k]) SF[k] = mk(128, 128, (g) => { const r = g.createRadialGradient(64, 64, 0, 64, 64, 64); r.addColorStop(0, css(c, 0.9)); r.addColorStop(0.4, css(c, 0.4)); r.addColorStop(1, css(c, 0)); g.fillStyle = r; g.fillRect(0, 0, 128, 128); }); return SF[k]; }
    let SPR = null;
    function sprites() {
      if (SPR) return SPR;
      SPR = {};
      SPR.flake = mk(32, 32, (g) => { const r = g.createRadialGradient(16, 16, 0, 16, 16, 16); r.addColorStop(0, 'rgba(255,255,255,1)'); r.addColorStop(0.42, 'rgba(255,255,255,.92)'); r.addColorStop(0.62, 'rgba(140,160,195,.42)'); r.addColorStop(1, 'rgba(140,160,195,0)'); g.fillStyle = r; g.fillRect(0, 0, 32, 32); });
      SPR.crystal = mk(48, 48, (g) => { g.translate(24, 24); g.strokeStyle = 'rgba(255,255,255,.96)'; g.lineWidth = 2.2; g.lineCap = 'round'; g.shadowColor = 'rgba(110,130,170,.7)'; g.shadowBlur = 3;
        for (let i = 0; i < 6; i++) { g.rotate(Math.PI / 3); g.beginPath(); g.moveTo(0, 0); g.lineTo(0, -19); g.moveTo(0, -11); g.lineTo(-5, -15); g.moveTo(0, -11); g.lineTo(5, -15); g.moveTo(0, -5); g.lineTo(-3.5, -8); g.moveTo(0, -5); g.lineTo(3.5, -8); g.stroke(); } });
      const leaf = (a, b) => mk(48, 48, (g) => { g.translate(24, 26);
        const p = [[0, -20], [5, -9], [13, -14], [10, -3], [19, 0], [9, 4], [11, 12], [2, 8], [0, 18], [-2, 8], [-11, 12], [-9, 4], [-19, 0], [-10, -3], [-13, -14], [-5, -9]];
        g.beginPath(); p.forEach((q, i) => (i ? g.lineTo(q[0], q[1]) : g.moveTo(q[0], q[1]))); g.closePath();
        const lg = g.createLinearGradient(-15, -15, 15, 15); lg.addColorStop(0, a); lg.addColorStop(1, b); g.fillStyle = lg; g.fill();
        g.strokeStyle = 'rgba(80,35,10,.45)'; g.lineWidth = 1; g.beginPath(); g.moveTo(0, 18); g.lineTo(0, -16); g.moveTo(0, 2); g.lineTo(12, -8); g.moveTo(0, 2); g.lineTo(-12, -8); g.stroke(); });
      SPR.leaves = [leaf('#f9b234', '#c2410c'), leaf('#ea580c', '#8a2a0c'), leaf('#fad04a', '#d97706'), leaf('#d8402c', '#7a1a12')];
      const petal = (a, b) => mk(32, 32, (g) => { g.translate(16, 16); g.beginPath(); g.moveTo(0, -13); g.bezierCurveTo(10, -9, 9, 8, 0, 13); g.bezierCurveTo(-9, 8, -10, -9, 0, -13); const r = g.createRadialGradient(0, -4, 1, 0, 0, 14); r.addColorStop(0, a); r.addColorStop(1, b); g.fillStyle = r; g.fill(); });
      SPR.petals = [petal('#fff1f5', '#f6a3cc'), petal('#ffffff', '#f9cde3'), petal('#ffe4ea', '#ef6fae')];
      const bauble = (c) => mk(40, 40, (g) => { const r = g.createRadialGradient(15, 15, 2, 20, 20, 18); r.addColorStop(0, css(mixc(c, [255, 255, 255], 0.65))); r.addColorStop(0.35, css(c)); r.addColorStop(1, css(mixc(c, [0, 0, 0], 0.55))); g.fillStyle = r; g.beginPath(); g.arc(20, 20, 17, 0, TAU); g.fill(); g.fillStyle = 'rgba(255,255,255,.75)'; g.beginPath(); g.ellipse(13, 12, 4, 2.4, -0.6, 0, TAU); g.fill(); });
      SPR.baubles = [[196, 36, 40], [212, 168, 70], [36, 116, 76], [176, 30, 70], [224, 196, 120]].map(bauble);
      SPR.moon = mk(240, 240, (g) => { const c = 120; const r = g.createRadialGradient(c, c, 34, c, c, 120); r.addColorStop(0, 'rgba(255,240,206,.42)'); r.addColorStop(1, 'rgba(255,240,206,0)'); g.fillStyle = r; g.fillRect(0, 0, 240, 240);
        const d = mk(100, 100, (h) => { const lg = h.createRadialGradient(38, 40, 5, 50, 50, 46); lg.addColorStop(0, '#fffaf0'); lg.addColorStop(1, '#e6d6b6'); h.fillStyle = lg; h.beginPath(); h.arc(50, 50, 40, 0, TAU); h.fill();
          h.fillStyle = 'rgba(170,152,124,.35)'; [[34, 44, 6], [44, 66, 7], [30, 62, 3.5], [48, 30, 4]].forEach((q) => { h.beginPath(); h.arc(q[0], q[1], q[2], 0, TAU); h.fill(); });
          h.globalCompositeOperation = 'destination-out'; h.beginPath(); h.arc(70, 38, 36, 0, TAU); h.fill(); });
        g.drawImage(d, c - 50, c - 50); });
      return SPR;
    }
    // draw a sprite rotated + flipped without save/restore (fast)
    function spr(g, img, x, y, s, rot, sx, dpr) { const c = Math.cos(rot), n = Math.sin(rot); g.setTransform(dpr * c * sx, dpr * n * sx, -dpr * n, dpr * c, dpr * x, dpr * y); g.drawImage(img, -s, -s, 2 * s, 2 * s); g.setTransform(dpr, 0, 0, dpr, 0, 0); }

    /* ---------------- shared particle systems (normalised 0..1 coordinates, resize-proof) ---------------- */
    const snowSet = (n) => P(n, () => ({ x: Math.random(), y: Math.random(), z: rnd(0.25, 1), ph: rnd(0, TAU), f: rnd(0.4, 1.2), r: rnd(0, TAU), big: Math.random() < 0.12 }));
    function snowUpd(a, dt, t, sp) {
      for (let i = 0; i < a.length; i++) { const p = a[i]; p.y += (0.05 + 0.13 * p.z) * sp * dt; p.x += (E.wind * p.z * 0.07 + Math.sin(t * p.f + p.ph) * 0.012) * dt; p.r += dt * 0.5 * p.f;
        if (p.y > 1.06) { p.y = -0.06; p.x = Math.random(); } if (p.x > 1.06) p.x -= 1.12; else if (p.x < -0.06) p.x += 1.12; }
    }
    function snowDraw(g, a, W, H, al, k, dpr) {
      const sp = sprites();
      for (let i = 0; i < a.length; i++) { const p = a[i]; const s = (p.big ? 7 + 6 * p.z : 1.8 + 4 * p.z) * k; g.globalAlpha = al * (0.45 + 0.55 * p.z);
        if (p.big) spr(g, sp.crystal, p.x * W, p.y * H, s, p.r, 1, dpr); else g.drawImage(sp.flake, p.x * W - s, p.y * H - s, 2 * s, 2 * s); }
      g.globalAlpha = 1;
    }
    const fallOne = (any) => ({ x: Math.random() * 1.1 - 0.05, y: any ? Math.random() : rnd(-0.25, -0.05), z: rnd(0.4, 1), r: rnd(0, TAU), vr: rnd(-1.8, 1.8), fl: rnd(1.4, 3.2), ph: rnd(0, TAU), sw: rnd(0.6, 1.3), i: (Math.random() * 4) | 0 });
    const fallSet = (n) => P(n, () => fallOne(true));
    function fallUpd(a, dt, t, sp) {
      for (let i = 0; i < a.length; i++) { const p = a[i]; p.y += (0.05 + 0.07 * p.z) * sp * dt; p.x += (E.wind * 0.09 * p.z + Math.sin(t * p.sw + p.ph) * 0.045) * dt; p.r += p.vr * dt * (1 + Math.abs(E.wind));
        if (p.y > 1.08 || p.x > 1.15 || p.x < -0.15) Object.assign(p, fallOne(false)); }
    }
    function fallDraw(g, a, W, H, al, imgs, size, t, dpr) {
      for (let i = 0; i < a.length; i++) { const p = a[i]; g.globalAlpha = al * (0.55 + 0.45 * p.z); spr(g, imgs[p.i % imgs.length], p.x * W, p.y * H, size * (0.6 + 0.6 * p.z), p.r, Math.cos(t * p.fl + p.ph), dpr); }
      g.globalAlpha = 1;
    }
    const moteSet = (n) => P(n, () => ({ x: Math.random(), y: Math.random(), z: rnd(0.3, 1), ph: rnd(0, TAU), f: rnd(0.3, 0.9) }));
    function moteUpd(a, dt, t, up) { for (let i = 0; i < a.length; i++) { const p = a[i]; p.y -= (0.01 + 0.025 * p.z) * up * dt; p.x += Math.sin(t * p.f + p.ph) * 0.012 * dt; if (p.y < -0.08) { p.y = 1.08; p.x = Math.random(); } if (p.y > 1.08) p.y = -0.08; } }
    function moteDraw(g, a, W, H, al, col, size, t) {
      const img = glow(col); g.globalCompositeOperation = 'lighter';
      for (let i = 0; i < a.length; i++) { const p = a[i]; const s = size * (0.5 + p.z); g.globalAlpha = al * (0.25 + 0.3 * Math.sin(t * p.f * 2 + p.ph) + 0.3) * p.z; g.drawImage(img, p.x * W - s, p.y * H - s, 2 * s, 2 * s); }
      g.globalAlpha = 1; g.globalCompositeOperation = 'source-over';
    }
    function skyFill(g, W, H, stops, a) { const lg = g.createLinearGradient(0, 0, 0, H); for (let i = 0; i < stops.length; i++) lg.addColorStop(stops[i][0], css(stops[i][1], 1)); g.globalAlpha = a; g.fillStyle = lg; g.fillRect(0, 0, W, H); g.globalAlpha = 1; }
    function softAt(g, col, x, y, r, al) { g.globalCompositeOperation = 'lighter'; g.globalAlpha = al; g.drawImage(soft(col), x - r, y - r, 2 * r, 2 * r); g.globalAlpha = 1; g.globalCompositeOperation = 'source-over'; }
    // cached static layer per size (hills, trees, seats…)
    function layer(sc, name, W, H, fn) { const k = name + W + 'x' + H + '@' + E.dpr; sc.L = sc.L || {}; if (!sc.L[name] || sc.L[name].k !== k) { const c = mk(W * E.dpr, H * E.dpr, (g) => { g.scale(E.dpr, E.dpr); fn(g, W, H); }); c.k = k; sc.L[name] = c; } return sc.L[name]; }
    const lay = (g, c, W, H, al) => { g.globalAlpha = al; g.drawImage(c, 0, 0, W, H); g.globalAlpha = 1; };
    function hills(g, W, H, col, h, seed) { const r = seeded(seed); g.fillStyle = col; g.beginPath(); g.moveTo(0, H); let y = H * (1 - h * (0.6 + r() * 0.4)); g.lineTo(0, y); for (let x = 0; x <= W; x += W / 5) { const ny = H * (1 - h * (0.55 + r() * 0.45)); g.quadraticCurveTo(x - W / 10, y, x, ny); y = ny; } g.lineTo(W, H); g.closePath(); g.fill(); }

    /* ---------------- scenes ---------------- */
    const SCENES = {};
    // Winter / Old Christmas: dusk sky, pines with lights, swinging baubles, a garland, gold bokeh and snow
    SCENES.winter = SCENES.christmas = function (key) {
      const xmas = key === 'christmas'; const sn = snowSet(Math.round((xmas ? 80 : 90) * Q)); const bok = moteSet(Math.round(8 * Q) + 3);
      const nb = xmas ? 5 : 4; const baub = P(nb, (i) => ({ x: 0.08 + i * (0.84 / (nb - 1)) + rnd(-0.02, 0.02), len: rnd(0.2, 0.36), ph: rnd(0, TAU), i }));
      let tl = []; // tree lights
      return { key, update(dt, t) { snowUpd(sn, dt, t, 1); moteUpd(bok, dt, t, 0.6); },
        draw(g, W, H, a, t, dpr) {
          skyFill(g, W, H, xmas ? [[0, [30, 20, 42]], [0.55, [92, 42, 44]], [1, [200, 128, 62]]] : [[0, [20, 30, 60]], [0.6, [62, 52, 80]], [1, [176, 112, 68]]], a);
          softAt(g, [255, 170, 90], W * 0.5, H * 1.05, W * 0.7, a * (xmas ? 0.55 : 0.4));
          moteDraw(g, bok, W, H, a * (xmas ? 0.9 : 0.6), [255, 196, 110], H * 0.22, t);
          const trees = layer(this, 'trees', W, H, (c) => { const r = seeded(7); hills(c, W, H, 'rgba(28,30,44,.9)', 0.16, 3); tl = [];
            const n = Math.max(6, Math.round(W / 70));
            for (let i = 0; i < n; i++) { const x = (i + 0.2 + r() * 0.6) * W / n; const th = H * (0.26 + r() * 0.26); const b = H * (0.97 - r() * 0.06); const w = th * 0.42;
              for (let k = 0; k < 3; k++) { const ty = b - th * (0.28 + k * 0.3); const tw = w * (1 - k * 0.24); c.fillStyle = 'rgb(' + (18 + k * 3) + ',' + (36 + k * 4) + ',40)'; c.beginPath(); c.moveTo(x, ty - th * 0.4); c.lineTo(x + tw, ty + th * 0.08); c.lineTo(x - tw, ty + th * 0.08); c.closePath(); c.fill();
                c.strokeStyle = 'rgba(240,244,250,.55)'; c.lineWidth = 1.4; c.beginPath(); c.moveTo(x - tw * 0.55, ty - th * 0.12); c.lineTo(x, ty - th * 0.36); c.lineTo(x + tw * 0.5, ty - th * 0.14); c.stroke();
                for (let j = 0; j < 3; j++) tl.push({ x: x + (r() - 0.5) * tw * 1.4, y: ty + r() * th * 0.06, c: [[255, 196, 90], [255, 90, 80], [110, 230, 130]][(i + j + k) % 3], ph: r() * TAU }); }
              c.fillStyle = 'rgb(40,28,20)'; c.fillRect(x - 2, b - th * 0.2, 4, th * 0.2); } });
          lay(g, trees, W, H, a);
          g.globalCompositeOperation = 'lighter';
          for (let i = 0; i < tl.length; i++) { const L = tl[i]; const al = a * (0.45 + 0.45 * Math.sin(t * 1.6 + L.ph)); const s = 4 + 2 * al; g.globalAlpha = al; g.drawImage(glow(L.c), L.x - s, L.y - s, 2 * s, 2 * s); }
          if (xmas && tl.length) { const L = tl[Math.floor(tl.length / 2)]; const s = 12 + 4 * Math.sin(t * 2); g.globalAlpha = a * 0.9; g.drawImage(glow([255, 214, 120]), L.x - s, L.y - H * 0.18 - s, 2 * s, 2 * s); }
          g.globalAlpha = 1; g.globalCompositeOperation = 'source-over';
          // garland across the top
          const sag = H * 0.11; g.strokeStyle = 'rgba(30,24,20,.75)'; g.lineWidth = 1.5; g.globalAlpha = a; g.beginPath();
          const gy = (u) => 4 + sag * (1 - Math.pow(2 * ((u * 2) % 1) - 1, 2));
          for (let x = 0; x <= W; x += 8) { const y = gy(x / W); if (x) g.lineTo(x, y); else g.moveTo(x, y); } g.stroke();
          g.globalCompositeOperation = 'lighter'; const C3 = [[255, 196, 90], [255, 84, 72], [96, 226, 120]]; let bi = 0;
          for (let x = 16; x < W; x += 30) { const y = gy(x / W) + 4; const al = a * (0.5 + 0.5 * Math.sin(t * 1.5 + bi * 0.9)); const s = 6 + 3 * al; g.globalAlpha = al; g.drawImage(glow(C3[bi % 3]), x - s, y - s, 2 * s, 2 * s); bi++; }
          g.globalAlpha = 1; g.globalCompositeOperation = 'source-over';
          // swinging baubles
          const sp = sprites();
          for (let i = 0; i < baub.length; i++) { const b = baub[i]; const ang = 0.13 * Math.sin(t * 1.25 + b.ph); const L = b.len * H; const bx = b.x * W + Math.sin(ang) * L; const by = Math.cos(ang) * L;
            g.globalAlpha = a; g.strokeStyle = 'rgba(214,180,120,.8)'; g.lineWidth = 1; g.beginPath(); g.moveTo(b.x * W, 0); g.lineTo(bx, by); g.stroke();
            const r = H * 0.055 + 3; g.fillStyle = '#c9a25a'; g.fillRect(bx - 2.5, by - 2, 5, 4); spr(g, sp.baubles[b.i % 5], bx, by + r, r, ang, 1, dpr); }
          g.globalAlpha = 1;
          snowDraw(g, sn, W, H, a, Math.max(0.8, H / 190), dpr);
        } };
    };
    // Spring: flowers that bloom when the scene appears, swaying grass, falling blossom, a butterfly
    SCENES.spring = function (key) {
      const nf = LEGACY ? 7 : 11; const pet = fallSet(Math.round(18 * Q) + 4);
      const fl = P(nf, (i) => ({ x: (i + 0.5) / nf + rnd(-0.03, 0.03), h: rnd(0.3, 0.58), c: [[255, 150, 196], [255, 214, 96], [252, 250, 255], [196, 150, 255], [255, 128, 110]][i % 5], d: 0.3 + i * 0.22 + rnd(0, 0.3), ph: rnd(0, TAU), s: rnd(0.8, 1.2), n: 5 + (i % 2) }));
      const grass = P(Math.round(46 * Q), () => ({ x: Math.random(), h: rnd(0.08, 0.2), ph: rnd(0, TAU) }));
      return { key, update(dt, t) { fallUpd(pet, dt, t, 0.8); },
        draw(g, W, H, a, t, dpr) {
          skyFill(g, W, H, [[0, [168, 210, 240]], [0.6, [246, 214, 228]], [1, [255, 236, 214]]], a);
          softAt(g, [255, 246, 214], W * 0.85, H * 0.15, H * 0.9, a * 0.7);
          lay(g, layer(this, 'h', W, H, (c) => { hills(c, W, H, 'rgba(150,196,140,.75)', 0.22, 11); hills(c, W, H, 'rgba(110,170,110,.9)', 0.12, 5); }), W, H, a);
          g.globalAlpha = a; g.strokeStyle = 'rgba(70,140,70,.85)'; g.lineWidth = 1.6; g.beginPath();
          for (let i = 0; i < grass.length; i++) { const q = grass[i]; const x = q.x * W; const sw = Math.sin(t * 1.4 + q.ph + q.x * 3) * 4; g.moveTo(x, H); g.quadraticCurveTo(x + sw * 0.4, H - q.h * H * 0.5, x + sw, H - q.h * H); } g.stroke();
          const st = this.age || 0; const R0 = clamp(H / 16, 6, 14);
          for (let i = 0; i < fl.length; i++) { const f = fl[i]; const k = ease((st - f.d) / 2.2); const sw = Math.sin(t * 1.1 + f.ph) * 6; const bx = f.x * W; const tx = bx + sw; const ty = H - f.h * H * (0.35 + 0.65 * ease((st - f.d + 0.6) / 1.6));
            g.strokeStyle = 'rgba(62,128,62,.95)'; g.lineWidth = 2.2; g.beginPath(); g.moveTo(bx, H); g.quadraticCurveTo(bx - sw * 0.3, (H + ty) / 2, tx, ty); g.stroke();
            g.fillStyle = 'rgba(80,150,70,.95)'; g.beginPath(); g.ellipse(bx + sw * 0.25 + 6, (H + ty) / 2 + 6, 6, 2.6, -0.6, 0, TAU); g.fill();
            if (k > 0) { const R = R0 * f.s * k * (1 + 0.03 * Math.sin(t * 2 + f.ph)); g.fillStyle = css(f.c, 0.95);
              for (let j = 0; j < f.n; j++) { const an = j / f.n * TAU + t * 0.08 + f.ph; g.beginPath(); g.ellipse(tx + Math.cos(an) * R * 0.55, ty + Math.sin(an) * R * 0.55, R * 0.58, R * 0.32, an, 0, TAU); g.fill(); }
              g.fillStyle = '#f6c343'; g.beginPath(); g.arc(tx, ty, R * 0.3, 0, TAU); g.fill(); } }
          g.globalAlpha = 1;
          fallDraw(g, pet, W, H, a, sprites().petals, clamp(H / 30, 4, 8), t, dpr);
          // butterfly
          const bx = (0.5 + 0.36 * Math.sin(t * 0.21)) * W; const by = (0.38 + 0.14 * Math.sin(t * 0.43)) * H; const fl2 = 0.25 + 0.75 * Math.abs(Math.sin(t * 11)); const bs = clamp(H / 28, 4, 8);
          g.globalAlpha = a; g.setTransform(dpr * fl2, 0, 0, dpr, dpr * bx, dpr * by); g.fillStyle = '#f59e0b'; g.beginPath(); g.ellipse(-bs * 0.9, -bs * 0.4, bs, bs * 0.7, -0.4, 0, TAU); g.ellipse(bs * 0.9, -bs * 0.4, bs, bs * 0.7, 0.4, 0, TAU); g.fill();
          g.fillStyle = '#fb7185'; g.beginPath(); g.ellipse(-bs * 0.6, bs * 0.5, bs * 0.6, bs * 0.45, 0.3, 0, TAU); g.ellipse(bs * 0.6, bs * 0.5, bs * 0.6, bs * 0.45, -0.3, 0, TAU); g.fill();
          g.setTransform(dpr, 0, 0, dpr, 0, 0); g.fillStyle = '#3b2a1a'; g.fillRect(bx - 1, by - bs * 0.8, 2, bs * 1.6); g.globalAlpha = 1;
        } };
    };
    // Summer: warm sun with slowly turning rays, drifting clouds, rising light motes, heat shimmer
    SCENES.summer = function (key) {
      const mo = moteSet(Math.round(24 * Q) + 4); const cl = P(3, (i) => ({ x: Math.random(), y: 0.12 + i * 0.14, s: rnd(0.8, 1.3), v: rnd(0.006, 0.014) }));
      return { key, update(dt, t) { moteUpd(mo, dt, t, 1); cl.forEach((c) => { c.x += c.v * dt; if (c.x > 1.3) c.x = -0.3; }); },
        draw(g, W, H, a, t) {
          skyFill(g, W, H, [[0, [255, 186, 112]], [0.55, [255, 222, 168]], [1, [255, 240, 214]]], a);
          const sx = W * 0.82, sy = H * 0.22; softAt(g, [255, 214, 140], sx, sy, H * 1.3, a * 0.8);
          g.globalCompositeOperation = 'lighter'; g.globalAlpha = a * 0.09; g.fillStyle = '#fff3d0'; g.beginPath();
          for (let i = 0; i < 14; i++) { const an = i / 14 * TAU + t * 0.04; g.moveTo(sx, sy); g.lineTo(sx + Math.cos(an - 0.05) * W, sy + Math.sin(an - 0.05) * W); g.lineTo(sx + Math.cos(an + 0.05) * W, sy + Math.sin(an + 0.05) * W); g.closePath(); } g.fill();
          g.globalAlpha = a; g.drawImage(glow([255, 236, 170]), sx - H * 0.3, sy - H * 0.3, H * 0.6, H * 0.6); g.globalAlpha = 1; g.globalCompositeOperation = 'source-over';
          for (let i = 0; i < cl.length; i++) { const c = cl[i]; const x = c.x * W, y = c.y * H, r = H * 0.16 * c.s; g.globalAlpha = a * 0.55; const img = soft([255, 255, 255]); g.drawImage(img, x - r, y - r * 0.6, r * 2, r * 1.2); g.drawImage(img, x - r * 0.3, y - r * 0.9, r * 1.6, r * 1.3); g.drawImage(img, x + r * 0.4, y - r * 0.5, r * 1.5, r); }
          g.globalAlpha = 1;
          lay(g, layer(this, 'h', W, H, (c) => { hills(c, W, H, 'rgba(232,170,90,.55)', 0.22, 21); hills(c, W, H, 'rgba(206,140,70,.8)', 0.12, 8); }), W, H, a);
          g.globalAlpha = a * 0.06; g.fillStyle = '#fff'; for (let b = 0; b < 2; b++) { g.beginPath(); const y0 = H * (0.68 + b * 0.12); g.moveTo(0, y0); for (let x = 0; x <= W; x += 24) g.lineTo(x, y0 + Math.sin(x * 0.03 + t * 1.6 + b) * 3); g.lineTo(W, y0 + 8); g.lineTo(0, y0 + 8); g.fill(); }
          g.globalAlpha = 1; moteDraw(g, mo, W, H, a, [255, 220, 140], clamp(H / 40, 3, 6), t);
        } };
    };
    // Autumn: amber sky, bare tree, tumbling leaves in gusts of wind
    SCENES.autumn = function (key) {
      const lv = fallSet(Math.round(24 * Q) + 4);
      return { key, update(dt, t) { fallUpd(lv, dt, t, 0.9); },
        draw(g, W, H, a, t, dpr) {
          skyFill(g, W, H, [[0, [110, 66, 62]], [0.55, [212, 128, 72]], [1, [250, 198, 128]]], a);
          softAt(g, [255, 190, 110], W * 0.2, H * 0.85, H * 1.1, a * 0.65);
          lay(g, layer(this, 't', W, H, (c) => { hills(c, W, H, 'rgba(120,64,40,.7)', 0.2, 31); hills(c, W, H, 'rgba(84,44,28,.92)', 0.1, 4);
            const r = seeded(17); c.strokeStyle = 'rgba(52,30,22,.95)'; c.lineCap = 'round';
            const br = (x, y, len, an, w, d) => { if (d > (LEGACY ? 6 : 7) || len < 3) return; const x2 = x + Math.cos(an) * len, y2 = y + Math.sin(an) * len; c.lineWidth = w; c.beginPath(); c.moveTo(x, y); c.lineTo(x2, y2); c.stroke(); br(x2, y2, len * 0.74, an - 0.3 - r() * 0.3, w * 0.68, d + 1); br(x2, y2, len * 0.7, an + 0.25 + r() * 0.3, w * 0.68, d + 1); };
            br(W * 0.86, H, H * 0.36, -Math.PI / 2 - 0.08, Math.max(4, H / 26), 0);
            const sp = sprites(); for (let i = 0; i < 22; i++) { const x = r() * W, y = H - r() * H * 0.07, s = 5 + r() * 5; c.save(); c.translate(x, y); c.rotate(r() * TAU); c.scale(1, 0.5); c.drawImage(sp.leaves[i % 4], -s, -s, 2 * s, 2 * s); c.restore(); } }), W, H, a);
          fallDraw(g, lv, W, H, a, sprites().leaves, clamp(H / 16, 7, 13), t, dpr);
        } };
    };
    // Sleep: dark calm night, slowly drifting stars, a softly breathing moon, faint clouds
    SCENES.sleep = function (key) {
      const stars = P(Math.round(80 * Q) + 10, () => ({ x: Math.random(), y: Math.random() * 0.85, r: rnd(0.6, 2), ph: rnd(0, TAU), f: rnd(0.4, 1.4) }));
      const cl = P(3, (i) => ({ x: Math.random(), y: 0.25 + i * 0.2, v: rnd(0.004, 0.008) })); let shoot = null; let nextShoot = rnd(18, 30);
      return { key, update(dt, t) { for (let i = 0; i < stars.length; i++) { const s = stars[i]; s.x -= 0.0035 * dt; if (s.x < -0.02) s.x = 1.02; } cl.forEach((c) => { c.x += c.v * dt; if (c.x > 1.4) c.x = -0.4; });
          if ((this.age || 0) > nextShoot && !shoot) { shoot = { x: rnd(0.2, 0.7), y: rnd(0.05, 0.3), u: 0 }; nextShoot = (this.age || 0) + rnd(22, 40); } if (shoot) { shoot.u += dt / 1.4; if (shoot.u >= 1) shoot = null; } },
        draw(g, W, H, a, t) {
          skyFill(g, W, H, [[0, [8, 12, 30]], [0.6, [20, 26, 58]], [1, [40, 40, 80]]], a);
          g.globalCompositeOperation = 'lighter'; const img = glow([220, 230, 255]);
          for (let i = 0; i < stars.length; i++) { const s = stars[i]; const al = a * (0.35 + 0.35 * Math.sin(t * s.f + s.ph)); const z = s.r * 2.4; g.globalAlpha = al; g.drawImage(img, s.x * W - z, s.y * H - z, 2 * z, 2 * z); }
          if (shoot) { const k = Math.sin(shoot.u * Math.PI); const x = (shoot.x + shoot.u * 0.25) * W, y = (shoot.y + shoot.u * 0.12) * H; g.globalAlpha = a * 0.35 * k; g.strokeStyle = '#dfe8ff'; g.lineWidth = 1.2; g.beginPath(); g.moveTo(x, y); g.lineTo(x - W * 0.07, y - W * 0.035); g.stroke(); }
          const ms = H * 0.62; const mx = W * 0.8, my = H * 0.36 + Math.sin(t * 0.25) * 4; g.globalAlpha = a * (0.85 + 0.15 * Math.sin(t * 0.5)); g.globalCompositeOperation = 'source-over'; g.drawImage(sprites().moon, mx - ms, my - ms, ms * 2, ms * 2);
          for (let i = 0; i < cl.length; i++) { const c = cl[i]; const r = H * 0.3; g.globalAlpha = a * 0.08; g.drawImage(soft([150, 160, 210]), c.x * W - r * 1.4, c.y * H - r * 0.4, r * 2.8, r * 0.8); }
          g.globalAlpha = 1;
          lay(g, layer(this, 'h', W, H, (c) => hills(c, W, H, 'rgba(10,12,26,.92)', 0.13, 41)), W, H, a);
        } };
    };
    // Read: warm reading corner, lamp with a breathing light cone, dust motes drifting in the light, wooden slats
    SCENES.read = function (key) {
      const ds = P(Math.round(28 * Q) + 4, () => ({ x: Math.random(), y: Math.random(), z: rnd(0.3, 1), ph: rnd(0, TAU), f: rnd(0.2, 0.6) }));
      return { key, update(dt, t) { for (let i = 0; i < ds.length; i++) { const p = ds[i]; p.y += Math.sin(t * p.f + p.ph) * 0.006 * dt - 0.004 * dt; p.x += Math.cos(t * p.f * 0.7 + p.ph) * 0.006 * dt; if (p.y < 0) p.y = 1; if (p.y > 1) p.y = 0; if (p.x < 0) p.x = 1; if (p.x > 1) p.x = 0; } },
        draw(g, W, H, a, t) {
          skyFill(g, W, H, [[0, [56, 36, 24]], [0.6, [94, 62, 40]], [1, [128, 86, 54]]], a);
          lay(g, layer(this, 'w', W, H, (c) => { for (let x = W * 0.62; x < W; x += 13) { c.fillStyle = 'rgba(150,100,60,.35)'; c.fillRect(x, 0, 9, H); c.fillStyle = 'rgba(20,10,4,.35)'; c.fillRect(x + 9, 0, 4, H); }
            c.fillStyle = 'rgba(30,18,10,.55)'; c.fillRect(0, H * 0.86, W, H * 0.14);
            const cx = W * 0.26; const lg = c.createLinearGradient(0, 0, 0, H); lg.addColorStop(0, 'rgba(255,214,150,.75)'); lg.addColorStop(1, 'rgba(255,214,150,0)'); c.fillStyle = lg; c.beginPath(); c.moveTo(cx - 14, H * 0.18); c.lineTo(cx + 14, H * 0.18); c.lineTo(cx + W * 0.2, H); c.lineTo(cx - W * 0.2, H); c.closePath(); c.fill();
            c.fillStyle = '#2a1a10'; c.beginPath(); c.moveTo(cx - 20, H * 0.18); c.lineTo(cx + 20, H * 0.18); c.lineTo(cx + 12, H * 0.04); c.lineTo(cx - 12, H * 0.04); c.closePath(); c.fill(); c.fillRect(cx - 1.5, 0, 3, H * 0.05); }), W, H, a);
          const lv = 0.55 + 0.45 * E.level; const br = lv * (0.85 + 0.15 * Math.sin(t * 0.8));
          softAt(g, [255, 200, 130], W * 0.26, H * 0.95, W * 0.32, a * 0.75 * br);
          softAt(g, [255, 220, 160], W * 0.26, H * 0.2, H * 0.35, a * br);
          g.globalCompositeOperation = 'lighter'; const img = glow([255, 226, 170]);
          for (let i = 0; i < ds.length; i++) { const p = ds[i]; const inCone = 1 - clamp(Math.abs(p.x * W - W * 0.26) / (14 + p.y * W * 0.2), 0, 1); if (inCone <= 0) continue; const s = 1.6 + p.z * 2; g.globalAlpha = a * inCone * (0.4 + 0.4 * Math.sin(t * 2 * p.f + p.ph)) * br; g.drawImage(img, p.x * W - s, p.y * H - s, 2 * s, 2 * s); }
          g.globalAlpha = 1; g.globalCompositeOperation = 'source-over';
        } };
    };
    // Wake Up: a real sunrise that follows the Wake Up light ramp in Home Assistant
    const WK = [[0, [[10, 16, 40], [24, 30, 70], [50, 46, 96]]], [0.35, [[40, 40, 96], [150, 80, 112], [240, 132, 90]]], [0.7, [[110, 150, 210], [250, 172, 122], [255, 210, 150]]], [1, [[118, 176, 232], [198, 222, 242], [255, 226, 186]]]];
    function wkSky(p) { let i = 0; while (i < WK.length - 2 && p > WK[i + 1][0]) i++; const a = WK[i], b = WK[i + 1]; const k = ease((p - a[0]) / (b[0] - a[0])); return [[0, mixc(a[1][0], b[1][0], k)], [0.6, mixc(a[1][1], b[1][1], k)], [1, mixc(a[1][2], b[1][2], k)]]; }
    SCENES.wake = function (key) {
      const stars = P(Math.round(50 * Q) + 6, () => ({ x: Math.random(), y: Math.random() * 0.7, r: rnd(0.6, 1.8), ph: rnd(0, TAU) }));
      const birds = P(4, (i) => ({ x: -0.1 - i * 0.06, y: 0.2 + (i % 2) * 0.06 + i * 0.02, ph: i }));
      return { key, update(dt) { if (E.wp > 0.65) birds.forEach((b) => { b.x += 0.03 * dt; if (b.x > 1.2) b.x = -0.2; }); },
        draw(g, W, H, a, t) {
          const p = E.wp; skyFill(g, W, H, wkSky(p), a);
          g.globalCompositeOperation = 'lighter'; const si = glow([230, 236, 255]);
          if (p < 0.55) for (let i = 0; i < stars.length; i++) { const s = stars[i]; g.globalAlpha = a * (1 - p / 0.55) * (0.4 + 0.3 * Math.sin(t + s.ph)); const z = s.r * 2.4; g.drawImage(si, s.x * W - z, s.y * H - z, 2 * z, 2 * z); }
          const sy = H * (1.15 - 0.8 * ease(p)); const sx = W * 0.62; const sc = mixc([255, 110, 50], [255, 244, 214], ease(p));
          g.globalAlpha = a * (0.3 + 0.7 * ease(p * 1.4)) * (1 - 0.45 * ease(p)); g.drawImage(soft(sc), sx - H * 1.1, sy - H * 1.1, H * 2.2, H * 2.2);
          g.globalAlpha = a; g.drawImage(glow(sc), sx - H * 0.32, sy - H * 0.32, H * 0.64, H * 0.64);
          if (p > 0.6) { g.globalAlpha = a * 0.08 * ease((p - 0.6) / 0.4); g.fillStyle = '#fff3d6'; g.beginPath(); for (let i = 0; i < 12; i++) { const an = i / 12 * TAU + t * 0.03; g.moveTo(sx, sy); g.lineTo(sx + Math.cos(an - 0.05) * W, sy + Math.sin(an - 0.05) * W); g.lineTo(sx + Math.cos(an + 0.05) * W, sy + Math.sin(an + 0.05) * W); g.closePath(); } g.fill(); }
          g.globalAlpha = 1; g.globalCompositeOperation = 'source-over';
          lay(g, layer(this, 'n', W, H, (c) => { hills(c, W, H, 'rgb(20,22,44)', 0.22, 51); hills(c, W, H, 'rgb(12,14,30)', 0.12, 9); }), W, H, a * (1 - 0.85 * ease(p)));
          lay(g, layer(this, 'd', W, H, (c) => { hills(c, W, H, 'rgb(140,150,110)', 0.22, 51); hills(c, W, H, 'rgb(96,118,76)', 0.12, 9); }), W, H, a * 0.85 * ease(p));
          if (p > 0.65) { g.globalAlpha = a * ease((p - 0.65) / 0.2); g.strokeStyle = 'rgba(40,40,50,.8)'; g.lineWidth = 1.4; g.beginPath(); birds.forEach((b) => { const x = b.x * W, y = b.y * H, w = 6, f = Math.sin(t * 7 + b.ph) * 3; g.moveTo(x - w, y - f); g.quadraticCurveTo(x - w / 2, y - 3, x, y); g.quadraticCurveTo(x + w / 2, y - 3, x + w, y - f); }); g.stroke(); g.globalAlpha = 1; }
        } };
    };
    // Movie: dark cinema, flickering projector beam with dust, screen light changing colour, seats
    SCENES.movie = function (key) {
      const ds = P(Math.round(30 * Q) + 4, () => ({ u: Math.random(), v: Math.random(), z: rnd(0.3, 1), ph: rnd(0, TAU), f: rnd(0.2, 0.6) }));
      return { key, update(dt, t) { for (let i = 0; i < ds.length; i++) { const p = ds[i]; p.u -= 0.02 * dt * p.z; p.v += Math.sin(t * p.f + p.ph) * 0.02 * dt; if (p.u < 0) p.u = 1; } },
        draw(g, W, H, a, t) {
          skyFill(g, W, H, [[0, [14, 12, 18]], [0.7, [22, 18, 28]], [1, [28, 20, 30]]], a);
          const hue = [[70, 110, 255], [170, 90, 255], [60, 200, 220], [255, 140, 90]]; const hi = (t * 0.07) % 4; const c = mixc(hue[hi | 0], hue[((hi | 0) + 1) % 4], ease(hi % 1));
          softAt(g, c, W * 0.08, H * 0.4, H * 1.1, a * 0.4);
          const fl = 0.75 + 0.12 * Math.sin(t * 23) + 0.08 * Math.sin(t * 7.3) + 0.05 * Math.sin(t * 41);
          lay(g, layer(this, 'b', W, H, (cc) => { const lg = cc.createLinearGradient(W * 0.92, 0, 0, 0); lg.addColorStop(0, 'rgba(230,226,255,.5)'); lg.addColorStop(1, 'rgba(230,226,255,0)'); cc.fillStyle = lg; cc.beginPath(); cc.moveTo(W * 0.92, H * 0.14); cc.lineTo(0, H * -0.05); cc.lineTo(0, H * 0.75); cc.closePath(); cc.fill(); }), W, H, a * 0.32 * fl);
          g.globalCompositeOperation = 'lighter'; const img = glow([236, 232, 255]);
          for (let i = 0; i < ds.length; i++) { const p = ds[i]; const x = W * 0.92 * p.u; const top = H * 0.14 + (H * -0.05 - H * 0.14) * (1 - p.u); const bot = H * 0.14 + (H * 0.75 - H * 0.14) * (1 - p.u); const y = top + (bot - top) * (0.5 + 0.45 * Math.sin(p.v * 6)); const s = 1.2 + p.z * 1.8; g.globalAlpha = a * 0.55 * fl * p.z; g.drawImage(img, x - s, y - s, 2 * s, 2 * s); }
          g.globalAlpha = a * 0.9; g.drawImage(glow([255, 250, 230]), W * 0.92 - 8, H * 0.14 - 8, 16, 16);
          g.globalAlpha = 1; g.globalCompositeOperation = 'source-over';
          lay(g, layer(this, 's', W, H, (cc) => { cc.fillStyle = 'rgba(6,4,8,.95)'; for (let row = 0; row < 2; row++) { const y = H * (0.82 + row * 0.1); for (let x = (row ? 18 : 0); x < W; x += 44) { cc.beginPath(); if (cc.roundRect) cc.roundRect(x, y, 34, H * 0.2, 8); else cc.rect(x, y, 34, H * 0.2); cc.fill(); } }
            const v = cc.createRadialGradient(W / 2, H / 2, H * 0.3, W / 2, H / 2, W * 0.7); v.addColorStop(0, 'rgba(0,0,0,0)'); v.addColorStop(1, 'rgba(0,0,0,.55)'); cc.fillStyle = v; cc.fillRect(0, 0, W, H); }), W, H, a);
          g.fillStyle = '#fff'; for (let i = 0; i < (LEGACY ? 8 : 18); i++) { g.globalAlpha = a * Math.random() * 0.07; g.fillRect(Math.random() * W, Math.random() * H, 1.5, 1.5); } g.globalAlpha = 1;
        } };
    };
    // Relax: slow flowing warm light waves; Bright: soft daylight with drifting glints
    SCENES.relax = function (key) {
      const bok = moteSet(Math.round(10 * Q) + 3);
      return { key, update(dt, t) { moteUpd(bok, dt, t, 0.4); },
        draw(g, W, H, a, t) {
          skyFill(g, W, H, [[0, [90, 44, 54]], [0.6, [176, 96, 80]], [1, [232, 158, 104]]], a);
          const cols = [[255, 190, 130], [255, 140, 120], [255, 214, 160]]; g.globalCompositeOperation = 'lighter';
          for (let b = 0; b < 3; b++) { g.globalAlpha = a * 0.14; g.fillStyle = css(cols[b]); g.beginPath(); const y0 = H * (0.42 + b * 0.16); g.moveTo(0, H); for (let x = 0; x <= W; x += W / 24) g.lineTo(x, y0 + Math.sin(x / W * 5 + t * (0.25 + b * 0.09) + b * 2) * H * 0.07); g.lineTo(W, H); g.closePath(); g.fill(); }
          g.globalAlpha = 1; g.globalCompositeOperation = 'source-over'; moteDraw(g, bok, W, H, a * 0.8, [255, 200, 150], H * 0.16, t);
        } };
    };
    SCENES.bright = function (key) {
      const mo = moteSet(Math.round(14 * Q) + 3);
      return { key, update(dt, t) { moteUpd(mo, dt, t, 0.6); },
        draw(g, W, H, a, t) {
          skyFill(g, W, H, [[0, [206, 230, 250]], [0.7, [240, 246, 252]], [1, [255, 250, 240]]], a);
          softAt(g, [255, 255, 240], W * (0.5 + 0.3 * Math.sin(t * 0.07)), H * 0.2, H * 1.2, a * 0.9);
          moteDraw(g, mo, W, H, a, [255, 255, 255], clamp(H / 40, 3, 6), t);
        } };
    };

    /* ---------------- fireworks (overlay, window coordinates) ---------------- */
    const COL = { red: [255, 76, 66], gold: [255, 196, 88], green: [86, 228, 120], blue: [90, 150, 255], white: [255, 248, 236], pink: [255, 120, 200], purple: [182, 122, 255] };
    const CN = ['red', 'gold', 'green', 'blue', 'pink', 'purple'];
    const G = 380; const CAP = LEGACY ? 220 : 900;
    function launch(type, cname) {
      const fw = E.fw; const x = rnd(0.15, 0.85) * E.W; const ty = rnd(0.1, 0.38) * E.H; const y0 = E.H + 10;
      fw.r.push({ x, y: y0, vx: rnd(-25, 25), vy: -Math.sqrt(2 * G * (y0 - ty)), type, c: COL[cname] || COL[CN[(Math.random() * CN.length) | 0]], tr: [] });
    }
    function part(x, y, vx, vy, c, life, size, drag, g, tw, tl) { const fw = E.fw; if (fw.p.length >= CAP) return; fw.p.push({ x, y, px: x, py: y, vx, vy, c, life, age: 0, size, drag, g, tw, tl, ph: Math.random() * 9 }); }
    function explode(r) {
      const k = clamp(Math.min(E.W, E.H) / 760, 0.6, 1.3); const x = r.x, y = r.y;
      part(x, y, 0, 0, [255, 240, 220], 0.28, 34 * k, 0, 0, false, 0);
      if (r.type === 'peony' || r.type === 'small') { const small = r.type === 'small'; const n = Math.round((small ? 30 : 90) * Q) + 10; const S0 = rnd(260, 330) * k * (small ? 0.5 : 1);
        for (let i = 0; i < n; i++) { const an = i / n * TAU + rnd(-0.06, 0.06); const sp = S0 * rnd(0.72, 1); part(x, y, Math.cos(an) * sp, Math.sin(an) * sp, Math.random() < 0.15 ? COL.white : r.c, rnd(1.4, 2.1), (small ? 2.8 : 3.8) * k, 1.6, 95, Math.random() < 0.3, 1); } }
      else if (r.type === 'ring') { const n = Math.round(54 * Q) + 10; const S0 = rnd(270, 320) * k; const tilt = rnd(0.45, 0.8);
        for (let i = 0; i < n; i++) { const an = i / n * TAU; part(x, y, Math.cos(an) * S0, Math.sin(an) * S0 * tilt, r.c, 1.5, 3 * k, 1.3, 90, false, 1); }
        for (let i = 0; i < 12; i++) { const an = rnd(0, TAU); const sp = rnd(20, 60) * k; part(x, y, Math.cos(an) * sp, Math.sin(an) * sp, COL.white, 1, 2.4 * k, 1.5, 60, true, 0); } }
      else if (r.type === 'willow') { const n = Math.round(64 * Q) + 10;
        for (let i = 0; i < n; i++) { const an = rnd(0, TAU); const sp = rnd(0.35, 1) * 240 * k; part(x, y, Math.cos(an) * sp, Math.sin(an) * sp - 20, COL.gold, rnd(2.6, 3.6), 3 * k, 2.1, 75, Math.random() < 0.4, 3); } }
      else if (r.type === 'crackle') { const n = Math.round(42 * Q) + 8;
        for (let i = 0; i < n; i++) { const an = rnd(0, TAU); const sp = rnd(0.4, 1) * 260 * k; const p0 = { cr: true }; part(x, y, Math.cos(an) * sp, Math.sin(an) * sp, COL.white, rnd(0.6, 0.9), 2.2 * k, 1.8, 80, false, 1); const pp = E.fw.p[E.fw.p.length - 1]; if (pp) pp.cr = p0.cr; } }
    }
    function fountain(dur) { const R = E.sRect; const yy = R && R.bottom > 0 && R.bottom < E.H ? R.bottom - 6 : E.H * 0.96; const xs = R && E.sVis ? [R.left + R.width * 0.12, R.right - R.width * 0.12] : [E.W * 0.12, E.W * 0.88]; xs.forEach((x) => E.fw.f.push({ x, y: yy, until: E.t + dur })); }
    function show(kind) {
      if (reduced() || !E.W) return;
      let seq;
      if (kind === 'subtle') seq = [[0.2, 'small', 'gold'], [1.0, 'small', 'red'], [1.8, 'small', 'green'], [2.8, 'willow', 'gold']];
      else if (kind === 'xmas') seq = [[0, 'fountain', 4], [0.4, 'peony', 'red'], [1.4, 'peony', 'green'], [2.3, 'willow', 'gold'], [3.2, 'ring', 'gold'], [4.2, 'small', 'red'], [4.4, 'small', 'green'], [4.6, 'small', 'gold']];
      else seq = [[0, 'fountain', 5], [0.3, 'peony', 'red'], [1.1, 'peony', 'blue'], [1.9, 'willow', 'gold'], [2.6, 'ring', 'green'], [3.3, 'crackle', 'white'], [4.0, 'peony', 'purple'], [4.3, 'peony', 'gold'],
        [5.2, 'willow', 'gold'], [6.0, 'small'], [6.25, 'small'], [6.5, 'small'], [6.75, 'small'], [7.4, 'peony', 'red'], [7.45, 'peony', 'green'], [7.5, 'peony', 'blue'], [8.4, 'willow', 'gold'], [8.6, 'crackle', 'white']];
      seq.forEach((s) => E.fw.q.push({ at: E.t + s[0], type: s[1], c: s[2] })); E.showUntil = E.t + seq[seq.length - 1][0] + 3.5; E.veilMax = kind === 'subtle' ? 0.5 : 1;
      E.lastShow = E.t; kick();
    }
    function fwUpdate(dt) {
      const fw = E.fw;
      for (let i = fw.q.length - 1; i >= 0; i--) { const q = fw.q[i]; if (E.t >= q.at) { fw.q.splice(i, 1); if (q.type === 'fountain') fountain(q.c); else launch(q.type, q.c); } }
      for (let i = fw.r.length - 1; i >= 0; i--) { const r = fw.r[i]; r.tr.push(r.x, r.y); if (r.tr.length > 16) r.tr.splice(0, 2); r.vy += G * dt; r.x += r.vx * dt; r.y += r.vy * dt;
        if (Math.random() < 0.6) part(r.x, r.y, rnd(-15, 15), rnd(20, 60), COL.gold, rnd(0.3, 0.6), 1.6, 2, 60, false, 0);
        if (r.vy >= -35) { fw.r.splice(i, 1); explode(r); } }
      for (let i = fw.f.length - 1; i >= 0; i--) { const f = fw.f[i]; if (E.t > f.until) { fw.f.splice(i, 1); continue; } const n = LEGACY ? 2 : 4; for (let j = 0; j < n; j++) part(f.x + rnd(-3, 3), f.y, rnd(-55, 55), rnd(-430, -300) * clamp(E.H / 800, 0.6, 1.2), Math.random() < 0.8 ? COL.gold : COL.white, rnd(0.8, 1.3), 2.2, 0.7, 520, true, 2); }
      for (let i = fw.p.length - 1; i >= 0; i--) { const p = fw.p[i]; p.age += dt; if (p.age >= p.life) { if (p.cr && fw.p.length < CAP) for (let k = 0; k < 2; k++) part(p.x, p.y, rnd(-30, 30), rnd(-30, 30), COL.white, 0.14, 4, 0, 0, false, 0); fw.p.splice(i, 1); continue; }
        const d = 1 - p.drag * dt; p.px = p.x; p.py = p.y; p.vx *= d; p.vy = p.vy * d + p.g * dt; p.x += p.vx * dt; p.y += p.vy * dt; }
    }
    function fwDraw(g) {
      const fw = E.fw; if (!fw.p.length && !fw.r.length) return;
      g.globalCompositeOperation = 'lighter'; g.lineCap = 'round';
      for (let i = 0; i < fw.r.length; i++) { const r = fw.r[i]; const tr = r.tr; g.strokeStyle = css(r.c, 1); g.lineWidth = 2;
        for (let j = 2; j < tr.length; j += 2) { g.globalAlpha = j / tr.length * 0.8; g.beginPath(); g.moveTo(tr[j - 2], tr[j - 1]); g.lineTo(tr[j], tr[j + 1] == null ? r.y : tr[j + 1]); g.stroke(); }
        g.globalAlpha = 1; g.drawImage(glow(r.c), r.x - 6, r.y - 6, 12, 12); }
      let lastC = null;
      for (let i = 0; i < fw.p.length; i++) { const p = fw.p[i]; const k = p.age / p.life; let al = Math.pow(1 - k, 1.4); if (p.tw) al *= 0.55 + 0.45 * Math.sin(p.age * 38 + p.ph); if (al <= 0.01) continue;
        const c = k > 0.6 && p.c === COL.gold ? COL.gold : p.c;
        if (p.tl && (!LEGACY || p.tl >= 3)) { if (c !== lastC) { g.strokeStyle = css(c, 1); lastC = c; } g.globalAlpha = al * 0.55; g.lineWidth = p.size * 0.7; g.beginPath(); g.moveTo(p.x - p.vx * 0.03 * p.tl, p.y - p.vy * 0.03 * p.tl); g.lineTo(p.x, p.y); g.stroke(); }
        const s = p.size * 2.4; g.globalAlpha = al; g.drawImage(glow(c), p.x - s, p.y - s, 2 * s, 2 * s); }
      g.globalAlpha = 1; g.globalCompositeOperation = 'source-over';
    }

    /* ---------------- Santa with sleigh and reindeer (vector drawing, animated) ---------------- */
    function deer(g, x, y, ph, rudolph, t) {
      const leg = (lx, ly, a1, a2) => { const kx = lx + Math.sin(a1) * 9, ky = ly + Math.cos(a1) * 9; g.beginPath(); g.moveTo(lx, ly); g.lineTo(kx, ky); g.lineTo(kx + Math.sin(a1 + a2) * 9, ky + Math.cos(a1 + a2) * 9); g.stroke(); };
      g.lineCap = 'round'; g.lineJoin = 'round';
      g.strokeStyle = '#5a3820'; g.lineWidth = 3.2; const s = Math.sin(ph), c = Math.cos(ph);
      leg(x - 13, y + 5, 0.9 * s - 0.3, -0.9 - 0.5 * c); leg(x + 14, y + 5, -0.9 * s + 0.4, 0.9 + 0.4 * c);
      g.fillStyle = '#7a4c2a'; g.beginPath(); g.ellipse(x, y, 22, 10, 0, 0, TAU); g.fill();
      g.fillStyle = '#9c6a40'; g.beginPath(); g.ellipse(x - 2, y + 4, 15, 4.5, 0, 0, TAU); g.fill();
      g.strokeStyle = '#6b4226'; g.lineWidth = 3.4; leg(x - 9, y + 6, 0.9 * Math.sin(ph + 1.1) - 0.3, -0.9 - 0.5 * Math.cos(ph + 1.1)); leg(x + 17, y + 5, -0.9 * Math.sin(ph + 1.1) + 0.4, 0.9 + 0.4 * Math.cos(ph + 1.1));
      g.fillStyle = '#f6efe4'; g.beginPath(); g.ellipse(x + 22, y - 4, 4, 3, 0.5, 0, TAU); g.fill();
      g.strokeStyle = '#7a4c2a'; g.lineWidth = 8; g.beginPath(); g.moveTo(x - 14, y - 3); g.lineTo(x - 27, y - 16); g.stroke();
      g.fillStyle = '#7a4c2a'; g.beginPath(); g.ellipse(x - 32, y - 19, 8.5, 5.5, -0.3, 0, TAU); g.fill(); g.beginPath(); g.ellipse(x - 39, y - 16, 4.5, 3.6, -0.2, 0, TAU); g.fill();
      g.beginPath(); g.ellipse(x - 26, y - 25, 2.2, 4.5, 0.6, 0, TAU); g.fill();
      g.strokeStyle = '#d9b98a'; g.lineWidth = 1.8; g.beginPath(); g.moveTo(x - 30, y - 24); g.lineTo(x - 28, y - 36); g.lineTo(x - 23, y - 42); g.moveTo(x - 28.6, y - 32); g.lineTo(x - 34, y - 38); g.moveTo(x - 27.5, y - 36); g.lineTo(x - 26, y - 44); g.moveTo(x - 33, y - 24); g.lineTo(x - 36, y - 34); g.lineTo(x - 41, y - 38); g.moveTo(x - 35, y - 30); g.lineTo(x - 39, y - 31); g.stroke();
      g.fillStyle = '#1b120c'; g.beginPath(); g.arc(x - 34, y - 21, 1.2, 0, TAU); g.fill();
      g.strokeStyle = '#b3261e'; g.lineWidth = 3; g.beginPath(); g.moveTo(x - 20, y - 12); g.lineTo(x - 15, y - 3); g.stroke();
      g.fillStyle = '#e8c15a'; g.beginPath(); g.arc(x - 16, y - 2 + Math.sin(ph * 2) * 0.8, 2.2, 0, TAU); g.fill();
      if (rudolph) { g.globalCompositeOperation = 'lighter'; g.globalAlpha = 0.6 + 0.4 * Math.sin(t * 5); g.drawImage(glow([255, 60, 50]), x - 52, y - 27, 22, 22); g.globalAlpha = 1; g.globalCompositeOperation = 'source-over'; g.fillStyle = '#ff3b30'; g.beginPath(); g.arc(x - 42, y - 16, 3.2, 0, TAU); g.fill(); }
      else { g.fillStyle = '#2a1a10'; g.beginPath(); g.arc(x - 43, y - 16, 2, 0, TAU); g.fill(); }
    }
    function drawSanta(g, x, y, s, rot, t, dpr) {
      g.setTransform(dpr * s * Math.cos(rot), dpr * s * Math.sin(rot), -dpr * s * Math.sin(rot), dpr * s * Math.cos(rot), dpr * x, dpr * y);
      const D = [-82, -140, -198]; const DY = D.map((d, i) => -4 + Math.sin(t * 6 + i * 1.2) * 3.5);
      g.strokeStyle = 'rgba(120,70,30,.9)'; g.lineWidth = 1.3;
      for (let i = 0; i < 3; i++) { g.beginPath(); g.moveTo(-20, -27 + Math.sin(t * 3) * 1.5); g.quadraticCurveTo((D[i] - 20) / 2, -6 + DY[i], D[i] - 16, DY[i] - 9); g.stroke(); }
      g.strokeStyle = 'rgba(216,170,80,.9)'; g.lineWidth = 1; g.beginPath(); g.moveTo(D[0] - 16, DY[0] - 9); g.lineTo(D[2] - 16, DY[2] - 9); g.stroke();
      for (let i = 2; i >= 0; i--) deer(g, D[i], DY[i], t * 9 + i * 1.3, i === 2, t);
      // sack + presents
      g.fillStyle = '#7b4a2a'; g.beginPath(); g.ellipse(34, -26, 15, 17, 0.2, 0, TAU); g.fill();
      g.fillStyle = '#2f7d4f'; g.fillRect(24, -46, 11, 10); g.fillStyle = '#e8c15a'; g.fillRect(28.5, -46, 2, 10);
      g.fillStyle = '#c62828'; g.fillRect(36, -44, 9, 9); g.fillStyle = '#fff'; g.fillRect(39.5, -44, 2, 9);
      // Santa
      const arm = Math.sin(t * 3) * 1.5;
      g.fillStyle = '#c4161c'; g.beginPath(); g.ellipse(7, -30, 14, 16, 0, 0, TAU); g.fill();
      g.fillStyle = '#1b1b1b'; g.fillRect(-6, -26, 26, 4); g.fillStyle = '#e8c15a'; g.fillRect(3, -27, 6, 6); g.fillStyle = '#1b1b1b'; g.fillRect(4.5, -25.5, 3, 3);
      g.strokeStyle = '#c4161c'; g.lineWidth = 6; g.lineCap = 'round'; g.beginPath(); g.moveTo(0, -36); g.lineTo(-17, -27 + arm); g.stroke();
      g.fillStyle = '#f2f2f2'; g.beginPath(); g.arc(-12, -29 + arm * 0.6, 3.6, 0, TAU); g.fill();
      g.fillStyle = '#1b1b1b'; g.beginPath(); g.arc(-19, -27 + arm, 3.4, 0, TAU); g.fill();
      g.fillStyle = '#f5c6a5'; g.beginPath(); g.arc(3, -52, 8, 0, TAU); g.fill();
      g.fillStyle = '#ffffff'; g.beginPath(); g.ellipse(0, -45, 9.5, 8.5, 0.15, 0, TAU); g.fill(); g.beginPath(); g.ellipse(-3, -49, 5.5, 2.6, 0, 0, TAU); g.fill();
      g.fillStyle = '#e99a8a'; g.beginPath(); g.arc(-4, -51.5, 2, 0, TAU); g.fill(); g.fillStyle = '#2a1a10'; g.beginPath(); g.arc(-2, -55, 1, 0, TAU); g.fill();
      const sw = Math.sin(t * 4) * 3;
      g.fillStyle = '#c4161c'; g.beginPath(); g.moveTo(-6, -57); g.quadraticCurveTo(2, -70, 16, -66 + sw); g.lineTo(11, -57); g.closePath(); g.fill();
      g.fillStyle = '#ffffff'; g.beginPath(); g.ellipse(3, -57, 10, 3.2, 0, 0, TAU); g.fill(); g.beginPath(); g.arc(17, -66 + sw, 3.4, 0, TAU); g.fill();
      // sleigh
      const sg = g.createLinearGradient(0, -24, 0, 18); sg.addColorStop(0, '#d6322c'); sg.addColorStop(1, '#8e1414'); g.fillStyle = sg;
      g.beginPath(); g.moveTo(-40, -8); g.quadraticCurveTo(-46, 14, -28, 16); g.lineTo(38, 16); g.quadraticCurveTo(48, 16, 48, 2); g.lineTo(48, -22); g.quadraticCurveTo(48, -32, 38, -28); g.lineTo(20, -14); g.lineTo(-28, -14); g.quadraticCurveTo(-42, -14, -40, -8); g.closePath(); g.fill();
      g.strokeStyle = '#e8c15a'; g.lineWidth = 2; g.beginPath(); g.moveTo(-38, -10); g.quadraticCurveTo(-36, -14, -28, -14); g.lineTo(20, -14); g.lineTo(38, -28); g.stroke();
      g.lineWidth = 1.6; g.beginPath(); g.moveTo(-30, 8); g.bezierCurveTo(-18, -6, -4, 12, 8, 0); g.bezierCurveTo(16, -8, 26, 6, 38, -4); g.stroke(); g.fillStyle = '#e8c15a'; [[-30, 8], [8, 0], [38, -4]].forEach((q) => { g.beginPath(); g.arc(q[0], q[1], 2, 0, TAU); g.fill(); });
      g.lineWidth = 2.4; g.beginPath(); g.moveTo(-22, 16); g.lineTo(-24, 23); g.moveTo(28, 16); g.lineTo(30, 23); g.stroke();
      g.beginPath(); g.moveTo(46, 23); g.lineTo(-40, 23); g.quadraticCurveTo(-56, 23, -56, 11); g.quadraticCurveTo(-56, 3, -48, 6); g.stroke();
      g.setTransform(dpr, 0, 0, dpr, 0, 0);
    }
    function fly() { if (reduced() || !E.W) return false; const s = clamp(E.W * 0.3 / 300, 0.5, 1.2); E.santa = { t0: E.t, D: E.W < 700 ? 11 : 16, s, y0: rnd(0.1, 0.18), amp: rnd(0.04, 0.08) }; E.nextSanta = E.t + (E.key === 'christmas' ? rnd(90, 180) : rnd(150, 300)); kick(); return true; }
    function santaAt(sa, t) { const u = (t - sa.t0) / sa.D; const x0 = E.W + 260 * sa.s, x1 = -70 * sa.s; return [x0 + (x1 - x0) * u, E.H * (sa.y0 + sa.amp * Math.sin(u * Math.PI * 1.3)) + Math.sin(t * 1.8) * 9 * sa.s, u]; }
    function santaStep(g) {
      const sa = E.santa; if (!sa) return; const a = santaAt(sa, E.t); if (a[2] >= 1) { E.santa = null; return; }
      const b = santaAt(sa, E.t + 0.05); const rot = clamp(Math.atan2(b[1] - a[1], -(b[0] - a[0]) || 1) * -0.6, -0.25, 0.25);
      if (Math.random() < (LEGACY ? 0.5 : 0.9)) part(a[0] + 50 * sa.s, a[1] + 12 * sa.s, rnd(20, 60), rnd(-10, 20), Math.random() < 0.7 ? COL.gold : COL.white, rnd(0.6, 1.2), 2 * sa.s + 0.6, 1, 30, true, 0);
      drawSanta(g, a[0], a[1], sa.s, rot, E.t, E.odpr);
    }

    /* ---------------- canvases, timing, loop ---------------- */
    function info() { return core.wallInfo ? core.wallInfo() : { active: false, page: '' }; }
    function overlay() {
      if (!E.ov) { E.ov = document.createElement('canvas'); E.ov.id = 'fxov'; E.ov.setAttribute('aria-hidden', 'true'); document.body.appendChild(E.ov); E.oc = E.ov.getContext('2d'); E.needSize = true; }
      if (E.needSize) { E.needSize = false; E.W = window.innerWidth; E.H = window.innerHeight; E.odpr = LEGACY ? 1 : Math.min(window.devicePixelRatio || 1, 2); E.ov.width = E.W * E.odpr | 0; E.ov.height = E.H * E.odpr | 0; E.ov.style.width = E.W + 'px'; E.ov.style.height = E.H + 'px'; E.dpr = E.odpr; E.sW = 0; }
    }
    function stageFind() {
      const el = document.querySelector('.w-root .fx-stage'); if (el !== E.sEl) { E.sEl = el; E.st = el ? el.querySelector('canvas') : null; E.sc = E.st ? E.st.getContext('2d') : null; E.sW = 0; E.staticDrawn = ''; }
      if (!E.st) { E.sVis = false; E.sRect = null; return; }
      const r = E.sEl.getBoundingClientRect(); E.sRect = r; E.sVis = r.bottom > 0 && r.top < E.H && r.width > 0;
      const w = Math.round(r.width), h = Math.round(r.height); if (w !== E.sW || h !== E.sH) { E.sW = w; E.sH = h; E.st.width = w * E.dpr | 0; E.st.height = h * E.dpr | 0; E.staticDrawn = ''; }
      const key = E.sEl.getAttribute('data-scene') || 'winter';
      if (key !== E.key) { const make = SCENES[key] || SCENES.relax; const ns = make(key); ns.age = 0; ns.update(0.016, E.t);
        if (E.scene && !reduced()) { E.prev = E.scene; E.mix = 0; E.mixDur = clamp(+E.sEl.getAttribute('data-trans') || 1.6, 1.2, 6); } else { E.prev = null; E.mix = 1; }
        E.scene = ns; E.key = key; E.staticDrawn = ''; if (key === 'wake') E.wp = 0.02; if (key === 'christmas') E.nextSanta = Math.min(E.nextSanta || 1e9, E.t + 3); }
      E.room = E.sEl.getAttribute('data-room') || '';
    }
    function roomLevel() {
      if (!E.room || !core.model) return 0; const r = core.model().roomById[E.room]; if (!r) return 0;
      const ls = core.moods && core.moods() ? core.moods().roomLights(r) : r.devs.filter((e) => e.indexOf('light.') === 0);
      let n = 0, sum = 0; ls.forEach((e) => { const s = S.states[e]; if (s && s.state === 'on') { n++; sum += s.attributes.brightness != null ? s.attributes.brightness / 255 : 1; } });
      return ls.length ? sum / ls.length : 0;
    }
    function wakeTarget() { const m = core.moods && core.moods(); const rp = m && m.running(); if (rp && rp.room === E.room) return clamp(rp.i / rp.n, 0.03, 1); return 1; }
    function seasonOn(inf) { if (E.standby) return true; return inf.active && inf.page === 'screen'; }
    function fgKind(inf) { if (E.standby && !(inf.page === 'screen')) return 'snow'; if (!(inf.active && inf.page === 'screen') || !E.sVis && !E.sEl) return ''; const k = E.key; return k === 'winter' || k === 'christmas' ? 'snow' : k === 'spring' ? 'petal' : k === 'autumn' ? 'leaf' : k === 'summer' ? 'mote' : ''; }
    function santaAllowed(inf) { return (E.standby || (inf.active && inf.page === 'screen' && (E.key === 'winter' || E.key === 'christmas'))) && !reduced(); }
    function holidayCheck(inf) {
      if (settings.wallFireworks === 'off' || !inf.active || inf.page !== 'screen' || inf.dimmed || reduced()) return;
      const d = new Date(); const m = d.getMonth(), day = d.getDate(), h = d.getHours();
      const ny = (m === 11 && day === 31 && h >= 20) || (m === 0 && day === 1 && h < 1); const xmasEve = m === 11 && day >= 24 && day <= 26 && h >= 17 && h < 22;
      if (ny && E.t - E.lastShow > (h === 23 && d.getMinutes() >= 58 || h === 0 && d.getMinutes() < 3 ? 12 : 90)) show('big');
      else if (xmasEve && E.t - E.lastShow > 720) show('xmas');
    }
    function busyOverlay() { return !!((E.veil || 0) > 0.01 || E.t < (E.showUntil || 0) || E.santa || E.fw.p.length || E.fw.r.length || E.fw.f.length || E.fw.q.length || E.fg.length || E.fgOld.length); }
    function frame(now) {
      E.raf = 0; const inf = info();
      if (!inf.active || document.hidden) { stopAll(); return; }
      if (!E.lastNow) { E.lastNow = now - 1000 / FPS; }
      const ms = now - E.lastNow; const cap = 1000 / (inf.dimmed ? 20 : FPS) - 2;
      if (ms < cap) { E.raf = requestAnimationFrame(frame); return; }
      const dt = Math.min(ms, 80) / 1000; E.lastNow = now; E.t += dt; E.frames++;
      overlay();
      if (E.t - E.rectT > 0.4 || !E.sEl || !document.body.contains(E.sEl)) { E.rectT = E.t; stageFind(); }
      // wind with gusts
      if (Math.random() < dt * 0.06) E.gust = rnd(0.6, 1.4) * (Math.random() < 0.5 ? -1 : 1); E.gust *= Math.exp(-dt * 0.7); E.wind = Math.sin(E.t * 0.13) * 0.5 + Math.sin(E.t * 0.031 + 1) * 0.3 + E.gust;
      const rm = reduced();
      // stage
      const stageLive = E.sc && E.sVis && E.scene && inf.page === 'screen';
      if (stageLive) {
        E.level += (roomLevel() - E.level) * Math.min(1, dt * 1.5); const wt = wakeTarget(); E.wp += (wt - E.wp) * Math.min(1, dt * (E.key === 'wake' ? 0.35 : 3));
        if (rm) { if (E.staticDrawn !== E.key + E.sW) { E.scene.age = 10; drawStage(0); E.staticDrawn = E.key + E.sW; } }
        else { if (E.mix < 1) { E.mix = Math.min(1, E.mix + dt / E.mixDur); if (E.mix >= 1) E.prev = null; } E.scene.age += dt; E.scene.update(dt, E.t); if (E.prev) { E.prev.age += dt; E.prev.update(dt, E.t); } drawStage(dt); }
      }
      // overlay: foreground particles, fireworks, Santa
      if (!rm) {
        const fk = fgKind(inf);
        if (fk !== E.fgK) { if (E.fg.length) { E.fgOld = E.fg; E.fgOldK = E.fgK; E.fgOldA = 1; } E.fgK = fk; const n = fk === 'snow' ? Math.round(30 * Q) + 6 : fk ? Math.round(14 * Q) + 4 : 0; E.fg = fk === 'mote' ? moteSet(n) : fk === 'snow' ? snowSet(n).map((p) => { p.y = rnd(-1, 0); p.big = Math.random() < 0.2; return p; }) : fk ? P(n, () => fallOne(false)) : []; }
        if (santaAllowed(inf)) { if (!E.santa && !E.nextSanta) E.nextSanta = E.t + (E.standby ? 5 : 8); if (!E.santa && E.nextSanta && E.t >= E.nextSanta) { fly(); E.nextSanta = E.t + (E.key === 'christmas' ? rnd(90, 180) : rnd(150, 300)); } }
        else if (!E.santa) E.nextSanta = 0;
        if (E.t - E.lastCheck > 5) { E.lastCheck = E.t; holidayCheck(inf); }
        fwUpdate(dt);
        if (busyOverlay()) {
          if (!E.ovOn) { E.ovOn = true; E.ov.className = 'on'; }
          const g = E.oc; g.setTransform(E.odpr, 0, 0, E.odpr, 0, 0); g.clearRect(0, 0, E.W, E.H);
          fgStep(g, E.fg, E.fgK, 1, dt); if (E.fgOld.length) { E.fgOldA -= dt / 1.8; if (E.fgOldA <= 0) E.fgOld = []; else fgStep(g, E.fgOld, E.fgOldK, E.fgOldA, dt); }
          // during a show a night sky slides over the top so the light really stands out, then it fades away again
          const vt = E.t < (E.showUntil || 0) ? 1 : 0; E.veil = (E.veil || 0) + (vt - (E.veil || 0)) * Math.min(1, dt * (vt ? 1.6 : 0.9));
          if (E.veil > 0.01) { if (!E.veilG || E.veilH !== E.H) { E.veilH = E.H; E.veilG = g.createLinearGradient(0, 0, 0, E.H); E.veilG.addColorStop(0, 'rgba(8,8,24,.9)'); E.veilG.addColorStop(0.45, 'rgba(14,12,32,.7)'); E.veilG.addColorStop(0.8, 'rgba(20,16,36,.12)'); E.veilG.addColorStop(1, 'rgba(20,16,36,0)'); } g.globalAlpha = ease(E.veil) * (E.veilMax || 1); g.fillStyle = E.veilG; g.fillRect(0, 0, E.W, E.H); g.globalAlpha = 1; }
          santaStep(g); fwDraw(g);
        } else if (E.ovOn) { E.ovOn = false; E.oc.setTransform(1, 0, 0, 1, 0, 0); E.oc.clearRect(0, 0, E.ov.width, E.ov.height); E.ov.className = ''; }
      }
      document.documentElement.classList.toggle('w-standby', !!E.standby);
      const keep = (stageLive && !rm) || (!rm && busyOverlay()) || (stageLive && rm && E.staticDrawn !== E.key + E.sW) || (!rm && santaAllowed(inf)) || (!rm && inf.page === 'screen' && !!E.sEl);
      if (keep) E.raf = requestAnimationFrame(frame); else E.lastNow = 0;
    }
    function fgStep(g, a, k, al, dt) {
      if (!a.length) return; const t = E.t;
      if (k === 'snow') { snowUpd(a, dt, t, 0.42); snowDraw(g, a, E.W, E.H, al * 0.95, 1.15, E.odpr); }
      else if (k === 'petal') { fallUpd(a, dt, t, 0.35); fallDraw(g, a, E.W, E.H, al, sprites().petals, 8, t, E.odpr); }
      else if (k === 'leaf') { fallUpd(a, dt, t, 0.38); fallDraw(g, a, E.W, E.H, al, sprites().leaves, 12, t, E.odpr); }
      else if (k === 'mote') { moteUpd(a, dt, t, 0.6); moteDraw(g, a, E.W, E.H, al * 0.8, [255, 200, 120], 5, t); }
    }
    function drawStage() {
      const g = E.sc; const W = E.sW, H = E.sH; const d = E.dpr; g.setTransform(d, 0, 0, d, 0, 0); g.globalAlpha = 1; g.globalCompositeOperation = 'source-over';
      if (E.prev) { E.prev.draw(g, W, H, 1, E.t, d); E.scene.draw(g, W, H, ease(E.mix), E.t, d); } else E.scene.draw(g, W, H, 1, E.t, d);
      if (E.room && E.level > 0.02) softAt(g, [255, 210, 150], W * 0.5, 0, Math.max(W, H) * 0.6, 0.28 * E.level);
    }
    function stopAll() { if (E.raf) cancelAnimationFrame(E.raf); E.raf = 0; E.lastNow = 0; if (E.ov && E.ovOn) { E.ovOn = false; E.oc.setTransform(1, 0, 0, 1, 0, 0); E.oc.clearRect(0, 0, E.ov.width, E.ov.height); E.ov.className = ''; } }
    function kick() { if (!E.raf && !document.hidden) E.raf = requestAnimationFrame(frame); }
    window.addEventListener('resize', () => { E.needSize = true; E.rectT = -1; kick(); });
    window.addEventListener('scroll', () => { E.rectT = -1; kick(); }, { passive: true });
    document.addEventListener('visibilitychange', () => { if (document.hidden) stopAll(); else kick(); });
    if (RM && RM.addListener) RM.addListener(() => { E.staticDrawn = ''; E.santa = null; E.fw = { r: [], p: [], f: [], q: [] }; E.fg = []; E.fgOld = []; kick(); });

    /* ---------------- API for wall.js / moods.js ---------------- */
    function mood(roomId, md) {
      if (!md) return; const k = md.key;
      if (k === 'christmas') { if (settings.wallFireworks !== 'off') setTimeout(() => show('subtle'), 1400); E.nextSanta = E.t + 2.5; }
      E.rectT = -1; kick();
    }
    function standby(on) { on = !!on; if (on !== E.standby) { E.standby = on; if (on) E.nextSanta = 0; kick(); } }
    window.__comfortFX = { state: () => ({ frames: E.frames, running: !!E.raf, scene: E.key, prev: E.prev ? E.prev.key : null, mix: E.mix, santa: E.santa ? santaAt(E.santa, E.t) : null, parts: E.fw.p.length, rockets: E.fw.r.length, fg: E.fg.length, fgKind: E.fgK, level: E.level, wake: E.wp, legacy: LEGACY, reduced: reduced(), stageVisible: E.sVis }), fly, show };
    return { kick, mood, standby, fly, show, reduced };
  };
})();
