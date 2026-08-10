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
  console.log("লগইন সফল ✅");

  // একটা প্রোডাক্টের id বের করা
  const res = await fetch(`${DB_URL}/products.json?auth=${idToken}&orderBy="$key"&limitToFirst=1`);
  const data = await res.json();
  const pid = Object.keys(data)[0];
  console.log("টেস্ট প্রোডাক্ট ID:", pid);

  // সরাসরি সেই প্রোডাক্টের নির্দিষ্ট ফিল্ডে PATCH (root না, ছোট path)
  console.log("PATCH টেস্ট করা হচ্ছে (ছোট path)...");
  try {
    const patchRes = await fetch(`${DB_URL}/products/${pid}.json?auth=${idToken}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ testField: "hello" })
    });
    console.log("PATCH status:", patchRes.status);
    const result = await patchRes.json();
    console.log("PATCH result:", JSON.stringify(result));
  } catch (err) {
    console.log("❌ PATCH ব্যর্থ:", err.message);
  }
}
main().catch(err => console.error("❌ overall:", err.message));
