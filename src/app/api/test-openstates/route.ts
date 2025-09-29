import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    const apiKey = '7fffc14f-6f2d-4168-ac04-628867cec6b1';
    
    // Test different OpenStates endpoints
    const endpoints = [
      'https://open.pluralpolicy.com/api/v1/bills/?state=co&per_page=3',
      'https://open.pluralpolicy.com/api/v1/legislators/?state=co&per_page=3',
      'https://open.pluralpolicy.com/api/v1/bills/?state=co&q=education&per_page=3'
    ];
    
    const results = {};
    
    for (const endpoint of endpoints) {
      try {
        const response = await fetch(endpoint, {
          headers: {
            'X-API-Key': apiKey,
            'Accept': 'application/json',
            'User-Agent': 'LittleBird/1.0'
          }
        });
        
        const data = await response.json();
        results[endpoint] = {
          status: response.status,
          ok: response.ok,
          data: data
        };
      } catch (error) {
        results[endpoint] = {
          error: error instanceof Error ? error.message : 'Unknown error'
        };
      }
    }
    
    return NextResponse.json({
      success: true,
      results
    });
    
  } catch (error) {
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}
