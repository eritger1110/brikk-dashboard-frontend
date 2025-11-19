import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Zap,
  Plus,
  X,
  Play,
  Save,
  Upload,
  Download,
  Sparkles,
  CheckCircle,
  AlertCircle
} from 'lucide-react';
import { toast } from 'sonner';

interface Skill {
  id: string;
  name: string;
  description: string;
  category: string;
  icon: string;
  parameters: string[];
}

interface Integration {
  id: string;
  name: string;
  description: string;
  category: string;
  icon: string;
  auth_type: string;
}

interface PromptTemplate {
  id: string;
  name: string;
  description: string;
  template: string;
}

export default function CustomAgentBuilder() {
  const [agentName, setAgentName] = useState('');
  const [agentDescription, setAgentDescription] = useState('');
  const [selectedSkills, setSelectedSkills] = useState<string[]>([]);
  const [selectedIntegrations, setSelectedIntegrations] = useState<any[]>([]);
  const [promptTemplate, setPromptTemplate] = useState('');
  const [model, setModel] = useState('gpt-4');
  const [temperature, setTemperature] = useState(0.7);
  const [maxTokens, setMaxTokens] = useState(2000);
  const [tags, setTags] = useState<string[]>([]);
  const [currentTag, setCurrentTag] = useState('');
  
  const [skills, setSkills] = useState<Skill[]>([]);
  const [integrations, setIntegrations] = useState<Integration[]>([]);
  const [templates, setTemplates] = useState<PromptTemplate[]>([]);
  
  const [testInput, setTestInput] = useState('');
  const [testOutput, setTestOutput] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [validationResult, setValidationResult] = useState<any>(null);

  // Load libraries
  useEffect(() => {
    loadLibraries();
  }, []);

  const loadLibraries = async () => {
    try {
      // Mock data for demo
      setSkills([
        {
          id: 'skill_text_generation',
          name: 'Text Generation',
          description: 'Generate human-like text based on prompts',
          category: 'content',
          icon: 'file-text',
          parameters: ['temperature', 'max_tokens']
        },
        {
          id: 'skill_data_extraction',
          name: 'Data Extraction',
          description: 'Extract structured data from unstructured text',
          category: 'data',
          icon: 'database',
          parameters: ['schema', 'format']
        },
        {
          id: 'skill_sentiment_analysis',
          name: 'Sentiment Analysis',
          description: 'Analyze sentiment and emotions in text',
          category: 'analysis',
          icon: 'heart',
          parameters: ['granularity']
        },
        {
          id: 'skill_code_generation',
          name: 'Code Generation',
          description: 'Generate code in various programming languages',
          category: 'development',
          icon: 'code',
          parameters: ['language', 'framework']
        }
      ]);

      setIntegrations([
        {
          id: 'int_openai',
          name: 'OpenAI',
          description: 'GPT-4, GPT-3.5, and other OpenAI models',
          category: 'llm',
          icon: 'brain',
          auth_type: 'api_key'
        },
        {
          id: 'int_slack',
          name: 'Slack',
          description: 'Send messages and interact with Slack',
          category: 'communication',
          icon: 'message-square',
          auth_type: 'oauth'
        },
        {
          id: 'int_salesforce',
          name: 'Salesforce',
          description: 'Access and update Salesforce CRM data',
          category: 'crm',
          icon: 'users',
          auth_type: 'oauth'
        }
      ]);

      setTemplates([
        {
          id: 'template_customer_service',
          name: 'Customer Service Agent',
          description: 'Handle customer inquiries professionally',
          template: 'You are a helpful customer service agent. Answer the customer\'s question: {question}\n\nProvide a clear, professional response.'
        },
        {
          id: 'template_data_analyst',
          name: 'Data Analyst',
          description: 'Analyze data and provide insights',
          template: 'You are a data analyst. Analyze the following data and provide insights:\n\n{data}\n\nProvide key findings and recommendations.'
        }
      ]);
    } catch (error) {
      toast.error('Failed to load libraries');
    }
  };

  const toggleSkill = (skillId: string) => {
    setSelectedSkills(prev =>
      prev.includes(skillId)
        ? prev.filter(id => id !== skillId)
        : [...prev, skillId]
    );
  };

  const addIntegration = (integrationId: string) => {
    const integration = integrations.find(i => i.id === integrationId);
    if (integration && !selectedIntegrations.find(i => i.id === integrationId)) {
      setSelectedIntegrations([...selectedIntegrations, { ...integration, config: {} }]);
    }
  };

  const removeIntegration = (integrationId: string) => {
    setSelectedIntegrations(prev => prev.filter(i => i.id !== integrationId));
  };

  const addTag = () => {
    if (currentTag && !tags.includes(currentTag)) {
      setTags([...tags, currentTag]);
      setCurrentTag('');
    }
  };

  const removeTag = (tag: string) => {
    setTags(prev => prev.filter(t => t !== tag));
  };

  const applyTemplate = (templateId: string) => {
    const template = templates.find(t => t.id === templateId);
    if (template) {
      setPromptTemplate(template.template);
      toast.success(`Applied template: ${template.name}`);
    }
  };

  const validateAgent = async () => {
    if (!agentName) {
      toast.error('Agent name is required');
      return;
    }

    const result: { valid: boolean; errors: string[]; warnings: string[] } = {
      valid: true,
      errors: [],
      warnings: []
    };

    if (selectedSkills.length === 0) {
      result.warnings.push('No skills selected');
    }

    if (!promptTemplate) {
      result.errors.push('Prompt template is required');
      result.valid = false;
    }

    setValidationResult(result);

    if (result.valid) {
      toast.success('Agent configuration is valid!');
    } else {
      toast.error('Agent configuration has errors');
    }
  };

  const testAgent = async () => {
    if (!testInput) {
      toast.error('Please provide test input');
      return;
    }

    setIsLoading(true);
    try {
      // Simulate test execution
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      const result = {
        status: 'success',
        execution_time_ms: 1250,
        output: `Test output from ${agentName || 'Custom Agent'}:\n\nProcessed input: "${testInput}"\n\nThis is a simulated response demonstrating the agent's capabilities.`,
        tokens_used: 450,
        cost: 0.0023
      };

      setTestOutput(result);
      toast.success('Test completed successfully!');
    } catch (error) {
      toast.error('Test failed');
    } finally {
      setIsLoading(false);
    }
  };

  const saveAgent = async () => {
    await validateAgent();
    
    if (!validationResult?.valid) {
      return;
    }

    setIsLoading(true);
    try {
      // Simulate save
      await new Promise(resolve => setTimeout(resolve, 1000));
      toast.success('Agent saved successfully!');
    } catch (error) {
      toast.error('Failed to save agent');
    } finally {
      setIsLoading(false);
    }
  };

  const publishAgent = async () => {
    await validateAgent();
    
    if (!validationResult?.valid) {
      return;
    }

    setIsLoading(true);
    try {
      // Simulate publish
      await new Promise(resolve => setTimeout(resolve, 1000));
      toast.success('Agent published to marketplace!');
    } catch (error) {
      toast.error('Failed to publish agent');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto p-6">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <Sparkles className="w-8 h-8 text-primary" />
            <h1 className="text-3xl font-bold">Custom Agent Builder</h1>
          </div>
          <p className="text-muted-foreground">
            Create custom AI agents with drag-and-drop interface. No coding required.
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Main Builder */}
          <div className="lg:col-span-2 space-y-6">
            {/* Basic Info */}
            <Card className="p-6">
              <h2 className="text-xl font-semibold mb-4">Basic Information</h2>
              
              <div className="space-y-4">
                <div>
                  <Label htmlFor="name">Agent Name *</Label>
                  <Input
                    id="name"
                    value={agentName}
                    onChange={(e) => setAgentName(e.target.value)}
                    placeholder="e.g., Customer Support Assistant"
                  />
                </div>

                <div>
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    value={agentDescription}
                    onChange={(e) => setAgentDescription(e.target.value)}
                    placeholder="Describe what this agent does..."
                    rows={3}
                  />
                </div>

                <div>
                  <Label>Tags</Label>
                  <div className="flex gap-2 mb-2">
                    <Input
                      value={currentTag}
                      onChange={(e) => setCurrentTag(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && addTag()}
                      placeholder="Add tag..."
                    />
                    <Button onClick={addTag} size="sm">
                      <Plus className="w-4 h-4" />
                    </Button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {tags.map(tag => (
                      <Badge key={tag} variant="secondary" className="gap-1">
                        {tag}
                        <X
                          className="w-3 h-3 cursor-pointer"
                          onClick={() => removeTag(tag)}
                        />
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>
            </Card>

            {/* Skills & Integrations */}
            <Card className="p-6">
              <Tabs defaultValue="skills">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="skills">Skills</TabsTrigger>
                  <TabsTrigger value="integrations">Integrations</TabsTrigger>
                </TabsList>

                <TabsContent value="skills" className="space-y-4 mt-4">
                  <p className="text-sm text-muted-foreground">
                    Select the capabilities your agent will have
                  </p>
                  <div className="grid md:grid-cols-2 gap-3">
                    {skills.map(skill => (
                      <Card
                        key={skill.id}
                        className={`p-4 cursor-pointer transition-colors ${
                          selectedSkills.includes(skill.id)
                            ? 'border-primary bg-primary/5'
                            : 'hover:border-primary/50'
                        }`}
                        onClick={() => toggleSkill(skill.id)}
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <h3 className="font-semibold text-sm mb-1">{skill.name}</h3>
                            <p className="text-xs text-muted-foreground">{skill.description}</p>
                            <Badge variant="outline" className="mt-2 text-xs">
                              {skill.category}
                            </Badge>
                          </div>
                          {selectedSkills.includes(skill.id) && (
                            <CheckCircle className="w-5 h-5 text-primary flex-shrink-0" />
                          )}
                        </div>
                      </Card>
                    ))}
                  </div>
                </TabsContent>

                <TabsContent value="integrations" className="space-y-4 mt-4">
                  <div className="flex gap-2">
                    <Select onValueChange={addIntegration}>
                      <SelectTrigger>
                        <SelectValue placeholder="Add integration..." />
                      </SelectTrigger>
                      <SelectContent>
                        {integrations.map(int => (
                          <SelectItem key={int.id} value={int.id}>
                            {int.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    {selectedIntegrations.map(int => (
                      <Card key={int.id} className="p-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <h3 className="font-semibold text-sm">{int.name}</h3>
                            <p className="text-xs text-muted-foreground">{int.description}</p>
                            <Badge variant="outline" className="mt-1 text-xs">
                              {int.auth_type}
                            </Badge>
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => removeIntegration(int.id)}
                          >
                            <X className="w-4 h-4" />
                          </Button>
                        </div>
                      </Card>
                    ))}
                  </div>
                </TabsContent>
              </Tabs>
            </Card>

            {/* Prompt Configuration */}
            <Card className="p-6">
              <h2 className="text-xl font-semibold mb-4">Prompt Configuration</h2>
              
              <div className="space-y-4">
                <div>
                  <Label>Use Template (Optional)</Label>
                  <Select onValueChange={applyTemplate}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a template..." />
                    </SelectTrigger>
                    <SelectContent>
                      {templates.map(template => (
                        <SelectItem key={template.id} value={template.id}>
                          {template.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="prompt">Prompt Template *</Label>
                  <Textarea
                    id="prompt"
                    value={promptTemplate}
                    onChange={(e) => setPromptTemplate(e.target.value)}
                    placeholder="Enter your prompt template. Use {variable} for dynamic values..."
                    rows={8}
                    className="font-mono text-sm"
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    Use curly braces for variables: {'{variable_name}'}
                  </p>
                </div>

                <div className="grid md:grid-cols-3 gap-4">
                  <div>
                    <Label htmlFor="model">Model</Label>
                    <Select value={model} onValueChange={setModel}>
                      <SelectTrigger id="model">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="gpt-4">GPT-4</SelectItem>
                        <SelectItem value="gpt-3.5-turbo">GPT-3.5 Turbo</SelectItem>
                        <SelectItem value="claude-3-opus">Claude 3 Opus</SelectItem>
                        <SelectItem value="gemini-pro">Gemini Pro</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="temperature">Temperature: {temperature}</Label>
                    <input
                      type="range"
                      id="temperature"
                      min="0"
                      max="2"
                      step="0.1"
                      value={temperature}
                      onChange={(e) => setTemperature(parseFloat(e.target.value))}
                      className="w-full"
                    />
                  </div>

                  <div>
                    <Label htmlFor="maxTokens">Max Tokens</Label>
                    <Input
                      id="maxTokens"
                      type="number"
                      value={maxTokens}
                      onChange={(e) => setMaxTokens(parseInt(e.target.value))}
                    />
                  </div>
                </div>
              </div>
            </Card>

            {/* Test Agent */}
            <Card className="p-6">
              <h2 className="text-xl font-semibold mb-4">Test Agent</h2>
              
              <div className="space-y-4">
                <div>
                  <Label htmlFor="testInput">Test Input</Label>
                  <Textarea
                    id="testInput"
                    value={testInput}
                    onChange={(e) => setTestInput(e.target.value)}
                    placeholder="Enter test input..."
                    rows={4}
                  />
                </div>

                <Button onClick={testAgent} disabled={isLoading} className="gap-2">
                  <Play className="w-4 h-4" />
                  {isLoading ? 'Testing...' : 'Run Test'}
                </Button>

                {testOutput && (
                  <Card className="p-4 bg-muted">
                    <h3 className="font-semibold text-sm mb-2">Test Results</h3>
                    <pre className="text-xs whitespace-pre-wrap">{testOutput.output}</pre>
                    <div className="flex gap-4 mt-3 text-xs text-muted-foreground">
                      <span>Time: {testOutput.execution_time_ms}ms</span>
                      <span>Tokens: {testOutput.tokens_used}</span>
                      <span>Cost: ${testOutput.cost}</span>
                    </div>
                  </Card>
                )}
              </div>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Actions */}
            <Card className="p-6">
              <h2 className="text-lg font-semibold mb-4">Actions</h2>
              
              <div className="space-y-2">
                <Button onClick={validateAgent} variant="outline" className="w-full gap-2">
                  <CheckCircle className="w-4 h-4" />
                  Validate
                </Button>
                
                <Button onClick={saveAgent} className="w-full gap-2" disabled={isLoading}>
                  <Save className="w-4 h-4" />
                  Save Draft
                </Button>
                
                <Button onClick={publishAgent} className="w-full gap-2" disabled={isLoading}>
                  <Upload className="w-4 h-4" />
                  Publish to Marketplace
                </Button>

                <Button variant="outline" className="w-full gap-2">
                  <Download className="w-4 h-4" />
                  Export Config
                </Button>
              </div>
            </Card>

            {/* Validation Results */}
            {validationResult && (
              <Card className="p-6">
                <h2 className="text-lg font-semibold mb-4">Validation</h2>
                
                {validationResult.valid ? (
                  <div className="flex items-center gap-2 text-green-500">
                    <CheckCircle className="w-5 h-5" />
                    <span className="font-medium">Configuration is valid</span>
                  </div>
                ) : (
                  <div className="flex items-center gap-2 text-destructive">
                    <AlertCircle className="w-5 h-5" />
                    <span className="font-medium">Configuration has errors</span>
                  </div>
                )}

                {validationResult.errors.length > 0 && (
                  <div className="mt-3">
                    <p className="text-sm font-medium text-destructive mb-1">Errors:</p>
                    <ul className="text-xs space-y-1">
                      {validationResult.errors.map((error: string, i: number) => (
                        <li key={i} className="text-destructive">• {error}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {validationResult.warnings.length > 0 && (
                  <div className="mt-3">
                    <p className="text-sm font-medium text-yellow-500 mb-1">Warnings:</p>
                    <ul className="text-xs space-y-1">
                      {validationResult.warnings.map((warning: string, i: number) => (
                        <li key={i} className="text-yellow-500">• {warning}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </Card>
            )}

            {/* Stats */}
            <Card className="p-6">
              <h2 className="text-lg font-semibold mb-4">Configuration Summary</h2>
              
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Skills Selected</span>
                  <span className="font-medium">{selectedSkills.length}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Integrations</span>
                  <span className="font-medium">{selectedIntegrations.length}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Model</span>
                  <span className="font-medium">{model}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Tags</span>
                  <span className="font-medium">{tags.length}</span>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
