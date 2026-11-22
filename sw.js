/* Comfort Home service worker.
   - Caches only the app's own files, so the app opens even without internet.
   - Network first: when online you always get the newest version you uploaded, no version bump needed.
   - Home Assistant traffic (WebSocket) is never touched or cached. */
const CACHE = 'comfort-home-v1.4.0';
const SHELL = ['./', 'index.html', 'styles.css', 'app.js', 'icons.js', 'demo-ha.js', 'manifest.json',
  'icons/icon-192.png', 'icons/icon-512.png', 'icons/maskable-512.png', 'icons/apple-touch-icon.png', 'icons/favicon-32.png'];
const SCOPE = new URL('./', self.location).pathname;

self.addEventListener('install', (e) => {
  e.waitUntil(caches.open(CACHE).then((c) => c.addAll(SHELL.map((u) => new Request(u, { cache: 'reload' })))).then(() => self.skipWaiting()));
});
self.addEventListener('activate', (e) => {
  e.waitUntil(caches.keys().then((ks) => Promise.all(ks.filter((k) => k.startsWith('comfort-home-') && k !== CACHE).map((k) => caches.delete(k)))).then(() => self.clients.claim()));
});
self.addEventListener('fetch', (e) => {
  const req = e.request; const url = new URL(req.url);
  if (req.method !== 'GET' || url.origin !== self.location.origin || !url.pathname.startsWith(SCOPE)) return;
  e.respondWith(networkFirst(req, e));
});
async function networkFirst(req, e) {
  const cache = await caches.open(CACHE);
  const net = fetch(req, { cache: 'no-cache' }).then((res) => {
    if (res && res.ok && res.type === 'basic') { const copy = res.clone(); e.waitUntil(cache.put(req, copy)); }
    return res;
  });
  const timeout = new Promise((r) => setTimeout(r, 3500, null));
  try {
    const res = await Promise.race([net, timeout]);
    if (res) return res;
  } catch (err) { /* offline */ }
  const hit = await cache.match(req, { ignoreSearch: true }) || (req.mode === 'navigate' ? await cache.match('index.html') : null);
  if (hit) return hit;
  return net.catch(() => new Response('Offline', { status: 503, headers: { 'content-type': 'text/plain' } }));
}
