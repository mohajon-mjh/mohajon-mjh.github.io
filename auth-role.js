import { initializeApp } from "https://www.gstatic.com/firebasejs/12.0.0/firebase-app.js";
import { getAuth, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/12.0.0/firebase-auth.js";
import { getDatabase, ref, get } from "https://www.gstatic.com/firebasejs/12.0.0/firebase-database.js";

const firebaseConfig = {
apiKey: "AIzaSyDj_LLHWBgcKfQClnaOUqEtULHhP1vSVxw",
authDomain: "mohajon-mjh.firebaseapp.com",
databaseURL: "https://mohajon-mjh-default-rtdb.firebaseio.com",
projectId: "mohajon-mjh",
storageBucket: "mohajon-mjh.firebasestorage.app",
messagingSenderId: "526105903976",
appId: "1:526105903976:web:f9321c6d68ecbd19d58cdd"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getDatabase(app);

onAuthStateChanged(auth, async (user)=>{
if(!user){
console.log("Guest user");
return;
}

const snap = await get(ref(db,"users/"+user.uid));
const role = snap.exists() ? snap.val().role : "buyer";

window.USER_ROLE = role;
window.USER_ID = user.uid;

console.log("Role:", role);
});
