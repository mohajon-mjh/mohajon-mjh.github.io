import json
import urllib.request
import html
import os

print("=" * 70)
print("🖼️  GENERATING BASE64 IMAGE PREVIEW")
print("=" * 70)

DB = "https://mohajon-mjh-default-rtdb.firebaseio.com"

# Fetch all products
print("\n📡 Fetching products from Firebase...")
data = json.load(urllib.request.urlopen(f"{DB}/products.json"))
print(f"   ✅ Fetched {len(data)} products")

# Find base64 images
print("\n🔍 Scanning for base64 images...")
images_data = []
for pid, p in data.items():
    imgs = p.get('images', {})
    if isinstance(imgs, dict):
        main_img = imgs.get('main', '')
        if isinstance(main_img, str) and main_img.startswith('data:image'):
            images_data.append({
                'id': pid,
                'title': p.get('title', 'Unknown'),
                'price': p.get('price', 0),
                'image': main_img,
                'status': p.get('status', 'unknown')
            })

print(f"   ✅ Found {len(images_data)} base64 images")

# Generate HTML
print("\n📝 Generating HTML preview...")
html_content = f'''<!DOCTYPE html>
<html lang="bn">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Base64 Images Preview - {len(images_data)} images</title>
    <style>
        * {{ margin: 0; padding: 0; box-sizing: border-box; }}
        body {{ 
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
            background: #f5f5f5;
            padding: 20px;
        }}
        h1 {{ 
            text-align: center;
            margin-bottom: 20px;
            color: #333;
        }}
        .stats {{
            text-align: center;
            background: #fff;
            padding: 15px;
            border-radius: 8px;
            margin-bottom: 20px;
            box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        }}
        .grid {{
            display: grid;
            grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
            gap: 20px;
        }}
        .card {{
            background: #fff;
            border-radius: 12px;
            overflow: hidden;
            box-shadow: 0 2px 8px rgba(0,0,0,0.1);
            cursor: pointer;
            transition: transform 0.2s;
        }}
        .card:hover {{
            transform: translateY(-4px);
            box-shadow: 0 4px 16px rgba(0,0,0,0.15);
        }}
        .card img {{
            width: 100%;
            height: 200px;
            object-fit: cover;
        }}
        .card-info {{
            padding: 15px;
        }}
        .card-title {{
            font-weight: 600;
            margin-bottom: 8px;
            color: #333;
        }}
        .card-meta {{
            font-size: 12px;
            color: #666;
        }}
        .card-id {{
            font-family: monospace;
            font-size: 11px;
            color: #999;
            margin-top: 4px;
        }}
        .status {{
            display: inline-block;
            padding: 2px 8px;
            border-radius: 4px;
            font-size: 11px;
            font-weight: 600;
        }}
        .status.active {{ background: #d4edda; color: #155724; }}
        .status.draft {{ background: #fff3cd; color: #856404; }}
        
        /* Modal */
        .modal {{
            display: none;
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0,0,0,0.9);
            z-index: 1000;
            align-items: center;
            justify-content: center;
        }}
        .modal.active {{
            display: flex;
        }}
        .modal img {{
            max-width: 90%;
            max-height: 90%;
            border-radius: 8px;
        }}
        .modal-close {{
            position: absolute;
            top: 20px;
            right: 30px;
            font-size: 40px;
            color: #fff;
            cursor: pointer;
            background: none;
            border: none;
        }}
    </style>
</head>
<body>
    <h1>🖼️ Base64 Images Preview</h1>
    <div class="stats">
        <strong>Total Images:</strong> {len(images_data)} | 
        <strong>Click any image</strong> to view full size
    </div>
    <div class="grid">
'''

for img in images_data:
    html_content += f'''
        <div class="card" onclick="showModal('{img['image']}')">
            <img src="{img['image']}" alt="{html.escape(img['title'])}">
            <div class="card-info">
                <div class="card-title">{html.escape(img['title'])}</div>
                <div class="card-meta">
                    ৳{img['price']} 
                    <span class="status {img['status']}">{img['status']}</span>
                </div>
                <div class="card-id">ID: {img['id']}</div>
            </div>
        </div>
'''

html_content += '''
    </div>
    
    <div class="modal" id="modal" onclick="hideModal()">
        <button class="modal-close" onclick="hideModal()">&times;</button>
        <img id="modalImg" src="" alt="Full size">
    </div>
    
    <script>
        function showModal(src) {
            document.getElementById('modalImg').src = src;
            document.getElementById('modal').classList.add('active');
        }
        function hideModal() {
            document.getElementById('modal').classList.remove('active');
        }
    </script>
</body>
</html>
'''

# Save HTML file
output_file = 'base64_images_preview.html'
with open(output_file, 'w', encoding='utf-8') as f:
    f.write(html_content)

print(f"   ✅ Generated: {output_file}")
print(f"   📊 File size: {os.path.getsize(output_file) / 1024 / 1024:.2f} MB")

print("\n" + "=" * 70)
print("✅ PREVIEW READY!")
print("=" * 70)
print(f"\n📂 Open this file in your browser:")
print(f"   {os.path.abspath(output_file)}")
print("\n💡 Or run this command:")
print(f"   termux-open {output_file}")
print("\n🎯 Next steps:")
print("   1. Review all 252 images")
print("   2. Decide which to keep/replace/delete")
print("   3. Upload good ones to Firebase Storage")
print("   4. Update database with URLs")

