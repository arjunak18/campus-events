-- Migration 005: Resilient Server-Side Profile Synchronization
-- Guarantees atomic profile insertion on user creation across Google OAuth, Magic Link, and Password signup
-- Saves all user metadata: display_name, email, department, academic_year, college_id

CREATE OR REPLACE FUNCTION public.handle_auth_user_created()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, auth, pg_temp
AS $$
DECLARE
  v_display_name TEXT;
  v_avatar_url TEXT;
  v_department TEXT;
  v_academic_year TEXT;
  v_college_id UUID;
BEGIN
  -- 1. Extract Display Name safely from various OAuth / signup fields
  v_display_name := COALESCE(
    NULLIF(TRIM(NEW.raw_user_meta_data->>'display_name'), ''),
    NULLIF(TRIM(NEW.raw_user_meta_data->>'full_name'), ''),
    NULLIF(TRIM(NEW.raw_user_meta_data->>'name'), ''),
    split_part(COALESCE(NEW.email, 'student@campus.edu'), '@', 1)
  );

  -- 2. Extract Avatar URL or generate friendly avatar seed
  v_avatar_url := COALESCE(
    NULLIF(TRIM(NEW.raw_user_meta_data->>'avatar_url'), ''),
    NULLIF(TRIM(NEW.raw_user_meta_data->>'picture'), ''),
    'https://api.dicebear.com/7.x/bottts/png?seed=' || COALESCE(NEW.email, NEW.id::text)
  );

  -- 3. Extract Department and Academic Year
  v_department := NULLIF(TRIM(NEW.raw_user_meta_data->>'department'), '');
  v_academic_year := NULLIF(TRIM(NEW.raw_user_meta_data->>'academic_year'), '');

  -- 4. Extract College ID safely (handling possible non-UUID values)
  BEGIN
    v_college_id := NULLIF(TRIM(NEW.raw_user_meta_data->>'college_id'), '')::UUID;
  EXCEPTION WHEN OTHERS THEN
    v_college_id := NULL;
  END;

  -- 5. Atomic Upsert into public.profiles
  INSERT INTO public.profiles (
    id,
    email,
    display_name,
    avatar_url,
    department,
    academic_year,
    college_id,
    role,
    is_active,
    created_at,
    updated_at
  ) VALUES (
    NEW.id,
    COALESCE(NEW.email, ''),
    v_display_name,
    v_avatar_url,
    v_department,
    v_academic_year,
    v_college_id,
    'student',
    TRUE,
    NOW(),
    NOW()
  )
  ON CONFLICT (id) DO UPDATE SET
    email = EXCLUDED.email,
    display_name = COALESCE(NULLIF(public.profiles.display_name, 'Unknown User'), EXCLUDED.display_name),
    avatar_url = COALESCE(public.profiles.avatar_url, EXCLUDED.avatar_url),
    department = COALESCE(EXCLUDED.department, public.profiles.department),
    academic_year = COALESCE(EXCLUDED.academic_year, public.profiles.academic_year),
    college_id = COALESCE(EXCLUDED.college_id, public.profiles.college_id),
    updated_at = NOW();

  RETURN NEW;
EXCEPTION
  WHEN OTHERS THEN
    -- Ensure user creation in auth.users is NEVER blocked by profile trigger errors
    RAISE WARNING 'Profile auto-provisioning warning for user %: %', NEW.id, SQLERRM;
    RETURN NEW;
END;
$$;

-- Drop any existing triggers on auth.users to prevent conflicts
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

-- Recreate trigger on auth.users
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_auth_user_created();

-- Ensure Row Level Security permits proper access
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public profiles are viewable by everyone" ON public.profiles;
CREATE POLICY "Public profiles are viewable by everyone" ON public.profiles
  FOR SELECT USING (true);

DROP POLICY IF EXISTS "Allow user to insert own profile" ON public.profiles;
CREATE POLICY "Allow user to insert own profile" ON public.profiles
  FOR INSERT WITH CHECK (auth.uid() = id OR auth.uid() IS NULL);

DROP POLICY IF EXISTS "Allow user to update own profile" ON public.profiles;
CREATE POLICY "Allow user to update own profile" ON public.profiles
  FOR UPDATE USING (auth.uid() = id);
