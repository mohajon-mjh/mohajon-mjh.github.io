import json

price_desc = {
    "renewable_energy": (500, "Renewable Energy — a general range of products for sustainable and clean energy solutions."),
    "solar_panel_and_wind_turbine": (25000, "Solar Panel & Wind Turbine Combo — a bundled renewable energy set combining solar and wind generation."),
    "solar_panels": (12000, "Solar Panels — photovoltaic panels used to convert sunlight into electricity."),
    "monocrystalline_solar_panel": (15000, "Monocrystalline Solar Panel — a high-efficiency solar panel made from a single silicon crystal."),
    "polycrystalline_solar_panel": (11000, "Polycrystalline Solar Panel — a cost-effective solar panel made from multiple silicon crystals."),
    "flexible_solar_panel": (8500, "Flexible Solar Panel — a lightweight, bendable solar panel designed for curved surfaces."),
    "portable_solar_panel": (7500, "Portable Solar Panel — a compact, foldable panel designed for on-the-go charging."),
    "foldable_solar_panel": (7800, "Foldable Solar Panel — a hinged solar panel designed for easy transport and storage."),
    "bifacial_solar_panel": (16000, "Bifacial Solar Panel — a solar panel that captures sunlight from both sides for higher output."),
    "rooftop_solar_panel": (18000, "Rooftop Solar Panel — a solar panel system designed for residential and commercial roof installation."),
    "solar_panel_kit": (22000, "Solar Panel Kit — a complete kit with panels and accessories for setting up a solar system."),
    "solar_inverters": (8500, "Solar Inverters — devices that convert solar-generated DC power into usable AC power."),
    "string_inverter": (9500, "String Inverter — a solar inverter that connects a string of panels to convert DC to AC."),
    "hybrid_solar_inverter": (15000, "Hybrid Solar Inverter — an inverter that manages solar, battery, and grid power together."),
    "off_grid_inverter": (9500, "Off-Grid Inverter — an inverter designed for standalone solar systems without grid connection."),
    "on_grid_inverter": (9000, "On-Grid Inverter — an inverter designed to feed solar power into the utility grid."),
    "micro_inverter": (6500, "Micro Inverter — a small inverter installed on each solar panel for individual power conversion."),
    "pure_sine_wave_inverter": (7500, "Pure Sine Wave Inverter — an inverter that produces clean, stable AC power for sensitive devices."),
    "solar_inverter_charger": (12000, "Solar Inverter Charger — a combined inverter and battery charger for solar systems."),
    "solar_batteries": (9500, "Solar Batteries — rechargeable batteries designed to store solar-generated energy."),
    "lithium_solar_battery": (18000, "Lithium Solar Battery — a lightweight, long-lasting battery designed for solar energy storage."),
    "lifepo4_battery": (16000, "LiFePO4 Battery — a lithium iron phosphate battery known for safety and long cycle life."),
    "agm_battery": (7500, "AGM Battery — a sealed lead-acid battery designed for reliable solar energy storage."),
    "gel_battery": (7000, "Gel Battery — a maintenance-free lead-acid battery designed for solar applications."),
    "deep_cycle_battery": (8500, "Deep Cycle Battery — a battery designed for repeated deep discharge and recharge cycles."),
    "solar_battery_bank": (12000, "Solar Battery Bank — a bank of batteries connected to store solar energy for later use."),
    "battery_cabinet": (5500, "Battery Cabinet — an enclosure designed to house and protect solar batteries."),
    "solar_charge_controllers": (3500, "Solar Charge Controllers — devices that regulate power flow from solar panels to batteries."),
    "pwm_charge_controller": (2500, "PWM Charge Controller — a basic charge controller that regulates battery charging."),
    "mppt_charge_controller": (5500, "MPPT Charge Controller — an advanced charge controller that maximizes solar power efficiency."),
    "smart_solar_charge_controller": (6500, "Smart Solar Charge Controller — a charge controller with monitoring and app connectivity."),
    "dual_battery_controller": (3500, "Dual Battery Controller — a controller designed to manage charging across two battery banks."),
    "solar_lighting": (600, "Solar Lighting — a general range of solar-powered lighting products."),
    "solar_street_light": (3500, "Solar Street Light — a solar-powered light designed for illuminating streets and roads."),
    "solar_flood_light": (2500, "Solar Flood Light — a solar-powered light designed for wide-area outdoor illumination."),
    "solar_garden_light": (450, "Solar Garden Light — a small solar-powered light designed for garden pathways."),
    "solar_wall_light": (700, "Solar Wall Light — a solar-powered light designed for mounting on walls."),
    "solar_path_light": (400, "Solar Path Light — a solar-powered light designed to illuminate walkways."),
    "solar_spot_light": (900, "Solar Spot Light — a solar-powered light designed to highlight specific outdoor areas."),
    "solar_lantern": (600, "Solar Lantern — a portable solar-powered lantern for outdoor and emergency lighting."),
    "solar_camping_light": (500, "Solar Camping Light — a portable solar-powered light designed for camping trips."),
    "solar_string_lights": (450, "Solar String Lights — decorative solar-powered lights designed for outdoor decoration."),
    "solar_water_systems": (5500, "Solar Water Systems — a general range of solar-powered water heating and pumping products."),
    "solar_water_heater": (18000, "Solar Water Heater — a system that uses solar energy to heat water for household use."),
    "solar_water_pump": (7500, "Solar Water Pump — a pump powered by solar energy for water transfer."),
    "solar_fountain_pump": (1500, "Solar Fountain Pump — a small solar-powered pump designed for garden fountains."),
    "solar_irrigation_pump": (9500, "Solar Irrigation Pump — a solar-powered pump designed for agricultural irrigation."),
    "solar_pool_pump": (8500, "Solar Pool Pump — a solar-powered pump designed to circulate swimming pool water."),
    "wind_energy": (900, "Wind Energy — a general range of products for generating electricity from wind."),
    "wind_turbine": (25000, "Wind Turbine — a device that converts wind energy into electricity."),
    "vertical_axis_wind_turbine": (22000, "Vertical Axis Wind Turbine — a wind turbine designed with a vertical rotor shaft."),
    "horizontal_axis_wind_turbine": (28000, "Horizontal Axis Wind Turbine — a wind turbine designed with a horizontal rotor shaft."),
    "wind_turbine_generator": (18000, "Wind Turbine Generator — a generator unit designed for converting wind power into electricity."),
    "wind_charge_controller": (4500, "Wind Charge Controller — a controller that regulates power flow from a wind turbine to batteries."),
    "wind_turbine_blades": (3500, "Wind Turbine Blades — replacement blades designed for wind turbines."),
    "portable_power": (2500, "Portable Power — a general range of portable power generation and storage products."),
    "portable_power_station": (12000, "Portable Power Station — a rechargeable battery unit designed for portable power supply."),
    "solar_generator": (15000, "Solar Generator — a portable power station charged using solar panels."),
    "emergency_power_station": (9500, "Emergency Power Station — a portable battery unit designed for backup power during outages."),
    "camping_power_station": (8500, "Camping Power Station — a portable power unit designed for outdoor and camping use."),
    "portable_battery_pack": (2500, "Portable Battery Pack — a compact rechargeable battery for charging small devices."),
    "ev_charging": (5500, "EV Charging — a general range of products for charging electric vehicles."),
    "ev_charger": (18000, "EV Charger — a device designed to charge electric vehicle batteries."),
    "portable_ev_charger": (9500, "Portable EV Charger — a compact, transportable charger designed for electric vehicles."),
    "home_ev_charging_station": (25000, "Home EV Charging Station — a wall-mounted charging station designed for home EV charging."),
    "ev_charging_cable": (3500, "EV Charging Cable — a cable used to connect an electric vehicle to a charging station."),
    "ev_charging_adapter": (1800, "EV Charging Adapter — an adapter used to connect different EV charging plug types."),
    "energy_storage": (5500, "Energy Storage — a general range of products for storing generated energy."),
    "home_battery_storage_system": (35000, "Home Battery Storage System — a large battery system designed to store energy for home use."),
    "battery_management_system": (4500, "Battery Management System — a system that monitors and protects battery performance."),
    "energy_storage_cabinet": (7500, "Energy Storage Cabinet — an enclosure designed to house energy storage batteries."),
    "battery_rack": (4500, "Battery Rack — a rack designed to mount and organize multiple batteries."),
    "solar_accessories": (500, "Solar Accessories — a general range of accessories used in solar power installations."),
    "solar_mounting_brackets": (1200, "Solar Mounting Brackets — brackets used to secure solar panels to a surface."),
    "roof_mount_kit": (2500, "Roof Mount Kit — a complete kit for mounting solar panels on a roof."),
    "ground_mount_kit": (3500, "Ground Mount Kit — a complete kit for mounting solar panels on the ground."),
    "solar_panel_clamp": (350, "Solar Panel Clamp — a clamp used to secure solar panels to mounting rails."),
    "solar_cable": (450, "Solar Cable — a cable designed for connecting solar panels and components."),
    "mc4_connector": (150, "MC4 Connector — a connector used for joining solar panel cables."),
    "mc4_extension_cable": (500, "MC4 Extension Cable — an extension cable fitted with MC4 connectors for solar wiring."),
    "junction_box": (700, "Junction Box — a box used to safely house electrical connections in solar systems."),
    "combiner_box": (2500, "Combiner Box — a box used to combine multiple solar panel strings into one output."),
    "dc_isolator_switch": (900, "DC Isolator Switch — a switch used to safely disconnect DC power in a solar system."),
    "solar_fuse": (250, "Solar Fuse — a protective fuse designed for solar panel circuits."),
    "solar_connector_tool": (700, "Solar Connector Tool — a tool used for crimping and connecting solar cable connectors."),
    "monitoring_smart_energy": (1200, "Monitoring & Smart Energy — a general range of products for tracking and managing energy use."),
    "energy_meter": (1500, "Energy Meter — a device used to measure electricity consumption."),
    "smart_energy_meter": (3500, "Smart Energy Meter — an energy meter with app connectivity for real-time monitoring."),
    "solar_monitoring_device": (4500, "Solar Monitoring Device — a device used to track solar system performance and output."),
    "wifi_energy_monitor": (3500, "WiFi Energy Monitor — a smart device that monitors energy usage over WiFi."),
    "smart_power_meter": (3200, "Smart Power Meter — a meter that provides real-time electricity usage data."),
    "data_logger": (2500, "Data Logger — a device that records energy and system performance data over time."),
    "backup_power": (2200, "Backup Power — a general range of products designed for backup electricity supply."),
    "ups": (5500, "UPS (Uninterruptible Power Supply) — a device that provides emergency backup power during outages."),
    "inverter_battery": (8500, "Inverter Battery — a battery designed to work with home power inverters."),
    "automatic_transfer_switch": (7500, "Automatic Transfer Switch — a switch that automatically transfers power between sources."),
    "voltage_stabilizer": (2500, "Voltage Stabilizer — a device that regulates voltage to protect electrical equipment."),
    "surge_protector": (700, "Surge Protector — a device that protects equipment from voltage spikes."),
    "energy_efficient_lighting": (350, "Energy Efficient Lighting — a general range of low-energy lighting products."),
    "led_bulb": (150, "LED Bulb — an energy-efficient light bulb using LED technology."),
    "led_tube_light": (350, "LED Tube Light — an energy-efficient tube-style LED light fixture."),
    "led_flood_light": (900, "LED Flood Light — a powerful energy-efficient light designed for wide-area illumination."),
    "led_panel_light": (700, "LED Panel Light — a flat, energy-efficient light panel designed for ceiling installation."),
    "motion_sensor_light": (600, "Motion Sensor Light — a light that automatically turns on when motion is detected."),
    "smart_led_bulb": (700, "Smart LED Bulb — an app-controlled, energy-efficient LED bulb."),
    "smart_home_energy": (900, "Smart Home Energy — a general range of smart devices for managing home energy use."),
    "smart_plug": (700, "Smart Plug — a plug that allows remote control of connected appliances."),
    "smart_switch": (900, "Smart Switch — a wall switch that allows remote and automated control of lighting."),
    "smart_thermostat": (4500, "Smart Thermostat — a thermostat with app connectivity for optimized energy use."),
    "smart_power_strip": (1500, "Smart Power Strip — a power strip with individually controllable, app-connected outlets."),
    "smart_relay": (900, "Smart Relay — a relay device used for automated switching of electrical loads."),
    "water_irrigation": (2500, "Water & Irrigation — a general range of solar-powered water and irrigation products."),
    "solar_drip_irrigation_kit": (4500, "Solar Drip Irrigation Kit — a solar-powered kit designed for efficient drip irrigation."),
    "solar_water_timer": (900, "Solar Water Timer — a solar-powered timer used to automate watering schedules."),
    "solar_water_filter": (1800, "Solar Water Filter — a solar-powered filtration system for clean water."),
    "solar_water_purifier": (5500, "Solar Water Purifier — a solar-powered device designed to purify drinking water."),
    "heating_cooling": (3500, "Heating & Cooling — a general range of solar-powered heating and cooling products."),
    "solar_attic_fan": (5500, "Solar Attic Fan — a solar-powered fan designed to ventilate attic spaces."),
    "solar_exhaust_fan": (3500, "Solar Exhaust Fan — a solar-powered fan designed for ventilation and exhaust."),
    "solar_ventilator": (4500, "Solar Ventilator — a solar-powered device designed to improve air circulation."),
    "solar_air_conditioner": (35000, "Solar Air Conditioner — an air conditioning unit powered by solar energy."),
    "solar_water_heating_kit": (15000, "Solar Water Heating Kit — a complete kit for setting up a solar water heating system."),
    "installation_tools": (700, "Installation Tools — a general range of tools used for solar system installation."),
    "mc4_crimping_tool": (1500, "MC4 Crimping Tool — a tool used to crimp MC4 solar connectors onto cables."),
    "solar_cable_cutter": (450, "Solar Cable Cutter — a tool designed for cutting solar cables cleanly."),
    "wire_stripper": (350, "Wire Stripper — a tool used to remove insulation from electrical wires."),
    "cable_tester": (900, "Cable Tester — a device used to test the continuity and integrity of cables."),
    "digital_multimeter": (1500, "Digital Multimeter — a device used to measure voltage, current, and resistance."),
    "clamp_meter": (2200, "Clamp Meter — a device used to measure electrical current without breaking the circuit."),
    "safety_equipment": (500, "Safety Equipment — a general range of protective equipment for solar installation work."),
    "dc_circuit_breaker": (900, "DC Circuit Breaker — a breaker designed to protect DC circuits in solar systems."),
    "ac_circuit_breaker": (700, "AC Circuit Breaker — a breaker designed to protect AC circuits in power systems."),
    "fuse_holder": (250, "Fuse Holder — a holder designed to secure fuses in an electrical circuit."),
    "lightning_protection_device": (2500, "Lightning Protection Device — a device designed to protect solar systems from lightning strikes."),
    "grounding_kit": (900, "Grounding Kit — a kit used to properly ground a solar power system."),
    "safety_gloves": (350, "Safety Gloves — insulated gloves designed for electrical safety during installation."),
    "safety_helmet": (600, "Safety Helmet — protective headgear designed to shield the head from impact."),
    "maintenance_cleaning": (450, "Maintenance & Cleaning — a general range of products for solar system upkeep."),
    "solar_panel_cleaning_brush": (700, "Solar Panel Cleaning Brush — a brush designed for gently cleaning solar panel surfaces."),
    "solar_panel_cleaning_kit": (1500, "Solar Panel Cleaning Kit — a complete kit designed for cleaning and maintaining solar panels."),
    "water_fed_pole": (2500, "Water Fed Pole — an extendable pole used for cleaning elevated solar panels."),
    "cleaning_solution": (350, "Cleaning Solution — a liquid solution designed for cleaning solar panels."),
    "inspection_camera": (3500, "Inspection Camera — a camera used to inspect solar panels and wiring for damage."),
    "educational_diy_kits": (900, "Educational & DIY Kits — a general range of solar-powered learning and hobby kits."),
    "diy_solar_kit": (2500, "DIY Solar Kit — a build-it-yourself kit for learning about solar power systems."),
    "stem_solar_kit": (1500, "STEM Solar Kit — an educational kit designed to teach solar energy concepts."),
    "mini_solar_panel_kit": (700, "Mini Solar Panel Kit — a small-scale solar panel kit for hobby projects."),
    "solar_robot_kit": (1200, "Solar Robot Kit — a build-it-yourself robot kit powered by a small solar panel."),
    "solar_science_kit": (1500, "Solar Science Kit — an educational kit designed to demonstrate solar energy principles."),
    "bioenergy_products": (2500, "Bioenergy Products — a general range of products for generating energy from organic material."),
    "biogas_digester_kit": (15000, "Biogas Digester Kit — a system that converts organic waste into usable biogas."),
    "biomass_pellet_stove": (12000, "Biomass Pellet Stove — a stove designed to burn compressed biomass pellets for heat."),
    "biomass_boiler": (35000, "Biomass Boiler — a boiler designed to generate heat from biomass fuel."),
    "wood_pellet_fuel": (900, "Wood Pellet Fuel — compressed wood pellets used as a renewable fuel source."),
    "hydroelectric_equipment": (5500, "Hydroelectric Equipment — a general range of products for generating electricity from water."),
    "micro_hydro_turbine": (25000, "Micro Hydro Turbine — a small turbine designed to generate electricity from flowing water."),
    "water_turbine_generator": (28000, "Water Turbine Generator — a generator unit designed for converting water flow into electricity."),
    "hydro_charge_controller": (5500, "Hydro Charge Controller — a controller that regulates power flow from a hydro turbine to batteries."),
}

path = "data/products-placeholder.json"
with open(path, "r", encoding="utf-8") as f:
    data = json.load(f)

updated = 0
skipped = []
for sku, prod in data.items():
    if prod.get("categoryId") == "renewable_energy":
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

print(f"products-placeholder.json: Updated {updated}, Skipped {skipped}")

path3 = "data/products-placeholder-batch3.json"
with open(path3, "r", encoding="utf-8") as f:
    data3 = json.load(f)

updated3 = 0
skipped3 = []
for sku, prod in data3.items():
    if prod.get("categoryId") == "renewable_energy":
        img = prod["images"]["main"].split("/")[-1].replace(".png", "")
        if img in price_desc:
            price, desc = price_desc[img]
            title = " ".join(w.capitalize() for w in img.split("_"))
            prod["title"] = title
            prod["price"] = price
            prod["description"] = desc
            prod["status"] = "active"
            updated3 += 1
        else:
            skipped3.append((sku, img))

with open(path3, "w", encoding="utf-8") as f:
    json.dump(data3, f, ensure_ascii=False, indent=2)

print(f"products-placeholder-batch3.json: Updated {updated3}, Skipped {skipped3}")
print(f"Total Updated: {updated + updated3}")
