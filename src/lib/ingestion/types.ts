// Data Ingestion System Types
// Three-pronged architecture for political intelligence

export interface IngestionSource {
  id: string;
  name: string;
  type: 'foundation' | 'speed' | 'intelligence';
  status: 'active' | 'paused' | 'error' | 'coming_soon';
  lastSync: string | null;
  nextSync: string | null;
  errorCount: number;
  config: Record<string, any>;
}

export interface IngestionJob {
  id: string;
  sourceId: string;
  type: 'sync' | 'monitor' | 'analyze';
  status: 'running' | 'completed' | 'failed' | 'scheduled';
  startedAt: string;
  completedAt: string | null;
  recordsProcessed: number;
  recordsAdded: number;
  recordsUpdated: number;
  errors: string[];
  metadata: Record<string, any>;
}

// Foundation Layer - OpenStates
export interface OpenStatesConfig {
  apiKey: string;
  state: string;
  syncInterval: number; // minutes
  maxRecordsPerSync: number;
  enabledEndpoints: string[];
}

export interface OpenStatesSyncResult {
  bills: {
    total: number;
    new: number;
    updated: number;
    errors: number;
  };
  legislators: {
    total: number;
    new: number;
    updated: number;
    errors: number;
  };
  committees: {
    total: number;
    new: number;
    updated: number;
    errors: number;
  };
}

// Speed Layer - Real-time Monitoring
export interface SocialMonitoringConfig {
  platforms: ('twitter' | 'youtube' | 'news' | 'press_releases')[];
  keywords: string[];
  legislators: string[];
  updateInterval: number; // minutes
  maxResultsPerUpdate: number;
}

export interface SocialPost {
  id: string;
  platform: string;
  author: string;
  content: string;
  url: string;
  publishedAt: string;
  relevanceScore: number;
  extractedEntities: string[];
  sentiment: 'positive' | 'negative' | 'neutral';
  relatedBills: string[];
  relatedLegislators: string[];
}

export interface YouTubeVideo {
  id: string;
  title: string;
  channel: string;
  url: string;
  publishedAt: string;
  duration: number;
  transcript: string | null;
  extractedBills: string[];
  extractedLegislators: string[];
  keyMoments: Array<{
    timestamp: number;
    description: string;
    relevanceScore: number;
  }>;
}

// Intelligence Layer - AI Analysis
export interface AIAnalysisConfig {
  openaiApiKey: string;
  claudeApiKey: string;
  models: {
    vision: string;
    transcription: string;
    analysis: string;
  };
  analysisTypes: string[];
  batchSize: number;
}

export interface AIAnalysisResult {
  id: string;
  sourceType: 'bill' | 'hearing' | 'social_post' | 'document';
  sourceId: string;
  analysisType: string;
  result: {
    summary: string;
    keyPoints: string[];
    entities: string[];
    sentiment: string;
    confidence: number;
    recommendations: string[];
  };
  processedAt: string;
  model: string;
  cost: number;
}

// Data Pipeline Status
export interface PipelineStatus {
  foundation: {
    openstates: IngestionSource;
    lastFullSync: string | null;
    nextScheduledSync: string | null;
    healthScore: number;
  };
  speed: {
    socialMonitoring: IngestionSource;
    youtubeMonitoring: IngestionSource;
    newsMonitoring: IngestionSource;
    lastUpdate: string | null;
    activeMonitors: number;
  };
  intelligence: {
    aiAnalysis: IngestionSource;
    pendingAnalyses: number;
    completedToday: number;
    averageProcessingTime: number;
  };
  overall: {
    totalSources: number;
    activeSources: number;
    lastActivity: string | null;
    systemHealth: 'excellent' | 'good' | 'warning' | 'critical';
  };
}
