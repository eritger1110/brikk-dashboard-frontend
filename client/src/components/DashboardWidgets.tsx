import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  BarChart3,
  TrendingUp,
  DollarSign,
  Activity,
  Users,
  Zap,
  AlertTriangle,
  CheckCircle,
  Plus,
  GripVertical,
  Settings,
  X
} from 'lucide-react';

interface Widget {
  id: string;
  type: 'metric' | 'chart' | 'list' | 'action';
  title: string;
  size: 'small' | 'medium' | 'large';
  data: any;
}

const availableWidgets: Omit<Widget, 'id'>[] = [
  {
    type: 'metric',
    title: 'Active Agents',
    size: 'small',
    data: { value: 12, change: '+3', trend: 'up', icon: <Activity className="w-5 h-5" /> }
  },
  {
    type: 'metric',
    title: 'Monthly Cost',
    size: 'small',
    data: { value: '$665', change: '-12%', trend: 'down', icon: <DollarSign className="w-5 h-5" /> }
  },
  {
    type: 'metric',
    title: 'Success Rate',
    size: 'small',
    data: { value: '94.2%', change: '+2.1%', trend: 'up', icon: <TrendingUp className="w-5 h-5" /> }
  },
  {
    type: 'metric',
    title: 'Total Executions',
    size: 'small',
    data: { value: '15.4K', change: '+420', trend: 'up', icon: <Zap className="w-5 h-5" /> }
  },
  {
    type: 'list',
    title: 'Recent Workflows',
    size: 'medium',
    data: {
      items: [
        { name: 'Customer Onboarding', status: 'success', time: '2m ago' },
        { name: 'Lead Qualification', status: 'running', time: '5m ago' },
        { name: 'Data Processing', status: 'success', time: '12m ago' },
        { name: 'Content Generation', status: 'failed', time: '18m ago' },
      ]
    }
  },
  {
    type: 'list',
    title: 'Top Performing Agents',
    size: 'medium',
    data: {
      items: [
        { name: 'GPT-4 Turbo', metric: '98.5%', badge: 'success' },
        { name: 'Claude 3 Opus', metric: '96.2%', badge: 'success' },
        { name: 'Gemini Pro', metric: '94.8%', badge: 'success' },
        { name: 'Data Extractor', metric: '88.1%', badge: 'warning' },
      ]
    }
  },
  {
    type: 'list',
    title: 'Budget Alerts',
    size: 'medium',
    data: {
      items: [
        { name: 'GPT-4 Turbo', message: '80% of budget used', severity: 'warning' },
        { name: 'Claude 3 Opus', message: '65% of budget used', severity: 'info' },
      ]
    }
  },
  {
    type: 'action',
    title: 'Quick Actions',
    size: 'medium',
    data: {
      actions: [
        { label: 'Create Workflow', icon: <Plus className="w-4 h-4" />, href: '/BrikkFlow' },
        { label: 'Install Agent', icon: <Plus className="w-4 h-4" />, href: '/marketplace' },
        { label: 'Run Simulation', icon: <Zap className="w-4 h-4" />, href: '/simulation' },
        { label: 'View Analytics', icon: <BarChart3 className="w-4 h-4" />, href: '/analytics' },
      ]
    }
  },
  {
    type: 'chart',
    title: 'Execution Trends',
    size: 'large',
    data: {
      values: [120, 145, 132, 168, 155, 178, 165]
    }
  },
];

