import { useState, useEffect } from 'react';
import { GitBranch, History, RotateCcw, FlaskConical, TrendingUp, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { useApi } from '@/hooks/useApi';
import { toast } from 'sonner';

interface AgentVersion {
  id: string;
  agent_id: string;
  version: string;
  config: any;
  config_hash: string;
  notes: string;
  created_at: string;
}

interface ABTest {
  id: string;
  agent_id: string;
  version_a: string;
  version_b: string;
  traffic_split: number;
  start_time: string;
  end_time: string;
  status: 'running' | 'stopped' | 'completed';
}

export default function AgentVersioning() {
  const api = useApi();
  const [agents, setAgents] = useState<any[]>([]);
  const [selectedAgent, setSelectedAgent] = useState<string>('');
  const [versions, setVersions] = useState<AgentVersion[]>([]);
  const [abTests, setABTests] = useState<ABTest[]>([]);
  const [showCreateVersion, setShowCreateVersion] = useState(false);
  const [showABTest, setShowABTest] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadAgents();
  }, []);

  useEffect(() => {
    if (selectedAgent) {
      loadVersions();
      loadABTests();
    }
  }, [selectedAgent]);

  const loadAgents = async () => {
    try {
      const response = await api.getAgents();
      setAgents(response.data || []);
      
      if (response.data && response.data.length > 0 && !selectedAgent) {
        setSelectedAgent(response.data[0].id);
      }
      
      setIsLoading(false);
    } catch (error) {
      console.error('Failed to load agents:', error);
      setIsLoading(false);
    }
  };

  const loadVersions = async () => {
    try {
      const baseUrl = import.meta.env.VITE_API_BASE_URL;
      const response = await fetch(`${baseUrl}/api/versioning/versions/${selectedAgent}`);
      const data = await response.json();
      setVersions(data.data || []);
    } catch (error) {
      console.error('Failed to load versions:', error);
    }
  };

  const loadABTests = async () => {
    try {
      const baseUrl = import.meta.env.VITE_API_BASE_URL;
      const response = await fetch(`${baseUrl}/api/versioning/ab-tests?agent_id=${selectedAgent}`);
      const data = await response.json();
      setABTests(data.data || []);
    } catch (error) {
      console.error('Failed to load A/B tests:', error);
    }
  };

  const handleRollback = async (targetVersion: string) => {
    if (!confirm(`Are you sure you want to rollback to version ${targetVersion}?`)) {
      return;
    }

    try {
      const baseUrl = import.meta.env.VITE_API_BASE_URL;
      const response = await fetch(`${baseUrl}/api/versioning/rollback`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          agent_id: selectedAgent,
          target_version: targetVersion
        })
      });

      if (!response.ok) throw new Error('Rollback failed');

      toast.success(`Rolled back to version ${targetVersion}`);
      await loadVersions();
    } catch (error: any) {
      toast.error(error.message || 'Failed to rollback');
    }
  };

  const handleCompareVersions = async (versionA: string, versionB: string) => {
    try {
      const baseUrl = import.meta.env.VITE_API_BASE_URL;
      const response = await fetch(
        `${baseUrl}/api/versioning/compare?agent_id=${selectedAgent}&version_a=${versionA}&version_b=${versionB}`
      );
      const data = await response.json();
      
      // Show comparison in modal or new view
      console.log('Version comparison:', data);
      toast.success('Comparison loaded (check console)');
    } catch (error: any) {
      toast.error(error.message || 'Failed to compare versions');
    }
  };

  if (isLoading) {
    return (
      <div className="p-6 flex items-center justify-center min-h-screen">
        <div className="text-muted-foreground">Loading versioning data...</div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Agent Versioning</h1>
          <p className="text-muted-foreground mt-2">
            Version control, A/B testing, and rollback for AI agents
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => setShowCreateVersion(true)}>
            <GitBranch className="w-4 h-4 mr-2" />
            Create Version
          </Button>
          <Button onClick={() => setShowABTest(true)}>
            <FlaskConical className="w-4 h-4 mr-2" />
            Start A/B Test
          </Button>
        </div>
      </div>

      {/* Agent Selector */}
      <Card className="p-6">
        <div className="space-y-4">
          <label className="block text-sm font-medium">Select Agent</label>
          <select
            value={selectedAgent}
            onChange={(e) => setSelectedAgent(e.target.value)}
            className="w-full px-3 py-2 border rounded-lg bg-background"
          >
            {agents.map((agent) => (
              <option key={agent.id} value={agent.id}>
                {agent.name}
              </option>
            ))}
          </select>
        </div>
      </Card>

      {/* Active A/B Tests */}
      {abTests.filter(t => t.status === 'running').length > 0 && (
        <Card className="p-6 border-blue-500/50 bg-blue-500/5">
          <div className="flex items-center gap-3 mb-4">
            <FlaskConical className="w-5 h-5 text-blue-500" />
            <h3 className="text-lg font-semibold">Active A/B Tests</h3>
          </div>
          <div className="space-y-3">
            {abTests.filter(t => t.status === 'running').map((test) => (
              <div key={test.id} className="border rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-medium">
                      {test.version_a} vs {test.version_b}
                    </div>
                    <div className="text-sm text-muted-foreground mt-1">
                      Traffic split: {(test.traffic_split * 100).toFixed(0)}% to version B
                    </div>
                    <div className="text-sm text-muted-foreground">
                      Started: {new Date(test.start_time).toLocaleString()}
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm">
                      View Results
                    </Button>
                    <Button variant="outline" size="sm">
                      Stop Test
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* Version History */}
      <Card className="p-6">
        <div className="flex items-center gap-3 mb-4">
          <History className="w-5 h-5" />
          <h3 className="text-lg font-semibold">Version History</h3>
        </div>

        {versions.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <GitBranch className="w-12 h-12 mx-auto mb-3 opacity-50" />
            <p>No versions yet. Create your first version to get started.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {versions.map((version, idx) => (
              <div key={version.id} className="border rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                      idx === 0 ? 'bg-green-500/10 text-green-500' : 'bg-muted'
                    }`}>
                      <GitBranch className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-medium text-lg">v{version.version}</span>
                        {idx === 0 && (
                          <span className="px-2 py-1 bg-green-500/10 text-green-500 text-xs rounded">
                            Current
                          </span>
                        )}
                      </div>
                      <div className="text-sm text-muted-foreground mt-1">
                        {version.notes || 'No release notes'}
                      </div>
                      <div className="text-xs text-muted-foreground mt-1">
                        {new Date(version.created_at).toLocaleString()}
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    {idx > 0 && (
                      <>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleCompareVersions(versions[0].version, version.version)}
                        >
                          <TrendingUp className="w-4 h-4 mr-2" />
                          Compare
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleRollback(version.version)}
                        >
                          <RotateCcw className="w-4 h-4 mr-2" />
                          Rollback
                        </Button>
                      </>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </Card>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <GitBranch className="w-8 h-8 text-blue-500" />
            <div>
              <p className="text-sm text-muted-foreground">Total Versions</p>
              <p className="text-2xl font-bold">{versions.length}</p>
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center gap-3">
            <FlaskConical className="w-8 h-8 text-purple-500" />
            <div>
              <p className="text-sm text-muted-foreground">Active A/B Tests</p>
              <p className="text-2xl font-bold">
                {abTests.filter(t => t.status === 'running').length}
              </p>
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center gap-3">
            <RotateCcw className="w-8 h-8 text-orange-500" />
            <div>
              <p className="text-sm text-muted-foreground">Rollbacks</p>
              <p className="text-2xl font-bold">
                {versions.filter(v => v.notes.includes('Rollback')).length}
              </p>
            </div>
          </div>
        </Card>
      </div>

      {/* Best Practices */}
      <Card className="p-6 border-yellow-500/50 bg-yellow-500/5">
        <div className="flex gap-3">
          <AlertCircle className="w-5 h-5 text-yellow-500 flex-shrink-0 mt-0.5" />
          <div>
            <h4 className="font-semibold mb-2">Version Control Best Practices</h4>
            <ul className="text-sm text-muted-foreground space-y-1">
              <li>• Always test new versions in simulation mode before deployment</li>
              <li>• Use A/B testing to validate improvements with real traffic</li>
              <li>• Document changes in release notes for team visibility</li>
              <li>• Keep at least 3-5 previous versions for quick rollback</li>
              <li>• Monitor performance metrics after version deployments</li>
            </ul>
          </div>
        </div>
      </Card>
    </div>
  );
}
