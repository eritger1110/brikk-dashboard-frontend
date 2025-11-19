import DashboardLayout from '@/components/layout/DashboardLayout';
import { Clock, AlertTriangle, TrendingUp, DollarSign, CheckCircle2, XCircle } from 'lucide-react';
import { LineChart, Line, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';

const executionData = [
  { time: '00:00', executions: 120, latency: 2.1 },
  { time: '04:00', executions: 95, latency: 2.3 },
  { time: '08:00', executions: 180, latency: 2.8 },
  { time: '12:00', executions: 240, latency: 2.9 },
  { time: '16:00', executions: 210, latency: 3.1 },
  { time: '20:00', executions: 150, latency: 2.6 },
  { time: '24:00', executions: 190, latency: 2.4 },
];

interface MetricCardProps {
  title: string;
  value: string;
  icon: React.ReactNode;
  trend?: string;
}

function MetricCard({ title, value, icon, trend }: MetricCardProps) {
  return (
    <div className="rounded-lg border border-border bg-card p-4">
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium text-muted-foreground">{title}</p>
          <p className="mt-2 text-2xl font-bold text-foreground">{value}</p>
          {trend && (
            <p className="mt-1 text-xs text-muted-foreground">{trend}</p>
          )}
        </div>
        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
          {icon}
        </div>
      </div>
    </div>
  );
}

interface IntegrationCardProps {
  name: string;
  status: 'operational' | 'degraded' | 'disrupted';
  latency: string;
  calls: string;
  logo?: string;
}

function IntegrationCard({ name, status, latency, calls }: IntegrationCardProps) {
  const statusConfig = {
    operational: {
      badge: 'badge-success',
      label: 'Operational',
      icon: <CheckCircle2 className="h-4 w-4" />,
    },
    degraded: {
      badge: 'badge-warning',
      label: 'Degraded',
      icon: <AlertTriangle className="h-4 w-4" />,
    },
    disrupted: {
      badge: 'badge-danger',
      label: 'Disrupted',
      icon: <XCircle className="h-4 w-4" />,
    },
  };

  const config = statusConfig[status];

  return (
    <div className="rounded-lg border border-border bg-card p-4">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-semibold text-foreground">{name}</h3>
        <span className={`${config.badge} flex items-center gap-1`}>
          {config.icon}
          {config.label}
        </span>
      </div>
      <div className="space-y-2">
        <div className="flex justify-between text-xs">
          <span className="text-muted-foreground">Latency</span>
          <span className="font-medium text-foreground">{latency}</span>
        </div>
        <div className="flex justify-between text-xs">
          <span className="text-muted-foreground">Calls (24h)</span>
          <span className="font-medium text-foreground">{calls}</span>
        </div>
      </div>
    </div>
  );
}

interface AlertCardProps {
  title: string;
  message: string;
  severity: 'critical' | 'warning' | 'info';
  time: string;
}

function AlertCard({ title, message, severity, time }: AlertCardProps) {
  const severityConfig = {
    critical: 'border-l-danger',
    warning: 'border-l-warning',
    info: 'border-l-primary',
  };

  return (
    <div className={`rounded-lg border border-border ${severityConfig[severity]} border-l-4 bg-card p-4`}>
      <div className="flex items-start justify-between mb-2">
        <h4 className="text-sm font-semibold text-foreground">{title}</h4>
        <span className="text-xs text-muted-foreground">{time}</span>
      </div>
      <p className="text-sm text-muted-foreground">{message}</p>
      <div className="mt-3 flex gap-2">
        <button className="text-xs font-medium text-primary hover:underline">
          Acknowledge
        </button>
        <button className="text-xs font-medium text-primary hover:underline">
          View Details
        </button>
      </div>
    </div>
  );
}

export default function Monitoring() {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Page header */}
        <div>
          <h1 className="text-3xl font-bold text-foreground">Monitoring & Alerts</h1>
          <p className="mt-2 text-muted-foreground">
            Real-time metrics and system health monitoring
          </p>
        </div>

        {/* Time range selector */}
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium text-foreground">Time Range:</span>
          <div className="flex gap-1">
            {['Last hour', '24 hours', '7 days', '30 days'].map((range) => (
              <button
                key={range}
                className={`rounded-lg px-3 py-1 text-sm font-medium transition-colors ${
                  range === '24 hours'
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-secondary text-secondary-foreground hover:bg-accent'
                }`}
              >
                {range}
              </button>
            ))}
          </div>
        </div>

        {/* Key Metrics */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <MetricCard
            title="Average Latency"
            value="2.9s"
            icon={<Clock className="h-5 w-5 text-primary" />}
            trend="+0.3s from baseline"
          />
          <MetricCard
            title="Error Rate"
            value="1.2%"
            icon={<AlertTriangle className="h-5 w-5 text-primary" />}
            trend="Within normal range"
          />
          <MetricCard
            title="Fallback Frequency"
            value="3.4%"
            icon={<TrendingUp className="h-5 w-5 text-primary" />}
            trend="Slightly elevated"
          />
          <MetricCard
            title="Total Cost (24h)"
            value="$28.50"
            icon={<DollarSign className="h-5 w-5 text-primary" />}
            trend="On track for budget"
          />
        </div>

        {/* Charts */}
        <div className="grid gap-6 lg:grid-cols-2">
          {/* Execution Volume Chart */}
          <div className="rounded-lg border border-border bg-card p-6">
            <h2 className="text-lg font-semibold text-foreground mb-4">Execution Volume</h2>
            <ResponsiveContainer width="100%" height={250}>
              <AreaChart data={executionData}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                <XAxis dataKey="time" className="text-xs" />
                <YAxis className="text-xs" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'hsl(var(--card))',
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '8px',
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="executions"
                  stroke="hsl(var(--primary))"
                  fill="hsl(var(--primary) / 0.2)"
                  strokeWidth={2}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          {/* Latency Chart */}
          <div className="rounded-lg border border-border bg-card p-6">
            <h2 className="text-lg font-semibold text-foreground mb-4">Average Latency</h2>
            <ResponsiveContainer width="100%" height={250}>
              <LineChart data={executionData}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                <XAxis dataKey="time" className="text-xs" />
                <YAxis className="text-xs" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'hsl(var(--card))',
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '8px',
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="latency"
                  stroke="hsl(var(--chart-3))"
                  strokeWidth={2}
                  dot={{ fill: 'hsl(var(--chart-3))' }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Integration Health */}
        <div>
          <h2 className="text-xl font-semibold text-foreground mb-4">Integration Health</h2>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <IntegrationCard
              name="OpenAI"
              status="operational"
              latency="1.8s avg"
              calls="9,231"
            />
            <IntegrationCard
              name="Slack"
              status="degraded"
              latency="3.2s avg ↑ 2.3s"
              calls="9,700"
            />
            <IntegrationCard
              name="Salesforce"
              status="operational"
              latency="2.1s avg"
              calls="5,432"
            />
            <IntegrationCard
              name="SAP"
              status="operational"
              latency="1.5s avg"
              calls="12,456"
            />
            <IntegrationCard
              name="Mistral AI"
              status="operational"
              latency="2.9s avg"
              calls="342"
            />
            <IntegrationCard
              name="Snowflake"
              status="operational"
              latency="1.2s avg"
              calls="8,123"
            />
          </div>
        </div>

        {/* Active Alerts */}
        <div>
          <h2 className="text-xl font-semibold text-foreground mb-4">Active Alerts</h2>
          <div className="space-y-3">
            <AlertCard
              title="High Error Rate"
              message="Workflow 'Demand Forecasting' experiencing elevated error rate (15.3%). Mistral AI API returning timeout errors."
              severity="critical"
              time="2m ago"
            />
            <AlertCard
              title="Elevated Latency"
              message="Slack integration showing increased latency (3.2s avg, up from 0.9s baseline). May impact real-time notifications."
              severity="warning"
              time="10m ago"
            />
            <AlertCard
              title="New Integration Added"
              message="BigQuery connector successfully configured and ready for use in BrikkFlows."
              severity="info"
              time="1h ago"
            />
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}

