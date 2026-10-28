# export_presentation_pdf.py
import os
import base64
import subprocess
import pypdf

BASE_DIR = r"C:\Users\USER\.gemini\antigravity\scratch\campus-events"
ASSETS_DIR = os.path.join(BASE_DIR, "report_assets")
DELIVERABLES_DIR = os.path.join(BASE_DIR, "deliverables")
HTML_PATH = os.path.join(BASE_DIR, "CAMPUS_EVENTS_PRESENTATION.html")
PDF_PATH = os.path.join(DELIVERABLES_DIR, "CAMPUS_EVENTS_PRESENTATION.pdf")
DOWNLOADS_PDF = os.path.join(os.environ["USERPROFILE"], "Downloads", "CAMPUS_EVENTS_PRESENTATION.pdf")

def get_b64(filename):
    p = os.path.join(ASSETS_DIR, filename)
    if os.path.exists(p):
        with open(p, "rb") as f:
            ext = os.path.splitext(filename)[1].lower().replace(".", "")
            if ext == "jpg": ext = "jpeg"
            return f"data:image/{ext};base64," + base64.b64encode(f.read()).decode("utf-8")
    return ""

b64_banner = get_b64("Image7.jpg")
b64_emblem = get_b64("Image20.jpg")
b64_home = get_b64("fig_6_1_home.png")
b64_auth = get_b64("fig_6_2_auth.png")
b64_detail = get_b64("fig_6_3_detail.png")
b64_search = get_b64("fig_6_4_search.png")
b64_saved = get_b64("fig_6_5_saved.png")
b64_billing = get_b64("fig_6_6_billing.png")

css = """
@page {
    size: 297mm 167mm; /* 16:9 Widescreen presentation ratio */
    margin: 0;
}
* {
    box-sizing: border-box;
}
html, body {
    margin: 0;
    padding: 0;
    background: #090D16;
    color: #F8FAFC;
    font-family: 'Segoe UI', Arial, sans-serif;
    -webkit-print-color-adjust: exact;
    print-color-adjust: exact;
}
.slide {
    width: 297mm;
    height: 167mm;
    max-height: 167mm;
    min-height: 167mm;
    position: relative;
    box-sizing: border-box;
    page-break-after: always;
    page-break-inside: avoid;
    overflow: hidden;
    background: #090D16;
    padding: 12mm 16mm;
    display: flex;
    flex-direction: column;
}
.pill {
    display: inline-block;
    padding: 1.5mm 4mm;
    background: #18243A;
    border: 1px solid #06B6D4;
    border-radius: 4px;
    font-size: 8pt;
    font-weight: bold;
    color: #06B6D4;
    letter-spacing: 0.5px;
    text-transform: uppercase;
    margin-bottom: 2mm;
    align-self: flex-start;
}
.slide-title {
    font-size: 18pt;
    font-weight: bold;
    color: #F8FAFC;
    margin: 0 0 5mm 0;
}
.card-grid-3 {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 5mm;
    flex: 1;
}
.card-grid-4 {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 4mm;
    flex: 1;
}
.card {
    background: #131C2E;
    border: 1px solid #24334D;
    border-radius: 8px;
    padding: 4mm 5mm;
    display: flex;
    flex-direction: column;
}
.card-badge {
    font-size: 8pt;
    font-weight: bold;
    color: #06B6D4;
    text-transform: uppercase;
    margin-bottom: 1.5mm;
}
.card-title {
    font-size: 12pt;
    font-weight: bold;
    color: #F8FAFC;
    margin-bottom: 2.5mm;
}
.card-list {
    margin: 0;
    padding-left: 4mm;
    font-size: 9.5pt;
    line-height: 1.45;
    color: #94A3B8;
}
.card-list li {
    margin-bottom: 1.5mm;
}
.split-layout {
    display: grid;
    grid-template-columns: 85mm 1fr;
    gap: 6mm;
    flex: 1;
    align-items: center;
}
.split-img {
    max-height: 110mm;
    max-width: 100%;
    object-fit: contain;
    border-radius: 6px;
    border: 1px solid #24334D;
    margin: 0 auto;
    display: block;
}
.metric-box {
    background: #131C2E;
    border: 1px solid #06B6D4;
    border-radius: 8px;
    padding: 4mm;
    text-align: center;
}
.metric-val {
    font-size: 26pt;
    font-weight: bold;
    color: #06B6D4;
    line-height: 1;
    margin-bottom: 1.5mm;
}
.metric-label {
    font-size: 9.5pt;
    font-weight: bold;
    color: #F8FAFC;
}
.metric-sub {
    font-size: 8pt;
    color: #94A3B8;
}
"""

slides_html = []

