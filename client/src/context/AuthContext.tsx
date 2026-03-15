import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { supabase } from '../config/supabase';
import api from '../lib/api';
import type { User } from '../types';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (data: Record<string, unknown>, type: 'student' | 'teacher') => Promise<{ requiresApproval: boolean }>;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initAuth = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (session) {
          localStorage.setItem('access_token', session.access_token);
          const { data } = await api.get('/users/me');
          setUser(data.data);
        }
      } catch {
        // Profile fetch failed — clear everything to avoid reload loops
        localStorage.removeItem('access_token');
        await supabase.auth.signOut();
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    initAuth();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, session) => {
      if (session) {
        localStorage.setItem('access_token', session.access_token);
      } else {
        localStorage.removeItem('access_token');
        setUser(null);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const login = async (email: string, password: string) => {
    const { data: authData, error } = await supabase.auth.signInWithPassword({ email, password });

    // Handle Supabase-level "email not confirmed" rejection
    if (error) {
      if (error.message.toLowerCase().includes('email not confirmed')) {
        const err = new Error('Please verify your email before logging in') as Error & { code: string; email: string };
        err.code = 'EMAIL_NOT_VERIFIED';
        err.email = email;
        throw err;
      }
      throw new Error(error.message);
    }

    // Check if email is verified even if Supabase allowed sign-in
    if (!authData.user?.email_confirmed_at) {
      await supabase.auth.signOut();
      localStorage.removeItem('access_token');
      const err = new Error('Please verify your email before logging in') as Error & { code: string; email: string };
      err.code = 'EMAIL_NOT_VERIFIED';
      err.email = email;
      throw err;
    }

    localStorage.setItem('access_token', authData.session!.access_token);
    const { data } = await api.get('/users/me');
    setUser(data.data);
  };

  const register = async (formData: Record<string, unknown>, type: 'student' | 'teacher') => {
    const { data } = await api.post('/auth/register', { ...formData, type });
    return { requiresApproval: data.requiresApproval };
  };

  const logout = async () => {
    await supabase.auth.signOut();
    localStorage.removeItem('access_token');
    setUser(null);
  };

  const refreshUser = async () => {
    try {
      const { data } = await api.get('/users/me');
      setUser(data.data);
    } catch {
      setUser(null);
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout, refreshUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
}
