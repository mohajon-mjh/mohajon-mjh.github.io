import { initializeApp } from "firebase/app";
import { getDatabase, ref, get, update } from "firebase/database";

const app = initializeApp({
  apiKey:"AIzaSyDj_LLHWBgKcQClnaOUqEtULHhP1vSVxw",
  authDomain:"mohajon-mjh.firebaseapp.com",
  databaseURL:"https://mohajon-mjh-default-rtdb.firebaseio.com",
  projectId:"mohajon-mjh",
  storageBucket:"mohajon-mjh.firebasestorage.app",
  messagingSenderId:"526105903976",
  appId:"1:526105903976:web:f9321c6d68ecbd19d58cdd"
});

const db = getDatabase(app);
const snap = await get(ref(db,"products"));

if (!snap.exists()) {
  console.log("No products found.");
  process.exit(0);
}

const data = snap.val();
const updates = {};
let count = 0;

for (const [id, p] of Object.entries(data)) {
  if ((p.category || "") === "Spices") {
    updates[`products/${id}/category`] = "Food & Grocery";
    count++;
  }
}

if (count === 0) {
  console.log("No Spices products found.");
  process.exit(0);
}

await update(ref(db), updates);

console.log(`✅ Updated ${count} products to "Food & Grocery"`);