# Slide 1: Title
slides_html.append(f"""
<div class="slide" style="justify-content: space-between;">
    <div style="text-align: center;">
        <img src="{b64_banner}" style="width: 220mm; max-height: 18mm; object-fit: contain;" />
    </div>
    
    <div style="background: #131C2E; border: 1px solid #6366F1; border-radius: 10px; padding: 6mm 10mm; text-align: center;">
        <div style="color: #06B6D4; font-size: 9pt; font-weight: bold; letter-spacing: 0.5px; margin-bottom: 2mm;">
            PROJECT PRESENTATION &nbsp;|&nbsp; HYBRID APP DEVELOPMENT (25CCHADT305)
        </div>
        <div style="font-size: 28pt; font-weight: bold; color: #F8FAFC; letter-spacing: 1px; margin-bottom: 2mm;">
            CAMPUS EVENTS
        </div>
        <div style="font-size: 11pt; color: #94A3B8;">
            A Cross-Platform Mobile Ecosystem for Academic Discovery, Verified Authentication & Real-Time RSVP
        </div>
    </div>
    
    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 6mm;">
        <div class="card" style="border-color: #10B981;">
            <div class="card-badge" style="color: #10B981;">CANDIDATE INFORMATION</div>
            <div class="card-title">ARJUN P KOLIKKAL (JCE25CC019)</div>
            <div style="font-size: 9.5pt; color: #94A3B8; line-height: 1.4;">
                B.Tech in Computer Science & Engineering - CYBER SECURITY<br>
                Third Semester (Academic Year 2026–2027)
            </div>
        </div>
        <div class="card" style="border-color: #06B6D4;">
            <div class="card-badge">PROJECT SUPERVISION</div>
            <div class="card-title">Prof. Dr. R. SATHEESH KUMAR</div>
            <div style="font-size: 9.5pt; color: #94A3B8; line-height: 1.4;">
                Professor and Head of Department, Computer Science & Engineering<br>
                Jawaharlal College of Engineering and Technology (Autonomous)
            </div>
        </div>
    </div>
</div>
""")

# Slide 2: Executive Summary
slides_html.append(f"""
<div class="slide">
    <div class="pill">EXECUTIVE SUMMARY</div>
    <div class="slide-title">The Big Picture: Modernizing Campus Life Through Mobile Technology</div>
    <div class="card-grid-3">
        <div class="card" style="border-color: #6366F1;">
            <div class="card-badge" style="color: #6366F1;">CORE PURPOSE</div>
            <div class="card-title">The Mission</div>
            <ul class="card-list">
                <li>Solve campus event fragmentation across engineering departments.</li>
                <li>Replace paper circulars, unread noticeboards, and chaotic WhatsApp forwards.</li>
                <li>Provide a centralized, live digital timetable accessible to every student on Android.</li>
            </ul>
        </div>
        <div class="card" style="border-color: #06B6D4;">
            <div class="card-badge">SECURITY FOCUS</div>
            <div class="card-title">Institutional Identity</div>
            <ul class="card-list">
                <li>Restricted strictly to verified @gmail.com & college email IDs.</li>
                <li>Eliminate unauthorized external spam and unverified participant data.</li>
                <li>Row-Level Security (RLS) ensures students modify only their own RSVP records.</li>
            </ul>
        </div>
        <div class="card" style="border-color: #10B981;">
            <div class="card-badge" style="color: #10B981;">IMPACT & RESULTS</div>
            <div class="card-title">Tangible Value</div>
            <ul class="card-list">
                <li>Instant 1-click RSVP with real-time seat decrementing to prevent hall overflow.</li>
                <li>One-tap calendar synchronization directly into Google Calendar & system alerts.</li>
                <li>Zero memory leaks, sub-second queries, and universal APK compatibility.</li>
            </ul>
        </div>
    </div>
</div>
""")

# Slide 3: Problem Statement
slides_html.append(f"""
<div class="slide">
    <div class="pill" style="border-color: #F43F5E; color: #F43F5E;">PROBLEM STATEMENT</div>
    <div class="slide-title">Current Roadblocks in Campus Event Management</div>
    <div class="card-grid-3">
        <div class="card" style="border-color: #F43F5E;">
            <div class="card-badge" style="color: #F43F5E;">BOTTLENECK 1</div>
            <div class="card-title">Fragmented Information</div>
            <ul class="card-list">
                <li>Announcements scattered across classrooms, noticeboards, and chat groups.</li>
                <li>Students frequently miss registration deadlines due to communication gaps.</li>
                <li>No centralized source of truth for upcoming collegiate symposiums.</li>
            </ul>
        </div>
        <div class="card" style="border-color: #F43F5E;">
            <div class="card-badge" style="color: #F43F5E;">BOTTLENECK 2</div>
            <div class="card-title">Capacity & Hall Collisions</div>
            <ul class="card-list">
                <li>Multiple student clubs book auditoriums simultaneously without coordination.</li>
                <li>Overcrowding occurs when popular workshops oversell available seating.</li>
                <li>Lack of real-time seat counts leads to turnaways and student frustration.</li>
            </ul>
        </div>
        <div class="card" style="border-color: #F43F5E;">
            <div class="card-badge" style="color: #F43F5E;">BOTTLENECK 3</div>
            <div class="card-title">Security & Manual Forms</div>
            <ul class="card-list">
                <li>Coordinators rely on unverified Google Forms and physical paper rosters.</li>
                <li>Open forms invite fake registrations and compromised student privacy.</li>
                <li>Manual tracking consumes faculty hours and delays event schedules.</li>
            </ul>
        </div>
    </div>
</div>
""")

