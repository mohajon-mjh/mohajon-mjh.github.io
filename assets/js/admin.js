import { initializeApp } from "firebase/app";
import { getDatabase, ref, onValue, update, remove } from "firebase/database";
import { getAuth, onAuthStateChanged } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyDj_LLHWBgcKfQClnaOUqEtULHhP1vSVxw",
  authDomain: "mohajon-mjh.firebaseapp.com",
  databaseURL: "https://mohajon-mjh-default-rtdb.firebaseio.com",
  projectId: "mohajon-mjh",
  storageBucket: "mohajon-mjh.firebasestorage.app",
  messagingSenderId: "526105903976",
  appId: "1:526105903976:web:f9321c6d68ecbd19d58cdd",
  measurementId: "G-RX6CCQZHSH"
};

const app = initializeApp(firebaseConfig);
const db = getDatabase(app);
const auth = getAuth(app);

const productsDiv = document.getElementById("products");

onAuthStateChanged(auth, (user) => {

  if(!user){
    alert("Admin login required");
    location.href="login.html";
    return;
  }

  loadProducts();
});

function loadProducts(){

  const productsRef = ref(db,"products");

  onValue(productsRef,(snapshot)=>{

    productsDiv.innerHTML="";

    snapshot.forEach(child=>{

      const key = child.key;
      const data = child.val();

      if(data.status !== "pending") return;

      const div = document.createElement("div");
      div.className="card";

      div.innerHTML=`
        <h3>${data.name}</h3>
        <p>Price: ${data.price}</p>
        <p>Seller: ${data.sellerEmail}</p>
        <p>Status: ${data.status}</p>
        <button class="approve">Approve</button>
        <button class="reject">Reject</button>
      `;

      div.querySelector(".approve").onclick = () => {
        update(ref(db,"products/"+key),{
          status:"approved",
          approvedAt: Date.now()
        });
      };

      div.querySelector(".reject").onclick = () => {
        remove(ref(db,"products/"+key));
      };

      productsDiv.appendChild(div);
    });

  });
}
