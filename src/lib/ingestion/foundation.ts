// Foundation Layer - OpenStates Real API Integration
// Ground truth baseline data from official sources

import { OpenStatesConfig, OpenStatesSyncResult, IngestionJob } from './types';

export class FoundationIngestion {
  private config: OpenStatesConfig;

  constructor(config: OpenStatesConfig) {
    this.config = config;
  }

  // Main sync orchestrator
  async performFullSync(): Promise<OpenStatesSyncResult> {
    console.log('🏛️ Starting Foundation Layer sync...');
    
    const results: OpenStatesSyncResult = {
      bills: { total: 0, new: 0, updated: 0, errors: 0 },
      legislators: { total: 0, new: 0, updated: 0, errors: 0 },
      committees: { total: 0, new: 0, updated: 0, errors: 0 }
    };

    try {
      // Sync in parallel for efficiency
      const [billsResult, legislatorsResult, committeesResult] = await Promise.allSettled([
        this.syncBills(),
        this.syncLegislators(),
        this.syncCommittees()
      ]);

      // Process results
      if (billsResult.status === 'fulfilled') {
        results.bills = billsResult.value;
      } else {
        console.error('❌ Bills sync failed:', billsResult.reason);
        results.bills.errors = 1;
      }

      if (legislatorsResult.status === 'fulfilled') {
        results.legislators = legislatorsResult.value;
      } else {
        console.error('❌ Legislators sync failed:', legislatorsResult.reason);
        results.legislators.errors = 1;
      }

      if (committeesResult.status === 'fulfilled') {
        results.committees = committeesResult.value;
      } else {
        console.error('❌ Committees sync failed:', committeesResult.reason);
        results.committees.errors = 1;
      }

      console.log('✅ Foundation Layer sync completed:', results);
      return results;

    } catch (error) {
      console.error('❌ Foundation Layer sync failed:', error);
      throw error;
    }
  }

  // Sync bills with intelligent batching
  private async syncBills() {
    console.log('📜 Syncing bills...');
    
    const bills = await this.fetchBillsFromOpenStates();
    const { new: newCount, updated: updatedCount } = await this.processBills(bills);
    
    return {
      total: bills.length,
      new: newCount,
      updated: updatedCount,
      errors: 0
    };
  }

  // Sync legislators with relationship data
  private async syncLegislators() {
    console.log('👥 Syncing legislators...');
    
    const legislators = await this.fetchLegislatorsFromOpenStates();
    const { new: newCount, updated: updatedCount } = await this.processLegislators(legislators);
    
    return {
      total: legislators.length,
      new: newCount,
      updated: updatedCount,
      errors: 0
    };
  }

  // Sync committees and assignments
  private async syncCommittees() {
    console.log('🏛️ Syncing committees...');
    
    const committees = await this.fetchCommitteesFromOpenStates();
    const { new: newCount, updated: updatedCount } = await this.processCommittees(committees);
    
    return {
      total: committees.length,
      new: newCount,
      updated: updatedCount,
      errors: 0
    };
  }

  // Fetch bills from OpenStates with proper error handling
  private async fetchBillsFromOpenStates() {
    const url = `https://open.pluralpolicy.com/api/v1/bills/?state=${this.config.state}&per_page=${this.config.maxRecordsPerSync}`;
    
    console.log('🔗 Fetching bills from OpenStates:', url);
    console.log('🔑 Using API key:', this.config.apiKey ? 'Present' : 'Missing');
    
    const response = await fetch(url, {
      headers: {
        'Accept': 'application/json',
        'X-API-Key': this.config.apiKey,
        'User-Agent': 'LittleBird/1.0'
      }
    });

    console.log('📡 OpenStates response status:', response.status);

    if (!response.ok) {
      const errorText = await response.text();
      console.error('❌ OpenStates API error:', errorText);
      throw new Error(`OpenStates API error: ${response.status} ${response.statusText} - ${errorText}`);
    }

    const data = await response.json();
    console.log('📊 Received bills data:', data?.length || 0, 'bills');
    return data || [];
  }

  // Fetch legislators from OpenStates
  private async fetchLegislatorsFromOpenStates() {
    const url = `https://open.pluralpolicy.com/api/v1/legislators/?state=${this.config.state}&per_page=100`;
    
    console.log('🔗 Fetching legislators from OpenStates:', url);
    
    const response = await fetch(url, {
      headers: {
        'Accept': 'application/json',
        'X-API-Key': this.config.apiKey,
        'User-Agent': 'LittleBird/1.0'
      }
    });

    console.log('📡 OpenStates legislators response status:', response.status);

    if (!response.ok) {
      const errorText = await response.text();
      console.error('❌ OpenStates legislators API error:', errorText);
      throw new Error(`OpenStates API error: ${response.status} ${response.statusText} - ${errorText}`);
    }

    const data = await response.json();
    console.log('📊 Received legislators data:', data?.length || 0, 'legislators');
    return data || [];
  }

