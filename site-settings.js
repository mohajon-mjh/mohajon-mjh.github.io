/* Site Settings v1 - About + Sidebar Color + Reorder */
(function(){
  const BASE="https://mohajon-mjh-default-rtdb.firebaseio.com";
  const ABOUT_PATH=BASE+"/settings/about.json";
  const SIDEBAR_PATH=BASE+"/settings/sidebarConfig.json";
  
  const DEFAULT_FEATURES=[
    {icon:"💰",title:"Cash on Delivery",desc:"Pay when you receive your products",link:"about.html#payments"},
    {icon:"🔄",title:"7-Day Return",desc:"Easy 7-day return policy",link:"about.html#returns"},
    {icon:"🔒",title:"Secure Payment",desc:"bKash, Nagad, Rocket",link:"about.html#payments"},
    {icon:"🚚",title:"Fast Delivery",desc:"Delivery in 10-15 days",link:"about.html#delivery"}
  ];
  
  let currentFeatures=[...DEFAULT_FEATURES];
  let currentSidebar=[];
  
  function status(msg,type){
    const el=document.getElementById("settingsStatus");
    if(!el)return;
    el.style.display="block";
    el.style.background=type==="success"?"#10b981":type==="error"?"#ef4444":"#3b82f6";
    el.style.color="#fff";
    el.innerHTML=msg;
    setTimeout(()=>{el.style.display="none";},4000);
  }
  
  // Load About settings from Firebase
  async function loadAbout(){
    try{
      const r=await fetch(ABOUT_PATH);
      const d=await r.json();
      if(d){
        document.getElementById("aboutTitle").value=d.title||"";
        document.getElementById("aboutDesc").value=d.description||"";
        document.getElementById("aboutImage").value=d.image||"";
        if(d.image){
          document.getElementById("aboutImagePreview").innerHTML='<img src="'+d.image+'" style="max-width:300px;border-radius:8px">';
        }
        if(d.features&&Array.isArray(d.features))currentFeatures=d.features;
      }
      renderFeatureCards();
      status("✅ About settings loaded","success");
    }catch(e){
      renderFeatureCards();
    }
  }
  
  function renderFeatureCards(){
    const container=document.getElementById("featureCards");
    if(!container)return;
    container.innerHTML="";
    currentFeatures.forEach((f,i)=>{
      const div=document.createElement("div");
      div.style.cssText="background:#1a242f;padding:15px;border-radius:8px;margin-bottom:10px;border:1px solid #333";
      div.innerHTML=`
        <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:10px">
          <b style="color:#fff">Card ${i+1}</b>
          <button onclick="removeFeatureCard(${i})" style="background:#ef4444;color:#fff;border:none;padding:4px 10px;border-radius:4px;cursor:pointer">🗑️</button>
        </div>
        <input type="text" value="${f.icon||""}" onchange="updateFeature(${i},'icon',this.value)" style="width:60px;padding:6px;border-radius:4px;border:1px solid #444;background:#0f1419;color:#fff;margin-right:8px" placeholder="Icon">
        <input type="text" value="${f.title||""}" onchange="updateFeature(${i},'title',this.value)" style="width:180px;padding:6px;border-radius:4px;border:1px solid #444;background:#0f1419;color:#fff;margin-right:8px" placeholder="Title">
        <input type="text" value="${f.link||""}" onchange="updateFeature(${i},'link',this.value)" style="width:200px;padding:6px;border-radius:4px;border:1px solid #444;background:#0f1419;color:#fff" placeholder="Link"><br>
        <textarea onchange="updateFeature(${i},'desc',this.value)" rows="2" style="width:100%;padding:6px;border-radius:4px;border:1px solid #444;background:#0f1419;color:#fff;margin-top:8px" placeholder="Description">${f.desc||""}</textarea>
      `;
      container.appendChild(div);
    });
    if(currentFeatures.length<6){
      const addBtn=document.createElement("button");
      addBtn.textContent="➕ Add Feature Card";
      addBtn.style.cssText="background:#3b82f6;color:#fff;border:none;padding:8px 16px;border-radius:6px;cursor:pointer;margin-top:10px";
      addBtn.onclick=()=>{currentFeatures.push({icon:"",title:"",desc:"",link:""});renderFeatureCards();};
      container.appendChild(addBtn);
    }
  }
  
  window.updateFeature=(i,k,v)=>{currentFeatures[i][k]=v;};
  window.removeFeatureCard=(i)=>{if(confirm("এই card মুছবেন?")){currentFeatures.splice(i,1);renderFeatureCards();}};
  
  // Image upload via Cloudinary
  document.addEventListener("change",async function(e){
    if(e.target.id==="aboutImageFile"&&e.target.files[0]){
      const file=e.target.files[0];
      status("⏳ Image uploading...","info");
      try{
        if(window.MJHCloud&&window.MJHCloud.upload){
          const url=await window.MJHCloud.upload(file);
          document.getElementById("aboutImage").value=url;
          document.getElementById("aboutImagePreview").innerHTML='<img src="'+url+'" style="max-width:300px;border-radius:8px">';
          status("✅ Image uploaded","success");
        }else{
          // Fallback: convert to base64 (for preview)
          const rd=new FileReader();
          rd.onload=()=>{
            document.getElementById("aboutImage").value=rd.result;
            document.getElementById("aboutImagePreview").innerHTML='<img src="'+rd.result+'" style="max-width:300px;border-radius:8px">';
            status("✅ Preview ready (save হবে Firebase-এ)","success");
          };
          rd.readAsDataURL(file);
        }
      }catch(err){
        status("❌ Upload failed: "+err.message,"error");
      }
    }
  });
  
  // Save About settings
  window.saveAboutSettings=async function(){
    try{
      status("⏳ Saving...","info");
      const data={
        title:document.getElementById("aboutTitle").value,
        description:document.getElementById("aboutDesc").value,
        image:document.getElementById("aboutImage").value,
        features:currentFeatures,
        updatedAt:Date.now()
      };
      const r=await fetch(ABOUT_PATH,{method:"PUT",headers:{"Content-Type":"application/json"},body:JSON.stringify(data)});
      if(r.ok)status("✅ About settings saved to Firebase!","success");
      else throw new Error("Save failed");
    }catch(e){
      status("❌ "+e.message,"error");
    }
  };
  
  window.resetAboutSettings=function(){
    if(!confirm("Default values এ ফিরে যাবেন?"))return;
    document.getElementById("aboutTitle").value="🌟 About Mohajon MJH Marketplace";
    document.getElementById("aboutDesc").value="International online marketplace — 1,650+ verified products, connecting buyers and sellers directly.";
    document.getElementById("aboutImage").value="";
    document.getElementById("aboutImagePreview").innerHTML="";
    currentFeatures=[...DEFAULT_FEATURES];
    renderFeatureCards();
    status("✅ Reset to default (save করুন Firebase-এ)","success");
  };
  
  window.deleteAboutSettings=async function(){
    if(!confirm("পুরো About settings Firebase থেকে মুছে ফেলবেন?"))return;
    try{
      await fetch(ABOUT_PATH,{method:"DELETE"});
      document.getElementById("aboutTitle").value="";
      document.getElementById("aboutDesc").value="";
      document.getElementById("aboutImage").value="";
      document.getElementById("aboutImagePreview").innerHTML="";
      currentFeatures=[...DEFAULT_FEATURES];
      renderFeatureCards();
      status("✅ Deleted from Firebase","success");
    }catch(e){status("❌ "+e.message,"error");}
  };
  
  // Sidebar Color + Reorder manager
  async function loadSidebar(){
    try{
      const r=await fetch(SIDEBAR_PATH);
      const d=await r.json();
      currentSidebar=Array.isArray(d)?d:[];
    }catch(e){currentSidebar=[];}
    renderSidebarManager();
  }
  
  function renderSidebarManager(){
    const container=document.getElementById("sidebarColorManager");
    if(!container)return;
    container.innerHTML="";
    
    // Get all sidebar buttons
    const btns=document.querySelectorAll(".tab-btn:not([data-tab='site-settings']), .tab-btn[data-tab='backup']");
    const list=[];
    btns.forEach(b=>{
      const text=b.textContent.trim();
      const tab=b.getAttribute("data-tab")||b.id||text;
      const cfg=currentSidebar.find(x=>x.tab===tab)||{tab,color:b.style.background||"#667eea",text:text};
      list.push(cfg);
    });
    currentSidebar=list;
    
    list.forEach((item,i)=>{
      const row=document.createElement("div");
      row.draggable=true;
      row.style.cssText="display:flex;align-items:center;gap:8px;padding:10px;background:#1a242f;border-radius:6px;margin-bottom:6px;cursor:grab;border:1px solid #333";
      row.innerHTML=`
        <span style="color:#888;cursor:grab">⋮⋮</span>
        <span style="flex:1;color:#fff">${item.text}</span>
        <input type="color" value="${item.color.startsWith("#")?item.color:"#667eea"}" style="width:40px;height:32px;border:none;cursor:pointer">
        <input type="text" value="${item.color}" style="width:100px;padding:4px;border-radius:4px;border:1px solid #444;background:#0f1419;color:#fff;font-size:11px">
      `;
      const colorInput=row.querySelector('input[type="color"]');
      const textInput=row.querySelector('input[type="text"]');
      colorInput.oninput=()=>{textInput.value=colorInput.value;currentSidebar[i].color=colorInput.value;};
      textInput.onchange=()=>{colorInput.value=textInput.value;currentSidebar[i].color=textInput.value;};
      
      // Drag handlers
      row.addEventListener("dragstart",e=>{e.dataTransfer.setData("text/plain",i);row.style.opacity="0.5";});
      row.addEventListener("dragend",()=>row.style.opacity="1");
      row.addEventListener("dragover",e=>{e.preventDefault();row.style.borderTop="3px solid #8b5cf6";});
      row.addEventListener("dragleave",()=>row.style.borderTop="");
      row.addEventListener("drop",e=>{
        e.preventDefault();
        row.style.borderTop="";
        const from=+e.dataTransfer.getData("text/plain");
        const to=i;
        const moved=currentSidebar.splice(from,1)[0];
        currentSidebar.splice(to,0,moved);
        renderSidebarManager();
      });
      
      container.appendChild(row);
    });
  }
  
  window.saveSidebarSettings=async function(){
    try{
      status("⏳ Saving sidebar...","info");
      const r=await fetch(SIDEBAR_PATH,{method:"PUT",headers:{"Content-Type":"application/json"},body:JSON.stringify(currentSidebar)});
      if(r.ok){
        // Apply to sidebar buttons immediately
        applySidebarConfig();
        status("✅ Sidebar saved + applied","success");
      }else throw new Error("Save failed");
    }catch(e){status("❌ "+e.message,"error");}
  };
  
  // Apply sidebar config (colors + order)
  async function applySidebarConfig(){
    try{
      const r=await fetch(SIDEBAR_PATH);
      const cfg=await r.json();
      if(!Array.isArray(cfg))return;
      const sidebar=document.querySelector("nav")||document.querySelector(".sidebar");
      if(!sidebar)return;
      cfg.forEach(item=>{
        const btn=sidebar.querySelector('[data-tab="'+item.tab+'"]')||
                  sidebar.querySelector('#'+item.tab)||
                  [...sidebar.querySelectorAll(".tab-btn,button,a")].find(b=>b.textContent.trim()===item.text);
        if(btn){
          btn.style.background=item.color;
          btn.style.color="#fff";
          btn.style.fontWeight="700";
        }
      });
    }catch(e){}
  }
  
  // Auto-load when tab is shown
  const obs=new MutationObserver(()=>{
    const tab=document.getElementById("tab-site-settings");
    if(tab&&tab.classList.contains("active")){
      loadAbout();
      loadSidebar();
    }
  });
  obs.observe(document.body,{attributes:true,subtree:true,attributeFilter:["class"]});
  
  // Also apply on page load
  setTimeout(applySidebarConfig,1500);
  setTimeout(applySidebarConfig,3000);
})();
