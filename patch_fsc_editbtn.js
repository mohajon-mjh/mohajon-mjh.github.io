const fs = require('fs');
let content = fs.readFileSync('assets/js/admin.js', 'utf8');

const oldCard = `    div.innerHTML = \`
      <h3 class="fsc-cat-name" style="margin:0">\${(item.name||"").replace(/</g,"&lt;")}</h3>
      <button class="danger-btn fsc-delete-btn">🗑️ Delete</button>
    \`;
    div.querySelector(".fsc-cat-name").onclick = () => selectFscCategory(id);
    div.querySelector(".fsc-delete-btn").onclick = async (e) => {`;

const newCard = `    div.innerHTML = \`
      <h3 class="fsc-cat-name" style="margin:0;flex:1">\${(item.name||"").replace(/</g,"&lt;")}</h3>
      <div style="display:flex;gap:8px">
        <button class="save-btn fsc-edit-btn">✏️ Edit</button>
        <button class="danger-btn fsc-delete-btn">🗑️ Delete</button>
      </div>
    \`;
    div.querySelector(".fsc-cat-name").onclick = () => selectFscCategory(id);
    div.querySelector(".fsc-edit-btn").onclick = (e) => {
      e.stopPropagation();
      const h3 = div.querySelector(".fsc-cat-name");
      const currentName = item.name || "";
      h3.outerHTML = \`<div class="fsc-cat-editbox" style="flex:1;display:flex;gap:8px;align-items:center">
        <input type="text" class="fsc-cat-name-input" value="\${currentName.replace(/"/g,"&quot;")}" style="flex:1">
        <button class="save-btn fsc-cat-save-btn">💾</button>
      </div>\`;
      const editBox = div.querySelector(".fsc-cat-editbox");
      const input = editBox.querySelector(".fsc-cat-name-input");
      const saveBtn = editBox.querySelector(".fsc-cat-save-btn");
      const editBtn = div.querySelector(".fsc-edit-btn");
      editBtn.style.display = "none";
      input.focus();
      saveBtn.onclick = async (ev) => {
        ev.stopPropagation();
        const newName = input.value.trim();
        if(!newName){ alert("নাম খালি রাখা যাবে না"); return; }
        try{
          await update(ref(db, "settings/flashSaleCategories/"+id), { name: newName });
        }catch(err){ alert("❌ Error: " + err.message); }
      };
    };
    div.querySelector(".fsc-delete-btn").onclick = async (e) => {`;

if (!content.includes(oldCard)) {
  console.log("❌ oldCard মিলছে না");
  process.exit(1);
}
content = content.replace(oldCard, newCard);
fs.writeFileSync('assets/js/admin.js', content, 'utf8');
console.log("✅ Edit বাটন যোগ করা হয়েছে");
