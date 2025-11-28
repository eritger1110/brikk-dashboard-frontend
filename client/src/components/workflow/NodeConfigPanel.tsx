import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Trash2, Save, X } from 'lucide-react';
import type { Node } from 'reactflow';
import type { NodeData } from './WorkflowNode';

interface NodeConfigPanelProps {
  node: Node<NodeData> | null;
  onUpdate: (nodeId: string, data: Partial<NodeData>) => void;
  onDelete: () => void;
  onClose: () => void;
}

export default function NodeConfigPanel({ node, onUpdate, onDelete, onClose }: NodeConfigPanelProps) {
  const [label, setLabel] = useState('');
  const [description, setDescription] = useState('');
  const [config, setConfig] = useState<Record<string, any>>({});

  useEffect(() => {
    if (node) {
      setLabel(node.data.label);
      setDescription(node.data.description || '');
      setConfig(node.data.config || {});
    }
  }, [node]);

  if (!node) {
    return (
      <Card className="p-4">
        <p className="text-sm text-muted-foreground text-center">
          Select a node to configure it
        </p>
      </Card>
    );
  }

  const handleSave = () => {
    onUpdate(node.id, {
      label,
      description,
      config,
      configured: true,
    });
  };

  const renderConfigFields = () => {
    switch (node.data.type) {
      case 'trigger':
        return (
          <div className="space-y-4">
            <div>
              <Label htmlFor="trigger-type">Trigger Type</Label>
              <Select
                value={config.triggerType || 'webhook'}
                onValueChange={(value) => setConfig({ ...config, triggerType: value })}
              >
                <SelectTrigger id="trigger-type">
                  <SelectValue placeholder="Select trigger type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="webhook">Webhook</SelectItem>
                  <SelectItem value="schedule">Schedule</SelectItem>
                  <SelectItem value="event">Event</SelectItem>
                  <SelectItem value="manual">Manual</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {config.triggerType === 'schedule' && (
              <div>
                <Label htmlFor="cron">Cron Expression</Label>
                <Input
                  id="cron"
                  placeholder="0 0 * * *"
                  value={config.cron || ''}
                  onChange={(e) => setConfig({ ...config, cron: e.target.value })}
                />
                <p className="text-xs text-muted-foreground mt-1">
                  Example: "0 0 * * *" runs daily at midnight
                </p>
              </div>
            )}

            {config.triggerType === 'webhook' && (
              <div>
                <Label htmlFor="webhook-url">Webhook URL</Label>
                <Input
                  id="webhook-url"
                  placeholder="https://api.example.com/webhook"
                  value={config.webhookUrl || ''}
                  onChange={(e) => setConfig({ ...config, webhookUrl: e.target.value })}
                />
              </div>
            )}

            {config.triggerType === 'event' && (
              <div>
                <Label htmlFor="event-name">Event Name</Label>
                <Input
                  id="event-name"
                  placeholder="user.created"
                  value={config.eventName || ''}
                  onChange={(e) => setConfig({ ...config, eventName: e.target.value })}
                />
              </div>
            )}
          </div>
        );

      case 'condition':
        return (
          <div className="space-y-4">
            <div>
              <Label htmlFor="condition-type">Condition Type</Label>
              <Select
                value={config.conditionType || 'comparison'}
                onValueChange={(value) => setConfig({ ...config, conditionType: value })}
              >
                <SelectTrigger id="condition-type">
                  <SelectValue placeholder="Select condition type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="comparison">Comparison</SelectItem>
                  <SelectItem value="exists">Exists</SelectItem>
                  <SelectItem value="regex">Regex Match</SelectItem>
                  <SelectItem value="custom">Custom Logic</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="field">Field Path</Label>
              <Input
                id="field"
                placeholder="data.user.email"
                value={config.field || ''}
                onChange={(e) => setConfig({ ...config, field: e.target.value })}
              />
            </div>

            {config.conditionType === 'comparison' && (
              <>
                <div>
                  <Label htmlFor="operator">Operator</Label>
                  <Select
                    value={config.operator || 'equals'}
                    onValueChange={(value) => setConfig({ ...config, operator: value })}
                  >
                    <SelectTrigger id="operator">
                      <SelectValue placeholder="Select operator" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="equals">Equals</SelectItem>
                      <SelectItem value="not_equals">Not Equals</SelectItem>
                      <SelectItem value="greater_than">Greater Than</SelectItem>
                      <SelectItem value="less_than">Less Than</SelectItem>
                      <SelectItem value="contains">Contains</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="value">Value</Label>
                  <Input
                    id="value"
                    placeholder="comparison value"
                    value={config.value || ''}
                    onChange={(e) => setConfig({ ...config, value: e.target.value })}
                  />
                </div>
              </>
            )}

            {config.conditionType === 'regex' && (
              <div>
                <Label htmlFor="pattern">Regex Pattern</Label>
                <Input
                  id="pattern"
                  placeholder="^[a-z]+@[a-z]+\.[a-z]+$"
                  value={config.pattern || ''}
                  onChange={(e) => setConfig({ ...config, pattern: e.target.value })}
                />
              </div>
            )}
          </div>
        );

      case 'action':
        return (
          <div className="space-y-4">
            <div>
              <Label htmlFor="action-type">Action Type</Label>
              <Select
                value={config.actionType || 'http_request'}
                onValueChange={(value) => setConfig({ ...config, actionType: value })}
              >
                <SelectTrigger id="action-type">
                  <SelectValue placeholder="Select action type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="http_request">HTTP Request</SelectItem>
                  <SelectItem value="email">Send Email</SelectItem>
                  <SelectItem value="slack">Slack Message</SelectItem>
                  <SelectItem value="database">Database Query</SelectItem>
                  <SelectItem value="transform">Transform Data</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {config.actionType === 'http_request' && (
              <>
                <div>
                  <Label htmlFor="method">HTTP Method</Label>
                  <Select
                    value={config.method || 'POST'}
                    onValueChange={(value) => setConfig({ ...config, method: value })}
                  >
                    <SelectTrigger id="method">
                      <SelectValue placeholder="Select method" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="GET">GET</SelectItem>
                      <SelectItem value="POST">POST</SelectItem>
                      <SelectItem value="PUT">PUT</SelectItem>
                      <SelectItem value="DELETE">DELETE</SelectItem>
                      <SelectItem value="PATCH">PATCH</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="url">URL</Label>
                  <Input
                    id="url"
                    placeholder="https://api.example.com/endpoint"
                    value={config.url || ''}
                    onChange={(e) => setConfig({ ...config, url: e.target.value })}
                  />
                </div>

                <div>
                  <Label htmlFor="body">Request Body (JSON)</Label>
                  <Textarea
                    id="body"
                    placeholder='{"key": "value"}'
                    value={config.body || ''}
                    onChange={(e) => setConfig({ ...config, body: e.target.value })}
                    rows={4}
                  />
                </div>
              </>
            )}

            {config.actionType === 'email' && (
              <>
                <div>
                  <Label htmlFor="to">To Email</Label>
                  <Input
                    id="to"
                    placeholder="user@example.com"
                    value={config.to || ''}
                    onChange={(e) => setConfig({ ...config, to: e.target.value })}
                  />
                </div>

                <div>
                  <Label htmlFor="subject">Subject</Label>
                  <Input
                    id="subject"
                    placeholder="Email subject"
                    value={config.subject || ''}
                    onChange={(e) => setConfig({ ...config, subject: e.target.value })}
                  />
                </div>

                <div>
                  <Label htmlFor="message">Message</Label>
                  <Textarea
                    id="message"
                    placeholder="Email body"
                    value={config.message || ''}
                    onChange={(e) => setConfig({ ...config, message: e.target.value })}
                    rows={4}
                  />
                </div>
              </>
            )}

            {config.actionType === 'slack' && (
              <>
                <div>
                  <Label htmlFor="channel">Channel</Label>
                  <Input
                    id="channel"
                    placeholder="#general"
                    value={config.channel || ''}
                    onChange={(e) => setConfig({ ...config, channel: e.target.value })}
                  />
                </div>

                <div>
                  <Label htmlFor="slack-message">Message</Label>
                  <Textarea
                    id="slack-message"
                    placeholder="Slack message"
                    value={config.slackMessage || ''}
                    onChange={(e) => setConfig({ ...config, slackMessage: e.target.value })}
                    rows={4}
                  />
                </div>
              </>
            )}
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <Card className="p-4 space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold">Configure Node</h3>
        <Button variant="ghost" size="icon" onClick={onClose}>
          <X className="h-4 w-4" />
        </Button>
      </div>

      <div className="space-y-4">
        <div>
          <Label htmlFor="node-label">Node Label</Label>
          <Input
            id="node-label"
            value={label}
            onChange={(e) => setLabel(e.target.value)}
            placeholder="Enter node label"
          />
        </div>

        <div>
          <Label htmlFor="node-description">Description</Label>
          <Textarea
            id="node-description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Describe what this node does"
            rows={2}
          />
        </div>

        <div className="pt-2 border-t">
          <Label className="text-xs font-semibold text-muted-foreground uppercase">
            {node.data.type} Configuration
          </Label>
          <div className="mt-3">
            {renderConfigFields()}
          </div>
        </div>
      </div>

      <div className="flex gap-2 pt-4 border-t">
        <Button onClick={handleSave} className="flex-1">
          <Save className="h-4 w-4 mr-2" />
          Save Configuration
        </Button>
        <Button variant="destructive" onClick={onDelete}>
          <Trash2 className="h-4 w-4 mr-2" />
          Delete
        </Button>
      </div>

      <div className="text-xs text-muted-foreground">
        <p className="font-medium mb-1">Node ID: <span className="font-mono">{node.id}</span></p>
        <p>Type: <span className="font-mono">{node.data.type}</span></p>
      </div>
    </Card>
  );
}
