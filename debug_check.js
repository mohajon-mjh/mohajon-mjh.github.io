const API_KEY = "AIzaSyDj_LLHWBgcKfQClnaOUqEtULHhP1vSVxw";
const DB_URL = "https://mohajon-mjh-default-rtdb.firebaseio.com";
const ADMIN_EMAIL = "mohajonmjh@gmail.com";
const ADMIN_PASSWORD = "Mjh@Mohajon$1975";

async function main() {
  const loginRes = await fetch(`https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${API_KEY}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email: ADMIN_EMAIL, password: ADMIN_PASSWORD, returnSecureToken: true })
  });
  const loginData = await loginRes.json();
  console.log("লগইন রেসপন্স:", loginData.idToken ? "টোকেন পাওয়া গেছে ✅ (দৈর্ঘ্য: " + loginData.idToken.length + ")" : "টোকেন নেই ❌");
  if (!loginData.idToken) {
    console.log("সম্পূর্ণ এরর:", JSON.stringify(loginData));
    return;
  }

  const idToken = loginData.idToken;

  // Try shallow fetch to count total products
  const shallowRes = await fetch(`${DB_URL}/products.json?shallow=true&auth=${idToken}`);
  const shallowData = await shallowRes.json();
  if (shallowData && typeof shallowData === "object" && !shallowData.error) {
    console.log("মোট products key সংখ্যা (shallow):", Object.keys(shallowData).length);
  } else {
    console.log("Shallow fetch এরর/খালি:", JSON.stringify(shallowData).slice(0, 300));
  }

  // Try full fetch
  const fullRes = await fetch(`${DB_URL}/products.json?auth=${idToken}`);
  const fullData = await fullRes.json();
  if (fullData && typeof fullData === "object" && !fullData.error) {
    console.log("মোট products সংখ্যা (full fetch):", Object.keys(fullData).length);
  } else {
    console.log("Full fetch এরর/খালি:", JSON.stringify(fullData).slice(0, 300));
  }
}

main().catch(err => console.error("স্ক্রিপ্ট এরর:", err.message));
