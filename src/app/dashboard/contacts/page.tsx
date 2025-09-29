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
  Filter,
  Tag,
  Calendar
} from 'lucide-react';
import { contactsService } from '@/lib/database';
import { useAuth } from '@/contexts/AuthContext';
import { ProtectedRoute } from '@/components/ProtectedRoute';
import type { Contact } from '@/lib/supabase';

interface IssueTag {
  id: string;
  name: string;
  description: string;
  color: string;
}

export default function ContactsPage() {
  const { user } = useAuth();
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [issueTags, setIssueTags] = useState<IssueTag[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState('all');
  const [relationshipFilter, setRelationshipFilter] = useState('all');
  const [addContactOpen, setAddContactOpen] = useState(false);
  const [selectedContact, setSelectedContact] = useState<Contact | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [newContact, setNewContact] = useState({
    name: '',
    title: '',
    organization: '',
    contact_type: 'Stakeholder' as 'Legislator' | 'Aide' | 'Lobbyist' | 'Stakeholder' | 'Staff' | 'Other',
    email: '',
    phone: '',
    office_location: '',
    relationship_strength: 'Medium' as 'High' | 'Medium' | 'Low' | 'None',
    notes: '',
    issue_tags: [] as string[]
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const contactsData = await contactsService.getAll();
      setContacts(contactsData);
      
      // Load issue tags (mock for now)
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

  const handleAddContact = async () => {
    try {
      setLoading(true);
      await contactsService.create(newContact);
      setAddContactOpen(false);
      setSuccessMessage('Contact added successfully!');
      setNewContact({
        name: '',
        title: '',
        organization: '',
        contact_type: 'Stakeholder',
        email: '',
        phone: '',
        office_location: '',
        relationship_strength: 'Medium',
        notes: '',
        issue_tags: []
      });
      loadData();
    } catch (error) {
      console.error('Error adding contact:', error);
      setErrorMessage('Failed to add contact');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteContact = async (id: string) => {
    if (confirm('Are you sure you want to delete this contact?')) {
      try {
        await contactsService.delete(id);
        setSuccessMessage('Contact deleted successfully!');
        loadData();
      } catch (error) {
        console.error('Error deleting contact:', error);
        setErrorMessage('Failed to delete contact');
      }
    }
  };

  const filteredContacts = contacts.filter(contact => {
    const matchesSearch = contact.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         contact.organization?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         contact.title?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = typeFilter === 'all' || contact.contact_type === typeFilter;
    const matchesRelationship = relationshipFilter === 'all' || contact.relationship_strength === relationshipFilter;
    
    return matchesSearch && matchesType && matchesRelationship;
  });

  const getRelationshipColor = (strength: string) => {
    switch (strength.toLowerCase()) {
      case 'high': return 'bg-green-100 text-green-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'low': return 'bg-orange-100 text-orange-800';
      case 'none': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getTypeColor = (type: string) => {
    switch (type.toLowerCase()) {
      case 'legislator': return 'bg-blue-100 text-blue-800';
      case 'aide': return 'bg-purple-100 text-purple-800';
      case 'lobbyist': return 'bg-indigo-100 text-indigo-800';
      case 'stakeholder': return 'bg-green-100 text-green-800';
      case 'staff': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const actions = (
    <div className="flex items-center space-x-2">
      <Button size="sm" onClick={() => setAddContactOpen(true)}>
        <Plus className="h-4 w-4 mr-2" />
        Add Contact
      </Button>
    </div>
  );

  return (
    <DashboardLayout
      title="Contacts"
      subtitle="Manage your professional network and relationships"
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

      <Tabs defaultValue="contacts" className="space-y-6">
        <TabsList>
          <TabsTrigger value="contacts">All Contacts ({contacts.length})</TabsTrigger>
          <TabsTrigger value="tags">Issue Tags ({issueTags.length})</TabsTrigger>
        </TabsList>

        <TabsContent value="contacts" className="space-y-6">
          {/* Search and Filters */}
          <Card>
            <CardHeader>
              <CardTitle>Search & Filter Contacts</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <Input
                    placeholder="Search contacts..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
                <Select value={typeFilter} onValueChange={setTypeFilter}>
                  <SelectTrigger>
                    <SelectValue placeholder="All Types" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Types</SelectItem>
                    <SelectItem value="Legislator">Legislator</SelectItem>
                    <SelectItem value="Aide">Aide</SelectItem>
                    <SelectItem value="Lobbyist">Lobbyist</SelectItem>
                    <SelectItem value="Stakeholder">Stakeholder</SelectItem>
                    <SelectItem value="Staff">Staff</SelectItem>
                    <SelectItem value="Other">Other</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={relationshipFilter} onValueChange={setRelationshipFilter}>
                  <SelectTrigger>
                    <SelectValue placeholder="All Relationships" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Relationships</SelectItem>
                    <SelectItem value="High">High</SelectItem>
                    <SelectItem value="Medium">Medium</SelectItem>
                    <SelectItem value="Low">Low</SelectItem>
                    <SelectItem value="None">None</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Contacts List */}
          <Card>
            <CardHeader>
              <CardTitle>Contacts ({filteredContacts.length})</CardTitle>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="flex items-center justify-center py-8">
                  <Loader2 className="h-8 w-8 animate-spin" />
                </div>
              ) : filteredContacts.length === 0 ? (
                <div className="text-center py-8 text-slate-500">
                  No contacts found. {searchTerm && 'Try adjusting your search terms.'}
                </div>
              ) : (
                <div className="space-y-4">
                  {filteredContacts.map((contact) => (
                    <div key={contact.id} className="border rounded-lg p-4 hover:bg-slate-50">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center space-x-2 mb-2">
                            <h3 className="font-semibold text-lg">{contact.name}</h3>
                            <Badge className={getTypeColor(contact.contact_type)}>
                              {contact.contact_type}
                            </Badge>
                            <Badge className={getRelationshipColor(contact.relationship_strength)}>
                              {contact.relationship_strength}
                            </Badge>
                          </div>
                          <div className="space-y-1 text-sm text-slate-600">
                            {contact.title && (
                              <div className="flex items-center">
                                <Users className="h-4 w-4 mr-2" />
                                {contact.title}
                              </div>
                            )}
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
                            {contact.office_location && (
                              <div className="flex items-center">
                                <MapPin className="h-4 w-4 mr-2" />
                                {contact.office_location}
                              </div>
                            )}
                          </div>
                          {contact.notes && (
                            <p className="text-sm text-slate-500 mt-2">{contact.notes}</p>
                          )}
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
                        <div className="flex items-center space-x-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setSelectedContact(contact)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleDeleteContact(contact.id)}
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

        <TabsContent value="tags" className="space-y-6">
          {/* Issue Tags Management */}
          <Card>
            <CardHeader>
              <CardTitle>Issue Tags</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {issueTags.map((tag) => (
                  <div key={tag.id} className="border rounded-lg p-4">
                    <div className="flex items-center space-x-2 mb-2">
                      <div 
                        className="w-3 h-3 rounded-full" 
                        style={{ backgroundColor: tag.color }}
                      />
                      <h3 className="font-semibold">{tag.name}</h3>
                    </div>
                    <p className="text-sm text-slate-600">{tag.description}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Add Contact Modal */}
      <Dialog open={addContactOpen} onOpenChange={setAddContactOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add New Contact</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="name">Name</Label>
                <Input
                  id="name"
                  value={newContact.name}
                  onChange={(e) => setNewContact({...newContact, name: e.target.value})}
                  placeholder="Enter contact name"
                />
              </div>
              <div>
                <Label htmlFor="title">Title</Label>
                <Input
                  id="title"
                  value={newContact.title}
                  onChange={(e) => setNewContact({...newContact, title: e.target.value})}
                  placeholder="Enter title"
                />
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
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={newContact.email}
                  onChange={(e) => setNewContact({...newContact, email: e.target.value})}
                  placeholder="Enter email"
                />
              </div>
              <div>
                <Label htmlFor="phone">Phone</Label>
                <Input
                  id="phone"
                  value={newContact.phone}
                  onChange={(e) => setNewContact({...newContact, phone: e.target.value})}
                  placeholder="Enter phone"
                />
              </div>
            </div>
            
            <div>
              <Label htmlFor="office_location">Office Location</Label>
              <Input
                id="office_location"
                value={newContact.office_location}
                onChange={(e) => setNewContact({...newContact, office_location: e.target.value})}
                placeholder="Enter office location"
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
            
            <div>
              <Label htmlFor="notes">Notes</Label>
              <Textarea
                id="notes"
                value={newContact.notes}
                onChange={(e) => setNewContact({...newContact, notes: e.target.value})}
                placeholder="Enter notes"
                rows={3}
              />
            </div>
            
            <div className="flex justify-end space-x-2">
              <Button variant="outline" onClick={() => setAddContactOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleAddContact} disabled={loading}>
                {loading ? (
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                ) : (
                  <Plus className="h-4 w-4 mr-2" />
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