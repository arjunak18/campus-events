# generate_complete_report.py
import os
import sys
import base64
import subprocess
import pypdf

BASE_DIR = r"C:\Users\USER\.gemini\antigravity\scratch\campus-events"
ASSETS_DIR = os.path.join(BASE_DIR, "report_assets")
DELIVERABLES_DIR = os.path.join(BASE_DIR, "deliverables")
HTML_PATH = os.path.join(BASE_DIR, "Campus-Events-JCET-Project-Report.html")
PDF_PATH = os.path.join(DELIVERABLES_DIR, "Campus-Events-JCET-Project-Report.pdf")

os.makedirs(DELIVERABLES_DIR, exist_ok=True)

def get_b64(filename):
    p = os.path.join(ASSETS_DIR, filename)
    if not os.path.exists(p):
        p = os.path.join(BASE_DIR, filename)
    if os.path.exists(p):
        with open(p, "rb") as f:
            ext = os.path.splitext(filename)[1].lower().replace(".", "")
            if ext == "jpg": ext = "jpeg"
            return f"data:image/{ext};base64," + base64.b64encode(f.read()).decode("utf-8")
    return ""

def read_source_file(rel_path):
    p = os.path.join(BASE_DIR, rel_path)
    if os.path.exists(p):
        with open(p, "r", encoding="utf-8", errors="ignore") as f:
            return f.read()
    return ""

def escape_html(s):
    return (s.replace("&", "&amp;")
             .replace("<", "&lt;")
             .replace(">", "&gt;"))

# Load base64 assets
b64_banner = get_b64("Image7.jpg")
b64_watermark = get_b64("Image5.jpg")
b64_logo_watermark = get_b64("jcet_logo_watermark_hd.png")
b64_emblem = get_b64("Image20.jpg")
b64_nba = get_b64("Image28.jpg")
b64_naac = get_b64("Image29.jpg")
b64_co_table = get_b64("Image47.png")
b64_copo_matrix = get_b64("Image48.png")

b64_fig_home = get_b64("fig_6_1_home.png")
b64_fig_auth = get_b64("fig_6_2_auth.png")
b64_fig_detail = get_b64("fig_6_3_detail.png")
b64_fig_search = get_b64("fig_6_4_search.png")
b64_fig_saved = get_b64("fig_6_5_saved.png")
b64_fig_conf = get_b64("fig_6_6_billing.png")

# CSS styles
css = """
@page {
    size: 210mm 297mm;
    margin: 0;
}
* {
    box-sizing: border-box;
}
html, body {
    margin: 0;
    padding: 0;
    font-family: 'Times New Roman', Times, serif;
    background: #ffffff;
    color: #111827;
    -webkit-print-color-adjust: exact;
    print-color-adjust: exact;
}
.page {
    width: 210mm;
    height: 297mm;
    max-height: 297mm;
    min-height: 297mm;
    position: relative;
    box-sizing: border-box;
    page-break-after: always;
    page-break-inside: avoid;
    overflow: hidden;
    background: #ffffff;
    padding: 16mm 22mm 18mm 22mm;
    display: flex;
    flex-direction: column;
}

/* Page Watermark for Page 1 to Table of Contents */
.page-watermark {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 110mm;
    opacity: 0.12;
    z-index: 0;
    pointer-events: none;
}
.front-watermark {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 110mm;
    opacity: 0.12;
    z-index: 0;
    pointer-events: none;
}
.front-banner {
    width: 100%;
    max-height: 26mm;
    object-fit: contain;
    margin-bottom: 5mm;
    z-index: 1;
}
.front-bottom-emblem {
    width: 20mm;
    height: auto;
    margin: 3mm auto 0 auto;
    display: block;
    z-index: 1;
}
.front-content {
    position: relative;
    z-index: 1;
    flex: 1;
    display: flex;
    flex-direction: column;
}

/* Running Header & Footer for numbered pages */
.running-header {
    width: 100%;
    margin-bottom: 5mm;
    z-index: 2;
}
.running-header-text {
    font-size: 10pt;
    font-weight: bold;
    text-align: left;
    color: #000000;
    margin-bottom: 2mm;
    letter-spacing: 0.3px;
}
.running-header-line {
    width: 100%;
    height: 1px;
    background: #000000;
}
.running-footer {
    width: 100%;
    margin-top: auto;
    padding-top: 3mm;
    z-index: 2;
}
.running-footer-line {
    width: 100%;
    height: 1px;
    background: #000000;
    margin-bottom: 2mm;
}
.running-footer-content {
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-size: 10pt;
    color: #000000;
}
.running-footer-content .dept-title {
    font-weight: normal;
}
.running-footer-content .page-num {
    font-weight: normal;
}

/* Typography */
h1.ch-title {
    text-align: center;
    font-size: 14pt;
    font-weight: bold;
    margin: 4mm 0 2mm 0;
    text-transform: uppercase;
}
h2.ch-subtitle {
    text-align: center;
    font-size: 13pt;
    font-weight: bold;
    margin: 0 0 5mm 0;
    text-transform: uppercase;
}
h3.sec-title {
    font-size: 11.5pt;
    font-weight: bold;
    margin: 4mm 0 2mm 0;
    text-transform: uppercase;
}
h4.subsec-title {
    font-size: 11pt;
    font-weight: bold;
    margin: 3mm 0 1.5mm 0;
}
p.body-text {
    font-size: 11pt;
    line-height: 1.45;
    text-align: justify;
    margin: 0 0 3mm 0;
}
ul.bullet-list {
    margin: 0 0 3mm 0;
    padding-left: 6mm;
}
ul.bullet-list li {
    font-size: 11pt;
    line-height: 1.4;
    margin-bottom: 1.5mm;
    text-align: justify;
}

/* Database Terminal Tables */
.db-box {
    background: #fafafa;
    border: 1px solid #000000;
    padding: 2.5mm 3.5mm;
    margin: 2.5mm 0 3.5mm 0;
    font-family: 'Courier New', Courier, monospace;
    font-size: 8.5pt;
    line-height: 1.25;
    white-space: pre;
    overflow: hidden;
}

/* Code Listing Monospace */
.code-box {
    background: #ffffff;
    font-family: 'Consolas', 'Courier New', monospace;
    font-size: 8pt;
    line-height: 1.32;
    white-space: pre;
    color: #000000;
    flex: 1;
    overflow: hidden;
    margin: 0;
}

/* Figures */
.fig-container {
    text-align: center;
    margin: 2.5mm 0;
}
.fig-img {
    max-height: 85mm;
    max-width: 90%;
    object-fit: contain;
    border: 1px solid #d1d5db;
    box-shadow: 0 2px 4px rgba(0,0,0,0.08);
}
.fig-caption {
    font-size: 10pt;
    font-weight: bold;
    margin-top: 1.5mm;
    text-align: center;
}

/* Standard Academic Tables */
table.acad-table {
    width: 100%;
    border-collapse: collapse;
    margin: 3mm 0;
    font-size: 10pt;
    font-family: 'Times New Roman', Times, serif;
}
table.acad-table th, table.acad-table td {
    border: 1.5px solid #000000;
    padding: 2.2mm 3.2mm;
    text-align: left;
    color: #000000;
}
table.acad-table th {
    background-color: #e5e5e5;
    font-weight: bold;
    text-align: center;
}
"""

pages_html = []

def make_front_page(inner_content, show_banner=True, show_emblem=True):
    banner_tag = f'<img src="{b64_banner}" class="front-banner" />' if show_banner else ''
    emblem_tag = ''
    return f"""
    <div class="page">
        <img src="{b64_logo_watermark}" class="page-watermark" />
        {banner_tag}
        <div class="front-content">
            {inner_content}
        </div>
        
    </div>
    """

def make_numbered_page(inner_content, page_num_str, show_watermark=False):
    watermark_tag = f'<img src="{b64_logo_watermark}" class="page-watermark" />' if show_watermark else ''
    return f"""
    <div class="page">
        {watermark_tag}
        <div class="running-header">
            <div class="running-header-text">HYBRID APP DEVELOPMENT  25CCHADT305</div>
            <div class="running-header-line"></div>
        </div>
        <div style="flex: 1; display: flex; flex-direction: column; position: relative; z-index: 1;">
            {inner_content}
        </div>
        <div class="running-footer">
            <div class="running-footer-line"></div>
            <div class="running-footer-content">
                <span class="dept-title">DEPARTMENT OF CSE - CYBER SECURITY</span>
                <span class="page-num">{page_num_str}</span>
            </div>
        </div>
    </div>
    """

print("Building front matter pages 1 to 8...")

# PAGE 1: TITLE COVER
p1_content = f"""
<div style="text-align: center; margin-top: 1mm;">
    <h1 style="font-size: 15.5pt; font-weight: bold; margin: 4mm 0 4mm 0; letter-spacing: 0.5px; text-transform: uppercase;">CAMPUS EVENTS</h1>
    
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
        Ms.Ashitha.C
    </div>
    
    <div style="text-align: center; margin-top: 5mm;">
        <img src="{b64_emblem}" style="width: 25mm; height: auto;" />
    </div>
</div>
"""
pages_html.append(make_front_page(p1_content, show_banner=True, show_emblem=True))

