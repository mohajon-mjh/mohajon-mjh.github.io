const CACHE="mjh-fresh-v1";
self.addEventListener("install",e=>{self.skipWaiting();});
self.addEventListener("activate",e=>{e.waitUntil(caches.keys().then(ks=>Promise.all(ks.map(k=>caches.delete(k)))).then(()=>self.clients.claim()));});
self.addEventListener("fetch",e=>{
 e.respondWith(
  fetch(e.request).then(r=>{
   const c=r.clone();caches.open(CACHE).then(cc=>cc.put(e.request,c));return r;
  }).catch(()=>caches.match(e.request))
 );
});
