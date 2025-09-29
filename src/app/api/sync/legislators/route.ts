import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function POST(request: NextRequest) {
  try {
    console.log('Starting legislators sync from OpenStates...');
    
    // Get legislators from OpenStates API (max 20 per request)
    const openStatesUrl = `https://v3.openstates.org/people?jurisdiction=CO&per_page=20`;
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
    const legislators = data.results || [];

    console.log(`Found ${legislators.length} legislators from OpenStates`);

    // Transform and store in our database
    const transformedLegislators = legislators.map((leg: any) => ({
      name: leg.name || 'Unknown',
      district: leg.district || 'Unknown',
      party: leg.party || 'Unknown',
      chamber: leg.current_role?.title?.includes('Senate') ? 'Senate' : 'House',
      committee_assignments: leg.roles?.map((role: any) => role.title).join(', ') || '',
      phone: leg.contact_details?.find((cd: any) => cd.type === 'voice')?.value || '',
      email: leg.contact_details?.find((cd: any) => cd.type === 'email')?.value || '',
      office_location: leg.offices?.[0]?.address || '',
      relationship_score: 'None' as 'High' | 'Medium' | 'Low' | 'None',
      bills_sponsored: 0,
      vote_alignment: 0,
      last_contact: null,
      openstates_id: leg.id,
      openstates_data: leg,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    }));

    // Clear existing legislators and insert new ones
    const { error: deleteError } = await supabase
      .from('legislators')
      .delete()
      .neq('id', '00000000-0000-0000-0000-000000000000'); // Delete all

    if (deleteError) {
      console.error('Error clearing legislators:', deleteError);
    }

    // Insert new legislators
    const { data: insertedLegislators, error: insertError } = await supabase
      .from('legislators')
      .insert(transformedLegislators)
      .select();

    if (insertError) {
      console.error('Error inserting legislators:', insertError);
      throw insertError;
    }

    console.log(`Successfully synced ${insertedLegislators?.length || 0} legislators`);

    return NextResponse.json({
      success: true,
      message: `Synced ${insertedLegislators?.length || 0} legislators from OpenStates`,
      count: insertedLegislators?.length || 0,
      legislators: insertedLegislators?.slice(0, 5) // Return first 5 for preview
    });

  } catch (error) {
    console.error('Legislators sync error:', error);
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}
