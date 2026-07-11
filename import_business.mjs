import { initializeApp, cert } from "firebase-admin/app";
import { getDatabase } from "firebase-admin/database";
import { readFileSync } from "fs";

const serviceAccount = JSON.parse(readFileSync("./serviceAccountKey.json", "utf8"));
const file1 = JSON.parse(readFileSync("./data/products-placeholder.json", "utf8"));

const toUpdate = {};
for (const [sku, prod] of Object.entries(file1)) {
  if (prod.categoryId === "business_industrial_machinery") toUpdate[sku] = prod;
}

initializeApp({
  credential: cert(serviceAccount),
  databaseURL: "https://mohajon-mjh-default-rtdb.firebaseio.com"
});

const db = getDatabase();

async function run() {
  try {
    console.log(`Writing ${Object.keys(toUpdate).length} business_industrial_machinery products to Firebase...`);
    await db.ref("products").update(toUpdate);
    console.log("✅ Business & Industrial, Machinery products written successfully.");
  } catch (e) {
    console.error("❌ Failed:", e.message);
    process.exit(1);
  }
  process.exit(0);
}

run();
