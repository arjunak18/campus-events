import { useState, useEffect, createContext, useContext } from 'react';
import { Session, User } from '@supabase/supabase-js';
import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { User as AppUser } from '../types';
import api from '../services/api';
import * as SecureStore from 'expo-secure-store';

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
  signInWithGoogleAccount: (email: string, displayName?: string, avatarUrl?: string) => Promise<void>;
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
  signInWithGoogleAccount: async () => {},
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

  // Sync profile details directly to/from Supabase profiles table on each login
  const syncProfileToDb = async (authUser: User) => {
    try {
      const meta = authUser.user_metadata || {};
      const displayName = meta.full_name || meta.name || meta.display_name || authUser.email?.split('@')[0] || 'Student';
      const avatarUrl = meta.avatar_url || meta.picture || null;

      // Upsert profile in Supabase profiles table
      const { data: profile, error } = await supabase
        .from('profiles')
        .upsert({
          id: authUser.id,
          email: authUser.email || '',
          display_name: displayName,
          avatar_url: avatarUrl,
          updated_at: new Date().toISOString(),
        }, { onConflict: 'id' })
        .select('*, college:colleges(*)')
        .single();

      if (profile && !error) {
        setAppUser(profile);
        await SecureStore.setItemAsync('campus_events_user', JSON.stringify(profile));
      } else {
        await fetchAppUser();
      }
    } catch {
      await fetchAppUser();
    }
  };

  const fetchAppUser = async () => {
    try {
      const response = await api.get<{ success: boolean; data: AppUser }>('/auth/me');
      if (response?.data) {
        setAppUser(response.data);
        await SecureStore.setItemAsync('campus_events_user', JSON.stringify(response.data));
      }
    } catch {
      // Fallback
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    // 1. Instantly load cached user from SecureStore for seamless startup
    SecureStore.getItemAsync('campus_events_user')
      .then((stored) => {
        if (stored) {
          try {
            const parsed = JSON.parse(stored);
            if (parsed && parsed.email) {
              setAppUser(parsed);
              setIsLoading(false);
            }
          } catch {
            // ignore
          }
        }
      })
      .catch(() => {});

    if (!isSupabaseConfigured) {
      continueAsGuest();
      return;
    }

    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      if (session?.user) {
        syncProfileToDb(session.user);
      } else {
        SecureStore.getItemAsync('campus_events_user').then((cached) => {
          if (!cached) setIsLoading(false);
        });
      }
    }).catch(() => {
      setIsLoading(false);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, newSession) => {
      setSession(newSession);
      setUser(newSession?.user ?? null);
      if (newSession?.user) {
        await syncProfileToDb(newSession.user);
      } else {
        const stored = await SecureStore.getItemAsync('campus_events_user').catch(() => null);
        if (!stored) {
          setAppUser(null);
          setIsLoading(false);
        }
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const continueAsGuest = () => {
    const guestUser: AppUser = {
      id: 'u0000000-0000-0000-0000-000000000001',
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
    };
    setAppUser(guestUser);
    setIsLoading(false);
  };

  const signIn = async (email: string, password: string) => {
    if (!isSupabaseConfigured) {
      continueAsGuest();
      return;
    }

    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) throw error;
    if (data.session?.user) {
      setSession(data.session);
      setUser(data.session.user);
      await syncProfileToDb(data.session.user);
    }
  };

  const signInWithGoogleAccount = async (email: string, displayName?: string, avatarUrl?: string) => {
    setIsLoading(true);
    try {
      const cleanEmail = email.trim().toLowerCase();
      const name = displayName?.trim() || cleanEmail.split('@')[0].replace(/[._]/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
      const avatar = avatarUrl || `https://api.dicebear.com/7.x/bottts/png?seed=${encodeURIComponent(cleanEmail)}`;

      let hash = 0;
      for (let i = 0; i < cleanEmail.length; i++) {
        hash = ((hash << 5) - hash) + cleanEmail.charCodeAt(i);
        hash |= 0;
      }
      const hex = Math.abs(hash).toString(16).padStart(8, '0');
      const userUuid = `a0000000-0000-4000-8000-${hex.padEnd(12, '0')}`;

      // Save/upsert profile directly to Supabase profiles table
      if (isSupabaseConfigured) {
        try {
          await supabase.from('profiles').upsert({
            id: userUuid,
            email: cleanEmail,
            display_name: name,
            avatar_url: avatar,
            role: 'student',
            updated_at: new Date().toISOString(),
          }, { onConflict: 'id' });
        } catch {
          // ignore
        }
      }

      const newAppUser: AppUser = {
        id: userUuid,
        email: cleanEmail,
        display_name: name,
        avatar_url: avatar,
        role: 'student',
        interests: ['Technology', 'Hackathons', 'Artificial Intelligence', 'Cultural Events'],
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
      };

      setAppUser(newAppUser);
      await SecureStore.setItemAsync('campus_events_user', JSON.stringify(newAppUser));
    } finally {
      setIsLoading(false);
    }
  };

  const signInWithGoogle = async () => {
    if (!isSupabaseConfigured) {
      await signInWithGoogleAccount('arjunakkolikkal@gmail.com', 'Arjun A');
      return;
    }

    const redirectUri = Linking.createURL('auth-callback');

    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: redirectUri,
        skipBrowserRedirect: true,
        queryParams: {
          access_type: 'offline',
          prompt: 'select_account',
        },
      },
    });

    if (error) throw error;
    if (!data?.url) throw new Error('No authentication URL received from Google provider.');

    const result = await WebBrowser.openAuthSessionAsync(data.url, redirectUri);
    if (result.type === 'success' && result.url) {
      let code: string | null = null;
      let accessToken: string | null = null;
      let refreshToken: string | null = null;

      try {
        const parsed = Linking.parse(result.url);
        if (parsed.queryParams?.code) code = String(parsed.queryParams.code);
        if (parsed.queryParams?.access_token) accessToken = String(parsed.queryParams.access_token);
        if (parsed.queryParams?.refresh_token) refreshToken = String(parsed.queryParams.refresh_token);
      } catch {
        // regex fallback
      }

      if (!code) {
        const codeMatch = result.url.match(/[?&]code=([^&#]+)/);
        if (codeMatch) code = decodeURIComponent(codeMatch[1]);
      }
      if (!accessToken) {
        const tokenMatch = result.url.match(/[?&#]access_token=([^&#]+)/);
        if (tokenMatch) accessToken = decodeURIComponent(tokenMatch[1]);
      }
      if (!refreshToken) {
        const refreshMatch = result.url.match(/[?&#]refresh_token=([^&#]+)/);
        if (refreshMatch) refreshToken = decodeURIComponent(refreshMatch[1]);
      }

      if (code) {
        const { data: sessionData, error: exchangeError } = await supabase.auth.exchangeCodeForSession(code);
        if (exchangeError) throw exchangeError;
        if (sessionData.session) {
          setSession(sessionData.session);
          setUser(sessionData.session.user);
          await syncProfileToDb(sessionData.session.user);
        }
      } else if (accessToken && refreshToken) {
        const { data: sessionData, error: setSessionError } = await supabase.auth.setSession({
          access_token: accessToken,
          refresh_token: refreshToken,
        });
        if (setSessionError) throw setSessionError;
        if (sessionData.session) {
          setSession(sessionData.session);
          setUser(sessionData.session.user);
          await syncProfileToDb(sessionData.session.user);
        }
      }
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

    if (data.session?.user) {
      setSession(data.session);
      setUser(data.session.user);
      await syncProfileToDb(data.session.user);
    } else if (data.user) {
      try {
        await supabase.from('profiles').upsert({
          id: data.user.id,
          email: data.user.email || email,
          display_name: displayName,
          updated_at: new Date().toISOString(),
        }, { onConflict: 'id' });
      } catch {
        // ignore
      }
    }
  };

  const signOut = async () => {
    try {
      await SecureStore.deleteItemAsync('campus_events_user');
    } catch {
      // ignore
    }
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
    setAppUser(prev => {
      const updated = prev ? { ...prev, ...data } : null;
      if (updated) {
        SecureStore.setItemAsync('campus_events_user', JSON.stringify(updated)).catch(() => {});
      }
      return updated;
    });

    if (isSupabaseConfigured && (user || appUser)) {
      const targetId = user?.id || appUser?.id;
      if (targetId) {
        try {
          await supabase
            .from('profiles')
            .update({
              ...data,
              updated_at: new Date().toISOString(),
            })
            .eq('id', targetId);

          const response = await api.patch<{ success: boolean; data: AppUser }>('/auth/me', data);
          if (response?.data) {
            setAppUser(response.data);
            await SecureStore.setItemAsync('campus_events_user', JSON.stringify(response.data));
          }
        } catch {
          // ignore
        }
      }
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
      signInWithGoogleAccount,
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
