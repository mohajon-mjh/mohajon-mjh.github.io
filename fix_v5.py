print("🔧 v5: head-observer (0s kill) + sidebar freeze")

with open("admin.html", "r", encoding="utf-8") as f:
    c = f.read()

changed = False

# ---- A: head এ early observer — paint এর আগেই kill ----
head_kill = '''
<script>/*mjh-head-kill-v5*/
(function(){
 var KEY=["Social Media Post","এড বক","দাম অটো","ক্যাটাগরি অন/অফ"];
 function bad(el){
  if(!el||!el.getAttribute)return false;
  var css=el.getAttribute("style")||"";
  if(css.indexOf("position:fixed")===-1)return false;
  if(css.indexOf("right")===-1||css.indexOf("bottom")===-1)return false;
  var t=(el.textContent||"").trim();
  for(var i=0;i<KEY.length;i++){if(t.indexOf(KEY[i])>-1)return true;}
  return false;
 }
 function scan(node){
  if(bad(node)){node.remove();return;}
  if(node.querySelectorAll){Array.prototype.forEach.call(node.querySelectorAll("button,a"),function(e){if(bad(e))e.remove();});}
 }
 try{
  var mo=new MutationObserver(function(ms){
   ms.forEach(function(m){m.addedNodes.forEach(function(n){if(n.nodeType===1)scan(n);});});
  });
  mo.observe(document.documentElement,{childList:true,subtree:true});
 }catch(e){}
 document.addEventListener("DOMContentLoaded",function(){scan(document.body);});
})();
</script>'''

if "mjh-head-kill-v5" not in c:
    i = c.find("<head>")
    if i > -1:
        c = c[:i+6] + head_kill + c[i+6:]
        changed = True
        print("✅ A: head-observer বসেছে (paint এর আগে kill)")
    else:
        print("❌ <head> পাওয়া যায়নি")

# ---- B: sidebar freeze 4.5s পরে ----
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
    var sameOrder=cur.every(function(e,i){return e===canon[i];});
    if(!sameOrder){canon.forEach(function(e){n.appendChild(e);});}
   }).observe(n,{childList:true});
  }catch(e){}
 },4500);
})();
</script>'''

if "mjh-sidebar-freeze-v5" not in c:
    idx = c.rfind("</html>")
    c = c[:idx] + freeze + c[idx:] if idx > -1 else c + freeze
    changed = True
    print("✅ B: sidebar freeze বসেছে (4.5s পরে order lock)")

if changed:
    with open("admin.html", "w", encoding="utf-8") as f:
        f.write(c)
    with open("admin.html", "r", encoding="utf-8") as f:
        t = f.read()
    print("✅ LOCAL PROOF:", "mjh-head-kill-v5" in t, "mjh-sidebar-freeze-v5" in t)
else:
    print("⚠️  কিছু বদলায়নি")
