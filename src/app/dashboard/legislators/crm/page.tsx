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
  Calendar,
  Edit,
  Trash2,
  CheckCircle,
  AlertCircle,
  Loader2,
  UserPlus,
  Network,
  FileText,
  MessageSquare,
  ArrowLeft
} from 'lucide-react';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import { ProtectedRoute } from '@/components/ProtectedRoute';

interface StaffMember {
  id: string;
  legislator_id: string;
  name: string;
  role: string;
  email?: string;
  phone?: string;
  influence_level: 'High' | 'Medium' | 'Low';
  policy_areas: string[];
  notes?: string;
  is_primary_contact: boolean;
}

interface Organization {
  id: string;
  name: string;
  organization_type: string;
  description?: string;
  influence_level: 'High' | 'Medium' | 'Low';
  political_leaning: string;
}

interface LegislatorOrganization {
  id: string;
  legislator_id: string;
  organization_id: string;
  relationship_type: string;
  influence_score: number;
  notes?: string;
  organization: Organization;
}

interface PolicyArea {
  id: string;
  name: string;
  description?: string;
  category: string;
  color: string;
}

interface LegislatorPolicyArea {
  id: string;
  legislator_id: string;
  policy_area_id: string;
  expertise_level: 'Expert' | 'Knowledgeable' | 'Familiar' | 'Basic';
  interest_level: 'High' | 'Medium' | 'Low';
  notes?: string;
  policy_area: PolicyArea;
}

interface LegislatorConnection {
  id: string;
  legislator_a_id: string;
  legislator_b_id: string;
  connection_type: string;
  strength: 'Strong' | 'Medium' | 'Weak';
  notes?: string;
  evidence: string[];
}