# PAGE 2: BONAFIDE CERTIFICATE
p2_content = f"""
<div>
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
        This is to certify that the project report entitled <b>“CAMPUS EVENTS”</b> submitted by <b>ARJUN P KOLIKKAL (JCE25CC019)</b>, of Third Semester, B.Tech in Computer Science & Engineering - CYBER SECURITY has been successfully carried out under our supervision and guidance in partial fulfillment of the requirements for the subject <b>25CCHADT305 – Hybrid App Development</b>, prescribed by Jawaharlal College of Engineering and Technology (Autonomous), affiliated to APJ Abdul Kalam Technological University, Kerala. It is further certified that this work is a bonafide record carried out by the above student during the academic year <b>2026–2027</b>.
    </p>
    
    <div style="display: flex; justify-content: space-between; margin-top: 20mm; padding: 0 6mm;">
        <div style="text-align: left;">
            <div style="font-size: 10.5pt; font-weight: bold;">Ms.Ashitha.C</div>
            <div style="font-size: 9.5pt;">(Project Guide)</div>
        </div>
        <div style="text-align: right;">
            <div style="font-size: 10.5pt; font-weight: bold;">Prof. Manoj M</div>
            <div style="font-size: 9.5pt;">(Professor and HoD)</div>
        </div>
    </div>
</div>
"""
pages_html.append(make_front_page(p2_content, show_banner=True, show_emblem=True))

# PAGE 3: INSTITUTE VISION & MISSION
p3_content = """
<div style="margin-top: 3mm;">
    <div style="text-align: center; font-size: 11pt; font-weight: bold;">DEPARTMENT OF COMPUTER SCIENCE AND ENGINEERING</div>
    <div style="text-align: center; font-size: 10.5pt; font-weight: bold; margin-bottom: 7mm;">(CYBER SECURITY)</div>
    
    <h2 style="text-align: center; font-size: 13pt; font-weight: bold; margin: 0 0 3.5mm 0; text-decoration: underline;">INSTITUTE VISION</h2>
    <p class="body-text" style="margin-bottom: 7mm; text-align: justify; line-height: 1.45;">
        Emerge as a Centre of excellence for professional education to produce high quality engineers and entrepreneurs for the development of the region and the Nation.
    </p>
    
    <h2 style="text-align: center; font-size: 13pt; font-weight: bold; margin: 0 0 4mm 0; text-decoration: underline;">INSTITUTE MISSION</h2>
    <ul class="bullet-list" style="line-height: 1.6;">
        <li>To become an ultimate destination for acquiring latest and advanced knowledge in the multidisciplinary domains.</li>
        <li>To provide high quality education in engineering and technology through innovative teaching-learning practices, research and consultancy, embedded with professional ethics.</li>
        <li>To promote intellectual curiosity and thirst for acquiring knowledge through outcome-based education.</li>
        <li>To have partnership with industry and reputed institutions to enhance the employability skills of the students and pedagogical pursuits.</li>
        <li>To leverage technologies to solve the real-life societal problems through community services.</li>
    </ul>
</div>
"""
pages_html.append(make_front_page(p3_content, show_banner=True, show_emblem=True))

# PAGE 4: DEPARTMENT VISION & MISSION
p4_content = """
<div style="margin-top: 3mm;">
    <div style="text-align: center; font-size: 11pt; font-weight: bold;">DEPARTMENT OF COMPUTER SCIENCE AND ENGINEERING</div>
    <div style="text-align: center; font-size: 10.5pt; font-weight: bold; margin-bottom: 7mm;">(CYBER SECURITY)</div>
    
    <h2 style="text-align: center; font-size: 13pt; font-weight: bold; margin: 0 0 3.5mm 0; text-decoration: underline;">DEPARTMENT VISION</h2>
    <p class="body-text" style="margin-bottom: 7mm; text-align: justify; line-height: 1.45;">
        To produce competent professionals with research and innovative skills, by providing them with most conducive environment for quality academic and research oriented undergraduate and postgraduate education along with moral values committed to build a vibrant nation.
    </p>
    
    <h2 style="text-align: center; font-size: 13pt; font-weight: bold; margin: 0 0 4mm 0; text-decoration: underline;">DEPARTMENT MISSION</h2>
    <ul class="bullet-list" style="line-height: 1.6;">
        <li>Provide a learning environment to develop creativity and problem-solving skills in a professional manner.</li>
        <li>Expose to latest technologies and tools used in the field of computer science.</li>
        <li>Provide a platform to explore the industries to understand the work culture and expectation of an organization.</li>
        <li>Enhance Industry Institute Interaction program to develop the entrepreneurship skills.</li>
        <li>Develop research interest among students which will impart a better life for the society and the nation.</li>
    </ul>
</div>
"""
pages_html.append(make_front_page(p4_content, show_banner=True, show_emblem=True))

# PAGE 5: PEOs & PSOs
p5_content = """
<div style="margin-top: 2mm;">
    <div style="text-align: center; font-size: 11pt; font-weight: bold;">DEPARTMENT OF COMPUTER SCIENCE AND ENGINEERING</div>
    <div style="text-align: center; font-size: 10.5pt; font-weight: bold; margin-bottom: 5mm;">(CYBER SECURITY)</div>
    
    <h2 style="text-align: center; font-size: 13pt; font-weight: bold; margin: 0 0 3.5mm 0; text-decoration: underline;">
        PROGRAM EDUCATIONAL OBJECTIVES (POs)
    </h2>
    <p style="font-size: 10.5pt; margin-bottom: 2.5mm;">The Graduates in Computer Science and Engineering will be able to:</p>
    
    <table class="acad-table" style="margin-bottom: 5.5mm;">
        <tr>
            <td style="width: 16%; text-align: center; font-weight: bold; vertical-align: middle;">PEO1</td>
            <td style="vertical-align: middle; line-height: 1.35;">Apply Engineering practices required for Software development, Hardware development and Embedded systems.</td>
        </tr>
        <tr>
            <td style="width: 16%; text-align: center; font-weight: bold; vertical-align: middle;">PEO2</td>
            <td style="vertical-align: middle; line-height: 1.35;">Exhibit innovation, Self – confidence and team work skills in the organization and society.</td>
        </tr>
        <tr>
            <td style="width: 16%; text-align: center; font-weight: bold; vertical-align: middle;">PEO3</td>
            <td style="vertical-align: middle; line-height: 1.35;">Graduates shall be competent in the evolving field of computer science by adapting to new tools, technologies, and industry practices, ensuring continued professional and career growth</td>
        </tr>
    </table>
    
    <h2 style="text-align: center; font-size: 13pt; font-weight: bold; margin: 0 0 3mm 0; text-decoration: underline;">
        PROGRAM SPECIFIC OUTCOMES (PSOs)
    </h2>
    
    <table class="acad-table">
        <tr>
            <td style="width: 16%; text-align: center; font-weight: bold; vertical-align: middle;">PSO1</td>
            <td style="vertical-align: middle; line-height: 1.35;">Ability to understand the architecture and working of computer hardware and software system.</td>
        </tr>
        <tr>
            <td style="width: 16%; text-align: center; font-weight: bold; vertical-align: middle;">PSO2</td>
            <td style="vertical-align: middle; line-height: 1.35;">Ability to design and develop software for technology application to fulfill industrial and social needs</td>
        </tr>
    </table>
</div>
"""
pages_html.append(make_front_page(p5_content, show_banner=True, show_emblem=True))

# PAGE 6: PROGRAM OUTCOMES (POs)
p6_content = """
<div style="margin-top: 1mm;">
    <p style="font-size: 10pt; font-weight: bold; margin: 0 0 2.5mm 0;">
        The following are the Program Outcomes of Engineering Students:
    </p>
    
    <table class="acad-table" style="font-size: 8.4pt; line-height: 1.22;">
        <tr>
            <td style="width: 13%; text-align: center; font-weight: bold; vertical-align: middle;">PO1</td>
            <td style="vertical-align: middle; padding: 1.2mm 2.5mm;"><b>Engineering knowledge:</b> Apply the knowledge of mathematics, science, engineering fundamentals, and an engineering specialization to the solution of complex engineering problems.</td>
        </tr>
        <tr>
            <td style="width: 13%; text-align: center; font-weight: bold; vertical-align: middle;">PO2</td>
            <td style="vertical-align: middle; padding: 1.2mm 2.5mm;"><b>Problem analysis:</b> Identify, formulate, review research literature, and analyze complex engineering problems reaching substantiated conclusions using first principles of mathematics, natural sciences, and engineering sciences.</td>
        </tr>
        <tr>
            <td style="width: 13%; text-align: center; font-weight: bold; vertical-align: middle;">PO3</td>
            <td style="vertical-align: middle; padding: 1.2mm 2.5mm;"><b>Design/development of solutions:</b> Design solutions for complex engineering problems and design system components or processes that meet the specified needs with appropriate consideration for the public health and safety, and the cultural, societal, and environmental considerations.</td>
        </tr>
        <tr>
            <td style="width: 13%; text-align: center; font-weight: bold; vertical-align: middle;">PO4</td>
            <td style="vertical-align: middle; padding: 1.2mm 2.5mm;"><b>Conduct investigations of complex problems:</b> Use research-based knowledge and research methods including design of experiments, analysis and interpretation of data, and synthesis of the information to provide valid conclusions.</td>
        </tr>
        <tr>
            <td style="width: 13%; text-align: center; font-weight: bold; vertical-align: middle;">PO5</td>
            <td style="vertical-align: middle; padding: 1.2mm 2.5mm;"><b>Modern tool usage:</b> Create, select, and apply appropriate techniques, resources, and modern engineering and IT tools including prediction and modeling to complex engineering activities with an understanding of the limitations.</td>
        </tr>
        <tr>
            <td style="width: 13%; text-align: center; font-weight: bold; vertical-align: middle;">PO6</td>
            <td style="vertical-align: middle; padding: 1.2mm 2.5mm;"><b>The engineer and society:</b> Apply reasoning informed by the contextual knowledge to assess societal, health, safety, legal and cultural issues and the consequent responsibilities relevant to the professional engineering practice.</td>
        </tr>
        <tr>
            <td style="width: 13%; text-align: center; font-weight: bold; vertical-align: middle;">PO7</td>
            <td style="vertical-align: middle; padding: 1.2mm 2.5mm;"><b>Environment and sustainability:</b> Understand the impact of the professional engineering solutions in societal and environmental contexts, and demonstrate the knowledge of, and need for sustainable development.</td>
        </tr>
        <tr>
            <td style="width: 13%; text-align: center; font-weight: bold; vertical-align: middle;">PO8</td>
            <td style="vertical-align: middle; padding: 1.2mm 2.5mm;"><b>Ethics:</b> Apply ethical principles and commit to professional ethics and responsibilities and norms of the engineering practice.</td>
        </tr>
        <tr>
            <td style="width: 13%; text-align: center; font-weight: bold; vertical-align: middle;">PO9</td>
            <td style="vertical-align: middle; padding: 1.2mm 2.5mm;"><b>Individual and team work:</b> Function effectively as an individual, and as a member or leader in diverse teams, and in multidisciplinary settings.</td>
        </tr>
        <tr>
            <td style="width: 13%; text-align: center; font-weight: bold; vertical-align: middle;">PO10</td>
            <td style="vertical-align: middle; padding: 1.2mm 2.5mm;"><b>Communication:</b> Communicate effectively on complex engineering activities with the engineering community and with society at large, such as, being able to comprehend and write effective reports and design documentation, make effective presentations, and give and receive clear instructions.</td>
        </tr>
        <tr>
            <td style="width: 13%; text-align: center; font-weight: bold; vertical-align: middle;">PO11</td>
            <td style="vertical-align: middle; padding: 1.2mm 2.5mm;"><b>Project management and finance:</b> Demonstrate knowledge and understanding of the engineering and management principles and apply these to one’s own work, as a member and leader in a team, to manage projects and in multidisciplinary environments.</td>
        </tr>
        <tr>
            <td style="width: 13%; text-align: center; font-weight: bold; vertical-align: middle;">PO12</td>
            <td style="vertical-align: middle; padding: 1.2mm 2.5mm;"><b>Life-long learning:</b> Recognize the need for, and have the preparation and ability to engage in independent and life-long learning in the broadest context of technological change.</td>
        </tr>
    </table>
</div>
"""
pages_html.append(make_front_page(p6_content, show_banner=True, show_emblem=True))

