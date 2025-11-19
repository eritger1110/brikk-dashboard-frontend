import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import {
  Bell,
  CheckCircle,
  AlertTriangle,
  DollarSign,
  MessageSquare,
  Workflow,
  X,
  Settings
} from 'lucide-react';

interface Notification {
  id: string;
  type: 'success' | 'warning' | 'info' | 'mention';
  title: string;
  message: string;
  timestamp: Date;
  read: boolean;
  actionUrl?: string;
}

export default function NotificationCenter() {
  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);

  // Mock notifications (replace with real-time API)
  useEffect(() => {
    const mockNotifications: Notification[] = [
      {
        id: '1',
        type: 'success',
        title: 'Workflow Completed',
        message: 'Customer Onboarding BrikkFlow finished successfully',
        timestamp: new Date(Date.now() - 5 * 60 * 1000),
        read: false,
        actionUrl: '/BrikkFlow'
      },
      {
        id: '2',
        type: 'warning',
        title: 'Budget Alert',
        message: 'GPT-4 agent has reached 80% of monthly budget',
        timestamp: new Date(Date.now() - 15 * 60 * 1000),
        read: false,
        actionUrl: '/cost-optimization'
      },
      {
        id: '3',
        type: 'mention',
        title: 'Team Mention',
        message: '@you mentioned you in Lead Qualification BrikkFlow',
        timestamp: new Date(Date.now() - 30 * 60 * 1000),
        read: false,
        actionUrl: '/collaboration'
      },
      {
        id: '4',
        type: 'info',
        title: 'A/B Test Update',
        message: 'Variant B is winning with 94% confidence',
        timestamp: new Date(Date.now() - 60 * 60 * 1000),
        read: true,
        actionUrl: '/ab-testing'
      },
      {
        id: '5',
        type: 'success',
        title: 'Agent Installed',
        message: 'Claude 3 Opus successfully installed',
        timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
        read: true,
        actionUrl: '/marketplace'
      },
      {
        id: '6',
        type: 'warning',
        title: 'High Error Rate',
        message: 'Data Extraction agent error rate increased to 12%',
        timestamp: new Date(Date.now() - 3 * 60 * 60 * 1000),
        read: true,
        actionUrl: '/analytics'
      },
    ];

    setNotifications(mockNotifications);
    setUnreadCount(mockNotifications.filter(n => !n.read).length);

    // Simulate real-time notifications
    const interval = setInterval(() => {
      const newNotification: Notification = {
        id: Date.now().toString(),
        type: ['success', 'warning', 'info', 'mention'][Math.floor(Math.random() * 4)] as any,
        title: 'New Notification',
        message: 'This is a simulated real-time notification',
        timestamp: new Date(),
        read: false,
      };

      setNotifications(prev => [newNotification, ...prev]);
      setUnreadCount(prev => prev + 1);
    }, 60000); // Every minute

    return () => clearInterval(interval);
  }, []);

  const handleMarkAsRead = (id: string) => {
    setNotifications(prev =>
      prev.map(n => (n.id === id ? { ...n, read: true } : n))
    );
    setUnreadCount(prev => Math.max(0, prev - 1));
  };

  const handleMarkAllAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
    setUnreadCount(0);
  };

  const handleDelete = (id: string) => {
    const notification = notifications.find(n => n.id === id);
    if (notification && !notification.read) {
      setUnreadCount(prev => Math.max(0, prev - 1));
    }
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  const getIcon = (type: Notification['type']) => {
    switch (type) {
      case 'success':
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'warning':
        return <AlertTriangle className="w-4 h-4 text-yellow-500" />;
      case 'mention':
        return <MessageSquare className="w-4 h-4 text-blue-500" />;
      default:
        return <Workflow className="w-4 h-4 text-cyan-500" />;
    }
  };

  const formatTimestamp = (date: Date) => {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 1) return 'Just now';
    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    return `${days}d ago`;
  };

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="w-5 h-5" />
          {unreadCount > 0 && (
            <Badge
              variant="destructive"
              className="absolute -top-1 -right-1 h-5 w-5 p-0 flex items-center justify-center text-xs"
            >
              {unreadCount > 9 ? '9+' : unreadCount}
            </Badge>
          )}
        </Button>
      </PopoverTrigger>

      <PopoverContent className="w-96 p-0" align="end">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-border">
          <div>
            <h3 className="font-semibold">Notifications</h3>
            <p className="text-xs text-muted-foreground">
              {unreadCount} unread
            </p>
          </div>
          <div className="flex items-center gap-2">
            {unreadCount > 0 && (
              <Button
                variant="ghost"
                size="sm"
                onClick={handleMarkAllAsRead}
                className="text-xs"
              >
                Mark all read
              </Button>
            )}
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <Settings className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* Notifications List */}
        <ScrollArea className="h-[400px]">
          {notifications.length > 0 ? (
            <div className="divide-y divide-border">
              {notifications.map(notification => (
                <div
                  key={notification.id}
                  className={`p-4 hover:bg-muted/50 transition-colors ${
                    !notification.read ? 'bg-muted/30' : ''
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <div className="mt-0.5">{getIcon(notification.type)}</div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2 mb-1">
                        <h4 className="font-medium text-sm">{notification.title}</h4>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-6 w-6 flex-shrink-0"
                          onClick={() => handleDelete(notification.id)}
                        >
                          <X className="w-3 h-3" />
                        </Button>
                      </div>

                      <p className="text-sm text-muted-foreground mb-2">
                        {notification.message}
                      </p>

                      <div className="flex items-center justify-between">
                        <span className="text-xs text-muted-foreground">
                          {formatTimestamp(notification.timestamp)}
                        </span>

                        <div className="flex items-center gap-2">
                          {!notification.read && (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleMarkAsRead(notification.id)}
                              className="h-7 text-xs"
                            >
                              Mark as read
                            </Button>
                          )}
                          {notification.actionUrl && (
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => {
                                window.location.href = notification.actionUrl!;
                                setIsOpen(false);
                              }}
                              className="h-7 text-xs"
                            >
                              View
                            </Button>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-8 text-center text-muted-foreground">
              <Bell className="w-12 h-12 mx-auto mb-3 opacity-50" />
              <p className="text-sm">No notifications</p>
              <p className="text-xs mt-1">You're all caught up!</p>
            </div>
          )}
        </ScrollArea>

        {/* Footer */}
        {notifications.length > 0 && (
          <div className="p-3 border-t border-border">
            <Button
              variant="ghost"
              size="sm"
              className="w-full"
              onClick={() => {
                // Navigate to full notification history
                window.location.href = '/notifications';
                setIsOpen(false);
              }}
            >
              View all notifications
            </Button>
          </div>
        )}
      </PopoverContent>
    </Popover>
  );
}
