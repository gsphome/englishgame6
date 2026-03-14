/**
 * FluentFlow Service Worker
 * Strategy: Network-first with Cache API fallback for offline mode.
 * Only JSON data files and HTML are intercepted — JS/CSS use browser HTTP cache.
 */

const CACHE_NAME = 'fluentflow-v1';

// Activate immediately and claim all clients
self.addEventListener('install', event => {
  event.waitUntil(self.skipWaiting());
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches
      .keys()
      .then(keys =>
        Promise.all(
          keys
            .filter(k => k.startsWith('fluentflow-') && k !== CACHE_NAME)
            .map(k => caches.delete(k))
        )
      )
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', event => {
  const url = new URL(event.request.url);

  // Only intercept same-origin JSON data files and HTML
  if (url.origin !== self.location.origin) return;

  const isDataJson = url.pathname.includes('/data/') && url.pathname.endsWith('.json');
  const isHtml =
    url.pathname.endsWith('.html') ||
    url.pathname === '/' ||
    url.pathname.endsWith('/englishgame6/') ||
    url.pathname === '/englishgame6';

  if (!isDataJson && !isHtml) return;

  event.respondWith(
    caches.open(CACHE_NAME).then(async cache => {
      try {
        // Online: fetch from network, cache the response
        const response = await fetch(event.request);
        if (response.ok) {
          cache.put(event.request, response.clone());
        }
        return response;
      } catch {
        // Offline: serve from cache
        const cached = await cache.match(event.request);
        if (cached) return cached;

        // Not in cache
        if (isDataJson) {
          return new Response(JSON.stringify({ error: 'MODULE_NOT_AVAILABLE_OFFLINE' }), {
            status: 503,
            headers: { 'Content-Type': 'application/json' },
          });
        }
        return new Response('App not available offline', { status: 503 });
      }
    })
  );
});
