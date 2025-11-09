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
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { brikkColors } from "@/lib/palette";
import { getHealthStatus, type HealthStatus } from "@/lib/apiService";

interface KPICardProps {
  title: string;
  value: string;
  loading?: boolean;
  icon: React.ElementType;
  iconColor: string;
}

function KPICard({
  title,
  value,
  loading,
  icon: Icon,
  iconColor,
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
          ) : (
            <>
              <h3 className="text-3xl font-bold gradient-text mb-2">{value}</h3>
              <div className="text-xs text-muted-foreground">
                Real-time data
              </div>
            </>
          )}
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
  const [healthStatus, setHealthStatus] = useState<HealthStatus | null>(null);
  const [healthLoading, setHealthLoading] = useState(true);
  const [healthError, setHealthError] = useState<string | null>(null);

  useEffect(() => {
    // Check API health
    getHealthStatus()
      .then((status) => {
        setHealthStatus(status);
        setHealthLoading(false);
      })
      .catch((error) => {
        setHealthError(error.message);
        setHealthLoading(false);
      });
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
              {healthLoading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
                  <span className="text-sm font-medium">Checking...</span>
                </>
              ) : healthError ? (
                <>
                  <span className="status-dot status-dot-danger" />
                  <span className="text-sm font-medium">API Error</span>
                </>
              ) : healthStatus?.status === "operational" ? (
                <>
                  <span className="status-dot status-dot-success" />
                  <span className="text-sm font-medium">API Healthy</span>
                </>
              ) : (
                <>
                  <span className="status-dot status-dot-warning" />
                  <span className="text-sm font-medium">API Degraded</span>
                </>
              )}
            </div>
            <Button className="btn-primary">
              <Zap className="h-4 w-4" />
              Launch Workflow
            </Button>
          </div>
        </div>

        {/* KPI Cards - Awaiting Real Data */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          <KPICard
            title="Requests Today"
            value="—"
            loading={true}
            icon={Activity}
            iconColor={brikkColors.blue}
          />
          <KPICard
            title="Success Rate"
            value="—"
            loading={true}
            icon={CheckCircle2}
            iconColor={brikkColors.lime}
          />
          <KPICard
            title="Total Spend"
            value="—"
            loading={true}
            icon={DollarSign}
            iconColor={brikkColors.cyan}
          />
          <KPICard
            title="Active Agents"
            value="—"
            loading={true}
            icon={Bot}
            iconColor={brikkColors.violet}
          />
        </div>

        {/* API Configuration Notice */}
        <div className="brikk-card border-2 border-dashed">
          <div className="flex items-start gap-4">
            <div
              className="flex h-12 w-12 items-center justify-center rounded-xl flex-shrink-0"
              style={{ backgroundColor: `${brikkColors.cyan}20` }}
            >
              <AlertCircle className="h-6 w-6" style={{ color: brikkColors.cyan }} />
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-lg mb-2">
                Dashboard Ready - API Configuration Needed
              </h3>
              <p className="text-muted-foreground mb-4">
                The dashboard UI is complete and ready to display real-time data. To populate the metrics, charts, and tables, we need the API endpoint documentation.
              </p>
              <div className="space-y-2 text-sm">
                <p className="font-medium">✅ What's Working:</p>
                <ul className="list-disc list-inside text-muted-foreground space-y-1 ml-2">
                  <li>API Health Check: <code className="text-xs bg-accent px-1 py-0.5 rounded">GET /health</code> ✓</li>
                  <li>Auth0 Authentication ✓</li>
                  <li>Complete UI with loading states ✓</li>
                </ul>
                <p className="font-medium mt-4">📋 What's Needed:</p>
                <ul className="list-disc list-inside text-muted-foreground space-y-1 ml-2">
                  <li>API documentation or endpoint list</li>
                  <li>Authentication method for API calls (Bearer token? API key?)</li>
                  <li>Sample response payloads</li>
                </ul>
              </div>
              <div className="mt-4 flex items-center gap-3">
                <Button variant="outline" size="sm" asChild>
                  <a href="/API_QUESTIONS.md" target="_blank" rel="noopener noreferrer">
                    <AlertCircle className="h-4 w-4 mr-2" />
                    View API Questions
                  </a>
                </Button>
                <span className="text-xs text-muted-foreground">
                  See API_QUESTIONS.md in project root for details
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Charts Placeholder */}
        <div className="grid gap-6 lg:grid-cols-2">
          {/* Requests Chart Placeholder */}
          <div className="brikk-card">
            <div className="mb-4">
              <h3 className="text-lg font-semibold">Requests Over Time</h3>
              <p className="text-sm text-muted-foreground">
                Last 24 hours activity
              </p>
            </div>
            <div className="flex items-center justify-center h-64 border-2 border-dashed rounded-lg">
              <div className="text-center">
                <Loader2 className="h-8 w-8 animate-spin mx-auto mb-3 text-muted-foreground" />
                <p className="text-sm text-muted-foreground">
                  Awaiting API endpoint for time-series data
                </p>
              </div>
            </div>
          </div>

          {/* Agent Usage Chart Placeholder */}
          <div className="brikk-card">
            <div className="mb-4">
              <h3 className="text-lg font-semibold">Usage by Agent</h3>
              <p className="text-sm text-muted-foreground">
                Top 5 agents this week
              </p>
            </div>
            <div className="flex items-center justify-center h-64 border-2 border-dashed rounded-lg">
              <div className="text-center">
                <Loader2 className="h-8 w-8 animate-spin mx-auto mb-3 text-muted-foreground" />
                <p className="text-sm text-muted-foreground">
                  Awaiting API endpoint for agent usage data
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Recent Events Placeholder */}
        <div className="brikk-card">
          <div className="mb-4 flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold">Recent Events</h3>
              <p className="text-sm text-muted-foreground">
                Latest workflow executions and alerts
              </p>
            </div>
            <Button variant="outline" size="sm" disabled>
              View All
            </Button>
          </div>
          <div className="flex items-center justify-center py-12 border-2 border-dashed rounded-lg">
            <div className="text-center">
              <Clock className="h-8 w-8 mx-auto mb-3 text-muted-foreground" />
              <p className="text-sm text-muted-foreground">
                No events to display yet
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                Events will appear here once API is configured
              </p>
            </div>
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

