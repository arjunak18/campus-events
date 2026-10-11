-- Migration 003: Indexes

CREATE INDEX idx_events_start_date ON events(start_date);
CREATE INDEX idx_events_college_id ON events(college_id);
CREATE INDEX idx_events_organization_id ON events(organization_id);
CREATE INDEX idx_events_category_id ON events(category_id);
CREATE INDEX idx_events_organizer_id ON events(organizer_id);
CREATE INDEX idx_events_status ON events(status);
CREATE INDEX idx_events_visibility ON events(visibility);
CREATE INDEX idx_events_created_at ON events(created_at);
CREATE INDEX idx_events_published_at ON events(published_at);
CREATE INDEX idx_events_slug ON events(slug);

-- Full text search
ALTER TABLE events ADD COLUMN fts tsvector GENERATED ALWAYS AS (to_tsvector('english', coalesce(title, '') || ' ' || coalesce(description, ''))) STORED;
CREATE INDEX idx_events_fts ON events USING GIN (fts);

CREATE INDEX idx_event_regs_event_id ON event_registrations(event_id);
CREATE INDEX idx_event_regs_user_id ON event_registrations(user_id);

CREATE INDEX idx_saved_events_user_id ON saved_events(user_id);

CREATE INDEX idx_notifications_user_read ON notifications(user_id, is_read);

CREATE INDEX idx_orgs_college_id ON organizations(college_id);
CREATE INDEX idx_orgs_slug ON organizations(slug);
