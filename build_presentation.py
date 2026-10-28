import sys
from pptx import Presentation
from pptx.util import Inches, Pt
from pptx.enum.text import PP_ALIGN
from pptx.dml.color import RGBColor
from pptx.enum.shapes import MSO_SHAPE

def create_presentation(output_path):
    prs = Presentation()
    prs.slide_width = Inches(13.333)
    prs.slide_height = Inches(7.5)
    blank_layout = prs.slide_layouts[6]

    # Aesthetic Color Palette
    C_BG = RGBColor(11, 15, 25)         # Deep slate/black
    C_CARD = RGBColor(22, 30, 46)       # Subtle glass-like card
    C_CARD_BORDER = RGBColor(45, 55, 78)# Card border
    C_TEXT = RGBColor(248, 250, 252)    # Main white text
    C_MUTED = RGBColor(148, 163, 184)   # Slate gray text
    C_DIM = RGBColor(100, 116, 139)     # Dim text
    C_PRIMARY = RGBColor(99, 102, 241)  # Indigo
    C_PURPLE = RGBColor(139, 92, 246)   # Purple
    C_CYAN = RGBColor(6, 182, 212)      # Cyan
    C_SUCCESS = RGBColor(16, 185, 129)  # Emerald
    C_AMBER = RGBColor(245, 158, 11)    # Amber

    def set_background(slide):
        bg = slide.shapes.add_shape(MSO_SHAPE.RECTANGLE, 0, 0, prs.slide_width, prs.slide_height)
        bg.fill.solid()
        bg.fill.fore_color.rgb = C_BG
        bg.line.fill.background() # no line

        # Add top gradient-like accent stripe
        stripe = slide.shapes.add_shape(MSO_SHAPE.RECTANGLE, 0, 0, prs.slide_width, Inches(0.08))
        stripe.fill.solid()
        stripe.fill.fore_color.rgb = C_PRIMARY
        stripe.line.fill.background()

    def add_header(slide, tag, title, subtitle):
        # Badge / Tag
        badge = slide.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(0.8), Inches(0.5), Inches(2.8), Inches(0.38))
        badge.fill.solid()
        badge.fill.fore_color.rgb = RGBColor(30, 27, 75)
        badge.line.color.rgb = C_PRIMARY
        tf = badge.text_frame
        tf.word_wrap = True
        p = tf.paragraphs[0]
        p.text = tag.upper()
        p.font.name = "Calibri"
        p.font.size = Pt(9.5)
        p.font.bold = True
        p.font.color.rgb = RGBColor(165, 180, 252)
        p.alignment = PP_ALIGN.CENTER

        # Title
        tb = slide.shapes.add_textbox(Inches(0.8), Inches(0.95), Inches(11.7), Inches(0.8))
        tf = tb.text_frame
        tf.word_wrap = True
        p = tf.paragraphs[0]
        p.text = title
        p.font.name = "Calibri"
        p.font.size = Pt(26)
        p.font.bold = True
        p.font.color.rgb = C_TEXT

        # Subtitle
        if subtitle:
            p2 = tf.add_paragraph()
            p2.text = subtitle
            p2.font.name = "Calibri"
            p2.font.size = Pt(12.5)
            p2.font.color.rgb = C_MUTED
            p2.space_before = Pt(4)

    def add_card(slide, left, top, width, height, title, text, accent_color=None):
        card = slide.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, left, top, width, height)
        card.fill.solid()
        card.fill.fore_color.rgb = C_CARD
        card.line.color.rgb = accent_color if accent_color else C_CARD_BORDER
        card.line.width = Pt(1.5 if accent_color else 1)
        
        # Text
        tf = card.text_frame
        tf.word_wrap = True
        tf.margin_left = Inches(0.22)
        tf.margin_right = Inches(0.22)
        tf.margin_top = Inches(0.22)
        tf.margin_bottom = Inches(0.22)

        if title:
            p = tf.paragraphs[0]
            p.text = title
            p.font.name = "Calibri"
            p.font.size = Pt(14)
            p.font.bold = True
            p.font.color.rgb = accent_color if accent_color else C_TEXT
            p.alignment = PP_ALIGN.LEFT

        if text:
            first = False if title else True
            for line in text.split("\n"):
                if first:
                    p = tf.paragraphs[0]
                    first = False
                else:
                    p = tf.add_paragraph()
                p.text = line
                p.font.name = "Calibri"
                p.font.size = Pt(10.5)
                p.font.color.rgb = C_MUTED
                p.space_before = Pt(4)
                p.alignment = PP_ALIGN.LEFT
        return card

    # ==========================================
    # SLIDE 1: Title Slide
    # ==========================================
    s1 = prs.slides.add_slide(blank_layout)
    set_background(s1)

    # Big Hero Badge
    b1 = s1.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(1.2), Inches(1.6), Inches(3.6), Inches(0.42))
    b1.fill.solid()
    b1.fill.fore_color.rgb = RGBColor(30, 27, 75)
    b1.line.color.rgb = C_PRIMARY
    tf = b1.text_frame
    p = tf.paragraphs[0]
    p.text = "OFFICIAL PROJECT PRESENTATION"
    p.font.bold = True
    p.font.size = Pt(10)
    p.font.color.rgb = RGBColor(165, 180, 252)
    p.alignment = PP_ALIGN.CENTER

    # Main Title
    tb = s1.shapes.add_textbox(Inches(1.2), Inches(2.2), Inches(10.5), Inches(2.2))
    tf = tb.text_frame
    tf.word_wrap = True
    p = tf.paragraphs[0]
    p.text = "Campus Events Calendar"
    p.font.name = "Calibri"
    p.font.size = Pt(46)
    p.font.bold = True
    p.font.color.rgb = C_TEXT

    p2 = tf.add_paragraph()
    p2.text = "Modern Collegiate Event Aggregation & Student Engagement Platform"
    p2.font.name = "Calibri"
    p2.font.size = Pt(18)
    p2.font.color.rgb = C_CYAN
    p2.space_before = Pt(8)

    p3 = tf.add_paragraph()
    p3.text = "Full-Stack Native Mobile App (React Native/Expo 57) • Node.js REST API • Supabase Cloud DB"
    p3.font.name = "Calibri"
    p3.font.size = Pt(13)
    p3.font.color.rgb = C_MUTED
    p3.space_before = Pt(12)

    # Info Cards Bottom
    add_card(s1, Inches(1.2), Inches(4.8), Inches(3.4), Inches(1.8),
             "🚀 Production Release",
             "• Version: v1.0.0 (Build 5)\n• Form Factor: Android Native APK\n• Size: 60.5 MB (Signed v2/v3)",
             C_PRIMARY)

    add_card(s1, Inches(4.9), Inches(4.8), Inches(3.4), Inches(1.8),
             "🌐 Cloud Infrastructure",
             "• Live API: Render.com\n• Database: Supabase PostgreSQL 15\n• Portal: GitHub Pages CDN",
             C_PURPLE)

    add_card(s1, Inches(8.6), Inches(4.8), Inches(3.4), Inches(1.8),
             "🛡️ Security Engine",
             "• Strict Google/Gmail RFC Validation\n• Two-Factor Email Confirmation\n• Real-Time Sign-In Audit Logs",
             C_SUCCESS)

    # ==========================================
    # SLIDE 2: Problem vs Solution
    # ==========================================
    s2 = prs.slides.add_slide(blank_layout)
    set_background(s2)
    add_header(s2, "Context & Motivation", "The Collegiate Challenge & Our Solution", "Addressing the disconnect in campus-wide event discovery and verified participation.")

    # Left: Problems
    add_card(s2, Inches(0.8), Inches(2.2), Inches(5.6), Inches(4.6),
             "❌ The Traditional Problem",
             "1. Fragmented Communication Channels:\n   Events are scattered across WhatsApp groups, paper noticeboards, and lost email threads.\n\n"
             "2. Missed Deadlines & Low Turnout:\n   Students find out about hackathons, symposiums, or sports events after registration has closed.\n\n"
             "3. Unverified Attendee Lists:\n   Organizers deal with spam registrations and inaccurate attendee counts due to unverified emails.\n\n"
             "4. Lack of Department Customization:\n   Students cannot filter noise to find activities relevant to their major or academic year.",
             RGBColor(239, 68, 68))

    # Right: Solution
    add_card(s2, Inches(6.8), Inches(2.2), Inches(5.7), Inches(4.6),
             "✅ The Campus Events Solution",
             "1. Unified Digital Event Calendar:\n   A single source of truth for all campus activities with day-by-day browsing and category badges.\n\n"
             "2. Strict Student Gmail Verification:\n   Client & server algorithms enforce authentic student Gmail credentials with email confirmation.\n\n"
             "3. Real-Time Cloud Synchronization:\n   Instant updates for capacity limits, venue changes, and one-tap calendar exports.\n\n"
             "4. Granular Filtering & Security:\n   Department-specific feeds, RSVP tracking, and audit-grade sign-in monitoring.",
             C_SUCCESS)

    # ==========================================
    # SLIDE 3: Architecture & Tech Stack
    # ==========================================
    s3 = prs.slides.add_slide(blank_layout)
    set_background(s3)
    add_header(s3, "Engineering Architecture", "Full-Stack 3-Tier Distributed Architecture", "Built for high concurrency, zero data drift, and cross-platform native performance.")

    add_card(s3, Inches(0.8), Inches(2.1), Inches(3.6), Inches(4.7),
             "📱 Mobile Client Tier",
             "• React Native 0.86 & Expo SDK 57\n"
             "• Hermes JavaScript VM Engine\n"
             "• React Hook Form + Zod validation\n"
             "• TanStack Query v5 (React Query)\n"
             "• Expo Router (File-based navigation)\n"
             "• Reanimated 4 & Gesture Handler\n"
             "• Expo SecureStore (Encrypted tokens)\n"
             "• Dark aesthetic UI kit (#090D16)",
             C_PRIMARY)

    add_card(s3, Inches(4.8), Inches(2.1), Inches(3.6), Inches(4.7),
             "⚙️ Backend API Tier",
             "• Node.js 20+ LTS & Express.js\n"
             "• 100% Strict TypeScript code\n"
             "• Modular Controller-Service-Route\n"
             "• Centralized Supabase JWT Auth\n"
             "• Zod schema validation interceptors\n"
             "• Helmet, Morgan, Rate Limiting\n"
             "• Render Cloud Web Service hosting\n"
             "• Auto-deploy continuous integration",
             C_PURPLE)

    add_card(s3, Inches(8.8), Inches(2.1), Inches(3.7), Inches(4.7),
             "🗄️ Database & Cloud Tier",
             "• Supabase PostgreSQL 15\n"
             "• Row Level Security (RLS) policies\n"
             "• Supabase GoTrue Auth (PKCE flow)\n"
             "• Supabase Storage (Posters & Media)\n"
             "• Migrations 001 - 006 applied\n"
             "• Automated PL/pgSQL triggers\n"
             "• GitHub Releases global CDN\n"
             "• GitHub Pages direct APK delivery",
             C_CYAN)

    # ==========================================
    # SLIDE 4: Core Features
    # ==========================================
    s4 = prs.slides.add_slide(blank_layout)
    set_background(s4)
    add_header(s4, "Feature Spotlight", "Designed for College Life & Event Organizers", "Packed with features that simplify participation, discovery, and administration.")

    add_card(s4, Inches(0.8), Inches(2.1), Inches(3.6), Inches(2.3),
             "📅 Interactive Calendar",
             "• Day-by-day visual calendar grid\n• Color-coded category indicators\n• One-tap sync to phone calendar\n• Live RSVP countdown counters",
             C_PRIMARY)

    add_card(s4, Inches(4.8), Inches(2.1), Inches(3.6), Inches(2.3),
             "🔍 Explore & Filters",
             "• Search by keywords & venues\n• Filter by Department (CSE, Mech, etc.)\n• Filter by Category (Tech, Cult, Sports)\n• Real-time cached search queries",
             C_PURPLE)

    add_card(s4, Inches(8.8), Inches(2.1), Inches(3.7), Inches(2.3),
             "📝 Event Publishing",
             "• Multi-step event creation wizard\n• High-resolution poster image upload\n• Capacity limits & registration caps\n• Organizer attribution & contacts",
             C_CYAN)

    add_card(s4, Inches(0.8), Inches(4.6), Inches(3.6), Inches(2.3),
             "📌 Bookmarks & RSVPs",
             "• Save favorite events for quick access\n• Manage confirmed registrations\n• Offline cache support via TanStack\n• Instant cancellation & seat release",
             C_SUCCESS)

    add_card(s4, Inches(4.8), Inches(4.6), Inches(3.6), Inches(2.3),
             "🔔 Smart Notifications",
             "• Reminders for upcoming registered events\n• Real-time announcements on schedule changes\n• In-app alerts for registration deadlines",
             C_AMBER)

    add_card(s4, Inches(8.8), Inches(4.6), Inches(3.7), Inches(2.3),
             "👤 Student Profile & Stats",
             "• Academic year & Department badges\n• Verified student badge display\n• Attendance & participation count\n• Secure 1-tap session sign out",
             C_PRIMARY)

    # ==========================================
    # SLIDE 5: Security & Verification
    # ==========================================
    s5 = prs.slides.add_slide(blank_layout)
    set_background(s5)
    add_header(s5, "Security & Verification", "Zero-Trust Student Authentication Engine", "Protecting event rosters, attendance records, and student privacy with strict validations.")

    add_card(s5, Inches(0.8), Inches(2.1), Inches(5.6), Inches(4.7),
             "🔐 Strict Google / Gmail Validation Engine",
             "Enforces official Google RFC naming rules symmetrically on Client & Server:\n\n"
             "• Domain Constraint: Must strictly terminate with '@gmail.com'\n"
             "• Username Length: Strictly bounded between 6 and 30 characters\n"
             "• Character Set: Only lowercase letters, digits, and periods ('.')\n"
             "• Grammar Rules: Disallows consecutive periods ('..')\n"
             "• Edge Rules: Cannot start or end with a period\n\n"
             "Benefit: Completely prevents bot registrations, invalid emails, and fake student submissions while maintaining zero runtime overhead.",
             C_PRIMARY)

    add_card(s5, Inches(6.8), Inches(2.1), Inches(5.7), Inches(4.7),
             "🛡️ Two-Factor Email Flow & Audit Logging",
             "1. Anti-Spam Email Confirmation:\n   Accounts remain unconfirmed until the student clicks the link sent to their Gmail. Custom deep linking (campusevents://auth-callback) handles seamless verification.\n\n"
             "2. Unconfirmed Account Intercept:\n   Login screen automatically detects unconfirmed emails and provides a 1-tap 'Resend Verification Link' button.\n\n"
             "3. Real-Time Sign-In Audit Logs:\n   Every sign-in is recorded in Supabase (sign_in_logs table) capturing timestamp, login method, client IP, and device User-Agent for campus security.",
             C_SUCCESS)

    # ==========================================
    # SLIDE 6: Database & Data Modeling
    # ==========================================
    s6 = prs.slides.add_slide(blank_layout)
    set_background(s6)
    add_header(s6, "Data Modeling", "Relational PostgreSQL Schema with Row Level Security", "Engineered on Supabase PostgreSQL with 6 migrations, foreign key cascades, and RLS.")

    add_card(s6, Inches(0.8), Inches(2.1), Inches(3.6), Inches(4.7),
             "📊 Core Relational Tables",
             "• profiles:\n  full_name, email, department, academic_year, college_id, last_sign_in_at, sign_in_count\n\n"
             "• events:\n  title, description, category_id, organizer_id, venue, start_date, end_date, poster_url, max_capacity\n\n"
             "• registrations:\n  user_id, event_id, status, registered_at\n\n"
             "• saved_events:\n  user_id, event_id, saved_at",
             C_PURPLE)

    add_card(s6, Inches(4.8), Inches(2.1), Inches(3.6), Inches(4.7),
             "🛡️ Security & Audit Tables",
             "• sign_in_logs:\n  user_id, sign_in_method, ip_address, user_agent, created_at\n\n"
             "• categories:\n  name, slug, color (Tech, Cultural, Sports, Workshop, etc.)\n\n"
             "• organizations:\n  name, description, logo_url, verified_status, contact_email\n\n"
             "• Row Level Security (RLS):\n  Declarative policies enforce that students can only modify their own data.",
             C_CYAN)

    add_card(s6, Inches(8.8), Inches(2.1), Inches(3.7), Inches(4.7),
             "⚡ Automated Triggers",
             "• on_auth_user_created:\n  Extracts department, college_id, and academic_year from sign-up payload directly into public.profiles.\n\n"
             "• updated_at triggers:\n  Maintains precise audit timestamps across all records.\n\n"
             "• Capacity checks:\n  Rejects registrations if event seat threshold is exceeded.\n\n"
             "• Indexes:\n  B-tree indexes on event dates and categories.",
             C_SUCCESS)

    # ==========================================
    # SLIDE 7: Engineering Triumphs
    # ==========================================
    s7 = prs.slides.add_slide(blank_layout)
    set_background(s7)
    add_header(s7, "Engineering Highlights", "Overcoming Complex Low-Level Build Challenges", "Solving Windows path limits, C++ compilation hurdles, and Android installation conflicts.")

    add_card(s7, Inches(0.8), Inches(2.1), Inches(5.6), Inches(2.3),
             "1. Windows MAX_PATH (260-Char) Fix",
             "Problem: React Native New Architecture CMake builds failed with Ninja manifest dirty errors due to 272-character paths.\n"
             "Fix: Mapped virtual drive M:\\ and refactored autolinked sources into local components, eliminating path overflow.",
             C_PRIMARY)

    add_card(s7, Inches(6.8), Inches(2.1), Inches(5.7), Inches(2.3),
             "2. C++ Linker Duplicate Symbol Resolution",
             "Problem: screens autolinking failed with duplicate symbol: rnscreens_ModuleProvider.\n"
             "Fix: Isolated conflicting generated stubs from the CMake source glob, enabling clean 2-minute builds.",
             C_CYAN)

    add_card(s7, Inches(0.8), Inches(4.6), Inches(5.6), Inches(2.3),
             "3. Android Package Signature Conflict Fix",
             "Problem: Android package manager threw 'Something went wrong' when installing APK.\n"
             "Fix: Generated 2048-bit RSA production release keystore (v2+v3 scheme) and documented legacy build uninstallation.",
             C_SUCCESS)

    add_card(s7, Inches(6.8), Inches(4.6), Inches(5.7), Inches(2.3),
             "4. Mobile Cross-Origin Download Delivery",
             "Problem: Phone browsers blocked GitHub 302 signed redirect URLs.\n"
             "Fix: Deployed APK directly to same-origin GitHub Pages branch with native MIME type application/vnd.android.package-archive.",
             C_AMBER)

    # ==========================================
    # SLIDE 8: Deployment & Live Demo
    # ==========================================
    s8 = prs.slides.add_slide(blank_layout)
    set_background(s8)
    add_header(s8, "Production Status", "Live Deployment & Verification", "All components are live, tested, and accessible globally.")

    add_card(s8, Inches(0.8), Inches(2.1), Inches(5.6), Inches(4.7),
             "🚀 Live Production Links",
             "• Web Download Portal (GitHub Pages):\n  https://arjunak18.github.io/campus-events/\n\n"
             "• Direct APK Download (Same-Origin):\n  https://arjunak18.github.io/campus-events/campus-events-release.apk\n\n"
             "• GitHub Releases (v1.0.0 Global CDN):\n  https://github.com/arjunak18/campus-events/releases/tag/v1.0.0\n\n"
             "• Backend REST API (Render Web Service):\n  https://campus-events-api-icb1.onrender.com/api\n\n"
             "• API Health Probe:\n  https://campus-events-api-icb1.onrender.com/api/health",
             C_PRIMARY)

    add_card(s8, Inches(6.8), Inches(2.1), Inches(5.7), Inches(4.7),
             "📦 Release APK Specifications",
             "• Package: com.akdevos.campusevents\n"
             "• Version: 1.0.0 (VersionCode: 5)\n"
             "• Binary Size: 60.5 MB (60,580,137 bytes)\n"
             "• Architecture: Universal (arm64-v8a, armeabi-v7a)\n"
             "• Minimum SDK: Android 8.0+ (API 24/26)\n"
             "• Signature: 2048-bit RSA (v2 & v3 Verified)\n\n"
             "SHA-256 Checksum:\n"
             "eefed1ee3510faa6615312005f552668f60e2fea75a32e630bd483d3550afbbd",
             C_SUCCESS)

    # ==========================================
    # SLIDE 9: Roadmap & Conclusion
    # ==========================================
    s9 = prs.slides.add_slide(blank_layout)
    set_background(s9)
    add_header(s9, "Future Horizon", "Project Roadmap & Conclusion", "Scaling the platform for multi-university deployments and rich organizer tools.")

    add_card(s9, Inches(0.8), Inches(2.1), Inches(3.6), Inches(3.4),
             "🖥️ Phase 8: Web Admin Panel",
             "• React + Vite dashboard\n• Campus-wide event approval\n• Attendance statistics & CSV export\n• Organization manager controls",
             C_PRIMARY)

    add_card(s9, Inches(4.8), Inches(2.1), Inches(3.6), Inches(3.4),
             "🔔 Automated Push Reminders",
             "• Supabase Webhooks + Expo Push\n• 24h & 1h event notifications\n• Real-time venue updates\n• Emergency broadcast alerts",
             C_PURPLE)

    add_card(s9, Inches(8.8), Inches(2.1), Inches(3.7), Inches(3.4),
             "🎟️ QR Ticket Check-In",
             "• Personal student digital pass\n• In-app camera scanner for hosts\n• Real-time door attendance sync\n• Prevent duplicate entries",
             C_CYAN)

    # Thank you footer card
    add_card(s9, Inches(0.8), Inches(5.8), Inches(11.7), Inches(1.1),
             "🎉 Thank You! — Questions & Answers",
             "Open-source repository available on GitHub: github.com/arjunak18/campus-events  •  Built with passion by Arjun A K (AkDevos)",
             C_SUCCESS)

    prs.save(output_path)
    print(f"Presentation saved to: {output_path}")

if __name__ == "__main__":
    out = "C:/Users/USER/.gemini/antigravity/scratch/campus-events/Campus-Events-Presentation.pptx"
    create_presentation(out)
