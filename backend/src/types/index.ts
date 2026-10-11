export type UserRole = 'student' | 'organizer' | 'college_admin' | 'platform_admin';

export interface User {
  id: string;
  email: string;
  role: UserRole;
  displayName?: string;
  avatarUrl?: string;
  collegeId?: string;
  pushToken?: string;
  createdAt: string;
  updatedAt: string;
}

export type EventStatus = 'draft' | 'published' | 'cancelled' | 'completed';
export type EventVisibility = 'public' | 'college_only' | 'invite_only';
export type RegistrationType = 'internal' | 'external' | 'none';

export interface EventCategory {
  id: string;
  name: string;
  slug: string;
  icon?: string;
  description?: string;
  createdAt: string;
}

export interface Event {
  id: string;
  slug: string;
  title: string;
  description: string;
  poster_url?: string;
  category_id?: string;
  start_date: string;
  start_time: string;
  end_date: string;
  end_time: string;
  timezone: string;
  is_all_day: boolean;
  venue?: string;
  venue_address?: string;
  venue_latitude?: number;
  venue_longitude?: number;
  is_online: boolean;
  meeting_url?: string;
  organizer_id: string;
  organization_id?: string;
  college_id: string;
  registration_type: RegistrationType;
  registration_url?: string;
  registration_deadline?: string;
  max_attendees?: number;
  current_attendees: number;
  eligibility?: string[];
  is_free: boolean;
  price?: number;
  price_currency: string;
  contact_email?: string;
  contact_phone?: string;
  visibility: EventVisibility;
  visible_to_colleges?: string[];
  status: EventStatus;
  is_featured: boolean;
  tags?: string[];
  views_count: number;
  likes_count: number;
  published_at?: string;
  created_at: string;
  updated_at: string;
}

export interface College {
  id: string;
  name: string;
  short_name?: string;
  domain: string;
  logo_url?: string;
  cover_url?: string;
  location?: string;
  website?: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface Organization {
  id: string;
  college_id: string;
  name: string;
  slug: string;
  description?: string;
  logo_url?: string;
  cover_url?: string;
  email?: string;
  website?: string;
  social_links?: any;
  is_verified: boolean;
  created_at: string;
  updated_at: string;
}

export type OrgRole = 'owner' | 'admin' | 'member';

export interface OrganizationMembership {
  id: string;
  organization_id: string;
  user_id: string;
  role: OrgRole;
  joined_at: string;
}

export interface OrganizationVerificationRequest {
  id: string;
  organization_id: string;
  requester_id: string;
  status: 'pending' | 'approved' | 'rejected';
  documents?: any;
  notes?: string;
  reviewer_id?: string;
  reviewed_at?: string;
  created_at: string;
}

export type RegistrationStatus = 'pending' | 'confirmed' | 'cancelled' | 'waitlisted';

export interface Registration {
  id: string;
  event_id: string;
  user_id: string;
  status: RegistrationStatus;
  ticket_code: string;
  check_in_time?: string;
  created_at: string;
  updated_at: string;
}

export interface SavedEvent {
  user_id: string;
  event_id: string;
  created_at: string;
}

export type NotificationType = 'event_reminder' | 'event_update' | 'new_event' | 'registration_confirmed' | 'org_invite' | 'system';

export interface Notification {
  id: string;
  user_id: string;
  type: NotificationType;
  title: string;
  body: string;
  data?: any;
  is_read: boolean;
  created_at: string;
}

export interface EventAttachment {
  id: string;
  event_id: string;
  name: string;
  file_url: string;
  file_type: string;
  file_size?: number;
  created_at: string;
}

export interface EventComment {
  id: string;
  event_id: string;
  user_id: string;
  content: string;
  is_edited: boolean;
  created_at: string;
  updated_at: string;
}

export interface EventLike {
  event_id: string;
  user_id: string;
  created_at: string;
}

export interface FollowedCollege {
  user_id: string;
  college_id: string;
  created_at: string;
}

export interface FollowedOrganization {
  user_id: string;
  organization_id: string;
  created_at: string;
}

export type ReportStatus = 'pending' | 'reviewed' | 'dismissed' | 'action_taken';

export interface EventReport {
  id: string;
  event_id: string;
  reporter_id: string;
  reason: string;
  details?: string;
  status: ReportStatus;
  reviewer_id?: string;
  reviewed_at?: string;
  created_at: string;
}

export interface EventAuditLog {
  id: string;
  event_id: string;
  actor_id: string;
  action: string;
  changes?: any;
  created_at: string;
}

export interface PaginationParams {
  page: number;
  limit: number;
}

export interface PaginatedResult<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface ApiResponse<T = any> {
  success: boolean;
  message?: string;
  data?: T;
  pagination?: PaginatedResult<T>['pagination'];
  errors?: any;
}

export interface ApiError {
  success: false;
  message: string;
  errors?: any;
}
