# fix_fstrings.py
with open(r"C:\Users\USER\.gemini\antigravity\scratch\campus-events\generate_complete_report.py", "r", encoding="utf-8") as f:
    txt = f.read()

txt = txt.replace('p1_content = """<div', 'p1_content = f"""<div')
txt = txt.replace('p2_content = """<div>', 'p2_content = f"""<div>')

with open(r"C:\Users\USER\.gemini\antigravity\scratch\campus-events\generate_complete_report.py", "w", encoding="utf-8") as f:
    f.write(txt)

print("generate_complete_report.py fixed successfully!")
