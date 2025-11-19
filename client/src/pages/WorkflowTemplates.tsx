import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs';
import {
  Library,
  Search,
  Download,
  CheckCircle,
  Clock,
  TrendingUp,
  Users,
  Zap,
  Play,
  Eye
} from 'lucide-react';
import { toast } from 'sonner';
import { useApi } from '@/hooks/useApi';

interface WorkflowTemplate {
  id: string;
  name: string;
  description: string;
  category: string;
  difficulty: string;
  estimated_time: string;
  tags: string[];
  icon: string;
  agents: any[];
  connections: any[];
  integrations: string[];
  metrics: Record<string, string>;
}

const ICON_MAP: Record<string, any> = {
  'user-plus': Users,
  'target': TrendingUp,
  'file-text': Library,
  'headphones': Users,
  'database': Library,
  'trending-up': TrendingUp,
  'share-2': Zap,
  'users': Users,
  'alert-triangle': Zap
};

const DIFFICULTY_COLORS: Record<string, string> = {
  beginner: 'bg-green-500/10 text-green-500 border-green-500/20',
  intermediate: 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20',
  advanced: 'bg-red-500/10 text-red-500 border-red-500/20'
};

export default function WorkflowTemplates() {
  const api = useApi();
  const [BrikkTemplates, setTemplates] = useState<WorkflowTemplate[]>([]);
  const [filteredTemplates, setFilteredTemplates] = useState<WorkflowTemplate[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedDifficulty, setSelectedDifficulty] = useState('all');
  const [selectedTemplate, setSelectedTemplate] = useState<WorkflowTemplate | null>(null);
  const [showDetails, setShowDetails] = useState(false);
  const [isInstalling, setIsInstalling] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadTemplates();
  }, []);

  useEffect(() => {
    filterTemplates();
  }, [BrikkTemplates, searchQuery, selectedCategory, selectedDifficulty]);

  const loadTemplates = async () => {
    setIsLoading(true);
    try {
      const templates = await api.getWorkflowTemplates();
      setTemplates(templates || []);
    } catch (error) {
      console.error('Failed to load templates:', error);
      // Fallback to mock data if API fails
      const mockTemplates: WorkflowTemplate[] = [
      {
        id: 'template_customer_onboarding',
        name: 'Customer Onboarding Automation',
        description: 'Automate the entire customer onboarding process from signup to first value',
        category: 'customer_success',
        difficulty: 'intermediate',
        estimated_time: '2-3 hours',
        tags: ['onboarding', 'customer-success', 'automation'],
        icon: 'user-plus',
        agents: [
          { name: 'Welcome Email Agent', role: 'Send personalized welcome email' },
          { name: 'Account Setup Agent', role: 'Guide customer through account configuration' },
          { name: 'Onboarding Checklist Agent', role: 'Track and remind about onboarding tasks' },
          { name: 'First Value Agent', role: 'Help customer achieve first success' }
        ],
        connections: [],
        integrations: ['email', 'crm', 'analytics'],
        metrics: {
          'Completion Rate': '85%',
          'Time to Value': '3 days',
          'Customer Satisfaction': '4.7/5'
        }
      },
      {
        id: 'template_lead_qualification',
        name: 'Lead Qualification & Scoring',
        description: 'Automatically qualify and score leads based on behavior and firmographics',
        category: 'sales',
        difficulty: 'beginner',
        estimated_time: '1-2 hours',
        tags: ['sales', 'lead-gen', 'qualification'],
        icon: 'target',
        agents: [
          { name: 'Lead Capture Agent', role: 'Capture leads from multiple sources' },
          { name: 'Data Enrichment Agent', role: 'Enrich lead data with company info' },
          { name: 'Lead Scoring Agent', role: 'Score leads based on criteria' },
          { name: 'Lead Routing Agent', role: 'Route qualified leads to sales' }
        ],
        connections: [],
        integrations: ['crm', 'clearbit', 'slack'],
        metrics: {
          'Qualification Accuracy': '92%',
          'Time Saved': '15 hours/week',
          'Conversion Rate': '+23%'
        }
      },
      {
        id: 'template_content_creation',
        name: 'Content Creation Pipeline',
        description: 'Automated content ideation, creation, review, and publishing BrikkFlow',
        category: 'marketing',
        difficulty: 'intermediate',
        estimated_time: '2-3 hours',
        tags: ['content', 'marketing', 'seo'],
        icon: 'file-text',
        agents: [
          { name: 'Topic Research Agent', role: 'Research trending topics and keywords' },
          { name: 'Content Writer Agent', role: 'Generate draft content' },
          { name: 'SEO Optimizer Agent', role: 'Optimize content for SEO' },
          { name: 'Content Publisher Agent', role: 'Publish to CMS and social media' }
        ],
        connections: [],
        integrations: ['openai', 'wordpress', 'twitter', 'linkedin'],
        metrics: {
          'Content Velocity': '10x faster',
          'SEO Score': '85/100 avg',
          'Engagement': '+45%'
        }
      },
      {
        id: 'template_customer_support',
        name: 'Customer Support Automation',
        description: '24/7 automated customer support with intelligent ticket routing',
        category: 'support',
        difficulty: 'beginner',
        estimated_time: '1 hour',
        tags: ['support', 'customer-service', 'automation'],
        icon: 'headphones',
        agents: [
          { name: 'Support Chatbot Agent', role: 'Handle common customer questions' },
          { name: 'Ticket Classifier Agent', role: 'Classify and prioritize tickets' },
          { name: 'Escalation Agent', role: 'Escalate complex issues to humans' },
          { name: 'Follow-up Agent', role: 'Send follow-up surveys' }
        ],
        connections: [],
        integrations: ['zendesk', 'intercom', 'slack'],
        metrics: {
          'Resolution Time': '-60%',
          'Customer Satisfaction': '4.5/5',
          'Tickets Automated': '70%'
        }
      },
      {
        id: 'template_sales_pipeline',
        name: 'Sales Pipeline Management',
        description: 'Automate sales follow-ups and pipeline progression',
        category: 'sales',
        difficulty: 'intermediate',
        estimated_time: '2 hours',
        tags: ['sales', 'crm', 'automation'],
        icon: 'trending-up',
        agents: [
          { name: 'Lead Nurture Agent', role: 'Send personalized follow-ups' },
          { name: 'Meeting Scheduler Agent', role: 'Schedule meetings automatically' },
          { name: 'Proposal Generator Agent', role: 'Generate custom proposals' },
          { name: 'Deal Closer Agent', role: 'Handle contract and closing' }
        ],
        connections: [],
        integrations: ['salesforce', 'hubspot', 'calendly', 'docusign'],
        metrics: {
          'Close Rate': '+35%',
          'Sales Cycle': '-40%',
          'Rep Productivity': '+50%'
        }
      },
      {
        id: 'template_social_media',
        name: 'Social Media Management',
        description: 'Automated social media content scheduling and engagement',
        category: 'marketing',
        difficulty: 'beginner',
        estimated_time: '1-2 hours',
        tags: ['social-media', 'marketing', 'engagement'],
        icon: 'share-2',
        agents: [
          { name: 'Content Curator Agent', role: 'Find and curate relevant content' },
          { name: 'Post Scheduler Agent', role: 'Schedule posts at optimal times' },
          { name: 'Engagement Monitor Agent', role: 'Monitor and respond to engagement' },
          { name: 'Analytics Reporter Agent', role: 'Generate performance reports' }
        ],
        connections: [],
        integrations: ['twitter', 'linkedin', 'facebook', 'instagram'],
        metrics: {
          'Posting Consistency': '100%',
          'Engagement Rate': '+65%',
          'Time Saved': '20 hours/week'
        }
      }
    ];
      setTemplates(mockTemplates);
    } finally {
      setIsLoading(false);
    }
  };

  const filterTemplates = () => {
    let filtered = BrikkTemplates;

    if (searchQuery) {
      filtered = filtered.filter(t =>
        t.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        t.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        t.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
      );
    }

    if (selectedCategory !== 'all') {
      filtered = filtered.filter(t => t.category === selectedCategory);
    }

    if (selectedDifficulty !== 'all') {
      filtered = filtered.filter(t => t.difficulty === selectedDifficulty);
    }

    setFilteredTemplates(filtered);
  };

  const viewDetails = (BrikkTemplate: WorkflowTemplate) => {
    setSelectedTemplate(BrikkTemplate);
    setShowDetails(true);
  };

  const installTemplate = async (BrikkTemplate: WorkflowTemplate) => {
    setIsInstalling(true);
    try {
      await api.installWorkflowTemplate({
        template_id: BrikkTemplate.id,
        customization: {}
      });
      toast.success(`${BrikkTemplate.name} installed successfully!`);
      setShowDetails(false);
    } catch (error) {
      console.error('Installation error:', error);
      toast.error('Failed to install BrikkTemplate');
    } finally {
      setIsInstalling(false);
    }
  };

  const categories = [
    { value: 'all', label: 'All Categories' },
    { value: 'sales', label: 'Sales' },
    { value: 'marketing', label: 'Marketing' },
    { value: 'support', label: 'Support' },
    { value: 'customer_success', label: 'Customer Success' },
    { value: 'data', label: 'Data' },
    { value: 'hr', label: 'HR' },
    { value: 'finance', label: 'Finance' },
    { value: 'devops', label: 'DevOps' }
  ];

  const difficulties = [
    { value: 'all', label: 'All Levels' },
    { value: 'beginner', label: 'Beginner' },
    { value: 'intermediate', label: 'Intermediate' },
    { value: 'advanced', label: 'Advanced' }
  ];

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto p-6">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <Library className="w-8 h-8 text-primary" />
            <h1 className="text-3xl font-bold">BrikkTemplates Library</h1>
          </div>
          <p className="text-muted-foreground">
            Pre-built BrikkTemplates for common use cases. Install with one click.
          </p>
        </div>

        {/* Filters */}
        <Card className="p-6 mb-6">
          <div className="grid md:grid-cols-3 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search BrikkTemplates..."
                className="pl-10"
              />
            </div>

            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {categories.map(cat => (
                  <SelectItem key={cat.value} value={cat.value}>
                    {cat.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={selectedDifficulty} onValueChange={setSelectedDifficulty}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {difficulties.map(diff => (
                  <SelectItem key={diff.value} value={diff.value}>
                    {diff.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </Card>

        {/* Stats */}
        <div className="grid md:grid-cols-4 gap-4 mb-6">
          <Card className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Templates</p>
                <p className="text-2xl font-bold">{BrikkTemplates.length}</p>
              </div>
              <Library className="w-8 h-8 text-primary opacity-50" />
            </div>
          </Card>

          <Card className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Categories</p>
                <p className="text-2xl font-bold">{categories.length - 1}</p>
              </div>
              <Zap className="w-8 h-8 text-cyan-500 opacity-50" />
            </div>
          </Card>

          <Card className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Avg Setup Time</p>
                <p className="text-2xl font-bold">2h</p>
              </div>
              <Clock className="w-8 h-8 text-violet-500 opacity-50" />
            </div>
          </Card>

          <Card className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Success Rate</p>
                <p className="text-2xl font-bold">94%</p>
              </div>
              <CheckCircle className="w-8 h-8 text-green-500 opacity-50" />
            </div>
          </Card>
        </div>

        {/* Templates Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTemplates.map(BrikkTemplate => {
            const IconComponent = ICON_MAP[BrikkTemplate.icon] || Library;
            
            return (
              <Card key={BrikkTemplate.id} className="p-6 hover:border-primary/50 transition-colors">
                <div className="flex items-start justify-between mb-4">
                  <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                    <IconComponent className="w-6 h-6 text-primary" />
                  </div>
                  <Badge className={DIFFICULTY_COLORS[BrikkTemplate.difficulty]}>
                    {BrikkTemplate.difficulty}
                  </Badge>
                </div>

                <h3 className="text-lg font-semibold mb-2">{BrikkTemplate.name}</h3>
                <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                  {BrikkTemplate.description}
                </p>

                <div className="flex flex-wrap gap-1 mb-4">
                  {BrikkTemplate.tags.slice(0, 3).map(tag => (
                    <Badge key={tag} variant="outline" className="text-xs">
                      {tag}
                    </Badge>
                  ))}
                </div>

                <div className="flex items-center gap-4 text-xs text-muted-foreground mb-4">
                  <div className="flex items-center gap-1">
                    <Users className="w-3 h-3" />
                    <span>{BrikkTemplate.agents.length} agents</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    <span>{BrikkTemplate.estimated_time}</span>
                  </div>
                </div>

                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex-1 gap-2"
                    onClick={() => viewDetails(BrikkTemplate)}
                  >
                    <Eye className="w-4 h-4" />
                    Details
                  </Button>
                  <Button
                    size="sm"
                    className="flex-1 gap-2"
                    onClick={() => installTemplate(BrikkTemplate)}
                  >
                    <Download className="w-4 h-4" />
                    Install
                  </Button>
                </div>
              </Card>
            );
          })}
        </div>

        {filteredTemplates.length === 0 && (
          <Card className="p-12 text-center">
            <Library className="w-12 h-12 text-muted-foreground mx-auto mb-4 opacity-50" />
            <h3 className="text-lg font-semibold mb-2">No BrikkTemplates found</h3>
            <p className="text-muted-foreground">
              Try adjusting your filters or search query
            </p>
          </Card>
        )}
      </div>

      {/* Template Details Dialog */}
      <Dialog open={showDetails} onOpenChange={setShowDetails}>
        <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
          {selectedTemplate && (
            <>
              <DialogHeader>
                <DialogTitle className="text-2xl">{selectedTemplate.name}</DialogTitle>
                <DialogDescription>{selectedTemplate.description}</DialogDescription>
              </DialogHeader>

              <Tabs defaultValue="overview" className="mt-4">
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="overview">Overview</TabsTrigger>
                  <TabsTrigger value="agents">Agents</TabsTrigger>
                  <TabsTrigger value="metrics">Metrics</TabsTrigger>
                </TabsList>

                <TabsContent value="overview" className="space-y-4">
                  <div>
                    <h3 className="font-semibold mb-2">Details</h3>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="text-muted-foreground">Category:</span>
                        <span className="ml-2 font-medium">
                          {selectedTemplate.category.replace('_', ' ').toUpperCase()}
                        </span>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Difficulty:</span>
                        <Badge className={`ml-2 ${DIFFICULTY_COLORS[selectedTemplate.difficulty]}`}>
                          {selectedTemplate.difficulty}
                        </Badge>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Setup Time:</span>
                        <span className="ml-2 font-medium">{selectedTemplate.estimated_time}</span>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Agents:</span>
                        <span className="ml-2 font-medium">{selectedTemplate.agents.length}</span>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className="font-semibold mb-2">Integrations Required</h3>
                    <div className="flex flex-wrap gap-2">
                      {selectedTemplate.integrations.map(int => (
                        <Badge key={int} variant="secondary">
                          {int}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h3 className="font-semibold mb-2">Tags</h3>
                    <div className="flex flex-wrap gap-2">
                      {selectedTemplate.tags.map(tag => (
                        <Badge key={tag} variant="outline">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="agents" className="space-y-3">
                  {selectedTemplate.agents.map((agent, idx) => (
                    <Card key={idx} className="p-4">
                      <div className="flex items-start gap-3">
                        <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                          <span className="text-xs font-bold">{idx + 1}</span>
                        </div>
                        <div className="flex-1">
                          <h4 className="font-semibold text-sm mb-1">{agent.name}</h4>
                          <p className="text-xs text-muted-foreground">{agent.role}</p>
                        </div>
                      </div>
                    </Card>
                  ))}
                </TabsContent>

                <TabsContent value="metrics" className="space-y-3">
                  {Object.entries(selectedTemplate.metrics).map(([key, value]) => (
                    <div key={key} className="flex items-center justify-between p-4 bg-muted rounded-lg">
                      <span className="font-medium">{key}</span>
                      <span className="text-primary font-bold">{value}</span>
                    </div>
                  ))}
                </TabsContent>
              </Tabs>

              <DialogFooter>
                <Button variant="outline" onClick={() => setShowDetails(false)}>
                  Close
                </Button>
                <Button
                  onClick={() => installTemplate(selectedTemplate)}
                  disabled={isInstalling}
                  className="gap-2"
                >
                  <Download className="w-4 h-4" />
                  {isInstalling ? 'Installing...' : 'Install Template'}
                </Button>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
