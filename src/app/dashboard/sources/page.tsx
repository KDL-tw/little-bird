'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Database, 
  Zap, 
  Brain, 
  Play, 
  Pause, 
  RefreshCw, 
  AlertTriangle, 
  CheckCircle, 
  Clock,
  Activity,
  TrendingUp,
  Settings,
  ArrowLeft,
  Globe,
  Newspaper,
  Video,
  MessageSquare
} from 'lucide-react';

interface SourceStatus {
  id: string;
  name: string;
  type: 'official' | 'real-time' | 'intelligence';
  status: 'active' | 'paused' | 'error' | 'coming_soon';
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
          description: 'Colorado political news, press releases, and media coverage'
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
    // TODO: Implement trigger sync
    console.log(`Triggering sync for ${sourceId}...`);
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active':
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'paused':
        return <Pause className="w-4 h-4 text-yellow-500" />;
      case 'error':
        return <AlertTriangle className="w-4 h-4 text-red-500" />;
      case 'coming_soon':
        return <Clock className="w-4 h-4 text-blue-500" />;
      default:
        return <Activity className="w-4 h-4 text-gray-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800';
      case 'paused':
        return 'bg-yellow-100 text-yellow-800';
      case 'error':
        return 'bg-red-100 text-red-800';
      case 'coming_soon':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'official':
        return <Database className="w-4 h-4" />;
      case 'real-time':
        return <Zap className="w-4 h-4" />;
      case 'intelligence':
        return <Brain className="w-4 h-4" />;
      default:
        return <Activity className="w-4 h-4" />;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'official':
        return 'bg-blue-100 text-blue-800';
      case 'real-time':
        return 'bg-orange-100 text-orange-800';
      case 'intelligence':
        return 'bg-purple-100 text-purple-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-50">
        <div className="flex items-center justify-center h-64">
          <RefreshCw className="w-8 h-8 animate-spin text-indigo-600" />
        </div>
      </div>
    );
  }

  if (!sources || !blendedData) {
    return (
      <div className="min-h-screen bg-slate-50">
        <div className="flex items-center justify-center h-64">
          <p className="text-slate-600">Failed to load sources</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <div className="bg-white border-b border-slate-200">
        <div className="px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link href="/dashboard">
                <Button variant="outline" size="sm">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back to Dashboard
                </Button>
              </Link>
              <div>
                <h1 className="text-2xl font-bold text-slate-900">Data Sources</h1>
                <p className="text-slate-600">Intelligence gathering from multiple sources</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <Badge className={`${getStatusColor(blendedData.overall.systemHealth)} px-3 py-1`}>
                {blendedData.overall.systemHealth.toUpperCase()}
              </Badge>
              {isRunning ? (
                <Button onClick={handleStopSystem} variant="outline" className="text-red-600 border-red-300">
                  <Pause className="w-4 h-4 mr-2" />
                  Stop Sources
                </Button>
              ) : (
                <Button onClick={handleStartSystem} className="bg-indigo-600 hover:bg-indigo-700">
                  <Play className="w-4 h-4 mr-2" />
                  Start Sources
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="p-6">
        {/* Overview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Sources</CardTitle>
              <Database className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-slate-900">
                {blendedData.overall.activeSources}/{blendedData.overall.totalSources}
              </div>
              <p className="text-xs text-slate-600">
                Data sources
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Bills Tracked</CardTitle>
              <FileText className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-slate-900">
                {blendedData.bills.total}
              </div>
              <p className="text-xs text-slate-600">
                With real-time updates: {blendedData.bills.withRealTimeUpdates}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Legislators Monitored</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-slate-900">
                {blendedData.legislators.total}
              </div>
              <p className="text-xs text-slate-600">
                With social monitoring: {blendedData.legislators.withSocialMonitoring}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Last Update</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-slate-900">
                {blendedData.overall.lastBlend ? 
                  new Date(blendedData.overall.lastBlend).toLocaleTimeString() : 
                  'Never'
                }
              </div>
              <p className="text-xs text-slate-600">
                Data blend
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Sources Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {sources.map((source) => (
            <Card key={source.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    {getTypeIcon(source.type)}
                    <CardTitle className="text-lg">{source.name}</CardTitle>
                  </div>
                  <div className="flex items-center space-x-2">
                    {getStatusIcon(source.status)}
                    <Badge className={getStatusColor(source.status)}>
                      {source.status}
                    </Badge>
                  </div>
                </div>
                <CardDescription>{source.description}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between text-sm">
                  <span>Health Score</span>
                  <span>{source.healthScore}%</span>
                </div>
                <Progress value={source.healthScore} className="h-2" />
                
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-slate-600">Records Today:</span>
                    <p className="font-medium">{source.recordsToday}</p>
                  </div>
                  <div>
                    <span className="text-slate-600">Type:</span>
                    <Badge className={`${getTypeColor(source.type)} text-xs`}>
                      {source.type}
                    </Badge>
                  </div>
                </div>

                {source.status === 'active' && (
                  <Button 
                    onClick={() => handleTriggerSync(source.id)}
                    size="sm"
                    className="w-full"
                  >
                    <RefreshCw className="w-4 h-4 mr-2" />
                    Sync Now
                  </Button>
                )}
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Coming Soon Section */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Brain className="w-5 h-5" />
              <span>Advanced Intelligence Features</span>
            </CardTitle>
            <CardDescription>
              Enhanced data blending and AI-powered insights coming soon
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center p-4 border rounded-lg">
                <MessageSquare className="w-8 h-8 mx-auto mb-3 text-blue-500" />
                <h3 className="font-semibold mb-2">Social Intelligence</h3>
                <p className="text-sm text-slate-600 mb-3">
                  Real-time monitoring of legislator social media, press releases, and public statements
                </p>
                <Badge className="bg-blue-100 text-blue-800">Q1 2025</Badge>
              </div>
              
              <div className="text-center p-4 border rounded-lg">
                <Video className="w-8 h-8 mx-auto mb-3 text-orange-500" />
                <h3 className="font-semibold mb-2">Hearing Intelligence</h3>
                <p className="text-sm text-slate-600 mb-3">
                  Automated transcription and analysis of committee hearings and floor debates
                </p>
                <Badge className="bg-orange-100 text-orange-800">Q1 2025</Badge>
              </div>
              
              <div className="text-center p-4 border rounded-lg">
                <Brain className="w-8 h-8 mx-auto mb-3 text-purple-500" />
                <h3 className="font-semibold mb-2">AI Analysis</h3>
                <p className="text-sm text-slate-600 mb-3">
                  Advanced pattern detection, relationship mapping, and predictive modeling
                </p>
                <Badge className="bg-purple-100 text-purple-800">Q2 2025</Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
