import { supabaseAdmin as supabase } from '../config/supabase';
import { Event } from '../types';
import { NotFoundError } from '../utils/errors';
import { logger } from '../utils/logger';

export interface EventQueryParams {
  page?: number;
  limit?: number;
  category?: string;
  search?: string;
  collegeId?: string;
  dateFrom?: string;
  dateTo?: string;
  status?: string;
  isOnline?: boolean;
  isFree?: boolean;
  sort?: 'date' | 'popularity' | 'created_at';
}

export const eventsService = {
  async getEvents(params: any = {}) {
    const page = Math.max(1, Number(params.page) || 1);
    const limit = Math.min(100, Math.max(1, Number(params.limit) || 20));
    const offset = (page - 1) * limit;

    let query = supabase
      .from('events')
      .select('*, category:event_categories(*), organization:organizations(*), college:colleges(*)', {
        count: 'exact',
      });

    if (params.search?.trim()) {
      query = query.ilike('title', `%${params.search.trim()}%`);
    }
    if (params.category) {
      query = query.eq('category_id', params.category);
    }
    if (params.collegeId) {
      query = query.eq('college_id', params.collegeId);
    }
    if (params.dateFrom) {
      query = query.gte('start_date', params.dateFrom);
    }
    if (params.dateTo) {
      query = query.lte('start_date', params.dateTo);
    }
    if (params.status) {
      query = query.eq('status', params.status);
    } else {
      query = query.eq('status', 'published');
    }
    if (typeof params.isOnline === 'boolean' || params.isOnline === 'true') {
      query = query.eq('is_online', true);
    } else if (params.isOnline === false || params.isOnline === 'false') {
      query = query.eq('is_online', false);
    }
    if (typeof params.isFree === 'boolean' || params.isFree === 'true') {
      query = query.eq('is_free', true);
    } else if (params.isFree === false || params.isFree === 'false') {
      query = query.eq('is_free', false);
    }

    if (params.sort === 'date') {
      query = query.order('start_date', { ascending: true });
    } else if (params.sort === 'popularity') {
      query = query.order('views_count', { ascending: false });
    } else {
      query = query.order('created_at', { ascending: false });
    }

    query = query.range(offset, offset + limit - 1);

    const { data, count, error } = await query;

    if (error) {
      logger.error('Failed to query events from database', { error: error.message, params });
      throw new Error(`Database query failure: ${error.message}`);
    }

    const total = count ?? 0;
    return {
      data: data || [],
      total,
    };
  },

  async getEventById(id: string): Promise<Event> {
    const { data, error } = await supabase
      .from('events')
      .select('*, category:event_categories(*), organization:organizations(*), college:colleges(*), organizer:profiles(*)')
      .eq('id', id)
      .maybeSingle();

    if (error) {
      logger.error('Failed to query event by ID', { id, error: error.message });
      throw new Error(`Database error: ${error.message}`);
    }

    if (!data) {
      throw new NotFoundError(`Event with ID ${id} not found`);
    }

    // Fire background metric
    try {
      await supabase.rpc('increment_event_views', { event_id: id });
    } catch {
      // non-blocking
    }

    return data;
  },

  async createEvent(eventData: Partial<Event>, userId: string): Promise<Event> {
    const { data: profile } = await supabase
      .from('profiles')
      .select('id')
      .eq('id', userId)
      .maybeSingle();

    if (!profile) {
      await supabase
        .from('profiles')
        .upsert(
          {
            id: userId,
            email: 'organizer@campus.edu',
            display_name: 'Campus Organizer',
            role: 'organizer',
            updated_at: new Date().toISOString(),
          },
          { onConflict: 'id' }
        );
    }

    const { data, error } = await supabase
      .from('events')
      .insert({
        ...eventData,
        organizer_id: userId,
        published_at: eventData.status === 'published' ? new Date().toISOString() : null,
      })
      .select('*, category:event_categories(*), organization:organizations(*), college:colleges(*)')
      .single();

    if (error) {
      logger.error('Database event creation failed', { error: error.message, userId });
      throw new Error(`Event creation failed: ${error.message}`);
    }

    return data;
  },

  async updateEvent(id: string, updates: Partial<Event>, userId: string, userRole?: string): Promise<Event> {
    const existing = await this.getEventById(id);

    if (existing.organizer_id !== userId && userRole !== 'platform_admin' && userRole !== 'college_admin') {
      throw new Error('Forbidden: You are not authorized to modify this event.');
    }

    const { data, error } = await supabase
      .from('events')
      .update({
        ...updates,
        updated_at: new Date().toISOString(),
      })
      .eq('id', id)
      .select('*, category:event_categories(*), organization:organizations(*), college:colleges(*)')
      .single();

    if (error) {
      throw new Error(`Event update failed: ${error.message}`);
    }

    return data;
  },

  async deleteEvent(id: string, userId: string, userRole?: string): Promise<void> {
    const existing = await this.getEventById(id);

    if (existing.organizer_id !== userId && userRole !== 'platform_admin' && userRole !== 'college_admin') {
      throw new Error('Forbidden: You are not authorized to delete this event.');
    }

    const { error } = await supabase.from('events').delete().eq('id', id);

    if (error) {
      throw new Error(`Event deletion failed: ${error.message}`);
    }
  },
};
