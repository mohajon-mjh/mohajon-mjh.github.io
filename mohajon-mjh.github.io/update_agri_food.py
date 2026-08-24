import json

price_desc = {
    "agriculture_food_beverage": (500, "Agriculture, Food & Beverage — a wide range of agricultural produce, food items, and beverages."),
    "animal_feed": (800, "Animal Feed — quality feed formulated for livestock and poultry nutrition."),
    "barley": (60, "Barley — a nutritious cereal grain used in cooking, brewing, and animal feed."),
    "bio_fertilizer": (350, "Bio Fertilizer — an eco-friendly fertilizer that improves soil fertility using natural microorganisms."),
    "biscuits": (60, "Biscuits — crispy baked snacks available in a variety of flavors."),
    "black_gram": (140, "Black Gram (Kalai Dal) — a protein-rich lentil widely used in South Asian cooking."),
    "bread": (50, "Bread — freshly baked bread, a daily household staple."),
    "butter": (350, "Butter — creamy dairy butter suitable for cooking and spreading."),
    "cakes": (250, "Cakes — soft, freshly baked cakes for celebrations and everyday treats."),
    "candy": (100, "Candy — a variety of sweet confectionery treats."),
    "cheese": (450, "Cheese — dairy cheese suitable for cooking and snacking."),
    "chicken": (220, "Chicken — fresh poultry meat sourced for quality and freshness."),
    "chickpeas": (110, "Chickpeas (Chola)— a versatile legume rich in protein and fiber."),
    "chocolate": (150, "Chocolate — rich, smooth chocolate for snacking and gifting."),
    "coconut_water": (60, "Coconut Water — a natural, refreshing hydrating drink."),
    "coffee": (350, "Coffee — roasted coffee for a rich, aromatic brew."),
    "coffee_beans": (500, "Coffee Beans — whole roasted beans for fresh coffee brewing."),
    "compost": (250, "Compost — organic decomposed matter used to enrich soil."),
    "cooking_oil": (180, "Cooking Oil — everyday cooking oil suitable for frying and general use."),
    "corn": (60, "Corn (Maize) — a versatile cereal grain used in food and animal feed."),
    "cotton": (120, "Cotton — raw agricultural cotton used in the textile industry."),
    "drinking_water": (25, "Drinking Water — purified, safe drinking water."),
    "dry_fruits": (600, "Dry Fruits — a mix of nutritious dried fruits for snacking."),
    "eggs": (130, "Eggs — fresh farm eggs, a staple protein source."),
    "energy_drinks": (80, "Energy Drinks — refreshing drinks formulated to boost energy."),
    "fish": (350, "Fish — fresh fish sourced for quality and freshness."),
    "flavored_water": (40, "Flavored Water — lightly flavored water for a refreshing taste."),
    "fresh_fruits": (150, "Fresh Fruits — a seasonal selection of fresh, quality fruits."),
    "fresh_vegetables": (80, "Fresh Vegetables — a seasonal selection of fresh, quality vegetables."),
    "frozen_foods": (250, "Frozen Foods — a range of convenient, ready-to-cook frozen food items."),
    "fruit_juice": (60, "Fruit Juice — refreshing juice made from real fruits."),
    "garlic": (90, "Garlic — fresh garlic, an essential cooking ingredient."),
    "ghee": (700, "Ghee — pure clarified butter used in traditional cooking."),
    "ginger": (100, "Ginger — fresh ginger root, widely used in cooking and remedies."),
    "green_gram": (140, "Green Gram (Mug Dal) — a nutritious legume popular in South Asian dishes."),
    "green_tea": (280, "Green Tea — antioxidant-rich tea leaves for a light, refreshing brew."),
    "groundnuts": (150, "Groundnuts (Peanuts) — a popular nutritious nut used in snacking and cooking."),
    "herbal_products": (300, "Herbal Products — a range of natural herbal wellness products."),
    "herbal_tea": (300, "Herbal Tea — a soothing tea blend made from natural herbs."),
    "herbs": (100, "Herbs — fresh and dried herbs for cooking and natural remedies."),
    "honey": (450, "Honey — pure, natural honey harvested for quality and taste."),
    "instant_coffee": (400, "Instant Coffee — quick-brew coffee for a convenient cup anytime."),
    "jam": (180, "Jam — fruit preserve spread suitable for breakfast and snacks."),
    "jelly": (150, "Jelly — fruit-based jelly spread, a sweet breakfast addition."),
    "juice": (60, "Juice — a refreshing fruit-based beverage."),
    "jute": (100, "Jute — a natural fiber crop used in textiles and packaging."),
    "lentils": (130, "Lentils (Dal) — a nutritious legume, a staple in everyday cooking."),
    "meat": (600, "Meat — fresh quality meat sourced for everyday cooking."),
    "milk": (90, "Milk — fresh dairy milk, a daily nutritional staple."),
    "milk_drinks": (60, "Milk Drinks — flavored dairy-based beverages."),
    "millet": (90, "Millet — a nutritious, gluten-free cereal grain."),
    "mineral_water": (25, "Mineral Water — bottled water enriched with natural minerals."),
    "mustard_seeds": (150, "Mustard Seeds — used for cooking, oil extraction, and seasoning."),
    "natural_sweeteners": (250, "Natural Sweeteners — plant-based sweeteners as a sugar alternative."),
    "noodles": (60, "Noodles — quick-cooking noodles for everyday meals."),
    "nuts": (500, "Nuts — a mix of quality nuts for snacking and cooking."),
    "oats": (180, "Oats — a wholesome cereal grain popular for breakfast."),
    "onions": (50, "Onions — fresh onions, a staple cooking ingredient."),
    "organic_coffee": (600, "Organic Coffee — coffee grown and processed without synthetic chemicals."),
    "organic_fertilizer": (350, "Organic Fertilizer — a natural fertilizer that improves soil health without chemicals."),
    "organic_fruits": (200, "Organic Fruits — fruits grown using natural, chemical-free farming methods."),
    "organic_honey": (550, "Organic Honey — pure honey harvested using organic beekeeping practices."),
    "organic_rice": (100, "Organic Rice — rice grown without synthetic pesticides or fertilizers."),
    "organic_spices": (200, "Organic Spices — spices grown and processed using organic farming methods."),
    "organic_tea": (400, "Organic Tea — tea leaves grown without synthetic chemicals."),
    "organic_vegetables": (120, "Organic Vegetables — vegetables grown using natural, chemical-free farming methods."),
    "paddy": (35, "Paddy — unmilled rice grain, the raw agricultural form of rice."),
    "pasta": (120, "Pasta — versatile pasta suitable for a variety of dishes."),
    "pickles": (150, "Pickles — traditional tangy pickles made from vegetables and spices."),
    "potatoes": (35, "Potatoes — fresh potatoes, a kitchen staple vegetable."),
    "protein_drinks": (250, "Protein Drinks — nutrient-rich drinks formulated to support protein intake."),
    "rice": (75, "Rice — quality rice, a staple food grain."),
    "rice_flour": (70, "Rice Flour — finely milled flour made from rice."),
    "salt": (35, "Salt — iodized table salt for everyday cooking."),
    "sauces": (120, "Sauces — a range of cooking and condiment sauces."),
    "seedlings": (30, "Seedlings — young plants ready for transplanting and cultivation."),
    "seeds": (100, "Seeds — agricultural seeds for planting and cultivation."),
    "sesame_seeds": (180, "Sesame Seeds — used in cooking, oil extraction, and garnishing."),
    "shrimp": (500, "Shrimp — fresh shrimp sourced for quality and freshness."),
    "smoothies": (100, "Smoothies — blended fruit drinks for a refreshing, nutritious option."),
    "snacks": (60, "Snacks — a variety of packaged snacks for everyday munching."),
    "soft_drinks": (40, "Soft Drinks — carbonated refreshing beverages."),
    "soybeans": (100, "Soybeans — a versatile, protein-rich legume."),
    "spices": (150, "Spices — a range of whole and ground spices for cooking."),
    "sugar": (120, "Sugar — refined white sugar for everyday use."),
    "sugarcane": (40, "Sugarcane — raw agricultural cane, source of natural sugar."),
    "sunflower_seeds": (180, "Sunflower Seeds — nutritious seeds used for snacking and oil extraction."),
    "syrup": (150, "Syrup — sweet syrup suitable for desserts and beverages."),
    "tea": (250, "Tea — quality tea leaves for a daily cup."),
    "tea_leaves": (300, "Tea Leaves — loose-leaf tea for a rich, authentic brew."),
    "tobacco_leaves": (200, "Tobacco Leaves — raw agricultural tobacco leaf produce."),
    "turmeric": (95, "Turmeric — fresh turmeric root, widely used in cooking and traditional remedies."),
    "vegetables_fruits_wheat": (500, "Vegetables, Fruits & Wheat — a general range of fresh produce and grain staples."),
    "wheat": (45, "Wheat — a staple cereal grain used for flour and food production."),
    "wheat_flour": (60, "Wheat Flour — finely milled flour made from wheat."),
    "yogurt": (80, "Yogurt — fresh dairy yogurt, a healthy everyday food."),
    "yogurt_drinks": (60, "Yogurt Drinks — refreshing drinkable yogurt beverages."),
}

path = "data/products-placeholder.json"
with open(path, "r", encoding="utf-8") as f:
    data = json.load(f)

updated = 0
skipped = []
for sku, prod in data.items():
    if prod.get("categoryId") == "agriculture_food_beverage":
        img = prod["images"]["main"].split("/")[-1].replace(".png", "")
        if img in price_desc:
            price, desc = price_desc[img]
            prod["title"] = " ".join(w.capitalize() for w in img.split("_"))
            prod["price"] = price
            prod["description"] = desc
            prod["status"] = "active"
            updated += 1
        else:
            skipped.append((sku, img))

with open(path, "w", encoding="utf-8") as f:
    json.dump(data, f, ensure_ascii=False, indent=2)

print(f"Updated: {updated}")
print(f"Skipped: {skipped}")
