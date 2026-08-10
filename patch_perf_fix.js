const fs = require('fs');
let content = fs.readFileSync('assets/js/admin.js', 'utf8');

const oldFunc = `function renderAllProducts(filterText){
  allProductsDiv.innerHTML="<div class='section-title'><h3>✏️ সব প্রোডাক্ট — এডিট / ডিলিট</h3></div>";
  const search = (filterText||"").trim().toLowerCase();
  let count = 0;

  Object.keys(allProductsCache).forEach(key=>{
    const data = allProductsCache[key];
    const name = (data.title || data.name || "").toLowerCase();
    if(search && !name.includes(search)) return;
    count++;
`;

const newFuncHeader = `let allProductsRenderLimit = 50;

function renderAllProducts(filterText){
  allProductsDiv.innerHTML="<div class='section-title'><h3>✏️ সব প্রোডাক্ট — এডিট / ডিলিট</h3></div>";
  const search = (filterText||"").trim().toLowerCase();
  let count = 0;

  let allKeys = Object.keys(allProductsCache);
  if(search){
    allKeys = allKeys.filter(key=>{
      const data = allProductsCache[key];
      const name = (data.title || data.name || "").toLowerCase();
      return name.includes(search);
    });
  } else {
    allKeys = allKeys.slice(0, allProductsRenderLimit);
  }

  allKeys.forEach(key=>{
    const data = allProductsCache[key];
    count++;
`;

if(!content.includes(oldFunc)){ console.log("❌ oldFunc মিলছে না"); process.exit(1); }
content = content.replace(oldFunc, newFuncHeader);
console.log("✅ renderAllProducts() এ pagination লজিক বসানো হয়েছে");

// ফাংশনের শেষে "লোড আরও" বাটন যোগ
const oldEnd = `  if(count === 0) allProductsDiv.innerHTML += "<p>কোনো প্রোডাক্ট পাওয়া যায়নি।</p>";
}`;

const newEnd = `  if(count === 0) allProductsDiv.innerHTML += "<p>কোনো প্রোডাক্ট পাওয়া যায়নি।</p>";

  const totalCount = Object.keys(allProductsCache).length;
  if(!search && totalCount > allProductsRenderLimit){
    const moreBtn = document.createElement("button");
    moreBtn.className = "save-btn";
    moreBtn.style.cssText = "display:block;margin:15px auto";
    moreBtn.textContent = \`⬇️ আরও দেখান (\${totalCount - allProductsRenderLimit}টি বাকি)\`;
    moreBtn.onclick = () => {
      allProductsRenderLimit += 50;
      renderAllProducts(searchInput ? searchInput.value : "");
    };
    allProductsDiv.appendChild(moreBtn);
  }
}`;

if(!content.includes(oldEnd)){ console.log("❌ oldEnd মিলছে না"); process.exit(1); }
content = content.replace(oldEnd, newEnd);
console.log("✅ 'আরও দেখান' বাটন যোগ করা হয়েছে");

// Flash Sale ক্যাটাগরি সবার আগে লোড করা (ভারী প্রোডাক্ট লিস্টের আগে)
const oldOrder = `  currentAdminUid = user.uid;
  loadProducts();
  loadAllProducts();`;

const newOrder = `  currentAdminUid = user.uid;
  loadFlashSaleCategories();
  loadProducts();
  loadAllProducts();`;

if(!content.includes(oldOrder)){ console.log("❌ oldOrder মিলছে না"); process.exit(1); }
content = content.replace(oldOrder, newOrder);

const oldDupe = `  loadComingSoon();
  loadFlashSaleCategories();
  loadTrending();`;
const newDupe = `  loadComingSoon();
  loadTrending();`;
if(content.includes(oldDupe)){
  content = content.replace(oldDupe, newDupe);
  console.log("✅ loadFlashSaleCategories() সবার আগে সরানো হয়েছে (ডুপ্লিকেট কল সরানো হয়েছে)");
} else {
  console.log("⚠️ পুরনো loadFlashSaleCategories() অবস্থান মিলছে না, চেক করা দরকার");
}

fs.writeFileSync('assets/js/admin.js', content, 'utf8');
console.log("✅ সব প্যাচ সম্পন্ন");
