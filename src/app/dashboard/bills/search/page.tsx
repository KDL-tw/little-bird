"use client";

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
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
import { billsService, clientsService } from '@/lib/database';
import { useAuth } from '@/contexts/AuthContext';
import { ProtectedRoute } from '@/components/ProtectedRoute';

interface OpenStatesBill {
  id: string;
  identifier: string;
  title: string;
  classification: string[];
  subject: string[];
  sponsors: Array<{
    name: string;
    classification: string;
  }>;
  actions: Array<{
    date: string;
    description: string;
    classification: string[];
  }>;
  session: string;
  state: string;
  created_at: string;
  updated_at: string;
}

export default function BillSearchPage() {
  const { user } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState<OpenStatesBill[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedBill, setSelectedBill] = useState<OpenStatesBill | null>(null);
  const [addBillOpen, setAddBillOpen] = useState(false);
  const [clients, setClients] = useState<any[]>([]);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Form for adding bill to tracking
  const [newBill, setNewBill] = useState({
    bill_number: '',
    title: '',
    sponsor: '',
    status: 'Active' as 'Active' | 'Passed' | 'Failed',
    last_action: '',
    position: 'None' as 'Support' | 'Monitor' | 'Oppose' | 'None' | 'Hypothetical',
    priority: 'None' as 'High' | 'Medium' | 'Low' | 'None',
    client_id: '',
    watchlist: false
  });

  useEffect(() => {
    loadClients();
  }, []);

  const loadClients = async () => {
    try {
      const clientsData = await clientsService.getAll();
      setClients(clientsData);
    } catch (error) {
      console.error('Error loading clients:', error);
    }
  };

  const searchBills = async () => {
    // Allow empty search to get recent bills
    const query = searchTerm.trim() || 'recent';
    
    try {
      setLoading(true);
      setErrorMessage(null);
      
      const response = await fetch(`/api/openstates/bills?q=${encodeURIComponent(query)}&state=co&session=2024`);
      const data = await response.json();
      
      console.log('Search response:', data);
      
      if (data.success && data.data && data.data.length > 0) {
        setSearchResults(data.data);
      } else {
        setSearchResults([]);
        setErrorMessage(data.error || 'No bills found matching your search');
      }
    } catch (error) {
      console.error('Error searching bills:', error);
      setErrorMessage('Failed to search bills');
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
        sponsor: selectedBill.sponsors[0]?.name || 'Unknown',
        status: 'Active' as 'Active' | 'Passed' | 'Failed',
        last_action: selectedBill.actions[0]?.description || 'Introduced',
        position: newBill.position,
        priority: newBill.priority,
        client_id: newBill.client_id || undefined,
        watchlist: newBill.watchlist
      };
      
      const bill = await billsService.create(billData);
      setAddBillOpen(false);
      setSuccessMessage(`Bill ${selectedBill.identifier} added to tracking!`);
      
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
      setErrorMessage('Failed to add bill to tracking');
    } finally {
      setLoading(false);
    }
  };

  const openAddBillModal = (bill: OpenStatesBill) => {
    setSelectedBill(bill);
    setNewBill(prev => ({
      ...prev,
      bill_number: bill.identifier,
      title: bill.title,
      sponsor: bill.sponsors[0]?.name || 'Unknown',
      last_action: bill.actions[0]?.description || 'Introduced'
    }));
    setAddBillOpen(true);
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'passed': return 'bg-green-100 text-green-800 border-green-200';
      case 'failed': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-blue-100 text-blue-800 border-blue-200';
    }
  };

  return (
    <ProtectedRoute>
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
                <h1 className="text-3xl font-bold text-slate-900">Search Colorado Bills</h1>
                <p className="text-slate-600 mt-1">Find bills from OpenStates to add to your tracking (Updated)</p>
              </div>
            </div>
          </div>

          {/* Alerts */}
          {successMessage && (
            <Alert className="mb-4 bg-green-50 border-green-200 text-green-800">
              <CheckCircle className="h-4 w-4" />
              <AlertDescription>{successMessage}</AlertDescription>
            </Alert>
          )}
          {errorMessage && (
            <Alert className="mb-4 bg-red-50 border-red-200 text-red-800">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{errorMessage}</AlertDescription>
            </Alert>
          )}

          {/* Search Form */}
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Search Colorado Legislature</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex space-x-4">
                <div className="flex-1">
                  <Label htmlFor="search">Search Bills</Label>
                  <Input
                    id="search"
                    placeholder="Search by bill number, title, or keywords..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && searchBills()}
                  />
                </div>
                <div className="flex items-end space-x-2">
                  <Button 
                    onClick={searchBills}
                    disabled={loading}
                    className="bg-indigo-600 hover:bg-indigo-700"
                  >
                    {loading ? (
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
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
              </div>
            </CardContent>
          </Card>

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
                          <div className="flex items-center space-x-3 mb-2">
                            <Badge variant="outline" className="font-mono">
                              {bill.identifier}
                            </Badge>
                            <Badge className={getStatusColor(bill.classification[0] || 'active')}>
                              {bill.classification[0] || 'Active'}
                            </Badge>
                            <span className="text-sm text-slate-500">
                              Session {bill.session}
                            </span>
                          </div>
                          
                          <h3 className="font-semibold text-slate-900 mb-2">{bill.title}</h3>
                          
                          <div className="space-y-1 text-sm text-slate-600">
                            {bill.sponsors.length > 0 && (
                              <div className="flex items-center space-x-2">
                                <User className="h-4 w-4" />
                                <span>
                                  {bill.sponsors.map(s => s.name).join(', ')}
                                </span>
                              </div>
                            )}
                            
                            {bill.actions.length > 0 && (
                              <div className="flex items-center space-x-2">
                                <Calendar className="h-4 w-4" />
                                <span>{bill.actions[0].description}</span>
                                <span className="text-slate-400">
                                  ({new Date(bill.actions[0].date).toLocaleDateString()})
                                </span>
                              </div>
                            )}
                            
                            {bill.subject.length > 0 && (
                              <div className="flex items-center space-x-2">
                                <FileText className="h-4 w-4" />
                                <span>{bill.subject.join(', ')}</span>
                              </div>
                            )}
                          </div>
                        </div>
                        
                        <div className="flex space-x-2 ml-4">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => window.open(`https://leg.colorado.gov/bills/${bill.identifier}`, '_blank')}
                          >
                            <ExternalLink className="h-4 w-4 mr-2" />
                            View Official
                          </Button>
                          <Button
                            size="sm"
                            onClick={() => openAddBillModal(bill)}
                            className="bg-indigo-600 hover:bg-indigo-700"
                          >
                            <Plus className="h-4 w-4 mr-2" />
                            Track Bill
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
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Add Bill to Tracking</DialogTitle>
              </DialogHeader>
              {selectedBill && (
                <div className="space-y-4">
                  <div className="bg-slate-50 p-4 rounded-lg">
                    <h3 className="font-semibold">{selectedBill.identifier}</h3>
                    <p className="text-sm text-slate-600">{selectedBill.title}</p>
                    <p className="text-sm text-slate-500 mt-1">
                      Sponsor: {selectedBill.sponsors[0]?.name || 'Unknown'}
                    </p>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="position">Position</Label>
                      <Select value={newBill.position} onValueChange={(value: any) => setNewBill(prev => ({ ...prev, position: value }))}>
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
                      <Select value={newBill.priority} onValueChange={(value: any) => setNewBill(prev => ({ ...prev, priority: value }))}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="None">None</SelectItem>
                          <SelectItem value="Low">Low</SelectItem>
                          <SelectItem value="Medium">Medium</SelectItem>
                          <SelectItem value="High">High</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div>
                      <Label htmlFor="client">Client</Label>
                      <Select value={newBill.client_id} onValueChange={(value) => setNewBill(prev => ({ ...prev, client_id: value }))}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select client" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="">No client</SelectItem>
                          {clients.map(client => (
                            <SelectItem key={client.id} value={client.id}>{client.name}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        id="watchlist"
                        checked={newBill.watchlist}
                        onChange={(e) => setNewBill(prev => ({ ...prev, watchlist: e.target.checked }))}
                        className="rounded"
                      />
                      <Label htmlFor="watchlist">Add to Watchlist</Label>
                    </div>
                  </div>
                  
                  <div className="flex justify-end space-x-2">
                    <Button variant="outline" onClick={() => setAddBillOpen(false)}>
                      Cancel
                    </Button>
                    <Button 
                      onClick={handleAddBill}
                      disabled={loading}
                      className="bg-indigo-600 hover:bg-indigo-700"
                    >
                      {loading ? (
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      ) : (
                        <Plus className="h-4 w-4 mr-2" />
                      )}
                      Add to Tracking
                    </Button>
                  </div>
                </div>
              )}
            </DialogContent>
          </Dialog>
        </div>
      </div>
    </ProtectedRoute>
  );
}
