import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type') || 'bills';
    const query = searchParams.get('q') || '';

    // Sample bills data (stored in memory)
    const sampleBills = [
      {
        id: '1',
        bill_number: 'HB24-1001',
        title: 'Colorado Clean Energy Act',
        sponsor: 'Rep. Jane Smith',
        status: 'Active',
        last_action: 'Passed House Committee',
        position: 'Support',
        priority: 'High',
        watchlist: true,
        created_at: '2024-01-15T10:00:00Z',
        updated_at: '2024-01-20T14:30:00Z'
      },
      {
        id: '2',
        bill_number: 'SB24-0123',
        title: 'Education Funding Reform',
        sponsor: 'Sen. John Doe',
        status: 'Active',
        last_action: 'Introduced',
        position: 'Monitor',
        priority: 'Medium',
        watchlist: false,
        created_at: '2024-01-10T09:00:00Z',
        updated_at: '2024-01-18T11:15:00Z'
      },
      {
        id: '3',
        bill_number: 'HB24-2005',
        title: 'Healthcare Access Expansion',
        sponsor: 'Rep. Sarah Johnson',
        status: 'Active',
        last_action: 'Referred to Committee',
        position: 'None',
        priority: 'Low',
        watchlist: false,
        created_at: '2024-01-12T13:45:00Z',
        updated_at: '2024-01-19T16:20:00Z'
      },
      {
        id: '4',
        bill_number: 'SB24-0456',
        title: 'Transportation Infrastructure Investment',
        sponsor: 'Sen. Mike Wilson',
        status: 'Passed',
        last_action: 'Signed by Governor',
        position: 'Support',
        priority: 'High',
        watchlist: true,
        created_at: '2024-01-05T08:30:00Z',
        updated_at: '2024-01-25T10:00:00Z'
      },
      {
        id: '5',
        bill_number: 'HB24-3001',
        title: 'Small Business Tax Relief',
        sponsor: 'Rep. Lisa Chen',
        status: 'Active',
        last_action: 'Passed Senate',
        position: 'Support',
        priority: 'Medium',
        watchlist: true,
        created_at: '2024-01-08T14:20:00Z',
        updated_at: '2024-01-22T09:45:00Z'
      }
    ];

    // Sample legislators data (stored in memory)
    const sampleLegislators = [
      {
        id: '1',
        name: 'Rep. Jane Smith',
        district: 'HD-15',
        party: 'D',
        chamber: 'House',
        committee_assignments: 'Energy & Environment, Transportation',
        phone: '(303) 555-0101',
        email: 'jane.smith@coleg.gov',
        office_location: 'Room 200, State Capitol',
        relationship_score: 'High',
        bills_sponsored: 5,
        vote_alignment: 85,
        last_contact: '2024-01-20T10:00:00Z',
        created_at: '2024-01-01T00:00:00Z',
        updated_at: '2024-01-20T10:00:00Z'
      },
      {
        id: '2',
        name: 'Sen. John Doe',
        district: 'SD-8',
        party: 'R',
        chamber: 'Senate',
        committee_assignments: 'Education, Finance',
        phone: '(303) 555-0102',
        email: 'john.doe@coleg.gov',
        office_location: 'Room 350, State Capitol',
        relationship_score: 'Medium',
        bills_sponsored: 3,
        vote_alignment: 45,
        last_contact: null,
        created_at: '2024-01-01T00:00:00Z',
        updated_at: '2024-01-18T15:30:00Z'
      },
      {
        id: '3',
        name: 'Rep. Sarah Johnson',
        district: 'HD-22',
        party: 'D',
        chamber: 'House',
        committee_assignments: 'Health & Human Services',
        phone: '(303) 555-0103',
        email: 'sarah.johnson@coleg.gov',
        office_location: 'Room 180, State Capitol',
        relationship_score: 'Low',
        bills_sponsored: 2,
        vote_alignment: 75,
        last_contact: null,
        created_at: '2024-01-01T00:00:00Z',
        updated_at: '2024-01-15T12:00:00Z'
      },
      {
        id: '4',
        name: 'Sen. Mike Wilson',
        district: 'SD-12',
        party: 'R',
        chamber: 'Senate',
        committee_assignments: 'Transportation, Agriculture',
        phone: '(303) 555-0104',
        email: 'mike.wilson@coleg.gov',
        office_location: 'Room 400, State Capitol',
        relationship_score: 'High',
        bills_sponsored: 7,
        vote_alignment: 60,
        last_contact: '2024-01-19T14:00:00Z',
        created_at: '2024-01-01T00:00:00Z',
        updated_at: '2024-01-19T14:00:00Z'
      },
      {
        id: '5',
        name: 'Rep. Lisa Chen',
        district: 'HD-8',
        party: 'D',
        chamber: 'House',
        committee_assignments: 'Business Affairs, Finance',
        phone: '(303) 555-0105',
        email: 'lisa.chen@coleg.gov',
        office_location: 'Room 150, State Capitol',
        relationship_score: 'Medium',
        bills_sponsored: 4,
        vote_alignment: 80,
        last_contact: '2024-01-17T11:30:00Z',
        created_at: '2024-01-01T00:00:00Z',
        updated_at: '2024-01-17T11:30:00Z'
      }
    ];

    let data = [];
    let filteredData = [];

    if (type === 'bills') {
      data = sampleBills;
      if (query.trim()) {
        filteredData = data.filter(bill => 
          bill.bill_number.toLowerCase().includes(query.toLowerCase()) ||
          bill.title.toLowerCase().includes(query.toLowerCase()) ||
          bill.sponsor.toLowerCase().includes(query.toLowerCase())
        );
      } else {
        filteredData = data;
      }
    } else if (type === 'legislators') {
      data = sampleLegislators;
      if (query.trim()) {
        filteredData = data.filter(leg => 
          leg.name.toLowerCase().includes(query.toLowerCase()) ||
          leg.district.toLowerCase().includes(query.toLowerCase()) ||
          leg.committee_assignments.toLowerCase().includes(query.toLowerCase())
        );
      } else {
        filteredData = data;
      }
    }

    return NextResponse.json({
      success: true,
      data: filteredData,
      count: filteredData.length,
      type: type,
      query: query,
      source: 'offline-sample-data'
    });

  } catch (error) {
    console.error('Offline data error:', error);
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}
