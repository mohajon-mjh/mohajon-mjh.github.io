import json

price_desc = {
    "appliances_home_appliances_large_small": (1500, "Home Appliances — a general range of large and small appliances for everyday household use."),
    "air_circulator": (2200, "Air Circulator — a compact fan designed to improve air circulation throughout a room."),
    "air_conditioner": (35000, "Air Conditioner — a cooling unit designed to regulate indoor temperature efficiently."),
    "air_cooler": (8500, "Air Cooler — an evaporative cooling appliance ideal for hot, dry climates."),
    "air_fryer": (4500, "Air Fryer — a countertop appliance for oil-free, crispy cooking."),
    "air_fryer_basket": (700, "Air Fryer Basket — a replacement basket accessory for air fryers."),
    "air_purifier": (6500, "Air Purifier — a device designed to filter and improve indoor air quality."),
    "appliance_remote_control": (400, "Appliance Remote Control — a replacement remote for controlling home appliances."),
    "beard_trimmer": (1200, "Beard Trimmer — a rechargeable grooming tool for precise beard styling."),
    "blender": (2500, "Blender — a kitchen appliance for blending, mixing, and pureeing ingredients."),
    "blender_blade": (400, "Blender Blade — a replacement blade for blender jars."),
    "blender_jar": (600, "Blender Jar — a replacement jar for blender appliances."),
    "bread_maker": (5500, "Bread Maker — an automatic appliance for baking fresh bread at home."),
    "built_in_oven": (25000, "Built-In Oven — a fixed kitchen oven designed for cabinetry installation."),
    "carpet_cleaner": (7500, "Carpet Cleaner — an appliance designed for deep-cleaning carpets and upholstery."),
    "ceiling_fan": (3500, "Ceiling Fan — a mounted fan designed for efficient room air circulation."),
    "central_vacuum_system": (18000, "Central Vacuum System — a built-in vacuum system for whole-home cleaning."),
    "chopper": (1200, "Chopper — a small kitchen appliance for chopping vegetables and fruits."),
    "citrus_juicer": (1500, "Citrus Juicer — a compact appliance designed for extracting citrus fruit juice."),
    "clothes_dryer": (28000, "Clothes Dryer — an appliance designed to dry laundry quickly and efficiently."),
    "coffee_machine_filter": (300, "Coffee Machine Filter — a replacement filter for coffee makers."),
    "coffee_maker": (3500, "Coffee Maker — an appliance for brewing fresh coffee at home."),
    "cooking_range": (22000, "Cooking Range — a combined stovetop and oven unit for full kitchen cooking."),
    "deep_fryer": (3200, "Deep Fryer — an appliance designed for frying food in oil."),
    "dehumidifier": (9500, "Dehumidifier — an appliance that reduces excess moisture in indoor air."),
    "dishwasher": (35000, "Dishwasher — an appliance designed to automatically wash and dry dishes."),
    "dry_iron": (900, "Dry Iron — a basic clothes iron without steam function."),
    "egg_cooker": (1000, "Egg Cooker — a compact appliance for boiling and steaming eggs."),
    "electric_blanket": (2200, "Electric Blanket — a heated blanket designed for warmth during cold weather."),
    "electric_fan": (1800, "Electric Fan — a standard fan designed for indoor air circulation."),
    "electric_fireplace": (12000, "Electric Fireplace — a decorative heating appliance simulating a real fireplace."),
    "electric_kettle": (1500, "Electric Kettle — an appliance for quickly boiling water."),
    "electric_mop": (2800, "Electric Mop — a motorized mop designed for efficient floor cleaning."),
    "electric_shaver": (1800, "Electric Shaver — a rechargeable shaver for facial grooming."),
    "electric_toothbrush": (1500, "Electric Toothbrush — a rechargeable toothbrush for effective oral care."),
    "epilator": (2200, "Epilator — a device designed for removing hair from the root."),
    "espresso_machine": (12000, "Espresso Machine — an appliance for brewing rich espresso coffee."),
    "exhaust_fan": (1800, "Exhaust Fan — a fan designed to vent air and odors from a room."),
    "fabric_shaver": (700, "Fabric Shaver — a compact device for removing lint and fuzz from fabric."),
    "facial_steamer": (1500, "Facial Steamer — a device designed to open pores using warm steam."),
    "fan_heater": (2200, "Fan Heater — a compact heater that uses a fan to distribute warm air."),
    "floor_scrubber": (6500, "Floor Scrubber — a motorized appliance designed for scrubbing hard floors."),
    "food_processor": (4500, "Food Processor — a versatile appliance for chopping, slicing, and mixing food."),
    "freezer": (32000, "Freezer — a standalone appliance designed for long-term food storage at freezing temperatures."),
    "garment_steamer": (2200, "Garment Steamer — a handheld appliance for removing wrinkles from clothing."),
    "hair_clipper": (1500, "Hair Clipper — a rechargeable tool for trimming and cutting hair."),
    "hair_curler": (1400, "Hair Curler — a styling tool designed for creating curls."),
    "hair_dryer": (1800, "Hair Dryer — an appliance for quickly drying and styling hair."),
    "hair_straightener": (1600, "Hair Straightener — a styling tool designed for straightening hair."),
    "hand_blender": (1800, "Hand Blender — a handheld appliance for blending and pureeing food."),
    "handheld_vacuum": (3500, "Handheld Vacuum — a compact, cordless vacuum for quick cleanups."),
    "humidifier": (2800, "Humidifier — an appliance that adds moisture to indoor air."),
    "ice_maker": (8500, "Ice Maker — an appliance designed to produce ice quickly at home."),
    "infrared_heater": (4500, "Infrared Heater — a heater that uses infrared radiation for efficient warmth."),
    "ironing_press": (15000, "Ironing Press — a large appliance designed for pressing fabrics flat and wrinkle-free."),
    "juicer": (3500, "Juicer — an appliance designed for extracting juice from fruits and vegetables."),
    "meat_grinder": (4500, "Meat Grinder — an appliance designed for grinding meat at home."),
    "meat_slicer": (5500, "Meat Slicer — an appliance designed for slicing meat evenly."),
    "microwave_oven": (9500, "Microwave Oven — an appliance for quickly heating and cooking food."),
    "microwave_rice_cooker_electric_kettle": (6500, "Microwave, Rice Cooker & Kettle Combo — a bundled set of essential kitchen appliances."),
    "microwave_turntable_plate": (700, "Microwave Turntable Plate — a replacement glass plate for microwave ovens."),
    "mixer_attachments": (900, "Mixer Attachments — replacement or add-on attachments for stand mixers."),
    "mixer_grinder": (3500, "Mixer Grinder — a versatile kitchen appliance for grinding and mixing ingredients."),
    "multi_cooker": (5500, "Multi Cooker — a multi-function appliance combining several cooking methods."),
    "oil_heater": (5500, "Oil Heater — a radiator-style heater filled with oil for steady warmth."),
    "oral_irrigator": (1800, "Oral Irrigator — a device using water pressure for thorough oral hygiene."),
    "popcorn_maker": (2200, "Popcorn Maker — an appliance designed for making fresh popcorn at home."),
    "power_cord": (400, "Power Cord — a replacement power cord for home appliances."),
    "pressure_cooker_electric": (4500, "Electric Pressure Cooker — an appliance for fast, efficient pressure cooking."),
    "range_hood": (8500, "Range Hood — a ventilation appliance installed above stovetops to remove smoke and odors."),
    "refrigerator": (45000, "Refrigerator — a household appliance for cooling and preserving food."),
    "refrigerator_door_gasket": (900, "Refrigerator Door Gasket — a replacement seal for refrigerator doors."),
    "refrigerator_shelf": (700, "Refrigerator Shelf — a replacement shelf for refrigerator interiors."),
    "replacement_heating_element": (900, "Replacement Heating Element — a spare heating part for various appliances."),
    "rice_cooker": (2500, "Rice Cooker — an appliance designed for cooking rice conveniently and evenly."),
    "robot_vacuum_cleaner": (15000, "Robot Vacuum Cleaner — an automated vacuum designed for hands-free floor cleaning."),
    "room_heater": (3500, "Room Heater — a portable heater designed to warm indoor spaces."),
    "sandwich_maker": (1800, "Sandwich Maker — an appliance designed for making grilled sandwiches."),
    "shoe_dryer": (1200, "Shoe Dryer — an appliance designed for quickly drying wet shoes."),
    "slow_cooker": (3200, "Slow Cooker — an appliance designed for slow, even cooking over long periods."),
    "smart_air_conditioner": (48000, "Smart Air Conditioner — a Wi-Fi enabled AC unit with app-based control."),
    "smart_air_purifier": (9500, "Smart Air Purifier — a Wi-Fi enabled air purifier with app-based control."),
    "smart_coffee_machine": (15000, "Smart Coffee Machine — a Wi-Fi enabled coffee maker with app-based control."),
    "smart_fan": (3200, "Smart Fan — a Wi-Fi enabled fan with app-based control."),
    "smart_oven": (18000, "Smart Oven — a Wi-Fi enabled oven with app-based control."),
    "smart_refrigerator": (65000, "Smart Refrigerator — a Wi-Fi enabled refrigerator with app-based control."),
    "smart_vacuum_cleaner": (16000, "Smart Vacuum Cleaner — a Wi-Fi enabled vacuum with app-based control."),
    "smart_washing_machine": (42000, "Smart Washing Machine — a Wi-Fi enabled washing machine with app-based control."),
    "steam_cleaner": (5500, "Steam Cleaner — an appliance that uses high-temperature steam for deep cleaning."),
    "steam_iron": (1500, "Steam Iron — a clothes iron with steam function for smoother pressing."),
    "steam_oven": (22000, "Steam Oven — an oven that uses steam for healthier, moisture-retaining cooking."),
    "tea_maker": (2500, "Tea Maker — an appliance designed for brewing tea conveniently."),
    "toaster": (1800, "Toaster — an appliance designed for toasting bread slices."),
    "tower_fan": (3500, "Tower Fan — a slim, vertical fan designed for efficient air circulation."),
    "vacuum_cleaner": (5500, "Vacuum Cleaner — an appliance designed for cleaning floors and carpets."),
    "vacuum_cleaner_bags": (400, "Vacuum Cleaner Bags — replacement dust bags for vacuum cleaners."),
    "vacuum_cleaner_filters": (500, "Vacuum Cleaner Filters — replacement filters for vacuum cleaners."),
    "waffle_maker": (2200, "Waffle Maker — an appliance designed for making fresh waffles at home."),
    "washer_dryer_combo": (48000, "Washer Dryer Combo — an all-in-one appliance for washing and drying laundry."),
    "washing_machine": (32000, "Washing Machine — an appliance designed for washing clothes efficiently."),
    "washing_machine_filter": (400, "Washing Machine Filter — a replacement lint filter for washing machines."),
    "washing_machine_hose": (500, "Washing Machine Hose — a replacement inlet or drain hose for washing machines."),
    "water_dispenser": (6500, "Water Dispenser — an appliance for dispensing chilled or hot drinking water."),
    "water_filters": (700, "Water Filters — replacement filters for water purifiers and dispensers."),
    "water_heater": (8500, "Water Heater — an appliance designed for heating water for household use."),
    "water_purifier": (7500, "Water Purifier — an appliance designed to filter and purify drinking water."),
    "wet_dry_vacuum_cleaner": (6500, "Wet/Dry Vacuum Cleaner — a versatile vacuum capable of cleaning both liquid and solid debris."),
    "wine_cooler": (15000, "Wine Cooler — a temperature-controlled appliance designed for storing wine."),
    "yogurt_maker": (2200, "Yogurt Maker — an appliance designed for making fresh yogurt at home."),
}

path = "data/products-placeholder.json"
with open(path, "r", encoding="utf-8") as f:
    data = json.load(f)

updated = 0
skipped = []
for sku, prod in data.items():
    if prod.get("categoryId") == "appliances_home_appliances_large_small":
        img = prod["images"]["main"].split("/")[-1].replace(".png", "")
        if img in price_desc:
            price, desc = price_desc[img]
            title = " ".join(w.capitalize() for w in img.split("_"))
            prod["title"] = title
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
