"use client";

import { useState, useEffect } from 'react';
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
  Star, 
  AlertCircle, 
  CheckCircle, 
  Loader2, 
  Users, 
  ArrowRight,
  Edit,
  Trash2,
  Eye,
  Calendar,
  Building2,
  TrendingUp,
  Filter
} from 'lucide-react';
import { billsDataService, clientsDataService } from '@/lib/database';
import Link from 'next/link';
import type { Bill, Client } from '@/lib/supabase';

export default function MyBillsPage() {
  const [bills, setBills] = useState<Bill[]>([]);
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [priorityFilter, setPriorityFilter] = useState('all');
  const [clientFilter, setClientFilter] = useState('all');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [editBillOpen, setEditBillOpen] = useState(false);
  const [selectedBill, setSelectedBill] = useState<Bill | null>(null);
  const [editForm, setEditForm] = useState({
    position: 'None' as 'Support' | 'Monitor' | 'Oppose' | 'None' | 'Hypothetical',
    priority: 'None' as 'High' | 'Medium' | 'Low' | 'None',
    client_id: '',
    watchlist: false,
    notes: ''
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const [billsData, clientsData] = await Promise.all([
        billsDataService.getAll(),
        clientsDataService.getAll()
      ]);
      setBills(billsData);
      setClients(clientsData);
    } catch (error) {
      console.error('Error loading data:', error);
      setErrorMessage('Failed to load bills');
    } finally {
      setLoading(false);
    }
  };

  const handleEditBill = (bill: Bill) => {
    setSelectedBill(bill);
    setEditForm({
      position: bill.position || 'None',
      priority: bill.priority || 'None',
      client_id: bill.client_id || '',
      watchlist: bill.watchlist || false,
      notes: bill.notes || ''
    });
    setEditBillOpen(true);
  };

  const handleSaveBill = async () => {
    if (!selectedBill) return;

    try {
      setLoading(true);
      await billsDataService.update(selectedBill.id, {
        position: editForm.position,
        priority: editForm.priority,
        client_id: editForm.client_id || undefined,
        watchlist: editForm.watchlist,
        notes: editForm.notes
      });
      
      setEditBillOpen(false);
      setSuccessMessage('Bill updated successfully!');
      loadData();
    } catch (error) {
      console.error('Error updating bill:', error);
      setErrorMessage('Failed to update bill');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteBill = async (id: string) => {
    if (confirm('Are you sure you want to delete this bill from your tracking?')) {
      try {
        setLoading(true);
        await billsDataService.delete(id);
        setSuccessMessage('Bill removed from tracking!');
        loadData();
      } catch (error) {
        console.error('Error deleting bill:', error);
        setErrorMessage('Failed to delete bill');
      } finally {
        setLoading(false);
      }
    }
  };

  const handleToggleWatchlist = async (id: string, currentWatchlist: boolean) => {
    try {
      await billsDataService.toggleWatchlist(id, !currentWatchlist);
      setSuccessMessage(`Bill ${!currentWatchlist ? 'added to' : 'removed from'} watchlist!`);
      loadData();
    } catch (error) {
      console.error('Error toggling watchlist:', error);
      setErrorMessage('Failed to update watchlist');
    }
  };

  const handleUpdatePriority = async (id: string, priority: string) => {
    try {
      await billsDataService.updatePriority(id, priority as 'High' | 'Medium' | 'Low' | 'None');
      setSuccessMessage('Priority updated successfully!');
      loadData();
    } catch (error) {
      console.error('Error updating priority:', error);
      setErrorMessage('Failed to update priority');
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

  const getPositionColor = (position: string) => {
    switch (position.toLowerCase()) {
      case 'support': return 'bg-green-100 text-green-800';
      case 'oppose': return 'bg-red-100 text-red-800';
      case 'monitor': return 'bg-blue-100 text-blue-800';
      case 'hypothetical': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const filteredBills = bills.filter(bill => {
    const matchesSearch = bill.bill_number.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         bill.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         bill.sponsor.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || bill.status.toLowerCase() === statusFilter.toLowerCase();
    const matchesPriority = priorityFilter === 'all' || bill.priority?.toLowerCase() === priorityFilter.toLowerCase();
    const matchesClient = clientFilter === 'all' || bill.client_id === clientFilter;
    
    return matchesSearch && matchesStatus && matchesPriority && matchesClient;
  });

  const getClientName = (clientId: string | undefined) => {
    if (!clientId) return 'No client';
    const client = clients.find(c => c.id === clientId);
    return client ? client.name : 'Unknown client';
  };

  const actions = (
    <div className="flex items-center space-x-2">
      <Link href="/dashboard/bills/search-simple">
        <Button variant="outline" size="sm">
          <Plus className="h-4 w-4 mr-2" />
          Add Bills
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
      title="My Bills"
      subtitle="Track and manage your legislative bills"
      actions={actions}
    >
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

      {/* Filters */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex items-center">
            <Filter className="h-5 w-5 mr-2" />
            Filters
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <Label htmlFor="search">Search</Label>
              <Input
                id="search"
                placeholder="Search bills..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="status">Status</Label>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="passed">Passed</SelectItem>
                  <SelectItem value="failed">Failed</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="priority">Priority</Label>
              <Select value={priorityFilter} onValueChange={setPriorityFilter}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Priority</SelectItem>
                  <SelectItem value="high">High</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="low">Low</SelectItem>
                  <SelectItem value="none">None</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="client">Client</Label>
              <Select value={clientFilter} onValueChange={setClientFilter}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Clients</SelectItem>
                  <SelectItem value="">No Client</SelectItem>
                  {clients.map((client) => (
                    <SelectItem key={client.id} value={client.id}>
                      {client.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Bills List */}
      <Card>
        <CardHeader>
          <CardTitle>Tracked Bills ({filteredBills.length})</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="h-8 w-8 animate-spin mr-2" />
              <span>Loading bills...</span>
            </div>
          ) : filteredBills.length === 0 ? (
            <div className="text-center py-8">
              <FileText className="h-12 w-12 mx-auto text-gray-400 mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No bills found</h3>
              <p className="text-gray-500 mb-4">
                {searchTerm || statusFilter !== 'all' || priorityFilter !== 'all' || clientFilter !== 'all'
                  ? 'Try adjusting your filters'
                  : 'Start by adding bills to track'
                }
              </p>
              <Link href="/dashboard/bills/search-simple">
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Bills
                </Button>
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredBills.map((bill) => (
                <div key={bill.id} className="border rounded-lg p-4 hover:bg-slate-50">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h3 className="font-semibold text-lg">{bill.bill_number}</h3>
                        <Badge className={getStatusColor(bill.status)}>
                          {bill.status}
                        </Badge>
                        {bill.priority && bill.priority !== 'None' && (
                          <Badge className={getPriorityColor(bill.priority)}>
                            {bill.priority} Priority
                          </Badge>
                        )}
                        {bill.position && bill.position !== 'None' && (
                          <Badge className={getPositionColor(bill.position)}>
                            {bill.position}
                          </Badge>
                        )}
                        {bill.watchlist && (
                          <Badge variant="outline" className="text-yellow-600">
                            <Star className="h-3 w-3 mr-1" />
                            Watchlist
                          </Badge>
                        )}
                      </div>
                      <p className="text-slate-600 mb-2">{bill.title}</p>
                      <div className="flex items-center gap-4 text-sm text-slate-500 mb-2">
                        <span className="flex items-center">
                          <Users className="h-4 w-4 mr-1" />
                          {bill.sponsor}
                        </span>
                        <span className="flex items-center">
                          <Calendar className="h-4 w-4 mr-1" />
                          {bill.last_action}
                        </span>
                        <span className="flex items-center">
                          <Building2 className="h-4 w-4 mr-1" />
                          {getClientName(bill.client_id)}
                        </span>
                      </div>
                      {bill.notes && (
                        <p className="text-sm text-slate-600 bg-slate-50 p-2 rounded">
                          <strong>Notes:</strong> {bill.notes}
                        </p>
                      )}
                    </div>
                    <div className="flex items-center space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleEditBill(bill)}
                      >
                        <Edit className="h-4 w-4 mr-1" />
                        Edit
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleToggleWatchlist(bill.id, bill.watchlist || false)}
                      >
                        <Star className={`h-4 w-4 mr-1 ${bill.watchlist ? 'text-yellow-500' : ''}`} />
                        {bill.watchlist ? 'Unwatch' : 'Watch'}
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDeleteBill(bill.id)}
                      >
                        <Trash2 className="h-4 w-4 mr-1" />
                        Remove
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Edit Bill Modal */}
      <Dialog open={editBillOpen} onOpenChange={setEditBillOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Bill Tracking</DialogTitle>
          </DialogHeader>
          {selectedBill && (
            <div className="space-y-4">
              <div className="bg-slate-50 p-4 rounded-lg">
                <h3 className="font-semibold">{selectedBill.bill_number}</h3>
                <p className="text-sm text-slate-600">{selectedBill.title}</p>
                <p className="text-sm text-slate-500 mt-1">
                  Sponsor: {selectedBill.sponsor}
                </p>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="position">Position</Label>
                  <Select value={editForm.position} onValueChange={(value: any) => setEditForm({...editForm, position: value})}>
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
                  <Select value={editForm.priority} onValueChange={(value: any) => setEditForm({...editForm, priority: value})}>
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
                <Label htmlFor="client_id">Client</Label>
                <Select value={editForm.client_id} onValueChange={(value) => setEditForm({...editForm, client_id: value})}>
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
              
              <div>
                <Label htmlFor="notes">Notes</Label>
                <Input
                  id="notes"
                  placeholder="Add notes about this bill..."
                  value={editForm.notes}
                  onChange={(e) => setEditForm({...editForm, notes: e.target.value})}
                />
              </div>
              
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="watchlist"
                  checked={editForm.watchlist}
                  onChange={(e) => setEditForm({...editForm, watchlist: e.target.checked})}
                  className="rounded"
                />
                <Label htmlFor="watchlist">Add to watchlist</Label>
              </div>
              
              <div className="flex justify-end space-x-2">
                <Button variant="outline" onClick={() => setEditBillOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleSaveBill} disabled={loading}>
                  {loading ? (
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  ) : (
                    <CheckCircle className="h-4 w-4 mr-2" />
                  )}
                  Save Changes
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
}
