import os, tarfile, time, json, urllib.request, getpass, subprocess, io

BASE_DIR = "/sdcard/mohajon-mjh backup"
REPO = os.path.expanduser("~/mohajon-mjh.github.io")
DB_URL = "https://mohajon-mjh-default-rtdb.firebaseio.com"
API_KEY = "AIzaSyDj_LLHWBgcKfQClnaOUqEtULHhP1vSVxw"

ts = time.strftime("%Y-%m-%d_%H%M")
TAR_FILE = os.path.join(BASE_DIR, f"mohajon-mjh-backup-{ts}.tar.gz")

print(f"📦 Backup file: {TAR_FILE}")

# Firebase login
print("\n🔐 Firebase Gmail + Password দিন:")
email = input("📧 Email: ").strip()
pw = getpass.getpass("🔑 Password: ")
token = None
firebase_db = None
firebase_rules = None

try:
    data = json.dumps({"email":email,"password":pw,"returnSecureToken":True}).encode()
    req = urllib.request.Request(f"https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key={API_KEY}", data=data, headers={"Content-Type":"application/json"})
    token = json.loads(urllib.request.urlopen(req, timeout=40).read())["idToken"]
    print("✅ Login OK")
    
    # Firebase DB dump (child-key approach - 401 bypass)
    print("⏳ Firebase DB dump (child-key পদ্ধতি)...")
    keys = None
    try:
        sh = json.loads(urllib.request.urlopen(f"{DB_URL}/.json?shallow=true&auth={token}", timeout=60).read())
        keys = list(sh.keys())
        print(f"✅ Found {len(keys)} root keys")
    except Exception as e:
        print(f"⚠️ Shallow failed: {e} — using known keys")
        keys = ["settings","products","orders","users","sellers","sellerApplications","affiliates","withdrawals","commissions","notifications","bogoOffers","customSections","customSectionProducts","flashSaleCategories","flashSaleCategoryProducts","globalCategories","globalCategoryProducts","dealsOfDayCategories","dealsOfDayCategoryProducts","dealsCategories","dealsCategoryProducts","specialCategories","specialCategoryProducts","everydayLowPriceCategories","everydayLowPriceCategoryProducts","comboOffersCategories","comboOffersCategoryProducts","clearanceOutletCategories","clearanceOutletCategoryProducts","megaCategories","megaCategoryProducts","reviews","payments","paymentSettings","currency","notepad","agents","commissionAgents","couriers","pathaoOrders","carts","wishlist","counters","logs","banners","coupons","homePageProducts"]
    data = {}
    for idx, k in enumerate(keys):
        try:
            r = urllib.request.urlopen(f"{DB_URL}/{k}.json?auth={token}", timeout=120)
            data[k] = json.loads(r.read())
            print(f"  ✅ {k} ({idx+1}/{len(keys)})")
        except Exception as e:
            print(f"  ⚠️ skip {k}: {e}")
    firebase_db = json.dumps(data, ensure_ascii=False).encode()
    print(f"✅ DB: {len(firebase_db)//1024} KB ({len(data)} keys saved)")
    
    # Firebase rules dump
    print("⏳ Firebase rules...")
    try:
        firebase_rules = urllib.request.urlopen(f"{DB_URL}/.settings/rules.json?auth={token}", timeout=60).read()
        print("✅ Rules saved")
    except Exception as e:
        print("⚠️ Rules skipped:", e)
except Exception as e:
    print("❌ Login failed:", e)

# Create tar.gz
print("\n⏳ Backup তৈরি হচ্ছে...")
with tarfile.open(TAR_FILE, "w:gz") as tar:
    # 1) Site files (excluding .git)
    for root, dirs, files in os.walk(REPO):
        dirs[:] = [d for d in dirs if d not in [".git", "node_modules", "__pycache__"]]
        for f in files:
            full = os.path.join(root, f)
            rel = os.path.join("site", os.path.relpath(full, REPO))
            tar.add(full, arcname=rel)
    
    # 2) Full git repository
    print("⏳ Git bundle...")
    bundle_path = os.path.join(REPO, ".git", "bundle.tmp")
    subprocess.run(["git", "bundle", "create", bundle_path, "--all"], cwd=REPO, capture_output=True)
    if os.path.exists(bundle_path):
        tar.add(bundle_path, arcname="git/full-repo.bundle")
        os.remove(bundle_path)
    
    # 3) Firebase data
    if firebase_db:
        info = tarfile.TarInfo(name="firebase/database.json")
        info.size = len(firebase_db)
        tar.addfile(info, io.BytesIO(firebase_db))
    
    if firebase_rules:
        info = tarfile.TarInfo(name="firebase/rules.json")
        info.size = len(firebase_rules)
        tar.addfile(info, io.BytesIO(firebase_rules))
    
    # 4) Manifest with restore info
    manifest = {
        "backup_time": ts,
        "email": email,
        "firebase_url": DB_URL,
        "github_repo": "mohajon-mjh/mohajon-mjh.github.io",
        "contains": ["site files", "full git repo", "firebase database", "firebase rules"],
        "restore_instructions": "1) Clone git repo 2) Import firebase/database.json 3) Upload firebase/rules.json 4) Login with this email"
    }
    manifest_data = json.dumps(manifest, indent=2, ensure_ascii=False).encode()
    info = tarfile.TarInfo(name="manifest.json")
    info.size = len(manifest_data)
    tar.addfile(info, io.BytesIO(manifest_data))

size_mb = os.path.getsize(TAR_FILE) // 1024 // 1024
size_kb = os.path.getsize(TAR_FILE) // 1024
print(f"\n✅ BACKUP সম্পূর্ণ!")
print(f"📦 {TAR_FILE}")
print(f"📏 Size: {size_kb} KB ({size_mb} MB)")
print("⚠️ আগের backup ডিলিট হয়নি")
