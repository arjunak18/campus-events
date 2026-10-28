# remove_bottom_emblem.py
import re

report_script = r"C:\Users\USER\.gemini\antigravity\scratch\campus-events\generate_complete_report.py"
docx_script = r"C:\Users\USER\.gemini\antigravity\scratch\campus-events\generate_docx_report.py"

# 1. Update generate_complete_report.py
with open(report_script, "r", encoding="utf-8") as f:
    text = f.read()

# In make_front_page, set emblem_tag = ''
text = re.sub(
    r'emblem_tag\s*=\s*f?[\'"].*?[\'"]\s*if\s*show_emblem\s*else\s*[\'"][\'"]',
    "emblem_tag = ''",
    text
)

# Also ensure {emblem_tag} is removed or empty
text = text.replace('{emblem_tag}', '')

with open(report_script, "w", encoding="utf-8") as f:
    f.write(text)

print("generate_complete_report.py updated: bottom emblem removed.")

# 2. Update generate_docx_report.py
with open(docx_script, "r", encoding="utf-8") as f:
    dtext = f.read()

# Replace all if os.path.exists(emblem_path): ... blocks
dtext = re.sub(
    r'if os\.path\.exists\(emblem_path\):.*?add_picture\(emblem_path,.*?\)',
    '# Bottom emblem removed as requested',
    dtext,
    flags=re.DOTALL
)

with open(docx_script, "w", encoding="utf-8") as f:
    f.write(dtext)

print("generate_docx_report.py updated: bottom emblem removed.")
