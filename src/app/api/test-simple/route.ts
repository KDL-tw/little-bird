import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    // Test with the most basic OpenStates API call
    const testUrl = 'https://v3.openstates.org/bills?per_page=3';
    
    console.log('Testing simple OpenStates API call:', testUrl);
    
    const response = await fetch(testUrl, {
      headers: {
        'Accept': 'application/json',
        'User-Agent': 'LittleBird/1.0'
      }
    });
    
    console.log('Response status:', response.status);
    console.log('Response headers:', Object.fromEntries(response.headers.entries()));
    
    const text = await response.text();
    console.log('Response text (first 500 chars):', text.substring(0, 500));
    
    if (!response.ok) {
      return NextResponse.json({
        success: false,
        status: response.status,
        error: text,
        url: testUrl
      });
    }
    
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
      url: testUrl
    });
    
  } catch (error) {
    console.error('Simple test API error:', error);
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}
