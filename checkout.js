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

function renderCheckoutForm(cart){
  const total = cart.reduce((sum, item) => sum + (parseFloat(item.price)||0) * (item.qty||1), 0);

  const itemsHtml = cart.map(item => `
    <div class="co-item">
      <span>${item.name || item.id} × ${item.qty || 1}</span>
      <span>৳${((parseFloat(item.price)||0) * (item.qty||1)).toFixed(2)}</span>
    </div>
  `).join("");

  const paymentHtml = PAYMENT_METHODS.map(pm => `
    <button type="button" class="co-pay-btn ${pm.key==='COD'?'active':''}" data-method="${pm.key}">
      ${pm.label}
    </button>
  `).join("");

  root.innerHTML = `
    <div class="co-box">
      <h3>🛒 অর্ডার সামারি</h3>
      ${itemsHtml}
      <div class="co-total">
        <span>সর্বমোট</span>
        <span>৳${total.toFixed(2)}</span>
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
    await placeOrder(cart, total);
  });
}

async function placeOrder(cart, total){
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
    const order = {
      buyerId: currentUser.uid,
      sellerId: "admin",
      items: cart,
      total: total,
      currency: "BDT",
      status: "pending",
      shippingAddress: { name, phone, area, address },
      paymentId: refVal ? `${selectedPayment} - ${refVal}` : selectedPayment,
      createdAt: Date.now()
    };

    await push(ref_db_orders(), order);

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

function ref_db_orders(){
  return ref(db, "orders");
}

onAuthStateChanged(auth, (user) => {
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
  renderCheckoutForm(cart);
});
