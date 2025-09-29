"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import Link from "next/link";
import { useState, useEffect } from "react";
// import { useAuth } from "@/contexts/AuthContext";
// import { ProtectedRoute } from "@/components/ProtectedRoute";
import { 
  BarChart3, 
  FileText, 
  Users, 
  Building2,
  Shield, 
  TrendingUp, 
  Settings,
  Home,
  AlertCircle,
  CheckCircle,
  Calendar,
  Info,
  Sparkles,
  Bell,
  Globe,
  Network,
  Brain,
  BarChart,
  Code,
  Mail,
  RefreshCw,
  Database,
  LogOut,
  User,
  CreditCard
} from "lucide-react";

export default function Dashboard() {
  const [isPlatformModalOpen, setIsPlatformModalOpen] = useState(false);
  const [isEarlyAccessModalOpen, setIsEarlyAccessModalOpen] = useState(false);
  const [email, setEmail] = useState('');

  // Use static values for now to avoid auth issues
  const user = null; // Will be populated when auth is working
  const signOut = async () => {
    console.log('Sign out requested');
  };

  const handleEarlyAccessRequest = () => {
    // In a real app, this would send the email to a backend
    alert(`Thank you! We'll notify ${email} when these features become available.`);
    setEmail('');
    setIsEarlyAccessModalOpen(false);
  };

  const handleSignOut = async () => {
    await signOut();
  };

  const getUserInitials = (email: string) => {
    return email.split('@')[0].substring(0, 2).toUpperCase();
  };

  // Check for admin bypass mode
  const isAdminBypass = typeof window !== 'undefined' && sessionStorage.getItem('adminBypass');

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
            <Link href="/dashboard" className="flex items-center px-3 py-2 text-sm font-medium text-white bg-slate-800 rounded-lg">
              <BarChart3 className="w-5 h-5 mr-3" />
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
            <Link href="/dashboard/clients" className="flex items-center px-3 py-2 text-sm font-medium text-slate-300 hover:text-white hover:bg-slate-800 rounded-lg transition-colors">
              <Building2 className="w-5 h-5 mr-3" />
              Clients
            </Link>
            <Link href="/dashboard/contacts" className="flex items-center px-3 py-2 text-sm font-medium text-slate-300 hover:text-white hover:bg-slate-800 rounded-lg transition-colors">
              <Users className="w-5 h-5 mr-3" />
              Contacts
            </Link>
            <Link href="/dashboard/alerts" className="flex items-center px-3 py-2 text-sm font-medium text-slate-300 hover:text-white hover:bg-slate-800 rounded-lg transition-colors">
              <Bell className="w-5 h-5 mr-3" />
              Alerts
            </Link>
                    <Link href="/dashboard/sync" className="flex items-center px-3 py-2 text-sm font-medium text-slate-300 hover:text-white hover:bg-slate-800 rounded-lg transition-colors">
                      <RefreshCw className="w-5 h-5 mr-3" />
                      Data Sync
                    </Link>
                    <Link href="/dashboard/sources" className="flex items-center px-3 py-2 text-sm font-medium text-slate-300 hover:text-white hover:bg-slate-800 rounded-lg transition-colors">
                      <Database className="w-5 h-5 mr-3" />
                      Data Sources
                    </Link>
            <Link href="/dashboard/compliance" className="flex items-center px-3 py-2 text-sm font-medium text-slate-300 hover:text-white hover:bg-slate-800 rounded-lg transition-colors">
              <Shield className="w-5 h-5 mr-3" />
              Compliance
            </Link>
            <Link href="/dashboard/analytics" className="flex items-center px-3 py-2 text-sm font-medium text-slate-300 hover:text-white hover:bg-slate-800 rounded-lg transition-colors">
              <TrendingUp className="w-5 h-5 mr-3" />
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
                <Home className="w-4 h-4 mr-2" />
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
              <h1 className="text-2xl font-semibold text-slate-900">
                {isAdminBypass ? 'Admin Dashboard' : 'Welcome back'}
              </h1>
              <p className="text-slate-600">
                {isAdminBypass 
                  ? 'Admin bypass mode - Supabase not configured' 
                  : 'Here\'s what\'s happening with your lobbying operations today.'
                }
              </p>
            </div>
            <div className="flex items-center space-x-4">
              {/* User Menu */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={user?.user_metadata?.avatar_url} alt={user?.email} />
                      <AvatarFallback className="bg-indigo-600 text-white text-sm">
                        {isAdminBypass ? 'AD' : (user?.email ? getUserInitials(user.email) : 'U')}
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56" align="end" forceMount>
                  <div className="flex items-center justify-start gap-2 p-2">
                    <div className="flex flex-col space-y-1 leading-none">
                      <p className="font-medium">
                        {isAdminBypass ? 'Admin User' : (user?.user_metadata?.name || user?.email)}
                      </p>
                      <p className="w-[200px] truncate text-sm text-muted-foreground">
                        {isAdminBypass ? 'admin@littlebird.com' : user?.email}
                      </p>
                    </div>
                  </div>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link href="/dashboard/settings" className="flex items-center">
                      <User className="mr-2 h-4 w-4" />
                      <span>Profile</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/dashboard/billing" className="flex items-center">
                      <CreditCard className="mr-2 h-4 w-4" />
                      <span>Billing</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleSignOut} className="text-red-600">
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Sign out</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
              <Dialog open={isPlatformModalOpen} onOpenChange={setIsPlatformModalOpen}>
                <DialogTrigger asChild>
                  <Button variant="outline" className="flex items-center space-x-2">
                    <Info className="w-4 h-4" />
                    <span>Platform Overview</span>
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                  <DialogHeader>
                    <DialogTitle className="flex items-center space-x-2">
                      <Sparkles className="w-6 h-6 text-indigo-600" />
                      <span>Little Bird Platform Overview</span>
                    </DialogTitle>
                    <DialogDescription>
                      Discover current features and upcoming capabilities of the Little Bird political intelligence platform
                    </DialogDescription>
                  </DialogHeader>
                  
                  <div className="space-y-8">
                    {/* Available Now Section */}
                    <div className="space-y-4">
                      <div className="flex items-center space-x-2">
                        <CheckCircle className="w-5 h-5 text-green-600" />
                        <h3 className="text-lg font-semibold text-slate-900">Available Now</h3>
                        <Badge className="bg-green-100 text-green-800 border-green-200">Live</Badge>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <Card className="border-green-200 bg-green-50">
                          <CardContent className="p-4">
                            <div className="flex items-start space-x-3">
                              <FileText className="w-5 h-5 text-green-600 mt-0.5" />
                              <div>
                                <h4 className="font-semibold text-slate-900">Colorado Bill Tracking</h4>
                                <p className="text-sm text-slate-600">Monitor and track Colorado legislation with real-time updates and AI-powered analysis</p>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                        <Card className="border-green-200 bg-green-50">
                          <CardContent className="p-4">
                            <div className="flex items-start space-x-3">
                              <Users className="w-5 h-5 text-green-600 mt-0.5" />
                              <div>
                                <h4 className="font-semibold text-slate-900">Legislator CRM & Profiles</h4>
                                <p className="text-sm text-slate-600">Comprehensive relationship management with detailed legislator profiles and interaction tracking</p>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                        <Card className="border-green-200 bg-green-50">
                          <CardContent className="p-4">
                            <div className="flex items-start space-x-3">
                              <Brain className="w-5 h-5 text-green-600 mt-0.5" />
                              <div>
                                <h4 className="font-semibold text-slate-900">AI Bill Summaries</h4>
                                <p className="text-sm text-slate-600">Intelligent analysis with executive summaries, stakeholder impact, and passage predictions</p>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                        <Card className="border-green-200 bg-green-50">
                          <CardContent className="p-4">
                            <div className="flex items-start space-x-3">
                              <Shield className="w-5 h-5 text-green-600 mt-0.5" />
                              <div>
                                <h4 className="font-semibold text-slate-900">Basic Compliance Checklists</h4>
                                <p className="text-sm text-slate-600">Streamlined compliance tracking with automated deadline monitoring</p>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      </div>
                    </div>

                    <Separator />

                    {/* Coming January 2025 Section */}
                    <div className="space-y-4">
                      <div className="flex items-center space-x-2">
                        <Calendar className="w-5 h-5 text-blue-600" />
                        <h3 className="text-lg font-semibold text-slate-900">Coming January 2025</h3>
                        <Badge className="bg-blue-100 text-blue-800 border-blue-200">Q1 2025</Badge>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <Card className="border-blue-200 bg-blue-50">
                          <CardContent className="p-4">
                            <div className="flex items-start space-x-3">
                              <Bell className="w-5 h-5 text-blue-600 mt-0.5" />
                              <div>
                                <h4 className="font-semibold text-slate-900">Real-time Alerts & Notifications</h4>
                                <p className="text-sm text-slate-600">Instant notifications for bill status changes, committee hearings, and important deadlines</p>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                        <Card className="border-blue-200 bg-blue-50">
                          <CardContent className="p-4">
                            <div className="flex items-start space-x-3">
                              <FileText className="w-5 h-5 text-blue-600 mt-0.5" />
                              <div>
                                <h4 className="font-semibold text-slate-900">Automated Compliance Reporting</h4>
                                <p className="text-sm text-slate-600">Generate compliance reports automatically with customizable templates and scheduling</p>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                        <Card className="border-blue-200 bg-blue-50">
                          <CardContent className="p-4">
                            <div className="flex items-start space-x-3">
                              <Globe className="w-5 h-5 text-blue-600 mt-0.5" />
                              <div>
                                <h4 className="font-semibold text-slate-900">Multi-state Bill Tracking</h4>
                                <p className="text-sm text-slate-600">Track legislation across multiple states with cross-state similarity detection</p>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                        <Card className="border-blue-200 bg-blue-50">
                          <CardContent className="p-4">
                            <div className="flex items-start space-x-3">
                              <Users className="w-5 h-5 text-blue-600 mt-0.5" />
                              <div>
                                <h4 className="font-semibold text-slate-900">Collaboration Workspaces</h4>
                                <p className="text-sm text-slate-600">Team collaboration tools with role-based access and shared workspaces</p>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      </div>
                    </div>

                    <Separator />

                    {/* Coming Q2 2025 Section */}
                    <div className="space-y-4">
                      <div className="flex items-center space-x-2">
                        <TrendingUp className="w-5 h-5 text-purple-600" />
                        <h3 className="text-lg font-semibold text-slate-900">Coming Q2 2025</h3>
                        <Badge className="bg-purple-100 text-purple-800 border-purple-200">Q2 2025</Badge>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <Card className="border-purple-200 bg-purple-50">
                          <CardContent className="p-4">
                            <div className="flex items-start space-x-3">
                              <Brain className="w-5 h-5 text-purple-600 mt-0.5" />
                              <div>
                                <h4 className="font-semibold text-slate-900">Preflight Legislator Modeling</h4>
                                <p className="text-sm text-slate-600">AI-powered predictions of how legislators will respond to specific policy proposals</p>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                        <Card className="border-purple-200 bg-purple-50">
                          <CardContent className="p-4">
                            <div className="flex items-start space-x-3">
                              <Network className="w-5 h-5 text-purple-600 mt-0.5" />
                              <div>
                                <h4 className="font-semibold text-slate-900">Network Influence Mapping</h4>
                                <p className="text-sm text-slate-600">Visualize influence networks and relationship patterns between legislators and stakeholders</p>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                        <Card className="border-purple-200 bg-purple-50">
                          <CardContent className="p-4">
                            <div className="flex items-start space-x-3">
                              <BarChart className="w-5 h-5 text-purple-600 mt-0.5" />
                              <div>
                                <h4 className="font-semibold text-slate-900">Statistical Prediction Models</h4>
                                <p className="text-sm text-slate-600">Advanced analytics for bill passage prediction and turnout modeling</p>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                        <Card className="border-purple-200 bg-purple-50">
                          <CardContent className="p-4">
                            <div className="flex items-start space-x-3">
                              <Code className="w-5 h-5 text-purple-600 mt-0.5" />
                              <div>
                                <h4 className="font-semibold text-slate-900">API Access</h4>
                                <p className="text-sm text-slate-600">RESTful API for integrating Little Bird data with your existing systems</p>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      </div>
                    </div>

                    {/* Request Early Access Section */}
                    <div className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-lg p-6 border border-indigo-200">
                      <div className="text-center space-y-4">
                        <h3 className="text-lg font-semibold text-slate-900">Get Early Access to Upcoming Features</h3>
                        <p className="text-slate-600">Be among the first to experience our next-generation political intelligence tools</p>
                        <Dialog open={isEarlyAccessModalOpen} onOpenChange={setIsEarlyAccessModalOpen}>
                          <DialogTrigger asChild>
                            <Button className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700">
                              <Mail className="w-4 h-4 mr-2" />
                              Request Early Access
                            </Button>
                          </DialogTrigger>
                          <DialogContent>
                            <DialogHeader>
                              <DialogTitle>Request Early Access</DialogTitle>
                              <DialogDescription>
                                Enter your email to be notified when new features become available
                              </DialogDescription>
                            </DialogHeader>
                            <div className="space-y-4">
                              <div>
                                <label className="text-sm font-medium text-slate-700">Email Address</label>
                                <input
                                  type="email"
                                  value={email}
                                  onChange={(e) => setEmail(e.target.value)}
                                  placeholder="your.email@company.com"
                                  className="w-full mt-1 px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                />
                              </div>
                              <div className="flex justify-end space-x-2">
                                <Button variant="outline" onClick={() => setIsEarlyAccessModalOpen(false)}>
                                  Cancel
                                </Button>
                                <Button onClick={handleEarlyAccessRequest} disabled={!email}>
                                  Request Access
                                </Button>
                              </div>
                            </div>
                          </DialogContent>
                        </Dialog>
                      </div>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          </div>
        </header>

        {/* Main Dashboard Content */}
        <main className="p-6">
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {/* Bills Tracked */}
            <Card className="bg-white border-slate-200 hover:shadow-lg transition-shadow">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-slate-600">Bills Tracked</CardTitle>
                <FileText className="h-4 w-4 text-slate-400" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-slate-900">247</div>
                <p className="text-xs text-green-600 flex items-center mt-1">
                  <TrendingUp className="h-3 w-3 mr-1" />
                  +12% from last week
                </p>
              </CardContent>
            </Card>

            {/* Active Legislators */}
            <Card className="bg-white border-slate-200 hover:shadow-lg transition-shadow">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-slate-600">Active Legislators</CardTitle>
                <Users className="h-4 w-4 text-slate-400" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-slate-900">89</div>
                <p className="text-xs text-slate-500 mt-1">
                  Across 12 committees
                </p>
              </CardContent>
            </Card>

            {/* Compliance Deadlines */}
            <Card className="bg-white border-slate-200 hover:shadow-lg transition-shadow">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-slate-600">Compliance Deadlines</CardTitle>
                <AlertCircle className="h-4 w-4 text-slate-400" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-slate-900">3</div>
                <p className="text-xs text-orange-600 mt-1">
                  Due this week
                </p>
              </CardContent>
            </Card>

            {/* Upcoming Hearings */}
            <Card className="bg-white border-slate-200 hover:shadow-lg transition-shadow">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-slate-600">Upcoming Hearings</CardTitle>
                <Calendar className="h-4 w-4 text-slate-400" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-slate-900">12</div>
                <p className="text-xs text-blue-600 mt-1">
                  Next 7 days
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Bill Positions Summary */}
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="flex items-center">
                <FileText className="w-5 h-5 mr-2" />
                Bill Positions Overview
              </CardTitle>
              <CardDescription>Your current stance on tracked legislation</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                <div className="text-center p-4 bg-green-50 rounded-lg border border-green-200">
                  <div className="text-2xl font-bold text-green-600">4</div>
                  <div className="text-sm text-green-700">Support</div>
                </div>
                <div className="text-center p-4 bg-yellow-50 rounded-lg border border-yellow-200">
                  <div className="text-2xl font-bold text-yellow-600">2</div>
                  <div className="text-sm text-yellow-700">Monitor</div>
                </div>
                <div className="text-center p-4 bg-red-50 rounded-lg border border-red-200">
                  <div className="text-2xl font-bold text-red-600">2</div>
                  <div className="text-sm text-red-700">Oppose</div>
                </div>
                <div className="text-center p-4 bg-purple-50 rounded-lg border border-purple-200">
                  <div className="text-2xl font-bold text-purple-600">1</div>
                  <div className="text-sm text-purple-700">Hypothetical</div>
                </div>
                <div className="text-center p-4 bg-gray-50 rounded-lg border border-gray-200">
                  <div className="text-2xl font-bold text-gray-600">1</div>
                  <div className="text-sm text-gray-700">None</div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Recent Activity */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="bg-white border-slate-200">
              <CardHeader>
                <CardTitle className="text-lg font-semibold text-slate-900">Recent Activity</CardTitle>
                <CardDescription>Latest updates on your tracked bills and legislation</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
                  <div className="flex-1">
                    <p className="text-sm text-slate-900 font-medium">HB 2024-1234</p>
                    <p className="text-sm text-slate-600">Passed House Committee on Health & Human Services</p>
                    <p className="text-xs text-slate-500 mt-1">2 hours ago</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                  <div className="flex-1">
                    <p className="text-sm text-slate-900 font-medium">SB 2024-0567</p>
                    <p className="text-sm text-slate-600">Scheduled for Senate Floor Vote</p>
                    <p className="text-xs text-slate-500 mt-1">4 hours ago</p>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-orange-500 rounded-full mt-2"></div>
                  <div className="flex-1">
                    <p className="text-sm text-slate-900 font-medium">HB 2024-0891</p>
                    <p className="text-sm text-slate-600">Amended in House Committee</p>
                    <p className="text-xs text-slate-500 mt-1">6 hours ago</p>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-red-500 rounded-full mt-2"></div>
                  <div className="flex-1">
                    <p className="text-sm text-slate-900 font-medium">SB 2024-1234</p>
                    <p className="text-sm text-slate-600">Vetoed by Governor</p>
                    <p className="text-xs text-slate-500 mt-1">1 day ago</p>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
                  <div className="flex-1">
                    <p className="text-sm text-slate-900 font-medium">HB 2024-0456</p>
                    <p className="text-sm text-slate-600">Signed into Law</p>
                    <p className="text-xs text-slate-500 mt-1">2 days ago</p>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                  <div className="flex-1">
                    <p className="text-sm text-slate-900 font-medium">SB 2024-0789</p>
                    <p className="text-sm text-slate-600">Introduced in Senate</p>
                    <p className="text-xs text-slate-500 mt-1">3 days ago</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card className="bg-white border-slate-200">
              <CardHeader>
                <CardTitle className="text-lg font-semibold text-slate-900">Quick Actions</CardTitle>
                <CardDescription>Common tasks and shortcuts</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button className="w-full justify-start" variant="outline">
                  <FileText className="w-4 h-4 mr-2" />
                  Track New Bill
                </Button>
                <Button className="w-full justify-start" variant="outline">
                  <Users className="w-4 h-4 mr-2" />
                  Add Legislator Contact
                </Button>
                <Button className="w-full justify-start" variant="outline">
                  <Shield className="w-4 h-4 mr-2" />
                  Review Compliance
                </Button>
                <Button className="w-full justify-start" variant="outline">
                  <Calendar className="w-4 h-4 mr-2" />
                  Schedule Meeting
                </Button>
                <Button className="w-full justify-start" variant="outline">
                  <TrendingUp className="w-4 h-4 mr-2" />
                  View Analytics
                </Button>
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
      </div>
  );
}
