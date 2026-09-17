import re

print("🔧 Creator script গুলো source থেকে মুছে ফেলা")

with open("admin.html", "r", encoding="utf-8") as f:
    c = f.read()

# 1. cat-control-btn script block (🎛️ ক্যাটাগরি অন/অফ floating button)
p1 = r'<script>/\*cat-control-btn\*/\(function\(\).*?document\.body\.appendChild\(b\);\}if\(document\.readyState==="loading"\)document\.addEventListener\("DOMContentLoaded",add\);else add\(\);\}\)\(\);</script>'
n1 = len(re.findall(p1, c, flags=re.DOTALL))
c = re.sub(p1, '<!-- cat-control-btn script deleted -->', c, flags=re.DOTALL)

# 2. দাম অটো-ফিক্স creator (bottom:60px right:16px)
p2 = r'<script>\(function\(\)\{var b=document\.createElement\("button"\);[^<]*?innerHTML[^<]*?দাম[^<]*?bottom:60px[^<]*?document\.body\.appendChild\(b\);\}[^<]*?\}\)\(\);</script>'
n2 = len(re.findall(p2, c, flags=re.DOTALL))
c = re.sub(p2, '<!-- auto-price creator deleted -->', c, flags=re.DOTALL)

# 3. এড বক creator (bottom:120px right:16px)
p3 = r'<script>\(function\(\)\{var b=document\.createElement\("button"\);[^<]*?innerHTML[^<]*?এড[^<]*?bottom:120px[^<]*?document\.body\.appendChild\(b\);\}[^<]*?\}\)\(\);</script>'
n3 = len(re.findall(p3, c, flags=re.DOTALL))
c = re.sub(p3, '<!-- ad-block creator deleted -->', c, flags=re.DOTALL)

# 4. sidebar freeze (v5) - order lock
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
if "mjh-sidebar-freeze-v5" not in c:
    idx = c.rfind("</html>")
    c = (c[:idx] + freeze + c[idx:]) if idx > -1 else c + freeze

with open("admin.html", "w", encoding="utf-8") as f:
    f.write(c)

print(f"✅ admin.html: cat-control={n1}, auto-price={n2}, ad-block={n3} creator deleted")

# social-studio.js - floating button disable (modal/toast অক্ষত)
with open("social-studio.js", "r", encoding="utf-8") as f:
    s = f.read()

if "/* ss-float-disabled */" not in s:
    # floating button creation block — wrap in comment
    # Match: var b=createElement + style(bottom:230px right:10px) + onclick + appendChild
    s_new = re.sub(
        r'(var b=document\.createElement\("button"\);[\s\S]*?b\.style\.cssText="position:fixed;bottom:230px;right:10px[\s\S]*?document\.body\.appendChild\(b\);)',
        r'/* ss-float-disabled */ /* \1 */',
        s,
        flags=re.DOTALL
    )
    if s_new != s:
        s = s_new
        with open("social-studio.js", "w", encoding="utf-8") as f:
            f.write(s)
        print("✅ social-studio.js: floating button creator disabled (modal intact)")
    else:
        print("⚠️  social-studio pattern পাওয়া যায়নি")

# LIVE PROOF: creator code গুলো আর নেই
print("\n=== LIVE PROOF ===")
print("cat-control-btn script:", "<!-- cat-control-btn script deleted -->" in open("admin.html", encoding="utf-8").read())
print("auto-price creator:", "<!-- auto-price creator deleted -->" in open("admin.html", encoding="utf-8").read())
print("ad-block creator:", "<!-- ad-block creator deleted -->" in open("admin.html", encoding="utf-8").read())
print("sidebar-freeze-v5:", "mjh-sidebar-freeze-v5" in open("admin.html", encoding="utf-8").read())
print("ss-float-disabled:", "ss-float-disabled" in open("social-studio.js", encoding="utf-8").read())

