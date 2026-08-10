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

  const catIds = ["-Oyxb9C2sczQEh7NA2Ez", "-Oyxb9G7jRs3ebu4aApZ", "-Oyxb9KLNTILlB5DCJ05"];
  for (const catId of catIds) {
    const res = await fetch(`${DB_URL}/products.json?auth=${idToken}&orderBy="categoryId"&equalTo="${catId}"`);
    const data = await res.json();
    console.log(`\n--- categoryId: ${catId} ---`);
    console.log(JSON.stringify(data, null, 2));
  }
}

main().catch(err => console.error("এরর:", err.message));
