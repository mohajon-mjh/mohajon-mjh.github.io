import { initializeApp } from "firebase/app";
import { getDatabase, ref, get } from "firebase/database";

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

const cats = [...new Set(
  Object.values(snap.val() || {}).map(p => p.category)
)];

console.log(cats.sort());