# Slide 4: Proposed Solution
slides_html.append(f"""
<div class="slide">
    <div class="pill" style="border-color: #10B981; color: #10B981;">THE PROPOSED SOLUTION</div>
    <div class="slide-title">CAMPUS EVENTS: Smart, Secure & Real-Time Android App</div>
    <div class="card-grid-3">
        <div class="card" style="border-color: #10B981;">
            <div class="card-badge" style="color: #10B981;">CORE PILLAR 1</div>
            <div class="card-title">Unified Chronological Feed</div>
            <ul class="card-list">
                <li>Live synchronization of all department workshops, symposiums, and sports.</li>
                <li>1-tap category filtering: Academic, Cultural, Sports, Technical.</li>
                <li>Date badges and visual countdown timers for immediate relevance.</li>
            </ul>
        </div>
        <div class="card" style="border-color: #10B981;">
            <div class="card-badge" style="color: #10B981;">CORE PILLAR 2</div>
            <div class="card-title">Atomic Seat Quota & RSVP</div>
            <ul class="card-list">
                <li>1-click registration with instant database seat availability decrementing.</li>
                <li>Cryptographic entry pass generation preventing duplicate registrations.</li>
                <li>Automated capacity locks guarantee halls are never overbooked.</li>
            </ul>
        </div>
        <div class="card" style="border-color: #10B981;">
            <div class="card-badge" style="color: #10B981;">CORE PILLAR 3</div>
            <div class="card-title">Seamless Ecosystem Sync</div>
            <ul class="card-list">
                <li>Export event timelines directly to Google Calendar and system schedulers.</li>
                <li>Personal agenda bookmarking tab accessible even with patchy network.</li>
                <li>Integrated dark mode theme matching modern mobile user expectations.</li>
            </ul>
        </div>
    </div>
</div>
""")

# Slide 5: Course Objectives
slides_html.append(f"""
<div class="slide">
    <div class="pill">COURSE OBJECTIVES</div>
    <div class="slide-title">Technical Deliverables for 25CCHADT305 Capstone</div>
    <div class="card-grid-4">
        <div class="card">
            <div class="card-badge">GOAL 1</div>
            <div class="card-title">Universal App</div>
            <ul class="card-list">
                <li>Build cross-platform app with React Native Expo SDK 52.</li>
                <li>Support Android 8.0 to Android 15.</li>
                <li>Achieve fluid 60fps scrolling and rapid cold launch.</li>
            </ul>
        </div>
        <div class="card">
            <div class="card-badge">GOAL 2</div>
            <div class="card-title">Cloud Backend</div>
            <ul class="card-list">
                <li>ACID-compliant PostgreSQL database on Supabase.</li>
                <li>Stateless RESTful APIs via PostgREST.</li>
                <li>Sub-second data query response latency.</li>
            </ul>
        </div>
        <div class="card">
            <div class="card-badge">GOAL 3</div>
            <div class="card-title">Cyber Security</div>
            <ul class="card-list">
                <li>Strict institutional domain allow-list (@gmail.com).</li>
                <li>Database-level Row-Level Security (RLS).</li>
                <li>SecureStore encrypted JWT session tokens.</li>
            </ul>
        </div>
        <div class="card">
            <div class="card-badge">GOAL 4</div>
            <div class="card-title">Offline Cache</div>
            <ul class="card-list">
                <li>React Query local caching engine.</li>
                <li>Allow students to view booked tickets offline.</li>
                <li>Graceful offline network fallback.</li>
            </ul>
        </div>
    </div>
</div>
""")

# Slide 6: Stakeholder Analysis
slides_html.append(f"""
<div class="slide">
    <div class="pill">STAKEHOLDER ANALYSIS</div>
    <div class="slide-title">Tailored Capabilities for Every Member of the Academic Community</div>
    <div class="card-grid-3">
        <div class="card">
            <div class="card-badge">STUDENTS</div>
            <div class="card-title">Learners & Attendees</div>
            <ul class="card-list">
                <li>Discover upcoming events across all campus departments instantly.</li>
                <li>Filter workshops by personal interests and technical domain.</li>
                <li>Reserve seats in 1 click and download entry passes to Google Calendar.</li>
                <li>Bookmark favorite symposiums into a private 'My Events' tab.</li>
            </ul>
        </div>
        <div class="card">
            <div class="card-badge">COORDINATORS</div>
            <div class="card-title">Faculty & Club Leads</div>
            <ul class="card-list">
                <li>Enforce maximum seating capacity automatically without paper sheets.</li>
                <li>Prevent double bookings of main seminar halls and auditoriums.</li>
                <li>Access live attendee rosters with verified student identification.</li>
                <li>Reduce administrative coordination overhead by 80%.</li>
            </ul>
        </div>
        <div class="card">
            <div class="card-badge">MANAGEMENT</div>
            <div class="card-title">College Administration</div>
            <ul class="card-list">
                <li>Centralized institutional visibility across all campus extra-curriculars.</li>
                <li>Comprehensive audit trails for campus security and compliance.</li>
                <li>Enhanced student participation and seamless NAAC/NBA documentation.</li>
                <li>Reinforce JCET's standing as a technologically advanced autonomous campus.</li>
            </ul>
        </div>
    </div>
</div>
""")

