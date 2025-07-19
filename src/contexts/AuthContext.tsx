import React, { createContext, useContext, useState, useEffect } from 'react';
import { auth, db } from '../lib/supabase';
import { User } from '../types';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<{ error: any }>;
  signOut: () => Promise<void>;
  hasRole: (role: string | string[]) => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getInitialSession = async () => {
      const { session } = await auth.getSession();
      if (session?.user) {
        await loadUserProfile(session.user.id);
      }
      setLoading(false);
    };

    getInitialSession();
  }, []);

  const loadUserProfile = async (userId: string) => {
    try {
      const { data, error } = await db.getUserById(userId);
      if (error) throw error;
      setUser(data);
    } catch (error) {
      console.error('Error loading user profile:', error);
      setUser(null);
    }
  };

  const signIn = async (email: string, password: string) => {
    try {
      const { data, error } = await auth.signIn(email, password);
      if (error) return { error };
      
      if (data.user) {
        await loadUserProfile(data.user.id);
      }
      return { error: null };
    } catch (error) {
      return { error };
    }
  };

  const signOut = async () => {
    await auth.signOut();
    setUser(null);
  };

  const hasRole = (role: string | string[]) => {
    if (!user) return false;
    if (Array.isArray(role)) {
      return role.includes(user.role);
    }
    return user.role === role;
  };

  const value = {
    user,
    loading,
    signIn,
    signOut,
    hasRole,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};