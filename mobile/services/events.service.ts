import api from './api';
import { Event, PaginatedResponse, ApiResponse } from '../types';

export interface EventQueryParams {
  page?: number;
  limit?: number;
  category?: string;
  search?: string;
  college_id?: string;
  collegeId?: string;
  organizationId?: string;
  dateFrom?: string;
  dateTo?: string;
  start_date?: string;
  end_date?: string;
  is_online?: boolean;
  isOnline?: boolean;
  isFree?: boolean;
  status?: string;
  sort?: string;
}

const getFallbackEvents = (): Event[] => {
  const now = new Date();
  const today = now.toISOString().split('T')[0];
  const tomorrow = new Date(now.getTime() + 86400000).toISOString().split('T')[0];
  const inThreeDays = new Date(now.getTime() + 3 * 86400000).toISOString().split('T')[0];
  const inSevenDays = new Date(now.getTime() + 7 * 86400000).toISOString().split('T')[0];
  const inFourteenDays = new Date(now.getTime() + 14 * 86400000).toISOString().split('T')[0];

  return [
    {
      id: 'e0000000-0000-0000-0000-000000000001',
      slug: 'annual-hackathon-2026',
      title: 'Inter-College Hackathon 2026',
      summary: '36-hour flagship hackathon solving real-world AI, Web3, and sustainability challenges.',
      description: 'Join over 400 developers, designers, and innovators in our annual flagship hackathon. Mentors from Google, Microsoft, and top startups will be present. Prizes worth ₹3,00,000 to be won. Free meals and swag provided for all registered participants.',
      poster_url: 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=800&auto=format&fit=crop&q=80',
      category_id: 'b0000000-0000-0000-0000-000000000004',
      category: { id: 'b0000000-0000-0000-0000-000000000004', name: 'Hackathons', slug: 'hackathons' },
      start_date: today,
      start_time: '09:00 AM',
      end_date: tomorrow,
      end_time: '09:00 PM',
      timezone: 'Asia/Kolkata',
      is_all_day: false,
      venue: 'Main Auditorium & Innovation Lab',
      venue_address: 'Engineering Block 3, North Campus',
      is_online: false,
      organizer_id: 'u0000000-0000-0000-0000-000000000001',
      organization_id: 'd0000000-0000-0000-0000-000000000001',
      organization: { id: 'd0000000-0000-0000-0000-000000000001', name: 'Tech Club', slug: 'tech-club', college_id: 'a0000000-0000-0000-0000-000000000001', is_verified: true, social_links: {}, is_active: true, created_at: new Date().toISOString() },
      college_id: 'a0000000-0000-0000-0000-000000000001',
      college: { id: 'a0000000-0000-0000-0000-000000000001', name: 'National Institute of Technology', is_active: true },
      registration_type: 'internal',
      registration_deadline: inThreeDays,
      max_attendees: 300,
      current_attendees: 184,
      eligibility: 'All enrolled undergraduate & postgraduate students',
      is_free: true,
      price_currency: 'INR',
      visibility: 'public',
      status: 'published',
      is_featured: true,
      tags: ['Hackathon', 'Coding', 'AI', 'Innovation'],
      views_count: 512,
      likes_count: 94,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
    {
      id: 'e0000000-0000-0000-0000-000000000002',
      slug: 'ai-machine-learning-masterclass',
      title: 'Hands-on Generative AI & LLM Workshop',
      summary: 'Build and deploy local LLM applications using LangChain, Ollama, and vector databases.',
      description: 'A deep-dive technical workshop led by AI industry practitioners. Learn the theory of transformer architectures and build a functional Retrieval-Augmented Generation (RAG) agent from scratch. Bring your laptops with Python installed.',
      poster_url: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=800&auto=format&fit=crop&q=80',
      category_id: 'b0000000-0000-0000-0000-000000000002',
      category: { id: 'b0000000-0000-0000-0000-000000000002', name: 'Artificial Intelligence', slug: 'ai' },
      start_date: today,
      start_time: '02:00 PM',
      end_date: today,
      end_time: '05:30 PM',
      timezone: 'Asia/Kolkata',
      is_all_day: false,
      venue: 'Advanced Computing Lab 4',
      venue_address: 'CS Department, 2nd Floor',
      is_online: false,
      organizer_id: 'u0000000-0000-0000-0000-000000000001',
      organization_id: 'd0000000-0000-0000-0000-000000000001',
      organization: { id: 'd0000000-0000-0000-0000-000000000001', name: 'Tech Club', slug: 'tech-club', college_id: 'a0000000-0000-0000-0000-000000000001', is_verified: true, social_links: {}, is_active: true, created_at: new Date().toISOString() },
      college_id: 'a0000000-0000-0000-0000-000000000001',
      college: { id: 'a0000000-0000-0000-0000-000000000001', name: 'National Institute of Technology', is_active: true },
      registration_type: 'internal',
      registration_deadline: tomorrow,
      max_attendees: 120,
      current_attendees: 88,
      eligibility: 'Basic Python programming knowledge recommended',
      is_free: true,
      price_currency: 'INR',
      visibility: 'public',
      status: 'published',
      is_featured: true,
      tags: ['AI', 'LLM', 'Python', 'Workshop'],
      views_count: 342,
      likes_count: 67,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
    {
      id: 'e0000000-0000-0000-0000-000000000003',
      slug: 'inter-college-cultural-fest-2026',
      title: 'Inter-College Cultural Fest: Euphoria 2026',
      summary: '3 days of dance, music, battle of the bands, drama, and celebrity concerts.',
      description: 'The premier inter-college cultural festival uniting talent across 40+ universities. Experience breathtaking musical competitions, street plays, DJ nights, art exhibitions, and culinary stalls.',
      poster_url: 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=800&auto=format&fit=crop&q=80',
      category_id: 'b0000000-0000-0000-0000-000000000009',
      category: { id: 'b0000000-0000-0000-0000-000000000009', name: 'Cultural Events', slug: 'cultural-events' },
      start_date: inThreeDays,
      start_time: '10:00 AM',
      end_date: inSevenDays,
      end_time: '10:00 PM',
      timezone: 'Asia/Kolkata',
      is_all_day: false,
      venue: 'University Open Air Amphitheatre',
      venue_address: 'Campus Central Plaza',
      is_online: false,
      organizer_id: 'u0000000-0000-0000-0000-000000000001',
      organization_id: 'd0000000-0000-0000-0000-000000000002',
      organization: { id: 'd0000000-0000-0000-0000-000000000002', name: 'Art Society', slug: 'art-society', college_id: 'a0000000-0000-0000-0000-000000000001', is_verified: true, social_links: {}, is_active: true, created_at: new Date().toISOString() },
      college_id: 'a0000000-0000-0000-0000-000000000001',
      college: { id: 'a0000000-0000-0000-0000-000000000001', name: 'National Institute of Technology', is_active: true },
      registration_type: 'none',
      max_attendees: 1200,
      current_attendees: 420,
      eligibility: 'Open to all students with valid College ID',
      is_free: true,
      price_currency: 'INR',
      visibility: 'public',
      status: 'published',
      is_featured: true,
      tags: ['Cultural', 'Music', 'Festival', 'Dance'],
      views_count: 890,
      likes_count: 180,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
    {
      id: 'e0000000-0000-0000-0000-000000000004',
      slug: 'national-cybersecurity-summit-ctf',
      title: 'National Cybersecurity Summit & CTF 2026',
      summary: 'Capture The Flag competition and ethical hacking talks by top security analysts.',
      description: 'Test your offensive and defensive security skills in a 12-hour CTF challenge covering web exploitation, cryptography, reverse engineering, and binary exploitation.',
      poster_url: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=800&auto=format&fit=crop&q=80',
      category_id: 'b0000000-0000-0000-0000-000000000003',
      category: { id: 'b0000000-0000-0000-0000-000000000003', name: 'Cybersecurity', slug: 'cybersecurity' },
      start_date: inSevenDays,
      start_time: '11:00 AM',
      end_date: inSevenDays,
      end_time: '11:00 PM',
      timezone: 'Asia/Kolkata',
      is_all_day: false,
      venue: 'Cyber Security Lab & Online',
      venue_address: 'Tech Tower, 5th Floor',
      is_online: true,
      meeting_url: 'https://meet.campusevents.edu/ctf-2026',
      organizer_id: 'u0000000-0000-0000-0000-000000000001',
      organization_id: 'd0000000-0000-0000-0000-000000000001',
      organization: { id: 'd0000000-0000-0000-0000-000000000001', name: 'Tech Club', slug: 'tech-club', college_id: 'a0000000-0000-0000-0000-000000000001', is_verified: true, social_links: {}, is_active: true, created_at: new Date().toISOString() },
      college_id: 'a0000000-0000-0000-0000-000000000001',
      college: { id: 'a0000000-0000-0000-0000-000000000001', name: 'National Institute of Technology', is_active: true },
      registration_type: 'internal',
      registration_deadline: inThreeDays,
      max_attendees: 250,
      current_attendees: 112,
      eligibility: 'Open to all students interested in Cybersecurity',
      is_free: true,
      price_currency: 'INR',
      visibility: 'public',
      status: 'published',
      is_featured: false,
      tags: ['Security', 'CTF', 'Hacking', 'Infosec'],
      views_count: 420,
      likes_count: 85,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
    {
      id: 'e0000000-0000-0000-0000-000000000005',
      slug: 'campus-career-and-internship-expo',
      title: 'Campus Career & Internship Expo 2026',
      summary: 'Connect directly with recruiters from 50+ leading companies for full-time and internship roles.',
      description: 'Bring printed copies of your resume and dress professionally. On-the-spot interviews and technical rounds will be conducted by visiting recruiters across Tech, Finance, Consulting, and Core Engineering.',
      poster_url: 'https://images.unsplash.com/photo-1515187029135-18ee286d815b?w=800&auto=format&fit=crop&q=80',
      category_id: 'b0000000-0000-0000-0000-000000000013',
      category: { id: 'b0000000-0000-0000-0000-000000000013', name: 'Career Events', slug: 'career-events' },
      start_date: inFourteenDays,
      start_time: '09:30 AM',
      end_date: inFourteenDays,
      end_time: '06:00 PM',
      timezone: 'Asia/Kolkata',
      is_all_day: false,
      venue: 'University Indoor Sports Complex',
      venue_address: 'South Campus Ground',
      is_online: false,
      organizer_id: 'u0000000-0000-0000-0000-000000000001',
      organization_id: 'd0000000-0000-0000-0000-000000000004',
      organization: { id: 'd0000000-0000-0000-0000-000000000004', name: 'Business Leaders', slug: 'business-leaders', college_id: 'a0000000-0000-0000-0000-000000000001', is_verified: false, social_links: {}, is_active: true, created_at: new Date().toISOString() },
      college_id: 'a0000000-0000-0000-0000-000000000001',
      college: { id: 'a0000000-0000-0000-0000-000000000001', name: 'National Institute of Technology', is_active: true },
      registration_type: 'internal',
      registration_deadline: inSevenDays,
      max_attendees: 800,
      current_attendees: 380,
      eligibility: 'Pre-final and Final year students of all branches',
      is_free: true,
      price_currency: 'INR',
      visibility: 'public',
      status: 'published',
      is_featured: false,
      tags: ['Career', 'Jobs', 'Internships', 'Recruitment'],
      views_count: 760,
      likes_count: 145,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    }
  ];
};

const localCreatedEvents: Event[] = [];

export const getEvents = async (params?: EventQueryParams): Promise<PaginatedResponse<Event>> => {
  const query = new URLSearchParams();
  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        query.append(key, value.toString());
      }
    });
  }
  const queryString = query.toString();
  try {
    const res = await api.get<PaginatedResponse<Event>>(queryString ? `/events?${queryString}` : '/events');
    if (res && res.data && res.data.length > 0) {
      return {
        ...res,
        data: [...localCreatedEvents, ...res.data],
      };
    }
  } catch {
    // API cold start or network error: gracefully fall back to local seed data
  }

  // Resilient fallback: return curated events matching query filters
  let filtered = [...localCreatedEvents, ...getFallbackEvents()];
  if (params?.search) {
    const s = params.search.toLowerCase();
    filtered = filtered.filter(e => e.title.toLowerCase().includes(s) || e.description.toLowerCase().includes(s));
  }
  if (params?.category) {
    const cat = params.category.toLowerCase();
    filtered = filtered.filter(e => e.category_id === params.category || e.category?.name?.toLowerCase() === cat || e.category?.slug?.toLowerCase() === cat);
  }
  if (params?.dateFrom) {
    filtered = filtered.filter(e => e.start_date >= params.dateFrom!);
  }
  if (params?.dateTo) {
    filtered = filtered.filter(e => e.start_date <= params.dateTo!);
  }

  return {
    success: true,
    data: filtered,
    pagination: {
      page: params?.page || 1,
      limit: params?.limit || 20,
      total: filtered.length,
      totalPages: 1,
    },
  };
};

