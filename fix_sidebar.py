import re

print("🔧 Fixing sidebar button jumping...")

with open("admin.html", "r", encoding="utf-8") as f:
    content = f.read()

# Find the problematic lines
old_pattern = r'for\(var i=1;i<=20;i\+\+\)setTimeout\(run,i\*600\);\s*setInterval\(run,3000\);'
new_code = 'run(); // একবারই render, no repeat'

if re.search(old_pattern, content):
    content = re.sub(old_pattern, new_code, content)
    
    with open("admin.html", "w", encoding="utf-8") as f:
        f.write(content)
    
    print("✅ Fixed: sidebar re-render বন্ধ")
    print("   • Page load এ একবার render হবে")
    print("   • আর continuous re-render নেই")
    print("   • বাটন গুলো fixed position এ থাকবে")
else:
    print("❌ Pattern not found")

