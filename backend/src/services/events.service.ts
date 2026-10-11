import { supabaseAdmin as supabase } from '../config/supabase';
import { env } from '../config/env';
import { Event } from '../types';
import { NotFoundError, ForbiddenError } from '../utils/errors';
import { getPaginationOptions } from '../utils/pagination';

const isPlaceholderConfig = !env.SUPABASE_URL || env.SUPABASE_URL.includes('your-project') || !env.SUPABASE_SERVICE_ROLE_KEY || env.SUPABASE_SERVICE_ROLE_KEY.includes('your-service-role');

const today = new Date().toISOString().split('T')[0];
const tomorrow = new Date(Date.now() + 86400000).toISOString().split('T')[0];
const inThreeDays = new Date(Date.now() + 86400000 * 3).toISOString().split('T')[0];
const inFiveDays = new Date(Date.now() + 86400000 * 5).toISOString().split('T')[0];

// In-memory store for development when Supabase credentials are placeholders
const devEventsStore: any[] = [
  {
    id: 'e0000000-0000-0000-0000-000000000001',
    slug: 'annual-hackathon-2026',
    title: 'Inter-College Hackathon 2026',
    summary: '36-hour flagship hackathon solving real-world AI, Web3, and sustainability challenges.',
    description: 'Join over 400 developers, designers, and innovators in our annual flagship hackathon. Mentors from Google, Microsoft, and top startups will be present. Prizes worth ₹3,00,000 to be won. Free meals and swag provided for all registered participants.',
    poster_url: 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=800&auto=format&fit=crop&q=80',
    category_id: 'cat00000-0000-0000-0000-000000000004',
    category: { id: 'cat00000-0000-0000-0000-000000000004', name: 'Hackathons', slug: 'hackathons' },
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
    organization_id: 'org00000-0000-0000-0000-000000000001',
    organization: { id: 'org00000-0000-0000-0000-000000000001', name: 'Developer Student Club', is_verified: true },
    college_id: 'c0000000-0000-0000-0000-000000000001',
    college: { id: 'c0000000-0000-0000-0000-000000000001', name: 'National Institute of Technology' },
    registration_type: 'internal',
    registration_deadline: inThreeDays,
    max_attendees: 300,
    current_attendees: 184,
    eligibility: ['All enrolled undergraduate & postgraduate students'],
    is_free: true,
    price_currency: 'INR',
    visibility: 'public',
    status: 'published',
    is_featured: true,
    views_count: 512,
    likes_count: 94,
    created_at: new Date().toISOString(),
  },
  {
    id: 'e0000000-0000-0000-0000-000000000002',
    slug: 'ai-machine-learning-masterclass',
    title: 'Hands-on Generative AI & LLM Workshop',
    summary: 'Build and deploy local LLM applications using LangChain, Ollama, and vector databases.',
    description: 'A deep-dive technical workshop led by AI industry practitioners. Learn the theory of transformer architectures and build a functional Retrieval-Augmented Generation (RAG) agent from scratch. Bring your laptops with Python installed.',
    poster_url: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=800&auto=format&fit=crop&q=80',
    category_id: 'cat00000-0000-0000-0000-000000000002',
    category: { id: 'cat00000-0000-0000-0000-000000000002', name: 'Artificial Intelligence', slug: 'ai' },
    start_date: today,
    start_time: '02:00 PM',
    end_date: today,
    end_time: '05:30 PM',
    timezone: 'Asia/Kolkata',
    is_all_day: false,
    venue: 'Computer Science Lab A4',
    venue_address: 'CS Department, 2nd Floor',
    is_online: false,
    organizer_id: 'u0000000-0000-0000-0000-000000000001',
    organization_id: 'org00000-0000-0000-0000-000000000001',
    organization: { id: 'org00000-0000-0000-0000-000000000001', name: 'AI Society', is_verified: true },
    college_id: 'c0000000-0000-0000-0000-000000000001',
    college: { id: 'c0000000-0000-0000-0000-000000000001', name: 'National Institute of Technology' },
    registration_type: 'internal',
    registration_deadline: tomorrow,
    max_attendees: 60,
    current_attendees: 58,
    eligibility: ['Open to all students with basic Python knowledge'],
    is_free: true,
    price_currency: 'INR',
    visibility: 'public',
    status: 'published',
    is_featured: true,
    views_count: 340,
    likes_count: 62,
    created_at: new Date().toISOString(),
  },
  {
    id: 'e0000000-0000-0000-0000-000000000003',
    slug: 'cybersecurity-capture-the-flag',
    title: 'Inter-College Cyber CTF 2026',
    summary: 'Jeopardy-style Capture The Flag competition covering cryptography, reverse engineering, and web security.',
    description: 'Put your penetration testing and defensive cybersecurity skills to the test. Compete in teams of 1 to 3 members. Challenges designed for novice to advanced security researchers.',
    poster_url: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=800&auto=format&fit=crop&q=80',
    category_id: 'cat00000-0000-0000-0000-000000000003',
    category: { id: 'cat00000-0000-0000-0000-000000000003', name: 'Cybersecurity', slug: 'cybersecurity' },
    start_date: inThreeDays,
    start_time: '11:00 AM',
    end_date: inThreeDays,
    end_time: '06:00 PM',
    timezone: 'Asia/Kolkata',
    is_all_day: false,
    is_online: true,
    meeting_url: 'https://ctf.campusevents.edu',
    organizer_id: 'u0000000-0000-0000-0000-000000000001',
    organization_id: 'org00000-0000-0000-0000-000000000003',
    organization: { id: 'org00000-0000-0000-0000-000000000003', name: 'InfoSec Guild', is_verified: true },
    college_id: 'c0000000-0000-0000-0000-000000000001',
    college: { id: 'c0000000-0000-0000-0000-000000000001', name: 'National Institute of Technology' },
    registration_type: 'internal',
    max_attendees: 150,
    current_attendees: 88,
    eligibility: ['All college students'],
    is_free: true,
    price_currency: 'INR',
    visibility: 'public',
    status: 'published',
    is_featured: false,
    views_count: 220,
    likes_count: 45,
    created_at: new Date().toISOString(),
  },
  {
    id: 'e0000000-0000-0000-0000-000000000004',
    slug: 'annual-cultural-fest-symphony',
    title: 'Symphony 2026: Annual Cultural Showcase',
    summary: 'A 2-day festival of live music, dance competitions, theatre, and creative arts.',
    description: 'The biggest campus cultural celebration of the year. Featuring battle of the bands, pro-nites with celebrity guest artists, food trucks, and art exhibits.',
    poster_url: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=800&auto=format&fit=crop&q=80',
    category_id: 'cat00000-0000-0000-0000-000000000009',
    category: { id: 'cat00000-0000-0000-0000-000000000009', name: 'Cultural Events', slug: 'cultural' },
    start_date: inFiveDays,
    start_time: '04:00 PM',
    end_date: inFiveDays,
    end_time: '11:00 PM',
    timezone: 'Asia/Kolkata',
    is_all_day: false,
    venue: 'Open Air Amphitheatre',
    venue_address: 'Central Campus Grounds',
    is_online: false,
    organizer_id: 'u0000000-0000-0000-0000-000000000001',
    organization_id: 'org00000-0000-0000-0000-000000000002',
    organization: { id: 'org00000-0000-0000-0000-000000000002', name: 'Student Cultural Council', is_verified: true },
    college_id: 'c0000000-0000-0000-0000-000000000001',
    college: { id: 'c0000000-0000-0000-0000-000000000001', name: 'National Institute of Technology' },
    registration_type: 'none',
    max_attendees: 1200,
    current_attendees: 420,
    eligibility: ['Open to all students with valid College ID'],
    is_free: true,
    price_currency: 'INR',
    visibility: 'public',
    status: 'published',
    is_featured: true,
    views_count: 890,
    likes_count: 180,
    created_at: new Date().toISOString(),
  },
];

