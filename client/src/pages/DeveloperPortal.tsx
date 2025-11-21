import { useState, useEffect } from "react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import {
  Search,
  Filter,
  Star,
  Download,
  Activity,
  AlertCircle,
  CheckCircle2,
  Edit,
  Trash2,
  Eye,
  EyeOff,
  FileDown,
  TrendingUp,
  Users,
  Zap,
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
import { useLocation } from "wouter";

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
}

export default function DeveloperPortal() {
  const [, setLocation] = useLocation();
  const [integrations, setIntegrations] = useState<Integration[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [healthFilter, setHealthFilter] = useState("all");

  useEffect(() => {
    loadMyIntegrations();
  }, [statusFilter, healthFilter, searchQuery]);

  async function loadMyIntegrations() {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      params.append("created_by", "demo-user");
      if (statusFilter !== "all") {
        params.append("status", statusFilter);
      }
      if (searchQuery) {
        params.append("search", searchQuery);
      }

      const response = await fetch(`${API_BASE_URL}/api/v1/integrations?${params}`);
      if (!response.ok) {
        throw new Error("Failed to load integrations");
      }
      const data = await response.json();
      
      let filtered = data;
      if (healthFilter !== "all") {
        filtered = data.filter((i: Integration) => i.health_status === healthFilter);
      }
      
      setIntegrations(filtered);
    } catch (err) {
      console.error("Failed to load integrations:", err);
      toast.error("Failed to load your integrations");
    } finally {
      setLoading(false);
    }
  }

  async function handlePublish(integrationId: string) {
    try {
      const response = await fetch(
        `${API_BASE_URL}/api/v1/integrations/${integrationId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ status: "published" }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to publish integration");
      }

      toast.success("Integration published successfully");
      loadMyIntegrations();
    } catch (err: any) {
      console.error("Failed to publish:", err);
      toast.error(err.message || "Failed to publish integration");
    }
  }

  async function handleUnpublish(integrationId: string) {
    try {
      const response = await fetch(
        `${API_BASE_URL}/api/v1/integrations/${integrationId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ status: "draft" }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to unpublish integration");
      }

      toast.success("Integration unpublished successfully");
      loadMyIntegrations();
    } catch (err: any) {
      console.error("Failed to unpublish:", err);
      toast.error(err.message || "Failed to unpublish integration");
    }
  }

  async function handleDelete(integrationId: string) {
    if (!confirm("Are you sure you want to delete this integration?")) {
      return;
    }

    try {
      const response = await fetch(
        `${API_BASE_URL}/api/v1/integrations/${integrationId}`,
        {
          method: "DELETE",
        }
      );

      if (!response.ok) {
        throw new Error("Failed to delete integration");
      }

      toast.success("Integration deleted successfully");
      loadMyIntegrations();
    } catch (err: any) {
      console.error("Failed to delete:", err);
      toast.error(err.message || "Failed to delete integration");
    }
  }

  async function handleExport(integrationId: string) {
    try {
      const response = await fetch(
        `${API_BASE_URL}/api/v1/integrations/${integrationId}`
      );

      if (!response.ok) {
        throw new Error("Failed to export integration");
      }

      const integration = await response.json();
      const blob = new Blob([JSON.stringify(integration, null, 2)], {
        type: "application/json",
      });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${integration.id}.json`;
      a.click();
      URL.revokeObjectURL(url);

      toast.success("Integration exported successfully");
    } catch (err: any) {
      console.error("Failed to export:", err);
      toast.error(err.message || "Failed to export integration");
    }
  }

  const totalIntegrations = integrations.length;
  const publishedCount = integrations.filter((i) => i.status === "published").length;
  const totalInstalls = integrations.reduce((sum, i) => sum + i.install_count, 0);
  const avgRating =
    integrations.length > 0
      ? integrations.reduce((sum, i) => sum + i.rating, 0) / integrations.length
      : 0;

  const healthyCounts = {
    healthy: integrations.filter((i) => i.health_status === "healthy").length,
    degraded: integrations.filter((i) => i.health_status === "degraded").length,
    failed: integrations.filter((i) => i.health_status === "failed").length,
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2">Developer Portal</h1>
            <p className="text-muted-foreground">
              Manage your published integrations and monitor their health
            </p>
          </div>
          <Button onClick={() => setLocation("/integrations/builder")}>
            Create New Integration
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-500/10 rounded-lg">
                <Zap className="h-5 w-5 text-blue-500" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total Integrations</p>
                <p className="text-2xl font-bold">{totalIntegrations}</p>
              </div>
            </div>
          </Card>

          <Card className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-500/10 rounded-lg">
                <Eye className="h-5 w-5 text-green-500" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Published</p>
                <p className="text-2xl font-bold">{publishedCount}</p>
              </div>
            </div>
          </Card>

          <Card className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-purple-500/10 rounded-lg">
                <TrendingUp className="h-5 w-5 text-purple-500" />
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
                <p className="text-sm text-muted-foreground">Avg Rating</p>
                <p className="text-2xl font-bold">{avgRating.toFixed(1)}</p>
              </div>
            </div>
          </Card>
        </div>

        <Card className="p-6">
          <h2 className="text-lg font-semibold mb-4">Health Status</h2>
          <div className="grid grid-cols-3 gap-4">
            <div className="flex items-center gap-3">
              <CheckCircle2 className="h-5 w-5 text-green-500" />
              <div>
                <p className="text-sm text-muted-foreground">Healthy</p>
                <p className="text-xl font-bold">{healthyCounts.healthy}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Activity className="h-5 w-5 text-yellow-500" />
              <div>
                <p className="text-sm text-muted-foreground">Degraded</p>
                <p className="text-xl font-bold">{healthyCounts.degraded}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <AlertCircle className="h-5 w-5 text-red-500" />
              <div>
                <p className="text-sm text-muted-foreground">Failed</p>
                <p className="text-xl font-bold">{healthyCounts.failed}</p>
              </div>
            </div>
          </div>
        </Card>

        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search your integrations..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="gap-2">
                <Filter className="h-4 w-4" />
                Status: {statusFilter === "all" ? "All" : statusFilter}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => setStatusFilter("all")}>
                All
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setStatusFilter("published")}>
                Published
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setStatusFilter("draft")}>
                Draft
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setStatusFilter("deprecated")}>
                Deprecated
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="gap-2">
                <Activity className="h-4 w-4" />
                Health: {healthFilter === "all" ? "All" : healthFilter}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => setHealthFilter("all")}>
                All
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setHealthFilter("healthy")}>
                Healthy
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setHealthFilter("degraded")}>
                Degraded
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setHealthFilter("failed")}>
                Failed
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full" />
          </div>
        ) : integrations.length === 0 ? (
          <Card className="p-12 text-center">
            <Zap className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
            <h3 className="text-lg font-semibold mb-2">No integrations yet</h3>
            <p className="text-muted-foreground mb-4">
              Create your first integration to get started
            </p>
            <Button onClick={() => setLocation("/integrations/builder")}>
              Create Integration
            </Button>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {integrations.map((integration) => (
              <Card key={integration.id} className="p-6">
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
                  <div className="flex flex-col gap-2">
                    <Badge
                      variant={
                        integration.status === "published"
                          ? "default"
                          : integration.status === "draft"
                          ? "secondary"
                          : "outline"
                      }
                    >
                      {integration.status}
                    </Badge>
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

                {integration.last_health_check && (
                  <p className="text-xs text-muted-foreground mb-4">
                    Last checked: {new Date(integration.last_health_check).toLocaleString()}
                  </p>
                )}

                <div className="flex gap-2">
                  <Button variant="outline" size="sm" onClick={() => handleExport(integration.id)}>
                    <FileDown className="h-4 w-4" />
                  </Button>
                  {integration.status === "published" ? (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleUnpublish(integration.id)}
                    >
                      <EyeOff className="h-4 w-4 mr-2" />
                      Unpublish
                    </Button>
                  ) : (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handlePublish(integration.id)}
                    >
                      <Eye className="h-4 w-4 mr-2" />
                      Publish
                    </Button>
                  )}
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleDelete(integration.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