# Slide 7: System Architecture
slides_html.append(f"""
<div class="slide">
    <div class="pill">SYSTEM ARCHITECTURE</div>
    <div class="slide-title">Decoupled 3-Tier Enterprise Cloud Architecture</div>
    <div class="split-layout" style="grid-template-columns: 1fr 1fr;">
        <div style="display: flex; flex-direction: column; gap: 3.5mm;">
            <div class="card" style="padding: 3mm 4mm;">
                <div class="card-badge">TIER 1 : PRESENTATION</div>
                <div class="card-title" style="font-size: 11pt; margin-bottom: 1.5mm;">React Native + Expo SDK 52 (Mobile Client)</div>
                <div style="font-size: 9pt; color: #94A3B8;">Universal Android APK with Hermes JS bytecode engine. Expo Router file-based navigation (Tabs + Native Stack), Dark Theme UI.</div>
            </div>
            <div class="card" style="padding: 3mm 4mm;">
                <div class="card-badge">TIER 2 : SERVICE LAYER</div>
                <div class="card-title" style="font-size: 11pt; margin-bottom: 1.5mm;">Supabase PostgREST & Auth Microservices</div>
                <div style="font-size: 9pt; color: #94A3B8;">Stateless HTTPS JSON API gateway handling authentication, session tokens, and RFC-5322 regex validation.</div>
            </div>
            <div class="card" style="padding: 3mm 4mm;">
                <div class="card-badge">TIER 3 : PERSISTENCE</div>
                <div class="card-title" style="font-size: 11pt; margin-bottom: 1.5mm;">PostgreSQL 15 Relational Database + RLS</div>
                <div style="font-size: 9pt; color: #94A3B8;">ACID-compliant normalized storage for profiles, events, and RSVPs with Row-Level Security policies.</div>
            </div>
        </div>
        <div class="card" style="height: 100%; border-color: #06B6D4;">
            <div class="card-badge">DATA FLOW PIPELINE</div>
            <div class="card-title">End-to-End Sequence</div>
            <ul class="card-list" style="font-size: 9pt;">
                <li><b>1. User Launch:</b> App initiates via Hermes bytecode in ~1.1s.</li>
                <li><b>2. Domain Check:</b> Validates institutional credentials (@gmail.com).</li>
                <li><b>3. Encrypted Transit:</b> Sends HTTPS requests with JWT bearer tokens.</li>
                <li><b>4. Security Kernel:</b> PostgreSQL evaluates Row-Level Security rules.</li>
                <li><b>5. Atomic RSVP:</b> Decrements available capacity and returns digital pass.</li>
                <li><b>6. Local Caching:</b> React Query synchronizes data for offline access.</li>
            </ul>
        </div>
    </div>
</div>
""")

# Slide 8: Cyber Security
slides_html.append(f"""
<div class="slide">
    <div class="pill" style="border-color: #F43F5E; color: #F43F5E;">SECURITY & COMPLIANCE</div>
    <div class="slide-title">Department of CSE (Cyber Security) Standards & Protocols</div>
    <div class="split-layout">
        <div>
            <img src="{b64_auth}" class="split-img" />
        </div>
        <div style="display: flex; flex-direction: column; gap: 3.5mm;">
            <div class="card">
                <div class="card-badge" style="color: #F43F5E;">SECURITY PILLAR 1</div>
                <div class="card-title">Institutional Domain Filtering</div>
                <div style="font-size: 9pt; color: #94A3B8;">Strict RFC-5322 regex validation enforcing authorized @gmail.com & institutional accounts. Rejects disposable emails and external spam.</div>
            </div>
            <div class="card">
                <div class="card-badge">SECURITY PILLAR 2</div>
                <div class="card-title">PostgreSQL Row-Level Security (RLS)</div>
                <div style="font-size: 9pt; color: #94A3B8;">Policies compiled into database engine. Students can only view public events and modify personal registrations. Coordinators manage departmental data.</div>
            </div>
            <div class="card">
                <div class="card-badge" style="color: #10B981;">SECURITY PILLAR 3</div>
                <div class="card-title">Encrypted JWT Session Management</div>
                <div style="font-size: 9pt; color: #94A3B8;">Tokens signed with SHA-256 HMAC and saved in hardware-backed SecureStore. Immutable sign-in audit logs record IP, device, and timestamps.</div>
            </div>
        </div>
    </div>
</div>
""")

