/* MJH Home Extra Manager v1 - Trending/Featured/ComingSoon */
(function(){
"use strict";
var BASE="https://mohajon-mjh-default-rtdb.firebaseio.com";
var CFG={apiKey:"AIzaSyDj_LLHWBgcKfQClnaOUqEtULHhP1vSVxw",authDomain:"mohajon-mjh.firebaseapp.com",databaseURL:BASE,projectId:"mohajon-mjh",appId:"1:526105903976:web:f9321c6d68ecbd19d58cdd"};
var fd=null,db=null,PCACHE=null;
function $(id){return document.getElementById(id);}
function init(){if(fd)return Promise.resolve(true);
 return Promise.all([import("https://www.gstatic.com/firebasejs/12.0.0/firebase-app.js"),import("https://www.gstatic.com/firebasejs/12.0.0/firebase-database.js")]).then(function(M){
  fd=M[1];var app=M[0].getApps().length?M[0].getApp():M[0].initializeApp(CFG);db=fd.getDatabase(app);return true;
 }).catch(function(){return false;});}
function toast(m,c){var t=document.createElement("div");t.textContent=m;t.style.cssText="position:fixed;top:80px;right:16px;background:"+(c||"#27ae60")+";color:#fff;padding:12px 18px;border-radius:8px;z-index:99999;font-weight:700;box-shadow:0 4px 12px rgba(0,0,0,.4)";document.body.appendChild(t);setTimeout(function(){t.remove();},3000);}
function esc(s){return String(s==null?"":s).replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;");}
function allProducts(){if(PCACHE)return Promise.resolve(PCACHE);
 return fd.get(fd.ref(db,"products")).then(function(s){PCACHE=s.val()||{};return PCACHE;});}

function flagUI(tabId,flag,emoji,title){
 var host=$(tabId);if(!host||host.dataset.bound)return;host.dataset.bound="1";
 host.innerHTML='<div class="card"><h3>'+emoji+' '+title+' Products কন্ট্রোল</h3>'+
 '<p style="color:#888;font-size:12px">পণ্য খুঁজে ➕ চাপুন — home-এর '+title+' section-এ চলে যাবে। 🗑️ চাপলে সরে যাবে।</p>'+
 '<div style="margin:10px 0"><input id="'+flag+'-q" placeholder="🔍 পণ্যের নাম লিখুন..." style="width:100%;padding:10px;background:#111;color:#7CFC00;border:1px solid #444;border-radius:6px;box-sizing:border-box">'+
 '<div id="'+flag+'-found" style="max-height:200px;overflow-y:auto;margin-top:8px"></div></div>'+
 '<h4 style="color:#FFD814;margin:12px 0 6px">বর্তমান '+title+' পণ্য:</h4><div id="'+flag+'-list">⏳ লোড হচ্ছে...</div></div>';
 var q=$(flag+"-q"),found=$(flag+"-found"),list=$(flag+"-list");
 function loadList(){
  fetch(BASE+"/products.json?orderBy="+encodeURIComponent('"'+flag+'"')+"&equalTo=true").then(function(r){return r.json();}).then(function(o){
   o=o||{};var keys=Object.keys(o);
   if(!keys.length){list.innerHTML='<p style="color:#888">কোনো পণ্য নেই — উপরে খুঁজে যোগ করুন</p>';return;}
   list.innerHTML=keys.map(function(id){var p=o[id]||{};return '<div style="background:#1a242f;border-radius:8px;padding:10px;margin:6px 0;display:flex;justify-content:space-between;align-items:center;gap:8px;flex-wrap:wrap"><span style="color:#fff;font-size:13px">'+esc(p.title||id)+' <small style="color:#888">৳'+(p.price||0)+'</small></span><button data-rid="'+id+'" style="background:#c0392b;color:#fff;border:none;border-radius:6px;padding:7px 12px;font-size:12px;font-weight:700;cursor:pointer">🗑️ সরাবেন</button></div>';}).join("");
  }).catch(function(){list.innerHTML='<p style="color:#c0392b">লোড ব্যর্থ</p>';});
 }
 list.addEventListener("click",function(e){var b=e.target.closest?e.target.closest("button[data-rid]"):null;if(!b)return;
  if(!confirm("'+title+' থেকে সরাবেন?"))return;
  var up={};up[flag]=false;
  fd.update(fd.ref(db,"products/"+b.dataset.rid),up).then(function(){toast("✅ সরানো হয়েছে");PCACHE=null;loadList();});
 });
 var tm=null;
 q.addEventListener("input",function(){clearTimeout(tm);tm=setTimeout(function(){
  var v=(q.value||"").toLowerCase();if(v.length<2){found.innerHTML="";return;}
  allProducts().then(function(all){
   var hits=Object.keys(all).filter(function(id){return (((all[id]||{}).title||"")+"").toLowerCase().indexOf(v)>-1;}).slice(0,10);
   found.innerHTML=hits.length?hits.map(function(id){return '<div style="display:flex;justify-content:space-between;align-items:center;background:#232f3e;border-radius:6px;padding:6px 8px;margin:4px 0;gap:6px"><span style="color:#fff;font-size:12px">'+esc(all[id].title||id)+'</span><button data-addid="'+id+'" style="background:#27ae60;color:#fff;border:none;border-radius:6px;padding:6px 10px;font-size:12px;font-weight:700;cursor:pointer">➕ যোগ</button></div>';}).join(""):'<p style="color:#888;font-size:12px">পাওয়া যায়নি</p>';
  });
 },300);});
 found.addEventListener("click",function(e){var b=e.target.closest?e.target.closest("button[data-addid]"):null;if(!b)return;
  var up={};up[flag]=true;
  fd.update(fd.ref(db,"products/"+b.dataset.addid),up).then(function(){toast("✅ "+title+"-এ যোগ হয়েছে");PCACHE=null;found.innerHTML="";q.value="";loadList();});
 });
 loadList();
}

function comingSoonUI(){
 var host=$("tab-comingsoon");if(!host||host.dataset.bound2)return;host.dataset.bound2="1";
 var wrap=document.createElement("div");wrap.className="card";
 wrap.innerHTML='<h3>🔮 Coming Soon কন্ট্রোল</h3>'+
 '<div style="display:flex;gap:8px;flex-wrap:wrap;margin:10px 0">'+
 '<input id="cs2-title" placeholder="পণ্যের নাম" style="flex:2;min-width:150px;padding:9px;background:#111;color:#fff;border:1px solid #444;border-radius:6px">'+
 '<input id="cs2-price" type="number" placeholder="আনুমানিক দাম ৳" style="width:130px;padding:9px;background:#111;color:#fff;border:1px solid #444;border-radius:6px">'+
 '<input id="cs2-disc" type="number" placeholder="ডিসকাউন্ট %" style="width:110px;padding:9px;background:#111;color:#fff;border:1px solid #444;border-radius:6px">'+
 '<button id="cs2-add" style="background:#27ae60;color:#fff;border:none;border-radius:6px;padding:9px 14px;font-weight:800;cursor:pointer">➕ যোগ করুন</button></div>'+
 '<h4 style="color:#FFD814;margin:12px 0 6px">বর্তমান Coming Soon পণ্য:</h4><div id="cs2-list">⏳ লোড হচ্ছে...</div>';
 host.appendChild(wrap);
 var list=$("cs2-list");
 function load(){
  fd.get(fd.ref(db,"futureProducts")).then(function(s){
   var o=s.val()||{};var keys=Object.keys(o);
   if(!keys.length){list.innerHTML='<p style="color:#888">কোনো পণ্য নেই</p>';return;}
   list.innerHTML=keys.map(function(id){var p=o[id]||{};return '<div style="background:#1a242f;border-radius:8px;padding:10px;margin:6px 0;display:flex;justify-content:space-between;align-items:center;gap:8px;flex-wrap:wrap"><span style="color:#fff;font-size:13px">'+esc(p.title||id)+' <small style="color:#888">৳'+(p.expectedPrice||0)+'</small></span><span style="display:flex;gap:6px"><button data-ed="'+id+'" style="background:#2980b9;color:#fff;border:none;border-radius:6px;padding:7px 10px;font-size:12px;font-weight:700;cursor:pointer">✏️ Edit</button><button data-del="'+id+'" style="background:#c0392b;color:#fff;border:none;border-radius:6px;padding:7px 10px;font-size:12px;font-weight:700;cursor:pointer">🗑️ Delete</button></span></div>';}).join("");
  });
 }
 list.addEventListener("click",function(e){
  var eb=e.target.closest?e.target.closest("button[data-ed]"):null;
  var dbb=e.target.closest?e.target.closest("button[data-del]"):null;
  if(eb){var id=eb.dataset.ed;
   fd.get(fd.ref(db,"futureProducts/"+id)).then(function(s){var p=s.val()||{};
    var nn=prompt("নতুন নাম:",p.title||"");if(nn===null)return;
    var np=prompt("নতুন দাম:",p.expectedPrice||0);if(np===null)return;
    return fd.update(fd.ref(db,"futureProducts/"+id),{title:nn.trim()||p.title,expectedPrice:+np||0});
   }).then(function(){toast("✅ সেভ হয়েছে");load();});
  }
  if(dbb){var id2=dbb.dataset.del;if(!confirm("মুছবেন?"))return;
   fd.remove(fd.ref(db,"futureProducts/"+id2)).then(function(){toast("✅ মুছে গেছে");load();});
  }
 });
 $("cs2-add").onclick=function(){
  var t=($("cs2-title").value||"").trim();var pr=+($("cs2-price").value||0);var dc=+($("cs2-disc").value||0);
  if(!t)return toast("❌ নাম দিন","#c0392b");
  var id="fs_"+Date.now().toString(36);
  fd.set(fd.ref(db,"futureProducts/"+id),{title:t,expectedPrice:pr,discountPercent:dc,categoryId:"coming_soon",createdAt:Date.now(),released:false}).then(function(){
   $("cs2-title").value="";$("cs2-price").value="";$("cs2-disc").value="";
   toast("✅ Coming Soon-এ যোগ হয়েছে");load();
  }).catch(function(e){toast("❌ "+e.message,"#c0392b");});
 };
 load();
}

function boot(){
 init().then(function(ok){if(!ok)return setTimeout(boot,2000);
  flagUI("tab-trending","isTrending","🔥","Trending");
  flagUI("tab-featured","isFeatured","⭐","Featured");
  comingSoonUI();
 });
}
function tryBoot(){if(document.readyState==="loading")return;boot();}
document.addEventListener("DOMContentLoaded",tryBoot);
setTimeout(tryBoot,1500);setTimeout(tryBoot,4000);
})();