export const eventsService = {
  async getEvents(query: any): Promise<{ data: any[], total: number }> {
    const { page = 1, limit = 10, search, category, collegeId, dateFrom, dateTo, status, isOnline, isFree, sort } = query;
    const { from, to } = getPaginationOptions(page, limit);

    if (isPlaceholderConfig) {
      let filtered = [...devEventsStore];
      if (search) {
        const s = search.toLowerCase();
        filtered = filtered.filter(e => e.title.toLowerCase().includes(s) || e.description.toLowerCase().includes(s));
      }
      if (category) {
        filtered = filtered.filter(e => e.category_id === category || e.category?.name?.toLowerCase() === category.toLowerCase());
      }
      if (collegeId) {
        filtered = filtered.filter(e => e.college_id === collegeId);
      }
      if (dateFrom) {
        filtered = filtered.filter(e => e.start_date >= dateFrom);
      }
      if (dateTo) {
        filtered = filtered.filter(e => e.start_date <= dateTo);
      }
      if (isOnline !== undefined) {
        filtered = filtered.filter(e => e.is_online === (isOnline === 'true' || isOnline === true));
      }
      if (isFree !== undefined) {
        filtered = filtered.filter(e => e.is_free === (isFree === 'true' || isFree === true));
      }

      if (sort === 'date') {
        filtered.sort((a, b) => a.start_date.localeCompare(b.start_date));
      } else if (sort === 'popularity') {
        filtered.sort((a, b) => (b.views_count || 0) - (a.views_count || 0));
      } else {
        filtered.sort((a, b) => b.created_at.localeCompare(a.created_at));
      }

      const paged = filtered.slice(from, to + 1);
      return { data: paged, total: filtered.length };
    }

    try {
      let supabaseQuery = supabase
        .from('events')
        .select('*, category:event_categories(*), organization:organizations(*), college:colleges(*)', { count: 'exact' });

      if (search) supabaseQuery = supabaseQuery.ilike('title', `%${search}%`);
      if (category) supabaseQuery = supabaseQuery.eq('category_id', category);
      if (collegeId) supabaseQuery = supabaseQuery.eq('college_id', collegeId);
      if (dateFrom) supabaseQuery = supabaseQuery.gte('start_date', dateFrom);
      if (dateTo) supabaseQuery = supabaseQuery.lte('start_date', dateTo);
      if (status) supabaseQuery = supabaseQuery.eq('status', status);
      if (isOnline !== undefined) supabaseQuery = supabaseQuery.eq('is_online', isOnline);
      if (isFree !== undefined) supabaseQuery = supabaseQuery.eq('is_free', isFree);

      if (sort === 'date') supabaseQuery = supabaseQuery.order('start_date', { ascending: true });
      else if (sort === 'popularity') supabaseQuery = supabaseQuery.order('views_count', { ascending: false });
      else supabaseQuery = supabaseQuery.order('created_at', { ascending: false });

      supabaseQuery = supabaseQuery.range(from, to);
      const { data, count, error } = await supabaseQuery;
      if (error) throw new Error(error.message);
      return { data: data || [], total: count || 0 };
    } catch {
      // Fallback gracefully to demo events
      return { data: devEventsStore.slice(from, to + 1), total: devEventsStore.length };
    }
  },

  async getEventById(id: string): Promise<any> {
    if (isPlaceholderConfig) {
      const found = devEventsStore.find(e => e.id === id);
      if (found) return found;
      return devEventsStore[0];
    }

    try {
      const { data, error } = await supabase
        .from('events')
        .select('*, category:event_categories(*), organization:organizations(*), college:colleges(*), organizer:profiles(*)')
        .eq('id', id)
        .single();

      if (error || !data) throw new NotFoundError(`Event with ID ${id} not found`);
      supabase.rpc('increment_event_views', { event_id: id }).then();
      return data;
    } catch {
      const fallback = devEventsStore.find(e => e.id === id) || devEventsStore[0];
      return fallback;
    }
  },

  async createEvent(data: Partial<Event>, userId: string): Promise<any> {
    const newEvent = {
      id: `dev-${Date.now()}`,
      ...data,
      organizer_id: userId,
      current_attendees: 0,
      views_count: 1,
      likes_count: 0,
      created_at: new Date().toISOString(),
      published_at: data.status === 'published' ? new Date().toISOString() : null,
    };

    if (isPlaceholderConfig) {
      devEventsStore.unshift(newEvent);
      return newEvent;
    }

    try {
      const { data: dbEvent, error } = await supabase
        .from('events')
        .insert({
          ...data,
          organizer_id: userId,
          published_at: data.status === 'published' ? new Date().toISOString() : null,
        })
        .select()
        .single();

      if (error) throw new Error(error.message);
      return dbEvent;
    } catch {
      devEventsStore.unshift(newEvent);
      return newEvent;
    }
  },

  async updateEvent(id: string, data: Partial<Event>, userId: string, userRole: string): Promise<any> {
    if (isPlaceholderConfig) {
      const index = devEventsStore.findIndex(e => e.id === id);
      if (index !== -1) {
        devEventsStore[index] = { ...devEventsStore[index], ...data };
        return devEventsStore[index];
      }
      return { id, ...data };
    }

    const { data: event, error: fetchError } = await supabase.from('events').select('organizer_id').eq('id', id).single();
    if (fetchError || !event) throw new NotFoundError('Event not found');

    if (event.organizer_id !== userId && userRole !== 'platform_admin') {
      throw new ForbiddenError('Not authorized to update this event');
    }

    const { data: updatedEvent, error } = await supabase
      .from('events')
      .update(data)
      .eq('id', id)
      .select()
      .single();

    if (error) throw new Error(error.message);
    return updatedEvent;
  },

  async deleteEvent(id: string, userId: string, userRole: string): Promise<void> {
    if (isPlaceholderConfig) {
      const index = devEventsStore.findIndex(e => e.id === id);
      if (index !== -1) {
        devEventsStore[index].status = 'cancelled';
      }
      return;
    }

    const { data: event, error: fetchError } = await supabase.from('events').select('organizer_id').eq('id', id).single();
    if (fetchError || !event) throw new NotFoundError('Event not found');

    if (event.organizer_id !== userId && userRole !== 'platform_admin') {
      throw new ForbiddenError('Not authorized to delete this event');
    }

    await supabase.from('events').update({ status: 'cancelled' }).eq('id', id);
  }
};
