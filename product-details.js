import { initializeApp } from "https://www.gstatic.com/firebasejs/12.0.0/firebase-app.js";
import { getDatabase, ref, onValue } from "https://www.gstatic.com/firebasejs/12.0.0/firebase-database.js";

const firebaseConfig = {
  apiKey: "AIzaSyDj_LLHWBgcKfQClnaOUqEtULHhP1vSVxw",
  authDomain: "mohajon-mjh.firebaseapp.com",
  databaseURL: "https://mohajon-mjh-default-rtdb.firebaseio.com",
  projectId: "mohajon-mjh",
  storageBucket: "mohajon-mjh.firebasestorage.app",
  messagingSenderId: "526105903976",
  appId: "1:526105903976:web:f9321c6d68ecbd19d58cdd"
};

const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

const params = new URLSearchParams(window.location.search);
const id = params.get("id");

const root = document.getElementById("pdRoot");

function isWished(pid){
  try{
    const list = JSON.parse(localStorage.getItem("wishlist")||"[]");
    return list.some(i => i.id === pid);
  }catch(e){return false;}
}

function renderNotFound(){
  root.innerHTML = `
    <div class="pd-notfound">
      <h2>প্রোডাক্ট পাওয়া যায়নি</h2>
      <p>এই প্রোডাক্টটি হয়তো সরিয়ে ফেলা হয়েছে বা লিংকটি ভুল।</p>
      <a href="products.html">← সব প্রোডাক্ট দেখুন</a>
    </div>
  `;
}

function buildHighlights(product){
  const items = [];
  if(product.netWeight) items.push(`নেট ওজন: ${product.netWeight}`);
  if(product.specifications && product.specifications.origin) items.push(`উৎস: ${product.specifications.origin}`);
  if(product.specifications && product.specifications.shelfLife) items.push(`মেয়াদ: ${product.specifications.shelfLife}`);

  if(product.categoryId === "food_grocery"){
    items.push("১০০% প্রাকৃতিক, কোনো প্রিজারভেটিভ যুক্ত নেই");
    items.push("সরাসরি বাংলাদেশি সরবরাহকারীর কাছ থেকে সংগৃহীত");
  } else {
    items.push("১০০% অরিজিনাল ও মানসম্পন্ন প্রোডাক্ট");
    items.push("ক্যাশ অন ডেলিভারি সুবিধা উপলব্ধ");
  }
  return items;
}

