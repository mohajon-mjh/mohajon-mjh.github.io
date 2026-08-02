with open("index.html", "r", encoding="utf-8") as f:
    content = f.read()

report = []

def replace_once(content, old, new, label):
    n = content.count(old)
    if n != 1:
        report.append(f"❌ {label}: {n} বার পাওয়া গেছে (দরকার ১ বার) — SKIP")
        return content, False
    content = content.replace(old, new, 1)
    report.append(f"✅ {label}: ঠিক হয়েছে")
    return content, True

# 1. Fix "Up To 30% Off" link
old1 = '<a href="products.html" class="cat">🔥 <span id="flashSaleLabelText">Up To 70% Off</span></a>'
new1 = '<a href="products.html?flashSale=true" class="cat">🔥 <span id="flashSaleLabelText">Up To 70% Off</span></a>'
content, ok1 = replace_once(content, old1, new1, '"Up To 30% Off" link -> products.html?flashSale=true')

# 2. Replace the fsLoadBatch logic to use indexed isFlashSale query, no Load More button (strip only)
old2 = '''const flashSaleGrid = document.getElementById("flashSaleProductsGrid");
const FS_BATCH = 30;
let fsCursor = null;
let fsDone = false;
let fsAnyShown = false;

function fsLoadBatch(){
  const q = fsCursor === null
    ? query(ref(fsDb, "products"), orderByChild("createdAt"), limitToLast(FS_BATCH))
    : query(ref(fsDb, "products"), orderByChild("createdAt"), endBefore(fsCursor), limitToLast(FS_BATCH));

  onValue(q, (snapshot) => {
    let items = [];
    snapshot.forEach(child => items.push({ id: child.key, data: child.val() }));
    if(items.length < FS_BATCH) fsDone = true;
    if(items.length > 0) fsCursor = items[0].data.createdAt;
    items.reverse();
    items.forEach(it => {
      if(it.data.status === "active" && it.data.isFlashSale === true){
        flashSaleGrid.appendChild(renderFlashSaleCard(it.id, it.data));
        fsAnyShown = true;
      }
    });
    if(!fsAnyShown && fsDone){
      flashSaleGrid.innerHTML = "<p style='text-align:center;color:#888'>এখনো কোনো Flash Sale প্রোডাক্ট যোগ করা হয়নি।</p>";
    }
    const btn = document.getElementById("flashSaleLoadMoreBtn");
    if(btn) btn.style.display = fsDone ? "none" : "inline-block";
  }, { onlyOnce: true });
}

flashSaleGrid.innerHTML = "";
fsLoadBatch();
const fsLoadMoreBtn = document.getElementById("flashSaleLoadMoreBtn");
if(fsLoadMoreBtn){
  fsLoadMoreBtn.addEventListener("click", () => fsLoadBatch());
}'''
new2 = '''const flashSaleGrid = document.getElementById("flashSaleProductsGrid");
const FS_STRIP_LIMIT = 20;

const fsQuery = query(ref(fsDb, "products"), orderByChild("isFlashSale"), equalTo(true), limitToFirst(FS_STRIP_LIMIT));
onValue(fsQuery, (snapshot) => {
  flashSaleGrid.innerHTML = "";
  let items = [];
  snapshot.forEach(child => {
    if(child.val().status === "active"){
      items.push({ id: child.key, data: child.val() });
    }
  });
  if(items.length === 0){
    flashSaleGrid.innerHTML = "<p style='text-align:center;color:#888'>এখনো কোনো Flash Sale প্রোডাক্ট যোগ করা হয়নি।</p>";
  } else {
    items.forEach(it => flashSaleGrid.appendChild(renderFlashSaleCard(it.id, it.data)));
  }
  const btn = document.getElementById("flashSaleLoadMoreBtn");
  if(btn) btn.style.display = "none";
}, { onlyOnce: true });'''
content, ok2 = replace_once(content, old2, new2, "Flash Sale homepage strip -> indexed isFlashSale query")

# 3. Update the import line to include equalTo (needed for the new query)
old3 = 'import { getDatabase, ref, onValue, query, orderByChild, limitToLast, endBefore } from "https://www.gstatic.com/firebasejs/12.0.0/firebase-database.js";'
new3 = 'import { getDatabase, ref, onValue, query, orderByChild, equalTo, limitToFirst } from "https://www.gstatic.com/firebasejs/12.0.0/firebase-database.js";'
content, ok3 = replace_once(content, old3, new3, "Flash Sale import statement (add equalTo/limitToFirst, remove unused)")

with open("index.html", "w", encoding="utf-8") as f:
    f.write(content)

print("\n".join(report))
