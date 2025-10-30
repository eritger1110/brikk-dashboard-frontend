import { TrendingUp, TrendingDown, Play, Clock, DollarSign, CheckCircle2, Activity } from 'lucide-react';
import DashboardLayout from '@/components/layout/DashboardLayout';

interface MetricCardProps {
  title: string;
  value: string | number;
  trend?: {
    value: string;
    isPositive: boolean;
  };
  icon: React.ReactNode;
}

function MetricCard({ title, value, trend, icon }: MetricCardProps) {
  return (
    <div className="rounded-lg border border-border bg-card p-6 shadow-sm hover:shadow-md transition-shadow">
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium text-muted-foreground">{title}</p>
          <p className="mt-2 text-3xl font-bold text-foreground">{value}</p>
          {trend && (
            <div className="mt-2 flex items-center gap-1">
              {trend.isPositive ? (
                <TrendingUp className="h-4 w-4 text-success" />
              ) : (
                <TrendingDown className="h-4 w-4 text-danger" />
              )}
              <span
                className={`text-sm font-medium ${
                  trend.isPositive ? 'text-success' : 'text-danger'
                }`}
              >
                {trend.value}
              </span>
            </div>
          )}
        </div>
        <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
          {icon}
        </div>
      </div>
    </div>
  );
}

interface WorkflowCardProps {
  name: string;
  description: string;
  status: 'healthy' | 'warning' | 'critical';
  executions: number;
  avgLatency: string;
  cost: string;
}

function WorkflowCard({ name, description, status, executions, avgLatency, cost }: WorkflowCardProps) {
  const statusConfig = {
    healthy: { dot: 'status-dot-success', label: 'Healthy', color: 'text-success' },
    warning: { dot: 'status-dot-warning', label: 'Warning', color: 'text-warning' },
    critical: { dot: 'status-dot-danger', label: 'Critical', color: 'text-danger' },
  };

  const config = statusConfig[status];

  return (
    <div className="rounded-lg border border-border bg-card p-6 shadow-sm hover:shadow-md transition-all hover:border-primary/50 cursor-pointer">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-foreground">{name}</h3>
          <p className="mt-1 text-sm text-muted-foreground line-clamp-1">{description}</p>
        </div>
        <div className="flex items-center gap-2">
          <span className={`status-dot ${config.dot}`}></span>
          <span className={`text-xs font-medium ${config.color}`}>{config.label}</span>
        </div>
      </div>

      {/* Miniature workflow visualization */}
      <div className="my-4 flex items-center justify-center gap-2 py-4">
        <div className="flex h-8 w-8 items-center justify-center rounded border-2 border-blue-500 bg-blue-50 dark:bg-blue-950">
          <div className="h-3 w-3 rounded-sm bg-blue-500"></div>
        </div>
        <div className="h-0.5 w-6 bg-border"></div>
        <div className="flex h-8 w-8 items-center justify-center rounded border-2 border-purple-500 bg-purple-50 dark:bg-purple-950">
          <div className="h-3 w-3 rounded-sm bg-purple-500"></div>
        </div>
        <div className="h-0.5 w-6 bg-border"></div>
        <div className="flex h-8 w-8 items-center justify-center rounded border-2 border-green-500 bg-green-50 dark:bg-green-950">
          <div className="h-3 w-3 rounded-sm bg-green-500"></div>
        </div>
      </div>

      {/* Metrics */}
      <div className="flex items-center justify-between border-t border-border pt-4">
        <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
          <Play className="h-3.5 w-3.5" />
          <span>{executions} runs</span>
        </div>
        <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
          <Clock className="h-3.5 w-3.5" />
          <span>{avgLatency}</span>
        </div>
        <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
          <DollarSign className="h-3.5 w-3.5" />
          <span>{cost}</span>
        </div>
      </div>
    </div>
  );
}

