import { initializeApp, cert } from "firebase-admin/app";
import { getDatabase } from "firebase-admin/database";
import { readFileSync } from "fs";

const serviceAccount = JSON.parse(readFileSync("./serviceAccountKey.json", "utf8"));
const file = JSON.parse(readFileSync("./data/products-placeholder.json", "utf8"));

const updates = {};
let count = 0;
for (const [sku, prod] of Object.entries(file)) {
  if (prod.categoryId === "appliances_home_appliances_large_small") {
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
    console.log(`Pushing ${count} Appliances products to Firebase...`);
    await db.ref("products").update(updates);
    console.log("✅ Appliances (Home Appliances, Large & Small) updated successfully in Firebase.");
  } catch (e) {
    console.error("❌ Failed:", e.message);
    process.exit(1);
  }
  process.exit(0);
}

run();
