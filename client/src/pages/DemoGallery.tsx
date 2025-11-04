import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Play, Pause, RotateCcw, Sparkles, Info, Zap } from 'lucide-react';
import { allDemoFlows, DemoFlow } from '@/lib/demo-flows';
import DemoExecutionCanvas from '@/components/demo/DemoExecutionCanvas';
import ROIMetricsPanel from '@/components/demo/ROIMetricsPanel';
import ResultsPane from '@/components/demo/ResultsPane';
import StoryOverlay from '@/components/demo/StoryOverlay';
import InfoPanel from '@/components/demo/InfoPanel';
import FinaleScreen from '@/components/demo/FinaleScreen';
import { Switch } from '@/components/ui/switch';
import { useSimulation } from '@/contexts/SimulationContext';
import { useResultsPane } from '@/hooks/useResultsPane';

const DEMO_STORIES = {
  'revenue-rescue': {
    description: 'Brikk detects low inventory, forecasts sell-outs, pauses ads, and drafts restock — automatically.',
    goal: 'Prevent revenue loss from inventory stockouts with automated multi-channel response',
    howItWorks: [
      'Monitor inventory levels in real-time across all sales channels',
      'Use AI to forecast demand and predict sell-out timing with 94% accuracy',
      'Automatically coordinate actions across advertising, supply chain, and analytics platforms',
    ],
  },
  'marketing-maestro': {
    description: 'Brikk rewrites creative, reallocates budgets, and reports improvements in real time.',
    goal: 'Optimize campaign performance with AI-powered creative and budget adjustments',
    howItWorks: [
      'Continuously monitor campaign metrics (CTR, sentiment, conversion rates)',
      'Use AI to generate improved headlines and creative variations',
      'Automatically rebalance budgets across platforms to maximize ROI',
    ],
  },
  'operations-genius': {
    description: 'Brikk predicts demand, optimizes pick routes, and drafts restock plans (approval-based).',
    goal: 'Streamline logistics operations with demand forecasting and route optimization',
    howItWorks: [
      'Analyze order patterns and predict demand across warehouse zones',
      'Optimize picker routes using TSP algorithms to reduce travel time',
      'Generate approval-based restock plans with supplier coordination',
    ],
  },
};

