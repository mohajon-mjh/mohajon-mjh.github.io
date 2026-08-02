with open('index.html', 'r', encoding='utf-8') as f:
    content = f.read()

start_marker = """<div class="section">
<h2>🔥 Trending Products</h2>"""

end_marker = """trLoadMoreBtn.addEventListener("click", () => trLoadBatch());
}
</script>

</div>"""

start_idx = content.index(start_marker)
end_idx = content.index(end_marker) + len(end_marker)

new_block = """<div class="section">
<h2>🔥 Trending Products</h2>
<br>

<div id="trendingProductsGrid" class="trending-scroll-wrapper">
  <p style="text-align:center;color:#888">লোড হচ্ছে...</p>
</div>

<script type="module">
import { initializeApp, getApps } from "https://www.gstatic.com/firebasejs/12.0.0/firebase-app.js";
import { getDatabase, ref, onValue, query, orderByChild, equalTo, limitToFirst } from "https://www.gstatic.com/firebasejs/12.0.0/firebase-database.js";

const trendingFirebaseConfig = {
  apiKey: "AIzaSyDj_LLHWBgcKfQClnaOUqEtULHhP1vSVxw",
  authDomain: "mohajon-mjh.firebaseapp.com",
  databaseURL: "https://mohajon-mjh-default-rtdb.firebaseio.com",
  projectId: "mohajon-mjh",
  storageBucket: "mohajon-mjh.firebasestorage.app",
  messagingSenderId: "526105903976",
  appId: "1:526105903976:web:f9321c6d68ecbd19d58cdd",
  measurementId: "G-RX6CCQZHSH"
};

const trendingApp = initializeApp(trendingFirebaseConfig, "trendingApp");
const trendingDb = getDatabase(trendingApp);

function trIsWished(id){
  const list = JSON.parse(localStorage.getItem("wishlist") || "[]");
  return list.some(i => i.id === id);
}

function renderTrendingCard(id, data){
  const price = parseFloat(data.price) || 0;
  const fmtP = (v) => window.MJHCurrency ? window.MJHCurrency.formatPrice(v) : '৳'+v.toFixed(0);
  const priceDisplay = fmtP(price);
  const stock = parseInt(data.stock) || 0;

  const imageUrl =
    data.images && data.images.main && data.images.main.trim() !== ""
      ? data.images.main
      : "https://dummyimage.com/300x300/eeeeee/555555&text=MJH";

  const wished = trIsWished(id);

  const stockBadge = stock <= 0
    ? '<span class="stock-badge out-of-stock">Out of Stock</span>'
    : (stock <= 5
        ? '<span class="stock-badge low-stock">Low Stock</span>'
        : '<span class="stock-badge in-stock">In Stock</span>');

  const card = document.createElement("div");
  card.className = "product-card";
  card.style.cursor = "pointer";

  card.innerHTML = `
    <div class="product-card-image">
      ${stockBadge}
      <button class="btn-wishlist-overlay ${wished ? 'active' : ''}">❤</button>
      <img src="${imageUrl}" alt="${data.title || data.name || 'Product'}"
           loading="lazy"
           onerror="this.onerror=null;this.src='https://dummyimage.com/300x300/eeeeee/555555&text=MJH';">
    </div>
    <div class="product-card-content">
      <h3 class="product-card-title">${data.title || data.name || "Unnamed Product"}</h3>
      <div class="product-card-price">
        <span class="current-price">${priceDisplay}</span>
      </div>
      <div class="product-card-actions" style="flex-direction:column">
        <button class="btn-add-to-cart" ${stock<=0 ? "disabled" : ""} style="width:100%">${stock<=0 ? "Out of Stock" : "🛒 Add to Cart"}</button>
        <button class="btn-buy-now" ${stock<=0 ? "disabled" : ""} style="width:100%;background:#f59e0b;color:#fff;margin-top:6px;border:none;border-radius:8px;padding:8px 14px;font-size:0.85rem;font-weight:600;cursor:pointer">⚡ Buy Now</button>
      </div>
    </div>
  `;

  const cartBtn = card.querySelector(".btn-add-to-cart");
  if(cartBtn && stock > 0){
    cartBtn.addEventListener("click", () => {
      if(typeof addCart === "function"){
        addCart(id, data.title || data.name, price);
      }
      cartBtn.textContent = "Added ✓";
      setTimeout(()=>{ cartBtn.textContent = "🛒 Add to Cart"; }, 1200);
    });
  }

  const buyBtn = card.querySelector(".btn-buy-now");
  if(buyBtn && stock > 0){
    buyBtn.addEventListener("click", () => {
      if(typeof addCart === "function"){
        addCart(id, data.title || data.name, price);
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

  if(cartBtn){
    cartBtn.addEventListener("click", (e) => { e.stopPropagation(); });
  }
  if(buyBtn){
    buyBtn.addEventListener("click", (e) => { e.stopPropagation(); });
  }

  card.addEventListener("click", () => {
    window.location.href = `product-details.html?id=${id}`;
  });

  return card;
}

const trendingGrid = document.getElementById("trendingProductsGrid");
const TR_STRIP_LIMIT = 30;
let trAllItems = [];
let trRenderedCount = 0;

function trRemoveArrow(){
  const old = trendingGrid.querySelector(".scroll-arrow-card");
  if(old) old.remove();
}

function trAddArrow(){
  trRemoveArrow();
  const arrowCard = document.createElement("div");
  arrowCard.className = "scroll-arrow-card";
  arrowCard.innerHTML = "<span>→</span>";
  arrowCard.addEventListener("click", () => { trRenderNextBatch(); });
  trendingGrid.appendChild(arrowCard);
}

function trRenderNextBatch(){
  trRemoveArrow();
  const nextItems = trAllItems.slice(trRenderedCount, trRenderedCount + TR_STRIP_LIMIT);
  nextItems.forEach(it => trendingGrid.appendChild(renderTrendingCard(it.id, it.data)));
  trRenderedCount += nextItems.length;
  if(trRenderedCount < trAllItems.length){
    trAddArrow();
  }
}

const trQuery = query(ref(trendingDb, "products"), orderByChild("isTrending"), equalTo(true), limitToFirst(500));
onValue(trQuery, (snapshot) => {
  trendingGrid.innerHTML = "";
  trAllItems = [];
  trRenderedCount = 0;
  snapshot.forEach(child => {
    if(child.val().status === "active"){
      trAllItems.push({ id: child.key, data: child.val() });
    }
  });
  if(trAllItems.length === 0){
    trendingGrid.innerHTML = "<p style='text-align:center;color:#888'>এখনো কোনো Trending প্রোডাক্ট যোগ করা হয়নি।</p>";
    return;
  }
  trRenderNextBatch();
}, { onlyOnce: true });
</script>

</div>"""

content = content[:start_idx] + new_block + content[end_idx:]

with open('index.html', 'w', encoding='utf-8') as f:
    f.write(content)

print("✅ Trending সেকশন প্যাচ হয়েছে —", end_idx - start_idx, "chars replaced with", len(new_block), "chars")
