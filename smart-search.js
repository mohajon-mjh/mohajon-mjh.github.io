(function(){
"use strict";
var DBURL="https://mohajon-mjh-default-rtdb.firebaseio.com/products.json";
var grid=null,inp=null,ALL=[];
var MAP={"প্রজেক্টর":"projector","প্রোজেক্টর":"projector","হেডফোন":"headphone","ইয়ারফোন":"earphone","ইয়ারবাড":"earbuds","ঘড়ি":"watch","স্মার্টওয়াচ":"smart watch","পাওয়ার ব্যাংক":"power bank","পাওয়ার":"power","মোবাইল":"phone","ফোন":"phone","গাড়ি":"car","কার":"car","লাইট":"light","বাল্ব":"bulb","কুকার":"cooker","ফ্রাইয়ার":"fryer","স্ট্রলার":"stroller","শার্ট":"shirt","টিশার্ট":"tshirt","প্যান্ট":"pant","জুতা":"shoe","ব্যাগ":"bag","ক্যামেরা":"camera","স্পিকার":"speaker","চার্জার":"charger","কেবল":"cable","হোল্ডার":"holder","ড্যাশক্যাম":"dashcam","ট্যাবলেট":"tablet","ল্যাপটপ":"laptop","টিভি":"tv","ফ্রিজ":"refrigerator","রেফ্রিজারেটর":"refrigerator","চেয়ার":"chair","টেবিল":"table","সোফা":"sofa","ল্যাম্প":"lamp","পেইন্টিং":"painting","ছবি":"painting","বই":"book","তাসবিহ":"tasbih","জায়নামাজ":"prayer mat","সিরাম":"serum","ক্রিম":"cream","ট্রিমার":"trimmer","শেভার":"shaver","সোলার":"solar","জিম":"gym","বেঞ্চ":"bench","গ্লাভস":"gloves","কিচেন":"kitchen","চপার":"chopper","কেটলি":"kettle","রাইস":"rice","هاتف":"phone","ساعة":"watch","سماعات":"headphone","شاحن":"charger","كاميرا":"camera","بروجكتر":"projector","مصباح":"light"};
function norm(s){return String(s||"").toLowerCase();}
function translit(q){var t=norm(q);for(var k in MAP){if(t.indexOf(k)>-1)t=t.split(k).join(" "+MAP[k]+" ");}return t;}
function tokens(s){return norm(s).split(/[^a-z0-9\u0980-\u09ff\u0600-\u06ff]+/).filter(function(x){return x.length>1;});}
function edit1(a,b){return a.indexOf(b)>-1||b.indexOf(a)>-1;}
function fuzzyMatch(title,q){
 var tt=tokens(title),qq=tokens(q);
 if(!qq.length)return true;
 var hit=qq.filter(function(qt){return tt.some(function(t){return edit1(t,qt);});});
 return hit.length>0&&hit.length>=Math.ceil(qq.length/2);
}
function match(p,q){
 if(!q||!q.trim())return true;
 var hay=norm(p.title)+" "+norm(p.description||"")+" "+norm(p.category||"")+" "+norm(p.categoryId||"")+" "+norm(p.brand||"");
 var nq=norm(q).trim(),tq=translit(q);
 if(hay.indexOf(nq)>-1)return true;
 if(tq!==nq&&hay.indexOf(tq)>-1)return true;
 return fuzzyMatch(hay,nq)||fuzzyMatch(hay,tq);
}
function active(p){var s=norm(p.status);return s===""||s==="active"||s==="approved";}
function render(){
 if(!grid)return;
 var params=new URLSearchParams(location.search);
 var q=(inp&&inp.value)?inp.value:(params.get("search")||params.get("q")||"");
 var cat=params.get("categoryId");
 var list=ALL.filter(active);
 if(cat&&cat!=="all")list=list.filter(function(p){return (p.categoryId||p.category||"")===cat;});
 list=list.filter(function(p){return match(p,q);});
 grid.innerHTML="";
 if(!list.length){grid.innerHTML='<div class="loading-placeholder">😕 No products found — বানান বদলে খুঁজে দেখুন</div>';}
 else list.slice(0,200).forEach(function(p){grid.appendChild(window.createProductCard(p));});
 var c=document.getElementById("product-count");if(c)c.textContent=list.length+" items";
}
function init(){
 grid=document.getElementById("productGrid");
 inp=document.getElementById("searchInput");
 if(!grid){return setTimeout(init,400);}
 var w=0;
 (function waitCard(){
  if(window.createProductCard||w>20){load();}else{w++;setTimeout(waitCard,250);}
 })();
 function load(){
  fetch(DBURL).then(function(r){return r.json();}).then(function(data){
   ALL=Object.keys(data||{}).map(function(id){var p=data[id]||{};p.id=id;return p;});
   console.log("✅ smart-search loaded",ALL.length,"products");
   var params=new URLSearchParams(location.search);
   var q=params.get("search")||params.get("q")||"";
   if(inp&&q)inp.value=q;
   render();
  }).catch(function(e){if(grid)grid.innerHTML='<div class="loading-placeholder">❌ '+e.message+'</div>';});
 }
 if(inp){var t;inp.addEventListener("input",function(){clearTimeout(t);t=setTimeout(render,300);});}
}
if(document.readyState==="loading")document.addEventListener("DOMContentLoaded",init);else init();
})();
