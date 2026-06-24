#!/data/data/com.termux/files/usr/bin/bash
set -e

cd ~/mohajon-mjh.github.io

echo "=== MJH Marketplace Upgrade v2 ==="

mkdir -p \
assets/css \
assets/js \
assets/icons \
assets/fonts \
assets/data \
assets/modules \
buyer \
seller \
admin \
api \
backup

touch \
assets/css/style.css \
assets/css/responsive.css \
assets/js/app.js \
assets/js/search.js \
assets/js/cart.js \
assets/js/auth.js \
assets/js/wishlist.js \
assets/js/admin.js \
assets/js/firebase.js \
assets/data/categories.json \
assets/data/settings.json

echo "Project folders created."

if [ -x ~/.auto_push_mjh ]; then
    ~/.auto_push_mjh
fi

echo
echo "Upgrade v2 Complete."
echo
echo "Next:"
echo "✓ Professional Search"
echo "✓ Wishlist"
echo "✓ Buyer Login"
echo "✓ Seller Login"
echo "✓ Admin Dashboard"
