const fs = require('fs');
let content = fs.readFileSync('assets/js/admin.js', 'utf8');

function replaceOnce(oldStr, newStr, label){
  if(!content.includes(oldStr)){
    console.log("❌ মিলছে না: " + label);
    process.exit(1);
  }
  content = content.replace(oldStr, newStr);
  console.log("✅ " + label);
}

function buildPatchForPrefix(prefix){
  const oldSetup = `function setup${prefix === 'fsc' ? 'Fsc' : 'Dotd'}AddSection(){
  const fileInput = document.getElementById("${prefix}-add-file-input");
  const addListDiv = document.getElementById("${prefix}-add-list");
  if(!fileInput || !addListDiv) return;

  fileInput.onchange = (e) => {
    const files = Array.from(e.target.files);
    render${prefix === 'fsc' ? 'Fsc' : 'Dotd'}AddList(files, addListDiv);
  };
}`;

  const newSetup = `function setup${prefix === 'fsc' ? 'Fsc' : 'Dotd'}AddSection(){
  const fileInput = document.getElementById("${prefix}-add-file-input");
  const addListDiv = document.getElementById("${prefix}-add-list");
  if(!fileInput || !addListDiv) return;

  fileInput.onchange = (e) => {
    const files = Array.from(e.target.files);
    render${prefix === 'fsc' ? 'Fsc' : 'Dotd'}AddList(files, addListDiv);
  };

  const selectAllBox = document.getElementById("${prefix}-add-select-all");
  if(selectAllBox){
    selectAllBox.onchange = () => {
      document.querySelectorAll(".${prefix}-add-check").forEach(cb => { cb.checked = selectAllBox.checked; });
    };
  }

  const saveAllBtn = document.getElementById("${prefix}-add-save-all-btn");
  const saveStatusEl = document.getElementById("${prefix}-add-save-status");
  if(saveAllBtn){
    saveAllBtn.onclick = async () => {
      const checked = document.querySelectorAll(".${prefix}-add-check:checked");
      if(checked.length === 0){ alert("কিছু সিলেক্ট করুন"); return; }
      let successCount = 0, failCount = 0;
      for(const cb of checked){
        const card = cb.closest(".card");
        if(!card || !card._doSave) continue;
        saveStatusEl.textContent = \`সেভ হচ্ছে... (\${successCount + failCount + 1}/\${checked.length})\`;
        try{
          await card._doSave();
          successCount++;
        }catch(err){
          failCount++;
        }
      }
      saveStatusEl.textContent = \`✅ সম্পন্ন: \${successCount}টি সেভ হয়েছে\` + (failCount > 0 ? \`, ❌ \${failCount}টি ব্যর্থ\` : "");
    };
  }

  const priceApplyBtn = document.getElementById("${prefix}-price-apply-btn");
  const priceStatusEl = document.getElementById("${prefix}-price-status");
  if(priceApplyBtn){
    priceApplyBtn.onclick = () => {
      const raw = document.getElementById("${prefix}-price-paste").value;
      if(!raw.trim()){ alert("প্রাইস লিস্ট পেস্ট করুন"); return; }

      function normalizeText(s){
        return (s || "").toLowerCase().replace(/[^a-z0-9\\u0980-\\u09ff]/g, "");
      }

      const lines = raw.split("\\n").map(l => l.trim()).filter(Boolean);
      const parsed = [];
      lines.forEach(line => {
        const priceMatch = line.match(/৳\\s*([\\d,]+)/) || line.match(/([\\d,]+)\\s*$/);
        if(!priceMatch) return;
        const price = parseInt(priceMatch[1].replace(/,/g, ""));
        const namePart = line.slice(0, priceMatch.index).replace(/[—–-]+\\s*$/, "").trim();
        if(!namePart || isNaN(price)) return;
        parsed.push({ normalized: normalizeText(namePart), price, original: namePart });
      });

      let matchedCount = 0;
      document.querySelectorAll(".${prefix}-add-title").forEach(titleInput => {
        const card = titleInput.closest(".card");
        const cardNorm = normalizeText(titleInput.value);
        const match = parsed.find(p => p.normalized === cardNorm) ||
                      parsed.find(p => cardNorm.includes(p.normalized) || p.normalized.includes(cardNorm));
        if(match && card){
          const oldPriceInput = card.querySelector(".${prefix}-add-oldprice");
          if(oldPriceInput){
            oldPriceInput.value = match.price;
            oldPriceInput.dispatchEvent(new Event("input"));
            matchedCount++;
          }
        }
      });

      priceStatusEl.textContent = \`✅ \${matchedCount}টি প্রোডাক্টে দাম বসানো হয়েছে (মোট লিস্ট: \${parsed.length}টি লাইন)\`;
    };
  }
}`;

  replaceOnce(oldSetup, newSetup, `(setup${prefix}) সিলেক্ট-অল + সেভ-অল + প্রাইস-ম্যাচ হ্যান্ডলার যোগ হয়েছে`);
}

buildPatchForPrefix('fsc');
buildPatchForPrefix('dotd');

fs.writeFileSync('assets/js/admin.js', content, 'utf8');
console.log("✅ ধাপ ১ সম্পন্ন");
