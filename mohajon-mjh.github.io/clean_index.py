import re

with open('index.html', 'r', encoding='utf-8') as f:
    content = f.read()

# এই প্যাটার্নগুলো সেইসব স্ক্রিপ্ট যা আলাদা Firebase instance তৈরি করে
patterns_to_remove = [
    r'<script type="module">[\s\S]*?const trendingFirebaseConfig[\s\S]*?</script>',
    r'<script type="module">[\s\S]*?const dealsFirebaseConfig[\s\S]*?</script>',
    r'<script type="module">[\s\S]*?const scDb = getDatabase[\s\S]*?</script>',
    r'<script type="module">[\s\S]*?const featuredFirebaseConfig[\s\S]*?</script>',
    r'<script type="module">[\s\S]*?const csDb = getDatabase[\s\S]*?</script>',
    r'<script type="module">[\s\S]*?const fsDb = getDatabase[\s\S]*?</script>'
]

count = 0
for pattern in patterns_to_remove:
    matches = re.findall(pattern, content)
    count += len(matches)
    content = re.sub(pattern, '<!-- REMOVED FOR SPEED: Unified loader (home-unified.js) handles this -->', content)

with open('index.html', 'w', encoding='utf-8') as f:
    f.write(content)

print(f"✅ index.html ক্লিন করা হয়েছে। {count}টি ভারী Firebase স্ক্রিপ্ট ব্লক সরানো হয়েছে।")
