import { useState, useEffect } from "react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import {
  Activity,
  TrendingUp,
  DollarSign,
  Bot,
  ArrowUp,
  ArrowDown,
  Clock,
  CheckCircle2,
  AlertCircle,
  Zap,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { brikkColors, chartColors } from "@/lib/palette";

// Mock data for charts
const requestsData = [
  { time: "00:00", requests: 245 },
  { time: "04:00", requests: 189 },
  { time: "08:00", requests: 567 },
  { time: "12:00", requests: 892 },
  { time: "16:00", requests: 1024 },
  { time: "20:00", requests: 678 },
];

const agentUsageData = [
  { name: "GPT-4", requests: 3421 },
  { name: "Claude", requests: 2847 },
  { name: "Mistral", requests: 1923 },
  { name: "Gemini", requests: 1456 },
  { name: "Llama", requests: 892 },
];

const recentEvents = [
  {
    id: 1,
    type: "success",
    agent: "Revenue Optimizer",
    message: "Workflow completed successfully",
    time: "2 minutes ago",
  },
  {
    id: 2,
    type: "warning",
    agent: "Inventory Monitor",
    message: "Low stock alert triggered",
    time: "5 minutes ago",
  },
  {
    id: 3,
    type: "success",
    agent: "Campaign Manager",
    message: "Ad budget optimized",
    time: "12 minutes ago",
  },
  {
    id: 4,
    type: "error",
    agent: "Data Sync",
    message: "API rate limit exceeded",
    time: "18 minutes ago",
  },
  {
    id: 5,
    type: "success",
    agent: "Customer Support",
    message: "Ticket auto-resolved",
    time: "23 minutes ago",
  },
];

interface KPICardProps {
  title: string;
  value: string;
  change: string;
  changeType: "positive" | "negative";
  icon: React.ElementType;
  iconColor: string;
}

function KPICard({
  title,
  value,
  change,
  changeType,
  icon: Icon,
  iconColor,
}: KPICardProps) {
  return (
    <div className="brikk-card">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-sm text-muted-foreground mb-1">{title}</p>
          <h3 className="text-3xl font-bold gradient-text mb-2">{value}</h3>
          <div className="flex items-center gap-1 text-sm">
            {changeType === "positive" ? (
              <>
                <ArrowUp className="h-4 w-4 text-[#A3FF12]" />
                <span className="text-[#A3FF12]">{change}</span>
              </>
            ) : (
              <>
                <ArrowDown className="h-4 w-4 text-[#FF6B6B]" />
                <span className="text-[#FF6B6B]">{change}</span>
              </>
            )}
            <span className="text-muted-foreground ml-1">vs last week</span>
          </div>
        </div>
        <div
          className="flex h-12 w-12 items-center justify-center rounded-xl"
          style={{ backgroundColor: `${iconColor}20` }}
        >
          <Icon className="h-6 w-6" style={{ color: iconColor }} />
        </div>
      </div>
    </div>
  );
}

