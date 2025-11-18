import { useState, useEffect } from "react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import {
  Bot,
  Search,
  Filter,
  Plus,
  Activity,
  Clock,
  AlertCircle,
  TrendingUp,
  Loader2,
  Pause,
  Play,
  MoreVertical,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Link } from "wouter";
import { brikkColors } from "@/lib/palette";
import { useApi } from "@/hooks/useApi";
import type { Agent } from "@/types/api";
import { toast } from "sonner";

export default function Agents() {
  const api = useApi();
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [agents, setAgents] = useState<Agent[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadAgents();
  }, [statusFilter]);

  async function loadAgents() {
    setLoading(true);
    setError(null);
    try {
      const response = await api.getAgents({
        status: statusFilter === "all" ? undefined : (statusFilter as "active" | "disabled"),
        limit: 50,
      });
      setAgents(response.data);
    } catch (err) {
      console.error("Failed to load agents:", err);
      setError("Failed to load agents");
      toast.error("Failed to load agents");
    } finally {
      setLoading(false);
    }
  }

  async function handlePauseAgent(agentId: string) {
    try {
      await api.pauseAgent(agentId);
      toast.success("Agent paused successfully");
      loadAgents();
    } catch (err) {
      console.error("Failed to pause agent:", err);
      toast.error("Failed to pause agent");
    }
  }

  async function handleResumeAgent(agentId: string) {
    try {
      await api.resumeAgent(agentId);
      toast.success("Agent resumed successfully");
      loadAgents();
    } catch (err) {
      console.error("Failed to resume agent:", err);
      toast.error("Failed to resume agent");
    }
  }

  const filteredAgents = agents.filter((agent) =>
    agent.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const totalAgents = agents.length;
  const activeAgents = agents.filter((a) => a.status === "active").length;
  const avgThroughput =
    agents.length > 0
      ? (agents.reduce((sum, a) => sum + a.throughput_1h, 0) / agents.length).toFixed(0)
      : "0";
  const avgSuccessRate =
    agents.length > 0
      ? (
          (agents.reduce((sum, a) => sum + a.success_rate_24h, 0) / agents.length) *
          100
        ).toFixed(1)
      : "0.0";

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Agent Management</h1>
            <p className="text-muted-foreground mt-1">
              Monitor and manage your AI agent registry
            </p>
          </div>
          <Button className="btn-primary" onClick={loadAgents}>
            <Plus className="h-4 w-4" />
            Refresh
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid gap-4 md:grid-cols-4">
          <div className="brikk-card">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-muted-foreground">Total Agents</span>
              <Bot className="h-5 w-5" style={{ color: brikkColors.blue }} />
            </div>
            {loading ? (
              <div className="flex items-center gap-2">
                <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
                <span className="text-sm text-muted-foreground">Loading...</span>
              </div>
            ) : (
              <>
                <div className="text-2xl font-bold gradient-text">{totalAgents}</div>
                <div className="text-xs text-muted-foreground mt-1">
                  Registered agents
                </div>
              </>
            )}
          </div>
          <div className="brikk-card">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-muted-foreground">Active Now</span>
              <Activity className="h-5 w-5" style={{ color: brikkColors.lime }} />
            </div>
            {loading ? (
              <div className="flex items-center gap-2">
                <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
                <span className="text-sm text-muted-foreground">Loading...</span>
              </div>
            ) : (
              <>
                <div className="text-2xl font-bold gradient-text">{activeAgents}</div>
                <div className="text-xs text-muted-foreground mt-1">
                  {((activeAgents / totalAgents) * 100).toFixed(0)}% of total
                </div>
              </>
            )}
          </div>
          <div className="brikk-card">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-muted-foreground">Avg Throughput</span>
              <Clock className="h-5 w-5" style={{ color: brikkColors.cyan }} />
            </div>
            {loading ? (
              <div className="flex items-center gap-2">
                <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
                <span className="text-sm text-muted-foreground">Loading...</span>
              </div>
            ) : (
              <>
                <div className="text-2xl font-bold gradient-text">{avgThroughput}</div>
                <div className="text-xs text-muted-foreground mt-1">
                  Requests/hour
                </div>
              </>
            )}
          </div>
          <div className="brikk-card">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-muted-foreground">Success Rate</span>
              <TrendingUp className="h-5 w-5" style={{ color: brikkColors.violet }} />
            </div>
            {loading ? (
              <div className="flex items-center gap-2">
                <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
                <span className="text-sm text-muted-foreground">Loading...</span>
              </div>
            ) : (
              <>
                <div className="text-2xl font-bold gradient-text">{avgSuccessRate}%</div>
                <div className="text-xs text-muted-foreground mt-1">
                  Last 24 hours
                </div>
              </>
            )}
          </div>
        </div>

        {/* Filters */}
        <div className="flex items-center gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search agents..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline">
                <Filter className="h-4 w-4 mr-2" />
                Status: {statusFilter}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem onClick={() => setStatusFilter("all")}>
                All
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setStatusFilter("active")}>
                Active
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setStatusFilter("paused")}>
                Paused
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setStatusFilter("error")}>
                Error
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          <Button variant="outline" asChild>
            <Link href="/agents/map">
              <Activity className="h-4 w-4 mr-2" />
              Network Map
            </Link>
          </Button>
        </div>

        {/* Agents Table */}
        <div className="brikk-card">
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
          ) : error ? (
            <div className="flex items-center justify-center py-12 border-2 border-dashed rounded-lg">
              <div className="text-center">
                <AlertCircle className="h-8 w-8 mx-auto mb-2 text-[#FF6B6B]" />
                <p className="text-sm text-muted-foreground">{error}</p>
                <Button variant="outline" size="sm" className="mt-3" onClick={loadAgents}>
                  Retry
                </Button>
              </div>
            </div>
          ) : filteredAgents.length === 0 ? (
            <div className="flex items-center justify-center py-12 border-2 border-dashed rounded-lg">
              <div className="text-center">
                <Bot className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
                <p className="text-sm text-muted-foreground">
                  {searchQuery ? "No agents match your search" : "No agents registered yet"}
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  {searchQuery
                    ? "Try adjusting your search query"
                    : "Register your first agent to get started"}
                </p>
              </div>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">
                      Agent
                    </th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">
                      Status
                    </th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">
                      Throughput (1h)
                    </th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">
                      Success Rate (24h)
                    </th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">
                      Owner
                    </th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">
                      Last Seen
                    </th>
                    <th className="text-right py-3 px-4 text-sm font-medium text-muted-foreground">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {filteredAgents.map((agent) => (
                    <tr key={agent.id} className="border-b border-border hover:bg-accent/50">
                      <td className="py-3 px-4">
                        <div>
                          <div className="font-medium">{agent.name}</div>
                          <div className="text-xs text-muted-foreground">
                            {agent.tags.join(", ")}
                          </div>
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <span
                          className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${
                            agent.status === "active"
                              ? "bg-[#A3FF12]/20 text-[#A3FF12]"
                              : agent.status === "paused"
                              ? "bg-[#6B7280]/20 text-[#6B7280]"
                              : "bg-[#FF6B6B]/20 text-[#FF6B6B]"
                          }`}
                        >
                          <span className="status-dot" />
                          {agent.status}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <div className="font-medium">{agent.throughput_1h}</div>
                        <div className="text-xs text-muted-foreground">requests</div>
                      </td>
                      <td className="py-3 px-4">
                        <div className="font-medium">
                          {(agent.success_rate_24h * 100).toFixed(1)}%
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <div className="text-sm">{agent.owner}</div>
                      </td>
                      <td className="py-3 px-4">
                        <div className="text-sm text-muted-foreground">
                          {new Date(agent.last_seen).toLocaleString()}
                        </div>
                      </td>
                      <td className="py-3 px-4 text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-8 w-8">
                              <MoreVertical className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            {agent.status === "active" ? (
                              <DropdownMenuItem onClick={() => handlePauseAgent(agent.id)}>
                                <Pause className="h-4 w-4 mr-2" />
                                Pause
                              </DropdownMenuItem>
                            ) : (
                              <DropdownMenuItem onClick={() => handleResumeAgent(agent.id)}>
                                <Play className="h-4 w-4 mr-2" />
                                Resume
                              </DropdownMenuItem>
                            )}
                            <DropdownMenuItem>
                              <Activity className="h-4 w-4 mr-2" />
                              View Metrics
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}

