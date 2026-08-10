const fs = require('fs');
let content = fs.readFileSync('assets/js/admin.js', 'utf8');

const target = "\nsetupFscSearch();";
const count = content.split(target).length - 1;

if (count !== 1) {
  console.log(`❌ প্রত্যাশিত ১টি মিলেছে, পাওয়া গেছে ${count}টি — ম্যানুয়াল চেক দরকার`);
  process.exit(1);
}

content = content.replace(target, "");
fs.writeFileSync('assets/js/admin.js', content, 'utf8');
console.log("✅ orphan setupFscSearch(); কল মুছে ফেলা হয়েছে");
