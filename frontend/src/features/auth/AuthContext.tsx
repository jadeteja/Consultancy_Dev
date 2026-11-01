import React, { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '../../lib/supabase';
import { apiClient } from '../../lib/api';
import type { User, Session, AuthChangeEvent } from '@supabase/supabase-js';

interface AuthContextType {
  user: User | null;
  session: Session | null;
  roles: string[];
  isLoading: boolean;
  signOut: () => Promise<void>;
  hasRole: (role: string) => boolean;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  session: null,
  roles: [],
  isLoading: true,
  signOut: async () => {},
  hasRole: () => false,
});

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [roles, setRoles] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const fetchUserProfile = async (u: User | null) => {
    if (!u) {
      setRoles([]);
      return;
    }
    const adminEmail = (import.meta.env.VITE_ADMIN_EMAIL || 'nextstepsolutions.recruitment@gmail.com').toLowerCase();
    const isAdmin = u.email?.toLowerCase() === adminEmail;

    try {
      const res = await apiClient.get('/candidate/profile');
      if (res.data?.userProfile?.roles) {
        const extractedRoles = res.data.userProfile.roles.map((r: { name: string }) => r.name);
        if (isAdmin && !extractedRoles.includes('ROLE_SUPER_ADMIN')) {
          extractedRoles.push('ROLE_SUPER_ADMIN');
        }
        setRoles(extractedRoles);
        return;
      }
    } catch {
      // Backend request might be waking up or cold starting
    }

    if (isAdmin) {
      setRoles(['ROLE_SUPER_ADMIN', 'ROLE_CANDIDATE']);
    } else {
      setRoles(['ROLE_CANDIDATE']);
    }
  };

  useEffect(() => {
    supabase.auth.getSession().then(({ data }: { data: { session: Session | null } }) => {
      setSession(data.session);
      setUser(data.session?.user ?? null);
      if (data.session?.user) {
        fetchUserProfile(data.session.user);
      }
      setIsLoading(false);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event: AuthChangeEvent, session: Session | null) => {
      setSession(session);
      setUser(session?.user ?? null);
      if (session?.user) {
        fetchUserProfile(session.user);
      } else {
        setRoles([]);
      }
      setIsLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const signOut = async () => {
    await supabase.auth.signOut();
    setUser(null);
    setSession(null);
    setRoles([]);
  };

  const hasRole = (role: string) => {
    const adminEmail = (import.meta.env.VITE_ADMIN_EMAIL || 'nextstepsolutions.recruitment@gmail.com').toLowerCase();
    if (role === 'ROLE_SUPER_ADMIN' && user?.email?.toLowerCase() === adminEmail) {
      return true;
    }
    return roles.includes(role);
  };

  return (
    <AuthContext.Provider value={{ user, session, roles, isLoading, signOut, hasRole }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
