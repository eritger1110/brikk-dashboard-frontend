# BrikkFlows Dashboard

Enterprise-grade workflow automation dashboard for creating, monitoring, and managing multi-system workflows with visual flow builder, comprehensive integrations, observability, and compliance features.

## 🎯 Overview

BrikkFlows enables non-technical users to build complex automation workflows across enterprise systems (SAP, Salesforce, Slack, Snowflake, etc.) using a visual drag-and-drop interface with natural language configuration.

**Key Features:**
- **Visual Flow Builder** - Drag-and-drop canvas with trigger → condition → action nodes
- **Real-time Monitoring** - Live metrics, charts, and provider health dashboards
- **Compliance & Audit** - Immutable event timeline with cryptographic verification (SOC2/HIPAA ready)
- **Role-Based Access** - Granular permissions matrix (Admin/Manager/Operator/Viewer)
- **Multi-Provider Support** - OpenAI, Mistral AI, SAP, Salesforce, Slack, Snowflake, and more
- **Cost Tracking** - Per-execution cost breakdown and budget monitoring

## 🏗️ Architecture

### Frontend Stack
- **React 19** - UI framework
- **TypeScript** - Type safety
- **Tailwind CSS 4** - Styling with custom design system
- **React Flow** - Visual workflow canvas
- **Recharts** - Data visualization
- **Wouter** - Client-side routing
- **Framer Motion** - Animations

### Backend Integration
- **REST API** - BrikkFlows v1 API (documented in `README_BrikkFlows_API.txt`)
- **WebSocket** - Real-time updates via `wss://api.brikk.{env}/v1/stream`
- **Auth** - JWT with tenant isolation (`Authorization: Bearer <token>`, `X-Brikk-Tenant: <org_id>`)

### Project Structure

```
client/
├── src/
│   ├── components/
│   │   ├── layout/
│   │   │   └── DashboardLayout.tsx    # Main layout with sidebar
│   │   ├── workflow/
│   │   │   └── WorkflowNode.tsx       # Custom React Flow nodes
│   │   └── ui/                        # shadcn/ui components
│   ├── contexts/
│   │   ├── ApiContext.tsx             # Auth & API config
│   │   └── ThemeContext.tsx           # Dark/light theme
│   ├── hooks/
│   │   ├── useApi.ts                  # API data fetching hooks
│   │   └── useWebSocket.ts            # WebSocket subscription hooks
│   ├── lib/
│   │   ├── api-client.ts              # REST API client
│   │   └── websocket.ts               # WebSocket service
│   ├── pages/
│   │   ├── Dashboard.tsx              # Overview with KPIs
│   │   ├── Workflows.tsx              # Workflow list
│   │   ├── FlowBuilder.tsx            # Visual canvas
│   │   ├── Monitoring.tsx             # Real-time metrics
│   │   ├── AuditLogs.tsx              # Compliance timeline
│   │   ├── RoleManagement.tsx         # Permissions matrix
│   │   └── Settings.tsx               # Configuration
│   ├── types/
│   │   └── api.ts                     # TypeScript types from schemas
│   ├── App.tsx                        # Root component
│   └── index.css                      # Design system tokens
├── public/                            # Static assets
└── index.html                         # Entry point
```

## 🚀 Getting Started

### Prerequisites
- Node.js 22.13.0+
- pnpm 10.4.1+

### Installation

```bash
# Install dependencies
pnpm install

# Set environment variables
cp .env.example .env
# Edit .env with your API base URL and WebSocket URL

# Start development server
pnpm dev

# Build for production
pnpm build

# Preview production build
pnpm preview
```

### Environment Variables

```env
VITE_API_BASE_URL=https://api.brikk.dev
VITE_WS_BASE_URL=wss://api.brikk.dev/v1/stream
VITE_APP_TITLE=BrikkFlows
VITE_APP_LOGO=/logo.png
```

## 📡 API Integration

### REST Endpoints

All API calls go through the `apiClient` singleton (`lib/api-client.ts`):

```typescript
import { apiClient } from '@/lib/api-client';

// Set auth (done automatically by ApiProvider)
apiClient.setAuth(token, tenant);

// Flows
const flows = await apiClient.listFlows({ status: 'active' });
const flow = await apiClient.getFlow(flowId);
await apiClient.activateFlow(flowId);

// Executions
const executions = await apiClient.listExecutions({ flowId });

// Monitoring
const metrics = await apiClient.getMetricsOverview('24h');
const providers = await apiClient.getProviderMetrics('24h');
const alerts = await apiClient.listAlerts({ state: 'open' });

// Audit
const events = await apiClient.listAuditEvents({ from: '2025-10-01' });
```

### React Hooks

Use hooks for automatic data fetching with loading/error states:

```typescript
import { useFlows, useMetricsOverview, useAlerts } from '@/hooks/useApi';

function MyComponent() {
  const { data: flows, loading, error, refetch } = useFlows({ status: 'active' });
  const { data: metrics } = useMetricsOverview('24h');
  const { data: alerts } = useAlerts({ state: 'open' });

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return <div>{/* Render data */}</div>;
}
```

