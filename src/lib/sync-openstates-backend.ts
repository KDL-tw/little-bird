// Backend sync service for OpenStates data
// This runs on the server to populate the database with live OpenStates data

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

export class OpenStatesBackendSync {
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
        'User-Agent': 'LittleBird/1.0'
      }
    });

    if (!response.ok) {
      throw new Error(`OpenStates API error: ${response.status} ${response.statusText}`);
    }

    return response.json();
  }

  async syncBills(session: string = '2025B', limit: number = 100) {
    console.log(`🔄 Syncing bills for session ${session}...`);
    
    try {
      // Fetch bills from OpenStates
      const data = await this.fetchFromOpenStates('/bills', {
        jurisdiction: 'CO',
        session: session,
        per_page: limit.toString()
      });

      const bills = data.results || [];
      console.log(`📥 Fetched ${bills.length} bills from OpenStates`);

      let syncedCount = 0;
      let updatedCount = 0;

      for (const bill of bills) {
        try {
          // Check if bill already exists
          const { data: existingBill } = await supabase
            .from('bills')
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

          if (existingBill) {
            // Update existing bill
            const { error } = await supabase
              .from('bills')
              .update(billData)
              .eq('id', existingBill.id);

            if (error) throw error;
            updatedCount++;
          } else {
            // Insert new bill
            const { error } = await supabase
              .from('bills')
              .insert(billData);

            if (error) throw error;
            syncedCount++;
          }
        } catch (error) {
          console.error(`❌ Error syncing bill ${bill.identifier}:`, error);
        }
      }

      console.log(`✅ Bills sync complete: ${syncedCount} new, ${updatedCount} updated`);
      return { success: true, synced: syncedCount, updated: updatedCount, total: bills.length };

    } catch (error) {
      console.error('❌ Bills sync failed:', error);
      throw error;
    }
  }

  async syncLegislators(limit: number = 100) {
    console.log('🔄 Syncing legislators...');
    
    try {
      // Fetch legislators from OpenStates
      const data = await this.fetchFromOpenStates('/people', {
        jurisdiction: 'CO',
        per_page: limit.toString()
      });

      const legislators = data.results || [];
      console.log(`📥 Fetched ${legislators.length} legislators from OpenStates`);

      let syncedCount = 0;
      let updatedCount = 0;

      for (const legislator of legislators) {
        try {
          // Check if legislator already exists
          const { data: existingLegislator } = await supabase
            .from('legislators')
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
            bio: legislator.bio || null
          };

          if (existingLegislator) {
            // Update existing legislator
            const { error } = await supabase
              .from('legislators')
              .update(legislatorData)
              .eq('id', existingLegislator.id);

            if (error) throw error;
            updatedCount++;
          } else {
            // Insert new legislator
            const { error } = await supabase
              .from('legislators')
              .insert(legislatorData);

            if (error) throw error;
            syncedCount++;
          }
        } catch (error) {
          console.error(`❌ Error syncing legislator ${legislator.name}:`, error);
        }
      }

      console.log(`✅ Legislators sync complete: ${syncedCount} new, ${updatedCount} updated`);
      return { success: true, synced: syncedCount, updated: updatedCount, total: legislators.length };

    } catch (error) {
      console.error('❌ Legislators sync failed:', error);
      throw error;
    }
  }

  async fullSync(session: string = '2025B') {
    console.log('🚀 Starting full OpenStates sync...');
    
    try {
      const [billsResult, legislatorsResult] = await Promise.all([
        this.syncBills(session, 100),
        this.syncLegislators(100)
      ]);

      console.log('✅ Full sync complete!');
      return {
        success: true,
        bills: billsResult,
        legislators: legislatorsResult
      };
    } catch (error) {
      console.error('❌ Full sync failed:', error);
      throw error;
    }
  }
}

export const openStatesBackendSync = new OpenStatesBackendSync();
