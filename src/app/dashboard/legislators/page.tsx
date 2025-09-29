"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
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
  Tag
} from "lucide-react";

interface Legislator {
  id: string;
  name: string;
  district: string;
  party: 'D' | 'R' | 'I';
  chamber: 'House' | 'Senate';
  committees: string[];
  phone: string;
  email: string;
  office: string;
  relationshipScore: 'High' | 'Medium' | 'Low' | 'None';
  billsSponsored: number;
  voteAlignment: number;
  lastContact: string;
  topicsOfInterest: string[];
  notes: Array<{ id: string; content: string; date: string; author: string }>;
  meetings: Array<{ id: string; date: string; topic: string; outcome: string }>;
}

const initialLegislators: Legislator[] = [
  {
    id: '1',
    name: 'Rep. Julie McCluskie',
    district: 'HD-13',
    party: 'D',
    chamber: 'House',
    committees: ['Appropriations', 'Education'],
    phone: '(303) 866-2952',
    email: 'julie.mccluskie@coleg.gov',
    office: 'Room 271',
    relationshipScore: 'High',
    billsSponsored: 8,
    voteAlignment: 85,
    lastContact: '2024-01-15',
    topicsOfInterest: ['Education', 'Healthcare', 'Environment'],
    notes: [
      { id: '1', content: 'Very supportive of education funding initiatives', date: '2024-01-10', author: 'John Doe' },
      { id: '2', content: 'Met at education committee hearing - very engaged', date: '2024-01-05', author: 'Jane Smith' }
    ],
    meetings: [
      { id: '1', date: '2024-01-15', topic: 'Education Budget Discussion', outcome: 'Positive - committed to support' },
      { id: '2', date: '2024-01-08', topic: 'Healthcare Reform', outcome: 'Neutral - needs more info' }
    ]
  },
  {
    id: '2',
    name: 'Sen. Bob Gardner',
    district: 'SD-12',
    party: 'R',
    chamber: 'Senate',
    committees: ['Judiciary', 'Finance'],
    phone: '(303) 866-4880',
    email: 'bob.gardner@coleg.gov',
    office: 'Room 346',
    relationshipScore: 'Medium',
    billsSponsored: 12,
    voteAlignment: 45,
    lastContact: '2024-01-12',
    topicsOfInterest: ['Criminal Justice', 'Tax Policy', 'Business'],
    notes: [
      { id: '1', content: 'Conservative on fiscal issues, open to criminal justice reform', date: '2024-01-08', author: 'John Doe' }
    ],
    meetings: [
      { id: '1', date: '2024-01-12', topic: 'Criminal Justice Reform', outcome: 'Interested but cautious' }
    ]
  },
  {
    id: '3',
    name: 'Rep. Lindsey Daugherty',
    district: 'HD-24',
    party: 'D',
    chamber: 'House',
    committees: ['Transportation', 'Energy & Environment'],
    phone: '(303) 866-2953',
    email: 'lindsey.daugherty@coleg.gov',
    office: 'Room 271',
    relationshipScore: 'Low',
    billsSponsored: 5,
    voteAlignment: 70,
    lastContact: '2024-01-05',
    topicsOfInterest: ['Transportation', 'Environment', 'Infrastructure'],
    notes: [],
    meetings: []
  },
  {
    id: '4',
    name: 'Sen. Rachel Zenzinger',
    district: 'SD-19',
    party: 'D',
    chamber: 'Senate',
    committees: ['Appropriations', 'Education'],
    phone: '(303) 866-4845',
    email: 'rachel.zenzinger@coleg.gov',
    office: 'Room 346',
    relationshipScore: 'High',
    billsSponsored: 15,
    voteAlignment: 90,
    lastContact: '2024-01-14',
    topicsOfInterest: ['Education', 'Mental Health', 'Budget'],
    notes: [
      { id: '1', content: 'Strong advocate for mental health funding', date: '2024-01-12', author: 'Jane Smith' }
    ],
    meetings: [
      { id: '1', date: '2024-01-14', topic: 'Mental Health Funding', outcome: 'Very supportive' }
    ]
  },
  {
    id: '5',
    name: 'Rep. Matt Soper',
    district: 'HD-54',
    party: 'R',
    chamber: 'House',
    committees: ['Health & Insurance', 'Business Affairs'],
    phone: '(303) 866-2947',
    email: 'matt.soper@coleg.gov',
    office: 'Room 271',
    relationshipScore: 'None',
    billsSponsored: 3,
    voteAlignment: 25,
    lastContact: 'Never',
    topicsOfInterest: ['Healthcare', 'Business', 'Rural Issues'],
    notes: [],
    meetings: []
  },
  {
    id: '6',
    name: 'Sen. Kevin Priola',
    district: 'SD-13',
    party: 'R',
    chamber: 'Senate',
    committees: ['Transportation', 'Finance'],
    phone: '(303) 866-4855',
    email: 'kevin.priola@coleg.gov',
    office: 'Room 346',
    relationshipScore: 'Medium',
    billsSponsored: 7,
    voteAlignment: 60,
    lastContact: '2024-01-10',
    topicsOfInterest: ['Transportation', 'Infrastructure', 'Business'],
    notes: [
      { id: '1', content: 'Open to infrastructure discussions', date: '2024-01-08', author: 'John Doe' }
    ],
    meetings: []
  },
  {
    id: '7',
    name: 'Rep. Brianna Titone',
    district: 'HD-27',
    party: 'D',
    chamber: 'House',
    committees: ['Health & Insurance', 'Public Health'],
    phone: '(303) 866-2954',
    email: 'brianna.titone@coleg.gov',
    office: 'Room 271',
    relationshipScore: 'High',
    billsSponsored: 10,
    voteAlignment: 88,
    lastContact: '2024-01-13',
    topicsOfInterest: ['Healthcare', 'LGBTQ+ Rights', 'Public Health'],
    notes: [
      { id: '1', content: 'Champion for healthcare access', date: '2024-01-11', author: 'Jane Smith' }
    ],
    meetings: [
      { id: '1', date: '2024-01-13', topic: 'Healthcare Access', outcome: 'Fully supportive' }
    ]
  },
  {
    id: '8',
    name: 'Sen. Paul Lundeen',
    district: 'SD-09',
    party: 'R',
    chamber: 'Senate',
    committees: ['Education', 'Finance'],
    phone: '(303) 866-4853',
    email: 'paul.lundeen@coleg.gov',
    office: 'Room 346',
    relationshipScore: 'Low',
    billsSponsored: 6,
    voteAlignment: 40,
    lastContact: '2024-01-03',
    topicsOfInterest: ['Education', 'School Choice', 'Fiscal Policy'],
    notes: [],
    meetings: []
  },
  {
    id: '9',
    name: 'Rep. Dafna Michaelson Jenet',
    district: 'HD-30',
    party: 'D',
    chamber: 'House',
    committees: ['Education', 'Public Health'],
    phone: '(303) 866-2955',
    email: 'dafna.michaelsonjenet@coleg.gov',
    office: 'Room 271',
    relationshipScore: 'High',
    billsSponsored: 14,
    voteAlignment: 92,
    lastContact: '2024-01-16',
    topicsOfInterest: ['Education', 'Mental Health', 'Child Welfare'],
    notes: [
      { id: '1', content: 'Passionate about child welfare issues', date: '2024-01-14', author: 'John Doe' }
    ],
    meetings: [
      { id: '1', date: '2024-01-16', topic: 'Child Welfare Reform', outcome: 'Very engaged' }
    ]
  },
  {
    id: '10',
    name: 'Sen. Rob Woodward',
    district: 'SD-15',
    party: 'R',
    chamber: 'Senate',
    committees: ['Business Affairs', 'Finance'],
    phone: '(303) 866-4857',
    email: 'rob.woodward@coleg.gov',
    office: 'Room 346',
    relationshipScore: 'None',
    billsSponsored: 4,
    voteAlignment: 20,
    lastContact: 'Never',
    topicsOfInterest: ['Business', 'Tax Policy', 'Regulation'],
    notes: [],
    meetings: []
  },
  {
    id: '11',
    name: 'Rep. Monica Duran',
    district: 'HD-23',
    party: 'D',
    chamber: 'House',
    committees: ['Health & Insurance', 'Public Health'],
    phone: '(303) 866-2956',
    email: 'monica.duran@coleg.gov',
    office: 'Room 271',
    relationshipScore: 'Medium',
    billsSponsored: 9,
    voteAlignment: 75,
    lastContact: '2024-01-11',
    topicsOfInterest: ['Healthcare', 'Immigration', 'Social Services'],
    notes: [
      { id: '1', content: 'Supportive of healthcare access initiatives', date: '2024-01-09', author: 'Jane Smith' }
    ],
    meetings: []
  },
  {
    id: '12',
    name: 'Sen. Faith Winter',
    district: 'SD-24',
    party: 'D',
    chamber: 'Senate',
    committees: ['Transportation', 'Energy & Environment'],
    phone: '(303) 866-4859',
    email: 'faith.winter@coleg.gov',
    office: 'Room 346',
    relationshipScore: 'High',
    billsSponsored: 18,
    voteAlignment: 95,
    lastContact: '2024-01-15',
    topicsOfInterest: ['Environment', 'Transportation', 'Climate'],
    notes: [
      { id: '1', content: 'Environmental champion', date: '2024-01-13', author: 'John Doe' }
    ],
    meetings: [
      { id: '1', date: '2024-01-15', topic: 'Climate Action', outcome: 'Fully aligned' }
    ]
  },
  {
    id: '13',
    name: 'Rep. Rod Bockenfeld',
    district: 'HD-56',
    party: 'R',
    chamber: 'House',
    committees: ['Agriculture', 'Rural Affairs'],
    phone: '(303) 866-2948',
    email: 'rod.bockenfeld@coleg.gov',
    office: 'Room 271',
    relationshipScore: 'Low',
    billsSponsored: 2,
    voteAlignment: 35,
    lastContact: '2024-01-02',
    topicsOfInterest: ['Agriculture', 'Rural Development', 'Water'],
    notes: [],
    meetings: []
  },
  {
    id: '14',
    name: 'Sen. Jeff Bridges',
    district: 'SD-26',
    party: 'D',
    chamber: 'Senate',
    committees: ['Judiciary', 'Finance'],
    phone: '(303) 866-4861',
    email: 'jeff.bridges@coleg.gov',
    office: 'Room 346',
    relationshipScore: 'Medium',
    billsSponsored: 11,
    voteAlignment: 65,
    lastContact: '2024-01-09',
    topicsOfInterest: ['Criminal Justice', 'Civil Rights', 'Budget'],
    notes: [
      { id: '1', content: 'Open to criminal justice reform discussions', date: '2024-01-07', author: 'Jane Smith' }
    ],
    meetings: []
  },
  {
    id: '15',
    name: 'Rep. Marc Snyder',
    district: 'HD-50',
    party: 'D',
    chamber: 'House',
    committees: ['Transportation', 'Energy & Environment'],
    phone: '(303) 866-2957',
    email: 'marc.snyder@coleg.gov',
    office: 'Room 271',
    relationshipScore: 'High',
    billsSponsored: 13,
    voteAlignment: 87,
    lastContact: '2024-01-14',
    topicsOfInterest: ['Transportation', 'Environment', 'Infrastructure'],
    notes: [
      { id: '1', content: 'Strong supporter of infrastructure investment', date: '2024-01-12', author: 'John Doe' }
    ],
    meetings: [
      { id: '1', date: '2024-01-14', topic: 'Infrastructure Funding', outcome: 'Very supportive' }
    ]
  },
  {
    id: '16',
    name: 'Sen. Larry Liston',
    district: 'SD-10',
    party: 'R',
    chamber: 'Senate',
    committees: ['Business Affairs', 'Finance'],
    phone: '(303) 866-4863',
    email: 'larry.liston@coleg.gov',
    office: 'Room 346',
    relationshipScore: 'None',
    billsSponsored: 5,
    voteAlignment: 15,
    lastContact: 'Never',
    topicsOfInterest: ['Business', 'Tax Policy', 'Regulation'],
    notes: [],
    meetings: []
  },
  {
    id: '17',
    name: 'Rep. Iman Jodeh',
    district: 'HD-41',
    party: 'D',
    chamber: 'House',
    committees: ['Health & Insurance', 'Public Health'],
    phone: '(303) 866-2958',
    email: 'iman.jodeh@coleg.gov',
    office: 'Room 271',
    relationshipScore: 'Medium',
    billsSponsored: 7,
    voteAlignment: 80,
    lastContact: '2024-01-08',
    topicsOfInterest: ['Healthcare', 'Social Justice', 'Community Development'],
    notes: [
      { id: '1', content: 'Focused on community health initiatives', date: '2024-01-06', author: 'Jane Smith' }
    ],
    meetings: []
  },
  {
    id: '18',
    name: 'Sen. Chris Hansen',
    district: 'SD-31',
    party: 'D',
    chamber: 'Senate',
    committees: ['Energy & Environment', 'Finance'],
    phone: '(303) 866-4865',
    email: 'chris.hansen@coleg.gov',
    office: 'Room 346',
    relationshipScore: 'High',
    billsSponsored: 16,
    voteAlignment: 89,
    lastContact: '2024-01-13',
    topicsOfInterest: ['Environment', 'Energy', 'Climate'],
    notes: [
      { id: '1', content: 'Climate action leader', date: '2024-01-11', author: 'John Doe' }
    ],
    meetings: [
      { id: '1', date: '2024-01-13', topic: 'Clean Energy Transition', outcome: 'Fully committed' }
    ]
  },
  {
    id: '19',
    name: 'Rep. Stephanie Luck',
    district: 'HD-47',
    party: 'R',
    chamber: 'House',
    committees: ['Agriculture', 'Rural Affairs'],
    phone: '(303) 866-2949',
    email: 'stephanie.luck@coleg.gov',
    office: 'Room 271',
    relationshipScore: 'Low',
    billsSponsored: 3,
    voteAlignment: 30,
    lastContact: '2024-01-04',
    topicsOfInterest: ['Agriculture', 'Rural Development', 'Water Rights'],
    notes: [],
    meetings: []
  },
  {
    id: '20',
    name: 'Sen. Julie Gonzales',
    district: 'SD-34',
    party: 'D',
    chamber: 'Senate',
    committees: ['Judiciary', 'Health & Human Services'],
    phone: '(303) 866-4867',
    email: 'julie.gonzales@coleg.gov',
    office: 'Room 346',
    relationshipScore: 'High',
    billsSponsored: 19,
    voteAlignment: 93,
    lastContact: '2024-01-16',
    topicsOfInterest: ['Criminal Justice', 'Immigration', 'Civil Rights'],
    notes: [
      { id: '1', content: 'Champion for criminal justice reform', date: '2024-01-14', author: 'Jane Smith' }
    ],
    meetings: [
      { id: '1', date: '2024-01-16', topic: 'Criminal Justice Reform', outcome: 'Fully aligned' }
    ]
  }
];

