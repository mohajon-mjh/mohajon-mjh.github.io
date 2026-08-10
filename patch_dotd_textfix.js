const fs = require('fs');
let content = fs.readFileSync('assets/js/admin.js', 'utf8');

const startMarker = 'function renderDotdList(){';
const idx = content.indexOf(startMarker);
if(idx === -1){ console.log("❌ renderDotdList পাওয়া যায়নি"); process.exit(1); }

const searchStr = 'কোনো Flash Sale ক্যাটাগরি নেই';
const searchIdx = content.indexOf(searchStr, idx);
if(searchIdx === -1){ console.log("❌ টেক্সট পাওয়া যায়নি"); process.exit(1); }

const before = content.slice(0, searchIdx);
const after = content.slice(searchIdx + searchStr.length);
content = before + 'কোনো Deals of the Day ক্যাটাগরি নেই' + after;

fs.writeFileSync('assets/js/admin.js', content, 'utf8');
console.log("✅ টেক্সট ঠিক করা হয়েছে");
