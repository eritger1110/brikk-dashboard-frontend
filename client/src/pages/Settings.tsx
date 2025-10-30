import DashboardLayout from '@/components/layout/DashboardLayout';
import { Settings as SettingsIcon, Bell, Shield, Database, Zap } from 'lucide-react';

export default function Settings() {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Page header */}
        <div>
          <h1 className="text-3xl font-bold text-foreground">Settings</h1>
          <p className="mt-2 text-muted-foreground">
            Configure platform settings and preferences
          </p>
        </div>

        {/* Settings Categories */}
        <div className="grid gap-6 md:grid-cols-2">
          <div className="rounded-lg border border-border bg-card p-6 hover:shadow-md transition-shadow cursor-pointer">
            <div className="flex items-center gap-3 mb-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                <Bell className="h-5 w-5 text-primary" />
              </div>
              <h3 className="text-lg font-semibold text-foreground">Notifications</h3>
            </div>
            <p className="text-sm text-muted-foreground">
              Configure alert channels, notification preferences, and escalation rules
            </p>
          </div>

          <div className="rounded-lg border border-border bg-card p-6 hover:shadow-md transition-shadow cursor-pointer">
            <div className="flex items-center gap-3 mb-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                <Shield className="h-5 w-5 text-primary" />
              </div>
              <h3 className="text-lg font-semibold text-foreground">Security & SSO</h3>
            </div>
            <p className="text-sm text-muted-foreground">
              Manage authentication methods, SSO providers, and security policies
            </p>
          </div>

          <div className="rounded-lg border border-border bg-card p-6 hover:shadow-md transition-shadow cursor-pointer">
            <div className="flex items-center gap-3 mb-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                <Zap className="h-5 w-5 text-primary" />
              </div>
              <h3 className="text-lg font-semibold text-foreground">Integrations</h3>
            </div>
            <p className="text-sm text-muted-foreground">
              Connect and configure external services like Slack, Salesforce, SAP, and more
            </p>
          </div>

          <div className="rounded-lg border border-border bg-card p-6 hover:shadow-md transition-shadow cursor-pointer">
            <div className="flex items-center gap-3 mb-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                <Database className="h-5 w-5 text-primary" />
              </div>
              <h3 className="text-lg font-semibold text-foreground">Data & Compliance</h3>
            </div>
            <p className="text-sm text-muted-foreground">
              Manage data retention policies, export settings, and compliance configurations
            </p>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}

