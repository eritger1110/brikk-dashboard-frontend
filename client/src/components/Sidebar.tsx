import { useState } from 'react';
import { Link, useLocation } from 'wouter';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  LayoutDashboard,
  Bot,
  GitBranch,
  Store,
  BarChart3,
  Activity,
  CreditCard,
  Shield,
  Code,
  Users,
  Settings,
  HelpCircle,
  Menu,
  X,
  ChevronDown,
  ChevronRight
} from 'lucide-react';
import { APP_TITLE } from '@/const';
import NotificationCenter from './NotificationCenter';
import ThemeToggle from './ThemeToggle';
import BrikkLogo from './BrikkLogo';

interface NavItem {
  title: string;
  href: string;
  icon: React.ReactNode;
  badge?: string;
  children?: NavItem[];
}

export default function Sidebar() {
  const [location] = useLocation();
  const [isOpen, setIsOpen] = useState(false);
  const [expandedItems, setExpandedItems] = useState<Set<string>>(
    new Set(['Agents', 'Workflows', 'Marketplace', 'Security', 'Developer'])
  );

  const navItems: NavItem[] = [
    { 
      title: 'Overview', 
      href: '/dashboard', 
      icon: <LayoutDashboard className="w-4 h-4" /> 
    },
    { 
      title: 'Agents', 
      href: '/agents', 
      icon: <Bot className="w-4 h-4" />,
      children: [
        { title: 'All Agents', href: '/agents', icon: null },
        { title: 'Network Map', href: '/agents/map', icon: null },
        { title: 'Create Agent', href: '/agents/builder', icon: null, badge: 'New' },
      ]
    },
    { 
      title: 'Workflows', 
      href: '/workflows', 
      icon: <GitBranch className="w-4 h-4" />,
      children: [
        { title: 'All Workflows', href: '/workflows', icon: null },
        { title: 'Builder', href: '/workflows/builder', icon: null },
        { title: 'Templates', href: '/workflows/templates', icon: null },
      ]
    },
    { 
      title: 'Marketplace', 
      href: '/marketplace', 
      icon: <Store className="w-4 h-4" />,
      children: [
        { title: 'Browse', href: '/marketplace', icon: null },
        { title: 'Build Integration', href: '/marketplace/builder', icon: null, badge: 'New' },
      ]
    },
    { 
      title: 'Analytics', 
      href: '/analytics', 
      icon: <BarChart3 className="w-4 h-4" /> 
    },
    { 
      title: 'Monitoring', 
      href: '/monitoring', 
      icon: <Activity className="w-4 h-4" /> 
    },
    { 
      title: 'Billing', 
      href: '/billing', 
      icon: <CreditCard className="w-4 h-4" /> 
    },
    { 
      title: 'Security', 
      href: '/security', 
      icon: <Shield className="w-4 h-4" />,
      children: [
        { title: 'Overview', href: '/security', icon: null },
        { title: 'Audit Logs', href: '/security/audit-logs', icon: null },
        { title: 'Roles', href: '/security/roles', icon: null },
      ]
    },
    { 
      title: 'Developer', 
      href: '/developer', 
      icon: <Code className="w-4 h-4" />,
      children: [
        { title: 'Overview', href: '/developer', icon: null },
        { title: 'Portal', href: '/developer/portal', icon: null },
      ]
    },
    { 
      title: 'Team', 
      href: '/team', 
      icon: <Users className="w-4 h-4" /> 
    },
    { 
      title: 'Settings', 
      href: '/settings', 
      icon: <Settings className="w-4 h-4" /> 
    },
    { 
      title: 'Help', 
      href: '/help', 
      icon: <HelpCircle className="w-4 h-4" /> 
    },
  ];

  const toggleItem = (title: string) => {
    setExpandedItems(prev => {
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
    if (href === '/dashboard') {
      return location === '/' || location === '/dashboard';
    }
    return location === href || location.startsWith(href + '/');
  };

  const renderNavItem = (item: NavItem, isChild = false) => {
    const active = isActive(item.href);
    const hasChildren = item.children && item.children.length > 0;
    const isExpanded = expandedItems.has(item.title);

    return (
      <div key={item.href}>
        <Link href={item.href}>
          <Button
            variant="ghost"
            className={`w-full justify-start ${isChild ? 'pl-8' : ''} ${
              active ? 'bg-primary/10 text-primary' : 'text-muted-foreground hover:text-foreground'
            }`}
            onClick={(e) => {
              if (hasChildren) {
                e.preventDefault();
                toggleItem(item.title);
              }
            }}
          >
            {item.icon}
            <span className="ml-2 flex-1 text-left">{item.title}</span>
            {item.badge && (
              <span className="ml-2 px-1.5 py-0.5 text-xs bg-primary/20 text-primary rounded">
                {item.badge}
              </span>
            )}
            {hasChildren && (
              isExpanded ? 
                <ChevronDown className="w-4 h-4 ml-auto" /> : 
                <ChevronRight className="w-4 h-4 ml-auto" />
            )}
          </Button>
        </Link>
        {hasChildren && isExpanded && (
          <div className="mt-1 space-y-1">
            {item.children!.map(child => renderNavItem(child, true))}
          </div>
        )}
      </div>
    );
  };

  return (
    <>
      {/* Mobile menu button */}
      <Button
        variant="ghost"
        size="icon"
        className="fixed top-4 left-4 z-50 lg:hidden"
        onClick={() => setIsOpen(!isOpen)}
      >
        {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
      </Button>

      {/* Sidebar */}
      <aside
        className={`
          fixed top-0 left-0 z-40 h-screen w-64 bg-card border-r border-border
          transition-transform duration-300 ease-in-out
          ${isOpen ? 'translate-x-0' : '-translate-x-full'}
          lg:translate-x-0
        `}
      >
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-border">
            <Link href="/dashboard">
              <div className="flex items-center gap-2 cursor-pointer">
                <BrikkLogo className="w-8 h-8" />
                <span className="text-xl font-bold bg-gradient-to-r from-[#0057FF] to-[#00C2FF] bg-clip-text text-transparent">
                  {APP_TITLE}
                </span>
              </div>
            </Link>
          </div>

          {/* Navigation */}
          <ScrollArea className="flex-1 px-3 py-4">
            <nav className="space-y-1">
              {navItems.map(item => renderNavItem(item))}
            </nav>
          </ScrollArea>

          {/* Footer */}
          <div className="p-4 border-t border-border space-y-2">
            <div className="flex items-center justify-between">
              <NotificationCenter />
              <ThemeToggle />
            </div>
          </div>
        </div>
      </aside>

      {/* Overlay for mobile */}
      {isOpen && (
        <div
          className="fixed inset-0 z-30 bg-background/80 backdrop-blur-sm lg:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}
    </>
  );
}
