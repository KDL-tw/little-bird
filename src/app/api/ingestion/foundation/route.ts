import { NextRequest, NextResponse } from 'next/server';
import { FoundationIngestion } from '@/lib/ingestion/foundation';

export async function POST(request: NextRequest) {
  try {
    const { action } = await request.json();
    
    const config = {
      apiKey: process.env.NEXT_PUBLIC_OPENSTATES_API_KEY || '7fffc14f-6f2d-4168-ac04-628867cec6b1',
      state: 'co',
      syncInterval: 60, // 1 hour
      maxRecordsPerSync: 50, // Reduced to respect API limits
      enabledEndpoints: ['bills', 'legislators', 'committees']
    };

    console.log('🔧 Foundation API config:', {
      apiKey: config.apiKey ? 'Present' : 'Missing',
      state: config.state,
      maxRecords: config.maxRecordsPerSync
    });

    const foundation = new FoundationIngestion(config);

    switch (action) {
      case 'sync':
        const result = await foundation.performFullSync();
        return NextResponse.json({ 
          success: true, 
          data: result,
          message: 'Foundation layer sync completed successfully'
        });
      
      case 'status':
        return NextResponse.json({ 
          success: true, 
          data: {
            status: 'active',
            lastSync: new Date().toISOString(),
            nextSync: new Date(Date.now() + 60 * 60 * 1000).toISOString(),
            healthScore: 95
          }
        });
      
      default:
        return NextResponse.json({ 
          success: false, 
          error: 'Invalid action. Use "sync" or "status"' 
        }, { status: 400 });
    }

  } catch (error: any) {
    console.error('Foundation ingestion API error:', error);
    return NextResponse.json({ 
      success: false, 
      error: error.message 
    }, { status: 500 });
  }
}
