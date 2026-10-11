export const EVENT_CATEGORIES = [
  'Technology',
  'Artificial Intelligence',
  'Cybersecurity',
  'Hackathons',
  'Coding Competitions',
  'Workshops',
  'Seminars',
  'Conferences',
  'Cultural Events',
  'Sports',
  'Arts',
  'Club Meetings',
  'Career Events',
  'Internships and Opportunities',
  'Other',
] as const;

export type EventCategoryName = typeof EVENT_CATEGORIES[number];