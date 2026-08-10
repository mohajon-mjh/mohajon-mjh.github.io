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

async function addDates() {
  console.log("🔍 Scanning products...");
  
  const snapshot = await get(ref(db, 'products'));
  const products = snapshot.val();
  
  const updates = {};
  let featuredCount = 0;
  let trendingCount = 0;
  
  for (const [pid, product] of Object.entries(products)) {
    // Featured products
    if (product.isFeatured === true && !product.startDate) {
      updates[`products/${pid}/startDate`] = "8-8-2026";
      updates[`products/${pid}/endDate`] = "12-8-2026";
      featuredCount++;
    }
    
    // Trending products (যদি না থাকে)
    if (product.isTrending === true && !product.startDate) {
      updates[`products/${pid}/startDate`] = "8-8-2026";
      updates[`products/${pid}/endDate`] = "12-8-2026";
      trendingCount++;
    }
  }
  
  console.log(`Found: ${featuredCount} Featured, ${trendingCount} Trending without dates`);
  
  if (Object.keys(updates).length > 0) {
    console.log("💾 Updating Firebase...");
    await update(ref(db), updates);
    console.log(`✅ Done! Added dates to ${featuredCount} Featured + ${trendingCount} Trending products`);
  } else {
    console.log("ℹ️ All products already have dates");
  }
  
  process.exit(0);
}

addDates().catch(err => {
  console.error("❌ Error:", err);
  process.exit(1);
});
