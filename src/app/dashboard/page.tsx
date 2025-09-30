"use client";

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { DashboardLayout } from '@/components/DashboardLayout';
import { 
  FileText, 
  Users, 
  CircleAlert, 
  Calendar, 
  Search, 
  Building2, 
  ChartColumn, 
  Sparkles,
  CheckCircle,
  AlertTriangle,
  Bell,
  ArrowRight
} from 'lucide-react';
import Link from 'next/link';

// Hardcoded Dashboard Data
const DASHBOARD_STATS = {
  billsTracked: 12,
  activeLegislators: 8,
  complianceDeadlines: 3,
  upcomingHearings: 12
};

const RECENT_ACTIVITY = [
  {
    id: '1',
    type: 'success',
    title: 'HB24-1001 passed committee',
    time: '2 hours ago',
    icon: CheckCircle
  },
  {
    id: '2',
    type: 'warning',
    title: 'SB24-0123 needs attention',
    time: '4 hours ago',
    icon: AlertTriangle
  },
  {
    id: '3',
    type: 'info',
    title: 'New hearing scheduled',
    time: '6 hours ago',
    icon: Bell
  }
];

const QUICK_ACTIONS = [
  {
    title: 'My Bills',
    description: 'View and manage tracked bills',
    href: '/dashboard/my-bills',
    icon: FileText,
    color: 'text-blue-600'
  },
  {
    title: 'Search Legislators',
    description: 'Find and connect with legislators',
    href: '/dashboard/legislators/search',
    icon: Users,
    color: 'text-green-600'
  },
  {
    title: 'Manage Clients',
    description: 'Organize client relationships',
    href: '/dashboard/clients',
    icon: Building2,
    color: 'text-purple-600'
  },
  {
    title: 'Data Sync',
    description: 'Sync with external data sources',
    href: '/dashboard/admin',
    icon: ChartColumn,
    color: 'text-orange-600'
  }
];

const PLATFORM_FEATURES = {
  available: [
    'Colorado Bill Tracking',
    'Legislator CRM & Profiles',
    'AI Bill Summaries',
    'Basic Compliance Checklists'
  ],
  comingJanuary: [
    'Real-time Alerts & Notifications',
    'Automated Compliance Reporting',
    'Multi-state Bill Tracking',
    'Collaboration Workspaces'
  ],
  comingQ2: [
    'Preflight Legislator Modeling',
    'Network Influence Mapping',
    'Statistical Prediction Models',
    'API Access'
  ]
};

export default function DashboardPage() {
  const [billsCount, setBillsCount] = useState(0);
  const [legislatorsCount, setLegislatorsCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [platformOverviewOpen, setPlatformOverviewOpen] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      // Use hardcoded stats
      setBillsCount(DASHBOARD_STATS.billsTracked);
      setLegislatorsCount(DASHBOARD_STATS.activeLegislators);
    } catch (error) {
      console.error('Error loading dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'success': return 'text-green-500';
      case 'warning': return 'text-yellow-500';
      case 'info': return 'text-blue-500';
      default: return 'text-gray-500';
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Dashboard</h1>
            <p className="text-slate-600 mt-1">Here's what's happening with your legislative tracking today</p>
          </div>
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => setPlatformOverviewOpen(true)}
              >
                <Sparkles className="h-4 w-4 mr-2" />
                Platform Overview
              </Button>
              <Button size="sm">
                <FileText className="h-4 w-4 mr-2" />
                Quick Add
              </Button>
            </div>
            <Button variant="outline" size="sm" className="relative">
              <Bell className="h-5 w-5" />
              <Badge className="absolute -top-1 -right-1 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs">
                3
              </Badge>
            </Button>
            <Button variant="outline" size="sm" className="h-8 w-8 rounded-full">
              AD
            </Button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Bills Tracked</CardTitle>
              <FileText className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {loading ? '...' : billsCount}
              </div>
              <p className="text-xs text-muted-foreground">
                {loading ? 'Loading...' : 'Active tracking'}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Legislators</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {loading ? '...' : legislatorsCount}
              </div>
              <p className="text-xs text-muted-foreground">
                {loading ? 'Loading...' : 'In your network'}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Compliance Deadlines</CardTitle>
              <CircleAlert className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{DASHBOARD_STATS.complianceDeadlines}</div>
              <p className="text-xs text-muted-foreground">Due this week</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Upcoming Hearings</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{DASHBOARD_STATS.upcomingHearings}</div>
              <p className="text-xs text-muted-foreground">Next 7 days</p>
            </CardContent>
          </Card>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
              <p className="text-sm text-muted-foreground">Common tasks and shortcuts</p>
            </CardHeader>
            <CardContent className="space-y-3">
              {QUICK_ACTIONS.map((action, index) => (
                <Link key={index} href={action.href}>
                  <Button variant="outline" className="w-full justify-start h-9">
                    <action.icon className={`h-4 w-4 mr-2 ${action.color}`} />
                    {action.title}
                  </Button>
                </Link>
              ))}
            </CardContent>
          </Card>

          {/* Recent Activity */}
          <Card>
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
              <p className="text-sm text-muted-foreground">Latest updates and changes</p>
            </CardHeader>
            <CardContent className="space-y-3">
              {RECENT_ACTIVITY.map((activity) => (
                <div key={activity.id} className="flex items-center space-x-3">
                  <activity.icon className={`h-4 w-4 ${getActivityIcon(activity.type)}`} />
                  <div className="flex-1">
                    <p className="text-sm font-medium">{activity.title}</p>
                    <p className="text-xs text-slate-500">{activity.time}</p>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        {/* Platform Overview Modal */}
        <Dialog open={platformOverviewOpen} onOpenChange={setPlatformOverviewOpen}>
          <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="flex items-center">
                <Sparkles className="h-5 w-5 mr-2 text-indigo-600" />
                Little Bird Platform Overview
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-6">
              {/* Available Now */}
              <div>
                <h3 className="text-lg font-semibold text-green-700 mb-3 flex items-center">
                  <CheckCircle className="h-5 w-5 mr-2" />
                  AVAILABLE NOW
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {PLATFORM_FEATURES.available.map((feature, index) => (
                    <div key={index} className="flex items-center space-x-2 p-3 bg-green-50 rounded-lg">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      <span className="text-sm font-medium">{feature}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Coming January 2025 */}
              <div>
                <h3 className="text-lg font-semibold text-blue-700 mb-3 flex items-center">
                  <Calendar className="h-5 w-5 mr-2" />
                  COMING JANUARY 2025
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {PLATFORM_FEATURES.comingJanuary.map((feature, index) => (
                    <div key={index} className="flex items-center space-x-2 p-3 bg-blue-50 rounded-lg">
                      <Calendar className="h-4 w-4 text-blue-600" />
                      <span className="text-sm font-medium">{feature}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Coming Q2 2025 */}
              <div>
                <h3 className="text-lg font-semibold text-purple-700 mb-3 flex items-center">
                  <ArrowRight className="h-5 w-5 mr-2" />
                  COMING Q2 2025
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {PLATFORM_FEATURES.comingQ2.map((feature, index) => (
                    <div key={index} className="flex items-center space-x-2 p-3 bg-purple-50 rounded-lg">
                      <ArrowRight className="h-4 w-4 text-purple-600" />
                      <span className="text-sm font-medium">{feature}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-4 border-t">
                <Button className="w-full">
                  Request Early Access
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </DashboardLayout>
  );
}