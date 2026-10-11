import React, { createContext, useContext, useState, useEffect } from 'react';
import { Session, User } from '@supabase/supabase-js';
import * as WebBrowser from 'expo-web-browser';
import * as AuthSession from 'expo-auth-session';
import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { User as AppUser } from '../types';
import api from '../services/api';

WebBrowser.maybeCompleteAuthSession();

const REDIRECT_URI = AuthSession.makeRedirectUri({
  scheme: 'campusevents',
  path: 'auth-callback',
});

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
  continueAsGuest: () => void;
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
  continueAsGuest: () => {},
});

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [appUser, setAppUser] = useState<AppUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch verified profile from backend (server-side JWT validation)
  const fetchServerProfile = async () => {
    try {
      const response = await api.get<{ success: boolean; data: AppUser }>('/auth/me');
      if (response?.data) {
        setAppUser(response.data);
      }
    } catch {
      // Unauthenticated or profile not yet loaded
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (!isSupabaseConfigured) {
      continueAsGuest();
      return;
    }

    supabase.auth.getSession().then(({ data: { session: initialSession } }) => {
      setSession(initialSession);
      setUser(initialSession?.user ?? null);
      if (initialSession) {
        fetchServerProfile();
      } else {
        setIsLoading(false);
      }
    }).catch(() => {
      setIsLoading(false);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, newSession) => {
      setSession(newSession);
      setUser(newSession?.user ?? null);
      if (newSession) {
        await fetchServerProfile();
      } else {
        setAppUser(null);
        setIsLoading(false);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const continueAsGuest = () => {
    setAppUser({
      id: 'guest-user',
      email: 'guest@campusevents.edu',
      display_name: 'Guest Student',
      role: 'student',
      interests: ['Technology', 'Hackathons', 'Cultural Events'],
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
  };

  const signIn = async (email: string, password: string) => {
    if (!isSupabaseConfigured) {
      continueAsGuest();
      return;
    }

    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) throw error;
    if (data.session) {
      setSession(data.session);
      setUser(data.session.user);
      await fetchServerProfile();
    }
  };

  const signInWithGoogle = async () => {
    if (!isSupabaseConfigured) {
      continueAsGuest();
      return;
    }

    setIsLoading(true);
    try {
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: REDIRECT_URI,
          skipBrowserRedirect: true,
          queryParams: {
            access_type: 'offline',
            prompt: 'select_account',
          },
        },
      });

      if (error || !data.url) {
        throw new Error(error?.message || 'Failed to initialize Google OAuth session.');
      }

      const result = await WebBrowser.openAuthSessionAsync(data.url, REDIRECT_URI, {
        showInRecents: true,
      });

      if (result.type !== 'success' || !result.url) {
        return;
      }

      // Safe URL parsing for code or tokens
      let code: string | null = null;
      let accessToken: string | null = null;
      let refreshToken: string | null = null;

      try {
        const parsedUrl = new URL(result.url);
        code = parsedUrl.searchParams.get('code');
        if (!code && parsedUrl.hash) {
          const hashParams = new URLSearchParams(parsedUrl.hash.replace(/^#/, ''));
          accessToken = hashParams.get('access_token');
          refreshToken = hashParams.get('refresh_token');
        }
      } catch {
        // Fallback parameter extraction via regex
        const codeMatch = result.url.match(/[?&]code=([^&#]+)/);
        if (codeMatch) code = decodeURIComponent(codeMatch[1]);
        const tokenMatch = result.url.match(/[?&#]access_token=([^&#]+)/);
        if (tokenMatch) accessToken = decodeURIComponent(tokenMatch[1]);
        const refreshMatch = result.url.match(/[?&#]refresh_token=([^&#]+)/);
        if (refreshMatch) refreshToken = decodeURIComponent(refreshMatch[1]);
      }

      if (code) {
        const { error: exchangeError } = await supabase.auth.exchangeCodeForSession(code);
        if (exchangeError) throw exchangeError;
      } else if (accessToken && refreshToken) {
        const { error: setSessionError } = await supabase.auth.setSession({
          access_token: accessToken,
          refresh_token: refreshToken,
        });
        if (setSessionError) throw setSessionError;
      } else {
        throw new Error('OAuth callback returned without authorization code or tokens.');
      }

      await fetchServerProfile();
    } finally {
      setIsLoading(false);
    }
  };

  const signUp = async (email: string, password: string, displayName: string) => {
    if (!isSupabaseConfigured) {
      continueAsGuest();
      return;
    }

    const { error, data } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          display_name: displayName,
          full_name: displayName,
        },
      },
    });
    if (error) throw error;

    if (data.session) {
      setSession(data.session);
      setUser(data.session.user);
      await fetchServerProfile();
    }
  };

  const signOut = async () => {
    if (isSupabaseConfigured) {
      try {
        await supabase.auth.signOut();
      } catch {
        // ignore
      }
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
    try {
      const response = await api.patch<{ success: boolean; data: AppUser }>('/auth/me', data);
      if (response?.data) {
        setAppUser(response.data);
      }
    } catch {
      // ignore
    }
  };

  return (
    <AuthContext.Provider value={{
      session,
      user,
      appUser,
      isLoading,
      signIn,
      signInWithGoogle,
      signUp,
      signOut,
      resetPassword,
      updateProfile,
      continueAsGuest,
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
