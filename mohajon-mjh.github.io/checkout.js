import { initializeApp } from "https://www.gstatic.com/firebasejs/12.0.0/firebase-app.js";
import { getDatabase, ref, push, get } from "https://www.gstatic.com/firebasejs/12.0.0/firebase-database.js";
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

const root = document.getElementById("coRoot");
let currentUser = null;
let selectedPayment = "COD";

const PAYMENT_METHODS = [
  {
    key: "COD",
    label: "💵 Cash on Delivery",
    needsRef: false,
    refPlaceholder: "",
    info: "ডেলিভারির সময় ক্যাশ পরিশোধ করুন। কোনো অগ্রিম পেমেন্ট প্রয়োজন নেই।"
  },
  {
    key: "bKash",
    label: "📱 bKash",
    needsRef: true,
    refPlaceholder: "bKash Transaction ID",
    info: "এই bKash নম্বরে <b>Send Money</b> করুন: <b>+8801317668288</b><br>তারপর Transaction ID নিচে লিখুন।"
  },
  {
    key: "Nagad",
    label: "📱 Nagad",
    needsRef: true,
    refPlaceholder: "Nagad Transaction ID",
    info: "এই Nagad নম্বরে <b>Send Money</b> করুন: <b>+8801306613452</b><br>তারপর Transaction ID নিচে লিখুন।"
  },
  {
    key: "Rocket",
    label: "🚀 Rocket",
    needsRef: true,
    refPlaceholder: "Rocket Transaction ID",
    info: "এই Rocket নম্বরে টাকা পাঠান: <b>+8801890521208</b><br>তারপর Transaction ID নিচে লিখুন।"
  },
  {
    key: "Bank",
    label: "🏦 Bank Transfer",
    needsRef: true,
    refPlaceholder: "Deposit Slip / Reference No.",
    info: `নিচের ব্যাংক একাউন্টে টাকা জমা দিন:<br>
      🏦 ব্যাংক: <b>Islami Bank Bangladesh Limited (IBBL)</b><br>
      👤 একাউন্ট হোল্ডার: <b>Mohammad Jahangir Hossain</b><br>
      🔢 একাউন্ট নম্বর: <b>20502490200244600</b><br>
      📍 ব্রাঞ্চ: <b>Sonagazi, Feni</b><br>
      তারপর ডিপোজিট স্লিপ/রেফারেন্স নম্বর নিচে লিখুন।`
  },
  {
    key: "PayPal",
    label: "🌐 PayPal",
    needsRef: true,
    refPlaceholder: "PayPal Transaction ID",
    info: "এই PayPal একাউন্টে টাকা পাঠান: <b>jenisaniaini@gmail.com</b><br>তারপর Transaction ID নিচে লিখুন।"
  }
];

function getCartItems(){
  try{
    return JSON.parse(localStorage.getItem("cart") || "[]");
  }catch(e){ return []; }
}

function renderEmptyCart(){
  root.innerHTML = `
    <div class="co-empty">
      আপনার কার্ট খালি।<br>
      <a href="products.html">← প্রোডাক্ট দেখতে ফিরে যান</a>
    </div>
  `;
}

function renderLoginRequired(){
  root.innerHTML = `
    <div class="co-empty">
      অর্ডার করতে হলে আগে লগইন করতে হবে।<br><br>
      <a href="login.html">👤 Login করুন</a> অথবা
      <a href="signup.html">নতুন একাউন্ট খুলুন</a>
    </div>
  `;
}

function renderLoading(){
  root.innerHTML = `<div class="co-empty">লোড হচ্ছে...</div>`;
}

// 🔥 cart কে seller অনুযায়ী গ্রুপ করে প্রতিটা seller-এর জন্য আলাদা order অবজেক্ট বানায়
function groupCartBySeller(cart){
  const groups = {};
  cart.forEach(item => {
    const sid = item.sellerId || "unknown";
    if(!groups[sid]) groups[sid] = [];
    groups[sid].push(item);
  });
  return groups;
}

// 🚚 প্রতিটা প্রোডাক্টের delivery তথ্য (isFreeDelivery, deliveryCharge, deliveryTime) Firebase থেকে আনে
async function fetchDeliveryInfo(cart){
  const uniqueIds = [...new Set(cart.map(i => i.id))];
  const deliveryMap = {};

  await Promise.all(uniqueIds.map(async (id) => {
    try{
      const snap = await get(ref(db, "products/" + id));
      if(snap.exists()){
        const d = snap.val();
        deliveryMap[id] = {
          isFreeDelivery: !!d.isFreeDelivery,
          deliveryCharge: Number(d.deliveryCharge) || 0,
          deliveryTime: d.deliveryTime || ""
        };
      } else {
        deliveryMap[id] = { isFreeDelivery: true, deliveryCharge: 0, deliveryTime: "" };
      }
    }catch(e){
      deliveryMap[id] = { isFreeDelivery: true, deliveryCharge: 0, deliveryTime: "" };
    }
  }));

  return deliveryMap;
}

