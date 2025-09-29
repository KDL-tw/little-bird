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
import { Search, Plus, Star, AlertCircle, CheckCircle, Loader2, Users } from 'lucide-react';
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
    status: 'Active',
    position: 'None',
    priority: 'None',
    client_id: '',
    last_action: ''
  });
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [billsData, clientsData] = await Promise.all([
        billsService.getAll(),
        clientsService.getAll()
      ]);
      setBills(billsData);
      setClients(clientsData);
    } catch (error) {
      console.error('Error loading data:', error);
      setErrorMessage('Failed to load data');
    } finally {
      setLoading(false);
    }
  };

  const handleAddBill = async () => {
    try {
      setActionLoading('add-bill');
      const bill = await billsService.create(newBill);
      setBills(prev => [bill, ...prev]);
      setNewBill({
        bill_number: '',
        title: '',
        sponsor: '',
        status: 'Active',
        position: 'None',
        priority: 'None',
        client_id: '',
        last_action: ''
      });
      setAddBillOpen(false);
      setSuccessMessage('Bill added successfully!');
    } catch (error) {
      console.error('Error adding bill:', error);
      setErrorMessage('Failed to add bill');
    } finally {
      setActionLoading(null);
    }
  };

  const handleExtractSponsors = async (bill: Bill) => {
    try {
      setActionLoading(bill.id);
      
      // First, get the bill sponsors from OpenStates
      const response = await fetch(`/api/openstates/bill-sponsors?bill_id=${bill.id}`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch bill sponsors');
      }
      
      const data = await response.json();
      
      if (!data.success) {
        throw new Error(data.error);
      }
      
      // Add sponsors to legislator database
      const addResponse = await fetch('/api/legislators/add-from-bill', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ billId: bill.id }),
      });
      
      if (!addResponse.ok) {
        throw new Error('Failed to add sponsors to database');
      }
      
      const addData = await addResponse.json();
      
      if (addData.success) {
        setSuccessMessage(
          `Extracted ${addData.addedCount} new legislators from ${bill.bill_number}. ` +
          `${addData.skippedCount} were already in the database.`
        );
      } else {
        throw new Error(addData.error);
      }
      
    } catch (error) {
      console.error('Error extracting sponsors:', error);
      setErrorMessage('Failed to extract sponsors from bill');
    } finally {
      setActionLoading(null);
    }
  };

  const filteredBills = bills.filter(bill => {
    const matchesSearch = bill.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         bill.bill_number.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         bill.sponsor.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesSearch;
  });

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'High': return 'bg-red-100 text-red-800 border-red-200';
      case 'Medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'Low': return 'bg-green-100 text-green-800 border-green-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Active': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'Passed': return 'bg-green-100 text-green-800 border-green-200';
      case 'Failed': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-indigo-600" />
      </div>
    );
  }

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-slate-50 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold text-slate-900">Bills</h1>
              <p className="text-slate-600 mt-1">Track and manage legislative bills</p>
            </div>
            <div className="flex items-center space-x-3">
              <Link href="/dashboard/bills/search">
                <Button variant="outline">
                  <Search className="h-4 w-4 mr-2" />
                  Search Bills
                </Button>
              </Link>
              <Dialog open={addBillOpen} onOpenChange={setAddBillOpen}>
                <DialogTrigger asChild>
                  <Button className="bg-indigo-600 hover:bg-indigo-700">
                    <Plus className="h-4 w-4 mr-2" />
                    Add Bill
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl">
                  <DialogHeader>
                    <DialogTitle>Add New Bill</DialogTitle>
                  </DialogHeader>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="bill_number">Bill Number</Label>
                      <Input
                        id="bill_number"
                        value={newBill.bill_number}
                        onChange={(e) => setNewBill(prev => ({ ...prev, bill_number: e.target.value }))}
                        placeholder="e.g., HB24-1001"
                      />
                    </div>
                    <div>
                      <Label htmlFor="sponsor">Sponsor</Label>
                      <Input
                        id="sponsor"
                        value={newBill.sponsor}
                        onChange={(e) => setNewBill(prev => ({ ...prev, sponsor: e.target.value }))}
                        placeholder="e.g., Rep. John Doe"
                      />
                    </div>
                    <div className="col-span-2">
                      <Label htmlFor="title">Title</Label>
                      <Input
                        id="title"
                        value={newBill.title}
                        onChange={(e) => setNewBill(prev => ({ ...prev, title: e.target.value }))}
                        placeholder="Bill title"
                      />
                    </div>
                    <div>
                      <Label htmlFor="status">Status</Label>
                      <Select value={newBill.status} onValueChange={(value: any) => setNewBill(prev => ({ ...prev, status: value }))}>
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
                    <div className="col-span-2">
                      <Label htmlFor="last_action">Last Action</Label>
                      <Input
                        id="last_action"
                        value={newBill.last_action}
                        onChange={(e) => setNewBill(prev => ({ ...prev, last_action: e.target.value }))}
                        placeholder="e.g., Passed House Committee"
                      />
                    </div>
                  </div>
                  <div className="flex justify-end space-x-2 mt-6">
                    <Button variant="outline" onClick={() => setAddBillOpen(false)}>
                      Cancel
                    </Button>
                    <Button 
                      onClick={handleAddBill}
                      disabled={!newBill.bill_number || !newBill.title || actionLoading === 'add-bill'}
                      className="bg-indigo-600 hover:bg-indigo-700"
                    >
                      {actionLoading === 'add-bill' ? (
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      ) : (
                        <Plus className="h-4 w-4 mr-2" />
                      )}
                      Add Bill
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          </div>

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

          <Card className="mb-6">
            <CardContent className="p-6">
              <Input
                placeholder="Search bills..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full"
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>Bills ({filteredBills.length})</span>
                <div className="flex items-center text-sm text-slate-500">
                  <Star className="h-4 w-4 mr-1" />
                  <span>{bills.filter(b => b.watchlist).length} on watchlist</span>
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-slate-200">
                      <th className="text-left py-3 px-4 font-medium text-slate-700">Bill</th>
                      <th className="text-left py-3 px-4 font-medium text-slate-700">Sponsor</th>
                      <th className="text-left py-3 px-4 font-medium text-slate-700">Status</th>
                      <th className="text-left py-3 px-4 font-medium text-slate-700">Position</th>
                      <th className="text-left py-3 px-4 font-medium text-slate-700">Priority</th>
                      <th className="text-left py-3 px-4 font-medium text-slate-700">Client</th>
                      <th className="text-left py-3 px-4 font-medium text-slate-700">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredBills.map((bill) => (
                      <tr key={bill.id} className="border-b border-slate-100 hover:bg-slate-50">
                        <td className="py-4 px-4">
                          <div className="flex items-center space-x-2">
                            <span className="font-mono text-sm font-medium">{bill.bill_number}</span>
                            {bill.watchlist && <Star className="h-4 w-4 text-yellow-500 fill-current" />}
                          </div>
                          <div className="mt-1">
                            <p className="text-sm font-medium text-slate-900 truncate">{bill.title}</p>
                            <p className="text-xs text-slate-500">{bill.last_action}</p>
                          </div>
                        </td>
                        <td className="py-4 px-4">
                          <span className="text-sm text-slate-700">{bill.sponsor}</span>
                        </td>
                        <td className="py-4 px-4">
                          <Badge className={getStatusColor(bill.status)}>
                            {bill.status}
                          </Badge>
                        </td>
                        <td className="py-4 px-4">
                          <Badge className="bg-gray-100 text-gray-800 border-gray-200">
                            {bill.position}
                          </Badge>
                        </td>
                        <td className="py-4 px-4">
                          <Badge className={getPriorityColor(bill.priority)}>
                            {bill.priority}
                          </Badge>
                        </td>
                        <td className="py-4 px-4">
                          <span className="text-sm text-slate-700">
                            {bill.client_id ? clients.find(c => c.id === bill.client_id)?.name || 'Unknown' : 'No client'}
                          </span>
                        </td>
                        <td className="py-4 px-4">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleExtractSponsors(bill)}
                            disabled={actionLoading === bill.id}
                            className="text-indigo-600 hover:text-indigo-700"
                          >
                            {actionLoading === bill.id ? (
                              <Loader2 className="h-4 w-4 animate-spin" />
                            ) : (
                              <Users className="h-4 w-4 mr-1" />
                            )}
                            Extract Sponsors
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </ProtectedRoute>
  );
}
