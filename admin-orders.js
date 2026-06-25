import { initializeApp } from "https://www.gstatic.com/firebasejs/12.0.0/firebase-app.js";
import { getDatabase, ref, onValue } from "https://www.gstatic.com/firebasejs/12.0.0/firebase-database.js";

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
const db = getDatabase(app);

onValue(ref(db,"orders"),(snap)=>{
const data = snap.val()||{};
const orders = Object.values(data);

document.body.innerHTML = "<h2>All Orders</h2>" +
orders.map(o=>`
<div style="padding:10px;border:1px solid #ccc;margin:5px">
<b>${o.name}</b><br>
📞 ${o.phone}<br>
🏠 ${o.address}<br>
📦 Items: ${o.items.join(", ")}<br>
⏰ ${new Date(o.time).toLocaleString()}<br>
Status: ${o.status}
</div>
`).join("");
});
