const fs = require('fs');
let html = fs.readFileSync('index.html', 'utf8');

// ১. স্ট্যাটিক ক্যাটাগরি বাটন রিমুভ করে খালি কন্টেইনার
const oldCatsDiv = `<div class="categories" id="flashCatsRow">
<a href="javascript:void(0)" class="cat" data-mode="flashsale" data-cat="" onclick="loadFlashCategoryProducts('flashsale', null)">🔥 <span id="flashSaleLabelText">Up To 70% Off</span></a>
<a href="javascript:void(0)" class="cat" data-mode="category" data-cat="lighting_lamps" onclick="loadFlashCategoryProducts('category', 'lighting_lamps')">🎉 Special Offers<br>for One Week</a>
<a href="javascript:void(0)" class="cat" data-mode="category" data-cat="consumer_electronics" onclick="loadFlashCategoryProducts('category', 'consumer_electronics')">📱 Electronics Deals</a>
<a href="javascript:void(0)" class="cat" data-mode="category" data-cat="clothing_fashion_apparel_men_women_kids" onclick="loadFlashCategoryProducts('category', 'clothing_fashion_apparel_men_women_kids')">👕 Fashion Sale</a>
<a href="javascript:void(0)" class="cat" data-mode="category" data-cat="home_kitchen" onclick="loadFlashCategoryProducts('category', 'home_kitchen')">🏠 Home Essentials</a>
</div>`;

const newCatsDiv = `<div class="categories" id="flashCatsRow">
<p style="text-align:center;color:#888">লোড হচ্ছে...</p>
</div>`;

if(!html.includes(oldCatsDiv)){ console.log("❌ oldCatsDiv মিলছে না"); process.exit(1); }
html = html.replace(oldCatsDiv, newCatsDiv);
console.log("✅ ক্যাটাগরি বাটন ডাইনামিক কন্টেইনারে বদলানো হয়েছে");

// ২. renderFlashSaleCard() পুরনো মডেল থেকে নতুন মডেলে বদলানো
const oldRenderStart = 'function renderFlashSaleCard(id, data, globalDiscount){';
const oldRenderEnd = 'return card;\n}';
const rStart = html.indexOf(oldRenderStart);
const rEnd = html.indexOf(oldRenderEnd, rStart) + oldRenderEnd.length;
if(rStart === -1){ console.log("❌ renderFlashSaleCard পাওয়া যায়নি"); process.exit(1); }

