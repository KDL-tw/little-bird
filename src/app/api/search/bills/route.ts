import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get('q') || '';
    const status = searchParams.get('status');
    const limit = parseInt(searchParams.get('limit') || '20');

    console.log('Searching bills in our database:', { query, status, limit });

    // Build query
    let supabaseQuery = supabase
      .from('bills')
      .select('*')
      .order('updated_at', { ascending: false })
      .limit(limit);

    // Add search filter
    if (query.trim()) {
      supabaseQuery = supabaseQuery.or(`bill_number.ilike.%${query}%,title.ilike.%${query}%,sponsor.ilike.%${query}%`);
    }

    // Add status filter
    if (status && status !== 'all') {
      supabaseQuery = supabaseQuery.eq('status', status);
    }

    const { data: bills, error } = await supabaseQuery;

    if (error) {
      console.error('Database search error:', error);
      throw error;
    }

    console.log(`Found ${bills?.length || 0} bills in our database`);

    return NextResponse.json({
      success: true,
      data: bills || [],
      count: bills?.length || 0,
      query: query,
      status: status
    });

  } catch (error) {
    console.error('Bills search error:', error);
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}
