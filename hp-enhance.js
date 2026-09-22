/* MJH hp-enhance v8 FINAL - uses window.SEC/CAT for section map sync */
(function(){
"use strict";
var CATS=[],META={};
function loadCats(cb){
 if(CATS.length)return cb();
 fetch("category-menu.js").then(function(r){return r.text();}).then(function(t){
  var re=/\[\s*"([^"]+)"\s*,\s*"([^"]+)"\s*\]/g,m;
  while((m=re.exec(t))!==null){CATS.push([m[1],m[2]]);}
  cb();
 }).catch(function(){cb();});
}
var KW=[["watch","Watches"],["mobile","Mobile & Accessories"],["phone","Mobile & Accessories"],["earbuds","TV, Audio & Appliances"],["headphone","TV, Audio & Appliances"],["speaker","TV, Audio & Appliances"],["tv","TV, Audio & Appliances"],["saree","Women Fashion"],["women","Women Fashion"],["dress","Women Fashion"],["shirt","Men Fashion"],["men","Men Fashion"],["baby","Kids & Baby"],["kid","Kids & Baby"],["toy","Toys, Games & Hobbies"],["game","Toys, Games & Hobbies"],["piggy","Toys, Games & Hobbies"],["money bank","Toys, Games & Hobbies"],["laptop","Computers & Laptops"],["computer","Computers & Laptops"],["cookware","Home & Kitchen"],["kitchen","Home & Kitchen"],["home","Home & Kitchen"],["cream","Beauty & Personal Care"],["beauty","Beauty & Personal Care"],["fertilizer","Agriculture & Farming"],["seed","Agriculture & Farming"],["car","Automotive & Vehicles"],["book","Books & Stationery"],["tea","Food & Beverages"],["coffee","Food & Beverages"],["rice","Food & Beverages"],["masala","Spices"],["spice","Spices"],["gift","Gifts & Crafts"],["grocery","Grocery & Daily Needs"],["health","Health & Wellness"],["dog","Pet Supplies"],["pet","Pet Supplies"],["fitness","Sports & Fitness"],["sport","Sports & Fitness"],["luggage","Travel & Luggage"],["travel","Travel & Luggage"]];
function byName(nm){for(var i=0;i<CATS.length;i++){if(CATS[i][0]===nm)return CATS[i][1];}return "";}
function guess(t){t=(t||"").toLowerCase();for(var i=0;i<KW.length;i++){if(t.indexOf(KW[i][0])>-1)return byName(KW[i][1]);}return "";}
function toast(m,c){var t=document.createElement("div");t.textContent=m;t.style.cssText="position:fixed;top:80px;right:16px;background:"+(c||"#27ae60")+";color:#fff;padding:12px 18px;border-radius:8px;z-index:99999;font-weight:700";document.body.appendChild(t);setTimeout(function(){t.remove();},3000);}
function money(v){return "৳"+(+v||0);}
function curOf(p,d){p=+p||0;d=+d||0;return Math.round(p*(100-d))/100;}
function DB(){return import("https://www.gstatic.com/firebasejs/12.0.0/firebase-app.js").then(function(a){var app=a.getApps().length?a.getApp():null;if(!app)throw new Error("Firebase app পাওয়া যায়নি");return import("https://www.gstatic.com/firebasejs/12.0.0/firebase-database.js").then(function(m){return {m:m,db:m.getDatabase(app)};});});}
function secPath(){
 if(typeof window!=="undefined"){
  if(window.SEC&&window.CAT)return {pp:window.SEC,cc:window.CAT};
 }
 try{if(typeof s!=="undefined"&&s&&s.prodPath)return {pp:s.prodPath,cc:(typeof CURCAT!=="undefined"?CURCAT:null)};}catch(e){}
 return {pp:null,cc:null};
}
function loadMeta(cb){DB().then(function(o){return o.m.get(o.m.ref(o.db,"settings/homeProductMeta"));}).then(function(sn){META=sn.val()||{};if(cb)cb();sortList();}).catch(function(){if(cb)cb();});}
function sortList(){
 var list=document.getElementById("pList");if(!list)return;
 var cards=[].slice.call(list.querySelectorAll(".pCard"));
 if(cards.length<2)return;
 cards.forEach(function(c){var p=c.querySelector(".pPrice");var id=p?p.dataset.id:"";c.__ts=(META[id]&&META[id].createdAt)||0;});
 cards.sort(function(a,b){return (b.__ts||0)-(a.__ts||0);});
 cards.forEach(function(c){list.appendChild(c);});
}
function refresh(card){
 var p=card.querySelector(".pPrice"),d=card.querySelector(".pDisc"),pf=card.querySelector(".pProfit"),nt=card.querySelector(".eNote");
 if(!p||!nt)return;
 var price=+p.value||0,disc=+(d?d.value:0)||0,profit=+(pf?pf.value:0)||0,cur=curOf(price,disc);
 nt.innerHTML=disc>0?('<s style="color:#888">'+money(price)+'</s> → <b style="color:#7CFC00">'+money(cur)+'</b> | লাভ: <b style="color:#7CFC00">'+money(profit)+'</b>'):(money(price)+' | লাভ: <b style="color:#7CFC00">'+money(profit)+'</b>');
}
function saveCard(card){
 var p=card.querySelector(".pPrice");if(!p||!p.dataset.id)return toast("❌ ID পাওয়া যায়নি","#c0392b");
 var id=p.dataset.id;
 var price=+p.value||0;
 var d=card.querySelector(".pDisc");var disc=+(d?d.value:0)||0;
 var st=card.querySelector(".pStart");var en=card.querySelector(".pEnd");
 var sel=card.querySelector(".pCat");var pf=card.querySelector(".pProfit");
 var up={};
 up["products/"+id+"/price"]=price;
 up["products/"+id+"/discountPercent"]=disc;
 up["products/"+id+"/startDate"]=st?st.value:"";
 up["products/"+id+"/endDate"]=en?en.value:"";
 if(sel&&sel.value)up["products/"+id+"/categoryId"]=sel.value;
 up["settings/homeProductMeta/"+id+"/profit"]=+(pf?pf.value:0)||0;
 up["settings/homeProductMeta/"+id+"/createdAt"]=(META[id]&&META[id].createdAt)||Date.now();
 DB().then(function(o){return o.m.update(o.m.ref(o.db),up).then(function(){toast("✅ সেভ হয়েছে"+(sel&&sel.value?" + All Category":""));});}).catch(function(e){toast("❌ "+e.message,"#c0392b");});
}
function delCard(card){
 var p=card.querySelector(".pPrice");if(!p||!p.dataset.id)return;
 if(!confirm("পণ্যটা মুছবেন? (Firebase + Cloudinary ছবি)"))return;
 var id=p.dataset.id;var sp=secPath();var up={};
 up["products/"+id]=null;
 if(sp.pp&&sp.cc)up[sp.pp+"/"+sp.cc+"/"+id]=null;
 up["settings/homeProductMeta/"+id]=null;
 DB().then(function(o){return o.m.update(o.m.ref(o.db),up);}).then(function(){card.remove();toast("🗑️ মুছে গেছে");}).catch(function(e){toast("❌ "+e.message,"#c0392b");});
}
function enhance(card){
 if(!card||card.dataset.enh)return;card.dataset.enh="1";
 var b=card.querySelector("b");var title=b?b.textContent:"";
 var row=document.createElement("div");
 row.style.cssText="display:flex;gap:6px;flex-wrap:wrap;margin:6px 0";
 row.innerHTML='<select class="pCat" style="flex:1;min-width:150px;background:#111;color:#fff;border:1px solid #444;border-radius:6px;padding:6px"><option value="">— All Category (auto) —</option></select>'+
  '<input class="pProfit" type="number" placeholder="💹 লাভ (৳)" style="width:90px;background:#12241a;color:#7CFC00;border:1px solid #2e5f4a;border-radius:6px;padding:6px">'+
  '<button type="button" class="eEdit" style="background:#2980b9;color:#fff;border:none;border-radius:6px;padding:6px 10px;font-weight:700">✏️ Edit</button>'+
  '<button type="button" class="eSave" style="background:#27ae60;color:#fff;border:none;border-radius:6px;padding:6px 10px;font-weight:700">💾 Save</button>'+
  '<button type="button" class="eDel" style="background:#c0392b;color:#fff;border:none;border-radius:6px;padding:6px 10px;font-weight:700">🗑️ Delete</button>';
 var note=document.createElement("div");note.className="eNote";note.style.cssText="font-size:11px;color:#88ccff;margin:2px 0 6px";
 card.appendChild(note);card.appendChild(row);
 var sel=row.querySelector(".pCat");
 loadCats(function(){
  var h='<option value="">— All Category (auto) —</option>';
  for(var i=0;i<CATS.length;i++){h+='<option value="'+CATS[i][1]+'">'+CATS[i][0]+'</option>';}
  sel.innerHTML=h;
  var g=guess(title);if(g){sel.value=g;}
  refresh(card);
 });
 row.querySelector(".eEdit").onclick=function(){
  card.querySelectorAll("input,textarea").forEach(function(el){el.readOnly=false;el.disabled=false;});
  var fi=card.querySelector(".pPrice");if(fi)fi.focus();
  toast("✏️ এডিট চালু — বদলে 💾 Save চাপুন");
 };
 row.querySelector(".eSave").onclick=function(){saveCard(card);};
 row.querySelector(".eDel").onclick=function(){delCard(card);};
 card.addEventListener("input",function(){refresh(card);});
 refresh(card);
}
function addSimplePanel(){
 if(document.getElementById("enhSimple"))return;
 if(document.title.indexOf("প্রোডাক্ট ম্যানেজার")===-1||!document.querySelector('input[type="file"]'))return;
 var list=document.getElementById("pList");
 var anchor=list;
 if(!anchor){var ff=document.querySelector('input[type="file"]');if(ff){var rw=ff.closest("div");anchor=rw?rw.parentNode:null;}}
 if(!anchor){anchor=document.body;}
 var box=document.createElement("div");box.id="enhSimple";
 box.style.cssText="background:#0e1520;border:1px solid #FFD814;border-radius:10px;padding:12px;margin:10px 0";
 box.innerHTML='<b style="color:#FFD814">➕ সহজ যোগ — শুধু নাম বা শুধু ছবি দিয়েই সেভ চলবে</b>'+
  '<div style="display:flex;gap:6px;flex-wrap:wrap;margin-top:8px">'+
  '<input id="esFile" type="file" accept="image/*" style="flex:1;min-width:140px;background:#111;color:#fff;border:1px solid #444;border-radius:6px;padding:6px">'+
  '<input id="esName" placeholder="📦 পণ্যের নাম" style="flex:2;min-width:150px;background:#111;color:#fff;border:1px solid #444;border-radius:6px;padding:6px;font-weight:700">'+
  '<input id="esPrice" type="number" placeholder="💰 দাম" style="width:90px;background:#111;color:#fff;border:1px solid #444;border-radius:6px;padding:6px">'+
  '<input id="esDisc" type="number" placeholder="% " style="width:70px;background:#111;color:#fff;border:1px solid #444;border-radius:6px;padding:6px">'+
  '<input id="esProfit" type="number" placeholder="💹 লাভ" style="width:90px;background:#12241a;color:#7CFC00;border:1px solid #2e5f4a;border-radius:6px;padding:6px">'+
  '<select id="esCat" style="flex:1;min-width:140px;background:#111;color:#fff;border:1px solid #444;border-radius:6px;padding:6px"><option value="">— All Category (auto) —</option></select>'+
  '<button id="esSave" style="background:#27ae60;color:#fff;border:none;border-radius:6px;padding:10px 16px;font-weight:800">💾 Save</button>'+
  '</div><div id="esNote" style="font-size:11px;color:#88ccff;margin-top:6px"></div>';
 if(list){list.parentNode.insertBefore(box,list);}
 else if(anchor.firstChild){anchor.insertBefore(box,anchor.firstChild);}
 else{anchor.appendChild(box);}
 loadCats(function(){
  var s2=document.getElementById("esCat");if(!s2)return;
  var h='<option value="">— All Category (auto) —</option>';
  for(var i=0;i<CATS.length;i++){h+='<option value="'+CATS[i][1]+'">'+CATS[i][0]+'</option>';}
  s2.innerHTML=h;
 });
 var btn=document.getElementById("esSave");
 if(btn)btn.onclick=simpleSave;
}
function simpleSave(){
 var nameEl=document.getElementById("esName");
 var fileEl=document.getElementById("esFile");
 var file=fileEl.files&&fileEl.files[0];
 var name=(nameEl.value||"").trim();
 if(!name&&file){name=file.name.replace(/\.[^.]+$/,"").replace(/[-_]+/g," ");}
 if(!name&&!file){return toast("❌ নাম বা ছবি — অন্তত একটা দিন","#c0392b");}
 if(!name){name="Product "+Date.now().toString().slice(-4);}
 var price=+document.getElementById("esPrice").value||0;
 var disc=+document.getElementById("esDisc").value||0;
 var profit=+document.getElementById("esProfit").value||0;
 var cat=document.getElementById("esCat").value||guess(name)||"general";
 var note=document.getElementById("esNote");note.textContent="⏳ সেভ হচ্ছে...";
 var id="p_"+Date.now().toString(36)+Math.random().toString(36).substr(2,4);
 function finish(url){
  var obj={title:name,price:price,stock:10,status:"active",sellerId:(window.__mjhUid||"mjh-admin"),categoryId:cat,createdAt:Date.now(),startDate:"",endDate:"",images:{main:url||""}};
  if(disc>0)obj.discountPercent=disc;
  var up={};up["products/"+id]=obj;
  var sp=secPath();
  if(sp.pp&&sp.cc)up[sp.pp+"/"+sp.cc+"/"+id]={id:id,addedAt:Date.now()};
  up["settings/homeProductMeta/"+id]={profit:profit,createdAt:Date.now()};
  DB().then(function(o){return o.m.update(o.m.ref(o.db),up);}).then(function(){
   note.textContent="";
   META[id]={profit:profit,createdAt:Date.now()};
   toast("✅ সেভ: "+name+" → "+cat+(sp.pp&&sp.cc?" + সেকশন ম্যাপ":""));
   nameEl.value="";document.getElementById("esPrice").value="";document.getElementById("esDisc").value="";document.getElementById("esProfit").value="";fileEl.value="";
   if(typeof loadList==="function"){try{loadList(s);}catch(e){}}
  }).catch(function(e){note.textContent="";toast("❌ "+e.message,"#c0392b");});
 }
 if(file&&window.MJHCloud&&MJHCloud.upload){MJHCloud.upload(file).then(function(u){finish(u);}).catch(function(){finish("");});}
 else{finish("");}
}
document.addEventListener("click",function(ev){
 try{
  var el=ev.target&&ev.target.closest?ev.target.closest("[data-del],.eDel"):null;
  if(!el)return;
  var id=el.getAttribute?el.getAttribute("data-del"):null;
  var card=el.closest?el.closest(".pCard"):null;
  if(!id&&card){var p=card.querySelector(".pPrice");id=p?p.dataset.id:null;}
  if(!id)return;
  DB().then(function(o){return o.m.get(o.m.ref(o.db,"products/"+id+"/images/main"));}).then(function(sn){var u=sn.val();if(u){window.__enhImg=window.__enhImg||{};window.__enhImg[id]=u;}}).catch(function(){});
 }catch(e){}
},true);
setInterval(function(){
 var img=window.__enhImg||{};
 Object.keys(img).forEach(function(id){
  if(!document.querySelector('.pCard .pPrice[data-id="'+id+'"]')){
   var u=img[id];delete img[id];
   if(window.MJHCloud&&MJHCloud.remove){MJHCloud.remove(u).then(function(){toast("🗑️ Cloudinary-র ছবিটাও মুছে গেছে");}).catch(function(){});}
  }
 });
},2000);
var mo=new MutationObserver(function(){
 document.querySelectorAll(".pCard").forEach(enhance);
 addSimplePanel();
 sortList();
});
mo.observe(document.body,{childList:true,subtree:true});
loadMeta();
loadCats(function(){});
})();
