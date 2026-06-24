#!/data/data/com.termux/files/usr/bin/bash
set -e
cd ~/mohajon-mjh.github.io

cp products.html backup/products.html.$(date +%F-%H%M%S)

python3 - <<'PY'
from pathlib import Path
p=Path("products.html")
html=p.read_text()

html=html.replace(
'<a href="cart.html">🛒 Cart</a>',
'<a href="cart.html">🛒 Cart (<span id="cartCount">0</span>)</a> <a href="wishlist.html">❤️ Wishlist</a>'
)

html=html.replace(
'<button class="buy" onclick="addCart(\'${p.id}\')">Add Cart</button>',
'<button class="buy" onclick="addCart(\'${p.id}\')">Add Cart</button><br><br><a href="product-details.html?id=${p.id}">View Details</a>'
)

if "cartCount" not in html:
    html=html.replace(
"</script>",
"""
window.addEventListener("DOMContentLoaded",()=>{
const cart=JSON.parse(localStorage.getItem("cart")||"[]");
const c=document.getElementById("cartCount");
if(c)c.textContent=cart.length;
});
</script>
"""
)

p.write_text(html)
print("Products upgraded.")
PY

touch wishlist.html

if [ -x ~/.auto_push_mjh ]; then
 ~/.auto_push_mjh
fi

echo "Upgrade v3 Complete."
