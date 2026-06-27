import { initializeApp } from "firebase/app";
import { getDatabase, ref, push, set, onValue } from "firebase/database";
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

let currentUser = null;
let sellerVerified = false;

onAuthStateChanged(auth, (user) => {

    if (!user) {
        location.href = "login.html";
        return;
    }

    currentUser = user;

    const sellerRef = ref(db, "sellers/" + user.uid);

    onValue(sellerRef, (snapshot) => {

        if (!snapshot.exists()) {

            alert("Seller account not found.");

            location.href = "seller.html";

            return;

        }

        const seller = snapshot.val();

        sellerVerified = seller.verified === true;

        if (!sellerVerified) {

            alert("Your seller account is waiting for admin approval.");

        }

    });

});

document.getElementById("product-form").addEventListener("submit", function(e){

    e.preventDefault();

    if(!currentUser){
        alert("Login required.");
        return;
    }

    if(!sellerVerified){
        alert("Seller not verified.");
        return;
    }

    const productData = {

        name: document.getElementById("product-name").value.trim(),

        price: parseFloat(document.getElementById("product-price").value),

        description: document.getElementById("product-desc").value,

        stock: parseInt(document.getElementById("product-stock").value)||0,

        category: document.getElementById("product-category").value,

        sellerId: currentUser.uid,

        sellerEmail: currentUser.email,

        createdAt: Date.now(),

        status: "pending",

        approvedBy: "",

        approvedAt: 0,

        sold: 0,

        rating: 0,

        reviews: 0

    };

    const imageFile=document.getElementById("product-image").files[0];

    if(imageFile){

        const reader=new FileReader();

        reader.onload=function(ev){

            productData.image=ev.target.result;

            saveProduct(productData);

        };

        reader.readAsDataURL(imageFile);

    }else{

        productData.image="assets/images/default-product.jpg";

        saveProduct(productData);

    }

});

function saveProduct(productData){

    const newRef=push(ref(db,"products"));

    set(newRef,productData)

    .then(()=>{

        alert("Product submitted successfully.\nWaiting for Admin approval.");

        location.href="seller-dashboard.html";

    })

    .catch(err=>{

        alert(err.message);

    });

}
