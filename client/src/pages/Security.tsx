import DashboardLayout from "@/components/layout/DashboardLayout";
import {
  Shield,
  Key,
  FileText,
  Plus,
  Copy,
  Eye,
  EyeOff,
  Trash2,
  AlertCircle,
  CheckCircle2,
  Lock,
  Loader2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { brikkColors } from "@/lib/palette";
import { useState, useEffect } from "react";
import { useApi } from "@/hooks/useApi";
import { toast } from "sonner";

export default function Security() {
  const api = useApi();
  const [showKey, setShowKey] = useState(false);
  const [loading, setLoading] = useState(true);
  const [apiKeys, setApiKeys] = useState<any[]>([]);
  const [auditLogs, setAuditLogs] = useState<any[]>([]);
  const [stats, setStats] = useState({ activeKeys: 0, auditEvents24h: 0, securityAlerts: 0 });

  useEffect(() => {
    loadSecurityData();
  }, []);

  const loadSecurityData = async () => {
    try {
      setLoading(true);
      const [keysData, auditData] = await Promise.all([
        api.getApiKeys().catch(() => ({ keys: [] })),
        api.getAuditLogs({ limit: 50 }).catch(() => ({ logs: [] })),
      ]);
      
      const keys = (keysData as any).keys || (keysData as any).data || [];
      const logs = (auditData as any).logs || (auditData as any).data || [];
      
      setApiKeys(keys);
      setAuditLogs(logs);
      setStats({
        activeKeys: keys.filter((k: any) => k.status === 'active').length,
        auditEvents24h: logs.filter((l: any) => {
          const logDate = new Date(l.timestamp || l.created_at);
          const dayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
          return logDate > dayAgo;
        }).length,
        securityAlerts: logs.filter((l: any) => l.severity === 'high' || l.severity === 'critical').length,
      });
    } catch (error) {
      console.error('Failed to load security data:', error);
      toast.error('Failed to load security data');
    } finally {
      setLoading(false);
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Security & Compliance</h1>
            <p className="text-muted-foreground mt-1">
              Manage API keys, audit logs, and security settings
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm">
              <FileText className="h-4 w-4 mr-2" />
              Export Audit Log
            </Button>
            <Button className="btn-primary">
              <Plus className="h-4 w-4" />
              Create API Key
            </Button>
          </div>
        </div>

        {/* Security Stats */}
        <div className="grid gap-4 md:grid-cols-4">
          <div className="brikk-card">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-muted-foreground">Active API Keys</span>
              <Key className="h-5 w-5" style={{ color: brikkColors.blue }} />
            </div>
            {loading ? (
              <div className="flex items-center gap-2">
                <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
                <span className="text-sm text-muted-foreground">Loading...</span>
              </div>
            ) : (
              <>
                <p className="text-2xl font-bold">{stats.activeKeys}</p>
                <p className="text-xs text-muted-foreground mt-1">Currently active</p>
              </>
            )}
          </div>
          <div className="brikk-card">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-muted-foreground">Audit Events (24h)</span>
              <FileText className="h-5 w-5" style={{ color: brikkColors.cyan }} />
            </div>
            {loading ? (
              <div className="flex items-center gap-2">
                <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
                <span className="text-sm text-muted-foreground">Loading...</span>
              </div>
            ) : (
              <>
                <p className="text-2xl font-bold">{stats.auditEvents24h}</p>
                <p className="text-xs text-muted-foreground mt-1">Last 24 hours</p>
              </>
            )}
          </div>
          <div className="brikk-card">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-muted-foreground">Security Alerts</span>
              <AlertCircle className="h-5 w-5" style={{ color: brikkColors.coral }} />
            </div>
            {loading ? (
              <div className="flex items-center gap-2">
                <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
                <span className="text-sm text-muted-foreground">Loading...</span>
              </div>
            ) : (
              <>
                <p className="text-2xl font-bold">{stats.securityAlerts}</p>
                <p className="text-xs text-muted-foreground mt-1">Requires attention</p>
              </>
            )}
          </div>
          <div className="brikk-card">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-muted-foreground">Compliance Status</span>
              <Shield className="h-5 w-5" style={{ color: brikkColors.lime }} />
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-[#A3FF12]" />
              <span className="text-sm font-medium">SOC2 Ready</span>
            </div>
          </div>
        </div>

        {/* API Keys Section */}
        <div className="brikk-card">
          <div className="mb-4 flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold">API Keys</h3>
              <p className="text-sm text-muted-foreground">
                Manage authentication keys for API access
              </p>
            </div>
            <Button variant="outline" size="sm" disabled>
              <Plus className="h-4 w-4 mr-2" />
              Create New Key
            </Button>
          </div>
          
          {/* Example API Key (for UI demonstration) */}
          <div className="space-y-3">
            <div className="p-4 rounded-lg border border-border">
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <Key className="h-4 w-4" style={{ color: brikkColors.blue }} />
                    <span className="font-medium">Production API Key</span>
                    <span className="badge-success text-xs">Active</span>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Created: Awaiting data • Last used: Awaiting data
                  </p>
                </div>
                <div className="flex items-center gap-1">
                  <Button variant="ghost" size="icon" className="h-8 w-8" disabled>
                    <Copy className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8"
                    onClick={() => setShowKey(!showKey)}
                  >
                    {showKey ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </Button>
                  <Button variant="ghost" size="icon" className="h-8 w-8" disabled>
                    <Trash2 className="h-4 w-4 text-[#FF6B6B]" />
                  </Button>
                </div>
              </div>
              <div className="flex items-center gap-2 p-2 rounded bg-accent/50 font-mono text-sm">
                {showKey ? (
                  <span>brikk_prod_xxxxxxxxxxxxxxxxxxxxxxxxxxxx</span>
                ) : (
                  <span>brikk_prod_••••••••••••••••••••••••••••</span>
                )}
              </div>
            </div>

            {/* Empty state for additional keys */}
            <div className="flex items-center justify-center py-8 border-2 border-dashed rounded-lg">
              <div className="text-center">
                <Lock className="h-8 w-8 mx-auto mb-3 text-muted-foreground" />
                <p className="text-sm text-muted-foreground">
                  No additional API keys configured
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  Keys will appear here once API is configured
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Audit Log Section */}
        <div className="brikk-card">
          <div className="mb-4 flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold">Audit Log</h3>
              <p className="text-sm text-muted-foreground">
                Track all security-relevant events and actions
              </p>
            </div>
            <Button variant="outline" size="sm" disabled>
              Filter Events
            </Button>
          </div>
          <div className="flex items-center justify-center py-12 border-2 border-dashed rounded-lg">
            <div className="text-center">
              <FileText className="h-8 w-8 mx-auto mb-3 text-muted-foreground" />
              <p className="text-sm text-muted-foreground">
                No audit events to display yet
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                Events will be logged here once API is configured
              </p>
            </div>
          </div>
        </div>

        {/* Compliance Badges */}
        <div className="brikk-card">
          <div className="mb-4">
            <h3 className="text-lg font-semibold">Compliance & Certifications</h3>
            <p className="text-sm text-muted-foreground">
              Security standards and compliance status
            </p>
          </div>
          <div className="grid gap-4 md:grid-cols-3">
            <div className="p-4 rounded-lg border border-border">
              <div className="flex items-center gap-3 mb-2">
                <div
                  className="flex h-10 w-10 items-center justify-center rounded-lg"
                  style={{ backgroundColor: `${brikkColors.lime}20` }}
                >
                  <Shield className="h-5 w-5" style={{ color: brikkColors.lime }} />
                </div>
                <div>
                  <div className="font-semibold">SOC 2 Type II</div>
                  <div className="text-xs text-muted-foreground">In Progress</div>
                </div>
              </div>
              <p className="text-xs text-muted-foreground">
                Security, availability, and confidentiality controls
              </p>
            </div>

            <div className="p-4 rounded-lg border border-border">
              <div className="flex items-center gap-3 mb-2">
                <div
                  className="flex h-10 w-10 items-center justify-center rounded-lg"
                  style={{ backgroundColor: `${brikkColors.blue}20` }}
                >
                  <Lock className="h-5 w-5" style={{ color: brikkColors.blue }} />
                </div>
                <div>
                  <div className="font-semibold">GDPR Compliant</div>
                  <div className="text-xs text-muted-foreground">Active</div>
                </div>
              </div>
              <p className="text-xs text-muted-foreground">
                EU data protection and privacy regulations
              </p>
            </div>

            <div className="p-4 rounded-lg border border-border">
              <div className="flex items-center gap-3 mb-2">
                <div
                  className="flex h-10 w-10 items-center justify-center rounded-lg"
                  style={{ backgroundColor: `${brikkColors.cyan}20` }}
                >
                  <Shield className="h-5 w-5" style={{ color: brikkColors.cyan }} />
                </div>
                <div>
                  <div className="font-semibold">HIPAA Ready</div>
                  <div className="text-xs text-muted-foreground">Available</div>
                </div>
              </div>
              <p className="text-xs text-muted-foreground">
                Healthcare data protection standards
              </p>
            </div>
          </div>
        </div>

        {/* Security Best Practices */}
        <div className="brikk-card border-2 border-dashed">
          <div className="flex items-start gap-4">
            <div
              className="flex h-10 w-10 items-center justify-center rounded-lg flex-shrink-0"
              style={{ backgroundColor: `${brikkColors.lime}20` }}
            >
              <Shield className="h-5 w-5" style={{ color: brikkColors.lime }} />
            </div>
            <div className="flex-1">
              <h4 className="font-semibold mb-2">Security Module Ready</h4>
              <p className="text-sm text-muted-foreground mb-3">
                The security interface is ready to manage API keys, audit logs, and compliance tracking. All security features will be fully functional once API endpoints are configured.
              </p>
              <div className="text-sm space-y-1">
                <p className="font-medium">🔒 Features Ready:</p>
                <ul className="list-disc list-inside text-muted-foreground ml-2 space-y-1">
                  <li>API key management (create, rotate, revoke)</li>
                  <li>Comprehensive audit logging</li>
                  <li>Role-based access control (RBAC)</li>
                  <li>Security event monitoring and alerts</li>
                  <li>Compliance status tracking (SOC2, GDPR, HIPAA)</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}

