import api from './api';
import { Organization, ApiResponse } from '../types';

export const organizationsService = {
  getOrganizations: async (collegeId?: string): Promise<Organization[]> => {
    const url = collegeId ? `/organizations?college_id=${collegeId}` : '/organizations';
    const res = await api.get<ApiResponse<Organization[]>>(url);
    return res.data;
  },

  getOrganizationById: async (id: string): Promise<Organization> => {
    const res = await api.get<ApiResponse<Organization>>(`/organizations/${id}`);
    return res.data;
  },

  followOrganization: (id: string) => api.post<void>(`/organizations/${id}/follow`, {}),
  unfollowOrganization: (id: string) => api.delete<void>(`/organizations/${id}/follow`),
};
