import { initializeApp, cert } from "firebase-admin/app";
import { getDatabase } from "firebase-admin/database";
import { readFileSync } from "fs";

const serviceAccount = JSON.parse(readFileSync("./serviceAccountKey.json", "utf8"));
const file3 = JSON.parse(readFileSync("./data/products-placeholder-batch3.json", "utf8"));

const updates = {};

// Remove wrongly created duplicate SKUs (p7661 - p7816)
for (let i = 7661; i <= 7816; i++) {
  const sku = "p" + String(i).padStart(4, "0");
  updates[sku] = null; // null deletes the key in Firebase
}

// Push correct updated entries from batch3
let count = 0;
for (const [sku, prod] of Object.entries(file3)) {
  if (prod.categoryId === "luggage_bags_cases") {
    updates[sku] = prod;
    count++;
  }
}

initializeApp({
  credential: cert(serviceAccount),
  databaseURL: "https://mohajon-mjh-default-rtdb.firebaseio.com"
});

const db = getDatabase();

async function run() {
  try {
    console.log(`Deleting 156 duplicate SKUs and updating ${count} correct luggage_bags_cases products...`);
    await db.ref("products").update(updates);
    console.log("✅ Luggage, Bags & Cases fixed successfully in Firebase.");
  } catch (e) {
    console.error("❌ Failed:", e.message);
    process.exit(1);
  }
  process.exit(0);
}

run();
