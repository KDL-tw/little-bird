import { NextRequest, NextResponse } from 'next/server';
import { openStatesBackendSync } from '@/lib/sync-openstates-backend';

export async function POST(request: NextRequest) {
  try {
    const { type, session } = await request.json();
    
    console.log(`🔄 Backend sync requested: ${type} for session ${session || '2025B'}`);

    let result;
    
    switch (type) {
      case 'bills':
        result = await openStatesBackendSync.syncBills(session || '2025B', 100);
        break;
      case 'legislators':
        result = await openStatesBackendSync.syncLegislators(100);
        break;
      case 'full':
        result = await openStatesBackendSync.fullSync(session || '2025B');
        break;
      default:
        return NextResponse.json({
          success: false,
          error: 'Invalid sync type. Use "bills", "legislators", or "full"'
        }, { status: 400 });
    }

    return NextResponse.json({
      success: true,
      message: `Backend sync completed successfully`,
      result
    });

  } catch (error) {
    console.error('Backend sync error:', error);
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}
