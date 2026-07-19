import { initializeApp, getApps, getApp } from "https://www.gstatic.com/firebasejs/12.0.0/firebase-app.js";
import { getDatabase, ref, onValue, get } from "https://www.gstatic.com/firebasejs/12.0.0/firebase-database.js";

const firebaseConfig = {
  apiKey: "AIzaSyDj_LLHWBgcKfQClnaOUqEtULHhP1vSVxw",
  authDomain: "mohajon-mjh.firebaseapp.com",
  databaseURL: "https://mohajon-mjh-default-rtdb.firebaseio.com",
  projectId: "mohajon-mjh",
  storageBucket: "mohajon-mjh.firebasestorage.app",
  messagingSenderId: "526105903976",
  appId: "1:526105903976:web:f9321c6d68ecbd19d58cdd"
};

const app = getApps().length ? getApp() : initializeApp(firebaseConfig);
const db = getDatabase(app);

/* বেস কারেন্সি: BDT (সব দাম ডাটাবেসে BDT-তে সেভ থাকে) */
const CURRENCY_INFO = {
  BDT: { symbol: "৳", name: "Bangladeshi Taka" },
  USD: { symbol: "$", name: "US Dollar" },
  SAR: { symbol: "﷼", name: "Saudi Riyal" },
  MYR: { symbol: "RM", name: "Malaysian Ringgit" }
};

/* ডিফল্ট rate (Admin আপডেট না করলে এগুলো ব্যবহার হবে) */
let currentRates = {
  BDT: 1,
  USD: 110,
  SAR: 29.3,
  MYR: 23.5
};

let ratesLoaded = false;
let ratesLoadCallbacks = [];

function loadRates(){
  onValue(ref(db, "settings/currencyRates"), (snapshot) => {
    if(snapshot.exists()){
      const data = snapshot.val();
      currentRates = { BDT: 1, ...data };
    }
    ratesLoaded = true;
    ratesLoadCallbacks.forEach(cb => cb());
    ratesLoadCallbacks = [];
    document.dispatchEvent(new CustomEvent("currencyRatesLoaded"));
  });
}
loadRates();

function getSelectedCurrency(){
  return localStorage.getItem("selectedCurrency") || "BDT";
}

function setSelectedCurrency(code){
  localStorage.setItem("selectedCurrency", code);
  document.dispatchEvent(new CustomEvent("currencyChanged", { detail: { currency: code } }));
}

/* priceBDT: BDT-তে সেভ করা আসল দাম। রিটার্ন করে ফরম্যাট করা স্ট্রিং যেমন "$13.45" */
function formatPrice(priceBDT){
  const code = getSelectedCurrency();
  const rate = currentRates[code] || 1;
  const info = CURRENCY_INFO[code] || CURRENCY_INFO.BDT;
  const converted = code === "BDT" ? (parseFloat(priceBDT) || 0) : (parseFloat(priceBDT) || 0) / rate;
  return `${info.symbol}${converted.toFixed(2)}`;
}

function convertPrice(priceBDT){
  const code = getSelectedCurrency();
  const rate = currentRates[code] || 1;
  return code === "BDT" ? (parseFloat(priceBDT) || 0) : (parseFloat(priceBDT) || 0) / rate;
}

window.MJHCurrency = {
  CURRENCY_INFO,
  getSelectedCurrency,
  setSelectedCurrency,
  formatPrice,
  convertPrice,
  getRates: () => currentRates
};

console.log("MJH Currency System Ready");
