# update_docx_metadata.py
import re

docx_script = r"C:\Users\USER\.gemini\antigravity\scratch\campus-events\generate_docx_report.py"

with open(docx_script, "r", encoding="utf-8") as f:
    text = f.read()

# 1. Update running header
text = text.replace(
    'OBJECT ORIENTED PROGRAMMING IN JAVA 24CSOPJT405',
    'HYBRID APP DEVELOPMENT  25CCHADT305'
)

# 2. Update cover page course code
text = text.replace(
    '(24CSOPJT405 – OBJECT ORIENTED PROGRAMMING IN JAVA)',
    '(25CCHADT305 – HYBRID APP DEVELOPMENT)'
)

# 3. Update cover page students
old_students_block = """c1 = tbl.cell(0, 0)
p1 = c1.paragraphs[0]
r_by = p1.add_run("By\\n")
r_by.bold = True
p1.add_run(
    "JCE24CD009  ADITHYAKUMAR E\\n"
    "JCE24CD039  MUHAMMED SINAN V\\n"
    "JCE24CD048  PRANAV PRAMOD NAIR\\n"
    "JCE24CD054  SEYA S"
)"""

new_students_block = """c1 = tbl.cell(0, 0)
p1 = c1.paragraphs[0]
r_by = p1.add_run("By\\n")
r_by.bold = True
r_stu = p1.add_run("JCE25CC019  ARJUN P KOLIKKAL\\n")
r_stu.bold = True"""

if old_students_block in text:
    text = text.replace(old_students_block, new_students_block)
    print("Docx cover students updated.")

# 4. Update Bonafide Certificate
text = re.sub(
    r'r_txt = p_body\.add_run\(\s*"This is to certify that the project report entitled “CAMPUS EVENTS CALENDAR” submitted by.*?\n\n\n"\s*\)',
    '''r_txt = p_body.add_run(
    "This is to certify that the project report entitled “CAMPUS EVENTS CALENDAR” submitted by "
    "ARJUN P KOLIKKAL (JCE25CC019), of B.Tech in Computer Science & Engineering - DATA SCIENCE "
    "has been successfully carried out under our supervision and guidance in partial fulfillment of the "
    "requirements for the subject 25CCHADT305 – Hybrid App Development, prescribed by "
    "Jawaharlal College of Engineering and Technology (Autonomous), affiliated to APJ Abdul Kalam "
    "Technological University, Kerala. It is further certified that this work is a bonafide record carried "
    "out by the above student during the academic year 2025–2026.\\n\\n\\n"
)''',
    text,
    flags=re.DOTALL
)

# 5. Update Declaration
text = re.sub(
    r'p_dec\.add_run\(\s*"We hereby declare that the project report CAMPUS EVENTS CALENDAR submitted for the partial fulfilment.*?\n\n"\s*\)',
    '''p_dec.add_run(
    "I hereby declare that the project report CAMPUS EVENTS CALENDAR submitted for the partial fulfilment "
    "of the requirements of the subject 25CCHADT305 – Hybrid App Development, "
    "prescribed by Jawaharlal College of Engineering and Technology (Autonomous), affiliated to APJ Abdul Kalam "
    "Technological University, Kerala is a bonafide work done by me under the guidance of Prof. Dr. R. Satheesh Kumar. "
    "The submission represents my ideas in my own words and where ideas or words of others have been included, I have "
    "adequately and accurately cited and referred the original sources. I also declare that I have adhered to ethics "
    "and integrity and have not misinterpreted or fabricated any data or idea or fact or source in my submission. I "
    "understand that any violation of the above will be a case for disciplinary action by the institution and/or the "
    "University and can also evoke penal actions from the sources which have thus not been properly cited or from whom "
    "proper permission has not been obtained. This report has not previously formed the basis for the award of any "
    "degree, diploma or similar title of any other University.\\n\\n"
)''',
    text,
    flags=re.DOTALL
)

# 6. Update Declaration Signatures
old_dec_sig = """p_dec_r.add_run(
    "ADITHYAKUMAR E\\n"
    "MUHAMMED SINAN V\\n"
    "PRANAV PRAMOD NAIR\\n"
    "SEYA S"
).bold = True"""

new_dec_sig = """p_dec_r.add_run(
    "ARJUN P KOLIKKAL\\n"
    "(JCE25CC019)"
).bold = True"""

if old_dec_sig in text:
    text = text.replace(old_dec_sig, new_dec_sig)
    print("Docx declaration signature updated.")

# 7. Update Acknowledgement Signatures
old_ack_sig = """p_ack_sig.add_run(
    "ADITHYAKUMAR E\\n"
    "MUHAMMED SINAN V\\n"
    "PRANAV PRAMOD NAIR\\n"
    "SEYA S"
).bold = True"""

new_ack_sig = """p_ack_sig.add_run(
    "ARJUN P KOLIKKAL\\n"
    "(JCE25CC019)"
).bold = True"""

if old_ack_sig in text:
    text = text.replace(old_ack_sig, new_ack_sig)
    print("Docx acknowledgement signature updated.")

with open(docx_script, "w", encoding="utf-8") as f:
    f.write(text)

print("generate_docx_report.py updated successfully!")
