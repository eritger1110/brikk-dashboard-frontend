import DashboardLayout from '@/components/layout/DashboardLayout';
import { Search, Plus, Play, Edit, Trash2, Copy } from 'lucide-react';
import { Link } from 'wouter';

interface Workflow {
  id: string;
  name: string;
  description: string;
  status: 'active' | 'draft' | 'paused';
  lastRun: string;
  executions: number;
  successRate: number;
}

const BrikkFlows: Workflow[] = [
  {
    id: '1',
    name: 'Auto-Reorder Low Inventory',
    description: 'Monitors SAP inventory and creates Salesforce orders when stock is low',
    status: 'active',
    lastRun: '2 minutes ago',
    executions: 127,
    successRate: 99.2,
  },
  {
    id: '2',
    name: 'Customer Onboarding',
    description: 'Automates new customer setup across Salesforce, Zendesk, and Slack',
    status: 'active',
    lastRun: '5 minutes ago',
    executions: 89,
    successRate: 100,
  },
  {
    id: '3',
    name: 'Quality Control Alerts',
    description: 'Monitors production data and sends alerts when quality metrics degrade',
    status: 'active',
    lastRun: '8 minutes ago',
    executions: 234,
    successRate: 97.4,
  },
  {
    id: '4',
    name: 'Demand Forecasting',
    description: 'Uses Mistral AI to predict demand and adjust inventory thresholds',
    status: 'paused',
    lastRun: '2 hours ago',
    executions: 12,
    successRate: 75.0,
  },
  {
    id: '5',
    name: 'Supplier Communication',
    description: 'Sends automated updates to suppliers via email when orders are placed',
    status: 'draft',
    lastRun: 'Never',
    executions: 0,
    successRate: 0,
  },
];

const statusConfig = {
  active: {
    badge: 'badge-success',
    label: 'Active',
  },
  draft: {
    badge: 'badge-secondary',
    label: 'Draft',
  },
  paused: {
    badge: 'badge-warning',
    label: 'Paused',
  },
};

function WorkflowRow({ BrikkFlow }: { BrikkFlow: Workflow }) {
  const config = statusConfig[BrikkFlow.status];

  return (
    <div className="flex items-center justify-between py-4 px-6 border-b border-border last:border-0 hover:bg-accent/50 transition-colors">
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-3 mb-1">
          <h3 className="text-base font-semibold text-foreground truncate">
            {BrikkFlow.name}
          </h3>
          <span className={config.badge}>{config.label}</span>
        </div>
        <p className="text-sm text-muted-foreground line-clamp-1">
          {BrikkFlow.description}
        </p>
      </div>

      <div className="flex items-center gap-8 ml-6">
        <div className="text-right">
          <p className="text-xs text-muted-foreground">Last Run</p>
          <p className="text-sm font-medium text-foreground">{BrikkFlow.lastRun}</p>
        </div>
        <div className="text-right">
          <p className="text-xs text-muted-foreground">Executions</p>
          <p className="text-sm font-medium text-foreground">{BrikkFlow.executions}</p>
        </div>
        <div className="text-right">
          <p className="text-xs text-muted-foreground">Success Rate</p>
          <p className="text-sm font-medium text-foreground">{BrikkFlow.successRate}%</p>
        </div>

        <div className="flex items-center gap-2">
          <Link href="/flow-builder">
            <a className="rounded-lg p-2 hover:bg-accent transition-colors" title="Edit">
              <Edit className="h-4 w-4 text-muted-foreground" />
            </a>
          </Link>
          <button className="rounded-lg p-2 hover:bg-accent transition-colors" title="Duplicate">
            <Copy className="h-4 w-4 text-muted-foreground" />
          </button>
          <button className="rounded-lg p-2 hover:bg-accent transition-colors" title="Delete">
            <Trash2 className="h-4 w-4 text-muted-foreground" />
          </button>
        </div>
      </div>
    </div>
  );
}

export default function Workflows() {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Page header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Workflows</h1>
            <p className="mt-2 text-muted-foreground">
              Manage and monitor your automation BrikkFlows
            </p>
          </div>
          <Link href="/flow-builder">
            <a className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors">
              <Plus className="h-4 w-4" />
              Create Workflow
            </a>
          </Link>
        </div>

        {/* Filters */}
        <div className="flex items-center gap-4">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search BrikkFlows..."
              className="w-full rounded-lg border border-input bg-background pl-10 pr-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
            />
          </div>
          <select className="rounded-lg border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring">
            <option>All statuses</option>
            <option>Active</option>
            <option>Draft</option>
            <option>Paused</option>
          </select>
          <select className="rounded-lg border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring">
            <option>Sort by: Last modified</option>
            <option>Sort by: Name</option>
            <option>Sort by: Executions</option>
            <option>Sort by: Success rate</option>
          </select>
        </div>

        {/* Workflows Table */}
        <div className="rounded-lg border border-border bg-card overflow-hidden">
          {BrikkFlows.map((BrikkFlow) => (
            <WorkflowRow key={BrikkFlow.id} BrikkFlow={BrikkFlow} />
          ))}
        </div>

        {/* Empty State (hidden when BrikkFlows exist) */}
        {/* <div className="rounded-lg border border-dashed border-border bg-card p-12 text-center">
          <div className="flex flex-col items-center gap-4">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
              <Play className="h-8 w-8 text-primary" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-foreground mb-2">No BrikkFlows yet</h3>
              <p className="text-sm text-muted-foreground max-w-md">
                Get started by creating your first BrikkFlow. Connect triggers, conditions, and actions to automate your business processes.
              </p>
            </div>
            <Link href="/flow-builder">
              <a className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors">
                <Plus className="h-4 w-4" />
                Create Your First Workflow
              </a>
            </Link>
          </div>
        </div> */}
      </div>
    </DashboardLayout>
  );
}

