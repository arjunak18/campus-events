# 🎓 Campus Events Calendar

A modern, production-oriented mobile application for discovering campus events, browsing events on a calendar, publishing authorized events, registering for activities, saving events, following organizations, and receiving notifications.

## 🏗️ Architecture

```
campus-events/
├── mobile/          # React Native (Expo) mobile app
├── backend/         # Express.js REST API
├── database/        # PostgreSQL migrations & seed data
├── admin-dashboard/ # React web admin panel (Phase 8)
└── docs/            # Architecture & API documentation
```

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| **Mobile** | React Native, Expo SDK 53, TypeScript, Expo Router |
| **State** | TanStack Query, React Context |
| **Forms** | React Hook Form + Zod |
| **Backend** | Node.js, Express.js, TypeScript |
| **Database** | Supabase PostgreSQL |
| **Auth** | Supabase Auth |
| **Storage** | Supabase Storage |
| **Notifications** | Expo Notifications |

## 🎨 Design

Dark theme using the [Color Hunt palette](https://colorhunt.co/palette/0000002222221dcd9f169976):

| Color | Hex | Usage |
|-------|-----|-------|
| Primary Background | `#000000` | Main app background |
| Secondary Background | `#222222` | Cards, modals, inputs |
| Primary Accent | `#1DCD9F` | Buttons, selected items, highlights |
| Secondary Accent | `#169976` | Secondary buttons, borders |

## 🚀 Quick Start

### Prerequisites

- Node.js >= 20
- npm >= 10
- Expo CLI (`npx expo`)
- A [Supabase](https://supabase.com) project
- Android Studio / Xcode (for emulators) or Expo Go on a physical device

### 1. Clone & Install

```bash
# Install mobile dependencies
cd mobile
npm install

# Install backend dependencies
cd ../backend
npm install
```

### 2. Configure Environment

```bash
# Mobile
cp mobile/.env.example mobile/.env
# Edit mobile/.env with your Supabase project URL and anon key

# Backend
cp backend/.env.example backend/.env
# Edit backend/.env with your Supabase URL, service role key, and other config
```

### 3. Set Up Database

1. Create a new project at [supabase.com](https://supabase.com)
2. Go to the SQL Editor in your Supabase dashboard
3. Run the migration files in order:
   - `database/migrations/001_initial_schema.sql`
   - `database/migrations/002_rls_policies.sql`
   - `database/migrations/003_indexes.sql`
   - `database/migrations/004_functions.sql`
4. Optionally run `database/seed/seed.sql` for sample data

### 4. Configure Supabase Storage

Create these storage buckets in your Supabase dashboard:
- `event-posters` — Public read, authenticated upload
- `avatars` — Public read, authenticated upload
- `org-logos` — Public read, authenticated upload
- `attachments` — Authenticated read and upload

### 5. Configure Supabase Auth

In your Supabase dashboard under Authentication > Settings:
- Enable Email/Password sign-in
- (Optional) Enable Google OAuth provider
- Set the redirect URL for your app

### 6. Run the Backend

```bash
cd backend
npm run dev
# API runs at http://localhost:3000
```

### 7. Run the Mobile App

```bash
cd mobile
npx expo start
# Scan the QR code with Expo Go, or press 'a' for Android emulator
```

### 8. Run the Admin Dashboard (Web)

```bash
cd admin-dashboard
npm install
npm run dev
# Dashboard runs at http://localhost:5173
```

## 📱 App Screens

| Screen | Description |
|--------|-------------|
| **Home** | Calendar view, upcoming events, greeting |
| **Explore** | Search, filters, event discovery |
| **Create Event** | Full event creation form |
| **Saved** | Bookmarked and registered events |
| **Profile** | User info, settings, sign out |

## 🔐 Security

- Supabase Auth for authentication (no plaintext passwords)
- Row Level Security (RLS) on all tables
- Server-side role verification
- Input validation with Zod on both client and server
- Rate limiting on sensitive endpoints
- CORS configured for intended origins
- Environment variables for all secrets

## 🧪 Testing

```bash
# Backend tests
cd backend
npm test

# Mobile tests
cd mobile
npm test
```

## 📄 License

MIT
