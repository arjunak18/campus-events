# update_to_cyber_security.py
import os
import re

base_dir = r"C:\Users\USER\.gemini\antigravity\scratch\campus-events"
py_report = os.path.join(base_dir, "generate_complete_report.py")
py_docx = os.path.join(base_dir, "generate_docx_report.py")

# 1. Update generate_complete_report.py
with open(py_report, "r", encoding="utf-8") as f:
    txt = f.read()

txt = txt.replace("DEPARTMENT OF CSE - DATA SCIENCE", "DEPARTMENT OF CSE - CYBER SECURITY")
txt = txt.replace("COMPUTER SCIENCE AND ENGINEERING - DATA SCIENCE", "COMPUTER SCIENCE AND ENGINEERING - CYBER SECURITY")
txt = txt.replace("DEPARTMENT OF COMPUTER SCIENCE AND ENGINEERING (DATA SCIENCE)", "DEPARTMENT OF COMPUTER SCIENCE AND ENGINEERING (CYBER SECURITY)")
txt = txt.replace("(DATA SCIENCE)", "(CYBER SECURITY)")
txt = txt.replace("Computer Science & Engineering - DATA SCIENCE", "Computer Science & Engineering - CYBER SECURITY")
txt = txt.replace("Dept: 'CSE - Data Science'", "Dept: 'CSE - Cyber Security'")

with open(py_report, "w", encoding="utf-8") as f:
    f.write(txt)

print("generate_complete_report.py updated to CYBER SECURITY.")

# 2. Update generate_docx_report.py
with open(py_docx, "r", encoding="utf-8") as f:
    dtxt = f.read()

dtxt = dtxt.replace("DEPARTMENT OF CSE - DATA SCIENCE", "DEPARTMENT OF CSE - CYBER SECURITY")
dtxt = dtxt.replace("COMPUTER SCIENCE AND ENGINEERING - DATA SCIENCE", "COMPUTER SCIENCE AND ENGINEERING - CYBER SECURITY")
dtxt = dtxt.replace("DEPARTMENT OF COMPUTER SCIENCE AND ENGINEERING (DATA SCIENCE)", "DEPARTMENT OF COMPUTER SCIENCE AND ENGINEERING (CYBER SECURITY)")
dtxt = dtxt.replace("(DATA SCIENCE)", "(CYBER SECURITY)")
dtxt = dtxt.replace("Computer Science & Engineering - DATA SCIENCE", "Computer Science & Engineering - CYBER SECURITY")
dtxt = dtxt.replace("Dept: 'CSE - Data Science'", "Dept: 'CSE - Cyber Security'")

with open(py_docx, "w", encoding="utf-8") as f:
    f.write(dtxt)

print("generate_docx_report.py updated to CYBER SECURITY.")
