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

const db = getDatabase();

onValue(ref(db,"orders"),(snap)=>{
const data = Object.values(snap.val()||{});

let totalSales = 0;
let totalOrders = data.length;

data.forEach(o=>{
(o.items||[]).forEach(()=> totalSales += 100); // demo calc
});

document.body.innerHTML = `
<h2>Analytics Dashboard</h2>
<p>Total Orders: ${totalOrders}</p>
<p>Total Sales: ৳${totalSales}</p>
`;
});