// 🚚 প্রতি seller-এর জন্য একটাই delivery charge নির্ধারণ করে (সেই seller-এর প্রোডাক্টগুলোর মধ্যে সর্বোচ্চ charge)
// যদি সেই seller-এর সব প্রোডাক্ট Free Delivery হয়, charge = 0
function calcSellerDeliveryCharges(cart, deliveryMap){
  const groups = groupCartBySeller(cart);
  const sellerDelivery = {};

  Object.entries(groups).forEach(([sellerId, items]) => {
    let maxCharge = 0;
    let allFree = true;
    let deliveryTime = "";

    items.forEach(item => {
      const info = deliveryMap[item.id] || { isFreeDelivery: true, deliveryCharge: 0, deliveryTime: "" };
      if(!info.isFreeDelivery){
        allFree = false;
        if(info.deliveryCharge > maxCharge){
          maxCharge = info.deliveryCharge;
          deliveryTime = info.deliveryTime;
        }
      } else if(!deliveryTime && info.deliveryTime){
        deliveryTime = info.deliveryTime;
      }
    });

    sellerDelivery[sellerId] = {
      charge: allFree ? 0 : maxCharge,
      isFree: allFree,
      deliveryTime: deliveryTime
    };
  });

  return sellerDelivery;
}

function updatePaymentInfo(){
  const pm = PAYMENT_METHODS.find(p => p.key === selectedPayment);
  const infoBox = document.getElementById("coPayInfo");
  const refField = document.getElementById("coRef");

  if(infoBox && pm){
    infoBox.innerHTML = pm.info;
  }
  if(refField && pm){
    if(pm.needsRef){
      refField.classList.add("show");
      refField.placeholder = pm.refPlaceholder;
    } else {
      refField.classList.remove("show");
      refField.value = "";
    }
  }
}

function renderCheckoutForm(cart, deliveryMap){
  const itemsTotal = cart.reduce((sum, item) => sum + (parseFloat(item.price)||0) * (item.qty||1), 0);
  const sellerDelivery = calcSellerDeliveryCharges(cart, deliveryMap);
  const totalDelivery = Object.values(sellerDelivery).reduce((sum, d) => sum + d.charge, 0);
  const grandTotal = itemsTotal + totalDelivery;

  const itemsHtml = cart.map(item => `
    <div class="co-item">
      <span>${item.name || item.id} × ${item.qty || 1}</span>
      <span>৳${((parseFloat(item.price)||0) * (item.qty||1)).toFixed(2)}</span>
    </div>
  `).join("");

  const deliveryHtml = Object.entries(sellerDelivery).map(([sellerId, d]) => {
    const label = d.isFree ? "ফ্রি ডেলিভারি" : `৳${d.charge.toFixed(2)}`;
    const timeText = d.deliveryTime ? ` (${d.deliveryTime})` : "";
    return `
      <div class="co-item">
        <span>🚚 ডেলিভারি চার্জ${timeText}</span>
        <span>${label}</span>
      </div>
    `;
  }).join("");

  const paymentHtml = PAYMENT_METHODS.map(pm => `
    <button type="button" class="co-pay-btn ${pm.key==='COD'?'active':''}" data-method="${pm.key}">
      ${pm.label}
    </button>
  `).join("");

  root.innerHTML = `
    <div class="co-box">
      <h3>🛒 অর্ডার সামারি</h3>
      ${itemsHtml}
      <div class="co-item">
        <span>পণ্যের মূল্য (সর্বমোট)</span>
        <span>৳${itemsTotal.toFixed(2)}</span>
      </div>
      ${deliveryHtml}
      <div class="co-total">
        <span>সর্বমোট (ডেলিভারিসহ)</span>
        <span>৳${grandTotal.toFixed(2)}</span>
      </div>
    </div>

    <div class="co-box">
      <h3>📦 ডেলিভারি তথ্য</h3>
      <input class="co-input" id="coName" placeholder="আপনার নাম" value="${currentUser?.displayName || ''}">
      <input class="co-input" id="coPhone" placeholder="মোবাইল নম্বর" type="tel">
      <select class="co-select" id="coArea">
        <option value="">ডেলিভারি এলাকা নির্বাচন করুন</option>
        <option value="Dhaka Inside">ঢাকা সিটির ভেতরে</option>
        <option value="Dhaka Outside">ঢাকা সিটির বাইরে</option>
        <option value="Outside Dhaka">ঢাকার বাইরে (অন্য জেলা)</option>
      </select>
      <textarea class="co-textarea" id="coAddress" placeholder="সম্পূর্ণ ঠিকানা (বাড়ি/রোড/এলাকা/জেলা)"></textarea>
    </div>

    <div class="co-box">
      <h3>💳 Payment Method</h3>
      <div class="co-pay-grid">${paymentHtml}</div>
      <div id="coPayInfo" class="co-pay-info"></div>
      <input class="co-input co-ref-field" id="coRef" placeholder="">
    </div>

    <button class="co-confirm-btn" id="coConfirmBtn">✅ Order Confirm</button>
    <div id="coMsg" class="co-msg"></div>
  `;

  updatePaymentInfo();

  document.querySelectorAll(".co-pay-btn").forEach(btn => {
    btn.addEventListener("click", () => {
      document.querySelectorAll(".co-pay-btn").forEach(b => b.classList.remove("active"));
      btn.classList.add("active");
      selectedPayment = btn.dataset.method;
      updatePaymentInfo();
    });
  });

  document.getElementById("coConfirmBtn").addEventListener("click", async () => {
    await placeOrder(cart, sellerDelivery);
  });
}

