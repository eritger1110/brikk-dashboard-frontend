import { useState, useEffect } from "react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import {
  Activity,
  TrendingUp,
  DollarSign,
  Bot,
  Clock,
  CheckCircle2,
  AlertCircle,
  Zap,
  Loader2,
  AlertTriangle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { brikkColors } from "@/lib/palette";
import {
  getHealth,
  getUsageAggregate,
  getCostsByProvider,
  getAuditLogs,
  type HealthStatus,
  type UsageAggregate,
  type CostsByProvider,
} from "@/lib/api";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

interface KPICardProps {
  title: string;
  value: string;
  loading?: boolean;
  error?: boolean;
  icon: React.ElementType;
  iconColor: string;
  trend?: string;
}

function KPICard({
  title,
  value,
  loading,
  error,
  icon: Icon,
  iconColor,
  trend,
}: KPICardProps) {
  return (
    <div className="brikk-card">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-sm text-muted-foreground mb-1">{title}</p>
          {loading ? (
            <div className="flex items-center gap-2 h-9">
              <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
              <span className="text-sm text-muted-foreground">Loading...</span>
            </div>
          ) : error ? (
            <div className="flex items-center gap-2 h-9">
              <AlertTriangle className="h-5 w-5 text-[#FF6B6B]" />
              <span className="text-sm text-muted-foreground">Unavailable</span>
            </div>
          ) : (
            <>
              <h3 className="text-3xl font-bold gradient-text mb-2">{value}</h3>
              {trend && (
                <div className="text-xs text-muted-foreground">{trend}</div>
              )}
            </>
          )}
        </div>
        <div
          className="flex h-12 w-12 items-center justify-center rounded-lg flex-shrink-0"
          style={{ backgroundColor: `${iconColor}20` }}
        >
          <Icon className="h-6 w-6" style={{ color: iconColor }} />
        </div>
      </div>
    </div>
  );
}

