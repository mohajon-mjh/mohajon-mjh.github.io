import json
import urllib.request
import urllib.parse
import os
import base64
import time
import sys
from datetime import datetime
from concurrent.futures import ThreadPoolExecutor, as_completed
import threading

print("=" * 70)
print("🚀 CLOUDINARY MIGRATION - 252 Base64 Images")
print("=" * 70)

# Configuration
DB = "https://mohajon-mjh-default-rtdb.firebaseio.com"
CLOUD_NAME = "fd70754d"
UPLOAD_PRESET = "mohajon-mjh"
MAX_WORKERS = 5
PROGRESS_FILE = "migration_progress.json"
BACKUP_FILE = f"firebase_backup_{datetime.now().strftime('%Y%m%d_%H%M%S')}.json"

# Load products
print("\n📡 Loading products from Firebase...")
try:
    all_products = json.load(urllib.request.urlopen(f"{DB}/products.json", timeout=60))
    print(f"   ✅ Loaded {len(all_products)} products")
except Exception as e:
    print(f"   ❌ Error: {e}")
    sys.exit(1)

# Find base64 products
print("\n🔍 Finding base64 products...")
base64_products = []
already_cloudinary = []

for pid, p in all_products.items():
    imgs = p.get('images', {})
    if not isinstance(imgs, dict):
        continue
    
    main_img = imgs.get('main', '')
    if not main_img:
        continue
    
    # Check if already Cloudinary URL
    if isinstance(main_img, str) and main_img.startswith('https://res.cloudinary.com/'):
        already_cloudinary.append({
            'id': pid,
            'title': p.get('title', 'Unknown'),
            'url': main_img
        })
        continue
    
    # Check if base64
    if isinstance(main_img, str) and main_img.startswith('data:image'):
        base64_products.append({
            'id': pid,
            'title': p.get('title', 'Unknown'),
            'base64': main_img,
            'has_png': os.path.exists(f"product_images/{pid}.png")
        })

print(f"   ✅ Base64 products to migrate: {len(base64_products)}")
print(f"   ⏭️  Already Cloudinary (skip): {len(already_cloudinary)}")

if len(base64_products) == 0:
    print("\n✅ Nothing to migrate! All images already on Cloudinary.")
    sys.exit(0)

# Backup current state
print(f"\n💾 Creating backup: {BACKUP_FILE}")
backup_data = {
    'timestamp': datetime.now().isoformat(),
    'products': {p['id']: {'title': p['title'], 'base64_preview': p['base64'][:100] + '...'} for p in base64_products}
}
with open(BACKUP_FILE, 'w', encoding='utf-8') as f:
    json.dump(backup_data, f, ensure_ascii=False, indent=2)
print(f"   ✅ Backup saved")

# Load progress
progress = {'completed': [], 'failed': []}
if os.path.exists(PROGRESS_FILE):
    with open(PROGRESS_FILE, 'r') as f:
        progress = json.load(f)
    print(f"\n📊 Resuming from previous progress:")
    print(f"   • Completed: {len(progress['completed'])}")
    print(f"   • Failed: {len(progress['failed'])}")

# Filter out already completed
remaining = [p for p in base64_products if p['id'] not in progress['completed'] and p['id'] not in progress['failed']]
print(f"   • Remaining to process: {len(remaining)}")

if len(remaining) == 0:
    print("\n✅ All products already processed!")
    sys.exit(0)

