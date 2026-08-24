with open("index.html", "r", encoding="utf-8") as f:
    content = f.read()

report = []

def replace_once(content, old, new, label):
    n = content.count(old)
    if n != 1:
        report.append(f"❌ {label}: {n} বার পাওয়া গেছে (দরকার ১ বার) — SKIP")
        return content, False
    content = content.replace(old, new, 1)
    report.append(f"✅ {label}: ঠিক হয়েছে")
    return content, True

old = '''import { getDatabase, ref, onValue, query, orderByChild, limitToLast, endBefore } from "https://www.gstatic.com/firebasejs/12.0.0/firebase-database.js";

const fsFirebaseConfig = {'''
new = '''import { getDatabase, ref, onValue, query, orderByChild, equalTo, limitToFirst } from "https://www.gstatic.com/firebasejs/12.0.0/firebase-database.js";

const fsFirebaseConfig = {'''
content, ok = replace_once(content, old, new, "Flash Sale import (scoped to fsFirebaseConfig block)")

with open("index.html", "w", encoding="utf-8") as f:
    f.write(content)

print("\n".join(report))
