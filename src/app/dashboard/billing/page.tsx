'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ProtectedRoute } from '@/components/ProtectedRoute';
import { SUBSCRIPTION_PLANS } from '@/lib/stripe';
import { 
  CreditCard, 
  Check, 
  ArrowLeft,
  Crown,
  Star,
  Building
} from 'lucide-react';

export default function BillingPage() {
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);

  const handleSelectPlan = (planId: string) => {
    setSelectedPlan(planId);
    // TODO: Implement Stripe checkout
    alert(`Selected ${planId} plan. Stripe integration coming soon!`);
  };

  return (
    <ProtectedRoute>
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
                  <h1 className="text-2xl font-bold text-slate-900">Billing & Subscription</h1>
                  <p className="text-slate-600">Manage your Little Bird subscription</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="p-6">
          {/* Current Plan */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <CreditCard className="w-5 h-5" />
                <span>Current Plan</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-semibold">Professional Plan</h3>
                  <p className="text-slate-600">$799/month • Billed monthly</p>
                  <Badge className="mt-2 bg-green-100 text-green-800">Active</Badge>
                </div>
                <Button variant="outline">
                  Manage Subscription
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Available Plans */}
          <div className="mb-8">
            <h2 className="text-xl font-semibold text-slate-900 mb-6">Available Plans</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {SUBSCRIPTION_PLANS.map((plan) => (
                <Card 
                  key={plan.id} 
                  className={`relative ${plan.popular ? 'ring-2 ring-indigo-600' : ''}`}
                >
                  {plan.popular && (
                    <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                      <Badge className="bg-indigo-600 text-white px-3 py-1">
                        <Star className="w-3 h-3 mr-1" />
                        Most Popular
                      </Badge>
                    </div>
                  )}
                  
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="flex items-center space-x-2">
                        {plan.id === 'starter' && <Building className="w-5 h-5" />}
                        {plan.id === 'professional' && <Crown className="w-5 h-5" />}
                        {plan.id === 'enterprise' && <Building className="w-5 h-5" />}
                        <span>{plan.name}</span>
                      </CardTitle>
                    </div>
                    <CardDescription>{plan.description}</CardDescription>
                    <div className="mt-4">
                      <span className="text-3xl font-bold">
                        {plan.price === 0 ? 'Custom' : `$${plan.price}`}
                      </span>
                      {plan.price > 0 && (
                        <span className="text-slate-600">/{plan.interval}</span>
                      )}
                    </div>
                  </CardHeader>
                  
                  <CardContent>
                    <ul className="space-y-3 mb-6">
                      {plan.features.map((feature, index) => (
                        <li key={index} className="flex items-center space-x-2">
                          <Check className="w-4 h-4 text-green-600 flex-shrink-0" />
                          <span className="text-sm text-slate-600">{feature}</span>
                        </li>
                      ))}
                    </ul>
                    
                    <Button 
                      className="w-full"
                      variant={plan.popular ? 'default' : 'outline'}
                      onClick={() => handleSelectPlan(plan.id)}
                    >
                      {plan.id === 'enterprise' ? 'Contact Sales' : 'Select Plan'}
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Payment Methods */}
          <Card>
            <CardHeader>
              <CardTitle>Payment Methods</CardTitle>
              <CardDescription>Manage your payment methods and billing information</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center space-x-3">
                    <CreditCard className="w-5 h-5 text-slate-400" />
                    <div>
                      <p className="font-medium">•••• •••• •••• 4242</p>
                      <p className="text-sm text-slate-600">Expires 12/25</p>
                    </div>
                  </div>
                  <Button variant="outline" size="sm">
                    Update
                  </Button>
                </div>
                
                <Button variant="outline" className="w-full">
                  Add Payment Method
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </ProtectedRoute>
  );
}
