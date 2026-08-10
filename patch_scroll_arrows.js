const fs = require('fs');
let content = fs.readFileSync('index.html', 'utf8');
let changed = false;

const cssAnchor = `.special-categories-row .cat{
flex:0 0 auto;
min-width:150px;
}`;
if (content.includes(cssAnchor) && !content.includes(".scroll-row-wrapper")) {
  const newCss = cssAnchor + `

.scroll-row-wrapper{
position:relative;
display:flex;
align-items:center;
gap:8px;
}
.scroll-arrow-btn{
flex:0 0 auto;
width:36px;
height:36px;
border-radius:50%;
border:none;
background:#ff6a00;
color:#fff;
font-size:18px;
font-weight:bold;
cursor:pointer;
display:flex;
align-items:center;
justify-content:center;
box-shadow:0 2px 6px rgba(0,0,0,0.2);
z-index:2;
}
.scroll-arrow-btn:active{ transform:scale(0.92); }
.sc-date-range{
display:block;
font-size:11px;
color:#ff6a00;
font-weight:600;
margin-top:4px;
}
#flashCatsRow{overflow-x:auto;-webkit-overflow-scrolling:touch;scrollbar-width:none;}
#flashCatsRow::-webkit-scrollbar{display:none;}
#specialCatsContainer{overflow-x:auto;-webkit-overflow-scrolling:touch;scrollbar-width:none;}
#specialCatsContainer::-webkit-scrollbar{display:none;}`;
  content = content.replace(cssAnchor, newCss);
  changed = true;
}

const flashOld = `<div class="categories">
<a href="products.html?flashSale=true" class="cat">🔥 <span id="flashSaleLabelText">Up To 70% Off</span></a>
<a href="products.html?categoryId=consumer_electronics" class="cat">📱 Electronics Deals</a>
<a href="products.html?categoryId=clothing_fashion_apparel_men_women_kids" class="cat">👕 Fashion Sale</a>
<a href="products.html?categoryId=home_kitchen" class="cat">🏠 Home Essentials</a>
</div>`;
if (content.includes(flashOld) && !content.includes('id="flashCatsRow"')) {
  const flashNew = `<div class="scroll-row-wrapper">
<button class="scroll-arrow-btn" onclick="document.getElementById('flashCatsRow').scrollBy({left:-200,behavior:'smooth'})">‹</button>
<div class="categories" id="flashCatsRow">
<a href="products.html?flashSale=true" class="cat">🔥 <span id="flashSaleLabelText">Up To 70% Off</span></a>
<a href="products.html?categoryId=consumer_electronics" class="cat">📱 Electronics Deals</a>
<a href="products.html?categoryId=clothing_fashion_apparel_men_women_kids" class="cat">👕 Fashion Sale</a>
<a href="products.html?categoryId=home_kitchen" class="cat">🏠 Home Essentials</a>
</div>
<button class="scroll-arrow-btn" onclick="document.getElementById('flashCatsRow').scrollBy({left:200,behavior:'smooth'})">›</button>
</div>`;
  content = content.replace(flashOld, flashNew);
  changed = true;
  console.log("✅ Flash Sale row wrap হয়েছে");
} else {
  console.log("⚠️ Flash Sale anchor পাওয়া যায়নি বা আগে থেকেই wrap করা আছে");
}

const scOld = `<div class="categories special-categories-row" id="specialCatsContainer">`;
if (content.includes(scOld) && !content.includes('id="specialCatsScrollWrap"')) {
  content = content.replace(
    scOld,
    `<div class="scroll-row-wrapper" id="specialCatsScrollWrap">
<button class="scroll-arrow-btn" onclick="document.getElementById('specialCatsContainer').scrollBy({left:-200,behavior:'smooth'})">‹</button>
<div class="categories special-categories-row" id="specialCatsContainer">`
  );
  const closeAnchor = `<p style="text-align:center;color:#888">লোড হচ্ছে...</p>
        </div>
      </div>
<div class="section" id="specialCatProductSection"`;
  if (content.includes(closeAnchor)) {
    content = content.replace(
      closeAnchor,
      `<p style="text-align:center;color:#888">লোড হচ্ছে...</p>
        </div>
        <button class="scroll-arrow-btn" onclick="document.getElementById('specialCatsContainer').scrollBy({left:200,behavior:'smooth'})">›</button>
      </div>
      </div>
<div class="section" id="specialCatProductSection"`
    );
    changed = true;
    console.log("✅ Special Categories row wrap হয়েছে");
  } else {
    console.log("⚠️ Special Categories closing anchor পাওয়া যায়নি — ম্যানুয়াল চেক দরকার");
  }
} else {
  console.log("⚠️ Special Categories anchor পাওয়া যায়নি বা আগে থেকেই wrap করা আছে");
}

const dateOld = `div.innerHTML = (item.name || "").replace(/ & /g, " &<br>");`;
if (content.includes(dateOld) && !content.includes("sc-date-range")) {
  const dateNew = `let scLabel = (item.name || "").replace(/ & /g, " &<br>");
    if (item.startDate && item.endDate) {
      scLabel += \`<span class="sc-date-range">\${item.startDate} - \${item.endDate}</span>\`;
    }
    div.innerHTML = scLabel;`;
  content = content.replace(dateOld, dateNew);
  changed = true;
  console.log("✅ তারিখ রেন্ডার লজিক যোগ হয়েছে");
}

if (changed) {
  fs.writeFileSync('index.html', content, 'utf8');
  console.log("\n✅ index.html সফলভাবে প্যাচ করা হয়েছে");
} else {
  console.log("\n⚠️ কোনো পরিবর্তন হয়নি");
}
