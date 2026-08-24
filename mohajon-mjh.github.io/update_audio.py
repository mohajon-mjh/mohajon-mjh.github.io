import json

price_desc = {
    "headphones_speakers_audio": (500, "Headphones, Speakers & Audio — a general range of audio equipment and accessories."),
    "3_5mm_audio_cable": (150, "3.5mm Audio Cable — a standard stereo cable used to connect audio devices."),
    "6_35mm_audio_cable": (250, "6.35mm Audio Cable — a quarter-inch stereo cable used for professional audio equipment."),
    "accessories": (200, "Audio Accessories — a general range of add-on items for audio equipment."),
    "audio_adapters": (200, "Audio Adapters — connectors used to link different audio device ports."),
    "audio_cables": (200, "Audio Cables — cables used to transmit sound between audio devices."),
    "audio_interface": (5500, "Audio Interface — a device that connects microphones and instruments to a computer for recording."),
    "audio_interfaces_recording": (6500, "Audio Interfaces for Recording — professional-grade interfaces designed for studio recording setups."),
    "audio_knobs": (150, "Audio Knobs — replacement control knobs used on audio equipment."),
    "audio_mixer": (6500, "Audio Mixer — a device used to combine and adjust multiple audio signals."),
    "audio_splitter": (250, "Audio Splitter — a device that divides one audio signal into multiple outputs."),
    "aux_cable": (150, "Aux Cable — a standard cable used to connect audio devices via the auxiliary port."),
    "batteries_charging": (300, "Batteries & Charging Accessories — power accessories designed for audio devices."),
    "battery_charger": (500, "Battery Charger — a charger designed for rechargeable audio device batteries."),
    "blu_ray_player": (7500, "Blu-ray Player — a device used to play high-definition Blu-ray discs."),
    "bluetooth_audio_adapter": (700, "Bluetooth Audio Adapter — a device that adds wireless audio streaming to non-Bluetooth equipment."),
    "bluetooth_speakers": (2500, "Bluetooth Speakers — wireless speakers that stream audio from Bluetooth-enabled devices."),
    "bone_conduction_headphones": (3500, "Bone Conduction Headphones — headphones that transmit sound through the cheekbones, leaving ears open."),
    "bookshelf_speakers": (5500, "Bookshelf Speakers — compact speakers designed for home audio setups."),
    "cable_organizer": (200, "Cable Organizer — an accessory used to keep audio cables tidy and untangled."),
    "cassette_player": (2500, "Cassette Player — a device used to play audio cassette tapes."),
    "cd_player": (3500, "CD Player — a device used to play audio compact discs."),
    "ceiling_speakers": (4500, "Ceiling Speakers — in-ceiling speakers designed for built-in home audio."),
    "center_channel_speaker": (5500, "Center Channel Speaker — a speaker designed to reproduce dialogue in a home theater system."),
    "charging_cable": (200, "Charging Cable — a cable used to charge audio devices."),
    "charging_case": (500, "Charging Case — a case that stores and recharges wireless earbuds."),
    "cleaning_kit": (250, "Cleaning Kit — a set of tools used to clean and maintain audio equipment."),
    "closed_back_headphones": (3500, "Closed-Back Headphones — headphones designed with sealed ear cups for sound isolation."),
    "condenser_microphone": (5500, "Condenser Microphone — a sensitive microphone commonly used in studio recording."),
    "conference_audio": (7500, "Conference Audio System — audio equipment designed for meeting rooms and video calls."),
    "conference_microphone": (4500, "Conference Microphone — a microphone designed to capture voices during meetings."),
    "conference_speakerphone": (5500, "Conference Speakerphone — a combined speaker and microphone device for group calls."),
    "dac_digital_to_analog_converter": (4500, "DAC (Digital-to-Analog Converter) — a device that converts digital audio signals into analog sound."),
    "desktop_microphone": (2500, "Desktop Microphone — a microphone designed to sit on a desk for recording or calls."),
    "digital_audio_recorder": (4500, "Digital Audio Recorder — a portable device used to record high-quality audio."),
    "dj_controller": (9500, "DJ Controller — a hardware device used to mix and control music for DJing."),
    "dj_equipment": (9500, "DJ Equipment — a general range of gear used for DJ performances."),
    "dj_headphones": (3500, "DJ Headphones — durable headphones designed for monitoring sound during DJ sets."),
    "dj_mixer": (8500, "DJ Mixer — a device used to blend and transition between audio tracks."),
    "dvd_player": (3500, "DVD Player — a device used to play standard-definition DVD discs."),
    "dynamic_microphone": (3500, "Dynamic Microphone — a rugged microphone commonly used for live performances."),
    "ear_pads": (350, "Ear Pads — replacement cushions designed for headphone ear cups."),
    "ear_tips": (150, "Ear Tips — replacement silicone tips designed for in-ear headphones."),
    "earphones_earbuds": (500, "Earphones & Earbuds — compact in-ear audio devices for personal listening."),
    "equalizer": (3500, "Equalizer — a device used to adjust the balance of audio frequencies."),
    "floor_standing_speakers": (9500, "Floor Standing Speakers — large freestanding speakers designed for home audio systems."),
    "fm_radio": (700, "FM Radio — a device used to receive FM radio broadcasts."),
    "gaming_earbuds": (1500, "Gaming Earbuds — low-latency earbuds designed for gaming audio."),
    "hdmi_earc_cable": (350, "HDMI eARC Cable — a cable used to transmit high-quality audio between HDMI devices."),
    "headphone_amplifier": (4500, "Headphone Amplifier — a device that boosts audio signal for high-quality headphone listening."),
    "headphone_case": (350, "Headphone Case — a protective case designed for storing headphones."),
    "headphone_stand": (700, "Headphone Stand — a stand used to display and store headphones."),
    "headphones": (1500, "Headphones — audio devices worn over or in the ears for personal listening."),
    "hi_res_audio_player": (7500, "Hi-Res Audio Player — a portable player designed for high-resolution audio playback."),
    "home_audio": (5500, "Home Audio System — audio equipment designed for home listening setups."),
    "home_theater_system": (12500, "Home Theater System — a multi-speaker system designed for cinematic sound at home."),
    "in_ear_monitors_iem": (4500, "In-Ear Monitors (IEM) — high-fidelity earphones used by musicians for stage monitoring."),
    "in_wall_speakers": (4500, "In-Wall Speakers — speakers built into walls for a seamless home audio setup."),
    "internet_radio": (3500, "Internet Radio — a device used to stream radio stations over the internet."),
    "karaoke_equipment": (6500, "Karaoke Equipment — a general range of gear designed for karaoke performances."),
    "karaoke_machine": (7500, "Karaoke Machine — an all-in-one device designed for singing along to music."),
    "karaoke_microphone": (1500, "Karaoke Microphone — a microphone designed for karaoke singing."),
    "karaoke_mixer": (3500, "Karaoke Mixer — a mixer designed to blend vocals with backing music."),
    "karaoke_speaker": (3500, "Karaoke Speaker — a speaker designed for karaoke and party use."),
    "kids_headphones": (900, "Kids Headphones — volume-limited headphones designed for children."),
    "lavalier_microphone": (1500, "Lavalier Microphone — a small clip-on microphone used for hands-free recording."),
    "lightning_to_3_5mm_adapter": (350, "Lightning to 3.5mm Adapter — an adapter that connects standard headphones to Lightning-port devices."),
    "line_array_speaker": (12500, "Line Array Speaker — a stacked speaker system designed for large venue sound."),
    "meeting_audio_system": (8500, "Meeting Audio System — audio equipment designed for conference rooms."),
    "microphone_stand": (900, "Microphone Stand — a stand used to hold a microphone in place."),
    "microphones": (1500, "Microphones — devices used to capture and record sound."),
    "midi_controller": (5500, "MIDI Controller — a device used to control music software and instruments."),
    "midi_keyboard": (6500, "MIDI Keyboard — a keyboard controller used for music production."),
    "mini_bluetooth_speaker": (1200, "Mini Bluetooth Speaker — a compact wireless speaker for portable listening."),
    "mp3_player": (1500, "MP3 Player — a portable device used to play digital music files."),
    "mp4_player": (2200, "MP4 Player — a portable media player supporting audio and video playback."),
    "multi_room_speaker": (6500, "Multi-Room Speaker — a smart speaker designed to sync audio across multiple rooms."),
    "music_players": (2200, "Music Players — a general range of devices designed for playing digital music."),
    "neckband_earphones": (900, "Neckband Earphones — wireless earphones connected by a band worn around the neck."),
    "noise_cancelling_earbuds": (3500, "Noise Cancelling Earbuds — earbuds that actively block ambient sound."),
    "noise_cancelling_headphones": (5500, "Noise Cancelling Headphones — headphones that actively block ambient sound."),
    "on_ear_headphones": (2500, "On-Ear Headphones — headphones with ear cups that rest on the ears."),
    "open_back_headphones": (4500, "Open-Back Headphones — headphones designed with vented ear cups for a natural soundstage."),
    "open_ear_earbuds": (2500, "Open-Ear Earbuds — earbuds designed to sit outside the ear canal for situational awareness."),
    "optical_audio_cable": (350, "Optical Audio Cable — a fiber-optic cable used to transmit digital audio."),
    "outdoor_bluetooth_speaker": (3500, "Outdoor Bluetooth Speaker — a rugged wireless speaker designed for outdoor use."),
    "over_ear_headphones": (3500, "Over-Ear Headphones — headphones with ear cups that fully surround the ears."),
    "pa_speaker": (7500, "PA Speaker — a public address speaker designed for large-scale sound reinforcement."),
    "party_speaker": (6500, "Party Speaker — a large speaker designed for parties and events."),
    "passive_speaker": (4500, "Passive Speaker — a speaker that requires an external amplifier to operate."),
    "podcast_microphone": (3500, "Podcast Microphone — a microphone designed for clear voice recording in podcasts."),
    "pop_filter": (350, "Pop Filter — a screen used to reduce plosive sounds during microphone recording."),
    "portable_bluetooth_speaker": (2500, "Portable Bluetooth Speaker — a compact wireless speaker for on-the-go listening."),
    "portable_music_player": (2200, "Portable Music Player — a handheld device designed for playing music on the move."),
    "power_amplifier": (7500, "Power Amplifier — a device used to boost audio signal for driving speakers."),
    "powered_speaker": (6500, "Powered Speaker — a speaker with a built-in amplifier."),
    "preamplifier": (5500, "Preamplifier — a device used to boost weak audio signals before amplification."),
    "professional_audio": (9500, "Professional Audio Equipment — a general range of gear designed for professional sound production."),
    "rca_adapter": (150, "RCA Adapter — an adapter used to connect RCA audio cables to other connectors."),
    "rca_cable": (200, "RCA Cable — a standard cable used to connect analog audio devices."),
    "rechargeable_battery": (350, "Rechargeable Battery — a reusable battery designed for audio devices."),
    "replacement_ear_cushions": (350, "Replacement Ear Cushions — replacement padding designed for headphone ear cups."),
    "replacement_ear_tips": (150, "Replacement Ear Tips — replacement silicone tips designed for in-ear headphones."),
    "replacement_parts": (250, "Replacement Parts — spare components designed for audio equipment repair."),
    "shock_mount": (700, "Shock Mount — a mount that isolates a microphone from vibrations."),
    "shotgun_microphone": (4500, "Shotgun Microphone — a directional microphone used for focused audio capture."),
    "smart_audio": (5500, "Smart Audio Device — an audio device with smart connectivity features."),
    "smart_bluetooth_speaker": (3500, "Smart Bluetooth Speaker — a wireless speaker with built-in voice assistant support."),
    "smart_speaker": (3500, "Smart Speaker — a voice-controlled speaker with smart assistant integration."),
    "soundbar": (5500, "Soundbar — a slim speaker bar designed to enhance TV audio."),
    "speaker_cable": (250, "Speaker Cable — a cable used to connect speakers to an amplifier."),
    "speaker_drivers": (700, "Speaker Drivers — replacement components used to reproduce sound in speakers."),
    "speaker_grille": (350, "Speaker Grille — a protective cover designed for speaker drivers."),
    "speaker_stand": (1500, "Speaker Stand — a stand used to elevate and position speakers."),
    "sports_earbuds": (1800, "Sports Earbuds — sweat-resistant earbuds designed for workouts."),
    "sports_headphones": (2200, "Sports Headphones — durable headphones designed for active use."),
    "stage_monitor": (7500, "Stage Monitor — a speaker used by performers to hear themselves on stage."),
    "stereo_speaker_system": (5500, "Stereo Speaker System — a two-channel speaker setup designed for home audio."),
    "studio_headphones": (4500, "Studio Headphones — headphones designed for accurate sound monitoring in studios."),
    "studio_monitor_speakers": (8500, "Studio Monitor Speakers — speakers designed for accurate audio playback in studios."),
    "subwoofer": (6500, "Subwoofer — a speaker designed to reproduce deep bass frequencies."),
    "surround_speakers": (6500, "Surround Speakers — speakers designed to create an immersive home theater sound."),
    "true_wireless_earbuds_tws": (2500, "True Wireless Earbuds (TWS) — fully wireless earbuds without a connecting cable."),
    "turntable": (7500, "Turntable — a device used to play vinyl records."),
    "turntable_record_player": (8500, "Turntable Record Player — an all-in-one system designed for playing vinyl records."),
    "usb_audio_adapter": (350, "USB Audio Adapter — an adapter that adds audio input/output via USB."),
    "usb_audio_cable": (250, "USB Audio Cable — a cable used to transmit digital audio via USB."),
    "usb_c_to_3_5mm_adapter": (250, "USB-C to 3.5mm Adapter — an adapter that connects standard headphones to USB-C devices."),
    "usb_charger": (350, "USB Charger — a charger designed for USB-powered audio devices."),
    "usb_microphone": (3500, "USB Microphone — a microphone that connects directly to a computer via USB."),
    "usb_speakerphone": (4500, "USB Speakerphone — a USB-connected device combining speaker and microphone for calls."),
    "voice_assistant_speaker": (3500, "Voice Assistant Speaker — a smart speaker controlled by voice commands."),
    "voice_recorder": (2500, "Voice Recorder — a portable device used to record spoken audio."),
    "volume_controller": (350, "Volume Controller — a device used to adjust audio output levels."),
    "waterproof_bluetooth_speaker": (3500, "Waterproof Bluetooth Speaker — a wireless speaker designed to withstand water exposure."),
    "wi_fi_speaker": (5500, "Wi-Fi Speaker — a speaker that streams audio over a wireless network."),
    "windscreen": (250, "Windscreen — a foam cover used to reduce wind noise on a microphone."),
    "wired_earphones": (350, "Wired Earphones — earphones that connect via a physical audio cable."),
    "wired_headphones": (900, "Wired Headphones — headphones that connect via a physical audio cable."),
    "wired_microphone": (1500, "Wired Microphone — a microphone that connects via a physical cable."),
    "wireless_earphones": (1500, "Wireless Earphones — earphones that connect via Bluetooth."),
    "wireless_headphones": (2500, "Wireless Headphones — headphones that connect via Bluetooth."),
    "wireless_microphone": (4500, "Wireless Microphone — a microphone that transmits audio without a cable."),
    "xlr_adapter": (250, "XLR Adapter — an adapter used to connect XLR audio cables to other connectors."),
    "xlr_cable": (350, "XLR Cable — a professional-grade cable used to connect microphones and audio equipment."),
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
        if prod.get("categoryId") == "headphones_speakers_audio":
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
