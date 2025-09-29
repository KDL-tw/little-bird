import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function POST(request: NextRequest) {
  try {
    console.log('Starting bills sync from OpenStates...');
    
    // Get bills from OpenStates API (max 20 per request)
    const openStatesUrl = `https://v3.openstates.org/bills?jurisdiction=CO&per_page=20`;
    const response = await fetch(openStatesUrl, {
      headers: {
        'Accept': 'application/json',
        'User-Agent': 'LittleBird/1.0',
        'X-API-Key': process.env.NEXT_PUBLIC_OPENSTATES_API_KEY || '7fffc14f-6f2d-4168-ac04-628867cec6b1'
      }
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('OpenStates API error response:', errorText);
      throw new Error(`OpenStates API error: ${response.status} - ${errorText}`);
    }

    const data = await response.json();
    const bills = data.results || [];

    console.log(`Found ${bills.length} bills from OpenStates`);

    // Transform and store in our database
    const transformedBills = bills.map((bill: any) => ({
      bill_number: bill.identifier || 'Unknown',
      title: bill.title || 'Unknown Title',
      sponsor: bill.sponsors?.[0]?.name || 'Unknown',
      status: 'Active' as 'Active' | 'Passed' | 'Failed',
      last_action: bill.latest_action_description || 'Introduced',
      position: 'None' as 'Support' | 'Monitor' | 'Oppose' | 'None' | 'Hypothetical',
      priority: 'None' as 'High' | 'Medium' | 'Low' | 'None',
      watchlist: false,
      openstates_id: bill.id,
      openstates_data: bill,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    }));

    // Clear existing bills and insert new ones
    const { error: deleteError } = await supabase
      .from('bills')
      .delete()
      .neq('id', '00000000-0000-0000-0000-000000000000'); // Delete all

    if (deleteError) {
      console.error('Error clearing bills:', deleteError);
    }

    // Insert new bills
    const { data: insertedBills, error: insertError } = await supabase
      .from('bills')
      .insert(transformedBills)
      .select();

    if (insertError) {
      console.error('Error inserting bills:', insertError);
      throw insertError;
    }

    console.log(`Successfully synced ${insertedBills?.length || 0} bills`);

    return NextResponse.json({
      success: true,
      message: `Synced ${insertedBills?.length || 0} bills from OpenStates`,
      count: insertedBills?.length || 0,
      bills: insertedBills?.slice(0, 5) // Return first 5 for preview
    });

  } catch (error) {
    console.error('Bills sync error:', error);
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}
