const CACHE = 'mjh-final-v1';

// Precache all critical files on install
self.addEventListener('install', e => {
  e.waitUntil(
    caches.open(CACHE).then(cache => 
      cache.addAll([
        '/',
        '/index.html',
        '/style.css',
        '/shared-header.css',
        '/product-card-upgrade.css',
        '/css/global-menu.css'
      ])
    )
  );
  self.skipWaiting();
});

// Activate: clear old caches
self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys().then(keys => 
      Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)))
    )
  );
  self.clients.claim();
});

// Fetch: Network-first with cache fallback
self.addEventListener('fetch', e => {
  const req = e.request;
  const url = req.url;
  
  // Firebase API: Always network (fresh data)
  if (url.includes('firebaseio.com') || url.includes('googleapis.com')) {
    e.respondWith(fetch(req));
    return;
  }
  
  // Static assets (CSS/JS/images): Cache-first
  if (url.match(/\.(css|js|png|jpg|jpeg|gif|svg|ico|woff2?|ttf|webp)$/)) {
    e.respondWith(
      caches.match(req).then(cached => 
        cached || fetch(req).then(res => {
          if (res.ok) {
            const clone = res.clone();
            caches.open(CACHE).then(cache => cache.put(req, clone));
          }
          return res;
        })
      )
    );
    return;
  }
  
  // HTML pages: Network-first with cache fallback
  if (req.mode === 'navigate' || req.headers.get('accept')?.includes('text/html')) {
    e.respondWith(
      fetch(req).then(res => {
        const clone = res.clone();
        caches.open(CACHE).then(cache => cache.put(req, clone));
        return res;
      }).catch(() => caches.match(req))
    );
    return;
  }
  
  // Everything else: Network-first
  e.respondWith(
    fetch(req).catch(() => caches.match(req))
  );
});

// Listen for skip waiting
self.addEventListener('message', e => {
  if (e.data?.type === 'SKIP_WAITING') self.skipWaiting();
});
