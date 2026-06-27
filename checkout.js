import { initializeApp } from "https://www.gstatic.com/firebasejs/12.0.0/firebase-app.js";
import { getDatabase, ref, push } from "https://www.gstatic.com/firebasejs/12.0.0/firebase-database.js";
import { getAuth, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/12.0.0/firebase-auth.js";

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
const auth = getAuth(app);

let currentUser = null;

onAuthStateChanged(auth, (user)=>{
  if(user){
    currentUser = user;
  } else {
    window.location.href = "index.html";
  }
});

window.placeOrder = async function(){

  if(!currentUser){
    alert("Login required");
    return;
  }

  const cart = JSON.parse(localStorage.getItem("cart") || "[]");

  if(cart.length === 0){
    alert("Cart empty!");
    return;
  }

  const order = {
    orderId: "ORD-" + Date.now(),
    uid: currentUser.uid,
    name: document.getElementById("name").value,
    phone: document.getElementById("phone").value,
    address: document.getElementById("address").value,
    items: cart,
    status: "pending",
    paymentMethod: window.paymentMethod || "COD",
    orderDate: new Date().toISOString()
  };

  await push(ref(db,"orders"), order);

  localStorage.removeItem("cart");

  alert("Order Placed Successfully");

  window.location.href = "order-status.html";
};
