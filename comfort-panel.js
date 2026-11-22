/* Comfort Home 1.8.1 — runs on top of Home Assistant at /comfort-home. Does nothing on any other page. */
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
  link('apple-touch-icon', "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAALQAAAC0CAIAAACyr5FlAAAACXBIWXMAAAsTAAALEwEAmpwYAAANv0lEQVR4nO3d+XMT5xkH8Pw/CWkCSTlCYgjYxk0ITF3SZpp20k7IMJkmtGlnEhKwTSCAOUx8XyQcwfiAhLiGQhLCYeIYW7csaXWuJMuWZGklWza2JRlLHfkAa/VqpV3J3le7j+b7477PvjPvR7vvu4f0lHP8UWKGkQkkzRDLOGgZm2HIIMvYl2Y0dWxsYn0cf1ohWcbin7H4wmnGzDImil2eAhkgw4SSYUzEAccMOGaY5mTQcYAMkGFalBGHA2SADNMSGU9wgAyQYYqXsYADZIAMU4KMGA6QATJMKBlJcMD1DJFdzzCmiwNkgAwKiQNkgAwKeeQAGSCDQp5WQAbIoJBzDpABMijkhBRkgAwq2WoF7sLDqpVigwOez7CK6XoGMgYvCgfIABkGLwoHyAAZBi8KB8gAGQYvCgfIABkGLwoHyAAZBi8KB8gAGQYvCgfIABkGbzZwwPsmpBCvZ2QBB8ggxSSDBQ6QQYpMRro4QAYpPhlp4QAZpChlpMYBMkixykiBA2SQIpbBhANkkOKWkRQHyCBFL0OPxAEyQIbei8IBMkCGHokDZIAMPRIHyAAZeiQOkAEy9EgcIANk6JE4QAbI0KeFA34PVHxXuvRp4QAZIMOLxAEyQIYXeeQAGSDDizytgAyQ4U0254BfpIcZqJclDvivAovI1ib0eEJoHCDDInoZBBIHyAAZhAeFA2SADAKJA2SADAKJA2SADAKJA2SADAKJA2RYfGGTN1zRTR2+5TF6QyJctRKoPAUyLL6wyjn94XeuoiZbUZPt/W+dsuEgyGCNQ5D/ynnL+PBPFwaLmqyPs+v84A3DhJiPGayPHIKUcUEy+nqzrajRSstrzbb6Hp+YZbDAITwZBk/o0I8j2xpJhhy46SY8IXHKSBeH8GTIh4J7Lg8xy9g2l3c7HH2D0yKUkRYO4cn4QT+x65y9sIFMM78/a79OjItNRmocwpNxXuL/XRNZ2GBhlaImsq6HEpWMFDgEJkPvDZXecBfUWzjn0+su3dwURAwymHAITIbUMb27zZGJjIK5/L11sNc+JQYZSXEITMZN/XjxV9aCOnNWsvMM2akJCF6GDolDSDLMvnDdL1RhvTm/LpspqDOfuO0xeoUsA4FDSDJ0I8FP/uvMrzUvUz66Oqx2BYUqg45DSDIe2Kf+etG2tda0rPnzBdt9clKQMuJwCElG50DgjSbL1hrTCuT1BstlZUB4Mp7gEIyM2CTjvje/diVYbF1Mfo3p+M8LUxDByFjAIRgZWnfwP1eHtlQbeck/rwwpnUHByIjhEIyMHuvk2+etfMnYMpe3zpJ3zZPCkBGPI5dlfKcKvNZgfrXayHuK6s2t8jEByFiCI2dlmH3h2m7PlmrDq1W4ZEuVofzWiN6b2zIWceSsDLVz+oPLjs1VBgyzp21QNjyduzLmcOSsjLvmh7u+tmyuNGCb4jPmn4wTOSojLRx4ymiVjW6rNW6u1GOegmrDuX5fLspIjQNDGSYqXH7LvelLfQ7lwDWnbiSUWzJ0I4w4MJShGp5+v93O+2BvYp/dl2wSx1QOyWDCgaGMO8aJ4mZT3mkiR7Oj0XiTGM8VGUlxYCjjosSfX6XnfYDzMsuWSv1XvVROyNAiceAmw+QNlf/kzqsgBJMDXcNadwhzGQgcuMlQDk/vbrG+UqETWP72Ddk/OIWzDDoO3GT02iZ3NBiWe5yKavS7W8h9nY6y60Nl14f2dTp2t5BFNfrl3u8bDYb75CS2MuJw4CYjdsdEOfryKd1yJK9C92GH7arSb/MFo6hPJBq1UsGrSv/ey/a8imXpw8undJcVo9jKeIIDQxmLOLTZTX4VUXXH5QqEo2l/XIFw5R1XfiWR9c50pI9jxWUs4MBTxjyOjSe1WUxpl8MzzoLF0o9nPFzS5chuf9LFwYeMGA5sZWQXR2E18bM+EM34c4sIFFYRK4qDJxnscKz8+ybfKf0bT2gyzx8aDcnmFhw+NipY3GjISsc6FH5sZbDAwct7rd8q/S+d0GSYN5uNnomkp5JBf6hdSpV2Od79xrKrybiryfjuN5bSLkeHjHL4Q8laeSbCbzYbM+9bOzMOXmWki4OvX1aJ4TiuySTba/XDo+gx7jaO72khmZvvaSG7TePI5g5/6PUafYbdY8LBt4y0cPAlYx7HhuMDnLPxhEY++DBxXJ1joX+0kenX+bDdilzdSO0PN57g3r0NxweS4sBARmocPMqI4VD4N5QPcE7DPXfiiEpsEwVf6tiWKqzUSW0IZ3V33Zn0sF3ux1ZGChz8ysgQR3GDITgzSxvLXy3jeSc13ArmndT0WuinmKnw7M46fTZxYCODCQfvMuZxrC9Xc8sNzShtII0j05srNJwLri9Xv1qhMXmmaWWvqbl3ko4DJxlJceAgYwHHMTWH7KwjZmYjS4cwNBP5Y5OBW7X1S/JWsyH8KK5y+FFkRy3BrVocDsxkaJA4MJFh8YWvKPzrjqk55MwvI7Tv99c9I9xKrUvI+V4PrXhTt5tbqbbHOPCTgcCBjwyLL3xZ4Vt3VMUh9vhLXpOh2fzTGm6l1iWk8EvNVDhuNkN6p7mVapP7sJVBx4GVDPMcjrVHVWyzo46gfbM7lVzqrE2ea2o/bRfba3Qc6sRw4CojDgduMmI45L61R1RsU9Jpp43c3jYyZav8GuU7V+TvXJHnVytSbvzvDittF/u/t3PoapvUh62MJzgwlLGIQ8k2Z3viJhyzkejmk2rmJu91yhoH+5odsTTY+3Z3ypi333JqIG5SGo1+9YubQ1fZ4lhJGQs48JQxj+O3XyjZ5of4RaxrLMS8ffE5+TyLx2ly9BWflTO3Gom/9f+/AT+HrrLCscIyYjiwlcEZR4857tb8wNAk8/YlfRIajmZHX8kDCXMrzfDk0r3cNwWWFcfKy1iCAz8Z8zhePKxgmz4y7jqmzD7BvP0xVX8ijmOqfuZWcvvE0r08IMc5dDVNHLzIWMSBpQzOOLqNcUcOnXOSefuPuxFHjo/vSZhbEa6ppXu5axhbJhx8yZjDgasMzji6VL6lw+Z/OMO8fX61vMEWJ6Pe2re1Ss7camxqZuleOhXUcuDgUUa6OHiRYfaFO+S+Fw7J2ab+jpO2ztx2eoC5yfYm2UntwsnllLZ/e5OMefvXKjW0XdTcHubQ1VZGHPzKSAsHXzI44/hXm4U2cvuvWlO2evGwfGtVLC8eTr2Lsk4bbRd7W83ZxcG7DI07FQ4eZcRwyHxrPpezzebjqvibbtFu4xiHOmuSp8cUN62ZjUTyylUc6rRKfNjKSIGDXxlzOKg1n8s4RDEYt5SYjUR21mi4lVqTkOI6LQ2fxDrOrVSrhMJWBhMO3mXM41h9UMYhR64P0g77P2r93EqtTsgtHf1JkUNddm6lEnHgIyMpDhxkZIJj41FlYPpR4rQgcxkftZlpZcemZl46osgKDqxkDCBxYCJjAUeZlFua79HXLKOTMzuqBjgXXF0m3Vk1EIhfwcYeI709zLngUhy4yUDgwEeG2Rdul1HPl0m55aUjcneA/lLCkD+4qVzJreCmcuWQn/5mlGsstP4LOedOXlrEgaEMOg6sZJiocLuUer5Uyjl7L5kitJun0ejZ+y5u1c4kHIoikegHF02Z9PBSP4WtjDgcuMmYx/FcqSSTtPTS3064TYxyK3VzIO7CazQavfCrO8PuXeqnsJXxBAeGMrKCY81B6X3j2NIRPfXDILdSR67FPUN0zzC65qA0U7tp4uBDxgIOPGXM4fA+V9KfYdYdkv6o8UUisad+uhTeFw5KuNVZXSbp6B95NBuZjUSvq6h1h6SZ962l34utjBgObGXM4/hNSX9W8sox+ctH5ZnXWXtIuuELWbZ6lRoHfzJY41hJGQs4DvQLOC3MOHiVwQ7HCsuYx/HsgT4Bp4UBB98yWOBYeRkxHBLvs/v7BJyWPi+2MtLFwYsMExVuk3hX7e8TcC4iceAhIy0cfMlYwPHZAwHnYiIObGSkxsGjDBMV/lbu4338Vi1nOmQ+bGWkwMGvDBMVvmeeeObTBwLOHdM4tjKYcPAuYz4Fx+XPfNoryBScUOAsIykOTGSYqHDDXdfT+3oFmfp7TpxlqJE48JFhmvtrtPfO6XkfyKeznffO6bUjWMtA4MBKxvyfKuo9oU+uWFZ91vv0vl8FkFWf9e67YtG4g5jLoOPAUMbj3DGOl35v/Uuj7o3TysRsz4W83agt+d76kz6A+dkEgQNnGcL4928dxqvWRBlPcIAMkKFG4gAZIEONxAEyQIY6KQ6YZ8A8w50ZDpiBEiKYgXLBATII8clQu4KpcYAMQpQyUuMAGYRYZaTAATIIEctgwgEyCHHLSIoDZBCil6FC4gAZIEPlQuEAGSBDhcQBMkCGCokDZIAMFRIHyAAZKiQOkAEyVEgcIANkqLKCA57204lGBjscIEMnJhkscIAMnchkpIsDZOjEJyMtHCBDJ0oZqXGADJ1YZaTAATJ0IpbBhANk6MQtIykOkKETvQwlEgfIABlKFwoHyAAZSiQOkAEylEgcIANkKJE4QAbIUCJxgAyQoUTiABkgQ5kVHPBrTFrRyGCHA2RoxSRD6UwbB8jQikxGujhAhlZ8MtLCATK0opSRGgfI0IpVRgocIEMrYhlMOECGVtwykuIAGVrRy1AgcYAMkKFwonCADJChQOIAGSBDgcQBMkCGAokDZIAMBRIHyAAZigQZCmfw/7a3pf7nPKrXAAAAAElFTkSuQmCC", '180x180'); link('icon', "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAALQAAAC0CAIAAACyr5FlAAAACXBIWXMAAAsTAAALEwEAmpwYAAANv0lEQVR4nO3d+XMT5xkH8Pw/CWkCSTlCYgjYxk0ITF3SZpp20k7IMJkmtGlnEhKwTSCAOUx8XyQcwfiAhLiGQhLCYeIYW7csaXWuJMuWZGklWza2JRlLHfkAa/VqpV3J3le7j+b7477PvjPvR7vvu4f0lHP8UWKGkQkkzRDLOGgZm2HIIMvYl2Y0dWxsYn0cf1ohWcbin7H4wmnGzDImil2eAhkgw4SSYUzEAccMOGaY5mTQcYAMkGFalBGHA2SADNMSGU9wgAyQYYqXsYADZIAMU4KMGA6QATJMKBlJcMD1DJFdzzCmiwNkgAwKiQNkgAwKeeQAGSCDQp5WQAbIoJBzDpABMijkhBRkgAwq2WoF7sLDqpVigwOez7CK6XoGMgYvCgfIABkGLwoHyAAZBi8KB8gAGQYvCgfIABkGLwoHyAAZBi8KB8gAGQYvCgfIABkGbzZwwPsmpBCvZ2QBB8ggxSSDBQ6QQYpMRro4QAYpPhlp4QAZpChlpMYBMkixykiBA2SQIpbBhANkkOKWkRQHyCBFL0OPxAEyQIbei8IBMkCGHokDZIAMPRIHyAAZeiQOkAEy9EgcIANk6JE4QAbI0KeFA34PVHxXuvRp4QAZIMOLxAEyQIYXeeQAGSDDizytgAyQ4U0254BfpIcZqJclDvivAovI1ib0eEJoHCDDInoZBBIHyAAZhAeFA2SADAKJA2SADAKJA2SADAKJA2SADAKJA2RYfGGTN1zRTR2+5TF6QyJctRKoPAUyLL6wyjn94XeuoiZbUZPt/W+dsuEgyGCNQ5D/ynnL+PBPFwaLmqyPs+v84A3DhJiPGayPHIKUcUEy+nqzrajRSstrzbb6Hp+YZbDAITwZBk/o0I8j2xpJhhy46SY8IXHKSBeH8GTIh4J7Lg8xy9g2l3c7HH2D0yKUkRYO4cn4QT+x65y9sIFMM78/a79OjItNRmocwpNxXuL/XRNZ2GBhlaImsq6HEpWMFDgEJkPvDZXecBfUWzjn0+su3dwURAwymHAITIbUMb27zZGJjIK5/L11sNc+JQYZSXEITMZN/XjxV9aCOnNWsvMM2akJCF6GDolDSDLMvnDdL1RhvTm/LpspqDOfuO0xeoUsA4FDSDJ0I8FP/uvMrzUvUz66Oqx2BYUqg45DSDIe2Kf+etG2tda0rPnzBdt9clKQMuJwCElG50DgjSbL1hrTCuT1BstlZUB4Mp7gEIyM2CTjvje/diVYbF1Mfo3p+M8LUxDByFjAIRgZWnfwP1eHtlQbeck/rwwpnUHByIjhEIyMHuvk2+etfMnYMpe3zpJ3zZPCkBGPI5dlfKcKvNZgfrXayHuK6s2t8jEByFiCI2dlmH3h2m7PlmrDq1W4ZEuVofzWiN6b2zIWceSsDLVz+oPLjs1VBgyzp21QNjyduzLmcOSsjLvmh7u+tmyuNGCb4jPmn4wTOSojLRx4ymiVjW6rNW6u1GOegmrDuX5fLspIjQNDGSYqXH7LvelLfQ7lwDWnbiSUWzJ0I4w4MJShGp5+v93O+2BvYp/dl2wSx1QOyWDCgaGMO8aJ4mZT3mkiR7Oj0XiTGM8VGUlxYCjjosSfX6XnfYDzMsuWSv1XvVROyNAiceAmw+QNlf/kzqsgBJMDXcNadwhzGQgcuMlQDk/vbrG+UqETWP72Ddk/OIWzDDoO3GT02iZ3NBiWe5yKavS7W8h9nY6y60Nl14f2dTp2t5BFNfrl3u8bDYb75CS2MuJw4CYjdsdEOfryKd1yJK9C92GH7arSb/MFo6hPJBq1UsGrSv/ey/a8imXpw8undJcVo9jKeIIDQxmLOLTZTX4VUXXH5QqEo2l/XIFw5R1XfiWR9c50pI9jxWUs4MBTxjyOjSe1WUxpl8MzzoLF0o9nPFzS5chuf9LFwYeMGA5sZWQXR2E18bM+EM34c4sIFFYRK4qDJxnscKz8+ybfKf0bT2gyzx8aDcnmFhw+NipY3GjISsc6FH5sZbDAwct7rd8q/S+d0GSYN5uNnomkp5JBf6hdSpV2Od79xrKrybiryfjuN5bSLkeHjHL4Q8laeSbCbzYbM+9bOzMOXmWki4OvX1aJ4TiuySTba/XDo+gx7jaO72khmZvvaSG7TePI5g5/6PUafYbdY8LBt4y0cPAlYx7HhuMDnLPxhEY++DBxXJ1joX+0kenX+bDdilzdSO0PN57g3r0NxweS4sBARmocPMqI4VD4N5QPcE7DPXfiiEpsEwVf6tiWKqzUSW0IZ3V33Zn0sF3ux1ZGChz8ysgQR3GDITgzSxvLXy3jeSc13ArmndT0WuinmKnw7M46fTZxYCODCQfvMuZxrC9Xc8sNzShtII0j05srNJwLri9Xv1qhMXmmaWWvqbl3ko4DJxlJceAgYwHHMTWH7KwjZmYjS4cwNBP5Y5OBW7X1S/JWsyH8KK5y+FFkRy3BrVocDsxkaJA4MJFh8YWvKPzrjqk55MwvI7Tv99c9I9xKrUvI+V4PrXhTt5tbqbbHOPCTgcCBjwyLL3xZ4Vt3VMUh9vhLXpOh2fzTGm6l1iWk8EvNVDhuNkN6p7mVapP7sJVBx4GVDPMcjrVHVWyzo46gfbM7lVzqrE2ea2o/bRfba3Qc6sRw4CojDgduMmI45L61R1RsU9Jpp43c3jYyZav8GuU7V+TvXJHnVytSbvzvDittF/u/t3PoapvUh62MJzgwlLGIQ8k2Z3viJhyzkejmk2rmJu91yhoH+5odsTTY+3Z3ypi333JqIG5SGo1+9YubQ1fZ4lhJGQs48JQxj+O3XyjZ5of4RaxrLMS8ffE5+TyLx2ly9BWflTO3Gom/9f+/AT+HrrLCscIyYjiwlcEZR4857tb8wNAk8/YlfRIajmZHX8kDCXMrzfDk0r3cNwWWFcfKy1iCAz8Z8zhePKxgmz4y7jqmzD7BvP0xVX8ijmOqfuZWcvvE0r08IMc5dDVNHLzIWMSBpQzOOLqNcUcOnXOSefuPuxFHjo/vSZhbEa6ppXu5axhbJhx8yZjDgasMzji6VL6lw+Z/OMO8fX61vMEWJ6Pe2re1Ss7camxqZuleOhXUcuDgUUa6OHiRYfaFO+S+Fw7J2ab+jpO2ztx2eoC5yfYm2UntwsnllLZ/e5OMefvXKjW0XdTcHubQ1VZGHPzKSAsHXzI44/hXm4U2cvuvWlO2evGwfGtVLC8eTr2Lsk4bbRd7W83ZxcG7DI07FQ4eZcRwyHxrPpezzebjqvibbtFu4xiHOmuSp8cUN62ZjUTyylUc6rRKfNjKSIGDXxlzOKg1n8s4RDEYt5SYjUR21mi4lVqTkOI6LQ2fxDrOrVSrhMJWBhMO3mXM41h9UMYhR64P0g77P2r93EqtTsgtHf1JkUNddm6lEnHgIyMpDhxkZIJj41FlYPpR4rQgcxkftZlpZcemZl46osgKDqxkDCBxYCJjAUeZlFua79HXLKOTMzuqBjgXXF0m3Vk1EIhfwcYeI709zLngUhy4yUDgwEeG2Rdul1HPl0m55aUjcneA/lLCkD+4qVzJreCmcuWQn/5mlGsstP4LOedOXlrEgaEMOg6sZJiocLuUer5Uyjl7L5kitJun0ejZ+y5u1c4kHIoikegHF02Z9PBSP4WtjDgcuMmYx/FcqSSTtPTS3064TYxyK3VzIO7CazQavfCrO8PuXeqnsJXxBAeGMrKCY81B6X3j2NIRPfXDILdSR67FPUN0zzC65qA0U7tp4uBDxgIOPGXM4fA+V9KfYdYdkv6o8UUisad+uhTeFw5KuNVZXSbp6B95NBuZjUSvq6h1h6SZ962l34utjBgObGXM4/hNSX9W8sox+ctH5ZnXWXtIuuELWbZ6lRoHfzJY41hJGQs4DvQLOC3MOHiVwQ7HCsuYx/HsgT4Bp4UBB98yWOBYeRkxHBLvs/v7BJyWPi+2MtLFwYsMExVuk3hX7e8TcC4iceAhIy0cfMlYwPHZAwHnYiIObGSkxsGjDBMV/lbu4338Vi1nOmQ+bGWkwMGvDBMVvmeeeObTBwLOHdM4tjKYcPAuYz4Fx+XPfNoryBScUOAsIykOTGSYqHDDXdfT+3oFmfp7TpxlqJE48JFhmvtrtPfO6XkfyKeznffO6bUjWMtA4MBKxvyfKuo9oU+uWFZ91vv0vl8FkFWf9e67YtG4g5jLoOPAUMbj3DGOl35v/Uuj7o3TysRsz4W83agt+d76kz6A+dkEgQNnGcL4928dxqvWRBlPcIAMkKFG4gAZIEONxAEyQIY6KQ6YZ8A8w50ZDpiBEiKYgXLBATII8clQu4KpcYAMQpQyUuMAGYRYZaTAATIIEctgwgEyCHHLSIoDZBCil6FC4gAZIEPlQuEAGSBDhcQBMkCGCokDZIAMFRIHyAAZKiQOkAEyVEgcIANkqLKCA57204lGBjscIEMnJhkscIAMnchkpIsDZOjEJyMtHCBDJ0oZqXGADJ1YZaTAATJ0IpbBhANk6MQtIykOkKETvQwlEgfIABlKFwoHyAAZSiQOkAEylEgcIANkKJE4QAbIUCJxgAyQoUTiABkgQ5kVHPBrTFrRyGCHA2RoxSRD6UwbB8jQikxGujhAhlZ8MtLCATK0opSRGgfI0IpVRgocIEMrYhlMOECGVtwykuIAGVrRy1AgcYAMkKFwonCADJChQOIAGSBDgcQBMkCGAokDZIAMBRIHyAAZigQZCmfw/7a3pf7nPKrXAAAAAElFTkSuQmCC");
  function keepTitle() { if (document.title !== 'Comfort') document.title = 'Comfort'; }
  keepTitle(); new MutationObserver(keepTitle).observe(head, { childList: true, subtree: true, characterData: true });
  var st = document.createElement('style'); st.textContent = "/* Comfort Home — design system\n   Inspired by the calm, pastel, card-based look of Panasonic Comfort Cloud. Original branding. */\n:root{\n  --bg:#f2f4f7; --bg2:#e9eef4; --card:#ffffff; --card2:#f7f9fb; --text:#1d2733; --text2:#4a5868; --muted:#8a96a3; --line:#e4e9ef;\n  --accent:#2f86d6; --accent-ink:#ffffff; --accent-soft:#e2effb; --accent-2:#5aa7ea;\n  --ok:#2fa57d; --warn:#e48a3c; --bad:#d9534f;\n  --blue:#e4f0fb; --blue-i:#2f7fc8; --mint:#e1f4ec; --mint-i:#2b9a74; --warm:#fdeedf; --warm-i:#d27a32;\n  --lav:#ece9f8; --lav-i:#6c5fc7; --rose:#fbe8ec; --rose-i:#c8556c; --sand:#faf3dc; --sand-i:#b08a1e;\n  --hero1:#dcecfb; --hero2:#eef6fd; --hero-ink:#173a5e;\n  --shadow:0 1px 2px rgba(20,40,70,.04),0 4px 14px rgba(20,40,70,.06);\n  --shadow-lg:0 10px 40px rgba(20,40,70,.16);\n  --r:20px; --r-sm:14px; --gap:12px; --pad:18px;\n  --nav-h:68px; --safe-b:env(safe-area-inset-bottom,0px); --safe-t:env(safe-area-inset-top,0px); --safe-l:env(safe-area-inset-left,0px); --safe-r:env(safe-area-inset-right,0px);\n  --tog-off:#d5dde6; --scrim:rgba(18,28,40,.32);\n  color-scheme:light;\n}\nhtml[data-theme=\"dark\"]{\n  --bg:#15181d; --bg2:#1b1f25; --card:#1f242b; --card2:#252b33; --text:#e7ebf0; --text2:#b8c1cc; --muted:#8792a0; --line:#2c333c;\n  --accent:#6aa9e6; --accent-ink:#0f1a26; --accent-soft:#22344a; --accent-2:#87bcef;\n  --ok:#5cc39d; --warn:#e8a364; --bad:#e57873;\n  --blue:#1f2d3c; --blue-i:#86b9ea; --mint:#1c2f2a; --mint-i:#7fcfae; --warm:#33281f; --warm-i:#e7ae7c;\n  --lav:#27253a; --lav-i:#aea5ea; --rose:#33232a; --rose-i:#e59aaa; --sand:#2f2b1d; --sand-i:#d6bd70;\n  --hero1:#1d2a39; --hero2:#1a2029; --hero-ink:#dbe8f5;\n  --shadow:0 1px 2px rgba(0,0,0,.2),0 4px 14px rgba(0,0,0,.18);\n  --shadow-lg:0 10px 40px rgba(0,0,0,.5);\n  --tog-off:#3a424d; --scrim:rgba(0,0,0,.5);\n  color-scheme:dark;\n}\n*{box-sizing:border-box;-webkit-tap-highlight-color:transparent}\nhtml,body{margin:0;background:var(--bg);color:var(--text)}\nhtml{transition:background-color .4s;-webkit-text-size-adjust:100%;text-size-adjust:100%}\nbody{font-family:system-ui,-apple-system,\"Segoe UI\",Roboto,\"Helvetica Neue\",Arial,sans-serif;font-size:15px;line-height:1.35;\n  -webkit-font-smoothing:antialiased;text-rendering:optimizeLegibility;overscroll-behavior-y:none;min-height:100vh;min-height:100dvh}\nbutton,input,select{font:inherit;color:inherit}\nbutton{background:none;border:0;padding:0;cursor:pointer;touch-action:manipulation}\nbutton,a,.tile,.room,.chip,nav.bn{-webkit-user-select:none;user-select:none;-webkit-touch-callout:none}\na,button,input,select,label{touch-action:manipulation}\nbutton:focus-visible,input:focus-visible,select:focus-visible,a:focus-visible{outline:2px solid var(--accent);outline-offset:2px}\n.i{width:1em;height:1em;flex:none;fill:none;stroke:currentColor;stroke-width:2;stroke-linecap:round;stroke-linejoin:round}\n.num{font-variant-numeric:tabular-nums;font-feature-settings:\"tnum\"}\n\n#app{max-width:560px;margin:0 auto;min-height:100vh;min-height:100dvh;position:relative}\n#view{padding:calc(var(--safe-t) + 10px) calc(var(--pad) + var(--safe-r)) calc(var(--nav-h) + var(--safe-b) + 24px) calc(var(--pad) + var(--safe-l))}\n.page{animation:pageIn .2s cubic-bezier(.2,.7,.3,1)}\n@keyframes pageIn{from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:none}}\n.page.sub{animation-name:subIn}\n@keyframes subIn{from{opacity:0;transform:translateX(18px)}to{opacity:1;transform:none}}\n\n/* top bar */\n.topbar{display:flex;align-items:center;gap:10px;min-height:52px;margin-bottom:6px}\n.topbar h1{font-size:24px;font-weight:650;letter-spacing:-.01em;margin:0;flex:1}\n.topbar .sub{color:var(--muted);font-size:13px;font-weight:500}\n.iconbtn{width:44px;height:44px;border-radius:50%;display:grid;place-items:center;font-size:20px;color:var(--text2);background:var(--card);box-shadow:var(--shadow);flex:none}\n.iconbtn:active{transform:scale(.94)}\n\n/* connection pill */\n.pill{display:inline-flex;align-items:center;gap:6px;font-size:12px;font-weight:600;padding:5px 10px;border-radius:999px;background:var(--card);color:var(--text2);box-shadow:var(--shadow);white-space:nowrap}\n.pill .dot{width:7px;height:7px;border-radius:50%;background:var(--muted)}\n.pill.connected .dot{background:var(--ok)}\n.pill.connecting .dot,.pill.reconnecting .dot{background:var(--warn);animation:blink 1s infinite}\n.pill.error .dot,.pill.disconnected .dot,.pill.auth_invalid .dot{background:var(--bad)}\n.pill.demo{background:var(--lav);color:var(--lav-i)} .pill.demo .dot{background:var(--lav-i)}\n@keyframes blink{50%{opacity:.3}}\n\n/* sections */\n.sec{margin-top:24px}\n.sec-h{display:flex;align-items:baseline;justify-content:space-between;margin:0 2px 10px}\n.sec-h h2{font-size:16px;font-weight:650;margin:0;letter-spacing:-.005em}\n.sec-h .aux{font-size:13px;color:var(--muted);font-weight:500}\n.sec-h a,.sec-h button.link{font-size:13px;color:var(--accent);font-weight:600;text-decoration:none;padding:6px 0 6px 10px}\n.card{background:var(--card);border-radius:var(--r);box-shadow:var(--shadow)}\n.hint{font-size:13px;color:var(--muted);margin:10px 2px 0}\n\n/* hero */\n.hero{border-radius:24px;padding:20px 20px 18px;background:linear-gradient(160deg,var(--hero1),var(--hero2));color:var(--hero-ink);position:relative;overflow:hidden}\n.hero::after{content:\"\";position:absolute;right:-60px;top:-60px;width:200px;height:200px;border-radius:50%;background:radial-gradient(closest-side,rgba(255,255,255,.55),rgba(255,255,255,0));pointer-events:none}\nhtml[data-theme=\"dark\"] .hero::after{background:radial-gradient(closest-side,rgba(120,170,230,.12),rgba(0,0,0,0))}\n.hero-top{display:flex;justify-content:space-between;align-items:flex-start;gap:10px}\n.greet{font-size:22px;font-weight:650;letter-spacing:-.01em;margin:0}\n.when{font-size:13px;opacity:.75;margin-top:3px;font-weight:500}\n.hero-temp{display:flex;align-items:flex-end;gap:14px;margin-top:18px}\n.bigt{font-weight:250;font-size:76px;line-height:.9;letter-spacing:-.04em}\n.bigt small{font-size:34px;font-weight:300;letter-spacing:-.02em}\n.hero-meta{padding-bottom:6px;font-size:13px;line-height:1.5}\n.hero-meta b{font-weight:650;display:block;font-size:14px}\n.hero-meta span{opacity:.75}\n.status-row{display:flex;flex-wrap:wrap;gap:8px;margin-top:16px}\n.stat{display:inline-flex;align-items:center;gap:6px;font-size:12.5px;font-weight:600;background:rgba(255,255,255,.6);padding:7px 11px;border-radius:999px}\nhtml[data-theme=\"dark\"] .stat{background:rgba(255,255,255,.06)}\n.stat .i{font-size:14px}\n.stat.warn{color:var(--warn)} .stat.bad{color:var(--bad)}\n\n/* room temp cards */\n.rooms-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(148px,1fr));gap:var(--gap)}\n.room{border-radius:var(--r);padding:15px 15px 14px;text-align:left;display:flex;flex-direction:column;gap:2px;min-height:128px;position:relative;transition:transform .15s}\n.room:active{transform:scale(.97)}\n.room .ri{width:34px;height:34px;border-radius:11px;display:grid;place-items:center;font-size:18px;background:rgba(255,255,255,.7);margin-bottom:8px}\nhtml[data-theme=\"dark\"] .room .ri{background:rgba(255,255,255,.07)}\n.room .rn{font-size:14px;font-weight:600;color:var(--text);white-space:nowrap;overflow:hidden;text-overflow:ellipsis;padding-right:26px}\n.room .rt{font-size:30px;font-weight:300;letter-spacing:-.03em;line-height:1.1;color:var(--text)}\n.room .rt small{font-size:17px}\n.room .rh{font-size:12.5px;color:var(--text2);display:flex;align-items:center;gap:4px;font-weight:500}\n.room .trend{position:absolute;top:14px;right:14px;font-size:15px;opacity:.85}\n.room.na .rt{color:var(--muted)}\n.c-blue{background:var(--blue)} .c-blue .ri,.c-blue .trend{color:var(--blue-i)}\n.c-mint{background:var(--mint)} .c-mint .ri,.c-mint .trend{color:var(--mint-i)}\n.c-warm{background:var(--warm)} .c-warm .ri,.c-warm .trend{color:var(--warm-i)}\n.c-lav{background:var(--lav)} .c-lav .ri,.c-lav .trend{color:var(--lav-i)}\n.c-rose{background:var(--rose)} .c-rose .ri,.c-rose .trend{color:var(--rose-i)}\n.c-sand{background:var(--sand)} .c-sand .ri,.c-sand .trend{color:var(--sand-i)}\n\n/* device tiles */\n.tiles{display:grid;grid-template-columns:repeat(auto-fill,minmax(150px,1fr));gap:10px}\n.tile{background:var(--card);border-radius:18px;box-shadow:var(--shadow);padding:12px 12px 12px 14px;display:flex;flex-direction:column;gap:10px;min-height:104px;position:relative;text-align:left;transition:background-color .25s,transform .15s}\n.tile:active{transform:scale(.98)}\n.tile .top{display:flex;align-items:center;justify-content:space-between;gap:6px}\n.dico{width:38px;height:38px;border-radius:12px;display:grid;place-items:center;font-size:19px;background:var(--card2);color:var(--muted);transition:background-color .25s,color .25s;flex:none}\n.tile .tn{font-size:14px;font-weight:600;line-height:1.25;display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;overflow:hidden}\n.tile .ts{font-size:12px;color:var(--muted);font-weight:500;margin-top:2px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}\n.tile.on .dico{background:var(--accent-soft);color:var(--accent)}\n.tile.on .ts{color:var(--accent)}\n.tile.on.k-light .dico{background:var(--sand);color:var(--sand-i)} .tile.on.k-light .ts{color:var(--sand-i)}\n.tile.on.k-plug .dico,.tile.on.k-switch .dico{background:var(--mint);color:var(--mint-i)} .tile.on.k-plug .ts,.tile.on.k-switch .ts{color:var(--mint-i)}\n.tile.on.k-cover .dico{background:var(--lav);color:var(--lav-i)} .tile.on.k-cover .ts{color:var(--lav-i)}\n.tile.on.k-climate .dico{background:var(--blue);color:var(--blue-i)}\n.tile.na{opacity:.6}\n.tile .tbody{display:block;width:100%;text-align:left}\n\n/* toggle */\n.tg{position:relative;width:48px;height:28px;border-radius:999px;background:var(--tog-off);transition:background-color .22s;flex:none}\n.tg::before{content:\"\";position:absolute;inset:-9px -4px}  /* bigger hit area */\n.tg .kn{position:absolute;top:3px;left:3px;width:22px;height:22px;border-radius:50%;background:#fff;box-shadow:0 1px 3px rgba(0,0,0,.25);transition:transform .22s cubic-bezier(.3,.7,.4,1)}\n.tg[aria-checked=\"true\"]{background:var(--accent)}\n.tg[aria-checked=\"true\"] .kn{transform:translateX(20px)}\n.tg.pending .kn{transform:translateX(10px);animation:pulse .8s infinite alternate}\n.tg.pending{background:var(--accent-2)}\n.tg:disabled{opacity:.45}\n@keyframes pulse{to{box-shadow:0 0 0 5px rgba(47,134,214,.18)}}\n.runbtn{height:32px;padding:0 14px;border-radius:999px;background:var(--accent-soft);color:var(--accent);font-weight:650;font-size:13px}\n.runbtn.pending{opacity:.6}\n\n/* chips */\n.chips{display:flex;gap:8px;overflow-x:auto;scrollbar-width:none;margin:0 calc(-1*var(--pad));padding:2px var(--pad) 4px;scroll-snap-type:x proximity}\n.chips::-webkit-scrollbar{display:none}\n.chip{display:inline-flex;align-items:center;gap:7px;white-space:nowrap;height:40px;padding:0 14px 0 10px;border-radius:999px;background:var(--card);box-shadow:var(--shadow);font-size:13.5px;font-weight:600;scroll-snap-align:start;flex:none}\n.chip .i{font-size:16px;color:var(--accent)}\n.chip.on-light .i{color:var(--sand-i)}\n.chip.sel{background:var(--accent);color:var(--accent-ink)} .chip.sel .i{color:inherit}\n.chip .cnt{font-size:12px;opacity:.6;font-weight:600}\n.empty{padding:16px;border-radius:var(--r);background:var(--card);box-shadow:var(--shadow);color:var(--muted);font-size:14px;display:flex;align-items:center;gap:10px}\n.empty .i{font-size:20px}\n\n/* list rows */\n.list{display:flex;flex-direction:column;gap:10px}\n.row{display:flex;align-items:center;gap:12px;background:var(--card);border-radius:18px;box-shadow:var(--shadow);padding:12px 14px;min-height:64px;text-align:left;width:100%}\n.row .rb{flex:1;min-width:0;display:block;text-align:left}\n.row .rn{font-weight:600;font-size:15px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}\n.row .rs{font-size:12.5px;color:var(--muted);font-weight:500;margin-top:2px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}\n.row.on .dico{background:var(--accent-soft);color:var(--accent)}\n.row.on.k-light .dico{background:var(--sand);color:var(--sand-i)}\n.row.on.k-plug .dico,.row.on.k-switch .dico{background:var(--mint);color:var(--mint-i)}\n.row.on.k-cover .dico{background:var(--lav);color:var(--lav-i)}\n.row.na{opacity:.6}\n.star{width:40px;height:40px;display:grid;place-items:center;font-size:18px;color:var(--muted);flex:none;border-radius:50%}\n.star.fav{color:#e9a82b} .star.fav .i{fill:#e9a82b}\n.rvalue{font-size:16px;font-weight:600;white-space:nowrap}\n\n/* rooms list */\n.roomrow{display:flex;align-items:center;gap:14px;padding:14px 14px 14px 14px;border-radius:var(--r);text-align:left;width:100%;transition:transform .15s}\n.roomrow:active{transform:scale(.985)}\n.roomrow .ri{width:46px;height:46px;border-radius:15px;display:grid;place-items:center;font-size:22px;background:rgba(255,255,255,.7);flex:none}\nhtml[data-theme=\"dark\"] .roomrow .ri{background:rgba(255,255,255,.07)}\n.roomrow .rb{flex:1;min-width:0}\n.roomrow .rn{font-size:16px;font-weight:650}\n.roomrow .rs{font-size:12.5px;color:var(--text2);margin-top:3px;font-weight:500}\n.roomrow .rt{font-size:28px;font-weight:300;letter-spacing:-.03em;text-align:right}\n.roomrow .rt small{font-size:15px}\n.roomrow .rh{font-size:12px;color:var(--text2);text-align:right;font-weight:500}\n.roomrow .chev{color:var(--muted);font-size:18px}\n\n/* room detail */\n.rhero{border-radius:24px;padding:20px;display:flex;align-items:center;gap:16px;position:relative}\n.rhero .ri{width:54px;height:54px;border-radius:17px;font-size:26px;display:grid;place-items:center;background:rgba(255,255,255,.7);flex:none}\nhtml[data-theme=\"dark\"] .rhero .ri{background:rgba(255,255,255,.07)}\n.rhero .bigt{font-size:64px;color:var(--text)}\n.rhero .meta{font-size:13px;color:var(--text2);font-weight:500;line-height:1.6}\n.spark{margin-top:4px;width:100%;height:56px;display:block}\n.spark path.l{fill:none;stroke:currentColor;stroke-width:2;stroke-linecap:round;stroke-linejoin:round}\n.spark path.a{fill:currentColor;opacity:.12;stroke:none}\n.kv{display:flex;flex-direction:column}\n.kv .row{min-height:56px}\n\n/* devices page */\n.search{display:flex;align-items:center;gap:10px;height:48px;padding:0 14px;border-radius:16px;background:var(--card);box-shadow:var(--shadow);color:var(--muted)}\n.search input{flex:1;border:0;outline:0;background:transparent;font-size:16px;color:var(--text);min-width:0;height:100%}\n.search .i{font-size:18px}\n.seg{display:flex;background:var(--bg2);border-radius:14px;padding:4px;gap:4px}\n.seg button{flex:1;height:38px;border-radius:11px;font-size:13.5px;font-weight:600;color:var(--text2);display:flex;align-items:center;justify-content:center;gap:6px;transition:background-color .2s,color .2s}\n.seg button.sel{background:var(--card);color:var(--text);box-shadow:var(--shadow)}\n.grp-h{font-size:12.5px;font-weight:700;letter-spacing:.04em;text-transform:uppercase;color:var(--muted);margin:20px 4px 8px}\n.sticky{position:sticky;top:0;z-index:5;background:var(--bg);padding:calc(var(--safe-t) + 4px) var(--pad) 8px;margin:calc(-1*var(--safe-t) - 10px) calc(-1*var(--pad)) 0}\n.sticky .topbar{margin-bottom:8px}\n\n/* climate */\n.clim{padding:20px 18px 22px;text-align:center;position:relative}\n.clim-head{display:flex;align-items:center;justify-content:space-between;gap:10px;text-align:left}\n.clim-head .cn{font-weight:650;font-size:16px}\n.clim-head .cs{font-size:12.5px;color:var(--muted);font-weight:500;margin-top:2px}\n.pwr{width:52px;height:52px;border-radius:50%;display:grid;place-items:center;font-size:22px;background:var(--card2);color:var(--muted);box-shadow:var(--shadow);transition:background-color .25s,color .25s;flex:none}\n.pwr.on{background:var(--accent);color:var(--accent-ink)}\n.pwr.pending{animation:blink 1s infinite}\n.dial{position:relative;width:min(260px,70vw);aspect-ratio:1;margin:14px auto 4px}\n.dial>svg{width:100%;height:100%;display:block}\n.dial .ct .i{font-size:14px}\n.dial .trk{fill:none;stroke:var(--bg2);stroke-width:14;stroke-linecap:round}\n.dial .arc{fill:none;stroke:url(#dg);stroke-width:14;stroke-linecap:round;transition:stroke-dashoffset .35s ease}\n.dial .knob{fill:var(--card);stroke:var(--accent);stroke-width:4;transition:cx .35s,cy .35s}\n.dial .mid{position:absolute;inset:0;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:2px}\n.dial .lbl{font-size:12px;font-weight:600;color:var(--muted);text-transform:uppercase;letter-spacing:.08em}\n.dial .tt{font-size:68px;font-weight:250;letter-spacing:-.04em;line-height:1}\n.dial .tt small{font-size:28px;font-weight:300}\n.dial .ct{font-size:13px;color:var(--text2);font-weight:500;display:flex;align-items:center;gap:4px}\n.dial.off .arc{stroke:var(--muted);opacity:.35}\n.dial.off .tt{color:var(--muted)}\n.dial .sending{font-size:11px;color:var(--accent);font-weight:600;height:14px}\n.steppers{display:flex;align-items:center;justify-content:center;gap:28px;margin-top:4px}\n.step{width:64px;height:64px;border-radius:50%;background:var(--card2);box-shadow:var(--shadow);display:grid;place-items:center;font-size:26px;color:var(--accent);transition:transform .12s}\n.step:active{transform:scale(.92)}\n.step:disabled{opacity:.4}\n.range{width:100%;margin:18px 0 2px;-webkit-appearance:none;appearance:none;height:36px;background:transparent}\n.range::-webkit-slider-runnable-track{height:8px;border-radius:8px;background:linear-gradient(90deg,var(--accent) var(--p,50%),var(--bg2) var(--p,50%))}\n.range::-moz-range-track{height:8px;border-radius:8px;background:var(--bg2)}\n.range::-moz-range-progress{height:8px;border-radius:8px;background:var(--accent)}\n.range::-webkit-slider-thumb{-webkit-appearance:none;width:28px;height:28px;border-radius:50%;background:var(--card);border:3px solid var(--accent);margin-top:-10px;box-shadow:0 2px 6px rgba(0,0,0,.2)}\n.range::-moz-range-thumb{width:22px;height:22px;border-radius:50%;background:var(--card);border:3px solid var(--accent)}\n.range:disabled{opacity:.45}\n.rlab{display:flex;justify-content:space-between;font-size:12px;color:var(--muted);font-weight:500}\n.ctl-card{padding:16px}\n.ctl-card h3{font-size:14px;font-weight:650;margin:0 0 12px;display:flex;align-items:center;gap:8px;color:var(--text2)}\n.modes{display:grid;grid-template-columns:repeat(auto-fit,minmax(64px,1fr));gap:8px}\n.mode{display:flex;flex-direction:column;align-items:center;gap:6px;padding:12px 4px;border-radius:16px;background:var(--card2);font-size:12px;font-weight:600;color:var(--text2);transition:background-color .2s,color .2s;min-height:68px;justify-content:center}\n.mode .i{font-size:22px}\n.mode.sel{background:var(--accent);color:var(--accent-ink)}\n.mode.sel.m-heat{background:#ec8b45;color:#fff} .mode.sel.m-cool{background:#3d93dd;color:#fff} .mode.sel.m-dry{background:#3aa9a0;color:#fff} .mode.sel.m-fan_only{background:#6f9bd0;color:#fff} .mode.sel.m-auto,.mode.sel.m-heat_cool{background:#7c74d6;color:#fff}\n.mode.pending{opacity:.6}\n.fan{display:flex;gap:6px;flex-wrap:wrap}\n.fan button{white-space:nowrap;flex:1 1 auto;min-height:44px;border-radius:13px;background:var(--card2);font-size:13px;font-weight:600;color:var(--text2);padding:0 8px;transition:background-color .2s,color .2s}\n.fan button.sel{background:var(--accent-soft);color:var(--accent);box-shadow:inset 0 0 0 1.5px var(--accent)}\n.fan button.pending{opacity:.6}\n.bars{display:inline-flex;gap:2px;align-items:flex-end;height:14px;margin-right:4px;vertical-align:-2px}\n.bars i{width:3px;border-radius:2px;background:currentColor;opacity:.25}\n.bars i.f{opacity:1}\n.range2{display:grid;grid-template-columns:1fr 1fr;gap:10px;margin-top:14px}\n.mini-step{background:var(--card2);border-radius:16px;padding:10px;display:flex;align-items:center;justify-content:space-between}\n.mini-step button{width:40px;height:40px;border-radius:50%;background:var(--card);display:grid;place-items:center;font-size:18px;color:var(--accent);box-shadow:var(--shadow)}\n.mini-step .v{font-size:20px;font-weight:400}\n.mini-step .l{font-size:11px;color:var(--muted);font-weight:600;text-transform:uppercase}\n.climini{display:flex;align-items:center;gap:14px;padding:16px;text-align:left;width:100%}\n.climini .dico{width:48px;height:48px;border-radius:15px;font-size:22px}\n.climini.on .dico{background:var(--blue);color:var(--blue-i)}\n.climini .t{font-size:28px;font-weight:300;letter-spacing:-.03em;margin-left:auto}\n\n/* settings */\n.set{overflow:hidden}\n.set .it{display:flex;align-items:center;gap:12px;padding:14px 16px;min-height:58px;border-top:1px solid var(--line);width:100%;text-align:left}\n.set .it:first-child{border-top:0}\n.set .it .ic{width:34px;height:34px;border-radius:10px;display:grid;place-items:center;font-size:17px;background:var(--accent-soft);color:var(--accent);flex:none}\n.set .it .lb{flex:1;min-width:0}\n.set .it .lb b{font-weight:600;font-size:15px;display:block}\n.set .it .lb span{font-size:12.5px;color:var(--muted);font-weight:500;display:block;margin-top:2px}\n.set .it select,.set .it input[type=time]{background:var(--card2);border:1px solid var(--line);border-radius:10px;height:40px;padding:0 10px;font-size:16px;max-width:52%}\n.set .blk{padding:14px 16px;border-top:1px solid var(--line)}\n.set .blk:first-child{border-top:0}\n.field{display:flex;flex-direction:column;gap:6px;margin-bottom:12px}\n.field label{font-size:12.5px;font-weight:650;color:var(--text2)}\n.field .inp{display:flex;align-items:center;gap:6px;background:var(--card2);border:1px solid var(--line);border-radius:13px;height:48px;padding:0 6px 0 12px}\n.field .inp:focus-within{border-color:var(--accent)}\n.field input{flex:1;border:0;outline:0;background:transparent;font-size:16px;min-width:0;height:100%}\n.field .help{font-size:12px;color:var(--muted)}\n.btns{display:flex;gap:10px;flex-wrap:wrap}\n.btn{white-space:nowrap;height:46px;padding:0 18px;border-radius:14px;font-weight:650;font-size:14.5px;background:var(--card2);color:var(--text);display:inline-flex;align-items:center;justify-content:center;gap:8px;flex:1}\n.btn.pri{background:var(--accent);color:var(--accent-ink)}\n.btn.danger{color:var(--bad)}\n.btn:disabled{opacity:.5}\n.btn:active{transform:scale(.98)}\n.msg{display:flex;gap:10px;align-items:flex-start;padding:12px 14px;border-radius:14px;font-size:13.5px;font-weight:500;margin-bottom:12px;line-height:1.4}\n.msg .i{font-size:18px;margin-top:1px}\n.msg.bad{background:var(--rose);color:var(--rose-i)} .msg.warn{background:var(--warm);color:var(--warm-i)} .msg.ok{background:var(--mint);color:var(--mint-i)} .msg.info{background:var(--blue);color:var(--blue-i)}\n\n/* banner (connection) */\n.banner{display:flex;align-items:center;gap:10px;padding:12px 14px;border-radius:16px;margin-bottom:12px;font-size:13.5px;font-weight:600}\n.banner .i{font-size:18px}\n.banner .grow{flex:1}\n.banner button{font-weight:700;padding:8px 4px}\n.banner.reconnecting,.banner.connecting{background:var(--warm);color:var(--warm-i)}\n.banner.error,.banner.disconnected,.banner.auth_invalid{background:var(--rose);color:var(--rose-i)}\n.banner.demo{background:var(--lav);color:var(--lav-i)}\n.banner.install{background:var(--blue);color:var(--blue-i);align-items:flex-start}\n.banner.install .grow span{display:block;font-weight:500;margin-top:2px}\n.banner.install .i.share{display:inline-block;vertical-align:-3px}\n.spin{animation:spin 1s linear infinite}\n@keyframes spin{to{transform:rotate(360deg)}}\n\n/* welcome */\n.welcome{padding:26px 22px;text-align:center}\n.welcome .logo{width:76px;height:76px;border-radius:24px;margin:0 auto 14px;display:grid;place-items:center;font-size:36px;background:linear-gradient(160deg,var(--hero1),var(--accent-soft));color:var(--accent)}\n.welcome h2{margin:0 0 6px;font-size:22px}\n.welcome p{color:var(--text2);margin:0 0 18px;font-size:14px}\n\n/* bottom nav */\nnav.bn{position:fixed;left:0;right:0;bottom:0;z-index:20;display:flex;justify-content:center;pointer-events:none}\nnav.bn .in{pointer-events:auto;width:100%;max-width:560px;display:grid;grid-template-columns:repeat(6,1fr);background:var(--card);background:color-mix(in srgb,var(--card) 92%,transparent);backdrop-filter:blur(14px);-webkit-backdrop-filter:blur(14px);border-top:1px solid var(--line);padding:6px calc(2px + var(--safe-r)) calc(6px + var(--safe-b)) calc(2px + var(--safe-l));height:calc(var(--nav-h) + var(--safe-b))}\nnav.bn a{display:flex;flex-direction:column;align-items:center;justify-content:center;gap:3px;text-decoration:none;color:var(--muted);font-size:10.5px;font-weight:600;border-radius:14px;min-height:52px;min-width:0;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;-webkit-tap-highlight-color:transparent}\nnav.bn a .ic{width:46px;height:30px;border-radius:15px;display:grid;place-items:center;font-size:21px;transition:background-color .2s,color .2s}\nnav.bn a.sel{color:var(--accent)}\nnav.bn a.sel .ic{background:var(--accent-soft)}\n\n/* bottom sheet */\n.scrim{position:fixed;inset:0;background:var(--scrim);z-index:40;animation:fade .2s}\n@keyframes fade{from{opacity:0}}\n.sheet{position:fixed;left:0;right:0;bottom:0;z-index:41;margin:0 auto;max-width:560px;background:var(--card);border-radius:26px 26px 0 0;box-shadow:var(--shadow-lg);padding:8px calc(20px + var(--safe-r)) calc(22px + var(--safe-b)) calc(20px + var(--safe-l));max-height:88vh;max-height:88dvh;overflow-y:auto;animation:up .28s cubic-bezier(.2,.8,.3,1)}\n@keyframes up{from{transform:translateY(100%)}}\n.sheet .grab{width:40px;height:5px;border-radius:3px;background:var(--line);margin:4px auto 12px}\n.sheet .sh{display:flex;align-items:center;gap:12px;margin-bottom:16px}\n.sheet .sh .dico{width:48px;height:48px;border-radius:15px;font-size:22px}\n.sheet .sh .t{flex:1;min-width:0}\n.sheet .sh .t b{font-size:18px;font-weight:650;display:block;line-height:1.2}\n.sheet .sh .t span{font-size:13px;color:var(--muted);font-weight:500}\n.sheet.on .sh .dico{background:var(--accent-soft);color:var(--accent)}\n.sheet.on.k-light .sh .dico{background:var(--sand);color:var(--sand-i)}\n.bigtg{display:flex;align-items:center;justify-content:space-between;background:var(--card2);border-radius:18px;padding:14px 16px;margin-bottom:12px;width:100%}\n.bigtg b{font-size:16px;font-weight:650}\n.bigtg .tg{width:58px;height:34px}\n.bigtg .tg .kn{width:28px;height:28px}\n.bigtg .tg[aria-checked=\"true\"] .kn{transform:translateX(24px)}\n.bigtg .tg.pending .kn{transform:translateX(12px)}\n.ctl{background:var(--card2);border-radius:18px;padding:14px 16px;margin-bottom:12px}\n.ctl .hd{display:flex;justify-content:space-between;font-size:13.5px;font-weight:600;color:var(--text2)}\n.ctl .hd b{color:var(--text)}\n.ctl .range{margin:6px 0 0}\n.btnrow{display:flex;gap:10px}\n.btnrow .btn{background:var(--card)}\n.meta-sm{font-size:12px;color:var(--muted);text-align:center;margin-top:8px}\n\n/* toasts */\n#toasts{position:fixed;left:0;right:0;bottom:calc(var(--nav-h) + var(--safe-b) + 12px);z-index:60;display:flex;flex-direction:column;align-items:center;gap:8px;pointer-events:none;padding:0 16px}\n.toast{pointer-events:auto;max-width:520px;width:100%;display:flex;align-items:center;gap:10px;padding:12px 14px;border-radius:16px;background:#26303b;color:#fff;font-size:13.5px;font-weight:500;box-shadow:var(--shadow-lg);animation:up2 .25s ease}\nhtml[data-theme=\"dark\"] .toast{background:#e8edf3;color:#18202a}\n.toast .i{font-size:18px;flex:none}\n.toast.bad .i{color:#ff8f8a} html[data-theme=\"dark\"] .toast.bad .i{color:var(--bad)}\n.toast.ok .i{color:#7fdcb7} html[data-theme=\"dark\"] .toast.ok .i{color:#21905f}\n.toast.out{opacity:0;transform:translateY(8px);transition:.25s}\n@keyframes up2{from{opacity:0;transform:translateY(10px)}}\n\n/* skeleton */\n.skel{background:linear-gradient(90deg,var(--card) 0,var(--card2) 50%,var(--card) 100%);background-size:200% 100%;animation:sk 1.2s infinite;border-radius:var(--r);min-height:128px}\n@keyframes sk{to{background-position:-200% 0}}\n\n@media (max-width:360px){\n  :root{--pad:14px;--gap:10px}\n  .bigt{font-size:64px}\n  .dial .tt{font-size:58px}\n  .tiles{grid-template-columns:1fr 1fr}\n  .rooms-grid{grid-template-columns:1fr 1fr}\n  .room{min-height:118px;padding:13px}\n  .room .rt{font-size:26px}\n  .tile{padding:11px}\n}\n@media (min-width:480px){ .tiles{grid-template-columns:repeat(3,1fr)} }\n@media (prefers-reduced-motion:reduce){*{animation-duration:.01ms!important;transition-duration:.01ms!important}}\n.welcome .btn{flex:none;width:100%}\n\n/* disco */\n.disco{padding:26px 18px 20px;text-align:center}\n.discobtn{width:min(220px,62vw);aspect-ratio:1;border-radius:50%;padding:10px;position:relative;overflow:hidden;box-shadow:0 12px 40px rgba(120,80,220,.25);display:inline-grid;place-items:center;transition:transform .15s;isolation:isolate}\n.discobtn::before{content:\"\";position:absolute;inset:-20%;background:conic-gradient(#ff5f6d,#ffc371,#47e891,#4fc3f7,#a66cff,#ff5f6d);z-index:-1}\n.discobtn.on::before{animation:discospin 2.4s linear infinite}\n.discobtn:active{transform:scale(.96)}\n.discobtn:disabled{filter:grayscale(1);opacity:.5}\n.discoin{width:100%;height:100%;border-radius:50%;background:var(--card);display:flex;flex-direction:column;align-items:center;justify-content:center;gap:4px}\n.discoin .dt{font-size:46px;font-weight:300;color:var(--text);line-height:1}\n.discoin .dt .i{font-size:46px;color:#a66cff}\n.discoin .dl{font-size:13px;font-weight:650;color:var(--text2)}\n.dp{color:var(--text2);font-size:14px;margin:16px 4px 0;line-height:1.45}\n@keyframes discospin{to{transform:rotate(360deg)}}\n.chk{width:26px;height:26px;border-radius:8px;border:2px solid var(--line);display:grid;place-items:center;color:#fff;font-size:16px;flex:none}\n.chk.on{background:var(--accent);border-color:var(--accent)}\nnav.bn a{font-size:10.5px}\nnav.bn a .ic{width:44px}\n\n/* ===== 1.5 polish ===== */\n:root{--r:22px;--shadow:0 1px 2px rgba(20,40,70,.04),0 6px 20px rgba(20,40,70,.06)}\nhtml[data-theme=\"dark\"]{--shadow:0 1px 2px rgba(0,0,0,.25),0 6px 20px rgba(0,0,0,.22)}\nbody{background:radial-gradient(1200px 500px at 50% -200px,var(--hero1),transparent 70%) no-repeat,var(--bg)}\n.sec{margin-top:28px}\n.sec-h h2{font-size:17px;display:flex;align-items:center;gap:8px}\n.sec-h h2 .aux{font-size:13px;font-weight:600;background:var(--card2);padding:2px 9px;border-radius:999px}\n.sec-h button.link{font-size:13px;color:var(--accent);font-weight:650;padding:8px 0 8px 10px}\n.hero{border-radius:28px;padding:22px 22px 20px;box-shadow:0 10px 30px rgba(47,134,214,.10)}\nhtml[data-theme=\"dark\"] .hero{box-shadow:none}\n.hero::before{content:\"\";position:absolute;left:-40px;bottom:-70px;width:180px;height:180px;border-radius:50%;background:radial-gradient(closest-side,rgba(120,210,180,.28),transparent);pointer-events:none}\n.tile{border-radius:20px;min-height:110px}\n.dico{width:40px;height:40px;border-radius:13px}\n.room{border-radius:22px}\n.room .ri{border-radius:12px}\n.row{border-radius:20px}\nnav.bn .in{border-top:0;border-radius:24px 24px 0 0;box-shadow:0 -6px 24px rgba(20,40,70,.08)}\nhtml[data-theme=\"dark\"] nav.bn .in{box-shadow:0 -6px 24px rgba(0,0,0,.35)}\nnav.bn a.sel .ic{background:var(--accent-soft);transform:translateY(-1px)}\nnav.bn a .ic{transition:background-color .2s,transform .2s}\n.topbar h1{font-size:26px}\n/* climate carousel */\n.ccar{display:flex;gap:14px;overflow-x:auto;scroll-snap-type:x mandatory;scrollbar-width:none;margin:0 calc(-1*var(--pad));padding:2px var(--pad) 8px;scroll-padding:0 var(--pad);-webkit-overflow-scrolling:touch}\n.ccar::-webkit-scrollbar{display:none}\n.cslide{flex:0 0 100%;scroll-snap-align:center;scroll-snap-stop:always;min-width:0}\n.cslide>.sec:first-of-type{margin-top:14px}\n.cdots{display:flex;justify-content:center;gap:7px;margin-top:6px}\n.cdots i{width:7px;height:7px;border-radius:4px;background:var(--line);transition:width .25s,background-color .25s}\n.cdots i.on{width:22px;background:var(--accent)}\n.clim-head{flex-wrap:wrap}\n.mainstar{display:inline-flex;align-items:center;gap:5px;height:34px;padding:0 12px;border-radius:999px;background:var(--card2);color:var(--muted);font-size:12px;font-weight:650;margin-left:auto;margin-right:8px}\n.mainstar.on{color:#d99a1f;background:var(--sand)} .mainstar.on .i{fill:#e9a82b}\n.mainstar:disabled{opacity:1}\n/* light options */\n.swatches{display:grid;grid-template-columns:repeat(9,1fr);gap:8px;margin-top:10px}\n.sw{aspect-ratio:1;border-radius:50%;background:hsl(var(--h),85%,58%);box-shadow:inset 0 0 0 2px rgba(255,255,255,.6);transition:transform .15s}\n.sw.white{background:linear-gradient(135deg,#fff6e5,#ffffff,#e8f2ff);box-shadow:inset 0 0 0 1.5px var(--line)}\n.sw.sel{transform:scale(1.12);box-shadow:0 0 0 3px var(--card),0 0 0 5px var(--accent)}\n.sw:active{transform:scale(.92)}\n.moods{display:grid;grid-template-columns:repeat(4,1fr);gap:8px;margin-top:10px}\n.moods button{display:flex;flex-direction:column;align-items:center;gap:5px;padding:10px 4px;border-radius:14px;background:var(--card);font-size:12px;font-weight:650;color:var(--text2);min-height:62px;justify-content:center}\n.moods button .i{font-size:19px;color:var(--accent)}\n.moods button:active{transform:scale(.96)}\n@media (max-width:360px){.swatches{grid-template-columns:repeat(5,1fr)}}\n\n/* ---- 1.6: Set time + HA menu + speed ---- */\n@media (max-width:370px){nav.bn a{font-size:9.5px}nav.bn a .ic{width:38px;font-size:19px}}\n.hero-r{display:flex;align-items:center;gap:8px;flex:none}\n.iconbtn{width:38px;height:38px;border-radius:12px;display:grid;place-items:center;font-size:18px;background:rgba(255,255,255,.18);color:inherit;transition:transform .12s,background-color .2s}\n.iconbtn:active{transform:scale(.92)}\n.list,.grid,.rooms{content-visibility:auto;contain-intrinsic-size:auto 400px}\n.tile,.room,.row,.trow,.btn,.chip{transition:transform .12s ease,background-color .2s,box-shadow .2s}\n.tile:active,.room:active,.trow:active,.btn:active{transform:scale(.97)}\n.tnext{display:grid;grid-template-columns:auto 1fr;grid-template-areas:\"l l\" \"t n\" \"t i\";column-gap:16px;align-items:center;padding:18px 20px;border-radius:24px;margin-bottom:18px;color:#fff;background:linear-gradient(135deg,#3b82f6,#7c5cff);box-shadow:0 10px 28px -12px rgba(80,90,255,.55)}\n.tnext .tl{grid-area:l;font-size:12px;font-weight:700;text-transform:uppercase;letter-spacing:.08em;opacity:.8;margin-bottom:4px}\n.tnext .tt{grid-area:t;font-size:44px;font-weight:700;line-height:1;letter-spacing:-.02em}\n.tnext .tn{grid-area:n;font-weight:650;font-size:15px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}\n.tnext .ti{grid-area:i;font-size:13px;opacity:.85}\n.trow{display:flex;align-items:center;gap:10px;background:var(--card);border-radius:20px;padding:12px 14px 12px 6px;box-shadow:var(--shadow);margin-bottom:10px}\n.trow.off{opacity:.55}\n.tmainb{flex:1;display:flex;align-items:center;gap:12px;min-width:0;text-align:left;padding-left:8px}\n.ttime{font-size:30px;font-weight:700;letter-spacing:-.02em;min-width:86px;line-height:1}\n.ttime small{font-size:12px;color:var(--muted);margin-left:3px;font-weight:600}\n.tmain{display:flex;flex-direction:column;gap:5px;min-width:0;flex:1}\n.tname{font-weight:650;font-size:14.5px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}\n.tdays{display:flex;gap:3px}\n.tdays i{font-style:normal;font-size:10.5px;font-weight:700;width:21px;height:19px;border-radius:6px;display:grid;place-items:center;color:var(--muted);background:var(--bg2);text-transform:capitalize}\n.tdays i.on{background:var(--accent-soft);color:var(--accent)}\n.tact{display:flex;align-items:center;gap:6px;min-width:0}\n.apill{font-size:11px;font-weight:700;padding:2px 8px;border-radius:999px;flex:none}\n.apill.on{background:var(--mint);color:var(--mint-i)} .apill.off{background:var(--bg2);color:var(--text2)} .apill.toggle,.apill.run,.apill.mixed{background:var(--blue);color:var(--blue-i)}\n.tents{font-size:12px;color:var(--muted);overflow:hidden;text-overflow:ellipsis;white-space:nowrap}\n.fab{position:fixed;right:calc(18px + var(--safe-r));bottom:calc(var(--nav-h) + var(--safe-b) + 16px);z-index:19;width:58px;height:58px;border-radius:20px;display:grid;place-items:center;font-size:26px;color:#fff;background:linear-gradient(135deg,#3b82f6,#7c5cff);box-shadow:0 10px 24px -8px rgba(80,90,255,.6);transition:transform .15s}\n.fab:active{transform:scale(.9)} .fab[disabled]{opacity:.4}\n@media (min-width:600px){.fab{right:calc(50% - 262px)}}\n.tform .tbig{display:block;width:100%;text-align:center;font-size:52px;font-weight:700;border:0;background:var(--card2);border-radius:20px;padding:14px 0;color:var(--text);font-family:inherit;letter-spacing:-.02em}\n.dsel{display:grid;grid-template-columns:repeat(6,1fr);gap:6px;margin-top:8px}\n.dsel button{height:40px;border-radius:12px;font-weight:700;font-size:13px;background:var(--card);color:var(--text2);text-transform:capitalize;transition:background-color .15s,color .15s}\n.dsel button.on{background:var(--accent);color:#fff}\n.dpre{display:flex;gap:6px;margin-top:8px;flex-wrap:wrap}\n.dpre button{font-size:12px;font-weight:600;padding:6px 10px;border-radius:999px;background:var(--card);color:var(--text2)}\n.tents-list{max-height:260px;overflow-y:auto;margin-top:8px;border-radius:14px;background:var(--card)}\n.tents-list .it{display:flex;align-items:center;gap:12px;padding:10px 12px;width:100%;text-align:left;border-top:1px solid var(--line)}\n.tents-list .it:first-child{border-top:0}\n.tents-list .it .ic{width:32px;height:32px;border-radius:10px;display:grid;place-items:center;background:var(--bg2);color:var(--text2);flex:none}\n.tents-list .it.sel .ic{background:var(--accent-soft);color:var(--accent)}\n.tents-list .it .lb{flex:1;min-width:0} .tents-list .it .lb b{display:block;font-size:14px;font-weight:600} .tents-list .it .lb span{display:block;font-size:12px;color:var(--muted)}\n.tform .btns{display:flex;gap:10px;margin-top:6px} .tform .btns .btn{flex:1}\n.tform .ctl{margin-bottom:12px}\n.hero-r .iconbtn{position:relative;z-index:1;background:rgba(255,255,255,.35)} html[data-theme=\"dark\"] .hero-r .iconbtn{background:rgba(255,255,255,.12)}\n.tpage{padding-bottom:84px}\n\n/* ---- 1.7: climate home, info, polish ---- */\n@keyframes rise{from{opacity:0;transform:translateY(10px) scale(.985)}to{opacity:1;transform:none}}\n.page>.sec,.page>.card,.page>.chome,.ccards>*,.tiles>*,.rooms-grid>*,.ilist>*:nth-child(-n+12){animation:rise .32s cubic-bezier(.2,.8,.3,1) both}\n.page>*:nth-child(2){animation-delay:.03s}.page>*:nth-child(3){animation-delay:.06s}.page>*:nth-child(4){animation-delay:.09s}.page>*:nth-child(5){animation-delay:.12s}\n.ccards>*:nth-child(2),.tiles>*:nth-child(2),.rooms-grid>*:nth-child(2){animation-delay:.04s}.ccards>*:nth-child(3),.tiles>*:nth-child(3),.rooms-grid>*:nth-child(3){animation-delay:.08s}.ccards>*:nth-child(4),.tiles>*:nth-child(4),.rooms-grid>*:nth-child(4){animation-delay:.12s}\n@media (prefers-reduced-motion:reduce){*{animation:none!important;transition:none!important}}\n.habtn{display:inline-flex;align-items:center;gap:6px;height:34px;padding:0 12px;border-radius:999px;font-weight:700;font-size:13px;background:rgba(255,255,255,.4);color:inherit;position:relative;z-index:1;transition:transform .12s}\n.habtn:active{transform:scale(.94)} html[data-theme=\"dark\"] .habtn{background:rgba(255,255,255,.12)}\n.cstrip{display:grid;grid-template-columns:repeat(auto-fit,minmax(72px,1fr));gap:8px;text-decoration:none;color:inherit}\n.csi{position:relative;display:flex;flex-direction:column;gap:2px;padding:12px;border-radius:18px;background:var(--card);box-shadow:var(--shadow);border-bottom:3px solid var(--tc)}\n.csi b{font-size:12.5px;font-weight:650;color:var(--text2);white-space:nowrap;overflow:hidden;text-overflow:ellipsis}\n.csi .num{font-size:22px;font-weight:700;color:var(--tc)} .csi .num small{font-size:13px}\n.csi i{position:absolute;top:10px;right:10px;font-size:14px;color:var(--accent);font-style:normal}\n.chome{display:block;text-decoration:none;color:#fff;border-radius:28px;padding:20px;position:relative;overflow:hidden;background:linear-gradient(145deg,#2563eb 0%,#7c3aed 100%);box-shadow:0 18px 40px -18px rgba(76,70,230,.65);transition:transform .15s}\n.chome:active{transform:scale(.985)}\n.chome::before{content:\"\";position:absolute;width:240px;height:240px;right:-70px;top:-90px;border-radius:50%;background:radial-gradient(closest-side,var(--tc),transparent);opacity:.55;transition:background .6s}\n.ch-top{display:flex;justify-content:space-between;align-items:center;position:relative}\n.ch-l{display:flex;align-items:center;gap:6px;font-size:13px;font-weight:700;text-transform:uppercase;letter-spacing:.06em;opacity:.9}\n.ch-on{font-size:12.5px;font-weight:700;padding:4px 10px;border-radius:999px;background:rgba(255,255,255,.18)}\n.ch-mid{display:flex;align-items:flex-end;gap:16px;margin:6px 0 14px;position:relative}\n.chome .bigt{color:#fff}\n.ch-meta{display:flex;flex-direction:column;gap:4px;padding-bottom:12px;font-size:13.5px;font-weight:600;opacity:.92}\n.ch-meta span{display:flex;align-items:center;gap:6px}\n.ch-rooms{display:grid;grid-template-columns:repeat(auto-fit,minmax(64px,1fr));gap:8px;position:relative}\n.chr{display:flex;flex-direction:column;padding:10px;border-radius:16px;background:rgba(255,255,255,.14);backdrop-filter:blur(6px);-webkit-backdrop-filter:blur(6px);border:1px solid rgba(255,255,255,.12)}\n.chr.on{background:rgba(255,255,255,.26)}\n.chr b{font-size:12px;font-weight:650;opacity:.9;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}\n.chr .num{font-size:20px;font-weight:700} .chr .num small{font-size:12px}\n.ch-foot{display:flex;justify-content:space-between;align-items:center;margin-top:14px;font-size:13px;font-weight:600;opacity:.9;position:relative}\n.ccards{display:grid;grid-template-columns:1fr 1fr;gap:12px}\n.ccard{position:relative;background:var(--card);border-radius:22px;padding:14px 14px 10px;box-shadow:var(--shadow);cursor:pointer;overflow:hidden;transition:transform .12s,box-shadow .2s}\n.ccard:active{transform:scale(.97)}\n.ccard::after{content:\"\";position:absolute;inset:0 0 auto 0;height:4px;background:var(--tc);opacity:.85}\n.ccard.on{box-shadow:0 0 0 2px var(--accent-soft),var(--shadow)}\n.ccard.na{opacity:.55}\n.cc-h{display:flex;justify-content:space-between;align-items:center;gap:6px}\n.cc-h b{font-size:15px;font-weight:650;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}\n.pwr.sm{width:34px;height:34px;font-size:16px;border-radius:12px}\n.cc-t{font-size:32px;font-weight:700;color:var(--tc);margin-top:4px;line-height:1.1;transition:color .6s} .cc-t small{font-size:16px}\n.cc-s{font-size:12px;color:var(--muted);font-weight:600;margin:2px 0 4px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}\n.ccard.on .cc-s{color:var(--accent)}\n.mspark{display:block;width:100%;height:34px;color:var(--tc)} .mspark-e{height:34px}\n.mspark .a{fill:currentColor;opacity:.14} .mspark .l{fill:none;stroke:currentColor;stroke-width:2;stroke-linejoin:round;stroke-linecap:round}\n.rtemp{display:flex;align-items:center;gap:14px;background:var(--card);border-radius:22px;padding:14px 16px;box-shadow:var(--shadow);margin-bottom:12px;border-left:4px solid var(--tc)}\n.rtemp>div{display:flex;flex-direction:column;flex:none}\n.rtemp .lbl{font-size:12px;font-weight:700;color:var(--muted);text-transform:uppercase;letter-spacing:.05em}\n.rtemp .v{font-size:30px;font-weight:700;color:var(--tc)} .rtemp .v small{font-size:15px}\n.rtemp .src{font-size:12px;color:var(--muted)} .rtemp .mspark{flex:1;height:44px}\n.gmembers{display:grid;grid-template-columns:repeat(auto-fit,minmax(70px,1fr));gap:8px;margin-top:14px}\n.gm{display:flex;flex-direction:column;align-items:flex-start;padding:10px;border-radius:14px;background:var(--card2);text-align:left}\n.gm b{font-size:12px;font-weight:650;color:var(--text2)} .gm .num{font-size:17px;font-weight:700} .gm small{font-size:11px;color:var(--muted);font-weight:600}\n.gm.on{background:var(--accent-soft)} .gm.on small{color:var(--accent)}\n.tstrip{display:flex;gap:8px;overflow-x:auto;margin:10px -2px 4px;padding:2px 2px 6px;scrollbar-width:none} .tstrip::-webkit-scrollbar{display:none}\n.tsi{flex:none;display:flex;flex-direction:column;align-items:flex-start;min-width:86px;padding:10px 12px;border-radius:16px;background:var(--card);box-shadow:var(--shadow);border-bottom:3px solid var(--tc)}\n.tsn{font-size:12px;font-weight:650;color:var(--text2)} .tsv{font-size:20px;font-weight:700;color:var(--tc)} .tsv small{font-size:12px}\n.tsh{font-size:11px;color:var(--muted);display:flex;align-items:center;gap:2px}\n.grp-h{display:flex;justify-content:space-between;align-items:center}\n.grp-t{display:inline-flex;align-items:center;gap:3px;font-weight:700;text-transform:none;letter-spacing:0}\na.row{text-decoration:none;color:inherit}\n.irow .rb{display:flex;flex-direction:column;min-width:0;flex:1}\n.irow .rn{white-space:nowrap;overflow:hidden;text-overflow:ellipsis}\n.irow .rs{font-size:11.5px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}\n.irow .rvalue{max-width:42%;text-align:right;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}\n.ilist{content-visibility:visible}\n.ihero{display:flex;align-items:center;gap:14px;background:linear-gradient(135deg,var(--card),var(--card2));border-radius:24px;padding:18px;box-shadow:var(--shadow);margin-bottom:14px}\n.ihero .dico{width:52px;height:52px;font-size:24px;border-radius:16px;flex:none;background:var(--accent-soft);color:var(--accent)}\n.ih-b{flex:1;min-width:0} .ih-v{font-size:28px;font-weight:700;line-height:1.15;word-break:break-word} .ih-s{font-size:12.5px;color:var(--muted);margin-top:2px}\n.ihero.na .ih-v{color:var(--muted)}\n.icard{margin-bottom:14px;padding:16px}\n.icard h3{display:flex;align-items:center;gap:8px;font-size:15px;font-weight:650;margin:0 0 10px}\n.ic-h{display:flex;justify-content:space-between;align-items:center;margin-bottom:8px} .ic-h h3{margin:0}\n.seg.sm button{height:30px;font-size:12px;padding:0 10px}\n.chart{position:relative}\n.chart svg{display:block;width:100%;height:150px;color:var(--accent)}\n.chart .a{fill:currentColor;opacity:.12} .chart .l{fill:none;stroke:currentColor;stroke-width:2.2;stroke-linejoin:round}\n.chart .grid line{stroke:var(--line);stroke-dasharray:3 4}\n.ylab{position:absolute;inset:4px auto 4px 4px;display:flex;flex-direction:column;justify-content:space-between;font-size:10.5px;font-weight:700;color:var(--muted);pointer-events:none}\n.ylab span{background:color-mix(in srgb,var(--card) 80%,transparent);padding:0 3px;border-radius:4px}\n.xlab{display:flex;justify-content:space-between;font-size:10.5px;color:var(--muted);font-weight:600;margin-top:4px}\n.cstats{display:grid;grid-template-columns:repeat(3,1fr);gap:8px;margin-top:12px}\n.cstats span{background:var(--card2);border-radius:12px;padding:8px 10px;font-weight:700;font-size:14px}\n.cstats small{display:block;font-size:10.5px;color:var(--muted);font-weight:700;text-transform:uppercase}\n.tline{position:relative;height:28px;border-radius:10px;background:var(--bg2);overflow:hidden}\n.tline i{position:absolute;top:0;bottom:0}\n.tleg{display:flex;flex-wrap:wrap;gap:8px 14px;margin-top:10px;font-size:12.5px;color:var(--text2)}\n.tleg span{display:flex;align-items:center;gap:6px} .tleg i{width:10px;height:10px;border-radius:3px;display:inline-block}\n.kv{display:grid;grid-template-columns:minmax(90px,38%) 1fr;gap:0;margin:0;font-size:13.5px}\n.kv dt{color:var(--muted);font-weight:600;padding:8px 8px 8px 0;border-top:1px solid var(--line)}\n.kv dd{margin:0;padding:8px 0;border-top:1px solid var(--line);word-break:break-word;font-weight:550}\n.kv dt:first-of-type,.kv dd:first-of-type{border-top:0}\n.ic-sub{font-size:12px;font-weight:700;color:var(--muted);text-transform:uppercase;letter-spacing:.05em;margin:14px 0 8px}\n.hagrid{display:grid;grid-template-columns:1fr 1fr;gap:10px;margin-bottom:12px}\n.hat{display:flex;flex-direction:column;align-items:flex-start;gap:4px;padding:16px;border-radius:20px;color:#fff;text-align:left;min-height:104px;transition:transform .12s;box-shadow:0 10px 24px -14px rgba(0,0,0,.45)}\n.hat:active{transform:scale(.96)}\n.hat .hi{width:36px;height:36px;border-radius:12px;display:grid;place-items:center;background:rgba(255,255,255,.22);font-size:19px;margin-bottom:auto}\n.hat b{font-size:15px;font-weight:700} .hat small{font-size:11.5px;opacity:.85;font-weight:600}\n.hat.c0{background:linear-gradient(135deg,#3b82f6,#6366f1)}.hat.c1{background:linear-gradient(135deg,#10b981,#059669)}.hat.c2{background:linear-gradient(135deg,#f59e0b,#ef4444)}.hat.c3{background:linear-gradient(135deg,#8b5cf6,#d946ef)}.hat.c4{background:linear-gradient(135deg,#06b6d4,#3b82f6)}\n.seg.sm button{white-space:nowrap}\n.page.sub .topbar h1{font-size:22px;line-height:1.2;overflow:hidden;text-overflow:ellipsis;display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical}\n/* ---- 1.8 ---- */\n.cfoot{margin-top:22px}\n.heatbtn{display:flex;align-items:center;gap:12px;width:100%;text-align:left;padding:14px 16px;border-radius:22px;background:linear-gradient(135deg,#fff3e6,#ffe4cc);color:#7a3b06;box-shadow:var(--shadow);transition:transform .12s}\nhtml[data-theme=\"dark\"] .heatbtn{background:linear-gradient(135deg,#3a2716,#2c1d10);color:#ffc58f}\n.heatbtn:active{transform:scale(.98)}\n.hb-i{width:42px;height:42px;border-radius:14px;display:grid;place-items:center;font-size:21px;background:linear-gradient(135deg,#fb923c,#ef4444);color:#fff;flex:none}\n.hb-t{flex:1;min-width:0;display:flex;flex-direction:column} .hb-t b{font-size:15px} .hb-t span{font-size:12.5px;opacity:.8;font-weight:600}\n.hb-x{display:flex;align-items:center;gap:2px;font-size:12px;font-weight:700;opacity:.85;white-space:nowrap}\n.cf-row{display:grid;grid-template-columns:1fr 1fr;gap:10px;margin-top:10px}\n.cf-row .btn{background:var(--card);box-shadow:var(--shadow);text-decoration:none;color:var(--text);justify-content:center}\n.gpre{display:flex;gap:8px;margin-top:14px;justify-content:center;flex-wrap:wrap}\n.gpre button{min-width:52px;height:38px;border-radius:12px;background:var(--card2);font-weight:700;font-size:14px;color:var(--text2);transition:background-color .15s,color .15s,transform .12s}\n.gpre button:active{transform:scale(.94)} .gpre button.sel{background:var(--accent);color:#fff}\n.cf-row{grid-template-columns:minmax(0,1fr) minmax(0,1fr)}\n.cf-row .btn{min-width:0;font-size:13.5px;white-space:normal;line-height:1.2;text-align:center;padding:0 10px}\n.cf-row .btn:only-child{grid-column:1/-1}\n.hb-x{max-width:38%;white-space:normal;text-align:right;line-height:1.2}\n@media (max-width:400px){.hb-x{font-size:0}.hb-x svg{font-size:18px}}\n@media (max-width:420px){nav.bn a{font-size:9.8px;letter-spacing:-.01em}}\n\n/* running inside Home Assistant: hide its interface, let the page scroll normally */\nhome-assistant{display:none!important}\nhtml,body{height:auto!important;min-height:100%!important;overflow:visible!important;overflow-y:auto!important;position:static!important}"; head.appendChild(st);
  document.body.insertAdjacentHTML('beforeend', '<div id="app"><main id="view" aria-live="polite"></main><div id="sheet"></div><div id="nav"></div></div><div id="toasts" aria-live="assertive"></div>');
  window.__comfortEmbed = {
    getHass: function () { var h = document.querySelector('home-assistant'); return h && h.hass; },
    logout: function () { var h = document.querySelector('home-assistant'); if (h) h.dispatchEvent(new CustomEvent('hass-logout', { bubbles: true, composed: true })); }
  };
