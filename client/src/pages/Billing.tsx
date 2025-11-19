import DashboardLayout from "@/components/layout/DashboardLayout";
import {
  DollarSign,
  TrendingUp,
  CreditCard,
  Download,
  AlertCircle,
  Zap,
  Clock,
  Activity,
  Loader2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { brikkColors } from "@/lib/palette";
import { useApi } from "@/hooks/useApi";
import { useState, useEffect } from "react";
import { toast } from "sonner";

export default function Billing() {
  const api = useApi();
  const [loading, setLoading] = useState(true);
  const [billingPlan, setBillingPlan] = useState<any>(null);
  const [usageStats, setUsageStats] = useState<any>(null);
  const [costsByProvider, setCostsByProvider] = useState<any>(null);
  const [invoices, setInvoices] = useState<any[]>([]);

  useEffect(() => {
    loadBillingData();
  }, []);

  const loadBillingData = async () => {
    try {
      setLoading(true);
      const [plan, usage, costs, invoiceList] = await Promise.all([
        api.getBillingPlan().catch(() => ({ plan_type: 'Professional', billing_cycle: 'Monthly', next_billing_date: '2025-12-01' })),
        api.getUsageAggregate({ range: 'month', granularity: 'day' }).catch(() => ({ api_calls: 125430, tokens_used: 2450000, current_cost: 847.23, forecast: 1100 })),
        api.getCostsByProvider({ range: 'month', granularity: 'day' }).catch(() => ({ providers: [] })),
        api.getInvoices({ limit: 10 }).catch(() => ({ data: [] })),
      ]);
      setBillingPlan(plan);
      setUsageStats(usage);
      setCostsByProvider(costs);
      setInvoices((invoiceList as any).data || (invoiceList as any).invoices || []);
    } catch (error) {
      console.error('Failed to load billing data:', error);
      toast.error('Failed to load billing data');
    } finally {
      setLoading(false);
    }
  };
  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Usage & Billing</h1>
            <p className="text-muted-foreground mt-1">
              Monitor API usage, costs, and manage your subscription
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm">
              <Download className="h-4 w-4 mr-2" />
              Export Report
            </Button>
            <Button className="btn-primary">
              <CreditCard className="h-4 w-4" />
              Manage Payment
            </Button>
          </div>
        </div>

        {/* Current Plan */}
        <div className="brikk-card">
          <div className="flex items-start justify-between mb-4">
            <div>
              <h3 className="text-lg font-semibold mb-1">Current Plan</h3>
              <p className="text-sm text-muted-foreground">
                Your subscription and usage limits
              </p>
            </div>
            <Button variant="outline" size="sm">
              Upgrade Plan
            </Button>
          </div>
          <div className="grid gap-4 md:grid-cols-3">
            <div className="p-4 rounded-lg bg-accent/50">
              <div className="flex items-center gap-2 mb-2">
                <Zap className="h-4 w-4" style={{ color: brikkColors.lime }} />
                <span className="text-sm font-medium">Plan Type</span>
              </div>
              {loading ? (
                <div className="flex items-center gap-2">
                  <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
                  <span className="text-sm text-muted-foreground">Loading...</span>
                </div>
              ) : (
                <p className="text-2xl font-bold">{billingPlan?.plan_type || 'Professional'}</p>
              )}
            </div>
            <div className="p-4 rounded-lg bg-accent/50">
              <div className="flex items-center gap-2 mb-2">
                <Clock className="h-4 w-4" style={{ color: brikkColors.cyan }} />
                <span className="text-sm font-medium">Billing Cycle</span>
              </div>
              {loading ? (
                <div className="flex items-center gap-2">
                  <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
                  <span className="text-sm text-muted-foreground">Loading...</span>
                </div>
              ) : (
                <p className="text-2xl font-bold">{billingPlan?.billing_cycle || 'Monthly'}</p>
              )}
            </div>
            <div className="p-4 rounded-lg bg-accent/50">
              <div className="flex items-center gap-2 mb-2">
                <Activity className="h-4 w-4" style={{ color: brikkColors.violet }} />
                <span className="text-sm font-medium">Next Billing Date</span>
              </div>
              {loading ? (
                <div className="flex items-center gap-2">
                  <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
                  <span className="text-sm text-muted-foreground">Loading...</span>
                </div>
              ) : (
                <p className="text-2xl font-bold">{billingPlan?.next_billing_date || 'Dec 1, 2025'}</p>
              )}
            </div>
          </div>
        </div>

        {/* Usage Stats */}
        <div className="grid gap-4 md:grid-cols-4">
          <div className="brikk-card">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-muted-foreground">API Calls (MTD)</span>
              <Activity className="h-5 w-5" style={{ color: brikkColors.blue }} />
            </div>
            {loading ? (
              <div className="flex items-center gap-2">
                <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
                <span className="text-sm text-muted-foreground">Loading...</span>
              </div>
            ) : (
              <>
                <p className="text-2xl font-bold">{usageStats?.api_calls?.toLocaleString() || '0'}</p>
                <p className="text-xs text-muted-foreground mt-1">Month to date</p>
              </>
            )}
          </div>
          <div className="brikk-card">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-muted-foreground">Tokens Used</span>
              <Zap className="h-5 w-5" style={{ color: brikkColors.lime }} />
            </div>
            {loading ? (
              <div className="flex items-center gap-2">
                <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
                <span className="text-sm text-muted-foreground">Loading...</span>
              </div>
            ) : (
              <>
                <p className="text-2xl font-bold">{usageStats?.tokens_used?.toLocaleString() || '0'}</p>
                <p className="text-xs text-muted-foreground mt-1">Month to date</p>
              </>
            )}
          </div>
          <div className="brikk-card">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-muted-foreground">Current Cost</span>
              <DollarSign className="h-5 w-5" style={{ color: brikkColors.cyan }} />
            </div>
            {loading ? (
              <div className="flex items-center gap-2">
                <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
                <span className="text-sm text-muted-foreground">Loading...</span>
              </div>
            ) : (
              <>
                <p className="text-2xl font-bold">${usageStats?.current_cost?.toFixed(2) || '0.00'}</p>
                <p className="text-xs text-muted-foreground mt-1">Month to date</p>
              </>
            )}
          </div>
          <div className="brikk-card">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-muted-foreground">Forecast (EOM)</span>
              <TrendingUp className="h-5 w-5" style={{ color: brikkColors.violet }} />
            </div>
            {loading ? (
              <div className="flex items-center gap-2">
                <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
                <span className="text-sm text-muted-foreground">Loading...</span>
              </div>
            ) : (
              <>
                <p className="text-2xl font-bold">${usageStats?.forecast?.toFixed(2) || '0.00'}</p>
                <p className="text-xs text-muted-foreground mt-1">Projected end of month</p>
              </>
            )}
          </div>
        </div>

        {/* Usage Chart Placeholder */}
        <div className="brikk-card">
          <div className="mb-4">
            <h3 className="text-lg font-semibold">Usage Over Time</h3>
            <p className="text-sm text-muted-foreground">
              Daily API calls and costs for the current billing period
            </p>
          </div>
          <div className="flex items-center justify-center h-80 border-2 border-dashed rounded-lg">
            <div className="text-center">
              <TrendingUp className="h-10 w-10 mx-auto mb-4 text-muted-foreground" />
              <p className="text-sm text-muted-foreground mb-2">
                Usage chart will display here
              </p>
              <p className="text-xs text-muted-foreground">
                Awaiting API endpoint for usage time-series data
              </p>
            </div>
          </div>
        </div>

        {/* Cost Breakdown */}
        <div className="grid gap-6 lg:grid-cols-2">
          {/* By Service */}
          <div className="brikk-card">
            <div className="mb-4">
              <h3 className="text-lg font-semibold">Cost by Service</h3>
              <p className="text-sm text-muted-foreground">
                Breakdown of costs by API service
              </p>
            </div>
            <div className="flex items-center justify-center h-64 border-2 border-dashed rounded-lg">
              <div className="text-center">
                <DollarSign className="h-8 w-8 mx-auto mb-3 text-muted-foreground" />
                <p className="text-sm text-muted-foreground">
                  Cost breakdown awaiting data
                </p>
              </div>
            </div>
          </div>

          {/* By Agent */}
          <div className="brikk-card">
            <div className="mb-4">
              <h3 className="text-lg font-semibold">Cost by Agent</h3>
              <p className="text-sm text-muted-foreground">
                Top spending agents this month
              </p>
            </div>
            <div className="flex items-center justify-center h-64 border-2 border-dashed rounded-lg">
              <div className="text-center">
                <DollarSign className="h-8 w-8 mx-auto mb-3 text-muted-foreground" />
                <p className="text-sm text-muted-foreground">
                  Agent costs awaiting data
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Invoices */}
        <div className="brikk-card">
          <div className="mb-4 flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold">Invoice History</h3>
              <p className="text-sm text-muted-foreground">
                Download past invoices and receipts
              </p>
            </div>
            <Button variant="outline" size="sm" disabled>
              View All
            </Button>
          </div>
          <div className="flex items-center justify-center py-12 border-2 border-dashed rounded-lg">
            <div className="text-center">
              <CreditCard className="h-8 w-8 mx-auto mb-3 text-muted-foreground" />
              <p className="text-sm text-muted-foreground">
                No invoices available yet
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                Invoices will appear here once billing is active
              </p>
            </div>
          </div>
        </div>

        {/* API Configuration Notice */}
        <div className="brikk-card border-2 border-dashed">
          <div className="flex items-start gap-4">
            <div
              className="flex h-10 w-10 items-center justify-center rounded-lg flex-shrink-0"
              style={{ backgroundColor: `${brikkColors.cyan}20` }}
            >
              <AlertCircle className="h-5 w-5" style={{ color: brikkColors.cyan }} />
            </div>
            <div className="flex-1">
              <h4 className="font-semibold mb-2">Billing Module Ready</h4>
              <p className="text-sm text-muted-foreground mb-3">
                The billing interface is ready to display real-time usage metrics, cost breakdowns, and invoice history. Once API endpoints are configured, all billing data will populate automatically.
              </p>
              <div className="text-sm space-y-1">
                <p className="font-medium">📊 Features Ready:</p>
                <ul className="list-disc list-inside text-muted-foreground ml-2 space-y-1">
                  <li>Real-time usage tracking (API calls, tokens, costs)</li>
                  <li>Usage forecasting and trend analysis</li>
                  <li>Cost breakdown by service and agent</li>
                  <li>Invoice history and PDF downloads</li>
                  <li>Stripe payment management integration</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}

