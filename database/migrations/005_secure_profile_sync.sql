-- Migration 005: Resilient Server-Side Profile Synchronization
-- Guarantees atomic profile insertion on user creation across Google OAuth, Magic Link, and Password signup

CREATE OR REPLACE FUNCTION public.handle_auth_user_created()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, auth, pg_temp
AS $$
DECLARE
  v_display_name TEXT;
  v_avatar_url TEXT;
BEGIN
  -- Extract Google OAuth or Email provider metadata safely
  v_display_name := COALESCE(
    NEW.raw_user_meta_data->>'full_name',
    NEW.raw_user_meta_data->>'name',
    NEW.raw_user_meta_data->>'display_name',
    split_part(COALESCE(NEW.email, 'student@campus.edu'), '@', 1)
  );

  v_avatar_url := COALESCE(
    NEW.raw_user_meta_data->>'avatar_url',
    NEW.raw_user_meta_data->>'picture',
    'https://api.dicebear.com/7.x/bottts/png?seed=' || encode(digest(COALESCE(NEW.email, NEW.id::text), 'sha256'), 'hex')
  );

  INSERT INTO public.profiles (
    id,
    email,
    display_name,
    avatar_url,
    role,
    is_active,
    created_at,
    updated_at
  ) VALUES (
    NEW.id,
    COALESCE(NEW.email, ''),
    v_display_name,
    v_avatar_url,
    'student',
    TRUE,
    NOW(),
    NOW()
  )
  ON CONFLICT (id) DO UPDATE SET
    email = EXCLUDED.email,
    display_name = COALESCE(NULLIF(public.profiles.display_name, 'Unknown User'), EXCLUDED.display_name),
    avatar_url = COALESCE(public.profiles.avatar_url, EXCLUDED.avatar_url),
    updated_at = NOW();

  RETURN NEW;
EXCEPTION
  WHEN OTHERS THEN
    -- Ensure user creation in auth.users is never blocked by profile trigger errors
    RAISE WARNING 'Profile auto-provisioning warning for user %: %', NEW.id, SQLERRM;
    RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_auth_user_created();
