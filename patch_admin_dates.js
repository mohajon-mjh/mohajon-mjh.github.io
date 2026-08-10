const fs = require('fs');

let html = fs.readFileSync('admin.html', 'utf8');
const htmlAnchor = `<label>Category ID / Slug <input type="text" id="sc-slug" placeholder="যেমন: secondhand_refurbished_goods"></label>`;
if (html.includes(htmlAnchor) && !html.includes('id="sc-startdate"')) {
  html = html.replace(
    htmlAnchor,
    htmlAnchor + `
        <label>শুরুর তারিখ (dd-mm-yyyy) <input type="text" id="sc-startdate" placeholder="যেমন: 08-08-2026"></label>
        <label>শেষের তারিখ (dd-mm-yyyy) <input type="text" id="sc-enddate" placeholder="যেমন: 15-08-2026"></label>`
  );
  fs.writeFileSync('admin.html', html, 'utf8');
  console.log("✅ admin.html প্যাচ হয়েছে");
} else {
  console.log("⚠️ admin.html — আগেই প্যাচ করা আছে বা anchor নেই");
}

let js = fs.readFileSync('assets/js/admin.js', 'utf8');

const jsAnchor1 = `const scOrderInput = document.getElementById("sc-order");`;
if (js.includes(jsAnchor1) && !js.includes("scStartInput")) {
  js = js.replace(jsAnchor1, jsAnchor1 + `
  const scStartInput = document.getElementById("sc-startdate");
  const scEndInput = document.getElementById("sc-enddate");`);
}

const jsAnchor2 = `await set(newRef, { name, slug, order, createdAt: Date.now() });`;
if (js.includes(jsAnchor2)) {
  js = js.replace(
    jsAnchor2,
    `const startDate = scStartInput ? scStartInput.value.trim() : "";
      const endDate = scEndInput ? scEndInput.value.trim() : "";
      await set(newRef, { name, slug, order, startDate, endDate, createdAt: Date.now() });`
  );
}

const jsAnchor3 = `scOrderInput.value = "0";`;
if (js.includes(jsAnchor3) && !js.includes("if(scStartInput) scStartInput.value")) {
  js = js.replace(jsAnchor3, jsAnchor3 + `
      if(scStartInput) scStartInput.value = "";
      if(scEndInput) scEndInput.value = "";`);
}

const jsAnchor4 = `<label>Order <input type="number" class="sc-edit-order" value="\${item.order||0}" style="width:80px"></label>`;
if (js.includes(jsAnchor4) && !js.includes("sc-edit-startdate")) {
  js = js.replace(
    jsAnchor4,
    jsAnchor4 + `
          <label>শুরুর তারিখ <input type="text" class="sc-edit-startdate" value="\${(item.startDate||'').replace(/"/g,'&quot;')}" placeholder="dd-mm-yyyy"></label>
          <label>শেষের তারিখ <input type="text" class="sc-edit-enddate" value="\${(item.endDate||'').replace(/"/g,'&quot;')}" placeholder="dd-mm-yyyy"></label>`
  );
}

const jsAnchor5 = `const newOrder = parseInt(div.querySelector(".sc-edit-order").value) || 0;`;
if (js.includes(jsAnchor5) && !js.includes("newStartDate")) {
  js = js.replace(
    jsAnchor5,
    jsAnchor5 + `
        const newStartDate = div.querySelector(".sc-edit-startdate").value.trim();
        const newEndDate = div.querySelector(".sc-edit-enddate").value.trim();`
  );
}

const jsAnchor6 = `await update(ref(db, "settings/specialCategories/"+id), { name: newName, slug: newSlug, order: newOrder });`;
if (js.includes(jsAnchor6)) {
  js = js.replace(
    jsAnchor6,
    `await update(ref(db, "settings/specialCategories/"+id), { name: newName, slug: newSlug, order: newOrder, startDate: newStartDate, endDate: newEndDate });`
  );
}

fs.writeFileSync('assets/js/admin.js', js, 'utf8');
console.log("✅ assets/js/admin.js প্যাচ হয়েছে");
