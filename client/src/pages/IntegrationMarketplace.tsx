import { useState, useEffect } from "react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import {
  Search,
  Filter,
  Star,
  Download,
  Plug,
  Loader2,
  CheckCircle2,
  ExternalLink,
  TrendingUp,
  Shield,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { toast } from "sonner";

// API base URL - should be configured via environment variable
const API_BASE_URL = import.meta.env.VITE_UCS_API_URL || "https://8000-izm86p4nsuk8lkf8pus89-fe6db43a.manusvm.computer";

interface Integration {
  id: string;
  name: string;
  version: string;
  category: string;
  description: string;
  icon: string;
  base_url: string;
  status: string;
  health_status: string;
  install_count: number;
  rating: number;
  rating_count: number;
  tags: string[];
  created_by_user_id: string;
  created_at: string;
  updated_at: string;
  last_health_check?: string;
  metadata?: {
    is_installed?: boolean;
  };
}

interface Category {
  name: string;
  count: number;
}

export default function IntegrationMarketplace() {
  const [integrations, setIntegrations] = useState<Integration[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [installingIds, setInstallingIds] = useState<Set<string>>(new Set());

  useEffect(() => {
    loadMarketplace();
    loadCategories();
  }, [categoryFilter, searchQuery]);

  async function loadMarketplace() {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (categoryFilter !== "all") {
        params.append("category", categoryFilter);
      }
      if (searchQuery) {
        params.append("search", searchQuery);
      }
      params.append("status", "published");

      const response = await fetch(`${API_BASE_URL}/api/v1/integrations?${params}`);
      if (!response.ok) {
        throw new Error("Failed to load integrations");
      }
      const data = await response.json();
      setIntegrations(data);
    } catch (err) {
      console.error("Failed to load marketplace:", err);
      toast.error("Failed to load marketplace");
    } finally {
      setLoading(false);
    }
  }

  async function loadCategories() {
    try {
      const response = await fetch(`${API_BASE_URL}/api/v1/integrations/categories`);
      if (!response.ok) {
        throw new Error("Failed to load categories");
      }
      const data = await response.json();
      setCategories(data);
    } catch (err) {
      console.error("Failed to load categories:", err);
    }
  }

  async function handleInstall(integrationId: string) {
    setInstallingIds((prev) => new Set(prev).add(integrationId));
    try {
      const response = await fetch(
        `${API_BASE_URL}/api/v1/integrations/${integrationId}/install`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Failed to install integration");
      }

      toast.success("Integration installed successfully");
      loadMarketplace(); // Reload to update install status
    } catch (err: any) {
      console.error("Failed to install:", err);
      toast.error(err.message || "Failed to install integration");
    } finally {
      setInstallingIds((prev) => {
        const next = new Set(prev);
        next.delete(integrationId);
        return next;
      });
    }
  }

  async function handleUninstall(integrationId: string) {
    setInstallingIds((prev) => new Set(prev).add(integrationId));
    try {
      const response = await fetch(
        `${API_BASE_URL}/api/v1/integrations/${integrationId}/install`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Failed to uninstall integration");
      }

      toast.success("Integration uninstalled successfully");
      loadMarketplace(); // Reload to update install status
    } catch (err: any) {
      console.error("Failed to uninstall:", err);
      toast.error(err.message || "Failed to uninstall integration");
    } finally {
      setInstallingIds((prev) => {
        const next = new Set(prev);
        next.delete(integrationId);
        return next;
      });
    }
  }

  const totalInstalls = integrations.reduce((sum, i) => sum + i.install_count, 0);
  const avgRating =
    integrations.length > 0
      ? integrations.reduce((sum, i) => sum + i.rating, 0) / integrations.length
      : 0;

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold mb-2">Integration Marketplace</h1>
          <p className="text-muted-foreground">
            Browse and install integrations to connect your agents with external systems
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-500/10 rounded-lg">
                <Plug className="h-5 w-5 text-blue-500" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Available Integrations</p>
                <p className="text-2xl font-bold">{integrations.length}</p>
              </div>
            </div>
          </Card>

          <Card className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-500/10 rounded-lg">
                <TrendingUp className="h-5 w-5 text-green-500" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total Installs</p>
                <p className="text-2xl font-bold">{totalInstalls.toLocaleString()}</p>
              </div>
            </div>
          </Card>

          <Card className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-yellow-500/10 rounded-lg">
                <Star className="h-5 w-5 text-yellow-500" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Average Rating</p>
                <p className="text-2xl font-bold">{avgRating.toFixed(1)}</p>
              </div>
            </div>
          </Card>
        </div>

        {/* Search and Filters */}
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search integrations..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="gap-2">
                <Filter className="h-4 w-4" />
                {categoryFilter === "all" ? "All Categories" : categoryFilter}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => setCategoryFilter("all")}>
                All Categories
              </DropdownMenuItem>
              {categories.map((category) => (
                <DropdownMenuItem
                  key={category.name}
                  onClick={() => setCategoryFilter(category.name)}
                >
                  {category.name} ({category.count})
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {/* Integration Grid */}
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          </div>
        ) : integrations.length === 0 ? (
          <Card className="p-12 text-center">
            <Plug className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
            <h3 className="text-lg font-semibold mb-2">No integrations found</h3>
            <p className="text-muted-foreground">
              Try adjusting your search or filters
            </p>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {integrations.map((integration) => (
              <Card key={integration.id} className="p-6 hover:shadow-lg transition-shadow">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="text-4xl">{integration.icon}</div>
                    <div>
                      <h3 className="font-semibold text-lg">{integration.name}</h3>
                      <p className="text-sm text-muted-foreground">
                        v{integration.version}
                      </p>
                    </div>
                  </div>
                  <Badge
                    variant={
                      integration.health_status === "healthy"
                        ? "default"
                        : integration.health_status === "degraded"
                        ? "secondary"
                        : "destructive"
                    }
                  >
                    {integration.health_status}
                  </Badge>
                </div>

                <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                  {integration.description}
                </p>

                <div className="flex items-center gap-4 mb-4 text-sm text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <Star className="h-4 w-4 fill-yellow-500 text-yellow-500" />
                    <span>
                      {integration.rating.toFixed(1)} ({integration.rating_count})
                    </span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Download className="h-4 w-4" />
                    <span>{integration.install_count.toLocaleString()}</span>
                  </div>
                </div>

                <div className="flex flex-wrap gap-2 mb-4">
                  <Badge variant="outline">{integration.category}</Badge>
                  {integration.tags.slice(0, 2).map((tag) => (
                    <Badge key={tag} variant="secondary">
                      {tag}
                    </Badge>
                  ))}
                </div>

                <div className="flex gap-2">
                  {integration.metadata?.is_installed ? (
                    <>
                      <Button
                        variant="outline"
                        size="sm"
                        className="flex-1"
                        disabled={installingIds.has(integration.id)}
                        onClick={() => handleUninstall(integration.id)}
                      >
                        {installingIds.has(integration.id) ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                          <>
                            <CheckCircle2 className="h-4 w-4 mr-2" />
                            Uninstall
                          </>
                        )}
                      </Button>
                      <Button variant="outline" size="sm">
                        Configure
                      </Button>
                    </>
                  ) : (
                    <Button
                      size="sm"
                      className="flex-1"
                      disabled={installingIds.has(integration.id)}
                      onClick={() => handleInstall(integration.id)}
                    >
                      {installingIds.has(integration.id) ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <>
                          <Download className="h-4 w-4 mr-2" />
                          Install
                        </>
                      )}
                    </Button>
                  )}
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
