self.addEventListener('install', (e) => {
  e.waitUntil(
    caches.open('sheep-game-store').then((cache) => {
      return cache.addAll(['index.html', 'style.css', 'sketch.js']);
    })
  );
});

self.addEventListener('fetch', (e) => {
  e.respondWith(
    caches.match(e.request).then((response) => {
      return response || fetch(e.request);
    })
  );
});
