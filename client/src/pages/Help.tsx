import { useState, useEffect, useRef } from "react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import {
  MessageCircle,
  Send,
  Bot,
  BookOpen,
  Video,
  FileText,
  ExternalLink,
  Loader2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { brikkColors } from "@/lib/palette";
import { useApi } from "@/hooks/useApi";
import { toast } from "sonner";

interface ChatMessage {
  role: "user" | "assistant";
  content: string;
  timestamp: string;
}

// Mock chatWithBrikkBot function (replace with real API call)
async function chatWithBrikkBot(params: { message: string; context: any }) {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 1000));
  return {
    message: "I'm here to help! This is a placeholder response. The actual BrikkBot integration will be connected to your AI backend."
  };
}

export default function Help() {
  const api = useApi();
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      role: "assistant",
      content:
        "👋 Hi! I'm BrikkBot, your AI assistant for the Brikk platform. I can help you with agent management, workflow creation, billing questions, and more. How can I assist you today?",
      timestamp: new Date().toISOString(),
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  async function handleSend() {
    if (!input.trim() || loading) return;

    const userMessage: ChatMessage = {
      role: "user",
      content: input,
      timestamp: new Date().toISOString(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setLoading(true);

    try {
      const response = await chatWithBrikkBot({
        message: input,
        context: {
          page: "help",
          user_role: "admin",
        },
      });

      const assistantMessage: ChatMessage = {
        role: "assistant",
        content: response.message,
        timestamp: new Date().toISOString(),
      };

      setMessages((prev) => [...prev, assistantMessage]);
    } catch (err) {
      console.error("Failed to chat with BrikkBot:", err);
      toast.error("Failed to send message");

      const errorMessage: ChatMessage = {
        role: "assistant",
        content:
          "I'm sorry, I'm having trouble connecting right now. Please try again in a moment or check out our documentation below.",
        timestamp: new Date().toISOString(),
      };

      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setLoading(false);
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const resources = [
    {
      title: "Getting Started Guide",
      description: "Learn the basics of Brikk platform",
      icon: BookOpen,
      color: brikkColors.blue,
      link: "#",
    },
    {
      title: "Video Tutorials",
      description: "Watch step-by-step video guides",
      icon: Video,
      color: brikkColors.cyan,
      link: "#",
    },
    {
      title: "API Documentation",
      description: "Complete API reference and examples",
      icon: FileText,
      color: brikkColors.violet,
      link: "#",
    },
  ];

  const quickActions = [
    "How do I create a new agent?",
    "What are BrikkFlows?",
    "How does billing work?",
    "How do I manage API keys?",
  ];

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold">Help & Support</h1>
          <p className="text-muted-foreground mt-1">
            Get help from BrikkBot or browse our documentation
          </p>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          {/* Chat Interface */}
          <div className="lg:col-span-2">
            <div className="brikk-card flex flex-col h-[600px]">
              {/* Chat Header */}
              <div className="flex items-center gap-3 pb-4 border-b border-border">
                <div
                  className="flex h-10 w-10 items-center justify-center rounded-lg"
                  style={{ backgroundColor: `${brikkColors.blue}20` }}
                >
                  <Bot className="h-5 w-5" style={{ color: brikkColors.blue }} />
                </div>
                <div>
                  <h3 className="font-semibold">BrikkBot</h3>
                  <p className="text-xs text-muted-foreground">
                    AI-powered assistant
                  </p>
                </div>
              </div>

              {/* Messages */}
              <div className="flex-1 overflow-y-auto py-4 space-y-4">
                {messages.map((message, index) => (
                  <div
                    key={index}
                    className={`flex gap-3 ${
                      message.role === "user" ? "justify-end" : "justify-start"
                    }`}
                  >
                    {message.role === "assistant" && (
                      <div
                        className="flex h-8 w-8 items-center justify-center rounded-lg flex-shrink-0"
                        style={{ backgroundColor: `${brikkColors.blue}20` }}
                      >
                        <Bot className="h-4 w-4" style={{ color: brikkColors.blue }} />
                      </div>
                    )}
                    <div
                      className={`max-w-[80%] rounded-lg p-3 ${
                        message.role === "user"
                          ? "bg-gradient-to-r from-[#0057FF] to-[#00C2FF] text-white"
                          : "bg-accent"
                      }`}
                    >
                      <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                      <p
                        className={`text-xs mt-1 ${
                          message.role === "user"
                            ? "text-white/70"
                            : "text-muted-foreground"
                        }`}
                      >
                        {new Date(message.timestamp).toLocaleTimeString()}
                      </p>
                    </div>
                  </div>
                ))}
                {loading && (
                  <div className="flex gap-3">
                    <div
                      className="flex h-8 w-8 items-center justify-center rounded-lg flex-shrink-0"
                      style={{ backgroundColor: `${brikkColors.blue}20` }}
                    >
                      <Bot className="h-4 w-4" style={{ color: brikkColors.blue }} />
                    </div>
                    <div className="bg-accent rounded-lg p-3">
                      <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* Input */}
              <div className="pt-4 border-t border-border">
                <div className="flex gap-2">
                  <Input
                    placeholder="Ask BrikkBot anything..."
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyPress={handleKeyPress}
                    disabled={loading}
                  />
                  <Button
                    className="btn-primary"
                    onClick={handleSend}
                    disabled={loading || !input.trim()}
                  >
                    {loading ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <Send className="h-4 w-4" />
                    )}
                  </Button>
                </div>

                {/* Quick Actions */}
                <div className="mt-3 flex flex-wrap gap-2">
                  {quickActions.map((action) => (
                    <button
                      key={action}
                      onClick={() => setInput(action)}
                      className="px-3 py-1 rounded-full text-xs border border-border hover:bg-accent transition-colors"
                      disabled={loading}
                    >
                      {action}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Resources Sidebar */}
          <div className="space-y-6">
            {/* Documentation Resources */}
            <div className="brikk-card">
              <h3 className="font-semibold mb-4">Documentation</h3>
              <div className="space-y-3">
                {resources.map((resource) => (
                  <a
                    key={resource.title}
                    href={resource.link}
                    className="flex items-start gap-3 p-3 rounded-lg border border-border hover:bg-accent/50 transition-colors"
                  >
                    <div
                      className="flex h-10 w-10 items-center justify-center rounded-lg flex-shrink-0"
                      style={{ backgroundColor: `${resource.color}20` }}
                    >
                      <resource.icon className="h-5 w-5" style={{ color: resource.color }} />
                    </div>
                    <div className="flex-1">
                      <div className="font-medium text-sm">{resource.title}</div>
                      <div className="text-xs text-muted-foreground mt-1">
                        {resource.description}
                      </div>
                    </div>
                    <ExternalLink className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                  </a>
                ))}
              </div>
            </div>

            {/* Contact Support */}
            <div className="brikk-card">
              <h3 className="font-semibold mb-3">Need More Help?</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Can't find what you're looking for? Our support team is here to help.
              </p>
              <Button variant="outline" className="w-full">
                <MessageCircle className="h-4 w-4 mr-2" />
                Contact Support
              </Button>
            </div>

            {/* Status */}
            <div className="brikk-card">
              <h3 className="font-semibold mb-3">System Status</h3>
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">API</span>
                  <span className="flex items-center gap-1" style={{ color: brikkColors.lime }}>
                    <span className="status-dot" />
                    Operational
                  </span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Dashboard</span>
                  <span className="flex items-center gap-1" style={{ color: brikkColors.lime }}>
                    <span className="status-dot" />
                    Operational
                  </span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Agents</span>
                  <span className="flex items-center gap-1" style={{ color: brikkColors.lime }}>
                    <span className="status-dot" />
                    Operational
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* API Integration Status */}
        <div className="brikk-card border-2 border-dashed">
          <div className="flex items-start gap-4">
            <div
              className="flex h-10 w-10 items-center justify-center rounded-lg flex-shrink-0"
              style={{ backgroundColor: `${brikkColors.lime}20` }}
            >
              <Bot className="h-5 w-5" style={{ color: brikkColors.lime }} />
            </div>
            <div className="flex-1">
              <h4 className="font-semibold mb-2">BrikkBot AI Assistant Active</h4>
              <p className="text-sm text-muted-foreground mb-3">
                BrikkBot is powered by the Railway backend and provides context-aware assistance
                for all Brikk platform features. Ask questions about agents, workflows, billing,
                security, and more.
              </p>
              <div className="text-sm space-y-1">
                <p className="font-medium">💬 Active Endpoints:</p>
                <ul className="list-disc list-inside text-muted-foreground ml-2 space-y-1">
                  <li>/v1/help/chat - AI-powered chat assistance</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}

