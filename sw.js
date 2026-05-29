const CACHE_NAME = 'lb-study-tracker-v15';
const STATIC_ASSETS = [
  './',
  './index.html',
  './manifest.json',
  './lb-icon-192.png',
  './lb-icon-512.png',
  './logo.png'
];

const IMMUTABLE_ASSETS = [
  'https://unpkg.com/react@18/umd/react.production.min.js',
  'https://unpkg.com/react-dom@18/umd/react-dom.production.min.js',
  'https://unpkg.com/@babel/standalone/babel.min.js',
  'https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.2/gsap.min.js',
  'https://cdn.jsdelivr.net/npm/chart.js',
  'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2',
  'https://fonts.googleapis.com/css2?family=Outfit:wght@400;600;700;800&family=Inter:wght@300;400;500;600;700&display=swap'
];

self.addEventListener('install', (e) => {
  e.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      // Pre-cache core assets for instant loading
      return cache.addAll([...STATIC_ASSETS, ...IMMUTABLE_ASSETS]).catch((err) => {
        console.warn('Error pre-caching assets, proceeding anyway:', err);
      });
    })
  );
});

self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.map((key) => {
          if (key !== CACHE_NAME) {
            return caches.delete(key);
          }
        })
      );
    })
  );
  return self.clients.claim();
});

self.addEventListener('fetch', (e) => {
  // Only handle HTTP/HTTPS requests (avoid Chrome Extension schemes, etc.)
  if (!e.request.url.startsWith('http')) return;

  const url = new URL(e.request.url);

  // 1. Cache-First for static external CDN resources (immutable library files)
  if (
    IMMUTABLE_ASSETS.some(asset => e.request.url.startsWith(asset)) ||
    url.hostname.includes('unpkg.com') ||
    url.hostname.includes('cdnjs.cloudflare.com') ||
    url.hostname.includes('jsdelivr.net') ||
    url.hostname.includes('fonts.gstatic.com')
  ) {
    e.respondWith(
      caches.match(e.request).then((cachedResponse) => {
        if (cachedResponse) return cachedResponse;

        return fetch(e.request).then((networkResponse) => {
          if (networkResponse && networkResponse.status === 200) {
            const responseToCache = networkResponse.clone();
            caches.open(CACHE_NAME).then((cache) => {
              cache.put(e.request, responseToCache);
            });
          }
          return networkResponse;
        });
      })
    );
    return;
  }

  // 2. Only intercept local origin requests (static assets) for Stale-While-Revalidate
  if (url.origin === self.location.origin) {
    e.respondWith(
      caches.match(e.request).then((cachedResponse) => {
        const fetchPromise = fetch(e.request).then((networkResponse) => {
          if (networkResponse && networkResponse.status === 200 && e.request.method === 'GET') {
            const responseToCache = networkResponse.clone();
            caches.open(CACHE_NAME).then((cache) => {
              cache.put(e.request, responseToCache);
            });
          }
          return networkResponse;
        }).catch(() => {
          // Fall back quietly if network fails
        });

        return cachedResponse || fetchPromise;
      })
    );
    return;
  }
});

self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});
