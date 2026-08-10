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
  console.log("লগইন ঠিক আছে, টেস্ট রাইট করছি...");

  const testBody = {
    title: "TEST_DEBUG_PRODUCT",
    price: 100,
    categoryId: "-Oyxb9KLNTILlB5DCJ05",
    slug: "test-debug-product",
    imageUrl: "https://example.com/test.png",
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
    console.log("\n✅ লেখা সফল হয়েছে, আইডি:", writeData.name);
    // Now try to read it back
    const readRes = await fetch(`${DB_URL}/products/${writeData.name}.json?auth=${idToken}`);
    const readData = await readRes.json();
    console.log("পড়ে যাচাই করা হলো:", JSON.stringify(readData));
    // Clean up test entry
    await fetch(`${DB_URL}/products/${writeData.name}.json?auth=${idToken}`, { method: "DELETE" });
    console.log("টেস্ট এন্ট্রি ডিলিট করা হলো (পরিষ্কার)।");
  } else {
    console.log("\n❌ লেখা ব্যর্থ হয়েছে — এটাই মূল সমস্যা");
  }
}

main().catch(err => console.error("এরর:", err.message));
