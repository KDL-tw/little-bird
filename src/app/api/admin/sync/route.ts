// ADMIN SYNC API
// This API populates the admin repository with OpenStates data
// No authentication required - this is admin-only functionality

import { NextRequest, NextResponse } from 'next/server';
import { adminSyncService } from '@/lib/admin-sync';

export async function POST(request: NextRequest) {
  try {
    const { type, session } = await request.json();
    
    console.log(`🔄 Admin sync requested: ${type} for session ${session || '2025B'}`);

    let result;
    
    switch (type) {
      case 'legislators':
        result = await adminSyncService.syncLegislators(200);
        break;
      case 'bills':
        result = await adminSyncService.syncBills(session || '2025B', 500);
        break;
      case 'sponsors':
        result = await adminSyncService.syncBillSponsors(session || '2025B', 100);
        break;
      case 'full':
        result = await adminSyncService.fullSync(session || '2025B');
        break;
      default:
        return NextResponse.json({
          success: false,
          error: 'Invalid sync type. Use "legislators", "bills", "sponsors", or "full"'
        }, { status: 400 });
    }

    return NextResponse.json({
      success: true,
      message: `Admin repository sync completed successfully`,
      result
    });

  } catch (error) {
    console.error('Admin sync error:', error);
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}
