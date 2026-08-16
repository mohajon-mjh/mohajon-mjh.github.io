/* mjh-sw-v4 : stall-proof smart cache */
var CACHE="mjh-v4";
self.addEventListener("install",function(e){self.skipWaiting();});
self.addEventListener("activate",function(e){
 e.waitUntil((async function(){
  var ks=await caches.keys();
  for(var i=0;i<ks.length;i++){if(ks[i]!==CACHE)await caches.delete(ks[i]);}
  await self.clients.claim();
 })());
});
function withTimeout(p,ms){return Promise.race([p,new Promise(function(_,rej){setTimeout(function(){rej(new Error("timeout"));},ms);})]);}
self.addEventListener("fetch",function(e){
 var req=e.request;
 if(req.method!=="GET")return;
 var url=new URL(req.url);
 if(url.origin!==self.location.origin)return;
 var isCode=req.mode==="navigate"||/\.(html|js|css)$/.test(url.pathname);
 if(isCode){
  e.respondWith((async function(){
   var cache=await caches.open(CACHE);
   try{
    var net=await withTimeout(fetch(req,{cache:"no-store"}),6000);
    if(net&&net.status===200){cache.put(req,net.clone());return net;}
    throw new Error("bad");
   }catch(err){
    var hit=await cache.match(req);
    if(hit)return hit;
    throw err;
   }
  })());
  return;
 }
 e.respondWith((async function(){
  var cache=await caches.open(CACHE);
  var hit=await cache.match(req);
  var fet=fetch(req).then(function(net){if(net&&net.status===200)cache.put(req,net.clone());return net;}).catch(function(){return hit;});
  return hit||fet;
 })());
});
