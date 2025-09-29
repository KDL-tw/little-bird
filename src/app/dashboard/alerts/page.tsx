"use client";

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Switch } from '@/components/ui/switch';
import { DashboardLayout } from '@/components/DashboardLayout';
import { 
  Bell, 
  Plus, 
  Search, 
  Filter, 
  Settings, 
  AlertTriangle, 
  CheckCircle, 
  Clock, 
  FileText, 
  Users, 
  Calendar,
  Mail,
  Phone,
  MessageSquare,
  Star,
  StarOff,
  Eye,
  Edit,
  Trash2,
  Loader2
} from 'lucide-react';

interface Alert {
  id: string;
  title: string;
  type: 'bill' | 'legislator' | 'deadline' | 'hearing';
  priority: 'high' | 'medium' | 'low';
  status: 'active' | 'paused' | 'triggered';
  description: string;
  created_at: string;
  last_triggered?: string;
  trigger_count: number;
}

export default function AlertsManager() {
  const [alerts, setAlerts] = useState<Alert[]>([
    {
      id: '1',
      title: 'HB24-1001 Status Change',
      type: 'bill',
      priority: 'high',
      status: 'active',
      description: 'Alert when HB24-1001 status changes',
      created_at: '2024-01-15',
      last_triggered: '2024-01-20',
      trigger_count: 3
    },
    {
      id: '2',
      title: 'Rep. Johnson Committee Meeting',
      type: 'legislator',
      priority: 'medium',
      status: 'active',
      description: 'Alert when Rep. Johnson has committee meetings',
      created_at: '2024-01-10',
      trigger_count: 1
    },
    {
      id: '3',
      title: 'Compliance Deadline - Lobbying Reports',
      type: 'deadline',
      priority: 'high',
      status: 'active',
      description: 'Alert 7 days before lobbying report deadline',
      created_at: '2024-01-01',
      trigger_count: 0
    }
  ]);
  
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [priorityFilter, setPriorityFilter] = useState('all');
  const [createAlertOpen, setCreateAlertOpen] = useState(false);
  const [newAlert, setNewAlert] = useState({
    title: '',
    type: 'bill' as 'bill' | 'legislator' | 'deadline' | 'hearing',
    priority: 'medium' as 'high' | 'medium' | 'low',
    description: ''
  });

  const filteredAlerts = alerts.filter(alert => {
    const matchesSearch = alert.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         alert.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = typeFilter === 'all' || alert.type === typeFilter;
    const matchesStatus = statusFilter === 'all' || alert.status === statusFilter;
    const matchesPriority = priorityFilter === 'all' || alert.priority === priorityFilter;
    
    return matchesSearch && matchesType && matchesStatus && matchesPriority;
  });

  const handleCreateAlert = () => {
    const alert: Alert = {
      id: Date.now().toString(),
      ...newAlert,
      status: 'active',
      created_at: new Date().toISOString().split('T')[0],
      trigger_count: 0
    };
    setAlerts([...alerts, alert]);
    setCreateAlertOpen(false);
    setNewAlert({
      title: '',
      type: 'bill',
      priority: 'medium',
      description: ''
    });
  };

  const handleToggleAlert = (id: string) => {
    setAlerts(alerts.map(alert => 
      alert.id === id 
        ? { ...alert, status: alert.status === 'active' ? 'paused' : 'active' }
        : alert
    ));
  };

  const handleDeleteAlert = (id: string) => {
    setAlerts(alerts.filter(alert => alert.id !== id));
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'paused': return 'bg-yellow-100 text-yellow-800';
      case 'triggered': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'bill': return <FileText className="h-4 w-4" />;
      case 'legislator': return <Users className="h-4 w-4" />;
      case 'deadline': return <Clock className="h-4 w-4" />;
      case 'hearing': return <Calendar className="h-4 w-4" />;
      default: return <Bell className="h-4 w-4" />;
    }
  };

  const actions = (
    <div className="flex items-center space-x-2">
      <Button variant="outline" size="sm">
        <Settings className="h-4 w-4 mr-2" />
        Settings
      </Button>
      <Button size="sm" onClick={() => setCreateAlertOpen(true)}>
        <Plus className="h-4 w-4 mr-2" />
        Create Alert
      </Button>
    </div>
  );

  return (
    <DashboardLayout
      title="Alerts & Notifications"
      subtitle="Manage your alert rules and notifications"
      actions={actions}
    >
      <Tabs defaultValue="alerts" className="space-y-6">
        <TabsList>
          <TabsTrigger value="alerts">Alert Rules ({alerts.length})</TabsTrigger>
          <TabsTrigger value="notifications">Recent Notifications</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
        </TabsList>

        <TabsContent value="alerts" className="space-y-6">
          {/* Search and Filters */}
          <Card>
            <CardHeader>
              <CardTitle>Search & Filter Alerts</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div>
                  <Input
                    placeholder="Search alerts..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
                <Select value={typeFilter} onValueChange={setTypeFilter}>
                  <SelectTrigger>
                    <SelectValue placeholder="All Types" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Types</SelectItem>
                    <SelectItem value="bill">Bill</SelectItem>
                    <SelectItem value="legislator">Legislator</SelectItem>
                    <SelectItem value="deadline">Deadline</SelectItem>
                    <SelectItem value="hearing">Hearing</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger>
                    <SelectValue placeholder="All Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="paused">Paused</SelectItem>
                    <SelectItem value="triggered">Triggered</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={priorityFilter} onValueChange={setPriorityFilter}>
                  <SelectTrigger>
                    <SelectValue placeholder="All Priorities" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Priorities</SelectItem>
                    <SelectItem value="high">High</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="low">Low</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Alerts List */}
          <Card>
            <CardHeader>
              <CardTitle>Alert Rules ({filteredAlerts.length})</CardTitle>
            </CardHeader>
            <CardContent>
              {filteredAlerts.length === 0 ? (
                <div className="text-center py-8 text-slate-500">
                  No alerts found. {searchTerm && 'Try adjusting your search terms.'}
                </div>
              ) : (
                <div className="space-y-4">
                  {filteredAlerts.map((alert) => (
                    <div key={alert.id} className="border rounded-lg p-4 hover:bg-slate-50">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center space-x-2 mb-2">
                            {getTypeIcon(alert.type)}
                            <h3 className="font-semibold text-lg">{alert.title}</h3>
                            <Badge className={getPriorityColor(alert.priority)}>
                              {alert.priority}
                            </Badge>
                            <Badge className={getStatusColor(alert.status)}>
                              {alert.status}
                            </Badge>
                          </div>
                          <p className="text-slate-600 mb-2">{alert.description}</p>
                          <div className="flex items-center space-x-4 text-sm text-slate-500">
                            <span>Created: {alert.created_at}</span>
                            <span>Triggers: {alert.trigger_count}</span>
                            {alert.last_triggered && (
                              <span>Last: {alert.last_triggered}</span>
                            )}
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Switch
                            checked={alert.status === 'active'}
                            onCheckedChange={() => handleToggleAlert(alert.id)}
                          />
                          <Button variant="outline" size="sm">
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => handleDeleteAlert(alert.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="notifications">
          <Card>
            <CardHeader>
              <CardTitle>Recent Notifications</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8 text-slate-500">
                <Bell className="h-12 w-12 mx-auto mb-4" />
                <p>No recent notifications</p>
                <p className="text-sm">Notifications will appear here when your alerts are triggered</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="settings">
          <Card>
            <CardHeader>
              <CardTitle>Alert Settings</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="email-alerts">Email Notifications</Label>
                  <p className="text-sm text-slate-500">Receive alerts via email</p>
                </div>
                <Switch id="email-alerts" defaultChecked />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="push-alerts">Push Notifications</Label>
                  <p className="text-sm text-slate-500">Receive alerts via browser notifications</p>
                </div>
                <Switch id="push-alerts" />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="sms-alerts">SMS Notifications</Label>
                  <p className="text-sm text-slate-500">Receive critical alerts via SMS</p>
                </div>
                <Switch id="sms-alerts" />
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Create Alert Modal */}
      <Dialog open={createAlertOpen} onOpenChange={setCreateAlertOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create New Alert</DialogTitle>
            <DialogDescription>
              Set up a new alert rule to monitor legislative activity
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="title">Alert Title</Label>
              <Input
                id="title"
                value={newAlert.title}
                onChange={(e) => setNewAlert({...newAlert, title: e.target.value})}
                placeholder="Enter alert title"
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="type">Alert Type</Label>
                <Select value={newAlert.type} onValueChange={(value: any) => setNewAlert({...newAlert, type: value})}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="bill">Bill</SelectItem>
                    <SelectItem value="legislator">Legislator</SelectItem>
                    <SelectItem value="deadline">Deadline</SelectItem>
                    <SelectItem value="hearing">Hearing</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <Label htmlFor="priority">Priority</Label>
                <Select value={newAlert.priority} onValueChange={(value: any) => setNewAlert({...newAlert, priority: value})}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="high">High</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="low">Low</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <div>
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={newAlert.description}
                onChange={(e) => setNewAlert({...newAlert, description: e.target.value})}
                placeholder="Describe what this alert monitors"
                rows={3}
              />
            </div>
            
            <DialogFooter>
              <Button variant="outline" onClick={() => setCreateAlertOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleCreateAlert}>
                <Plus className="h-4 w-4 mr-2" />
                Create Alert
              </Button>
            </DialogFooter>
          </div>
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
}