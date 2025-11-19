import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
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
  Users,
  MessageSquare,
  Activity,
  Eye,
  Edit3,
  CheckCircle,
  Clock,
  Zap,
  Send,
  AtSign
} from 'lucide-react';
import { toast } from 'sonner';

interface OnlineUser {
  id: string;
  name: string;
  email: string;
  status: string;
  current_page: string | null;
  color: string;
}

interface Comment {
  id: string;
  user_name: string;
  user_color: string;
  content: string;
  timestamp: string;
  resolved: boolean;
  replies: Comment[];
}

interface ActivityEvent {
  id: string;
  user_name: string;
  event_type: string;
  description: string;
  timestamp: string;
}

export default function RealtimeCollaboration() {
  const [showCommentDialog, setShowCommentDialog] = useState(false);
  const [newComment, setNewComment] = useState('');

  const [onlineUsers] = useState<OnlineUser[]>([
    {
      id: 'user_001',
      name: 'Sarah Chen',
      email: 'sarah@company.com',
      status: 'online',
      current_page: 'Workflow Builder',
      color: '#3b82f6'
    },
    {
      id: 'user_002',
      name: 'Mike Johnson',
      email: 'mike@company.com',
      status: 'online',
      current_page: 'Agent Marketplace',
      color: '#10b981'
    },
    {
      id: 'user_003',
      name: 'Emily Rodriguez',
      email: 'emily@company.com',
      status: 'online',
      current_page: 'Workflow Builder',
      color: '#f59e0b'
    },
    {
      id: 'user_004',
      name: 'David Kim',
      email: 'david@company.com',
      status: 'away',
      current_page: null,
      color: '#8b5cf6'
    }
  ]);

  const [comments] = useState<Comment[]>([
    {
      id: 'comment_001',
      user_name: 'Sarah Chen',
      user_color: '#3b82f6',
      content: 'Should we add error handling for the API call in this node?',
      timestamp: '2025-01-18T14:30:00Z',
      resolved: false,
      replies: [
        {
          id: 'reply_001',
          user_name: 'Mike Johnson',
          user_color: '#10b981',
          content: 'Good point! I\'ll add a try-catch block.',
          timestamp: '2025-01-18T14:35:00Z',
          resolved: false,
          replies: []
        }
      ]
    },
    {
      id: 'comment_002',
      user_name: 'Emily Rodriguez',
      user_color: '#f59e0b',
      content: 'The timeout for this agent seems too short. Can we increase it to 30s?',
      timestamp: '2025-01-18T15:00:00Z',
      resolved: true,
      replies: []
    },
    {
      id: 'comment_003',
      user_name: 'David Kim',
      user_color: '#8b5cf6',
      content: '@sarah Can you review the data transformation logic here?',
      timestamp: '2025-01-18T15:15:00Z',
      resolved: false,
      replies: []
    }
  ]);

  const [activityFeed] = useState<ActivityEvent[]>([
    {
      id: 'activity_001',
      user_name: 'Sarah Chen',
      event_type: 'workflow_updated',
      description: 'Updated "Customer Onboarding" BrikkFlow',
      timestamp: '2025-01-18T15:30:00Z'
    },
    {
      id: 'activity_002',
      user_name: 'Mike Johnson',
      event_type: 'agent_installed',
      description: 'Installed "Claude 3 Opus" agent',
      timestamp: '2025-01-18T15:25:00Z'
    },
    {
      id: 'activity_003',
      user_name: 'Emily Rodriguez',
      event_type: 'test_started',
      description: 'Started A/B test "GPT-4 vs Claude"',
      timestamp: '2025-01-18T15:20:00Z'
    },
    {
      id: 'activity_004',
      user_name: 'David Kim',
      event_type: 'comment_added',
      description: 'Commented on "Lead Qualification" BrikkFlow',
      timestamp: '2025-01-18T15:15:00Z'
    },
    {
      id: 'activity_005',
      user_name: 'Sarah Chen',
      event_type: 'workflow_created',
      description: 'Created new BrikkFlow "Data Processing Pipeline"',
      timestamp: '2025-01-18T15:10:00Z'
    }
  ]);

  const eventIcons = {
    workflow_updated: <Edit3 className="w-4 h-4 text-blue-500" />,
    workflow_created: <Zap className="w-4 h-4 text-green-500" />,
    agent_installed: <CheckCircle className="w-4 h-4 text-cyan-500" />,
    test_started: <Activity className="w-4 h-4 text-violet-500" />,
    comment_added: <MessageSquare className="w-4 h-4 text-yellow-500" />
  };

  const addComment = () => {
    toast.success('Comment added');
    setNewComment('');
    setShowCommentDialog(false);
  };

  const resolveComment = (commentId: string) => {
    toast.success('Comment resolved');
  };

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / 60000);
    
    if (minutes < 1) return 'Just now';
    if (minutes < 60) return `${minutes}m ago`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours}h ago`;
    return date.toLocaleDateString();
  };

  const onlineCount = onlineUsers.filter(u => u.status === 'online').length;
  const unresolvedComments = comments.filter(c => !c.resolved).length;

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto p-6">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <Users className="w-8 h-8 text-primary" />
            <h1 className="text-3xl font-bold">Real-time Collaboration</h1>
          </div>
          <p className="text-muted-foreground">
            Work together with your team in real-time
          </p>
        </div>

        {/* Stats */}
        <div className="grid md:grid-cols-4 gap-4 mb-6">
          <Card className="p-6">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm text-muted-foreground">Online Now</p>
              <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse" />
            </div>
            <p className="text-3xl font-bold">{onlineCount}</p>
            <p className="text-xs text-muted-foreground mt-1">team members</p>
          </Card>

          <Card className="p-6">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm text-muted-foreground">Active Comments</p>
              <MessageSquare className="w-5 h-5 text-yellow-500" />
            </div>
            <p className="text-3xl font-bold">{unresolvedComments}</p>
            <p className="text-xs text-muted-foreground mt-1">unresolved</p>
          </Card>

          <Card className="p-6">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm text-muted-foreground">Recent Activity</p>
              <Activity className="w-5 h-5 text-cyan-500" />
            </div>
            <p className="text-3xl font-bold">{activityFeed.length}</p>
            <p className="text-xs text-muted-foreground mt-1">last hour</p>
          </Card>

          <Card className="p-6">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm text-muted-foreground">Active Sessions</p>
              <Eye className="w-5 h-5 text-violet-500" />
            </div>
            <p className="text-3xl font-bold">3</p>
            <p className="text-xs text-muted-foreground mt-1">BrikkFlows</p>
          </Card>
        </div>

        <Tabs defaultValue="presence" className="space-y-6">
          <TabsList>
            <TabsTrigger value="presence">Team Presence</TabsTrigger>
            <TabsTrigger value="comments">Comments</TabsTrigger>
            <TabsTrigger value="activity">Activity Feed</TabsTrigger>
          </TabsList>

          {/* Team Presence Tab */}
          <TabsContent value="presence" className="space-y-4">
            <Card className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold">Team Members</h2>
                <Badge variant="outline">{onlineCount} online</Badge>
              </div>

              <div className="space-y-3">
                {onlineUsers.map(user => (
                  <Card key={user.id} className="p-4">
                    <div className="flex items-center gap-4">
                      <div className="relative">
                        <Avatar className="w-12 h-12" style={{ backgroundColor: user.color }}>
                          <AvatarFallback className="text-white">
                            {user.name.split(' ').map(n => n[0]).join('')}
                          </AvatarFallback>
                        </Avatar>
                        <div
                          className={`absolute bottom-0 right-0 w-4 h-4 rounded-full border-2 border-background ${
                            user.status === 'online' ? 'bg-green-500' : 'bg-gray-400'
                          }`}
                        />
                      </div>

                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="font-semibold">{user.name}</h3>
                          <Badge variant="outline" className="text-xs">
                            {user.status}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground">{user.email}</p>
                        {user.current_page && (
                          <div className="flex items-center gap-1 mt-1 text-xs text-muted-foreground">
                            <Eye className="w-3 h-3" />
                            <span>Viewing: {user.current_page}</span>
                          </div>
                        )}
                      </div>

                      {user.status === 'online' && (
                        <div className="flex items-center gap-2">
                          <div
                            className="w-3 h-3 rounded-full"
                            style={{ backgroundColor: user.color }}
                            title="Cursor color"
                          />
                        </div>
                      )}
                    </div>
                  </Card>
                ))}
              </div>
            </Card>

            {/* Live Cursors Demo */}
            <Card className="p-6">
              <h2 className="text-xl font-semibold mb-4">Live Cursor Tracking</h2>
              <div className="relative h-64 bg-muted rounded-lg overflow-hidden">
                <div className="absolute inset-0 flex items-center justify-center text-muted-foreground">
                  <p>Workflow canvas with live cursors</p>
                </div>
                
                {/* Simulated cursors */}
                <div
                  className="absolute top-1/4 left-1/3 flex items-center gap-1 pointer-events-none"
                  style={{ color: onlineUsers[0].color }}
                >
                  <div className="w-4 h-4 rotate-45 border-l-2 border-t-2" style={{ borderColor: onlineUsers[0].color }} />
                  <Badge variant="outline" className="text-xs" style={{ borderColor: onlineUsers[0].color }}>
                    {onlineUsers[0].name}
                  </Badge>
                </div>

                <div
                  className="absolute top-1/2 left-2/3 flex items-center gap-1 pointer-events-none"
                  style={{ color: onlineUsers[2].color }}
                >
                  <div className="w-4 h-4 rotate-45 border-l-2 border-t-2" style={{ borderColor: onlineUsers[2].color }} />
                  <Badge variant="outline" className="text-xs" style={{ borderColor: onlineUsers[2].color }}>
                    {onlineUsers[2].name}
                  </Badge>
                </div>
              </div>
            </Card>
          </TabsContent>

          {/* Comments Tab */}
          <TabsContent value="comments" className="space-y-4">
            <Card className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold">Comments & Discussions</h2>
                <Button onClick={() => setShowCommentDialog(true)} className="gap-2">
                  <MessageSquare className="w-4 h-4" />
                  Add Comment
                </Button>
              </div>

              <div className="space-y-4">
                {comments.map(comment => (
                  <Card key={comment.id} className={`p-4 ${comment.resolved ? 'opacity-60' : ''}`}>
                    <div className="flex items-start gap-3">
                      <Avatar className="w-8 h-8" style={{ backgroundColor: comment.user_color }}>
                        <AvatarFallback className="text-white text-xs">
                          {comment.user_name.split(' ').map(n => n[0]).join('')}
                        </AvatarFallback>
                      </Avatar>

                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-semibold text-sm">{comment.user_name}</span>
                          <span className="text-xs text-muted-foreground">
                            {formatTimestamp(comment.timestamp)}
                          </span>
                          {comment.resolved && (
                            <Badge variant="outline" className="text-xs bg-green-500/10 text-green-500">
                              <CheckCircle className="w-3 h-3 mr-1" />
                              Resolved
                            </Badge>
                          )}
                        </div>

                        <p className="text-sm mb-2">{comment.content}</p>

                        {/* Replies */}
                        {comment.replies.length > 0 && (
                          <div className="ml-4 mt-3 space-y-2 border-l-2 border-border pl-3">
                            {comment.replies.map(reply => (
                              <div key={reply.id} className="flex items-start gap-2">
                                <Avatar className="w-6 h-6" style={{ backgroundColor: reply.user_color }}>
                                  <AvatarFallback className="text-white text-xs">
                                    {reply.user_name.split(' ').map(n => n[0]).join('')}
                                  </AvatarFallback>
                                </Avatar>
                                <div className="flex-1">
                                  <div className="flex items-center gap-2 mb-1">
                                    <span className="font-semibold text-xs">{reply.user_name}</span>
                                    <span className="text-xs text-muted-foreground">
                                      {formatTimestamp(reply.timestamp)}
                                    </span>
                                  </div>
                                  <p className="text-xs">{reply.content}</p>
                                </div>
                              </div>
                            ))}
                          </div>
                        )}

                        <div className="flex gap-2 mt-3">
                          <Button variant="ghost" size="sm" className="h-7 text-xs">
                            Reply
                          </Button>
                          {!comment.resolved && (
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-7 text-xs"
                              onClick={() => resolveComment(comment.id)}
                            >
                              <CheckCircle className="w-3 h-3 mr-1" />
                              Resolve
                            </Button>
                          )}
                        </div>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </Card>
          </TabsContent>

          {/* Activity Feed Tab */}
          <TabsContent value="activity" className="space-y-4">
            <Card className="p-6">
              <h2 className="text-xl font-semibold mb-4">Team Activity</h2>

              <div className="space-y-3">
                {activityFeed.map(event => (
                  <Card key={event.id} className="p-4">
                    <div className="flex items-start gap-3">
                      <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center flex-shrink-0">
                        {eventIcons[event.event_type as keyof typeof eventIcons]}
                      </div>

                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-semibold text-sm">{event.user_name}</span>
                          <span className="text-xs text-muted-foreground">
                            {formatTimestamp(event.timestamp)}
                          </span>
                        </div>
                        <p className="text-sm text-muted-foreground">{event.description}</p>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      {/* Add Comment Dialog */}
      <Dialog open={showCommentDialog} onOpenChange={setShowCommentDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Comment</DialogTitle>
            <DialogDescription>
              Leave a comment or mention a teammate with @
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium mb-2 block">Comment</label>
              <textarea
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder="Type your comment here... Use @ to mention teammates"
                className="w-full min-h-[100px] p-3 rounded-md border border-border bg-background resize-none"
              />
              <p className="text-xs text-muted-foreground mt-1">
                Tip: Use @username to mention a teammate
              </p>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowCommentDialog(false)}>
              Cancel
            </Button>
            <Button onClick={addComment} className="gap-2">
              <Send className="w-4 h-4" />
              Post Comment
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
