import os
import shutil

print("=" * 70)
print("🧹 CLEANING UP TEMPORARY FILES")
print("=" * 70)

# Files to delete (helper scripts + backups)
to_delete = [
    'audit_product_details.sh',
    'audit_homepage.sh',
    'check_categories.py',
    'debug_buy_more.py',
    'debug_buy_more2.py',
    'debug_deep.py',
    'debug_mega_offers.py',
    'debug_rendering.py',
    'fix_currency_product.py',
    'fix_global_and_currency.py',
    'fix_mega_offers.py',
    'fix_price_sync.py',
    'fix_special_categories.py',
    'fix_global_bug.py',
    'final_universal_fix.py',
    'final_combined_fix.py',
    'optimize_homepage.py',
    'check_global.py',
    'fast_solar_scan.py',
    'professional_upgrade.py',
]

# Backup files (keep locally but remove from git)
backup_files = [f for f in os.listdir('.') if f.endswith('.backup') or '.backup_' in f or f.endswith('_curr') or f.endswith('_price')]

print("\n📄 Deleting helper scripts...")
deleted = 0
for f in to_delete:
    if os.path.exists(f):
        os.remove(f)
        print(f"   ❌ Removed: {f}")
        deleted += 1

print(f"\n✅ Deleted {deleted} helper scripts")

# Move backups to a separate folder
if backup_files:
    backup_dir = 'local_backups'
    os.makedirs(backup_dir, exist_ok=True)
    print(f"\n📦 Moving {len(backup_files)} backup files to {backup_dir}/...")
    for f in backup_files:
        if os.path.exists(f):
            shutil.move(f, os.path.join(backup_dir, f))
            print(f"   📁 Moved: {f}")
    
    # Create .gitignore for local_backups
    with open(os.path.join(backup_dir, '.gitignore'), 'w') as f:
        f.write("*\n!.gitignore\n")
    print(f"   ✅ Created .gitignore (won't be pushed)")

print("\n" + "=" * 70)
print("✅ CLEANUP COMPLETE")
print("=" * 70)
print("\n💡 Note: Backup files are in local_backups/ folder (not in git)")