export default function LegislatorCRMPage() {
  const { user } = useAuth();
  const [legislators, setLegislators] = useState<any[]>([]);
  const [selectedLegislator, setSelectedLegislator] = useState<any>(null);
  const [staffMembers, setStaffMembers] = useState<StaffMember[]>([]);
  const [organizations, setOrganizations] = useState<Organization[]>([]);
  const [legislatorOrganizations, setLegislatorOrganizations] = useState<LegislatorOrganization[]>([]);
  const [policyAreas, setPolicyAreas] = useState<PolicyArea[]>([]);
  const [legislatorPolicyAreas, setLegislatorPolicyAreas] = useState<LegislatorPolicyArea[]>([]);
  const [connections, setConnections] = useState<LegislatorConnection[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Modal states
  const [addStaffOpen, setAddStaffOpen] = useState(false);
  const [addOrganizationOpen, setAddOrganizationOpen] = useState(false);
  const [addPolicyAreaOpen, setAddPolicyAreaOpen] = useState(false);
  
  // Action states
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Form states
  const [newStaff, setNewStaff] = useState({
    name: '',
    role: '',
    email: '',
    phone: '',
    influence_level: 'Medium' as 'High' | 'Medium' | 'Low',
    policy_areas: [] as string[],
    notes: '',
    is_primary_contact: false
  });

  const [newOrganization, setNewOrganization] = useState({
    organization_id: '',
    relationship_type: 'Member' as string,
    influence_score: 50,
    notes: ''
  });

  const [newPolicyArea, setNewPolicyArea] = useState({
    policy_area_id: '',
    expertise_level: 'Familiar' as 'Expert' | 'Knowledgeable' | 'Familiar' | 'Basic',
    interest_level: 'Medium' as 'High' | 'Medium' | 'Low',
    notes: ''
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      // TODO: Replace with actual API calls
      // Mock data for now
      setLegislators([
        {
          id: '1',
          name: 'Rep. Julie McCluskie',
          district: 'HD-13',
          party: 'D',
          chamber: 'House',
          committees: ['Appropriations', 'Education'],
          relationship_score: 'High',
          bills_sponsored: 8,
          vote_alignment: 85
        },
        {
          id: '2',
          name: 'Sen. Bob Gardner',
          district: 'SD-12',
          party: 'R',
          chamber: 'Senate',
          committees: ['Judiciary', 'Finance'],
          relationship_score: 'Medium',
          bills_sponsored: 12,
          vote_alignment: 45
        }
      ]);
      
      setPolicyAreas([
        { id: '1', name: 'Clean Energy', description: 'Renewable energy, solar, wind', category: 'Environmental', color: '#10B981' },
        { id: '2', name: 'Healthcare', description: 'Medical care, insurance', category: 'Healthcare', color: '#EF4444' },
        { id: '3', name: 'Transportation', description: 'Infrastructure, roads', category: 'Infrastructure', color: '#F59E0B' },
        { id: '4', name: 'Environment', description: 'Climate, conservation', category: 'Environmental', color: '#059669' }
      ]);
      
      setOrganizations([
        { id: '1', name: 'Colorado Democratic Caucus', organization_type: 'Caucus', influence_level: 'High', political_leaning: 'Liberal' },
        { id: '2', name: 'Colorado Clean Energy Coalition', organization_type: 'Nonprofit', influence_level: 'Medium', political_leaning: 'Liberal' },
        { id: '3', name: 'Colorado Business Association', organization_type: 'Trade Association', influence_level: 'High', political_leaning: 'Conservative' }
      ]);
      
    } catch (error) {
      console.error('Error loading data:', error);
      setErrorMessage('Failed to load CRM data');
    } finally {
      setLoading(false);
    }
  };

  const handleAddStaff = async () => {
    if (!selectedLegislator) return;
    
    try {
      setActionLoading('add-staff');
      // TODO: Replace with actual API call
      const newStaffData = {
        ...newStaff,
        id: Date.now().toString(),
        legislator_id: selectedLegislator.id
      };
      
      setStaffMembers(prev => [newStaffData, ...prev]);
      setAddStaffOpen(false);
      setNewStaff({
        name: '',
        role: '',
        email: '',
        phone: '',
        influence_level: 'Medium',
        policy_areas: [],
        notes: '',
        is_primary_contact: false
      });
      setSuccessMessage('Staff member added successfully!');
      
    } catch (error) {
      console.error('Error adding staff:', error);
      setErrorMessage('Failed to add staff member');
    } finally {
      setActionLoading(null);
    }
  };

  const handleAddOrganization = async () => {
    if (!selectedLegislator) return;
    
    try {
      setActionLoading('add-organization');
      // TODO: Replace with actual API call
      const newOrgData = {
        ...newOrganization,
        id: Date.now().toString(),
        legislator_id: selectedLegislator.id,
        organization: organizations.find(org => org.id === newOrganization.organization_id)
      };
      
      setLegislatorOrganizations(prev => [newOrgData, ...prev]);
      setAddOrganizationOpen(false);
      setNewOrganization({
        organization_id: '',
        relationship_type: 'Member',
        influence_score: 50,
        notes: ''
      });
      setSuccessMessage('Organization relationship added successfully!');
      
    } catch (error) {
      console.error('Error adding organization:', error);
      setErrorMessage('Failed to add organization relationship');
    } finally {
      setActionLoading(null);
    }
  };

  const handleAddPolicyArea = async () => {
    if (!selectedLegislator) return;
    
    try {
      setActionLoading('add-policy-area');
      // TODO: Replace with actual API call
      const newPolicyData = {
        ...newPolicyArea,
        id: Date.now().toString(),
        legislator_id: selectedLegislator.id,
        policy_area: policyAreas.find(area => area.id === newPolicyArea.policy_area_id)
      };
      
      setLegislatorPolicyAreas(prev => [newPolicyData, ...prev]);
      setAddPolicyAreaOpen(false);
      setNewPolicyArea({
        policy_area_id: '',
        expertise_level: 'Familiar',
        interest_level: 'Medium',
        notes: ''
      });
      setSuccessMessage('Policy area added successfully!');
      
    } catch (error) {
      console.error('Error adding policy area:', error);
      setErrorMessage('Failed to add policy area');
    } finally {
      setActionLoading(null);
    }
  };

  const getInfluenceColor = (level: string) => {
    switch (level) {
      case 'High': return 'bg-red-100 text-red-800 border-red-200';
      case 'Medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'Low': return 'bg-green-100 text-green-800 border-green-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getExpertiseColor = (level: string) => {
    switch (level) {
      case 'Expert': return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'Knowledgeable': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'Familiar': return 'bg-green-100 text-green-800 border-green-200';
      case 'Basic': return 'bg-gray-100 text-gray-800 border-gray-200';
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
            <div className="flex items-center space-x-4">
              <Link href="/dashboard/legislators">
                <Button variant="outline" size="sm">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to Legislators
                </Button>
              </Link>
              <div>
                <h1 className="text-3xl font-bold text-slate-900">Legislator CRM</h1>
                <p className="text-slate-600 mt-1">Manage staff, organizations, and policy relationships</p>
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

          {/* Legislator Selection */}
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Select Legislator</CardTitle>
            </CardHeader>
            <CardContent>
              <Select value={selectedLegislator?.id || ''} onValueChange={(value) => {
                const legislator = legislators.find(l => l.id === value);
                setSelectedLegislator(legislator);
                // Load related data for selected legislator
                if (legislator) {
                  // TODO: Load staff, organizations, policy areas for this legislator
                }
              }}>
                <SelectTrigger>
                  <SelectValue placeholder="Choose a legislator to manage" />
                </SelectTrigger>
                <SelectContent>
                  {legislators.map(legislator => (
                    <SelectItem key={legislator.id} value={legislator.id}>
                      {legislator.name} ({legislator.district})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </CardContent>
          </Card>

          {selectedLegislator && (
            <Tabs defaultValue="staff" className="space-y-6">
              <TabsList>
                <TabsTrigger value="staff">Staff Management</TabsTrigger>
                <TabsTrigger value="organizations">Organizations</TabsTrigger>
                <TabsTrigger value="policy">Policy Areas</TabsTrigger>
                <TabsTrigger value="network">Network View</TabsTrigger>
              </TabsList>

              {/* Staff Management Tab */}
              <TabsContent value="staff">
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between">
                    <CardTitle>Staff Members</CardTitle>
                    <Dialog open={addStaffOpen} onOpenChange={setAddStaffOpen}>
                      <DialogTrigger asChild>
                        <Button size="sm">
                          <UserPlus className="h-4 w-4 mr-2" />
                          Add Staff Member
                        </Button>
                      </DialogTrigger>
                    </Dialog>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {staffMembers.length === 0 ? (
                        <p className="text-slate-500 text-center py-8">No staff members added yet.</p>
                      ) : (
                        staffMembers.map((staff) => (
                          <div key={staff.id} className="border rounded-lg p-4">
                            <div className="flex items-start justify-between">
                              <div className="flex-1">
                                <div className="flex items-center space-x-3 mb-2">
                                  <h3 className="font-semibold">{staff.name}</h3>
                                  <Badge className={getInfluenceColor(staff.influence_level)}>
                                    {staff.influence_level} Influence
                                  </Badge>
                                  {staff.is_primary_contact && (
                                    <Badge variant="outline">Primary Contact</Badge>
                                  )}
                                </div>
                                <p className="text-sm text-slate-600 mb-2">{staff.role}</p>
                                <div className="space-y-1 text-sm">
                                  {staff.email && (
                                    <div className="flex items-center space-x-2">
                                      <Mail className="h-4 w-4 text-slate-400" />
                                      <span>{staff.email}</span>
                                    </div>
                                  )}
                                  {staff.phone && (
                                    <div className="flex items-center space-x-2">
                                      <Phone className="h-4 w-4 text-slate-400" />
                                      <span>{staff.phone}</span>
                                    </div>
                                  )}
                                  {staff.policy_areas.length > 0 && (
                                    <div className="flex items-center space-x-2">
                                      <FileText className="h-4 w-4 text-slate-400" />
                                      <span>{staff.policy_areas.join(', ')}</span>
                                    </div>
                                  )}
                                </div>
                                {staff.notes && (
                                  <p className="text-sm text-slate-600 mt-2">{staff.notes}</p>
                                )}
                              </div>
                              <div className="flex space-x-2 ml-4">
                                <Button variant="ghost" size="sm">
                                  <Edit className="h-4 w-4" />
                                </Button>
                                <Button variant="ghost" size="sm" className="text-red-600">
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </div>
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Organizations Tab */}
              <TabsContent value="organizations">
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between">
                    <CardTitle>Organizations & Affiliations</CardTitle>
                    <Dialog open={addOrganizationOpen} onOpenChange={setAddOrganizationOpen}>
                      <DialogTrigger asChild>
                        <Button size="sm">
                          <Building2 className="h-4 w-4 mr-2" />
                          Add Organization
                        </Button>
                      </DialogTrigger>
                    </Dialog>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {legislatorOrganizations.length === 0 ? (
                        <p className="text-slate-500 text-center py-8">No organizations added yet.</p>
                      ) : (
                        legislatorOrganizations.map((org) => (
                          <div key={org.id} className="border rounded-lg p-4">
                            <div className="flex items-start justify-between">
                              <div className="flex-1">
                                <div className="flex items-center space-x-3 mb-2">
                                  <h3 className="font-semibold">{org.organization.name}</h3>
                                  <Badge variant="outline">{org.organization.organization_type}</Badge>
                                  <Badge className={getInfluenceColor(org.organization.influence_level)}>
                                    {org.organization.influence_level} Influence
                                  </Badge>
                                </div>
                                <p className="text-sm text-slate-600 mb-2">
                                  {org.relationship_type} • Influence Score: {org.influence_score}/100
                                </p>
                                {org.notes && (
                                  <p className="text-sm text-slate-600">{org.notes}</p>
                                )}
                              </div>
                              <div className="flex space-x-2 ml-4">
                                <Button variant="ghost" size="sm">
                                  <Edit className="h-4 w-4" />
                                </Button>
                                <Button variant="ghost" size="sm" className="text-red-600">
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </div>
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Policy Areas Tab */}
              <TabsContent value="policy">
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between">
                    <CardTitle>Policy Areas & Expertise</CardTitle>
                    <Dialog open={addPolicyAreaOpen} onOpenChange={setAddPolicyAreaOpen}>
                      <DialogTrigger asChild>
                        <Button size="sm">
                          <FileText className="h-4 w-4 mr-2" />
                          Add Policy Area
                        </Button>
                      </DialogTrigger>
                    </Dialog>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {legislatorPolicyAreas.length === 0 ? (
                        <p className="text-slate-500 text-center py-8">No policy areas added yet.</p>
                      ) : (
                        legislatorPolicyAreas.map((policy) => (
                          <div key={policy.id} className="border rounded-lg p-4">
                            <div className="flex items-start justify-between">
                              <div className="flex-1">
                                <div className="flex items-center space-x-3 mb-2">
                                  <h3 className="font-semibold">{policy.policy_area.name}</h3>
                                  <Badge className={getExpertiseColor(policy.expertise_level)}>
                                    {policy.expertise_level} Expertise
                                  </Badge>
                                  <Badge variant="outline">{policy.interest_level} Interest</Badge>
                                </div>
                                <p className="text-sm text-slate-600 mb-2">
                                  {policy.policy_area.description}
                                </p>
                                {policy.notes && (
                                  <p className="text-sm text-slate-600">{policy.notes}</p>
                                )}
                              </div>
                              <div className="flex space-x-2 ml-4">
                                <Button variant="ghost" size="sm">
                                  <Edit className="h-4 w-4" />
                                </Button>
                                <Button variant="ghost" size="sm" className="text-red-600">
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </div>
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Network View Tab */}
              <TabsContent value="network">
                <Card>
                  <CardHeader>
                    <CardTitle>Network Connections</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-center py-8">
                      <Network className="h-12 w-12 text-slate-400 mx-auto mb-4" />
                      <p className="text-slate-500">Network visualization coming soon</p>
                      <p className="text-sm text-slate-400">This will show relationships between legislators</p>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          )}

          {/* Add Staff Member Modal */}
          <Dialog open={addStaffOpen} onOpenChange={setAddStaffOpen}>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Add Staff Member</DialogTitle>
              </DialogHeader>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="staff_name">Name *</Label>
                  <Input
                    id="staff_name"
                    value={newStaff.name}
                    onChange={(e) => setNewStaff(prev => ({ ...prev, name: e.target.value }))}
                    placeholder="e.g., Sarah Johnson"
                  />
                </div>
                <div>
                  <Label htmlFor="role">Role *</Label>
                  <Input
                    id="role"
                    value={newStaff.role}
                    onChange={(e) => setNewStaff(prev => ({ ...prev, role: e.target.value }))}
                    placeholder="e.g., Chief of Staff"
                  />
                </div>
                <div>
                  <Label htmlFor="staff_email">Email</Label>
                  <Input
                    id="staff_email"
                    type="email"
                    value={newStaff.email}
                    onChange={(e) => setNewStaff(prev => ({ ...prev, email: e.target.value }))}
                    placeholder="sarah@coleg.gov"
                  />
                </div>
                <div>
                  <Label htmlFor="staff_phone">Phone</Label>
                  <Input
                    id="staff_phone"
                    value={newStaff.phone}
                    onChange={(e) => setNewStaff(prev => ({ ...prev, phone: e.target.value }))}
                    placeholder="(303) 555-0101"
                  />
                </div>
                <div>
                  <Label htmlFor="influence_level">Influence Level</Label>
                  <Select value={newStaff.influence_level} onValueChange={(value: any) => setNewStaff(prev => ({ ...prev, influence_level: value }))}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="High">High</SelectItem>
                      <SelectItem value="Medium">Medium</SelectItem>
                      <SelectItem value="Low">Low</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="primary_contact"
                    checked={newStaff.is_primary_contact}
                    onChange={(e) => setNewStaff(prev => ({ ...prev, is_primary_contact: e.target.checked }))}
                    className="rounded"
                  />
                  <Label htmlFor="primary_contact">Primary Contact</Label>
                </div>
                <div className="col-span-2">
                  <Label htmlFor="staff_notes">Notes</Label>
                  <Textarea
                    id="staff_notes"
                    value={newStaff.notes}
                    onChange={(e) => setNewStaff(prev => ({ ...prev, notes: e.target.value }))}
                    placeholder="Additional notes about this staff member..."
                    rows={3}
                  />
                </div>
              </div>
              <div className="flex justify-end space-x-2 mt-6">
                <Button variant="outline" onClick={() => setAddStaffOpen(false)}>
                  Cancel
                </Button>
                <Button 
                  onClick={handleAddStaff}
                  disabled={!newStaff.name || !newStaff.role || actionLoading === 'add-staff'}
                  className="bg-indigo-600 hover:bg-indigo-700"
                >
                  {actionLoading === 'add-staff' ? (
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  ) : (
                    <UserPlus className="h-4 w-4 mr-2" />
                  )}
                  Add Staff Member
                </Button>
              </div>
            </DialogContent>
          </Dialog>

          {/* Add Organization Modal */}
          <Dialog open={addOrganizationOpen} onOpenChange={setAddOrganizationOpen}>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Add Organization Relationship</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="organization">Organization *</Label>
                  <Select value={newOrganization.organization_id} onValueChange={(value) => setNewOrganization(prev => ({ ...prev, organization_id: value }))}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select organization" />
                    </SelectTrigger>
                    <SelectContent>
                      {organizations.map(org => (
                        <SelectItem key={org.id} value={org.id}>{org.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="relationship_type">Relationship Type</Label>
                  <Select value={newOrganization.relationship_type} onValueChange={(value) => setNewOrganization(prev => ({ ...prev, relationship_type: value }))}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Member">Member</SelectItem>
                      <SelectItem value="Board Member">Board Member</SelectItem>
                      <SelectItem value="Chair">Chair</SelectItem>
                      <SelectItem value="Vice Chair">Vice Chair</SelectItem>
                      <SelectItem value="Supporter">Supporter</SelectItem>
                      <SelectItem value="Opponent">Opponent</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="influence_score">Influence Score (0-100)</Label>
                  <Input
                    id="influence_score"
                    type="number"
                    min="0"
                    max="100"
                    value={newOrganization.influence_score}
                    onChange={(e) => setNewOrganization(prev => ({ ...prev, influence_score: parseInt(e.target.value) || 50 }))}
                  />
                </div>
                <div>
                  <Label htmlFor="org_notes">Notes</Label>
                  <Textarea
                    id="org_notes"
                    value={newOrganization.notes}
                    onChange={(e) => setNewOrganization(prev => ({ ...prev, notes: e.target.value }))}
                    placeholder="Additional notes about this relationship..."
                    rows={3}
                  />
                </div>
              </div>
              <div className="flex justify-end space-x-2 mt-6">
                <Button variant="outline" onClick={() => setAddOrganizationOpen(false)}>
                  Cancel
                </Button>
                <Button 
                  onClick={handleAddOrganization}
                  disabled={!newOrganization.organization_id || actionLoading === 'add-organization'}
                  className="bg-indigo-600 hover:bg-indigo-700"
                >
                  {actionLoading === 'add-organization' ? (
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  ) : (
                    <Building2 className="h-4 w-4 mr-2" />
                  )}
                  Add Organization
                </Button>
              </div>
            </DialogContent>
          </Dialog>

          {/* Add Policy Area Modal */}
          <Dialog open={addPolicyAreaOpen} onOpenChange={setAddPolicyAreaOpen}>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Add Policy Area</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="policy_area">Policy Area *</Label>
                  <Select value={newPolicyArea.policy_area_id} onValueChange={(value) => setNewPolicyArea(prev => ({ ...prev, policy_area_id: value }))}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select policy area" />
                    </SelectTrigger>
                    <SelectContent>
                      {policyAreas.map(area => (
                        <SelectItem key={area.id} value={area.id}>{area.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="expertise_level">Expertise Level</Label>
                  <Select value={newPolicyArea.expertise_level} onValueChange={(value: any) => setNewPolicyArea(prev => ({ ...prev, expertise_level: value }))}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Expert">Expert</SelectItem>
                      <SelectItem value="Knowledgeable">Knowledgeable</SelectItem>
                      <SelectItem value="Familiar">Familiar</SelectItem>
                      <SelectItem value="Basic">Basic</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="interest_level">Interest Level</Label>
                  <Select value={newPolicyArea.interest_level} onValueChange={(value: any) => setNewPolicyArea(prev => ({ ...prev, interest_level: value }))}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="High">High</SelectItem>
                      <SelectItem value="Medium">Medium</SelectItem>
                      <SelectItem value="Low">Low</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="policy_notes">Notes</Label>
                  <Textarea
                    id="policy_notes"
                    value={newPolicyArea.notes}
                    onChange={(e) => setNewPolicyArea(prev => ({ ...prev, notes: e.target.value }))}
                    placeholder="Additional notes about this policy area..."
                    rows={3}
                  />
                </div>
              </div>
              <div className="flex justify-end space-x-2 mt-6">
                <Button variant="outline" onClick={() => setAddPolicyAreaOpen(false)}>
                  Cancel
                </Button>
                <Button 
                  onClick={handleAddPolicyArea}
                  disabled={!newPolicyArea.policy_area_id || actionLoading === 'add-policy-area'}
                  className="bg-indigo-600 hover:bg-indigo-700"
                >
                  {actionLoading === 'add-policy-area' ? (
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  ) : (
                    <FileText className="h-4 w-4 mr-2" />
                  )}
                  Add Policy Area
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>
    </ProtectedRoute>
  );
}
