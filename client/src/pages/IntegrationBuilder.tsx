import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Upload, FileJson, Link2, FileText, Code, 
  Loader2, CheckCircle2, AlertCircle, Sparkles 
} from 'lucide-react';
import { toast } from 'sonner';

/**
 * Universal Connector Builder
 * 
 * Allows users to create integrations using:
 * - OpenAPI/Swagger files
 * - Postman collections
 * - API documentation URLs
 * - Raw API documentation text
 * - Sample CURL/JSON requests
 */

interface GenerationStep {
  id: string;
  title: string;
  status: 'pending' | 'processing' | 'complete' | 'error';
  message?: string;
}

export default function IntegrationBuilder() {
  const [activeTab, setActiveTab] = useState('openapi');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationSteps, setGenerationSteps] = useState<GenerationStep[]>([]);
  
  // Form states
  const [openapiFile, setOpenapiFile] = useState<File | null>(null);
  const [postmanFile, setPostmanFile] = useState<File | null>(null);
  const [apiDocsUrl, setApiDocsUrl] = useState('');
  const [rawDocs, setRawDocs] = useState('');
  const [sampleRequests, setSampleRequests] = useState('');
  
  // Integration metadata
  const [integrationName, setIntegrationName] = useState('');
  const [integrationDescription, setIntegrationDescription] = useState('');
  const [integrationCategory, setIntegrationCategory] = useState('');

  const updateStep = (id: string, updates: Partial<GenerationStep>) => {
    setGenerationSteps(prev => 
      prev.map(step => step.id === id ? { ...step, ...updates } : step)
    );
  };

  const generateFromOpenAPI = async () => {
    if (!openapiFile) {
      toast.error('Please upload an OpenAPI file');
      return;
    }

    setIsGenerating(true);
    setGenerationSteps([
      { id: 'upload', title: 'Uploading file', status: 'processing' },
      { id: 'parse', title: 'Parsing OpenAPI specification', status: 'pending' },
      { id: 'extract', title: 'Extracting endpoints', status: 'pending' },
      { id: 'auth', title: 'Detecting authentication', status: 'pending' },
      { id: 'schema', title: 'Generating schemas', status: 'pending' },
      { id: 'cdf', title: 'Creating connector definition', status: 'pending' },
      { id: 'save', title: 'Saving integration', status: 'pending' },
    ]);

    try {
      // Simulate file upload
      await new Promise(resolve => setTimeout(resolve, 1000));
      updateStep('upload', { status: 'complete' });
      
      // Simulate parsing
      updateStep('parse', { status: 'processing' });
      await new Promise(resolve => setTimeout(resolve, 1500));
      updateStep('parse', { status: 'complete', message: 'Found 24 endpoints' });
      
      // Simulate extraction
      updateStep('extract', { status: 'processing' });
      await new Promise(resolve => setTimeout(resolve, 1200));
      updateStep('extract', { status: 'complete', message: '18 actions, 6 triggers' });
      
      // Simulate auth detection
      updateStep('auth', { status: 'processing' });
      await new Promise(resolve => setTimeout(resolve, 1000));
      updateStep('auth', { status: 'complete', message: 'OAuth 2.0 detected' });
      
      // Simulate schema generation
      updateStep('schema', { status: 'processing' });
      await new Promise(resolve => setTimeout(resolve, 2000));
      updateStep('schema', { status: 'complete', message: 'Generated request/response schemas' });
      
      // Simulate CDF creation
      updateStep('cdf', { status: 'processing' });
      await new Promise(resolve => setTimeout(resolve, 1500));
      updateStep('cdf', { status: 'complete', message: 'Connector definition created' });
      
      // Simulate save
      updateStep('save', { status: 'processing' });
      await new Promise(resolve => setTimeout(resolve, 1000));
      updateStep('save', { status: 'complete' });
      
      toast.success('Integration created successfully!');
      
      // TODO: Navigate to integration detail page
      // router.push(`/developer/integrations/${integrationId}`);
      
    } catch (error) {
      toast.error('Failed to generate integration');
      console.error(error);
    } finally {
      setIsGenerating(false);
    }
  };

  const generateFromPostman = async () => {
    if (!postmanFile) {
      toast.error('Please upload a Postman collection');
      return;
    }
    
    setIsGenerating(true);
    // Similar flow to OpenAPI
    toast.info('Postman collection generation coming soon!');
    setIsGenerating(false);
  };

  const generateFromUrl = async () => {
    if (!apiDocsUrl) {
      toast.error('Please enter an API documentation URL');
      return;
    }
    
    setIsGenerating(true);
    setGenerationSteps([
      { id: 'fetch', title: 'Fetching documentation', status: 'processing' },
      { id: 'parse', title: 'Parsing HTML content', status: 'pending' },
      { id: 'extract', title: 'Extracting API information', status: 'pending' },
      { id: 'infer', title: 'AI inference of endpoints', status: 'pending' },
      { id: 'schema', title: 'Generating schemas', status: 'pending' },
      { id: 'cdf', title: 'Creating connector definition', status: 'pending' },
      { id: 'save', title: 'Saving integration', status: 'pending' },
    ]);
    
    try {
      // Simulate fetching
      await new Promise(resolve => setTimeout(resolve, 2000));
      updateStep('fetch', { status: 'complete' });
      
      // Simulate parsing
      updateStep('parse', { status: 'processing' });
      await new Promise(resolve => setTimeout(resolve, 1500));
      updateStep('parse', { status: 'complete' });
      
      // Simulate extraction
      updateStep('extract', { status: 'processing' });
      await new Promise(resolve => setTimeout(resolve, 2000));
      updateStep('extract', { status: 'complete', message: 'Found 15 endpoints' });
      
      // Simulate AI inference
      updateStep('infer', { status: 'processing' });
      await new Promise(resolve => setTimeout(resolve, 3000));
      updateStep('infer', { status: 'complete', message: 'Inferred parameters and schemas' });
      
      // Simulate schema generation
      updateStep('schema', { status: 'processing' });
      await new Promise(resolve => setTimeout(resolve, 2000));
      updateStep('schema', { status: 'complete' });
      
      // Simulate CDF creation
      updateStep('cdf', { status: 'processing' });
      await new Promise(resolve => setTimeout(resolve, 1500));
      updateStep('cdf', { status: 'complete' });
      
      // Simulate save
      updateStep('save', { status: 'processing' });
      await new Promise(resolve => setTimeout(resolve, 1000));
      updateStep('save', { status: 'complete' });
      
      toast.success('Integration created from documentation!');
      
    } catch (error) {
      toast.error('Failed to generate integration from URL');
      console.error(error);
    } finally {
      setIsGenerating(false);
    }
  };

  const generateFromText = async () => {
    if (!rawDocs) {
      toast.error('Please paste API documentation');
      return;
    }
    
    setIsGenerating(true);
    toast.info('Text-based generation coming soon!');
    setIsGenerating(false);
  };

  const generateFromSamples = async () => {
    if (!sampleRequests) {
      toast.error('Please provide sample requests');
      return;
    }
    
    setIsGenerating(true);
    toast.info('Sample-based generation coming soon!');
    setIsGenerating(false);
  };

  const renderGenerationProgress = () => {
    if (generationSteps.length === 0) return null;
    
    return (
      <Card className="p-6 mt-6">
        <div className="flex items-center gap-2 mb-4">
          <Sparkles className="w-5 h-5 text-primary" />
          <h3 className="text-lg font-semibold">AI Generation in Progress</h3>
        </div>
        
        <div className="space-y-3">
          {generationSteps.map(step => (
            <div key={step.id} className="flex items-start gap-3">
              <div className="mt-0.5">
                {step.status === 'processing' && (
                  <Loader2 className="w-5 h-5 text-primary animate-spin" />
                )}
                {step.status === 'complete' && (
                  <CheckCircle2 className="w-5 h-5 text-green-500" />
                )}
                {step.status === 'error' && (
                  <AlertCircle className="w-5 h-5 text-red-500" />
                )}
                {step.status === 'pending' && (
                  <div className="w-5 h-5 rounded-full border-2 border-muted" />
                )}
              </div>
              
              <div className="flex-1">
                <div className="font-medium">{step.title}</div>
                {step.message && (
                  <div className="text-sm text-muted-foreground">{step.message}</div>
                )}
              </div>
            </div>
          ))}
        </div>
      </Card>
    );
  };

  return (
    <div className="container mx-auto py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Create New Integration</h1>
        <p className="text-muted-foreground">
          Generate a connector using AI from various input formats
        </p>
      </div>

      {/* Integration Metadata */}
      <Card className="p-6 mb-6">
        <h2 className="text-xl font-semibold mb-4">Integration Details</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="name">Integration Name</Label>
            <Input
              id="name"
              placeholder="e.g., Shopify"
              value={integrationName}
              onChange={(e) => setIntegrationName(e.target.value)}
            />
          </div>
          
          <div>
            <Label htmlFor="category">Category</Label>
            <Input
              id="category"
              placeholder="e.g., E-commerce"
              value={integrationCategory}
              onChange={(e) => setIntegrationCategory(e.target.value)}
            />
          </div>
          
          <div className="md:col-span-2">
            <Label htmlFor="description">Description</Label>
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
        <h2 className="text-xl font-semibold mb-4">Choose Generation Method</h2>
        
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="openapi">
              <FileJson className="w-4 h-4 mr-2" />
              OpenAPI
            </TabsTrigger>
            <TabsTrigger value="postman">
              <Upload className="w-4 h-4 mr-2" />
              Postman
            </TabsTrigger>
            <TabsTrigger value="url">
              <Link2 className="w-4 h-4 mr-2" />
              URL
            </TabsTrigger>
            <TabsTrigger value="text">
              <FileText className="w-4 h-4 mr-2" />
              Text
            </TabsTrigger>
            <TabsTrigger value="samples">
              <Code className="w-4 h-4 mr-2" />
              Samples
            </TabsTrigger>
          </TabsList>

          {/* OpenAPI Tab */}
          <TabsContent value="openapi" className="space-y-4">
            <div>
              <Label htmlFor="openapi-file">Upload OpenAPI/Swagger File</Label>
              <p className="text-sm text-muted-foreground mb-2">
                JSON or YAML format accepted
              </p>
              <Input
                id="openapi-file"
                type="file"
                accept=".json,.yaml,.yml"
                onChange={(e) => setOpenapiFile(e.target.files?.[0] || null)}
                disabled={isGenerating}
              />
            </div>
            
            <Button 
              onClick={generateFromOpenAPI}
              disabled={!openapiFile || isGenerating}
              className="w-full"
            >
              {isGenerating ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Generating...
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 mr-2" />
                  Generate Integration
                </>
              )}
            </Button>
          </TabsContent>

          {/* Postman Tab */}
          <TabsContent value="postman" className="space-y-4">
            <div>
              <Label htmlFor="postman-file">Upload Postman Collection</Label>
              <p className="text-sm text-muted-foreground mb-2">
                JSON format exported from Postman
              </p>
              <Input
                id="postman-file"
                type="file"
                accept=".json"
                onChange={(e) => setPostmanFile(e.target.files?.[0] || null)}
                disabled={isGenerating}
              />
            </div>
            
            <Button 
              onClick={generateFromPostman}
              disabled={!postmanFile || isGenerating}
              className="w-full"
            >
              {isGenerating ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Generating...
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 mr-2" />
                  Generate Integration
                </>
              )}
            </Button>
          </TabsContent>

          {/* URL Tab */}
          <TabsContent value="url" className="space-y-4">
            <div>
              <Label htmlFor="api-docs-url">API Documentation URL</Label>
              <p className="text-sm text-muted-foreground mb-2">
                We'll fetch and parse the documentation automatically
              </p>
              <Input
                id="api-docs-url"
                type="url"
                placeholder="https://api.example.com/docs"
                value={apiDocsUrl}
                onChange={(e) => setApiDocsUrl(e.target.value)}
                disabled={isGenerating}
              />
            </div>
            
            <Button 
              onClick={generateFromUrl}
              disabled={!apiDocsUrl || isGenerating}
              className="w-full"
            >
              {isGenerating ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Generating...
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 mr-2" />
                  Generate Integration
                </>
              )}
            </Button>
          </TabsContent>

          {/* Text Tab */}
          <TabsContent value="text" className="space-y-4">
            <div>
              <Label htmlFor="raw-docs">Paste API Documentation</Label>
              <p className="text-sm text-muted-foreground mb-2">
                Copy and paste API documentation text
              </p>
              <Textarea
                id="raw-docs"
                placeholder="Paste API documentation here..."
                value={rawDocs}
                onChange={(e) => setRawDocs(e.target.value)}
                rows={10}
                disabled={isGenerating}
              />
            </div>
            
            <Button 
              onClick={generateFromText}
              disabled={!rawDocs || isGenerating}
              className="w-full"
            >
              {isGenerating ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Generating...
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 mr-2" />
                  Generate Integration
                </>
              )}
            </Button>
          </TabsContent>

          {/* Samples Tab */}
          <TabsContent value="samples" className="space-y-4">
            <div>
              <Label htmlFor="sample-requests">Sample Requests</Label>
              <p className="text-sm text-muted-foreground mb-2">
                Provide CURL commands or JSON requests
              </p>
              <Textarea
                id="sample-requests"
                placeholder={`curl -X GET "https://api.example.com/users" \\
  -H "Authorization: Bearer TOKEN"

curl -X POST "https://api.example.com/orders" \\
  -H "Content-Type: application/json" \\
  -d '{"product_id": 123, "quantity": 2}'`}
                value={sampleRequests}
                onChange={(e) => setSampleRequests(e.target.value)}
                rows={10}
                disabled={isGenerating}
              />
            </div>
            
            <Button 
              onClick={generateFromSamples}
              disabled={!sampleRequests || isGenerating}
              className="w-full"
            >
              {isGenerating ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Generating...
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 mr-2" />
                  Generate Integration
                </>
              )}
            </Button>
          </TabsContent>
        </Tabs>
      </Card>

      {/* Generation Progress */}
      {renderGenerationProgress()}
    </div>
  );
}
