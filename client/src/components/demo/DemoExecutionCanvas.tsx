import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Check, Loader2, Zap } from 'lucide-react';
import { DemoFlow, DemoNode } from '@/lib/demo-flows';
import { useResultsPane } from '@/hooks/useResultsPane';

interface DemoExecutionCanvasProps {
  flow: DemoFlow;
  isExecuting: boolean;
  executionComplete: boolean;
  resultsPane: ReturnType<typeof useResultsPane>;
  isLiveExecution: boolean;
}

export default function DemoExecutionCanvas({
  flow,
  isExecuting,
  executionComplete,
  resultsPane,
  isLiveExecution,
}: DemoExecutionCanvasProps) {
  const [activeNodeId, setActiveNodeId] = useState<string | null>(null);
  const [completedNodeIds, setCompletedNodeIds] = useState<Set<string>>(new Set());
  const [nodeResponses, setNodeResponses] = useState<Map<string, any>>(new Map());

  const addResultTile = (node: DemoNode, isLive: boolean) => {
    const response = node.mockResponse;
    if (!response) return;

    // Map node labels to result pane methods
    if (node.label.includes('Slack')) {
      resultsPane.addSlack(
        response.summary || response.message || 'Alert sent',
        response.channel || '#general',
        isLive
      );
    } else if (node.label.includes('Email') || node.label.includes('Reorder')) {
      resultsPane.addEmail(
        response.subject || 'Automated Email',
        response.recipient || 'supplier@example.com',
        response.preview || JSON.stringify(response, null, 2).slice(0, 100),
        isLive
      );
    } else if (node.label.includes('Snowflake') || node.label.includes('Log')) {
      resultsPane.addSheet(
        'Snowflake Analytics',
        { executionId: response.executionId, timestamp: response.timestamp },
        isLive
      );
    } else if (node.label.includes('Rewrite') || node.label.includes('Headline')) {
      resultsPane.addCreative(
        { headline: response.originalHeadline || 'Old Headline', cta: 'Learn More' },
        { headline: response.newHeadline || 'New Headline', cta: 'Get Started' }
      );
    } else if (node.label.includes('Budget') || node.label.includes('Rebalance')) {
      resultsPane.addBudgetShift([
        { platform: 'Google Ads', change: 15 },
        { platform: 'Display', change: -15 },
      ]);
    } else if (node.label.includes('Route') || node.label.includes('Optimize')) {
      resultsPane.addRoute(
        response.totalDistance || 2.3,
        response.reduction || 0.23,
        response.estimatedPickTime || '1.8 hours'
      );
    } else if (node.label.includes('Rebalance Plan') || node.label.includes('Restock Plan')) {
      resultsPane.addPlan(
        response.planId || 'PLAN-001',
        response.moves || [],
        response.status || 'pending approval'
      );
    } else if (node.label.includes('Pause') || node.label.includes('Campaign')) {
      resultsPane.addCampaign(
        response.campaignId || 'Campaign',
        response.status || 'paused',
        response.adSpendSaved
      );
    }
  };

  useEffect(() => {
    if (!isExecuting) {
      setActiveNodeId(null);
      setCompletedNodeIds(new Set());
      setNodeResponses(new Map());
      return;
    }

    // Execute nodes sequentially based on delay + duration
    flow.nodes.forEach((node) => {
      // Start node
      const startTimeout = setTimeout(() => {
        setActiveNodeId(node.id);
      }, node.delay);

      // Complete node
      const completeTimeout = setTimeout(() => {
        setCompletedNodeIds((prev) => new Set(Array.from(prev).concat(node.id)));
        setNodeResponses((prev) => new Map(prev).set(node.id, node.mockResponse));
        setActiveNodeId(null);

        // Add results to pane for action nodes
        if (node.type === 'action') {
          addResultTile(node, isLiveExecution);
        }
      }, node.delay + node.duration);

      return () => {
        clearTimeout(startTimeout);
        clearTimeout(completeTimeout);
      };
    });
  }, [isExecuting, flow]);

  const getNodeStatus = (nodeId: string) => {
    if (completedNodeIds.has(nodeId)) return 'completed';
    if (activeNodeId === nodeId) return 'active';
    return 'pending';
  };

  const getNodeColor = (type: string) => {
    switch (type) {
      case 'trigger':
        return '#3B82F6'; // blue
      case 'condition':
        return '#8B5CF6'; // purple
      case 'action':
        return '#10B981'; // green
      default:
        return '#6B7280'; // gray
    }
  };

  return (
    <Card className="p-8 bg-card/50 backdrop-blur">
      <div className="space-y-8">
        {/* Flow Visualization */}
        <div className="space-y-4">
          {flow.nodes.map((node, index) => {
            const status = getNodeStatus(node.id);
            const response = nodeResponses.get(node.id);

            return (
              <motion.div
                key={node.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="relative"
              >
                {/* Connection Line */}
                {index > 0 && (
                  <div className="absolute left-6 -top-4 w-0.5 h-4 bg-border" />
                )}

                <div
                  className={`flex items-start gap-4 p-4 rounded-lg border-2 transition-all ${
                    status === 'active'
                      ? 'border-primary bg-primary/5 shadow-lg shadow-primary/20'
                      : status === 'completed'
                      ? 'border-green-500/50 bg-green-500/5'
                      : 'border-border bg-background/50'
                  }`}
                >
                  {/* Node Icon */}
                  <div
                    className="flex-shrink-0 w-12 h-12 rounded-full flex items-center justify-center text-white font-semibold"
                    style={{ backgroundColor: getNodeColor(node.type) }}
                  >
                    {status === 'completed' ? (
                      <Check className="h-6 w-6" />
                    ) : status === 'active' ? (
                      <Loader2 className="h-6 w-6 animate-spin" />
                    ) : (
                      <span className="text-sm">{index + 1}</span>
                    )}
                  </div>

                  {/* Node Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3 mb-2">
                      <h4 className="font-semibold">{node.label}</h4>
                      <Badge
                        variant="outline"
                        className="text-xs"
                        style={{ borderColor: getNodeColor(node.type), color: getNodeColor(node.type) }}
                      >
                        {node.type}
                      </Badge>
                      <Badge variant="secondary" className="text-xs">
                        {node.provider}
                      </Badge>
                    </div>

                    {/* Node Config */}
                    <div className="text-xs text-muted-foreground mb-2">
                      {Object.entries(node.config).slice(0, 2).map(([key, value]) => (
                        <span key={key} className="mr-3">
                          <span className="font-medium">{key}:</span> {String(value)}
                        </span>
                      ))}
                    </div>

                    {/* Active Animation */}
                    <AnimatePresence>
                      {status === 'active' && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          exit={{ opacity: 0, height: 0 }}
                          className="mt-3 flex items-center gap-2 text-sm text-primary"
                        >
                          <Zap className="h-4 w-4 animate-pulse" />
                          <span className="font-medium">Executing...</span>
                        </motion.div>
                      )}
                    </AnimatePresence>

                    {/* Response Data */}
                    <AnimatePresence>
                      {status === 'completed' && response && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          exit={{ opacity: 0, height: 0 }}
                          className="mt-3 p-3 bg-green-500/10 border border-green-500/20 rounded text-xs"
                        >
                          <div className="font-medium text-green-600 mb-1 flex items-center gap-2">
                            <Check className="h-3 w-3" />
                            Response
                          </div>
                          <pre className="text-muted-foreground overflow-x-auto">
                            {JSON.stringify(response, null, 2)}
                          </pre>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>

                  {/* Timing Badge */}
                  <div className="flex-shrink-0 text-xs text-muted-foreground">
                    {(node.delay / 1000).toFixed(1)}s
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Progress Bar */}
        {isExecuting && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="space-y-2"
          >
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Execution Progress</span>
              <span className="font-medium">
                {completedNodeIds.size} / {flow.nodes.length} steps
              </span>
            </div>
            <div className="h-2 bg-muted rounded-full overflow-hidden">
              <motion.div
                className="h-full bg-primary"
                initial={{ width: 0 }}
                animate={{ width: `${(completedNodeIds.size / flow.nodes.length) * 100}%` }}
                transition={{ duration: 0.5 }}
              />
            </div>
          </motion.div>
        )}

        {/* Completion Message */}
        <AnimatePresence>
          {executionComplete && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="text-center py-8 space-y-3"
            >
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring', delay: 0.2 }}
                className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-500/20 text-green-500"
              >
                <Check className="h-8 w-8" />
              </motion.div>
              <h3 className="text-2xl font-bold text-green-600">Execution Complete!</h3>
              <p className="text-muted-foreground">
                All {flow.nodes.length} steps executed successfully in {(flow.duration / 1000).toFixed(1)} seconds
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </Card>
  );
}

