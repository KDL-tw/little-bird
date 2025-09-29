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
import { billsService, clientsService } from '@/lib/database';
import { useAuth } from '@/contexts/AuthContext';
import { ProtectedRoute } from '@/components/ProtectedRoute';
import Link from 'next/link';
import type { Bill, Client } from '@/lib/supabase';

export default function BillsPage() {
  const { user } = useAuth();
  const [bills, setBills] = useState<Bill[]>([]);
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [addBillOpen, setAddBillOpen] = useState(false);
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
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    loadBills();
    loadClients();
  }, []);

  const loadBills = async () => {
    try {
      setLoading(true);
      const data = await billsService.getAll();
      setBills(data);
    } catch (error) {
      console.error('Error loading bills:', error);
      setErrorMessage('Failed to load bills');
    } finally {
      setLoading(false);
    }
  };

  const loadClients = async () => {
    try {
      const data = await clientsService.getAll();
      setClients(data);
    } catch (error) {
      console.error('Error loading clients:', error);
    }
  };

  const handleAddBill = async () => {
    try {
      setLoading(true);
      await billsService.create(newBill);
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
      loadBills();
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
        await billsService.delete(id);
        setSuccessMessage('Bill deleted successfully!');
        loadBills();
      } catch (error) {
        console.error('Error deleting bill:', error);
        setErrorMessage('Failed to delete bill');
      }
    }
  };

  const handleToggleWatchlist = async (id: string, currentWatchlist: boolean) => {
    try {
      await billsService.toggleWatchlist(id, !currentWatchlist);
      setSuccessMessage(`Bill ${!currentWatchlist ? 'added to' : 'removed from'} watchlist!`);
      loadBills();
    } catch (error) {
      console.error('Error toggling watchlist:', error);
      setErrorMessage('Failed to update watchlist');
    }
  };

  const handleUpdatePriority = async (id: string, priority: string) => {
    try {
      await billsService.updatePriority(id, priority as 'High' | 'Medium' | 'Low' | 'None');
      setSuccessMessage('Priority updated successfully!');
      loadBills();
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
      case 'monitor': return 'bg-blue-100 text-blue-800';
      case 'hypothetical': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const actions = (
    <div className="flex items-center space-x-2">
      <Link href="/dashboard/bills/search">
        <Button variant="outline" size="sm">
          <Search className="h-4 w-4 mr-2" />
          Search Bills
        </Button>
      </Link>
      <Button size="sm" onClick={() => setAddBillOpen(true)}>
        <Plus className="h-4 w-4 mr-2" />
        Add Bill
      </Button>
    </div>
  );

  return (
    <DashboardLayout
      title="Bills"
      subtitle="Track and manage Colorado legislative bills"
      actions={actions}
    >
      {/* Messages */}
      {successMessage && (
        <Alert className="mb-6">
          <CheckCircle className="h-4 w-4" />
          <AlertDescription>{successMessage}</AlertDescription>
        </Alert>
      )}

      {errorMessage && (
        <Alert className="mb-6" variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{errorMessage}</AlertDescription>
        </Alert>
      )}

      {/* Search and Filters */}
      <Card className="mb-6">
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

      {/* Bills Table */}
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
            <div className="text-center py-8 text-slate-500">
              No bills found. {searchTerm && 'Try adjusting your search terms.'}
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
                        {bill.priority !== 'None' && (
                          <Badge className={getPriorityColor(bill.priority)}>
                            {bill.priority} Priority
                          </Badge>
                        )}
                        {bill.position !== 'None' && (
                          <Badge className={getPositionColor(bill.position)}>
                            {bill.position}
                          </Badge>
                        )}
                        {bill.watchlist && (
                          <Badge variant="outline">Watchlist</Badge>
                        )}
                      </div>
                      <p className="text-slate-600 mb-2">{bill.title}</p>
                      <div className="flex items-center space-x-4 text-sm text-slate-500">
                        <span>Sponsor: {bill.sponsor}</span>
                        <span>Last Action: {bill.last_action}</span>
                        {bill.client_id && (
                          <span>Client: {clients.find(c => c.id === bill.client_id)?.name || 'Unknown'}</span>
                        )}
                      </div>
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
                        <SelectTrigger className="w-24">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="None">None</SelectItem>
                          <SelectItem value="High">High</SelectItem>
                          <SelectItem value="Medium">Medium</SelectItem>
                          <SelectItem value="Low">Low</SelectItem>
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

      {/* Add Bill Modal */}
      <Dialog open={addBillOpen} onOpenChange={setAddBillOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add New Bill</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="bill_number">Bill Number</Label>
                <Input
                  id="bill_number"
                  value={newBill.bill_number}
                  onChange={(e) => setNewBill({...newBill, bill_number: e.target.value})}
                  placeholder="e.g., HB24-1001"
                />
              </div>
              <div>
                <Label htmlFor="sponsor">Sponsor</Label>
                <Input
                  id="sponsor"
                  value={newBill.sponsor}
                  onChange={(e) => setNewBill({...newBill, sponsor: e.target.value})}
                  placeholder="e.g., Rep. Smith"
                />
              </div>
            </div>
            
            <div>
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                value={newBill.title}
                onChange={(e) => setNewBill({...newBill, title: e.target.value})}
                placeholder="Bill title"
              />
            </div>
            
            <div>
              <Label htmlFor="last_action">Last Action</Label>
              <Input
                id="last_action"
                value={newBill.last_action}
                onChange={(e) => setNewBill({...newBill, last_action: e.target.value})}
                placeholder="e.g., Introduced in House"
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="status">Status</Label>
                <Select value={newBill.status} onValueChange={(value: any) => setNewBill({...newBill, status: value})}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Active">Active</SelectItem>
                    <SelectItem value="Passed">Passed</SelectItem>
                    <SelectItem value="Failed">Failed</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
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
            </div>
            
            <div className="grid grid-cols-2 gap-4">
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
              
              <div>
                <Label htmlFor="client_id">Client</Label>
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
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
}