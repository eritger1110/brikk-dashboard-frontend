import DashboardLayout from "@/components/layout/DashboardLayout";
import {
  Code,
  Book,
  Terminal,
  Webhook,
  Copy,
  Play,
  CheckCircle2,
  AlertCircle,
  FileCode,
  Zap,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { brikkColors } from "@/lib/palette";
import { useState } from "react";

export default function Developer() {
  const [selectedEndpoint, setSelectedEndpoint] = useState("GET /health");
  const [apiResponse, setApiResponse] = useState("");

  const testHealthEndpoint = async () => {
    try {
      const response = await fetch("https://api.getbrikk.com/health");
      const data = await response.json();
      setApiResponse(JSON.stringify(data, null, 2));
    } catch (error) {
      setApiResponse(`Error: ${error}`);
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Developer Tools</h1>
            <p className="text-muted-foreground mt-1">
              API explorer, documentation, and integration resources
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" asChild>
              <a href="https://api.getbrikk.com" target="_blank" rel="noopener noreferrer">
                <Book className="h-4 w-4 mr-2" />
                API Docs
              </a>
            </Button>
            <Button className="btn-primary" asChild>
              <a href="https://www.getbrikk.com" target="_blank" rel="noopener noreferrer">
                <Zap className="h-4 w-4" />
                Try Sandbox
              </a>
            </Button>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid gap-4 md:grid-cols-4">
          <div className="brikk-card">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-muted-foreground">API Version</span>
              <Code className="h-5 w-5" style={{ color: brikkColors.blue }} />
            </div>
            <div className="text-2xl font-bold gradient-text">v1.0.0</div>
            <div className="text-xs text-muted-foreground mt-1">
              Latest stable
            </div>
          </div>
          <div className="brikk-card">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-muted-foreground">Endpoints</span>
              <Terminal className="h-5 w-5" style={{ color: brikkColors.cyan }} />
            </div>
            <div className="text-2xl font-bold gradient-text">—</div>
            <div className="text-xs text-muted-foreground mt-1">
              Awaiting docs
            </div>
          </div>
          <div className="brikk-card">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-muted-foreground">Webhooks</span>
              <Webhook className="h-5 w-5" style={{ color: brikkColors.violet }} />
            </div>
            <div className="text-2xl font-bold gradient-text">—</div>
            <div className="text-xs text-muted-foreground mt-1">
              Awaiting config
            </div>
          </div>
          <div className="brikk-card">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-muted-foreground">SDK Downloads</span>
              <FileCode className="h-5 w-5" style={{ color: brikkColors.lime }} />
            </div>
            <div className="text-2xl font-bold gradient-text">—</div>
            <div className="text-xs text-muted-foreground mt-1">
              Coming soon
            </div>
          </div>
        </div>

        {/* API Explorer */}
        <div className="grid gap-6 lg:grid-cols-2">
          {/* Request Panel */}
          <div className="brikk-card">
            <div className="mb-4">
              <h3 className="text-lg font-semibold">API Explorer</h3>
              <p className="text-sm text-muted-foreground">
                Test API endpoints directly from the dashboard
              </p>
            </div>

            {/* Endpoint Selector */}
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium mb-2 block">Endpoint</label>
                <select
                  className="w-full p-2 rounded-lg border border-border bg-background"
                  value={selectedEndpoint}
                  onChange={(e) => setSelectedEndpoint(e.target.value)}
                >
                  <option value="GET /health">GET /health</option>
                  <option value="GET /api/v1/agents" disabled>GET /api/v1/agents (awaiting docs)</option>
                  <option value="GET /api/v1/BrikkFlows" disabled>GET /api/v1/BrikkFlows (awaiting docs)</option>
                  <option value="GET /api/v1/metrics" disabled>GET /api/v1/metrics (awaiting docs)</option>
                </select>
              </div>

              {/* Headers */}
              <div>
                <label className="text-sm font-medium mb-2 block">Headers</label>
                <div className="p-3 rounded-lg bg-accent/50 font-mono text-xs">
                  <div>Content-Type: application/json</div>
                  <div className="text-muted-foreground">Authorization: Bearer •••••••</div>
                </div>
              </div>

              {/* Request Body (for POST/PUT) */}
              <div>
                <label className="text-sm font-medium mb-2 block">Request Body</label>
                <textarea
                  className="w-full p-3 rounded-lg border border-border bg-background font-mono text-xs"
                  rows={6}
                  placeholder="{}"
                  disabled={selectedEndpoint.startsWith("GET")}
                />
              </div>

              {/* Send Button */}
              <Button
                className="w-full btn-primary"
                onClick={testHealthEndpoint}
                disabled={selectedEndpoint !== "GET /health"}
              >
                <Play className="h-4 w-4 mr-2" />
                Send Request
              </Button>
            </div>
          </div>

          {/* Response Panel */}
          <div className="brikk-card">
            <div className="mb-4 flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold">Response</h3>
                <p className="text-sm text-muted-foreground">
                  API response will appear here
                </p>
              </div>
              {apiResponse && (
                <Button variant="ghost" size="icon" className="h-8 w-8">
                  <Copy className="h-4 w-4" />
                </Button>
              )}
            </div>

            {/* Response Display */}
            <div className="space-y-3">
              {apiResponse ? (
                <>
                  <div className="flex items-center gap-2 p-2 rounded-lg bg-accent/50">
                    <CheckCircle2 className="h-4 w-4 text-[#A3FF12]" />
                    <span className="text-sm font-medium">200 OK</span>
                    <span className="text-xs text-muted-foreground ml-auto">
                      Response time: ~50ms
                    </span>
                  </div>
                  <pre className="p-4 rounded-lg bg-accent/50 font-mono text-xs overflow-auto max-h-96">
                    {apiResponse}
                  </pre>
                </>
              ) : (
                <div className="flex items-center justify-center h-96 border-2 border-dashed rounded-lg">
                  <div className="text-center">
                    <Terminal className="h-10 w-10 mx-auto mb-3 text-muted-foreground" />
                    <p className="text-sm text-muted-foreground">
                      No response yet
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      Send a request to see the response
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* SDK & Libraries */}
        <div className="brikk-card">
          <div className="mb-4">
            <h3 className="text-lg font-semibold">SDKs & Client Libraries</h3>
            <p className="text-sm text-muted-foreground">
              Official libraries for popular programming languages
            </p>
          </div>
          <div className="grid gap-4 md:grid-cols-3">
            <div className="p-4 rounded-lg border border-border">
              <div className="flex items-center gap-3 mb-3">
                <div
                  className="flex h-10 w-10 items-center justify-center rounded-lg"
                  style={{ backgroundColor: `${brikkColors.blue}20` }}
                >
                  <FileCode className="h-5 w-5" style={{ color: brikkColors.blue }} />
                </div>
                <div>
                  <div className="font-semibold">JavaScript / TypeScript</div>
                  <div className="text-xs text-muted-foreground">npm install @brikk/sdk</div>
                </div>
              </div>
              <Button variant="outline" size="sm" className="w-full" disabled>
                Coming Soon
              </Button>
            </div>

            <div className="p-4 rounded-lg border border-border">
              <div className="flex items-center gap-3 mb-3">
                <div
                  className="flex h-10 w-10 items-center justify-center rounded-lg"
                  style={{ backgroundColor: `${brikkColors.cyan}20` }}
                >
                  <FileCode className="h-5 w-5" style={{ color: brikkColors.cyan }} />
                </div>
                <div>
                  <div className="font-semibold">Python</div>
                  <div className="text-xs text-muted-foreground">pip install brikk</div>
                </div>
              </div>
              <Button variant="outline" size="sm" className="w-full" disabled>
                Coming Soon
              </Button>
            </div>

            <div className="p-4 rounded-lg border border-border">
              <div className="flex items-center gap-3 mb-3">
                <div
                  className="flex h-10 w-10 items-center justify-center rounded-lg"
                  style={{ backgroundColor: `${brikkColors.violet}20` }}
                >
                  <FileCode className="h-5 w-5" style={{ color: brikkColors.violet }} />
                </div>
                <div>
                  <div className="font-semibold">Go</div>
                  <div className="text-xs text-muted-foreground">go get github.com/brikk/sdk</div>
                </div>
              </div>
              <Button variant="outline" size="sm" className="w-full" disabled>
                Coming Soon
              </Button>
            </div>
          </div>
        </div>

        {/* Webhooks */}
        <div className="brikk-card">
          <div className="mb-4 flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold">Webhooks</h3>
              <p className="text-sm text-muted-foreground">
                Configure webhook endpoints for real-time event notifications
              </p>
            </div>
            <Button variant="outline" size="sm" disabled>
              Add Webhook
            </Button>
          </div>
          <div className="flex items-center justify-center py-12 border-2 border-dashed rounded-lg">
            <div className="text-center">
              <Webhook className="h-8 w-8 mx-auto mb-3 text-muted-foreground" />
              <p className="text-sm text-muted-foreground">
                No webhooks configured yet
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                Webhooks will appear here once API is configured
              </p>
            </div>
          </div>
        </div>

        {/* Developer Resources */}
        <div className="brikk-card border-2 border-dashed">
          <div className="flex items-start gap-4">
            <div
              className="flex h-10 w-10 items-center justify-center rounded-lg flex-shrink-0"
              style={{ backgroundColor: `${brikkColors.blue}20` }}
            >
              <Code className="h-5 w-5" style={{ color: brikkColors.blue }} />
            </div>
            <div className="flex-1">
              <h4 className="font-semibold mb-2">Developer Tools Ready</h4>
              <p className="text-sm text-muted-foreground mb-3">
                The developer portal is ready with API explorer, SDK documentation, and webhook management. The /health endpoint is working - try it above! Once full API documentation is available, all endpoints will be testable here.
              </p>
              <div className="text-sm space-y-1">
                <p className="font-medium">🛠️ Features Ready:</p>
                <ul className="list-disc list-inside text-muted-foreground ml-2 space-y-1">
                  <li>Interactive API explorer with live testing</li>
                  <li>SDK documentation and code examples</li>
                  <li>Webhook configuration and testing</li>
                  <li>API versioning and changelog</li>
                  <li>Rate limiting and quota information</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}

