import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { FlaskConical, LogIn, Sparkles, Zap, Users, BarChart3 } from 'lucide-react';

export default function Landing() {
  const enableDemoMode = () => {
    localStorage.setItem('brikk_demo_mode', 'true');
    window.location.href = '/';
  };

  const loginWithAuth0 = () => {
    localStorage.removeItem('brikk_demo_mode');
    window.location.href = '/';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5">
      <div className="container mx-auto px-4 py-16">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-primary/10 mb-6">
            <Sparkles className="w-10 h-10 text-primary" />
          </div>
          <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-primary via-cyan-500 to-violet-500 bg-clip-text text-transparent">
            Brikk Platform
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Build and deploy autonomous AI agent teams that work together to solve complex business problems
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-3 gap-6 mb-16">
          <Card className="p-6 border-primary/20 hover:border-primary/40 transition-colors">
            <Zap className="w-8 h-8 text-primary mb-4" />
            <h3 className="text-lg font-semibold mb-2">Custom Agent Builder</h3>
            <p className="text-sm text-muted-foreground">
              Create AI agents with drag-and-drop interface, no coding required
            </p>
          </Card>

          <Card className="p-6 border-primary/20 hover:border-primary/40 transition-colors">
            <Users className="w-8 h-8 text-cyan-500 mb-4" />
            <h3 className="text-lg font-semibold mb-2">Multi-Agent Workflows</h3>
            <p className="text-sm text-muted-foreground">
              Connect agents together for complex task automation
            </p>
          </Card>

          <Card className="p-6 border-primary/20 hover:border-primary/40 transition-colors">
            <BarChart3 className="w-8 h-8 text-violet-500 mb-4" />
            <h3 className="text-lg font-semibold mb-2">Analytics & Insights</h3>
            <p className="text-sm text-muted-foreground">
              Track performance, costs, and ROI with deep analytics
            </p>
          </Card>
        </div>

        {/* CTA Cards */}
        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {/* Demo Mode Card */}
          <Card className="p-8 border-2 border-primary/40 bg-primary/5">
            <div className="flex items-center gap-3 mb-4">
              <FlaskConical className="w-8 h-8 text-primary" />
              <h2 className="text-2xl font-bold">Try Demo Mode</h2>
            </div>
            <p className="text-muted-foreground mb-6">
              Explore all features instantly with pre-loaded demo data. No login required.
            </p>
            <ul className="space-y-2 mb-6 text-sm">
              <li className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                Full platform access
              </li>
              <li className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                Sample agents and workflows
              </li>
              <li className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                No authentication needed
              </li>
            </ul>
            <Button
              onClick={enableDemoMode}
              className="w-full gap-2"
              size="lg"
            >
              <FlaskConical className="w-5 h-5" />
              Enter Demo Mode
            </Button>
          </Card>

          {/* Login Card */}
          <Card className="p-8 border-2 border-border">
            <div className="flex items-center gap-3 mb-4">
              <LogIn className="w-8 h-8 text-foreground" />
              <h2 className="text-2xl font-bold">Sign In</h2>
            </div>
            <p className="text-muted-foreground mb-6">
              Log in with your Brikk account to access your organization's agents and workflows.
            </p>
            <ul className="space-y-2 mb-6 text-sm">
              <li className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-foreground" />
                Secure Auth0 authentication
              </li>
              <li className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-foreground" />
                Your organization's data
              </li>
              <li className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-foreground" />
                Team collaboration features
              </li>
            </ul>
            <Button
              onClick={loginWithAuth0}
              variant="outline"
              className="w-full gap-2"
              size="lg"
            >
              <LogIn className="w-5 h-5" />
              Sign In with Auth0
            </Button>
          </Card>
        </div>

        {/* Footer */}
        <div className="text-center mt-16 text-sm text-muted-foreground">
          <p>© 2025 Brikk Platform. Built with ❤️ for autonomous AI teams.</p>
        </div>
      </div>
    </div>
  );
}
