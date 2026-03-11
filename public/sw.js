/**
 * FluentFlow Service Worker
 * Estrategia: Network-first con fallback a Cache API para modo offline
 */

const CACHE_NAME = 'fluentflow-offline-v1';

// Instalación: no pre-cachear nada (se hace desde la UI)
self.addEventListener('install', (event) => {
  console.log('[SW] Installing...');
  self.skipWaiting();
});

// Activación: limpiar caches antiguas
self.addEventListener('activate', (event) => {
  console.log('[SW] Activating...');
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames
          .filter((name) => name.startsWith('fluentflow-') && name !== CACHE_NAME)
          .map((name) => {
            console.log('[SW] Deleting old cache:', name);
            return caches.delete(name);
          })
      );
    }).then(() => {
      console.log('[SW] Claiming clients...');
      return self.clients.claim();
    })
  );
});

// Fetch: Network-first, fallback a cache
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Log TODAS las peticiones para debug
  if (url.pathname.includes('englishgame6')) {
    console.log('[SW] Fetch event:', url.pathname);
  }

  // Interceptar:
  // 1. JSON de data/
  // 2. JavaScript chunks (.js)
  // 3. CSS chunks (.css)
  const shouldIntercept =
    url.pathname.includes('/data/') ||
    url.pathname.includes('learningModules.json') ||
    url.pathname.includes('/assets/') ||
    url.pathname.endsWith('.js') ||
    url.pathname.endsWith('.css');

  if (!shouldIntercept) {
    return;
  }

  console.log('[SW] Intercepting:', request.url);

  event.respondWith(
    caches.open(CACHE_NAME).then((cache) => {
      return fetch(request)
        .then((response) => {
          // Si hay red, cachear la respuesta para uso futuro
          if (response.ok) {
            // Solo cachear assets estáticos (JS, CSS, JSON)
            if (
              url.pathname.includes('/assets/') ||
              url.pathname.includes('/data/') ||
              url.pathname.endsWith('.js') ||
              url.pathname.endsWith('.css') ||
              url.pathname.endsWith('.json')
            ) {
              cache.put(request, response.clone());
              console.log('[SW] Cached for future:', url.pathname);
            }
          }
          console.log('[SW] Network success:', url.pathname);
          return response;
        })
        .catch(async () => {
          // Sin red: buscar en cache (ahora las URLs coinciden exactamente)
          console.log('[SW] Network failed, checking cache:', request.url);
          
          const cachedResponse = await cache.match(request);
          
          if (cachedResponse) {
            console.log('[SW] ✅ Serving from cache:', url.pathname);
            return cachedResponse;
          }
          
          // Debug: mostrar qué hay en cache
          const keys = await cache.keys();
          console.log('[SW] ❌ Not in cache. Available URLs:', keys.length);
          console.log('[SW] Looking for:', request.url);
          keys.slice(0, 5).forEach(key => console.log('  Available:', key.url));
          
          // No hay cache: devolver error offline
          return new Response(
            JSON.stringify({ error: 'MODULE_NOT_AVAILABLE_OFFLINE' }),
            {
              status: 503,
              statusText: 'Service Unavailable',
              headers: { 'Content-Type': 'application/json' }
            }
          );
        });
    })
  );
});
