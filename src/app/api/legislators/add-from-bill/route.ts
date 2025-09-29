import { NextRequest, NextResponse } from 'next/server';
import { legislatorsDataService } from '@/lib/database';

export async function POST(request: NextRequest) {
  try {
    const { billId } = await request.json();
    
    if (!billId) {
      return NextResponse.json({
        success: false,
        error: 'billId is required'
      }, { status: 400 });
    }

    // First, get the bill sponsors from OpenStates
    const sponsorsResponse = await fetch(`${process.env.NEXT_PUBLIC_VERCEL_URL || 'http://localhost:3000'}/api/openstates/bill-sponsors?bill_id=${billId}`);
    
    if (!sponsorsResponse.ok) {
      throw new Error('Failed to fetch bill sponsors');
    }
    
    const sponsorsData = await sponsorsResponse.json();
    
    if (!sponsorsData.success) {
      throw new Error(sponsorsData.error);
    }
    
    const sponsors = sponsorsData.sponsors;
    const addedLegislators = [];
    const skippedLegislators = [];
    
    // Add each sponsor to the database
    for (const sponsor of sponsors) {
      try {
        // Check if legislator already exists
        const existingLegislators = await legislatorsDataService.getAll();
        const exists = existingLegislators.some(leg => 
          leg.name === sponsor.name && leg.district === sponsor.district
        );
        
        if (exists) {
          skippedLegislators.push({
            name: sponsor.name,
            district: sponsor.district,
            reason: 'Already exists'
          });
          continue;
        }
        
        // Add new legislator
        const newLegislator = await legislatorsDataService.create({
          name: sponsor.name,
          district: sponsor.district || 'Unknown',
          party: sponsor.party || 'Unknown',
          chamber: sponsor.chamber || 'Unknown',
          committees: sponsor.committees || [],
          email: sponsor.email || '',
          phone: sponsor.phone || '',
          office: sponsor.office || '',
          photo_url: sponsor.photo_url || '',
          twitter_handle: sponsor.twitter_handle || '',
          facebook_page: sponsor.facebook_page || '',
          website: sponsor.website || '',
          relationship_score: 'None',
          bills_sponsored: 0,
          vote_alignment: 0,
          last_contact: null,
          bio: '',
          term_start: null,
          term_end: null,
          leadership_role: '',
          voting_record: {},
          campaign_finance: {}
        });
        
        addedLegislators.push({
          name: sponsor.name,
          district: sponsor.district,
          id: newLegislator.id
        });
        
      } catch (error) {
        console.error(`Error adding legislator ${sponsor.name}:`, error);
        skippedLegislators.push({
          name: sponsor.name,
          district: sponsor.district,
          reason: 'Error adding to database'
        });
      }
    }
    
    return NextResponse.json({
      success: true,
      bill: sponsorsData.bill,
      added: addedLegislators,
      skipped: skippedLegislators,
      total: sponsors.length,
      addedCount: addedLegislators.length,
      skippedCount: skippedLegislators.length
    });

  } catch (error) {
    console.error('Error adding legislators from bill:', error);
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}
