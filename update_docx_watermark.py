# update_docx_watermark.py
import os
import re

docx_script = r"C:\Users\USER\.gemini\antigravity\scratch\campus-events\generate_docx_report.py"

with open(docx_script, "r", encoding="utf-8") as f:
    text = f.read()

# Make sure watermark path is defined
if 'watermark_path =' not in text:
    text = text.replace(
        "emblem_path = os.path.join(ASSETS_DIR, 'Image20.jpg')",
        "emblem_path = os.path.join(ASSETS_DIR, 'Image20.jpg')\nwatermark_path = os.path.join(ASSETS_DIR, 'jcet_logo_watermark_hd.png')"
    )

with open(docx_script, "w", encoding="utf-8") as f:
    f.write(text)

print("generate_docx_report.py ready.")