/* Icons: Lucide (ISC licence), https://lucide.dev */
window.ICONS={"grid":"<rect width=\"7\" height=\"7\" x=\"3\" y=\"3\" rx=\"1\"></rect><rect width=\"7\" height=\"7\" x=\"14\" y=\"3\" rx=\"1\"></rect><rect width=\"7\" height=\"7\" x=\"14\" y=\"14\" rx=\"1\"></rect><rect width=\"7\" height=\"7\" x=\"3\" y=\"14\" rx=\"1\"></rect>","home":"<path d=\"M15 21v-8a1 1 0 0 0-1-1h-4a1 1 0 0 0-1 1v8\"></path><path d=\"M3 10a2 2 0 0 1 .709-1.528l7-5.999a2 2 0 0 1 2.582 0l7 5.999A2 2 0 0 1 21 10v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z\"></path>","climate":"<path d=\"M6 12H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2\"></path><path d=\"M6 8h12\"></path><path d=\"M18.3 17.7a2.5 2.5 0 0 1-3.16 3.83 2.53 2.53 0 0 1-1.14-2V12\"></path><path d=\"M6.6 15.6A2 2 0 1 0 10 17v-5\"></path>","rooms":"<rect width=\"7\" height=\"7\" x=\"3\" y=\"3\" rx=\"1\"></rect><rect width=\"7\" height=\"7\" x=\"14\" y=\"3\" rx=\"1\"></rect><rect width=\"7\" height=\"7\" x=\"14\" y=\"14\" rx=\"1\"></rect><rect width=\"7\" height=\"7\" x=\"3\" y=\"14\" rx=\"1\"></rect>","devices":"<rect width=\"20\" height=\"12\" x=\"2\" y=\"6\" rx=\"6\" ry=\"6\"></rect><circle cx=\"16\" cy=\"12\" r=\"2\"></circle>","settings":"<path d=\"M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z\"></path><circle cx=\"12\" cy=\"12\" r=\"3\"></circle>","sofa":"<path d=\"M20 9V6a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v3\"></path><path d=\"M2 16a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-5a2 2 0 0 0-4 0v1.5a.5.5 0 0 1-.5.5h-11a.5.5 0 0 1-.5-.5V11a2 2 0 0 0-4 0z\"></path><path d=\"M4 18v2\"></path><path d=\"M20 18v2\"></path><path d=\"M12 4v9\"></path>","bed":"<path d=\"M2 20v-8a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v8\"></path><path d=\"M4 10V6a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v4\"></path><path d=\"M12 4v6\"></path><path d=\"M2 18h20\"></path>","kitchen":"<path d=\"M2 12h20\"></path><path d=\"M20 12v8a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2v-8\"></path><path d=\"m4 8 16-4\"></path><path d=\"m8.86 6.78-.45-1.81a2 2 0 0 1 1.45-2.43l1.94-.48a2 2 0 0 1 2.43 1.46l.45 1.8\"></path>","attic":"<path d=\"M15 21v-8a1 1 0 0 0-1-1h-4a1 1 0 0 0-1 1v8\"></path><path d=\"M3 10a2 2 0 0 1 .709-1.528l7-5.999a2 2 0 0 1 2.582 0l7 5.999A2 2 0 0 1 21 10v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z\"></path>","bath":"<path d=\"M10 4 8 6\"></path><path d=\"M17 19v2\"></path><path d=\"M2 12h20\"></path><path d=\"M7 19v2\"></path><path d=\"M9 5 7.621 3.621A2.121 2.121 0 0 0 4 5v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-5\"></path>","office":"<path d=\"M16 20V4a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16\"></path><rect width=\"20\" height=\"14\" x=\"2\" y=\"6\" rx=\"2\"></rect>","baby":"<path d=\"M9 12h.01\"></path><path d=\"M15 12h.01\"></path><path d=\"M10 16c.5.3 1.2.5 2 .5s1.5-.2 2-.5\"></path><path d=\"M19 6.3a9 9 0 0 1 1.8 3.9 2 2 0 0 1 0 3.6 9 9 0 0 1-17.6 0 2 2 0 0 1 0-3.6A9 9 0 0 1 12 3c2 0 3.5 1.1 3.5 2.5s-.9 2.5-2 2.5c-.8 0-1.5-.4-1.5-1\"></path>","garage":"<path d=\"M19 17h2c.6 0 1-.4 1-1v-3c0-.9-.7-1.7-1.5-1.9C18.7 10.6 16 10 16 10s-1.3-1.4-2.2-2.3c-.5-.4-1.1-.7-1.8-.7H5c-.6 0-1.1.4-1.4.9l-1.4 2.9A3.7 3.7 0 0 0 2 12v4c0 .6.4 1 1 1h2\"></path><circle cx=\"7\" cy=\"17\" r=\"2\"></circle><path d=\"M9 17h6\"></path><circle cx=\"17\" cy=\"17\" r=\"2\"></circle>","garden":"<path d=\"M10 10v.2A3 3 0 0 1 8.9 16H5a3 3 0 0 1-1-5.8V10a3 3 0 0 1 6 0Z\"></path><path d=\"M7 16v6\"></path><path d=\"M13 19v3\"></path><path d=\"M12 19h8.3a1 1 0 0 0 .7-1.7L18 14h.3a1 1 0 0 0 .7-1.7L16 9h.2a1 1 0 0 0 .8-1.7L13 3l-1.4 1.5\"></path>","door":"<path d=\"M13 4h3a2 2 0 0 1 2 2v14\"></path><path d=\"M2 20h3\"></path><path d=\"M13 20h9\"></path><path d=\"M10 12v.01\"></path><path d=\"M13 4.562v16.157a1 1 0 0 1-1.242.97L5 20V5.562a2 2 0 0 1 1.515-1.94l4-1A2 2 0 0 1 13 4.561Z\"></path>","stairs":"<path d=\"m21 16-4 4-4-4\"></path><path d=\"M17 20V4\"></path><path d=\"m3 8 4-4 4 4\"></path><path d=\"M7 4v16\"></path>","dining":"<path d=\"M3 2v7c0 1.1.9 2 2 2h4a2 2 0 0 0 2-2V2\"></path><path d=\"M7 2v20\"></path><path d=\"M21 15V2a5 5 0 0 0-5 5v6c0 1.1.9 2 2 2h3Zm0 0v7\"></path>","laundry":"<path d=\"M20.38 3.46 16 2a4 4 0 0 1-8 0L3.62 3.46a2 2 0 0 0-1.34 2.23l.58 3.47a1 1 0 0 0 .99.84H6v10c0 1.1.9 2 2 2h8a2 2 0 0 0 2-2V10h2.15a1 1 0 0 0 .99-.84l.58-3.47a2 2 0 0 0-1.34-2.23z\"></path>","game":"<line x1=\"6\" x2=\"10\" y1=\"11\" y2=\"11\"></line><line x1=\"8\" x2=\"8\" y1=\"9\" y2=\"13\"></line><line x1=\"15\" x2=\"15.01\" y1=\"12\" y2=\"12\"></line><line x1=\"18\" x2=\"18.01\" y1=\"10\" y2=\"10\"></line><path d=\"M17.32 5H6.68a4 4 0 0 0-3.978 3.59c-.006.052-.01.101-.017.152C2.604 9.416 2 14.456 2 16a3 3 0 0 0 3 3c1 0 1.5-.5 2-1l1.414-1.414A2 2 0 0 1 9.828 16h4.344a2 2 0 0 1 1.414.586L17 18c.5.5 1 1 2 1a3 3 0 0 0 3-3c0-1.545-.604-6.584-.685-7.258-.007-.05-.011-.1-.017-.151A4 4 0 0 0 17.32 5z\"></path>","gym":"<path d=\"M14.4 14.4 9.6 9.6\"></path><path d=\"M18.657 21.485a2 2 0 1 1-2.829-2.828l-1.767 1.768a2 2 0 1 1-2.829-2.829l6.364-6.364a2 2 0 1 1 2.829 2.829l-1.768 1.767a2 2 0 1 1 2.828 2.829z\"></path><path d=\"m21.5 21.5-1.4-1.4\"></path><path d=\"M3.9 3.9 2.5 2.5\"></path><path d=\"M6.404 12.768a2 2 0 1 1-2.829-2.829l1.768-1.767a2 2 0 1 1-2.828-2.829l2.828-2.828a2 2 0 1 1 2.829 2.828l1.767-1.768a2 2 0 1 1 2.829 2.829z\"></path>","room":"<path d=\"M5 3a2 2 0 0 0-2 2\"></path><path d=\"M19 3a2 2 0 0 1 2 2\"></path><path d=\"M21 19a2 2 0 0 1-2 2\"></path><path d=\"M5 21a2 2 0 0 1-2-2\"></path><path d=\"M9 3h1\"></path><path d=\"M9 21h1\"></path><path d=\"M14 3h1\"></path><path d=\"M14 21h1\"></path><path d=\"M3 9v1\"></path><path d=\"M21 9v1\"></path><path d=\"M3 14v1\"></path><path d=\"M21 14v1\"></path>","light":"<path d=\"M15 14c.2-1 .7-1.7 1.5-2.5 1-.9 1.5-2.2 1.5-3.5A6 6 0 0 0 6 8c0 1 .2 2.2 1.5 3.5.7.7 1.3 1.5 1.5 2.5\"></path><path d=\"M9 18h6\"></path><path d=\"M10 22h4\"></path>","plug":"<path d=\"M12 22v-5\"></path><path d=\"M9 8V2\"></path><path d=\"M15 8V2\"></path><path d=\"M18 8v5a4 4 0 0 1-4 4h-4a4 4 0 0 1-4-4V8Z\"></path>","tv":"<rect width=\"20\" height=\"15\" x=\"2\" y=\"7\" rx=\"2\" ry=\"2\"></rect><polyline points=\"17 2 12 7 7 2\"></polyline>","fan":"<path d=\"M10.827 16.379a6.082 6.082 0 0 1-8.618-7.002l5.412 1.45a6.082 6.082 0 0 1 7.002-8.618l-1.45 5.412a6.082 6.082 0 0 1 8.618 7.002l-5.412-1.45a6.082 6.082 0 0 1-7.002 8.618l1.45-5.412Z\"></path><path d=\"M12 12v.01\"></path>","blinds":"<path d=\"M3 3h18\"></path><path d=\"M20 7H8\"></path><path d=\"M20 11H8\"></path><path d=\"M10 19h10\"></path><path d=\"M8 15h12\"></path><path d=\"M4 3v14\"></path><circle cx=\"4\" cy=\"19\" r=\"2\"></circle>","switch":"<rect width=\"20\" height=\"12\" x=\"2\" y=\"6\" rx=\"6\" ry=\"6\"></rect><circle cx=\"8\" cy=\"12\" r=\"2\"></circle>","power":"<path d=\"M12 2v10\"></path><path d=\"M18.4 6.6a9 9 0 1 1-12.77.04\"></path>","speaker":"<rect width=\"16\" height=\"20\" x=\"4\" y=\"2\" rx=\"2\"></rect><path d=\"M12 6h.01\"></path><circle cx=\"12\" cy=\"14\" r=\"4\"></circle><path d=\"M12 14h.01\"></path>","lock":"<rect width=\"18\" height=\"11\" x=\"3\" y=\"11\" rx=\"2\" ry=\"2\"></rect><path d=\"M7 11V7a5 5 0 0 1 10 0v4\"></path>","heater":"<path d=\"M11 8c2-3-2-3 0-6\"></path><path d=\"M15.5 8c2-3-2-3 0-6\"></path><path d=\"M6 10h.01\"></path><path d=\"M6 14h.01\"></path><path d=\"M10 16v-4\"></path><path d=\"M14 16v-4\"></path><path d=\"M18 16v-4\"></path><path d=\"M20 6a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h3\"></path><path d=\"M5 20v2\"></path><path d=\"M19 20v2\"></path>","thermo":"<path d=\"M14 4v10.54a4 4 0 1 1-4 0V4a2 2 0 0 1 4 0Z\"></path>","drop":"<path d=\"M7 16.3c2.2 0 4-1.83 4-4.05 0-1.16-.57-2.26-1.71-3.19S7.29 6.75 7 5.3c-.29 1.45-1.14 2.84-2.29 3.76S3 11.1 3 12.25c0 2.22 1.8 4.05 4 4.05z\"></path><path d=\"M12.56 6.6A10.97 10.97 0 0 0 14 3.02c.5 2.5 2 4.9 4 6.5s3 3.5 3 5.5a6.98 6.98 0 0 1-11.91 4.97\"></path>","droplet":"<path d=\"M12 22a7 7 0 0 0 7-7c0-2-1-3.9-3-5.5s-3.5-4-4-6.5c-.5 2.5-2 4.9-4 6.5C6 11.1 5 13 5 15a7 7 0 0 0 7 7z\"></path>","snow":"<line x1=\"2\" x2=\"22\" y1=\"12\" y2=\"12\"></line><line x1=\"12\" x2=\"12\" y1=\"2\" y2=\"22\"></line><path d=\"m20 16-4-4 4-4\"></path><path d=\"m4 8 4 4-4 4\"></path><path d=\"m16 4-4 4-4-4\"></path><path d=\"m8 20 4-4 4 4\"></path>","flame":"<path d=\"M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z\"></path>","wind":"<path d=\"M12.8 19.6A2 2 0 1 0 14 16H2\"></path><path d=\"M17.5 8a2.5 2.5 0 1 1 2 4H2\"></path><path d=\"M9.8 4.4A2 2 0 1 1 11 8H2\"></path>","sun":"<circle cx=\"12\" cy=\"12\" r=\"4\"></circle><path d=\"M12 2v2\"></path><path d=\"M12 20v2\"></path><path d=\"m4.93 4.93 1.41 1.41\"></path><path d=\"m17.66 17.66 1.41 1.41\"></path><path d=\"M2 12h2\"></path><path d=\"M20 12h2\"></path><path d=\"m6.34 17.66-1.41 1.41\"></path><path d=\"m19.07 4.93-1.41 1.41\"></path>","moon":"<path d=\"M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z\"></path>","sunmoon":"<path d=\"M12 8a2.83 2.83 0 0 0 4 4 4 4 0 1 1-4-4\"></path><path d=\"M12 2v2\"></path><path d=\"M12 20v2\"></path><path d=\"m4.9 4.9 1.4 1.4\"></path><path d=\"m17.7 17.7 1.4 1.4\"></path><path d=\"M2 12h2\"></path><path d=\"M20 12h2\"></path><path d=\"m6.3 17.7-1.4 1.4\"></path><path d=\"m19.1 4.9-1.4 1.4\"></path>","auto":"<path d=\"M9.937 15.5A2 2 0 0 0 8.5 14.063l-6.135-1.582a.5.5 0 0 1 0-.962L8.5 9.936A2 2 0 0 0 9.937 8.5l1.582-6.135a.5.5 0 0 1 .963 0L14.063 8.5A2 2 0 0 0 15.5 9.937l6.135 1.581a.5.5 0 0 1 0 .964L15.5 14.063a2 2 0 0 0-1.437 1.437l-1.582 6.135a.5.5 0 0 1-.963 0z\"></path><path d=\"M20 3v4\"></path><path d=\"M22 5h-4\"></path><path d=\"M4 17v2\"></path><path d=\"M5 18H3\"></path>","heatcool":"<path d=\"M12 9a4 4 0 0 0-2 7.5\"></path><path d=\"M12 3v2\"></path><path d=\"m6.6 18.4-1.4 1.4\"></path><path d=\"M20 4v10.54a4 4 0 1 1-4 0V4a2 2 0 0 1 4 0Z\"></path><path d=\"M4 13H2\"></path><path d=\"M6.34 7.34 4.93 5.93\"></path>","repeat":"<path d=\"M12 2v20\"></path><path d=\"m8 18 4 4 4-4\"></path><path d=\"m8 6 4-4 4 4\"></path>","plus":"<path d=\"M5 12h14\"></path><path d=\"M12 5v14\"></path>","minus":"<path d=\"M5 12h14\"></path>","back":"<path d=\"m15 18-6-6 6-6\"></path>","chev":"<path d=\"m9 18 6-6-6-6\"></path>","search":"<circle cx=\"11\" cy=\"11\" r=\"8\"></circle><path d=\"m21 21-4.3-4.3\"></path>","star":"<path d=\"M11.525 2.295a.53.53 0 0 1 .95 0l2.31 4.679a2.123 2.123 0 0 0 1.595 1.16l5.166.756a.53.53 0 0 1 .294.904l-3.736 3.638a2.123 2.123 0 0 0-.611 1.878l.882 5.14a.53.53 0 0 1-.771.56l-4.618-2.428a2.122 2.122 0 0 0-1.973 0L6.396 21.01a.53.53 0 0 1-.77-.56l.881-5.139a2.122 2.122 0 0 0-.611-1.879L2.16 9.795a.53.53 0 0 1 .294-.906l5.165-.755a2.122 2.122 0 0 0 1.597-1.16z\"></path>","wifi":"<path d=\"M12 20h.01\"></path><path d=\"M2 8.82a15 15 0 0 1 20 0\"></path><path d=\"M5 12.859a10 10 0 0 1 14 0\"></path><path d=\"M8.5 16.429a5 5 0 0 1 7 0\"></path>","wifioff":"<path d=\"M12 20h.01\"></path><path d=\"M8.5 16.429a5 5 0 0 1 7 0\"></path><path d=\"M5 12.859a10 10 0 0 1 5.17-2.69\"></path><path d=\"M19 12.859a10 10 0 0 0-2.007-1.523\"></path><path d=\"M2 8.82a15 15 0 0 1 4.177-2.643\"></path><path d=\"M22 8.82a15 15 0 0 0-11.288-3.764\"></path><path d=\"m2 2 20 20\"></path>","up":"<polyline points=\"22 7 13.5 15.5 8.5 10.5 2 17\"></polyline><polyline points=\"16 7 22 7 22 13\"></polyline>","down":"<polyline points=\"22 17 13.5 8.5 8.5 13.5 2 7\"></polyline><polyline points=\"16 17 22 17 22 11\"></polyline>","flat":"<path d=\"M18 8L22 12L18 16\"></path><path d=\"M2 12H22\"></path>","ok":"<circle cx=\"12\" cy=\"12\" r=\"10\"></circle><path d=\"m9 12 2 2 4-4\"></path>","alert":"<circle cx=\"12\" cy=\"12\" r=\"10\"></circle><line x1=\"12\" x2=\"12\" y1=\"8\" y2=\"12\"></line><line x1=\"12\" x2=\"12.01\" y1=\"16\" y2=\"16\"></line>","refresh":"<path d=\"M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8\"></path><path d=\"M21 3v5h-5\"></path><path d=\"M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16\"></path><path d=\"M8 16H3v5\"></path>","x":"<path d=\"M18 6 6 18\"></path><path d=\"m6 6 12 12\"></path>","info":"<circle cx=\"12\" cy=\"12\" r=\"10\"></circle><path d=\"M12 16v-4\"></path><path d=\"M12 8h.01\"></path>","eye":"<path d=\"M2.062 12.348a1 1 0 0 1 0-.696 10.75 10.75 0 0 1 19.876 0 1 1 0 0 1 0 .696 10.75 10.75 0 0 1-19.876 0\"></path><circle cx=\"12\" cy=\"12\" r=\"3\"></circle>","eyeoff":"<path d=\"M10.733 5.076a10.744 10.744 0 0 1 11.205 6.575 1 1 0 0 1 0 .696 10.747 10.747 0 0 1-1.444 2.49\"></path><path d=\"M14.084 14.158a3 3 0 0 1-4.242-4.242\"></path><path d=\"M17.479 17.499a10.75 10.75 0 0 1-15.417-5.151 1 1 0 0 1 0-.696 10.75 10.75 0 0 1 4.446-5.143\"></path><path d=\"m2 2 20 20\"></path>","logout":"<path d=\"M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4\"></path><polyline points=\"16 17 21 12 16 7\"></polyline><line x1=\"21\" x2=\"9\" y1=\"12\" y2=\"12\"></line>","play":"<polygon points=\"6 3 20 12 6 21 6 3\"></polygon>","pause":"<rect x=\"14\" y=\"4\" width=\"4\" height=\"16\" rx=\"1\"></rect><rect x=\"6\" y=\"4\" width=\"4\" height=\"16\" rx=\"1\"></rect>","stop":"<rect width=\"18\" height=\"18\" x=\"3\" y=\"3\" rx=\"2\"></rect>","open":"<path d=\"m17 11-5-5-5 5\"></path><path d=\"m17 18-5-5-5 5\"></path>","close":"<path d=\"m7 6 5 5 5-5\"></path><path d=\"m7 13 5 5 5-5\"></path>","contrast":"<circle cx=\"12\" cy=\"12\" r=\"10\"></circle><path d=\"M12 18a6 6 0 0 0 0-12v12z\"></path>","server":"<rect width=\"20\" height=\"8\" x=\"2\" y=\"2\" rx=\"2\" ry=\"2\"></rect><rect width=\"20\" height=\"8\" x=\"2\" y=\"14\" rx=\"2\" ry=\"2\"></rect><line x1=\"6\" x2=\"6.01\" y1=\"6\" y2=\"6\"></line><line x1=\"6\" x2=\"6.01\" y1=\"18\" y2=\"18\"></line>","key":"<path d=\"M2.586 17.414A2 2 0 0 0 2 18.828V21a1 1 0 0 0 1 1h3a1 1 0 0 0 1-1v-1a1 1 0 0 1 1-1h1a1 1 0 0 0 1-1v-1a1 1 0 0 1 1-1h.172a2 2 0 0 0 1.414-.586l.814-.814a6.5 6.5 0 1 0-4-4z\"></path><circle cx=\"16.5\" cy=\"7.5\" r=\".5\" fill=\"currentColor\"></circle>","link":"<path d=\"M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71\"></path><path d=\"M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71\"></path>","smartphone":"<rect width=\"14\" height=\"20\" x=\"5\" y=\"2\" rx=\"2\" ry=\"2\"></rect><path d=\"M12 18h.01\"></path>","motion":"<path d=\"M22 12h-2.48a2 2 0 0 0-1.93 1.46l-2.35 8.36a.25.25 0 0 1-.48 0L9.24 2.18a.25.25 0 0 0-.48 0l-2.35 8.36A2 2 0 0 1 4.49 12H2\"></path>","window":"<rect x=\"2\" y=\"4\" width=\"20\" height=\"16\" rx=\"2\"></rect><path d=\"M10 4v4\"></path><path d=\"M2 8h20\"></path><path d=\"M6 4v4\"></path>","battery":"<rect width=\"16\" height=\"10\" x=\"2\" y=\"7\" rx=\"2\" ry=\"2\"></rect><line x1=\"22\" x2=\"22\" y1=\"11\" y2=\"13\"></line><line x1=\"6\" x2=\"6\" y1=\"11\" y2=\"13\"></line><line x1=\"10\" x2=\"10\" y1=\"11\" y2=\"13\"></line>","bolt":"<path d=\"M4 14a1 1 0 0 1-.78-1.63l9.9-10.2a.5.5 0 0 1 .86.46l-1.92 6.02A1 1 0 0 0 13 10h7a1 1 0 0 1 .78 1.63l-9.9 10.2a.5.5 0 0 1-.86-.46l1.92-6.02A1 1 0 0 0 11 14z\"></path>","leaf":"<path d=\"M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10Z\"></path><path d=\"M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12\"></path>","shield":"<path d=\"M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z\"></path><path d=\"m9 12 2 2 4-4\"></path>","list":"<path d=\"M3 12h.01\"></path><path d=\"M3 18h.01\"></path><path d=\"M3 6h.01\"></path><path d=\"M8 12h13\"></path><path d=\"M8 18h13\"></path><path d=\"M8 6h13\"></path>","clock":"<circle cx=\"12\" cy=\"12\" r=\"10\"></circle><polyline points=\"12 6 12 12 16 14\"></polyline>"};