# Upload function
def upload_product(product):
    pid = product['id']
    title = product['title']
    
    try:
        # Check if PNG exists
        if not product['has_png']:
            # Decode base64 to PNG
            base64_data = product['base64']
            if ',' in base64_data:
                base64_data = base64_data.split(',')[1]
            
            img_bytes = base64.b64decode(base64_data)
            png_path = f"/tmp/{pid}.png"
            with open(png_path, 'wb') as f:
                f.write(img_bytes)
        else:
            png_path = f"product_images/{pid}.png"
        
        # Upload to Cloudinary
        with open(png_path, 'rb') as f:
            img_data = f.read()
        
        boundary = '----WebKitFormBoundary' + str(int(time.time() * 1000))
        body = []
        
        # Add file
        body.append(f'--{boundary}'.encode())
        body.append(f'Content-Disposition: form-data; name="file"; filename="{pid}.png"'.encode())
        body.append(b'Content-Type: image/png')
        body.append(b'')
        body.append(img_data)
        
        # Add upload_preset
        body.append(f'--{boundary}'.encode())
        body.append(b'Content-Disposition: form-data; name="upload_preset"')
        body.append(b'')
        body.append(UPLOAD_PRESET.encode())
        
        body.append(f'--{boundary}--'.encode())
        
        body_bytes = b'\r\n'.join(body)
        
        req = urllib.request.Request(
            f'https://api.cloudinary.com/v1_1/{CLOUD_NAME}/image/upload',
            data=body_bytes,
            method='POST',
            headers={
                'Content-Type': f'multipart/form-data; boundary={boundary}'
            }
        )
        
        response = urllib.request.urlopen(req, timeout=30)
        result = json.loads(response.read())
        
        cloudinary_url = result.get('secure_url')
        if not cloudinary_url:
            raise Exception(f"No secure_url in response: {result}")
        
        # Update Firebase
        update_data = json.dumps(cloudinary_url).encode('utf-8')
        update_req = urllib.request.Request(
            f'{DB}/products/{pid}/images/main.json',
            data=update_data,
            method='PUT',
            headers={'Content-Type': 'application/json'}
        )
        urllib.request.urlopen(update_req, timeout=15)
        
        # Cleanup temp file
        if not product['has_png'] and os.path.exists(png_path):
            os.remove(png_path)
        
        return {
            'id': pid,
            'title': title,
            'status': 'success',
            'url': cloudinary_url
        }
        
    except Exception as e:
        return {
            'id': pid,
            'title': title,
            'status': 'error',
            'error': str(e)
        }

# Process remaining products
print(f"\n🚀 Starting migration ({len(remaining)} products, {MAX_WORKERS} parallel)...")
print("   ⏱️  Estimated time: " + str(len(remaining) // 5) + " seconds")
print("   💡 Press Ctrl+C to pause (progress will be saved)\n")

start_time = time.time()
completed_count = 0
error_count = 0

try:
    with ThreadPoolExecutor(max_workers=MAX_WORKERS) as executor:
        futures = {executor.submit(upload_product, p): p for p in remaining}
        
        for future in as_completed(futures):
            result = future.result()
            
            if result['status'] == 'success':
                progress['completed'].append(result['id'])
                completed_count += 1
                symbol = '✅'
            else:
                progress['failed'].append({'id': result['id'], 'error': result['error']})
                error_count += 1
                symbol = '❌'
            
            # Progress display
            total = completed_count + error_count
            progress_pct = (total / len(remaining)) * 100
            print(f"{symbol} [{total}/{len(remaining)}] {result['title'][:40]} - {result['status']}")
            
            # Save progress every 10 products
            if total % 10 == 0:
                with open(PROGRESS_FILE, 'w') as f:
                    json.dump(progress, f)

except KeyboardInterrupt:
    print("\n\n⏸️  Paused by user. Saving progress...")
    with open(PROGRESS_FILE, 'w') as f:
        json.dump(progress, f)
    print(f"   💾 Progress saved to {PROGRESS_FILE}")
    print(f"   🔄 Run this script again to resume")
    sys.exit(0)

# Save final progress
with open(PROGRESS_FILE, 'w') as f:
    json.dump(progress, f)

elapsed = time.time() - start_time

# Final report
print("\n" + "=" * 70)
print("📊 MIGRATION COMPLETE")
print("=" * 70)
print(f"\n⏱️  Time: {elapsed:.1f} seconds")
print(f"\n✅ Successfully migrated: {completed_count}")
print(f"⏭️  Skipped (already Cloudinary): {len(already_cloudinary)}")
print(f"❌ Failed: {error_count}")

if error_count > 0:
    print(f"\n❌ Failed products:")
    for fail in progress['failed'][-10:]:  # Show last 10
        print(f"   • {fail['id']}: {fail['error'][:80]}")

print(f"\n💾 Backup: {BACKUP_FILE}")
print(f"📊 Progress: {PROGRESS_FILE}")

print("\n🎯 Next steps:")
print("   1. Test 5-10 products on your site")
print("   2. If all good, delete backup + progress files")
print("   3. If issues, rollback using backup file")

