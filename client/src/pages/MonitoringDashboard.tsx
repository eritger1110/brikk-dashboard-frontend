import { useState, useEffect } from 'react';
import { Activity, AlertCircle, CheckCircle, Clock, Zap } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { useApi } from '@/hooks/useApi';
import { AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface AgentStatus {
  agent_id: string;
  agent_name: string;
  status: 'running' | 'idle' | 'error';
  tasks_completed: number;
  tasks_pending: number;
  avg_execution_time_ms: number;
  last_activity: string;
  error_count: number;
}

interface ExecutionMetric {
  timestamp: string;
  total_executions: number;
  successful: number;
  failed: number;
  avg_duration_ms: number;
}

interface SystemHealth {
  cpu_usage: number;
  memory_usage: number;
  active_agents: number;
  total_agents: number;
  message_queue_size: number;
}

export default function MonitoringDashboard() {
  const api = useApi();
  const [agentStatuses, setAgentStatuses] = useState<AgentStatus[]>([]);
  const [executionMetrics, setExecutionMetrics] = useState<ExecutionMetric[]>([]);
  const [systemHealth, setSystemHealth] = useState<SystemHealth | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadMonitoringData();
    
    // Refresh every 5 seconds
    const interval = setInterval(loadMonitoringData, 5000);
    return () => clearInterval(interval);
  }, []);

  const loadMonitoringData = async () => {
    try {
      // For now, use mock data until backend endpoints are ready
      setAgentStatuses(getMockAgentStatuses());
      setExecutionMetrics(getMockExecutionMetrics());
      setSystemHealth(getMockSystemHealth());
      setIsLoading(false);
    } catch (error) {
      console.error('Failed to load monitoring data:', error);
      setIsLoading(false);
    }
  };

  const getMockAgentStatuses = (): AgentStatus[] => [
    {
      agent_id: 'agent_1',
      agent_name: 'Customer Service Agent',
      status: 'running',
      tasks_completed: 147,
      tasks_pending: 3,
      avg_execution_time_ms: 1200,
      last_activity: new Date(Date.now() - 30000).toISOString(),
      error_count: 2
    },
    {
      agent_id: 'agent_2',
      agent_name: 'Sales Agent',
      status: 'idle',
      tasks_completed: 89,
      tasks_pending: 0,
      avg_execution_time_ms: 2100,
      last_activity: new Date(Date.now() - 120000).toISOString(),
      error_count: 0
    },
    {
      agent_id: 'agent_3',
      agent_name: 'Analytics Agent',
      status: 'running',
      tasks_completed: 234,
      tasks_pending: 7,
      avg_execution_time_ms: 3500,
      last_activity: new Date(Date.now() - 5000).toISOString(),
      error_count: 1
    }
  ];

  const getMockExecutionMetrics = (): ExecutionMetric[] => {
    const now = Date.now();
    return Array.from({ length: 12 }, (_, i) => ({
      timestamp: new Date(now - (11 - i) * 300000).toLocaleTimeString(),
      total_executions: Math.floor(Math.random() * 50) + 20,
      successful: Math.floor(Math.random() * 45) + 18,
      failed: Math.floor(Math.random() * 5),
      avg_duration_ms: Math.floor(Math.random() * 2000) + 1000
    }));
  };

  const getMockSystemHealth = (): SystemHealth => ({
    cpu_usage: Math.random() * 60 + 20,
    memory_usage: Math.random() * 50 + 30,
    active_agents: 3,
    total_agents: 5,
    message_queue_size: Math.floor(Math.random() * 20)
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'running': return 'text-green-500 bg-green-500/10';
      case 'idle': return 'text-yellow-500 bg-yellow-500/10';
      case 'error': return 'text-red-500 bg-red-500/10';
      default: return 'text-gray-500 bg-gray-500/10';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'running': return <Activity className="w-4 h-4" />;
      case 'idle': return <Clock className="w-4 h-4" />;
      case 'error': return <AlertCircle className="w-4 h-4" />;
      default: return <CheckCircle className="w-4 h-4" />;
    }
  };

  if (isLoading) {
    return (
      <div className="p-6 flex items-center justify-center min-h-screen">
        <div className="text-muted-foreground">Loading monitoring data...</div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold">Monitoring Dashboard</h1>
        <p className="text-muted-foreground mt-2">
          Real-time monitoring of multi-agent system performance
        </p>
      </div>

      {/* System Health KPIs */}
      {systemHealth && (
        <div className="grid grid-cols-4 gap-4">
          <Card className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">CPU Usage</p>
                <p className="text-2xl font-bold">{systemHealth.cpu_usage.toFixed(1)}%</p>
              </div>
              <Zap className="w-8 h-8 text-blue-500" />
            </div>
          </Card>

          <Card className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Memory Usage</p>
                <p className="text-2xl font-bold">{systemHealth.memory_usage.toFixed(1)}%</p>
              </div>
              <Activity className="w-8 h-8 text-green-500" />
            </div>
          </Card>

          <Card className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Active Agents</p>
                <p className="text-2xl font-bold">{systemHealth.active_agents}/{systemHealth.total_agents}</p>
              </div>
              <CheckCircle className="w-8 h-8 text-purple-500" />
            </div>
          </Card>

          <Card className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Queue Size</p>
                <p className="text-2xl font-bold">{systemHealth.message_queue_size}</p>
              </div>
              <Clock className="w-8 h-8 text-orange-500" />
            </div>
          </Card>
        </div>
      )}

      {/* Execution Metrics Chart */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">Execution Metrics (Last Hour)</h3>
        <ResponsiveContainer width="100%" height={300}>
          <AreaChart data={executionMetrics}>
            <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
            <XAxis dataKey="timestamp" className="text-xs" />
            <YAxis className="text-xs" />
            <Tooltip
              contentStyle={{
                backgroundColor: 'hsl(var(--background))',
                border: '1px solid hsl(var(--border))',
                borderRadius: '8px'
              }}
            />
            <Area
              type="monotone"
              dataKey="successful"
              stackId="1"
              stroke="hsl(var(--chart-2))"
              fill="hsl(var(--chart-2))"
              name="Successful"
            />
            <Area
              type="monotone"
              dataKey="failed"
              stackId="1"
              stroke="hsl(var(--chart-1))"
              fill="hsl(var(--chart-1))"
              name="Failed"
            />
          </AreaChart>
        </ResponsiveContainer>
      </Card>

      {/* Agent Status Table */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">Agent Status</h3>
        <div className="space-y-3">
          {agentStatuses.map((agent) => (
            <div key={agent.agent_id} className="border rounded-lg p-4">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-lg ${getStatusColor(agent.status)}`}>
                    {getStatusIcon(agent.status)}
                  </div>
                  <div>
                    <div className="font-medium">{agent.agent_name}</div>
                    <div className="text-sm text-muted-foreground">
                      Last active: {new Date(agent.last_activity).toLocaleTimeString()}
                    </div>
                  </div>
                </div>
                <div className={`px-3 py-1 rounded-full text-sm ${getStatusColor(agent.status)}`}>
                  {agent.status}
                </div>
              </div>

              <div className="grid grid-cols-4 gap-4 text-sm">
                <div>
                  <div className="text-muted-foreground">Completed</div>
                  <div className="font-medium">{agent.tasks_completed}</div>
                </div>
                <div>
                  <div className="text-muted-foreground">Pending</div>
                  <div className="font-medium">{agent.tasks_pending}</div>
                </div>
                <div>
                  <div className="text-muted-foreground">Avg Time</div>
                  <div className="font-medium">{agent.avg_execution_time_ms}ms</div>
                </div>
                <div>
                  <div className="text-muted-foreground">Errors</div>
                  <div className="font-medium text-red-500">{agent.error_count}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* Performance Distribution */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">Average Execution Time by Agent</h3>
        <ResponsiveContainer width="100%" height={250}>
          <BarChart data={agentStatuses}>
            <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
            <XAxis dataKey="agent_name" className="text-xs" />
            <YAxis className="text-xs" label={{ value: 'ms', angle: -90, position: 'insideLeft' }} />
            <Tooltip
              contentStyle={{
                backgroundColor: 'hsl(var(--background))',
                border: '1px solid hsl(var(--border))',
                borderRadius: '8px'
              }}
            />
            <Bar dataKey="avg_execution_time_ms" fill="hsl(var(--chart-3))" name="Avg Execution Time (ms)" />
          </BarChart>
        </ResponsiveContainer>
      </Card>
    </div>
  );
}
