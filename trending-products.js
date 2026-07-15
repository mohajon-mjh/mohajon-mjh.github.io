import { initializeApp, getApps } from "https://www.gstatic.com/firebasejs/12.0.0/firebase-app.js";
import { getDatabase, ref, get } from "https://www.gstatic.com/firebasejs/12.0.0/firebase-database.js";

const firebaseConfig = {
  apiKey: "AIzaSyDj_LLHWBgcKfQClnaOUqEtULHhP1vSVxw",
  authDomain: "mohajon-mjh.firebaseapp.com",
  databaseURL: "https://mohajon-mjh-default-rtdb.firebaseio.com",
  projectId: "mohajon-mjh",
  storageBucket: "mohajon-mjh.firebasestorage.app",
  messagingSenderId: "526105903976",
  appId: "1:526105903976:web:f9321c6d68ecbd19d58cdd"
};

const app = getApps().length ? getApps()[0] : initializeApp(firebaseConfig);
const db = getDatabase(app);

const TRENDING_SKUS = ["p0002", "p0015", "p0110", "p0071", "p0101", "p0102", "p0118", "p0030"];

function getCart() {
  return JSON.parse(localStorage.getItem("cart") || "[]");
}
function saveCart(cart) {
  localStorage.setItem("cart", JSON.stringify(cart));
  document.querySelectorAll("#cartCount").forEach(el => {
    const count = cart.reduce((sum, i) => sum + (i.qty || 1), 0);
    el.textContent = count;
  });
}
function addToRealCart(id, name, price, sellerId) {
  let cart = getCart();
  let item = cart.find(i => i.id === id);
  if (item) {
    item.qty = (item.qty || 1) + 1;
  } else {
    cart.push({ id, name, price, qty: 1, sellerId: sellerId || "admin" });
  }
  saveCart(cart);
}

function isWished(id) {
  const list = JSON.parse(localStorage.getItem("wishlist") || "[]");
  return list.some(i => i.id === id);
}
function toggleWish(id, name) {
  let list = JSON.parse(localStorage.getItem("wishlist") || "[]");
  const idx = list.findIndex(i => i.id === id);
  if (idx >= 0) list.splice(idx, 1);
  else list.push({ id, name });
  localStorage.setItem("wishlist", JSON.stringify(list));
}

function createCard(sku, product) {
  const stock = parseInt(product.stock) || 0;
  const price = parseFloat(product.price) || 0;
  const imageUrl = (product.images && product.images.main) || "https://dummyimage.com/300x300/eeeeee/555555&text=MJH";

  const stockLabel = stock <= 0 ? "❌ Out of Stock" : (stock <= 5 ? "⚠️ Low Stock" : "✅ In Stock");
  const wished = isWished(sku);

  const card = document.createElement("div");
  card.className = "product-card";
  card.innerHTML = `
    <div class="product-image">
      <button class="wishlist-btn ${wished ? "active" : ""}">❤</button>
      <img src="${imageUrl}" alt="${product.title || "Product"}" loading="lazy"
           onerror="this.onerror=null;this.src='https://dummyimage.com/300x300/eeeeee/555555&text=MJH';">
    </div>
    <div class="product-info">
      <h3 class="product-title">${product.title || "Unnamed Product"}</h3>
      <div class="product-price">
        <span class="new-price">৳${price.toFixed(0)}</span>
      </div>
      <span class="stock">${stockLabel}</span>
      <div class="product-actions">
        <button class="cart-btn" ${stock <= 0 ? "disabled" : ""}>
          🛒 ${stock <= 0 ? "Out of Stock" : "Add to Cart"}
        </button>
        <a href="product-details.html?id=${sku}" class="buy-btn" style="text-decoration:none;text-align:center;display:inline-block;">
          View Details
        </a>
      </div>
    </div>
  `;

  const cartBtn = card.querySelector(".cart-btn");
  if (cartBtn && stock > 0) {
    cartBtn.addEventListener("click", () => {
      addToRealCart(sku, product.title, price, product.sellerId);
      cartBtn.textContent = "Added ✓";
      setTimeout(() => { cartBtn.textContent = "🛒 Add to Cart"; }, 1200);
    });
  }

  const wishBtn = card.querySelector(".wishlist-btn");
  if (wishBtn) {
    wishBtn.addEventListener("click", () => {
      toggleWish(sku, product.title);
      wishBtn.classList.toggle("active");
    });
  }

  return card;
}

async function loadTrending() {
  const container = document.getElementById("trendingProducts");
  if (!container) return;

  try {
    const snapshot = await get(ref(db, "products"));
    const data = snapshot.val() || {};

    container.innerHTML = "";
    let count = 0;

    TRENDING_SKUS.forEach(sku => {
      if (data[sku]) {
        container.appendChild(createCard(sku, data[sku]));
        count++;
      }
    });

    if (count === 0) {
      container.innerHTML = `<div class="loading-placeholder">No trending products found</div>`;
    }
  } catch (err) {
    container.innerHTML = `<div class="loading-placeholder">Failed to load products</div>`;
    console.error("Trending products load error:", err);
  }
}

document.addEventListener("DOMContentLoaded", loadTrending);
