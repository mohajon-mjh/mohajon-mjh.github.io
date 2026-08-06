const CACHE = 'mjh-v85';
const ASSETS = [
  '/assets/images/logo.png',
  '/assets/icons-app/icon-192.png',
  '/assets/icons-app/icon-512.png',
  '/manifest.json'
];

self.addEventListener('message', e => {
  if (e.data && e.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});

self.addEventListener('install', e => {
  e.waitUntil(
    caches.open(CACHE).then(c => c.addAll(ASSETS))
  );
  self.skipWaiting();
});

self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)))
    )
  );
  self.clients.claim();
});

self.addEventListener('fetch', e => {
  const req = e.request;

  // HTML/navigation request => সবসময় আগে নেটওয়ার্ক থেকে নতুন ভার্সন আনার চেষ্টা
  if (req.mode === 'navigate' || (req.method === 'GET' && req.headers.get('accept')?.includes('text/html'))) {
    e.respondWith(
      fetch(req, { cache: 'no-store' })
        .then(res => {
          const resClone = res.clone();
          caches.open(CACHE).then(c => c.put(req, resClone));
          return res;
        })
        .catch(() => caches.match(req))
    );
    return;
  }

  // বাকি সব static asset (css/js/images) => network-first, অফলাইনে ক্যাশ
  e.respondWith(
    fetch(req, { cache: 'no-store' })
      .then(res => {
        const resClone = res.clone();
        caches.open(CACHE).then(c => c.put(req, resClone));
        return res;
      })
      .catch(() => caches.match(req))
  );
});
