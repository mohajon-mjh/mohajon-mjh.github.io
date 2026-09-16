/* Site Settings v3 - auth writes + full About page editor + sidebar manager */
(function(){
"use strict";
var CFG={apiKey:"AIzaSyDj_LLHWBgcKfQClnaOUqEtULHhP1vSVxw",databaseURL:"https://mohajon-mjh-default-rtdb.firebaseio.com",projectId:"mohajon-mjh",appId:"1:526105903976:web:f9321c6d68ecbd19d58cdd"};
var FB=null;
function sdk(){if(FB)return FB;FB=Promise.all([import("https://www.gstatic.com/firebasejs/12.0.0/firebase-app.js"),import("https://www.gstatic.com/firebasejs/12.0.0/firebase-database.js")]).then(function(M){var app=M[0].getApps().length?M[0].getApps()[0]:M[0].initializeApp(CFG);return{D:M[1],db:M[1].getDatabase(app)};});return FB;}
function dbSet(p,v){return sdk().then(function(o){return o.D.set(o.D.ref(o.db,p),v);});}
function dbGet(p){return sdk().then(function(o){return o.D.get(o.D.ref(o.db,p));}).then(function(s){return s.val();});}
function $(id){return document.getElementById(id);}
function esc(s){return String(s==null?"":s).replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;");}
function status(m,t){var el=$("settingsStatus");if(!el)return;el.style.display="block";el.style.background=t==="err"?"#ef4444":t==="ok"?"#10b981":"#3b82f6";el.style.color="#fff";el.textContent=m;setTimeout(function(){el.style.display="none";},4000);}

var HDEF={title:"🌟 About Mohajon MJH Marketplace",description:"International online marketplace — 1,650+ verified products, connecting buyers and sellers directly.",image:"",features:[
 {icon:"💰",title:"Cash on Delivery",desc:"Pay when you receive your products",link:"about.html#payments"},
 {icon:"🔄",title:"7-Day Return",desc:"Easy 7-day return policy",link:"about.html#returns"},
 {icon:"🔒",title:"Secure Payment",desc:"bKash, Nagad, Rocket",link:"about.html#payments"},
 {icon:"🚚",title:"Fast Delivery",desc:"Delivery in 10-15 days",link:"about.html#delivery"}]};
var PDEF={
 heroTitle:"About Mohajon-MJH Marketplace",
 heroSub:"An international online marketplace — 1,650+ verified products, connecting buyers and sellers directly.",
 founder:{img:"assets/images/about/founder.png",name:"Mohammad Jahangir Hossain",role:"Founder & CEO",bio:"Mohajon-MJH Marketplace was founded with one single goal — a place customers can trust and a platform where sellers can grow. From a small idea in Feni, Bangladesh, it has become a full online marketplace serving customers and sellers worldwide."},
 story:{title:"Our Story",text:"In 2026, the journey of Mohajon-MJH Marketplace began with a single goal — to build a complete online marketplace where groceries, spices, electronics, fashion, home & kitchen, health & beauty and almost every kind of product can be found under one roof. We believe every customer's time and money are valuable — so we focus on easy browsing, trusted sellers and reliable delivery."},
 mission:{title:"🎯 Mission",text:"To give every customer in Bangladesh and beyond trusted products at honest prices, with a simple buying experience and seller-friendly tools that help small businesses grow."},
 vision:{title:"🔭 Vision",text:"To become one of the most trusted and customer-friendly online marketplaces in the region, where buying and selling are equally easy, safe and rewarding."},
 values:[{icon:"🛡️",title:"Trustworthiness",desc:"Verified sellers and genuine product listings"},{icon:"💰",title:"Affordable Prices",desc:"Honest prices for everyone, every day"},{icon:"🤝",title:"Customer Care",desc:"Fast and friendly support at every step"}],
 delivery:{title:"🚚 Delivery",text:"We deliver across Bangladesh within <b>10-15 days</b>. Every order is packed carefully and shipped through trusted courier partners, with tracking support available from your account."},
 returns:{title:"🔄 7-Day Returns",text:"If anything about your order is not right, you can return it within 7 days for a replacement, refund or support — whichever you need."},
 payments:{title:"🔒 Secure Payments",text:"Cash on Delivery across Bangladesh, plus secure mobile payments via bKash, Nagad and Rocket. Your money is safe with us."},
 team:[{icon:"👨‍💼",name:"Mohammad Jahangir Hossain",role:"Founder & CEO",desc:"Leads the vision, strategy and growth of the marketplace."},{icon:"📦",name:"Operations Team",role:"Orders & Logistics",desc:"Manages inventory, packing and 10-15 day delivery across the country."},{icon:"🎧",name:"Customer Support",role:"Help & Returns",desc:"Handles inquiries, returns and after-sales support every day."},{icon:"💻",name:"Technology Team",role:"Platform & Security",desc:"Builds and protects the website, apps and payment systems."}],
 history:[{title:"2026 — The Beginning",text:"Mohajon-MJH Marketplace launched from Feni, Bangladesh with a small catalogue of essential products."},{title:"2026 — Growing the Catalogue",text:"Expanded to 1,650+ verified products across 20+ categories including electronics, fashion, grocery and home & kitchen."},{title:"2026 — Seller Programme",text:"Opened the platform to independent sellers, helping small businesses reach customers nationwide."},{title:"2026 — Nationwide Service",text:"Cash on Delivery, secure mobile payments and 10-15 day delivery available across Bangladesh."}],
 achievements:["✅ 1,650+ verified products listed under one roof","✅ 20+ categories — from groceries and spices to electronics and fashion","✅ Cash on Delivery available across Bangladesh","✅ Independent sellers onboarded through our seller programme","✅ 7-day easy return policy trusted by customers","✅ Multilingual platform serving customers in Bangla, English and Arabic"]};
var home=JSON.parse(JSON.stringify(HDEF));
var page=JSON.parse(JSON.stringify(PDEF));
var sideCfg=[];var OVR={};

/* ---------- form builders ---------- */
function inp(val,ph,wide){var i=document.createElement("input");i.value=val==null?"":val;i.placeholder=ph||"";i.style.cssText="width:"+(wide?"100%":"auto")+";padding:8px;border-radius:6px;border:1px solid #444;background:#0f1419;color:#fff;margin:4px 0";return i;}
function ta(val,rows){var t=document.createElement("textarea");t.value=val==null?"":val;t.rows=rows||3;t.style.cssText="width:100%;padding:8px;border-radius:6px;border:1px solid #444;background:#0f1419;color:#fff;margin:4px 0";return t;}
function lab(txt){var l=document.createElement("label");l.textContent=txt;l.style.cssText="display:block;color:#9ca3af;font-size:12px;margin-top:8px;font-weight:700";return l;}
function block(title){var d=document.createElement("div");d.style.cssText="background:#1a242f;border:1px solid #333;border-radius:10px;padding:14px;margin-bottom:14px";var h=document.createElement("b");h.textContent=title;h.style.cssText="color:#fff;display:block;margin-bottom:6px";d.appendChild(h);return d;}
function delBtn(fn){var b=document.createElement("button");b.textContent="🗑️";b.style.cssText="background:#ef4444;color:#fff;border:none;border-radius:4px;padding:4px 8px;cursor:pointer";b.onclick=fn;return b;}
function addBtn(txt,fn){var b=document.createElement("button");b.textContent=txt;b.style.cssText="background:#3b82f6;color:#fff;border:none;border-radius:6px;padding:8px 14px;cursor:pointer;margin-top:8px";b.onclick=fn;return b;}

/* ---------- HOME editor ---------- */
function buildHome(host){
 host.innerHTML="";
 host.appendChild(lab("Title (homepage heading)"));var t=inp(home.title,"",true);t.oninput=function(){home.title=t.value;preview();};host.appendChild(t);
 host.appendChild(lab("Description"));var d=ta(home.description,2);d.oninput=function(){home.description=d.value;preview();};host.appendChild(d);
 host.appendChild(lab("Banner Image (URL বা Upload)"));var im=inp(home.image,"https://...",true);im.oninput=function(){home.image=im.value;preview();};host.appendChild(im);
 var fi=document.createElement("input");fi.type="file";fi.accept="image/*";fi.style.cssText="margin:6px 0";fi.onchange=function(){upload(fi,function(u){home.image=u;im.value=u;preview();});};host.appendChild(fi);
 host.appendChild(lab("Feature Cards (homepage)"));
 var box=document.createElement("div");host.appendChild(box);
 function cards(){box.innerHTML="";home.features.forEach(function(f,i){
  var b=block("Card "+(i+1));
  var r1=document.createElement("div");r1.style.cssText="display:flex;gap:6px;flex-wrap:wrap";
  var ic=inp(f.icon,"Icon");ic.style.width="60px";ic.oninput=function(){f.icon=ic.value;preview();};
  var ti=inp(f.title,"Title");ti.style.flex="1";ti.oninput=function(){f.title=ti.value;preview();};
  r1.appendChild(ic);r1.appendChild(ti);r1.appendChild(delBtn(function(){if(confirm("মুছবেন?")){home.features.splice(i,1);cards();preview();}}));
  b.appendChild(r1);
  var de=inp(f.desc,"Description");de.style.width="100%";de.oninput=function(){f.desc=de.value;preview();};b.appendChild(de);
  var li=inp(f.link,"Link");li.style.width="100%";li.oninput=function(){f.link=li.value;};b.appendChild(li);
  box.appendChild(b);});
  box.appendChild(addBtn("➕ Add Card",function(){home.features.push({icon:"📌",title:"",desc:"",link:""});cards();preview();}));}
 cards();
}

/* ---------- PAGE editor ---------- */
function buildPage(host){
 host.innerHTML="";
 var b0=block(" Header (Hero)");
 var h1=inp(page.heroTitle,"",true);h1.oninput=function(){page.heroTitle=h1.value;preview();};b0.appendChild(lab("Title"));b0.appendChild(h1);
 var h2=ta(page.heroSub,2);h2.oninput=function(){page.heroSub=h2.value;preview();};b0.appendChild(lab("Subtitle"));b0.appendChild(h2);
 host.appendChild(b0);
 var b1=block("👤 Founder Card");
 var img=inp(page.founder.img,"",true);img.oninput=function(){page.founder.img=img.value;preview();};b1.appendChild(lab("ছবি (URL বা Upload)"));b1.appendChild(img);
 var fi=document.createElement("input");fi.type="file";fi.accept="image/*";fi.onchange=function(){upload(fi,function(u){page.founder.img=u;img.value=u;preview();});};b1.appendChild(fi);
 var nm=inp(page.founder.name,"",true);nm.oninput=function(){page.founder.name=nm.value;preview();};b1.appendChild(lab("নাম"));b1.appendChild(nm);
 var rl=inp(page.founder.role,"",true);rl.oninput=function(){page.founder.role=rl.value;preview();};b1.appendChild(lab("Role"));b1.appendChild(rl);
 var bi=ta(page.founder.bio,4);bi.oninput=function(){page.founder.bio=bi.value;preview();};b1.appendChild(lab("Bio"));b1.appendChild(bi);
 host.appendChild(b1);
 [["story","📖 Our Story"],["mission","🎯 Mission"],["vision","🔭 Vision"],["delivery","🚚 Delivery"],["returns","🔄 7-Day Returns"],["payments","🔒 Secure Payments"]].forEach(function(k){
  var key=k[0],o=page[key];var b=block(k[1]);
  var t=inp(o.title,"",true);t.oninput=function(){o.title=t.value;preview();};b.appendChild(lab("Heading"));b.appendChild(t);
  var x=ta(o.text,4);x.oninput=function(){o.text=x.value;preview();};b.appendChild(lab("লেখা"));b.appendChild(x);
  host.appendChild(b);});
 var bv=block("🛡️ Values (৩টা card)");var vb=document.createElement("div");bv.appendChild(vb);
 function vCards(){vb.innerHTML="";page.values.forEach(function(v,i){var c=block("Value "+(i+1));
  var r=document.createElement("div");r.style.cssText="display:flex;gap:6px";
  var ic=inp(v.icon,"Icon");ic.style.width="60px";ic.oninput=function(){v.icon=ic.value;preview();};
  var ti=inp(v.title,"Title");ti.style.flex="1";ti.oninput=function(){v.title=ti.value;preview();};
  r.appendChild(ic);r.appendChild(ti);r.appendChild(delBtn(function(){page.values.splice(i,1);vCards();preview();}));c.appendChild(r);
  var de=inp(v.desc,"Desc");de.style.width="100%";de.oninput=function(){v.desc=de.value;preview();};c.appendChild(de);vb.appendChild(c);});
  vb.appendChild(addBtn("➕ Add Value",function(){page.values.push({icon:"⭐",title:"",desc:""});vCards();preview();}));}
 vCards();host.appendChild(bv);
 var bt=block("👥 Our Team");var tb=document.createElement("div");bt.appendChild(tb);
 function tCards(){tb.innerHTML="";page.team.forEach(function(v,i){var c=block("Member "+(i+1));
  var r=document.createElement("div");r.style.cssText="display:flex;gap:6px";
  var ic=inp(v.icon,"Icon");ic.style.width="60px";ic.oninput=function(){v.icon=ic.value;preview();};
  var nm2=inp(v.name,"Name");nm2.style.flex="1";nm2.oninput=function(){v.name=nm2.value;preview();};
  r.appendChild(ic);r.appendChild(nm2);r.appendChild(delBtn(function(){page.team.splice(i,1);tCards();preview();}));c.appendChild(r);
  var ro=inp(v.role,"Role");ro.style.width="100%";ro.oninput=function(){v.role=ro.value;preview();};c.appendChild(ro);
  var de=inp(v.desc,"Desc");de.style.width="100%";de.oninput=function(){v.desc=de.value;preview();};c.appendChild(de);tb.appendChild(c);});
  tb.appendChild(addBtn("➕ Add Member",function(){page.team.push({icon:"👤",name:"",role:"",desc:""});tCards();preview();}));}
 tCards();host.appendChild(bt);
 var bh=block("📜 Our History");var hb=document.createElement("div");bh.appendChild(hb);
 function hCards(){hb.innerHTML="";page.history.forEach(function(v,i){var c=block("Item "+(i+1));
  var t=inp(v.title,"Year — Title");t.style.width="100%";t.oninput=function(){v.title=t.value;preview();};c.appendChild(t);
  var x=inp(v.text,"Text");x.style.width="100%";x.oninput=function(){v.text=x.value;preview();};c.appendChild(x);
  c.appendChild(delBtn(function(){page.history.splice(i,1);hCards();preview();}));hb.appendChild(c);});
  hb.appendChild(addBtn("➕ Add Item",function(){page.history.push({title:"",text:""});hCards();preview();}));}
 hCards();host.appendChild(bh);
 var ba=block("🏆 Achievements");var ab=document.createElement("div");ba.appendChild(ab);
 function aCards(){ab.innerHTML="";page.achievements.forEach(function(v,i){var r=document.createElement("div");r.style.cssText="display:flex;gap:6px;margin-bottom:6px";
  var x=inp(v,"");x.style.flex="1";x.oninput=function(){page.achievements[i]=x.value;preview();};
  r.appendChild(x);r.appendChild(delBtn(function(){page.achievements.splice(i,1);aCards();preview();}));ab.appendChild(r);});
  ab.appendChild(addBtn("➕ Add",function(){page.achievements.push("");aCards();preview();}));}
 aCards();host.appendChild(ba);
}

/* ---------- live preview (about.html এর হুবহু style) ---------- */
function preview(){
 var pv=$("aboutPreview");if(!pv)return;
 var f=home.features.map(function(x){return '<a style="padding:14px;background:rgba(255,255,255,.08);border-radius:10px;display:block;text-decoration:none"><div style="font-size:24px">'+esc(x.icon)+'</div><b style="color:#fff">'+esc(x.title)+'</b><p style="color:#cfd8dc;font-size:12px;margin:4px 0 0">'+esc(x.desc)+'</p></a>';}).join("");
 pv.innerHTML=
 '<div style="background:linear-gradient(135deg,#0b1a2e,#1a2f4a);color:#fff;padding:24px;text-align:center;border-radius:10px"><h1 style="font-size:20px;margin-bottom:8px">'+esc(page.heroTitle)+'</h1><p style="color:#cbd5e1;font-size:13px">'+esc(page.heroSub)+'</p></div>'+
 '<div style="background:#fff;border-radius:14px;padding:20px;text-align:center;margin:12px 0">'+(page.founder.img?'<img src="'+esc(page.founder.img)+'" style="width:90px;height:90px;border-radius:50%;object-fit:cover;margin-bottom:8px">':'')+'<h2 style="font-size:16px;color:#0b1a2e">'+esc(page.founder.name)+'</h2><div style="color:#2563eb;font-weight:600;font-size:13px">'+esc(page.founder.role)+'</div><p style="color:#475569;font-size:13px;margin-top:8px">'+esc(page.founder.bio)+'</p></div>'+
 '<div style="background:#fff;border-radius:14px;padding:16px;margin-bottom:12px"><h3 style="color:#0b1a2e">'+esc(page.story.title)+'</h3><p style="color:#475569;font-size:13px;margin-top:6px">'+page.story.text+'</p></div>'+
 '<div style="display:grid;grid-template-columns:1fr 1fr;gap:10px;margin-bottom:12px"><div style="background:#fff;border-radius:14px;padding:14px"><h3 style="font-size:14px">'+esc(page.mission.title)+'</h3><p style="font-size:12px;color:#475569">'+page.mission.text+'</p></div><div style="background:#fff;border-radius:14px;padding:14px"><h3 style="font-size:14px">'+esc(page.vision.title)+'</h3><p style="font-size:12px;color:#475569">'+page.vision.text+'</p></div></div>'+
 '<div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:8px;margin-bottom:12px">'+page.values.map(function(v){return '<div style="background:#fff;border-radius:14px;padding:12px;text-align:center"><div style="font-size:22px">'+esc(v.icon)+'</div><b style="font-size:12px">'+esc(v.title)+'</b><p style="font-size:11px;color:#64748b">'+esc(v.desc)+'</p></div>';}).join("")+'</div>'+
 '<div style="background:#0b1a2e;border-radius:10px;padding:14px;text-align:center"><div style="display:grid;grid-template-columns:repeat(4,1fr);gap:8px">'+f+'</div></div>';
}

/* ---------- upload ---------- */
function upload(fi,cb){
 var f=fi.files&&fi.files[0];if(!f)return;
 if(window.MJHCloud&&window.MJHCloud.upload){status("⏳ Cloudinary upload...","info");window.MJHCloud.upload(f).then(cb).catch(function(e){status("❌ "+(e&&e.message||e),"err");});}
 else{var rd=new FileReader();rd.onload=function(){cb(rd.result);};rd.readAsDataURL(f);}
}

/* ---------- load + save ---------- */
function loadAll(){
 if(!window.__ssBuilt){try{buildHome($("homeEditor"));buildPage($("pageEditor"));renderSide();preview();window.__ssBuilt=1;}catch(e){}}
 status("⏳ Loading...","info");
 Promise.all([dbGet("settings/about"),dbGet("settings/aboutPage"),dbGet("settings/sidebarConfig")]).then(function(rs){
  var a=rs[0]||{},p=(rs[1]&&rs[1].page)||null,s=rs[1]&&rs[1].home;
  if(s)home=Object.assign(JSON.parse(JSON.stringify(HDEF)),s);
  if(a&&a.title&&!s)home=Object.assign(JSON.parse(JSON.stringify(HDEF)),a);
  if(p)page=Object.assign(JSON.parse(JSON.stringify(PDEF)),p);
  sideCfg=Array.isArray(rs[2])?rs[2]:[];try{var lsx=JSON.parse(localStorage.getItem("mjhSidebarCfg")||"null");if(Array.isArray(lsx))sideCfg=lsx;}catch(e){}sideCfg.forEach(function(x){if(OVR[x.key])x.color=OVR[x.key];});
  buildHome($("homeEditor"));buildPage($("pageEditor"));renderSide();preview();
  status("✅ সব content load হয়েছে","ok");
 }).catch(function(e){buildHome($("homeEditor"));buildPage($("pageEditor"));renderSide();preview();status("❌ Load: "+e.message,"err");});
}
window.saveAboutSettings=function(){
 status("⏳ Save হচ্ছে...","info");
 dbSet("settings/aboutPage",{home:home,page:page,updatedAt:Date.now()})
 .then(function(){return dbSet("settings/about",home);})
 .then(function(){status("✅ Save হয়েছে — homepage + about.html দুটোতেই দেখাবে","ok");})
 .catch(function(e){status("❌ Save ব্যর্থ: "+e.message,"err");});
};
window.resetAboutSettings=function(){
 if(!confirm("সব default content এ ফিরে যাবেন?"))return;
 home=JSON.parse(JSON.stringify(HDEF));page=JSON.parse(JSON.stringify(PDEF));
 buildHome($("homeEditor"));buildPage($("pageEditor"));preview();
 status("↩️ Default load হয়েছে — Save চাপুন","ok");
};
window.deleteAboutSettings=function(){
 if(!confirm("Firebase থেকে সব About content মুছে ফেলবেন?"))return;
 dbSet("settings/aboutPage",null).then(function(){return dbSet("settings/about",null);})
 .then(function(){home=JSON.parse(JSON.stringify(HDEF));page=JSON.parse(JSON.stringify(PDEF));buildHome($("homeEditor"));buildPage($("pageEditor"));preview();status("🗑️ মুছে গেছে","ok");})
 .catch(function(e){status("❌ "+e.message,"err");});
};

/* ---------- SIDEBAR manager ---------- */
function navEl(){var b=$("admin-logout-btn");return b?b.parentElement:(document.querySelector(".admin-tabs")||null);}
function keyOf(b){return b.getAttribute("data-tab")||b.id||(b.textContent||"").trim();}
function sideButtons(){var nav=navEl();if(!nav)return[];return[].slice.call(nav.querySelectorAll("button")).filter(function(b){return b.id!=="admin-logout-btn";});}
function rgb2hex(b){var c=(b.style&&b.style.backgroundColor)||"";if(!c&&window.getComputedStyle)c=getComputedStyle(b).backgroundColor||"";var m=c.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)/);if(!m)return"#333333";return"#"+[1,2,3].map(function(i){var h=(+m[i]).toString(16);return h.length<2?"0"+h:h;}).join("");}
function renderSide(){
 var box=$("sidebarColorManager");if(!box)return;box.innerHTML="";
 var btns=sideButtons(),keys=btns.map(keyOf),list=[];
 sideCfg.forEach(function(c){if(keys.indexOf(c.key)>-1)list.push(c);});
 btns.forEach(function(b){var k=keyOf(b),f=false;list.forEach(function(c){if(c.key===k)f=true;});if(!f)list.push({key:k,text:(b.textContent||"").trim(),color:rgb2hex(b)});});
 list.forEach(function(x){if(OVR[x.key])x.color=OVR[x.key];});sideCfg=list;sideCfg.forEach(function(x){if(x.color==="#333333")x.color="";});
 list.forEach(function(item,i){
  var row=document.createElement("div");row.style.cssText="display:flex;align-items:center;gap:6px;padding:8px;background:#1a242f;border:1px solid #333;border-radius:6px;margin-bottom:6px";
  var hex=/^#[0-9a-f]{6}$/i.test(item.color||"")?item.color:"#333333";
  row.innerHTML='<span style="color:#888">⋮⋮</span><span style="flex:1;color:#fff;font-size:13px">'+esc(item.text)+'</span><input type="color" value="'+hex+'" style="width:38px;height:30px;border:none;background:none;cursor:pointer"><button data-u="'+i+'" style="background:#3b82f6;color:#fff;border:none;border-radius:4px;padding:4px 7px">▲</button><button data-d="'+i+'" style="background:#3b82f6;color:#fff;border:none;border-radius:4px;padding:4px 7px">▼</button>';
  row.querySelector('input[type=color]').addEventListener("input",function(e){OVR[item.key]=e.target.value;sideCfg[i].color=e.target.value;applyCfg(sideCfg);});
  box.appendChild(row);});
 box.onclick=function(e){var t=e.target;
  if(t.dataset&&t.dataset.u!==undefined){var i=+t.dataset.u;if(i>0){var m=sideCfg.splice(i,1)[0];sideCfg.splice(i-1,0,m);renderSide();}}
  else if(t.dataset&&t.dataset.d!==undefined){var j=+t.dataset.d;if(j<sideCfg.length-1){var m2=sideCfg.splice(j,1)[0];sideCfg.splice(j+1,0,m2);renderSide();}}};
}
window.saveSidebarSettings=function(){
 try{localStorage.setItem("mjhSidebarCfg",JSON.stringify(sideCfg));}catch(e){}
 window.__sideCache=sideCfg;applyCfg(sideCfg);
 status("✅ Sidebar save হয়েছে","ok");
 dbSet("settings/sidebarConfig",sideCfg).then(function(){status("✅ Sidebar save + sync হয়েছে","ok");}).catch(function(){});
};
function findBtn(key){var nav=navEl();if(!nav)return null;var b=nav.querySelector('[data-tab="'+key+'"]');if(b)return b;var byId=document.getElementById(key);if(byId&&nav.contains(byId))return byId;return[].slice.call(nav.querySelectorAll("button,a")).filter(function(x){return(x.textContent||"").trim()===key;})[0]||null;}
function applyCfg(d){
 if(!Array.isArray(d))return;window.__sideCache=d;var nav=navEl();if(!nav)return;var logout=$("admin-logout-btn");
 d.forEach(function(c){if(c.color==="#333333")c.color="";var btn=findBtn(c.key);if(!btn)return;if(c.color){btn.style.background=c.color;btn.style.color="#fff";btn.style.fontWeight="700";btn.dataset.colored="1";}if(logout)nav.insertBefore(btn,logout);});
}
function applySide(){
 try{var ls=JSON.parse(localStorage.getItem("mjhSidebarCfg")||"null");if(Array.isArray(ls))applyCfg(ls);}catch(e){}
}

window.ssShow=function(w){var m=$("ssMenu"),a=$("ssAboutWrap"),s2=$("ssSideWrap");if(!m||!a||!s2)return;m.style.display=(w==="menu")?"":"none";a.style.display=(w==="about")?"":"none";s2.style.display=(w==="side")?"":"none";if(!window.__ssBuilt){try{buildHome($("homeEditor"));buildPage($("pageEditor"));renderSide();preview();window.__ssBuilt=1;}catch(e){}}};
window.resetSidebarSettings=function(){if(!confirm("Sidebar-এর saved color/order config মুছে ফেলবেন? Sidebar আগের মতো হয়ে যাবে।"))return;localStorage.removeItem("mjhSidebarCfg");dbSet("settings/sidebarConfig",null).then(function(){location.reload();}).catch(function(e){status("❌ "+e.message,"err");});};
/* ---------- init ---------- */
function init(){
 var obs=new MutationObserver(function(){var t=$("tab-site-settings");if(t&&t.classList.contains("active")&&!t.dataset.loaded){t.dataset.loaded="1";loadAll();}});
 obs.observe(document.body,{attributes:true,subtree:true,attributeFilter:["class"]});
 setInterval(function(){var t=$("tab-site-settings");if(t&&!t.classList.contains("active"))delete t.dataset.loaded;},1000);
 setInterval(function(){var t=$("tab-site-settings");if(t&&t.classList.contains("active")&&!t.dataset.loaded){t.dataset.loaded="1";loadAll();}},800);
 setTimeout(function(){window.ssShow&&window.ssShow("menu");},300);
 setTimeout(applySide,1200);setTimeout(applySide,3000);
 setInterval(function(){var c=window.__sideCache;if(!c||!c.forEach)return;c.forEach(function(it){var b=findBtn(it.key);if(b&&it.color){b.style.background=it.color;b.style.color="#fff";b.style.fontWeight="700";}});},2500);
}
(function(){
 var tabBtn=document.querySelector('[data-tab="site-settings"]');
 if(tabBtn){tabBtn.addEventListener("click",function(){window.__ssBuilt=0;setTimeout(loadAll,100);});}
 var checkInterval=setInterval(function(){
  var t=$("tab-site-settings");
  if(!t||!t.classList.contains("active")){window.__ssBuilt=0;return;}
  var h=$("homeEditor"),p=$("pageEditor");
  if(h&&!h.children.length){try{buildHome(h);buildPage(p);renderSide();preview();window.__ssBuilt=1;}catch(e){}}
 },500);
})();
if(document.readyState==="loading")document.addEventListener("DOMContentLoaded",init);else init();
})();
