import json, re

price_desc = {
    "internal_hdd": (4500, "Internal HDD — a traditional hard disk drive offering high-capacity storage for desktops."),
    "external_hdd": (5500, "External HDD — a portable hard drive for backup and extra storage on the go."),
    "external_ssd": (7500, "External SSD — a fast, portable solid-state drive for quick file transfers and backups."),
    "hybrid_drive_sshd": (5000, "Hybrid Drive (SSHD) — a drive combining HDD capacity with SSD-like caching for faster access."),
    "power_supply": (4000, "Power Supply — a reliable PSU providing stable power for desktop components."),
    "atx_power_supply": (5000, "ATX Power Supply — a standard-size PSU compatible with most desktop cases."),
    "modular_psu": (7000, "Modular PSU — a power supply with detachable cables for cleaner builds and better airflow."),
    "sfx_power_supply": (6000, "SFX Power Supply — a compact PSU designed for small-form-factor PC builds."),
    "cooling": (2000, "Cooling — a general range of cooling solutions for desktops and components."),
    "cpu_air_cooler": (2500, "CPU Air Cooler — an air-based cooling solution to keep processor temperatures in check."),
    "liquid_cpu_cooler": (7500, "Liquid CPU Cooler — an all-in-one liquid cooling system for efficient heat dissipation."),
    "case_fans": (700, "Case Fans — fans for improving airflow and cooling inside a PC case."),
    "thermal_paste": (400, "Thermal Paste — a compound applied between CPU/GPU and cooler for better heat transfer."),
    "fan_controller": (1800, "Fan Controller — a device to manage and adjust case fan speeds."),
    "computer_cases": (5000, "Computer Cases — a general range of PC cases in various sizes and styles."),
    "full_tower_case": (9000, "Full Tower Case — a large case offering maximum space for components and cooling."),
    "mid_tower_case": (5500, "Mid Tower Case — a versatile, standard-size case fitting most builds."),
    "mini_tower_case": (4000, "Mini Tower Case — a compact case suitable for smaller builds."),
    "mini_itx_case": (5500, "Mini ITX Case — a small-form-factor case designed for compact PC builds."),
    "open_frame_case": (6000, "Open Frame Case — an open-air chassis often used for benchmarking or custom builds."),
    "monitors": (12000, "Monitors — a general range of computer monitors for home and office use."),
    "led_monitor": (10000, "LED Monitor — an energy-efficient monitor offering clear, everyday display quality."),
    "ips_monitor": (13000, "IPS Monitor — a monitor with wide viewing angles and accurate color reproduction."),
    "va_monitor": (11000, "VA Monitor — a monitor offering strong contrast ratios and deep blacks."),
    "oled_monitor": (45000, "OLED Monitor — a premium monitor with per-pixel lighting for exceptional contrast and color."),
    "gaming_monitor": (20000, "Gaming Monitor — a high refresh-rate monitor built for smooth, responsive gameplay."),
    "curved_monitor": (18000, "Curved Monitor — a monitor with a curved display for a more immersive viewing experience."),
    "4k_monitor": (30000, "4K Monitor — an ultra-high-resolution monitor for sharp detail and productivity."),
    "ultrawide_monitor": (35000, "Ultrawide Monitor — a wide-aspect monitor ideal for multitasking and immersive gaming."),
    "portable_monitor": (12000, "Portable Monitor — a lightweight, slim monitor for use on the go with laptops."),
    "touchscreen_monitor": (22000, "Touchscreen Monitor — a monitor supporting direct touch interaction."),
    "monitor_arm": (3500, "Monitor Arm — an adjustable mount for positioning a monitor ergonomically."),
    "monitor_stand": (2000, "Monitor Stand — a stand for elevating and organizing a monitor on the desk."),
    "input_devices": (1500, "Input Devices — a general range of keyboards, mice, and related accessories."),
    "wired_keyboard": (700, "Wired Keyboard — a reliable USB keyboard for everyday typing."),
    "wireless_keyboard": (1500, "Wireless Keyboard — a cable-free keyboard offering a clean desk setup."),
    "mechanical_keyboard": (4500, "Mechanical Keyboard — a keyboard with tactile mechanical switches for precise typing."),
    "gaming_keyboard": (3500, "Gaming Keyboard — a responsive keyboard with gaming-focused features and backlighting."),
    "ergonomic_keyboard": (3000, "Ergonomic Keyboard — a keyboard designed for comfortable, strain-reducing typing."),
    "wired_mouse": (500, "Wired Mouse — a reliable USB mouse for everyday computer use."),
    "wireless_mouse": (1000, "Wireless Mouse — a cable-free mouse for a clutter-free desk."),
    "gaming_mouse": (2500, "Gaming Mouse — a precision mouse with adjustable DPI for competitive gaming."),
    "vertical_mouse": (1800, "Vertical Mouse — an ergonomic mouse designed to reduce wrist strain."),
    "trackball_mouse": (2200, "Trackball Mouse — a mouse using a trackball for precise cursor control with less arm movement."),
    "numeric_keypad": (700, "Numeric Keypad — a compact keypad for fast numeric data entry."),
    "mouse_pad": (400, "Mouse Pad — a smooth surface for accurate mouse tracking."),
    "rgb_mouse_pad": (1200, "RGB Mouse Pad — a mouse pad with customizable RGB lighting for gaming setups."),
    "laptop_accessories": (1000, "Laptop Accessories — a general range of add-ons to enhance laptop use."),
    "laptop_bag": (1200, "Laptop Bag — a protective bag for safely carrying a laptop."),
    "laptop_backpack": (2000, "Laptop Backpack — a backpack with a dedicated, padded laptop compartment."),
    "laptop_sleeve": (800, "Laptop Sleeve — a slim, protective sleeve for laptops."),
    "laptop_stand": (1500, "Laptop Stand — a stand that elevates a laptop for better posture and airflow."),
    "cooling_pad": (1200, "Cooling Pad — a fan-equipped pad to help keep a laptop cool during use."),
    "docking_station": (4500, "Docking Station — a hub that expands a laptop's connectivity for multiple peripherals."),
    "usb_hub": (900, "USB Hub — a hub that adds extra USB ports to a laptop or desktop."),
    "privacy_screen_filter": (1800, "Privacy Screen Filter — a filter that limits screen visibility to protect data privacy."),
    "keyboard_cover": (400, "Keyboard Cover — a protective cover to keep a laptop keyboard clean and dust-free."),
    "webcam_cover": (200, "Webcam Cover — a sliding cover for laptop webcam privacy."),
    "laptop_lock": (900, "Laptop Lock — a cable lock for securing a laptop against theft."),
    "cables_adapters": (500, "Cables & Adapters — a general range of connectivity cables and adapters."),
    "hdmi_cable": (400, "HDMI Cable — a cable for transmitting high-definition video and audio."),
    "displayport_cable": (500, "DisplayPort Cable — a cable for high-resolution video output to monitors."),
    "vga_cable": (350, "VGA Cable — a cable for connecting older displays via analog video."),
    "dvi_cable": (400, "DVI Cable — a cable for digital video connections between devices and monitors."),
    "usb_c_cable": (400, "USB-C Cable — a cable for data transfer and charging via USB-C."),
    "usb_a_cable": (300, "USB-A Cable — a standard USB cable for connecting peripherals."),
    "thunderbolt_cable": (2000, "Thunderbolt Cable — a high-speed cable for data, video, and power delivery."),
    "ethernet_cable": (350, "Ethernet Cable — a cable for wired network connections."),
    "hdmi_adapter": (600, "HDMI Adapter — an adapter for connecting devices with different video ports to HDMI."),
    "usb_to_ethernet_adapter": (900, "USB to Ethernet Adapter — an adapter adding wired network connectivity via USB."),
    "usb_c_hub": (1800, "USB-C Hub — a multiport hub expanding a single USB-C port into multiple connections."),
    "otg_adapter": (300, "OTG Adapter — an adapter enabling USB device connections to phones and tablets."),
    "audio_video": (1000, "Audio & Video — a general range of audio and video accessories for computers."),
    "webcam": (2000, "Webcam — a camera for video calls, streaming, and conferencing."),
    "conference_camera": (8000, "Conference Camera — a wide-angle camera designed for group video meetings."),
    "usb_microphone": (2500, "USB Microphone — a plug-and-play microphone for recording and calls."),
    "headset": (1800, "Headset — a combined headphone and microphone set for calls and gaming."),
    "pc_speakers": (1500, "PC Speakers — speakers for enhanced desktop audio output."),
    "soundbar": (3500, "Soundbar — a compact speaker bar for improved computer or monitor audio."),
    "external_sound_card": (2500, "External Sound Card — a USB audio interface for improved sound input/output."),
    "printers_scanners": (8000, "Printers & Scanners — a general range of printing and scanning devices."),
    "inkjet_printer": (6000, "Inkjet Printer — a printer suited for both text and photo-quality printing."),
    "laser_printer": (12000, "Laser Printer — a fast, efficient printer ideal for high-volume text printing."),
    "all_in_one_printer": (10000, "All-in-One Printer — a printer combining print, scan, and copy functions."),
    "portable_printer": (7000, "Portable Printer — a compact, lightweight printer for printing on the go."),
    "flatbed_scanner": (5000, "Flatbed Scanner — a scanner for digitizing documents and photos."),
    "document_scanner": (9000, "Document Scanner — a fast scanner designed for high-volume document digitization."),
    "barcode_printer": (11000, "Barcode Printer — a specialized printer for producing barcode labels."),
    "networking": (2500, "Networking — a general range of devices for wired and wireless connectivity."),
    "wi_fi_router": (2500, "Wi-Fi Router — a router providing wireless internet connectivity for the home or office."),
    "mesh_wi_fi_system": (8000, "Mesh Wi-Fi System — a multi-node system providing seamless whole-home Wi-Fi coverage."),
    "modem": (2000, "Modem — a device connecting a home network to an internet service provider."),
    "network_switch": (2500, "Network Switch — a device for connecting multiple wired devices on a network."),
    "usb_wi_fi_adapter": (900, "USB Wi-Fi Adapter — a USB dongle adding wireless connectivity to a desktop."),
    "pcie_wi_fi_card": (2000, "PCIe Wi-Fi Card — an internal card adding wireless connectivity to a desktop."),
    "ethernet_adapter": (700, "Ethernet Adapter — an adapter for adding a wired network port to a device."),
    "storage_backup": (1500, "Storage & Backup — a general range of storage and backup devices."),
    "usb_flash_drive": (600, "USB Flash Drive — a portable drive for storing and transferring files."),
    "sd_card": (900, "SD Card — a removable memory card for cameras and other devices."),
    "microsd_card": (700, "MicroSD Card — a compact memory card for phones, tablets, and cameras."),
    "card_reader": (500, "Card Reader — a device for reading SD, microSD, and other memory cards."),
    "nas_network_attached_storage": (15000, "NAS (Network Attached Storage) — a networked storage device for centralized file access and backup."),
    "backup_drive": (5500, "Backup Drive — a dedicated external drive for data backup."),
    "power_charging": (1200, "Power & Charging — a general range of chargers and power accessories."),
    "laptop_charger": (1500, "Laptop Charger — a power adapter for charging a laptop."),
    "universal_laptop_charger": (2000, "Universal Laptop Charger — an adapter compatible with multiple laptop brands and models."),
    "usb_c_charger": (1500, "USB-C Charger — a fast charger for USB-C laptops and devices."),
    "power_bank_for_laptop": (4500, "Power Bank for Laptop — a high-capacity power bank capable of charging laptops."),
    "ups": (6000, "UPS — an uninterruptible power supply protecting devices during power outages."),
    "surge_protector": (1200, "Surge Protector — a device protecting electronics from voltage spikes."),
    "power_strip": (800, "Power Strip — a multi-outlet strip for powering several devices at once."),
    "office_productivity": (5000, "Office Productivity — a general range of devices for office and presentation use."),
    "projector": (25000, "Projector — a device for displaying presentations and media on a large screen."),
    "mini_projector": (8000, "Mini Projector — a compact, portable projector for casual or on-the-go use."),
    "presenter_remote": (1200, "Presenter Remote — a wireless remote for controlling slides during presentations."),
    "digital_whiteboard": (35000, "Digital Whiteboard — an interactive display for collaborative presentations and meetings."),
    "label_printer": (4000, "Label Printer — a compact printer for producing adhesive labels."),
    "calculator": (500, "Calculator — a device for performing everyday and scientific calculations."),
    "software": (2000, "Software — a general range of software products and licenses."),
    "operating_system": (8000, "Operating System — a licensed OS for desktops and laptops."),
    "office_suite": (6000, "Office Suite — a productivity software package for documents, spreadsheets, and presentations."),
    "antivirus_software": (1500, "Antivirus Software — security software protecting devices from malware and threats."),
    "backup_software": (2000, "Backup Software — software for automating data backup and recovery."),
    "pdf_editor": (2500, "PDF Editor — software for creating, editing, and managing PDF documents."),
    "vpn_software_license": (1800, "VPN Software License — a subscription for secure, private internet browsing."),
    "gaming_accessories": (3000, "Gaming Accessories — a general range of accessories for PC gaming setups."),
    "gaming_chair": (12000, "Gaming Chair — an ergonomic chair designed for long gaming sessions."),
    "gaming_desk": (10000, "Gaming Desk — a desk designed with gaming setups and cable management in mind."),
    "gaming_controller": (2500, "Gaming Controller — a gamepad for PC gaming across various genres."),
    "vr_headset": (25000, "VR Headset — a headset for immersive virtual reality gaming and experiences."),
    "racing_wheel": (8000, "Racing Wheel — a steering wheel controller for racing simulation games."),
    "joystick": (3000, "Joystick — a flight-stick style controller for simulation and flight games."),
    "cleaning_maintenance": (500, "Cleaning & Maintenance — a general range of cleaning and maintenance supplies for electronics."),
    "screen_cleaning_kit": (500, "Screen Cleaning Kit — a kit for safely cleaning laptop and monitor screens."),
    "keyboard_cleaning_brush": (300, "Keyboard Cleaning Brush — a small brush for removing dust and debris from keyboards."),
    "compressed_air_duster": (500, "Compressed Air Duster — a can of pressurized air for cleaning dust from electronics."),
    "cable_organizer": (400, "Cable Organizer — an accessory for tidying and managing cables at a desk."),
    "tool_kit_for_laptop_repair": (1500, "Tool Kit for Laptop Repair — a precision tool set for laptop disassembly and repair."),
    "replacement_parts": (2000, "Replacement Parts — a general range of components for laptop repair and upgrades."),
    "laptop_battery": (3500, "Laptop Battery — a replacement battery for extending laptop usage."),
    "laptop_screen": (6000, "Laptop Screen — a replacement display panel for a laptop."),
    "laptop_keyboard": (2000, "Laptop Keyboard — a replacement keyboard unit for a laptop."),
    "laptop_touchpad": (1500, "Laptop Touchpad — a replacement touchpad module for a laptop."),
    "laptop_hinges": (1200, "Laptop Hinges — replacement hinges for repairing a laptop's screen assembly."),
    "laptop_fan": (1000, "Laptop Fan — a replacement cooling fan for a laptop."),
    "cmos_battery": (300, "CMOS Battery — a small battery that maintains BIOS settings and system clock."),
    "display_cable": (700, "Display Cable — an internal cable connecting a laptop's screen to its motherboard."),
}

def normalize(title):
    t = title.strip().lower()
    t = re.sub(r'[^a-z0-9]+', '_', t)
    return t.strip('_')

files = ["data/products-placeholder.json", "data/products-placeholder-batch3.json"]

total_updated = 0
total_skipped = []

for path in files:
    with open(path, "r", encoding="utf-8") as f:
        data = json.load(f)

    updated = 0
    for sku, prod in data.items():
        if prod.get("categoryId") == "laptops_pcs":
            key = normalize(prod.get("title", ""))
            if key in price_desc:
                price, desc = price_desc[key]
                prod["price"] = price
                prod["description"] = desc
                prod["status"] = "active"
                updated += 1
            else:
                total_skipped.append((path, sku, prod.get("title")))

    with open(path, "w", encoding="utf-8") as f:
        json.dump(data, f, ensure_ascii=False, indent=2)

    print(f"{path}: Updated {updated}")
    total_updated += updated

print(f"\nTotal Updated: {total_updated}")
print(f"Total Skipped (no match found): {total_skipped}")
