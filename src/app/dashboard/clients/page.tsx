"use client";

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Plus, 
  Users, 
  Building2, 
  Mail, 
  Phone, 
  MapPin,
  Edit,
  Trash2,
  CheckCircle,
  AlertCircle,
  Loader2,
  UserPlus
} from 'lucide-react';
import { clientsService, contactsService, userActionsService } from '@/lib/database';
import { useAuth } from '@/contexts/AuthContext';
import { ProtectedRoute } from '@/components/ProtectedRoute';
import type { Client, Contact } from '@/lib/supabase';

export default function ClientsPage() {
  const { user } = useAuth();
  const [clients, setClients] = useState<Client[]>([]);
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Modal states
  const [addClientOpen, setAddClientOpen] = useState(false);
  const [addContactOpen, setAddContactOpen] = useState(false);
  const [editClientOpen, setEditClientOpen] = useState(false);
  const [editContactOpen, setEditContactOpen] = useState(false);
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);
  const [selectedContact, setSelectedContact] = useState<Contact | null>(null);
  
  // Action states
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Form states
  const [newClient, setNewClient] = useState({
    name: '',
    organization: '',
    contact_person: '',
    email: '',
    phone: '',
    address: '',
    industry: '',
    relationship_type: 'Client' as 'Client' | 'Prospect' | 'Partner' | 'Vendor',
    status: 'Active' as 'Active' | 'Inactive' | 'Prospect',
    notes: ''
  });

  const [newContact, setNewContact] = useState({
    client_id: '',
    name: '',
    title: '',
    email: '',
    phone: '',
    role: '',
    notes: ''
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const clientsData = await clientsService.getAll();
      setClients(clientsData);
      
      // Load contacts for all clients
      const allContacts = [];
      for (const client of clientsData) {
        const clientContacts = await contactsService.getByClientId(client.id);
        allContacts.push(...clientContacts);
      }
      setContacts(allContacts);
    } catch (error) {
      console.error('Error loading data:', error);
      setErrorMessage('Failed to load clients data');
    } finally {
      setLoading(false);
    }
  };

  const handleAddClient = async () => {
    try {
      setActionLoading('add-client');
      const client = await clientsService.create(newClient);
      setClients(prev => [client, ...prev]);
      setAddClientOpen(false);
      setNewClient({
        name: '',
        organization: '',
        contact_person: '',
        email: '',
        phone: '',
        address: '',
        industry: '',
        relationship_type: 'Client',
        status: 'Active',
        notes: ''
      });
      setSuccessMessage('Client added successfully!');
      
      // Log user action
      if (user?.id) {
        await userActionsService.logAction({
          user_id: user.id,
          action_type: 'create',
          entity_type: 'client',
          entity_id: client.id,
          details: { name: client.name }
        });
      }
    } catch (error) {
      console.error('Error adding client:', error);
      setErrorMessage('Failed to add client');
    } finally {
      setActionLoading(null);
    }
  };

  const handleAddContact = async () => {
    try {
      setActionLoading('add-contact');
      const contact = await contactsService.create(newContact);
      setContacts(prev => [contact, ...prev]);
      setAddContactOpen(false);
      setNewContact({
        client_id: '',
        name: '',
        title: '',
        email: '',
        phone: '',
        role: '',
        notes: ''
      });
      setSuccessMessage('Contact added successfully!');
      
      // Log user action
      if (user?.id) {
        await userActionsService.logAction({
          user_id: user.id,
          action_type: 'create',
          entity_type: 'contact',
          entity_id: contact.id,
          details: { name: contact.name, client_id: contact.client_id }
        });
      }
    } catch (error) {
      console.error('Error adding contact:', error);
      setErrorMessage('Failed to add contact');
    } finally {
      setActionLoading(null);
    }
  };

  const handleUpdateClient = async () => {
    if (!selectedClient) return;
    
    try {
      setActionLoading('update-client');
      const updatedClient = await clientsService.update(selectedClient.id, selectedClient);
      setClients(prev => prev.map(client => client.id === selectedClient.id ? updatedClient : client));
      setEditClientOpen(false);
      setSelectedClient(null);
      setSuccessMessage('Client updated successfully!');
      
      // Log user action
      if (user?.id) {
        await userActionsService.logAction({
          user_id: user.id,
          action_type: 'update',
          entity_type: 'client',
          entity_id: selectedClient.id,
          details: { name: selectedClient.name }
        });
      }
    } catch (error) {
      console.error('Error updating client:', error);
      setErrorMessage('Failed to update client');
    } finally {
      setActionLoading(null);
    }
  };

  const handleUpdateContact = async () => {
    if (!selectedContact) return;
    
    try {
      setActionLoading('update-contact');
      const updatedContact = await contactsService.update(selectedContact.id, selectedContact);
      setContacts(prev => prev.map(contact => contact.id === selectedContact.id ? updatedContact : contact));
      setEditContactOpen(false);
      setSelectedContact(null);
      setSuccessMessage('Contact updated successfully!');
      
      // Log user action
      if (user?.id) {
        await userActionsService.logAction({
          user_id: user.id,
          action_type: 'update',
          entity_type: 'contact',
          entity_id: selectedContact.id,
          details: { name: selectedContact.name }
        });
      }
    } catch (error) {
      console.error('Error updating contact:', error);
      setErrorMessage('Failed to update contact');
    } finally {
      setActionLoading(null);
    }
  };

  const handleDeleteClient = async (clientId: string) => {
    if (!confirm('Are you sure you want to delete this client? This will also delete all associated contacts.')) return;
    
    try {
      setActionLoading(clientId);
      await clientsService.delete(clientId);
      setClients(prev => prev.filter(client => client.id !== clientId));
      setContacts(prev => prev.filter(contact => contact.client_id !== clientId));
      setSuccessMessage('Client deleted successfully!');
      
      // Log user action
      if (user?.id) {
        await userActionsService.logAction({
          user_id: user.id,
          action_type: 'delete',
          entity_type: 'client',
          entity_id: clientId,
          details: {}
        });
      }
    } catch (error) {
      console.error('Error deleting client:', error);
      setErrorMessage('Failed to delete client');
    } finally {
      setActionLoading(null);
    }
  };

  const handleDeleteContact = async (contactId: string) => {
    if (!confirm('Are you sure you want to delete this contact?')) return;
    
    try {
      setActionLoading(contactId);
      await contactsService.delete(contactId);
      setContacts(prev => prev.filter(contact => contact.id !== contactId));
      setSuccessMessage('Contact deleted successfully!');
      
      // Log user action
      if (user?.id) {
        await userActionsService.logAction({
          user_id: user.id,
          action_type: 'delete',
          entity_type: 'contact',
          entity_id: contactId,
          details: {}
        });
      }
    } catch (error) {
      console.error('Error deleting contact:', error);
      setErrorMessage('Failed to delete contact');
    } finally {
      setActionLoading(null);
    }
  };

  const getClientContacts = (clientId: string) => {
    return contacts.filter(contact => contact.client_id === clientId);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Active': return 'bg-green-100 text-green-800 border-green-200';
      case 'Inactive': return 'bg-gray-100 text-gray-800 border-gray-200';
      case 'Prospect': return 'bg-blue-100 text-blue-800 border-blue-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getRelationshipColor = (type: string) => {
    switch (type) {
      case 'Client': return 'bg-indigo-100 text-indigo-800 border-indigo-200';
      case 'Prospect': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'Partner': return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'Vendor': return 'bg-orange-100 text-orange-800 border-orange-200';
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
              <h1 className="text-3xl font-bold text-slate-900">Clients & Contacts</h1>
              <p className="text-slate-600 mt-1">Manage your client relationships and contacts</p>
            </div>
            <div className="flex space-x-2">
              <Dialog open={addContactOpen} onOpenChange={setAddContactOpen}>
                <DialogTrigger asChild>
                  <Button variant="outline">
                    <UserPlus className="h-4 w-4 mr-2" />
                    Add Contact
                  </Button>
                </DialogTrigger>
              </Dialog>
              <Dialog open={addClientOpen} onOpenChange={setAddClientOpen}>
                <DialogTrigger asChild>
                  <Button className="bg-indigo-600 hover:bg-indigo-700">
                    <Plus className="h-4 w-4 mr-2" />
                    Add Client
                  </Button>
                </DialogTrigger>
              </Dialog>
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

          {/* Clients Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {clients.map((client) => (
              <Card key={client.id} className="hover:shadow-lg transition-shadow">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="p-2 bg-indigo-100 rounded-lg">
                        <Building2 className="h-5 w-5 text-indigo-600" />
                      </div>
                      <div>
                        <CardTitle className="text-lg">{client.name}</CardTitle>
                        <p className="text-sm text-slate-600">{client.organization}</p>
                      </div>
                    </div>
                    <div className="flex space-x-1">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          setSelectedClient(client);
                          setEditClientOpen(true);
                        }}
                        className="h-8 w-8 p-0"
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDeleteClient(client.id)}
                        disabled={actionLoading === client.id}
                        className="h-8 w-8 p-0 text-red-600 hover:text-red-700"
                      >
                        {actionLoading === client.id ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                          <Trash2 className="h-4 w-4" />
                        )}
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center space-x-2">
                    <Badge className={getStatusColor(client.status)}>
                      {client.status}
                    </Badge>
                    <Badge className={getRelationshipColor(client.relationship_type)}>
                      {client.relationship_type}
                    </Badge>
                  </div>
                  
                  <div className="space-y-2 text-sm">
                    {client.contact_person && (
                      <div className="flex items-center space-x-2">
                        <Users className="h-4 w-4 text-slate-400" />
                        <span>{client.contact_person}</span>
                      </div>
                    )}
                    {client.email && (
                      <div className="flex items-center space-x-2">
                        <Mail className="h-4 w-4 text-slate-400" />
                        <span className="truncate">{client.email}</span>
                      </div>
                    )}
                    {client.phone && (
                      <div className="flex items-center space-x-2">
                        <Phone className="h-4 w-4 text-slate-400" />
                        <span>{client.phone}</span>
                      </div>
                    )}
                    {client.industry && (
                      <div className="flex items-center space-x-2">
                        <Building2 className="h-4 w-4 text-slate-400" />
                        <span>{client.industry}</span>
                      </div>
                    )}
                  </div>

                  {client.notes && (
                    <div className="pt-2 border-t border-slate-200">
                      <p className="text-sm text-slate-600 line-clamp-2">{client.notes}</p>
                    </div>
                  )}

                  <div className="pt-2 border-t border-slate-200">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-slate-500">
                        {getClientContacts(client.id).length} contact{getClientContacts(client.id).length !== 1 ? 's' : ''}
                      </span>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          setNewContact(prev => ({ ...prev, client_id: client.id }));
                          setAddContactOpen(true);
                        }}
                      >
                        <UserPlus className="h-3 w-3 mr-1" />
                        Add Contact
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Add Client Modal */}
          <Dialog open={addClientOpen} onOpenChange={setAddClientOpen}>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Add New Client</DialogTitle>
              </DialogHeader>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="client_name">Client Name *</Label>
                  <Input
                    id="client_name"
                    value={newClient.name}
                    onChange={(e) => setNewClient(prev => ({ ...prev, name: e.target.value }))}
                    placeholder="e.g., Colorado Clean Energy Coalition"
                  />
                </div>
                <div>
                  <Label htmlFor="organization">Organization</Label>
                  <Input
                    id="organization"
                    value={newClient.organization}
                    onChange={(e) => setNewClient(prev => ({ ...prev, organization: e.target.value }))}
                    placeholder="e.g., CCEC"
                  />
                </div>
                <div>
                  <Label htmlFor="contact_person">Contact Person</Label>
                  <Input
                    id="contact_person"
                    value={newClient.contact_person}
                    onChange={(e) => setNewClient(prev => ({ ...prev, contact_person: e.target.value }))}
                    placeholder="e.g., Sarah Johnson"
                  />
                </div>
                <div>
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={newClient.email}
                    onChange={(e) => setNewClient(prev => ({ ...prev, email: e.target.value }))}
                    placeholder="contact@client.org"
                  />
                </div>
                <div>
                  <Label htmlFor="phone">Phone</Label>
                  <Input
                    id="phone"
                    value={newClient.phone}
                    onChange={(e) => setNewClient(prev => ({ ...prev, phone: e.target.value }))}
                    placeholder="(303) 555-0101"
                  />
                </div>
                <div>
                  <Label htmlFor="industry">Industry</Label>
                  <Input
                    id="industry"
                    value={newClient.industry}
                    onChange={(e) => setNewClient(prev => ({ ...prev, industry: e.target.value }))}
                    placeholder="e.g., Energy, Healthcare"
                  />
                </div>
                <div>
                  <Label htmlFor="relationship_type">Relationship Type</Label>
                  <Select value={newClient.relationship_type} onValueChange={(value: any) => setNewClient(prev => ({ ...prev, relationship_type: value }))}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Client">Client</SelectItem>
                      <SelectItem value="Prospect">Prospect</SelectItem>
                      <SelectItem value="Partner">Partner</SelectItem>
                      <SelectItem value="Vendor">Vendor</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="status">Status</Label>
                  <Select value={newClient.status} onValueChange={(value: any) => setNewClient(prev => ({ ...prev, status: value }))}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Active">Active</SelectItem>
                      <SelectItem value="Inactive">Inactive</SelectItem>
                      <SelectItem value="Prospect">Prospect</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="col-span-2">
                  <Label htmlFor="address">Address</Label>
                  <Input
                    id="address"
                    value={newClient.address}
                    onChange={(e) => setNewClient(prev => ({ ...prev, address: e.target.value }))}
                    placeholder="123 Main St, Denver, CO 80202"
                  />
                </div>
                <div className="col-span-2">
                  <Label htmlFor="notes">Notes</Label>
                  <Textarea
                    id="notes"
                    value={newClient.notes}
                    onChange={(e) => setNewClient(prev => ({ ...prev, notes: e.target.value }))}
                    placeholder="Additional notes about this client..."
                    rows={3}
                  />
                </div>
              </div>
              <div className="flex justify-end space-x-2 mt-6">
                <Button variant="outline" onClick={() => setAddClientOpen(false)}>
                  Cancel
                </Button>
                <Button 
                  onClick={handleAddClient}
                  disabled={!newClient.name || actionLoading === 'add-client'}
                  className="bg-indigo-600 hover:bg-indigo-700"
                >
                  {actionLoading === 'add-client' ? (
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  ) : (
                    <Plus className="h-4 w-4 mr-2" />
                  )}
                  Add Client
                </Button>
              </div>
            </DialogContent>
          </Dialog>

          {/* Add Contact Modal */}
          <Dialog open={addContactOpen} onOpenChange={setAddContactOpen}>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Add New Contact</DialogTitle>
              </DialogHeader>
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2">
                  <Label htmlFor="contact_client">Client *</Label>
                  <Select value={newContact.client_id} onValueChange={(value) => setNewContact(prev => ({ ...prev, client_id: value }))}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select client" />
                    </SelectTrigger>
                    <SelectContent>
                      {clients.map(client => (
                        <SelectItem key={client.id} value={client.id}>{client.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="contact_name">Name *</Label>
                  <Input
                    id="contact_name"
                    value={newContact.name}
                    onChange={(e) => setNewContact(prev => ({ ...prev, name: e.target.value }))}
                    placeholder="e.g., Sarah Johnson"
                  />
                </div>
                <div>
                  <Label htmlFor="title">Title</Label>
                  <Input
                    id="title"
                    value={newContact.title}
                    onChange={(e) => setNewContact(prev => ({ ...prev, title: e.target.value }))}
                    placeholder="e.g., Executive Director"
                  />
                </div>
                <div>
                  <Label htmlFor="contact_email">Email</Label>
                  <Input
                    id="contact_email"
                    type="email"
                    value={newContact.email}
                    onChange={(e) => setNewContact(prev => ({ ...prev, email: e.target.value }))}
                    placeholder="sarah@client.org"
                  />
                </div>
                <div>
                  <Label htmlFor="contact_phone">Phone</Label>
                  <Input
                    id="contact_phone"
                    value={newContact.phone}
                    onChange={(e) => setNewContact(prev => ({ ...prev, phone: e.target.value }))}
                    placeholder="(303) 555-0101"
                  />
                </div>
                <div>
                  <Label htmlFor="role">Role</Label>
                  <Input
                    id="role"
                    value={newContact.role}
                    onChange={(e) => setNewContact(prev => ({ ...prev, role: e.target.value }))}
                    placeholder="e.g., Primary Contact"
                  />
                </div>
                <div className="col-span-2">
                  <Label htmlFor="contact_notes">Notes</Label>
                  <Textarea
                    id="contact_notes"
                    value={newContact.notes}
                    onChange={(e) => setNewContact(prev => ({ ...prev, notes: e.target.value }))}
                    placeholder="Additional notes about this contact..."
                    rows={3}
                  />
                </div>
              </div>
              <div className="flex justify-end space-x-2 mt-6">
                <Button variant="outline" onClick={() => setAddContactOpen(false)}>
                  Cancel
                </Button>
                <Button 
                  onClick={handleAddContact}
                  disabled={!newContact.name || !newContact.client_id || actionLoading === 'add-contact'}
                  className="bg-indigo-600 hover:bg-indigo-700"
                >
                  {actionLoading === 'add-contact' ? (
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  ) : (
                    <UserPlus className="h-4 w-4 mr-2" />
                  )}
                  Add Contact
                </Button>
              </div>
            </DialogContent>
          </Dialog>

          {/* Edit Client Modal */}
          <Dialog open={editClientOpen} onOpenChange={setEditClientOpen}>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Edit Client</DialogTitle>
              </DialogHeader>
              {selectedClient && (
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="edit_client_name">Client Name *</Label>
                    <Input
                      id="edit_client_name"
                      value={selectedClient.name}
                      onChange={(e) => setSelectedClient(prev => prev ? { ...prev, name: e.target.value } : null)}
                    />
                  </div>
                  <div>
                    <Label htmlFor="edit_organization">Organization</Label>
                    <Input
                      id="edit_organization"
                      value={selectedClient.organization || ''}
                      onChange={(e) => setSelectedClient(prev => prev ? { ...prev, organization: e.target.value } : null)}
                    />
                  </div>
                  <div>
                    <Label htmlFor="edit_contact_person">Contact Person</Label>
                    <Input
                      id="edit_contact_person"
                      value={selectedClient.contact_person || ''}
                      onChange={(e) => setSelectedClient(prev => prev ? { ...prev, contact_person: e.target.value } : null)}
                    />
                  </div>
                  <div>
                    <Label htmlFor="edit_email">Email</Label>
                    <Input
                      id="edit_email"
                      type="email"
                      value={selectedClient.email || ''}
                      onChange={(e) => setSelectedClient(prev => prev ? { ...prev, email: e.target.value } : null)}
                    />
                  </div>
                  <div>
                    <Label htmlFor="edit_phone">Phone</Label>
                    <Input
                      id="edit_phone"
                      value={selectedClient.phone || ''}
                      onChange={(e) => setSelectedClient(prev => prev ? { ...prev, phone: e.target.value } : null)}
                    />
                  </div>
                  <div>
                    <Label htmlFor="edit_industry">Industry</Label>
                    <Input
                      id="edit_industry"
                      value={selectedClient.industry || ''}
                      onChange={(e) => setSelectedClient(prev => prev ? { ...prev, industry: e.target.value } : null)}
                    />
                  </div>
                  <div>
                    <Label htmlFor="edit_relationship_type">Relationship Type</Label>
                    <Select value={selectedClient.relationship_type} onValueChange={(value: any) => setSelectedClient(prev => prev ? { ...prev, relationship_type: value } : null)}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Client">Client</SelectItem>
                        <SelectItem value="Prospect">Prospect</SelectItem>
                        <SelectItem value="Partner">Partner</SelectItem>
                        <SelectItem value="Vendor">Vendor</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="edit_status">Status</Label>
                    <Select value={selectedClient.status} onValueChange={(value: any) => setSelectedClient(prev => prev ? { ...prev, status: value } : null)}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Active">Active</SelectItem>
                        <SelectItem value="Inactive">Inactive</SelectItem>
                        <SelectItem value="Prospect">Prospect</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="col-span-2">
                    <Label htmlFor="edit_address">Address</Label>
                    <Input
                      id="edit_address"
                      value={selectedClient.address || ''}
                      onChange={(e) => setSelectedClient(prev => prev ? { ...prev, address: e.target.value } : null)}
                    />
                  </div>
                  <div className="col-span-2">
                    <Label htmlFor="edit_notes">Notes</Label>
                    <Textarea
                      id="edit_notes"
                      value={selectedClient.notes || ''}
                      onChange={(e) => setSelectedClient(prev => prev ? { ...prev, notes: e.target.value } : null)}
                      rows={3}
                    />
                  </div>
                </div>
              )}
              <div className="flex justify-end space-x-2 mt-6">
                <Button variant="outline" onClick={() => setEditClientOpen(false)}>
                  Cancel
                </Button>
                <Button 
                  onClick={handleUpdateClient}
                  disabled={!selectedClient?.name || actionLoading === 'update-client'}
                  className="bg-indigo-600 hover:bg-indigo-700"
                >
                  {actionLoading === 'update-client' ? (
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  ) : (
                    <Edit className="h-4 w-4 mr-2" />
                  )}
                  Update Client
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>
    </ProtectedRoute>
  );
}
