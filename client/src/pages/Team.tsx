import { useEffect, useState } from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Users,
  UserPlus,
  MoreVertical,
  Mail,
  Shield,
  Trash2,
  RefreshCw,
  AlertTriangle,
  Crown,
  CheckCircle,
  Clock,
} from 'lucide-react';
import { useApi } from '@/hooks/useApi';
import { useDemoMode } from '@/contexts/DemoModeContext';
import { toast } from 'sonner';
import type { User, UserRole } from '@/types/api';

const ROLE_LABELS: Record<UserRole, string> = {
  owner: 'Owner',
  admin: 'Admin',
  builder: 'Builder',
  viewer: 'Viewer',
};

const ROLE_DESCRIPTIONS: Record<UserRole, string> = {
  owner: 'Full access to all features and billing',
  admin: 'Manage users, workflows, and settings',
  builder: 'Create and edit workflows and agents',
  viewer: 'Read-only access to workflows and analytics',
};

const ROLE_ICONS: Record<UserRole, any> = {
  owner: Crown,
  admin: Shield,
  builder: Users,
  viewer: Users,
};

export default function Team() {
  const api = useApi();
  const { isDemoMode } = useDemoMode();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [showInviteDialog, setShowInviteDialog] = useState(false);
  const [inviteEmail, setInviteEmail] = useState('');
  const [inviteRole, setInviteRole] = useState<UserRole>('viewer');
  const [inviting, setInviting] = useState(false);

  const loadUsers = async () => {
    setLoading(true);
    try {
      const response = await api.getOrgUsers({ limit: 100 });
      setUsers(response.data || []);
    } catch (err: any) {
      console.error('Failed to load users:', err);
      
      // Set demo data if in demo mode
      if (isDemoMode) {
        setUsers([
          {
            id: 'user-1',
            email: 'john@brikk.ai',
            name: 'John Smith',
            role: 'owner',
            status: 'active',
            org_id: 'org-demo',
            created_at: '2024-01-15T10:00:00Z',
            last_seen: '2024-11-21T09:00:00Z',
          },
          {
            id: 'user-2',
            email: 'sarah@brikk.ai',
            name: 'Sarah Johnson',
            role: 'admin',
            status: 'active',
            org_id: 'org-demo',
            created_at: '2024-02-01T10:00:00Z',
            last_seen: '2024-11-21T08:30:00Z',
          },
          {
            id: 'user-3',
            email: 'mike@brikk.ai',
            name: 'Mike Chen',
            role: 'builder',
            status: 'active',
            org_id: 'org-demo',
            created_at: '2024-03-10T10:00:00Z',
            last_seen: '2024-11-20T16:00:00Z',
          },
          {
            id: 'user-4',
            email: 'emma@partner.com',
            name: 'Emma Wilson',
            role: 'viewer',
            status: 'invited',
            org_id: 'org-demo',
            created_at: '2024-11-20T14:00:00Z',
          },
        ]);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUsers();
  }, []);

  const handleInviteUser = async () => {
    if (!inviteEmail || !inviteEmail.includes('@')) {
      toast.error('Please enter a valid email address');
      return;
    }

    setInviting(true);
    try {
      await api.inviteUser({ email: inviteEmail, role: inviteRole });
      toast.success(`Invitation sent to ${inviteEmail}`);
      setShowInviteDialog(false);
      setInviteEmail('');
      setInviteRole('viewer');
      loadUsers();
    } catch (err: any) {
      console.error('Failed to invite user:', err);
      if (isDemoMode) {
        toast.info('Demo mode: User invite simulated');
        setShowInviteDialog(false);
      } else {
        toast.error('Failed to send invitation');
      }
    } finally {
      setInviting(false);
    }
  };

  const handleUpdateRole = async (userId: string, newRole: UserRole) => {
    try {
      await api.updateUserRole(userId, newRole);
      toast.success('User role updated');
      loadUsers();
    } catch (err: any) {
      console.error('Failed to update role:', err);
      if (isDemoMode) {
        toast.info('Demo mode: Role update simulated');
      } else {
        toast.error('Failed to update role');
      }
    }
  };

  const handleRemoveUser = async (userId: string, userEmail: string) => {
    if (!confirm(`Remove ${userEmail} from the organization?`)) {
      return;
    }

    try {
      await api.removeUser(userId);
      toast.success('User removed');
      loadUsers();
    } catch (err: any) {
      console.error('Failed to remove user:', err);
      if (isDemoMode) {
        toast.info('Demo mode: User removal simulated');
      } else {
        toast.error('Failed to remove user');
      }
    }
  };

  const activeUsers = users.filter(u => u.status === 'active').length;
  const invitedUsers = users.filter(u => u.status === 'invited').length;

  if (loading) {
    return (
      <DashboardLayout>
        <div className="container mx-auto py-8">
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="text-center">
              <RefreshCw className="w-12 h-12 animate-spin text-primary mx-auto mb-4" />
              <p className="text-muted-foreground">Loading team...</p>
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
              Team
            </h1>
            <p className="text-muted-foreground mt-1">
              Manage users, roles, and permissions
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Button onClick={loadUsers} variant="outline">
              <RefreshCw className="w-4 h-4 mr-2" />
              Refresh
            </Button>
            <Button onClick={() => setShowInviteDialog(true)}>
              <UserPlus className="w-4 h-4 mr-2" />
              Invite User
            </Button>
          </div>
        </div>

        {/* Demo Mode Banner */}
        {isDemoMode && (
          <Card className="p-4 bg-amber-500/10 border-amber-500/20">
            <div className="flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-amber-500" />
              <p className="text-sm font-medium">
                Demo Mode Active - Showing sample team members
              </p>
            </div>
          </Card>
        )}

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-lg bg-primary/10">
                <Users className="w-6 h-6 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total Members</p>
                <p className="text-2xl font-bold">{users.length}</p>
              </div>
            </div>
          </Card>
          <Card className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-lg bg-green-500/10">
                <CheckCircle className="w-6 h-6 text-green-500" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Active</p>
                <p className="text-2xl font-bold">{activeUsers}</p>
              </div>
            </div>
          </Card>
          <Card className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-lg bg-amber-500/10">
                <Clock className="w-6 h-6 text-amber-500" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Pending Invites</p>
                <p className="text-2xl font-bold">{invitedUsers}</p>
              </div>
            </div>
          </Card>
        </div>

        {/* Users List */}
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4">Team Members</h3>
          <div className="space-y-3">
            {users.map((user) => {
              const RoleIcon = ROLE_ICONS[user.role];
              return (
                <div key={user.id} className="flex items-center justify-between p-4 rounded-lg border">
                  <div className="flex items-center gap-4">
                    <div className="p-3 rounded-full bg-primary/10">
                      <RoleIcon className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <p className="font-medium">{user.name || user.email}</p>
                        {user.status === 'invited' && (
                          <Badge variant="outline" className="text-xs">
                            <Mail className="w-3 h-3 mr-1" />
                            Invited
                          </Badge>
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground">{user.email}</p>
                      {user.last_seen && (
                        <p className="text-xs text-muted-foreground mt-1">
                          Last seen: {new Date(user.last_seen).toLocaleDateString()}
                        </p>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Badge variant={user.role === 'owner' ? 'default' : 'secondary'}>
                      {ROLE_LABELS[user.role]}
                    </Badge>
                    {user.role !== 'owner' && (
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreVertical className="w-4 h-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => handleUpdateRole(user.id, 'admin')}>
                            Change to Admin
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleUpdateRole(user.id, 'builder')}>
                            Change to Builder
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleUpdateRole(user.id, 'viewer')}>
                            Change to Viewer
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => handleRemoveUser(user.id, user.email)}
                            className="text-destructive"
                          >
                            <Trash2 className="w-4 h-4 mr-2" />
                            Remove User
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </Card>

        {/* Roles Reference */}
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4">Role Permissions</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {(Object.keys(ROLE_LABELS) as UserRole[]).map((role) => {
              const RoleIcon = ROLE_ICONS[role];
              return (
                <div key={role} className="p-4 rounded-lg border">
                  <div className="flex items-center gap-2 mb-2">
                    <RoleIcon className="w-5 h-5 text-primary" />
                    <p className="font-semibold">{ROLE_LABELS[role]}</p>
                  </div>
                  <p className="text-sm text-muted-foreground">{ROLE_DESCRIPTIONS[role]}</p>
                </div>
              );
            })}
          </div>
        </Card>

        {/* Invite Dialog */}
        <Dialog open={showInviteDialog} onOpenChange={setShowInviteDialog}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Invite Team Member</DialogTitle>
              <DialogDescription>
                Send an invitation to join your organization
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Email Address</label>
                <Input
                  type="email"
                  placeholder="colleague@company.com"
                  value={inviteEmail}
                  onChange={(e) => setInviteEmail(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Role</label>
                <Select value={inviteRole} onValueChange={(v) => setInviteRole(v as UserRole)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="viewer">Viewer - Read-only access</SelectItem>
                    <SelectItem value="builder">Builder - Create and edit</SelectItem>
                    <SelectItem value="admin">Admin - Manage team</SelectItem>
                  </SelectContent>
                </Select>
                <p className="text-xs text-muted-foreground">
                  {ROLE_DESCRIPTIONS[inviteRole]}
                </p>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setShowInviteDialog(false)}>
                Cancel
              </Button>
              <Button onClick={handleInviteUser} disabled={inviting}>
                {inviting ? 'Sending...' : 'Send Invitation'}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </DashboardLayout>
  );
}
