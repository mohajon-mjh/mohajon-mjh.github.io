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

replaceOnce(
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
    statusEl.textContent = "✅ সিলেক্টেড প্রোডাক্টে % বসানো হয়েছে, এখন Save চাপুন";
    setTimeout(()=>{ statusEl.textContent=""; }, 4000);
  };`,
`  bulkApplyBtn.onclick = () => {
    const val = parseInt(document.getElementById("fsc-bulk-discount").value);
    if(isNaN(val) || val < 0 || val > 100){ alert("সঠিক % দিন (0-100)"); return; }
    document.querySelectorAll(".fsc-item-check:checked").forEach(cb => {
      const card = cb.closest(".card");
      const discInput = card.querySelector(".fsc-item-discount");
      if(discInput) discInput.value = val;
      const oldPriceInput = card.querySelector(".fsc-item-oldprice");
      const priceInput = card.querySelector(".fsc-item-price");
      const previewEl = card.querySelector(".fsc-item-preview");
      if(oldPriceInput && priceInput){
        const op = parseFloat(oldPriceInput.value) || 0;
        const newPrice = Math.round(op * (1 - val/100));
        priceInput.value = newPrice;
        if(previewEl){
          const save = op - newPrice;
          if(val > 0 && save > 0){
            previewEl.innerHTML = '<span style="text-decoration:line-through;color:#888">৳' + op + '</span> → <strong style="color:#8f8">৳' + newPrice + '</strong> &nbsp; <span style="color:#fc6">(Save ৳' + save + ')</span>';
          } else {
            previewEl.innerHTML = '<strong>৳' + newPrice + '</strong> <span style="color:#888">(কোনো ডিসকাউন্ট নেই)</span>';
          }
        }
      }
    });
    statusEl.textContent = "✅ সিলেক্টেড প্রোডাক্টে % বসানো হয়েছে, এখন Save চাপুন";
    setTimeout(()=>{ statusEl.textContent=""; }, 4000);
  };`,
'(৩) বাল্ক Apply এ প্রিভিউ আপডেট যোগ হয়েছে'
);

replaceOnce(
`      const price = parseFloat(card.querySelector(".fsc-item-price").value) || 0;
      const oldPriceVal = card.querySelector(".fsc-item-oldprice").value.trim();
      const oldPrice = oldPriceVal === "" ? null : (parseFloat(oldPriceVal) || 0);
      const discount = parseInt(card.querySelector(".fsc-item-discount").value) || 0;`,
`      const oldPrice = parseFloat(card.querySelector(".fsc-item-oldprice").value) || 0;
      const discount = parseInt(card.querySelector(".fsc-item-discount").value) || 0;
      const price = Math.round(oldPrice * (1 - discount/100));
      const savedOldPrice = discount > 0 ? oldPrice : null;`,
'(৪) বাল্ক Save লজিক ঠিক করা হয়েছে'
);
replaceOnce(
`      updates[\`products/\${pid}/price\`] = price;
      updates[\`products/\${pid}/discountPrice\`] = oldPrice;`,
`      updates[\`products/\${pid}/price\`] = price;
      updates[\`products/\${pid}/discountPrice\`] = savedOldPrice;`,
'(৪খ) বাল্ক আপডেট অবজেক্টে savedOldPrice বসানো হয়েছে'
);

