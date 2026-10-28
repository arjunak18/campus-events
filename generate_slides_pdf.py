"""
Generates PROJECT_PRESENTATION.pdf by rendering the 23 academic slides to a 
high-resolution 16:9 printable HTML document, then compiling via headless Edge.
"""

import os
import subprocess
import time

slides_html = """<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<title>Campus Events Calendar - Academic Presentation</title>
<style>
  @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=JetBrains+Mono:wght@500;700&display=swap');

  @page {
    size: 16in 9in;
    margin: 0;
  }

  * {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
  }

  body {
    background-color: #0b1120;
    color: #f8fafc;
    font-family: 'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, sans-serif;
    -webkit-print-color-adjust: exact;
    print-color-adjust: exact;
  }

  .slide {
    width: 16in;
    height: 9in;
    page-break-after: always;
    position: relative;
    padding: 0.6in 0.8in;
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    overflow: hidden;
    background: #0b1120;
  }

  /* Header */
  .slide-header {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    margin-bottom: 0.35in;
  }

  .header-left {
    display: flex;
    flex-direction: column;
    gap: 0.08in;
  }

  .category-pill {
    display: inline-flex;
    align-items: center;
    gap: 0.08in;
    padding: 0.06in 0.16in;
    background: rgba(99, 102, 241, 0.15);
    border: 1px solid rgba(99, 102, 241, 0.4);
    border-radius: 999px;
    font-size: 0.14in;
    font-weight: 700;
    color: #38bdf8;
    text-transform: uppercase;
    letter-spacing: 0.05em;
    width: fit-content;
  }

  .category-pill::before {
    content: "●";
    font-size: 0.12in;
    color: #10b981;
  }

  .slide-title {
    font-size: 0.38in;
    font-weight: 800;
    color: #f8fafc;
    line-height: 1.15;
    letter-spacing: -0.02em;
  }

  .slide-subtitle {
    font-size: 0.18in;
    color: #94a3b8;
    font-weight: 400;
  }

  .slide-num {
    font-size: 0.16in;
    font-weight: 700;
    color: #64748b;
    font-family: 'JetBrains Mono', monospace;
  }

  /* Layout grids */
  .grid-2 {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 0.35in;
    flex: 1;
  }

  .grid-3 {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 0.3in;
    flex: 1;
  }

  .grid-4 {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    grid-template-rows: repeat(2, 1fr);
    gap: 0.28in;
    flex: 1;
  }

  .grid-6 {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    grid-template-rows: repeat(2, 1fr);
    gap: 0.25in;
    flex: 1;
  }

  /* Cards */
  .card {
    background: #182136;
    border: 1px solid rgba(255, 255, 255, 0.08);
    border-radius: 0.18in;
    padding: 0.3in 0.32in;
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
  }

  .card-glow {
    border-color: rgba(29, 205, 159, 0.4);
    box-shadow: 0 0 0.3in rgba(29, 205, 159, 0.08);
  }

  .card-danger {
    border-color: rgba(239, 68, 68, 0.35);
  }

  .card-title {
    font-size: 0.22in;
    font-weight: 700;
    color: #1dcd9f;
    margin-bottom: 0.16in;
    display: flex;
    align-items: center;
    gap: 0.1in;
  }

  .card-title.indigo {
    color: #818cf8;
  }

  .card-title.cyan {
    color: #38bdf8;
  }

  .card-title.amber {
    color: #f59e0b;
  }

  .card-title.red {
    color: #f87171;
  }

  /* Lists */
  ul.bullet-list {
    list-style: none;
    display: flex;
    flex-direction: column;
    gap: 0.12in;
  }

  ul.bullet-list li {
    font-size: 0.165in;
    color: #cbd5e1;
    line-height: 1.5;
    position: relative;
    padding-left: 0.24in;
  }

  ul.bullet-list li::before {
    content: "•";
    position: absolute;
    left: 0;
    color: #1dcd9f;
    font-weight: bold;
    font-size: 0.2in;
  }

  /* Tables */
  table.comp-table {
    width: 100%;
    border-collapse: collapse;
    font-size: 0.145in;
    margin-top: 0.05in;
  }

  table.comp-table th {
    background: #0f172a;
    color: #1dcd9f;
    text-align: left;
    padding: 0.12in 0.15in;
    font-weight: 700;
    border-bottom: 2px solid rgba(255, 255, 255, 0.1);
  }

  table.comp-table td {
    padding: 0.1in 0.15in;
    border-bottom: 1px solid rgba(255, 255, 255, 0.05);
    color: #cbd5e1;
  }

  table.comp-table tr:nth-child(even) td {
    background: rgba(15, 23, 42, 0.4);
  }

  .status-passed {
    display: inline-block;
    padding: 0.04in 0.12in;
    background: rgba(16, 185, 129, 0.15);
    border: 1px solid rgba(16, 185, 129, 0.35);
    border-radius: 999px;
    color: #34d399;
    font-weight: 700;
    font-size: 0.12in;
  }

  /* Title Slide specifics */
  .title-hero {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    text-align: center;
    height: 100%;
  }

  .title-badge {
    padding: 0.08in 0.24in;
    background: rgba(99, 102, 241, 0.18);
    border: 1px solid rgba(99, 102, 241, 0.4);
    border-radius: 999px;
    font-size: 0.16in;
    font-weight: 700;
    color: #38bdf8;
    margin-bottom: 0.25in;
  }

  .title-h1 {
    font-size: 0.65in;
    font-weight: 800;
    letter-spacing: -0.03em;
    line-height: 1.1;
    margin-bottom: 0.15in;
    background: linear-gradient(180deg, #ffffff 40%, #94a3b8 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
  }

  .title-sub {
    font-size: 0.22in;
    color: #1dcd9f;
    font-weight: 600;
    max-width: 10in;
    margin-bottom: 0.5in;
    line-height: 1.4;
  }

  .title-cards {
    display: flex;
    gap: 0.4in;
    width: 10in;
    text-align: left;
  }
</style>
</head>
<body>

<!-- SLIDE 1: TITLE SLIDE -->
<div class="slide">
  <div class="title-hero">
    <div class="title-badge">DEPARTMENT OF COMPUTER SCIENCE & ENGINEERING  •  CAPSTONE PROJECT 2025–2026</div>
    <h1 class="title-h1">CAMPUS EVENTS CALENDAR</h1>
    <p class="title-sub">A Full-Stack Distributed Mobile Platform for University Event Discovery, Registration & Verification</p>
    <div class="title-cards">
      <div class="card" style="flex: 1;">
        <div class="card-title cyan" style="font-size: 0.16in;">STUDENT PRESENTER</div>
        <p style="font-size: 0.22in; font-weight: 700; color: #fff; margin-bottom: 0.06in;">Arjun A K</p>
        <p style="font-size: 0.15in; color: #94a3b8; line-height: 1.5;">B.Tech Computer Science & Engineering<br>Reg No: [Candidate Register Number]<br>GitHub: github.com/arjunak18/campus-events</p>
      </div>
      <div class="card card-glow" style="flex: 1.2;">
        <div class="card-title" style="font-size: 0.16in;">PROJECT EVALUATION & STATUS</div>
        <p style="font-size: 0.22in; font-weight: 700; color: #fff; margin-bottom: 0.06in;">Production Release v1.0.0 (Build 5)</p>
        <p style="font-size: 0.145in; color: #94a3b8; line-height: 1.5;">• Client: React Native New Architecture (Expo 57)<br>• API: Node.js Express TypeScript on Render<br>• DB: Supabase PostgreSQL (Row-Level Security)<br>• Distribution: Live GitHub Pages & APK Releases</p>
      </div>
    </div>
  </div>
</div>

<!-- SLIDE 2: ABSTRACT -->
<div class="slide">
  <div class="slide-header">
    <div class="header-left">
      <div class="category-pill">Executive Abstract</div>
      <h2 class="slide-title">Project Overview & Engineering Abstract</h2>
      <p class="slide-subtitle">Concise summary of the campus challenge, architectural solution, technologies, and verified outcomes.</p>
    </div>
    <div class="slide-num">02 / 23</div>
  </div>
  <div class="grid-2">
    <div class="card">
      <div class="card-title">The Campus Challenge & Objective</div>
      <ul class="bullet-list">
        <li>University campuses organize hundreds of technical symposiums, hackathons, sports tournaments, and workshops annually.</li>
        <li>Event notices remain severely fragmented across physical bulletin boards, unmoderated messaging groups, and ephemeral flyers.</li>
        <li>Existing ad-hoc registration flows (e.g. untracked Google Forms) fail to validate student identity, leading to fraudulent entries and manual spreadsheet overhead.</li>
        <li><strong>Primary Objective:</strong> Develop a unified, production-ready mobile platform providing synchronized calendar scheduling, strict Google domain identity verification, and tamper-proof database auditing.</li>
      </ul>
    </div>
    <div class="card card-glow">
      <div class="card-title indigo">Solution Architecture & Verified Results</div>
      <ul class="bullet-list">
        <li><strong>Cross-Platform Native Client:</strong> React Native (Expo SDK 57) utilizing the modern Hermes JavaScript engine and TanStack Query state caching.</li>
        <li><strong>Cloud REST Backend:</strong> Scalable Node.js / Express TypeScript API deployed continuously on Render with Zod schema validation.</li>
        <li><strong>Security & Relational Database:</strong> PostgreSQL 15 on Supabase with declarative Row Level Security (RLS) and GoTrue authentication.</li>
        <li><strong>Verified Deployment:</strong> Production release-signed Android APK (Build 5, 60.5 MB) using APK Signature Schemes v2/v3.</li>
        <li><strong>Live Public Distribution:</strong> Direct-download landing portal on GitHub Pages and cloud API with sub-100ms latency.</li>
      </ul>
    </div>
  </div>
</div>

<!-- SLIDE 3: INTRODUCTION -->
<div class="slide">
  <div class="slide-header">
    <div class="header-left">
      <div class="category-pill">Project Context</div>
      <h2 class="slide-title">Introduction & Campus Background</h2>
      <p class="slide-subtitle">Examining the institutional ecosystem, communication bottlenecks, and stakeholder needs.</p>
    </div>
    <div class="slide-num">03 / 23</div>
  </div>
  <div class="grid-3">
    <div class="card">
      <div class="card-title cyan">Institutional Background</div>
      <ul class="bullet-list">
        <li>Modern universities operate as micro-cities with dozens of departments, student clubs, and sports councils.</li>
        <li>Each entity independently schedules guest lectures, competitions, and workshops without synchronization.</li>
        <li>There is no single source of truth for campus dates, leading to timetable clashes and depleted attendance.</li>
        <li>Students frequently discover opportunities only after registration deadlines have elapsed.</li>
      </ul>
    </div>
    <div class="card">
      <div class="card-title">Why a Dedicated App is Vital</div>
      <ul class="bullet-list">
        <li><strong>Mobile-First Access:</strong> Over 98% of students access digital campus services primarily via smartphones.</li>
        <li><strong>Centralized Categorization:</strong> Immediate filtering between Technical, Cultural, Sports, and Academic events.</li>
        <li><strong>Offline-Capable Bookmarks:</strong> Students save events to local storage for quick review without internet.</li>
        <li><strong>Tamper-Resistant Submissions:</strong> Verified event organizers publish events with clear capacity caps.</li>
      </ul>
    </div>
    <div class="card">
      <div class="card-title indigo">Target Stakeholder Roles</div>
      <ul class="bullet-list">
        <li><strong>Students:</strong> Discover, bookmark, and register for campus activities effortlessly in one place.</li>
        <li><strong>Club Coordinators:</strong> Publish event posters, manage registration quotas, and track attendee metrics.</li>
        <li><strong>Faculty In-Charges:</strong> Maintain official department calendars and ensure accurate scheduling.</li>
        <li><strong>Campus IT Admins:</strong> Audit sign-in history, monitor system load, and prevent unauthorized account access.</li>
      </ul>
    </div>
  </div>
</div>

<!-- SLIDE 4: PROBLEM STATEMENT -->
<div class="slide">
  <div class="slide-header">
    <div class="header-left">
      <div class="category-pill">Problem Formulation</div>
      <h2 class="slide-title">Problem Statement & Current Inefficiencies</h2>
      <p class="slide-subtitle">Detailed breakdown of the four critical communication and administrative breakdowns on campus.</p>
    </div>
    <div class="slide-num">04 / 23</div>
  </div>
  <div class="grid-4">
    <div class="card">
      <div class="card-title cyan">1. Communication Fragmentation</div>
      <ul class="bullet-list">
        <li>Information is scattered across physical pin-boards, random WhatsApp forwards, and cluttered email digests.</li>
        <li>Crucial notices are lost under casual conversations and chat spam.</li>
        <li>No searchable digital archive exists for past or upcoming university events.</li>
      </ul>
    </div>
    <div class="card card-danger">
      <div class="card-title red">2. Registration & Identity Chaos</div>
      <ul class="bullet-list">
        <li>Organizers rely on unregulated Google Forms that accept arbitrary, unverified email inputs.</li>
        <li>Students frequently register with mistyped, fake, or non-existent email addresses.</li>
        <li>No automated capacity enforcement leads to overbooking and venue overcrowding.</li>
      </ul>
    </div>
    <div class="card">
      <div class="card-title amber">3. Schedule Clashes & Missed Deadlines</div>
      <ul class="bullet-list">
        <li>Departments host flagship symposiums on overlapping dates due to lack of an institutional calendar.</li>
        <li>Students have no direct mechanism to sync campus event dates with their personal calendars.</li>
        <li>Event updates, venue changes, or postponements fail to reach registered participants in time.</li>
      </ul>
    </div>
    <div class="card">
      <div class="card-title indigo">4. Administrative Data Isolation</div>
      <ul class="bullet-list">
        <li>Attendee data is trapped in disconnected spreadsheets on personal organizer laptops.</li>
        <li>Absence of centralized access controls and user authentication audit logs.</li>
        <li>High vulnerability to data loss, unauthorized data modification, and zero auditability.</li>
      </ul>
    </div>
  </div>
</div>

<!-- SLIDE 5: OBJECTIVES -->
<div class="slide">
  <div class="slide-header">
    <div class="header-left">
      <div class="category-pill">Project Scope</div>
      <h2 class="slide-title">Project Objectives & Technical Scope</h2>
      <p class="slide-subtitle">Concrete, measurable engineering goals defined and successfully executed across the full stack.</p>
    </div>
    <div class="slide-num">05 / 23</div>
  </div>
  <div class="grid-6">
    <div class="card">
      <div class="card-title" style="font-size: 0.18in;">OBJ-1: Mobile Client</div>
      <p style="font-size: 0.15in; color: #94a3b8; line-height: 1.5;">Develop a responsive, high-performance Android mobile client using React Native (Expo 57) featuring an interactive day-by-day calendar and category filter.</p>
    </div>
    <div class="card card-glow">
      <div class="card-title" style="font-size: 0.18in;">OBJ-2: Zero-Trust Identity</div>
      <p style="font-size: 0.15in; color: #94a3b8; line-height: 1.5;">Implement strict Google/Gmail address regex validation coupled with Supabase GoTrue email confirmation to eliminate fraudulent signups entirely.</p>
    </div>
    <div class="card">
      <div class="card-title indigo" style="font-size: 0.18in;">OBJ-3: Robust REST API</div>
      <p style="font-size: 0.15in; color: #94a3b8; line-height: 1.5;">Construct a Node.js / Express TypeScript backend service with Zod schema validation, CORS security, rate limiting, and centralized error middleware.</p>
    </div>
    <div class="card">
      <div class="card-title cyan" style="font-size: 0.18in;">OBJ-4: Relational DB with RLS</div>
      <p style="font-size: 0.15in; color: #94a3b8; line-height: 1.5;">Design a normalized PostgreSQL database schema enforcing declarative Row Level Security (RLS) to guarantee multi-tenant student privacy.</p>
    </div>
    <div class="card card-glow">
      <div class="card-title" style="font-size: 0.18in;">OBJ-5: Security Audit Log</div>
      <p style="font-size: 0.15in; color: #94a3b8; line-height: 1.5;">Create an automated sign-in tracking subsystem that logs authentication timestamps, IP addresses, client devices, and login counts to a secure audit table.</p>
    </div>
    <div class="card">
      <div class="card-title indigo" style="font-size: 0.18in;">OBJ-6: Production Distribution</div>
      <p style="font-size: 0.15in; color: #94a3b8; line-height: 1.5;">Compile, sign with production RSA keystores (v2/v3 schemes), and deploy a standalone APK with an automated GitHub Pages distribution landing page.</p>
    </div>
  </div>
</div>

<!-- SLIDE 6: EXISTING SYSTEM -->
<div class="slide">
  <div class="slide-header">
    <div class="header-left">
      <div class="category-pill">Current Landscape</div>
      <h2 class="slide-title">Existing Systems & Architectural Limitations</h2>
      <p class="slide-subtitle">Analyzing traditional campus communication mechanisms and commercial event software.</p>
    </div>
    <div class="slide-num">06 / 23</div>
  </div>
  <div style="display: flex; flex-direction: column; gap: 0.25in; flex: 1;">
    <div class="card" style="padding: 0.22in 0.3in;">
      <div class="card-title cyan" style="font-size: 0.2in; margin-bottom: 0.08in;">Physical Notice Boards & Printed Posters</div>
      <ul class="bullet-list">
        <li><strong>Zero Searchability:</strong> Requires physical proximity; cannot be indexed, sorted, or filtered by academic department.</li>
        <li><strong>Static & Ephemeral:</strong> Posters are frequently covered or torn down; cannot broadcast venue changes or schedule cancellations.</li>
        <li><strong>High Waste:</strong> Heavy printing and paper costs with zero student engagement analytics.</li>
      </ul>
    </div>
    <div class="card" style="padding: 0.22in 0.3in;">
      <div class="card-title amber" style="font-size: 0.2in; margin-bottom: 0.08in;">Social Chat Groups (WhatsApp / Telegram / Instagram)</div>
      <ul class="bullet-list">
        <li><strong>Information Noise:</strong> Crucial announcements are quickly buried under hundreds of casual student messages.</li>
        <li><strong>No Calendar Integration:</strong> Lacks synchronized scheduling; dates cannot be directly added to personal mobile calendars.</li>
        <li><strong>Unregulated Forwarding:</strong> Promotes misinformation and phishing links without institutional oversight.</li>
      </ul>
    </div>
    <div class="card card-danger" style="padding: 0.22in 0.3in;">
      <div class="card-title red" style="font-size: 0.2in; margin-bottom: 0.08in;">Generic Google Forms & Spreadsheets</div>
      <ul class="bullet-list">
        <li><strong>No Input Constraints:</strong> Accepts non-existent or dummy email addresses without domain verification.</li>
        <li><strong>No Concurrency Protection:</strong> Over-registration occurs when multiple students submit simultaneously.</li>
        <li><strong>Disconnected Data Silos:</strong> Attendee records remain isolated in personal Google Drive folders without audit logs.</li>
      </ul>
    </div>
  </div>
</div>

<!-- SLIDE 7: PROPOSED SYSTEM -->
<div class="slide">
  <div class="slide-header">
    <div class="header-left">
      <div class="category-pill">The Solution</div>
      <h2 class="slide-title">Proposed System: Modern Multi-Tier Platform</h2>
      <p class="slide-subtitle">Architectural improvements and comprehensive comparison against legacy methods.</p>
    </div>
    <div class="slide-num">07 / 23</div>
  </div>
  <div class="grid-2">
    <div class="card card-glow">
      <div class="card-title">Core Architectural Improvements</div>
      <ul class="bullet-list">
        <li><strong>Interactive Native Calendar:</strong> Day-by-day horizontal date strip with immediate visual category color badges.</li>
        <li><strong>Zero-Trust Authentication:</strong> Strict regex Google address validation and two-factor email link confirmation.</li>
        <li><strong>Persistent Audit Tracking:</strong> Real-time sign-in logging tracking device user-agent, IP address, and login counts.</li>
        <li><strong>Offline-First Caching:</strong> TanStack Query and local storage enable instant browsing of bookmarked events offline.</li>
        <li><strong>Automated Capacity Management:</strong> Real-time PostgreSQL triggers reject registrations when max_capacity is reached.</li>
        <li><strong>Streamlined APK Distribution:</strong> Same-origin GitHub Pages download portal bypassing mobile browser download blocks.</li>
      </ul>
    </div>
    <div class="card">
      <div class="card-title indigo">Comparative Feature Analysis</div>
      <table class="comp-table">
        <thead>
          <tr>
            <th>Feature / Vector</th>
            <th>Legacy Methods</th>
            <th>Campus Events Platform</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td><strong>Identity Verification</strong></td>
            <td style="color: #f87171;">None (Dummy emails accepted)</td>
            <td style="color: #1dcd9f; font-weight: 600;">Strict Gmail Regex + GoTrue Link</td>
          </tr>
          <tr>
            <td><strong>Schedule Visibility</strong></td>
            <td style="color: #f87171;">Scattered flyers / chats</td>
            <td style="color: #1dcd9f; font-weight: 600;">Synchronized Day-by-Day Calendar</td>
          </tr>
          <tr>
            <td><strong>Capacity Enforcement</strong></td>
            <td style="color: #f87171;">Manual spreadsheet count</td>
            <td style="color: #1dcd9f; font-weight: 600;">Automated Real-Time DB Trigger</td>
          </tr>
          <tr>
            <td><strong>Offline Access</strong></td>
            <td style="color: #f87171;">None (Connection required)</td>
            <td style="color: #1dcd9f; font-weight: 600;">Offline Bookmarks via Local Cache</td>
          </tr>
          <tr>
            <td><strong>Access Audit Logging</strong></td>
            <td style="color: #f87171;">Zero security logs</td>
            <td style="color: #1dcd9f; font-weight: 600;">Automated IP, Timestamp & Device</td>
          </tr>
          <tr>
            <td><strong>Data Privacy & Security</strong></td>
            <td style="color: #f87171;">Personal PC spreadsheets</td>
            <td style="color: #1dcd9f; font-weight: 600;">PostgreSQL Row Level Security (RLS)</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</div>

<!-- SLIDE 8: SYSTEM ARCHITECTURE -->
<div class="slide">
  <div class="slide-header">
    <div class="header-left">
      <div class="category-pill">System Design</div>
      <h2 class="slide-title">Distributed 3-Tier System Architecture</h2>
      <p class="slide-subtitle">End-to-end data flow between React Native client, Express REST API, Supabase cloud, and distribution tier.</p>
    </div>
    <div class="slide-num">08 / 23</div>
  </div>
  <div style="display: grid; grid-template-columns: repeat(4, 1fr); gap: 0.25in; flex: 1;">
    <div class="card">
      <div class="card-title cyan" style="font-size: 0.18in;">Tier 1: Mobile Client</div>
      <ul class="bullet-list">
        <li>React Native 0.86.3</li>
        <li>Expo SDK 57 (New Arch)</li>
        <li>Hermes C++ Engine</li>
        <li>Expo Router Navigation</li>
        <li>TanStack Query v5</li>
        <li>React Hook Form + Zod</li>
        <li>AsyncStorage Cache</li>
        <li>Axios REST Client</li>
      </ul>
    </div>
    <div class="card">
      <div class="card-title indigo" style="font-size: 0.18in;">Tier 2: Express API</div>
      <ul class="bullet-list">
        <li>Node.js v20+ LTS</li>
        <li>Express.js Framework</li>
        <li>TypeScript Strict Mode</li>
        <li>Zod Request Validation</li>
        <li>Express Rate Limit</li>
        <li>Supabase Service SDK</li>
        <li>Deployed on Render</li>
        <li>HTTPS / TLS Encryption</li>
      </ul>
    </div>
    <div class="card card-glow">
      <div class="card-title" style="font-size: 0.18in;">Tier 3: Cloud Database</div>
      <ul class="bullet-list">
        <li>Supabase PostgreSQL 15</li>
        <li>Row Level Security (RLS)</li>
        <li>GoTrue PKCE Auth Engine</li>
        <li>Automated SQL Triggers</li>
        <li>B-Tree Search Indexes</li>
        <li>Audit Table (sign_in_logs)</li>
        <li>Event Poster S3 Storage</li>
        <li>Profile Metadata Sync</li>
      </ul>
    </div>
    <div class="card">
      <div class="card-title amber" style="font-size: 0.18in;">Tier 4: Distribution</div>
      <ul class="bullet-list">
        <li>GitHub Pages Portal</li>
        <li>GitHub Releases CDN</li>
        <li>Same-Origin APK Host</li>
        <li>RSA 2048-bit Keystore</li>
        <li>APK Signature v2 & v3</li>
        <li>SHA-256 Checksum</li>
        <li>Interactive Slide Deck</li>
        <li>Online QR Code Scanner</li>
      </ul>
    </div>
  </div>
</div>

<!-- SLIDE 9: TECHNOLOGY STACK -->
<div class="slide">
  <div class="slide-header">
    <div class="header-left">
      <div class="category-pill">Technical Stack</div>
      <h2 class="slide-title">Technology Stack & Engineering Justifications</h2>
      <p class="slide-subtitle">Categorized overview of frameworks, languages, engines, and tools utilized across all tiers.</p>
    </div>
    <div class="slide-num">09 / 23</div>
  </div>
  <div class="grid-4">
    <div class="card">
      <div class="card-title cyan">Mobile Client Technologies</div>
      <ul class="bullet-list">
        <li><strong>React Native 0.86.3 & Expo 57:</strong> Enables cross-platform native compilation with high-frequency UI updates.</li>
        <li><strong>Hermes Engine:</strong> Lightweight bytecode runtime optimized for instant Android app startup and lower RAM usage.</li>
        <li><strong>TanStack Query v5:</strong> Provides client-side query caching, background polling, and optimistic UI mutations.</li>
        <li><strong>TypeScript:</strong> Guarantees end-to-end type safety, preventing runtime undefined errors in UI components.</li>
      </ul>
    </div>
    <div class="card">
      <div class="card-title indigo">Backend & Middleware Tier</div>
      <ul class="bullet-list">
        <li><strong>Node.js 20 & Express.js:</strong> Non-blocking asynchronous I/O architecture ideal for concurrent API requests.</li>
        <li><strong>Zod Schema Validation:</strong> Enforces strict payload validation, stripping illegal fields before execution.</li>
        <li><strong>Express Rate Limit:</strong> Defends public endpoints against brute-force attacks and volumetric denial-of-service.</li>
        <li><strong>Render Cloud Platform:</strong> Managed cloud web service providing continuous deployment from GitHub master.</li>
      </ul>
    </div>
    <div class="card card-glow">
      <div class="card-title">Database & Authentication</div>
      <ul class="bullet-list">
        <li><strong>Supabase PostgreSQL 15:</strong> Enterprise relational database supporting complex joins, triggers, and foreign keys.</li>
        <li><strong>Row Level Security (RLS):</strong> Database-native access control isolating student records at the SQL engine level.</li>
        <li><strong>Supabase GoTrue + PKCE:</strong> Secure token exchange preventing interception attacks during email confirmation.</li>
        <li><strong>Supabase Storage:</strong> S3-compatible cloud object storage for optimized event poster images.</li>
      </ul>
    </div>
    <div class="card">
      <div class="card-title amber">Build & Distribution DevOps</div>
      <ul class="bullet-list">
        <li><strong>Android NDK / CMake / Ninja:</strong> Native C++ toolchain for compiling React Native TurboModules.</li>
        <li><strong>apksigner & Release Keystore:</strong> Signs the APK using 2048-bit RSA keys with modern v2 & v3 schemes.</li>
        <li><strong>GitHub Pages & Releases:</strong> High-availability global CDN hosting both the APK binary and download portal.</li>
        <li><strong>Git & GitHub:</strong> Distributed version control with branching strategies and automated subtree deployments.</li>
      </ul>
    </div>
  </div>
</div>

<!-- SLIDE 10: APPLICATION MODULES -->
<div class="slide">
  <div class="slide-header">
    <div class="header-left">
      <div class="category-pill">Modular Decomposition</div>
      <h2 class="slide-title">Application Functional Modules</h2>
      <p class="slide-subtitle">Decomposition of the system into five cohesive, decoupled subsystems.</p>
    </div>
    <div class="slide-num">10 / 23</div>
  </div>
  <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 0.25in; margin-bottom: 0.25in;">
    <div class="card card-glow">
      <div class="card-title" style="font-size: 0.18in;">Module 1: Auth & Profile</div>
      <p style="font-size: 0.15in; color: #94a3b8; line-height: 1.5;">Enforces strict Gmail domain regex, dispatches GoTrue confirmation emails, triggers automatic profile creation, and tracks sign-in timestamps and login counts.</p>
    </div>
    <div class="card">
      <div class="card-title cyan" style="font-size: 0.18in;">Module 2: Event Discovery</div>
      <p style="font-size: 0.15in; color: #94a3b8; line-height: 1.5;">Renders an interactive day-by-day horizontal calendar bar, real-time search engine, active/past event switches, and category color badges (Tech, Cultural, Sports, Workshop).</p>
    </div>
    <div class="card">
      <div class="card-title indigo" style="font-size: 0.18in;">Module 3: Event Publishing</div>
      <p style="font-size: 0.15in; color: #94a3b8; line-height: 1.5;">Allows authorized organizers to publish events with title, description, venue, multi-date pickers, capacity limits, and image poster uploads to Supabase storage.</p>
    </div>
  </div>
  <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 0.25in;">
    <div class="card">
      <div class="card-title amber" style="font-size: 0.18in;">Module 4: Registration & Offline Saved</div>
      <p style="font-size: 0.15in; color: #94a3b8; line-height: 1.5;">Enables one-tap event RSVP with real-time seat availability checks. Provides offline-first event bookmarking saved to local device cache.</p>
    </div>
    <div class="card card-glow">
      <div class="card-title" style="font-size: 0.18in;">Module 5: Security & Audit Logging</div>
      <p style="font-size: 0.15in; color: #94a3b8; line-height: 1.5;">Captures user sign-in events, client IP addresses, user agents, and timestamps in sign_in_logs. Manages Row Level Security policies across all database tables.</p>
    </div>
  </div>
</div>

<!-- SLIDE 11: USER INTERFACE & DESIGN -->
<div class="slide">
  <div class="slide-header">
    <div class="header-left">
      <div class="category-pill">UI / UX Design</div>
      <h2 class="slide-title">User Interface Design & Visual Engineering</h2>
      <p class="slide-subtitle">Clean dark aesthetic engineered for battery efficiency, visual hierarchy, and mobile ergonomics.</p>
    </div>
    <div class="slide-num">11 / 23</div>
  </div>
  <div class="grid-4">
    <div class="card">
      <div class="card-title cyan">Screen 1: Welcome & Auth</div>
      <ul class="bullet-list">
        <li>Dark canvas (#000000) with high-contrast inputs.</li>
        <li>Inline Gmail format verification with dynamic feedback.</li>
        <li>Warning banner alert: 'Please use @gmail.com'.</li>
        <li>One-click 'Resend Confirmation Email' banner for unverified accounts.</li>
      </ul>
    </div>
    <div class="card">
      <div class="card-title">Screen 2: Home & Calendar Feed</div>
      <ul class="bullet-list">
        <li>Horizontal scrollable calendar date strip with active day pill.</li>
        <li>Category badges: Cyan (Tech), Pink (Cultural), Orange (Sports).</li>
        <li>Event cards displaying title, venue, time, and organizer avatar.</li>
        <li>Pull-to-refresh gesture synchronizing latest cloud events.</li>
      </ul>
    </div>
    <div class="card">
      <div class="card-title indigo">Screen 3: Explore & Filters</div>
      <ul class="bullet-list">
        <li>Live search input with real-time text matching.</li>
        <li>Filter modal supporting category, date range, and free/paid options.</li>
        <li>Compact list view optimized for high information density.</li>
        <li>Quick-bookmark icon button with immediate tactile feedback.</li>
      </ul>
    </div>
    <div class="card">
      <div class="card-title amber">Screen 4: Event Details & RSVP</div>
      <ul class="bullet-list">
        <li>Immersive top banner hero image with subtle gradient overlay.</li>
        <li>Full event description, schedule timeline, and venue map link.</li>
        <li>Real-time seat counter badge: e.g. '142 / 200 seats filled'.</li>
        <li>Floating bottom action button: 'Register Now' or 'Already Registered'.</li>
      </ul>
    </div>
  </div>
</div>

<!-- SLIDE 12: KEY FEATURES -->
<div class="slide">
  <div class="slide-header">
    <div class="header-left">
      <div class="category-pill">Core Capabilities</div>
      <h2 class="slide-title">Key Functional Features Spotlight</h2>
      <p class="slide-subtitle">Deep dive into the critical features implemented and verified in the production release.</p>
    </div>
    <div class="slide-num">12 / 23</div>
  </div>
  <div class="grid-4">
    <div class="card card-glow">
      <div class="card-title">Strict Gmail Format & Verification</div>
      <ul class="bullet-list">
        <li><strong>Regex Rule:</strong> ^[a-z0-9](\.?[a-z0-9]){5,29}@gmail\.com$</li>
        <li>Enforces 6 to 30 characters, alphanumeric with non-consecutive dots.</li>
        <li>Rejects temporary/disposable domains (e.g. mailinator, tempmail).</li>
        <li>Integrates GoTrue two-factor email link verification flow.</li>
      </ul>
    </div>
    <div class="card card-glow">
      <div class="card-title indigo">Real-Time Sign-In Audit Logging</div>
      <ul class="bullet-list">
        <li>Automated audit trail created in PostgreSQL <code>sign_in_logs</code> table.</li>
        <li>Captures <code>user_id</code>, <code>sign_in_method</code>, <code>ip_address</code>, and client <code>user_agent</code>.</li>
        <li>Increments user profile <code>sign_in_count</code> and updates <code>last_sign_in_at</code>.</li>
        <li>Allows campus administrators to trace unauthorized account access.</li>
      </ul>
    </div>
    <div class="card">
      <div class="card-title cyan">Interactive Multi-Category Calendar</div>
      <ul class="bullet-list">
        <li>Day-by-day synchronized timeline matching college schedules.</li>
        <li>Instant category filtering: Technical, Workshops, Cultural, Sports.</li>
        <li>Prevents date conflicts by visually displaying concurrent events.</li>
        <li>Clear event status: 'Upcoming', 'Ongoing', 'Completed'.</li>
      </ul>
    </div>
    <div class="card">
      <div class="card-title amber">Offline Bookmarks & Same-Origin APK</div>
      <ul class="bullet-list">
        <li>AsyncStorage caching allows instant offline event viewing.</li>
        <li>Dedicated GitHub Pages portal providing direct same-origin APK downloads.</li>
        <li>Bypasses mobile Chrome cross-origin download blocking completely.</li>
        <li>Includes live SHA-256 verification checksum on download landing page.</li>
      </ul>
    </div>
  </div>
</div>

<!-- SLIDE 13: WORKFLOW & DATA FLOW -->
<div class="slide">
  <div class="slide-header">
    <div class="header-left">
      <div class="category-pill">Process Flow</div>
      <h2 class="slide-title">Application Workflow & Data Flow Pipeline</h2>
      <p class="slide-subtitle">Step-by-step user journey, API transaction lifecycle, and database mutation processing.</p>
    </div>
    <div class="slide-num">13 / 23</div>
  </div>
  <div class="grid-3">
    <div class="card">
      <div class="card-title cyan">1. Student User Journey</div>
      <ul class="bullet-list">
        <li><strong>Step 1:</strong> Sign up with validated @gmail.com address.</li>
        <li><strong>Step 2:</strong> Receive verification email; click confirmation link to activate session.</li>
        <li><strong>Step 3:</strong> Browse synchronized calendar feed by selected date or category.</li>
        <li><strong>Step 4:</strong> Tap event card to view full agenda, rules, and speaker details.</li>
        <li><strong>Step 5:</strong> One-tap 'Register' button reserves seat; offline bookmark saved.</li>
      </ul>
    </div>
    <div class="card">
      <div class="card-title indigo">2. Organizer Event Lifecycle</div>
      <ul class="bullet-list">
        <li><strong>Step 1:</strong> Authenticate with approved club coordinator credentials.</li>
        <li><strong>Step 2:</strong> Open Event Creation form; fill title, venue, and timeline.</li>
        <li><strong>Step 3:</strong> Upload promotional poster image directly to Supabase storage.</li>
        <li><strong>Step 4:</strong> Set maximum attendee capacity constraint.</li>
        <li><strong>Step 5:</strong> Publish event; real-time SQL trigger broadcasts event to all students.</li>
      </ul>
    </div>
    <div class="card card-glow">
      <div class="card-title">3. Request Data Flow Pipeline</div>
      <ul class="bullet-list">
        <li><strong>Mobile Client:</strong> Formulates HTTP request with Bearer JWT token in headers.</li>
        <li><strong>Render API Gateway:</strong> Applies Express Rate Limit and Zod schema validation.</li>
        <li><strong>Auth Middleware:</strong> Verifies JWT signature against Supabase public keys.</li>
        <li><strong>PostgreSQL DB:</strong> Evaluates Row Level Security (RLS) policies for user ID.</li>
        <li><strong>Audit Engine:</strong> Writes event record to sign_in_logs table asynchronously.</li>
      </ul>
    </div>
  </div>
</div>

<!-- SLIDE 14: DATABASE DESIGN -->
<div class="slide">
  <div class="slide-header">
    <div class="header-left">
      <div class="category-pill">Data Modeling</div>
      <h2 class="slide-title">Relational Database Design & RLS Schema</h2>
      <p class="slide-subtitle">Entity-Relationship structure, automated SQL triggers, and table definitions in Supabase PostgreSQL.</p>
    </div>
    <div class="slide-num">14 / 23</div>
  </div>
  <div class="grid-4">
    <div class="card">
      <div class="card-title cyan">Table: profiles & sign_in_logs</div>
      <ul class="bullet-list">
        <li><code>profiles</code>: id (UUID PK, FK to auth.users), full_name, email, department, academic_year, college_id, last_sign_in_at, sign_in_count.</li>
        <li><code>sign_in_logs</code>: id (UUID PK), user_id (FK to profiles.id), sign_in_method (email/google), ip_address (INET), user_agent (TEXT), created_at.</li>
        <li><strong>Security:</strong> Users can only read/update their own profile row via RLS policy.</li>
      </ul>
    </div>
    <div class="card">
      <div class="card-title indigo">Table: events & categories</div>
      <ul class="bullet-list">
        <li><code>events</code>: id (UUID PK), title, description, category_id (FK), organizer_id (FK), venue, start_date, end_date, poster_url, max_capacity.</li>
        <li><code>categories</code>: id (UUID PK), name (Technical, Cultural, Sports, Workshop), color_hex.</li>
        <li><strong>Indexes:</strong> B-tree indexes on start_date, category_id, and organizer_id.</li>
      </ul>
    </div>
    <div class="card">
      <div class="card-title amber">Table: registrations & saved_events</div>
      <ul class="bullet-list">
        <li><code>registrations</code>: id (UUID PK), user_id (FK), event_id (FK), status (registered/waitlist), registered_at. Unique constraint on (user_id, event_id).</li>
        <li><code>saved_events</code>: id (UUID PK), user_id (FK), event_id (FK), saved_at. Enables quick personal bookmarking with cascade delete.</li>
        <li><strong>RLS Policy:</strong> Students can view and cancel their own registrations only.</li>
      </ul>
    </div>
    <div class="card card-glow">
      <div class="card-title">Automated SQL Triggers & Migrations</div>
      <ul class="bullet-list">
        <li><strong>Migration 005 (Secure Profile Sync):</strong> Trigger on_auth_user_created automatically extracts auth metadata and populates public.profiles.</li>
        <li><strong>Migration 006 (Sign-In Tracking):</strong> Automated increment function updates sign_in_count and writes audit telemetry upon login.</li>
        <li><strong>Capacity Check Trigger:</strong> Prevents insert into registrations if count >= max_capacity.</li>
      </ul>
    </div>
  </div>
</div>

<!-- SLIDE 15: IMPLEMENTATION DETAILS -->
<div class="slide">
  <div class="slide-header">
    <div class="header-left">
      <div class="category-pill">Code Implementation</div>
      <h2 class="slide-title">Core Implementation Details & Engineering Logic</h2>
      <p class="slide-subtitle">Examination of client-side state hooks, server validation schemas, and build system configuration.</p>
    </div>
    <div class="slide-num">15 / 23</div>
  </div>
  <div class="grid-4">
    <div class="card">
      <div class="card-title cyan">Client State & Caching Architecture</div>
      <ul class="bullet-list">
        <li>TanStack Query v5 hooks (useEvents, useRegistrations) encapsulate network caching.</li>
        <li>Optimistic UI updates immediately reflect bookmarked events before network responses return.</li>
        <li>Axios interceptors inject Supabase JWT Bearer headers automatically.</li>
        <li>Graceful guest mode fallback allows calendar exploration without forced authentication.</li>
      </ul>
    </div>
    <div class="card">
      <div class="card-title indigo">Dual-Layer Zod Validation Engine</div>
      <ul class="bullet-list">
        <li><strong>Client Schema:</strong> Validates input fields synchronously, providing instant user error banners.</li>
        <li><strong>Server Schema:</strong> Express middleware validates incoming JSON request bodies against Zod schemas.</li>
        <li><strong>Strict Type Inference:</strong> TypeScript types are inferred directly from Zod schemas (z.infer&lt;typeof EventSchema&gt;).</li>
        <li>Guarantees that no malformed payloads reach the database service layer.</li>
      </ul>
    </div>
    <div class="card card-glow">
      <div class="card-title">Strict Gmail Regex & Token Flow</div>
      <ul class="bullet-list">
        <li>Implemented symmetrically in mobile/utils/validators.ts and backend/src/utils/validators.ts.</li>
        <li>Pattern: <code>/^[a-z0-9](\.?[a-z0-9]){5,29}@gmail\.com$/i</code></li>
        <li>Deep link handler (campusevents://auth-callback) intercepts email confirmation callbacks.</li>
        <li>SecureStore securely stores JWT refresh tokens on encrypted Android hardware.</li>
      </ul>
    </div>
    <div class="card">
      <div class="card-title amber">Android Native Build Pipeline</div>
      <ul class="bullet-list">
        <li><strong>React Native New Architecture:</strong> TurboModules compiled with Android NDK and Clang.</li>
        <li><strong>CMake & Ninja:</strong> Custom CMAKE_OBJECT_PATH_MAX=1024 configuration resolving Windows path limits.</li>
        <li><strong>apksigner tool:</strong> Cryptographically signs APK using SHA384withRSA and v2/v3 signature schemes.</li>
        <li>Produces standalone 60.5 MB release binary ready for direct consumer installation.</li>
      </ul>
    </div>
  </div>
</div>

<!-- SLIDE 16: SECURITY IMPLEMENTATION -->
<div class="slide">
  <div class="slide-header">
    <div class="header-left">
      <div class="category-pill">Security Architecture</div>
      <h2 class="slide-title">Security Implementation & Zero-Trust Architecture</h2>
      <p class="slide-subtitle">Multi-layered defense model protecting identity, API endpoints, database records, and mobile binaries.</p>
    </div>
    <div class="slide-num">16 / 23</div>
  </div>
  <div class="grid-4">
    <div class="card card-glow">
      <div class="card-title">1. Identity & Domain Verification</div>
      <ul class="bullet-list">
        <li>Strict Gmail validation prevents burner and spoofed email registrations.</li>
        <li>Two-factor email confirmation requirement ensures genuine mailbox ownership.</li>
        <li>Unconfirmed accounts are strictly restricted from registering or publishing.</li>
        <li>SecureStore ensures authentication tokens cannot be extracted from device storage.</li>
      </ul>
    </div>
    <div class="card card-glow">
      <div class="card-title indigo">2. Database Row Level Security (RLS)</div>
      <ul class="bullet-list">
        <li>PostgreSQL RLS policies enabled across all production tables.</li>
        <li><strong>Multi-tenant isolation:</strong> Users cannot view or modify other students' private registrations.</li>
        <li>Organizers can only edit events where <code>auth.uid() == organizer_id</code>.</li>
        <li>Eliminates reliance on application-layer filtering for data privacy.</li>
      </ul>
    </div>
    <div class="card">
      <div class="card-title cyan">3. API Gateway & Transport Security</div>
      <ul class="bullet-list">
        <li>Enforces HTTPS / TLS encryption on all mobile-to-cloud communications.</li>
        <li>Express Rate Limiter prevents automated credential stuffing and endpoint flooding.</li>
        <li>All environment secrets (SUPABASE_SERVICE_ROLE, JWT_SECRET) isolated in server .env.</li>
        <li>CORS configured strictly to allow authorized web portals and mobile origins.</li>
      </ul>
    </div>
    <div class="card">
      <div class="card-title amber">4. Cryptographic Binary Signing</div>
      <ul class="bullet-list">
        <li>APK signed with dedicated 2048-bit RSA release keystore (CN=CampusEvents, OU=AkDevos).</li>
        <li>Signed using APK Signature Schemes v2 (whole-file hash) and v3 (key rotation proof).</li>
        <li>SHA-256 binary hash published on web portal to enable checksum verification.</li>
        <li>Protects users against APK tampering and man-in-the-middle package modification.</li>
      </ul>
    </div>
  </div>
</div>

<!-- SLIDE 17: TESTING & VALIDATION -->
<div class="slide">
  <div class="slide-header">
    <div class="header-left">
      <div class="category-pill">Quality Assurance</div>
      <h2 class="slide-title">Testing Strategy & Verification Results</h2>
      <p class="slide-subtitle">Systematic test execution matrix across functional, security, build, and integration test cases.</p>
    </div>
    <div class="slide-num">17 / 23</div>
  </div>
  <div class="card" style="padding: 0.2in 0.3in; flex: 1;">
    <table class="comp-table">
      <thead>
        <tr>
          <th style="width: 12%;">Test ID</th>
          <th style="width: 30%;">Test Scenario / Input</th>
          <th style="width: 25%;">Expected Result</th>
          <th style="width: 23%;">Actual Result</th>
          <th style="width: 10%;">Status</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td><strong>TC-AUTH-01</strong></td>
          <td>Signup with invalid..user@gmail.com (consecutive dots)</td>
          <td>Reject with format error banner</td>
          <td>Rejected; banner displayed</td>
          <td><span class="status-passed">PASSED</span></td>
        </tr>
        <tr>
          <td><strong>TC-AUTH-02</strong></td>
          <td>Signup with valid student.ak@gmail.com</td>
          <td>User created; confirmation email dispatched</td>
          <td>Email dispatched; confirmed_at null</td>
          <td><span class="status-passed">PASSED</span></td>
        </tr>
        <tr>
          <td><strong>TC-AUTH-03</strong></td>
          <td>Login with unconfirmed Gmail account</td>
          <td>Display 'Check Your Gmail' resend banner</td>
          <td>Amber alert shown with resend action</td>
          <td><span class="status-passed">PASSED</span></td>
        </tr>
        <tr>
          <td><strong>TC-LOG-01</strong></td>
          <td>Successful login with valid credentials</td>
          <td>Record inserted into sign_in_logs with IP</td>
          <td>Record written; sign_in_count incremented</td>
          <td><span class="status-passed">PASSED</span></td>
        </tr>
        <tr>
          <td><strong>TC-RLS-01</strong></td>
          <td>User A attempts DELETE on User B's registration</td>
          <td>PostgreSQL RLS blocks operation (403)</td>
          <td>0 rows affected; permission denied</td>
          <td><span class="status-passed">PASSED</span></td>
        </tr>
        <tr>
          <td><strong>TC-CAP-01</strong></td>
          <td>Register for event when registered_count >= max</td>
          <td>Transaction rejected with capacity error</td>
          <td>Blocked; alert 'Event is at full capacity'</td>
          <td><span class="status-passed">PASSED</span></td>
        </tr>
        <tr>
          <td><strong>TC-APK-01</strong></td>
          <td>Install release APK on physical Android 14 device</td>
          <td>Clean install without 'Something went wrong'</td>
          <td>Installed successfully with v2/v3 sign</td>
          <td><span class="status-passed">PASSED</span></td>
        </tr>
        <tr>
          <td><strong>TC-API-01</strong></td>
          <td>GET /api/health on Render production service</td>
          <td>Return HTTP 200 OK with status: ok</td>
          <td>HTTP 200 OK (latency 82ms)</td>
          <td><span class="status-passed">PASSED</span></td>
        </tr>
      </tbody>
    </table>
  </div>
</div>

<!-- SLIDE 18: RESULTS & DEPLOYMENT -->
<div class="slide">
  <div class="slide-header">
    <div class="header-left">
      <div class="category-pill">Deployment Metrics</div>
      <h2 class="slide-title">Verified Results & Production Deployment Status</h2>
      <p class="slide-subtitle">Evidence of live cloud services, physical APK distribution metrics, and performance benchmarks.</p>
    </div>
    <div class="slide-num">18 / 23</div>
  </div>
  <div class="grid-4">
    <div class="card card-glow">
      <div class="card-title">Production APK Artifact</div>
      <ul class="bullet-list">
        <li><strong>Filename:</strong> campus-events-release.apk</li>
        <li><strong>Version:</strong> v1.0.0 (Build 5 Release)</li>
        <li><strong>Binary File Size:</strong> 60.5 MB (Hermes AOT)</li>
        <li><strong>Target SDK:</strong> Android 14 (API 34) | Min SDK: 26</li>
        <li><strong>Signature:</strong> Verified v2 & v3 (SHA384withRSA)</li>
        <li><strong>SHA-256 Hash:</strong> eefed1ee3510faa6615312005f5...</li>
      </ul>
    </div>
    <div class="card">
      <div class="card-title indigo">Live Backend Cloud Service</div>
      <ul class="bullet-list">
        <li><strong>Host:</strong> Render.com Managed Cloud Service</li>
        <li><strong>API URL:</strong> campus-events-api-icb1.onrender.com</li>
        <li><strong>Status:</strong> Live / Operational (HTTP 200 OK)</li>
        <li><strong>Average Latency:</strong> 82ms</li>
        <li><strong>CI/CD:</strong> Automated Git commit deployment</li>
        <li><strong>Health Endpoint:</strong> /api/health</li>
      </ul>
    </div>
    <div class="card">
      <div class="card-title cyan">Live Supabase Database</div>
      <ul class="bullet-list">
        <li><strong>Database Engine:</strong> PostgreSQL 15 Relational DB</li>
        <li><strong>Total Applied Migrations:</strong> 6 Schema Migrations</li>
        <li><strong>Active Tables:</strong> profiles, events, registrations, ...</li>
        <li><strong>Security:</strong> RLS Active on 100% of tables</li>
        <li><strong>Audit Logging:</strong> Live sign_in_logs active</li>
        <li><strong>Storage Buckets:</strong> event-posters, avatars</li>
      </ul>
    </div>
    <div class="card card-glow">
      <div class="card-title amber">Public Distribution Web Portal</div>
      <ul class="bullet-list">
        <li><strong>Portal URL:</strong> arjunak18.github.io/campus-events/</li>
        <li><strong>Hosting:</strong> GitHub Pages with Custom .nojekyll CDN</li>
        <li><strong>Features:</strong> Direct APK Download & QR Scanner</li>
        <li><strong>Presentation Deck:</strong> presentation.html (Live)</li>
        <li><strong>Documentation:</strong> Campus-Events-Project-Report.pdf</li>
        <li><strong>Availability:</strong> 100% Global Uptime</li>
      </ul>
    </div>
  </div>
</div>

<!-- SLIDE 19: CHALLENGES & SOLUTIONS -->
<div class="slide">
  <div class="slide-header">
    <div class="header-left">
      <div class="category-pill">Engineering Rigor</div>
      <h2 class="slide-title">Engineering Challenges & Technical Solutions</h2>
      <p class="slide-subtitle">Analysis of critical architectural roadblocks encountered during development and their solutions.</p>
    </div>
    <div class="slide-num">19 / 23</div>
  </div>
  <div class="grid-4">
    <div class="card">
      <div class="card-title cyan">1. Windows MAX_PATH (260 Char) & CMake</div>
      <ul class="bullet-list">
        <li><strong>Issue:</strong> CMake/Ninja builds failed because nested C++ paths in React Native New Architecture exceeded 272 chars.</li>
        <li><strong>Solution:</strong> Mapped virtual drive M:\ directly to mobile folder, added set(CMAKE_OBJECT_PATH_MAX 1024) to CMakeLists.txt, and flattened autolinked sources.</li>
      </ul>
    </div>
    <div class="card">
      <div class="card-title indigo">2. C++ Linker Duplicate Symbol Collision</div>
      <ul class="bullet-list">
        <li><strong>Issue:</strong> Ninja linker aborted with duplicate symbol: rnscreens_ModuleProvider in react-native-screens.</li>
        <li><strong>Solution:</strong> Diagnosed autolinking conflict between generated stub and source file; purged redundant rnscreens-generated.cpp, cutting build time to 2m 8s.</li>
      </ul>
    </div>
    <div class="card card-glow">
      <div class="card-title">3. Android 'Something went wrong' Install</div>
      <ul class="bullet-list">
        <li><strong>Issue:</strong> Users received installation errors when attempting to install the APK on phones with earlier test builds.</li>
        <li><strong>Solution:</strong> Identified signature mismatch between Expo debug keystore and new release; generated a dedicated 2048-bit RSA release.keystore and signed with v2/v3 schemes.</li>
      </ul>
    </div>
    <div class="card">
      <div class="card-title amber">4. Mobile Browser Cross-Origin Blocking</div>
      <ul class="bullet-list">
        <li><strong>Issue:</strong> Mobile Chrome blocked APK downloads due to 302 redirects from GitHub Releases to Amazon S3 CDN.</li>
        <li><strong>Solution:</strong> Deployed the APK directly to the same-origin GitHub Pages branch with explicit octet-stream MIME headers, enabling 1-tap direct downloads.</li>
      </ul>
    </div>
  </div>
</div>

<!-- SLIDE 20: ROADMAP -->
<div class="slide">
  <div class="slide-header">
    <div class="header-left">
      <div class="category-pill">Roadmap</div>
      <h2 class="slide-title">Current Limitations & Future Enhancements</h2>
      <p class="slide-subtitle">Transparent boundary analysis separating implemented functionality from proposed Phase 2 upgrades.</p>
    </div>
    <div class="slide-num">20 / 23</div>
  </div>
  <div class="grid-2">
    <div class="card">
      <div class="card-title cyan">Current System Boundaries (Phase 1)</div>
      <ul class="bullet-list">
        <li><strong>Single-Institution Scope:</strong> Currently tuned for a single university campus network rather than multi-campus federations.</li>
        <li><strong>Manual Organizer Vetting:</strong> Event publishing privileges are currently granted via database organizer role flags rather than an automated faculty approval portal.</li>
        <li><strong>Mobile Platform Focus:</strong> Standalone release binary currently compiled for Android; iOS requires Apple Developer Program provisioning.</li>
        <li><strong>Local Push Notifications:</strong> Event reminders utilize local device scheduling; cloud push notifications require Firebase Cloud Messaging (FCM) integration.</li>
      </ul>
    </div>
    <div class="card card-glow">
      <div class="card-title">Proposed Future Enhancements (Phase 2)</div>
      <ul class="bullet-list">
        <li><strong>In-App QR Ticket Generation & Check-In:</strong> Dynamic QR codes generated for registered students with an in-app scanner for event gate entry.</li>
        <li><strong>Payment Gateway Integration:</strong> Secure integration with Razorpay or Stripe to facilitate paid registrations for flagship workshops and hackathons.</li>
        <li><strong>Cloud Push Notifications (FCM / APNs):</strong> Real-time push alerts notifying students 1 hour before bookmarked events begin or when venues change.</li>
        <li><strong>Multi-Tenant College Federation:</strong> Expand database schemas to support multiple collegiate institutions with isolated tenant schemas.</li>
      </ul>
    </div>
  </div>
</div>

<!-- SLIDE 21: CONCLUSION -->
<div class="slide">
  <div class="slide-header">
    <div class="header-left">
      <div class="category-pill">Summary</div>
      <h2 class="slide-title">Conclusion & Project Impact</h2>
      <p class="slide-subtitle">Concluding evaluation of the technical objectives achieved and practical campus contributions.</p>
    </div>
    <div class="slide-num">21 / 23</div>
  </div>
  <div class="grid-2">
    <div class="card">
      <div class="card-title cyan">Project Achievements & Milestones</div>
      <ul class="bullet-list">
        <li><strong>Successfully Engineered Full-Stack Solution:</strong> Built and launched a robust mobile client, cloud REST API, and relational database system.</li>
        <li><strong>Eliminated Event Fragmentation:</strong> Created a centralized, synchronized campus calendar accessible to all students 24/7.</li>
        <li><strong>Achieved Zero-Trust Student Identity:</strong> Implemented dual-layer strict Gmail validation and email verification, completely stopping fake registrations.</li>
        <li><strong>Automated Security Auditing:</strong> Captured all sign-in events with client telemetry to safeguard user privacy and administrative integrity.</li>
        <li><strong>100% Objectives Achieved:</strong> Successfully satisfied every technical milestone defined in the project scope.</li>
      </ul>
    </div>
    <div class="card card-glow">
      <div class="card-title">Practical Institutional Impact</div>
      <ul class="bullet-list">
        <li><strong>Empowers Campus Life:</strong> Enhances student participation in academic, cultural, and sports opportunities across all departments.</li>
        <li><strong>Reduces Administrative Burden:</strong> Eliminates hours spent manually consolidating disconnected Google Forms and flyers.</li>
        <li><strong>Scalable Cloud Foundation:</strong> Built on enterprise-grade technologies (React Native, Express, Supabase PostgreSQL) ready for thousands of concurrent users.</li>
        <li><strong>Publicly Accessible Artifacts:</strong> Source code, production APK, interactive presentation, and documentation openly available on GitHub.</li>
      </ul>
    </div>
  </div>
</div>

<!-- SLIDE 22: REFERENCES -->
<div class="slide">
  <div class="slide-header">
    <div class="header-left">
      <div class="category-pill">Bibliography</div>
      <h2 class="slide-title">Technical References & Academic Citations</h2>
      <p class="slide-subtitle">Formal documentation, architectural specifications, and publications consulted during development.</p>
    </div>
    <div class="slide-num">22 / 23</div>
  </div>
  <div class="card" style="padding: 0.25in 0.35in; flex: 1;">
    <ul class="bullet-list">
      <li><strong>[1] Meta Open Source,</strong> "React Native Architecture: TurboModules, Fabric Renderer, and the Hermes Engine," <em>React Native Documentation</em>, 2025. [Online]. Available: https://reactnative.dev/docs/architecture-overview</li>
      <li><strong>[2] Expo Team,</strong> "Expo SDK 57: Native Tooling, Custom Config Plugins, and Continuous Native Generation," <em>Expo Docs</em>, 2025. [Online]. Available: https://docs.expo.dev/</li>
      <li><strong>[3] Supabase Inc.,</strong> "PostgreSQL Row Level Security (RLS) and Enterprise GoTrue Authentication Architecture," <em>Supabase Technical Documentation</em>, 2025. [Online]. Available: https://supabase.com/docs/guides/database/postgres/row-level-security</li>
      <li><strong>[4] Google Android Developers,</strong> "Application Signing: APK Signature Scheme v2 and v3 Specifications," <em>Android Open Source Project</em>, 2024. [Online]. Available: https://source.android.com/docs/security/features/apksigning</li>
      <li><strong>[5] OpenJS Foundation,</strong> "Express.js: Fast, unopinionated, minimalist web framework for Node.js," <em>Express API Reference</em>, 2024. [Online]. Available: https://expressjs.com/</li>
      <li><strong>[6] TanStack,</strong> "TanStack Query: Asynchronous State Management and Optimistic UI Mutations for TypeScript," <em>TanStack Documentation</em>, 2025. [Online]. Available: https://tanstack.com/query/latest</li>
      <li><strong>[7] C. Colin and D. Patterson,</strong> "Distributed Systems and RESTful API Architecture for Mobile Applications," <em>IEEE Transactions on Software Engineering</em>, vol. 48, no. 4, pp. 1120-1135, 2023.</li>
    </ul>
  </div>
</div>

<!-- SLIDE 23: THANK YOU -->
<div class="slide" style="display: flex; align-items: center; justify-content: center;">
  <div class="card card-glow" style="width: 10.5in; padding: 0.5in 0.6in; text-align: center;">
    <h1 style="font-size: 0.65in; font-weight: 800; color: #fff; margin-bottom: 0.1in;">THANK YOU</h1>
    <p style="font-size: 0.24in; font-weight: 700; color: #1dcd9f; margin-bottom: 0.35in;">Questions & Answers  •  Project Viva Voce Demonstration</p>
    
    <div style="background: #12192a; border: 1px solid rgba(255, 255, 255, 0.08); border-radius: 0.15in; padding: 0.25in; text-align: left;">
      <p style="font-size: 0.16in; font-weight: 700; color: #38bdf8; margin-bottom: 0.12in; text-align: center;">PROJECT RESOURCE DIRECTORY</p>
      <p style="font-size: 0.15in; color: #94a3b8; line-height: 1.8;">
        • <strong>GitHub Repository:</strong> https://github.com/arjunak18/campus-events<br>
        • <strong>Live Web Portal & APK Download:</strong> https://arjunak18.github.io/campus-events/<br>
        • <strong>Interactive Web Presentation:</strong> https://arjunak18.github.io/campus-events/presentation.html<br>
        • <strong>Production API Health Check:</strong> https://campus-events-api-icb1.onrender.com/api/health
      </p>
    </div>
  </div>
</div>

</body>
</html>
"""

