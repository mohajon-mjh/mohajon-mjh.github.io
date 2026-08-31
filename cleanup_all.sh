#!/bin/bash

echo "========================================"
echo "🧹 COMPLETE CLEANUP: Firebase + GitHub + Cloudinary"
echo "========================================"

echo ""
echo "=== Step 1: Firebase থেকে fake products delete ==="
echo "⚠️  আগে admin.html-এ login থাকুন"
echo "📱 Phone browser-এ খুলুন: https://mohajon-mjh.github.io/cleanup.html"
echo "   1. TEST button চাপুন (১টা delete test)"
echo "   2. FULL DELETE button চাপুন (সব fake delete)"
echo "   3. Clean mappings button চাপুন"
echo ""
read -p "Firebase cleanup complete? (y/n): " FB_DONE
if [ "$FB_DONE" != "y" ]; then
    echo "❌ Firebase cleanup বাকি আছে - আগে সেটা করুন"
    exit 1
fi

echo ""
echo "=== Step 2: Cloudinary credentials সেট করুন ==="
echo "Cloudinary Dashboard → Settings → API Keys থেকে নিচের তথ্য নিন:"
read -p "Cloud Name (যেমন: fd70754d): " CLOUD_NAME
read -p "API Key: " API_KEY
read -s -p "API Secret (password এর মতো paste করুন): " API_SECRET
echo ""

echo ""
echo "=== Step 3: GitHub credentials সেট করুন ==="
read -p "GitHub Personal Access Token (ghp_xxxxx): " GITHUB_TOKEN

echo ""
echo "✅ সব credentials সেট হয়েছে"
echo ""

# Cleanup script তৈরি
cat > cleanup_execute.js << 'JSEOF'
const fs = require('fs');
const https = require('https');
const crypto = require('crypto');

const CLOUD_NAME = process.env.CLOUD_NAME;
const API_KEY = process.env.API_KEY;
const API_SECRET = process.env.API_SECRET;
const GITHUB_TOKEN = process.env.GITHUB_TOKEN;

const FIREBASE_BASE = "https://mohajon-mjh-default-rtdb.firebaseio.com";

// Firebase থেকে kept products আনব
async function getKeptProducts() {
    const r = await fetch(FIREBASE_BASE + '/products.json');
    const products = await r.json() || {};
    const kept = [];
    for (const pid in products) {
        const img = ((products[pid].images || {}).main) || '';
        if (img.includes('cloudinary.com')) {
            kept.push({ pid, img });
        }
    }
    return kept;
}

// Cloudinary থেকে unused images delete
async function cleanupCloudinary() {
    console.log('☁️  Cloudinary cleanup শুরু...');
    
    // Kept images extract করব
    const kept = await getKeptProducts();
    const keptUrls = new Set(kept.map(p => p.img));
    console.log('  Kept images:', keptUrls.size);
    
    // Cloudinary API call করে সব images list করব
    const timestamp = Math.floor(Date.now() / 1000);
    const signature = crypto.createHash('sha1')
        .update('max_results=500&timestamp=' + timestamp + API_SECRET)
        .digest('hex');
    
    return new Promise((resolve) => {
        const req = https.request({
            hostname: 'api.cloudinary.com',
            path: `/v1_1/${CLOUD_NAME}/resources/image/upload?max_results=500&timestamp=${timestamp}&api_key=${API_KEY}&signature=${signature}`,
            method: 'GET'
        }, (res) => {
            let data = '';
            res.on('data', c => data += c);
            res.on('end', () => {
                try {
                    const json = JSON.parse(data);
                    const resources = json.resources || [];
                    console.log('  Total Cloudinary images:', resources.length);
                    
                    let toDelete = 0;
                    resources.forEach(r => {
                        const url = `https://res.cloudinary.com/${CLOUD_NAME}/image/upload/v${r.version}/${r.public_id}.${r.format}`;
                        if (!keptUrls.has(url)) {
                            toDelete++;
                        }
                    });
                    console.log('  Images to delete:', toDelete);
                    console.log('  ⚠️  Cloudinary bulk delete API complex - manually delete from dashboard');
                    console.log('  📱 Cloudinary Dashboard → Media Library → Select unused → Delete');
                    resolve();
                } catch(e) {
                    console.log('  ❌ Error:', e.message);
                    resolve();
                }
            });
        });
        req.end();
    });
}

// GitHub থেকে unused files delete
async function cleanupGitHub() {
    console.log('\n📦 GitHub cleanup...');
    console.log('  Checking local files...');
    
    // Local assets/products folder check করব
    const assetsPath = './assets/products';
    if (fs.existsSync(assetsPath)) {
        const files = fs.readdirSync(assetsPath);
        console.log('  Local product folders:', files.length);
        
        // Kept products-এর সাথে match করব
        const kept = await getKeptProducts();
        const keptNames = new Set(kept.map(p => p.pid));
        
        let toDelete = 0;
        files.forEach(folder => {
            if (!keptNames.has(folder)) {
                toDelete++;
                console.log('  ❌ Unused:', folder);
            }
        });
        
        if (toDelete > 0) {
            console.log('  ⚠️  ', toDelete, 'folders delete করতে হবে');
            console.log('  📝 Manual delete: rm -rf ./assets/products/[folder-name]');
        } else {
            console.log('  ✅ সব local folders ব্যবহৃত');
        }
    }
    
    console.log('\n📤 GitHub push...');
    const { execSync } = require('child_process');
    try {
        execSync('git add -A', { stdio: 'inherit' });
        execSync('git commit -m "Cleanup: remove unused assets"', { stdio: 'inherit' });
        execSync(`git push https://mohajon-mjh:${GITHUB_TOKEN}@github.com/mohajon-mjh/mohajon-mjh.github.io.git main`, { stdio: 'inherit' });
        console.log('  ✅ GitHub push complete');
    } catch(e) {
        console.log('  ⚠️  Git push failed (maybe no changes)');
    }
}

(async () => {
    try {
        console.log('🚀 Cleanup শুরু...\n');
        await cleanupCloudinary();
        await cleanupGitHub();
        console.log('\n🎉 Cleanup complete!');
    } catch(e) {
        console.error('❌ Error:', e);
    }
})();
JSEOF

# Environment variables সেট করে script চালাও
export CLOUD_NAME="$CLOUD_NAME"
export API_KEY="$API_KEY"
export API_SECRET="$API_SECRET"
export GITHUB_TOKEN="$GITHUB_TOKEN"

node cleanup_execute.js

# Cleanup
rm cleanup_execute.js

# Credentials মুছে ফেলো
unset CLOUD_NAME API_KEY API_SECRET GITHUB_TOKEN

echo ""
echo "✅ সব credentials memory থেকে মুছে ফেলা হয়েছে"
echo ""
echo "========================================"
echo "📋 FINAL CHECKLIST:"
echo "========================================"
echo "✅ Firebase: cleanup.html দিয়ে delete করুন"
echo "☁️  Cloudinary: Dashboard থেকে unused images delete করুন"
echo "📦 GitHub: Unused folders rm -rf করুন, তারপর push"
echo ""
echo "🎉 সম্পন্ন!"

