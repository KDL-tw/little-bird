import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const state = searchParams.get('state') || 'co';
    const session = searchParams.get('session');
    const query = searchParams.get('q');
    const subject = searchParams.get('subject');

    // Build OpenStates API URL (updated to new domain)
    let url = `https://open.pluralpolicy.com/api/v1/bills/?state=${state}&per_page=50`;
    
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

    // Add API key if available
    const apiKey = process.env.NEXT_PUBLIC_OPENSTATES_API_KEY || '7fffc14f-6f2d-4168-ac04-628867cec6b1';
    if (apiKey) {
      headers['X-API-Key'] = apiKey;
    }

    const response = await fetch(url, { headers });

    if (!response.ok) {
      throw new Error(`OpenStates API error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    
    console.log('OpenStates API response:', {
      status: response.status,
      dataType: typeof data,
      dataKeys: data ? Object.keys(data) : 'null',
      dataLength: Array.isArray(data) ? data.length : 'not array'
    });
    
    // Handle different response formats
    let bills = [];
    if (Array.isArray(data)) {
      bills = data;
    } else if (data.results && Array.isArray(data.results)) {
      bills = data.results;
    } else if (data.data && Array.isArray(data.data)) {
      bills = data.data;
    } else if (data.bills && Array.isArray(data.bills)) {
      bills = data.bills;
    }
    
    return NextResponse.json({
      success: true,
      data: bills,
      count: bills.length,
      originalData: data
    });

  } catch (error) {
    console.error('OpenStates bills API error:', error);
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}
