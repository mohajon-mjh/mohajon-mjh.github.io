const fs = require('fs');
let html = fs.readFileSync('index.html', 'utf8');

const startMarker = '<div class="section">\n<h2>⭐ Deals Of The Day</h2>';
const startIdx = html.indexOf(startMarker);
if(startIdx === -1){ console.log("❌ startMarker পাওয়া যায়নি"); process.exit(1); }

const endMarker = '<div class="section">\n<h2>Special Categories</h2>';
const endIdx = html.indexOf(endMarker, startIdx);
if(endIdx === -1){ console.log("❌ endMarker পাওয়া যায়নি"); process.exit(1); }

const oldBlock = html.slice(startIdx, endIdx);

const newBlock = `<div class="section">
<h2>⭐ Deals Of The Day</h2>
<br>

<div class="categories" id="dotdCatsRow">
<p style="text-align:center;color:#888">লোড হচ্ছে...</p>
</div>

<br>
<div id="dealsGrid" class="trending-scroll-wrapper">
  <p style="text-align:center;color:#888">লোড হচ্ছে...</p>
</div>

<script type="module">
import { initializeApp, getApps } from "https://www.gstatic.com/firebasejs/12.0.0/firebase-app.js";
import { getDatabase, ref, onValue, get } from "https://www.gstatic.com/firebasejs/12.0.0/firebase-database.js";

const dealsFirebaseConfig = {
  apiKey: "AIzaSyDj_LLHWBgcKfQClnaOUqEtULHhP1vSVxw",
  authDomain: "mohajon-mjh.firebaseapp.com",
  databaseURL: "https://mohajon-mjh-default-rtdb.firebaseio.com",
  projectId: "mohajon-mjh",
  storageBucket: "mohajon-mjh.firebasestorage.app",
  messagingSenderId: "526105903976",
  appId: "1:526105903976:web:f9321c6d68ecbd19d58cdd",
  measurementId: "G-RX6CCQZHSH"
};

const dealsApp = initializeApp(dealsFirebaseConfig, "dealsApp");
const dealsDb = getDatabase(dealsApp);

let dotdAllItems = [];
let dotdRenderedCount = 0;
const dotdBatchSize = 10;

function dealsIsWished(id){
  const list = JSON.parse(localStorage.getItem("wishlist") || "[]");
  return list.some(i => i.id === id);
}

function dotdParseDate(str, endOfDay){
  if(!str) return null;
  const parts = str.split("-");
  if(parts.length !== 3) return null;
  const d = parseInt(parts[0]), m = parseInt(parts[1]), y = parseInt(parts[2]);
  if(!d || !m || !y) return null;
  return endOfDay ? new Date(y, m-1, d, 23, 59, 59) : new Date(y, m-1, d, 0, 0, 0);
}

function dotdIsOfferActive(mapInfo){
  const start = dotdParseDate(mapInfo.startDate, false);
  const end = dotdParseDate(mapInfo.endDate, true);
  const now = new Date();
  if(start && now < start) return false;
  if(end && now > end) return false;
  return true;
}

function renderDealCard(id, data, mapInfo){
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

  const wished = dealsIsWished(id);

  let dateRangeHTML = "";
  if(mapInfo.startDate || mapInfo.endDate){
    let dateText = "";
    if(mapInfo.startDate && mapInfo.endDate){
      dateText = "⏰ অফার: " + mapInfo.startDate + " থেকে " + mapInfo.endDate + " পর্যন্ত";
    } else if(mapInfo.endDate){
      dateText = "⏰ অফার শেষ: " + mapInfo.endDate;
    } else if(mapInfo.startDate){
      dateText = "⏰ অফার শুরু: " + mapInfo.startDate;
    }
    dateRangeHTML = '<div class="offer-date-badge" style="font-size:11px;color:#e67e22;margin:4px 0;font-weight:600">' + dateText + '</div>';
  }

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
      \${dateRangeHTML}
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
}

function dotdRenderNextBatch(){
  const grid = document.getElementById("dealsGrid");
  const nextItems = dotdAllItems.slice(dotdRenderedCount, dotdRenderedCount + dotdBatchSize);
  nextItems.forEach(it => grid.appendChild(renderDealCard(it.id, it.data, it.mapInfo)));
  dotdRenderedCount += nextItems.length;
}

function loadDotdCategoryProducts(catId){
  document.querySelectorAll("#dotdCatsRow .cat").forEach(b => b.classList.remove("active"));
  const activeBtn = document.querySelector(\`#dotdCatsRow .cat[data-cat="\${catId}"]\`);
  if(activeBtn) activeBtn.classList.add("active");

  const grid = document.getElementById("dealsGrid");
  grid.innerHTML = "<p style='text-align:center;color:#888'>লোড হচ্ছে...</p>";

  get(ref(dealsDb, "settings/dealsOfDayCategoryProducts/"+catId)).then(async (mapSnap) => {
    const map = mapSnap.exists() ? mapSnap.val() : {};
    const pids = Object.keys(map);
    if(pids.length === 0){
      grid.innerHTML = "<p style='text-align:center;color:#888'>এখনো কোনো প্রোডাক্ট যোগ করা হয়নি।</p>";
      dotdAllItems = [];
      return;
    }
    const results = await Promise.all(pids.map(async (pid) => {
      try{
        const pSnap = await get(ref(dealsDb, "products/"+pid));
        if(!pSnap.exists()) return null;
        const data = pSnap.val();
        if(data.status !== "active") return null;
        const mapInfo = map[pid] || {};
        if(!dotdIsOfferActive(mapInfo)) return null;
        return { id: pid, data, mapInfo };
      }catch(e){ return null; }
    }));
    dotdAllItems = results.filter(Boolean);
    dotdRenderedCount = 0;
    grid.innerHTML = "";
    if(dotdAllItems.length === 0){
      grid.innerHTML = "<p style='text-align:center;color:#888'>এখনো কোনো প্রোডাক্ট যোগ করা হয়নি।</p>";
      return;
    }
    dotdRenderNextBatch();
  }).catch((err) => {
    grid.innerHTML = "<p style='text-align:center;color:#888'>লোড করতে সমস্যা হয়েছে।</p>";
    console.error(err);
  });
}

function dotdInitCategories(){
  const catsRow = document.getElementById("dotdCatsRow");
  onValue(ref(dealsDb, "settings/dealsOfDayCategories"), (snapshot) => {
    const cats = snapshot.val() || {};
    const entries = Object.entries(cats).sort((a,b)=>(a[1].order||0)-(b[1].order||0));
    catsRow.innerHTML = "";
    if(entries.length === 0){
      catsRow.innerHTML = "<p style='text-align:center;color:#888'>কোনো Deals of the Day ক্যাটাগরি নেই</p>";
      document.getElementById("dealsGrid").innerHTML = "";
      return;
    }
    entries.forEach(([id, item]) => {
      const a = document.createElement("div");
      a.className = "cat";
      a.dataset.cat = id;
      a.style.cursor = "pointer";
      a.textContent = item.name || "Unnamed";
      a.onclick = () => loadDotdCategoryProducts(id);
      catsRow.appendChild(a);
    });
    const firstId = entries[0][0];
    loadDotdCategoryProducts(firstId);
  });
}

dotdInitCategories();
</script>
</div>

`;

if(!html.includes(oldBlock)){
  console.log("❌ oldBlock ম্যাচ করছে না");
  process.exit(1);
}

html = html.slice(0, startIdx) + newBlock + html.slice(endIdx);
fs.writeFileSync('index.html', html, 'utf8');
console.log("✅ পুরনো Deals of the Day সেকশন সম্পূর্ণ বদলে নতুন ডাইনামিক সিস্টেম বসানো হয়েছে");
