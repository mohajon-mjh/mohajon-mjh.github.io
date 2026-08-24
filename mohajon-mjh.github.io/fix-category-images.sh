#!/data/data/com.termux/files/usr/bin/bash

BASE="assets/images/categories"

echo "===== Copying & Renaming Category Images ====="

find "$BASE" -mindepth 1 -maxdepth 1 -type d | while read -r dir
do
    img=$(find "$dir" -maxdepth 1 -type f -iname "*.png" | head -n 1)

    [ -z "$img" ] && continue

    name=$(basename "$img")

    case "$name" in
        drones_action_cameras1.png)
            newname="drones_action_cameras.png"
            ;;
        furniture_home_decor-1.png)
            newname="furniture_home_decor.png"
            ;;
        books_media_music1.png)
            newname="books_media_music.png"
            ;;
        *)
            newname="$name"
            ;;
    esac

    cp -f "$img" "$BASE/$newname"
    echo "✓ $name  -->  $newname"
done

echo
echo "===== ROOT PNG FILES ====="
find "$BASE" -maxdepth 1 -type f -iname "*.png" | sort

echo
echo "Done."
