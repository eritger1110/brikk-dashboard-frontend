import { useState } from "react";
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

export default function Agents() {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");

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
          <Button className="btn-primary">
            <Plus className="h-4 w-4" />
            Register Agent
          </Button>
        </div>

        {/* Stats Cards - Awaiting Real Data */}
        <div className="grid gap-4 md:grid-cols-4">
          <div className="brikk-card">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-muted-foreground">Total Agents</span>
              <Bot className="h-5 w-5" style={{ color: brikkColors.blue }} />
            </div>
            <div className="flex items-center gap-2">
              <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
              <span className="text-sm text-muted-foreground">Loading...</span>
            </div>
          </div>
          <div className="brikk-card">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-muted-foreground">Active Now</span>
              <Activity className="h-5 w-5" style={{ color: brikkColors.lime }} />
            </div>
            <div className="flex items-center gap-2">
              <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
              <span className="text-sm text-muted-foreground">Loading...</span>
            </div>
          </div>
          <div className="brikk-card">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-muted-foreground">Avg Latency</span>
              <Clock className="h-5 w-5" style={{ color: brikkColors.cyan }} />
            </div>
            <div className="flex items-center gap-2">
              <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
              <span className="text-sm text-muted-foreground">Loading...</span>
            </div>
          </div>
          <div className="brikk-card">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-muted-foreground">Alerts</span>
              <AlertCircle className="h-5 w-5" style={{ color: brikkColors.coral }} />
            </div>
            <div className="flex items-center gap-2">
              <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
              <span className="text-sm text-muted-foreground">Loading...</span>
            </div>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="brikk-card">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div className="flex-1 max-w-md">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Search agents by name or framework..."
                  className="pl-9"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  disabled
                />
              </div>
            </div>
            <div className="flex items-center gap-2">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="sm" disabled>
                    <Filter className="h-4 w-4 mr-2" />
                    Status: {statusFilter === "all" ? "All" : statusFilter}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={() => setStatusFilter("all")}>
                    All Agents
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setStatusFilter("active")}>
                    Active
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setStatusFilter("idle")}>
                    Idle
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setStatusFilter("error")}>
                    Error
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
              <Link href="/agents/map">
                <Button variant="outline" size="sm">
                  <TrendingUp className="h-4 w-4 mr-2" />
                  Network Map
                </Button>
              </Link>
            </div>
          </div>
        </div>

        {/* Empty State - No Agents Yet */}
        <div className="brikk-card text-center py-16">
          <div
            className="inline-flex h-16 w-16 items-center justify-center rounded-2xl mb-4"
            style={{ backgroundColor: `${brikkColors.blue}20` }}
          >
            <Bot className="h-8 w-8" style={{ color: brikkColors.blue }} />
          </div>
          <h3 className="text-lg font-semibold mb-2">No Agents Configured Yet</h3>
          <p className="text-muted-foreground mb-6 max-w-md mx-auto">
            Agent data will appear here once the API endpoints are configured. The UI is ready to display your agent registry with real-time metrics.
          </p>
          <div className="flex items-center justify-center gap-3">
            <Button className="btn-primary" disabled>
              <Plus className="h-4 w-4" />
              Register Agent
            </Button>
            <Button variant="outline" asChild>
              <a href="/API_QUESTIONS.md" target="_blank" rel="noopener noreferrer">
                <AlertCircle className="h-4 w-4 mr-2" />
                API Configuration Needed
              </a>
            </Button>
          </div>
          <div className="mt-8 p-4 rounded-lg bg-accent/50 max-w-2xl mx-auto text-left">
            <p className="text-sm font-medium mb-2">📋 What This Page Will Show:</p>
            <ul className="text-sm text-muted-foreground space-y-1">
              <li>• Agent registry with search and filters</li>
              <li>• Real-time status indicators (active/idle/error)</li>
              <li>• Performance metrics (requests, success rate, latency)</li>
              <li>• Agent details and configuration</li>
              <li>• Network topology visualization</li>
            </ul>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}