replaceOnce(
`      <img class="fsc-add-preview" style="width:80px;height:80px;object-fit:cover;border-radius:6px;float:left;margin-right:10px" src="">
      <label>নাম <input type="text" class="fsc-add-title" value="\${title}"></label>
      <label>বর্তমান দাম (৳) <input type="number" class="fsc-add-price" value="0"></label>
      <label>Market/Old Price (৳, ঐচ্ছিক) <input type="number" class="fsc-add-oldprice" value="" placeholder="খালি রাখুন যদি না দেখাতে চান"></label>
      <label>Discount % <input type="number" class="fsc-add-discount" value="0" min="0" max="100" style="width:80px"></label>
      <label>Offer শুরুর তারিখ (dd-mm-yyyy, ঐচ্ছিক) <input type="text" class="fsc-add-startdate" placeholder="খালি রাখুন যদি না দেখাতে চান"></label>
      <label>Offer শেষের তারিখ (dd-mm-yyyy, ঐচ্ছিক) <input type="text" class="fsc-add-enddate" placeholder="খালি রাখুন যদি না দেখাতে চান"></label>
      <label>স্টক <input type="number" class="fsc-add-stock" value="20"></label>
      <div style="clear:both"></div>
      <button type="button" class="save-btn fsc-add-save">💾 Save</button>
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
    })();`,
`      <img class="fsc-add-preview" style="width:80px;height:80px;object-fit:cover;border-radius:6px;float:left;margin-right:10px" src="">
      <label>নাম <input type="text" class="fsc-add-title" value="\${title}"></label>
      <label>মূল দাম / Market Price (৳) <input type="number" class="fsc-add-oldprice" value="0"></label>
      <label>Discount % <input type="number" class="fsc-add-discount" value="0" min="0" max="100" style="width:80px"></label>
      <label>বর্তমান দাম (৳) — অটো ক্যালকুলেট হয় <input type="number" class="fsc-add-price" value="0" readonly style="background:#222;color:#8f8"></label>
      <div class="fsc-add-item-preview" style="margin:8px 0;padding:8px;background:#1a1a1a;border-radius:6px;font-size:14px"></div>
      <label>Offer শুরুর তারিখ (dd-mm-yyyy, ঐচ্ছিক) <input type="text" class="fsc-add-startdate" placeholder="খালি রাখুন যদি না দেখাতে চান"></label>
      <label>Offer শেষের তারিখ (dd-mm-yyyy, ঐচ্ছিক) <input type="text" class="fsc-add-enddate" placeholder="খালি রাখুন যদি না দেখাতে চান"></label>
      <label>স্টক <input type="number" class="fsc-add-stock" value="20"></label>
      <div style="clear:both"></div>
      <button type="button" class="save-btn fsc-add-save">💾 Save</button>
      <button type="button" class="danger-btn fsc-add-remove">🗑️ বাদ দিন</button>
    \`;

    (function(){
      const priceInput = div.querySelector(".fsc-add-price");
      const oldPriceInput = div.querySelector(".fsc-add-oldprice");
      const discountInput = div.querySelector(".fsc-add-discount");
      const previewEl = div.querySelector(".fsc-add-item-preview");
      function fscRecalcAdd(){
        const op = parseFloat(oldPriceInput.value) || 0;
        const d = parseInt(discountInput.value) || 0;
        const newPrice = Math.round(op * (1 - d/100));
        priceInput.value = newPrice;
        const save = op - newPrice;
        if(d > 0 && save > 0){
          previewEl.innerHTML = '<span style="text-decoration:line-through;color:#888">৳' + op + '</span> → <strong style="color:#8f8">৳' + newPrice + '</strong> &nbsp; <span style="color:#fc6">(Save ৳' + save + ')</span>';
        } else {
          previewEl.innerHTML = '<strong>৳' + newPrice + '</strong> <span style="color:#888">(কোনো ডিসকাউন্ট নেই)</span>';
        }
      }
      oldPriceInput.addEventListener("input", fscRecalcAdd);
      discountInput.addEventListener("input", fscRecalcAdd);
      fscRecalcAdd();
    })();`,
'(৫) নতুন প্রোডাক্ট Add ফর্মে অর্ডার + প্রিভিউ যোগ হয়েছে'
);

replaceOnce(
`      const itemPrice = parseFloat(div.querySelector(".fsc-add-price").value) || 0;
      const oldPriceVal = div.querySelector(".fsc-add-oldprice").value.trim();
      const itemOldPrice = oldPriceVal === "" ? null : (parseFloat(oldPriceVal) || 0);
      const itemDiscount = parseInt(div.querySelector(".fsc-add-discount").value) || 0;`,
`      const itemOldPriceRaw = parseFloat(div.querySelector(".fsc-add-oldprice").value) || 0;
      const itemDiscount = parseInt(div.querySelector(".fsc-add-discount").value) || 0;
      const itemPrice = Math.round(itemOldPriceRaw * (1 - itemDiscount/100));
      const itemOldPrice = itemDiscount > 0 ? itemOldPriceRaw : null;`,
'(৬) Add ফর্ম Save হ্যান্ডলার ঠিক করা হয়েছে'
);

fs.writeFileSync('assets/js/admin.js', content, 'utf8');
console.log("✅ ধাপ ২ (বাল্ক + Add ফর্ম) সম্পন্ন");
