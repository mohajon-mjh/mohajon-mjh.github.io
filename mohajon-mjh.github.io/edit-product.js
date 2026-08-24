import { initializeApp } from "https://www.gstatic.com/firebasejs/12.0.0/firebase-app.js";
import { getDatabase, ref, get, update } from "https://www.gstatic.com/firebasejs/12.0.0/firebase-database.js";

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

const id = new URLSearchParams(location.search).get("id");

if (!id) {
  alert("Product ID Missing");
  location.href = "seller-dashboard.html";
}

const snap = await get(ref(db, "products/" + id));

if (!snap.exists()) {
  alert("Product Not Found");
  location.href = "seller-dashboard.html";
}

const p = snap.val();

name.value = p.name || "";
price.value = p.price || "";
stock.value = p.stock || 0;
image.value = p.image || "";
weight.value = p.weight || "";
category.value = p.category || "";

saveBtn.onclick = async () => {
  await update(ref(db, "products/" + id), {
    name: name.value,
    price: Number(price.value),
    stock: Number(stock.value),
    image: image.value,
    weight: weight.value,
    category: category.value
  });

  alert("Product Updated Successfully");
  location.href = "seller-dashboard.html";
};
