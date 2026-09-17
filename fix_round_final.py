print("🔧 Round Final: brute-force dedup + notes panel placement")

# ---- FIX 1: notes-manager → panel সরাসরি ডান content এ, sidebar এ নয় ----
with open("notes-manager.js", "r", encoding="utf-8") as f:
    nm = f.read()
old_nm = "logout.parentNode.insertBefore(section,logout.nextSibling);"
new_nm = "var _ct=document.querySelector('.admin-content');if(_ct){_ct.appendChild(section);}else{logout.parentNode.insertBefore(section,logout.nextSibling);}"
if old_nm in nm:
    nm = nm.replace(old_nm, new_nm, 1)
    with open("notes-manager.js", "w", encoding="utf-8") as f:
        f.write(nm)
    print("✅ Fix 1: notes panel এখন সরাসরি ডান পাশে যাবে (sidebar এ ঢুকবে না → ধাক্কা বন্ধ)")
else:
    print("⚠️  Fix 1 pattern পাওয়া যায়নি")

# ---- FIX 2: dedup v4 — brute force sweeper (parent যেখানেই হোক) ----
with open("admin.html", "r", encoding="utf-8") as f:
    c = f.read()
if "mjh-dedup-float-v4" in c:
    print("⚠️  v4 আগে থেকেই আছে")
else:
    script = '''
<script>/*mjh-dedup-float-v4*/
(function(){
 var KEY=["Social Media Post","এড বক","দাম অটো","ক্যাটাগরি অন/অফ"];
 function sweep(){
  var els=document.querySelectorAll("button,a");
  for(var i=0;i<els.length;i++){
   var el=els[i];
   if(el.closest&&el.closest("nav.admin-tabs,.admin-tabs,.admin-content"))continue;
   var st=window.getComputedStyle(el);
   if(st.position!=="fixed")continue;
   var r=el.getBoundingClientRect();
   if(r.right>window.innerWidth-60&&r.bottom>window.innerHeight-300){
    var t=(el.textContent||"").trim();
    for(var k=0;k<KEY.length;k++){if(t.indexOf(KEY[k])>-1){el.remove();break;}}
   }
  }
 }
 setTimeout(sweep,500);setTimeout(sweep,1500);
 setInterval(sweep,3000);
})();
</script>'''
    idx = c.rfind("</html>")
    c = c[:idx] + script + c[idx:] if idx > -1 else c + script
    with open("admin.html", "w", encoding="utf-8") as f:
        f.write(c)
    with open("admin.html", "r", encoding="utf-8") as f:
        print("✅ LOCAL PROOF v4:", "mjh-dedup-float-v4" in f.read())

