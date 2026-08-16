/*admin-live-toggles-v4*/
Promise.all([import("https://www.gstatic.com/firebasejs/12.0.0/firebase-app.js"),import("https://www.gstatic.com/firebasejs/12.0.0/firebase-database.js")]).then(function(M){
var A=M[0],D=M[1];
var app=A.getApps().length?A.getApps()[0]:A.initializeApp({apiKey:"AIzaSyDj_LLHWBgcKfQClnaOUqEtULHhP1vSVxw",databaseURL:"https://mohajon-mjh-default-rtdb.firebaseio.com",projectId:"mohajon-mjh",appId:"1:526105903976:web:f9321c6d68ecbd19d58cdd"});
var db=D.getDatabase(app);
var MAP={};
D.get(D.ref(db,"settings/categoryLive")).then(function(s){MAP=s.val()||{};inject();setTimeout(inject,2500);setTimeout(inject,6000);document.addEventListener("click",function(){setTimeout(inject,700);});});
function norm(s){return (s||"").toLowerCase().replace(/[^a-z0-9]/g,"");}
function mkSw(id){
 var wrap=document.createElement("span");wrap.className="ltg";wrap.style.cssText="display:inline-flex;align-items:center;margin:0 10px 0 8px;vertical-align:middle;flex:0 0 auto";
 var on=MAP[id]!==false;
 var st=document.createElement("span");st.style.cssText="font-size:10px;font-weight:800;color:"+(on?"#4ade80":"#999")+";margin-right:6px";st.textContent=on?"ON":"OFF";
 var lab=document.createElement("label");lab.style.cssText="position:relative;display:inline-block;width:44px;height:24px";
 lab.innerHTML='<input type="checkbox" style="opacity:0;width:0;height:0" '+(on?"checked":"")+'><span style="position:absolute;inset:0;background:'+(on?"#1a7f37":"#555")+';border-radius:20px;cursor:pointer;transition:.2s"></span>';
 var sp=lab.querySelector("span");
 lab.querySelector("input").onchange=function(e){var v=e.target.checked;D.set(D.ref(db,"settings/categoryLive/"+id),v);sp.style.background=v?"#1a7f37":"#555";st.textContent=v?"ON":"OFF";st.style.color=v?"#4ade80":"#999";};
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
  var pref=prefixFromRow(delBtn);
  if(!pref)return;
  var name=(rowEl.textContent||"").replace(/Edit/g,"").replace(/Delete/g,"").replace(/ON/g,"").replace(/OFF/g,"").trim();
  if(name.length<3)return;
  var sw=mkSw(pref+norm(name));
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
}).catch(function(e){console.error(e);});
