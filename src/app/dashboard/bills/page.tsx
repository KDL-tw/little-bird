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
import { DashboardLayout } from '@/components/DashboardLayout';
import { Search, Plus, Star, AlertCircle, CheckCircle, Loader2, Users, ArrowRight } from 'lucide-react';
import Link from 'next/link';

// Hardcoded Colorado Bills Data
const HARDCODED_BILLS = [
  {
    id: '1',
    bill_number: 'HB24-1001',
    title: 'Colorado Energy Storage Tax Credit',
    sponsor: 'Rep. Hansen',
    status: 'Active',
    last_action: 'Passed House Committee',
    position: 'Support',
    priority: 'High',
    watchlist: true,
    client_id: '1',
    notes: 'Strong support from clean energy coalition'
  },
  {
    id: '2',
    bill_number: 'SB24-0123',
    title: 'Renewable Energy Standards Update',
    sponsor: 'Sen. Martinez',
    status: 'Active',
    last_action: 'Introduced',
    position: 'Monitor',
    priority: 'Medium',
    watchlist: false,
    client_id: null,
    notes: 'Watching for amendments'
  },
  {
    id: '3',
    bill_number: 'HB24-2005',
    title: 'Transportation Infrastructure Investment',
    sponsor: 'Rep. Johnson',
    status: 'Passed',
    last_action: 'Signed by Governor',
    position: 'Support',
    priority: 'High',
    watchlist: true,
    client_id: '2',
    notes: 'Major infrastructure win'
  },
  {
    id: '4',
    bill_number: 'SB24-0456',
    title: 'Healthcare Access Expansion',
    sponsor: 'Sen. Williams',
    status: 'Active',
    last_action: 'Senate Floor Vote',
    position: 'Oppose',
    priority: 'High',
    watchlist: true,
    client_id: '1',
    notes: 'Concerns about cost implications'
  },
  {
    id: '5',
    bill_number: 'HB24-1789',
    title: 'Education Funding Reform',
    sponsor: 'Rep. Davis',
    status: 'Active',
    last_action: 'House Committee Hearing',
    position: 'Monitor',
    priority: 'Medium',
    watchlist: false,
    client_id: null,
    notes: 'Waiting for fiscal impact analysis'
  },
  {
    id: '6',
    bill_number: 'SB24-0234',
    title: 'Environmental Protection Act',
    sponsor: 'Sen. Brown',
    status: 'Active',
    last_action: 'Senate Committee Passed',
    position: 'Support',
    priority: 'High',
    watchlist: true,
    client_id: '1',
    notes: 'Aligned with client priorities'
  },
  {
    id: '7',
    bill_number: 'HB24-1567',
    title: 'Small Business Tax Relief',
    sponsor: 'Rep. Wilson',
    status: 'Failed',
    last_action: 'House Vote Failed',
    position: 'Support',
    priority: 'Low',
    watchlist: false,
    client_id: '2',
    notes: 'Will reintroduce next session'
  },
  {
    id: '8',
    bill_number: 'SB24-0789',
    title: 'Criminal Justice Reform',
    sponsor: 'Sen. Garcia',
    status: 'Active',
    last_action: 'Senate Floor Debate',
    position: 'Monitor',
    priority: 'Medium',
    watchlist: true,
    client_id: null,
    notes: 'Complex legislation, monitoring closely'
  },
  {
    id: '9',
    bill_number: 'HB24-2345',
    title: 'Housing Affordability Initiative',
    sponsor: 'Rep. Lee',
    status: 'Active',
    last_action: 'House Committee Hearing',
    position: 'Support',
    priority: 'High',
    watchlist: true,
    client_id: '1',
    notes: 'Critical for housing crisis response'
  },
  {
    id: '10',
    bill_number: 'SB24-0123',
    title: 'Technology Innovation Grant Program',
    sponsor: 'Sen. Taylor',
    status: 'Active',
    last_action: 'Senate Committee Hearing',
    position: 'Support',
    priority: 'Medium',
    watchlist: false,
    client_id: '2',
    notes: 'Potential opportunity for tech clients'
  }
];

