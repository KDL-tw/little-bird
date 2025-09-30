"use client";

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { DashboardLayout } from '@/components/DashboardLayout';
import { 
  Search, 
  Plus, 
  Star, 
  Phone, 
  Mail, 
  MapPin, 
  Calendar,
  Users,
  Building2,
  Sparkles,
  AlertTriangle,
  CheckCircle,
  ArrowRight
} from "lucide-react";

// Hardcoded Colorado Legislators Data
const HARDCODED_LEGISLATORS = [
  {
    id: '1',
    name: 'Rep. Sarah Hansen',
    district: 'HD-23',
    party: 'Democrat',
    chamber: 'House',
    committee_assignments: ['Energy & Environment', 'Transportation'],
    phone: '(303) 866-2952',
    email: 'sarah.hansen@coleg.gov',
    office_location: 'Room 271',
    relationship_score: 'High',
    bills_sponsored: 8,
    vote_alignment: 85,
    last_contact: '2024-01-15',
    notes: [],
    meetings: [],
    aides: [],
    associates: [],
    affinity_groups: []
  },
  {
    id: '2',
    name: 'Sen. Michael Rodriguez',
    district: 'SD-12',
    party: 'Republican',
    chamber: 'Senate',
    committee_assignments: ['Finance', 'Health & Human Services'],
    phone: '(303) 866-4861',
    email: 'michael.rodriguez@coleg.gov',
    office_location: 'Room 200',
    relationship_score: 'Medium',
    bills_sponsored: 12,
    vote_alignment: 45,
    last_contact: '2024-01-10',
    notes: [],
    meetings: [],
    aides: [],
    associates: [],
    affinity_groups: []
  },
  {
    id: '3',
    name: 'Rep. Jennifer Martinez',
    district: 'HD-45',
    party: 'Democrat',
    chamber: 'House',
    committee_assignments: ['Education', 'Appropriations'],
    phone: '(303) 866-2947',
    email: 'jennifer.martinez@coleg.gov',
    office_location: 'Room 156',
    relationship_score: 'High',
    bills_sponsored: 15,
    vote_alignment: 92,
    last_contact: '2024-01-20',
    notes: [],
    meetings: [],
    aides: [],
    associates: [],
    affinity_groups: []
  },
  {
    id: '4',
    name: 'Sen. David Thompson',
    district: 'SD-8',
    party: 'Republican',
    chamber: 'Senate',
    committee_assignments: ['Judiciary', 'State Affairs'],
    phone: '(303) 866-4855',
    email: 'david.thompson@coleg.gov',
    office_location: 'Room 330',
    relationship_score: 'Low',
    bills_sponsored: 6,
    vote_alignment: 25,
    last_contact: '2023-12-15',
    notes: [],
    meetings: [],
    aides: [],
    associates: [],
    affinity_groups: []
  },
  {
    id: '5',
    name: 'Rep. Lisa Chen',
    district: 'HD-31',
    party: 'Democrat',
    chamber: 'House',
    committee_assignments: ['Health & Insurance', 'Public Health'],
    phone: '(303) 866-2934',
    email: 'lisa.chen@coleg.gov',
    office_location: 'Room 201',
    relationship_score: 'Medium',
    bills_sponsored: 9,
    vote_alignment: 78,
    last_contact: '2024-01-12',
    notes: [],
    meetings: [],
    aides: [],
    associates: [],
    affinity_groups: []
  },
  {
    id: '6',
    name: 'Sen. Robert Johnson',
    district: 'SD-15',
    party: 'Republican',
    chamber: 'Senate',
    committee_assignments: ['Agriculture & Natural Resources', 'Transportation'],
    phone: '(303) 866-4842',
    email: 'robert.johnson@coleg.gov',
    office_location: 'Room 280',
    relationship_score: 'Medium',
    bills_sponsored: 11,
    vote_alignment: 52,
    last_contact: '2024-01-08',
    notes: [],
    meetings: [],
    aides: [],
    associates: [],
    affinity_groups: []
  },
  {
    id: '7',
    name: 'Rep. Maria Garcia',
    district: 'HD-52',
    party: 'Democrat',
    chamber: 'House',
    committee_assignments: ['Business Affairs & Labor', 'Finance'],
    phone: '(303) 866-2958',
    email: 'maria.garcia@coleg.gov',
    office_location: 'Room 307',
    relationship_score: 'High',
    bills_sponsored: 13,
    vote_alignment: 88,
    last_contact: '2024-01-18',
    notes: [],
    meetings: [],
    aides: [],
    associates: [],
    affinity_groups: []
  },
  {
    id: '8',
    name: 'Sen. James Wilson',
    district: 'SD-22',
    party: 'Republican',
    chamber: 'Senate',
    committee_assignments: ['Education', 'Local Government'],
    phone: '(303) 866-4833',
    email: 'james.wilson@coleg.gov',
    office_location: 'Room 245',
    relationship_score: 'Low',
    bills_sponsored: 7,
    vote_alignment: 38,
    last_contact: '2023-12-20',
    notes: [],
    meetings: [],
    aides: [],
    associates: [],
    affinity_groups: []
  },
  {
    id: '9',
    name: 'Rep. Amanda Lee',
    district: 'HD-38',
    party: 'Democrat',
    chamber: 'House',
    committee_assignments: ['Housing', 'Transportation'],
    phone: '(303) 866-2967',
    email: 'amanda.lee@coleg.gov',
    office_location: 'Room 189',
    relationship_score: 'Medium',
    bills_sponsored: 10,
    vote_alignment: 75,
    last_contact: '2024-01-14',
    notes: [],
    meetings: [],
    aides: [],
    associates: [],
    affinity_groups: []
  },
  {
    id: '10',
    name: 'Sen. Patricia Brown',
    district: 'SD-5',
    party: 'Republican',
    chamber: 'Senate',
    committee_assignments: ['Health & Human Services', 'Appropriations'],
    phone: '(303) 866-4821',
    email: 'patricia.brown@coleg.gov',
    office_location: 'Room 350',
    relationship_score: 'Medium',
    bills_sponsored: 14,
    vote_alignment: 58,
    last_contact: '2024-01-16',
    notes: [],
    meetings: [],
    aides: [],
    associates: [],
    affinity_groups: []
  }
];