const newRenderFunc = `function renderFlashSaleCard(id, data, mapInfo){
  mapInfo = mapInfo || {};
  const salePrice = parseFloat(data.price) || 0;
  const hasOldPrice = data.discountPrice !== null && data.discountPrice !== undefined && data.discountPrice !== "" && parseFloat(data.discountPrice) > 0;
  const oldPrice = hasOldPrice ? parseFloat(data.discountPrice) : 0;
  const discount = parseInt(mapInfo.discountPercent) || 0;
  const saveAmount = hasOldPrice ? (oldPrice - salePrice) : 0;
  const fmtP = (v) => window.MJHCurrency ? window.MJHCurrency.formatPrice(v) : '৳'+v.toFixed(0);
  const priceDisplay = fmtP(salePrice);
  const oldPriceDisplay = hasOldPrice ? fmtP(oldPrice) : "";
  const stock = parseInt(data.stock) || 0;

  const imageUrl =
    data.images && data.images.main && data.images.main.trim() !== ""
      ? data.images.main
      : "https://dummyimage.com/300x300/eeeeee/555555&text=MJH";

  const wished = fsIsWished(id);

  const stockBadge = stock <= 0
    ? '<span class="stock-badge out-of-stock">Out of Stock</span>'
    : (stock <= 5
        ? '<span class="stock-badge low-stock">Low Stock</span>'
        : '<span class="stock-badge in-stock">In Stock</span>');

  const card = document.createElement("div");
  card.className = "product-card";
  card.style.cursor = "pointer";

  card.innerHTML = \`
    <div class="product-card-image">
      \${stockBadge}
      \${discount > 0 ? \`<span class="discount-badge">-\${discount}%</span>\` : ""}
      \${saveAmount > 0 ? \`<span class="save-badge">Save \${fmtP(saveAmount)}</span>\` : ""}
      <button class="btn-wishlist-overlay \${wished ? 'active' : ''}">❤</button>
      <img src="\${imageUrl}" alt="\${data.title || data.name || 'Product'}"
           loading="lazy"
           onerror="this.onerror=null;this.src='https://dummyimage.com/300x300/eeeeee/555555&text=MJH';">
    </div>
    <div class="product-card-content">
      <h3 class="product-card-title">\${data.title || data.name || "Unnamed Product"}</h3>
      <div class="product-card-price">
        <span class="current-price">\${priceDisplay}</span>
        \${hasOldPrice ? \`<span class="old-price">\${oldPriceDisplay}</span>\` : ""}
      </div>
      <div class="product-card-actions" style="flex-direction:column">
        <button class="btn-add-to-cart" \${stock<=0 ? "disabled" : ""} style="width:100%">\${stock<=0 ? "Out of Stock" : "🛒 Add to Cart"}</button>
        <button class="btn-buy-now" \${stock<=0 ? "disabled" : ""} style="width:100%;background:#f59e0b;color:#fff;margin-top:6px;border:none;border-radius:8px;padding:8px 14px;font-size:0.85rem;font-weight:600;cursor:pointer">⚡ Buy Now</button>
      </div>
    </div>
  \`;

  const cartBtn = card.querySelector(".btn-add-to-cart");
  if(cartBtn && stock > 0){
    cartBtn.addEventListener("click", (e) => {
      e.stopPropagation();
      if(typeof addCart === "function"){
        addCart(id, data.title || data.name, salePrice);
      }
      cartBtn.textContent = "Added ✓";
      setTimeout(()=>{ cartBtn.textContent = "🛒 Add to Cart"; }, 1200);
    });
  }

  const buyBtn = card.querySelector(".btn-buy-now");
  if(buyBtn && stock > 0){
    buyBtn.addEventListener("click", (e) => {
      e.stopPropagation();
      if(typeof addCart === "function"){
        addCart(id, data.title || data.name, salePrice);
      }
      window.location.href = "cart.html";
    });
  }

  const wishBtn = card.querySelector(".btn-wishlist-overlay");
  if(wishBtn){
    wishBtn.addEventListener("click", (e) => {
      e.stopPropagation();
      if(typeof toggleWishlist === "function"){
        toggleWishlist(id, data.title || data.name);
      }
      wishBtn.classList.toggle("active");
    });
  }

  card.addEventListener("click", () => {
    window.location.href = \`product-details.html?id=\${id}\`;
  });

  return card;
}`;

html = html.slice(0, rStart) + newRenderFunc + html.slice(rEnd);
console.log("✅ renderFlashSaleCard() নতুন মডেলে বদলানো হয়েছে");

// ৩. লেবেল-লোডিং ব্লক রিমুভ (আর দরকার নেই, ক্যাটাগরি নাম এখন ডাইনামিক)
const oldLabelBlock = `const flashSaleLabelEl = document.getElementById("flashSaleLabelText");
if(flashSaleLabelEl){
  import("https://www.gstatic.com/firebasejs/12.0.0/firebase-database.js").then(({getDatabase, ref, get}) => {
    get(ref(fsDb, "settings/flashSaleLabel")).then(snap => {
      if(snap.exists() && snap.val()){
        flashSaleLabelEl.textContent = snap.val();
      }
    });
  });
}`;
if(html.includes(oldLabelBlock)){
  html = html.replace(oldLabelBlock, "// (পুরনো লেবেল লোডিং সরানো হয়েছে, এখন ক্যাটাগরি নাম ডাইনামিক)");
  console.log("✅ পুরনো লেবেল ব্লক সরানো হয়েছে");
}

// ৪. loadFlashCategoryProducts() ও শেষের কল সম্পূর্ণ বদলানো
const oldLoadStart = 'function loadFlashCategoryProducts(mode, categoryId){';
const oldLoadEnd = 'loadFlashCategoryProducts("flashsale", null);';
const lStart = html.indexOf(oldLoadStart);
const lEnd = html.indexOf(oldLoadEnd, lStart) + oldLoadEnd.length;
if(lStart === -1){ console.log("❌ loadFlashCategoryProducts পাওয়া যায়নি"); process.exit(1); }

