// Frontend-only database service
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
  description?: string;
  contact_person?: string;
  email?: string;
  phone?: string;
  address?: string;
  created_at: string;
  updated_at: string;
}

interface Contact {
  id: string;
  name: string;
  type: string;
  email?: string;
  phone?: string;
  organization?: string;
  notes?: string;
  created_at: string;
  updated_at: string;
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
  { 
    id: '1', 
    name: 'Clean Energy Coalition', 
    type: 'Nonprofit',
    description: 'Advocating for renewable energy policies',
    contact_person: 'Sarah Johnson',
    email: 'sarah@cleanenergy.org',
    phone: '(303) 555-0101',
    address: '123 Green St, Denver, CO 80202',
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-01T00:00:00Z'
  },
  { 
    id: '2', 
    name: 'Tech Forward', 
    type: 'Industry Group',
    description: 'Technology industry advocacy group',
    contact_person: 'Mike Chen',
    email: 'mike@techforward.org',
    phone: '(303) 555-0102',
    address: '456 Tech Ave, Boulder, CO 80301',
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-01T00:00:00Z'
  }
];

// Bills Service
export const billsDataService = {
  async getAll(): Promise<Bill[]> {
    return mockBills;
  },

  async create(bill: Omit<Bill, 'id'>): Promise<Bill> {
    const newBill: Bill = {
      ...bill,
      id: Date.now().toString()
    };
    mockBills.push(newBill);
    return newBill;
  },

  async update(id: string, updates: Partial<Bill>): Promise<Bill> {
    const index = mockBills.findIndex(bill => bill.id === id);
    if (index === -1) throw new Error('Bill not found');
    mockBills[index] = { ...mockBills[index], ...updates };
    return mockBills[index];
  },

  async delete(id: string): Promise<void> {
    const index = mockBills.findIndex(bill => bill.id === id);
    if (index === -1) throw new Error('Bill not found');
    mockBills.splice(index, 1);
  },

  async toggleWatchlist(id: string, watchlist: boolean): Promise<void> {
    const bill = mockBills.find(b => b.id === id);
    if (bill) bill.watchlist = watchlist;
  },

  async updatePriority(id: string, priority: string): Promise<void> {
    const bill = mockBills.find(b => b.id === id);
    if (bill) bill.priority = priority;
  }
};

// Legislators Service
export const legislatorsDataService = {
  async getAll(): Promise<Legislator[]> {
    return mockLegislators;
  }
};

// Clients Service
export const clientsDataService = {
  async getAll(): Promise<Client[]> {
    return mockClients;
  },

  async create(client: Omit<Client, 'id' | 'created_at' | 'updated_at'>): Promise<Client> {
    const newClient: Client = {
      ...client,
      id: Date.now().toString(),
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
    mockClients.push(newClient);
    return newClient;
  },

  async update(id: string, updates: Partial<Client>): Promise<Client> {
    const index = mockClients.findIndex(client => client.id === id);
    if (index === -1) throw new Error('Client not found');
    mockClients[index] = { ...mockClients[index], ...updates, updated_at: new Date().toISOString() };
    return mockClients[index];
  },

  async delete(id: string): Promise<void> {
    const index = mockClients.findIndex(client => client.id === id);
    if (index === -1) throw new Error('Client not found');
    mockClients.splice(index, 1);
  }
};

// Contacts Service
export const contactsDataService = {
  async getAll(): Promise<Contact[]> {
    return [];
  },

  async create(contact: Omit<Contact, 'id' | 'created_at' | 'updated_at'>): Promise<Contact> {
    const newContact: Contact = {
      ...contact,
      id: Date.now().toString(),
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
    return newContact;
  }
};

// User Actions Service
export const userActionsDataService = {
  async getAll(): Promise<any[]> {
    return [];
  }
};