import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    // First, get the list of jurisdictions to see what Colorado's ID should be
    const jurisdictionsUrl = 'https://v3.openstates.org/jurisdictions';
    
    console.log('Testing jurisdictions API:', jurisdictionsUrl);
    
    const response = await fetch(jurisdictionsUrl, {
      headers: {
        'Accept': 'application/json',
        'User-Agent': 'LittleBird/1.0'
      }
    });
    
    console.log('Jurisdictions response status:', response.status);
    
    const text = await response.text();
    console.log('Jurisdictions response text (first 1000 chars):', text.substring(0, 1000));
    
    if (!response.ok) {
      return NextResponse.json({
        success: false,
        status: response.status,
        error: text,
        url: jurisdictionsUrl
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
    
    // Filter for Colorado jurisdictions
    const coloradoJurisdictions = data.results?.filter((j: any) => 
      j.name?.toLowerCase().includes('colorado') || 
      j.id?.includes('co')
    ) || [];
    
    return NextResponse.json({
      success: true,
      status: response.status,
      allJurisdictions: data.results?.slice(0, 10) || [], // First 10 for reference
      coloradoJurisdictions: coloradoJurisdictions,
      url: jurisdictionsUrl
    });
    
  } catch (error) {
    console.error('Jurisdictions test API error:', error);
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}
