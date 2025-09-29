"use client";

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { DashboardLayout } from '@/components/DashboardLayout';
import { Search, Plus, ArrowLeft, Loader2, CheckCircle, AlertCircle, User, MapPin, Phone, Mail, Users } from 'lucide-react';
import { legislatorsDataService } from '@/lib/database';
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

export default function LegislatorsSearchPage() {
  const { user } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [chamberFilter, setChamberFilter] = useState('all');
  const [partyFilter, setPartyFilter] = useState('all');
  const [searchResults, setSearchResults] = useState<OpenStatesLegislator[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [selectedLegislator, setSelectedLegislator] = useState<OpenStatesLegislator | null>(null);
  const [addLegislatorOpen, setAddLegislatorOpen] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const searchLegislators = async () => {
    setLoading(true);
    setError('');
    
    try {
      // Use OpenStates API directly like the working bills search
      let url = '/api/openstates/legislators?state=co';
      
      if (searchTerm.trim()) {
        url += `&q=${encodeURIComponent(searchTerm.trim())}`;
      }
      
      console.log('Legislators search URL:', url);
      
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error('Failed to fetch legislators');
      }
      
      const data = await response.json();
      let legislators = data.data || [];
      
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

  const handleAddLegislator = async () => {
    if (!selectedLegislator) return;
    
    try {
      setLoading(true);
      
      const legislatorData = {
        openstates_id: selectedLegislator.id,
        name: selectedLegislator.name,
        district: selectedLegislator.district,
        party: selectedLegislator.party,
        chamber: selectedLegislator.chamber,
        committees: selectedLegislator.committees || [],
        email: selectedLegislator.email || '',
        phone: selectedLegislator.phone || '',
        office: selectedLegislator.office || '',
        photo_url: selectedLegislator.photo_url || '',
        twitter_handle: selectedLegislator.twitter_handle || '',
        facebook_page: selectedLegislator.facebook_page || '',
        website: selectedLegislator.website || '',
        relationship_score: 'None' as 'High' | 'Medium' | 'Low' | 'None',
        bills_sponsored_count: 0,
        vote_alignment_percent: 0,
        last_contact_date: null
      };
      
      await legislatorsDataService.create(legislatorData);
      setAddLegislatorOpen(false);
      setSuccessMessage(`Legislator ${selectedLegislator.name} added successfully!`);
      setSelectedLegislator(null);
      
    } catch (error) {
      console.error('Error adding legislator:', error);
      setError('Failed to add legislator');
    } finally {
      setLoading(false);
    }
  };

  const getPartyColor = (party: string) => {
    switch (party.toLowerCase()) {
      case 'd': return 'bg-blue-100 text-blue-800';
      case 'r': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getChamberColor = (chamber: string) => {
    switch (chamber.toLowerCase()) {
      case 'house': return 'bg-green-100 text-green-800';
      case 'senate': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const actions = (
    <div className="flex items-center space-x-2">
      <Link href="/dashboard/legislators">
        <Button variant="outline" size="sm">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Legislators
        </Button>
      </Link>
      <Link href="/dashboard">
        <Button variant="outline" size="sm">
          Dashboard
        </Button>
      </Link>
    </div>
  );

  return (
    <DashboardLayout
      title="Search Legislators"
      subtitle="Find and add Colorado legislators to your CRM"
      actions={actions}
    >
      {/* Search Form */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex items-center">
            <Search className="h-5 w-5 mr-2" />
            Search Legislators
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4">
            <div className="flex-1">
              <Input
                placeholder="Search by name, district, or party..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && searchLegislators()}
              />
            </div>
            <Select value={chamberFilter} onValueChange={setChamberFilter}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="All Chambers" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Chambers</SelectItem>
                <SelectItem value="house">House</SelectItem>
                <SelectItem value="senate">Senate</SelectItem>
              </SelectContent>
            </Select>
            <Select value={partyFilter} onValueChange={setPartyFilter}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="All Parties" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Parties</SelectItem>
                <SelectItem value="d">Democrat</SelectItem>
                <SelectItem value="r">Republican</SelectItem>
              </SelectContent>
            </Select>
            <Button onClick={searchLegislators} disabled={loading}>
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

      {/* Messages */}
      {error && (
        <Alert className="mb-6" variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {successMessage && (
        <Alert className="mb-6">
          <CheckCircle className="h-4 w-4" />
          <AlertDescription>{successMessage}</AlertDescription>
        </Alert>
      )}

      {/* Search Results */}
      {searchResults.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Search Results ({searchResults.length})</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {searchResults.map((legislator) => (
                <div key={legislator.id} className="border rounded-lg p-4 hover:bg-slate-50">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-2">
                        <h3 className="font-semibold text-lg">{legislator.name}</h3>
                        <Badge className={getPartyColor(legislator.party)}>
                          {legislator.party}
                        </Badge>
                        <Badge className={getChamberColor(legislator.chamber)}>
                          {legislator.chamber}
                        </Badge>
                      </div>
                      <p className="text-slate-600 mb-2">District: {legislator.district}</p>
                      <div className="space-y-1 text-sm text-slate-500">
                        {legislator.email && (
                          <div className="flex items-center">
                            <Mail className="h-4 w-4 mr-2" />
                            {legislator.email}
                          </div>
                        )}
                        {legislator.phone && (
                          <div className="flex items-center">
                            <Phone className="h-4 w-4 mr-2" />
                            {legislator.phone}
                          </div>
                        )}
                        {legislator.office && (
                          <div className="flex items-center">
                            <MapPin className="h-4 w-4 mr-2" />
                            {legislator.office}
                          </div>
                        )}
                      </div>
                      {legislator.committees && legislator.committees.length > 0 && (
                        <div className="mt-2">
                          <p className="text-sm text-slate-500 mb-1">Committees:</p>
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
                    <div className="flex items-center space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          setSelectedLegislator(legislator);
                          setAddLegislatorOpen(true);
                        }}
                      >
                        <Plus className="h-4 w-4 mr-1" />
                        Add to CRM
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Add Legislator Modal */}
      <Dialog open={addLegislatorOpen} onOpenChange={setAddLegislatorOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Legislator to CRM</DialogTitle>
          </DialogHeader>
          {selectedLegislator && (
            <div className="space-y-4">
              <div className="bg-slate-50 p-4 rounded-lg">
                <h3 className="font-semibold">{selectedLegislator.name}</h3>
                <p className="text-sm text-slate-600">
                  {selectedLegislator.district} • {selectedLegislator.chamber} • {selectedLegislator.party}
                </p>
                {selectedLegislator.committees && legislator.committees.length > 0 && (
                  <div className="mt-2">
                    <p className="text-sm text-slate-500">Committees:</p>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {selectedLegislator.committees.map((committee, index) => (
                        <Badge key={index} variant="outline" className="text-xs">
                          {committee}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
              </div>
              
              <div className="flex justify-end space-x-2">
                <Button variant="outline" onClick={() => setAddLegislatorOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleAddLegislator} disabled={loading}>
                  {loading ? (
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  ) : (
                    <Plus className="h-4 w-4 mr-2" />
                  )}
                  Add Legislator
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
}