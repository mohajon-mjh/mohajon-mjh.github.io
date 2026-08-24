#!/data/data/com.termux/files/usr/bin/bash

IMG_DIR="assets/images/products"
OUT="products.auto.json"

echo "[" > $OUT

first=1

for img in $IMG_DIR/*.png; do
  filename=$(basename "$img")
  name="${filename%.*}"
  title=$(echo "$name" | sed 's/-/ /g')

  if echo "$name" | grep -q "1000gm"; then weight="1000 gm"
  elif echo "$name" | grep -q "500gm"; then weight="500 gm"
  elif echo "$name" | grep -q "250gm"; then weight="250 gm"
  elif echo "$name" | grep -q "100gm"; then weight="100 gm"
  elif echo "$name" | grep -q "50gm"; then weight="50 gm"
  elif echo "$name" | grep -q "30gm"; then weight="30 gm"
  elif echo "$name" | grep -q "20gm"; then weight="20 gm"
  elif echo "$name" | grep -q "15gm"; then weight="15 gm"
  elif echo "$name" | grep -q "10gm"; then weight="10 gm"
  else weight=""
  fi

  if [ $first -eq 0 ]; then
    echo "," >> $OUT
  fi
  first=0

  echo "{
  \"name\": \"$title\",
  \"image\": \"$img\",
  \"weight\": \"$weight\",
  \"category\": \"মসলা\",
  \"price\": 0
}" >> $OUT

done

echo "]" >> $OUT

echo "DONE → products.auto.json তৈরি"
