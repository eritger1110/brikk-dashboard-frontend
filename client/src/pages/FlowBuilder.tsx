import { useCallback, useState } from 'react';
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
} from 'reactflow';
import 'reactflow/dist/style.css';
import DashboardLayout from '@/components/layout/DashboardLayout';
import WorkflowNode, { NodeData } from '@/components/workflow/WorkflowNode';
import { Save, Play, ArrowLeft } from 'lucide-react';
import { Link } from 'wouter';

const nodeTypes = {
  workflowNode: WorkflowNode,
};

const initialNodes: Node<NodeData>[] = [
  {
    id: '1',
    type: 'workflowNode',
    position: { x: 100, y: 100 },
    data: {
      label: 'SAP Inventory Change',
      type: 'trigger',
      description: 'Monitor: Product SKU-12345',
      configured: true,
    },
  },
  {
    id: '2',
    type: 'workflowNode',
    position: { x: 400, y: 100 },
    data: {
      label: 'Check Thresholds',
      type: 'condition',
      description: 'Inventory < 10 AND Forecast > 50',
      configured: true,
    },
  },
  {
    id: '3',
    type: 'workflowNode',
    position: { x: 700, y: 50 },
    data: {
      label: 'Send Slack Alert',
      type: 'action',
      description: '#ops-alerts: Low inventory alert',
      configured: true,
    },
  },
  {
    id: '4',
    type: 'workflowNode',
    position: { x: 700, y: 200 },
    data: {
      label: 'Create Salesforce Order',
      type: 'action',
      description: 'Account: Auto-supplier, Qty: 50',
      configured: true,
    },
  },
  {
    id: '5',
    type: 'workflowNode',
    position: { x: 700, y: 350 },
    data: {
      label: 'Log to Snowflake',
      type: 'action',
      description: 'Table: inventory_events',
      configured: true,
    },
  },
];

const initialEdges: Edge[] = [
  { id: 'e1-2', source: '1', target: '2', animated: true },
  { id: 'e2-3', source: '2', target: '3', label: 'True' },
  { id: 'e2-4', source: '2', target: '4', label: 'True' },
  { id: 'e2-5', source: '2', target: '5', label: 'True' },
];

export default function FlowBuilder() {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
  const [workflowName, setWorkflowName] = useState('Auto-Reorder Low Inventory');

  const onConnect = useCallback(
    (params: Connection) => setEdges((eds) => addEdge(params, eds)),
    [setEdges]
  );

  return (
    <DashboardLayout>
      <div className="space-y-4">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/workflows">
              <a className="rounded-lg p-2 hover:bg-accent transition-colors">
                <ArrowLeft className="h-5 w-5 text-muted-foreground" />
              </a>
            </Link>
            <div>
              <input
                type="text"
                value={workflowName}
                onChange={(e) => setWorkflowName(e.target.value)}
                className="text-2xl font-bold bg-transparent border-none focus:outline-none focus:ring-2 focus:ring-primary rounded px-2"
              />
              <p className="text-sm text-muted-foreground mt-1">
                Dashboard &gt; Flow Builder &gt; {workflowName}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button className="inline-flex items-center gap-2 rounded-lg border border-border px-4 py-2 text-sm font-medium hover:bg-accent transition-colors">
              <Play className="h-4 w-4" />
              Run Simulation
            </button>
            <button className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors">
              <Save className="h-4 w-4" />
              Save & Publish
            </button>
          </div>
        </div>

        {/* Canvas */}
        <div className="rounded-lg border border-border bg-card overflow-hidden" style={{ height: 'calc(100vh - 16rem)' }}>
          <ReactFlow
            nodes={nodes}
            edges={edges}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            onConnect={onConnect}
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

        {/* Node Palette */}
        <div className="rounded-lg border border-border bg-card p-4">
          <h3 className="text-sm font-semibold text-foreground mb-3">Add Nodes</h3>
          <div className="flex flex-wrap gap-2">
            <button className="inline-flex items-center gap-2 rounded-lg border-2 border-blue-500 bg-blue-50 dark:bg-blue-950 px-3 py-2 text-sm font-medium text-blue-700 dark:text-blue-300 hover:bg-blue-100 dark:hover:bg-blue-900 transition-colors">
              <div className="h-3 w-3 rounded-sm bg-blue-500"></div>
              Trigger
            </button>
            <button className="inline-flex items-center gap-2 rounded-lg border-2 border-purple-500 bg-purple-50 dark:bg-purple-950 px-3 py-2 text-sm font-medium text-purple-700 dark:text-purple-300 hover:bg-purple-100 dark:hover:bg-purple-900 transition-colors">
              <div className="h-3 w-3 rounded-sm bg-purple-500"></div>
              Condition
            </button>
            <button className="inline-flex items-center gap-2 rounded-lg border-2 border-green-500 bg-green-50 dark:bg-green-950 px-3 py-2 text-sm font-medium text-green-700 dark:text-green-300 hover:bg-green-100 dark:hover:bg-green-900 transition-colors">
              <div className="h-3 w-3 rounded-sm bg-green-500"></div>
              Action
            </button>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}

