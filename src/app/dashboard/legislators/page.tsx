"use client";

import { useState, useMemo, useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { DashboardLayout } from "@/components/DashboardLayout";
import { 
  Search, 
  Plus, 
  MessageSquare, 
  Calendar,
  Phone,
  Mail,
  MapPin,
  Users,
  FileText,
  Filter,
  Star,
  StarOff,
  Eye,
  Clock,
  Tag,
  Sparkles,
  AlertTriangle,
  CheckCircle,
  ArrowRight
} from "lucide-react";
import { legislatorsService, notesService, meetingsService, aidesService, associatesService, affinityGroupsService } from "@/lib/database";
import type { Legislator, Note, Meeting, Aide, Associate, AffinityGroup } from "@/lib/supabase";

interface LegislatorWithRelations extends Legislator {
  notes: Note[];
  meetings: Meeting[];
  aides: Aide[];
  associates: Associate[];
  affinityGroups: AffinityGroup[];
}

export default function LegislatorsCRM() {
  const [legislators, setLegislators] = useState<Legislator[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [relationshipFilter, setRelationshipFilter] = useState<string>('all');
  const [chamberFilter, setChamberFilter] = useState<string>('all');
  const [partyFilter, setPartyFilter] = useState<string>('all');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedLegislator, setSelectedLegislator] = useState<LegislatorWithRelations | null>(null);
  const [profileOpen, setProfileOpen] = useState(false);
  const [noteOpen, setNoteOpen] = useState(false);
  const [newNote, setNewNote] = useState({ content: '', legislator_id: '' });
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    loadLegislators();
  }, []);

  const loadLegislators = async () => {
    try {
      setLoading(true);
      const data = await legislatorsService.getAll();
      setLegislators(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load legislators');
    } finally {
      setLoading(false);
    }
  };

  const handleViewProfile = async (legislator: Legislator) => {
    try {
      // Load related data
      const [notes, meetings, aides, associates, affinityGroups] = await Promise.all([
        notesService.getByLegislatorId(legislator.id),
        meetingsService.getByLegislatorId(legislator.id),
        aidesService.getByLegislatorId(legislator.id),
        associatesService.getByLegislatorId(legislator.id),
        affinityGroupsService.getByLegislatorId(legislator.id)
      ]);

      setSelectedLegislator({
        ...legislator,
        notes,
        meetings,
        aides,
        associates,
        affinityGroups
      });
      setProfileOpen(true);
    } catch (err) {
      console.error('Error loading legislator profile:', err);
    }
  };

  const handleAddNote = async () => {
    if (!newNote.content.trim() || !newNote.legislator_id) return;

    try {
      await notesService.create({
        legislator_id: newNote.legislator_id,
        content: newNote.content,
        type: 'general'
      });
      setNewNote({ content: '', legislator_id: '' });
      setNoteOpen(false);
      loadLegislators();
    } catch (err) {
      console.error('Error adding note:', err);
    }
  };

  const filteredLegislators = useMemo(() => {
    return legislators.filter(leg => {
      const matchesSearch = leg.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           leg.district.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesRelationship = relationshipFilter === 'all' || leg.relationship_score === relationshipFilter;
      const matchesChamber = chamberFilter === 'all' || leg.chamber.toLowerCase() === chamberFilter.toLowerCase();
      const matchesParty = partyFilter === 'all' || leg.party.toLowerCase() === partyFilter.toLowerCase();
      
      return matchesSearch && matchesRelationship && matchesChamber && matchesParty;
    });
  }, [legislators, searchTerm, relationshipFilter, chamberFilter, partyFilter]);

  const getRelationshipColor = (score: string) => {
    switch (score.toLowerCase()) {
      case 'high': return 'bg-green-100 text-green-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'low': return 'bg-orange-100 text-orange-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getPartyColor = (party: string) => {
    switch (party.toLowerCase()) {
      case 'd': return 'bg-blue-100 text-blue-800';
      case 'r': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
      <DashboardLayout
        title="Legislators"
        subtitle="Loading legislators from database..."
      >
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
      <DashboardLayout
        title="Legislators"
        subtitle="Error loading legislators"
      >
        <div className="flex items-center justify-center py-12">
          <div className="text-center p-6 bg-red-50 border border-red-200 rounded-lg shadow-md">
            <AlertTriangle className="w-12 h-12 text-red-600 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-red-800 mb-2">Error Loading Legislators</h2>
            <p className="text-red-700 mb-4">{error}</p>
            <Button onClick={loadLegislators} variant="outline">
              Try Again
            </Button>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  const actions = (
    <div className="flex items-center space-x-2">
      <Link href="/dashboard/legislators/search">
        <Button variant="outline" size="sm">
          <Search className="h-4 w-4 mr-2" />
          Search Legislators
        </Button>
      </Link>
      <Link href="/dashboard/legislators/crm">
        <Button variant="outline" size="sm">
          <Users className="h-4 w-4 mr-2" />
          Advanced CRM
        </Button>
      </Link>
    </div>
  );

  return (
    <DashboardLayout
      title="Legislators"
      subtitle="Manage relationships with Colorado legislators"
      actions={actions}
    >
      {/* Search and Filters */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Search & Filter</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <Input
                placeholder="Search by name or district..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <Select value={relationshipFilter} onValueChange={setRelationshipFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Relationship" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Relationships</SelectItem>
                <SelectItem value="High">High</SelectItem>
                <SelectItem value="Medium">Medium</SelectItem>
                <SelectItem value="Low">Low</SelectItem>
                <SelectItem value="None">None</SelectItem>
              </SelectContent>
            </Select>
            <Select value={chamberFilter} onValueChange={setChamberFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Chamber" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Chambers</SelectItem>
                <SelectItem value="house">House</SelectItem>
                <SelectItem value="senate">Senate</SelectItem>
              </SelectContent>
            </Select>
            <Select value={partyFilter} onValueChange={setPartyFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Party" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Parties</SelectItem>
                <SelectItem value="d">Democrat</SelectItem>
                <SelectItem value="r">Republican</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Legislators Table */}
      <Card>
        <CardHeader>
          <CardTitle>Legislators ({filteredLegislators.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>District</TableHead>
                <TableHead>Party</TableHead>
                <TableHead>Chamber</TableHead>
                <TableHead>Relationship</TableHead>
                <TableHead>Bills Sponsored</TableHead>
                <TableHead>Last Contact</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredLegislators.map((legislator) => (
                <TableRow key={legislator.id}>
                  <TableCell>
                    <div className="flex items-center space-x-3">
                      <Avatar className="h-8 w-8">
                        <AvatarFallback>
                          {legislator.name.split(' ').map(n => n[0]).join('')}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="font-medium">{legislator.name}</div>
                        <div className="text-sm text-slate-500">{legislator.email}</div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>{legislator.district}</TableCell>
                  <TableCell>
                    <Badge className={getPartyColor(legislator.party)}>
                      {legislator.party}
                    </Badge>
                  </TableCell>
                  <TableCell>{legislator.chamber}</TableCell>
                  <TableCell>
                    <Badge className={getRelationshipColor(legislator.relationship_score)}>
                      {legislator.relationship_score}
                    </Badge>
                  </TableCell>
                  <TableCell>{legislator.bills_sponsored_count || 0}</TableCell>
                  <TableCell>
                    {legislator.last_contact_date ? 
                      new Date(legislator.last_contact_date).toLocaleDateString() : 
                      'Never'
                    }
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleViewProfile(legislator)}
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          setNewNote({ content: '', legislator_id: legislator.id });
                          setNoteOpen(true);
                        }}
                      >
                        <MessageSquare className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => alert('Meeting scheduling coming soon!')}
                      >
                        <Calendar className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Profile Modal */}
      <Dialog open={profileOpen} onOpenChange={setProfileOpen}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{selectedLegislator?.name}</DialogTitle>
            <DialogDescription>
              {selectedLegislator?.district} • {selectedLegislator?.chamber} • {selectedLegislator?.party}
            </DialogDescription>
          </DialogHeader>
          
          {selectedLegislator && (
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList>
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="bills">Sponsored Bills</TabsTrigger>
                <TabsTrigger value="meetings">Meetings</TabsTrigger>
                <TabsTrigger value="notes">Notes</TabsTrigger>
                <TabsTrigger value="network">Network</TabsTrigger>
              </TabsList>
              
              <TabsContent value="overview" className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <h4 className="font-medium mb-2">Contact Information</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex items-center">
                        <Mail className="h-4 w-4 mr-2" />
                        {selectedLegislator.email}
                      </div>
                      <div className="flex items-center">
                        <Phone className="h-4 w-4 mr-2" />
                        {selectedLegislator.phone}
                      </div>
                      <div className="flex items-center">
                        <MapPin className="h-4 w-4 mr-2" />
                        {selectedLegislator.office}
                      </div>
                    </div>
                  </div>
                  <div>
                    <h4 className="font-medium mb-2">Committee Assignments</h4>
                    <div className="space-y-1">
                      {selectedLegislator.committees?.map((committee, index) => (
                        <Badge key={index} variant="outline">{committee}</Badge>
                      ))}
                    </div>
                  </div>
                </div>
              </TabsContent>
              
              <TabsContent value="bills">
                <div className="text-center py-8 text-slate-500">
                  <FileText className="h-12 w-12 mx-auto mb-4" />
                  <p>Sponsored bills will appear here</p>
                  <Link href="/dashboard/bills">
                    <Button variant="outline" className="mt-4">
                      View All Bills
                    </Button>
                  </Link>
                </div>
              </TabsContent>
              
              <TabsContent value="meetings">
                <div className="space-y-4">
                  {selectedLegislator.meetings.length > 0 ? (
                    selectedLegislator.meetings.map((meeting) => (
                      <div key={meeting.id} className="border rounded-lg p-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <h4 className="font-medium">{meeting.title}</h4>
                            <p className="text-sm text-slate-500">{meeting.notes}</p>
                          </div>
                          <div className="text-sm text-slate-500">
                            {new Date(meeting.meeting_date).toLocaleDateString()}
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-8 text-slate-500">
                      <Calendar className="h-12 w-12 mx-auto mb-4" />
                      <p>No meetings recorded</p>
                    </div>
                  )}
                </div>
              </TabsContent>
              
              <TabsContent value="notes">
                <div className="space-y-4">
                  {selectedLegislator.notes.length > 0 ? (
                    selectedLegislator.notes.map((note) => (
                      <div key={note.id} className="border rounded-lg p-4">
                        <div className="flex items-center justify-between mb-2">
                          <Badge variant="outline">{note.type}</Badge>
                          <span className="text-sm text-slate-500">
                            {new Date(note.created_at).toLocaleDateString()}
                          </span>
                        </div>
                        <p className="text-sm">{note.content}</p>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-8 text-slate-500">
                      <MessageSquare className="h-12 w-12 mx-auto mb-4" />
                      <p>No notes recorded</p>
                    </div>
                  )}
                </div>
              </TabsContent>
              
              <TabsContent value="network">
                <div className="space-y-6">
                  <div>
                    <h4 className="font-medium mb-3">Staff Members</h4>
                    {selectedLegislator.aides.length > 0 ? (
                      <div className="space-y-2">
                        {selectedLegislator.aides.map((aide) => (
                          <div key={aide.id} className="flex items-center justify-between p-3 border rounded-lg">
                            <div>
                              <div className="font-medium">{aide.name}</div>
                              <div className="text-sm text-slate-500">{aide.role}</div>
                            </div>
                            <Badge variant="outline">{aide.influence_level}</Badge>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-slate-500">No staff members recorded</p>
                    )}
                  </div>
                  
                  <div>
                    <h4 className="font-medium mb-3">Organizations</h4>
                    {selectedLegislator.affinityGroups.length > 0 ? (
                      <div className="flex flex-wrap gap-2">
                        {selectedLegislator.affinityGroups.map((group) => (
                          <Badge key={group.id} variant="outline">{group.name}</Badge>
                        ))}
                      </div>
                    ) : (
                      <p className="text-slate-500">No organizations recorded</p>
                    )}
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          )}
        </DialogContent>
      </Dialog>

      {/* Add Note Modal */}
      <Dialog open={noteOpen} onOpenChange={setNoteOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Note</DialogTitle>
            <DialogDescription>
              Add a note about this legislator
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <Textarea
              placeholder="Enter your note..."
              value={newNote.content}
              onChange={(e) => setNewNote({...newNote, content: e.target.value})}
              rows={4}
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setNoteOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleAddNote}>
              Add Note
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
}