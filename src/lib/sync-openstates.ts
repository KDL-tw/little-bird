// Service to sync OpenStates data with Supabase
import { billsAPI, legislatorsAPI, dataConverters } from './openstates';
import { mockBillsAPI, mockLegislatorsAPI } from './mock-openstates';
import { billsService, legislatorsService } from './database';

export class OpenStatesSync {
  // Sync Colorado bills from OpenStates to Supabase
  static async syncBills() {
    try {
      console.log('🔄 Starting bills sync from OpenStates...');
      
      // Fetch bills from OpenStates (using mock data temporarily)
      const openStatesBills = await mockBillsAPI.getBills('co');
      console.log(`📊 Fetched ${openStatesBills.length} bills from OpenStates`);
      
      // Convert to our format
      const convertedBills = openStatesBills.map(bill => dataConverters.convertBill(bill));
      
      // Get existing bills from our database
      const existingBills = await billsService.getAll();
      const existingBillNumbers = new Set(existingBills.map(bill => bill.bill_number));
      
      // Filter out bills we already have
      const newBills = convertedBills.filter(bill => !existingBillNumbers.has(bill.bill_number));
      
      console.log(`📝 Found ${newBills.length} new bills to add`);
      
      // Add new bills to database
      for (const bill of newBills) {
        try {
          await billsService.create(bill);
          console.log(`✅ Added bill: ${bill.bill_number}`);
        } catch (error) {
          console.error(`❌ Failed to add bill ${bill.bill_number}:`, error);
        }
      }
      
      console.log('✅ Bills sync completed');
      return { success: true, added: newBills.length, total: openStatesBills.length };
      
    } catch (error) {
      console.error('❌ Bills sync failed:', error);
      return { success: false, error: error.message };
    }
  }

  // Sync Colorado legislators from OpenStates to Supabase
  static async syncLegislators() {
    try {
      console.log('🔄 Starting legislators sync from OpenStates...');
      
      // Fetch legislators from OpenStates (using mock data temporarily)
      const openStatesLegislators = await mockLegislatorsAPI.getLegislators('co');
      console.log(`📊 Fetched ${openStatesLegislators.length} legislators from OpenStates`);
      
      // Convert to our format
      const convertedLegislators = openStatesLegislators.map(legislator => dataConverters.convertLegislator(legislator));
      
      // Get existing legislators from our database
      const existingLegislators = await legislatorsService.getAll();
      const existingLegislatorIds = new Set(existingLegislators.map(leg => leg.id));
      
      // Filter out legislators we already have
      const newLegislators = convertedLegislators.filter(leg => !existingLegislatorIds.has(leg.id));
      
      console.log(`📝 Found ${newLegislators.length} new legislators to add`);
      
      // Add new legislators to database
      for (const legislator of newLegislators) {
        try {
          await legislatorsService.create(legislator);
          console.log(`✅ Added legislator: ${legislator.name}`);
        } catch (error) {
          console.error(`❌ Failed to add legislator ${legislator.name}:`, error);
        }
      }
      
      console.log('✅ Legislators sync completed');
      return { success: true, added: newLegislators.length, total: openStatesLegislators.length };
      
    } catch (error) {
      console.error('❌ Legislators sync failed:', error);
      return { success: false, error: error.message };
    }
  }

  // Sync all data
  static async syncAll() {
    console.log('🚀 Starting full OpenStates sync...');
    
    const billsResult = await this.syncBills();
    const legislatorsResult = await this.syncLegislators();
    
    return {
      success: billsResult.success && legislatorsResult.success,
      bills: billsResult,
      legislators: legislatorsResult
    };
  }

  // Search bills using OpenStates (mock data)
  static async searchBills(query: string) {
    try {
      const openStatesBills = await mockBillsAPI.searchBills(query, 'co');
      return openStatesBills.map(bill => dataConverters.convertBill(bill));
    } catch (error) {
      console.error('❌ Bill search failed:', error);
      return [];
    }
  }

  // Search legislators using OpenStates (mock data)
  static async searchLegislators(query: string) {
    try {
      const openStatesLegislators = await mockLegislatorsAPI.searchLegislators(query, 'co');
      return openStatesLegislators.map(legislator => dataConverters.convertLegislator(legislator));
    } catch (error) {
      console.error('❌ Legislator search failed:', error);
      return [];
    }
  }
}
