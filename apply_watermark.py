# apply_watermark.py
import re

script_path = r"C:\Users\USER\.gemini\antigravity\scratch\campus-events\generate_complete_report.py"

with open(script_path, "r", encoding="utf-8") as f:
    text = f.read()

# Add b64_logo_watermark definition
if 'b64_logo_watermark =' not in text:
    text = text.replace(
        'b64_watermark = get_b64("Image5.jpg")',
        'b64_watermark = get_b64("Image5.jpg")\nb64_logo_watermark = get_b64("jcet_logo_watermark_hd.png")'
    )
    print("Added b64_logo_watermark definition.")

# Update CSS for page-watermark
old_css_watermark = """/* Front matter components */
.front-watermark {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 145mm;
    opacity: 0.08;
    z-index: 0;
    pointer-events: none;
}"""

new_css_watermark = """/* Page Watermark for Page 1 to Table of Contents */
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
}"""

if old_css_watermark in text:
    text = text.replace(old_css_watermark, new_css_watermark)
    print("Updated CSS for watermark.")

# Update make_front_page
old_front_fn = """def make_front_page(inner_content, show_banner=True, show_emblem=True):
    banner_tag = f'<img src="{b64_banner}" class="front-banner" />' if show_banner else ''
    emblem_tag = f'<img src="{b64_emblem}" class="front-bottom-emblem" />' if show_emblem else ''
    return f\"\"\"
    <div class="page">
        <img src="{b64_watermark}" class="front-watermark" />
        {banner_tag}
        <div class="front-content">
            {inner_content}
        </div>
        {emblem_tag}
    </div>
    \"\"\""""

new_front_fn = """def make_front_page(inner_content, show_banner=True, show_emblem=True):
    banner_tag = f'<img src="{b64_banner}" class="front-banner" />' if show_banner else ''
    emblem_tag = f'<img src="{b64_emblem}" class="front-bottom-emblem" />' if show_emblem else ''
    return f\"\"\"
    <div class="page">
        <img src="{b64_logo_watermark}" class="page-watermark" />
        {banner_tag}
        <div class="front-content">
            {inner_content}
        </div>
        {emblem_tag}
    </div>
    \"\"\""""

if old_front_fn in text:
    text = text.replace(old_front_fn, new_front_fn)
    print("Updated make_front_page with new logo watermark.")

# Update make_numbered_page to take show_watermark
old_numbered_fn = """def make_numbered_page(inner_content, page_num_str):
    return f\"\"\"
    <div class="page">
        <div class="running-header">
            <div class="running-header-text">HYBRID APP DEVELOPMENT  25CCHADT305</div>
            <div class="running-header-line"></div>
        </div>
        <div style="flex: 1; display: flex; flex-direction: column;">
            {inner_content}
        </div>
        <div class="running-footer">
            <div class="running-footer-line"></div>
            <div class="running-footer-content">
                <span class="dept-title">DEPARTMENT OF CSE - DATA SCIENCE</span>
                <span class="page-num">{page_num_str}</span>
            </div>
        </div>
    </div>
    \"\"\""""

new_numbered_fn = """def make_numbered_page(inner_content, page_num_str, show_watermark=False):
    watermark_tag = f'<img src="{b64_logo_watermark}" class="page-watermark" />' if show_watermark else ''
    return f\"\"\"
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
                <span class="dept-title">DEPARTMENT OF CSE - DATA SCIENCE</span>
                <span class="page-num">{page_num_str}</span>
            </div>
        </div>
    </div>
    \"\"\""""

if old_numbered_fn in text:
    text = text.replace(old_numbered_fn, new_numbered_fn)
    print("Updated make_numbered_page.")

# Update call for Page 9, 10, 11 to pass show_watermark=True
text = text.replace('make_numbered_page(p9_content, "I")', 'make_numbered_page(p9_content, "I", show_watermark=True)')
text = text.replace('make_numbered_page(p10_content, "II")', 'make_numbered_page(p10_content, "II", show_watermark=True)')
text = text.replace('make_numbered_page(p11_content, "III")', 'make_numbered_page(p11_content, "III", show_watermark=True)')

with open(script_path, "w", encoding="utf-8") as f:
    f.write(text)

print("generate_complete_report.py successfully updated with new logo watermark!")
