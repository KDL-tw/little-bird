// OpenStates API Service
// Documentation: https://openstates.org/api/

const OPENSTATES_BASE_URL = 'https://openstates.org/api/v1';

// OpenStates API types
export interface OpenStatesBill {
  id: string;
  title: string;
  bill_id: string;
  state: string;
  session: string;
  subjects: string[];
  type: string[];
  sponsors: Array<{
    name: string;
    role: string;
    chamber: string;
    district: string;
  }>;
  actions: Array<{
    action: string;
    date: string;
    actor: string;
    type: string;
  }>;
  sources: Array<{
    url: string;
    note: string;
  }>;
  created_at: string;
  updated_at: string;
  latest_action: {
    action: string;
    date: string;
    actor: string;
  };
  status: string;
  status_date: string;
  progress: Array<{
    event: string;
    date: string;
    actor: string;
  }>;
}

export interface OpenStatesLegislator {
  id: string;
  name: string;
  first_name: string;
  last_name: string;
  middle_name?: string;
  party: string;
  chamber: string;
  district: string;
  state: string;
  roles: Array<{
    type: string;
    title: string;
    committee: string;
    subcommittee?: string;
    start_date: string;
    end_date?: string;
  }>;
  offices: Array<{
    type: string;
    name: string;
    address: string;
    phone: string;
    email: string;
    fax?: string;
  }>;
  sources: Array<{
    url: string;
    note: string;
  }>;
  created_at: string;
  updated_at: string;
  photo_url?: string;
  url?: string;
}

export interface OpenStatesCommittee {
  id: string;
  name: string;
  chamber: string;
  state: string;
  subcommittee: boolean;
  parent_id?: string;
  members: Array<{
    name: string;
    role: string;
    legislator: string;
  }>;
  sources: Array<{
    url: string;
    note: string;
  }>;
  created_at: string;
  updated_at: string;
}

// API Key - In production, this should be in environment variables
const API_KEY = process.env.NEXT_PUBLIC_OPENSTATES_API_KEY || '';

// Helper function to make API requests through our server-side routes
async function makeRequest<T>(endpoint: string, params?: Record<string, string>): Promise<T> {
  const baseUrl = '/api/openstates';
  let url = baseUrl + endpoint;
  
  if (params) {
    const searchParams = new URLSearchParams(params);
    url += `?${searchParams.toString()}`;
  }

  try {
    const response = await fetch(url);
    
    if (!response.ok) {
      throw new Error(`API error: ${response.status} ${response.statusText}`);
    }
    
    const result = await response.json();
    
    if (!result.success) {
      throw new Error(result.error || 'API request failed');
    }
    
    return result.data;
  } catch (error) {
    console.error('API request failed:', error);
    throw error;
  }
}

// Bills API
export const billsAPI = {
  // Get bills for Colorado
  async getBills(state: string = 'co', session?: string): Promise<OpenStatesBill[]> {
    const params: Record<string, string> = { state };
    if (session) params.session = session;
    return makeRequest<OpenStatesBill[]>('/bills', params);
  },

  // Get a specific bill by ID
  async getBill(billId: string): Promise<OpenStatesBill> {
    return makeRequest<OpenStatesBill>(`/bills/${billId}/`);
  },

  // Search bills
  async searchBills(query: string, state: string = 'co'): Promise<OpenStatesBill[]> {
    return makeRequest<OpenStatesBill[]>('/bills', { state, q: query });
  },

  // Get bills by subject
  async getBillsBySubject(subject: string, state: string = 'co'): Promise<OpenStatesBill[]> {
    return makeRequest<OpenStatesBill[]>('/bills', { state, subject });
  }
};

// Legislators API
export const legislatorsAPI = {
  // Get legislators for Colorado
  async getLegislators(state: string = 'co'): Promise<OpenStatesLegislator[]> {
    return makeRequest<OpenStatesLegislator[]>('/legislators', { state });
  },

  // Get a specific legislator by ID
  async getLegislator(legislatorId: string): Promise<OpenStatesLegislator> {
    return makeRequest<OpenStatesLegislator>(`/legislators/${legislatorId}/`);
  },

  // Search legislators
  async searchLegislators(query: string, state: string = 'co'): Promise<OpenStatesLegislator[]> {
    return makeRequest<OpenStatesLegislator[]>('/legislators', { state, q: query });
  }
};

