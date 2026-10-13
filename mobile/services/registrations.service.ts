import api from './api';
import { Registration, ApiResponse, PaginatedResponse } from '../types';

export const registrationsService = {
  registerForEvent: async (eventId: string): Promise<Registration> => {
    const res = await api.post<ApiResponse<Registration>>(`/events/${eventId}/registrations`, {});
    return res.data;
  },

  cancelRegistration: (eventId: string) => api.delete<void>(`/events/${eventId}/registrations/me`),

  getMyRegistrations: async (): Promise<Registration[]> => {
    try {
      const res = await api.get<any>('/me/registrations');
      if (Array.isArray(res)) return res;
      if (Array.isArray(res?.data)) return res.data;
      if (Array.isArray(res?.data?.data)) return res.data.data;
      return [];
    } catch {
      return [];
    }
  },
};
