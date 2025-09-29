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
  CheckCircle,
  Loader2
} from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { billsService } from "@/lib/database";
import type { Bill } from "@/lib/supabase";

export default function BillsPage() {
  const [bills, setBills] = useState<Bill[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [sponsorFilter, setSponsorFilter] = useState<string>('all');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isAIModalOpen, setIsAIModalOpen] = useState(false);
  const [editingBill, setEditingBill] = useState<Bill | null>(null);
  const [selectedBill, setSelectedBill] = useState<Bill | null>(null);
  const [formData, setFormData] = useState({
    bill_number: '',
    title: '',
    sponsor: '',
    status: 'Active' as Bill['status'],
    last_action: '',
    position: 'None' as Bill['position']
  });

  // Load bills from database
  useEffect(() => {
    loadBills();
  }, []);

  const loadBills = async () => {
    try {
      setLoading(true);
      const data = await billsService.getAll();
      setBills(data);
    } catch (error) {
      console.error('Error loading bills:', error);
    } finally {
      setLoading(false);
    }
  };

  // Get unique sponsors for filter
  const uniqueSponsors = useMemo(() => {
    const sponsors = bills.map(bill => bill.sponsor);
    return Array.from(new Set(sponsors)).sort();
  }, [bills]);

  // Filter bills
  const filteredBills = useMemo(() => {
    return bills.filter(bill => {
      const matchesSearch = bill.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          bill.bill_number.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          bill.sponsor.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus = statusFilter === 'all' || bill.status === statusFilter;
      const matchesSponsor = sponsorFilter === 'all' || bill.sponsor === sponsorFilter;
      
      return matchesSearch && matchesStatus && matchesSponsor;
    });
  }, [bills, searchTerm, statusFilter, sponsorFilter]);

  const handleAddBill = async () => {
    try {
      const newBill = await billsService.create({
        ...formData,
        ai_analysis: null
      });
      setBills([...bills, newBill]);
      setFormData({
        bill_number: '',
        title: '',
        sponsor: '',
        status: 'Active',
        last_action: '',
        position: 'None'
      });
      setIsAddModalOpen(false);
    } catch (error) {
      console.error('Error adding bill:', error);
    }
  };

  const handleEditBill = (bill: Bill) => {
    setEditingBill(bill);
    setFormData({
      bill_number: bill.bill_number,
      title: bill.title,
      sponsor: bill.sponsor,
      status: bill.status,
      last_action: bill.last_action || '',
      position: bill.position
    });
    setIsEditModalOpen(true);
  };

  const handleUpdateBill = async () => {
    if (!editingBill) return;
    
    try {
      const updatedBill = await billsService.update(editingBill.id, formData);
      setBills(bills.map(bill => 
        bill.id === editingBill.id ? updatedBill : bill
      ));
      setFormData({
        bill_number: '',
        title: '',
        sponsor: '',
        status: 'Active',
        last_action: '',
        position: 'None'
      });
      setEditingBill(null);
      setIsEditModalOpen(false);
    } catch (error) {
      console.error('Error updating bill:', error);
    }
  };

  const handleDeleteBill = async (id: string) => {
    try {
      await billsService.delete(id);
      setBills(bills.filter(bill => bill.id !== id));
    } catch (error) {
      console.error('Error deleting bill:', error);
    }
  };

  const handleAIAnalysis = (bill: Bill) => {
    setSelectedBill(bill);
    setIsAIModalOpen(true);
  };

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case 'Active': return 'default';
      case 'Passed': return 'secondary';
      case 'Failed': return 'destructive';
      default: return 'outline';
    }
  };

  const getPositionBadgeVariant = (position: string) => {
    switch (position) {
      case 'Support': return 'default';
      case 'Monitor': return 'secondary';
      case 'Oppose': return 'destructive';
      case 'Hypothetical': return 'outline';
      case 'None': return 'outline';
      default: return 'outline';
    }
  };

  if (loading) {
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
                <FileText className="w-5 h-5 mr-3" />
                Overview
              </Link>
              <Link href="/dashboard/bills" className="flex items-center px-3 py-2 text-sm font-medium text-white bg-slate-800 rounded-lg">
                <FileText className="w-5 h-5 mr-3" />
                Bills
              </Link>
              <Link href="/dashboard/legislators" className="flex items-center px-3 py-2 text-sm font-medium text-slate-300 hover:text-white hover:bg-slate-800 rounded-lg transition-colors">
                <User className="w-5 h-5 mr-3" />
                Legislators
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
          <div className="flex items-center justify-center h-screen">
            <div className="text-center">
              <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4" />
              <p className="text-slate-600">Loading bills...</p>
            </div>
          </div>
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
              <FileText className="w-5 h-5 mr-3" />
              Overview
            </Link>
            <Link href="/dashboard/bills" className="flex items-center px-3 py-2 text-sm font-medium text-white bg-slate-800 rounded-lg">
              <FileText className="w-5 h-5 mr-3" />
              Bills
            </Link>
            <Link href="/dashboard/legislators" className="flex items-center px-3 py-2 text-sm font-medium text-slate-300 hover:text-white hover:bg-slate-800 rounded-lg transition-colors">
              <User className="w-5 h-5 mr-3" />
              Legislators
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
              <h1 className="text-2xl font-semibold text-slate-900">Bills Tracker</h1>
              <p className="text-slate-600">Monitor and track Colorado legislation</p>
            </div>
            <Button onClick={() => setIsAddModalOpen(true)} className="bg-indigo-600 hover:bg-indigo-700">
              <Plus className="w-4 h-4 mr-2" />
              Add Bill
            </Button>
          </div>
        </header>

        {/* Main Content */}
        <main className="p-6">
          {/* Filters */}
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Filter className="w-5 h-5 mr-2" />
                Filters
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div>
                  <label className="text-sm font-medium text-slate-700 mb-2 block">Search</label>
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
                    <Input
                      placeholder="Search bills..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium text-slate-700 mb-2 block">Status</label>
                  <Select value={statusFilter} onValueChange={setStatusFilter}>
                    <SelectTrigger>
                      <SelectValue placeholder="All Statuses" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Statuses</SelectItem>
                      <SelectItem value="Active">Active</SelectItem>
                      <SelectItem value="Passed">Passed</SelectItem>
                      <SelectItem value="Failed">Failed</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="text-sm font-medium text-slate-700 mb-2 block">Sponsor</label>
                  <Select value={sponsorFilter} onValueChange={setSponsorFilter}>
                    <SelectTrigger>
                      <SelectValue placeholder="All Sponsors" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Sponsors</SelectItem>
                      {uniqueSponsors.map(sponsor => (
                        <SelectItem key={sponsor} value={sponsor}>{sponsor}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex items-end">
                  <Button 
                    variant="outline" 
                    onClick={() => {
                      setSearchTerm('');
                      setStatusFilter('all');
                      setSponsorFilter('all');
                    }}
                    className="w-full"
                  >
                    Clear Filters
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Bills Table */}
          <Card>
            <CardHeader>
              <CardTitle>Bills ({filteredBills.length})</CardTitle>
              <CardDescription>Colorado legislation tracking</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
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
                        <TableCell className="font-medium">{bill.bill_number}</TableCell>
                        <TableCell className="max-w-xs truncate">{bill.title}</TableCell>
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
                        <TableCell className="max-w-xs truncate">{bill.last_action}</TableCell>
                        <TableCell>{new Date(bill.updated_at).toLocaleDateString()}</TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end space-x-2">
                            {bill.ai_analysis && (
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleAIAnalysis(bill)}
                                className="text-purple-600 border-purple-200 hover:bg-purple-50"
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
                              className="text-red-600 border-red-200 hover:bg-red-50"
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
        </main>
      </div>

      {/* Add Bill Modal */}
      <Dialog open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Add New Bill</DialogTitle>
            <DialogDescription>Track a new piece of Colorado legislation</DialogDescription>
          </DialogHeader>
          <div className="grid grid-cols-2 gap-4 py-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700">Bill Number</label>
              <Input
                value={formData.bill_number}
                onChange={(e) => setFormData({...formData, bill_number: e.target.value})}
                className="col-span-3"
                placeholder="e.g., HB24-1001"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700">Sponsor</label>
              <Input
                value={formData.sponsor}
                onChange={(e) => setFormData({...formData, sponsor: e.target.value})}
                className="col-span-3"
                placeholder="e.g., Rep. Johnson"
              />
            </div>
            <div className="col-span-2 space-y-2">
              <label className="text-sm font-medium text-slate-700">Title</label>
              <Input
                value={formData.title}
                onChange={(e) => setFormData({...formData, title: e.target.value})}
                className="col-span-3"
                placeholder="Bill title..."
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700">Status</label>
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
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700">Position</label>
              <Select value={formData.position} onValueChange={(value: Bill['position']) => setFormData({...formData, position: value})}>
                <SelectTrigger className="col-span-3">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Support">Support</SelectItem>
                  <SelectItem value="Monitor">Monitor</SelectItem>
                  <SelectItem value="Oppose">Oppose</SelectItem>
                  <SelectItem value="None">None</SelectItem>
                  <SelectItem value="Hypothetical">Hypothetical</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="col-span-2 space-y-2">
              <label className="text-sm font-medium text-slate-700">Last Action</label>
              <Input
                value={formData.last_action}
                onChange={(e) => setFormData({...formData, last_action: e.target.value})}
                className="col-span-3"
                placeholder="Last action taken..."
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddModalOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleAddBill}>
              Add Bill
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Bill Modal */}
      <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Edit Bill</DialogTitle>
            <DialogDescription>Update bill information</DialogDescription>
          </DialogHeader>
          <div className="grid grid-cols-2 gap-4 py-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700">Bill Number</label>
              <Input
                value={formData.bill_number}
                onChange={(e) => setFormData({...formData, bill_number: e.target.value})}
                className="col-span-3"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700">Sponsor</label>
              <Input
                value={formData.sponsor}
                onChange={(e) => setFormData({...formData, sponsor: e.target.value})}
                className="col-span-3"
              />
            </div>
            <div className="col-span-2 space-y-2">
              <label className="text-sm font-medium text-slate-700">Title</label>
              <Input
                value={formData.title}
                onChange={(e) => setFormData({...formData, title: e.target.value})}
                className="col-span-3"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700">Status</label>
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
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700">Position</label>
              <Select value={formData.position} onValueChange={(value: Bill['position']) => setFormData({...formData, position: value})}>
                <SelectTrigger className="col-span-3">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Support">Support</SelectItem>
                  <SelectItem value="Monitor">Monitor</SelectItem>
                  <SelectItem value="Oppose">Oppose</SelectItem>
                  <SelectItem value="None">None</SelectItem>
                  <SelectItem value="Hypothetical">Hypothetical</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="col-span-2 space-y-2">
              <label className="text-sm font-medium text-slate-700">Last Action</label>
              <Input
                value={formData.last_action}
                onChange={(e) => setFormData({...formData, last_action: e.target.value})}
                className="col-span-3"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditModalOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleUpdateBill}>
              Update Bill
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* AI Analysis Modal */}
      <Dialog open={isAIModalOpen} onOpenChange={setIsAIModalOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center space-x-2">
              <Sparkles className="w-6 h-6 text-purple-600" />
              <span>AI Analysis</span>
              <Badge className="bg-purple-100 text-purple-800 border-purple-200">
                AI Analysis
              </Badge>
            </DialogTitle>
            <DialogDescription>
              {selectedBill?.bill_number}: {selectedBill?.title}
            </DialogDescription>
          </DialogHeader>
          
          {selectedBill?.ai_analysis && (
            <div className="space-y-6">
              {/* Executive Summary */}
              <div>
                <h3 className="text-lg font-semibold text-slate-900 mb-3 flex items-center">
                  <Brain className="w-5 h-5 mr-2 text-indigo-600" />
                  Executive Summary
                </h3>
                <p className="text-slate-700 leading-relaxed">
                  {selectedBill.ai_analysis.executive_summary}
                </p>
              </div>

              {/* Key Provisions */}
              <div>
                <h3 className="text-lg font-semibold text-slate-900 mb-3 flex items-center">
                  <FileText className="w-5 h-5 mr-2 text-green-600" />
                  Key Provisions
                </h3>
                <ul className="space-y-2">
                  {selectedBill.ai_analysis.key_provisions.map((provision, index) => (
                    <li key={index} className="flex items-start">
                      <CheckCircle className="w-4 h-4 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                      <span className="text-slate-700">{provision}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Stakeholder Impact */}
              <div>
                <h3 className="text-lg font-semibold text-slate-900 mb-3 flex items-center">
                  <Users className="w-5 h-5 mr-2 text-blue-600" />
                  Stakeholder Impact
                </h3>
                <ul className="space-y-2">
                  {selectedBill.ai_analysis.stakeholder_impact.map((impact, index) => (
                    <li key={index} className="flex items-start">
                      <AlertTriangle className="w-4 h-4 text-blue-500 mr-2 mt-0.5 flex-shrink-0" />
                      <span className="text-slate-700">{impact}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Similar Bills */}
              <div>
                <h3 className="text-lg font-semibold text-slate-900 mb-3 flex items-center">
                  <TrendingUp className="w-5 h-5 mr-2 text-orange-600" />
                  Similar Bills in Other States
                </h3>
                <div className="flex flex-wrap gap-2">
                  {selectedBill.ai_analysis.similar_bills.map((bill, index) => (
                    <Badge key={index} variant="outline" className="text-orange-700 border-orange-200">
                      {bill}
                    </Badge>
                  ))}
                </div>
              </div>

              {/* Passage Likelihood */}
              <div>
                <h3 className="text-lg font-semibold text-slate-900 mb-3 flex items-center">
                  <TrendingUp className="w-5 h-5 mr-2 text-purple-600" />
                  Estimated Passage Likelihood
                </h3>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-slate-600">Probability</span>
                    <span className="text-sm font-semibold text-slate-900">
                      {selectedBill.ai_analysis.passage_likelihood}%
                    </span>
                  </div>
                  <Progress 
                    value={selectedBill.ai_analysis.passage_likelihood} 
                    className="h-2"
                  />
                  <p className="text-sm text-slate-600">
                    Based on historical data, committee composition, and current political climate
                  </p>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