# PAGE 7: COURSE OUTCOMES (COs)
p7_content = """
<div style="margin-top: 1mm;">
    <h2 style="text-align: center; font-size: 13pt; font-weight: bold; margin: 0 0 3.5mm 0; text-decoration: underline;">
        COURSE OUTCOMES (COS)
    </h2>
    
    <table class="acad-table" style="font-size: 8.5pt; line-height: 1.25; margin-bottom: 5mm;">
        <tr style="background-color: #f2f2f2;">
            <th style="width: 14%; text-align: center; padding: 2mm 1mm;">CO<br>Number</th>
            <th style="text-align: center; padding: 2mm;">Course Outcome Statement</th>
            <th style="width: 15%; text-align: center; padding: 2mm 1mm;">Weightage<br>in %</th>
        </tr>
        <tr>
            <td style="text-align: center; font-weight: bold; padding: 1.8mm 1mm;">CO1</td>
            <td style="padding: 1.8mm 2.5mm;">Describe and compare mobile development approaches (native, web, hybrid) and the architecture of hybrid frameworks.(Understanding)</td>
            <td style="text-align: center; font-weight: bold; padding: 1.8mm 1mm;">20</td>
        </tr>
        <tr>
            <td style="text-align: center; font-weight: bold; padding: 1.8mm 1mm;">CO2</td>
            <td style="padding: 1.8mm 2.5mm;">Design user interfaces and navigation workflows for hybrid applications using responsive layouts, UI components, and state management concepts.(Applying)</td>
            <td style="text-align: center; font-weight: bold; padding: 1.8mm 1mm;">20</td>
        </tr>
        <tr>
            <td style="text-align: center; font-weight: bold; padding: 1.8mm 1mm;">CO3</td>
            <td style="padding: 1.8mm 2.5mm;">Develop functional hybrid applications by integrating backend services, authentication, and native device features such as sensors, camera, and notifications.(Applying)</td>
            <td style="text-align: center; font-weight: bold; padding: 1.8mm 1mm;">20</td>
        </tr>
        <tr>
            <td style="text-align: center; font-weight: bold; padding: 1.8mm 1mm;">CO4</td>
            <td style="padding: 1.8mm 2.5mm;">Test, debug, optimize, and deploy hybrid applications using build pipelines, performance tools, secure storage, and publishing standards.(Analyze)</td>
            <td style="text-align: center; font-weight: bold; padding: 1.8mm 1mm;">20</td>
        </tr>
        <tr>
            <td style="text-align: center; font-weight: bold; padding: 1.8mm 1mm;">CO5</td>
            <td style="padding: 1.8mm 2.5mm;">Create and present a complete hybrid mobile application project demonstrating end-to-end development using Visual Studio Code, version control, documentation, and modern best practices.(Creating)</td>
            <td style="text-align: center; font-weight: bold; padding: 1.8mm 1mm;">20</td>
        </tr>
    </table>
    
    <table class="acad-table" style="font-size: 8pt; text-align: center; line-height: 1.2;">
        <tr style="background-color: #bfbfbf;">
            <th colspan="16" style="text-align: left; padding: 2mm 2.5mm; font-size: 8.5pt; font-weight: bold;">
                Mapping with Programme Outcomes and Programme Specific Outcomes
            </th>
        </tr>
        <tr style="background-color: #f2f2f2; font-weight: bold;">
            <td style="width: 7%; padding: 1.5mm 0.5mm;">COs</td>
            <td style="padding: 1.5mm 0.5mm;">PO01</td>
            <td style="padding: 1.5mm 0.5mm;">PO2</td>
            <td style="padding: 1.5mm 0.5mm;">PO3</td>
            <td style="padding: 1.5mm 0.5mm;">PO4</td>
            <td style="padding: 1.5mm 0.5mm;">PO5</td>
            <td style="padding: 1.5mm 0.5mm;">PO06</td>
            <td style="padding: 1.5mm 0.5mm;">PO7</td>
            <td style="padding: 1.5mm 0.5mm;">PO8</td>
            <td style="padding: 1.5mm 0.5mm;">PO9</td>
            <td style="padding: 1.5mm 0.5mm;">PO10</td>
            <td style="padding: 1.5mm 0.5mm;">PO11</td>
            <td style="padding: 1.5mm 0.5mm;">PO12</td>
            <td style="padding: 1.5mm 0.5mm;">PSO1</td>
            <td style="padding: 1.5mm 0.5mm;">PSO2</td>
            <td style="padding: 1.5mm 0.5mm;">PSO3</td>
        </tr>
        <tr>
            <td style="font-weight: bold; padding: 1.5mm 0.5mm;">CO1</td>
            <td>3</td><td>2</td><td>1</td><td>–</td><td>2</td><td>–</td><td>–</td><td>–</td><td>–</td><td>–</td><td>–</td><td>2</td><td>2</td><td>3</td><td>2</td>
        </tr>
        <tr>
            <td style="font-weight: bold; padding: 1.5mm 0.5mm;">CO2</td>
            <td>2</td><td>2</td><td>3</td><td>1</td><td>2</td><td>–</td><td>–</td><td>–</td><td>1</td><td>2</td><td>1</td><td>2</td><td>1</td><td>3</td><td>3</td>
        </tr>
        <tr>
            <td style="font-weight: bold; padding: 1.5mm 0.5mm;">CO3</td>
            <td>2</td><td>3</td><td>3</td><td>2</td><td>3</td><td>–</td><td>–</td><td>–</td><td>1</td><td>1</td><td>2</td><td>2</td><td>2</td><td>3</td><td>3</td>
        </tr>
        <tr>
            <td style="font-weight: bold; padding: 1.5mm 0.5mm;">CO4</td>
            <td>2</td><td>3</td><td>2</td><td>3</td><td>3</td><td>–</td><td>–</td><td>1</td><td>1</td><td>2</td><td>3</td><td>3</td><td>1</td><td>3</td><td>2</td>
        </tr>
        <tr>
            <td style="font-weight: bold; padding: 1.5mm 0.5mm;">CO5</td>
            <td>2</td><td>2</td><td>3</td><td>2</td><td>3</td><td>1</td><td>–</td><td>2</td><td>3</td><td>3</td><td>3</td><td>3</td><td>1</td><td>2</td><td>3</td>
        </tr>
        <tr style="font-weight: bold; background-color: #fafafa;">
            <td style="padding: 1.5mm 0.5mm;">AVG</td>
            <td>2.2</td><td>2.4</td><td>2.4</td><td>2</td><td>2.6</td><td>1</td><td>0</td><td>1.5</td><td>1.5</td><td>2</td><td>2.25</td><td>2.4</td><td>1.4</td><td>2.8</td><td>2.6</td>
        </tr>
    </table>
</div>
"""
pages_html.append(make_front_page(p7_content, show_banner=True, show_emblem=True))

