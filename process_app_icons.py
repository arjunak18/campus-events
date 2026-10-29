"""
Process and deploy the newly generated Campus Events app icon across all project platforms.
Generates:
- mobile/assets/icon.png (1024x1024)
- mobile/assets/android-icon-foreground.png (512x512)
- mobile/assets/android-icon-background.png (512x512)
- mobile/assets/android-icon-monochrome.png (432x432)
- mobile/assets/splash-icon.png (1024x1024)
- mobile/assets/favicon.png (48x48)
- Android native mipmaps (hdpi, mdpi, xhdpi, xxhdpi, xxxhdpi)
- Native splashscreen logos
"""

import os
from PIL import Image, ImageOps, ImageDraw, ImageFilter
import numpy as np

src_path = r"C:\Users\USER\.gemini\antigravity\brain\af94301b-b199-46b4-914e-52fbf9bc1aea\campus_events_app_icon_1793214604080.jpg"
mobile_dir = r"C:\Users\USER\.gemini\antigravity\scratch\campus-events\mobile"
assets_dir = os.path.join(mobile_dir, "assets")
res_dir = os.path.join(mobile_dir, "android", "app", "src", "main", "res")
deliverables_dir = r"C:\Users\USER\.gemini\antigravity\scratch\campus-events\deliverables"
website_dir = r"C:\Users\USER\.gemini\antigravity\scratch\campus-events\website"
downloads_dir = r"C:\Users\USER\Downloads"

# 1. Load source image
master_img = Image.open(src_path).convert("RGBA")

# High-resolution master icon (1024x1024)
icon_1024 = master_img.resize((1024, 1024), Image.Resampling.LANCZOS)
icon_1024.save(os.path.join(assets_dir, "icon.png"), "PNG")
icon_1024.save(os.path.join(deliverables_dir, "campus-events-app-icon.png"), "PNG")
icon_1024.save(os.path.join(website_dir, "campus-events-app-icon.png"), "PNG")
icon_1024.save(os.path.join(downloads_dir, "campus-events-app-icon.png"), "PNG")
print("Saved 1024x1024 master icon.")

# 2. Splash Icon (1024x1024)
icon_1024.save(os.path.join(assets_dir, "splash-icon.png"), "PNG")

# 3. Favicon (48x48)
favicon_48 = master_img.resize((48, 48), Image.Resampling.LANCZOS)
favicon_48.save(os.path.join(assets_dir, "favicon.png"), "PNG")
favicon_48.save(os.path.join(website_dir, "favicon.png"), "PNG")

# 4. Android Adaptive Icon:
# Canvas is 512x512.
# Safe zone is 66% (340px circle).
# Background layer:
bg_base = Image.new("RGBA", (512, 512), (8, 7, 24, 255))
bg_glow = master_img.resize((512, 512), Image.Resampling.LANCZOS).filter(ImageFilter.GaussianBlur(radius=24))
android_bg = Image.blend(bg_base, bg_glow, 0.45)
android_bg.save(os.path.join(assets_dir, "android-icon-background.png"), "PNG")

# Foreground layer (centered emblem with smooth squircle mask):
emblem_dim = int(512 * 0.68) # 348px
emblem_scaled = master_img.resize((emblem_dim, emblem_dim), Image.Resampling.LANCZOS)
emblem_mask = Image.new("L", (emblem_dim, emblem_dim), 0)
d_em = ImageDraw.Draw(emblem_mask)
d_em.rounded_rectangle((0, 0, emblem_dim, emblem_dim), radius=int(emblem_dim * 0.22), fill=255)

