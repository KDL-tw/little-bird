"use client";

export default function Hello() {
  return (
    <div className="min-h-screen bg-slate-50 p-8">
      <h1 className="text-3xl font-bold text-slate-900 mb-4">Hello World</h1>
      <p className="text-slate-600">This is the simplest possible page.</p>
      
      <div className="mt-8">
        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded">
          ✅ This page is working! No authentication required.
        </div>
      </div>
    </div>
  );
}
