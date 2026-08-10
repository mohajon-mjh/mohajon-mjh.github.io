const fs = require('fs');
const path = require('path');
const os = require('os');

const API_KEY = "AIzaSyDj_LLHWBgcKfQClnaOUqEtULHhP1vSVxw";
const DB_URL = "https://mohajon-mjh-default-rtdb.firebaseio.com";
const CLOUD_NAME = "fd70754d";
const UPLOAD_PRESET = "mohajon-mjh";

const ADMIN_EMAIL = "mohajonmjh@gmail.com";
const ADMIN_PASSWORD = "Mjh@Mohajon$1975";

const BASE_IMAGE_DIR = path.join(os.homedir(), "storage/downloads/mohajon-mjh/assets/images/categories");

const categoryGroups = [
  {
    categoryId: "-Oyxb9C2sczQEh7NA2Ez",
    folder: "Second-Hand & Refurbished Goods",
    products: [
      { title: "Used Smartphone", price: 12500, file: "used_smartphone.png" },
      { title: "Refurbished Smartphone", price: 18900, file: "refurbished_smartphone.png" },
      { title: "Used Tablet", price: 10500, file: "used_tablet.png" },
      { title: "Refurbished Tablet", price: 16500, file: "refurbished_tablet.png" },
      { title: "Used Laptop", price: 28500, file: "used_laptop.png" },
      { title: "Refurbished Laptop", price: 42000, file: "refurbished_laptop.png" },
      { title: "Used Desktop Computer", price: 22500, file: "used_desktop_computer.png" },
      { title: "Used Monitor", price: 8500, file: "used_monitor.png" },
      { title: "Used Printer", price: 7500, file: "used_printer.png" },
      { title: "Used Keyboard", price: 750, file: "used_keyboard.png" },
      { title: "Used Mouse", price: 450, file: "used_mouse.png" },
      { title: "Used Webcam", price: 1500, file: "used_webcam.png" },
      { title: "Used Speaker", price: 2200, file: "used_speaker.png" },
      { title: "Used Headphones", price: 1800, file: "used_headphones.png" },
      { title: "Used Earbuds", price: 1500, file: "used_earbuds.png" },
      { title: "Used Smartwatch", price: 4500, file: "used_smartwatch.png" },
      { title: "Used Fitness Tracker", price: 2800, file: "used_fitness_tracker.png" },
      { title: "Used Power Bank", price: 1200, file: "used_power_bank.png" },
      { title: "Used Router", price: 2200, file: "used_router.png" },
      { title: "Used Modem", price: 1800, file: "used_modem.png" },
      { title: "Used Hard Drive (HDD)", price: 2800, file: "used_hard_drive_hdd.png" },
      { title: "Used SSD", price: 3500, file: "used_ssd.png" },
      { title: "Used Graphics Card", price: 12500, file: "used_graphics_card.png" },
      { title: "Used CPU", price: 8500, file: "used_cpu.png" },
      { title: "Used RAM", price: 2200, file: "used_ram.png" },
      { title: "Used Motherboard", price: 6500, file: "used_motherboard.png" },
      { title: "Used Refrigerator", price: 22000, file: "used_refrigerator.png" },
      { title: "Used Washing Machine", price: 16500, file: "used_washing_machine.png" },
      { title: "Used Air Conditioner", price: 24500, file: "used_air_conditioner.png" },
      { title: "Used Microwave Oven", price: 6800, file: "used_microwave_oven.png" },
      { title: "Used Electric Oven", price: 8500, file: "used_electric_oven.png" },
      { title: "Used Rice Cooker", price: 2200, file: "used_rice_cooker.png" },
      { title: "Used Blender", price: 1800, file: "used_blender.png" },
      { title: "Used Mixer Grinder", price: 2500, file: "used_mixer_grinder.png" },
      { title: "Used Vacuum Cleaner", price: 7500, file: "used_vacuum_cleaner.png" },
      { title: "Used Water Purifier", price: 8500, file: "used_water_purifier.png" },
      { title: "Used Water Heater", price: 5500, file: "used_water_heater.png" },
      { title: "Used Ceiling Fan", price: 2200, file: "used_ceiling_fan.png" },
      { title: "Used Air Purifier", price: 9500, file: "used_air_purifier.png" },
      { title: "Used Sofa", price: 18500, file: "used_sofa.png" },
      { title: "Used Bed", price: 15000, file: "used_bed.png" },
      { title: "Used Mattress", price: 6500, file: "used_mattress.png" },
      { title: "Used Dining Table", price: 12500, file: "used_dining_table.png" },
      { title: "Used Chair", price: 1500, file: "used_chair.png" },
      { title: "Used Office Chair", price: 4500, file: "used_office_chair.png" },
      { title: "Used Wardrobe", price: 14500, file: "used_wardrobe.png" },
      { title: "Used Bookshelf", price: 4000, file: "used_bookshelf.png" },
      { title: "Used TV Cabinet", price: 6500, file: "used_tv_cabinet.png" },
      { title: "Used Coffee Table", price: 3500, file: "used_coffee_table.png" },
      { title: "Used Study Table", price: 5500, file: "used_study_table.png" },
      { title: "Used Office Desk", price: 8500, file: "used_office_desk.png" },
      { title: "Used Dressing Table", price: 7500, file: "used_dressing_table.png" },
      { title: "Used Filing Cabinet", price: 6000, file: "used_filing_cabinet.png" },
      { title: "Used Projector", price: 18500, file: "used_projector.png" },
      { title: "Used Photocopier", price: 35000, file: "used_photocopier.png" },
      { title: "Used Scanner", price: 6500, file: "used_scanner.png" },
      { title: "Used POS Machine", price: 12500, file: "used_pos_machine.png" },
      { title: "Used Barcode Scanner", price: 4500, file: "used_barcode_scanner.png" },
      { title: "Used Phone Case", price: 250, file: "used_phone_case.png" },
      { title: "Used Charger", price: 450, file: "used_charger.png" },
      { title: "Used USB Cable", price: 200, file: "used_usb_cable.png" },
      { title: "Used Wireless Charger", price: 1200, file: "used_wireless_charger.png" },
      { title: "Used Bluetooth Speaker", price: 2200, file: "used_bluetooth_speaker.png" },
      { title: "Used Bluetooth Headset", price: 1500, file: "used_bluetooth_headset.png" },
      { title: "Used DSLR Camera", price: 38000, file: "used_dslr_camera.png" },
      { title: "Used Mirrorless Camera", price: 55000, file: "used_mirrorless_camera.png" },
      { title: "Used Action Camera", price: 9500, file: "used_action_camera.png" },
      { title: "Used Camera Lens", price: 18000, file: "used_camera_lens.png" },
      { title: "Used Drone", price: 32000, file: "used_drone.png" },
      { title: "Used Tripod", price: 1800, file: "used_tripod.png" },
      { title: "Used Camera Flash", price: 6500, file: "used_camera_flash.png" },
      { title: "Used Gaming Console", price: 28000, file: "used_gaming_console.png" },
      { title: "Used Game Controller", price: 3500, file: "used_game_controller.png" },
      { title: "Used VR Headset", price: 18500, file: "used_vr_headset.png" },
      { title: "Used Gaming Chair", price: 12000, file: "used_gaming_chair.png" },
      { title: "Used Gaming Monitor", price: 16500, file: "used_gaming_monitor.png" },
      { title: "Used Video Games", price: 2000, file: "used_video_games.png" },
      { title: "Used Guitar", price: 8500, file: "used_guitar.png" },
      { title: "Used Piano", price: 42000, file: "used_piano.png" },
      { title: "Used Keyboard Harmony", price: 9500, file: "used_keyboard_harmony.png" },
      { title: "Used Drum Set", price: 28000, file: "used_drum_set.png" },
      { title: "Used Violin", price: 9500, file: "used_violin.png" },
      { title: "Used Amplifier", price: 8500, file: "used_amplifier.png" },
      { title: "Used Microphone", price: 3500, file: "used_microphone.png" },
      { title: "Used Treadmill", price: 32000, file: "used_treadmill.png" },
      { title: "Used Exercise Bike", price: 18500, file: "used_exercise_bike.png" },
      { title: "Used Dumbbells", price: 4500, file: "used_dumbbells.png" },
      { title: "Used Bench Press", price: 12500, file: "used_bench_press.png" },
      { title: "Used Yoga Mat", price: 650, file: "used_yoga_mat.png" },
      { title: "Used Cricket Bat", price: 2500, file: "used_cricket_bat.png" },
      { title: "Used Football", price: 900, file: "used_football.png" },
      { title: "Used Bicycle", price: 8500, file: "used_bicycle.png" },
      { title: "Used Baby Stroller", price: 5500, file: "used_baby_stroller.png" },
      { title: "Used Baby Crib", price: 8500, file: "used_baby_crib.png" },
      { title: "Used Baby Car Seat", price: 4500, file: "used_baby_car_seat.png" },
      { title: "Used Baby Walker", price: 2500, file: "used_baby_walker.png" },
      { title: "Used High Chair", price: 3500, file: "used_high_chair.png" },
      { title: "Used Textbooks", price: 450, file: "used_textbooks.png" },
      { title: "Used Novels", price: 350, file: "used_novels.png" },
      { title: "Used Magazines", price: 120, file: "used_magazines.png" },
      { title: "Used Educational Books", price: 550, file: "used_educational_books.png" },
      { title: "Used Exam Guides", price: 450, file: "used_exam_guides.png" },
      { title: "Used Car", price: 650000, file: "used_car.png" },
      { title: "Used Motorcycle", price: 145000, file: "used_motorcycle.png" },
      { title: "Used Gear Bicycle", price: 8500, file: "used_gear_bicycle.png" },
      { title: "Used Car Battery", price: 5500, file: "used_car_battery.png" },
      { title: "Used Car Tire", price: 3500, file: "used_car_tire.png" },
      { title: "Used Car Audio System", price: 6500, file: "used_car_audio_system.png" },
      { title: "Used GPS Device", price: 4500, file: "used_gps_device.png" },
      { title: "Used Generator", price: 35000, file: "used_generator.png" },
      { title: "Used Air Compressor", price: 12500, file: "used_air_compressor.png" },
      { title: "Used Welding Machine", price: 18500, file: "used_welding_machine.png" },
      { title: "Used Power Tools", price: 4500, file: "used_power_tools.png" },
      { title: "Used Industrial Machinery", price: 180000, file: "used_industrial_machinery.png" },
      { title: "Used Medical Equipment", price: 45000, file: "used_medical_equipment.png" },
      { title: "Used Coins", price: 1500, file: "used_coins.png" },
      { title: "Used Stamps", price: 800, file: "used_stamps.png" },
      { title: "Used Watches", price: 5500, file: "used_watches.png" },
      { title: "Used Antiques", price: 15000, file: "used_antiques.png" },
      { title: "Used Vintage Items", price: 8500, file: "used_vintage_items.png" },
      { title: "Refurbished iPhone", price: 52000, file: "refurbished_iphone.png" },
      { title: "Refurbished Android Phone", price: 22500, file: "refurbished_android_phone.png" },
      { title: "Refurbished MacBook", price: 95000, file: "refurbished_macbook.png" },
      { title: "Refurbished Windows Laptop", price: 48000, file: "refurbished_windows_laptop.png" },
      { title: "Refurbished Desktop PC", price: 28500, file: "refurbished_desktop_pc.png" },
      { title: "Refurbished Smart TV", price: 32000, file: "refurbished_smart_tv.png" },
      { title: "Refurbished Smartwatch", price: 7500, file: "refurbished_smartwatch.png" },
      { title: "Refurbished Tablet Bn", price: 18500, file: "refurbished_tablet_bn.png" },
      { title: "Refurbished Gaming Console", price: 34000, file: "refurbished_gaming_console.png" },
      { title: "Refurbished Printer", price: 12500, file: "refurbished_printer.png" }
    ]
  },
  {
    categoryId: "-Oyxb9G7jRs3ebu4aApZ",
    folder: "Musical Instruments",
    products: [
      { title: "Acoustic Guitar", price: 9500, file: "acoustic_guitar.png" },
      { title: "Electric Guitar", price: 18500, file: "electric_guitar.png" },
      { title: "Classical Guitar", price: 11500, file: "classical_guitar.png" },
      { title: "Bass Guitar", price: 22000, file: "bass_guitar.png" },
      { title: "Ukulele", price: 4500, file: "ukulele.png" },
      { title: "Banjo", price: 16500, file: "banjo.png" },
      { title: "Mandolin", price: 12500, file: "mandolin.png" },
      { title: "Violin", price: 8500, file: "violin.png" },
      { title: "Viola", price: 15000, file: "viola.png" },
      { title: "Cello", price: 45000, file: "cello.png" },
      { title: "Double Bass", price: 120000, file: "double_bass.png" },
      { title: "Harp", price: 180000, file: "harp.png" },
      { title: "Sitar", price: 28000, file: "sitar.png" },
      { title: "Dotara", price: 3500, file: "dotara.png" },
      { title: "Ektara", price: 1500, file: "ektara.png" },
      { title: "Digital Piano", price: 65000, file: "digital_piano.png" },
      { title: "Upright Piano", price: 320000, file: "upright_piano.png" },
      { title: "Grand Piano", price: 1250000, file: "grand_piano.png" },
      { title: "Electronic Keyboard", price: 18500, file: "electronic_keyboard.png" },
      { title: "MIDI Keyboard", price: 15000, file: "midi_keyboard.png" },
      { title: "Synthesizer", price: 42000, file: "synthesizer.png" },
      { title: "Organ", price: 85000, file: "organ.png" },
      { title: "Accordion", price: 38000, file: "accordion.png" },
      { title: "Harmonium", price: 12500, file: "harmonium.png" },
      { title: "Acoustic Drum Set", price: 35000, file: "acoustic_drum_set.png" },
      { title: "Electronic Drum Set", price: 75000, file: "electronic_drum_set.png" },
      { title: "Snare Drum", price: 8500, file: "snare_drum.png" },
      { title: "Bass Drum", price: 15000, file: "bass_drum.png" },
      { title: "Cajon", price: 9500, file: "cajon.png" },
      { title: "Bongo", price: 7500, file: "bongo.png" },
      { title: "Conga", price: 18000, file: "conga.png" },
      { title: "Djembe", price: 9000, file: "djembe.png" },
      { title: "Tabla", price: 8500, file: "tabla.png" },
      { title: "Dhol", price: 7500, file: "dhol.png" },
      { title: "Dholak", price: 5500, file: "dholak.png" },
      { title: "Tambourine", price: 1200, file: "tambourine.png" },
      { title: "Maracas", price: 900, file: "maracas.png" },
      { title: "Cowbell", price: 1100, file: "cowbell.png" },
      { title: "Cymbals", price: 12000, file: "cymbals.png" },
      { title: "Triangle", price: 800, file: "triangle.png" },
      { title: "Xylophone", price: 8500, file: "xylophone.png" },
      { title: "Glockenspiel", price: 6500, file: "glockenspiel.png" },
      { title: "Flute", price: 2500, file: "flute.png" },
      { title: "Recorder", price: 850, file: "recorder.png" },
      { title: "Clarinet", price: 18000, file: "clarinet.png" },
      { title: "Oboe", price: 65000, file: "oboe.png" },
      { title: "Bassoon", price: 180000, file: "bassoon.png" },
      { title: "Saxophone", price: 48000, file: "saxophone.png" },
      { title: "Trumpet", price: 22000, file: "trumpet.png" },
      { title: "Trombone", price: 35000, file: "trombone.png" },
      { title: "French Horn", price: 85000, file: "french_horn.png" },
      { title: "Tuba", price: 160000, file: "tuba.png" },
      { title: "Harmonica", price: 1800, file: "harmonica.png" },
      { title: "Bagpipes", price: 42000, file: "bagpipes.png" },
      { title: "Pan Flute", price: 2500, file: "pan_flute.png" },
      { title: "Sarod", price: 32000, file: "sarod.png" },
      { title: "Santoor", price: 28000, file: "santoor.png" },
      { title: "Esraj", price: 18000, file: "esraj.png" },
      { title: "Sarangi", price: 22000, file: "sarangi.png" },
      { title: "Veena", price: 45000, file: "veena.png" },
      { title: "Shehnai", price: 8500, file: "shehnai.png" },
      { title: "Bansuri", price: 1500, file: "bansuri.png" },
      { title: "Tanpura", price: 22000, file: "tanpura.png" },
      { title: "Rabab", price: 28000, file: "rabab.png" },
      { title: "DJ Controller", price: 38000, file: "dj_controller.png" },
      { title: "Drum Machine", price: 55000, file: "drum_machine.png" },
      { title: "Sampler", price: 48000, file: "sampler.png" },
      { title: "Groovebox", price: 68000, file: "groovebox.png" },
      { title: "MIDI Controller", price: 18000, file: "midi_controller.png" },
      { title: "Launchpad", price: 16500, file: "launchpad.png" },
      { title: "Guitar Strings", price: 650, file: "guitar_strings.png" },
      { title: "Guitar Picks", price: 250, file: "guitar_picks.png" },
      { title: "Guitar Strap", price: 850, file: "guitar_strap.png" },
      { title: "Guitar Capo", price: 950, file: "guitar_capo.png" },
      { title: "Guitar Stand", price: 2200, file: "guitar_stand.png" },
      { title: "Guitar Gig Bag", price: 2500, file: "guitar_gig_bag.png" },
      { title: "Guitar Hard Case", price: 8500, file: "guitar_hard_case.png" },
      { title: "Violin Bow", price: 4500, file: "violin_bow.png" },
      { title: "Drum Sticks", price: 1200, file: "drum_sticks.png" },
      { title: "Drum Throne", price: 8500, file: "drum_throne.png" },
      { title: "Drum Pedal", price: 9500, file: "drum_pedal.png" },
      { title: "Keyboard Stand", price: 4500, file: "keyboard_stand.png" },
      { title: "Piano Bench", price: 8500, file: "piano_bench.png" },
      { title: "Music Stand", price: 2000, file: "music_stand.png" },
      { title: "Sheet Music Folder", price: 650, file: "sheet_music_folder.png" },
      { title: "Metronome", price: 1800, file: "metronome.png" },
      { title: "Tuner", price: 1200, file: "tuner.png" },
      { title: "Instrument Cable", price: 1000, file: "instrument_cable.png" },
      { title: "Sustain Pedal", price: 2500, file: "sustain_pedal.png" },
      { title: "Instrument Amplifier", price: 18000, file: "instrument_amplifier.png" },
      { title: "Guitar Amplifier", price: 15000, file: "guitar_amplifier.png" },
      { title: "Bass Amplifier", price: 22000, file: "bass_amplifier.png" },
      { title: "Keyboard Amplifier", price: 18500, file: "keyboard_amplifier.png" },
      { title: "Studio Monitor", price: 28000, file: "studio_monitor.png" },
      { title: "Audio Mixer", price: 22000, file: "audio_mixer.png" },
      { title: "Audio Interface", price: 16500, file: "audio_interface.png" },
      { title: "Microphone", price: 4500, file: "microphone.png" },
      { title: "Microphone Stand", price: 2200, file: "microphone_stand.png" },
      { title: "Pop Filter", price: 850, file: "pop_filter.png" },
      { title: "Headphones", price: 3500, file: "headphones.png" },
      { title: "USB Microphone", price: 6500, file: "usb_microphone.png" },
      { title: "Studio Condenser Microphone", price: 9500, file: "studio_condenser_microphone.png" },
      { title: "Dynamic Microphone", price: 3800, file: "dynamic_microphone.png" },
      { title: "Field Recorder", price: 28000, file: "field_recorder.png" },
      { title: "MIDI Interface", price: 8500, file: "midi_interface.png" },
      { title: "Beginner Guitar Kit", price: 12500, file: "beginner_guitar_kit.png" },
      { title: "Beginner Violin Kit", price: 10500, file: "beginner_violin_kit.png" },
      { title: "Beginner Drum Kit", price: 28000, file: "beginner_drum_kit.png" },
      { title: "Beginner Keyboard Kit", price: 22000, file: "beginner_keyboard_kit.png" },
      { title: "Ukulele Starter Kit", price: 6500, file: "ukulele_starter_kit.png" }
    ]
  },
  {
    categoryId: "-Oyxb9KLNTILlB5DCJ05",
    folder: "Printing Supplies",
    products: [
      { title: "Ink Cartridge", price: 1250, file: "ink_cartridge.png" },
      { title: "Black Ink Cartridge", price: 950, file: "black_ink_cartridge.png" },
      { title: "Color Ink Cartridge", price: 1650, file: "color_ink_cartridge.png" },
      { title: "Ink Bottle", price: 650, file: "ink_bottle.png" },
      { title: "Refill Ink", price: 450, file: "refill_ink.png" },
      { title: "Toner Cartridge", price: 3800, file: "toner_cartridge.png" },
      { title: "Black Toner Cartridge", price: 3200, file: "black_toner_cartridge.png" },
      { title: "Color Toner Cartridge", price: 5500, file: "color_toner_cartridge.png" },
      { title: "Drum Unit", price: 4800, file: "drum_unit.png" },
      { title: "Imaging Drum", price: 5500, file: "imaging_drum.png" },
      { title: "Developer Unit", price: 4200, file: "developer_unit.png" },
      { title: "Waste Toner Bottle", price: 1200, file: "waste_toner_bottle.png" },
      { title: "Maintenance Box", price: 2500, file: "maintenance_box.png" },
      { title: "Printhead", price: 4500, file: "printhead.png" },
      { title: "Printer Paper", price: 650, file: "printer_paper.png" },
      { title: "A4 Copy Paper", price: 620, file: "a4_copy_paper.png" },
      { title: "A3 Copy Paper", price: 1250, file: "a3_copy_paper.png" },
      { title: "A5 Paper", price: 380, file: "a5_paper.png" },
      { title: "Letter Paper", price: 650, file: "letter_paper.png" },
      { title: "Legal Paper", price: 720, file: "legal_paper.png" },
      { title: "Photo Paper", price: 850, file: "photo_paper.png" },
      { title: "Glossy Photo Paper", price: 1050, file: "glossy_photo_paper.png" },
      { title: "Matte Photo Paper", price: 950, file: "matte_photo_paper.png" },
      { title: "Sticker Paper", price: 750, file: "sticker_paper.png" },
      { title: "Label Paper", price: 850, file: "label_paper.png" },
      { title: "Cardstock Paper", price: 1200, file: "cardstock_paper.png" },
      { title: "Brochure Paper", price: 1100, file: "brochure_paper.png" },
      { title: "Presentation Paper", price: 1000, file: "presentation_paper.png" },
      { title: "Continuous Paper", price: 950, file: "continuous_paper.png" },
      { title: "Thermal Paper Roll", price: 180, file: "thermal_paper_roll.png" },
      { title: "Receipt Paper Roll", price: 150, file: "receipt_paper_roll.png" },
      { title: "Plotter Paper Roll", price: 3500, file: "plotter_paper_roll.png" },
      { title: "Sublimation Paper", price: 1100, file: "sublimation_paper.png" },
      { title: "Transfer Paper", price: 950, file: "transfer_paper.png" },
      { title: "Vinyl Sticker Paper", price: 1350, file: "vinyl_sticker_paper.png" },
      { title: "Address Labels", price: 450, file: "address_labels.png" },
      { title: "Shipping Labels", price: 650, file: "shipping_labels.png" },
      { title: "Barcode Labels", price: 550, file: "barcode_labels.png" },
      { title: "QR Code Labels", price: 550, file: "qr_code_labels.png" },
      { title: "Round Labels", price: 480, file: "round_labels.png" },
      { title: "Name Labels", price: 450, file: "name_labels.png" },
      { title: "Product Labels", price: 550, file: "product_labels.png" },
      { title: "Price Labels", price: 350, file: "price_labels.png" },
      { title: "Label Rolls", price: 650, file: "label_rolls.png" },
      { title: "Fuser Unit", price: 6500, file: "fuser_unit.png" },
      { title: "Transfer Belt", price: 5500, file: "transfer_belt.png" },
      { title: "Pickup Roller", price: 850, file: "pickup_roller.png" },
      { title: "Feed Roller", price: 950, file: "feed_roller.png" },
      { title: "Separation Pad", price: 450, file: "separation_pad.png" },
      { title: "Paper Tray", price: 2800, file: "paper_tray.png" },
      { title: "Duplex Unit", price: 4500, file: "duplex_unit.png" },
      { title: "Formatter Board", price: 6800, file: "formatter_board.png" },
      { title: "Power Supply Board", price: 3800, file: "power_supply_board.png" },
      { title: "Printer Cable", price: 450, file: "printer_cable.png" },
      { title: "USB Printer Cable", price: 350, file: "usb_printer_cable.png" },
      { title: "Parallel Printer Cable", price: 650, file: "parallel_printer_cable.png" },
      { title: "Ethernet Printer Cable", price: 550, file: "ethernet_printer_cable.png" },
      { title: "PLA Filament", price: 2200, file: "pla_filament.png" },
      { title: "ABS Filament", price: 2400, file: "abs_filament.png" },
      { title: "PETG Filament", price: 2600, file: "petg_filament.png" },
      { title: "TPU Filament", price: 3200, file: "tpu_filament.png" },
      { title: "Nylon Filament", price: 3800, file: "nylon_filament.png" },
      { title: "Resin", price: 2800, file: "resin.png" },
      { title: "Build Plate", price: 3500, file: "build_plate.png" },
      { title: "Nozzle", price: 450, file: "nozzle.png" },
      { title: "Extruder Kit", price: 3800, file: "extruder_kit.png" },
      { title: "Hotend Kit", price: 3200, file: "hotend_kit.png" },
      { title: "Sublimation Ink", price: 1800, file: "sublimation_ink.png" },
      { title: "Sublimation Paper A4", price: 1100, file: "sublimation_paper_a4.png" },
      { title: "Sublimation Blanks", price: 850, file: "sublimation_blanks.png" },
      { title: "Heat Transfer Vinyl", price: 950, file: "heat_transfer_vinyl.png" },
      { title: "Printable Vinyl", price: 1250, file: "printable_vinyl.png" },
      { title: "Heat Transfer Tape", price: 350, file: "heat_transfer_tape.png" },
      { title: "Teflon Sheet", price: 450, file: "teflon_sheet.png" },
      { title: "Laminating Pouch", price: 650, file: "laminating_pouch.png" },
      { title: "Laminating Film", price: 1200, file: "laminating_film.png" },
      { title: "Binding Cover", price: 350, file: "binding_cover.png" },
      { title: "Binding Comb", price: 250, file: "binding_comb.png" },
      { title: "Spiral Binding Coil", price: 450, file: "spiral_binding_coil.png" },
      { title: "Printer Stand", price: 3500, file: "printer_stand.png" },
      { title: "Printer Cover", price: 650, file: "printer_cover.png" },
      { title: "Printer Cleaning Kit", price: 850, file: "printer_cleaning_kit.png" },
      { title: "Cleaning Sheet", price: 450, file: "cleaning_sheet.png" },
      { title: "Printhead Cleaner", price: 550, file: "printhead_cleaner.png" },
      { title: "Ink Syringe Kit", price: 350, file: "ink_syringe_kit.png" },
      { title: "Cartridge Refill Kit", price: 850, file: "cartridge_refill_kit.png" },
      { title: "Ink Absorber Pad", price: 450, file: "ink_absorber_pad.png" },
      { title: "Chip Resetter", price: 1500, file: "chip_resetter.png" },
      { title: "Shipping Label Roll", price: 550, file: "shipping_label_roll.png" },
      { title: "Thermal Shipping Labels", price: 850, file: "thermal_shipping_labels.png" },
      { title: "Packing Slip Paper", price: 450, file: "packing_slip_paper.png" },
      { title: "Barcode Ribbon", price: 950, file: "barcode_ribbon.png" },
      { title: "Wax Ribbon", price: 850, file: "wax_ribbon.png" },
      { title: "Resin Ribbon", price: 1450, file: "resin_ribbon.png" },
      { title: "Wax Resin Ribbon", price: 1250, file: "wax_resin_ribbon.png" },
      { title: "Offset Printing Plate", price: 2800, file: "offset_printing_plate.png" },
      { title: "Printing Blanket", price: 4500, file: "printing_blanket.png" },
      { title: "Printing Ink", price: 950, file: "printing_ink.png" },
      { title: "UV Ink", price: 2500, file: "uv_ink.png" },
      { title: "Solvent Ink", price: 2200, file: "solvent_ink.png" },
      { title: "Eco Solvent Ink", price: 2400, file: "eco_solvent_ink.png" },
      { title: "Pigment Ink", price: 850, file: "pigment_ink.png" },
      { title: "Dye Ink", price: 750, file: "dye_ink.png" },
      { title: "Screen Printing Ink", price: 1200, file: "screen_printing_ink.png" },
      { title: "Screen Printing Mesh", price: 950, file: "screen_printing_mesh.png" },
      { title: "Screen Printing Frame", price: 1800, file: "screen_printing_frame.png" },
      { title: "Squeegee", price: 450, file: "squeegee.png" },
      { title: "Paper Cutter", price: 1800, file: "paper_cutter.png" },
      { title: "Guillotine Cutter", price: 8500, file: "guillotine_cutter.png" },
      { title: "Rotary Paper Trimmer", price: 3200, file: "rotary_paper_trimmer.png" },
      { title: "Corner Rounder", price: 1250, file: "corner_rounder.png" },
      { title: "Hole Punch", price: 650, file: "hole_punch.png" },
      { title: "Stapler", price: 450, file: "stapler.png" },
      { title: "Staple Pins", price: 120, file: "staple_pins.png" },
      { title: "Paper Folder", price: 850, file: "paper_folder.png" },
      { title: "Bone Folder", price: 250, file: "bone_folder.png" },
      { title: "Measuring Scale", price: 180, file: "measuring_scale.png" },
      { title: "Printer Cleaning Solution", price: 650, file: "printer_cleaning_solution.png" },
      { title: "Roller Cleaning Kit", price: 850, file: "roller_cleaning_kit.png" },
      { title: "Lint Free Cloth", price: 180, file: "lint_free_cloth.png" },
      { title: "Compressed Air Duster", price: 750, file: "compressed_air_duster.png" },
      { title: "Printer Lubricant", price: 550, file: "printer_lubricant.png" }
    ]
  }
];

