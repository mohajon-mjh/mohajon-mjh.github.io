/*category-gate-v4*/
import {initializeApp,getApps,getApp} from "https://www.gstatic.com/firebasejs/12.0.0/firebase-app.js";
import {getDatabase,ref,get,query,orderByChild,limitToFirst} from "https://www.gstatic.com/firebasejs/12.0.0/firebase-database.js";
const gApp=getApps().some(function(a){return a.name==="mjhMain";})?getApps().find(function(a){return a.name==="mjhMain";}):(getApps().length?getApps()[0]:initializeApp({apiKey:"AIzaSyDj_LLHWBgcKfQClnaOUqEtULHhP1vSVxw",databaseURL:"https://mohajon-mjh-default-rtdb.firebaseio.com",projectId:"mohajon-mjh",appId:"1:526105903976:web:f9321c6d68ecbd19d58cdd"},"mjhMain"));
const gdb=getDatabase(gApp);
var MAP=null,waiters=[];
function load(){get(ref(gdb,"settings/categoryLive")).then(function(s){MAP=s.val()||{};waiters.forEach(function(f){f();});waiters=[];}).catch(function(){MAP={};waiters.forEach(function(f){f();});waiters=[];});}
load();
function ready(){return new Promise(function(res){if(MAP!==null)res();else waiters.push(res);});}
function isOff(id){return MAP!==null&&MAP[id]===false;}
function norm(s){return (s||"").toLowerCase().replace(/[^a-z0-9]/g,"");}
var overlay=null;
function showSoon(name){
 if(!overlay){overlay=document.createElement("div");overlay.id="cgOverlay";overlay.style.cssText="position:fixed;inset:0;background:rgba(0,0,0,.55);z-index:99999;display:flex;align-items:center;justify-content:center;padding:20px";
 overlay.innerHTML='<div style="background:#fff;border-radius:16px;max-width:340px;width:100%;padding:28px 22px;text-align:center;box-shadow:0 10px 40px rgba(0,0,0,.35)"><div style="font-size:52px">🔜</div><h2 style="margin:10px 0 6px;font-size:22px;color:#111">Coming Soon...</h2><p id="cgMsg" style="color:#565959;font-size:14px;margin:0 0 18px"></p><button id="cgOk" style="background:#ffd814;border:1px solid #fcd200;border-radius:20px;padding:10px 34px;font-size:15px;font-weight:700;cursor:pointer">ঠিক আছে</button></div>';
 document.body.appendChild(overlay);
 overlay.querySelector("#cgOk").onclick=function(){overlay.style.display="none";};
 overlay.addEventListener("click",function(e){if(e.target===overlay)overlay.style.display="none";});}
 overlay.querySelector("#cgMsg").textContent='"'+(name||"এই ক্যাটাগরি")+'" ক্যাটাগরিতে শীঘ্রই পণ্য যুক্ত হবে। একটু পরে আবার দেখুন!';
 overlay.style.display="flex";
}
var GN=[["electronics","Electronics"],["computers","Computers"],["tv_appliances","TV"],["watches","Watches"],["men_fashion","Men Fashion"],["women_fashion","Women Fashion"],["mother_baby","Mother"],["toys_games","Toys"],["grocery","Grocery"],["spices","Spices"],["food_beverages","Food"],["beauty","Beauty"],["health","Health"],["home_kitchen","Home & Kitchen"],["automotive","Automotive"],["sports","Sports"],["pet_supplies","Pet"],["books","Books"],["travel","Travel"],["gift_items","Gift"]];
function idFromText(t){for(var i=0;i<GN.length;i++){if(t.indexOf(GN[i][1])>-1)return GN[i][0];}return null;}
function chipOff(c){
 var t=(c.textContent||"").replace("🔜","").trim(),id;
 if(c.closest("#flashCatsRow")){id=c.getAttribute("data-cat")||"";return isOff("fsc:"+id)||isOff("fscname:"+norm(t));}
 if(c.closest("#dotdCatsRow")){id=c.getAttribute("data-cat")||"";return isOff("dotd:"+id)||isOff("dotdname:"+norm(t));}
 if(c.closest("#specialCatsContainer")){id=c.getAttribute("data-slug")||c.getAttribute("data-cat")||"";return isOff("sc:"+id)||isOff("scname:"+norm(t));}
 id=idFromText(t);return id?isOff(id):false;
}
document.addEventListener("click",function(e){
 if(MAP===null)return;
 var c=e.target.closest?e.target.closest("#globalCatsRow1 .cat,#globalCatsRow2 .cat,#flashCatsRow .cat,#dotdCatsRow .cat,#specialCatsContainer .cat"):null;
 if(!c)return;
 if(chipOff(c)){e.stopPropagation();e.preventDefault();showSoon(c.textContent.replace("🔜","").trim());}
},true);
function hideOff(){
 document.querySelectorAll("#flashCatsRow .cat,#dotdCatsRow .cat,#specialCatsContainer .cat").forEach(function(c){if(chipOff(c))c.style.display="none";});
 document.querySelectorAll("#globalCatsRow1 .cat,#globalCatsRow2 .cat").forEach(function(c){var id=idFromText(c.textContent||"");if(id&&isOff(id)&&c.textContent.indexOf("🔜")===-1)c.textContent=c.textContent+" 🔜";});
 function hideSec(off,sel){if(!off)return;var el=document.querySelector(sel);if(el){var sec=el.closest(".section")||el;sec.style.display="none";}}
 hideSec(isOff("sec:trending"),"#trendingProductsGrid");
 hideSec(isOff("sec:featured"),"#featuredProducts");
 hideSec(isOff("sec:comingsoon"),"#comingSoonSection");
 var fa=document.querySelector("#flashCatsRow .cat.active");
 if(fa&&fa.style.display==="none"){var all=document.querySelectorAll("#flashCatsRow .cat");for(var i=0;i<all.length;i++){if(all[i].style.display!=="none"){all[i].click();break;}}}
}
ready().then(function(){setTimeout(hideOff,1500);setTimeout(hideOff,4500);});
setTimeout(function(){document.querySelectorAll(".stock-badge,.discount-badge,.save-badge").forEach(function(b){if(!b.closest(".product-card")&&!b.closest(".card"))b.remove();});},3000);
var AF_START=Date.now(),POOL=null,F2={};
function cGet(k){try{var r=JSON.parse(localStorage.getItem("afc_"+k)||"null");if(r&&Date.now()-r.t<900000)return r.v;}catch(e){}return null;}
function cSet(k,v){try{localStorage.setItem("afc_"+k,JSON.stringify({t:Date.now(),v:v}));}catch(e){}}
async function pool(){
 if(POOL)return POOL;
 var c=cGet("pool");if(c){POOL=c;return POOL;}
 try{var s=await get(query(ref(gdb,"products"),orderByChild("createdAt"),limitToFirst(60)));var o=s.val()||{};POOL=Object.keys(o).map(function(k){return Object.assign({id:k},o[k]);}).filter(function(p){return p&&p.status==="active";});POOL.sort(function(a,b){return (b.createdAt||0)-(a.createdAt||0);});cSet("pool",POOL);}catch(e){POOL=[];}
 return POOL;
}
var fmt=function(v){return window.MJHCurrency&&window.MJHCurrency.formatPrice?window.MJHCurrency.formatPrice(v):"৳"+((+v||0).toFixed(0));};
function card(p){var id=p.id,price=+p.price||0;var old=p.discountPrice&&+p.discountPrice>price?+p.discountPrice:0;var disc=old?Math.round((1-price/old)*100):(parseInt(p.discountPercent)||0);var stock=parseInt(p.stock)||0;var img=(p.images&&p.images.main)||"";if(!img&&p.images){var vs=Object.values(p.images);for(var i=0;i<vs.length;i++){if(typeof vs[i]==="string"&&vs[i].indexOf("http")===0){img=vs[i];break;}}}if(!img)img="https://dummyimage.com/300x300/eeeeee/555&text=MJH";
var badge=stock<=0?'<span class="stock-badge out-of-stock">Out of Stock</span>':(stock<=5?'<span class="stock-badge low-stock">Low Stock</span>':'<span class="stock-badge in-stock">In Stock</span>');
var c=document.createElement("div");c.className="product-card";c.style.cursor="pointer";
c.innerHTML='<div class="product-card-image">'+badge+(disc>0?'<span class="discount-badge">-'+disc+'%</span>':'')+'<img src="'+img+'" loading="lazy" onerror="this.onerror=null;this.src=\'https://dummyimage.com/300x300/eeeeee/555&text=MJH\';"></div><div class="product-card-content"><h3 class="product-card-title">'+(p.title||p.name||"Product")+'</h3><div class="product-card-price"><span class="current-price">'+fmt(price)+'</span>'+(old?'<span class="old-price">'+fmt(old)+'</span>':'')+'</div><div class="product-card-actions" style="flex-direction:column"><button class="btn-add-to-cart" style="width:100%">🛒 Add to Cart</button><button class="btn-buy-now" style="width:100%;background:#f59e0b;color:#fff;margin-top:6px;border:none;border-radius:8px;padding:8px 14px;font-size:0.85rem;font-weight:600;cursor:pointer">⚡ Buy Now</button></div></div>';
c.onclick=function(){location.href="product-details.html?id="+encodeURIComponent(id);};
c.querySelector(".btn-add-to-cart").onclick=function(e){e.stopPropagation();if(typeof addCart==="function")addCart(id,p.title||p.name,price);e.target.textContent="Added ✓";setTimeout(function(){e.target.textContent="🛒 Add to Cart";},1200);};
c.querySelector(".btn-buy-now").onclick=function(e){e.stopPropagation();if(typeof addCart==="function")addCart(id,p.title||p.name,price);location.href="cart.html";};
return c;}
function empty2(g){if(!g)return false;var t=g.textContent||"";if(/এখনো কোনো|শীঘ্রই পণ্য|লোড করতে সমস্যা/.test(t))return true;if(/লোড হচ্ছে/.test(t))return (Date.now()-AF_START)>12000;return t.trim()==="";}
function fillG(g,l){g.innerHTML="";l.slice(0,30).forEach(function(p){g.appendChild(card(p));});}
async function fillSec(){
 var tg=document.getElementById("trendingProductsGrid");
 var fp=document.getElementById("featuredProducts");
 var nT=tg&&empty2(tg)&&!F2.t;
 var nP=fp&&empty2(fp)&&!F2.f;
 if(!nT&&!nP)return;
 var pl=await pool();
 if(nT){F2.t=1;fillG(tg,pl);}
 if(nP){F2.f=1;fillG(fp,pl.slice().sort(function(a,b){return (+b.rating||0)-(+a.rating||0);}));}
}
setTimeout(function(){var n=0;var iv=setInterval(function(){n++;fillSec();if(n>15)clearInterval(iv);},4000);},6000);
var LOCS=[["BD","🇧🇩 Bangladesh","BDT"],["SA","🇸🇦 Saudi Arabia","SAR"],["AE","🇦🇪 UAE","AED"],["IN","🇮🇳 India","INR"],["PK","🇵🇰 Pakistan","PKR"],["MY","🇲🇾 Malaysia","MYR"],["GB","🇬🇧 United Kingdom","GBP"],["US","🇺🇸 United States","USD"]];
function autoLoc(){try{var tz=(Intl.DateTimeFormat().resolvedOptions().timeZone||"").toLowerCase();if(tz.indexOf("dhaka")>-1)return "BD";if(tz.indexOf("riyadh")>-1)return "SA";if(tz.indexOf("dubai")>-1)return "AE";if(tz.indexOf("kolkata")>-1)return "IN";if(tz.indexOf("karachi")>-1)return "PK";if(tz.indexOf("kuala")>-1)return "MY";if(tz.indexOf("london")>-1)return "GB";if(tz.indexOf("york")>-1)return "US";}catch(e){}return "BD";}
function buildLoc(){
 if(document.getElementById("locPill"))return;
 var langEl=null;
 document.querySelectorAll("div,span,a").forEach(function(el){if(!langEl&&el.children.length===0&&(el.textContent||"").trim()==="বাংলা")langEl=el;});
 var parent=langEl?langEl.closest("div"):document.querySelector(".topbar");
 if(!parent)return;
 var cur=localStorage.getItem("mjhLocation")||autoLoc();
 if(!localStorage.getItem("mjhLocation")){localStorage.setItem("mjhLocation",cur);var L0=LOCS.filter(function(x){return x[0]===cur;})[0];if(window.MJHCurrency&&L0)window.MJHCurrency.setSelectedCurrency(L0[2]);}
 var pill=document.createElement("button");pill.id="locPill";
 pill.style.cssText="margin:0 8px;padding:6px 12px;border-radius:20px;border:2px solid #FFD814;background:linear-gradient(90deg,#131921,#232f3e);color:#FFD814;font-weight:700;font-size:12px;cursor:pointer;box-shadow:0 0 10px rgba(255,216,20,.7)";
 function label(){var L=LOCS.filter(function(x){return x[0]===cur;})[0]||LOCS[0];pill.innerHTML="📍 "+L[1]+' <span style="margin-left:4px">▾</span>';}
 label();
 var menu=null;
 pill.onclick=function(e){e.stopPropagation();
  if(menu){menu.remove();menu=null;return;}
  menu=document.createElement("div");menu.style.cssText="position:fixed;z-index:99999;background:#fff;border-radius:10px;box-shadow:0 6px 20px rgba(0,0,0,.25);padding:6px;min-width:180px";
  LOCS.forEach(function(x){var it=document.createElement("div");it.style.cssText="padding:8px 10px;font-size:13px;cursor:pointer;border-radius:6px;color:#111";it.textContent=(x[0]===cur?"✅ ":"")+x[1];it.onclick=function(ev){ev.stopPropagation();cur=x[0];localStorage.setItem("mjhLocation",cur);label();if(window.MJHCurrency&&x[2])window.MJHCurrency.setSelectedCurrency(x[2]);menu.remove();menu=null;};menu.appendChild(it);});
  document.body.appendChild(menu);
  var r=pill.getBoundingClientRect();menu.style.left=Math.max(8,r.left)+"px";menu.style.top=(r.bottom+6)+"px";
  setTimeout(function(){document.addEventListener("click",function h(){if(menu){menu.remove();menu=null;}document.removeEventListener("click",h);});},50);
 };
 parent.appendChild(pill);
}
setTimeout(buildLoc,2500);
window.MJHCategoryGate={ready:ready,isOff:isOff,showSoon:showSoon,norm:norm};
