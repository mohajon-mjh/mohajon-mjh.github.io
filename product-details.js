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

const params = new URLSearchParams(window.location.search);
const id = params.get("id");

onValue(ref(db,"products"),(snap)=>{
const data = Object.values(snap.val()||{});
const product = data.find(p=>p.id == id);

if(!product){
document.body.innerHTML = "Product not found";
return;
}

document.body.innerHTML = `
<div style="padding:20px;font-family:Arial">
<img src="${product.image}" style="width:100%;max-width:300px">
<h2>${product.name}</h2>
<p>${product.category}</p>
<h3>৳${product.price}</h3>

<button onclick="addCart('${product.id}')">🛒 Add to Cart</button>
<button onclick="addWish('${product.id}')">❤️ Wishlist</button>
<button onclick="buyNow('${product.id}')">⚡ Buy Now</button>
</div>
`;
});

window.addCart = function(id){
let cart = JSON.parse(localStorage.getItem("cart")||"[]");
cart.push(id);
localStorage.setItem("cart",JSON.stringify(cart));
alert("Added to cart");
};

window.addWish = function(id){
let w = JSON.parse(localStorage.getItem("wish")||"[]");
w.push(id);
localStorage.setItem("wish",JSON.stringify(w));
alert("Added to wishlist");
};

window.buyNow = function(id){
alert("Buy Now clicked: "+id);
};
