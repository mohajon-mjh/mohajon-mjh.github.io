const fs = require('fs');
const lines = fs.readFileSync('index.html', 'utf8').split('\n');

// লাইন 1309 (1-indexed) = index 1308 (0-indexed) -> এর পরে insert করব
const insertAfterIndex = 1308; // line 1309
const targetLine = lines[insertAfterIndex];

if (targetLine.trim() !== '</div>') {
  console.log("❌ লাইন 1309 এ যা আশা করেছিলাম তা নেই। পাওয়া গেছে:", JSON.stringify(targetLine));
  process.exit(1);
}

const newLine = `<button class="scroll-arrow-btn" onclick="document.getElementById('specialCatsContainer').scrollBy({left:200,behavior:'smooth'})">\u203a</button>`;

lines.splice(insertAfterIndex + 1, 0, newLine);
fs.writeFileSync('index.html', lines.join('\n'), 'utf8');
console.log("✅ ডান পাশের arrow বাটন লাইন 1310 এ বসানো হয়েছে");
