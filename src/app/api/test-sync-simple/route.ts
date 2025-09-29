import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function POST(request: NextRequest) {
  try {
    console.log('Starting simple test sync...');
    
    // Just try to insert one simple record to test the connection
    const testBill = {
      bill_number: 'TEST-001',
      title: 'Test Bill',
      sponsor: 'Test Sponsor',
      status: 'Active' as 'Active' | 'Passed' | 'Failed',
      last_action: 'Introduced',
      position: 'None' as 'Support' | 'Monitor' | 'Oppose' | 'None' | 'Hypothetical',
      priority: 'None' as 'High' | 'Medium' | 'Low' | 'None',
      watchlist: false,
      openstates_id: 'test-simple-1',
      openstates_data: { test: true },
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };

    console.log('Attempting to insert test bill...');
    
    const { data: insertedBill, error: insertError } = await supabase
      .from('bills')
      .insert([testBill])
      .select();

    if (insertError) {
      console.error('Supabase insert error:', insertError);
      return NextResponse.json({
        success: false,
        error: `Database error: ${insertError.message}`,
        details: insertError
      }, { status: 500 });
    }

    console.log('Successfully inserted test bill:', insertedBill);

    return NextResponse.json({
      success: true,
      message: 'Test sync successful - database connection working',
      bill: insertedBill?.[0],
      count: 1
    });

  } catch (error) {
    console.error('Simple test sync error:', error);
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined
    }, { status: 500 });
  }
}