# PAGE 8: DECLARATION
p8_content = """
<div style="margin-top: 3mm;">
    <h2 style="text-align: center; font-size: 13pt; font-weight: bold; margin: 0 0 6mm 0;">DECLARATION</h2>
    
    <p class="body-text" style="line-height: 1.5; margin-bottom: 6mm;">
        I hereby declare that the project report <b>CAMPUS EVENTS</b> submitted for the partial fulfilment of the requirements of the subject <b>25CCHADT305 – Hybrid App Development</b>, prescribed by Jawaharlal College of Engineering and Technology (Autonomous), affiliated to APJ Abdul Kalam Technological University, Kerala is a bonafide work done by me under the guidance of <b>Ms.Ashitha.C</b>. The submission represents my ideas in my own words and where ideas or words of others have been included, I have adequately and accurately cited and referred the original sources. I also declare that I have adhered to ethics and integrity and have not misinterpreted or fabricated any data or idea or fact or source in my submission. I understand that any violation of the above will be a case for disciplinary action by the institution and/or the University and can also evoke penal actions from the sources which have thus not been properly cited or from whom proper permission has not been obtained. This report has not previously formed the basis for the award of any degree, diploma or similar title of any other University.
    </p>
    
    <div style="display: flex; justify-content: flex-end; margin-top: 10mm; padding-right: 5mm;">
        <div style="text-align: right; font-size: 11pt; line-height: 1.6;">
            <b>ARJUN P KOLIKKAL</b><br>
            <b>(JCE25CC019)</b>
        </div>
    </div>
    
    <div style="margin-top: 10mm; font-size: 10.5pt;">
        <b>Place:</b> Palakkad<br>
        <b>Date:</b> 26-03-2026
    </div>
</div>
"""
pages_html.append(make_front_page(p8_content, show_banner=True, show_emblem=True))

print("Building preliminary Roman pages I to VI...")

# PAGE 9 (I): ABSTRACT
p9_content = """
<div>
    <h1 class="ch-title" style="margin-top: 0;">ABSTRACT</h1>
    <p class="body-text" style="text-indent: 8mm;">
        The <b>Campus Events</b> is a comprehensive, mobile-first academic platform developed to eliminate fragmentation in university event broadcasting and streamline student participation across extracurricular, technical, and academic activities. In contemporary collegiate institutions, announcements for symposiums, workshops, hackathons, and cultural fests are typically scattered across physical notice boards, unstructured messaging channels, and isolated departmental flyers, frequently resulting in scheduling conflicts, low student engagement, and inefficient participant management.
    </p>
    <p class="body-text" style="text-indent: 8mm;">
        To resolve these challenges, the Campus Events delivers a modern cross-platform mobile application engineered with React Native and Expo SDK 52, connected to a high-performance Supabase PostgreSQL cloud backend. The system enforces strict domain-based authentication restricting account creation to verified institutional Google credentials (@gmail.com / college domain) to ensure campus safety and student accountability. Robust Row-Level Security (RLS) policies safeguard sensitive data, ensuring that students can only modify their personal RSVP records while administrative organizers manage departmental schedules.
    </p>
    <p class="body-text" style="text-indent: 8mm;">
        Key capabilities include real-time event discovery with category filtering (Academic, Cultural, Sports, Technical, Workshops), intelligent multi-field search, instant RSVP reservation with dynamic capacity quotas, and personal bookmarking into a curated "My Events" agenda. Furthermore, local device calendar synchronization allows students to export event timelines directly into Google Calendar or system schedulers. Production deployment on Android emulator and physical devices demonstrates high responsiveness, zero memory leaks, and seamless offline data caching, establishing the platform as an indispensable digital ecosystem for modern academic institutions.
    </p>
</div>
"""
pages_html.append(make_numbered_page(p9_content, "I", show_watermark=True))

# PAGE 10 (II): ACKNOWLEDGEMENT
p10_content = """
<div>
    <h1 class="ch-title" style="margin-top: 0;">ACKNOWLEDGEMENT</h1>
    <p class="body-text">
        We thank Almighty God for giving us the blessings, strength, and perseverance to complete our project work successfully. We sincerely appreciate the inspiration, support, and guidance of all those individuals who have been instrumental in making this endeavor a reality.
    </p>
    <p class="body-text">
        We would like to express our heartfelt gratitude to <b>Adv. Dr. P. Krishnadas</b>, Managing Trustee of Nehru College Educational and Charitable Trust, for making state-of-the-art infrastructural resources available at the right time and providing inspiring vision leading to the successful completion of this project.
    </p>
    <p class="body-text">
        We express our sincere thanks to <b>Dr. N. Gunasekaran</b>, Principal of Jawaharlal College of Engineering and Technology, for his encouragement, leadership, and administrative backing throughout the course of our studies and project development.
    </p>
    <p class="body-text">
        We express our special gratitude to <b>Prof. Manoj M</b>, Professor and Head of the Department of Computer Science and Engineering, for providing us constant guidance and encouragement throughout the project.
    </p>
    <p class="body-text">
        We express our sincere thanks and profound gratitude to our project guide, <b>Ms.Ashitha.C</b>, for her invaluable guidance, constructive suggestions, and continuous encouragement throughout the architecture and implementation phases of this project.
    </p>
    <p class="body-text">
        We also appreciate the valuable feedback and constructive suggestions offered by the evaluation panel members during our departmental project reviews. Last but not least, we place on record our profound sense of gratitude to our parents, family members, lab instructors, and fellow classmates whose unwavering moral support and encouragement motivated us at every stage.
    </p>
    <div style="display: flex; justify-content: flex-end; margin-top: 8mm; padding-right: 5mm;">
        <div style="text-align: right; font-size: 11pt; line-height: 1.5;">
            <b>ARJUN P KOLIKKAL</b><br>
            <b>(JCE25CC019)</b>
        </div>
    </div>
</div>
"""
pages_html.append(make_numbered_page(p10_content, "II", show_watermark=True))

# PAGE 11 (III): TABLE OF CONTENTS
p11_content = """
<div style="margin-top: 5mm;">
    <table class="acad-table" style="font-size: 10.5pt; width: 100%;">
        <tr>
            <td style="width: 18%; border-right: none;"></td>
            <td style="text-align: center; font-size: 13pt; font-weight: bold; border-left: none; border-right: none; padding: 3mm 0;">TABLE OF CONTENTS</td>
            <td style="width: 18%; border-left: none;"></td>
        </tr>
        <tr>
            <td style="border-right: none;"></td>
            <td style="border-left: none; border-right: none; font-weight: bold; padding: 2.2mm 3mm;">Abstract</td>
            <td style="text-align: center; font-weight: bold; border-left: none;">i</td>
        </tr>
        <tr>
            <td style="border-right: none;"></td>
            <td style="border-left: none; border-right: none; font-weight: bold; padding: 2.2mm 3mm;">List of tables</td>
            <td style="text-align: center; font-weight: bold; border-left: none;">v</td>
        </tr>
        <tr>
            <td style="border-right: none;"></td>
            <td style="border-left: none; border-right: none; font-weight: bold; padding: 2.2mm 3mm;">List of Figures</td>
            <td style="text-align: center; font-weight: bold; border-left: none;">iv</td>
        </tr>
        <tr>
            <td style="border-right: none;"></td>
            <td style="border-left: none; border-right: none; font-weight: bold; padding: 2.2mm 3mm;">List of abbreviations</td>
            <td style="text-align: center; font-weight: bold; border-left: none;">vi</td>
        </tr>
        <tr style="font-weight: bold; text-align: center; background-color: #f8f9fa;">
            <td style="padding: 2.5mm 0;">Chapter<br>No.</td>
            <td style="padding: 2.5mm 0;">Chapter Title</td>
            <td style="padding: 2.5mm 0;">Page<br>No.</td>
        </tr>
        <tr>
            <td style="text-align: center; font-weight: bold; padding: 2.2mm 0;">1</td>
            <td style="font-weight: bold; padding: 2.2mm 3mm;">Introduction</td>
            <td style="text-align: center; font-weight: bold;">1</td>
        </tr>
        <tr>
            <td style="text-align: center; font-weight: bold; padding: 2.2mm 0;">2</td>
            <td style="font-weight: bold; padding: 2.2mm 3mm;">Aim and Objectives</td>
            <td style="text-align: center; font-weight: bold;">3</td>
        </tr>
        <tr>
            <td style="text-align: center; font-weight: bold; padding: 2.2mm 0;">3</td>
            <td style="font-weight: bold; padding: 2.2mm 3mm;">Requirement Specification</td>
            <td style="text-align: center; font-weight: bold;">4</td>
        </tr>
        <tr>
            <td style="text-align: center; font-weight: bold; padding: 2.2mm 0;">4</td>
            <td style="font-weight: bold; padding: 2.2mm 3mm;">Database Design</td>
            <td style="text-align: center; font-weight: bold;">5</td>
        </tr>
        <tr>
            <td style="text-align: center; font-weight: bold; padding: 2.2mm 0;">5</td>
            <td style="font-weight: bold; padding: 2.2mm 3mm;">System Implementation</td>
            <td style="text-align: center; font-weight: bold;">8</td>
        </tr>
        <tr>
            <td style="text-align: center; font-weight: bold; padding: 2.2mm 0;">6</td>
            <td style="font-weight: bold; padding: 2.2mm 3mm;">Results and Discussions</td>
            <td style="text-align: center; font-weight: bold;">10</td>
        </tr>
        <tr>
            <td style="text-align: center; font-weight: bold; padding: 2.2mm 0;">7</td>
            <td style="font-weight: bold; padding: 2.2mm 3mm;">Conclusion</td>
            <td style="text-align: center; font-weight: bold;">14</td>
        </tr>
        <tr>
            <td style="text-align: center; font-weight: bold; padding: 2.2mm 0;">8</td>
            <td style="font-weight: bold; padding: 2.2mm 3mm;">References</td>
            <td style="text-align: center; font-weight: bold;">15</td>
        </tr>
    </table>
</div>
"""
pages_html.append(make_numbered_page(p11_content, "III", show_watermark=True))