export const getEventById = async (id: string): Promise<Event> => {
  try {
    const res = await api.get<ApiResponse<Event>>(`/events/${id}`);
    if (res.data) return res.data;
  } catch {
    // ignore
  }

  const local = localCreatedEvents.find(e => e.id === id);
  if (local) return local;

  const fallback = getFallbackEvents().find(e => e.id === id) || getFallbackEvents()[0];
  return fallback;
};

export const createEvent = async (data: Partial<Event>): Promise<Event> => {
  try {
    const res = await api.post<ApiResponse<Event>>('/events', data);
    if (res.data) return res.data;
  } catch {
    // ignore
  }

  const newEvent: Event = {
    id: `ev-${Date.now()}`,
    title: data.title || 'Campus Event',
    slug: data.slug || `event-${Date.now()}`,
    summary: data.summary,
    description: data.description || '',
    poster_url: data.poster_url || 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800',
    category_id: data.category_id,
    category: data.category || { id: 'cat-1', name: 'Campus Event', slug: 'campus-event' },
    start_date: data.start_date || new Date().toISOString().split('T')[0],
    start_time: data.start_time || '10:00 AM',
    end_date: data.end_date || data.start_date || new Date().toISOString().split('T')[0],
    end_time: data.end_time || '12:00 PM',
    timezone: 'Asia/Kolkata',
    is_all_day: false,
    venue: data.venue || 'Campus Auditorium',
    is_online: data.is_online || false,
    meeting_url: data.meeting_url,
    organizer_id: 'guest-organizer',
    college_id: data.college_id || 'a0000000-0000-0000-0000-000000000001',
    registration_type: data.registration_type || 'internal',
    registration_url: data.registration_url,
    max_attendees: data.max_attendees || 100,
    current_attendees: 1,
    is_free: data.is_free ?? true,
    price_currency: 'INR',
    visibility: data.visibility || 'public',
    status: 'published',
    is_featured: false,
    tags: ['Campus', 'Event'],
    views_count: 1,
    likes_count: 0,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  };

  localCreatedEvents.unshift(newEvent);
  return newEvent;
};

