import { initializeApp, cert } from "firebase-admin/app";
import { getDatabase } from "firebase-admin/database";
import { readFileSync } from "fs";

const serviceAccount = JSON.parse(readFileSync("./serviceAccountKey.json", "utf8"));
const BATCH3 = JSON.parse(readFileSync("./data/products-placeholder-batch3.json", "utf8"));

initializeApp({
  credential: cert(serviceAccount),
  databaseURL: "https://mohajon-mjh-default-rtdb.firebaseio.com"
});

const db = getDatabase();

async function run() {
  try {
    console.log(`Writing ${Object.keys(BATCH3).length} new placeholder products...`);
    await db.ref("products").update(BATCH3);
    console.log("✅ Batch 3 placeholder products written successfully.");
  } catch (e) {
    console.error("❌ Failed:", e.message);
    process.exit(1);
  }
  process.exit(0);
}

run();
