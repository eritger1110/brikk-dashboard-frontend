import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/NotFound";
import { Route, Switch } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
// API Context removed - using direct API adapter imports now

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

function Router() {
  return (
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
      
      <Route path="/404" component={NotFound} />
      {/* Final fallback route */}
      <Route component={NotFound} />
    </Switch>
  );
}

// Brikk Dashboard uses dark theme by default for enterprise aesthetic
function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider
        defaultTheme="dark"
        switchable
      >
        <TooltipProvider>
          <Toaster />
          <Router />
        </TooltipProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;