export default function DashboardWidgets() {
  const [widgets, setWidgets] = useState<Widget[]>([
    { ...availableWidgets[0], id: '1' },
    { ...availableWidgets[1], id: '2' },
    { ...availableWidgets[2], id: '3' },
    { ...availableWidgets[3], id: '4' },
    { ...availableWidgets[4], id: '5' },
    { ...availableWidgets[5], id: '6' },
  ]);

  const [isCustomizing, setIsCustomizing] = useState(false);

  const handleRemoveWidget = (id: string) => {
    setWidgets(prev => prev.filter(w => w.id !== id));
  };

  const handleAddWidget = (widget: Omit<Widget, 'id'>) => {
    const newWidget = { ...widget, id: Date.now().toString() };
    setWidgets(prev => [...prev, newWidget]);
  };

  const renderMetricWidget = (widget: Widget) => (
    <Card className="p-6 relative group">
      {isCustomizing && (
        <Button
          variant="ghost"
          size="icon"
          className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
          onClick={() => handleRemoveWidget(widget.id)}
        >
          <X className="w-4 h-4" />
        </Button>
      )}
      <div className="flex items-start justify-between mb-4">
        <div className="p-2 rounded-lg bg-primary/10 text-primary">
          {widget.data.icon}
        </div>
        {isCustomizing && (
          <GripVertical className="w-5 h-5 text-muted-foreground cursor-move" />
        )}
      </div>
      <div className="space-y-1">
        <p className="text-sm text-muted-foreground">{widget.title}</p>
        <div className="flex items-baseline gap-2">
          <h3 className="text-3xl font-bold">{widget.data.value}</h3>
          <Badge
            variant="outline"
            className={
              widget.data.trend === 'up'
                ? 'text-green-500 border-green-500'
                : 'text-red-500 border-red-500'
            }
          >
            {widget.data.change}
          </Badge>
        </div>
      </div>
    </Card>
  );

  const renderListWidget = (widget: Widget) => (
    <Card className="p-6 relative group">
      {isCustomizing && (
        <>
          <Button
            variant="ghost"
            size="icon"
            className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
            onClick={() => handleRemoveWidget(widget.id)}
          >
            <X className="w-4 h-4" />
          </Button>
          <GripVertical className="absolute top-2 right-10 w-5 h-5 text-muted-foreground cursor-move opacity-0 group-hover:opacity-100 transition-opacity" />
        </>
      )}
      <h3 className="font-semibold mb-4">{widget.title}</h3>
      <div className="space-y-3">
        {widget.data.items.map((item: any, index: number) => (
          <div key={index} className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              {item.status === 'success' && <CheckCircle className="w-4 h-4 text-green-500" />}
              {item.status === 'running' && <Activity className="w-4 h-4 text-blue-500 animate-pulse" />}
              {item.status === 'failed' && <AlertTriangle className="w-4 h-4 text-red-500" />}
              {item.severity === 'warning' && <AlertTriangle className="w-4 h-4 text-yellow-500" />}
              {item.severity === 'info' && <Activity className="w-4 h-4 text-blue-500" />}
              {item.badge === 'success' && <CheckCircle className="w-4 h-4 text-green-500" />}
              {item.badge === 'warning' && <AlertTriangle className="w-4 h-4 text-yellow-500" />}
              <span className="text-sm">{item.name}</span>
            </div>
            <span className="text-sm text-muted-foreground">
              {item.time || item.metric || item.message}
            </span>
          </div>
        ))}
      </div>
    </Card>
  );

  const renderActionWidget = (widget: Widget) => (
    <Card className="p-6 relative group">
      {isCustomizing && (
        <>
          <Button
            variant="ghost"
            size="icon"
            className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
            onClick={() => handleRemoveWidget(widget.id)}
          >
            <X className="w-4 h-4" />
          </Button>
          <GripVertical className="absolute top-2 right-10 w-5 h-5 text-muted-foreground cursor-move opacity-0 group-hover:opacity-100 transition-opacity" />
        </>
      )}
      <h3 className="font-semibold mb-4">{widget.title}</h3>
      <div className="grid grid-cols-2 gap-2">
        {widget.data.actions.map((action: any, index: number) => (
          <Button
            key={index}
            variant="outline"
            className="justify-start gap-2"
            onClick={() => window.location.href = action.href}
          >
            {action.icon}
            {action.label}
          </Button>
        ))}
      </div>
    </Card>
  );

  const renderChartWidget = (widget: Widget) => (
    <Card className="p-6 relative group">
      {isCustomizing && (
        <>
          <Button
            variant="ghost"
            size="icon"
            className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
            onClick={() => handleRemoveWidget(widget.id)}
          >
            <X className="w-4 h-4" />
          </Button>
          <GripVertical className="absolute top-2 right-10 w-5 h-5 text-muted-foreground cursor-move opacity-0 group-hover:opacity-100 transition-opacity" />
        </>
      )}
      <h3 className="font-semibold mb-4">{widget.title}</h3>
      <div className="h-40 flex items-end gap-2">
        {widget.data.values.map((value: number, index: number) => (
          <div
            key={index}
            className="flex-1 bg-primary/20 rounded-t"
            style={{ height: `${(value / 200) * 100}%` }}
          />
        ))}
      </div>
    </Card>
  );

  const renderWidget = (widget: Widget) => {
    switch (widget.type) {
      case 'metric':
        return renderMetricWidget(widget);
      case 'list':
        return renderListWidget(widget);
      case 'action':
        return renderActionWidget(widget);
      case 'chart':
        return renderChartWidget(widget);
      default:
        return null;
    }
  };

  const getGridClass = (size: string) => {
    switch (size) {
      case 'small':
        return 'col-span-1';
      case 'medium':
        return 'col-span-1 md:col-span-2';
      case 'large':
        return 'col-span-1 md:col-span-3';
      default:
        return 'col-span-1';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Dashboard</h1>
          <p className="text-muted-foreground">Welcome back! Here's your overview.</p>
        </div>
        <Button
          variant={isCustomizing ? 'default' : 'outline'}
          onClick={() => setIsCustomizing(!isCustomizing)}
          className="gap-2"
        >
          <Settings className="w-4 h-4" />
          {isCustomizing ? 'Done' : 'Customize'}
        </Button>
      </div>

      {/* Add Widget Panel */}
      {isCustomizing && (
        <Card className="p-4">
          <h3 className="font-semibold mb-3">Add Widgets</h3>
          <div className="flex flex-wrap gap-2">
            {availableWidgets
              .filter(w => !widgets.some(existing => existing.title === w.title))
              .map((widget, index) => (
                <Button
                  key={index}
                  variant="outline"
                  size="sm"
                  onClick={() => handleAddWidget(widget)}
                  className="gap-2"
                >
                  <Plus className="w-3 h-3" />
                  {widget.title}
                </Button>
              ))}
          </div>
        </Card>
      )}

      {/* Widgets Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {widgets.map(widget => (
          <div key={widget.id} className={getGridClass(widget.size)}>
            {renderWidget(widget)}
          </div>
        ))}
      </div>
    </div>
  );
}
