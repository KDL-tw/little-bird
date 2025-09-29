// Fiscal Note Agents API
// Orchestrates Agent A (search) and Agent B (analysis) for fiscal note processing

import { NextRequest, NextResponse } from 'next/server';
import { fiscalNoteAgentA } from '@/lib/agents/fiscal-note-agent-a';
import { fiscalNoteAgentB } from '@/lib/agents/fiscal-note-agent-b';

export async function POST(request: NextRequest) {
  try {
    const { action, billIds, billId } = await request.json();
    
    console.log(`🤖 Fiscal Note Agents: ${action} requested`);

    let result;

    switch (action) {
      case 'search':
        // Agent A: Search for fiscal notes
        if (billId) {
          result = await fiscalNoteAgentA.searchForFiscalNote(billId);
        } else if (billIds && Array.isArray(billIds)) {
          result = await fiscalNoteAgentA.searchForMultipleBills(billIds);
        } else {
          return NextResponse.json({
            success: false,
            error: 'Either billId or billIds array is required for search action'
          }, { status: 400 });
        }
        break;

      case 'analyze':
        // Agent B: Analyze fiscal notes
        if (billId) {
          result = await fiscalNoteAgentB.processFiscalNote(billId);
        } else if (billIds && Array.isArray(billIds)) {
          result = await fiscalNoteAgentB.processMultipleBills(billIds);
        } else {
          return NextResponse.json({
            success: false,
            error: 'Either billId or billIds array is required for analyze action'
          }, { status: 400 });
        }
        break;

      case 'full-pipeline':
        // Run both agents in sequence
        if (billId) {
          // Search first
          const searchResult = await fiscalNoteAgentA.searchForFiscalNote(billId);
          
          if (!searchResult.success) {
            return NextResponse.json({
              success: false,
              error: `Search failed: ${searchResult.error}`,
              step: 'search'
            });
          }

          // Then analyze
          const analyzeResult = await fiscalNoteAgentB.processFiscalNote(billId);
          
          result = {
            search: searchResult,
            analyze: analyzeResult,
            success: analyzeResult.success
          };
        } else if (billIds && Array.isArray(billIds)) {
          // Search first
          const searchResult = await fiscalNoteAgentA.searchForMultipleBills(billIds);
          
          // Then analyze (only successful searches)
          const successfulBillIds = searchResult.results
            .filter(r => r.success)
            .map(r => r.billId);
          
          const analyzeResult = await fiscalNoteAgentB.processMultipleBills(successfulBillIds);
          
          result = {
            search: searchResult,
            analyze: analyzeResult,
            success: true
          };
        } else {
          return NextResponse.json({
            success: false,
            error: 'Either billId or billIds array is required for full-pipeline action'
          }, { status: 400 });
        }
        break;

      default:
        return NextResponse.json({
          success: false,
          error: 'Invalid action. Use "search", "analyze", or "full-pipeline"'
        }, { status: 400 });
    }

    return NextResponse.json({
      success: true,
      message: `Fiscal note agents completed ${action} action`,
      result
    });

  } catch (error) {
    console.error('Fiscal note agents error:', error);
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}