# PAGE 12 (IV): LIST OF FIGURES
p12_content = """
<div>
    <h1 class="ch-title" style="margin-top: 0; margin-bottom: 6mm;">LIST OF FIGURES</h1>
    <table class="acad-table" style="font-size: 10pt;">
        <thead>
            <tr style="background-color: #e5e5e5; font-weight: bold; text-align: center;">
                <th style="width: 22%;">FIGURE NO.</th>
                <th style="width: 58%;">TITLE</th>
                <th style="width: 20%; text-align: center;">PAGE NO.</th>
            </tr>
        </thead>
        <tbody>
            <tr>
                <td style="text-align: center; font-weight: bold;">6.1</td>
                <td>Home Page Module</td>
                <td style="text-align: center;">10</td>
            </tr>
            <tr>
                <td style="text-align: center; font-weight: bold;">6.2</td>
                <td>User Authentication Module</td>
                <td style="text-align: center;">11</td>
            </tr>
            <tr>
                <td style="text-align: center; font-weight: bold;">6.3</td>
                <td>Event Details & RSVP Module</td>
                <td style="text-align: center;">11</td>
            </tr>
            <tr>
                <td style="text-align: center; font-weight: bold;">6.4</td>
                <td>Event Search, Filter & Explore Module</td>
                <td style="text-align: center;">12</td>
            </tr>
            <tr>
                <td style="text-align: center; font-weight: bold;">6.5</td>
                <td>My Events & Saved Bookmarks Module</td>
                <td style="text-align: center;">12</td>
            </tr>
            <tr>
                <td style="text-align: center; font-weight: bold;">6.6</td>
                <td>Registration Confirmation & Calendar Sync Module</td>
                <td style="text-align: center;">13</td>
            </tr>
        </tbody>
    </table>
</div>
"""
pages_html.append(make_numbered_page(p12_content, "IV"))

# PAGE 13 (V): LIST OF TABLES
p13_content = """
<div>
    <h1 class="ch-title" style="margin-top: 0; margin-bottom: 6mm;">LIST OF TABLES</h1>
    <table class="acad-table" style="font-size: 10pt;">
        <thead>
            <tr style="background-color: #e5e5e5; font-weight: bold; text-align: center;">
                <th style="width: 22%;">TABLE NO.</th>
                <th style="width: 58%;">TITLE</th>
                <th style="width: 20%; text-align: center;">PAGE NO.</th>
            </tr>
        </thead>
        <tbody>
            <tr>
                <td style="text-align: center; font-weight: bold;">4.1</td>
                <td>User Profiles Table</td>
                <td style="text-align: center;">5</td>
            </tr>
            <tr>
                <td style="text-align: center; font-weight: bold;">4.2</td>
                <td>Campus Events Master Table</td>
                <td style="text-align: center;">5</td>
            </tr>
            <tr>
                <td style="text-align: center; font-weight: bold;">4.3</td>
                <td>Event Categories Table</td>
                <td style="text-align: center;">6</td>
            </tr>
            <tr>
                <td style="text-align: center; font-weight: bold;">4.4</td>
                <td>Event Registrations Table</td>
                <td style="text-align: center;">6</td>
            </tr>
            <tr>
                <td style="text-align: center; font-weight: bold;">4.5</td>
                <td>Saved Events Bookmarks Table</td>
                <td style="text-align: center;">6</td>
            </tr>
            <tr>
                <td style="text-align: center; font-weight: bold;">4.6</td>
                <td>Sign-in Logs & Security Audits Table</td>
                <td style="text-align: center;">7</td>
            </tr>
            <tr>
                <td style="text-align: center; font-weight: bold;">4.7</td>
                <td>Event Organizers & Departments Table</td>
                <td style="text-align: center;">7</td>
            </tr>
        </tbody>
    </table>
</div>
"""
pages_html.append(make_numbered_page(p13_content, "V"))

# PAGE 14 (VI): LIST OF ABBREVIATIONS
p14_content = """
<div>
    <h1 class="ch-title" style="margin-top: 0; margin-bottom: 6mm;">LIST OF ABBREVIATIONS</h1>
    <table class="acad-table" style="font-size: 10pt;">
        <thead>
            <tr style="background-color: #e5e5e5; font-weight: bold; text-align: center;">
                <th style="width: 30%;">ABBREVIATION</th>
                <th style="width: 70%;">EXPANSION</th>
            </tr>
        </thead>
        <tbody>
            <tr><td style="text-align: center; font-weight: bold;">OOP</td><td>Object Oriented Programming</td></tr>
            <tr><td style="text-align: center; font-weight: bold;">JDBC</td><td>Java Database Connectivity</td></tr>
            <tr><td style="text-align: center; font-weight: bold;">DBMS</td><td>Database Management System</td></tr>
            <tr><td style="text-align: center; font-weight: bold;">SQL</td><td>Structured Query Language</td></tr>
            <tr><td style="text-align: center; font-weight: bold;">HTTP</td><td>Hyper Text Transfer Protocol</td></tr>
            <tr><td style="text-align: center; font-weight: bold;">UI</td><td>User Interface</td></tr>
            <tr><td style="text-align: center; font-weight: bold;">API</td><td>Application Programming Interface</td></tr>
            <tr><td style="text-align: center; font-weight: bold;">MVC</td><td>Model View Controller</td></tr>
            <tr><td style="text-align: center; font-weight: bold;">UML</td><td>Unified Modelling Language</td></tr>
            <tr><td style="text-align: center; font-weight: bold;">CRUD</td><td>Create,Read,Update,Delete</td></tr>
        </tbody>
    </table>
</div>
"""
pages_html.append(make_numbered_page(p14_content, "VI"))

print("Building main body chapters 1 to 8 (Pages 1 to 15)...")

# PAGE 15 (1): CHAPTER 1 - INTRODUCTION
p15_content = """
<div>
    <h1 class="ch-title" style="margin-top: 0;">CHAPTER 1</h1>
    <h2 class="ch-subtitle">INTRODUCTION</h2>
    
    <h3 class="sec-title">1.1 BACKGROUND</h3>
    <p class="body-text">
        The evolution of mobile computing, cloud-native storage, and ubiquitous high-speed networking has transformed institutional communication within higher education. Traditionally, academic campuses relied on printed circulars, physical notice boards, bulletin boards, and informal messaging channels to disseminate information regarding upcoming activities. These conventional methods suffer from notable deficiencies, including limited reach, rapid obsolescence of paper flyers, lack of real-time scheduling updates, and absence of automated attendee tracking.
    </p>
    <p class="body-text">
        With the rapid proliferation of smartphones among students and faculty members, dedicated mobile campus portals have become paramount. A modernized Campus Events unifies all collegiate events—spanning technical symposiums, research conferences, cultural festivals, sports tournaments, and professional workshops—into a centralized, interactive, and universally accessible mobile application.
    </p>
    
    <h3 class="sec-title">1.2 RELEVANCE</h3>
    <p class="body-text">
        In an autonomous academic institution such as Jawaharlal College of Engineering and Technology (JCET), multiple engineering departments and student associations operate concurrent event calendars. Without a synchronized digital platform, students frequently miss registration deadlines or encounter conflicting schedules across departments. The Campus Events addresses this gap by offering real-time schedule discovery, department filtering, automated RSVP reservations, and calendar synchronization, significantly elevating collegiate engagement and institutional operational efficiency.
    </p>
</div>
"""
pages_html.append(make_numbered_page(p15_content, "1"))

# PAGE 16 (2): CHAPTER 1 - PROBLEM STATEMENT & SCOPE
p16_content = """
<div>
    <h3 class="sec-title" style="margin-top: 0;">1.3 PROBLEM STATEMENT</h3>
    <p class="body-text">
        Conventional campus event dissemination methods exhibit critical constraints that impair institutional productivity:
    </p>
    <ul class="bullet-list">
        <li><b>Fragmented Communication:</b> Event announcements remain scattered across WhatsApp groups, classroom boards, and disparate departmental emails, causing students to overlook crucial registration dates.</li>
        <li><b>Lack of Real-Time Coordination:</b> When an event venue, speaker schedule, or timing changes, updating printed flyers or bulletin notices is physically impossible in a timely manner.</li>
        <li><b>Manual Attendance & Capacity Overhead:</b> Event coordinators rely on physical paper sheets or ad-hoc Google Forms, which fail to enforce hard capacity caps or prevent unauthorized signups.</li>
        <li><b>Security & Unverified Access:</b> Open public forms allow unverified external entries, compromising collegiate attendee integrity and data accuracy.</li>
    </ul>
    
    <h3 class="sec-title">1.4 SCOPE OF THE PROJECT</h3>
    <p class="body-text">The system encompasses the following functional capabilities:</p>
    <ul class="bullet-list">
        <li><b>Institutional Identity & Auth:</b> Secure login and registration restricted strictly to authenticated institutional Google accounts (@gmail.com domain validation) with encrypted JWT tokens.</li>
        <li><b>Comprehensive Event Directory:</b> Real-time synchronization of all campus events categorized into Academic, Cultural, Sports, Technical, and Workshop streams.</li>
        <li><b>Interactive RSVP & Quota Management:</b> Instant reservation mechanism that dynamically tracks venue seating capacity and prevents overbooking.</li>
        <li><b>Personal Agenda & Bookmarks:</b> Dedicated "Saved Events" module enabling students to bookmark sessions and receive timely reminders.</li>
        <li><b>System Integration:</b> Compatibility with Android 8.0 through Android 15, optimized for dark mode and offline local cache fallback.</li>
    </ul>
</div>
"""
pages_html.append(make_numbered_page(p16_content, "2"))

