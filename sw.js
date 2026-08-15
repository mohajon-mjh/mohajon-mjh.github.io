/* Mohajon-MJH SW v2026-08-15 : PASS-THROUGH (no cache) - always fresh like incognito */
self.addEventListener("install",function(e){self.skipWaiting();});
self.addEventListener("activate",function(e){
 e.waitUntil((async function(){
  try{
   var keys=await caches.keys();
   for(var i=0;i<keys.length;i++){await caches.delete(keys[i]);}
  }catch(err){}
  await self.clients.claim();
 })());
});
/* No fetch listener = browser loads everything from network, exactly like incognito */