export default function LegislatorsCRM() {
  const [legislators, setLegislators] = useState<Legislator[]>(initialLegislators);
  const [searchTerm, setSearchTerm] = useState('');
  const [relationshipFilter, setRelationshipFilter] = useState<string>('all');
  const [chamberFilter, setChamberFilter] = useState<string>('all');
  const [myNetworkOnly, setMyNetworkOnly] = useState(false);
  const [selectedLegislator, setSelectedLegislator] = useState<Legislator | null>(null);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [isNoteModalOpen, setIsNoteModalOpen] = useState(false);
  const [newNote, setNewNote] = useState('');
  const [noteAuthor, setNoteAuthor] = useState('John Doe');

  // Filter legislators
  const filteredLegislators = useMemo(() => {
    return legislators.filter(legislator => {
      const matchesSearch = legislator.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          legislator.district.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          legislator.committees.some(committee => 
                            committee.toLowerCase().includes(searchTerm.toLowerCase())
                          );
      
      const matchesRelationship = relationshipFilter === 'all' || legislator.relationshipScore === relationshipFilter;
      const matchesChamber = chamberFilter === 'all' || legislator.chamber === chamberFilter;
      const matchesNetwork = !myNetworkOnly || legislator.relationshipScore !== 'None';
      
      return matchesSearch && matchesRelationship && matchesChamber && matchesNetwork;
    });
  }, [legislators, searchTerm, relationshipFilter, chamberFilter, myNetworkOnly]);

  const handleViewProfile = (legislator: Legislator) => {
    setSelectedLegislator(legislator);
    setIsProfileModalOpen(true);
  };

  const handleAddNote = (legislator: Legislator) => {
    setSelectedLegislator(legislator);
    setIsNoteModalOpen(true);
  };

  const handleSaveNote = () => {
    if (!selectedLegislator || !newNote.trim()) return;
    
    const note = {
      id: Date.now().toString(),
      content: newNote,
      date: new Date().toISOString().split('T')[0],
      author: noteAuthor
    };
    
    setLegislators(legislators.map(leg => 
      leg.id === selectedLegislator.id 
        ? { ...leg, notes: [...leg.notes, note] }
        : leg
    ));
    
    setNewNote('');
    setIsNoteModalOpen(false);
  };

  const getRelationshipColor = (score: Legislator['relationshipScore']) => {
    switch (score) {
      case 'High': return 'bg-green-100 text-green-800 border-green-200';
      case 'Medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'Low': return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'None': return 'bg-gray-100 text-gray-800 border-gray-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getPartyColor = (party: Legislator['party']) => {
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

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Sidebar */}
      <div className="fixed inset-y-0 left-0 w-64 bg-slate-900 text-white z-50">
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="flex items-center px-6 py-6 border-b border-slate-800">
            <span className="text-xl font-bold text-slate-400">LITTLE</span>
            <span className="text-xl font-bold text-white ml-1">BIRD</span>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-4 py-6 space-y-2">
            <a href="/dashboard" className="flex items-center px-3 py-2 text-sm font-medium text-slate-300 hover:text-white hover:bg-slate-800 rounded-lg transition-colors">
              <FileText className="w-5 h-5 mr-3" />
              Overview
            </a>
            <a href="/dashboard/bills" className="flex items-center px-3 py-2 text-sm font-medium text-slate-300 hover:text-white hover:bg-slate-800 rounded-lg transition-colors">
              <FileText className="w-5 h-5 mr-3" />
              Bills
            </a>
            <a href="/dashboard/legislators" className="flex items-center px-3 py-2 text-sm font-medium text-white bg-slate-800 rounded-lg">
              <Users className="w-5 h-5 mr-3" />
              Legislators
            </a>
            <a href="/dashboard/compliance" className="flex items-center px-3 py-2 text-sm font-medium text-slate-300 hover:text-white hover:bg-slate-800 rounded-lg transition-colors">
              <FileText className="w-5 h-5 mr-3" />
              Compliance
            </a>
            <a href="/dashboard/analytics" className="flex items-center px-3 py-2 text-sm font-medium text-slate-300 hover:text-white hover:bg-slate-800 rounded-lg transition-colors">
              <FileText className="w-5 h-5 mr-3" />
              Analytics
            </a>
            <a href="/dashboard/settings" className="flex items-center px-3 py-2 text-sm font-medium text-slate-300 hover:text-white hover:bg-slate-800 rounded-lg transition-colors">
              <FileText className="w-5 h-5 mr-3" />
              Settings
            </a>
          </nav>

          {/* Back to Home */}
          <div className="p-4 border-t border-slate-800">
            <a href="/">
              <Button variant="outline" className="w-full border-slate-700 text-slate-300 hover:bg-slate-800 hover:text-white">
                <FileText className="w-4 h-4 mr-2" />
                Back to Home
              </Button>
            </a>
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
              <p className="text-slate-600">Manage relationships with Colorado legislators</p>
            </div>
            <div className="flex items-center space-x-4">
              <div className="w-10 h-10 bg-indigo-600 rounded-full flex items-center justify-center">
                <span className="text-white font-semibold text-sm">JD</span>
              </div>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="p-6">
          {/* Filters and Search */}
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Filter className="w-5 h-5 mr-2" />
                Filters & Search
              </CardTitle>
              <CardDescription>
                Filter legislators by relationship, chamber, or search by name, district, or committee
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                {/* Search */}
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
                  <Input
                    placeholder="Search legislators..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>

                {/* Relationship Filter */}
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

                {/* Chamber Filter */}
                <Select value={chamberFilter} onValueChange={setChamberFilter}>
                  <SelectTrigger>
                    <SelectValue placeholder="Chamber" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Chambers</SelectItem>
                    <SelectItem value="House">House</SelectItem>
                    <SelectItem value="Senate">Senate</SelectItem>
                  </SelectContent>
                </Select>

                {/* My Network Toggle */}
                <Button
                  variant={myNetworkOnly ? "default" : "outline"}
                  onClick={() => setMyNetworkOnly(!myNetworkOnly)}
                  className="flex items-center"
                >
                  {myNetworkOnly ? <Star className="w-4 h-4 mr-2" /> : <StarOff className="w-4 h-4 mr-2" />}
                  My Network
                </Button>

                {/* Add Legislator Button */}
                <Button className="w-full">
                  <Plus className="w-4 h-4 mr-2" />
                  Add Legislator
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Legislators Table */}
          <Card>
            <CardHeader>
              <CardTitle>Legislators ({filteredLegislators.length})</CardTitle>
              <CardDescription>
                {myNetworkOnly 
                  ? `Showing ${filteredLegislators.length} legislators in your network`
                  : `All ${filteredLegislators.length} Colorado legislators`
                }
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>District</TableHead>
                      <TableHead>Party</TableHead>
                      <TableHead>Chamber</TableHead>
                      <TableHead>Committees</TableHead>
                      <TableHead>Relationship</TableHead>
                      <TableHead>Bills</TableHead>
                      <TableHead>Alignment</TableHead>
                      <TableHead>Last Contact</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredLegislators.map((legislator) => (
                      <TableRow key={legislator.id}>
                        <TableCell className="font-medium">
                          <div className="flex items-center space-x-3">
                            <Avatar className="w-8 h-8">
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
                          <div className="flex flex-wrap gap-1">
                            {legislator.committees.slice(0, 2).map((committee, index) => (
                              <Badge key={index} variant="outline" className="text-xs">
                                {committee}
                              </Badge>
                            ))}
                            {legislator.committees.length > 2 && (
                              <Badge variant="outline" className="text-xs">
                                +{legislator.committees.length - 2}
                              </Badge>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge className={getRelationshipColor(legislator.relationshipScore)}>
                            {legislator.relationshipScore}
                          </Badge>
                        </TableCell>
                        <TableCell>{legislator.billsSponsored}</TableCell>
                        <TableCell>
                          <span className={getVoteAlignmentColor(legislator.voteAlignment)}>
                            {legislator.voteAlignment}%
                          </span>
                        </TableCell>
                        <TableCell>{legislator.lastContact}</TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end space-x-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleViewProfile(legislator)}
                            >
                              <Eye className="w-4 h-4" />
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleAddNote(legislator)}
                            >
                              <MessageSquare className="w-4 h-4" />
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              disabled
                              title="Coming Soon"
                            >
                              <Calendar className="w-4 h-4" />
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

          {/* View Profile Modal */}
          <Dialog open={isProfileModalOpen} onOpenChange={setIsProfileModalOpen}>
            <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle className="flex items-center space-x-3">
                  <Avatar className="w-12 h-12">
                    <AvatarFallback>
                      {selectedLegislator?.name.split(' ').map(n => n[0]).join('')}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <div className="text-xl font-semibold">{selectedLegislator?.name}</div>
                    <div className="text-sm text-slate-500">{selectedLegislator?.district} • {selectedLegislator?.chamber}</div>
                  </div>
                </DialogTitle>
              </DialogHeader>
              
              {selectedLegislator && (
                <Tabs defaultValue="overview" className="w-full">
                  <TabsList className="grid w-full grid-cols-4">
                    <TabsTrigger value="overview">Overview</TabsTrigger>
                    <TabsTrigger value="bills">Sponsored Bills</TabsTrigger>
                    <TabsTrigger value="meetings">Meetings</TabsTrigger>
                    <TabsTrigger value="notes">Notes</TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="overview" className="space-y-6">
                    <div className="grid grid-cols-2 gap-6">
                      <div>
                        <h3 className="font-semibold mb-3">Contact Information</h3>
                        <div className="space-y-2">
                          <div className="flex items-center space-x-2">
                            <Phone className="w-4 h-4 text-slate-400" />
                            <span>{selectedLegislator.phone}</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Mail className="w-4 h-4 text-slate-400" />
                            <span>{selectedLegislator.email}</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <MapPin className="w-4 h-4 text-slate-400" />
                            <span>{selectedLegislator.office}</span>
                          </div>
                        </div>
                      </div>
                      
                      <div>
                        <h3 className="font-semibold mb-3">Committee Assignments</h3>
                        <div className="flex flex-wrap gap-2">
                          {selectedLegislator.committees.map((committee, index) => (
                            <Badge key={index} variant="outline">
                              {committee}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </div>
                    
                    <div>
                      <h3 className="font-semibold mb-3">Topics of Interest</h3>
                      <div className="flex flex-wrap gap-2">
                        {selectedLegislator.topicsOfInterest.map((topic, index) => (
                          <Badge key={index} className="bg-indigo-100 text-indigo-800">
                            <Tag className="w-3 h-3 mr-1" />
                            {topic}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="bills" className="space-y-4">
                    <div className="text-center py-8">
                      <FileText className="w-12 h-12 text-slate-400 mx-auto mb-4" />
                      <p className="text-slate-600">Sponsored Bills</p>
                      <p className="text-sm text-slate-500">{selectedLegislator.billsSponsored} bills sponsored</p>
                      <Button className="mt-4" variant="outline">
                        View All Bills
                      </Button>
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="meetings" className="space-y-4">
                    {selectedLegislator.meetings.length > 0 ? (
                      <div className="space-y-4">
                        {selectedLegislator.meetings.map((meeting) => (
                          <Card key={meeting.id}>
                            <CardContent className="pt-4">
                              <div className="flex justify-between items-start">
                                <div>
                                  <h4 className="font-medium">{meeting.topic}</h4>
                                  <p className="text-sm text-slate-600">{meeting.outcome}</p>
                                </div>
                                <div className="text-sm text-slate-500">
                                  <Clock className="w-4 h-4 inline mr-1" />
                                  {meeting.date}
                                </div>
                              </div>
                            </CardContent>
                          </Card>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-8">
                        <Calendar className="w-12 h-12 text-slate-400 mx-auto mb-4" />
                        <p className="text-slate-600">No meetings recorded</p>
                        <p className="text-sm text-slate-500">Schedule your first meeting to start building this relationship</p>
                      </div>
                    )}
                  </TabsContent>
                  
                  <TabsContent value="notes" className="space-y-4">
                    {selectedLegislator.notes.length > 0 ? (
                      <div className="space-y-4">
                        {selectedLegislator.notes.map((note) => (
                          <Card key={note.id}>
                            <CardContent className="pt-4">
                              <div className="flex justify-between items-start mb-2">
                                <span className="text-sm font-medium">{note.author}</span>
                                <span className="text-sm text-slate-500">{note.date}</span>
                              </div>
                              <p className="text-sm">{note.content}</p>
                            </CardContent>
                          </Card>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-8">
                        <MessageSquare className="w-12 h-12 text-slate-400 mx-auto mb-4" />
                        <p className="text-slate-600">No notes yet</p>
                        <p className="text-sm text-slate-500">Add notes to track your interactions and insights</p>
                      </div>
                    )}
                  </TabsContent>
                </Tabs>
              )}
            </DialogContent>
          </Dialog>

          {/* Add Note Modal */}
          <Dialog open={isNoteModalOpen} onOpenChange={setIsNoteModalOpen}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add Note</DialogTitle>
                <DialogDescription>
                  Add a note for {selectedLegislator?.name}
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium">Author</label>
                  <Input
                    value={noteAuthor}
                    onChange={(e) => setNoteAuthor(e.target.value)}
                    placeholder="Your name"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">Note</label>
                  <Textarea
                    value={newNote}
                    onChange={(e) => setNewNote(e.target.value)}
                    placeholder="Enter your note here..."
                    rows={4}
                  />
                </div>
              </div>
              <DialogFooter>
                <Button onClick={handleSaveNote}>Save Note</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </main>
      </div>
    </div>
  );
}
