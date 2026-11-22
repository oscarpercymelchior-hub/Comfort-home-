/* Comfort Home 1.5.0 — runs on top of Home Assistant at /comfort-home. Does nothing on any other page. */
(function () {
  // Opened from the iPhone home-screen icon but Home Assistant sent us to its own start page after login? Go to Comfort.
  var leave = false; try { leave = !!sessionStorage.getItem('comfortLeave'); } catch (e) { /* */ }
  if (navigator.standalone === true && !leave && !/^\/(comfort-home|auth)(\/|$)/.test(location.pathname)) { location.replace('/comfort-home'); return; }
  if (!/^\/comfort-home(\/|$)/.test(location.pathname) || window.__comfortLoaded) return;
  window.__comfortLoaded = true;
  var head = document.head;
  function meta(n, c) { var m = head.querySelector('meta[name="' + n + '"]'); if (!m) { m = document.createElement('meta'); m.name = n; head.appendChild(m); } m.content = c; }
  function link(rel, href, sizes) { var l = document.createElement('link'); l.rel = rel; l.href = href; if (sizes) l.sizes = sizes; head.appendChild(l); }
  // Home-screen app: our own name and icon, and open this page (not the Home Assistant start page)
  head.querySelectorAll('link[rel="manifest"],link[rel="apple-touch-icon"],link[rel="icon"],link[rel="mask-icon"]').forEach(function (l) { l.remove(); });
  meta('apple-mobile-web-app-capable', 'yes'); meta('mobile-web-app-capable', 'yes');
  meta('apple-mobile-web-app-title', 'Comfort'); meta('application-name', 'Comfort'); meta('apple-mobile-web-app-status-bar-style', 'default');
  meta('viewport', 'width=device-width,initial-scale=1,viewport-fit=cover');
  link('apple-touch-icon', "data:image/png;base64,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", '180x180'); link('icon', "data:image/png;base64,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");
  function keepTitle() { if (document.title !== 'Comfort') document.title = 'Comfort'; }
  keepTitle(); new MutationObserver(keepTitle).observe(head, { childList: true, subtree: true, characterData: true });
  var st = document.createElement('style'); st.textContent = "/* Comfort Home — design system\n   Inspired by the calm, pastel, card-based look of Panasonic Comfort Cloud. Original branding. */\n:root{\n  --bg:#f2f4f7; --bg2:#e9eef4; --card:#ffffff; --card2:#f7f9fb; --text:#1d2733; --text2:#4a5868; --muted:#8a96a3; --line:#e4e9ef;\n  --accent:#2f86d6; --accent-ink:#ffffff; --accent-soft:#e2effb; --accent-2:#5aa7ea;\n  --ok:#2fa57d; --warn:#e48a3c; --bad:#d9534f;\n  --blue:#e4f0fb; --blue-i:#2f7fc8; --mint:#e1f4ec; --mint-i:#2b9a74; --warm:#fdeedf; --warm-i:#d27a32;\n  --lav:#ece9f8; --lav-i:#6c5fc7; --rose:#fbe8ec; --rose-i:#c8556c; --sand:#faf3dc; --sand-i:#b08a1e;\n  --hero1:#dcecfb; --hero2:#eef6fd; --hero-ink:#173a5e;\n  --shadow:0 1px 2px rgba(20,40,70,.04),0 4px 14px rgba(20,40,70,.06);\n  --shadow-lg:0 10px 40px rgba(20,40,70,.16);\n  --r:20px; --r-sm:14px; --gap:12px; --pad:18px;\n  --nav-h:68px; --safe-b:env(safe-area-inset-bottom,0px); --safe-t:env(safe-area-inset-top,0px); --safe-l:env(safe-area-inset-left,0px); --safe-r:env(safe-area-inset-right,0px);\n  --tog-off:#d5dde6; --scrim:rgba(18,28,40,.32);\n  color-scheme:light;\n}\nhtml[data-theme=\"dark\"]{\n  --bg:#15181d; --bg2:#1b1f25; --card:#1f242b; --card2:#252b33; --text:#e7ebf0; --text2:#b8c1cc; --muted:#8792a0; --line:#2c333c;\n  --accent:#6aa9e6; --accent-ink:#0f1a26; --accent-soft:#22344a; --accent-2:#87bcef;\n  --ok:#5cc39d; --warn:#e8a364; --bad:#e57873;\n  --blue:#1f2d3c; --blue-i:#86b9ea; --mint:#1c2f2a; --mint-i:#7fcfae; --warm:#33281f; --warm-i:#e7ae7c;\n  --lav:#27253a; --lav-i:#aea5ea; --rose:#33232a; --rose-i:#e59aaa; --sand:#2f2b1d; --sand-i:#d6bd70;\n  --hero1:#1d2a39; --hero2:#1a2029; --hero-ink:#dbe8f5;\n  --shadow:0 1px 2px rgba(0,0,0,.2),0 4px 14px rgba(0,0,0,.18);\n  --shadow-lg:0 10px 40px rgba(0,0,0,.5);\n  --tog-off:#3a424d; --scrim:rgba(0,0,0,.5);\n  color-scheme:dark;\n}\n*{box-sizing:border-box;-webkit-tap-highlight-color:transparent}\nhtml,body{margin:0;background:var(--bg);color:var(--text)}\nhtml{transition:background-color .4s;-webkit-text-size-adjust:100%;text-size-adjust:100%}\nbody{font-family:system-ui,-apple-system,\"Segoe UI\",Roboto,\"Helvetica Neue\",Arial,sans-serif;font-size:15px;line-height:1.35;\n  -webkit-font-smoothing:antialiased;text-rendering:optimizeLegibility;overscroll-behavior-y:none;min-height:100vh;min-height:100dvh}\nbutton,input,select{font:inherit;color:inherit}\nbutton{background:none;border:0;padding:0;cursor:pointer;touch-action:manipulation}\nbutton,a,.tile,.room,.chip,nav.bn{-webkit-user-select:none;user-select:none;-webkit-touch-callout:none}\na,button,input,select,label{touch-action:manipulation}\nbutton:focus-visible,input:focus-visible,select:focus-visible,a:focus-visible{outline:2px solid var(--accent);outline-offset:2px}\n.i{width:1em;height:1em;flex:none;fill:none;stroke:currentColor;stroke-width:2;stroke-linecap:round;stroke-linejoin:round}\n.num{font-variant-numeric:tabular-nums;font-feature-settings:\"tnum\"}\n\n#app{max-width:560px;margin:0 auto;min-height:100vh;min-height:100dvh;position:relative}\n#view{padding:calc(var(--safe-t) + 10px) calc(var(--pad) + var(--safe-r)) calc(var(--nav-h) + var(--safe-b) + 24px) calc(var(--pad) + var(--safe-l))}\n.page{animation:pageIn .28s cubic-bezier(.2,.7,.3,1)}\n@keyframes pageIn{from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:none}}\n.page.sub{animation-name:subIn}\n@keyframes subIn{from{opacity:0;transform:translateX(18px)}to{opacity:1;transform:none}}\n\n/* top bar */\n.topbar{display:flex;align-items:center;gap:10px;min-height:52px;margin-bottom:6px}\n.topbar h1{font-size:24px;font-weight:650;letter-spacing:-.01em;margin:0;flex:1}\n.topbar .sub{color:var(--muted);font-size:13px;font-weight:500}\n.iconbtn{width:44px;height:44px;border-radius:50%;display:grid;place-items:center;font-size:20px;color:var(--text2);background:var(--card);box-shadow:var(--shadow);flex:none}\n.iconbtn:active{transform:scale(.94)}\n\n/* connection pill */\n.pill{display:inline-flex;align-items:center;gap:6px;font-size:12px;font-weight:600;padding:5px 10px;border-radius:999px;background:var(--card);color:var(--text2);box-shadow:var(--shadow);white-space:nowrap}\n.pill .dot{width:7px;height:7px;border-radius:50%;background:var(--muted)}\n.pill.connected .dot{background:var(--ok)}\n.pill.connecting .dot,.pill.reconnecting .dot{background:var(--warn);animation:blink 1s infinite}\n.pill.error .dot,.pill.disconnected .dot,.pill.auth_invalid .dot{background:var(--bad)}\n.pill.demo{background:var(--lav);color:var(--lav-i)} .pill.demo .dot{background:var(--lav-i)}\n@keyframes blink{50%{opacity:.3}}\n\n/* sections */\n.sec{margin-top:24px}\n.sec-h{display:flex;align-items:baseline;justify-content:space-between;margin:0 2px 10px}\n.sec-h h2{font-size:16px;font-weight:650;margin:0;letter-spacing:-.005em}\n.sec-h .aux{font-size:13px;color:var(--muted);font-weight:500}\n.sec-h a,.sec-h button.link{font-size:13px;color:var(--accent);font-weight:600;text-decoration:none;padding:6px 0 6px 10px}\n.card{background:var(--card);border-radius:var(--r);box-shadow:var(--shadow)}\n.hint{font-size:13px;color:var(--muted);margin:10px 2px 0}\n\n/* hero */\n.hero{border-radius:24px;padding:20px 20px 18px;background:linear-gradient(160deg,var(--hero1),var(--hero2));color:var(--hero-ink);position:relative;overflow:hidden}\n.hero::after{content:\"\";position:absolute;right:-60px;top:-60px;width:200px;height:200px;border-radius:50%;background:radial-gradient(closest-side,rgba(255,255,255,.55),rgba(255,255,255,0));pointer-events:none}\nhtml[data-theme=\"dark\"] .hero::after{background:radial-gradient(closest-side,rgba(120,170,230,.12),rgba(0,0,0,0))}\n.hero-top{display:flex;justify-content:space-between;align-items:flex-start;gap:10px}\n.greet{font-size:22px;font-weight:650;letter-spacing:-.01em;margin:0}\n.when{font-size:13px;opacity:.75;margin-top:3px;font-weight:500}\n.hero-temp{display:flex;align-items:flex-end;gap:14px;margin-top:18px}\n.bigt{font-weight:250;font-size:76px;line-height:.9;letter-spacing:-.04em}\n.bigt small{font-size:34px;font-weight:300;letter-spacing:-.02em}\n.hero-meta{padding-bottom:6px;font-size:13px;line-height:1.5}\n.hero-meta b{font-weight:650;display:block;font-size:14px}\n.hero-meta span{opacity:.75}\n.status-row{display:flex;flex-wrap:wrap;gap:8px;margin-top:16px}\n.stat{display:inline-flex;align-items:center;gap:6px;font-size:12.5px;font-weight:600;background:rgba(255,255,255,.6);padding:7px 11px;border-radius:999px}\nhtml[data-theme=\"dark\"] .stat{background:rgba(255,255,255,.06)}\n.stat .i{font-size:14px}\n.stat.warn{color:var(--warn)} .stat.bad{color:var(--bad)}\n\n/* room temp cards */\n.rooms-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(148px,1fr));gap:var(--gap)}\n.room{border-radius:var(--r);padding:15px 15px 14px;text-align:left;display:flex;flex-direction:column;gap:2px;min-height:128px;position:relative;transition:transform .15s}\n.room:active{transform:scale(.97)}\n.room .ri{width:34px;height:34px;border-radius:11px;display:grid;place-items:center;font-size:18px;background:rgba(255,255,255,.7);margin-bottom:8px}\nhtml[data-theme=\"dark\"] .room .ri{background:rgba(255,255,255,.07)}\n.room .rn{font-size:14px;font-weight:600;color:var(--text);white-space:nowrap;overflow:hidden;text-overflow:ellipsis;padding-right:26px}\n.room .rt{font-size:30px;font-weight:300;letter-spacing:-.03em;line-height:1.1;color:var(--text)}\n.room .rt small{font-size:17px}\n.room .rh{font-size:12.5px;color:var(--text2);display:flex;align-items:center;gap:4px;font-weight:500}\n.room .trend{position:absolute;top:14px;right:14px;font-size:15px;opacity:.85}\n.room.na .rt{color:var(--muted)}\n.c-blue{background:var(--blue)} .c-blue .ri,.c-blue .trend{color:var(--blue-i)}\n.c-mint{background:var(--mint)} .c-mint .ri,.c-mint .trend{color:var(--mint-i)}\n.c-warm{background:var(--warm)} .c-warm .ri,.c-warm .trend{color:var(--warm-i)}\n.c-lav{background:var(--lav)} .c-lav .ri,.c-lav .trend{color:var(--lav-i)}\n.c-rose{background:var(--rose)} .c-rose .ri,.c-rose .trend{color:var(--rose-i)}\n.c-sand{background:var(--sand)} .c-sand .ri,.c-sand .trend{color:var(--sand-i)}\n\n/* device tiles */\n.tiles{display:grid;grid-template-columns:repeat(auto-fill,minmax(150px,1fr));gap:10px}\n.tile{background:var(--card);border-radius:18px;box-shadow:var(--shadow);padding:12px 12px 12px 14px;display:flex;flex-direction:column;gap:10px;min-height:104px;position:relative;text-align:left;transition:background-color .25s,transform .15s}\n.tile:active{transform:scale(.98)}\n.tile .top{display:flex;align-items:center;justify-content:space-between;gap:6px}\n.dico{width:38px;height:38px;border-radius:12px;display:grid;place-items:center;font-size:19px;background:var(--card2);color:var(--muted);transition:background-color .25s,color .25s;flex:none}\n.tile .tn{font-size:14px;font-weight:600;line-height:1.25;display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;overflow:hidden}\n.tile .ts{font-size:12px;color:var(--muted);font-weight:500;margin-top:2px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}\n.tile.on .dico{background:var(--accent-soft);color:var(--accent)}\n.tile.on .ts{color:var(--accent)}\n.tile.on.k-light .dico{background:var(--sand);color:var(--sand-i)} .tile.on.k-light .ts{color:var(--sand-i)}\n.tile.on.k-plug .dico,.tile.on.k-switch .dico{background:var(--mint);color:var(--mint-i)} .tile.on.k-plug .ts,.tile.on.k-switch .ts{color:var(--mint-i)}\n.tile.on.k-cover .dico{background:var(--lav);color:var(--lav-i)} .tile.on.k-cover .ts{color:var(--lav-i)}\n.tile.on.k-climate .dico{background:var(--blue);color:var(--blue-i)}\n.tile.na{opacity:.6}\n.tile .tbody{display:block;width:100%;text-align:left}\n\n/* toggle */\n.tg{position:relative;width:48px;height:28px;border-radius:999px;background:var(--tog-off);transition:background-color .22s;flex:none}\n.tg::before{content:\"\";position:absolute;inset:-9px -4px}  /* bigger hit area */\n.tg .kn{position:absolute;top:3px;left:3px;width:22px;height:22px;border-radius:50%;background:#fff;box-shadow:0 1px 3px rgba(0,0,0,.25);transition:transform .22s cubic-bezier(.3,.7,.4,1)}\n.tg[aria-checked=\"true\"]{background:var(--accent)}\n.tg[aria-checked=\"true\"] .kn{transform:translateX(20px)}\n.tg.pending .kn{transform:translateX(10px);animation:pulse .8s infinite alternate}\n.tg.pending{background:var(--accent-2)}\n.tg:disabled{opacity:.45}\n@keyframes pulse{to{box-shadow:0 0 0 5px rgba(47,134,214,.18)}}\n.runbtn{height:32px;padding:0 14px;border-radius:999px;background:var(--accent-soft);color:var(--accent);font-weight:650;font-size:13px}\n.runbtn.pending{opacity:.6}\n\n/* chips */\n.chips{display:flex;gap:8px;overflow-x:auto;scrollbar-width:none;margin:0 calc(-1*var(--pad));padding:2px var(--pad) 4px;scroll-snap-type:x proximity}\n.chips::-webkit-scrollbar{display:none}\n.chip{display:inline-flex;align-items:center;gap:7px;white-space:nowrap;height:40px;padding:0 14px 0 10px;border-radius:999px;background:var(--card);box-shadow:var(--shadow);font-size:13.5px;font-weight:600;scroll-snap-align:start;flex:none}\n.chip .i{font-size:16px;color:var(--accent)}\n.chip.on-light .i{color:var(--sand-i)}\n.chip.sel{background:var(--accent);color:var(--accent-ink)} .chip.sel .i{color:inherit}\n.chip .cnt{font-size:12px;opacity:.6;font-weight:600}\n.empty{padding:16px;border-radius:var(--r);background:var(--card);box-shadow:var(--shadow);color:var(--muted);font-size:14px;display:flex;align-items:center;gap:10px}\n.empty .i{font-size:20px}\n\n/* list rows */\n.list{display:flex;flex-direction:column;gap:10px}\n.row{display:flex;align-items:center;gap:12px;background:var(--card);border-radius:18px;box-shadow:var(--shadow);padding:12px 14px;min-height:64px;text-align:left;width:100%}\n.row .rb{flex:1;min-width:0;display:block;text-align:left}\n.row .rn{font-weight:600;font-size:15px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}\n.row .rs{font-size:12.5px;color:var(--muted);font-weight:500;margin-top:2px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}\n.row.on .dico{background:var(--accent-soft);color:var(--accent)}\n.row.on.k-light .dico{background:var(--sand);color:var(--sand-i)}\n.row.on.k-plug .dico,.row.on.k-switch .dico{background:var(--mint);color:var(--mint-i)}\n.row.on.k-cover .dico{background:var(--lav);color:var(--lav-i)}\n.row.na{opacity:.6}\n.star{width:40px;height:40px;display:grid;place-items:center;font-size:18px;color:var(--muted);flex:none;border-radius:50%}\n.star.fav{color:#e9a82b} .star.fav .i{fill:#e9a82b}\n.rvalue{font-size:16px;font-weight:600;white-space:nowrap}\n\n/* rooms list */\n.roomrow{display:flex;align-items:center;gap:14px;padding:14px 14px 14px 14px;border-radius:var(--r);text-align:left;width:100%;transition:transform .15s}\n.roomrow:active{transform:scale(.985)}\n.roomrow .ri{width:46px;height:46px;border-radius:15px;display:grid;place-items:center;font-size:22px;background:rgba(255,255,255,.7);flex:none}\nhtml[data-theme=\"dark\"] .roomrow .ri{background:rgba(255,255,255,.07)}\n.roomrow .rb{flex:1;min-width:0}\n.roomrow .rn{font-size:16px;font-weight:650}\n.roomrow .rs{font-size:12.5px;color:var(--text2);margin-top:3px;font-weight:500}\n.roomrow .rt{font-size:28px;font-weight:300;letter-spacing:-.03em;text-align:right}\n.roomrow .rt small{font-size:15px}\n.roomrow .rh{font-size:12px;color:var(--text2);text-align:right;font-weight:500}\n.roomrow .chev{color:var(--muted);font-size:18px}\n\n/* room detail */\n.rhero{border-radius:24px;padding:20px;display:flex;align-items:center;gap:16px;position:relative}\n.rhero .ri{width:54px;height:54px;border-radius:17px;font-size:26px;display:grid;place-items:center;background:rgba(255,255,255,.7);flex:none}\nhtml[data-theme=\"dark\"] .rhero .ri{background:rgba(255,255,255,.07)}\n.rhero .bigt{font-size:64px;color:var(--text)}\n.rhero .meta{font-size:13px;color:var(--text2);font-weight:500;line-height:1.6}\n.spark{margin-top:4px;width:100%;height:56px;display:block}\n.spark path.l{fill:none;stroke:currentColor;stroke-width:2;stroke-linecap:round;stroke-linejoin:round}\n.spark path.a{fill:currentColor;opacity:.12;stroke:none}\n.kv{display:flex;flex-direction:column}\n.kv .row{min-height:56px}\n\n/* devices page */\n.search{display:flex;align-items:center;gap:10px;height:48px;padding:0 14px;border-radius:16px;background:var(--card);box-shadow:var(--shadow);color:var(--muted)}\n.search input{flex:1;border:0;outline:0;background:transparent;font-size:16px;color:var(--text);min-width:0;height:100%}\n.search .i{font-size:18px}\n.seg{display:flex;background:var(--bg2);border-radius:14px;padding:4px;gap:4px}\n.seg button{flex:1;height:38px;border-radius:11px;font-size:13.5px;font-weight:600;color:var(--text2);display:flex;align-items:center;justify-content:center;gap:6px;transition:background-color .2s,color .2s}\n.seg button.sel{background:var(--card);color:var(--text);box-shadow:var(--shadow)}\n.grp-h{font-size:12.5px;font-weight:700;letter-spacing:.04em;text-transform:uppercase;color:var(--muted);margin:20px 4px 8px}\n.sticky{position:sticky;top:0;z-index:5;background:var(--bg);padding:calc(var(--safe-t) + 4px) var(--pad) 8px;margin:calc(-1*var(--safe-t) - 10px) calc(-1*var(--pad)) 0}\n.sticky .topbar{margin-bottom:8px}\n\n/* climate */\n.clim{padding:20px 18px 22px;text-align:center;position:relative}\n.clim-head{display:flex;align-items:center;justify-content:space-between;gap:10px;text-align:left}\n.clim-head .cn{font-weight:650;font-size:16px}\n.clim-head .cs{font-size:12.5px;color:var(--muted);font-weight:500;margin-top:2px}\n.pwr{width:52px;height:52px;border-radius:50%;display:grid;place-items:center;font-size:22px;background:var(--card2);color:var(--muted);box-shadow:var(--shadow);transition:background-color .25s,color .25s;flex:none}\n.pwr.on{background:var(--accent);color:var(--accent-ink)}\n.pwr.pending{animation:blink 1s infinite}\n.dial{position:relative;width:min(260px,70vw);aspect-ratio:1;margin:14px auto 4px}\n.dial>svg{width:100%;height:100%;display:block}\n.dial .ct .i{font-size:14px}\n.dial .trk{fill:none;stroke:var(--bg2);stroke-width:14;stroke-linecap:round}\n.dial .arc{fill:none;stroke:url(#dg);stroke-width:14;stroke-linecap:round;transition:stroke-dashoffset .35s ease}\n.dial .knob{fill:var(--card);stroke:var(--accent);stroke-width:4;transition:cx .35s,cy .35s}\n.dial .mid{position:absolute;inset:0;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:2px}\n.dial .lbl{font-size:12px;font-weight:600;color:var(--muted);text-transform:uppercase;letter-spacing:.08em}\n.dial .tt{font-size:68px;font-weight:250;letter-spacing:-.04em;line-height:1}\n.dial .tt small{font-size:28px;font-weight:300}\n.dial .ct{font-size:13px;color:var(--text2);font-weight:500;display:flex;align-items:center;gap:4px}\n.dial.off .arc{stroke:var(--muted);opacity:.35}\n.dial.off .tt{color:var(--muted)}\n.dial .sending{font-size:11px;color:var(--accent);font-weight:600;height:14px}\n.steppers{display:flex;align-items:center;justify-content:center;gap:28px;margin-top:4px}\n.step{width:64px;height:64px;border-radius:50%;background:var(--card2);box-shadow:var(--shadow);display:grid;place-items:center;font-size:26px;color:var(--accent);transition:transform .12s}\n.step:active{transform:scale(.92)}\n.step:disabled{opacity:.4}\n.range{width:100%;margin:18px 0 2px;-webkit-appearance:none;appearance:none;height:36px;background:transparent}\n.range::-webkit-slider-runnable-track{height:8px;border-radius:8px;background:linear-gradient(90deg,var(--accent) var(--p,50%),var(--bg2) var(--p,50%))}\n.range::-moz-range-track{height:8px;border-radius:8px;background:var(--bg2)}\n.range::-moz-range-progress{height:8px;border-radius:8px;background:var(--accent)}\n.range::-webkit-slider-thumb{-webkit-appearance:none;width:28px;height:28px;border-radius:50%;background:var(--card);border:3px solid var(--accent);margin-top:-10px;box-shadow:0 2px 6px rgba(0,0,0,.2)}\n.range::-moz-range-thumb{width:22px;height:22px;border-radius:50%;background:var(--card);border:3px solid var(--accent)}\n.range:disabled{opacity:.45}\n.rlab{display:flex;justify-content:space-between;font-size:12px;color:var(--muted);font-weight:500}\n.ctl-card{padding:16px}\n.ctl-card h3{font-size:14px;font-weight:650;margin:0 0 12px;display:flex;align-items:center;gap:8px;color:var(--text2)}\n.modes{display:grid;grid-template-columns:repeat(auto-fit,minmax(64px,1fr));gap:8px}\n.mode{display:flex;flex-direction:column;align-items:center;gap:6px;padding:12px 4px;border-radius:16px;background:var(--card2);font-size:12px;font-weight:600;color:var(--text2);transition:background-color .2s,color .2s;min-height:68px;justify-content:center}\n.mode .i{font-size:22px}\n.mode.sel{background:var(--accent);color:var(--accent-ink)}\n.mode.sel.m-heat{background:#ec8b45;color:#fff} .mode.sel.m-cool{background:#3d93dd;color:#fff} .mode.sel.m-dry{background:#3aa9a0;color:#fff} .mode.sel.m-fan_only{background:#6f9bd0;color:#fff} .mode.sel.m-auto,.mode.sel.m-heat_cool{background:#7c74d6;color:#fff}\n.mode.pending{opacity:.6}\n.fan{display:flex;gap:6px;flex-wrap:wrap}\n.fan button{white-space:nowrap;flex:1 1 auto;min-height:44px;border-radius:13px;background:var(--card2);font-size:13px;font-weight:600;color:var(--text2);padding:0 8px;transition:background-color .2s,color .2s}\n.fan button.sel{background:var(--accent-soft);color:var(--accent);box-shadow:inset 0 0 0 1.5px var(--accent)}\n.fan button.pending{opacity:.6}\n.bars{display:inline-flex;gap:2px;align-items:flex-end;height:14px;margin-right:4px;vertical-align:-2px}\n.bars i{width:3px;border-radius:2px;background:currentColor;opacity:.25}\n.bars i.f{opacity:1}\n.range2{display:grid;grid-template-columns:1fr 1fr;gap:10px;margin-top:14px}\n.mini-step{background:var(--card2);border-radius:16px;padding:10px;display:flex;align-items:center;justify-content:space-between}\n.mini-step button{width:40px;height:40px;border-radius:50%;background:var(--card);display:grid;place-items:center;font-size:18px;color:var(--accent);box-shadow:var(--shadow)}\n.mini-step .v{font-size:20px;font-weight:400}\n.mini-step .l{font-size:11px;color:var(--muted);font-weight:600;text-transform:uppercase}\n.climini{display:flex;align-items:center;gap:14px;padding:16px;text-align:left;width:100%}\n.climini .dico{width:48px;height:48px;border-radius:15px;font-size:22px}\n.climini.on .dico{background:var(--blue);color:var(--blue-i)}\n.climini .t{font-size:28px;font-weight:300;letter-spacing:-.03em;margin-left:auto}\n\n/* settings */\n.set{overflow:hidden}\n.set .it{display:flex;align-items:center;gap:12px;padding:14px 16px;min-height:58px;border-top:1px solid var(--line);width:100%;text-align:left}\n.set .it:first-child{border-top:0}\n.set .it .ic{width:34px;height:34px;border-radius:10px;display:grid;place-items:center;font-size:17px;background:var(--accent-soft);color:var(--accent);flex:none}\n.set .it .lb{flex:1;min-width:0}\n.set .it .lb b{font-weight:600;font-size:15px;display:block}\n.set .it .lb span{font-size:12.5px;color:var(--muted);font-weight:500;display:block;margin-top:2px}\n.set .it select,.set .it input[type=time]{background:var(--card2);border:1px solid var(--line);border-radius:10px;height:40px;padding:0 10px;font-size:16px;max-width:52%}\n.set .blk{padding:14px 16px;border-top:1px solid var(--line)}\n.set .blk:first-child{border-top:0}\n.field{display:flex;flex-direction:column;gap:6px;margin-bottom:12px}\n.field label{font-size:12.5px;font-weight:650;color:var(--text2)}\n.field .inp{display:flex;align-items:center;gap:6px;background:var(--card2);border:1px solid var(--line);border-radius:13px;height:48px;padding:0 6px 0 12px}\n.field .inp:focus-within{border-color:var(--accent)}\n.field input{flex:1;border:0;outline:0;background:transparent;font-size:16px;min-width:0;height:100%}\n.field .help{font-size:12px;color:var(--muted)}\n.btns{display:flex;gap:10px;flex-wrap:wrap}\n.btn{white-space:nowrap;height:46px;padding:0 18px;border-radius:14px;font-weight:650;font-size:14.5px;background:var(--card2);color:var(--text);display:inline-flex;align-items:center;justify-content:center;gap:8px;flex:1}\n.btn.pri{background:var(--accent);color:var(--accent-ink)}\n.btn.danger{color:var(--bad)}\n.btn:disabled{opacity:.5}\n.btn:active{transform:scale(.98)}\n.msg{display:flex;gap:10px;align-items:flex-start;padding:12px 14px;border-radius:14px;font-size:13.5px;font-weight:500;margin-bottom:12px;line-height:1.4}\n.msg .i{font-size:18px;margin-top:1px}\n.msg.bad{background:var(--rose);color:var(--rose-i)} .msg.warn{background:var(--warm);color:var(--warm-i)} .msg.ok{background:var(--mint);color:var(--mint-i)} .msg.info{background:var(--blue);color:var(--blue-i)}\n\n/* banner (connection) */\n.banner{display:flex;align-items:center;gap:10px;padding:12px 14px;border-radius:16px;margin-bottom:12px;font-size:13.5px;font-weight:600}\n.banner .i{font-size:18px}\n.banner .grow{flex:1}\n.banner button{font-weight:700;padding:8px 4px}\n.banner.reconnecting,.banner.connecting{background:var(--warm);color:var(--warm-i)}\n.banner.error,.banner.disconnected,.banner.auth_invalid{background:var(--rose);color:var(--rose-i)}\n.banner.demo{background:var(--lav);color:var(--lav-i)}\n.banner.install{background:var(--blue);color:var(--blue-i);align-items:flex-start}\n.banner.install .grow span{display:block;font-weight:500;margin-top:2px}\n.banner.install .i.share{display:inline-block;vertical-align:-3px}\n.spin{animation:spin 1s linear infinite}\n@keyframes spin{to{transform:rotate(360deg)}}\n\n/* welcome */\n.welcome{padding:26px 22px;text-align:center}\n.welcome .logo{width:76px;height:76px;border-radius:24px;margin:0 auto 14px;display:grid;place-items:center;font-size:36px;background:linear-gradient(160deg,var(--hero1),var(--accent-soft));color:var(--accent)}\n.welcome h2{margin:0 0 6px;font-size:22px}\n.welcome p{color:var(--text2);margin:0 0 18px;font-size:14px}\n\n/* bottom nav */\nnav.bn{position:fixed;left:0;right:0;bottom:0;z-index:20;display:flex;justify-content:center;pointer-events:none}\nnav.bn .in{pointer-events:auto;width:100%;max-width:560px;display:grid;grid-template-columns:repeat(6,1fr);background:var(--card);background:color-mix(in srgb,var(--card) 92%,transparent);backdrop-filter:blur(14px);-webkit-backdrop-filter:blur(14px);border-top:1px solid var(--line);padding:6px calc(6px + var(--safe-r)) calc(6px + var(--safe-b)) calc(6px + var(--safe-l));height:calc(var(--nav-h) + var(--safe-b))}\nnav.bn a{display:flex;flex-direction:column;align-items:center;justify-content:center;gap:3px;text-decoration:none;color:var(--muted);font-size:11px;font-weight:600;border-radius:14px;min-height:52px}\nnav.bn a .ic{width:52px;height:30px;border-radius:15px;display:grid;place-items:center;font-size:21px;transition:background-color .2s,color .2s}\nnav.bn a.sel{color:var(--accent)}\nnav.bn a.sel .ic{background:var(--accent-soft)}\n\n/* bottom sheet */\n.scrim{position:fixed;inset:0;background:var(--scrim);z-index:40;animation:fade .2s}\n@keyframes fade{from{opacity:0}}\n.sheet{position:fixed;left:0;right:0;bottom:0;z-index:41;margin:0 auto;max-width:560px;background:var(--card);border-radius:26px 26px 0 0;box-shadow:var(--shadow-lg);padding:8px calc(20px + var(--safe-r)) calc(22px + var(--safe-b)) calc(20px + var(--safe-l));max-height:88vh;max-height:88dvh;overflow-y:auto;animation:up .28s cubic-bezier(.2,.8,.3,1)}\n@keyframes up{from{transform:translateY(100%)}}\n.sheet .grab{width:40px;height:5px;border-radius:3px;background:var(--line);margin:4px auto 12px}\n.sheet .sh{display:flex;align-items:center;gap:12px;margin-bottom:16px}\n.sheet .sh .dico{width:48px;height:48px;border-radius:15px;font-size:22px}\n.sheet .sh .t{flex:1;min-width:0}\n.sheet .sh .t b{font-size:18px;font-weight:650;display:block;line-height:1.2}\n.sheet .sh .t span{font-size:13px;color:var(--muted);font-weight:500}\n.sheet.on .sh .dico{background:var(--accent-soft);color:var(--accent)}\n.sheet.on.k-light .sh .dico{background:var(--sand);color:var(--sand-i)}\n.bigtg{display:flex;align-items:center;justify-content:space-between;background:var(--card2);border-radius:18px;padding:14px 16px;margin-bottom:12px;width:100%}\n.bigtg b{font-size:16px;font-weight:650}\n.bigtg .tg{width:58px;height:34px}\n.bigtg .tg .kn{width:28px;height:28px}\n.bigtg .tg[aria-checked=\"true\"] .kn{transform:translateX(24px)}\n.bigtg .tg.pending .kn{transform:translateX(12px)}\n.ctl{background:var(--card2);border-radius:18px;padding:14px 16px;margin-bottom:12px}\n.ctl .hd{display:flex;justify-content:space-between;font-size:13.5px;font-weight:600;color:var(--text2)}\n.ctl .hd b{color:var(--text)}\n.ctl .range{margin:6px 0 0}\n.btnrow{display:flex;gap:10px}\n.btnrow .btn{background:var(--card)}\n.meta-sm{font-size:12px;color:var(--muted);text-align:center;margin-top:8px}\n\n/* toasts */\n#toasts{position:fixed;left:0;right:0;bottom:calc(var(--nav-h) + var(--safe-b) + 12px);z-index:60;display:flex;flex-direction:column;align-items:center;gap:8px;pointer-events:none;padding:0 16px}\n.toast{pointer-events:auto;max-width:520px;width:100%;display:flex;align-items:center;gap:10px;padding:12px 14px;border-radius:16px;background:#26303b;color:#fff;font-size:13.5px;font-weight:500;box-shadow:var(--shadow-lg);animation:up2 .25s ease}\nhtml[data-theme=\"dark\"] .toast{background:#e8edf3;color:#18202a}\n.toast .i{font-size:18px;flex:none}\n.toast.bad .i{color:#ff8f8a} html[data-theme=\"dark\"] .toast.bad .i{color:var(--bad)}\n.toast.ok .i{color:#7fdcb7} html[data-theme=\"dark\"] .toast.ok .i{color:#21905f}\n.toast.out{opacity:0;transform:translateY(8px);transition:.25s}\n@keyframes up2{from{opacity:0;transform:translateY(10px)}}\n\n/* skeleton */\n.skel{background:linear-gradient(90deg,var(--card) 0,var(--card2) 50%,var(--card) 100%);background-size:200% 100%;animation:sk 1.2s infinite;border-radius:var(--r);min-height:128px}\n@keyframes sk{to{background-position:-200% 0}}\n\n@media (max-width:360px){\n  :root{--pad:14px;--gap:10px}\n  .bigt{font-size:64px}\n  .dial .tt{font-size:58px}\n  .tiles{grid-template-columns:1fr 1fr}\n  .rooms-grid{grid-template-columns:1fr 1fr}\n  .room{min-height:118px;padding:13px}\n  .room .rt{font-size:26px}\n  .tile{padding:11px}\n}\n@media (min-width:480px){ .tiles{grid-template-columns:repeat(3,1fr)} }\n@media (prefers-reduced-motion:reduce){*{animation-duration:.01ms!important;transition-duration:.01ms!important}}\n.welcome .btn{flex:none;width:100%}\n\n/* disco */\n.disco{padding:26px 18px 20px;text-align:center}\n.discobtn{width:min(220px,62vw);aspect-ratio:1;border-radius:50%;padding:10px;position:relative;overflow:hidden;box-shadow:0 12px 40px rgba(120,80,220,.25);display:inline-grid;place-items:center;transition:transform .15s;isolation:isolate}\n.discobtn::before{content:\"\";position:absolute;inset:-20%;background:conic-gradient(#ff5f6d,#ffc371,#47e891,#4fc3f7,#a66cff,#ff5f6d);z-index:-1}\n.discobtn.on::before{animation:discospin 2.4s linear infinite}\n.discobtn:active{transform:scale(.96)}\n.discobtn:disabled{filter:grayscale(1);opacity:.5}\n.discoin{width:100%;height:100%;border-radius:50%;background:var(--card);display:flex;flex-direction:column;align-items:center;justify-content:center;gap:4px}\n.discoin .dt{font-size:46px;font-weight:300;color:var(--text);line-height:1}\n.discoin .dt .i{font-size:46px;color:#a66cff}\n.discoin .dl{font-size:13px;font-weight:650;color:var(--text2)}\n.dp{color:var(--text2);font-size:14px;margin:16px 4px 0;line-height:1.45}\n@keyframes discospin{to{transform:rotate(360deg)}}\n.chk{width:26px;height:26px;border-radius:8px;border:2px solid var(--line);display:grid;place-items:center;color:#fff;font-size:16px;flex:none}\n.chk.on{background:var(--accent);border-color:var(--accent)}\nnav.bn a{font-size:10.5px}\nnav.bn a .ic{width:44px}\n\n/* ===== 1.5 polish ===== */\n:root{--r:22px;--shadow:0 1px 2px rgba(20,40,70,.04),0 6px 20px rgba(20,40,70,.06)}\nhtml[data-theme=\"dark\"]{--shadow:0 1px 2px rgba(0,0,0,.25),0 6px 20px rgba(0,0,0,.22)}\nbody{background:radial-gradient(1200px 500px at 50% -200px,var(--hero1),transparent 70%) no-repeat,var(--bg)}\n.sec{margin-top:28px}\n.sec-h h2{font-size:17px;display:flex;align-items:center;gap:8px}\n.sec-h h2 .aux{font-size:13px;font-weight:600;background:var(--card2);padding:2px 9px;border-radius:999px}\n.sec-h button.link{font-size:13px;color:var(--accent);font-weight:650;padding:8px 0 8px 10px}\n.hero{border-radius:28px;padding:22px 22px 20px;box-shadow:0 10px 30px rgba(47,134,214,.10)}\nhtml[data-theme=\"dark\"] .hero{box-shadow:none}\n.hero::before{content:\"\";position:absolute;left:-40px;bottom:-70px;width:180px;height:180px;border-radius:50%;background:radial-gradient(closest-side,rgba(120,210,180,.28),transparent);pointer-events:none}\n.tile{border-radius:20px;min-height:110px}\n.dico{width:40px;height:40px;border-radius:13px}\n.room{border-radius:22px}\n.room .ri{border-radius:12px}\n.row{border-radius:20px}\nnav.bn .in{border-top:0;border-radius:24px 24px 0 0;box-shadow:0 -6px 24px rgba(20,40,70,.08)}\nhtml[data-theme=\"dark\"] nav.bn .in{box-shadow:0 -6px 24px rgba(0,0,0,.35)}\nnav.bn a.sel .ic{background:var(--accent-soft);transform:translateY(-1px)}\nnav.bn a .ic{transition:background-color .2s,transform .2s}\n.topbar h1{font-size:26px}\n/* climate carousel */\n.ccar{display:flex;gap:14px;overflow-x:auto;scroll-snap-type:x mandatory;scrollbar-width:none;margin:0 calc(-1*var(--pad));padding:2px var(--pad) 8px;scroll-padding:0 var(--pad);-webkit-overflow-scrolling:touch}\n.ccar::-webkit-scrollbar{display:none}\n.cslide{flex:0 0 100%;scroll-snap-align:center;scroll-snap-stop:always;min-width:0}\n.cslide>.sec:first-of-type{margin-top:14px}\n.cdots{display:flex;justify-content:center;gap:7px;margin-top:6px}\n.cdots i{width:7px;height:7px;border-radius:4px;background:var(--line);transition:width .25s,background-color .25s}\n.cdots i.on{width:22px;background:var(--accent)}\n.clim-head{flex-wrap:wrap}\n.mainstar{display:inline-flex;align-items:center;gap:5px;height:34px;padding:0 12px;border-radius:999px;background:var(--card2);color:var(--muted);font-size:12px;font-weight:650;margin-left:auto;margin-right:8px}\n.mainstar.on{color:#d99a1f;background:var(--sand)} .mainstar.on .i{fill:#e9a82b}\n.mainstar:disabled{opacity:1}\n/* light options */\n.swatches{display:grid;grid-template-columns:repeat(9,1fr);gap:8px;margin-top:10px}\n.sw{aspect-ratio:1;border-radius:50%;background:hsl(var(--h),85%,58%);box-shadow:inset 0 0 0 2px rgba(255,255,255,.6);transition:transform .15s}\n.sw.white{background:linear-gradient(135deg,#fff6e5,#ffffff,#e8f2ff);box-shadow:inset 0 0 0 1.5px var(--line)}\n.sw.sel{transform:scale(1.12);box-shadow:0 0 0 3px var(--card),0 0 0 5px var(--accent)}\n.sw:active{transform:scale(.92)}\n.moods{display:grid;grid-template-columns:repeat(4,1fr);gap:8px;margin-top:10px}\n.moods button{display:flex;flex-direction:column;align-items:center;gap:5px;padding:10px 4px;border-radius:14px;background:var(--card);font-size:12px;font-weight:650;color:var(--text2);min-height:62px;justify-content:center}\n.moods button .i{font-size:19px;color:var(--accent)}\n.moods button:active{transform:scale(.96)}\n@media (max-width:360px){.swatches{grid-template-columns:repeat(5,1fr)}}\n\n/* running inside Home Assistant: hide its interface, let the page scroll normally */\nhome-assistant{display:none!important}\nhtml,body{height:auto!important;min-height:100%!important;overflow:visible!important;overflow-y:auto!important;position:static!important}"; head.appendChild(st);
  document.body.insertAdjacentHTML('beforeend', '<div id="app"><main id="view" aria-live="polite"></main><div id="sheet"></div><div id="nav"></div></div><div id="toasts" aria-live="assertive"></div>');
  window.__comfortEmbed = {
    getHass: function () { var h = document.querySelector('home-assistant'); return h && h.hass; },
    logout: function () { var h = document.querySelector('home-assistant'); if (h) h.dispatchEvent(new CustomEvent('hass-logout', { bubbles: true, composed: true })); }
  };
/* Icons: Lucide (ISC licence), https://lucide.dev */
window.ICONS={"home":"<path d=\"M15 21v-8a1 1 0 0 0-1-1h-4a1 1 0 0 0-1 1v8\"></path><path d=\"M3 10a2 2 0 0 1 .709-1.528l7-5.999a2 2 0 0 1 2.582 0l7 5.999A2 2 0 0 1 21 10v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z\"></path>","climate":"<path d=\"M6 12H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2\"></path><path d=\"M6 8h12\"></path><path d=\"M18.3 17.7a2.5 2.5 0 0 1-3.16 3.83 2.53 2.53 0 0 1-1.14-2V12\"></path><path d=\"M6.6 15.6A2 2 0 1 0 10 17v-5\"></path>","rooms":"<rect width=\"7\" height=\"7\" x=\"3\" y=\"3\" rx=\"1\"></rect><rect width=\"7\" height=\"7\" x=\"14\" y=\"3\" rx=\"1\"></rect><rect width=\"7\" height=\"7\" x=\"14\" y=\"14\" rx=\"1\"></rect><rect width=\"7\" height=\"7\" x=\"3\" y=\"14\" rx=\"1\"></rect>","devices":"<rect width=\"20\" height=\"12\" x=\"2\" y=\"6\" rx=\"6\" ry=\"6\"></rect><circle cx=\"16\" cy=\"12\" r=\"2\"></circle>","settings":"<path d=\"M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z\"></path><circle cx=\"12\" cy=\"12\" r=\"3\"></circle>","sofa":"<path d=\"M20 9V6a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v3\"></path><path d=\"M2 16a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-5a2 2 0 0 0-4 0v1.5a.5.5 0 0 1-.5.5h-11a.5.5 0 0 1-.5-.5V11a2 2 0 0 0-4 0z\"></path><path d=\"M4 18v2\"></path><path d=\"M20 18v2\"></path><path d=\"M12 4v9\"></path>","bed":"<path d=\"M2 20v-8a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v8\"></path><path d=\"M4 10V6a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v4\"></path><path d=\"M12 4v6\"></path><path d=\"M2 18h20\"></path>","kitchen":"<path d=\"M2 12h20\"></path><path d=\"M20 12v8a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2v-8\"></path><path d=\"m4 8 16-4\"></path><path d=\"m8.86 6.78-.45-1.81a2 2 0 0 1 1.45-2.43l1.94-.48a2 2 0 0 1 2.43 1.46l.45 1.8\"></path>","attic":"<path d=\"M15 21v-8a1 1 0 0 0-1-1h-4a1 1 0 0 0-1 1v8\"></path><path d=\"M3 10a2 2 0 0 1 .709-1.528l7-5.999a2 2 0 0 1 2.582 0l7 5.999A2 2 0 0 1 21 10v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z\"></path>","bath":"<path d=\"M10 4 8 6\"></path><path d=\"M17 19v2\"></path><path d=\"M2 12h20\"></path><path d=\"M7 19v2\"></path><path d=\"M9 5 7.621 3.621A2.121 2.121 0 0 0 4 5v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-5\"></path>","office":"<path d=\"M16 20V4a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16\"></path><rect width=\"20\" height=\"14\" x=\"2\" y=\"6\" rx=\"2\"></rect>","baby":"<path d=\"M9 12h.01\"></path><path d=\"M15 12h.01\"></path><path d=\"M10 16c.5.3 1.2.5 2 .5s1.5-.2 2-.5\"></path><path d=\"M19 6.3a9 9 0 0 1 1.8 3.9 2 2 0 0 1 0 3.6 9 9 0 0 1-17.6 0 2 2 0 0 1 0-3.6A9 9 0 0 1 12 3c2 0 3.5 1.1 3.5 2.5s-.9 2.5-2 2.5c-.8 0-1.5-.4-1.5-1\"></path>","garage":"<path d=\"M19 17h2c.6 0 1-.4 1-1v-3c0-.9-.7-1.7-1.5-1.9C18.7 10.6 16 10 16 10s-1.3-1.4-2.2-2.3c-.5-.4-1.1-.7-1.8-.7H5c-.6 0-1.1.4-1.4.9l-1.4 2.9A3.7 3.7 0 0 0 2 12v4c0 .6.4 1 1 1h2\"></path><circle cx=\"7\" cy=\"17\" r=\"2\"></circle><path d=\"M9 17h6\"></path><circle cx=\"17\" cy=\"17\" r=\"2\"></circle>","garden":"<path d=\"M10 10v.2A3 3 0 0 1 8.9 16H5a3 3 0 0 1-1-5.8V10a3 3 0 0 1 6 0Z\"></path><path d=\"M7 16v6\"></path><path d=\"M13 19v3\"></path><path d=\"M12 19h8.3a1 1 0 0 0 .7-1.7L18 14h.3a1 1 0 0 0 .7-1.7L16 9h.2a1 1 0 0 0 .8-1.7L13 3l-1.4 1.5\"></path>","door":"<path d=\"M13 4h3a2 2 0 0 1 2 2v14\"></path><path d=\"M2 20h3\"></path><path d=\"M13 20h9\"></path><path d=\"M10 12v.01\"></path><path d=\"M13 4.562v16.157a1 1 0 0 1-1.242.97L5 20V5.562a2 2 0 0 1 1.515-1.94l4-1A2 2 0 0 1 13 4.561Z\"></path>","stairs":"<path d=\"m21 16-4 4-4-4\"></path><path d=\"M17 20V4\"></path><path d=\"m3 8 4-4 4 4\"></path><path d=\"M7 4v16\"></path>","dining":"<path d=\"M3 2v7c0 1.1.9 2 2 2h4a2 2 0 0 0 2-2V2\"></path><path d=\"M7 2v20\"></path><path d=\"M21 15V2a5 5 0 0 0-5 5v6c0 1.1.9 2 2 2h3Zm0 0v7\"></path>","laundry":"<path d=\"M20.38 3.46 16 2a4 4 0 0 1-8 0L3.62 3.46a2 2 0 0 0-1.34 2.23l.58 3.47a1 1 0 0 0 .99.84H6v10c0 1.1.9 2 2 2h8a2 2 0 0 0 2-2V10h2.15a1 1 0 0 0 .99-.84l.58-3.47a2 2 0 0 0-1.34-2.23z\"></path>","game":"<line x1=\"6\" x2=\"10\" y1=\"11\" y2=\"11\"></line><line x1=\"8\" x2=\"8\" y1=\"9\" y2=\"13\"></line><line x1=\"15\" x2=\"15.01\" y1=\"12\" y2=\"12\"></line><line x1=\"18\" x2=\"18.01\" y1=\"10\" y2=\"10\"></line><path d=\"M17.32 5H6.68a4 4 0 0 0-3.978 3.59c-.006.052-.01.101-.017.152C2.604 9.416 2 14.456 2 16a3 3 0 0 0 3 3c1 0 1.5-.5 2-1l1.414-1.414A2 2 0 0 1 9.828 16h4.344a2 2 0 0 1 1.414.586L17 18c.5.5 1 1 2 1a3 3 0 0 0 3-3c0-1.545-.604-6.584-.685-7.258-.007-.05-.011-.1-.017-.151A4 4 0 0 0 17.32 5z\"></path>","gym":"<path d=\"M14.4 14.4 9.6 9.6\"></path><path d=\"M18.657 21.485a2 2 0 1 1-2.829-2.828l-1.767 1.768a2 2 0 1 1-2.829-2.829l6.364-6.364a2 2 0 1 1 2.829 2.829l-1.768 1.767a2 2 0 1 1 2.828 2.829z\"></path><path d=\"m21.5 21.5-1.4-1.4\"></path><path d=\"M3.9 3.9 2.5 2.5\"></path><path d=\"M6.404 12.768a2 2 0 1 1-2.829-2.829l1.768-1.767a2 2 0 1 1-2.828-2.829l2.828-2.828a2 2 0 1 1 2.829 2.828l1.767-1.768a2 2 0 1 1 2.829 2.829z\"></path>","room":"<path d=\"M5 3a2 2 0 0 0-2 2\"></path><path d=\"M19 3a2 2 0 0 1 2 2\"></path><path d=\"M21 19a2 2 0 0 1-2 2\"></path><path d=\"M5 21a2 2 0 0 1-2-2\"></path><path d=\"M9 3h1\"></path><path d=\"M9 21h1\"></path><path d=\"M14 3h1\"></path><path d=\"M14 21h1\"></path><path d=\"M3 9v1\"></path><path d=\"M21 9v1\"></path><path d=\"M3 14v1\"></path><path d=\"M21 14v1\"></path>","light":"<path d=\"M15 14c.2-1 .7-1.7 1.5-2.5 1-.9 1.5-2.2 1.5-3.5A6 6 0 0 0 6 8c0 1 .2 2.2 1.5 3.5.7.7 1.3 1.5 1.5 2.5\"></path><path d=\"M9 18h6\"></path><path d=\"M10 22h4\"></path>","plug":"<path d=\"M12 22v-5\"></path><path d=\"M9 8V2\"></path><path d=\"M15 8V2\"></path><path d=\"M18 8v5a4 4 0 0 1-4 4h-4a4 4 0 0 1-4-4V8Z\"></path>","tv":"<rect width=\"20\" height=\"15\" x=\"2\" y=\"7\" rx=\"2\" ry=\"2\"></rect><polyline points=\"17 2 12 7 7 2\"></polyline>","fan":"<path d=\"M10.827 16.379a6.082 6.082 0 0 1-8.618-7.002l5.412 1.45a6.082 6.082 0 0 1 7.002-8.618l-1.45 5.412a6.082 6.082 0 0 1 8.618 7.002l-5.412-1.45a6.082 6.082 0 0 1-7.002 8.618l1.45-5.412Z\"></path><path d=\"M12 12v.01\"></path>","blinds":"<path d=\"M3 3h18\"></path><path d=\"M20 7H8\"></path><path d=\"M20 11H8\"></path><path d=\"M10 19h10\"></path><path d=\"M8 15h12\"></path><path d=\"M4 3v14\"></path><circle cx=\"4\" cy=\"19\" r=\"2\"></circle>","switch":"<rect width=\"20\" height=\"12\" x=\"2\" y=\"6\" rx=\"6\" ry=\"6\"></rect><circle cx=\"8\" cy=\"12\" r=\"2\"></circle>","power":"<path d=\"M12 2v10\"></path><path d=\"M18.4 6.6a9 9 0 1 1-12.77.04\"></path>","speaker":"<rect width=\"16\" height=\"20\" x=\"4\" y=\"2\" rx=\"2\"></rect><path d=\"M12 6h.01\"></path><circle cx=\"12\" cy=\"14\" r=\"4\"></circle><path d=\"M12 14h.01\"></path>","lock":"<rect width=\"18\" height=\"11\" x=\"3\" y=\"11\" rx=\"2\" ry=\"2\"></rect><path d=\"M7 11V7a5 5 0 0 1 10 0v4\"></path>","heater":"<path d=\"M11 8c2-3-2-3 0-6\"></path><path d=\"M15.5 8c2-3-2-3 0-6\"></path><path d=\"M6 10h.01\"></path><path d=\"M6 14h.01\"></path><path d=\"M10 16v-4\"></path><path d=\"M14 16v-4\"></path><path d=\"M18 16v-4\"></path><path d=\"M20 6a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h3\"></path><path d=\"M5 20v2\"></path><path d=\"M19 20v2\"></path>","thermo":"<path d=\"M14 4v10.54a4 4 0 1 1-4 0V4a2 2 0 0 1 4 0Z\"></path>","drop":"<path d=\"M7 16.3c2.2 0 4-1.83 4-4.05 0-1.16-.57-2.26-1.71-3.19S7.29 6.75 7 5.3c-.29 1.45-1.14 2.84-2.29 3.76S3 11.1 3 12.25c0 2.22 1.8 4.05 4 4.05z\"></path><path d=\"M12.56 6.6A10.97 10.97 0 0 0 14 3.02c.5 2.5 2 4.9 4 6.5s3 3.5 3 5.5a6.98 6.98 0 0 1-11.91 4.97\"></path>","droplet":"<path d=\"M12 22a7 7 0 0 0 7-7c0-2-1-3.9-3-5.5s-3.5-4-4-6.5c-.5 2.5-2 4.9-4 6.5C6 11.1 5 13 5 15a7 7 0 0 0 7 7z\"></path>","snow":"<line x1=\"2\" x2=\"22\" y1=\"12\" y2=\"12\"></line><line x1=\"12\" x2=\"12\" y1=\"2\" y2=\"22\"></line><path d=\"m20 16-4-4 4-4\"></path><path d=\"m4 8 4 4-4 4\"></path><path d=\"m16 4-4 4-4-4\"></path><path d=\"m8 20 4-4 4 4\"></path>","flame":"<path d=\"M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z\"></path>","wind":"<path d=\"M12.8 19.6A2 2 0 1 0 14 16H2\"></path><path d=\"M17.5 8a2.5 2.5 0 1 1 2 4H2\"></path><path d=\"M9.8 4.4A2 2 0 1 1 11 8H2\"></path>","sun":"<circle cx=\"12\" cy=\"12\" r=\"4\"></circle><path d=\"M12 2v2\"></path><path d=\"M12 20v2\"></path><path d=\"m4.93 4.93 1.41 1.41\"></path><path d=\"m17.66 17.66 1.41 1.41\"></path><path d=\"M2 12h2\"></path><path d=\"M20 12h2\"></path><path d=\"m6.34 17.66-1.41 1.41\"></path><path d=\"m19.07 4.93-1.41 1.41\"></path>","moon":"<path d=\"M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z\"></path>","sunmoon":"<path d=\"M12 8a2.83 2.83 0 0 0 4 4 4 4 0 1 1-4-4\"></path><path d=\"M12 2v2\"></path><path d=\"M12 20v2\"></path><path d=\"m4.9 4.9 1.4 1.4\"></path><path d=\"m17.7 17.7 1.4 1.4\"></path><path d=\"M2 12h2\"></path><path d=\"M20 12h2\"></path><path d=\"m6.3 17.7-1.4 1.4\"></path><path d=\"m19.1 4.9-1.4 1.4\"></path>","auto":"<path d=\"M9.937 15.5A2 2 0 0 0 8.5 14.063l-6.135-1.582a.5.5 0 0 1 0-.962L8.5 9.936A2 2 0 0 0 9.937 8.5l1.582-6.135a.5.5 0 0 1 .963 0L14.063 8.5A2 2 0 0 0 15.5 9.937l6.135 1.581a.5.5 0 0 1 0 .964L15.5 14.063a2 2 0 0 0-1.437 1.437l-1.582 6.135a.5.5 0 0 1-.963 0z\"></path><path d=\"M20 3v4\"></path><path d=\"M22 5h-4\"></path><path d=\"M4 17v2\"></path><path d=\"M5 18H3\"></path>","heatcool":"<path d=\"M12 9a4 4 0 0 0-2 7.5\"></path><path d=\"M12 3v2\"></path><path d=\"m6.6 18.4-1.4 1.4\"></path><path d=\"M20 4v10.54a4 4 0 1 1-4 0V4a2 2 0 0 1 4 0Z\"></path><path d=\"M4 13H2\"></path><path d=\"M6.34 7.34 4.93 5.93\"></path>","repeat":"<path d=\"M12 2v20\"></path><path d=\"m8 18 4 4 4-4\"></path><path d=\"m8 6 4-4 4 4\"></path>","plus":"<path d=\"M5 12h14\"></path><path d=\"M12 5v14\"></path>","minus":"<path d=\"M5 12h14\"></path>","back":"<path d=\"m15 18-6-6 6-6\"></path>","chev":"<path d=\"m9 18 6-6-6-6\"></path>","search":"<circle cx=\"11\" cy=\"11\" r=\"8\"></circle><path d=\"m21 21-4.3-4.3\"></path>","star":"<path d=\"M11.525 2.295a.53.53 0 0 1 .95 0l2.31 4.679a2.123 2.123 0 0 0 1.595 1.16l5.166.756a.53.53 0 0 1 .294.904l-3.736 3.638a2.123 2.123 0 0 0-.611 1.878l.882 5.14a.53.53 0 0 1-.771.56l-4.618-2.428a2.122 2.122 0 0 0-1.973 0L6.396 21.01a.53.53 0 0 1-.77-.56l.881-5.139a2.122 2.122 0 0 0-.611-1.879L2.16 9.795a.53.53 0 0 1 .294-.906l5.165-.755a2.122 2.122 0 0 0 1.597-1.16z\"></path>","wifi":"<path d=\"M12 20h.01\"></path><path d=\"M2 8.82a15 15 0 0 1 20 0\"></path><path d=\"M5 12.859a10 10 0 0 1 14 0\"></path><path d=\"M8.5 16.429a5 5 0 0 1 7 0\"></path>","wifioff":"<path d=\"M12 20h.01\"></path><path d=\"M8.5 16.429a5 5 0 0 1 7 0\"></path><path d=\"M5 12.859a10 10 0 0 1 5.17-2.69\"></path><path d=\"M19 12.859a10 10 0 0 0-2.007-1.523\"></path><path d=\"M2 8.82a15 15 0 0 1 4.177-2.643\"></path><path d=\"M22 8.82a15 15 0 0 0-11.288-3.764\"></path><path d=\"m2 2 20 20\"></path>","up":"<polyline points=\"22 7 13.5 15.5 8.5 10.5 2 17\"></polyline><polyline points=\"16 7 22 7 22 13\"></polyline>","down":"<polyline points=\"22 17 13.5 8.5 8.5 13.5 2 7\"></polyline><polyline points=\"16 17 22 17 22 11\"></polyline>","flat":"<path d=\"M18 8L22 12L18 16\"></path><path d=\"M2 12H22\"></path>","ok":"<circle cx=\"12\" cy=\"12\" r=\"10\"></circle><path d=\"m9 12 2 2 4-4\"></path>","alert":"<circle cx=\"12\" cy=\"12\" r=\"10\"></circle><line x1=\"12\" x2=\"12\" y1=\"8\" y2=\"12\"></line><line x1=\"12\" x2=\"12.01\" y1=\"16\" y2=\"16\"></line>","refresh":"<path d=\"M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8\"></path><path d=\"M21 3v5h-5\"></path><path d=\"M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16\"></path><path d=\"M8 16H3v5\"></path>","x":"<path d=\"M18 6 6 18\"></path><path d=\"m6 6 12 12\"></path>","info":"<circle cx=\"12\" cy=\"12\" r=\"10\"></circle><path d=\"M12 16v-4\"></path><path d=\"M12 8h.01\"></path>","eye":"<path d=\"M2.062 12.348a1 1 0 0 1 0-.696 10.75 10.75 0 0 1 19.876 0 1 1 0 0 1 0 .696 10.75 10.75 0 0 1-19.876 0\"></path><circle cx=\"12\" cy=\"12\" r=\"3\"></circle>","eyeoff":"<path d=\"M10.733 5.076a10.744 10.744 0 0 1 11.205 6.575 1 1 0 0 1 0 .696 10.747 10.747 0 0 1-1.444 2.49\"></path><path d=\"M14.084 14.158a3 3 0 0 1-4.242-4.242\"></path><path d=\"M17.479 17.499a10.75 10.75 0 0 1-15.417-5.151 1 1 0 0 1 0-.696 10.75 10.75 0 0 1 4.446-5.143\"></path><path d=\"m2 2 20 20\"></path>","logout":"<path d=\"M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4\"></path><polyline points=\"16 17 21 12 16 7\"></polyline><line x1=\"21\" x2=\"9\" y1=\"12\" y2=\"12\"></line>","play":"<polygon points=\"6 3 20 12 6 21 6 3\"></polygon>","pause":"<rect x=\"14\" y=\"4\" width=\"4\" height=\"16\" rx=\"1\"></rect><rect x=\"6\" y=\"4\" width=\"4\" height=\"16\" rx=\"1\"></rect>","stop":"<rect width=\"18\" height=\"18\" x=\"3\" y=\"3\" rx=\"2\"></rect>","open":"<path d=\"m17 11-5-5-5 5\"></path><path d=\"m17 18-5-5-5 5\"></path>","close":"<path d=\"m7 6 5 5 5-5\"></path><path d=\"m7 13 5 5 5-5\"></path>","contrast":"<circle cx=\"12\" cy=\"12\" r=\"10\"></circle><path d=\"M12 18a6 6 0 0 0 0-12v12z\"></path>","server":"<rect width=\"20\" height=\"8\" x=\"2\" y=\"2\" rx=\"2\" ry=\"2\"></rect><rect width=\"20\" height=\"8\" x=\"2\" y=\"14\" rx=\"2\" ry=\"2\"></rect><line x1=\"6\" x2=\"6.01\" y1=\"6\" y2=\"6\"></line><line x1=\"6\" x2=\"6.01\" y1=\"18\" y2=\"18\"></line>","key":"<path d=\"M2.586 17.414A2 2 0 0 0 2 18.828V21a1 1 0 0 0 1 1h3a1 1 0 0 0 1-1v-1a1 1 0 0 1 1-1h1a1 1 0 0 0 1-1v-1a1 1 0 0 1 1-1h.172a2 2 0 0 0 1.414-.586l.814-.814a6.5 6.5 0 1 0-4-4z\"></path><circle cx=\"16.5\" cy=\"7.5\" r=\".5\" fill=\"currentColor\"></circle>","link":"<path d=\"M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71\"></path><path d=\"M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71\"></path>","smartphone":"<rect width=\"14\" height=\"20\" x=\"5\" y=\"2\" rx=\"2\" ry=\"2\"></rect><path d=\"M12 18h.01\"></path>","motion":"<path d=\"M22 12h-2.48a2 2 0 0 0-1.93 1.46l-2.35 8.36a.25.25 0 0 1-.48 0L9.24 2.18a.25.25 0 0 0-.48 0l-2.35 8.36A2 2 0 0 1 4.49 12H2\"></path>","window":"<rect x=\"2\" y=\"4\" width=\"20\" height=\"16\" rx=\"2\"></rect><path d=\"M10 4v4\"></path><path d=\"M2 8h20\"></path><path d=\"M6 4v4\"></path>","battery":"<rect width=\"16\" height=\"10\" x=\"2\" y=\"7\" rx=\"2\" ry=\"2\"></rect><line x1=\"22\" x2=\"22\" y1=\"11\" y2=\"13\"></line><line x1=\"6\" x2=\"6\" y1=\"11\" y2=\"13\"></line><line x1=\"10\" x2=\"10\" y1=\"11\" y2=\"13\"></line>","bolt":"<path d=\"M4 14a1 1 0 0 1-.78-1.63l9.9-10.2a.5.5 0 0 1 .86.46l-1.92 6.02A1 1 0 0 0 13 10h7a1 1 0 0 1 .78 1.63l-9.9 10.2a.5.5 0 0 1-.86-.46l1.92-6.02A1 1 0 0 0 11 14z\"></path>","leaf":"<path d=\"M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10Z\"></path><path d=\"M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12\"></path>","shield":"<path d=\"M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z\"></path><path d=\"m9 12 2 2 4-4\"></path>","list":"<path d=\"M3 12h.01\"></path><path d=\"M3 18h.01\"></path><path d=\"M3 6h.01\"></path><path d=\"M8 12h13\"></path><path d=\"M8 18h13\"></path><path d=\"M8 6h13\"></path>","clock":"<circle cx=\"12\" cy=\"12\" r=\"10\"></circle><polyline points=\"12 6 12 12 16 14\"></polyline>"};

/* Comfort Home — a calm smart-home app for Home Assistant. */
(function () {
  'use strict';
  const VERSION = '1.5.0';
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
    favorites: [], roomMain: {}, devGroup: 'type', climate: null, lastMode: {}, discoSwitches: [], lang: 'en' };
  const settings = Object.assign({}, DEFAULTS, store.get('ch.settings', {}));
  const saveSettings = () => store.set('ch.settings', settings);
  /* ---------------- languages ---------------- */
  const I18N = {
    nl: {
      'Home': 'Thuis', 'Climate': 'Klimaat', 'Rooms': 'Kamers', 'Devices': 'Apparaten', 'Disco': 'Disco', 'Settings': 'Instellingen',
      'Good morning': 'Goedemorgen', 'Good afternoon': 'Goedemiddag', 'Good evening': 'Goedenavond', 'Good night': 'Goedenacht',
      'Preview': 'Voorbeeld', 'Not set up': 'Niet ingesteld', 'Connecting': 'Verbinden', 'Reconnecting': 'Opnieuw verbinden', 'Connected': 'Verbonden', 'Disconnected': 'Verbroken', 'Error': 'Fout', 'Token rejected': 'Token geweigerd',
      'All rooms': 'Alle kamers', 'Favorites': 'Favorieten', 'Quick switches': 'Snelle schakelaars', 'All devices': 'Alle apparaten', 'On now': 'Nu aan', 'Controls': 'Bediening', 'Everything is off.': 'Alles staat uit.',
      'Status': 'Status', 'Sensors': 'Sensoren', 'Mode': 'Stand', 'Fan speed': 'Ventilator', 'Air direction': 'Luchtrichting', 'Preset': 'Voorinstelling', 'Target': 'Doel', 'Current': 'Nu', 'Sending…': 'Versturen…',
      'Appearance': 'Weergave', 'Home screen': 'Startscherm', 'App': 'App', 'Language': 'Taal', 'Automatic': 'Automatisch', 'Day': 'Dag', 'Night': 'Nacht', 'Switch automatically by': 'Automatisch wisselen op', 'Time of day': 'Tijd van de dag', 'Phone setting': 'Telefoon', 'Day starts': 'Dag begint', 'Night starts': 'Nacht begint',
      'House temperature': 'Huistemperatuur', 'Show humidity on room cards': 'Luchtvochtigheid op kamerkaarten', 'Reload from Home Assistant': 'Opnieuw laden uit Home Assistant', 'Refresh rooms and devices': 'Kamers en apparaten verversen', 'Privacy': 'Privacy', 'Log out': 'Uitloggen', 'Open Home Assistant': 'Home Assistant openen', 'Back to the normal Home Assistant screens': 'Terug naar de normale schermen van Home Assistant',
      'Start disco': 'Start disco', 'Tap to stop': 'Tik om te stoppen', 'Restoring…': 'Terugzetten…', 'All on!': 'Alles aan!', 'Also switch these on and off': 'Deze ook aan en uit zetten',
      'On': 'Aan', 'Off': 'Uit', 'Unavailable': 'Niet beschikbaar', 'Unknown': 'Onbekend', 'Open': 'Open', 'Closed': 'Dicht', 'Opening…': 'Gaat open…', 'Closing…': 'Gaat dicht…', 'Playing': 'Speelt', 'Paused': 'Gepauzeerd', 'Idle': 'Rust', 'Standby': 'Stand-by', 'Locked': 'Op slot', 'Unlocked': 'Van het slot', 'Clear': 'Vrij', 'Motion': 'Beweging', 'Occupied': 'Bezet', 'Away': 'Weg', 'Wet': 'Nat', 'Dry': 'Drogen', 'Scene': 'Scène', 'Running…': 'Bezig…', 'Low': 'Laag', 'Normal': 'Normaal',
      'Auto': 'Auto', 'Heat/Cool': 'Warm/Koel', 'Cool': 'Koelen', 'Heat': 'Verwarmen', 'Fan': 'Ventilator', 'Cooling': 'Koelt', 'Heating': 'Verwarmt', 'Drying': 'Droogt', 'Fan running': 'Ventilator draait',
      'Lights': 'Lampen', 'Plugs': 'Stekkers', 'Switches': 'Schakelaars', 'Media': 'Media', 'Fans': 'Ventilatoren', 'Blinds': 'Zonwering', 'Locks': 'Sloten', 'Scenes': 'Scènes', 'All': 'Alles', 'By type': 'Per soort', 'By room': 'Per kamer', 'Search devices': 'Apparaten zoeken',
      'Brightness': 'Helderheid', 'Warmth': 'Warmte', 'Colour': 'Kleur', 'Moods': 'Sfeer', 'Relax': 'Ontspannen', 'Read': 'Lezen', 'Focus': 'Focus', 'Night light': 'Nachtlampje', 'Effects': 'Effecten', 'Speed': 'Snelheid', 'Position': 'Positie', 'Volume': 'Volume', 'Now playing': 'Nu speelt', 'Oscillate': 'Zwenken',
      'All lights off': 'Alle lampen uit', 'Lights on': 'Lampen aan', 'Lights off': 'Lampen uit', 'Main': 'Hoofd', 'Set as main': 'Maak hoofd', 'Swipe for your other air conditioners': 'Veeg voor je andere airco’s',
      '{n} on': '{n} aan', 'All off': 'Alles uit', '{n} open': '{n} open', '{n} unavailable': '{n} niet beschikbaar', 'Outside {t}': 'Buiten {t}', 'Average of {n} rooms': 'Gemiddelde van {n} kamers', '{n} devices': '{n} apparaten', '1 device': '1 apparaat', 'Room {t}': 'Kamer {t}', 'to {t}': 'naar {t}', 'Indoor': 'Binnen',
      'Turn on': 'Aanzetten', 'Turn off': 'Uitzetten', 'Run': 'Start'
    },
    mc: {
      'Home': 'Base', 'Climate': 'Biome', 'Rooms': 'Chunks', 'Devices': 'Redstone', 'Disco': 'Party', 'Settings': 'Crafting',
      'Good morning': 'Rise and mine!', 'Good afternoon': 'Happy mining!', 'Good evening': 'Mind the creepers', 'Good night': 'Time to sleep in your bed',
      'Preview': 'Practice world', 'Not set up': 'No world loaded', 'Connecting': 'Loading world', 'Reconnecting': 'Respawning', 'Connected': 'World loaded', 'Disconnected': 'Left the world', 'Error': 'Something exploded', 'Token rejected': 'Wrong key',
      'All rooms': 'All chunks', 'Favorites': 'Favourite blocks', 'Quick switches': 'Quick levers', 'All devices': 'All redstone', 'On now': 'Powered now', 'Controls': 'Levers', 'Everything is off.': 'All redstone is quiet.',
      'Status': 'Status', 'Sensors': 'Sensors', 'Mode': 'Biome mode', 'Fan speed': 'Wind power', 'Air direction': 'Wind direction', 'Preset': 'Preset', 'Target': 'Target', 'Current': 'Now', 'Sending…': 'Placing block…',
      'Appearance': 'Texture pack', 'Home screen': 'Base screen', 'Language': 'Language', 'Automatic': 'Day cycle', 'Day': 'Day', 'Night': 'Night', 'Switch automatically by': 'Follow the', 'Time of day': 'Sun', 'Phone setting': 'Phone', 'Day starts': 'Sunrise', 'Night starts': 'Sunset',
      'House temperature': 'Base temperature', 'Show humidity on room cards': 'Show water level on chunks', 'Reload from Home Assistant': 'Reload the world', 'Refresh rooms and devices': 'Refresh chunks and redstone', 'Log out': 'Leave world', 'Open Home Assistant': 'Open Home Assistant', 'Back to the normal Home Assistant screens': 'Back to the normal Home Assistant screens',
      'Start disco': 'Start the party', 'Tap to stop': 'Tap to stop', 'Restoring…': 'Rebuilding…', 'All on!': 'All torches lit!', 'Also switch these on and off': 'Also flip these levers',
      'On': 'Powered', 'Off': 'Unpowered', 'Unavailable': 'Missing block', 'Unknown': 'Mystery block', 'Closed': 'Shut', 'Playing': 'Jukebox playing', 'Idle': 'AFK', 'Standby': 'Sleeping', 'Locked': 'Iron door shut', 'Unlocked': 'Iron door open', 'Motion': 'Mob nearby', 'Clear': 'No mobs', 'Away': 'Exploring', 'Running…': 'Running…',
      'Heat/Cool': 'Nether & snow', 'Cool': 'Snow biome', 'Heat': 'Nether', 'Dry': 'Desert', 'Fan': 'Wind', 'Cooling': 'Freezing', 'Heating': 'Smelting', 'Drying': 'Drying out', 'Fan running': 'Wind blowing',
      'Lights': 'Torches', 'Plugs': 'Power blocks', 'Switches': 'Levers', 'Media': 'Jukebox', 'Fans': 'Wind blocks', 'Blinds': 'Trapdoors', 'Locks': 'Iron doors', 'Scenes': 'Scenes', 'By type': 'By block type', 'By room': 'By chunk', 'Search devices': 'Search redstone',
      'Brightness': 'Light level', 'Warmth': 'Glow', 'Colour': 'Dye', 'Moods': 'Moods', 'Relax': 'Chill', 'Read': 'Read', 'Focus': 'Build mode', 'Night light': 'Night torch', 'Effects': 'Effects', 'Speed': 'Speed', 'Oscillate': 'Wobble',
      'All lights off': 'All torches out', 'Lights on': 'Torches on', 'Lights off': 'Torches out', 'Main': 'Main', 'Set as main': 'Make main', 'Swipe for your other air conditioners': 'Swipe for your other weather machines',
      '{n} on': '{n} powered', 'All off': 'All unpowered', '{n} unavailable': '{n} missing', 'Outside {t}': 'Overworld {t}', 'Average of {n} rooms': 'Average of {n} chunks', '{n} devices': '{n} redstone', '1 device': '1 redstone', 'Room {t}': 'Chunk {t}', 'to {t}': 'to {t}', 'Indoor': 'Inside the base',
      'Turn on': 'Power on', 'Turn off': 'Power off', 'Run': 'Activate'
    }
  };
  const t = (s, vars) => { let r = (I18N[settings.lang] && I18N[settings.lang][s]) || s; if (vars) Object.keys(vars).forEach((k) => { r = r.split('{' + k + '}').join(vars[k]); }); return r; };
  const loc = () => (settings.lang === 'nl' ? 'nl-NL' : undefined);

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
    return { v: vals.reduce((a, b) => a + b, 0) / vals.length, label: vals.length === 1 ? t('Indoor') : t('Average of {n} rooms', { n: vals.length }) };
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
  const HVAC = new Proxy({ off: 'Off', auto: 'Auto', heat_cool: 'Heat/Cool', cool: 'Cool', heat: 'Heat', dry: 'Dry', fan_only: 'Fan' }, { get: (o, k) => (o[k] != null ? t(o[k]) : undefined) });
  const ACTION = new Proxy({ cooling: 'Cooling', heating: 'Heating', drying: 'Drying', idle: 'Idle', fan: 'Fan running', off: 'Off', preheating: 'Preheating', defrosting: 'Defrosting' }, { get: (o, k) => (o[k] != null ? t(o[k]) : undefined) });
  function stateText(eid, s) { return stateTextRaw(eid, s).split(' · ').map((x) => t(x)).join(' · '); }
  function stateTextRaw(eid, s) {
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
  const TABS = [['home', 'Home', 'home'], ['climate', 'Climate', 'climate'], ['rooms', 'Rooms', 'rooms'], ['devices', 'Devices', 'devices'], ['disco', 'Disco', 'auto'], ['settings', 'Settings', 'settings']];
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
      html = r === 'disco' ? pDisco() : r === 'climate' ? pClimate() : r === 'rooms' ? pRooms() : r === 'room' ? pRoom(S.route.id) : r === 'devices' ? pDevices() : r === 'settings' ? pSettings() : pHome();
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
    return `<nav class="bn" aria-label="Main"><div class="in">${TABS.map(([id, label, icon]) => `<a href="#/${id}" class="${cur === id ? 'sel' : ''}" ${cur === id ? 'aria-current="page"' : ''} data-k="n-${id}"><span class="ic">${ic(icon)}</span>${t(label)}</a>`).join('')}</div></nav>`;
  }
  function pill() {
    if (S.demo) return `<span class="pill demo"><span class="dot"></span>${t('Preview')}</span>`;
    const lbl = { idle: 'Not set up', connecting: 'Connecting', reconnecting: 'Reconnecting', connected: 'Connected', disconnected: 'Disconnected', error: 'Error', auth_invalid: 'Token rejected' }[S.conn];
    return `<span class="pill ${S.conn}"><span class="dot"></span>${t(lbl)}</span>`;
  }
  function banner() {
    if (S.demo) return `<div class="banner demo" data-k="bn-demo">${ic('eye')}<span class="grow">Preview with sample data — not your home</span><button data-act="exit-demo">Exit</button></div>`;
    if (S.conn === 'connected' || S.conn === 'idle') return '';
    if (S.conn === 'connecting' || S.conn === 'reconnecting') return `<div class="banner ${S.conn}" data-k="bn">${ic('refresh', 'spin')}<span class="grow">${S.conn === 'connecting' ? 'Connecting to Home Assistant…' : 'Connection lost. Reconnecting…'}${S.stale ? '<br><span style="font-weight:500">Showing last known values</span>' : ''}</span>${S.conn === 'reconnecting' ? '<button data-act="retry">Retry</button>' : ''}</div>`;
    const msg = S.conn === 'disconnected' ? 'Disconnected from Home Assistant' : S.err || 'Home Assistant is unavailable';
    return `<div class="banner ${S.conn}" data-k="bn">${ic('wifioff')}<span class="grow">${esc(msg)}</span>${S.conn === 'auth_invalid' ? '<button data-act="go-settings">' + t('Settings') + '</button>' : '<button data-act="retry">Retry</button>'}</div>`;
  }
  function toggleHTML(eid, s, cls) {
    const k = model().kind[eid];
    if (k === 'scene' || k === 'script') return `<button class="runbtn${S.pending[eid] ? ' pending' : ''}" data-act="run" data-eid="${esc(eid)}" ${avail(s) ? '' : 'disabled'} aria-label="Run ${esc(nameOf(eid))}">${t('Run')}</button>`;
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
    const e = mainTemp(r); const tv = tempOf(e); const h = settings.showHum ? roomHum(r) : null; const tr = e && trendOf(e);
    const trI = tr ? `<span class="trend" title="${tr.d > 0 ? '+' : ''}${fmtNum(tr.d, 1)}° in the last hour">${ic(tr.dir === 'up' ? 'up' : tr.dir === 'down' ? 'down' : 'flat')}</span>` : '';
    const body = r.temps.length || tv != null ? `<span class="rt num">${smallT(tv)}</span>` : `<span class="rt" style="font-size:15px;font-weight:600;margin-top:8px">${devCount(r)}</span>`;
    return `<button class="room c-${r.color}${tv == null && r.temps.length ? ' na' : ''}" data-k="r-${esc(r.id)}" data-act="room" data-id="${esc(r.id)}" aria-label="${esc(r.name)} ${tv != null ? fmtT(tv) : ''}">
<span class="ri">${ic(r.icon)}</span>${trI}<span class="rn">${esc(r.name)}</span>${body}${h != null ? `<span class="rh">${ic('drop')}${pct(h)}</span>` : r.temps.length && tv == null ? '<span class="rh">Unavailable</span>' : '<span class="rh">&nbsp;</span>'}</button>`;
  }
  function devCount(r) { const on = r.devs.filter((e) => isOn(e)).length; return (r.devs.length === 1 ? t('1 device') : t('{n} devices', { n: r.devs.length })) + (on ? ' · ' + t('{n} on', { n: on }) : ''); }
  function emptyHTML(icon, text, k) { return `<div class="empty" data-k="${k || 'empty'}">${ic(icon)}<span>${text}</span></div>`; }
  function greeting(h) { return t(h >= 5 && h < 12 ? 'Good morning' : h >= 12 && h < 18 ? 'Good afternoon' : h >= 18 && h < 23 ? 'Good evening' : 'Good night'); }
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
    const date = now.toLocaleDateString(loc(), { weekday: 'long', day: 'numeric', month: 'long' });
    const time = now.toLocaleTimeString(loc(), { hour: '2-digit', minute: '2-digit' });
    const loading = (S.conn === 'connecting' || S.conn === 'reconnecting') && !Object.keys(S.states).length;
    let out = `<div class="page" data-k="p-home">`;
    out += `<div class="hero" data-k="hero"><div class="hero-top"><div><h1 class="greet">${greeting(now.getHours())}</h1><div class="when num">${esc(date)} · ${esc(time)}</div></div>${pill()}</div>`;
    if (!configured()) { out += `<div class="hero-temp"><span class="bigt">—</span></div></div><div class="sec" data-k="w">${installHint()}${welcomeHTML()}</div></div>`; return out; }
    const ht = houseTemp();
    const w = m.weather && st(m.weather); const wt = w && avail(w) && w.attributes.temperature != null ? +w.attributes.temperature : null;
    out += `<div class="hero-temp">${bigT(ht.v)}<div class="hero-meta"><b>${esc(ht.label)}</b>${wt != null ? `<span>${t('Outside {t}', { t: fmtT(wt) })}</span>` : ''}</div></div>`;
    const onNow = m.controls.filter((e) => isOn(e) && !['scene', 'script', 'lock'].includes(m.kind[e]));
    const unav = m.controls.concat(m.temps).filter((e) => !avail(st(e))).length;
    const clim = m.climates.map((e) => st(e)).filter((s) => s && avail(s) && s.state !== 'off');
    out += `<div class="status-row">`;
    out += `<span class="stat">${ic('power')}${onNow.length ? t('{n} on', { n: onNow.length }) : t('All off')}</span>`;
    if (clim.length) { const a = clim[0].attributes; const act = a.hvac_action; out += `<span class="stat">${ic(act === 'heating' || (!act && clim[0].state === 'heat') ? 'flame' : act === 'cooling' || (!act && clim[0].state === 'cool') ? 'snow' : act === 'drying' ? 'droplet' : 'climate')}${esc(ACTION[a.hvac_action] && a.hvac_action !== 'idle' ? ACTION[a.hvac_action] : HVAC[clim[0].state] || 'On')}${a.temperature != null ? ' ' + t('to {t}', { t: fmtT(+a.temperature) }) : ''}</span>`; }
    const open = m.rooms.reduce((n, r) => n + r.bins.filter((e) => { const s = st(e); return s && s.state === 'on' && ['door', 'window', 'garage_door', 'opening'].includes(s.attributes.device_class); }).length, 0);
    if (open) out += `<span class="stat warn">${ic('window')}${t('{n} open', { n: open })}</span>`;
    if (unav) out += `<span class="stat bad">${ic('alert')}${t('{n} unavailable', { n: unav })}</span>`;
    out += `</div></div>`;
    out += `<div class="sec" data-k="bnr">${installHint()}${banner()}</div>`;

    // rooms
    out += `<div class="sec" data-k="s-rooms"><div class="sec-h"><h2>${t('Rooms')}</h2><a href="#/rooms">${t('All rooms')}</a></div>`;
    if (loading) out += `<div class="rooms-grid">${'<div class="skel"></div>'.repeat(4)}</div>`;
    else if (!m.rooms.length) out += emptyHTML('rooms', S.conn === 'connected' || S.stale ? 'No rooms yet. Assign devices to areas in Home Assistant to see them here.' : 'Rooms appear once connected.');
    else out += `<div class="rooms-grid">${m.rooms.map(roomCardHTML).join('')}</div>`;
    out += `</div>`;

    // quick switches
    const favs = settings.favorites.filter((e) => S.states[e] && m.kind[e]);
    const auto = favs.length ? favs : m.controls.filter((e) => ['light', 'plug', 'switch', 'fan', 'cover', 'media'].includes(m.kind[e])).sort((a, b) => (isOn(b) - isOn(a)) || (avail(st(b)) - avail(st(a)))).slice(0, 8);
    out += `<div class="sec" data-k="s-quick"><div class="sec-h"><h2>${t(favs.length ? 'Favorites' : 'Quick switches')}</h2><a href="#/devices">${t('All devices')}</a></div>`;
    if (loading) out += `<div class="tiles">${'<div class="skel" style="min-height:104px"></div>'.repeat(4)}</div>`;
    else if (!auto.length) out += emptyHTML('devices', 'No switchable devices found.');
    else out += `<div class="tiles">${auto.map((e) => tileHTML(e)).join('')}</div>${favs.length ? '' : `<p class="hint">Tip: tap ${ic('star')} on the Devices page to pin your own favorites here.</p>`}`;
    out += `</div>`;

    // on now
    if (!loading && m.controls.length) {
      out += `<div class="sec" data-k="s-on"><div class="sec-h"><h2>${t('On now')} <span class="aux">${onNow.length}</span></h2>${onNow.some((x) => m.kind[x] === 'light') ? `<button class="link" data-act="all-lights-off">${t('All lights off')}</button>` : ''}</div>`;
      out += onNow.length ? `<div class="chips">${onNow.map((e) => `<button class="chip${m.kind[e] === 'light' ? ' on-light' : ''}" data-k="c-${esc(e)}" data-act="sheet" data-eid="${esc(e)}">${ic(devIcon(e, st(e)))}${esc(nameOf(e))}</button>`).join('')}</div>` : emptyHTML('ok', t('Everything is off.'), 'e-on');
      out += `</div>`;
    }
    // climate mini
    if (m.climates.length) {
      const e = selectedClimate(m); const s = st(e); const a = (s && s.attributes) || {}; const on = isOn(e, s);
      out += `<div class="sec" data-k="s-clim"><div class="sec-h"><h2>${t('Climate')}</h2><a href="#/climate">${t('Controls')}</a></div>
<a class="card climini${on ? ' on' : ''}" href="#/climate" style="text-decoration:none;color:inherit"><span class="dico">${ic('climate')}</span><div><div style="font-weight:650">${esc(nameOf(e))}</div><div style="font-size:12.5px;color:var(--muted);font-weight:500">${esc(stateText(e, s))}</div></div><span class="t num">${a.current_temperature != null && avail(s) ? smallT(+a.current_temperature) : '—'}</span></a></div>`;
    }
    return out + `</div>`;
  }

  /* ---------------- CLIMATE ---------------- */
  function pClimate() {
    const m = model();
    let out = `<div class="page" data-k="p-climate"><div class="topbar"><h1>${t('Climate')}</h1>${pill()}</div>${banner()}`;
    if (!configured()) return out + welcomeHTML() + '</div>';
    if (!m.climates.length) return out + emptyHTML('climate', S.conn === 'connected' ? 'No climate devices found in Home Assistant.' : 'Climate devices appear once connected.') + '</div>';
    const main = selectedClimate(m);
    const list = [main].concat(m.climates.filter((e) => e !== main));
    const cur = list.includes(S.climCur) ? S.climCur : main;
    if (list.length > 1) out += `<div class="chips cnames" style="margin-bottom:12px">${list.map((e) => { const s = st(e); return `<button class="chip${e === cur ? ' sel' : ''}" data-k="cs-${esc(e)}" data-act="clim-go" data-eid="${esc(e)}">${ic(isOn(e, s) ? (s.state === 'heat' ? 'flame' : s.state === 'cool' ? 'snow' : 'climate') : 'power')}${esc(nameOf(e))}${e === main ? ` <span class="cnt">★</span>` : ''}</button>`; }).join('')}</div>`;
    out += `<div class="ccar" data-k="ccar" data-static-scroll>${list.map((e) => `<div class="cslide" data-k="sl-${esc(e)}" data-eid="${esc(e)}">${climateHTML(e, e === main)}</div>`).join('')}</div>`;
    if (list.length > 1) out += `<div class="cdots" data-k="cdots">${list.map((e) => `<i class="${e === cur ? 'on' : ''}" data-eid="${esc(e)}"></i>`).join('')}</div><p class="hint" style="text-align:center">${t('Swipe for your other air conditioners')}</p>`;
    return out + '</div>';
  }
  function selectedClimate(m) {
    if (m.climates.includes(settings.climate)) return settings.climate;
    if (!m.climates.includes(S.climSel)) S.climSel = m.climates.find((e) => isOn(e)) || m.climates[0]; // sticky for this session
    return S.climSel;
  }
  function climateHTML(eid, isMain) {
    const s = st(eid);
    if (!s) return emptyHTML('alert', 'This climate device no longer exists.');
    const a = s.attributes; const f = a.supported_features || 0; const ok = avail(s) && C && C.authed; const on = isOn(eid, s);
    const room = roomOfEid(eid); const unitS = unit();
    const min = a.min_temp != null ? +a.min_temp : 7; const max = a.max_temp != null ? +a.max_temp : 35; const step = avail(s) ? climStep(eid) : 0.5;
    const range = (f & 2) && a.target_temp_low != null && a.target_temp_high != null && (a.temperature == null || s.state === 'heat_cool');
    const single = (f & 1) && a.temperature != null;
    const dr = S.draft[eid]; const target = dr ? dr.v : single ? +a.temperature : null;
    const pending = !!S.pending[eid] || !!dr;
    let out = `<div class="card clim" data-k="clim-${esc(eid)}"><div class="clim-head"><div><div class="cn">${esc(nameOf(eid))}</div><div class="cs">${esc([room && room.name, !avail(s) ? t('Unavailable') : on ? (ACTION[a.hvac_action] || HVAC[s.state] || cap(s.state)) : t('Off')].filter(Boolean).join(' · '))}</div></div>
${model().climates.length > 1 ? `<button class="mainstar${isMain ? ' on' : ''}" data-act="clim-main" data-eid="${esc(eid)}" aria-label="${t('Set as main')}" aria-pressed="${!!isMain}" ${isMain ? 'disabled' : ''}>${ic('star')}<span>${t(isMain ? 'Main' : 'Set as main')}</span></button>` : ''}<button class="pwr${on ? ' on' : ''}${S.pending[eid] && !dr ? ' pending' : ''}" data-act="clim-power" data-eid="${esc(eid)}" aria-label="Power ${on ? 'off' : 'on'}" aria-pressed="${on}" ${ok ? '' : 'disabled'}>${ic('power')}</button></div>`;
    if (single || !range) {
      const p = target != null ? clamp((target - min) / (max - min || 1), 0, 1) : 0;
      const R = 100, CX = 120, CY = 120, L = 2 * Math.PI * R * 0.75, CIRC = 2 * Math.PI * R;
      const ang = (135 + 270 * p) * Math.PI / 180; const kx = CX + R * Math.cos(ang), ky = CY + R * Math.sin(ang);
      out += `<div class="dial${on ? '' : ' off'}"><svg viewBox="0 0 240 240" aria-hidden="true"><defs><linearGradient id="dg-${esc(eid.replace(/\W/g, '_'))}" x1="0" y1="1" x2="1" y2="0"><stop offset="0" stop-color="#7cc2f0"/><stop offset="1" stop-color="${s.state === 'heat' ? '#ef8d4b' : '#2f86d6'}"/></linearGradient></defs>
<circle class="trk" cx="120" cy="120" r="${R}" stroke-dasharray="${L.toFixed(1)} ${CIRC.toFixed(1)}" transform="rotate(135 120 120)"/>
${target != null ? `<circle class="arc" style="stroke:url(#dg-${esc(eid.replace(/\W/g, '_'))})" cx="120" cy="120" r="${R}" stroke-dasharray="${(L * p).toFixed(1)} ${CIRC.toFixed(1)}" transform="rotate(135 120 120)"/><circle class="knob" cx="${kx.toFixed(1)}" cy="${ky.toFixed(1)}" r="11"/>` : ''}</svg>
<div class="mid"><span class="lbl">${t(target != null ? 'Target' : 'Current')}</span><span class="tt num">${target != null ? smallT(target) : a.current_temperature != null ? smallT(+a.current_temperature) : '—'}</span>
${target != null ? `<span class="ct">${ic('thermo')}${t('Room {t}', { t: a.current_temperature != null ? fmtT(+a.current_temperature) : '—' })}</span>` : ''}<span class="sending">${pending ? t('Sending…') : ''}</span></div></div>`;
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
    if (modes.length) out += `<div class="sec card ctl-card" data-k="cm"><h3>${ic('sunmoon')}${t('Mode')}</h3><div class="modes">${modes.map((md) => `<button class="mode m-${esc(md)}${s.state === md ? ' sel' : ''}" data-act="clim-mode" data-eid="${esc(eid)}" data-v="${esc(md)}" aria-pressed="${s.state === md}" ${ok ? '' : 'disabled'}>${ic(MI[md] || 'climate')}${esc(HVAC[md] || cap(md.replace(/_/g, ' ')))}</button>`).join('')}</div></div>`;
    const opt = (title, icon, list, cur, act, bars) => `<div class="sec card ctl-card" data-k="${act}"><h3>${ic(icon)}${t(title)}</h3><div class="fan">${list.map((v, i) => {
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
    let out = `<div class="page" data-k="p-rooms"><div class="topbar"><h1>${t('Rooms')}</h1>${pill()}</div>${banner()}`;
    if (!configured()) return out + welcomeHTML() + '</div>';
    const list = m.rooms.concat(m.unassigned ? [m.unassigned] : []);
    if (!list.length) return out + emptyHTML('rooms', S.conn === 'connected' ? 'No rooms found. Create areas in Home Assistant and assign your devices to them.' : 'Rooms appear once connected.') + '</div>';
    let floor; out += '<div class="list">';
    list.forEach((r) => {
      if (r.floor && r.floor !== floor && Object.keys(S.floors).length > 1) { floor = r.floor; out += `<div class="grp-h" data-k="f-${esc(r.floor.floor_id)}">${esc(r.floor.name)}</div>`; }
      if (r.id === '_none' && floor) { floor = null; out += `<div class="grp-h" data-k="f-none">No room</div>`; }
      const e = mainTemp(r); const tv = tempOf(e); const h = roomHum(r);
      out += `<button class="roomrow c-${r.color}" data-k="rr-${esc(r.id)}" data-act="room" data-id="${esc(r.id)}"><span class="ri">${ic(r.icon)}</span><span class="rb"><div class="rn">${esc(r.name)}</div><div class="rs">${devCount(r)}</div></span>
<span>${r.temps.length || tv != null ? `<div class="rt num">${smallT(tv)}</div>` : ''}${h != null ? `<div class="rh">${ic('drop')} ${pct(h)}</div>` : ''}</span><span class="chev">${ic('chev')}</span></button>`;
    });
    return out + '</div></div>';
  }
  function pRoom(id) {
    const m = model(); const r = m.roomById[id];
    let out = `<div class="page sub" data-k="p-room-${esc(id)}"><div class="topbar"><button class="iconbtn" data-act="back" aria-label="Back">${ic('back')}</button><h1>${esc(r ? r.name : 'Room')}</h1>${pill()}</div>${banner()}`;
    if (!r) return out + emptyHTML('alert', Object.keys(S.states).length ? 'This room was not found. It may have been removed in Home Assistant.' : 'Loading…') + '</div>';
    const e = mainTemp(r); const tv = tempOf(e); const h = roomHum(r); const tr = e && trendOf(e);
    if (r.id !== '_none') {
      const sp = e && S.spark[e];
      out += `<div class="rhero c-${r.color}" data-k="rh"><span class="ri" style="color:var(--${r.color}-i)">${ic(r.icon)}</span><div style="flex:1;min-width:0">${bigT(tv)}
<div class="meta">${h != null ? `${ic('drop')} ${pct(h)} humidity · ` : ''}${tr ? `${tr.d > 0 ? '+' : ''}${fmtNum(tr.d, 1)}° last hour` : e ? esc(nameOf(e, r)) : 'No temperature sensor'}</div>
${sp && sp.pts.length > 2 ? sparkHTML(sp.pts, r.color) : ''}</div></div>`;
    }
    const sensors = r.temps.concat(r.hums);
    if (sensors.length > 1 || (sensors.length && r.temps.length > 1)) {
      out += `<div class="sec" data-k="rs"><div class="sec-h"><h2>${t('Sensors')}</h2></div><div class="list">${sensors.map((x) => {
        const s = st(x); const isMain = x === e; const isT = r.temps.includes(x);
        return `<div class="row${avail(s) ? '' : ' na'}" data-k="sn-${esc(x)}"><span class="dico">${ic(isT ? 'thermo' : 'drop')}</span><button class="rb" ${isT && r.temps.length > 1 ? `data-act="main-sensor" data-room="${esc(r.id)}" data-eid="${esc(x)}"` : `data-act="sheet" data-eid="${esc(x)}"`}><div class="rn">${esc(nameOf(x, r))}</div><div class="rs">${isMain ? 'Room temperature' : isT && r.temps.length > 1 ? 'Tap to use as room temperature' : isT ? 'Temperature sensor' : 'Humidity sensor'}</div></button><span class="rvalue num">${esc(stateText(x, s))}</span></div>`; }).join('')}</div></div>`;
    }
    out += `<div class="sec" data-k="rc"><div class="sec-h"><h2>${t('Controls')}</h2>${r.devs.some((x) => model().kind[x] === 'light') ? `<button class="link" data-act="room-lights" data-id="${esc(r.id)}">${t(r.devs.some((x) => model().kind[x] === 'light' && isOn(x)) ? 'Lights off' : 'Lights on')}</button>` : `<span class="aux">${r.devs.length ? devCount(r) : ''}</span>`}</div>`;
    out += r.devs.length ? `<div class="tiles">${r.devs.map((x) => tileHTML(x, r)).join('')}</div>` : emptyHTML('devices', 'No controllable devices in this room.');
    out += `</div>`;
    const status = r.bins.concat(r.other);
    if (status.length) out += `<div class="sec" data-k="rst"><div class="sec-h"><h2>${t('Status')}</h2></div><div class="list">${status.map((x) => { const s = st(x); return `<div class="row${avail(s) ? '' : ' na'}" data-k="st-${esc(x)}"><span class="dico">${ic(devIcon(x, s))}</span><div class="rb"><div class="rn">${esc(nameOf(x, r))}</div><div class="rs">${esc(ago(s))}</div></div><span class="rvalue num">${esc(stateText(x, s))}</span></div>`; }).join('')}</div></div>`;
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
    let out = `<div class="page" data-k="p-devices"><div class="sticky"><div class="topbar"><h1>${t('Devices')}</h1>${pill()}</div>`;
    if (!configured()) return out + `</div>${welcomeHTML()}</div>`;
    out += `<label class="search" data-static>${ic('search')}<input type="search" placeholder="${t('Search devices')}" value="${esc(S.q)}" data-in="search" aria-label="Search devices" autocomplete="off" enterkeyhint="search"></label></div>${banner()}`;
    const q = S.q.trim().toLowerCase();
    const all = m.controls.filter((e) => !q || nameOf(e).toLowerCase().includes(q) || roomNameOf(e).toLowerCase().includes(q) || e.includes(q));
    const favs = settings.favorites.filter((e) => all.includes(e));
    const counts = {}; all.forEach((e) => { const c = catOf(m.kind[e]); counts[c] = (counts[c] || 0) + 1; });
    const cats = CATS.filter((c) => counts[c.id]);
    if (S.cat !== 'all' && S.cat !== 'fav' && !counts[S.cat]) S.cat = 'all';
    out += `<div class="chips" style="margin-top:10px">${[{ id: 'all', label: 'All', icon: 'grid', n: all.length }].concat(favs.length ? [{ id: 'fav', label: 'Favorites', icon: 'star', n: favs.length }] : [], cats.map((c) => Object.assign({ n: counts[c.id] }, c)))
      .map((c) => `<button class="chip${S.cat === c.id ? ' sel' : ''}" data-k="cat-${c.id}" data-act="cat" data-v="${c.id}" aria-pressed="${S.cat === c.id}">${ic(c.icon)}${t(c.label)}<span class="cnt">${c.n}</span></button>`).join('')}</div>`;
    out += `<div class="seg" style="margin-top:6px" role="group" aria-label="Group by"><button class="${settings.devGroup === 'type' ? 'sel' : ''}" data-act="group" data-v="type">${ic('list')}${t('By type')}</button><button class="${settings.devGroup === 'room' ? 'sel' : ''}" data-act="group" data-v="room">${ic('rooms')}${t('By room')}</button></div>`;
    let list = S.cat === 'all' ? all : S.cat === 'fav' ? favs : all.filter((e) => catOf(m.kind[e]) === S.cat);
    if (!m.controls.length) return out + `<div class="sec">${emptyHTML('devices', S.conn === 'connected' ? 'No devices found in Home Assistant.' : 'Devices appear once connected.')}</div></div>`;
    if (!list.length) return out + `<div class="sec">${emptyHTML('search', `No devices match “${esc(S.q)}”.`)}</div></div>`;
    const groups = [];
    if (settings.devGroup === 'room') {
      m.rooms.concat(m.unassigned ? [m.unassigned] : []).forEach((r) => { const g = list.filter((e) => (m.areaOf[e] || '_none') === r.id); if (g.length) groups.push([r.id, r.name, g]); });
    } else {
      CATS.forEach((c) => { const g = list.filter((e) => catOf(m.kind[e]) === c.id); if (g.length) groups.push([c.id, c.label, g]); });
    }
    out += groups.map(([id, label, g]) => `<div data-k="g-${esc(id)}"><div class="grp-h">${esc(t(label))} · ${g.length}</div><div class="list">${g.map((e) => rowHTML(e, { room: settings.devGroup !== 'room' })).join('')}</div></div>`).join('');
    return out + '</div>';
  }

  /* ---------------- DISCO ---------------- */
  const DISCO_MS = 120000;
  const colorLight = (s) => (s.attributes.supported_color_modes || []).some((m) => ['hs', 'rgb', 'rgbw', 'rgbww', 'xy'].includes(m));
  const dimLight = (s) => (s.attributes.supported_color_modes || []).some((m) => m !== 'onoff');
  function discoTargets() {
    const m = model();
    const lights = m.controls.filter((e) => m.kind[e] === 'light' && avail(S.states[e]));
    const sw = settings.discoSwitches.filter((e) => S.states[e] && avail(S.states[e]) && ['plug', 'switch'].includes(m.kind[e]));
    return { lights, sw };
  }
  function svc(domain, service, data) { return C && C.authed ? C.send({ type: 'call_service', domain, service, service_data: data }).catch(() => { /* keep dancing */ }) : Promise.resolve(); }
  function startDisco() {
    if (!canSend() || S.disco) return;
    const { lights, sw } = discoTargets();
    if (!lights.length && !sw.length) return toast('No lights found to use for the disco', 'bad');
    const backup = lights.concat(sw).map((e) => { const s = S.states[e]; const a = s.attributes; return { e, on: s.state === 'on', bri: a.brightness, hs: a.color_mode === 'hs' || a.color_mode === 'xy' || a.color_mode === 'rgb' || a.color_mode === 'rgbw' || a.color_mode === 'rgbww' ? a.hs_color : null, ct: a.color_mode === 'color_temp' ? a.color_temp_kelvin : null }; });
    const d = S.disco = { lights, sw, backup, ends: Date.now() + DISCO_MS, warm: Date.now() + 10000, n: 0 };
    lights.forEach((e) => { const s = S.states[e]; const data = { entity_id: e, brightness: 255 }; if (colorLight(s) && (s.attributes.supported_color_modes || []).includes('color_temp')) data.color_temp_kelvin = 5000; svc('light', 'turn_on', data); });
    sw.forEach((e) => svc('homeassistant', 'turn_on', { entity_id: e }));
    d.timer = setInterval(() => {
      if (Date.now() >= d.ends) return stopDisco();
      if (Date.now() < d.warm) { changed.add('__clock'); schedule(false); return; }   // first 10 seconds: everything on
      d.n++;
      const pick = lights.slice().sort(() => Math.random() - 0.5).slice(0, 6);   // a few lamps per beat keeps the network calm
      pick.forEach((e) => {
        const s = S.states[e]; if (!s) return;
        if (Math.random() < 0.18) return svc('light', 'turn_off', { entity_id: e, transition: 0.2 });
        const data = { entity_id: e, transition: 0.3 };
        if (colorLight(s)) { data.hs_color = [Math.floor(Math.random() * 360), 100]; data.brightness = 255; }
        else if (dimLight(s)) data.brightness = 40 + Math.floor(Math.random() * 215);
        svc('light', 'turn_on', data);
      });
      if (sw.length && d.n % 4 === 0) sw.forEach((e) => svc('homeassistant', 'toggle', { entity_id: e }));   // at most every ~4 s
      changed.add('__clock'); schedule(false);
    }, 900);
    schedule(true);
  }
  async function stopDisco() {
    const d = S.disco; if (!d || d.stopping) return;
    d.stopping = true; clearInterval(d.timer); schedule(true);
    await new Promise((r) => setTimeout(r, 600));   // let the last beat land first
    for (const b of d.backup) {
      const dom = b.e.split('.')[0];
      if (!b.on) { await svc(dom === 'light' ? 'light' : 'homeassistant', 'turn_off', { entity_id: b.e }); continue; }
      if (dom !== 'light') { await svc('homeassistant', 'turn_on', { entity_id: b.e }); continue; }
      const data = { entity_id: b.e };
      if (b.bri != null) data.brightness = b.bri;
      if (b.hs) data.hs_color = b.hs; else if (b.ct) data.color_temp_kelvin = b.ct;
      await svc('light', 'turn_on', data);
    }
    S.disco = null; toast('Disco is over. Everything is back to normal.', 'ok'); schedule(true);
  }
  document.addEventListener('visibilitychange', () => { if (document.visibilityState === 'hidden' && S.disco) stopDisco(); });
  function pDisco() {
    const m = model(); used.add('__clock');
    let out = `<div class="page" data-k="p-disco"><div class="topbar"><h1>${t('Disco')}</h1>${pill()}</div>${banner()}`;
    if (!configured()) return out + welcomeHTML() + '</div>';
    const { lights, sw } = discoTargets(); const d = S.disco;
    const left = d ? Math.max(0, Math.ceil((d.ends - Date.now()) / 1000)) : 120;
    out += `<div class="card disco" data-k="disco-main"><button class="discobtn${d ? ' on' : ''}" data-act="${d ? 'disco-stop' : 'disco-start'}" ${C && C.authed && (lights.length || sw.length) && !(d && d.stopping) ? '' : 'disabled'} aria-label="${d ? 'Stop disco' : 'Start disco'}">
<span class="discoin"><span class="dt num">${d ? (d.stopping ? '…' : Math.floor(left / 60) + ':' + String(left % 60).padStart(2, '0')) : ic('auto')}</span><span class="dl">${t(d ? (d.stopping ? 'Restoring…' : Date.now() < d.warm ? 'All on!' : 'Tap to stop') : 'Start disco')}</span></span></button>
<p class="dp">${d ? 'Party time! Keep this screen open. Everything goes back to how it was when the timer ends.' : `First everything turns on for 10 seconds, then for 2 minutes your ${lights.length} light${lights.length === 1 ? '' : 's'} flash in party colours${sw.length ? ` and ${sw.length} switch${sw.length === 1 ? '' : 'es'} turn on and off` : ''}. Afterwards everything goes back exactly as it was.`}</p></div>`;
    const cand = m.controls.filter((e) => ['plug', 'switch'].includes(m.kind[e]));
    out += `<div class="sec-h" style="margin-top:24px"><h2>${t('Also switch these on and off')}</h2><span class="aux">${sw.length} chosen</span></div>
<div class="msg warn" data-k="dwarn">${ic('alert')}<div>Only choose lamps, light strips or decorations. Never choose heating, pumps, a fridge, the TV or computers: switching them on and off quickly can damage them.</div></div>`;
    out += cand.length ? `<div class="card set" data-k="dsw">${cand.map((e) => { const on = settings.discoSwitches.includes(e); return `<button class="it" data-act="disco-sw" data-eid="${esc(e)}" data-k="ds-${esc(e)}" ${d ? 'disabled' : ''}><span class="ic">${ic(devIcon(e, st(e)))}</span><span class="lb"><b>${esc(nameOf(e))}</b><span>${esc(roomNameOf(e) || stateText(e))}</span></span><span class="chk${on ? ' on' : ''}" aria-hidden="true">${on ? ic('ok') : ''}</span></button>`; }).join('')}</div>` : emptyHTML('plug', 'No switches or plugs found.');
    return out + '</div>';
  }

  /* ---------------- SETTINGS ---------------- */
  function pSettings() {
    const auth = loadAuth() || {}; const m = model();
    const sameOrigin = /^https?:$/.test(location.protocol) && location.pathname.includes('/local/') ? location.origin : '';
    let out = `<div class="page" data-k="p-settings"><div class="topbar"><h1>${t('Settings')}</h1>${pill()}</div>`;
    // connection
    out += `<div class="sec-h" style="margin-top:8px"><h2>Home Assistant</h2></div><div class="card set" data-k="conn"><div class="blk">`;
    if (EMBED) {
      out += S.conn === 'connected' ? `<div class="msg ok">${ic('ok')}<div>Logged in to <b>${esc((S.config && S.config.location_name) || 'Home Assistant')}</b>${S.userName ? ' as ' + esc(S.userName) : ''}<br>${m.controls.length} devices · ${m.temps.length} temperature sensors · ${m.rooms.length} rooms</div></div>`
        : S.conn === 'error' ? `<div class="msg bad">${ic('alert')}<div>${esc(S.err)}</div></div>` : `<div class="msg warn">${ic('refresh', 'spin')}<div>Connecting…</div></div>`;
      out += `<p style="font-size:13px;color:var(--muted);margin:0 2px 12px">Your login is handled by Home Assistant itself. The app stays logged in and reconnects automatically.</p><div class="btns" style="flex-direction:column"><button class="btn pri" data-act="open-ha">${ic('home')}${t('Open Home Assistant')}</button><button class="btn danger" data-act="embed-logout">${ic('logout')}${t('Log out')}</button></div><p style="font-size:12.5px;color:var(--muted);margin:10px 2px 0">${t('Back to the normal Home Assistant screens')}</p></div></div>`;
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
${auth.mode === 'oauth' ? `<div class="btns"><button class="btn" data-act="${S.conn === 'disconnected' ? 'retry' : 'disconnect'}">${S.conn === 'disconnected' ? 'Reconnect' : 'Disconnect'}</button><button class="btn danger" data-act="forget">${ic('logout')}${t('Log out')}</button></div>` : ''}
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
    out += `<div class="sec-h" style="margin-top:24px"><h2>${t('Appearance')}</h2><span class="aux">Now: ${eff === 'dark' ? 'Night' : 'Day'}</span></div><div class="card set" data-k="app"><div class="blk"><div class="seg" role="group" aria-label="Theme">${[['auto', 'Automatic', 'sunmoon'], ['light', 'Day', 'sun'], ['dark', 'Night', 'moon']].map(([v, l, i]) => `<button class="${settings.theme === v ? 'sel' : ''}" data-act="theme" data-v="${v}" aria-pressed="${settings.theme === v}">${ic(i)}${t(l)}</button>`).join('')}</div></div>`;
    out += `<div class="it"><span class="ic">${ic('link')}</span><span class="lb"><b>${t('Language')}</b></span><select data-set="lang" aria-label="Language">${[['en', 'English'], ['nl', 'Nederlands'], ['mc', 'Minecraft']].map(([v, l]) => `<option value="${v}" ${settings.lang === v ? 'selected' : ''}>${l}</option>`).join('')}</select></div>`;
    if (settings.theme === 'auto') {
      out += `<div class="it"><span class="ic">${ic('clock')}</span><span class="lb"><b>${t('Switch automatically by')}</b></span><select data-set="autoSource" aria-label="Automatic mode source"><option value="time" ${settings.autoSource === 'time' ? 'selected' : ''}>${t('Time of day')}</option><option value="system" ${settings.autoSource === 'system' ? 'selected' : ''}>${t('Phone setting')}</option></select></div>`;
      if (settings.autoSource === 'time') out += `<div class="it"><span class="ic">${ic('sun')}</span><span class="lb"><b>${t('Day starts')}</b></span><input type="time" data-set="dayStart" value="${esc(settings.dayStart)}" aria-label="Day starts"></div><div class="it"><span class="ic">${ic('moon')}</span><span class="lb"><b>${t('Night starts')}</b></span><input type="time" data-set="nightStart" value="${esc(settings.nightStart)}" aria-label="Night starts"></div>`;
    }
    out += `</div>`;
    // home
    const opts = [['auto', 'Average of rooms']].concat(m.temps.map((e) => [e, nameOf(e)]), m.climates.map((e) => [e, nameOf(e) + ' (room temp)']));
    out += `<div class="sec-h" style="margin-top:24px"><h2>${t('Home screen')}</h2></div><div class="card set" data-k="homeset">
<div class="it"><span class="ic">${ic('thermo')}</span><span class="lb"><b>${t('House temperature')}</b></span><select data-set="houseSource" aria-label="House temperature source">${opts.map(([v, l]) => `<option value="${esc(v)}" ${settings.houseSource === v ? 'selected' : ''}>${esc(l)}</option>`).join('')}</select></div>
<label class="it"><span class="ic">${ic('drop')}</span><span class="lb"><b>${t('Show humidity on room cards')}</b></span><input type="checkbox" data-set="showHum" ${settings.showHum ? 'checked' : ''} style="width:22px;height:22px;accent-color:var(--accent)"></label>
<div class="it"><span class="ic">${ic('star')}</span><span class="lb"><b>Favorites</b><span>${settings.favorites.length ? settings.favorites.length + ' pinned to Home' : 'Star devices on the Devices page'}</span></span>${settings.favorites.length ? '<button class="runbtn" data-act="clear-favs">Clear</button>' : ''}</div></div>`;
    // about
    out += `<div class="sec-h" style="margin-top:24px"><h2>${t('App')}</h2></div><div class="card set" data-k="about">
<div class="it"><span class="ic">${ic('smartphone')}</span><span class="lb"><b>Comfort Home</b><span>Version ${VERSION}</span></span></div>
<button class="it" data-act="reload" ${C && C.authed ? '' : 'disabled'}><span class="ic">${ic('refresh')}</span><span class="lb"><b>${t('Reload from Home Assistant')}</b><span>${t('Refresh rooms and devices')}</span></span></button>
<div class="it"><span class="ic">${ic('shield')}</span><span class="lb"><b>${t('Privacy')}</b><span>Your token stays on this device and is only sent to your Home Assistant.</span></span></div></div>`;
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
      b += `<div class="bigtg"><b>${t(on ? 'On' : 'Off')}</b>${toggleHTML(eid, s)}</div>`;
    const slider = (label, val, min, max, stepv, act, fmt) => `<div class="ctl"><div class="hd"><span>${label}</span><b class="num" data-out="${act}">${fmt(val)}</b></div><input class="range" type="range" min="${min}" max="${max}" step="${stepv}" value="${val}" style="--p:${((val - min) / (max - min) * 100).toFixed(1)}%" data-in="${act}" data-eid="${esc(eid)}" aria-label="${label}" ${ok ? '' : 'disabled'}></div>`;
    if (k === 'light') {
      const modes = a.supported_color_modes || []; const dim = modes.some((x) => x !== 'onoff');
      if (dim) b += slider(t('Brightness'), a.brightness != null ? Math.max(1, Math.round(a.brightness / 2.55)) : 0, 1, 100, 1, 'bri', (v) => (s.state === 'on' ? v + '%' : 'Off'));
      if (modes.includes('color_temp') && a.min_color_temp_kelvin) b += slider(t('Warmth'), a.color_temp_kelvin || a.min_color_temp_kelvin, a.min_color_temp_kelvin, a.max_color_temp_kelvin, 50, 'ct', (v) => v + ' K');
      if (modes.some((x) => ['hs', 'rgb', 'rgbw', 'rgbww', 'xy'].includes(x))) {
        const cur = a.color_mode !== 'color_temp' && a.hs_color ? a.hs_color[0] : null;
        b += `<div class="ctl"><div class="hd"><span>${t('Colour')}</span></div><div class="swatches">${[0, 25, 50, 120, 180, 220, 270, 320].map((h) => `<button class="sw${cur != null && Math.abs(cur - h) < 12 ? ' sel' : ''}" style="--h:${h}" data-act="light-hs" data-h="${h}" data-eid="${esc(eid)}" aria-label="Colour ${h}" ${ok ? '' : 'disabled'}></button>`).join('')}<button class="sw white${a.color_mode === 'color_temp' ? ' sel' : ''}" data-act="light-hs" data-white="1" data-eid="${esc(eid)}" aria-label="White" ${ok ? '' : 'disabled'}></button></div></div>`;
      }
      if (dim) b += `<div class="ctl"><div class="hd"><span>${t('Moods')}</span></div><div class="moods">${[['relax', 'Relax', 'sofa'], ['read', 'Read', 'list'], ['focus', 'Focus', 'sun'], ['night', 'Night light', 'moon']].map(([v, l, i]) => `<button data-act="light-mood" data-v="${v}" data-eid="${esc(eid)}" ${ok ? '' : 'disabled'}>${ic(i)}${t(l)}</button>`).join('')}</div></div>`;
      if ((f & 4) && (a.effect_list || []).length) b += `<div class="ctl"><div class="hd"><span>${t('Effects')}</span></div><div class="fan" style="margin-top:8px">${a.effect_list.slice(0, 12).map((v) => `<button class="${a.effect === v ? 'sel' : ''}" data-act="light-fx" data-v="${esc(v)}" data-eid="${esc(eid)}" ${ok ? '' : 'disabled'}>${esc(prettyMode(v))}</button>`).join('')}</div></div>`;
    }
    if (k === 'fan' && (f & 1)) b += slider('Speed', a.percentage || 0, 0, 100, a.percentage_step ? Math.max(1, Math.round(a.percentage_step)) : 1, 'fanpct', (v) => v + '%');
    if (k === 'fan' && (f & 2)) b += `<div class="bigtg"><b>${t('Oscillate')}</b><button class="tg${S.pending[eid] ? ' pending' : ''}" role="switch" aria-checked="${!!a.oscillating}" data-act="osc" data-eid="${esc(eid)}" ${ok ? '' : 'disabled'} aria-label="Oscillate"><span class="kn"></span></button></div>`;
    if (k === 'cover') {
      b += `<div class="btnrow" style="margin-bottom:12px">${(f & 1) || !f ? `<button class="btn" data-act="cover" data-v="open_cover" data-eid="${esc(eid)}" ${ok && s.state !== 'open' || ok && a.current_position < 100 ? '' : 'disabled'}>${ic('open')}Open</button>` : ''}${f & 8 ? `<button class="btn" data-act="cover" data-v="stop_cover" data-eid="${esc(eid)}" ${ok ? '' : 'disabled'}>${ic('stop')}Stop</button>` : ''}${(f & 2) || !f ? `<button class="btn" data-act="cover" data-v="close_cover" data-eid="${esc(eid)}" ${ok && s.state !== 'closed' ? '' : 'disabled'}>${ic('close')}Close</button>` : ''}</div>`;
      if ((f & 4) && a.current_position != null) b += slider('Position', a.current_position, 0, 100, 1, 'pos', (v) => v + '% open');
    }
    if (k === 'media') {
      if (a.media_title) b += `<div class="ctl"><div class="hd"><span>${t('Now playing')}</span></div><div style="font-weight:600;margin-top:4px">${esc(a.media_title)}</div>${a.source ? `<div style="font-size:12.5px;color:var(--muted)">${esc(a.source)}</div>` : ''}</div>`;
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
      case 'disco-start': startDisco(); break;
      case 'open-ha': try { sessionStorage.setItem('comfortLeave', '1'); } catch (x) { /* */ } if (EMBED) location.href = '/'; else { const au = loadAuth(); if (au && au.url) window.open(au.url, '_blank'); } break;
      case 'all-lights-off': { const ids = model().controls.filter((x) => model().kind[x] === 'light' && isOn(x)); if (ids.length && canSend()) { svc('light', 'turn_off', { entity_id: ids }); toast(t('Lights off'), 'ok'); } break; }
      case 'room-lights': { const r = model().roomById[el.dataset.id]; if (!r || !canSend()) break; const ids = r.devs.filter((x) => model().kind[x] === 'light' && avail(S.states[x])); const anyOn = ids.some((x) => isOn(x)); if (ids.length) svc('light', anyOn ? 'turn_off' : 'turn_on', { entity_id: ids }); break; }
      case 'clim-main': settings.climate = eid; saveSettings(); S.climSel = eid; schedule(true); toast(nameOf(eid) + ' · ' + t('Main'), 'ok'); break;
      case 'clim-go': { const sl = document.querySelector(`.cslide[data-eid="${CSS.escape(eid)}"]`); if (sl) sl.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' }); break; }
      case 'light-hs': { const h = +el.dataset.h; if (el.dataset.white) command(eid, 'light', 'turn_on', S.states[eid].attributes.supported_color_modes.includes('color_temp') ? { color_temp_kelvin: 4000 } : { hs_color: [0, 0] }, (ns) => ns.state === 'on'); else command(eid, 'light', 'turn_on', { hs_color: [h, 100] }, (ns) => ns.state === 'on' && ns.attributes.hs_color && Math.abs(ns.attributes.hs_color[0] - h) < 8); break; }
      case 'light-mood': { const P = { relax: [2700, 55], read: [4000, 100], focus: [5500, 100], night: [2200, 8] }[el.dataset.v]; const sa = S.states[eid].attributes; const d = { brightness_pct: P[1] }; if ((sa.supported_color_modes || []).includes('color_temp')) d.color_temp_kelvin = P[0]; command(eid, 'light', 'turn_on', d, (ns) => ns.state === 'on'); break; }
      case 'light-fx': command(eid, 'light', 'turn_on', { effect: el.dataset.v }, (ns) => ns.attributes.effect === el.dataset.v || ns.state === 'on'); break;
      case 'disco-stop': stopDisco(); break;
      case 'disco-sw': { const i = settings.discoSwitches.indexOf(eid); if (i >= 0) settings.discoSwitches.splice(i, 1); else settings.discoSwitches.push(eid); saveSettings(); schedule(true); break; }
      case 'dismiss-install': store.set('ch.installHintOff', true); schedule(true); break;
      case 'reload': if (C && C.authed) { loadRegistries(C).then(() => C.send({ type: 'get_states' })).then((states) => { S.states = {}; states.forEach((x) => { S.states[x.entity_id] = x; }); modelDirty = true; schedule(true); toast('Reloaded from Home Assistant', 'ok'); }).catch((er) => toast('Reload failed: ' + er.message, 'bad')); } break;
    }
  });
  window.addEventListener('click', (e) => {
    const a = e.target.closest && e.target.closest('a[href^="#"]');
    if (!a || !a.closest('#app')) return;
    e.preventDefault(); e.stopImmediatePropagation();
    if (a.dataset.act === 'clim-open') { settings.climate = a.dataset.eid; saveSettings(); S.sheet = null; }
    const h = a.getAttribute('href'); if (location.hash !== h) location.hash = h; else onRoute();
  }, true);
  document.addEventListener('scroll', (e) => {
    const car = e.target; if (!car.classList || !car.classList.contains('ccar')) return;
    clearTimeout(car._t); car._t = setTimeout(() => {
      const i = Math.round(car.scrollLeft / car.clientWidth); const sl = car.children[i]; if (!sl) return;
      S.climCur = sl.dataset.eid;
      document.querySelectorAll('.cnames .chip').forEach((c) => c.classList.toggle('sel', c.dataset.eid === S.climCur));
      document.querySelectorAll('.cdots i').forEach((d) => d.classList.toggle('on', d.dataset.eid === S.climCur));
    }, 80);
  }, true);
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

})();
