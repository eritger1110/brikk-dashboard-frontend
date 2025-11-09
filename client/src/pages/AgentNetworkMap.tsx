import DashboardLayout from "@/components/layout/DashboardLayout";
import { Bot, ArrowLeft, AlertCircle, Network } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { brikkColors } from "@/lib/palette";

export default function AgentNetworkMap() {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/agents">
              <Button variant="ghost" size="icon">
                <ArrowLeft className="h-5 w-5" />
              </Button>
            </Link>
            <div>
              <h1 className="text-3xl font-bold">Agent Network Map</h1>
              <p className="text-muted-foreground mt-1">
                Live visualization of agent communication patterns
              </p>
            </div>
          </div>
        </div>

        {/* Empty State - Network Map Awaiting Data */}
        <div className="brikk-card text-center py-20">
          <div
            className="inline-flex h-20 w-20 items-center justify-center rounded-2xl mb-6"
            style={{ backgroundColor: `${brikkColors.cyan}20` }}
          >
            <Network className="h-10 w-10" style={{ color: brikkColors.cyan }} />
          </div>
          <h3 className="text-xl font-semibold mb-3">Network Map Ready</h3>
          <p className="text-muted-foreground mb-8 max-w-2xl mx-auto">
            The network visualization is ready to display agent communication patterns, message flows, and topology. Once the API provides agent network data, you'll see an interactive graph with real-time connections.
          </p>
          
          <div className="grid gap-6 md:grid-cols-2 max-w-4xl mx-auto text-left mb-8">
            <div className="p-6 rounded-lg bg-accent/50">
              <h4 className="font-semibold mb-3 flex items-center gap-2">
                <Bot className="h-5 w-5" style={{ color: brikkColors.blue }} />
                Interactive Graph
              </h4>
              <ul className="text-sm text-muted-foreground space-y-2">
                <li>• Drag-and-drop node positioning</li>
                <li>• Zoom and pan controls</li>
                <li>• Mini-map for navigation</li>
                <li>• Real-time connection updates</li>
              </ul>
            </div>
            <div className="p-6 rounded-lg bg-accent/50">
              <h4 className="font-semibold mb-3 flex items-center gap-2">
                <Network className="h-5 w-5" style={{ color: brikkColors.lime }} />
                Network Insights
              </h4>
              <ul className="text-sm text-muted-foreground space-y-2">
                <li>• Message flow visualization</li>
                <li>• Connection strength indicators</li>
                <li>• Agent status color-coding</li>
                <li>• Communication metrics</li>
              </ul>
            </div>
          </div>

          <Button variant="outline" asChild>
            <a href="/API_QUESTIONS.md" target="_blank" rel="noopener noreferrer">
              <AlertCircle className="h-4 w-4 mr-2" />
              View API Requirements
            </a>
          </Button>
        </div>

        {/* Stats Placeholder */}
        <div className="grid gap-4 md:grid-cols-4">
          <div className="brikk-card">
            <div className="text-sm text-muted-foreground mb-1">
              Active Connections
            </div>
            <div className="text-2xl font-bold text-muted-foreground">—</div>
            <div className="text-xs text-muted-foreground mt-1">
              Awaiting data
            </div>
          </div>
          <div className="brikk-card">
            <div className="text-sm text-muted-foreground mb-1">
              Total Messages
            </div>
            <div className="text-2xl font-bold text-muted-foreground">—</div>
            <div className="text-xs text-muted-foreground mt-1">
              Awaiting data
            </div>
          </div>
          <div className="brikk-card">
            <div className="text-sm text-muted-foreground mb-1">
              Avg Hops
            </div>
            <div className="text-2xl font-bold text-muted-foreground">—</div>
            <div className="text-xs text-muted-foreground mt-1">
              Awaiting data
            </div>
          </div>
          <div className="brikk-card">
            <div className="text-sm text-muted-foreground mb-1">
              Network Health
            </div>
            <div className="text-2xl font-bold text-muted-foreground">—</div>
            <div className="text-xs text-muted-foreground mt-1">
              Awaiting data
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}

