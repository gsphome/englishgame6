/**
 * FluentFlow Service Worker
 * Estrategia: Network-first con fallback a Cache API para modo offline
 */

const CACHE_NAME = 'fluentflow-offline-v1';

// Instalación: no pre-cachear nada (se hace desde la UI)
self.addEventListener('install', (event) => {
  self.skipWaiting();
});

// Activación: limpiar caches antiguas
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames
          .filter((name) => name.startsWith('fluentflow-') && name !== CACHE_NAME)
          .map((name) => caches.delete(name))
      );
    }).then(() => self.clients.claim())
  );
});

// Fetch: Network-first, fallback a cache
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Solo interceptar peticiones JSON de data/
  if (!url.pathname.includes('/data/') && !url.pathname.includes('learningModules.json')) {
    return;
  }

  event.respondWith(
    fetch(request)
      .then((response) => {
        // Si hay red, devolver respuesta (ya está en cache si se descargó desde UI)
        return response;
      })
      .catch(() => {
        // Sin red: buscar en cache
        return caches.match(request).then((cachedResponse) => {
          if (cachedResponse) {
            return cachedResponse;
          }
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