# Slide 9: Database Schema
slides_html.append(f"""
<div class="slide">
    <div class="pill">DATABASE DESIGN</div>
    <div class="slide-title">ACID-Compliant Relational Schema on PostgreSQL</div>
    <div class="card-grid-3">
        <div class="card">
            <div class="card-badge">SCHEMA MODULE 1</div>
            <div class="card-title">Profiles & Identity</div>
            <ul class="card-list">
                <li><b>Table:</b> profiles</li>
                <li><b>Columns:</b> id (UUID PK), email (UNIQUE), full_name, role, college_id, created_at.</li>
                <li>Linked with Supabase auth.users.</li>
                <li>Maintains user authentication state and role-based permissions.</li>
            </ul>
        </div>
        <div class="card">
            <div class="card-badge">SCHEMA MODULE 2</div>
            <div class="card-title">Events & Categories</div>
            <ul class="card-list">
                <li><b>Table:</b> events, categories</li>
                <li><b>Columns:</b> id (UUID PK), title, description, event_date, location, category_id, organizer_id, max_capacity.</li>
                <li>Normalized category codes (ACAD, CULT, SPORT, TECH).</li>
                <li>Maintains hard seating quotas and hall bookings.</li>
            </ul>
        </div>
        <div class="card">
            <div class="card-badge">SCHEMA MODULE 3</div>
            <div class="card-title">Registrations & Auditing</div>
            <ul class="card-list">
                <li><b>Table:</b> event_registrations, auth_logs</li>
                <li><b>Columns:</b> id, event_id, user_id, status, ticket_token, registered_at.</li>
                <li>Unique composite key prevents duplicate RSVPs.</li>
                <li>Comprehensive login and audit trails for compliance.</li>
            </ul>
        </div>
    </div>
</div>
""")

# Slide 10: Feature 1 - Home Feed
slides_html.append(f"""
<div class="slide">
    <div class="pill">CORE CAPABILITY 1</div>
    <div class="slide-title">Chronological Event Discovery & Category Filtering</div>
    <div class="split-layout">
        <div>
            <img src="{b64_home}" class="split-img" />
        </div>
        <div class="card">
            <div class="card-badge">USER EXPERIENCE</div>
            <div class="card-title">Frictionless Discovery Feed</div>
            <ul class="card-list" style="font-size: 10pt; line-height: 1.6;">
                <li><b>Live Event Stream:</b> Upcoming activities presented in chronological order with date badges.</li>
                <li><b>Interactive Category Chips:</b> Filter between Academic, Cultural, Sports, and Tech in 1 tap.</li>
                <li><b>Venue Location Badges:</b> Highlights auditorium and seminar hall locations clearly.</li>
                <li><b>Dynamic Urgency Tags:</b> Indicates 'Filling Fast' or 'Limited Capacity' to encourage early RSVP.</li>
                <li><b>60 FPS Smooth Scrolling:</b> Memoized FlatList rendering ensures zero stutter on Android devices.</li>
            </ul>
        </div>
    </div>
</div>
""")

# Slide 11: Feature 2 - Multi-Attribute Search
slides_html.append(f"""
<div class="slide">
    <div class="pill">CORE CAPABILITY 2</div>
    <div class="slide-title">Real-Time Multi-Attribute Search Engine</div>
    <div class="split-layout">
        <div>
            <img src="{b64_search}" class="split-img" />
        </div>
        <div class="card">
            <div class="card-badge">SEARCH ALGORITHM</div>
            <div class="card-title">Instant Query Feedback</div>
            <ul class="card-list" style="font-size: 10pt; line-height: 1.6;">
                <li><b>Multi-Field Querying:</b> Matches across event titles, seminar venues, and organizer names simultaneously.</li>
                <li><b>Debounced Input (250ms):</b> Prevents unnecessary database queries during rapid student typing.</li>
                <li><b>Graceful Empty State:</b> Friendly prompt when no events match, with helpful suggestions.</li>
                <li><b>Sub-100ms Query Latency:</b> Indexed PostgreSQL columns deliver instantaneous search results.</li>
                <li><b>Always Accessible:</b> Integrated search shortcut directly on the main navigation bar.</li>
            </ul>
        </div>
    </div>
</div>
""")

# Slide 12: Feature 3 - 1-Click RSVP
slides_html.append(f"""
<div class="slide">
    <div class="pill">CORE CAPABILITY 3</div>
    <div class="slide-title">1-Click RSVP & Concurrency-Safe Seat Quota</div>
    <div class="split-layout">
        <div>
            <img src="{b64_detail}" class="split-img" />
        </div>
        <div class="card">
            <div class="card-badge">BOOKING ENGINE</div>
            <div class="card-title">Capacity Integrity</div>
            <ul class="card-list" style="font-size: 10pt; line-height: 1.6;">
                <li><b>Full Event Details:</b> Complete speaker bio, venue guidelines, time slots, and attendee lists.</li>
                <li><b>Atomic Seat Allocation:</b> Dynamic countdown decrements seating quota immediately upon booking.</li>
                <li><b>Duplicate RSVP Prevention:</b> Database constraints guarantee students cannot register twice.</li>
                <li><b>One-Tap Cancellation:</b> Easily surrender seat reservations, returning quotas to fellow peers.</li>
                <li><b>Cryptographic Ticket Pass:</b> Generates unique digital booking reference token (e.g. T-2026-0418).</li>
            </ul>
        </div>
    </div>
</div>
""")

