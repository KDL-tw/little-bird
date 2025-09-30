"use client";

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { DashboardLayout } from '@/components/DashboardLayout';
import { 
  Search, 
  Plus, 
  Star, 
  AlertCircle, 
  CheckCircle, 
  Loader2, 
  Users, 
  FileText, 
  Sparkles,
  MessageSquare,
  Link as LinkIcon,
  Tag,
  Eye,
  Edit,
  Trash2,
  Calendar,
  DollarSign,
  FileEdit,
  ArrowRight
} from 'lucide-react';
import Link from 'next/link';

// Enhanced Bill Interface
interface Bill {
  id: string;
  bill_number: string;
  title: string;
  sponsor: string;
  status: string;
  last_action: string;
  position: 'Support' | 'Oppose' | 'Monitor' | 'None';
  priority: 'High' | 'Medium' | 'Low' | 'None';
  watchlist: boolean;
  client_id: string | null;
  notes: string;
  fiscal_note_url?: string;
  amendments: Amendment[];
  ai_analysis?: AIAnalysis;
  created_at: string;
  updated_at: string;
}

interface Amendment {
  id: string;
  title: string;
  description: string;
  status: 'Proposed' | 'Accepted' | 'Rejected';
  suggested_by: string;
  created_at: string;
}

interface AIAnalysis {
  summary: string;
  key_provisions: string[];
  stakeholder_impact: string;
  similar_bills: string[];
  passage_likelihood: number;
  last_updated: string;
}

interface Client {
  id: string;
  name: string;
  type: string;
}

interface Legislator {
  id: string;
  name: string;
  district: string;
  chamber: string;
  party: string;
}

// Enhanced hardcoded data
const HARDCODED_BILLS: Bill[] = [
  {
    id: '1',
    bill_number: 'HB24-1001',
    title: 'Colorado Energy Storage Tax Credit',
    sponsor: 'Rep. Hansen',
    status: 'Active',
    last_action: 'Passed House Committee',
    position: 'Support',
    priority: 'High',
    watchlist: true,
    client_id: '1',
    notes: 'Strong support from clean energy coalition. Key priority for Q1.',
    fiscal_note_url: 'https://leg.colorado.gov/sites/default/files/fiscal_notes/2024/hb24-1001.pdf',
    amendments: [
      {
        id: '1',
        title: 'Increase Tax Credit Amount',
        description: 'Propose increasing the tax credit from 30% to 40% for residential installations',
        status: 'Proposed',
        suggested_by: 'Clean Energy Coalition',
        created_at: '2024-01-15'
      }
    ],
    ai_analysis: {
      summary: 'This bill establishes a tax credit for energy storage systems, promoting renewable energy adoption and grid stability.',
      key_provisions: [
        '30% tax credit for residential energy storage systems',
        '20% tax credit for commercial installations',
        'Maximum credit of $5,000 per residential system',
        'Credit applies to systems installed after January 1, 2024'
      ],
      stakeholder_impact: 'Positive impact on renewable energy industry, utilities, and consumers. May reduce state revenue by $2-3M annually.',
      similar_bills: ['CA AB-1140 (2023)', 'NY S-1234 (2023)', 'TX HB-456 (2023)'],
      passage_likelihood: 75,
      last_updated: '2024-01-20'
    },
    created_at: '2024-01-10',
    updated_at: '2024-01-20'
  },
  {
    id: '2',
    bill_number: 'SB24-0123',
    title: 'Renewable Energy Standards Update',
    sponsor: 'Sen. Martinez',
    status: 'Active',
    last_action: 'Introduced',
    position: 'Monitor',
    priority: 'Medium',
    watchlist: false,
    client_id: null,
    notes: 'Watching for amendments. Potential impact on existing renewable energy contracts.',
    amendments: [],
    ai_analysis: {
      summary: 'Updates Colorado\'s renewable energy standard to 100% by 2040, accelerating the state\'s clean energy transition.',
      key_provisions: [
        'Increases RPS to 80% by 2030',
        '100% renewable energy by 2040',
        'Enhanced energy storage requirements',
        'New reporting and compliance mechanisms'
      ],
      stakeholder_impact: 'Significant impact on utilities, renewable energy developers, and ratepayers. Estimated cost increase of $50M annually.',
      similar_bills: ['CA SB-100 (2018)', 'WA HB-1211 (2019)', 'NV AB-206 (2019)'],
      passage_likelihood: 60,
      last_updated: '2024-01-18'
    },
    created_at: '2024-01-05',
    updated_at: '2024-01-18'
  },
  {
    id: '3',
    bill_number: 'HB24-2005',
    title: 'Transportation Infrastructure Investment',
    sponsor: 'Rep. Johnson',
    status: 'Passed',
    last_action: 'Signed by Governor',
    position: 'Support',
    priority: 'High',
    watchlist: true,
    client_id: '2',
    notes: 'Major infrastructure win. Client secured $2M in funding for local projects.',
    amendments: [],
    ai_analysis: {
      summary: 'Comprehensive transportation infrastructure bill providing $500M in funding for roads, bridges, and public transit.',
      key_provisions: [
        '$300M for highway improvements',
        '$150M for public transit expansion',
        '$50M for bike and pedestrian infrastructure',
        'New funding mechanisms through gas tax increase'
      ],
      stakeholder_impact: 'Positive for construction industry, commuters, and local governments. Funded through 2¢ gas tax increase.',
      similar_bills: ['CA SB-1 (2017)', 'TX HB-20 (2019)', 'FL HB-385 (2020)'],
      passage_likelihood: 100,
      last_updated: '2024-01-25'
    },
    created_at: '2024-01-01',
    updated_at: '2024-01-25'
  }
];

