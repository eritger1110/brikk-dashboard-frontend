import DashboardLayout from '@/components/layout/DashboardLayout';
import { Search, UserPlus, Check, AlertTriangle, X } from 'lucide-react';

interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'manager' | 'operator' | 'viewer';
  avatar?: string;
}

const users: User[] = [
  { id: '1', name: 'Jenny Wilson', email: 'jenny.wilson@company.com', role: 'admin' },
  { id: '2', name: 'Ronald Richards', email: 'ronald.richards@company.com', role: 'manager' },
  { id: '3', name: 'Cameron Williamson', email: 'cameron.williamson@company.com', role: 'operator' },
  { id: '4', name: 'Kristin Watson', email: 'kristin.watson@company.com', role: 'viewer' },
];

const roleColors = {
  admin: 'bg-primary text-primary-foreground',
  manager: 'bg-blue-500 text-white',
  operator: 'bg-green-500 text-white',
  viewer: 'bg-slate-500 text-white',
};

const permissions = [
  { resource: 'Workflows', viewer: 'granted', operator: 'conditional', manager: 'granted', admin: 'granted' },
  { resource: 'Integrations', viewer: 'conditional', operator: 'granted', manager: 'granted', admin: 'granted' },
  { resource: 'Monitoring', viewer: 'granted', operator: 'granted', manager: 'granted', admin: 'granted' },
  { resource: 'Audit Logs', viewer: 'granted', operator: 'granted', manager: 'conditional', admin: 'granted' },
  { resource: 'User Management', viewer: 'denied', operator: 'denied', manager: 'denied', admin: 'granted' },
];

function PermissionIcon({ status }: { status: 'granted' | 'denied' | 'conditional' }) {
  if (status === 'granted') {
    return <Check className="h-4 w-4 text-success" />;
  }
  if (status === 'conditional') {
    return <AlertTriangle className="h-4 w-4 text-warning" />;
  }
  return <X className="h-4 w-4 text-muted-foreground" />;
}

