import api from './api';
import { Registration, ApiResponse, PaginatedResponse } from '../types';

export const registrationsService = {
  registerForEvent: async (eventId: string): Promise<Registration> => {
    const res = await api.post<ApiResponse<Registration>>(`/events/${eventId}/registrations`, {});
    return res.data;
  },

  cancelRegistration: (eventId: string) => api.delete<void>(`/events/${eventId}/registrations/me`),

  getMyRegistrations: async (): Promise<Registration[]> => {
    const res = await api.get<PaginatedResponse<Registration>>('/me/registrations');
    return res.data;
  },
};