  // Fetch committees from OpenStates
  private async fetchCommitteesFromOpenStates() {
    const url = `https://open.pluralpolicy.com/api/v1/committees/?state=${this.config.state}&per_page=50`;
    
    console.log('🔗 Fetching committees from OpenStates:', url);
    
    const response = await fetch(url, {
      headers: {
        'Accept': 'application/json',
        'X-API-Key': this.config.apiKey,
        'User-Agent': 'LittleBird/1.0'
      }
    });

    console.log('📡 OpenStates committees response status:', response.status);

    if (!response.ok) {
      const errorText = await response.text();
      console.error('❌ OpenStates committees API error:', errorText);
      throw new Error(`OpenStates API error: ${response.status} ${response.statusText} - ${errorText}`);
    }

    const data = await response.json();
    console.log('📊 Received committees data:', data?.length || 0, 'committees');
    return data || [];
  }

  // Process and store bills in database
  private async processBills(bills: any[]) {
    let newCount = 0;
    let updatedCount = 0;

    for (const bill of bills) {
      try {
        const processedBill = this.transformBill(bill);
        
        // Store in database using our existing service
        const { billsDataService } = await import('@/lib/database');
        
        // Check if bill already exists
        const existingBills = await billsDataService.getAll();
        const existingBill = existingBills.find(b => b.bill_number === processedBill.bill_number);
        
        if (existingBill) {
          // Update existing bill
          await billsDataService.update(existingBill.id, {
            title: processedBill.title,
            sponsor: processedBill.sponsor,
            status: processedBill.status,
            last_action: processedBill.last_action,
            ai_analysis: processedBill.ai_analysis
          });
          updatedCount++;
          console.log(`📄 Updated bill: ${processedBill.bill_number}`);
        } else {
          // Create new bill
          await billsDataService.create({
            bill_number: processedBill.bill_number,
            title: processedBill.title,
            sponsor: processedBill.sponsor,
            status: processedBill.status,
            last_action: processedBill.last_action,
            position: processedBill.position,
            ai_analysis: processedBill.ai_analysis
          });
          newCount++;
          console.log(`📄 Added new bill: ${processedBill.bill_number}`);
        }
      } catch (error) {
        console.error(`❌ Failed to process bill ${bill.bill_id}:`, error);
      }
    }

    return { new: newCount, updated: updatedCount };
  }

  // Process and store legislators in database
  private async processLegislators(legislators: any[]) {
    let newCount = 0;
    let updatedCount = 0;

    for (const legislator of legislators) {
      try {
        const processedLegislator = this.transformLegislator(legislator);
        
        // Store in database using our existing service
        const { legislatorsDataService } = await import('@/lib/database');
        
        // Check if legislator already exists
        const existingLegislators = await legislatorsDataService.getAll();
        const existingLegislator = existingLegislators.find(l => l.name === processedLegislator.name && l.district === processedLegislator.district);
        
        if (existingLegislator) {
          // Update existing legislator
          await legislatorsDataService.update(existingLegislator.id, {
            name: processedLegislator.name,
            district: processedLegislator.district,
            party: processedLegislator.party,
            chamber: processedLegislator.chamber,
            committees: processedLegislator.committees,
            phone: processedLegislator.phone,
            email: processedLegislator.email,
            office: processedLegislator.office,
            topics_of_interest: processedLegislator.topics_of_interest
          });
          updatedCount++;
          console.log(`👤 Updated legislator: ${processedLegislator.name}`);
        } else {
          // Create new legislator
          await legislatorsDataService.create({
            name: processedLegislator.name,
            district: processedLegislator.district,
            party: processedLegislator.party,
            chamber: processedLegislator.chamber,
            committees: processedLegislator.committees,
            phone: processedLegislator.phone,
            email: processedLegislator.email,
            office: processedLegislator.office,
            relationship_score: processedLegislator.relationship_score,
            bills_sponsored: processedLegislator.bills_sponsored,
            vote_alignment: processedLegislator.vote_alignment,
            last_contact: processedLegislator.last_contact,
            topics_of_interest: processedLegislator.topics_of_interest
          });
          newCount++;
          console.log(`👤 Added new legislator: ${processedLegislator.name}`);
        }
      } catch (error) {
        console.error(`❌ Failed to process legislator ${legislator.name}:`, error);
      }
    }

    return { new: newCount, updated: updatedCount };
  }

