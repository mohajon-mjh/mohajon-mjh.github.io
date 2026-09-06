/* MJH Admin Extras v1 - Trash + GitHub Sync + Search Bar + BOGO */
(function(){
var DB="https://mohajon-mjh-default-rtdb.firebaseio.com";
function j(p){return fetch(DB+"/"+p+".json").then(function(r){return r.json();});}
function patch(up){return fetch(DB+"/.json",{method:"PATCH",headers:{"Content-Type":"application/json"},body:JSON.stringify(up)});}

/* ---------- TRASH ↩️ ---------- */
var Trash={
 save:function(kind,label,data){
  var key=Date.now()+"_"+Math.random().toString(36).slice(2,7);
  var item={key:key,kind:kind,label:label,at:Date.now(),data:data};
  try{var L=JSON.parse(localStorage.getItem("mjhTrash")||"[]");L.unshift(item);L=L.slice(0,50);localStorage.setItem("mjhTrash",JSON.stringify(L));}catch(e){}
  return patch((function(){var o={};o["settings/trash/"+key]=item;return o;})());
 },
 list:function(cb){j("settings/trash").then(function(d){var a=[];for(var k in(d||{}))a.push(d[k]);a.sort(function(x,y){return(y.at||0)-(x.at||0);});cb(a);}).catch(function(){cb([]);});},
 restore:function(key,cb){
  j("settings/trash/"+key).then(function(it){
   if(!it){cb(false);return;}
   var up={};
   if(it.data&&it.data.full){for(var id in it.data.full){up["products/"+id]=it.data.full[id];}}
   if(it.data&&it.data.links){for(var l in it.data.links){up[l]=it.data.links[l];}}
   up["settings/trash/"+key]=null;
   patch(up).then(function(){try{var L=JSON.parse(localStorage.getItem("mjhTrash")||"[]").filter(function(x){return x.key!==key;});localStorage.setItem("mjhTrash",JSON.stringify(L));}catch(e){}cb(true);});
  });
 }
};
window.MJHTrash=Trash;

/* ডিলিট বাটনের আগে auto snapshot */
function collectIds(){
 var ids=[];
 var ta=document.querySelector("textarea");
 if(ta&&ta.value){ta.value.split(/[\n,]+/).forEach(function(x){x=x.trim().split(/\s/)[0];if(/^[-A-Za-z0-9_]{4,}$/.test(x))ids.push(x);});}
 if(!ids.length){document.querySelectorAll(".pChk:checked,.aChk:checked").forEach(function(c){var id=c.getAttribute("data-id")||c.value||(c.closest("[data-id]")||{}).dataset&&c.closest("[data-id]").dataset.id||"";if(id)ids.push(id);});}
 return ids;
}
document.addEventListener("click",function(e){
 var b=e.target.closest?e.target.closest("button"):null;
 if(!b)return;
 var t=(b.textContent||"");
 if(/(🗑️|ডিলিট|রিমুভ|Delete)/.test(t)){
  var ids=collectIds();
  if(!ids.length)return;
  var full={},links={},done=0;
  ids.forEach(function(id){
   j("products/"+id).then(function(p){if(p)full[id]=p;done++;if(done===ids.length){Trash.save("products","🗑️ "+ids.length+" products: "+ids.slice(0,3).join(",")+"...",{full:full,links:links});}}).catch(function(){done++;});
  });
 }
},true);

/* ---------- GITHUB SYNC 🐙 ---------- */
var Git={
 token:function(){return localStorage.getItem("mjh_github_token")||"";},
 setToken:function(t){localStorage.setItem("mjh_github_token",t);},
 api:function(path,method,body){
  var tk=Git.token();if(!tk)return Promise.reject(new Error("GitHub token সেট করুন (🧰 panel)"));
  return fetch("https://api.github.com/repos/mohajon-mjh/mohajon-mjh.github.io/contents/"+path,{method:method,headers:{Authorization:"Bearer "+tk,Accept:"application/vnd.github+json"},body:body?JSON.stringify(body):undefined}).then(function(r){if(!r.ok)return r.text().then(function(x){throw new Error("GitHub: "+r.status+" "+x.slice(0,80));});return r.json();});
 },
 put:function(path,content,msg){
  var enc=btoa(unescape(encodeURIComponent(content)));
  return Git.api(path,"GET").then(function(cur){return Git.api(path,"PUT",{message:msg,content:enc,sha:cur.sha,branch:"main"});}).catch(function(e){return Git.api(path,"PUT",{message:msg,content:enc,branch:"main"});});
 },
 syncSnapshots:function(){
  return Promise.all([j("products"),j("settings")]).then(function(rs){
   var P=rs[0]||{},S=rs[1]||{},mini={};
   for(var id in P){var p=P[id]||{};mini[id]={title:p.title||p.name,price:p.price||0,oldPrice:p.oldPrice||0,main:(p.images&&p.images.main)||""};}
   return Git.put("data/products-mini.json",JSON.stringify(mini),"auto: admin snapshot sync").then(function(){return Git.put("data/settings.json",JSON.stringify(S),"auto: admin settings sync");});
  });
 }
};
window.MJHGit=Git;

/* ---------- 🧰 Admin Tools Panel ---------- */
function toolsPanel(){
 if(document.getElementById("mjhTools"))return;
 var p=document.createElement("div");p.id="mjhTools";
 p.style.cssText="display:none;position:fixed;right:10px;bottom:70px;z-index:3000;background:#0f172a;border:2px solid #f39c12;border-radius:12px;padding:14px;width:300px;max-height:70vh;overflow:auto;color:#fff";
 p.innerHTML='<b style="color:#f39c12">🧰 Admin Tools</b><hr style="border-color:#333">'+
 '<b>🐙 GitHub Token:</b><br><input id="gtTok" placeholder="ghp_..." style="width:100%;padding:6px;margin:4px 0;border-radius:6px;border:1px solid #444;background:#1e293b;color:#fff"><button id="gtSave" style="background:#2563eb;color:#fff;border:none;padding:6px 12px;border-radius:6px;cursor:pointer">Token Save</button> <button id="gtSync" style="background:#16a34a;color:#fff;border:none;padding:6px 12px;border-radius:6px;cursor:pointer">☁️→GitHub Sync</button><span id="gtSt"></span><hr style="border-color:#333">'+
 '<b>↩️ Trash (ডিলিট করা পণ্য):</b> <button id="gtRefresh" style="background:#333;color:#fff;border:none;padding:4px 8px;border-radius:6px;cursor:pointer">🔄</button><div id="gtList" style="margin-top:6px"></div>';
 document.body.appendChild(p);
 document.getElementById("gtSave").onclick=function(){Git.setToken(document.getElementById("gtTok").value.trim());document.getElementById("gtSt").textContent="✅ saved";};
 document.getElementById("gtSync").onclick=function(){var st=document.getElementById("gtSt");st.textContent="⏳...";Git.syncSnapshots().then(function(){st.textContent="✅ GitHub synced";}).catch(function(e){st.textContent="❌ "+e.message;});};
 document.getElementById("gtRefresh").onclick=loadTrash;
 loadTrash();
 function loadTrash(){
  Trash.list(function(arr){
   var el=document.getElementById("gtList");
   if(!arr.length){el.innerHTML='<small style="color:#888">Trash খালি</small>';return;}
   el.innerHTML=arr.slice(0,15).map(function(it){return '<div style="background:#1e293b;border-radius:8px;padding:6px;margin:4px 0;font-size:12px">'+new Date(it.at).toLocaleString()+'<br>'+it.label+'<br><button data-k="'+it.key+'" class="gtR" style="background:#f39c12;color:#111;border:none;padding:4px 10px;border-radius:6px;font-weight:700;cursor:pointer">↩️ Restore</button></div>';}).join("");
   el.querySelectorAll(".gtR").forEach(function(b){b.onclick=function(){Trash.restore(b.getAttribute("data-k"),function(ok){loadTrash();alert(ok?"✅ Restore হয়েছে!":"❌ পাওয়া যায়নি");});};});
  });
 }
}
var fb=document.createElement("button");
fb.textContent="🧰";
fb.style.cssText="position:fixed;right:10px;bottom:14px;z-index:3000;width:52px;height:52px;border-radius:50%;background:#f39c12;border:none;font-size:22px;cursor:pointer;box-shadow:0 4px 12px rgba(0,0,0,.5)";
fb.onclick=function(){var p=document.getElementById("mjhTools");if(p){p.style.display=p.style.display==="none"?"block":"none";if(p.style.display==="block")document.getElementById("gtRefresh").click();}else{toolsPanel();document.getElementById("mjhTools").style.display="block";}};
if(/(admin|home-products|category-products|edit-product|upload-product)/.test(location.pathname))document.body.appendChild(fb);

/* ---------- 🔍 Search + All Products Bar ---------- */
if(/(index|product-details|cart|category|home-products)\.html|^\/$|^\/index/.test(location.pathname)||location.pathname==="/"){
 var bar=document.createElement("div");bar.id="mjhAdminBar";
 bar.style.cssText="position:fixed;bottom:0;left:0;right:0;z-index:2500;background:#131921;display:flex;gap:8px;padding:8px 10px";
 bar.innerHTML='<input id="mjhBarQ" placeholder="🔍 পণ্য খুঁজুন..." style="flex:1;padding:10px;border-radius:8px;border:1px solid #333;background:#1f2937;color:#fff;font-size:14px"><button id="mjhBarGo" style="background:#ff9900;border:none;border-radius:8px;padding:10px 14px;font-weight:700;cursor:pointer">🔍</button><button id="mjhBarAll" style="background:#2563eb;color:#fff;border:none;border-radius:8px;padding:10px 14px;font-weight:700;cursor:pointer">🛒 All</button>';
 document.body.appendChild(bar);
 function go(){var q=(document.getElementById("mjhBarQ").value||"").trim();location.href="products.html"+(q?"?search="+encodeURIComponent(q):"");}
 bar.querySelector("#mjhBarGo").onclick=go;
 bar.querySelector("#mjhBarQ").addEventListener("keypress",function(e){if(e.key==="Enter")go();});
 bar.querySelector("#mjhBarAll").onclick=function(){location.href="products.html";};
}

/* ---------- 🎁 BOGO helpers ---------- */
window.MJHBogo={
 set:function(id,cfg){var o={};o["products/"+id+"/bogo"]=cfg;return patch(o);},
 clear:function(id){var o={};o["products/"+id+"/bogo"]=null;return patch(o);}
};
})();
