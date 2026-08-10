const fs = require('fs');
let html = fs.readFileSync('admin.html', 'utf8');

const oldStr = `<script type="module" src="assets/js/admin.js"></script>`;
const newStr = `<script type="module" src="assets/js/admin.js?v=20260804a"></script>`;

if(!html.includes(oldStr)){
  console.log("❌ মিলছে না");
  process.exit(1);
}
html = html.replace(oldStr, newStr);
fs.writeFileSync('admin.html', html, 'utf8');
console.log("✅ Cache-busting ভার্সন যোগ করা হয়েছে");
