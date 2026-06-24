import { initializeApp } from "firebase/app";
import { getDatabase, ref, onValue, push, set, remove, update } from "firebase/database";
import { getAuth, onAuthStateChanged, signOut } from "firebase/auth";

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

// Check if user is admin
onAuthStateChanged(auth, (user) => {
    if (user) {
        checkIfAdmin(user.uid);
    } else {
        window.location.href = 'login.html';
    }
});

function checkIfAdmin(uid) {
    const adminRef = ref(db, `admins/${uid}`);
    onValue(adminRef, (snapshot) => {
        if (snapshot.exists()) {
            loadDashboard();
            loadUsers();
            loadSellers();
            loadAllProducts();
            loadAllOrders();
            loadCoupons();
            loadCategories();
        } else {
            alert('You are not authorized as admin');
            window.location.href = 'index.html';
        }
    });
}

function loadDashboard() {
    // Load all stats
    const usersRef = ref(db, 'users');
    onValue(usersRef, (snapshot) => {
        const users = snapshot.val();
        document.getElementById('total-users').textContent = users ? Object.keys(users).length : 0;
    });
    
    const sellersRef = ref(db, 'sellers');
    onValue(sellersRef, (snapshot) => {
        const sellers = snapshot.val();
        document.getElementById('total-sellers').textContent = sellers ? Object.keys(sellers).length : 0;
    });
    
    const productsRef = ref(db, 'products');
    onValue(productsRef, (snapshot) => {
        const products = snapshot.val();
        document.getElementById('total-products').textContent = products ? Object.keys(products).length : 0;
    });
    
    const ordersRef = ref(db, 'orders');
    onValue(ordersRef, (snapshot) => {
        const orders = snapshot.val();
        let total = 0;
        let pending = 0;
        let revenue = 0;
        if (orders) {
            total = Object.keys(orders).length;
            Object.keys(orders).forEach(key => {
                if (orders[key].status === 'pending') pending++;
                if (orders[key].total) revenue += orders[key].total;
            });
        }
        document.getElementById('total-orders').textContent = total;
        document.getElementById('pending-orders').textContent = pending;
        document.getElementById('total-revenue').textContent = '$' + revenue;
    });
}

function loadUsers() {
    const usersRef = ref(db, 'users');
    onValue(usersRef, (snapshot) => {
        const users = snapshot.val();
        const userList = document.getElementById('user-list');
        userList.innerHTML = '';
        if (users) {
            Object.keys(users).forEach(key => {
                userList.innerHTML += `
                    <div class="user-item">
                        <p>${users[key].email || key}</p>
                        <button onclick="deleteUser('${key}')">Delete</button>
                    </div>
                `;
            });
        }
    });
}

function loadSellers() {
    const sellersRef = ref(db, 'sellers');
    onValue(sellersRef, (snapshot) => {
        const sellers = snapshot.val();
        const sellerList = document.getElementById('seller-list');
        sellerList.innerHTML = '';
        if (sellers) {
            Object.keys(sellers).forEach(key => {
                sellerList.innerHTML += `
                    <div class="seller-item">
                        <p>${sellers[key].storeName || sellers[key].email || key}</p>
                        <button onclick="verifySeller('${key}')">Verify</button>
                        <button onclick="deleteSeller('${key}')">Delete</button>
                    </div>
                `;
            });
        }
    });
}

function loadAllProducts() {
    const productsRef = ref(db, 'products');
    onValue(productsRef, (snapshot) => {
        const products = snapshot.val();
        const productList = document.getElementById('admin-product-list');
        productList.innerHTML = '';
        if (products) {
            Object.keys(products).forEach(key => {
                productList.innerHTML += `
                    <div class="product-item">
                        <h4>${products[key].name}</h4>
                        <p>Price: $${products[key].price}</p>
                        <button onclick="deleteProduct('${key}')">Delete</button>
                    </div>
                `;
            });
        }
    });
}