export default function DemoGallery() {
  const [selectedFlow, setSelectedFlow] = useState<DemoFlow | null>(null);
  const [isExecuting, setIsExecuting] = useState(false);
  const [executionComplete, setExecutionComplete] = useState(false);
  const [showStoryOverlay, setShowStoryOverlay] = useState(false);
  const [showInfoPanel, setShowInfoPanel] = useState(false);
  const [completedDemos, setCompletedDemos] = useState<Set<string>>(new Set());
  const [showFinale, setShowFinale] = useState(false);

  const { isSimulationMode, isLiveExecutionEnabled, toggleSimulation, toggleLiveExecution } =
    useSimulation();
  const resultsPane = useResultsPane();

  useEffect(() => {
    if (selectedFlow && !showStoryOverlay) {
      setShowStoryOverlay(true);
    }
  }, [selectedFlow]);

  useEffect(() => {
    if (executionComplete && selectedFlow) {
      const newCompleted = new Set(completedDemos);
      newCompleted.add(selectedFlow.id);
      setCompletedDemos(newCompleted);

      // Show finale after completing all 3 demos
      if (newCompleted.size === 3) {
        setTimeout(() => {
          setShowFinale(true);
        }, 3000);
      }
    }
  }, [executionComplete, selectedFlow]);

  const handleStartDemo = (flow: DemoFlow) => {
    setSelectedFlow(flow);
    setIsExecuting(false);
    setExecutionComplete(false);
    setShowStoryOverlay(true);
    resultsPane.clear();
  };

  const handleExecute = () => {
    setIsExecuting(true);
    setExecutionComplete(false);

    // Simulate execution completion
    setTimeout(() => {
      setIsExecuting(false);
      setExecutionComplete(true);
    }, selectedFlow?.duration || 45000);
  };

  const handleReset = () => {
    setIsExecuting(false);
    setExecutionComplete(false);
    resultsPane.clear();
  };

  const handleReplayTrilogy = () => {
    setShowFinale(false);
    setSelectedFlow(null);
    setCompletedDemos(new Set());
    resultsPane.clear();
  };

  const handleBackToGallery = () => {
    setShowFinale(false);
    setSelectedFlow(null);
    resultsPane.clear();
  };

  const currentStory = selectedFlow ? DEMO_STORIES[selectedFlow.id as keyof typeof DEMO_STORIES] : null;

  if (showFinale) {
    return <FinaleScreen onReplayTrilogy={handleReplayTrilogy} onBackToGallery={handleBackToGallery} />;
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold flex items-center gap-3">
              <span className="text-4xl">🎬</span>
              Demo Gallery
            </h1>
            <p className="text-muted-foreground mt-1">
              Experience BrikkFlows in action with three interactive demonstrations
            </p>
          </div>

          {/* Simulation Mode Toggle */}
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-3 bg-card border border-border rounded-lg px-4 py-2">
              <Sparkles className={`h-4 w-4 ${isSimulationMode ? 'text-primary' : 'text-muted-foreground'}`} />
              <span className="text-sm font-medium">Simulation Mode</span>
              <Switch
                checked={isSimulationMode}
                onCheckedChange={toggleSimulation}
              />
              <span className={`text-xs ${isSimulationMode ? 'text-primary' : 'text-muted-foreground'}`}>
                {isSimulationMode ? 'Simulated (safe)' : 'Live API'}
              </span>
            </div>

            {/* Live Execution Toggle (only visible when Simulation OFF) */}
            {!isSimulationMode && (
              <div className="flex items-center gap-3 bg-card border border-border rounded-lg px-4 py-2">
                <Zap className={`h-4 w-4 ${isLiveExecutionEnabled ? 'text-amber-500' : 'text-muted-foreground'}`} />
                <span className="text-sm font-medium">Live Execution</span>
                <Switch
                  checked={isLiveExecutionEnabled}
                  onCheckedChange={toggleLiveExecution}
                />
                {isLiveExecutionEnabled && (
                  <Badge variant="outline" className="text-xs border-amber-500 text-amber-500">
                    ⚡ LIVE
                  </Badge>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Flow Selection Grid */}
        {!selectedFlow && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="grid grid-cols-1 md:grid-cols-3 gap-6"
          >
            {allDemoFlows.map((flow) => (
              <Card
                key={flow.id}
                className="p-6 hover:border-primary/50 transition-all cursor-pointer group relative"
                onClick={() => handleStartDemo(flow)}
              >
                {completedDemos.has(flow.id) && (
                  <div className="absolute top-3 right-3">
                    <Badge variant="outline" className="text-xs border-green-500 text-green-500">
                      ✓ Completed
                    </Badge>
                  </div>
                )}

                <div className="space-y-4">
                  <div className="flex items-start justify-between">
                    <div className="text-5xl">{flow.icon}</div>
                    <Badge variant="outline" style={{ borderColor: flow.color, color: flow.color }}>
                      {flow.category}
                    </Badge>
                  </div>

                  <div>
                    <h3 className="text-xl font-semibold mb-2">{flow.name}</h3>
                    <p className="text-sm text-muted-foreground">{flow.description}</p>
                  </div>

                  <div className="pt-4 border-t border-border">
                    <div className="flex items-center justify-between text-xs text-muted-foreground mb-3">
                      <span>{flow.nodes.length} steps</span>
                      <span>~{Math.round(flow.duration / 1000)}s</span>
                    </div>

                    <Button
                      className="w-full group-hover:bg-primary group-hover:text-primary-foreground"
                      variant="outline"
                    >
                      <Play className="h-4 w-4 mr-2" />
                      Launch Demo
                    </Button>
                  </div>

                  {/* ROI Preview */}
                  <div className="grid grid-cols-3 gap-2 pt-3 border-t border-border">
                    {flow.roiMetrics.map((metric, idx) => (
                      <div key={idx} className="text-center">
                        <div className="text-lg">{metric.icon}</div>
                        <div className="text-xs font-semibold mt-1" style={{ color: metric.color }}>
                          {metric.value}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </Card>
            ))}
          </motion.div>
        )}

        {/* Demo Execution View */}
        {selectedFlow && !showFinale && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="space-y-6"
          >
            {/* Demo Header */}
            <Card className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="text-4xl">{selectedFlow.icon}</div>
                  <div>
                    <div className="flex items-center gap-3">
                      <h2 className="text-2xl font-bold">{selectedFlow.name}</h2>
                      {isLiveExecutionEnabled && (
                        <Badge variant="outline" className="border-amber-500 text-amber-500">
                          ⚡ LIVE EXECUTION
                        </Badge>
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground">{selectedFlow.description}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setShowInfoPanel(true)}
                  >
                    <Info className="h-4 w-4 mr-2" />
                    Info
                  </Button>

                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setSelectedFlow(null)}
                  >
                    ← Back to Gallery
                  </Button>

                  {!isExecuting && !executionComplete && (
                    <Button
                      onClick={handleExecute}
                      className="bg-primary hover:bg-primary/90"
                    >
                      <Play className="h-4 w-4 mr-2" />
                      Start Execution
                    </Button>
                  )}

                  {isExecuting && (
                    <Button disabled className="bg-primary/50">
                      <Pause className="h-4 w-4 mr-2 animate-pulse" />
                      Executing...
                    </Button>
                  )}

                  {executionComplete && (
                    <Button onClick={handleReset} variant="outline">
                      <RotateCcw className="h-4 w-4 mr-2" />
                      Reset
                    </Button>
                  )}
                </div>
              </div>
            </Card>

            {/* Execution Canvas */}
            <DemoExecutionCanvas
              flow={selectedFlow}
              isExecuting={isExecuting}
              executionComplete={executionComplete}
              resultsPane={resultsPane}
              isLiveExecution={isLiveExecutionEnabled}
            />

            {/* ROI Metrics */}
            <AnimatePresence>
              {executionComplete && (
                <ROIMetricsPanel
                  metrics={selectedFlow.roiMetrics}
                  quote={selectedFlow.quote}
                />
              )}
            </AnimatePresence>
          </motion.div>
        )}
      </div>

      {/* Story Overlay */}
      {selectedFlow && showStoryOverlay && currentStory && (
        <StoryOverlay
          title={selectedFlow.name}
          description={currentStory.description}
          icon={selectedFlow.icon}
          color={selectedFlow.color}
          duration={3000}
          onComplete={() => setShowStoryOverlay(false)}
        />
      )}

      {/* Info Panel */}
      {selectedFlow && currentStory && (
        <InfoPanel
          isOpen={showInfoPanel}
          onClose={() => setShowInfoPanel(false)}
          goal={currentStory.goal}
          howItWorks={currentStory.howItWorks}
          businessImpact={selectedFlow.roiMetrics.map((m) => ({
            label: m.label,
            value: m.value,
          }))}
          color={selectedFlow.color}
        />
      )}

      {/* Results Pane */}
      <ResultsPane
        tiles={resultsPane.tiles}
        isOpen={resultsPane.isOpen}
        onClose={() => resultsPane.setIsOpen(false)}
      />
    </DashboardLayout>
  );
}

