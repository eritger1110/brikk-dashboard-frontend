import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/NotFound";
import { Route, Switch } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import { ApiProvider } from "./contexts/ApiContext";
import { SimulationProvider } from "./contexts/SimulationContext";

// Import pages
import Overview from "./pages/Overview";
import Dashboard from "./pages/Dashboard";
import Workflows from "./pages/Workflows";
import FlowBuilder from "./pages/FlowBuilder";
import Monitoring from "./pages/Monitoring";
import AuditLogs from "./pages/AuditLogs";
import RoleManagement from "./pages/RoleManagement";
import Settings from "./pages/Settings";
import DemoGallery from "./pages/DemoGallery";

function Router() {
  return (
    <Switch>
      {/* New Brikk Dashboard Routes */}
      <Route path="/" component={Overview} />
      <Route path="/agents" component={Dashboard} />
      <Route path="/workflows" component={Workflows} />
      <Route path="/flow-builder" component={FlowBuilder} />
      <Route path="/billing" component={Overview} />
      <Route path="/marketplace" component={Overview} />
      <Route path="/security" component={AuditLogs} />
      <Route path="/developer" component={Overview} />
      <Route path="/analytics" component={Monitoring} />
      <Route path="/help" component={Overview} />
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
      <SimulationProvider>
        <ApiProvider>
          <ThemeProvider
            defaultTheme="dark"
            switchable
          >
            <TooltipProvider>
              <Toaster />
              <Router />
            </TooltipProvider>
          </ThemeProvider>
        </ApiProvider>
      </SimulationProvider>
    </ErrorBoundary>
  );
}

export default App;

