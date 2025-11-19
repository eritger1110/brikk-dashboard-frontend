import { useState, useCallback } from "react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import ReactFlow, {
  Node,
  Edge,
  Background,
  Controls,
  MiniMap,
  useNodesState,
  useEdgesState,
  addEdge,
  Connection,
  MarkerType,
} from "reactflow";
import "reactflow/dist/style.css";
import {
  Workflow,
  Plus,
  Play,
  Save,
  Download,
  Upload,
  Zap,
  GitBranch,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { brikkColors } from "@/lib/palette";

// Initial BrikkFlow nodes for demonstration
const initialNodes: Node[] = [
  {
    id: "trigger-1",
    type: "input",
    position: { x: 250, y: 50 },
    data: {
      label: (
        <div className="flex items-center gap-2">
          <Zap className="h-4 w-4" style={{ color: brikkColors.lime }} />
          <span>Trigger: New Order</span>
        </div>
      ),
    },
    style: {
      background: brikkColors.lime + "20",
      border: `2px solid ${brikkColors.lime}`,
      borderRadius: "12px",
      padding: "12px 16px",
      fontSize: "13px",
      fontWeight: 500,
      minWidth: "180px",
    },
  },
  {
    id: "condition-1",
    type: "default",
    position: { x: 250, y: 150 },
    data: {
      label: (
        <div className="flex items-center gap-2">
          <GitBranch className="h-4 w-4" style={{ color: brikkColors.cyan }} />
          <span>Condition: Amount {'>'} $100</span>
        </div>
      ),
    },
    style: {
      background: brikkColors.cyan + "20",
      border: `2px solid ${brikkColors.cyan}`,
      borderRadius: "12px",
      padding: "12px 16px",
      fontSize: "13px",
      fontWeight: 500,
      minWidth: "200px",
    },
  },
  {
    id: "action-1",
    type: "output",
    position: { x: 100, y: 280 },
    data: {
      label: (
        <div className="flex items-center gap-2">
          <CheckCircle2 className="h-4 w-4" style={{ color: brikkColors.blue }} />
          <span>Action: Send to Agent A</span>
        </div>
      ),
    },
    style: {
      background: brikkColors.blue + "20",
      border: `2px solid ${brikkColors.blue}`,
      borderRadius: "12px",
      padding: "12px 16px",
      fontSize: "13px",
      fontWeight: 500,
      minWidth: "190px",
    },
  },
  {
    id: "action-2",
    type: "output",
    position: { x: 400, y: 280 },
    data: {
      label: (
        <div className="flex items-center gap-2">
          <AlertCircle className="h-4 w-4" style={{ color: brikkColors.violet }} />
          <span>Action: Send to Agent B</span>
        </div>
      ),
    },
    style: {
      background: brikkColors.violet + "20",
      border: `2px solid ${brikkColors.violet}`,
      borderRadius: "12px",
      padding: "12px 16px",
      fontSize: "13px",
      fontWeight: 500,
      minWidth: "190px",
    },
  },
];

const initialEdges: Edge[] = [
  {
    id: "e-trigger-condition",
    source: "trigger-1",
    target: "condition-1",
    animated: true,
    style: { stroke: brikkColors.lime, strokeWidth: 2 },
    markerEnd: { type: MarkerType.ArrowClosed, color: brikkColors.lime },
  },
  {
    id: "e-condition-action1",
    source: "condition-1",
    target: "action-1",
    animated: false,
    style: { stroke: brikkColors.blue, strokeWidth: 2 },
    markerEnd: { type: MarkerType.ArrowClosed, color: brikkColors.blue },
    label: "Yes",
    labelStyle: { fontSize: 11, fontWeight: 600 },
  },
  {
    id: "e-condition-action2",
    source: "condition-1",
    target: "action-2",
    animated: false,
    style: { stroke: brikkColors.violet, strokeWidth: 2 },
    markerEnd: { type: MarkerType.ArrowClosed, color: brikkColors.violet },
    label: "No",
    labelStyle: { fontSize: 11, fontWeight: 600 },
  },
];

export default function BrikkFlows() {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
  const [workflowName, setWorkflowName] = useState("Untitled Workflow");

  const onConnect = useCallback(
    (params: Connection) => setEdges((eds) => addEdge(params, eds)),
    [setEdges]
  );

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">BrikkFlows Builder</h1>
            <p className="text-muted-foreground mt-1">
              Visual BrikkFlow automation with drag-and-drop
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm">
              <Upload className="h-4 w-4 mr-2" />
              Import
            </Button>
            <Button variant="outline" size="sm">
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
            <Button variant="outline" size="sm">
              <Save className="h-4 w-4 mr-2" />
              Save Draft
            </Button>
            <Button className="btn-primary">
              <Play className="h-4 w-4" />
              Test Workflow
            </Button>
          </div>
        </div>

        {/* Workflow Name */}
        <div className="brikk-card">
          <div className="flex items-center gap-4">
            <Workflow className="h-5 w-5 text-muted-foreground" />
            <input
              type="text"
              value={workflowName}
              onChange={(e) => setWorkflowName(e.target.value)}
              className="flex-1 bg-transparent border-none outline-none text-lg font-semibold"
              placeholder="Workflow Name"
            />
            <span className="text-sm text-muted-foreground">
              Last saved: Never
            </span>
          </div>
        </div>

        {/* Canvas */}
        <div className="brikk-card" style={{ height: "600px" }}>
          <ReactFlow
            nodes={nodes}
            edges={edges}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            onConnect={onConnect}
            fitView
            attributionPosition="bottom-left"
          >
            <Background color="var(--border)" gap={16} />
            <Controls />
            <MiniMap
              nodeColor={(node) => {
                const style = node.style as any;
                return style?.border?.split(" ")[2] || brikkColors.blue;
              }}
              maskColor="rgba(0, 0, 0, 0.1)"
              style={{
                backgroundColor: "var(--surface)",
                border: "1px solid var(--border)",
              }}
            />
          </ReactFlow>
        </div>

        {/* Node Palette */}
        <div className="grid gap-4 md:grid-cols-3">
          <div className="brikk-card">
            <div className="flex items-center gap-3 mb-3">
              <div
                className="flex h-10 w-10 items-center justify-center rounded-lg"
                style={{ backgroundColor: `${brikkColors.lime}20` }}
              >
                <Zap className="h-5 w-5" style={{ color: brikkColors.lime }} />
              </div>
              <div>
                <h4 className="font-semibold">Triggers</h4>
                <p className="text-xs text-muted-foreground">Start BrikkFlows</p>
              </div>
            </div>
            <Button variant="outline" size="sm" className="w-full" disabled>
              <Plus className="h-4 w-4 mr-2" />
              Add Trigger
            </Button>
          </div>

          <div className="brikk-card">
            <div className="flex items-center gap-3 mb-3">
              <div
                className="flex h-10 w-10 items-center justify-center rounded-lg"
                style={{ backgroundColor: `${brikkColors.cyan}20` }}
              >
                <GitBranch className="h-5 w-5" style={{ color: brikkColors.cyan }} />
              </div>
              <div>
                <h4 className="font-semibold">Conditions</h4>
                <p className="text-xs text-muted-foreground">Logic branches</p>
              </div>
            </div>
            <Button variant="outline" size="sm" className="w-full" disabled>
              <Plus className="h-4 w-4 mr-2" />
              Add Condition
            </Button>
          </div>

          <div className="brikk-card">
            <div className="flex items-center gap-3 mb-3">
              <div
                className="flex h-10 w-10 items-center justify-center rounded-lg"
                style={{ backgroundColor: `${brikkColors.blue}20` }}
              >
                <CheckCircle2 className="h-5 w-5" style={{ color: brikkColors.blue }} />
              </div>
              <div>
                <h4 className="font-semibold">Actions</h4>
                <p className="text-xs text-muted-foreground">Execute tasks</p>
              </div>
            </div>
            <Button variant="outline" size="sm" className="w-full" disabled>
              <Plus className="h-4 w-4 mr-2" />
              Add Action
            </Button>
          </div>
        </div>

        {/* Info Notice */}
        <div className="brikk-card border-2 border-dashed">
          <div className="flex items-start gap-4">
            <div
              className="flex h-10 w-10 items-center justify-center rounded-lg flex-shrink-0"
              style={{ backgroundColor: `${brikkColors.violet}20` }}
            >
              <AlertCircle className="h-5 w-5" style={{ color: brikkColors.violet }} />
            </div>
            <div className="flex-1">
              <h4 className="font-semibold mb-2">Visual BrikkFlow Builder Ready</h4>
              <p className="text-sm text-muted-foreground mb-3">
                The BrikkFlow canvas is ready for drag-and-drop BrikkFlow creation. This example shows a basic BrikkFlow structure. Once API endpoints are configured, you'll be able to save, load, and execute real BrikkFlows.
              </p>
              <div className="text-sm space-y-1">
                <p className="font-medium">✅ Features Ready:</p>
                <ul className="list-disc list-inside text-muted-foreground ml-2 space-y-1">
                  <li>Drag-and-drop node positioning</li>
                  <li>Connection drawing between nodes</li>
                  <li>Zoom, pan, and minimap controls</li>
                  <li>Trigger → Condition → Action flow</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}