export default function Overview() {
  const [healthStatus, setHealthStatus] = useState<"healthy" | "checking">(
    "checking"
  );

  useEffect(() => {
    // Check API health
    fetch("https://api.getbrikk.com/health")
      .then((res) => res.json())
      .then(() => setHealthStatus("healthy"))
      .catch(() => setHealthStatus("checking"));
  }, []);

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Overview</h1>
            <p className="text-muted-foreground mt-1">
              Real-time activity summary and system health
            </p>
          </div>
          <div className="flex items-center gap-3">
            {/* API Health Status */}
            <div className="flex items-center gap-2 rounded-lg border px-3 py-2">
              {healthStatus === "healthy" ? (
                <>
                  <span className="status-dot status-dot-success" />
                  <span className="text-sm font-medium">API Healthy</span>
                </>
              ) : (
                <>
                  <span className="status-dot status-dot-warning" />
                  <span className="text-sm font-medium">Checking...</span>
                </>
              )}
            </div>
            <Button className="btn-primary">
              <Zap className="h-4 w-4" />
              Launch Workflow
            </Button>
          </div>
        </div>

        {/* KPI Cards */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          <KPICard
            title="Requests Today"
            value="12,847"
            change="+23.4%"
            changeType="positive"
            icon={Activity}
            iconColor={brikkColors.blue}
          />
          <KPICard
            title="Success Rate"
            value="98.7%"
            change="+2.1%"
            changeType="positive"
            icon={CheckCircle2}
            iconColor={brikkColors.lime}
          />
          <KPICard
            title="Total Spend"
            value="$284.50"
            change="-12.3%"
            changeType="positive"
            icon={DollarSign}
            iconColor={brikkColors.cyan}
          />
          <KPICard
            title="Active Agents"
            value="47"
            change="+5"
            changeType="positive"
            icon={Bot}
            iconColor={brikkColors.violet}
          />
        </div>

        {/* Charts Row */}
        <div className="grid gap-6 lg:grid-cols-2">
          {/* Requests Chart */}
          <div className="brikk-card">
            <div className="mb-4">
              <h3 className="text-lg font-semibold">Requests Over Time</h3>
              <p className="text-sm text-muted-foreground">
                Last 24 hours activity
              </p>
            </div>
            <ResponsiveContainer width="100%" height={250}>
              <AreaChart data={requestsData}>
                <defs>
                  <linearGradient id="colorRequests" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={brikkColors.blue} stopOpacity={0.3} />
                    <stop offset="95%" stopColor={brikkColors.blue} stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                <XAxis
                  dataKey="time"
                  stroke="var(--text-muted)"
                  style={{ fontSize: "12px" }}
                />
                <YAxis
                  stroke="var(--text-muted)"
                  style={{ fontSize: "12px" }}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "var(--surface)",
                    border: "1px solid var(--border)",
                    borderRadius: "0.75rem",
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="requests"
                  stroke={brikkColors.blue}
                  strokeWidth={2}
                  fillOpacity={1}
                  fill="url(#colorRequests)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          {/* Agent Usage Chart */}
          <div className="brikk-card">
            <div className="mb-4">
              <h3 className="text-lg font-semibold">Usage by Agent</h3>
              <p className="text-sm text-muted-foreground">
                Top 5 agents this week
              </p>
            </div>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={agentUsageData}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                <XAxis
                  dataKey="name"
                  stroke="var(--text-muted)"
                  style={{ fontSize: "12px" }}
                />
                <YAxis
                  stroke="var(--text-muted)"
                  style={{ fontSize: "12px" }}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "var(--surface)",
                    border: "1px solid var(--border)",
                    borderRadius: "0.75rem",
                  }}
                />
                <Bar
                  dataKey="requests"
                  fill={brikkColors.cyan}
                  radius={[8, 8, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Recent Events Table */}
        <div className="brikk-card">
          <div className="mb-4 flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold">Recent Events</h3>
              <p className="text-sm text-muted-foreground">
                Latest workflow executions and alerts
              </p>
            </div>
            <Button variant="outline" size="sm">
              View All
            </Button>
          </div>
          <div className="space-y-3">
            {recentEvents.map((event) => (
              <div
                key={event.id}
                className="flex items-center gap-4 rounded-lg border border-border p-3 transition-colors hover:bg-accent"
              >
                {event.type === "success" && (
                  <CheckCircle2 className="h-5 w-5 flex-shrink-0 text-[#A3FF12]" />
                )}
                {event.type === "warning" && (
                  <AlertCircle className="h-5 w-5 flex-shrink-0 text-[#FF6B6B]" />
                )}
                {event.type === "error" && (
                  <AlertCircle className="h-5 w-5 flex-shrink-0 text-[#FF6B6B]" />
                )}
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-sm">{event.agent}</p>
                  <p className="text-sm text-muted-foreground truncate">
                    {event.message}
                  </p>
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Clock className="h-4 w-4" />
                  {event.time}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid gap-4 md:grid-cols-3">
          <Button variant="outline" className="h-auto flex-col gap-2 py-4">
            <TrendingUp className="h-6 w-6" />
            <span className="font-medium">View Analytics</span>
            <span className="text-xs text-muted-foreground">
              Detailed insights and reports
            </span>
          </Button>
          <Button variant="outline" className="h-auto flex-col gap-2 py-4">
            <Bot className="h-6 w-6" />
            <span className="font-medium">Manage Agents</span>
            <span className="text-xs text-muted-foreground">
              Configure and monitor agents
            </span>
          </Button>
          <Button variant="outline" className="h-auto flex-col gap-2 py-4">
            <DollarSign className="h-6 w-6" />
            <span className="font-medium">Billing Portal</span>
            <span className="text-xs text-muted-foreground">
              View usage and invoices
            </span>
          </Button>
        </div>
      </div>
    </DashboardLayout>
  );
}

