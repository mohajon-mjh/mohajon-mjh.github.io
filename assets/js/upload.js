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

let currentUser=null;
let sellerVerified=false;

onAuthStateChanged(auth,(user)=>{

  if(!user){
    location.href="login.html";
    return;
  }

  currentUser=user;

  const sellerRef=ref(db,"sellers/"+user.uid);

  onValue(sellerRef,(snap)=>{

    if(!snap.exists()){
      location.href="seller.html";
      return;
    }

    const seller=snap.val();
    sellerVerified = seller.verified===true;

    window.lockSellerUI?.(sellerVerified);

  });

});

/* 🚫 BASIC DUPLICATE + SPAM CONTROL */
function isValidProduct(name, price){

  if(!name || name.length<3) return false;
  if(price<=0 || price>1000000) return false;

  return true;
}

document.getElementById("product-form").addEventListener("submit",function(e){

  e.preventDefault();

  if(!currentUser) return alert("Login required");
  if(!sellerVerified) return alert("Seller not verified");

  const name=document.getElementById("product-name").value.trim();
  const price=parseFloat(document.getElementById("product-price").value);

  if(!isValidProduct(name,price)){
    alert("Invalid product data");
    return;
  }

  const productData={
    name,
    price,
    description:document.getElementById("product-desc").value,
    stock:parseInt(document.getElementById("product-stock").value)||0,
    category:document.getElementById("product-category").value,
    sellerId:currentUser.uid,
    sellerEmail:currentUser.email,
    createdAt:Date.now(),
    status:"pending",
    approvedAt:0
  };

  const file=document.getElementById("product-image").files[0];

  if(file){
    const reader=new FileReader();
    reader.onload=(e)=>{
      productData.image=e.target.result;
      save(productData);
    };
    reader.readAsDataURL(file);
  }else{
    productData.image="assets/images/default-product.jpg";
    save(productData);
  }

});

function save(data){

  const newRef=push(ref(db,"products"));

  set(newRef,data)
  .then(()=>{
    alert("Submitted for admin approval");
    location.href="seller-dashboard.html";
  })
  .catch(err=>alert(err.message));
}
