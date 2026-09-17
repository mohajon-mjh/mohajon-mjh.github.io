print("🔧 Creator fix: return কে function শুরুতে সরানো + button create comment")

# ===== 1. admin-pricefix.js =====
with open("admin-pricefix.js", "r", encoding="utf-8") as f:
    c = f.read()

old1 = '''function addBtn(){
 if(document.getElementById("priceFixBtn"))return;
 var b=document.createElement("button");b.id="priceFixBtn";b.innerHTML="💰 দাম অটো-ফিক্স";
 /* disabled-float-1 */ return; b.style.cssText="position:fixed;bottom:60px;right:16px;z-index:99999;background:#16a34a;color:#fff;border:none;border-radius:30px;padding:12px 18px;font-weight:800;font-size:14px;cursor:pointer;box-shadow:0 4px 14px rgba(0,0,0,.4)";'''

new1 = '''function addBtn(){
 /* creator-disabled-v2 */ return;
 if(document.getElementById("priceFixBtn"))return;
 var b=document.createElement("button");b.id="priceFixBtn";b.innerHTML="💰 দাম অটো-ফিক্স";
 b.style.cssText="position:fixed;bottom:60px;right:16px;z-index:99999;background:#16a34a;color:#fff;border:none;border-radius:30px;padding:12px 18px;font-weight:800;font-size:14px;cursor:pointer;box-shadow:0 4px 14px rgba(0,0,0,.4)";'''

if old1 in c:
    c = c.replace(old1, new1, 1)
    with open("admin-pricefix.js", "w", encoding="utf-8") as f:
        f.write(c)
    print("✅ admin-pricefix.js: return শুরুতে সরানো হয়েছে")
else:
    print("❌ admin-pricefix: pattern not found")

# ===== 2. admin-ads-control.js =====
with open("admin-ads-control.js", "r", encoding="utf-8") as f:
    c = f.read()

old2 = '''var b=document.createElement("button");b.id="adsCtrlBtn";
function isOff(){try{return localStorage.getItem("mjh_ads_off")==="1";}catch(e){return false;}}
function label(){var off=isOff();b.innerHTML=off?"📢 এড চালু করুন":"💰 এড বন্ধ করুন";b.style.background=off?"#16a34a":"#dc2626";}
/* disabled-float-2 */ return; b.style.cssText="position:fixed;bottom:120px;right:16px;z-index:99999;color:#fff;border:none;border-radius:30px;padding:12px 18px;font-weight:800;font-size:13px;cursor:pointer;box-shadow:0 4px 14px rgba(0,0,0,.4)";'''

new2 = '''/* creator-disabled-v2 */ return;
var b=document.createElement("button");b.id="adsCtrlBtn";
function isOff(){try{return localStorage.getItem("mjh_ads_off")==="1";}catch(e){return false;}}
function label(){var off=isOff();b.innerHTML=off?"📢 এড চালু করুন":"💰 এড বন্ধ করুন";b.style.background=off?"#16a34a":"#dc2626";}
b.style.cssText="position:fixed;bottom:120px;right:16px;z-index:99999;color:#fff;border:none;border-radius:30px;padding:12px 18px;font-weight:800;font-size:13px;cursor:pointer;box-shadow:0 4px 14px rgba(0,0,0,.4)";'''

if old2 in c:
    c = c.replace(old2, new2, 1)
    with open("admin-ads-control.js", "w", encoding="utf-8") as f:
        f.write(c)
    print("✅ admin-ads-control.js: return শুরুতে সরানো হয়েছে")
else:
    print("❌ admin-ads-control: pattern not found")

# ===== Verify =====
print("\n=== LOCAL VERIFY ===")
p1 = "creator-disabled-v2" in open("admin-pricefix.js").read()
p2 = "creator-disabled-v2" in open("admin-ads-control.js").read()
print(f"admin-pricefix: {'✅' if p1 else '❌'}")
print(f"admin-ads-control: {'✅' if p2 else '❌'}")

if p1 and p2:
    print("✅ ALL OK — commit safe")
else:
    print("❌ FAIL — no commit")

