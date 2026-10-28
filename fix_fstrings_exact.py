# fix_fstrings_exact.py
with open(r"C:\Users\USER\.gemini\antigravity\scratch\campus-events\generate_complete_report.py", "r", encoding="utf-8") as f:
    txt = f.read()

txt = txt.replace('p1_content = """\n', 'p1_content = f"""\n')
txt = txt.replace('p2_content = """\n', 'p2_content = f"""\n')

with open(r"C:\Users\USER\.gemini\antigravity\scratch\campus-events\generate_complete_report.py", "w", encoding="utf-8") as f:
    f.write(txt)

print("Both replaced with f-strings successfully!")
