# Campus Events Calendar — Deployment Guide

## Prerequisites

- Node.js >= 20
- npm >= 10
- A [Supabase](https://supabase.com) account and project
- An [Expo](https://expo.dev) account (for EAS Build)
- A hosting provider for the Express backend (e.g., Railway, Render, Fly.io, or a VPS)

---

## 1. Supabase Setup

### Create Project
1. Go to [supabase.com](https://supabase.com) and create a new project
2. Note your project URL and keys from Settings > API:
   - **Project URL**: `https://xxxxx.supabase.co`
   - **Anon Key**: Public key for client-side use
   - **Service Role Key**: Secret key for server-side use only

### Apply Database Migrations
1. Open the SQL Editor in your Supabase dashboard
2. Run each migration file in order:
   - `database/migrations/001_initial_schema.sql`
   - `database/migrations/002_rls_policies.sql`
   - `database/migrations/003_indexes.sql`
   - `database/migrations/004_functions.sql`
3. (Optional) Run `database/seed/seed.sql` for development data

### Configure Authentication
1. Go to Authentication > Settings
2. Enable **Email/Password** sign-in
3. (Optional) Enable **Google** OAuth:
   - Create OAuth credentials in Google Cloud Console
   - Add Client ID and Secret in Supabase Auth settings
4. Set redirect URLs for your app scheme

### Create Storage Buckets
1. Go to Storage and create these buckets:
   - `event-posters` (Public)
   - `avatars` (Public)
   - `org-logos` (Public)
   - `attachments` (Private)
2. Set appropriate storage policies for each bucket

---

## 2. Backend Deployment

### Environment Variables

Set these in your hosting provider:

```env
PORT=3000
NODE_ENV=production
SUPABASE_URL=https://xxxxx.supabase.co
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
SUPABASE_ANON_KEY=your-anon-key
ALLOWED_ORIGINS=https://your-app-domain.com
```

### Deploy to Railway (Example)

```bash
# Install Railway CLI
npm install -g @railway/cli

# Login
railway login

# Initialize project
cd backend
railway init

# Set environment variables
railway variables set PORT=3000
railway variables set NODE_ENV=production
railway variables set SUPABASE_URL=https://xxxxx.supabase.co
railway variables set SUPABASE_SERVICE_ROLE_KEY=your-key
railway variables set SUPABASE_ANON_KEY=your-key
railway variables set ALLOWED_ORIGINS=*

# Deploy
railway up
```

### Deploy to Render (Alternative)

1. Push code to GitHub
2. Create a new Web Service on [render.com](https://render.com)
3. Connect your GitHub repository
4. Set build command: `cd backend && npm install && npm run build`
5. Set start command: `cd backend && npm start`
6. Add environment variables in the dashboard

---

## 3. Mobile App Development

### Local Development

```bash
cd mobile
npm install

# Create .env from example
cp .env.example .env
# Edit .env with your values

# Start development server
npx expo start
```

### Testing on Physical Device
1. Install **Expo Go** on your Android/iOS device
2. Run `npx expo start`
3. Scan the QR code with your device

### Testing on Emulator
- **Android**: Press `a` in the terminal (requires Android Studio)
- **iOS**: Press `i` in the terminal (requires Xcode, macOS only)

---

## 4. Building for Production

### Install EAS CLI

```bash
npm install -g eas-cli
eas login
```

### Configure EAS Build

The `eas.json` file should already be configured. Verify it includes:

```json
{
  "build": {
    "preview": {
      "distribution": "internal",
      "android": { "buildType": "apk" }
    },
    "production": {
      "android": { "buildType": "app-bundle" },
      "ios": { "buildType": "archive" }
    }
  }
}
```

### Build Android APK (Preview)

```bash
cd mobile
eas build --platform android --profile preview
```

### Build Android AAB (Production)

```bash
eas build --platform android --profile production
```

### Build iOS (Production)

```bash
eas build --platform ios --profile production
```

> [!NOTE]
> iOS builds require an Apple Developer account ($99/year) and proper provisioning profiles.

---

## 5. Publishing to App Stores

### Google Play Store
1. Create a developer account at [play.google.com/console](https://play.google.com/console)
2. Create a new app listing
3. Upload the AAB file from EAS Build
4. Fill in store listing, screenshots, and privacy policy
5. Submit for review

### Apple App Store
1. Create a developer account at [developer.apple.com](https://developer.apple.com)
2. Create an app in App Store Connect
3. Upload the IPA via Transporter or EAS Submit
4. Fill in app metadata and screenshots
5. Submit for review

### EAS Submit (Automated)

```bash
# Android
eas submit --platform android

# iOS
eas submit --platform ios
```

---

## 6. Post-Deployment Checklist

- [ ] Backend API is accessible and returns 200 on `/api/health`
- [ ] Mobile app connects to production API URL
- [ ] Authentication flow works (register, login, logout)
- [ ] Events can be created and viewed
- [ ] Push notifications are configured
- [ ] Storage uploads work (event posters, avatars)
- [ ] RLS policies are correctly applied
- [ ] Rate limiting is active on production
- [ ] CORS is configured for production origins
- [ ] HTTPS is enforced
- [ ] Error monitoring is set up (optional: Sentry)
- [ ] Database backups are enabled in Supabase
