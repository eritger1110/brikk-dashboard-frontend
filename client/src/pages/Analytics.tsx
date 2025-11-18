import { useState, useEffect } from "react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import {
  TrendingUp,
  AlertTriangle,
  Clock,
  Activity,
  Loader2,
  RefreshCw,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { brikkColors } from "@/lib/palette";
import { useApi } from "@/hooks/useApi";
import type {
  TopAgent,
  TopError,
  LatencyMetrics,
} from "@/types/api";
import {
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  Bar,
  BarChart,
} from "recharts";
import { toast } from "sonner";

export default function Analytics() {
  const api = useApi();
  const [topAgents, setTopAgents] = useState<TopAgent[]>([]);
  const [topErrors, setTopErrors] = useState<TopError[]>([]);
  const [latencyMetrics, setLatencyMetrics] = useState<LatencyMetrics | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [timeRange, setTimeRange] = useState("7d");

  useEffect(() => {
    loadAnalytics();
  }, [timeRange]);

  async function loadAnalytics() {
    setLoading(true);
    setError(null);

    try {
      const [agentsData, errorsData, latencyData] = await Promise.all([
        api.getTopAgents({ range: timeRange }).catch(() => ({ data: [] })),
        api.getTopErrors({ range: timeRange }).catch(() => ({ data: [] })),
        api.getLatencyMetrics({ range: timeRange, granularity: "hour" }).catch(() => null),
      ]);

      setTopAgents(agentsData.data);
      setTopErrors(errorsData.data);
      setLatencyMetrics(latencyData);
    } catch (err) {
      console.error("Failed to load analytics:", err);
      setError("Failed to load analytics data");
      toast.error("Failed to load analytics");
    } finally {
      setLoading(false);
    }
  }

  // Prepare latency chart data
  const latencyChartData =
    latencyMetrics?.series[0]?.points.map(([timestamp, value], index) => ({
      time: new Date(timestamp).toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
      }),
      p50: value,
      p95: latencyMetrics.series[1]?.points[index]?.[1] || 0,
    })) || [];

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Analytics & Insights</h1>
            <p className="text-muted-foreground mt-1">
              Performance metrics, error analysis, and trends
            </p>
          </div>
          <div className="flex items-center gap-2">
            <select
              value={timeRange}
              onChange={(e) => setTimeRange(e.target.value)}
              className="px-3 py-2 rounded-lg border border-border bg-background text-sm"
            >
              <option value="24h">Last 24 Hours</option>
              <option value="7d">Last 7 Days</option>
              <option value="30d">Last 30 Days</option>
            </select>
            <Button variant="outline" onClick={loadAnalytics}>
              <RefreshCw className="h-4 w-4" />
              Refresh
            </Button>
          </div>
        </div>

        {/* Top Agents */}
        <div className="brikk-card">
          <div className="mb-4 flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold">Top Performing Agents</h3>
              <p className="text-sm text-muted-foreground">
                Ranked by request volume and success rate
              </p>
            </div>
            <Activity className="h-5 w-5" style={{ color: brikkColors.blue }} />
          </div>

          {loading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
          ) : topAgents.length === 0 ? (
            <div className="flex items-center justify-center py-12 border-2 border-dashed rounded-lg">
              <div className="text-center">
                <Activity className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
                <p className="text-sm text-muted-foreground">
                  No agent data available for this time range
                </p>
              </div>
            </div>
          ) : (
            <div className="space-y-3">
              {topAgents.map((agent, index) => (
                <div
                  key={agent.id}
                  className="flex items-center gap-4 p-3 rounded-lg border border-border hover:bg-accent/50"
                >
                  <div
                    className="flex h-10 w-10 items-center justify-center rounded-lg font-bold"
                    style={{
                      backgroundColor: `${brikkColors.blue}20`,
                      color: brikkColors.blue,
                    }}
                  >
                    #{index + 1}
                  </div>
                  <div className="flex-1">
                    <div className="font-medium">{agent.name}</div>
                    <div className="text-xs text-muted-foreground">
                      {agent.requests.toLocaleString()} requests
                    </div>
                  </div>
                  <div className="text-right">
                    <div
                      className="text-lg font-bold"
                      style={{ color: brikkColors.lime }}
                    >
                      {(agent.success_rate * 100).toFixed(1)}%
                    </div>
                    <div className="text-xs text-muted-foreground">Success Rate</div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Latency Metrics */}
        <div className="brikk-card">
          <div className="mb-4 flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold">Latency Distribution</h3>
              <p className="text-sm text-muted-foreground">
                P50 and P95 latency over time
              </p>
            </div>
            <Clock className="h-5 w-5" style={{ color: brikkColors.cyan }} />
          </div>

          {loading ? (
            <div className="flex items-center justify-center h-64">
              <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
          ) : !latencyMetrics || latencyChartData.length === 0 ? (
            <div className="flex items-center justify-center h-64 border-2 border-dashed rounded-lg">
              <div className="text-center">
                <Clock className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
                <p className="text-sm text-muted-foreground">
                  No latency data available for this time range
                </p>
              </div>
            </div>
          ) : (
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={latencyChartData}>
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
                  formatter={(value: number) => `${value.toFixed(0)}ms`}
                />
                <Line
                  type="monotone"
                  dataKey="p50"
                  stroke={brikkColors.cyan}
                  strokeWidth={2}
                  dot={false}
                  name="P50 Latency"
                />
                <Line
                  type="monotone"
                  dataKey="p95"
                  stroke={brikkColors.violet}
                  strokeWidth={2}
                  dot={false}
                  name="P95 Latency"
                />
              </LineChart>
            </ResponsiveContainer>
          )}

          {latencyMetrics && latencyChartData.length > 0 && (
            <div className="mt-4 grid gap-3 md:grid-cols-2">
              <div className="p-3 rounded-lg border border-border">
                <div className="text-xs text-muted-foreground mb-1">P50 Latency</div>
                <div className="text-2xl font-bold" style={{ color: brikkColors.cyan }}>
                  {latencyChartData[latencyChartData.length - 1]?.p50.toFixed(0)}ms
                </div>
              </div>
              <div className="p-3 rounded-lg border border-border">
                <div className="text-xs text-muted-foreground mb-1">P95 Latency</div>
                <div className="text-2xl font-bold" style={{ color: brikkColors.violet }}>
                  {latencyChartData[latencyChartData.length - 1]?.p95.toFixed(0)}ms
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Top Errors */}
        <div className="brikk-card">
          <div className="mb-4 flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold">Top Errors</h3>
              <p className="text-sm text-muted-foreground">
                Most frequent error types and recent samples
              </p>
            </div>
            <AlertTriangle className="h-5 w-5" style={{ color: brikkColors.coral }} />
          </div>

          {loading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
          ) : topErrors.length === 0 ? (
            <div className="flex items-center justify-center py-12 border-2 border-dashed rounded-lg">
              <div className="text-center">
                <AlertTriangle className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
                <p className="text-sm text-muted-foreground">
                  No errors recorded for this time range
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  Great job! Your system is running smoothly.
                </p>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              {topErrors.map((error, index) => (
                <div
                  key={index}
                  className="p-4 rounded-lg border border-border"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <div className="font-medium text-[#FF6B6B]">
                        {error.error_type}
                      </div>
                      <div className="text-sm text-muted-foreground mt-1">
                        {error.count} occurrences
                      </div>
                    </div>
                    <div
                      className="px-3 py-1 rounded-full text-xs font-medium"
                      style={{
                        backgroundColor: `${brikkColors.coral}20`,
                        color: brikkColors.coral,
                      }}
                    >
                      {error.count}
                    </div>
                  </div>

                  {error.recent_samples.length > 0 && (
                    <div className="space-y-2">
                      <div className="text-xs font-medium text-muted-foreground">
                        Recent Samples:
                      </div>
                      {error.recent_samples.slice(0, 2).map((sample: any, sampleIndex: number) => (
                        <div
                          key={sampleIndex}
                          className="p-2 rounded bg-accent/50 text-xs"
                        >
                          <div className="font-mono text-muted-foreground mb-1">
                            {sample.message}
                          </div>
                          <div className="flex items-center gap-2 text-muted-foreground">
                            <span>
                              {new Date(sample.timestamp).toLocaleString()}
                            </span>
                            {sample.agent_id && (
                              <span className="px-2 py-0.5 rounded bg-accent">
                                {sample.agent_id}
                              </span>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* API Integration Status */}
        <div className="brikk-card border-2 border-dashed">
          <div className="flex items-start gap-4">
            <div
              className="flex h-10 w-10 items-center justify-center rounded-lg flex-shrink-0"
              style={{ backgroundColor: `${brikkColors.violet}20` }}
            >
              <TrendingUp className="h-5 w-5" style={{ color: brikkColors.violet }} />
            </div>
            <div className="flex-1">
              <h4 className="font-semibold mb-2">Analytics Module Active</h4>
              <p className="text-sm text-muted-foreground mb-3">
                Real-time analytics data is being fetched from the Railway backend. The
                dashboard displays top performing agents, latency distributions (P50/P95),
                and error analysis with recent samples.
              </p>
              <div className="text-sm space-y-1">
                <p className="font-medium">📊 Active Endpoints:</p>
                <ul className="list-disc list-inside text-muted-foreground ml-2 space-y-1">
                  <li>/v1/analytics/top-agents - Agent performance rankings</li>
                  <li>/v1/analytics/latency - P50/P95 latency metrics</li>
                  <li>/v1/analytics/top-errors - Error frequency and samples</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}