android_fg = Image.new("RGBA", (512, 512), (0, 0, 0, 0))
offset_fg = ((512 - emblem_dim) // 2, (512 - emblem_dim) // 2)
android_fg.paste(emblem_scaled, offset_fg, emblem_mask)
android_fg.save(os.path.join(assets_dir, "android-icon-foreground.png"), "PNG")

# Monochrome icon (432x432) for Android 13+ Material You
mono_size = int(432 * 0.68)
fg_mono_content = ImageOps.grayscale(master_img).resize((mono_size, mono_size), Image.Resampling.LANCZOS)
android_mono = Image.new("RGBA", (432, 432), (0, 0, 0, 0))
mono_arr = np.array(fg_mono_content)
mono_alpha = (mono_arr > 65).astype(np.uint8) * 255
mono_img = Image.fromarray(np.dstack([np.full_like(mono_arr, 255), np.full_like(mono_arr, 255), np.full_like(mono_arr, 255), mono_alpha]))
mono_offset = ((432 - mono_size) // 2, (432 - mono_size) // 2)
android_mono.paste(mono_img, mono_offset, mono_img)
android_mono.save(os.path.join(assets_dir, "android-icon-monochrome.png"), "PNG")
print("Saved adaptive icon layers.")

# 5. Native Android mipmaps update
mipmaps = {
    "mipmap-mdpi": {"icon": (48, 48), "adaptive": (108, 108)},
    "mipmap-hdpi": {"icon": (72, 72), "adaptive": (162, 162)},
    "mipmap-xhdpi": {"icon": (96, 96), "adaptive": (216, 216)},
    "mipmap-xxhdpi": {"icon": (144, 144), "adaptive": (324, 324)},
    "mipmap-xxxhdpi": {"icon": (192, 192), "adaptive": (432, 432)},
}

for folder, dims in mipmaps.items():
    target_dir = os.path.join(res_dir, folder)
    if not os.path.exists(target_dir):
        continue
    
    # 5.1 ic_launcher.webp (Square with rounded corners)
    ic_dim = dims["icon"]
    ic_img = master_img.resize(ic_dim, Image.Resampling.LANCZOS)
    ic_mask = Image.new("L", ic_dim, 0)
    d_ic = ImageDraw.Draw(ic_mask)
    d_ic.rounded_rectangle((0, 0, ic_dim[0], ic_dim[1]), radius=int(ic_dim[0] * 0.22), fill=255)
    ic_final = Image.new("RGBA", ic_dim, (0, 0, 0, 0))
    ic_final.paste(ic_img, (0, 0), ic_mask)
    ic_final.save(os.path.join(target_dir, "ic_launcher.webp"), "WEBP")
    
    # 5.2 ic_launcher_round.webp (Circular mask)
    mask_c = Image.new("L", ic_dim, 0)
    draw_c = ImageDraw.Draw(mask_c)
    draw_c.ellipse((0, 0, ic_dim[0], ic_dim[1]), fill=255)
    ic_round = Image.new("RGBA", ic_dim, (0, 0, 0, 0))
    ic_round.paste(ic_img, (0, 0), mask=mask_c)
    ic_round.save(os.path.join(target_dir, "ic_launcher_round.webp"), "WEBP")
    
    # 5.3 ic_launcher_background.webp
    ad_dim = dims["adaptive"]
    ad_bg = android_bg.resize(ad_dim, Image.Resampling.LANCZOS)
    ad_bg.save(os.path.join(target_dir, "ic_launcher_background.webp"), "WEBP")
    
    # 5.4 ic_launcher_foreground.webp
    ad_fg = android_fg.resize(ad_dim, Image.Resampling.LANCZOS)
    ad_fg.save(os.path.join(target_dir, "ic_launcher_foreground.webp"), "WEBP")
    
    # 5.5 ic_launcher_monochrome.webp
    ad_mono = android_mono.resize(ad_dim, Image.Resampling.LANCZOS)
    ad_mono.save(os.path.join(target_dir, "ic_launcher_monochrome.webp"), "WEBP")

print("Updated all Android native mipmaps.")

# 6. Native Android splashscreen_logo update
splash_drawables = {
    "drawable-mdpi": (288, 288),
    "drawable-hdpi": (432, 432),
    "drawable-xhdpi": (576, 576),
    "drawable-xxhdpi": (864, 864),
    "drawable-xxxhdpi": (1152, 1152),
}

for folder, dim in splash_drawables.items():
    target_dir = os.path.join(res_dir, folder)
    if os.path.exists(target_dir):
        sp_img = master_img.resize(dim, Image.Resampling.LANCZOS)
        sp_img.save(os.path.join(target_dir, "splashscreen_logo.png"), "PNG")

print("Updated all Android native splashscreen logos.")
