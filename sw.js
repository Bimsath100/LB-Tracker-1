self.addEventListener('install', (e) => {
  self.skipWaiting();
});

self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(keys.map((k) => caches.delete(k)));
    })
  );
  return self.clients.claim();
});

self.addEventListener('fetch', (e) => {
  // Network first strategy to ensure latest updates
  e.respondWith(
    fetch(e.request).catch(() => caches.match(e.request))
  );
});
