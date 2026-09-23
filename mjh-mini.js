/* MJH mini v1 - features INSIDE the original manager (no separate panel) */
(function(){
"use strict";
var CATS=[];
function loadCats(cb){if(CATS.length)return cb();fetch("category-menu.js").then(function(r){return r.text();}).then(function(t){var re=/\[\s*"([^"]+)"\s*,\s*"([^"]+)"\s*\]/g,m;while((m=re.exec(t))!==null){CATS.push([m[1],m[2]]);}cb();}).catch(function(){cb();});}
var KW=[["watch","Watches"],["mobile","Mobile & Accessories"],["phone","Mobile & Accessories"],["earbuds","TV, Audio & Appliances"],["headphone","TV, Audio & Appliances"],["speaker","TV, Audio & Appliances"],["tv","TV, Audio & Appliances"],["saree","Women Fashion"],["women","Women Fashion"],["dress","Women Fashion"],["shirt","Men Fashion"],["men","Men Fashion"],["baby","Kids & Baby"],["kid","Kids & Baby"],["toy","Toys, Games & Hobbies"],["game","Toys, Games & Hobbies"],["piggy","Toys, Games & Hobbies"],["money bank","Toys, Games & Hobbies"],["laptop","Computers & Laptops"],["computer","Computers & Laptops"],["cookware","Home & Kitchen"],["kitchen","Home & Kitchen"],["home","Home & Kitchen"],["cream","Beauty & Personal Care"],["beauty","Beauty & Personal Care"],["seed","Agriculture & Farming"],["fertilizer","Agriculture & Farming"],["car","Automotive & Vehicles"],["book","Books & Stationery"],["tea","Food & Beverages"],["coffee","Food & Beverages"],["rice","Food & Beverages"],["masala","Spices"],["spice","Spices"],["gift","Gifts & Crafts"],["grocery","Grocery & Daily Needs"],["health","Health & Wellness"],["dog","Pet Supplies"],["pet","Pet Supplies"],["fitness","Sports & Fitness"],["sport","Sports & Fitness"],["luggage","Travel & Luggage"],["travel","Travel & Luggage"]];
function byName(n){for(var i=0;i<CATS.length;i++)if(CATS[i][0]===n)return CATS[i][1];return "";}
function guess(t){t=(t||"").toLowerCase();for(var i=0;i<KW.length;i++)if(t.indexOf(KW[i][0])>-1)return byName(KW[i][1]);return "";}
function catPretty(id){for(var i=0;i<CATS.length;i++)if(CATS[i][1]===id)return CATS[i][0];return (id||"").replace(/[_-]+/g," ");}
function curOf(p,d){p=+p||0;d=+d||0;return Math.round(p*(100-d))/100;}
function toast(m,c){var t=document.createElement("div");t.textContent=m;t.style.cssText="position:fixed;top:80px;right:16px;background:"+(c||"#27ae60")+";color:#fff;padding:10px 16px;border-radius:8px;z-index:99999;font-weight:700";document.body.appendChild(t);setTimeout(function(){t.remove();},3000);}
function modal(lines){var o=document.createElement("div");o.style.cssText="position:fixed;inset:0;background:rgba(0,0,0,.7);z-index:999999;display:flex;align-items:center;justify-content:center";o.innerHTML='<div style="background:#1a242f;border:1px solid #FFD814;border-radius:12px;padding:18px;max-width:92vw;min-width:260px"><div style="color:#FFD814;font-weight:800;margin-bottom:10px">✅ সেভ রিপোর্ট</div>'+lines.map(function(l){return '<div style="color:#fff;font-size:13px;margin:4px 0">'+l+'</div>';}).join("")+'<button style="margin-top:12px;background:#27ae60;color:#fff;border:none;border-radius:6px;padding:10px 22px;font-weight:800" onclick="this.parentNode.parentNode.remove()">OK</button></div>';document.body.appendChild(o);}
function DB(){
 return new Promise(function(res,rej){
  var tries=0;
  function withAuth(app,mm){
   return import("https://www.gstatic.com/firebasejs/12.0.0/firebase-auth.js").then(function(au){
    var auth=au.getAuth(app);
    if(auth.currentUser)return mm;
    return new Promise(function(rs,rj){var w=0;var iv=setInterval(function(){w++;if(auth.currentUser){clearInterval(iv);rs();}else if(w>20){clearInterval(iv);rj(new Error("লগইন পাওয়া যায়নি — আগে এডমিনে লগইন করুন"));}},500);}).then(function(){return mm;});
   });
  }
  function step(){
   import("https://www.gstatic.com/firebasejs/12.0.0/firebase-app.js").then(function(a){
    if(a.getApps().length){return import("https://www.gstatic.com/firebasejs/12.0.0/firebase-database.js").then(function(m){return withAuth(a.getApp(),{m:m,db:m.getDatabase(a.getApp())});}).then(res);}
    if(++tries>40){
     var app=a.initializeApp({apiKey:"AIzaSyDj_LLHWBgcKfQClnaOUqEtULHhP1vSVxw",authDomain:"mohajon-mjh.firebaseapp.com",databaseURL:"https://mohajon-mjh-default-rtdb.firebaseio.com",projectId:"mohajon-mjh",storageBucket:"mohajon-mjh.firebasestorage.app",messagingSenderId:"526105903976",appId:"1:526105903976:web:f9321c6d68ecbd19d58cdd"});
     return import("https://www.gstatic.com/firebasejs/12.0.0/firebase-database.js").then(function(m){return withAuth(app,{m:m,db:m.getDatabase(app)});}).then(res);
    }
    setTimeout(step,500);
   }).catch(rej);
  }
  step();
 });
}
function fixCard(card){
 var pi=card.querySelector(".pPrice");if(!pi||!pi.dataset.id)return null;
 var id=pi.dataset.id;
 var orig=+pi.value||0;
 var di=card.querySelector(".pDisc");var disc=+(di?di.value:0)||0;
 var si=card.querySelector(".pStart"),ei=card.querySelector(".pEnd");
 var bt=card.querySelector("b");var title=bt?bt.textContent:"";
 var up={};var b="products/"+id+"/";
 up[b+"price"]=disc>0?curOf(orig,disc):orig;
 up[b+"discountPercent"]=disc;
 up[b+"discountPrice"]=disc>0?orig:null;
 if(si)up[b+"startDate"]=si.value;
 if(ei)up[b+"endDate"]=ei.value;
 var g=guess(title);if(g)up[b+"categoryId"]=g;
 return {up:up,title:title,g:g};
}
document.addEventListener("click",function(ev){
 var b=ev.target&&ev.target.closest?ev.target.closest("button"):null;if(!b)return;
 var t=(b.textContent||"").trim();
 if(t.indexOf("প্রাইস বসান")>-1){
  setTimeout(function(){
   var ta=null;document.querySelectorAll("textarea").forEach(function(x){if(!ta&&(x.placeholder||"").indexOf("নাম")>-1)ta=x;});
   if(!ta)return;
   var parsed=[];ta.value.split("\n").forEach(function(l){l=l.trim();var m=l.match(/^(.*?)\s*[-–—:]\s*(?:৳|\$|€|₹)?\s*([\d,\.]+)\s*,?$/);if(m)parsed.push([m[1].toLowerCase().replace(/\s+/g,""),+m[2].replace(/,/g,"")]);});
   var n=0;
   document.querySelectorAll(".pCard").forEach(function(c){
    var bt=c.querySelector("b");var tt=(bt?bt.textContent:"").toLowerCase().replace(/\s+/g,"");if(!tt)return;
    var hit=null;parsed.forEach(function(pr){if(!hit&&(tt===pr[0]||tt.indexOf(pr[0])>-1||pr[0].indexOf(tt)>-1))hit=pr;});
    if(hit){var pi=c.querySelector(".pPrice");if(pi){pi.value=hit[1];pi.dispatchEvent(new Event("input"));n++;}
     if(typeof pending!=="undefined"&&pending.forEach){pending.forEach(function(p){if((p.title||"").toLowerCase().replace(/\s+/g,"")===tt)p.price=hit[1];});}}
   });
   if(typeof renderAdd==="function"){try{renderAdd();}catch(e){}}
   if(n)modal(["✅ "+n+"টি পণ্যে দাম বসেছে","👉 এবার ☑️ সব সিলেক্ট → সিলেক্টেড Save চাপুন"]);
  },80);
  return;
 }
 if(t==="Save"||t==="সেভ"){
  var card=b.closest?b.closest(".pCard"):null;
  if(card){setTimeout(function(){
   var f=fixCard(card);if(!f)return;
   DB().then(function(o){return o.m.update(o.m.ref(o.db),f.up);}).then(function(){
    modal(["✅ সেভ হয়েছে: "+f.title,"🔥 Firebase: ✅","🏠 হোমপেজ ক্যাটাগরি: "+catPretty(window.CAT||""),"🍔 All Category: "+(f.g?catPretty(f.g):"—")]);
   }).catch(function(e){toast("❌ "+e.message,"#c0392b");});
  },400);}
  return;
 }
 if(t.indexOf("সিলেক্টেড Save")>-1){
  var cards=[].slice.call(document.querySelectorAll(".pChk:checked, .pCard input[type=checkbox]:checked")).map(function(c){return c.closest(".pCard");}).filter(Boolean);
  if(!cards.length)return;
  setTimeout(function(){
   var up={};var n=0;var gs=[];
   cards.forEach(function(c){var f=fixCard(c);if(f){for(var k in f.up)up[k]=f.up[k];n++;if(f.g)gs.push(f.title+" → "+catPretty(f.g));}});
   if(!n)return;
   DB().then(function(o){return o.m.update(o.m.ref(o.db),up);}).then(function(){
    modal(["✅ "+n+"টি পণ্য সেভ হলো","🔥 Firebase: ✅","🏠 হোমপেজ ক্যাটাগরি: "+catPretty(window.CAT||""),"🍔 All Category: "+(gs.length?gs.length+"টি নামে মিলেছে":"—")]);
   }).catch(function(e){toast("❌ "+e.message,"#c0392b");});
  },1200);
  return;
 }
},true);
loadCats(function(){});
})();
