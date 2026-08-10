const fs = require('fs');
let content = fs.readFileSync('assets/js/admin.js', 'utf8');

const oldStr = `  const bulkApplyBtn = document.getElementById("fsc-bulk-apply-btn");
  const bulkSaveBtn = document.getElementById("fsc-bulk-save-btn");
  const bulkActionBtn = document.getElementById("fsc-bulk-action-btn");
  const statusEl = document.getElementById("fsc-bulk-status");`;

const newStr = `  const bulkApplyBtn = document.getElementById("fsc-bulk-apply-btn");
  const bulkSaveBtn = document.getElementById("fsc-bulk-save-btn");
  const bulkActionBtn = document.getElementById("fsc-bulk-action-btn");
  const bulkDateApplyBtn = document.getElementById("fsc-bulk-date-apply-btn");
  const statusEl = document.getElementById("fsc-bulk-status");

  if(bulkDateApplyBtn){
    bulkDateApplyBtn.onclick = () => {
      const checked = document.querySelectorAll(".fsc-item-check:checked");
      if(checked.length === 0){ alert("কিছু সিলেক্ট করুন"); return; }
      const startVal = document.getElementById("fsc-bulk-startdate").value.trim();
      const endVal = document.getElementById("fsc-bulk-enddate").value.trim();
      if(!startVal && !endVal){ alert("অন্তত একটা তারিখ দিন"); return; }
      checked.forEach(cb => {
        const card = cb.closest(".card");
        const startInput = card.querySelector(".fsc-item-startdate");
        const endInput = card.querySelector(".fsc-item-enddate");
        if(startVal && startInput) startInput.value = startVal;
        if(endVal && endInput) endInput.value = endVal;
      });
      statusEl.textContent = "✅ সিলেক্টেড " + checked.length + "টি প্রোডাক্টে তারিখ বসানো হয়েছে, এখন Save চাপুন";
      setTimeout(()=>{ statusEl.textContent=""; }, 4000);
    };
  }`;

if(!content.includes(oldStr)){
  console.log("❌ মিলছে না");
  process.exit(1);
}
content = content.replace(oldStr, newStr);
fs.writeFileSync('assets/js/admin.js', content, 'utf8');
console.log("✅ বাল্ক ডেট অ্যাপ্লাই হ্যান্ডলার যোগ হয়েছে");
