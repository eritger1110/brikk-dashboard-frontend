import { useEffect, useState } from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  CreditCard,
  Check,
  X,
  TrendingUp,
  RefreshCw,
  AlertTriangle,
  Crown,
  Zap,
  Users,
  Activity,
} from 'lucide-react';
import { useApi } from '@/hooks/useApi';
import { useDemoMode } from '@/contexts/DemoModeContext';
import { toast } from 'sonner';
import type { PlanDetails, PlanTier, BillingSubscription } from '@/types/api';

const PLAN_ICONS: Record<PlanTier, any> = {
  demo_only: Activity,
  trial: Zap,
  free: Users,
  starter: TrendingUp,
  pro: Crown,
  enterprise: Crown,
};

// Demo plans data
const DEMO_PLANS: PlanDetails[] = [
  {
    id: 'free',
    name: 'Free',
    price_monthly: 0,
    price_yearly: 0,
    currency: 'USD',
    features: [
      { name: '5 Agents', included: true, limit: 5 },
      { name: '10 Workflows', included: true, limit: 10 },
      { name: '1,000 Executions/month', included: true, limit: 1000 },
      { name: '1 Team Member', included: true, limit: 1 },
      { name: 'Community Support', included: true },
      { name: 'Advanced Analytics', included: false },
      { name: 'Priority Support', included: false },
    ],
    limits: {
      agents: 5,
      workflows: 10,
      executions_per_month: 1000,
      team_members: 1,
    },
  },
  {
    id: 'starter',
    name: 'Starter',
    price_monthly: 49,
    price_yearly: 490,
    currency: 'USD',
    features: [
      { name: '25 Agents', included: true, limit: 25 },
      { name: '50 Workflows', included: true, limit: 50 },
      { name: '10,000 Executions/month', included: true, limit: 10000 },
      { name: '5 Team Members', included: true, limit: 5 },
      { name: 'Email Support', included: true },
      { name: 'Advanced Analytics', included: true },
      { name: 'Priority Support', included: false },
    ],
    limits: {
      agents: 25,
      workflows: 50,
      executions_per_month: 10000,
      team_members: 5,
    },
  },
  {
    id: 'pro',
    name: 'Pro',
    price_monthly: 199,
    price_yearly: 1990,
    currency: 'USD',
    features: [
      { name: 'Unlimited Agents', included: true },
      { name: 'Unlimited Workflows', included: true },
      { name: '100,000 Executions/month', included: true, limit: 100000 },
      { name: 'Unlimited Team Members', included: true },
      { name: 'Priority Support', included: true },
      { name: 'Advanced Analytics', included: true },
      { name: 'Custom Integrations', included: true },
    ],
    limits: {
      agents: 999999,
      workflows: 999999,
      executions_per_month: 100000,
      team_members: 999999,
    },
  },
  {
    id: 'enterprise',
    name: 'Enterprise',
    price_monthly: 999,
    price_yearly: 9990,
    currency: 'USD',
    features: [
      { name: 'Everything in Pro', included: true },
      { name: 'Unlimited Executions', included: true },
      { name: 'Dedicated Support', included: true },
      { name: 'SLA Guarantee', included: true },
      { name: 'Custom Deployment', included: true },
      { name: 'Advanced Security', included: true },
      { name: 'Audit Logs', included: true },
    ],
    limits: {
      agents: 999999,
      workflows: 999999,
      executions_per_month: 999999,
      team_members: 999999,
    },
  },
];

