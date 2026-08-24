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
  EUR: { symbol: "€", name: "Euro" },
  GBP: { symbol: "£", name: "British Pound" },
  SAR: { symbol: "﷼", name: "Saudi Riyal" },
  AED: { symbol: "د.إ", name: "UAE Dirham" },
  QAR: { symbol: "﷼", name: "Qatari Riyal" },
  KWD: { symbol: "د.ك", name: "Kuwaiti Dinar" },
  BHD: { symbol: ".د.ب", name: "Bahraini Dinar" },
  OMR: { symbol: "﷼", name: "Omani Rial" },
  MYR: { symbol: "RM", name: "Malaysian Ringgit" },
  SGD: { symbol: "S$", name: "Singapore Dollar" },
  INR: { symbol: "₹", name: "Indian Rupee" },
  PKR: { symbol: "₨", name: "Pakistani Rupee" },
  NPR: { symbol: "₨", name: "Nepalese Rupee" },
  LKR: { symbol: "₨", name: "Sri Lankan Rupee" },
  CNY: { symbol: "¥", name: "Chinese Yuan" },
  JPY: { symbol: "¥", name: "Japanese Yen" },
  KRW: { symbol: "₩", name: "South Korean Won" },
  THB: { symbol: "฿", name: "Thai Baht" },
  IDR: { symbol: "Rp", name: "Indonesian Rupiah" },
  PHP: { symbol: "₱", name: "Philippine Peso" },
  VND: { symbol: "₫", name: "Vietnamese Dong" },
  AUD: { symbol: "A$", name: "Australian Dollar" },
  NZD: { symbol: "NZ$", name: "New Zealand Dollar" },
  CAD: { symbol: "C$", name: "Canadian Dollar" },
  CHF: { symbol: "Fr", name: "Swiss Franc" },
  SEK: { symbol: "kr", name: "Swedish Krona" },
  NOK: { symbol: "kr", name: "Norwegian Krone" },
  DKK: { symbol: "kr", name: "Danish Krone" },
  RUB: { symbol: "₽", name: "Russian Ruble" },
  TRY: { symbol: "₺", name: "Turkish Lira" },
  ZAR: { symbol: "R", name: "South African Rand" },
  EGP: { symbol: "£", name: "Egyptian Pound" },
  NGN: { symbol: "₦", name: "Nigerian Naira" },
  KES: { symbol: "KSh", name: "Kenyan Shilling" },
  BRL: { symbol: "R$", name: "Brazilian Real" },
  MXN: { symbol: "$", name: "Mexican Peso" },
  ARS: { symbol: "$", name: "Argentine Peso" },
  HKD: { symbol: "HK$", name: "Hong Kong Dollar" },
  TWD: { symbol: "NT$", name: "Taiwan Dollar" },
  ILS: { symbol: "₪", name: "Israeli Shekel" },
  JOD: { symbol: "د.ا", name: "Jordanian Dinar" },
  IQD: { symbol: "ع.د", name: "Iraqi Dinar" },
  IRR: { symbol: "﷼", name: "Iranian Rial" },
  AFN: { symbol: "؋", name: "Afghan Afghani" },
  MMK: { symbol: "K", name: "Myanmar Kyat" },
  PLN: { symbol: "zł", name: "Polish Zloty" },
  UAH: { symbol: "₴", name: "Ukrainian Hryvnia" },
  RON: { symbol: "lei", name: "Romanian Leu" },
  MAD: { symbol: "د.م.", name: "Moroccan Dirham" }
};

/* ডিফল্ট rate (Admin আপডেট না করলে এগুলো ব্যবহার হবে) */
let currentRates = {
  BDT: 1,
  USD: 110,
  EUR: 119,
  GBP: 139,
  SAR: 29.3,
  AED: 30,
  QAR: 30.2,
  KWD: 358,
  BHD: 292,
  OMR: 286,
  MYR: 23.5,
  SGD: 82,
  INR: 1.32,
  PKR: 0.39,
  NPR: 0.83,
  LKR: 0.37,
  CNY: 15.3,
  JPY: 0.75,
  KRW: 0.081,
  THB: 3.1,
  IDR: 0.007,
  PHP: 1.9,
  VND: 0.0044,
  AUD: 71,
  NZD: 65,
  CAD: 80,
  CHF: 125,
  SEK: 10.4,
  NOK: 10.2,
  DKK: 16,
  RUB: 1.15,
  TRY: 3.3,
  ZAR: 6,
  EGP: 2.25,
  NGN: 0.068,
  KES: 0.85,
  BRL: 19.5,
  MXN: 5.7,
  ARS: 0.11,
  HKD: 14.1,
  TWD: 3.4,
  ILS: 30,
  JOD: 155,
  IQD: 0.084,
  IRR: 0.0026,
  AFN: 1.55,
  MMK: 0.052,
  PLN: 27.6,
  UAH: 2.65,
  RON: 24,
  MAD: 11
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
