/* Site Settings v2 - About editor + Sidebar color/reorder (mobile friendly) */
(function(){
"use strict";
var BASE="https://mohajon-mjh-default-rtdb.firebaseio.com";
var ABOUT=BASE+"/settings/about.json";
var SIDEBAR=BASE+"/settings/sidebarConfig.json";
var DEF={
 title:"🌟 About Mohajon MJH Marketplace",
 description:"International online marketplace — 1,650+ verified products, connecting buyers and sellers directly.",
 image:"",
 features:[
  {icon:"💰",title:"Cash on Delivery",desc:"Pay when you receive your products",link:"about.html#payments"},
  {icon:"🔄",title:"7-Day Return",desc:"Easy 7-day return policy",link:"about.html#returns"},
  {icon:"🔒",title:"Secure Payment",desc:"bKash, Nagad, Rocket",link:"about.html#payments"},
  {icon:"🚚",title:"Fast Delivery",desc:"Delivery in 10-15 days",link:"about.html#delivery"}
 ]
};
var cur=JSON.parse(JSON.stringify(DEF));
var sideCfg=[];
function $(id){return document.getElementById(id);}
function esc(s){return String(s==null?"":s).replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;");}
function status(msg,type){var el=$("settingsStatus");if(!el)return;el.style.display="block";el.style.background=type==="err"?"#ef4444":type==="ok"?"#10b981":"#3b82f6";el.style.color="#fff";el.textContent=msg;setTimeout(function(){el.style.display="none";},3500);}

/* ---------- ABOUT ---------- */
function fillAboutForm(){
 if($("aboutTitle"))$("aboutTitle").value=cur.title||"";
 if($("aboutDesc"))$("aboutDesc").value=cur.description||"";
 if($("aboutImage"))$("aboutImage").value=cur.image||"";
 var pv=$("aboutImagePreview");
 if(pv)pv.innerHTML=cur.image?'<img src="'+esc(cur.image)+'" style="max-width:280px;border-radius:8px">':"";
 renderCards();
}
function renderCards(){
 var box=$("featureCards");if(!box)return;
 box.innerHTML="";
 cur.features.forEach(function(f,i){
  var d=document.createElement("div");
  d.style.cssText="background:#1a242f;border:1px solid #333;border-radius:8px;padding:12px;margin-bottom:10px";
  d.innerHTML='<div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:8px"><b style="color:#fff">Card '+(i+1)+'</b><span>'+
   (i>0?'<button data-up="'+i+'" style="background:#3b82f6;color:#fff;border:none;border-radius:4px;padding:4px 8px;margin-right:4px">▲</button>':'')+
   (i<cur.features.length-1?'<button data-dn="'+i+'" style="background:#3b82f6;color:#fff;border:none;border-radius:4px;padding:4px 8px;margin-right:4px">▼</button>':'')+
   '<button data-del="'+i+'" style="background:#ef4444;color:#fff;border:none;border-radius:4px;padding:4px 8px">🗑️</button></span></div>'+
   '<div style="display:flex;gap:6px;flex-wrap:wrap"><input data-f="'+i+'" data-k="icon" value="'+esc(f.icon)+'" style="width:56px;padding:6px;border-radius:4px;border:1px solid #444;background:#0f1419;color:#fff" placeholder="Icon">'+
   '<input data-f="'+i+'" data-k="title" value="'+esc(f.title)+'" style="flex:1;min-width:140px;padding:6px;border-radius:4px;border:1px solid #444;background:#0f1419;color:#fff" placeholder="Title"></div>'+
   '<input data-f="'+i+'" data-k="desc" value="'+esc(f.desc)+'" style="width:100%;padding:6px;border-radius:4px;border:1px solid #444;background:#0f1419;color:#fff;margin-top:6px" placeholder="Description">'+
   '<input data-f="'+i+'" data-k="link" value="'+esc(f.link)+'" style="width:100%;padding:6px;border-radius:4px;border:1px solid #444;background:#0f1419;color:#fff;margin-top:6px" placeholder="Link">';
  box.appendChild(d);
 });
 var add=document.createElement("button");
 add.textContent="➕ Add Card";
 add.style.cssText="background:#3b82f6;color:#fff;border:none;border-radius:6px;padding:8px 14px;cursor:pointer";
 add.onclick=function(){cur.features.push({icon:"📌",title:"",desc:"",link:""});renderCards();};
 box.appendChild(add);
 box.oninput=function(e){var t=e.target;if(t.dataset&&t.dataset.f!==undefined&&t.dataset.k){cur.features[+t.dataset.f][t.dataset.k]=t.value;}};
 box.onclick=function(e){var t=e.target;
  if(t.dataset&&t.dataset.del!==undefined){if(confirm("Card মুছবেন?")){cur.features.splice(+t.dataset.del,1);renderCards();}}
  else if(t.dataset&&t.dataset.up!==undefined){var i=+t.dataset.up;var m=cur.features.splice(i,1)[0];cur.features.splice(i-1,0,m);renderCards();}
  else if(t.dataset&&t.dataset.dn!==undefined){var j=+t.dataset.dn;var m2=cur.features.splice(j,1)[0];cur.features.splice(j+1,0,m2);renderCards();}};
}
function loadAbout(){
 fetch(ABOUT).then(function(r){return r.json();}).then(function(d){
  if(d&&typeof d==="object"){
   cur={title:d.title||DEF.title,description:d.description||DEF.description,image:d.image||"",
    features:(Array.isArray(d.features)&&d.features.length)?d.features:JSON.parse(JSON.stringify(DEF.features))};
  }else{cur=JSON.parse(JSON.stringify(DEF));}
  fillAboutForm();
 }).catch(function(){cur=JSON.parse(JSON.stringify(DEF));fillAboutForm();});
}
window.saveAboutSettings=function(){
 if($("aboutTitle"))cur.title=$("aboutTitle").value;
 if($("aboutDesc"))cur.description=$("aboutDesc").value;
 if($("aboutImage"))cur.image=$("aboutImage").value;
 status("⏳ Save হচ্ছে...","info");
 fetch(ABOUT,{method:"PUT",headers:{"Content-Type":"application/json"},body:JSON.stringify({title:cur.title,description:cur.description,image:cur.image,features:cur.features,updatedAt:Date.now()})})
 .then(function(r){if(!r.ok)throw new Error("HTTP "+r.status);status("✅ About save হয়েছে — homepage-এ দেখাবে","ok");})
 .catch(function(e){status("❌ Save ব্যর্থ: "+e.message,"err");});
};
window.resetAboutSettings=function(){
 if(!confirm("Default content এ ফিরে যাবেন?"))return;
 cur=JSON.parse(JSON.stringify(DEF));fillAboutForm();
 status("↩️ Default load হয়েছে — Save চাপলে Firebase-এ যাবে","ok");
};
window.deleteAboutSettings=function(){
 if(!confirm("Firebase থেকে About settings মুছে ফেলবেন?"))return;
 fetch(ABOUT,{method:"DELETE"}).then(function(){cur=JSON.parse(JSON.stringify(DEF));fillAboutForm();status("🗑️ Firebase থেকে মুছে গেছে","ok");})
 .catch(function(e){status("❌ "+e.message,"err");});
};
function bindImage(){
 var fi=$("aboutImageFile");if(!fi||fi.dataset.bound)return;fi.dataset.bound="1";
 fi.addEventListener("change",function(){
  var f=fi.files&&fi.files[0];if(!f)return;
  if(window.MJHCloud&&window.MJHCloud.upload){
   status("⏳ Cloudinary upload...","info");
   window.MJHCloud.upload(f).then(function(url){
    $("aboutImage").value=url;$("aboutImagePreview").innerHTML='<img src="'+esc(url)+'" style="max-width:280px;border-radius:8px">';
    status("✅ Image upload হয়েছে","ok");
   }).catch(function(e){status("❌ Upload ব্যর্থ: "+(e&&e.message||e),"err");});
  }else{
   var rd=new FileReader();
   rd.onload=function(){$("aboutImage").value=rd.result;$("aboutImagePreview").innerHTML='<img src="'+rd.result+'" style="max-width:280px;border-radius:8px">';status("✅ Image বসেছে — Save চাপুন","ok");};
   rd.readAsDataURL(f);
  }
 });
}

/* ---------- SIDEBAR ---------- */
function navEl(){var b=$("admin-logout-btn");return b?b.parentElement:(document.querySelector(".admin-tabs")||null);}
function keyOf(b){return b.getAttribute("data-tab")||b.id||(b.textContent||"").trim();}
function sideButtons(){var nav=navEl();if(!nav)return [];return [].slice.call(nav.querySelectorAll("button")).filter(function(b){return b.id!=="admin-logout-btn";});}
function rgb2hex(b){
 var c=(b.style&&b.style.backgroundColor)||"";
 if(!c&&window.getComputedStyle)c=getComputedStyle(b).backgroundColor||"";
 var m=c.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)/);
 if(!m)return "#333333";
 return "#"+[1,2,3].map(function(i){var h=(+m[i]).toString(16);return h.length<2?"0"+h:h;}).join("");
}
function loadSidebar(){
 fetch(SIDEBAR).then(function(r){return r.json();}).then(function(d){sideCfg=Array.isArray(d)?d:[];renderSide();})
 .catch(function(){sideCfg=[];renderSide();});
}
function renderSide(){
 var box=$("sidebarColorManager");if(!box)return;
 box.innerHTML="";
 var btns=sideButtons();var keys=btns.map(keyOf);var list=[];
 (sideCfg||[]).forEach(function(c){if(keys.indexOf(c.key)>-1)list.push(c);});
 btns.forEach(function(b){var k=keyOf(b);var found=false;list.forEach(function(c){if(c.key===k)found=true;});if(!found)list.push({key:k,text:(b.textContent||"").trim(),color:rgb2hex(b)});});
 sideCfg=list;
 list.forEach(function(item,i){
  var row=document.createElement("div");
  row.style.cssText="display:flex;align-items:center;gap:6px;padding:8px;background:#1a242f;border:1px solid #333;border-radius:6px;margin-bottom:6px";
  var hex=/^#[0-9a-f]{6}$/i.test(item.color||"")?item.color:"#333333";
  row.innerHTML='<span style="color:#888">⋮⋮</span><span style="flex:1;color:#fff;font-size:13px">'+esc(item.text)+'</span>'+
   '<input type="color" value="'+hex+'" style="width:38px;height:30px;border:none;background:none;cursor:pointer">'+
   '<button data-u="'+i+'" style="background:#3b82f6;color:#fff;border:none;border-radius:4px;padding:4px 7px">▲</button>'+
   '<button data-d="'+i+'" style="background:#3b82f6;color:#fff;border:none;border-radius:4px;padding:4px 7px">▼</button>';
  row.querySelector('input[type=color]').addEventListener("input",function(e){sideCfg[i].color=e.target.value;});
  box.appendChild(row);
 });
 box.onclick=function(e){var t=e.target;
  if(t.dataset&&t.dataset.u!==undefined){var i=+t.dataset.u;if(i>0){var m=sideCfg.splice(i,1)[0];sideCfg.splice(i-1,0,m);renderSide();}}
  else if(t.dataset&&t.dataset.d!==undefined){var j=+t.dataset.d;if(j<sideCfg.length-1){var m2=sideCfg.splice(j,1)[0];sideCfg.splice(j+1,0,m2);renderSide();}}};
}
function findBtn(key){
 var nav=navEl();if(!nav)return null;
 var b=nav.querySelector('[data-tab="'+key+'"]');if(b)return b;
 var byId=document.getElementById(key);if(byId&&nav.contains(byId))return byId;
 return [].slice.call(nav.querySelectorAll("button,a")).filter(function(x){return (x.textContent||"").trim()===key;})[0]||null;
}
window.saveSidebarSettings=function(){
 status("⏳ Sidebar save হচ্ছে...","info");
 fetch(SIDEBAR,{method:"PUT",headers:{"Content-Type":"application/json"},body:JSON.stringify(sideCfg)})
 .then(function(r){if(!r.ok)throw new Error("HTTP "+r.status);applySide();status("✅ Sidebar save + apply হয়েছে","ok");})
 .catch(function(e){status("❌ "+e.message,"err");});
};
function applySide(){
 fetch(SIDEBAR).then(function(r){return r.json();}).then(function(d){
  if(!Array.isArray(d))return;
  var nav=navEl();if(!nav)return;
  var logout=$("admin-logout-btn");
  d.forEach(function(c){
   var btn=findBtn(c.key);if(!btn)return;
   if(c.color){btn.style.background=c.color;btn.style.color="#fff";btn.style.fontWeight="700";}
   if(logout)nav.insertBefore(btn,logout);
  });
 }).catch(function(){});
}

/* ---------- INIT (body ready হলে) ---------- */
function init(){
 bindImage();
 var obs=new MutationObserver(function(){
  var t=$("tab-site-settings");
  if(t&&t.classList.contains("active")&&!t.dataset.loaded){t.dataset.loaded="1";loadAbout();loadSidebar();}
 });
 obs.observe(document.body,{attributes:true,subtree:true,attributeFilter:["class"]});
 setInterval(function(){var t=$("tab-site-settings");if(t&&!t.classList.contains("active"))delete t.dataset.loaded;},1000);
 setTimeout(applySide,1200);
 setTimeout(applySide,3000);
}
if(document.readyState==="loading")document.addEventListener("DOMContentLoaded",init);else init();
})();