export default function Plans() {
  const api = useApi();
  const { isDemoMode } = useDemoMode();
  const [plans, setPlans] = useState<PlanDetails[]>(DEMO_PLANS);
  const [subscription, setSubscription] = useState<BillingSubscription | null>(null);
  const [loading, setLoading] = useState(true);
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'yearly'>('monthly');
  const [showUpgradeDialog, setShowUpgradeDialog] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<PlanTier | null>(null);
  const [upgrading, setUpgrading] = useState(false);

  const loadBillingData = async () => {
    setLoading(true);
    try {
      const [plansResponse, subResponse] = await Promise.all([
        api.getPlans().catch(() => ({ data: DEMO_PLANS })),
        api.getSubscription().catch(() => null),
      ]);
      
      setPlans(plansResponse.data || DEMO_PLANS);
      setSubscription(subResponse || {
        id: 'sub_demo',
        plan: 'free',
        status: 'active',
        current_period_start: '2024-11-01T00:00:00Z',
        current_period_end: '2024-12-01T00:00:00Z',
        cancel_at_period_end: false,
      });
    } catch (err: any) {
      console.error('Failed to load billing data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadBillingData();
  }, []);

  const handleUpgrade = async () => {
    if (!selectedPlan) return;

    if (selectedPlan === 'enterprise') {
      window.location.href = 'mailto:sales@brikk.ai?subject=Enterprise Plan Inquiry';
      setShowUpgradeDialog(false);
      return;
    }

    setUpgrading(true);
    try {
      const session = await api.createCheckoutSession({
        plan: selectedPlan,
        billing_cycle: billingCycle,
      });
      
      // Redirect to Stripe Checkout
      window.location.href = session.url;
    } catch (err: any) {
      console.error('Failed to create checkout session:', err);
      if (isDemoMode) {
        toast.info('Demo mode: Upgrade simulated');
        setShowUpgradeDialog(false);
      } else {
        toast.error('Failed to start upgrade process');
      }
    } finally {
      setUpgrading(false);
    }
  };

  const handleCancelSubscription = async () => {
    if (!confirm('Are you sure you want to cancel your subscription?')) {
      return;
    }

    try {
      await api.cancelSubscription();
      toast.success('Subscription cancelled. Access continues until period end.');
      loadBillingData();
    } catch (err: any) {
      console.error('Failed to cancel subscription:', err);
      if (isDemoMode) {
        toast.info('Demo mode: Cancellation simulated');
      } else {
        toast.error('Failed to cancel subscription');
      }
    }
  };

  const handleUpdatePaymentMethod = async () => {
    try {
      const response = await api.updatePaymentMethod();
      window.location.href = response.url;
    } catch (err: any) {
      console.error('Failed to update payment method:', err);
      if (isDemoMode) {
        toast.info('Demo mode: Payment method update simulated');
      } else {
        toast.error('Failed to update payment method');
      }
    }
  };

  const currentPlan = subscription?.plan || 'free';

  if (loading) {
    return (
      <DashboardLayout>
        <div className="container mx-auto py-8">
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="text-center">
              <RefreshCw className="w-12 h-12 animate-spin text-primary mx-auto mb-4" />
              <p className="text-muted-foreground">Loading plans...</p>
            </div>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="container mx-auto py-8 space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-[#0057FF] to-[#00C2FF] bg-clip-text text-transparent">
              Plans & Pricing
            </h1>
            <p className="text-muted-foreground mt-1">
              Choose the perfect plan for your team
            </p>
          </div>
          <Button onClick={loadBillingData} variant="outline">
            <RefreshCw className="w-4 h-4 mr-2" />
            Refresh
          </Button>
        </div>

        {/* Demo Mode Banner */}
        {isDemoMode && (
          <Card className="p-4 bg-amber-500/10 border-amber-500/20">
            <div className="flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-amber-500" />
              <p className="text-sm font-medium">
                Demo Mode Active - Billing features are simulated
              </p>
            </div>
          </Card>
        )}

        {/* Current Subscription */}
        {subscription && subscription.plan !== 'demo_only' && (
          <Card className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">Current Subscription</h3>
              <Badge variant={subscription.status === 'active' ? 'default' : 'secondary'}>
                {subscription.status}
              </Badge>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <p className="text-sm text-muted-foreground">Plan</p>
                <p className="text-lg font-semibold capitalize">{subscription.plan}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Current Period</p>
                <p className="text-sm">
                  {new Date(subscription.current_period_start).toLocaleDateString()} -{' '}
                  {new Date(subscription.current_period_end).toLocaleDateString()}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <Button variant="outline" onClick={handleUpdatePaymentMethod}>
                  <CreditCard className="w-4 h-4 mr-2" />
                  Update Payment
                </Button>
                {subscription.plan !== 'free' && !subscription.cancel_at_period_end && (
                  <Button variant="destructive" onClick={handleCancelSubscription}>
                    Cancel
                  </Button>
                )}
              </div>
            </div>
            {subscription.cancel_at_period_end && (
              <div className="mt-4 p-3 rounded-lg bg-amber-500/10 border border-amber-500/20">
                <p className="text-sm text-amber-600 dark:text-amber-400">
                  Your subscription will be cancelled at the end of the current period.
                </p>
              </div>
            )}
          </Card>
        )}

        {/* Billing Cycle Toggle */}
        <div className="flex items-center justify-center gap-4">
          <Button
            variant={billingCycle === 'monthly' ? 'default' : 'outline'}
            onClick={() => setBillingCycle('monthly')}
          >
            Monthly
          </Button>
          <Button
            variant={billingCycle === 'yearly' ? 'default' : 'outline'}
            onClick={() => setBillingCycle('yearly')}
          >
            Yearly
            <Badge variant="secondary" className="ml-2">
              Save 17%
            </Badge>
          </Button>
        </div>

        {/* Plans Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {plans.map((plan) => {
            const Icon = PLAN_ICONS[plan.id];
            const isCurrentPlan = plan.id === currentPlan;
            const price = billingCycle === 'monthly' ? plan.price_monthly : plan.price_yearly;
            const pricePerMonth = billingCycle === 'yearly' ? (price / 12).toFixed(0) : price;

            return (
              <Card
                key={plan.id}
                className={`p-6 ${
                  isCurrentPlan ? 'border-primary border-2' : ''
                } ${plan.id === 'pro' ? 'ring-2 ring-primary ring-offset-2' : ''}`}
              >
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2 rounded-lg bg-primary/10">
                    <Icon className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold">{plan.name}</h3>
                    {isCurrentPlan && (
                      <Badge variant="outline" className="text-xs">
                        Current
                      </Badge>
                    )}
                  </div>
                </div>

                <div className="mb-6">
                  <div className="flex items-baseline gap-1">
                    <span className="text-3xl font-bold">${pricePerMonth}</span>
                    <span className="text-muted-foreground">/month</span>
                  </div>
                  {billingCycle === 'yearly' && price > 0 && (
                    <p className="text-xs text-muted-foreground mt-1">
                      Billed ${price}/year
                    </p>
                  )}
                </div>

                <ul className="space-y-3 mb-6">
                  {plan.features.map((feature, idx) => (
                    <li key={idx} className="flex items-start gap-2 text-sm">
                      {feature.included ? (
                        <Check className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                      ) : (
                        <X className="w-4 h-4 text-muted-foreground mt-0.5 flex-shrink-0" />
                      )}
                      <span className={feature.included ? '' : 'text-muted-foreground'}>
                        {feature.name}
                      </span>
                    </li>
                  ))}
                </ul>

                <Button
                  className="w-full"
                  variant={plan.id === 'pro' ? 'default' : 'outline'}
                  disabled={isCurrentPlan}
                  onClick={() => {
                    setSelectedPlan(plan.id);
                    setShowUpgradeDialog(true);
                  }}
                >
                  {isCurrentPlan ? 'Current Plan' : plan.id === 'enterprise' ? 'Contact Sales' : 'Upgrade'}
                </Button>
              </Card>
            );
          })}
        </div>

        {/* Upgrade Dialog */}
        <Dialog open={showUpgradeDialog} onOpenChange={setShowUpgradeDialog}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Upgrade Plan</DialogTitle>
              <DialogDescription>
                {selectedPlan === 'enterprise'
                  ? "We'll connect you with our sales team"
                  : "You'll be redirected to Stripe to complete your upgrade"}
              </DialogDescription>
            </DialogHeader>
            <div className="py-4">
              <p className="text-sm">
                Upgrading to{' '}
                <span className="font-semibold capitalize">{selectedPlan}</span> plan
              </p>
              {selectedPlan !== 'enterprise' && (
                <p className="text-sm text-muted-foreground mt-2">
                  Billing cycle: {billingCycle === 'monthly' ? 'Monthly' : 'Yearly'}
                </p>
              )}
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setShowUpgradeDialog(false)}>
                Cancel
              </Button>
              <Button onClick={handleUpgrade} disabled={upgrading}>
                {upgrading ? 'Processing...' : selectedPlan === 'enterprise' ? 'Contact Sales' : 'Continue to Checkout'}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </DashboardLayout>
  );
}
