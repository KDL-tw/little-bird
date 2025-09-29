import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      {/* Navigation */}
      <nav className="border-b border-slate-200 backdrop-blur-sm bg-slate-50/95 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center space-x-8">
              <div className="flex items-center">
                <span className="text-2xl font-bold text-slate-600">LITTLE</span>
                <span className="text-2xl font-bold text-slate-900 ml-1">BIRD</span>
              </div>
              <div className="hidden md:flex space-x-8">
                <a href="#bills" className="text-slate-700 hover:text-indigo-600 transition-colors font-medium">Bills</a>
                <a href="#legislators" className="text-slate-700 hover:text-indigo-600 transition-colors font-medium">Legislators</a>
                <a href="#compliance" className="text-slate-700 hover:text-indigo-600 transition-colors font-medium">Compliance</a>
                <a href="#analytics" className="text-slate-700 hover:text-indigo-600 transition-colors font-medium">Analytics</a>
              </div>
            </div>
            <div className="flex space-x-4">
              <Link href="/dashboard">
                <Button variant="outline" className="border-indigo-600 text-indigo-600 hover:bg-indigo-50 px-6 py-2">
                  View Dashboard
                </Button>
              </Link>
              <Button className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2">
                Request Demo
              </Button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section with Light Gradient */}
      <section className="relative py-20 lg:py-32 overflow-hidden bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
        <div className="absolute inset-0 bg-gradient-to-tr from-indigo-100 via-purple-50 to-blue-100 animate-gradient opacity-60"></div>
        <div className="relative z-10">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <Badge className="mb-6 bg-indigo-100 text-indigo-700 border-indigo-200 px-4 py-2">
                Trusted by 200+ Lobbying Firms
              </Badge>
              <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold tracking-tight mb-8 text-slate-900">
                Political Intelligence for
                <span className="bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent block">
                  Elite Lobbying Firms
                </span>
              </h1>
              <p className="text-xl text-slate-700 max-w-4xl mx-auto mb-10 leading-relaxed">
                The most advanced political intelligence platform designed exclusively for boutique lobbying firms. 
                Track legislation, manage relationships, ensure compliance, and gain strategic insights that deliver results.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button size="lg" className="bg-indigo-600 hover:bg-indigo-700 text-white px-10 py-4 text-lg font-semibold shadow-2xl">
                  Start Free Trial
                </Button>
                <Button size="lg" variant="outline" className="border-indigo-600 text-indigo-600 hover:bg-indigo-50 hover:text-indigo-700 px-10 py-4 text-lg font-semibold">
                  Watch Demo
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Trusted By Section */}
      <section className="py-16 bg-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <p className="text-slate-600 text-lg font-medium">Trusted by leading lobbying firms in Colorado</p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 items-center opacity-70">
            <div className="text-center">
              <div className="text-2xl font-bold text-slate-800">Denver Partners</div>
              <div className="text-sm text-slate-600">Government Affairs</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-slate-800">Rocky Mountain</div>
              <div className="text-sm text-slate-600">Advocacy Group</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-slate-800">Capitol Strategies</div>
              <div className="text-sm text-slate-600">Lobbying Firm</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-slate-800">Peak Policy</div>
              <div className="text-sm text-slate-600">Consulting</div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-20">
            <h2 className="text-4xl sm:text-5xl font-bold mb-6 text-slate-900">
              Everything You Need to Dominate
            </h2>
            <p className="text-xl text-slate-700 max-w-3xl mx-auto">
              Six powerful modules designed to give boutique lobbying firms the intelligence and tools they need to succeed
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Bill Tracking Card */}
            <Card className="bg-white border-slate-200 hover:border-indigo-300 transition-all duration-300 hover:shadow-2xl hover:shadow-indigo-100 group">
              <CardHeader>
                <div className="w-14 h-14 bg-gradient-to-br from-indigo-500 to-indigo-600 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                  <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <CardTitle className="text-slate-900 text-2xl mb-3">Bill Tracking</CardTitle>
                <CardDescription className="text-slate-600 text-lg">
                  Real-time monitoring of legislation across federal, state, and local levels
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="text-slate-600 space-y-3">
                  <li className="flex items-center"><span className="w-2 h-2 bg-indigo-500 rounded-full mr-3"></span>Automated bill status updates</li>
                  <li className="flex items-center"><span className="w-2 h-2 bg-indigo-500 rounded-full mr-3"></span>Custom alerts and notifications</li>
                  <li className="flex items-center"><span className="w-2 h-2 bg-indigo-500 rounded-full mr-3"></span>Historical tracking and analysis</li>
                  <li className="flex items-center"><span className="w-2 h-2 bg-indigo-500 rounded-full mr-3"></span>Committee hearing schedules</li>
                </ul>
              </CardContent>
            </Card>

            {/* Legislator CRM Card */}
            <Card className="bg-white border-slate-200 hover:border-indigo-300 transition-all duration-300 hover:shadow-2xl hover:shadow-indigo-100 group">
              <CardHeader>
                <div className="w-14 h-14 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                  <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                </div>
                <CardTitle className="text-slate-900 text-2xl mb-3">Legislator CRM</CardTitle>
                <CardDescription className="text-slate-600 text-lg">
                  Comprehensive relationship management for legislators and staff
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="text-slate-600 space-y-3">
                  <li className="flex items-center"><span className="w-2 h-2 bg-purple-500 rounded-full mr-3"></span>Contact and interaction tracking</li>
                  <li className="flex items-center"><span className="w-2 h-2 bg-purple-500 rounded-full mr-3"></span>Meeting scheduling and notes</li>
                  <li className="flex items-center"><span className="w-2 h-2 bg-purple-500 rounded-full mr-3"></span>Voting history analysis</li>
                  <li className="flex items-center"><span className="w-2 h-2 bg-purple-500 rounded-full mr-3"></span>Influence mapping</li>
                </ul>
              </CardContent>
            </Card>

            {/* Compliance Automation Card */}
            <Card className="bg-white border-slate-200 hover:border-indigo-300 transition-all duration-300 hover:shadow-2xl hover:shadow-indigo-100 group">
              <CardHeader>
                <div className="w-14 h-14 bg-gradient-to-br from-green-500 to-green-600 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                  <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <CardTitle className="text-slate-900 text-2xl mb-3">Compliance Automation</CardTitle>
                <CardDescription className="text-slate-600 text-lg">
                  Automated compliance monitoring and reporting across all jurisdictions
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="text-slate-600 space-y-3">
                  <li className="flex items-center"><span className="w-2 h-2 bg-green-500 rounded-full mr-3"></span>Automated compliance monitoring</li>
                  <li className="flex items-center"><span className="w-2 h-2 bg-green-500 rounded-full mr-3"></span>Deadline tracking and alerts</li>
                  <li className="flex items-center"><span className="w-2 h-2 bg-green-500 rounded-full mr-3"></span>Report generation and filing</li>
                  <li className="flex items-center"><span className="w-2 h-2 bg-green-500 rounded-full mr-3"></span>Audit trail maintenance</li>
                </ul>
              </CardContent>
            </Card>

            {/* Network Analysis Card */}
            <Card className="bg-white border-slate-200 hover:border-indigo-300 transition-all duration-300 hover:shadow-2xl hover:shadow-indigo-100 group">
              <CardHeader>
                <div className="w-14 h-14 bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                  <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9v-9m0-9v9" />
                  </svg>
                </div>
                <CardTitle className="text-slate-900 text-2xl mb-3">Network Analysis</CardTitle>
                <CardDescription className="text-slate-600 text-lg">
                  Advanced network mapping and influence analysis tools
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="text-slate-600 space-y-3">
                  <li className="flex items-center"><span className="w-2 h-2 bg-orange-500 rounded-full mr-3"></span>Stakeholder mapping</li>
                  <li className="flex items-center"><span className="w-2 h-2 bg-orange-500 rounded-full mr-3"></span>Influence network analysis</li>
                  <li className="flex items-center"><span className="w-2 h-2 bg-orange-500 rounded-full mr-3"></span>Coalition building tools</li>
                  <li className="flex items-center"><span className="w-2 h-2 bg-orange-500 rounded-full mr-3"></span>Relationship strength scoring</li>
                </ul>
              </CardContent>
            </Card>

            {/* AI Intelligence Card */}
            <Card className="bg-white border-slate-200 hover:border-indigo-300 transition-all duration-300 hover:shadow-2xl hover:shadow-indigo-100 group">
              <CardHeader>
                <div className="w-14 h-14 bg-gradient-to-br from-cyan-500 to-cyan-600 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                  <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                  </svg>
                </div>
                <CardTitle className="text-slate-900 text-2xl mb-3">AI Intelligence</CardTitle>
                <CardDescription className="text-slate-600 text-lg">
                  Machine learning-powered insights and predictive analytics
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="text-slate-600 space-y-3">
                  <li className="flex items-center"><span className="w-2 h-2 bg-cyan-500 rounded-full mr-3"></span>Predictive bill outcomes</li>
                  <li className="flex items-center"><span className="w-2 h-2 bg-cyan-500 rounded-full mr-3"></span>Sentiment analysis</li>
                  <li className="flex items-center"><span className="w-2 h-2 bg-cyan-500 rounded-full mr-3"></span>Risk assessment</li>
                  <li className="flex items-center"><span className="w-2 h-2 bg-cyan-500 rounded-full mr-3"></span>Strategic recommendations</li>
                </ul>
              </CardContent>
            </Card>

            {/* Real-time Alerts Card */}
            <Card className="bg-white border-slate-200 hover:border-indigo-300 transition-all duration-300 hover:shadow-2xl hover:shadow-indigo-100 group">
              <CardHeader>
                <div className="w-14 h-14 bg-gradient-to-br from-red-500 to-red-600 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                  <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-5 5v-5zM4.828 7l2.586 2.586a2 2 0 002.828 0L12.828 7H4.828zM4.828 17l2.586-2.586a2 2 0 012.828 0L12.828 17H4.828z" />
                  </svg>
                </div>
                <CardTitle className="text-slate-900 text-2xl mb-3">Real-time Alerts</CardTitle>
                <CardDescription className="text-slate-600 text-lg">
                  Instant notifications for critical developments and opportunities
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="text-slate-600 space-y-3">
                  <li className="flex items-center"><span className="w-2 h-2 bg-red-500 rounded-full mr-3"></span>Custom alert rules</li>
                  <li className="flex items-center"><span className="w-2 h-2 bg-red-500 rounded-full mr-3"></span>Multi-channel notifications</li>
                  <li className="flex items-center"><span className="w-2 h-2 bg-red-500 rounded-full mr-3"></span>Priority-based filtering</li>
                  <li className="flex items-center"><span className="w-2 h-2 bg-red-500 rounded-full mr-3"></span>Mobile app integration</li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="py-24 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-20">
            <h2 className="text-4xl sm:text-5xl font-bold mb-6 text-slate-900">
              Choose Your Power Level
            </h2>
            <p className="text-xl text-slate-700 max-w-3xl mx-auto">
              Flexible pricing designed for boutique lobbying firms of every size
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {/* Starter Plan */}
            <Card className="bg-white border-slate-200 hover:border-slate-300 transition-all duration-300">
              <CardHeader className="text-center pb-8">
                <h3 className="text-2xl font-bold text-slate-900 mb-2">Starter</h3>
                <div className="text-5xl font-bold text-slate-700 mb-2">$299</div>
                <div className="text-slate-600">per month</div>
                <Separator className="mt-6 bg-slate-200" />
              </CardHeader>
              <CardContent className="space-y-4">
                <ul className="text-slate-600 space-y-3">
                  <li className="flex items-center"><span className="w-2 h-2 bg-slate-500 rounded-full mr-3"></span>Up to 5 users</li>
                  <li className="flex items-center"><span className="w-2 h-2 bg-slate-500 rounded-full mr-3"></span>Bill tracking (50 bills)</li>
                  <li className="flex items-center"><span className="w-2 h-2 bg-slate-500 rounded-full mr-3"></span>Basic compliance monitoring</li>
                  <li className="flex items-center"><span className="w-2 h-2 bg-slate-500 rounded-full mr-3"></span>Email support</li>
                  <li className="flex items-center"><span className="w-2 h-2 bg-slate-500 rounded-full mr-3"></span>Standard reporting</li>
                </ul>
                <Button className="w-full mt-8 bg-slate-200 hover:bg-slate-600 text-white">
                  Start Free Trial
                </Button>
              </CardContent>
            </Card>

            {/* Professional Plan */}
            <Card className="bg-slate-800/50 border-indigo-300 hover:border-indigo-400 transition-all duration-300 relative">
              <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                <Badge className="bg-indigo-600 text-white px-4 py-1">Most Popular</Badge>
              </div>
              <CardHeader className="text-center pb-8 pt-6">
                <h3 className="text-2xl font-bold text-slate-900 mb-2">Professional</h3>
                <div className="text-5xl font-bold text-indigo-400 mb-2">$799</div>
                <div className="text-slate-600">per month</div>
                <Separator className="mt-6 bg-slate-200" />
              </CardHeader>
              <CardContent className="space-y-4">
                <ul className="text-slate-600 space-y-3">
                  <li className="flex items-center"><span className="w-2 h-2 bg-indigo-400 rounded-full mr-3"></span>Up to 25 users</li>
                  <li className="flex items-center"><span className="w-2 h-2 bg-indigo-400 rounded-full mr-3"></span>Unlimited bill tracking</li>
                  <li className="flex items-center"><span className="w-2 h-2 bg-indigo-400 rounded-full mr-3"></span>Full compliance automation</li>
                  <li className="flex items-center"><span className="w-2 h-2 bg-indigo-400 rounded-full mr-3"></span>Legislator CRM</li>
                  <li className="flex items-center"><span className="w-2 h-2 bg-indigo-400 rounded-full mr-3"></span>Network analysis</li>
                  <li className="flex items-center"><span className="w-2 h-2 bg-indigo-400 rounded-full mr-3"></span>Priority support</li>
                  <li className="flex items-center"><span className="w-2 h-2 bg-indigo-400 rounded-full mr-3"></span>Advanced analytics</li>
                </ul>
                <Button className="w-full mt-8 bg-indigo-600 hover:bg-indigo-700 text-white">
                  Start Free Trial
                </Button>
              </CardContent>
            </Card>

            {/* Enterprise Plan */}
            <Card className="bg-white border-slate-200 hover:border-slate-300 transition-all duration-300">
              <CardHeader className="text-center pb-8">
                <h3 className="text-2xl font-bold text-slate-900 mb-2">Enterprise</h3>
                <div className="text-5xl font-bold text-slate-700 mb-2">Custom</div>
                <div className="text-slate-600">contact us</div>
                <Separator className="mt-6 bg-slate-200" />
              </CardHeader>
              <CardContent className="space-y-4">
                <ul className="text-slate-600 space-y-3">
                  <li className="flex items-center"><span className="w-2 h-2 bg-slate-500 rounded-full mr-3"></span>Unlimited users</li>
                  <li className="flex items-center"><span className="w-2 h-2 bg-slate-500 rounded-full mr-3"></span>All features included</li>
                  <li className="flex items-center"><span className="w-2 h-2 bg-slate-500 rounded-full mr-3"></span>AI Intelligence</li>
                  <li className="flex items-center"><span className="w-2 h-2 bg-slate-500 rounded-full mr-3"></span>Custom integrations</li>
                  <li className="flex items-center"><span className="w-2 h-2 bg-slate-500 rounded-full mr-3"></span>Dedicated support</li>
                  <li className="flex items-center"><span className="w-2 h-2 bg-slate-500 rounded-full mr-3"></span>On-premise deployment</li>
                  <li className="flex items-center"><span className="w-2 h-2 bg-slate-500 rounded-full mr-3"></span>Custom training</li>
                </ul>
                <Button className="w-full mt-8 bg-slate-200 hover:bg-slate-600 text-white">
                  Contact Sales
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-gradient-to-r from-indigo-600 via-purple-600 to-blue-600">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl sm:text-5xl font-bold mb-6 text-white">
            Ready to Transform Your Lobbying Operations?
          </h2>
          <p className="text-xl text-slate-100 mb-10 max-w-2xl mx-auto">
            Join the elite lobbying firms who trust Little Bird for their political intelligence needs. 
            Start your free trial today.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="bg-white text-indigo-600 hover:bg-slate-100 px-12 py-4 text-xl font-semibold shadow-2xl">
              Start Free Trial
            </Button>
            <Button size="lg" variant="outline" className="border-white/30 text-white hover:bg-white/10 px-12 py-4 text-xl font-semibold backdrop-blur-sm">
              Schedule Demo
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-100 border-t border-slate-200 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8">
            <div className="md:col-span-2">
              <div className="flex items-center mb-6">
                <span className="text-3xl font-bold text-slate-600">LITTLE</span>
                <span className="text-3xl font-bold text-slate-900 ml-1">BIRD</span>
              </div>
              <p className="text-slate-600 mb-6 max-w-md">
                The most advanced political intelligence platform for boutique lobbying firms. 
                Track, analyze, and influence with confidence.
              </p>
            </div>
            <div>
              <h4 className="text-slate-800 font-semibold mb-4">Product</h4>
              <ul className="space-y-2 text-slate-600">
                <li><a href="#" className="hover:text-indigo-600 transition-colors">Features</a></li>
                <li><a href="#" className="hover:text-indigo-600 transition-colors">Pricing</a></li>
                <li><a href="#" className="hover:text-indigo-600 transition-colors">API</a></li>
                <li><a href="#" className="hover:text-indigo-600 transition-colors">Integrations</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-slate-800 font-semibold mb-4">Company</h4>
              <ul className="space-y-2 text-slate-600">
                <li><a href="#" className="hover:text-indigo-600 transition-colors">About</a></li>
                <li><a href="#" className="hover:text-indigo-600 transition-colors">Contact</a></li>
                <li><a href="#" className="hover:text-indigo-600 transition-colors">Privacy</a></li>
                <li><a href="#" className="hover:text-indigo-600 transition-colors">Terms</a></li>
              </ul>
            </div>
          </div>
          <Separator className="my-8 bg-slate-200" />
          <div className="text-center text-slate-500">
            <p>&copy; 2024 Little Bird. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
