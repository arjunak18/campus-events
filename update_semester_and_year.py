# update_semester_and_year.py
import re

report_script = r"C:\Users\USER\.gemini\antigravity\scratch\campus-events\generate_complete_report.py"
docx_script = r"C:\Users\USER\.gemini\antigravity\scratch\campus-events\generate_docx_report.py"

# 1. Update generate_complete_report.py
with open(report_script, "r", encoding="utf-8") as f:
    text = f.read()

# Change Fourth Semester -> Third Semester
text = re.sub(r'Fourth\s+Semester', 'Third Semester', text, flags=re.IGNORECASE)

# Change 2025–2026 -> 2026–2027 in academic year
text = re.sub(r'2025[–\-]2026', '2026–2027', text)

with open(report_script, "w", encoding="utf-8") as f:
    f.write(text)

print("generate_complete_report.py updated: Third Semester and 2026–2027.")

# 2. Update generate_docx_report.py
with open(docx_script, "r", encoding="utf-8") as f:
    dtext = f.read()

dtext = re.sub(r'Fourth\s+Semester', 'Third Semester', dtext, flags=re.IGNORECASE)
dtext = re.sub(r'2025[–\-]2026', '2026–2027', dtext)

with open(docx_script, "w", encoding="utf-8") as f:
    f.write(dtext)

print("generate_docx_report.py updated: Third Semester and 2026–2027.")