const HARDCODED_CLIENTS = [
  { id: '1', name: 'Clean Energy Coalition', type: 'Nonprofit' },
  { id: '2', name: 'Tech Forward', type: 'Industry Group' },
  { id: '3', name: 'Colorado Business Alliance', type: 'Trade Association' }
];

export default function BillsPage() {
  const [bills, setBills] = useState<any[]>([]);
  const [clients, setClients] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [addBillOpen, setAddBillOpen] = useState(false);
  const [editBillOpen, setEditBillOpen] = useState(false);
  const [selectedBill, setSelectedBill] = useState<any>(null);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [newBill, setNewBill] = useState({
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

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      // Use hardcoded data
      setBills([...HARDCODED_BILLS]);
      setClients([...HARDCODED_CLIENTS]);
    } catch (error) {
      console.error('Error loading data:', error);
      setErrorMessage('Failed to load data.');
    } finally {
      setLoading(false);
    }
  };

  const handleAddBill = async () => {
    try {
      setLoading(true);
      // Add new bill to hardcoded data
      const newBillData = {
        id: Date.now().toString(),
        ...newBill
      };
      setBills(prev => [...prev, newBillData]);
      setAddBillOpen(false);
      setSuccessMessage('Bill added successfully!');
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

  const handleDeleteBill = async (id: string) => {
    if (confirm('Are you sure you want to delete this bill?')) {
      try {
        setBills(prev => prev.filter(bill => bill.id !== id));
        setSuccessMessage('Bill deleted successfully!');
      } catch (error) {
        console.error('Error deleting bill:', error);
        setErrorMessage('Failed to delete bill');
      }
    }
  };

  const handleToggleWatchlist = async (id: string, currentWatchlist: boolean) => {
    try {
      setBills(prev => prev.map(bill => 
        bill.id === id ? { ...bill, watchlist: !currentWatchlist } : bill
      ));
      setSuccessMessage(`Bill ${!currentWatchlist ? 'added to' : 'removed from'} watchlist!`);
    } catch (error) {
      console.error('Error toggling watchlist:', error);
      setErrorMessage('Failed to update watchlist');
    }
  };

  const handleUpdatePriority = async (id: string, priority: string) => {
    try {
      setBills(prev => prev.map(bill => 
        bill.id === id ? { ...bill, priority } : bill
      ));
      setSuccessMessage('Priority updated successfully!');
    } catch (error) {
      console.error('Error updating priority:', error);
      setErrorMessage('Failed to update priority');
    }
  };

  const filteredBills = bills.filter(bill =>
    bill.bill_number.toLowerCase().includes(searchTerm.toLowerCase()) ||
    bill.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    bill.sponsor.toLowerCase().includes(searchTerm.toLowerCase())
  );

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

  const getPositionColor = (position: string) => {
    switch (position.toLowerCase()) {
      case 'support': return 'bg-green-100 text-green-800';
      case 'oppose': return 'bg-red-100 text-red-800';
      case 'monitor': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Bills</h1>
            <p className="text-slate-600 mt-1">Track and manage Colorado legislative bills</p>
          </div>
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <Link href="/dashboard/bills/search">
                <Button variant="outline" size="sm">
                  <Search className="h-4 w-4 mr-2" />
                  Search Bills
                </Button>
              </Link>
              <Button onClick={() => setAddBillOpen(true)} size="sm">
                <Plus className="h-4 w-4 mr-2" />
                Add Bill
              </Button>
            </div>
          </div>
        </div>

        {/* Search */}
        <Card>
          <CardHeader>
            <CardTitle>Search Bills</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex gap-4">
              <div className="flex-1">
                <Input
                  placeholder="Search by bill number, title, or sponsor..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Success/Error Messages */}
        {successMessage && (
          <Alert>
            <CheckCircle className="h-4 w-4" />
            <AlertDescription>{successMessage}</AlertDescription>
          </Alert>
        )}
        {errorMessage && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{errorMessage}</AlertDescription>
          </Alert>
        )}

        {/* Bills List */}
        <Card>
          <CardHeader>
            <CardTitle>Bills ({filteredBills.length})</CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="h-8 w-8 animate-spin" />
              </div>
            ) : filteredBills.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-slate-500">No bills found matching your search.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {filteredBills.map((bill) => (
                  <div key={bill.id} className="border rounded-lg p-4 hover:bg-slate-50">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-2">
                          <h3 className="font-semibold text-lg">{bill.bill_number}</h3>
                          <Badge className={getStatusColor(bill.status)}>
                            {bill.status}
                          </Badge>
                          <Badge className={getPriorityColor(bill.priority)}>
                            {bill.priority} Priority
                          </Badge>
                          <Badge className={getPositionColor(bill.position)}>
                            {bill.position}
                          </Badge>
                        </div>
                        <p className="text-slate-700 mb-2">{bill.title}</p>
                        <p className="text-sm text-slate-500 mb-2">
                          Sponsor: {bill.sponsor} • Last Action: {bill.last_action}
                        </p>
                        {bill.notes && (
                          <p className="text-sm text-slate-600 italic">"{bill.notes}"</p>
                        )}
                      </div>
                      <div className="flex items-center space-x-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleToggleWatchlist(bill.id, bill.watchlist)}
                        >
                          <Star className={`h-4 w-4 ${bill.watchlist ? 'fill-yellow-400 text-yellow-400' : ''}`} />
                        </Button>
                        <Select
                          value={bill.priority}
                          onValueChange={(value) => handleUpdatePriority(bill.id, value)}
                        >
                          <SelectTrigger className="w-32">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="None">None</SelectItem>
                            <SelectItem value="Low">Low</SelectItem>
                            <SelectItem value="Medium">Medium</SelectItem>
                            <SelectItem value="High">High</SelectItem>
                          </SelectContent>
                        </Select>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDeleteBill(bill.id)}
                        >
                          Delete
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Add Bill Dialog */}
        <Dialog open={addBillOpen} onOpenChange={setAddBillOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Bill</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="bill_number">Bill Number</Label>
                <Input
                  id="bill_number"
                  value={newBill.bill_number}
                  onChange={(e) => setNewBill({ ...newBill, bill_number: e.target.value })}
                  placeholder="e.g., HB24-1001"
                />
              </div>
              <div>
                <Label htmlFor="title">Title</Label>
                <Input
                  id="title"
                  value={newBill.title}
                  onChange={(e) => setNewBill({ ...newBill, title: e.target.value })}
                  placeholder="Bill title"
                />
              </div>
              <div>
                <Label htmlFor="sponsor">Sponsor</Label>
                <Input
                  id="sponsor"
                  value={newBill.sponsor}
                  onChange={(e) => setNewBill({ ...newBill, sponsor: e.target.value })}
                  placeholder="e.g., Rep. Smith"
                />
              </div>
              <div className="flex space-x-4">
                <div className="flex-1">
                  <Label htmlFor="position">Position</Label>
                  <Select
                    value={newBill.position}
                    onValueChange={(value) => setNewBill({ ...newBill, position: value })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="None">None</SelectItem>
                      <SelectItem value="Support">Support</SelectItem>
                      <SelectItem value="Oppose">Oppose</SelectItem>
                      <SelectItem value="Monitor">Monitor</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex-1">
                  <Label htmlFor="priority">Priority</Label>
                  <Select
                    value={newBill.priority}
                    onValueChange={(value) => setNewBill({ ...newBill, priority: value })}
                  >
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
              </div>
              <div className="flex justify-end space-x-2">
                <Button variant="outline" onClick={() => setAddBillOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleAddBill}>
                  Add Bill
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </DashboardLayout>
  );
}