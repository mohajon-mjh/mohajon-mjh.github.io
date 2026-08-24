import { getDatabase, ref, get, set, update, remove } from "https://www.gstatic.com/firebasejs/12.0.0/firebase-database.js";

const dbConfig = {
  apiKey: "AIzaSyDj_LLHWBgcKfQClnaOUqEtULHhP1vSVxw",
  databaseURL: "https://mohajon-mjh-default-rtdb.firebaseio.com",
  projectId: "mohajon-mjh",
  appId: "1:526105903976:web:f9321c6d68ecbd19d58cdd"
};

// Initialize Firebase (reuse existing app if any)
import { initializeApp, getApps, getApp } from "https://www.gstatic.com/firebasejs/12.0.0/firebase-app.js";
const app = getApps().length ? getApp() : initializeApp(dbConfig);
const db = getDatabase(app);
const paymentsRef = ref(db, "settings/payments");

// Default Payment Methods
const defaultPayments = {
  cod: { name: "Cash on Delivery", icon: "💵", number: "", details: "ডেলিভারির সময় পেমেন্ট", active: true, order: 0 },
  bkash: { name: "bKash", icon: "📱", number: "+8801317668288", details: "Send Money", active: true, order: 1 },
  nagad: { name: "Nagad", icon: "📱", number: "+8801306613452", details: "Send Money", active: true, order: 2 },
  rocket: { name: "Rocket", icon: "🚀", number: "+8801890521208", details: "Send Money", active: true, order: 3 },
  bank: { name: "Bank Transfer", icon: "🏦", number: "", details: "Islami Bank, A/C: 20502490200244600, Feni", active: true, order: 4 },
  paypal: { name: "PayPal", icon: "🌐", number: "jenisaniaini@gmail.com", details: "USD Payment", active: true, order: 5 }
};

window.initPaymentAdmin = async function() {
  const container = document.getElementById("paymentAdminContainer");
  if (!container) return;

  container.innerHTML = '<p style="color:#888">⏳ লোড হচ্ছে...</p>';
  
  try {
    const snapshot = await get(paymentsRef);
    let payments = snapshot.val();
    
    // If first time, set defaults
    if (!payments) {
      await set(paymentsRef, defaultPayments);
      payments = defaultPayments;
    }

    const metaSnap = await get(ref(db, "settings/paymentsMeta")).catch(()=>null);
    const meta = (metaSnap && metaSnap.val()) || {};
    const PRETTY = {bank:"Bank Transfer",bankBranch:"Bank Branch",bankHolder:"Account Holder",bankName:"Bank Name",bankNumber:"Account Number",bkash:"bKash",nagad:"Nagad",paypal:"PayPal",rocket:"Rocket"};
    const view = {};
    for (const k in payments) {
      const v = payments[k];
      if (typeof v === "string") {
        view[k] = { name: (meta[k]&&meta[k].name)||PRETTY[k]||k, icon:"💳", number:v, details:"", order:0, active: meta[k] ? meta[k].active!==false : true };
      } else { view[k] = v; }
    }
    renderPaymentList(view);
  } catch (error) {
    container.innerHTML = `<p style="color:red">❌ এরর: ${error.message}</p>`;
  }
};

function renderPaymentList(payments) {
  const container = document.getElementById("paymentAdminContainer");
  const sortedKeys = Object.keys(payments).sort((a, b) => (payments[a].order || 0) - (payments[b].order || 0));

  let html = `
    <button class="save-btn" onclick="showAddPaymentForm()" style="margin-bottom:15px; background:#27ae60">➕ নতুন Payment Method যোগ করুন</button>
    <div id="paymentFormArea" style="display:none; background:#1a242f; padding:15px; border-radius:8px; margin-bottom:15px; border:1px solid #444;">
      <h4 style="margin-top:0; color:#FFD814">নতুন মেথড যোগ করুন / এডিট করুন</h4>
      <input type="hidden" id="editPayKey" value="">
      <label>Unique ID (যেমন: upi, card) <input id="payKey" placeholder="ID"></label>
      <label>নাম <input id="payName" placeholder="যেমন: bKash"></label>
      <label>আইকন (Emoji) <input id="payIcon" placeholder="📱"></label>
      <label>নাম্বার/ইমেইল <input id="payNumber" placeholder="+880..."></label>
      <label>বিস্তারিত <input id="payDetails" placeholder="Send Money / Account details"></label>
      <label>অর্ডার (সাজানোর জন্য) <input type="number" id="payOrder" value="0"></label>
      <label style="display:flex; align-items:center; gap:10px; margin-top:10px;">
        <input type="checkbox" id="payActive" checked style="width:auto;"> Public এ দেখাবে (Active)
      </label>
      <div style="margin-top:10px;">
        <button class="save-btn" onclick="savePayment()">💾 সেভ করুন</button>
        <button class="delete-btn" onclick="hidePaymentForm()">বাতিল</button>
      </div>
    </div>
    <div style="display:grid; gap:10px;">
  `;

  sortedKeys.forEach(key => {
    const p = payments[key];
    const statusColor = p.active ? "#27ae60" : "#c0392b";
    const statusText = p.active ? "✅ Active (Public এ দেখাবে)" : "❌ Inactive (Hide করা আছে)";
    
    html += `
      <div style="background:#1a242f; padding:12px; border-radius:8px; border-left: 4px solid ${statusColor}; display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:10px;">
        <div style="flex:1; min-width:200px;">
          <div style="font-size:16px; font-weight:bold; color:#fff;">${p.icon || '💳'} ${p.name} <span style="font-size:11px; color:#888;">(ID: ${key})</span></div>
          <div style="font-size:12px; color:#aaa; margin-top:4px;">
            ${p.number ? '📞 ' + p.number + '<br>' : ''}
            ${p.details ? '📝 ' + p.details : ''}
          </div>
          <div style="font-size:11px; color:${statusColor}; margin-top:6px; font-weight:bold;">${statusText}</div>
        </div>
        <div style="display:flex; gap:8px; flex-wrap:wrap;">
          <button class="save-btn" onclick="toggleActive('${key}', ${!p.active})" style="background:${p.active ? '#f39c12' : '#27ae60'}; font-size:12px;">
            ${p.active ? '🔴 Hide করুন' : '🟢 Show করুন'}
          </button>
          <button class="save-btn" onclick="editPayment('${key}')" style="background:#2980b9; font-size:12px;">✏️ Edit</button>
          <button class="delete-btn" onclick="deletePayment('${key}')" style="font-size:12px;">🗑️ Delete</button>
        </div>
      </div>
    `;
  });

  html += `</div>`;
  container.innerHTML = html;
}

