/* mjh-bulk-studio-v6 */
(function(){
var LINKS={fb:"https://www.facebook.com/share/1DPYY5nJUc/",fbPage:"https://www.facebook.com/share/19RaTzdDW5/",tiktok:"https://www.tiktok.com/@jsa.media.studio",insta:"https://www.instagram.com/jsamediastudio",yt:"https://www.youtube.com/@JSAMediaStudio",dm:"https://www.dailymotion.com/user/jsamediastudi",snap:"https://www.snapchat.com/add/jsaaimediastudi",site:"https://mohajon-mjh.github.io",wa:"+966550171314"};
var items=[],catSlug="",secPath=null,secCleared=false,blobUrl=null,blobObj=null,tokensIdx=[],tokensAdm=[],CLOUD=null,PRESET=null,musicBuf=null;
function el(t,h){var d=document.createElement(t);if(h)d.innerHTML=h;return d;}
function toast(msg){var t=el("div",msg);t.style.cssText="position:fixed;bottom:70px;left:50%;transform:translateX(-50%);background:#111;color:#4ade80;padding:10px 18px;border-radius:20px;font-size:13px;font-weight:700;z-index:999999;border:1px solid #16a34a;max-width:90%";document.body.appendChild(t);setTimeout(function(){t.remove();},3500);}
function norm(s){return String(s||"").toLowerCase().replace(/[^a-z0-9]+/g,"");}
function numFrom(line){var m=String(line).replace(/,/g,"").match(/\d+(\.\d+)?/g);if(!m)return null;return parseFloat(m[m.length-1]);}
function addBtn(){
 if(document.getElementById("ssBtn"))return;
 var b=el("button","📱 Social Media Post / Share");b.id="ssBtn";
 b.style.cssText="position:fixed;bottom:230px;right:10px;z-index:99998;padding:12px 16px;background:#16a34a;color:#fff;border:none;border-radius:30px;font-weight:800;cursor:pointer;font-size:14px;box-shadow:0 4px 14px rgba(0,0,0,.4)";
 b.onclick=function(){if(document.getElementById("ssModal"))document.getElementById("ssModal").remove();openStudio();};
 document.body.appendChild(b);
}
function loadTokens(){
 fetch("index.html").then(function(r){return r.text();}).then(function(t){
  tokensIdx=(t.match(/settings\/[A-Za-z_\/]+/g)||[]).map(function(s){return s.replace(/\/+$/,"");});
 });
 fetch("admin.html").then(function(r){return r.text();}).then(function(t){
  tokensAdm=(t.match(/settings\/[A-Za-z_\/]+/g)||[]).map(function(s){return s.replace(/\/+$/,"");});
  var cm=t.match(/v1_1\/([A-Za-z0-9_-]+)\//);if(cm)CLOUD=cm[1];
  var pm=t.match(/upload_preset["']?\s*[:=]\s*["']([A-Za-z0-9_]+)/);if(pm)PRESET=pm[1];
 });
}
function sectionPathFor(v){
 var s=norm(v),word="";
 if(s.indexOf("trend")>-1||s.indexOf("trand")>-1)word="trend";
 else if(s.indexOf("feature")>-1)word="feature";
 else if(s.indexOf("flash")>-1)word="flash";
 else if(s.indexOf("deal")>-1)word="deal";
 else if(s.indexOf("coming")>-1)word="coming";
 var slug=v.toLowerCase().trim().replace(/\s+/g,"_");
 var all=tokensIdx.concat(tokensAdm);
 if(word){
  for(var i=0;i<tokensIdx.length;i++){var k=tokensIdx[i];if(k.toLowerCase().indexOf(word)>-1&&k.indexOf("globalCategory")===-1&&k.split("/").length===3)return k;}
  for(var j=0;j<tokensAdm.length;j++){var k2=tokensAdm[j];if(k2.toLowerCase().indexOf(word)>-1&&k2.indexOf("globalCategory")===-1&&k2.split("/").length===3)return k2;}
 }
 for(var g=0;g<all.length;g++){if(all[g]==="settings/globalCategoryProducts")return "settings/globalCategoryProducts/"+slug;}
 if(word==="trend")return "settings/trendingProducts";
 if(word==="feature")return "settings/featuredProducts";
 if(word==="deal")return "settings/dealsOfDayCategoryProducts";
 if(word==="flash")return "settings/flashSaleCategoryProducts";
 if(word==="coming")return "settings/comingSoonProducts";
 return "settings/globalCategoryProducts/"+slug;
}
function upCloud(data){
 if(!CLOUD||!PRESET)return Promise.resolve(null);
 return Promise.race([
  fetch("https://api.cloudinary.com/v1_1/"+CLOUD+"/image/upload",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({file:data,upload_preset:PRESET})}).then(function(r){return r.json();}).then(function(j){return j.secure_url||null;}),
  new Promise(function(res){setTimeout(function(){res(null);},9000);})
 ]).catch(function(){return null;});
}
function shrink(data,max,q){
 return new Promise(function(res){var im=new Image();im.onload=function(){var cv=document.createElement("canvas"),sc=Math.min(1,max/Math.max(im.width,im.height));cv.width=im.width*sc;cv.height=im.height*sc;cv.getContext("2d").drawImage(im,0,0,cv.width,cv.height);res(cv.toDataURL("image/jpeg",q));};im.onerror=function(){res(data);};im.src=data;});
}
function openStudio(){
 loadTokens();
 var m=el("div");m.id="ssModal";
 m.style.cssText="position:fixed;inset:0;background:rgba(0,0,0,.82);z-index:99999;overflow:auto;padding:12px";
 m.innerHTML='<div style="max-width:820px;margin:auto;background:#111;color:#fff;border-radius:14px;padding:14px;font-size:13px">'
 +'<h2 style="margin:0 0 10px">📱 Bulk Product + Social Studio v6</h2>'
 +'<div style="display:flex;gap:6px;flex-wrap:wrap;align-items:center"><input id="ssFiles" type="file" accept="image/*" multiple style="flex:1;min-width:160px">'
 +'<button id="ssMarkAll" style="background:#2563eb;color:#fff;border:none;padding:9px 10px;border-radius:8px;font-weight:700">✅ সিলেক্ট মার্ক অল</button>'
 +'<button id="ssDelAll" style="background:#dc2626;color:#fff;border:none;padding:9px 10px;border-radius:8px;font-weight:700">🗑️ ডিলিট মার্ক অল</button>'
 +'<button id="ssSaveAll" style="background:#16a34a;color:#fff;border:none;padding:9px 10px;border-radius:8px;font-weight:700">💾 সেভ মার্ক অল</button>'
 +'<button id="ssFix" style="background:#f59e0b;color:#fff;border:none;padding:9px 10px;border-radius:8px;font-weight:700">🧹 ভারী পণ্য ফিক্স</button></div>'
 +'<div style="display:flex;gap:6px;margin-top:8px"><input id="ssPrices" placeholder="নাম — দাম পেস্ট করুন (এক লাইনেও চলবে)" style="flex:1;padding:8px"><button id="ssPriceSave" style="background:#16a34a;color:#fff;border:none;padding:9px 12px;border-radius:8px;font-weight:700">দাম সেভ</button></div>'
 +'<div style="display:flex;gap:6px;margin-top:6px;flex-wrap:wrap"><input id="ssPct" type="number" placeholder="%" style="width:90px;padding:8px"><button id="ssPctSave" style="background:#16a34a;color:#fff;border:none;padding:9px 12px;border-radius:8px;font-weight:700">% অল সেভ</button>'
 +'<input id="ssStart" type="date" style="padding:6px"><input id="ssEnd" type="date" style="padding:6px"><button id="ssDateSave" style="background:#16a34a;color:#fff;border:none;padding:9px 12px;border-radius:8px;font-weight:700">তারিখ সেভ</button></div>'
 +'<div style="display:flex;gap:6px;margin-top:6px"><input id="ssDetails" placeholder="ডিটেইলস (সব পণ্যে একই)" style="flex:1;padding:8px"><button id="ssDetSave" style="background:#16a34a;color:#fff;border:none;padding:9px 12px;border-radius:8px;font-weight:700">ডিটেইলস সেভ</button></div>'
 +'<div style="display:flex;gap:6px;margin-top:6px"><input id="ssCat" placeholder="ক্যাটাগরি/সেকশন: Trending Products, men_fashion..." style="flex:1;padding:8px"><button id="ssCatSave" style="background:#16a34a;color:#fff;border:none;padding:9px 12px;border-radius:8px;font-weight:700">ক্যাটাগরি সেভ</button></div>'
 +'<button id="ssSocial" style="margin-top:10px;width:100%;background:#7c3aed;color:#fff;border:none;padding:12px;border-radius:10px;font-weight:800;font-size:15px">📱 সোসাল মিডিয়ায় পোস্ট / শেয়ার</button>'
 +'<div id="ssSocPanel" style="display:none;margin-top:8px;background:#1e1b4b;border-radius:10px;padding:8px"><div style="display:flex;gap:6px;flex-wrap:wrap;align-items:center">'
 +'<button id="ssVMark" style="background:#2563eb;color:#fff;border:none;padding:9px 10px;border-radius:8px;font-weight:700">✅ সিলেক্ট মার্ক অল</button>'
 +'<button id="ssVMake" style="background:#16a34a;color:#fff;border:none;padding:9px 10px;border-radius:8px;font-weight:700">🎬 ভিডিও মেক</button>'
 +'<button id="ssVLive" style="background:#0ea5e9;color:#fff;border:none;padding:9px 10px;border-radius:8px;font-weight:700">📺 ভিডিও লাইভ</button>'
 +'<button id="ssVShare" style="background:#f59e0b;color:#fff;border:none;padding:9px 10px;border-radius:8px;font-weight:700">📤 শেয়ার</button>'
 +'<button id="ssVPost" style="background:#dc2626;color:#fff;border:none;padding:9px 10px;border-radius:8px;font-weight:700">📢 পোস্ট</button></div>'
 +'<div style="display:flex;gap:6px;margin-top:6px;flex-wrap:wrap;align-items:center"><select id="ssMusicSel" style="padding:7px;background:#111;color:#fff;border:1px solid #374151;border-radius:6px"><option value="upbeat">🎵 আপবিট পপ (কপিরাইট ফ্রি)</option><option value="energy">⚡ এনার্জেটিক বিট</option><option value="soft">🎹 সফট পিয়ানো</option><option value="dance">🥁 ড্যান্স বিট</option><option value="none">🔇 মিউজিক নেই</option></select>'
 +'<label style="color:#fff;font-size:11px">অথবা নিজের রয়্যালটি-ফ্রি mp3: <input id="ssMusicFile" type="file" accept="audio/*" style="max-width:160px"></label></div>'
 +'<div id="ssPostLinks" style="margin-top:6px"></div></div>'
 +'<div id="ssProg" style="margin:8px 0;color:#facc15"></div>'
 +'<video id="ssVideo" controls style="width:100%;max-height:380px;display:none;border-radius:10px"></video>'
 +'<h3 style="margin:12px 0 6px">🛍️ পণ্য লিস্ট (<span id="ssCount">0</span>/28)</h3><div id="ssList"></div>'
 +'<button id="ssClose" style="margin-top:10px;background:#dc2626;color:#fff;border:none;padding:10px 16px;border-radius:10px;font-weight:700">✖ বন্ধ</button></div>';
 document.body.appendChild(m);
 document.getElementById("ssClose").onclick=function(){m.remove();};
 document.getElementById("ssFiles").onchange=onFiles;
 document.getElementById("ssMarkAll").onclick=function(){items.forEach(function(it){it.mark=true;});renderList();toast("✅ সব মার্ক হয়েছে");};
 document.getElementById("ssDelAll").onclick=function(){items=items.filter(function(it){return !it.mark;});renderList();toast("🗑️ মার্ক করা সব ডিলিট");};
 document.getElementById("ssSaveAll").onclick=saveMarked;
 document.getElementById("ssFix").onclick=fixHeavy;
 document.getElementById("ssPriceSave").onclick=savePrices;
 document.getElementById("ssPctSave").onclick=function(){var v=document.getElementById("ssPct").value;items.forEach(function(it){it.pct=v;});renderList();toast("✅ সব % সেভ হয়েছে");};
 document.getElementById("ssDateSave").onclick=function(){var s=document.getElementById("ssStart").value,e=document.getElementById("ssEnd").value;items.forEach(function(it){it.start=s;it.end=e;});renderList();toast("✅ তারিখ সেভ হয়েছে");};
 document.getElementById("ssDetSave").onclick=function(){var v=document.getElementById("ssDetails").value;items.forEach(function(it){it.details=v;});renderList();toast("✅ ডিটেইলস সেভ হয়েছে");};
 document.getElementById("ssCatSave").onclick=function(){
  var v=(document.getElementById("ssCat").value||"").trim();
  if(!v){toast("❌ ক্যাটাগরি লিখুন");return;}
  catSlug=v.toLowerCase().replace(/\s+/g,"_");
  secPath=sectionPathFor(v);secCleared=false;
  toast("✅ ক্যাটাগরি → "+secPath);
 };
 document.getElementById("ssSocial").onclick=function(){var p=document.getElementById("ssSocPanel");p.style.display=p.style.display==="none"?"block":"none";};
 document.getElementById("ssVMark").onclick=function(){items.forEach(function(it){it.mark=true;});renderList();toast("✅ ভিডিওর জন্য সব মার্ক");};
 document.getElementById("ssVMake").onclick=makeVideo;
 document.getElementById("ssVLive").onclick=function(){var v=document.getElementById("ssVideo");if(v.src){v.style.display="block";v.play();}else toast("❌ আগে ভিডিও বানান");};
 document.getElementById("ssVShare").onclick=shareVideo;
 document.getElementById("ssMusicFile").onchange=function(){
  var f=this.files[0];if(!f){musicBuf=null;return;}
  var r=new FileReader();r.onload=function(e){musicBuf=e.target.result;toast("🎵 আপনার mp3 লোড হয়েছে");};r.readAsArrayBuffer(f);
 };
 document.getElementById("ssVPost").onclick=function(){
  var box=document.getElementById("ssPostLinks");box.innerHTML="";
  var enc=encodeURIComponent(caption()),u=encodeURIComponent(LINKS.site);
  [["📘 Facebook",LINKS.fb],["📘 FB Page",LINKS.fbPage],["🎵 TikTok",LINKS.tiktok],["📸 Instagram",LINKS.insta],["▶️ YouTube",LINKS.yt],["🎬 Dailymotion",LINKS.dm],["👻 Snapchat",LINKS.snap],["💬 WhatsApp","https://wa.me/?text="+enc],["📘 FB Share","https://www.facebook.com/sharer/sharer.php?u="+u]].forEach(function(s){
   var a=el("a",s[0]);a.href=s[1];a.target="_blank";a.style.cssText="display:inline-block;margin:3px;padding:8px 10px;background:#16a34a;color:#fff;border-radius:8px;text-decoration:none;font-size:12px;font-weight:700";box.appendChild(a);
  });
  toast("📢 লিঙ্কে ক্লিক করুন");
 };
 renderList();
}
function parsePrices(text){
 var out=[],re=/৳\s*([\d,\.]+)/g,m,last=0;
 while((m=re.exec(text))){
  var seg=text.slice(last,m.index);
  var name=seg.replace(/[—–]/g," ").replace(/^[\d,\.]+/,"").replace(/\s+/g," ").trim();
  out.push({n:norm(name),p:parseFloat(m[1].replace(/,/g,"")),used:false});
  last=re.lastIndex;
 }
 if(!out.length){
  re=/—\s*([\d,\.]+)/g;last=0;
  while((m=re.exec(text))){
   var seg2=text.slice(last,m.index);
   var nm2=seg2.replace(/[—–]/g," ").replace(/^[\d,\.]+/,"").replace(/\s+/g," ").trim();
   out.push({n:norm(nm2),p:parseFloat(m[1].replace(/,/g,"")),used:false});
   last=re.lastIndex;
  }
 }
 return out;
}
function savePrices(){
 var text=(document.getElementById("ssPrices").value||"");
 var pairs=parsePrices(text),ord=[];
 if(!pairs.length){text.split(/[\n,]+/).forEach(function(ln){var p=numFrom(ln);if(p!==null)ord.push(p);});}
 var oi=0,matched=0;
 items.forEach(function(it){
  var nm=norm(it.name),found=null;
  for(var i=0;i<pairs.length;i++){
   if(!pairs[i].used&&nm.length>=4&&pairs[i].n.length>=4&&(pairs[i].n===nm||pairs[i].n.indexOf(nm)>-1||nm.indexOf(pairs[i].n)>-1)){found=pairs[i];break;}
  }
  if(found){found.used=true;it.price=found.p;matched++;}
 });
 if(matched===0&&pairs.length){
  items.forEach(function(it,i){if(pairs[i]){it.price=pairs[i].p;}});
  ord=pairs.map(function(p){return p.p;});
 }
 else if(ord.length){items.forEach(function(it){if(!it.price&&ord.length)it.price=ord.shift();});}
 renderList();
 toast("✅ দাম v6: মিল="+matched+" জোড়া="+pairs.length+(matched===0&&pairs.length?" (ক্রমে বসল)":""));
}
function onFiles(){
 var fs=Array.prototype.slice.call(this.files,0,28-items.length);
 fs.forEach(function(f){
  var name=f.name.replace(/\.[^.]+$/,"").replace(/[-_]+/g," ").trim();
  var r=new FileReader();
  r.onload=function(e){
   var im=new Image();
   im.onload=function(){
    var cv=document.createElement("canvas"),sc=Math.min(1,900/Math.max(im.width,im.height));
    cv.width=im.width*sc;cv.height=im.height*sc;
    cv.getContext("2d").drawImage(im,0,0,cv.width,cv.height);
    if(items.length<28){items.push({name:name,data:cv.toDataURL("image/jpeg",0.78),img:im,price:"",pct:"",start:"",end:"",details:"",mark:false,saved:false});renderList();}
   };
   im.src=e.target.result;
  };
  r.readAsDataURL(f);
 });
 toast("⏳ ছবি লোড হচ্ছে...");
}
function renderList(){
 document.getElementById("ssCount").textContent=items.length;
 var box=document.getElementById("ssList");box.innerHTML="";
 items.forEach(function(it,i){
  var c=el("div");c.setAttribute("data-i",i);
  c.style.cssText="background:#1f2937;border-radius:10px;padding:8px;margin:6px 0;display:flex;gap:8px;align-items:flex-start";
  c.innerHTML='<img src="'+it.data+'" style="width:54px;height:54px;object-fit:cover;border-radius:8px">'
  +'<div style="flex:1"><input class="f-name" value="'+it.name.replace(/"/g,"&quot;")+'" style="width:100%;padding:6px;background:#111;color:#fff;border:1px solid #374151;border-radius:6px">'
  +'<div style="display:flex;gap:4px;flex-wrap:wrap;margin-top:4px"><input class="f-price" placeholder="দাম ৳" value="'+it.price+'" style="width:70px;padding:5px;background:#111;color:#fff;border:1px solid #374151;border-radius:6px"><input class="f-pct" placeholder="%" value="'+it.pct+'" style="width:44px;padding:5px;background:#111;color:#fff;border:1px solid #374151;border-radius:6px"><input class="f-start" type="date" value="'+it.start+'" style="padding:4px;background:#111;color:#fff;border:1px solid #374151;border-radius:6px"><input class="f-end" type="date" value="'+it.end+'" style="padding:4px;background:#111;color:#fff;border:1px solid #374151;border-radius:6px"></div>'
  +'<input class="f-details" placeholder="ডিটেইলস" value="'+(it.details||"").replace(/"/g,"&quot;")+'" style="width:100%;margin-top:4px;padding:5px;background:#111;color:#fff;border:1px solid #374151;border-radius:6px"></div>'
  +'<div style="display:flex;flex-direction:column;gap:4px;align-items:center"><label style="font-size:10px;color:#fff"><input type="checkbox" class="f-mark"'+(it.mark?" checked":"")+'> মার্ক</label><button class="f-save" style="background:#16a34a;color:#fff;border:none;padding:6px 10px;border-radius:6px">'+(it.saved?"✅":"💾")+'</button><button class="f-del" style="background:#dc2626;color:#fff;border:none;padding:6px 8px;border-radius:6px">🗑️</button></div>';
  box.appendChild(c);
 });
}
document.addEventListener("input",function(e){
 var card=e.target.closest&&e.target.closest("[data-i]");if(!card)return;
 var it=items[+card.getAttribute("data-i")];if(!it)return;
 var c=e.target;
 if(c.classList.contains("f-name"))it.name=c.value;
 if(c.classList.contains("f-price"))it.price=c.value;
 if(c.classList.contains("f-pct"))it.pct=c.value;
 if(c.classList.contains("f-start"))it.start=c.value;
 if(c.classList.contains("f-end"))it.end=c.value;
 if(c.classList.contains("f-details"))it.details=c.value;
 if(c.classList.contains("f-mark"))it.mark=c.checked;
});
document.addEventListener("click",function(e){
 var card=e.target.closest&&e.target.closest("[data-i]");if(!card)return;
 var i=+card.getAttribute("data-i");
 if(e.target.classList.contains("f-del")){items.splice(i,1);renderList();toast("🗑️ ডিলিট হয়েছে");}
 if(e.target.classList.contains("f-save")){saveItem(i).then(renderList);}
});
function fb(){return Promise.all([import("https://www.gstatic.com/firebasejs/12.0.0/firebase-app.js"),import("https://www.gstatic.com/firebasejs/12.0.0/firebase-database.js"),import("https://www.gstatic.com/firebasejs/12.0.0/firebase-auth.js")]).then(function(M){
 var A=M[0],D=M[1],H=M[2];
 var app=A.getApps().length?A.getApp():A.initializeApp({apiKey:"AIzaSyDj_LLHWBgcKfQClnaOUqEtULHhP1vSVxw",databaseURL:"https://mohajon-mjh-default-rtdb.firebaseio.com",projectId:"mohajon-mjh",appId:"1:526105903976:web:f9321c6d68ecbd19d58cdd"});
 return {db:D.getDatabase(app),D:D,auth:H.getAuth(app)};
});}
function prodObj(it,imgUrl,flags){
 var p=+it.price||0,pct=+it.pct||0;
 var o={title:it.name,price:p,description:it.details,images:{main:imgUrl||it.data},status:"active",stock:20,createdAt:Date.now(),sellerId:"bulk-studio"};
 if(pct>0&&p>0)o.discountPrice=Math.round(p*100/(100-pct));
 if(it.start)o.offerStart=new Date(it.start+"T00:00:00").getTime();
 if(it.end)o.offerEnd=new Date(it.end+"T23:59:59").getTime();
 if(catSlug)o.categoryId=catSlug;
 if(flags)Object.assign(o,flags);
 return o;
}
function flagFromCat(v){
 var s=String(v||"").toLowerCase();
 if(s.indexOf("trend")>-1||s.indexOf("trand")>-1)return {isTrending:true};
 if(s.indexOf("feature")>-1)return {isFeatured:true};
 if(s.indexOf("flash")>-1)return {isFlashSale:true};
 if(s.indexOf("deal")>-1)return {isDealsOfDay:true};
 if(s.indexOf("coming")>-1)return {isComingSoon:true};
 return null;
}
function saveItem(i){
 var it=items[i];
 var imgP=Promise.resolve(null);
 if(it.data.indexOf("data:")===0){
  imgP=upCloud(it.data).then(function(url){if(url)return url;return shrink(it.data,500,0.6);});
 }
 return Promise.all([fb(),imgP]).then(function(R){
  var F=R[0],imgUrl=R[1];
  var flags=flagFromCat(catSlug);
  var prod=prodObj(it,imgUrl,flags);
  var ref=F.D.push(F.D.ref(F.db,"products"));
  return F.D.set(ref,prod).then(function(){
   it.saved=true;it.pid=ref.key;
   toast("✅ সেভ: "+it.name+(flags?" ["+Object.keys(flags)[0]+"]":""));
  });
 }).catch(function(e){toast("❌ সেভ ব্যর্থ: "+it.name+" ("+(e.message||e)+")");});
}});
}
function fixHeavy(){
 toast("⏳ ভারী পণ্য খোঁজা হচ্ছে...");
 fb().then(function(F){
  fetch("https://mohajon-mjh-default-rtdb.firebaseio.com/products.json?shallow=true").then(function(r){return r.json();}).then(function(obj){
   var keys=Object.keys(obj||{}).sort().slice(-80);
   var fixed=0,done=0;
   function next(id){
    fetch("https://mohajon-mjh-default-rtdb.firebaseio.com/products/"+id+".json").then(function(r){return r.json();}).then(function(p){
     var fin=function(){done++;if(done===keys.length)toast("✅ ফিক্স সম্পন্ন: "+fixed+" টি হালকা");else next(keys[done]);};
     if(p&&p.images&&p.images.main&&String(p.images.main).indexOf("data:")===0){
      upCloud(p.images.main).then(function(url){
       var apply=function(v){return F.D.set(F.D.ref(F.db,"products/"+id+"/images/main"),v).then(function(){fixed++;fin();});};
       if(url)apply(url);else shrink(p.images.main,500,0.6).then(apply);
      });
     }else fin();
    }).catch(function(){done++;if(done<keys.length)next(keys[done]);else toast("✅ ফিক্স: "+fixed);});
   }
   if(keys.length)next(keys[0]);else toast("❌ কিছু পাওয়া যায়নি");
  });
 });
}
function caption(){return "🛍️ Mohajon MJH-এ নতুন কালেকশন!\n✅ "+items.length+"টি পণ্য — সেরা দামে!\n\n🛒 অর্ডার: "+LINKS.site+"\n📲 WhatsApp: "+LINKS.wa+"\n\n#mohajonmjh #onlineshopping #bangladesh #saudiarabia #jsamediastudio";}
function scheduleMusic(actx,dest,style,dur){
 var master=actx.createGain();master.gain.value=0.16;master.connect(dest);
 var t0=actx.currentTime+0.1;
 var scale=[261.63,293.66,329.63,392.0,440.0,523.25,587.33,659.26];
 var cfg={upbeat:{step:0.24,wave:"triangle",pat:[0,2,4,7,5,4,2,0,3,5,7,5,4,2,1,2],bass:4},
 energy:{step:0.18,wave:"square",pat:[0,0,3,0,5,0,3,0,7,0,5,0,3,0,2,0],bass:2},
 soft:{step:0.5,wave:"sine",pat:[0,4,7,4,2,5,4,2],bass:8},
 dance:{step:0.2,wave:"sawtooth",pat:[0,3,5,3,7,5,3,0,2,4,6,4,7,6,4,2],bass:1}}[style]||{step:0.24,wave:"triangle",pat:[0,2,4,7,5,4,2,0],bass:4};
 for(var t=0;t<dur;t+=cfg.step){
  var si=Math.floor(t/cfg.step);
  var f=scale[cfg.pat[si%cfg.pat.length]];
  var o=actx.createOscillator(),g=actx.createGain();
  o.type=cfg.wave;o.frequency.value=f;
  g.gain.setValueAtTime(0.0001,t0+t);
  g.gain.exponentialRampToValueAtTime(cfg.wave==="square"?0.22:0.5,t0+t+0.02);
  g.gain.exponentialRampToValueAtTime(0.001,t0+t+cfg.step*0.9);
  o.connect(g);g.connect(master);o.start(t0+t);o.stop(t0+t+cfg.step);
  if(si%cfg.bass===0){
   var b=actx.createOscillator(),bg=actx.createGain();
   b.type="sine";b.frequency.value=f/2;
   bg.gain.setValueAtTime(0.0001,t0+t);
   bg.gain.exponentialRampToValueAtTime(0.35,t0+t+0.03);
   bg.gain.exponentialRampToValueAtTime(0.001,t0+t+cfg.step*3);
   b.connect(bg);bg.connect(master);b.start(t0+t);b.stop(t0+t+cfg.step*3);
  }
  if(style==="dance"&&si%2===0){
   var k=actx.createOscillator(),kg=actx.createGain();
   k.type="sine";k.frequency.setValueAtTime(150,t0+t);k.frequency.exponentialRampToValueAtTime(45,t0+t+0.12);
   kg.gain.setValueAtTime(0.5,t0+t);kg.gain.exponentialRampToValueAtTime(0.001,t0+t+0.15);
   k.connect(kg);kg.connect(master);k.start(t0+t);k.stop(t0+t+0.16);
  }
 }
}
function makeVideo(){
 var L=items.filter(function(it){return it.mark;});
 if(!L.length)L=items.slice();
 if(!L.length){toast("❌ আগে পণ্য যোগ করুন");return;}
 var cv=document.createElement("canvas"),W=720,H=1280;cv.width=W;cv.height=H;
 var ctx=cv.getContext("2d"),per=59/L.length;
 var vs=cv.captureStream(30);
 var tracks=vs.getVideoTracks();
 var actx=null;
 var sel=document.getElementById("ssMusicSel").value;
 var startRec=function(){
  var mime=(window.MediaRecorder&&MediaRecorder.isTypeSupported&&MediaRecorder.isTypeSupported("video/mp4"))?"video/mp4":"video/webm";
  var rec=new MediaRecorder(new MediaStream(tracks),{mimeType:mime});
  var chunks=[];rec.ondataavailable=function(e){if(e.data&&e.data.size)chunks.push(e.data);};
  rec.onstop=function(){
   blobObj=new Blob(chunks,{type:mime});blobUrl=URL.createObjectURL(blobObj);
   var v=document.getElementById("ssVideo");v.src=blobUrl;v.style.display="block";
   document.getElementById("ssProg").textContent="✅ ভিডিও রেডি (🎵 মিউজিক সহ)! 📤 শেয়ার / 📢 পোস্ট";
   toast("✅ ৫৯ সেকেন্ডের ভিডিও + মিউজিক তৈরি!");
  };
  var t0=null;rec.start(500);
  function frame(ts){
   if(t0===null)t0=ts;
   var t=(ts-t0)/1000;
   if(t>=59){rec.stop();return;}
   var idx=Math.min(L.length-1,Math.floor(t/per)),it=L[idx];
   ctx.fillStyle="#000";ctx.fillRect(0,0,W,H);
   var im=it.img,r=Math.max(W/im.width,H/im.height),w=im.width*r,h=im.height*r;
   ctx.drawImage(im,(W-w)/2,(H-h)/2,w,h);
   var g=ctx.createLinearGradient(0,H-380,0,H);g.addColorStop(0,"rgba(0,0,0,0)");g.addColorStop(1,"rgba(0,0,0,.92)");
   ctx.fillStyle=g;ctx.fillRect(0,H-380,W,380);
   ctx.textAlign="center";ctx.fillStyle="#f59e0b";ctx.font="bold 42px sans-serif";ctx.fillText("MOHAJON MJH",W/2,66);
   ctx.textAlign="left";ctx.fillStyle="#fff";ctx.font="bold 38px sans-serif";
   var words=String(it.name).split(/\s+/),line="",y=H-280;
   words.forEach(function(wd){var tt=line?line+" "+wd:wd;if(ctx.measureText(tt).width>W-80&&line){ctx.fillText(line,40,y);y+=46;line=wd;}else line=tt;});
   if(line)ctx.fillText(line,40,y);
   ctx.fillStyle="#4ade80";ctx.font="bold 54px sans-serif";ctx.fillText("৳"+(it.price||0),40,y+66);
   if(it.pct){ctx.fillStyle="#dc2626";ctx.beginPath();ctx.arc(W-90,140,60,0,7);ctx.fill();ctx.fillStyle="#fff";ctx.font="bold 34px sans-serif";ctx.textAlign="center";ctx.fillText("-"+it.pct+"%",W-90,152);}
   ctx.textAlign="left";ctx.fillStyle="#facc15";ctx.font="bold 28px sans-serif";ctx.fillText("WhatsApp: "+LINKS.wa,40,H-36);
   ctx.textAlign="right";ctx.fillStyle="rgba(255,255,255,.8)";ctx.font="22px sans-serif";ctx.fillText((idx+1)+"/"+L.length,W-30,56);
   document.getElementById("ssProg").textContent="⏳ রেকর্ড: "+Math.round(t)+" / 59 সেকেন্ড...";
   requestAnimationFrame(frame);
  }
  requestAnimationFrame(frame);
 };
 if(sel!=="none"&&window.AudioContext){
  actx=new AudioContext();
  var dest=actx.createMediaStreamDestination();
  if(musicBuf){
   actx.decodeAudioData(musicBuf.slice(0)).then(function(buf){
    var src=actx.createBufferSource();src.buffer=buf;
    var g=actx.createGain();g.gain.value=0.5;src.connect(g);g.connect(dest);
    src.start(actx.currentTime+0.1);
    tracks=tracks.concat(dest.stream.getAudioTracks());
    startRec();
   }).catch(function(){scheduleMusic(actx,dest,sel,60);tracks=tracks.concat(dest.stream.getAudioTracks());startRec();});
  }else{
   scheduleMusic(actx,dest,sel,60);
   tracks=tracks.concat(dest.stream.getAudioTracks());
   startRec();
  }
 }else startRec();
}
function shareVideo(){
 if(!blobObj){toast("❌ আগে ভিডিও মেক চাপুন");return;}
 var f=new File([blobObj],"mohajon-video."+(blobObj.type.indexOf("mp4")>-1?"mp4":"webm"),{type:blobObj.type});
 if(navigator.canShare&&navigator.canShare({files:[f]})){navigator.share({files:[f],title:"Mohajon MJH",text:caption()}).catch(function(){});}
 else{window.open("https://wa.me/?text="+encodeURIComponent(caption()),"_blank");toast("📤 লিঙ্ক শেয়ার খুলল");}
}
if(document.readyState==="loading")document.addEventListener("DOMContentLoaded",addBtn);else setTimeout(addBtn,1500);
})();function clearOldFlag(flagKey){
 return fb().then(function(F){
  return F.D.get(F.D.ref(F.db,"products")).then(function(snap){
   var s=snap.val()||{};
   var tasks=[];
   Object.keys(s).forEach(function(id){
    if(s[id]&&s[id][flagKey]===true){
     tasks.push(F.D.update(F.D.ref(F.db,"products/"+id),JSON.parse('{"'+flagKey+'":null}')));
    }
   });
   return Promise.all(tasks).then(function(){return tasks.length;});
  });
 });
}
function saveMarked(){
 var mk=items.filter(function(it){return it.mark&&!it.saved;});
 if(!mk.length){toast("❌ মার্ক করা নতুন পণ্য নেই");return;}
 var flags=flagFromCat(catSlug);
 var chain=Promise.resolve();
 if(flags){
  var fk=Object.keys(flags)[0];
  chain=chain.then(function(){
   document.getElementById("ssProg").textContent="⏳ পুরনো "+fk+" মুছে ফেলা হচ্ছে...";
   return clearOldFlag(fk).then(function(n){document.getElementById("ssProg").textContent="✅ "+n+" টি পুরনো "+fk+" সরানো হয়েছে";});
  });
 }
 mk.forEach(function(it){chain=chain.then(function(){return saveItem(items.indexOf(it));});});
 chain.then(function(){renderList();toast("✅ সব পণ্য সেভ! "+(catSlug?catSlug:"")+" → হোমপেজে দেখুন");}).catch(function(e){toast("❌ ব্যর্থ: "+(e.message||e));});
}
function sectionPathFor(v){
 var s=norm(v),word="";
 if(s.indexOf("trend")>-1||s.indexOf("trand")>-1)word="trend";
 else if(s.indexOf("feature")>-1)word="feature";
 else if(s.indexOf("flash")>-1)word="flash";
 else if(s.indexOf("deal")>-1)word="deal";
 else if(s.indexOf("coming")>-1)word="coming";
 var slug=v.toLowerCase().trim().replace(/\s+/g,"_");
 var all=tokensIdx.concat(tokensAdm);
 if(word){
  for(var i=0;i<tokensIdx.length;i++){var k=tokensIdx[i];if(k.toLowerCase().indexOf(word)>-1&&k.indexOf("globalCategory")===-1&&k.split("/").length===3)return k;}
  for(var j=0;j<tokensAdm.length;j++){var k2=tokensAdm[j];if(k2.toLowerCase().indexOf(word)>-1&&k2.indexOf("globalCategory")===-1&&k2.split("/").length===3)return k2;}
 }
 for(var g=0;g<all.length;g++){if(all[g]==="settings/globalCategoryProducts")return "settings/globalCategoryProducts/"+slug;}
 if(word==="trend")return "settings/trendingProducts";
 if(word==="feature")return "settings/featuredProducts";
 if(word==="deal")return "settings/dealsOfDayCategoryProducts";
 if(word==="flash")return "settings/flashSaleCategoryProducts";
 if(word==="coming")return "settings/comingSoonProducts";
 return "settings/globalCategoryProducts/"+slug;
}
function upCloud(data){
 if(!CLOUD||!PRESET)return Promise.resolve(null);
 return Promise.race([
  fetch("https://api.cloudinary.com/v1_1/"+CLOUD+"/image/upload",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({file:data,upload_preset:PRESET})}).then(function(r){return r.json();}).then(function(j){return j.secure_url||null;}),
  new Promise(function(res){setTimeout(function(){res(null);},9000);})
 ]).catch(function(){return null;});
}
function shrink(data,max,q){
 return new Promise(function(res){var im=new Image();im.onload=function(){var cv=document.createElement("canvas"),sc=Math.min(1,max/Math.max(im.width,im.height));cv.width=im.width*sc;cv.height=im.height*sc;cv.getContext("2d").drawImage(im,0,0,cv.width,cv.height);res(cv.toDataURL("image/jpeg",q));};im.onerror=function(){res(data);};im.src=data;});
}
function openStudio(){
 loadTokens();
 var m=el("div");m.id="ssModal";
 m.style.cssText="position:fixed;inset:0;background:rgba(0,0,0,.82);z-index:99999;overflow:auto;padding:12px";
 m.innerHTML='<div style="max-width:820px;margin:auto;background:#111;color:#fff;border-radius:14px;padding:14px;font-size:13px">'
 +'<h2 style="margin:0 0 10px">📱 Bulk Product + Social Studio v6</h2>'
 +'<div style="display:flex;gap:6px;flex-wrap:wrap;align-items:center"><input id="ssFiles" type="file" accept="image/*" multiple style="flex:1;min-width:160px">'
 +'<button id="ssMarkAll" style="background:#2563eb;color:#fff;border:none;padding:9px 10px;border-radius:8px;font-weight:700">✅ সিলেক্ট মার্ক অল</button>'
 +'<button id="ssDelAll" style="background:#dc2626;color:#fff;border:none;padding:9px 10px;border-radius:8px;font-weight:700">🗑️ ডিলিট মার্ক অল</button>'
 +'<button id="ssSaveAll" style="background:#16a34a;color:#fff;border:none;padding:9px 10px;border-radius:8px;font-weight:700">💾 সেভ মার্ক অল</button>'
 +'<button id="ssFix" style="background:#f59e0b;color:#fff;border:none;padding:9px 10px;border-radius:8px;font-weight:700">🧹 ভারী পণ্য ফিক্স</button></div>'
 +'<div style="display:flex;gap:6px;margin-top:8px"><input id="ssPrices" placeholder="নাম — দাম পেস্ট করুন (এক লাইনেও চলবে)" style="flex:1;padding:8px"><button id="ssPriceSave" style="background:#16a34a;color:#fff;border:none;padding:9px 12px;border-radius:8px;font-weight:700">দাম সেভ</button></div>'
 +'<div style="display:flex;gap:6px;margin-top:6px;flex-wrap:wrap"><input id="ssPct" type="number" placeholder="%" style="width:90px;padding:8px"><button id="ssPctSave" style="background:#16a34a;color:#fff;border:none;padding:9px 12px;border-radius:8px;font-weight:700">% অল সেভ</button>'
 +'<input id="ssStart" type="date" style="padding:6px"><input id="ssEnd" type="date" style="padding:6px"><button id="ssDateSave" style="background:#16a34a;color:#fff;border:none;padding:9px 12px;border-radius:8px;font-weight:700">তারিখ সেভ</button></div>'
 +'<div style="display:flex;gap:6px;margin-top:6px"><input id="ssDetails" placeholder="ডিটেইলস (সব পণ্যে একই)" style="flex:1;padding:8px"><button id="ssDetSave" style="background:#16a34a;color:#fff;border:none;padding:9px 12px;border-radius:8px;font-weight:700">ডিটেইলস সেভ</button></div>'
 +'<div style="display:flex;gap:6px;margin-top:6px"><input id="ssCat" placeholder="ক্যাটাগরি/সেকশন: Trending Products, men_fashion..." style="flex:1;padding:8px"><button id="ssCatSave" style="background:#16a34a;color:#fff;border:none;padding:9px 12px;border-radius:8px;font-weight:700">ক্যাটাগরি সেভ</button></div>'
 +'<button id="ssSocial" style="margin-top:10px;width:100%;background:#7c3aed;color:#fff;border:none;padding:12px;border-radius:10px;font-weight:800;font-size:15px">📱 সোসাল মিডিয়ায় পোস্ট / শেয়ার</button>'
 +'<div id="ssSocPanel" style="display:none;margin-top:8px;background:#1e1b4b;border-radius:10px;padding:8px"><div style="display:flex;gap:6px;flex-wrap:wrap;align-items:center">'
 +'<button id="ssVMark" style="background:#2563eb;color:#fff;border:none;padding:9px 10px;border-radius:8px;font-weight:700">✅ সিলেক্ট মার্ক অল</button>'
 +'<button id="ssVMake" style="background:#16a34a;color:#fff;border:none;padding:9px 10px;border-radius:8px;font-weight:700">🎬 ভিডিও মেক</button>'
 +'<button id="ssVLive" style="background:#0ea5e9;color:#fff;border:none;padding:9px 10px;border-radius:8px;font-weight:700">📺 ভিডিও লাইভ</button>'
 +'<button id="ssVShare" style="background:#f59e0b;color:#fff;border:none;padding:9px 10px;border-radius:8px;font-weight:700">📤 শেয়ার</button>'
 +'<button id="ssVPost" style="background:#dc2626;color:#fff;border:none;padding:9px 10px;border-radius:8px;font-weight:700">📢 পোস্ট</button></div>'
 +'<div style="display:flex;gap:6px;margin-top:6px;flex-wrap:wrap;align-items:center"><select id="ssMusicSel" style="padding:7px;background:#111;color:#fff;border:1px solid #374151;border-radius:6px"><option value="upbeat">🎵 আপবিট পপ (কপিরাইট ফ্রি)</option><option value="energy">⚡ এনার্জেটিক বিট</option><option value="soft">🎹 সফট পিয়ানো</option><option value="dance">🥁 ড্যান্স বিট</option><option value="none">🔇 মিউজিক নেই</option></select>'
 +'<label style="color:#fff;font-size:11px">অথবা নিজের রয়্যালটি-ফ্রি mp3: <input id="ssMusicFile" type="file" accept="audio/*" style="max-width:160px"></label></div>'
 +'<div id="ssPostLinks" style="margin-top:6px"></div></div>'
 +'<div id="ssProg" style="margin:8px 0;color:#facc15"></div>'
 +'<video id="ssVideo" controls style="width:100%;max-height:380px;display:none;border-radius:10px"></video>'
 +'<h3 style="margin:12px 0 6px">🛍️ পণ্য লিস্ট (<span id="ssCount">0</span>/28)</h3><div id="ssList"></div>'
 +'<button id="ssClose" style="margin-top:10px;background:#dc2626;color:#fff;border:none;padding:10px 16px;border-radius:10px;font-weight:700">✖ বন্ধ</button></div>';
 document.body.appendChild(m);
 document.getElementById("ssClose").onclick=function(){m.remove();};
 document.getElementById("ssFiles").onchange=onFiles;
 document.getElementById("ssMarkAll").onclick=function(){items.forEach(function(it){it.mark=true;});renderList();toast("✅ সব মার্ক হয়েছে");};
 document.getElementById("ssDelAll").onclick=function(){items=items.filter(function(it){return !it.mark;});renderList();toast("🗑️ মার্ক করা সব ডিলিট");};
 document.getElementById("ssSaveAll").onclick=saveMarked;
 document.getElementById("ssFix").onclick=fixHeavy;
 document.getElementById("ssPriceSave").onclick=savePrices;
 document.getElementById("ssPctSave").onclick=function(){var v=document.getElementById("ssPct").value;items.forEach(function(it){it.pct=v;});renderList();toast("✅ সব % সেভ হয়েছে");};
 document.getElementById("ssDateSave").onclick=function(){var s=document.getElementById("ssStart").value,e=document.getElementById("ssEnd").value;items.forEach(function(it){it.start=s;it.end=e;});renderList();toast("✅ তারিখ সেভ হয়েছে");};
 document.getElementById("ssDetSave").onclick=function(){var v=document.getElementById("ssDetails").value;items.forEach(function(it){it.details=v;});renderList();toast("✅ ডিটেইলস সেভ হয়েছে");};
 document.getElementById("ssCatSave").onclick=function(){
  var v=(document.getElementById("ssCat").value||"").trim();
  if(!v){toast("❌ ক্যাটাগরি লিখুন");return;}
  catSlug=v.toLowerCase().replace(/\s+/g,"_");
  secPath=sectionPathFor(v);secCleared=false;
  toast("✅ ক্যাটাগরি → "+secPath);
 };
 document.getElementById("ssSocial").onclick=function(){var p=document.getElementById("ssSocPanel");p.style.display=p.style.display==="none"?"block":"none";};
 document.getElementById("ssVMark").onclick=function(){items.forEach(function(it){it.mark=true;});renderList();toast("✅ ভিডিওর জন্য সব মার্ক");};
 document.getElementById("ssVMake").onclick=makeVideo;
 document.getElementById("ssVLive").onclick=function(){var v=document.getElementById("ssVideo");if(v.src){v.style.display="block";v.play();}else toast("❌ আগে ভিডিও বানান");};
 document.getElementById("ssVShare").onclick=shareVideo;
 document.getElementById("ssMusicFile").onchange=function(){
  var f=this.files[0];if(!f){musicBuf=null;return;}
  var r=new FileReader();r.onload=function(e){musicBuf=e.target.result;toast("🎵 আপনার mp3 লোড হয়েছে");};r.readAsArrayBuffer(f);
 };
 document.getElementById("ssVPost").onclick=function(){
  var box=document.getElementById("ssPostLinks");box.innerHTML="";
  var enc=encodeURIComponent(caption()),u=encodeURIComponent(LINKS.site);
  [["📘 Facebook",LINKS.fb],["📘 FB Page",LINKS.fbPage],["🎵 TikTok",LINKS.tiktok],["📸 Instagram",LINKS.insta],["▶️ YouTube",LINKS.yt],["🎬 Dailymotion",LINKS.dm],["👻 Snapchat",LINKS.snap],["💬 WhatsApp","https://wa.me/?text="+enc],["📘 FB Share","https://www.facebook.com/sharer/sharer.php?u="+u]].forEach(function(s){
   var a=el("a",s[0]);a.href=s[1];a.target="_blank";a.style.cssText="display:inline-block;margin:3px;padding:8px 10px;background:#16a34a;color:#fff;border-radius:8px;text-decoration:none;font-size:12px;font-weight:700";box.appendChild(a);
  });
  toast("📢 লিঙ্কে ক্লিক করুন");
 };
 renderList();
}
function parsePrices(text){
 var out=[],re=/৳\s*([\d,\.]+)/g,m,last=0;
 while((m=re.exec(text))){
  var seg=text.slice(last,m.index);
  var name=seg.replace(/[—–]/g," ").replace(/^[\d,\.]+/,"").replace(/\s+/g," ").trim();
  out.push({n:norm(name),p:parseFloat(m[1].replace(/,/g,"")),used:false});
  last=re.lastIndex;
 }
 if(!out.length){
  re=/—\s*([\d,\.]+)/g;last=0;
  while((m=re.exec(text))){
   var seg2=text.slice(last,m.index);
   var nm2=seg2.replace(/[—–]/g," ").replace(/^[\d,\.]+/,"").replace(/\s+/g," ").trim();
   out.push({n:norm(nm2),p:parseFloat(m[1].replace(/,/g,"")),used:false});
   last=re.lastIndex;
  }
 }
 return out;
}
function savePrices(){
 var text=(document.getElementById("ssPrices").value||"");
 var pairs=parsePrices(text),ord=[];
 if(!pairs.length){text.split(/[\n,]+/).forEach(function(ln){var p=numFrom(ln);if(p!==null)ord.push(p);});}
 var oi=0,matched=0;
 items.forEach(function(it){
  var nm=norm(it.name),found=null;
  for(var i=0;i<pairs.length;i++){
   if(!pairs[i].used&&nm.length>=4&&pairs[i].n.length>=4&&(pairs[i].n===nm||pairs[i].n.indexOf(nm)>-1||nm.indexOf(pairs[i].n)>-1)){found=pairs[i];break;}
  }
  if(found){found.used=true;it.price=found.p;matched++;}
 });
 if(matched===0&&pairs.length){
  items.forEach(function(it,i){if(pairs[i]){it.price=pairs[i].p;}});
  ord=pairs.map(function(p){return p.p;});
 }
 else if(ord.length){items.forEach(function(it){if(!it.price&&ord.length)it.price=ord.shift();});}
 renderList();
 toast("✅ দাম v6: মিল="+matched+" জোড়া="+pairs.length+(matched===0&&pairs.length?" (ক্রমে বসল)":""));
}
function onFiles(){
 var fs=Array.prototype.slice.call(this.files,0,28-items.length);
 fs.forEach(function(f){
  var name=f.name.replace(/\.[^.]+$/,"").replace(/[-_]+/g," ").trim();
  var r=new FileReader();
  r.onload=function(e){
   var im=new Image();
   im.onload=function(){
    var cv=document.createElement("canvas"),sc=Math.min(1,900/Math.max(im.width,im.height));
    cv.width=im.width*sc;cv.height=im.height*sc;
    cv.getContext("2d").drawImage(im,0,0,cv.width,cv.height);
    if(items.length<28){items.push({name:name,data:cv.toDataURL("image/jpeg",0.78),img:im,price:"",pct:"",start:"",end:"",details:"",mark:false,saved:false});renderList();}
   };
   im.src=e.target.result;
  };
  r.readAsDataURL(f);
 });
 toast("⏳ ছবি লোড হচ্ছে...");
}
function renderList(){
 document.getElementById("ssCount").textContent=items.length;
 var box=document.getElementById("ssList");box.innerHTML="";
 items.forEach(function(it,i){
  var c=el("div");c.setAttribute("data-i",i);
  c.style.cssText="background:#1f2937;border-radius:10px;padding:8px;margin:6px 0;display:flex;gap:8px;align-items:flex-start";
  c.innerHTML='<img src="'+it.data+'" style="width:54px;height:54px;object-fit:cover;border-radius:8px">'
  +'<div style="flex:1"><input class="f-name" value="'+it.name.replace(/"/g,"&quot;")+'" style="width:100%;padding:6px;background:#111;color:#fff;border:1px solid #374151;border-radius:6px">'
  +'<div style="display:flex;gap:4px;flex-wrap:wrap;margin-top:4px"><input class="f-price" placeholder="দাম ৳" value="'+it.price+'" style="width:70px;padding:5px;background:#111;color:#fff;border:1px solid #374151;border-radius:6px"><input class="f-pct" placeholder="%" value="'+it.pct+'" style="width:44px;padding:5px;background:#111;color:#fff;border:1px solid #374151;border-radius:6px"><input class="f-start" type="date" value="'+it.start+'" style="padding:4px;background:#111;color:#fff;border:1px solid #374151;border-radius:6px"><input class="f-end" type="date" value="'+it.end+'" style="padding:4px;background:#111;color:#fff;border:1px solid #374151;border-radius:6px"></div>'
  +'<input class="f-details" placeholder="ডিটেইলস" value="'+(it.details||"").replace(/"/g,"&quot;")+'" style="width:100%;margin-top:4px;padding:5px;background:#111;color:#fff;border:1px solid #374151;border-radius:6px"></div>'
  +'<div style="display:flex;flex-direction:column;gap:4px;align-items:center"><label style="font-size:10px;color:#fff"><input type="checkbox" class="f-mark"'+(it.mark?" checked":"")+'> মার্ক</label><button class="f-save" style="background:#16a34a;color:#fff;border:none;padding:6px 10px;border-radius:6px">'+(it.saved?"✅":"💾")+'</button><button class="f-del" style="background:#dc2626;color:#fff;border:none;padding:6px 8px;border-radius:6px">🗑️</button></div>';
  box.appendChild(c);
 });
}
document.addEventListener("input",function(e){
 var card=e.target.closest&&e.target.closest("[data-i]");if(!card)return;
 var it=items[+card.getAttribute("data-i")];if(!it)return;
 var c=e.target;
 if(c.classList.contains("f-name"))it.name=c.value;
 if(c.classList.contains("f-price"))it.price=c.value;
 if(c.classList.contains("f-pct"))it.pct=c.value;
 if(c.classList.contains("f-start"))it.start=c.value;
 if(c.classList.contains("f-end"))it.end=c.value;
 if(c.classList.contains("f-details"))it.details=c.value;
 if(c.classList.contains("f-mark"))it.mark=c.checked;
});
document.addEventListener("click",function(e){
 var card=e.target.closest&&e.target.closest("[data-i]");if(!card)return;
 var i=+card.getAttribute("data-i");
 if(e.target.classList.contains("f-del")){items.splice(i,1);renderList();toast("🗑️ ডিলিট হয়েছে");}
 if(e.target.classList.contains("f-save")){saveItem(i).then(renderList);}
});
function fb(){return Promise.all([import("https://www.gstatic.com/firebasejs/12.0.0/firebase-app.js"),import("https://www.gstatic.com/firebasejs/12.0.0/firebase-database.js"),import("https://www.gstatic.com/firebasejs/12.0.0/firebase-auth.js")]).then(function(M){
 var A=M[0],D=M[1],H=M[2];
 var app=A.getApps().length?A.getApp():A.initializeApp({apiKey:"AIzaSyDj_LLHWBgcKfQClnaOUqEtULHhP1vSVxw",databaseURL:"https://mohajon-mjh-default-rtdb.firebaseio.com",projectId:"mohajon-mjh",appId:"1:526105903976:web:f9321c6d68ecbd19d58cdd"});
 return {db:D.getDatabase(app),D:D,auth:H.getAuth(app)};
});}
function prodObj(it,imgUrl,flags){
 var p=+it.price||0,pct=+it.pct||0;
 var o={title:it.name,price:p,description:it.details,images:{main:imgUrl||it.data},status:"active",stock:20,createdAt:Date.now(),sellerId:"bulk-studio"};
 if(pct>0&&p>0)o.discountPrice=Math.round(p*100/(100-pct));
 if(it.start)o.offerStart=new Date(it.start+"T00:00:00").getTime();
 if(it.end)o.offerEnd=new Date(it.end+"T23:59:59").getTime();
 if(catSlug)o.categoryId=catSlug;
 if(flags)Object.assign(o,flags);
 return o;
}
function flagFromCat(v){
 var s=String(v||"").toLowerCase();
 if(s.indexOf("trend")>-1||s.indexOf("trand")>-1)return {isTrending:true};
 if(s.indexOf("feature")>-1)return {isFeatured:true};
 if(s.indexOf("flash")>-1)return {isFlashSale:true};
 if(s.indexOf("deal")>-1)return {isDealsOfDay:true};
 if(s.indexOf("coming")>-1)return {isComingSoon:true};
 return null;
}
function saveItem(i){
 var it=items[i];
 var imgP=Promise.resolve(null);
 if(it.data.indexOf("data:")===0){
  imgP=upCloud(it.data).then(function(url){if(url)return url;return shrink(it.data,500,0.6);});
 }
 return Promise.all([fb(),imgP]).then(function(R){
  var F=R[0],imgUrl=R[1];
  var flags=flagFromCat(catSlug);
  var prod=prodObj(it,imgUrl,flags);
  var ref=F.D.push(F.D.ref(F.db,"products"));
  return F.D.set(ref,prod).then(function(){
   it.saved=true;it.pid=ref.key;
   toast("✅ সেভ: "+it.name+(flags?" ["+Object.keys(flags)[0]+"]":""));
  });
 }).catch(function(e){toast("❌ সেভ ব্যর্থ: "+it.name+" ("+(e.message||e)+")");});
}});
}
function fixHeavy(){
 toast("⏳ ভারী পণ্য খোঁজা হচ্ছে...");
 fb().then(function(F){
  fetch("https://mohajon-mjh-default-rtdb.firebaseio.com/products.json?shallow=true").then(function(r){return r.json();}).then(function(obj){
   var keys=Object.keys(obj||{}).sort().slice(-80);
   var fixed=0,done=0;
   function next(id){
    fetch("https://mohajon-mjh-default-rtdb.firebaseio.com/products/"+id+".json").then(function(r){return r.json();}).then(function(p){
     var fin=function(){done++;if(done===keys.length)toast("✅ ফিক্স সম্পন্ন: "+fixed+" টি হালকা");else next(keys[done]);};
     if(p&&p.images&&p.images.main&&String(p.images.main).indexOf("data:")===0){
      upCloud(p.images.main).then(function(url){
       var apply=function(v){return F.D.set(F.D.ref(F.db,"products/"+id+"/images/main"),v).then(function(){fixed++;fin();});};
       if(url)apply(url);else shrink(p.images.main,500,0.6).then(apply);
      });
     }else fin();
    }).catch(function(){done++;if(done<keys.length)next(keys[done]);else toast("✅ ফিক্স: "+fixed);});
   }
   if(keys.length)next(keys[0]);else toast("❌ কিছু পাওয়া যায়নি");
  });
 });
}
function caption(){return "🛍️ Mohajon MJH-এ নতুন কালেকশন!\n✅ "+items.length+"টি পণ্য — সেরা দামে!\n\n🛒 অর্ডার: "+LINKS.site+"\n📲 WhatsApp: "+LINKS.wa+"\n\n#mohajonmjh #onlineshopping #bangladesh #saudiarabia #jsamediastudio";}
function scheduleMusic(actx,dest,style,dur){
 var master=actx.createGain();master.gain.value=0.16;master.connect(dest);
 var t0=actx.currentTime+0.1;
 var scale=[261.63,293.66,329.63,392.0,440.0,523.25,587.33,659.26];
 var cfg={upbeat:{step:0.24,wave:"triangle",pat:[0,2,4,7,5,4,2,0,3,5,7,5,4,2,1,2],bass:4},
 energy:{step:0.18,wave:"square",pat:[0,0,3,0,5,0,3,0,7,0,5,0,3,0,2,0],bass:2},
 soft:{step:0.5,wave:"sine",pat:[0,4,7,4,2,5,4,2],bass:8},
 dance:{step:0.2,wave:"sawtooth",pat:[0,3,5,3,7,5,3,0,2,4,6,4,7,6,4,2],bass:1}}[style]||{step:0.24,wave:"triangle",pat:[0,2,4,7,5,4,2,0],bass:4};
 for(var t=0;t<dur;t+=cfg.step){
  var si=Math.floor(t/cfg.step);
  var f=scale[cfg.pat[si%cfg.pat.length]];
  var o=actx.createOscillator(),g=actx.createGain();
  o.type=cfg.wave;o.frequency.value=f;
  g.gain.setValueAtTime(0.0001,t0+t);
  g.gain.exponentialRampToValueAtTime(cfg.wave==="square"?0.22:0.5,t0+t+0.02);
  g.gain.exponentialRampToValueAtTime(0.001,t0+t+cfg.step*0.9);
  o.connect(g);g.connect(master);o.start(t0+t);o.stop(t0+t+cfg.step);
  if(si%cfg.bass===0){
   var b=actx.createOscillator(),bg=actx.createGain();
   b.type="sine";b.frequency.value=f/2;
   bg.gain.setValueAtTime(0.0001,t0+t);
   bg.gain.exponentialRampToValueAtTime(0.35,t0+t+0.03);
   bg.gain.exponentialRampToValueAtTime(0.001,t0+t+cfg.step*3);
   b.connect(bg);bg.connect(master);b.start(t0+t);b.stop(t0+t+cfg.step*3);
  }
  if(style==="dance"&&si%2===0){
   var k=actx.createOscillator(),kg=actx.createGain();
   k.type="sine";k.frequency.setValueAtTime(150,t0+t);k.frequency.exponentialRampToValueAtTime(45,t0+t+0.12);
   kg.gain.setValueAtTime(0.5,t0+t);kg.gain.exponentialRampToValueAtTime(0.001,t0+t+0.15);
   k.connect(kg);kg.connect(master);k.start(t0+t);k.stop(t0+t+0.16);
  }
 }
}
function makeVideo(){
 var L=items.filter(function(it){return it.mark;});
 if(!L.length)L=items.slice();
 if(!L.length){toast("❌ আগে পণ্য যোগ করুন");return;}
 var cv=document.createElement("canvas"),W=720,H=1280;cv.width=W;cv.height=H;
 var ctx=cv.getContext("2d"),per=59/L.length;
 var vs=cv.captureStream(30);
 var tracks=vs.getVideoTracks();
 var actx=null;
 var sel=document.getElementById("ssMusicSel").value;
 var startRec=function(){
  var mime=(window.MediaRecorder&&MediaRecorder.isTypeSupported&&MediaRecorder.isTypeSupported("video/mp4"))?"video/mp4":"video/webm";
  var rec=new MediaRecorder(new MediaStream(tracks),{mimeType:mime});
  var chunks=[];rec.ondataavailable=function(e){if(e.data&&e.data.size)chunks.push(e.data);};
  rec.onstop=function(){
   blobObj=new Blob(chunks,{type:mime});blobUrl=URL.createObjectURL(blobObj);
   var v=document.getElementById("ssVideo");v.src=blobUrl;v.style.display="block";
   document.getElementById("ssProg").textContent="✅ ভিডিও রেডি (🎵 মিউজিক সহ)! 📤 শেয়ার / 📢 পোস্ট";
   toast("✅ ৫৯ সেকেন্ডের ভিডিও + মিউজিক তৈরি!");
  };
  var t0=null;rec.start(500);
  function frame(ts){
   if(t0===null)t0=ts;
   var t=(ts-t0)/1000;
   if(t>=59){rec.stop();return;}
   var idx=Math.min(L.length-1,Math.floor(t/per)),it=L[idx];
   ctx.fillStyle="#000";ctx.fillRect(0,0,W,H);
   var im=it.img,r=Math.max(W/im.width,H/im.height),w=im.width*r,h=im.height*r;
   ctx.drawImage(im,(W-w)/2,(H-h)/2,w,h);
   var g=ctx.createLinearGradient(0,H-380,0,H);g.addColorStop(0,"rgba(0,0,0,0)");g.addColorStop(1,"rgba(0,0,0,.92)");
   ctx.fillStyle=g;ctx.fillRect(0,H-380,W,380);
   ctx.textAlign="center";ctx.fillStyle="#f59e0b";ctx.font="bold 42px sans-serif";ctx.fillText("MOHAJON MJH",W/2,66);
   ctx.textAlign="left";ctx.fillStyle="#fff";ctx.font="bold 38px sans-serif";
   var words=String(it.name).split(/\s+/),line="",y=H-280;
   words.forEach(function(wd){var tt=line?line+" "+wd:wd;if(ctx.measureText(tt).width>W-80&&line){ctx.fillText(line,40,y);y+=46;line=wd;}else line=tt;});
   if(line)ctx.fillText(line,40,y);
   ctx.fillStyle="#4ade80";ctx.font="bold 54px sans-serif";ctx.fillText("৳"+(it.price||0),40,y+66);
   if(it.pct){ctx.fillStyle="#dc2626";ctx.beginPath();ctx.arc(W-90,140,60,0,7);ctx.fill();ctx.fillStyle="#fff";ctx.font="bold 34px sans-serif";ctx.textAlign="center";ctx.fillText("-"+it.pct+"%",W-90,152);}
   ctx.textAlign="left";ctx.fillStyle="#facc15";ctx.font="bold 28px sans-serif";ctx.fillText("WhatsApp: "+LINKS.wa,40,H-36);
   ctx.textAlign="right";ctx.fillStyle="rgba(255,255,255,.8)";ctx.font="22px sans-serif";ctx.fillText((idx+1)+"/"+L.length,W-30,56);
   document.getElementById("ssProg").textContent="⏳ রেকর্ড: "+Math.round(t)+" / 59 সেকেন্ড...";
   requestAnimationFrame(frame);
  }
  requestAnimationFrame(frame);
 };
 if(sel!=="none"&&window.AudioContext){
  actx=new AudioContext();
  var dest=actx.createMediaStreamDestination();
  if(musicBuf){
   actx.decodeAudioData(musicBuf.slice(0)).then(function(buf){
    var src=actx.createBufferSource();src.buffer=buf;
    var g=actx.createGain();g.gain.value=0.5;src.connect(g);g.connect(dest);
    src.start(actx.currentTime+0.1);
    tracks=tracks.concat(dest.stream.getAudioTracks());
    startRec();
   }).catch(function(){scheduleMusic(actx,dest,sel,60);tracks=tracks.concat(dest.stream.getAudioTracks());startRec();});
  }else{
   scheduleMusic(actx,dest,sel,60);
   tracks=tracks.concat(dest.stream.getAudioTracks());
   startRec();
  }
 }else startRec();
}
function shareVideo(){
 if(!blobObj){toast("❌ আগে ভিডিও মেক চাপুন");return;}
 var f=new File([blobObj],"mohajon-video."+(blobObj.type.indexOf("mp4")>-1?"mp4":"webm"),{type:blobObj.type});
 if(navigator.canShare&&navigator.canShare({files:[f]})){navigator.share({files:[f],title:"Mohajon MJH",text:caption()}).catch(function(){});}
 else{window.open("https://wa.me/?text="+encodeURIComponent(caption()),"_blank");toast("📤 লিঙ্ক শেয়ার খুলল");}
}
if(document.readyState==="loading")document.addEventListener("DOMContentLoaded",addBtn);else setTimeout(addBtn,1500);
})();
