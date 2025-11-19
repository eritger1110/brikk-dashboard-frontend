import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { 
  Plus, Search, Edit, Trash2, Eye, Download, 
  Upload, CheckCircle2, AlertCircle, Clock,
  TrendingUp, Users, Activity, Code
} from 'lucide-react';
import { toast } from 'sonner';
import { useLocation } from 'wouter';

/**
 * Developer Portal
 * 
 * Manage your published integrations:
 * - View integration analytics
 * - Manage versions
 * - Monitor health
 * - Update connector definitions
 * - Publish/unpublish
 */

interface DeveloperIntegration {
  id: string;
  name: string;
  slug: string;
  description: string;
  category: string;
  icon: string;
  version: string;
  status: 'draft' | 'published' | 'deprecated';
  installCount: number;
  rating: number;
  ratingCount: number;
  healthStatus: 'healthy' | 'degraded' | 'failed';
  lastHealthCheck: string;
  createdAt: string;
  updatedAt: string;
}

// Mock data
const mockIntegrations: DeveloperIntegration[] = [
  {
    id: '1',
    name: 'Shopify',
    slug: 'shopify',
    description: 'E-commerce platform for online stores',
    category: 'ecommerce',
    icon: '🛒',
    version: '2.1.0',
    status: 'published',
    installCount: 15420,
    rating: 4.8,
    ratingCount: 892,
    healthStatus: 'healthy',
    lastHealthCheck: '2 minutes ago',
    createdAt: '2024-01-15',
    updatedAt: '2024-11-18'
  },
  {
    id: '2',
    name: 'Custom CRM',
    slug: 'custom-crm',
    description: 'Internal CRM system connector',
    category: 'crm',
    icon: '👥',
    version: '1.0.0',
    status: 'draft',
    installCount: 0,
    rating: 0,
    ratingCount: 0,
    healthStatus: 'healthy',
    lastHealthCheck: 'Never',
    createdAt: '2024-11-18',
    updatedAt: '2024-11-18'
  },
  {
    id: '3',
    name: 'Legacy ERP',
    slug: 'legacy-erp',
    description: 'Legacy ERP system integration',
    category: 'erp',
    icon: '🏢',
    version: '3.2.1',
    status: 'published',
    installCount: 234,
    rating: 4.2,
    ratingCount: 45,
    healthStatus: 'degraded',
    lastHealthCheck: '15 minutes ago',
    createdAt: '2023-08-20',
    updatedAt: '2024-10-05'
  }
];

