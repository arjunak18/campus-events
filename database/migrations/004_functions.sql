-- Migration 004: Functions

-- Registration function
CREATE OR REPLACE FUNCTION register_for_event(p_event_id UUID, p_user_id UUID)
RETURNS event_registrations AS $$
DECLARE
  v_event events;
  v_registration event_registrations;
BEGIN
  -- Check if event exists and published
  SELECT * INTO v_event FROM events WHERE id = p_event_id AND status = 'published';
  IF NOT FOUND THEN
    RAISE EXCEPTION 'Event not found or not published';
  END IF;

  -- Check deadline
  IF v_event.registration_deadline IS NOT NULL AND v_event.registration_deadline < NOW() THEN
    RAISE EXCEPTION 'Registration deadline passed';
  END IF;

  -- Check existing registration
  IF EXISTS (SELECT 1 FROM event_registrations WHERE event_id = p_event_id AND user_id = p_user_id) THEN
    RAISE EXCEPTION 'Already registered';
  END IF;

  -- Capacity logic
  IF v_event.max_attendees IS NOT NULL AND v_event.current_attendees >= v_event.max_attendees THEN
    INSERT INTO event_registrations (event_id, user_id, status) VALUES (p_event_id, p_user_id, 'waitlisted') RETURNING * INTO v_registration;
  ELSE
    INSERT INTO event_registrations (event_id, user_id, status) VALUES (p_event_id, p_user_id, 'registered') RETURNING * INTO v_registration;
    UPDATE events SET current_attendees = current_attendees + 1 WHERE id = p_event_id;
  END IF;

  RETURN v_registration;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;


-- Unregister function
CREATE OR REPLACE FUNCTION unregister_from_event(p_event_id UUID, p_user_id UUID)
RETURNS void AS $$
DECLARE
  v_reg event_registrations;
BEGIN
  SELECT * INTO v_reg FROM event_registrations WHERE event_id = p_event_id AND user_id = p_user_id AND status = 'registered';
  IF FOUND THEN
    UPDATE event_registrations SET status = 'cancelled', cancelled_at = NOW() WHERE id = v_reg.id;
    UPDATE events SET current_attendees = current_attendees - 1 WHERE id = p_event_id;
    
    -- Promote from waitlist
    WITH next_waitlist AS (
      SELECT id FROM event_registrations 
      WHERE event_id = p_event_id AND status = 'waitlisted' 
      ORDER BY registered_at ASC LIMIT 1
    )
    UPDATE event_registrations SET status = 'registered' 
    WHERE id = (SELECT id FROM next_waitlist);
    
    -- Increment back if we promoted
    IF FOUND THEN
       UPDATE events SET current_attendees = current_attendees + 1 WHERE id = p_event_id;
    END IF;
  ELSE
    -- If they were just waitlisted
    UPDATE event_registrations SET status = 'cancelled', cancelled_at = NOW() WHERE event_id = p_event_id AND user_id = p_user_id AND status = 'waitlisted';
  END IF;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;


-- Handle new user trigger function
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO profiles (id, email, display_name, avatar_url)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.raw_user_meta_data->>'name', 'Unknown User'),
    NEW.raw_user_meta_data->>'avatar_url'
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to call handle_new_user on insert into auth.users (requires superuser typically in supabase, done via dashboard)
-- We will just provide the SQL for it
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE handle_new_user();


-- Search events
CREATE OR REPLACE FUNCTION search_events(p_query TEXT, p_filters JSONB DEFAULT '{}'::jsonb)
RETURNS SETOF events AS $$
BEGIN
  RETURN QUERY
  SELECT * FROM events
  WHERE 
    status = 'published'
    AND (p_query IS NULL OR p_query = '' OR fts @@ websearch_to_tsquery('english', p_query))
    AND (p_filters->>'category_id' IS NULL OR category_id = (p_filters->>'category_id')::uuid)
    AND (p_filters->>'college_id' IS NULL OR college_id = (p_filters->>'college_id')::uuid)
    AND (p_filters->>'is_online' IS NULL OR is_online = (p_filters->>'is_online')::boolean)
  ORDER BY start_date ASC;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
