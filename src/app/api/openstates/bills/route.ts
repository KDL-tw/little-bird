import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const state = searchParams.get('state') || 'co';
    const session = searchParams.get('session');
    const query = searchParams.get('q');
    const subject = searchParams.get('subject');

    // Build OpenStates API URL (using official v3 endpoint)
    let url = `https://v3.openstates.org/bills?per_page=20`;
    
    // Add jurisdiction (state) - required parameter (use state abbreviation)
    if (state) {
      url += `&jurisdiction=${state.toUpperCase()}`;
    }
    
    if (session) {
      url += `&session=${session}`;
    }
    if (query) {
      url += `&q=${encodeURIComponent(query)}`;
    }
    // Note: We don't need to add q=* because jurisdiction alone is sufficient
    if (subject) {
      url += `&subject=${encodeURIComponent(subject)}`;
    }

    // Make request to OpenStates API
    const headers: HeadersInit = {
      'Accept': 'application/json',
      'User-Agent': 'LittleBird/1.0'
    };

    // Add API key in header (as per video tutorial)
    const apiKey = process.env.NEXT_PUBLIC_OPENSTATES_API_KEY || '7fffc14f-6f2d-4168-ac04-628867cec6b1';
    if (apiKey) {
      headers['X-API-Key'] = apiKey;
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
      dataLength: Array.isArray(data) ? data.length : 'not array',
      url: url
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
