"use client";

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { DashboardLayout } from '@/components/DashboardLayout';
import { 
  Database, 
  RefreshCw, 
  Users, 
  FileText, 
  Link2, 
  CheckCircle, 
  AlertCircle, 
  Loader2 
} from 'lucide-react';

export default function AdminRepositoryPage() {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);
  const [syncResults, setSyncResults] = useState<any>(null);

  const handleSync = async (type: string) => {
    try {
      setLoading(true);
      setMessage(null);
      
      const response = await fetch('/api/admin/sync', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type, session: '2025B' })
      });

      const data = await response.json();
      
      if (data.success) {
        setMessage({ type: 'success', text: data.message });
        setSyncResults(data.result);
      } else {
        setMessage({ type: 'error', text: data.error });
      }
    } catch (error) {
      setMessage({ type: 'error', text: `Sync failed: ${error instanceof Error ? error.message : 'Unknown error'}` });
    } finally {
      setLoading(false);
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Admin Repository</h1>
          <p className="text-slate-600 mt-1">Manage the central data repository for all users</p>
        </div>

        {message && (
          <Alert className={message.type === 'success' ? 'bg-green-50 border-green-200 text-green-800' : 'bg-red-50 border-red-200 text-red-800'}>
            {message.type === 'success' ? <CheckCircle className="h-4 w-4" /> : <AlertCircle className="h-4 w-4" />}
            <AlertDescription>{message.text}</AlertDescription>
          </Alert>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Legislators</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">Sync Required</div>
              <p className="text-xs text-muted-foreground">Colorado legislators from OpenStates</p>
              <Button 
                className="w-full mt-2" 
                onClick={() => handleSync('legislators')}
                disabled={loading}
              >
                {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <RefreshCw className="h-4 w-4" />}
                Sync Legislators
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Bills</CardTitle>
              <FileText className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">Sync Required</div>
              <p className="text-xs text-muted-foreground">2025B session bills from OpenStates</p>
              <Button 
                className="w-full mt-2" 
                onClick={() => handleSync('bills')}
                disabled={loading}
              >
                {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <RefreshCw className="h-4 w-4" />}
                Sync Bills
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Sponsors</CardTitle>
              <Link2 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">Sync Required</div>
              <p className="text-xs text-muted-foreground">Bill sponsor relationships</p>
              <Button 
                className="w-full mt-2" 
                onClick={() => handleSync('sponsors')}
                disabled={loading}
              >
                {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <RefreshCw className="h-4 w-4" />}
                Sync Sponsors
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Full Sync</CardTitle>
              <Database className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">Complete</div>
              <p className="text-xs text-muted-foreground">Sync everything at once</p>
              <Button 
                className="w-full mt-2" 
                onClick={() => handleSync('full')}
                disabled={loading}
              >
                {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <RefreshCw className="h-4 w-4" />}
                Full Sync
              </Button>
            </CardContent>
          </Card>
        </div>

        {syncResults && (
          <Card>
            <CardHeader>
              <CardTitle>Sync Results</CardTitle>
            </CardHeader>
            <CardContent>
              <pre className="bg-slate-100 p-4 rounded text-xs overflow-auto">
                {JSON.stringify(syncResults, null, 2)}
              </pre>
            </CardContent>
          </Card>
        )}

        <Card>
          <CardHeader>
            <CardTitle>Repository Status</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Admin Repository</span>
                <span className="text-sm text-slate-500">Independent data store</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">User Schemas</span>
                <span className="text-sm text-slate-500">Reference admin data</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">No Mock Data</span>
                <span className="text-sm text-green-600">✓ Live data only</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Daily Updates</span>
                <span className="text-sm text-slate-500">Admin-triggered sync</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
