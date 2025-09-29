import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function POST(request: NextRequest) {
  try {
    console.log('Starting test sync with sample data...');
    
    // Create sample bills data
    const sampleBills = [
      {
        bill_number: 'HB24-1001',
        title: 'Colorado Clean Energy Act',
        sponsor: 'Rep. Jane Smith',
        status: 'Active' as 'Active' | 'Passed' | 'Failed',
        last_action: 'Passed House Committee',
        position: 'Support' as 'Support' | 'Monitor' | 'Oppose' | 'None' | 'Hypothetical',
        priority: 'High' as 'High' | 'Medium' | 'Low' | 'None',
        watchlist: true,
        openstates_id: 'test-bill-1',
        openstates_data: { test: true },
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      },
      {
        bill_number: 'SB24-0123',
        title: 'Education Funding Reform',
        sponsor: 'Sen. John Doe',
        status: 'Active' as 'Active' | 'Passed' | 'Failed',
        last_action: 'Introduced',
        position: 'Monitor' as 'Support' | 'Monitor' | 'Oppose' | 'None' | 'Hypothetical',
        priority: 'Medium' as 'High' | 'Medium' | 'Low' | 'None',
        watchlist: false,
        openstates_id: 'test-bill-2',
        openstates_data: { test: true },
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      },
      {
        bill_number: 'HB24-2005',
        title: 'Healthcare Access Expansion',
        sponsor: 'Rep. Sarah Johnson',
        status: 'Active' as 'Active' | 'Passed' | 'Failed',
        last_action: 'Referred to Committee',
        position: 'None' as 'Support' | 'Monitor' | 'Oppose' | 'None' | 'Hypothetical',
        priority: 'Low' as 'High' | 'Medium' | 'Low' | 'None',
        watchlist: false,
        openstates_id: 'test-bill-3',
        openstates_data: { test: true },
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }
    ];

    // Create sample legislators data
    const sampleLegislators = [
      {
        name: 'Rep. Jane Smith',
        district: 'HD-15',
        party: 'D',
        chamber: 'House' as 'House' | 'Senate',
        committee_assignments: 'Energy & Environment, Transportation',
        phone: '(303) 555-0101',
        email: 'jane.smith@coleg.gov',
        office_location: 'Room 200, State Capitol',
        relationship_score: 'High' as 'High' | 'Medium' | 'Low' | 'None',
        bills_sponsored: 5,
        vote_alignment: 85,
        last_contact: new Date().toISOString(),
        openstates_id: 'test-leg-1',
        openstates_data: { test: true },
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      },
      {
        name: 'Sen. John Doe',
        district: 'SD-8',
        party: 'R',
        chamber: 'Senate' as 'House' | 'Senate',
        committee_assignments: 'Education, Finance',
        phone: '(303) 555-0102',
        email: 'john.doe@coleg.gov',
        office_location: 'Room 350, State Capitol',
        relationship_score: 'Medium' as 'High' | 'Medium' | 'Low' | 'None',
        bills_sponsored: 3,
        vote_alignment: 45,
        last_contact: null,
        openstates_id: 'test-leg-2',
        openstates_data: { test: true },
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      },
      {
        name: 'Rep. Sarah Johnson',
        district: 'HD-22',
        party: 'D',
        chamber: 'House' as 'House' | 'Senate',
        committee_assignments: 'Health & Human Services',
        phone: '(303) 555-0103',
        email: 'sarah.johnson@coleg.gov',
        office_location: 'Room 180, State Capitol',
        relationship_score: 'Low' as 'High' | 'Medium' | 'Low' | 'None',
        bills_sponsored: 2,
        vote_alignment: 75,
        last_contact: null,
        openstates_id: 'test-leg-3',
        openstates_data: { test: true },
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }
    ];

    // Clear existing data
    await supabase.from('bills').delete().neq('id', '00000000-0000-0000-0000-000000000000');
    await supabase.from('legislators').delete().neq('id', '00000000-0000-0000-0000-000000000000');

    // Insert sample bills
    const { data: insertedBills, error: billsError } = await supabase
      .from('bills')
      .insert(sampleBills)
      .select();

    if (billsError) {
      console.error('Error inserting bills:', billsError);
      throw billsError;
    }

    // Insert sample legislators
    const { data: insertedLegislators, error: legislatorsError } = await supabase
      .from('legislators')
      .insert(sampleLegislators)
      .select();

    if (legislatorsError) {
      console.error('Error inserting legislators:', legislatorsError);
      throw legislatorsError;
    }

    console.log(`Successfully synced ${insertedBills?.length || 0} bills and ${insertedLegislators?.length || 0} legislators`);

    return NextResponse.json({
      success: true,
      message: `Synced ${insertedBills?.length || 0} bills and ${insertedLegislators?.length || 0} legislators with sample data`,
      bills_count: insertedBills?.length || 0,
      legislators_count: insertedLegislators?.length || 0,
      bills: insertedBills?.slice(0, 3),
      legislators: insertedLegislators?.slice(0, 3)
    });

  } catch (error) {
    console.error('Test sync error:', error);
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}
