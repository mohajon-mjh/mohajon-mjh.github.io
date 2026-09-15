const CACHE = "mjh-v3";
const PRECACHE = ["/", "/index.html", "/home-unified.js"];

self.addEventListener("install", function(e) {
  self.skipWaiting();
  e.waitUntil(caches.open(CACHE).then(cache => cache.addAll(PRECACHE)).catch(() => {}));
});

self.addEventListener("activate", function(e) {
  e.waitUntil(caches.keys().then(ks => Promise.all(
    ks.filter(k => k !== CACHE).map(k => caches.delete(k))
  )).then(() => clients.claim()));
});

self.addEventListener("fetch", function(e) {
  const url = e.request.url;
  
  // Firebase API - network first, cache fallback
  if (url.includes("firebaseio.com")) {
    e.respondWith(
      fetch(e.request).then(response => {
        const clone = response.clone();
        caches.open(CACHE).then(cache => cache.put(e.request, clone)).catch(() => {});
        return response;
      }).catch(() => caches.match(e.request))
    );
    return;
  }
  
  // Static files - cache first
  e.respondWith(
    caches.match(e.request).then(cached => cached || fetch(e.request))
  );
});