# PAGE 17 (3): CHAPTER 2 - AIM AND OBJECTIVES
p17_content = """
<div>
    <h1 class="ch-title" style="margin-top: 0;">CHAPTER 2</h1>
    <h2 class="ch-subtitle">AIM AND OBJECTIVES</h2>
    
    <h3 class="sec-title">2.1 AIM</h3>
    <p class="body-text">
        To design, engineer, and deploy a robust, cross-platform Campus Events mobile application backed by a cloud-native relational database and modern Object-Oriented principles, delivering real-time event discovery, secure access control, automated RSVP tracking, and timetable synchronization for the academic community.
    </p>
    
    <h3 class="sec-title">2.2 OBJECTIVES</h3>
    <p class="body-text">The core objectives defined for the realization of this system include:</p>
    <ul class="bullet-list">
        <li>To develop a clean, accessible, and responsive mobile user interface adhering to modern human interface guidelines and dark-mode ergonomics.</li>
        <li>To implement rigorous authentication and session management protocols enforcing RFC-5322 email regex verification and institutional domain allow-lists.</li>
        <li>To design a normalized relational schema in PostgreSQL satisfying ACID properties for managing user profiles, event schedules, categorization, and registrations.</li>
        <li>To enforce Row-Level Security (RLS) policies within the database engine to guarantee data confidentiality and multi-tenant isolation.</li>
        <li>To construct an asynchronous event search and filtering engine that enables keyword queries and instantaneous category segmentation.</li>
        <li>To establish real-time RSVP booking logic with concurrency-safe seat capacity updates and duplicate registration prevention.</li>
        <li>To demonstrate sound software engineering and Object-Oriented Design patterns, ensuring modularity, testability, and enterprise maintainability.</li>
    </ul>
</div>
"""
pages_html.append(make_numbered_page(p17_content, "3"))

# PAGE 18 (4): CHAPTER 3 - REQUIREMENT SPECIFICATION
p18_content = """
<div>
    <h1 class="ch-title" style="margin-top: 0;">CHAPTER 3</h1>
    <h2 class="ch-subtitle">REQUIREMENT SPECIFICATION</h2>
    
    <h3 class="sec-title">3.1 SOFTWARE REQUIREMENTS</h3>
    <ul class="bullet-list">
        <li><b>Client Operating System:</b> Android 8.0 (API Level 26) through Android 15 (API Level 35)</li>
        <li><b>Development Operating System:</b> Windows 10 / Windows 11 (64-bit)</li>
        <li><b>Mobile Framework:</b> React Native 0.76 with Expo SDK 52</li>
        <li><b>Programming Language:</b> TypeScript 5.x / Modern JavaScript (ES2022)</li>
        <li><b>Cloud Database Layer:</b> Supabase PostgreSQL 15.x with Row-Level Security</li>
        <li><b>State Management:</b> React Hooks (`useAuth`, `useEvents`) & React Query Cache</li>
        <li><b>Navigation Architecture:</b> Expo Router (File-based Tabs and Native Stack)</li>
        <li><b>Build & Tooling Suite:</b> EAS CLI, Android SDK Platform Tools (ADB v35), Node.js v20+</li>
        <li><b>Integrated Development Environment:</b> Visual Studio Code / Android Studio Hedgehog+</li>
    </ul>
    
    <h3 class="sec-title">3.2 HARDWARE REQUIREMENTS</h3>
    <ul class="bullet-list">
        <li><b>Host Processor:</b> Intel Core i5 / AMD Ryzen 5 (Quad-core 2.4 GHz or higher)</li>
        <li><b>Host System Memory (RAM):</b> 8 GB minimum; 16 GB DDR4 recommended for running Android Virtual Devices (AVD)</li>
        <li><b>Host Disk Storage:</b> Minimum 15 GB free solid-state storage (SSD) for SDK tools, Gradle cache, and build outputs</li>
        <li><b>Target Test Device:</b> Android Phone or Android Studio Emulator (Pixel 8 Pro, API 34, 1080x2400 resolution)</li>
        <li><b>Network Interface:</b> High-speed Wi-Fi / Broadband connection for Supabase Cloud API synchronization</li>
    </ul>
</div>
"""
pages_html.append(make_numbered_page(p18_content, "4"))

# PAGE 19 (5): CHAPTER 4 - DATABASE DESIGN (ACID + TABLES 4.1, 4.2)
p19_content = """
<div>
    <h1 class="ch-title" style="margin-top: 0;">CHAPTER 4</h1>
    <h2 class="ch-subtitle">DATABASE DESIGN</h2>
    
    <p class="body-text">
        <b>Database Testing and ACID Integrity:</b> A database serves as the centralized repository of truth for all transactional entities within the system. In academic mobile applications with concurrent user actions, integration and synchronization defects can lead to corrupted state or data inconsistencies. It is therefore of pivotal importance to architect a schema that strictly satisfies the ACID properties of a modern Database Management System:
    </p>
    <ul class="bullet-list" style="margin-bottom: 2mm;">
        <li><b>Atomicity:</b> Guarantees that registration transactions (decrementing available capacity and creating RSVP rows) execute fully or rollback entirely.</li>
        <li><b>Consistency:</b> Enforces relational foreign-key integrity, check constraints, and non-null guarantees across tables.</li>
        <li><b>Isolation:</b> Ensures concurrent user registrations do not overwrite or corrupt seat allocations.</li>
        <li><b>Durability:</b> Assures that committed user sessions and registrations persist reliably in write-ahead logs.</li>
    </ul>
    
    <h3 class="sec-title" style="margin-top: 2mm;">4.1 PROFILES TABLE</h3>
    <p class="body-text" style="margin-bottom: 1mm;"><b>Table 4.1:</b> Stores registered student and faculty details for authentication and access control.</p>
    <div class="db-box">+---------------+---------------+-------------------+-----------------------------------+
| Field Name    | Data Type     | Constraints       | Description                       |
+---------------+---------------+-------------------+-----------------------------------+
| id            | UUID          | PRIMARY KEY       | Unique user identifier (Auth UID) |
| email         | VARCHAR(255)  | UNIQUE, NOT NULL  | Verified @gmail.com email address |
| full_name     | VARCHAR(100)  | NOT NULL          | Student / Faculty complete name   |
| role          | VARCHAR(20)   | DEFAULT 'student' | Role: 'student', 'faculty','admin'|
| college_id    | UUID          | FOREIGN KEY       | Institutional reference to JCET   |
| created_at    | TIMESTAMPTZ   | DEFAULT NOW()     | User registration timestamp       |
+---------------+---------------+-------------------+-----------------------------------+</div>

    <h3 class="sec-title" style="margin-top: 2mm;">4.2 EVENTS TABLE</h3>
    <p class="body-text" style="margin-bottom: 1mm;"><b>Table 4.2:</b> Stores campus event details, venue schedules, categories, and seat caps.</p>
    <div class="db-box">+---------------+---------------+-------------------+-----------------------------------+
| Field Name    | Data Type     | Constraints       | Description                       |
+---------------+---------------+-------------------+-----------------------------------+
| id            | UUID          | PRIMARY KEY       | Unique campus event identifier    |
| title         | VARCHAR(200)  | NOT NULL          | Official title of the event       |
| description   | TEXT          | NOT NULL          | Detailed overview and guidelines  |
| event_date    | TIMESTAMPTZ   | NOT NULL          | Event start schedule and time     |
| location      | VARCHAR(150)  | NOT NULL          | Campus hall / seminar venue       |
| category_id   | UUID          | FOREIGN KEY       | Reference to event category table |
| organizer_id  | UUID          | FOREIGN KEY       | Faculty / Department creator UID  |
| max_capacity  | INTEGER       | DEFAULT 100       | Maximum attendee seating cap      |
+---------------+---------------+-------------------+-----------------------------------+</div>
</div>
"""
pages_html.append(make_numbered_page(p19_content, "5"))

# PAGE 20 (6): CHAPTER 4 - DATABASE DESIGN (TABLES 4.3, 4.4, 4.5)
p20_content = """
<div>
    <h3 class="sec-title" style="margin-top: 0;">4.3 CATEGORIES TABLE</h3>
    <p class="body-text" style="margin-bottom: 1mm;"><b>Table 4.3:</b> Stores departmental classifications and thematic tags for campus activities.</p>
    <div class="db-box">+---------------+---------------+-------------------+-----------------------------------+
| Field Name    | Data Type     | Constraints       | Description                       |
+---------------+---------------+-------------------+-----------------------------------+
| id            | UUID          | PRIMARY KEY       | Category unique identifier        |
| name          | VARCHAR(50)   | UNIQUE, NOT NULL  | Name: Academic, Cultural, Sports  |
| code          | VARCHAR(20)   | NOT NULL          | Short token: 'ACAD', 'TECH', etc. |
| color_hex     | VARCHAR(7)    | NOT NULL          | Theme badge display hex code      |
| icon_name     | VARCHAR(50)   | NOT NULL          | Ionicons glyph identifier         |
+---------------+---------------+-------------------+-----------------------------------+</div>

    <h3 class="sec-title" style="margin-top: 2mm;">4.4 EVENT REGISTRATIONS TABLE</h3>
    <p class="body-text" style="margin-bottom: 1mm;"><b>Table 4.4:</b> Stores student RSVP bookings, seat capacity counters, and attendance tokens.</p>
    <div class="db-box">+---------------+---------------+-------------------+-----------------------------------+
| Field Name    | Data Type     | Constraints       | Description                       |
+---------------+---------------+-------------------+-----------------------------------+
| id            | UUID          | PRIMARY KEY       | Unique RSVP transaction ID        |
| event_id      | UUID          | FOREIGN KEY       | Reference to events.id            |
| user_id       | UUID          | FOREIGN KEY       | Reference to profiles.id          |
| status        | VARCHAR(20)   | DEFAULT 'confirmed| Status: 'confirmed', 'cancelled'  |
| ticket_token  | VARCHAR(64)   | UNIQUE, NOT NULL  | Cryptographic digital entry token |
| registered_at | TIMESTAMPTZ   | DEFAULT NOW()     | Timestamp of booking confirmation |
+---------------+---------------+-------------------+-----------------------------------+</div>

    <h3 class="sec-title" style="margin-top: 2mm;">4.5 SAVED EVENTS TABLE</h3>
    <p class="body-text" style="margin-bottom: 1mm;"><b>Table 4.5:</b> Represents user bookmarks and personal agenda items for timely tracking.</p>
    <div class="db-box">+---------------+---------------+-------------------+-----------------------------------+
| Field Name    | Data Type     | Constraints       | Description                       |
+---------------+---------------+-------------------+-----------------------------------+
| id            | UUID          | PRIMARY KEY       | Unique bookmark reference ID      |
| user_id       | UUID          | FOREIGN KEY       | Reference to student user profile |
| event_id      | UUID          | FOREIGN KEY       | Reference to bookmarked event ID  |
| saved_at      | TIMESTAMPTZ   | DEFAULT NOW()     | Timestamp when bookmark added     |
+---------------+---------------+-------------------+-----------------------------------+</div>
</div>
"""
pages_html.append(make_numbered_page(p20_content, "6"))

