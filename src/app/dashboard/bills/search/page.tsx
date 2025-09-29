"use client";

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { DashboardLayout } from '@/components/DashboardLayout';
import { Search, Plus, ArrowLeft, Loader2, CheckCircle, AlertCircle, FileText, Calendar, User, Building2 } from 'lucide-react';
import { billsService, clientsService } from '@/lib/database';
import Link from 'next/link';
import type { Bill, Client } from '@/lib/supabase';

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

export default function BillsSearchPage() {
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
  useState(() => {
    loadClients();
  });

  const loadClients = async () => {
    try {
      const data = await clientsService.getAll();
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
      
      // Build URL exactly like our working simple search
      let url = '/api/openstates/bills?state=co';
      
      // Only add query if there's actually a search term
      if (searchTerm.trim()) {
        url += `&q=${encodeURIComponent(searchTerm.trim())}`;
      }
      
      console.log('Search URL:', url);
      
      const response = await fetch(url);
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error('API Error Response:', errorText);
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      console.log('Search response:', data);
      
      if (data.success && data.data && Array.isArray(data.data)) {
        setSearchResults(data.data);
        setErrorMessage(data.data.length === 0 ? 'No bills found matching your search' : null);
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
      
      await billsService.create(billData);
      setAddBillOpen(false);
      setSuccessMessage(`Bill ${selectedBill.identifier} added to tracking!`);
      
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

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'active': return 'bg-blue-100 text-blue-800';
      case 'passed': return 'bg-green-100 text-green-800';
      case 'failed': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority.toLowerCase()) {
      case 'high': return 'bg-red-100 text-red-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const actions = (
    <div className="flex items-center space-x-2">
      <Link href="/dashboard/bills">
        <Button variant="outline" size="sm">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Bills
        </Button>
      </Link>
      <Link href="/dashboard">
        <Button variant="outline" size="sm">
          Dashboard
        </Button>
      </Link>
    </div>
  );

  return (
    <DashboardLayout
      title="Search Bills"
      subtitle="Find and track Colorado legislative bills"
      actions={actions}
    >
      {/* Search Form */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex items-center">
            <Search className="h-5 w-5 mr-2" />
            Search Bills
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4">
            <div className="flex-1">
              <Input
                placeholder="Search by bill number, title, or sponsor..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && searchBills()}
              />
            </div>
            <Button onClick={searchBills} disabled={loading}>
              {loading ? (
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              ) : (
                <Search className="h-4 w-4 mr-2" />
              )}
              Search
            </Button>
            <Button variant="outline" onClick={() => { setSearchTerm(''); searchBills(); }}>
              Get Recent Bills
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Messages */}
      {errorMessage && (
        <Alert className="mb-6" variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{errorMessage}</AlertDescription>
        </Alert>
      )}

      {successMessage && (
        <Alert className="mb-6">
          <CheckCircle className="h-4 w-4" />
          <AlertDescription>{successMessage}</AlertDescription>
        </Alert>
      )}

      {/* Search Results */}
      {searchResults.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Search Results ({searchResults.length})</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {searchResults.map((bill) => (
                <div key={bill.id} className="border rounded-lg p-4 hover:bg-slate-50">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-2">
                        <h3 className="font-semibold text-lg">{bill.identifier}</h3>
                        <Badge className="bg-blue-100 text-blue-800">
                          Active
                        </Badge>
                        <Badge variant="outline">
                          {bill.session}
                        </Badge>
                      </div>
                      <p className="text-slate-600 mb-2">{bill.title}</p>
                      <div className="flex items-center space-x-4 text-sm text-slate-500">
                        <span className="flex items-center">
                          <User className="h-4 w-4 mr-1" />
                          {bill.from_organization?.name || 'Unknown Sponsor'}
                        </span>
                        <span className="flex items-center">
                          <Calendar className="h-4 w-4 mr-1" />
                          {bill.latest_action_description || 'Introduced'}
                        </span>
                        <span className="flex items-center">
                          <Building2 className="h-4 w-4 mr-1" />
                          {bill.jurisdiction?.name || 'Colorado'}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
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
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

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
    </DashboardLayout>
  );
}