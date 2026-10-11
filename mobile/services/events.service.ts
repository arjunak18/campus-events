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
  return api.get<PaginatedResponse<Event>>(queryString ? `/events?${queryString}` : '/events');
};

export const getEventById = async (id: string): Promise<Event> => {
  const res = await api.get<ApiResponse<Event>>(`/events/${id}`);
  return res.data;
};

export const createEvent = async (data: Partial<Event>): Promise<Event> => {
  const res = await api.post<ApiResponse<Event>>('/events', data);
  return res.data;
};

export const updateEvent = async (id: string, data: Partial<Event>): Promise<Event> => {
  const res = await api.patch<ApiResponse<Event>>(`/events/${id}`, data);
  return res.data;
};

export const deleteEvent = async (id: string): Promise<void> => {
  return api.delete<void>(`/events/${id}`);
};

export const getEventsByDate = async (date: string, collegeId?: string): Promise<Event[]> => {
  const query = new URLSearchParams({ dateFrom: date, dateTo: date });
  if (collegeId) query.append('collegeId', collegeId);
  const res = await api.get<PaginatedResponse<Event>>(`/events?${query.toString()}`);
  return res.data || [];
};

export const getUpcomingEvents = async (limit: number = 6): Promise<Event[]> => {
  const today = new Date().toISOString().split('T')[0];
  const query = new URLSearchParams({ dateFrom: today, sort: 'date', limit: limit.toString() });
  const res = await api.get<PaginatedResponse<Event>>(`/events?${query.toString()}`);
  return res.data || [];
};

export const getPopularEvents = async (limit: number = 6): Promise<Event[]> => {
  const query = new URLSearchParams({ sort: 'popularity', limit: limit.toString() });
  const res = await api.get<PaginatedResponse<Event>>(`/events?${query.toString()}`);
  return res.data || [];
};
