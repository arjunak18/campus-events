# update_docx_pages_1_and_2.py
import os
import re

docx_script = r"C:\Users\USER\.gemini\antigravity\scratch\campus-events\generate_docx_report.py"

with open(docx_script, "r", encoding="utf-8") as f:
    text = f.read()

# Add nba_path and naac_path
if 'nba_path =' not in text:
    text = text.replace(
        "emblem_path = os.path.join(ASSETS_DIR, 'Image20.jpg')",
        "emblem_path = os.path.join(ASSETS_DIR, 'Image20.jpg')\n"
        "nba_path = os.path.join(ASSETS_DIR, 'Image28.jpg')\n"
        "naac_path = os.path.join(ASSETS_DIR, 'Image29.jpg')"
    )

# Page 1: Remove bottom address block and put emblem logo below Prof. Dr. R. Satheesh Kumar
old_p1_end = """c2 = tbl.cell(0, 1)
p2 = c2.paragraphs[0]
p2.alignment = WD_ALIGN_PARAGRAPH.RIGHT
r_gd = p2.add_run("Guided by\\n")
r_gd.bold = True
r_gname = p2.add_run("Prof. Dr. R. SATHEESH KUMAR\\n")
r_gname.bold = True
p2.add_run("Professor and HoD, CSE")

# Bottom emblem removed as requested

p_col = doc.add_paragraph()
p_col.alignment = WD_ALIGN_PARAGRAPH.CENTER
r_col = p_col.add_run(
    "DEPARTMENT OF COMPUTER SCIENCE AND ENGINEERING (CYBER SECURITY)\\n"
    "JAWAHARLAL COLLEGE OF ENGINEERING AND TECHNOLOGY\\n"
    "LAKKIDI, MANGALAM P.O, PALAKKAD, KERALA - 679301\\n"
    "APRIL 2026"
)
r_col.bold = True
r_col.font.size = Pt(9.5)"""

new_p1_end = """# Candidate By block centered
p_by = doc.add_paragraph()
p_by.alignment = WD_ALIGN_PARAGRAPH.CENTER
r_by = p_by.add_run("By\\n")
r_by.italic = True
r_stu = p_by.add_run("JCE25CC019            ARJUN P KOLIKKAL\\n\\n")
r_stu.bold = True

p_gd = doc.add_paragraph()
p_gd.alignment = WD_ALIGN_PARAGRAPH.CENTER
r_gd = p_gd.add_run("Guided by\\n")
r_gd.italic = True
r_gname = p_gd.add_run("Prof. Dr. R. SATHEESH KUMAR\\n\\n")
r_gname.bold = True

if os.path.exists(emblem_path):
    p_emb1 = doc.add_paragraph()
    p_emb1.alignment = WD_ALIGN_PARAGRAPH.CENTER
    p_emb1.add_run().add_picture(emblem_path, width=Inches(1.0))"""

# If tbl was used on Page 1, let's replace the whole student/guide/footer section of Page 1
page1_pattern = r'# Student & Guide Table.*?p_col\.font\.size = Pt\(9\.5\)'
if re.search(page1_pattern, text, re.DOTALL):
    text = re.sub(page1_pattern, new_p1_end, text, flags=re.DOTALL)
    print("Page 1 updated in docx.")

# Page 2: Top header block with NBA, College name, OCTOBER 2026, NAAC, then emblem, then BONAFIDE CERTIFICATE
old_p2_head = """p_head = doc.add_paragraph()
p_head.alignment = WD_ALIGN_PARAGRAPH.CENTER
r = p_head.add_run("DEPARTMENT OF COMPUTER SCIENCE AND ENGINEERING\\n(CYBER SECURITY)\\n\\n")
r.bold = True

r_cert = p_head.add_run("BONAFIDE CERTIFICATE\\n\\n")
r_cert.bold = True
r_cert.font.size = Pt(14)"""

new_p2_head = """# Top address block with NBA and NAAC logos on sides
tbl_cert_hdr = doc.add_table(rows=1, cols=3)
tbl_cert_hdr.alignment = WD_TABLE_ALIGNMENT.CENTER
tbl_cert_hdr.columns[0].width = Inches(0.9)
tbl_cert_hdr.columns[1].width = Inches(4.5)
tbl_cert_hdr.columns[2].width = Inches(0.9)

if os.path.exists(nba_path):
    tbl_cert_hdr.cell(0, 0).paragraphs[0].add_run().add_picture(nba_path, width=Inches(0.65))

p_mid = tbl_cert_hdr.cell(0, 1).paragraphs[0]
p_mid.alignment = WD_ALIGN_PARAGRAPH.CENTER
r_m = p_mid.add_run(
    "JAWAHARLAL COLLEGE OF ENGINEERING AND TECHNOLOGY\\n"
    "LAKKIDI, MANGALAM P.O, PALAKKAD, KERALA - 679301\\n"
    "OCTOBER 2026 DEPARTMENT OF COMPUTER SCIENCE AND ENGINEERING\\n"
    "(CYBER SECURITY)"
)
r_m.bold = True
r_m.font.size = Pt(9.5)

if os.path.exists(naac_path):
    tbl_cert_hdr.cell(0, 2).paragraphs[0].alignment = WD_ALIGN_PARAGRAPH.RIGHT
    tbl_cert_hdr.cell(0, 2).paragraphs[0].add_run().add_picture(naac_path, width=Inches(0.65))

# Emblem logo placed in between address and BONAFIDE CERTIFICATE
if os.path.exists(emblem_path):
    p_cert_emb = doc.add_paragraph()
    p_cert_emb.alignment = WD_ALIGN_PARAGRAPH.CENTER
    p_cert_emb.add_run().add_picture(emblem_path, width=Inches(1.0))

p_head = doc.add_paragraph()
p_head.alignment = WD_ALIGN_PARAGRAPH.CENTER
r_cert = p_head.add_run("BONAFIDE CERTIFICATE\\n")
r_cert.bold = True
r_cert.font.size = Pt(14)"""

if old_p2_head in text:
    text = text.replace(old_p2_head, new_p2_head)
    print("Page 2 header updated in docx.")

# Update date in Declaration to October
text = text.replace("Date: 26-03-2026", "Date: 26-10-2026")

with open(docx_script, "w", encoding="utf-8") as f:
    f.write(text)

print("generate_docx_report.py updated successfully!")
