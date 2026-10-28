# rename_to_campus_events.py
import os
import re
import shutil

base_dir = r"C:\Users\USER\.gemini\antigravity\scratch\campus-events"
py_report = os.path.join(base_dir, "generate_complete_report.py")
py_docx = os.path.join(base_dir, "generate_docx_report.py")

# 1. Update generate_complete_report.py
with open(py_report, "r", encoding="utf-8") as f:
    txt = f.read()

txt = txt.replace("CAMPUS EVENTS CALENDAR", "CAMPUS EVENTS")
txt = txt.replace("Campus Events Calendar", "Campus Events")

with open(py_report, "w", encoding="utf-8") as f:
    f.write(txt)

print("generate_complete_report.py updated to CAMPUS EVENTS.")

# 2. Update generate_docx_report.py
with open(py_docx, "r", encoding="utf-8") as f:
    dtxt = f.read()

dtxt = dtxt.replace("CAMPUS EVENTS CALENDAR", "CAMPUS EVENTS")
dtxt = dtxt.replace("Campus Events Calendar", "Campus Events")

with open(py_docx, "w", encoding="utf-8") as f:
    f.write(dtxt)

print("generate_docx_report.py updated to CAMPUS EVENTS.")
