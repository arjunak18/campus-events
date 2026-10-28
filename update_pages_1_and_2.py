# update_pages_1_and_2.py
import re

report_script = r"C:\Users\USER\.gemini\antigravity\scratch\campus-events\generate_complete_report.py"

with open(report_script, "r", encoding="utf-8") as f:
    text = f.read()

# Add b64_nba and b64_naac if not already present
if 'b64_nba =' not in text:
    text = text.replace(
        'b64_emblem = get_b64("Image20.jpg")',
        'b64_emblem = get_b64("Image20.jpg")\nb64_nba = get_b64("Image28.jpg")\nb64_naac = get_b64("Image29.jpg")'
    )

# 1. Update Page 1 content exactly matching media_1793211814216_634b4c73.png
new_p1_content = """<div style="text-align: center; margin-top: 1mm;">
    <h1 style="font-size: 15.5pt; font-weight: bold; margin: 4mm 0 4mm 0; letter-spacing: 0.5px; text-transform: uppercase;">CAMPUS EVENTS CALENDAR</h1>
    
    <h2 style="font-size: 12.5pt; font-weight: bold; margin: 0 0 2mm 0; text-transform: uppercase;">PROJECT REPORT</h2>
    <div style="font-size: 10.5pt; font-weight: bold; margin-bottom: 5mm;">(25CCHADT305 – HYBRID APP DEVELOPMENT)</div>
    
    <div style="font-size: 10.5pt; line-height: 1.45; margin: 0 auto 5mm auto; max-width: 155mm; font-style: italic;">
        Submitted to the Jawaharlal College of Engineering and Technology (Autonomous), affiliated to APJ Abdul Kalam Technological University in partial fulfilment of requirements for the award of degree
    </div>
    
    <div style="font-size: 12pt; font-weight: bold; margin-bottom: 1.5mm; text-transform: uppercase;">BACHELOR OF TECHNOLOGY</div>
    <div style="font-size: 10.5pt; margin-bottom: 1.5mm; font-style: italic;">in</div>
    <div style="font-size: 12pt; font-weight: bold; margin-bottom: 7mm; text-transform: uppercase;">COMPUTER SCIENCE AND ENGINEERING - CYBER SECURITY</div>
    
    <div style="font-size: 11pt; font-style: italic; margin-bottom: 3mm;">By</div>
    <div style="display: flex; justify-content: center; gap: 10mm; font-size: 11pt; font-weight: bold; margin-bottom: 8mm;">
        <span>JCE25CC019</span>
        <span>ARJUN P KOLIKKAL</span>
    </div>
    
    <div style="font-size: 11pt; font-style: italic; margin-bottom: 3mm;">Guided by</div>
    <div style="font-size: 12pt; font-weight: bold; margin-bottom: 8mm;">
        Prof. Dr. R. SATHEESH KUMAR
    </div>
    
    <div style="text-align: center; margin-top: 5mm;">
        <img src="{b64_emblem}" style="width: 25mm; height: auto;" />
    </div>
</div>"""

# 2. Update Page 2 content exactly matching media_1793211859035_b2d919ed.png
new_p2_content = """<div>
    <!-- Top address header block with NBA and NAAC emblems on sides -->
    <div style="display: flex; justify-content: space-between; align-items: center; margin-top: 1mm; margin-bottom: 2mm;">
        <div style="width: 16mm; text-align: left;">
            <img src="{b64_nba}" style="width: 15mm; height: auto;" />
        </div>
        <div style="text-align: center; font-size: 10.5pt; font-weight: bold; line-height: 1.35; flex: 1; padding: 0 3mm;">
            JAWAHARLAL COLLEGE OF ENGINEERING AND TECHNOLOGY<br>
            LAKKIDI, MANGALAM P.O, PALAKKAD, KERALA - 679301<br>
            OCTOBER 2026 DEPARTMENT OF COMPUTER SCIENCE AND ENGINEERING<br>
            (CYBER SECURITY)
        </div>
        <div style="width: 16mm; text-align: right;">
            <img src="{b64_naac}" style="width: 14mm; height: auto;" />
        </div>
    </div>
    
    <!-- Logo placed in between the address lines and Bonafide Certificate -->
    <div style="text-align: center; margin: 3.5mm 0 4mm 0;">
        <img src="{b64_emblem}" style="width: 25mm; height: auto;" />
    </div>
    
    <h1 style="font-size: 13.5pt; font-weight: bold; letter-spacing: 0.5px; text-align: center; margin: 0 0 5mm 0;">BONAFIDE CERTIFICATE</h1>
    
    <p class="body-text" style="text-indent: 10mm; margin-bottom: 5mm; line-height: 1.45;">
        This is to certify that the project report entitled <b>“CAMPUS EVENTS CALENDAR”</b> submitted by <b>ARJUN P KOLIKKAL (JCE25CC019)</b>, of Fourth Semester, B.Tech in Computer Science & Engineering - CYBER SECURITY has been successfully carried out under our supervision and guidance in partial fulfillment of the requirements for the subject <b>25CCHADT305 – Hybrid App Development</b>, prescribed by Jawaharlal College of Engineering and Technology (Autonomous), affiliated to APJ Abdul Kalam Technological University, Kerala. It is further certified that this work is a bonafide record carried out by the above student during the academic year <b>2025–2026</b>.
    </p>
    
    <div style="display: flex; justify-content: space-between; margin-top: 20mm; padding: 0 6mm;">
        <div style="text-align: left;">
            <div style="font-size: 10.5pt; font-weight: bold;">Dr. R. Satheesh Kumar</div>
            <div style="font-size: 9.5pt;">(Project Coordinator)</div>
        </div>
        <div style="text-align: right;">
            <div style="font-size: 10.5pt; font-weight: bold;">Dr. R. Satheesh Kumar</div>
            <div style="font-size: 9.5pt;">(Professor and HoD)</div>
        </div>
    </div>
</div>"""

# Replace p1_content and p2_content in text
p1_start = text.find('p1_content = """')
p1_end = text.find('pages_html.append(make_front_page(p1_content', p1_start)
text = text[:p1_start] + 'p1_content = """\n' + new_p1_content + '\n"""\n' + text[p1_end:]

p2_start = text.find('p2_content = """')
p2_end = text.find('pages_html.append(make_front_page(p2_content', p2_start)
text = text[:p2_start] + 'p2_content = """\n' + new_p2_content + '\n"""\n' + text[p2_end:]

# Update Page 8 date to October
text = text.replace('Date: 26-03-2026', 'Date: 26-10-2026')

with open(report_script, "w", encoding="utf-8") as f:
    f.write(text)

print("generate_complete_report.py updated with exact Page 1 & Page 2 layout!")
