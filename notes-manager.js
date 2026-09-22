/* MJH Notes Manager v4 - 13-field two-column + smart number clean + full popups */
(function(){
"use strict";
var firebaseConfig={apiKey:"AIzaSyDj_LLHWBgcKfQClnaOUqEtULHhP1vSVxw",authDomain:"mohajon-mjh.firebaseapp.com",databaseURL:"https://mohajon-mjh-default-rtdb.firebaseio.com",projectId:"mohajon-mjh",storageBucket:"mohajon-mjh.firebasestorage.app",messagingSenderId:"526105903976",appId:"1:526105903976:web:f9321c6d68ecbd19d58cdd"};
var app=null,db=null,auth=null,allNotes={};

function loadFirebase(cb){
 if(app)return cb();
 var s1=document.createElement("script");s1.src="https://www.gstatic.com/firebasejs/12.0.0/firebase-app.js";s1.type="module";
 s1.onload=function(){
  var s2=document.createElement("script");s2.src="https://www.gstatic.com/firebasejs/12.0.0/firebase-database.js";s2.type="module";
  s2.onload=function(){
   var s3=document.createElement("script");s3.src="https://www.gstatic.com/firebasejs/12.0.0/firebase-auth.js";s3.type="module";
   s3.onload=function(){
    window.firebase=window.firebase||{};
    import("https://www.gstatic.com/firebasejs/12.0.0/firebase-app.js").then(function(fa){
     import("https://www.gstatic.com/firebasejs/12.0.0/firebase-database.js").then(function(fd){
      import("https://www.gstatic.com/firebasejs/12.0.0/firebase-auth.js").then(function(fau){
       app=fa.getApps().length?fa.getApp():fa.initializeApp(firebaseConfig);
       db=fd.getDatabase(app);auth=fau.getAuth(app);
       cb();
      }).catch(function(e){toast("❌ Auth load fail: "+e.message,"#c0392b");});
     }).catch(function(e){toast("❌ DB load fail: "+e.message,"#c0392b");});
    }).catch(function(e){toast("❌ App load fail: "+e.message,"#c0392b");});
   };
   document.head.appendChild(s3);
  };
  document.head.appendChild(s2);
 };
 s1.onerror=function(){toast("❌ Firebase script block হয়েছে — adblock বন্ধ করে রিফ্রেশ দিন","#c0392b");};
 document.head.appendChild(s1);
}

function uid(){return "n"+Date.now().toString(36)+Math.random().toString(36).substr(2,5);}
function num(v){
 v=String(v==null?"":v).replace(/[^0-9.\-]/g,"");
 v=parseFloat(v);
 return isNaN(v)?0:v;
}
function cleanVal(v){return String(v==null?"":v).replace(/[^0-9.\-]/g,"");}
function esc(s){s=(s==null?"":String(s));return s.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;");}
function calc(cur,del,pack,old){
 cur=num(cur);del=num(del);pack=num(pack);old=num(old);
 var total=cur+del+pack;
 var discAmt=old>0?(old-cur):0;
 var discPct=old>0?Math.round(((old-cur)/old)*1000)/10:0;
 return {total:total,discAmt:discAmt,discPct:discPct};
}

function toast(m,c){
 var t=document.createElement("div");t.textContent=m;
 t.style.cssText="position:fixed;top:80px;right:16px;background:"+(c||"#27ae60")+";color:#fff;padding:12px 18px;border-radius:8px;z-index:99999;font-weight:700;box-shadow:0 4px 12px rgba(0,0,0,.4);max-width:80vw";
 document.body.appendChild(t);setTimeout(function(){t.remove();},4000);
}

function init(){
 loadFirebase(function(){
  if(!db){setTimeout(init,1000);return;}
  import("https://www.gstatic.com/firebasejs/12.0.0/firebase-database.js").then(function(fd){
   fd.onValue(fd.ref(db,"adminNotes"),function(snap){
    allNotes=snap.val()||{};
    render();
   },function(err){
    toast("❌ নোট লোড ব্যর্থ: "+err.message,"#c0392b");
   });
  }).catch(function(e){toast("❌ "+e.message,"#c0392b");});
 });
}

function recalc(form){
 function gv(n){var el=form.querySelector('[name="'+n+'"]');return el?el.value:"";}
 function sv(n,v){var el=form.querySelector('[name="'+n+'"]');if(el)el.value=v;}
 ["d_oldPrice","d_currentPrice","d_delivery","d_packaging","m_oldPrice","m_currentPrice","m_delivery","m_packaging"].forEach(function(n){
  var el=form.querySelector('[name="'+n+'"]');
  if(el){var c=cleanVal(el.value);if(c!==el.value)el.value=c;}
 });
 var d=calc(gv("d_currentPrice"),gv("d_delivery"),gv("d_packaging"),gv("d_oldPrice"));
 var m=calc(gv("m_currentPrice"),gv("m_delivery"),gv("m_packaging"),gv("m_oldPrice"));
 sv("d_total",d.total);sv("d_discAmt",d.discAmt);sv("d_discPct",d.discPct);
 sv("m_total",m.total);sv("m_discAmt",m.discAmt);sv("m_discPct",m.discPct);
 var mEmpty=!(gv("m_productName")||gv("m_oldPrice")||gv("m_currentPrice")||gv("m_delivery")||gv("m_packaging"));
 sv("m_profit",mEmpty?"":(m.total-d.total));
}

function sideRows(s,isM,profitVal){
 var h='<table style="font-size:11px;color:#ccc;width:100%;border-collapse:collapse">';
 function r(k,v){if(v!==""&&v!=null)h+='<tr><td style="padding:1px 0;color:#888;white-space:nowrap">'+k+'</td><td style="padding:1px 0 1px 6px">'+esc(v)+'</td></tr>';}
 r("1. পণ্যের নাম:",s.productName);
 r("2. অরিজিনাল দাম:",num(s.oldPrice)?"৳"+s.oldPrice:"");
 r("3. বর্তমান দাম:",num(s.currentPrice)?"৳"+s.currentPrice:"");
 r("4. Delivery charge:",num(s.delivery)?"৳"+s.delivery:"");
 r("5. প্যাকেজিং ও অন্যান্য:",num(s.packaging)?"৳"+s.packaging:"");
 r("6. টোটাল:",s.total!=null&&s.total!==""?"৳"+s.total:"");
 r("7. ডিসকাউন্ট টাকা:",num(s.discAmt)?"৳"+s.discAmt:"");
 r("8. ডিসকাউন্ট %:",num(s.discPct)?s.discPct+"%":"");
 if(isM){r("9. লাভ:",profitVal!=null?"৳"+profitVal:"—");}
 else{r("9. লাভ:","— (খালি)");}
 r("10. কালার:",s.color);
 r("11. পণ্যের ব্র্যান্ড নাম:",s.brand);
 r("12. অতিরিক্ত ঘর:",s.extra);
 h+='</table>';
 if(s.desc)h+='<div style="margin-top:6px;font-size:10px;color:#aaa;line-height:1.3;white-space:pre-wrap"><b style="color:#888">13. বিস্তারিত বিবরণ:</b><br>'+esc(s.desc)+'</div>';
 return h;
}

function flatRows(n){
 var h='<table style="font-size:12px;color:#ccc;width:100%;border-collapse:collapse">';
 function r(k,v){if(v)h+='<tr><td style="padding:2px 0;color:#888">'+k+'</td><td>'+esc(v)+'</td></tr>';}
 r("🏪 মার্কেটপ্লেস:",n.marketplace);r("💰 আগের দাম:",n.oldPrice);r("💵 বর্তমান দাম:",n.currentPrice);r("📉 ডিসকাউন্ট:",n.discountPercent?n.discountPercent+"%":"");r("🎨 কালার:",n.color);r("🏢 কোম্পানি:",n.companyName);
 h+='</table>';
 if(n.description)h+='<div style="margin-top:8px;font-size:11px;color:#aaa;line-height:1.4">'+esc(n.description)+'</div>';
 return h;
}

function render(){
 var container=document.getElementById("notesContainer");
 if(!container)return;
 var searchVal=(document.getElementById("notesSearch")||{}).value||"";
 var list=Object.keys(allNotes).map(function(id){var n=allNotes[id];n.id=id;return n;});
 if(searchVal){
  searchVal=searchVal.toLowerCase();
  list=list.filter(function(n){
   var d=n.daraz||{},m=n.mjh||{};
   var blob=[n.productName,n.marketplace,n.companyName,n.category,d.productName,m.productName,d.brand,m.brand].join(" ").toLowerCase();
   return blob.indexOf(searchVal)>-1;
  });
 }
 list.sort(function(a,b){return (b.createdAt||0)-(a.createdAt||0);});
 var html='<div style="display:flex;gap:10px;margin-bottom:15px;flex-wrap:wrap;align-items:center">'+
  '<label style="color:#fff;display:flex;align-items:center;gap:6px"><input type="checkbox" id="notesMarkAll"> সব সিলেক্ট</label>'+
  '<button onclick="notesBulkDelete()" style="background:#c0392b;color:#fff;border:none;border-radius:6px;padding:8px 14px;font-weight:700;cursor:pointer">🗑️ সিলেক্টেড Delete</button>'+
  '<span id="notesStatus" style="color:#88ccff;font-size:12px"></span>'+
  '</div>';
 if(!list.length){
  html+='<p style="color:#888;text-align:center;padding:20px">📝 কোনো নোট নেই — উপরে নতুন নোট যোগ করুন</p>';
 }else{
  html+='<div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(480px,1fr));gap:12px">';
  list.forEach(function(n){
   var d=n.daraz||{},m=n.mjh||{};
   var has2=Object.keys(d).length||Object.keys(m).length;
   html+='<div style="background:#1a242f;border-radius:10px;padding:14px;border-left:4px solid #FFD814">';
   html+='<label style="display:flex;align-items:center;gap:6px;color:#FFD814;font-size:12px;margin-bottom:8px"><input type="checkbox" class="noteChk" data-id="'+n.id+'"> সিলেক্ট</label>';
   html+='<div style="color:#fff;font-weight:700;font-size:14px;margin-bottom:4px">'+esc(n.productName||"পণ্যের নাম নেই")+'</div>';
   if(n.category)html+='<div style="color:#88ccff;font-size:11px;margin-bottom:8px">📋 ক্যাটাগরি: '+esc(n.category)+'</div>';
   if(has2){
    var profit=(m.profit!=null&&m.profit!=="")?num(m.profit):((m.productName||num(m.currentPrice)||num(m.oldPrice))?(num(m.total)-num(d.total)):null);
    html+='<div style="display:grid;grid-template-columns:1fr 1fr;gap:8px">';
    html+='<div style="background:#141c26;border-radius:6px;padding:8px;border-top:2px solid #FF9900">';
    html+='<div style="color:#FF9900;font-weight:700;font-size:11px;margin-bottom:4px">🌐 মার্কেটপ্লেস নাম: Daraz</div>';
    html+=sideRows(d,false,null);
    html+='</div>';
    html+='<div style="background:#141c26;border-radius:6px;padding:8px;border-top:2px solid #2980b9">';
    html+='<div style="color:#2980b9;font-weight:700;font-size:11px;margin-bottom:4px">🌐 মার্কেটপ্লেস নাম: Mohajon MJH</div>';
    html+=sideRows(m,true,profit);
    html+='</div>';
    html+='</div>';
   }else{
    html+=flatRows(n);
   }
   html+='<div style="display:flex;gap:6px;margin-top:10px">'+
    '<button onclick="notesEdit(\''+n.id+'\')" style="flex:1;background:#2980b9;color:#fff;border:none;border-radius:6px;padding:7px;font-weight:700;font-size:12px;cursor:pointer">✏️ Edit</button>'+
    '<button onclick="notesDelete(\''+n.id+'\')" style="flex:1;background:#c0392b;color:#fff;border:none;border-radius:6px;padding:7px;font-weight:700;font-size:12px;cursor:pointer">🗑️ Delete</button>'+
    '</div>';
   html+='</div>';
  });
  html+='</div>';
 }
 container.innerHTML=html;
 var ma=document.getElementById("notesMarkAll");
 if(ma)ma.onchange=function(){
  document.querySelectorAll(".noteChk").forEach(function(c){c.checked=ma.checked;});
 };
}

window.notesBulkDelete=function(){
 var ids=Array.from(document.querySelectorAll(".noteChk:checked")).map(function(c){return c.dataset.id;});
 if(!ids.length)return toast("কোনো নোট সিলেক্ট করা হয়নি","#c0392b");
 if(!confirm(ids.length+"টা নোট মুছবেন?"))return;
 if(!db)return toast("❌ Firebase লোড হয়নি — রিফ্রেশ দিন","#c0392b");
 import("https://www.gstatic.com/firebasejs/12.0.0/firebase-database.js").then(function(fd){
  var updates={};
  ids.forEach(function(id){updates["adminNotes/"+id]=null;});
  fd.update(fd.ref(db),updates).then(function(){
   toast("✅ "+ids.length+"টা নোট মুছে গেছে");
  }).catch(function(e){toast("❌ "+e.message,"#c0392b");});
 }).catch(function(e){toast("❌ "+e.message,"#c0392b");});
};

window.notesEdit=function(id){
 var n=allNotes[id];if(!n)return;
 showForm(n,id);
};

window.notesDelete=function(id){
 if(!confirm("এই নোট মুছবেন?"))return;
 if(!db)return toast("❌ Firebase লোড হয়নি — রিফ্রেশ দিন","#c0392b");
 import("https://www.gstatic.com/firebasejs/12.0.0/firebase-database.js").then(function(fd){
  fd.remove(fd.ref(db,"adminNotes/"+id)).then(function(){toast("✅ নোট মুছে গেছে");}).catch(function(e){toast("❌ "+e.message,"#c0392b");});
 }).catch(function(e){toast("❌ "+e.message,"#c0392b");});
};

window.notesBulkSave=function(){
 var form=document.getElementById("notesForm");
 if(!form)return;
 var id=form.dataset.editId||null;
 function gv(n){var el=form.querySelector('[name="'+n+'"]');return el?cleanVal(el.value):"";}
 function gvt(n){var el=form.querySelector('[name="'+n+'"]');return el?el.value.trim():"";}
 if(!db)return toast("❌ Firebase লোড হয়নি — পেজ রিফ্রেশ করে আবার Save চাপুন","#c0392b");
 var d={
  productName:gvt("d_productName"),oldPrice:gv("d_oldPrice"),currentPrice:gv("d_currentPrice"),
  delivery:gv("d_delivery"),packaging:gv("d_packaging"),color:gvt("d_color"),brand:gvt("d_brand"),
  extra:gvt("d_extra"),desc:gvt("d_desc")
 };
 var m={
  productName:gvt("m_productName"),oldPrice:gv("m_oldPrice"),currentPrice:gv("m_currentPrice"),
  delivery:gv("m_delivery"),packaging:gv("m_packaging"),color:gvt("m_color"),brand:gvt("m_brand"),
  extra:gvt("m_extra"),desc:gvt("m_desc")
 };
 var dc=calc(d.currentPrice,d.delivery,d.packaging,d.oldPrice);
 var mc=calc(m.currentPrice,m.delivery,m.packaging,m.oldPrice);
 d.total=dc.total;d.discAmt=dc.discAmt;d.discPct=dc.discPct;
 m.total=mc.total;m.discAmt=mc.discAmt;m.discPct=mc.discPct;
 var mEmpty=!(m.productName||m.oldPrice||m.currentPrice||m.delivery||m.packaging);
 m.profit=mEmpty?null:(mc.total-dc.total);
 if(!d.productName&&!m.productName)return toast("⚠️ পণ্যের নাম দরকার","#c0392b");
 var data={
  v:4,
  category:gvt("category"),
  productName:d.productName||m.productName,
  marketplace:"Daraz + Mohajon MJH",
  companyName:d.brand||m.brand,
  color:d.color||m.color,
  description:d.desc||m.desc,
  daraz:d,mjh:m,
  updatedAt:Date.now()
 };
 if(!id)data.createdAt=Date.now();
 import("https://www.gstatic.com/firebasejs/12.0.0/firebase-database.js").then(function(fd){
  var key=id||uid();
  fd.set(fd.ref(db,"adminNotes/"+key),data).then(function(){
   allNotes[key]=data;
   render();
   toast(id?"✅ সেভ হয়েছে":"✅ নতুন নোট যোগ হয়েছে");
   hideForm();
  }).catch(function(e){toast("❌ Save ব্যর্থ: "+e.message,"#c0392b");});
 }).catch(function(e){toast("❌ "+e.message,"#c0392b");});
};

window.notesCancel=function(){hideForm();};

function showForm(data,editId){
 var form=document.getElementById("notesForm");
 form.style.display="block";
 form.dataset.editId=editId||"";
 var d=(data&&data.daraz)||{},m=(data&&data.mjh)||{};
 if(data&&!data.daraz&&!data.mjh){
  d={productName:data.productName,oldPrice:data.oldPrice,currentPrice:data.currentPrice,color:data.color,brand:data.companyName,desc:data.description};
  m={};
 }
 function sv(n,v){var el=form.querySelector('[name="'+n+'"]');if(el)el.value=(v==null?"":v);}
 sv("category",data?data.category:"");
 sv("d_productName",d.productName);sv("d_oldPrice",d.oldPrice);sv("d_currentPrice",d.currentPrice);
 sv("d_delivery",d.delivery);sv("d_packaging",d.packaging);sv("d_color",d.color);sv("d_brand",d.brand);
 sv("d_extra",d.extra);sv("d_desc",d.desc);
 sv("m_productName",m.productName);sv("m_oldPrice",m.oldPrice);sv("m_currentPrice",m.currentPrice);
 sv("m_delivery",m.delivery);sv("m_packaging",m.packaging);sv("m_color",m.color);sv("m_brand",m.brand);
 sv("m_extra",m.extra);sv("m_desc",m.desc);
 recalc(form);
 form.querySelector('.notesFormTitle').textContent=editId?"✏️ নোট এডিট করুন":"➕ নতুন নোট যোগ করুন";
 form.scrollIntoView({behavior:"smooth",block:"start"});
}

window.notesNew=function(){showForm(null,null);};
function hideForm(){var f=document.getElementById("notesForm");if(f){f.style.display="none";f.dataset.editId="";}}

function fi(n,ph,ro){
 var st=ro?"padding:9px;border-radius:6px;border:1px solid #2e5f4a;background:#12241a;color:#7CFC00;font-weight:700":"padding:9px;border-radius:6px;border:1px solid #444;background:#111;color:#fff";
 return '<input name="'+n+'" placeholder="'+ph+'"'+(ro?" readonly":"")+' style="'+st+';width:100%;margin-bottom:8px;box-sizing:border-box">';
}
function ta(n,ph){return '<textarea name="'+n+'" placeholder="'+ph+'" rows="3" style="width:100%;padding:9px;margin-bottom:8px;border-radius:6px;border:1px solid #444;background:#111;color:#fff;box-sizing:border-box;font-family:inherit"></textarea>';}
function panel(p,title,color,withProfit){
 var h='<div style="background:#0e1520;border:1px solid #333;border-radius:8px;padding:10px;border-top:3px solid '+color+'">';
 h+='<div style="color:'+color+';font-weight:800;font-size:13px;margin-bottom:8px">'+title+'</div>';
 h+=fi(p+"_productName","1. পণ্যের নাম *");
 h+=fi(p+"_oldPrice","2. অরিজিনাল দাম (৳ 2,500 পেস্ট করলেও চলবে)");
 h+=fi(p+"_currentPrice","3. বর্তমান দাম (৳)");
 h+=fi(p+"_delivery","4. Delivery charge (৳)");
 h+=fi(p+"_packaging","5. প্যাকেজিং ও অন্যান্য (৳)");
 h+=fi(p+"_total","6. টোটাল (অটো — হাত দেবেন না)",true);
 h+=fi(p+"_discAmt","7. ডিসকাউন্ট টাকা (অটো)",true);
 h+=fi(p+"_discPct","8. ডিসকাউন্ট % (অটো)",true);
 if(withProfit){h+=fi(p+"_profit","9. লাভ (অটো: MJH টোটাল − Daraz টোটাল)",true);}
 else{h+=fi(p+"_profit","9. খালি থাকবে (—)",true);}
 h+=fi(p+"_color","10. কালার (Blue, Pink, Black)");
 h+=fi(p+"_brand","11. পণ্যের ব্র্যান্ড নাম");
 h+=fi(p+"_extra","12. অতিরিক্ত ঘর");
 h+=ta(p+"_desc","13. পণ্যের বিস্তারিত বিবরণ");
 h+='</div>';
 return h;
}

function buildUI(){
 if(document.getElementById("notesManager"))return;
 var logout=document.getElementById("admin-logout-btn");
 if(!logout){setTimeout(buildUI,800);return;}
 var section=document.createElement("div");
 section.id="notesManager";
 section.className="card";
 section.style.cssText="margin-top:30px;border:1px solid #FFD814;background:#232f3e;padding:20px;border-radius:12px";
 section.innerHTML='<h2 style="color:#FFD814;margin:0 0 15px">📝 নোট প্যাড (Product Records)</h2>'+
  '<div id="notesForm" style="display:none;background:#1a242f;padding:16px;border-radius:10px;margin-bottom:15px;border:1px solid #FFD814">'+
   '<div class="notesFormTitle" style="color:#FFD814;font-weight:700;font-size:15px;margin-bottom:12px">➕ নতুন নোট যোগ করুন</div>'+
   '<style>@media(max-width:760px){.notesGrid2{grid-template-columns:1fr!important}}</style>'+
   fi("category","📋 ক্যাটাগরি নাম (যেমন: ⚡ Flash Sale 😍 Up to 20% Off 😍)")+
   '<div class="notesGrid2" style="display:grid;grid-template-columns:1fr 1fr;gap:12px">'+
    panel("d","🌐 মার্কেটপ্লেস নাম: Daraz","#FF9900",false)+
    panel("m","🌐 মার্কেটপ্লেস নাম: Mohajon MJH","#2980b9",true)+
   '</div>'+
   '<div style="display:flex;gap:10px;margin-top:12px">'+
    '<button onclick="notesBulkSave()" style="flex:1;background:#27ae60;color:#fff;border:none;border-radius:6px;padding:12px;font-weight:800;cursor:pointer">💾 Save</button>'+
    '<button onclick="notesCancel()" style="flex:1;background:#555;color:#fff;border:none;border-radius:6px;padding:12px;font-weight:800;cursor:pointer">✕ Cancel</button>'+
   '</div>'+
  '</div>'+
  '<div style="display:flex;gap:10px;margin-bottom:15px;flex-wrap:wrap">'+
   '<button onclick="notesNew()" style="background:#27ae60;color:#fff;border:none;border-radius:6px;padding:10px 16px;font-weight:800;cursor:pointer">➕ নতুন নোট</button>'+
   '<input id="notesSearch" type="text" placeholder="🔍 Search (নাম/ব্র্যান্ড/ক্যাটাগরি)" style="flex:1;min-width:200px;padding:10px;border-radius:6px;border:1px solid #444;background:#111;color:#fff">'+
  '</div>'+
  '<div id="notesContainer"><p style="color:#888;text-align:center;padding:20px">⏳ লোড হচ্ছে...</p></div>';
 var _ct=document.querySelector('.admin-content');if(_ct){_ct.appendChild(section);}else{logout.parentNode.insertBefore(section,logout.nextSibling);}
 var form=document.getElementById("notesForm");
 if(form)form.addEventListener("input",function(){recalc(form);});
 var si=document.getElementById("notesSearch");
 if(si)si.addEventListener("input",function(){render();});
 init();
 setTimeout(function(){
  var c=document.getElementById("notesContainer");
  if(c&&c.innerHTML.indexOf("লোড হচ্ছে")>-1){
   c.innerHTML='<p style="color:#ff9999;text-align:center;padding:20px">❌ ১৫ সেকেন্ডে Firebase সংযোগ হয়নি — ইন্টারনেট/adblock দেখে রিফ্রেশ দিন</p>';
  }
 },15000);
}

for(var i=1;i<=15;i++)setTimeout(buildUI,i*500);
})();
