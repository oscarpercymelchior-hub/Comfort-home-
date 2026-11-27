/* Comfort Home – seasonal animation layer for the Screen tab (iPad layout). Separate module.
   Canvas 2D (works on Safari 12 / A7): pre-rendered sprites, particle budgets per device, frame cap,
   and the loop stops completely when nothing is visible (other tab, app hidden, screen black).
   Winter: snow + Santa with sleigh and reindeer · Spring: blossom · Summer: warm light motes · Autumn: leaves.
   Respects "reduce motion" (then nothing moves). Nothing here talks to Home Assistant. */
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

    const E = { ov: null, oc: null, odpr: 1, W: 0, H: 0, raf: 0, lastNow: 0, t: 0, frames: 0, wind: 0, gust: 0,
      fg: [], fgOld: [], fgK: '', fgOldK: '', fgOldA: 0, santa: null, nextSanta: 0, standby: false, needSize: true, ovOn: false, sp: [] };

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

    const GOLD = [255, 196, 88], WHITE = [255, 248, 236];
    // little golden sparkles behind the sleigh
    function spark(x, y, vx, vy, c, life, size) { if (E.sp.length < (LEGACY ? 60 : 160)) E.sp.push({ x, y, vx, vy, c, life, age: 0, size, ph: Math.random() * 9 }); }
    function sparkStep(g, dt) {
      if (!E.sp.length) return; g.globalCompositeOperation = 'lighter';
      for (let i = E.sp.length - 1; i >= 0; i--) { const p = E.sp[i]; p.age += dt; if (p.age >= p.life) { E.sp.splice(i, 1); continue; } p.vx *= 1 - dt; p.vy = p.vy * (1 - dt) + 30 * dt; p.x += p.vx * dt; p.y += p.vy * dt;
        const al = Math.pow(1 - p.age / p.life, 1.4) * (0.55 + 0.45 * Math.sin(p.age * 38 + p.ph)); const s = p.size * 2.4; g.globalAlpha = al; g.drawImage(glow(p.c), p.x - s, p.y - s, 2 * s, 2 * s); }
      g.globalAlpha = 1; g.globalCompositeOperation = 'source-over';
    }
    function fly() { if (reduced() || !E.W) return false; const s = clamp(E.W * 0.3 / 300, 0.5, 1.2); E.santa = { t0: E.t, D: E.W < 700 ? 11 : 16, s, y0: rnd(0.1, 0.18), amp: rnd(0.04, 0.08) }; E.nextSanta = E.t + rnd(150, 300); kick(); return true; }
    function santaAt(sa, t) { const u = (t - sa.t0) / sa.D; const x0 = E.W + 260 * sa.s, x1 = -70 * sa.s; return [x0 + (x1 - x0) * u, E.H * (sa.y0 + sa.amp * Math.sin(u * Math.PI * 1.3)) + Math.sin(t * 1.8) * 9 * sa.s, u]; }
    function santaStep(g) {
      const sa = E.santa; if (!sa) return; const a = santaAt(sa, E.t); if (a[2] >= 1) { E.santa = null; return; }
      const b = santaAt(sa, E.t + 0.05); const rot = clamp(Math.atan2(b[1] - a[1], -(b[0] - a[0]) || 1) * -0.6, -0.25, 0.25);
      if (Math.random() < (LEGACY ? 0.5 : 0.9)) spark(a[0] + 50 * sa.s, a[1] + 12 * sa.s, rnd(20, 60), rnd(-10, 20), Math.random() < 0.7 ? GOLD : WHITE, rnd(0.6, 1.2), 2 * sa.s + 0.6);
      drawSanta(g, a[0], a[1], sa.s, rot, E.t, E.odpr);
    }

    /* ---------------- canvas, timing, loop ---------------- */
    function info() { return core.wallInfo ? core.wallInfo() : { active: false, page: '' }; }
    function overlay() {
      if (!E.ov) { E.ov = document.createElement('canvas'); E.ov.id = 'fxov'; E.ov.setAttribute('aria-hidden', 'true'); document.body.appendChild(E.ov); E.oc = E.ov.getContext('2d'); E.needSize = true; }
      if (E.needSize) { E.needSize = false; E.W = window.innerWidth; E.H = window.innerHeight; E.odpr = LEGACY ? 1 : Math.min(window.devicePixelRatio || 1, 2); E.ov.width = E.W * E.odpr | 0; E.ov.height = E.H * E.odpr | 0; E.ov.style.width = E.W + 'px'; E.ov.style.height = E.H + 'px'; }
    }
    const onScreen = (inf) => inf.active && inf.page === 'screen';
    function fgKind(inf) { if (E.standby && !onScreen(inf)) return 'snow'; if (!onScreen(inf)) return ''; const k = inf.season; return k === 'winter' ? 'snow' : k === 'spring' ? 'petal' : k === 'autumn' ? 'leaf' : k === 'summer' ? 'mote' : ''; }
    const santaAllowed = (inf) => !reduced() && (E.standby || (onScreen(inf) && inf.season === 'winter'));
    const busy = () => !!(E.santa || E.sp.length || E.fg.length || E.fgOld.length);
    function frame(now) {
      E.raf = 0; const inf = info();
      if (!inf.active || document.hidden || inf.black || reduced()) { stopAll(); return; }
      if (!E.lastNow) E.lastNow = now - 1000 / FPS;
      const ms = now - E.lastNow; const cap = 1000 / (inf.dimmed ? 20 : FPS) - 2;
      if (ms < cap) { E.raf = requestAnimationFrame(frame); return; }
      const dt = Math.min(ms, 80) / 1000; E.lastNow = now; E.t += dt; E.frames++;
      overlay();
      if (Math.random() < dt * 0.06) E.gust = rnd(0.6, 1.4) * (Math.random() < 0.5 ? -1 : 1); E.gust *= Math.exp(-dt * 0.7); E.wind = Math.sin(E.t * 0.13) * 0.5 + Math.sin(E.t * 0.031 + 1) * 0.3 + E.gust;
      const fk = fgKind(inf);
      if (fk !== E.fgK) { if (E.fg.length) { E.fgOld = E.fg; E.fgOldK = E.fgK; E.fgOldA = 1; } E.fgK = fk; const n = fk === 'snow' ? Math.round(34 * Q) + 6 : fk ? Math.round(16 * Q) + 4 : 0;
        E.fg = fk === 'mote' ? moteSet(n) : fk === 'snow' ? snowSet(n).map((p) => { p.y = rnd(-1, 0); p.big = Math.random() < 0.2; return p; }) : fk ? P(n, () => fallOne(false)) : []; }
      if (santaAllowed(inf)) { if (!E.santa && !E.nextSanta) E.nextSanta = E.t + (E.standby ? 5 : 8); if (!E.santa && E.nextSanta && E.t >= E.nextSanta) fly(); }
      else if (!E.santa) E.nextSanta = 0;
      if (busy()) {
        if (!E.ovOn) { E.ovOn = true; E.ov.className = 'on'; }
        const g = E.oc; g.setTransform(E.odpr, 0, 0, E.odpr, 0, 0); g.clearRect(0, 0, E.W, E.H);
        fgStep(g, E.fg, E.fgK, 1, dt); if (E.fgOld.length) { E.fgOldA -= dt / 1.8; if (E.fgOldA <= 0) E.fgOld = []; else fgStep(g, E.fgOld, E.fgOldK, E.fgOldA, dt); }
        santaStep(g); sparkStep(g, dt);
      } else hide();
      document.documentElement.classList.toggle('w-standby', !!E.standby);
      if (busy() || santaAllowed(inf)) E.raf = requestAnimationFrame(frame); else E.lastNow = 0;
    }
    function fgStep(g, a, k, al, dt) {
      if (!a.length) return; const t = E.t;
      if (k === 'snow') { snowUpd(a, dt, t, 0.42); snowDraw(g, a, E.W, E.H, al * 0.95, 1.15, E.odpr); }
      else if (k === 'petal') { fallUpd(a, dt, t, 0.35); fallDraw(g, a, E.W, E.H, al, sprites().petals, 8, t, E.odpr); }
      else if (k === 'leaf') { fallUpd(a, dt, t, 0.38); fallDraw(g, a, E.W, E.H, al, sprites().leaves, 12, t, E.odpr); }
      else if (k === 'mote') { moteUpd(a, dt, t, 0.6); moteDraw(g, a, E.W, E.H, al * 0.8, [255, 200, 120], 5, t); }
    }
    function hide() { if (E.ov && E.ovOn) { E.ovOn = false; E.oc.setTransform(1, 0, 0, 1, 0, 0); E.oc.clearRect(0, 0, E.ov.width, E.ov.height); E.ov.className = ''; } }
    function stopAll() { if (E.raf) cancelAnimationFrame(E.raf); E.raf = 0; E.lastNow = 0; hide(); }
    function kick() { if (!E.raf && !document.hidden) E.raf = requestAnimationFrame(frame); }
    window.addEventListener('resize', () => { E.needSize = true; kick(); });
    document.addEventListener('visibilitychange', () => { if (document.hidden) stopAll(); else kick(); });
    if (RM && RM.addListener) RM.addListener(() => { E.santa = null; E.sp = []; E.fg = []; E.fgOld = []; E.fgK = ''; kick(); });

    function standby(on) { on = !!on; if (on !== E.standby) { E.standby = on; if (on) E.nextSanta = 0; kick(); } }
    window.__comfortFX = { state: () => ({ frames: E.frames, running: !!E.raf, santa: E.santa ? santaAt(E.santa, E.t) : null, fg: E.fg.length, fgKind: E.fgK, legacy: LEGACY, reduced: reduced() }), fly };
    return { kick, standby, fly, reduced, mood: () => kick() };
  };
})();