function toSlug(str) {
  return str.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
}

async function loginAdmin() {
  const res = await fetch(
    `https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${API_KEY}`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: ADMIN_EMAIL, password: ADMIN_PASSWORD, returnSecureToken: true })
    }
  );
  const data = await res.json();
  if (!data.idToken) throw new Error("Login failed: " + JSON.stringify(data));
  return data.idToken;
}

async function uploadToCloudinary(filePath) {
  const fileBuffer = fs.readFileSync(filePath);
  const form = new FormData();
  form.append("file", new Blob([fileBuffer]), path.basename(filePath));
  form.append("upload_preset", UPLOAD_PRESET);

  const res = await fetch(`https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`, {
    method: "POST",
    body: form
  });
  const data = await res.json();
  if (!data.secure_url) throw new Error("Cloudinary upload failed: " + JSON.stringify(data));
  return data.secure_url;
}

async function fetchExistingProducts(idToken, categoryId) {
  const res = await fetch(
    `${DB_URL}/products.json?orderBy="categoryId"&equalTo="${categoryId}"&auth=${idToken}`
  );
  const data = await res.json();
  return data || {};
}

const SELLER_ID = "SqVK0FFNFietVqov8la6hwSAF023";

async function addProduct(idToken, categoryId, title, price, imageUrl) {
  const body = {
    title,
    price,
    categoryId,
    sellerId: SELLER_ID,
    stock: 20,
    status: "active",
    images: { main: imageUrl },
    createdAt: Date.now()
  };
  const res = await fetch(`${DB_URL}/products.json?auth=${idToken}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body)
  });
  const data = await res.json();
  if (!data.name) {
    throw new Error("Firebase write failed: " + JSON.stringify(data));
  }
  return data;
}

async function deleteProduct(idToken, productId) {
  await fetch(`${DB_URL}/products/${productId}.json?auth=${idToken}`, { method: "DELETE" });
}

async function main() {
  console.log("লগইন হচ্ছে...");
  const idToken = await loginAdmin();
  console.log("লগইন সফল ✅\n");

  let totalAdded = 0, totalSkipped = 0, totalFailed = 0, totalDeleted = 0;

  for (const group of categoryGroups) {
    console.log(`\n===== ${group.folder} (${group.products.length}টি প্রোডাক্ট) =====`);

    const existing = await fetchExistingProducts(idToken, group.categoryId);
    const existingTitles = new Set(Object.values(existing).map(p => p.title));
    const wantedTitles = new Set(group.products.map(p => p.title));

    let added = 0, skipped = 0, failed = 0, deleted = 0;

    // Delete products that are no longer in the list
    for (const [id, prod] of Object.entries(existing)) {
      if (!wantedTitles.has(prod.title)) {
        await deleteProduct(idToken, id);
        deleted++;
      }
    }

    // Add new products, skip existing
    for (const item of group.products) {
      if (existingTitles.has(item.title)) {
        skipped++;
        continue;
      }
      const imagePath = path.join(BASE_IMAGE_DIR, group.folder, item.file);
      if (!fs.existsSync(imagePath)) {
        console.log(`⚠️ ছবি পাওয়া যায়নি: ${imagePath}`);
        failed++;
        continue;
      }
      try {
        const imageUrl = await uploadToCloudinary(imagePath);
        await addProduct(idToken, group.categoryId, item.title, item.price, imageUrl);
        added++;
        process.stdout.write(`✅ ${item.title}\n`);
      } catch (err) {
        console.log(`❌ ব্যর্থ: ${item.title} — ${err.message}`);
        failed++;
      }
    }

    console.log(`\n${group.folder} সারাংশ: যোগ ${added}, স্কিপ ${skipped}, ব্যর্থ ${failed}, ডিলিট ${deleted}`);
    totalAdded += added; totalSkipped += skipped; totalFailed += failed; totalDeleted += deleted;
  }

  console.log(`\n\n===== সম্পূর্ণ সারাংশ =====`);
  console.log(`মোট যোগ হয়েছে: ${totalAdded}`);
  console.log(`মোট স্কিপ (আগে থেকেই আছে): ${totalSkipped}`);
  console.log(`মোট ব্যর্থ: ${totalFailed}`);
  console.log(`মোট ডিলিট হয়েছে: ${totalDeleted}`);
}

main().catch(err => {
  console.error("স্ক্রিপ্ট ব্যর্থ হয়েছে:", err);
  process.exit(1);
});
