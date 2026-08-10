const API_KEY = "AIzaSyDj_LLHWBgcKfQClnaOUqEtULHhP1vSVxw";
const DB_URL = "https://mohajon-mjh-default-rtdb.firebaseio.com";
const ADMIN_EMAIL = "mohajonmjh@gmail.com";
const ADMIN_PASSWORD = "Mjh@Mohajon$1975";

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

async function putWithRetry(url, body, retries = 4) {
  for (let i = 0; i < retries; i++) {
    try {
      const res = await fetch(url, {
        method: "PUT", headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body)
      });
      if (!res.ok) {
        const errBody = await res.text();
        throw new Error("HTTP " + res.status + " " + errBody);
      }
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

  const mapping = {}; // { catId: { pid: {discountPercent, addedAt} } }
  mapping[upToOffId] = {};
  mapping[specialOffersId] = {};
  mapping[electronicsId] = {};
  mapping[fashionId] = {};
  mapping[homeId] = {};

  let tagged = 0;
  for (const [pid, p] of Object.entries(products)) {
    if (p.status !== "active") continue;
    if (p.isFlashSale === true) {
      const effectiveDiscount = (p.discountPercent && p.discountPercent > 0) ? p.discountPercent : globalDiscount;
      mapping[upToOffId][pid] = { discountPercent: effectiveDiscount, addedAt: Date.now() };
      tagged++;
    } else if (p.categoryId === "lighting_lamps") {
      mapping[specialOffersId][pid] = { discountPercent: p.discountPercent || 0, addedAt: Date.now() };
      tagged++;
    } else if (p.categoryId === "consumer_electronics") {
      mapping[electronicsId][pid] = { discountPercent: p.discountPercent || 0, addedAt: Date.now() };
      tagged++;
    } else if (p.categoryId === "clothing_fashion_apparel_men_women_kids") {
      mapping[fashionId][pid] = { discountPercent: p.discountPercent || 0, addedAt: Date.now() };
      tagged++;
    } else if (p.categoryId === "home_kitchen") {
      mapping[homeId][pid] = { discountPercent: p.discountPercent || 0, addedAt: Date.now() };
      tagged++;
    }
  }

  console.log(`ম্যাপিং তৈরি হয়েছে: ${tagged}টি প্রোডাক্ট, এখন Firebase এ লেখা হচ্ছে...\n`);

  for (const [catId, prods] of Object.entries(mapping)) {
    const count = Object.keys(prods).length;
    if (count === 0) { console.log(`⚠️ ${catId}: কোনো প্রোডাক্ট নেই, স্কিপ`); continue; }
    await putWithRetry(`${DB_URL}/settings/flashSaleCategoryProducts/${catId}.json?auth=${idToken}`, prods);
    console.log(`✅ ${catId}: ${count}টি প্রোডাক্ট ম্যাপ হয়েছে`);
  }

  console.log(`\n✅✅ Migration সম্পন্ন! মোট ট্যাগ: ${tagged}`);
}

main().catch(err => { console.error("❌ ব্যর্থ:", err.message); process.exit(1); });
