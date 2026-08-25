#!/bin/bash
AD=~/storage/shared/"Advertising Details"
cd ~/mohajon-mjh.github.io || exit
[ -d "$AD" ] || { echo "❌ Advertising Details folder পাইনি"; exit 1; }
for d in "$AD"/*/; do
  NAME=$(basename "$d")
  SLUG=$(echo "$NAME" | tr 'A-Z' 'a-z' | sed 's/[^a-z0-9]\+/_/g; s/^_//; s/_$//')
  mkdir -p "media/$SLUG"
  cp -n "$d"* "media/$SLUG/" 2>/dev/null
  node -e '
  const fs=require("fs"),path=require("path");
  const dir=process.argv[1];
  const files=fs.readdirSync(dir).filter(f=>!f.endsWith(".json"));
  const img=files.filter(f=>/\.(png|jpe?g|webp|gif)$/i.test(f)).sort();
  const vid=files.filter(f=>/\.(mp4|webm|mov)$/i.test(f)).sort();
  fs.writeFileSync(path.join(dir,"media.json"),JSON.stringify({images:img,videos:vid},null,1));
  ' "media/$SLUG"
  echo "✅ $SLUG"
done
git add media/
git commit -m "Media sync: $(date +%F)" --quiet 2>/dev/null && git push --quiet && echo "🎉 media pushed!"