export default function Overview() {
  const [healthStatus, setHealthStatus] = useState<HealthStatus | null>(null);
  const [usageData, setUsageData] = useState<UsageAggregate | null>(null);
  const [costsData, setCostsData] = useState<CostsByProvider | null>(null);
  const [loading, setLoading] = useState(true);
  const [errors, setErrors] = useState<Record<string, boolean>>({});

  useEffect(() => {
    loadDashboardData();
  }, []);

  async function loadDashboardData() {
    setLoading(true);
    const newErrors: Record<string, boolean> = {};

    // Load health status
    try {
      const health = await getHealth();
      setHealthStatus(health);
    } catch (error) {
      console.error("Failed to load health status:", error);
      newErrors.health = true;
    }

    // Load usage data
    try {
      const usage = await getUsageAggregate({
        range: "24h",
        granularity: "hour",
      });
      setUsageData(usage);
    } catch (error) {
      console.error("Failed to load usage data:", error);
      newErrors.usage = true;
    }

    // Load costs data
    try {
      const costs = await getCostsByProvider({
        range: "30d",
        granularity: "day",
      });
      setCostsData(costs);
    } catch (error) {
      console.error("Failed to load costs data:", error);
      newErrors.costs = true;
    }

    setErrors(newErrors);
    setLoading(false);
  }

  // Calculate KPI values from real data
  const totalRequests24h = usageData?.series
    .find((s) => s.metric === "requests")
    ?.points.reduce((sum, [, value]) => sum + value, 0) || 0;

  const totalErrors24h = usageData?.series
    .find((s) => s.metric === "errors")
    ?.points.reduce((sum, [, value]) => sum + value, 0) || 0;

  const successRate =
    totalRequests24h > 0
      ? (((totalRequests24h - totalErrors24h) / totalRequests24h) * 100).toFixed(1)
      : "0.0";

  const totalCost30d = costsData?.providers.reduce((sum, provider) => {
    const providerTotal = provider.points.reduce((s, [, value]) => s + value, 0);
    return sum + providerTotal;
  }, 0) || 0;

  const forecast30d = costsData?.forecast_30d || 0;

  // Prepare chart data
  const requestsChartData =
    usageData?.series
      .find((s) => s.metric === "requests")
      ?.points.map(([timestamp, value]) => ({
        time: new Date(timestamp).toLocaleTimeString("en-US", {
          hour: "2-digit",
          minute: "2-digit",
        }),
        requests: value,
      })) || [];

  const costsChartData =
    costsData?.providers[0]?.points.slice(-7).map(([timestamp, value]) => ({
      date: new Date(timestamp).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
      }),
      cost: value,
    })) || [];

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Overview</h1>
            <p className="text-muted-foreground mt-1">
              Real-time dashboard metrics and system health
            </p>
          </div>
          <Button className="btn-primary" onClick={loadDashboardData}>
            <Activity className="h-4 w-4" />
            Refresh
          </Button>
        </div>

        {/* Health Status Banner */}
        {healthStatus && (
          <div
            className="brikk-card border-2"
            style={{
              borderColor:
                healthStatus.status === "healthy"
                  ? brikkColors.lime
                  : brikkColors.coral,
            }}
          >
            <div className="flex items-center gap-3">
              {healthStatus.status === "healthy" ? (
                <CheckCircle2
                  className="h-6 w-6"
                  style={{ color: brikkColors.lime }}
                />
              ) : (
                <AlertCircle
                  className="h-6 w-6"
                  style={{ color: brikkColors.coral }}
                />
              )}
              <div>
                <h4 className="font-semibold">
                  System Status:{" "}
                  {healthStatus.status === "healthy" ? "Operational" : "Degraded"}
                </h4>
                <p className="text-sm text-muted-foreground">
                  Last checked: {new Date(healthStatus.timestamp).toLocaleString()}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* KPI Cards */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <KPICard
            title="Requests (24h)"
            value={totalRequests24h.toLocaleString()}
            loading={loading}
            error={errors.usage}
            icon={Activity}
            iconColor={brikkColors.blue}
            trend="Real-time data"
          />
          <KPICard
            title="Success Rate"
            value={`${successRate}%`}
            loading={loading}
            error={errors.usage}
            icon={CheckCircle2}
            iconColor={brikkColors.lime}
            trend="Last 24 hours"
          />
          <KPICard
            title="Total Cost (30d)"
            value={`$${totalCost30d.toFixed(2)}`}
            loading={loading}
            error={errors.costs}
            icon={DollarSign}
            iconColor={brikkColors.cyan}
            trend="Last 30 days"
          />
          <KPICard
            title="Forecast (30d)"
            value={`$${forecast30d.toFixed(2)}`}
            loading={loading}
            error={errors.costs}
            icon={TrendingUp}
            iconColor={brikkColors.violet}
            trend="Projected spend"
          />
        </div>

        {/* Charts */}
        <div className="grid gap-6 lg:grid-cols-2">
          {/* Requests Over Time */}
          <div className="brikk-card">
            <div className="mb-4">
              <h3 className="text-lg font-semibold">Requests Over Time</h3>
              <p className="text-sm text-muted-foreground">
                Last 24 hours, hourly granularity
              </p>
            </div>
            {loading ? (
              <div className="flex items-center justify-center h-64">
                <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
              </div>
            ) : errors.usage || requestsChartData.length === 0 ? (
              <div className="flex items-center justify-center h-64 border-2 border-dashed rounded-lg">
                <div className="text-center">
                  <Activity className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
                  <p className="text-sm text-muted-foreground">
                    {errors.usage ? "Failed to load data" : "No data available"}
                  </p>
                </div>
              </div>
            ) : (
              <ResponsiveContainer width="100%" height={250}>
                <AreaChart data={requestsChartData}>
                  <defs>
                    <linearGradient id="requestsGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor={brikkColors.blue} stopOpacity={0.3} />
                      <stop offset="95%" stopColor={brikkColors.blue} stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <XAxis
                    dataKey="time"
                    stroke="#6B7280"
                    fontSize={12}
                    tickLine={false}
                  />
                  <YAxis stroke="#6B7280" fontSize={12} tickLine={false} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#16181E",
                      border: "1px solid #1F2229",
                      borderRadius: "8px",
                    }}
                  />
                  <Area
                    type="monotone"
                    dataKey="requests"
                    stroke={brikkColors.blue}
                    strokeWidth={2}
                    fill="url(#requestsGradient)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            )}
          </div>

          {/* Cost Over Time */}
          <div className="brikk-card">
            <div className="mb-4">
              <h3 className="text-lg font-semibold">Daily Cost (Last 7 Days)</h3>
              <p className="text-sm text-muted-foreground">
                Provider costs breakdown
              </p>
            </div>
            {loading ? (
              <div className="flex items-center justify-center h-64">
                <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
              </div>
            ) : errors.costs || costsChartData.length === 0 ? (
              <div className="flex items-center justify-center h-64 border-2 border-dashed rounded-lg">
                <div className="text-center">
                  <DollarSign className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
                  <p className="text-sm text-muted-foreground">
                    {errors.costs ? "Failed to load data" : "No data available"}
                  </p>
                </div>
              </div>
            ) : (
              <ResponsiveContainer width="100%" height={250}>
                <BarChart data={costsChartData}>
                  <XAxis
                    dataKey="date"
                    stroke="#6B7280"
                    fontSize={12}
                    tickLine={false}
                  />
                  <YAxis stroke="#6B7280" fontSize={12} tickLine={false} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#16181E",
                      border: "1px solid #1F2229",
                      borderRadius: "8px",
                    }}
                    formatter={(value: number) => `$${value.toFixed(2)}`}
                  />
                  <Bar dataKey="cost" fill={brikkColors.cyan} radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="brikk-card">
          <div className="mb-4">
            <h3 className="text-lg font-semibold">Quick Actions</h3>
            <p className="text-sm text-muted-foreground">
              Common tasks and shortcuts
            </p>
          </div>
          <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-4">
            <Button variant="outline" className="justify-start" asChild>
              <a href="/agents">
                <Bot className="h-4 w-4 mr-2" />
                Manage Agents
              </a>
            </Button>
            <Button variant="outline" className="justify-start" asChild>
              <a href="/workflows">
                <Zap className="h-4 w-4 mr-2" />
                Create Workflow
              </a>
            </Button>
            <Button variant="outline" className="justify-start" asChild>
              <a href="/developer">
                <Activity className="h-4 w-4 mr-2" />
                API Explorer
              </a>
            </Button>
            <Button variant="outline" className="justify-start" asChild>
              <a href="/analytics">
                <TrendingUp className="h-4 w-4 mr-2" />
                View Analytics
              </a>
            </Button>
          </div>
        </div>

        {/* API Integration Status */}
        <div className="brikk-card border-2 border-dashed">
          <div className="flex items-start gap-4">
            <div
              className="flex h-10 w-10 items-center justify-center rounded-lg flex-shrink-0"
              style={{ backgroundColor: `${brikkColors.blue}20` }}
            >
              <CheckCircle2 className="h-5 w-5" style={{ color: brikkColors.blue }} />
            </div>
            <div className="flex-1">
              <h4 className="font-semibold mb-2">Real API Integration Active</h4>
              <p className="text-sm text-muted-foreground mb-3">
                Dashboard is now connected to the Railway backend at{" "}
                <code className="px-1 py-0.5 rounded bg-accent">
                  https://brikk-production-9913.up.railway.app
                </code>
                . All metrics shown above are fetched in real-time from your production API.
              </p>
              <div className="text-sm space-y-1">
                <p className="font-medium">✅ Active Endpoints:</p>
                <ul className="list-disc list-inside text-muted-foreground ml-2 space-y-1">
                  <li>/health - System health monitoring</li>
                  <li>/v1/usage/aggregate - Request metrics</li>
                  <li>/v1/costs/by-provider - Cost tracking</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}

