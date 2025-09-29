// ADMIN SYNC SERVICE
// This service populates the admin repository with OpenStates data
// Runs independently - no user dependencies, no authentication required

import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabase = createClient(supabaseUrl, supabaseKey);

const OPENSTATES_API_KEY = process.env.NEXT_PUBLIC_OPENSTATES_API_KEY || '7fffc14f-6f2d-4168-ac04-628867cec6b1';

interface OpenStatesBill {
  id: string;
  session: string;
  jurisdiction: {
    id: string;
    name: string;
    classification: string;
  };
  from_organization: {
    id: string;
    name: string;
    classification: string;
  };
  identifier: string;
  title: string;
  classification: string[];
  subject: string[];
  extras: Record<string, any>;
  created_at: string;
  updated_at: string;
  openstates_url?: string;
  first_action_date?: string;
  latest_action_date?: string;
  latest_action_description?: string;
  latest_passage_date?: string;
}

interface OpenStatesLegislator {
  id: string;
  name: string;
  party?: string;
  chamber?: string;
  district?: string;
  email?: string;
  phone?: string;
  office_location?: string;
  photo_url?: string;
  bio?: string;
}

interface OpenStatesBillSponsor {
  id: string;
  name: string;
  classification: string;
}

export class AdminSyncService {
  private async fetchFromOpenStates(endpoint: string, params: Record<string, string> = {}) {
    const url = new URL(`https://v3.openstates.org${endpoint}`);
    
    // Add parameters
    Object.entries(params).forEach(([key, value]) => {
      url.searchParams.set(key, value);
    });
    
    const response = await fetch(url.toString(), {
      headers: {
        'X-API-Key': OPENSTATES_API_KEY,
        'Accept': 'application/json',
        'User-Agent': 'LittleBird-Admin/1.0'
      }
    });

    if (!response.ok) {
      throw new Error(`OpenStates API error: ${response.status} ${response.statusText}`);
    }

    return response.json();
  }

  async syncLegislators(limit: number = 200) {
    console.log('🔄 Admin: Syncing legislators...');
    
    try {
      const data = await this.fetchFromOpenStates('/people', {
        jurisdiction: 'CO',
        per_page: limit.toString()
      });

      const legislators = data.results || [];
      console.log(`📥 Admin: Fetched ${legislators.length} legislators from OpenStates`);

      let syncedCount = 0;
      let updatedCount = 0;

      for (const legislator of legislators) {
        try {
          // Check if legislator already exists
          const { data: existing } = await supabase
            .from('admin_legislators')
            .select('id')
            .eq('openstates_id', legislator.id)
            .single();

          const legislatorData = {
            openstates_id: legislator.id,
            name: legislator.name,
            party: legislator.party || null,
            chamber: legislator.chamber || null,
            district: legislator.district || null,
            email: legislator.email || null,
            phone: legislator.phone || null,
            office_location: legislator.office_location || null,
            photo_url: legislator.photo_url || null,
            bio: legislator.bio || null,
            last_synced_at: new Date().toISOString()
          };

          if (existing) {
            // Update existing
            const { error } = await supabase
              .from('admin_legislators')
              .update(legislatorData)
              .eq('id', existing.id);

            if (error) throw error;
            updatedCount++;
          } else {
            // Insert new
            const { error } = await supabase
              .from('admin_legislators')
              .insert(legislatorData);

            if (error) throw error;
            syncedCount++;
          }
        } catch (error) {
          console.error(`❌ Admin: Error syncing legislator ${legislator.name}:`, error);
        }
      }

      console.log(`✅ Admin: Legislators sync complete: ${syncedCount} new, ${updatedCount} updated`);
      return { success: true, synced: syncedCount, updated: updatedCount, total: legislators.length };

    } catch (error) {
      console.error('❌ Admin: Legislators sync failed:', error);
      throw error;
    }
  }

