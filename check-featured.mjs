import { initializeApp } from "firebase/app";
import { getDatabase, ref, update, get } from "firebase/database";

const firebaseConfig = {
  apiKey: "AIzaSyDj_LLHWBgcKfQClnaOUqEtULHhP1vSVxw",
  authDomain: "mohajon-mjh.firebaseapp.com",
  databaseURL: "https://mohajon-mjh-default-rtdb.firebaseio.com",
  projectId: "mohajon-mjh",
  storageBucket: "mohajon-mjh.firebasestorage.app",
  messagingSenderId: "526105903976",
  appId: "1:526105903976:web:f9321c6d68ecbd19d58cdd"
};

const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

async function checkAndFix() {
  console.log("🔍 Fetching all products...\n");
  
  const snapshot = await get(ref(db, 'products'));
  const products = snapshot.val();
  
  const featured = [];
  const trending = [];
  
  for (const [pid, product] of Object.entries(products)) {
    if (product.isFeatured === true) {
      featured.push({
        id: pid,
        title: (product.title || 'N/A').substring(0, 30),
        startDate: product.startDate || 'NOT FOUND',
        endDate: product.endDate || 'NOT FOUND',
        price: product.price || 0
      });
    }
    if (product.isTrending === true) {
      trending.push({
        id: pid,
        title: (product.title || 'N/A').substring(0, 30),
        startDate: product.startDate || 'NOT FOUND',
        endDate: product.endDate || 'NOT FOUND',
        price: product.price || 0
      });
    }
  }
  
  console.log(`=== FEATURED PRODUCTS ===`);
  console.log(`Total: ${featured.length}\n`);
  console.log("Sample products:");
  featured.slice(0, 5).forEach(p => {
    console.log(`  ${p.title}`);
    console.log(`    startDate: ${p.startDate}`);
    console.log(`    endDate: ${p.endDate}`);
    console.log(`    price: ${p.price}`);
    console.log();
  });
  
  const featWithDates = featured.filter(p => p.startDate !== 'NOT FOUND').length;
  const featWithoutDates = featured.length - featWithDates;
  console.log(`With dates: ${featWithDates}/${featured.length}`);
  console.log(`Without dates: ${featWithoutDates}/${featured.length}\n`);
  
  console.log(`=== TRENDING PRODUCTS ===`);
  console.log(`Total: ${trending.length}`);
  const trendWithDates = trending.filter(p => p.startDate !== 'NOT FOUND').length;
  console.log(`With dates: ${trendWithDates}/${trending.length}\n`);
  
  // If Featured products don't have dates, add them
  if (featWithoutDates > 0) {
    console.log("💾 Adding dates to Featured products...");
    const updates = {};
    featured.forEach(p => {
      if (p.startDate === 'NOT FOUND') {
        updates[`products/${p.id}/startDate`] = "8-8-2026";
        updates[`products/${p.id}/endDate`] = "12-8-2026";
      }
    });
    await update(ref(db), updates);
    console.log(`✅ Added dates to ${featWithoutDates} Featured products`);
  }
  
  process.exit(0);
}

checkAndFix().catch(err => {
  console.error("❌ Error:", err);
  process.exit(1);
});
