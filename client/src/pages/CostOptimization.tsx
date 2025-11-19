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
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  DollarSign,
  TrendingUp,
  TrendingDown,
  AlertTriangle,
  Lightbulb,
  Target,
  Bell,
  Download,
  Zap,
  CheckCircle,
  Clock
} from 'lucide-react';
import { toast } from 'sonner';

interface CostAlert {
  id: string;
  severity: string;
  title: string;
  message: string;
  current_spend: number;
  budget_limit: number;
  percentage_used: number;
}

interface Recommendation {
  id: string;
  type: string;
  priority: string;
  title: string;
  description: string;
  estimated_savings_monthly: number;
  implementation_effort: string;
  affected_agents: string[];
  steps: string[];
}

export default function CostOptimization() {
  const [timeRange, setTimeRange] = useState('30d');
  const [showRecommendationDialog, setShowRecommendationDialog] = useState(false);
  const [selectedRecommendation, setSelectedRecommendation] = useState<Recommendation | null>(null);

  const [spending] = useState({
    total_spend: 665.60,
    daily_average: 95.08,
    by_agent: {
      "Customer Support Bot": 234.50,
      "Lead Qualification Agent": 112.80,
      "Content Writer Agent": 178.50,
      "Data Enrichment Agent": 45.60,
      "Other Agents": 94.20
    },
    by_category: {
      model: 450.80,
      api: 125.30,
      infrastructure: 89.50
    }
  });

  const [forecast] = useState({
    period: "30d",
    predicted_cost: 2850.00,
    confidence: 0.85,
    trend: "increasing",
    factors: [
      "Increasing agent usage (+15%)",
      "New workflow deployments",
      "Seasonal demand patterns",
      "Model pricing changes"
    ]
  });

  const [alerts] = useState<CostAlert[]>([
    {
      id: "alert_001",
      severity: "warning",
      title: "Budget Alert: 80% Threshold Reached",
      message: "Current spending ($665.60) has reached 66.6% of monthly budget ($1000.00)",
      current_spend: 665.60,
      budget_limit: 1000.00,
      percentage_used: 66.6
    },
    {
      id: "alert_002",
      severity: "warning",
      title: "Agent Budget Alert: Customer Support Bot",
      message: "Customer Support Bot spending ($234.50) has reached 93.8% of allocated budget ($250.00)",
      current_spend: 234.50,
      budget_limit: 250.00,
      percentage_used: 93.8
    }
  ]);

  const [recommendations] = useState<Recommendation[]>([
    {
      id: "rec_001",
      type: "model_switch",
      priority: "high",
      title: "Switch to GPT-3.5 for Simple Tasks",
      description: "Content Writer Agent uses GPT-4 for all tasks. 60% of tasks are simple and could use GPT-3.5 at 1/10th the cost.",
      estimated_savings_monthly: 45.00,
      implementation_effort: "easy",
      affected_agents: ["Content Writer Agent"],
      steps: [
        "Analyze task complexity distribution",
        "Create routing logic for simple vs complex tasks",
        "Update agent configuration to use GPT-3.5 for simple tasks",
        "Monitor quality metrics for 1 week"
      ]
    },
    {
      id: "rec_002",
      type: "caching",
      priority: "high",
      title: "Implement Response Caching",
      description: "Data Enrichment Agent makes repeated API calls for the same companies. Cache responses for 24 hours.",
      estimated_savings_monthly: 28.00,
      implementation_effort: "medium",
      affected_agents: ["Data Enrichment Agent"],
      steps: [
        "Set up Redis cache",
        "Implement cache key strategy based on company identifier",
        "Add cache hit/miss monitoring",
        "Set TTL to 24 hours"
      ]
    },
    {
      id: "rec_003",
      type: "batching",
      priority: "medium",
      title: "Batch Similar Requests",
      description: "Lead Qualification Agent processes leads individually. Batch similar leads to reduce API overhead.",
      estimated_savings_monthly: 35.00,
      implementation_effort: "medium",
      affected_agents: ["Lead Qualification Agent"],
      steps: [
        "Implement request queue",
        "Group similar leads by criteria",
        "Process batches every 5 minutes",
        "Maintain SLA for urgent leads"
      ]
    },
    {
      id: "rec_004",
      type: "scheduling",
      priority: "low",
      title: "Schedule Non-Urgent Tasks Off-Peak",
      description: "Content generation and data processing can run during off-peak hours for lower API rates.",
      estimated_savings_monthly: 18.00,
      implementation_effort: "easy",
      affected_agents: ["Content Writer Agent", "Data Enrichment Agent"],
      steps: [
        "Identify non-urgent workflows",
        "Configure scheduling for 2-6 AM",
        "Set up queue for delayed processing",
        "Add priority override for urgent requests"
      ]
    },
    {
      id: "rec_005",
      type: "model_switch",
      priority: "medium",
      title: "Use Smaller Context Windows",
      description: "Customer Support Bot uses 8K context window but averages 2K tokens. Reduce to 4K context.",
      estimated_savings_monthly: 22.00,
      implementation_effort: "easy",
      affected_agents: ["Customer Support Bot"],
      steps: [
        "Analyze context window usage patterns",
        "Update max_tokens configuration to 4096",
        "Monitor for truncation issues",
        "Adjust if needed based on metrics"
      ]
    },
    {
      id: "rec_006",
      type: "optimization",
      priority: "medium",
      title: "Optimize Prompt Engineering",
      description: "Verbose prompts increase token usage. Compress prompts while maintaining quality.",
      estimated_savings_monthly: 15.00,
      implementation_effort: "medium",
      affected_agents: ["All Agents"],
      steps: [
        "Audit all prompt templates",
        "Remove redundant instructions",
        "Use more concise language",
        "A/B test compressed vs original prompts"
      ]
    }
  ]);

  const totalPotentialSavings = recommendations.reduce((sum, r) => sum + r.estimated_savings_monthly, 0);

  const priorityColors = {
    high: 'bg-red-500/10 text-red-500 border-red-500/20',
    medium: 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20',
    low: 'bg-blue-500/10 text-blue-500 border-blue-500/20'
  };

  const effortColors = {
    easy: 'bg-green-500/10 text-green-500',
    medium: 'bg-yellow-500/10 text-yellow-500',
    hard: 'bg-red-500/10 text-red-500'
  };

  const viewRecommendation = (rec: Recommendation) => {
    setSelectedRecommendation(rec);
    setShowRecommendationDialog(true);
  };

  const implementRecommendation = (rec: Recommendation) => {
    toast.success(`Started implementing: ${rec.title}`);
    setShowRecommendationDialog(false);
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <DollarSign className="w-8 h-8 text-primary" />
              <h1 className="text-3xl font-bold">Cost Optimization</h1>
            </div>
            <p className="text-muted-foreground">
              Intelligent cost management with budget tracking and optimization
            </p>
          </div>

          <div className="flex gap-2">
            <Select value={timeRange} onValueChange={setTimeRange}>
              <SelectTrigger className="w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="7d">Last 7 days</SelectItem>
                <SelectItem value="30d">Last 30 days</SelectItem>
                <SelectItem value="90d">Last 90 days</SelectItem>
              </SelectContent>
            </Select>

            <Button variant="outline" className="gap-2">
              <Download className="w-4 h-4" />
              Export
            </Button>
          </div>
        </div>

        {/* Key Metrics */}
        <div className="grid md:grid-cols-4 gap-4 mb-6">
          <Card className="p-6">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm text-muted-foreground">Current Spend</p>
              <DollarSign className="w-5 h-5 text-primary" />
            </div>
            <p className="text-3xl font-bold">${spending.total_spend.toFixed(2)}</p>
            <div className="flex items-center gap-1 mt-2 text-xs">
              <TrendingUp className="w-3 h-3 text-yellow-500" />
              <span className="text-yellow-500">+8.2%</span>
              <span className="text-muted-foreground">vs last period</span>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm text-muted-foreground">Daily Average</p>
              <Clock className="w-5 h-5 text-cyan-500" />
            </div>
            <p className="text-3xl font-bold">${spending.daily_average.toFixed(2)}</p>
            <div className="flex items-center gap-1 mt-2 text-xs">
              <TrendingUp className="w-3 h-3 text-cyan-500" />
              <span className="text-cyan-500">+5.1%</span>
              <span className="text-muted-foreground">vs last period</span>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm text-muted-foreground">Predicted (30d)</p>
              <Target className="w-5 h-5 text-violet-500" />
            </div>
            <p className="text-3xl font-bold">${forecast.predicted_cost.toFixed(0)}</p>
            <div className="flex items-center gap-1 mt-2 text-xs">
              <span className="text-muted-foreground">{(forecast.confidence * 100).toFixed(0)}% confidence</span>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm text-muted-foreground">Potential Savings</p>
              <Lightbulb className="w-5 h-5 text-green-500" />
            </div>
            <p className="text-3xl font-bold text-green-500">${totalPotentialSavings.toFixed(0)}</p>
            <div className="flex items-center gap-1 mt-2 text-xs">
              <span className="text-muted-foreground">/month</span>
            </div>
          </Card>
        </div>

        {/* Alerts */}
        {alerts.length > 0 && (
          <Card className="p-6 mb-6 border-yellow-500/50">
            <div className="flex items-center gap-3 mb-4">
              <Bell className="w-5 h-5 text-yellow-500" />
              <h2 className="text-lg font-semibold">Active Alerts</h2>
              <Badge variant="secondary">{alerts.length}</Badge>
            </div>

            <div className="space-y-3">
              {alerts.map(alert => (
                <Card key={alert.id} className="p-4 border-l-4 border-l-yellow-500">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <AlertTriangle className="w-4 h-4 text-yellow-500" />
                        <h3 className="font-semibold text-sm">{alert.title}</h3>
                      </div>
                      <p className="text-sm text-muted-foreground mb-2">{alert.message}</p>
                      <div className="flex items-center gap-4 text-xs">
                        <span>Current: ${alert.current_spend.toFixed(2)}</span>
                        <span>Budget: ${alert.budget_limit.toFixed(2)}</span>
                        <span className="font-semibold text-yellow-500">
                          {alert.percentage_used.toFixed(1)}% used
                        </span>
                      </div>
                    </div>
                    <Button size="sm" variant="outline">
                      Acknowledge
                    </Button>
                  </div>
                </Card>
              ))}
            </div>
          </Card>
        )}

        <Tabs defaultValue="recommendations" className="space-y-6">
          <TabsList>
            <TabsTrigger value="recommendations">Recommendations</TabsTrigger>
            <TabsTrigger value="spending">Spending Breakdown</TabsTrigger>
            <TabsTrigger value="forecast">Forecast</TabsTrigger>
            <TabsTrigger value="budget">Budget Allocation</TabsTrigger>
          </TabsList>

          {/* Recommendations Tab */}
          <TabsContent value="recommendations" className="space-y-4">
            <Card className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <Lightbulb className="w-6 h-6 text-yellow-500" />
                  <h2 className="text-xl font-semibold">Optimization Recommendations</h2>
                </div>
                <div className="text-right">
                  <p className="text-sm text-muted-foreground">Total Potential Savings</p>
                  <p className="text-2xl font-bold text-green-500">${totalPotentialSavings}/mo</p>
                </div>
              </div>

              <div className="space-y-3">
                {recommendations.map(rec => (
                  <Card key={rec.id} className="p-4 hover:border-primary/50 transition-colors cursor-pointer"
                    onClick={() => viewRecommendation(rec)}>
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <Badge className={priorityColors[rec.priority as keyof typeof priorityColors]}>
                            {rec.priority}
                          </Badge>
                          <Badge variant="outline" className="text-xs">
                            {rec.type.replace('_', ' ')}
                          </Badge>
                          <Badge className={effortColors[rec.implementation_effort as keyof typeof effortColors]}>
                            {rec.implementation_effort}
                          </Badge>
                        </div>
                        <h3 className="font-semibold mb-1">{rec.title}</h3>
                        <p className="text-sm text-muted-foreground mb-2">{rec.description}</p>
                        <div className="flex items-center gap-4 text-xs text-muted-foreground">
                          <span>Affects: {rec.affected_agents.join(', ')}</span>
                        </div>
                      </div>
                      <div className="text-right ml-4">
                        <p className="text-sm text-muted-foreground">Savings</p>
                        <p className="text-2xl font-bold text-green-500">${rec.estimated_savings_monthly}</p>
                        <p className="text-xs text-muted-foreground">/month</p>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </Card>
          </TabsContent>

          {/* Spending Breakdown Tab */}
          <TabsContent value="spending" className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <Card className="p-6">
                <h2 className="text-lg font-semibold mb-4">Spending by Agent</h2>
                <div className="space-y-3">
                  {Object.entries(spending.by_agent).map(([agent, cost]) => {
                    const percentage = (cost / spending.total_spend) * 100;
                    return (
                      <div key={agent}>
                        <div className="flex justify-between mb-2 text-sm">
                          <span>{agent}</span>
                          <span className="font-semibold">${cost.toFixed(2)} ({percentage.toFixed(1)}%)</span>
                        </div>
                        <div className="h-2 bg-muted rounded-full overflow-hidden">
                          <div
                            className="h-full bg-primary transition-all"
                            style={{ width: `${percentage}%` }}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </Card>

              <Card className="p-6">
                <h2 className="text-lg font-semibold mb-4">Spending by Category</h2>
                <div className="space-y-3">
                  {Object.entries(spending.by_category).map(([category, cost]) => {
                    const percentage = (cost / spending.total_spend) * 100;
                    const colors: Record<string, string> = {
                      model: 'bg-primary',
                      api: 'bg-cyan-500',
                      infrastructure: 'bg-violet-500'
                    };
                    return (
                      <div key={category}>
                        <div className="flex justify-between mb-2 text-sm">
                          <span className="capitalize">{category}</span>
                          <span className="font-semibold">${cost.toFixed(2)} ({percentage.toFixed(1)}%)</span>
                        </div>
                        <div className="h-2 bg-muted rounded-full overflow-hidden">
                          <div
                            className={`h-full ${colors[category]} transition-all`}
                            style={{ width: `${percentage}%` }}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </Card>
            </div>
          </TabsContent>

          {/* Forecast Tab */}
          <TabsContent value="forecast" className="space-y-6">
            <Card className="p-6">
              <div className="flex items-center gap-3 mb-4">
                <TrendingUp className="w-6 h-6 text-primary" />
                <h2 className="text-xl font-semibold">Cost Forecast</h2>
              </div>

              <div className="grid md:grid-cols-3 gap-6 mb-6">
                <div className="p-4 bg-muted rounded-lg">
                  <p className="text-sm text-muted-foreground mb-1">Predicted Cost (30d)</p>
                  <p className="text-3xl font-bold">${forecast.predicted_cost.toFixed(2)}</p>
                </div>
                <div className="p-4 bg-muted rounded-lg">
                  <p className="text-sm text-muted-foreground mb-1">Confidence Level</p>
                  <p className="text-3xl font-bold">{(forecast.confidence * 100).toFixed(0)}%</p>
                </div>
                <div className="p-4 bg-muted rounded-lg">
                  <p className="text-sm text-muted-foreground mb-1">Trend</p>
                  <div className="flex items-center gap-2">
                    <TrendingUp className="w-6 h-6 text-yellow-500" />
                    <p className="text-2xl font-bold capitalize">{forecast.trend}</p>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="font-semibold mb-3">Contributing Factors</h3>
                <div className="space-y-2">
                  {forecast.factors.map((factor, idx) => (
                    <div key={idx} className="flex items-center gap-2 text-sm">
                      <Zap className="w-4 h-4 text-primary" />
                      <span>{factor}</span>
                    </div>
                  ))}
                </div>
              </div>
            </Card>
          </TabsContent>

          {/* Budget Allocation Tab */}
          <TabsContent value="budget" className="space-y-6">
            <Card className="p-6">
              <h2 className="text-xl font-semibold mb-4">Recommended Budget Allocation</h2>
              <p className="text-sm text-muted-foreground mb-6">
                Based on usage patterns and priority weighting
              </p>

              <div className="space-y-4">
                {Object.entries(spending.by_agent).map(([agent, currentSpend]) => {
                  const recommendedBudget = currentSpend * 1.2; // 20% buffer
                  return (
                    <div key={agent} className="p-4 bg-muted rounded-lg">
                      <div className="flex justify-between items-center mb-2">
                        <span className="font-medium">{agent}</span>
                        <div className="text-right">
                          <p className="text-sm text-muted-foreground">Recommended</p>
                          <p className="font-bold">${recommendedBudget.toFixed(2)}/mo</p>
                        </div>
                      </div>
                      <div className="flex justify-between text-xs text-muted-foreground">
                        <span>Current spend: ${currentSpend.toFixed(2)}</span>
                        <span>Buffer: 20%</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      {/* Recommendation Detail Dialog */}
      <Dialog open={showRecommendationDialog} onOpenChange={setShowRecommendationDialog}>
        <DialogContent className="max-w-2xl">
          {selectedRecommendation && (
            <>
              <DialogHeader>
                <DialogTitle>{selectedRecommendation.title}</DialogTitle>
                <DialogDescription>{selectedRecommendation.description}</DialogDescription>
              </DialogHeader>

              <div className="space-y-4">
                <div className="flex gap-2">
                  <Badge className={priorityColors[selectedRecommendation.priority as keyof typeof priorityColors]}>
                    {selectedRecommendation.priority} priority
                  </Badge>
                  <Badge className={effortColors[selectedRecommendation.implementation_effort as keyof typeof effortColors]}>
                    {selectedRecommendation.implementation_effort} effort
                  </Badge>
                </div>

                <div className="p-4 bg-green-500/10 rounded-lg border border-green-500/20">
                  <p className="text-sm text-muted-foreground mb-1">Estimated Monthly Savings</p>
                  <p className="text-3xl font-bold text-green-500">
                    ${selectedRecommendation.estimated_savings_monthly}
                  </p>
                </div>

                <div>
                  <h3 className="font-semibold mb-2">Affected Agents</h3>
                  <div className="flex flex-wrap gap-2">
                    {selectedRecommendation.affected_agents.map(agent => (
                      <Badge key={agent} variant="outline">{agent}</Badge>
                    ))}
                  </div>
                </div>

                <div>
                  <h3 className="font-semibold mb-2">Implementation Steps</h3>
                  <ol className="space-y-2">
                    {selectedRecommendation.steps.map((step, idx) => (
                      <li key={idx} className="flex items-start gap-2 text-sm">
                        <span className="flex-shrink-0 w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center text-xs font-bold">
                          {idx + 1}
                        </span>
                        <span className="pt-0.5">{step}</span>
                      </li>
                    ))}
                  </ol>
                </div>
              </div>

              <DialogFooter>
                <Button variant="outline" onClick={() => setShowRecommendationDialog(false)}>
                  Close
                </Button>
                <Button onClick={() => implementRecommendation(selectedRecommendation)} className="gap-2">
                  <CheckCircle className="w-4 h-4" />
                  Start Implementation
                </Button>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
