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
`  div.innerHTML = \`
    \${checkboxHTML}<h3 style="display:inline-block">\${title}</h3>
    <p>\${fscFormatPriceRow(data||{})}</p>
    <label>বর্তমান দাম (৳) <input type="number" class="fsc-item-price" value="\${data?data.price||0:0}"></label>
    <label>Market/Old Price (৳, ঐচ্ছিক — খালি রাখলে হোমপেজে দেখাবে না) <input type="number" class="fsc-item-oldprice" value="\${data&&data.discountPrice?data.discountPrice:''}" placeholder="খালি রাখুন যদি না দেখাতে চান"></label>
    <label>Discount % <input type="number" class="fsc-item-discount" value="\${mapInfo.discountPercent||0}" min="0" max="100" style="width:80px"></label>
    <label>Offer শুরুর তারিখ (dd-mm-yyyy, ঐচ্ছিক) <input type="text" class="fsc-item-startdate" value="\${mapInfo.startDate||''}" placeholder="খালি রাখুন যদি না দেখাতে চান"></label>
    <label>Offer শেষের তারিখ (dd-mm-yyyy, ঐচ্ছিক) <input type="text" class="fsc-item-enddate" value="\${mapInfo.endDate||''}" placeholder="খালি রাখুন যদি না দেখাতে চান"></label>
    <div style="margin-top:8px;display:flex;gap:8px;flex-wrap:wrap">
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
  })();`,
`  const initialPrice = data ? (data.price||0) : 0;
  const initialOldPrice = (data && data.discountPrice) ? data.discountPrice : initialPrice;

  div.innerHTML = \`
    \${checkboxHTML}<h3 style="display:inline-block">\${title}</h3>
    <label>মূল দাম / Market Price (৳) <input type="number" class="fsc-item-oldprice" value="\${initialOldPrice}"></label>
    <label>Discount % <input type="number" class="fsc-item-discount" value="\${mapInfo.discountPercent||0}" min="0" max="100" style="width:80px"></label>
    <label>বর্তমান দাম (৳) — অটো ক্যালকুলেট হয় <input type="number" class="fsc-item-price" value="\${initialPrice}" readonly style="background:#222;color:#8f8"></label>
    <div class="fsc-item-preview" style="margin:8px 0;padding:8px;background:#1a1a1a;border-radius:6px;font-size:14px"></div>
    <label>Offer শুরুর তারিখ (dd-mm-yyyy, ঐচ্ছিক) <input type="text" class="fsc-item-startdate" value="\${mapInfo.startDate||''}" placeholder="খালি রাখুন যদি না দেখাতে চান"></label>
    <label>Offer শেষের তারিখ (dd-mm-yyyy, ঐচ্ছিক) <input type="text" class="fsc-item-enddate" value="\${mapInfo.endDate||''}" placeholder="খালি রাখুন যদি না দেখাতে চান"></label>
    <div style="margin-top:8px;display:flex;gap:8px;flex-wrap:wrap">
      <button class="save-btn fsc-item-save">💾 Save</button>
      \${actionBtnHTML}
    </div>
  \`;

  (function(){
    const priceInput = div.querySelector(".fsc-item-price");
    const oldPriceInput = div.querySelector(".fsc-item-oldprice");
    const discountInput = div.querySelector(".fsc-item-discount");
    const previewEl = div.querySelector(".fsc-item-preview");
    function fscRecalc(){
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
    oldPriceInput.addEventListener("input", fscRecalc);
    discountInput.addEventListener("input", fscRecalc);
    fscRecalc();
  })();`,
'(১) সিঙ্গেল কার্ডে auto-fill + লাইভ প্রিভিউ যোগ হয়েছে'
);

replaceOnce(
`  div.querySelector(".fsc-item-save").onclick = async () => {
    const newPrice = parseFloat(div.querySelector(".fsc-item-price").value) || 0;
    const oldPriceVal = div.querySelector(".fsc-item-oldprice").value.trim();
    const newOldPrice = oldPriceVal === "" ? null : (parseFloat(oldPriceVal) || 0);
    const newDiscount = parseInt(div.querySelector(".fsc-item-discount").value) || 0;
    const newStart = div.querySelector(".fsc-item-startdate").value.trim();
    const newEnd = div.querySelector(".fsc-item-enddate").value.trim();
    try{
      await update(ref(db, "products/"+pid), { price: newPrice, discountPrice: newOldPrice, updatedAt: Date.now() });`,
`  div.querySelector(".fsc-item-save").onclick = async () => {
    const newOldPrice = parseFloat(div.querySelector(".fsc-item-oldprice").value) || 0;
    const newDiscount = parseInt(div.querySelector(".fsc-item-discount").value) || 0;
    const newPrice = Math.round(newOldPrice * (1 - newDiscount/100));
    const savedOldPrice = newDiscount > 0 ? newOldPrice : null;
    const newStart = div.querySelector(".fsc-item-startdate").value.trim();
    const newEnd = div.querySelector(".fsc-item-enddate").value.trim();
    try{
      await update(ref(db, "products/"+pid), { price: newPrice, discountPrice: savedOldPrice, updatedAt: Date.now() });`,
'(২) Save হ্যান্ডলার নতুন লজিকে বদলানো হয়েছে'
);

fs.writeFileSync('assets/js/admin.js', content, 'utf8');
console.log("✅ ধাপ ১ (সিঙ্গেল কার্ড) সম্পন্ন");
