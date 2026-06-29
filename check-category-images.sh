#!/data/data/com.termux/files/usr/bin/bash

BASE="assets/images/categories"

echo "===== CATEGORY IMAGE REPORT ====="

find "$BASE" -mindepth 1 -maxdepth 1 -type d | while read -r dir
do
    echo
    echo "Folder: $(basename "$dir")"
    find "$dir" -maxdepth 1 -type f \( -iname "*.png" -o -iname "*.jpg" -o -iname "*.jpeg" -o -iname "*.webp" \)
done

echo
echo "===== PNG FILES IN ROOT ====="
find "$BASE" -maxdepth 1 -type f -iname "*.png"
