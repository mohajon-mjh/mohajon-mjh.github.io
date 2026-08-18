/* mjh-sw-v6 : no cache */
self.addEventListener("install",function(e){self.skipWaiting();});
self.addEventListener("activate",function(e){
 e.waitUntil((async function(){
  var ks=await caches.keys();
  for(var i=0;i<ks.length;i++){await caches.delete(ks[i]);}
  await self.clients.claim();
 })());
});
self.addEventListener("fetch",function(e){
 e.respondWith(fetch(e.request));
});
