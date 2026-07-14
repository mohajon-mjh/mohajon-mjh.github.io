import { initializeApp } from "https://www.gstatic.com/firebasejs/12.0.0/firebase-app.js";
import { getDatabase, ref, onValue, push, set, remove, update, get, query, orderByChild, equalTo } from "https://www.gstatic.com/firebasejs/12.0.0/firebase-database.js";
import { getAuth, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/12.0.0/firebase-auth.js";

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

let currentSeller = null;
let currentUid = null;

// Check authentication
onAuthStateChanged(auth, (user) => {
    if (user) {
        currentUid = user.uid;
        checkIfSeller(user.uid);
    } else {
        window.location.href = 'login.html';
    }
});

function checkIfSeller(uid) {
    const sellerRef = ref(db, `sellers/${uid}`);
    onValue(sellerRef, (snapshot) => {
        if (snapshot.exists() && snapshot.val().status === "approved") {
            currentSeller = snapshot.val();
            currentSeller.uid = uid;
            loadDashboard();
            loadProducts();
            loadOrders();
        } else if (snapshot.exists()) {
            alert('আপনার seller আবেদন এখনো অনুমোদিত হয়নি (status: ' + snapshot.val().status + ')');
            window.location.href = 'index.html';
        } else {
            alert('আপনি এখনো seller হিসেবে নিবন্ধিত নন');
            window.location.href = 'become-seller.html';
        }
    });
}

function loadDashboard() {
    // নিজের প্রোডাক্ট শুধু (sellerId দিয়ে query, পুরো node না)
    const productsQuery = query(ref(db, 'products'), orderByChild('sellerId'), equalTo(currentSeller.uid));
    onValue(productsQuery, (snapshot) => {
        const products = snapshot.val();
        let total = 0;
        let totalStock = 0;
        let inventoryValue = 0;
        let lowStock = 0;
        let revenue = 0;
        if (products) {
            Object.keys(products).forEach(key => {
                total++;
                totalStock += parseInt(products[key].stock || 0);
                inventoryValue += (parseInt(products[key].stock || 0) * parseFloat(products[key].price || 0));
                if((products[key].stock || 0) > 0 && (products[key].stock || 0) < 5) lowStock++;
                if (products[key].sold) revenue += products[key].price * products[key].sold;
            });
        }
        document.getElementById('total-products').textContent = total;
        document.getElementById('total-stock').textContent = totalStock;
        document.getElementById('inventory-value').textContent = '৳' + inventoryValue;
        document.getElementById('low-stock-count').textContent = lowStock;
        document.getElementById('total-revenue').textContent = '৳' + revenue;
    });

    // নিজের অর্ডার শুধু (sellerId দিয়ে query)
    const ordersQuery = query(ref(db, 'orders'), orderByChild('sellerId'), equalTo(currentSeller.uid));
    onValue(ordersQuery, (snapshot) => {
        const orders = snapshot.val();
        let totalOrders = 0;
        let pending = 0;
        if (orders) {
            Object.keys(orders).forEach(key => {
                totalOrders++;
                if (orders[key].status === 'pending') pending++;
            });
        }
        document.getElementById('total-orders').textContent = totalOrders;
        document.getElementById('pending-orders').textContent = pending;
    });
}

function loadProducts() {
    const productsQuery = query(ref(db, 'products'), orderByChild('sellerId'), equalTo(currentSeller.uid));
    onValue(productsQuery, (snapshot) => {
        const products = snapshot.val();
        const productList = document.getElementById('product-list');
        productList.innerHTML = '';
        if (products) {
            Object.keys(products).forEach(key => {
                productList.innerHTML += `
                    <div class="product-item">
                        <h3>${products[key].title || products[key].name || ''}</h3>
                        <p>Price: ৳${products[key].price}</p>
                        <p>Stock: ${products[key].stock || 0}</p>
                        <p>Status: ${products[key].status}</p>
                        <button onclick="editProduct('${key}')">Edit</button>
                        <button onclick="deleteProduct('${key}')">Delete</button>
                    </div>
                `;
            });
        }
    });
}

function loadOrders() {
    const ordersQuery = query(ref(db, 'orders'), orderByChild('sellerId'), equalTo(currentSeller.uid));
    onValue(ordersQuery, (snapshot) => {
        const orders = snapshot.val();
        const orderList = document.getElementById('order-list');
        orderList.innerHTML = '';
        if (orders) {
            Object.keys(orders).forEach(key => {
                const o = orders[key];
                const addr = o.shippingAddress || {};
                orderList.innerHTML += `
                    <div class="order-item">
                        <h3>Order #${key.slice(0,8)}</h3>
                        <p>Customer: ${addr.name || 'N/A'}</p>
                        <p>Total: ৳${o.total}</p>
                        <p>Status: ${o.status}</p>
                        <button onclick="updateOrderStatus('${key}', 'processing')">Confirm</button>
                        <button onclick="updateOrderStatus('${key}', 'shipped')">Ship</button>
                        <button onclick="updateOrderStatus('${key}', 'delivered')">Deliver</button>
                    </div>
                `;
            });
        }
    });
}

function showAddProduct() {
    window.location.href = 'seller.html';
}

function editProduct(productId) {
    window.location.href = `edit-product.html?id=${productId}`;
}

function deleteProduct(productId) {
    if (confirm('Are you sure you want to delete this product?')) {
        const productRef = ref(db, `products/${productId}`);
        remove(productRef).then(() => {
            alert('Product deleted successfully');
        }).catch(error => {
            alert('Error deleting product: ' + error.message);
        });
    }
}

function updateOrderStatus(orderId, status) {
    const orderRef = ref(db, `orders/${orderId}`);
    update(orderRef, { status: status }).then(() => {
        alert('Order status updated successfully');
    }).catch(error => {
        alert('Error updating order: ' + error.message);
    });
}

function logout() {
    signOut(auth).then(() => {
        window.location.href = 'index.html';
    }).catch(error => {
        alert('Error logging out: ' + error.message);
    });
}

window.showAddProduct = showAddProduct;
window.editProduct = editProduct;
window.deleteProduct = deleteProduct;
window.updateOrderStatus = updateOrderStatus;
window.logout = logout;

// Navigation
document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('.seller-sidebar a').forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const target = this.getAttribute('href').substring(1);
            document.querySelectorAll('.seller-content > div').forEach(div => {
                div.style.display = 'none';
            });
            document.getElementById(target).style.display = 'block';
        });
    });
});
