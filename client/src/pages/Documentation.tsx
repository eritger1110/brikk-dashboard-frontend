import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { 
  BookOpen, Search, Code, Zap, Users, Shield, 
  Database, Webhook, FileText, ExternalLink, ChevronRight,
  Blocks, Settings, BarChart3, Lock
} from "lucide-react";

const docSections = [
  {
    id: "getting-started",
    title: "Getting Started",
    icon: Zap,
    items: [
      { title: "Quick Start Guide", slug: "quick-start" },
      { title: "Installation", slug: "installation" },
      { title: "Authentication Setup", slug: "authentication" },
      { title: "Your First BrikkAgent", slug: "first-agent" },
      { title: "Your First BrikkFlow", slug: "first-flow" },
    ],
  },
  {
    id: "api-reference",
    title: "API Reference",
    icon: Code,
    items: [
      { title: "REST API Overview", slug: "rest-api" },
      { title: "Authentication & Authorization", slug: "api-auth" },
      { title: "BrikkAgents API", slug: "agents-api" },
      { title: "BrikkFlows API", slug: "flows-api" },
      { title: "Execution & Monitoring API", slug: "execution-api" },
      { title: "Billing & Usage API", slug: "billing-api" },
      { title: "Webhooks API", slug: "webhooks-api" },
      { title: "Rate Limits & Quotas", slug: "rate-limits" },
    ],
  },
  {
    id: "brikk-agents",
    title: "BrikkAgent Catalog",
    icon: Blocks,
    items: [
      { title: "Customer Service Agents", slug: "cs-agents" },
      { title: "Sales & CRM Agents", slug: "sales-agents" },
      { title: "Analytics & Reporting Agents", slug: "analytics-agents" },
      { title: "Content Creation Agents", slug: "content-agents" },
      { title: "Development & DevOps Agents", slug: "dev-agents" },
      { title: "Marketing Automation Agents", slug: "marketing-agents" },
      { title: "Finance & Accounting Agents", slug: "finance-agents" },
      { title: "HR & Recruiting Agents", slug: "hr-agents" },
      { title: "Custom Agent Development", slug: "custom-agents" },
    ],
  },
  {
    id: "integrations",
    title: "Integration Guides",
    icon: Database,
    items: [
      { title: "Slack Integration", slug: "slack" },
      { title: "Salesforce Integration", slug: "salesforce" },
      { title: "Google Workspace", slug: "google" },
      { title: "Microsoft 365", slug: "microsoft" },
      { title: "Stripe Integration", slug: "stripe" },
      { title: "Shopify Integration", slug: "shopify" },
      { title: "SAP Integration", slug: "sap" },
      { title: "Snowflake Integration", slug: "snowflake" },
      { title: "Custom Connectors", slug: "custom-connectors" },
    ],
  },
  {
    id: "workflows",
    title: "BrikkFlow Examples",
    icon: Settings,
    items: [
      { title: "Customer Onboarding Flow", slug: "onboarding-flow" },
      { title: "Lead Qualification Flow", slug: "lead-flow" },
      { title: "Content Publishing Flow", slug: "content-flow" },
      { title: "Incident Response Flow", slug: "incident-flow" },
      { title: "Invoice Processing Flow", slug: "invoice-flow" },
      { title: "Social Media Management", slug: "social-flow" },
      { title: "Data Pipeline Automation", slug: "data-flow" },
    ],
  },
  {
    id: "security",
    title: "Security & Compliance",
    icon: Shield,
    items: [
      { title: "Security Overview", slug: "security-overview" },
      { title: "SOC 2 Type II Compliance", slug: "soc2" },
      { title: "GDPR Compliance", slug: "gdpr" },
      { title: "HIPAA Compliance", slug: "hipaa" },
      { title: "Data Encryption", slug: "encryption" },
      { title: "Access Controls", slug: "access-controls" },
      { title: "Audit Logging", slug: "audit-logs" },
    ],
  },
  {
    id: "analytics",
    title: "Analytics & Monitoring",
    icon: BarChart3,
    items: [
      { title: "Performance Metrics", slug: "metrics" },
      { title: "Cost Tracking", slug: "cost-tracking" },
      { title: "Error Monitoring", slug: "error-monitoring" },
      { title: "Custom Dashboards", slug: "dashboards" },
      { title: "Alerting & Notifications", slug: "alerting" },
    ],
  },
  {
    id: "developer",
    title: "Developer Resources",
    icon: Users,
    items: [
      { title: "SDK Documentation", slug: "sdk" },
      { title: "TypeScript SDK", slug: "typescript-sdk" },
      { title: "Python SDK", slug: "python-sdk" },
      { title: "JavaScript SDK", slug: "javascript-sdk" },
      { title: "CLI Tools", slug: "cli" },
      { title: "Integration Developer Terms", slug: "dev-terms" },
      { title: "Marketplace Publisher Guide", slug: "publisher-guide" },
    ],
  },
];

const popularDocs = [
  { title: "Quick Start Guide", section: "Getting Started", slug: "quick-start" },
  { title: "REST API Overview", section: "API Reference", slug: "rest-api" },
  { title: "Your First BrikkAgent", section: "Getting Started", slug: "first-agent" },
  { title: "Slack Integration", section: "Integrations", slug: "slack" },
  { title: "Customer Service Agents", section: "BrikkAgent Catalog", slug: "cs-agents" },
  { title: "Security Overview", section: "Security & Compliance", slug: "security-overview" },
];

