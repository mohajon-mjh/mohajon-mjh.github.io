import { initializeApp, cert } from "firebase-admin/app";
import { getDatabase } from "firebase-admin/database";
import { readFileSync } from "fs";

const serviceAccount = JSON.parse(readFileSync("./serviceAccountKey.json", "utf8"));

initializeApp({
  credential: cert(serviceAccount),
  databaseURL: "https://mohajon-mjh-default-rtdb.firebaseio.com"
});

const db = getDatabase();

async function run() {
  const snap = await db.ref("products").once("value");
  const data = snap.val() || {};
  const skus = Object.keys(data);

  let totalBytes = 0;
  let base64Bytes = 0;
  let base64Count = 0;
  let placeholderLikeCount = 0;
  let placeholderLikeBytes = 0;
  const base64Samples = [];

  for (const [sku, prod] of Object.entries(data)) {
    const jsonStr = JSON.stringify(prod);
    const size = Buffer.byteLength(jsonStr, "utf8");
    totalBytes += size;

    const imgStr = JSON.stringify(prod.images || {});
    if (imgStr.includes("base64")) {
      base64Bytes += size;
      base64Count++;
      if (base64Samples.length < 5) {
        base64Samples.push(`${sku} (${prod.categoryId || "?"}) - ${(size/1024).toFixed(0)}KB`);
      }
    } else {
      placeholderLikeBytes += size;
      placeholderLikeCount++;
    }
  }

  console.log(`মোট প্রোডাক্ট সংখ্যা: ${skus.length}`);
  console.log(`মোট ডেটা সাইজ: ${(totalBytes / 1024 / 1024).toFixed(2)} MB`);
  console.log(`---`);
  console.log(`Base64 ইমেজযুক্ত প্রোডাক্ট: ${base64Count} টা, সাইজ: ${(base64Bytes / 1024 / 1024).toFixed(2)} MB (${totalBytes ? ((base64Bytes/totalBytes)*100).toFixed(1) : 0}%)`);
  console.log(`Path/URL ভিত্তিক (placeholder-স্টাইল) প্রোডাক্ট: ${placeholderLikeCount} টা, সাইজ: ${(placeholderLikeBytes / 1024 / 1024).toFixed(2)} MB (${totalBytes ? ((placeholderLikeBytes/totalBytes)*100).toFixed(1) : 0}%)`);
  console.log(`---`);
  console.log("Base64 নমুনা (প্রথম ৫টা):");
  base64Samples.forEach(s => console.log(" - " + s));

  process.exit(0);
}

run().catch(e => { console.error("❌ Failed:", e.message); process.exit(1); });
