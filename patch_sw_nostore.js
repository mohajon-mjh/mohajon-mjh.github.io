const fs = require('fs');
let content = fs.readFileSync('sw.js', 'utf8');

const oldStr = `  if (req.mode === 'navigate' || (req.method === 'GET' && req.headers.get('accept')?.includes('text/html'))) {
    e.respondWith(
      fetch(req)
        .then(res => {`;

const newStr = `  if (req.mode === 'navigate' || (req.method === 'GET' && req.headers.get('accept')?.includes('text/html'))) {
    e.respondWith(
      fetch(req, { cache: 'no-store' })
        .then(res => {`;

if(!content.includes(oldStr)){
  console.log("❌ মিলছে না");
  process.exit(1);
}
content = content.replace(oldStr, newStr);

const match = content.match(/const CACHE = '([^']+)';/);
const CACHE_OLD = match[1];
const CACHE_NEW = 'mjh-v83';
content = content.replace("const CACHE = '" + CACHE_OLD + "';", "const CACHE = '" + CACHE_NEW + "';");

fs.writeFileSync('sw.js', content, 'utf8');
console.log("✅ HTML নেভিগেশনে cache:'no-store' যোগ হয়েছে, CACHE ভার্সন " + CACHE_OLD + " → " + CACHE_NEW);
