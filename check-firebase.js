import { initializeApp } from "firebase/app";
import { getDatabase, ref, get, child } from "firebase/database";

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

async function check(){
  const snap = await get(child(ref(db), "categories"));

  if(!snap.exists()){
    console.log("❌ categories NOT found");
    return;
  }

  const data = snap.val();

  console.log("✅ categories found:");
  console.log(Object.keys(data));

  if(data.grocery){
    console.log("🔥 Grocery EXISTS:");
    console.log(data.grocery);
  } else {
    console.log("❌ Grocery NOT found");
  }
}

check();
