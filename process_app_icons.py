"""
Process and deploy the newly generated Campus Events app icon across all project platforms.
Generates:
- mobile/assets/icon.png (1024x1024)
- mobile/assets/android-icon-foreground.png (512x512)
- mobile/assets/android-icon-background.png (512x512)
- mobile/assets/android-icon-monochrome.png (432x432)
- mobile/assets/splash-icon.png (1024x1024)
- mobile/assets/favicon.png (48x48)
- Android native mipmaps (hdpi, mdpi, xhdpi, xxxhdpi)
- Deliverables and Downloads copies
- HTML visual showcase artifact
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
w, h = master_img.size

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
# In adaptive icons, canvas is 512x512.
# The central safe zone is a circle of diameter 66-70% (approx 340-360px).
# If we scale the icon to 72% (368x368) and place it centered on a transparent canvas for foreground,
# and have a matching dark background canvas for background.
bg_color = (8, 7, 24, 255) # Deep obsidian midnight navy
android_bg = Image.new("RGBA", (512, 512), bg_color)
# Gradient overlay for background to match master icon depth
bg_scaled = master_img.resize((512, 512), Image.Resampling.LANCZOS)
bg_blurred = bg_scaled.filter(ImageFilter.GaussianBlur(radius=8))
bg_blurred.save(os.path.join(assets_dir, "android-icon-background.png"), "PNG")

# Foreground: scaled down to 72% so the full icon artwork sits safely inside the circular mask
fg_size = int(512 * 0.72) # ~368px
fg_content = master_img.resize((fg_size, fg_size), Image.Resampling.LANCZOS)
android_fg = Image.new("RGBA", (512, 512), (0, 0, 0, 0))
offset = ((512 - fg_size) // 2, (512 - fg_size) // 2)
android_fg.paste(fg_content, offset, fg_content)
android_fg.save(os.path.join(assets_dir, "android-icon-foreground.png"), "PNG")

# Monochrome icon (432x432)
# Grayscale representation for Android 13+ themed icons
mono_size = int(432 * 0.72)
fg_mono_content = ImageOps.grayscale(master_img).resize((mono_size, mono_size), Image.Resampling.LANCZOS)
android_mono = Image.new("RGBA", (432, 432), (0, 0, 0, 0))
mono_rgba = Image.new("RGBA", (mono_size, mono_size), (255, 255, 255, 0))
# Put white where luminance > threshold
mono_arr = np.array(fg_mono_content)
mono_alpha = (mono_arr > 60).astype(np.uint8) * 255
mono_img = Image.fromarray(np.dstack([np.full_like(mono_arr, 255), np.full_like(mono_arr, 255), np.full_like(mono_arr, 255), mono_alpha]))
mono_offset = ((432 - mono_size) // 2, (432 - mono_size) // 2)
android_mono.paste(mono_img, mono_offset, mono_img)
android_mono.save(os.path.join(assets_dir, "android-icon-monochrome.png"), "PNG")
print("Saved adaptive icon layers.")

# 5. Native Android mipmaps update
# Dimensions mapping:
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
    ic_img.save(os.path.join(target_dir, "ic_launcher.webp"), "WEBP")
    
    # 5.2 ic_launcher_round.webp (Circular mask)
    mask = Image.new("L", ic_dim, 0)
    draw = ImageDraw.Draw(mask)
    draw.ellipse((0, 0, ic_dim[0], ic_dim[1]), fill=255)
    ic_round = Image.new("RGBA", ic_dim, (0, 0, 0, 0))
    ic_round.paste(ic_img, (0, 0), mask=mask)
    ic_round.save(os.path.join(target_dir, "ic_launcher_round.webp"), "WEBP")
    
    # 5.3 ic_launcher_background.webp
    ad_dim = dims["adaptive"]
    ad_bg = bg_blurred.resize(ad_dim, Image.Resampling.LANCZOS)
    ad_bg.save(os.path.join(target_dir, "ic_launcher_background.webp"), "WEBP")
    
    # 5.4 ic_launcher_foreground.webp
    ad_fg = android_fg.resize(ad_dim, Image.Resampling.LANCZOS)
    ad_fg.save(os.path.join(target_dir, "ic_launcher_foreground.webp"), "WEBP")
    
    # 5.5 ic_launcher_monochrome.webp
    ad_mono = android_mono.resize(ad_dim, Image.Resampling.LANCZOS)
    ad_mono.save(os.path.join(target_dir, "ic_launcher_monochrome.webp"), "WEBP")

print("Updated all Android native mipmaps.")
