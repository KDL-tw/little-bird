"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { DashboardLayout } from "@/components/DashboardLayout";
import Link from "next/link";
import { useState } from "react";
import { 
  FileText, 
  Users, 
  Building2,
  Shield, 
  TrendingUp, 
  Calendar,
  AlertCircle,
  CheckCircle,
  Bell,
  Sparkles,
  ArrowRight,
  Plus,
  Search,
  BarChart3
} from "lucide-react";

export default function Dashboard() {
  const [platformOverviewOpen, setPlatformOverviewOpen] = useState(false);

  const actions = (
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
        <Plus className="h-4 w-4 mr-2" />
        Quick Add
      </Button>
    </div>
  );

  return (
    <DashboardLayout
      title="Dashboard"
      subtitle="Here's what's happening with your legislative tracking today"
      actions={actions}
    >
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Bills Tracked</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">5</div>
            <p className="text-xs text-muted-foreground">
              Sample bills loaded
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Legislators</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">5</div>
            <p className="text-xs text-muted-foreground">
              Sample legislators loaded
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Compliance Deadlines</CardTitle>
            <AlertCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">3</div>
            <p className="text-xs text-muted-foreground">
              Due this week
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Upcoming Hearings</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">12</div>
            <p className="text-xs text-muted-foreground">
              Next 7 days
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>Common tasks and shortcuts</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <Link href="/dashboard/bills/search-simple">
              <Button className="w-full justify-start" variant="outline">
                <Search className="h-4 w-4 mr-2" />
                Search Bills
              </Button>
            </Link>
            <Link href="/dashboard/legislators/search">
              <Button className="w-full justify-start" variant="outline">
                <Users className="h-4 w-4 mr-2" />
                Search Legislators
              </Button>
            </Link>
            <Link href="/dashboard/clients">
              <Button className="w-full justify-start" variant="outline">
                <Building2 className="h-4 w-4 mr-2" />
                Manage Clients
              </Button>
            </Link>
            <Link href="/dashboard/admin">
              <Button className="w-full justify-start" variant="outline">
                <BarChart3 className="h-4 w-4 mr-2" />
                Data Sync
              </Button>
            </Link>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>Latest updates and changes</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center space-x-3">
              <CheckCircle className="h-4 w-4 text-green-500" />
              <div className="flex-1">
                <p className="text-sm font-medium">HB24-1001 passed committee</p>
                <p className="text-xs text-slate-500">2 hours ago</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <AlertCircle className="h-4 w-4 text-yellow-500" />
              <div className="flex-1">
                <p className="text-sm font-medium">SB24-0123 needs attention</p>
                <p className="text-xs text-slate-500">4 hours ago</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <Bell className="h-4 w-4 text-blue-500" />
              <div className="flex-1">
                <p className="text-sm font-medium">New hearing scheduled</p>
                <p className="text-xs text-slate-500">6 hours ago</p>
              </div>
            </div>
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
            <DialogDescription>
              Current capabilities and upcoming features
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-6">
            {/* Available Now */}
            <div>
              <h3 className="text-lg font-semibold text-green-700 mb-3 flex items-center">
                <CheckCircle className="h-5 w-5 mr-2" />
                AVAILABLE NOW
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                  <h4 className="font-medium text-green-900">Colorado Bill Tracking</h4>
                  <p className="text-sm text-green-700">Real-time bill status updates and monitoring</p>
                </div>
                <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                  <h4 className="font-medium text-green-900">Legislator CRM & Profiles</h4>
                  <p className="text-sm text-green-700">Comprehensive relationship management</p>
                </div>
                <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                  <h4 className="font-medium text-green-900">AI Bill Summaries</h4>
                  <p className="text-sm text-green-700">Automated analysis and insights</p>
                </div>
                <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                  <h4 className="font-medium text-green-900">Basic Compliance Checklists</h4>
                  <p className="text-sm text-green-700">Track deadlines and requirements</p>
                </div>
              </div>
            </div>

            {/* Coming January 2025 */}
            <div>
              <h3 className="text-lg font-semibold text-blue-700 mb-3 flex items-center">
                <Calendar className="h-5 w-5 mr-2" />
                COMING JANUARY 2025
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                  <h4 className="font-medium text-blue-900">Real-time Alerts & Notifications</h4>
                  <p className="text-sm text-blue-700">Instant updates on bill changes and hearings</p>
                </div>
                <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                  <h4 className="font-medium text-blue-900">Automated Compliance Reporting</h4>
                  <p className="text-sm text-blue-700">Generate reports automatically</p>
                </div>
                <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                  <h4 className="font-medium text-blue-900">Multi-state Bill Tracking</h4>
                  <p className="text-sm text-blue-700">Expand beyond Colorado</p>
                </div>
                <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                  <h4 className="font-medium text-blue-900">Collaboration Workspaces</h4>
                  <p className="text-sm text-blue-700">Team-based project management</p>
                </div>
              </div>
            </div>

            {/* Coming Q2 2025 */}
            <div>
              <h3 className="text-lg font-semibold text-purple-700 mb-3 flex items-center">
                <TrendingUp className="h-5 w-5 mr-2" />
                COMING Q2 2025
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 bg-purple-50 rounded-lg border border-purple-200">
                  <h4 className="font-medium text-purple-900">Preflight Legislator Modeling</h4>
                  <p className="text-sm text-purple-700">Predict voting patterns and positions</p>
                </div>
                <div className="p-4 bg-purple-50 rounded-lg border border-purple-200">
                  <h4 className="font-medium text-purple-900">Network Influence Mapping</h4>
                  <p className="text-sm text-purple-700">Visualize political relationships</p>
                </div>
                <div className="p-4 bg-purple-50 rounded-lg border border-purple-200">
                  <h4 className="font-medium text-purple-900">Statistical Prediction Models</h4>
                  <p className="text-sm text-purple-700">Advanced analytics and forecasting</p>
                </div>
                <div className="p-4 bg-purple-50 rounded-lg border border-purple-200">
                  <h4 className="font-medium text-purple-900">API Access</h4>
                  <p className="text-sm text-purple-700">Integrate with your existing tools</p>
                </div>
              </div>
            </div>
          </div>

          <div className="flex justify-center pt-6">
            <Button className="bg-indigo-600 hover:bg-indigo-700">
              Request Early Access
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
}