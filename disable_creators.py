print("🔧 Creator disable (exact substring, no regex)")

results = {}

# ===== 1. admin-pricefix.js =====
with open("admin-pricefix.js", "r", encoding="utf-8") as f:
    c = f.read()
needle1 = 'b.style.cssText="position:fixed;bottom:60px;right:16px;z-index:99999;background:#16a34a'
if needle1 in c:
    # button creation block disable — toast keep
    c = c.replace('b.style.cssText="position:fixed;bottom:60px;right:16px',
                  '/* disabled-float-1 */ return; b.style.cssText="position:fixed;bottom:60px;right:16px', 1)
    with open("admin-pricefix.js", "w", encoding="utf-8") as f:
        f.write(c)
    results["admin-pricefix"] = "disabled-float-1" in open("admin-pricefix.js").read()
    print("✅ admin-pricefix.js: creator disabled (toast intact)")
else:
    results["admin-pricefix"] = False
    print("❌ admin-pricefix: needle not found")

# ===== 2. admin-ads-control.js =====
with open("admin-ads-control.js", "r", encoding="utf-8") as f:
    c = f.read()
needle2 = 'b.style.cssText="position:fixed;bottom:120px;right:16px;z-index:99999'
if needle2 in c:
    c = c.replace('b.style.cssText="position:fixed;bottom:120px;right:16px',
                  '/* disabled-float-2 */ return; b.style.cssText="position:fixed;bottom:120px;right:16px', 1)
    with open("admin-ads-control.js", "w", encoding="utf-8") as f:
        f.write(c)
    results["admin-ads-control"] = "disabled-float-2" in open("admin-ads-control.js").read()
    print("✅ admin-ads-control.js: creator disabled (toast intact)")
else:
    results["admin-ads-control"] = False
    print("❌ admin-ads-control: needle not found")

# ===== 3. social-studio.js =====
with open("social-studio.js", "r", encoding="utf-8") as f:
    c = f.read()
needle3 = 'var b=el("button","📱 Social Media Post / Share");b.id="ssBtn";'
if needle3 in c and "ss-float-disabled" not in c:
    # wrap button creation block in comment (line 10-14)
    c = c.replace(
        'if(document.getElementById("ssBtn"))return;\n var b=el("button","📱 Social Media Post / Share");b.id="ssBtn";\n b.style.cssText="position:fixed;bottom:230px;right:10px;z-index:99998;padding:12px 16px;background:#16a34a;color:#fff;border:none;border-radius:30px;font-weight:800;cursor:pointer;font-size:14px;box-shadow:0 4px 14px rgba(0,0,0,.4)";\n b.onclick=function(){if(document.getElementById("ssModal"))document.getElementById("ssModal").remove();openStudio();};\n document.body.appendChild(b);',
        '/* ss-float-disabled */\n return;\n if(document.getElementById("ssBtn"))return;\n var b=el("button","📱 Social Media Post / Share");b.id="ssBtn";\n b.style.cssText="position:fixed;bottom:230px;right:10px;z-index:99998;padding:12px 16px;background:#16a34a;color:#fff;border:none;border-radius:30px;font-weight:800;cursor:pointer;font-size:14px;box-shadow:0 4px 14px rgba(0,0,0,.4)";\n b.onclick=function(){if(document.getElementById("ssModal"))document.getElementById("ssModal").remove();openStudio();};\n document.body.appendChild(b);'
    )
    with open("social-studio.js", "w", encoding="utf-8") as f:
        f.write(c)
    results["social-studio"] = "ss-float-disabled" in open("social-studio.js").read()
    print("✅ social-studio.js: button disabled (modal intact)")
else:
    results["social-studio"] = "ss-float-disabled" in open("social-studio.js").read() if needle3 not in c else False
    print(f"{'✅' if results['social-studio'] else '❌'} social-studio: {'already done' if 'ss-float-disabled' in open('social-studio.js').read() else 'needle not found'}")

# ===== 4. admin.html sidebar freeze =====
with open("admin.html", "r", encoding="utf-8") as f:
    c = f.read()
if "mjh-sidebar-freeze-v5" not in c:
    freeze = '''
<script>/*mjh-sidebar-freeze-v5*/
(function(){
 function nav(){return document.querySelector("nav.admin-tabs")||document.querySelector(".admin-tabs");}
 var canon=null;
 setTimeout(function(){
  var n=nav(); if(!n)return;
  canon=Array.prototype.slice.call(n.children);
  try{
   new MutationObserver(function(){
    if(!canon)return;
    var cur=Array.prototype.slice.call(n.children);
    var sameSet=cur.length===canon.length&&cur.every(function(e){return canon.indexOf(e)>-1;});
    if(!sameSet){canon=cur;return;}
    if(!cur.every(function(e,i){return e===canon[i];})){canon.forEach(function(e){n.appendChild(e);});}
   }).observe(n,{childList:true});
  }catch(e){}
 },4500);
})();
</script>'''
    idx = c.rfind("</html>")
    c = (c[:idx] + freeze + c[idx:]) if idx > -1 else c + freeze
    with open("admin.html", "w", encoding="utf-8") as f:
        f.write(c)
    results["admin-freeze"] = "mjh-sidebar-freeze-v5" in open("admin.html").read()
    print("✅ admin.html: sidebar freeze installed")
else:
    results["admin-freeze"] = True
    print("✅ admin.html: sidebar freeze already there")

# ===== Summary =====
print("\n=== LOCAL VERIFY ===")
for k, v in results.items():
    print(f"{k}: {'✅' if v else '❌'}")

all_ok = all(results.values())
print(f"\n{'✅ ALL OK — commit safe' if all_ok else '❌ SOME FAIL — NO COMMIT'}")

