/*category-gate-v1*/
import {initializeApp,getApps,getApp} from "https://www.gstatic.com/firebasejs/12.0.0/firebase-app.js";
import {getDatabase,ref,get} from "https://www.gstatic.com/firebasejs/12.0.0/firebase-database.js";
const gApp=getApps().some(function(a){return a.name==="mjhMain";})?getApps().find(function(a){return a.name==="mjhMain";}):(getApps().length?getApps()[0]:initializeApp({apiKey:"AIzaSyDj_LLHWBgcKfQClnaOUqEtULHhP1vSVxw",databaseURL:"https://mohajon-mjh-default-rtdb.firebaseio.com",projectId:"mohajon-mjh",appId:"1:526105903976:web:f9321c6d68ecbd19d58cdd"},"mjhMain"));
const gdb=getDatabase(gApp);
var MAP=null,waiters=[];
function load(){get(ref(gdb,"settings/categoryLive")).then(function(s){MAP=s.val()||{};waiters.forEach(function(f){f();});waiters=[];}).catch(function(){MAP={};waiters.forEach(function(f){f();});waiters=[];});}
load();
function ready(){return new Promise(function(res){if(MAP!==null)res();else waiters.push(res);});}
function isOff(id){return MAP!==null&&MAP[id]===false;}
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
document.addEventListener("click",function(e){
 var c=e.target.closest?e.target.closest("#globalCatsRow1 .cat,#globalCatsRow2 .cat"):null;
 if(!c||MAP===null)return;
 var id=idFromText(c.textContent||"");
 if(id&&isOff(id)){e.stopPropagation();e.preventDefault();showSoon(c.textContent.replace("🔜","").trim());}
},true);
ready().then(function(){setTimeout(function(){
 document.querySelectorAll("#globalCatsRow1 .cat,#globalCatsRow2 .cat").forEach(function(c){
  var id=idFromText(c.textContent||"");
  if(id&&isOff(id)&&c.textContent.indexOf("🔜")===-1)c.textContent=c.textContent+" 🔜";
 });
 var a=document.querySelector("#globalCatsRow1 .cat.active,#globalCatsRow2 .cat.active");
 if(a){var id2=idFromText(a.textContent||"");if(id2&&isOff(id2)){var g=document.getElementById("globalCatCarousel");if(g)g.innerHTML='<p style="text-align:center;color:#888;padding:20px">🔜 Coming Soon...</p>';}}
},2500);});
window.MJHCategoryGate={ready:ready,isOff:isOff,showSoon:showSoon};
