const API_KEY = "AIzaSyDj_LLHWBgcKfQClnaOUqEtULHhP1vSVxw";
const DB_URL = "https://mohajon-mjh-default-rtdb.firebaseio.com";
const ADMIN_EMAIL = "mohajonmjh@gmail.com";
const ADMIN_PASSWORD = "Mjh@Mohajon$1975";

// আগের রানে পাওয়া ID গুলো
const upToOffId = "-Oz5ePYGrPWPxzzbVCGp";
const specialOffersId = "-Oz5ePb9be5LoIXpuqW-";
const electronicsId = "-Oz5ePeynKEQlk3sJOZ4";
const fashionId = "-Oz5ePiehQjnZA_w6739";
const homeId = "-Oz5ePmT4ClEb7UsimcY";

async function loginAdmin() {
  const res = await fetch(`https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${API_KEY}`, {
    method: "POST", headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email: ADMIN_EMAIL, password: ADMIN_PASSWORD, returnSecureToken: true })
  });
  const data = await res.json();
  if (!data.idToken) throw new Error("Login failed: " + JSON.stringify(data));
  return data.idToken;
}

async function patchWithRetry(url, body, retries = 4) {
  for (let i = 0; i < retries; i++) {
    try {
      const res = await fetch(url, {
        method: "PATCH", headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body)
      });
      if (!res.ok) throw new Error("HTTP " + res.status);
      return await res.json();
    } catch (err) {
      console.log(`  ⚠️ চেষ্টা ${i+1} ব্যর্থ: ${err.message}`);
      if (i === retries - 1) throw err;
      await new Promise(r => setTimeout(r, 1500));
    }
  }
}

async function main() {
  const idToken = await loginAdmin();
  console.log("লগইন সফল ✅\n");

  const globalDiscRes = await fetch(`${DB_URL}/settings/flashSaleGlobalDiscount.json?auth=${idToken}`);
  const globalDiscount = (await globalDiscRes.json()) || 0;

  const prodRes = await fetch(`${DB_URL}/products.json?auth=${idToken}`);
  const products = (await prodRes.json()) || {};
  console.log(`মোট প্রোডাক্ট: ${Object.keys(products).length}টি\n`);

  const toTag = [];
  for (const [pid, p] of Object.entries(products)) {
    if (p.status !== "active") continue;
    if (p.isFlashSale === true) {
      const effectiveDiscount = (p.discountPercent && p.discountPercent > 0) ? p.discountPercent : globalDiscount;
      toTag.push([pid, upToOffId, effectiveDiscount]);
    } else if (p.categoryId === "lighting_lamps") {
      toTag.push([pid, specialOffersId, p.discountPercent || 0]);
    } else if (p.categoryId === "consumer_electronics") {
      toTag.push([pid, electronicsId, p.discountPercent || 0]);
    } else if (p.categoryId === "clothing_fashion_apparel_men_women_kids") {
      toTag.push([pid, fashionId, p.discountPercent || 0]);
    } else if (p.categoryId === "home_kitchen") {
      toTag.push([pid, homeId, p.discountPercent || 0]);
    }
  }

  console.log(`ট্যাগ করতে হবে: ${toTag.length}টি প্রোডাক্ট, ব্যাচে ব্যাচে করা হচ্ছে...\n`);

  const BATCH_SIZE = 50;
  let done = 0;
  for (let i = 0; i < toTag.length; i += BATCH_SIZE) {
    const batch = toTag.slice(i, i + BATCH_SIZE);
    const updates = {};
    for (const [pid, catId, discount] of batch) {
      updates[`products/${pid}/flashCategoryId`] = catId;
      updates[`products/${pid}/discountPercent`] = discount;
    }
    await patchWithRetry(`${DB_URL}.json?auth=${idToken}`, updates);
    done += batch.length;
    console.log(`✅ ব্যাচ সম্পন্ন: ${done}/${toTag.length}`);
  }

  console.log(`\n✅✅ সব ট্যাগিং সম্পন্ন হয়েছে! মোট: ${done}টি`);
}

main().catch(err => { console.error("❌ ব্যর্থ:", err.message); process.exit(1); });
