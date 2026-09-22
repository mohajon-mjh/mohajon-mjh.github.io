/* MJH hp-enhance v1 - All Category auto sync + profit + strikethrough + per-row Edit/Save */
(function(){
"use strict";
var CATS=[];
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
 up["settings/homeProductMeta/"+id+"/updatedAt"]=Date.now();
 DB().then(function(o){return o.m.update(o.m.ref(o.db),up).then(function(){toast("✅ সেভ হয়েছে"+(sel&&sel.value?" + All Category-তে যোগ হলো":""));});}).catch(function(e){toast("❌ "+e.message,"#c0392b");});
}
function enhance(card){
 if(!card||card.dataset.enh)return;card.dataset.enh="1";
 var b=card.querySelector("b");var title=b?b.textContent:"";
 var row=document.createElement("div");
 row.style.cssText="display:flex;gap:6px;flex-wrap:wrap;margin:6px 0";
 row.innerHTML='<select class="pCat" style="flex:1;min-width:150px;background:#111;color:#fff;border:1px solid #444;border-radius:6px;padding:6px"><option value="">— All Category (auto) —</option></select>'+
  '<input class="pProfit" type="number" placeholder="💹 লাভ (৳)" style="width:100px;background:#12241a;color:#7CFC00;border:1px solid #2e5f4a;border-radius:6px;padding:6px">'+
  '<button type="button" class="eEdit" style="background:#2980b9;color:#fff;border:none;border-radius:6px;padding:6px 10px;font-weight:700">✏️ Edit</button>'+
  '<button type="button" class="eSave" style="background:#27ae60;color:#fff;border:none;border-radius:6px;padding:6px 10px;font-weight:700">💾 Save</button>';
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
 card.addEventListener("input",function(){refresh(card);});
 refresh(card);
}
function addBulk(){
 var list=document.getElementById("pList");if(!list)return;
 if(document.getElementById("enhBulk"))return;
 var bar=document.createElement("div");bar.id="enhBulk";
 bar.style.cssText="display:flex;gap:8px;flex-wrap:wrap;margin:8px 0;padding:10px;background:#1a242f;border:1px solid #FFD814;border-radius:8px";
 bar.innerHTML='<select id="enhBulkCat" style="flex:1;min-width:160px;background:#111;color:#fff;border:1px solid #444;border-radius:6px;padding:8px"><option value="">— সিলেক্টেডগুলোতে All Category —</option></select>'+
  '<button type="button" id="enhBulkApply" style="background:#8e44ad;color:#fff;border:none;border-radius:6px;padding:8px 12px;font-weight:800">☑️ সিলেক্টেডগুলোতে বসান + Save</button>';
 list.parentNode.insertBefore(bar,list);
 loadCats(function(){
  var s2=document.getElementById("enhBulkCat");var h='<option value="">— সিলেক্টেডগুলোতে All Category —</option>';
  for(var i=0;i<CATS.length;i++){h+='<option value="'+CATS[i][1]+'">'+CATS[i][0]+'</option>';}
  s2.innerHTML=h;
 });
 document.getElementById("enhBulkApply").onclick=function(){
  var v=document.getElementById("enhBulkCat").value;
  var cards=[].slice.call(document.querySelectorAll(".pChk:checked")).map(function(c){return c.closest(".pCard");}).filter(Boolean);
  if(!cards.length)return toast("❌ কিছু সিলেক্ট করুন","#c0392b");
  cards.forEach(function(cd){if(v){var s3=cd.querySelector(".pCat");if(s3)s3.value=v;}saveCard(cd);});
 };
}
var mo=new MutationObserver(function(){
 document.querySelectorAll(".pCard").forEach(enhance);
 addBulk();
});
mo.observe(document.body,{childList:true,subtree:true});
loadCats(function(){});
})();
