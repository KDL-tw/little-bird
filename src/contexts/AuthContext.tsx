'use client';

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { useRouter } from 'next/navigation';

// Frontend-only authentication
interface User {
  id: string;
  email: string;
  name?: string;
}

interface Session {
  user: User;
  access_token: string;
}

interface AuthContextType {
  user: User | null;
  session: Session | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<{ error: Error | null }>;
  signUp: (email: string, password: string, name?: string) => Promise<{ error: Error | null }>;
  signOut: () => Promise<void>;
  resetPassword: (email: string) => Promise<{ error: Error | null }>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    // Frontend-only: Check for admin bypass
    const adminBypass = sessionStorage.getItem('adminBypass');
    if (adminBypass === 'true') {
      const mockUser: User = {
        id: 'admin',
        email: 'admin@littlebird.com',
        name: 'Admin User'
      };
      const mockSession: Session = {
        user: mockUser,
        access_token: 'mock-token'
      };
      setUser(mockUser);
      setSession(mockSession);
    }
  }, []);

  const signIn = async (email: string, password: string) => {
    // Frontend-only: Mock authentication
    if (email === 'admin@littlebird.com' && password === 'admin') {
      const mockUser: User = {
        id: 'admin',
        email: 'admin@littlebird.com',
        name: 'Admin User'
      };
      const mockSession: Session = {
        user: mockUser,
        access_token: 'mock-token'
      };
      setUser(mockUser);
      setSession(mockSession);
      sessionStorage.setItem('adminBypass', 'true');
      return { error: null };
    }
    return { error: new Error('Invalid credentials') };
  };

  const signUp = async (email: string, password: string, name?: string) => {
    // Frontend-only: Mock registration
    return { error: new Error('Registration not available in demo mode') };
  };

  const signOut = async () => {
    setUser(null);
    setSession(null);
    sessionStorage.removeItem('adminBypass');
  };

  const resetPassword = async (email: string) => {
    // Frontend-only: Mock password reset
    return { error: new Error('Password reset not available in demo mode') };
  };

  const value = {
    user,
    session,
    loading,
    signIn,
    signUp,
    signOut,
    resetPassword
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}