import { initializeApp } from "https://www.gstatic.com/firebasejs/12.0.0/firebase-app.js";
import { getDatabase, ref, push } from "https://www.gstatic.com/firebasejs/12.0.0/firebase-database.js";

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

window.placeOrder = async function(){

const cart = JSON.parse(localStorage.getItem("cart")||"[]");

const order = {
name: document.getElementById("name").value,
phone: document.getElementById("phone").value,
address: document.getElementById("address").value,
items: cart,
time: Date.now(),
status: "pending"
};

await push(ref(db,"orders"), order);

localStorage.removeItem("cart");

alert("Order Placed Successfully");
location.href="index.html";
};
