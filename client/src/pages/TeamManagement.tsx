import { useState, useEffect } from 'react';
import { Users, UserPlus, Shield, Mail, MoreVertical } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { useApi } from '@/hooks/useApi';
import { toast } from 'sonner';

interface TeamMember {
  id: string;
  name: string;
  email: string;
  role: 'owner' | 'admin' | 'member' | 'viewer';
  status: 'active' | 'invited' | 'suspended';
  joined_at: string;
  last_active: string;
}

interface Team {
  id: string;
  name: string;
  member_count: number;
  created_at: string;
}

export default function TeamManagement() {
  const api = useApi();
  const [teams, setTeams] = useState<Team[]>([]);
  const [selectedTeam, setSelectedTeam] = useState<string>('');
  const [members, setMembers] = useState<TeamMember[]>([]);
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [inviteEmail, setInviteEmail] = useState('');
  const [inviteRole, setInviteRole] = useState<'admin' | 'member' | 'viewer'>('member');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadTeams();
  }, []);

  useEffect(() => {
    if (selectedTeam) {
      loadTeamMembers();
    }
  }, [selectedTeam]);

  const loadTeams = async () => {
    try {
      // Mock data for now
      setTeams([
        {
          id: 'team_1',
          name: 'Engineering',
          member_count: 12,
          created_at: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000).toISOString()
        },
        {
          id: 'team_2',
          name: 'Product',
          member_count: 8,
          created_at: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000).toISOString()
        }
      ]);
      
      if (!selectedTeam) {
        setSelectedTeam('team_1');
      }
      
      setIsLoading(false);
    } catch (error) {
      console.error('Failed to load teams:', error);
      setIsLoading(false);
    }
  };

  const loadTeamMembers = async () => {
    try {
      // Mock data for now
      setMembers([
        {
          id: 'user_1',
          name: 'Alice Johnson',
          email: 'alice@company.com',
          role: 'owner',
          status: 'active',
          joined_at: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000).toISOString(),
          last_active: new Date(Date.now() - 3600000).toISOString()
        },
        {
          id: 'user_2',
          name: 'Bob Smith',
          email: 'bob@company.com',
          role: 'admin',
          status: 'active',
          joined_at: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000).toISOString(),
          last_active: new Date(Date.now() - 7200000).toISOString()
        },
        {
          id: 'user_3',
          name: 'Carol Davis',
          email: 'carol@company.com',
          role: 'member',
          status: 'active',
          joined_at: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
          last_active: new Date(Date.now() - 10800000).toISOString()
        },
        {
          id: 'user_4',
          name: 'David Wilson',
          email: 'david@company.com',
          role: 'viewer',
          status: 'invited',
          joined_at: new Date().toISOString(),
          last_active: new Date().toISOString()
        }
      ]);
    } catch (error) {
      console.error('Failed to load team members:', error);
    }
  };

  const handleInviteMember = async () => {
    if (!inviteEmail) {
      toast.error('Please enter an email address');
      return;
    }

    try {
      // Mock invitation
      toast.success(`Invitation sent to ${inviteEmail}`);
      setShowInviteModal(false);
      setInviteEmail('');
      setInviteRole('member');
      
      // Reload members
      await loadTeamMembers();
    } catch (error: any) {
      toast.error(error.message || 'Failed to send invitation');
    }
  };

  const handleChangeRole = async (memberId: string, newRole: string) => {
    try {
      // Mock role change
      toast.success('Role updated successfully');
      await loadTeamMembers();
    } catch (error: any) {
      toast.error(error.message || 'Failed to update role');
    }
  };

  const handleRemoveMember = async (memberId: string) => {
    try {
      // Mock removal
      toast.success('Member removed from team');
      await loadTeamMembers();
    } catch (error: any) {
      toast.error(error.message || 'Failed to remove member');
    }
  };

  const getRoleBadgeColor = (role: string) => {
    switch (role) {
      case 'owner': return 'bg-purple-500/10 text-purple-500';
      case 'admin': return 'bg-blue-500/10 text-blue-500';
      case 'member': return 'bg-green-500/10 text-green-500';
      case 'viewer': return 'bg-gray-500/10 text-gray-500';
      default: return 'bg-gray-500/10 text-gray-500';
    }
  };

  const getStatusBadgeColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-500/10 text-green-500';
      case 'invited': return 'bg-yellow-500/10 text-yellow-500';
      case 'suspended': return 'bg-red-500/10 text-red-500';
      default: return 'bg-gray-500/10 text-gray-500';
    }
  };

  if (isLoading) {
    return (
      <div className="p-6 flex items-center justify-center min-h-screen">
        <div className="text-muted-foreground">Loading team data...</div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Team Management</h1>
          <p className="text-muted-foreground mt-2">
            Manage team members, roles, and permissions
          </p>
        </div>
        <Button onClick={() => setShowInviteModal(true)}>
          <UserPlus className="w-4 h-4 mr-2" />
          Invite Member
        </Button>
      </div>

      {/* Team Selector */}
      <Card className="p-6">
        <div className="space-y-4">
          <label className="block text-sm font-medium">Select Team</label>
          <select
            value={selectedTeam}
            onChange={(e) => setSelectedTeam(e.target.value)}
            className="w-full px-3 py-2 border rounded-lg bg-background"
          >
            {teams.map((team) => (
              <option key={team.id} value={team.id}>
                {team.name} ({team.member_count} members)
              </option>
            ))}
          </select>
        </div>
      </Card>

      {/* Team Stats */}
      <div className="grid grid-cols-4 gap-4">
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <Users className="w-8 h-8 text-blue-500" />
            <div>
              <p className="text-sm text-muted-foreground">Total Members</p>
              <p className="text-2xl font-bold">{members.length}</p>
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center gap-3">
            <Shield className="w-8 h-8 text-purple-500" />
            <div>
              <p className="text-sm text-muted-foreground">Admins</p>
              <p className="text-2xl font-bold">
                {members.filter(m => m.role === 'admin' || m.role === 'owner').length}
              </p>
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center gap-3">
            <Mail className="w-8 h-8 text-yellow-500" />
            <div>
              <p className="text-sm text-muted-foreground">Pending Invites</p>
              <p className="text-2xl font-bold">
                {members.filter(m => m.status === 'invited').length}
              </p>
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center gap-3">
            <Users className="w-8 h-8 text-green-500" />
            <div>
              <p className="text-sm text-muted-foreground">Active</p>
              <p className="text-2xl font-bold">
                {members.filter(m => m.status === 'active').length}
              </p>
            </div>
          </div>
        </Card>
      </div>

      {/* Members Table */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">Team Members</h3>
        <div className="space-y-3">
          {members.map((member) => (
            <div key={member.id} className="border rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                    <span className="text-sm font-medium">
                      {member.name.split(' ').map(n => n[0]).join('')}
                    </span>
                  </div>
                  <div>
                    <div className="font-medium">{member.name}</div>
                    <div className="text-sm text-muted-foreground">{member.email}</div>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <div className="flex gap-2">
                    <span className={`px-3 py-1 rounded-full text-xs ${getRoleBadgeColor(member.role)}`}>
                      {member.role}
                    </span>
                    <span className={`px-3 py-1 rounded-full text-xs ${getStatusBadgeColor(member.status)}`}>
                      {member.status}
                    </span>
                  </div>

                  <div className="text-sm text-muted-foreground">
                    Last active: {new Date(member.last_active).toLocaleDateString()}
                  </div>

                  <Button variant="ghost" size="sm">
                    <MoreVertical className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* Invite Modal */}
      {showInviteModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <Card className="p-6 w-full max-w-md">
            <h3 className="text-lg font-semibold mb-4">Invite Team Member</h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Email Address</label>
                <input
                  type="email"
                  value={inviteEmail}
                  onChange={(e) => setInviteEmail(e.target.value)}
                  placeholder="colleague@company.com"
                  className="w-full px-3 py-2 border rounded-lg bg-background"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Role</label>
                <select
                  value={inviteRole}
                  onChange={(e) => setInviteRole(e.target.value as any)}
                  className="w-full px-3 py-2 border rounded-lg bg-background"
                >
                  <option value="viewer">Viewer - Read-only access</option>
                  <option value="member">Member - Can create and edit</option>
                  <option value="admin">Admin - Full access except billing</option>
                </select>
              </div>

              <div className="flex gap-2 justify-end">
                <Button variant="outline" onClick={() => setShowInviteModal(false)}>
                  Cancel
                </Button>
                <Button onClick={handleInviteMember}>
                  Send Invitation
                </Button>
              </div>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
}
