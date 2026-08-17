/* mjh-social-studio-v1 */
(function(){
var LINKS={fb:"https://www.facebook.com/share/1DPYY5nJUc/",fbPage:"https://www.facebook.com/share/19RaTzdDW5/",tiktok:"https://www.tiktok.com/@jsa.media.studio",insta:"https://www.instagram.com/jsamediastudio",yt:"https://www.youtube.com/@JSAMediaStudio",dm:"https://www.dailymotion.com/user/jsamediastudi",snap:"https://www.snapchat.com/add/jsaaimediastudi",site:"https://mohajon-mjh.github.io",wa:"+966550171314"};
window.MJH_SOCIAL=LINKS;
var imgs=[],lastCap="";
function el(t,h){var d=document.createElement(t);if(h)d.innerHTML=h;return d;}
function addBtn(){
 if(document.getElementById("ssBtn"))return;
 var b=el("button","📱 Social Media Post / Share");b.id="ssBtn";
 b.style.cssText="display:block;width:92%;margin:8px auto;padding:12px;background:#7c3aed;color:#fff;border:none;border-radius:10px;font-weight:800;cursor:pointer;font-size:14px";
 b.onclick=openStudio;
 var side=document.querySelector(".sidebar")||document.querySelector("aside")||document.querySelector("nav");
 if(side)side.appendChild(b);else{b.style.cssText+=";position:fixed;bottom:170px;right:10px;z-index:99998;width:auto";document.body.appendChild(b);}
}
function openStudio(){
 if(document.getElementById("ssModal"))return;
 var m=el("div");m.id="ssModal";
 m.style.cssText="position:fixed;inset:0;background:rgba(0,0,0,.78);z-index:99999;overflow:auto;padding:14px";
 m.innerHTML='<div style="max-width:760px;margin:auto;background:#111;color:#fff;border-radius:14px;padding:16px;font-size:14px">'
 +'<h2 style="margin:0 0 10px">📱 Social Media Studio</h2>'
 +'<label>পণ্যের নাম *<input id="ssTitle" style="width:100%;padding:8px;margin:4px 0" placeholder="যেমন: Smart Air Fryer"></label>'
 +'<label>দাম (৳) *<input id="ssPrice" style="width:100%;padding:8px;margin:4px 0" placeholder="268"></label>'
 +'<label>পণ্যের ডিটেইলস / About<textarea id="ssDesc" rows="3" style="width:100%;padding:8px;margin:4px 0" placeholder="ফিচার, সুবিধা..."></textarea></label>'
 +'<label>ছবি (সর্বোচ্চ ২৮টি) *<input id="ssFiles" type="file" accept="image/*" multiple style="width:100%;margin:4px 0"></label>'
 +'<div id="ssCount" style="color:#4ade80"></div>'
 +'<label style="display:block;margin:6px 0"><input id="ssSave" type="checkbox" checked> সাইটেও পণ্য যোগ করব</label>'
 +'<button id="ssGen" style="background:#16a34a;color:#fff;border:none;padding:12px 18px;border-radius:10px;font-weight:800;cursor:pointer">🎬 ৫৯ সেকেন্ডের ভিডিও বানান</button>'
 +'<div id="ssProg" style="margin:8px 0;color:#facc15"></div>'
 +'<video id="ssVideo" controls style="width:100%;max-height:420px;display:none;border-radius:10px"></video>'
 +'<div id="ssActions" style="display:none;margin-top:10px">'
 +'<a id="ssDl" download="mohajon-video.mp4" style="display:inline-block;background:#2563eb;color:#fff;padding:10px 14px;border-radius:10px;font-weight:700;margin:4px;text-decoration:none">⬇️ ভিডিও ডাউনলোড</a>'
 +'<button id="ssCap" style="background:#0ea5e9;color:#fff;border:none;padding:10px 14px;border-radius:10px;font-weight:700;margin:4px;cursor:pointer">📋 ক্যাপশন+হ্যাশট্যাগ কপি</button>'
 +'<div style="margin-top:8px;color:#9ca3af">এক ট্যাপে শেয়ার/আপলোড:</div><div id="ssShare"></div></div>'
 +'<h3 style="margin:14px 0 6px">🔗 আপনার সোশ্যাল লিঙ্ক</h3><div id="ssLinks"></div>'
 +'<button id="ssClose" style="margin-top:12px;background:#dc2626;color:#fff;border:none;padding:10px 16px;border-radius:10px;font-weight:700;cursor:pointer">✖ বন্ধ</button></div>';
 document.body.appendChild(m);
 document.getElementById("ssClose").onclick=function(){m.remove();};
 document.getElementById("ssFiles").onchange=function(){
  imgs=[];var fs=Array.prototype.slice.call(this.files,0,28);
  fs.forEach(function(f){var r=new FileReader();r.onload=function(e){var im=new Image();im.onload=function(){imgs.push(im);document.getElementById("ssCount").textContent="✅ "+imgs.length+" টি ছবি লোড হয়েছে";};im.src=e.target.result;};r.readAsDataURL(f);});
 };
 document.getElementById("ssGen").onclick=gen;
 document.getElementById("ssCap").onclick=function(){
  if(!lastCap)return;
  if(navigator.clipboard)navigator.clipboard.writeText(lastCap);
  prompt("কপি করুন:",lastCap);
 };
 var lb=document.getElementById("ssLinks");
 [["📘 Facebook",LINKS.fb],["📘 FB Page",LINKS.fbPage],["🎵 TikTok",LINKS.tiktok],["📸 Instagram",LINKS.insta],["▶️ YouTube",LINKS.yt],["🎬 Dailymotion",LINKS.dm],["👻 Snapchat",LINKS.snap],["💬 WhatsApp","https://wa.me/966550171314"],["🌐 Website",LINKS.site]].forEach(function(p){
  var a=el("a",p[0]);a.href=p[1];a.target="_blank";a.style.cssText="display:inline-block;margin:3px;padding:8px 12px;background:#374151;color:#fff;border-radius:8px;text-decoration:none;font-size:12px";lb.appendChild(a);
 });
}
function drawCover(ctx,im,W,H){var r=Math.max(W/im.width,H/im.height);var w=im.width*r,h=im.height*r;ctx.drawImage(im,(W-w)/2,(H-h)/2,w,h);}
function wrap(ctx,text,x,y,maxW,lh){var words=String(text||"").split(/\s+/),line="";words.forEach(function(w){var t=line?line+" "+w:w;if(ctx.measureText(t).width>maxW&&line){ctx.fillText(line,x,y);y+=lh;line=w;}else line=t;});if(line)ctx.fillText(line,x,y);return y;}
function gen(){
 var title=(document.getElementById("ssTitle").value||"").trim();
 var price=(document.getElementById("ssPrice").value||"").trim();
 var desc=(document.getElementById("ssDesc").value||"").trim();
 if(!title||!price||imgs.length<1){alert("নাম, দাম আর কমপক্ষে ১টি ছবি দিন");return;}
 var cv=document.createElement("canvas"),W=720,H=1280;cv.width=W;cv.height=H;
 var ctx=cv.getContext("2d");
 var per=59/imgs.length;
 var stream=cv.captureStream(30);
 var mime=(window.MediaRecorder&&MediaRecorder.isTypeSupported&&MediaRecorder.isTypeSupported("video/mp4"))?"video/mp4":"video/webm";
 var rec=new MediaRecorder(stream,{mimeType:mime});
 var chunks=[];rec.ondataavailable=function(e){if(e.data&&e.data.size)chunks.push(e.data);};
 rec.onstop=function(){
  var blob=new Blob(chunks,{type:mime});var url=URL.createObjectURL(blob);
  var v=document.getElementById("ssVideo");v.src=url;v.style.display="block";
  var dl=document.getElementById("ssDl");dl.href=url;dl.download="mohajon-"+title.replace(/\s+/g,"-").toLowerCase()+"."+(mime.indexOf("mp4")>-1?"mp4":"webm");
  document.getElementById("ssActions").style.display="block";
  document.getElementById("ssProg").textContent="✅ ভিডিও রেডি! ডাউনলোড করে FB/TikTok-এ আপলোড করুন";
  buildShare(title,price,desc);
  if(document.getElementById("ssSave").checked)saveProduct(title,price,desc);
 };
 var t0=null;rec.start(500);
 function frame(ts){
  if(t0===null)t0=ts;
  var t=(ts-t0)/1000;
  if(t>=59){rec.stop();return;}
  var idx=Math.min(imgs.length-1,Math.floor(t/per));
  ctx.fillStyle="#000";ctx.fillRect(0,0,W,H);
  drawCover(ctx,imgs[idx],W,H);
  var g=ctx.createLinearGradient(0,H-420,0,H);g.addColorStop(0,"rgba(0,0,0,0)");g.addColorStop(1,"rgba(0,0,0,.92)");
  ctx.fillStyle=g;ctx.fillRect(0,H-420,W,420);
  ctx.textAlign="center";ctx.fillStyle="#f59e0b";ctx.font="bold 44px sans-serif";ctx.fillText("MOHAJON MJH",W/2,70);
  ctx.textAlign="left";ctx.fillStyle="#fff";ctx.font="bold 40px sans-serif";
  var y=wrap(ctx,title,40,H-300,W-80,48);
  ctx.fillStyle="#4ade80";ctx.font="bold 56px sans-serif";ctx.fillText("৳"+price,40,y+70);
  ctx.fillStyle="#e5e7eb";ctx.font="26px sans-serif";wrap(ctx,desc.slice(0,140),40,y+120,W-80,34);
  ctx.fillStyle="#facc15";ctx.font="bold 30px sans-serif";ctx.fillText("WhatsApp: "+LINKS.wa,40,H-40);
  ctx.textAlign="right";ctx.fillStyle="rgba(255,255,255,.8)";ctx.font="24px sans-serif";ctx.fillText((idx+1)+"/"+imgs.length,W-30,60);
  document.getElementById("ssProg").textContent="⏳ রেকর্ড হচ্ছে: "+Math.round(t)+" / 59 সেকেন্ড...";
  requestAnimationFrame(frame);
 }
 requestAnimationFrame(frame);
}
function captionText(t,p,d){
 var h=["#mohajonmjh","#onlineshopping","#bangladesh","#saudiarabia","#jsamediastudio","#"+t.toLowerCase().replace(/[^a-z0-9]+/g,"")];
 return "🛒 "+t+"\n💰 দাম: ৳"+p+"\n\n"+(d?d+"\n\n":"")+"✅ অর্ডার: "+LINKS.site+"\n📲 WhatsApp: "+LINKS.wa+"\n\n"+h.join(" ");
}
function buildShare(t,p,d){
 lastCap=captionText(t,p,d);
 var box=document.getElementById("ssShare");box.innerHTML="";
 var enc=encodeURIComponent(lastCap),u=encodeURIComponent(LINKS.site);
 [["📘 Facebook Share","https://www.facebook.com/sharer/sharer.php?u="+u],["📘 FB Page (ভিডিও আপলোড)",LINKS.fbPage],["🎵 TikTok আপলোড",LINKS.tiktok],["📸 Instagram",LINKS.insta],["▶️ YouTube আপলোড","https://studio.youtube.com"],["🎬 Dailymotion আপলোড","https://www.dailymotion.com/upload"],["👻 Snapchat",LINKS.snap],["💬 WhatsApp শেয়ার","https://wa.me/?text="+enc]].forEach(function(s){
  var a=document.createElement("a");a.textContent=s[0];a.href=s[1];a.target="_blank";
  a.style.cssText="display:inline-block;margin:3px;padding:9px 12px;background:#16a34a;color:#fff;border-radius:8px;text-decoration:none;font-size:12px;font-weight:700";box.appendChild(a);
 });
}
function saveProduct(t,p,d){
 Promise.all([import("https://www.gstatic.com/firebasejs/12.0.0/firebase-app.js"),import("https://www.gstatic.com/firebasejs/12.0.0/firebase-database.js")]).then(function(M){
  var A=M[0],D=M[1];
  var app=A.getApps().length?A.getApps()[0]:A.initializeApp({apiKey:"AIzaSyDj_LLHWBgcKfQClnaOUqEtULHhP1vSVxw",databaseURL:"https://mohajon-mjh-default-rtdb.firebaseio.com",projectId:"mohajon-mjh",appId:"1:526105903976:web:f9321c6d68ecbd19d58cdd"});
  var db=D.getDatabase(app);
  var im=imgs[0],cv=document.createElement("canvas"),r=Math.min(1,800/Math.max(im.width,im.height));
  cv.width=im.width*r;cv.height=im.height*r;cv.getContext("2d").drawImage(im,0,0,cv.width,cv.height);
  var ref=D.push(D.ref(db,"products"));
  D.set(ref,{title:t,price:+p,description:d,images:{main:cv.toDataURL("image/jpeg",0.75)},status:"active",stock:20,createdAt:Date.now(),sellerId:"social-studio"}).then(function(){
   document.getElementById("ssProg").textContent+=" | ✅ সাইটে পণ্য যোগ হয়েছে!";
  });
 }).catch(function(e){console.error(e);});
}
if(document.readyState==="loading")document.addEventListener("DOMContentLoaded",addBtn);else setTimeout(addBtn,1500);
})();
