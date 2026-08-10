const API_KEY = "AIzaSyDj_LLHWBgcKfQClnaOUqEtULHhP1vSVxw";
const DB_URL = "https://mohajon-mjh-default-rtdb.firebaseio.com";
const ADMIN_EMAIL = "mohajonmjh@gmail.com";
const ADMIN_PASSWORD = "Mjh@Mohajon$1975";

async function loginAdmin() {
  const res = await fetch(`https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${API_KEY}`, {
    method: "POST", headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email: ADMIN_EMAIL, password: ADMIN_PASSWORD, returnSecureToken: true })
  });
  const data = await res.json();
  if (!data.idToken) throw new Error("Login failed: " + JSON.stringify(data));
  return data.idToken;
}

async function main() {
  const idToken = await loginAdmin();
  console.log("লগইন সফল ✅\n");

  // ১. বর্তমান settings পড়া
  const labelRes = await fetch(`${DB_URL}/settings/flashSaleLabel.json?auth=${idToken}`);
  const currentLabel = (await labelRes.json()) || "Up To 70% Off";

  const globalDiscRes = await fetch(`${DB_URL}/settings/flashSaleGlobalDiscount.json?auth=${idToken}`);
  const globalDiscount = (await globalDiscRes.json()) || 0;

  // Special Offers এর তারিখ (আগে বসানো ছিল)
  const scRes = await fetch(`${DB_URL}/settings/specialCategories.json?auth=${idToken}`);
  const scData = (await scRes.json()) || {};
  let offerStart = "08-08-2026", offerEnd = "15-08-2026";
  Object.values(scData).forEach(item => {
    if (item.slug === "lighting_lamps") {
      offerStart = item.startDate || offerStart;
      offerEnd = item.endDate || offerEnd;
    }
  });

  // ২. নতুন ৫টা ক্যাটাগরি বানানো
  const categories = [
    { name: "🔥 " + currentLabel, order: 0, startDate: "", endDate: "" },
    { name: "🎉 Special Offers\nfor One Week", order: 1, startDate: offerStart, endDate: offerEnd },
    { name: "📱 Electronics Deals", order: 2, startDate: "", endDate: "" },
    { name: "👕 Fashion Sale", order: 3, startDate: "", endDate: "" },
    { name: "🏠 Home Essentials", order: 4, startDate: "", endDate: "" }
  ];

  const catIds = [];
  for (const cat of categories) {
    const res = await fetch(`${DB_URL}/settings/flashSaleCategories.json?auth=${idToken}`, {
      method: "POST", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...cat, createdAt: Date.now() })
    });
    const data = await res.json();
    catIds.push(data.name); // firebase push id
    console.log(`✅ ক্যাটাগরি তৈরি: ${cat.name.replace(/\n/g," ")} (${data.name})`);
  }
  const [upToOffId, specialOffersId, electronicsId, fashionId, homeId] = catIds;

  // ৩. সব প্রোডাক্ট আনা
  const prodRes = await fetch(`${DB_URL}/products.json?auth=${idToken}`);
  const products = (await prodRes.json()) || {};
  console.log(`\nমোট প্রোডাক্ট: ${Object.keys(products).length}টি\n`);

  let tagged = 0;
  const updates = {};

  for (const [pid, p] of Object.entries(products)) {
    if (p.status !== "active") continue;

    // Up To X% Off => isFlashSale===true ছিল যেগুলো
    if (p.isFlashSale === true) {
      const effectiveDiscount = (p.discountPercent && p.discountPercent > 0) ? p.discountPercent : globalDiscount;
      updates[`products/${pid}/flashCategoryId`] = upToOffId;
      updates[`products/${pid}/discountPercent`] = effectiveDiscount;
      tagged++;
    }
    // Special Offers => categoryId lighting_lamps
    else if (p.categoryId === "lighting_lamps") {
      updates[`products/${pid}/flashCategoryId`] = specialOffersId;
      tagged++;
    }
    // Electronics Deals
    else if (p.categoryId === "consumer_electronics") {
      updates[`products/${pid}/flashCategoryId`] = electronicsId;
      tagged++;
    }
    // Fashion Sale
    else if (p.categoryId === "clothing_fashion_apparel_men_women_kids") {
      updates[`products/${pid}/flashCategoryId`] = fashionId;
      tagged++;
    }
    // Home Essentials
    else if (p.categoryId === "home_kitchen") {
      updates[`products/${pid}/flashCategoryId`] = homeId;
      tagged++;
    }
  }

  console.log(`ট্যাগ করা হচ্ছে: ${tagged}টি প্রোডাক্ট...`);
  await fetch(`${DB_URL}.json?auth=${idToken}`, {
    method: "PATCH", headers: { "Content-Type": "application/json" },
    body: JSON.stringify(updates)
  });

  console.log(`\n✅ Migration সম্পন্ন!`);
  console.log(`Up To Off ID: ${upToOffId}`);
  console.log(`Special Offers ID: ${specialOffersId}`);
  console.log(`Electronics ID: ${electronicsId}`);
  console.log(`Fashion ID: ${fashionId}`);
  console.log(`Home ID: ${homeId}`);
}

main().catch(err => { console.error("❌ ব্যর্থ:", err.message); process.exit(1); });
