"use client";

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  FileText, 
  DollarSign, 
  Calendar, 
  TrendingUp, 
  AlertCircle, 
  CheckCircle, 
  Loader2,
  ExternalLink,
  History,
  Eye
} from 'lucide-react';

interface FiscalNoteData {
  id: string;
  summary: string;
  keyFindings: string[];
  fiscalImpact: {
    stateImpact: string;
    localImpact: string;
    totalCost: string;
    revenueImpact: string;
    timeline: string;
  };
  sourceUrl: string;
  processingStatus: string;
  lastProcessedAt: string;
  versions?: Array<{
    id: string;
    versionNumber: number;
    createdAt: string;
    changesDetected: string[];
    changeSummary: string;
  }>;
}

interface FiscalNoteViewerProps {
  billId: string;
  onClose?: () => void;
}

export function FiscalNoteViewer({ billId, onClose }: FiscalNoteViewerProps) {
  const [fiscalNote, setFiscalNote] = useState<FiscalNoteData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState('summary');

  useEffect(() => {
    loadFiscalNote();
  }, [billId]);

  const loadFiscalNote = async () => {
    try {
      setLoading(true);
      setError(null);

      // TODO: Implement actual API call to fetch fiscal note data
      // This would call your fiscal note API endpoint
      throw new Error('Fiscal note API not yet implemented. Please implement the API endpoint to fetch fiscal note data.');
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Failed to load fiscal note');
    } finally {
      setLoading(false);
    }
  };

  const runFiscalNoteAnalysis = async () => {
    try {
      setLoading(true);
      
      const response = await fetch('/api/agents/fiscal-notes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'full-pipeline',
          billId: billId
        })
      });

      const data = await response.json();
      
      if (data.success) {
        // Reload fiscal note data
        await loadFiscalNote();
      } else {
        setError(data.error);
      }
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Failed to run analysis');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Card className="w-full max-w-4xl mx-auto">
        <CardContent className="p-6">
          <div className="flex items-center justify-center h-40">
            <Loader2 className="h-8 w-8 animate-spin text-indigo-600" />
            <span className="ml-2">Loading fiscal note...</span>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="w-full max-w-4xl mx-auto">
        <CardContent className="p-6">
          <Alert className="bg-red-50 border-red-200 text-red-800">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
          <div className="mt-4 flex space-x-2">
            <Button onClick={runFiscalNoteAnalysis} disabled={loading}>
              <FileText className="h-4 w-4 mr-2" />
              Run Analysis
            </Button>
            {onClose && (
              <Button variant="outline" onClick={onClose}>
                Close
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!fiscalNote) {
    return (
      <Card className="w-full max-w-4xl mx-auto">
        <CardContent className="p-6">
          <div className="text-center">
            <FileText className="h-12 w-12 text-slate-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-slate-900 mb-2">No Fiscal Note Found</h3>
            <p className="text-slate-600 mb-4">This bill doesn't have a fiscal note yet.</p>
            <Button onClick={runFiscalNoteAnalysis} disabled={loading}>
              <FileText className="h-4 w-4 mr-2" />
              Search for Fiscal Note
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center">
            <FileText className="h-5 w-5 mr-2" />
            Fiscal Note Analysis
          </CardTitle>
          <div className="flex items-center space-x-2">
            <Badge variant={fiscalNote.processingStatus === 'Completed' ? 'default' : 'secondary'}>
              {fiscalNote.processingStatus}
            </Badge>
            <Button
              variant="outline"
              size="sm"
              onClick={() => window.open(fiscalNote.sourceUrl, '_blank')}
            >
              <ExternalLink className="h-4 w-4 mr-1" />
              View Source
            </Button>
            {onClose && (
              <Button variant="outline" size="sm" onClick={onClose}>
                Close
              </Button>
            )}
          </div>
        </div>
      </CardHeader>
      
      <CardContent>
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="summary">Summary</TabsTrigger>
            <TabsTrigger value="impact">Fiscal Impact</TabsTrigger>
            <TabsTrigger value="findings">Key Findings</TabsTrigger>
            <TabsTrigger value="history">History</TabsTrigger>
          </TabsList>

          <TabsContent value="summary" className="space-y-4">
            <div>
              <h3 className="text-lg font-semibold mb-2">Executive Summary</h3>
              <p className="text-slate-700 leading-relaxed">{fiscalNote.summary}</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-slate-50 p-4 rounded-lg">
                <div className="flex items-center mb-2">
                  <DollarSign className="h-4 w-4 mr-2 text-green-600" />
                  <span className="font-medium">Total Cost</span>
                </div>
                <p className="text-sm text-slate-600">{fiscalNote.fiscalImpact.totalCost}</p>
              </div>
              
              <div className="bg-slate-50 p-4 rounded-lg">
                <div className="flex items-center mb-2">
                  <Calendar className="h-4 w-4 mr-2 text-blue-600" />
                  <span className="font-medium">Timeline</span>
                </div>
                <p className="text-sm text-slate-600">{fiscalNote.fiscalImpact.timeline}</p>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="impact" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-lg font-semibold mb-3 flex items-center">
                  <TrendingUp className="h-4 w-4 mr-2 text-blue-600" />
                  State Impact
                </h3>
                <p className="text-slate-700">{fiscalNote.fiscalImpact.stateImpact}</p>
              </div>
              
              <div>
                <h3 className="text-lg font-semibold mb-3 flex items-center">
                  <TrendingUp className="h-4 w-4 mr-2 text-green-600" />
                  Local Impact
                </h3>
                <p className="text-slate-700">{fiscalNote.fiscalImpact.localImpact}</p>
              </div>
              
              <div>
                <h3 className="text-lg font-semibold mb-3 flex items-center">
                  <DollarSign className="h-4 w-4 mr-2 text-yellow-600" />
                  Revenue Impact
                </h3>
                <p className="text-slate-700">{fiscalNote.fiscalImpact.revenueImpact}</p>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="findings" className="space-y-4">
            <h3 className="text-lg font-semibold mb-3">Key Findings</h3>
            <div className="space-y-3">
              {fiscalNote.keyFindings.map((finding, index) => (
                <div key={index} className="flex items-start">
                  <CheckCircle className="h-4 w-4 mr-3 mt-0.5 text-green-600 flex-shrink-0" />
                  <p className="text-slate-700">{finding}</p>
                </div>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="history" className="space-y-4">
            <h3 className="text-lg font-semibold mb-3 flex items-center">
              <History className="h-4 w-4 mr-2" />
              Version History
            </h3>
            <div className="space-y-3">
              {fiscalNote.versions?.map((version) => (
                <div key={version.id} className="border rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium">Version {version.versionNumber}</span>
                    <span className="text-sm text-slate-500">
                      {new Date(version.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                  {version.changesDetected.length > 0 ? (
                    <div>
                      <p className="text-sm text-slate-600 mb-2">Changes detected:</p>
                      <ul className="text-sm text-slate-600 space-y-1">
                        {version.changesDetected.map((change, index) => (
                          <li key={index} className="flex items-start">
                            <span className="mr-2">•</span>
                            {change}
                          </li>
                        ))}
                      </ul>
                    </div>
                  ) : (
                    <p className="text-sm text-slate-500">Initial version</p>
                  )}
                </div>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
