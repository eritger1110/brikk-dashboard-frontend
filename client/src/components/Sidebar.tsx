import { useState } from 'react';
import { Link, useLocation } from 'wouter';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  Home,
  Store,
  Wrench,
  Workflow,
  Map,
  MessageSquare,
  Play,
  Activity,
  Users,
  GitBranch,
  FlaskConical,
  BarChart3,
  DollarSign,
  Key,
  Zap,
  FileText,
  Menu,
  X,
  ChevronDown,
  ChevronRight
} from 'lucide-react';
import { APP_LOGO, APP_TITLE } from '@/const';
import NotificationCenter from './NotificationCenter';
import ThemeToggle from './ThemeToggle';

interface NavItem {
  title: string;
  href: string;
  icon: React.ReactNode;
  badge?: string;
}

interface NavSection {
  title: string;
  items: NavItem[];
}

export default function Sidebar() {
  const [location] = useLocation();
  const [isOpen, setIsOpen] = useState(false);
  const [expandedSections, setExpandedSections] = useState<Set<string>>(
    new Set(['Core Features', 'Advanced Features', 'Management'])
  );

  const navSections: NavSection[] = [
    {
      title: 'Core Features',
      items: [
        { title: 'Dashboard', href: '/', icon: <Home className="w-4 h-4" /> },
        { title: 'BrikkStore', href: '/marketplace', icon: <Store className="w-4 h-4" /> },
        { title: 'Custom Agent Builder', href: '/builder', icon: <Wrench className="w-4 h-4" />, badge: 'New' },
        { title: 'BrikkFlow Builder', href: '/BrikkFlow', icon: <Workflow className="w-4 h-4" /> },
        { title: 'BrikkTemplates', href: '/BrikkTemplates', icon: <FileText className="w-4 h-4" />, badge: 'New' },
        { title: 'Agent Configuration', href: '/config', icon: <Zap className="w-4 h-4" /> },
      ]
    },
    {
      title: 'Execution & Testing',
      items: [
        { title: 'Simulation Mode', href: '/simulation', icon: <Play className="w-4 h-4" /> },
        { title: 'A/B Testing', href: '/ab-testing', icon: <FlaskConical className="w-4 h-4" />, badge: 'New' },
        { title: 'Agent Versioning', href: '/versioning', icon: <GitBranch className="w-4 h-4" /> },
      ]
    },
    {
      title: 'Analytics & Optimization',
      items: [
        { title: 'BrikkInsights', href: '/analytics', icon: <BarChart3 className="w-4 h-4" />, badge: 'New' },
        { title: 'Monitoring Dashboard', href: '/monitoring', icon: <Activity className="w-4 h-4" /> },
        { title: 'Cost Optimization', href: '/cost-optimization', icon: <DollarSign className="w-4 h-4" />, badge: 'New' },
      ]
    },
    {
      title: 'Collaboration',
      items: [
        { title: 'Coordination Map', href: '/coordination', icon: <Map className="w-4 h-4" /> },
        { title: 'Negotiation Engine', href: '/negotiation', icon: <MessageSquare className="w-4 h-4" /> },
        { title: 'Real-time Collaboration', href: '/collaboration', icon: <Users className="w-4 h-4" />, badge: 'New' },
      ]
    },
    {
      title: 'Management',
      items: [
        { title: 'BrikkTeam', href: '/team', icon: <Users className="w-4 h-4" /> },
        { title: 'API Keys & Webhooks', href: '/api-keys', icon: <Key className="w-4 h-4" />, badge: 'New' },
      ]
    }
  ];

  const toggleSection = (title: string) => {
    setExpandedSections(prev => {
      const newSet = new Set(prev);
      if (newSet.has(title)) {
        newSet.delete(title);
      } else {
        newSet.add(title);
      }
      return newSet;
    });
  };

  const isActive = (href: string) => {
    if (href === '/') {
      return location === '/';
    }
    return location.startsWith(href);
  };

  const SidebarContent = () => (
    <div className="flex flex-col h-full">
      {/* Logo */}
      <div className="p-6 border-b border-border">
        <div className="flex items-center justify-between mb-4">
          <Link href="/" className="flex items-center gap-3">
            <img src={APP_LOGO} alt={APP_TITLE} className="w-8 h-8" />
            <span className="text-xl font-bold">{APP_TITLE}</span>
          </Link>
          <div className="flex items-center gap-2">
            <ThemeToggle />
            <NotificationCenter />
          </div>
        </div>
      </div>

      {/* Navigation */}
      <ScrollArea className="flex-1 px-3 py-4">
        <nav className="space-y-1">
          {navSections.map(section => (
            <div key={section.title} className="mb-4">
              <button
                onClick={() => toggleSection(section.title)}
                className="flex items-center justify-between w-full px-3 py-2 text-sm font-semibold text-muted-foreground hover:text-foreground transition-colors"
              >
                <span>{section.title}</span>
                {expandedSections.has(section.title) ? (
                  <ChevronDown className="w-4 h-4" />
                ) : (
                  <ChevronRight className="w-4 h-4" />
                )}
              </button>

              {expandedSections.has(section.title) && (
                <div className="mt-1 space-y-1">
                  {section.items.map(item => (
                    <Link key={item.href} href={item.href}>
                      <Button
                        variant={isActive(item.href) ? 'secondary' : 'ghost'}
                        className={`w-full justify-start gap-3 ${
                          isActive(item.href) ? 'bg-primary/10 text-primary' : ''
                        }`}
                        size="sm"
                      >
                        {item.icon}
                        <span className="flex-1 text-left">{item.title}</span>
                        {item.badge && (
                          <span className="px-2 py-0.5 text-xs font-semibold bg-primary text-primary-foreground rounded">
                            {item.badge}
                          </span>
                        )}
                      </Button>
                    </Link>
                  ))}
                </div>
              )}
            </div>
          ))}
        </nav>
      </ScrollArea>

      {/* Footer */}
      <div className="p-4 border-t border-border">
        <div className="text-xs text-muted-foreground text-center">
          © 2025 {APP_TITLE}
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* Mobile Menu Button */}
      <Button
        variant="outline"
        size="icon"
        className="fixed top-4 left-4 z-50 md:hidden"
        onClick={() => setIsOpen(!isOpen)}
      >
        {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
      </Button>

      {/* Desktop Sidebar */}
      <aside className="hidden md:flex w-64 border-r border-border bg-background h-screen sticky top-0 flex-col">
        <SidebarContent />
      </aside>

      {/* Mobile Sidebar */}
      {isOpen && (
        <>
          <div
            className="fixed inset-0 bg-background/80 backdrop-blur-sm z-40 md:hidden"
            onClick={() => setIsOpen(false)}
          />
          <aside className="fixed left-0 top-0 bottom-0 w-64 border-r border-border bg-background z-50 md:hidden flex flex-col">
            <SidebarContent />
          </aside>
        </>
      )}
    </>
  );
}
