/*admin-live-toggles-v6*/
Promise.all([import("https://www.gstatic.com/firebasejs/12.0.0/firebase-app.js"),import("https://www.gstatic.com/firebasejs/12.0.0/firebase-database.js")]).then(function(M){
var A=M[0],D=M[1];
var app=A.getApps().length?A.getApps()[0]:A.initializeApp({apiKey:"AIzaSyDj_LLHWBgcKfQClnaOUqEtULHhP1vSVxw",databaseURL:"https://mohajon-mjh-default-rtdb.firebaseio.com",projectId:"mohajon-mjh",appId:"1:526105903976:web:f9321c6d68ecbd19d58cdd"});
var db=D.getDatabase(app);
var MAP={},NN={},started=false;
function norm(s){return (s||"").toLowerCase().replace(/[^a-z0-9]/g,"");}
function toast(msg){var t=document.createElement("div");t.textContent=msg;t.style.cssText="position:fixed;bottom:80px;left:50%;transform:translateX(-50%);background:#111;color:#4ade80;padding:10px 18px;border-radius:20px;font-size:13px;font-weight:700;z-index:99999;box-shadow:0 4px 14px rgba(0,0,0,.4)";document.body.appendChild(t);setTimeout(function(){t.remove();},2000);}
function mkSw(id){
 var wrap=document.createElement("span");wrap.className="ltg";wrap.style.cssText="display:inline-flex;align-items:center;margin:0 10px 0 8px;vertical-align:middle;flex:0 0 auto";
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
function prefixFromRow(el){
 for(var i=0;i<6&&el;i++){
  var t=el.textContent||"";
  if(t.length<4000){
   if(t.indexOf("Flash Sale")>-1&&t.indexOf("নতুন")>-1)return "fscname:";
   if(t.indexOf("Deals of the Day")>-1&&t.indexOf("নতুন")>-1)return "dotdname:";
   if(t.indexOf("Special Category")>-1&&t.indexOf("নতুন")>-1)return "scname:";
  }
  el=el.parentElement;
 }
 return null;
}
function findRow(btn){var el=btn.parentElement;for(var i=0;i<4&&el;i++){var t=(el.textContent||"").replace(/Edit/g,"").replace(/Delete/g,"").replace(/ON/g,"").replace(/OFF/g,"").trim();if(t.length>3)return el;el=el.parentElement;}return btn.parentElement;}
function inject(){
 try{
 document.querySelectorAll("button").forEach(function(delBtn){
  if((delBtn.textContent||"").indexOf("Delete")===-1)return;
  var rowEl=findRow(delBtn);
  if(!rowEl||rowEl.querySelector(".ltg"))return;
  var rn=norm((rowEl.textContent||"").replace(/Edit/g,"").replace(/Delete/g,"").replace(/ON/g,"").replace(/OFF/g,""));
  if(rn.length<3)return;
  var key=null;
  for(var nn in NN){if(nn.length>=6&&rn.indexOf(nn)>-1){key=NN[nn];break;}}
  if(!key){for(var nn2 in NN){if(rn.length>=6&&nn2.indexOf(rn)>-1){key=NN[nn2];break;}}}
  if(!key){var p=prefixFromRow(delBtn);if(p)key=p+rn;}
  if(!key)return;
  var sw=mkSw(key);
  var editBtn=null;
  rowEl.querySelectorAll("button").forEach(function(b){if((b.textContent||"").indexOf("Edit")>-1&&!editBtn)editBtn=b;});
  if(editBtn)editBtn.parentElement.insertBefore(sw,editBtn);else rowEl.appendChild(sw);
 });
 var SEC={"Trending Products":"sec:trending","Featured Products":"sec:featured","Deals of the Day":"sec:dotd","Coming Soon":"sec:comingsoon","Special Categories":"sec:special"};
 document.querySelectorAll("a,button").forEach(function(el){
  var t=(el.textContent||"").trim();
  for(var k in SEC){if(t.indexOf(k)>-1&&t.length<k.length+8&&!el.querySelector(".ltg"))el.appendChild(mkSw(SEC[k]));}
 });
 }catch(e){}
}
function start(){if(started)return;started=true;inject();setTimeout(inject,2500);setTimeout(inject,6000);document.addEventListener("click",function(){setTimeout(inject,700);});}
D.get(D.ref(db,"settings/categoryLive")).then(function(s){MAP=s.val()||{};}).catch(function(){MAP={};}).then(function(){
 return Promise.all([
  D.get(D.ref(db,"settings/flashSaleCategories")).catch(function(){return null;}),
  D.get(D.ref(db,"settings/dealsOfDayCategories")).catch(function(){return null;}),
  D.get(D.ref(db,"settings/specialCategories")).catch(function(){return null;}),
  D.get(D.ref(db,"settings/specialCats")).catch(function(){return null;})
 ]).then(function(ss){
  function add(pref,snap){if(!snap||!snap.val)return;var obj=snap.val()||{};for(var id in obj){var nm=((obj[id]||{}).name||(obj[id]||{}).title||"").trim();if(nm)NN[norm(nm)]=pref+id;}}
  add("fsc:",ss[0]);add("dotd:",ss[1]);add("sc:",ss[2]);add("sc:",ss[3]);
  start();
 }).catch(function(){start();});
});
setTimeout(start,5000);
}).catch(function(e){console.error(e);});
