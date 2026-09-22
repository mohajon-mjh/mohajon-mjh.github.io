/* MJH Notes Manager v2 - Two-column Product Records (Daraz | Mohajon MJH) */
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
      });
     });
    });
   };
   document.head.appendChild(s3);
  };
  document.head.appendChild(s2);
 };
 document.head.appendChild(s1);
}

function uid(){return "n"+Date.now().toString(36)+Math.random().toString(36).substr(2,5);}

function toast(m,c){
 var t=document.createElement("div");t.textContent=m;
 t.style.cssText="position:fixed;top:80px;right:16px;background:"+(c||"#27ae60")+";color:#fff;padding:12px 18px;border-radius:8px;z-index:99999;font-weight:700;box-shadow:0 4px 12px rgba(0,0,0,.4)";
 document.body.appendChild(t);setTimeout(function(){t.remove();},3000);
}

function init(){
 loadFirebase(function(){
  if(!db){setTimeout(init,1000);return;}
  import("https://www.gstatic.com/firebasejs/12.0.0/firebase-database.js").then(function(fd){
   fd.onValue(fd.ref(db,"adminNotes"),function(snap){
    allNotes=snap.val()||{};
    render();
   });
  });
 });
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
   return (n.productName||"").toLowerCase().indexOf(searchVal)>-1||
          (n.marketplace||"").toLowerCase().indexOf(searchVal)>-1||
          (n.companyName||"").toLowerCase().indexOf(searchVal)>-1||
          (d.productName||"").toLowerCase().indexOf(searchVal)>-1||
          (m.productName||"").toLowerCase().indexOf(searchVal)>-1;
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
  html+='<div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(520px,1fr));gap:12px">';
  list.forEach(function(n){
   var d=n.daraz||{},m=n.mjh||{};
   var has2Col=Object.keys(d).length||Object.keys(m).length;
   
   html+='<div style="background:#1a242f;border-radius:10px;padding:14px;border-left:4px solid #FFD814">';
   html+='<label style="display:flex;align-items:center;gap:6px;color:#FFD814;font-size:12px;margin-bottom:8px"><input type="checkbox" class="noteChk" data-id="'+n.id+'"> সিলেক্ট</label>';
   html+='<div style="color:#fff;font-weight:700;font-size:14px;margin-bottom:6px">'+(n.productName||"পণ্যের নাম নেই")+'</div>';
   
   if(has2Col){
    html+='<div style="display:grid;grid-template-columns:1fr 1fr;gap:8px">';
    // Daraz column
    html+='<div style="background:#141c26;border-radius:6px;padding:8px;border-top:2px solid #FF9900">';
    html+='<div style="color:#FF9900;font-weight:700;font-size:11px;margin-bottom:4px">DARAZ</div>';
    html+='<table style="font-size:11px;color:#ccc;width:100%;border-collapse:collapse">';
    if(d.productName)html+='<tr><td style="padding:1px 0;color:#888">পণ্য:</td><td>'+d.productName+'</td></tr>';
    if(d.oldPrice)html+='<tr><td style="padding:1px 0;color:#888">অরিজিনাল:</td><td>৳'+d.oldPrice+'</td></tr>';
    if(d.currentPrice)html+='<tr><td style="padding:1px 0;color:#888">বর্তমান:</td><td>৳'+d.currentPrice+'</td></tr>';
    if(d.delivery)html+='<tr><td style="padding:1px 0;color:#888">ডেলিভারি:</td><td>৳'+d.delivery+'</td></tr>';
    if(d.packaging)html+='<tr><td style="padding:1px 0;color:#888">প্যাকেজিং:</td><td>৳'+d.packaging+'</td></tr>';
    if(d.total)html+='<tr><td style="padding:1px 0;color:#888;font-weight:700">টোটাল:</td><td style="font-weight:700">৳'+d.total+'</td></tr>';
    if(d.discAmt)html+='<tr><td style="padding:1px 0;color:#888">ডিসকাউন্ট:</td><td>৳'+d.discAmt+' ('+d.discPct+'%)</td></tr>';
    if(d.color)html+='<tr><td style="padding:1px 0;color:#888">কালার:</td><td>'+d.color+'</td></tr>';
    if(d.brand)html+='<tr><td style="padding:1px 0;color:#888">ব্র্যান্ড:</td><td>'+d.brand+'</td></tr>';
    html+='</table>';
    if(d.desc)html+='<div style="margin-top:6px;font-size:10px;color:#aaa;line-height:1.3">'+d.desc+'</div>';
    html+='</div>';
    
    // Mohajon MJH column
    html+='<div style="background:#141c26;border-radius:6px;padding:8px;border-top:2px solid #2980b9">';
    html+='<div style="color:#2980b9;font-weight:700;font-size:11px;margin-bottom:4px">MOHAJON MJH</div>';
    html+='<table style="font-size:11px;color:#ccc;width:100%;border-collapse:collapse">';
    if(m.productName)html+='<tr><td style="padding:1px 0;color:#888">পণ্য:</td><td>'+m.productName+'</td></tr>';
    if(m.oldPrice)html+='<tr><td style="padding:1px 0;color:#888">অরিজিনাল:</td><td>৳'+m.oldPrice+'</td></tr>';
    if(m.currentPrice)html+='<tr><td style="padding:1px 0;color:#888">বর্তমান:</td><td>৳'+m.currentPrice+'</td></tr>';
    if(m.delivery)html+='<tr><td style="padding:1px 0;color:#888">ডেলিভারি:</td><td>৳'+m.delivery+'</td></tr>';
    if(m.packaging)html+='<tr><td style="padding:1px 0;color:#888">প্যাকেজিং:</td><td>৳'+m.packaging+'</td></tr>';
    if(m.total)html+='<tr><td style="padding:1px 0;color:#888;font-weight:700">টোটাল:</td><td style="font-weight:700">৳'+m.total+'</td></tr>';
    if(m.discAmt)html+='<tr><td style="padding:1px 0;color:#888">ডিসকাউন্ট:</td><td>৳'+m.discAmt+' ('+m.discPct+'%)</td></tr>';
    if(m.profit!==null&&m.profit!==undefined)html+='<tr><td style="padding:1px 0;color:#7CFC00;font-weight:700">লাভ:</td><td style="color:#7CFC00;font-weight:700">৳'+m.profit+'</td></tr>';
    if(m.color)html+='<tr><td style="padding:1px 0;color:#888">কালার:</td><td>'+m.color+'</td></tr>';
    if(m.brand)html+='<tr><td style="padding:1px 0;color:#888">ব্র্যান্ড:</td><td>'+m.brand+'</td></tr>';
    html+='</table>';
    if(m.desc)html+='<div style="margin-top:6px;font-size:10px;color:#aaa;line-height:1.3">'+m.desc+'</div>';
    html+='</div>';
    html+='</div>';
   }else{
    html+='<table style="font-size:12px;color:#ccc;width:100%;border-collapse:collapse">';
    if(n.marketplace)html+='<tr><td style="padding:2px 0;color:#888">🏪 মার্কেটপ্লেস:</td><td>'+n.marketplace+'</td></tr>';
    if(n.oldPrice)html+='<tr><td style="padding:2px 0;color:#888">💰 আগের দাম:</td><td>৳'+n.oldPrice+'</td></tr>';
    if(n.currentPrice)html+='<tr><td style="padding:2px 0;color:#888">💵 বর্তমান দাম:</td><td>৳'+n.currentPrice+'</td></tr>';
    if(n.discountPercent)html+='<tr><td style="padding:2px 0;color:#888">📉 ডিসকাউন্ট:</td><td>'+n.discountPercent+'%</td></tr>';
    if(n.color)html+='<tr><td style="padding:2px 0;color:#888">🎨 কালার:</td><td>'+n.color+'</td></tr>';
    if(n.companyName)html+='<tr><td style="padding:2px 0;color:#888">🏢 কোম্পানি:</td><td>'+n.companyName+'</td></tr>';
    html+='</table>';
    if(n.description)html+='<div style="margin-top:8px;font-size:11px;color:#aaa;line-height:1.4">'+n.description+'</div>';
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
 import("https://www.gstatic.com/firebasejs/12.0.0/firebase-database.js").then(function(fd){
  var updates={};
  ids.forEach(function(id){updates["adminNotes/"+id]=null;});
  fd.update(fd.ref(db),updates).then(function(){
   toast("✅ "+ids.length+"টা নোট মুছে গেছে");
  }).catch(function(e){toast("❌ "+e.message,"#c0392b");});
 });
};

window.notesEdit=function(id){
 var n=allNotes[id];if(!n)return;
 showForm(n,id);
};

window.notesDelete=function(id){
 if(!confirm("এই নোট মুছবেন?"))return;
 import("https://www.gstatic.com/firebasejs/12.0.0/firebase-database.js").then(function(fd){
  fd.remove(fd.ref(db,"adminNotes/"+id)).then(function(){toast("✅ নোট মুছে গেছে");}).catch(function(e){toast("❌ "+e.message,"#c0392b");});
 });
};

window.notesBulkSave=function(){
 var form=document.getElementById("notesForm");
 if(!form)return;
 var id=form.dataset.editId||null;
 
 function gv(n){var el=form.querySelector('[name="'+n+'"]');return el?el.value.trim():"";}
 
 var d={
  productName:gv("d_productName"),
  oldPrice:gv("d_oldPrice"),
  currentPrice:gv("d_currentPrice"),
  delivery:gv("d_delivery"),
  packaging:gv("d_packaging"),
  color:gv("d_color"),
  brand:gv("d_brand"),
  desc:gv("d_desc")
 };
 var m={
  productName:gv("m_productName"),
  oldPrice:gv("m_oldPrice"),
  currentPrice:gv("m_currentPrice"),
  delivery:gv("m_delivery"),
  packaging:gv("m_packaging"),
  color:gv("m_color"),
  brand:gv("m_brand"),
  desc:gv("m_desc")
 };
 
 // Calculate totals
 var dOld=parseFloat(d.oldPrice)||0,dCur=parseFloat(d.currentPrice)||0,dDel=parseFloat(d.delivery)||0,dPack=parseFloat(d.packaging)||0;
 var mOld=parseFloat(m.oldPrice)||0,mCur=parseFloat(m.currentPrice)||0,mDel=parseFloat(m.delivery)||0,mPack=parseFloat(m.packaging)||0;
 
 d.total=dCur+dDel+dPack;
 d.discAmt=dOld-dCur;
 d.discPct=dOld>0?Math.round(((dOld-dCur)/dOld)*1000)/10:0;
 
 m.total=mCur+mDel+mPack;
 m.discAmt=mOld-mCur;
 m.discPct=mOld>0?Math.round(((mOld-mCur)/mOld)*1000)/10:0;
 
 // Profit calculation (only if Mohajon has data)
 var hasM=m.productName||m.oldPrice||m.currentPrice||m.delivery||m.packaging;
 m.profit=hasM?(m.total-d.total):null;
 
 if(!d.productName&&!m.productName)return toast("পণ্যের নাম দরকার","#c0392b");
 
 var data={
  v:2,
  productName:d.productName||m.productName,
  marketplace:"Daraz + Mohajon MJH",
  companyName:d.brand||m.brand,
  color:d.color||m.color,
  description:d.desc||m.desc,
  daraz:d,
  mjh:m,
  updatedAt:Date.now()
 };
 if(!id)data.createdAt=Date.now();
 
 import("https://www.gstatic.com/firebasejs/12.0.0/firebase-database.js").then(function(fd){
  var key=id||uid();
  fd.set(fd.ref(db,"adminNotes/"+key),data).then(function(){
   toast(id?"✅ সেভ হয়েছে":"✅ নতুন নোট যোগ হয়েছে");
   hideForm();
  }).catch(function(e){toast("❌ "+e.message,"#c0392b");});
 });
};

window.notesCancel=function(){hideForm();};

function showForm(data,editId){
 var form=document.getElementById("notesForm");
 form.style.display="block";
 form.dataset.editId=editId||"";
 
 var d=(data&&data.daraz)||{},m=(data&&data.mjh)||{};
 
 // Fallback for old format
 if(data&&!data.daraz&&!data.mjh){
  d={productName:data.productName,oldPrice:data.oldPrice,currentPrice:data.currentPrice,color:data.color,brand:data.companyName,desc:data.description};
  m={};
 }
 
 function sv(n,v){var el=form.querySelector('[name="'+n+'"]');if(el)el.value=(v==null?"":v);}
 
 sv("d_productName",d.productName);sv("d_oldPrice",d.oldPrice);sv("d_currentPrice",d.currentPrice);
 sv("d_delivery",d.delivery);sv("d_packaging",d.packaging);sv("d_color",d.color);sv("d_brand",d.brand);sv("d_desc",d.desc);
 
 sv("m_productName",m.productName);sv("m_oldPrice",m.oldPrice);sv("m_currentPrice",m.currentPrice);
 sv("m_delivery",m.delivery);sv("m_packaging",m.packaging);sv("m_color",m.color);sv("m_brand",m.brand);sv("m_desc",m.desc);
 
 form.querySelector('.notesFormTitle').textContent=editId?"✏️ নোট এডিট করুন":"➕ নতুন নোট যোগ করুন";
 form.scrollIntoView({behavior:"smooth",block:"start"});
}

window.notesNew=function(){showForm(null,null);};
function hideForm(){var f=document.getElementById("notesForm");if(f){f.style.display="none";f.dataset.editId="";}}

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
   '<div class="notesGrid2" style="display:grid;grid-template-columns:1fr 1fr;gap:12px">'+
    // Daraz column
    '<div style="background:#0e1520;border:1px solid #333;border-radius:8px;padding:10px;border-top:3px solid #FF9900">'+
     '<div style="color:#FF9900;font-weight:800;font-size:13px;margin-bottom:8px">DARAZ</div>'+
     '<input name="d_productName" placeholder="📦 পণ্যের নাম *" style="width:100%;padding:9px;margin-bottom:8px;border-radius:6px;border:1px solid #444;background:#111;color:#fff;font-weight:700">'+
     '<input name="d_oldPrice" placeholder="💰 অরিজিনাল দাম (৳)" type="number" step="0.01" style="width:100%;padding:9px;margin-bottom:8px;border-radius:6px;border:1px solid #444;background:#111;color:#fff">'+
     '<input name="d_currentPrice" placeholder="💵 বর্তমান দাম (৳)" type="number" step="0.01" style="width:100%;padding:9px;margin-bottom:8px;border-radius:6px;border:1px solid #444;background:#111;color:#fff">'+
     '<input name="d_delivery" placeholder="🚚 Delivery charge (৳)" type="number" step="0.01" style="width:100%;padding:9px;margin-bottom:8px;border-radius:6px;border:1px solid #444;background:#111;color:#fff">'+
     '<input name="d_packaging" placeholder="📦 প্যাকেজিং ও অন্যান্য (৳)" type="number" step="0.01" style="width:100%;padding:9px;margin-bottom:8px;border-radius:6px;border:1px solid #444;background:#111;color:#fff">'+
     '<input name="d_color" placeholder="🎨 কালার (Blue, Pink, Black)" style="width:100%;padding:9px;margin-bottom:8px;border-radius:6px;border:1px solid #444;background:#111;color:#fff">'+
     '<input name="d_brand" placeholder="🏢 ব্র্যান্ড নাম" style="width:100%;padding:9px;margin-bottom:8px;border-radius:6px;border:1px solid #444;background:#111;color:#fff">'+
     '<textarea name="d_desc" placeholder="📝 বিস্তারিত বিবরণ" rows="3" style="width:100%;padding:9px;margin-bottom:8px;border-radius:6px;border:1px solid #444;background:#111;color:#fff;box-sizing:border-box;font-family:inherit"></textarea>'+
    '</div>'+
    // Mohajon MJH column
    '<div style="background:#0e1520;border:1px solid #333;border-radius:8px;padding:10px;border-top:3px solid #2980b9">'+
     '<div style="color:#2980b9;font-weight:800;font-size:13px;margin-bottom:8px">MOHAJON MJH</div>'+
     '<input name="m_productName" placeholder="📦 পণ্যের নাম *" style="width:100%;padding:9px;margin-bottom:8px;border-radius:6px;border:1px solid #444;background:#111;color:#fff;font-weight:700">'+
     '<input name="m_oldPrice" placeholder="💰 অরিজিনাল দাম (৳)" type="number" step="0.01" style="width:100%;padding:9px;margin-bottom:8px;border-radius:6px;border:1px solid #444;background:#111;color:#fff">'+
     '<input name="m_currentPrice" placeholder="💵 বর্তমান দাম (৳)" type="number" step="0.01" style="width:100%;padding:9px;margin-bottom:8px;border-radius:6px;border:1px solid #444;background:#111;color:#fff">'+
     '<input name="m_delivery" placeholder="🚚 Delivery charge (৳)" type="number" step="0.01" style="width:100%;padding:9px;margin-bottom:8px;border-radius:6px;border:1px solid #444;background:#111;color:#fff">'+
     '<input name="m_packaging" placeholder="📦 প্যাকেজিং ও অন্যান্য (৳)" type="number" step="0.01" style="width:100%;padding:9px;margin-bottom:8px;border-radius:6px;border:1px solid #444;background:#111;color:#fff">'+
     '<input name="m_color" placeholder="🎨 কালার (Blue, Pink, Black)" style="width:100%;padding:9px;margin-bottom:8px;border-radius:6px;border:1px solid #444;background:#111;color:#fff">'+
     '<input name="m_brand" placeholder="🏢 ব্র্যান্ড নাম" style="width:100%;padding:9px;margin-bottom:8px;border-radius:6px;border:1px solid #444;background:#111;color:#fff">'+
     '<textarea name="m_desc" placeholder="📝 বিস্তারিত বিবরণ" rows="3" style="width:100%;padding:9px;margin-bottom:8px;border-radius:6px;border:1px solid #444;background:#111;color:#fff;box-sizing:border-box;font-family:inherit"></textarea>'+
    '</div>'+
   '</div>'+
   '<div style="display:flex;gap:10px;margin-top:12px">'+
    '<button onclick="notesBulkSave()" style="flex:1;background:#27ae60;color:#fff;border:none;border-radius:6px;padding:12px;font-weight:800;cursor:pointer">💾 Save</button>'+
    '<button onclick="notesCancel()" style="flex:1;background:#555;color:#fff;border:none;border-radius:6px;padding:12px;font-weight:800;cursor:pointer">✕ Cancel</button>'+
   '</div>'+
  '</div>'+
  '<div style="display:flex;gap:10px;margin-bottom:15px;flex-wrap:wrap">'+
   '<button onclick="notesNew()" style="background:#27ae60;color:#fff;border:none;border-radius:6px;padding:10px 16px;font-weight:800;cursor:pointer">➕ নতুন নোট</button>'+
   '<input id="notesSearch" type="text" placeholder="🔍 Search (নাম/ব্র্যান্ড)" style="flex:1;min-width:200px;padding:10px;border-radius:6px;border:1px solid #444;background:#111;color:#fff">'+
  '</div>'+
  '<div id="notesContainer"><p style="color:#888;text-align:center;padding:20px">⏳ লোড হচ্ছে...</p></div>';
 
 var _ct=document.querySelector('.admin-content');if(_ct){_ct.appendChild(section);}else{logout.parentNode.insertBefore(section,logout.nextSibling);}
 
 var si=document.getElementById("notesSearch");
 if(si)si.addEventListener("input",function(){render();});
 
 init();
}

for(var i=1;i<=15;i++)setTimeout(buildUI,i*500);
})();