function loadAllOrders() {
    const ordersRef = ref(db, 'orders');
    onValue(ordersRef, (snapshot) => {
        const orders = snapshot.val();
        const orderList = document.getElementById('admin-order-list');
        orderList.innerHTML = '';
        if (orders) {
            Object.keys(orders).forEach(key => {
                orderList.innerHTML += `
                    <div class="order-item">
                        <h4>Order #${key.slice(0,8)}</h4>
                        <p>Total: $${orders[key].total}</p>
                        <p>Status: ${orders[key].status}</p>
                        <button onclick="updateAdminOrder('${key}', 'confirmed')">Confirm</button>
                        <button onclick="updateAdminOrder('${key}', 'shipped')">Ship</button>
                        <button onclick="updateAdminOrder('${key}', 'delivered')">Deliver</button>
                    </div>
                `;
            });
        }
    });
}

function verifySeller(sellerId) {
    const sellerRef = ref(db, `sellers/${sellerId}`);
    update(sellerRef, { verified: true }).then(() => {
        alert('Seller verified successfully');
    });
}

function deleteUser(userId) {
    if (confirm('Delete this user?')) {
        remove(ref(db, `users/${userId}`));
    }
}

function deleteSeller(sellerId) {
    if (confirm('Delete this seller?')) {
        remove(ref(db, `sellers/${sellerId}`));
    }
}

function deleteProduct(productId) {
    if (confirm('Delete this product?')) {
        remove(ref(db, `products/${productId}`));
    }
}

function updateAdminOrder(orderId, status) {
    update(ref(db, `orders/${orderId}`), { status: status });
}

function showAddCoupon() {
    const code = prompt('Enter coupon code:');
    const discount = prompt('Enter discount percentage:');
    if (code && discount) {
        push(ref(db, 'coupons'), { code, discount: parseInt(discount), active: true });
    }
}

function loadCoupons() {
    const couponsRef = ref(db, 'coupons');
    onValue(couponsRef, (snapshot) => {
        const coupons = snapshot.val();
        const couponList = document.getElementById('coupon-list');
        couponList.innerHTML = '';
        if (coupons) {
            Object.keys(coupons).forEach(key => {
                couponList.innerHTML += `
                    <div class="coupon-item">
                        <p>${coupons[key].code} - ${coupons[key].discount}%</p>
                        <button onclick="deleteCoupon('${key}')">Delete</button>
                    </div>
                `;
            });
        }
    });
}

function deleteCoupon(couponId) {
    if (confirm('Delete this coupon?')) {
        remove(ref(db, `coupons/${couponId}`));
    }
}

function showAddCategory() {
    const name = prompt('Enter category name:');
    if (name) {
        push(ref(db, 'categories'), { name, active: true, created: Date.now() });
    }
}

function loadCategories() {
    const categoriesRef = ref(db, 'categories');
    onValue(categoriesRef, (snapshot) => {
        const categories = snapshot.val();
        const categoryList = document.getElementById('category-list');
        categoryList.innerHTML = '';
        if (categories) {
            Object.keys(categories).forEach(key => {
                categoryList.innerHTML += `
                    <div class="category-item">
                        <p>${categories[key].name}</p>
                        <button onclick="deleteCategory('${key}')">Delete</button>
                    </div>
                `;
            });
        }
    });
}

function deleteCategory(categoryId) {
    if (confirm('Delete this category?')) {
        remove(ref(db, `categories/${categoryId}`));
    }
}

function logout() {
    signOut(auth).then(() => {
        window.location.href = 'index.html';
    });
}

// Navigation
document.querySelectorAll('.admin-sidebar a').forEach(link => {
    link.addEventListener('click', function(e) {
        e.preventDefault();
        const target = this.getAttribute('href').substring(1);
        document.querySelectorAll('.admin-content > div').forEach(div => {
            div.style.display = 'none';
        });
        document.getElementById(target).style.display = 'block';
    });
});
