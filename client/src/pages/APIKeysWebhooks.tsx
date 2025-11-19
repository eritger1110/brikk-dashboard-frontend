import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs';
import {
  Key,
  Webhook,
  Plus,
  Copy,
  Trash2,
  RotateCw,
  CheckCircle,
  XCircle,
  Clock,
  Activity,
  AlertTriangle,
  Eye,
  EyeOff
} from 'lucide-react';
import { toast } from 'sonner';

interface APIKey {
  id: string;
  name: string;
  key_prefix: string;
  created_at: string;
  last_used: string | null;
  expires_at: string | null;
  is_active: boolean;
  usage_count: number;
}

interface WebhookConfig {
  id: string;
  name: string;
  url: string;
  events: string[];
  is_active: boolean;
  created_at: string;
  success_count: number;
  failure_count: number;
}

export default function APIKeysWebhooks() {
  const [showCreateKeyDialog, setShowCreateKeyDialog] = useState(false);
  const [showCreateWebhookDialog, setShowCreateWebhookDialog] = useState(false);
  const [showKeyDialog, setShowKeyDialog] = useState(false);
  const [newKeyName, setNewKeyName] = useState('');
  const [newKeyExpiry, setNewKeyExpiry] = useState('never');
  const [generatedKey, setGeneratedKey] = useState('');
  const [showGeneratedKey, setShowGeneratedKey] = useState(false);

  const [newWebhookName, setNewWebhookName] = useState('');
  const [newWebhookUrl, setNewWebhookUrl] = useState('');
  const [selectedEvents, setSelectedEvents] = useState<string[]>([]);

  const [apiKeys] = useState<APIKey[]>([
    {
      id: 'key_001',
      name: 'Production API',
      key_prefix: 'brikk_abc123',
      created_at: '2025-01-10T10:00:00Z',
      last_used: '2025-01-18T14:30:00Z',
      expires_at: null,
      is_active: true,
      usage_count: 15420
    },
    {
      id: 'key_002',
      name: 'Development API',
      key_prefix: 'brikk_def456',
      created_at: '2025-01-15T12:00:00Z',
      last_used: '2025-01-18T09:15:00Z',
      expires_at: '2025-07-15T12:00:00Z',
      is_active: true,
      usage_count: 3240
    },
    {
      id: 'key_003',
      name: 'Testing API (Revoked)',
      key_prefix: 'brikk_ghi789',
      created_at: '2025-01-05T08:00:00Z',
      last_used: '2025-01-12T16:45:00Z',
      expires_at: null,
      is_active: false,
      usage_count: 892
    }
  ]);

  const [webhooks] = useState<WebhookConfig[]>([
    {
      id: 'webhook_001',
      name: 'Slack Notifications',
      url: 'https://hooks.slack.com/services/T00000000/B00000000/XXXXXXXXXXXXXXXXXXXX',
      events: ['workflow.completed', 'workflow.failed', 'agent.failed'],
      is_active: true,
      created_at: '2025-01-10T10:00:00Z',
      success_count: 1234,
      failure_count: 12
    },
    {
      id: 'webhook_002',
      name: 'CRM Integration',
      url: 'https://api.crm.example.com/webhooks/brikk',
      events: ['workflow.completed'],
      is_active: true,
      created_at: '2025-01-12T14:30:00Z',
      success_count: 856,
      failure_count: 3
    },
    {
      id: 'webhook_003',
      name: 'Analytics Pipeline',
      url: 'https://analytics.example.com/events',
      events: ['workflow.started', 'workflow.completed', 'agent.started', 'agent.completed'],
      is_active: false,
      created_at: '2025-01-08T09:15:00Z',
      success_count: 432,
      failure_count: 28
    }
  ]);

  const availableEvents = [
    { value: 'workflow.started', label: 'Workflow Started', description: 'When a workflow execution starts' },
    { value: 'workflow.completed', label: 'Workflow Completed', description: 'When a workflow completes successfully' },
    { value: 'workflow.failed', label: 'Workflow Failed', description: 'When a workflow execution fails' },
    { value: 'agent.started', label: 'Agent Started', description: 'When an agent starts executing' },
    { value: 'agent.completed', label: 'Agent Completed', description: 'When an agent completes' },
    { value: 'agent.failed', label: 'Agent Failed', description: 'When an agent execution fails' },
    { value: 'agent.installed', label: 'Agent Installed', description: 'When a new agent is installed' },
    { value: 'budget.threshold', label: 'Budget Threshold', description: 'When budget threshold is reached' },
    { value: 'cost.anomaly', label: 'Cost Anomaly', description: 'When cost anomaly is detected' }
  ];

  const createAPIKey = () => {
    const mockKey = `brikk_${Math.random().toString(36).substring(2, 15)}${Math.random().toString(36).substring(2, 15)}`;
    setGeneratedKey(mockKey);
    setShowKeyDialog(true);
    setShowCreateKeyDialog(false);
    toast.success('API key created successfully!');
  };

  const copyKey = () => {
    navigator.clipboard.writeText(generatedKey);
    toast.success('API key copied to clipboard');
  };

  const revokeKey = (keyId: string) => {
    toast.success('API key revoked');
  };

  const rotateKey = (keyId: string) => {
    toast.success('API key rotated. New key generated.');
  };

  const createWebhook = () => {
    toast.success('Webhook created successfully!');
    setShowCreateWebhookDialog(false);
    setNewWebhookName('');
    setNewWebhookUrl('');
    setSelectedEvents([]);
  };

  const deleteWebhook = (webhookId: string) => {
    toast.success('Webhook deleted');
  };

  const toggleEvent = (event: string) => {
    setSelectedEvents(prev =>
      prev.includes(event)
        ? prev.filter(e => e !== event)
        : [...prev, event]
    );
  };

  const totalRequests = apiKeys.reduce((sum, key) => sum + key.usage_count, 0);
  const activeKeys = apiKeys.filter(k => k.is_active).length;
  const totalWebhooks = webhooks.length;
  const activeWebhooks = webhooks.filter(w => w.is_active).length;
  const totalDeliveries = webhooks.reduce((sum, wh) => sum + wh.success_count + wh.failure_count, 0);
  const successfulDeliveries = webhooks.reduce((sum, wh) => sum + wh.success_count, 0);
  const successRate = totalDeliveries > 0 ? (successfulDeliveries / totalDeliveries * 100).toFixed(1) : 0;

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto p-6">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <Key className="w-8 h-8 text-primary" />
            <h1 className="text-3xl font-bold">API Keys & Webhooks</h1>
          </div>
          <p className="text-muted-foreground">
            Manage API credentials and webhook integrations
          </p>
        </div>

        {/* Stats */}
        <div className="grid md:grid-cols-4 gap-4 mb-6">
          <Card className="p-6">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm text-muted-foreground">API Keys</p>
              <Key className="w-5 h-5 text-primary" />
            </div>
            <p className="text-3xl font-bold">{activeKeys}/{apiKeys.length}</p>
            <p className="text-xs text-muted-foreground mt-1">active</p>
          </Card>

          <Card className="p-6">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm text-muted-foreground">Total Requests</p>
              <Activity className="w-5 h-5 text-cyan-500" />
            </div>
            <p className="text-3xl font-bold">{totalRequests.toLocaleString()}</p>
            <p className="text-xs text-muted-foreground mt-1">all time</p>
          </Card>

          <Card className="p-6">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm text-muted-foreground">Webhooks</p>
              <Webhook className="w-5 h-5 text-violet-500" />
            </div>
            <p className="text-3xl font-bold">{activeWebhooks}/{totalWebhooks}</p>
            <p className="text-xs text-muted-foreground mt-1">active</p>
          </Card>

          <Card className="p-6">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm text-muted-foreground">Delivery Rate</p>
              <CheckCircle className="w-5 h-5 text-green-500" />
            </div>
            <p className="text-3xl font-bold">{successRate}%</p>
            <p className="text-xs text-muted-foreground mt-1">success rate</p>
          </Card>
        </div>

        <Tabs defaultValue="api-keys" className="space-y-6">
          <TabsList>
            <TabsTrigger value="api-keys">API Keys</TabsTrigger>
            <TabsTrigger value="webhooks">Webhooks</TabsTrigger>
          </TabsList>

          {/* API Keys Tab */}
          <TabsContent value="api-keys" className="space-y-4">
            <Card className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold">API Keys</h2>
                <Button onClick={() => setShowCreateKeyDialog(true)} className="gap-2">
                  <Plus className="w-4 h-4" />
                  Create API Key
                </Button>
              </div>

              <div className="space-y-3">
                {apiKeys.map(key => (
                  <Card key={key.id} className={`p-4 ${!key.is_active ? 'opacity-60' : ''}`}>
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <h3 className="font-semibold">{key.name}</h3>
                          {key.is_active ? (
                            <Badge variant="default" className="bg-green-500">Active</Badge>
                          ) : (
                            <Badge variant="destructive">Revoked</Badge>
                          )}
                          {key.expires_at && (
                            <Badge variant="outline" className="text-xs">
                              <Clock className="w-3 h-3 mr-1" />
                              Expires {new Date(key.expires_at).toLocaleDateString()}
                            </Badge>
                          )}
                        </div>

                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                          <code className="px-2 py-1 bg-muted rounded">{key.key_prefix}...</code>
                          <span>{key.usage_count.toLocaleString()} requests</span>
                          {key.last_used && (
                            <span>Last used: {new Date(key.last_used).toLocaleString()}</span>
                          )}
                        </div>
                      </div>

                      {key.is_active && (
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => rotateKey(key.id)}
                            className="gap-2"
                          >
                            <RotateCw className="w-4 h-4" />
                            Rotate
                          </Button>
                          <Button
                            size="sm"
                            variant="destructive"
                            onClick={() => revokeKey(key.id)}
                            className="gap-2"
                          >
                            <Trash2 className="w-4 h-4" />
                            Revoke
                          </Button>
                        </div>
                      )}
                    </div>
                  </Card>
                ))}
              </div>
            </Card>
          </TabsContent>

          {/* Webhooks Tab */}
          <TabsContent value="webhooks" className="space-y-4">
            <Card className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold">Webhooks</h2>
                <Button onClick={() => setShowCreateWebhookDialog(true)} className="gap-2">
                  <Plus className="w-4 h-4" />
                  Create Webhook
                </Button>
              </div>

              <div className="space-y-3">
                {webhooks.map(webhook => {
                  const totalDeliveries = webhook.success_count + webhook.failure_count;
                  const successRate = totalDeliveries > 0
                    ? (webhook.success_count / totalDeliveries * 100).toFixed(1)
                    : 0;

                  return (
                    <Card key={webhook.id} className={`p-4 ${!webhook.is_active ? 'opacity-60' : ''}`}>
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <h3 className="font-semibold">{webhook.name}</h3>
                            {webhook.is_active ? (
                              <Badge variant="default" className="bg-green-500">Active</Badge>
                            ) : (
                              <Badge variant="secondary">Inactive</Badge>
                            )}
                          </div>

                          <div className="text-sm text-muted-foreground mb-2">
                            <code className="text-xs">{webhook.url}</code>
                          </div>

                          <div className="flex flex-wrap gap-1 mb-2">
                            {webhook.events.map(event => (
                              <Badge key={event} variant="outline" className="text-xs">
                                {event}
                              </Badge>
                            ))}
                          </div>

                          <div className="flex items-center gap-4 text-xs text-muted-foreground">
                            <div className="flex items-center gap-1">
                              <CheckCircle className="w-3 h-3 text-green-500" />
                              <span>{webhook.success_count} success</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <XCircle className="w-3 h-3 text-red-500" />
                              <span>{webhook.failure_count} failed</span>
                            </div>
                            <span className="font-semibold">{successRate}% success rate</span>
                          </div>
                        </div>

                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            className="gap-2"
                          >
                            View Logs
                          </Button>
                          <Button
                            size="sm"
                            variant="destructive"
                            onClick={() => deleteWebhook(webhook.id)}
                            className="gap-2"
                          >
                            <Trash2 className="w-4 h-4" />
                            Delete
                          </Button>
                        </div>
                      </div>
                    </Card>
                  );
                })}
              </div>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      {/* Create API Key Dialog */}
      <Dialog open={showCreateKeyDialog} onOpenChange={setShowCreateKeyDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create API Key</DialogTitle>
            <DialogDescription>
              Generate a new API key for programmatic access to your workflows
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium mb-2 block">Key Name</label>
              <Input
                value={newKeyName}
                onChange={(e) => setNewKeyName(e.target.value)}
                placeholder="e.g., Production API"
              />
            </div>

            <div>
              <label className="text-sm font-medium mb-2 block">Expiration</label>
              <Select value={newKeyExpiry} onValueChange={setNewKeyExpiry}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="never">Never</SelectItem>
                  <SelectItem value="30">30 days</SelectItem>
                  <SelectItem value="90">90 days</SelectItem>
                  <SelectItem value="365">1 year</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowCreateKeyDialog(false)}>
              Cancel
            </Button>
            <Button onClick={createAPIKey}>Create Key</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Show Generated Key Dialog */}
      <Dialog open={showKeyDialog} onOpenChange={setShowKeyDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>API Key Created</DialogTitle>
            <DialogDescription>
              Save this key securely - it won't be shown again
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div className="p-4 bg-yellow-500/10 border border-yellow-500/20 rounded-lg">
              <div className="flex items-start gap-2">
                <AlertTriangle className="w-5 h-5 text-yellow-500 flex-shrink-0 mt-0.5" />
                <p className="text-sm">
                  Make sure to copy your API key now. You won't be able to see it again!
                </p>
              </div>
            </div>

            <div>
              <label className="text-sm font-medium mb-2 block">Your API Key</label>
              <div className="flex gap-2">
                <Input
                  value={generatedKey}
                  readOnly
                  type={showGeneratedKey ? 'text' : 'password'}
                  className="font-mono text-sm"
                />
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => setShowGeneratedKey(!showGeneratedKey)}
                >
                  {showGeneratedKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </Button>
                <Button variant="outline" size="icon" onClick={copyKey}>
                  <Copy className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button onClick={() => setShowKeyDialog(false)}>Done</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Create Webhook Dialog */}
      <Dialog open={showCreateWebhookDialog} onOpenChange={setShowCreateWebhookDialog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Create Webhook</DialogTitle>
            <DialogDescription>
              Configure a webhook to receive real-time notifications
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium mb-2 block">Webhook Name</label>
              <Input
                value={newWebhookName}
                onChange={(e) => setNewWebhookName(e.target.value)}
                placeholder="e.g., Slack Notifications"
              />
            </div>

            <div>
              <label className="text-sm font-medium mb-2 block">Webhook URL</label>
              <Input
                value={newWebhookUrl}
                onChange={(e) => setNewWebhookUrl(e.target.value)}
                placeholder="https://your-domain.com/webhook"
              />
            </div>

            <div>
              <label className="text-sm font-medium mb-2 block">Events to Subscribe</label>
              <div className="space-y-2 max-h-60 overflow-y-auto">
                {availableEvents.map(event => (
                  <div
                    key={event.value}
                    className={`p-3 border rounded-lg cursor-pointer transition-colors ${
                      selectedEvents.includes(event.value)
                        ? 'border-primary bg-primary/5'
                        : 'border-border hover:border-primary/50'
                    }`}
                    onClick={() => toggleEvent(event.value)}
                  >
                    <div className="flex items-start gap-2">
                      <div className={`w-4 h-4 rounded border mt-0.5 flex items-center justify-center ${
                        selectedEvents.includes(event.value)
                          ? 'bg-primary border-primary'
                          : 'border-border'
                      }`}>
                        {selectedEvents.includes(event.value) && (
                          <CheckCircle className="w-3 h-3 text-primary-foreground" />
                        )}
                      </div>
                      <div className="flex-1">
                        <p className="font-medium text-sm">{event.label}</p>
                        <p className="text-xs text-muted-foreground">{event.description}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowCreateWebhookDialog(false)}>
              Cancel
            </Button>
            <Button onClick={createWebhook} disabled={selectedEvents.length === 0}>
              Create Webhook
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
