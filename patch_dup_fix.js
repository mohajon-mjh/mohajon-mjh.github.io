const fs = require('fs');
let content = fs.readFileSync('assets/js/admin.js', 'utf8');

const dupBlock = `let trendingCache = {};
const trendingSearchInput = document.getElementById("trending-search");

`;

const firstIdx = content.indexOf(dupBlock);
if(firstIdx === -1){ console.log("❌ প্রথম কপি পাওয়া যায়নি"); process.exit(1); }

const secondIdx = content.indexOf(dupBlock, firstIdx + dupBlock.length);
if(secondIdx === -1){ console.log("❌ দ্বিতীয় (ডুপ্লিকেট) কপি পাওয়া যায়নি — হয়তো আগেই ঠিক আছে"); process.exit(1); }

content = content.slice(0, secondIdx) + content.slice(secondIdx + dupBlock.length);

fs.writeFileSync('assets/js/admin.js', content, 'utf8');
console.log("✅ ডুপ্লিকেট trendingCache/trendingSearchInput ঘোষণা সরানো হয়েছে");
