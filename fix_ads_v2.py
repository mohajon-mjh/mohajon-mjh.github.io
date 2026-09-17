print("🔧 admin-ads-control.js: function add() start এ return")

with open("admin-ads-control.js", "r", encoding="utf-8") as f:
    c = f.read()

# Exact match — function add() start এ return ঢুকানো
old = '''function add(){
  if(document.getElementById("adsCtrlBtn"))return;
 var b=document.createElement("button");b.id="adsCtrlBtn";'''

new = '''function add(){
  /* creator-disabled-v2 */ return;
  if(document.getElementById("adsCtrlBtn"))return;
 var b=document.createElement("button");b.id="adsCtrlBtn";'''

if old in c:
    c = c.replace(old, new, 1)
    with open("admin-ads-control.js", "w", encoding="utf-8") as f:
        f.write(c)
    print("✅ function add() start এ return বসানো হয়েছে")
    print("✅ LOCAL PROOF:", "creator-disabled-v2" in open("admin-ads-control.js").read())
else:
    print("❌ Exact pattern not found — trying flexible match")
    # Try with more flexible whitespace
    import re
    pattern = r'function add\(\)\{\s*if\(document\.getElementById\("adsCtrlBtn"\)\)return;\s*var b=document\.createElement\("button"\);b\.id="adsCtrlBtn";'
    replacement = 'function add(){\n  /* creator-disabled-v2 */ return;\n  if(document.getElementById("adsCtrlBtn"))return;\n var b=document.createElement("button");b.id="adsCtrlBtn";'
    c_new = re.sub(pattern, replacement, c, count=1)
    if c_new != c:
        with open("admin-ads-control.js", "w", encoding="utf-8") as f:
            f.write(c_new)
        print("✅ Regex match করে return বসানো হয়েছে")
        print("✅ LOCAL PROOF:", "creator-disabled-v2" in open("admin-ads-control.js").read())
    else:
        print("❌ কিছুই match করেনি")

