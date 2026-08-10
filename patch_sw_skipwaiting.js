const fs = require('fs');
let content = fs.readFileSync('sw.js', 'utf8');

if (!content.includes("message")) {
  content = content.replace(
    "self.addEventListener('install',",
    `self.addEventListener('message', e => {
  if (e.data && e.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});

self.addEventListener('install',`
  );
  fs.writeFileSync('sw.js', content, 'utf8');
  console.log("✅ sw.js এ SKIP_WAITING হ্যান্ডলার যোগ হয়েছে");
} else {
  console.log("⚠️ ইতিমধ্যে message listener আছে বা anchor মিলছে না");
}
