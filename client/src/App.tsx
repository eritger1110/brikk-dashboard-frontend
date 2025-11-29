import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/NotFound";
import { Route, Switch } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import { BrikkAuth0Provider, ProtectedRoute, useBrikkAuth } from "./contexts/Auth0Context";
import { DemoModeProvider } from "./contexts/DemoModeContext";

// Import pages
import Overview from "./pages/Overview";
import Agents from "./pages/Agents";
import AgentNetworkMap from "./pages/AgentNetworkMap";

import FlowBuilder from "./pages/FlowBuilder";
import BrikkFlows from "./pages/BrikkFlows";
import Billing from "./pages/Billing";
import Plans from "./pages/Plans";
import Team from "./pages/Team";
import Terms from "./pages/Terms";
import Privacy from "./pages/Privacy";
import DPA from "./pages/DPA";
import HIPAA from "./pages/HIPAA";
import Security from "./pages/Security";
import Developer from "./pages/Developer";

import Analytics from "./pages/Analytics";

import Help from "./pages/Help";
import AuditLogs from "./pages/AuditLogs";
import RoleManagement from "./pages/RoleManagement";
import Settings from "./pages/Settings";

import MonitoringDashboard from "./pages/MonitoringDashboard";
import TeamManagement from "./pages/TeamManagement";

import Landing from "./pages/Landing";
import CustomAgentBuilder from "./pages/CustomAgentBuilder";
import WorkflowTemplates from "./pages/WorkflowTemplates";

import IntegrationMarketplace from "./pages/IntegrationMarketplace";
import IntegrationBuilder from "./pages/IntegrationBuilder";
import DeveloperPortal from "./pages/DeveloperPortal";
import OAuthCallback from "./pages/OAuthCallback";
import Sidebar from "./components/Sidebar";
import OnboardingTutorial from "./components/OnboardingTutorial";
import GlobalSearch from "./components/GlobalSearch";

function Router() {
  // make sure to consider if you need authentication for certain routes
  return (
    <div className="flex">
      <GlobalSearch />
      <OnboardingTutorial />
      <Sidebar />
      <main className="flex-1 overflow-auto">
        <Switch>
      {/* Root redirect */}
      <Route path="/">
        {() => {
          window.location.href = "/dashboard";
          return null;
        }}
      </Route>
      
      {/* Dashboard */}
      <Route path="/dashboard" component={Overview} />
      <Route path="/agents" component={Agents} />
      <Route path="/agents/map" component={AgentNetworkMap} />
      <Route path="/workflows" component={BrikkFlows} />
      <Route path="/agents/builder" component={CustomAgentBuilder} />
      
      {/* Workflows */}
      <Route path="/workflows" component={BrikkFlows} />
      <Route path="/workflows/builder" component={FlowBuilder} />
      <Route path="/workflows/templates" component={WorkflowTemplates} />
      <Route path="/billing" component={Billing} />
      <Route path="/plans" component={Plans} />
      {/* Marketplace */}
      <Route path="/marketplace" component={IntegrationMarketplace} />
      <Route path="/marketplace/builder" component={IntegrationBuilder} />
      {/* Security */}
      <Route path="/security" component={Security} />
      <Route path="/security/audit-logs" component={AuditLogs} />
      <Route path="/security/roles" component={RoleManagement} />
      
      {/* Developer */}
      <Route path="/developer" component={Developer} />
      <Route path="/developer/portal" component={DeveloperPortal} />
      {/* Analytics & Monitoring */}
      <Route path="/analytics" component={Analytics} />
      <Route path="/monitoring" component={MonitoringDashboard} />
      
      {/* Team & Settings */}
      <Route path="/team" component={TeamManagement} />
      <Route path="/settings" component={Settings} />
      <Route path="/help" component={Help} />
      
      {/* Legal Pages */}
      <Route path="/terms" component={Terms} />
      <Route path="/privacy" component={Privacy} />
      <Route path="/dpa" component={DPA} />
      <Route path="/hipaa" component={HIPAA} />
      <Route path="/oauth/callback" component={OAuthCallback} />
      
      <Route path="/404" component={NotFound} />
      {/* Final fallback route */}
      <Route component={NotFound} />
        </Switch>
      </main>
    </div>
  );
}

// Brikk Dashboard uses dark theme by default for enterprise aesthetic
function App() {
  return (
    <ErrorBoundary>
      <DemoModeProvider>
        <BrikkAuth0Provider>
          <ThemeProvider
            defaultTheme="dark"
            switchable
          >
            <TooltipProvider>
              <Toaster />
              <AuthWrapper>
                <Router />
              </AuthWrapper>
            </TooltipProvider>
          </ThemeProvider>
        </BrikkAuth0Provider>
      </DemoModeProvider>
    </ErrorBoundary>
  );
}

// Wrapper to show Landing or Router based on auth
function AuthWrapper({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, isLoading } = useBrikkAuth();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-background">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <Switch>
        <Route path="/" component={Landing} />
        <Route path="/oauth/callback" component={OAuthCallback} />
        <Route component={Landing} />
      </Switch>
    );
  }

  return <>{children}</>;
}

export default App;