window.showAddPaymentForm = function() {
  document.getElementById("paymentFormArea").style.display = "block";
  document.getElementById("editPayKey").value = "";
  document.getElementById("payKey").value = "";
  document.getElementById("payKey").disabled = false;
  document.getElementById("payName").value = "";
  document.getElementById("payIcon").value = "";
  document.getElementById("payNumber").value = "";
  document.getElementById("payDetails").value = "";
  document.getElementById("payOrder").value = "0";
  document.getElementById("payActive").checked = true;
};

window.hidePaymentForm = function() {
  document.getElementById("paymentFormArea").style.display = "none";
};

window.editPayment = async function(key) {
  const snapshot = await get(paymentsRef);
  const payments = snapshot.val() || {};
  const p = payments[key];
  
  document.getElementById("paymentFormArea").style.display = "block";
  document.getElementById("editPayKey").value = key;
  document.getElementById("payKey").value = key;
  document.getElementById("payKey").disabled = true; // ID change not allowed
  document.getElementById("payName").value = p.name || "";
  document.getElementById("payIcon").value = p.icon || "";
  document.getElementById("payNumber").value = p.number || "";
  document.getElementById("payDetails").value = p.details || "";
  document.getElementById("payOrder").value = p.order || 0;
  document.getElementById("payActive").checked = p.active !== false;
};

window.savePayment = async function() {
  const editKey = document.getElementById("editPayKey").value;
  const key = editKey || document.getElementById("payKey").value.trim().toLowerCase().replace(/\s+/g, '_');
  
  if (!key) return alert("❌ একটি Unique ID দিন (যেমন: bkash, upi)");
  
  const payload = {
    name: document.getElementById("payName").value.trim() || "Payment",
    icon: document.getElementById("payIcon").value.trim() || "💳",
    number: document.getElementById("payNumber").value.trim(),
    details: document.getElementById("payDetails").value.trim(),
    order: parseInt(document.getElementById("payOrder").value) || 0,
    active: document.getElementById("payActive").checked
  };

  try {
    const updates = {};
    updates[`settings/payments/${key}`] = payload;
    
    // If key changed (not possible now as disabled, but for safety) or new
    if (editKey && editKey !== key) {
      updates[`settings/payments/${editKey}`] = null; // Delete old
    }

    await update(ref(db), updates);
    alert("✅ সফলভাবে সেভ হয়েছে!");
    hidePaymentForm();
    window.initPaymentAdmin(); // Reload list
  } catch (error) {
    alert("❌ সেভ করতে ব্যর্থ: " + error.message);
  }
};

window.toggleActive = async function(key, newStatus) {
  try {
    const cur = (await get(ref(db, "settings/payments/"+key))).val();
    if (cur && typeof cur === "object") {
      await update(ref(db), { ["settings/payments/"+key+"/active"]: newStatus });
    } else {
      await set(ref(db, "settings/paymentsMeta/"+key), { active: newStatus });
    }
    window.initPaymentAdmin();
  } catch (error) {
    alert("❌ এরর: " + error.message);
  }
};

window.deletePayment = async function(key) {
  if (confirm(`⚠️ আপনি কি নিশ্চিত "${key}" ডিলিট করতে চান? এটি ফিরিয়ে আনা যাবে না।`)) {
    try {
      await remove(ref(db, `settings/payments/${key}`));
      window.initPaymentAdmin();
    } catch (error) {
      alert("❌ ডিলিট করতে ব্যর্থ: " + error.message);
    }
  }
};
