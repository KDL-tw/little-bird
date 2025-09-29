"use client";

import { useState, useEffect, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  Search, 
  Plus, 
  Star, 
  Eye, 
  EyeOff, 
  FileText, 
  Users, 
  AlertCircle,
  CheckCircle,
  Loader2,
  Sparkles,
  Filter,
  SortAsc,
  SortDesc
} from 'lucide-react';
import { billsService, billNotesService, clientsService, userActionsService } from '@/lib/database';
import { useAuth } from '@/contexts/AuthContext';
import { ProtectedRoute } from '@/components/ProtectedRoute';
import type { Bill, BillNote, Client } from '@/lib/supabase';

export default function BillsPage() {
  const { user } = useAuth();
  const [bills, setBills] = useState<Bill[]>([]);
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('All');
  const [priorityFilter, setPriorityFilter] = useState<string>('All');
  const [watchlistFilter, setWatchlistFilter] = useState<boolean | null>(null);
  const [sortBy, setSortBy] = useState<'updated_at' | 'bill_number' | 'priority'>('updated_at');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  
  // Modal states
  const [addBillOpen, setAddBillOpen] = useState(false);
  const [notesOpen, setNotesOpen] = useState(false);
  const [selectedBill, setSelectedBill] = useState<Bill | null>(null);
  const [billNotes, setBillNotes] = useState<BillNote[]>([]);
  const [newNote, setNewNote] = useState('');
  const [noteType, setNoteType] = useState<'General' | 'Strategy' | 'Meeting' | 'Update' | 'Analysis'>('General');
  
  // Action states
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Form states for adding bills
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
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const [billsData, clientsData] = await Promise.all([
        billsService.getAll(),
        clientsService.getAll()
      ]);
      setBills(billsData);
      setClients(clientsData);
    } catch (error) {
      console.error('Error loading data:', error);
      setErrorMessage('Failed to load bills data');
    } finally {
      setLoading(false);
    }
  };

  const filteredBills = useMemo(() => {
    let filtered = bills.filter(bill => {
      const matchesSearch = 
        bill.bill_number.toLowerCase().includes(searchTerm.toLowerCase()) ||
        bill.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        bill.sponsor.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesStatus = statusFilter === 'All' || bill.status === statusFilter;
      const matchesPriority = priorityFilter === 'All' || bill.priority === priorityFilter;
      const matchesWatchlist = watchlistFilter === null || bill.watchlist === watchlistFilter;
      
      return matchesSearch && matchesStatus && matchesPriority && matchesWatchlist;
    });

    // Sort bills
    filtered.sort((a, b) => {
      let aValue: any = a[sortBy];
      let bValue: any = b[sortBy];
      
      if (sortBy === 'priority') {
        const priorityOrder = { 'High': 3, 'Medium': 2, 'Low': 1, 'None': 0 };
        aValue = priorityOrder[a.priority];
        bValue = priorityOrder[b.priority];
      }
      
      if (sortOrder === 'asc') {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });

    return filtered;
  }, [bills, searchTerm, statusFilter, priorityFilter, watchlistFilter, sortBy, sortOrder]);

  const handleAddBill = async () => {
    try {
      setActionLoading('add-bill');
      const bill = await billsService.create(newBill);
      setBills(prev => [bill, ...prev]);
      setAddBillOpen(false);
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
      setSuccessMessage('Bill added successfully!');
      
      // Log user action
      if (user?.id) {
        await userActionsService.logAction({
          user_id: user.id,
          action_type: 'create',
          entity_type: 'bill',
          entity_id: bill.id,
          details: { bill_number: bill.bill_number }
        });
      }
    } catch (error) {
      console.error('Error adding bill:', error);
      setErrorMessage('Failed to add bill');
    } finally {
      setActionLoading(null);
    }
  };

  const handleUpdatePriority = async (billId: string, priority: 'High' | 'Medium' | 'Low' | 'None') => {
    try {
      setActionLoading(billId);
      const updatedBill = await billsService.updatePriority(billId, priority);
      setBills(prev => prev.map(bill => bill.id === billId ? updatedBill : bill));
      setSuccessMessage(`Bill priority updated to ${priority}!`);
      
      // Log user action
      if (user?.id) {
        await userActionsService.logAction({
          user_id: user.id,
          action_type: 'update_priority',
          entity_type: 'bill',
          entity_id: billId,
          details: { priority }
        });
      }
    } catch (error) {
      console.error('Error updating priority:', error);
      setErrorMessage('Failed to update priority');
    } finally {
      setActionLoading(null);
    }
  };

  const handleToggleWatchlist = async (billId: string) => {
    try {
      setActionLoading(billId);
      const updatedBill = await billsService.toggleWatchlist(billId);
      setBills(prev => prev.map(bill => bill.id === billId ? updatedBill : bill));
      setSuccessMessage('Bill added to watchlist!');
      
      // Log user action
      if (user?.id) {
        await userActionsService.logAction({
          user_id: user.id,
          action_type: 'toggle_watchlist',
          entity_type: 'bill',
          entity_id: billId,
          details: { watchlist: true }
        });
      }
    } catch (error) {
      console.error('Error updating watchlist:', error);
      setErrorMessage('Failed to update watchlist');
    } finally {
      setActionLoading(null);
    }
  };

  const handleAddNote = async () => {
    if (!selectedBill || !newNote.trim()) return;
    
    try {
      setActionLoading('add-note');
      const note = await billNotesService.create({
        bill_id: selectedBill.id,
        content: newNote,
        author: user?.email || 'Unknown',
        note_type: noteType
      });
      setBillNotes(prev => [note, ...prev]);
      setNewNote('');
      setSuccessMessage('Note added successfully!');
      
      // Log user action
      if (user?.id) {
        await userActionsService.logAction({
          user_id: user.id,
          action_type: 'add_note',
          entity_type: 'bill',
          entity_id: selectedBill.id,
          details: { note_type: noteType }
        });
      }
    } catch (error) {
      console.error('Error adding note:', error);
      setErrorMessage('Failed to add note');
    } finally {
      setActionLoading(null);
    }
  };

  const openNotesModal = async (bill: Bill) => {
    setSelectedBill(bill);
    try {
      const notes = await billNotesService.getByBillId(bill.id);
      setBillNotes(notes);
    } catch (error) {
      console.error('Error loading notes:', error);
      setErrorMessage('Failed to load notes');
    }
    setNotesOpen(true);
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'High': return 'bg-red-100 text-red-800 border-red-200';
      case 'Medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'Low': return 'bg-blue-100 text-blue-800 border-blue-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Active': return 'bg-green-100 text-green-800 border-green-200';
      case 'Passed': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'Failed': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getPositionColor = (position: string) => {
    switch (position) {
      case 'Support': return 'bg-green-100 text-green-800 border-green-200';
      case 'Monitor': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'Oppose': return 'bg-red-100 text-red-800 border-red-200';
      case 'Hypothetical': return 'bg-purple-100 text-purple-800 border-purple-200';
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
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold text-slate-900">Bills Tracker</h1>
              <p className="text-slate-600 mt-1">Track and manage Colorado legislation</p>
            </div>
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

          {/* Filters */}
          <Card className="mb-6">
            <CardContent className="p-4">
              <div className="grid grid-cols-1 md:grid-cols-6 gap-4">
                <div className="md:col-span-2">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 h-4 w-4" />
                    <Input
                      placeholder="Search bills..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger>
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="All">All Status</SelectItem>
                    <SelectItem value="Active">Active</SelectItem>
                    <SelectItem value="Passed">Passed</SelectItem>
                    <SelectItem value="Failed">Failed</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={priorityFilter} onValueChange={setPriorityFilter}>
                  <SelectTrigger>
                    <SelectValue placeholder="Priority" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="All">All Priority</SelectItem>
                    <SelectItem value="High">High</SelectItem>
                    <SelectItem value="Medium">Medium</SelectItem>
                    <SelectItem value="Low">Low</SelectItem>
                    <SelectItem value="None">None</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={watchlistFilter === null ? 'All' : watchlistFilter ? 'Watchlist' : 'Not Watchlist'} onValueChange={(value) => {
                  if (value === 'All') setWatchlistFilter(null);
                  else if (value === 'Watchlist') setWatchlistFilter(true);
                  else setWatchlistFilter(false);
                }}>
                  <SelectTrigger>
                    <SelectValue placeholder="Watchlist" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="All">All Bills</SelectItem>
                    <SelectItem value="Watchlist">Watchlist Only</SelectItem>
                    <SelectItem value="Not Watchlist">Not on Watchlist</SelectItem>
                  </SelectContent>
                </Select>
                <div className="flex space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
                  >
                    {sortOrder === 'asc' ? <SortAsc className="h-4 w-4" /> : <SortDesc className="h-4 w-4" />}
                  </Button>
                  <Select value={sortBy} onValueChange={(value: any) => setSortBy(value)}>
                    <SelectTrigger className="w-32">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="updated_at">Updated</SelectItem>
                      <SelectItem value="bill_number">Bill #</SelectItem>
                      <SelectItem value="priority">Priority</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Bills Table */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>Bills ({filteredBills.length})</span>
                <div className="flex items-center space-x-2 text-sm text-slate-600">
                  <Eye className="h-4 w-4" />
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
                      <th className="text-left py-3 px-4 font-medium text-slate-700">Title</th>
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
                        <td className="py-3 px-4">
                          <div className="flex items-center space-x-2">
                            <span className="font-mono text-sm font-medium">{bill.bill_number}</span>
                            {bill.watchlist && <Star className="h-4 w-4 text-yellow-500 fill-current" />}
                          </div>
                        </td>
                        <td className="py-3 px-4">
                          <div className="max-w-xs">
                            <p className="text-sm font-medium text-slate-900 truncate">{bill.title}</p>
                            <p className="text-xs text-slate-500">{bill.last_action}</p>
                          </div>
                        </td>
                        <td className="py-3 px-4">
                          <span className="text-sm text-slate-700">{bill.sponsor}</span>
                        </td>
                        <td className="py-3 px-4">
                          <Badge className={getStatusColor(bill.status)}>
                            {bill.status}
                          </Badge>
                        </td>
                        <td className="py-3 px-4">
                          <Badge className={getPositionColor(bill.position)}>
                            {bill.position}
                          </Badge>
                        </td>
                        <td className="py-3 px-4">
                          <Badge className={getPriorityColor(bill.priority)}>
                            {bill.priority}
                          </Badge>
                        </td>
                        <td className="py-3 px-4">
                          <span className="text-sm text-slate-700">
                            {bill.client_id ? clients.find(c => c.id === bill.client_id)?.name || 'Unknown' : 'No client'}
                          </span>
                        </td>
                        <td className="py-3 px-4">
                          <div className="flex items-center space-x-2">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => openNotesModal(bill)}
                              className="h-8 w-8 p-0"
                            >
                              <FileText className="h-4 w-4" />
                            </Button>
                            <Select value={bill.priority} onValueChange={(value: any) => handleUpdatePriority(bill.id, value)}>
                              <SelectTrigger className="w-24 h-8">
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
                              variant="ghost"
                              size="sm"
                              onClick={() => handleToggleWatchlist(bill.id)}
                              disabled={actionLoading === bill.id}
                              className="h-8 w-8 p-0"
                            >
                              {actionLoading === bill.id ? (
                                <Loader2 className="h-4 w-4 animate-spin" />
                              ) : bill.watchlist ? (
                                <Star className="h-4 w-4 text-yellow-500 fill-current" />
                              ) : (
                                <Star className="h-4 w-4 text-slate-400" />
                              )}
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>

          {/* Notes Modal */}
          <Dialog open={notesOpen} onOpenChange={setNotesOpen}>
            <DialogContent className="max-w-4xl">
              <DialogHeader>
                <DialogTitle className="flex items-center space-x-2">
                  <FileText className="h-5 w-5" />
                  <span>Notes for {selectedBill?.bill_number}</span>
                </DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                {/* Add Note Form */}
                <div className="border rounded-lg p-4 bg-slate-50">
                  <div className="space-y-3">
                    <div>
                      <Label htmlFor="note_type">Note Type</Label>
                      <Select value={noteType} onValueChange={(value: any) => setNoteType(value)}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="General">General</SelectItem>
                          <SelectItem value="Strategy">Strategy</SelectItem>
                          <SelectItem value="Meeting">Meeting</SelectItem>
                          <SelectItem value="Update">Update</SelectItem>
                          <SelectItem value="Analysis">Analysis</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="new_note">Add Note</Label>
                      <Textarea
                        id="new_note"
                        value={newNote}
                        onChange={(e) => setNewNote(e.target.value)}
                        placeholder="Add a note about this bill..."
                        rows={3}
                      />
                    </div>
                    <Button 
                      onClick={handleAddNote}
                      disabled={!newNote.trim() || actionLoading === 'add-note'}
                      className="bg-indigo-600 hover:bg-indigo-700"
                    >
                      {actionLoading === 'add-note' ? (
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      ) : (
                        <Plus className="h-4 w-4 mr-2" />
                      )}
                      Add Note
                    </Button>
                  </div>
                </div>

                {/* Existing Notes */}
                <div className="space-y-3">
                  <h3 className="font-medium text-slate-900">Existing Notes</h3>
                  {billNotes.length === 0 ? (
                    <p className="text-slate-500 text-sm">No notes yet. Add one above!</p>
                  ) : (
                    billNotes.map((note) => (
                      <div key={note.id} className="border rounded-lg p-4">
                        <div className="flex items-center justify-between mb-2">
                          <Badge variant="outline">{note.note_type}</Badge>
                          <span className="text-xs text-slate-500">
                            {new Date(note.created_at).toLocaleDateString()} by {note.author}
                          </span>
                        </div>
                        <p className="text-sm text-slate-700">{note.content}</p>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>
    </ProtectedRoute>
  );
}