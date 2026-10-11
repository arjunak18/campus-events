-- Seed Data

-- Generate static UUIDs
-- Colleges
INSERT INTO colleges (id, name, short_name, location) VALUES
  ('a0000000-0000-0000-0000-000000000001', 'University of Technology', 'UOT', 'New York'),
  ('a0000000-0000-0000-0000-000000000002', 'State College of Arts', 'SCA', 'Los Angeles'),
  ('a0000000-0000-0000-0000-000000000003', 'National Science Institute', 'NSI', 'Chicago'),
  ('a0000000-0000-0000-0000-000000000004', 'Global Business School', 'GBS', 'London'),
  ('a0000000-0000-0000-0000-000000000005', 'Creative Arts Academy', 'CAA', 'Paris')
ON CONFLICT (id) DO NOTHING;

-- Event Categories
INSERT INTO event_categories (id, name, slug) VALUES
  ('b0000000-0000-0000-0000-000000000001', 'Technology', 'technology'),
  ('b0000000-0000-0000-0000-000000000002', 'AI', 'ai'),
  ('b0000000-0000-0000-0000-000000000003', 'Cybersecurity', 'cybersecurity'),
  ('b0000000-0000-0000-0000-000000000004', 'Hackathons', 'hackathons'),
  ('b0000000-0000-0000-0000-000000000005', 'Coding Competitions', 'coding-competitions'),
  ('b0000000-0000-0000-0000-000000000006', 'Workshops', 'workshops'),
  ('b0000000-0000-0000-0000-000000000007', 'Seminars', 'seminars'),
  ('b0000000-0000-0000-0000-000000000008', 'Conferences', 'conferences'),
  ('b0000000-0000-0000-0000-000000000009', 'Cultural Events', 'cultural-events'),
  ('b0000000-0000-0000-0000-000000000010', 'Sports', 'sports'),
  ('b0000000-0000-0000-0000-000000000011', 'Arts', 'arts'),
  ('b0000000-0000-0000-0000-000000000012', 'Club Meetings', 'club-meetings'),
  ('b0000000-0000-0000-0000-000000000013', 'Career Events', 'career-events'),
  ('b0000000-0000-0000-0000-000000000014', 'Internships', 'internships'),
  ('b0000000-0000-0000-0000-000000000015', 'Other', 'other')
ON CONFLICT (id) DO NOTHING;

-- Organizations
INSERT INTO organizations (id, name, slug, college_id, is_verified) VALUES
  ('d0000000-0000-0000-0000-000000000001', 'Tech Club', 'tech-club', 'a0000000-0000-0000-0000-000000000001', true),
  ('d0000000-0000-0000-0000-000000000002', 'Art Society', 'art-society', 'a0000000-0000-0000-0000-000000000002', true),
  ('d0000000-0000-0000-0000-000000000003', 'Science Innovators', 'science-innovators', 'a0000000-0000-0000-0000-000000000003', false),
  ('d0000000-0000-0000-0000-000000000004', 'Business Leaders', 'business-leaders', 'a0000000-0000-0000-0000-000000000004', false),
  ('d0000000-0000-0000-0000-000000000005', 'Music Band', 'music-band', 'a0000000-0000-0000-0000-000000000005', false)
ON CONFLICT (id) DO NOTHING;

-- Note: A mock user is needed for organizer_id. 
-- In a real setup, you should use auth.users seed. Here we assume an existing auth user 'u0000000-0000-0000-0000-000000000001'
-- For the sake of schema, we will skip inserting into profiles unless you bypass foreign key constraints, or you can run this after setting up an auth user.
