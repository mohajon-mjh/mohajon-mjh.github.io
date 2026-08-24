import json

price_desc = {
    "health_wellness": (500, "Health & Wellness Products — a general range of items designed to support wellbeing."),
    "ab_roller": (900, "Ab Roller — a wheeled fitness tool used for core strengthening exercises."),
    "acupressure_mat": (900, "Acupressure Mat — a spiked mat designed to relax muscles through pressure point stimulation."),
    "adult_coloring_book": (350, "Adult Coloring Book — a coloring book designed as a relaxing creative activity for adults."),
    "air_fryer": (5500, "Air Fryer — a kitchen appliance used to cook food with hot air for a healthier alternative to frying."),
    "air_purifier": (4500, "Air Purifier — a device that filters and cleans indoor air."),
    "ankle_weights": (500, "Ankle Weights — wearable weights used to add resistance during exercise."),
    "aroma_diffuser": (1200, "Aroma Diffuser — a device that disperses scented oils into the air."),
    "aromatherapy_essential_oils": (700, "Aromatherapy Essential Oils — natural oils used for relaxation and aromatherapy."),
    "back_massager": (2500, "Back Massager — a device designed to relax and massage the back."),
    "back_support_belt": (900, "Back Support Belt — a wearable belt designed to support and stabilize the lower back."),
    "balance_board": (1500, "Balance Board — a training board used for balance and core exercises."),
    "balance_cushion": (900, "Balance Cushion — an inflatable cushion used for balance and stability training."),
    "bcaa_powder": (1800, "BCAA Powder — a supplement powder containing branched-chain amino acids for muscle recovery."),
    "beard_grooming_kit": (900, "Beard Grooming Kit — a set of tools designed for beard care and styling."),
    "blender": (2500, "Blender — a kitchen appliance used to blend fruits, vegetables, and beverages."),
    "blender_bottle": (400, "Blender Bottle — a shaker bottle used for mixing protein shakes and drinks."),
    "blood_glucose_meter": (1500, "Blood Glucose Meter — a device used to measure blood sugar levels."),
    "blood_pressure_monitor": (1800, "Blood Pressure Monitor — a device used to measure blood pressure."),
    "body_fat_scale": (2200, "Body Fat Scale — a scale that estimates body fat percentage along with weight."),
    "body_groomer": (1800, "Body Groomer — a trimmer designed for body hair grooming."),
    "breast_pump": (4500, "Breast Pump — a device used to express and collect breast milk."),
    "calcium_supplements": (600, "Calcium Supplements — dietary supplements formulated to support bone health."),
    "collagen_supplements": (1500, "Collagen Supplements — dietary supplements formulated to support skin, hair, and joint health."),
    "compression_socks": (400, "Compression Socks — socks designed to improve blood circulation in the legs."),
    "compression_travel_socks": (450, "Compression Travel Socks — socks designed to reduce leg fatigue during travel."),
    "cooling_towel": (350, "Cooling Towel — a towel designed to provide a cooling effect during workouts."),
    "creatine": (1800, "Creatine — a dietary supplement commonly used to support muscle performance."),
    "dehumidifier": (5500, "Dehumidifier — a device that reduces excess moisture in indoor air."),
    "dental_floss": (100, "Dental Floss — a thin thread used to clean between teeth."),
    "digital_thermometer": (350, "Digital Thermometer — an electronic thermometer used to measure body temperature."),
    "dumbbells": (1500, "Dumbbells — handheld weights used for strength training exercises."),
    "ear_plugs": (150, "Ear Plugs — small inserts used to reduce noise exposure."),
    "electric_shaver": (1800, "Electric Shaver — a powered device used for facial or body hair shaving."),
    "electric_toothbrush": (1500, "Electric Toothbrush — a powered toothbrush designed for oral hygiene."),
    "electrolyte_powder": (700, "Electrolyte Powder — a powder mix designed to replenish electrolytes during exercise."),
    "ems_muscle_stimulator": (1800, "EMS Muscle Stimulator — a device that uses electrical pulses to stimulate muscles."),
    "energy_gel": (150, "Energy Gel — a quick-energy gel used during endurance exercise."),
    "essential_oil_diffuser": (1200, "Essential Oil Diffuser — a device that disperses scented essential oils into the air."),
    "exercise_ball": (700, "Exercise Ball — an inflatable ball used for fitness and rehabilitation exercises."),
    "eye_mask": (250, "Eye Mask — a soft mask worn over the eyes to block light or relieve puffiness."),
    "fidget_cube": (300, "Fidget Cube — a small handheld toy designed to relieve stress and restlessness."),
    "finger_exerciser": (350, "Finger Exerciser — a small tool used to strengthen finger muscles."),
    "fitness_exercise": (900, "Fitness & Exercise Products — a general range of items designed to support workouts."),
    "fitness_step_platform": (2500, "Fitness Step Platform — a raised platform used for step aerobics exercises."),
    "fitness_towel": (250, "Fitness Towel — a sweat-absorbent towel designed for workouts."),
    "fitness_tracker": (2500, "Fitness Tracker — a wearable device that tracks physical activity and health metrics."),
    "foam_roller": (900, "Foam Roller — a cylindrical tool used for muscle recovery and stretching."),
    "foot_massager": (2500, "Foot Massager — a device designed to relax and massage the feet."),
    "gym_bag": (900, "Gym Bag — a bag designed to carry workout gear and essentials."),
    "hair_trimmer": (1500, "Hair Trimmer — a powered device used for trimming hair."),
    "hand_exerciser": (350, "Hand Exerciser — a small tool used to strengthen hand and grip muscles."),
    "hand_grip_strengthener": (300, "Hand Grip Strengthener — a small tool used to exercise hand and grip strength."),
    "hand_sanitizer": (150, "Hand Sanitizer — a quick-drying gel used to clean hands without water."),
    "healthy_kitchen": (900, "Healthy Kitchen Products — a general range of items designed to support healthy cooking."),
    "healthy_living": (700, "Healthy Living Products — a general range of items designed to support a healthy lifestyle."),
    "heart_rate_monitor": (1800, "Heart Rate Monitor — a device used to track heart rate."),
    "heating_pad": (900, "Heating Pad — a pad used to apply warmth to sore muscles."),
    "heating_pad_for_menstrual_relief": (900, "Heating Pad for Menstrual Relief — a heating pad designed to ease menstrual discomfort."),
    "himalayan_salt_lamp": (1500, "Himalayan Salt Lamp — a decorative lamp made from salt crystal, used for ambient lighting."),
    "home_wellness": (900, "Home Wellness Products — a general range of items designed to support wellbeing at home."),
    "hot_cold_gel_pack": (350, "Hot & Cold Gel Pack — a reusable pack used for both heat and cold therapy."),
    "hot_water_bag": (300, "Hot Water Bag — a rubber bag used to apply warmth to the body."),
    "humidifier": (3500, "Humidifier — a device that adds moisture to indoor air."),
    "hygiene_self_care": (500, "Hygiene & Self-Care Products — a general range of items designed for personal care."),
    "ice_pack": (250, "Ice Pack — a reusable pack used for cold therapy."),
    "insulated_water_bottle": (700, "Insulated Water Bottle — a bottle designed to keep beverages hot or cold."),
    "iron_supplements": (600, "Iron Supplements — dietary supplements formulated to support healthy iron levels."),
    "juicer": (3500, "Juicer — a kitchen appliance used to extract juice from fruits and vegetables."),
    "jump_rope": (350, "Jump Rope — a fitness tool used for cardio and coordination exercises."),
    "kettlebells": (2200, "Kettlebells — weighted fitness equipment used for strength training."),
    "knee_support": (700, "Knee Support — a supportive brace designed to stabilize the knee joint."),
    "lunch_box": (500, "Lunch Box — a container designed for carrying meals."),
    "magnesium_supplements": (700, "Magnesium Supplements — dietary supplements formulated to support magnesium levels."),
    "mass_gainer": (3500, "Mass Gainer — a high-calorie supplement powder designed to support weight and muscle gain."),
    "massage_ball": (350, "Massage Ball — a small ball used for targeted muscle recovery."),
    "massage_cushion": (2500, "Massage Cushion — a cushion designed to provide massage for the back and neck."),
    "massage_gun": (3500, "Massage Gun — a handheld device used for percussive muscle therapy."),
    "massage_oil": (350, "Massage Oil — an oil used to reduce friction during massage."),
    "massage_relaxation": (900, "Massage & Relaxation Products — a general range of items designed for relaxation."),
    "massage_roller": (700, "Massage Roller — a handheld roller tool used for muscle massage."),
    "mattress_topper": (3500, "Mattress Topper — a padded layer added to a mattress for extra comfort."),
    "meal_prep_container": (500, "Meal Prep Container — a reusable container designed for meal planning and storage."),
    "meal_replacement_shake": (900, "Meal Replacement Shake — a nutritional shake designed as a meal substitute."),
    "medicine_storage_box": (700, "Medicine Storage Box — a box designed for organizing medicines."),
    "meditation_cushion": (1500, "Meditation Cushion — a cushion designed for comfortable seated meditation."),
    "memory_foam_pillow": (1800, "Memory Foam Pillow — a supportive pillow made from contouring memory foam."),
    "mens_wellness": (700, "Men's Wellness Products — a general range of items designed to support men's health."),
    "menstrual_cup": (700, "Menstrual Cup — a reusable cup designed for menstrual care."),
    "mental_wellness": (700, "Mental Wellness Products — a general range of items designed to support mental wellbeing."),
    "mouthwash_dispenser": (350, "Mouthwash Dispenser — a dispenser designed for convenient mouthwash use."),
    "multivitamins": (900, "Multivitamins — dietary supplements formulated to provide a broad range of vitamins."),
    "nasal_rinse_bottle": (350, "Nasal Rinse Bottle — a bottle used for nasal irrigation."),
    "nebulizer": (2500, "Nebulizer — a device that converts liquid medication into an inhalable mist."),
    "neck_massager": (2500, "Neck Massager — a device designed to relax and massage the neck."),
    "neck_pillow": (700, "Neck Pillow — a supportive pillow designed for neck comfort."),
    "nursing_pillow": (1500, "Nursing Pillow — a supportive pillow designed to assist with breastfeeding."),
    "omega_3_fish_oil": (1200, "Omega-3 Fish Oil — a dietary supplement formulated to support heart and brain health."),
    "oral_care": (300, "Oral Care Products — a general range of items designed for oral hygiene."),
    "orthopedic_pillow": (1800, "Orthopedic Pillow — a supportive pillow designed for proper spinal alignment."),
    "pain_relief": (500, "Pain Relief Products — a general range of items designed to ease discomfort."),
    "pedal_exerciser": (1800, "Pedal Exerciser — a compact pedal device used for seated leg exercises."),
    "personal_grooming_kit": (1500, "Personal Grooming Kit — a set of tools designed for personal grooming care."),
    "personal_health_monitoring": (2500, "Personal Health Monitoring Products — a general range of devices used to track health metrics."),
    "pill_organizer": (300, "Pill Organizer — a container with compartments used to sort medication by day."),
    "plant_protein": (2200, "Plant Protein — a plant-based protein supplement powder."),
    "posture_brace": (900, "Posture Brace — a wearable brace designed to support upright posture."),
    "posture_corrector": (900, "Posture Corrector — a wearable brace designed to support upright posture."),
    "prebiotics": (900, "Prebiotics — dietary supplements formulated to support digestive health."),
    "probiotics": (900, "Probiotics — dietary supplements formulated to support gut health."),
    "protein_powder": (2500, "Protein Powder — a supplement powder used to support muscle recovery and nutrition."),
    "pull_up_bar": (1800, "Pull-Up Bar — a fitness bar used for upper body strength exercises."),
    "pulse_oximeter": (900, "Pulse Oximeter — a device used to measure blood oxygen saturation."),
    "push_up_board": (1500, "Push-Up Board — a fitness board designed to target different muscles during push-ups."),
    "recovery_drink": (500, "Recovery Drink — a beverage formulated to support post-workout recovery."),
    "rehabilitation": (2500, "Rehabilitation Products — a general range of tools used for physical recovery."),
    "resistance_bands": (400, "Resistance Bands — elastic bands used for strength and rehabilitation exercises."),
    "resistance_therapy_bands": (400, "Resistance Therapy Bands — elastic bands designed for physical therapy exercises."),
    "respiratory_wellness": (900, "Respiratory Wellness Products — a general range of items designed to support breathing health."),
    "reusable_sanitary_pads": (700, "Reusable Sanitary Pads — washable fabric pads designed for menstrual care."),
    "saline_spray_bottle": (250, "Saline Spray Bottle — a spray bottle used for nasal saline care."),
    "sanitizing_wipes": (250, "Sanitizing Wipes — pre-moistened wipes used to sanitize surfaces and hands."),
    "shoulder_massager": (2500, "Shoulder Massager — a device designed to relax and massage the shoulders."),
    "sleep_comfort": (900, "Sleep Comfort Products — a general range of items designed to improve sleep quality."),
    "smart_body_weight_scale": (2500, "Smart Body Weight Scale — a connected scale that tracks weight and body metrics."),
    "smart_water_bottle": (1800, "Smart Water Bottle — a connected bottle that tracks water intake."),
    "smartwatch": (3500, "Smartwatch — a wearable device that tracks fitness and health metrics."),
    "soap_dispenser": (350, "Soap Dispenser — a dispenser designed for convenient hand soap use."),
    "sports_nutrition": (1800, "Sports Nutrition Products — a general range of supplements designed to support athletic performance."),
    "steam_cooker": (2500, "Steam Cooker — a kitchen appliance used to cook food using steam."),
    "steam_inhaler": (1500, "Steam Inhaler — a device used to deliver steam therapy for nasal congestion."),
    "stress_relief_ball": (200, "Stress Relief Ball — a squeezable ball used to relieve stress."),
    "teeth_whitening_kit": (900, "Teeth Whitening Kit — a set of products designed to whiten teeth."),
    "tens_machine": (2500, "TENS Machine — a device that uses electrical pulses for muscle and pain therapy."),
    "therapy_putty": (300, "Therapy Putty — a moldable putty used for hand rehabilitation exercises."),
    "tongue_cleaner": (150, "Tongue Cleaner — a small tool used for oral hygiene."),
    "travel_first_aid_kit": (700, "Travel First Aid Kit — a compact kit of essential care items for travel emergencies."),
    "travel_health": (700, "Travel Health Products — a general range of items designed to support health while traveling."),
    "travel_neck_pillow": (700, "Travel Neck Pillow — a supportive pillow designed for comfort during travel."),
    "uv_sterilizer_box": (2200, "UV Sterilizer Box — a device that uses UV light to sanitize small items."),
    "vitamin_a": (500, "Vitamin A — a dietary supplement formulated to support vision and immune health."),
    "vitamin_b_complex": (600, "Vitamin B Complex — a dietary supplement formulated to support energy and metabolism."),
    "vitamin_c": (500, "Vitamin C — a dietary supplement formulated to support immune health."),
    "vitamin_d": (500, "Vitamin D — a dietary supplement formulated to support bone and immune health."),
    "vitamin_e": (500, "Vitamin E — a dietary supplement formulated to support skin and immune health."),
    "vitamins_supplements": (700, "Vitamins & Supplements — a general range of dietary supplement products."),
    "water_bottle": (350, "Water Bottle — a reusable bottle designed for carrying drinking water."),
    "water_filter_pitcher": (1500, "Water Filter Pitcher — a pitcher designed to filter drinking water."),
    "water_flosser": (1800, "Water Flosser — a device that uses a water stream for oral hygiene."),
    "water_purifier": (5500, "Water Purifier — a device designed to purify drinking water."),
    "weighted_blanket": (2500, "Weighted Blanket — a blanket filled with weighted material designed to promote relaxation."),
    "wellness_accessories": (500, "Wellness Accessories — a general range of items designed to support wellbeing."),
    "whey_protein": (3500, "Whey Protein — a supplement powder used to support muscle recovery and nutrition."),
    "white_noise_machine": (1800, "White Noise Machine — a device that produces ambient sound to support restful sleep."),
    "womens_wellness": (700, "Women's Wellness Products — a general range of items designed to support women's health."),
    "wrist_brace": (450, "Wrist Brace — a supportive wrap designed to stabilize the wrist."),
    "wrist_weights": (500, "Wrist Weights — wearable weights used to add resistance during exercise."),
    "yoga_mat": (700, "Yoga Mat — a padded mat used for yoga and floor exercises."),
    "yoga_meditation_icon": (700, "Yoga & Meditation Products — a general range of items designed to support yoga and meditation practice."),
    "zinc_supplements": (600, "Zinc Supplements — dietary supplements formulated to support immune health."),
}

paths = [
    "data/products-placeholder.json",
    "data/products-placeholder-batch2.json",
]

total_updated = 0
total_skipped = []
for path in paths:
    try:
        with open(path, "r", encoding="utf-8") as f:
            data = json.load(f)
    except FileNotFoundError:
        continue

    updated = 0
    for sku, prod in data.items():
        if prod.get("categoryId") == "health_wellness":
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
                total_skipped.append((path, sku, img))

    with open(path, "w", encoding="utf-8") as f:
        json.dump(data, f, ensure_ascii=False, indent=2)

    print(f"{path}: Updated {updated}")
    total_updated += updated

print(f"Total Updated: {total_updated}")
print(f"Skipped: {total_skipped}")
