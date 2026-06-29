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

const snap = await get(ref(db, "products"));

if (!snap.exists()) {
  console.log("❌ products node is empty");
} else {
  const data = snap.val();
  console.log("✅ Total products:", Object.keys(data).length);
  console.log(JSON.stringify(Object.values(data).slice(0,3), null, 2));
}
