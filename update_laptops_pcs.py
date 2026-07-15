import json, re

price_desc = {
    "laptops_pcs": (45000, "Laptops & PCs — a wide range of laptops and desktop computers for home, office, gaming and business use."),
    "laptop_computer": (45000, "Laptop Computer — a reliable everyday laptop suitable for browsing, office work, and study."),
    "business_laptop": (65000, "Business Laptop — a professional-grade laptop built for productivity, security, and portability in the workplace."),
    "gaming_laptop": (120000, "Gaming Laptop — a high-performance laptop with a dedicated graphics card for smooth gaming and heavy workloads."),
    "ultrabook": (85000, "Ultrabook — a thin, lightweight laptop combining portability with strong everyday performance."),
    "2_in_1_convertible_laptop": (75000, "2-in-1 Convertible Laptop — a flexible laptop that converts into tablet mode with touchscreen support."),
    "chromebook": (28000, "Chromebook — a lightweight, fast-booting laptop running Chrome OS, ideal for browsing and cloud-based work."),
    "student_laptop": (35000, "Student Laptop — an affordable, reliable laptop suited for study, assignments, and everyday use."),
    "creator_laptop": (130000, "Creator Laptop — a powerful laptop built for video editing, design, and creative workloads."),
    "workstation_laptop": (150000, "Workstation Laptop — a high-end mobile workstation for demanding professional and engineering applications."),
    "rugged_laptop": (95000, "Rugged Laptop — a durable, shock and water-resistant laptop built for tough field conditions."),
    "refurbished_laptop": (22000, "Refurbished Laptop — a quality-tested, pre-owned laptop offered at a budget-friendly price."),
    "desktop_pcs": (40000, "Desktop PCs — a general range of desktop computers for home and office use."),
    "desktop_computer": (42000, "Desktop Computer — a full desktop setup suitable for everyday computing needs."),
    "all_in_one_pc": (55000, "All-in-One PC — a space-saving desktop with the computer built into the monitor."),
    "mini_pc": (25000, "Mini PC — a compact, low-power desktop computer ideal for basic tasks and media centers."),
    "gaming_pc": (130000, "Gaming PC — a high-performance desktop built for demanding games and heavy multitasking."),
    "business_pc": (45000, "Business PC — a dependable desktop designed for office productivity and daily business tasks."),
    "workstation_pc": (160000, "Workstation PC — a powerful desktop built for professional design, engineering, and rendering work."),
    "home_desktop": (38000, "Home Desktop — an everyday desktop computer suited for browsing, entertainment, and family use."),
    "barebone_pc": (18000, "Barebone PC — a base desktop kit (case, motherboard, PSU) ready for custom component upgrades."),
    "thin_client": (15000, "Thin Client — a compact, low-power terminal designed for centralized/cloud computing environments."),
    "computer_components": (5000, "Computer Components — a general range of internal PC parts and upgrade components."),
    "processors_cpu": (12000, "Processors (CPU) — a range of central processing units for desktops and workstations."),
    "intel_processor": (15000, "Intel Processor — a genuine Intel CPU offering reliable performance for desktops and laptops."),
    "amd_processor": (14000, "AMD Processor — a genuine AMD CPU offering strong multitasking and gaming performance."),
    "motherboards": (8000, "Motherboards — a range of mainboards compatible with various CPU sockets and form factors."),
    "atx_motherboard": (9000, "ATX Motherboard — a full-size motherboard offering maximum expansion slots and connectivity."),
    "micro_atx_motherboard": (7000, "Micro ATX Motherboard — a compact motherboard balancing size and expandability."),
    "mini_itx_motherboard": (8500, "Mini ITX Motherboard — a small-form-factor motherboard ideal for compact PC builds."),
    "graphics_cards_gpu": (25000, "Graphics Cards (GPU) — a range of dedicated graphics cards for gaming and content creation."),
    "nvidia_graphics_card": (35000, "NVIDIA Graphics Card — a dedicated GPU offering strong gaming and rendering performance."),
    "amd_graphics_card": (30000, "AMD Graphics Card — a dedicated GPU offering solid gaming and multitasking performance."),
    "external_egpu": (20000, "External eGPU — an external graphics card enclosure for boosting laptop graphics performance."),
    "memory_ram": (3500, "Memory (RAM) — a range of system memory modules for desktops and laptops."),
    "ddr4_ram": (3200, "DDR4 RAM — a widely compatible memory module for desktops and laptops."),
    "ddr5_ram": (5500, "DDR5 RAM — the latest generation memory module offering higher speed and bandwidth."),
    "laptop_ram_so_dimm": (3000, "Laptop RAM (SO-DIMM) — compact memory module designed specifically for laptops."),
    "ecc_ram": (6000, "ECC RAM — error-correcting memory module used in servers and workstations for data integrity."),
    "storage": (4000, "Storage — a general range of internal storage drives for desktops and laptops."),
    "sata_ssd": (3500, "SATA SSD — a solid-state drive offering a reliable upgrade over traditional hard drives."),
    "nvme_ssd": (5000, "NVMe SSD — a high-speed solid-state drive delivering fast boot and load times."),
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
