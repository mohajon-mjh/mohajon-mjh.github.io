/*admin-live-toggles-v7*/
Promise.all([import("https://www.gstatic.com/firebasejs/12.0.0/firebase-app.js"),import("https://www.gstatic.com/firebasejs/12.0.0/firebase-database.js")]).then(function(M){
var A=M[0],D=M[1];
var app=A.getApps().length?A.getApps()[0]:A.initializeApp({apiKey:"AIzaSyDj_LLHWBgcKfQClnaOUqEtULHhP1vSVxw",databaseURL:"https://mohajon-mjh-default-rtdb.firebaseio.com",projectId:"mohajon-mjh",appId:"1:526105903976:web:f9321c6d68ecbd19d58cdd"});
var db=D.getDatabase(app);
var MAP={};
function toast(msg){var t=document.createElement("div");t.textContent=msg;t.style.cssText="position:fixed;bottom:80px;left:50%;transform:translateX(-50%);background:#111;color:#4ade80;padding:10px 18px;border-radius:20px;font-size:13px;font-weight:700;z-index:99999;box-shadow:0 4px 14px rgba(0,0,0,.4)";document.body.appendChild(t);setTimeout(function(){t.remove();},2000);}
function mkSw(id){
 var wrap=document.createElement("span");wrap.className="ltg";wrap.style.cssText="display:inline-flex;align-items:center;margin-left:12px;vertical-align:middle";
 var on=MAP[id]!==false;
 var st=document.createElement("span");st.style.cssText="font-size:10px;font-weight:800;color:"+(on?"#4ade80":"#999")+";margin-right:6px";st.textContent=on?"ON":"OFF";
 var lab=document.createElement("label");lab.style.cssText="position:relative;display:inline-block;width:44px;height:24px";
 lab.innerHTML='<input type="checkbox" style="opacity:0;width:0;height:0" '+(on?"checked":"")+'><span style="position:absolute;inset:0;background:'+(on?"#1a7f37":"#555")+';border-radius:20px;cursor:pointer;transition:.2s"></span>';
 var sp=lab.querySelector("span");
 lab.querySelector("input").onchange=function(e){
  var v=e.target.checked;
  D.set(D.ref(db,"settings/categoryLive/"+id),v).then(function(){
   MAP[id]=v;sp.style.background=v?"#1a7f37":"#555";st.textContent=v?"ON":"OFF";st.style.color=v?"#4ade80":"#999";
   toast("✅ সেভ হয়েছে ("+(v?"ON":"OFF")+")");
  }).catch(function(err){toast("❌ সেভ ব্যর্থ: "+err.message);});
 };
 wrap.appendChild(st);wrap.appendChild(lab);
 return wrap;
}
D.get(D.ref(db,"settings/categoryLive")).then(function(s){MAP=s.val()||{};build();setTimeout(build,3000);}).catch(function(){MAP={};build();setTimeout(build,3000);});
function build(){
 if(document.getElementById("mjhUniversalToggles"))return;
 var host=null;
 document.querySelectorAll('[data-tab], button.tab-btn').forEach(function(el){
  var t=(el.textContent||"").trim();
  if(t.indexOf("Flash Sale")>-1&&!host)host=el;
 });
 if(!host){
  var tabs=document.querySelectorAll("button");
  for(var i=0;i<tabs.length;i++){if((tabs[i].textContent||"").indexOf("Flash Sale")>-1){host=tabs[i];break;}}
 }
 if(!host)return;
 var container=document.createElement("div");container.id="mjhUniversalToggles";container.style.cssText="margin:20px 0;padding:16px;background:#1e293b;border-radius:12px";
 container.innerHTML='<h3 style="color:#FFD814;margin:0 0 12px">🎛️ সব ক্যাটাগরি অন/অফ কন্ট্রোল</h3><div style="font-size:12px;color:#999;margin-bottom:12px">OFF করলে হোমপেজে ওই ক্যাটাগরির পণ্য লুকাবে, কাস্টমার "Coming Soon" দেখবে।</div><div id="tgList"></div>';
 var main=host.closest("main,div.content,div")||document.body;
 main.insertBefore(container,host.nextSibling);
 loadAll();
}
function loadAll(){
 Promise.all([
  D.get(D.ref(db,"settings/flashSaleCategories")).catch(function(){return null;}),
  D.get(D.ref(db,"settings/dealsOfDayCategories")).catch(function(){return null;}),
  D.get(D.ref(db,"settings/specialCategories")).catch(function(){return null;}),
  D.get(D.ref(db,"settings/specialCats")).catch(function(){return null;})
 ]).then(function(ss){
  var list=document.getElementById("tgList");
  if(!list)return;
  list.innerHTML="";
  function section(title,pref,snap){
   var obj=snap&&snap.val?snap.val():null;
   if(!obj||Object.keys(obj).length===0)return;
   var h=document.createElement("h4");h.style.cssText="color:#FFD814;margin:16px 0 8px;font-size:14px";h.textContent=title;list.appendChild(h);
   for(var id in obj){
    var nm=((obj[id]||{}).name||(obj[id]||{}).title||id);
    var row=document.createElement("div");row.style.cssText="display:flex;justify-content:space-between;align-items:center;padding:8px 10px;background:#0f172a;border-radius:8px;margin-bottom:6px";
    row.innerHTML='<span style="color:#fff;font-size:13px;font-weight:600">'+nm+'</span>';
    row.appendChild(mkSw(pref+id));
    list.appendChild(row);
   }
  }
  section("⚡ Flash Sale Categories","fsc:",ss[0]);
  section("⭐ Deals of the Day","dotd:",ss[1]);
  section("🌟 Special Categories","sc:",ss[2]&&ss[2].val()?ss[2]:ss[3]);
  var secH=document.createElement("h4");secH.style.cssText="color:#FFD814;margin:16px 0 8px;font-size:14px";secH.textContent="📄 হোমপেজ সেকশন";list.appendChild(secH);
  [["sec:trending","🔥 Trending Products"],["sec:featured","⭐ Featured Products"],["sec:dotd","⭐ Deals of the Day Section"],["sec:comingsoon","🔜 Coming Soon Section"],["sec:special","🌟 Special Categories Section"]].forEach(function(p){
   var row=document.createElement("div");row.style.cssText="display:flex;justify-content:space-between;align-items:center;padding:8px 10px;background:#0f172a;border-radius:8px;margin-bottom:6px";
   row.innerHTML='<span style="color:#fff;font-size:13px;font-weight:600">'+p[1]+'</span>';
   row.appendChild(mkSw(p[0]));
   list.appendChild(row);
  });
 });
}
document.addEventListener("click",function(e){
 var t=e.target;
 if(t&&t.matches&&t.matches("button.tab-btn")&&(t.textContent||"").indexOf("Flash Sale")>-1){
  setTimeout(function(){if(!document.getElementById("mjhUniversalToggles"))build();},300);
 }
});
}).catch(function(e){console.error("toggles err:",e);});
