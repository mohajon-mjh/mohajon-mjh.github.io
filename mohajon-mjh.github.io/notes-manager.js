/* MJH Notes Manager v1 - Search, Edit, Save, Delete, Mark All */
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
   return (n.productName||"").toLowerCase().indexOf(searchVal)>-1||
          (n.marketplace||"").toLowerCase().indexOf(searchVal)>-1||
          (n.companyName||"").toLowerCase().indexOf(searchVal)>-1;
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
  html+='<div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(340px,1fr));gap:12px">';
  list.forEach(function(n){
   html+='<div style="background:#1a242f;border-radius:10px;padding:14px;border-left:4px solid #FFD814">';
   html+='<label style="display:flex;align-items:center;gap:6px;color:#FFD814;font-size:12px;margin-bottom:8px"><input type="checkbox" class="noteChk" data-id="'+n.id+'"> সিলেক্ট</label>';
   html+='<div style="color:#fff;font-weight:700;font-size:14px;margin-bottom:6px">'+(n.productName||"পণ্যের নাম নেই")+'</div>';
   html+='<table style="font-size:12px;color:#ccc;width:100%;border-collapse:collapse">';
   if(n.marketplace)html+='<tr><td style="padding:2px 0;color:#888">🏪 মার্কেটপ্লেস:</td><td>'+n.marketplace+'</td></tr>';
   if(n.oldPrice)html+='<tr><td style="padding:2px 0;color:#888">💰 আগের দাম:</td><td>৳'+n.oldPrice+'</td></tr>';
   if(n.currentPrice)html+='<tr><td style="padding:2px 0;color:#888">💵 বর্তমান দাম:</td><td>৳'+n.currentPrice+'</td></tr>';
   if(n.discountPercent)html+='<tr><td style="padding:2px 0;color:#888">📉 ডিসকাউন্ট:</td><td>'+n.discountPercent+'%</td></tr>';
   if(n.discountStart)html+='<tr><td style="padding:2px 0;color:#888">📅 শুরু:</td><td>'+n.discountStart+'</td></tr>';
   if(n.discountEnd)html+='<tr><td style="padding:2px 0;color:#888">📅 শেষ:</td><td>'+n.discountEnd+'</td></tr>';
   if(n.color)html+='<tr><td style="padding:2px 0;color:#888">🎨 কালার:</td><td>'+n.color+'</td></tr>';
   if(n.sizeWeight)html+='<tr><td style="padding:2px 0;color:#888">📏 সাইজ/ওজন:</td><td>'+n.sizeWeight+'</td></tr>';
   if(n.companyName)html+='<tr><td style="padding:2px 0;color:#888">🏢 কোম্পানি:</td><td>'+n.companyName+'</td></tr>';
   html+='</table>';
   if(n.description)html+='<div style="margin-top:8px;font-size:11px;color:#aaa;line-height:1.4">'+n.description+'</div>';
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
 var data={
  marketplace:form.querySelector('[name="marketplace"]').value.trim(),
  productName:form.querySelector('[name="productName"]').value.trim(),
  oldPrice:form.querySelector('[name="oldPrice"]').value.trim(),
  currentPrice:form.querySelector('[name="currentPrice"]').value.trim(),
  discountStart:form.querySelector('[name="discountStart"]').value.trim(),
  discountEnd:form.querySelector('[name="discountEnd"]').value.trim(),
  discountPercent:form.querySelector('[name="discountPercent"]').value.trim(),
  description:form.querySelector('[name="description"]').value.trim(),
  color:form.querySelector('[name="color"]').value.trim(),
  sizeWeight:form.querySelector('[name="sizeWeight"]').value.trim(),
  companyName:form.querySelector('[name="companyName"]').value.trim(),
  updatedAt:Date.now()
 };
 if(!data.productName)return toast("পণ্যের নাম দরকার","#c0392b");
 import("https://www.gstatic.com/firebasejs/12.0.0/firebase-database.js").then(function(fd){
  var key=id||uid();
  if(!id)data.createdAt=Date.now();
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
 form.querySelector('[name="marketplace"]').value=(data&&data.marketplace)||"";
 form.querySelector('[name="productName"]').value=(data&&data.productName)||"";
 form.querySelector('[name="oldPrice"]').value=(data&&data.oldPrice)||"";
 form.querySelector('[name="currentPrice"]').value=(data&&data.currentPrice)||"";
 form.querySelector('[name="discountStart"]').value=(data&&data.discountStart)||"";
 form.querySelector('[name="discountEnd"]').value=(data&&data.discountEnd)||"";
 form.querySelector('[name="discountPercent"]').value=(data&&data.discountPercent)||"";
 form.querySelector('[name="description"]').value=(data&&data.description)||"";
 form.querySelector('[name="color"]').value=(data&&data.color)||"";
 form.querySelector('[name="sizeWeight"]').value=(data&&data.sizeWeight)||"";
 form.querySelector('[name="companyName"]').value=(data&&data.companyName)||"";
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
   '<div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(220px,1fr));gap:10px">'+
    '<input name="marketplace" placeholder="🏪 মার্কেটপ্লেসের নাম (Daraz, Flipkart...)" style="padding:10px;border-radius:6px;border:1px solid #444;background:#111;color:#fff">'+
    '<input name="productName" placeholder="📦 পণ্যের নাম *" style="padding:10px;border-radius:6px;border:1px solid #444;background:#111;color:#fff;font-weight:700">'+
    '<input name="oldPrice" placeholder="💰 আগের দাম (৳)" type="number" step="0.01" style="padding:10px;border-radius:6px;border:1px solid #444;background:#111;color:#fff">'+
    '<input name="currentPrice" placeholder="💵 বর্তমান দাম (৳)" type="number" step="0.01" style="padding:10px;border-radius:6px;border:1px solid #444;background:#111;color:#fff">'+
    '<input name="discountStart" placeholder="📅 ডিসকাউন্ট শুরু (2026-08-22)" type="date" style="padding:10px;border-radius:6px;border:1px solid #444;background:#111;color:#fff">'+
    '<input name="discountEnd" placeholder="📅 ডিসকাউন্ট শেষ (2026-09-22)" type="date" style="padding:10px;border-radius:6px;border:1px solid #444;background:#111;color:#fff">'+
    '<input name="discountPercent" placeholder="📉 ডিসকাউন্ট %" type="number" style="padding:10px;border-radius:6px;border:1px solid #444;background:#111;color:#fff">'+
    '<input name="color" placeholder="🎨 কালার (লাল, নীল...)" style="padding:10px;border-radius:6px;border:1px solid #444;background:#111;color:#fff">'+
    '<input name="sizeWeight" placeholder="📏 সাইজ/ওজন (XL / 500g)" style="padding:10px;border-radius:6px;border:1px solid #444;background:#111;color:#fff">'+
    '<input name="companyName" placeholder="🏢 কোম্পানির নাম" style="padding:10px;border-radius:6px;border:1px solid #444;background:#111;color:#fff">'+
   '</div>'+
   '<textarea name="description" placeholder="📝 পণ্যের বিস্তারিত বর্ণনা" rows="3" style="width:100%;padding:10px;margin-top:10px;border-radius:6px;border:1px solid #444;background:#111;color:#fff;box-sizing:border-box;font-family:inherit"></textarea>'+
   '<div style="display:flex;gap:10px;margin-top:12px">'+
    '<button onclick="notesBulkSave()" style="flex:1;background:#27ae60;color:#fff;border:none;border-radius:6px;padding:12px;font-weight:800;cursor:pointer">💾 Save</button>'+
    '<button onclick="notesCancel()" style="flex:1;background:#555;color:#fff;border:none;border-radius:6px;padding:12px;font-weight:800;cursor:pointer">✕ Cancel</button>'+
   '</div>'+
  '</div>'+
  '<div style="display:flex;gap:10px;margin-bottom:15px;flex-wrap:wrap">'+
   '<button onclick="notesNew()" style="background:#27ae60;color:#fff;border:none;border-radius:6px;padding:10px 16px;font-weight:800;cursor:pointer">➕ নতুন নোট</button>'+
   '<input id="notesSearch" type="text" placeholder="🔍 Search (নাম/মার্কেটপ্লেস/কোম্পানি)" oninput="window.notesSearchFn(this.value)" style="flex:1;min-width:200px;padding:10px;border-radius:6px;border:1px solid #444;background:#111;color:#fff">'+
  '</div>'+
  '<div id="notesContainer"><p style="color:#888;text-align:center;padding:20px">⏳ লোড হচ্ছে...</p></div>';
 
 logout.parentNode.insertBefore(section,logout.nextSibling);
 
 var si=document.getElementById("notesSearch");
 if(si)si.addEventListener("input",function(){render();});
 
 init();
}

for(var i=1;i<=15;i++)setTimeout(buildUI,i*500);
})();
