/* Home Products Enhancer v1 - Adds: file upload, bulk stock/date, full delete, 10+arrow */
(function(){
"use strict";
var BASE="https://mohajon-mjh-default-rtdb.firebaseio.com";
var fd=null,db=null;

function init(){
 if(fd)return Promise.resolve(true);
 return Promise.all([
  import("https://www.gstatic.com/firebasejs/12.0.0/firebase-app.js"),
  import("https://www.gstatic.com/firebasejs/12.0.0/firebase-database.js")
 ]).then(function(M){
  fd=M[1];
  var app=M[0].getApps().length?M[0].getApp():M[0].initializeApp({apiKey:"AIzaSyDj_LLHWBgcKfQClnaOUqEtULHhP1vSVxw",authDomain:"mohajon-mjh.firebaseapp.com",databaseURL:BASE,projectId:"mohajon-mjh",appId:"1:526105903976:web:f9321c6d68ecbd19d58cdd"});
  db=fd.getDatabase(app);
  return true;
 }).catch(function(){return false;});
}

function toast(m,c){var t=document.createElement("div");t.textContent=m;t.style.cssText="position:fixed;top:20px;right:16px;background:"+(c||"#27ae60")+";color:#fff;padding:12px 18px;border-radius:8px;z-index:99999;font-weight:700";document.body.appendChild(t);setTimeout(function(){t.remove();},2500);}

// ১) Choose file + নতুন পণ্য যোগ
function addFileUpload(){
 var found=document.getElementById("pFound");
 if(!found||found.dataset.enh)return;
 found.dataset.enh="1";
 var bar=document.createElement("div");
 bar.className="bar";
 bar.innerHTML='<input type="file" id="npFile" accept="image/*" style="flex:1"><input id="npTitle" placeholder="পণ্যের নাম" style="flex:1;min-width:120px"><input id="npPrice" type="number" placeholder="দাম ৳" style="width:90px"><input id="npStock" type="number" placeholder="stock" style="width:70px"><button class="btn" style="background:#27ae60" id="npSave">➕ নতুন পণ্য Save</button>';
 found.parentNode.insertBefore(bar,found);
 
 document.getElementById("npSave").onclick=function(){
  init().then(function(ok){
   if(!ok)return toast("❌ লোড হয়নি","#c0392b");
   var t=document.getElementById("npTitle").value.trim();
   var pr=+document.getElementById("npPrice").value||0;
   var st=+document.getElementById("npStock").value||10;
   if(!t)return toast("❌ নাম দিন","#c0392b");
   var f=document.getElementById("npFile").files[0];
   function finish(url){
    var id="p_"+Date.now().toString(36)+Math.random().toString(36).substr(2,4);
    var catId=window.CURCAT;
    var S=null;
    window.HP_SECTIONS.forEach(function(s){if(s.key===window.CURSEC)S=s;});
    if(!S)return;
    fd.set(fd.ref(db,"products/"+id),{title:t,price:pr,stock:st,status:"active",createdAt:Date.now(),images:{main:url||""}}).then(function(){
     return fd.set(fd.ref(db,S.prodPath+"/"+catId+"/"+id),{id:id,addedAt:Date.now()});
    }).then(function(){
     toast("✅ নতুন পণ্য যোগ হয়েছে");
     document.getElementById("npTitle").value="";
     document.getElementById("npFile").value="";
     setTimeout(function(){location.reload();},500);
    });
   }
   if(f){
    var rd=new FileReader();
    rd.onload=function(){
     var img=new Image();
     img.onload=function(){
      var c=document.createElement("canvas");
      var w=400,h2=Math.round(400*img.height/img.width)||400;
      c.width=w;c.height=h2;
      var cx=c.getContext("2d");
      cx.fillStyle="#fff";cx.fillRect(0,0,w,h2);
      cx.drawImage(img,0,0,w,h2);
      finish(c.toDataURL("image/jpeg",0.72));
     };
     img.src=rd.result;
    };
    rd.readAsDataURL(f);
   }else finish("");
  });
 };
}

// ২) Bulk stock + date
function addBulkOps(){
 var box=document.getElementById("pList");
 if(!box||box.dataset.bulk)return;
 box.dataset.bulk="1";
 var bar=box.previousElementSibling;
 if(!bar||!bar.className.includes("bar"))return;
 bar.insertAdjacentHTML("beforeend",'<input id="bulkStock" type="number" placeholder="stock" style="width:70px"><button class="btn" style="background:#16a085" id="bStock">📦 stock</button><input id="bulkStart" placeholder="শুরু" style="width:110px"><input id="bulkEnd" placeholder="শেষ" style="width:110px"><button class="btn" style="background:#8e44ad" id="bDate">📅 তারিখ</button>');
 
 document.getElementById("bStock").onclick=function(){
  var sv=+document.getElementById("bulkStock").value||0;
  var ids=[].slice.call(document.querySelectorAll(".pChk:checked")).map(function(c){return c.dataset.id;});
  if(!ids.length)return toast("❌ সিলেক্ট নেই","#c0392b");
  init().then(function(){
   var up={};ids.forEach(function(id){up["products/"+id+"/stock"]=sv;});
   fd.update(fd.ref(db),up).then(function(){toast("✅ "+ids.length+"টার stock বসল");});
  });
 };
 document.getElementById("bDate").onclick=function(){
  var st=document.getElementById("bulkStart").value;
  var en=document.getElementById("bulkEnd").value;
  var ids=[].slice.call(document.querySelectorAll(".pChk:checked")).map(function(c){return c.dataset.id;});
  if(!ids.length)return toast("❌ সিলেক্ট নেই","#c0392b");
  init().then(function(){
   var S=null;window.HP_SECTIONS.forEach(function(s){if(s.key===window.CURSEC)S=s;});
   var up={};ids.forEach(function(id){up[S.prodPath+"/"+window.CURCAT+"/"+id+"/startDate"]=st;up[S.prodPath+"/"+window.CURCAT+"/"+id+"/endDate"]=en;});
   fd.update(fd.ref(db),up).then(function(){toast("✅ তারিখ বসল");});
  });
 };
}

// ৩) Full delete (purge)
function addFullDelete(){
 document.addEventListener("click",function(e){
  var b=e.target.closest?e.target.closest("button[data-dl]"):null;
  if(!b)return;
  var id=b.dataset.dl;
  if(!confirm("পণ্য সম্পূর্ণ মুছবেন? home থেকেও সরবে!"))return;
  init().then(function(){
   fd.get(fd.ref(db,"settings")).then(function(s){
    var up={};
    up["products/"+id]=null;
    up["futureProducts/"+id]=null;
    var st=(s.val()||{});
    ["flashSaleCategoryProducts","dealsOfDayCategoryProducts","specialCategoryProducts","globalCategoryProducts"].forEach(function(nn){
     var m=st[nn]||{};
     Object.keys(m).forEach(function(cat){
      var items=m[cat]||{};
      Object.keys(items).forEach(function(k){
       if(k===id||(items[k]&&items[k].id===id))up["settings/"+nn+"/"+cat+"/"+k]=null;
      });
     });
    });
    return fd.update(fd.ref(db),up);
   }).then(function(){toast("✅ পণ্য মুছে গেছে");setTimeout(function(){location.reload();},500);});
  });
 },true);
}

// ৪) Delete button যোগ করি
function injectDeleteBtn(){
 var observer=new MutationObserver(function(){
  document.querySelectorAll("[data-row]").forEach(function(row){
   if(row.dataset.del)return;
   row.dataset.del="1";
   var actions=row.querySelector("div:last-child");
   if(actions&&actions.querySelectorAll("button").length===2){
    var id=row.dataset.row;
    var btn=document.createElement("button");
    btn.className="btn";
    btn.style.cssText="background:#7b241c;flex:1";
    btn.textContent="⛔ Delete";
    btn.dataset.dl=id;
    actions.appendChild(btn);
   }
  });
 });
 observer.observe(document.body,{childList:true,subtree:true});
}

// Boot
function boot(){
 if(document.readyState==="loading")return;
 setTimeout(addFileUpload,800);
 setTimeout(addBulkOps,1200);
 setTimeout(addFullDelete,600);
 setTimeout(injectDeleteBtn,400);
 setInterval(addFileUpload,3000);
 setInterval(addBulkOps,4000);
 setInterval(injectDeleteBtn,2000);
}
document.addEventListener("DOMContentLoaded",boot);
setTimeout(boot,1000);
})();
