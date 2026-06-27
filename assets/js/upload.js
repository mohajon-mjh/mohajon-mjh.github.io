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

onAuthStateChanged(auth, (user) => {
    if (user) {
        currentUser = user;
        // Check if seller
        const sellerRef = ref(db, `sellers/${user.uid}`);
        onValue(sellerRef, (snapshot) => {
            if (!snapshot.exists()) {
                alert('You are not registered as a seller');
                window.location.href = 'seller-dashboard.html';
            }
        });
    } else {
        window.location.href = 'login.html';
    }
});

document.getElementById('product-form').addEventListener('submit', function(e) {
    e.preventDefault();
    
    if (!currentUser) {
        alert('Please login first');
        return;
    }
    
    const productData = {
        name: document.getElementById('product-name').value,
        price: parseFloat(document.getElementById('product-price').value),
        description: document.getElementById('product-desc').value,
        stock: parseInt(document.getElementById('product-stock').value) || 0,
        category: document.getElementById('product-category').value,
        sellerId: currentUser.uid,
        sellerEmail: currentUser.email,
        createdAt: Date.now(),
        status: 'pending',        approvedBy: '',        approvedAt: 0,
        sold: 0,
        rating: 0,
        reviews: 0
    };
    
    // Handle image (in real app, upload to Firebase Storage)
    const imageFile = document.getElementById('product-image').files[0];
    if (imageFile) {
        // For now, convert to base64 (in production, use Firebase Storage)
        const reader = new FileReader();
        reader.onload = function(e) {
            productData.image = e.target.result;
            saveProduct(productData);
        };
        reader.readAsDataURL(imageFile);
    } else {
        productData.image = 'assets/images/default-product.jpg';
        saveProduct(productData);
    }
});

function saveProduct(productData) {
    const productsRef = ref(db, 'products');
    const newProductRef = push(productsRef);
    set(newProductRef, productData)
        .then(() => {
            alert('Product uploaded successfully!');
            window.location.href = 'seller-dashboard.html';
        })
        .catch(error => {
            alert('Error uploading product: ' + error.message);
        });
}
