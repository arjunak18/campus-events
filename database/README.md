# Campus Events Calendar Database

This folder contains the database schema, migrations, and seed data for the Campus Events Calendar project, built on Supabase (PostgreSQL).

## Setup Instructions

### 1. Supabase Project Setup
- Create a new project in your Supabase dashboard.
- Note your Database connection details or use the Supabase CLI.

### 2. Running Migrations
You can apply these migrations in two ways:
- **Using Supabase CLI:** Run `supabase db push` after placing these in your `supabase/migrations/` folder.
- **Using Supabase SQL Editor:** Manually execute the files in order:
  1. `001_initial_schema.sql` - Creates tables and triggers
  2. `002_rls_policies.sql` - Configures Row Level Security
  3. `003_indexes.sql` - Adds performance indexes
  4. `004_functions.sql` - Creates database functions and triggers

### 3. Applying Seed Data
After applying migrations, execute `seed/seed.sql` to populate initial colleges, categories, and organizations. *Note: Ensure you have a registered user in `auth.users` to act as an organizer before seeding events.*

## Schema Overview
- **Profiles:** User information tied to Supabase Auth.
- **Colleges & Organizations:** Campus entities hosting events.
- **Events:** The core table containing event details, timing, location, and metadata.
- **Registrations & Saved Events:** User interaction with events.
- **Notifications:** System and event-based alerts.

## Important Notes on RLS
Row Level Security (RLS) is fully enabled. Authentication is required to create or interact with most records. Make sure to authenticate users in your application to test interactions.