function renderProduct(product){
  const price = parseFloat(product.price) || 0;
  const oldPrice = parseFloat(product.oldPrice) || 0;
  const stock = parseInt(product.stock) || 0;

  let discount = 0;
  if(oldPrice > price){
    discount = Math.round(((oldPrice - price) / oldPrice) * 100);
  }

  let stockHtml = "";
  if(stock <= 0){
    stockHtml = `<div class="pd-stock-out">স্টকে নেই</div>`;
  } else if(stock <= 5){
    stockHtml = `<div class="pd-stock-low">স্বল্প স্টক (${stock} টি বাকি)</div>`;
  } else {
    stockHtml = `<div class="pd-stock-in">স্টকে আছে</div>`;
  }

  const imageUrl =
    product.images && product.images.main && product.images.main.trim() !== ""
      ? product.images.main
      : "https://dummyimage.com/400x400/eeeeee/555555&text=MJH";

  const wished = isWished(id);

  const maxQty = Math.min(stock, 10);
  let qtyOptions = "";
  for(let i=1; i<=Math.max(maxQty,1); i++){
    qtyOptions += `<option value="${i}">${i}</option>`;
  }

  const highlights = buildHighlights(product);

  root.innerHTML = `
    <div class="pd-breadcrumb">
      <a href="index.html">Home</a> &rsaquo;
      <a href="products.html?categoryId=${encodeURIComponent(product.categoryId||'')}">${product.categoryId||'Products'}</a> &rsaquo;
      ${product.title||'Product'}
    </div>

    <div class="pd-grid">
      <div class="pd-gallery">
        <img src="${imageUrl}" alt="${product.title||'Product'}"
             onerror="this.onerror=null;this.src='https://dummyimage.com/400x400/eeeeee/555555&text=MJH';">
      </div>

      <div class="pd-info">
        <div class="pd-title">${product.title || "Unnamed Product"}</div>
        <div class="pd-sku">SKU: ${product.sku || id}</div>
        ${stockHtml}

        <div class="pd-price-row">
          <span class="pd-price">৳${price.toFixed(2)}</span>
          ${oldPrice > price ? `<span class="pd-old-price">৳${oldPrice.toFixed(2)}</span>` : ""}
          ${discount > 0 ? `<span class="pd-discount">-${discount}%</span>` : ""}
        </div>

        ${product.netWeight ? `<div class="pd-weight">${product.netWeight}</div>` : ""}

        <div class="pd-qty-row">
          <label for="pdQty">পরিমাণ:</label>
          <select id="pdQty" ${stock<=0?"disabled":""}>${qtyOptions}</select>
        </div>

        <div class="pd-buttons">
          <button id="pdAddCart" class="pd-btn pd-btn-cart" ${stock<=0?"disabled":""}>
            ${stock<=0 ? "স্টকে নেই" : "🛒 Add to Cart"}
          </button>
          <button id="pdBuyNow" class="pd-btn pd-btn-buy" ${stock<=0?"disabled":""}>
            ⚡ Buy Now
          </button>
          <button id="pdWishlist" class="pd-btn pd-btn-wish ${wished?'active':''}">
            ${wished ? "❤️ Wishlisted" : "🤍 Add to Wishlist"}
          </button>
        </div>

        <div class="pd-section pd-highlights">
          <h3>বিশেষত্ব</h3>
          <ul>
            ${highlights.map(h => `<li>${h}</li>`).join("")}
          </ul>
        </div>

        <div class="pd-section pd-specs">
          <h3>প্রোডাক্ট স্পেসিফিকেশন</h3>
          <table>
            ${product.netWeight ? `<tr><td>নেট ওজন</td><td>${product.netWeight}</td></tr>` : ""}
            ${product.specifications && product.specifications.origin ? `<tr><td>উৎস</td><td>${product.specifications.origin}</td></tr>` : ""}
            ${product.specifications && product.specifications.shelfLife ? `<tr><td>মেয়াদ</td><td>${product.specifications.shelfLife}</td></tr>` : ""}
            <tr><td>ক্যাটাগরি</td><td>${product.categoryId || "N/A"}</td></tr>
          </table>
        </div>

        ${product.description ? `
        <div class="pd-section">
          <h3>বিবরণ</h3>
          <p class="pd-desc">${product.description}</p>
        </div>` : ""}
      </div>
    </div>
  `;

  const qtySelect = document.getElementById("pdQty");
  const addBtn = document.getElementById("pdAddCart");
  const buyBtn = document.getElementById("pdBuyNow");
  const wishBtn = document.getElementById("pdWishlist");

  function getQty(){
    return parseInt(qtySelect.value) || 1;
  }

  if(addBtn){
    addBtn.addEventListener("click", () => {
      const qty = getQty();
      for(let i=0; i<qty; i++){
        if(typeof addCart === "function") addCart(id, product.title, price);
      }
      addBtn.textContent = "Added ✓";
      setTimeout(() => { addBtn.textContent = "🛒 Add to Cart"; }, 1200);
    });
  }

  if(buyBtn){
    buyBtn.addEventListener("click", () => {
      const qty = getQty();
      for(let i=0; i<qty; i++){
        if(typeof addCart === "function") addCart(id, product.title, price);
      }
      window.location.href = "checkout.html";
    });
  }

  if(wishBtn){
    wishBtn.addEventListener("click", () => {
      if(typeof toggleWishlist === "function") toggleWishlist(id, product.title);
      const nowWished = isWished(id);
      wishBtn.classList.toggle("active", nowWished);
      wishBtn.textContent = nowWished ? "❤️ Wishlisted" : "🤍 Add to Wishlist";
    });
  }
}

if(!id){
  renderNotFound();
} else {
  onValue(ref(db,"products"), (snap) => {
    const raw = snap.val() || {};
    const entries = Object.entries(raw).map(([key,val]) => ({id:key, ...val}));
    const product = entries.find(p => p.id === id || p.sku === id);

    if(!product){
      renderNotFound();
      return;
    }
    renderProduct(product);
  }, (error) => {
    console.error("Firebase error:", error);
    renderNotFound();
  });
}
