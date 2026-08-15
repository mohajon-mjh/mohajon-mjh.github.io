/* Mohajon-MJH SW v3 : smart cache - fresh code + fast data */
var CACHE="mjh-v3";
self.addEventListener("install",function(e){self.skipWaiting();});
self.addEventListener("activate",function(e){
 e.waitUntil((async function(){
  try{var keys=await caches.keys();for(var i=0;i<keys.length;i++){if(keys[i]!==CACHE)await caches.delete(keys[i]);}}catch(err){}
  await self.clients.claim();
 })());
});
self.addEventListener("fetch",function(e){
 var req=e.request;
 if(req.method!=="GET")return;
 var url=new URL(req.url);
 if(url.origin!==self.location.origin)return;
 if(req.mode==="navigate"||/\.(html|js|css)$/.test(url.pathname)){
  e.respondWith((async function(){
   try{
    var net=await fetch(req,{cache:"no-store"});
    if(net&&net.status===200){var cp=net.clone();caches.open(CACHE).then(function(c){c.put(req,cp);});}
    return net;
   }catch(err){
    var hit=await caches.match(req);
    if(hit)return hit;
    throw err;
   }
  })());
  return;
 }
 e.respondWith((async function(){
  var hit=await caches.match(req);
  var fet=fetch(req).then(function(net){
   if(net&&net.status===200){var cp=net.clone();caches.open(CACHE).then(function(c){c.put(req,cp);});}
   return net;
  }).catch(function(){return hit;});
  return hit||fet;
 })());
});
