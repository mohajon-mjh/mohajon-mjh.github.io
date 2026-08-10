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
  const idToken = loginData.idToken;

  // Fetch products where isTrending == true, limit a few
  const res = await fetch(`${DB_URL}/products.json?auth=${idToken}&orderBy="isTrending"&equalTo=true&limitToFirst=2`);
  const data = await res.json();
  console.log("Trending প্রোডাক্ট নমুনা:");
  console.log(JSON.stringify(data, null, 2));
}

main().catch(err => console.error("এরর:", err.message));
