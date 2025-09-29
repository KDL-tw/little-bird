"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { 
  Search, 
  Plus, 
  Edit2, 
  Trash2, 
  Filter,
  FileText,
  User,
  Sparkles,
  Brain,
  TrendingUp,
  Users,
  AlertTriangle,
  CheckCircle
} from "lucide-react";
import { Progress } from "@/components/ui/progress";

interface Bill {
  id: string;
  billNumber: string;
  title: string;
  sponsor: string;
  status: 'Active' | 'Passed' | 'Failed';
  lastAction: string;
  updated: string;
  position: 'Support' | 'Monitor' | 'Oppose' | 'None' | 'Hypothetical';
  aiAnalysis?: {
    executiveSummary: string;
    keyProvisions: string[];
    stakeholderImpact: string[];
    similarBills: string[];
    passageLikelihood: number;
  };
}

const initialBills: Bill[] = [
  {
    id: '1',
    billNumber: 'HB24-1001',
    title: 'Concerning the regulation of artificial intelligence systems',
    sponsor: 'Rep. Johnson',
    status: 'Active',
    lastAction: 'Passed House Committee on Technology',
    updated: '2024-01-15',
    position: 'Support',
    aiAnalysis: {
      executiveSummary: 'This bill establishes comprehensive regulatory framework for AI systems in Colorado, requiring transparency, accountability, and bias mitigation measures. The legislation positions Colorado as a leader in responsible AI governance while balancing innovation with consumer protection.',
      keyProvisions: [
        'Mandatory AI impact assessments for high-risk systems',
        'Transparency requirements for AI decision-making processes',
        'Bias testing and mitigation protocols',
        'Consumer notification rights for AI interactions',
        'Regulatory oversight by the Colorado AI Commission'
      ],
      stakeholderImpact: [
        'Tech companies: Increased compliance costs but competitive advantage',
        'Consumers: Enhanced protection and transparency',
        'Government: New regulatory authority and enforcement responsibilities',
        'Small businesses: Exemptions for low-risk AI applications'
      ],
      similarBills: [
        'California AB-331 (AI Accountability Act)',
        'New York S-7012 (AI Transparency Bill)',
        'Illinois HB-2557 (AI Bias Prevention Act)'
      ],
      passageLikelihood: 78
    }
  },
  {
    id: '2',
    billNumber: 'SB24-0123',
    title: 'Concerning renewable energy tax incentives',
    sponsor: 'Sen. Martinez',
    status: 'Active',
    lastAction: 'Introduced in Senate',
    updated: '2024-01-14',
    position: 'Monitor',
    aiAnalysis: {
      executiveSummary: 'This legislation expands tax incentives for renewable energy investments, targeting solar, wind, and battery storage projects. The bill aims to accelerate Colorado\'s clean energy transition while supporting economic development in rural communities.',
      keyProvisions: [
        '25% tax credit for commercial renewable energy installations',
        'Enhanced incentives for community solar projects',
        'Battery storage tax credits up to $5,000 per system',
        'Rural development bonus incentives',
        '10-year sunset clause with performance metrics'
      ],
      stakeholderImpact: [
        'Renewable energy companies: Significant market expansion',
        'Rural communities: Economic development opportunities',
        'State budget: $45M annual cost through 2030',
        'Utilities: Grid modernization requirements'
      ],
      similarBills: [
        'Texas HB-1500 (Renewable Energy Tax Credits)',
        'Oregon SB-1547 (Clean Energy Investment Act)',
        'Washington HB-1110 (Green Energy Incentives)'
      ],
      passageLikelihood: 65
    }
  },
  {
    id: '3',
    billNumber: 'HB24-1056',
    title: 'Concerning public school funding formulas',
    sponsor: 'Rep. Davis',
    status: 'Passed',
    lastAction: 'Signed by Governor',
    updated: '2024-01-10',
    position: 'Support'
  },
  {
    id: '4',
    billNumber: 'SB24-0234',
    title: 'Concerning healthcare provider licensing',
    sponsor: 'Sen. Wilson',
    status: 'Active',
    lastAction: 'Amended in Senate Committee',
    updated: '2024-01-12',
    position: 'Oppose',
    aiAnalysis: {
      executiveSummary: 'This bill significantly tightens licensing requirements for healthcare providers, including mandatory continuing education hours and enhanced background checks. While intended to improve patient safety, the legislation may create barriers to healthcare access in underserved areas.',
      keyProvisions: [
        'Mandatory 40 hours annual continuing education',
        'Enhanced criminal background checks for all providers',
        'Peer review requirements for license renewals',
        'Telehealth licensing reciprocity restrictions',
        'Increased licensing fees to fund oversight programs'
      ],
      stakeholderImpact: [
        'Healthcare providers: Increased administrative burden and costs',
        'Rural communities: Potential provider shortages',
        'Patients: Higher costs due to reduced provider supply',
        'State licensing board: Expanded enforcement authority'
      ],
      similarBills: [
        'Florida HB-543 (Healthcare Licensing Reform)',
        'Arizona SB-1084 (Provider Background Check Act)',
        'Nevada AB-456 (Healthcare Education Requirements)'
      ],
      passageLikelihood: 42
    }
  },
  {
    id: '5',
    billNumber: 'HB24-1089',
    title: 'Concerning criminal justice reform measures',
    sponsor: 'Rep. Thompson',
    status: 'Failed',
    lastAction: 'Vetoed by Governor',
    updated: '2024-01-08',
    position: 'None'
  },
  {
    id: '6',
    billNumber: 'SB24-0345',
    title: 'Concerning transportation infrastructure funding',
    sponsor: 'Sen. Anderson',
    status: 'Active',
    lastAction: 'Scheduled for Floor Vote',
    updated: '2024-01-13',
    position: 'Support'
  },
  {
    id: '7',
    billNumber: 'HB24-1123',
    title: 'Concerning environmental protection standards',
    sponsor: 'Rep. Garcia',
    status: 'Active',
    lastAction: 'Passed House Committee on Environment',
    updated: '2024-01-11',
    position: 'Monitor'
  },
  {
    id: '8',
    billNumber: 'SB24-0456',
    title: 'Concerning small business tax relief',
    sponsor: 'Sen. Brown',
    status: 'Passed',
    lastAction: 'Signed by Governor',
    updated: '2024-01-09',
    position: 'Support'
  },
  {
    id: '9',
    billNumber: 'HB24-1201',
    title: 'Concerning mental health services expansion',
    sponsor: 'Rep. Lee',
    status: 'Active',
    lastAction: 'Introduced in House',
    updated: '2024-01-16',
    position: 'Hypothetical'
  },
  {
    id: '10',
    billNumber: 'SB24-0567',
    title: 'Concerning data privacy protection',
    sponsor: 'Sen. Taylor',
    status: 'Failed',
    lastAction: 'Failed Senate Vote',
    updated: '2024-01-07',
    position: 'Oppose'
  }
];

