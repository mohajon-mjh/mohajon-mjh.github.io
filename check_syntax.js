const fs = require('fs');
const content = fs.readFileSync('index.html', 'utf8');
const scriptBlocks = content.match(/<script type="module">[\s\S]*?<\/script>/g) || [];
console.log('মোট script block পাওয়া গেছে:', scriptBlocks.length);
let hasError = false;
scriptBlocks.forEach((block, i) => {
  const code = block.replace(/<script type="module">/, '').replace(/<\/script>/, '');
  try {
    new Function(code.replace(/^import.*$/gm, ''));
  } catch(e) {
    console.log('⚠️ Script block #' + i + ' এ সমস্যা:', e.message);
    hasError = true;
  }
});
if (hasError === false) {
  console.log('✅ কোনো সিনট্যাক্স এরর পাওয়া যায়নি');
}
