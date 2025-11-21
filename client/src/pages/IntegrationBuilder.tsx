import { useState } from "react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import {
  Upload,
  FileText,
  Link as LinkIcon,
  Code,
  Sparkles,
  Loader2,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";

const API_BASE_URL = import.meta.env.VITE_UCS_API_URL || "https://8000-izm86p4nsuk8lkf8pus89-fe6db43a.manusvm.computer";

const CATEGORIES = [
  "CRM",
  "ERP",
  "E-commerce",
  "Finance",
  "Communication",
  "Marketing",
  "HR",
  "Logistics",
  "Database",
  "Analytics",
  "Other",
];

export default function IntegrationBuilder() {
  const [integrationName, setIntegrationName] = useState("");
  const [integrationCategory, setIntegrationCategory] = useState("");
  const [integrationDescription, setIntegrationDescription] = useState("");
  
  const [openApiFile, setOpenApiFile] = useState<File | null>(null);
  const [postmanFile, setPostmanFile] = useState<File | null>(null);
  const [docsUrl, setDocsUrl] = useState("");
  const [docsText, setDocsText] = useState("");
  const [sampleRequests, setSampleRequests] = useState("");
  
  const [generating, setGenerating] = useState(false);
  const [generatedConnector, setGeneratedConnector] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  async function handleGenerate(method: string) {
    if (!integrationName || !integrationCategory || !integrationDescription) {
      toast.error("Please fill in all integration details");
      return;
    }

    setGenerating(true);
    setError(null);
    setGeneratedConnector(null);

    try {
      let endpoint = "";
      let body: any = {
        integration_name: integrationName,
        integration_category: integrationCategory,
        integration_description: integrationDescription,
      };

      switch (method) {
        case "openapi":
          if (!openApiFile) {
            toast.error("Please upload an OpenAPI file");
            return;
          }
          endpoint = "/api/v1/connectors/generate/openapi";
          const openApiContent = await openApiFile.text();
          body.openapi_spec = JSON.parse(openApiContent);
          break;

        case "postman":
          if (!postmanFile) {
            toast.error("Please upload a Postman collection");
            return;
          }
          endpoint = "/api/v1/connectors/generate/postman";
          const postmanContent = await postmanFile.text();
          body.postman_collection = JSON.parse(postmanContent);
          break;

        case "url":
          if (!docsUrl) {
            toast.error("Please enter a documentation URL");
            return;
          }
          endpoint = "/api/v1/connectors/generate/url";
          body.documentation_url = docsUrl;
          break;

        case "text":
          if (!docsText) {
            toast.error("Please enter documentation text");
            return;
          }
          endpoint = "/api/v1/connectors/generate/text";
          body.documentation_text = docsText;
          break;

        case "samples":
          if (!sampleRequests) {
            toast.error("Please enter sample requests");
            return;
          }
          endpoint = "/api/v1/connectors/generate/samples";
          body.sample_requests = sampleRequests.split("\n\n").filter(Boolean);
          break;

        default:
          toast.error("Invalid generation method");
          return;
      }

      const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to generate connector");
      }

      const connector = await response.json();
      setGeneratedConnector(connector);
      toast.success("Connector generated successfully!");
    } catch (err: any) {
      console.error("Generation failed:", err);
      setError(err.message || "Failed to generate connector");
      toast.error(err.message || "Failed to generate connector");
    } finally {
      setGenerating(false);
    }
  }

  async function handleSave() {
    if (!generatedConnector) return;

    try {
      const response = await fetch(`${API_BASE_URL}/api/v1/connectors/save`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(generatedConnector),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to save connector");
      }

      const result = await response.json();
      toast.success("Connector saved to marketplace!");
      
      // Reset form
      setGeneratedConnector(null);
      setIntegrationName("");
      setIntegrationCategory("");
      setIntegrationDescription("");
      setOpenApiFile(null);
      setPostmanFile(null);
      setDocsUrl("");
      setDocsText("");
      setSampleRequests("");
    } catch (err: any) {
      console.error("Save failed:", err);
      toast.error(err.message || "Failed to save connector");
    }
  }

  return (
    <DashboardLayout>
      <div className="space-y-6 max-w-5xl">
        <div>
          <h1 className="text-3xl font-bold mb-2">Integration Builder</h1>
          <p className="text-muted-foreground">
            Generate connectors from API documentation, OpenAPI specs, or Postman collections
          </p>
        </div>

        {/* Integration Details */}
        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-4">Integration Details</h2>
          <div className="space-y-4">
            <div>
              <Label htmlFor="name">Integration Name *</Label>
              <Input
                id="name"
                placeholder="e.g., Shopify, Salesforce, Stripe"
                value={integrationName}
                onChange={(e) => setIntegrationName(e.target.value)}
              />
            </div>

            <div>
              <Label htmlFor="category">Category *</Label>
              <Select value={integrationCategory} onValueChange={setIntegrationCategory}>
                <SelectTrigger>
                  <SelectValue placeholder="Select a category" />
                </SelectTrigger>
                <SelectContent>
                  {CATEGORIES.map((cat) => (
                    <SelectItem key={cat} value={cat}>
                      {cat}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="description">Description *</Label>
              <Textarea
                id="description"
                placeholder="Brief description of what this integration does"
                value={integrationDescription}
                onChange={(e) => setIntegrationDescription(e.target.value)}
                rows={3}
              />
            </div>
          </div>
        </Card>

        {/* Generation Methods */}
        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-4">Generation Method</h2>
          
          <Tabs defaultValue="openapi" className="w-full">
            <TabsList className="grid w-full grid-cols-5">
              <TabsTrigger value="openapi">OpenAPI</TabsTrigger>
              <TabsTrigger value="postman">Postman</TabsTrigger>
              <TabsTrigger value="url">URL</TabsTrigger>
              <TabsTrigger value="text">Text</TabsTrigger>
              <TabsTrigger value="samples">Samples</TabsTrigger>
            </TabsList>

            <TabsContent value="openapi" className="space-y-4">
              <div>
                <Label htmlFor="openapi-file">Upload OpenAPI/Swagger File</Label>
                <div className="mt-2">
                  <Input
                    id="openapi-file"
                    type="file"
                    accept=".json,.yaml,.yml"
                    onChange={(e) => setOpenApiFile(e.target.files?.[0] || null)}
                  />
                </div>
                <p className="text-sm text-muted-foreground mt-2">
                  Upload an OpenAPI 3.0 specification file (JSON or YAML)
                </p>
              </div>
              <Button
                onClick={() => handleGenerate("openapi")}
                disabled={generating || !openApiFile}
                className="w-full"
              >
                {generating ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Generating...
                  </>
                ) : (
                  <>
                    <Sparkles className="mr-2 h-4 w-4" />
                    Generate from OpenAPI
                  </>
                )}
              </Button>
            </TabsContent>

            <TabsContent value="postman" className="space-y-4">
              <div>
                <Label htmlFor="postman-file">Upload Postman Collection</Label>
                <div className="mt-2">
                  <Input
                    id="postman-file"
                    type="file"
                    accept=".json"
                    onChange={(e) => setPostmanFile(e.target.files?.[0] || null)}
                  />
                </div>
                <p className="text-sm text-muted-foreground mt-2">
                  Upload a Postman Collection v2.1 file (JSON)
                </p>
              </div>
              <Button
                onClick={() => handleGenerate("postman")}
                disabled={generating || !postmanFile}
                className="w-full"
              >
                {generating ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Generating...
                  </>
                ) : (
                  <>
                    <Sparkles className="mr-2 h-4 w-4" />
                    Generate from Postman
                  </>
                )}
              </Button>
            </TabsContent>

            <TabsContent value="url" className="space-y-4">
              <div>
                <Label htmlFor="docs-url">API Documentation URL</Label>
                <Input
                  id="docs-url"
                  type="url"
                  placeholder="https://api.example.com/docs"
                  value={docsUrl}
                  onChange={(e) => setDocsUrl(e.target.value)}
                />
                <p className="text-sm text-muted-foreground mt-2">
                  Enter the URL to the API documentation page
                </p>
              </div>
              <Button
                onClick={() => handleGenerate("url")}
                disabled={generating || !docsUrl}
                className="w-full"
              >
                {generating ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Generating...
                  </>
                ) : (
                  <>
                    <Sparkles className="mr-2 h-4 w-4" />
                    Generate from URL
                  </>
                )}
              </Button>
            </TabsContent>

            <TabsContent value="text" className="space-y-4">
              <div>
                <Label htmlFor="docs-text">API Documentation Text</Label>
                <Textarea
                  id="docs-text"
                  placeholder="Paste API documentation here..."
                  value={docsText}
                  onChange={(e) => setDocsText(e.target.value)}
                  rows={10}
                />
                <p className="text-sm text-muted-foreground mt-2">
                  Paste raw API documentation text
                </p>
              </div>
              <Button
                onClick={() => handleGenerate("text")}
                disabled={generating || !docsText}
                className="w-full"
              >
                {generating ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Generating...
                  </>
                ) : (
                  <>
                    <Sparkles className="mr-2 h-4 w-4" />
                    Generate from Text
                  </>
                )}
              </Button>
            </TabsContent>

            <TabsContent value="samples" className="space-y-4">
              <div>
                <Label htmlFor="sample-requests">Sample CURL Requests</Label>
                <Textarea
                  id="sample-requests"
                  placeholder="curl -X GET https://api.example.com/users&#10;&#10;curl -X POST https://api.example.com/users -d '{...}'"
                  value={sampleRequests}
                  onChange={(e) => setSampleRequests(e.target.value)}
                  rows={10}
                />
                <p className="text-sm text-muted-foreground mt-2">
                  Enter sample CURL commands, separated by blank lines
                </p>
              </div>
              <Button
                onClick={() => handleGenerate("samples")}
                disabled={generating || !sampleRequests}
                className="w-full"
              >
                {generating ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Generating...
                  </>
                ) : (
                  <>
                    <Sparkles className="mr-2 h-4 w-4" />
                    Generate from Samples
                  </>
                )}
              </Button>
            </TabsContent>
          </Tabs>
        </Card>

        {/* Error Display */}
        {error && (
          <Card className="p-6 border-destructive">
            <div className="flex items-start gap-3">
              <AlertCircle className="h-5 w-5 text-destructive mt-0.5" />
              <div>
                <h3 className="font-semibold text-destructive">Generation Failed</h3>
                <p className="text-sm text-muted-foreground mt-1">{error}</p>
              </div>
            </div>
          </Card>
        )}

        {/* Generated Connector Preview */}
        {generatedConnector && (
          <Card className="p-6 border-green-500">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-start gap-3">
                <CheckCircle2 className="h-5 w-5 text-green-500 mt-0.5" />
                <div>
                  <h3 className="font-semibold text-green-500">Connector Generated Successfully!</h3>
                  <p className="text-sm text-muted-foreground mt-1">
                    Review the generated connector below
                  </p>
                </div>
              </div>
              <Button onClick={handleSave}>
                Save to Marketplace
              </Button>
            </div>

            <div className="space-y-4">
              <div>
                <Label>Name</Label>
                <p className="text-sm mt-1">{generatedConnector.name}</p>
              </div>

              <div>
                <Label>Description</Label>
                <p className="text-sm mt-1">{generatedConnector.description}</p>
              </div>

              <div>
                <Label>Base URL</Label>
                <p className="text-sm mt-1 font-mono">{generatedConnector.base_url}</p>
              </div>

              <div>
                <Label>Endpoints ({generatedConnector.endpoints?.length || 0})</Label>
                <div className="mt-2 space-y-2">
                  {generatedConnector.endpoints?.slice(0, 5).map((endpoint: any, index: number) => (
                    <div key={index} className="p-3 bg-muted rounded-lg">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-mono bg-blue-500/10 text-blue-500 px-2 py-1 rounded">
                          {endpoint.method}
                        </span>
                        <span className="text-sm font-mono">{endpoint.path}</span>
                      </div>
                      <p className="text-xs text-muted-foreground mt-1">{endpoint.description}</p>
                    </div>
                  ))}
                  {(generatedConnector.endpoints?.length || 0) > 5 && (
                    <p className="text-sm text-muted-foreground">
                      ... and {generatedConnector.endpoints.length - 5} more endpoints
                    </p>
                  )}
                </div>
              </div>

              <div>
                <Label>Authentication</Label>
                <p className="text-sm mt-1">{generatedConnector.auth?.type || "None"}</p>
              </div>
            </div>
          </Card>
        )}
      </div>
    </DashboardLayout>
  );
}
