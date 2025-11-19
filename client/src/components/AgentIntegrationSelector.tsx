import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { 
  Plus, X, Search, CheckCircle2, Settings, 
  ExternalLink, Shield, Zap 
} from 'lucide-react';
import { toast } from 'sonner';

/**
 * Agent Integration Selector
 * 
 * Allows users to attach integrations to agents and configure permissions
 */

interface Integration {
  id: string;
  name: string;
  slug: string;
  description: string;
  category: string;
  icon: string;
  version: string;
  isInstalled: boolean;
  endpoints: IntegrationEndpoint[];
}

interface IntegrationEndpoint {
  id: string;
  name: string;
  method: string;
  path: string;
  description: string;
  type: 'action' | 'trigger';
}

interface AgentIntegration {
  integrationId: string;
  integration: Integration;
  allowedEndpoints: string[]; // Endpoint IDs the agent can access
  permissions: {
    read: boolean;
    write: boolean;
    delete: boolean;
  };
}

interface AgentIntegrationSelectorProps {
  selectedIntegrations: AgentIntegration[];
  onChange: (integrations: AgentIntegration[]) => void;
}

export default function AgentIntegrationSelector({
  selectedIntegrations,
  onChange
}: AgentIntegrationSelectorProps) {
  const [availableIntegrations, setAvailableIntegrations] = useState<Integration[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [configuringIntegration, setConfiguringIntegration] = useState<AgentIntegration | null>(null);

  // Load available integrations
  useEffect(() => {
    loadIntegrations();
  }, []);

  const loadIntegrations = async () => {
    // Mock data - in production, this would fetch from API
    const mockIntegrations: Integration[] = [
      {
        id: '1',
        name: 'Shopify',
        slug: 'shopify',
        description: 'E-commerce platform for online stores',
        category: 'ecommerce',
        icon: '🛒',
        version: '2.1.0',
        isInstalled: true,
        endpoints: [
          {
            id: 'orders.list',
            name: 'List Orders',
            method: 'GET',
            path: '/orders.json',
            description: 'Retrieve a list of orders',
            type: 'action'
          },
          {
            id: 'orders.get',
            name: 'Get Order',
            method: 'GET',
            path: '/orders/{id}.json',
            description: 'Get a specific order',
            type: 'action'
          },
          {
            id: 'products.create',
            name: 'Create Product',
            method: 'POST',
            path: '/products.json',
            description: 'Create a new product',
            type: 'action'
          },
          {
            id: 'order.created',
            name: 'Order Created',
            method: 'WEBHOOK',
            path: '/webhooks/orders/create',
            description: 'Triggered when a new order is created',
            type: 'trigger'
          }
        ]
      },
      {
        id: '2',
        name: 'Salesforce',
        slug: 'salesforce',
        description: 'CRM platform for sales and marketing',
        category: 'crm',
        icon: '☁️',
        version: '3.0.1',
        isInstalled: true,
        endpoints: [
          {
            id: 'leads.list',
            name: 'List Leads',
            method: 'GET',
            path: '/services/data/v58.0/sobjects/Lead',
            description: 'Retrieve leads',
            type: 'action'
          },
          {
            id: 'leads.create',
            name: 'Create Lead',
            method: 'POST',
            path: '/services/data/v58.0/sobjects/Lead',
            description: 'Create a new lead',
            type: 'action'
          },
          {
            id: 'opportunities.list',
            name: 'List Opportunities',
            method: 'GET',
            path: '/services/data/v58.0/sobjects/Opportunity',
            description: 'Retrieve opportunities',
            type: 'action'
          }
        ]
      },
      {
        id: '3',
        name: 'Stripe',
        slug: 'stripe',
        description: 'Payment processing platform',
        category: 'finance',
        icon: '💳',
        version: '4.2.0',
        isInstalled: true,
        endpoints: [
          {
            id: 'customers.list',
            name: 'List Customers',
            method: 'GET',
            path: '/v1/customers',
            description: 'Retrieve customers',
            type: 'action'
          },
          {
            id: 'charges.create',
            name: 'Create Charge',
            method: 'POST',
            path: '/v1/charges',
            description: 'Create a new charge',
            type: 'action'
          },
          {
            id: 'payment.succeeded',
            name: 'Payment Succeeded',
            method: 'WEBHOOK',
            path: '/webhooks/payment_intent.succeeded',
            description: 'Triggered when payment succeeds',
            type: 'trigger'
          }
        ]
      },
      {
        id: '4',
        name: 'Gmail',
        slug: 'gmail',
        description: 'Email service by Google',
        category: 'communication',
        icon: '📧',
        version: '1.8.0',
        isInstalled: true,
        endpoints: [
          {
            id: 'messages.list',
            name: 'List Messages',
            method: 'GET',
            path: '/gmail/v1/users/me/messages',
            description: 'List email messages',
            type: 'action'
          },
          {
            id: 'messages.send',
            name: 'Send Message',
            method: 'POST',
            path: '/gmail/v1/users/me/messages/send',
            description: 'Send an email',
            type: 'action'
          }
        ]
      }
    ];

    setAvailableIntegrations(mockIntegrations);
  };

  const filteredIntegrations = availableIntegrations.filter(integration => {
    const matchesSearch = integration.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         integration.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || integration.category === selectedCategory;
    const isInstalled = integration.isInstalled;
    
    return matchesSearch && matchesCategory && isInstalled;
  });

  const handleAddIntegration = (integration: Integration) => {
    if (selectedIntegrations.find(i => i.integrationId === integration.id)) {
      toast.info(`${integration.name} is already attached`);
      return;
    }

    const newIntegration: AgentIntegration = {
      integrationId: integration.id,
      integration: integration,
      allowedEndpoints: integration.endpoints.map(e => e.id), // All endpoints allowed by default
      permissions: {
        read: true,
        write: false,
        delete: false
      }
    };

    onChange([...selectedIntegrations, newIntegration]);
    toast.success(`${integration.name} attached to agent`);
    setIsDialogOpen(false);
  };

  const handleRemoveIntegration = (integrationId: string) => {
    const integration = selectedIntegrations.find(i => i.integrationId === integrationId);
    onChange(selectedIntegrations.filter(i => i.integrationId !== integrationId));
    if (integration) {
      toast.success(`${integration.integration.name} removed from agent`);
    }
  };

  const handleConfigureIntegration = (agentIntegration: AgentIntegration) => {
    setConfiguringIntegration(agentIntegration);
  };

  const handleSaveConfiguration = () => {
    if (!configuringIntegration) return;

    const updated = selectedIntegrations.map(i =>
      i.integrationId === configuringIntegration.integrationId ? configuringIntegration : i
    );
    onChange(updated);
    toast.success('Integration configuration saved');
    setConfiguringIntegration(null);
  };

  const toggleEndpoint = (endpointId: string) => {
    if (!configuringIntegration) return;

    const allowedEndpoints = configuringIntegration.allowedEndpoints.includes(endpointId)
      ? configuringIntegration.allowedEndpoints.filter(id => id !== endpointId)
      : [...configuringIntegration.allowedEndpoints, endpointId];

    setConfiguringIntegration({
      ...configuringIntegration,
      allowedEndpoints
    });
  };

  const updatePermissions = (permission: 'read' | 'write' | 'delete', value: boolean) => {
    if (!configuringIntegration) return;

    setConfiguringIntegration({
      ...configuringIntegration,
      permissions: {
        ...configuringIntegration.permissions,
        [permission]: value
      }
    });
  };

  return (
    <div className="space-y-4">
      {/* Selected Integrations */}
      <div>
        <Label className="text-base font-semibold mb-3 block">
          Attached Integrations ({selectedIntegrations.length})
        </Label>
        
        {selectedIntegrations.length === 0 ? (
          <Card className="p-8 text-center border-dashed">
            <Zap className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
            <p className="text-muted-foreground mb-4">
              No integrations attached yet
            </p>
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="w-4 h-4 mr-2" />
                  Add Integration
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>Add Integration</DialogTitle>
                  <DialogDescription>
                    Select an integration to attach to this agent
                  </DialogDescription>
                </DialogHeader>

                {/* Search and Filter */}
                <div className="flex gap-4 mb-4">
                  <div className="flex-1 relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                      placeholder="Search integrations..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-10"
                    />
                  </div>

                  <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="Category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Categories</SelectItem>
                      <SelectItem value="ecommerce">E-commerce</SelectItem>
                      <SelectItem value="crm">CRM</SelectItem>
                      <SelectItem value="finance">Finance</SelectItem>
                      <SelectItem value="communication">Communication</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Integration Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {filteredIntegrations.map(integration => (
                    <Card key={integration.id} className="p-4">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center gap-3">
                          <div className="text-3xl">{integration.icon}</div>
                          <div>
                            <h4 className="font-semibold">{integration.name}</h4>
                            <p className="text-xs text-muted-foreground">
                              v{integration.version} • {integration.endpoints.length} endpoints
                            </p>
                          </div>
                        </div>
                        <CheckCircle2 className="w-5 h-5 text-green-500" />
                      </div>

                      <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                        {integration.description}
                      </p>

                      <Button
                        size="sm"
                        className="w-full"
                        onClick={() => handleAddIntegration(integration)}
                      >
                        <Plus className="w-4 h-4 mr-2" />
                        Attach to Agent
                      </Button>
                    </Card>
                  ))}
                </div>
              </DialogContent>
            </Dialog>
          </Card>
        ) : (
          <div className="space-y-3">
            {selectedIntegrations.map(agentIntegration => (
              <Card key={agentIntegration.integrationId} className="p-4">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3 flex-1">
                    <div className="text-2xl">{agentIntegration.integration.icon}</div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="font-semibold">{agentIntegration.integration.name}</h4>
                        <Badge variant="secondary" className="text-xs">
                          {agentIntegration.allowedEndpoints.length} endpoints
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {agentIntegration.integration.description}
                      </p>
                      
                      {/* Permissions */}
                      <div className="flex items-center gap-3 mt-2">
                        <div className="flex items-center gap-1 text-xs">
                          <Shield className="w-3 h-3" />
                          <span className="text-muted-foreground">Permissions:</span>
                        </div>
                        {agentIntegration.permissions.read && (
                          <Badge variant="outline" className="text-xs">Read</Badge>
                        )}
                        {agentIntegration.permissions.write && (
                          <Badge variant="outline" className="text-xs">Write</Badge>
                        )}
                        {agentIntegration.permissions.delete && (
                          <Badge variant="outline" className="text-xs">Delete</Badge>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleConfigureIntegration(agentIntegration)}
                    >
                      <Settings className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleRemoveIntegration(agentIntegration.integrationId)}
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </Card>
            ))}

            {/* Add More Button */}
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button variant="outline" className="w-full">
                  <Plus className="w-4 h-4 mr-2" />
                  Add Another Integration
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
                {/* Same dialog content as above */}
                <DialogHeader>
                  <DialogTitle>Add Integration</DialogTitle>
                  <DialogDescription>
                    Select an integration to attach to this agent
                  </DialogDescription>
                </DialogHeader>

                <div className="flex gap-4 mb-4">
                  <div className="flex-1 relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                      placeholder="Search integrations..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-10"
                    />
                  </div>

                  <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="Category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Categories</SelectItem>
                      <SelectItem value="ecommerce">E-commerce</SelectItem>
                      <SelectItem value="crm">CRM</SelectItem>
                      <SelectItem value="finance">Finance</SelectItem>
                      <SelectItem value="communication">Communication</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {filteredIntegrations.map(integration => (
                    <Card key={integration.id} className="p-4">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center gap-3">
                          <div className="text-3xl">{integration.icon}</div>
                          <div>
                            <h4 className="font-semibold">{integration.name}</h4>
                            <p className="text-xs text-muted-foreground">
                              v{integration.version} • {integration.endpoints.length} endpoints
                            </p>
                          </div>
                        </div>
                        <CheckCircle2 className="w-5 h-5 text-green-500" />
                      </div>

                      <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                        {integration.description}
                      </p>

                      <Button
                        size="sm"
                        className="w-full"
                        onClick={() => handleAddIntegration(integration)}
                      >
                        <Plus className="w-4 h-4 mr-2" />
                        Attach to Agent
                      </Button>
                    </Card>
                  ))}
                </div>
              </DialogContent>
            </Dialog>
          </div>
        )}
      </div>

      {/* Configuration Dialog */}
      {configuringIntegration && (
        <Dialog open={!!configuringIntegration} onOpenChange={() => setConfiguringIntegration(null)}>
          <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>
                Configure {configuringIntegration.integration.name}
              </DialogTitle>
              <DialogDescription>
                Select which endpoints this agent can access and set permissions
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-6">
              {/* Permissions */}
              <div>
                <Label className="text-base font-semibold mb-3 block">Permissions</Label>
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Checkbox
                      id="perm-read"
                      checked={configuringIntegration.permissions.read}
                      onCheckedChange={(checked) => updatePermissions('read', !!checked)}
                    />
                    <Label htmlFor="perm-read" className="cursor-pointer">
                      Read - Agent can retrieve data
                    </Label>
                  </div>
                  <div className="flex items-center gap-2">
                    <Checkbox
                      id="perm-write"
                      checked={configuringIntegration.permissions.write}
                      onCheckedChange={(checked) => updatePermissions('write', !!checked)}
                    />
                    <Label htmlFor="perm-write" className="cursor-pointer">
                      Write - Agent can create and update data
                    </Label>
                  </div>
                  <div className="flex items-center gap-2">
                    <Checkbox
                      id="perm-delete"
                      checked={configuringIntegration.permissions.delete}
                      onCheckedChange={(checked) => updatePermissions('delete', !!checked)}
                    />
                    <Label htmlFor="perm-delete" className="cursor-pointer">
                      Delete - Agent can delete data
                    </Label>
                  </div>
                </div>
              </div>

              {/* Allowed Endpoints */}
              <div>
                <Label className="text-base font-semibold mb-3 block">
                  Allowed Endpoints ({configuringIntegration.allowedEndpoints.length}/{configuringIntegration.integration.endpoints.length})
                </Label>
                <div className="space-y-2">
                  {configuringIntegration.integration.endpoints.map(endpoint => (
                    <div key={endpoint.id} className="flex items-start gap-2 p-3 border rounded-lg">
                      <Checkbox
                        id={`endpoint-${endpoint.id}`}
                        checked={configuringIntegration.allowedEndpoints.includes(endpoint.id)}
                        onCheckedChange={() => toggleEndpoint(endpoint.id)}
                      />
                      <div className="flex-1">
                        <Label htmlFor={`endpoint-${endpoint.id}`} className="cursor-pointer font-medium">
                          {endpoint.name}
                        </Label>
                        <p className="text-sm text-muted-foreground">
                          {endpoint.method} {endpoint.path}
                        </p>
                        <p className="text-xs text-muted-foreground mt-1">
                          {endpoint.description}
                        </p>
                      </div>
                      <Badge variant={endpoint.type === 'action' ? 'default' : 'secondary'}>
                        {endpoint.type}
                      </Badge>
                    </div>
                  ))}
                </div>
              </div>

              {/* Actions */}
              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setConfiguringIntegration(null)}>
                  Cancel
                </Button>
                <Button onClick={handleSaveConfiguration}>
                  Save Configuration
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}
