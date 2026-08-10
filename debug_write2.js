const API_KEY = "AIzaSyDj_LLHWBgcKfQClnaOUqEtULHhP1vSVxw";
const DB_URL = "https://mohajon-mjh-default-rtdb.firebaseio.com";
const ADMIN_EMAIL = "mohajonmjh@gmail.com";
const ADMIN_PASSWORD = "Mjh@Mohajon$1975";
const SELLER_ID = "SqVK0FFNFietVqov8la6hwSAF023";

async function main() {
  const loginRes = await fetch(`https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${API_KEY}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email: ADMIN_EMAIL, password: ADMIN_PASSWORD, returnSecureToken: true })
  });
  const loginData = await loginRes.json();
  const idToken = loginData.idToken;

  const testBody = {
    title: "TEST_DEBUG_PRODUCT_2",
    price: 100,
    categoryId: "-Oyxb9KLNTILlB5DCJ05",
    sellerId: SELLER_ID,
    stock: 20,
    status: "active",
    images: { main: "https://example.com/test.png" },
    createdAt: Date.now()
  };

  const writeRes = await fetch(`${DB_URL}/products.json?auth=${idToken}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(testBody)
  });
  const writeData = await writeRes.json();
  console.log("HTTP স্ট্যাটাস:", writeRes.status);
  console.log("রাইট রেসপন্স:", JSON.stringify(writeData));

  if (writeData.name) {
    console.log("\n✅ লেখা সফল হয়েছে! আইডি:", writeData.name);
    await fetch(`${DB_URL}/products/${writeData.name}.json?auth=${idToken}`, { method: "DELETE" });
    console.log("টেস্ট এন্ট্রি পরিষ্কার করা হলো।");
  } else {
    console.log("\n❌ এখনো ব্যর্থ হচ্ছে।");
  }
}

main().catch(err => console.error("এরর:", err.message));
