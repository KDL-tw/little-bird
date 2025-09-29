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
  Search, 
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
  Tag,
  UserPlus,
  Filter
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { ProtectedRoute } from '@/components/ProtectedRoute';

interface GeneralContact {
  id: string;
  name: string;
  title?: string;
  organization?: string;
  contact_type: 'Legislator' | 'Aide' | 'Lobbyist' | 'Stakeholder' | 'Staff' | 'Other';
  email?: string;
  phone?: string;
  office_location?: string;
  notes?: string;
  relationship_strength: 'Strong' | 'Good' | 'Neutral' | 'Weak' | 'Unknown';
  last_contact_date?: string;
  created_at: string;
  updated_at: string;
}

interface IssueTag {
  id: string;
  name: string;
  description?: string;
  color: string;
}

interface ContactIssue {
  id: string;
  contact_id: string;
  issue_id: string;
  expertise_level: 'Expert' | 'Knowledgeable' | 'Familiar' | 'Basic';
  notes?: string;
}

export default function ContactsPage() {
  const { user } = useAuth();
  const [contacts, setContacts] = useState<GeneralContact[]>([]);
  const [issueTags, setIssueTags] = useState<IssueTag[]>([]);
  const [contactIssues, setContactIssues] = useState<ContactIssue[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState<string>('All');
  const [issueFilter, setIssueFilter] = useState<string>('All');
  
  // Modal states
  const [addContactOpen, setAddContactOpen] = useState(false);
  const [editContactOpen, setEditContactOpen] = useState(false);
  const [selectedContact, setSelectedContact] = useState<GeneralContact | null>(null);
  
  // Action states
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Form states
  const [newContact, setNewContact] = useState({
    name: '',
    title: '',
    organization: '',
    contact_type: 'Other' as GeneralContact['contact_type'],
    email: '',
    phone: '',
    office_location: '',
    notes: '',
    relationship_strength: 'Unknown' as GeneralContact['relationship_strength']
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      // TODO: Replace with actual API calls when backend is ready
      // For now, using mock data
      setContacts([
        {
          id: '1',
          name: 'Sen. Chris Hansen',
          title: 'State Senator',
          organization: 'Colorado Senate',
          contact_type: 'Legislator',
          email: 'chris.hansen@coleg.gov',
          phone: '(303) 866-4882',
          office_location: 'Room 200',
          relationship_strength: 'Strong',
          notes: 'Key ally on transportation and environment issues',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        },
        {
          id: '2',
          name: 'Sarah Johnson',
          title: 'Chief of Staff',
          organization: 'Sen. Hansen Office',
          contact_type: 'Aide',
          email: 'sarah.johnson@coleg.gov',
          phone: '(303) 866-4883',
          office_location: 'Room 200',
          relationship_strength: 'Strong',
          notes: 'Very responsive, good gatekeeper',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        }
      ]);
      
      setIssueTags([
        { id: '1', name: 'Clean Energy', description: 'Renewable energy, solar, wind', color: '#10B981' },
        { id: '2', name: 'Healthcare', description: 'Medical care, insurance', color: '#EF4444' },
        { id: '3', name: 'Transportation', description: 'Infrastructure, roads', color: '#F59E0B' },
        { id: '4', name: 'Environment', description: 'Climate, conservation', color: '#059669' }
      ]);
      
    } catch (error) {
      console.error('Error loading data:', error);
      setErrorMessage('Failed to load contacts data');
    } finally {
      setLoading(false);
    }
  };

  const filteredContacts = contacts.filter(contact => {
    const matchesSearch = 
      contact.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      contact.organization?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      contact.title?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesType = typeFilter === 'All' || contact.contact_type === typeFilter;
    
    return matchesSearch && matchesType;
  });

  const handleAddContact = async () => {
    try {
      setActionLoading('add-contact');
      // TODO: Replace with actual API call
      const newContactData = {
        ...newContact,
        id: Date.now().toString(),
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };
      
      setContacts(prev => [newContactData, ...prev]);
      setAddContactOpen(false);
      setNewContact({
        name: '',
        title: '',
        organization: '',
        contact_type: 'Other',
        email: '',
        phone: '',
        office_location: '',
        notes: '',
        relationship_strength: 'Unknown'
      });
      setSuccessMessage('Contact added successfully!');
      
    } catch (error) {
      console.error('Error adding contact:', error);
      setErrorMessage('Failed to add contact');
    } finally {
      setActionLoading(null);
    }
  };

  const handleUpdateContact = async () => {
    if (!selectedContact) return;
    
    try {
      setActionLoading('update-contact');
      // TODO: Replace with actual API call
      const updatedContact = {
        ...selectedContact,
        updated_at: new Date().toISOString()
      };
      
      setContacts(prev => prev.map(contact => 
        contact.id === selectedContact.id ? updatedContact : contact
      ));
      setEditContactOpen(false);
      setSelectedContact(null);
      setSuccessMessage('Contact updated successfully!');
      
    } catch (error) {
      console.error('Error updating contact:', error);
      setErrorMessage('Failed to update contact');
    } finally {
      setActionLoading(null);
    }
  };

  const handleDeleteContact = async (contactId: string) => {
    if (!confirm('Are you sure you want to delete this contact?')) return;
    
    try {
      setActionLoading(contactId);
      // TODO: Replace with actual API call
      setContacts(prev => prev.filter(contact => contact.id !== contactId));
      setSuccessMessage('Contact deleted successfully!');
      
    } catch (error) {
      console.error('Error deleting contact:', error);
      setErrorMessage('Failed to delete contact');
    } finally {
      setActionLoading(null);
    }
  };

  const getContactTypeColor = (type: string) => {
    switch (type) {
      case 'Legislator': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'Aide': return 'bg-green-100 text-green-800 border-green-200';
      case 'Lobbyist': return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'Stakeholder': return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'Staff': return 'bg-gray-100 text-gray-800 border-gray-200';
      default: return 'bg-slate-100 text-slate-800 border-slate-200';
    }
  };

  const getRelationshipColor = (strength: string) => {
    switch (strength) {
      case 'Strong': return 'bg-green-100 text-green-800 border-green-200';
      case 'Good': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'Neutral': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'Weak': return 'bg-orange-100 text-orange-800 border-orange-200';
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
              <h1 className="text-3xl font-bold text-slate-900">General Contacts</h1>
              <p className="text-slate-600 mt-1">Manage legislators, aides, lobbyists, and stakeholders</p>
            </div>
            <Dialog open={addContactOpen} onOpenChange={setAddContactOpen}>
              <DialogTrigger asChild>
                <Button className="bg-indigo-600 hover:bg-indigo-700">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Contact
                </Button>
              </DialogTrigger>
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
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 h-4 w-4" />
                    <Input
                      placeholder="Search contacts..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>
                <Select value={typeFilter} onValueChange={setTypeFilter}>
                  <SelectTrigger>
                    <SelectValue placeholder="Contact Type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="All">All Types</SelectItem>
                    <SelectItem value="Legislator">Legislators</SelectItem>
                    <SelectItem value="Aide">Aides</SelectItem>
                    <SelectItem value="Lobbyist">Lobbyists</SelectItem>
                    <SelectItem value="Stakeholder">Stakeholders</SelectItem>
                    <SelectItem value="Staff">Staff</SelectItem>
                    <SelectItem value="Other">Other</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={issueFilter} onValueChange={setIssueFilter}>
                  <SelectTrigger>
                    <SelectValue placeholder="Issue Area" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="All">All Issues</SelectItem>
                    {issueTags.map(tag => (
                      <SelectItem key={tag.id} value={tag.name}>{tag.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Contacts Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredContacts.map((contact) => (
              <Card key={contact.id} className="hover:shadow-lg transition-shadow">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="p-2 bg-indigo-100 rounded-lg">
                        <Users className="h-5 w-5 text-indigo-600" />
                      </div>
                      <div>
                        <CardTitle className="text-lg">{contact.name}</CardTitle>
                        <p className="text-sm text-slate-600">{contact.title}</p>
                      </div>
                    </div>
                    <div className="flex space-x-1">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          setSelectedContact(contact);
                          setEditContactOpen(true);
                        }}
                        className="h-8 w-8 p-0"
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDeleteContact(contact.id)}
                        disabled={actionLoading === contact.id}
                        className="h-8 w-8 p-0 text-red-600 hover:text-red-700"
                      >
                        {actionLoading === contact.id ? (
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
                    <Badge className={getContactTypeColor(contact.contact_type)}>
                      {contact.contact_type}
                    </Badge>
                    <Badge className={getRelationshipColor(contact.relationship_strength)}>
                      {contact.relationship_strength}
                    </Badge>
                  </div>
                  
                  <div className="space-y-2 text-sm">
                    {contact.organization && (
                      <div className="flex items-center space-x-2">
                        <Building2 className="h-4 w-4 text-slate-400" />
                        <span>{contact.organization}</span>
                      </div>
                    )}
                    {contact.email && (
                      <div className="flex items-center space-x-2">
                        <Mail className="h-4 w-4 text-slate-400" />
                        <span className="truncate">{contact.email}</span>
                      </div>
                    )}
                    {contact.phone && (
                      <div className="flex items-center space-x-2">
                        <Phone className="h-4 w-4 text-slate-400" />
                        <span>{contact.phone}</span>
                      </div>
                    )}
                    {contact.office_location && (
                      <div className="flex items-center space-x-2">
                        <MapPin className="h-4 w-4 text-slate-400" />
                        <span>{contact.office_location}</span>
                      </div>
                    )}
                  </div>

                  {contact.notes && (
                    <div className="pt-2 border-t border-slate-200">
                      <p className="text-sm text-slate-600 line-clamp-2">{contact.notes}</p>
                    </div>
                  )}

                  <div className="pt-2 border-t border-slate-200">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-slate-500">
                        {contact.last_contact_date ? 
                          `Last contact: ${new Date(contact.last_contact_date).toLocaleDateString()}` :
                          'No recent contact'
                        }
                      </span>
                      <Button variant="outline" size="sm">
                        <Tag className="h-3 w-3 mr-1" />
                        Tag Issues
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Add Contact Modal */}
          <Dialog open={addContactOpen} onOpenChange={setAddContactOpen}>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Add New Contact</DialogTitle>
              </DialogHeader>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="contact_name">Name *</Label>
                  <Input
                    id="contact_name"
                    value={newContact.name}
                    onChange={(e) => setNewContact(prev => ({ ...prev, name: e.target.value }))}
                    placeholder="e.g., John Smith"
                  />
                </div>
                <div>
                  <Label htmlFor="title">Title</Label>
                  <Input
                    id="title"
                    value={newContact.title}
                    onChange={(e) => setNewContact(prev => ({ ...prev, title: e.target.value }))}
                    placeholder="e.g., Chief of Staff"
                  />
                </div>
                <div>
                  <Label htmlFor="organization">Organization</Label>
                  <Input
                    id="organization"
                    value={newContact.organization}
                    onChange={(e) => setNewContact(prev => ({ ...prev, organization: e.target.value }))}
                    placeholder="e.g., Colorado Senate"
                  />
                </div>
                <div>
                  <Label htmlFor="contact_type">Contact Type</Label>
                  <Select value={newContact.contact_type} onValueChange={(value: any) => setNewContact(prev => ({ ...prev, contact_type: value }))}>
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
                <div>
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={newContact.email}
                    onChange={(e) => setNewContact(prev => ({ ...prev, email: e.target.value }))}
                    placeholder="contact@example.com"
                  />
                </div>
                <div>
                  <Label htmlFor="phone">Phone</Label>
                  <Input
                    id="phone"
                    value={newContact.phone}
                    onChange={(e) => setNewContact(prev => ({ ...prev, phone: e.target.value }))}
                    placeholder="(303) 555-0101"
                  />
                </div>
                <div>
                  <Label htmlFor="office_location">Office Location</Label>
                  <Input
                    id="office_location"
                    value={newContact.office_location}
                    onChange={(e) => setNewContact(prev => ({ ...prev, office_location: e.target.value }))}
                    placeholder="Room 200"
                  />
                </div>
                <div>
                  <Label htmlFor="relationship_strength">Relationship Strength</Label>
                  <Select value={newContact.relationship_strength} onValueChange={(value: any) => setNewContact(prev => ({ ...prev, relationship_strength: value }))}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Unknown">Unknown</SelectItem>
                      <SelectItem value="Weak">Weak</SelectItem>
                      <SelectItem value="Neutral">Neutral</SelectItem>
                      <SelectItem value="Good">Good</SelectItem>
                      <SelectItem value="Strong">Strong</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="col-span-2">
                  <Label htmlFor="notes">Notes</Label>
                  <Textarea
                    id="notes"
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
                  disabled={!newContact.name || actionLoading === 'add-contact'}
                  className="bg-indigo-600 hover:bg-indigo-700"
                >
                  {actionLoading === 'add-contact' ? (
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  ) : (
                    <Plus className="h-4 w-4 mr-2" />
                  )}
                  Add Contact
                </Button>
              </div>
            </DialogContent>
          </Dialog>

          {/* Edit Contact Modal */}
          <Dialog open={editContactOpen} onOpenChange={setEditContactOpen}>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Edit Contact</DialogTitle>
              </DialogHeader>
              {selectedContact && (
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="edit_name">Name *</Label>
                    <Input
                      id="edit_name"
                      value={selectedContact.name}
                      onChange={(e) => setSelectedContact(prev => prev ? { ...prev, name: e.target.value } : null)}
                    />
                  </div>
                  <div>
                    <Label htmlFor="edit_title">Title</Label>
                    <Input
                      id="edit_title"
                      value={selectedContact.title || ''}
                      onChange={(e) => setSelectedContact(prev => prev ? { ...prev, title: e.target.value } : null)}
                    />
                  </div>
                  <div>
                    <Label htmlFor="edit_organization">Organization</Label>
                    <Input
                      id="edit_organization"
                      value={selectedContact.organization || ''}
                      onChange={(e) => setSelectedContact(prev => prev ? { ...prev, organization: e.target.value } : null)}
                    />
                  </div>
                  <div>
                    <Label htmlFor="edit_contact_type">Contact Type</Label>
                    <Select value={selectedContact.contact_type} onValueChange={(value: any) => setSelectedContact(prev => prev ? { ...prev, contact_type: value } : null)}>
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
                  <div>
                    <Label htmlFor="edit_email">Email</Label>
                    <Input
                      id="edit_email"
                      type="email"
                      value={selectedContact.email || ''}
                      onChange={(e) => setSelectedContact(prev => prev ? { ...prev, email: e.target.value } : null)}
                    />
                  </div>
                  <div>
                    <Label htmlFor="edit_phone">Phone</Label>
                    <Input
                      id="edit_phone"
                      value={selectedContact.phone || ''}
                      onChange={(e) => setSelectedContact(prev => prev ? { ...prev, phone: e.target.value } : null)}
                    />
                  </div>
                  <div>
                    <Label htmlFor="edit_office_location">Office Location</Label>
                    <Input
                      id="edit_office_location"
                      value={selectedContact.office_location || ''}
                      onChange={(e) => setSelectedContact(prev => prev ? { ...prev, office_location: e.target.value } : null)}
                    />
                  </div>
                  <div>
                    <Label htmlFor="edit_relationship_strength">Relationship Strength</Label>
                    <Select value={selectedContact.relationship_strength} onValueChange={(value: any) => setSelectedContact(prev => prev ? { ...prev, relationship_strength: value } : null)}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Unknown">Unknown</SelectItem>
                        <SelectItem value="Weak">Weak</SelectItem>
                        <SelectItem value="Neutral">Neutral</SelectItem>
                        <SelectItem value="Good">Good</SelectItem>
                        <SelectItem value="Strong">Strong</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="col-span-2">
                    <Label htmlFor="edit_notes">Notes</Label>
                    <Textarea
                      id="edit_notes"
                      value={selectedContact.notes || ''}
                      onChange={(e) => setSelectedContact(prev => prev ? { ...prev, notes: e.target.value } : null)}
                      rows={3}
                    />
                  </div>
                </div>
              )}
              <div className="flex justify-end space-x-2 mt-6">
                <Button variant="outline" onClick={() => setEditContactOpen(false)}>
                  Cancel
                </Button>
                <Button 
                  onClick={handleUpdateContact}
                  disabled={!selectedContact?.name || actionLoading === 'update-contact'}
                  className="bg-indigo-600 hover:bg-indigo-700"
                >
                  {actionLoading === 'update-contact' ? (
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  ) : (
                    <Edit className="h-4 w-4 mr-2" />
                  )}
                  Update Contact
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>
    </ProtectedRoute>
  );
}
