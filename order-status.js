import { initializeApp } from "https://www.gstatic.com/firebasejs/12.0.0/firebase-app.js";
import { getDatabase, ref, onValue, update } from "https://www.gstatic.com/firebasejs/12.0.0/firebase-database.js";

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
const data = snap.val()||{};
document.body.innerHTML="<h2>Orders Control</h2>";

Object.entries(data).forEach(([key,o])=>{
document.body.innerHTML += `
<div style="border:1px solid #ccc;padding:10px;margin:5px">
<b>${o.name}</b><br>
Status: ${o.status}<br>

<button onclick="changeStatus('${key}','pending')">Pending</button>
<button onclick="changeStatus('${key}','shipped')">Shipped</button>
<button onclick="changeStatus('${key}','delivered')">Delivered</button>
</div>`;
});
});

window.changeStatus=function(id,status){
update(ref(db,"orders/"+id),{status});
alert("Updated");
};
