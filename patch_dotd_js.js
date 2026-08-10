const fs = require('fs');
let content = fs.readFileSync('assets/js/admin.js', 'utf8');

const startMarker = '/* ===================== FLASH SALE CATEGORY MANAGER (v2) ===================== */';
const endMarker = '/* ===================== TRENDING PRODUCTS MANAGER ===================== */';

const startIdx = content.indexOf(startMarker);
if(startIdx === -1){ console.log("❌ startMarker পাওয়া যায়নি"); process.exit(1); }

const endIdx = content.indexOf(endMarker, startIdx);
if(endIdx === -1){ console.log("❌ endMarker পাওয়া যায়নি"); process.exit(1); }

const flashSaleBlock = content.slice(startIdx, endIdx);

let dotdBlock = flashSaleBlock;

dotdBlock = dotdBlock.replace(
  '/* ===================== FLASH SALE CATEGORY MANAGER (v2) ===================== */',
  '/* ===================== DEALS OF THE DAY CATEGORY MANAGER ===================== */'
);

dotdBlock = dotdBlock.replace(/settings\/flashSaleCategoryProducts/g, 'settings/dealsOfDayCategoryProducts');
dotdBlock = dotdBlock.replace(/settings\/flashSaleCategories/g, 'settings/dealsOfDayCategories');

dotdBlock = dotdBlock.replace(/fsc-/g, 'dotd-');

const renameMap = [
  ['fscCategoriesCache', 'dotdCategoriesCache'],
  ['fscSelectedCatId', 'dotdSelectedCatId'],
  ['fscSelectedCatProducts', 'dotdSelectedCatProducts'],
  ['fscCurrentSubview', 'dotdCurrentSubview'],
  ['fscSelectedIds', 'dotdSelectedIds'],
  ['fscUpdateCategoryMaxDiscount', 'dotdUpdateCategoryMaxDiscount'],
  ['loadFlashSaleCategories', 'loadDealsOfDayCategories'],
  ['renderFscList', 'renderDotdList'],
  ['selectFscCategory', 'selectDotdCategory'],
  ['setupFscNav', 'setupDotdNav'],
  ['switchFscSubview', 'switchDotdSubview'],
  ['fscFormatPriceRow', 'dotdFormatPriceRow'],
  ['fscBuildProductCard', 'dotdBuildProductCard'],
  ['setupFscToolbar', 'setupDotdToolbar'],
  ['renderFscOwnCatView', 'renderDotdOwnCatView'],
  ['renderFscAllProductsView', 'renderDotdAllProductsView'],
  ['renderFscSearchView', 'renderDotdSearchView'],
  ['setupFscAddSection', 'setupDotdAddSection'],
  ['fscFilenameToTitle', 'dotdFilenameToTitle'],
  ['renderFscAddList', 'renderDotdAddList']
];

renameMap.forEach(([oldName, newName]) => {
  const re = new RegExp('\\b' + oldName + '\\b', 'g');
  dotdBlock = dotdBlock.replace(re, newName);
});

const oldCall = `  loadFlashSaleCategories();`;
const newCall = `  loadFlashSaleCategories();
  loadDealsOfDayCategories();`;

if(!content.includes(oldCall)){
  console.log("❌ loadFlashSaleCategories() কল মিলছে না");
  process.exit(1);
}
content = content.replace(oldCall, newCall);
console.log("✅ (১) onAuthStateChanged এ loadDealsOfDayCategories() কল যোগ হয়েছে");

content = content.replace(flashSaleBlock, flashSaleBlock + '\n' + dotdBlock);
console.log("✅ (২) Deals of the Day JS ব্লক (dotd প্রিফিক্স) flashsale ব্লকের পরে বসানো হয়েছে");

fs.writeFileSync('assets/js/admin.js', content, 'utf8');
console.log("✅ সব প্যাচ সম্পন্ন");
