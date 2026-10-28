# update_report_metadata.py
import re

report_script = r"C:\Users\USER\.gemini\antigravity\scratch\campus-events\generate_complete_report.py"

with open(report_script, "r", encoding="utf-8") as f:
    text = f.read()

# 1. Update running header
text = text.replace(
    'OBJECT ORIENTED PROGRAMMING IN JAVA 24CSOPJT405',
    'HYBRID APP DEVELOPMENT  25CCHADT305'
)

# 2. Update cover page course title & code
text = text.replace(
    '(24CSOPJT405 – OBJECT ORIENTED PROGRAMMING IN JAVA)',
    '(25CCHADT305 – HYBRID APP DEVELOPMENT)'
)

# 3. Update cover page student block
old_students_block = """        <div>
            <div style="font-size: 11pt; font-weight: bold; margin-bottom: 2mm;">By</div>
            <div style="font-size: 10.5pt; line-height: 1.5;">
                <b>JCE24CD009</b> ADITHYAKUMAR E<br>
                <b>JCE24CD039</b> MUHAMMED SINAN V<br>
                <b>JCE24CD048</b> PRANAV PRAMOD NAIR<br>
                <b>JCE24CD054</b> SEYA S
            </div>
        </div>"""

new_students_block = """        <div>
            <div style="font-size: 11pt; font-weight: bold; margin-bottom: 2mm;">By</div>
            <div style="font-size: 11.5pt; line-height: 1.6;">
                <b>JCE25CC019</b> ARJUN P KOLIKKAL
            </div>
        </div>"""

if old_students_block in text:
    text = text.replace(old_students_block, new_students_block)
    print("Cover students updated.")
else:
    print("Warning: old_students_block not matched directly.")

# 4. Update Bonafide Certificate
text = re.sub(
    r'submitted by <b>ADITHYAKUMAR E.*?during the academic year 2025–2026\.',
    'submitted by <b>ARJUN P KOLIKKAL (JCE25CC019)</b>, of B.Tech in Computer Science & Engineering - DATA SCIENCE has been successfully carried out under our supervision and guidance in partial fulfillment of the requirements for the subject <b>25CCHADT305 – Hybrid App Development</b>, prescribed by Jawaharlal College of Engineering and Technology (Autonomous), affiliated to APJ Abdul Kalam Technological University, Kerala. It is further certified that this work is a bonafide record carried out by the above student during the academic year 2025–2026.',
    text,
    flags=re.DOTALL
)

# 5. Update Declaration
text = re.sub(
    r'We hereby declare that the project report <b>CAMPUS EVENTS CALENDAR</b> submitted for the partial fulfilment of the requirements of the Fourth Semester subject <b>24CSOPJT405 – Object Oriented Programming in Java</b>.*?University\.',
    'I hereby declare that the project report <b>CAMPUS EVENTS CALENDAR</b> submitted for the partial fulfilment of the requirements of the subject <b>25CCHADT305 – Hybrid App Development</b>, prescribed by Jawaharlal College of Engineering and Technology (Autonomous), affiliated to APJ Abdul Kalam Technological University, Kerala is a bonafide work done by me under the guidance of <b>Prof. Dr. R. Satheesh Kumar</b>. The submission represents my ideas in my own words and where ideas or words of others have been included, I have adequately and accurately cited and referred the original sources. I also declare that I have adhered to ethics and integrity and have not misinterpreted or fabricated any data or idea or fact or source in my submission. I understand that any violation of the above will be a case for disciplinary action by the institution and/or the University and can also evoke penal actions from the sources which have thus not been properly cited or from whom proper permission has not been obtained. This report has not previously formed the basis for the award of any degree, diploma or similar title of any other University.',
    text,
    flags=re.DOTALL
)

# 6. Update Declaration Signatures
old_dec_sig = """        <div style="text-align: right; font-size: 10.5pt; line-height: 1.6;">
            <b>ADITHYAKUMAR E</b><br>
            <b>MUHAMMED SINAN V</b><br>
            <b>PRANAV PRAMOD NAIR</b><br>
            <b>SEYA S</b>
        </div>"""

new_dec_sig = """        <div style="text-align: right; font-size: 11pt; line-height: 1.6;">
            <b>ARJUN P KOLIKKAL</b><br>
            <b>(JCE25CC019)</b>
        </div>"""

if old_dec_sig in text:
    text = text.replace(old_dec_sig, new_dec_sig)
    print("Declaration signature updated.")

# 7. Update Acknowledgement Signatures
old_ack_sig = """        <div style="text-align: right; font-size: 10.5pt; line-height: 1.5;">
            <b>ADITHYAKUMAR E</b><br>
            <b>MUHAMMED SINAN V</b><br>
            <b>PRANAV PRAMOD NAIR</b><br>
            <b>SEYA S</b>
        </div>"""

new_ack_sig = """        <div style="text-align: right; font-size: 11pt; line-height: 1.5;">
            <b>ARJUN P KOLIKKAL</b><br>
            <b>(JCE25CC019)</b>
        </div>"""

if old_ack_sig in text:
    text = text.replace(old_ack_sig, new_ack_sig)
    print("Acknowledgement signature updated.")

with open(report_script, "w", encoding="utf-8") as f:
    f.write(text)

print("generate_complete_report.py updated successfully!")
