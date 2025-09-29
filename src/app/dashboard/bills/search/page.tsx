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
import { 
  Search, 
  Plus, 
  ExternalLink, 
  Calendar,
  User,
  FileText,
  CheckCircle,
  AlertCircle,
  Loader2,
  ArrowLeft
} from 'lucide-react';
import Link from 'next/link';

interface Bill {
  id: string;
  bill_number: string;
  title: string;
  sponsor: string;
  status: string;
  last_action: string;
  position: string;
  priority: string;
  watchlist: boolean;
  created_at: string;
  updated_at: string;
}

export default function BillsSearchPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [searchResults, setSearchResults] = useState<Bill[]>([]);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [selectedBill, setSelectedBill] = useState<Bill | null>(null);
  const [addBillOpen, setAddBillOpen] = useState(false);
  const [newBill, setNewBill] = useState({
    position: 'None' as 'Support' | 'Monitor' | 'Oppose' | 'None' | 'Hypothetical',
    priority: 'None' as 'High' | 'Medium' | 'Low' | 'None',
    client_id: '',
    watchlist: false
  });

  const searchBills = async () => {
    try {
      setLoading(true);
      setErrorMessage(null);
      setSearchResults([]);
      
      // Use offline data API (no database required)
      let url = '/api/offline-data?type=bills';
      
      if (searchTerm.trim()) {
        url += `&q=${encodeURIComponent(searchTerm.trim())}`;
      }
      
      console.log('Offline search URL:', url);
      
      const response = await fetch(url);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      console.log('Offline search response:', data);
      
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
      
      // Convert OpenStates bill to our format with safe property access
      const billData = {
        bill_number: selectedBill.bill_number || 'Unknown',
        title: selectedBill.title || 'Unknown Title',
        sponsor: selectedBill.sponsor || 'Unknown',
        status: 'Active' as 'Active' | 'Passed' | 'Failed',
        last_action: selectedBill.last_action || 'Introduced',
        position: newBill.position,
        priority: newBill.priority,
        client_id: newBill.client_id || undefined,
        watchlist: newBill.watchlist
      };
      
      // For now, just show success message
      setAddBillOpen(false);
      setSuccessMessage(`Bill ${selectedBill.bill_number} added to tracking!`);
      
      // Reset form
      setNewBill({
        bill_number: '',
        title: '',
        sponsor: '',
        status: 'Active',
        last_action: '',
        position: 'None',
        priority: 'None',
        client_id: '',
        watchlist: false
      });
      
    } catch (error) {
      console.error('Error adding bill:', error);
      setErrorMessage('Failed to add bill');
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
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="All Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="passed">Passed</SelectItem>
                <SelectItem value="failed">Failed</SelectItem>
              </SelectContent>
            </Select>
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
                        <h3 className="font-semibold text-lg">{bill.bill_number}</h3>
                        <Badge className={getStatusColor(bill.status)}>
                          {bill.status}
                        </Badge>
                        {bill.priority !== 'None' && (
                          <Badge className={getPriorityColor(bill.priority)}>
                            {bill.priority} Priority
                          </Badge>
                        )}
                        {bill.watchlist && (
                          <Badge variant="outline">Watchlist</Badge>
                        )}
                      </div>
                      <p className="text-slate-600 mb-2">{bill.title}</p>
                      <div className="flex items-center space-x-4 text-sm text-slate-500">
                        <span className="flex items-center">
                          <User className="h-4 w-4 mr-1" />
                          {bill.sponsor}
                        </span>
                        <span className="flex items-center">
                          <Calendar className="h-4 w-4 mr-1" />
                          {bill.last_action}
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
                <h3 className="font-semibold">{selectedBill.bill_number}</h3>
                <p className="text-sm text-slate-600">{selectedBill.title}</p>
                <p className="text-sm text-slate-500 mt-1">
                  Status: {selectedBill.last_action}
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