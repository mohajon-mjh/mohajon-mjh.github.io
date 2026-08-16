/*admin-live-toggles-v1*/
Promise.all([import("https://www.gstatic.com/firebasejs/12.0.0/firebase-app.js"),import("https://www.gstatic.com/firebasejs/12.0.0/firebase-database.js")]).then(function(M){
var A=M[0],D=M[1];
var app=A.getApps().length?A.getApps()[0]:A.initializeApp({apiKey:"AIzaSyDj_LLHWBgcKfQClnaOUqEtULHhP1vSVxw",databaseURL:"https://mohajon-mjh-default-rtdb.firebaseio.com",projectId:"mohajon-mjh",appId:"1:526105903976:web:f9321c6d68ecbd19d58cdd"});
var db=D.getDatabase(app);
var MAP={},FSC={};
Promise.all([D.get(D.ref(db,"settings/categoryLive")),D.get(D.ref(db,"settings/flashSaleCategories"))]).then(function(ss){
 MAP=(ss[0].val())||{};FSC=(ss[1].val())||{};
 inject();setTimeout(inject,3000);setTimeout(inject,7000);
});
function mkSw(id){
 var w=document.createElement("label");w.className="ltg";w.style.cssText="position:relative;display:inline-block;width:40px;height:22px;margin-left:8px;vertical-align:middle;flex:0 0 auto";
 var on=MAP[id]!==false;
 w.innerHTML='<input type="checkbox" style="opacity:0;width:0;height:0" '+(on?"checked":"")+'><span style="position:absolute;inset:0;background:'+(on?"#1a7f37":"#ccc")+';border-radius:20px;cursor:pointer;transition:.2s"></span>';
 var sp=w.querySelector("span");
 w.querySelector("input").onchange=function(e){var v=e.target.checked;D.set(D.ref(db,"settings/categoryLive/"+id),v);sp.style.background=v?"#1a7f37":"#ccc";};
 return w;
}
function inject(){
 try{
 var SEC={"Trending Products":"sec:trending","Featured Products":"sec:featured","Deals of the Day":"sec:dotd","Coming Soon":"sec:comingsoon","Special Categories":"sec:special"};
 document.querySelectorAll("a,button").forEach(function(el){
  var t=(el.textContent||"").trim();
  for(var k in SEC){
   if(t.indexOf(k)>-1&&t.length<k.length+6&&!el.querySelector(".ltg")){el.appendChild(mkSw(SEC[k]));}
  }
 });
 document.querySelectorAll("button").forEach(function(delBtn){
  if((delBtn.textContent||"").trim().indexOf("Delete")!==0)return;
  var row=delBtn.parentElement;if(!row||row.querySelector(".ltg"))return;
  var name=(row.textContent||"").replace("Edit","").replace("Delete","").trim();
  for(var fid in FSC){
   var fn=(FSC[fid].name||"").trim();
   if(fn&&name.indexOf(fn)>-1){row.insertBefore(mkSw("fsc:"+fid),delBtn.previousElementSibling||delBtn);break;}
  }
 });
 }catch(e){}
}
}).catch(function(e){console.error(e);});
