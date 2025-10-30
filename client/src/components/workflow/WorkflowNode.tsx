import { memo } from 'react';
import { Handle, Position, NodeProps } from 'reactflow';
import { Database, Zap, GitBranch, Play, Settings } from 'lucide-react';

export type NodeData = {
  label: string;
  type: 'trigger' | 'condition' | 'action';
  description?: string;
  configured?: boolean;
  icon?: string;
};

const nodeIcons = {
  trigger: Zap,
  condition: GitBranch,
  action: Play,
};

const nodeColors = {
  trigger: {
    border: 'border-blue-500',
    bg: 'bg-blue-50 dark:bg-blue-950',
    header: 'bg-blue-500',
    icon: 'text-blue-500',
  },
  condition: {
    border: 'border-purple-500',
    bg: 'bg-purple-50 dark:bg-purple-950',
    header: 'bg-purple-500',
    icon: 'text-purple-500',
  },
  action: {
    border: 'border-green-500',
    bg: 'bg-green-50 dark:bg-green-950',
    header: 'bg-green-500',
    icon: 'text-green-500',
  },
};

function WorkflowNode({ data, selected }: NodeProps<NodeData>) {
  const Icon = nodeIcons[data.type];
  const colors = nodeColors[data.type];

  return (
    <div
      className={`workflow-node ${colors.border} ${
        selected ? 'ring-2 ring-primary ring-offset-2' : ''
      } bg-card`}
    >
      {/* Input handle */}
      <Handle
        type="target"
        position={Position.Left}
        className={`!${colors.bg} !${colors.border}`}
      />

      {/* Node header */}
      <div className={`${colors.header} flex items-center gap-2 rounded-t-xl px-4 py-2`}>
        <Icon className="h-5 w-5 text-white" />
        <span className="text-sm font-semibold text-white">{data.label}</span>
        <button className="ml-auto rounded p-1 hover:bg-white/20 transition-colors">
          <Settings className="h-4 w-4 text-white" />
        </button>
      </div>

      {/* Node body */}
      <div className="p-4">
        {data.configured ? (
          <p className="text-sm text-foreground">{data.description}</p>
        ) : (
          <p className="text-sm text-muted-foreground italic">Click to configure</p>
        )}
      </div>

      {/* Output handle */}
      <Handle
        type="source"
        position={Position.Right}
        className={`!${colors.bg} !${colors.border}`}
      />
    </div>
  );
}

export default memo(WorkflowNode);

