import json

price_desc = {
    "smart_home_surveillance": (100, "Smart Home & Surveillance — a general range of smart home automation and security devices."),
    "smart_home_wifi_security_camera": (2500, "Smart Home WiFi Security Camera — a wireless camera that streams live video to a mobile app."),
    "smart_home_hub": (2200, "Smart Home Hub — a central device that connects and controls compatible smart home devices."),
    "smart_gateway": (2000, "Smart Gateway — a bridge device that links smart sensors and devices to the internet."),
    "zigbee_hub": (2200, "Zigbee Hub — a controller that connects and manages Zigbee-protocol smart devices."),
    "z_wave_hub": (2200, "Z-Wave Hub — a controller that connects and manages Z-Wave-protocol smart devices."),
    "matter_hub": (2500, "Matter Hub — a smart home controller supporting the Matter interoperability standard."),
    "home_automation_controller": (3500, "Home Automation Controller — a central unit used to automate and schedule smart home devices."),
    "smart_speaker": (3500, "Smart Speaker — a voice-controlled speaker used to play audio and control smart devices."),
    "smart_display": (5500, "Smart Display — a touchscreen device with a voice assistant for smart home control and media."),
    "voice_assistant_speaker": (3500, "Voice Assistant Speaker — a speaker with a built-in voice assistant for hands-free control."),
    "ai_smart_speaker": (4500, "AI Smart Speaker — a speaker powered by AI for voice commands and smart home control."),
    "smart_led_bulb": (450, "Smart LED Bulb — a WiFi-connected bulb with adjustable brightness and color, controlled via app."),
    "smart_ceiling_light": (2500, "Smart Ceiling Light — a connected ceiling fixture with app or voice-controlled lighting."),
    "smart_wall_light": (1500, "Smart Wall Light — a connected wall-mounted light fixture with remote control."),
    "smart_light_strip": (1200, "Smart Light Strip — a flexible LED strip with app-controlled colors and effects."),
    "smart_lamp": (1800, "Smart Lamp — a connected lamp with adjustable brightness and color via app."),
    "smart_switch": (600, "Smart Switch — a WiFi-connected wall switch that lets you control lights remotely."),
    "smart_dimmer": (700, "Smart Dimmer — a connected switch that lets you adjust light brightness remotely."),
    "smart_plug": (500, "Smart Plug — a WiFi-connected outlet adapter that lets you control appliances remotely."),
    "smart_power_strip": (900, "Smart Power Strip — a multi-outlet power strip with individually controllable smart sockets."),
    "smart_relay": (600, "Smart Relay — a connected module used to remotely switch electrical circuits."),
    "indoor_wifi_camera": (2200, "Indoor WiFi Camera — a wireless camera designed for monitoring interior spaces."),
    "outdoor_wifi_camera": (3500, "Outdoor WiFi Camera — a weatherproof wireless camera designed for exterior monitoring."),
    "ip_camera": (2500, "IP Camera — a network camera that transmits video over an internet connection."),
    "ptz_camera": (6500, "PTZ Camera — a camera with pan-tilt-zoom capability for wide-area surveillance."),
    "dome_camera": (2500, "Dome Camera — a dome-shaped surveillance camera designed for discreet indoor or outdoor use."),
    "bullet_camera": (2200, "Bullet Camera — a cylindrical surveillance camera designed for long-range outdoor monitoring."),
    "doorbell_camera": (3500, "Doorbell Camera — a video doorbell that lets you see and speak to visitors remotely."),
    "floodlight_camera": (4500, "Floodlight Camera — a security camera combined with bright floodlights for outdoor areas."),
    "baby_monitor_camera": (2500, "Baby Monitor Camera — a camera designed for remotely watching a sleeping baby."),
    "pet_camera": (2800, "Pet Camera — a camera designed for remotely monitoring and interacting with pets."),
    "360_security_camera": (3500, "360° Security Camera — a camera offering a full panoramic view for wide-area monitoring."),
    "cctv_camera_kit": (8500, "CCTV Camera Kit — a bundled set of surveillance cameras with a recording unit."),
    "dvr": (5500, "DVR — a Digital Video Recorder used to record and store footage from analog CCTV cameras."),
    "nvr": (6500, "NVR — a Network Video Recorder used to record and store footage from IP cameras."),
    "poe_nvr_kit": (12000, "PoE NVR Kit — a complete kit combining a network recorder with Power-over-Ethernet cameras."),
    "surveillance_hard_drive": (3500, "Surveillance Hard Drive — a hard drive built for continuous CCTV/NVR recording."),
    "cctv_monitor": (5500, "CCTV Monitor — a dedicated display screen for viewing surveillance camera footage."),
    "fingerprint_door_lock": (5500, "Fingerprint Door Lock — a smart lock that unlocks using fingerprint recognition."),
    "smart_door_lock": (6500, "Smart Door Lock — a connected lock that can be controlled remotely via app."),
    "rfid_door_lock": (4500, "RFID Door Lock — a smart lock that unlocks using an RFID card or tag."),
    "keypad_door_lock": (4000, "Keypad Door Lock — a lock that unlocks using a numeric code entered on a keypad."),
    "bluetooth_door_lock": (5000, "Bluetooth Door Lock — a smart lock that unlocks via a paired Bluetooth device."),
    "wifi_smart_lock": (6500, "WiFi Smart Lock — a connected door lock controllable remotely over WiFi."),
    "smart_padlock": (2500, "Smart Padlock — a connected padlock that can be unlocked via app or code."),
    "video_doorbell": (3500, "Video Doorbell — a smart doorbell with a built-in camera and two-way audio."),
    "wifi_doorbell": (3200, "WiFi Doorbell — a wireless video doorbell connected via home WiFi."),
    "wireless_doorbell": (1200, "Wireless Doorbell — a battery-powered doorbell with a wireless chime unit."),
    "smart_chime": (1000, "Smart Chime — a connected chime unit that pairs with a smart doorbell."),
    "motion_sensor": (700, "Motion Sensor — a device that detects movement and triggers alerts or automations."),
    "door_sensor": (500, "Door Sensor — a sensor that detects when a door is opened or closed."),
    "window_sensor": (500, "Window Sensor — a sensor that detects when a window is opened or closed."),
    "glass_break_sensor": (900, "Glass Break Sensor — a sensor that detects the sound of breaking glass."),
    "vibration_sensor": (700, "Vibration Sensor — a sensor that detects unusual vibration or tampering."),
    "water_leak_sensor": (700, "Water Leak Sensor — a sensor that detects water leaks and triggers an alert."),
    "smoke_detector": (900, "Smoke Detector — a device that detects smoke and sounds an alarm."),
    "heat_detector": (900, "Heat Detector — a device that detects abnormal heat and triggers an alarm."),
    "carbon_monoxide_detector": (1500, "Carbon Monoxide Detector — a device that detects dangerous CO gas levels."),
    "air_quality_sensor": (2500, "Air Quality Sensor — a device that monitors indoor air quality in real time."),
    "temperature_sensor": (600, "Temperature Sensor — a connected sensor that monitors ambient temperature."),
    "humidity_sensor": (600, "Humidity Sensor — a connected sensor that monitors ambient humidity levels."),
    "smart_alarm_system": (8500, "Smart Alarm System — a connected home security alarm system with app control."),
    "burglar_alarm": (5500, "Burglar Alarm — a security alarm system designed to deter and detect intrusions."),
    "siren": (900, "Siren — a loud alarm device used to alert occupants of a security event."),
    "panic_button": (700, "Panic Button — a button that triggers an emergency alert when pressed."),
    "alarm_keypad": (1500, "Alarm Keypad — a keypad used to arm and disarm a security alarm system."),
    "gsm_alarm_system": (6500, "GSM Alarm System — a security alarm system that sends alerts via mobile network."),
    "biometric_fingerprint_reader": (4500, "Biometric Fingerprint Reader — a device used for fingerprint-based access control."),
    "face_recognition_terminal": (9500, "Face Recognition Terminal — an access control device using facial recognition."),
    "rfid_card_reader": (2500, "RFID Card Reader — a reader device used for RFID card-based access control."),
    "nfc_access_reader": (2500, "NFC Access Reader — a reader device used for NFC tag-based access control."),
    "electric_door_strike": (2200, "Electric Door Strike — an electronic mechanism that releases a door lock remotely."),
    "magnetic_door_lock": (3500, "Magnetic Door Lock — an electromagnetic lock used in access control systems."),
    "exit_button": (400, "Exit Button — a button used to release an electric door lock from inside."),
    "access_control_panel": (6500, "Access Control Panel — a central unit that manages entry permissions for access systems."),
    "smart_energy_meter": (3500, "Smart Energy Meter — a device that monitors and reports household energy usage."),
    "smart_thermostat": (5500, "Smart Thermostat — a connected thermostat that lets you control temperature remotely."),
    "smart_power_meter": (2500, "Smart Power Meter — a device that tracks electrical power consumption in real time."),
    "smart_water_meter": (2800, "Smart Water Meter — a connected meter that tracks water usage."),
    "smart_gas_meter": (3200, "Smart Gas Meter — a connected meter that tracks gas usage."),
    "smart_fan": (3500, "Smart Fan — a WiFi-connected fan controllable via app or voice."),
    "smart_air_conditioner_controller": (1800, "Smart Air Conditioner Controller — a device that adds remote control to a standard AC unit."),
    "smart_curtain_controller": (3500, "Smart Curtain Controller — a motorized module used to automate curtain opening and closing."),
    "smart_blinds_motor": (4500, "Smart Blinds Motor — a motor unit used to automate window blinds."),
    "smart_garage_door_opener": (4500, "Smart Garage Door Opener — a connected device that lets you control a garage door remotely."),
    "smart_irrigation_controller": (3500, "Smart Irrigation Controller — a connected controller used to automate garden watering schedules."),
    "wifi_router": (2800, "WiFi Router — a networking device that provides wireless internet connectivity."),
    "mesh_wifi_system": (6500, "Mesh WiFi System — a multi-node system that provides seamless whole-home WiFi coverage."),
    "poe_switch": (3500, "PoE Switch — a network switch that supplies power and data over Ethernet cables."),
    "network_switch": (1800, "Network Switch — a device that connects multiple wired devices on a local network."),
    "range_extender": (1500, "Range Extender — a device that extends the reach of a WiFi network."),
    "access_point": (2500, "Access Point — a networking device that provides wireless access to a wired network."),
    "nas_storage": (9500, "NAS Storage — a network-attached storage device used for centralized data and footage storage."),
    "microsd_card": (600, "MicroSD Card — a small memory card used for storing camera or device footage."),
    "external_ssd": (3500, "External SSD — a portable solid-state drive used for fast external storage."),
    "usb_flash_drive": (500, "USB Flash Drive — a portable drive used for storing and transferring files."),
    "smart_scene_controller": (1500, "Smart Scene Controller — a device used to trigger preset smart home scenes with one press."),
    "automation_remote": (1200, "Automation Remote — a remote control used to trigger smart home automations."),
    "smart_button": (600, "Smart Button — a small connected button used to trigger a smart home action."),
    "smart_timer_switch": (700, "Smart Timer Switch — a connected switch that turns devices on or off on a schedule."),
    "smart_ir_remote": (1500, "Smart IR Remote — a WiFi device that controls infrared appliances remotely."),
    "emergency_light": (1200, "Emergency Light — a backup light that activates automatically during a power outage."),
    "smart_smoke_alarm": (2500, "Smart Smoke Alarm — a connected smoke alarm that sends mobile alerts."),
    "gas_leak_detector": (2200, "Gas Leak Detector — a device that detects hazardous gas leaks and sounds an alarm."),
    "water_leak_alarm": (900, "Water Leak Alarm — a device that sounds an alert when a water leak is detected."),
    "emergency_siren": (1500, "Emergency Siren — a loud siren device used for emergency alerts."),
    "wall_mount_bracket": (350, "Wall Mount Bracket — a mounting bracket used to install a camera or device on a wall."),
    "camera_mount": (300, "Camera Mount — a mounting accessory used to position a security camera."),
    "junction_box": (250, "Junction Box — an enclosure used to protect and organize camera wiring connections."),
    "cable_clips": (100, "Cable Clips — small clips used to organize and secure cabling."),
    "power_adapter": (400, "Power Adapter — an adapter used to supply power to a camera or smart device."),
    "ups_for_cctv": (4500, "UPS for CCTV — an uninterruptible power supply that keeps a CCTV system running during outages."),
    "backup_battery": (1500, "Backup Battery — a rechargeable battery used to power devices during outages."),
    "smart_remote_control": (1500, "Smart Remote Control — a universal remote used to control multiple smart devices."),
    "universal_ir_blaster": (1200, "Universal IR Blaster — a device that lets a smart hub control infrared appliances."),
    "bluetooth_tracker": (900, "Bluetooth Tracker — a small tag used to locate lost items via a mobile app."),
    "gps_tracker": (2500, "GPS Tracker — a device used to track the real-time location of people or belongings."),
    "nfc_tags": (300, "NFC Tags — programmable tags used to trigger phone actions on tap."),
    "smart_sprinkler_controller": (4500, "Smart Sprinkler Controller — a connected controller used to automate lawn sprinkler schedules."),
    "soil_moisture_sensor": (700, "Soil Moisture Sensor — a sensor that measures soil moisture for garden automation."),
    "smart_outdoor_plug": (900, "Smart Outdoor Plug — a weatherproof smart plug designed for outdoor use."),
    "solar_security_light": (1800, "Solar Security Light — a solar-powered light that activates for outdoor security."),
    "network_cable_tester": (900, "Network Cable Tester — a tool used to test and verify Ethernet cable connections."),
    "rj45_crimping_tool": (700, "RJ45 Crimping Tool — a tool used to attach RJ45 connectors to network cables."),
    "ethernet_cable": (350, "Ethernet Cable — a cable used to connect networked devices for wired internet."),
    "poe_injector": (1200, "PoE Injector — a device that adds Power-over-Ethernet capability to a network connection."),
    "cable_organizer": (250, "Cable Organizer — an accessory used to manage and tidy loose cables."),
    "webcam_cover": (150, "Webcam Cover — a sliding cover used to block a camera lens for privacy."),
    "privacy_screen_filter": (900, "Privacy Screen Filter — a filter applied to a screen to limit side-angle viewing."),
    "rfid_blocking_card": (350, "RFID Blocking Card — a card that shields RFID chips from unauthorized scanning."),
    "security_cable_lock": (700, "Security Cable Lock — a cable lock used to secure equipment against theft."),
}

paths = {
    "data/products-placeholder.json": None,
    "data/products-placeholder-batch3.json": None,
}

total_updated = 0
total_skipped = []

for path in paths:
    with open(path, "r", encoding="utf-8") as f:
        data = json.load(f)

    updated = 0
    skipped = []
    for sku, prod in data.items():
        if prod.get("categoryId") == "smart_home_surveillance":
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

    print(f"--- {path}: Updated {updated}, Skipped {skipped} ---")
    total_updated += updated
    total_skipped.extend(skipped)

print(f"TOTAL Updated: {total_updated}")
print(f"TOTAL Skipped: {total_skipped}")
