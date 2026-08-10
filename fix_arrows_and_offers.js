const fs = require('fs');
const lines = fs.readFileSync('index.html', 'utf8').split('\n');

// ===== অংশ ১: Flash Sale সারি (লাইন 701-712, 1-indexed => index 700-711) =====
// বর্তমান লাইন 701-712 (index 700-711):
// 700: <div class="scroll-row-wrapper">
// 701: <button ... ‹ ...>
// 702: <div class="categories" id="flashCatsRow">
// 703: Up To 70% Off link
// 704: Electronics Deals link
// 705: Fashion Sale link
// 706: Home Essentials link
// 707: </div>
// 708: <button ... › ...>
// 709: </div>

const flashStart = lines.findIndex(l => l.includes('<div class="scroll-row-wrapper">') && !l.includes('id='));
if (flashStart === -1) {
  console.log("❌ Flash Sale scroll-row-wrapper পাওয়া যায়নি");
  process.exit(1);
}

// নিশ্চিত হওয়া এটাই সঠিক ব্লক (পরের লাইনে flashCatsRow আছে কিনা)
let flashEnd = -1;
for (let i = flashStart; i < flashStart + 15; i++) {
  if (lines[i].includes("scrollBy({left:200") && lines[i].includes("flashCatsRow")) {
    flashEnd = i;
    break;
  }
}
if (flashEnd === -1) {
  console.log("❌ Flash Sale ব্লকের শেষ খুঁজে পাওয়া যায়নি");
  process.exit(1);
}
// flashEnd এর পরের লাইনটা </div> (wrapper বন্ধ) হওয়া উচিত
const flashWrapperCloseIdx = flashEnd + 1;
if (lines[flashWrapperCloseIdx].trim() !== '</div>') {
  console.log("❌ Flash Sale wrapper closing div পাওয়া যায়নি, পাওয়া গেছে:", JSON.stringify(lines[flashWrapperCloseIdx]));
  process.exit(1);
}

const newFlashBlock = [
  '<div class="categories" id="flashCatsRow">',
  '<a href="products.html?flashSale=true" class="cat">🔥 <span id="flashSaleLabelText">Up To 70% Off</span></a>',
  '<a href="products.html?categoryId=lighting_lamps" class="cat">🎉 Special Offers<br>for One Week</a>',
  '<a href="products.html?categoryId=consumer_electronics" class="cat">📱 Electronics Deals</a>',
  '<a href="products.html?categoryId=clothing_fashion_apparel_men_women_kids" class="cat">👕 Fashion Sale</a>',
  '<a href="products.html?categoryId=home_kitchen" class="cat">🏠 Home Essentials</a>',
  '</div>'
];

// flashStart থেকে flashWrapperCloseIdx পর্যন্ত পুরো ব্লক (wrapper + buttons সহ) রিপ্লেস করব শুধু plain categories div দিয়ে
lines.splice(flashStart, flashWrapperCloseIdx - flashStart + 1, ...newFlashBlock);

console.log("✅ Flash Sale ব্লক ঠিক হয়েছে (তীর সরানো + Special Offers যোগ)");

// ===== অংশ ২: Special Categories সারি =====
// এই পর্যায়ে লাইন নাম্বার শিফট হয়ে গেছে flash block পরিবর্তনের কারণে, তাই আবার id দিয়ে খুঁজব
const scWrapStart = lines.findIndex(l => l.includes('id="specialCatsScrollWrap"'));
if (scWrapStart === -1) {
  console.log("❌ specialCatsScrollWrap পাওয়া যায়নি");
  fs.writeFileSync('index.html', lines.join('\n'), 'utf8');
  console.log("⚠️ শুধু Flash Sale অংশ সেভ করা হলো, Special Categories অংশ ম্যানুয়াল চেক দরকার");
  process.exit(0);
}

// scWrapStart থেকে খুঁজব containerStart, leftBtn, rightBtn, wrapperClose
let leftBtnIdx = -1, containerStart = -1, containerEnd = -1, rightBtnIdx = -1, wrapperCloseIdx = -1;
for (let i = scWrapStart; i < scWrapStart + 15; i++) {
  if (lines[i].includes("scrollBy({left:-200") && lines[i].includes("specialCatsContainer")) leftBtnIdx = i;
  if (lines[i].includes('id="specialCatsContainer"')) containerStart = i;
  if (lines[i].includes("scrollBy({left:200") && lines[i].includes("specialCatsContainer")) rightBtnIdx = i;
}
// containerEnd: containerStart এর পরের প্রথম </div>
for (let i = containerStart + 1; i < containerStart + 10; i++) {
  if (lines[i].trim() === '</div>') { containerEnd = i; break; }
}
// wrapperCloseIdx: rightBtnIdx এর পরের প্রথম non-empty অথবা </div>
for (let i = rightBtnIdx + 1; i < rightBtnIdx + 5; i++) {
  if (lines[i].trim() === '</div>') { wrapperCloseIdx = i; break; }
}

if (leftBtnIdx === -1 || containerStart === -1 || containerEnd === -1 || rightBtnIdx === -1 || wrapperCloseIdx === -1) {
  console.log("❌ Special Categories ব্লকের সব অংশ খুঁজে পাওয়া যায়নি — ম্যানুয়াল চেক দরকার");
  console.log({leftBtnIdx, containerStart, containerEnd, rightBtnIdx, wrapperCloseIdx});
  fs.writeFileSync('index.html', lines.join('\n'), 'utf8');
  process.exit(0);
}

// নতুন ব্লক: শুধু plain div (wrapper, arrow বাটন ছাড়া), containerStart থেকে containerEnd এর কনটেন্ট রেখে বাকি সব সরাবো
const containerLine = lines[containerStart]; // <div class="categories special-categories-row" id="specialCatsContainer">
const innerLines = lines.slice(containerStart + 1, containerEnd); // ভিতরের কনটেন্ট (p ট্যাগ ইত্যাদি)

const newScBlock = [containerLine, ...innerLines, '</div>'];

lines.splice(scWrapStart, wrapperCloseIdx - scWrapStart + 1, ...newScBlock);

fs.writeFileSync('index.html', lines.join('\n'), 'utf8');
console.log("✅ Special Categories ব্লক ঠিক হয়েছে (তীর সরানো, plain swipe row)");
