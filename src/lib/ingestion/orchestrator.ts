// Data Ingestion Orchestrator
// Coordinates all three layers of data ingestion

import { FoundationIngestion } from './foundation';
import { SpeedIngestion } from './speed';
import { IntelligenceIngestion } from './intelligence';
import { 
  OpenStatesConfig, 
  SocialMonitoringConfig, 
  AIAnalysisConfig, 
  PipelineStatus,
  IngestionJob 
} from './types';

export class DataIngestionOrchestrator {
  private foundation: FoundationIngestion;
  private speed: SpeedIngestion;
  private intelligence: IntelligenceIngestion;
  private isRunning: boolean = false;
  private jobs: Map<string, IngestionJob> = new Map();

  constructor(
    openStatesConfig: OpenStatesConfig,
    socialConfig: SocialMonitoringConfig,
    aiConfig: AIAnalysisConfig
  ) {
    this.foundation = new FoundationIngestion(openStatesConfig);
    this.speed = new SpeedIngestion(socialConfig);
    this.intelligence = new IntelligenceIngestion(aiConfig);
  }

  // Start all ingestion systems
  async startAllSystems(): Promise<void> {
    console.log('🚀 Starting Little Bird Data Ingestion System...');
    
    if (this.isRunning) {
      console.log('⚠️ System already running');
      return;
    }

    this.isRunning = true;

    try {
      // Start Foundation Layer (scheduled sync)
      await this.startFoundationLayer();
      
      // Start Speed Layer (real-time monitoring)
      await this.startSpeedLayer();
      
      // Start Intelligence Layer (AI analysis queue)
      await this.startIntelligenceLayer();
      
      console.log('✅ All ingestion systems started successfully');
    } catch (error) {
      console.error('❌ Failed to start ingestion systems:', error);
      this.isRunning = false;
      throw error;
    }
  }

  // Stop all ingestion systems
  async stopAllSystems(): Promise<void> {
    console.log('🛑 Stopping Little Bird Data Ingestion System...');
    
    this.isRunning = false;
    
    // TODO: Implement proper cleanup
    console.log('✅ All ingestion systems stopped');
  }

  // Foundation Layer - Scheduled sync
  private async startFoundationLayer(): Promise<void> {
    console.log('🏛️ Starting Foundation Layer...');
    
    // Initial sync
    await this.performFoundationSync();
    
    // Schedule regular syncs
    setInterval(async () => {
      if (this.isRunning) {
        await this.performFoundationSync();
      }
    }, this.foundation.config.syncInterval * 60 * 1000);
  }

  // Speed Layer - Real-time monitoring
  private async startSpeedLayer(): Promise<void> {
    console.log('⚡ Starting Speed Layer...');
    
    await this.speed.startRealTimeMonitoring();
  }

  // Intelligence Layer - AI analysis queue
  private async startIntelligenceLayer(): Promise<void> {
    console.log('🧠 Starting Intelligence Layer...');
    
    // Process AI analysis queue
    setInterval(async () => {
      if (this.isRunning) {
        await this.processAIAnalysisQueue();
      }
    }, 5 * 60 * 1000); // Every 5 minutes
  }

  // Perform Foundation Layer sync
  async performFoundationSync(): Promise<void> {
    const jobId = `foundation-sync-${Date.now()}`;
    
    const job: IngestionJob = {
      id: jobId,
      sourceId: 'openstates',
      type: 'sync',
      status: 'running',
      startedAt: new Date().toISOString(),
      completedAt: null,
      recordsProcessed: 0,
      recordsAdded: 0,
      recordsUpdated: 0,
      errors: [],
      metadata: {}
    };

    this.jobs.set(jobId, job);

    try {
      console.log('🔄 Starting Foundation Layer sync...');
      const result = await this.foundation.performFullSync();
      
      job.status = 'completed';
      job.completedAt = new Date().toISOString();
      job.recordsProcessed = result.bills.total + result.legislators.total + result.committees.total;
      job.recordsAdded = result.bills.new + result.legislators.new + result.committees.new;
      job.recordsUpdated = result.bills.updated + result.legislators.updated + result.committees.updated;
      
      console.log('✅ Foundation Layer sync completed');
    } catch (error) {
      job.status = 'failed';
      job.completedAt = new Date().toISOString();
      job.errors.push(error instanceof Error ? error.message : 'Unknown error');
      
      console.error('❌ Foundation Layer sync failed:', error);
    }
  }

  // Process AI analysis queue
  private async processAIAnalysisQueue(): Promise<void> {
    // TODO: Implement AI analysis queue processing
    console.log('🧠 Processing AI analysis queue...');
  }

