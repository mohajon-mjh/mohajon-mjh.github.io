import { initializeApp, cert } from "firebase-admin/app";
import { getDatabase } from "firebase-admin/database";
import { readFileSync } from "fs";

const serviceAccount = JSON.parse(readFileSync("./serviceAccountKey.json", "utf8"));
const CATEGORIES = JSON.parse(readFileSync("./data/categories.json", "utf8"));
const PRODUCTS = JSON.parse(readFileSync("./data/products.json", "utf8"));

initializeApp({
  credential: cert(serviceAccount),
  databaseURL: "https://mohajon-mjh-default-rtdb.firebaseio.com"
});

const db = getDatabase();

async function run() {
  try {
    console.log(`Writing ${Object.keys(CATEGORIES).length} categories...`);
    await db.ref("categories").update(CATEGORIES);
    console.log("✅ Categories written successfully.");
  } catch (e) {
    console.error("❌ Categories import failed:", e.message);
    process.exit(1);
  }

  try {
    console.log(`Writing ${Object.keys(PRODUCTS).length} products...`);
    await db.ref("products").update(PRODUCTS);
    console.log("✅ Products written successfully.");
  } catch (e) {
    console.error("❌ Products import failed:", e.message);
    process.exit(1);
  }

  console.log("🎉 Import complete.");
  process.exit(0);
}

run();