function UserCard({ user }: { user: User }) {
  return (
    <div className="flex items-center justify-between py-3 px-4 border-b border-border last:border-0 hover:bg-accent/50 transition-colors">
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
          <span className="text-sm font-semibold text-primary">
            {user.name.split(' ').map(n => n[0]).join('')}
          </span>
        </div>
        <div>
          <p className="text-sm font-medium text-foreground">{user.name}</p>
          <p className="text-xs text-muted-foreground">{user.email}</p>
        </div>
      </div>
      <span className={`rounded-md px-3 py-1 text-xs font-medium ${roleColors[user.role]}`}>
        {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
      </span>
    </div>
  );
}

export default function RoleManagement() {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Page header */}
        <div>
          <h1 className="text-3xl font-bold text-foreground">Role Management</h1>
          <p className="mt-2 text-muted-foreground">
            Manage user access and permissions across the platform
          </p>
        </div>

        {/* Main Grid */}
        <div className="grid gap-6 lg:grid-cols-3">
          {/* Users List */}
          <div className="rounded-lg border border-border bg-card">
            <div className="p-4 border-b border-border">
              <h2 className="text-lg font-semibold text-foreground mb-3">Users</h2>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <input
                  type="text"
                  placeholder="Search users..."
                  className="w-full rounded-lg border border-input bg-background pl-10 pr-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                />
              </div>
            </div>
            <div className="max-h-96 overflow-y-auto">
              {users.map((user) => (
                <UserCard key={user.id} user={user} />
              ))}
            </div>
            <div className="p-4 border-t border-border">
              <button className="w-full inline-flex items-center justify-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors">
                <UserPlus className="h-4 w-4" />
                Invite New User
              </button>
            </div>
          </div>

          {/* Permissions Matrix */}
          <div className="lg:col-span-2 rounded-lg border border-border bg-card p-6">
            <h2 className="text-lg font-semibold text-foreground mb-4">Permissions Matrix</h2>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left py-3 px-4 text-sm font-semibold text-foreground">
                      Resource
                    </th>
                    <th className="text-center py-3 px-4 text-sm font-semibold text-foreground">
                      Viewer
                    </th>
                    <th className="text-center py-3 px-4 text-sm font-semibold text-foreground">
                      Operator
                    </th>
                    <th className="text-center py-3 px-4 text-sm font-semibold text-foreground">
                      Manager
                    </th>
                    <th className="text-center py-3 px-4 text-sm font-semibold text-foreground">
                      Admin
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {permissions.map((perm, index) => (
                    <tr key={index} className="border-b border-border last:border-0 hover:bg-accent/30">
                      <td className="py-3 px-4 text-sm font-medium text-foreground">
                        {perm.resource}
                      </td>
                      <td className="py-3 px-4 text-center">
                        <div className="flex justify-center">
                          <PermissionIcon status={perm.viewer as any} />
                        </div>
                      </td>
                      <td className="py-3 px-4 text-center">
                        <div className="flex justify-center">
                          <PermissionIcon status={perm.operator as any} />
                        </div>
                      </td>
                      <td className="py-3 px-4 text-center">
                        <div className="flex justify-center">
                          <PermissionIcon status={perm.manager as any} />
                        </div>
                      </td>
                      <td className="py-3 px-4 text-center">
                        <div className="flex justify-center">
                          <PermissionIcon status={perm.admin as any} />
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Legend */}
            <div className="mt-6 flex items-center gap-6 text-xs text-muted-foreground">
              <div className="flex items-center gap-2">
                <Check className="h-4 w-4 text-success" />
                <span>Granted</span>
              </div>
              <div className="flex items-center gap-2">
                <AlertTriangle className="h-4 w-4 text-warning" />
                <span>Conditional</span>
              </div>
              <div className="flex items-center gap-2">
                <X className="h-4 w-4 text-muted-foreground" />
                <span>Denied</span>
              </div>
            </div>
          </div>
        </div>

        {/* Role Definitions */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          <div className="rounded-lg border border-border bg-card p-6">
            <div className="flex items-center gap-2 mb-3">
              <span className={`rounded-md px-3 py-1 text-xs font-medium ${roleColors.viewer}`}>
                Viewer
              </span>
            </div>
            <p className="text-sm text-muted-foreground mb-3">
              Can view resources but cannot make any changes. Ideal for stakeholders who need visibility.
            </p>
            <ul className="space-y-1 text-xs text-muted-foreground">
              <li>• View BrikkFlows</li>
              <li>• View monitoring dashboards</li>
              <li>• View audit logs (own actions)</li>
            </ul>
          </div>

          <div className="rounded-lg border border-border bg-card p-6">
            <div className="flex items-center gap-2 mb-3">
              <span className={`rounded-md px-3 py-1 text-xs font-medium ${roleColors.operator}`}>
                Operator
              </span>
            </div>
            <p className="text-sm text-muted-foreground mb-3">
              Can create and modify BrikkFlows but cannot deploy to production. Ideal for BrikkFlow builders.
            </p>
            <ul className="space-y-1 text-xs text-muted-foreground">
              <li>• All Viewer permissions</li>
              <li>• Create BrikkFlows</li>
              <li>• Edit BrikkFlows</li>
              <li>• Run simulations</li>
            </ul>
          </div>

          <div className="rounded-lg border border-border bg-card p-6">
            <div className="flex items-center gap-2 mb-3">
              <span className={`rounded-md px-3 py-1 text-xs font-medium ${roleColors.manager}`}>
                Manager
              </span>
            </div>
            <p className="text-sm text-muted-foreground mb-3">
              Can approve deployments and configure integrations. Ideal for team leads.
            </p>
            <ul className="space-y-1 text-xs text-muted-foreground">
              <li>• All Operator permissions</li>
              <li>• Approve deployments</li>
              <li>• Configure integrations</li>
              <li>• Manage alerts</li>
            </ul>
          </div>

          <div className="rounded-lg border border-border bg-card p-6">
            <div className="flex items-center gap-2 mb-3">
              <span className={`rounded-md px-3 py-1 text-xs font-medium ${roleColors.admin}`}>
                Admin
              </span>
            </div>
            <p className="text-sm text-muted-foreground mb-3">
              Full control over all platform features. Assign sparingly to trusted individuals.
            </p>
            <ul className="space-y-1 text-xs text-muted-foreground">
              <li>• All Manager permissions</li>
              <li>• Manage users</li>
              <li>• Assign roles</li>
              <li>• Configure SSO</li>
            </ul>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}

