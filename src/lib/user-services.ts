// Frontend-only user services
// All data is hardcoded - no external dependencies

// Frontend-only types
interface Bill {
  id: string;
  bill_number: string;
  title: string;
  sponsor: string;
  status: string;
  last_action: string;
  position: string;
  priority: string;
  watchlist: boolean;
  client_id?: string;
  notes?: string;
}

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

interface Client {
  id: string;
  name: string;
  type: string;
}

// Mock data
const mockBills: Bill[] = [
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
    notes: 'Strong support from clean energy coalition'
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
    notes: 'Watching for amendments'
  }
];

const mockLegislators: Legislator[] = [
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
    last_contact: '2024-01-15'
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
    last_contact: '2024-01-10'
  }
];

const mockClients: Client[] = [
  { id: '1', name: 'Clean Energy Coalition', type: 'Nonprofit' },
  { id: '2', name: 'Tech Forward', type: 'Industry Group' }
];

// User Bills Service
export const userBillsService = {
  async getByUser(userId: string): Promise<Bill[]> {
    return mockBills;
  }
};

// User Legislators Service
export const userLegislatorsService = {
  async getByUser(userId: string): Promise<Legislator[]> {
    return mockLegislators;
  }
};

// Clients Service
export const clientsService = {
  async getByUser(userId: string): Promise<Client[]> {
    return mockClients;
  }
};

// Admin Repository Service
export const adminRepositoryService = {
  async getRecentBills(limit: number = 20): Promise<Bill[]> {
    return mockBills.slice(0, limit);
  },

  async getRecentLegislators(limit: number = 20): Promise<Legislator[]> {
    return mockLegislators.slice(0, limit);
  }
};