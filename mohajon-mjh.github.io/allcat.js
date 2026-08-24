/* All Category Manager v1 */
(async function(){
 const fa=await import("https://www.gstatic.com/firebasejs/12.0.0/firebase-app.js");
 const fd=await import("https://www.gstatic.com/firebasejs/12.0.0/firebase-database.js");
 const app=fa.getApps().length?fa.getApp():fa.initializeApp({apiKey:"AIzaSyDj_LLHWBgcKfQClnaOUqEtULHhP1vSVxw",databaseURL:"https://mohajon-mjh-default-rtdb.firebaseio.com",projectId:"mohajon-mjh",appId:"1:526105903976:web:f9321c6d68ecbd19d58cdd"});
 const db=fd.getDatabase(app);
 
 function toast(m,c){const t=document.createElement("div");t.textContent=m;t.style.cssText="position:fixed;top:80px;right:16px;background:"+(c||"#27ae60")+";color:#fff;padding:12px 18px;border-radius:8px;z-index:99999;font-weight:700;box-shadow:0 4px 12px rgba(0,0,0,.4)";document.body.appendChild(t);setTimeout(()=>t.remove(),3000);}
 
 function btn(){
  if(document.getElementById("allCatBtn"))return;
  const anchor=document.getElementById("odBtn")||document.getElementById("mpBtn")||[...document.querySelectorAll("button")].find(b=>/Logout/.test(b.textContent||""));
  if(!anchor)return setTimeout(btn,1000);
  const b=document.createElement("button");b.id="allCatBtn";b.type="button";
  b.innerHTML="📂 All Category";
  b.style.cssText="background:linear-gradient(90deg,#3b82f6,#1e40af);color:#fff;border:none;border-radius:6px;padding:10px 14px;font-weight:800;cursor:pointer;margin:6px 0;width:100%;box-shadow:0 0 12px rgba(59,130,246,.6)";
  b.onclick=openPanel;
  anchor.parentNode.insertBefore(b,anchor.nextSibling);
 }
 for(const t of [800,1800,3200,5000])setTimeout(btn,t);
 
 async function openPanel(){
  let ov=document.getElementById("allCatOv");
  if(!ov){
   ov=document.createElement("div");ov.id="allCatOv";
   ov.style.cssText="display:none;position:fixed;inset:0;background:rgba(0,0,0,.85);z-index:99998;overflow:auto";
   document.body.appendChild(ov);
  }
  ov.style.display="block";
  ov.innerHTML='<div style="max-width:1000px;margin:16px auto;background:#131921;border-radius:12px;padding:16px"><div style="display:flex;justify-content:space-between;align-items:center"><h3 style="color:#fff;margin:0">📂 All Categories</h3><button onclick="document.getElementById(\'allCatOv\').style.display=\'none\'" style="background:#c0392b;color:#fff;border:none;border-radius:6px;padding:8px 14px;font-weight:700">✕ বন্ধ</button></div><div id="acBody" style="margin-top:14px;color:#fff">⏳ Loading categories...</div></div>';
  
  // categories collect from products
  const snap=(await fd.get(fd.ref(db,"products"))).val()||{};
  const cats={};
  for(const [pid,p] of Object.entries(snap)){
   const c=p.category||p.categoryId||"Uncategorized";
   if(!cats[c])cats[c]={name:c,products:[]};
   cats[c].products.push({id:pid,...p});
  }
  
  const list=Object.values(cats).sort((a,b)=>a.name.localeCompare(b.name));
  let html='<div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(260px,1fr));gap:12px">';
  list.forEach(c=>{
   html+='<div style="background:#232f3e;border-radius:10px;padding:14px;cursor:pointer;border:1px solid #333" onclick="window.__openCat(\''+c.name.replace(/'/g,"\\'")+'\')"><h4 style="color:#FFD814;margin:0 0 8px">📂 '+c.name+'</h4><div style="font-size:13px;color:#aaa">'+c.products.length+' টি পণ্য</div></div>';
  });
  html+='</div>';
  if(!list.length)html='<div style="color:#aaa;text-align:center;padding:30px">কোনো category নেই</div>';
  document.getElementById("acBody").innerHTML=html;
 }
 window.__openCat=async function(catName){
  const snap=(await fd.get(fd.ref(db,"products"))).val()||{};
  const prods=[];
  for(const [pid,p] of Object.entries(snap)){
   if((p.category||p.categoryId||"Uncategorized")===catName)prods.push({id:pid,...p});
  }
  const ov=document.getElementById("allCatOv");
  let html='<div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:12px"><button onclick="window.__backToCats()" style="background:#555;color:#fff;border:none;border-radius:6px;padding:8px 14px;font-weight:700">← ফিরে যান</button><h4 style="color:#FFD814;margin:0">📂 '+catName+' ('+prods.length+' পণ্য)</h4></div>';
  html+='<div style="background:#1a242f;padding:10px;border-radius:8px;margin-bottom:12px;display:flex;gap:10px;flex-wrap:wrap;align-items:center"><label style="color:#fff"><input type="checkbox" id="acSelAll" onchange="window.__selAll(this.checked)"> সব সিলেক্ট</label><button onclick="window.__bulkDel()" style="background:#c0392b;color:#fff;border:none;border-radius:6px;padding:8px 14px;font-weight:700">🗑️ সিলেক্টেড Delete</button><button onclick="window.__bulkSave()" style="background:#27ae60;color:#fff;border:none;border-radius:6px;padding:8px 14px;font-weight:700">💾 সিলেক্টেড Save</button><span id="acStatus" style="color:#88ccff;font-size:12px"></span></div>';
  html+='<div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(320px,1fr));gap:12px">';
  prods.forEach(p=>{
   const img=p.image||(p.images&&p.images.main)||"";
   html+='<div style="background:#232f3e;border-radius:10px;padding:12px;border:1px solid #333">';
   html+='<label style="display:flex;align-items:center;gap:6px;color:#FFD814;font-size:12px;margin-bottom:6px"><input type="checkbox" class="acChk" data-id="'+p.id+'"> সিলেক্ট</label>';
   html+='<div style="display:flex;gap:10px;margin-bottom:8px">'+(img?'<img src="'+img+'" style="width:80px;height:80px;object-fit:cover;border-radius:6px">':'<div style="width:80px;height:80px;background:#333;border-radius:6px;display:flex;align-items:center;justify-content:center">📦</div>')+'<div style="flex:1"><b style="color:#fff;font-size:13px">'+p.title+'</b><br><small style="color:#888">Code: '+(p.id.slice(-6).toUpperCase())+'</small></div></div>';
   html+='<input type="text" value="'+(p.title||"").replace(/"/g,"&quot;")+'" data-id="'+p.id+'" data-field="title" placeholder="Title" style="width:100%;padding:6px;margin:4px 0;background:#1a242f;color:#fff;border:1px solid #444;border-radius:4px;font-size:12px">';
   html+='<input type="number" value="'+(p.price||0)+'" data-id="'+p.id+'" data-field="price" placeholder="Price" style="width:100%;padding:6px;margin:4px 0;background:#1a242f;color:#fff;border:1px solid #444;border-radius:4px;font-size:12px">';
   html+='<input type="number" value="'+(p.stock||0)+'" data-id="'+p.id+'" data-field="stock" placeholder="Stock" style="width:100%;padding:6px;margin:4px 0;background:#1a242f;color:#fff;border:1px solid #444;border-radius:4px;font-size:12px">';
   html+='<div style="display:flex;gap:6px;margin-top:8px"><button onclick="window.__saveOne(\''+p.id+'\')" style="flex:1;background:#27ae60;color:#fff;border:none;border-radius:6px;padding:8px;font-weight:700;font-size:12px">💾 Save</button><button onclick="window.__delOne(\''+p.id+'\')" style="flex:1;background:#c0392b;color:#fff;border:none;border-radius:6px;padding:8px;font-weight:700;font-size:12px">🗑️ Delete</button></div>';
   html+='</div>';
  });
  html+='</div>';
  ov.innerHTML='<div style="max-width:1200px;margin:16px auto;background:#131921;border-radius:12px;padding:16px">'+html+'</div>';
 };
 window.__backToCats=openPanel;
 window.__selAll=function(v){document.querySelectorAll(".acChk").forEach(c=>c.checked=v);};
 window.__saveOne=async function(id){
  const card=document.querySelector('[data-id="'+id+'"][data-field="title"]').closest("div");
  const inps=card.querySelectorAll("input[data-field]");
  const upd={};
  inps.forEach(i=>{const f=i.dataset.field,v=i.value;upd[f]=f==="price"||f==="stock"?+v||0:v;});
  try{await fd.update(fd.ref(db,"products/"+id),upd);toast("✅ Saved");}catch(e){toast("❌ "+e.message,"#c0392b");}
 };
 window.__delOne=async function(id){
  if(!confirm("এই পণ্য মুছবেন?"))return;
  try{
   const pv=(await fd.get(fd.ref(db,"products/"+id))).val()||{};
   await fd.remove(fd.ref(db,"products/"+id));
   // purge from section copies
   const nodes=["flashSaleCategoryProducts","dealsOfDayCategoryProducts","specialCategoryProducts","globalCategoryProducts"];
   for(const n of nodes){
    const val=(await fd.get(fd.ref(db,"settings/"+n))).val()||{};
    for(const cat of Object.keys(val)){
     const items=val[cat]||{};
     for(const k of Object.keys(items)){
      const pid2=(items[k]&&items[k].id)?items[k].id:k;
      if(pid2===id||k===id)await fd.remove(fd.ref(db,"settings/"+n+"/"+cat+"/"+k));
     }
    }
   }
   if(window.MJHCloud){[pv.image,pv.images&&pv.images.main].filter(Boolean).forEach(u=>window.MJHCloud.remove(u).catch(()=>{}));}
   toast("🗑️ Deleted");
   setTimeout(openPanel,300);
  }catch(e){toast("❌ "+e.message,"#c0392b");}
 };
 window.__bulkDel=async function(){
  const ids=[...document.querySelectorAll(".acChk:checked")].map(c=>c.dataset.id);
  if(!ids.length)return toast("কোনো পণ্য সিলেক্ট করা হয়নি","#c0392b");
  if(!confirm(ids.length+"টা পণ্য মুছবেন?"))return;
  let n=0;
  for(const id of ids){
   try{
    const pv=(await fd.get(fd.ref(db,"products/"+id))).val()||{};
    await fd.remove(fd.ref(db,"products/"+id));
    const nodes=["flashSaleCategoryProducts","dealsOfDayCategoryProducts","specialCategoryProducts","globalCategoryProducts"];
    for(const nd of nodes){
     const val=(await fd.get(fd.ref(db,"settings/"+nd))).val()||{};
     for(const cat of Object.keys(val)){
      const items=val[cat]||{};
      for(const k of Object.keys(items)){
       const pid2=(items[k]&&items[k].id)?items[k].id:k;
       if(pid2===id||k===id)await fd.remove(fd.ref(db,"settings/"+nd+"/"+cat+"/"+k));
      }
     }
    }
    if(window.MJHCloud){[pv.image,pv.images&&pv.images.main].filter(Boolean).forEach(u=>window.MJHCloud.remove(u).catch(()=>{}));}
    n++;
    const st=document.getElementById("acStatus");if(st)st.textContent="⏳ "+n+"/"+ids.length;
   }catch(e){}
  }
  toast("✅ "+n+"টা deleted");
  setTimeout(openPanel,500);
 };
 window.__bulkSave=async function(){
  const ids=[...document.querySelectorAll(".acChk:checked")].map(c=>c.dataset.id);
  if(!ids.length)return toast("কোনো পণ্য সিলেক্ট করা হয়নি","#c0392b");
  let n=0;
  for(const id of ids){
   const card=document.querySelector('[data-id="'+id+'"][data-field="title"]').closest("div");
   const inps=card.querySelectorAll("input[data-field]");
   const upd={};
   inps.forEach(i=>{const f=i.dataset.field,v=i.value;upd[f]=f==="price"||f==="stock"?+v||0:v;});
   try{await fd.update(fd.ref(db,"products/"+id),upd);n++;}catch(e){}
  }
  toast("✅ "+n+"টা saved");
 };
})();
