import { useState, useCallback, useEffect } from 'react';
import ReactFlow, {
  MiniMap,
  Controls,
  Background,
  useNodesState,
  useEdgesState,
  addEdge,
  Connection,
  Edge,
  BackgroundVariant,
  Node,
  NodeMouseHandler,
} from 'reactflow';
import 'reactflow/dist/style.css';
import DashboardLayout from '@/components/layout/DashboardLayout';
import WorkflowNode, { NodeData } from '@/components/workflow/WorkflowNode';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { 
  Save, 
  Play, 
  ArrowLeft, 
  Plus, 
  Trash2, 
  RefreshCw,
  AlertTriangle,
} from 'lucide-react';
import { Link, useLocation } from 'wouter';
import { useApi } from '@/hooks/useApi';
import { useDemoMode } from '@/contexts/DemoModeContext';
import { toast } from 'sonner';
import type { Flow, FlowNode as ApiFlowNode, FlowEdge as ApiFlowEdge } from '@/types/api';

const nodeTypes = {
  workflowNode: WorkflowNode,
};

export default function FlowBuilder() {
  const api = useApi();
  const { isDemoMode } = useDemoMode();
  const [location, navigate] = useLocation();
  const [nodes, setNodes, onNodesChange] = useNodesState<NodeData>([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const [workflowName, setWorkflowName] = useState('Untitled Workflow');
  const [workflowId, setWorkflowId] = useState<string | null>(null);
  const [selectedNode, setSelectedNode] = useState<Node<NodeData> | null>(null);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  // Parse workflow ID from URL params
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const id = params.get('id');
    if (id) {
      setWorkflowId(id);
      loadWorkflow(id);
    }
  }, []);

  const loadWorkflow = async (id: string) => {
    setLoading(true);
    try {
      const workflow = await api.getFlow(id);
      setWorkflowName(workflow.name);
      
      // Convert API nodes to React Flow nodes
      const flowNodes: Node<NodeData>[] = workflow.graph.nodes.map((node, index) => ({
        id: node.id,
        type: 'workflowNode',
        position: { x: 100 + (index * 300), y: 100 + (Math.floor(index / 3) * 150) },
        data: {
          label: node.label,
          type: (node.type as 'trigger' | 'condition' | 'action') || 'action',
          description: `Node: ${node.label}`,
          configured: true,
        },
      }));

      // Convert API edges to React Flow edges
      const flowEdges: Edge[] = workflow.graph.edges.map(edge => ({
        id: edge.id,
        source: edge.from,
        target: edge.to,
        animated: true,
      }));

      setNodes(flowNodes);
      setEdges(flowEdges);
      toast.success('Workflow loaded successfully');
    } catch (err: any) {
      console.error('Failed to load workflow:', err);
      toast.error('Failed to load workflow');
    } finally {
      setLoading(false);
    }
  };

  const saveWorkflow = async () => {
    setSaving(true);
    try {
      // Convert React Flow nodes to API format
      const apiNodes: ApiFlowNode[] = nodes.map(node => ({
        id: node.id,
        type: node.data.type,
        label: node.data.label,
      }));

      // Convert React Flow edges to API format
      const apiEdges: ApiFlowEdge[] = edges.map(edge => ({
        id: edge.id,
        from: edge.source,
        to: edge.target,
      }));

      const flowData: Partial<Flow> = {
        name: workflowName,
        graph: {
          nodes: apiNodes,
          edges: apiEdges,
        },
      };

      if (workflowId) {
        // Update existing workflow
        await api.updateFlow(workflowId, flowData);
        toast.success('Workflow updated successfully');
      } else {
        // Create new workflow
        const newFlow = await api.createFlow(flowData);
        setWorkflowId(newFlow.id);
        // Update URL with new ID
        window.history.pushState({}, '', `/workflows/builder?id=${newFlow.id}`);
        toast.success('Workflow created successfully');
      }
    } catch (err: any) {
      console.error('Failed to save workflow:', err);
      if (isDemoMode) {
        toast.info('Demo mode: Workflow saved locally (not persisted)');
      } else {
        toast.error('Failed to save workflow');
      }
    } finally {
      setSaving(false);
    }
  };

  const publishWorkflow = async () => {
    if (!workflowId) {
      toast.error('Please save the workflow first');
      return;
    }

    try {
      await api.publishFlow(workflowId);
      toast.success('Workflow published successfully');
    } catch (err: any) {
      console.error('Failed to publish workflow:', err);
      toast.error('Failed to publish workflow');
    }
  };

  const addNode = (type: 'trigger' | 'condition' | 'action') => {
    const id = `node-${Date.now()}`;
    const newNode: Node<NodeData> = {
      id,
      type: 'workflowNode',
      position: { 
        x: 100 + (nodes.length * 50), 
        y: 100 + (nodes.length * 50) 
      },
      data: {
        label: `New ${type.charAt(0).toUpperCase() + type.slice(1)}`,
        type,
        description: 'Click to configure',
        configured: false,
      },
    };
    setNodes((nds) => [...nds, newNode]);
    toast.success(`${type.charAt(0).toUpperCase() + type.slice(1)} node added`);
  };

  const deleteSelectedNode = () => {
    if (!selectedNode) {
      toast.error('No node selected');
      return;
    }

    setNodes((nds) => nds.filter((n) => n.id !== selectedNode.id));
    setEdges((eds) => eds.filter((e) => e.source !== selectedNode.id && e.target !== selectedNode.id));
    setSelectedNode(null);
    toast.success('Node deleted');
  };

  const onConnect = useCallback(
    (params: Connection) => setEdges((eds) => addEdge(params, eds)),
    [setEdges]
  );

  const onNodeClick: NodeMouseHandler = useCallback((event, node) => {
    setSelectedNode(node as Node<NodeData>);
  }, []);

  if (loading) {
    return (
      <DashboardLayout>
        <div className="container mx-auto py-8">
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="text-center">
              <RefreshCw className="w-12 h-12 animate-spin text-primary mx-auto mb-4" />
              <p className="text-muted-foreground">Loading workflow...</p>
            </div>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-4">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/workflows">
              <Button variant="ghost" size="icon">
                <ArrowLeft className="h-5 w-5" />
              </Button>
            </Link>
            <div>
              <Input
                type="text"
                value={workflowName}
                onChange={(e) => setWorkflowName(e.target.value)}
                className="text-2xl font-bold border-none shadow-none focus-visible:ring-0 px-2"
              />
              <p className="text-sm text-muted-foreground mt-1">
                Dashboard &gt; Workflows &gt; Builder
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Button variant="outline" onClick={() => toast.info('Simulation feature coming soon')}>
              <Play className="h-4 w-4 mr-2" />
              Run Simulation
            </Button>
            <Button onClick={saveWorkflow} disabled={saving}>
              <Save className="h-4 w-4 mr-2" />
              {saving ? 'Saving...' : 'Save'}
            </Button>
            <Button onClick={publishWorkflow} disabled={!workflowId}>
              <Play className="h-4 w-4 mr-2" />
              Publish
            </Button>
          </div>
        </div>

        {/* Demo Mode Banner */}
        {isDemoMode && (
          <Card className="p-4 bg-amber-500/10 border-amber-500/20">
            <div className="flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-amber-500" />
              <p className="text-sm font-medium">
                Demo Mode Active - Changes will not be persisted
              </p>
            </div>
          </Card>
        )}

        {/* Canvas */}
        <div className="rounded-lg border border-border bg-card overflow-hidden" style={{ height: 'calc(100vh - 20rem)' }}>
          <ReactFlow
            nodes={nodes}
            edges={edges}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            onConnect={onConnect}
            onNodeClick={onNodeClick}
            nodeTypes={nodeTypes}
            fitView
            className="bg-background"
          >
            <Controls />
            <MiniMap
              nodeColor={(node) => {
                const data = node.data as NodeData;
                switch (data.type) {
                  case 'trigger':
                    return '#3b82f6';
                  case 'condition':
                    return '#a855f7';
                  case 'action':
                    return '#10b981';
                  default:
                    return '#6b7280';
                }
              }}
              className="!bg-card !border-border"
            />
            <Background variant={BackgroundVariant.Dots} gap={16} size={1} className="!bg-background" />
          </ReactFlow>
        </div>

        {/* Node Palette & Actions */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {/* Add Nodes */}
          <Card className="p-4">
            <h3 className="text-sm font-semibold mb-3">Add Nodes</h3>
            <div className="flex flex-wrap gap-2">
              <Button
                variant="outline"
                onClick={() => addNode('trigger')}
                className="border-blue-500 text-blue-700 dark:text-blue-300 hover:bg-blue-50 dark:hover:bg-blue-950"
              >
                <Plus className="h-4 w-4 mr-2" />
                Trigger
              </Button>
              <Button
                variant="outline"
                onClick={() => addNode('condition')}
                className="border-purple-500 text-purple-700 dark:text-purple-300 hover:bg-purple-50 dark:hover:bg-purple-950"
              >
                <Plus className="h-4 w-4 mr-2" />
                Condition
              </Button>
              <Button
                variant="outline"
                onClick={() => addNode('action')}
                className="border-green-500 text-green-700 dark:text-green-300 hover:bg-green-50 dark:hover:bg-green-950"
              >
                <Plus className="h-4 w-4 mr-2" />
                Action
              </Button>
            </div>
          </Card>

          {/* Selected Node Actions */}
          <Card className="p-4">
            <h3 className="text-sm font-semibold mb-3">Selected Node</h3>
            {selectedNode ? (
              <div className="space-y-3">
                <div>
                  <p className="text-sm font-medium">{selectedNode.data.label}</p>
                  <p className="text-xs text-muted-foreground">Type: {selectedNode.data.type}</p>
                </div>
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={deleteSelectedNode}
                  className="w-full"
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  Delete Node
                </Button>
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">Click a node to select it</p>
            )}
          </Card>
        </div>

        {/* Stats */}
        <Card className="p-4">
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center gap-6">
              <span className="text-muted-foreground">
                Nodes: <span className="font-semibold text-foreground">{nodes.length}</span>
              </span>
              <span className="text-muted-foreground">
                Connections: <span className="font-semibold text-foreground">{edges.length}</span>
              </span>
              {workflowId && (
                <span className="text-muted-foreground">
                  ID: <span className="font-mono text-xs text-foreground">{workflowId}</span>
                </span>
              )}
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs text-muted-foreground">
                {saving ? 'Saving...' : 'Auto-save disabled'}
              </span>
            </div>
          </div>
        </Card>
      </div>
    </DashboardLayout>
  );
}
