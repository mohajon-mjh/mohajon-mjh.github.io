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

// ০. নতুন ফাংশন: ক্যাটাগরির সর্বোচ্চ discount% দিয়ে নাম আপডেট
replaceOnce(
  'let fscCurrentSubview = "owncat";\nlet fscSelectedIds = new Set();',
  'let fscCurrentSubview = "owncat";\nlet fscSelectedIds = new Set();\n\nasync function fscUpdateCategoryMaxDiscount(catId){\n  try{\n    const mapSnap = await get(ref(db, "settings/flashSaleCategoryProducts/"+catId));\n    const map = mapSnap.exists() ? mapSnap.val() : {};\n    let maxDiscount = 0;\n    Object.values(map).forEach(info => {\n      const d = parseInt(info.discountPercent) || 0;\n      if(d > maxDiscount) maxDiscount = d;\n    });\n    const catSnap = await get(ref(db, "settings/flashSaleCategories/"+catId));\n    if(!catSnap.exists()) return;\n    const oldName = catSnap.val().name || "";\n    if(/\\d+\\s*%/.test(oldName)){\n      const newName = oldName.replace(/\\d+(\\s*%)/, maxDiscount + "$1");\n      if(newName !== oldName){\n        await update(ref(db, "settings/flashSaleCategories/"+catId), { name: newName });\n      }\n    }\n  }catch(err){ console.error("fscUpdateCategoryMaxDiscount error:", err); }\n}',
  '(০) fscUpdateCategoryMaxDiscount ফাংশন যোগ করা হয়েছে'
);

// ১. Single product Save (owncat)
replaceOnce(
  '      await update(ref(db, "products/"+pid), { price: newPrice, discountPrice: newOldPrice, updatedAt: Date.now() });\n      if(isInCategory){\n        await update(ref(db, `settings/flashSaleCategoryProducts/${fscSelectedCatId}/${pid}`), {\n          discountPercent: newDiscount, startDate: newStart, endDate: newEnd\n        });\n      }\n      alert("✅ সেভ হয়েছে");',
  '      await update(ref(db, "products/"+pid), { price: newPrice, discountPrice: newOldPrice, updatedAt: Date.now() });\n      if(isInCategory){\n        await update(ref(db, `settings/flashSaleCategoryProducts/${fscSelectedCatId}/${pid}`), {\n          discountPercent: newDiscount, startDate: newStart, endDate: newEnd\n        });\n        await fscUpdateCategoryMaxDiscount(fscSelectedCatId);\n      }\n      alert("✅ সেভ হয়েছে");',
  '(১) Single Save এ auto-update যোগ হয়েছে'
);

// ২. Single product Remove
replaceOnce(
  '    div.querySelector(".fsc-item-remove").onclick = async () => {\n      if(!confirm("এই প্রোডাক্টটি এই ক্যাটাগরি থেকে সরাবেন?")) return;\n      try{\n        await remove(ref(db, `settings/flashSaleCategoryProducts/${fscSelectedCatId}/${pid}`));\n      }catch(err){ alert("❌ Error: " + err.message); }\n    };',
  '    div.querySelector(".fsc-item-remove").onclick = async () => {\n      if(!confirm("এই প্রোডাক্টটি এই ক্যাটাগরি থেকে সরাবেন?")) return;\n      try{\n        await remove(ref(db, `settings/flashSaleCategoryProducts/${fscSelectedCatId}/${pid}`));\n        await fscUpdateCategoryMaxDiscount(fscSelectedCatId);\n      }catch(err){ alert("❌ Error: " + err.message); }\n    };',
  '(২) Remove এ auto-update যোগ হয়েছে'
);

// ৩. Bulk Save
replaceOnce(
  '    try{\n      await update(ref(db), updates);\n      statusEl.textContent = `✅ ${checked.length}টি প্রোডাক্ট সেভ হয়েছে`;\n      setTimeout(()=>{ statusEl.textContent=""; }, 3000);\n    }catch(err){\n      statusEl.style.color = "#f88";\n      statusEl.textContent = "❌ Error: " + err.message;\n    }\n  };',
  '    try{\n      await update(ref(db), updates);\n      await fscUpdateCategoryMaxDiscount(fscSelectedCatId);\n      statusEl.textContent = `✅ ${checked.length}টি প্রোডাক্ট সেভ হয়েছে`;\n      setTimeout(()=>{ statusEl.textContent=""; }, 3000);\n    }catch(err){\n      statusEl.style.color = "#f88";\n      statusEl.textContent = "❌ Error: " + err.message;\n    }\n  };',
  '(৩) Bulk Save এ auto-update যোগ হয়েছে'
);

// ৪. Bulk Remove
replaceOnce(
  '    try{\n      for(const cb of checked){\n        await remove(ref(db, `settings/flashSaleCategoryProducts/${fscSelectedCatId}/${cb.dataset.pid}`));\n      }\n      statusEl.textContent = "✅ সরানো হয়েছে";',
  '    try{\n      for(const cb of checked){\n        await remove(ref(db, `settings/flashSaleCategoryProducts/${fscSelectedCatId}/${cb.dataset.pid}`));\n      }\n      await fscUpdateCategoryMaxDiscount(fscSelectedCatId);\n      statusEl.textContent = "✅ সরানো হয়েছে";',
  '(৪) Bulk Remove এ auto-update যোগ হয়েছে'
);

// ৫. নতুন প্রোডাক্ট Add-এর সময়
replaceOnce(
  '        await set(ref(db, `settings/flashSaleCategoryProducts/${fscSelectedCatId}/${newRef.key}`), {\n          discountPercent: itemDiscount, startDate: itemStart, endDate: itemEnd, addedAt: Date.now()\n        });\n        saveBtn.textContent = "✅ সেভ হয়েছে";',
  '        await set(ref(db, `settings/flashSaleCategoryProducts/${fscSelectedCatId}/${newRef.key}`), {\n          discountPercent: itemDiscount, startDate: itemStart, endDate: itemEnd, addedAt: Date.now()\n        });\n        await fscUpdateCategoryMaxDiscount(fscSelectedCatId);\n        saveBtn.textContent = "✅ সেভ হয়েছে";',
  '(৫) New Product Add এ auto-update যোগ হয়েছে'
);

fs.writeFileSync('assets/js/admin.js', content, 'utf8');
console.log("✅ সব প্যাচ সম্পন্ন");
