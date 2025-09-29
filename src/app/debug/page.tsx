"use client";

export default function DebugPage() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  
  return (
    <div className="min-h-screen bg-slate-50 p-8">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-2xl font-bold mb-6">Environment Variables Debug</h1>
        
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-lg font-semibold mb-4">Supabase Configuration</h2>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">NEXT_PUBLIC_SUPABASE_URL:</label>
              <div className="mt-1 p-3 bg-gray-100 rounded text-sm font-mono">
                {supabaseUrl ? (
                  <span className="text-green-600">✅ {supabaseUrl}</span>
                ) : (
                  <span className="text-red-600">❌ Not found</span>
                )}
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700">NEXT_PUBLIC_SUPABASE_ANON_KEY:</label>
              <div className="mt-1 p-3 bg-gray-100 rounded text-sm font-mono">
                {supabaseKey ? (
                  <span className="text-green-600">✅ {supabaseKey.substring(0, 20)}...</span>
                ) : (
                  <span className="text-red-600">❌ Not found</span>
                )}
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700">Configuration Status:</label>
              <div className="mt-1 p-3 bg-gray-100 rounded text-sm">
                {supabaseUrl && supabaseKey && supabaseUrl !== 'https://placeholder.supabase.co' ? (
                  <span className="text-green-600">✅ Supabase is properly configured</span>
                ) : (
                  <span className="text-red-600">❌ Supabase is not configured</span>
                )}
              </div>
            </div>
          </div>
          
          <div className="mt-6">
            <a href="/login" className="text-blue-600 hover:underline">← Back to Login</a>
          </div>
        </div>
      </div>
    </div>
  );
}