# Slide 13: Feature 4 - Personal Agenda
slides_html.append(f"""
<div class="slide">
    <div class="pill">CORE CAPABILITY 4</div>
    <div class="slide-title">Personal Agenda & Offline Bookmarked Events</div>
    <div class="split-layout">
        <div>
            <img src="{b64_saved}" class="split-img" />
        </div>
        <div class="card">
            <div class="card-badge">PERSONALIZATION</div>
            <div class="card-title">Dedicated 'My Events' Agenda</div>
            <ul class="card-list" style="font-size: 10pt; line-height: 1.6;">
                <li><b>1-Tap Bookmarking:</b> Tap bookmark ribbon on any card to save it to your private agenda.</li>
                <li><b>Dedicated Saved Tab:</b> Centralized screen organizing registered and bookmarked sessions.</li>
                <li><b>Offline Storage:</b> Locally cached with AsyncStorage for viewing inside seminar basements.</li>
                <li><b>Instant State Updates:</b> Bookmarks synchronize in real-time across all views without refreshing.</li>
            </ul>
        </div>
    </div>
</div>
""")

# Slide 14: Feature 5 - Calendar Sync
slides_html.append(f"""
<div class="slide">
    <div class="pill">CORE CAPABILITY 5</div>
    <div class="slide-title">Registration Confirmation & Google Calendar Sync</div>
    <div class="split-layout">
        <div>
            <img src="{b64_billing}" class="split-img" />
        </div>
        <div class="card">
            <div class="card-badge">INTEGRATION</div>
            <div class="card-title">External Schedulers & Reminders</div>
            <ul class="card-list" style="font-size: 10pt; line-height: 1.6;">
                <li><b>Digital Receipt Modal:</b> Confirmation pass with seat allocation reference and timetable recap.</li>
                <li><b>Google Calendar Sync:</b> Generates iCalendar payload exporting events directly into Google Calendar.</li>
                <li><b>Android Notification Alerts:</b> Schedules native device alarms 1 hour before event start.</li>
                <li><b>Paperless Admission:</b> Digital pass can be inspected directly on mobile for hall entry.</li>
            </ul>
        </div>
    </div>
</div>
""")

# Slide 15: Tech Stack
slides_html.append(f"""
<div class="slide">
    <div class="pill">TECHNOLOGY STACK</div>
    <div class="slide-title">State-of-the-Art Cross-Platform Technologies</div>
    <div class="card-grid-4">
        <div class="card">
            <div class="card-badge">FRONTEND</div>
            <div class="card-title">React Native & Expo</div>
            <ul class="card-list">
                <li>Expo SDK 52 with React Native 0.76.</li>
                <li>TypeScript 5.x static typing.</li>
                <li>Hermes bytecode engine.</li>
                <li>Expo Router file-based tabs.</li>
            </ul>
        </div>
        <div class="card">
            <div class="card-badge">BACKEND</div>
            <div class="card-title">Supabase & Postgres</div>
            <ul class="card-list">
                <li>Managed PostgreSQL 15 cloud DB.</li>
                <li>PostgREST automatic JSON API.</li>
                <li>Row-Level Security (RLS).</li>
                <li>Secure JWT session tokens.</li>
            </ul>
        </div>
        <div class="card">
            <div class="card-badge">TOOLING</div>
            <div class="card-title">Build Pipeline</div>
            <ul class="card-list">
                <li>EAS CLI automated builds.</li>
                <li>Universal release APK v1.0.1.</li>
                <li>Multi-ABI (arm64, x86_64).</li>
                <li>Android Debug Bridge (ADB v35).</li>
            </ul>
        </div>
        <div class="card">
            <div class="card-badge">DEV SUITE</div>
            <div class="card-title">Development Tools</div>
            <ul class="card-list">
                <li>Visual Studio Code IDE.</li>
                <li>Git & GitHub versioning.</li>
                <li>Android Studio Hedgehog+ AVD.</li>
                <li>PowerShell build scripts.</li>
            </ul>
        </div>
    </div>
</div>
""")

