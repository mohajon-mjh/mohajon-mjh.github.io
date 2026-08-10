const fs = require('fs');
let content = fs.readFileSync('assets/js/admin.js', 'utf8');

const oldFunc = `function renderFscList(){
  const listDiv = document.getElementById("fsc-list");
  if(!listDiv) return;
  const entries = Object.entries(fscCategoriesCache).sort((a,b)=>(a[1].order||0)-(b[1].order||0));
  if(entries.length === 0){
    listDiv.innerHTML = "<p style=\\"color:#888\\">কোনো Flash Sale ক্যাটাগরি নেই</p>";
    return;
  }
  listDiv.innerHTML = "";
  entries.forEach(([id, item]) => {
    const div = document.createElement("div");
    div.className = "card";
    div.innerHTML = \`
      <label>নাম <input type="text" class="fsc-edit-name" value="\${(item.name||"").replace(/"/g,"&quot;")}"></label>
      <label>Order <input type="number" class="fsc-edit-order" value="\${item.order||0}" style="width:80px"></label>
      <label>শুরুর তারিখ <input type="text" class="fsc-edit-startdate" value="\${(item.startDate||"").replace(/"/g,"&quot;")}" placeholder="dd-mm-yyyy"></label>
      <label>শেষের তারিখ <input type="text" class="fsc-edit-enddate" value="\${(item.endDate||"").replace(/"/g,"&quot;")}" placeholder="dd-mm-yyyy"></label>
      <div style="margin-top:10px;display:flex;gap:8px;flex-wrap:wrap">
        <button class="save-btn fsc-view-btn">🛍️ প্রোডাক্ট দেখুন / যোগ করুন</button>
        <button class="save-btn fsc-save-btn">💾 Save</button>
        <button class="danger-btn fsc-delete-btn">🗑️ Delete</button>
      </div>
    \`;
    div.querySelector(".fsc-view-btn").onclick = () => selectFscCategory(id);
    div.querySelector(".fsc-save-btn").onclick = async () => {
      const newName = div.querySelector(".fsc-edit-name").value.trim();
      const newOrder = parseInt(div.querySelector(".fsc-edit-order").value) || 0;
      const newStart = div.querySelector(".fsc-edit-startdate").value.trim();
      const newEnd = div.querySelector(".fsc-edit-enddate").value.trim();
      try{
        await update(ref(db, "settings/flashSaleCategories/"+id), { name: newName, order: newOrder, startDate: newStart, endDate: newEnd });
        alert("✅ Update হয়েছে");
      }catch(err){ alert("❌ Error: " + err.message); }
    };
    div.querySelector(".fsc-delete-btn").onclick = async () => {
      if(!confirm(\`"\${item.name}" ক্যাটাগরি এবং এর সব প্রোডাক্ট লিংক ডিলিট করবেন? (মূল প্রোডাক্ট ডিলিট হবে না)\`)) return;
      try{
        await remove(ref(db, "settings/flashSaleCategories/"+id));
        await remove(ref(db, "settings/flashSaleCategoryProducts/"+id));
        if(fscSelectedCatId === id){
          fscSelectedCatId = null;
          document.getElementById("fsc-products-panel").style.display = "none";
        }
      }catch(err){ alert("❌ Error: " + err.message); }
    };
    listDiv.appendChild(div);
  });
}`;

const newFunc = `function renderFscList(){
  const listDiv = document.getElementById("fsc-list");
  if(!listDiv) return;
  const entries = Object.entries(fscCategoriesCache).sort((a,b)=>(a[1].order||0)-(b[1].order||0));
  if(entries.length === 0){
    listDiv.innerHTML = "<p style=\\"color:#888\\">কোনো Flash Sale ক্যাটাগরি নেই</p>";
    return;
  }
  listDiv.innerHTML = "";
  entries.forEach(([id, item]) => {
    const div = document.createElement("div");
    div.className = "card";
    div.style.cssText = "display:flex;align-items:center;justify-content:space-between;gap:10px;cursor:pointer";
    div.innerHTML = \`
      <h3 class="fsc-cat-name" style="margin:0">\${(item.name||"").replace(/</g,"&lt;")}</h3>
      <button class="danger-btn fsc-delete-btn">🗑️ Delete</button>
    \`;
    div.querySelector(".fsc-cat-name").onclick = () => selectFscCategory(id);
    div.querySelector(".fsc-delete-btn").onclick = async (e) => {
      e.stopPropagation();
      if(!confirm(\`"\${item.name}" ক্যাটাগরি এবং এর সব প্রোডাক্ট লিংক ডিলিট করবেন? (মূল প্রোডাক্ট ডিলিট হবে না)\`)) return;
      try{
        await remove(ref(db, "settings/flashSaleCategories/"+id));
        await remove(ref(db, "settings/flashSaleCategoryProducts/"+id));
        if(fscSelectedCatId === id){
          fscSelectedCatId = null;
          document.getElementById("fsc-products-panel").style.display = "none";
        }
      }catch(err){ alert("❌ Error: " + err.message); }
    };
    listDiv.appendChild(div);
  });
}`;

if (!content.includes(oldFunc)) {
  console.log("❌ oldFunc মিলছে না — ম্যানুয়াল চেক দরকার");
  process.exit(1);
}

content = content.replace(oldFunc, newFunc);
fs.writeFileSync('assets/js/admin.js', content, 'utf8');
console.log("✅ renderFscList() নতুন ডিজাইনে বদলানো হয়েছে");
