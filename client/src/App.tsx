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
import Dashboard from "./pages/Dashboard";
import Workflows from "./pages/Workflows";
import FlowBuilder from "./pages/FlowBuilder";
import BrikkFlows from "./pages/BrikkFlows";
import Billing from "./pages/Billing";
import Security from "./pages/Security";
import Developer from "./pages/Developer";
import Monitoring from "./pages/Monitoring";
import Analytics from "./pages/Analytics";
import Marketplace from "./pages/Marketplace";
import Help from "./pages/Help";
import AuditLogs from "./pages/AuditLogs";
import RoleManagement from "./pages/RoleManagement";
import Settings from "./pages/Settings";
import DemoGallery from "./pages/DemoGallery";
import SimulationMode from "./pages/SimulationMode";
import MonitoringDashboard from "./pages/MonitoringDashboard";
import TeamManagement from "./pages/TeamManagement";
import AgentVersioning from "./pages/AgentVersioning";
import Landing from "./pages/Landing";
import CustomAgentBuilder from "./pages/CustomAgentBuilder";
import WorkflowTemplates from "./pages/WorkflowTemplates";
import AgentAnalytics from "./pages/AgentAnalytics";
import CostOptimization from "./pages/CostOptimization";
import APIKeysWebhooks from "./pages/APIKeysWebhooks";
import AdvancedABTesting from "./pages/AdvancedABTesting";
import RealtimeCollaboration from "./pages/RealtimeCollaboration";
import Legal from "./pages/Legal";
import Sidebar from "./components/Sidebar";
import OnboardingTutorial from "./components/OnboardingTutorial";
import GlobalSearch from "./components/GlobalSearch";

function Router() {
  return (
    <div className="flex">
      <GlobalSearch />
      <OnboardingTutorial />
      <Sidebar />
      <main className="flex-1 overflow-auto">
        <Switch>
      {/* New Brikk Dashboard Routes */}
      <Route path="/" component={Overview} />
      <Route path="/agents" component={Agents} />
      <Route path="/agents/map" component={AgentNetworkMap} />
      <Route path="/workflows" component={BrikkFlows} />
      <Route path="/flow-builder" component={FlowBuilder} />
      <Route path="/billing" component={Billing} />
      <Route path="/marketplace" component={Marketplace} />
      <Route path="/security" component={Security} />
      <Route path="/developer" component={Developer} />
      <Route path="/analytics" component={Analytics} />
      <Route path="/help" component={Help} />
      <Route path="/settings" component={Settings} />
      
      {/* Legacy routes */}
      <Route path="/monitoring" component={Monitoring} />
      <Route path="/audit-logs" component={AuditLogs} />
      <Route path="/roles" component={RoleManagement} />
      <Route path="/demo" component={DemoGallery} />
      <Route path="/simulation" component={SimulationMode} />
      <Route path="/monitoring-dashboard" component={MonitoringDashboard} />
      <Route path="/team" component={TeamManagement} />
      <Route path="/versioning" component={AgentVersioning} />
      <Route path="/builder" component={CustomAgentBuilder} />
      <Route path="/templates" component={WorkflowTemplates} />
      <Route path="/analytics" component={AgentAnalytics} />
      <Route path="/cost-optimization" component={CostOptimization} />
      <Route path="/api-keys" component={APIKeysWebhooks} />
      <Route path="/ab-testing" component={AdvancedABTesting} />
      <Route path="/collaboration" component={RealtimeCollaboration} />
      <Route path="/legal" component={Legal} />
      
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
    return <Landing />;
  }

  return <>{children}</>;
}

export default App;

