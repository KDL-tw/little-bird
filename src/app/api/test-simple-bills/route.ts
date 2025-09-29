import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    // Simple test with minimal parameters (jurisdiction only, no query)
    const url = `https://v3.openstates.org/bills?jurisdiction=CO&per_page=20`;
    
    console.log('Testing simple bills API:', url);
    
    const response = await fetch(url, {
      headers: {
        'Accept': 'application/json',
        'User-Agent': 'LittleBird/1.0',
        'X-API-Key': '7fffc14f-6f2d-4168-ac04-628867cec6b1'
      }
    });
    
    console.log('Response status:', response.status);
    
    if (!response.ok) {
      const errorText = await response.text();
      return NextResponse.json({
        success: false,
        status: response.status,
        error: errorText,
        url: url
      });
    }
    
    const data = await response.json();
    
    // Handle OpenStates v3 API response format (same as main API)
    let bills = [];
    if (data.results && Array.isArray(data.results)) {
      bills = data.results;
    } else if (Array.isArray(data)) {
      bills = data;
    }
    
    return NextResponse.json({
      success: true,
      status: response.status,
      data: bills,
      count: bills.length,
      url: url,
      pagination: data.pagination || null
    });
    
  } catch (error) {
    console.error('Simple bills test error:', error);
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}