export default function DeveloperPortal() {
  const [, navigate] = useLocation();
  const [integrations] = useState<DeveloperIntegration[]>(mockIntegrations);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [healthFilter, setHealthFilter] = useState('all');

  const filteredIntegrations = integrations.filter(integration => {
    const matchesSearch = integration.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         integration.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || integration.status === statusFilter;
    const matchesHealth = healthFilter === 'all' || integration.healthStatus === healthFilter;
    
    return matchesSearch && matchesStatus && matchesHealth;
  });

  const stats = {
    totalIntegrations: integrations.length,
    published: integrations.filter(i => i.status === 'published').length,
    totalInstalls: integrations.reduce((sum, i) => sum + i.installCount, 0),
    avgRating: (integrations.reduce((sum, i) => sum + i.rating * i.ratingCount, 0) / 
                integrations.reduce((sum, i) => sum + i.ratingCount, 0) || 0).toFixed(1),
    healthy: integrations.filter(i => i.healthStatus === 'healthy').length,
    degraded: integrations.filter(i => i.healthStatus === 'degraded').length,
    failed: integrations.filter(i => i.healthStatus === 'failed').length
  };

  const handleCreateNew = () => {
    navigate('/developer/integrations/new');
  };

  const handleEdit = (integration: DeveloperIntegration) => {
    toast.info(`Editing ${integration.name}...`);
    // navigate(`/developer/integrations/${integration.id}/edit`);
  };

  const handleDelete = (integration: DeveloperIntegration) => {
    if (confirm(`Are you sure you want to delete ${integration.name}?`)) {
      toast.success(`${integration.name} deleted`);
    }
  };

  const handlePublish = (integration: DeveloperIntegration) => {
    toast.success(`${integration.name} published to marketplace`);
  };

  const handleUnpublish = (integration: DeveloperIntegration) => {
    toast.success(`${integration.name} unpublished from marketplace`);
  };

  const handleExport = (integration: DeveloperIntegration) => {
    toast.success(`Exporting ${integration.name} CDF...`);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'published':
        return 'bg-green-500/10 text-green-500';
      case 'draft':
        return 'bg-yellow-500/10 text-yellow-500';
      case 'deprecated':
        return 'bg-red-500/10 text-red-500';
      default:
        return 'bg-gray-500/10 text-gray-500';
    }
  };

  const getHealthColor = (health: string) => {
    switch (health) {
      case 'healthy':
        return 'text-green-500';
      case 'degraded':
        return 'text-yellow-500';
      case 'failed':
        return 'text-red-500';
      default:
        return 'text-gray-500';
    }
  };

  const getHealthIcon = (health: string) => {
    switch (health) {
      case 'healthy':
        return <CheckCircle2 className="w-4 h-4" />;
      case 'degraded':
        return <AlertCircle className="w-4 h-4" />;
      case 'failed':
        return <AlertCircle className="w-4 h-4" />;
      default:
        return <Clock className="w-4 h-4" />;
    }
  };

  return (
    <div className="container mx-auto py-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold mb-2">Developer Portal</h1>
          <p className="text-muted-foreground">
            Manage your integrations and monitor their performance
          </p>
        </div>

        <Button onClick={handleCreateNew}>
          <Plus className="w-4 h-4 mr-2" />
          Create Integration
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-primary/10 rounded-lg">
              <Code className="w-5 h-5 text-primary" />
            </div>
            <div>
              <div className="text-2xl font-bold">{stats.totalIntegrations}</div>
              <div className="text-sm text-muted-foreground">Total Integrations</div>
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-green-500/10 rounded-lg">
              <CheckCircle2 className="w-5 h-5 text-green-500" />
            </div>
            <div>
              <div className="text-2xl font-bold">{stats.published}</div>
              <div className="text-sm text-muted-foreground">Published</div>
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-500/10 rounded-lg">
              <Users className="w-5 h-5 text-blue-500" />
            </div>
            <div>
              <div className="text-2xl font-bold">{(stats.totalInstalls / 1000).toFixed(1)}k</div>
              <div className="text-sm text-muted-foreground">Total Installs</div>
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-yellow-500/10 rounded-lg">
              <TrendingUp className="w-5 h-5 text-yellow-500" />
            </div>
            <div>
              <div className="text-2xl font-bold">{stats.avgRating}</div>
              <div className="text-sm text-muted-foreground">Avg Rating</div>
            </div>
          </div>
        </Card>
      </div>

      {/* Health Summary */}
      <Card className="p-4 mb-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Activity className="w-5 h-5 text-muted-foreground" />
            <span className="font-semibold">Health Status</span>
          </div>
          
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-green-500" />
              <span className="text-sm">{stats.healthy} Healthy</span>
            </div>
            <div className="flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-yellow-500" />
              <span className="text-sm">{stats.degraded} Degraded</span>
            </div>
            <div className="flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-red-500" />
              <span className="text-sm">{stats.failed} Failed</span>
            </div>
          </div>
        </div>
      </Card>

      {/* Filters */}
      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search integrations..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>

        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="published">Published</SelectItem>
            <SelectItem value="draft">Draft</SelectItem>
            <SelectItem value="deprecated">Deprecated</SelectItem>
          </SelectContent>
        </Select>

        <Select value={healthFilter} onValueChange={setHealthFilter}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Health" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Health</SelectItem>
            <SelectItem value="healthy">Healthy</SelectItem>
            <SelectItem value="degraded">Degraded</SelectItem>
            <SelectItem value="failed">Failed</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Integrations List */}
      <div className="space-y-4">
        {filteredIntegrations.map(integration => (
          <Card key={integration.id} className="p-6">
            <div className="flex items-start justify-between">
              {/* Left: Integration Info */}
              <div className="flex items-start gap-4 flex-1">
                <div className="text-4xl">{integration.icon}</div>
                
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-xl font-semibold">{integration.name}</h3>
                    <Badge className={getStatusColor(integration.status)}>
                      {integration.status}
                    </Badge>
                    <Badge variant="outline">v{integration.version}</Badge>
                  </div>
                  
                  <p className="text-sm text-muted-foreground mb-3">
                    {integration.description}
                  </p>
                  
                  {/* Stats Row */}
                  <div className="flex items-center gap-6 text-sm">
                    <div className="flex items-center gap-1">
                      <Users className="w-4 h-4 text-muted-foreground" />
                      <span>{(integration.installCount / 1000).toFixed(1)}k installs</span>
                    </div>
                    
                    {integration.ratingCount > 0 && (
                      <div className="flex items-center gap-1">
                        <TrendingUp className="w-4 h-4 text-muted-foreground" />
                        <span>{integration.rating} ({integration.ratingCount} reviews)</span>
                      </div>
                    )}
                    
                    <div className={`flex items-center gap-1 ${getHealthColor(integration.healthStatus)}`}>
                      {getHealthIcon(integration.healthStatus)}
                      <span className="capitalize">{integration.healthStatus}</span>
                      <span className="text-muted-foreground">• {integration.lastHealthCheck}</span>
                    </div>
                  </div>
                  
                  {/* Dates */}
                  <div className="flex items-center gap-4 text-xs text-muted-foreground mt-2">
                    <span>Created: {integration.createdAt}</span>
                    <span>Updated: {integration.updatedAt}</span>
                  </div>
                </div>
              </div>

              {/* Right: Actions */}
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleEdit(integration)}
                >
                  <Edit className="w-4 h-4" />
                </Button>
                
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleExport(integration)}
                >
                  <Download className="w-4 h-4" />
                </Button>
                
                {integration.status === 'draft' ? (
                  <Button
                    variant="default"
                    size="sm"
                    onClick={() => handlePublish(integration)}
                  >
                    <Upload className="w-4 h-4 mr-2" />
                    Publish
                  </Button>
                ) : integration.status === 'published' ? (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleUnpublish(integration)}
                  >
                    Unpublish
                  </Button>
                ) : null}
                
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleDelete(integration)}
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Empty State */}
      {filteredIntegrations.length === 0 && (
        <Card className="p-12 text-center">
          <Code className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-semibold mb-2">No integrations found</h3>
          <p className="text-muted-foreground mb-4">
            {searchQuery || statusFilter !== 'all' || healthFilter !== 'all'
              ? 'Try adjusting your filters'
              : 'Create your first integration to get started'}
          </p>
          <Button onClick={handleCreateNew}>
            <Plus className="w-4 h-4 mr-2" />
            Create Integration
          </Button>
        </Card>
      )}
    </div>
  );
}
