import { useState, useEffect } from "react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import {
  Search,
  Filter,
  Star,
  Download,
  Bot,
  Loader2,
  CheckCircle2,
  ExternalLink,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { brikkColors } from "@/lib/palette";
import {
  getMarketplaceAgents,
  installMarketplaceAgent,
} from "@/lib/api";
import type { MarketplaceAgent } from "@/types/api";
import { toast } from "sonner";

export default function Marketplace() {
  const [agents, setAgents] = useState<MarketplaceAgent[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [installingIds, setInstallingIds] = useState<Set<string>>(new Set());

  useEffect(() => {
    loadMarketplace();
  }, [categoryFilter]);

  async function loadMarketplace() {
    setLoading(true);
    try {
      const response = await getMarketplaceAgents({
        limit: 50,
      });
      setAgents(response.data);
    } catch (err) {
      console.error("Failed to load marketplace:", err);
      toast.error("Failed to load marketplace");
    } finally {
      setLoading(false);
    }
  }

  async function handleInstall(agentId: string) {
    setInstallingIds((prev) => new Set(prev).add(agentId));
    try {
      await installMarketplaceAgent(agentId);
      toast.success("Agent installed successfully!");
      loadMarketplace(); // Refresh to update installation status
    } catch (err) {
      console.error("Failed to install agent:", err);
      toast.error("Failed to install agent");
    } finally {
      setInstallingIds((prev) => {
        const next = new Set(prev);
        next.delete(agentId);
        return next;
      });
    }
  }

  const filteredAgents = agents.filter((agent) =>
    agent.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    agent.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const categories = ["all", "productivity", "data", "communication", "automation", "analytics"];

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Agent Marketplace</h1>
            <p className="text-muted-foreground mt-1">
              Discover, install, and manage pre-built AI agents
            </p>
          </div>
          <Button className="btn-primary" onClick={loadMarketplace}>
            <Download className="h-4 w-4" />
            Refresh
          </Button>
        </div>

        {/* Stats */}
        <div className="grid gap-4 md:grid-cols-3">
          <div className="brikk-card">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-muted-foreground">Available Agents</span>
              <Bot className="h-5 w-5" style={{ color: brikkColors.blue }} />
            </div>
            {loading ? (
              <div className="flex items-center gap-2">
                <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
              </div>
            ) : (
              <>
                <div className="text-2xl font-bold gradient-text">{agents.length}</div>
                <div className="text-xs text-muted-foreground mt-1">
                  Ready to install
                </div>
              </>
            )}
          </div>
          <div className="brikk-card">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-muted-foreground">Installed</span>
              <CheckCircle2 className="h-5 w-5" style={{ color: brikkColors.lime }} />
            </div>
            {loading ? (
              <div className="flex items-center gap-2">
                <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
              </div>
            ) : (
              <>
                <div className="text-2xl font-bold gradient-text">
                  {agents.length}
                </div>
                <div className="text-xs text-muted-foreground mt-1">
                  Available agents
                </div>
              </>
            )}
          </div>
          <div className="brikk-card">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-muted-foreground">Avg Rating</span>
              <Star className="h-5 w-5" style={{ color: brikkColors.violet }} />
            </div>
            {loading ? (
              <div className="flex items-center gap-2">
                <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
              </div>
            ) : (
              <>
                <div className="text-2xl font-bold gradient-text">
                  {agents.length > 0
                    ? (
                        agents.reduce((sum, a) => sum + a.rating, 0) / agents.length
                      ).toFixed(1)
                    : "0.0"}
                </div>
                <div className="text-xs text-muted-foreground mt-1">
                  Out of 5.0 stars
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
                Category: {categoryFilter}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              {categories.map((cat) => (
                <DropdownMenuItem key={cat} onClick={() => setCategoryFilter(cat)}>
                  {cat.charAt(0).toUpperCase() + cat.slice(1)}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {/* Agent Grid */}
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          </div>
        ) : filteredAgents.length === 0 ? (
          <div className="flex items-center justify-center py-12 border-2 border-dashed rounded-lg brikk-card">
            <div className="text-center">
              <Bot className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
              <p className="text-sm text-muted-foreground">
                {searchQuery
                  ? "No agents match your search"
                  : "No agents available in this category"}
              </p>
            </div>
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {filteredAgents.map((agent) => (
              <div key={agent.id} className="brikk-card flex flex-col">
                {/* Agent Header */}
                <div className="flex items-start justify-between mb-3">
                  <div
                    className="flex h-12 w-12 items-center justify-center rounded-lg flex-shrink-0"
                    style={{ backgroundColor: `${brikkColors.blue}20` }}
                  >
                    <Bot className="h-6 w-6" style={{ color: brikkColors.blue }} />
                  </div>
                  <div className="flex items-center gap-1">
                    <Star
                      className="h-4 w-4 fill-current"
                      style={{ color: brikkColors.violet }}
                    />
                    <span className="text-sm font-medium">{agent.rating.toFixed(1)}</span>
                  </div>
                </div>

                {/* Agent Info */}
                <div className="flex-1 mb-4">
                  <h3 className="font-semibold text-lg mb-1">{agent.name}</h3>
                  <p className="text-sm text-muted-foreground mb-3">
                    {agent.description}
                  </p>

                  {/* Tags */}
                  <div className="flex flex-wrap gap-2 mb-3">
                    {agent.tags.map((tag: string) => (
                      <span
                        key={tag}
                        className="px-2 py-1 rounded-full text-xs font-medium"
                        style={{
                          backgroundColor: `${brikkColors.cyan}20`,
                          color: brikkColors.cyan,
                        }}
                      >
                        {tag}
                      </span>
                    ))}
                  </div>

                  {/* Stats */}
                  <div className="flex items-center gap-4 text-xs text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <Download className="h-3 w-3" />
                      <span>{agent.installs.toLocaleString()} installs</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <span className="text-xs text-muted-foreground">{agent.category}</span>
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2">
                  {installingIds.has(agent.id) ? (
                    <Button
                      variant="outline"
                      className="flex-1"
                      disabled
                    >
                      <CheckCircle2 className="h-4 w-4 mr-2" style={{ color: brikkColors.lime }} />
                      Installed
                    </Button>
                  ) : (
                    <Button
                      className="btn-primary flex-1"
                      onClick={() => handleInstall(agent.id)}
                      disabled={installingIds.has(agent.id)}
                    >
                      {installingIds.has(agent.id) ? (
                        <>
                          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                          Installing...
                        </>
                      ) : (
                        <>
                          <Download className="h-4 w-4 mr-2" />
                          Install
                        </>
                      )}
                    </Button>
                  )}
                  <Button variant="outline" size="icon">
                    <ExternalLink className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* API Integration Status */}
        <div className="brikk-card border-2 border-dashed">
          <div className="flex items-start gap-4">
            <div
              className="flex h-10 w-10 items-center justify-center rounded-lg flex-shrink-0"
              style={{ backgroundColor: `${brikkColors.blue}20` }}
            >
              <Bot className="h-5 w-5" style={{ color: brikkColors.blue }} />
            </div>
            <div className="flex-1">
              <h4 className="font-semibold mb-2">Marketplace Module Active</h4>
              <p className="text-sm text-muted-foreground mb-3">
                Agent marketplace is connected to the Railway backend. Browse, search, and
                install pre-built agents with one click. All installations are tracked and
                managed through the API.
              </p>
              <div className="text-sm space-y-1">
                <p className="font-medium">🛍️ Active Endpoints:</p>
                <ul className="list-disc list-inside text-muted-foreground ml-2 space-y-1">
                  <li>/v1/marketplace/agents - Browse available agents</li>
                  <li>/v1/marketplace/agents/:id:install - Install agent</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}

