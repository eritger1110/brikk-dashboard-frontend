import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Play, Pause, RotateCcw, Sparkles } from 'lucide-react';
import { allDemoFlows, DemoFlow } from '@/lib/demo-flows';
import DemoExecutionCanvas from '@/components/demo/DemoExecutionCanvas';
import ROIMetricsPanel from '@/components/demo/ROIMetricsPanel';
import { Switch } from '@/components/ui/switch';

export default function DemoGallery() {
  const [selectedFlow, setSelectedFlow] = useState<DemoFlow | null>(null);
  const [isSimulationMode, setIsSimulationMode] = useState(true);
  const [isExecuting, setIsExecuting] = useState(false);
  const [executionComplete, setExecutionComplete] = useState(false);

  const handleStartDemo = (flow: DemoFlow) => {
    setSelectedFlow(flow);
    setIsExecuting(false);
    setExecutionComplete(false);
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
  };

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
          <div className="flex items-center gap-3 bg-card border border-border rounded-lg px-4 py-2">
            <Sparkles className={`h-4 w-4 ${isSimulationMode ? 'text-primary' : 'text-muted-foreground'}`} />
            <span className="text-sm font-medium">Simulation Mode</span>
            <Switch
              checked={isSimulationMode}
              onCheckedChange={setIsSimulationMode}
            />
            <span className={`text-xs ${isSimulationMode ? 'text-primary' : 'text-muted-foreground'}`}>
              {isSimulationMode ? 'ON' : 'OFF'}
            </span>
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
                className="p-6 hover:border-primary/50 transition-all cursor-pointer group"
                onClick={() => handleStartDemo(flow)}
              >
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
        {selectedFlow && (
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
                    <h2 className="text-2xl font-bold">{selectedFlow.name}</h2>
                    <p className="text-sm text-muted-foreground">{selectedFlow.description}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
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
    </DashboardLayout>
  );
}

