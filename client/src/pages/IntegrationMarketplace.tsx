import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { 
  Search, Filter, Download, Star, Users, 
  CheckCircle2, ExternalLink, Zap, TrendingUp 
} from 'lucide-react';
import { toast } from 'sonner';

/**
 * Integration Marketplace
 * 
 * Browse, search, and install integrations
 */

interface Integration {
  id: string;
  name: string;
  slug: string;
  description: string;
  category: string;
  icon: string;
  version: string;
  installCount: number;
  rating: number;
  ratingCount: number;
  tags: string[];
  isInstalled: boolean;
  isPremium: boolean;
}

// Mock data - will be replaced with API calls
const mockIntegrations: Integration[] = [
  {
    id: '1',
    name: 'Shopify',
    slug: 'shopify',
    description: 'E-commerce platform for online stores and retail point-of-sale systems',
    category: 'E-commerce',
    icon: '🛒',
    version: '2.1.0',
    installCount: 15420,
    rating: 4.8,
    ratingCount: 892,
    tags: ['ecommerce', 'retail', 'payments'],
    isInstalled: true,
    isPremium: false,
  },
  {
    id: '2',
    name: 'Salesforce',
    slug: 'salesforce',
    description: 'Customer relationship management (CRM) platform for sales and marketing',
    category: 'CRM',
    icon: '☁️',
    version: '3.0.1',
    installCount: 23150,
    rating: 4.7,
    ratingCount: 1245,
    tags: ['crm', 'sales', 'marketing'],
    isInstalled: false,
    isPremium: false,
  },
  {
    id: '3',
    name: 'NetSuite',
    slug: 'netsuite',
    description: 'Cloud-based ERP system for financial management and business operations',
    category: 'ERP',
    icon: '🏢',
    version: '1.5.2',
    installCount: 8920,
    rating: 4.6,
    ratingCount: 456,
    tags: ['erp', 'finance', 'accounting'],
    isInstalled: false,
    isPremium: true,
  },
  {
    id: '4',
    name: 'Stripe',
    slug: 'stripe',
    description: 'Payment processing platform for online and mobile commerce',
    category: 'Finance',
    icon: '💳',
    version: '4.2.0',
    installCount: 31250,
    rating: 4.9,
    ratingCount: 2103,
    tags: ['payments', 'finance', 'billing'],
    isInstalled: true,
    isPremium: false,
  },
  {
    id: '5',
    name: 'ShipBob',
    slug: 'shipbob',
    description: 'Fulfillment and logistics platform for e-commerce businesses',
    category: 'Logistics',
    icon: '📦',
    version: '2.0.3',
    installCount: 6780,
    rating: 4.5,
    ratingCount: 234,
    tags: ['logistics', 'shipping', 'fulfillment'],
    isInstalled: false,
    isPremium: false,
  },
  {
    id: '6',
    name: 'Gmail',
    slug: 'gmail',
    description: 'Email service by Google with powerful search and organization features',
    category: 'Communication',
    icon: '📧',
    version: '1.8.0',
    installCount: 45620,
    rating: 4.8,
    ratingCount: 3421,
    tags: ['email', 'communication', 'google'],
    isInstalled: true,
    isPremium: false,
  },
  {
    id: '7',
    name: 'SAP',
    slug: 'sap',
    description: 'Enterprise resource planning software for large organizations',
    category: 'ERP',
    icon: '🏭',
    version: '5.1.0',
    installCount: 12340,
    rating: 4.4,
    ratingCount: 678,
    tags: ['erp', 'enterprise', 'manufacturing'],
    isInstalled: false,
    isPremium: true,
  },
  {
    id: '8',
    name: 'Oracle',
    slug: 'oracle',
    description: 'Database and cloud solutions for enterprise applications',
    category: 'Database',
    icon: '🗄️',
    version: '3.5.1',
    installCount: 9870,
    rating: 4.3,
    ratingCount: 543,
    tags: ['database', 'cloud', 'enterprise'],
    isInstalled: false,
    isPremium: true,
  },
];

const categories = [
  'All',
  'CRM',
  'ERP',
  'E-commerce',
  'Logistics',
  'Finance',
  'Communication',
  'Marketing',
  'Analytics',
  'HR',
  'Healthcare',
];

