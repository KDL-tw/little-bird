'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';

interface ProtectedRouteProps {
  children: React.ReactNode;
  redirectTo?: string;
}

export function ProtectedRoute({ 
  children, 
  redirectTo = '/login' 
}: ProtectedRouteProps) {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [adminBypass, setAdminBypass] = useState(false);
  const [clientLoaded, setClientLoaded] = useState(false);

  useEffect(() => {
    // Check for admin bypass flag on client side only
    const bypass = sessionStorage.getItem('adminBypass') === 'true';
    setAdminBypass(bypass);
    setClientLoaded(true);
  }, []);

  useEffect(() => {
    if (clientLoaded && !loading && !user && !adminBypass) {
      router.push(redirectTo);
    }
  }, [user, loading, adminBypass, clientLoaded, router, redirectTo]);

  // Show loading spinner while checking auth or loading client
  if (loading || !clientLoaded) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600 mx-auto mb-4"></div>
          <p className="text-slate-600">Loading...</p>
        </div>
      </div>
    );
  }

  // Show nothing while redirecting
  if (!user && !adminBypass) {
    return null;
  }

  // Render protected content
  return <>{children}</>;
}
