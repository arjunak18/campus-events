-- Migration 006: User Sign-In Tracking and Activity Logging
-- Records sign-in timestamps and logs every login session into the database

-- 1. Add last_sign_in_at and sign_in_count columns to profiles table if they do not exist
ALTER TABLE public.profiles 
  ADD COLUMN IF NOT EXISTS last_sign_in_at TIMESTAMPTZ DEFAULT NOW(),
  ADD COLUMN IF NOT EXISTS sign_in_count INTEGER DEFAULT 1;

-- 2. Create sign_in_logs table to track full login history
CREATE TABLE IF NOT EXISTS public.sign_in_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  sign_in_method TEXT DEFAULT 'email_password',
  signed_in_at TIMESTAMPTZ DEFAULT NOW(),
  ip_address TEXT,
  user_agent TEXT
);

-- 3. Indexes for fast lookup
CREATE INDEX IF NOT EXISTS idx_sign_in_logs_user_id ON public.sign_in_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_sign_in_logs_email ON public.sign_in_logs(email);
CREATE INDEX IF NOT EXISTS idx_sign_in_logs_signed_in_at ON public.sign_in_logs(signed_in_at DESC);

-- 4. Row Level Security
ALTER TABLE public.sign_in_logs ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view own sign-in logs" ON public.sign_in_logs;
CREATE POLICY "Users can view own sign-in logs" ON public.sign_in_logs
  FOR SELECT USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Service role can manage sign-in logs" ON public.sign_in_logs;
CREATE POLICY "Service role can manage sign-in logs" ON public.sign_in_logs
  FOR ALL USING (true) WITH CHECK (true);