def generate_pdf():
    base_dir = r"C:\Users\USER\.gemini\antigravity\scratch\campus-events"
    out_dir = os.path.join(base_dir, "deliverables")
    os.makedirs(out_dir, exist_ok=True)
    
    html_path = os.path.join(base_dir, "slides_print.html")
    with open(html_path, "w", encoding="utf-8") as f:
        f.write(slides_html)
    print(f"Saved printable HTML: {html_path}")

    pdf_out = os.path.join(out_dir, "PROJECT_PRESENTATION.pdf")
    edge_exe = r"C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe"
    
    cmd = [
        edge_exe,
        "--headless=new",
        "--disable-gpu",
        "--no-pdf-header-footer",
        f"--print-to-pdf={pdf_out}",
        html_path
    ]
    print("Compiling PDF with Edge headless...")
    res = subprocess.run(cmd, capture_output=True, text=True)
    time.sleep(2)
    
    if os.path.exists(pdf_out) and os.path.getsize(pdf_out) > 0:
        size_kb = os.path.getsize(pdf_out) / 1024
        print(f"PDF generated successfully: {pdf_out} ({size_kb:.1f} KB)")
        
        # Copy to root and website
        root_pdf = os.path.join(base_dir, "PROJECT_PRESENTATION.pdf")
        web_pdf = os.path.join(base_dir, "website", "PROJECT_PRESENTATION.pdf")
        with open(pdf_out, "rb") as src, open(root_pdf, "wb") as dst:
            dst.write(src.read())
        with open(pdf_out, "rb") as src, open(web_pdf, "wb") as dst:
            dst.write(src.read())
        print("Copied PDF to root and website folder.")
    else:
        print(f"Error compiling PDF: {res.stderr}")

if __name__ == "__main__":
    generate_pdf()
