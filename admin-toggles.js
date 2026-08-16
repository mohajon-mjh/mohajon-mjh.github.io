/*admin-live-toggles-v2*/
Promise.all([import("https://www.gstatic.com/firebasejs/12.0.0/firebase-app.js"),import("https://www.gstatic.com/firebasejs/12.0.0/firebase-database.js")]).then(function(M){
var A=M[0],D=M[1];
var app=A.getApps().length?A.getApps()[0]:A.initializeApp({apiKey:"AIzaSyDj_LLHWBgcKfQClnaOUqEtULHhP1vSVxw",databaseURL:"https://mohajon-mjh-default-rtdb.firebaseio.com",projectId:"mohajon-mjh",appId:"1:526105903976:web:f9321c6d68ecbd19d58cdd"});
var db=D.getDatabase(app);
var MAP={},N2K={};
Promise.all([D.get(D.ref(db,"settings/categoryLive")),D.get(D.ref(db,"settings/flashSaleCategories")),D.get(D.ref(db,"settings/dealsOfDayCategories")),D.get(D.ref(db,"settings/specialCategories")).catch(function(){return null;}),D.get(D.ref(db,"settings/specialCats")).catch(function(){return null;})]).then(function(ss){
 MAP=ss[0].val()||{};
 function addMap(pref,obj){if(!obj)return;for(var id in obj){var nm=((obj[id]||{}).name||(obj[id]||{}).title||"").trim();if(nm)N2K[nm]=pref+id;}}
 addMap("fsc:",ss[1].val());addMap("dotd:",ss[2].val());addMap("sc:",ss[3]?ss[3].val():null);addMap("sc:",ss[4]?ss[4].val():null);
 inject();setTimeout(inject,2500);setTimeout(inject,6000);
 document.addEventListener("click",function(){setTimeout(inject,700);});
});
function mkSw(id){
 var wrap=document.createElement("span");wrap.className="ltg";wrap.style.cssText="display:inline-flex;align-items:center;margin-left:10px;vertical-align:middle;flex:0 0 auto";
 var on=MAP[id]!==false;
 var st=document.createElement("span");st.style.cssText="font-size:10px;font-weight:800;color:"+(on?"#1a7f37":"#999")+";margin-right:6px";st.textContent=on?"ON":"OFF";
 var lab=document.createElement("label");lab.style.cssText="position:relative;display:inline-block;width:44px;height:24px";
 lab.innerHTML='<input type="checkbox" style="opacity:0;width:0;height:0" '+(on?"checked":"")+'><span style="position:absolute;inset:0;background:'+(on?"#1a7f37":"#ccc")+';border-radius:20px;cursor:pointer;transition:.2s"></span>';
 var sp=lab.querySelector("span");
 lab.querySelector("input").onchange=function(e){var v=e.target.checked;D.set(D.ref(db,"settings/categoryLive/"+id),v);sp.style.background=v?"#1a7f37":"#ccc";st.textContent=v?"ON":"OFF";st.style.color=v?"#1a7f37":"#999";};
 wrap.appendChild(st);wrap.appendChild(lab);
 return wrap;
}
function inject(){
 try{
 document.querySelectorAll("button").forEach(function(delBtn){
  var t=(delBtn.textContent||"");
  if(t.indexOf("Delete")===-1)return;
  var row=delBtn.parentElement;if(!row||row.querySelector(".ltg"))return;
  var name=(row.textContent||"").replace(/Edit/g,"").replace(/Delete/g,"").trim();
  var key=null;
  for(var n in N2K){if(name.indexOf(n)>-1){key=N2K[n];break;}}
  if(key)row.appendChild(mkSw(key));
 });
 var SEC={"Trending Products":"sec:trending","Featured Products":"sec:featured","Deals of the Day":"sec:dotd","Coming Soon":"sec:comingsoon","Special Categories":"sec:special"};
 document.querySelectorAll("a,button").forEach(function(el){
  var t=(el.textContent||"").trim();
  for(var k in SEC){if(t.indexOf(k)>-1&&t.length<k.length+6&&!el.querySelector(".ltg"))el.appendChild(mkSw(SEC[k]));}
 });
 }catch(e){}
}
}).catch(function(e){console.error(e);});
