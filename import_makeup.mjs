import { initializeApp, cert } from "firebase-admin/app";
import { getDatabase } from "firebase-admin/database";
import { readFileSync } from "fs";

const serviceAccount = JSON.parse(readFileSync("./serviceAccountKey.json", "utf8"));

const files = [
  "./data/products-placeholder.json",
  "./data/products-placeholder-batch3.json",
];

const updates = {};
let count = 0;

for (const filePath of files) {
  const fileData = JSON.parse(readFileSync(filePath, "utf8"));
  for (const [sku, prod] of Object.entries(fileData)) {
    if (prod.categoryId === "makeup_skincare_fragrance") {
      updates[sku] = prod;
      count++;
    }
  }
}

initializeApp({
  credential: cert(serviceAccount),
  databaseURL: "https://mohajon-mjh-default-rtdb.firebaseio.com"
});

const db = getDatabase();

async function run() {
  try {
    console.log(`Pushing ${count} Makeup, Skincare & Fragrance products to Firebase...`);
    await db.ref("products").update(updates);
    console.log("✅ Makeup, Skincare & Fragrance updated successfully in Firebase.");
  } catch (e) {
    console.error("❌ Failed:", e.message);
    process.exit(1);
  }
  process.exit(0);
}

run();
