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
`    div.innerHTML = \`
      <img class="fsc-add-preview" style="width:80px;height:80px;object-fit:cover;border-radius:6px;float:left;margin-right:10px" src="">
      <label>নাম <input type="text" class="fsc-add-title" value="\${title}"></label>
      <label>মূল দাম / Market Price (৳) <input type="number" class="fsc-add-oldprice" value="0"></label>`,
`    div.innerHTML = \`
      <label style="display:inline-block;margin-right:8px"><input type="checkbox" class="fsc-add-check"></label>
      <img class="fsc-add-preview" style="width:80px;height:80px;object-fit:cover;border-radius:6px;float:left;margin-right:10px" src="">
      <label>নাম <input type="text" class="fsc-add-title" value="\${title}"></label>
      <label>মূল দাম / Market Price (৳) <input type="number" class="fsc-add-oldprice" value="0"></label>`,
'(fsc) checkbox যোগ হয়েছে'
);

replaceOnce(
`    div.querySelector(".fsc-add-save").onclick = async () => {
      const saveBtn = div.querySelector(".fsc-add-save");
      const itemTitle = div.querySelector(".fsc-add-title").value.trim();
      const itemOldPriceRaw = parseFloat(div.querySelector(".fsc-add-oldprice").value) || 0;
      const itemDiscount = parseInt(div.querySelector(".fsc-add-discount").value) || 0;
      const itemPrice = Math.round(itemOldPriceRaw * (1 - itemDiscount/100));
      const itemOldPrice = itemDiscount > 0 ? itemOldPriceRaw : null;
      const itemStart = div.querySelector(".fsc-add-startdate").value.trim();
      const itemEnd = div.querySelector(".fsc-add-enddate").value.trim();
      const itemStock = parseInt(div.querySelector(".fsc-add-stock").value) || 0;

      if(!itemTitle){ alert("নাম দিন"); return; }

      saveBtn.disabled = true;
      saveBtn.textContent = "সেভ হচ্ছে...";
      try{
        const imageUrl = await uploadToCloudinaryGlobal(file);
        const newRef = push(ref(db, "products"));
        await set(newRef, {
          title: itemTitle,
          price: itemPrice,
          discountPrice: itemOldPrice,
          stock: itemStock,
          categoryId: "flashsale_only",
          sellerId: currentAdminUid,
          status: "active",
          createdAt: Date.now(),
          images: { main: imageUrl }
        });
        await set(ref(db, \`settings/flashSaleCategoryProducts/\${fscSelectedCatId}/\${newRef.key}\`), {
          discountPercent: itemDiscount, startDate: itemStart, endDate: itemEnd, addedAt: Date.now()
        });
        await fscUpdateCategoryMaxDiscount(fscSelectedCatId);
        saveBtn.textContent = "✅ সেভ হয়েছে";
      }catch(err){
        alert("❌ সমস্যা: " + err.message);
        saveBtn.disabled = false;
        saveBtn.textContent = "💾 Save";
      }
    };`,
`    async function doSaveFsc(){
      const saveBtn = div.querySelector(".fsc-add-save");
      const itemTitle = div.querySelector(".fsc-add-title").value.trim();
      const itemOldPriceRaw = parseFloat(div.querySelector(".fsc-add-oldprice").value) || 0;
      const itemDiscount = parseInt(div.querySelector(".fsc-add-discount").value) || 0;
      const itemPrice = Math.round(itemOldPriceRaw * (1 - itemDiscount/100));
      const itemOldPrice = itemDiscount > 0 ? itemOldPriceRaw : null;
      const itemStart = div.querySelector(".fsc-add-startdate").value.trim();
      const itemEnd = div.querySelector(".fsc-add-enddate").value.trim();
      const itemStock = parseInt(div.querySelector(".fsc-add-stock").value) || 0;

      if(!itemTitle){ throw new Error("নাম দিন"); }

      saveBtn.disabled = true;
      saveBtn.textContent = "সেভ হচ্ছে...";
      try{
        const imageUrl = await uploadToCloudinaryGlobal(file);
        const newRef = push(ref(db, "products"));
        await set(newRef, {
          title: itemTitle,
          price: itemPrice,
          discountPrice: itemOldPrice,
          stock: itemStock,
          categoryId: "flashsale_only",
          sellerId: currentAdminUid,
          status: "active",
          createdAt: Date.now(),
          images: { main: imageUrl }
        });
        await set(ref(db, \`settings/flashSaleCategoryProducts/\${fscSelectedCatId}/\${newRef.key}\`), {
          discountPercent: itemDiscount, startDate: itemStart, endDate: itemEnd, addedAt: Date.now()
        });
        await fscUpdateCategoryMaxDiscount(fscSelectedCatId);
        saveBtn.textContent = "✅ সেভ হয়েছে";
      }catch(err){
        saveBtn.disabled = false;
        saveBtn.textContent = "💾 Save";
        throw err;
      }
    }
    div._doSave = doSaveFsc;
    div.querySelector(".fsc-add-save").onclick = () => {
      doSaveFsc().catch(err => alert("❌ সমস্যা: " + err.message));
    };`,
'(fsc) Save লজিক _doSave ফাংশনে রিফ্যাক্টর হয়েছে'
);

