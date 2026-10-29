# sync_report_deliverables.py
import os
import shutil

BASE_DIR = r"C:\Users\USER\.gemini\antigravity\scratch\campus-events"
SRC_PDF = os.path.join(BASE_DIR, "deliverables", "Campus-Events-JCET-Project-Report.pdf")
SRC_DOCX = os.path.join(BASE_DIR, "deliverables", "Campus-Events-JCET-Project-Report.docx")

destinations = [
    BASE_DIR,
    os.path.join(BASE_DIR, "website"),
    r"C:\Users\USER\Downloads"
]

for d in destinations:
    os.makedirs(d, exist_ok=True)
    dst_pdf = os.path.join(d, "Campus-Events-JCET-Project-Report.pdf")
    dst_docx = os.path.join(d, "Campus-Events-JCET-Project-Report.docx")
    shutil.copy2(SRC_PDF, dst_pdf)
    shutil.copy2(SRC_DOCX, dst_docx)
    print(f"Synced to: {d}")

print("All deliverables synchronized successfully!")