async function placeOrder(cart, sellerDelivery){
  const msgEl = document.getElementById("coMsg");
  const btn = document.getElementById("coConfirmBtn");
  msgEl.textContent = "";
  msgEl.className = "co-msg";

  const name = document.getElementById("coName").value.trim();
  const phone = document.getElementById("coPhone").value.trim();
  const area = document.getElementById("coArea").value;
  const address = document.getElementById("coAddress").value.trim();
  const refVal = document.getElementById("coRef") ? document.getElementById("coRef").value.trim() : "";

  const pm = PAYMENT_METHODS.find(p => p.key === selectedPayment);
  if(pm && pm.needsRef && !refVal){
    msgEl.textContent = "দয়া করে Transaction/Reference নম্বর লিখুন।";
    msgEl.classList.add("error");
    return;
  }

  if(!name || !phone || !area || !address){
    msgEl.textContent = "দয়া করে সব তথ্য পূরণ করুন (নাম, ফোন, এলাকা, ঠিকানা)।";
    msgEl.classList.add("error");
    return;
  }

  btn.disabled = true;
  btn.textContent = "অর্ডার প্রসেস হচ্ছে...";

  try{
    const sellerGroups = groupCartBySeller(cart);
    const paymentId = refVal ? `${selectedPayment} - ${refVal}` : selectedPayment;

    const orderPromises = Object.entries(sellerGroups).map(([sellerId, items]) => {
      const sellerItemsTotal = items.reduce((sum, item) => sum + (parseFloat(item.price)||0) * (item.qty||1), 0);
      const deliveryInfo = sellerDelivery[sellerId] || { charge: 0, isFree: true, deliveryTime: "" };
      const sellerTotal = sellerItemsTotal + deliveryInfo.charge;

      const order = {
        buyerId: currentUser.uid,
        sellerId: sellerId,
        items: items,
        itemsTotal: sellerItemsTotal,
        deliveryCharge: deliveryInfo.charge,
        deliveryTime: deliveryInfo.deliveryTime || "",
        total: sellerTotal,
        currency: "BDT",
        status: "pending",
        shippingAddress: { name, phone, area, address },
        paymentId: paymentId,
        createdAt: Date.now()
      };

      return push(ref(db, "orders"), order);
    });

    await Promise.all(orderPromises);

    localStorage.removeItem("cart");
    if(typeof updateCartUI === "function") updateCartUI();

    msgEl.textContent = "🎉 অর্ডার সফলভাবে সম্পন্ন হয়েছে! ধন্যবাদ।";
    msgEl.classList.add("success");
    btn.textContent = "✅ Order Placed";

    setTimeout(() => {
      window.location.href = "index.html";
    }, 2000);

  }catch(err){
    console.error("Order error:", err);
    msgEl.textContent = "অর্ডার সম্পন্ন করা যায়নি। আবার চেষ্টা করুন। (" + err.message + ")";
    msgEl.classList.add("error");
    btn.disabled = false;
    btn.textContent = "✅ Order Confirm";
  }
}

onAuthStateChanged(auth, async (user) => {
  if(!user){
    renderLoginRequired();
    return;
  }
  currentUser = user;

  const cart = getCartItems();
  if(cart.length === 0){
    renderEmptyCart();
    return;
  }

  renderLoading();
  const deliveryMap = await fetchDeliveryInfo(cart);
  renderCheckoutForm(cart, deliveryMap);
});
