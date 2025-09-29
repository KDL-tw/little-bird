// Mock OpenStates data for development
// This provides realistic Colorado legislative data while we resolve API issues

export interface MockBill {
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

export interface MockLegislator {
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

// Mock Colorado Bills Data
export const mockBills: MockBill[] = [
  {
    id: "co-2024-hb1001",
    title: "Colorado Clean Energy Act",
    bill_id: "HB24-1001",
    state: "co",
    session: "2024",
    subjects: ["Energy", "Environment", "Renewable Energy"],
    type: ["bill"],
    sponsors: [
      {
        name: "Rep. Julie McCluskie",
        role: "primary",
        chamber: "lower",
        district: "HD-13"
      }
    ],
    actions: [
      {
        action: "Introduced in House",
        date: "2024-01-10",
        actor: "House",
        type: "introduction"
      },
      {
        action: "Passed House Committee on Energy",
        date: "2024-01-15",
        actor: "Energy Committee",
        type: "committee"
      }
    ],
    sources: [
      {
        url: "https://leg.colorado.gov/bills/hb24-1001",
        note: "Official bill page"
      }
    ],
    created_at: "2024-01-10T00:00:00Z",
    updated_at: "2024-01-15T00:00:00Z",
    latest_action: {
      action: "Passed House Committee on Energy",
      date: "2024-01-15",
      actor: "Energy Committee"
    },
    status: "active",
    status_date: "2024-01-15",
    progress: [
      {
        event: "Introduced",
        date: "2024-01-10",
        actor: "House"
      },
      {
        event: "Committee Hearing",
        date: "2024-01-15",
        actor: "Energy Committee"
      }
    ]
  },
  {
    id: "co-2024-sb0123",
    title: "Healthcare Access Expansion",
    bill_id: "SB24-0123",
    state: "co",
    session: "2024",
    subjects: ["Healthcare", "Medicaid", "Public Health"],
    type: ["bill"],
    sponsors: [
      {
        name: "Sen. Faith Winter",
        role: "primary",
        chamber: "upper",
        district: "SD-24"
      }
    ],
    actions: [
      {
        action: "Introduced in Senate",
        date: "2024-01-12",
        actor: "Senate",
        type: "introduction"
      }
    ],
    sources: [
      {
        url: "https://leg.colorado.gov/bills/sb24-0123",
        note: "Official bill page"
      }
    ],
    created_at: "2024-01-12T00:00:00Z",
    updated_at: "2024-01-12T00:00:00Z",
    latest_action: {
      action: "Introduced in Senate",
      date: "2024-01-12",
      actor: "Senate"
    },
    status: "active",
    status_date: "2024-01-12",
    progress: [
      {
        event: "Introduced",
        date: "2024-01-12",
        actor: "Senate"
      }
    ]
  },
  {
    id: "co-2024-hb0456",
    title: "Education Funding Reform",
    bill_id: "HB24-0456",
    state: "co",
    session: "2024",
    subjects: ["Education", "Funding", "Schools"],
    type: ["bill"],
    sponsors: [
      {
        name: "Rep. Dylan Roberts",
        role: "primary",
        chamber: "lower",
        district: "HD-26"
      }
    ],
    actions: [
      {
        action: "Introduced in House",
        date: "2024-01-08",
        actor: "House",
        type: "introduction"
      },
      {
        action: "Passed House",
        date: "2024-01-20",
        actor: "House",
        type: "passage"
      },
      {
        action: "Signed by Governor",
        date: "2024-01-25",
        actor: "Governor",
        type: "executive"
      }
    ],
    sources: [
      {
        url: "https://leg.colorado.gov/bills/hb24-0456",
        note: "Official bill page"
      }
    ],
    created_at: "2024-01-08T00:00:00Z",
    updated_at: "2024-01-25T00:00:00Z",
    latest_action: {
      action: "Signed by Governor",
      date: "2024-01-25",
      actor: "Governor"
    },
    status: "passed",
    status_date: "2024-01-25",
    progress: [
      {
        event: "Introduced",
        date: "2024-01-08",
        actor: "House"
      },
      {
        event: "Passed House",
        date: "2024-01-20",
        actor: "House"
      },
      {
        event: "Signed by Governor",
        date: "2024-01-25",
        actor: "Governor"
      }
    ]
  },
  {
    id: "co-2024-sb0789",
    title: "Criminal Justice Reform",
    bill_id: "SB24-0789",
    state: "co",
    session: "2024",
    subjects: ["Criminal Justice", "Sentencing", "Rehabilitation"],
    type: ["bill"],
    sponsors: [
      {
        name: "Sen. Julie Gonzales",
        role: "primary",
        chamber: "upper",
        district: "SD-34"
      }
    ],
    actions: [
      {
        action: "Introduced in Senate",
        date: "2024-01-14",
        actor: "Senate",
        type: "introduction"
      },
      {
        action: "Passed Senate Judiciary Committee",
        date: "2024-01-18",
        actor: "Judiciary Committee",
        type: "committee"
      }
    ],
    sources: [
      {
        url: "https://leg.colorado.gov/bills/sb24-0789",
        note: "Official bill page"
      }
    ],
    created_at: "2024-01-14T00:00:00Z",
    updated_at: "2024-01-18T00:00:00Z",
    latest_action: {
      action: "Passed Senate Judiciary Committee",
      date: "2024-01-18",
      actor: "Judiciary Committee"
    },
    status: "active",
    status_date: "2024-01-18",
    progress: [
      {
        event: "Introduced",
        date: "2024-01-14",
        actor: "Senate"
      },
      {
        event: "Committee Hearing",
        date: "2024-01-18",
        actor: "Judiciary Committee"
      }
    ]
  },
  {
    id: "co-2024-hb0891",
    title: "Water Rights Modernization",
    bill_id: "HB24-0891",
    state: "co",
    session: "2024",
    subjects: ["Water", "Agriculture", "Rights"],
    type: ["bill"],
    sponsors: [
      {
        name: "Rep. Rod Bockenfeld",
        role: "primary",
        chamber: "lower",
        district: "HD-56"
      }
    ],
    actions: [
      {
        action: "Introduced in House",
        date: "2024-01-16",
        actor: "House",
        type: "introduction"
      },
      {
        action: "Defeated in House Committee",
        date: "2024-01-22",
        actor: "Agriculture Committee",
        type: "committee"
      }
    ],
    sources: [
      {
        url: "https://leg.colorado.gov/bills/hb24-0891",
        note: "Official bill page"
      }
    ],
    created_at: "2024-01-16T00:00:00Z",
    updated_at: "2024-01-22T00:00:00Z",
    latest_action: {
      action: "Defeated in House Committee",
      date: "2024-01-22",
      actor: "Agriculture Committee"
    },
    status: "failed",
    status_date: "2024-01-22",
    progress: [
      {
        event: "Introduced",
        date: "2024-01-16",
        actor: "House"
      },
      {
        event: "Committee Hearing",
        date: "2024-01-22",
        actor: "Agriculture Committee"
      }
    ]
  }
];

// Mock Colorado Legislators Data
export const mockLegislators: MockLegislator[] = [
  {
    id: "co-legislator-mccluskie",
    name: "Julie McCluskie",
    first_name: "Julie",
    last_name: "McCluskie",
    party: "Democratic",
    chamber: "lower",
    district: "HD-13",
    state: "co",
    roles: [
      {
        type: "committee",
        title: "Member",
        committee: "Appropriations",
        start_date: "2023-01-01"
      },
      {
        type: "committee",
        title: "Member",
        committee: "Education",
        start_date: "2023-01-01"
      }
    ],
    offices: [
      {
        type: "capitol",
        name: "Capitol Office",
        address: "200 E Colfax Ave, Denver, CO 80203",
        phone: "(303) 866-2952",
        email: "julie.mccluskie@coleg.gov"
      }
    ],
    sources: [
      {
        url: "https://leg.colorado.gov/legislators/julie-mccluskie",
        note: "Official legislator page"
      }
    ],
    created_at: "2023-01-01T00:00:00Z",
    updated_at: "2024-01-01T00:00:00Z"
  },
  {
    id: "co-legislator-gardner",
    name: "Bob Gardner",
    first_name: "Bob",
    last_name: "Gardner",
    party: "Republican",
    chamber: "upper",
    district: "SD-12",
    state: "co",
    roles: [
      {
        type: "committee",
        title: "Member",
        committee: "Judiciary",
        start_date: "2023-01-01"
      },
      {
        type: "committee",
        title: "Member",
        committee: "Finance",
        start_date: "2023-01-01"
      }
    ],
    offices: [
      {
        type: "capitol",
        name: "Capitol Office",
        address: "200 E Colfax Ave, Denver, CO 80203",
        phone: "(303) 866-4881",
        email: "bob.gardner@coleg.gov"
      }
    ],
    sources: [
      {
        url: "https://leg.colorado.gov/legislators/bob-gardner",
        note: "Official legislator page"
      }
    ],
    created_at: "2023-01-01T00:00:00Z",
    updated_at: "2024-01-01T00:00:00Z"
  },
  {
    id: "co-legislator-winter",
    name: "Faith Winter",
    first_name: "Faith",
    last_name: "Winter",
    party: "Democratic",
    chamber: "upper",
    district: "SD-24",
    state: "co",
    roles: [
      {
        type: "committee",
        title: "Member",
        committee: "Transportation",
        start_date: "2023-01-01"
      },
      {
        type: "committee",
        title: "Member",
        committee: "Energy & Environment",
        start_date: "2023-01-01"
      }
    ],
    offices: [
      {
        type: "capitol",
        name: "Capitol Office",
        address: "200 E Colfax Ave, Denver, CO 80203",
        phone: "(303) 866-4840",
        email: "faith.winter@coleg.gov"
      }
    ],
    sources: [
      {
        url: "https://leg.colorado.gov/legislators/faith-winter",
        note: "Official legislator page"
      }
    ],
    created_at: "2023-01-01T00:00:00Z",
    updated_at: "2024-01-01T00:00:00Z"
  }
];

// Mock API functions that return the mock data
export const mockBillsAPI = {
  async getBills(state: string = 'co', session?: string): Promise<MockBill[]> {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    return mockBills.filter(bill => bill.state === state);
  },

  async getBill(billId: string): Promise<MockBill | null> {
    await new Promise(resolve => setTimeout(resolve, 500));
    return mockBills.find(bill => bill.id === billId) || null;
  },

  async searchBills(query: string, state: string = 'co'): Promise<MockBill[]> {
    await new Promise(resolve => setTimeout(resolve, 800));
    return mockBills.filter(bill => 
      bill.state === state && 
      (bill.title.toLowerCase().includes(query.toLowerCase()) ||
       bill.bill_id.toLowerCase().includes(query.toLowerCase()))
    );
  }
};

export const mockLegislatorsAPI = {
  async getLegislators(state: string = 'co'): Promise<MockLegislator[]> {
    await new Promise(resolve => setTimeout(resolve, 1000));
    return mockLegislators.filter(leg => leg.state === state);
  },

  async getLegislator(legislatorId: string): Promise<MockLegislator | null> {
    await new Promise(resolve => setTimeout(resolve, 500));
    return mockLegislators.find(leg => leg.id === legislatorId) || null;
  },

  async searchLegislators(query: string, state: string = 'co'): Promise<MockLegislator[]> {
    await new Promise(resolve => setTimeout(resolve, 800));
    return mockLegislators.filter(leg => 
      leg.state === state && 
      leg.name.toLowerCase().includes(query.toLowerCase())
    );
  }
};
