"use client";

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { DashboardLayout } from '@/components/DashboardLayout';
import { 
  Globe, 
  RefreshCw, 
  CheckCircle, 
  AlertCircle, 
  Clock,
  Database,
  Zap,
  TrendingUp,
  Activity,
  Play,
  Pause,
  Settings
} from 'lucide-react';

interface SourceStatus {
  id: string;
  name: string;
  type: 'official' | 'real-time' | 'intelligence';
  status: 'active' | 'inactive' | 'coming_soon' | 'error';
  lastUpdate: string | null;
  nextUpdate: string | null;
  healthScore: number;
  recordsToday: number;
  description: string;
}

interface BlendedData {
  bills: {
    total: number;
    withRealTimeUpdates: number;
    withAIAnalysis: number;
    lastBlended: string | null;
  };
  legislators: {
    total: number;
    withSocialMonitoring: number;
    withPatternAnalysis: number;
    lastBlended: string | null;
  };
  overall: {
    totalSources: number;
    activeSources: number;
    systemHealth: 'excellent' | 'good' | 'warning' | 'critical';
    lastBlend: string | null;
  };
}

export default function SourcesDashboard() {
  const [sources, setSources] = useState<SourceStatus[]>([]);
  const [blendedData, setBlendedData] = useState<BlendedData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isRunning, setIsRunning] = useState(false);

  useEffect(() => {
    loadSources();
  }, []);

  const loadSources = async () => {
    setIsLoading(true);
    try {
      // Mock data for now - will be replaced with real API calls
      const mockSources: SourceStatus[] = [
        {
          id: 'openstates',
          name: 'Official Legislative Data',
          type: 'official',
          status: 'active',
          lastUpdate: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
          nextUpdate: new Date(Date.now() + 58 * 60 * 1000).toISOString(),
          healthScore: 95,
          recordsToday: 247,
          description: 'Colorado General Assembly bills, legislators, and committees'
        },
        {
          id: 'social-monitoring',
          name: 'Social Media Intelligence',
          type: 'real-time',
          status: 'coming_soon',
          lastUpdate: null,
          nextUpdate: null,
          healthScore: 0,
          recordsToday: 0,
          description: 'Real-time monitoring of legislator social media and public statements'
        },
        {
          id: 'news-monitoring',
          name: 'News & Press Monitoring',
          type: 'real-time',
          status: 'coming_soon',
          lastUpdate: null,
          nextUpdate: null,
          healthScore: 0,
          recordsToday: 0,
          description: 'Press releases and news coverage analysis'
        },
        {
          id: 'hearing-monitoring',
          name: 'Hearing Transcripts',
          type: 'real-time',
          status: 'coming_soon',
          lastUpdate: null,
          nextUpdate: null,
          healthScore: 0,
          recordsToday: 0,
          description: 'YouTube hearing transcripts and committee discussions'
        },
        {
          id: 'ai-analysis',
          name: 'AI Intelligence Engine',
          type: 'intelligence',
          status: 'coming_soon',
          lastUpdate: null,
          nextUpdate: null,
          healthScore: 0,
          recordsToday: 0,
          description: 'Advanced AI analysis of bills, patterns, and relationships'
        }
      ];

      const mockBlendedData: BlendedData = {
        bills: {
          total: 247,
          withRealTimeUpdates: 0,
          withAIAnalysis: 0,
          lastBlended: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString()
        },
        legislators: {
          total: 89,
          withSocialMonitoring: 0,
          withPatternAnalysis: 0,
          lastBlended: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString()
        },
        overall: {
          totalSources: 5,
          activeSources: 1,
          systemHealth: 'good',
          lastBlend: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString()
        }
      };
      
      setSources(mockSources);
      setBlendedData(mockBlendedData);
      setIsRunning(mockBlendedData.overall.activeSources > 0);
    } catch (error) {
      console.error('Failed to load sources:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleStartSystem = async () => {
    setIsRunning(true);
    // TODO: Implement start system
    console.log('Starting data sources...');
  };

  const handleStopSystem = async () => {
    setIsRunning(false);
    // TODO: Implement stop system
    console.log('Stopping data sources...');
  };

  const handleTriggerSync = async (sourceId: string) => {
    // TODO: Implement individual source sync
    console.log(`Triggering sync for ${sourceId}...`);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'inactive': return 'bg-gray-100 text-gray-800';
      case 'coming_soon': return 'bg-blue-100 text-blue-800';
      case 'error': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'official': return 'bg-blue-100 text-blue-800';
      case 'real-time': return 'bg-purple-100 text-purple-800';
      case 'intelligence': return 'bg-indigo-100 text-indigo-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getHealthColor = (score: number) => {
    if (score >= 90) return 'text-green-600';
    if (score >= 70) return 'text-yellow-600';
    if (score >= 50) return 'text-orange-600';
    return 'text-red-600';
  };

  const actions = (
    <div className="flex items-center space-x-2">
      <Button variant="outline" size="sm">
        <Settings className="h-4 w-4 mr-2" />
        Settings
      </Button>
      {isRunning ? (
        <Button variant="outline" size="sm" onClick={handleStopSystem}>
          <Pause className="h-4 w-4 mr-2" />
          Stop System
        </Button>
      ) : (
        <Button size="sm" onClick={handleStartSystem}>
          <Play className="h-4 w-4 mr-2" />
          Start System
        </Button>
      )}
    </div>
  );

  if (isLoading) {
    return (
      <DashboardLayout
        title="Data Sources"
        subtitle="Loading intelligence sources..."
        actions={actions}
      >
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <RefreshCw className="w-12 h-12 text-indigo-600 animate-spin mx-auto mb-4" />
            <p className="text-lg text-slate-700">Loading data sources...</p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  if (!sources || !blendedData) {
    return (
      <DashboardLayout
        title="Data Sources"
        subtitle="Failed to load sources"
        actions={actions}
      >
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <AlertCircle className="w-12 h-12 text-red-600 mx-auto mb-4" />
            <p className="text-lg text-slate-700">Failed to load sources</p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout
      title="Data Sources"
      subtitle="Intelligence gathering from multiple sources"
      actions={actions}
    >
      {/* System Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Sources</CardTitle>
            <Database className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{blendedData.overall.activeSources}</div>
            <p className="text-xs text-muted-foreground">
              of {blendedData.overall.totalSources} total
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">System Health</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold capitalize">{blendedData.overall.systemHealth}</div>
            <p className="text-xs text-muted-foreground">
              Last blend: {new Date(blendedData.overall.lastBlend!).toLocaleDateString()}
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Bills Processed</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{blendedData.bills.total}</div>
            <p className="text-xs text-muted-foreground">
              {blendedData.bills.withAIAnalysis} with AI analysis
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Legislators Tracked</CardTitle>
            <Zap className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{blendedData.legislators.total}</div>
            <p className="text-xs text-muted-foreground">
              {blendedData.legislators.withSocialMonitoring} with social monitoring
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Data Sources */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Data Sources</CardTitle>
          <CardDescription>
            Monitor and manage your intelligence gathering sources
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {sources.map((source) => (
              <div key={source.id} className="border rounded-lg p-4">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-2">
                      <h3 className="font-semibold text-lg">{source.name}</h3>
                      <Badge className={getTypeColor(source.type)}>
                        {source.type}
                      </Badge>
                      <Badge className={getStatusColor(source.status)}>
                        {source.status}
                      </Badge>
                    </div>
                    <p className="text-slate-600 mb-3">{source.description}</p>
                    
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                      <div>
                        <span className="text-slate-500">Health Score:</span>
                        <div className="flex items-center space-x-2">
                          <Progress value={source.healthScore} className="flex-1" />
                          <span className={`font-medium ${getHealthColor(source.healthScore)}`}>
                            {source.healthScore}%
                          </span>
                        </div>
                      </div>
                      <div>
                        <span className="text-slate-500">Records Today:</span>
                        <div className="font-medium">{source.recordsToday}</div>
                      </div>
                      <div>
                        <span className="text-slate-500">Last Update:</span>
                        <div className="font-medium">
                          {source.lastUpdate ? 
                            new Date(source.lastUpdate).toLocaleString() : 
                            'Never'
                          }
                        </div>
                      </div>
                      <div>
                        <span className="text-slate-500">Next Update:</span>
                        <div className="font-medium">
                          {source.nextUpdate ? 
                            new Date(source.nextUpdate).toLocaleString() : 
                            'N/A'
                          }
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    {source.status === 'active' && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleTriggerSync(source.id)}
                      >
                        <RefreshCw className="h-4 w-4 mr-1" />
                        Sync
                      </Button>
                    )}
                    {source.status === 'coming_soon' && (
                      <Badge variant="outline" className="text-blue-600">
                        Coming Soon
                      </Badge>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Blending Status */}
      <Card>
        <CardHeader>
          <CardTitle>Proprietary Output Blending</CardTitle>
          <CardDescription>
            Advanced data fusion and intelligence synthesis
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-medium mb-3">Bills Intelligence</h4>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm text-slate-600">Total Bills:</span>
                    <span className="font-medium">{blendedData.bills.total}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-slate-600">With Real-time Updates:</span>
                    <span className="font-medium">{blendedData.bills.withRealTimeUpdates}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-slate-600">With AI Analysis:</span>
                    <span className="font-medium">{blendedData.bills.withAIAnalysis}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-slate-600">Last Blended:</span>
                    <span className="font-medium">
                      {blendedData.bills.lastBlended ? 
                        new Date(blendedData.bills.lastBlended).toLocaleString() : 
                        'Never'
                      }
                    </span>
                  </div>
                </div>
              </div>
              
              <div>
                <h4 className="font-medium mb-3">Legislators Intelligence</h4>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm text-slate-600">Total Legislators:</span>
                    <span className="font-medium">{blendedData.legislators.total}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-slate-600">With Social Monitoring:</span>
                    <span className="font-medium">{blendedData.legislators.withSocialMonitoring}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-slate-600">With Pattern Analysis:</span>
                    <span className="font-medium">{blendedData.legislators.withPatternAnalysis}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-slate-600">Last Blended:</span>
                    <span className="font-medium">
                      {blendedData.legislators.lastBlended ? 
                        new Date(blendedData.legislators.lastBlended).toLocaleString() : 
                        'Never'
                      }
                    </span>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="border-t pt-4">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium">System Status</h4>
                  <p className="text-sm text-slate-600">
                    {isRunning ? 'Data sources are running' : 'Data sources are stopped'}
                  </p>
                </div>
                <div className="flex items-center space-x-2">
                  <div className={`w-3 h-3 rounded-full ${isRunning ? 'bg-green-500' : 'bg-gray-400'}`} />
                  <span className="text-sm font-medium">
                    {isRunning ? 'Active' : 'Inactive'}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </DashboardLayout>
  );
}