import api from './api';
import { SavedEvent, ApiResponse, PaginatedResponse } from '../types';

export const savedEventsService = {
  getSavedEvents: async (): Promise<SavedEvent[]> => {
    try {
      const res = await api.get<any>('/me/saved-events');
      if (Array.isArray(res)) return res;
      if (Array.isArray(res?.data)) return res.data;
      if (Array.isArray(res?.data?.data)) return res.data.data;
      return [];
    } catch {
      return [];
    }
  },

  saveEvent: (eventId: string) => api.post<void>(`/me/saved-events/${eventId}`, {}),
  unsaveEvent: (eventId: string) => api.delete<void>(`/me/saved-events/${eventId}`),
};
