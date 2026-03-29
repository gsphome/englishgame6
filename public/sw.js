/**
 * FluentFlow Service Worker
 * Strategy: Network-first with Cache API fallback for offline mode.
 * Hashed assets use cache-first with network fallback.
 *
 * On HTML navigation: after caching the fresh HTML, pre-caches all app chunks
 * from asset-manifest.json. This ensures lazy-loaded chunks are available
 * offline even after a new deploy changes the content hashes.
 */

const CACHE_NAME = 'fluentflow-v2';

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

/**
 * Fetch the asset manifest and pre-cache all missing chunks.
 * Also cleans up stale assets from previous builds.
 */
async function precacheFromManifest(baseUrl) {
  const cache = await caches.open(CACHE_NAME);
  const assetUrls = new Set();

  // 1. Parse current HTML from cache to get entry points
  try {
    const htmlRes = await cache.match(new Request(baseUrl));
    if (htmlRes) {
      const html = await htmlRes.text();
      const srcPattern = /(?:src|href)=["']([^"']*\/assets\/[^"']+)["']/g;
      let match;
      while ((match = srcPattern.exec(html)) !== null) {
        const path = match[1];
        assetUrls.add(path.startsWith('http') ? path : new URL(path, baseUrl).href);
      }
    }
  } catch {
    // Continue with manifest only
  }

  // 2. Fetch asset-manifest.json for ALL chunks (including lazy-loaded)
  try {
    const manifestUrl = new URL('asset-manifest.json', baseUrl).href;
    const manifestRes = await fetch(manifestUrl);
    if (manifestRes.ok) {
      const assets = await manifestRes.json();
      for (const asset of assets) {
        assetUrls.add(new URL(asset, baseUrl).href);
      }
      await cache.put(manifestUrl, manifestRes.clone());
    }
  } catch {
    // Manifest unavailable
  }

  if (assetUrls.size === 0) return;

  // 3. Fetch missing assets in parallel (batches of 6)
  const missing = [];
  for (const url of assetUrls) {
    if (!(await cache.match(url))) missing.push(url);
  }

  if (missing.length > 0) {
    const batchSize = 6;
    for (let i = 0; i < missing.length; i += batchSize) {
      await Promise.allSettled(
        missing.slice(i, i + batchSize).map(async url => {
          const res = await fetch(url);
          if (res.ok) await cache.put(url, res);
        })
      );
    }
  }

  // 4. Clean up stale hashed assets not in current build
  try {
    const keys = await cache.keys();
    for (const req of keys) {
      const pathname = new URL(req.url).pathname;
      if (
        pathname.includes('/assets/') &&
        /[-.][\da-f]{8,}\./.test(pathname) &&
        !assetUrls.has(req.url)
      ) {
        await cache.delete(req);
      }
    }
  } catch {
    // Non-critical
  }
}

self.addEventListener('fetch', event => {
  const url = new URL(event.request.url);

  // Only intercept same-origin GET requests
  if (url.origin !== self.location.origin) return;
  if (event.request.method !== 'GET') return;

  const isDataJson = url.pathname.includes('/data/') && url.pathname.endsWith('.json');
  const isHtml =
    url.pathname.endsWith('.html') ||
    url.pathname === '/' ||
    url.pathname.endsWith('/englishgame6/') ||
    url.pathname === '/englishgame6';
  const isAsset = /\.(js|css|woff2?|ttf|svg|png|ico|webp)$/.test(url.pathname);

  if (!isDataJson && !isHtml && !isAsset) return;

  // Hashed assets (contain hash in filename): cache-first (immutable)
  if (isAsset && /[-.][\da-f]{8,}\./.test(url.pathname)) {
    event.respondWith(
      caches.open(CACHE_NAME).then(async cache => {
        const cached = await cache.match(event.request);
        if (cached) return cached;
        try {
          const response = await fetch(event.request);
          if (response.ok) cache.put(event.request, response.clone());
          return response;
        } catch {
          return new Response('', { status: 503, statusText: 'Asset unavailable offline' });
        }
      })
    );
    return;
  }

  // HTML: network-first with background precaching of all app chunks
  if (isHtml) {
    const baseUrl = url.pathname.endsWith('/')
      ? url.href
      : url.href.substring(0, url.href.lastIndexOf('/') + 1);

    // Create a deferred promise for precaching that waitUntil can track
    let triggerPrecache;
    const precacheReady = new Promise(resolve => { triggerPrecache = resolve; });
    // waitUntil keeps the SW alive until precaching completes
    event.waitUntil(precacheReady.then(() => precacheFromManifest(baseUrl).catch(() => {})));

    event.respondWith(
      caches.open(CACHE_NAME).then(async cache => {
        try {
          const response = await fetch(event.request);
          if (response.ok) {
            await cache.put(event.request, response.clone());
            // Signal that HTML is cached, precaching can start
            triggerPrecache();
          } else {
            triggerPrecache();
          }
          return response;
        } catch {
          triggerPrecache();
          const cached = await cache.match(event.request);
          if (cached) return cached;
          return new Response('App not available offline', { status: 503 });
        }
      })
    );
    return;
  }

  // JSON data, unhashed assets: network-first with cache fallback
  event.respondWith(
    caches.open(CACHE_NAME).then(async cache => {
      try {
        const response = await fetch(event.request);
        if (response.ok) {
          cache.put(event.request, response.clone());
        }
        return response;
      } catch {
        const cached = await cache.match(event.request);
        if (cached) return cached;

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
