"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { useState } from "react";
import { 
  Database, 
  RefreshCw, 
  CheckCircle, 
  AlertCircle, 
  Clock,
  FileText,
  Users,
  BarChart3,
  Settings
} from "lucide-react";

interface SyncResult {
  success: boolean;
  message: string;
  count?: number;
  error?: string;
}

export default function AdminDashboard() {
  const [billsSync, setBillsSync] = useState<SyncResult | null>(null);
  const [legislatorsSync, setLegislatorsSync] = useState<SyncResult | null>(null);
  const [testSync, setTestSync] = useState<SyncResult | null>(null);
  const [loading, setLoading] = useState<string | null>(null);

  const syncBills = async () => {
    setLoading('bills');
    setBillsSync(null);
    
    try {
      const response = await fetch('/api/sync/bills', { method: 'POST' });
      const result = await response.json();
      setBillsSync(result);
    } catch (error) {
      setBillsSync({
        success: false,
        message: 'Failed to sync bills',
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    } finally {
      setLoading(null);
    }
  };

  const syncLegislators = async () => {
    setLoading('legislators');
    setLegislatorsSync(null);
    
    try {
      const response = await fetch('/api/sync/legislators', { method: 'POST' });
      const result = await response.json();
      setLegislatorsSync(result);
    } catch (error) {
      setLegislatorsSync({
        success: false,
        message: 'Failed to sync legislators',
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    } finally {
      setLoading(null);
    }
  };

  const syncTest = async () => {
    setLoading('test');
    setTestSync(null);
    
    try {
      const response = await fetch('/api/test-sync', { method: 'POST' });
      const result = await response.json();
      setTestSync(result);
    } catch (error) {
      setTestSync({
        success: false,
        message: 'Failed to sync test data',
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    } finally {
      setLoading(null);
    }
  };

  const syncAll = async () => {
    await syncBills();
    await syncLegislators();
  };

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <header className="bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <h1 className="text-xl font-semibold text-slate-900">
                <span className="text-slate-500">LITTLE</span><span className="text-slate-900">BIRD</span>
              </h1>
              <Badge variant="outline" className="ml-4">Admin</Badge>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-900 mb-2">Data Sync Dashboard</h1>
          <p className="text-slate-600">Manage data synchronization from external sources to our internal database.</p>
        </div>

        {/* Sync Actions */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <FileText className="h-5 w-5 mr-2" />
                Bills Sync
              </CardTitle>
              <CardDescription>
                Sync Colorado bills from OpenStates API to our database
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Button 
                onClick={syncBills} 
                disabled={loading === 'bills'}
                className="w-full"
              >
                {loading === 'bills' ? (
                  <>
                    <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                    Syncing...
                  </>
                ) : (
                  <>
                    <Database className="h-4 w-4 mr-2" />
                    Sync Bills
                  </>
                )}
              </Button>
              
              {billsSync && (
                <div className={`p-3 rounded-lg border ${
                  billsSync.success 
                    ? 'bg-green-50 border-green-200 text-green-800' 
                    : 'bg-red-50 border-red-200 text-red-800'
                }`}>
                  <div className="flex items-center">
                    {billsSync.success ? (
                      <CheckCircle className="h-4 w-4 mr-2" />
                    ) : (
                      <AlertCircle className="h-4 w-4 mr-2" />
                    )}
                    <span className="font-medium">{billsSync.message}</span>
                  </div>
                  {billsSync.count && (
                    <p className="text-sm mt-1">Synced {billsSync.count} bills</p>
                  )}
                  {billsSync.error && (
                    <p className="text-sm mt-1">{billsSync.error}</p>
                  )}
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Users className="h-5 w-5 mr-2" />
                Legislators Sync
              </CardTitle>
              <CardDescription>
                Sync Colorado legislators from OpenStates API to our database
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Button 
                onClick={syncLegislators} 
                disabled={loading === 'legislators'}
                className="w-full"
              >
                {loading === 'legislators' ? (
                  <>
                    <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                    Syncing...
                  </>
                ) : (
                  <>
                    <Database className="h-4 w-4 mr-2" />
                    Sync Legislators
                  </>
                )}
              </Button>
              
              {legislatorsSync && (
                <div className={`p-3 rounded-lg border ${
                  legislatorsSync.success 
                    ? 'bg-green-50 border-green-200 text-green-800' 
                    : 'bg-red-50 border-red-200 text-red-800'
                }`}>
                  <div className="flex items-center">
                    {legislatorsSync.success ? (
                      <CheckCircle className="h-4 w-4 mr-2" />
                    ) : (
                      <AlertCircle className="h-4 w-4 mr-2" />
                    )}
                    <span className="font-medium">{legislatorsSync.message}</span>
                  </div>
                  {legislatorsSync.count && (
                    <p className="text-sm mt-1">Synced {legislatorsSync.count} legislators</p>
                  )}
                  {legislatorsSync.error && (
                    <p className="text-sm mt-1">{legislatorsSync.error}</p>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Test Sync */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center">
              <CheckCircle className="h-5 w-5 mr-2" />
              Test Sync (Sample Data)
            </CardTitle>
            <CardDescription>
              Load sample data to test the system without external API calls
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button 
              onClick={syncTest} 
              disabled={loading === 'test'}
              className="w-full"
              size="lg"
            >
              {loading === 'test' ? (
                <>
                  <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                  Loading Test Data...
                </>
              ) : (
                <>
                  <CheckCircle className="h-4 w-4 mr-2" />
                  Load Test Data
                </>
              )}
            </Button>
            
            {testSync && (
              <div className={`p-3 rounded-lg border ${
                testSync.success 
                  ? 'bg-green-50 border-green-200 text-green-800' 
                  : 'bg-red-50 border-red-200 text-red-800'
              }`}>
                <div className="flex items-center">
                  {testSync.success ? (
                    <CheckCircle className="h-4 w-4 mr-2" />
                  ) : (
                    <AlertCircle className="h-4 w-4 mr-2" />
                  )}
                  <span className="font-medium">{testSync.message}</span>
                </div>
                {testSync.bills_count && testSync.legislators_count && (
                  <p className="text-sm mt-1">
                    Loaded {testSync.bills_count} bills and {testSync.legislators_count} legislators
                  </p>
                )}
                {testSync.error && (
                  <p className="text-sm mt-1">{testSync.error}</p>
                )}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Full Sync */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center">
              <RefreshCw className="h-5 w-5 mr-2" />
              Full Sync (External APIs)
            </CardTitle>
            <CardDescription>
              Sync all data sources from external APIs at once
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button 
              onClick={syncAll} 
              disabled={loading !== null}
              className="w-full"
              size="lg"
              variant="outline"
            >
              {loading ? (
                <>
                  <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                  Syncing All Data...
                </>
              ) : (
                <>
                  <Database className="h-4 w-4 mr-2" />
                  Sync All Data
                </>
              )}
            </Button>
          </CardContent>
        </Card>

        {/* Status Overview */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <BarChart3 className="h-5 w-5 mr-2" />
              System Status
            </CardTitle>
            <CardDescription>
              Current status of data sources and sync operations
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span className="text-sm">Internal Database</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span className="text-sm">OpenStates API</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                <span className="text-sm">Sync Status</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