interface Legislator {
  id: string;
  name: string;
  district: string;
  party: string;
  chamber: string;
  committee_assignments: string[];
  phone: string;
  email: string;
  office_location: string;
  relationship_score: string;
  bills_sponsored: number;
  vote_alignment: number;
  last_contact: string;
}

interface Note {
  id: string;
  content: string;
  created_at: string;
}

interface Meeting {
  id: string;
  date: string;
  notes: string;
}

interface Aide {
  id: string;
  name: string;
  role: string;
}

interface Associate {
  id: string;
  name: string;
  relationship: string;
}

interface AffinityGroup {
  id: string;
  name: string;
  type: string;
}

interface LegislatorWithRelations extends Legislator {
  notes: Note[];
  meetings: Meeting[];
  aides: Aide[];
  associates: Associate[];
  affinity_groups: AffinityGroup[];
}

export default function LegislatorsPage() {
  const [legislators, setLegislators] = useState<Legislator[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterParty, setFilterParty] = useState('All');
  const [filterChamber, setFilterChamber] = useState('All');
  const [filterRelationship, setFilterRelationship] = useState('All');
  const [selectedLegislator, setSelectedLegislator] = useState<LegislatorWithRelations | null>(null);
  const [profileOpen, setProfileOpen] = useState(false);
  const [addNoteOpen, setAddNoteOpen] = useState(false);
  const [newNote, setNewNote] = useState('');

  useEffect(() => {
    loadLegislators();
  }, []);

  const loadLegislators = async () => {
    try {
      setLoading(true);
      // Use hardcoded data
      setLegislators([...HARDCODED_LEGISLATORS]);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load legislators.');
    } finally {
      setLoading(false);
    }
  };

  const handleViewProfile = async (legislator: Legislator) => {
    try {
      // Mock related data
      const mockNotes: Note[] = [
        {
          id: '1',
          content: 'Met at energy conference. Very interested in renewable energy policies.',
          created_at: '2024-01-15T10:30:00Z'
        },
        {
          id: '2',
          content: 'Follow up on transportation bill discussion.',
          created_at: '2024-01-10T14:20:00Z'
        }
      ];

      const mockMeetings: Meeting[] = [
        {
          id: '1',
          date: '2024-01-15',
          notes: 'Energy policy discussion'
        },
        {
          id: '2',
          date: '2024-01-10',
          notes: 'Transportation funding meeting'
        }
      ];

      const mockAides: Aide[] = [
        {
          id: '1',
          name: 'John Smith',
          role: 'Chief of Staff'
        },
        {
          id: '2',
          name: 'Sarah Johnson',
          role: 'Legislative Assistant'
        }
      ];

      const mockAssociates: Associate[] = [
        {
          id: '1',
          name: 'Energy Industry Group',
          relationship: 'Policy Partner'
        }
      ];

      const mockAffinityGroups: AffinityGroup[] = [
        {
          id: '1',
          name: 'Clean Energy Caucus',
          type: 'Caucus'
        }
      ];

      const legislatorWithRelations: LegislatorWithRelations = {
        ...legislator,
        notes: mockNotes,
        meetings: mockMeetings,
        aides: mockAides,
        associates: mockAssociates,
        affinity_groups: mockAffinityGroups
      };

      setSelectedLegislator(legislatorWithRelations);
      setProfileOpen(true);
    } catch (error) {
      console.error('Error loading legislator profile:', error);
    }
  };

  const handleAddNote = async () => {
    if (!selectedLegislator || !newNote.trim()) return;

    try {
      const note: Note = {
        id: Date.now().toString(),
        content: newNote,
        created_at: new Date().toISOString()
      };

      setSelectedLegislator(prev => prev ? {
        ...prev,
        notes: [...prev.notes, note]
      } : null);

      setNewNote('');
      setAddNoteOpen(false);
    } catch (error) {
      console.error('Error adding note:', error);
    }
  };

  const filteredLegislators = legislators.filter(legislator => {
    const matchesSearch = legislator.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         legislator.district.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesParty = filterParty === 'All' || legislator.party === filterParty;
    const matchesChamber = filterChamber === 'All' || legislator.chamber === filterChamber;
    const matchesRelationship = filterRelationship === 'All' || legislator.relationship_score === filterRelationship;

    return matchesSearch && matchesParty && matchesChamber && matchesRelationship;
  });

  const getRelationshipColor = (score: string) => {
    switch (score.toLowerCase()) {
      case 'high': return 'bg-green-100 text-green-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'low': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getPartyColor = (party: string) => {
    switch (party.toLowerCase()) {
      case 'democrat': return 'bg-blue-100 text-blue-800';
      case 'republican': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <Sparkles className="w-12 h-12 text-indigo-600 animate-pulse mx-auto mb-4" />
            <p className="text-lg text-slate-700">Loading legislators from database...</p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  if (error) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <AlertTriangle className="w-12 h-12 text-red-600 mx-auto mb-4" />
            <p className="text-lg text-slate-700">{error}</p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Legislators</h1>
            <p className="text-slate-600 mt-1">Manage your legislative relationships and track engagement</p>
          </div>
          <div className="flex items-center space-x-4">
            <Button variant="outline" size="sm">
              <Plus className="h-4 w-4 mr-2" />
              Add Contact
            </Button>
          </div>
        </div>

        {/* Search and Filters */}
        <Card>
          <CardContent className="pt-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div>
                <Input
                  placeholder="Search legislators..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <Select value={filterParty} onValueChange={setFilterParty}>
                <SelectTrigger>
                  <SelectValue placeholder="Filter by party" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="All">All Parties</SelectItem>
                  <SelectItem value="Democrat">Democrat</SelectItem>
                  <SelectItem value="Republican">Republican</SelectItem>
                </SelectContent>
              </Select>
              <Select value={filterChamber} onValueChange={setFilterChamber}>
                <SelectTrigger>
                  <SelectValue placeholder="Filter by chamber" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="All">All Chambers</SelectItem>
                  <SelectItem value="House">House</SelectItem>
                  <SelectItem value="Senate">Senate</SelectItem>
                </SelectContent>
              </Select>
              <Select value={filterRelationship} onValueChange={setFilterRelationship}>
                <SelectTrigger>
                  <SelectValue placeholder="Filter by relationship" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="All">All Relationships</SelectItem>
                  <SelectItem value="High">High</SelectItem>
                  <SelectItem value="Medium">Medium</SelectItem>
                  <SelectItem value="Low">Low</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Legislators Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredLegislators.map((legislator) => (
            <Card key={legislator.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-lg">{legislator.name}</CardTitle>
                    <p className="text-sm text-slate-600">{legislator.district}</p>
                  </div>
                  <div className="flex space-x-2">
                    <Badge className={getPartyColor(legislator.party)}>
                      {legislator.party}
                    </Badge>
                    <Badge className={getRelationshipColor(legislator.relationship_score)}>
                      {legislator.relationship_score}
                    </Badge>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center text-sm text-slate-600">
                    <Building2 className="h-4 w-4 mr-2" />
                    {legislator.chamber}
                  </div>
                  <div className="flex items-center text-sm text-slate-600">
                    <Phone className="h-4 w-4 mr-2" />
                    {legislator.phone}
                  </div>
                  <div className="flex items-center text-sm text-slate-600">
                    <Mail className="h-4 w-4 mr-2" />
                    {legislator.email}
                  </div>
                  <div className="flex items-center text-sm text-slate-600">
                    <MapPin className="h-4 w-4 mr-2" />
                    {legislator.office_location}
                  </div>
                  <div className="text-sm">
                    <p className="font-medium">Committees:</p>
                    <p className="text-slate-600">{legislator.committee_assignments.join(', ')}</p>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Bills Sponsored: {legislator.bills_sponsored}</span>
                    <span>Vote Alignment: {legislator.vote_alignment}%</span>
                  </div>
                  <div className="flex justify-between text-sm text-slate-500">
                    <span>Last Contact: {legislator.last_contact}</span>
                  </div>
                  <div className="flex space-x-2 pt-2">
                    <Button
                      size="sm"
                      onClick={() => handleViewProfile(legislator)}
                      className="flex-1"
                    >
                      View Profile
                    </Button>
                    <Button size="sm" variant="outline">
                      <Star className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Legislator Profile Modal */}
        <Dialog open={profileOpen} onOpenChange={setProfileOpen}>
          <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{selectedLegislator?.name} - Profile</DialogTitle>
            </DialogHeader>
            {selectedLegislator && (
              <Tabs defaultValue="overview" className="w-full">
                <TabsList className="grid w-full grid-cols-4">
                  <TabsTrigger value="overview">Overview</TabsTrigger>
                  <TabsTrigger value="notes">Notes</TabsTrigger>
                  <TabsTrigger value="meetings">Meetings</TabsTrigger>
                  <TabsTrigger value="network">Network</TabsTrigger>
                </TabsList>
                
                <TabsContent value="overview" className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <h3 className="font-semibold mb-2">Contact Information</h3>
                      <div className="space-y-2 text-sm">
                        <p><strong>Phone:</strong> {selectedLegislator.phone}</p>
                        <p><strong>Email:</strong> {selectedLegislator.email}</p>
                        <p><strong>Office:</strong> {selectedLegislator.office_location}</p>
                        <p><strong>District:</strong> {selectedLegislator.district}</p>
                      </div>
                    </div>
                    <div>
                      <h3 className="font-semibold mb-2">Legislative Info</h3>
                      <div className="space-y-2 text-sm">
                        <p><strong>Party:</strong> {selectedLegislator.party}</p>
                        <p><strong>Chamber:</strong> {selectedLegislator.chamber}</p>
                        <p><strong>Bills Sponsored:</strong> {selectedLegislator.bills_sponsored}</p>
                        <p><strong>Vote Alignment:</strong> {selectedLegislator.vote_alignment}%</p>
                      </div>
                    </div>
                  </div>
                  <div>
                    <h3 className="font-semibold mb-2">Committee Assignments</h3>
                    <div className="flex flex-wrap gap-2">
                      {selectedLegislator.committee_assignments.map((committee, index) => (
                        <Badge key={index} variant="outline">{committee}</Badge>
                      ))}
                    </div>
                  </div>
                </TabsContent>
                
                <TabsContent value="notes" className="space-y-4">
                  <div className="flex justify-between items-center">
                    <h3 className="font-semibold">Notes</h3>
                    <Button size="sm" onClick={() => setAddNoteOpen(true)}>
                      <Plus className="h-4 w-4 mr-2" />
                      Add Note
                    </Button>
                  </div>
                  <div className="space-y-3">
                    {selectedLegislator.notes.map((note) => (
                      <div key={note.id} className="border rounded-lg p-3">
                        <p className="text-sm">{note.content}</p>
                        <p className="text-xs text-slate-500 mt-1">
                          {new Date(note.created_at).toLocaleDateString()}
                        </p>
                      </div>
                    ))}
                  </div>
                </TabsContent>
                
                <TabsContent value="meetings" className="space-y-4">
                  <h3 className="font-semibold">Meeting History</h3>
                  <div className="space-y-3">
                    {selectedLegislator.meetings.map((meeting) => (
                      <div key={meeting.id} className="border rounded-lg p-3">
                        <div className="flex items-center text-sm">
                          <Calendar className="h-4 w-4 mr-2" />
                          {meeting.date}
                        </div>
                        <p className="text-sm text-slate-600 mt-1">{meeting.notes}</p>
                      </div>
                    ))}
                  </div>
                </TabsContent>
                
                <TabsContent value="network" className="space-y-4">
                  <div>
                    <h3 className="font-semibold mb-2">Staff</h3>
                    <div className="space-y-2">
                      {selectedLegislator.aides.map((aide) => (
                        <div key={aide.id} className="flex justify-between text-sm">
                          <span>{aide.name}</span>
                          <span className="text-slate-500">{aide.role}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div>
                    <h3 className="font-semibold mb-2">Associates</h3>
                    <div className="space-y-2">
                      {selectedLegislator.associates.map((associate) => (
                        <div key={associate.id} className="flex justify-between text-sm">
                          <span>{associate.name}</span>
                          <span className="text-slate-500">{associate.relationship}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div>
                    <h3 className="font-semibold mb-2">Affinity Groups</h3>
                    <div className="flex flex-wrap gap-2">
                      {selectedLegislator.affinity_groups.map((group) => (
                        <Badge key={group.id} variant="outline">{group.name}</Badge>
                      ))}
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
            )}
          </DialogContent>
        </Dialog>

        {/* Add Note Dialog */}
        <Dialog open={addNoteOpen} onOpenChange={setAddNoteOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add Note</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <Textarea
                placeholder="Enter your note..."
                value={newNote}
                onChange={(e) => setNewNote(e.target.value)}
                rows={4}
              />
              <div className="flex justify-end space-x-2">
                <Button variant="outline" onClick={() => setAddNoteOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleAddNote}>
                  Add Note
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </DashboardLayout>
  );
}