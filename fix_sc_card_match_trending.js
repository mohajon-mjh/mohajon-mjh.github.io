const fs = require('fs');
const filePath = 'index.html';
let content = fs.readFileSync(filePath, 'utf8');

const pattern = /function scRenderCard\(id, p\)\{[\s\S]*?(?=function scRenderNextBatch)/;

if (!pattern.test(content)) {
  console.log("❌ scRenderCard ফাংশন খুঁজে পাওয়া যায়নি — ম্যানুয়াল চেক দরকার।");
  process.exit(1);
}

const newBlock = `function scIsWished(id){
          const list = JSON.parse(localStorage.getItem("wishlist") || "[]");
          return list.some(i => i.id === id);
        }

        function scRenderCard(id, p){
          const price = parseFloat(p.price) || 0;
          const fmtP = (v) => window.MJHCurrency ? window.MJHCurrency.formatPrice(v) : '৳'+v.toFixed(0);
          const priceDisplay = fmtP(price);
          const stock = parseInt(p.stock) || 0;
          const imageUrl = (p.images && p.images.main && p.images.main.trim() !== "") ? p.images.main : "https://dummyimage.com/300x300/eeeeee/555555&text=MJH";
          const wished = scIsWished(id);
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
              <button class="btn-wishlist-overlay \${wished ? 'active' : ''}">❤</button>
              <img src="\${imageUrl}" alt="\${p.title || "Product"}"
                   loading="lazy"
                   onerror="this.onerror=null;this.src='https://dummyimage.com/300x300/eeeeee/555555&text=MJH';">
            </div>
            <div class="product-card-content">
              <h3 class="product-card-title">\${p.title || "Unnamed Product"}</h3>
              <div class="product-card-price">
                <span class="current-price">\${priceDisplay}</span>
              </div>
              <div class="product-card-actions" style="flex-direction:column">
                <button class="btn-add-to-cart" \${stock<=0 ? "disabled" : ""} style="width:100%">\${stock<=0 ? "Out of Stock" : "🛒 Add to Cart"}</button>
                <button class="btn-buy-now" \${stock<=0 ? "disabled" : ""} style="width:100%;background:#f59e0b;color:#fff;margin-top:6px;border:none;border-radius:8px;padding:8px 14px;font-size:0.85rem;font-weight:600;cursor:pointer">⚡ Buy Now</button>
              </div>
            </div>
          \`;

          const cartBtn = card.querySelector(".btn-add-to-cart");
          if(cartBtn && stock > 0){
            cartBtn.addEventListener("click", () => {
              if(typeof addCart === "function"){
                addCart(id, p.title || p.name, price);
              }
              cartBtn.textContent = "Added ✓";
              setTimeout(()=>{ cartBtn.textContent = "🛒 Add to Cart"; }, 1200);
            });
          }

          const buyBtn = card.querySelector(".btn-buy-now");
          if(buyBtn && stock > 0){
            buyBtn.addEventListener("click", () => {
              if(typeof addCart === "function"){
                addCart(id, p.title || p.name, price);
              }
              window.location.href = "cart.html";
            });
          }

          const wishBtn = card.querySelector(".btn-wishlist-overlay");
          if(wishBtn){
            wishBtn.addEventListener("click", (e) => {
              e.stopPropagation();
              if(typeof toggleWishlist === "function"){
                toggleWishlist(id, p.title || p.name);
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
            window.location.href = \`product-details.html?id=\${id}\`;
          });

          return card;
        }

        `;

content = content.replace(pattern, newBlock);
fs.writeFileSync(filePath, content, 'utf8');
console.log("✅ Special Categories কার্ড এখন Trending Products এর হুবহু same হয়ে গেছে।");