const HARDCODED_CLIENTS: Client[] = [
  { id: '1', name: 'Clean Energy Coalition', type: 'Nonprofit' },
  { id: '2', name: 'Tech Forward', type: 'Industry Group' },
  { id: '3', name: 'Colorado Business Alliance', type: 'Trade Association' }
];

const HARDCODED_LEGISLATORS: Legislator[] = [
  { id: '1', name: 'Rep. Sarah Hansen', district: 'HD-23', chamber: 'House', party: 'Democrat' },
  { id: '2', name: 'Sen. Michael Rodriguez', district: 'SD-12', chamber: 'Senate', party: 'Republican' },
  { id: '3', name: 'Rep. Jennifer Lee', district: 'HD-45', chamber: 'House', party: 'Democrat' }
];

export default function BillsPage() {
  const [bills, setBills] = useState<Bill[]>([]);
  const [clients, setClients] = useState<Client[]>([]);
  const [legislators, setLegislators] = useState<Legislator[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedBill, setSelectedBill] = useState<Bill | null>(null);
  const [billDetailOpen, setBillDetailOpen] = useState(false);
  const [addBillOpen, setAddBillOpen] = useState(false);
  const [aiAnalysisOpen, setAiAnalysisOpen] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [newBill, setNewBill] = useState({
    bill_number: '',
    title: '',
    sponsor: '',
    status: 'Active',
    last_action: '',
    position: 'None' as const,
    priority: 'None' as const,
    client_id: '',
    watchlist: false,
    notes: ''
  });
  const [newNote, setNewNote] = useState('');
  const [newAmendment, setNewAmendment] = useState({
    title: '',
    description: '',
    suggested_by: ''
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      setBills([...HARDCODED_BILLS]);
      setClients([...HARDCODED_CLIENTS]);
      setLegislators([...HARDCODED_LEGISLATORS]);
    } catch (error) {
      console.error('Error loading data:', error);
      setErrorMessage('Failed to load data.');
    } finally {
      setLoading(false);
    }
  };

  const handleAddBill = async () => {
    try {
      const newBillData: Bill = {
        id: Date.now().toString(),
        ...newBill,
        amendments: [],
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };
      setBills(prev => [...prev, newBillData]);
      setAddBillOpen(false);
      setSuccessMessage('Bill added successfully!');
      setNewBill({
        bill_number: '',
        title: '',
        sponsor: '',
        status: 'Active',
        last_action: '',
        position: 'None',
        priority: 'None',
        client_id: '',
        watchlist: false,
        notes: ''
      });
    } catch (error) {
      console.error('Error adding bill:', error);
      setErrorMessage('Failed to add bill');
    }
  };

  const handleDeleteBill = async (id: string) => {
    if (confirm('Are you sure you want to delete this bill?')) {
      try {
        setBills(prev => prev.filter(bill => bill.id !== id));
        setSuccessMessage('Bill deleted successfully!');
      } catch (error) {
        console.error('Error deleting bill:', error);
        setErrorMessage('Failed to delete bill');
      }
    }
  };

  const handleToggleWatchlist = async (id: string, currentWatchlist: boolean) => {
    try {
      setBills(prev => prev.map(bill => 
        bill.id === id ? { ...bill, watchlist: !currentWatchlist } : bill
      ));
      setSuccessMessage(`Bill ${!currentWatchlist ? 'added to' : 'removed from'} watchlist!`);
    } catch (error) {
      console.error('Error toggling watchlist:', error);
      setErrorMessage('Failed to update watchlist');
    }
  };

  const handleUpdatePriority = async (id: string, priority: string) => {
    try {
      setBills(prev => prev.map(bill => 
        bill.id === id ? { ...bill, priority: priority as any } : bill
      ));
      setSuccessMessage('Priority updated successfully!');
    } catch (error) {
      console.error('Error updating priority:', error);
      setErrorMessage('Failed to update priority');
    }
  };

  const handleUpdatePosition = async (id: string, position: string) => {
    try {
      setBills(prev => prev.map(bill => 
        bill.id === id ? { ...bill, position: position as any } : bill
      ));
      setSuccessMessage('Position updated successfully!');
    } catch (error) {
      console.error('Error updating position:', error);
      setErrorMessage('Failed to update position');
    }
  };

  const handleAddNote = async (billId: string) => {
    if (!newNote.trim()) return;
    
    try {
      setBills(prev => prev.map(bill => 
        bill.id === billId 
          ? { ...bill, notes: bill.notes + '\n' + new Date().toLocaleString() + ': ' + newNote, updated_at: new Date().toISOString() }
          : bill
      ));
      setNewNote('');
      setSuccessMessage('Note added successfully!');
    } catch (error) {
      console.error('Error adding note:', error);
      setErrorMessage('Failed to add note');
    }
  };

  const handleAddAmendment = async (billId: string) => {
    if (!newAmendment.title.trim() || !newAmendment.description.trim()) return;
    
    try {
      const amendment: Amendment = {
        id: Date.now().toString(),
        ...newAmendment,
        status: 'Proposed',
        created_at: new Date().toISOString()
      };
      
      setBills(prev => prev.map(bill => 
        bill.id === billId 
          ? { ...bill, amendments: [...bill.amendments, amendment], updated_at: new Date().toISOString() }
          : bill
      ));
      
      setNewAmendment({ title: '', description: '', suggested_by: '' });
      setSuccessMessage('Amendment added successfully!');
    } catch (error) {
      console.error('Error adding amendment:', error);
      setErrorMessage('Failed to add amendment');
    }
  };

  const handleLinkClient = async (billId: string, clientId: string) => {
    try {
      setBills(prev => prev.map(bill => 
        bill.id === billId 
          ? { ...bill, client_id: clientId, updated_at: new Date().toISOString() }
          : bill
      ));
      setSuccessMessage('Client linked successfully!');
    } catch (error) {
      console.error('Error linking client:', error);
      setErrorMessage('Failed to link client');
    }
  };

  const filteredBills = bills.filter(bill =>
    bill.bill_number.toLowerCase().includes(searchTerm.toLowerCase()) ||
    bill.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    bill.sponsor.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'active': return 'bg-blue-100 text-blue-800';
      case 'passed': return 'bg-green-100 text-green-800';
      case 'failed': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority.toLowerCase()) {
      case 'high': return 'bg-red-100 text-red-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getPositionColor = (position: string) => {
    switch (position.toLowerCase()) {
      case 'support': return 'bg-green-100 text-green-800';
      case 'oppose': return 'bg-red-100 text-red-800';
      case 'monitor': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getClientName = (clientId: string | null) => {
    if (!clientId) return 'No client';
    const client = clients.find(c => c.id === clientId);
    return client ? client.name : 'Unknown client';
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Bills</h1>
            <p className="text-slate-600 mt-1">Track and manage Colorado legislative bills</p>
          </div>
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <Link href="/dashboard/bills/search-simple">
                <Button variant="outline" size="sm">
                  <Search className="h-4 w-4 mr-2" />
                  Search Bills
                </Button>
              </Link>
              <Button onClick={() => setAddBillOpen(true)} size="sm">
                <Plus className="h-4 w-4 mr-2" />
                Add Bill
              </Button>
            </div>
          </div>
        </div>

        {/* Search */}
        <Card>
          <CardHeader>
            <CardTitle>Search Bills</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex gap-4">
              <div className="flex-1">
                <Input
                  placeholder="Search by bill number, title, or sponsor..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Success/Error Messages */}
        {successMessage && (
          <Alert>
            <CheckCircle className="h-4 w-4" />
            <AlertDescription>{successMessage}</AlertDescription>
          </Alert>
        )}
        {errorMessage && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{errorMessage}</AlertDescription>
          </Alert>
        )}

        {/* Bills List */}
        <Card>
          <CardHeader>
            <CardTitle>Tracked Bills ({filteredBills.length})</CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="h-8 w-8 animate-spin" />
              </div>
            ) : filteredBills.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-slate-500">No bills found matching your search.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {filteredBills.map((bill) => (
                  <div key={bill.id} className="border rounded-lg p-4 hover:bg-slate-50">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-2">
                          <h3 className="font-semibold text-lg">{bill.bill_number}</h3>
                          <Badge className={getStatusColor(bill.status)}>
                            {bill.status}
                          </Badge>
                          <Badge className={getPriorityColor(bill.priority)}>
                            {bill.priority} Priority
                          </Badge>
                          <Badge className={getPositionColor(bill.position)}>
                            {bill.position}
                          </Badge>
                          {bill.watchlist && (
                            <Badge className="bg-yellow-100 text-yellow-800">
                              <Star className="h-3 w-3 mr-1" />
                              Watchlist
                            </Badge>
                          )}
                        </div>
                        <p className="text-slate-700 mb-2">{bill.title}</p>
                        <p className="text-sm text-slate-500 mb-2">
                          Sponsor: {bill.sponsor} • Last Action: {bill.last_action}
                        </p>
                        <p className="text-sm text-slate-600 mb-2">
                          Client: {getClientName(bill.client_id)} • 
                          Amendments: {bill.amendments.length} • 
                          Updated: {new Date(bill.updated_at).toLocaleDateString()}
                        </p>
                        {bill.notes && (
                          <p className="text-sm text-slate-600 italic">"{bill.notes}"</p>
                        )}
                      </div>
                      <div className="flex items-center space-x-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            setSelectedBill(bill);
                            setBillDetailOpen(true);
                          }}
                        >
                          <Eye className="h-4 w-4 mr-1" />
                          View
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleToggleWatchlist(bill.id, bill.watchlist)}
                        >
                          <Star className={`h-4 w-4 ${bill.watchlist ? 'fill-yellow-400 text-yellow-400' : ''}`} />
                        </Button>
                        <Select
                          value={bill.priority}
                          onValueChange={(value) => handleUpdatePriority(bill.id, value)}
                        >
                          <SelectTrigger className="w-32">
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
                          variant="outline"
                          size="sm"
                          onClick={() => handleDeleteBill(bill.id)}
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

        {/* Bill Detail Dialog */}
        <Dialog open={billDetailOpen} onOpenChange={setBillDetailOpen}>
          <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="flex items-center space-x-2">
                <FileText className="h-5 w-5" />
                <span>{selectedBill?.bill_number} - {selectedBill?.title}</span>
              </DialogTitle>
            </DialogHeader>
            
            {selectedBill && (
              <Tabs defaultValue="overview" className="w-full">
                <TabsList className="grid w-full grid-cols-5">
                  <TabsTrigger value="overview">Overview</TabsTrigger>
                  <TabsTrigger value="notes">Notes</TabsTrigger>
                  <TabsTrigger value="amendments">Amendments</TabsTrigger>
                  <TabsTrigger value="fiscal">Fiscal Notes</TabsTrigger>
                  <TabsTrigger value="ai">AI Analysis</TabsTrigger>
                </TabsList>
                
                <TabsContent value="overview" className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label>Bill Number</Label>
                      <p className="text-sm font-medium">{selectedBill.bill_number}</p>
                    </div>
                    <div>
                      <Label>Status</Label>
                      <Badge className={getStatusColor(selectedBill.status)}>
                        {selectedBill.status}
                      </Badge>
                    </div>
                    <div>
                      <Label>Sponsor</Label>
                      <p className="text-sm">{selectedBill.sponsor}</p>
                    </div>
                    <div>
                      <Label>Last Action</Label>
                      <p className="text-sm">{selectedBill.last_action}</p>
                    </div>
                    <div>
                      <Label>Position</Label>
                      <Select
                        value={selectedBill.position}
                        onValueChange={(value) => handleUpdatePosition(selectedBill.id, value)}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="None">None</SelectItem>
                          <SelectItem value="Support">Support</SelectItem>
                          <SelectItem value="Oppose">Oppose</SelectItem>
                          <SelectItem value="Monitor">Monitor</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label>Priority</Label>
                      <Select
                        value={selectedBill.priority}
                        onValueChange={(value) => handleUpdatePriority(selectedBill.id, value)}
                      >
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
                      <Label>Client</Label>
                      <Select
                        value={selectedBill.client_id || ''}
                        onValueChange={(value) => handleLinkClient(selectedBill.id, value)}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select client" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="">No client</SelectItem>
                          {clients.map(client => (
                            <SelectItem key={client.id} value={client.id}>
                              {client.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label>Watchlist</Label>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleToggleWatchlist(selectedBill.id, selectedBill.watchlist)}
                      >
                        <Star className={`h-4 w-4 mr-2 ${selectedBill.watchlist ? 'fill-yellow-400 text-yellow-400' : ''}`} />
                        {selectedBill.watchlist ? 'Remove from Watchlist' : 'Add to Watchlist'}
                      </Button>
                    </div>
                  </div>
                </TabsContent>
                
                <TabsContent value="notes" className="space-y-4">
                  <div>
                    <Label>Current Notes</Label>
                    <Textarea
                      value={selectedBill.notes}
                      readOnly
                      className="min-h-[100px]"
                    />
                  </div>
                  <div>
                    <Label>Add New Note</Label>
                    <div className="flex space-x-2">
                      <Input
                        value={newNote}
                        onChange={(e) => setNewNote(e.target.value)}
                        placeholder="Enter your note..."
                      />
                      <Button onClick={() => handleAddNote(selectedBill.id)}>
                        <MessageSquare className="h-4 w-4 mr-2" />
                        Add Note
                      </Button>
                    </div>
                  </div>
                </TabsContent>
                
                <TabsContent value="amendments" className="space-y-4">
                  <div>
                    <Label>Current Amendments ({selectedBill.amendments.length})</Label>
                    <div className="space-y-2">
                      {selectedBill.amendments.map((amendment) => (
                        <div key={amendment.id} className="border rounded p-3">
                          <div className="flex items-center justify-between">
                            <h4 className="font-medium">{amendment.title}</h4>
                            <Badge className={amendment.status === 'Proposed' ? 'bg-yellow-100 text-yellow-800' : 
                                           amendment.status === 'Accepted' ? 'bg-green-100 text-green-800' : 
                                           'bg-red-100 text-red-800'}>
                              {amendment.status}
                            </Badge>
                          </div>
                          <p className="text-sm text-slate-600 mt-1">{amendment.description}</p>
                          <p className="text-xs text-slate-500 mt-1">
                            Suggested by: {amendment.suggested_by} • {new Date(amendment.created_at).toLocaleDateString()}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div>
                    <Label>Add New Amendment</Label>
                    <div className="space-y-2">
                      <Input
                        value={newAmendment.title}
                        onChange={(e) => setNewAmendment({...newAmendment, title: e.target.value})}
                        placeholder="Amendment title"
                      />
                      <Textarea
                        value={newAmendment.description}
                        onChange={(e) => setNewAmendment({...newAmendment, description: e.target.value})}
                        placeholder="Amendment description"
                      />
                      <Input
                        value={newAmendment.suggested_by}
                        onChange={(e) => setNewAmendment({...newAmendment, suggested_by: e.target.value})}
                        placeholder="Suggested by"
                      />
                      <Button onClick={() => handleAddAmendment(selectedBill.id)}>
                        <FileEdit className="h-4 w-4 mr-2" />
                        Add Amendment
                      </Button>
                    </div>
                  </div>
                </TabsContent>
                
                <TabsContent value="fiscal" className="space-y-4">
                  <div>
                    <Label>Fiscal Note</Label>
                    {selectedBill.fiscal_note_url ? (
                      <div className="space-y-2">
                        <p className="text-sm text-slate-600">
                          Fiscal note available for this bill.
                        </p>
                        <Button asChild>
                          <a href={selectedBill.fiscal_note_url} target="_blank" rel="noopener noreferrer">
                            <DollarSign className="h-4 w-4 mr-2" />
                            View Fiscal Note
                          </a>
                        </Button>
                      </div>
                    ) : (
                      <p className="text-sm text-slate-500">No fiscal note available for this bill.</p>
                    )}
                  </div>
                </TabsContent>
                
                <TabsContent value="ai" className="space-y-4">
                  {selectedBill.ai_analysis ? (
                    <div className="space-y-4">
                      <div>
                        <Label>Executive Summary</Label>
                        <p className="text-sm text-slate-700 mt-1">{selectedBill.ai_analysis.summary}</p>
                      </div>
                      <div>
                        <Label>Key Provisions</Label>
                        <ul className="text-sm text-slate-700 mt-1 list-disc list-inside">
                          {selectedBill.ai_analysis.key_provisions.map((provision, index) => (
                            <li key={index}>{provision}</li>
                          ))}
                        </ul>
                      </div>
                      <div>
                        <Label>Stakeholder Impact</Label>
                        <p className="text-sm text-slate-700 mt-1">{selectedBill.ai_analysis.stakeholder_impact}</p>
                      </div>
                      <div>
                        <Label>Similar Bills</Label>
                        <div className="text-sm text-slate-700 mt-1">
                          {selectedBill.ai_analysis.similar_bills.map((bill, index) => (
                            <span key={index} className="inline-block bg-slate-100 rounded px-2 py-1 mr-2 mb-2">
                              {bill}
                            </span>
                          ))}
                        </div>
                      </div>
                      <div>
                        <Label>Passage Likelihood</Label>
                        <div className="flex items-center space-x-2 mt-1">
                          <div className="flex-1 bg-slate-200 rounded-full h-2">
                            <div 
                              className="bg-blue-600 h-2 rounded-full" 
                              style={{ width: `${selectedBill.ai_analysis.passage_likelihood}%` }}
                            ></div>
                          </div>
                          <span className="text-sm font-medium">{selectedBill.ai_analysis.passage_likelihood}%</span>
                        </div>
                      </div>
                      <p className="text-xs text-slate-500">
                        Last updated: {new Date(selectedBill.ai_analysis.last_updated).toLocaleString()}
                      </p>
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <Sparkles className="h-12 w-12 text-slate-400 mx-auto mb-4" />
                      <p className="text-slate-500">No AI analysis available for this bill.</p>
                      <Button className="mt-4" onClick={() => setAiAnalysisOpen(true)}>
                        <Sparkles className="h-4 w-4 mr-2" />
                        Generate AI Analysis
                      </Button>
                    </div>
                  )}
                </TabsContent>
              </Tabs>
            )}
          </DialogContent>
        </Dialog>

        {/* Add Bill Dialog */}
        <Dialog open={addBillOpen} onOpenChange={setAddBillOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Bill</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="bill_number">Bill Number</Label>
                <Input
                  id="bill_number"
                  value={newBill.bill_number}
                  onChange={(e) => setNewBill({ ...newBill, bill_number: e.target.value })}
                  placeholder="e.g., HB24-1001"
                />
              </div>
              <div>
                <Label htmlFor="title">Title</Label>
                <Input
                  id="title"
                  value={newBill.title}
                  onChange={(e) => setNewBill({ ...newBill, title: e.target.value })}
                  placeholder="Bill title"
                />
              </div>
              <div>
                <Label htmlFor="sponsor">Sponsor</Label>
                <Input
                  id="sponsor"
                  value={newBill.sponsor}
                  onChange={(e) => setNewBill({ ...newBill, sponsor: e.target.value })}
                  placeholder="e.g., Rep. Smith"
                />
              </div>
              <div className="flex space-x-4">
                <div className="flex-1">
                  <Label htmlFor="position">Position</Label>
                  <Select
                    value={newBill.position}
                    onValueChange={(value) => setNewBill({ ...newBill, position: value as any })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="None">None</SelectItem>
                      <SelectItem value="Support">Support</SelectItem>
                      <SelectItem value="Oppose">Oppose</SelectItem>
                      <SelectItem value="Monitor">Monitor</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex-1">
                  <Label htmlFor="priority">Priority</Label>
                  <Select
                    value={newBill.priority}
                    onValueChange={(value) => setNewBill({ ...newBill, priority: value as any })}
                  >
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
              </div>
              <div>
                <Label htmlFor="client">Client</Label>
                <Select
                  value={newBill.client_id}
                  onValueChange={(value) => setNewBill({ ...newBill, client_id: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select client" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">No client</SelectItem>
                    {clients.map(client => (
                      <SelectItem key={client.id} value={client.id}>
                        {client.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="notes">Initial Notes</Label>
                <Textarea
                  id="notes"
                  value={newBill.notes}
                  onChange={(e) => setNewBill({ ...newBill, notes: e.target.value })}
                  placeholder="Add any initial notes about this bill..."
                />
              </div>
              <div className="flex justify-end space-x-2">
                <Button variant="outline" onClick={() => setAddBillOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleAddBill}>
                  Add Bill
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>

        {/* AI Analysis Dialog */}
        <Dialog open={aiAnalysisOpen} onOpenChange={setAiAnalysisOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle className="flex items-center space-x-2">
                <Sparkles className="h-5 w-5" />
                <span>AI Analysis</span>
              </DialogTitle>
            </DialogHeader>
            <div className="text-center py-8">
              <Sparkles className="h-12 w-12 text-blue-500 mx-auto mb-4" />
              <p className="text-slate-600 mb-4">
                AI analysis feature coming soon! This will provide comprehensive analysis of bills including:
              </p>
              <ul className="text-sm text-slate-500 text-left space-y-1">
                <li>• Executive summary and key provisions</li>
                <li>• Stakeholder impact analysis</li>
                <li>• Similar bills in other states</li>
                <li>• Passage likelihood prediction</li>
                <li>• Amendment suggestions</li>
              </ul>
              <Button className="mt-4" onClick={() => setAiAnalysisOpen(false)}>
                Got it
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </DashboardLayout>
  );
}