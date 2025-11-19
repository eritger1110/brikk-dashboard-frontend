import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs';
import {
  BarChart3,
  TrendingUp,
  TrendingDown,
  DollarSign,
  Clock,
  CheckCircle,
  AlertTriangle,
  Download,
  Zap,
  Target,
  Activity
} from 'lucide-react';
import { toast } from 'sonner';

interface AgentMetric {
  agent_id: string;
  agent_name: string;
  total_executions: number;
  successful_executions: number;
  failed_executions: number;
  avg_execution_time_ms: number;
  total_tokens_used: number;
  total_cost: number;
  success_rate: number;
  uptime_percentage: number;
}

export default function AgentAnalytics() {
  const [timeRange, setTimeRange] = useState('7d');
  const [metrics, setMetrics] = useState<AgentMetric[]>([]);
  const [selectedAgent, setSelectedAgent] = useState('all');
  const [isLoading, setIsLoading] = useState(false);

  const [roiData] = useState({
    total_cost: 665.60,
    time_saved_hours: 320.5,
    cost_savings: 16025.00,
    revenue_generated: 12500.00,
    roi_percentage: 4185.7,
    payback_period_days: 7
  });

  const [predictiveInsights] = useState({
    predicted_monthly_cost: 2850.00,
    predicted_executions: 180000,
    capacity_utilization: 67.5,
    bottlenecks: [
      "Customer Support Bot experiencing high load during peak hours",
      "Content Writer Agent has longer response times than average"
    ],
    optimization_opportunities: [
      {
        type: "model_optimization",
        agent: "Content Writer Agent",
        recommendation: "Switch to GPT-3.5 for simple content tasks",
        estimated_savings: "$45/month"
      },
      {
        type: "caching",
        agent: "Data Enrichment Agent",
        recommendation: "Implement response caching for common queries",
        estimated_savings: "$28/month"
      },
      {
        type: "batch_processing",
        agent: "Lead Qualification Agent",
        recommendation: "Batch similar requests to reduce API calls",
        estimated_savings: "$35/month"
      }
    ],
    risk_factors: [
      "Increasing failure rate on Customer Support Bot (trend: +2% this week)",
      "Cost growth outpacing execution growth by 15%"
    ]
  });

  useEffect(() => {
    loadMetrics();
  }, [timeRange]);

  const loadMetrics = async () => {
    setIsLoading(true);
    try {
      // Mock data
      const mockMetrics: AgentMetric[] = [
        {
          agent_id: "agent_001",
          agent_name: "Customer Support Bot",
          total_executions: 15420,
          successful_executions: 14688,
          failed_executions: 732,
          avg_execution_time_ms: 1250,
          total_tokens_used: 2340000,
          total_cost: 234.50,
          success_rate: 95.3,
          uptime_percentage: 99.8
        },
        {
          agent_id: "agent_002",
          agent_name: "Lead Qualification Agent",
          total_executions: 8920,
          successful_executions: 8652,
          failed_executions: 268,
          avg_execution_time_ms: 890,
          total_tokens_used: 1120000,
          total_cost: 112.80,
          success_rate: 97.0,
          uptime_percentage: 99.9
        },
        {
          agent_id: "agent_003",
          agent_name: "Content Writer Agent",
          total_executions: 3450,
          successful_executions: 3312,
          failed_executions: 138,
          avg_execution_time_ms: 3200,
          total_tokens_used: 890000,
          total_cost: 178.50,
          success_rate: 96.0,
          uptime_percentage: 99.5
        },
        {
          agent_id: "agent_004",
          agent_name: "Data Enrichment Agent",
          total_executions: 12300,
          successful_executions: 11931,
          failed_executions: 369,
          avg_execution_time_ms: 650,
          total_tokens_used: 456000,
          total_cost: 45.60,
          success_rate: 97.0,
          uptime_percentage: 99.7
        }
      ];

      setMetrics(mockMetrics);
    } catch (error) {
      toast.error('Failed to load analytics');
    } finally {
      setIsLoading(false);
    }
  };

  const exportReport = async () => {
    toast.success('Report exported successfully!');
  };

  const totalExecutions = metrics.reduce((sum, m) => sum + m.total_executions, 0);
  const totalCost = metrics.reduce((sum, m) => sum + m.total_cost, 0);
  const avgSuccessRate = metrics.length > 0
    ? metrics.reduce((sum, m) => sum + m.success_rate, 0) / metrics.length
    : 0;
  const avgResponseTime = metrics.length > 0
    ? metrics.reduce((sum, m) => sum + m.avg_execution_time_ms, 0) / metrics.length
    : 0;

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <BarChart3 className="w-8 h-8 text-primary" />
              <h1 className="text-3xl font-bold">BrikkInsights</h1>
            </div>
            <p className="text-muted-foreground">
              Deep performance insights, ROI tracking, and predictive analytics
            </p>
          </div>

          <div className="flex gap-2">
            <Select value={timeRange} onValueChange={setTimeRange}>
              <SelectTrigger className="w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="24h">Last 24h</SelectItem>
                <SelectItem value="7d">Last 7 days</SelectItem>
                <SelectItem value="30d">Last 30 days</SelectItem>
                <SelectItem value="90d">Last 90 days</SelectItem>
              </SelectContent>
            </Select>

            <Button onClick={exportReport} variant="outline" className="gap-2">
              <Download className="w-4 h-4" />
              Export
            </Button>
          </div>
        </div>

        {/* Key Metrics */}
        <div className="grid md:grid-cols-4 gap-4 mb-6">
          <Card className="p-6">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm text-muted-foreground">Total Executions</p>
              <Activity className="w-5 h-5 text-primary" />
            </div>
            <p className="text-3xl font-bold">{totalExecutions.toLocaleString()}</p>
            <div className="flex items-center gap-1 mt-2 text-xs">
              <TrendingUp className="w-3 h-3 text-green-500" />
              <span className="text-green-500">+12.5%</span>
              <span className="text-muted-foreground">vs last period</span>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm text-muted-foreground">Avg Success Rate</p>
              <CheckCircle className="w-5 h-5 text-green-500" />
            </div>
            <p className="text-3xl font-bold">{avgSuccessRate.toFixed(1)}%</p>
            <div className="flex items-center gap-1 mt-2 text-xs">
              <TrendingUp className="w-3 h-3 text-green-500" />
              <span className="text-green-500">+0.8%</span>
              <span className="text-muted-foreground">vs last period</span>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm text-muted-foreground">Total Cost</p>
              <DollarSign className="w-5 h-5 text-yellow-500" />
            </div>
            <p className="text-3xl font-bold">${totalCost.toFixed(2)}</p>
            <div className="flex items-center gap-1 mt-2 text-xs">
              <TrendingUp className="w-3 h-3 text-yellow-500" />
              <span className="text-yellow-500">+8.2%</span>
              <span className="text-muted-foreground">vs last period</span>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm text-muted-foreground">Avg Response Time</p>
              <Clock className="w-5 h-5 text-cyan-500" />
            </div>
            <p className="text-3xl font-bold">{avgResponseTime.toFixed(0)}ms</p>
            <div className="flex items-center gap-1 mt-2 text-xs">
              <TrendingDown className="w-3 h-3 text-green-500" />
              <span className="text-green-500">-5.3%</span>
              <span className="text-muted-foreground">vs last period</span>
            </div>
          </Card>
        </div>

        <Tabs defaultValue="performance" className="space-y-6">
          <TabsList>
            <TabsTrigger value="performance">Performance</TabsTrigger>
            <TabsTrigger value="roi">ROI Analysis</TabsTrigger>
            <TabsTrigger value="insights">Predictive Insights</TabsTrigger>
            <TabsTrigger value="errors">Error Analysis</TabsTrigger>
          </TabsList>

          {/* Performance Tab */}
          <TabsContent value="performance" className="space-y-6">
            <Card className="p-6">
              <h2 className="text-xl font-semibold mb-4">Agent Performance</h2>
              
              <div className="space-y-4">
                {metrics.map(metric => (
                  <Card key={metric.agent_id} className="p-4 border-l-4 border-l-primary">
                    <div className="flex items-center justify-between mb-3">
                      <div>
                        <h3 className="font-semibold">{metric.agent_name}</h3>
                        <p className="text-sm text-muted-foreground">
                          {metric.total_executions.toLocaleString()} executions
                        </p>
                      </div>
                      <Badge variant={metric.success_rate >= 95 ? 'default' : 'destructive'}>
                        {metric.success_rate.toFixed(1)}% success
                      </Badge>
                    </div>

                    <div className="grid grid-cols-4 gap-4 text-sm">
                      <div>
                        <p className="text-muted-foreground mb-1">Avg Response</p>
                        <p className="font-semibold">{metric.avg_execution_time_ms}ms</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground mb-1">Tokens Used</p>
                        <p className="font-semibold">{(metric.total_tokens_used / 1000).toFixed(0)}K</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground mb-1">Cost</p>
                        <p className="font-semibold">${metric.total_cost.toFixed(2)}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground mb-1">Uptime</p>
                        <p className="font-semibold">{metric.uptime_percentage.toFixed(1)}%</p>
                      </div>
                    </div>

                    {/* Progress Bar */}
                    <div className="mt-3">
                      <div className="h-2 bg-muted rounded-full overflow-hidden">
                        <div
                          className="h-full bg-primary transition-all"
                          style={{ width: `${metric.success_rate}%` }}
                        />
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </Card>
          </TabsContent>

          {/* ROI Tab */}
          <TabsContent value="roi" className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <Card className="p-6">
                <div className="flex items-center gap-3 mb-4">
                  <Target className="w-6 h-6 text-primary" />
                  <h2 className="text-xl font-semibold">ROI Summary</h2>
                </div>

                <div className="space-y-4">
                  <div className="flex justify-between items-center p-3 bg-muted rounded-lg">
                    <span className="text-muted-foreground">Total Investment</span>
                    <span className="font-bold text-lg">${roiData.total_cost.toFixed(2)}</span>
                  </div>

                  <div className="flex justify-between items-center p-3 bg-muted rounded-lg">
                    <span className="text-muted-foreground">Time Saved</span>
                    <span className="font-bold text-lg">{roiData.time_saved_hours.toFixed(0)}h</span>
                  </div>

                  <div className="flex justify-between items-center p-3 bg-muted rounded-lg">
                    <span className="text-muted-foreground">Cost Savings</span>
                    <span className="font-bold text-lg text-green-500">
                      ${roiData.cost_savings.toLocaleString()}
                    </span>
                  </div>

                  <div className="flex justify-between items-center p-3 bg-muted rounded-lg">
                    <span className="text-muted-foreground">Revenue Generated</span>
                    <span className="font-bold text-lg text-green-500">
                      ${roiData.revenue_generated.toLocaleString()}
                    </span>
                  </div>

                  <div className="flex justify-between items-center p-4 bg-primary/10 rounded-lg border-2 border-primary">
                    <span className="font-semibold">Total ROI</span>
                    <span className="font-bold text-2xl text-primary">
                      {roiData.roi_percentage.toFixed(0)}%
                    </span>
                  </div>

                  <div className="text-center p-3 bg-muted rounded-lg">
                    <p className="text-sm text-muted-foreground mb-1">Payback Period</p>
                    <p className="font-bold text-lg">{roiData.payback_period_days} days</p>
                  </div>
                </div>
              </Card>

              <Card className="p-6">
                <div className="flex items-center gap-3 mb-4">
                  <DollarSign className="w-6 h-6 text-green-500" />
                  <h2 className="text-xl font-semibold">Cost Breakdown</h2>
                </div>

                <div className="space-y-3">
                  <div>
                    <div className="flex justify-between mb-2">
                      <span className="text-sm">Model Costs</span>
                      <span className="text-sm font-semibold">$450.80 (68%)</span>
                    </div>
                    <div className="h-2 bg-muted rounded-full overflow-hidden">
                      <div className="h-full bg-primary" style={{ width: '68%' }} />
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between mb-2">
                      <span className="text-sm">API Costs</span>
                      <span className="text-sm font-semibold">$125.30 (19%)</span>
                    </div>
                    <div className="h-2 bg-muted rounded-full overflow-hidden">
                      <div className="h-full bg-cyan-500" style={{ width: '19%' }} />
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between mb-2">
                      <span className="text-sm">Infrastructure</span>
                      <span className="text-sm font-semibold">$89.50 (13%)</span>
                    </div>
                    <div className="h-2 bg-muted rounded-full overflow-hidden">
                      <div className="h-full bg-violet-500" style={{ width: '13%' }} />
                    </div>
                  </div>
                </div>

                <div className="mt-6 p-4 bg-muted rounded-lg">
                  <div className="flex justify-between items-center">
                    <span className="font-semibold">Total Cost</span>
                    <span className="font-bold text-xl">${roiData.total_cost.toFixed(2)}</span>
                  </div>
                </div>
              </Card>
            </div>
          </TabsContent>

          {/* Predictive Insights Tab */}
          <TabsContent value="insights" className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <Card className="p-6">
                <div className="flex items-center gap-3 mb-4">
                  <Zap className="w-6 h-6 text-yellow-500" />
                  <h2 className="text-xl font-semibold">Optimization Opportunities</h2>
                </div>

                <div className="space-y-3">
                  {predictiveInsights.optimization_opportunities.map((opp, idx) => (
                    <Card key={idx} className="p-4 border-l-4 border-l-yellow-500">
                      <div className="flex items-start justify-between mb-2">
                        <Badge variant="outline" className="text-xs">
                          {opp.type.replace('_', ' ')}
                        </Badge>
                        <span className="text-sm font-bold text-green-500">
                          {opp.estimated_savings}
                        </span>
                      </div>
                      <p className="text-sm font-medium mb-1">{opp.agent}</p>
                      <p className="text-xs text-muted-foreground">{opp.recommendation}</p>
                    </Card>
                  ))}
                </div>

                <div className="mt-4 p-4 bg-green-500/10 rounded-lg border border-green-500/20">
                  <p className="text-sm font-semibold text-green-500">
                    Total Potential Savings: $108/month
                  </p>
                </div>
              </Card>

              <Card className="p-6">
                <div className="flex items-center gap-3 mb-4">
                  <AlertTriangle className="w-6 h-6 text-red-500" />
                  <h2 className="text-xl font-semibold">Risk Factors & Bottlenecks</h2>
                </div>

                <div className="space-y-3">
                  <div>
                    <h3 className="text-sm font-semibold mb-2">Bottlenecks</h3>
                    {predictiveInsights.bottlenecks.map((bottleneck, idx) => (
                      <Card key={idx} className="p-3 mb-2 border-l-4 border-l-orange-500">
                        <p className="text-sm">{bottleneck}</p>
                      </Card>
                    ))}
                  </div>

                  <div>
                    <h3 className="text-sm font-semibold mb-2">Risk Factors</h3>
                    {predictiveInsights.risk_factors.map((risk, idx) => (
                      <Card key={idx} className="p-3 mb-2 border-l-4 border-l-red-500">
                        <p className="text-sm">{risk}</p>
                      </Card>
                    ))}
                  </div>
                </div>

                <div className="mt-4 space-y-2">
                  <div className="flex justify-between p-3 bg-muted rounded-lg">
                    <span className="text-sm">Predicted Monthly Cost</span>
                    <span className="font-semibold">
                      ${predictiveInsights.predicted_monthly_cost.toFixed(2)}
                    </span>
                  </div>
                  <div className="flex justify-between p-3 bg-muted rounded-lg">
                    <span className="text-sm">Capacity Utilization</span>
                    <span className="font-semibold">
                      {predictiveInsights.capacity_utilization.toFixed(1)}%
                    </span>
                  </div>
                </div>
              </Card>
            </div>
          </TabsContent>

          {/* Error Analysis Tab */}
          <TabsContent value="errors" className="space-y-6">
            <Card className="p-6">
              <h2 className="text-xl font-semibold mb-4">Error Categories</h2>
              
              <div className="grid md:grid-cols-2 gap-4">
                {[
                  { name: 'Timeout', count: 654, percentage: 43.4, trend: 'increasing', color: 'red' },
                  { name: 'Rate Limit', count: 423, percentage: 28.1, trend: 'stable', color: 'yellow' },
                  { name: 'Invalid Input', count: 289, percentage: 19.2, trend: 'decreasing', color: 'orange' },
                  { name: 'API Error', count: 141, percentage: 9.3, trend: 'stable', color: 'purple' }
                ].map(error => (
                  <Card key={error.name} className="p-4">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-semibold">{error.name}</h3>
                      <Badge variant={error.trend === 'increasing' ? 'destructive' : 'secondary'}>
                        {error.trend}
                      </Badge>
                    </div>
                    <p className="text-2xl font-bold mb-2">{error.count}</p>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
                        <div
                          className={`h-full bg-${error.color}-500`}
                          style={{ width: `${error.percentage}%` }}
                        />
                      </div>
                      <span>{error.percentage}%</span>
                    </div>
                  </Card>
                ))}
              </div>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
