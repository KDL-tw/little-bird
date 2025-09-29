import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const state = searchParams.get('state') || 'co';
    const session = searchParams.get('session');
    const query = searchParams.get('q');
    const subject = searchParams.get('subject');

    // Build OpenStates API URL (using official v3 endpoint)
    let url = `https://v3.openstates.org/bills?per_page=50`;
    
    // Add jurisdiction (state) - required parameter (use full jurisdiction ID)
    if (state) {
      // Map state codes to full jurisdiction IDs
      const jurisdictionMap: { [key: string]: string } = {
        'co': 'ocd-jurisdiction/country:us/state:co/government',
        'ca': 'ocd-jurisdiction/country:us/state:ca/government',
        'ny': 'ocd-jurisdiction/country:us/state:ny/government',
        'tx': 'ocd-jurisdiction/country:us/state:tx/government',
        'fl': 'ocd-jurisdiction/country:us/state:fl/government'
      };
      const jurisdictionId = jurisdictionMap[state.toLowerCase()] || `ocd-jurisdiction/country:us/state:${state.toLowerCase()}/government`;
      url += `&jurisdiction=${jurisdictionId}`;
    }
    
    if (session) {
      url += `&session=${session}`;
    }
    if (query) {
      url += `&q=${encodeURIComponent(query)}`;
    }
    if (subject) {
      url += `&subject=${encodeURIComponent(subject)}`;
    }

    // Make request to OpenStates API
    const headers: HeadersInit = {
      'Accept': 'application/json',
      'User-Agent': 'LittleBird/1.0'
    };

    // Add API key if available (using apikey query parameter as per docs)
    const apiKey = process.env.NEXT_PUBLIC_OPENSTATES_API_KEY || '7fffc14f-6f2d-4168-ac04-628867cec6b1';
    if (apiKey) {
      url += `&apikey=${apiKey}`;
    }

    const response = await fetch(url, { headers });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('OpenStates API error response:', errorText);
      throw new Error(`OpenStates API error: ${response.status} ${response.statusText} - ${errorText}`);
    }

    const data = await response.json();
    
    console.log('OpenStates API response:', {
      status: response.status,
      dataType: typeof data,
      dataKeys: data ? Object.keys(data) : 'null',
      dataLength: Array.isArray(data) ? data.length : 'not array'
    });
    
    // Handle OpenStates v3 API response format
    let bills = [];
    if (data.results && Array.isArray(data.results)) {
      bills = data.results;
    } else if (Array.isArray(data)) {
      bills = data;
    }
    
    return NextResponse.json({
      success: true,
      data: bills,
      count: bills.length,
      pagination: data.pagination || null
    });

  } catch (error) {
    console.error('OpenStates bills API error:', error);
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}
