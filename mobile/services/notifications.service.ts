import api from './api';
import { Notification, ApiResponse, PaginatedResponse } from '../types';

export const notificationsService = {
  getNotifications: async (): Promise<Notification[]> => {
    const res = await api.get<PaginatedResponse<Notification>>('/me/notifications');
    return res.data;
  },

  markAsRead: (id: string) => api.patch<void>(`/me/notifications/${id}/read`, {}),
  markAllAsRead: () => api.post<void>('/me/notifications/read-all', {}),

  getUnreadCount: async (): Promise<number> => {
    const res = await api.get<ApiResponse<{ count: number }>>('/me/notifications/unread-count');
    return res.data.count;
  },
};
