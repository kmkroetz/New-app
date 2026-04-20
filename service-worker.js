const CACHE_NAME = "kroetz-fixit-v3";

const FILES_TO_CACHE = [
  "./",
  "./index.html",
  "./manifest.json"
];

// INSTALL
self.addEventListener("install", (event) => {
  self.skipWaiting(); // force update

  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(FILES_TO_CACHE);
    })
  );
});

// ACTIVATE
self.addEventListener("activate", (event) => {
  event.waitUntil(
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

  self.clients.claim(); // take control immediately
});

// FETCH
self.addEventListener("fetch", (event) => {
  event.respondWith(
    fetch(event.request).catch(() => caches.match(event.request))
  );
});
