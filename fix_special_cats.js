const fs = require('fs');
const filePath = 'index.html';
let content = fs.readFileSync(filePath, 'utf8');

const oldPattern = /const scQuery = query\(ref\(scDb, "products"\), orderByChild\("categoryId"\), equalTo\(slug\), limitToFirst\(30\)\);[\s\S]*?\}, \{ onlyOnce: true \}\);/;

if (!oldPattern.test(content)) {
  console.log("❌ পুরনো কোড ব্লক খুঁজে পাওয়া যায়নি — ম্যানুয়াল চেক দরকার।");
  process.exit(1);
}

const newBlock = `const scQuery = query(ref(scDb, "products"), orderByChild("categoryId"), equalTo(slug), limitToFirst(500));
      onValue(scQuery, (snapshot) => {
        const data = snapshot.val() || {};
        const matched = Object.entries(data).filter(([id, p]) => p.status === "active");

        if (matched.length === 0) {
          scCarousel.innerHTML = "<p style='text-align:center;color:#888'>শীঘ্রই পণ্য যুক্ত হবে...</p>";
          return;
        }

        scCarousel.innerHTML = "";
        const SC_STRIP_LIMIT = 30;
        let scRenderedCount = 0;

        function scRemoveArrow(){
          const old = scCarousel.querySelector(".scroll-arrow-card");
          if(old) old.remove();
        }

        function scAddArrow(){
          scRemoveArrow();
          const arrowCard = document.createElement("div");
          arrowCard.className = "scroll-arrow-card";
          arrowCard.innerHTML = "<span>→</span>";
          arrowCard.addEventListener("click", () => { scRenderNextBatch(); });
          scCarousel.appendChild(arrowCard);
        }

        function scRenderCard(id, p){
          const imgUrl = (p.images && p.images.main && p.images.main.trim() !== "") ? p.images.main : "https://dummyimage.com/300x300/eeeeee/555555&text=MJH";
          const priceDisplay = window.MJHCurrency ? window.MJHCurrency.formatPrice(p.price||0) : "৳"+(p.price||0);
          const card = document.createElement("div");
          card.className = "card";
          card.style.cursor = "pointer";
          card.innerHTML = \`
            <img src="\${imgUrl}" onerror="this.onerror=null;this.src='https://dummyimage.com/300x300/eeeeee/555555&text=MJH';" loading="lazy" alt="\${p.title || 'Product'}">
            <h3>\${p.title || "Unnamed Product"}</h3>
            <p>\${p.netWeight || ""}</p>
            <p><b>\${priceDisplay}</b></p>
            <button class="buy">Add Cart</button>
          \`;
          card.addEventListener("click", () => {
            window.location.href = \`product-details.html?id=\${id}\`;
          });
          const buyBtn = card.querySelector(".buy");
          if(buyBtn){
            buyBtn.addEventListener("click", (e) => {
              e.stopPropagation();
              if(typeof addCart === "function") addCart(id);
            });
          }
          return card;
        }

        function scRenderNextBatch(){
          scRemoveArrow();
          const nextItems = matched.slice(scRenderedCount, scRenderedCount + SC_STRIP_LIMIT);
          nextItems.forEach(([id, p]) => scCarousel.appendChild(scRenderCard(id, p)));
          scRenderedCount += nextItems.length;
          if(scRenderedCount < matched.length){
            scAddArrow();
          }
        }

        scRenderNextBatch();
      }, { onlyOnce: true });`;

content = content.replace(oldPattern, newBlock);
fs.writeFileSync(filePath, content, 'utf8');
console.log("✅ Special Categories carousel-এ ৩০+arrow পেজিনেশন লজিক সফলভাবে বসানো হয়েছে।");
