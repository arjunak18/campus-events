import { supabase } from '../lib/supabase';

const rawApiUrl = process.env.EXPO_PUBLIC_API_URL || '';

// Clean trailing slashes
export const API_URL = rawApiUrl.replace(/\/+$/, '');

class ApiError extends Error {
  status: number;
  data: any;
  constructor(status: number, message: string, data?: any) {
    super(message);
    this.status = status;
    this.data = data;
  }
}

export async function fetcher<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const normalizedEndpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
  let sessionToken: string | undefined = undefined;

  try {
    const { data } = await supabase.auth.getSession();
    sessionToken = data?.session?.access_token;
  } catch {
    // Session token extraction failure handled downstream
  }

  const headers = new Headers(options.headers);
  headers.set('Content-Type', 'application/json');

  if (sessionToken) {
    headers.set('Authorization', `Bearer ${sessionToken}`);
  } else {
    headers.set('Authorization', 'Bearer guest-token');
  }

  const config: RequestInit = {
    ...options,
    headers,
  };

  const response = await fetch(`${API_URL}${normalizedEndpoint}`, config);

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new ApiError(response.status, errorData.message || 'API Communication Failure', errorData);
  }

  if (response.status === 204) {
    return {} as T;
  }

  return response.json();
}

export default {
  get: <T>(endpoint: string, options?: RequestInit) => fetcher<T>(endpoint, { ...options, method: 'GET' }),
  post: <T>(endpoint: string, body: any, options?: RequestInit) =>
    fetcher<T>(endpoint, { ...options, method: 'POST', body: JSON.stringify(body) }),
  patch: <T>(endpoint: string, body: any, options?: RequestInit) =>
    fetcher<T>(endpoint, { ...options, method: 'PATCH', body: JSON.stringify(body) }),
  delete: <T>(endpoint: string, options?: RequestInit) =>
    fetcher<T>(endpoint, { ...options, method: 'DELETE' }),
};