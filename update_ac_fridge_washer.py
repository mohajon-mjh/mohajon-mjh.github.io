import json

price_desc = {
    "air_conditioner_compressor": (8000, "Air Conditioner Compressor — a replacement compressor unit for AC cooling systems."),
    "air_conditioner_condenser": (6000, "Air Conditioner Condenser — a replacement condenser coil for AC units."),
    "air_conditioner_filter": (500, "Air Conditioner Filter — a replacement filter for cleaner, more efficient air conditioning."),
    "air_conditioner_indoor_unit": (25000, "Air Conditioner Indoor Unit — the indoor component of a split AC system."),
    "air_conditioner_installation_kit": (2500, "Air Conditioner Installation Kit — a complete kit for AC installation and setup."),
    "air_conditioner_outdoor_unit": (30000, "Air Conditioner Outdoor Unit — the outdoor compressor unit of a split AC system."),
    "air_conditioner_remote": (800, "Air Conditioner Remote — a replacement remote control for air conditioners."),
    "air_conditioners_refrigerators_washing_machines": (30000, "Air Conditioners, Refrigerators, Washing Machines — a wide range of home appliances for cooling and laundry."),
    "appliance_stand": (2000, "Appliance Stand — a sturdy stand for elevating and stabilizing home appliances."),
    "beverage_refrigerator": (25000, "Beverage Refrigerator — a dedicated fridge for chilling drinks and beverages."),
    "cassette_air_conditioner": (55000, "Cassette Air Conditioner — a ceiling-mounted AC unit ideal for commercial spaces."),
    "ceiling_concealed_air_conditioner": (60000, "Ceiling Concealed Air Conditioner — a discreet, ceiling-hidden AC unit for a clean interior look."),
    "central_air_conditioner": (150000, "Central Air Conditioner — a whole-building cooling system for large spaces."),
    "chest_freezer": (30000, "Chest Freezer — a spacious top-opening freezer for bulk food storage."),
    "commercial_air_conditioner": (80000, "Commercial Air Conditioner — a heavy-duty AC unit designed for commercial spaces."),
    "commercial_refrigerator": (60000, "Commercial Refrigerator — a large-capacity fridge designed for business use."),
    "commercial_washing_machine": (70000, "Commercial Washing Machine — a heavy-duty washer designed for high-volume laundry needs."),
    "compact_refrigerator": (18000, "Compact Refrigerator — a small-footprint fridge ideal for tight spaces."),
    "compact_washing_machine": (20000, "Compact Washing Machine — a space-saving washer suitable for small households."),
    "deep_freezer": (35000, "Deep Freezer — a high-capacity freezer for long-term food storage."),
    "display_refrigerator": (45000, "Display Refrigerator — a glass-door fridge ideal for showcasing products in retail."),
    "double_door_refrigerator": (45000, "Double Door Refrigerator — a spacious fridge with separate fridge and freezer compartments."),
    "ducted_air_conditioner": (120000, "Ducted Air Conditioner — a concealed AC system distributing cooled air through ducts."),
    "floor_standing_air_conditioner": (65000, "Floor Standing Air Conditioner — a freestanding AC unit ideal for large rooms."),
    "french_door_refrigerator": (85000, "French Door Refrigerator — a premium fridge with elegant double-door design."),
    "front_load_washing_machine": (45000, "Front Load Washing Machine — an energy-efficient washer with gentle, thorough cleaning."),
    "fully_automatic_washing_machine": (35000, "Fully Automatic Washing Machine — a convenient washer that handles the entire wash cycle automatically."),
    "ice_maker": (15000, "Ice Maker — a standalone appliance for quick, convenient ice production."),
    "inverter_air_conditioner": (55000, "Inverter Air Conditioner — an energy-efficient AC unit with variable-speed cooling."),
    "mini_refrigerator": (12000, "Mini Refrigerator — a compact fridge ideal for personal or small-space use."),
    "non_inverter_air_conditioner": (40000, "Non-Inverter Air Conditioner — a standard fixed-speed AC unit for reliable cooling."),
    "portable_air_conditioner": (35000, "Portable Air Conditioner — a movable AC unit requiring no permanent installation."),
    "portable_washing_machine": (15000, "Portable Washing Machine — a compact, movable washer for small loads and tight spaces."),
    "refrigerator_compressor": (7000, "Refrigerator Compressor — a replacement compressor for fridge cooling systems."),
    "refrigerator_door_seal": (800, "Refrigerator Door Seal — a replacement gasket for airtight fridge door sealing."),
    "refrigerator_shelf": (1200, "Refrigerator Shelf — a replacement shelf for fridge interior storage."),
    "refrigerator_thermostat": (1500, "Refrigerator Thermostat — a replacement thermostat for accurate fridge temperature control."),
    "refrigerator_water_filter": (2000, "Refrigerator Water Filter — a replacement filter for cleaner dispensed water and ice."),
    "refrigerators_washing_machines_air_conditioners": (30000, "Refrigerators, Washing Machines & Air Conditioners — a general range of major home appliances."),
    "semi_automatic_washing_machine": (18000, "Semi-Automatic Washing Machine — an affordable washer requiring manual cycle switching."),
    "side_by_side_refrigerator": (95000, "Side-by-Side Refrigerator — a premium fridge with vertical split fridge and freezer sections."),
    "single_door_refrigerator": (22000, "Single Door Refrigerator — a compact, single-door fridge ideal for small households."),
    "smart_air_conditioner": (65000, "Smart Air Conditioner — a WiFi-enabled AC unit with app and voice control."),
    "smart_refrigerator": (110000, "Smart Refrigerator — a connected fridge with smart features and app control."),
    "smart_washing_machine": (55000, "Smart Washing Machine — a WiFi-enabled washer with app-based control and monitoring."),
    "split_air_conditioner": (50000, "Split Air Conditioner — a two-unit AC system offering efficient, quiet cooling."),
    "top_load_washing_machine": (30000, "Top Load Washing Machine — a convenient washer with easy top-loading access."),
    "tower_air_conditioner": (70000, "Tower Air Conditioner — a tall, freestanding AC unit for stylish, efficient cooling."),
    "triple_door_refrigerator": (65000, "Triple Door Refrigerator — a spacious fridge with three separate compartments."),
    "twin_tub_washing_machine": (16000, "Twin Tub Washing Machine — a manual washer with separate wash and spin tubs."),
    "upright_freezer": (32000, "Upright Freezer — a vertical freezer offering easy-access food storage."),
    "washer_dryer_combo": (75000, "Washer Dryer Combo — an all-in-one appliance that washes and dries in a single unit."),
    "washing_machine_control_board": (3500, "Washing Machine Control Board — a replacement control board for washer operation."),
    "washing_machine_door_lock": (1200, "Washing Machine Door Lock — a replacement door lock mechanism for washers."),
    "washing_machine_drain_pump": (1800, "Washing Machine Drain Pump — a replacement pump for washer water drainage."),
    "washing_machine_drum": (5000, "Washing Machine Drum — a replacement drum for washing machines."),
    "washing_machine_filter": (500, "Washing Machine Filter — a replacement filter for cleaner washer operation."),
    "washing_machine_hose": (600, "Washing Machine Hose — a replacement hose for washer water supply or drainage."),
    "washing_machine_motor": (4500, "Washing Machine Motor — a replacement motor for washing machine operation."),
    "washing_machine_water_inlet_valve": (900, "Washing Machine Water Inlet Valve — a replacement valve controlling water flow into the washer."),
    "window_air_conditioner": (35000, "Window Air Conditioner — a compact, all-in-one AC unit designed for window installation."),
    "wine_cooler": (28000, "Wine Cooler — a temperature-controlled cabinet for storing and chilling wine."),
}

path = "data/products-placeholder.json"
with open(path, "r", encoding="utf-8") as f:
    data = json.load(f)

updated = 0
skipped = []
for sku, prod in data.items():
    if prod.get("categoryId") == "air_conditioners_refrigerators_washing_machines":
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
