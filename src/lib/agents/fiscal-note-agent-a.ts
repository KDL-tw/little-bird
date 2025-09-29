// Agent A: Fiscal Note Search Agent
// Searches Colorado General Assembly for fiscal notes and stores links

import { createClient } from '@supabase/supabase-js';
import { openAIService } from '../openai-service';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabase = createClient(supabaseUrl, supabaseKey);

interface SearchResult {
  title: string;
  url: string;
  snippet: string;
  relevanceScore: number;
}

export class FiscalNoteAgentA {
  private async searchColoradoGeneralAssembly(query: string): Promise<SearchResult[]> {
    // This is a simplified search implementation
    // In production, you'd use a proper web scraping service or API
    
    try {
      // For now, we'll simulate a search result
      // In production, you'd implement actual web scraping of the CO General Assembly site
      const mockResults: SearchResult[] = [
        {
          title: `Fiscal Note - ${query}`,
          url: `https://leg.colorado.gov/sites/default/files/fiscal_notes/${query.replace(/\s+/g, '_').toLowerCase()}_fiscal_note.pdf`,
          snippet: `Fiscal impact analysis for ${query}`,
          relevanceScore: 0.95
        }
      ];

      return mockResults;
    } catch (error) {
      console.error('Error searching Colorado General Assembly:', error);
      return [];
    }
  }

  private async isFiscalNote(url: string, billIdentifier: string): Promise<boolean> {
    // Check if the URL points to a fiscal note
    // This would involve checking the URL pattern and potentially fetching the document
    const fiscalNotePatterns = [
      /fiscal.?note/i,
      /fiscal.?impact/i,
      /fiscal.?analysis/i,
      /fiscal.?estimate/i
    ];

    return fiscalNotePatterns.some(pattern => pattern.test(url));
  }

  async searchForFiscalNote(billId: string): Promise<{
    success: boolean;
    fiscalNoteUrl?: string;
    error?: string;
  }> {
    try {
      console.log(`🔍 Agent A: Searching for fiscal note for bill ${billId}`);

      // Get bill information from admin repository
      const { data: bill, error: billError } = await supabase
        .from('admin_bills')
        .select('*')
        .eq('id', billId)
        .single();

      if (billError || !bill) {
        throw new Error(`Bill not found: ${billId}`);
      }

      // Generate search query using AI
      const searchQuery = await openAIService.searchFiscalNoteQuery(
        bill.identifier,
        bill.title
      );

      console.log(`🔍 Agent A: Generated search query: ${searchQuery}`);

      // Search Colorado General Assembly
      const searchResults = await this.searchColoradoGeneralAssembly(searchQuery);

      if (searchResults.length === 0) {
        // Update bill status
        await supabase
          .from('admin_bills')
          .update({
            fiscal_note_status: 'Not Found',
            fiscal_note_last_checked: new Date().toISOString()
          })
          .eq('id', billId);

        return {
          success: false,
          error: 'No fiscal note found'
        };
      }

      // Find the most relevant result
      const bestResult = searchResults.reduce((best, current) => 
        current.relevanceScore > best.relevanceScore ? current : best
      );

      // Verify it's actually a fiscal note
      const isFiscalNote = await this.isFiscalNote(bestResult.url, bill.identifier);

      if (!isFiscalNote) {
        // Update bill status
        await supabase
          .from('admin_bills')
          .update({
            fiscal_note_status: 'Not Found',
            fiscal_note_last_checked: new Date().toISOString()
          })
          .eq('id', billId);

        return {
          success: false,
          error: 'Found document but not a fiscal note'
        };
      }

      // Update bill with fiscal note information
      const { error: updateError } = await supabase
        .from('admin_bills')
        .update({
          fiscal_note_url: bestResult.url,
          fiscal_note_status: 'Found',
          fiscal_note_last_checked: new Date().toISOString(),
          fiscal_note_agent_version: '1.0'
        })
        .eq('id', billId);

      if (updateError) {
        throw new Error(`Failed to update bill: ${updateError.message}`);
      }

      console.log(`✅ Agent A: Found fiscal note for ${bill.identifier}: ${bestResult.url}`);

      return {
        success: true,
        fiscalNoteUrl: bestResult.url
      };

    } catch (error) {
      console.error('❌ Agent A: Error searching for fiscal note:', error);
      
      // Update bill status to error
      await supabase
        .from('admin_bills')
        .update({
          fiscal_note_status: 'Error',
          fiscal_note_last_checked: new Date().toISOString()
        })
        .eq('id', billId);

      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }

  async searchForMultipleBills(billIds: string[]): Promise<{
    successful: number;
    failed: number;
    results: Array<{
      billId: string;
      success: boolean;
      fiscalNoteUrl?: string;
      error?: string;
    }>;
  }> {
    console.log(`🔍 Agent A: Searching for fiscal notes for ${billIds.length} bills`);

    const results = [];
    let successful = 0;
    let failed = 0;

    for (const billId of billIds) {
      try {
        const result = await this.searchForFiscalNote(billId);
        results.push({
          billId,
          success: result.success,
          fiscalNoteUrl: result.fiscalNoteUrl,
          error: result.error
        });

        if (result.success) {
          successful++;
        } else {
          failed++;
        }

        // Add delay between requests to be respectful
        await new Promise(resolve => setTimeout(resolve, 1000));
      } catch (error) {
        results.push({
          billId,
          success: false,
          error: error instanceof Error ? error.message : 'Unknown error'
        });
        failed++;
      }
    }

    console.log(`✅ Agent A: Completed search for ${billIds.length} bills: ${successful} successful, ${failed} failed`);

    return {
      successful,
      failed,
      results
    };
  }
}

export const fiscalNoteAgentA = new FiscalNoteAgentA();