replaceOnce(
`    div.innerHTML = \`
      <img class="dotd-add-preview" style="width:80px;height:80px;object-fit:cover;border-radius:6px;float:left;margin-right:10px" src="">
      <label>নাম <input type="text" class="dotd-add-title" value="\${title}"></label>
      <label>মূল দাম / Market Price (৳) <input type="number" class="dotd-add-oldprice" value="0"></label>`,
`    div.innerHTML = \`
      <label style="display:inline-block;margin-right:8px"><input type="checkbox" class="dotd-add-check"></label>
      <img class="dotd-add-preview" style="width:80px;height:80px;object-fit:cover;border-radius:6px;float:left;margin-right:10px" src="">
      <label>নাম <input type="text" class="dotd-add-title" value="\${title}"></label>
      <label>মূল দাম / Market Price (৳) <input type="number" class="dotd-add-oldprice" value="0"></label>`,
'(dotd) checkbox যোগ হয়েছে'
);

replaceOnce(
`    div.querySelector(".dotd-add-save").onclick = async () => {
      const saveBtn = div.querySelector(".dotd-add-save");
      const itemTitle = div.querySelector(".dotd-add-title").value.trim();
      const itemOldPriceRaw = parseFloat(div.querySelector(".dotd-add-oldprice").value) || 0;
      const itemDiscount = parseInt(div.querySelector(".dotd-add-discount").value) || 0;
      const itemPrice = Math.round(itemOldPriceRaw * (1 - itemDiscount/100));
      const itemOldPrice = itemDiscount > 0 ? itemOldPriceRaw : null;
      const itemStart = div.querySelector(".dotd-add-startdate").value.trim();
      const itemEnd = div.querySelector(".dotd-add-enddate").value.trim();
      const itemStock = parseInt(div.querySelector(".dotd-add-stock").value) || 0;

      if(!itemTitle){ alert("নাম দিন"); return; }

      saveBtn.disabled = true;
      saveBtn.textContent = "সেভ হচ্ছে...";
      try{
        const imageUrl = await uploadToCloudinaryGlobal(file);
        const newRef = push(ref(db, "products"));
        await set(newRef, {
          title: itemTitle,
          price: itemPrice,
          discountPrice: itemOldPrice,
          stock: itemStock,
          categoryId: "flashsale_only",
          sellerId: currentAdminUid,
          status: "active",
          createdAt: Date.now(),
          images: { main: imageUrl }
        });
        await set(ref(db, \`settings/dealsOfDayCategoryProducts/\${dotdSelectedCatId}/\${newRef.key}\`), {
          discountPercent: itemDiscount, startDate: itemStart, endDate: itemEnd, addedAt: Date.now()
        });
        await dotdUpdateCategoryMaxDiscount(dotdSelectedCatId);
        saveBtn.textContent = "✅ সেভ হয়েছে";
      }catch(err){
        alert("❌ সমস্যা: " + err.message);
        saveBtn.disabled = false;
        saveBtn.textContent = "💾 Save";
      }
    };`,
`    async function doSaveDotd(){
      const saveBtn = div.querySelector(".dotd-add-save");
      const itemTitle = div.querySelector(".dotd-add-title").value.trim();
      const itemOldPriceRaw = parseFloat(div.querySelector(".dotd-add-oldprice").value) || 0;
      const itemDiscount = parseInt(div.querySelector(".dotd-add-discount").value) || 0;
      const itemPrice = Math.round(itemOldPriceRaw * (1 - itemDiscount/100));
      const itemOldPrice = itemDiscount > 0 ? itemOldPriceRaw : null;
      const itemStart = div.querySelector(".dotd-add-startdate").value.trim();
      const itemEnd = div.querySelector(".dotd-add-enddate").value.trim();
      const itemStock = parseInt(div.querySelector(".dotd-add-stock").value) || 0;

      if(!itemTitle){ throw new Error("নাম দিন"); }

      saveBtn.disabled = true;
      saveBtn.textContent = "সেভ হচ্ছে...";
      try{
        const imageUrl = await uploadToCloudinaryGlobal(file);
        const newRef = push(ref(db, "products"));
        await set(newRef, {
          title: itemTitle,
          price: itemPrice,
          discountPrice: itemOldPrice,
          stock: itemStock,
          categoryId: "flashsale_only",
          sellerId: currentAdminUid,
          status: "active",
          createdAt: Date.now(),
          images: { main: imageUrl }
        });
        await set(ref(db, \`settings/dealsOfDayCategoryProducts/\${dotdSelectedCatId}/\${newRef.key}\`), {
          discountPercent: itemDiscount, startDate: itemStart, endDate: itemEnd, addedAt: Date.now()
        });
        await dotdUpdateCategoryMaxDiscount(dotdSelectedCatId);
        saveBtn.textContent = "✅ সেভ হয়েছে";
      }catch(err){
        saveBtn.disabled = false;
        saveBtn.textContent = "💾 Save";
        throw err;
      }
    }
    div._doSave = doSaveDotd;
    div.querySelector(".dotd-add-save").onclick = () => {
      doSaveDotd().catch(err => alert("❌ সমস্যা: " + err.message));
    };`,
'(dotd) Save লজিক _doSave ফাংশনে রিফ্যাক্টর হয়েছে'
);

fs.writeFileSync('assets/js/admin.js', content, 'utf8');
console.log("✅ ধাপ ২ সম্পন্ন");