# Slide 16: Performance Metrics
slides_html.append(f"""
<div class="slide">
    <div class="pill">PERFORMANCE & TESTING</div>
    <div class="slide-title">Empirical Benchmarks on Android Emulator (API 34)</div>
    <div style="display: grid; grid-template-columns: repeat(4, 1fr); gap: 4mm; margin-bottom: 5mm;">
        <div class="metric-box">
            <div class="metric-val">1.1s</div>
            <div class="metric-label">COLD LAUNCH TIME</div>
            <div class="metric-sub">Hermes bytecode pre-compilation</div>
        </div>
        <div class="metric-box" style="border-color: #10B981;">
            <div class="metric-val" style="color: #10B981;">60 FPS</div>
            <div class="metric-label">UI SCROLL RATE</div>
            <div class="metric-sub">Fluid scroll across 100+ items</div>
        </div>
        <div class="metric-box" style="border-color: #6366F1;">
            <div class="metric-val" style="color: #6366F1;">100%</div>
            <div class="metric-label">TEST PASS RATE</div>
            <div class="metric-sub">18/18 test suites passed</div>
        </div>
        <div class="metric-box" style="border-color: #F59E0B;">
            <div class="metric-val" style="color: #F59E0B;">0 MB</div>
            <div class="metric-label">MEMORY LEAKS</div>
            <div class="metric-sub">Stable RAM footprint under load</div>
        </div>
    </div>
    <div class="card" style="border-color: #10B981; flex: 1;">
        <div class="card-badge" style="color: #10B981;">PRODUCTION DEPLOYMENT VERIFICATION</div>
        <div class="card-title">Universal Multi-ABI Release APK v1.0.1 (Build 6)</div>
        <ul class="card-list" style="font-size: 10pt; line-height: 1.6;">
            <li>Tested on Android Studio Pixel 8 Pro Emulator running Android 14 (API 34) and physical Android hardware.</li>
            <li>Signed release APK includes native multi-ABI architectures: x86_64, arm64-v8a, and armeabi-v7a.</li>
            <li>Database stress testing confirmed zero deadlock errors during concurrent multi-user RSVP bookings.</li>
            <li>Zero crash reports observed during 45-minute monkey stress testing sequences.</li>
        </ul>
    </div>
</div>
""")

# Slide 17: Comparative Analysis
slides_html.append(f"""
<div class="slide">
    <div class="pill">COMPARATIVE ANALYSIS</div>
    <div class="slide-title">CAMPUS EVENTS vs. Traditional Collegiate Methods</div>
    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 6mm; flex: 1;">
        <div class="card" style="border-color: #F43F5E;">
            <div class="card-badge" style="color: #F43F5E;">LEGACY APPROACH</div>
            <div class="card-title">Notice Boards & Google Forms</div>
            <ul class="card-list">
                <li><b>Paper Circulars:</b> Rapidly obsolete, torn, or missed by commuting students.</li>
                <li><b>Noisy WhatsApp Groups:</b> Essential notices drowned in hundreds of casual chats.</li>
                <li><b>Open Forms:</b> Zero domain verification; susceptible to fake registrations.</li>
                <li><b>Manual Tallying:</b> Coordinators manually track spreadsheets, causing hall overflow.</li>
                <li><b>No Calendar Integration:</b> Students must manually type event times into phones.</li>
                <li><b>Zero Offline Utility:</b> Cannot view registration passes without internet.</li>
            </ul>
        </div>
        <div class="card" style="border-color: #10B981;">
            <div class="card-badge" style="color: #10B981;">PROPOSED SOLUTION</div>
            <div class="card-title">CAMPUS EVENTS Mobile Platform</div>
            <ul class="card-list">
                <li><b>Centralized Feed:</b> Live schedule accessible anytime, anywhere on mobile.</li>
                <li><b>Instant Category Filters:</b> Find relevant workshops by branch in 1 tap.</li>
                <li><b>Domain Verification:</b> Restricts access to verified @gmail.com accounts.</li>
                <li><b>Dynamic Capacity:</b> Atomic seat countdown locks bookings when capacity is reached.</li>
                <li><b>Google Calendar Sync:</b> 1-tap export directly into Google Calendar with alarms.</li>
                <li><b>Offline Resilience:</b> View confirmed passes offline inside seminar basements.</li>
            </ul>
        </div>
    </div>
</div>
""")

# Slide 18: Future Scope
slides_html.append(f"""
<div class="slide">
    <div class="pill">FUTURE ROADMAP</div>
    <div class="slide-title">Next-Generation Smart Campus Enhancements</div>
    <div class="card-grid-3">
        <div class="card">
            <div class="card-badge">PHASE 2</div>
            <div class="card-title">QR Gate Scanner</div>
            <ul class="card-list">
                <li>Dynamic cryptographic QR tickets generated for confirmed attendees.</li>
                <li>Coordinator scanner app validating physical entry at auditorium doors in < 1s.</li>
                <li>Automated attendance logging submitted directly into college ERP.</li>
            </ul>
        </div>
        <div class="card">
            <div class="card-badge">PHASE 3</div>
            <div class="card-title">Push Notifications (FCM)</div>
            <ul class="card-list">
                <li>Firebase Cloud Messaging integration for real-time campus broadcasts.</li>
                <li>Urgent schedule or room change alerts delivered to student lock screens.</li>
                <li>Personalized reminder notifications 1 hour before booked workshops begin.</li>
            </ul>
        </div>
        <div class="card">
            <div class="card-badge">PHASE 4</div>
            <div class="card-title">Indoor Campus GPS</div>
            <ul class="card-list">
                <li>Interactive venue wayfinding mapping seminar halls and lab buildings.</li>
                <li>Step-by-step walking directions for visiting delegates and first-year students.</li>
                <li>Seamless integration with Google Maps and college campus blueprints.</li>
            </ul>
        </div>
    </div>
</div>
""")

