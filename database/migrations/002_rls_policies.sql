-- Migration 002: RLS Policies

-- Enable RLS on all tables
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE colleges ENABLE ROW LEVEL SECURITY;
ALTER TABLE college_memberships ENABLE ROW LEVEL SECURITY;
ALTER TABLE organizations ENABLE ROW LEVEL SECURITY;
ALTER TABLE organization_memberships ENABLE ROW LEVEL SECURITY;
ALTER TABLE organization_verification_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE event_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE events ENABLE ROW LEVEL SECURITY;
ALTER TABLE event_attachments ENABLE ROW LEVEL SECURITY;
ALTER TABLE event_registrations ENABLE ROW LEVEL SECURITY;
ALTER TABLE saved_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE followed_colleges ENABLE ROW LEVEL SECURITY;
ALTER TABLE followed_organizations ENABLE ROW LEVEL SECURITY;
ALTER TABLE event_likes ENABLE ROW LEVEL SECURITY;
ALTER TABLE event_comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE event_reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE event_audit_logs ENABLE ROW LEVEL SECURITY;

-- profiles
CREATE POLICY "Users can read any profile" ON profiles FOR SELECT USING (true);
CREATE POLICY "Users can update own profile" ON profiles FOR UPDATE USING (auth.uid() = id);

-- events
CREATE POLICY "Anyone can read published public events" ON events FOR SELECT
USING (status = 'published' AND visibility = 'public');

CREATE POLICY "Users can read college events if they belong to it" ON events FOR SELECT
USING (
  status = 'published' AND 
  visibility = 'college_only' AND 
  college_id IN (SELECT college_id FROM profiles WHERE id = auth.uid())
);

CREATE POLICY "Organizers can read their own draft events" ON events FOR SELECT
USING (organizer_id = auth.uid());

CREATE POLICY "Authenticated users can create events" ON events FOR INSERT
WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Organizers and admins can update events" ON events FOR UPDATE
USING (
  organizer_id = auth.uid() OR
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('platform_admin'))
);

CREATE POLICY "Organizers and admins can delete events" ON events FOR DELETE
USING (
  organizer_id = auth.uid() OR
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('platform_admin'))
);

-- event_registrations
CREATE POLICY "Users can read own registrations" ON event_registrations FOR SELECT
USING (user_id = auth.uid() OR EXISTS (SELECT 1 FROM events WHERE id = event_id AND organizer_id = auth.uid()));

CREATE POLICY "Authenticated users can register" ON event_registrations FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own registration" ON event_registrations FOR UPDATE
USING (user_id = auth.uid() OR EXISTS (SELECT 1 FROM events WHERE id = event_id AND organizer_id = auth.uid()));

CREATE POLICY "Users can cancel own registration" ON event_registrations FOR DELETE
USING (user_id = auth.uid());

-- saved_events
CREATE POLICY "Users can manage own saved events" ON saved_events
USING (user_id = auth.uid());

-- followed_colleges
CREATE POLICY "Users can manage own followed colleges" ON followed_colleges
USING (user_id = auth.uid());

-- followed_organizations
CREATE POLICY "Users can manage own followed orgs" ON followed_organizations
USING (user_id = auth.uid());

-- notifications
CREATE POLICY "Users can see own notifications" ON notifications FOR SELECT
USING (user_id = auth.uid());

CREATE POLICY "Users can update own notifications" ON notifications FOR UPDATE
USING (user_id = auth.uid());

-- organizations
CREATE POLICY "Anyone can read organizations" ON organizations FOR SELECT USING (true);
CREATE POLICY "Authenticated users can create orgs" ON organizations FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Admins can update orgs" ON organizations FOR UPDATE USING (
  EXISTS (SELECT 1 FROM organization_memberships WHERE organization_id = id AND user_id = auth.uid() AND role IN ('admin', 'owner'))
);

-- event_reports
CREATE POLICY "Authenticated users can report" ON event_reports FOR INSERT WITH CHECK (auth.role() = 'authenticated' AND reporter_id = auth.uid());
CREATE POLICY "Reporters can see own reports" ON event_reports FOR SELECT USING (
  reporter_id = auth.uid() OR EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('platform_admin'))
);

-- Others
CREATE POLICY "Anyone can read categories" ON event_categories FOR SELECT USING (true);
CREATE POLICY "Anyone can read colleges" ON colleges FOR SELECT USING (true);
