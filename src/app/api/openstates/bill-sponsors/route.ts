import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const billId = searchParams.get('bill_id');
    
    if (!billId) {
      return NextResponse.json({
        success: false,
        error: 'bill_id parameter is required'
      }, { status: 400 });
    }

    // Build OpenStates API URL for specific bill
    const url = `https://open.pluralpolicy.com/api/v1/bills/${billId}/`;

    // Make request to OpenStates API
    const headers: HeadersInit = {
      'Accept': 'application/json',
      'User-Agent': 'LittleBird/1.0'
    };

    // Add API key if available
    const apiKey = process.env.NEXT_PUBLIC_OPENSTATES_API_KEY || '7fffc14f-6f2d-4168-ac04-628867cec6b1';
    if (apiKey) {
      headers['X-API-Key'] = apiKey;
    }

    const response = await fetch(url, { headers });

    if (!response.ok) {
      throw new Error(`OpenStates API error: ${response.status} ${response.statusText}`);
    }

    const billData = await response.json();
    
    // Extract sponsors and cosponsors
    const sponsors = billData.sponsors || [];
    const cosponsors = billData.cosponsors || [];
    
    // Combine and deduplicate
    const allSponsors = [...sponsors, ...cosponsors];
    const uniqueSponsors = allSponsors.filter((sponsor, index, self) => 
      index === self.findIndex(s => s.id === sponsor.id)
    );
    
    return NextResponse.json({
      success: true,
      bill: {
        id: billData.id,
        title: billData.title,
        bill_number: billData.identifier,
        session: billData.session
      },
      sponsors: uniqueSponsors,
      count: uniqueSponsors.length
    });

  } catch (error) {
    console.error('OpenStates bill sponsors API error:', error);
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}