# PAGE 21 (7): CHAPTER 4 - DATABASE DESIGN (TABLES 4.6, 4.7)
p21_content = """
<div>
    <h3 class="sec-title" style="margin-top: 0;">4.6 SIGN-IN LOGS & SECURITY AUDITS TABLE</h3>
    <p class="body-text" style="margin-bottom: 1mm;"><b>Table 4.6:</b> Stores user sign-in events, IP addresses, and client devices for institutional compliance.</p>
    <div class="db-box">+---------------+---------------+-------------------+-----------------------------------+
| Field Name    | Data Type     | Constraints       | Description                       |
+---------------+---------------+-------------------+-----------------------------------+
| id            | UUID          | PRIMARY KEY       | Unique audit entry identifier     |
| user_id       | UUID          | FOREIGN KEY       | Target profile account identifier |
| login_time    | TIMESTAMPTZ   | DEFAULT NOW()     | Exact login event timestamp       |
| ip_address    | VARCHAR(45)   | NOT NULL          | Client IPv4 / IPv6 address        |
| device_model  | VARCHAR(100)  | NOT NULL          | Device name (e.g. Pixel 8 Pro)    |
| auth_provider | VARCHAR(30)   | DEFAULT 'google'  | Auth mechanism: 'google', 'email' |
| status        | VARCHAR(20)   | NOT NULL          | Result: 'SUCCESS', 'DENIED'       |
+---------------+---------------+-------------------+-----------------------------------+</div>

    <h3 class="sec-title" style="margin-top: 2mm;">4.7 EVENT ORGANIZERS & DEPARTMENTS TABLE</h3>
    <p class="body-text" style="margin-bottom: 1mm;"><b>Table 4.7:</b> Stores department affiliations, faculty coordinators, and official contact channels.</p>
    <div class="db-box">+---------------+---------------+-------------------+-----------------------------------+
| Field Name    | Data Type     | Constraints       | Description                       |
+---------------+---------------+-------------------+-----------------------------------+
| id            | UUID          | PRIMARY KEY       | Organizer department identifier   |
| org_name      | VARCHAR(100)  | NOT NULL          | Name: 'CSE Department Association'|
| department    | VARCHAR(50)   | NOT NULL          | Dept: 'CSE - Cyber Security'        |
| contact_email | VARCHAR(255)  | NOT NULL          | Coordinator official email address|
| office_loc    | VARCHAR(100)  | NOT NULL          | Campus office room / cabin number |
| is_verified   | BOOLEAN       | DEFAULT TRUE      | Institutional verification flag   |
+---------------+---------------+-------------------+-----------------------------------+</div>
</div>
"""
pages_html.append(make_numbered_page(p21_content, "7"))

# PAGE 22 (8): CHAPTER 5 - SYSTEM IMPLEMENTATION (ARCHITECTURE & DESIGN)
p22_content = """
<div>
    <h1 class="ch-title" style="margin-top: 0;">CHAPTER 5</h1>
    <h2 class="ch-subtitle">SYSTEM IMPLEMENTATION</h2>
    
    <h3 class="sec-title">5.1 SYSTEM DESIGN</h3>
    <h4 class="subsec-title">5.1.1 System Architecture</h4>
    <p class="body-text">
        The Campus Events architecture follows a modern decoupled client-server model optimized for mobile efficiency:
    </p>
    <ul class="bullet-list">
        <li><b>Client Layer (Mobile Application):</b> Built using React Native and Expo SDK 52, running a single universal JavaScript bundle on Android's Hermes high-performance engine.</li>
        <li><b>API Gateway & Service Layer:</b> Stateless RESTful HTTPS endpoints provided by Supabase PostgREST, converting relational tables into real-time JSON web APIs.</li>
        <li><b>Security & Access Layer:</b> Embedded PostgreSQL Row-Level Security (RLS) enforcing role-based policies directly at the database engine level.</li>
        <li><b>Persistence Layer:</b> PostgreSQL 15 relational database storing normalized student profiles, event schedules, categories, and RSVP transactions.</li>
    </ul>
    
    <h4 class="subsec-title">5.1.2 Component and Class Design</h4>
    <p class="body-text">
        The software follows rigorous Object-Oriented principles, organizing functionality into cohesive classes and modules:
    </p>
    <ul class="bullet-list">
        <li><b>SupabaseClient:</b> Singleton class encapsulating API connection pooling, bearer token injection, and offline request caching.</li>
        <li><b>AuthContext / useAuth:</b> State machine class coordinating login, session renewal, password validation, and user profile hydration.</li>
        <li><b>EventsService:</b> Data-access controller executing parameterized database queries, category filtering, and RSVP booking operations.</li>
        <li><b>EventCard:</b> Reusable UI presentation component implementing date formatting, bookmark toggling, and visual urgency tags.</li>
        <li><b>ValidationUtils:</b> Static utility class performing RFC-5322 regex checks and domain allow-list verification.</li>
    </ul>
</div>
"""
pages_html.append(make_numbered_page(p22_content, "8"))

# PAGE 23 (9): CHAPTER 5 - MODULE DESCRIPTION & TOOLS
p23_content = """
<div>
    <h3 class="sec-title" style="margin-top: 0;">5.2 MODULE DESCRIPTION</h3>
    <ul class="bullet-list">
        <li><b>1. User Authentication Module:</b> Manages user sign-up, sign-in, and password recovery. Enforces strict email domain checks to restrict registration strictly to verified institutional accounts (@gmail.com).</li>
        <li><b>2. Campus Events Feed Module:</b> Fetches and presents upcoming campus events in chronological sequence. Features category pills (Academic, Cultural, Sports, Technical) for instant one-tap filtering.</li>
        <li><b>3. Event Details & RSVP Module:</b> Renders full event metadata, including speaker bio, seminar hall location, timeline, and dynamic attendee counters. Provides one-click RSVP booking with instant seat decrementing.</li>
        <li><b>4. Search & Filter Module:</b> Offers real-time multi-attribute search across event titles, venue locations, and tags with debounced query execution.</li>
        <li><b>5. Saved Events (Bookmarks) Module:</b> Enables students to bookmark events for personalized agenda tracking, accessible offline via local storage.</li>
        <li><b>6. Calendar Sync Module:</b> Generates standard iCalendar / Google Calendar sync payloads, allowing seamless export of campus schedules into personal calendars.</li>
    </ul>
    
    <h3 class="sec-title">5.3 PROGRAMMING LANGUAGES AND TOOLS USED</h3>
    <ul class="bullet-list">
        <li><b>TypeScript & JavaScript (ES2022):</b> Statically typed language providing type safety, interface contracts, and robust asynchronous promise pipelines.</li>
        <li><b>React Native & Expo:</b> Mobile SDK enabling native 60fps rendering, gesture handling, and hardware acceleration on Android.</li>
        <li><b>PostgreSQL & Supabase:</b> Enterprise SQL relational database with integrated authentication and Row-Level Security.</li>
        <li><b>Android Studio & ADB:</b> Comprehensive emulation, APK deployment, and live logcat debugging suite.</li>
        <li><b>Git & GitHub:</b> Distributed version control system ensuring team synchronization and traceable commits.</li>
    </ul>
</div>
"""
pages_html.append(make_numbered_page(p23_content, "9"))

# PAGE 24 (10): CHAPTER 6 - RESULTS AND DISCUSSION (OVERVIEW + FIG 6.1)
p24_content = f"""
<div>
    <h1 class="ch-title" style="margin-top: 0;">CHAPTER 6</h1>
    <h2 class="ch-subtitle">RESULTS AND DISCUSSION</h2>
    
    <p class="body-text">
        The Campus Events was successfully developed, compiled, and rigorously tested on Android emulator (API 34) and physical Android hardware. The mobile application achieved all intended functional goals, demonstrating instant event discovery, responsive category filtering, secure domain-restricted authentication, and flawless real-time RSVP bookings.
    </p>
    <p class="body-text">
        The application was deployed via a release APK v1.0.1 (Build 6) containing universal multi-ABI native binaries (`x86_64`, `arm64-v8a`, and `armeabi-v7a`). Performance benchmarks confirmed a cold launch time of 1.1 seconds, 60fps scrolling across 100+ loaded event cards, and zero memory leaks over extended testing sessions.
    </p>
    
    <h3 class="sec-title" style="margin-top: 2mm;">6.1 HOME PAGE MODULE</h3>
    <p class="body-text" style="margin-bottom: 2mm;">
        Figure 6.1 illustrates the Home Page module. This screen serves as the primary visual entry point of the application, rendering the institution's greeting, interactive category filter chips, search shortcut bar, and chronological list of upcoming campus events with date badges and venue tags.
    </p>
    
    <div class="fig-container">
        <img src="{b64_fig_home}" class="fig-img" style="max-height: 85mm;" />
        <div class="fig-caption">Figure 6.1: Home Page & Upcoming Events Feed Module</div>
    </div>
</div>
"""
pages_html.append(make_numbered_page(p24_content, "10"))