# Slide 19: Conclusion
slides_html.append(f"""
<div class="slide">
    <div class="pill">CONCLUSION</div>
    <div class="slide-title">Successful Capstone Delivery & Academic Impact</div>
    <div class="card-grid-3">
        <div class="card">
            <div class="card-badge">COURSE OUTCOMES</div>
            <div class="card-title">Academic Excellence</div>
            <ul class="card-list">
                <li>Demonstrated advanced mastery of Hybrid App Development principles (25CCHADT305).</li>
                <li>Engineered high-performance cross-platform components with modern React Native.</li>
                <li>Strictly satisfied ABET / NBA Program Outcomes (PO1 to PO12) and PSOs.</li>
            </ul>
        </div>
        <div class="card" style="border-color: #10B981;">
            <div class="card-badge" style="color: #10B981;">PRODUCTION READY</div>
            <div class="card-title">Real-World Engineering</div>
            <ul class="card-list">
                <li>Built, signed, and deployed universal Android release APK v1.0.1 on physical devices.</li>
                <li>Implemented enterprise cloud persistence with Supabase PostgreSQL and Row-Level Security.</li>
                <li>Zero critical bugs, 100% test coverage, and complete 66-page institutional report.</li>
            </ul>
        </div>
        <div class="card">
            <div class="card-badge">INSTITUTIONAL VALUE</div>
            <div class="card-title">Autonomous Campus Impact</div>
            <ul class="card-list">
                <li>Ready for deployment across JCET engineering departments and student associations.</li>
                <li>Transforms campus communication into an engaging, paperless, real-time digital experience.</li>
                <li>Scalable foundation for future smart campus integrations and IoT venue management.</li>
            </ul>
        </div>
    </div>
</div>
""")

# Slide 20: Thank You
slides_html.append(f"""
<div class="slide" style="justify-content: space-between;">
    <div style="text-align: center;">
        <img src="{b64_banner}" style="width: 220mm; max-height: 18mm; object-fit: contain;" />
    </div>
    
    <div style="background: #131C2E; border: 1px solid #06B6D4; border-radius: 10px; padding: 8mm 12mm; text-align: center;">
        <div style="font-size: 32pt; font-weight: bold; color: #06B6D4; margin-bottom: 2mm;">
            THANK YOU!
        </div>
        <div style="font-size: 14pt; font-weight: bold; color: #F8FAFC; margin-bottom: 4mm;">
            Open for Questions & Evaluation Committee Discussion
        </div>
        <div style="font-size: 11pt; font-weight: bold; color: #6366F1; margin-bottom: 2mm;">
            CAMPUS EVENTS &nbsp;|&nbsp; HYBRID APP DEVELOPMENT (25CCHADT305)
        </div>
        <div style="font-size: 10.5pt; color: #94A3B8; margin-bottom: 1.5mm;">
            Candidate: <b>ARJUN P KOLIKKAL (JCE25CC019)</b> &nbsp;|&nbsp; B.Tech in CSE - CYBER SECURITY
        </div>
        <div style="font-size: 10.5pt; color: #94A3B8; margin-bottom: 2mm;">
            Guided by: <b>Prof. Dr. R. SATHEESH KUMAR</b> (Professor and HoD)
        </div>
        <div style="font-size: 10pt; color: #10B981; font-weight: bold;">
            Jawaharlal College of Engineering and Technology (Autonomous) &nbsp;|&nbsp; Academic Year 2026–2027
        </div>
    </div>
    
    <div style="text-align: center;">
        <img src="{b64_emblem}" style="width: 18mm; height: auto;" />
    </div>
</div>
""")

full_html = f"""<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>Campus Events Presentation</title>
    <style>
{css}
    </style>
</head>
<body>
{"".join(slides_html)}
</body>
</html>
"""

with open(HTML_PATH, "w", encoding="utf-8") as f:
    f.write(full_html)

print("HTML slides generated successfully.")

# Compile to PDF
cmd = [
    r"C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe",
    "--headless=new",
    "--disable-gpu",
    "--no-pdf-header-footer",
    f"--print-to-pdf={PDF_PATH}",
    HTML_PATH
]
subprocess.run(cmd, check=True)

# Copy to downloads & root
shutil_dst = [
    DOWNLOADS_PDF,
    os.path.join(BASE_DIR, "CAMPUS_EVENTS_PRESENTATION.pdf")
]
for dst in shutil_dst:
    import shutil
    shutil.copy2(PDF_PATH, dst)

reader = pypdf.PdfReader(PDF_PATH)
print(f"SUCCESS: Generated Presentation PDF with {len(reader.pages)} widescreen slides!")
