// Test database connection
import { supabase } from './supabase'

export async function testDatabaseConnection() {
  try {
    console.log('Testing Supabase connection...')
    
    // Test basic connection
    const { data, error } = await supabase
      .from('bills')
      .select('count')
      .limit(1)
    
    if (error) {
      console.error('Database connection failed:', error)
      return false
    }
    
    console.log('✅ Database connection successful!')
    return true
  } catch (error) {
    console.error('Database connection error:', error)
    return false
  }
}

// Test function to run in browser console
if (typeof window !== 'undefined') {
  (window as any).testDB = testDatabaseConnection
}
