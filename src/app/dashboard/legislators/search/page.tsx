"use client";

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Search, Plus, ArrowLeft, Loader2, CheckCircle, AlertCircle, User, MapPin, Phone, Mail, Users } from 'lucide-react';
import { legislatorsService } from '@/lib/database';
import { useAuth } from '@/contexts/AuthContext';
import { ProtectedRoute } from '@/components/ProtectedRoute';
import Link from 'next/link';
import type { Legislator } from '@/lib/supabase';

interface OpenStatesLegislator {
  id: string;
  name: string;
  district: string;
  party: string;
  chamber: string;
  committees: string[];
  email?: string;
  phone?: string;
  office?: string;
  photo_url?: string;
  twitter_handle?: string;
  facebook_page?: string;
  website?: string;
}

export default function SearchLegislatorsPage() {
  const { user } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [chamberFilter, setChamberFilter] = useState<string>('all');
  const [partyFilter, setPartyFilter] = useState<string>('all');
  const [searchResults, setSearchResults] = useState<OpenStatesLegislator[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [selectedLegislator, setSelectedLegislator] = useState<OpenStatesLegislator | null>(null);
  const [addLegislatorOpen, setAddLegislatorOpen] = useState(false);
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  const searchLegislators = async () => {
    if (!searchTerm.trim()) return;
    
    setLoading(true);
    setError('');
    
    try {
      const response = await fetch('/api/openstates/legislators');
      if (!response.ok) {
        throw new Error('Failed to fetch legislators');
      }
      
      const data = await response.json();
      let legislators = data.results || [];
      
      // Filter by search term
      legislators = legislators.filter((leg: OpenStatesLegislator) => 
        leg.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        leg.district.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (leg.committees || []).some((committee: string) => 
          committee.toLowerCase().includes(searchTerm.toLowerCase())
        )
      );
      
      // Filter by chamber
      if (chamberFilter !== 'all') {
        legislators = legislators.filter((leg: OpenStatesLegislator) => 
          leg.chamber.toLowerCase() === chamberFilter.toLowerCase()
        );
      }
      
      // Filter by party
      if (partyFilter !== 'all') {
        legislators = legislators.filter((leg: OpenStatesLegislator) => 
          leg.party.toLowerCase() === partyFilter.toLowerCase()
        );
      }
      
      setSearchResults(legislators);
    } catch (error) {
      console.error('Error searching legislators:', error);
      setError('Failed to search legislators. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const addLegislator = async (legislator: OpenStatesLegislator) => {
    try {
      setActionLoading(legislator.id);
      
      const newLegislator = await legislatorsService.create({
        name: legislator.name,
        district: legislator.district,
        party: legislator.party,
        chamber: legislator.chamber,
        committees: legislator.committees || [],
        email: legislator.email || '',
        phone: legislator.phone || '',
        office: legislator.office || '',
        photo_url: legislator.photo_url || '',
        twitter_handle: legislator.twitter_handle || '',
        facebook_page: legislator.facebook_page || '',
        website: legislator.website || '',
        relationship_score: 'None',
        bills_sponsored: 0,
        vote_alignment: 0,
        last_contact: null,
        bio: '',
        term_start: null,
        term_end: null,
        leadership_role: '',
        voting_record: {},
        campaign_finance: {}
      });
      
      setSuccessMessage(`${legislator.name} added successfully!`);
      setAddLegislatorOpen(false);
      setSelectedLegislator(null);
      
      // Remove from search results
      setSearchResults(prev => prev.filter(leg => leg.id !== legislator.id));
      
    } catch (error) {
      console.error('Error adding legislator:', error);
      setError('Failed to add legislator. They may already exist.');
    } finally {
      setActionLoading(null);
    }
  };

  const getChamberColor = (chamber: string) => {
    switch (chamber.toLowerCase()) {
      case 'house': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'senate': return 'bg-green-100 text-green-800 border-green-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getPartyColor = (party: string) => {
    switch (party.toLowerCase()) {
      case 'democratic': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'republican': return 'bg-red-100 text-red-800 border-red-200';
      case 'independent': return 'bg-purple-100 text-purple-800 border-purple-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

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
                <h1 className="text-3xl font-bold text-slate-900">Search Legislators</h1>
                <p className="text-slate-600 mt-1">Find and add Colorado legislators from OpenStates</p>
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
          {error && (
            <Alert className="mb-4 bg-red-50 border-red-200 text-red-800">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {/* Search Form */}
          <Card className="mb-6">
            <CardContent className="p-6">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1">
                  <Input
                    placeholder="Search by name, district, or committee..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && searchLegislators()}
                    className="w-full"
                  />
                </div>
                <Select value={chamberFilter} onValueChange={setChamberFilter}>
                  <SelectTrigger className="w-32">
                    <SelectValue placeholder="Chamber" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Chambers</SelectItem>
                    <SelectItem value="house">House</SelectItem>
                    <SelectItem value="senate">Senate</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={partyFilter} onValueChange={setPartyFilter}>
                  <SelectTrigger className="w-32">
                    <SelectValue placeholder="Party" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Parties</SelectItem>
                    <SelectItem value="democratic">Democratic</SelectItem>
                    <SelectItem value="republican">Republican</SelectItem>
                    <SelectItem value="independent">Independent</SelectItem>
                  </SelectContent>
                </Select>
                <Button 
                  onClick={searchLegislators}
                  disabled={loading || !searchTerm.trim()}
                  className="bg-indigo-600 hover:bg-indigo-700"
                >
                  {loading ? (
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  ) : (
                    <Search className="h-4 w-4 mr-2" />
                  )}
                  Search
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Search Results */}
          {searchResults.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Users className="h-5 w-5 mr-2" />
                  Search Results ({searchResults.length})
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {searchResults.map((legislator) => (
                    <div key={legislator.id} className="border rounded-lg p-4 hover:bg-slate-50">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                          <div className="w-12 h-12 bg-slate-200 rounded-full flex items-center justify-center">
                            <User className="h-6 w-6 text-slate-600" />
                          </div>
                          <div>
                            <h3 className="font-semibold text-slate-900">{legislator.name}</h3>
                            <p className="text-sm text-slate-600">
                              {legislator.chamber} District {legislator.district}
                            </p>
                            <div className="flex items-center space-x-2 mt-1">
                              <Badge className={getChamberColor(legislator.chamber)}>
                                {legislator.chamber}
                              </Badge>
                              <Badge className={getPartyColor(legislator.party)}>
                                {legislator.party}
                              </Badge>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              setSelectedLegislator(legislator);
                              setAddLegislatorOpen(true);
                            }}
                          >
                            <Plus className="h-4 w-4 mr-2" />
                            Add to CRM
                          </Button>
                        </div>
                      </div>
                      {legislator.committees && legislator.committees.length > 0 && (
                        <div className="mt-3">
                          <p className="text-sm text-slate-600 mb-1">Committees:</p>
                          <div className="flex flex-wrap gap-1">
                            {legislator.committees.map((committee, index) => (
                              <Badge key={index} variant="outline" className="text-xs">
                                {committee}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Add Legislator Modal */}
          <Dialog open={addLegislatorOpen} onOpenChange={setAddLegislatorOpen}>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Add Legislator to CRM</DialogTitle>
              </DialogHeader>
              {selectedLegislator && (
                <div className="space-y-4">
                  <div className="flex items-center space-x-4 p-4 bg-slate-50 rounded-lg">
                    <div className="w-16 h-16 bg-slate-200 rounded-full flex items-center justify-center">
                      <User className="h-8 w-8 text-slate-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg">{selectedLegislator.name}</h3>
                      <p className="text-slate-600">
                        {selectedLegislator.chamber} District {selectedLegislator.district}
                      </p>
                      <div className="flex items-center space-x-2 mt-2">
                        <Badge className={getChamberColor(selectedLegislator.chamber)}>
                          {selectedLegislator.chamber}
                        </Badge>
                        <Badge className={getPartyColor(selectedLegislator.party)}>
                          {selectedLegislator.party}
                        </Badge>
                      </div>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label>Email</Label>
                      <p className="text-sm text-slate-600">{selectedLegislator.email || 'Not available'}</p>
                    </div>
                    <div>
                      <Label>Phone</Label>
                      <p className="text-sm text-slate-600">{selectedLegislator.phone || 'Not available'}</p>
                    </div>
                    <div>
                      <Label>Office</Label>
                      <p className="text-sm text-slate-600">{selectedLegislator.office || 'Not available'}</p>
                    </div>
                    <div>
                      <Label>Website</Label>
                      <p className="text-sm text-slate-600">{selectedLegislator.website || 'Not available'}</p>
                    </div>
                  </div>

                  {selectedLegislator.committees && selectedLegislator.committees.length > 0 && (
                    <div>
                      <Label>Committees</Label>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {selectedLegislator.committees.map((committee, index) => (
                          <Badge key={index} variant="outline" className="text-xs">
                            {committee}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="flex justify-end space-x-2 pt-4">
                    <Button variant="outline" onClick={() => setAddLegislatorOpen(false)}>
                      Cancel
                    </Button>
                    <Button
                      onClick={() => addLegislator(selectedLegislator)}
                      disabled={actionLoading === selectedLegislator.id}
                      className="bg-indigo-600 hover:bg-indigo-700"
                    >
                      {actionLoading === selectedLegislator.id ? (
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      ) : (
                        <Plus className="h-4 w-4 mr-2" />
                      )}
                      Add to CRM
                    </Button>
                  </div>
                </div>
              )}
            </DialogContent>
          </Dialog>
        </div>
      </div>
    </ProtectedRoute>
  );
}
