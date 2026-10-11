import api from './api';
import { College, ApiResponse } from '../types';

export const collegesService = {
  getColleges: async (): Promise<College[]> => {
    const res = await api.get<ApiResponse<College[]>>('/colleges');
    return res.data;
  },

  getCollegeById: async (id: string): Promise<College> => {
    const res = await api.get<ApiResponse<College>>(`/colleges/${id}`);
    return res.data;
  },

  followCollege: (id: string) => api.post<void>(`/colleges/${id}/follow`, {}),
  unfollowCollege: (id: string) => api.delete<void>(`/colleges/${id}/follow`),
};