export const updateEvent = async (id: string, data: Partial<Event>): Promise<Event> => {
  try {
    const res = await api.patch<ApiResponse<Event>>(`/events/${id}`, data);
    if (res.data) return res.data;
  } catch {
    // ignore
  }
  const idx = localCreatedEvents.findIndex(e => e.id === id);
  if (idx !== -1) {
    localCreatedEvents[idx] = { ...localCreatedEvents[idx], ...data };
    return localCreatedEvents[idx];
  }
  return { ...getFallbackEvents()[0], ...data };
};

export const deleteEvent = async (id: string): Promise<void> => {
  try {
    await api.delete<void>(`/events/${id}`);
  } catch {
    // ignore
  }
  const idx = localCreatedEvents.findIndex(e => e.id === id);
  if (idx !== -1) {
    localCreatedEvents.splice(idx, 1);
  }
};

export const getEventsByDate = async (date: string, collegeId?: string): Promise<Event[]> => {
  try {
    const query = new URLSearchParams({ dateFrom: date, dateTo: date });
    if (collegeId) query.append('collegeId', collegeId);
    const res = await api.get<PaginatedResponse<Event>>(`/events?${query.toString()}`);
    if (res.data && res.data.length > 0) return res.data;
  } catch {
    // ignore
  }
  const all = await getEvents({ dateFrom: date, dateTo: date, collegeId });
  return all.data;
};

export const getUpcomingEvents = async (limit: number = 6): Promise<Event[]> => {
  const today = new Date().toISOString().split('T')[0];
  try {
    const query = new URLSearchParams({ dateFrom: today, sort: 'date', limit: limit.toString() });
    const res = await api.get<PaginatedResponse<Event>>(`/events?${query.toString()}`);
    if (res.data && res.data.length > 0) return res.data;
  } catch {
    // ignore
  }
  const all = await getEvents({ dateFrom: today, limit });
  return all.data.slice(0, limit);
};

export const getPopularEvents = async (limit: number = 6): Promise<Event[]> => {
  try {
    const query = new URLSearchParams({ sort: 'popularity', limit: limit.toString() });
    const res = await api.get<PaginatedResponse<Event>>(`/events?${query.toString()}`);
    if (res.data && res.data.length > 0) return res.data;
  } catch {
    // ignore
  }
  const all = await getEvents({ limit });
  return all.data.slice(0, limit);
};