  async syncBills(session: string = '2025B', limit: number = 500) {
    console.log(`🔄 Admin: Syncing bills for session ${session}...`);
    
    try {
      const data = await this.fetchFromOpenStates('/bills', {
        jurisdiction: 'CO',
        session: session,
        per_page: limit.toString()
      });

      const bills = data.results || [];
      console.log(`📥 Admin: Fetched ${bills.length} bills from OpenStates`);

      let syncedCount = 0;
      let updatedCount = 0;

      for (const bill of bills) {
        try {
          // Check if bill already exists
          const { data: existing } = await supabase
            .from('admin_bills')
            .select('id')
            .eq('openstates_id', bill.id)
            .single();

          const billData = {
            openstates_id: bill.id,
            session: bill.session,
            jurisdiction_id: bill.jurisdiction.id,
            jurisdiction_name: bill.jurisdiction.name,
            from_organization_id: bill.from_organization.id,
            from_organization_name: bill.from_organization.name,
            identifier: bill.identifier,
            title: bill.title,
            classification: bill.classification || [],
            subject: bill.subject || [],
            extras: bill.extras || {},
            created_at_openstates: bill.created_at ? new Date(bill.created_at).toISOString() : null,
            updated_at_openstates: bill.updated_at ? new Date(bill.updated_at).toISOString() : null,
            first_action_date: bill.first_action_date ? new Date(bill.first_action_date).toISOString() : null,
            latest_action_date: bill.latest_action_date ? new Date(bill.latest_action_date).toISOString() : null,
            latest_action_description: bill.latest_action_description || null,
            latest_passage_date: bill.latest_passage_date ? new Date(bill.latest_passage_date).toISOString() : null,
            openstates_url: bill.openstates_url || null,
            last_synced_at: new Date().toISOString()
          };

          if (existing) {
            // Update existing
            const { error } = await supabase
              .from('admin_bills')
              .update(billData)
              .eq('id', existing.id);

            if (error) throw error;
            updatedCount++;
          } else {
            // Insert new
            const { error } = await supabase
              .from('admin_bills')
              .insert(billData);

            if (error) throw error;
            syncedCount++;
          }
        } catch (error) {
          console.error(`❌ Admin: Error syncing bill ${bill.identifier}:`, error);
        }
      }

      console.log(`✅ Admin: Bills sync complete: ${syncedCount} new, ${updatedCount} updated`);
      return { success: true, synced: syncedCount, updated: updatedCount, total: bills.length };

    } catch (error) {
      console.error('❌ Admin: Bills sync failed:', error);
      throw error;
    }
  }

  async syncBillSponsors(session: string = '2025B', limit: number = 100) {
    console.log(`🔄 Admin: Syncing bill sponsors for session ${session}...`);
    
    try {
      // First get all bills for this session
      const { data: bills } = await supabase
        .from('admin_bills')
        .select('id, openstates_id')
        .eq('session', session)
        .limit(limit);

      if (!bills || bills.length === 0) {
        console.log('⚠️ Admin: No bills found for sponsor sync');
        return { success: true, synced: 0, updated: 0, total: 0 };
      }

      let syncedCount = 0;
      let updatedCount = 0;

      for (const bill of bills) {
        try {
          // Fetch sponsors for this bill from OpenStates
          const sponsorData = await this.fetchFromOpenStates(`/bills/${bill.openstates_id}`);
          
          if (sponsorData.sponsors && Array.isArray(sponsorData.sponsors)) {
            // Clear existing sponsors for this bill
            await supabase
              .from('admin_bill_sponsors')
              .delete()
              .eq('bill_id', bill.id);

            // Add new sponsors
            for (const sponsor of sponsorData.sponsors) {
              // Find legislator in our admin_legislators table
              const { data: legislator } = await supabase
                .from('admin_legislators')
                .select('id')
                .eq('openstates_id', sponsor.id)
                .single();

              if (legislator) {
                const { error } = await supabase
                  .from('admin_bill_sponsors')
                  .insert({
                    bill_id: bill.id,
                    legislator_id: legislator.id,
                    sponsor_type: sponsor.classification || 'Co-sponsor',
                    openstates_sponsor_id: sponsor.id,
                    last_synced_at: new Date().toISOString()
                  });

                if (error) throw error;
                syncedCount++;
              }
            }
          }
        } catch (error) {
          console.error(`❌ Admin: Error syncing sponsors for bill ${bill.openstates_id}:`, error);
        }
      }

      console.log(`✅ Admin: Bill sponsors sync complete: ${syncedCount} new sponsors`);
      return { success: true, synced: syncedCount, updated: updatedCount, total: syncedCount };

    } catch (error) {
      console.error('❌ Admin: Bill sponsors sync failed:', error);
      throw error;
    }
  }

  async fullSync(session: string = '2025B') {
    console.log('🚀 Admin: Starting full repository sync...');
    
    try {
      const [legislatorsResult, billsResult, sponsorsResult] = await Promise.all([
        this.syncLegislators(200),
        this.syncBills(session, 500),
        this.syncBillSponsors(session, 100)
      ]);

      console.log('✅ Admin: Full repository sync complete!');
      return {
        success: true,
        legislators: legislatorsResult,
        bills: billsResult,
        sponsors: sponsorsResult
      };
    } catch (error) {
      console.error('❌ Admin: Full sync failed:', error);
      throw error;
    }
  }
}

export const adminSyncService = new AdminSyncService();
