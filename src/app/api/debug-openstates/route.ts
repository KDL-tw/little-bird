import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    const apiKey = '7fffc14f-6f2d-4168-ac04-628867cec6b1';
    
    // Test the API with v3 endpoint (using full jurisdiction ID)
    const testUrl = `https://v3.openstates.org/bills?jurisdiction=ocd-jurisdiction/country:us/state:co/government&per_page=3&apikey=${apiKey}`;
    
    console.log('Testing OpenStates API:', testUrl);
    
    const response = await fetch(testUrl, {
      headers: {
        'Accept': 'application/json',
        'User-Agent': 'LittleBird/1.0'
      }
    });
    
    console.log('Response status:', response.status);
    console.log('Response headers:', Object.fromEntries(response.headers.entries()));
    
    const text = await response.text();
    console.log('Response text:', text);
    
    let data;
    try {
      data = JSON.parse(text);
    } catch (e) {
      return NextResponse.json({
        success: false,
        error: 'Failed to parse JSON',
        status: response.status,
        text: text.substring(0, 500)
      });
    }
    
    return NextResponse.json({
      success: true,
      status: response.status,
      data: data,
      text: text.substring(0, 500)
    });
    
  } catch (error) {
    console.error('Debug API error:', error);
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}
