import DashboardLayout from '@/components/layout/DashboardLayout';
import { Search, Download, Shield, User, Calendar } from 'lucide-react';
import { format } from 'date-fns';

interface AuditEvent {
  id: string;
  type: 'configuration' | 'deployment' | 'access' | 'security';
  action: string;
  user: {
    name: string;
    email: string;
  };
  timestamp: Date;
  details: string;
  metadata?: {
    ip?: string;
    sessionId?: string;
    hash?: string;
  };
}

const auditEvents: AuditEvent[] = [
  {
    id: '1',
    type: 'configuration',
    action: 'Workflow Modified',
    user: { name: 'Angie Admin', email: 'angie@company.com' },
    timestamp: new Date(2025, 9, 30, 13, 44),
    details: 'Condition threshold changed from "10 units" to "15 units" in workflow "Auto-Reorder Low Inventory"',
    metadata: {
      ip: '192.168.1.100',
      sessionId: 'c2f1f57a',
      hash: 'sha256:a3b2c1...',
    },
  },
  {
    id: '2',
    type: 'deployment',
    action: 'Workflow Deployed',
    user: { name: 'Tom Martinez', email: 'tom@company.com' },
    timestamp: new Date(2025, 9, 30, 12, 30),
    details: 'Deployed workflow "Customer Onboarding" to production (v2.3.0)',
    metadata: {
      ip: '192.168.1.105',
      sessionId: '5a1191c7',
      hash: 'sha256:b4c3d2...',
    },
  },
  {
    id: '3',
    type: 'access',
    action: 'User Login',
    user: { name: 'Angie Admin', email: 'angie@company.com' },
    timestamp: new Date(2025, 9, 30, 9, 15),
    details: 'Successful login via SSO (Azure AD)',
    metadata: {
      ip: '192.168.1.100',
      sessionId: '1fa35900',
      hash: 'sha256:c5d4e3...',
    },
  },
  {
    id: '4',
    type: 'security',
    action: 'Role Assignment Changed',
    user: { name: 'Tom Martinez', email: 'tom@company.com' },
    timestamp: new Date(2025, 9, 29, 16, 22),
    details: 'Changed user "john.doe@company.com" role from Viewer to Operator',
    metadata: {
      ip: '192.168.1.105',
      sessionId: 'e95645e8',
      hash: 'sha256:d6e5f4...',
    },
  },
];

const eventTypeConfig = {
  configuration: {
    color: 'border-l-blue-500',
    badge: 'badge-primary',
    label: 'Configuration',
  },
  deployment: {
    color: 'border-l-green-500',
    badge: 'badge-success',
    label: 'Deployment',
  },
  access: {
    color: 'border-l-yellow-500',
    badge: 'badge-warning',
    label: 'Access',
  },
  security: {
    color: 'border-l-red-500',
    badge: 'badge-danger',
    label: 'Security',
  },
};

function AuditEventCard({ event }: { event: AuditEvent }) {
  const config = eventTypeConfig[event.type];

  return (
    <div className={`rounded-lg border border-border ${config.color} border-l-4 bg-card p-6`}>
      {/* Header */}
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-2">
            <span className={config.badge}>{config.label}</span>
            <h3 className="text-base font-semibold text-foreground">{event.action}</h3>
          </div>
          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <div className="flex items-center gap-1.5">
              <User className="h-4 w-4" />
              <span>{event.user.name}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Calendar className="h-4 w-4" />
              <span>
                {format(event.timestamp, 'MMM dd, yyyy h:mm a')} CDT
                <span className="ml-2 text-xs">
                  ({format(event.timestamp, 'HH:mm')} UTC)
                </span>
              </span>
            </div>
          </div>
        </div>
        <Shield className="h-5 w-5 text-muted-foreground" />
      </div>

      {/* Details */}
      <p className="text-sm text-foreground mb-4">{event.details}</p>

      {/* Metadata */}
      {event.metadata && (
        <div className="rounded-lg bg-muted/30 p-3 space-y-2">
          <h4 className="text-xs font-semibold text-foreground uppercase tracking-wide">
            Event Metadata
          </h4>
          <div className="grid grid-cols-2 gap-2 text-xs">
            <div>
              <span className="text-muted-foreground">Event ID:</span>
              <span className="ml-2 font-mono text-foreground">{event.id}</span>
            </div>
            {event.metadata.sessionId && (
              <div>
                <span className="text-muted-foreground">Session ID:</span>
                <span className="ml-2 font-mono text-foreground">{event.metadata.sessionId}</span>
              </div>
            )}
            {event.metadata.ip && (
              <div>
                <span className="text-muted-foreground">IP Address:</span>
                <span className="ml-2 font-mono text-foreground">{event.metadata.ip}</span>
              </div>
            )}
            {event.metadata.hash && (
              <div className="col-span-2 flex items-center gap-2">
                <span className="text-muted-foreground">Hash:</span>
                <span className="font-mono text-foreground truncate">{event.metadata.hash}</span>
                <Shield className="h-3 w-3 text-success flex-shrink-0" />
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default function AuditLogs() {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Page header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Audit Logs</h1>
            <p className="mt-2 text-muted-foreground">
              Immutable activity timeline for compliance and security monitoring
            </p>
          </div>
          <button className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors">
            <Download className="h-4 w-4" />
            Generate Compliance Report
          </button>
        </div>

        {/* Filters */}
        <div className="rounded-lg border border-border bg-card p-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
            {/* Search */}
            <div className="lg:col-span-2">
              <label className="text-sm font-medium text-foreground mb-2 block">
                Search
              </label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <input
                  type="text"
                  placeholder="Search events..."
                  className="w-full rounded-lg border border-input bg-background pl-10 pr-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                />
              </div>
            </div>

            {/* Time Range */}
            <div>
              <label className="text-sm font-medium text-foreground mb-2 block">
                Time Range
              </label>
              <select className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring">
                <option>Last 7 days</option>
                <option>Last 30 days</option>
                <option>Last 90 days</option>
                <option>Custom range</option>
              </select>
            </div>

            {/* Event Type */}
            <div>
              <label className="text-sm font-medium text-foreground mb-2 block">
                Event Type
              </label>
              <select className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring">
                <option>All types</option>
                <option>Configuration</option>
                <option>Deployment</option>
                <option>Access</option>
                <option>Security</option>
              </select>
            </div>

            {/* User */}
            <div>
              <label className="text-sm font-medium text-foreground mb-2 block">
                User
              </label>
              <select className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring">
                <option>All users</option>
                <option>Angie Admin</option>
                <option>Tom Martinez</option>
                <option>John Doe</option>
              </select>
            </div>
          </div>
        </div>

        {/* Event Timeline */}
        <div className="space-y-4">
          {auditEvents.map((event) => (
            <AuditEventCard key={event.id} event={event} />
          ))}
        </div>

        {/* Compliance Notice */}
        <div className="rounded-lg border border-border bg-card p-6">
          <div className="flex items-start gap-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-success/10">
              <Shield className="h-5 w-5 text-success" />
            </div>
            <div className="flex-1">
              <h3 className="text-base font-semibold text-foreground mb-2">
                SOC2 & HIPAA Compliant Audit Trail
              </h3>
              <p className="text-sm text-muted-foreground">
                All events are cryptographically signed and stored in an immutable ledger. Each entry includes
                a SHA-256 hash that proves the record has not been tampered with. Audit logs can be exported
                for external SIEM systems and compliance audits.
              </p>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}

