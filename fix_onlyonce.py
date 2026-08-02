import re

with open("index.html", "r", encoding="utf-8") as f:
    content = f.read()

report = []

def count(marker):
    return content.count(marker)

def add_onlyonce_after_callback(content, start_marker, label):
    n = content.count(start_marker)
    if n != 1:
        report.append(f"❌ {label}: start_marker পাওয়া গেছে {n} বার (দরকার ১ বার) — SKIP করা হলো")
        return content, False
    idx = content.find(start_marker)
    pos = idx + len(start_marker)
    depth = 1
    i = pos
    while i < len(content) and depth > 0:
        if content[i] == '{':
            depth += 1
        elif content[i] == '}':
            depth -= 1
        i += 1
    if depth != 0:
        report.append(f"❌ {label}: matching বন্ধনী খুঁজে পাওয়া যায়নি — SKIP")
        return content, False
    close_brace_pos = i
    j = content.find(')', close_brace_pos)
    if j == -1:
        report.append(f"❌ {label}: ')' খুঁজে পাওয়া যায়নি — SKIP")
        return content, False
    between = content[close_brace_pos:j]
    if between.strip() != '':
        report.append(f"❌ {label}: অপ্রত্যাশিত কনটেন্ট পাওয়া গেছে মাঝে — SKIP")
        return content, False
    new_content = content[:j] + ", { onlyOnce: true }" + content[j:]
    report.append(f"✅ {label}: onlyOnce যোগ হয়েছে")
    return new_content, True

# --- Target A: Deals Of The Day ---
content, ok_a = add_onlyonce_after_callback(
    content,
    'onValue(dealsQuery, (snapshot) => {',
    "Deals Of The Day"
)

# --- Target B: Featured Products ---
old_import = 'import { getDatabase, ref, onValue, query, orderByChild, equalTo } from "https://www.gstatic.com/firebasejs/12.0.0/firebase-database.js";'
if count(old_import) == 1:
    content = content.replace(old_import, 'import { getDatabase, ref, onValue, query, orderByChild, equalTo, limitToFirst } from "https://www.gstatic.com/firebasejs/12.0.0/firebase-database.js";', 1)
    report.append("✅ Featured Products: import এ limitToFirst যোগ হয়েছে")
else:
    report.append(f"❌ Featured Products import: {count(old_import)} বার পাওয়া গেছে — SKIP")

old_fq = 'const featuredQuery = query(ref(db,"products"), orderByChild("isFeatured"), equalTo(true));'
if count(old_fq) == 1:
    content = content.replace(old_fq, 'const featuredQuery = query(ref(db,"products"), orderByChild("isFeatured"), equalTo(true), limitToFirst(30));', 1)
    report.append("✅ Featured Products: limitToFirst(30) যোগ হয়েছে")
else:
    report.append(f"❌ featuredQuery লাইন: {count(old_fq)} বার পাওয়া গেছে — SKIP")

content, ok_b = add_onlyonce_after_callback(
    content,
    'onValue(featuredQuery,(snapshot)=>{',
    "Featured Products onValue"
)

# --- Target C: Coming Soon ---
content, ok_c = add_onlyonce_after_callback(
    content,
    'onValue(ref(csDb, "futureProducts"), (snapshot)=>{',
    "Coming Soon"
)

with open("index.html", "w", encoding="utf-8") as f:
    f.write(content)

print("\n".join(report))
