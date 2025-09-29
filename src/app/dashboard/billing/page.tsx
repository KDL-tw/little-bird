"use client";

import { useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { DashboardLayout } from '@/components/DashboardLayout';
import { 
  CreditCard, 
  Check, 
  ArrowLeft,
  Crown,
  Star,
  Building,
  Zap,
  Shield,
  BarChart3
} from 'lucide-react';

export default function BillingPage() {
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);

  const handleSelectPlan = (planId: string) => {
    setSelectedPlan(planId);
    // TODO: Implement Stripe checkout
    alert(`Selected ${planId} plan. Stripe integration coming soon!`);
  };

  const plans = [
    {
      id: 'starter',
      name: 'Starter',
      price: '$299',
      period: '/month',
      description: 'Perfect for small lobbying firms',
      features: [
        'Colorado bill tracking',
        'Basic legislator CRM',
        'Up to 5 users',
        'Email support',
        'Standard compliance tools'
      ],
      popular: false,
      icon: Building
    },
    {
      id: 'professional',
      name: 'Professional',
      price: '$799',
      period: '/month',
      description: 'Advanced features for growing firms',
      features: [
        'Everything in Starter',
        'Multi-state tracking',
        'Advanced analytics',
        'Up to 25 users',
        'Priority support',
        'AI bill summaries',
        'Real-time alerts'
      ],
      popular: true,
      icon: Crown
    },
    {
      id: 'enterprise',
      name: 'Enterprise',
      price: 'Custom',
      period: '',
      description: 'Tailored solutions for large organizations',
      features: [
        'Everything in Professional',
        'Unlimited users',
        'Custom integrations',
        'Dedicated support',
        'Advanced AI features',
        'Custom reporting',
        'White-label options'
      ],
      popular: false,
      icon: Zap
    }
  ];

  const actions = (
    <div className="flex items-center space-x-2">
      <Button variant="outline" size="sm">
        <CreditCard className="h-4 w-4 mr-2" />
        Payment Methods
      </Button>
    </div>
  );

  return (
    <DashboardLayout
      title="Billing & Subscription"
      subtitle="Manage your Little Bird subscription"
      actions={actions}
    >
      {/* Current Plan */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="flex items-center">
            <Crown className="h-5 w-5 mr-2" />
            Current Plan
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-xl font-semibold">Professional Plan</h3>
              <p className="text-slate-600">$799/month • Billed monthly</p>
              <p className="text-sm text-slate-500 mt-1">Next billing date: February 15, 2024</p>
            </div>
            <div className="flex items-center space-x-2">
              <Badge className="bg-green-100 text-green-800">Active</Badge>
              <Button variant="outline" size="sm">
                Manage Plan
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Usage Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Bills Tracked</CardTitle>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">247</div>
            <p className="text-xs text-muted-foreground">
              of 500 included
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Users</CardTitle>
            <Building className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">8</div>
            <p className="text-xs text-muted-foreground">
              of 25 included
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">API Calls</CardTitle>
            <Zap className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">12,450</div>
            <p className="text-xs text-muted-foreground">
              of 50,000 included
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Available Plans */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Available Plans</CardTitle>
          <CardDescription>
            Choose the plan that best fits your needs
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {plans.map((plan) => {
              const Icon = plan.icon;
              return (
                <div
                  key={plan.id}
                  className={`relative border rounded-lg p-6 ${
                    plan.popular ? 'border-indigo-500 bg-indigo-50' : 'border-slate-200'
                  }`}
                >
                  {plan.popular && (
                    <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                      <Badge className="bg-indigo-600 text-white">
                        <Star className="h-3 w-3 mr-1" />
                        Most Popular
                      </Badge>
                    </div>
                  )}
                  
                  <div className="text-center mb-4">
                    <Icon className={`h-8 w-8 mx-auto mb-2 ${
                      plan.popular ? 'text-indigo-600' : 'text-slate-600'
                    }`} />
                    <h3 className="text-lg font-semibold">{plan.name}</h3>
                    <p className="text-slate-600 text-sm">{plan.description}</p>
                  </div>
                  
                  <div className="text-center mb-6">
                    <span className="text-3xl font-bold">{plan.price}</span>
                    <span className="text-slate-600">{plan.period}</span>
                  </div>
                  
                  <ul className="space-y-2 mb-6">
                    {plan.features.map((feature, index) => (
                      <li key={index} className="flex items-center text-sm">
                        <Check className="h-4 w-4 text-green-600 mr-2 flex-shrink-0" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                  
                  <Button
                    className={`w-full ${
                      plan.popular 
                        ? 'bg-indigo-600 hover:bg-indigo-700' 
                        : 'bg-slate-900 hover:bg-slate-800'
                    }`}
                    onClick={() => handleSelectPlan(plan.id)}
                  >
                    {plan.id === 'enterprise' ? 'Contact Sales' : 'Select Plan'}
                  </Button>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Billing History */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Billing History</CardTitle>
          <CardDescription>
            Your recent invoices and payments
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between py-3 border-b">
              <div>
                <p className="font-medium">January 2024</p>
                <p className="text-sm text-slate-600">Professional Plan</p>
              </div>
              <div className="text-right">
                <p className="font-medium">$799.00</p>
                <Badge className="bg-green-100 text-green-800">Paid</Badge>
              </div>
            </div>
            
            <div className="flex items-center justify-between py-3 border-b">
              <div>
                <p className="font-medium">December 2023</p>
                <p className="text-sm text-slate-600">Professional Plan</p>
              </div>
              <div className="text-right">
                <p className="font-medium">$799.00</p>
                <Badge className="bg-green-100 text-green-800">Paid</Badge>
              </div>
            </div>
            
            <div className="flex items-center justify-between py-3">
              <div>
                <p className="font-medium">November 2023</p>
                <p className="text-sm text-slate-600">Professional Plan</p>
              </div>
              <div className="text-right">
                <p className="font-medium">$799.00</p>
                <Badge className="bg-green-100 text-green-800">Paid</Badge>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Payment Methods */}
      <Card>
        <CardHeader>
          <CardTitle>Payment Methods</CardTitle>
          <CardDescription>
            Manage your payment information
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between py-3 border rounded-lg px-4">
              <div className="flex items-center space-x-3">
                <CreditCard className="h-6 w-6 text-slate-600" />
                <div>
                  <p className="font-medium">•••• •••• •••• 4242</p>
                  <p className="text-sm text-slate-600">Expires 12/25</p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <Badge className="bg-green-100 text-green-800">Default</Badge>
                <Button variant="outline" size="sm">
                  Edit
                </Button>
              </div>
            </div>
            
            <Button variant="outline" className="w-full">
              <CreditCard className="h-4 w-4 mr-2" />
              Add Payment Method
            </Button>
          </div>
        </CardContent>
      </Card>
    </DashboardLayout>
  );
}