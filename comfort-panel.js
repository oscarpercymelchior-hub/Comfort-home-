/* Comfort Home 1.11.0 — runs on top of Home Assistant at /comfort-home. Does nothing on any other page. */
(function () {
  // Opened from the iPhone home-screen icon but Home Assistant sent us to its own start page after login? Go to Comfort.
  var leave = false; try { leave = !!sessionStorage.getItem('comfortLeave'); } catch (e) { /* */ }
  if (navigator.standalone === true && !leave && !/^\/(comfort-home|auth)(\/|$)/.test(location.pathname)) { location.replace('/comfort-home'); return; }
  if (!/^\/comfort-home(\/|$)/.test(location.pathname) || window.__comfortLoaded) return;
  window.__comfortLoaded = true;
  // Always run the newest version. Phones and tablets can keep an old copy of this file for a long time, so ask GitHub
  // (never cached) which version is current; if this copy is older, load the new file instead of starting.
  var ME = "1.11.0", BASE = window.__COMFORT_BASE || 'https://oscarpercymelchior-hub.github.io/Comfort-home-/';
  if (!window.__comfortFresh) {
    window.__comfortFresh = 1;
    var started = false; var start = function () { if (!started) { started = true; boot(); } };
    try {
      var x = new XMLHttpRequest(); x.open('GET', BASE + 'version.json?t=' + Date.now(), true); x.timeout = 2500;
      x.onload = function () {
        var v = null; try { v = JSON.parse(x.responseText).version; } catch (e) { /* */ }
        if (v && v !== ME && !started) { started = true; window.__comfortLoaded = false; var s = document.createElement('script'); s.src = BASE + 'comfort-panel.js?v=' + encodeURIComponent(v); s.onerror = function () { window.__comfortLoaded = true; boot(); }; document.head.appendChild(s); return; }
        start();
      };
      x.onerror = start; x.ontimeout = start; x.send();
    } catch (e) { start(); }
    setTimeout(start, 3000);
  } else boot();
  function boot() {
  var head = document.head;
  function meta(n, c) { var m = head.querySelector('meta[name="' + n + '"]'); if (!m) { m = document.createElement('meta'); m.name = n; head.appendChild(m); } m.content = c; }
  function link(rel, href, sizes) { var l = document.createElement('link'); l.rel = rel; l.href = href; if (sizes) l.sizes = sizes; head.appendChild(l); }
  // Home-screen app: our own name and icon, and open this page (not the Home Assistant start page)
  head.querySelectorAll('link[rel="manifest"],link[rel="apple-touch-icon"],link[rel="icon"],link[rel="mask-icon"]').forEach(function (l) { l.remove(); });
  meta('apple-mobile-web-app-capable', 'yes'); meta('mobile-web-app-capable', 'yes');
  meta('apple-mobile-web-app-title', 'Comfort'); meta('application-name', 'Comfort'); meta('apple-mobile-web-app-status-bar-style', 'default');
  meta('viewport', 'width=device-width,initial-scale=1,viewport-fit=cover');
  link('apple-touch-icon', "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAALQAAAC0CAIAAACyr5FlAAAACXBIWXMAAAsTAAALEwEAmpwYAAANv0lEQVR4nO3d+XMT5xkH8Pw/CWkCSTlCYgjYxk0ITF3SZpp20k7IMJkmtGlnEhKwTSCAOUx8XyQcwfiAhLiGQhLCYeIYW7csaXWuJMuWZGklWza2JRlLHfkAa/VqpV3J3le7j+b7477PvjPvR7vvu4f0lHP8UWKGkQkkzRDLOGgZm2HIIMvYl2Y0dWxsYn0cf1ohWcbin7H4wmnGzDImil2eAhkgw4SSYUzEAccMOGaY5mTQcYAMkGFalBGHA2SADNMSGU9wgAyQYYqXsYADZIAMU4KMGA6QATJMKBlJcMD1DJFdzzCmiwNkgAwKiQNkgAwKeeQAGSCDQp5WQAbIoJBzDpABMijkhBRkgAwq2WoF7sLDqpVigwOez7CK6XoGMgYvCgfIABkGLwoHyAAZBi8KB8gAGQYvCgfIABkGLwoHyAAZBi8KB8gAGQYvCgfIABkGbzZwwPsmpBCvZ2QBB8ggxSSDBQ6QQYpMRro4QAYpPhlp4QAZpChlpMYBMkixykiBA2SQIpbBhANkkOKWkRQHyCBFL0OPxAEyQIbei8IBMkCGHokDZIAMPRIHyAAZeiQOkAEy9EgcIANk6JE4QAbI0KeFA34PVHxXuvRp4QAZIMOLxAEyQIYXeeQAGSDDizytgAyQ4U0254BfpIcZqJclDvivAovI1ib0eEJoHCDDInoZBBIHyAAZhAeFA2SADAKJA2SADAKJA2SADAKJA2SADAKJA2RYfGGTN1zRTR2+5TF6QyJctRKoPAUyLL6wyjn94XeuoiZbUZPt/W+dsuEgyGCNQ5D/ynnL+PBPFwaLmqyPs+v84A3DhJiPGayPHIKUcUEy+nqzrajRSstrzbb6Hp+YZbDAITwZBk/o0I8j2xpJhhy46SY8IXHKSBeH8GTIh4J7Lg8xy9g2l3c7HH2D0yKUkRYO4cn4QT+x65y9sIFMM78/a79OjItNRmocwpNxXuL/XRNZ2GBhlaImsq6HEpWMFDgEJkPvDZXecBfUWzjn0+su3dwURAwymHAITIbUMb27zZGJjIK5/L11sNc+JQYZSXEITMZN/XjxV9aCOnNWsvMM2akJCF6GDolDSDLMvnDdL1RhvTm/LpspqDOfuO0xeoUsA4FDSDJ0I8FP/uvMrzUvUz66Oqx2BYUqg45DSDIe2Kf+etG2tda0rPnzBdt9clKQMuJwCElG50DgjSbL1hrTCuT1BstlZUB4Mp7gEIyM2CTjvje/diVYbF1Mfo3p+M8LUxDByFjAIRgZWnfwP1eHtlQbeck/rwwpnUHByIjhEIyMHuvk2+etfMnYMpe3zpJ3zZPCkBGPI5dlfKcKvNZgfrXayHuK6s2t8jEByFiCI2dlmH3h2m7PlmrDq1W4ZEuVofzWiN6b2zIWceSsDLVz+oPLjs1VBgyzp21QNjyduzLmcOSsjLvmh7u+tmyuNGCb4jPmn4wTOSojLRx4ymiVjW6rNW6u1GOegmrDuX5fLspIjQNDGSYqXH7LvelLfQ7lwDWnbiSUWzJ0I4w4MJShGp5+v93O+2BvYp/dl2wSx1QOyWDCgaGMO8aJ4mZT3mkiR7Oj0XiTGM8VGUlxYCjjosSfX6XnfYDzMsuWSv1XvVROyNAiceAmw+QNlf/kzqsgBJMDXcNadwhzGQgcuMlQDk/vbrG+UqETWP72Ddk/OIWzDDoO3GT02iZ3NBiWe5yKavS7W8h9nY6y60Nl14f2dTp2t5BFNfrl3u8bDYb75CS2MuJw4CYjdsdEOfryKd1yJK9C92GH7arSb/MFo6hPJBq1UsGrSv/ey/a8imXpw8undJcVo9jKeIIDQxmLOLTZTX4VUXXH5QqEo2l/XIFw5R1XfiWR9c50pI9jxWUs4MBTxjyOjSe1WUxpl8MzzoLF0o9nPFzS5chuf9LFwYeMGA5sZWQXR2E18bM+EM34c4sIFFYRK4qDJxnscKz8+ybfKf0bT2gyzx8aDcnmFhw+NipY3GjISsc6FH5sZbDAwct7rd8q/S+d0GSYN5uNnomkp5JBf6hdSpV2Od79xrKrybiryfjuN5bSLkeHjHL4Q8laeSbCbzYbM+9bOzMOXmWki4OvX1aJ4TiuySTba/XDo+gx7jaO72khmZvvaSG7TePI5g5/6PUafYbdY8LBt4y0cPAlYx7HhuMDnLPxhEY++DBxXJ1joX+0kenX+bDdilzdSO0PN57g3r0NxweS4sBARmocPMqI4VD4N5QPcE7DPXfiiEpsEwVf6tiWKqzUSW0IZ3V33Zn0sF3ux1ZGChz8ysgQR3GDITgzSxvLXy3jeSc13ArmndT0WuinmKnw7M46fTZxYCODCQfvMuZxrC9Xc8sNzShtII0j05srNJwLri9Xv1qhMXmmaWWvqbl3ko4DJxlJceAgYwHHMTWH7KwjZmYjS4cwNBP5Y5OBW7X1S/JWsyH8KK5y+FFkRy3BrVocDsxkaJA4MJFh8YWvKPzrjqk55MwvI7Tv99c9I9xKrUvI+V4PrXhTt5tbqbbHOPCTgcCBjwyLL3xZ4Vt3VMUh9vhLXpOh2fzTGm6l1iWk8EvNVDhuNkN6p7mVapP7sJVBx4GVDPMcjrVHVWyzo46gfbM7lVzqrE2ea2o/bRfba3Qc6sRw4CojDgduMmI45L61R1RsU9Jpp43c3jYyZav8GuU7V+TvXJHnVytSbvzvDittF/u/t3PoapvUh62MJzgwlLGIQ8k2Z3viJhyzkejmk2rmJu91yhoH+5odsTTY+3Z3ypi333JqIG5SGo1+9YubQ1fZ4lhJGQs48JQxj+O3XyjZ5of4RaxrLMS8ffE5+TyLx2ly9BWflTO3Gom/9f+/AT+HrrLCscIyYjiwlcEZR4857tb8wNAk8/YlfRIajmZHX8kDCXMrzfDk0r3cNwWWFcfKy1iCAz8Z8zhePKxgmz4y7jqmzD7BvP0xVX8ijmOqfuZWcvvE0r08IMc5dDVNHLzIWMSBpQzOOLqNcUcOnXOSefuPuxFHjo/vSZhbEa6ppXu5axhbJhx8yZjDgasMzji6VL6lw+Z/OMO8fX61vMEWJ6Pe2re1Ss7camxqZuleOhXUcuDgUUa6OHiRYfaFO+S+Fw7J2ab+jpO2ztx2eoC5yfYm2UntwsnllLZ/e5OMefvXKjW0XdTcHubQ1VZGHPzKSAsHXzI44/hXm4U2cvuvWlO2evGwfGtVLC8eTr2Lsk4bbRd7W83ZxcG7DI07FQ4eZcRwyHxrPpezzebjqvibbtFu4xiHOmuSp8cUN62ZjUTyylUc6rRKfNjKSIGDXxlzOKg1n8s4RDEYt5SYjUR21mi4lVqTkOI6LQ2fxDrOrVSrhMJWBhMO3mXM41h9UMYhR64P0g77P2r93EqtTsgtHf1JkUNddm6lEnHgIyMpDhxkZIJj41FlYPpR4rQgcxkftZlpZcemZl46osgKDqxkDCBxYCJjAUeZlFua79HXLKOTMzuqBjgXXF0m3Vk1EIhfwcYeI709zLngUhy4yUDgwEeG2Rdul1HPl0m55aUjcneA/lLCkD+4qVzJreCmcuWQn/5mlGsstP4LOedOXlrEgaEMOg6sZJiocLuUer5Uyjl7L5kitJun0ejZ+y5u1c4kHIoikegHF02Z9PBSP4WtjDgcuMmYx/FcqSSTtPTS3064TYxyK3VzIO7CazQavfCrO8PuXeqnsJXxBAeGMrKCY81B6X3j2NIRPfXDILdSR67FPUN0zzC65qA0U7tp4uBDxgIOPGXM4fA+V9KfYdYdkv6o8UUisad+uhTeFw5KuNVZXSbp6B95NBuZjUSvq6h1h6SZ962l34utjBgObGXM4/hNSX9W8sox+ctH5ZnXWXtIuuELWbZ6lRoHfzJY41hJGQs4DvQLOC3MOHiVwQ7HCsuYx/HsgT4Bp4UBB98yWOBYeRkxHBLvs/v7BJyWPi+2MtLFwYsMExVuk3hX7e8TcC4iceAhIy0cfMlYwPHZAwHnYiIObGSkxsGjDBMV/lbu4338Vi1nOmQ+bGWkwMGvDBMVvmeeeObTBwLOHdM4tjKYcPAuYz4Fx+XPfNoryBScUOAsIykOTGSYqHDDXdfT+3oFmfp7TpxlqJE48JFhmvtrtPfO6XkfyKeznffO6bUjWMtA4MBKxvyfKuo9oU+uWFZ91vv0vl8FkFWf9e67YtG4g5jLoOPAUMbj3DGOl35v/Uuj7o3TysRsz4W83agt+d76kz6A+dkEgQNnGcL4928dxqvWRBlPcIAMkKFG4gAZIEONxAEyQIY6KQ6YZ8A8w50ZDpiBEiKYgXLBATII8clQu4KpcYAMQpQyUuMAGYRYZaTAATIIEctgwgEyCHHLSIoDZBCil6FC4gAZIEPlQuEAGSBDhcQBMkCGCokDZIAMFRIHyAAZKiQOkAEyVEgcIANkqLKCA57204lGBjscIEMnJhkscIAMnchkpIsDZOjEJyMtHCBDJ0oZqXGADJ1YZaTAATJ0IpbBhANk6MQtIykOkKETvQwlEgfIABlKFwoHyAAZSiQOkAEylEgcIANkKJE4QAbIUCJxgAyQoUTiABkgQ5kVHPBrTFrRyGCHA2RoxSRD6UwbB8jQikxGujhAhlZ8MtLCATK0opSRGgfI0IpVRgocIEMrYhlMOECGVtwykuIAGVrRy1AgcYAMkKFwonCADJChQOIAGSBDgcQBMkCGAokDZIAMBRIHyAAZigQZCmfw/7a3pf7nPKrXAAAAAElFTkSuQmCC", '180x180'); link('icon', "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAALQAAAC0CAIAAACyr5FlAAAACXBIWXMAAAsTAAALEwEAmpwYAAANv0lEQVR4nO3d+XMT5xkH8Pw/CWkCSTlCYgjYxk0ITF3SZpp20k7IMJkmtGlnEhKwTSCAOUx8XyQcwfiAhLiGQhLCYeIYW7csaXWuJMuWZGklWza2JRlLHfkAa/VqpV3J3le7j+b7477PvjPvR7vvu4f0lHP8UWKGkQkkzRDLOGgZm2HIIMvYl2Y0dWxsYn0cf1ohWcbin7H4wmnGzDImil2eAhkgw4SSYUzEAccMOGaY5mTQcYAMkGFalBGHA2SADNMSGU9wgAyQYYqXsYADZIAMU4KMGA6QATJMKBlJcMD1DJFdzzCmiwNkgAwKiQNkgAwKeeQAGSCDQp5WQAbIoJBzDpABMijkhBRkgAwq2WoF7sLDqpVigwOez7CK6XoGMgYvCgfIABkGLwoHyAAZBi8KB8gAGQYvCgfIABkGLwoHyAAZBi8KB8gAGQYvCgfIABkGbzZwwPsmpBCvZ2QBB8ggxSSDBQ6QQYpMRro4QAYpPhlp4QAZpChlpMYBMkixykiBA2SQIpbBhANkkOKWkRQHyCBFL0OPxAEyQIbei8IBMkCGHokDZIAMPRIHyAAZeiQOkAEy9EgcIANk6JE4QAbI0KeFA34PVHxXuvRp4QAZIMOLxAEyQIYXeeQAGSDDizytgAyQ4U0254BfpIcZqJclDvivAovI1ib0eEJoHCDDInoZBBIHyAAZhAeFA2SADAKJA2SADAKJA2SADAKJA2SADAKJA2RYfGGTN1zRTR2+5TF6QyJctRKoPAUyLL6wyjn94XeuoiZbUZPt/W+dsuEgyGCNQ5D/ynnL+PBPFwaLmqyPs+v84A3DhJiPGayPHIKUcUEy+nqzrajRSstrzbb6Hp+YZbDAITwZBk/o0I8j2xpJhhy46SY8IXHKSBeH8GTIh4J7Lg8xy9g2l3c7HH2D0yKUkRYO4cn4QT+x65y9sIFMM78/a79OjItNRmocwpNxXuL/XRNZ2GBhlaImsq6HEpWMFDgEJkPvDZXecBfUWzjn0+su3dwURAwymHAITIbUMb27zZGJjIK5/L11sNc+JQYZSXEITMZN/XjxV9aCOnNWsvMM2akJCF6GDolDSDLMvnDdL1RhvTm/LpspqDOfuO0xeoUsA4FDSDJ0I8FP/uvMrzUvUz66Oqx2BYUqg45DSDIe2Kf+etG2tda0rPnzBdt9clKQMuJwCElG50DgjSbL1hrTCuT1BstlZUB4Mp7gEIyM2CTjvje/diVYbF1Mfo3p+M8LUxDByFjAIRgZWnfwP1eHtlQbeck/rwwpnUHByIjhEIyMHuvk2+etfMnYMpe3zpJ3zZPCkBGPI5dlfKcKvNZgfrXayHuK6s2t8jEByFiCI2dlmH3h2m7PlmrDq1W4ZEuVofzWiN6b2zIWceSsDLVz+oPLjs1VBgyzp21QNjyduzLmcOSsjLvmh7u+tmyuNGCb4jPmn4wTOSojLRx4ymiVjW6rNW6u1GOegmrDuX5fLspIjQNDGSYqXH7LvelLfQ7lwDWnbiSUWzJ0I4w4MJShGp5+v93O+2BvYp/dl2wSx1QOyWDCgaGMO8aJ4mZT3mkiR7Oj0XiTGM8VGUlxYCjjosSfX6XnfYDzMsuWSv1XvVROyNAiceAmw+QNlf/kzqsgBJMDXcNadwhzGQgcuMlQDk/vbrG+UqETWP72Ddk/OIWzDDoO3GT02iZ3NBiWe5yKavS7W8h9nY6y60Nl14f2dTp2t5BFNfrl3u8bDYb75CS2MuJw4CYjdsdEOfryKd1yJK9C92GH7arSb/MFo6hPJBq1UsGrSv/ey/a8imXpw8undJcVo9jKeIIDQxmLOLTZTX4VUXXH5QqEo2l/XIFw5R1XfiWR9c50pI9jxWUs4MBTxjyOjSe1WUxpl8MzzoLF0o9nPFzS5chuf9LFwYeMGA5sZWQXR2E18bM+EM34c4sIFFYRK4qDJxnscKz8+ybfKf0bT2gyzx8aDcnmFhw+NipY3GjISsc6FH5sZbDAwct7rd8q/S+d0GSYN5uNnomkp5JBf6hdSpV2Od79xrKrybiryfjuN5bSLkeHjHL4Q8laeSbCbzYbM+9bOzMOXmWki4OvX1aJ4TiuySTba/XDo+gx7jaO72khmZvvaSG7TePI5g5/6PUafYbdY8LBt4y0cPAlYx7HhuMDnLPxhEY++DBxXJ1joX+0kenX+bDdilzdSO0PN57g3r0NxweS4sBARmocPMqI4VD4N5QPcE7DPXfiiEpsEwVf6tiWKqzUSW0IZ3V33Zn0sF3ux1ZGChz8ysgQR3GDITgzSxvLXy3jeSc13ArmndT0WuinmKnw7M46fTZxYCODCQfvMuZxrC9Xc8sNzShtII0j05srNJwLri9Xv1qhMXmmaWWvqbl3ko4DJxlJceAgYwHHMTWH7KwjZmYjS4cwNBP5Y5OBW7X1S/JWsyH8KK5y+FFkRy3BrVocDsxkaJA4MJFh8YWvKPzrjqk55MwvI7Tv99c9I9xKrUvI+V4PrXhTt5tbqbbHOPCTgcCBjwyLL3xZ4Vt3VMUh9vhLXpOh2fzTGm6l1iWk8EvNVDhuNkN6p7mVapP7sJVBx4GVDPMcjrVHVWyzo46gfbM7lVzqrE2ea2o/bRfba3Qc6sRw4CojDgduMmI45L61R1RsU9Jpp43c3jYyZav8GuU7V+TvXJHnVytSbvzvDittF/u/t3PoapvUh62MJzgwlLGIQ8k2Z3viJhyzkejmk2rmJu91yhoH+5odsTTY+3Z3ypi333JqIG5SGo1+9YubQ1fZ4lhJGQs48JQxj+O3XyjZ5of4RaxrLMS8ffE5+TyLx2ly9BWflTO3Gom/9f+/AT+HrrLCscIyYjiwlcEZR4857tb8wNAk8/YlfRIajmZHX8kDCXMrzfDk0r3cNwWWFcfKy1iCAz8Z8zhePKxgmz4y7jqmzD7BvP0xVX8ijmOqfuZWcvvE0r08IMc5dDVNHLzIWMSBpQzOOLqNcUcOnXOSefuPuxFHjo/vSZhbEa6ppXu5axhbJhx8yZjDgasMzji6VL6lw+Z/OMO8fX61vMEWJ6Pe2re1Ss7camxqZuleOhXUcuDgUUa6OHiRYfaFO+S+Fw7J2ab+jpO2ztx2eoC5yfYm2UntwsnllLZ/e5OMefvXKjW0XdTcHubQ1VZGHPzKSAsHXzI44/hXm4U2cvuvWlO2evGwfGtVLC8eTr2Lsk4bbRd7W83ZxcG7DI07FQ4eZcRwyHxrPpezzebjqvibbtFu4xiHOmuSp8cUN62ZjUTyylUc6rRKfNjKSIGDXxlzOKg1n8s4RDEYt5SYjUR21mi4lVqTkOI6LQ2fxDrOrVSrhMJWBhMO3mXM41h9UMYhR64P0g77P2r93EqtTsgtHf1JkUNddm6lEnHgIyMpDhxkZIJj41FlYPpR4rQgcxkftZlpZcemZl46osgKDqxkDCBxYCJjAUeZlFua79HXLKOTMzuqBjgXXF0m3Vk1EIhfwcYeI709zLngUhy4yUDgwEeG2Rdul1HPl0m55aUjcneA/lLCkD+4qVzJreCmcuWQn/5mlGsstP4LOedOXlrEgaEMOg6sZJiocLuUer5Uyjl7L5kitJun0ejZ+y5u1c4kHIoikegHF02Z9PBSP4WtjDgcuMmYx/FcqSSTtPTS3064TYxyK3VzIO7CazQavfCrO8PuXeqnsJXxBAeGMrKCY81B6X3j2NIRPfXDILdSR67FPUN0zzC65qA0U7tp4uBDxgIOPGXM4fA+V9KfYdYdkv6o8UUisad+uhTeFw5KuNVZXSbp6B95NBuZjUSvq6h1h6SZ962l34utjBgObGXM4/hNSX9W8sox+ctH5ZnXWXtIuuELWbZ6lRoHfzJY41hJGQs4DvQLOC3MOHiVwQ7HCsuYx/HsgT4Bp4UBB98yWOBYeRkxHBLvs/v7BJyWPi+2MtLFwYsMExVuk3hX7e8TcC4iceAhIy0cfMlYwPHZAwHnYiIObGSkxsGjDBMV/lbu4338Vi1nOmQ+bGWkwMGvDBMVvmeeeObTBwLOHdM4tjKYcPAuYz4Fx+XPfNoryBScUOAsIykOTGSYqHDDXdfT+3oFmfp7TpxlqJE48JFhmvtrtPfO6XkfyKeznffO6bUjWMtA4MBKxvyfKuo9oU+uWFZ91vv0vl8FkFWf9e67YtG4g5jLoOPAUMbj3DGOl35v/Uuj7o3TysRsz4W83agt+d76kz6A+dkEgQNnGcL4928dxqvWRBlPcIAMkKFG4gAZIEONxAEyQIY6KQ6YZ8A8w50ZDpiBEiKYgXLBATII8clQu4KpcYAMQpQyUuMAGYRYZaTAATIIEctgwgEyCHHLSIoDZBCil6FC4gAZIEPlQuEAGSBDhcQBMkCGCokDZIAMFRIHyAAZKiQOkAEyVEgcIANkqLKCA57204lGBjscIEMnJhkscIAMnchkpIsDZOjEJyMtHCBDJ0oZqXGADJ1YZaTAATJ0IpbBhANk6MQtIykOkKETvQwlEgfIABlKFwoHyAAZSiQOkAEylEgcIANkKJE4QAbIUCJxgAyQoUTiABkgQ5kVHPBrTFrRyGCHA2RoxSRD6UwbB8jQikxGujhAhlZ8MtLCATK0opSRGgfI0IpVRgocIEMrYhlMOECGVtwykuIAGVrRy1AgcYAMkKFwonCADJChQOIAGSBDgcQBMkCGAokDZIAMBRIHyAAZigQZCmfw/7a3pf7nPKrXAAAAAElFTkSuQmCC");
  function keepTitle() { if (document.title !== 'Comfort') document.title = 'Comfort'; }
  keepTitle(); new MutationObserver(keepTitle).observe(head, { childList: true, subtree: true, characterData: true });
  var st = document.createElement('style'); st.textContent = "/* Comfort Home — design system\n   Inspired by the calm, pastel, card-based look of Panasonic Comfort Cloud. Original branding. */\n:root{\n  --bg:#f2f4f7; --bg2:#e9eef4; --card:#ffffff; --card2:#f7f9fb; --text:#1d2733; --text2:#4a5868; --muted:#8a96a3; --line:#e4e9ef;\n  --accent:#2f86d6; --accent-ink:#ffffff; --accent-soft:#e2effb; --accent-2:#5aa7ea;\n  --ok:#2fa57d; --warn:#e48a3c; --bad:#d9534f;\n  --blue:#e4f0fb; --blue-i:#2f7fc8; --mint:#e1f4ec; --mint-i:#2b9a74; --warm:#fdeedf; --warm-i:#d27a32;\n  --lav:#ece9f8; --lav-i:#6c5fc7; --rose:#fbe8ec; --rose-i:#c8556c; --sand:#faf3dc; --sand-i:#b08a1e;\n  --hero1:#dcecfb; --hero2:#eef6fd; --hero-ink:#173a5e;\n  --shadow:0 1px 2px rgba(20,40,70,.04),0 4px 14px rgba(20,40,70,.06);\n  --shadow-lg:0 10px 40px rgba(20,40,70,.16);\n  --r:20px; --r-sm:14px; --gap:12px; --pad:18px;\n  --nav-h:68px; --safe-b:env(safe-area-inset-bottom,0px); --safe-t:env(safe-area-inset-top,0px); --safe-l:env(safe-area-inset-left,0px); --safe-r:env(safe-area-inset-right,0px);\n  --tog-off:#d5dde6; --scrim:rgba(18,28,40,.32);\n  color-scheme:light;\n}\nhtml[data-theme=\"dark\"]{\n  --bg:#15181d; --bg2:#1b1f25; --card:#1f242b; --card2:#252b33; --text:#e7ebf0; --text2:#b8c1cc; --muted:#8792a0; --line:#2c333c;\n  --accent:#6aa9e6; --accent-ink:#0f1a26; --accent-soft:#22344a; --accent-2:#87bcef;\n  --ok:#5cc39d; --warn:#e8a364; --bad:#e57873;\n  --blue:#1f2d3c; --blue-i:#86b9ea; --mint:#1c2f2a; --mint-i:#7fcfae; --warm:#33281f; --warm-i:#e7ae7c;\n  --lav:#27253a; --lav-i:#aea5ea; --rose:#33232a; --rose-i:#e59aaa; --sand:#2f2b1d; --sand-i:#d6bd70;\n  --hero1:#1d2a39; --hero2:#1a2029; --hero-ink:#dbe8f5;\n  --shadow:0 1px 2px rgba(0,0,0,.2),0 4px 14px rgba(0,0,0,.18);\n  --shadow-lg:0 10px 40px rgba(0,0,0,.5);\n  --tog-off:#3a424d; --scrim:rgba(0,0,0,.5);\n  color-scheme:dark;\n}\n*{box-sizing:border-box;-webkit-tap-highlight-color:transparent}\nhtml,body{margin:0;background:var(--bg);color:var(--text)}\nhtml{transition:background-color .4s;-webkit-text-size-adjust:100%;text-size-adjust:100%}\nbody{font-family:system-ui,-apple-system,\"Segoe UI\",Roboto,\"Helvetica Neue\",Arial,sans-serif;font-size:15px;line-height:1.35;\n  -webkit-font-smoothing:antialiased;text-rendering:optimizeLegibility;overscroll-behavior-y:none;min-height:100vh;min-height:100dvh}\nbutton,input,select{font:inherit;color:inherit}\nbutton{background:none;border:0;padding:0;cursor:pointer;touch-action:manipulation}\nbutton,a,.tile,.room,.chip,nav.bn{-webkit-user-select:none;user-select:none;-webkit-touch-callout:none}\na,button,input,select,label{touch-action:manipulation}\nbutton:focus-visible,input:focus-visible,select:focus-visible,a:focus-visible{outline:2px solid var(--accent);outline-offset:2px}\n.i{width:1em;height:1em;flex:none;fill:none;stroke:currentColor;stroke-width:2;stroke-linecap:round;stroke-linejoin:round}\n.num{font-variant-numeric:tabular-nums;font-feature-settings:\"tnum\"}\n\n#app{max-width:560px;margin:0 auto;min-height:100vh;min-height:100dvh;position:relative}\n#view{padding:calc(var(--safe-t) + 10px) calc(var(--pad) + var(--safe-r)) calc(var(--nav-h) + var(--safe-b) + 24px) calc(var(--pad) + var(--safe-l))}\n.page{animation:pageIn .2s cubic-bezier(.2,.7,.3,1)}\n@keyframes pageIn{from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:none}}\n.page.sub{animation-name:subIn}\n@keyframes subIn{from{opacity:0;transform:translateX(18px)}to{opacity:1;transform:none}}\n\n/* top bar */\n.topbar{display:flex;align-items:center;gap:10px;min-height:52px;margin-bottom:6px}\n.topbar h1{font-size:24px;font-weight:650;letter-spacing:-.01em;margin:0;flex:1}\n.topbar .sub{color:var(--muted);font-size:13px;font-weight:500}\n.iconbtn{width:44px;height:44px;border-radius:50%;display:grid;place-items:center;font-size:20px;color:var(--text2);background:var(--card);box-shadow:var(--shadow);flex:none}\n.iconbtn:active{transform:scale(.94)}\n\n/* connection pill */\n.pill{display:inline-flex;align-items:center;gap:6px;font-size:12px;font-weight:600;padding:5px 10px;border-radius:999px;background:var(--card);color:var(--text2);box-shadow:var(--shadow);white-space:nowrap}\n.pill .dot{width:7px;height:7px;border-radius:50%;background:var(--muted)}\n.pill.connected .dot{background:var(--ok)}\n.pill.connecting .dot,.pill.reconnecting .dot{background:var(--warn);animation:blink 1s infinite}\n.pill.error .dot,.pill.disconnected .dot,.pill.auth_invalid .dot{background:var(--bad)}\n.pill.demo{background:var(--lav);color:var(--lav-i)} .pill.demo .dot{background:var(--lav-i)}\n@keyframes blink{50%{opacity:.3}}\n\n/* sections */\n.sec{margin-top:24px}\n.sec-h{display:flex;align-items:baseline;justify-content:space-between;margin:0 2px 10px}\n.sec-h h2{font-size:16px;font-weight:650;margin:0;letter-spacing:-.005em}\n.sec-h .aux{font-size:13px;color:var(--muted);font-weight:500}\n.sec-h a,.sec-h button.link{font-size:13px;color:var(--accent);font-weight:600;text-decoration:none;padding:6px 0 6px 10px}\n.card{background:var(--card);border-radius:var(--r);box-shadow:var(--shadow)}\n.hint{font-size:13px;color:var(--muted);margin:10px 2px 0}\n\n/* hero */\n.hero{border-radius:24px;padding:20px 20px 18px;background:linear-gradient(160deg,var(--hero1),var(--hero2));color:var(--hero-ink);position:relative;overflow:hidden}\n.hero::after{content:\"\";position:absolute;right:-60px;top:-60px;width:200px;height:200px;border-radius:50%;background:radial-gradient(closest-side,rgba(255,255,255,.55),rgba(255,255,255,0));pointer-events:none}\nhtml[data-theme=\"dark\"] .hero::after{background:radial-gradient(closest-side,rgba(120,170,230,.12),rgba(0,0,0,0))}\n.hero-top{display:flex;justify-content:space-between;align-items:flex-start;gap:10px}\n.greet{font-size:22px;font-weight:650;letter-spacing:-.01em;margin:0}\n.when{font-size:13px;opacity:.75;margin-top:3px;font-weight:500}\n.hero-temp{display:flex;align-items:flex-end;gap:14px;margin-top:18px}\n.bigt{font-weight:250;font-size:76px;line-height:.9;letter-spacing:-.04em}\n.bigt small{font-size:34px;font-weight:300;letter-spacing:-.02em}\n.hero-meta{padding-bottom:6px;font-size:13px;line-height:1.5}\n.hero-meta b{font-weight:650;display:block;font-size:14px}\n.hero-meta span{opacity:.75}\n.status-row{display:flex;flex-wrap:wrap;gap:8px;margin-top:16px}\n.stat{display:inline-flex;align-items:center;gap:6px;font-size:12.5px;font-weight:600;background:rgba(255,255,255,.6);padding:7px 11px;border-radius:999px}\nhtml[data-theme=\"dark\"] .stat{background:rgba(255,255,255,.06)}\n.stat .i{font-size:14px}\n.stat.warn{color:var(--warn)} .stat.bad{color:var(--bad)}\n\n/* room temp cards */\n.rooms-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(148px,1fr));gap:var(--gap)}\n.room{border-radius:var(--r);padding:15px 15px 14px;text-align:left;display:flex;flex-direction:column;gap:2px;min-height:128px;position:relative;transition:transform .15s}\n.room:active{transform:scale(.97)}\n.room .ri{width:34px;height:34px;border-radius:11px;display:grid;place-items:center;font-size:18px;background:rgba(255,255,255,.7);margin-bottom:8px}\nhtml[data-theme=\"dark\"] .room .ri{background:rgba(255,255,255,.07)}\n.room .rn{font-size:14px;font-weight:600;color:var(--text);white-space:nowrap;overflow:hidden;text-overflow:ellipsis;padding-right:26px}\n.room .rt{font-size:30px;font-weight:300;letter-spacing:-.03em;line-height:1.1;color:var(--text)}\n.room .rt small{font-size:17px}\n.room .rh{font-size:12.5px;color:var(--text2);display:flex;align-items:center;gap:4px;font-weight:500}\n.room .trend{position:absolute;top:14px;right:14px;font-size:15px;opacity:.85}\n.room.na .rt{color:var(--muted)}\n.c-blue{background:var(--blue)} .c-blue .ri,.c-blue .trend{color:var(--blue-i)}\n.c-mint{background:var(--mint)} .c-mint .ri,.c-mint .trend{color:var(--mint-i)}\n.c-warm{background:var(--warm)} .c-warm .ri,.c-warm .trend{color:var(--warm-i)}\n.c-lav{background:var(--lav)} .c-lav .ri,.c-lav .trend{color:var(--lav-i)}\n.c-rose{background:var(--rose)} .c-rose .ri,.c-rose .trend{color:var(--rose-i)}\n.c-sand{background:var(--sand)} .c-sand .ri,.c-sand .trend{color:var(--sand-i)}\n\n/* device tiles */\n.tiles{display:grid;grid-template-columns:repeat(auto-fill,minmax(150px,1fr));gap:10px}\n.tile{background:var(--card);border-radius:18px;box-shadow:var(--shadow);padding:12px 12px 12px 14px;display:flex;flex-direction:column;gap:10px;min-height:104px;position:relative;text-align:left;transition:background-color .25s,transform .15s}\n.tile:active{transform:scale(.98)}\n.tile .top{display:flex;align-items:center;justify-content:space-between;gap:6px}\n.dico{width:38px;height:38px;border-radius:12px;display:grid;place-items:center;font-size:19px;background:var(--card2);color:var(--muted);transition:background-color .25s,color .25s;flex:none}\n.tile .tn{font-size:14px;font-weight:600;line-height:1.25;display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;overflow:hidden}\n.tile .ts{font-size:12px;color:var(--muted);font-weight:500;margin-top:2px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}\n.tile.on .dico{background:var(--accent-soft);color:var(--accent)}\n.tile.on .ts{color:var(--accent)}\n.tile.on.k-light .dico{background:var(--sand);color:var(--sand-i)} .tile.on.k-light .ts{color:var(--sand-i)}\n.tile.on.k-plug .dico,.tile.on.k-switch .dico{background:var(--mint);color:var(--mint-i)} .tile.on.k-plug .ts,.tile.on.k-switch .ts{color:var(--mint-i)}\n.tile.on.k-cover .dico{background:var(--lav);color:var(--lav-i)} .tile.on.k-cover .ts{color:var(--lav-i)}\n.tile.on.k-climate .dico{background:var(--blue);color:var(--blue-i)}\n.tile.na{opacity:.6}\n.tile .tbody{display:block;width:100%;text-align:left}\n\n/* toggle */\n.tg{position:relative;width:48px;height:28px;border-radius:999px;background:var(--tog-off);transition:background-color .22s;flex:none}\n.tg::before{content:\"\";position:absolute;inset:-9px -4px}  /* bigger hit area */\n.tg .kn{position:absolute;top:3px;left:3px;width:22px;height:22px;border-radius:50%;background:#fff;box-shadow:0 1px 3px rgba(0,0,0,.25);transition:transform .22s cubic-bezier(.3,.7,.4,1)}\n.tg[aria-checked=\"true\"]{background:var(--accent)}\n.tg[aria-checked=\"true\"] .kn{transform:translateX(20px)}\n.tg.pending .kn{transform:translateX(10px);animation:pulse .8s infinite alternate}\n.tg.pending{background:var(--accent-2)}\n.tg:disabled{opacity:.45}\n@keyframes pulse{to{box-shadow:0 0 0 5px rgba(47,134,214,.18)}}\n.runbtn{height:32px;padding:0 14px;border-radius:999px;background:var(--accent-soft);color:var(--accent);font-weight:650;font-size:13px}\n.runbtn.pending{opacity:.6}\n\n/* chips */\n.chips{display:flex;gap:8px;overflow-x:auto;scrollbar-width:none;margin:0 calc(-1*var(--pad));padding:2px var(--pad) 4px;scroll-snap-type:x proximity}\n.chips::-webkit-scrollbar{display:none}\n.chip{display:inline-flex;align-items:center;gap:7px;white-space:nowrap;height:40px;padding:0 14px 0 10px;border-radius:999px;background:var(--card);box-shadow:var(--shadow);font-size:13.5px;font-weight:600;scroll-snap-align:start;flex:none}\n.chip .i{font-size:16px;color:var(--accent)}\n.chip.on-light .i{color:var(--sand-i)}\n.chip.sel{background:var(--accent);color:var(--accent-ink)} .chip.sel .i{color:inherit}\n.chip .cnt{font-size:12px;opacity:.6;font-weight:600}\n.empty{padding:16px;border-radius:var(--r);background:var(--card);box-shadow:var(--shadow);color:var(--muted);font-size:14px;display:flex;align-items:center;gap:10px}\n.empty .i{font-size:20px}\n\n/* list rows */\n.list{display:flex;flex-direction:column;gap:10px}\n.row{display:flex;align-items:center;gap:12px;background:var(--card);border-radius:18px;box-shadow:var(--shadow);padding:12px 14px;min-height:64px;text-align:left;width:100%}\n.row .rb{flex:1;min-width:0;display:block;text-align:left}\n.row .rn{font-weight:600;font-size:15px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}\n.row .rs{font-size:12.5px;color:var(--muted);font-weight:500;margin-top:2px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}\n.row.on .dico{background:var(--accent-soft);color:var(--accent)}\n.row.on.k-light .dico{background:var(--sand);color:var(--sand-i)}\n.row.on.k-plug .dico,.row.on.k-switch .dico{background:var(--mint);color:var(--mint-i)}\n.row.on.k-cover .dico{background:var(--lav);color:var(--lav-i)}\n.row.na{opacity:.6}\n.star{width:40px;height:40px;display:grid;place-items:center;font-size:18px;color:var(--muted);flex:none;border-radius:50%}\n.star.fav{color:#e9a82b} .star.fav .i{fill:#e9a82b}\n.rvalue{font-size:16px;font-weight:600;white-space:nowrap}\n\n/* rooms list */\n.roomrow{display:flex;align-items:center;gap:14px;padding:14px 14px 14px 14px;border-radius:var(--r);text-align:left;width:100%;transition:transform .15s}\n.roomrow:active{transform:scale(.985)}\n.roomrow .ri{width:46px;height:46px;border-radius:15px;display:grid;place-items:center;font-size:22px;background:rgba(255,255,255,.7);flex:none}\nhtml[data-theme=\"dark\"] .roomrow .ri{background:rgba(255,255,255,.07)}\n.roomrow .rb{flex:1;min-width:0}\n.roomrow .rn{font-size:16px;font-weight:650}\n.roomrow .rs{font-size:12.5px;color:var(--text2);margin-top:3px;font-weight:500}\n.roomrow .rt{font-size:28px;font-weight:300;letter-spacing:-.03em;text-align:right}\n.roomrow .rt small{font-size:15px}\n.roomrow .rh{font-size:12px;color:var(--text2);text-align:right;font-weight:500}\n.roomrow .chev{color:var(--muted);font-size:18px}\n\n/* room detail */\n.rhero{border-radius:24px;padding:20px;display:flex;align-items:center;gap:16px;position:relative}\n.rhero .ri{width:54px;height:54px;border-radius:17px;font-size:26px;display:grid;place-items:center;background:rgba(255,255,255,.7);flex:none}\nhtml[data-theme=\"dark\"] .rhero .ri{background:rgba(255,255,255,.07)}\n.rhero .bigt{font-size:64px;color:var(--text)}\n.rhero .meta{font-size:13px;color:var(--text2);font-weight:500;line-height:1.6}\n.spark{margin-top:4px;width:100%;height:56px;display:block}\n.spark path.l{fill:none;stroke:currentColor;stroke-width:2;stroke-linecap:round;stroke-linejoin:round}\n.spark path.a{fill:currentColor;opacity:.12;stroke:none}\n.kv{display:flex;flex-direction:column}\n.kv .row{min-height:56px}\n\n/* devices page */\n.search{display:flex;align-items:center;gap:10px;height:48px;padding:0 14px;border-radius:16px;background:var(--card);box-shadow:var(--shadow);color:var(--muted)}\n.search input{flex:1;border:0;outline:0;background:transparent;font-size:16px;color:var(--text);min-width:0;height:100%}\n.search .i{font-size:18px}\n.seg{display:flex;background:var(--bg2);border-radius:14px;padding:4px;gap:4px}\n.seg button{flex:1;height:38px;border-radius:11px;font-size:13.5px;font-weight:600;color:var(--text2);display:flex;align-items:center;justify-content:center;gap:6px;transition:background-color .2s,color .2s}\n.seg button.sel{background:var(--card);color:var(--text);box-shadow:var(--shadow)}\n.grp-h{font-size:12.5px;font-weight:700;letter-spacing:.04em;text-transform:uppercase;color:var(--muted);margin:20px 4px 8px}\n.sticky{position:sticky;top:0;z-index:5;background:var(--bg);padding:calc(var(--safe-t) + 4px) var(--pad) 8px;margin:calc(-1*var(--safe-t) - 10px) calc(-1*var(--pad)) 0}\n.sticky .topbar{margin-bottom:8px}\n\n/* climate */\n.clim{padding:20px 18px 22px;text-align:center;position:relative}\n.clim-head{display:flex;align-items:center;justify-content:space-between;gap:10px;text-align:left}\n.clim-head .cn{font-weight:650;font-size:16px}\n.clim-head .cs{font-size:12.5px;color:var(--muted);font-weight:500;margin-top:2px}\n.pwr{width:52px;height:52px;border-radius:50%;display:grid;place-items:center;font-size:22px;background:var(--card2);color:var(--muted);box-shadow:var(--shadow);transition:background-color .25s,color .25s;flex:none}\n.pwr.on{background:var(--accent);color:var(--accent-ink)}\n.pwr.pending{animation:blink 1s infinite}\n.dial{position:relative;width:min(260px,70vw);aspect-ratio:1;margin:14px auto 4px}\n.dial>svg{width:100%;height:100%;display:block}\n.dial .ct .i{font-size:14px}\n.dial .trk{fill:none;stroke:var(--bg2);stroke-width:14;stroke-linecap:round}\n.dial .arc{fill:none;stroke:url(#dg);stroke-width:14;stroke-linecap:round;transition:stroke-dashoffset .35s ease}\n.dial .knob{fill:var(--card);stroke:var(--accent);stroke-width:4;transition:cx .35s,cy .35s}\n.dial .mid{position:absolute;inset:0;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:2px}\n.dial .lbl{font-size:12px;font-weight:600;color:var(--muted);text-transform:uppercase;letter-spacing:.08em}\n.dial .tt{font-size:68px;font-weight:250;letter-spacing:-.04em;line-height:1}\n.dial .tt small{font-size:28px;font-weight:300}\n.dial .ct{font-size:13px;color:var(--text2);font-weight:500;display:flex;align-items:center;gap:4px}\n.dial.off .arc{stroke:var(--muted);opacity:.35}\n.dial.off .tt{color:var(--muted)}\n.dial .sending{font-size:11px;color:var(--accent);font-weight:600;height:14px}\n.steppers{display:flex;align-items:center;justify-content:center;gap:28px;margin-top:4px}\n.step{width:64px;height:64px;border-radius:50%;background:var(--card2);box-shadow:var(--shadow);display:grid;place-items:center;font-size:26px;color:var(--accent);transition:transform .12s}\n.step:active{transform:scale(.92)}\n.step:disabled{opacity:.4}\n.range{width:100%;margin:18px 0 2px;-webkit-appearance:none;appearance:none;height:36px;background:transparent}\n.range::-webkit-slider-runnable-track{height:8px;border-radius:8px;background:linear-gradient(90deg,var(--accent) var(--p,50%),var(--bg2) var(--p,50%))}\n.range::-moz-range-track{height:8px;border-radius:8px;background:var(--bg2)}\n.range::-moz-range-progress{height:8px;border-radius:8px;background:var(--accent)}\n.range::-webkit-slider-thumb{-webkit-appearance:none;width:28px;height:28px;border-radius:50%;background:var(--card);border:3px solid var(--accent);margin-top:-10px;box-shadow:0 2px 6px rgba(0,0,0,.2)}\n.range::-moz-range-thumb{width:22px;height:22px;border-radius:50%;background:var(--card);border:3px solid var(--accent)}\n.range:disabled{opacity:.45}\n.rlab{display:flex;justify-content:space-between;font-size:12px;color:var(--muted);font-weight:500}\n.ctl-card{padding:16px}\n.ctl-card h3{font-size:14px;font-weight:650;margin:0 0 12px;display:flex;align-items:center;gap:8px;color:var(--text2)}\n.modes{display:grid;grid-template-columns:repeat(auto-fit,minmax(64px,1fr));gap:8px}\n.mode{display:flex;flex-direction:column;align-items:center;gap:6px;padding:12px 4px;border-radius:16px;background:var(--card2);font-size:12px;font-weight:600;color:var(--text2);transition:background-color .2s,color .2s;min-height:68px;justify-content:center}\n.mode .i{font-size:22px}\n.mode.sel{background:var(--accent);color:var(--accent-ink)}\n.mode.sel.m-heat{background:#ec8b45;color:#fff} .mode.sel.m-cool{background:#3d93dd;color:#fff} .mode.sel.m-dry{background:#3aa9a0;color:#fff} .mode.sel.m-fan_only{background:#6f9bd0;color:#fff} .mode.sel.m-auto,.mode.sel.m-heat_cool{background:#7c74d6;color:#fff}\n.mode.pending{opacity:.6}\n.fan{display:flex;gap:6px;flex-wrap:wrap}\n.fan button{white-space:nowrap;flex:1 1 auto;min-height:44px;border-radius:13px;background:var(--card2);font-size:13px;font-weight:600;color:var(--text2);padding:0 8px;transition:background-color .2s,color .2s}\n.fan button.sel{background:var(--accent-soft);color:var(--accent);box-shadow:inset 0 0 0 1.5px var(--accent)}\n.fan button.pending{opacity:.6}\n.bars{display:inline-flex;gap:2px;align-items:flex-end;height:14px;margin-right:4px;vertical-align:-2px}\n.bars i{width:3px;border-radius:2px;background:currentColor;opacity:.25}\n.bars i.f{opacity:1}\n.range2{display:grid;grid-template-columns:1fr 1fr;gap:10px;margin-top:14px}\n.mini-step{background:var(--card2);border-radius:16px;padding:10px;display:flex;align-items:center;justify-content:space-between}\n.mini-step button{width:40px;height:40px;border-radius:50%;background:var(--card);display:grid;place-items:center;font-size:18px;color:var(--accent);box-shadow:var(--shadow)}\n.mini-step .v{font-size:20px;font-weight:400}\n.mini-step .l{font-size:11px;color:var(--muted);font-weight:600;text-transform:uppercase}\n.climini{display:flex;align-items:center;gap:14px;padding:16px;text-align:left;width:100%}\n.climini .dico{width:48px;height:48px;border-radius:15px;font-size:22px}\n.climini.on .dico{background:var(--blue);color:var(--blue-i)}\n.climini .t{font-size:28px;font-weight:300;letter-spacing:-.03em;margin-left:auto}\n\n/* settings */\n.set{overflow:hidden}\n.set .it{display:flex;align-items:center;gap:12px;padding:14px 16px;min-height:58px;border-top:1px solid var(--line);width:100%;text-align:left}\n.set .it:first-child{border-top:0}\n.set .it .ic{width:34px;height:34px;border-radius:10px;display:grid;place-items:center;font-size:17px;background:var(--accent-soft);color:var(--accent);flex:none}\n.set .it .lb{flex:1;min-width:0}\n.set .it .lb b{font-weight:600;font-size:15px;display:block}\n.set .it .lb span{font-size:12.5px;color:var(--muted);font-weight:500;display:block;margin-top:2px}\n.set .it select,.set .it input[type=time]{background:var(--card2);border:1px solid var(--line);border-radius:10px;height:40px;padding:0 10px;font-size:16px;max-width:52%}\n.set .blk{padding:14px 16px;border-top:1px solid var(--line)}\n.set .blk:first-child{border-top:0}\n.field{display:flex;flex-direction:column;gap:6px;margin-bottom:12px}\n.field label{font-size:12.5px;font-weight:650;color:var(--text2)}\n.field .inp{display:flex;align-items:center;gap:6px;background:var(--card2);border:1px solid var(--line);border-radius:13px;height:48px;padding:0 6px 0 12px}\n.field .inp:focus-within{border-color:var(--accent)}\n.field input{flex:1;border:0;outline:0;background:transparent;font-size:16px;min-width:0;height:100%}\n.field .help{font-size:12px;color:var(--muted)}\n.btns{display:flex;gap:10px;flex-wrap:wrap}\n.btn{white-space:nowrap;height:46px;padding:0 18px;border-radius:14px;font-weight:650;font-size:14.5px;background:var(--card2);color:var(--text);display:inline-flex;align-items:center;justify-content:center;gap:8px;flex:1}\n.btn.pri{background:var(--accent);color:var(--accent-ink)}\n.btn.danger{color:var(--bad)}\n.btn:disabled{opacity:.5}\n.btn:active{transform:scale(.98)}\n.msg{display:flex;gap:10px;align-items:flex-start;padding:12px 14px;border-radius:14px;font-size:13.5px;font-weight:500;margin-bottom:12px;line-height:1.4}\n.msg .i{font-size:18px;margin-top:1px}\n.msg.bad{background:var(--rose);color:var(--rose-i)} .msg.warn{background:var(--warm);color:var(--warm-i)} .msg.ok{background:var(--mint);color:var(--mint-i)} .msg.info{background:var(--blue);color:var(--blue-i)}\n\n/* banner (connection) */\n.banner{display:flex;align-items:center;gap:10px;padding:12px 14px;border-radius:16px;margin-bottom:12px;font-size:13.5px;font-weight:600}\n.banner .i{font-size:18px}\n.banner .grow{flex:1}\n.banner button{font-weight:700;padding:8px 4px}\n.banner.reconnecting,.banner.connecting{background:var(--warm);color:var(--warm-i)}\n.banner.error,.banner.disconnected,.banner.auth_invalid{background:var(--rose);color:var(--rose-i)}\n.banner.demo{background:var(--lav);color:var(--lav-i)}\n.banner.install{background:var(--blue);color:var(--blue-i);align-items:flex-start}\n.banner.install .grow span{display:block;font-weight:500;margin-top:2px}\n.banner.install .i.share{display:inline-block;vertical-align:-3px}\n.spin{animation:spin 1s linear infinite}\n@keyframes spin{to{transform:rotate(360deg)}}\n\n/* welcome */\n.welcome{padding:26px 22px;text-align:center}\n.welcome .logo{width:76px;height:76px;border-radius:24px;margin:0 auto 14px;display:grid;place-items:center;font-size:36px;background:linear-gradient(160deg,var(--hero1),var(--accent-soft));color:var(--accent)}\n.welcome h2{margin:0 0 6px;font-size:22px}\n.welcome p{color:var(--text2);margin:0 0 18px;font-size:14px}\n\n/* bottom nav */\nnav.bn{position:fixed;left:0;right:0;bottom:0;z-index:20;display:flex;justify-content:center;pointer-events:none}\nnav.bn .in{pointer-events:auto;width:100%;max-width:560px;display:grid;grid-template-columns:repeat(7,1fr);background:var(--card);background:color-mix(in srgb,var(--card) 92%,transparent);backdrop-filter:blur(14px);-webkit-backdrop-filter:blur(14px);border-top:1px solid var(--line);padding:6px calc(2px + var(--safe-r)) calc(6px + var(--safe-b)) calc(2px + var(--safe-l));height:calc(var(--nav-h) + var(--safe-b))}\nnav.bn a{display:flex;flex-direction:column;align-items:center;justify-content:center;gap:3px;text-decoration:none;color:var(--muted);font-size:10.5px;font-weight:600;border-radius:14px;min-height:52px;min-width:0;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;-webkit-tap-highlight-color:transparent}\nnav.bn a .ic{width:46px;height:30px;border-radius:15px;display:grid;place-items:center;font-size:21px;transition:background-color .2s,color .2s}\nnav.bn a.sel{color:var(--accent)}\nnav.bn a.sel .ic{background:var(--accent-soft)}\n\n/* bottom sheet */\n.scrim{position:fixed;inset:0;background:var(--scrim);z-index:40;animation:fade .2s}\n@keyframes fade{from{opacity:0}}\n.sheet{position:fixed;left:0;right:0;bottom:0;z-index:41;margin:0 auto;max-width:560px;background:var(--card);border-radius:26px 26px 0 0;box-shadow:var(--shadow-lg);padding:8px calc(20px + var(--safe-r)) calc(22px + var(--safe-b)) calc(20px + var(--safe-l));max-height:88vh;max-height:88dvh;overflow-y:auto;animation:up .28s cubic-bezier(.2,.8,.3,1)}\n@keyframes up{from{transform:translateY(100%)}}\n.sheet .grab{width:40px;height:5px;border-radius:3px;background:var(--line);margin:4px auto 12px}\n.sheet .sh{display:flex;align-items:center;gap:12px;margin-bottom:16px}\n.sheet .sh .dico{width:48px;height:48px;border-radius:15px;font-size:22px}\n.sheet .sh .t{flex:1;min-width:0}\n.sheet .sh .t b{font-size:18px;font-weight:650;display:block;line-height:1.2}\n.sheet .sh .t span{font-size:13px;color:var(--muted);font-weight:500}\n.sheet.on .sh .dico{background:var(--accent-soft);color:var(--accent)}\n.sheet.on.k-light .sh .dico{background:var(--sand);color:var(--sand-i)}\n.bigtg{display:flex;align-items:center;justify-content:space-between;background:var(--card2);border-radius:18px;padding:14px 16px;margin-bottom:12px;width:100%}\n.bigtg b{font-size:16px;font-weight:650}\n.bigtg .tg{width:58px;height:34px}\n.bigtg .tg .kn{width:28px;height:28px}\n.bigtg .tg[aria-checked=\"true\"] .kn{transform:translateX(24px)}\n.bigtg .tg.pending .kn{transform:translateX(12px)}\n.ctl{background:var(--card2);border-radius:18px;padding:14px 16px;margin-bottom:12px}\n.ctl .hd{display:flex;justify-content:space-between;font-size:13.5px;font-weight:600;color:var(--text2)}\n.ctl .hd b{color:var(--text)}\n.ctl .range{margin:6px 0 0}\n.btnrow{display:flex;gap:10px}\n.btnrow .btn{background:var(--card)}\n.meta-sm{font-size:12px;color:var(--muted);text-align:center;margin-top:8px}\n\n/* toasts */\n#toasts{position:fixed;left:0;right:0;bottom:calc(var(--nav-h) + var(--safe-b) + 12px);z-index:60;display:flex;flex-direction:column;align-items:center;gap:8px;pointer-events:none;padding:0 16px}\n.toast{pointer-events:auto;max-width:520px;width:100%;display:flex;align-items:center;gap:10px;padding:12px 14px;border-radius:16px;background:#26303b;color:#fff;font-size:13.5px;font-weight:500;box-shadow:var(--shadow-lg);animation:up2 .25s ease}\nhtml[data-theme=\"dark\"] .toast{background:#e8edf3;color:#18202a}\n.toast .i{font-size:18px;flex:none}\n.toast.bad .i{color:#ff8f8a} html[data-theme=\"dark\"] .toast.bad .i{color:var(--bad)}\n.toast.ok .i{color:#7fdcb7} html[data-theme=\"dark\"] .toast.ok .i{color:#21905f}\n.toast.out{opacity:0;transform:translateY(8px);transition:.25s}\n@keyframes up2{from{opacity:0;transform:translateY(10px)}}\n\n/* skeleton */\n.skel{background:linear-gradient(90deg,var(--card) 0,var(--card2) 50%,var(--card) 100%);background-size:200% 100%;animation:sk 1.2s infinite;border-radius:var(--r);min-height:128px}\n@keyframes sk{to{background-position:-200% 0}}\n\n@media (max-width:360px){\n  :root{--pad:14px;--gap:10px}\n  .bigt{font-size:64px}\n  .dial .tt{font-size:58px}\n  .tiles{grid-template-columns:1fr 1fr}\n  .rooms-grid{grid-template-columns:1fr 1fr}\n  .room{min-height:118px;padding:13px}\n  .room .rt{font-size:26px}\n  .tile{padding:11px}\n}\n@media (min-width:480px){ .tiles{grid-template-columns:repeat(3,1fr)} }\n@media (prefers-reduced-motion:reduce){*{animation-duration:.01ms!important;transition-duration:.01ms!important}}\n.welcome .btn{flex:none;width:100%}\n\n/* disco */\n.disco{padding:26px 18px 20px;text-align:center}\n.discobtn{width:min(220px,62vw);aspect-ratio:1;border-radius:50%;padding:10px;position:relative;overflow:hidden;box-shadow:0 12px 40px rgba(120,80,220,.25);display:inline-grid;place-items:center;transition:transform .15s;isolation:isolate}\n.discobtn::before{content:\"\";position:absolute;inset:-20%;background:conic-gradient(#ff5f6d,#ffc371,#47e891,#4fc3f7,#a66cff,#ff5f6d);z-index:-1}\n.discobtn.on::before{animation:discospin 2.4s linear infinite}\n.discobtn:active{transform:scale(.96)}\n.discobtn:disabled{filter:grayscale(1);opacity:.5}\n.discoin{width:100%;height:100%;border-radius:50%;background:var(--card);display:flex;flex-direction:column;align-items:center;justify-content:center;gap:4px}\n.discoin .dt{font-size:46px;font-weight:300;color:var(--text);line-height:1}\n.discoin .dt .i{font-size:46px;color:#a66cff}\n.discoin .dl{font-size:13px;font-weight:650;color:var(--text2)}\n.dp{color:var(--text2);font-size:14px;margin:16px 4px 0;line-height:1.45}\n@keyframes discospin{to{transform:rotate(360deg)}}\n.chk{width:26px;height:26px;border-radius:8px;border:2px solid var(--line);display:grid;place-items:center;color:#fff;font-size:16px;flex:none}\n.chk.on{background:var(--accent);border-color:var(--accent)}\nnav.bn a{font-size:10.5px}\nnav.bn a .ic{width:44px}\n\n/* ===== 1.5 polish ===== */\n:root{--r:22px;--shadow:0 1px 2px rgba(20,40,70,.04),0 6px 20px rgba(20,40,70,.06)}\nhtml[data-theme=\"dark\"]{--shadow:0 1px 2px rgba(0,0,0,.25),0 6px 20px rgba(0,0,0,.22)}\nbody{background:radial-gradient(1200px 500px at 50% -200px,var(--hero1),transparent 70%) no-repeat,var(--bg)}\n.sec{margin-top:28px}\n.sec-h h2{font-size:17px;display:flex;align-items:center;gap:8px}\n.sec-h h2 .aux{font-size:13px;font-weight:600;background:var(--card2);padding:2px 9px;border-radius:999px}\n.sec-h button.link{font-size:13px;color:var(--accent);font-weight:650;padding:8px 0 8px 10px}\n.hero{border-radius:28px;padding:22px 22px 20px;box-shadow:0 10px 30px rgba(47,134,214,.10)}\nhtml[data-theme=\"dark\"] .hero{box-shadow:none}\n.hero::before{content:\"\";position:absolute;left:-40px;bottom:-70px;width:180px;height:180px;border-radius:50%;background:radial-gradient(closest-side,rgba(120,210,180,.28),transparent);pointer-events:none}\n.tile{border-radius:20px;min-height:110px}\n.dico{width:40px;height:40px;border-radius:13px}\n.room{border-radius:22px}\n.room .ri{border-radius:12px}\n.row{border-radius:20px}\nnav.bn .in{border-top:0;border-radius:24px 24px 0 0;box-shadow:0 -6px 24px rgba(20,40,70,.08)}\nhtml[data-theme=\"dark\"] nav.bn .in{box-shadow:0 -6px 24px rgba(0,0,0,.35)}\nnav.bn a.sel .ic{background:var(--accent-soft);transform:translateY(-1px)}\nnav.bn a .ic{transition:background-color .2s,transform .2s}\n.topbar h1{font-size:26px}\n/* climate carousel */\n.ccar{display:flex;gap:14px;overflow-x:auto;scroll-snap-type:x mandatory;scrollbar-width:none;margin:0 calc(-1*var(--pad));padding:2px var(--pad) 8px;scroll-padding:0 var(--pad);-webkit-overflow-scrolling:touch}\n.ccar::-webkit-scrollbar{display:none}\n.cslide{flex:0 0 100%;scroll-snap-align:center;scroll-snap-stop:always;min-width:0}\n.cslide>.sec:first-of-type{margin-top:14px}\n.cdots{display:flex;justify-content:center;gap:7px;margin-top:6px}\n.cdots i{width:7px;height:7px;border-radius:4px;background:var(--line);transition:width .25s,background-color .25s}\n.cdots i.on{width:22px;background:var(--accent)}\n.clim-head{flex-wrap:wrap}\n.mainstar{display:inline-flex;align-items:center;gap:5px;height:34px;padding:0 12px;border-radius:999px;background:var(--card2);color:var(--muted);font-size:12px;font-weight:650;margin-left:auto;margin-right:8px}\n.mainstar.on{color:#d99a1f;background:var(--sand)} .mainstar.on .i{fill:#e9a82b}\n.mainstar:disabled{opacity:1}\n/* light options */\n.swatches{display:grid;grid-template-columns:repeat(9,1fr);gap:8px;margin-top:10px}\n.sw{aspect-ratio:1;border-radius:50%;background:hsl(var(--h),85%,58%);box-shadow:inset 0 0 0 2px rgba(255,255,255,.6);transition:transform .15s}\n.sw.white{background:linear-gradient(135deg,#fff6e5,#ffffff,#e8f2ff);box-shadow:inset 0 0 0 1.5px var(--line)}\n.sw.sel{transform:scale(1.12);box-shadow:0 0 0 3px var(--card),0 0 0 5px var(--accent)}\n.sw:active{transform:scale(.92)}\n.moods{display:grid;grid-template-columns:repeat(4,1fr);gap:8px;margin-top:10px}\n.moods button{display:flex;flex-direction:column;align-items:center;gap:5px;padding:10px 4px;border-radius:14px;background:var(--card);font-size:12px;font-weight:650;color:var(--text2);min-height:62px;justify-content:center}\n.moods button .i{font-size:19px;color:var(--accent)}\n.moods button:active{transform:scale(.96)}\n@media (max-width:360px){.swatches{grid-template-columns:repeat(5,1fr)}}\n\n/* ---- 1.6: Set time + HA menu + speed ---- */\n@media (max-width:370px){nav.bn a{font-size:9.5px}nav.bn a .ic{width:38px;font-size:19px}}\n.hero-r{display:flex;align-items:center;gap:8px;flex:none}\n.iconbtn{width:38px;height:38px;border-radius:12px;display:grid;place-items:center;font-size:18px;background:rgba(255,255,255,.18);color:inherit;transition:transform .12s,background-color .2s}\n.iconbtn:active{transform:scale(.92)}\n.list,.grid,.rooms{content-visibility:auto;contain-intrinsic-size:auto 400px}\n.tile,.room,.row,.trow,.btn,.chip{transition:transform .12s ease,background-color .2s,box-shadow .2s}\n.tile:active,.room:active,.trow:active,.btn:active{transform:scale(.97)}\n.tnext{display:grid;grid-template-columns:auto 1fr;grid-template-areas:\"l l\" \"t n\" \"t i\";column-gap:16px;align-items:center;padding:18px 20px;border-radius:24px;margin-bottom:18px;color:#fff;background:linear-gradient(135deg,#3b82f6,#7c5cff);box-shadow:0 10px 28px -12px rgba(80,90,255,.55)}\n.tnext .tl{grid-area:l;font-size:12px;font-weight:700;text-transform:uppercase;letter-spacing:.08em;opacity:.8;margin-bottom:4px}\n.tnext .tt{grid-area:t;font-size:44px;font-weight:700;line-height:1;letter-spacing:-.02em}\n.tnext .tn{grid-area:n;font-weight:650;font-size:15px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}\n.tnext .ti{grid-area:i;font-size:13px;opacity:.85}\n.trow{display:flex;align-items:center;gap:10px;background:var(--card);border-radius:20px;padding:12px 14px 12px 6px;box-shadow:var(--shadow);margin-bottom:10px}\n.trow.off{opacity:.55}\n.tmainb{flex:1;display:flex;align-items:center;gap:12px;min-width:0;text-align:left;padding-left:8px}\n.ttime{font-size:30px;font-weight:700;letter-spacing:-.02em;min-width:86px;line-height:1}\n.ttime small{font-size:12px;color:var(--muted);margin-left:3px;font-weight:600}\n.tmain{display:flex;flex-direction:column;gap:5px;min-width:0;flex:1}\n.tname{font-weight:650;font-size:14.5px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}\n.tdays{display:flex;gap:3px}\n.tdays i{font-style:normal;font-size:10.5px;font-weight:700;width:21px;height:19px;border-radius:6px;display:grid;place-items:center;color:var(--muted);background:var(--bg2);text-transform:capitalize}\n.tdays i.on{background:var(--accent-soft);color:var(--accent)}\n.tact{display:flex;align-items:center;gap:6px;min-width:0}\n.apill{font-size:11px;font-weight:700;padding:2px 8px;border-radius:999px;flex:none}\n.apill.on{background:var(--mint);color:var(--mint-i)} .apill.off{background:var(--bg2);color:var(--text2)} .apill.toggle,.apill.run,.apill.mixed{background:var(--blue);color:var(--blue-i)}\n.tents{font-size:12px;color:var(--muted);overflow:hidden;text-overflow:ellipsis;white-space:nowrap}\n.fab{position:fixed;right:calc(18px + var(--safe-r));bottom:calc(var(--nav-h) + var(--safe-b) + 16px);z-index:19;width:58px;height:58px;border-radius:20px;display:grid;place-items:center;font-size:26px;color:#fff;background:linear-gradient(135deg,#3b82f6,#7c5cff);box-shadow:0 10px 24px -8px rgba(80,90,255,.6);transition:transform .15s}\n.fab:active{transform:scale(.9)} .fab[disabled]{opacity:.4}\n@media (min-width:600px){.fab{right:calc(50% - 262px)}}\n.tform .tbig{display:block;width:100%;text-align:center;font-size:52px;font-weight:700;border:0;background:var(--card2);border-radius:20px;padding:14px 0;color:var(--text);font-family:inherit;letter-spacing:-.02em}\n.dsel{display:grid;grid-template-columns:repeat(7,1fr);gap:6px;margin-top:8px}\n.dsel button{height:40px;border-radius:12px;font-weight:700;font-size:13px;background:var(--card);color:var(--text2);text-transform:capitalize;transition:background-color .15s,color .15s}\n.dsel button.on{background:var(--accent);color:#fff}\n.dpre{display:flex;gap:6px;margin-top:8px;flex-wrap:wrap}\n.dpre button{font-size:12px;font-weight:600;padding:6px 10px;border-radius:999px;background:var(--card);color:var(--text2)}\n.tents-list{max-height:260px;overflow-y:auto;margin-top:8px;border-radius:14px;background:var(--card)}\n.tents-list .it{display:flex;align-items:center;gap:12px;padding:10px 12px;width:100%;text-align:left;border-top:1px solid var(--line)}\n.tents-list .it:first-child{border-top:0}\n.tents-list .it .ic{width:32px;height:32px;border-radius:10px;display:grid;place-items:center;background:var(--bg2);color:var(--text2);flex:none}\n.tents-list .it.sel .ic{background:var(--accent-soft);color:var(--accent)}\n.tents-list .it .lb{flex:1;min-width:0} .tents-list .it .lb b{display:block;font-size:14px;font-weight:600} .tents-list .it .lb span{display:block;font-size:12px;color:var(--muted)}\n.tform .btns{display:flex;gap:10px;margin-top:6px} .tform .btns .btn{flex:1}\n.tform .ctl{margin-bottom:12px}\n.hero-r .iconbtn{position:relative;z-index:1;background:rgba(255,255,255,.35)} html[data-theme=\"dark\"] .hero-r .iconbtn{background:rgba(255,255,255,.12)}\n.tpage{padding-bottom:84px}\n\n/* ---- 1.7: climate home, info, polish ---- */\n@keyframes rise{from{opacity:0;transform:translateY(10px) scale(.985)}to{opacity:1;transform:none}}\n.page>.sec,.page>.card,.page>.chome,.ccards>*,.tiles>*,.rooms-grid>*,.ilist>*:nth-child(-n+12){animation:rise .32s cubic-bezier(.2,.8,.3,1) both}\n.page>*:nth-child(2){animation-delay:.03s}.page>*:nth-child(3){animation-delay:.06s}.page>*:nth-child(4){animation-delay:.09s}.page>*:nth-child(5){animation-delay:.12s}\n.ccards>*:nth-child(2),.tiles>*:nth-child(2),.rooms-grid>*:nth-child(2){animation-delay:.04s}.ccards>*:nth-child(3),.tiles>*:nth-child(3),.rooms-grid>*:nth-child(3){animation-delay:.08s}.ccards>*:nth-child(4),.tiles>*:nth-child(4),.rooms-grid>*:nth-child(4){animation-delay:.12s}\n@media (prefers-reduced-motion:reduce){*{animation:none!important;transition:none!important}}\n.habtn{display:inline-flex;align-items:center;gap:6px;height:34px;padding:0 12px;border-radius:999px;font-weight:700;font-size:13px;background:rgba(255,255,255,.4);color:inherit;position:relative;z-index:1;transition:transform .12s}\n.habtn:active{transform:scale(.94)} html[data-theme=\"dark\"] .habtn{background:rgba(255,255,255,.12)}\n.cstrip{display:grid;grid-template-columns:repeat(auto-fit,minmax(72px,1fr));gap:8px;text-decoration:none;color:inherit}\n.csi{position:relative;display:flex;flex-direction:column;gap:2px;padding:12px;border-radius:18px;background:var(--card);box-shadow:var(--shadow);border-bottom:3px solid var(--tc)}\n.csi b{font-size:12.5px;font-weight:650;color:var(--text2);white-space:nowrap;overflow:hidden;text-overflow:ellipsis}\n.csi .num{font-size:22px;font-weight:700;color:var(--tc)} .csi .num small{font-size:13px}\n.csi i{position:absolute;top:10px;right:10px;font-size:14px;color:var(--accent);font-style:normal}\n.chome{display:block;text-decoration:none;color:#fff;border-radius:28px;padding:20px;position:relative;overflow:hidden;background:linear-gradient(145deg,#2563eb 0%,#7c3aed 100%);box-shadow:0 18px 40px -18px rgba(76,70,230,.65);transition:transform .15s}\n.chome:active{transform:scale(.985)}\n.chome::before{content:\"\";position:absolute;width:240px;height:240px;right:-70px;top:-90px;border-radius:50%;background:radial-gradient(closest-side,var(--tc),transparent);opacity:.55;transition:background .6s}\n.ch-top{display:flex;justify-content:space-between;align-items:center;position:relative}\n.ch-l{display:flex;align-items:center;gap:6px;font-size:13px;font-weight:700;text-transform:uppercase;letter-spacing:.06em;opacity:.9}\n.ch-on{font-size:12.5px;font-weight:700;padding:4px 10px;border-radius:999px;background:rgba(255,255,255,.18)}\n.ch-mid{display:flex;align-items:flex-end;gap:16px;margin:6px 0 14px;position:relative}\n.chome .bigt{color:#fff}\n.ch-meta{display:flex;flex-direction:column;gap:4px;padding-bottom:12px;font-size:13.5px;font-weight:600;opacity:.92}\n.ch-meta span{display:flex;align-items:center;gap:6px}\n.ch-rooms{display:grid;grid-template-columns:repeat(auto-fit,minmax(64px,1fr));gap:8px;position:relative}\n.chr{display:flex;flex-direction:column;padding:10px;border-radius:16px;background:rgba(255,255,255,.14);backdrop-filter:blur(6px);-webkit-backdrop-filter:blur(6px);border:1px solid rgba(255,255,255,.12)}\n.chr.on{background:rgba(255,255,255,.26)}\n.chr b{font-size:12px;font-weight:650;opacity:.9;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}\n.chr .num{font-size:20px;font-weight:700} .chr .num small{font-size:12px}\n.ch-foot{display:flex;justify-content:space-between;align-items:center;margin-top:14px;font-size:13px;font-weight:600;opacity:.9;position:relative}\n.ccards{display:grid;grid-template-columns:1fr 1fr;gap:12px}\n.ccard{position:relative;background:var(--card);border-radius:22px;padding:14px 14px 10px;box-shadow:var(--shadow);cursor:pointer;overflow:hidden;transition:transform .12s,box-shadow .2s}\n.ccard:active{transform:scale(.97)}\n.ccard::after{content:\"\";position:absolute;inset:0 0 auto 0;height:4px;background:var(--tc);opacity:.85}\n.ccard.on{box-shadow:0 0 0 2px var(--accent-soft),var(--shadow)}\n.ccard.na{opacity:.55}\n.cc-h{display:flex;justify-content:space-between;align-items:center;gap:6px}\n.cc-h b{font-size:15px;font-weight:650;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}\n.pwr.sm{width:34px;height:34px;font-size:16px;border-radius:12px}\n.cc-t{font-size:32px;font-weight:700;color:var(--tc);margin-top:4px;line-height:1.1;transition:color .6s} .cc-t small{font-size:16px}\n.cc-s{font-size:12px;color:var(--muted);font-weight:600;margin:2px 0 4px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}\n.ccard.on .cc-s{color:var(--accent)}\n.mspark{display:block;width:100%;height:34px;color:var(--tc)} .mspark-e{height:34px}\n.mspark .a{fill:currentColor;opacity:.14} .mspark .l{fill:none;stroke:currentColor;stroke-width:2;stroke-linejoin:round;stroke-linecap:round}\n.rtemp{display:flex;align-items:center;gap:14px;background:var(--card);border-radius:22px;padding:14px 16px;box-shadow:var(--shadow);margin-bottom:12px;border-left:4px solid var(--tc)}\n.rtemp>div{display:flex;flex-direction:column;flex:none}\n.rtemp .lbl{font-size:12px;font-weight:700;color:var(--muted);text-transform:uppercase;letter-spacing:.05em}\n.rtemp .v{font-size:30px;font-weight:700;color:var(--tc)} .rtemp .v small{font-size:15px}\n.rtemp .src{font-size:12px;color:var(--muted)} .rtemp .mspark{flex:1;height:44px}\n.gmembers{display:grid;grid-template-columns:repeat(auto-fit,minmax(70px,1fr));gap:8px;margin-top:14px}\n.gm{display:flex;flex-direction:column;align-items:flex-start;padding:10px;border-radius:14px;background:var(--card2);text-align:left}\n.gm b{font-size:12px;font-weight:650;color:var(--text2)} .gm .num{font-size:17px;font-weight:700} .gm small{font-size:11px;color:var(--muted);font-weight:600}\n.gm.on{background:var(--accent-soft)} .gm.on small{color:var(--accent)}\n.tstrip{display:flex;gap:8px;overflow-x:auto;margin:10px -2px 4px;padding:2px 2px 6px;scrollbar-width:none} .tstrip::-webkit-scrollbar{display:none}\n.tsi{flex:none;display:flex;flex-direction:column;align-items:flex-start;min-width:86px;padding:10px 12px;border-radius:16px;background:var(--card);box-shadow:var(--shadow);border-bottom:3px solid var(--tc)}\n.tsn{font-size:12px;font-weight:650;color:var(--text2)} .tsv{font-size:20px;font-weight:700;color:var(--tc)} .tsv small{font-size:12px}\n.tsh{font-size:11px;color:var(--muted);display:flex;align-items:center;gap:2px}\n.grp-h{display:flex;justify-content:space-between;align-items:center}\n.grp-t{display:inline-flex;align-items:center;gap:3px;font-weight:700;text-transform:none;letter-spacing:0}\na.row{text-decoration:none;color:inherit}\n.irow .rb{display:flex;flex-direction:column;min-width:0;flex:1}\n.irow .rn{white-space:nowrap;overflow:hidden;text-overflow:ellipsis}\n.irow .rs{font-size:11.5px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}\n.irow .rvalue{max-width:42%;text-align:right;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}\n.ilist{content-visibility:visible}\n.ihero{display:flex;align-items:center;gap:14px;background:linear-gradient(135deg,var(--card),var(--card2));border-radius:24px;padding:18px;box-shadow:var(--shadow);margin-bottom:14px}\n.ihero .dico{width:52px;height:52px;font-size:24px;border-radius:16px;flex:none;background:var(--accent-soft);color:var(--accent)}\n.ih-b{flex:1;min-width:0} .ih-v{font-size:28px;font-weight:700;line-height:1.15;word-break:break-word} .ih-s{font-size:12.5px;color:var(--muted);margin-top:2px}\n.ihero.na .ih-v{color:var(--muted)}\n.icard{margin-bottom:14px;padding:16px}\n.icard h3{display:flex;align-items:center;gap:8px;font-size:15px;font-weight:650;margin:0 0 10px}\n.ic-h{display:flex;justify-content:space-between;align-items:center;margin-bottom:8px} .ic-h h3{margin:0}\n.seg.sm button{height:30px;font-size:12px;padding:0 10px}\n.chart{position:relative}\n.chart svg{display:block;width:100%;height:150px;color:var(--accent)}\n.chart .a{fill:currentColor;opacity:.12} .chart .l{fill:none;stroke:currentColor;stroke-width:2.2;stroke-linejoin:round}\n.chart .grid line{stroke:var(--line);stroke-dasharray:3 4}\n.ylab{position:absolute;inset:4px auto 4px 4px;display:flex;flex-direction:column;justify-content:space-between;font-size:10.5px;font-weight:700;color:var(--muted);pointer-events:none}\n.ylab span{background:color-mix(in srgb,var(--card) 80%,transparent);padding:0 3px;border-radius:4px}\n.xlab{display:flex;justify-content:space-between;font-size:10.5px;color:var(--muted);font-weight:600;margin-top:4px}\n.cstats{display:grid;grid-template-columns:repeat(3,1fr);gap:8px;margin-top:12px}\n.cstats span{background:var(--card2);border-radius:12px;padding:8px 10px;font-weight:700;font-size:14px}\n.cstats small{display:block;font-size:10.5px;color:var(--muted);font-weight:700;text-transform:uppercase}\n.tline{position:relative;height:28px;border-radius:10px;background:var(--bg2);overflow:hidden}\n.tline i{position:absolute;top:0;bottom:0}\n.tleg{display:flex;flex-wrap:wrap;gap:8px 14px;margin-top:10px;font-size:12.5px;color:var(--text2)}\n.tleg span{display:flex;align-items:center;gap:6px} .tleg i{width:10px;height:10px;border-radius:3px;display:inline-block}\n.kv{display:grid;grid-template-columns:minmax(90px,38%) 1fr;gap:0;margin:0;font-size:13.5px}\n.kv dt{color:var(--muted);font-weight:600;padding:8px 8px 8px 0;border-top:1px solid var(--line)}\n.kv dd{margin:0;padding:8px 0;border-top:1px solid var(--line);word-break:break-word;font-weight:550}\n.kv dt:first-of-type,.kv dd:first-of-type{border-top:0}\n.ic-sub{font-size:12px;font-weight:700;color:var(--muted);text-transform:uppercase;letter-spacing:.05em;margin:14px 0 8px}\n.hagrid{display:grid;grid-template-columns:1fr 1fr;gap:10px;margin-bottom:12px}\n.hat{display:flex;flex-direction:column;align-items:flex-start;gap:4px;padding:16px;border-radius:20px;color:#fff;text-align:left;min-height:104px;transition:transform .12s;box-shadow:0 10px 24px -14px rgba(0,0,0,.45)}\n.hat:active{transform:scale(.96)}\n.hat .hi{width:36px;height:36px;border-radius:12px;display:grid;place-items:center;background:rgba(255,255,255,.22);font-size:19px;margin-bottom:auto}\n.hat b{font-size:15px;font-weight:700} .hat small{font-size:11.5px;opacity:.85;font-weight:600}\n.hat.c0{background:linear-gradient(135deg,#3b82f6,#6366f1)}.hat.c1{background:linear-gradient(135deg,#10b981,#059669)}.hat.c2{background:linear-gradient(135deg,#f59e0b,#ef4444)}.hat.c3{background:linear-gradient(135deg,#8b5cf6,#d946ef)}.hat.c4{background:linear-gradient(135deg,#06b6d4,#3b82f6)}\n.seg.sm button{white-space:nowrap}\n.page.sub .topbar h1{font-size:22px;line-height:1.2;overflow:hidden;text-overflow:ellipsis;display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical}\n/* ---- 1.8 ---- */\n.cfoot{margin-top:22px}\n.heatbtn{display:flex;align-items:center;gap:12px;width:100%;text-align:left;padding:14px 16px;border-radius:22px;background:linear-gradient(135deg,#fff3e6,#ffe4cc);color:#7a3b06;box-shadow:var(--shadow);transition:transform .12s}\nhtml[data-theme=\"dark\"] .heatbtn{background:linear-gradient(135deg,#3a2716,#2c1d10);color:#ffc58f}\n.heatbtn:active{transform:scale(.98)}\n.hb-i{width:42px;height:42px;border-radius:14px;display:grid;place-items:center;font-size:21px;background:linear-gradient(135deg,#fb923c,#ef4444);color:#fff;flex:none}\n.hb-t{flex:1;min-width:0;display:flex;flex-direction:column} .hb-t b{font-size:15px} .hb-t span{font-size:12.5px;opacity:.8;font-weight:600}\n.hb-x{display:flex;align-items:center;gap:2px;font-size:12px;font-weight:700;opacity:.85;white-space:nowrap}\n.cf-row{display:grid;grid-template-columns:1fr 1fr;gap:10px;margin-top:10px}\n.cf-row .btn{background:var(--card);box-shadow:var(--shadow);text-decoration:none;color:var(--text);justify-content:center}\n.gpre{display:flex;gap:8px;margin-top:14px;justify-content:center;flex-wrap:wrap}\n.gpre button{min-width:52px;height:38px;border-radius:12px;background:var(--card2);font-weight:700;font-size:14px;color:var(--text2);transition:background-color .15s,color .15s,transform .12s}\n.gpre button:active{transform:scale(.94)} .gpre button.sel{background:var(--accent);color:#fff}\n.cf-row{grid-template-columns:minmax(0,1fr) minmax(0,1fr)}\n.cf-row .btn{min-width:0;font-size:13.5px;white-space:normal;line-height:1.2;text-align:center;padding:0 10px}\n.cf-row .btn:only-child{grid-column:1/-1}\n.hb-x{max-width:38%;white-space:normal;text-align:right;line-height:1.2}\n@media (max-width:400px){.hb-x{font-size:0}.hb-x svg{font-size:18px}}\n@media (max-width:420px){nav.bn a{font-size:9.8px;letter-spacing:-.01em}}\n\n/* ===== 1.9: Automations tab (new, separate) ===== */\n.astats{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:10px;margin-bottom:6px}\n.as{background:var(--card);border-radius:18px;padding:12px 14px;box-shadow:var(--shadow);display:flex;flex-direction:column}\n.as b{font-size:26px;font-weight:700;line-height:1.1} .as span{font-size:12px;font-weight:650;color:var(--muted)}\n.as.on b{color:var(--accent)} .as.off b{color:var(--text2)}\n.atools{display:flex;flex-direction:column;gap:10px;margin-bottom:12px}\n.atools .search{margin:0}\n.agrid{display:grid;grid-template-columns:minmax(0,1fr);gap:12px}\n.acard{background:var(--card);border-radius:22px;padding:16px;box-shadow:var(--shadow);display:flex;flex-direction:column;gap:10px;border:1px solid transparent;transition:transform .15s,box-shadow .2s,opacity .2s,border-color .2s;animation:rise .32s cubic-bezier(.2,.8,.3,1) both}\n.acard.off{opacity:.78} .acard.run{border-color:var(--accent-soft)}\n.acard:hover{box-shadow:var(--shadow-lg)}\n.ac-h{display:flex;align-items:center;gap:12px}\n.ac-dot{width:12px;height:12px;border-radius:50%;flex:none;background:var(--muted);box-shadow:0 0 0 4px color-mix(in srgb,var(--muted) 18%,transparent);transition:background-color .3s,box-shadow .3s}\n.acard.on .ac-dot{background:#22c55e;box-shadow:0 0 0 4px rgba(34,197,94,.18)}\n.acard.run .ac-dot{background:var(--accent);animation:apulse 1.4s ease-in-out infinite}\n@keyframes apulse{0%,100%{box-shadow:0 0 0 3px color-mix(in srgb,var(--accent) 30%,transparent)}50%{box-shadow:0 0 0 8px color-mix(in srgb,var(--accent) 6%,transparent)}}\n.ac-t{flex:1;min-width:0} .ac-t h3{margin:0;font-size:15.5px;font-weight:650;line-height:1.25;overflow-wrap:anywhere}\n.ac-st{font-size:12px;font-weight:700;color:var(--muted)} .acard.on .ac-st{color:#16a34a} .acard.run .ac-st{color:var(--accent)}\nhtml[data-theme=\"dark\"] .acard.on .ac-st{color:#4ade80}\n.ac-d{margin:0;font-size:13.5px;color:var(--text2);line-height:1.4;overflow-wrap:anywhere}\n.arow{display:flex;gap:10px;align-items:flex-start;font-size:13px}\n.ari{width:28px;height:28px;border-radius:9px;display:grid;place-items:center;background:var(--bg2);color:var(--text2);flex:none;font-size:14px}\n.arow>div{display:flex;flex-direction:column;min-width:0}\n.arl{font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:.05em;color:var(--muted)}\n.arv{color:var(--text);overflow-wrap:anywhere} .arv i{font-style:normal;color:var(--muted);font-weight:700}\n.ac-f{display:flex;align-items:center;gap:8px;flex-wrap:wrap;border-top:1px solid var(--line);padding-top:10px;font-size:12.5px;color:var(--muted)}\n.ac-f>span{display:flex;align-items:center;gap:6px;flex:1;min-width:150px} .ac-f b{color:var(--text2)}\n.ac-more{font-size:12.5px;font-weight:700;color:var(--accent);padding:6px 10px;border-radius:10px;background:var(--accent-soft);min-height:32px}\n.osc{position:relative;background:var(--card);border-radius:26px;padding:18px;box-shadow:var(--shadow);overflow:hidden;border:1px solid var(--line)}\n.osc::before{content:\"\";position:absolute;inset:0 0 auto 0;height:5px;background:var(--muted);transition:background .4s}\n.osc.st-heat::before{background:linear-gradient(90deg,#fb923c,#ef4444)} .osc.st-ok::before{background:#22c55e} .osc.st-warn::before{background:#f59e0b} .osc.st-wait::before{background:#8b5cf6} .osc.st-idle::before{background:var(--accent)}\n.osc-h{display:flex;align-items:center;gap:12px}\n.osc-i{width:46px;height:46px;border-radius:15px;display:grid;place-items:center;font-size:22px;color:#fff;background:linear-gradient(135deg,#fb923c,#ef4444);flex:none}\n.osc.st-off .osc-i{background:var(--bg2);color:var(--muted)}\n.osc-t{flex:1;min-width:0;display:flex;flex-direction:column} .osc-t b{font-size:17px} .osc-t span{font-size:12.5px;color:var(--muted)}\n.osc-status{display:flex;align-items:center;gap:8px;margin:14px 0 4px;font-size:15px;flex-wrap:wrap}\n.sdot{width:10px;height:10px;border-radius:50%;background:var(--muted)}\n.st-heat .sdot{background:#ef4444;animation:apulse 1.4s ease-in-out infinite;--accent:#ef4444} .st-ok .sdot{background:#22c55e} .st-warn .sdot{background:#f59e0b} .st-wait .sdot{background:#8b5cf6} .st-idle .sdot{background:var(--accent)}\n.osc-sub{font-size:12.5px;color:var(--muted);font-weight:600}\n.osc-bar{height:8px;border-radius:99px;background:var(--bg2);overflow:hidden;margin:6px 0 4px} .osc-bar i{display:block;height:100%;border-radius:99px;background:linear-gradient(90deg,#fb923c,#ef4444);transition:width .6s}\n.osc-grid{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:8px;margin:12px 0 0}\n.osc-grid>div{background:var(--card2);border-radius:14px;padding:10px 12px;min-width:0}\n.osc-grid dt{font-size:11px;font-weight:700;color:var(--muted);text-transform:uppercase;letter-spacing:.04em}\n.osc-grid dd{margin:2px 0 0;font-weight:650;font-size:14.5px;overflow-wrap:anywhere}\n.osc-last{display:flex;gap:8px;align-items:flex-start;margin-top:12px;padding:10px 12px;border-radius:14px;background:var(--accent-soft);font-size:13px;color:var(--text)} .osc-last small{color:var(--muted);font-weight:600}\n.osc-note{font-size:13px;color:var(--text2);margin:14px 0 10px}\n.osc-btn{width:100%}\n.osc-act{display:grid;grid-template-columns:repeat(auto-fit,minmax(150px,1fr));gap:10px;margin-top:12px}\n.oscf{display:flex;flex-direction:column;gap:12px}\n.oscrow{display:flex;gap:12px;align-items:flex-start;background:var(--card2);border-radius:16px;padding:12px}\n.oscrow>div{flex:1;min-width:0;display:flex;flex-direction:column;gap:4px} .oscrow small{color:var(--muted);font-size:12.5px}\n.oscrow select{width:100%;height:42px;border-radius:12px;border:1px solid var(--line);background:var(--card);color:var(--text);font-size:16px;padding:0 10px}\n.okb{width:26px;height:26px;border-radius:50%;display:grid;place-items:center;flex:none;font-size:14px;color:#fff} .okb.y{background:#22c55e} .okb.n{background:#ef4444}\n.oscrules{font-size:13px;color:var(--text2);background:var(--card2);border-radius:16px;padding:12px 14px} .oscrules ul{margin:6px 0 0;padding-left:18px} .oscrules li{margin:3px 0}\n\n/* ===== 1.9: tablets, laptops, mouse & keyboard (layout only) ===== */\n:focus-visible{outline:3px solid color-mix(in srgb,var(--accent) 70%,transparent);outline-offset:2px;border-radius:10px}\nbutton,a,[role=button],select,input{-webkit-tap-highlight-color:transparent}\n@media (hover:hover) and (pointer:fine){button,a,[role=button]{cursor:pointer} .row:hover,.tile:hover,.room:hover,.ccard:hover,.trow:hover{box-shadow:var(--shadow-lg)}}\n@media (min-width:700px){\n  #app{max-width:760px}\n  nav.bn .in{max-width:760px}\n  .sheet{max-width:620px}\n  .agrid{grid-template-columns:repeat(2,minmax(0,1fr))}\n  .ccards{grid-template-columns:repeat(auto-fill,minmax(200px,1fr))}\n  .tiles{grid-template-columns:repeat(auto-fill,minmax(160px,1fr))}\n  .osc-grid{grid-template-columns:repeat(4,minmax(0,1fr))}\n  .atools{flex-direction:row;align-items:center} .atools .search{flex:1} .atools .chips{flex:none;margin:0}\n  nav.bn a{font-size:12px!important} .fab{right:max(20px,calc(50% - 362px))}\n}\n@media (min-width:1024px){\n  :root{--pad:28px}\n  #app{max-width:1180px}\n  nav.bn{bottom:14px} nav.bn .in{max-width:820px;border-radius:24px;border:1px solid var(--line);box-shadow:var(--shadow-lg);padding:6px 10px;height:var(--nav-h)}\n  #view{padding-bottom:calc(var(--nav-h) + 48px)}\n  .agrid{grid-template-columns:repeat(3,minmax(0,1fr))}\n  .rooms-grid{grid-template-columns:repeat(auto-fill,minmax(200px,1fr))}\n  .list{display:grid;grid-template-columns:repeat(2,minmax(0,1fr))}\n  .tents-list,.sheet .list,.ilist{display:flex}\n  .sheet{bottom:50%;transform:translateY(50%);border-radius:26px;max-height:84vh;animation:none}\n  .sheet .grab{display:none}\n  .toast-wrap,#toasts{bottom:calc(var(--nav-h) + 40px)}\n  .fab{right:max(24px,calc(50% - 570px));bottom:calc(var(--nav-h) + 40px)}\n  .chome{padding:26px}\n}\n@media (min-width:1024px) and (max-height:700px){.sheet{max-height:92vh}}\n/* Comfort Home – iPad Wall Panel (only active with html.lay-wall).\n   Safari 12 friendly: grid-gap and margins (no flex gap), no blur, no inset/aspect-ratio/color-mix,\n   animations only on opacity/transform, glows are static shadows. */\nhtml.lay-wall{--bg:#06080b;--bg2:#0c1016;--card:#0f141b;--card2:#141a23;--text:#e9f2f9;--text2:#a7b6c6;--muted:#6c7e90;--line:rgba(130,200,255,.10);\n  --accent:#38bdf8;--accent-ink:#04121c;--accent-soft:rgba(56,189,248,.14);--accent-2:#67e8f9;--ok:#34d399;--warn:#fbbf24;--bad:#f87171;\n  --tog-off:#273140;--scrim:rgba(0,0,0,.62);--shadow:none;--shadow-lg:0 24px 70px rgba(0,0,0,.7);--hero1:#0f141b;--hero2:#0f141b;--hero-ink:#e9f2f9;\n  --w-cyan:#38bdf8;--w-cyan2:#22d3ee;--w-glow:rgba(56,189,248,.22);--w-panel:rgba(255,255,255,.035);--w-border:rgba(125,200,255,.11);--rail:96px;\n  background:#06080b;color-scheme:dark}\nhtml.lay-wall body{background:#06080b;background-image:radial-gradient(900px 500px at 85% -8%,rgba(34,211,238,.10),rgba(6,8,11,0) 60%),radial-gradient(700px 500px at -5% 105%,rgba(56,120,248,.10),rgba(6,8,11,0) 60%);background-repeat:no-repeat;color:var(--text);-webkit-user-select:none;user-select:none}\nhtml.lay-wall #app{max-width:none;margin:0}\nhtml.lay-wall #view{padding:0!important;min-height:100vh}\nhtml.lay-wall #nav{display:none}\nhtml.lay-wall .w-root{display:block;min-height:100vh;-webkit-animation:none;animation:none}\nhtml.lay-wall .num{font-variant-numeric:tabular-nums}\n\n/* ---- side rail ---- */\n.w-rail{position:fixed;top:0;bottom:0;left:0;width:var(--rail);z-index:20;display:-webkit-box;display:-webkit-flex;display:flex;-webkit-flex-direction:column;flex-direction:column;-webkit-align-items:center;align-items:center;padding:calc(18px + env(safe-area-inset-top,0px)) 0 calc(18px + env(safe-area-inset-bottom,0px));background:rgba(9,12,17,.92);border-right:1px solid var(--w-border)}\n.w-logo{width:40px;height:40px;border-radius:50%;border:2px solid rgba(56,189,248,.55);box-shadow:0 0 18px rgba(56,189,248,.35);margin-bottom:22px;position:relative}\n.w-logo i{position:absolute;top:11px;left:11px;width:14px;height:14px;border-radius:50%;background:var(--w-cyan2);box-shadow:0 0 12px var(--w-cyan2)}\n.w-nav{width:76px;min-height:70px;margin:4px 0;border-radius:20px;display:-webkit-box;display:-webkit-flex;display:flex;-webkit-flex-direction:column;flex-direction:column;-webkit-align-items:center;align-items:center;-webkit-justify-content:center;justify-content:center;color:var(--muted);background:transparent;font-size:11px;font-weight:600;letter-spacing:.02em;position:relative;-webkit-transition:color .2s,background-color .2s;transition:color .2s,background-color .2s}\n.w-nav svg{width:26px;height:26px;margin-bottom:5px}\n.w-nav.on{color:#eaf8ff;background:rgba(56,189,248,.12)}\n.w-nav.on::before{content:\"\";position:absolute;left:-10px;top:18px;bottom:18px;width:3px;border-radius:3px;background:var(--w-cyan);box-shadow:0 0 10px var(--w-cyan)}\n.w-rail-sp{-webkit-box-flex:1;-webkit-flex:1;flex:1}\n\n/* ---- main area + top bar ---- */\n.w-main{margin-left:var(--rail);padding:calc(14px + env(safe-area-inset-top,0px)) 24px 28px 24px;min-height:100vh;box-sizing:border-box}\n.w-top{display:grid;grid-template-columns:auto 1fr auto;grid-gap:24px;-webkit-align-items:center;align-items:center;padding:6px 4px 18px;border-bottom:1px solid var(--w-border);margin-bottom:20px}\n.w-clock{display:-webkit-box;display:-webkit-flex;display:flex;-webkit-align-items:baseline;align-items:baseline}\n.w-time{font-size:62px;font-weight:200;letter-spacing:-.02em;line-height:1;color:#f2f9ff;text-shadow:0 0 24px rgba(56,189,248,.25)}\n.w-colon{font-style:normal;-webkit-animation:wblink 2s ease-in-out infinite;animation:wblink 2s ease-in-out infinite;margin:0 2px}\n@-webkit-keyframes wblink{50%{opacity:.35}} @keyframes wblink{50%{opacity:.35}}\n.w-date{font-size:16px;color:var(--text2);margin-left:16px;text-transform:capitalize;font-weight:500;white-space:nowrap}\n.w-weather{display:-webkit-box;display:-webkit-flex;display:flex;-webkit-align-items:center;align-items:center;-webkit-justify-content:center;justify-content:center;color:var(--text2)}\n.w-wi svg{width:30px;height:30px;color:var(--w-cyan2)}\n.w-out{font-size:30px;font-weight:300;color:var(--text);margin:0 10px}\n.w-wl{font-size:14px;text-transform:capitalize}\n.w-stat{display:-webkit-box;display:-webkit-flex;display:flex;-webkit-align-items:center;align-items:center}\n.w-chip{display:-webkit-inline-box;display:-webkit-inline-flex;display:inline-flex;-webkit-align-items:center;align-items:center;height:36px;padding:0 12px;border-radius:18px;background:var(--w-panel);border:1px solid var(--w-border);color:var(--text2);margin-right:8px;font-size:14px}\n.w-chip svg{width:17px;height:17px;margin-right:6px} .w-chip.warn{color:var(--warn)}\n.w-conn{display:-webkit-inline-box;display:-webkit-inline-flex;display:inline-flex;-webkit-align-items:center;align-items:center;height:36px;padding:0 14px;border-radius:18px;font-size:14px;font-weight:600;background:rgba(52,211,153,.10);color:#7ef0c1;border:1px solid rgba(52,211,153,.25)}\n.w-conn i{width:9px;height:9px;border-radius:50%;background:currentColor;margin-right:8px;box-shadow:0 0 10px currentColor;-webkit-animation:wpulse 2.4s ease-in-out infinite;animation:wpulse 2.4s ease-in-out infinite}\n.w-conn.warn{background:rgba(251,191,36,.10);color:#fcd34d;border-color:rgba(251,191,36,.25)} .w-conn.bad{background:rgba(248,113,113,.10);color:#fca5a5;border-color:rgba(248,113,113,.25)}\n@-webkit-keyframes wpulse{50%{opacity:.4}} @keyframes wpulse{50%{opacity:.4}}\n\n/* ---- pages ---- */\n.w-page{-webkit-animation:wpage .28s ease-out both;animation:wpage .28s ease-out both}\n@-webkit-keyframes wpage{from{opacity:0;-webkit-transform:translateY(8px)}to{opacity:1;-webkit-transform:none}} @keyframes wpage{from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:none}}\n.w-pagebar{display:-webkit-box;display:-webkit-flex;display:flex;-webkit-align-items:center;align-items:center;-webkit-justify-content:space-between;justify-content:space-between;margin:0 2px 16px}\n.w-pagebar h1{margin:0;font-size:28px;font-weight:300;letter-spacing:.01em;color:#f2f9ff}\n.w-panel{background:var(--w-panel);border:1px solid var(--w-border);border-radius:26px;padding:18px 18px 20px;margin-bottom:18px;position:relative}\n.w-ph{display:-webkit-box;display:-webkit-flex;display:flex;-webkit-align-items:center;align-items:center;-webkit-justify-content:space-between;justify-content:space-between;margin-bottom:14px;min-height:28px}\n.w-ph h2{margin:0;font-size:13px;font-weight:700;letter-spacing:.14em;text-transform:uppercase;color:var(--muted)}\n.w-link{display:-webkit-inline-box;display:-webkit-inline-flex;display:inline-flex;-webkit-align-items:center;align-items:center;min-height:40px;padding:0 14px;border-radius:20px;color:var(--w-cyan);font-weight:600;font-size:14px;background:rgba(56,189,248,.08)}\n.w-link svg{width:16px;height:16px;margin-left:4px}\n.w-lbl{display:block;font-size:12px;font-weight:700;letter-spacing:.12em;text-transform:uppercase;color:var(--muted);margin-bottom:4px}\n.w-v,.wv{font-size:44px;font-weight:200;line-height:1;color:#f2f9ff} .wv small{font-size:22px;font-weight:300;color:var(--text2)}\n.w-sub{display:block;font-size:13px;color:var(--muted);margin-top:6px}\n.w-empty{color:var(--muted);font-size:16px;padding:30px 4px}\n.w-grid-home{display:grid;grid-template-columns:minmax(0,1fr) 280px;grid-gap:18px;-webkit-align-items:start;align-items:start}\n\n/* tiles */\n.w-tiles{display:grid;grid-template-columns:repeat(auto-fill,minmax(150px,1fr));grid-gap:12px}\n.w-tile{position:relative;border-radius:22px;background:rgba(255,255,255,.04);border:1px solid var(--w-border);-webkit-transition:border-color .25s,background-color .25s,-webkit-transform .12s;transition:border-color .25s,background-color .25s,transform .12s}\n.w-tb{display:block;width:100%;min-height:118px;padding:14px 16px;text-align:left;color:inherit;background:transparent;border-radius:22px;box-sizing:border-box}\n.w-ti{display:-webkit-box;display:-webkit-flex;display:flex;-webkit-align-items:center;align-items:center;-webkit-justify-content:center;justify-content:center;width:46px;height:46px;border-radius:16px;background:rgba(255,255,255,.06);color:var(--text2);margin-bottom:12px;-webkit-transition:background-color .25s,color .25s;transition:background-color .25s,color .25s}\n.w-ti svg{width:24px;height:24px}\n.w-tn{display:block;font-size:16px;font-weight:600;color:var(--text);line-height:1.25;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;padding-right:30px}\n.w-ts{display:block;font-size:13px;color:var(--muted);margin-top:3px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}\n.w-bar{display:block;height:4px;border-radius:2px;background:rgba(255,255,255,.08);margin-top:10px;overflow:hidden} .w-bar i{display:block;height:100%;background:linear-gradient(90deg,#22d3ee,#38bdf8);border-radius:2px}\n.w-tile.on{background:rgba(56,189,248,.09);border-color:rgba(56,189,248,.45);box-shadow:0 0 26px rgba(56,189,248,.16)}\n.w-tile.on .w-ti{background:linear-gradient(135deg,#22d3ee,#3b82f6);color:#03131d;box-shadow:0 0 18px rgba(34,211,238,.45)}\n.w-tile.on .w-ts{color:#8fe3ff}\n.w-tile.na{opacity:.45}\n.w-tile.busy::after{content:\"\";position:absolute;top:-1px;right:-1px;bottom:-1px;left:-1px;border-radius:22px;border:1px solid var(--w-cyan2);-webkit-animation:wpulse 1s ease-in-out infinite;animation:wpulse 1s ease-in-out infinite;pointer-events:none}\n.w-more{position:absolute;top:10px;right:10px;width:44px;height:44px;border-radius:14px;display:-webkit-box;display:-webkit-flex;display:flex;-webkit-align-items:center;align-items:center;-webkit-justify-content:center;justify-content:center;color:var(--muted);background:rgba(255,255,255,.05)}\n.w-more svg{width:18px;height:18px}\n.w-root button.w-hit,.w-tile:active{-webkit-transform:scale(.97);transform:scale(.97)}\n\n/* climate */\n.w-climhero{display:grid;grid-template-columns:170px minmax(0,1fr);grid-gap:16px;-webkit-align-items:center;align-items:center}\n.w-acs{display:grid;grid-template-columns:repeat(auto-fit,minmax(118px,1fr));grid-gap:10px}\n.w-ac{text-align:left;padding:14px;border-radius:18px;background:rgba(255,255,255,.04);border:1px solid var(--w-border);border-bottom:3px solid var(--tc);color:inherit;min-height:96px}\n.w-ac.on{background:rgba(56,189,248,.08);box-shadow:0 0 20px rgba(56,189,248,.12)}\n.w-acn{display:block;font-size:13px;font-weight:600;color:var(--text2);white-space:nowrap;overflow:hidden;text-overflow:ellipsis}\n.w-acv{display:block;font-size:28px;font-weight:300;color:var(--tc);margin:4px 0 2px}\n.w-acs{font-size:12px;color:var(--muted)} .w-ac .w-acs{display:block}\n.w-ac.on .w-acs{color:#8fe3ff}\n.w-acgrid{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));grid-gap:16px;margin-bottom:18px}\n.w-acc{border-radius:26px;padding:20px;background:var(--w-panel);border:1px solid var(--w-border);position:relative;overflow:hidden}\n.w-acc::before{content:\"\";position:absolute;top:0;left:0;right:0;height:3px;background:var(--tc);opacity:.85}\n.w-acc.on{border-color:rgba(56,189,248,.4);box-shadow:0 0 30px rgba(56,189,248,.12)}\n.w-acc.m-heat.on{border-color:rgba(251,146,60,.45);box-shadow:0 0 30px rgba(251,146,60,.14)}\n.w-acc.busy{opacity:.85}\n.w-acc-h{display:-webkit-box;display:-webkit-flex;display:flex;-webkit-align-items:center;align-items:center;-webkit-justify-content:space-between;justify-content:space-between}\n.w-acc-h b{display:block;font-size:20px;font-weight:600} .w-acc-h span{display:block;font-size:13px;color:var(--muted);margin-top:2px}\n.w-acc.on .w-acc-h span{color:#8fe3ff}\n.w-pwr{width:60px;height:60px;border-radius:20px;display:-webkit-box;display:-webkit-flex;display:flex;-webkit-align-items:center;align-items:center;-webkit-justify-content:center;justify-content:center;background:rgba(255,255,255,.06);color:var(--text2);border:1px solid var(--w-border)}\n.w-pwr svg{width:26px;height:26px}\n.w-pwr.on{background:linear-gradient(135deg,#22d3ee,#3b82f6);color:#03131d;border-color:transparent;box-shadow:0 0 22px rgba(34,211,238,.45)}\n.w-acc-m{display:grid;grid-template-columns:minmax(0,1fr) auto;grid-gap:12px;-webkit-align-items:center;align-items:center;margin:18px 0 16px}\n.w-room .wv{color:var(--tc)}\n.w-tgt{display:-webkit-box;display:-webkit-flex;display:flex;-webkit-align-items:center;align-items:center}\n.w-step{width:64px;height:64px;border-radius:50%;display:-webkit-box;display:-webkit-flex;display:flex;-webkit-align-items:center;align-items:center;-webkit-justify-content:center;justify-content:center;background:rgba(255,255,255,.06);border:1px solid var(--w-border);color:var(--text)}\n.w-step svg{width:26px;height:26px} .w-step[disabled],.w-pwr[disabled],.w-mode[disabled]{opacity:.35}\n.w-tv{text-align:center;min-width:92px;margin:0 8px} .w-tv .num{font-size:30px;font-weight:300}\n.w-modes{display:grid;grid-template-columns:repeat(auto-fit,minmax(78px,1fr));grid-gap:8px}\n.w-mode{min-height:56px;border-radius:16px;background:rgba(255,255,255,.04);border:1px solid var(--w-border);color:var(--text2);font-size:12px;font-weight:600;display:-webkit-box;display:-webkit-flex;display:flex;-webkit-flex-direction:column;flex-direction:column;-webkit-align-items:center;align-items:center;-webkit-justify-content:center;justify-content:center}\n.w-mode svg{width:20px;height:20px;margin-bottom:3px}\n.w-mode.on{background:rgba(56,189,248,.14);border-color:rgba(56,189,248,.5);color:#dff6ff}\n.w-grp{display:-webkit-box;display:-webkit-flex;display:flex;-webkit-align-items:center;align-items:center;padding:6px;border-radius:40px;background:var(--w-panel);border:1px solid var(--w-border)}\n.w-grp>span{margin:0 14px;font-size:14px;font-weight:600;color:var(--text2)} .w-grp .w-step{width:54px;height:54px} .w-grp .w-pwr{width:54px;height:54px;border-radius:50%;margin-left:10px}\n.w-btn{display:-webkit-inline-box;display:-webkit-inline-flex;display:inline-flex;-webkit-align-items:center;align-items:center;min-height:52px;padding:0 20px;border-radius:26px;background:rgba(255,255,255,.06);border:1px solid var(--w-border);color:var(--text);font-weight:600;font-size:15px}\n.w-btn svg{width:20px;height:20px;margin-right:8px}\n\n/* status, energy, sensors */\n.w-duo{display:grid;grid-template-columns:1fr 1fr;grid-gap:10px;margin-bottom:12px}\n.w-duo .wv{font-size:38px}\n.w-sr{display:-webkit-box;display:-webkit-flex;display:flex;-webkit-align-items:center;align-items:center;min-height:52px;border-top:1px solid var(--w-border)}\n.w-si{width:34px;height:34px;border-radius:12px;display:-webkit-box;display:-webkit-flex;display:flex;-webkit-align-items:center;align-items:center;-webkit-justify-content:center;justify-content:center;background:rgba(255,255,255,.05);color:var(--text2);margin-right:12px;-webkit-flex:none;flex:none}\n.w-si svg{width:18px;height:18px}\n.w-sl{-webkit-box-flex:1;-webkit-flex:1;flex:1;font-size:15px;color:var(--text2);min-width:0} .w-sl small{display:block;font-size:12px;color:var(--muted)}\n.w-sv{font-size:17px;font-weight:600;color:var(--text);text-align:right;margin-left:10px}\n.w-sr.hl .w-sv{color:#8fe3ff} .w-sr.warn .w-sv{color:var(--warn)} .w-sr.ok .w-sv{color:var(--ok)}\n.w-alerts{margin-top:10px} .w-alerts span{display:-webkit-inline-box;display:-webkit-inline-flex;display:inline-flex;-webkit-align-items:center;align-items:center;font-size:13px;color:var(--warn);background:rgba(251,191,36,.08);border-radius:12px;padding:6px 10px;margin:0 6px 6px 0}\n.w-alerts svg{width:14px;height:14px;margin-right:5px}\n.w-en{display:-webkit-box;display:-webkit-flex;display:flex;-webkit-align-items:center;align-items:center;min-height:44px}\n.w-enn{width:42%;font-size:14px;color:var(--text2);white-space:nowrap;overflow:hidden;text-overflow:ellipsis;margin-right:10px}\n.w-enb{-webkit-box-flex:1;-webkit-flex:1;flex:1;height:6px;border-radius:3px;background:rgba(255,255,255,.06);overflow:hidden} .w-enb i{display:block;height:100%;background:linear-gradient(90deg,#22d3ee,#a78bfa);border-radius:3px}\n.w-env{min-width:76px;text-align:right;font-size:15px;font-weight:600;margin-left:10px}\n.w-sub2{font-size:12px;font-weight:700;letter-spacing:.12em;text-transform:uppercase;color:var(--muted);margin:14px 0 4px}\n.w-rooms{display:grid;grid-template-columns:repeat(auto-fill,minmax(150px,1fr));grid-gap:12px}\n.w-rt{padding:16px;border-radius:20px;background:rgba(255,255,255,.04);border:1px solid var(--w-border);border-bottom:3px solid var(--tc)}\n.w-rtn{display:block;font-size:14px;font-weight:600;color:var(--text2);margin-bottom:6px} .w-rt .wv{font-size:36px;color:var(--tc)}\n.w-rth{display:-webkit-box;display:-webkit-flex;display:flex;-webkit-align-items:center;align-items:center;font-size:13px;color:var(--muted);margin-top:6px;min-height:16px} .w-rth svg{width:14px;height:14px;margin-right:4px}\n.w-bins{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));grid-gap:0 18px}\n.w-bin{display:-webkit-box;display:-webkit-flex;display:flex;-webkit-align-items:center;align-items:center;min-height:56px;border-top:1px solid var(--w-border)}\n.w-bin.on .w-si{background:rgba(251,191,36,.14);color:var(--warn)} .w-bin.on .w-sv{color:var(--warn)} .w-bin.na{opacity:.45}\n\n/* quick actions */\n.w-quick{display:grid;grid-template-columns:repeat(auto-fit,minmax(120px,1fr));grid-gap:12px;margin-bottom:18px}\n.w-q{min-height:96px;border-radius:24px;background:var(--w-panel);border:1px solid var(--w-border);color:var(--text);font-size:14px;font-weight:600;display:-webkit-box;display:-webkit-flex;display:flex;-webkit-flex-direction:column;flex-direction:column;-webkit-align-items:center;align-items:center;-webkit-justify-content:center;justify-content:center;padding:10px}\n.w-q svg{width:28px;height:28px;margin-bottom:8px;color:var(--w-cyan)}\n.w-q.off{border-color:rgba(248,113,113,.3)} .w-q.off svg{color:#fca5a5}\n.w-q.on{border-color:rgba(251,146,60,.45);background:rgba(251,146,60,.08)} .w-q.on svg{color:#fdba74}\n\n/* automations */\n.w-alist{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));grid-gap:12px}\n.w-auto{display:-webkit-box;display:-webkit-flex;display:flex;-webkit-align-items:center;align-items:center;padding:16px 18px;border-radius:22px;background:var(--w-panel);border:1px solid var(--w-border);min-height:78px}\n.w-dot{width:12px;height:12px;border-radius:50%;background:var(--muted);margin-right:14px;-webkit-flex:none;flex:none}\n.w-auto.on .w-dot,.w-osc.st-idle .w-dot,.w-osc.st-reached .w-dot{background:#34d399;box-shadow:0 0 10px rgba(52,211,153,.7)}\n.w-osc.st-heating .w-dot{background:#fb923c;box-shadow:0 0 12px #fb923c;-webkit-animation:wpulse 1.2s ease-in-out infinite;animation:wpulse 1.2s ease-in-out infinite}\n.w-osc.st-cooldown .w-dot{background:#a78bfa} .w-osc.st-maxed .w-dot{background:#fbbf24}\n.w-at{-webkit-box-flex:1;-webkit-flex:1;flex:1;min-width:0} .w-at b{display:block;font-size:16px;font-weight:600;white-space:nowrap;overflow:hidden;text-overflow:ellipsis} .w-at span{display:block;font-size:13px;color:var(--muted);margin-top:2px}\n.w-tg{width:66px;height:38px;border-radius:19px;background:var(--tog-off);position:relative;-webkit-flex:none;flex:none;margin-left:12px;-webkit-transition:background-color .2s;transition:background-color .2s}\n.w-tg i{position:absolute;top:4px;left:4px;width:30px;height:30px;border-radius:50%;background:#dbe6f0;-webkit-transition:-webkit-transform .2s;transition:transform .2s}\n.w-tg.on{background:linear-gradient(90deg,#22d3ee,#3b82f6);box-shadow:0 0 16px rgba(34,211,238,.35)} .w-tg.on i{-webkit-transform:translateX(28px);transform:translateX(28px);background:#fff}\n.w-oscs{display:-webkit-box;display:-webkit-flex;display:flex;-webkit-align-items:center;align-items:center;font-size:18px;margin-bottom:12px} .w-oscs span{margin-left:14px;font-size:14px;color:var(--muted)}\n.w-oscg{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));grid-gap:10px} .w-oscg span{padding:12px;border-radius:16px;background:rgba(255,255,255,.04);color:var(--muted);font-size:13px} .w-oscg b{display:block;font-size:22px;font-weight:300;color:var(--text);margin-top:2px}\n\n/* settings page inside the panel */\n.w-setrow{display:-webkit-box;display:-webkit-flex;display:flex;-webkit-align-items:center;align-items:center;-webkit-justify-content:space-between;justify-content:space-between;min-height:60px;border-top:1px solid var(--w-border);font-size:16px}\n.w-setrow select{min-height:46px;min-width:220px;border-radius:14px;background:var(--card2);color:var(--text);border:1px solid var(--w-border);font-size:16px;padding:0 12px}\n.w-note{font-size:13px;color:var(--muted);margin:12px 0 0}\n.w-embed .page{padding:0!important;-webkit-animation:none;animation:none} .w-embed .topbar{display:none}\n.w-embed button,.w-embed select,.w-embed .seg button{min-height:46px} .w-embed .star,.w-embed .iconbtn{min-width:46px}\n.w-embed .card{background:var(--w-panel);border:1px solid var(--w-border);box-shadow:none}\n\n/* loading */\n.w-load{display:-webkit-box;display:-webkit-flex;display:flex;-webkit-flex-direction:column;flex-direction:column;-webkit-align-items:center;align-items:center;-webkit-justify-content:center;justify-content:center;min-height:60vh;color:var(--text2);font-size:17px}\n.w-ring{width:84px;height:84px;border-radius:50%;border:2px solid rgba(56,189,248,.15);border-top-color:var(--w-cyan);-webkit-animation:wspin 1.1s linear infinite;animation:wspin 1.1s linear infinite;margin-bottom:22px;position:relative}\n.w-ring i{position:absolute;top:30px;left:30px;width:20px;height:20px;border-radius:50%;background:var(--w-cyan2);box-shadow:0 0 18px var(--w-cyan2)}\n@-webkit-keyframes wspin{to{-webkit-transform:rotate(360deg)}} @keyframes wspin{to{transform:rotate(360deg)}}\n\n/* sheets & toasts in panel mode */\nhtml.lay-wall #toasts{bottom:24px;left:var(--rail)}\nhtml.lay-wall .sheet{left:var(--rail);max-width:640px;border:1px solid var(--w-border)}\n@media (min-width:900px){html.lay-wall .sheet{bottom:50%;-webkit-transform:translateY(50%);transform:translateY(50%);border-radius:28px;max-height:86vh}}\n\n/* portrait (768 wide) and smaller */\n@media (max-width:900px){\n  .w-grid-home{grid-template-columns:minmax(0,1fr)}\n  .w-col-side{display:grid;grid-template-columns:1fr 1fr;grid-gap:18px} .w-col-side .w-panel{margin-bottom:0}\n  .w-top{grid-template-columns:auto auto;grid-gap:12px} .w-weather{display:none}\n  .w-time{font-size:54px} .w-climhero{grid-template-columns:minmax(0,1fr)}\n  .w-clock{-webkit-flex-direction:column;flex-direction:column;-webkit-align-items:flex-start;align-items:flex-start} .w-date{margin:6px 0 0;font-size:15px}\n  .w-top{grid-template-columns:minmax(0,1fr) auto}\n}\n@media (max-width:760px){.w-acgrid,.w-alist,.w-bins{grid-template-columns:minmax(0,1fr)} .w-col-side{grid-template-columns:minmax(0,1fr)}}\n@media (max-width:560px){html.lay-wall{--rail:72px} .w-nav{width:62px} .w-nav span{display:none} .w-main{padding-left:14px;padding-right:14px} .w-stat .w-chip{display:none}}\n@media (prefers-reduced-motion:reduce){.w-colon,.w-conn i,.w-page{-webkit-animation:none;animation:none}}\n\n/* ===== Device Layout = iPhone: keep the phone layout even on a wide screen (undoes the tablet/laptop widening) ===== */\n@media (min-width:600px){html.lay-phone .fab{right:calc(50% - 262px)}}\n@media (min-width:700px){\n  html.lay-phone #app,html.lay-phone nav.bn .in,html.lay-phone .sheet{max-width:560px}\n  html.lay-phone .agrid{grid-template-columns:minmax(0,1fr)}\n  html.lay-phone .ccards{grid-template-columns:1fr 1fr}\n  html.lay-phone .tiles{grid-template-columns:repeat(auto-fill,minmax(150px,1fr))}\n  html.lay-phone .osc-grid{grid-template-columns:repeat(2,minmax(0,1fr))}\n  html.lay-phone .atools{-webkit-flex-direction:column;flex-direction:column;-webkit-align-items:stretch;align-items:stretch}\n  html.lay-phone .atools .chips{margin:0}\n  html.lay-phone nav.bn a{font-size:10.5px!important}\n  html.lay-phone .fab{right:calc(50% - 262px)}\n}\n@media (min-width:1024px){\n  html.lay-phone nav.bn{bottom:0}\n  html.lay-phone nav.bn .in{border:0;border-radius:24px 24px 0 0;box-shadow:0 -6px 24px rgba(20,40,70,.08);height:calc(var(--nav-h) + var(--safe-b));padding:6px calc(2px + var(--safe-r)) calc(6px + var(--safe-b)) calc(2px + var(--safe-l))}\n  html.lay-phone #view{padding-bottom:calc(var(--nav-h) + var(--safe-b) + 24px)}\n  html.lay-phone .agrid{grid-template-columns:minmax(0,1fr)}\n  html.lay-phone .rooms-grid{grid-template-columns:repeat(auto-fit,minmax(148px,1fr))}\n  html.lay-phone .list{display:-webkit-box;display:-webkit-flex;display:flex;-webkit-flex-direction:column;flex-direction:column}\n  html.lay-phone .sheet{bottom:0;-webkit-transform:none;transform:none;border-radius:26px 26px 0 0;max-height:88vh}\n  html.lay-phone .sheet .grab{display:block}\n  html.lay-phone #toasts{bottom:calc(var(--nav-h) + var(--safe-b) + 12px)}\n  html.lay-phone .fab{right:calc(50% - 262px);bottom:calc(var(--nav-h) + var(--safe-b) + 16px)}\n  html.lay-phone .chome{padding:20px}\n}\n\n/* ===== SCREEN – warm luxury for an acoustic wood wall: anthracite, matte black, warm white, wood & champagne accents ===== */\nhtml.lay-wall .w-pg-screen{--wood:#9a6a43;--wood2:#c08a5b;--champ:#d8c3a0;--warmw:#f4ede3;--ink:#0d0c0b}\n.w-pg-screen .wv{color:var(--warmw)} .w-pg-screen .wv small{color:#bfae95}\n.s-cap{display:block;font-size:12px;font-weight:700;letter-spacing:.16em;text-transform:uppercase;color:#a8957b;margin-bottom:6px}\n.s-avg{position:relative;overflow:hidden;display:grid;grid-template-columns:minmax(0,1fr) auto;grid-gap:20px;-webkit-align-items:center;align-items:center;width:100%;text-align:left;padding:26px 28px;border-radius:30px;margin-bottom:18px;color:inherit;\n  background:linear-gradient(135deg,#1b1815 0%,#11100e 60%,#0d0c0b 100%);border:1px solid rgba(216,195,160,.16);box-shadow:0 18px 40px rgba(0,0,0,.45)}\n.s-avg::before{content:\"\";position:absolute;top:0;left:0;right:0;height:3px;background:linear-gradient(90deg,rgba(192,138,91,0),#c08a5b 30%,#d8c3a0 60%,rgba(216,195,160,0))}\n.s-slats{position:absolute;top:0;bottom:0;right:0;width:46%;opacity:.16;pointer-events:none;background:repeating-linear-gradient(90deg,#8a5b37 0,#8a5b37 14px,#5e3c22 14px,#5e3c22 16px,rgba(0,0,0,0) 16px,rgba(0,0,0,0) 22px)}\n.s-slats::after{content:\"\";position:absolute;top:0;bottom:0;left:0;width:60%;background:linear-gradient(90deg,#141210,rgba(20,18,16,0))}\n.s-avg-l,.s-avg-r{position:relative}\n.s-avg .wv{font-size:84px;font-weight:200;letter-spacing:-.02em} .s-avg .wv small{font-size:36px}\n.s-avg-sub{display:block;font-size:14px;color:#a8957b;margin-top:8px}\n.s-avg-r{text-align:right}\n.s-heatnow{display:-webkit-inline-box;display:-webkit-inline-flex;display:inline-flex;-webkit-align-items:center;align-items:center;height:44px;padding:0 16px;border-radius:22px;background:rgba(244,237,227,.05);border:1px solid rgba(216,195,160,.14);color:#cdbda4;font-size:15px}\n.s-heatnow svg{width:18px;height:18px;margin-right:8px} .s-heatnow.on{color:#f6c89a;border-color:rgba(214,140,80,.45);background:rgba(214,140,80,.10);box-shadow:0 0 22px rgba(214,140,80,.18)}\n.s-go{display:-webkit-box;display:-webkit-flex;display:flex;-webkit-align-items:center;align-items:center;-webkit-justify-content:flex-end;justify-content:flex-end;margin-top:14px;color:#d8c3a0;font-weight:600;font-size:15px} .s-go svg{width:18px;height:18px;margin-left:4px}\n.s-rooms{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));grid-gap:14px}\n.s-room{position:relative;text-align:left;padding:20px 18px 18px;border-radius:26px;color:inherit;min-height:210px;background:#11100e;border:1px solid rgba(216,195,160,.12);-webkit-transition:border-color .3s,box-shadow .3s;transition:border-color .3s,box-shadow .3s}\n.s-room::before{content:\"\";position:absolute;left:18px;right:18px;top:0;height:2px;border-radius:2px;background:linear-gradient(90deg,#9a6a43,#d8c3a0);opacity:.7}\n.s-room.heat{border-color:rgba(214,140,80,.45);box-shadow:0 0 28px rgba(214,140,80,.14)}\n.s-rn{display:block;font-size:13px;font-weight:700;letter-spacing:.14em;text-transform:uppercase;color:#cdbda4;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}\n.s-rt{display:block;margin:14px 0 10px;min-height:52px} .s-room .wv{font-size:48px} .s-room .wv.na{color:#6f655a}\n.s-na{display:block;font-size:12px;color:#d9a066;margin-top:4px}\n.s-rmeta{display:block;min-height:24px;font-size:13px;color:#a8957b}\n.s-rmeta>span{display:-webkit-inline-box;display:-webkit-inline-flex;display:inline-flex;-webkit-align-items:center;align-items:center;margin-right:12px}\n.s-rmeta svg{width:15px;height:15px;margin-right:4px}\n.s-hs{display:-webkit-inline-box;display:-webkit-inline-flex;display:inline-flex;-webkit-align-items:center;align-items:center;font-size:13px;color:#8e8273}\n.s-hs svg{width:15px;height:15px;margin-right:4px} .s-hs.heat{color:#f3a86b} .s-hs.idle,.s-hs.other{color:#d8c3a0} .s-hs.na{color:#6f655a}\n.s-gauge{display:block;position:relative;height:6px;border-radius:3px;margin-top:16px;background:linear-gradient(90deg,#3c6b8f 0%,#6f8f6a 45%,#c08a5b 70%,#c4553d 100%);opacity:.9}\n.s-gfill{display:none}\n.s-gauge b{position:absolute;top:-5px;width:16px;height:16px;margin-left:-8px;border-radius:50%;background:#f4ede3;box-shadow:0 0 0 3px rgba(13,12,11,.9),0 0 12px rgba(244,237,227,.5)}\n.s-gl{display:-webkit-box;display:-webkit-flex;display:flex;-webkit-justify-content:space-between;justify-content:space-between;font-size:10.5px;color:#6f655a;margin-top:6px}\n.s-bar{display:-webkit-box;display:-webkit-flex;display:flex;-webkit-align-items:center;align-items:center;margin:0 2px 18px}\n.s-bar h1{margin:0 0 0 16px;font-size:30px;font-weight:300;color:#f4ede3;-webkit-box-flex:1;-webkit-flex:1;flex:1}\n.s-back{display:-webkit-inline-box;display:-webkit-inline-flex;display:inline-flex;-webkit-align-items:center;align-items:center;height:52px;padding:0 18px 0 12px;border-radius:26px;background:rgba(244,237,227,.06);border:1px solid rgba(216,195,160,.18);color:#e8dcc8;font-size:15px;font-weight:600}\n.s-back svg{width:22px;height:22px;margin-right:6px}\n.s-bar-t{display:-webkit-box;display:-webkit-flex;display:flex;-webkit-align-items:center;align-items:center} .s-bar-t .wv{font-size:40px;color:#f4ede3}\n.s-bar-h{display:-webkit-inline-box;display:-webkit-inline-flex;display:inline-flex;-webkit-align-items:center;align-items:center;margin-left:14px;color:#a8957b;font-size:15px} .s-bar-h svg{width:16px;height:16px;margin-right:4px}\n.s-heaters{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));grid-gap:14px}\n.s-heater{padding:20px;border-radius:26px;background:#11100e;border:1px solid rgba(216,195,160,.12)}\n.s-heater.heat{border-color:rgba(214,140,80,.45);box-shadow:0 0 26px rgba(214,140,80,.12)} .s-heater.busy{opacity:.85}\n.s-hh{display:-webkit-box;display:-webkit-flex;display:flex;-webkit-align-items:center;align-items:center;-webkit-justify-content:space-between;justify-content:space-between}\n.s-hh b{display:block;font-size:20px;font-weight:600;color:#f4ede3;margin-bottom:4px}\n.s-pwr{width:58px;height:58px;border-radius:20px;display:-webkit-box;display:-webkit-flex;display:flex;-webkit-align-items:center;align-items:center;-webkit-justify-content:center;justify-content:center;background:rgba(244,237,227,.05);border:1px solid rgba(216,195,160,.16);color:#cdbda4}\n.s-pwr svg{width:24px;height:24px} .s-pwr.on{background:linear-gradient(135deg,#d8a06a,#a9693f);color:#1a0f07;border-color:transparent;box-shadow:0 0 20px rgba(214,140,80,.35)}\n.s-hm{display:grid;grid-template-columns:minmax(0,1fr) auto;grid-gap:10px;-webkit-align-items:center;align-items:center;margin-top:16px}\n.s-set{display:-webkit-box;display:-webkit-flex;display:flex;-webkit-align-items:center;align-items:center}\n.s-step{width:62px;height:62px;border-radius:50%;display:-webkit-box;display:-webkit-flex;display:flex;-webkit-align-items:center;align-items:center;-webkit-justify-content:center;justify-content:center;background:rgba(244,237,227,.06);border:1px solid rgba(216,195,160,.18);color:#f4ede3}\n.s-step svg{width:24px;height:24px} .s-step[disabled],.s-pwr[disabled]{opacity:.35}\n.s-tv{text-align:center;min-width:88px;margin:0 8px} .s-tv .num{font-size:28px;font-weight:300;color:#f4ede3}\n.w-pg-screen .w-panel{background:#11100e;border-color:rgba(216,195,160,.12)} .w-pg-screen .w-ph h2{color:#a8957b}\n.w-pg-screen .w-tile.on{background:rgba(214,160,100,.08);border-color:rgba(216,170,120,.5);box-shadow:0 0 24px rgba(214,140,80,.14)}\n.w-pg-screen .w-tile.on .w-ti{background:linear-gradient(135deg,#e2b07c,#a9693f);color:#1a0f07;box-shadow:0 0 16px rgba(214,140,80,.4)} .w-pg-screen .w-tile.on .w-ts{color:#f0c9a0}\n.w-pg-screen .w-bar i{background:linear-gradient(90deg,#c08a5b,#d8c3a0)}\n@media (max-width:900px){.s-rooms{grid-template-columns:repeat(2,minmax(0,1fr))} .s-avg .wv{font-size:66px} .s-slats{width:60%}}\n@media (max-width:760px){.s-heaters{grid-template-columns:minmax(0,1fr)}}\n/* tighter rail now that there are 8 pages + settings */\n.w-nav{min-height:64px;margin:3px 0} .w-nav svg{width:24px;height:24px;margin-bottom:4px} .w-logo{margin-bottom:14px}\n@media (max-height:700px){.w-nav span{display:none} .w-nav{min-height:56px}}\n/* on Screen the frame turns warm too (champagne instead of cyan) */\n.w-warm .w-logo{border-color:rgba(216,195,160,.6);box-shadow:0 0 18px rgba(214,160,100,.35)} .w-warm .w-logo i{background:#e2b07c;box-shadow:0 0 12px #e2b07c}\n.w-warm .w-nav.on{background:rgba(216,195,160,.10);color:#f4ede3} .w-warm .w-nav.on::before{background:#d8c3a0;box-shadow:0 0 10px #c08a5b}\n.w-warm .w-time{color:#f4ede3;text-shadow:0 0 24px rgba(214,160,100,.22)} .w-warm .w-wi svg{color:#e2b07c}\n.w-warm .w-top{border-bottom-color:rgba(216,195,160,.12)}\n/* Comfort Home – decorations (iPad + laptop only) and calendar. Safari 12 friendly. */\n/* ---------- decorations overlay: never catches touches ---------- */\n#deco{position:fixed;top:0;left:0;right:0;bottom:0;z-index:15;pointer-events:none;overflow:hidden}\n#deco *{pointer-events:none}\n.dc-garland{position:absolute;top:0;left:0;right:0;height:22px;border-top:2px solid rgba(60,90,60,.55)}\n.dc-garland i{position:absolute;top:4px;width:9px;height:12px;border-radius:50% 50% 45% 45%;-webkit-animation:dcblink 2.4s ease-in-out infinite alternate;animation:dcblink 2.4s ease-in-out infinite alternate}\n.dc-garland i.c0{background:#ff6b6b;box-shadow:0 0 10px #ff6b6b} .dc-garland i.c1{background:#ffd166;box-shadow:0 0 10px #ffd166} .dc-garland i.c2{background:#5ee6a8;box-shadow:0 0 10px #5ee6a8} .dc-garland i.c3{background:#7cc4ff;box-shadow:0 0 10px #7cc4ff}\n@-webkit-keyframes dcblink{from{opacity:1}to{opacity:.35}} @keyframes dcblink{from{opacity:1}to{opacity:.35}}\n.dc-snow{position:absolute;top:-24px;font-size:13px;color:rgba(255,255,255,.75);-webkit-animation:dcfall 14s linear infinite;animation:dcfall 14s linear infinite}\n.dc-conf{position:absolute;top:-16px;width:7px;height:11px;border-radius:2px;opacity:.75;-webkit-animation:dcfall 11s linear infinite;animation:dcfall 11s linear infinite}\n.dc-conf.c0{background:#f5c451} .dc-conf.c1{background:#e7e9ee} .dc-conf.c2{background:#f472b6} .dc-conf.c3{background:#60a5fa} .dc-conf.c4{background:#a78bfa}\n@-webkit-keyframes dcfall{from{-webkit-transform:translate3d(0,0,0) rotate(0)}to{-webkit-transform:translate3d(30px,110vh,0) rotate(300deg)}}\n@keyframes dcfall{from{transform:translate3d(0,0,0) rotate(0)}to{transform:translate3d(30px,110vh,0) rotate(300deg)}}\n.dc-balloon{position:absolute;bottom:-70px;font-size:40px;opacity:.85;-webkit-animation:dcrise 18s linear infinite;animation:dcrise 18s linear infinite}\n@-webkit-keyframes dcrise{from{-webkit-transform:translate3d(0,0,0)}to{-webkit-transform:translate3d(-20px,-120vh,0)}} @keyframes dcrise{from{transform:translate3d(0,0,0)}to{transform:translate3d(-20px,-120vh,0)}}\n.dc-corner{position:absolute;font-size:30px;opacity:.85}\n.dc-corner.tl{top:8px;left:110px} .dc-corner.tr{top:8px;right:22px} .dc-corner.br{bottom:14px;right:22px}\nhtml:not(.lay-wall) .dc-corner.tl{left:14px} html:not(.lay-wall) .dc-corner.br{bottom:86px}\n.dc-float{-webkit-animation:dcfloat 6s ease-in-out infinite;animation:dcfloat 6s ease-in-out infinite}\n@-webkit-keyframes dcfloat{50%{-webkit-transform:translateY(10px)}} @keyframes dcfloat{50%{transform:translateY(10px)}}\n.dc-glow{position:absolute;top:0;left:0;right:0;height:140px;opacity:.5}\nhtml.deco-halloween .dc-glow{background:linear-gradient(180deg,rgba(124,58,237,.22),rgba(124,58,237,0))}\nhtml.deco-easter .dc-glow{background:linear-gradient(180deg,rgba(190,242,100,.14),rgba(190,242,100,0))}\n@media (prefers-reduced-motion:reduce){#deco *{-webkit-animation:none!important;animation:none!important}}\n/* festive accents (rail indicator, logo, links) – only on iPad/laptop because the classes are never set on the iPhone layout */\nhtml.deco-xmas{--w-cyan:#ff7b7b;--w-cyan2:#5ee6a8} html.deco-halloween{--w-cyan:#fb923c;--w-cyan2:#a78bfa}\nhtml.deco-easter{--w-cyan:#a3e635;--w-cyan2:#f9a8d4} html.deco-newyear{--w-cyan:#f5c451;--w-cyan2:#fde68a} html.deco-birthday{--w-cyan:#f472b6;--w-cyan2:#a78bfa}\nhtml.deco-xmas:not(.lay-wall){--accent:#d64545} html.deco-halloween:not(.lay-wall){--accent:#ea7a1d} html.deco-easter:not(.lay-wall){--accent:#7aa832}\nhtml.deco-newyear:not(.lay-wall){--accent:#c99a1e} html.deco-birthday:not(.lay-wall){--accent:#d6458e}\n/* preview bar */\n#deco-preview{position:fixed;left:50%;bottom:24px;z-index:70;-webkit-transform:translateX(-50%);transform:translateX(-50%);display:-webkit-box;display:-webkit-flex;display:flex;-webkit-align-items:center;align-items:center;padding:8px 8px 8px 18px;border-radius:30px;background:#141a23;color:#eaf2f9;border:1px solid rgba(130,200,255,.25);box-shadow:0 14px 40px rgba(0,0,0,.5);font-size:15px;white-space:nowrap}\n#deco-preview button{height:46px;padding:0 18px;margin-left:10px;border-radius:23px;background:#38bdf8;color:#04121c;font-weight:700;font-size:15px}\n#deco-preview button.ghost{background:rgba(255,255,255,.08);color:#eaf2f9;margin-left:6px}\nhtml:not(.lay-wall) #deco-preview{bottom:calc(var(--nav-h) + var(--safe-b) + 18px)}\n/* settings tiles */\n.deco-grid{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));grid-gap:10px}\n.deco-opt{position:relative;min-height:92px;border-radius:18px;padding:12px;background:var(--card2);border:2px solid transparent;color:var(--text);display:-webkit-box;display:-webkit-flex;display:flex;-webkit-flex-direction:column;flex-direction:column;-webkit-align-items:center;align-items:center;-webkit-justify-content:center;justify-content:center;text-align:center}\n.deco-opt.cur{border-color:var(--accent)} .deco-opt.pv{border-style:dashed;border-color:var(--accent-2,#67e8f9)}\n.deco-sw{font-size:28px;line-height:1;margin-bottom:6px} .deco-l{font-size:13px;font-weight:600} .deco-cur{position:absolute;top:6px;right:8px;font-size:10px;font-weight:700;color:var(--accent);text-transform:uppercase}\n/* ---------- calendar ---------- */\n.cal-info{display:-webkit-box;display:-webkit-flex;display:flex;-webkit-align-items:flex-start;align-items:flex-start;padding:14px 16px;border-radius:18px;background:var(--accent-soft);color:var(--text);margin-bottom:16px;font-size:14px}\n.cal-info svg{width:20px;height:20px;margin-right:12px;-webkit-flex:none;flex:none;color:var(--accent)} .cal-info b{display:block;margin-bottom:2px} .cal-info span{color:var(--text2)} .cal-info.bad svg{color:var(--bad)}\n.cal-wrap{display:grid;grid-template-columns:minmax(0,1fr) 260px;grid-gap:16px;-webkit-align-items:start;align-items:start}\n.cal-main,.cal-side{background:var(--card);border-radius:24px;padding:16px;border:1px solid var(--line)}\nhtml.lay-wall .cal-main,html.lay-wall .cal-side{background:var(--w-panel);border-color:var(--w-border)}\n.cal-head{display:-webkit-box;display:-webkit-flex;display:flex;-webkit-align-items:center;align-items:center;-webkit-justify-content:space-between;justify-content:space-between;-webkit-flex-wrap:wrap;flex-wrap:wrap;margin-bottom:14px}\n.cal-nav,.cal-tools{display:-webkit-box;display:-webkit-flex;display:flex;-webkit-align-items:center;align-items:center;margin-bottom:6px}\n.cal-btn{min-width:46px;height:46px;padding:0 12px;border-radius:23px;background:var(--card2);color:var(--text);display:-webkit-inline-box;display:-webkit-inline-flex;display:inline-flex;-webkit-align-items:center;align-items:center;-webkit-justify-content:center;justify-content:center;margin-right:6px;font-weight:600;font-size:14px;border:1px solid var(--line)}\n.cal-btn svg{width:20px;height:20px} .cal-flip{display:inline-block;-webkit-transform:scaleX(-1);transform:scaleX(-1)} .cal-btn.today{color:var(--accent)}\n.cal-title{margin:0 0 0 8px;font-size:22px;font-weight:400;text-transform:capitalize}\n.cal-date{height:46px;border-radius:14px;border:1px solid var(--line);background:var(--card2);color:var(--text);font-size:16px;padding:0 10px;margin-right:8px;font-family:inherit}\n.cal-seg{display:-webkit-box;display:-webkit-flex;display:flex;background:var(--card2);border-radius:23px;padding:3px;border:1px solid var(--line)}\n.cal-seg button{height:40px;padding:0 14px;border-radius:20px;color:var(--text2);font-weight:600;font-size:14px;background:transparent} .cal-seg button.on{background:var(--accent);color:var(--accent-ink)}\n.cal-dow{display:grid;grid-template-columns:repeat(7,minmax(0,1fr));font-size:12px;font-weight:700;letter-spacing:.08em;text-transform:uppercase;color:var(--muted);margin-bottom:6px;text-align:center}\n.cal-grid{display:grid;grid-template-columns:repeat(7,minmax(0,1fr));grid-gap:4px}\n.cal-cell{min-height:86px;border-radius:12px;padding:6px;text-align:left;background:var(--card2);color:var(--text);border:1px solid transparent;overflow:hidden;display:block}\n.cal-cell.out{opacity:.4} .cal-cell.sel{border-color:var(--line)}\n.cal-dn{display:inline-block;min-width:26px;height:26px;line-height:26px;text-align:center;border-radius:13px;font-size:13px;font-weight:700;margin-bottom:3px}\n.cal-cell.today .cal-dn{background:var(--accent);color:var(--accent-ink);box-shadow:0 0 12px var(--accent-soft)}\n.cal-ev{display:block;font-size:11px;line-height:1.3;padding:2px 4px;margin-top:2px;border-left:3px solid;border-radius:3px;background:rgba(127,127,127,.12);white-space:nowrap;overflow:hidden;text-overflow:ellipsis} .cal-ev b{font-weight:700}\n.cal-more{display:block;font-size:11px;color:var(--muted);margin-top:2px}\n.cal-week{display:grid;grid-template-columns:repeat(7,minmax(0,1fr));grid-gap:6px}\n.cal-wd{background:var(--card2);border-radius:14px;min-height:300px;padding:6px} .cal-wd.today{box-shadow:inset 0 0 0 2px var(--accent)}\n.cal-wh{display:block;width:100%;text-align:center;padding:6px 0;color:var(--text);background:transparent;min-height:52px} .cal-wh span{display:block;font-size:12px;color:var(--muted);text-transform:uppercase} .cal-wh b{font-size:20px;font-weight:400}\n.cal-wd.today .cal-wh b{color:var(--accent);font-weight:700} .cal-none{display:block;text-align:center;color:var(--muted);font-size:12px;margin-top:8px}\n.cal-day{min-height:240px} .cal-item{padding:12px 14px;border-left:4px solid;border-radius:12px;background:var(--card2);margin-bottom:8px}\n.cal-item b{display:block;font-size:16px} .cal-time{display:block;font-size:13px;color:var(--muted);margin-bottom:2px} .cal-loc{display:block;font-size:13px;color:var(--text2);margin-top:2px}\n.cal-empty{color:var(--muted);font-size:14px;margin:10px 2px}\n.cal-side h3{margin:0 0 10px;font-size:12px;font-weight:700;letter-spacing:.14em;text-transform:uppercase;color:var(--muted)}\n.cal-up{padding:8px 10px;border-left:3px solid;border-radius:8px;background:var(--card2);margin-bottom:8px} .cal-up span{display:block;font-size:12px;color:var(--muted);text-transform:capitalize} .cal-up b{font-size:14px}\n@media (max-width:900px){.cal-wrap{grid-template-columns:minmax(0,1fr)} .cal-cell{min-height:70px}}\n/* laptop nav with the extra calendar tab */\nnav.bn .in.n8{grid-template-columns:repeat(8,1fr)}\n\n/* running inside Home Assistant: hide its interface, let the page scroll normally */\nhome-assistant{display:none!important}\nhtml,body{height:auto!important;min-height:100%!important;overflow:visible!important;overflow-y:auto!important;position:static!important}"; head.appendChild(st);
  document.body.insertAdjacentHTML('beforeend', '<div id="app"><main id="view" aria-live="polite"></main><div id="sheet"></div><div id="nav"></div></div><div id="toasts" aria-live="assertive"></div>');
  window.__comfortEmbed = {
    getHass: function () { var h = document.querySelector('home-assistant'); return h && h.hass; },
    logout: function () { var h = document.querySelector('home-assistant'); if (h) h.dispatchEvent(new CustomEvent('hass-logout', { bubbles: true, composed: true })); }
  };
/* Icons: Lucide (ISC licence), https://lucide.dev */
window.ICONS={"grid":"<rect width=\"7\" height=\"7\" x=\"3\" y=\"3\" rx=\"1\"></rect><rect width=\"7\" height=\"7\" x=\"14\" y=\"3\" rx=\"1\"></rect><rect width=\"7\" height=\"7\" x=\"14\" y=\"14\" rx=\"1\"></rect><rect width=\"7\" height=\"7\" x=\"3\" y=\"14\" rx=\"1\"></rect>","home":"<path d=\"M15 21v-8a1 1 0 0 0-1-1h-4a1 1 0 0 0-1 1v8\"></path><path d=\"M3 10a2 2 0 0 1 .709-1.528l7-5.999a2 2 0 0 1 2.582 0l7 5.999A2 2 0 0 1 21 10v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z\"></path>","climate":"<path d=\"M6 12H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2\"></path><path d=\"M6 8h12\"></path><path d=\"M18.3 17.7a2.5 2.5 0 0 1-3.16 3.83 2.53 2.53 0 0 1-1.14-2V12\"></path><path d=\"M6.6 15.6A2 2 0 1 0 10 17v-5\"></path>","rooms":"<rect width=\"7\" height=\"7\" x=\"3\" y=\"3\" rx=\"1\"></rect><rect width=\"7\" height=\"7\" x=\"14\" y=\"3\" rx=\"1\"></rect><rect width=\"7\" height=\"7\" x=\"14\" y=\"14\" rx=\"1\"></rect><rect width=\"7\" height=\"7\" x=\"3\" y=\"14\" rx=\"1\"></rect>","devices":"<rect width=\"20\" height=\"12\" x=\"2\" y=\"6\" rx=\"6\" ry=\"6\"></rect><circle cx=\"16\" cy=\"12\" r=\"2\"></circle>","settings":"<path d=\"M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z\"></path><circle cx=\"12\" cy=\"12\" r=\"3\"></circle>","sofa":"<path d=\"M20 9V6a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v3\"></path><path d=\"M2 16a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-5a2 2 0 0 0-4 0v1.5a.5.5 0 0 1-.5.5h-11a.5.5 0 0 1-.5-.5V11a2 2 0 0 0-4 0z\"></path><path d=\"M4 18v2\"></path><path d=\"M20 18v2\"></path><path d=\"M12 4v9\"></path>","bed":"<path d=\"M2 20v-8a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v8\"></path><path d=\"M4 10V6a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v4\"></path><path d=\"M12 4v6\"></path><path d=\"M2 18h20\"></path>","kitchen":"<path d=\"M2 12h20\"></path><path d=\"M20 12v8a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2v-8\"></path><path d=\"m4 8 16-4\"></path><path d=\"m8.86 6.78-.45-1.81a2 2 0 0 1 1.45-2.43l1.94-.48a2 2 0 0 1 2.43 1.46l.45 1.8\"></path>","attic":"<path d=\"M15 21v-8a1 1 0 0 0-1-1h-4a1 1 0 0 0-1 1v8\"></path><path d=\"M3 10a2 2 0 0 1 .709-1.528l7-5.999a2 2 0 0 1 2.582 0l7 5.999A2 2 0 0 1 21 10v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z\"></path>","bath":"<path d=\"M10 4 8 6\"></path><path d=\"M17 19v2\"></path><path d=\"M2 12h20\"></path><path d=\"M7 19v2\"></path><path d=\"M9 5 7.621 3.621A2.121 2.121 0 0 0 4 5v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-5\"></path>","office":"<path d=\"M16 20V4a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16\"></path><rect width=\"20\" height=\"14\" x=\"2\" y=\"6\" rx=\"2\"></rect>","baby":"<path d=\"M9 12h.01\"></path><path d=\"M15 12h.01\"></path><path d=\"M10 16c.5.3 1.2.5 2 .5s1.5-.2 2-.5\"></path><path d=\"M19 6.3a9 9 0 0 1 1.8 3.9 2 2 0 0 1 0 3.6 9 9 0 0 1-17.6 0 2 2 0 0 1 0-3.6A9 9 0 0 1 12 3c2 0 3.5 1.1 3.5 2.5s-.9 2.5-2 2.5c-.8 0-1.5-.4-1.5-1\"></path>","garage":"<path d=\"M19 17h2c.6 0 1-.4 1-1v-3c0-.9-.7-1.7-1.5-1.9C18.7 10.6 16 10 16 10s-1.3-1.4-2.2-2.3c-.5-.4-1.1-.7-1.8-.7H5c-.6 0-1.1.4-1.4.9l-1.4 2.9A3.7 3.7 0 0 0 2 12v4c0 .6.4 1 1 1h2\"></path><circle cx=\"7\" cy=\"17\" r=\"2\"></circle><path d=\"M9 17h6\"></path><circle cx=\"17\" cy=\"17\" r=\"2\"></circle>","garden":"<path d=\"M10 10v.2A3 3 0 0 1 8.9 16H5a3 3 0 0 1-1-5.8V10a3 3 0 0 1 6 0Z\"></path><path d=\"M7 16v6\"></path><path d=\"M13 19v3\"></path><path d=\"M12 19h8.3a1 1 0 0 0 .7-1.7L18 14h.3a1 1 0 0 0 .7-1.7L16 9h.2a1 1 0 0 0 .8-1.7L13 3l-1.4 1.5\"></path>","door":"<path d=\"M13 4h3a2 2 0 0 1 2 2v14\"></path><path d=\"M2 20h3\"></path><path d=\"M13 20h9\"></path><path d=\"M10 12v.01\"></path><path d=\"M13 4.562v16.157a1 1 0 0 1-1.242.97L5 20V5.562a2 2 0 0 1 1.515-1.94l4-1A2 2 0 0 1 13 4.561Z\"></path>","stairs":"<path d=\"m21 16-4 4-4-4\"></path><path d=\"M17 20V4\"></path><path d=\"m3 8 4-4 4 4\"></path><path d=\"M7 4v16\"></path>","dining":"<path d=\"M3 2v7c0 1.1.9 2 2 2h4a2 2 0 0 0 2-2V2\"></path><path d=\"M7 2v20\"></path><path d=\"M21 15V2a5 5 0 0 0-5 5v6c0 1.1.9 2 2 2h3Zm0 0v7\"></path>","laundry":"<path d=\"M20.38 3.46 16 2a4 4 0 0 1-8 0L3.62 3.46a2 2 0 0 0-1.34 2.23l.58 3.47a1 1 0 0 0 .99.84H6v10c0 1.1.9 2 2 2h8a2 2 0 0 0 2-2V10h2.15a1 1 0 0 0 .99-.84l.58-3.47a2 2 0 0 0-1.34-2.23z\"></path>","game":"<line x1=\"6\" x2=\"10\" y1=\"11\" y2=\"11\"></line><line x1=\"8\" x2=\"8\" y1=\"9\" y2=\"13\"></line><line x1=\"15\" x2=\"15.01\" y1=\"12\" y2=\"12\"></line><line x1=\"18\" x2=\"18.01\" y1=\"10\" y2=\"10\"></line><path d=\"M17.32 5H6.68a4 4 0 0 0-3.978 3.59c-.006.052-.01.101-.017.152C2.604 9.416 2 14.456 2 16a3 3 0 0 0 3 3c1 0 1.5-.5 2-1l1.414-1.414A2 2 0 0 1 9.828 16h4.344a2 2 0 0 1 1.414.586L17 18c.5.5 1 1 2 1a3 3 0 0 0 3-3c0-1.545-.604-6.584-.685-7.258-.007-.05-.011-.1-.017-.151A4 4 0 0 0 17.32 5z\"></path>","gym":"<path d=\"M14.4 14.4 9.6 9.6\"></path><path d=\"M18.657 21.485a2 2 0 1 1-2.829-2.828l-1.767 1.768a2 2 0 1 1-2.829-2.829l6.364-6.364a2 2 0 1 1 2.829 2.829l-1.768 1.767a2 2 0 1 1 2.828 2.829z\"></path><path d=\"m21.5 21.5-1.4-1.4\"></path><path d=\"M3.9 3.9 2.5 2.5\"></path><path d=\"M6.404 12.768a2 2 0 1 1-2.829-2.829l1.768-1.767a2 2 0 1 1-2.828-2.829l2.828-2.828a2 2 0 1 1 2.829 2.828l1.767-1.768a2 2 0 1 1 2.829 2.829z\"></path>","room":"<path d=\"M5 3a2 2 0 0 0-2 2\"></path><path d=\"M19 3a2 2 0 0 1 2 2\"></path><path d=\"M21 19a2 2 0 0 1-2 2\"></path><path d=\"M5 21a2 2 0 0 1-2-2\"></path><path d=\"M9 3h1\"></path><path d=\"M9 21h1\"></path><path d=\"M14 3h1\"></path><path d=\"M14 21h1\"></path><path d=\"M3 9v1\"></path><path d=\"M21 9v1\"></path><path d=\"M3 14v1\"></path><path d=\"M21 14v1\"></path>","light":"<path d=\"M15 14c.2-1 .7-1.7 1.5-2.5 1-.9 1.5-2.2 1.5-3.5A6 6 0 0 0 6 8c0 1 .2 2.2 1.5 3.5.7.7 1.3 1.5 1.5 2.5\"></path><path d=\"M9 18h6\"></path><path d=\"M10 22h4\"></path>","plug":"<path d=\"M12 22v-5\"></path><path d=\"M9 8V2\"></path><path d=\"M15 8V2\"></path><path d=\"M18 8v5a4 4 0 0 1-4 4h-4a4 4 0 0 1-4-4V8Z\"></path>","tv":"<rect width=\"20\" height=\"15\" x=\"2\" y=\"7\" rx=\"2\" ry=\"2\"></rect><polyline points=\"17 2 12 7 7 2\"></polyline>","fan":"<path d=\"M10.827 16.379a6.082 6.082 0 0 1-8.618-7.002l5.412 1.45a6.082 6.082 0 0 1 7.002-8.618l-1.45 5.412a6.082 6.082 0 0 1 8.618 7.002l-5.412-1.45a6.082 6.082 0 0 1-7.002 8.618l1.45-5.412Z\"></path><path d=\"M12 12v.01\"></path>","blinds":"<path d=\"M3 3h18\"></path><path d=\"M20 7H8\"></path><path d=\"M20 11H8\"></path><path d=\"M10 19h10\"></path><path d=\"M8 15h12\"></path><path d=\"M4 3v14\"></path><circle cx=\"4\" cy=\"19\" r=\"2\"></circle>","switch":"<rect width=\"20\" height=\"12\" x=\"2\" y=\"6\" rx=\"6\" ry=\"6\"></rect><circle cx=\"8\" cy=\"12\" r=\"2\"></circle>","power":"<path d=\"M12 2v10\"></path><path d=\"M18.4 6.6a9 9 0 1 1-12.77.04\"></path>","speaker":"<rect width=\"16\" height=\"20\" x=\"4\" y=\"2\" rx=\"2\"></rect><path d=\"M12 6h.01\"></path><circle cx=\"12\" cy=\"14\" r=\"4\"></circle><path d=\"M12 14h.01\"></path>","lock":"<rect width=\"18\" height=\"11\" x=\"3\" y=\"11\" rx=\"2\" ry=\"2\"></rect><path d=\"M7 11V7a5 5 0 0 1 10 0v4\"></path>","heater":"<path d=\"M11 8c2-3-2-3 0-6\"></path><path d=\"M15.5 8c2-3-2-3 0-6\"></path><path d=\"M6 10h.01\"></path><path d=\"M6 14h.01\"></path><path d=\"M10 16v-4\"></path><path d=\"M14 16v-4\"></path><path d=\"M18 16v-4\"></path><path d=\"M20 6a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h3\"></path><path d=\"M5 20v2\"></path><path d=\"M19 20v2\"></path>","thermo":"<path d=\"M14 4v10.54a4 4 0 1 1-4 0V4a2 2 0 0 1 4 0Z\"></path>","drop":"<path d=\"M7 16.3c2.2 0 4-1.83 4-4.05 0-1.16-.57-2.26-1.71-3.19S7.29 6.75 7 5.3c-.29 1.45-1.14 2.84-2.29 3.76S3 11.1 3 12.25c0 2.22 1.8 4.05 4 4.05z\"></path><path d=\"M12.56 6.6A10.97 10.97 0 0 0 14 3.02c.5 2.5 2 4.9 4 6.5s3 3.5 3 5.5a6.98 6.98 0 0 1-11.91 4.97\"></path>","droplet":"<path d=\"M12 22a7 7 0 0 0 7-7c0-2-1-3.9-3-5.5s-3.5-4-4-6.5c-.5 2.5-2 4.9-4 6.5C6 11.1 5 13 5 15a7 7 0 0 0 7 7z\"></path>","snow":"<line x1=\"2\" x2=\"22\" y1=\"12\" y2=\"12\"></line><line x1=\"12\" x2=\"12\" y1=\"2\" y2=\"22\"></line><path d=\"m20 16-4-4 4-4\"></path><path d=\"m4 8 4 4-4 4\"></path><path d=\"m16 4-4 4-4-4\"></path><path d=\"m8 20 4-4 4 4\"></path>","flame":"<path d=\"M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z\"></path>","wind":"<path d=\"M12.8 19.6A2 2 0 1 0 14 16H2\"></path><path d=\"M17.5 8a2.5 2.5 0 1 1 2 4H2\"></path><path d=\"M9.8 4.4A2 2 0 1 1 11 8H2\"></path>","sun":"<circle cx=\"12\" cy=\"12\" r=\"4\"></circle><path d=\"M12 2v2\"></path><path d=\"M12 20v2\"></path><path d=\"m4.93 4.93 1.41 1.41\"></path><path d=\"m17.66 17.66 1.41 1.41\"></path><path d=\"M2 12h2\"></path><path d=\"M20 12h2\"></path><path d=\"m6.34 17.66-1.41 1.41\"></path><path d=\"m19.07 4.93-1.41 1.41\"></path>","moon":"<path d=\"M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z\"></path>","sunmoon":"<path d=\"M12 8a2.83 2.83 0 0 0 4 4 4 4 0 1 1-4-4\"></path><path d=\"M12 2v2\"></path><path d=\"M12 20v2\"></path><path d=\"m4.9 4.9 1.4 1.4\"></path><path d=\"m17.7 17.7 1.4 1.4\"></path><path d=\"M2 12h2\"></path><path d=\"M20 12h2\"></path><path d=\"m6.3 17.7-1.4 1.4\"></path><path d=\"m19.1 4.9-1.4 1.4\"></path>","auto":"<path d=\"M9.937 15.5A2 2 0 0 0 8.5 14.063l-6.135-1.582a.5.5 0 0 1 0-.962L8.5 9.936A2 2 0 0 0 9.937 8.5l1.582-6.135a.5.5 0 0 1 .963 0L14.063 8.5A2 2 0 0 0 15.5 9.937l6.135 1.581a.5.5 0 0 1 0 .964L15.5 14.063a2 2 0 0 0-1.437 1.437l-1.582 6.135a.5.5 0 0 1-.963 0z\"></path><path d=\"M20 3v4\"></path><path d=\"M22 5h-4\"></path><path d=\"M4 17v2\"></path><path d=\"M5 18H3\"></path>","heatcool":"<path d=\"M12 9a4 4 0 0 0-2 7.5\"></path><path d=\"M12 3v2\"></path><path d=\"m6.6 18.4-1.4 1.4\"></path><path d=\"M20 4v10.54a4 4 0 1 1-4 0V4a2 2 0 0 1 4 0Z\"></path><path d=\"M4 13H2\"></path><path d=\"M6.34 7.34 4.93 5.93\"></path>","repeat":"<path d=\"M12 2v20\"></path><path d=\"m8 18 4 4 4-4\"></path><path d=\"m8 6 4-4 4 4\"></path>","plus":"<path d=\"M5 12h14\"></path><path d=\"M12 5v14\"></path>","minus":"<path d=\"M5 12h14\"></path>","back":"<path d=\"m15 18-6-6 6-6\"></path>","chev":"<path d=\"m9 18 6-6-6-6\"></path>","search":"<circle cx=\"11\" cy=\"11\" r=\"8\"></circle><path d=\"m21 21-4.3-4.3\"></path>","star":"<path d=\"M11.525 2.295a.53.53 0 0 1 .95 0l2.31 4.679a2.123 2.123 0 0 0 1.595 1.16l5.166.756a.53.53 0 0 1 .294.904l-3.736 3.638a2.123 2.123 0 0 0-.611 1.878l.882 5.14a.53.53 0 0 1-.771.56l-4.618-2.428a2.122 2.122 0 0 0-1.973 0L6.396 21.01a.53.53 0 0 1-.77-.56l.881-5.139a2.122 2.122 0 0 0-.611-1.879L2.16 9.795a.53.53 0 0 1 .294-.906l5.165-.755a2.122 2.122 0 0 0 1.597-1.16z\"></path>","wifi":"<path d=\"M12 20h.01\"></path><path d=\"M2 8.82a15 15 0 0 1 20 0\"></path><path d=\"M5 12.859a10 10 0 0 1 14 0\"></path><path d=\"M8.5 16.429a5 5 0 0 1 7 0\"></path>","wifioff":"<path d=\"M12 20h.01\"></path><path d=\"M8.5 16.429a5 5 0 0 1 7 0\"></path><path d=\"M5 12.859a10 10 0 0 1 5.17-2.69\"></path><path d=\"M19 12.859a10 10 0 0 0-2.007-1.523\"></path><path d=\"M2 8.82a15 15 0 0 1 4.177-2.643\"></path><path d=\"M22 8.82a15 15 0 0 0-11.288-3.764\"></path><path d=\"m2 2 20 20\"></path>","up":"<polyline points=\"22 7 13.5 15.5 8.5 10.5 2 17\"></polyline><polyline points=\"16 7 22 7 22 13\"></polyline>","down":"<polyline points=\"22 17 13.5 8.5 8.5 13.5 2 7\"></polyline><polyline points=\"16 17 22 17 22 11\"></polyline>","flat":"<path d=\"M18 8L22 12L18 16\"></path><path d=\"M2 12H22\"></path>","ok":"<circle cx=\"12\" cy=\"12\" r=\"10\"></circle><path d=\"m9 12 2 2 4-4\"></path>","alert":"<circle cx=\"12\" cy=\"12\" r=\"10\"></circle><line x1=\"12\" x2=\"12\" y1=\"8\" y2=\"12\"></line><line x1=\"12\" x2=\"12.01\" y1=\"16\" y2=\"16\"></line>","refresh":"<path d=\"M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8\"></path><path d=\"M21 3v5h-5\"></path><path d=\"M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16\"></path><path d=\"M8 16H3v5\"></path>","x":"<path d=\"M18 6 6 18\"></path><path d=\"m6 6 12 12\"></path>","info":"<circle cx=\"12\" cy=\"12\" r=\"10\"></circle><path d=\"M12 16v-4\"></path><path d=\"M12 8h.01\"></path>","eye":"<path d=\"M2.062 12.348a1 1 0 0 1 0-.696 10.75 10.75 0 0 1 19.876 0 1 1 0 0 1 0 .696 10.75 10.75 0 0 1-19.876 0\"></path><circle cx=\"12\" cy=\"12\" r=\"3\"></circle>","eyeoff":"<path d=\"M10.733 5.076a10.744 10.744 0 0 1 11.205 6.575 1 1 0 0 1 0 .696 10.747 10.747 0 0 1-1.444 2.49\"></path><path d=\"M14.084 14.158a3 3 0 0 1-4.242-4.242\"></path><path d=\"M17.479 17.499a10.75 10.75 0 0 1-15.417-5.151 1 1 0 0 1 0-.696 10.75 10.75 0 0 1 4.446-5.143\"></path><path d=\"m2 2 20 20\"></path>","logout":"<path d=\"M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4\"></path><polyline points=\"16 17 21 12 16 7\"></polyline><line x1=\"21\" x2=\"9\" y1=\"12\" y2=\"12\"></line>","play":"<polygon points=\"6 3 20 12 6 21 6 3\"></polygon>","pause":"<rect x=\"14\" y=\"4\" width=\"4\" height=\"16\" rx=\"1\"></rect><rect x=\"6\" y=\"4\" width=\"4\" height=\"16\" rx=\"1\"></rect>","stop":"<rect width=\"18\" height=\"18\" x=\"3\" y=\"3\" rx=\"2\"></rect>","open":"<path d=\"m17 11-5-5-5 5\"></path><path d=\"m17 18-5-5-5 5\"></path>","close":"<path d=\"m7 6 5 5 5-5\"></path><path d=\"m7 13 5 5 5-5\"></path>","contrast":"<circle cx=\"12\" cy=\"12\" r=\"10\"></circle><path d=\"M12 18a6 6 0 0 0 0-12v12z\"></path>","server":"<rect width=\"20\" height=\"8\" x=\"2\" y=\"2\" rx=\"2\" ry=\"2\"></rect><rect width=\"20\" height=\"8\" x=\"2\" y=\"14\" rx=\"2\" ry=\"2\"></rect><line x1=\"6\" x2=\"6.01\" y1=\"6\" y2=\"6\"></line><line x1=\"6\" x2=\"6.01\" y1=\"18\" y2=\"18\"></line>","key":"<path d=\"M2.586 17.414A2 2 0 0 0 2 18.828V21a1 1 0 0 0 1 1h3a1 1 0 0 0 1-1v-1a1 1 0 0 1 1-1h1a1 1 0 0 0 1-1v-1a1 1 0 0 1 1-1h.172a2 2 0 0 0 1.414-.586l.814-.814a6.5 6.5 0 1 0-4-4z\"></path><circle cx=\"16.5\" cy=\"7.5\" r=\".5\" fill=\"currentColor\"></circle>","link":"<path d=\"M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71\"></path><path d=\"M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71\"></path>","smartphone":"<rect width=\"14\" height=\"20\" x=\"5\" y=\"2\" rx=\"2\" ry=\"2\"></rect><path d=\"M12 18h.01\"></path>","motion":"<path d=\"M22 12h-2.48a2 2 0 0 0-1.93 1.46l-2.35 8.36a.25.25 0 0 1-.48 0L9.24 2.18a.25.25 0 0 0-.48 0l-2.35 8.36A2 2 0 0 1 4.49 12H2\"></path>","window":"<rect x=\"2\" y=\"4\" width=\"20\" height=\"16\" rx=\"2\"></rect><path d=\"M10 4v4\"></path><path d=\"M2 8h20\"></path><path d=\"M6 4v4\"></path>","battery":"<rect width=\"16\" height=\"10\" x=\"2\" y=\"7\" rx=\"2\" ry=\"2\"></rect><line x1=\"22\" x2=\"22\" y1=\"11\" y2=\"13\"></line><line x1=\"6\" x2=\"6\" y1=\"11\" y2=\"13\"></line><line x1=\"10\" x2=\"10\" y1=\"11\" y2=\"13\"></line>","bolt":"<path d=\"M4 14a1 1 0 0 1-.78-1.63l9.9-10.2a.5.5 0 0 1 .86.46l-1.92 6.02A1 1 0 0 0 13 10h7a1 1 0 0 1 .78 1.63l-9.9 10.2a.5.5 0 0 1-.86-.46l1.92-6.02A1 1 0 0 0 11 14z\"></path>","leaf":"<path d=\"M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10Z\"></path><path d=\"M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12\"></path>","shield":"<path d=\"M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z\"></path><path d=\"m9 12 2 2 4-4\"></path>","list":"<path d=\"M3 12h.01\"></path><path d=\"M3 18h.01\"></path><path d=\"M3 6h.01\"></path><path d=\"M8 12h13\"></path><path d=\"M8 18h13\"></path><path d=\"M8 6h13\"></path>","clock":"<circle cx=\"12\" cy=\"12\" r=\"10\"></circle><polyline points=\"12 6 12 12 16 14\"></polyline>"};

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
<div class="w-weather">${out.v != null ? `<span class="w-wi">${ic(WI[cond] || 'sun')}</span><span class="w-out num">${T(out.v)}</span><span class="w-wl">${esc(cond ? wName(cond) : L('Outside', 'Buiten'))}</span>` : ''}</div>
<div class="w-stat"><span class="w-chip" title="${L('Lights on', 'Lampen aan')}">${ic('light')}<b class="num">${lamps}</b></span><span class="w-chip" title="${L('Air conditioners on', 'Airco’s aan')}">${ic('climate')}<b class="num">${acsOn}</b></span>${unav ? `<span class="w-chip warn">${ic('alert')}<b class="num">${unav}</b></span>` : ''}<span class="w-conn ${conn}"><i></i>${esc(connTxt)}</span></div></header>`;
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
      let out = `<button class="s-avg" data-wact="screen-heat" data-k="s-avg"><span class="s-slats" aria-hidden="true"></span><span class="s-avg-l"><span class="s-cap">${L('Average house temperature', 'Gemiddelde huistemperatuur')}</span>${tempBig(avg)}<span class="s-avg-sub">${ok.length ? L(`Average of ${ok.length} rooms`, `Gemiddelde van ${ok.length} kamers`) : L('No valid sensor values', 'Geen geldige sensorwaarden')}${bad.length ? ' · ' + bad.map((y) => esc(y.x.label) + (y.v == null ? '' : L(' (backup sensor)', ' (reservesensor)'))).join(', ') + L(': sensor unavailable', ': sensor niet beschikbaar') : ''}</span></span>
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
      return `<div class="s-heater ${hs.k}${S.pending[e] ? ' busy' : ''}" data-k="s-h-${esc(e)}"><div class="s-hh"><div><b>${esc(name)}</b><span class="s-hs ${hs.k}">${ic('flame')}${esc(hs.t)}</span></div>${canOff ? `<button class="s-pwr${on ? ' on' : ''}" data-act="clim-power" data-eid="${esc(e)}" ${ok ? '' : 'disabled'} aria-pressed="${on}" aria-label="${esc(name)} ${L('on/off', 'aan/uit')}">${ic('power')}</button>` : ''}</div>
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
      const ctl = r.devs.filter((e) => m.kind[e] !== 'climate'); const cl = r.devs.filter((e) => m.kind[e] === 'climate');
      const sens = r.temps.concat(r.hums, r.other); sens.forEach((e) => core.st(e)); r.bins.forEach((e) => core.st(e));
      const label = (SCREEN_ROOMS.find((x) => new RegExp(x[0], 'i').test(r.name)) || [0, r.name])[1];
      let out = `<div class="s-bar"><button class="s-back" data-wact="screen-back">${ic('back')}<span>Screen</span></button><h1>${esc(label)}</h1><span class="s-bar-t">${tempBig(v)}${h != null ? `<span class="s-bar-h">${ic('drop')}${Math.round(h)}%</span>` : ''}</span></div>`;
      if (ctl.length) out += panel(L('Control', 'Bediening'), `<div class="w-tiles">${ctl.map((e) => tile(e)).join('')}</div>`, 's-p-ctl');
      if (cl.length) out += panel(L('Heating & air conditioning', 'Verwarming en airco'), `<div class="s-heaters">${cl.map(heaterCard).join('')}</div>`, 's-p-cl');
      if (sens.length || r.bins.length) out += panel(L('Sensors', 'Sensoren'), `<div class="w-bins">${sens.concat(r.bins).map((e) => { const s = S.states[e]; return `<div class="w-bin${core.avail(s) ? '' : ' na'}${s && s.state === 'on' && e.startsWith('binary_sensor.') ? ' on' : ''}"><span class="w-si">${ic(r.temps.indexOf(e) >= 0 ? 'thermo' : r.hums.indexOf(e) >= 0 ? 'drop' : e.startsWith('binary_sensor.') ? 'window' : (dc(e) === 'power' || dc(e) === 'energy') ? 'bolt' : 'info')}</span><span class="w-sl">${esc(core.nameOf(e))}</span><span class="w-sv num">${esc(core.stateText(e, s))}</span></div>`; }).join('')}</div>`, 's-p-sens');
      if (!ctl.length && !cl.length && !sens.length && !r.bins.length) out += `<p class="w-empty">${L('No devices in this room.', 'Geen apparaten in deze kamer.')}</p>`;
      return out;
    }
    function pScreen(m) { return W.sub && W.sub.t === 'heat' ? screenHeat(m) : W.sub && W.sub.t === 'room' ? screenRoom(m, W.sub.id) : screenMain(m); }

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
      else body = W.page === 'screen' ? pScreen(m) : W.page === 'calendar' ? (core.extra() ? core.extra().calendarHTML(true) : '') : W.page === 'lights' ? pLights(m) : W.page === 'climate' ? pClimate(m) : W.page === 'devices' ? pDevices(m) : W.page === 'sensors' ? pSensors(m) : W.page === 'autos' ? pAutos() : pHome(m);
      core.st('__clock');
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

    // own events: page navigation and "all off" (device controls use the app's existing data-act handlers)
    document.addEventListener('click', (ev) => {
      const el = ev.target.closest && ev.target.closest('[data-wact]'); if (!el || !active()) return;
      const a = el.dataset.wact;
      if (a === 'page') go(el.dataset.v); else if (a === 'alloff') allOff();
      else if (a === 'screen-heat') { W.sub = { t: 'heat' }; core.schedule(true); window.scrollTo(0, 0); }
      else if (a === 'screen-room') { W.sub = { t: 'room', id: el.dataset.v }; core.schedule(true); window.scrollTo(0, 0); }
      else if (a === 'screen-back') { W.sub = null; core.schedule(true); window.scrollTo(0, 0); }
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
      if (Date.now() - W.lastTouch > 180000 && (W.page !== startPage() || W.sub || S.sheet)) { W.lastTouch = Date.now(); S.sheet = null; W.sub = null; W.page = startPage(); core.schedule(true); window.scrollTo(0, 0); }
    }, 5000);

    return { active, render, go, page: () => W.page };
  };
})();

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
    function fetchRange(a, b, key, cb) {
      const cals = calendars(); if (!cals.length || CAL.loading[key]) return;
      const c = CAL.cache[key]; if (c && Date.now() - c.at < 5 * 60e3) return;
      CAL.loading[key] = true;
      Promise.all(cals.map((cal, ci) => core.api('GET', 'calendars/' + cal + '?start=' + encodeURIComponent(a.toISOString()) + '&end=' + encodeURIComponent(b.toISOString()))
        .then((list) => (list || []).map((ev) => parseEv(ev, cal, ci))).catch((er) => { CAL.err = er.message; return []; })))
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
      const noCal = !calendars().length;
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
      const inner = `${info}<div class="cal-wrap"><section class="cal-main">${head}${body}</section>${side}</div>`;
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

/* Comfort Home — a calm smart-home app for Home Assistant. */
(function () {
  'use strict';
  const VERSION = '1.11.0';
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
    favorites: [], roomMain: {}, devGroup: 'type', climate: null, lastMode: {}, discoSwitches: [], lang: 'en', layout: 'auto', wallStart: 'home', deco: 'none' };
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
      'Turn on': 'Aanzetten', 'Turn off': 'Uitzetten', 'Run': 'Start',
      'Change dashboard': 'Dashboard wisselen', 'Back to Home': 'Terug naar Thuis', 'Changed just now': 'Net veranderd', 'Changed {x} ago': '{x} geleden veranderd', 'Connecting to Home Assistant…': 'Verbinden met Home Assistant…', 'Connection lost. Reconnecting…': 'Verbinding kwijt. Opnieuw verbinden…', 'Showing last known values': 'Laatst bekende waarden', 'Retry': 'Opnieuw', 'Air conditioners': 'Airco’s', 'Ticked = shown on the Climate page and controlled together. Heating is shown as a separate button.': 'Aangevinkt = staat op de Klimaat-pagina en wordt samen bediend. Verwarming staat als aparte knop onderaan.', 'House average': 'Gemiddeld in huis', 'Tap to control all {n} air conditioners at once': 'Tik om alle {n} airco’s tegelijk te regelen', 'Per room': 'Per kamer', 'Heating': 'Verwarming', 'All air conditioners': 'Alle airco’s', 'House {t}': 'Huis {t}', 'Room temperature': 'Kamertemperatuur', 'Info': 'Info', 'Search everything': 'Zoek alles', 'Nothing found.': 'Niets gevonden.', 'Show more': 'Meer tonen', 'History': 'Geschiedenis', 'General': 'Algemeen', 'All information': 'Alle informatie', 'Device': 'Apparaat', 'Also on this device': 'Ook op dit apparaat', 'Open in Home Assistant': 'Openen in Home Assistant', 'Min': 'Min', 'Average': 'Gemiddeld', 'Max': 'Max', 'Now': 'Nu', 'No history in this period.': 'Geen geschiedenis in deze periode.', 'This entity does not exist (anymore).': 'Dit bestaat niet (meer).', 'Entity ID': 'Entiteit-ID', 'State': 'Status', 'Room': 'Kamer', 'Last changed': 'Laatst veranderd', 'Last updated': 'Laatst bijgewerkt', 'Integration': 'Integratie', 'Manufacturer': 'Merk', 'Model': 'Model', 'Firmware': 'Firmware', 'Hardware': 'Hardware', 'Yes': 'Ja', 'No': 'Nee', 'Dashboard': 'Dashboard', 'Comfort stays your start screen. Come back any time via the Comfort item in the Home Assistant menu.': 'Comfort blijft je startscherm. Je komt altijd terug via “Comfort” in het Home Assistant-menu.', 'Sensors': 'Sensoren', 'Status sensors': 'Statussensoren', 'Lights': 'Lampen', 'Switches': 'Schakelaars', 'Automations': 'Automatiseringen', 'People': 'Personen', 'Trackers': 'Trackers', 'Weather': 'Weer', 'Sun': 'Zon', 'Updates': 'Updates', 'Buttons': 'Knoppen', 'Numbers': 'Getallen', 'Selects': 'Keuzes', 'Fans': 'Ventilatoren', 'Blinds': 'Zonwering', 'Locks': 'Sloten', 'Scenes': 'Scènes', 'Scripts': 'Scripts', 'Helpers': 'Helpers', 'Cameras': 'Camera’s', 'Media': 'Media', 'Water heater': 'Warm water', 'To-do lists': 'Takenlijsten', 'Calendar': 'Agenda', 'Controls': 'Bediening', 'Set time': 'Tijden', 'Next': 'Volgende', 'New timer': 'Nieuwe tijd', 'Edit timer': 'Tijd aanpassen', 'Name': 'Naam', 'Time': 'Tijd', 'Days': 'Dagen', 'Save': 'Opslaan', 'Delete': 'Verwijderen', 'Every day': 'Elke dag', 'Weekdays': 'Werkdagen', 'Weekend': 'Weekend', 'Timers': 'Tijden', 'Other automations': 'Andere automatiseringen', 'Edit in Home Assistant': 'Bewerken in Home Assistant', 'Run now': 'Nu uitvoeren', 'No timers yet. Tap + to make one.': 'Nog geen tijden. Tik op + om er een te maken.', 'Choose devices': 'Kies apparaten', 'in {x}': 'over {x}', 'Sunrise': 'Zonsopkomst', 'Sunset': 'Zonsondergang', 'Home Assistant pages': 'Home Assistant-pagina’s', 'Overview': 'Overzicht', 'Energy': 'Energie', 'Map': 'Kaart', 'Logbook': 'Logboek', 'History': 'Geschiedenis', 'Profile': 'Profiel', 'Choose another default dashboard here': 'Kies hier een ander standaarddashboard', 'Saved': 'Opgeslagen', 'Deleted': 'Verwijderd', 'Only administrators can change timers.': 'Alleen beheerders kunnen tijden aanpassen.', 'Made in Home Assistant: you can switch it on or off here.': 'Gemaakt in Home Assistant: hier kun je hem aan- of uitzetten.', 'Search': 'Zoeken', 'Back to the normal Home Assistant screens': 'Terug naar de normale Home Assistant-schermen', 'Switch': 'Wissel', 'All': 'Alles',
      'mon': 'ma', 'tue': 'di', 'wed': 'wo', 'thu': 'do', 'fri': 'vr', 'sat': 'za', 'sun': 'zo'
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
      'Turn on': 'Power on', 'Turn off': 'Power off', 'Run': 'Activate',
      'Change dashboard': 'Switch world', 'Back to Home': 'Back to Base', 'House average': 'Base average', 'Per room': 'Per chamber', 'All air conditioners': 'All ice machines', 'Info': 'F3 Debug', 'Search everything': 'Search all blocks', 'Heating': 'Furnaces', 'History': 'Logs', 'Device': 'Block', 'Set time': 'Clock', 'Automations': 'Contraptions', 'Next': 'Next tick', 'New timer': 'New redstone clock', 'Edit timer': 'Edit clock', 'Timers': 'Redstone clocks', 'Other automations': 'Other contraptions', 'Save': 'Craft', 'Delete': 'Break', 'Choose devices': 'Pick blocks', 'Home Assistant pages': 'Other worlds', 'Saved': 'Crafted!', 'Deleted': 'Broken', 'No timers yet. Tap + to make one.': 'No clocks yet. Tap + to build one.', 'Sunrise': 'Sunrise', 'Sunset': 'Sunset'
    }
  };
  const t = (s, vars) => { let r = (I18N[settings.lang] && I18N[settings.lang][s]) || s; if (vars) Object.keys(vars).forEach((k) => { r = r.split('{' + k + '}').join(vars[k]); }); return r; };
  const loc = () => (settings.lang === 'nl' ? 'nl-NL' : undefined);
  const dayShort = (d) => (settings.lang === 'nl' ? t(d) : cap(d)).slice(0, 2);

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
  let WALL = null;         // iPad wall-panel layout (wall.js), created at boot
  let EXTRA = null;        // decorations + calendar + auto-update for iPad/laptop (extra.js)
  /* which layout is showing now: 'ipad' (wall panel), 'laptop' or 'iphone' (Settings → Device Layout; Automatic follows the screen) */
  function effLayout() {
    if (WALL && WALL.active()) return 'ipad';
    const l = settings.layout || 'auto';
    if (l === 'iphone' || l === 'laptop') return l;
    return window.innerWidth >= 1024 ? 'laptop' : 'iphone';
  }
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
    if (S.route.name === 'info' && S.route.id) loadIHist(S.route.id);
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
    S.devices = {}; if (r[1].status === 'fulfilled') r[1].value.forEach((d) => { S.devices[d.id] = { id: d.id, area_id: d.area_id, name: d.name_by_user || d.name, manufacturer: d.manufacturer, model: d.model, sw: d.sw_version, hw: d.hw_version }; });
    S.ents = {};
    if (r[2].status === 'fulfilled') r[2].value.forEach((e) => { S.ents[e.entity_id] = { device_id: e.device_id, area_id: e.area_id, entity_category: e.entity_category, hidden: !!e.hidden_by, disabled: !!e.disabled_by, platform: e.platform }; });
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
    S.spark[eid] = Object.assign({ pts: [] }, cached, { at: Date.now() });
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
    if (eid.startsWith('automation.') && S.route.name === 'timers' && (!ns || !S.autoCfg[String(ns.attributes.id)])) setTimeout(() => loadAutos(false), 300);
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
  /* Which sensor tells the real room temperature: a separate room sensor (e.g. 19.78°) beats the air conditioner's own
     sensor (whole degrees, 17 / 17.5 / 18). Outside sensors and boiler/water values are never a room temperature. */
  const OUT_T = /outside|outdoor|buiten|exterior|exterieur/i;
  const JUNK_T = /water|flow|boiler|dhw|setpoint|override|exhaust|exchanger|collector|storage|target|curve|pid|error|margin|delta|tset|cpu|battery|chip|processor/i;
  const fname = (e) => e + ' ' + (((S.states[e] || {}).attributes || {}).friendly_name || '');
  const isOutside = (e) => OUT_T.test(fname(e));
  const isJunkT = (e) => JUNK_T.test(fname(e));
  function climDevs() { const m = model(); if (!m._cd) { m._cd = new Set(); m.climates.forEach((e) => { const d = (S.ents[e] || {}).device_id; if (d) m._cd.add(d); }); } return m._cd; }
  const isACsensor = (e) => climDevs().has((S.ents[e] || {}).device_id);
  const fine = (e) => (/\.\d*[1-9]/.test((S.states[e] || {}).state || '') ? 1 : 0);
  /* An air conditioner has a fan (fan speeds, fan-only or dry mode). Boilers/thermostats (OpenTherm etc.) can list "cool" too, so that is not enough. */
  const HEAT_RE = /opentherm|otgw|thermosta|boiler|ketel|dhw|hot.?water|warm.?water|verwarming|heating|vloer|floor|radiator|cv[-_ ]?ketel/i;
  function isAC(e) {
    const s = S.states[e]; if (!s || !e.startsWith('climate.')) return false; const a2 = s.attributes || {}; const reg = S.ents[e] || {};
    if (Array.isArray(settings.acList) && settings.acList.length) return settings.acList.includes(e);
    if (/opentherm|generic_thermostat|better_thermostat|tado|nest|evohome|plugwise|netatmo|honeywell|ecobee/.test(reg.platform || '')) return false;
    const r = roomOfEid(e); if (HEAT_RE.test(fname(e)) || (r && HEAT_RE.test(r.name))) return false;
    const modes = a2.hvac_modes || [];
    return (a2.fan_modes || []).length > 0 || modes.includes('fan_only') || modes.includes('dry');
  }
  const acList = (m) => m.climates.filter(isAC);
  const tColor = (v) => (v == null ? 'var(--muted)' : `hsl(${Math.round(clamp(v <= 20 ? 210 - (v - 16) * 10 : 170 - (v - 20) * 45, 8, 215))} 72% 48%)`);
  const shortRoom = (n) => { const s = String(n || '').replace(/\bkamer\b/ig, '').replace(/\s+\d+$/, '').trim(); return cap(s || n); };
  function mainTemp(r) {
    const pick = settings.roomMain[r.id];
    if (pick && r.temps.includes(pick) && numOf(pick) != null) return pick;
    const c = r.temps.filter((e) => !isOutside(e) && !isJunkT(e)).filter((e) => { const v = numOf(e); return v != null && v > -20 && v < 40; });
    c.sort((x, y) => (isACsensor(x) - isACsensor(y)) || (fine(y) - fine(x)));
    if (c.length) return c[0];
    for (const e of r.devs) { const s = st(e); if (e.startsWith('climate.') && s && s.attributes.current_temperature != null) return e; }
    return r.temps.find((e) => !isOutside(e) && !isJunkT(e)) || null;
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
    const acRooms = [...new Set(acList(m).map((e) => roomOfEid(e)).filter(Boolean))];
    const vals = (acRooms.length >= 2 ? acRooms : m.rooms).map((r) => tempOf(mainTemp(r))).filter((v) => v != null);
    if (!vals.length) return { v: null, label: m.temps.length ? 'Sensors unavailable' : 'No temperature sensors' };
    return { v: vals.reduce((a, b) => a + b, 0) / vals.length, label: vals.length === 1 ? t('Indoor') : t('Average of {n} rooms', { n: vals.length }) };
  }
  function outsideTemp() {
    const m = model(); const pick = settings.outsideSrc;
    if (pick && S.states[pick]) return { v: tempOf(pick), e: pick };
    const outs = Object.keys(S.states).filter((e) => e.startsWith('sensor.') && isOutside(e) && (S.states[e].attributes.device_class === 'temperature' || /°/.test(S.states[e].attributes.unit_of_measurement || '')) && numOf(e) != null);
    const rank = (e) => { const r = roomOfEid(e); const n = ((r && r.name) || '').toLowerCase(); return /woonkamer|living|lounge/.test(n) ? 0 : m.climates.length && r === roomOfEid(selectedClimate(m)) ? 1 : 2; };
    outs.sort((x, y) => (rank(x) - rank(y)) || ((numOf(x) === 0) - (numOf(y) === 0)));
    if (outs.length) return { v: numOf(outs[0]), e: outs[0] };
    const w = m.weather && st(m.weather);
    return { v: w && avail(w) && w.attributes.temperature != null ? +w.attributes.temperature : null, e: m.weather };
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
  /* After every change: fetch all states again from Home Assistant so the page always shows the real situation */
  let refreshT1, refreshT2;
  function refreshSoon() {
    clearTimeout(refreshT1); clearTimeout(refreshT2);
    const go = () => { if (!C || !C.authed) return; C.send({ type: 'get_states' }, 20000).then((states) => {
      const seen = new Set();
      (states || []).forEach((x) => { seen.add(x.entity_id); const o = S.states[x.entity_id]; if (!o || o.last_updated !== x.last_updated || o.state !== x.state) onStateChanged({ entity_id: x.entity_id, new_state: x }); });
      Object.keys(S.states).forEach((e) => { if (!seen.has(e)) onStateChanged({ entity_id: e, new_state: null }); });
      if (S.route.name === 'timers') loadAutos(true);
      schedule(true);
    }).catch(() => { /* live updates still run */ }); };
    refreshT1 = setTimeout(go, 1200); refreshT2 = setTimeout(go, 4500);
  }
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
      refreshSoon();
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
  function grpSet(acs, v) { S.grpV = Math.round(v * 2) / 2; S.grpAt = Date.now(); acs.forEach((e) => { if (avail(S.states[e])) setTarget(e, S.grpV); }); schedule(true); }
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
  const TABS = [['home', 'Home', 'home'], ['climate', 'Climate', 'climate'], ['devices', 'Devices', 'devices'], ['info', 'Info', 'info'], ['timers', 'Set time', 'clock'], ['automations', 'Automations', 'auto'], ['settings', 'Settings', 'settings']];
  const scrollPos = {};
  function parseRoute() {
    const h = decodeURIComponent(location.hash.replace(/^#\/?/, '')); const [name, id] = h.split('/');
    if (name === 'room' && id) return { name: 'room', id, key: 'room/' + id };
    if ((name === 'climate' || name === 'info') && id) return { name, id, key: name + '/' + id };
    if (name === 'calendar' && EXTRA && effLayout() !== 'iphone') return { name: 'calendar', key: 'calendar' };
    if (name === 'rooms') return { name: 'rooms', key: 'rooms' };
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
    const wallOn = !!(WALL && WALL.active());
    document.documentElement.classList.toggle('lay-wall', wallOn);
    document.documentElement.classList.toggle('lay-phone', !wallOn && settings.layout === 'iphone');
    let html;
    try {
      const r = S.route.name;
      html = wallOn ? WALL.render() : r === 'calendar' && EXTRA && effLayout() !== 'iphone' ? EXTRA.calendarHTML(false) : r === 'automations' ? pAutomations() : r === 'info' ? (S.route.id ? pInfoEnt(S.route.id) : pInfo()) : r === 'timers' ? pTimers() : r === 'climate' ? pClimate() : r === 'rooms' ? pRooms() : r === 'room' ? pRoom(S.route.id) : r === 'devices' ? pDevices() : r === 'settings' ? pSettings() : pHome();
    } catch (e) { console.error(e); html = `<div class="page" data-k="err"><div class="msg bad">${ic('alert')}<div>Something went wrong showing this page. ${esc(e.message)}</div></div></div>`; }
    morphInto($('#view'), html);
    morphInto($('#nav'), wallOn ? '' : navHTML());
    if (EXTRA) EXTRA.applyDeco(effLayout());
    morphInto($('#sheet'), S.sheet ? (S.sheet === '__osc' ? oscSheet() : S.sheet.startsWith('__') ? specialSheet(S.sheet) : sheetHTML(S.sheet)) : '');
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
    const cur = S.route.name === 'room' || S.route.name === 'rooms' ? 'home' : S.route.name;
    const tabs = EXTRA && effLayout() === 'laptop' ? TABS.slice(0, -1).concat([['calendar', settings.lang === 'nl' ? 'Kalender' : 'Calendar', 'clock'], TABS[TABS.length - 1]]) : TABS;
    return `<nav class="bn" aria-label="Main"><div class="in${tabs.length > 7 ? ' n8' : ''}">${tabs.map(([id, label, icon]) => `<a href="#/${id}" class="${cur === id ? 'sel' : ''}" ${cur === id ? 'aria-current="page"' : ''} data-k="n-${id}"><span class="ic">${ic(icon)}</span>${t(label)}</a>`).join('')}</div></nav>`;
  }
  function pill() {
    if (S.demo) return `<span class="pill demo"><span class="dot"></span>${t('Preview')}</span>`;
    const lbl = { idle: 'Not set up', connecting: 'Connecting', reconnecting: 'Reconnecting', connected: 'Connected', disconnected: 'Disconnected', error: 'Error', auth_invalid: 'Token rejected' }[S.conn];
    return `<span class="pill ${S.conn}"><span class="dot"></span>${t(lbl)}</span>`;
  }
  function banner() {
    if (S.demo) return `<div class="banner demo" data-k="bn-demo">${ic('eye')}<span class="grow">Preview with sample data — not your home</span><button data-act="exit-demo">Exit</button></div>`;
    if (S.conn === 'connected' || S.conn === 'idle') return '';
    if (S.conn === 'connecting' || S.conn === 'reconnecting') return `<div class="banner ${S.conn}" data-k="bn">${ic('refresh', 'spin')}<span class="grow">${t(S.conn === 'connecting' ? 'Connecting to Home Assistant…' : 'Connection lost. Reconnecting…')}${S.stale ? '<br><span style="font-weight:500">' + t('Showing last known values') + '</span>' : ''}</span>${S.conn === 'reconnecting' ? '<button data-act="retry">' + t('Retry') + '</button>' : ''}</div>`;
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
    out += `<div class="hero" data-k="hero"><div class="hero-top"><div><h1 class="greet">${greeting(now.getHours())}</h1><div class="when num">${esc(date)} · ${esc(time)}</div></div><div class="hero-r">${pill()}${EMBED || (loadAuth() || {}).url ? `<button class="habtn" data-act="ha-menu" aria-label="${t('Open Home Assistant')}">${ic('grid')}<span>HA</span></button>` : ''}</div></div>`;
    if (!configured()) { out += `<div class="hero-temp"><span class="bigt">—</span></div></div><div class="sec" data-k="w">${installHint()}${welcomeHTML()}</div></div>`; return out; }
    const ht = houseTemp();
    const wt = outsideTemp().v;
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
    if (acList(m).length && !loading) out += `<div class="sec" data-k="s-clim"><div class="sec-h"><h2>${t('Climate')}</h2><a href="#/climate">${t('Controls')}</a></div>${climStrip(m)}</div>`;

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
    else out += `<div class="tiles">${auto.map((e) => tileHTML(e)).join('')}</div>`;
    out += `</div>`;

    // on now
    if (!loading && m.controls.length) {
      out += `<div class="sec" data-k="s-on"><div class="sec-h"><h2>${t('On now')} <span class="aux">${onNow.length}</span></h2>${onNow.some((x) => m.kind[x] === 'light') ? `<button class="link" data-act="all-lights-off">${t('All lights off')}</button>` : ''}</div>`;
      out += onNow.length ? `<div class="chips">${onNow.map((e) => `<button class="chip${m.kind[e] === 'light' ? ' on-light' : ''}" data-k="c-${esc(e)}" data-act="sheet" data-eid="${esc(e)}">${ic(devIcon(e, st(e)))}${esc(nameOf(e))}</button>`).join('')}</div>` : emptyHTML('ok', t('Everything is off.'), 'e-on');
      out += `</div>`;
    }
    // climate mini (only when there are no air conditioners shown above)
    if (m.climates.length && !acList(m).length) {
      const e = selectedClimate(m); const s = st(e); const a = (s && s.attributes) || {}; const on = isOn(e, s);
      out += `<div class="sec" data-k="s-clim"><div class="sec-h"><h2>${t('Climate')}</h2><a href="#/climate">${t('Controls')}</a></div>
<a class="card climini${on ? ' on' : ''}" href="#/climate" style="text-decoration:none;color:inherit"><span class="dico">${ic('climate')}</span><div><div style="font-weight:650">${esc(nameOf(e))}</div><div style="font-size:12.5px;color:var(--muted);font-weight:500">${esc(stateText(e, s))}</div></div><span class="t num">${a.current_temperature != null && avail(s) ? smallT(+a.current_temperature) : '—'}</span></a></div>`;
    }
    return out + `</div>`;
  }

  /* ---------------- CLIMATE ---------------- */
  function climStrip(m) {
    const acs = acList(m);
    return `<a class="cstrip" href="#/climate" data-k="cstrip">${acs.map((e) => { const r = roomOfEid(e); const v = r ? tempOf(mainTemp(r)) : tempOf(e); const on = isOn(e, st(e));
      return `<span class="csi${on ? ' on' : ''}" style="--tc:${tColor(v)}" data-k="csi-${esc(e)}"><b>${esc(shortRoom(r ? r.name : nameOf(e)))}</b><span class="num">${smallT(v)}</span>${on ? `<i>${ic(st(e).state === 'heat' ? 'flame' : st(e).state === 'cool' ? 'snow' : 'climate')}</i>` : ''}</span>`; }).join('')}</a>`;
  }
  function groupTarget(acs) {
    if (S.grpV != null && Date.now() - S.grpAt < 8000 && (Date.now() - S.grpAt < 1500 || acs.some((e) => S.pending[e] || S.draft[e]))) return S.grpV;
    const ts = acs.map((e) => (S.draft[e] ? S.draft[e].v : +(st(e) || { attributes: {} }).attributes.temperature)).filter((v) => isFinite(v));
    if (!ts.length) return null; const cnt = {}; ts.forEach((v) => { cnt[v] = (cnt[v] || 0) + 1; });
    return +Object.keys(cnt).sort((x, y) => cnt[y] - cnt[x])[0];
  }
  function dialSVG(id, p, hot, hasTarget) {
    const R = 100, CX = 120, CY = 120, L = 2 * Math.PI * R * 0.75, CIRC = 2 * Math.PI * R;
    const ang = (135 + 270 * p) * Math.PI / 180; const kx = CX + R * Math.cos(ang), ky = CY + R * Math.sin(ang);
    return `<svg viewBox="0 0 240 240" aria-hidden="true"><defs><linearGradient id="dg-${id}" x1="0" y1="1" x2="1" y2="0"><stop offset="0" stop-color="#7cc2f0"/><stop offset="1" stop-color="${hot ? '#ef8d4b' : '#2f86d6'}"/></linearGradient></defs>
<circle class="trk" cx="120" cy="120" r="${R}" stroke-dasharray="${L.toFixed(1)} ${CIRC.toFixed(1)}" transform="rotate(135 120 120)"/>
${hasTarget ? `<circle class="arc" style="stroke:url(#dg-${id})" cx="120" cy="120" r="${R}" stroke-dasharray="${(L * p).toFixed(1)} ${CIRC.toFixed(1)}" transform="rotate(135 120 120)"/><circle class="knob" cx="${kx.toFixed(1)}" cy="${ky.toFixed(1)}" r="11"/>` : ''}</svg>`;
  }
  function pClimate() {
    const m = model(); const id = S.route.id;
    if (id === 'all') return pClimGroup(m);
    if (id) return pClimOne(m, id);
    let out = `<div class="page" data-k="p-climate"><div class="topbar"><h1>${t('Climate')}</h1>${pill()}</div>${banner()}`;
    if (!configured()) return out + welcomeHTML() + '</div>';
    const acs = acList(m);
    if (acs.length) {
      setTimeout(() => acs.forEach((e) => { const r = roomOfEid(e); if (r) loadSpark(r.id); }), 0);
      const ht = houseTemp(); const out2 = outsideTemp().v; const on = acs.filter((e) => isOn(e, st(e))); const gt = groupTarget(acs);
      out += `<a class="chome" href="#/climate/all" data-k="chome" style="--tc:${tColor(ht.v)}"><div class="ch-top"><span class="ch-l">${ic('home')}${t('House average')}</span><span class="ch-on">${on.length ? t('{n} on', { n: on.length }) : t('All off')}</span></div>
<div class="ch-mid">${bigT(ht.v)}<div class="ch-meta">${out2 != null ? `<span>${ic('sun')}${t('Outside {t}', { t: fmtT(out2) })}</span>` : ''}${gt != null ? `<span>${ic('thermo')}${t('Target')} ${fmtT(gt)}</span>` : ''}</div></div>
<div class="ch-rooms">${acs.map((e) => { const r = roomOfEid(e); const v = r ? tempOf(mainTemp(r)) : tempOf(e); return `<span class="chr${isOn(e, st(e)) ? ' on' : ''}" style="--tc:${tColor(v)}"><b>${esc(shortRoom(r ? r.name : nameOf(e)))}</b><span class="num">${smallT(v)}</span></span>`; }).join('')}</div>
<div class="ch-foot"><span>${t('Tap to control all {n} air conditioners at once', { n: acs.length })}</span>${ic('chev')}</div></a>`;
      out += `<div class="sec" data-k="cc-sec"><div class="sec-h"><h2>${t('Per room')}</h2></div><div class="ccards">${acs.map((e) => climCard(e)).join('')}</div></div>`;
    }
    const others = m.climates.filter((e) => !acs.includes(e));
    if (!acs.length && others.length) out += `<div class="sec" data-k="heat-only"><div class="list">${others.map((e) => { const s = st(e); return `<div class="row${isOn(e, s) ? ' on' : ''}" data-k="hc-${esc(e)}"><span class="dico">${ic('flame')}</span><button class="rb" data-act="go-clim" data-eid="${esc(e)}"><div class="rn">${esc(nameOf(e))}</div><div class="rs">${esc(stateText(e, s))}</div></button></div>`; }).join('')}</div></div>`;
    if (acs.length) out += climFooter(others);
    if (!m.climates.length) out += emptyHTML('climate', S.conn === 'connected' ? 'No climate devices found in Home Assistant.' : 'Climate devices appear once connected.');
    return out + '</div>';
  }
  function climFooter(others) {
    const th = others.find((e) => (st(e) || { attributes: {} }).attributes.current_temperature != null) || others[0];
    const s = th && st(th); const dev = th && (S.ents[th] || {}).device_id;
    let out = `<div class="sec cfoot" data-k="cfoot">`;
    if (th && EMBED) out += `<button class="heatbtn" data-act="go-panel" data-p="${dev ? 'config/devices/device/' + esc(dev) : 'lovelace'}" data-k="heatbtn"><span class="hb-i">${ic('flame')}</span><span class="hb-t"><b>${t('Heating')}</b><span>${esc(s && avail(s) ? [s.attributes.current_temperature != null ? fmtT(+s.attributes.current_temperature) : '', s.attributes.temperature != null ? t('Target') + ' ' + fmtT(+s.attributes.temperature) : ''].filter(Boolean).join(' · ') : t('Open in Home Assistant'))}</span></span><span class="hb-x">${t('Open in Home Assistant')}${ic('chev')}</span></button>`;
    else if (th) out += `<button class="heatbtn" data-act="go-info" data-eid="${esc(th)}" data-k="heatbtn"><span class="hb-i">${ic('flame')}</span><span class="hb-t"><b>${t('Heating')}</b><span>${esc(s ? stateText(th, s) : '')}</span></span><span class="hb-x">${ic('chev')}</span></button>`;
    out += `<div class="cf-row">${EMBED || (loadAuth() || {}).url ? `<button class="btn" data-act="ha-menu">${ic('grid')}${t('Change dashboard')}</button>` : ''}<a class="btn" href="#/home">${ic('home')}${t('Back to Home')}</a></div></div>`;
    return out;
  }
  function climCard(e) {
    const s = st(e); const r = roomOfEid(e); const te = r ? mainTemp(r) : e; const v = tempOf(te); const on = isOn(e, s); const a = (s && s.attributes) || {};
    const sp = te && S.spark[te]; const ok = avail(s) && C && C.authed;
    const sub = !avail(s) ? t('Unavailable') : on ? `${ACTION[a.hvac_action] && a.hvac_action !== 'idle' ? ACTION[a.hvac_action] : HVAC[s.state] || cap(s.state)}${a.temperature != null ? ' · ' + fmtT(+a.temperature) : ''}` : `${t('Off')}${a.temperature != null ? ' · ' + fmtT(+a.temperature) : ''}`;
    return `<div class="ccard${on ? ' on m-' + esc(s.state) : ''}${avail(s) ? '' : ' na'}" data-k="cc-${esc(e)}" data-act="go-clim" data-eid="${esc(e)}" role="button" tabindex="0" style="--tc:${tColor(v)}">
<div class="cc-h"><b>${esc(shortRoom(r ? r.name : nameOf(e)))}</b><button class="pwr sm${on ? ' on' : ''}${S.pending[e] ? ' pending' : ''}" data-act="clim-power" data-eid="${esc(e)}" aria-label="${esc(nameOf(e))} power" aria-pressed="${on}" ${ok ? '' : 'disabled'}>${ic('power')}</button></div>
<div class="cc-t num">${smallT(v)}</div><div class="cc-s">${esc(sub)}</div>${sp && sp.pts.length > 2 ? miniSpark(sp.pts) : '<div class="mspark-e"></div>'}</div>`;
  }
  function miniSpark(pts) {
    const W = 120, H = 34; const t0 = pts[0].t, t1 = Date.now(); let lo = Infinity, hi = -Infinity;
    pts.forEach((p) => { lo = Math.min(lo, p.v); hi = Math.max(hi, p.v); }); if (hi - lo < 1) { const c = (hi + lo) / 2; lo = c - 0.5; hi = c + 0.5; }
    const xy = pts.concat([{ t: t1, v: pts[pts.length - 1].v }]).map((p) => [((p.t - t0) / (t1 - t0 || 1)) * W, H - 3 - ((p.v - lo) / (hi - lo)) * (H - 6)]);
    const d = xy.map((q, i) => (i ? 'L' : 'M') + q[0].toFixed(1) + ' ' + q[1].toFixed(1)).join('');
    return `<svg class="mspark" viewBox="0 0 ${W} ${H}" preserveAspectRatio="none" aria-hidden="true"><path class="a" d="${d}L${W} ${H}L0 ${H}Z"/><path class="l" d="${d}" vector-effect="non-scaling-stroke"/></svg>`;
  }
  function pClimGroup(m) {
    const acs = acList(m);
    let out = `<div class="page sub" data-k="p-clim-all"><div class="topbar"><button class="iconbtn" data-act="back-to" data-h="#/climate" aria-label="Back">${ic('back')}</button><h1>${t('All air conditioners')}</h1>${pill()}</div>${banner()}`;
    if (!acs.length) return out + emptyHTML('climate', 'No air conditioners found.') + '</div>';
    const ok = C && C.authed && acs.some((e) => avail(st(e)));
    const on = acs.filter((e) => isOn(e, st(e)));
    const mins = acs.map((e) => +(st(e).attributes.min_temp != null ? st(e).attributes.min_temp : 16)); const maxs = acs.map((e) => +(st(e).attributes.max_temp != null ? st(e).attributes.max_temp : 30));
    const min = Math.max.apply(null, mins), max = Math.min.apply(null, maxs);
    const gt = groupTarget(acs); const p = gt != null ? clamp((gt - min) / (max - min || 1), 0, 1) : 0;
    const pend = acs.some((e) => S.pending[e] || S.draft[e]);
    const hot = on.length && on.every((e) => st(e).state === 'heat');
    out += `<div class="card clim" data-k="grp"><div class="clim-head"><div><div class="cn">${t('All air conditioners')}</div><div class="cs">${on.length ? t('{n} on', { n: on.length }) : t('All off')} · ${acs.length}</div></div><button class="pwr${on.length ? ' on' : ''}" data-act="grp-power" aria-label="Power all" aria-pressed="${!!on.length}" ${ok ? '' : 'disabled'}>${ic('power')}</button></div>
<div class="dial${on.length ? '' : ' off'}">${dialSVG('grp', p, hot, gt != null)}<div class="mid"><span class="lbl">${t('Target')}</span><span class="tt num">${gt != null ? smallT(gt) : '—'}</span><span class="ct">${ic('home')}${t('House {t}', { t: fmtT(houseTemp().v) })}</span><span class="sending">${pend ? t('Sending…') : ''}</span></div></div>
<div class="steppers"><button class="step" data-act="grp-step" data-d="-1" aria-label="Lower all" ${ok && gt > min ? '' : 'disabled'}>${ic('minus')}</button><button class="step" data-act="grp-step" data-d="1" aria-label="Raise all" ${ok && gt < max ? '' : 'disabled'}>${ic('plus')}</button></div>
<input class="range" type="range" min="${min}" max="${max}" step="0.5" value="${gt != null ? gt : min}" style="--p:${(p * 100).toFixed(1)}%" data-in="grp-range" aria-label="Target temperature for all" ${ok ? '' : 'disabled'}><div class="rlab num"><span>${fmtT(min)}</span><span>${fmtT(max)}</span></div>
<div class="gpre">${[18, 20, 21, 22, 24].filter((v) => v >= min && v <= max).map((v) => `<button class="${gt === v ? 'sel' : ''}" data-act="grp-preset" data-v="${v}" ${ok ? '' : 'disabled'}>${v}°</button>`).join('')}</div><div class="gmembers">${acs.map((e) => { const s = st(e); const r = roomOfEid(e); return `<button class="gm${isOn(e, s) ? ' on' : ''}" data-act="go-clim" data-eid="${esc(e)}" data-k="gm-${esc(e)}"><b>${esc(shortRoom(r ? r.name : nameOf(e)))}</b><span class="num">${S.draft[e] ? fmtT(S.draft[e].v) : s.attributes.temperature != null ? fmtT(+s.attributes.temperature) : '—'}</span><small>${esc(isOn(e, s) ? HVAC[s.state] || cap(s.state) : t('Off'))}</small></button>`; }).join('')}</div></div>`;
    const inter = (k) => acs.map((e) => st(e).attributes[k] || []).reduce((x, y) => x.filter((v) => y.includes(v)));
    const MI = { auto: 'auto', heat_cool: 'heatcool', cool: 'snow', heat: 'flame', dry: 'droplet', fan_only: 'fan' };
    const order = ['auto', 'heat_cool', 'cool', 'heat', 'dry', 'fan_only'];
    const modes = inter('hvac_modes').filter((x) => x !== 'off').sort((x, y) => (order.indexOf(x) + 1 || 99) - (order.indexOf(y) + 1 || 99));
    const same = (k) => { const v = acs.filter((e) => isOn(e, st(e))).map((e) => (k === 'state' ? st(e).state : st(e).attributes[k])); return v.length && v.every((x) => x === v[0]) ? v[0] : null; };
    if (modes.length) { const cur = same('state'); out += `<div class="sec card ctl-card" data-k="gmode"><h3>${ic('sunmoon')}${t('Mode')}</h3><div class="modes">${modes.map((md) => `<button class="mode m-${esc(md)}${cur === md ? ' sel' : ''}" data-act="grp-mode" data-v="${esc(md)}" ${ok ? '' : 'disabled'}>${ic(MI[md] || 'climate')}${esc(HVAC[md] || cap(md))}</button>`).join('')}</div></div>`; }
    const fans = inter('fan_modes');
    if (fans.length) { const cur = same('fan_mode'); out += `<div class="sec card ctl-card" data-k="gfan"><h3>${ic('fan')}${t('Fan speed')}</h3><div class="fan">${fans.map((v) => `<button class="${cur === v ? 'sel' : ''}" data-act="grp-fan" data-v="${esc(v)}" ${ok ? '' : 'disabled'}>${esc(prettyMode(v))}</button>`).join('')}</div></div>`; }
    const sw = inter('swing_modes');
    if (sw.length) { const cur = same('swing_mode'); out += `<div class="sec card ctl-card" data-k="gswing"><h3>${ic('wind')}${t('Air direction')}</h3><div class="fan">${sw.map((v) => `<button class="${cur === v ? 'sel' : ''}" data-act="grp-swing" data-v="${esc(v)}" ${ok ? '' : 'disabled'}>${esc(prettyMode(v))}</button>`).join('')}</div></div>`; }
    return out + '</div>';
  }
  function pClimOne(m, eid) {
    const s = st(eid); const r = roomOfEid(eid);
    let out = `<div class="page sub" data-k="p-clim-${esc(eid)}"><div class="topbar"><button class="iconbtn" data-act="back-to" data-h="#/climate" aria-label="Back">${ic('back')}</button><h1>${esc(r ? shortRoom(r.name) : s ? nameOf(eid) : t('Climate'))}</h1>${pill()}</div>${banner()}`;
    if (!s) return out + emptyHTML('alert', Object.keys(S.states).length ? 'This climate device no longer exists.' : 'Loading…') + '</div>';
    const te = r ? mainTemp(r) : null;
    if (te && te !== eid) {
      setTimeout(() => loadSpark(r.id), 0);
      const v = tempOf(te); const sp = S.spark[te]; const h = roomHum(r);
      out += `<div class="rtemp" data-k="rtemp" style="--tc:${tColor(v)}"><div><span class="lbl">${t('Room temperature')}</span><span class="v num">${smallT(v)}</span><span class="src">${esc(nameOf(te))}${h != null ? ' · ' + pct(h) : ''}</span></div>${sp && sp.pts.length > 2 ? miniSpark(sp.pts) : ''}</div>`;
    }
    out += `<div class="cslide" data-k="sl-${esc(eid)}" data-eid="${esc(eid)}">${climateHTML(eid, eid === selectedClimate(m))}</div>`;
    return out + '</div>';
  }
  function pClimateOld() {
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
    if (!s) return ''; if (!avail(s)) return t('Unavailable');
    const tt = Date.parse(s.last_changed); if (!isFinite(tt)) return ''; const m = Math.round((Date.now() - tt) / 60000);
    return m < 1 ? t('Changed just now') : t('Changed {x} ago', { x: m < 60 ? m + ' min' : m < 1440 ? Math.round(m / 60) + ' h' : Math.round(m / 1440) + ' d' });
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
    if (!q) { const tr = m.rooms.filter((r) => tempOf(mainTemp(r)) != null); if (tr.length) out += `<div class="tstrip" data-k="tstrip">${tr.map((r) => { const v = tempOf(mainTemp(r)); const h = roomHum(r); return `<button class="tsi" data-act="room" data-id="${esc(r.id)}" style="--tc:${tColor(v)}" data-k="tsi-${esc(r.id)}"><span class="tsn">${esc(shortRoom(r.name))}</span><span class="tsv num">${smallT(v)}</span>${h != null ? `<span class="tsh">${ic('drop')}${pct(h)}</span>` : ''}</button>`; }).join('')}</div>`; }
    let list = S.cat === 'all' ? all : S.cat === 'fav' ? favs : all.filter((e) => catOf(m.kind[e]) === S.cat);
    if (!m.controls.length) return out + `<div class="sec">${emptyHTML('devices', S.conn === 'connected' ? 'No devices found in Home Assistant.' : 'Devices appear once connected.')}</div></div>`;
    if (!list.length) return out + `<div class="sec">${emptyHTML('search', `No devices match “${esc(S.q)}”.`)}</div></div>`;
    const groups = [];
    if (settings.devGroup === 'room') {
      m.rooms.concat(m.unassigned ? [m.unassigned] : []).forEach((r) => { const g = list.filter((e) => (m.areaOf[e] || '_none') === r.id); if (g.length) groups.push([r.id, r.name, g, r.id !== '_none' ? tempOf(mainTemp(r)) : null]); });
    } else {
      CATS.forEach((c) => { const g = list.filter((e) => catOf(m.kind[e]) === c.id); if (g.length) groups.push([c.id, c.label, g]); });
    }
    out += groups.map(([id, label, g, tv]) => `<div data-k="g-${esc(id)}"><div class="grp-h"><span>${esc(t(label))} · ${g.length}</span>${tv != null ? `<span class="grp-t num" style="color:${tColor(tv)}">${ic('thermo')}${fmtT(tv)}</span>` : ''}</div><div class="list">${g.map((e) => rowHTML(e, { room: settings.devGroup !== 'room' })).join('')}</div></div>`).join('');
    return out + '</div>';
  }

  /* ---------------- INFO ---------------- */
  const DOMAIN_LBL = { sensor: 'Sensors', binary_sensor: 'Status sensors', light: 'Lights', switch: 'Switches', climate: 'Climate', media_player: 'Media', automation: 'Automations', person: 'People', device_tracker: 'Trackers', weather: 'Weather', sun: 'Sun', update: 'Updates', button: 'Buttons', number: 'Numbers', select: 'Selects', fan: 'Fans', cover: 'Blinds', lock: 'Locks', scene: 'Scenes', script: 'Scripts', zone: 'Zones', input_boolean: 'Helpers', camera: 'Cameras', water_heater: 'Water heater' };
  const domOf = (e) => e.slice(0, e.indexOf('.'));
  function infoIcon(e) { const s = S.states[e]; const d = domOf(e); const dc = s && s.attributes.device_class;
    if (model().kind[e]) return devIcon(e, s);
    return d === 'sensor' ? (dc === 'temperature' ? 'thermo' : dc === 'humidity' ? 'drop' : dc === 'power' || dc === 'energy' ? 'bolt' : dc === 'battery' ? 'battery' : 'info') : d === 'binary_sensor' ? (dc === 'motion' || dc === 'occupancy' ? 'motion' : dc === 'door' || dc === 'window' ? 'window' : 'shield') : d === 'automation' ? 'auto' : d === 'person' || d === 'device_tracker' ? 'smartphone' : d === 'sun' ? 'sun' : d === 'weather' ? 'sunmoon' : d === 'update' ? 'refresh' : 'info'; }
  function valText(e) { const s = S.states[e]; if (!s) return ''; const u = s.attributes.unit_of_measurement; if (model().kind[e] || domOf(e) === 'binary_sensor') return stateText(e, s); if (!avail(s)) return t(s.state === 'unknown' ? 'Unknown' : 'Unavailable'); const n = parseFloat(s.state); if (isFinite(n) && /^-?[\d.]+$/.test(s.state)) return (Math.round(n * 100) / 100) + (u ? ' ' + u : ''); if (/^\d{4}-\d\d-\d\dT/.test(s.state)) return new Date(s.state).toLocaleString(loc()); return cap(String(s.state).replace(/_/g, ' ')) + (u ? ' ' + u : ''); }
  function pInfo() {
    let out = `<div class="page" data-k="p-info"><div class="sticky"><div class="topbar"><h1>${t('Info')}</h1>${pill()}</div>`;
    if (!configured()) return out + `</div>${welcomeHTML()}</div>`;
    out += `<label class="search" data-static>${ic('search')}<input type="search" placeholder="${t('Search everything')}" value="${esc(S.iq || '')}" data-in="isearch" aria-label="Search" autocomplete="off"></label></div>${banner()}`;
    const q = (S.iq || '').trim().toLowerCase();
    const ids = Object.keys(S.states).filter((e) => { const r = S.ents[e] || {}; return !r.disabled && !['zone', 'tts', 'stt', 'conversation', 'event', 'todo', 'wake_word', 'assist_satellite', 'image', 'tag'].includes(domOf(e)); });
    const counts = {}; ids.forEach((e) => { const d = domOf(e); counts[d] = (counts[d] || 0) + 1; });
    const doms = Object.keys(counts).sort((x, y) => counts[y] - counts[x]);
    const unav = ids.filter((e) => !avail(S.states[e])).length;
    if (S.idom && S.idom !== 'unav' && !counts[S.idom]) S.idom = null;
    out += `<div class="chips" style="margin-top:10px">${[['', 'All', ids.length]].concat(doms.map((d) => [d, DOMAIN_LBL[d] || cap(d.replace(/_/g, ' ')), counts[d]]), unav ? [['unav', 'Unavailable', unav]] : []).map(([d, l, n]) => `<button class="chip${(S.idom || '') === d ? ' sel' : ''}" data-act="idom" data-v="${d}" data-k="id-${d || 'all'}">${t(l)}<span class="cnt">${n}</span></button>`).join('')}</div>`;
    let list = ids.filter((e) => (!S.idom ? true : S.idom === 'unav' ? !avail(S.states[e]) : domOf(e) === S.idom));
    if (q) list = list.filter((e) => fname(e).toLowerCase().includes(q) || roomNameOf(e).toLowerCase().includes(q));
    list.sort((x, y) => (avail(S.states[y]) - avail(S.states[x])) || nameOf(x).localeCompare(nameOf(y)));
    const total = list.length; list = list.slice(0, S.ishow || 150);
    if (!total) return out + `<div class="sec">${emptyHTML('search', t('Nothing found.'))}</div></div>`;
    out += `<div class="list ilist">${list.map((e) => { const s = S.states[e]; const rn = roomNameOf(e); return `<a class="row irow${avail(s) ? '' : ' na'}" href="#/info/${encodeURIComponent(e)}" data-k="ir-${esc(e)}"><span class="dico">${ic(infoIcon(e))}</span><span class="rb"><span class="rn">${esc(nameOf(e))}</span><span class="rs">${esc([rn, e].filter(Boolean).join(' · '))}</span></span><span class="rvalue num">${esc(valText(e))}</span></a>`; }).join('')}</div>`;
    if (total > list.length) out += `<button class="btn" style="width:100%;margin-top:12px" data-act="imore">${t('Show more')} (${total - list.length})</button>`;
    return out + '</div>';
  }
  S.ihist = {}; S.irange = 24;
  async function loadIHist(eid, force) {
    const key = eid + '|' + S.irange; const c = S.ihist[key];
    if (!C || !C.authed || (!force && c && Date.now() - c.at < 120e3)) return;
    S.ihist[key] = Object.assign({ pts: null }, c, { at: Date.now(), loading: true }); schedule(true);
    const withAttr = ['climate', 'water_heater', 'weather'].includes(domOf(eid));
    try {
      const res = await C.send({ type: 'history/history_during_period', start_time: new Date(Date.now() - S.irange * 3600e3).toISOString(), entity_ids: [eid], minimal_response: !withAttr, no_attributes: !withAttr, significant_changes_only: false }, 30000);
      const raw = (res || {})[eid] || [];
      let pts = []; let lastA = {};
      raw.forEach((p) => { const tt = p.lu != null ? p.lu * 1000 : Date.parse(p.last_updated || p.last_changed); if (p.a) lastA = p.a; const a = p.a || p.attributes || lastA; const sv = p.s != null ? p.s : p.state; pts.push({ t: tt, s: sv, v: withAttr ? parseFloat(a.current_temperature != null ? a.current_temperature : a.temperature) : parseFloat(sv) }); });
      pts = pts.filter((p) => isFinite(p.t));
      S.ihist[key] = { at: Date.now(), pts };
    } catch (e) { S.ihist[key] = { at: Date.now(), pts: [], err: e.message || 'History unavailable' }; }
    schedule(true);
  }
  function lineChart(pts, u) {
    const W = 320, H = 150, P = 6; const now = Date.now(); const t0 = now - S.irange * 3600e3;
    const ps = pts.filter((p) => isFinite(p.v)); if (ps.length < 2) return '';
    const all = ps.concat([{ t: now, v: ps[ps.length - 1].v }]);
    let lo = Infinity, hi = -Infinity; all.forEach((p) => { lo = Math.min(lo, p.v); hi = Math.max(hi, p.v); }); if (hi - lo < 1e-9) { lo -= 1; hi += 1; } const pad = (hi - lo) * 0.1; lo -= pad; hi += pad;
    const X = (tt) => (clamp((tt - t0) / (now - t0), 0, 1)) * W; const Y = (v) => P + (1 - (v - lo) / (hi - lo)) * (H - 2 * P);
    let d = ''; all.forEach((p, i) => { const x = X(p.t).toFixed(1), y = Y(p.v).toFixed(1); d += i ? `H${x}V${y}` : `M${x} ${y}`; });
    const mn = Math.min.apply(null, ps.map((p) => p.v)), mx = Math.max.apply(null, ps.map((p) => p.v)); const avg = ps.reduce((s2, p) => s2 + p.v, 0) / ps.length;
    const f = (v) => (Math.round(v * 10) / 10) + (u ? ' ' + u : '');
    const ticks = [0, 0.25, 0.5, 0.75, 1].map((k) => { const tt = new Date(t0 + k * (now - t0)); return `<span>${k === 1 ? t('Now') : S.irange > 48 ? tt.toLocaleDateString(loc(), { weekday: 'short' }) : tt.toLocaleTimeString(loc(), { hour: '2-digit', minute: '2-digit', hourCycle: 'h23' })}</span>`; }).join('');
    return `<div class="chart"><svg viewBox="0 0 ${W} ${H}" preserveAspectRatio="none" role="img" aria-label="Graph"><g class="grid">${[0.25, 0.5, 0.75].map((k) => `<line x1="0" x2="${W}" y1="${(H * k).toFixed(0)}" y2="${(H * k).toFixed(0)}"/>`).join('')}</g><path class="a" d="${d}V${H}H0Z"/><path class="l" d="${d}" vector-effect="non-scaling-stroke"/></svg><div class="ylab num"><span>${f(hi - pad)}</span><span>${f(lo + pad)}</span></div></div><div class="xlab">${ticks}</div>
<div class="cstats num"><span><small>${t('Min')}</small>${f(mn)}</span><span><small>${t('Average')}</small>${f(avg)}</span><span><small>${t('Max')}</small>${f(mx)}</span></div>`;
  }
  function stateChart(pts, eid) {
    const now = Date.now(); const t0 = now - S.irange * 3600e3; if (!pts.length) return '';
    const segs = pts.map((p, i) => ({ s: p.s, a: Math.max(p.t, t0), b: i + 1 < pts.length ? pts[i + 1].t : now })).filter((x) => x.b > x.a);
    const vals = [...new Set(segs.map((x) => x.s))]; const pal = ['var(--accent)', '#f59e0b', '#10b981', '#8b5cf6', '#ef4444', '#06b6d4', '#64748b'];
    const col = (s2) => (['off', 'unavailable', 'unknown', 'closed', 'idle', 'not_home', 'below_horizon'].includes(s2) ? 'var(--bg2)' : pal[vals.indexOf(s2) % pal.length]);
    const dur = {}; segs.forEach((x) => { dur[x.s] = (dur[x.s] || 0) + (x.b - x.a); }); const tot = now - t0;
    const nm = (s2) => valText(eid) && s2 === S.states[eid].state ? valText(eid) : t(cap(String(s2).replace(/_/g, ' ')));
    return `<div class="tline">${segs.map((x) => `<i style="left:${((x.a - t0) / tot * 100).toFixed(2)}%;width:${Math.max(0.3, (x.b - x.a) / tot * 100).toFixed(2)}%;background:${col(x.s)}" title="${esc(x.s)}"></i>`).join('')}</div>
<div class="xlab"><span>${S.irange} h</span><span>${t('Now')}</span></div><div class="tleg">${vals.sort((x, y) => dur[y] - dur[x]).map((v) => { const ms = dur[v]; const h = Math.floor(ms / 3600e3), mi = Math.round((ms % 3600e3) / 60e3); return `<span><i style="background:${col(v)}"></i>${esc(nm(v))} <b>${h ? h + ' h ' : ''}${mi} min</b></span>`; }).join('')}</div>`;
  }
  function attrVal(v) { if (v == null) return '—'; if (Array.isArray(v)) return v.map((x) => (typeof x === 'object' ? JSON.stringify(x) : String(x))).join(', '); if (typeof v === 'object') return JSON.stringify(v); if (typeof v === 'boolean') return t(v ? 'Yes' : 'No'); return String(v); }
  function pInfoEnt(eid) {
    const s = st(eid);
    let out = `<div class="page sub" data-k="p-info-${esc(eid)}"><div class="topbar"><button class="iconbtn" data-act="back-to" data-h="#/info" aria-label="Back">${ic('back')}</button><h1>${esc(s ? nameOf(eid) : eid)}</h1>${pill()}</div>${banner()}`;
    if (!s) return out + emptyHTML('alert', Object.keys(S.states).length ? t('This entity does not exist (anymore).') : 'Loading…') + '</div>';
    const reg = S.ents[eid] || {}; const dev = reg.device_id && S.devices[reg.device_id]; const rn = roomNameOf(eid); const a = s.attributes;
    const num = isFinite(parseFloat(s.state)) && /^-?[\d.]+$/.test(s.state);
    out += `<div class="ihero${avail(s) ? '' : ' na'}" data-k="ihero"><span class="dico">${ic(infoIcon(eid))}</span><div class="ih-b"><div class="ih-v num">${esc(valText(eid))}</div><div class="ih-s">${esc([rn, ago(s)].filter(Boolean).join(' · '))}</div></div>${model().kind[eid] && model().kind[eid] !== 'temp' && model().kind[eid] !== 'hum' ? `<button class="btn" data-act="sheet" data-eid="${esc(eid)}">${ic('settings')}${t('Controls')}</button>` : ''}</div>`;
    const h = S.ihist[eid + '|' + S.irange];
    if (!h && C && C.authed) setTimeout(() => loadIHist(eid), 0);
    const numeric = ['climate', 'water_heater', 'weather'].includes(domOf(eid)) || num;
    out += `<div class="card icard" data-k="igraph"><div class="ic-h"><h3>${ic('list')}${t('History')}</h3><div class="seg sm">${[[6, '6 h'], [24, '24 h'], [168, '7 d']].map(([v, l]) => `<button class="${S.irange === v ? 'sel' : ''}" data-act="irange" data-v="${v}">${l}</button>`).join('')}</div></div>
${!h || (h.loading && !h.pts) ? '<div class="skel" style="min-height:150px"></div>' : h.err ? `<p class="hint">${esc(h.err)}</p>` : !h.pts.length ? `<p class="hint">${t('No history in this period.')}</p>` : numeric ? lineChart(h.pts, ['climate', 'water_heater'].includes(domOf(eid)) ? '°' : a.unit_of_measurement) || stateChart(h.pts, eid) : stateChart(h.pts, eid)}</div>`;
    const rows = [['Entity ID', eid], ['State', s.state + (a.unit_of_measurement ? ' ' + a.unit_of_measurement : '')], ['Room', rn || '—'], ['Last changed', new Date(s.last_changed).toLocaleString(loc())], ['Last updated', new Date(s.last_updated).toLocaleString(loc())]];
    if (reg.platform) rows.push(['Integration', reg.platform]);
    out += `<div class="card icard" data-k="igen"><h3>${ic('info')}${t('General')}</h3><dl class="kv">${rows.map(([k, v]) => `<dt>${t(k)}</dt><dd>${esc(v)}</dd>`).join('')}</dl></div>`;
    const ak = Object.keys(a).filter((k) => !['friendly_name', 'icon', 'entity_picture', 'supported_features'].includes(k));
    if (ak.length) out += `<div class="card icard" data-k="iattr"><h3>${ic('list')}${t('All information')} <span class="aux">${ak.length}</span></h3><dl class="kv">${ak.map((k) => `<dt>${esc(cap(k.replace(/_/g, ' ')))}</dt><dd>${esc(attrVal(a[k]))}</dd>`).join('')}</dl></div>`;
    if (dev) {
      const sibs = Object.keys(S.ents).filter((e) => e !== eid && S.ents[e].device_id === reg.device_id && S.states[e]).sort((x, y) => nameOf(x).localeCompare(nameOf(y)));
      out += `<div class="card icard" data-k="idev"><h3>${ic('devices')}${t('Device')}</h3><dl class="kv">${[['Name', dev.name], ['Manufacturer', dev.manufacturer], ['Model', dev.model], ['Firmware', dev.sw], ['Hardware', dev.hw]].filter((x) => x[1]).map(([k, v]) => `<dt>${t(k)}</dt><dd>${esc(v)}</dd>`).join('')}</dl>
${sibs.length ? `<div class="ic-sub">${t('Also on this device')} · ${sibs.length}</div><div class="list">${sibs.map((e) => `<a class="row irow${avail(S.states[e]) ? '' : ' na'}" href="#/info/${encodeURIComponent(e)}" data-k="is-${esc(e)}"><span class="dico">${ic(infoIcon(e))}</span><span class="rb"><span class="rn">${esc(nameOf(e))}</span><span class="rs">${esc(e)}</span></span><span class="rvalue num">${esc(valText(e))}</span></a>`).join('')}</div>` : ''}
${EMBED ? `<button class="btn" style="width:100%;margin-top:12px" data-act="go-panel" data-p="config/devices/device/${esc(reg.device_id)}">${ic('grid')}${t('Open in Home Assistant')}</button>` : ''}</div>`;
    }
    return out + '</div>';
  }

  function svc(domain, service, data) { if (C && C.authed) refreshSoon(); return C && C.authed ? C.send({ type: 'call_service', domain, service, service_data: data }).catch(() => { /* ignore */ }) : Promise.resolve(); }
  const colorLight = (s) => (s.attributes.supported_color_modes || []).some((m) => ['hs', 'rgb', 'rgbw', 'rgbww', 'xy'].includes(m));
  const dimLight = (s) => (s.attributes.supported_color_modes || []).some((m) => m !== 'onoff');
  /* ---------------- SET TIME (automations) ---------------- */
  const MARK = 'Made with Comfort Home';
  const DAYS = ['mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun'];
  async function api(method, path, body) {
    try {
      if (EMBED) return await EMBED.getHass().callApi(method, path, body);
      if (S.demo && window.__demoHA) { const r = window.__demoHA.api(method, path, body); if (r.status >= 400) throw Object.assign(new Error(r.body.message || 'Error'), { status: r.status }); return r.body; }
      const au = loadAuth(); const tok = await getToken(au);
      const r = await fetch(au.url + '/api/' + path, { method, headers: { Authorization: 'Bearer ' + tok, 'Content-Type': 'application/json' }, body: body ? JSON.stringify(body) : undefined });
      const j = await r.json().catch(() => ({})); if (!r.ok) throw Object.assign(new Error(j.message || 'HTTP ' + r.status), { status: r.status }); return j;
    } catch (e) { const st = e.status || e.status_code; const err = new Error(st === 401 || st === 403 ? t('Only administrators can change timers.') : (e.message || (e.body && e.body.message) || 'Request failed')); err.status = st; throw err; }
  }
  S.autoCfg = {};
  const autoEnts = () => Object.keys(S.states).filter((e) => e.startsWith('automation.') && S.states[e].attributes.id != null);
  let autoBusy = false;
  async function loadAutos(force) {
    if (autoBusy || !C || !C.authed) return; autoBusy = true;
    const ids = autoEnts().map((e) => String(S.states[e].attributes.id)).filter((id) => force || !S.autoCfg[id]);
    await Promise.all(ids.map((id) => api('GET', 'config/automation/config/' + id).then((c) => { S.autoCfg[id] = c; }).catch((e) => { S.autoCfg[id] = { __err: e.message }; })));
    autoBusy = false; schedule(true);
  }
  function autoInfo(cfg) {
    const out = { times: [], days: DAYS.slice(), verb: null, ents: [], simple: true };
    if (!cfg || cfg.__err) return out;
    [].concat(cfg.triggers || cfg.trigger || []).forEach((tr) => {
      const pf = tr.trigger || tr.platform;
      if (pf === 'time') [].concat(tr.at || []).forEach((at) => { if (typeof at !== 'string') return; const m = /(\d{1,2}):(\d{2})/.exec(/^\d/.test(at) ? at : (S.states[at] || {}).state || ''); if (m) out.times.push(m[1].padStart(2, '0') + ':' + m[2]); });
      else if (pf === 'sun') out.times.push(tr.event === 'sunset' ? 'sunset' : 'sunrise');
      if (tr.weekday) out.days = [].concat(tr.weekday);
    });
    [].concat(cfg.conditions || cfg.condition || []).forEach((c) => { if (c && c.condition === 'time' && c.weekday) out.days = [].concat(c.weekday); });
    const acts = [].concat(cfg.actions || cfg.action || []);
    acts.forEach((ac) => {
      const sv = ac.action || ac.service; if (!sv) { out.simple = false; return; }
      const verb = /turn_on|open|media_play$/.test(sv) ? 'on' : /turn_off|close/.test(sv) ? 'off' : /toggle/.test(sv) ? 'toggle' : 'run';
      out.verb = out.verb && out.verb !== verb ? 'mixed' : verb;
      const ids = (ac.target && ac.target.entity_id) || ac.entity_id || (ac.data && ac.data.entity_id) || [];
      out.ents = out.ents.concat([].concat(ids));
    });
    out.simple = out.simple && acts.length === 1 && out.times.length === 1 && /^\d/.test(out.times[0] || '');
    return out;
  }
  function nextRun(info) {
    const now = new Date(); let best = null;
    info.times.filter((x) => /^\d/.test(x)).forEach((tm) => {
      const [h, mi] = tm.split(':').map(Number);
      for (let k = 0; k < 8; k++) { const d = new Date(now); d.setDate(now.getDate() + k); d.setHours(h, mi, 0, 0); if (d <= now) continue; const dn = DAYS[(d.getDay() + 6) % 7]; if (info.days.includes(dn)) { if (!best || d < best) best = d; break; } }
    });
    return best;
  }
  function inText(d) { const m = Math.round((d - Date.now()) / 60000); const h = Math.floor(m / 60); return t('in {x}', { x: h ? `${h} h ${m % 60} min` : `${m} min` }); }
  function entsLabel(ids) { if (ids.includes('all')) return t('All'); const names = ids.map((e) => (S.states[e] ? nameOf(e) : e.split('.')[1])); return names.length > 3 ? names.slice(0, 3).join(', ') + ' +' + (names.length - 3) : names.join(', '); }
  function pTimers() {
    let out = `<div class="page tpage" data-k="p-timers"><div class="topbar"><h1>${t('Set time')}</h1>${pill()}</div>${banner()}`;
    if (!configured()) return out + welcomeHTML() + '</div>';
    const ents = autoEnts(); ents.forEach((e) => used.add(e));
    if (ents.some((e) => !S.autoCfg[String(S.states[e].attributes.id)])) setTimeout(() => loadAutos(false), 0);
    const rows = ents.map((e) => { const s = S.states[e]; const id = String(s.attributes.id); const cfg = S.autoCfg[id]; return { e, s, id, cfg, info: autoInfo(cfg) }; });
    const timed = rows.filter((r) => r.info.times.length).sort((x, y) => (x.info.times[0] || '').localeCompare(y.info.times[0] || ''));
    const other = rows.filter((r) => r.cfg && !r.info.times.length);
    const err = rows.map((r) => r.cfg && r.cfg.__err).find(Boolean);
    if (err) out += `<div class="msg warn" data-k="terr">${ic('alert')}<div>${esc(err)}</div></div>`;
    let nxt = null; timed.forEach((r) => { if (r.s.state !== 'on') return; const d = nextRun(r.info); if (d && (!nxt || d < nxt.d)) nxt = { d, r }; });
    if (nxt) out += `<div class="tnext" data-k="tnext"><span class="tl">${t('Next')}</span><span class="tt num">${nxt.d.toLocaleTimeString(loc(), { hour: '2-digit', minute: '2-digit', hourCycle: 'h23' })}</span><span class="tn">${esc(nxt.r.s.attributes.friendly_name || '')}</span><span class="ti">${inText(nxt.d)}</span></div>`;
    const loading = !rows.length ? false : rows.every((r) => !r.cfg);
    out += `<div class="sec" data-k="tlist"><div class="sec-h"><h2>${t('Timers')}</h2></div>`;
    if (loading) out += '<div class="skel" style="min-height:90px"></div>';
    else if (!timed.length) out += emptyHTML('clock', t('No timers yet. Tap + to make one.'), 'tempty');
    else out += `<div class="list">${timed.map(timerRow).join('')}</div>`;
    out += `</div>`;
    if (other.length) out += `<div class="sec" data-k="tother"><div class="sec-h"><h2>${t('Other automations')}</h2></div><div class="list">${other.map((r) => `<div class="row${r.s.state === 'on' ? '' : ' na'}" data-k="ao-${esc(r.id)}"><span class="dico">${ic('auto')}</span><button class="rb" data-act="timer-open" data-eid="${esc(r.e)}"><div class="rn">${esc(r.s.attributes.friendly_name || r.e)}</div><div class="rs">${esc(entsLabel(r.info.ents) || ago(r.s))}</div></button>${autoToggle(r.e, r.s)}</div>`).join('')}</div></div>`;
    out += `<button class="fab" data-act="timer-new" aria-label="${t('New timer')}" ${C && C.authed ? '' : 'disabled'}>${ic('plus')}</button>`;
    return out + '</div>';
  }
  function autoToggle(e, s) { return `<button class="tg${S.pending[e] ? ' pending' : ''}" role="switch" aria-checked="${s.state === 'on'}" aria-label="${esc(s.attributes.friendly_name || e)}" data-act="auto-toggle" data-eid="${esc(e)}" ${C && C.authed ? '' : 'disabled'}><span class="kn"></span></button>`; }
  function timerRow(r) {
    const i = r.info; const time = i.times[0]; const tl = /^\d/.test(time) ? time : t(time === 'sunset' ? 'Sunset' : 'Sunrise');
    return `<div class="trow${r.s.state === 'on' ? '' : ' off'}" data-k="au-${esc(r.id)}"><button class="tmainb" data-act="timer-open" data-eid="${esc(r.e)}"><span class="ttime num">${esc(tl)}${i.times.length > 1 ? `<small>+${i.times.length - 1}</small>` : ''}</span>
<span class="tmain"><span class="tname">${esc(r.s.attributes.friendly_name || r.e)}</span><span class="tdays">${DAYS.map((d) => `<i class="${i.days.includes(d) ? 'on' : ''}">${dayShort(d)}</i>`).join('')}</span>
<span class="tact">${i.verb ? `<span class="apill ${i.verb}">${t(i.verb === 'on' ? 'On' : i.verb === 'off' ? 'Off' : i.verb === 'toggle' ? 'Switch' : 'Run')}</span>` : ''}<span class="tents">${esc(entsLabel(i.ents))}</span></span></span></button>${autoToggle(r.e, r.s)}</div>`;
  }
  function openTimerEditor(e) {
    if (!e) { S.form = { id: null, alias: '', time: '07:00', verb: 'on', days: DAYS.slice(), ents: [], q: '' }; return openSheet('__timer'); }
    const s = S.states[e]; const id = String(s.attributes.id); const cfg = S.autoCfg[id]; const i = autoInfo(cfg);
    if (cfg && !cfg.__err && cfg.description === MARK && i.simple && ['on', 'off'].includes(i.verb)) { S.form = { id, alias: cfg.alias || '', time: i.times[0], verb: i.verb, days: i.days.slice(), ents: i.ents.slice(), q: '' }; return openSheet('__timer'); }
    openSheet('__auto:' + e);
  }
  function verNum(v) { const m = /^(\d+)\.(\d+)/.exec(v || ''); return m ? +m[1] * 100 + +m[2] : 9999; }
  async function saveTimer() {
    const f = S.form; f.alias = ($('#tf-name') || {}).value || f.alias; f.time = ($('#tf-time') || {}).value || f.time;
    if (!f.ents.length) return toast(t('Choose devices'), 'bad');
    if (!/^\d{2}:\d{2}$/.test(f.time)) return toast(t('Time'), 'bad');
    if (!f.days.length) return toast(t('Days'), 'bad');
    const alias = f.alias.trim() || `${f.time} · ${t(f.verb === 'on' ? 'On' : 'Off')} · ${entsLabel(f.ents)}`;
    const newKeys = verNum(S.haVersion) >= 202410;
    const days = DAYS.filter((d) => f.days.includes(d));
    const cfg = { alias, description: MARK, mode: 'single' };
    cfg[newKeys ? 'triggers' : 'trigger'] = [Object.assign(newKeys ? { trigger: 'time' } : { platform: 'time' }, { at: f.time + ':00' })];
    cfg[newKeys ? 'conditions' : 'condition'] = days.length === 7 ? [] : [{ condition: 'time', weekday: days }];
    cfg[newKeys ? 'actions' : 'action'] = [Object.assign(newKeys ? { action: 'homeassistant.turn_' + f.verb } : { service: 'homeassistant.turn_' + f.verb }, { target: { entity_id: f.ents.slice() } })];
    const id = f.id || String(Date.now());
    S.saving = true; schedule(true);
    try { await api('POST', 'config/automation/config/' + id, cfg); refreshSoon(); S.autoCfg[id] = Object.assign({ id }, cfg); toast(t('Saved'), 'ok'); closeSheet(); setTimeout(() => loadAutos(true), 1500); }
    catch (e) { toast(e.message, 'bad', 6000); }
    S.saving = false; schedule(true);
  }
  async function deleteTimer() {
    const f = S.form; if (!f || !f.id || !confirm(t('Delete') + '?')) return;
    try { await api('DELETE', 'config/automation/config/' + f.id); delete S.autoCfg[f.id]; toast(t('Deleted'), 'ok'); closeSheet(); }
    catch (e) { toast(e.message, 'bad', 6000); }
  }
  function specialSheet(name) {
    const head = (icon, title, sub) => `<div class="scrim" data-act="close-sheet" data-k="scrim"></div><div class="sheet" role="dialog" aria-modal="true" aria-label="${esc(title)}" data-k="sheet-${esc(name)}"><div class="grab"></div><div class="sh"><span class="dico" style="background:var(--accent-soft);color:var(--accent)">${ic(icon)}</span><div class="t"><b>${esc(title)}</b>${sub ? `<span>${esc(sub)}</span>` : ''}</div><button class="star" data-act="close-sheet" aria-label="Close">${ic('x')}</button></div>`;
    if (name === '__ha') {
      const panels = EMBED ? Object.values((EMBED.getHass() || {}).panels || {}) : [];
      const NAMES = { lovelace: 'Overview', energy: 'Energy', map: 'Map', logbook: 'Logbook', history: 'History', config: 'Settings', profile: 'Profile', 'media-browser': 'Media', todo: 'To-do lists', calendar: 'Calendar' };
      const list = panels.filter((x) => x.url_path && x.url_path !== 'comfort-home' && !['profile', 'notfound', 'developer-tools', 'hassio', 'my', 'app'].includes(x.url_path))
        .map((x) => ({ p: x.url_path, n: x.component_name === 'lovelace' && x.title ? x.title : t(NAMES[x.url_path] || cap(x.title || x.url_path)) }));
      let b = head('grid', t('Home Assistant pages'), t('Back to the normal Home Assistant screens'));
      const PI = (x) => { const s2 = (x.p + ' ' + ((panels.find((y) => y.url_path === x.p) || {}).icon || '')).toLowerCase(); return /config|cog/.test(s2) ? 'settings' : /energy|lightning|flash/.test(s2) ? 'bolt' : /map/.test(s2) ? 'motion' : /logbook|format-list/.test(s2) ? 'list' : /history|chart/.test(s2) ? 'clock' : /flower|tree|garden|tuin/.test(s2) ? 'garden' : /calendar/.test(s2) ? 'clock' : /media|music|play/.test(s2) ? 'play' : /camera|cctv/.test(s2) ? 'eye' : /todo|check|clipboard/.test(s2) ? 'ok' : 'home'; };
      const dash = list.filter((x) => (panels.find((y) => y.url_path === x.p) || {}).component_name === 'lovelace');
      const tools = list.filter((x) => !dash.includes(x));
      if (EMBED) {
        b += `<div class="hagrid">${dash.map((x, i) => `<button class="hat c${i % 5}" data-act="go-panel" data-p="${esc(x.p)}" data-k="gp-${esc(x.p)}"><span class="hi">${ic(PI(x))}</span><b>${esc(x.n)}</b><small>${t('Dashboard')}</small></button>`).join('')}</div>`;
        b += `<div class="card set">${tools.map((x) => `<button class="it" data-act="go-panel" data-p="${esc(x.p)}" data-k="gp-${esc(x.p)}"><span class="ic">${ic(PI(x))}</span><span class="lb"><b>${esc(x.n)}</b></span><span class="chev" style="color:var(--muted)">${ic('chev')}</span></button>`).join('')}
<button class="it" data-act="go-panel" data-p="profile/general"><span class="ic">${ic('smartphone')}</span><span class="lb"><b>${t('Profile')}</b><span>${t('Choose another default dashboard here')}</span></span><span class="chev" style="color:var(--muted)">${ic('chev')}</span></button></div>
<p class="meta-sm" style="margin-top:10px">${t('Comfort stays your start screen. Come back any time via the Comfort item in the Home Assistant menu.')}</p>`;
      }
      else b += `<button class="btn pri" style="width:100%" data-act="open-ha">${ic('home')}${t('Open Home Assistant')}</button>`;
      return b + '</div>';
    }
    if (name.startsWith('__auto:')) {
      const e = name.slice(7); const s = st(e); if (!s) return '';
      const id = String(s.attributes.id); const i = autoInfo(S.autoCfg[id]);
      let b = head('auto', s.attributes.friendly_name || e, i.times.length ? i.times.join(', ') : ago(s));
      b += `<div class="bigtg"><b>${t(s.state === 'on' ? 'On' : 'Off')}</b>${autoToggle(e, s)}</div>`;
      if (i.ents.length) b += `<div class="ctl"><div class="hd"><span>${t('Devices')}</span></div><div style="margin-top:4px;font-weight:600">${esc(entsLabel(i.ents))}</div></div>`;
      b += `<p class="meta-sm" style="margin-bottom:12px">${t('Made in Home Assistant: you can switch it on or off here.')}</p><div class="btnrow"><button class="btn" data-act="auto-run" data-eid="${esc(e)}">${ic('play')}${t('Run now')}</button>${EMBED ? `<button class="btn" data-act="go-panel" data-p="config/automation/edit/${esc(id)}">${ic('settings')}${t('Edit in Home Assistant')}</button>` : ''}</div>`;
      return b + '</div>';
    }
    if (name === '__timer') {
      const f = S.form || {}; const m = model();
      const cands = m.controls.filter((e) => ['light', 'plug', 'switch', 'fan', 'cover', 'media', 'climate'].includes(m.kind[e]));
      const q = (f.q || '').toLowerCase(); const shown = cands.filter((e) => !q || nameOf(e).toLowerCase().includes(q) || roomNameOf(e).toLowerCase().includes(q));
      let b = head('clock', t(f.id ? 'Edit timer' : 'New timer'));
      b += `<div class="tform"><input id="tf-time" class="tbig num" type="time" value="${esc(f.time)}" aria-label="${t('Time')}" data-in="tf-time">
<div class="seg" role="group" style="margin:12px 0"><button class="${f.verb === 'on' ? 'sel' : ''}" data-act="tf-verb" data-v="on">${ic('power')}${t('Turn on')}</button><button class="${f.verb === 'off' ? 'sel' : ''}" data-act="tf-verb" data-v="off">${ic('moon')}${t('Turn off')}</button></div>
<div class="ctl"><div class="hd"><span>${t('Days')}</span></div><div class="dsel">${DAYS.map((d) => `<button class="${f.days.includes(d) ? 'on' : ''}" data-act="tf-day" data-v="${d}" aria-pressed="${f.days.includes(d)}">${dayShort(d)}</button>`).join('')}</div>
<div class="dpre"><button data-act="tf-days" data-v="all">${t('Every day')}</button><button data-act="tf-days" data-v="week">${t('Weekdays')}</button><button data-act="tf-days" data-v="weekend">${t('Weekend')}</button></div></div>
<div class="ctl"><div class="hd"><span>${t('Choose devices')}</span><b>${f.ents.length || ''}</b></div><label class="search" data-static style="margin-top:8px;box-shadow:none;background:var(--card)">${ic('search')}<input type="search" placeholder="${t('Search')}" data-in="tf-q" value="${esc(f.q || '')}"></label>
<div class="tents-list">${shown.map((e) => { const on = f.ents.includes(e); return `<button class="it${on ? ' sel' : ''}" data-act="tf-ent" data-eid="${esc(e)}" data-k="te-${esc(e)}"><span class="ic">${ic(devIcon(e, st(e)))}</span><span class="lb"><b>${esc(nameOf(e))}</b><span>${esc(roomNameOf(e))}</span></span><span class="chk${on ? ' on' : ''}">${on ? ic('ok') : ''}</span></button>`; }).join('')}</div></div>
<div class="field"><label for="tf-name">${t('Name')}</label><div class="inp"><input id="tf-name" type="text" value="${esc(f.alias || '')}" placeholder="${esc(f.time + ' · ' + t(f.verb === 'on' ? 'On' : 'Off'))}"></div></div>
<div class="btns"><button class="btn pri" data-act="tf-save" ${S.saving ? 'disabled' : ''}>${S.saving ? ic('refresh', 'spin') : ic('ok')}${t('Save')}</button>${f.id ? `<button class="btn danger" data-act="tf-del">${ic('x')}${t('Delete')}</button>` : ''}</div></div>`;
      return b + '</div>';
    }
    return '';
  }

  /* =====================================================================
     AUTOMATIONS TAB (new in 1.9) – separate section, uses the existing
     connection, api() helper and automation config cache (S.autoCfg).
     ===================================================================== */
  S.aq = ''; S.af = 'all'; S.aopen = {};
  const tl = (en, nl) => (settings.lang === 'nl' ? nl : en);
  function nmE(e) { return S.states[e] ? nameOf(e) : String(e).split('.').pop().replace(/_/g, ' '); }
  function nmList(ids) { ids = [].concat(ids || []); if (!ids.length) return ''; const n = ids.map(nmE); return n.length > 2 ? n.slice(0, 2).join(', ') + ' +' + (n.length - 2) : n.join(', '); }
  function durTxt(d) { if (!d) return ''; if (typeof d === 'string') { const p = d.split(':').map(Number); d = { hours: p[0], minutes: p[1], seconds: p[2] }; } const h = +d.hours || 0, m = +d.minutes || 0, s = +d.seconds || 0; return [h ? h + ' u' : '', m ? m + ' min' : '', s && !h ? s + ' s' : ''].filter(Boolean).join(' ') || '0 s'; }
  function stName(e, v) { if (v == null) return ''; const d = String(e).split('.')[0]; const MAP = { on: tl('on', 'aan'), off: tl('off', 'uit'), home: tl('home', 'thuis'), not_home: tl('away', 'weg'), open: tl('open', 'open'), closed: tl('closed', 'dicht'), heat: tl('heating', 'verwarmen'), cool: tl('cooling', 'koelen') }; return [].concat(v).map((x) => MAP[x] || (d === 'binary_sensor' && x === 'on' ? tl('detected', 'gedetecteerd') : String(x).replace(/_/g, ' '))).join(tl(' or ', ' of ')); }
  function trigText(tr) {
    if (!tr || typeof tr !== 'object') return '';
    const pf = tr.trigger || tr.platform; const fr = tr.for ? ' ' + tl('for', 'gedurende') + ' ' + durTxt(tr.for) : '';
    switch (pf) {
      case 'time': return tl('At ', 'Om ') + [].concat(tr.at || []).map((x) => (/^\d/.test(x) ? String(x).slice(0, 5) : nmE(x))).join(', ');
      case 'sun': return (tr.event === 'sunset' ? tl('At sunset', 'Bij zonsondergang') : tl('At sunrise', 'Bij zonsopkomst')) + (tr.offset ? ' (' + tr.offset + ')' : '');
      case 'state': return nmList(tr.entity_id) + (tr.to != null ? ' → ' + stName([].concat(tr.entity_id)[0], tr.to) : tl(' changes', ' verandert')) + fr;
      case 'numeric_state': return nmList(tr.entity_id) + (tr.below != null ? tl(' below ', ' onder ') + tr.below : '') + (tr.above != null ? tl(' above ', ' boven ') + tr.above : '') + fr;
      case 'time_pattern': return tl('Every ', 'Elke ') + (tr.minutes ? String(tr.minutes).replace('/', '') + ' min' : tr.hours ? String(tr.hours).replace('/', '') + ' u' : tr.seconds ? String(tr.seconds).replace('/', '') + ' s' : tl('time', 'keer'));
      case 'homeassistant': return tr.event === 'shutdown' ? tl('When Home Assistant stops', 'Als Home Assistant stopt') : tl('When Home Assistant starts', 'Als Home Assistant start');
      case 'template': return tl('When a template is true', 'Als een sjabloon klopt') + fr;
      case 'zone': return nmList(tr.entity_id) + (tr.event === 'leave' ? tl(' leaves ', ' verlaat ') : tl(' enters ', ' komt in ')) + nmE(tr.zone);
      case 'device': return tl('Device: ', 'Apparaat: ') + String(tr.type || '').replace(/_/g, ' ') + (tr.entity_id ? ' (' + nmE(tr.entity_id) + ')' : '');
      case 'event': return tl('Event ', 'Gebeurtenis ') + (tr.event_type || '');
      case 'mqtt': return 'MQTT ' + (tr.topic || '');
      case 'webhook': return 'Webhook';
      case 'calendar': return tl('Calendar ', 'Agenda ') + nmE(tr.entity_id);
      default: return pf ? cap(String(pf).replace(/_/g, ' ')) : '';
    }
  }
  function condText(c) {
    if (!c) return ''; if (typeof c === 'string') return tl('Template', 'Sjabloon');
    if (c.enabled === false) return '';
    const k = c.condition;
    const wd = (w) => [].concat(w).map((d) => dayShort(d)).join(' ');
    switch (k) {
      case 'and': return [].concat(c.conditions || []).map(condText).filter(Boolean).join(tl(' and ', ' en '));
      case 'or': return '(' + [].concat(c.conditions || []).map(condText).filter(Boolean).join(tl(' or ', ' of ')) + ')';
      case 'not': return tl('not ', 'niet ') + '(' + [].concat(c.conditions || []).map(condText).filter(Boolean).join(', ') + ')';
      case 'state': return nmList(c.entity_id) + ' = ' + stName([].concat(c.entity_id)[0], c.state) + (c.for ? ' ' + tl('for', 'gedurende') + ' ' + durTxt(c.for) : '');
      case 'numeric_state': return nmList(c.entity_id) + (c.below != null ? ' < ' + c.below : '') + (c.above != null ? ' > ' + c.above : '');
      case 'time': return [c.after ? tl('after ', 'na ') + String(c.after).slice(0, 5) : '', c.before ? tl('before ', 'voor ') + String(c.before).slice(0, 5) : '', c.weekday ? wd(c.weekday) : ''].filter(Boolean).join(', ');
      case 'sun': return [c.after ? tl('after ', 'na ') + (c.after === 'sunset' ? tl('sunset', 'zonsondergang') : tl('sunrise', 'zonsopkomst')) : '', c.before ? tl('before ', 'voor ') + (c.before === 'sunset' ? tl('sunset', 'zonsondergang') : tl('sunrise', 'zonsopkomst')) : ''].filter(Boolean).join(', ');
      case 'zone': return nmList(c.entity_id) + tl(' in ', ' in ') + nmE(c.zone);
      case 'trigger': return tl('trigger ', 'trigger ') + [].concat(c.id).join(', ');
      case 'template': return tl('template check', 'sjablooncontrole');
      case 'device': return tl('device: ', 'apparaat: ') + String(c.type || '').replace(/_/g, ' ');
      default: return k ? String(k).replace(/_/g, ' ') : '';
    }
  }
  function actText(ac) {
    if (!ac || typeof ac !== 'object') return '';
    if (ac.enabled === false) return '';
    const sv = ac.action || ac.service;
    if (sv) { const ids = (ac.target && ac.target.entity_id) || ac.entity_id || (ac.data && ac.data.entity_id) || []; const verb = /turn_on/.test(sv) ? tl('Turn on', 'Zet aan') : /turn_off/.test(sv) ? tl('Turn off', 'Zet uit') : /toggle/.test(sv) ? tl('Toggle', 'Wissel') : /notify/.test(sv) ? tl('Send notification', 'Stuur melding') : cap(String(sv.split('.')[1] || sv).replace(/_/g, ' ')); return verb + (ids.length || (ac.target && ac.target.area_id) ? ': ' + (nmList(ids) || [].concat(ac.target.area_id).join(', ')) : ''); }
    if (ac.delay) return tl('Wait ', 'Wacht ') + durTxt(ac.delay);
    if (ac.wait_for_trigger || ac.wait_template) return tl('Wait for a condition', 'Wacht op een voorwaarde');
    if (ac.choose) return tl('Choice', 'Keuze') + ' (' + [].concat(ac.choose).length + ')';
    if (ac.if) return tl('If … then …', 'Als … dan …');
    if (ac.scene) return tl('Scene ', 'Scène ') + nmE(ac.scene);
    if (ac.repeat) return tl('Repeat', 'Herhaal');
    if (ac.variables) return '';
    if (ac.device_id) return tl('Device action', 'Apparaatactie') + (ac.entity_id ? ': ' + nmE(ac.entity_id) : '');
    if (ac.event) return tl('Event ', 'Gebeurtenis ') + ac.event;
    if (ac.stop) return 'Stop';
    return '';
  }
  function autoSummary(cfg) {
    const arr = (x) => [].concat(x || []);
    const trig = arr(cfg && (cfg.triggers || cfg.trigger)).map(trigText).filter(Boolean);
    const cond = arr(cfg && (cfg.conditions || cfg.condition)).map(condText).filter(Boolean);
    const act = arr(cfg && (cfg.actions || cfg.action)).map(actText).filter(Boolean);
    return { trig, cond, act };
  }
  function whenAgo(iso) {
    if (!iso) return tl('Never', 'Nog nooit');
    const t0 = Date.parse(iso); if (!isFinite(t0)) return '—';
    const m = Math.round((Date.now() - t0) / 60000);
    const rel = m < 1 ? tl('just now', 'zojuist') : m < 60 ? tl(m + ' min ago', m + ' min geleden') : m < 1440 ? tl(Math.round(m / 60) + ' h ago', Math.round(m / 60) + ' uur geleden') : tl(Math.round(m / 1440) + ' days ago', Math.round(m / 1440) + ' dagen geleden');
    return rel;
  }
  function absTime(d) { return d.toLocaleString(loc(), { weekday: 'short', day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit', hourCycle: 'h23' }); }

  /* ---- Oscar Airco Heating ---- */
  const OSC_ID = 'comfort_oscar_airco_heating';
  const OSC = { start: 16, target: 22, stop: 19, maxMin: 30, waitH: 2 };
  const oscEnt = () => Object.keys(S.states).find((e) => e.startsWith('automation.') && String(S.states[e].attributes.id) === OSC_ID) || null;
  function oscCfgEnts() { const c = S.autoCfg[OSC_ID]; if (!c || c.__err) return null; const v = (c.variables || {}); return v.ac ? v : null; }
  function oscFind() {
    const m = model();
    const acs = m.climates.filter(isAC);
    const ac = acs.find((e) => /oscar/i.test(fname(e) + ' ' + roomNameOf(e))) || null;
    const room = ac && roomOfEid(ac);
    let sensor = null;
    if (room) { const cand = room.temps.filter((e) => !isOutside(e) && !isJunkT(e) && !isACsensor(e) && numOf(e) != null); sensor = cand[0] || null; }
    const dev = ac && (S.ents[ac] || {}).device_id;
    const conn = dev ? Object.keys(S.ents).find((e) => S.ents[e].device_id === dev && S.states[e] && /^sensor\./.test(e) && (S.states[e].attributes.options || []).includes('disconnected')) || null : null;
    return { ac, sensor, conn };
  }
  function oscCaps(ac) {
    const a = ((S.states[ac] || {}).attributes) || {};
    const heat = (a.hvac_modes || []).includes('heat');
    const preset = (a.preset_modes || []).find((p) => /^power/i.test(p) || /boost/i.test(p)) || null;
    const fans = a.fan_modes || []; const fan = preset ? null : (fans.find((f) => /^(high|max|5|level 5|turbo)$/i.test(f)) || fans[fans.length - 1] || null);
    return { heat, preset, fan, min: +a.min_temp || 16, max: +a.max_temp || 30 };
  }
  function oscConfig(f) {
    const A = f.ac, T = f.sensor, CN = f.conn, cp = oscCaps(A);
    const tgt = { entity_id: A };
    const num = `states('${T}')`;
    const valid = `is_number(${num})`;
    const ours = `(is_state('${A}', 'heat') and (state_attr('${A}', 'temperature') | float(0)) == ${OSC.target}` + (cp.preset ? ` and is_state_attr('${A}', 'preset_mode', '${cp.preset}'))` : cp.fan ? ` and is_state_attr('${A}', 'fan_mode', '${cp.fan}'))` : ')');
    const log = (msg) => ({ action: 'logbook.log', data: { name: 'Oscar Airco Heating', message: msg, entity_id: '{{ this.entity_id }}' }, continue_on_error: true });
    const power = cp.preset ? { action: 'climate.set_preset_mode', target: tgt, data: { preset_mode: cp.preset }, continue_on_error: true }
      : cp.fan ? { action: 'climate.set_fan_mode', target: tgt, data: { fan_mode: cp.fan }, continue_on_error: true } : null;
    const startConds = [
      { condition: 'trigger', id: 'start' },
      { condition: 'template', value_template: `{{ ${valid} and (${num} | float) < ${OSC.start} }}` },
      { condition: 'template', value_template: `{{ states('${A}') not in ['unavailable', 'unknown', ''] }}` },
      { condition: 'template', value_template: `{{ this.attributes.last_triggered is none or (now() - this.attributes.last_triggered).total_seconds() >= ${OSC.waitH * 3600} }}` },
      { condition: 'template', value_template: `{{ not ${ours} }}` }
    ];
    if (CN) startConds.splice(3, 0, { condition: 'template', value_template: `{{ states('${CN}') not in ['disconnected', 'authentication_error'] }}` });
    const waits = [
      { trigger: 'template', value_template: `{{ ${valid} and (${num} | float) >= ${OSC.stop} }}`, id: 'reached' },
      { trigger: 'state', entity_id: T, to: ['unavailable', 'unknown'], for: { minutes: 1 }, id: 'lost' },
      { trigger: 'state', entity_id: A, to: ['unavailable', 'unknown'], for: { minutes: 1 }, id: 'lost' },
      { trigger: 'template', value_template: `{{ not ${ours} }}`, for: { seconds: 20 }, id: 'manual' }
    ];
    if (CN) waits.splice(3, 0, { trigger: 'state', entity_id: CN, to: ['disconnected', 'authentication_error'], for: { minutes: 2 }, id: 'lost' });
    return {
      alias: 'Oscar Airco Heating',
      description: `Verwarmt de kamer van Oscar met alleen de airco ${nameOf(A)} als het kouder is dan ${OSC.start} °C: stand Heating, ${cp.preset ? 'Powerful' : 'ventilator maximaal'}, ${OSC.target} °C. Stopt bij ${OSC.stop} °C of na maximaal ${OSC.maxMin} minuten; maximaal één keer per ${OSC.waitH} uur. Zet daarna de oorspronkelijke airco-instellingen terug. Gemaakt met Comfort Home.`,
      mode: 'single', max_exceeded: 'silent',
      variables: { ac: A, sensor: T, conn: CN || '', start_below: OSC.start, target: OSC.target, stop_at: OSC.stop, max_minutes: OSC.maxMin, wait_hours: OSC.waitH },
      triggers: [
        { trigger: 'numeric_state', entity_id: T, below: OSC.start, for: { minutes: 2 }, id: 'start' },
        { trigger: 'time_pattern', minutes: '/5', id: 'start' },
        { trigger: 'homeassistant', event: 'start', id: 'recover' }
      ],
      conditions: [{ condition: 'or', conditions: [
        { condition: 'and', conditions: startConds },
        { condition: 'and', conditions: [{ condition: 'trigger', id: 'recover' }, { condition: 'template', value_template: `{{ ${ours} and this.attributes.last_triggered is not none and (now() - this.attributes.last_triggered).total_seconds() < ${OSC.waitH * 3600} }}` }] }
      ] }],
      actions: [{ choose: [{ conditions: [{ condition: 'trigger', id: 'recover' }], sequence: [
        cp.preset ? { action: 'climate.set_preset_mode', target: tgt, data: { preset_mode: 'none' }, continue_on_error: true } : { delay: { seconds: 0 } },
        { action: 'climate.turn_off', target: tgt, continue_on_error: true },
        log('Home Assistant is herstart tijdens het verwarmen: veilig gestopt, airco uit.')
      ] }], default: [
        { variables: { was_off: `{{ is_state('${A}', 'off') }}`, start_temp: `{{ ${num} }}` } },
        { action: 'scene.create', data: { scene_id: 'oscar_airco_heating_backup', snapshot_entities: [A] } },
        log('Verwarmen gestart bij {{ start_temp }} °C.'),
        { action: 'climate.set_hvac_mode', target: tgt, data: { hvac_mode: 'heat' }, continue_on_error: true },
        { delay: { seconds: 3 } },
        { action: 'climate.set_temperature', target: tgt, data: { temperature: OSC.target }, continue_on_error: true },
        { delay: { seconds: 2 } }
      ].concat(power ? [power] : []).concat([
        { delay: { seconds: 30 } },
        { wait_for_trigger: waits, timeout: { minutes: OSC.maxMin - 1, seconds: 25 }, continue_on_timeout: true },
        { variables: { reason: "{{ wait.trigger.id if wait.trigger else 'max' }}" } },
        { choose: [{ conditions: [{ condition: 'template', value_template: "{{ reason == 'manual' }}" }], sequence: [log('Gestopt: de airco is met de hand aangepast. Jouw instellingen blijven staan.')] }],
          default: [
            { action: 'scene.turn_on', target: { entity_id: 'scene.oscar_airco_heating_backup' }, continue_on_error: true },
            { delay: { seconds: 5 } },
            { if: [{ condition: 'template', value_template: `{{ was_off and not is_state('${A}', 'off') }}` }], then: [{ action: 'climate.turn_off', target: tgt, continue_on_error: true }] },
            { choose: [
              { conditions: [{ condition: 'template', value_template: "{{ reason == 'reached' }}" }], sequence: [log(`Temperatuur bereikt (${OSC.stop} °C): oorspronkelijke instellingen teruggezet.`)] },
              { conditions: [{ condition: 'template', value_template: "{{ reason == 'lost' }}" }], sequence: [log('Verbinding of sensor verloren: veilig gestopt en oorspronkelijke instellingen teruggezet.')] }
            ], default: [log(`Maximale verwarmingsduur bereikt (${OSC.maxMin} min): oorspronkelijke instellingen teruggezet.`)] }
          ] }
      ]) }]
    };
  }
  S.oscLog = null;
  async function loadOscLog(force) {
    const e = oscEnt(); if (!e || !C || !C.authed) return;
    if (!force && S.oscLog && Date.now() - S.oscLog.at < 60e3) return;
    S.oscLog = Object.assign({ items: [] }, S.oscLog, { at: Date.now() });
    try { const r = await C.send({ type: 'logbook/get_events', start_time: new Date(Date.now() - 24 * 3600e3).toISOString(), entity_ids: [e] }, 20000); S.oscLog = { at: Date.now(), items: (r || []).filter((x) => x.message && x.name === 'Oscar Airco Heating').map((x) => ({ t: (typeof x.when === 'number' ? x.when * 1000 : Date.parse(x.when)), m: x.message })).sort((x, y) => y.t - x.t) }; }
    catch (er) { S.oscLog = { at: Date.now(), items: [], err: er.message }; }
    schedule(true);
  }
  function oscStatus() {
    const e = oscEnt(); if (!e) return { key: 'none' };
    const s = S.states[e]; const a = s.attributes;
    const lt = a.last_triggered ? Date.parse(a.last_triggered) : null;
    const next = lt ? new Date(lt + OSC.waitH * 3600e3) : null;
    const items = (S.oscLog && S.oscLog.items) || [];
    const lastEnd = items.find((x) => !/gestart/i.test(x.m));
    const lastStart = items.find((x) => /gestart/i.test(x.m));
    const out = { e, s, lt, next, lastEnd, lastStart };
    if (s.state !== 'on') return Object.assign(out, { key: 'disabled' });
    if (+a.current > 0) return Object.assign(out, { key: 'heating' });
    const recent = lastEnd && Date.now() - lastEnd.t < 15 * 60e3 && (!lt || (lastEnd.t >= lt && lastEnd.t - lt <= (OSC.maxMin + 5) * 60e3));
    if (recent && /bereikt \(/i.test(lastEnd.m) && /Temperatuur/i.test(lastEnd.m)) return Object.assign(out, { key: 'reached' });
    if (recent && /verwarmingsduur/i.test(lastEnd.m)) return Object.assign(out, { key: 'maxed' });
    if (next && next > Date.now()) return Object.assign(out, { key: 'cooldown' });
    return Object.assign(out, { key: 'idle' });
  }
  const OSC_ST = { none: ['Not installed', 'Niet geïnstalleerd', 'off'], disabled: ['Disabled', 'Uitgeschakeld', 'off'], heating: ['Heating', 'Verwarmen', 'heat'], reached: ['Temperature reached', 'Temperatuur bereikt', 'ok'], maxed: ['Maximum heating time reached', 'Maximale verwarmingsduur bereikt', 'warn'], cooldown: ['Waiting time active', 'Wachttijd actief', 'wait'], idle: ['Inactive', 'Inactief', 'idle'] };
  function oscCard() {
    const st0 = oscStatus(); const f = oscCfgEnts() || oscFind();
    const sv = f.sensor ? numOf(f.sensor) : null;
    const [en, nl, cls] = OSC_ST[st0.key];
    if (st0.e) { const key = st0.s.last_updated + '|' + st0.s.attributes.current; const force = S.oscKey !== key; S.oscKey = key; setTimeout(() => loadOscLog(force), force ? 1500 : 0); }
    let out = `<div class="osc st-${cls}" data-k="osc"><div class="osc-h"><span class="osc-i">${ic('flame')}</span><div class="osc-t"><b>Oscar Airco Heating</b><span>${tl('Heats Oscar’s room with the air conditioner when it gets cold', 'Verwarmt de kamer van Oscar met de airco als het koud wordt')}</span></div>`;
    if (st0.e) out += `<button class="tg${S.pending[st0.e] ? ' pending' : ''}" role="switch" aria-checked="${st0.s.state === 'on'}" aria-label="Oscar Airco Heating" data-act="osc-toggle" ${C && C.authed ? '' : 'disabled'}><span class="kn"></span></button>`;
    out += `</div><div class="osc-status"><span class="sdot"></span><b>${tl(en, nl)}</b>${st0.key === 'heating' && st0.lt ? `<span class="osc-sub">${tl('for', 'al')} ${Math.max(0, Math.round((Date.now() - st0.lt) / 60000))} / ${OSC.maxMin} min</span>` : ''}</div>`;
    if (st0.key === 'heating' && st0.lt) out += `<div class="osc-bar"><i style="width:${clamp((Date.now() - st0.lt) / (OSC.maxMin * 60e3) * 100, 0, 100).toFixed(1)}%"></i></div>`;
    const nextTxt = st0.key === 'none' ? '—' : st0.next && st0.next > Date.now() ? absTime(st0.next) : tl('Now (if colder than 16 °C)', 'Nu (als het kouder is dan 16 °C)');
    const cells = [
      [tl('Automation', 'Automatisering'), st0.key === 'none' ? '—' : st0.s.state === 'on' ? tl('On', 'Aan') : tl('Off', 'Uit')],
      [tl('Room temperature', 'Kamertemperatuur'), sv != null ? fmtT(sv) : tl('No value', 'Geen waarde')],
      [tl('Start temperature', 'Starttemperatuur'), OSC.start + ' °C'],
      [tl('Target temperature', 'Gewenste temperatuur'), OSC.target + ' °C'],
      [tl('Stop temperature', 'Stoptemperatuur'), OSC.stop + ' °C'],
      [tl('Heating time', 'Verwarmingsduur'), tl('max. ', 'max. ') + OSC.maxMin + ' min'],
      [tl('Next allowed cycle', 'Volgende toegestane cyclus'), nextTxt],
      [tl('Last active', 'Laatst actief'), st0.lt ? whenAgo(new Date(st0.lt).toISOString()) : tl('Never', 'Nog nooit')]
    ];
    out += `<dl class="osc-grid">${cells.map(([k, v]) => `<div><dt>${esc(k)}</dt><dd class="num">${esc(v)}</dd></div>`).join('')}</dl>`;
    if (st0.lastEnd) out += `<div class="osc-last">${ic('info')}<span>${esc(st0.lastEnd.m)} <small>${esc(whenAgo(new Date(st0.lastEnd.t).toISOString()))}</small></span></div>`;
    if (st0.key === 'none') {
      out += `<p class="osc-note">${tl('This automation runs inside Home Assistant itself, also when this app is closed. Install it once:', 'Deze automatisering draait in Home Assistant zelf, ook als deze app dicht is. Installeer hem één keer:')}</p><button class="btn pri osc-btn" data-act="osc-install" ${C && C.authed ? '' : 'disabled'}>${ic('plus')}${tl('Install in Home Assistant', 'Installeren in Home Assistant')}</button>`;
    } else {
      out += `<div class="osc-act"><button class="btn" data-act="osc-install">${ic('settings')}${tl('Details & devices', 'Details en apparaten')}</button>${EMBED ? `<button class="btn" data-act="go-panel" data-p="config/automation/edit/${OSC_ID}">${ic('grid')}${tl('Open in Home Assistant', 'Openen in Home Assistant')}</button>` : ''}</div>`;
    }
    return out + '</div>';
  }
  function oscSheet() {
    const head = `<div class="scrim" data-act="close-sheet" data-k="scrim"></div><div class="sheet" role="dialog" aria-modal="true" aria-label="Oscar Airco Heating" data-k="sheet-osc"><div class="grab"></div><div class="sh"><span class="dico" style="background:#fff1e6;color:#ea580c">${ic('flame')}</span><div class="t"><b>Oscar Airco Heating</b><span>${tl('Checked devices', 'Gecontroleerde apparaten')}</span></div><button class="star" data-act="close-sheet" aria-label="Close">${ic('x')}</button></div>`;
    const f = S.oscForm || oscFind(); const m = model();
    const acs = m.climates.filter(isAC);
    const sensors = Object.keys(S.states).filter((e) => e.startsWith('sensor.') && (S.states[e].attributes.device_class === 'temperature') && !isOutside(e) && !isJunkT(e));
    const cp = f.ac ? oscCaps(f.ac) : {};
    const ok = (b) => `<span class="okb ${b ? 'y' : 'n'}">${b ? ic('ok') : ic('x')}</span>`;
    const sel = (key, list, cur) => `<select data-in="osc-${key}" aria-label="${key}">${list.length ? '' : '<option value="">—</option>'}${list.map((e) => `<option value="${esc(e)}" ${e === cur ? 'selected' : ''}>${esc(nameOf(e))} · ${esc(e)}</option>`).join('')}</select>`;
    const installed = !!oscEnt();
    const ready = f.ac && f.sensor && cp.heat && (cp.preset || cp.fan) && numOf(f.sensor) != null;
    let b = head + `<div class="oscf">
<div class="oscrow">${ok(!!f.ac)}<div><b>${tl('Air conditioner (only this one is used)', 'Airco (alleen deze wordt bediend)')}</b>${sel('ac', acs, f.ac)}<small>${f.ac ? esc(roomNameOf(f.ac) || '') + ((S.devices[(S.ents[f.ac] || {}).device_id] || {}).model ? ' · ' + esc(S.devices[(S.ents[f.ac] || {}).device_id].model) : '') : tl('Not found – choose it above', 'Niet gevonden – kies hierboven')}</small></div></div>
<div class="oscrow">${ok(f.sensor && numOf(f.sensor) != null)}<div><b>${tl('Room temperature sensor', 'Temperatuursensor van de kamer')}</b>${sel('sensor', sensors, f.sensor)}<small>${f.sensor ? tl('Now: ', 'Nu: ') + fmtT(numOf(f.sensor)) : ''}</small></div></div>
<div class="oscrow">${ok(cp.heat)}<div><b>${tl('Heating mode', 'Verwarmingsstand')}</b><small>${cp.heat ? 'heat ✓' : tl('This air conditioner has no heat mode', 'Deze airco heeft geen verwarmingsstand')}</small></div></div>
<div class="oscrow">${ok(!!(cp.preset || cp.fan))}<div><b>Power Full</b><small>${cp.preset ? `preset “${esc(cp.preset)}”` : cp.fan ? tl(`No Powerful preset: fan speed “${cp.fan}” is used`, `Geen Powerful-stand: ventilatorstand “${cp.fan}” wordt gebruikt`) : tl('No power setting found', 'Geen vermogensinstelling gevonden')}</small></div></div>
<div class="oscrow">${ok(true)}<div><b>${tl('Connection check', 'Verbindingscontrole')}</b><small>${f.conn ? esc(nameOf(f.conn)) + ' (' + esc(S.states[f.conn] ? S.states[f.conn].state : '?') + ')' : tl('Uses the availability of the air conditioner and sensor', 'Gebruikt de beschikbaarheid van airco en sensor')}</small></div></div>
<div class="oscrules"><b>${tl('Rules', 'Regels')}</b><ul>
<li>${tl('Starts below', 'Start onder')} ${OSC.start} °C (${tl('2 min steady', '2 min stabiel')}) → Heating, Power Full, ${OSC.target} °C</li>
<li>${tl('Stops at', 'Stopt bij')} ${OSC.stop} °C ${tl('or after', 'of na')} ${OSC.maxMin} min → ${tl('original settings restored', 'oorspronkelijke instellingen terug')}</li>
<li>${tl('At most once every', 'Hooguit één keer per')} ${OSC.waitH} ${tl('hours', 'uur')}; ${tl('never two at the same time', 'nooit twee tegelijk')}</li>
<li>${tl('Changed the AC yourself during heating? Then your settings stay.', 'Zelf de airco aangepast tijdens het verwarmen? Dan blijven jouw instellingen staan.')}</li>
<li>${tl('No sensor value or connection lost → does not start / stops safely', 'Geen sensorwaarde of verbinding weg → start niet / stopt veilig')}</li></ul></div>`;
    b += `<button class="btn pri" style="width:100%" data-act="osc-save" ${ready && !S.saving ? '' : 'disabled'}>${S.saving ? ic('refresh', 'spin') : ic('ok')}${installed ? tl('Update in Home Assistant', 'Bijwerken in Home Assistant') : tl('Install in Home Assistant', 'Installeren in Home Assistant')}</button>`;
    if (installed) b += `<button class="btn danger" style="width:100%;margin-top:10px" data-act="osc-remove">${ic('x')}${tl('Remove automation', 'Automatisering verwijderen')}</button>`;
    return b + '</div></div>';
  }
  async function oscSave() {
    const f = S.oscForm; if (!f) return;
    S.saving = true; schedule(true);
    try { const cfg = oscConfig(f); await api('POST', 'config/automation/config/' + OSC_ID, cfg); S.autoCfg[OSC_ID] = Object.assign({ id: OSC_ID }, cfg); toast(tl('Oscar Airco Heating saved in Home Assistant', 'Oscar Airco Heating opgeslagen in Home Assistant'), 'ok'); closeSheet(); refreshSoon(); }
    catch (e) { toast(e.message, 'bad', 6000); }
    S.saving = false; schedule(true);
  }
  async function oscRemove() {
    if (!confirm(tl('Remove Oscar Airco Heating from Home Assistant?', 'Oscar Airco Heating verwijderen uit Home Assistant?'))) return;
    const e = oscEnt(); const st0 = oscStatus();
    if (st0.key === 'heating') await oscRestore();
    try { await api('DELETE', 'config/automation/config/' + OSC_ID); delete S.autoCfg[OSC_ID]; toast(tl('Removed', 'Verwijderd'), 'ok'); closeSheet(); refreshSoon(); } catch (er) { toast(er.message, 'bad', 6000); }
    return e;
  }
  async function oscRestore() {
    if (!S.states['scene.oscar_airco_heating_backup']) return;
    try { await C.send({ type: 'call_service', domain: 'scene', service: 'turn_on', service_data: { entity_id: 'scene.oscar_airco_heating_backup' } }); await C.send({ type: 'call_service', domain: 'logbook', service: 'log', service_data: { name: 'Oscar Airco Heating', message: 'Uitgeschakeld tijdens het verwarmen: oorspronkelijke instellingen teruggezet.', entity_id: oscEnt() } }); } catch (e) { /* best effort */ }
  }
  async function oscToggle() {
    const e = oscEnt(); if (!e) return; const s = S.states[e]; const was = s.state === 'on';
    if (was && +s.attributes.current > 0) await oscRestore();
    command(e, 'automation', was ? 'turn_off' : 'turn_on', null, (ns) => (ns.state === 'on') !== was);
    setTimeout(() => loadOscLog(true), 2500);
  }

  /* ---- the tab ---- */
  function pAutomations() {
    let out = `<div class="page apage" data-k="p-automations"><div class="topbar"><h1>Automations</h1>${pill()}</div>${banner()}`;
    if (!configured()) return out + welcomeHTML() + '</div>';
    const all = Object.keys(S.states).filter((e) => e.startsWith('automation.'));
    if (all.some((e) => S.states[e].attributes.id != null && !S.autoCfg[String(S.states[e].attributes.id)])) setTimeout(() => loadAutos(false), 0);
    all.forEach((e) => used.add(e));
    const osc = oscEnt();
    const list = all.filter((e) => e !== osc);
    const act = all.filter((e) => S.states[e].state === 'on').length;
    out += `<div class="astats" data-k="astats"><div class="as on"><b class="num">${act}</b><span>${tl('Active', 'Actief')}</span></div><div class="as off"><b class="num">${all.length - act}</b><span>${tl('Disabled', 'Uitgeschakeld')}</span></div><div class="as tot"><b class="num">${all.length}</b><span>${tl('Total', 'Totaal')}</span></div></div>`;
    out += `<div class="sec" data-k="osc-sec"><div class="sec-h"><h2>${tl('Climate automation', 'Klimaatautomatisering')}</h2></div>${oscCard()}</div>`;
    const q = S.aq.trim().toLowerCase();
    let shown = list.filter((e) => (S.af === 'all' || (S.af === 'on' ? S.states[e].state === 'on' : S.states[e].state !== 'on')));
    if (q) shown = shown.filter((e) => { const c = S.autoCfg[String(S.states[e].attributes.id)] || {}; return (nameOf(e) + ' ' + (c.description || '')).toLowerCase().includes(q); });
    shown.sort((x, y) => nameOf(x).localeCompare(nameOf(y)));
    out += `<div class="sec" data-k="alist-sec"><div class="sec-h"><h2>${tl('All automations', 'Alle automatiseringen')}</h2><span class="aux">${shown.length}</span></div>
<div class="atools"><label class="search" data-static>${ic('search')}<input type="search" placeholder="${tl('Search automations', 'Zoek automatisering')}" value="${esc(S.aq)}" data-in="asearch" aria-label="Search" autocomplete="off"></label>
<div class="chips">${[['all', tl('All', 'Alle')], ['on', tl('Active', 'Actief')], ['off', tl('Disabled', 'Uitgeschakeld')]].map(([v, l]) => `<button class="chip${S.af === v ? ' sel' : ''}" data-act="afilter" data-v="${v}" data-k="af-${v}">${l}</button>`).join('')}</div></div>`;
    out += shown.length ? `<div class="agrid">${shown.map(autoCard).join('')}</div>` : emptyHTML('auto', tl('No automations found.', 'Geen automatiseringen gevonden.'), 'aempty');
    return out + '</div></div>';
  }
  function autoCard(e) {
    const s = S.states[e]; const a = s.attributes; const id = a.id != null ? String(a.id) : null; const cfg = id ? S.autoCfg[id] : null;
    const on = s.state === 'on'; const running = +a.current > 0; const na = !avail(s);
    const sm = cfg && !cfg.__err ? autoSummary(cfg) : null;
    const desc = cfg && !cfg.__err && cfg.description ? cfg.description : sm ? [sm.trig[0], sm.act[0]].filter(Boolean).join(' → ') : id ? '' : tl('Made in YAML: details only in Home Assistant', 'Gemaakt in YAML: details alleen in Home Assistant');
    const open = !!S.aopen[e];
    const row = (icon, label, items) => items && items.length ? `<div class="arow"><span class="ari">${ic(icon)}</span><div><span class="arl">${label}</span><span class="arv">${esc(items.slice(0, open ? 20 : 2).join(' · '))}${!open && items.length > 2 ? ` <i>+${items.length - 2}</i>` : ''}</span></div></div>` : '';
    return `<article class="acard${on ? ' on' : ' off'}${running ? ' run' : ''}${na ? ' na' : ''}" data-k="ac-${esc(e)}">
<div class="ac-h"><span class="ac-dot" aria-hidden="true"></span><div class="ac-t"><h3>${esc(a.friendly_name || e)}</h3><span class="ac-st">${running ? tl('Running now', 'Bezig') : on ? tl('Active', 'Actief') : na ? tl('Unavailable', 'Niet beschikbaar') : tl('Disabled', 'Uitgeschakeld')}</span></div>
<button class="tg${S.pending[e] ? ' pending' : ''}" role="switch" aria-checked="${on}" aria-label="${esc(a.friendly_name || e)}" data-act="auto-toggle" data-eid="${esc(e)}" ${C && C.authed && !na ? '' : 'disabled'}><span class="kn"></span></button></div>
${desc ? `<p class="ac-d">${esc(desc)}</p>` : ''}
${!cfg && id ? '<div class="skel" style="min-height:44px"></div>' : ''}
${sm ? row('clock', tl('When', 'Wanneer'), sm.trig) + row('shield', tl('Conditions', 'Voorwaarden'), sm.cond.length ? sm.cond : [tl('None', 'Geen')]) + row('play', tl('Then', 'Dan'), sm.act) : ''}
<div class="ac-f"><span>${ic('clock')}${tl('Last active', 'Laatst actief')}: <b>${esc(whenAgo(a.last_triggered))}</b></span>${sm && (sm.trig.length > 2 || sm.cond.length > 2 || sm.act.length > 2) ? `<button class="ac-more" data-act="aopen" data-eid="${esc(e)}" aria-expanded="${open}">${open ? tl('Less', 'Minder') : tl('More', 'Meer')}</button>` : ''}${EMBED && id ? `<button class="ac-more" data-act="go-panel" data-p="config/automation/edit/${esc(id)}">${tl('Edit', 'Bewerken')}</button>` : ''}</div></article>`;
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
      out += `<p style="font-size:13px;color:var(--muted);margin:0 2px 12px">Your login is handled by Home Assistant itself. The app stays logged in and reconnects automatically.</p><div class="btns" style="flex-direction:column"><button class="btn pri" data-act="ha-menu">${ic('home')}${t('Open Home Assistant')}</button><button class="btn danger" data-act="embed-logout">${ic('logout')}${t('Log out')}</button></div><p style="font-size:12.5px;color:var(--muted);margin:10px 2px 0">${t('Back to the normal Home Assistant screens')}</p></div></div>`;
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
    // device layout (iPhone / iPad wall panel / laptop)
    out += `<div class="sec-h" style="margin-top:24px"><h2>Device Layout</h2></div><div class="card set" data-k="layoutset">
<div class="it"><span class="ic">${ic('smartphone')}</span><span class="lb"><b>Device Layout</b><span>${settings.lang === 'nl' ? 'Kies hoe de app eruitziet op dit apparaat' : 'Choose how the app looks on this device'}</span></span><select data-set="layout" aria-label="Device Layout">${[['auto', settings.lang === 'nl' ? 'Automatisch' : 'Automatic'], ['iphone', 'iPhone'], ['ipad', 'iPad'], ['laptop', 'Laptop']].filter((o) => o[0] !== 'ipad' || window.ComfortWall).map(([v, l]) => `<option value="${v}" ${(settings.layout || 'auto') === v ? 'selected' : ''}>${l}</option>`).join('')}</select></div>
${settings.layout === 'ipad' || (WALL && WALL.active()) ? `<div class="it"><span class="ic">${ic('home')}</span><span class="lb"><b>${settings.lang === 'nl' ? 'Startpagina iPad' : 'iPad start page'}</b></span><select data-set="wallStart" aria-label="Start page">${[['home', settings.lang === 'nl' ? 'Overzicht' : 'Overview'], ['lights', settings.lang === 'nl' ? 'Verlichting' : 'Lights'], ['climate', settings.lang === 'nl' ? 'Klimaat' : 'Climate'], ['devices', settings.lang === 'nl' ? 'Apparaten' : 'Devices'], ['sensors', settings.lang === 'nl' ? 'Sensoren' : 'Sensors'], ['autos', 'Automations']].map(([v, l]) => `<option value="${v}" ${(settings.wallStart || 'home') === v ? 'selected' : ''}>${l}</option>`).join('')}</select></div>` : ''}</div>`;
    if (EXTRA) out += EXTRA.decoSettingsHTML(effLayout());
    // air conditioners
    if (m.climates.length) {
      const sel = acList(m);
      out += `<div class="sec-h" style="margin-top:24px"><h2>${t('Air conditioners')}</h2><span class="aux">${sel.length}</span></div><div class="card set" data-k="acset">${m.climates.map((e) => { const on = sel.includes(e); return `<button class="it" data-act="ac-pick" data-eid="${esc(e)}" data-k="acp-${esc(e)}"><span class="ic">${ic(on ? 'snow' : 'flame')}</span><span class="lb"><b>${esc(nameOf(e))}</b><span>${esc(roomNameOf(e) || e)}</span></span><span class="chk${on ? ' on' : ''}">${on ? ic('ok') : ''}</span></button>`; }).join('')}
<div class="blk"><p class="meta-sm" style="margin:0">${t('Ticked = shown on the Climate page and controlled together. Heating is shown as a separate button.')}</p></div></div>`;
    }
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
  function openSheet(eid) { if (!S.states[eid] && !String(eid).startsWith('__')) return; S.sheet = eid; history.pushState({ sheet: 1 }, ''); schedule(true); }
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
      case 'ha-menu': openSheet('__ha'); break;
      case 'osc-install': { const c = oscCfgEnts(); S.oscForm = c ? { ac: c.ac, sensor: c.sensor, conn: c.conn || null } : oscFind(); openSheet('__osc'); break; }
      case 'osc-save': oscSave(); break;
      case 'osc-remove': oscRemove(); break;
      case 'osc-toggle': oscToggle(); break;
      case 'afilter': S.af = el.dataset.v; schedule(true); break;
      case 'aopen': S.aopen[eid] = !S.aopen[eid]; schedule(true); break;
      case 'ac-pick': { const cur = acList(model()); const i = cur.indexOf(eid); if (i >= 0) cur.splice(i, 1); else cur.push(eid); settings.acList = cur; saveSettings(); schedule(true); break; }
      case 'go-info': location.hash = '#/info/' + encodeURIComponent(eid); break;
      case 'grp-preset': grpSet(acList(model()), +el.dataset.v); break;
      case 'go-clim': location.hash = '#/climate/' + encodeURIComponent(eid); break;
      case 'back-to': if (window.__navCount > 0) history.back(); else location.hash = el.dataset.h; break;
      case 'grp-step': { const acs = acList(model()); const g = groupTarget(acs); if (g == null) break; grpSet(acs, g + 0.5 * +el.dataset.d); break; }
      case 'grp-power': { const acs = acList(model()); const on = acs.filter((x) => isOn(x, S.states[x])); (on.length ? on : acs.filter((x) => avail(S.states[x]))).forEach((x) => climatePower(x)); break; }
      case 'grp-mode': { const v = el.dataset.v; acList(model()).forEach((x) => { const s = S.states[x]; if (avail(s) && s.state !== v && (s.attributes.hvac_modes || []).includes(v)) command(x, 'climate', 'set_hvac_mode', { hvac_mode: v }, (ns) => ns.state === v); }); break; }
      case 'grp-fan': case 'grp-swing': { const attr = act.slice(4) + '_mode'; const v = el.dataset.v; acList(model()).forEach((x) => { const s = S.states[x]; if (avail(s) && s.attributes[attr] !== v && (s.attributes[attr + 's'] || []).includes(v)) command(x, 'climate', 'set_' + attr, { [attr]: v }, (ns) => ns.attributes[attr] === v); }); break; }
      case 'idom': S.idom = el.dataset.v || null; S.ishow = 150; schedule(true); break;
      case 'imore': S.ishow = (S.ishow || 150) + 300; schedule(true); break;
      case 'irange': S.irange = +el.dataset.v; schedule(true); if (S.route.id) loadIHist(S.route.id); break;
      case 'go-panel': try { sessionStorage.setItem('comfortLeave', '1'); } catch (x) { /* */ } location.href = '/' + el.dataset.p; break;
      case 'timer-new': openTimerEditor(null); break;
      case 'timer-open': openTimerEditor(eid); break;
      case 'auto-toggle': { const s = S.states[eid]; if (!s) break; const was = s.state === 'on'; command(eid, 'automation', was ? 'turn_off' : 'turn_on', null, (ns) => (ns.state === 'on') !== was); break; }
      case 'auto-run': command(eid, 'automation', 'trigger', null, null, { noState: true, okMsg: nameOf(eid) + ' ✓' }); break;
      case 'tf-verb': S.form.verb = el.dataset.v; schedule(true); break;
      case 'tf-day': { const d = el.dataset.v; const i = S.form.days.indexOf(d); if (i >= 0) S.form.days.splice(i, 1); else S.form.days.push(d); schedule(true); break; }
      case 'tf-days': S.form.days = el.dataset.v === 'all' ? DAYS.slice() : el.dataset.v === 'week' ? DAYS.slice(0, 5) : DAYS.slice(5); schedule(true); break;
      case 'tf-ent': { const i = S.form.ents.indexOf(eid); if (i >= 0) S.form.ents.splice(i, 1); else S.form.ents.push(eid); schedule(true); break; }
      case 'tf-save': saveTimer(); break;
      case 'tf-del': deleteTimer(); break;
      case 'open-ha': try { sessionStorage.setItem('comfortLeave', '1'); } catch (x) { /* */ } if (EMBED) location.href = '/'; else { const au = loadAuth(); if (au && au.url) window.open(au.url, '_blank'); } break;
      case 'all-lights-off': { const ids = model().controls.filter((x) => model().kind[x] === 'light' && isOn(x)); if (ids.length && canSend()) { svc('light', 'turn_off', { entity_id: ids }); toast(t('Lights off'), 'ok'); } break; }
      case 'room-lights': { const r = model().roomById[el.dataset.id]; if (!r || !canSend()) break; const ids = r.devs.filter((x) => model().kind[x] === 'light' && avail(S.states[x])); const anyOn = ids.some((x) => isOn(x)); if (ids.length) svc('light', anyOn ? 'turn_off' : 'turn_on', { entity_id: ids }); break; }
      case 'clim-main': settings.climate = eid; saveSettings(); S.climSel = eid; schedule(true); toast(nameOf(eid) + ' · ' + t('Main'), 'ok'); break;
      case 'clim-go': { const sl = document.querySelector(`.cslide[data-eid="${CSS.escape(eid)}"]`); if (sl) sl.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' }); break; }
      case 'light-hs': { const h = +el.dataset.h; if (el.dataset.white) command(eid, 'light', 'turn_on', S.states[eid].attributes.supported_color_modes.includes('color_temp') ? { color_temp_kelvin: 4000 } : { hs_color: [0, 0] }, (ns) => ns.state === 'on'); else command(eid, 'light', 'turn_on', { hs_color: [h, 100] }, (ns) => ns.state === 'on' && ns.attributes.hs_color && Math.abs(ns.attributes.hs_color[0] - h) < 8); break; }
      case 'light-mood': { const P = { relax: [2700, 55], read: [4000, 100], focus: [5500, 100], night: [2200, 8] }[el.dataset.v]; const sa = S.states[eid].attributes; const d = { brightness_pct: P[1] }; if ((sa.supported_color_modes || []).includes('color_temp')) d.color_temp_kelvin = P[0]; command(eid, 'light', 'turn_on', d, (ns) => ns.state === 'on'); break; }
      case 'light-fx': command(eid, 'light', 'turn_on', { effect: el.dataset.v }, (ns) => ns.attributes.effect === el.dataset.v || ns.state === 'on'); break;
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
    if (k === 'tf-q') { S.form.q = el.value; schedule(true); return; }
    if (k === 'asearch') { S.aq = el.value; schedule(true); return; }
    if (k === 'osc-ac' && S.oscForm) { S.oscForm.ac = el.value; const d = (S.ents[el.value] || {}).device_id; S.oscForm.conn = d ? Object.keys(S.ents).find((x) => S.ents[x].device_id === d && S.states[x] && /^sensor\./.test(x) && (S.states[x].attributes.options || []).includes('disconnected')) || null : null; schedule(true); return; }
    if (k === 'osc-sensor' && S.oscForm) { S.oscForm.sensor = el.value; schedule(true); return; }
    if (k === 'isearch') { S.iq = el.value; S.ishow = 150; schedule(true); return; }
    if (k === 'tf-time') { S.form.time = el.value; return; }
    if (el.type === 'range') {
      const p = ((el.value - el.min) / (el.max - el.min)) * 100; el.style.setProperty('--p', p.toFixed(1) + '%');
      const out = el.parentElement.querySelector(`[data-out="${k}"]`); const v = +el.value;
      if (out) out.textContent = k === 'ct' ? v + ' K' : k === 'pos' ? v + '% open' : v + '%';
      if (k === 'clim-range') setTarget(el.dataset.eid, v);
      if (k === 'grp-range') grpSet(acList(model()), v);
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
  let lastLay = null; window.addEventListener('resize', () => { const l = effLayout(); if (l !== lastLay) { lastLay = l; schedule(true); } });
  window.__navCount = 0; window.addEventListener('hashchange', () => { window.__navCount++; });

  /* ---------------- iPad wall panel (separate module wall.js) ---------------- */
  function makeWall() {
    if (!window.ComfortWall) return null;
    return window.ComfortWall({
      S, settings, t, ic, esc, model: () => model(), st, nameOf, roomNameOf, avail, isOn, stateText, devIcon, houseTemp, outsideTemp, acList,
      tColor, shortRoom, mainTemp, tempOf, roomHum, roomOfEid, HVAC, ACTION, pSettings, oscEnt, oscStatus, OSC, toast, svc, climatePower,
      schedule: (f) => schedule(f), isAC, isOutside, isJunkT, extra: () => EXTRA
    });
  }
  function makeExtra() {
    if (!window.ComfortExtra) return null;
    return window.ComfortExtra({ S, settings, ic, esc, st, api, pill, toast, VERSION, saveSettings, schedule: (f) => schedule(f) });
  }

  /* ---------------- boot ---------------- */
  EXTRA = makeExtra();
  WALL = makeWall();
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

  }
})();
