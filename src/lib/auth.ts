// Supabase Authentication Service
import { supabase } from './supabase';
import type { User, Session } from '@supabase/supabase-js';

// Check if Supabase is properly configured
const isSupabaseConfigured = () => {
  return process.env.NEXT_PUBLIC_SUPABASE_URL && 
         process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY &&
         process.env.NEXT_PUBLIC_SUPABASE_URL !== 'https://placeholder.supabase.co';
};

export interface AuthUser {
  id: string;
  email: string;
  name?: string;
  avatar_url?: string;
  created_at: string;
  updated_at: string;
}

export interface SignUpData {
  email: string;
  password: string;
  name?: string;
}

export interface SignInData {
  email: string;
  password: string;
}

export class AuthService {
  // Sign up with email and password
  async signUp(data: SignUpData): Promise<{ user: User | null; error: Error | null }> {
    if (!isSupabaseConfigured()) {
      return { user: null, error: new Error('Supabase not configured') };
    }
    
    try {
      const { data: authData, error } = await supabase.auth.signUp({
        email: data.email,
        password: data.password,
        options: {
          data: {
            name: data.name || data.email.split('@')[0]
          }
        }
      });

      if (error) {
        console.error('Sign up error:', error);
        return { user: null, error };
      }

      console.log('✅ User signed up successfully:', authData.user?.email);
      return { user: authData.user, error: null };
    } catch (error) {
      console.error('Sign up error:', error);
      return { user: null, error: error as Error };
    }
  }

  // Sign in with email and password
  async signIn(data: SignInData): Promise<{ user: User | null; error: Error | null }> {
    if (!isSupabaseConfigured()) {
      return { user: null, error: new Error('Supabase not configured') };
    }
    
    try {
      const { data: authData, error } = await supabase.auth.signInWithPassword({
        email: data.email,
        password: data.password
      });

      if (error) {
        console.error('Sign in error:', error);
        return { user: null, error };
      }

      console.log('✅ User signed in successfully:', authData.user?.email);
      return { user: authData.user, error: null };
    } catch (error) {
      console.error('Sign in error:', error);
      return { user: null, error: error as Error };
    }
  }

  // Sign out
  async signOut(): Promise<{ error: Error | null }> {
    try {
      const { error } = await supabase.auth.signOut();
      
      if (error) {
        console.error('Sign out error:', error);
        return { error };
      }

      console.log('✅ User signed out successfully');
      return { error: null };
    } catch (error) {
      console.error('Sign out error:', error);
      return { error: error as Error };
    }
  }

  // Get current user
  async getCurrentUser(): Promise<User | null> {
    try {
      const { data: { user }, error } = await supabase.auth.getUser();
      
      if (error) {
        console.error('Get user error:', error);
        return null;
      }

      return user;
    } catch (error) {
      console.error('Get user error:', error);
      return null;
    }
  }

  // Get current session
  async getCurrentSession(): Promise<Session | null> {
    try {
      const { data: { session }, error } = await supabase.auth.getSession();
      
      if (error) {
        console.error('Get session error:', error);
        return null;
      }

      return session;
    } catch (error) {
      console.error('Get session error:', error);
      return null;
    }
  }

  // Listen to auth state changes
  onAuthStateChange(callback: (event: string, session: Session | null) => void) {
    return supabase.auth.onAuthStateChange(callback);
  }

  // Reset password
  async resetPassword(email: string): Promise<{ error: Error | null }> {
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`
      });

      if (error) {
        console.error('Reset password error:', error);
        return { error };
      }

      console.log('✅ Password reset email sent to:', email);
      return { error: null };
    } catch (error) {
      console.error('Reset password error:', error);
      return { error: error as Error };
    }
  }

  // Update user profile
  async updateProfile(updates: { name?: string; avatar_url?: string }): Promise<{ user: User | null; error: Error | null }> {
    try {
      const { data, error } = await supabase.auth.updateUser({
        data: updates
      });

      if (error) {
        console.error('Update profile error:', error);
        return { user: null, error };
      }

      console.log('✅ Profile updated successfully');
      return { user: data.user, error: null };
    } catch (error) {
      console.error('Update profile error:', error);
      return { user: null, error: error as Error };
    }
  }
}

export const authService = new AuthService();
