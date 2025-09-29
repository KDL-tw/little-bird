import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get('q') || '';
    const party = searchParams.get('party');
    const chamber = searchParams.get('chamber');
    const limit = parseInt(searchParams.get('limit') || '20');

    console.log('Searching legislators in our database:', { query, party, chamber, limit });

    // Build query
    let supabaseQuery = supabase
      .from('legislators')
      .select('*')
      .order('name', { ascending: true })
      .limit(limit);

    // Add search filter
    if (query.trim()) {
      supabaseQuery = supabaseQuery.or(`name.ilike.%${query}%,district.ilike.%${query}%,committee_assignments.ilike.%${query}%`);
    }

    // Add party filter
    if (party && party !== 'all') {
      supabaseQuery = supabaseQuery.eq('party', party);
    }

    // Add chamber filter
    if (chamber && chamber !== 'all') {
      supabaseQuery = supabaseQuery.eq('chamber', chamber);
    }

    const { data: legislators, error } = await supabaseQuery;

    if (error) {
      console.error('Database search error:', error);
      throw error;
    }

    console.log(`Found ${legislators?.length || 0} legislators in our database`);

    return NextResponse.json({
      success: true,
      data: legislators || [],
      count: legislators?.length || 0,
      query: query,
      party: party,
      chamber: chamber
    });

  } catch (error) {
    console.error('Legislators search error:', error);
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}
