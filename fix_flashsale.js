const DB_URL = "https://mohajon-mjh-default-rtdb.firebaseio.com";
const API_KEY = "AIzaSyDj_LLHWBgcKfQClnaOUqEtULHhP1vSVxw";
const ADMIN_EMAIL = "mohajonmjh@gmail.com";
const ADMIN_PASSWORD = "Mjh@Mohajon$1975";

async function main(){
  const authRes = await fetch(`https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${API_KEY}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email: ADMIN_EMAIL, password: ADMIN_PASSWORD, returnSecureToken: true })
  });
  const authData = await authRes.json();
  const idToken = authData.idToken;

  // ভুল পুরনো Dates Gift Box এন্ট্রি ডিলিট
  const delRes = await fetch(`${DB_URL}/products/-OyX4AOjxrHjNQ0veyg1.json?auth=${idToken}`, { method: "DELETE" });
  console.log(delRes.ok ? "✅ পুরনো ভুল Dates Gift Box (৳500) ডিলিট হয়েছে" : "❌ ডিলিট ব্যর্থ");

  // Global Discount 40% সেভ
  const setRes = await fetch(`${DB_URL}/settings/flashSaleGlobalDiscount.json?auth=${idToken}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(40)
  });
  console.log(setRes.ok ? "✅ Global Discount 40% সেভ হয়েছে" : "❌ সেভ ব্যর্থ");
}

main().catch(err => console.error("❌", err.message));
