/* MJH hp-enhance v10 FINAL - no-app fix + removeOld + global search */
(function(){
"use strict";
if(document.title.indexOf("প্রোডাক্ট ম্যানেজার")===-1)return;
var SEC=window.SEC||"",CAT=window.CAT||"";
var CATS=[],ALLP={},META={};
function loadCats(cb){if(CATS.length)return cb();fetch("category-menu.js").then(function(r){return r.text();}).then(function(t){var re=/\[\s*"([^"]+)"\s*,\s*"([^"]+)"\s*\]/g,m;while((m=re.exec(t))!==null){CATS.push([m[1],m[2]]);}cb();}).catch(function(){cb();});}
var KW=[["watch","Watches"],["mobile","Mobile & Accessories"],["phone","Mobile & Accessories"],["earbuds","TV, Audio & Appliances"],["headphone","TV, Audio & Appliances"],["speaker","TV, Audio & Appliances"],["tv","TV, Audio & Appliances"],["saree","Women Fashion"],["women","Women Fashion"],["dress","Women Fashion"],["shirt","Men Fashion"],["men","Men Fashion"],["baby","Kids & Baby"],["kid","Kids & Baby"],["toy","Toys, Games & Hobbies"],["game","Toys, Games & Hobbies"],["piggy","Toys, Games & Hobbies"],["money bank","Toys, Games & Hobbies"],["laptop","Computers & Laptops"],["computer","Computers & Laptops"],["cookware","Home & Kitchen"],["kitchen","Home & Kitchen"],["home","Home & Kitchen"],["cream","Beauty & Personal Care"],["beauty","Beauty & Personal Care"],["seed","Agriculture & Farming"],["fertilizer","Agriculture & Farming"],["car","Automotive & Vehicles"],["book","Books & Stationery"],["tea","Food & Beverages"],["coffee","Food & Beverages"],["rice","Food & Beverages"],["masala","Spices"],["spice","Spices"],["gift","Gifts & Crafts"],["grocery","Grocery & Daily Needs"],["health","Health & Wellness"],["dog","Pet Supplies"],["pet","Pet Supplies"],["fitness","Sports & Fitness"],["sport","Sports & Fitness"],["luggage","Travel & Luggage"],["travel","Travel & Luggage"]];
function byName(n){for(var i=0;i<CATS.length;i++)if(CATS[i][0]===n)return CATS[i][1];return "";}
function guess(t){t=(t||"").toLowerCase();for(var i=0;i<KW.length;i++)if(t.indexOf(KW[i][0])>-1)return byName(KW[i][1]);return "";}
function catPretty(id){for(var i=0;i<CATS.length;i++)if(CATS[i][1]===id)return CATS[i][0];return (id||"").replace(/[_-]+/g," ");}
function DB(){
 return new Promise(function(res,rej){
  var tries=0;
  function step(){
   import("https://www.gstatic.com/firebasejs/12.0.0/firebase-app.js").then(function(a){
    if(a.getApps().length){return import("https://www.gstatic.com/firebasejs/12.0.0/firebase-database.js").then(function(m){res({m:m,db:m.getDatabase(a.getApp())});});}
    if(++tries>40){
     var app=a.initializeApp({apiKey:"AIzaSyDj_LLHWBgcKfQClnaOUqEtULHhP1vSVxw",authDomain:"mohajon-mjh.firebaseapp.com",databaseURL:"https://mohajon-mjh-default-rtdb.firebaseio.com",projectId:"mohajon-mjh",storageBucket:"mohajon-mjh.firebasestorage.app",messagingSenderId:"526105903976",appId:"1:526105903976:web:f9321c6d68ecbd19d58cdd"});
     return import("https://www.gstatic.com/firebasejs/12.0.0/firebase-auth.js").then(function(au){
      var auth=au.getAuth(app);
      function done(){return import("https://www.gstatic.com/firebasejs/12.0.0/firebase-database.js").then(function(m){res({m:m,db:m.getDatabase(app)});});}
      if(auth.currentUser)return done();
      var w=0;var iv=setInterval(function(){w++;if(auth.currentUser){clearInterval(iv);done();}else if(w>20){clearInterval(iv);rej(new Error("লগইন পাওয়া যায়নি — আগে এডমিন প্যানেলে লগইন করুন"));}},500);
     });
    }
    setTimeout(step,500);
   }).catch(rej);
  }
  step();
 });
}

function modal(lines){var o=document.createElement("div");o.style.cssText="position:fixed;inset:0;background:rgba(0,0,0,.7);z-index:999999;display:flex;align-items:center;justify-content:center";o.innerHTML='<div style="background:#1a242f;border:1px solid #FFD814;border-radius:12px;padding:18px;max-width:92vw;min-width:260px"><div style="color:#FFD814;font-weight:800;margin-bottom:10px">✅ সেভ রিপোর্ট</div>'+lines.map(function(l){return '<div style="color:#fff;font-size:13px;margin:4px 0">'+l+'</div>';}).join("")+'<button style="margin-top:12px;background:#27ae60;color:#fff;border:none;border-radius:6px;padding:10px 22px;font-weight:800" onclick="this.parentNode.parentNode.remove()">OK</button></div>';document.body.appendChild(o);}
function toast(m,c){var t=document.createElement("div");t.textContent=m;t.style.cssText="position:fixed;top:80px;right:16px;background:"+(c||"#27ae60")+";color:#fff;padding:10px 16px;border-radius:8px;z-index:99999;font-weight:700";document.body.appendChild(t);setTimeout(function(){t.remove();},2500);}
function lightbox(src){var o=document.createElement("div");o.style.cssText="position:fixed;inset:0;background:rgba(0,0,0,.85);z-index:999999;display:flex;align-items:center;justify-content:center";o.innerHTML='<img src="'+src+'" style="max-width:94vw;max-height:90vh;border-radius:8px">';o.onclick=function(){o.remove();};document.body.appendChild(o);}
function symOf(p){return (META[p&&p.id]&&META[p.id].currency)||"৳";}
function curOf(p,d){p=+p||0;d=+d||0;return Math.round(p*(100-d))/100;}
var FMAP={title:"title",price:"price",disc:"discountPercent",start:"startDate",end:"endDate",stock:"stock"};
function fieldRow(lbl,key,val,type,ctx){
 var r=document.createElement("div");r.style.cssText="display:flex;gap:6px;align-items:center;margin:4px 0";
 var cur=key==="price"?'<select class="f9cur" style="width:52px;background:#111;color:#fff;border:1px solid #444;border-radius:6px;padding:6px"><option>৳</option><option>$</option><option>€</option><option>₹</option></select>':"";
 r.innerHTML='<span style="color:#888;font-size:11px;min-width:96px">'+lbl+'</span>'+cur+'<input class="f9" data-k="'+key+'" type="'+(type||"text")+'" value="'+(val==null?"":String(val).replace(/"/g,"&quot;"))+'" style="flex:1;min-width:70px;background:#111;color:#fff;border:1px solid #444;border-radius:6px;padding:6px">'+
 '<button class="f9e" style="background:#2980b9;color:#fff;border:none;border-radius:6px;padding:6px 8px;font-weight:700">✏️</button>'+
 '<button class="f9s" style="background:#27ae60;color:#fff;border:none;border-radius:6px;padding:6px 8px;font-weight:700">💾</button>';
 if(key==="price"){var s=r.querySelector(".f9cur");if(s)s.value=symOf(ctx);}
 r.querySelector(".f9e").onclick=function(){var inp=r.querySelector(".f9");var v=prompt(lbl+" — নতুন মান:",inp.value);if(v!==null){inp.value=v;inp.dispatchEvent(new Event("input"));toast("✏️ বসল — 💾 চাপুন");}};
 r.querySelector(".f9s").onclick=function(){
  var inp=r.querySelector(".f9");var v=inp.value;
  if(key==="price"){var cs=r.querySelector(".f9cur");if(cs&&ctx&&ctx.id){META[ctx.id]=META[ctx.id]||{};META[ctx.id].currency=cs.value;DB().then(function(o){return o.m.update(o.m.ref(o.db),{["settings/homeProductMeta/"+ctx.id+"/currency"]:cs.value});});}}
  if(!ctx||!ctx.id||ctx.isNew){toast("✅ কার্ডে সেভ — নিচের বড় 💾 বাটনে Firebase যাবে");return;}
  var up={};up["products/"+ctx.id+"/"+FMAP[key]]=(key==="price"||key==="disc"||key==="stock")?(+v||0):v;
  if(key==="price"||key==="disc"){var cd9=r.closest(".c9");if(cd9){var gp9=function(k){var i=cd9.querySelector('.f9[data-k="'+k+'"]');return i?(+i.value||0):0;};var d99=gp9("disc");var p99=gp9("price");up["products/"+ctx.id+"/price"]=d99>0?curOf(p99,d99):p99;up["products/"+ctx.id+"/discountPrice"]=d99>0?p99:null;up["products/"+ctx.id+"/discountPercent"]=d99;}}
  DB().then(function(o){return o.m.update(o.m.ref(o.db),up);}).then(function(){modal(["✅ Firebase সেভ: "+lbl+" = "+v]);recalc(r.closest(".c9"));}).catch(function(e){toast("❌ "+e.message,"#c0392b");});
 };
 return r;
}
function recalc(card){if(!card)return;var g=function(k){var i=card.querySelector('.f9[data-k="'+k+'"]');return i?i.value:"";};
 var price=+g("price")||0,disc=+g("disc")||0,cur=curOf(price,disc);
 var c=card.querySelector(".cur9");if(c)c.innerHTML=disc>0?('<s style="color:#888">'+symOf(card.__ctx)+price+'</s> → <b style="color:#7CFC00">'+symOf(card.__ctx)+cur+'</b>'):(symOf(card.__ctx)+cur);
 var o=card.querySelector(".old9");if(o)o.innerHTML=disc>0?('<s style="color:#ff9999">'+symOf(card.__ctx)+price+'</s>'):('<span style="color:#fff">'+symOf(card.__ctx)+price+'</span>');
}
function buildCard(p,isNew){
 var card=document.createElement("div");card.className="c9";
 card.style.cssText="background:#141c26;border:1px solid #333;border-radius:10px;padding:10px;margin:8px 0";
 card.__ctx=p;
 var img=p.img||"";
 card.innerHTML='<div style="display:flex;gap:8px;align-items:center"><input type="checkbox" class="chk9"><img class="im9" src="'+(img||"https://via.placeholder.com/80?text=IMG")+'" style="width:64px;height:64px;object-fit:cover;border-radius:8px;cursor:pointer;border:1px solid #444"><b style="color:#fff;font-size:13px;flex:1">'+(isNew?"🆕 নতুন পণ্য":(p.title||""))+'</b></div>';
 card.querySelector(".im9").onclick=function(){if(img)lightbox(img);else toast("❌ ছবি নেই","#c0392b");};
 var box=document.createElement("div");card.appendChild(box);
 box.appendChild(fieldRow("পণ্যের নাম","title",p.title||"",  "text",p));
 var orig9=(p.discountPrice&&+p.discountPrice>+p.price)?+p.discountPrice:(p.price||"");box.appendChild(fieldRow("পণ্যের দাম","price",orig9,"number",p));
 var orow=document.createElement("div");orow.style.cssText="display:flex;gap:6px;align-items:center;margin:4px 0";orow.innerHTML='<span style="color:#888;font-size:11px;min-width:96px">অরিজিনাল দাম</span><span class="old9" style="color:#fff;font-size:13px"></span>';box.appendChild(orow);
 box.appendChild(fieldRow("ডিসকাউন্ট %","disc",p.discountPercent||"","number",p));
 var crow=document.createElement("div");crow.style.cssText="display:flex;gap:6px;align-items:center;margin:4px 0";crow.innerHTML='<span style="color:#888;font-size:11px;min-width:96px">বর্তমান দাম</span><span class="cur9" style="color:#7CFC00;font-weight:800;font-size:13px"></span>';box.appendChild(crow);
 box.appendChild(fieldRow("অফার শুরু","start",p.startDate||"","date",p));
 box.appendChild(fieldRow("অফার শেষ","end",p.endDate||"","date",p));
 box.appendChild(fieldRow("স্টক","stock",p.stock==null?"":p.stock,"number",p));
 var btns=document.createElement("div");btns.style.cssText="display:flex;gap:8px;margin-top:8px";
 if(isNew){
  btns.innerHTML='<button class="big9" style="flex:1;background:#27ae60;color:#fff;border:none;border-radius:8px;padding:12px;font-weight:900">💾 পণ্য সেভ (সব জায়গায়)</button><button class="rm9" style="background:#c0392b;color:#fff;border:none;border-radius:8px;padding:12px 14px;font-weight:800">🗑️</button>';
  btns.querySelector(".rm9").onclick=function(){card.remove();};
  btns.querySelector(".big9").onclick=function(){saveNew(card);};
 }else{
  btns.innerHTML='<button class="sv9" style="flex:1;background:#27ae60;color:#fff;border:none;border-radius:8px;padding:10px;font-weight:800">💾 পণ্য সেভ (সব জায়গায়)</button><button class="dl9" style="background:#c0392b;color:#fff;border:none;border-radius:8px;padding:10px 14px;font-weight:800">🗑️ ডিলিট</button>';
  btns.querySelector(".sv9").onclick=function(){saveCardAll(card);};
  btns.querySelector(".dl9").onclick=function(){delProd(p,card);};
 }
 card.appendChild(btns);
 card.addEventListener("input",function(){recalc(card);});
 var chk9=card.querySelector(".chk9");if(chk9){chk9.checked=true;chk9.onchange=updateMarkCount;}
 recalc(card);
 return card;
}
function saveNew(card){
 var g=function(k){var i=card.querySelector('.f9[data-k="'+k+'"]');return i?i.value:"";};
 var name=g("title").trim();if(!name)return toast("❌ পণ্যের নাম দিন","#c0392b");
 var file=card.__file||null;
 var price=+g("price")||0,disc=+g("disc")||0,stock=+g("stock")||10,st=g("start"),en=g("end");
 var cs=card.querySelector(".f9cur");var curSym=cs?cs.value:"৳";
 var gid=guess(name)||"general";
 var id="p_"+Date.now().toString(36)+Math.random().toString(36).substr(2,4);
 var lines=[];
 function write(url){
  var obj={title:name,price:price,stock:stock,status:"active",sellerId:(window.__mjhUid||"mjh-admin"),categoryId:gid,createdAt:Date.now(),startDate:st||"",endDate:en||"",images:{main:url||""}};
  if(disc>0){obj.discountPercent=disc;obj.discountPrice=price;obj.price=curOf(price,disc);}
  var up={};up["products/"+id]=obj;
  allPaths().forEach(function(pp){up[pp+"/"+id]={id:id,addedAt:Date.now(),startDate:st||"",endDate:en||""};});
  up["settings/homeProductMeta/"+id]={profit:0,createdAt:Date.now(),currency:curSym};
  DB().then(function(o){return o.m.update(o.m.ref(o.db),up);}).then(function(){
   lines.push("🔥 Firebase: ✅");
   lines.push("🏠 হোমপেজ ক্যাটাগরি: "+catPretty(CAT));
   lines.push("🍔 All Category: "+catPretty(gid));
   modal(lines);
   card.remove();load();
  }).catch(function(e){toast("❌ "+e.message,"#c0392b");});
 }
 if(file&&window.MJHCloud&&MJHCloud.upload){MJHCloud.upload(file).then(function(u){lines.push("☁️ Cloudinary: ✅");write(u);}).catch(function(){lines.push("☁️ Cloudinary: ❌ (ছবি ছাড়া সেভ)");write("");});}
 else{lines.push("☁️ Cloudinary: — (ছবি নেই)");write("");}
}
function delProd(p,card){
 if(!confirm("পণ্য মুছবেন? (Firebase + সেকশন + Cloudinary ছবি)"))return;
 var up={};up["products/"+p.id]=null;
 allPaths().forEach(function(pp){up[pp+"/"+p.id]=null;});
 up["settings/homeProductMeta/"+p.id]=null;
 DB().then(function(o){return o.m.update(o.m.ref(o.db),up);}).then(function(){
  card.remove();
  if(p.img&&window.MJHCloud&&MJHCloud.remove){MJHCloud.remove(p.img).then(function(){modal(["🗑️ Firebase: ✅","🗑️ সেকশন ম্যাপ: ✅","🗑️ Cloudinary ছবি: ✅"]);}).catch(function(){modal(["🗑️ Firebase: ✅","🗑️ Cloudinary: ❌"]);});}
  else modal(["🗑️ Firebase: ✅","🗑️ সেকশন ম্যাপ: ✅"]);
 }).catch(function(e){toast("❌ "+e.message,"#c0392b");});
}
var WRAP=null;
function ui(){
 if(WRAP)return;
 var content=document.querySelector(".admin-content")||document.body;
 WRAP=document.createElement("div");WRAP.id="mjh9";
 WRAP.style.cssText="background:#0e1520;border:1px solid #FFD814;border-radius:12px;padding:12px;margin:8px 0";
 WRAP.innerHTML='<h2 style="color:#FFD814;margin:0 0 10px">📦 ক্যাটাগরি নাম: <b id="c9n"></b></h2>'+
 '<div style="display:flex;gap:8px;flex-wrap:wrap;margin-bottom:8px">'+
 '<input id="s9" placeholder="🔍 products search box (যেকোনোভাবে সার্চ দিন)" style="flex:2;min-width:160px;background:#111;color:#fff;border:1px solid #444;border-radius:6px;padding:10px">'+
 '<input id="f9" type="file" accept="image/*" multiple style="flex:1;min-width:140px;background:#111;color:#fff;border:1px solid #444;border-radius:6px;padding:8px">'+
 '</div>'+
 '<div id="g9"></div>'+
 '<div style="display:flex;gap:8px;flex-wrap:wrap;align-items:center;margin-bottom:8px">'+
 '<label style="color:#fff;font-size:12px;display:flex;gap:6px;align-items:center"><input id="ma9" type="checkbox"> মার্ক অল</label><span id="m9c" style="color:#88ccff;font-size:12px;font-weight:700"></span>'+
 '<button id="sa9" style="background:#27ae60;color:#fff;border:none;border-radius:6px;padding:10px 14px;font-weight:800">💾 সব সেভ</button>'+
 '<button id="da9" style="background:#c0392b;color:#fff;border:none;border-radius:6px;padding:10px 14px;font-weight:800">🗑️ সব ডিলিট</button>'+
 '</div>'+
 '<div id="new9"></div>'+
 '<h3 style="color:#88ccff;margin:12px 0 6px"> এই ক্যাটাগরিতে আগের পণ্য (<span id="c9c">0</span>)</h3>'+
 '<div id="old9l"></div>';
 content.insertBefore(WRAP,content.firstChild);
 document.getElementById("c9n").textContent=catPretty(CAT)||CAT;
 document.getElementById("f9").onchange=function(){
  var fs=this.files;for(var i=0;i<fs.length;i++){
   var f=fs[i];var url=URL.createObjectURL(f);
   var p={id:null,isNew:true,img:url,title:f.name.replace(/\.[^.]+$/,"").replace(/[-_]+/g," "),price:"",discountPercent:"",startDate:"",endDate:"",stock:10};
   var c=buildCard(p,true);c.__file=f;document.getElementById("new9").appendChild(c);
  }
  toast("🆕 "+fs.length+"টা নতুন কার্ড —.fill করে 💾 চাপুন");
 };
 document.getElementById("ma9").onchange=function(){document.querySelectorAll(".chk9").forEach(function(c){c.checked=this.checked;}.bind(this));updateMarkCount();};
 document.getElementById("sa9").onclick=function(){
  var news=[].slice.call(document.querySelectorAll("#new9 .c9"));
  var olds=[].slice.call(document.querySelectorAll("#old9l .c9"));
  if(!news.length&&!olds.length)return toast("❌ কিছু নেই","#c0392b");
  var up={};var add=0,rem=0;
  var cur=(SEC||"settings/globalCategoryProducts")+"/"+CAT;
  olds.forEach(function(c){
   var p=c.__ctx||{};var id=p.id;if(!id)return;
   var chk=c.querySelector(".chk9");var on=chk?chk.checked:true;
   if(on){var st9=(c.querySelector('.f9[data-k="start"]')||{}).value||"";var en9=(c.querySelector('.f9[data-k="end"]')||{}).value||"";allPaths().forEach(function(pp){up[pp+"/"+id]={id:id,addedAt:p.__addedAt||Date.now(),startDate:st9,endDate:en9};});add++;}
   else{allPaths().forEach(function(pp){up[pp+"/"+id]=null;});rem++;}
  });
  news.forEach(function(c){saveNew(c);});
  if(Object.keys(up).length){DB().then(function(o){return o.m.update(o.m.ref(o.db),up);}).then(function(){modal(["💾 মার্ক করা পণ্য ক্যাটাগরিতে সেভ হলো (হোম+এডমিন): "+add+" টি","➖ আনমার্ক করে সরানো (পণ্য ডিলিট হয়নি): "+rem+" টি","🆕 Choose Files থেকে নতুন যোগ: "+news.length+" টি"]);load();}).catch(function(e){toast("❌ "+e.message,"#c0392b");});}
  else if(!news.length){toast("✅ কোনো পরিবর্তন নেই");}
 };
 document.getElementById("da9").onclick=function(){
  var ch=[].slice.call(document.querySelectorAll("#old9l .chk9:checked")).map(function(c){return c.closest(".c9");});
  if(!ch.length)return toast("❌ কিছু মার্ক করা হয়নি","#c0392b");
  if(!confirm(ch.length+"টা পণ্য মুছবেন?"))return;
  ch.forEach(function(c){delProd(c.__ctx,c);});
 };
 document.getElementById("s9").oninput=function(){
  var q=this.value.trim().toLowerCase();var qq=q.replace(/\s+/g,"");
  document.querySelectorAll("#old9l .c9").forEach(function(c){
   var t=(c.__ctx.title||"").toLowerCase().replace(/\s+/g,"");
   c.style.display=(!qq||t.indexOf(qq)>-1)?"":"none";
  });
  var gbox=document.getElementById("g9");
  gbox.innerHTML="";
  if(qq.length>1){var n=0;Object.keys(ALLP).forEach(function(id){var p=ALLP[id]||{};var t=(p.title||"").toLowerCase().replace(/\s+/g,"");
   if(t.indexOf(qq)>-1&&n<8){n++;
    var row=document.createElement("div");row.style.cssText="display:flex;gap:8px;align-items:center;margin:4px 0;background:#101c2a;border:1px solid #333;border-radius:8px;padding:6px";
    row.innerHTML='<span style="color:#fff;font-size:12px;flex:1">🔍 '+(p.title||id)+'</span><button style="background:#8e44ad;color:#fff;border:none;border-radius:6px;padding:8px 10px;font-weight:800">➕ এই ক্যাটাগরিতে</button>';
    row.querySelector("button").onclick=function(){var up={};up[(SEC||"settings/globalCategoryProducts")+"/"+CAT+"/"+id]={id:id,addedAt:Date.now()};DB().then(function(o){return o.m.update(o.m.ref(o.db),up);}).then(function(){toast("➕ যোগ হলো: "+(p.title||""));gbox.innerHTML="";load();}).catch(function(e){toast("❌ "+e.message,"#c0392b");});};
    gbox.appendChild(row);
   }});}
 };
}
function removeOld(){
 try{
  document.querySelectorAll("textarea").forEach(function(ta){if((ta.placeholder||"").indexOf("লাইন")>-1){var box=ta;for(var i=0;i<4&&box;i++){box=box.parentNode;if(box&&box.querySelector&&box.querySelector("button"))break;}if(box&&box.textContent.length<900)box.remove();}});
  document.querySelectorAll("div,section").forEach(function(d){
   if(d.closest("#mjh9"))return;
   var t=d.textContent||"";
   if(t.length<3000&&(t.indexOf("BOGO Manager")>-1||t.indexOf("Size / Color / Description")>-1||t.indexOf("সিলেক্টেড % বসান")>-1)){d.remove();}
  });
  document.querySelectorAll("h3").forEach(function(h){var t=h.textContent||"";if(t.indexOf("নতুন পণ্য (")===0||t.indexOf("আগের পণ্য (")===0){var box=h.parentNode;if(box&&box.textContent.length<30000)box.remove();}});
  document.querySelectorAll('input[type="file"]').forEach(function(f){if(f.closest("#mjh9"))return;var box=f;for(var i=0;i<4&&box;i++){box=box.parentNode;if(box&&box.textContent.length>200)break;}if(box&&box.textContent.length<900&&!box.closest("#mjh9"))box.remove();});
 }catch(e){}
}
function allPaths(){var c=CAT||"";return [(SEC||"settings/globalCategoryProducts")+"/"+c,"settings/flashSaleCategoryProducts/"+c,"settings/dealsOfDayCategoryProducts/"+c,"settings/specialCategoryProducts/"+c,"settings/globalCategoryProducts/"+c,"settings/customSectionProducts/"+c,"settings/everydayLowPriceCategoryProducts/"+c,"settings/comboOffersCategoryProducts/"+c,"settings/clearanceOutletCategoryProducts/"+c];}
function saveCardAll(card){
 var p=card.__ctx||{};if(!p.id)return toast("❌ ID নেই","#c0392b");
 var g=function(k){var i=card.querySelector('.f9[data-k="'+k+'"]');return i?i.value:"";};
 var up={};var b="products/"+p.id+"/";
 up[b+"title"]=g("title");var pr9=+g("price")||0,dc9=+g("disc")||0;up[b+"price"]=dc9>0?curOf(pr9,dc9):pr9;up[b+"discountPercent"]=dc9;up[b+"discountPrice"]=dc9>0?pr9:null;up[b+"startDate"]=g("start");up[b+"endDate"]=g("end");up[b+"stock"]=+g("stock")||0;
 var cs=card.querySelector(".f9cur");if(cs)up["settings/homeProductMeta/"+p.id+"/currency"]=cs.value;
 allPaths().forEach(function(pp){up[pp+"/"+p.id]={id:p.id,addedAt:p.__addedAt||Date.now(),startDate:g("start")||"",endDate:g("end")||""};});
 DB().then(function(o){return o.m.update(o.m.ref(o.db),up);}).then(function(){modal(["✅ সব জায়গায় সেভ: "+(g("title")||p.id),"🏠 হোম ক্যাটাগরি: "+catPretty(CAT),"🔥 Firebase: ✅"]);load();}).catch(function(e){toast("❌ "+e.message,"#c0392b");});
}
function updateMarkCount(){var tt=document.querySelectorAll("#old9l .chk9").length;var mm=document.querySelectorAll("#old9l .chk9:checked").length;var el=document.getElementById("m9c");if(el)el.textContent="মার্ক: "+mm+" / "+tt;}
function load(){
 DB().then(function(o){
  return o.m.get(o.m.ref(o.db,"products")).then(function(sn){ALLP=sn.val()||{};
   return o.m.get(o.m.ref(o.db,"settings/homeProductMeta")).then(function(mn){META=mn.val()||{};
    var paths=[(SEC||"settings/globalCategoryProducts")+"/"+(CAT||""),"settings/flashSaleCategoryProducts/"+CAT,"settings/dealsOfDayCategoryProducts/"+CAT,"settings/specialCategoryProducts/"+CAT,"settings/globalCategoryProducts/"+CAT,"settings/customSectionProducts/"+CAT,"settings/everydayLowPriceCategoryProducts/"+CAT,"settings/comboOffersCategoryProducts/"+CAT,"settings/clearanceOutletCategoryProducts/"+CAT];
    return Promise.all(paths.map(function(p){return o.m.get(o.m.ref(o.db,p)).then(function(s2){return {v:s2.val()||{},p:p};}).catch(function(){return {v:{},p:p};});})).then(function(arrs){var mm2={};arrs.forEach(function(o2){Object.keys(o2.v||{}).forEach(function(k){if(!mm2[k])mm2[k]={addedAt:(o2.v[k]||{}).addedAt||0,path:o2.p};});});return mm2;});
   });
  });
 }).then(function(map){
  map=map||{};
  var ids=Object.keys(map);
  ids.sort(function(a,b){return ((map[b]||{}).addedAt||0)-((map[a]||{}).addedAt||0);});
  var box=document.getElementById("old9l");if(!box)return;
  box.innerHTML="";
  var n=0;
  ids.forEach(function(id){
   var p=ALLP[id];if(!p)return;n++;
   p.id=id;p.img=(p.images&&p.images.main)||"";p.__origin=(map[id]&&map[id].path)||((SEC||"settings/globalCategoryProducts")+"/"+CAT);p.__addedAt=(map[id]&&map[id].addedAt)||0;
   box.appendChild(buildCard(p,false));
  });
  document.getElementById("c9c").textContent=n;
 }).catch(function(e){toast("❌ লোড: "+e.message,"#c0392b");});
}
function boot(){ui();load();loadCats(function(){});var hi=0;var hid=setInterval(function(){removeOld();if(++hi>150)clearInterval(hid);},800);}
if(document.readyState==="loading"){document.addEventListener("DOMContentLoaded",function(){setTimeout(boot,600);});}
else setTimeout(boot,600);
})();
