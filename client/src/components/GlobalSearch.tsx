import { useState, useEffect, useCallback } from 'react';
import { useLocation } from 'wouter';
import {
  Dialog,
  DialogContent,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import {
  Search,
  Store,
  Workflow,
  FileText,
  Users,
  BarChart3,
  Clock,
  ArrowRight,
  Command
} from 'lucide-react';

interface SearchResult {
  id: string;
  title: string;
  description: string;
  category: 'agent' | 'workflow' | 'template' | 'page' | 'user';
  path: string;
  icon: React.ReactNode;
  badge?: string;
}

export default function GlobalSearch() {
  const [, setLocation] = useLocation();
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const [selectedIndex, setSelectedIndex] = useState(0);

  // All searchable items
  const searchableItems: SearchResult[] = [
    // Pages
    { id: 'page_home', title: 'Dashboard', description: 'Overview and quick actions', category: 'page', path: '/', icon: <BarChart3 className="w-4 h-4" /> },
    { id: 'page_marketplace', title: 'Agent Marketplace', description: 'Browse and install pre-built agents', category: 'page', path: '/marketplace', icon: <Store className="w-4 h-4" /> },
    { id: 'page_builder', title: 'Custom Agent Builder', description: 'Create custom agents with no-code interface', category: 'page', path: '/builder', icon: <Store className="w-4 h-4" />, badge: 'New' },
    { id: 'page_workflow', title: 'Workflow Builder', description: 'Design multi-agent workflows', category: 'page', path: '/workflow', icon: <Workflow className="w-4 h-4" /> },
    { id: 'page_templates', title: 'Workflow Templates', description: 'Pre-built workflow templates', category: 'page', path: '/templates', icon: <FileText className="w-4 h-4" />, badge: 'New' },
    { id: 'page_simulation', title: 'Simulation Mode', description: 'Test workflows with visual debugging', category: 'page', path: '/simulation', icon: <Workflow className="w-4 h-4" /> },
    { id: 'page_ab_testing', title: 'A/B Testing', description: 'Multi-variate testing with auto winner selection', category: 'page', path: '/ab-testing', icon: <BarChart3 className="w-4 h-4" />, badge: 'New' },
    { id: 'page_analytics', title: 'Agent Analytics', description: 'Performance tracking and ROI insights', category: 'page', path: '/analytics', icon: <BarChart3 className="w-4 h-4" />, badge: 'New' },
    { id: 'page_cost', title: 'Cost Optimization', description: 'Budget tracking and optimization recommendations', category: 'page', path: '/cost-optimization', icon: <BarChart3 className="w-4 h-4" />, badge: 'New' },
    { id: 'page_collaboration', title: 'Real-time Collaboration', description: 'Live cursors and team comments', category: 'page', path: '/collaboration', icon: <Users className="w-4 h-4" />, badge: 'New' },
    { id: 'page_api_keys', title: 'API Keys & Webhooks', description: 'Manage API credentials and webhooks', category: 'page', path: '/api-keys', icon: <Store className="w-4 h-4" />, badge: 'New' },
    
    // Agents (mock data - replace with real data from API)
    { id: 'agent_gpt4', title: 'GPT-4 Turbo', description: 'OpenAI GPT-4 Turbo agent', category: 'agent', path: '/marketplace', icon: <Store className="w-4 h-4" /> },
    { id: 'agent_claude', title: 'Claude 3 Opus', description: 'Anthropic Claude 3 Opus agent', category: 'agent', path: '/marketplace', icon: <Store className="w-4 h-4" /> },
    { id: 'agent_gemini', title: 'Gemini Pro', description: 'Google Gemini Pro agent', category: 'agent', path: '/marketplace', icon: <Store className="w-4 h-4" /> },
    
    // Workflows (mock data)
    { id: 'workflow_onboarding', title: 'Customer Onboarding', description: 'Automated customer onboarding workflow', category: 'workflow', path: '/workflow', icon: <Workflow className="w-4 h-4" /> },
    { id: 'workflow_lead', title: 'Lead Qualification', description: 'Automated lead scoring and qualification', category: 'workflow', path: '/workflow', icon: <Workflow className="w-4 h-4" /> },
    
    // Templates
    { id: 'template_onboarding', title: 'Customer Onboarding Template', description: 'Pre-built customer onboarding workflow', category: 'template', path: '/templates', icon: <FileText className="w-4 h-4" /> },
    { id: 'template_support', title: 'Customer Support Template', description: 'Automated customer support workflow', category: 'template', path: '/templates', icon: <FileText className="w-4 h-4" /> },
  ];

  // Keyboard shortcut handler
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Cmd+K or Ctrl+K
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsOpen(true);
      }

      // Escape to close
      if (e.key === 'Escape') {
        setIsOpen(false);
      }

      // Arrow navigation
      if (isOpen) {
        if (e.key === 'ArrowDown') {
          e.preventDefault();
          setSelectedIndex(prev => Math.min(prev + 1, results.length - 1));
        } else if (e.key === 'ArrowUp') {
          e.preventDefault();
          setSelectedIndex(prev => Math.max(prev - 1, 0));
        } else if (e.key === 'Enter' && results[selectedIndex]) {
          e.preventDefault();
          handleSelectResult(results[selectedIndex]);
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, results, selectedIndex]);

  // Load recent searches
  useEffect(() => {
    const saved = localStorage.getItem('brikk_recent_searches');
    if (saved) {
      setRecentSearches(JSON.parse(saved));
    }
  }, []);

  // Fuzzy search algorithm
  const fuzzySearch = useCallback((items: SearchResult[], searchQuery: string): SearchResult[] => {
    if (!searchQuery.trim()) return [];

    const lowerQuery = searchQuery.toLowerCase();
    
    return items
      .map(item => {
        const titleMatch = item.title.toLowerCase().includes(lowerQuery);
        const descMatch = item.description.toLowerCase().includes(lowerQuery);
        const categoryMatch = item.category.toLowerCase().includes(lowerQuery);
        
        // Calculate relevance score
        let score = 0;
        if (titleMatch) score += 10;
        if (descMatch) score += 5;
        if (categoryMatch) score += 3;
        
        // Exact match bonus
        if (item.title.toLowerCase() === lowerQuery) score += 20;
        
        return { ...item, score };
      })
      .filter(item => item.score > 0)
      .sort((a, b) => b.score - a.score)
      .slice(0, 10);
  }, []);

  // Search handler
  useEffect(() => {
    if (query.trim()) {
      const searchResults = fuzzySearch(searchableItems, query);
      setResults(searchResults);
      setSelectedIndex(0);
    } else {
      setResults([]);
    }
  }, [query, fuzzySearch]);

  const handleSelectResult = (result: SearchResult) => {
    // Save to recent searches
    const updated = [query, ...recentSearches.filter(s => s !== query)].slice(0, 5);
    setRecentSearches(updated);
    localStorage.setItem('brikk_recent_searches', JSON.stringify(updated));

    // Navigate
    setLocation(result.path);
    setIsOpen(false);
    setQuery('');
  };

  const categoryColors = {
    agent: 'bg-cyan-500/10 text-cyan-500',
    workflow: 'bg-green-500/10 text-green-500',
    template: 'bg-violet-500/10 text-violet-500',
    page: 'bg-blue-500/10 text-blue-500',
    user: 'bg-yellow-500/10 text-yellow-500',
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="max-w-2xl p-0 gap-0">
        {/* Search Input */}
        <div className="flex items-center gap-3 p-4 border-b border-border">
          <Search className="w-5 h-5 text-muted-foreground" />
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search agents, workflows, templates, pages..."
            className="border-0 focus-visible:ring-0 focus-visible:ring-offset-0"
            autoFocus
          />
          <div className="flex items-center gap-1 text-xs text-muted-foreground">
            <Command className="w-3 h-3" />
            <span>K</span>
          </div>
        </div>

        {/* Results */}
        <ScrollArea className="max-h-[400px]">
          {results.length > 0 ? (
            <div className="p-2">
              {results.map((result, index) => (
                <button
                  key={result.id}
                  onClick={() => handleSelectResult(result)}
                  className={`w-full flex items-center gap-3 p-3 rounded-lg text-left transition-colors ${
                    index === selectedIndex
                      ? 'bg-primary/10'
                      : 'hover:bg-muted'
                  }`}
                  onMouseEnter={() => setSelectedIndex(index)}
                >
                  <div className="w-8 h-8 rounded-md bg-muted flex items-center justify-center flex-shrink-0">
                    {result.icon}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="font-medium text-sm truncate">{result.title}</h4>
                      {result.badge && (
                        <Badge variant="outline" className="text-xs">
                          {result.badge}
                        </Badge>
                      )}
                    </div>
                    <p className="text-xs text-muted-foreground truncate">
                      {result.description}
                    </p>
                  </div>

                  <div className="flex items-center gap-2 flex-shrink-0">
                    <Badge className={categoryColors[result.category]} variant="outline">
                      {result.category}
                    </Badge>
                    <ArrowRight className="w-4 h-4 text-muted-foreground" />
                  </div>
                </button>
              ))}
            </div>
          ) : query.trim() ? (
            <div className="p-8 text-center text-muted-foreground">
              <Search className="w-12 h-12 mx-auto mb-3 opacity-50" />
              <p>No results found for "{query}"</p>
            </div>
          ) : (
            <div className="p-4">
              {/* Recent Searches */}
              {recentSearches.length > 0 && (
                <div className="mb-4">
                  <h3 className="text-xs font-semibold text-muted-foreground mb-2 px-2">
                    Recent Searches
                  </h3>
                  <div className="space-y-1">
                    {recentSearches.map((search, index) => (
                      <button
                        key={index}
                        onClick={() => setQuery(search)}
                        className="w-full flex items-center gap-2 p-2 rounded-md hover:bg-muted text-left text-sm"
                      >
                        <Clock className="w-4 h-4 text-muted-foreground" />
                        <span>{search}</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Quick Links */}
              <div>
                <h3 className="text-xs font-semibold text-muted-foreground mb-2 px-2">
                  Quick Links
                </h3>
                <div className="space-y-1">
                  {searchableItems.slice(0, 5).map(item => (
                    <button
                      key={item.id}
                      onClick={() => handleSelectResult(item)}
                      className="w-full flex items-center gap-3 p-2 rounded-md hover:bg-muted text-left"
                    >
                      <div className="w-6 h-6 rounded bg-muted flex items-center justify-center flex-shrink-0">
                        {item.icon}
                      </div>
                      <span className="text-sm">{item.title}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}
        </ScrollArea>

        {/* Footer */}
        <div className="flex items-center justify-between p-3 border-t border-border text-xs text-muted-foreground">
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1">
              <kbd className="px-1.5 py-0.5 rounded bg-muted">↑↓</kbd>
              Navigate
            </span>
            <span className="flex items-center gap-1">
              <kbd className="px-1.5 py-0.5 rounded bg-muted">↵</kbd>
              Select
            </span>
            <span className="flex items-center gap-1">
              <kbd className="px-1.5 py-0.5 rounded bg-muted">Esc</kbd>
              Close
            </span>
          </div>
          <span>{results.length} results</span>
        </div>
      </DialogContent>
    </Dialog>
  );
}
