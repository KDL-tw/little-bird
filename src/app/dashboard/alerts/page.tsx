"use client";

import { useState, useMemo, useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { 
  Search, 
  Plus, 
  Bell,
  BellOff,
  Filter,
  AlertTriangle,
  CheckCircle,
  Clock,
  FileText,
  Users,
  Calendar,
  Settings,
  Eye,
  Edit,
  Trash2,
  Zap,
  Mail,
  Smartphone,
  Globe
} from "lucide-react";

interface Alert {
  id: string;
  title: string;
  description: string;
  type: 'bill_status' | 'committee_hearing' | 'vote_scheduled' | 'legislator_activity' | 'deadline' | 'custom';
  priority: 'high' | 'medium' | 'low';
  status: 'active' | 'paused' | 'triggered';
  conditions: {
    billNumbers?: string[];
    legislators?: string[];
    keywords?: string[];
    committees?: string[];
    dateRange?: {
      start: string;
      end: string;
    };
  };
  notifications: {
    email: boolean;
    sms: boolean;
    web: boolean;
  };
  lastTriggered?: string;
  createdAt: string;
  updatedAt: string;
}

interface AlertTrigger {
  id: string;
  alertId: string;
  title: string;
  description: string;
  type: string;
  priority: string;
  timestamp: string;
  read: boolean;
  data: any;
}

export default function AlertsManager() {
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [triggers, setTriggers] = useState<AlertTrigger[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [priorityFilter, setPriorityFilter] = useState<string>('all');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingAlert, setEditingAlert] = useState<Alert | null>(null);
  const [activeTab, setActiveTab] = useState('alerts');

  // Mock data for now - will be replaced with real data
  useEffect(() => {
    const mockAlerts: Alert[] = [
      {
        id: '1',
        title: 'HB24-1001 Status Changes',
        description: 'Get notified when Colorado Clean Energy Act changes status',
        type: 'bill_status',
        priority: 'high',
        status: 'active',
        conditions: {
          billNumbers: ['HB24-1001'],
          keywords: ['status', 'passed', 'failed', 'amended']
        },
        notifications: { email: true, sms: false, web: true },
        lastTriggered: '2024-01-15T10:30:00Z',
        createdAt: '2024-01-10T09:00:00Z',
        updatedAt: '2024-01-15T10:30:00Z'
      },
      {
        id: '2',
        title: 'Education Committee Hearings',
        description: 'Alert for all education-related committee hearings',
        type: 'committee_hearing',
        priority: 'medium',
        status: 'active',
        conditions: {
          committees: ['Education', 'Appropriations'],
          keywords: ['hearing', 'testimony', 'amendment']
        },
        notifications: { email: true, sms: true, web: true },
        lastTriggered: '2024-01-14T14:00:00Z',
        createdAt: '2024-01-08T11:00:00Z',
        updatedAt: '2024-01-14T14:00:00Z'
      },
      {
        id: '3',
        title: 'Rep. Julie McCluskie Activity',
        description: 'Track all activity from Rep. McCluskie',
        type: 'legislator_activity',
        priority: 'high',
        status: 'active',
        conditions: {
          legislators: ['Rep. Julie McCluskie'],
          keywords: ['sponsor', 'co-sponsor', 'vote', 'statement']
        },
        notifications: { email: true, sms: false, web: true },
        lastTriggered: '2024-01-16T08:45:00Z',
        createdAt: '2024-01-05T15:30:00Z',
        updatedAt: '2024-01-16T08:45:00Z'
      },
      {
        id: '4',
        title: 'Compliance Deadlines',
        description: 'Remind me of upcoming compliance deadlines',
        type: 'deadline',
        priority: 'high',
        status: 'active',
        conditions: {
          keywords: ['deadline', 'filing', 'disclosure', 'report'],
          dateRange: {
            start: '2024-01-01',
            end: '2024-12-31'
          }
        },
        notifications: { email: true, sms: true, web: true },
        lastTriggered: '2024-01-12T09:00:00Z',
        createdAt: '2024-01-01T00:00:00Z',
        updatedAt: '2024-01-12T09:00:00Z'
      }
    ];

    const mockTriggers: AlertTrigger[] = [
      {
        id: '1',
        alertId: '1',
        title: 'HB24-1001 Status Update',
        description: 'Colorado Clean Energy Act passed House Committee on Energy',
        type: 'bill_status',
        priority: 'high',
        timestamp: '2024-01-15T10:30:00Z',
        read: false,
        data: { billNumber: 'HB24-1001', newStatus: 'Passed Committee' }
      },
      {
        id: '2',
        alertId: '2',
        title: 'Education Committee Hearing Scheduled',
        description: 'HB24-0456 Education Funding Reform hearing scheduled for Jan 20, 2024',
        type: 'committee_hearing',
        priority: 'medium',
        timestamp: '2024-01-14T14:00:00Z',
        read: true,
        data: { committee: 'Education', date: '2024-01-20', bill: 'HB24-0456' }
      },
      {
        id: '3',
        alertId: '3',
        title: 'Rep. McCluskie Co-sponsors Bill',
        description: 'Rep. Julie McCluskie co-sponsored SB24-0123 Healthcare Access Expansion',
        type: 'legislator_activity',
        priority: 'high',
        timestamp: '2024-01-16T08:45:00Z',
        read: false,
        data: { legislator: 'Rep. Julie McCluskie', action: 'co-sponsored', bill: 'SB24-0123' }
      },
      {
        id: '4',
        alertId: '4',
        title: 'Compliance Deadline Reminder',
        description: 'Quarterly lobbying report due in 3 days',
        type: 'deadline',
        priority: 'high',
        timestamp: '2024-01-12T09:00:00Z',
        read: true,
        data: { deadline: 'Quarterly Report', dueDate: '2024-01-15' }
      }
    ];

    setAlerts(mockAlerts);
    setTriggers(mockTriggers);
  }, []);

  const getPriorityBadgeVariant = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800 border-red-200';
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'low': return 'bg-green-100 text-green-800 border-green-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800 border-green-200';
      case 'paused': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'triggered': return 'bg-blue-100 text-blue-800 border-blue-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'bill_status': return <FileText className="w-4 h-4" />;
      case 'committee_hearing': return <Calendar className="w-4 h-4" />;
      case 'vote_scheduled': return <CheckCircle className="w-4 h-4" />;
      case 'legislator_activity': return <Users className="w-4 h-4" />;
      case 'deadline': return <Clock className="w-4 h-4" />;
      case 'custom': return <Zap className="w-4 h-4" />;
      default: return <Bell className="w-4 h-4" />;
    }
  };

  const filteredAlerts = useMemo(() => {
    return alerts.filter(alert => {
      const matchesSearch = alert.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           alert.description.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesType = typeFilter === 'all' || alert.type === typeFilter;
      const matchesStatus = statusFilter === 'all' || alert.status === statusFilter;
      const matchesPriority = priorityFilter === 'all' || alert.priority === priorityFilter;
      
      return matchesSearch && matchesType && matchesStatus && matchesPriority;
    });
  }, [alerts, searchTerm, typeFilter, statusFilter, priorityFilter]);

  const unreadTriggers = triggers.filter(trigger => !trigger.read);
  const recentTriggers = triggers.slice(0, 10);

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Sidebar */}
      <div className="fixed inset-y-0 left-0 w-64 bg-slate-900 text-white z-50">
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="flex items-center px-6 py-6 border-b border-slate-800">
            <Link href="/" className="flex items-center">
              <span className="text-xl font-bold text-slate-400">LITTLE</span>
              <span className="text-xl font-bold text-white ml-1">BIRD</span>
            </Link>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-4 py-6 space-y-2">
            <Link href="/dashboard" className="flex items-center px-3 py-2 text-sm font-medium text-slate-300 hover:text-white hover:bg-slate-800 rounded-lg transition-colors">
              <Users className="w-5 h-5 mr-3" />
              Overview
            </Link>
            <Link href="/dashboard/bills" className="flex items-center px-3 py-2 text-sm font-medium text-slate-300 hover:text-white hover:bg-slate-800 rounded-lg transition-colors">
              <FileText className="w-5 h-5 mr-3" />
              Bills
            </Link>
            <Link href="/dashboard/legislators" className="flex items-center px-3 py-2 text-sm font-medium text-slate-300 hover:text-white hover:bg-slate-800 rounded-lg transition-colors">
              <Users className="w-5 h-5 mr-3" />
              Legislators
            </Link>
            <Link href="/dashboard/alerts" className="flex items-center px-3 py-2 text-sm font-medium text-white bg-slate-800 rounded-lg">
              <Bell className="w-5 h-5 mr-3" />
              Alerts
            </Link>
            <Link href="/dashboard/compliance" className="flex items-center px-3 py-2 text-sm font-medium text-slate-300 hover:text-white hover:bg-slate-800 rounded-lg transition-colors">
              <CheckCircle className="w-5 h-5 mr-3" />
              Compliance
            </Link>
            <Link href="/dashboard/analytics" className="flex items-center px-3 py-2 text-sm font-medium text-slate-300 hover:text-white hover:bg-slate-800 rounded-lg transition-colors">
              <FileText className="w-5 h-5 mr-3" />
              Analytics
            </Link>
            <Link href="/dashboard/settings" className="flex items-center px-3 py-2 text-sm font-medium text-slate-300 hover:text-white hover:bg-slate-800 rounded-lg transition-colors">
              <Settings className="w-5 h-5 mr-3" />
              Settings
            </Link>
          </nav>

          {/* Back to Home */}
          <div className="p-4 border-t border-slate-800">
            <Link href="/">
              <Button variant="outline" className="w-full border-slate-700 text-slate-300 hover:bg-slate-800 hover:text-white">
                <FileText className="w-4 h-4 mr-2" />
                Back to Home
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="ml-64">
        {/* Header */}
        <header className="bg-white border-b border-slate-200 px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-semibold text-slate-900">Alerts & Notifications</h1>
              <p className="text-slate-600">Manage real-time alerts and stay informed about legislative activity.</p>
            </div>
            <div className="flex items-center space-x-4">
              {unreadTriggers.length > 0 && (
                <Badge variant="destructive" className="bg-red-500 text-white">
                  {unreadTriggers.length} New
                </Badge>
              )}
              <Button onClick={() => setIsCreateModalOpen(true)} className="bg-indigo-600 hover:bg-indigo-700 text-white">
                <Plus className="w-4 h-4 mr-2" />
                Create Alert
              </Button>
            </div>
          </div>
        </header>

        {/* Main Alerts Content */}
        <main className="p-6">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="alerts">Alert Rules</TabsTrigger>
              <TabsTrigger value="notifications">
                Notifications
                {unreadTriggers.length > 0 && (
                  <Badge variant="destructive" className="ml-2 bg-red-500 text-white text-xs">
                    {unreadTriggers.length}
                  </Badge>
                )}
              </TabsTrigger>
              <TabsTrigger value="settings">Settings</TabsTrigger>
            </TabsList>

            <TabsContent value="alerts" className="space-y-6">
              <Card className="bg-white border-slate-200">
                <CardHeader>
                  <CardTitle className="text-lg font-semibold text-slate-900">Alert Rules</CardTitle>
                  <CardDescription className="text-sm text-slate-600">Create and manage custom alerts for legislative activity.</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-col md:flex-row gap-4 mb-6">
                    <div className="relative flex-1">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                      <Input
                        type="text"
                        placeholder="Search alerts..."
                        className="pl-9 w-full border-slate-300 focus:border-indigo-500 focus:ring-indigo-500"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                      />
                    </div>

                    <Select value={typeFilter} onValueChange={setTypeFilter}>
                      <SelectTrigger className="w-[180px] border-slate-300 focus:border-indigo-500 focus:ring-indigo-500">
                        <Filter className="w-4 h-4 mr-2 text-slate-400" />
                        <SelectValue placeholder="Type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Types</SelectItem>
                        <SelectItem value="bill_status">Bill Status</SelectItem>
                        <SelectItem value="committee_hearing">Committee Hearing</SelectItem>
                        <SelectItem value="vote_scheduled">Vote Scheduled</SelectItem>
                        <SelectItem value="legislator_activity">Legislator Activity</SelectItem>
                        <SelectItem value="deadline">Deadline</SelectItem>
                        <SelectItem value="custom">Custom</SelectItem>
                      </SelectContent>
                    </Select>

                    <Select value={statusFilter} onValueChange={setStatusFilter}>
                      <SelectTrigger className="w-[140px] border-slate-300 focus:border-indigo-500 focus:ring-indigo-500">
                        <Bell className="w-4 h-4 mr-2 text-slate-400" />
                        <SelectValue placeholder="Status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Status</SelectItem>
                        <SelectItem value="active">Active</SelectItem>
                        <SelectItem value="paused">Paused</SelectItem>
                        <SelectItem value="triggered">Triggered</SelectItem>
                      </SelectContent>
                    </Select>

                    <Select value={priorityFilter} onValueChange={setPriorityFilter}>
                      <SelectTrigger className="w-[120px] border-slate-300 focus:border-indigo-500 focus:ring-indigo-500">
                        <AlertTriangle className="w-4 h-4 mr-2 text-slate-400" />
                        <SelectValue placeholder="Priority" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Priority</SelectItem>
                        <SelectItem value="high">High</SelectItem>
                        <SelectItem value="medium">Medium</SelectItem>
                        <SelectItem value="low">Low</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-4">
                    {filteredAlerts.map((alert) => (
                      <Card key={alert.id} className="p-4 hover:bg-slate-50 transition-colors">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-4">
                            <div className="flex items-center space-x-2">
                              {getTypeIcon(alert.type)}
                              <div>
                                <h3 className="font-medium text-slate-900">{alert.title}</h3>
                                <p className="text-sm text-slate-600">{alert.description}</p>
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center space-x-4">
                            <Badge className={getPriorityBadgeVariant(alert.priority)}>
                              {alert.priority}
                            </Badge>
                            <Badge className={getStatusBadgeVariant(alert.status)}>
                              {alert.status}
                            </Badge>
                            <div className="flex items-center space-x-2">
                              {alert.notifications.email && <Mail className="w-4 h-4 text-slate-400" />}
                              {alert.notifications.sms && <Smartphone className="w-4 h-4 text-slate-400" />}
                              {alert.notifications.web && <Globe className="w-4 h-4 text-slate-400" />}
                            </div>
                            <div className="flex items-center space-x-2">
                              <Button variant="outline" size="sm" onClick={() => {
                                setEditingAlert(alert);
                                setIsEditModalOpen(true);
                              }}>
                                <Edit className="w-4 h-4" />
                              </Button>
                              <Button variant="outline" size="sm">
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            </div>
                          </div>
                        </div>
                        {alert.lastTriggered && (
                          <div className="mt-2 text-xs text-slate-500">
                            Last triggered: {new Date(alert.lastTriggered).toLocaleString()}
                          </div>
                        )}
                      </Card>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="notifications" className="space-y-6">
              <Card className="bg-white border-slate-200">
                <CardHeader>
                  <CardTitle className="text-lg font-semibold text-slate-900">Recent Notifications</CardTitle>
                  <CardDescription className="text-sm text-slate-600">Your latest alert triggers and notifications.</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {recentTriggers.map((trigger) => (
                      <Card key={trigger.id} className={`p-4 ${!trigger.read ? 'bg-blue-50 border-blue-200' : 'hover:bg-slate-50'} transition-colors`}>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-4">
                            <div className="flex items-center space-x-2">
                              {getTypeIcon(trigger.type)}
                              <div>
                                <h3 className="font-medium text-slate-900">{trigger.title}</h3>
                                <p className="text-sm text-slate-600">{trigger.description}</p>
                                <p className="text-xs text-slate-500 mt-1">
                                  {new Date(trigger.timestamp).toLocaleString()}
                                </p>
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Badge className={getPriorityBadgeVariant(trigger.priority)}>
                              {trigger.priority}
                            </Badge>
                            {!trigger.read && (
                              <Badge variant="destructive" className="bg-blue-500 text-white">
                                New
                              </Badge>
                            )}
                            <Button variant="outline" size="sm">
                              <Eye className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                      </Card>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="settings" className="space-y-6">
              <Card className="bg-white border-slate-200">
                <CardHeader>
                  <CardTitle className="text-lg font-semibold text-slate-900">Notification Preferences</CardTitle>
                  <CardDescription className="text-sm text-slate-600">Configure how you receive notifications.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <Label htmlFor="email-notifications" className="text-sm font-medium text-slate-900">
                          Email Notifications
                        </Label>
                        <p className="text-sm text-slate-600">Receive alerts via email</p>
                      </div>
                      <Switch id="email-notifications" defaultChecked />
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <Label htmlFor="sms-notifications" className="text-sm font-medium text-slate-900">
                          SMS Notifications
                        </Label>
                        <p className="text-sm text-slate-600">Receive urgent alerts via SMS</p>
                      </div>
                      <Switch id="sms-notifications" />
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <Label htmlFor="web-notifications" className="text-sm font-medium text-slate-900">
                          Web Notifications
                        </Label>
                        <p className="text-sm text-slate-600">Show browser notifications</p>
                      </div>
                      <Switch id="web-notifications" defaultChecked />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>

          {/* Create Alert Modal */}
          <Dialog open={isCreateModalOpen} onOpenChange={setIsCreateModalOpen}>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Create New Alert</DialogTitle>
                <DialogDescription>
                  Set up a new alert rule to monitor legislative activity.
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="alert-title">Alert Title</Label>
                    <Input id="alert-title" placeholder="e.g., HB24-1001 Status Changes" />
                  </div>
                  <div>
                    <Label htmlFor="alert-type">Alert Type</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Select type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="bill_status">Bill Status</SelectItem>
                        <SelectItem value="committee_hearing">Committee Hearing</SelectItem>
                        <SelectItem value="vote_scheduled">Vote Scheduled</SelectItem>
                        <SelectItem value="legislator_activity">Legislator Activity</SelectItem>
                        <SelectItem value="deadline">Deadline</SelectItem>
                        <SelectItem value="custom">Custom</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div>
                  <Label htmlFor="alert-description">Description</Label>
                  <Textarea id="alert-description" placeholder="Describe what this alert monitors..." />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="alert-priority">Priority</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Select priority" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="high">High</SelectItem>
                        <SelectItem value="medium">Medium</SelectItem>
                        <SelectItem value="low">Low</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="alert-status">Status</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Select status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="active">Active</SelectItem>
                        <SelectItem value="paused">Paused</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div>
                  <Label>Notification Methods</Label>
                  <div className="flex space-x-6 mt-2">
                    <div className="flex items-center space-x-2">
                      <Switch id="email-create" />
                      <Label htmlFor="email-create">Email</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Switch id="sms-create" />
                      <Label htmlFor="sms-create">SMS</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Switch id="web-create" defaultChecked />
                      <Label htmlFor="web-create">Web</Label>
                    </div>
                  </div>
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsCreateModalOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={() => setIsCreateModalOpen(false)}>
                  Create Alert
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </main>
      </div>
    </div>
  );
}
