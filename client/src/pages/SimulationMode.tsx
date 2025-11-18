import { useState, useEffect } from 'react';
import { Play, Pause, SkipForward, SkipBack, RotateCcw, FastForward } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { useApi } from '@/hooks/useApi';
import { toast } from 'sonner';

interface SimulationState {
  workflow_id: string;
  current_step: number;
  total_steps: number;
  is_running: boolean;
  is_paused: boolean;
  agents: any[];
  connections: any[];
  message_log: any[];
  execution_log: any[];
}

interface MessageFlowItem {
  from: string;
  to: string;
  type: string;
  timestamp: string;
  data_preview: string;
}

interface TimelineItem {
  step: number;
  agent: string;
  action: string;
  duration_ms: number;
  timestamp: string;
}

export default function SimulationMode() {
  const api = useApi();
  const [selectedWorkflow, setSelectedWorkflow] = useState<string>('');
  const [workflows, setWorkflows] = useState<any[]>([]);
  const [simulationState, setSimulationState] = useState<SimulationState | null>(null);
  const [messageFlow, setMessageFlow] = useState<MessageFlowItem[]>([]);
  const [timeline, setTimeline] = useState<TimelineItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // Load workflows
  useEffect(() => {
    loadWorkflows();
  }, []);

  const loadWorkflows = async () => {
    try {
      const response = await api.getFlows();
      setWorkflows(response.data || []);
    } catch (error) {
      console.error('Failed to load workflows:', error);
    }
  };

  const startSimulation = async () => {
    if (!selectedWorkflow) {
      toast.error('Please select a workflow first');
      return;
    }

    setIsLoading(true);
    try {
      // Direct fetch for simulation endpoints (not yet in useApi hook)
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/simulation/start`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ workflow_id: selectedWorkflow })
      });
      
      if (!response.ok) throw new Error('Failed to start simulation');

      await refreshState();
      toast.success('Simulation started');
    } catch (error: any) {
      toast.error(error.message || 'Failed to start simulation');
    } finally {
      setIsLoading(false);
    }
  };

  const refreshState = async () => {
    if (!selectedWorkflow) return;

    try {
      const baseUrl = import.meta.env.VITE_API_BASE_URL;
      const [stateRes, flowRes, timelineRes] = await Promise.all([
        fetch(`${baseUrl}/api/simulation/state?workflow_id=${selectedWorkflow}`),
        fetch(`${baseUrl}/api/simulation/message-flow?workflow_id=${selectedWorkflow}`),
        fetch(`${baseUrl}/api/simulation/execution-timeline?workflow_id=${selectedWorkflow}`)
      ]);

      const state = await stateRes.json();
      const flow = await flowRes.json();
      const timelineData = await timelineRes.json();

      setSimulationState(state);
      setMessageFlow(flow.flow || []);
      setTimeline(timelineData.timeline || []);
    } catch (error) {
      console.error('Failed to refresh state:', error);
    }
  };

  const stepForward = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/api/simulation/step-forward?workflow_id=${selectedWorkflow}`,
        { method: 'POST' }
      );
      if (!response.ok) throw new Error('Failed to step forward');
      await refreshState();
    } catch (error: any) {
      toast.error(error.message || 'Failed to step forward');
    } finally {
      setIsLoading(false);
    }
  };

  const stepBackward = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/api/simulation/step-backward?workflow_id=${selectedWorkflow}`,
        { method: 'POST' }
      );
      if (!response.ok) throw new Error('Failed to step backward');
      await refreshState();
    } catch (error: any) {
      toast.error(error.message || 'Failed to step backward');
    } finally {
      setIsLoading(false);
    }
  };

  const runToCompletion = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/api/simulation/run-to-completion?workflow_id=${selectedWorkflow}`,
        { method: 'POST' }
      );
      if (!response.ok) throw new Error('Failed to run simulation');
      await refreshState();
      toast.success('Simulation completed');
    } catch (error: any) {
      toast.error(error.message || 'Failed to run simulation');
    } finally {
      setIsLoading(false);
    }
  };

  const resetSimulation = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/api/simulation/stop?workflow_id=${selectedWorkflow}`,
        { method: 'DELETE' }
      );
      if (!response.ok) throw new Error('Failed to reset simulation');
      setSimulationState(null);
      setMessageFlow([]);
      setTimeline([]);
      toast.success('Simulation reset');
    } catch (error: any) {
      toast.error(error.message || 'Failed to reset simulation');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold">Simulation Mode</h1>
        <p className="text-muted-foreground mt-2">
          Test workflows step-by-step with visual debugging and time-travel capabilities
        </p>
      </div>

      {/* Workflow Selection */}
      <Card className="p-6">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">Select Workflow</label>
            <select
              value={selectedWorkflow}
              onChange={(e) => setSelectedWorkflow(e.target.value)}
              className="w-full px-3 py-2 border rounded-lg bg-background"
            >
              <option value="">Choose a workflow...</option>
              {workflows.map((workflow) => (
                <option key={workflow.id} value={workflow.id}>
                  {workflow.name}
                </option>
              ))}
            </select>
          </div>

          <div className="flex gap-2">
            <Button onClick={startSimulation} disabled={!selectedWorkflow || isLoading}>
              <Play className="w-4 h-4 mr-2" />
              Start Simulation
            </Button>
            <Button onClick={resetSimulation} variant="outline" disabled={!simulationState}>
              <RotateCcw className="w-4 h-4 mr-2" />
              Reset
            </Button>
          </div>
        </div>
      </Card>

      {simulationState && (
        <>
          {/* Controls */}
          <Card className="p-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-semibold">Simulation Controls</h3>
                  <p className="text-sm text-muted-foreground">
                    Step {simulationState.current_step} of {simulationState.total_steps}
                  </p>
                </div>

                <div className="flex gap-2">
                  <Button
                    onClick={stepBackward}
                    variant="outline"
                    size="sm"
                    disabled={simulationState.current_step === 0 || isLoading}
                  >
                    <SkipBack className="w-4 h-4" />
                  </Button>
                  <Button
                    onClick={stepForward}
                    size="sm"
                    disabled={simulationState.current_step >= simulationState.total_steps || isLoading}
                  >
                    <SkipForward className="w-4 h-4" />
                  </Button>
                  <Button
                    onClick={runToCompletion}
                    variant="outline"
                    size="sm"
                    disabled={simulationState.current_step >= simulationState.total_steps || isLoading}
                  >
                    <FastForward className="w-4 h-4 mr-2" />
                    Run to End
                  </Button>
                </div>
              </div>

              {/* Progress Bar */}
              <div className="w-full bg-muted rounded-full h-2">
                <div
                  className="bg-primary h-2 rounded-full transition-all"
                  style={{
                    width: `${(simulationState.current_step / simulationState.total_steps) * 100}%`
                  }}
                />
              </div>
            </div>
          </Card>

          {/* Visual Debugging */}
          <div className="grid grid-cols-2 gap-6">
            {/* Message Flow */}
            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-4">Message Flow</h3>
              <div className="space-y-3 max-h-96 overflow-y-auto">
                {messageFlow.length === 0 ? (
                  <p className="text-sm text-muted-foreground">No messages yet. Step forward to see message flow.</p>
                ) : (
                  messageFlow.map((msg, idx) => (
                    <div key={idx} className="border rounded-lg p-3 space-y-2">
                      <div className="flex items-center gap-2 text-sm">
                        <span className="font-medium">{msg.from}</span>
                        <span className="text-muted-foreground">→</span>
                        <span className="font-medium">{msg.to}</span>
                      </div>
                      <div className="text-xs text-muted-foreground">
                        <span className="px-2 py-1 bg-muted rounded">{msg.type}</span>
                      </div>
                      <div className="text-xs text-muted-foreground font-mono bg-muted p-2 rounded">
                        {msg.data_preview}
                      </div>
                    </div>
                  ))
                )}
              </div>
            </Card>

            {/* Execution Timeline */}
            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-4">Execution Timeline</h3>
              <div className="space-y-3 max-h-96 overflow-y-auto">
                {timeline.length === 0 ? (
                  <p className="text-sm text-muted-foreground">No executions yet. Step forward to see timeline.</p>
                ) : (
                  timeline.map((item, idx) => (
                    <div key={idx} className="border-l-2 border-primary pl-4 pb-3">
                      <div className="flex items-center justify-between">
                        <span className="font-medium text-sm">{item.agent}</span>
                        <span className="text-xs text-muted-foreground">{item.duration_ms}ms</span>
                      </div>
                      <div className="text-xs text-muted-foreground mt-1">{item.action}</div>
                      <div className="text-xs text-muted-foreground mt-1">
                        Step {item.step + 1}
                      </div>
                    </div>
                  ))
                )}
              </div>
            </Card>
          </div>

          {/* Agent States */}
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4">Agent States</h3>
            <div className="grid grid-cols-3 gap-4">
              {simulationState.agents.map((agent) => (
                <div key={agent.id} className="border rounded-lg p-4">
                  <div className="font-medium">{agent.name}</div>
                  <div className="text-sm text-muted-foreground mt-1">{agent.template_name}</div>
                  <div className="mt-2">
                    <span className="px-2 py-1 bg-green-500/10 text-green-500 text-xs rounded">
                      {agent.status || 'Ready'}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </>
      )}
    </div>
  );
}