  // Process and store committees in database
  private async processCommittees(committees: any[]) {
    let newCount = 0;
    let updatedCount = 0;

    for (const committee of committees) {
      try {
        const processedCommittee = this.transformCommittee(committee);
        // TODO: Store in database
        console.log(`🏛️ Processed committee: ${processedCommittee.name}`);
        newCount++; // Simplified for now
      } catch (error) {
        console.error(`❌ Failed to process committee ${committee.name}:`, error);
      }
    }

    return { new: newCount, updated: updatedCount };
  }

  // Transform OpenStates bill to our format
  private transformBill(bill: any) {
    return {
      id: bill.id,
      bill_number: bill.bill_id,
      title: bill.title,
      sponsor: bill.sponsors?.[0]?.name || 'Unknown',
      status: this.mapBillStatus(bill.status),
      last_action: bill.latest_action?.action || 'No recent action',
      position: 'None',
      ai_analysis: {
        executive_summary: `This ${bill.type?.[0] || 'bill'} addresses ${bill.subjects?.join(', ') || 'various topics'}.`,
        key_provisions: bill.subjects?.slice(0, 3) || [],
        stakeholder_impact: ['Impact analysis pending'],
        similar_bills: ['Similar bills analysis pending'],
        passage_likelihood: this.calculatePassageLikelihood(bill)
      },
      created_at: bill.created_at,
      updated_at: bill.updated_at
    };
  }

  // Transform OpenStates legislator to our format
  private transformLegislator(legislator: any) {
    const committees = legislator.roles
      ?.filter((role: any) => role.type === 'committee')
      ?.map((role: any) => role.title) || [];

    const office = legislator.offices?.[0];
    
    return {
      id: legislator.id,
      name: legislator.name,
      district: legislator.district,
      party: this.mapParty(legislator.party),
      chamber: this.mapChamber(legislator.chamber),
      committees: committees,
      phone: office?.phone || '',
      email: office?.email || '',
      office: office?.address || '',
      relationship_score: 'None',
      bills_sponsored: 0,
      vote_alignment: 0,
      last_contact: null,
      topics_of_interest: [],
      created_at: legislator.created_at,
      updated_at: legislator.updated_at
    };
  }

  // Transform OpenStates committee to our format
  private transformCommittee(committee: any) {
    return {
      id: committee.id,
      name: committee.name,
      chamber: this.mapChamber(committee.chamber),
      members: committee.members?.map((member: any) => ({
        name: member.name,
        role: member.role,
        legislator_id: member.legislator
      })) || [],
      created_at: committee.created_at,
      updated_at: committee.updated_at
    };
  }

  // Helper methods
  private mapBillStatus(status: string): 'Active' | 'Passed' | 'Failed' {
    const lowerStatus = status.toLowerCase();
    if (lowerStatus.includes('passed') || lowerStatus.includes('enacted')) {
      return 'Passed';
    }
    if (lowerStatus.includes('failed') || lowerStatus.includes('defeated') || lowerStatus.includes('vetoed')) {
      return 'Failed';
    }
    return 'Active';
  }

  private mapParty(party: string): 'D' | 'R' | 'I' {
    const lowerParty = party.toLowerCase();
    if (lowerParty.includes('democrat') || lowerParty.includes('democratic')) {
      return 'D';
    }
    if (lowerParty.includes('republican')) {
      return 'R';
    }
    return 'I';
  }

  private mapChamber(chamber: string): 'House' | 'Senate' {
    const lowerChamber = chamber.toLowerCase();
    if (lowerChamber.includes('house') || lowerChamber.includes('assembly')) {
      return 'House';
    }
    return 'Senate';
  }

  private calculatePassageLikelihood(bill: any): number {
    const progressCount = bill.progress?.length || 0;
    const hasRecentAction = bill.latest_action && 
      new Date(bill.latest_action.date) > new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
    
    let likelihood = 50; // Base likelihood
    
    if (progressCount > 5) likelihood += 20;
    if (hasRecentAction) likelihood += 15;
    if (bill.sponsors?.length > 3) likelihood += 10;
    if (bill.subjects?.includes('budget') || bill.subjects?.includes('appropriations')) likelihood -= 10;
    
    return Math.max(0, Math.min(100, likelihood));
  }
}