const newLoadBlock = `function fsParseDate(str){
  if(!str) return null;
  const parts = str.split("-");
  if(parts.length !== 3) return null;
  const d = parseInt(parts[0]), m = parseInt(parts[1]), y = parseInt(parts[2]);
  if(!d || !m || !y) return null;
  return new Date(y, m-1, d, 23, 59, 59);
}

function fsIsOfferActive(mapInfo){
  const start = fsParseDate(mapInfo.startDate);
  const end = fsParseDate(mapInfo.endDate);
  const now = new Date();
  if(start && now < start) return false;
  if(end && now > end) return false;
  return true;
}

let fscCatsCache = {};

function loadFlashCategoryProducts(catId){
  document.querySelectorAll("#flashCatsRow .cat").forEach(b => b.classList.remove("active"));
  const activeBtn = document.querySelector(\`#flashCatsRow .cat[data-cat="\${catId}"]\`);
  if(activeBtn) activeBtn.classList.add("active");

  flashSaleGrid.innerHTML = "<p style='text-align:center;color:#888'>লোড হচ্ছে...</p>";

  get(ref(fsDb, "settings/flashSaleCategoryProducts/"+catId)).then(async (mapSnap) => {
    const map = mapSnap.exists() ? mapSnap.val() : {};
    const pids = Object.keys(map);
    if(pids.length === 0){
      flashSaleGrid.innerHTML = "<p style='text-align:center;color:#888'>এখনো কোনো প্রোডাক্ট যোগ করা হয়নি।</p>";
      fsAllItems = [];
      return;
    }
    const results = await Promise.all(pids.map(async (pid) => {
      try{
        const pSnap = await get(ref(fsDb, "products/"+pid));
        if(!pSnap.exists()) return null;
        const data = pSnap.val();
        if(data.status !== "active") return null;
        const mapInfo = map[pid] || {};
        if(!fsIsOfferActive(mapInfo)) return null;
        return { id: pid, data, mapInfo };
      }catch(e){ return null; }
    }));
    fsAllItems = results.filter(Boolean);
    fsRenderedCount = 0;
    flashSaleGrid.innerHTML = "";
    if(fsAllItems.length === 0){
      flashSaleGrid.innerHTML = "<p style='text-align:center;color:#888'>এখনো কোনো প্রোডাক্ট যোগ করা হয়নি।</p>";
      return;
    }
    fsRenderNextBatch();
  }).catch((err) => {
    flashSaleGrid.innerHTML = "<p style='text-align:center;color:#888'>লোড করতে সমস্যা হয়েছে।</p>";
    console.error(err);
  });
}
window.loadFlashCategoryProducts = loadFlashCategoryProducts;

function fsInitCategories(){
  const catsRow = document.getElementById("flashCatsRow");
  onValue(ref(fsDb, "settings/flashSaleCategories"), (snapshot) => {
    fscCatsCache = snapshot.val() || {};
    const entries = Object.entries(fscCatsCache).sort((a,b)=>(a[1].order||0)-(b[1].order||0));
    catsRow.innerHTML = "";
    if(entries.length === 0){
      catsRow.innerHTML = "<p style='text-align:center;color:#888'>কোনো Flash Sale ক্যাটাগরি নেই</p>";
      flashSaleGrid.innerHTML = "";
      return;
    }
    entries.forEach(([id, item], idx) => {
      const a = document.createElement("a");
      a.href = "javascript:void(0)";
      a.className = "cat";
      a.dataset.cat = id;
      a.textContent = item.name || "Unnamed";
      a.onclick = () => loadFlashCategoryProducts(id);
      catsRow.appendChild(a);
    });
    const firstId = entries[0][0];
    loadFlashCategoryProducts(firstId);
  });
}

fsInitCategories();`;

html = html.slice(0, lStart) + newLoadBlock + html.slice(lEnd);
fs.writeFileSync('index.html', html, 'utf8');
console.log("✅ loadFlashCategoryProducts() ও ক্যাটাগরি ইনিশিয়ালাইজেশন নতুনভাবে বসানো হয়েছে");
