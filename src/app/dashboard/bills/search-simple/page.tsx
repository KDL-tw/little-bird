"use client";

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Search, ArrowLeft, Loader2, CheckCircle, AlertCircle } from 'lucide-react';
import Link from 'next/link';

interface OpenStatesBill {
  id: string;
  identifier: string;
  title: string;
  latest_action_description: string;
  session: string;
  jurisdiction: {
    name: string;
  };
  from_organization: {
    name: string;
  };
}

export default function SimpleBillsSearch() {
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState<OpenStatesBill[]>([]);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const searchBills = async () => {
    try {
      setLoading(true);
      setErrorMessage(null);
      setSearchResults([]);
      
      // Build URL exactly like our working test
      let url = '/api/openstates/bills?state=co';
      
      // Only add query if there's actually a search term
      if (searchTerm.trim()) {
        url += `&q=${encodeURIComponent(searchTerm.trim())}`;
      }
      
      console.log('Search URL:', url);
      
      const response = await fetch(url);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      console.log('Search response:', data);
      
      if (data.success && data.data && Array.isArray(data.data) && data.data.length > 0) {
        setSearchResults(data.data);
        setErrorMessage(null);
      } else {
        setSearchResults([]);
        setErrorMessage(data.error || 'No bills found matching your search');
      }
    } catch (error) {
      console.error('Error searching bills:', error);
      setErrorMessage(`Failed to search bills: ${error instanceof Error ? error.message : 'Unknown error'}`);
      setSearchResults([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-4">
            <Link href="/dashboard/bills">
              <Button variant="outline" size="sm">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Bills
              </Button>
            </Link>
            <Link href="/dashboard">
              <Button variant="ghost" size="sm">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Dashboard
              </Button>
            </Link>
            <div>
              <h1 className="text-3xl font-bold text-slate-900">Simple Bills Search</h1>
              <p className="text-slate-600 mt-1">Clean version - just get the data working (v2)</p>
            </div>
          </div>
        </div>

        {/* Alerts */}
        {errorMessage && (
          <Alert className="mb-4 bg-red-50 border-red-200 text-red-800">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{errorMessage}</AlertDescription>
          </Alert>
        )}

        {/* Search Section */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Search Colorado Legislature</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex gap-4">
              <div className="flex-1">
                <Input
                  placeholder="Search by bill number, title, or keywords..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && searchBills()}
                />
              </div>
              <Button 
                onClick={searchBills}
                disabled={loading}
              >
                {loading ? (
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                ) : (
                  <Search className="h-4 w-4 mr-2" />
                )}
                Search
              </Button>
              <Button 
                onClick={() => {
                  setSearchTerm('');
                  searchBills();
                }}
                disabled={loading}
                variant="outline"
              >
                Get Recent Bills
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Results */}
        {searchResults.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>Search Results ({searchResults.length} bills found)</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {searchResults.map((bill) => (
                  <div key={bill.id} className="border rounded-lg p-4 hover:bg-slate-50">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <Badge variant="outline">{bill.identifier}</Badge>
                          <Badge variant="secondary">{bill.session}</Badge>
                        </div>
                        <h3 className="font-semibold text-lg mb-1">{bill.title}</h3>
                        <p className="text-sm text-slate-600 mb-2">
                          {bill.latest_action_description}
                        </p>
                        <div className="flex items-center gap-4 text-xs text-slate-500">
                          <span>Chamber: {bill.from_organization.name}</span>
                          <span>State: {bill.jurisdiction.name}</span>
                        </div>
                      </div>
                      <Button size="sm" variant="outline">
                        Add to Tracking
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Debug Info */}
        <Card className="mt-6">
          <CardHeader>
            <CardTitle>Debug Info</CardTitle>
          </CardHeader>
          <CardContent>
            <pre className="text-xs bg-slate-100 p-4 rounded overflow-auto">
              {JSON.stringify({
                searchTerm,
                resultsCount: searchResults.length,
                loading,
                error: errorMessage
              }, null, 2)}
            </pre>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
