import { useEffect, useState } from 'react';
import { Link } from 'wouter';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Activity,
  TrendingUp,
  TrendingDown,
  DollarSign,
  Zap,
  Bot,
  GitBranch,
  AlertTriangle,
  CheckCircle,
  Clock,
  ArrowRight,
  RefreshCw,
} from 'lucide-react';
import { useApi } from '@/hooks/useApi';
import { useDemoMode } from '@/contexts/DemoModeContext';
import type { Agent, Flow } from '@/types/api';
import SkeletonLoader from '@/components/SkeletonLoader';
import EmptyState from '@/components/EmptyState';

interface DashboardStats {
  totalAgents: number;
  activeAgents: number;
  totalWorkflows: number;
  activeWorkflows: number;
  totalExecutions: number;
  successRate: number;
  totalCost: number;
  costTrend: number;
}

export default function Overview() {
  const api = useApi();
  const { isDemoMode } = useDemoMode();
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [recentAgents, setRecentAgents] = useState<Agent[]>([]);
  const [recentWorkflows, setRecentWorkflows] = useState<Flow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadDashboardData = async () => {
    setLoading(true);
    setError(null);

    try {
      // Load agents
      const agentsResponse = await api.getAgents({ limit: 5 });
      const agents = agentsResponse.data || [];
      setRecentAgents(agents);

      // Load workflows
      const workflowsResponse = await api.getFlows({ limit: 5 });
      const workflows = workflowsResponse.data || [];
      setRecentWorkflows(workflows);

      // Calculate stats
      const activeAgents = agents.filter(a => a.status === 'active').length;
      const activeWorkflows = workflows.filter(w => w.published).length;

      // Load usage data for the last 24 hours
      const usageData = await api.getUsageAggregate({
        range: '24h',
        granularity: 'hour',
      });

      // Load cost data for the last 30 days
      const costData = await api.getCostsByProvider({
        range: '30d',
        granularity: 'day',
      });

      // Calculate totals from usage data
      let totalExecutions = 0;
      let successfulExecutions = 0;

      if (usageData.series && usageData.series.length > 0) {
        usageData.series.forEach(series => {
          series.points.forEach(point => {
            const [timestamp, value] = point;
            if (series.metric === 'requests') {
              totalExecutions += value;
            } else if (series.metric === 'success') {
              successfulExecutions += value;
            }
          });
        });
      }

      const successRate = totalExecutions > 0 
        ? (successfulExecutions / totalExecutions) * 100 
        : 0;

      // Calculate total cost from providers
      let totalCost = 0;
      if (costData.providers && costData.providers.length > 0) {
        costData.providers.forEach(provider => {
          // Sum up all points in the series
          provider.points.forEach(point => {
            const [timestamp, value] = point;
            totalCost += value;
          });
        });
      }

      // Calculate cost trend (compare last 7 days vs previous 7 days)
      const costTrend = -5.2; // TODO: Calculate from actual data

      setStats({
        totalAgents: agents.length,
        activeAgents,
        totalWorkflows: workflows.length,
        activeWorkflows,
        totalExecutions,
        successRate: Math.round(successRate * 10) / 10,
        totalCost: Math.round(totalCost * 100) / 100,
        costTrend,
      });

    } catch (err: any) {
      console.error('Failed to load dashboard data:', err);
      setError(err.message || 'Failed to load dashboard data');
      
      // Set demo data if in demo mode
      if (isDemoMode) {
        setStats({
          totalAgents: 12,
          activeAgents: 10,
          totalWorkflows: 8,
          activeWorkflows: 6,
          totalExecutions: 15420,
          successRate: 94.2,
          totalCost: 665.43,
          costTrend: -12.3,
        });
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDashboardData();
  }, []);

  const MetricCard = ({ 
    title, 
    value, 
    change, 
    trend, 
    icon: Icon,
    href 
  }: { 
    title: string;
    value: string | number;
    change?: string;
    trend?: 'up' | 'down';
    icon: any;
    href?: string;
  }) => (
    <Card className="p-6 hover:shadow-lg transition-shadow">
      <div className="flex items-start justify-between mb-4">
        <div className="p-3 rounded-lg bg-primary/10">
          <Icon className="w-6 h-6 text-primary" />
        </div>
        {change && (
          <div className={`flex items-center gap-1 text-sm font-medium ${
            trend === 'up' ? 'text-green-500' : 'text-red-500'
          }`}>
            {trend === 'up' ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
            {change}
          </div>
        )}
      </div>
      <div className="space-y-1">
        <p className="text-sm text-muted-foreground">{title}</p>
        <p className="text-3xl font-bold">{value}</p>
      </div>
      {href && (
        <Link href={href}>
          <Button variant="ghost" size="sm" className="mt-4 w-full">
            View Details <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </Link>
      )}
    </Card>
  );

  if (loading) {
    return (
      <DashboardLayout>
        <div className="container mx-auto py-8">
          {/* Loading State - Premium Skeleton Loaders */}
          <div className="space-y-6" role="status" aria-live="polite">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <SkeletonLoader type="metric" count={4} />
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <SkeletonLoader type="card" count={2} />
            </div>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  if (error && !isDemoMode) {
    return (
      <DashboardLayout>
        <div className="container mx-auto py-8">
          <Card className="p-8 text-center">
            <AlertTriangle className="w-12 h-12 text-destructive mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">Failed to Load Dashboard</h3>
            <p className="text-muted-foreground mb-4">{error}</p>
            <Button onClick={loadDashboardData}>
              <RefreshCw className="w-4 h-4 mr-2" />
              Retry
            </Button>
          </Card>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      {/* Skip to main content link for accessibility */}
      <a href="#main-content" className="skip-to-main">
        Skip to main content
      </a>
      <div id="main-content" className="container mx-auto py-8 space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-[#0057FF] to-[#00C2FF] bg-clip-text text-transparent">
              Dashboard Overview
            </h1>
            <p className="text-muted-foreground mt-1">
              Monitor your AI agents and workflows in real-time
            </p>
          </div>
          <Button onClick={loadDashboardData} variant="outline">
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
                Demo Mode Active - Showing sample data
              </p>
            </div>
          </Card>
        )}

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <MetricCard
            title="Active Agents"
            value={stats?.activeAgents || 0}
            change={`${stats?.totalAgents || 0} total`}
            icon={Bot}
            href="/agents"
          />
          <MetricCard
            title="Active Workflows"
            value={stats?.activeWorkflows || 0}
            change={`${stats?.totalWorkflows || 0} total`}
            icon={GitBranch}
            href="/workflows"
          />
          <MetricCard
            title="Executions (24h)"
            value={(stats?.totalExecutions || 0).toLocaleString()}
            change={`${stats?.successRate || 0}% success`}
            trend="up"
            icon={Zap}
            href="/analytics"
          />
          <MetricCard
            title="Monthly Cost"
            value={`$${(stats?.totalCost || 0).toFixed(2)}`}
            change={`${stats?.costTrend || 0}%`}
            trend={stats && stats.costTrend < 0 ? 'down' : 'up'}
            icon={DollarSign}
            href="/billing"
          />
        </div>

        {/* Recent Activity */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Recent Agents */}
          <Card className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">Recent Agents</h3>
              <Link href="/agents">
                <Button variant="ghost" size="sm">
                  View All <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </Link>
            </div>
            <div className="space-y-3">
              {recentAgents.length === 0 ? (
                <p className="text-sm text-muted-foreground text-center py-8">
                  No agents yet. Create your first agent to get started.
                </p>
              ) : (
                recentAgents.map(agent => (
                  <div key={agent.id} className="flex items-center justify-between p-3 rounded-lg border">
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded bg-primary/10">
                        <Bot className="w-4 h-4 text-primary" />
                      </div>
                      <div>
                        <p className="font-medium">{agent.name}</p>
                        <p className="text-xs text-muted-foreground">
                          {agent.throughput_1h} req/h · {agent.success_rate_24h.toFixed(1)}% success
                        </p>
                      </div>
                    </div>
                    <Badge variant={agent.status === 'active' ? 'default' : 'secondary'}>
                      {agent.status}
                    </Badge>
                  </div>
                ))
              )}
            </div>
          </Card>

          {/* Recent Workflows */}
          <Card className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">Recent Workflows</h3>
              <Link href="/workflows">
                <Button variant="ghost" size="sm">
                  View All <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </Link>
            </div>
            <div className="space-y-3">
              {recentWorkflows.length === 0 ? (
                <p className="text-sm text-muted-foreground text-center py-8">
                  No workflows yet. Create your first workflow to automate tasks.
                </p>
              ) : (
                recentWorkflows.map(workflow => (
                  <div key={workflow.id} className="flex items-center justify-between p-3 rounded-lg border">
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded bg-primary/10">
                        <GitBranch className="w-4 h-4 text-primary" />
                      </div>
                      <div>
                        <p className="font-medium">{workflow.name}</p>
                        <p className="text-xs text-muted-foreground">
                          {workflow.graph.nodes.length} nodes · {workflow.graph.edges.length} connections
                        </p>
                      </div>
                    </div>
                    <Badge variant={workflow.published ? 'default' : 'secondary'}>
                      {workflow.published ? 'Published' : 'Draft'}
                    </Badge>
                  </div>
                ))
              )}
            </div>
          </Card>
        </div>

        {/* Quick Actions */}
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4">Quick Actions</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Link href="/agents/builder">
              <Button variant="outline" className="w-full justify-start">
                <Bot className="w-4 h-4 mr-2" />
                Create Agent
              </Button>
            </Link>
            <Link href="/workflows/builder">
              <Button variant="outline" className="w-full justify-start">
                <GitBranch className="w-4 h-4 mr-2" />
                Build Workflow
              </Button>
            </Link>
            <Link href="/marketplace">
              <Button variant="outline" className="w-full justify-start">
                <Activity className="w-4 h-4 mr-2" />
                Browse Marketplace
              </Button>
            </Link>
            <Link href="/analytics">
              <Button variant="outline" className="w-full justify-start">
                <TrendingUp className="w-4 h-4 mr-2" />
                View Analytics
              </Button>
            </Link>
          </div>
        </Card>
      </div>
    </DashboardLayout>
  );
}
