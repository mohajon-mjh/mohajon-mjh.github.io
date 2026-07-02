import { initializeApp } from "firebase/app";
import { getDatabase, ref, get } from "firebase/database";

const firebaseConfig = {
  apiKey: "AIzaSyDj_LLHWBgKcQClnaOUqEtULHhP1vSVxw",
  authDomain: "mohajon-mjh.firebaseapp.com",
  databaseURL: "https://mohajon-mjh-default-rtdb.firebaseio.com",
  projectId: "mohajon-mjh",
  storageBucket: "mohajon-mjh.firebasestorage.app",
  messagingSenderId: "526105903976",
  appId: "1:526105903976:web:f9321c6d68ecbd19d58cdd"
};

const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

for (const path of ["categories", "admins", "products", "sellers", "users"]) {
  try {
    const snap = await get(ref(db, path));
    if (!snap.exists()) {
      console.log(`❌ /${path} : EMPTY or NOT FOUND`);
    } else {
      const data = snap.val();
      const keys = Object.keys(data);
      console.log(`✅ /${path} : ${keys.length} entries`);
      console.log(`   keys: ${keys.slice(0, 5).join(", ")}${keys.length > 5 ? " ..." : ""}`);
    }
  } catch (e) {
    console.log(`⚠️ /${path} : ERROR - ${e.message}`);
  }
}
process.exit(0);
