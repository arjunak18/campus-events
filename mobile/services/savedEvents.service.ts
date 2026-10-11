import api from './api';
import { SavedEvent, ApiResponse, PaginatedResponse } from '../types';

export const savedEventsService = {
  getSavedEvents: async (): Promise<SavedEvent[]> => {
    const res = await api.get<PaginatedResponse<SavedEvent>>('/me/saved-events');
    return res.data;
  },

  saveEvent: (eventId: string) => api.post<void>(`/me/saved-events/${eventId}`, {}),
  unsaveEvent: (eventId: string) => api.delete<void>(`/me/saved-events/${eventId}`),
};
