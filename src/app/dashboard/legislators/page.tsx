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
  CheckCircle
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
  const [showMyNetwork, setShowMyNetwork] = useState(false);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [isNoteModalOpen, setIsNoteModalOpen] = useState(false);
  const [selectedLegislator, setSelectedLegislator] = useState<LegislatorWithRelations | null>(null);
  const [noteContent, setNoteContent] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    const fetchLegislators = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await legislatorsService.getAll();
        setLegislators(data);
      } catch (err) {
        setError('Failed to fetch legislators: ' + (err as Error).message);
        console.error('Error fetching legislators:', err);
      }
      setLoading(false);
    };

    fetchLegislators();
  }, []);

  const getRelationshipBadgeVariant = (score: string) => {
    switch (score) {
      case 'High': return 'bg-green-100 text-green-800 border-green-200';
      case 'Medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'Low': return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'None': return 'bg-gray-100 text-gray-800 border-gray-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getPartyBadgeVariant = (party: string) => {
    switch (party) {
      case 'D': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'R': return 'bg-red-100 text-red-800 border-red-200';
      case 'I': return 'bg-purple-100 text-purple-800 border-purple-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getVoteAlignmentColor = (alignment: number) => {
    if (alignment >= 80) return 'text-green-600';
    if (alignment >= 60) return 'text-yellow-600';
    if (alignment >= 40) return 'text-orange-600';
    return 'text-red-600';
  };

  const handleViewProfile = async (legislator: Legislator) => {
    try {
      const data = await legislatorsService.getWithRelations(legislator.id);
      // Ensure all arrays are initialized
      const safeData = {
        ...data,
        notes: data.notes || [],
        meetings: data.meetings || [],
        aides: data.aides || [],
        associates: data.associates || [],
        affinityGroups: data.affinityGroups || []
      };
      setSelectedLegislator(safeData);
      setActiveTab('overview'); // Reset to overview tab
      setIsProfileModalOpen(true);
    } catch (err) {
      setError('Failed to load legislator profile: ' + (err as Error).message);
      console.error('Error loading legislator profile:', err);
    }
  };

  const handleAddNote = async () => {
    if (!selectedLegislator || !noteContent.trim()) return;

    try {
      const newNote = await notesService.create({
        legislator_id: selectedLegislator.id,
        content: noteContent,
        author: 'Current User'
      });

      setSelectedLegislator({
        ...selectedLegislator,
        notes: [newNote, ...(selectedLegislator.notes || [])]
      });

      setNoteContent('');
      setIsNoteModalOpen(false);
    } catch (err) {
      setError('Failed to add note: ' + (err as Error).message);
      console.error('Error adding note:', err);
    }
  };

  const filteredLegislators = useMemo(() => {
    return legislators.filter(legislator => {
      const matchesSearch = legislator.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           legislator.district.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           (legislator.committees || []).some(committee => 
                             committee.toLowerCase().includes(searchTerm.toLowerCase())
                           );
      const matchesRelationship = relationshipFilter === 'all' || legislator.relationship_score === relationshipFilter;
      const matchesChamber = chamberFilter === 'all' || legislator.chamber === chamberFilter;
      const matchesParty = partyFilter === 'all' || legislator.party === partyFilter;
      const matchesNetwork = !showMyNetwork || legislator.relationship_score !== 'None';
      
      return matchesSearch && matchesRelationship && matchesChamber && matchesParty && matchesNetwork;
    });
  }, [legislators, searchTerm, relationshipFilter, chamberFilter, partyFilter, showMyNetwork]);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <Sparkles className="w-12 h-12 text-indigo-600 animate-pulse mx-auto mb-4" />
          <p className="text-lg text-slate-700">Loading legislators from database...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center p-6 bg-red-50 border border-red-200 rounded-lg shadow-md">
          <AlertTriangle className="w-12 h-12 text-red-600 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-red-800 mb-2">Error Loading Legislators</h2>
          <p className="text-red-700 mb-4">{error}</p>
          <p className="text-sm text-red-600">Please ensure your Supabase environment variables are set and the database schema is applied.</p>
          <Button onClick={() => window.location.reload()} className="mt-4 bg-red-600 hover:bg-red-700 text-white">
            Retry
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Sidebar */}
      <div className="fixed inset-y-0 left-0 w-64 bg-slate-900 text-white z-50">
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="flex items-center px-6 py-6 border-b border-slate-800">
            <Link href="/" className="flex items-center">
              <span className="text-xl font-bold text-slate-400">LITTLE</span>
              <span className="text-xl font-bold text-white ml-1">BIRD</span>
            </Link>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-4 py-6 space-y-2">
            <Link href="/dashboard" className="flex items-center px-3 py-2 text-sm font-medium text-slate-300 hover:text-white hover:bg-slate-800 rounded-lg transition-colors">
              <Users className="w-5 h-5 mr-3" />
              Overview
            </Link>
            <Link href="/dashboard/bills" className="flex items-center px-3 py-2 text-sm font-medium text-slate-300 hover:text-white hover:bg-slate-800 rounded-lg transition-colors">
              <FileText className="w-5 h-5 mr-3" />
              Bills
            </Link>
            <Link href="/dashboard/legislators" className="flex items-center px-3 py-2 text-sm font-medium text-white bg-slate-800 rounded-lg">
              <Users className="w-5 h-5 mr-3" />
              Legislators
            </Link>
            <Link href="/dashboard/compliance" className="flex items-center px-3 py-2 text-sm font-medium text-slate-300 hover:text-white hover:bg-slate-800 rounded-lg transition-colors">
              <CheckCircle className="w-5 h-5 mr-3" />
              Compliance
            </Link>
            <Link href="/dashboard/analytics" className="flex items-center px-3 py-2 text-sm font-medium text-slate-300 hover:text-white hover:bg-slate-800 rounded-lg transition-colors">
              <FileText className="w-5 h-5 mr-3" />
              Analytics
            </Link>
            <Link href="/dashboard/settings" className="flex items-center px-3 py-2 text-sm font-medium text-slate-300 hover:text-white hover:bg-slate-800 rounded-lg transition-colors">
              <FileText className="w-5 h-5 mr-3" />
              Settings
            </Link>
          </nav>

          {/* Back to Home */}
          <div className="p-4 border-t border-slate-800">
            <Link href="/">
              <Button variant="outline" className="w-full border-slate-700 text-slate-300 hover:bg-slate-800 hover:text-white">
                <FileText className="w-4 h-4 mr-2" />
                Back to Home
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="ml-64">
        {/* Header */}
        <header className="bg-white border-b border-slate-200 px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-semibold text-slate-900">Legislator CRM</h1>
              <p className="text-slate-600">Manage relationships with Colorado legislators.</p>
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="myNetwork"
                  checked={showMyNetwork}
                  onChange={(e) => setShowMyNetwork(e.target.checked)}
                  className="rounded border-slate-300"
                />
                <label htmlFor="myNetwork" className="text-sm text-slate-700">My Network Only</label>
              </div>
            </div>
          </div>
        </header>

        {/* Main Legislators Content */}
        <main className="p-6">
          <Card className="bg-white border-slate-200">
            <CardHeader>
              <CardTitle className="text-lg font-semibold text-slate-900">Colorado Legislators</CardTitle>
              <CardDescription className="text-sm text-slate-600">Track relationships and manage interactions with legislators.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col md:flex-row gap-4 mb-6">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <Input
                    type="text"
                    placeholder="Search legislators..."
                    className="pl-9 w-full border-slate-300 focus:border-indigo-500 focus:ring-indigo-500"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>

                {/* Relationship Filter */}
                <Select value={relationshipFilter} onValueChange={setRelationshipFilter}>
                  <SelectTrigger className="w-[180px] border-slate-300 focus:border-indigo-500 focus:ring-indigo-500">
                    <Filter className="w-4 h-4 mr-2 text-slate-400" />
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

                {/* Chamber Filter */}
                <Select value={chamberFilter} onValueChange={setChamberFilter}>
                  <SelectTrigger className="w-[140px] border-slate-300 focus:border-indigo-500 focus:ring-indigo-500">
                    <Users className="w-4 h-4 mr-2 text-slate-400" />
                    <SelectValue placeholder="Chamber" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Chambers</SelectItem>
                    <SelectItem value="House">House</SelectItem>
                    <SelectItem value="Senate">Senate</SelectItem>
                  </SelectContent>
                </Select>

                {/* Party Filter */}
                <Select value={partyFilter} onValueChange={setPartyFilter}>
                  <SelectTrigger className="w-[120px] border-slate-300 focus:border-indigo-500 focus:ring-indigo-500">
                    <Tag className="w-4 h-4 mr-2 text-slate-400" />
                    <SelectValue placeholder="Party" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Parties</SelectItem>
                    <SelectItem value="D">Democrat</SelectItem>
                    <SelectItem value="R">Republican</SelectItem>
                    <SelectItem value="I">Independent</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-slate-50">
                      <TableHead className="text-slate-700">Name</TableHead>
                      <TableHead className="text-slate-700">District</TableHead>
                      <TableHead className="text-slate-700">Party</TableHead>
                      <TableHead className="text-slate-700">Chamber</TableHead>
                      <TableHead className="text-slate-700">Committees</TableHead>
                      <TableHead className="text-slate-700">Relationship</TableHead>
                      <TableHead className="text-slate-700">Bills</TableHead>
                      <TableHead className="text-slate-700">Alignment</TableHead>
                      <TableHead className="text-slate-700">Last Contact</TableHead>
                      <TableHead className="text-right text-slate-700">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredLegislators.map((legislator) => (
                      <TableRow key={legislator.id} className="hover:bg-slate-50">
                        <TableCell className="font-medium text-slate-900">
                          <div className="flex items-center space-x-3">
                            <Avatar className="w-8 h-8">
                              <AvatarFallback className="bg-indigo-100 text-indigo-700 text-sm">
                                {legislator.name.split(' ').map(n => n[0]).join('')}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <div className="font-medium">{legislator.name}</div>
                              <div className="text-sm text-slate-500">{legislator.office}</div>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell className="text-slate-700">{legislator.district}</TableCell>
                        <TableCell>
                          <Badge className={getPartyBadgeVariant(legislator.party)}>
                            {legislator.party}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-slate-700">{legislator.chamber}</TableCell>
                        <TableCell className="text-slate-600">
                          <div className="flex flex-wrap gap-1">
                            {(legislator.committees || []).slice(0, 2).map((committee, index) => (
                              <Badge key={index} variant="outline" className="text-xs">
                                {committee}
                              </Badge>
                            ))}
                            {(legislator.committees || []).length > 2 && (
                              <Badge variant="outline" className="text-xs">
                                +{(legislator.committees || []).length - 2}
                              </Badge>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge className={getRelationshipBadgeVariant(legislator.relationship_score)}>
                            {legislator.relationship_score}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-slate-700">{legislator.bills_sponsored}</TableCell>
                        <TableCell className={`font-medium ${getVoteAlignmentColor(legislator.vote_alignment)}`}>
                          {legislator.vote_alignment}%
                        </TableCell>
                        <TableCell className="text-slate-600">
                          {legislator.last_contact ? new Date(legislator.last_contact).toLocaleDateString() : 'Never'}
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end space-x-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleViewProfile(legislator)}
                              className="flex items-center space-x-1"
                            >
                              <Eye className="w-4 h-4" />
                              <span>Profile</span>
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => {
                                setSelectedLegislator(legislator as LegislatorWithRelations);
                                setIsNoteModalOpen(true);
                              }}
                              className="flex items-center space-x-1"
                            >
                              <MessageSquare className="w-4 h-4" />
                              <span>Note</span>
                            </Button>
                            <Button 
                              variant="outline" 
                              size="sm" 
                              onClick={() => {
                                // TODO: Implement meeting scheduling
                                alert('Meeting scheduling coming soon!');
                              }}
                            >
                              <Calendar className="w-4 h-4" />
                              <span>Meeting</span>
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>

          {/* Profile Modal */}
          <Dialog open={isProfileModalOpen} onOpenChange={setIsProfileModalOpen}>
            <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle className="flex items-center space-x-2">
                  <Users className="w-6 h-6 text-indigo-600" />
                  <span>{selectedLegislator?.name}</span>
                </DialogTitle>
                <DialogDescription>
                  Complete legislator profile and relationship management.
                </DialogDescription>
              </DialogHeader>
              {selectedLegislator && (
                <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                  <TabsList className="grid w-full grid-cols-4">
                    <TabsTrigger value="overview">Overview</TabsTrigger>
                    <TabsTrigger value="bills">Sponsored Bills</TabsTrigger>
                    <TabsTrigger value="meetings">Meetings</TabsTrigger>
                    <TabsTrigger value="notes">Notes</TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="overview" className="space-y-4">
                    <div className="grid grid-cols-2 gap-6">
                      <div>
                        <h3 className="font-semibold text-slate-900 mb-3">Contact Information</h3>
                        <div className="space-y-2">
                          <div className="flex items-center space-x-2">
                            <Phone className="w-4 h-4 text-slate-500" />
                            <span className="text-slate-700">{selectedLegislator.phone}</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Mail className="w-4 h-4 text-slate-500" />
                            <span className="text-slate-700">{selectedLegislator.email}</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <MapPin className="w-4 h-4 text-slate-500" />
                            <span className="text-slate-700">{selectedLegislator.office}</span>
                          </div>
                        </div>
                      </div>
                      <div>
                        <h3 className="font-semibold text-slate-900 mb-3">Legislative Info</h3>
                        <div className="space-y-2">
                          <div className="flex justify-between">
                            <span className="text-slate-600">District:</span>
                            <span className="font-medium">{selectedLegislator.district}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-slate-600">Party:</span>
                            <Badge className={getPartyBadgeVariant(selectedLegislator.party)}>
                              {selectedLegislator.party}
                            </Badge>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-slate-600">Chamber:</span>
                            <span className="font-medium">{selectedLegislator.chamber}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-slate-600">Bills Sponsored:</span>
                            <span className="font-medium">{selectedLegislator.bills_sponsored}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div>
                      <h3 className="font-semibold text-slate-900 mb-3">Committees</h3>
                      <div className="flex flex-wrap gap-2">
                        {(selectedLegislator.committees || []).map((committee, index) => (
                          <Badge key={index} variant="outline">
                            {committee}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    <div>
                      <h3 className="font-semibold text-slate-900 mb-3">Topics of Interest</h3>
                      <div className="flex flex-wrap gap-2">
                        {(selectedLegislator.topics_of_interest || []).map((topic, index) => (
                          <Badge key={index} className="bg-indigo-100 text-indigo-800">
                            {topic}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="bills" className="space-y-4">
                    <div className="text-center py-8 text-slate-500">
                      <FileText className="w-12 h-12 mx-auto mb-4 text-slate-400" />
                      <p>Sponsored bills will be linked here when available.</p>
                      <Button className="mt-4" onClick={() => window.open('/dashboard/bills', '_blank')}>
                        View All Bills
                      </Button>
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="meetings" className="space-y-4">
                    <div className="space-y-4">
                      {(selectedLegislator.meetings || []).length > 0 ? (
                        (selectedLegislator.meetings || []).map((meeting) => (
                          <Card key={meeting.id} className="p-4">
                            <div className="flex justify-between items-start">
                              <div>
                                <h4 className="font-medium text-slate-900">{meeting.topic}</h4>
                                <p className="text-sm text-slate-600">{meeting.outcome}</p>
                              </div>
                              <div className="text-sm text-slate-500">
                                {new Date(meeting.date).toLocaleDateString()}
                              </div>
                            </div>
                          </Card>
                        ))
                      ) : (
                        <div className="text-center py-8 text-slate-500">
                          <Calendar className="w-12 h-12 mx-auto mb-4 text-slate-400" />
                          <p>No meetings recorded yet.</p>
                        </div>
                      )}
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="notes" className="space-y-4">
                    <div className="space-y-4">
                      {(selectedLegislator.notes || []).length > 0 ? (
                        (selectedLegislator.notes || []).map((note) => (
                          <Card key={note.id} className="p-4">
                            <div className="flex justify-between items-start mb-2">
                              <span className="text-sm font-medium text-slate-900">{note.author}</span>
                              <span className="text-sm text-slate-500">
                                {new Date(note.created_at).toLocaleDateString()}
                              </span>
                            </div>
                            <p className="text-slate-700">{note.content}</p>
                          </Card>
                        ))
                      ) : (
                        <div className="text-center py-8 text-slate-500">
                          <MessageSquare className="w-12 h-12 mx-auto mb-4 text-slate-400" />
                          <p>No notes recorded yet.</p>
                        </div>
                      )}
                    </div>
                  </TabsContent>
                </Tabs>
              )}
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsProfileModalOpen(false)}>
                  Close
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>

          {/* Add Note Modal */}
          <Dialog open={isNoteModalOpen} onOpenChange={setIsNoteModalOpen}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add Note</DialogTitle>
                <DialogDescription>
                  Add a note for {selectedLegislator?.name}.
                </DialogDescription>
              </DialogHeader>
              <div className="py-4">
                <Textarea
                  placeholder="Enter your note..."
                  value={noteContent}
                  onChange={(e) => setNoteContent(e.target.value)}
                  className="min-h-[100px]"
                />
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsNoteModalOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleAddNote} disabled={!noteContent.trim()}>
                  Add Note
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </main>
      </div>
    </div>
  );
}
