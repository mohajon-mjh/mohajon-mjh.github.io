print("🔧 admin-ads-control.js: exact fix")

with open("admin-ads-control.js", "r", encoding="utf-8") as f:
    c = f.read()

# Exact substring match
old = ''' function add(){
  if(document.getElementById("adsCtrlBtn"))return;
 var b=document.createElement("button");b.id="adsCtrlBtn";
 function isOff(){try{return localStorage.getItem("mjh_ads_off")==="1";}catch(e){return false;}}
 function label(){var off=isOff();b.innerHTML=off?"📢 এড চালু করুন":"💰 এড বন্ধ করুন";b.style.background=off?"#16a34a":"#dc2626";}
 /* disabled-float-2 */ return; b.style.cssText="position:fixed;bottom:120px;right:16px;z-index:99999;color:#fff;border:none;border-radius:30px;padding:12px 18px;font-weight:800;font-size:13px;cursor:pointer;box-shadow:0 4px 14px rgba(0,0,0,.4)";'''

new = ''' function add(){
  /* creator-disabled-v2 */ return;
  if(document.getElementById("adsCtrlBtn"))return;
 var b=document.createElement("button");b.id="adsCtrlBtn";
 function isOff(){try{return localStorage.getItem("mjh_ads_off")==="1";}catch(e){return false;}}
 function label(){var off=isOff();b.innerHTML=off?"📢 এড চালু করুন":"💰 এড বন্ধ করুন";b.style.background=off?"#16a34a":"#dc2626";}
 b.style.cssText="position:fixed;bottom:120px;right:16px;z-index:99999;color:#fff;border:none;border-radius:30px;padding:12px 18px;font-weight:800;font-size:13px;cursor:pointer;box-shadow:0 4px 14px rgba(0,0,0,.4)";'''

if old in c:
    c = c.replace(old, new, 1)
    with open("admin-ads-control.js", "w", encoding="utf-8") as f:
        f.write(c)
    print("✅ admin-ads-control.js: return শুরুতে সরানো হয়েছে")
    print("✅ LOCAL PROOF:", "creator-disabled-v2" in open("admin-ads-control.js").read())
else:
    print("❌ Pattern not found")
    # Show what's actually there
    import re
    m = re.search(r'function add\(\)\{[^}]+return;', c, re.DOTALL)
    if m:
        print("Found:", m.group()[:200])

