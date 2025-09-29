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
import { DashboardLayout } from '@/components/DashboardLayout';
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
  UserPlus,
  Search,
  Filter
} from 'lucide-react';
import { clientsDataService, contactsDataService, userActionsDataService } from '@/lib/database';
import { useAuth } from '@/contexts/AuthContext';
import { ProtectedRoute } from '@/components/ProtectedRoute';
import type { Client, Contact } from '@/lib/supabase';

export default function ClientsPage() {
  const { user } = useAuth();
  const [clients, setClients] = useState<Client[]>([]);
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [industryFilter, setIndustryFilter] = useState('all');
  const [addClientOpen, setAddClientOpen] = useState(false);
  const [addContactOpen, setAddContactOpen] = useState(false);
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [newClient, setNewClient] = useState({
    name: '',
    industry: '',
    status: 'Active' as 'Active' | 'Inactive' | 'Prospect',
    contact_person: '',
    email: '',
    phone: '',
    address: '',
    notes: ''
  });
  const [newContact, setNewContact] = useState({
    name: '',
    contact_type: 'Stakeholder' as 'Legislator' | 'Aide' | 'Lobbyist' | 'Stakeholder' | 'Staff' | 'Other',
    organization: '',
    email: '',
    phone: '',
    relationship_strength: 'Medium' as 'High' | 'Medium' | 'Low' | 'None',
    client_id: '',
    issue_tags: [] as string[]
  });

  useEffect(() => {
    loadClients();
    loadContacts();
  }, []);

  const loadClients = async () => {
    try {
      setLoading(true);
      const data = await clientsDataService.getAll();
      setClients(data);
    } catch (error) {
      console.error('Error loading clients:', error);
      setErrorMessage('Failed to load clients');
    } finally {
      setLoading(false);
    }
  };

  const loadContacts = async () => {
    try {
      const data = await contactsService.getAll();
      setContacts(data);
    } catch (error) {
      console.error('Error loading contacts:', error);
    }
  };

  const handleAddClient = async () => {
    try {
      setLoading(true);
      await clientsDataService.create(newClient);
      setAddClientOpen(false);
      setSuccessMessage('Client added successfully!');
      setNewClient({
        name: '',
        industry: '',
        status: 'Active',
        contact_person: '',
        email: '',
        phone: '',
        address: '',
        notes: ''
      });
      loadClients();
    } catch (error) {
      console.error('Error adding client:', error);
      setErrorMessage('Failed to add client');
    } finally {
      setLoading(false);
    }
  };

  const handleAddContact = async () => {
    try {
      setLoading(true);
      await contactsService.create(newContact);
      setAddContactOpen(false);
      setSuccessMessage('Contact added successfully!');
      setNewContact({
        name: '',
        contact_type: 'Stakeholder',
        organization: '',
        email: '',
        phone: '',
        relationship_strength: 'Medium',
        client_id: '',
        issue_tags: []
      });
      loadContacts();
    } catch (error) {
      console.error('Error adding contact:', error);
      setErrorMessage('Failed to add contact');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteClient = async (id: string) => {
    if (confirm('Are you sure you want to delete this client?')) {
      try {
        await clientsDataService.delete(id);
        setSuccessMessage('Client deleted successfully!');
        loadClients();
      } catch (error) {
        console.error('Error deleting client:', error);
        setErrorMessage('Failed to delete client');
      }
    }
  };

  const filteredClients = clients.filter(client =>
    client.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    client.industry.toLowerCase().includes(searchTerm.toLowerCase()) ||
    client.contact_person.toLowerCase().includes(searchTerm.toLowerCase())
  ).filter(client =>
    statusFilter === 'all' || client.status === statusFilter
  ).filter(client =>
    industryFilter === 'all' || client.industry === industryFilter
  );

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'inactive': return 'bg-gray-100 text-gray-800';
      case 'prospect': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getRelationshipColor = (strength: string) => {
    switch (strength.toLowerCase()) {
      case 'high': return 'bg-green-100 text-green-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'low': return 'bg-orange-100 text-orange-800';
      case 'none': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const actions = (
    <div className="flex items-center space-x-2">
      <Button variant="outline" size="sm" onClick={() => setAddContactOpen(true)}>
        <UserPlus className="h-4 w-4 mr-2" />
        Add Contact
      </Button>
      <Button size="sm" onClick={() => setAddClientOpen(true)}>
        <Plus className="h-4 w-4 mr-2" />
        Add Client
      </Button>
    </div>
  );

  return (
    <DashboardLayout
      title="Clients & Contacts"
      subtitle="Manage your client relationships and contacts"
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

      <Tabs defaultValue="clients" className="space-y-6">
        <TabsList>
          <TabsTrigger value="clients">Clients ({clients.length})</TabsTrigger>
          <TabsTrigger value="contacts">Contacts ({contacts.length})</TabsTrigger>
        </TabsList>

        <TabsContent value="clients" className="space-y-6">
          {/* Search and Filters */}
          <Card>
            <CardHeader>
              <CardTitle>Search & Filter Clients</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <Input
                    placeholder="Search clients..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger>
                    <SelectValue placeholder="All Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="Active">Active</SelectItem>
                    <SelectItem value="Inactive">Inactive</SelectItem>
                    <SelectItem value="Prospect">Prospect</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={industryFilter} onValueChange={setIndustryFilter}>
                  <SelectTrigger>
                    <SelectValue placeholder="All Industries" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Industries</SelectItem>
                    <SelectItem value="Healthcare">Healthcare</SelectItem>
                    <SelectItem value="Technology">Technology</SelectItem>
                    <SelectItem value="Energy">Energy</SelectItem>
                    <SelectItem value="Finance">Finance</SelectItem>
                    <SelectItem value="Education">Education</SelectItem>
                    <SelectItem value="Other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Clients List */}
          <Card>
            <CardHeader>
              <CardTitle>Clients ({filteredClients.length})</CardTitle>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="flex items-center justify-center py-8">
                  <Loader2 className="h-8 w-8 animate-spin" />
                </div>
              ) : filteredClients.length === 0 ? (
                <div className="text-center py-8 text-slate-500">
                  No clients found. {searchTerm && 'Try adjusting your search terms.'}
                </div>
              ) : (
                <div className="space-y-4">
                  {filteredClients.map((client) => (
                    <div key={client.id} className="border rounded-lg p-4 hover:bg-slate-50">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center space-x-2 mb-2">
                            <h3 className="font-semibold text-lg">{client.name}</h3>
                            <Badge className={getStatusColor(client.status)}>
                              {client.status}
                            </Badge>
                            <Badge variant="outline">{client.industry}</Badge>
                          </div>
                          <div className="space-y-1 text-sm text-slate-600">
                            <div className="flex items-center">
                              <Users className="h-4 w-4 mr-2" />
                              {client.contact_person}
                            </div>
                            <div className="flex items-center">
                              <Mail className="h-4 w-4 mr-2" />
                              {client.email}
                            </div>
                            <div className="flex items-center">
                              <Phone className="h-4 w-4 mr-2" />
                              {client.phone}
                            </div>
                            {client.address && (
                              <div className="flex items-center">
                                <MapPin className="h-4 w-4 mr-2" />
                                {client.address}
                              </div>
                            )}
                          </div>
                          {client.notes && (
                            <p className="text-sm text-slate-500 mt-2">{client.notes}</p>
                          )}
                        </div>
                        <div className="flex items-center space-x-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setSelectedClient(client)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleDeleteClient(client.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="contacts" className="space-y-6">
          {/* Contacts List */}
          <Card>
            <CardHeader>
              <CardTitle>All Contacts ({contacts.length})</CardTitle>
            </CardHeader>
            <CardContent>
              {contacts.length === 0 ? (
                <div className="text-center py-8 text-slate-500">
                  No contacts found. Add some contacts to get started.
                </div>
              ) : (
                <div className="space-y-4">
                  {contacts.map((contact) => (
                    <div key={contact.id} className="border rounded-lg p-4 hover:bg-slate-50">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center space-x-2 mb-2">
                            <h3 className="font-semibold text-lg">{contact.name}</h3>
                            <Badge variant="outline">{contact.contact_type}</Badge>
                            <Badge className={getRelationshipColor(contact.relationship_strength)}>
                              {contact.relationship_strength}
                            </Badge>
                          </div>
                          <div className="space-y-1 text-sm text-slate-600">
                            {contact.organization && (
                              <div className="flex items-center">
                                <Building2 className="h-4 w-4 mr-2" />
                                {contact.organization}
                              </div>
                            )}
                            <div className="flex items-center">
                              <Mail className="h-4 w-4 mr-2" />
                              {contact.email}
                            </div>
                            <div className="flex items-center">
                              <Phone className="h-4 w-4 mr-2" />
                              {contact.phone}
                            </div>
                          </div>
                          {contact.issue_tags && contact.issue_tags.length > 0 && (
                            <div className="flex flex-wrap gap-1 mt-2">
                              {contact.issue_tags.map((tag, index) => (
                                <Badge key={index} variant="secondary" className="text-xs">
                                  {tag}
                                </Badge>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Add Client Modal */}
      <Dialog open={addClientOpen} onOpenChange={setAddClientOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add New Client</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="name">Client Name</Label>
                <Input
                  id="name"
                  value={newClient.name}
                  onChange={(e) => setNewClient({...newClient, name: e.target.value})}
                  placeholder="Enter client name"
                />
              </div>
              <div>
                <Label htmlFor="industry">Industry</Label>
                <Select value={newClient.industry} onValueChange={(value) => setNewClient({...newClient, industry: value})}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select industry" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Healthcare">Healthcare</SelectItem>
                    <SelectItem value="Technology">Technology</SelectItem>
                    <SelectItem value="Energy">Energy</SelectItem>
                    <SelectItem value="Finance">Finance</SelectItem>
                    <SelectItem value="Education">Education</SelectItem>
                    <SelectItem value="Other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="contact_person">Contact Person</Label>
                <Input
                  id="contact_person"
                  value={newClient.contact_person}
                  onChange={(e) => setNewClient({...newClient, contact_person: e.target.value})}
                  placeholder="Enter contact person"
                />
              </div>
              <div>
                <Label htmlFor="status">Status</Label>
                <Select value={newClient.status} onValueChange={(value: any) => setNewClient({...newClient, status: value})}>
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
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={newClient.email}
                  onChange={(e) => setNewClient({...newClient, email: e.target.value})}
                  placeholder="Enter email"
                />
              </div>
              <div>
                <Label htmlFor="phone">Phone</Label>
                <Input
                  id="phone"
                  value={newClient.phone}
                  onChange={(e) => setNewClient({...newClient, phone: e.target.value})}
                  placeholder="Enter phone"
                />
              </div>
            </div>
            
            <div>
              <Label htmlFor="address">Address</Label>
              <Input
                id="address"
                value={newClient.address}
                onChange={(e) => setNewClient({...newClient, address: e.target.value})}
                placeholder="Enter address"
              />
            </div>
            
            <div>
              <Label htmlFor="notes">Notes</Label>
              <Textarea
                id="notes"
                value={newClient.notes}
                onChange={(e) => setNewClient({...newClient, notes: e.target.value})}
                placeholder="Enter notes"
                rows={3}
              />
            </div>
            
            <div className="flex justify-end space-x-2">
              <Button variant="outline" onClick={() => setAddClientOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleAddClient} disabled={loading}>
                {loading ? (
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                ) : (
                  <Plus className="h-4 w-4 mr-2" />
                )}
                Add Client
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Add Contact Modal */}
      <Dialog open={addContactOpen} onOpenChange={setAddContactOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add New Contact</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="contact_name">Name</Label>
                <Input
                  id="contact_name"
                  value={newContact.name}
                  onChange={(e) => setNewContact({...newContact, name: e.target.value})}
                  placeholder="Enter contact name"
                />
              </div>
              <div>
                <Label htmlFor="contact_type">Type</Label>
                <Select value={newContact.contact_type} onValueChange={(value: any) => setNewContact({...newContact, contact_type: value})}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Legislator">Legislator</SelectItem>
                    <SelectItem value="Aide">Aide</SelectItem>
                    <SelectItem value="Lobbyist">Lobbyist</SelectItem>
                    <SelectItem value="Stakeholder">Stakeholder</SelectItem>
                    <SelectItem value="Staff">Staff</SelectItem>
                    <SelectItem value="Other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="organization">Organization</Label>
                <Input
                  id="organization"
                  value={newContact.organization}
                  onChange={(e) => setNewContact({...newContact, organization: e.target.value})}
                  placeholder="Enter organization"
                />
              </div>
              <div>
                <Label htmlFor="relationship_strength">Relationship Strength</Label>
                <Select value={newContact.relationship_strength} onValueChange={(value: any) => setNewContact({...newContact, relationship_strength: value})}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="High">High</SelectItem>
                    <SelectItem value="Medium">Medium</SelectItem>
                    <SelectItem value="Low">Low</SelectItem>
                    <SelectItem value="None">None</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="contact_email">Email</Label>
                <Input
                  id="contact_email"
                  type="email"
                  value={newContact.email}
                  onChange={(e) => setNewContact({...newContact, email: e.target.value})}
                  placeholder="Enter email"
                />
              </div>
              <div>
                <Label htmlFor="contact_phone">Phone</Label>
                <Input
                  id="contact_phone"
                  value={newContact.phone}
                  onChange={(e) => setNewContact({...newContact, phone: e.target.value})}
                  placeholder="Enter phone"
                />
              </div>
            </div>
            
            <div>
              <Label htmlFor="client_id">Client (Optional)</Label>
              <Select value={newContact.client_id} onValueChange={(value) => setNewContact({...newContact, client_id: value})}>
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
            
            <div className="flex justify-end space-x-2">
              <Button variant="outline" onClick={() => setAddContactOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleAddContact} disabled={loading}>
                {loading ? (
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                ) : (
                  <UserPlus className="h-4 w-4 mr-2" />
                )}
                Add Contact
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
}