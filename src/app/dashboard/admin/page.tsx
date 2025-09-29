"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { DashboardLayout } from "@/components/DashboardLayout";
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
  Settings,
  Globe
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
  const [fullSync, setFullSync] = useState<SyncResult | null>(null);
  const [loading, setLoading] = useState<string | null>(null);

  const syncBills = async () => {
    setLoading('bills');
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

  const syncFull = async () => {
    setLoading('full');
    try {
      const response = await fetch('/api/ingestion/foundation', { method: 'POST' });
      const result = await response.json();
      setFullSync(result);
    } catch (error) {
      setFullSync({
        success: false,
        message: 'Failed to perform full sync',
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    } finally {
      setLoading(null);
    }
  };

  const testEnvironment = async () => {
    setLoading('test');
    try {
      const response = await fetch('/api/test-simple');
      const result = await response.json();
      console.log('Environment test result:', result);
      alert('Environment test completed. Check console for details.');
    } catch (error) {
      console.error('Environment test failed:', error);
      alert('Environment test failed. Check console for details.');
    } finally {
      setLoading(null);
    }
  };

  const testDatabase = async () => {
    setLoading('db');
    try {
      const response = await fetch('/api/test-sync-simple', { method: 'POST' });
      const result = await response.json();
      console.log('Database test result:', result);
      alert('Database test completed. Check console for details.');
    } catch (error) {
      console.error('Database test failed:', error);
      alert('Database test failed. Check console for details.');
    } finally {
      setLoading(null);
    }
  };

  const loadTestData = async () => {
    setLoading('testdata');
    try {
      const response = await fetch('/api/test-sync', { method: 'POST' });
      const result = await response.json();
      console.log('Test data load result:', result);
      alert('Test data loaded. Check console for details.');
    } catch (error) {
      console.error('Test data load failed:', error);
      alert('Test data load failed. Check console for details.');
    } finally {
      setLoading(null);
    }
  };

  const actions = (
    <div className="flex items-center space-x-2">
      <Button variant="outline" size="sm" onClick={testEnvironment} disabled={loading === 'test'}>
        {loading === 'test' ? (
          <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
        ) : (
          <Settings className="h-4 w-4 mr-2" />
        )}
        Test Environment
      </Button>
      <Button variant="outline" size="sm" onClick={testDatabase} disabled={loading === 'db'}>
        {loading === 'db' ? (
          <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
        ) : (
          <Database className="h-4 w-4 mr-2" />
        )}
        Test Database
      </Button>
    </div>
  );

  return (
    <DashboardLayout
      title="Data Sync Dashboard"
      subtitle="Manage data synchronization from external sources to our internal database"
      actions={actions}
    >
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
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Sync Bills
                </>
              )}
            </Button>
            
            {billsSync && (
              <div className={`p-3 rounded-lg ${
                billsSync.success ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'
              }`}>
                <div className="flex items-center">
                  {billsSync.success ? (
                    <CheckCircle className="h-4 w-4 text-green-600 mr-2" />
                  ) : (
                    <AlertCircle className="h-4 w-4 text-red-600 mr-2" />
                  )}
                  <span className={`text-sm font-medium ${
                    billsSync.success ? 'text-green-800' : 'text-red-800'
                  }`}>
                    {billsSync.message}
                  </span>
                </div>
                {billsSync.count && (
                  <p className="text-sm text-green-700 mt-1">
                    {billsSync.count} bills synced
                  </p>
                )}
                {billsSync.error && (
                  <p className="text-sm text-red-700 mt-1">
                    Error: {billsSync.error}
                  </p>
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
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Sync Legislators
                </>
              )}
            </Button>
            
            {legislatorsSync && (
              <div className={`p-3 rounded-lg ${
                legislatorsSync.success ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'
              }`}>
                <div className="flex items-center">
                  {legislatorsSync.success ? (
                    <CheckCircle className="h-4 w-4 text-green-600 mr-2" />
                  ) : (
                    <AlertCircle className="h-4 w-4 text-red-600 mr-2" />
                  )}
                  <span className={`text-sm font-medium ${
                    legislatorsSync.success ? 'text-green-800' : 'text-red-800'
                  }`}>
                    {legislatorsSync.message}
                  </span>
                </div>
                {legislatorsSync.count && (
                  <p className="text-sm text-green-700 mt-1">
                    {legislatorsSync.count} legislators synced
                  </p>
                )}
                {legislatorsSync.error && (
                  <p className="text-sm text-red-700 mt-1">
                    Error: {legislatorsSync.error}
                  </p>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Full Sync */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="flex items-center">
            <Database className="h-5 w-5 mr-2" />
            Full Sync (Foundation Layer)
          </CardTitle>
          <CardDescription>
            Sync all data from OpenStates API using the Foundation Layer approach
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Button 
            onClick={syncFull} 
            disabled={loading === 'full'}
            className="w-full"
            variant="outline"
          >
            {loading === 'full' ? (
              <>
                <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                Full Sync in Progress...
              </>
            ) : (
              <>
                <Database className="h-4 w-4 mr-2" />
                Full Sync
              </>
            )}
          </Button>
          
          {fullSync && (
            <div className={`p-3 rounded-lg ${
              fullSync.success ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'
            }`}>
              <div className="flex items-center">
                {fullSync.success ? (
                  <CheckCircle className="h-4 w-4 text-green-600 mr-2" />
                ) : (
                  <AlertCircle className="h-4 w-4 text-red-600 mr-2" />
                )}
                <span className={`text-sm font-medium ${
                  fullSync.success ? 'text-green-800' : 'text-red-800'
                }`}>
                  {fullSync.message}
                </span>
              </div>
              {fullSync.count && (
                <p className="text-sm text-green-700 mt-1">
                  {fullSync.count} records synced
                </p>
              )}
              {fullSync.error && (
                <p className="text-sm text-red-700 mt-1">
                  Error: {fullSync.error}
                </p>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Debug Tools */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Settings className="h-5 w-5 mr-2" />
            Debug Tools
          </CardTitle>
          <CardDescription>
            Test environment and database connectivity
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Button 
              onClick={testEnvironment} 
              disabled={loading === 'test'}
              variant="outline"
            >
              {loading === 'test' ? (
                <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
              ) : (
                <Settings className="h-4 w-4 mr-2" />
              )}
              Test Environment
            </Button>
            
            <Button 
              onClick={testDatabase} 
              disabled={loading === 'db'}
              variant="outline"
            >
              {loading === 'db' ? (
                <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
              ) : (
                <Database className="h-4 w-4 mr-2" />
              )}
              Test Database
            </Button>
            
            <Button 
              onClick={loadTestData} 
              disabled={loading === 'testdata'}
              variant="outline"
            >
              {loading === 'testdata' ? (
                <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
              ) : (
                <BarChart3 className="h-4 w-4 mr-2" />
              )}
              Load Test Data
            </Button>
          </div>
        </CardContent>
      </Card>
    </DashboardLayout>
  );
}