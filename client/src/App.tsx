import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/NotFound";
import { Route, Switch } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import { ApiProvider } from "./contexts/ApiContext";
import { SimulationProvider } from "./contexts/SimulationContext";
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
      <Route path="/" component={Dashboard} />
      <Route path="/workflows" component={Workflows} />
      <Route path="/flow-builder" component={FlowBuilder} />
      <Route path="/monitoring" component={Monitoring} />
      <Route path="/audit-logs" component={AuditLogs} />
      <Route path="/roles" component={RoleManagement} />
      <Route path="/settings" component={Settings} />
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

