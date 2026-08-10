const fs = require('fs');
let content = fs.readFileSync('assets/js/admin.js', 'utf8');
const before = content;
content = content.replace('const flashSaleDiv = document.getElementById("flash-sale-manager");\n', '');
if (content !== before) {
  fs.writeFileSync('assets/js/admin.js', content, 'utf8');
  console.log("✅ leftover ভ্যারিয়েবল সরানো হয়েছে");
} else {
  console.log("⚠️ পাওয়া যায়নি, স্কিপ করা হলো");
}