/* Comfort Home — a calm smart-home app for Home Assistant. */
(function () {
  'use strict';
  const VERSION = '1.8.1';
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
      'Turn on': 'Aanzetten', 'Turn off': 'Uitzetten', 'Run': 'Start',
      'Change dashboard': 'Dashboard wisselen', 'Back to Home': 'Terug naar Thuis', 'Changed just now': 'Net veranderd', 'Changed {x} ago': '{x} geleden veranderd', 'Connecting to Home Assistant…': 'Verbinden met Home Assistant…', 'Connection lost. Reconnecting…': 'Verbinding kwijt. Opnieuw verbinden…', 'Showing last known values': 'Laatst bekende waarden', 'Retry': 'Opnieuw', 'House average': 'Gemiddeld in huis', 'Tap to control all {n} air conditioners at once': 'Tik om alle {n} airco’s tegelijk te regelen', 'Per room': 'Per kamer', 'Heating': 'Verwarming', 'All air conditioners': 'Alle airco’s', 'House {t}': 'Huis {t}', 'Room temperature': 'Kamertemperatuur', 'Info': 'Info', 'Search everything': 'Zoek alles', 'Nothing found.': 'Niets gevonden.', 'Show more': 'Meer tonen', 'History': 'Geschiedenis', 'General': 'Algemeen', 'All information': 'Alle informatie', 'Device': 'Apparaat', 'Also on this device': 'Ook op dit apparaat', 'Open in Home Assistant': 'Openen in Home Assistant', 'Min': 'Min', 'Average': 'Gemiddeld', 'Max': 'Max', 'Now': 'Nu', 'No history in this period.': 'Geen geschiedenis in deze periode.', 'This entity does not exist (anymore).': 'Dit bestaat niet (meer).', 'Entity ID': 'Entiteit-ID', 'State': 'Status', 'Room': 'Kamer', 'Last changed': 'Laatst veranderd', 'Last updated': 'Laatst bijgewerkt', 'Integration': 'Integratie', 'Manufacturer': 'Merk', 'Model': 'Model', 'Firmware': 'Firmware', 'Hardware': 'Hardware', 'Yes': 'Ja', 'No': 'Nee', 'Dashboard': 'Dashboard', 'Comfort stays your start screen. Come back any time via the Comfort item in the Home Assistant menu.': 'Comfort blijft je startscherm. Je komt altijd terug via “Comfort” in het Home Assistant-menu.', 'Sensors': 'Sensoren', 'Status sensors': 'Statussensoren', 'Lights': 'Lampen', 'Switches': 'Schakelaars', 'Automations': 'Automatiseringen', 'People': 'Personen', 'Trackers': 'Trackers', 'Weather': 'Weer', 'Sun': 'Zon', 'Updates': 'Updates', 'Buttons': 'Knoppen', 'Numbers': 'Getallen', 'Selects': 'Keuzes', 'Fans': 'Ventilatoren', 'Blinds': 'Zonwering', 'Locks': 'Sloten', 'Scenes': 'Scènes', 'Scripts': 'Scripts', 'Helpers': 'Helpers', 'Cameras': 'Camera’s', 'Media': 'Media', 'Water heater': 'Warm water', 'To-do lists': 'Takenlijsten', 'Calendar': 'Agenda', 'Controls': 'Bediening', 'Set time': 'Tijden', 'Next': 'Volgende', 'New timer': 'Nieuwe tijd', 'Edit timer': 'Tijd aanpassen', 'Name': 'Naam', 'Time': 'Tijd', 'Days': 'Dagen', 'Save': 'Opslaan', 'Delete': 'Verwijderen', 'Every day': 'Elke dag', 'Weekdays': 'Werkdagen', 'Weekend': 'Weekend', 'Timers': 'Tijden', 'Other automations': 'Andere automatiseringen', 'Edit in Home Assistant': 'Bewerken in Home Assistant', 'Run now': 'Nu uitvoeren', 'No timers yet. Tap + to make one.': 'Nog geen tijden. Tik op + om er een te maken.', 'Choose devices': 'Kies apparaten', 'in {x}': 'over {x}', 'Sunrise': 'Zonsopkomst', 'Sunset': 'Zonsondergang', 'Home Assistant pages': 'Home Assistant-pagina’s', 'Overview': 'Overzicht', 'Energy': 'Energie', 'Map': 'Kaart', 'Logbook': 'Logboek', 'History': 'Geschiedenis', 'Profile': 'Profiel', 'Choose another default dashboard here': 'Kies hier een ander standaarddashboard', 'Saved': 'Opgeslagen', 'Deleted': 'Verwijderd', 'Only administrators can change timers.': 'Alleen beheerders kunnen tijden aanpassen.', 'Made in Home Assistant: you can switch it on or off here.': 'Gemaakt in Home Assistant: hier kun je hem aan- of uitzetten.', 'Search': 'Zoeken', 'Back to the normal Home Assistant screens': 'Terug naar de normale Home Assistant-schermen', 'Switch': 'Wissel', 'All': 'Alles',
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
      'Change dashboard': 'Switch world', 'Back to Home': 'Back to Base', 'House average': 'Base average', 'Per room': 'Per chamber', 'All air conditioners': 'All ice machines', 'Info': 'F3 Debug', 'Search everything': 'Search all blocks', 'Heating': 'Furnaces', 'History': 'Logs', 'Device': 'Block', 'Set time': 'Clock', 'Next': 'Next tick', 'New timer': 'New redstone clock', 'Edit timer': 'Edit clock', 'Timers': 'Redstone clocks', 'Other automations': 'Other contraptions', 'Save': 'Craft', 'Delete': 'Break', 'Choose devices': 'Pick blocks', 'Home Assistant pages': 'Other worlds', 'Saved': 'Crafted!', 'Deleted': 'Broken', 'No timers yet. Tap + to make one.': 'No clocks yet. Tap + to build one.', 'Sunrise': 'Sunrise', 'Sunset': 'Sunset'
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
  const isAC = (e) => (((S.states[e] || {}).attributes || {}).hvac_modes || []).some((x) => ['cool', 'dry', 'fan_only'].includes(x));
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
  const TABS = [['home', 'Home', 'home'], ['climate', 'Climate', 'climate'], ['devices', 'Devices', 'devices'], ['info', 'Info', 'info'], ['timers', 'Set time', 'clock'], ['settings', 'Settings', 'settings']];
  const scrollPos = {};
  function parseRoute() {
    const h = decodeURIComponent(location.hash.replace(/^#\/?/, '')); const [name, id] = h.split('/');
    if (name === 'room' && id) return { name: 'room', id, key: 'room/' + id };
    if ((name === 'climate' || name === 'info') && id) return { name, id, key: name + '/' + id };
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
    let html;
    try {
      const r = S.route.name;
      html = r === 'info' ? (S.route.id ? pInfoEnt(S.route.id) : pInfo()) : r === 'timers' ? pTimers() : r === 'climate' ? pClimate() : r === 'rooms' ? pRooms() : r === 'room' ? pRoom(S.route.id) : r === 'devices' ? pDevices() : r === 'settings' ? pSettings() : pHome();
    } catch (e) { console.error(e); html = `<div class="page" data-k="err"><div class="msg bad">${ic('alert')}<div>Something went wrong showing this page. ${esc(e.message)}</div></div></div>`; }
    morphInto($('#view'), html);
    morphInto($('#nav'), navHTML());
    morphInto($('#sheet'), S.sheet ? (S.sheet.startsWith('__') ? specialSheet(S.sheet) : sheetHTML(S.sheet)) : '');
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
    if (S.grpV != null && Date.now() - S.grpAt < 8000) return S.grpV;
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

  function svc(domain, service, data) { return C && C.authed ? C.send({ type: 'call_service', domain, service, service_data: data }).catch(() => { /* ignore */ }) : Promise.resolve(); }
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
    try { await api('POST', 'config/automation/config/' + id, cfg); S.autoCfg[id] = Object.assign({ id }, cfg); toast(t('Saved'), 'ok'); closeSheet(); setTimeout(() => loadAutos(true), 1500); }
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