export default function BillsTracker() {
  const [bills, setBills] = useState<Bill[]>(initialBills);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [sponsorFilter, setSponsorFilter] = useState<string>('all');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isAIModalOpen, setIsAIModalOpen] = useState(false);
  const [editingBill, setEditingBill] = useState<Bill | null>(null);
  const [formData, setFormData] = useState({
    billNumber: '',
    title: '',
    sponsor: '',
    status: 'Active' as Bill['status'],
    lastAction: '',
    position: 'None' as Bill['position']
  });

  // Get unique sponsors for filter
  const sponsors = useMemo(() => {
    const uniqueSponsors = [...new Set(bills.map(bill => bill.sponsor))];
    return uniqueSponsors.sort();
  }, [bills]);

  // Filter and search bills
  const filteredBills = useMemo(() => {
    return bills.filter(bill => {
      const matchesSearch = bill.billNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          bill.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          bill.sponsor.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesStatus = statusFilter === 'all' || bill.status === statusFilter;
      const matchesSponsor = sponsorFilter === 'all' || bill.sponsor === sponsorFilter;
      
      return matchesSearch && matchesStatus && matchesSponsor;
    });
  }, [bills, searchTerm, statusFilter, sponsorFilter]);

  const handleAddBill = () => {
    const newBill: Bill = {
      id: Date.now().toString(),
      ...formData,
      updated: new Date().toISOString().split('T')[0]
    };
    setBills([...bills, newBill]);
    setFormData({
      billNumber: '',
      title: '',
      sponsor: '',
      status: 'Active',
      lastAction: '',
      position: 'None'
    });
    setIsAddModalOpen(false);
  };

  const handleEditBill = (bill: Bill) => {
    setEditingBill(bill);
    setFormData({
      billNumber: bill.billNumber,
      title: bill.title,
      sponsor: bill.sponsor,
      status: bill.status,
      lastAction: bill.lastAction,
      position: bill.position
    });
    setIsEditModalOpen(true);
  };

  const handleUpdateBill = () => {
    if (!editingBill) return;
    
    setBills(bills.map(bill => 
      bill.id === editingBill.id 
        ? { ...bill, ...formData, updated: new Date().toISOString().split('T')[0] }
        : bill
    ));
    
    setFormData({
      billNumber: '',
      title: '',
      sponsor: '',
      status: 'Active',
      lastAction: '',
      position: 'None'
    });
    setEditingBill(null);
    setIsEditModalOpen(false);
  };

  const handleDeleteBill = (id: string) => {
    setBills(bills.filter(bill => bill.id !== id));
  };

  const handleAIAnalysis = (bill: Bill) => {
    setEditingBill(bill);
    setIsAIModalOpen(true);
  };

  const getStatusBadgeVariant = (status: Bill['status']) => {
    switch (status) {
      case 'Active':
        return 'default';
      case 'Passed':
        return 'secondary';
      case 'Failed':
        return 'destructive';
      default:
        return 'default';
    }
  };

  const getPositionBadgeVariant = (position: Bill['position']) => {
    switch (position) {
      case 'Support':
        return 'default';
      case 'Monitor':
        return 'secondary';
      case 'Oppose':
        return 'destructive';
      case 'Hypothetical':
        return 'outline';
      case 'None':
        return 'outline';
      default:
        return 'outline';
    }
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
            <a href="/dashboard/bills" className="flex items-center px-3 py-2 text-sm font-medium text-white bg-slate-800 rounded-lg">
              <FileText className="w-5 h-5 mr-3" />
              Bills
            </a>
            <a href="/dashboard/legislators" className="flex items-center px-3 py-2 text-sm font-medium text-slate-300 hover:text-white hover:bg-slate-800 rounded-lg transition-colors">
              <User className="w-5 h-5 mr-3" />
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
              <h1 className="text-2xl font-semibold text-slate-900">Bills Tracker</h1>
              <p className="text-slate-600">Monitor and manage Colorado legislation</p>
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
                Filter bills by status, sponsor, or search by bill number, title, or sponsor
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                {/* Search */}
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
                  <Input
                    placeholder="Search bills..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>

                {/* Status Filter */}
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger>
                    <SelectValue placeholder="Filter by Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Statuses</SelectItem>
                    <SelectItem value="Active">Active</SelectItem>
                    <SelectItem value="Passed">Passed</SelectItem>
                    <SelectItem value="Failed">Failed</SelectItem>
                  </SelectContent>
                </Select>

                {/* Sponsor Filter */}
                <Select value={sponsorFilter} onValueChange={setSponsorFilter}>
                  <SelectTrigger>
                    <SelectValue placeholder="Filter by Sponsor" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Sponsors</SelectItem>
                    {sponsors.map(sponsor => (
                      <SelectItem key={sponsor} value={sponsor}>{sponsor}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                {/* Add Bill Button */}
                <Dialog open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
                  <DialogTrigger asChild>
                    <Button className="w-full">
                      <Plus className="w-4 h-4 mr-2" />
                      Add Bill
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                      <DialogTitle>Add New Bill</DialogTitle>
                      <DialogDescription>
                        Enter the details for the new bill you want to track.
                      </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                      <div className="grid grid-cols-4 items-center gap-4">
                        <label htmlFor="billNumber" className="text-right">
                          Bill Number
                        </label>
                        <Input
                          id="billNumber"
                          value={formData.billNumber}
                          onChange={(e) => setFormData({...formData, billNumber: e.target.value})}
                          className="col-span-3"
                          placeholder="e.g., HB24-1001"
                        />
                      </div>
                      <div className="grid grid-cols-4 items-center gap-4">
                        <label htmlFor="title" className="text-right">
                          Title
                        </label>
                        <Input
                          id="title"
                          value={formData.title}
                          onChange={(e) => setFormData({...formData, title: e.target.value})}
                          className="col-span-3"
                          placeholder="Bill title..."
                        />
                      </div>
                      <div className="grid grid-cols-4 items-center gap-4">
                        <label htmlFor="sponsor" className="text-right">
                          Sponsor
                        </label>
                        <Input
                          id="sponsor"
                          value={formData.sponsor}
                          onChange={(e) => setFormData({...formData, sponsor: e.target.value})}
                          className="col-span-3"
                          placeholder="e.g., Rep. Johnson"
                        />
                      </div>
                      <div className="grid grid-cols-4 items-center gap-4">
                        <label htmlFor="status" className="text-right">
                          Status
                        </label>
                        <Select value={formData.status} onValueChange={(value: Bill['status']) => setFormData({...formData, status: value})}>
                          <SelectTrigger className="col-span-3">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Active">Active</SelectItem>
                            <SelectItem value="Passed">Passed</SelectItem>
                            <SelectItem value="Failed">Failed</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="grid grid-cols-4 items-center gap-4">
                        <label htmlFor="lastAction" className="text-right">
                          Last Action
                        </label>
                        <Input
                          id="lastAction"
                          value={formData.lastAction}
                          onChange={(e) => setFormData({...formData, lastAction: e.target.value})}
                          className="col-span-3"
                          placeholder="Last action taken..."
                        />
                      </div>
                    </div>
                    <DialogFooter>
                      <Button type="submit" onClick={handleAddBill}>Add Bill</Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </div>
            </CardContent>
          </Card>

          {/* Bills Table */}
          <Card>
            <CardHeader>
              <CardTitle>Bills ({filteredBills.length})</CardTitle>
              <CardDescription>
                {searchTerm || statusFilter !== 'all' || sponsorFilter !== 'all' 
                  ? `Showing ${filteredBills.length} of ${bills.length} bills`
                  : `All ${bills.length} bills`
                }
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Bill Number</TableHead>
                      <TableHead>Title</TableHead>
                      <TableHead>Sponsor</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Position</TableHead>
                      <TableHead>Last Action</TableHead>
                      <TableHead>Updated</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredBills.map((bill) => (
                      <TableRow key={bill.id}>
                        <TableCell className="font-medium">{bill.billNumber}</TableCell>
                        <TableCell className="max-w-md">{bill.title}</TableCell>
                        <TableCell>{bill.sponsor}</TableCell>
                        <TableCell>
                          <Badge variant={getStatusBadgeVariant(bill.status)}>
                            {bill.status}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Badge variant={getPositionBadgeVariant(bill.position)}>
                            {bill.position}
                          </Badge>
                        </TableCell>
                        <TableCell className="max-w-xs">{bill.lastAction}</TableCell>
                        <TableCell>{bill.updated}</TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end space-x-2">
                            {bill.aiAnalysis && (
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleAIAnalysis(bill)}
                                className="bg-gradient-to-r from-purple-50 to-indigo-50 border-purple-200 hover:from-purple-100 hover:to-indigo-100"
                              >
                                <Sparkles className="w-4 h-4 mr-1" />
                                AI
                              </Button>
                            )}
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleEditBill(bill)}
                            >
                              <Edit2 className="w-4 h-4" />
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleDeleteBill(bill.id)}
                            >
                              <Trash2 className="w-4 h-4" />
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

          {/* Edit Bill Modal */}
          <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Edit Bill</DialogTitle>
                <DialogDescription>
                  Update the details for this bill.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <label htmlFor="edit-billNumber" className="text-right">
                    Bill Number
                  </label>
                  <Input
                    id="edit-billNumber"
                    value={formData.billNumber}
                    onChange={(e) => setFormData({...formData, billNumber: e.target.value})}
                    className="col-span-3"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <label htmlFor="edit-title" className="text-right">
                    Title
                  </label>
                  <Input
                    id="edit-title"
                    value={formData.title}
                    onChange={(e) => setFormData({...formData, title: e.target.value})}
                    className="col-span-3"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <label htmlFor="edit-sponsor" className="text-right">
                    Sponsor
                  </label>
                  <Input
                    id="edit-sponsor"
                    value={formData.sponsor}
                    onChange={(e) => setFormData({...formData, sponsor: e.target.value})}
                    className="col-span-3"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <label htmlFor="edit-status" className="text-right">
                    Status
                  </label>
                  <Select value={formData.status} onValueChange={(value: Bill['status']) => setFormData({...formData, status: value})}>
                    <SelectTrigger className="col-span-3">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Active">Active</SelectItem>
                      <SelectItem value="Passed">Passed</SelectItem>
                      <SelectItem value="Failed">Failed</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <label htmlFor="edit-lastAction" className="text-right">
                    Last Action
                  </label>
                  <Input
                    id="edit-lastAction"
                    value={formData.lastAction}
                    onChange={(e) => setFormData({...formData, lastAction: e.target.value})}
                    className="col-span-3"
                  />
                </div>
              </div>
              <DialogFooter>
                <Button type="submit" onClick={handleUpdateBill}>Update Bill</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>

          {/* AI Analysis Modal */}
          <Dialog open={isAIModalOpen} onOpenChange={setIsAIModalOpen}>
            <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle className="flex items-center space-x-2">
                  <Brain className="w-6 h-6 text-purple-600" />
                  <span>AI Analysis</span>
                  <Badge className="bg-gradient-to-r from-purple-100 to-indigo-100 text-purple-800 border-purple-200">
                    <Sparkles className="w-3 h-3 mr-1" />
                    AI Powered
                  </Badge>
                </DialogTitle>
                <DialogDescription>
                  Comprehensive AI analysis for {editingBill?.billNumber}: {editingBill?.title}
                </DialogDescription>
              </DialogHeader>
              
              {editingBill?.aiAnalysis && (
                <div className="space-y-6">
                  {/* Executive Summary */}
                  <div className="space-y-3">
                    <h3 className="text-lg font-semibold flex items-center">
                      <FileText className="w-5 h-5 mr-2 text-indigo-600" />
                      Executive Summary
                    </h3>
                    <p className="text-slate-700 leading-relaxed bg-slate-50 p-4 rounded-lg border">
                      {editingBill.aiAnalysis.executiveSummary}
                    </p>
                  </div>

                  {/* Key Provisions */}
                  <div className="space-y-3">
                    <h3 className="text-lg font-semibold flex items-center">
                      <CheckCircle className="w-5 h-5 mr-2 text-green-600" />
                      Key Provisions
                    </h3>
                    <ul className="space-y-2">
                      {editingBill.aiAnalysis.keyProvisions.map((provision, index) => (
                        <li key={index} className="flex items-start space-x-2">
                          <div className="w-2 h-2 bg-indigo-600 rounded-full mt-2 flex-shrink-0"></div>
                          <span className="text-slate-700">{provision}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Stakeholder Impact */}
                  <div className="space-y-3">
                    <h3 className="text-lg font-semibold flex items-center">
                      <Users className="w-5 h-5 mr-2 text-orange-600" />
                      Stakeholder Impact
                    </h3>
                    <ul className="space-y-2">
                      {editingBill.aiAnalysis.stakeholderImpact.map((impact, index) => (
                        <li key={index} className="flex items-start space-x-2">
                          <div className="w-2 h-2 bg-orange-600 rounded-full mt-2 flex-shrink-0"></div>
                          <span className="text-slate-700">{impact}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Similar Bills */}
                  <div className="space-y-3">
                    <h3 className="text-lg font-semibold flex items-center">
                      <TrendingUp className="w-5 h-5 mr-2 text-blue-600" />
                      Similar Bills in Other States
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                      {editingBill.aiAnalysis.similarBills.map((bill, index) => (
                        <div key={index} className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                          <span className="text-blue-800 font-medium">{bill}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Passage Likelihood */}
                  <div className="space-y-3">
                    <h3 className="text-lg font-semibold flex items-center">
                      <AlertTriangle className="w-5 h-5 mr-2 text-yellow-600" />
                      Estimated Passage Likelihood
                    </h3>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium text-slate-700">Probability of Passage</span>
                        <span className="text-lg font-bold text-slate-900">{editingBill.aiAnalysis.passageLikelihood}%</span>
                      </div>
                      <Progress 
                        value={editingBill.aiAnalysis.passageLikelihood} 
                        className="h-2"
                      />
                      <div className="flex justify-between text-xs text-slate-500">
                        <span>Low</span>
                        <span>High</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </DialogContent>
          </Dialog>
        </main>
      </div>
    </div>
  );
}
