const API_KEY = "AIzaSyDj_LLHWBgcKfQClnaOUqEtULHhP1vSVxw";
const DB_URL = "https://mohajon-mjh-default-rtdb.firebaseio.com";
const ADMIN_EMAIL = "mohajonmjh@gmail.com";
const ADMIN_PASSWORD = "Mjh@Mohajon$1975";

async function loginAdmin() {
  const res = await fetch(`https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${API_KEY}`, {
    method: "POST", headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email: ADMIN_EMAIL, password: ADMIN_PASSWORD, returnSecureToken: true })
  });
  const data = await res.json();
  return data.idToken;
}

async function main() {
  const idToken = await loginAdmin();
  const res = await fetch(`${DB_URL}/products.json?auth=${idToken}`);
  const products = await res.json() || {};

  const counts = {};
  let taggedTotal = 0;
  for (const p of Object.values(products)) {
    if (p.flashCategoryId) {
      taggedTotal++;
      counts[p.flashCategoryId] = (counts[p.flashCategoryId] || 0) + 1;
    }
  }
  console.log("মোট ট্যাগ হয়েছে:", taggedTotal);
  console.log("ক্যাটাগরি অনুযায়ী:", counts);
}
main().catch(err => console.error("❌", err.message));
