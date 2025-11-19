import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs';
import {
  FlaskConical,
  Play,
  Pause,
  StopCircle,
  Trophy,
  TrendingUp,
  Target,
  Plus,
  Settings,
  BarChart3,
  CheckCircle,
  AlertCircle,
  Clock
} from 'lucide-react';
import { toast } from 'sonner';

interface ABTest {
  id: string;
  name: string;
  agent_name: string;
  status: string;
  variants: Variant[];
  started_at: string | null;
  duration_days: number;
  total_impressions: number;
  winner: string | null;
  confidence: number;
}

interface Variant {
  id: string;
  name: string;
  traffic_percentage: number;
  impressions: number;
  conversions: number;
  conversion_rate: number;
  avg_response_time_ms: number;
  success_rate: number;
}

export default function AdvancedABTesting() {
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [showDetailsDialog, setShowDetailsDialog] = useState(false);
  const [selectedTest, setSelectedTest] = useState<ABTest | null>(null);
  const [showRolloutDialog, setShowRolloutDialog] = useState(false);

  const [tests] = useState<ABTest[]>([
    {
      id: 'test_001',
      name: 'GPT-4 vs Claude 3 Comparison',
      agent_name: 'Customer Support Bot',
      status: 'running',
      variants: [
        {
          id: 'var_001',
          name: 'GPT-4 Turbo',
          traffic_percentage: 50,
          impressions: 1245,
          conversions: 389,
          conversion_rate: 0.312,
          avg_response_time_ms: 1250,
          success_rate: 0.945
        },
        {
          id: 'var_002',
          name: 'Claude 3 Opus',
          traffic_percentage: 50,
          impressions: 1198,
          conversions: 431,
          conversion_rate: 0.360,
          avg_response_time_ms: 980,
          success_rate: 0.968
        }
      ],
      started_at: '2025-01-15T10:00:00Z',
      duration_days: 4,
      total_impressions: 2443,
      winner: 'Claude 3 Opus',
      confidence: 0.94
    },
    {
      id: 'test_002',
      name: 'Prompt Length Optimization',
      agent_name: 'Content Writer Agent',
      status: 'running',
      variants: [
        {
          id: 'var_003',
          name: 'Short Prompt (200 tokens)',
          traffic_percentage: 33.3,
          impressions: 856,
          conversions: 234,
          conversion_rate: 0.273,
          avg_response_time_ms: 850,
          success_rate: 0.921
        },
        {
          id: 'var_004',
          name: 'Medium Prompt (500 tokens)',
          traffic_percentage: 33.3,
          impressions: 892,
          conversions: 289,
          conversion_rate: 0.324,
          avg_response_time_ms: 1150,
          success_rate: 0.952
        },
        {
          id: 'var_005',
          name: 'Long Prompt (1000 tokens)',
          traffic_percentage: 33.4,
          impressions: 923,
          conversions: 312,
          conversion_rate: 0.338,
          avg_response_time_ms: 1580,
          success_rate: 0.965
        }
      ],
      started_at: '2025-01-16T14:00:00Z',
      duration_days: 3,
      total_impressions: 2671,
      winner: 'Long Prompt (1000 tokens)',
      confidence: 0.87
    },
    {
      id: 'test_003',
      name: 'Temperature Setting Test',
      agent_name: 'Lead Qualification Agent',
      status: 'draft',
      variants: [
        {
          id: 'var_006',
          name: 'Temperature 0.3',
          traffic_percentage: 0,
          impressions: 0,
          conversions: 0,
          conversion_rate: 0,
          avg_response_time_ms: 0,
          success_rate: 0
        },
        {
          id: 'var_007',
          name: 'Temperature 0.7',
          traffic_percentage: 0,
          impressions: 0,
          conversions: 0,
          conversion_rate: 0,
          avg_response_time_ms: 0,
          success_rate: 0
        }
      ],
      started_at: null,
      duration_days: 0,
      total_impressions: 0,
      winner: null,
      confidence: 0
    }
  ]);

  const statusColors = {
    draft: 'bg-gray-500/10 text-gray-500',
    running: 'bg-green-500/10 text-green-500',
    paused: 'bg-yellow-500/10 text-yellow-500',
    completed: 'bg-blue-500/10 text-blue-500'
  };

  const startTest = (testId: string) => {
    toast.success('Test started successfully');
  };

  const pauseTest = (testId: string) => {
    toast.success('Test paused');
  };

  const stopTest = (testId: string) => {
    toast.success('Test stopped and winner declared');
  };

  const viewDetails = (test: ABTest) => {
    setSelectedTest(test);
    setShowDetailsDialog(true);
  };

  const startRollout = (test: ABTest) => {
    setSelectedTest(test);
    setShowRolloutDialog(true);
  };

  const runningTests = tests.filter(t => t.status === 'running').length;
  const completedTests = tests.filter(t => t.status === 'completed').length;
  const totalImpressions = tests.reduce((sum, t) => sum + t.total_impressions, 0);

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <FlaskConical className="w-8 h-8 text-primary" />
              <h1 className="text-3xl font-bold">Advanced A/B Testing</h1>
            </div>
            <p className="text-muted-foreground">
              Multi-variate testing with automatic winner selection
            </p>
          </div>

          <Button onClick={() => setShowCreateDialog(true)} className="gap-2">
            <Plus className="w-4 h-4" />
            Create Test
          </Button>
        </div>

        {/* Stats */}
        <div className="grid md:grid-cols-4 gap-4 mb-6">
          <Card className="p-6">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm text-muted-foreground">Total Tests</p>
              <FlaskConical className="w-5 h-5 text-primary" />
            </div>
            <p className="text-3xl font-bold">{tests.length}</p>
            <p className="text-xs text-muted-foreground mt-1">all time</p>
          </Card>

          <Card className="p-6">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm text-muted-foreground">Running Tests</p>
              <Play className="w-5 h-5 text-green-500" />
            </div>
            <p className="text-3xl font-bold">{runningTests}</p>
            <p className="text-xs text-muted-foreground mt-1">active now</p>
          </Card>

          <Card className="p-6">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm text-muted-foreground">Completed</p>
              <CheckCircle className="w-5 h-5 text-blue-500" />
            </div>
            <p className="text-3xl font-bold">{completedTests}</p>
            <p className="text-xs text-muted-foreground mt-1">with winners</p>
          </Card>

          <Card className="p-6">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm text-muted-foreground">Total Impressions</p>
              <Target className="w-5 h-5 text-violet-500" />
            </div>
            <p className="text-3xl font-bold">{totalImpressions.toLocaleString()}</p>
            <p className="text-xs text-muted-foreground mt-1">across all tests</p>
          </Card>
        </div>

        {/* Tests List */}
        <div className="space-y-4">
          {tests.map(test => {
            const winner = test.variants.find(v => v.name === test.winner);
            const confidencePercent = (test.confidence * 100).toFixed(1);

            return (
              <Card key={test.id} className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className="text-lg font-semibold">{test.name}</h3>
                      <Badge className={statusColors[test.status as keyof typeof statusColors]}>
                        {test.status}
                      </Badge>
                      {test.winner && test.confidence >= 0.95 && (
                        <Badge className="bg-yellow-500/10 text-yellow-500">
                          <Trophy className="w-3 h-3 mr-1" />
                          Winner Found
                        </Badge>
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground mb-3">
                      Agent: {test.agent_name} • {test.variants.length} variants • {test.total_impressions.toLocaleString()} impressions
                    </p>

                    {/* Variants */}
                    <div className="grid md:grid-cols-3 gap-3 mb-4">
                      {test.variants.map(variant => (
                        <Card key={variant.id} className={`p-4 ${variant.name === test.winner ? 'border-yellow-500 border-2' : ''}`}>
                          <div className="flex items-center justify-between mb-2">
                            <h4 className="font-medium text-sm">{variant.name}</h4>
                            {variant.name === test.winner && (
                              <Trophy className="w-4 h-4 text-yellow-500" />
                            )}
                          </div>

                          {test.status !== 'draft' && (
                            <>
                              <div className="space-y-2 text-xs">
                                <div className="flex justify-between">
                                  <span className="text-muted-foreground">Conversion Rate</span>
                                  <span className="font-semibold">{(variant.conversion_rate * 100).toFixed(1)}%</span>
                                </div>
                                <div className="flex justify-between">
                                  <span className="text-muted-foreground">Impressions</span>
                                  <span>{variant.impressions.toLocaleString()}</span>
                                </div>
                                <div className="flex justify-between">
                                  <span className="text-muted-foreground">Response Time</span>
                                  <span>{variant.avg_response_time_ms.toFixed(0)}ms</span>
                                </div>
                                <div className="flex justify-between">
                                  <span className="text-muted-foreground">Success Rate</span>
                                  <span>{(variant.success_rate * 100).toFixed(1)}%</span>
                                </div>
                              </div>

                              {test.status === 'running' && (
                                <div className="mt-3">
                                  <div className="flex justify-between text-xs mb-1">
                                    <span className="text-muted-foreground">Traffic</span>
                                    <span className="font-semibold">{variant.traffic_percentage.toFixed(1)}%</span>
                                  </div>
                                  <Progress value={variant.traffic_percentage} className="h-2" />
                                </div>
                              )}
                            </>
                          )}

                          {test.status === 'draft' && (
                            <p className="text-xs text-muted-foreground">No data yet</p>
                          )}
                        </Card>
                      ))}
                    </div>

                    {/* Test Info */}
                    {test.status !== 'draft' && (
                      <div className="flex items-center gap-6 text-sm">
                        <div className="flex items-center gap-2">
                          <Clock className="w-4 h-4 text-muted-foreground" />
                          <span>Running for {test.duration_days} days</span>
                        </div>
                        {test.winner && (
                          <>
                            <div className="flex items-center gap-2">
                              <Trophy className="w-4 h-4 text-yellow-500" />
                              <span>Winner: {test.winner}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <BarChart3 className="w-4 h-4 text-primary" />
                              <span>Confidence: {confidencePercent}%</span>
                            </div>
                          </>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2 ml-4">
                    {test.status === 'draft' && (
                      <Button size="sm" onClick={() => startTest(test.id)} className="gap-2">
                        <Play className="w-4 h-4" />
                        Start
                      </Button>
                    )}

                    {test.status === 'running' && (
                      <>
                        <Button size="sm" variant="outline" onClick={() => pauseTest(test.id)} className="gap-2">
                          <Pause className="w-4 h-4" />
                          Pause
                        </Button>
                        <Button size="sm" variant="outline" onClick={() => stopTest(test.id)} className="gap-2">
                          <StopCircle className="w-4 h-4" />
                          Stop
                        </Button>
                      </>
                    )}

                    {test.status === 'paused' && (
                      <Button size="sm" onClick={() => startTest(test.id)} className="gap-2">
                        <Play className="w-4 h-4" />
                        Resume
                      </Button>
                    )}

                    {test.winner && test.confidence >= 0.90 && (
                      <Button size="sm" onClick={() => startRollout(test)} className="gap-2">
                        <TrendingUp className="w-4 h-4" />
                        Gradual Rollout
                      </Button>
                    )}

                    <Button size="sm" variant="outline" onClick={() => viewDetails(test)}>
                      Details
                    </Button>
                  </div>
                </div>

                {/* Recommendation */}
                {test.status === 'running' && test.winner && (
                  <div className="p-3 bg-primary/5 border border-primary/20 rounded-lg">
                    <div className="flex items-start gap-2">
                      {test.confidence >= 0.95 ? (
                        <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                      ) : (
                        <AlertCircle className="w-5 h-5 text-yellow-500 flex-shrink-0 mt-0.5" />
                      )}
                      <div>
                        <p className="font-medium text-sm mb-1">
                          {test.confidence >= 0.95 ? 'Ready to Deploy' : 'Continue Testing'}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {test.confidence >= 0.95
                            ? `${test.winner} is the clear winner with ${confidencePercent}% confidence. Consider stopping the test and rolling out the winner.`
                            : `Current confidence level (${confidencePercent}%) is below the 95% threshold. Continue running the test to gather more data.`
                          }
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </Card>
            );
          })}
        </div>
      </div>

      {/* Create Test Dialog */}
      <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Create A/B Test</DialogTitle>
            <DialogDescription>
              Set up a new A/B test to compare agent variants
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium mb-2 block">Test Name</label>
              <Input placeholder="e.g., GPT-4 vs Claude 3 Comparison" />
            </div>

            <div>
              <label className="text-sm font-medium mb-2 block">Select Agent</label>
              <Input placeholder="Search agents..." />
            </div>

            <div>
              <label className="text-sm font-medium mb-2 block">Test Type</label>
              <div className="grid grid-cols-2 gap-3">
                <Card className="p-4 cursor-pointer border-2 border-primary">
                  <h4 className="font-medium mb-1">A/B Test</h4>
                  <p className="text-xs text-muted-foreground">Compare 2 variants</p>
                </Card>
                <Card className="p-4 cursor-pointer hover:border-primary">
                  <h4 className="font-medium mb-1">Multi-variate</h4>
                  <p className="text-xs text-muted-foreground">Compare 3+ variants</p>
                </Card>
              </div>
            </div>

            <div>
              <label className="text-sm font-medium mb-2 block">Variants</label>
              <div className="space-y-2">
                <Card className="p-3">
                  <Input placeholder="Variant A name" className="mb-2" />
                  <Input placeholder="Configuration (JSON)" />
                </Card>
                <Card className="p-3">
                  <Input placeholder="Variant B name" className="mb-2" />
                  <Input placeholder="Configuration (JSON)" />
                </Card>
              </div>
              <Button variant="outline" size="sm" className="mt-2 gap-2">
                <Plus className="w-4 h-4" />
                Add Variant
              </Button>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowCreateDialog(false)}>
              Cancel
            </Button>
            <Button onClick={() => { toast.success('Test created'); setShowCreateDialog(false); }}>
              Create Test
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Gradual Rollout Dialog */}
      <Dialog open={showRolloutDialog} onOpenChange={setShowRolloutDialog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Gradual Rollout Plan</DialogTitle>
            <DialogDescription>
              Slowly increase traffic to the winning variant over 7 days
            </DialogDescription>
          </DialogHeader>

          {selectedTest && selectedTest.winner && (
            <div className="space-y-4">
              <div className="p-4 bg-green-500/10 border border-green-500/20 rounded-lg">
                <div className="flex items-center gap-2 mb-1">
                  <Trophy className="w-5 h-5 text-yellow-500" />
                  <p className="font-semibold">Winner: {selectedTest.winner}</p>
                </div>
                <p className="text-sm text-muted-foreground">
                  Confidence: {(selectedTest.confidence * 100).toFixed(1)}%
                </p>
              </div>

              <div>
                <h4 className="font-medium mb-3">Rollout Schedule</h4>
                <div className="space-y-3">
                  {[
                    { day: 0, percentage: 10 },
                    { day: 1, percentage: 25 },
                    { day: 2, percentage: 50 },
                    { day: 4, percentage: 75 },
                    { day: 5, percentage: 90 },
                    { day: 7, percentage: 100 }
                  ].map(step => (
                    <div key={step.day} className="flex items-center gap-4">
                      <div className="w-20 text-sm text-muted-foreground">
                        Day {step.day}
                      </div>
                      <div className="flex-1">
                        <Progress value={step.percentage} className="h-3" />
                      </div>
                      <div className="w-16 text-sm font-semibold text-right">
                        {step.percentage}%
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="p-3 bg-muted rounded-lg">
                <p className="text-sm text-muted-foreground">
                  This gradual rollout will slowly shift traffic to the winning variant while monitoring for any issues.
                  You can pause or adjust the rollout at any time.
                </p>
              </div>
            </div>
          )}

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowRolloutDialog(false)}>
              Cancel
            </Button>
            <Button onClick={() => { toast.success('Gradual rollout started'); setShowRolloutDialog(false); }}>
              Start Rollout
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
