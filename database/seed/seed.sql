-- Seed Data

-- Generate static UUIDs
-- Colleges
INSERT INTO colleges (id, name, short_name, location) VALUES
  ('c0000000-0000-0000-0000-000000000001', 'University of Technology', 'UOT', 'New York'),
  ('c0000000-0000-0000-0000-000000000002', 'State College of Arts', 'SCA', 'Los Angeles'),
  ('c0000000-0000-0000-0000-000000000003', 'National Science Institute', 'NSI', 'Chicago'),
  ('c0000000-0000-0000-0000-000000000004', 'Global Business School', 'GBS', 'London'),
  ('c0000000-0000-0000-0000-000000000005', 'Creative Arts Academy', 'CAA', 'Paris');

-- Event Categories
INSERT INTO event_categories (id, name, slug) VALUES
  ('cat00000-0000-0000-0000-000000000001', 'Technology', 'technology'),
  ('cat00000-0000-0000-0000-000000000002', 'AI', 'ai'),
  ('cat00000-0000-0000-0000-000000000003', 'Cybersecurity', 'cybersecurity'),
  ('cat00000-0000-0000-0000-000000000004', 'Hackathons', 'hackathons'),
  ('cat00000-0000-0000-0000-000000000005', 'Coding Competitions', 'coding-competitions'),
  ('cat00000-0000-0000-0000-000000000006', 'Workshops', 'workshops'),
  ('cat00000-0000-0000-0000-000000000007', 'Seminars', 'seminars'),
  ('cat00000-0000-0000-0000-000000000008', 'Conferences', 'conferences'),
  ('cat00000-0000-0000-0000-000000000009', 'Cultural Events', 'cultural-events'),
  ('cat00000-0000-0000-0000-000000000010', 'Sports', 'sports'),
  ('cat00000-0000-0000-0000-000000000011', 'Arts', 'arts'),
  ('cat00000-0000-0000-0000-000000000012', 'Club Meetings', 'club-meetings'),
  ('cat00000-0000-0000-0000-000000000013', 'Career Events', 'career-events'),
  ('cat00000-0000-0000-0000-000000000014', 'Internships', 'internships'),
  ('cat00000-0000-0000-0000-000000000015', 'Other', 'other');

-- Organizations
INSERT INTO organizations (id, name, slug, college_id, is_verified) VALUES
  ('org00000-0000-0000-0000-000000000001', 'Tech Club', 'tech-club', 'c0000000-0000-0000-0000-000000000001', true),
  ('org00000-0000-0000-0000-000000000002', 'Art Society', 'art-society', 'c0000000-0000-0000-0000-000000000002', true),
  ('org00000-0000-0000-0000-000000000003', 'Science Innovators', 'science-innovators', 'c0000000-0000-0000-0000-000000000003', false),
  ('org00000-0000-0000-0000-000000000004', 'Business Leaders', 'business-leaders', 'c0000000-0000-0000-0000-000000000004', false),
  ('org00000-0000-0000-0000-000000000005', 'Music Band', 'music-band', 'c0000000-0000-0000-0000-000000000005', false);

-- Note: A mock user is needed for organizer_id. 
-- In a real setup, you should use auth.users seed. Here we assume an existing auth user 'u0000000-0000-0000-0000-000000000001'
-- For the sake of schema, we will skip inserting into profiles unless you bypass foreign key constraints, or you can run this after setting up an auth user.
