/* Kalp Shayari — Service Worker
 * Bump CACHE_VERSION whenever you change ANY file to force refresh.
 */
const CACHE_VERSION = 'kalp-v3';
const CACHE_NAME = 'kalp-cache-' + CACHE_VERSION;

/* Everything the site needs to work offline + load instantly */
const CORE_ASSETS = [
  './',
  './index.html',
  './others.html',
  './fav.html',
  './about.html',
  './style.css',
  './script.js',
  './data.js',
  './storage.js',
  './shayari.png',
  './profile.png',
  './mybanner.png',
  './favicon.ico',
  './robots.txt',
  './sitemap.xml'
];

/* Install — pre-cache all core assets */
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return Promise.all(
        CORE_ASSETS.map((url) =>
          cache.add(url).catch((err) => {
            // Don't fail install if an optional asset (e.g. mybanner.png) is missing
            console.warn('[SW] Skipped:', url, err);
          })
        )
      );
    }).then(() => self.skipWaiting())
  );
});

/* Activate — delete old caches */
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(
        keys
          .filter((key) => key.startsWith('kalp-cache-') && key !== CACHE_NAME)
          .map((key) => caches.delete(key))
      )
    ).then(() => self.clients.claim())
  );
});

/* Fetch — Cache-first for same-origin, network-first fallback */
self.addEventListener('fetch', (event) => {
  const req = event.request;

  // Only handle GET requests
  if (req.method !== 'GET') return;

  const url = new URL(req.url);

  // Skip cross-origin (fonts, external links) — let browser handle normally
  if (url.origin !== self.location.origin) return;

  event.respondWith(
    caches.match(req).then((cached) => {
      if (cached) {
        // Serve from cache, refresh in background
        event.waitUntil(
          fetch(req).then((res) => {
            if (res && res.status === 200) {
              return caches.open(CACHE_NAME).then((cache) => cache.put(req, res.clone()));
            }
          }).catch(() => { /* offline — ignore */ })
        );
        return cached;
      }

      // Not cached — fetch from network, then cache
      return fetch(req).then((res) => {
        if (!res || res.status !== 200 || res.type === 'opaque') return res;

        const copy = res.clone();
        caches.open(CACHE_NAME).then((cache) => cache.put(req, copy));
        return res;
      }).catch(() => {
        // Offline fallback: if HTML navigation fails, serve cached index
        if (req.mode === 'navigate') {
          return caches.match('./index.html');
        }
        return new Response('Offline', { status: 503, statusText: 'Offline' });
      });
    })
  );
});

/* Allow page to trigger immediate update */
self.addEventListener('message', (event) => {
  if (event.data === 'SKIP_WAITING') self.skipWaiting();
});