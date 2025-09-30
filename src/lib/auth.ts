// Frontend-only Authentication Service
// No external dependencies - all mock data

export interface AuthUser {
  id: string;
  email: string;
  name?: string;
  avatar_url?: string;
  created_at: string;
  updated_at: string;
}

export const authService = {
  // Mock authentication methods
  async getCurrentSession() {
    // Check for admin bypass
    const adminBypass = sessionStorage.getItem('adminBypass');
    if (adminBypass === 'true') {
      return {
        user: {
          id: 'admin',
          email: 'admin@littlebird.com',
          name: 'Admin User'
        },
        access_token: 'mock-token'
      };
    }
    return null;
  },

  async signIn({ email, password }: { email: string; password: string }) {
    // Mock authentication
    if (email === 'admin@littlebird.com' && password === 'admin') {
      const user = {
        id: 'admin',
        email: 'admin@littlebird.com',
        name: 'Admin User'
      };
      sessionStorage.setItem('adminBypass', 'true');
      return { user, error: null };
    }
    return { user: null, error: new Error('Invalid credentials') };
  },

  async signUp({ email, password, name }: { email: string; password: string; name?: string }) {
    return { user: null, error: new Error('Registration not available in demo mode') };
  },

  async signOut() {
    sessionStorage.removeItem('adminBypass');
  },

  async resetPassword(email: string) {
    return { error: new Error('Password reset not available in demo mode') };
  },

  onAuthStateChange(callback: (event: string, session: any) => void) {
    // Mock auth state change listener
    return {
      data: {
        subscription: {
          unsubscribe: () => {}
        }
      }
    };
  }
};