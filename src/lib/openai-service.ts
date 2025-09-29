// OpenAI Service for AI Agents
// Handles all OpenAI API interactions for fiscal note analysis

const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

interface OpenAIMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

interface OpenAIResponse {
  choices: Array<{
    message: {
      content: string;
    };
  }>;
}

export class OpenAIService {
  private async makeRequest(messages: OpenAIMessage[], model: string = 'gpt-4'): Promise<string> {
    if (!OPENAI_API_KEY) {
      throw new Error('OpenAI API key not configured');
    }

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${OPENAI_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model,
        messages,
        temperature: 0.1, // Low temperature for consistent analysis
        max_tokens: 4000,
      }),
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`OpenAI API error: ${response.status} ${error}`);
    }

    const data: OpenAIResponse = await response.json();
    return data.choices[0]?.message?.content || '';
  }

  async analyzeFiscalNote(content: string, billIdentifier: string): Promise<{
    summary: string;
    keyFindings: string[];
    fiscalImpact: {
      stateImpact: string;
      localImpact: string;
      totalCost: string;
      revenueImpact: string;
      timeline: string;
    };
  }> {
    const systemPrompt = `You are a fiscal policy analyst specializing in Colorado state legislation. 
    Analyze the provided fiscal note and extract key information in a structured format.
    
    Focus on:
    1. Clear, concise summary of the fiscal impact
    2. Key findings that would be important for stakeholders
    3. Structured fiscal impact data including state/local impacts, costs, revenue, and timeline
    
    Be precise and factual. Use bullet points for key findings.`;

    const userPrompt = `Please analyze this fiscal note for bill ${billIdentifier}:

${content}

Provide your analysis in the following JSON format:
{
  "summary": "Brief summary of the fiscal impact",
  "keyFindings": ["Finding 1", "Finding 2", "Finding 3"],
  "fiscalImpact": {
    "stateImpact": "Impact on state budget",
    "localImpact": "Impact on local governments",
    "totalCost": "Total estimated cost",
    "revenueImpact": "Revenue implications",
    "timeline": "Implementation timeline"
  }
}`;

    const response = await this.makeRequest([
      { role: 'system', content: systemPrompt },
      { role: 'user', content: userPrompt }
    ]);

    try {
      return JSON.parse(response);
    } catch (error) {
      // Fallback if JSON parsing fails
      return {
        summary: response,
        keyFindings: ['Analysis completed - see summary for details'],
        fiscalImpact: {
          stateImpact: 'See summary for details',
          localImpact: 'See summary for details',
          totalCost: 'See summary for details',
          revenueImpact: 'See summary for details',
          timeline: 'See summary for details'
        }
      };
    }
  }

  async detectChanges(oldContent: string, newContent: string): Promise<{
    changesDetected: string[];
    changeSummary: string;
  }> {
    const systemPrompt = `You are a document change detection specialist. 
    Compare two versions of a fiscal note and identify specific changes.
    
    Focus on:
    1. Specific changes in numbers, dates, or key facts
    2. Changes in fiscal impact estimates
    3. Changes in implementation timeline
    4. New or removed sections
    
    Be precise and specific about what changed.`;

    const userPrompt = `Compare these two versions of a fiscal note:

OLD VERSION:
${oldContent}

NEW VERSION:
${newContent}

Identify the specific changes and provide a summary.`;

    const response = await this.makeRequest([
      { role: 'system', content: systemPrompt },
      { role: 'user', content: userPrompt }
    ]);

    // Extract changes from response (this is a simplified approach)
    const changesDetected = response
      .split('\n')
      .filter(line => line.trim().startsWith('-') || line.trim().startsWith('•'))
      .map(line => line.replace(/^[-•]\s*/, '').trim())
      .filter(change => change.length > 0);

    return {
      changesDetected,
      changeSummary: response
    };
  }

  async searchFiscalNoteQuery(billIdentifier: string, billTitle: string): Promise<string> {
    const systemPrompt = `You are a search query specialist for Colorado General Assembly documents.
    Generate the most effective search query to find fiscal notes for specific bills.
    
    Consider:
    1. Bill number variations (HB, SB, etc.)
    2. Session year
    3. Key terms that appear in fiscal notes
    4. Colorado-specific terminology`;

    const userPrompt = `Generate a search query to find the fiscal note for:
    Bill: ${billIdentifier}
    Title: ${billTitle}
    
    The search should work on the Colorado General Assembly website.`;

    return await this.makeRequest([
      { role: 'system', content: systemPrompt },
      { role: 'user', content: userPrompt }
    ]);
  }
}

export const openAIService = new OpenAIService();
