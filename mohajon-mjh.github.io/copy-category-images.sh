#!/data/data/com.termux/files/usr/bin/bash

BASE="assets/images/categories"

echo "===== Copying category images ====="

find "$BASE" -mindepth 1 -maxdepth 1 -type d | while read -r dir
do
    img=$(find "$dir" -maxdepth 1 -type f -iname "*.png" | head -n 1)

    if [ -n "$img" ]; then
        cp -f "$img" "$BASE/"
        echo "✓ $(basename "$img")"
    else
        echo "✗ No PNG found in: $(basename "$dir")"
    fi
done

echo
echo "Done."
echo
echo "Root PNG files:"
find "$BASE" -maxdepth 1 -type f -iname "*.png" | sort
