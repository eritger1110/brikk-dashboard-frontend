import { useState, useEffect } from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Settings as SettingsIcon,
  Building2,
  Bell,
  Shield,
  Database,
  Save,
  RefreshCw,
  AlertTriangle,
  FileText,
  Clock,
  User,
} from 'lucide-react';
import { useApi } from '@/hooks/useApi';
import { useDemoMode } from '@/contexts/DemoModeContext';
import { toast } from 'sonner';
import type { Org, AuditEvent } from '@/types/api';

export default function Settings() {
  const api = useApi();
  const { isDemoMode } = useDemoMode();
  const [org, setOrg] = useState<Org | null>(null);
  const [orgName, setOrgName] = useState('');
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);
  const [auditLogs, setAuditLogs] = useState<AuditEvent[]>([]);
  const [logsLoading, setLogsLoading] = useState(false);

  const loadOrgSettings = async () => {
    setLoading(true);
    try {
      const orgData = await api.getCurrentOrg();
      setOrg(orgData);
      setOrgName(orgData.name);
    } catch (err: any) {
      console.error('Failed to load org settings:', err);
      if (isDemoMode) {
        const demoOrg: Org = {
          id: 'org-demo',
          name: 'Brikk Demo Organization',
          type: 'demo',
          plan: 'pro',
          status: 'active',
          limits: {
            agents: 999999,
            workflows: 999999,
            executions_per_month: 100000,
            team_members: 999999,
          },
          created_at: '2024-01-15T10:00:00Z',
        };
        setOrg(demoOrg);
        setOrgName(demoOrg.name);
      }
    } finally {
      setLoading(false);
    }
  };

  const loadAuditLogs = async () => {
    setLogsLoading(true);
    try {
      const response = await api.getAuditLogs({ range: '7d', limit: 50 });
      setAuditLogs(response.data || []);
    } catch (err: any) {
      console.error('Failed to load audit logs:', err);
      if (isDemoMode) {
        setAuditLogs([
          {
            ts: '2024-11-21T09:00:00Z',
            actor: 'john@brikk.ai',
            action: 'user.invited',
            target: 'emma@partner.com',
            ip: '192.168.1.100',
            meta: { role: 'viewer' },
          },
          {
            ts: '2024-11-21T08:30:00Z',
            actor: 'sarah@brikk.ai',
            action: 'workflow.published',
            target: 'Customer Onboarding Flow',
            ip: '192.168.1.101',
          },
          {
            ts: '2024-11-20T16:00:00Z',
            actor: 'mike@brikk.ai',
            action: 'agent.created',
            target: 'Sales Assistant Agent',
            ip: '192.168.1.102',
          },
          {
            ts: '2024-11-20T14:00:00Z',
            actor: 'john@brikk.ai',
            action: 'role.updated',
            target: 'sarah@brikk.ai',
            ip: '192.168.1.100',
            meta: { from: 'builder', to: 'admin' },
          },
          {
            ts: '2024-11-20T10:00:00Z',
            actor: 'john@brikk.ai',
            action: 'settings.updated',
            target: 'organization',
            ip: '192.168.1.100',
            meta: { field: 'name' },
          },
        ]);
      }
    } finally {
      setLogsLoading(false);
    }
  };

  useEffect(() => {
    loadOrgSettings();
    loadAuditLogs();
  }, []);

  const handleSaveOrgSettings = async () => {
    if (!orgName.trim()) {
      toast.error('Organization name cannot be empty');
      return;
    }

    setSaving(true);
    try {
      await api.updateOrgSettings({ name: orgName });
      toast.success('Organization settings updated');
      loadOrgSettings();
    } catch (err: any) {
      console.error('Failed to update org settings:', err);
      if (isDemoMode) {
        toast.info('Demo mode: Settings update simulated');
      } else {
        toast.error('Failed to update settings');
      }
    } finally {
      setSaving(false);
    }
  };

  const getActionBadgeColor = (action: string) => {
    if (action.includes('created') || action.includes('invited')) return 'bg-green-500/10 text-green-500';
    if (action.includes('deleted') || action.includes('removed')) return 'bg-red-500/10 text-red-500';
    if (action.includes('updated') || action.includes('published')) return 'bg-blue-500/10 text-blue-500';
    return 'bg-gray-500/10 text-gray-500';
  };

  if (loading) {
    return (
      <DashboardLayout>
        <div className="container mx-auto py-8">
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="text-center">
              <RefreshCw className="w-12 h-12 animate-spin text-primary mx-auto mb-4" />
              <p className="text-muted-foreground">Loading settings...</p>
            </div>
          </div>
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
              Settings
            </h1>
            <p className="text-muted-foreground mt-1">
              Manage organization settings and preferences
            </p>
          </div>
          <Button onClick={loadOrgSettings} variant="outline">
            <RefreshCw className="w-4 h-4 mr-2" />
            Refresh
          </Button>
        </div>

        {/* Demo Mode Banner */}
        {isDemoMode && (
          <Card className="p-4 bg-amber-500/10 border-amber-500/20">
            <div className="flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-amber-500" />
              <p className="text-sm font-medium">
                Demo Mode Active - Settings changes are simulated
              </p>
            </div>
          </Card>
        )}

        {/* Tabs */}
        <Tabs defaultValue="organization" className="space-y-6">
          <TabsList>
            <TabsTrigger value="organization">
              <Building2 className="w-4 h-4 mr-2" />
              Organization
            </TabsTrigger>
            <TabsTrigger value="audit">
              <FileText className="w-4 h-4 mr-2" />
              Audit Logs
            </TabsTrigger>
            <TabsTrigger value="notifications">
              <Bell className="w-4 h-4 mr-2" />
              Notifications
            </TabsTrigger>
            <TabsTrigger value="security">
              <Shield className="w-4 h-4 mr-2" />
              Security
            </TabsTrigger>
            <TabsTrigger value="compliance">
              <Database className="w-4 h-4 mr-2" />
              Compliance
            </TabsTrigger>
          </TabsList>

          {/* Organization Tab */}
          <TabsContent value="organization">
            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-4">Organization Details</h3>
              <div className="space-y-4 max-w-2xl">
                <div className="space-y-2">
                  <Label htmlFor="org-name">Organization Name</Label>
                  <Input
                    id="org-name"
                    value={orgName}
                    onChange={(e) => setOrgName(e.target.value)}
                    placeholder="Enter organization name"
                  />
                </div>

                <div className="space-y-2">
                  <Label>Organization ID</Label>
                  <Input value={org?.id || ''} disabled />
                </div>

                <div className="space-y-2">
                  <Label>Plan</Label>
                  <Input value={org?.plan || ''} disabled className="capitalize" />
                </div>

                <div className="space-y-2">
                  <Label>Status</Label>
                  <Input value={org?.status || ''} disabled className="capitalize" />
                </div>

                <div className="space-y-2">
                  <Label>Created</Label>
                  <Input
                    value={org?.created_at ? new Date(org.created_at).toLocaleDateString() : ''}
                    disabled
                  />
                </div>

                <Button onClick={handleSaveOrgSettings} disabled={saving}>
                  <Save className="w-4 h-4 mr-2" />
                  {saving ? 'Saving...' : 'Save Changes'}
                </Button>
              </div>
            </Card>
          </TabsContent>

          {/* Audit Logs Tab */}
          <TabsContent value="audit">
            <Card className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold">Audit Logs</h3>
                <Button onClick={loadAuditLogs} variant="outline" size="sm">
                  <RefreshCw className="w-4 h-4 mr-2" />
                  Refresh
                </Button>
              </div>

              {logsLoading ? (
                <div className="flex items-center justify-center py-12">
                  <RefreshCw className="w-8 h-8 animate-spin text-primary" />
                </div>
              ) : auditLogs.length === 0 ? (
                <div className="text-center py-12">
                  <FileText className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground">No audit logs available</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {auditLogs.map((log, idx) => (
                    <div key={idx} className="flex items-start gap-4 p-4 rounded-lg border">
                      <div className="p-2 rounded-full bg-primary/10">
                        <Clock className="w-4 h-4 text-primary" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className={`px-2 py-1 rounded text-xs font-medium ${getActionBadgeColor(log.action)}`}>
                            {log.action}
                          </span>
                          <span className="text-xs text-muted-foreground">
                            {new Date(log.ts).toLocaleString()}
                          </span>
                        </div>
                        <div className="flex items-center gap-2 text-sm">
                          <User className="w-3 h-3 text-muted-foreground" />
                          <span className="font-medium">{log.actor}</span>
                          {log.target && (
                            <>
                              <span className="text-muted-foreground">→</span>
                              <span>{log.target}</span>
                            </>
                          )}
                        </div>
                        {log.meta && (
                          <p className="text-xs text-muted-foreground mt-1">
                            {JSON.stringify(log.meta)}
                          </p>
                        )}
                        {log.ip && (
                          <p className="text-xs text-muted-foreground mt-1">
                            IP: {log.ip}
                          </p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </Card>
          </TabsContent>

          {/* Notifications Tab */}
          <TabsContent value="notifications">
            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-4">Notification Preferences</h3>
              <p className="text-sm text-muted-foreground">
                Configure alert channels, notification preferences, and escalation rules.
              </p>
              <div className="mt-6 p-4 rounded-lg border-2 border-dashed">
                <p className="text-sm text-muted-foreground text-center">
                  Notification settings will be available once backend integration is complete
                </p>
              </div>
            </Card>
          </TabsContent>

          {/* Security Tab */}
          <TabsContent value="security">
            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-4">Security & SSO</h3>
              <p className="text-sm text-muted-foreground">
                Manage authentication methods, SSO providers, and security policies.
              </p>
              <div className="mt-6 p-4 rounded-lg border-2 border-dashed">
                <p className="text-sm text-muted-foreground text-center">
                  Security settings will be available once backend integration is complete
                </p>
              </div>
            </Card>
          </TabsContent>

          {/* Compliance Tab */}
          <TabsContent value="compliance">
            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-4">Data & Compliance</h3>
              <p className="text-sm text-muted-foreground">
                Manage data retention policies, export settings, and compliance configurations.
              </p>
              <div className="mt-6 p-4 rounded-lg border-2 border-dashed">
                <p className="text-sm text-muted-foreground text-center">
                  Compliance settings will be available once backend integration is complete
                </p>
              </div>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
}
