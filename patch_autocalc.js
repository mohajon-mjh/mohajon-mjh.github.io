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

// ১. সিঙ্গেল প্রোডাক্ট কার্ড — Old Price/Discount বদলালে Price অটো ক্যালকুলেট
replaceOnce(
  `    <div style="margin-top:8px;display:flex;gap:8px;flex-wrap:wrap">
      <button class="save-btn fsc-item-save">💾 Save</button>
      \${actionBtnHTML}
    </div>
  \`;

  div.querySelector(".fsc-item-save").onclick = async () => {`,
  `    <div style="margin-top:8px;display:flex;gap:8px;flex-wrap:wrap">
      <button class="save-btn fsc-item-save">💾 Save</button>
      \${actionBtnHTML}
    </div>
  \`;

  (function(){
    const priceInput = div.querySelector(".fsc-item-price");
    const oldPriceInput = div.querySelector(".fsc-item-oldprice");
    const discountInput = div.querySelector(".fsc-item-discount");
    function fscRecalc(){
      const op = parseFloat(oldPriceInput.value);
      const d = parseInt(discountInput.value) || 0;
      if(!isNaN(op) && op > 0){
        priceInput.value = Math.round(op * (1 - d/100));
      }
    }
    oldPriceInput.addEventListener("input", fscRecalc);
    discountInput.addEventListener("input", fscRecalc);
  })();

  div.querySelector(".fsc-item-save").onclick = async () => {`,
  '(১) সিঙ্গেল কার্ডে auto-calc যোগ হয়েছে'
);

// ২. বাল্ক % অ্যাপ্লাই — সিলেক্টেড সবগুলোর Price ও রিক্যালকুলেট হবে
replaceOnce(
  `  bulkApplyBtn.onclick = () => {
    const val = parseInt(document.getElementById("fsc-bulk-discount").value);
    if(isNaN(val) || val < 0 || val > 100){ alert("সঠিক % দিন (0-100)"); return; }
    document.querySelectorAll(".fsc-item-check:checked").forEach(cb => {
      const card = cb.closest(".card");
      const discInput = card.querySelector(".fsc-item-discount");
      if(discInput) discInput.value = val;
    });
    statusEl.textContent = "✅ সিলেক্টেড প্রোডাক্টে % বসানো হয়েছে, এখন Save চাপুন";`,
  `  bulkApplyBtn.onclick = () => {
    const val = parseInt(document.getElementById("fsc-bulk-discount").value);
    if(isNaN(val) || val < 0 || val > 100){ alert("সঠিক % দিন (0-100)"); return; }
    document.querySelectorAll(".fsc-item-check:checked").forEach(cb => {
      const card = cb.closest(".card");
      const discInput = card.querySelector(".fsc-item-discount");
      if(discInput) discInput.value = val;
      const oldPriceInput = card.querySelector(".fsc-item-oldprice");
      const priceInput = card.querySelector(".fsc-item-price");
      if(oldPriceInput && priceInput){
        const op = parseFloat(oldPriceInput.value);
        if(!isNaN(op) && op > 0){
          priceInput.value = Math.round(op * (1 - val/100));
        }
      }
    });
    statusEl.textContent = "✅ সিলেক্টেড প্রোডাক্টে % বসানো হয়েছে, এখন Save চাপুন";`,
  '(২) বাল্ক অ্যাপ্লাই এ auto-calc যোগ হয়েছে'
);

// ৩. নতুন প্রোডাক্ট এড ফর্ম — Old Price/Discount বদলালে Price অটো ক্যালকুলেট
replaceOnce(
  `      <button type="button" class="save-btn fsc-add-save">💾 Save</button>
      <button type="button" class="danger-btn fsc-add-remove">🗑️ বাদ দিন</button>
    \`;

    div.querySelector(".fsc-add-remove").onclick = () => div.remove();`,
  `      <button type="button" class="save-btn fsc-add-save">💾 Save</button>
      <button type="button" class="danger-btn fsc-add-remove">🗑️ বাদ দিন</button>
    \`;

    (function(){
      const priceInput = div.querySelector(".fsc-add-price");
      const oldPriceInput = div.querySelector(".fsc-add-oldprice");
      const discountInput = div.querySelector(".fsc-add-discount");
      function fscRecalcAdd(){
        const op = parseFloat(oldPriceInput.value);
        const d = parseInt(discountInput.value) || 0;
        if(!isNaN(op) && op > 0){
          priceInput.value = Math.round(op * (1 - d/100));
        }
      }
      oldPriceInput.addEventListener("input", fscRecalcAdd);
      discountInput.addEventListener("input", fscRecalcAdd);
    })();

    div.querySelector(".fsc-add-remove").onclick = () => div.remove();`,
  '(৩) নতুন প্রোডাক্ট এড ফর্মে auto-calc যোগ হয়েছে'
);

fs.writeFileSync('assets/js/admin.js', content, 'utf8');
console.log("✅ সব প্যাচ সম্পন্ন");
