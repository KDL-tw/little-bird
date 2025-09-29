export default function TestDashboard() {
  return (
    <div className="min-h-screen bg-slate-50 p-8">
      <h1 className="text-3xl font-bold text-slate-900 mb-4">Test Dashboard</h1>
      <p className="text-slate-600 mb-6">This page has no authentication or complex components.</p>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-2">Bills</h2>
          <p className="text-slate-600">Track legislative bills</p>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-2">Legislators</h2>
          <p className="text-slate-600">Manage legislator relationships</p>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-2">Analytics</h2>
          <p className="text-slate-600">View insights and reports</p>
        </div>
      </div>
      
      <div className="mt-8">
        <h2 className="text-xl font-semibold mb-4">Status</h2>
        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded">
          ✅ This page is working! No authentication required.
        </div>
      </div>
    </div>
  );
}