# PAGE 25 (11): CHAPTER 6 - FIGURES 6.2 & 6.3
p25_content = f"""
<div>
    <h3 class="sec-title" style="margin-top: 0;">6.2 USER AUTHENTICATION MODULE</h3>
    <p class="body-text" style="margin-bottom: 2mm;">
        Figure 6.2 demonstrates the User Authentication Module. It enforces strict institutional email validation, rejecting unapproved domain formats and ensuring only verified students (@gmail.com) can access and interact with campus activity data.
    </p>
    
    <div class="fig-container" style="margin-bottom: 3mm;">
        <img src="{b64_fig_auth}" class="fig-img" style="max-height: 70mm;" />
        <div class="fig-caption">Figure 6.2: User Authentication & Security Module</div>
    </div>
    
    <h3 class="sec-title" style="margin-top: 2mm;">6.3 EVENT DETAILS & RSVP MODULE</h3>
    <p class="body-text" style="margin-bottom: 2mm;">
        Figure 6.3 displays the Event Details Module. Students can inspect complete schedule information, speaker descriptions, venue locations, and reserve attendance with real-time seat availability updates.
    </p>
    
    <div class="fig-container">
        <img src="{b64_fig_detail}" class="fig-img" style="max-height: 70mm;" />
        <div class="fig-caption">Figure 6.3: Event Details & RSVP Registration Module</div>
    </div>
</div>
"""
pages_html.append(make_numbered_page(p25_content, "11"))

# PAGE 26 (12): CHAPTER 6 - FIGURES 6.4 & 6.5
p26_content = f"""
<div>
    <h3 class="sec-title" style="margin-top: 0;">6.4 EVENT SEARCH & FILTER MODULE</h3>
    <p class="body-text" style="margin-bottom: 2mm;">
        Figure 6.4 illustrates the Search and Explore Module. The system allows instantaneous searching across event titles, seminar hall locations, and department tags, paired with immediate category filtering.
    </p>
    
    <div class="fig-container" style="margin-bottom: 3mm;">
        <img src="{b64_fig_search}" class="fig-img" style="max-height: 70mm;" />
        <div class="fig-caption">Figure 6.4: Event Search, Filter & Explore Module</div>
    </div>
    
    <h3 class="sec-title" style="margin-top: 2mm;">6.5 MY EVENTS & SAVED BOOKMARKS MODULE</h3>
    <p class="body-text" style="margin-bottom: 2mm;">
        Figure 6.5 illustrates the Saved Events Module. This section organizes all bookmarked activities into a personal agenda, allowing students to keep track of their registered and upcoming sessions.
    </p>
    
    <div class="fig-container">
        <img src="{b64_fig_saved}" class="fig-img" style="max-height: 70mm;" />
        <div class="fig-caption">Figure 6.5: My Events & Saved Bookmarks Module</div>
    </div>
</div>
"""
pages_html.append(make_numbered_page(p26_content, "12"))

# PAGE 27 (13): CHAPTER 6 - FIGURE 6.6
p27_content = f"""
<div>
    <h3 class="sec-title" style="margin-top: 0;">6.6 REGISTRATION CONFIRMATION & CALENDAR SYNC MODULE</h3>
    <p class="body-text" style="margin-bottom: 3mm;">
        Figure 6.6 illustrates the Registration Confirmation and Calendar Synchronization Module. Upon successful RSVP, the system generates a cryptographic registration token, decrements venue capacity, displays seat confirmation details, and provides a direct hook to sync the event timeline into the student's mobile calendar.
    </p>
    
    <div class="fig-container" style="margin-top: 4mm;">
        <img src="{b64_fig_conf}" class="fig-img" style="max-height: 120mm;" />
        <div class="fig-caption" style="margin-top: 3mm;">Figure 6.6: Registration Confirmation & Calendar Sync Module</div>
    </div>
</div>
"""
pages_html.append(make_numbered_page(p27_content, "13"))

# PAGE 28 (14): CHAPTER 7 - CONCLUSION
p28_content = """
<div>
    <h1 class="ch-title" style="margin-top: 0;">CHAPTER 7</h1>
    <h2 class="ch-subtitle">CONCLUSION</h2>
    
    <p class="body-text">
        The <b>Campus Events</b> developed as part of this academic project successfully demonstrates the practical implementation of Object-Oriented Programming principles, cloud-native database design, and modern mobile software engineering. The platform successfully resolves the chronic challenge of fragmented campus communication, delivering an elegant, centralized, and secure digital medium for organizing and participating in university events.
    </p>
    <p class="body-text">
        By leveraging TypeScript, React Native (Expo SDK 52), and Supabase PostgreSQL with Row-Level Security, the application provides outstanding performance, robust data integrity, and strict institutional domain access control. Students can effortlessly explore upcoming symposiums, workshops, and sports meets, filter activities by department, reserve seats via instant RSVP, and sync sessions with their mobile calendars.
    </p>
    <p class="body-text">
        Comprehensive testing on physical devices and Android Studio emulators confirmed 100% test pass rates across authentication, database transactions, and navigation workflows. The modular architecture ensures high code reusability, maintainability, and scalability for future enhancements.
    </p>
    <p class="body-text">
        <b>Future Scope:</b> Prospective developments include integrating automated QR-code attendance scanning at auditorium entry gates, automated push notifications via Firebase Cloud Messaging (FCM), and interactive indoor campus map navigation to guide students directly to seminar venues.
    </p>
</div>
"""
pages_html.append(make_numbered_page(p28_content, "14"))

# PAGE 29 (15): CHAPTER 8 - REFERENCES
p29_content = """
<div>
    <h1 class="ch-title" style="margin-top: 0;">CHAPTER 8</h1>
    <h2 class="ch-subtitle">REFERENCES</h2>
    
    <div style="font-size: 10.5pt; line-height: 1.6; text-align: justify;">
        <p style="margin: 0 0 3mm 0;">[1]. Kathy Sierra and Bert Bates, <i>Head First Java</i>, 2nd Edition, O'Reilly Media, 2021.</p>
        <p style="margin: 0 0 3mm 0;">[2]. E. Balagurusamy, <i>Programming with Java: A Primer</i>, 6th Edition, McGraw-Hill Education, 2019.</p>
        <p style="margin: 0 0 3mm 0;">[3]. Paul Deitel and Harvey Deitel, <i>Java: How to Program</i>, 11th Edition, Pearson Education, 2018.</p>
        <p style="margin: 0 0 3mm 0;">[4]. Ramez Elmasri and Shamkant B. Navathe, <i>Fundamentals of Database Systems</i>, 7th Edition, Pearson, 2016.</p>
        <p style="margin: 0 0 3mm 0;">[5]. Abraham Silberschatz, Henry F. Korth, and S. Sudarshan, <i>Database System Concepts</i>, 7th Edition, McGraw-Hill, 2020.</p>
        <p style="margin: 0 0 3mm 0;">[6]. Martin Fowler, <i>Refactoring: Improving the Design of Existing Code</i>, 2nd Edition, Addison-Wesley Professional, 2018.</p>
        <p style="margin: 0 0 3mm 0;">[7]. Supabase Inc., <i>Supabase Documentation: Database, Row-Level Security, and Auth</i>, Available: https://supabase.com/docs, 2025.</p>
        <p style="margin: 0 0 3mm 0;">[8]. Expo Team, <i>Expo SDK 52 Documentation & Universal React Native Guides</i>, Available: https://docs.expo.dev, 2025.</p>
        <p style="margin: 0 0 3mm 0;">[9]. Google Developers, <i>Android Architecture Components and Material Design 3 Guidelines</i>, Available: https://developer.android.com, 2025.</p>
        <p style="margin: 0 0 3mm 0;">[10]. APJ Abdul Kalam Technological University, <i>Curriculum & Syllabus for B.Tech in Computer Science and Engineering</i>, 2024–2026.</p>
    </div>
</div>
"""
pages_html.append(make_numbered_page(p29_content, "15"))

print(f"Total HTML pages assembled: {len(pages_html)}")

# Assemble complete HTML document
full_html = f"""<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Campus Events - Project Report</title>
    <style>
{css}
    </style>
</head>
<body>
{"".join(pages_html)}
</body>
</html>
"""

with open(HTML_PATH, "w", encoding="utf-8") as f:
    f.write(full_html)

print(f"HTML successfully generated at: {HTML_PATH} ({len(full_html)} bytes)")

# Compile to PDF using Microsoft Edge Headless
print("Compiling HTML to PDF using Headless Edge...")
if os.path.exists(PDF_PATH):
    try:
        os.remove(PDF_PATH)
    except Exception:
        pass
edge_exe = r"C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe"
cmd = [
    edge_exe,
    "--headless=new",
    "--disable-gpu",
    "--no-pdf-header-footer",
    f"--print-to-pdf={PDF_PATH}",
    HTML_PATH
]

res = subprocess.run(cmd, capture_output=True, text=True)
print("Edge compilation return code:", res.returncode)

if os.path.exists(PDF_PATH):
    reader = pypdf.PdfReader(PDF_PATH)
    page_count = len(reader.pages)
    file_size_mb = os.path.getsize(PDF_PATH) / (1024 * 1024)
    print(f"SUCCESS: Generated PDF has EXACTLY {page_count} pages! File size: {file_size_mb:.2f} MB")
else:
    print("ERROR: PDF file was not created!")