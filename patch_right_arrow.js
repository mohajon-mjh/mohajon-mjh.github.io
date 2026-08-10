const fs = require('fs');
let content = fs.readFileSync('index.html', 'utf8');

const oldBlock = `<div class="categories special-categories-row" id="specialCatsContainer">
<p style="text-align:center;color:#888">লোড হচ্ছে...</p>
</div>
</div>
<div class="section" id="specialCatProductSection" style="display:none">`;

const newBlock = `<div class="categories special-categories-row" id="specialCatsContainer">
<p style="text-align:center;color:#888">লোড হচ্ছে...</p>
</div>
<button class="scroll-arrow-btn" onclick="document.getElementById('specialCatsContainer').scrollBy({left:200,behavior:'smooth'})">›</button>
</div>
<div class="section" id="specialCatProductSection" style="display:none">`;

if (content.includes(oldBlock)) {
  content = content.replace(oldBlock, newBlock);
  fs.writeFileSync('index.html', content, 'utf8');
  console.log("✅ ডান পাশের arrow বাটন বসানো হয়েছে");
} else {
  console.log("❌ মিলছে না — ম্যানুয়াল চেক দরকার");
}