  // Get system status
  getSystemStatus(): PipelineStatus {
    const activeJobs = Array.from(this.jobs.values()).filter(job => job.status === 'running');
    const failedJobs = Array.from(this.jobs.values()).filter(job => job.status === 'failed');
    
    return {
      foundation: {
        openstates: {
          id: 'openstates',
          name: 'OpenStates API',
          type: 'foundation',
          status: this.isRunning ? 'active' : 'paused',
          lastSync: this.getLastSyncTime('openstates'),
          nextSync: this.getNextSyncTime('openstates'),
          errorCount: failedJobs.length,
          config: {}
        },
        lastFullSync: this.getLastSyncTime('openstates'),
        nextScheduledSync: this.getNextSyncTime('openstates'),
        healthScore: this.calculateHealthScore()
      },
      speed: {
        socialMonitoring: {
          id: 'social-monitoring',
          name: 'Social Media Monitoring',
          type: 'speed',
          status: this.isRunning ? 'active' : 'paused',
          lastSync: null,
          nextSync: null,
          errorCount: 0,
          config: {}
        },
        youtubeMonitoring: {
          id: 'youtube-monitoring',
          name: 'YouTube Monitoring',
          type: 'speed',
          status: this.isRunning ? 'active' : 'paused',
          lastSync: null,
          nextSync: null,
          errorCount: 0,
          config: {}
        },
        newsMonitoring: {
          id: 'news-monitoring',
          name: 'News Monitoring',
          type: 'speed',
          status: this.isRunning ? 'active' : 'paused',
          lastSync: null,
          nextSync: null,
          errorCount: 0,
          config: {}
        },
        lastUpdate: null,
        activeMonitors: this.isRunning ? 3 : 0
      },
      intelligence: {
        aiAnalysis: {
          id: 'ai-analysis',
          name: 'AI Analysis Engine',
          type: 'intelligence',
          status: this.isRunning ? 'active' : 'paused',
          lastSync: null,
          nextSync: null,
          errorCount: 0,
          config: {}
        },
        pendingAnalyses: 0,
        completedToday: 0,
        averageProcessingTime: 0
      },
      overall: {
        totalSources: 4,
        activeSources: this.isRunning ? 4 : 0,
        lastActivity: this.getLastActivityTime(),
        systemHealth: this.getSystemHealth()
      }
    };
  }

  // Helper methods
  private getLastSyncTime(sourceId: string): string | null {
    const jobs = Array.from(this.jobs.values())
      .filter(job => job.sourceId === sourceId && job.status === 'completed')
      .sort((a, b) => new Date(b.completedAt!).getTime() - new Date(a.completedAt!).getTime());
    
    return jobs.length > 0 ? jobs[0].completedAt : null;
  }

  private getNextSyncTime(sourceId: string): string | null {
    // TODO: Calculate next sync time based on schedule
    return new Date(Date.now() + 60 * 60 * 1000).toISOString(); // 1 hour from now
  }

  private calculateHealthScore(): number {
    const totalJobs = this.jobs.size;
    const failedJobs = Array.from(this.jobs.values()).filter(job => job.status === 'failed').length;
    
    if (totalJobs === 0) return 100;
    return Math.max(0, 100 - (failedJobs / totalJobs) * 100);
  }

  private getLastActivityTime(): string | null {
    const allJobs = Array.from(this.jobs.values());
    if (allJobs.length === 0) return null;
    
    const lastJob = allJobs.sort((a, b) => 
      new Date(b.startedAt).getTime() - new Date(a.startedAt).getTime()
    )[0];
    
    return lastJob.startedAt;
  }

  private getSystemHealth(): 'excellent' | 'good' | 'warning' | 'critical' {
    const healthScore = this.calculateHealthScore();
    
    if (healthScore >= 95) return 'excellent';
    if (healthScore >= 80) return 'good';
    if (healthScore >= 60) return 'warning';
    return 'critical';
  }

  // Manual triggers
  async triggerFoundationSync(): Promise<void> {
    await this.performFoundationSync();
  }

  async triggerSpeedMonitoring(): Promise<void> {
    console.log('⚡ Triggering speed monitoring...');
    // TODO: Implement manual speed monitoring trigger
  }

  async triggerAIAnalysis(sourceType: string, sourceId: string, content: any): Promise<void> {
    console.log(`🧠 Triggering AI analysis for ${sourceType}:${sourceId}`);
    await this.intelligence.performAIAnalysis(sourceType, sourceId, content);
  }
}