export default function IntegrationMarketplace() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [integrations] = useState<Integration[]>(mockIntegrations);

  const filteredIntegrations = integrations.filter(integration => {
    const matchesSearch = integration.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         integration.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         integration.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    
    const matchesCategory = selectedCategory === 'All' || integration.category === selectedCategory;
    
    return matchesSearch && matchesCategory;
  });

  const handleInstall = async (integration: Integration) => {
    if (integration.isInstalled) {
      toast.info(`${integration.name} is already installed`);
      return;
    }

    toast.promise(
      new Promise(resolve => setTimeout(resolve, 2000)),
      {
        loading: `Installing ${integration.name}...`,
        success: `${integration.name} installed successfully!`,
        error: `Failed to install ${integration.name}`,
      }
    );
  };

  const handleUninstall = async (integration: Integration) => {
    if (!integration.isInstalled) {
      return;
    }

    toast.promise(
      new Promise(resolve => setTimeout(resolve, 1500)),
      {
        loading: `Uninstalling ${integration.name}...`,
        success: `${integration.name} uninstalled`,
        error: `Failed to uninstall ${integration.name}`,
      }
    );
  };

  return (
    <div className="container mx-auto py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Integration Marketplace</h1>
        <p className="text-muted-foreground">
          Connect Brikk agents to thousands of external systems
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-primary/10 rounded-lg">
              <Zap className="w-5 h-5 text-primary" />
            </div>
            <div>
              <div className="text-2xl font-bold">{integrations.length}</div>
              <div className="text-sm text-muted-foreground">Available</div>
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-green-500/10 rounded-lg">
              <CheckCircle2 className="w-5 h-5 text-green-500" />
            </div>
            <div>
              <div className="text-2xl font-bold">
                {integrations.filter(i => i.isInstalled).length}
              </div>
              <div className="text-sm text-muted-foreground">Installed</div>
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-500/10 rounded-lg">
              <Users className="w-5 h-5 text-blue-500" />
            </div>
            <div>
              <div className="text-2xl font-bold">
                {Math.round(integrations.reduce((sum, i) => sum + i.installCount, 0) / 1000)}k
              </div>
              <div className="text-sm text-muted-foreground">Total Installs</div>
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-yellow-500/10 rounded-lg">
              <TrendingUp className="w-5 h-5 text-yellow-500" />
            </div>
            <div>
              <div className="text-2xl font-bold">
                {(integrations.reduce((sum, i) => sum + i.rating, 0) / integrations.length).toFixed(1)}
              </div>
              <div className="text-sm text-muted-foreground">Avg Rating</div>
            </div>
          </div>
        </Card>
      </div>

      {/* Search and Filter */}
      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search integrations..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>

        <div className="flex gap-2 overflow-x-auto pb-2">
          {categories.map(category => (
            <Button
              key={category}
              variant={selectedCategory === category ? 'default' : 'outline'}
              size="sm"
              onClick={() => setSelectedCategory(category)}
              className="whitespace-nowrap"
            >
              {category}
            </Button>
          ))}
        </div>
      </div>

      {/* Integration Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredIntegrations.map(integration => (
          <Card key={integration.id} className="p-6 hover:shadow-lg transition-shadow">
            {/* Header */}
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="text-4xl">{integration.icon}</div>
                <div>
                  <h3 className="font-semibold text-lg">{integration.name}</h3>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <span>v{integration.version}</span>
                    {integration.isPremium && (
                      <Badge variant="secondary" className="text-xs">Premium</Badge>
                    )}
                  </div>
                </div>
              </div>
              
              {integration.isInstalled && (
                <CheckCircle2 className="w-5 h-5 text-green-500" />
              )}
            </div>

            {/* Description */}
            <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
              {integration.description}
            </p>

            {/* Stats */}
            <div className="flex items-center gap-4 mb-4 text-sm">
              <div className="flex items-center gap-1">
                <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                <span className="font-medium">{integration.rating}</span>
                <span className="text-muted-foreground">({integration.ratingCount})</span>
              </div>
              
              <div className="flex items-center gap-1 text-muted-foreground">
                <Download className="w-4 h-4" />
                <span>{(integration.installCount / 1000).toFixed(1)}k</span>
              </div>
            </div>

            {/* Tags */}
            <div className="flex flex-wrap gap-2 mb-4">
              {integration.tags.slice(0, 3).map(tag => (
                <Badge key={tag} variant="outline" className="text-xs">
                  {tag}
                </Badge>
              ))}
            </div>

            {/* Actions */}
            <div className="flex gap-2">
              {integration.isInstalled ? (
                <>
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex-1"
                    onClick={() => handleUninstall(integration)}
                  >
                    Uninstall
                  </Button>
                  <Button
                    variant="default"
                    size="sm"
                    className="flex-1"
                  >
                    <ExternalLink className="w-4 h-4 mr-2" />
                    Configure
                  </Button>
                </>
              ) : (
                <>
                  <Button
                    variant="default"
                    size="sm"
                    className="flex-1"
                    onClick={() => handleInstall(integration)}
                  >
                    <Download className="w-4 h-4 mr-2" />
                    Install
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex-1"
                  >
                    Details
                  </Button>
                </>
              )}
            </div>
          </Card>
        ))}
      </div>

      {/* Empty State */}
      {filteredIntegrations.length === 0 && (
        <Card className="p-12 text-center">
          <Filter className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-semibold mb-2">No integrations found</h3>
          <p className="text-muted-foreground mb-4">
            Try adjusting your search or filters
          </p>
          <Button
            variant="outline"
            onClick={() => {
              setSearchQuery('');
              setSelectedCategory('All');
            }}
          >
            Clear Filters
          </Button>
        </Card>
      )}
    </div>
  );
}
