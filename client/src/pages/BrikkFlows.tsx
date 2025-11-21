import { useEffect, useState } from 'react';
import { Link } from 'wouter';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  GitBranch,
  Plus,
  Search,
  Play,
  Pause,
  Edit,
  Copy,
  Trash2,
  RefreshCw,
  AlertTriangle,
  MoreVertical,
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useApi } from '@/hooks/useApi';
import { useDemoMode } from '@/contexts/DemoModeContext';
import { toast } from 'sonner';
import type { Flow } from '@/types/api';

export default function BrikkFlows() {
  const api = useApi();
  const { isDemoMode } = useDemoMode();
  const [workflows, setWorkflows] = useState<Flow[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadWorkflows = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await api.getFlows({ limit: 50 });
      setWorkflows(response.data || []);
    } catch (err: any) {
      console.error('Failed to load workflows:', err);
      setError(err.message || 'Failed to load workflows');
      
      // Set demo data if in demo mode
      if (isDemoMode) {
        setWorkflows([
          {
            id: 'wf-1',
            name: 'Customer Onboarding',
            published: true,
            graph: {
              nodes: [
                { id: 'n1', type: 'trigger', label: 'New Customer' },
                { id: 'n2', type: 'action', label: 'Send Welcome Email' },
                { id: 'n3', type: 'action', label: 'Create Account' },
              ],
              edges: [
                { id: 'e1', from: 'n1', to: 'n2' },
                { id: 'e2', from: 'n2', to: 'n3' },
              ],
            },
          },
          {
            id: 'wf-2',
            name: 'Lead Qualification',
            published: true,
            graph: {
              nodes: [
                { id: 'n1', type: 'trigger', label: 'New Lead' },
                { id: 'n2', type: 'condition', label: 'Score > 80' },
                { id: 'n3', type: 'action', label: 'Assign to Sales' },
              ],
              edges: [
                { id: 'e1', from: 'n1', to: 'n2' },
                { id: 'e2', from: 'n2', to: 'n3' },
              ],
            },
          },
          {
            id: 'wf-3',
            name: 'Data Processing Pipeline',
            published: false,
            graph: {
              nodes: [
                { id: 'n1', type: 'trigger', label: 'New Data' },
                { id: 'n2', type: 'action', label: 'Clean Data' },
                { id: 'n3', type: 'action', label: 'Store in DB' },
              ],
              edges: [
                { id: 'e1', from: 'n1', to: 'n2' },
                { id: 'e2', from: 'n2', to: 'n3' },
              ],
            },
          },
        ]);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadWorkflows();
  }, []);

  const filteredWorkflows = workflows.filter(wf =>
    wf.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const publishedCount = workflows.filter(w => w.published).length;
  const draftCount = workflows.filter(w => !w.published).length;

  if (loading) {
    return (
      <DashboardLayout>
        <div className="container mx-auto py-8">
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="text-center">
              <RefreshCw className="w-12 h-12 animate-spin text-primary mx-auto mb-4" />
              <p className="text-muted-foreground">Loading workflows...</p>
            </div>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  if (error && !isDemoMode) {
    return (
      <DashboardLayout>
        <div className="container mx-auto py-8">
          <Card className="p-8 text-center">
            <AlertTriangle className="w-12 h-12 text-destructive mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">Failed to Load Workflows</h3>
            <p className="text-muted-foreground mb-4">{error}</p>
            <Button onClick={loadWorkflows}>
              <RefreshCw className="w-4 h-4 mr-2" />
              Retry
            </Button>
          </Card>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="container mx-auto py-8 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-[#0057FF] to-[#00C2FF] bg-clip-text text-transparent">
              BrikkFlows
            </h1>
            <p className="text-muted-foreground mt-1">
              Orchestrate AI agents with visual workflows
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Button onClick={loadWorkflows} variant="outline">
              <RefreshCw className="w-4 h-4 mr-2" />
              Refresh
            </Button>
            <Link href="/workflows/builder">
              <Button>
                <Plus className="w-4 h-4 mr-2" />
                Create Workflow
              </Button>
            </Link>
          </div>
        </div>

        {/* Demo Mode Banner */}
        {isDemoMode && (
          <Card className="p-4 bg-amber-500/10 border-amber-500/20">
            <div className="flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-amber-500" />
              <p className="text-sm font-medium">
                Demo Mode Active - Showing sample workflows
              </p>
            </div>
          </Card>
        )}

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-lg bg-primary/10">
                <GitBranch className="w-6 h-6 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total Workflows</p>
                <p className="text-2xl font-bold">{workflows.length}</p>
              </div>
            </div>
          </Card>
          <Card className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-lg bg-green-500/10">
                <Play className="w-6 h-6 text-green-500" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Published</p>
                <p className="text-2xl font-bold">{publishedCount}</p>
              </div>
            </div>
          </Card>
          <Card className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-lg bg-amber-500/10">
                <Edit className="w-6 h-6 text-amber-500" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Drafts</p>
                <p className="text-2xl font-bold">{draftCount}</p>
              </div>
            </div>
          </Card>
        </div>

        {/* Search */}
        <Card className="p-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search workflows..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
        </Card>

        {/* Workflows List */}
        <div className="space-y-4">
          {filteredWorkflows.length === 0 ? (
            <Card className="p-12 text-center">
              <GitBranch className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">No Workflows Yet</h3>
              <p className="text-muted-foreground mb-4">
                Create your first workflow to automate agent coordination
              </p>
              <Link href="/workflows/builder">
                <Button>
                  <Plus className="w-4 h-4 mr-2" />
                  Create Workflow
                </Button>
              </Link>
            </Card>
          ) : (
            filteredWorkflows.map((workflow) => (
              <Card key={workflow.id} className="p-6 hover:shadow-lg transition-shadow">
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-4 flex-1">
                    <div className="p-3 rounded-lg bg-primary/10">
                      <GitBranch className="w-6 h-6 text-primary" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-lg font-semibold">{workflow.name}</h3>
                        <Badge variant={workflow.published ? 'default' : 'secondary'}>
                          {workflow.published ? 'Published' : 'Draft'}
                        </Badge>
                      </div>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <span>{workflow.graph.nodes.length} nodes</span>
                        <span>•</span>
                        <span>{workflow.graph.edges.length} connections</span>
                        <span>•</span>
                        <span>ID: {workflow.id}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Link href={`/workflows/builder?id=${workflow.id}`}>
                      <Button variant="outline" size="sm">
                        <Edit className="w-4 h-4 mr-2" />
                        Edit
                      </Button>
                    </Link>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreVertical className="w-4 h-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => toast.info('Duplicate feature coming soon')}>
                          <Copy className="w-4 h-4 mr-2" />
                          Duplicate
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => toast.info('Delete feature coming soon')}>
                          <Trash2 className="w-4 h-4 mr-2" />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>
              </Card>
            ))
          )}
        </div>

        {/* Quick Actions */}
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4">Quick Actions</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Link href="/workflows/builder">
              <Button variant="outline" className="w-full justify-start">
                <Plus className="w-4 h-4 mr-2" />
                Create Workflow
              </Button>
            </Link>
            <Link href="/workflows/templates">
              <Button variant="outline" className="w-full justify-start">
                <Copy className="w-4 h-4 mr-2" />
                Browse Templates
              </Button>
            </Link>
            <Link href="/analytics">
              <Button variant="outline" className="w-full justify-start">
                <GitBranch className="w-4 h-4 mr-2" />
                View Analytics
              </Button>
            </Link>
          </div>
        </Card>
      </div>
    </DashboardLayout>
  );
}
