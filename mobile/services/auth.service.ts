import api from './api';
import { User, College } from '../types';

export const registerProfile = (data: { email: string; displayName: string; collegeId?: string }) => 
  api.post<User>('/auth/register', data);

export const getMyProfile = () => 
  api.get<{ success: boolean; data: User }>('/auth/me').then(res => res.data);

export const updateMyProfile = (data: Partial<User>) => 
  api.patch<{ success: boolean; data: User }>('/auth/profile', data).then(res => res.data);
