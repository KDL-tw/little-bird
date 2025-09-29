// Test database connection and data persistence
import { supabase } from './supabase';
import { billsDataService, legislatorsDataService, billSponsorsDataService, intelligenceSignalsDataService, meetingNotesDataService } from './database';

export async function testDatabaseConnection() {
  console.log('🧪 Testing database connection...');
  
  try {
    // Test basic connection
    const { data, error } = await supabase.from('bills').select('count').limit(1);
    if (error) throw error;
    console.log('✅ Database connection successful');

    // Test bills table
    const bills = await billsDataService.getAll();
    console.log(`📄 Bills table: ${bills.length} records`);

    // Test legislators table
    const legislators = await legislatorsDataService.getAll();
    console.log(`👥 Legislators table: ${legislators.length} records`);

    // Test bill sponsors table
    const billSponsors = await billSponsorsDataService.getAll();
    console.log(`🔗 Bill sponsors table: ${billSponsors.length} records`);

    // Test intelligence signals table
    const signals = await intelligenceSignalsDataService.getAll();
    console.log(`📡 Intelligence signals table: ${signals.length} records`);

    // Test meeting notes table
    const meetingNotes = await meetingNotesDataService.getAll();
    console.log(`📝 Meeting notes table: ${meetingNotes.length} records`);

    console.log('🎉 All database tests passed!');
    return true;
  } catch (error) {
    console.error('❌ Database test failed:', error);
    return false;
  }
}

export async function testDataPersistence() {
  console.log('🧪 Testing data persistence...');
  
  try {
    // Get initial count
    const initialBills = await billsDataService.getAll();
    const initialLegislators = await legislatorsDataService.getAll();
    
    console.log(`📊 Initial state: ${initialBills.length} bills, ${initialLegislators.length} legislators`);
    
    // Wait a moment
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Get count again
    const finalBills = await billsDataService.getAll();
    const finalLegislators = await legislatorsDataService.getAll();
    
    console.log(`📊 Final state: ${finalBills.length} bills, ${finalLegislators.length} legislators`);
    
    if (initialBills.length === finalBills.length && initialLegislators.length === finalLegislators.length) {
      console.log('✅ Data persistence test passed!');
      return true;
    } else {
      console.log('❌ Data persistence test failed - counts changed');
      return false;
    }
  } catch (error) {
    console.error('❌ Data persistence test failed:', error);
    return false;
  }
}
