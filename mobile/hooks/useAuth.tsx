import { useState, useEffect, createContext, useContext } from 'react';
import { Session, User } from '@supabase/supabase-js';
import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { User as AppUser } from '../types';
import api from '../services/api';

import * as WebBrowser from 'expo-web-browser';
import * as Linking from 'expo-linking';

WebBrowser.maybeCompleteAuthSession();

type AuthContextType = {
  session: Session | null;
  user: User | null;
  appUser: AppUser | null;
  isLoading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signInWithGoogle: () => Promise<void>;
  signUp: (email: string, password: string, displayName: string) => Promise<void>;
  signOut: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  updateProfile: (data: Partial<AppUser>) => Promise<void>;
};

const AuthContext = createContext<AuthContextType>({
  session: null,
  user: null,
  appUser: null,
  isLoading: true,
  signIn: async () => {},
  signInWithGoogle: async () => {},
  signUp: async () => {},
  signOut: async () => {},
  resetPassword: async () => {},
  updateProfile: async () => {},
});

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [appUser, setAppUser] = useState<AppUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!isSupabaseConfigured) {
      // Development mode: Create a default guest student session
      const mockUser = {
        id: 'u0000000-0000-0000-0000-000000000001',
        email: 'student@campus.edu',
        user_metadata: { display_name: 'Alex Johnson' },
      } as unknown as User;

      setUser(mockUser);
      setAppUser({
        id: 'u0000000-0000-0000-0000-000000000001',
        email: 'student@campus.edu',
        display_name: 'Alex Johnson',
        role: 'student',
        interests: ['Technology', 'Hackathons', 'Workshops'],
        notification_preferences: {
          event_reminders: true,
          event_updates: true,
          new_events: true,
          registration_updates: true,
        },
        is_active: true,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        college: {
          id: 'c0000000-0000-0000-0000-000000000001',
          name: 'National Institute of Technology',
          is_active: true,
        },
      });
      setIsLoading(false);
      return;
    }

    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      if (session?.user) {
        fetchAppUser();
      } else {
        setIsLoading(false);
      }
    }).catch(() => {
      setIsLoading(false);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      setUser(session?.user ?? null);
      if (session?.user) {
        fetchAppUser();
      } else {
        setAppUser(null);
        setIsLoading(false);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const fetchAppUser = async () => {
    try {
      const response = await api.get<{ success: boolean; data: AppUser }>('/auth/me');
      setAppUser(response.data);
    } catch {
      // Fallback
    } finally {
      setIsLoading(false);
    }
  };

  const signIn = async (email: string, password: string) => {
    if (!isSupabaseConfigured) {
      setAppUser(prev => prev || {
        id: 'u0000000-0000-0000-0000-000000000001',
        email,
        display_name: email.split('@')[0],
        role: 'student',
        interests: ['Technology', 'Workshops'],
        notification_preferences: {
          event_reminders: true,
          event_updates: true,
          new_events: true,
          registration_updates: true,
        },
        is_active: true,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      });
      return;
    }

    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) throw error;
  };

  const signInWithGoogle = async () => {
    if (!isSupabaseConfigured) {
      setAppUser({
        id: 'u0000000-0000-0000-0000-000000000001',
        email: 'alex.johnson@campus.edu',
        display_name: 'Alex Johnson (Google)',
        role: 'student',
        interests: ['Technology', 'Hackathons'],
        notification_preferences: {
          event_reminders: true,
          event_updates: true,
          new_events: true,
          registration_updates: true,
        },
        is_active: true,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      });
      return;
    }

    const redirectUri = Linking.createURL('/');
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: redirectUri,
        skipBrowserRedirect: true,
      },
    });

    if (error) throw error;
    if (data?.url) {
      const result = await WebBrowser.openAuthSessionAsync(data.url, redirectUri);
      if (result.type === 'success' && result.url) {
        // Extract params from redirect URL if needed
        const parsedUrl = new URL(result.url);
        const params = new URLSearchParams(parsedUrl.hash.replace('#', '?'));
        const accessToken = params.get('access_token');
        const refreshToken = params.get('refresh_token');

        if (accessToken && refreshToken) {
          await supabase.auth.setSession({
            access_token: accessToken,
            refresh_token: refreshToken,
          });
        }
      }
    }
  };

  const signUp = async (email: string, password: string, displayName: string) => {
    if (!isSupabaseConfigured) {
      setAppUser({
        id: `user-${Date.now()}`,
        email,
        display_name: displayName,
        role: 'student',
        interests: ['Technology'],
        notification_preferences: {
          event_reminders: true,
          event_updates: true,
          new_events: true,
          registration_updates: true,
        },
        is_active: true,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      });
      return;
    }

    const { error, data } = await supabase.auth.signUp({
      email,
      password,
    });
    if (error) throw error;

    if (data.user) {
      await api.post('/auth/register', {
        email,
        displayName,
      });
    }
  };

  const signOut = async () => {
    if (isSupabaseConfigured) {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
    }
    setSession(null);
    setUser(null);
    setAppUser(null);
  };

  const resetPassword = async (email: string) => {
    if (!isSupabaseConfigured) return;
    const { error } = await supabase.auth.resetPasswordForEmail(email);
    if (error) throw error;
  };

  const updateProfile = async (data: Partial<AppUser>) => {
    setAppUser(prev => prev ? { ...prev, ...data } : null);
    if (isSupabaseConfigured) {
      try {
        const response = await api.patch<{ success: boolean; data: AppUser }>('/auth/me', data);
        setAppUser(response.data);
      } catch {
        // ignore
      }
    }
  };

  return (
    <AuthContext.Provider value={{ session, user, appUser, isLoading, signIn, signInWithGoogle, signUp, signOut, resetPassword, updateProfile }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
