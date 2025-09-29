"use client";

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function BillsSearchPage() {
  const router = useRouter();

  useEffect(() => {
    // Redirect to the working simple search
    router.replace('/dashboard/bills/search-simple');
  }, [router]);

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600 mx-auto mb-4"></div>
        <p className="text-slate-600">Redirecting to search...</p>
      </div>
    </div>
  );
}