// Committees API
export const committeesAPI = {
  // Get committees for Colorado
  async getCommittees(state: string = 'co'): Promise<OpenStatesCommittee[]> {
    return makeRequest<OpenStatesCommittee[]>('/committees', { state });
  },

  // Get a specific committee by ID
  async getCommittee(committeeId: string): Promise<OpenStatesCommittee> {
    return makeRequest<OpenStatesCommittee>(`/committees/${committeeId}/`);
  }
};

// Utility functions to convert OpenStates data to our internal format
export const dataConverters = {
  // Convert OpenStates bill to our Bill format
  convertBill(openStatesBill: OpenStatesBill) {
    return {
      id: openStatesBill.id,
      bill_number: openStatesBill.bill_id,
      title: openStatesBill.title,
      sponsor: openStatesBill.sponsors[0]?.name || 'Unknown',
      status: this.mapBillStatus(openStatesBill.status),
      last_action: openStatesBill.latest_action?.action || 'No recent action',
      position: 'None' as const,
      ai_analysis: {
        executive_summary: `This ${openStatesBill.type[0] || 'bill'} addresses ${openStatesBill.subjects.join(', ')}.`,
        key_provisions: openStatesBill.subjects.slice(0, 3),
        stakeholder_impact: ['Impact analysis pending'],
        similar_bills: ['Similar bills analysis pending'],
        passage_likelihood: this.calculatePassageLikelihood(openStatesBill)
      },
      created_at: openStatesBill.created_at,
      updated_at: openStatesBill.updated_at
    };
  },

  // Convert OpenStates legislator to our Legislator format
  convertLegislator(openStatesLegislator: OpenStatesLegislator) {
    const committees = openStatesLegislator.roles
      .filter(role => role.type === 'committee')
      .map(role => role.title);

    const office = openStatesLegislator.offices[0];
    
    return {
      id: openStatesLegislator.id,
      name: openStatesLegislator.name,
      district: openStatesLegislator.district,
      party: this.mapParty(openStatesLegislator.party),
      chamber: this.mapChamber(openStatesLegislator.chamber),
      committees: committees,
      phone: office?.phone || '',
      email: office?.email || '',
      office: office?.address || '',
      relationship_score: 'None' as const,
      bills_sponsored: 0, // Would need separate API call
      vote_alignment: 0, // Would need separate API call
      last_contact: null,
      topics_of_interest: [],
      created_at: openStatesLegislator.created_at,
      updated_at: openStatesLegislator.updated_at
    };
  },

  // Map OpenStates status to our status
  mapBillStatus(status: string): 'Active' | 'Passed' | 'Failed' {
    const lowerStatus = status.toLowerCase();
    if (lowerStatus.includes('passed') || lowerStatus.includes('enacted')) {
      return 'Passed';
    }
    if (lowerStatus.includes('failed') || lowerStatus.includes('defeated') || lowerStatus.includes('vetoed')) {
      return 'Failed';
    }
    return 'Active';
  },

  // Map OpenStates party to our party format
  mapParty(party: string): 'D' | 'R' | 'I' {
    const lowerParty = party.toLowerCase();
    if (lowerParty.includes('democrat') || lowerParty.includes('democratic')) {
      return 'D';
    }
    if (lowerParty.includes('republican')) {
      return 'R';
    }
    return 'I';
  },

  // Map OpenStates chamber to our chamber format
  mapChamber(chamber: string): 'House' | 'Senate' {
    const lowerChamber = chamber.toLowerCase();
    if (lowerChamber.includes('house') || lowerChamber.includes('assembly')) {
      return 'House';
    }
    return 'Senate';
  },

  // Calculate passage likelihood based on bill data
  calculatePassageLikelihood(bill: OpenStatesBill): number {
    // Simple heuristic based on bill progress
    const progressCount = bill.progress?.length || 0;
    const hasRecentAction = bill.latest_action && 
      new Date(bill.latest_action.date) > new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
    
    let likelihood = 50; // Base likelihood
    
    if (progressCount > 5) likelihood += 20;
    if (hasRecentAction) likelihood += 15;
    if (bill.sponsors.length > 3) likelihood += 10;
    if (bill.subjects.includes('budget') || bill.subjects.includes('appropriations')) likelihood -= 10;
    
    return Math.max(0, Math.min(100, likelihood));
  }
};
