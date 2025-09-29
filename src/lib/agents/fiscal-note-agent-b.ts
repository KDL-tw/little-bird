// Agent B: Sensemaking Agent
// Crawls fiscal note links and provides AI analysis with change tracking

import { createClient } from '@supabase/supabase-js';
import { openAIService } from '../openai-service';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabase = createClient(supabaseUrl, supabaseKey);

interface FiscalNoteContent {
  rawContent: string;
  processedContent: string;
  summary: string;
  keyFindings: string[];
  fiscalImpact: {
    stateImpact: string;
    localImpact: string;
    totalCost: string;
    revenueImpact: string;
    timeline: string;
  };
}

export class FiscalNoteAgentB {
  private async fetchDocumentContent(url: string): Promise<string> {
    try {
      // This is a simplified implementation
      // In production, you'd use a proper document fetching service
      // that can handle PDFs, Word docs, etc.
      
      console.log(`📄 Agent B: Fetching document from ${url}`);
      
      // For now, we'll simulate fetching content
      // In production, you'd implement actual document fetching
      const mockContent = `
        FISCAL NOTE
        
        Bill: HB25-1001
        Title: Colorado Clean Energy Act
        
        FISCAL IMPACT SUMMARY
        This bill would require utilities to achieve 80% renewable energy by 2030 and 100% by 2040.
        
        STATE IMPACT
        - Estimated cost to state: $2.5 billion over 10 years
        - Revenue impact: $500 million in new renewable energy tax credits
        - Implementation timeline: Phased approach beginning 2026
        
        LOCAL IMPACT
        - Local governments may see increased utility costs
        - Potential for new renewable energy projects in rural areas
        - Estimated local cost: $100 million over 10 years
        
        TOTAL COST
        - State: $2.5 billion
        - Local: $100 million
        - Total: $2.6 billion over 10 years
        
        REVENUE IMPACT
        - New tax credits: $500 million
        - Renewable energy tax revenue: $200 million
        - Net revenue impact: -$300 million
        
        IMPLEMENTATION TIMELINE
        - 2026: Begin utility planning requirements
        - 2028: First renewable energy targets take effect
        - 2030: 80% renewable energy target
        - 2040: 100% clean energy target
      `;

      return mockContent;
    } catch (error) {
      console.error('Error fetching document content:', error);
      throw new Error(`Failed to fetch document: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  private async createVersionSnapshot(fiscalNoteId: string, content: FiscalNoteContent): Promise<void> {
    try {
      // Get current version number
      const { data: versions } = await supabase
        .from('fiscal_note_versions')
        .select('version_number')
        .eq('fiscal_note_id', fiscalNoteId)
        .order('version_number', { ascending: false })
        .limit(1);

      const nextVersion = versions && versions.length > 0 ? versions[0].version_number + 1 : 1;

      // Create version snapshot
      await supabase
        .from('fiscal_note_versions')
        .insert({
          fiscal_note_id: fiscalNoteId,
          version_number: nextVersion,
          raw_content_snapshot: content.rawContent,
          processed_content_snapshot: content.processedContent,
          summary_snapshot: content.summary,
          key_findings_snapshot: content.keyFindings,
          fiscal_impact_snapshot: content.fiscalImpact
        });

      console.log(`📸 Agent B: Created version ${nextVersion} snapshot for fiscal note ${fiscalNoteId}`);
    } catch (error) {
      console.error('Error creating version snapshot:', error);
    }
  }

  private async detectAndTrackChanges(fiscalNoteId: string, newContent: FiscalNoteContent): Promise<void> {
    try {
      // Get previous version
      const { data: previousVersion } = await supabase
        .from('fiscal_note_versions')
        .select('*')
        .eq('fiscal_note_id', fiscalNoteId)
        .order('version_number', { ascending: false })
        .limit(1)
        .single();

      if (!previousVersion) {
        console.log('No previous version found, skipping change detection');
        return;
      }

      // Detect changes using AI
      const changes = await openAIService.detectChanges(
        previousVersion.processed_content_snapshot || '',
        newContent.processedContent
      );

      // Update the new version with change information
      const { data: versions } = await supabase
        .from('fiscal_note_versions')
        .select('version_number')
        .eq('fiscal_note_id', fiscalNoteId)
        .order('version_number', { ascending: false })
        .limit(1);

      if (versions && versions.length > 0) {
        await supabase
          .from('fiscal_note_versions')
          .update({
            changes_detected: changes.changesDetected,
            change_summary: changes.changeSummary
          })
          .eq('fiscal_note_id', fiscalNoteId)
          .eq('version_number', versions[0].version_number);
      }

      console.log(`🔄 Agent B: Detected ${changes.changesDetected.length} changes in fiscal note ${fiscalNoteId}`);
    } catch (error) {
      console.error('Error detecting changes:', error);
    }
  }

  async processFiscalNote(billId: string): Promise<{
    success: boolean;
    fiscalNoteId?: string;
    error?: string;
  }> {
    try {
      console.log(`🧠 Agent B: Processing fiscal note for bill ${billId}`);

      // Get bill information
      const { data: bill, error: billError } = await supabase
        .from('admin_bills')
        .select('*')
        .eq('id', billId)
        .single();

      if (billError || !bill) {
        throw new Error(`Bill not found: ${billId}`);
      }

      if (!bill.fiscal_note_url) {
        throw new Error('No fiscal note URL found for this bill');
      }

      // Check if fiscal note already exists
      const { data: existingFiscalNote } = await supabase
        .from('fiscal_notes')
        .select('id')
        .eq('admin_bill_id', billId)
        .single();

      let fiscalNoteId = existingFiscalNote?.id;

      // Fetch document content
      const rawContent = await this.fetchDocumentContent(bill.fiscal_note_url);

      // Analyze content using AI
      const analysis = await openAIService.analyzeFiscalNote(rawContent, bill.identifier);

      const processedContent: FiscalNoteContent = {
        rawContent,
        processedContent: rawContent, // In production, you'd clean/process this
        summary: analysis.summary,
        keyFindings: analysis.keyFindings,
        fiscalImpact: analysis.fiscalImpact
      };

      if (fiscalNoteId) {
        // Update existing fiscal note
        const { error: updateError } = await supabase
          .from('fiscal_notes')
          .update({
            raw_content: processedContent.rawContent,
            processed_content: processedContent.processedContent,
            summary: processedContent.summary,
            key_findings: processedContent.keyFindings,
            fiscal_impact: processedContent.fiscalImpact,
            processing_status: 'Completed',
            last_processed_at: new Date().toISOString(),
            ai_model_version: 'gpt-4'
          })
          .eq('id', fiscalNoteId);

        if (updateError) {
          throw new Error(`Failed to update fiscal note: ${updateError.message}`);
        }

        // Detect changes
        await this.detectAndTrackChanges(fiscalNoteId, processedContent);

        console.log(`✅ Agent B: Updated fiscal note ${fiscalNoteId} for bill ${bill.identifier}`);
      } else {
        // Create new fiscal note
        const { data: newFiscalNote, error: createError } = await supabase
          .from('fiscal_notes')
          .insert({
            admin_bill_id: billId,
            source_url: bill.fiscal_note_url,
            source_title: `Fiscal Note - ${bill.identifier}`,
            raw_content: processedContent.rawContent,
            processed_content: processedContent.processedContent,
            summary: processedContent.summary,
            key_findings: processedContent.keyFindings,
            fiscal_impact: processedContent.fiscalImpact,
            processing_status: 'Completed',
            ai_model_version: 'gpt-4'
          })
          .select('id')
          .single();

        if (createError) {
          throw new Error(`Failed to create fiscal note: ${createError.message}`);
        }

        fiscalNoteId = newFiscalNote.id;

        // Create initial version snapshot
        await this.createVersionSnapshot(fiscalNoteId, processedContent);

        console.log(`✅ Agent B: Created fiscal note ${fiscalNoteId} for bill ${bill.identifier}`);
      }

      return {
        success: true,
        fiscalNoteId
      };

    } catch (error) {
      console.error('❌ Agent B: Error processing fiscal note:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }

  async processMultipleBills(billIds: string[]): Promise<{
    successful: number;
    failed: number;
    results: Array<{
      billId: string;
      success: boolean;
      fiscalNoteId?: string;
      error?: string;
    }>;
  }> {
    console.log(`🧠 Agent B: Processing fiscal notes for ${billIds.length} bills`);

    const results = [];
    let successful = 0;
    let failed = 0;

    for (const billId of billIds) {
      try {
        const result = await this.processFiscalNote(billId);
        results.push({
          billId,
          success: result.success,
          fiscalNoteId: result.fiscalNoteId,
          error: result.error
        });

        if (result.success) {
          successful++;
        } else {
          failed++;
        }

        // Add delay between requests
        await new Promise(resolve => setTimeout(resolve, 2000));
      } catch (error) {
        results.push({
          billId,
          success: false,
          error: error instanceof Error ? error.message : 'Unknown error'
        });
        failed++;
      }
    }

    console.log(`✅ Agent B: Completed processing for ${billIds.length} bills: ${successful} successful, ${failed} failed`);

    return {
      successful,
      failed,
      results
    };
  }
}

export const fiscalNoteAgentB = new FiscalNoteAgentB();
