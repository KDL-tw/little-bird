"use client";

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Search, ArrowLeft, Loader2, CheckCircle, AlertCircle, Plus } from 'lucide-react';
import Link from 'next/link';
import { adminRepositoryService } from '@/lib/user-services';

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
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [selectedBill, setSelectedBill] = useState<OpenStatesBill | null>(null);
  const [addBillOpen, setAddBillOpen] = useState(false);
  const [clients, setClients] = useState<Client[]>([]);
  const [newBill, setNewBill] = useState({
    position: 'None' as 'Support' | 'Monitor' | 'Oppose' | 'None' | 'Hypothetical',
    priority: 'None' as 'High' | 'Medium' | 'Low' | 'None',
    client_id: '',
    watchlist: false
  });

  // Load clients on component mount
  useEffect(() => {
    loadClients();
  }, []);

  const loadClients = async () => {
    try {
      const data = await clientsDataService.getAll();
      setClients(data);
    } catch (error) {
      console.error('Error loading clients:', error);
    }
  };

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

  const handleAddBill = async () => {
    if (!selectedBill) return;
    
    try {
      setLoading(true);
      
      // Convert OpenStates bill to our format
      const billData = {
        bill_number: selectedBill.identifier,
        title: selectedBill.title,
        sponsor: selectedBill.from_organization?.name || 'Unknown',
        status: 'Active' as 'Active' | 'Passed' | 'Failed',
        last_action: selectedBill.latest_action_description || 'Introduced',
        position: newBill.position,
        priority: newBill.priority,
        client_id: newBill.client_id || undefined,
        watchlist: newBill.watchlist,
        openstates_id: selectedBill.id,
        openstates_data: selectedBill
      };
      
      await billsDataService.create(billData);
      setAddBillOpen(false);
      setSuccessMessage(`Bill ${selectedBill.identifier} added to tracking! Redirecting to My Bills...`);
      
      // Redirect to My Bills after a short delay
      setTimeout(() => {
        window.location.href = '/dashboard/my-bills';
      }, 2000);
      
      // Reset form
      setNewBill({
        position: 'None',
        priority: 'None',
        client_id: '',
        watchlist: false
      });
      
    } catch (error) {
      console.error('Error adding bill:', error);
      setErrorMessage('Failed to add bill to tracking');
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

        {successMessage && (
          <Alert className="mb-4 bg-green-50 border-green-200 text-green-800">
            <CheckCircle className="h-4 w-4" />
            <AlertDescription>{successMessage}</AlertDescription>
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
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => {
                          setSelectedBill(bill);
                          setAddBillOpen(true);
                        }}
                      >
                        <Plus className="h-4 w-4 mr-1" />
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

        {/* Add Bill Modal */}
        <Dialog open={addBillOpen} onOpenChange={setAddBillOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add Bill to Tracking</DialogTitle>
            </DialogHeader>
            {selectedBill && (
              <div className="space-y-4">
                <div className="bg-slate-50 p-4 rounded-lg">
                  <h3 className="font-semibold">{selectedBill.identifier}</h3>
                  <p className="text-sm text-slate-600">{selectedBill.title}</p>
                  <p className="text-sm text-slate-500 mt-1">
                    Sponsor: {selectedBill.from_organization?.name || 'Unknown'}
                  </p>
                  <p className="text-sm text-slate-500">
                    Last Action: {selectedBill.latest_action_description || 'Introduced'}
                  </p>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="position">Position</Label>
                    <Select value={newBill.position} onValueChange={(value: any) => setNewBill({...newBill, position: value})}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="None">None</SelectItem>
                        <SelectItem value="Support">Support</SelectItem>
                        <SelectItem value="Monitor">Monitor</SelectItem>
                        <SelectItem value="Oppose">Oppose</SelectItem>
                        <SelectItem value="Hypothetical">Hypothetical</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div>
                    <Label htmlFor="priority">Priority</Label>
                    <Select value={newBill.priority} onValueChange={(value: any) => setNewBill({...newBill, priority: value})}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="None">None</SelectItem>
                        <SelectItem value="High">High</SelectItem>
                        <SelectItem value="Medium">Medium</SelectItem>
                        <SelectItem value="Low">Low</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                
                <div>
                  <Label htmlFor="client_id">Client (Optional)</Label>
                  <Select value={newBill.client_id} onValueChange={(value) => setNewBill({...newBill, client_id: value})}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select client" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">No client</SelectItem>
                      {clients.map((client) => (
                        <SelectItem key={client.id} value={client.id}>
                          {client.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="watchlist"
                    checked={newBill.watchlist}
                    onChange={(e) => setNewBill({...newBill, watchlist: e.target.checked})}
                    className="rounded"
                  />
                  <Label htmlFor="watchlist">Add to watchlist</Label>
                </div>
                
                <div className="flex justify-end space-x-2">
                  <Button variant="outline" onClick={() => setAddBillOpen(false)}>
                    Cancel
                  </Button>
                  <Button onClick={handleAddBill} disabled={loading}>
                    {loading ? (
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    ) : (
                      <Plus className="h-4 w-4 mr-2" />
                    )}
                    Add Bill
                  </Button>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
