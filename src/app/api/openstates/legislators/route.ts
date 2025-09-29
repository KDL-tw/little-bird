import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const state = searchParams.get('state') || 'co';
    const query = searchParams.get('q');

    // Build OpenStates API URL (using official v3 endpoint)
    let url = `https://v3.openstates.org/people?per_page=100`;
    
    // Add jurisdiction (state) - required parameter
    if (state) {
      url += `&jurisdiction=${state}`;
    }
    
    if (query) {
      url += `&name=${encodeURIComponent(query)}`;
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
      throw new Error(`OpenStates API error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    
    // Handle OpenStates v3 API response format
    let legislators = [];
    if (data.results && Array.isArray(data.results)) {
      legislators = data.results;
    } else if (Array.isArray(data)) {
      legislators = data;
    }
    
    return NextResponse.json({
      success: true,
      data: legislators,
      count: legislators.length,
      pagination: data.pagination || null
    });

  } catch (error) {
    console.error('OpenStates legislators API error:', error);
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}
