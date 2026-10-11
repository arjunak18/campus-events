export type UserRole = 'student' | 'organizer' | 'college_admin' | 'platform_admin';

export interface User {
  id: string;
  email: string;
  display_name: string;
  avatar_url?: string;
  college_id?: string;
  department?: string;
  academic_year?: string;
  interests: string[];
  role: UserRole;
  push_token?: string;
  notification_preferences: {
    event_reminders: boolean;
    event_updates: boolean;
    new_events: boolean;
    registration_updates: boolean;
  };
  is_active: boolean;
  created_at: string;
  updated_at: string;
  college?: College;
}

export interface College {
  id: string;
  name: string;
  short_name?: string;
  logo_url?: string;
  description?: string;
  location?: string;
  website?: string;
  is_active: boolean;
}

export interface Organization {
  id: string;
  name: string;
  slug: string;
  description?: string;
  logo_url?: string;
  cover_url?: string;
  college_id: string;
  contact_email?: string;
  website?: string;
  social_links: Record<string, string>;
  is_verified: boolean;
  verification_date?: string;
  is_active: boolean;
  created_at: string;
  college?: College;
  follower_count?: number;
  is_following?: boolean;
}

export type EventStatus = 'draft' | 'published' | 'cancelled' | 'completed';
export type EventVisibility = 'public' | 'college_only' | 'selected_colleges' | 'private';
export type RegistrationType = 'none' | 'internal' | 'external';

export interface EventCategory {
  id: string;
  name: string;
  slug: string;
  icon?: string;
  color?: string;
}

export interface Event {
  id: string;
  title: string;
  slug: string;
  summary?: string;
  description: string;
  poster_url?: string;
  category_id?: string;
  category?: EventCategory;
  start_date: string;
  start_time?: string;
  end_date?: string;
  end_time?: string;
  timezone: string;
  is_all_day: boolean;
  venue?: string;
  venue_address?: string;
  venue_latitude?: number;
  venue_longitude?: number;
  is_online: boolean;
  meeting_url?: string;
  organizer_id: string;
  organizer?: User;
  organization_id?: string;
  organization?: Organization;
  college_id?: string;
  college?: College;
  registration_type: RegistrationType;
  registration_url?: string;
  registration_deadline?: string;
  max_attendees?: number;
  current_attendees: number;
  eligibility?: string;
  is_free: boolean;
  price?: number;
  price_currency: string;
  contact_email?: string;
  contact_phone?: string;
  visibility: EventVisibility;
  status: EventStatus;
  is_featured: boolean;
  tags: string[];
  views_count: number;
  likes_count: number;
  created_at: string;
  updated_at: string;
  published_at?: string;
  is_saved?: boolean;
  is_registered?: boolean;
  is_liked?: boolean;
}

export type RegistrationStatus = 'registered' | 'waitlisted' | 'cancelled' | 'attended';

export interface Registration {
  id: string;
  event_id: string;
  user_id: string;
  status: RegistrationStatus;
  registered_at: string;
  cancelled_at?: string;
  event?: Event;
}

export interface SavedEvent {
  id: string;
  event_id: string;
  user_id: string;
  created_at: string;
  event?: Event;
}

export interface Notification {
  id: string;
  user_id: string;
  type: 'event_reminder' | 'event_update' | 'event_cancelled' | 'registration_confirmed' | 'registration_deadline' | 'new_event' | 'org_event' | 'event_comment' | 'verification_update' | 'system';
  title: string;
  body?: string;
  data: Record<string, any>;
  event_id?: string;
  is_read: boolean;
  sent_at?: string;
  created_at: string;
}

export interface EventReport {
  id: string;
  event_id: string;
  reporter_id: string;
  reason: 'spam' | 'inappropriate' | 'misleading' | 'duplicate' | 'harassment' | 'copyright' | 'other';
  description?: string;
  status: 'pending' | 'reviewed' | 'resolved' | 'dismissed';
  created_at: string;
}

export interface PaginatedResponse<T> {
  success: boolean;
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}