export default function Documentation() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedSection, setSelectedSection] = useState<string | null>(null);

  const filteredSections = docSections.map(section => ({
    ...section,
    items: section.items.filter(item =>
      item.title.toLowerCase().includes(searchQuery.toLowerCase())
    ),
  })).filter(section => section.items.length > 0 || searchQuery === "");

  const handleDocClick = (slug: string) => {
    // In a real implementation, this would navigate to the doc page
    window.open(`https://docs.getbrikk.com/${slug}`, '_blank');
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b border-border bg-card">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-3 bg-primary/10 rounded-lg">
              <BookOpen className="h-8 w-8 text-primary" />
            </div>
            <div>
              <h1 className="text-3xl font-bold">Documentation</h1>
              <p className="text-muted-foreground mt-1">
                Everything you need to build with Brikk
              </p>
            </div>
          </div>

          {/* Search */}
          <div className="relative max-w-2xl">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <Input
              placeholder="Search documentation..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 h-12"
            />
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar Navigation */}
          <div className="lg:col-span-1">
            <div className="sticky top-6">
              <h3 className="text-sm font-semibold mb-4 text-muted-foreground">SECTIONS</h3>
              <ScrollArea className="h-[calc(100vh-200px)]">
                <div className="space-y-1">
                  {docSections.map((section) => {
                    const Icon = section.icon;
                    const isSelected = selectedSection === section.id;
                    
                    return (
                      <button
                        key={section.id}
                        onClick={() => setSelectedSection(isSelected ? null : section.id)}
                        className={`w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-colors ${
                          isSelected
                            ? 'bg-primary/10 text-primary font-medium'
                            : 'hover:bg-muted text-muted-foreground'
                        }`}
                      >
                        <Icon className="h-4 w-4" />
                        <span className="flex-1 text-left">{section.title}</span>
                        <ChevronRight className={`h-4 w-4 transition-transform ${isSelected ? 'rotate-90' : ''}`} />
                      </button>
                    );
                  })}
                </div>
              </ScrollArea>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            {!selectedSection && searchQuery === "" ? (
              <>
                {/* Popular Documentation */}
                <div className="mb-8">
                  <h2 className="text-2xl font-bold mb-4">Popular Documentation</h2>
                  <div className="grid gap-4 md:grid-cols-2">
                    {popularDocs.map((doc, index) => (
                      <Card
                        key={index}
                        className="p-4 hover:border-primary/50 cursor-pointer transition-colors"
                        onClick={() => handleDocClick(doc.slug)}
                      >
                        <div className="flex items-start justify-between">
                          <div>
                            <h3 className="font-semibold mb-1">{doc.title}</h3>
                            <p className="text-sm text-muted-foreground">{doc.section}</p>
                          </div>
                          <ExternalLink className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                        </div>
                      </Card>
                    ))}
                  </div>
                </div>

                {/* All Sections */}
                <div>
                  <h2 className="text-2xl font-bold mb-4">All Documentation</h2>
                  <div className="space-y-6">
                    {filteredSections.map((section) => {
                      const Icon = section.icon;
                      
                      return (
                        <div key={section.id}>
                          <div className="flex items-center gap-2 mb-3">
                            <Icon className="h-5 w-5 text-primary" />
                            <h3 className="text-lg font-semibold">{section.title}</h3>
                          </div>
                          <div className="grid gap-2 md:grid-cols-2">
                            {section.items.map((item, index) => (
                              <button
                                key={index}
                                onClick={() => handleDocClick(item.slug)}
                                className="flex items-center justify-between p-3 rounded-lg border border-border hover:border-primary/50 hover:bg-muted/50 transition-colors text-left"
                              >
                                <span className="text-sm">{item.title}</span>
                                <ExternalLink className="h-3 w-3 text-muted-foreground flex-shrink-0" />
                              </button>
                            ))}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </>
            ) : (
              /* Filtered Results */
              <div>
                <h2 className="text-2xl font-bold mb-4">
                  {selectedSection 
                    ? docSections.find(s => s.id === selectedSection)?.title
                    : `Search Results for "${searchQuery}"`
                  }
                </h2>
                <div className="grid gap-2 md:grid-cols-2">
                  {filteredSections.map((section) =>
                    section.items.map((item, index) => (
                      <button
                        key={`${section.id}-${index}`}
                        onClick={() => handleDocClick(item.slug)}
                        className="flex items-center justify-between p-3 rounded-lg border border-border hover:border-primary/50 hover:bg-muted/50 transition-colors text-left"
                      >
                        <div>
                          <span className="text-sm font-medium block">{item.title}</span>
                          <span className="text-xs text-muted-foreground">{section.title}</span>
                        </div>
                        <ExternalLink className="h-3 w-3 text-muted-foreground flex-shrink-0" />
                      </button>
                    ))
                  )}
                </div>
              </div>
            )}

            {/* Footer Links */}
            <div className="mt-12 p-6 bg-muted/50 rounded-lg border border-border">
              <h3 className="text-lg font-semibold mb-4">Need More Help?</h3>
              <div className="grid gap-4 md:grid-cols-3">
                <Button variant="outline" className="justify-start" asChild>
                  <a href="/help">
                    <Users className="h-4 w-4 mr-2" />
                    Contact Support
                  </a>
                </Button>
                <Button variant="outline" className="justify-start" asChild>
                  <a href="/legal#developer-terms" target="_blank">
                    <FileText className="h-4 w-4 mr-2" />
                    Developer Terms
                  </a>
                </Button>
                <Button variant="outline" className="justify-start" asChild>
                  <a href="/legal#marketplace-publisher" target="_blank">
                    <Lock className="h-4 w-4 mr-2" />
                    Publisher Agreement
                  </a>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