### WebSocket Real-time Updates

Subscribe to topics for live updates:

```typescript
import { useLiveAlerts, useLiveMetrics, useLiveExecutions } from '@/hooks/useWebSocket';

function MonitoringPage() {
  const alerts = useLiveAlerts();                    // Live alerts
  const metrics = useLiveMetrics();                  // Live metrics overview
  const executions = useLiveExecutions(flowId);      // Live execution updates

  return (
    <div>
      {alerts.map(alert => <AlertCard key={alert.id} alert={alert} />)}
    </div>
  );
}
```

## 🎨 Design System

### Brand Colors
- **Primary**: Indigo `#4F46E5` (trust, enterprise)
- **Success**: Emerald `#10B981` (healthy status)
- **Warning**: Amber `#F59E0B` (degraded status)
- **Danger**: Crimson `#EF4444` (critical status)

### Typography
- **Font**: Inter (400, 500, 600, 700)
- **Scale**: text-sm (14px), text-base (16px), text-lg (18px), text-xl (20px), text-2xl (24px), text-3xl (30px)

### Custom Utilities

```css
/* Status indicators */
.status-dot-success    /* Green pulsing dot */
.status-dot-warning    /* Amber dot */
.status-dot-danger     /* Red pulsing dot */

/* Badges */
.badge-success         /* Green badge */
.badge-warning         /* Amber badge */
.badge-danger          /* Red badge */
.badge-primary         /* Indigo badge */

/* Backgrounds */
.dot-grid-bg           /* Dot grid for canvas */
```

## 📊 Key Pages

### 1. Dashboard Overview (`/`)
- 4 KPI metrics (Active Workflows, Executions, Success Rate, Cost)
- Workflow cards with health indicators
- Quick actions and recent activity

### 2. Workflows List (`/workflows`)
- Search and filter interface
- Status badges (Active/Draft/Paused)
- Execution stats and actions

### 3. Flow Builder (`/flow-builder`)
- React Flow canvas with drag-and-drop
- Node types: Trigger (blue), Condition (purple), Action (green)
- Minimap and controls
- Simulation mode

### 4. Monitoring (`/monitoring`)
- Real-time execution and latency charts
- Integration health cards (6 providers)
- Active alerts with severity levels
- Time range selector

### 5. Audit Logs (`/audit-logs`)
- Immutable event timeline
- Cryptographic hash verification
- Compliance metadata (IP, session ID, hash)
- Export to PDF/CSV

### 6. Role Management (`/roles`)
- User list with search
- Permissions matrix (Viewer/Operator/Manager/Admin)
- Role definition cards

### 7. Settings (`/settings`)
- Notifications, Security/SSO, Integrations, Data/Compliance

## 🔒 Security

- **Authentication**: JWT tokens with tenant isolation
- **Authorization**: Role-based access control (RBAC)
- **Audit Trail**: Immutable logs with SHA-256 hashes
- **Secrets**: Never exposed to frontend; managed server-side
- **Idempotency**: Write operations use `X-Idempotency-Key` headers

## 📝 Development Guidelines

### Adding a New Page

1. Create page component in `client/src/pages/`
2. Wrap with `DashboardLayout` for consistent navigation
3. Add route in `App.tsx`
4. Use API hooks from `hooks/useApi.ts`
5. Add WebSocket subscriptions if needed

### Adding a New API Endpoint

1. Add types to `types/api.ts`
2. Add method to `lib/api-client.ts`
3. Create hook in `hooks/useApi.ts`
4. Use hook in component

### Styling Guidelines

- Use Tailwind utility classes
- Follow dark theme by default
- Use design system colors (`bg-primary`, `text-success`, etc.)
- Add custom utilities to `index.css` if reusable

## 🧪 Testing

```bash
# Run TypeScript type checking
pnpm run typecheck

# Build to verify production readiness
pnpm run build
```

## 📦 Deployment

The app is deployed via Manus platform:

1. Save checkpoint: Creates immutable version
2. Click "Publish" in Management UI
3. Access at `https://{prefix}.manus.space` or custom domain

## 📚 Additional Documentation

- **API Schemas**: `brikkflows_schemas.json`
- **API Documentation**: `README_BrikkFlows_API.txt`
- **Postman Collection**: `BrikkFlows_API.postman_collection.json`
- **Wireframes**: `WIREFRAMES_STORYBOARD.md`
- **Investor Deck**: `INVESTOR_PRESENTATION.md`

## 🤝 Contributing

1. Check `todo.md` for pending tasks
2. Follow TypeScript strict mode
3. Use existing hooks and components
4. Test with mock data before wiring to API
5. Save checkpoint after major features

## 📄 License

Proprietary - Brikk, Inc.

## 🆘 Support

For questions or issues, contact the Brikk engineering team.

---

**Built with ❤️ by the Brikk team**