export default function Dashboard() {
  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* Page header */}
        <div>
          <h1 className="text-3xl font-bold text-foreground">Dashboard</h1>
          <p className="mt-2 text-muted-foreground">
            Overview of your workflow automation platform
          </p>
        </div>

        {/* Metrics */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          <MetricCard
            title="Active Workflows"
            value={47}
            trend={{ value: '+3 this week', isPositive: true }}
            icon={<CheckCircle2 className="h-6 w-6 text-primary" />}
          />
          <MetricCard
            title="Total Executions (24h)"
            value="3,547"
            trend={{ value: '+12% from yesterday', isPositive: true }}
            icon={<Play className="h-6 w-6 text-primary" />}
          />
          <MetricCard
            title="Success Rate"
            value="99.2%"
            trend={{ value: '+0.3% this week', isPositive: true }}
            icon={<TrendingUp className="h-6 w-6 text-primary" />}
          />
          <MetricCard
            title="Monthly Cost"
            value="$847"
            trend={{ value: '85% of budget', isPositive: true }}
            icon={<DollarSign className="h-6 w-6 text-primary" />}
          />
        </div>

        {/* Quick Actions */}
        <div className="rounded-lg border border-border bg-card p-6">
          <h2 className="text-lg font-semibold text-foreground mb-4">Quick Actions</h2>
          <div className="flex flex-wrap gap-3">
            <button className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors">
              <Play className="h-4 w-4" />
              Create New Workflow
            </button>
            <button className="inline-flex items-center gap-2 rounded-lg bg-warning/10 px-4 py-2 text-sm font-medium text-warning hover:bg-warning/20 transition-colors">
              <Activity className="h-4 w-4" />
              View All Alerts
            </button>
            <button className="inline-flex items-center gap-2 rounded-lg border border-border px-4 py-2 text-sm font-medium text-foreground hover:bg-accent transition-colors">
              <Play className="h-4 w-4" />
              Run Simulation
            </button>
          </div>
        </div>

        {/* Workflows Grid */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-foreground">Active Workflows</h2>
            <button className="text-sm font-medium text-primary hover:underline">
              View all →
            </button>
          </div>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            <WorkflowCard
              name="Auto-Reorder Low Inventory"
              description="Monitors SAP inventory and creates Salesforce orders when stock is low"
              status="healthy"
              executions={127}
              avgLatency="3.1s"
              cost="$0.69"
            />
            <WorkflowCard
              name="Customer Onboarding"
              description="Automates new customer setup across Salesforce, Zendesk, and Slack"
              status="healthy"
              executions={89}
              avgLatency="2.4s"
              cost="$0.45"
            />
            <WorkflowCard
              name="Quality Control Alerts"
              description="Monitors production data and sends alerts when quality metrics degrade"
              status="warning"
              executions={234}
              avgLatency="5.2s"
              cost="$1.12"
            />
            <WorkflowCard
              name="Order Processing"
              description="Processes incoming orders from Shopify and updates inventory in SAP"
              status="healthy"
              executions={456}
              avgLatency="1.8s"
              cost="$0.89"
            />
            <WorkflowCard
              name="Supplier Communication"
              description="Sends automated updates to suppliers via email when orders are placed"
              status="healthy"
              executions={78}
              avgLatency="2.1s"
              cost="$0.34"
            />
            <WorkflowCard
              name="Demand Forecasting"
              description="Uses Mistral AI to predict demand and adjust inventory thresholds"
              status="critical"
              executions={12}
              avgLatency="12.3s"
              cost="$2.45"
            />
          </div>
        </div>

        {/* Recent Activity */}
        <div className="rounded-lg border border-border bg-card p-6">
          <h2 className="text-lg font-semibold text-foreground mb-4">Recent Activity</h2>
          <div className="space-y-3">
            {[
              { workflow: 'Auto-Reorder Low Inventory', status: 'success', time: '2 minutes ago' },
              { workflow: 'Customer Onboarding', status: 'success', time: '5 minutes ago' },
              { workflow: 'Demand Forecasting', status: 'failed', time: '8 minutes ago' },
              { workflow: 'Order Processing', status: 'success', time: '12 minutes ago' },
              { workflow: 'Quality Control Alerts', status: 'success', time: '15 minutes ago' },
            ].map((activity, index) => (
              <div key={index} className="flex items-center justify-between py-2 border-b border-border last:border-0">
                <div className="flex items-center gap-3">
                  <span
                    className={`status-dot ${
                      activity.status === 'success' ? 'status-dot-success' : 'status-dot-danger'
                    }`}
                  ></span>
                  <span className="text-sm font-medium text-foreground">{activity.workflow}</span>
                </div>
                <span className="text-xs text-muted-foreground">{activity.time}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}

