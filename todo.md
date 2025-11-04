# Brikk Workflow Automation Dashboard - TODO

## Phase 1: Backend Foundation ✅ COMPLETE
- [x] Database models (Policy, PolicyVersion, PolicyApproval, PolicyDeployment, PolicyAudit, RBAC)
- [x] Alembic migration with RBAC seed data
- [x] Pydantic schemas for validation
- [x] PolicyService with business logic
- [x] Flask API endpoints (15 routes)
- [x] Simulation engine
- [x] Approval workflow
- [x] Deployment management
- [x] Natural language policy explanation
- [x] Register blueprint in factory.py
- [x] Push to GitHub

## Phase 2: Visual Wireframe & Storyboard - 5 Key Screens
- [x] Screen 1: Dashboard Overview (workflows, health indicators, metrics, cost summaries)
- [x] Screen 2: Flow Builder Canvas (drag-and-drop trigger → condition → action nodes)
- [x] Screen 3: Monitoring & Alerts Panel (real-time metrics, color-coded alerts)
- [x] Screen 4: Audit Log / Compliance View (immutable timeline, who/what/when)
- [x] Screen 5: Role Management (access control, permissions matrix)
- [x] Create high-fidelity mockups for investor/sales presentations
- [x] Document design decisions and user flows

## Phase 3: Frontend Core - Dashboard, Flow Builder, Monitoring
- [x] Set up project structure and design system (React + Tailwind + Framer Motion)
- [x] Implement Dashboard Overview page
  - [x] Workflow cards with health indicators (green/yellow/red)
  - [x] Usage metrics charts
  - [x] Cost summaries
  - [x] Quick actions
- [x] Build Flow Builder Canvas
  - [x] React Flow integration
  - [x] Drag-and-drop node editor
  - [x] Node types: trigger, condition, action, decision
  - [x] Natural language rule prompts ("When X happens, do Y")
  - [x] Hover tooltips and guided onboarding
  - [x] Save/publish workflow
- [x] Create Monitoring Dashboard
  - [x] Real-time metrics (latency, error rate, fallback frequency, cost)
  - [x] Color-coded alerts
  - [x] Provider health status
  - [x] Charts and visualizations
- [x] Implement light/dark mode toggle (theme switcher enabled)
- [x] Add smooth transitions between screens
- [x] Create Workflows list page with search and filters
- [x] Create Audit Logs page with immutable timeline and compliance features
- [x] Create Role Management page with permissions matrix
- [x] Create Settings page with category cards

## Phase 4: Integrations Hub - Enterprise Connectors & Action Nodes
- [ ] Enterprise Systems
  - [ ] SAP connector
  - [ ] Salesforce connector
  - [ ] Shopify connector
  - [ ] Zendesk connector
  - [ ] ServiceTitan connector
- [ ] AI Providers
  - [ ] OpenAI connector
  - [ ] Anthropic connector
  - [ ] Mistral connector
- [ ] Messaging/Alerting
  - [ ] Slack connector
  - [ ] Twilio connector
  - [ ] Gmail/Outlook connector
- [ ] Data & Analytics
  - [ ] Snowflake connector
  - [ ] BigQuery connector
  - [ ] S3 connector
- [ ] UI-driven connection setup for each integration
- [ ] Draggable action nodes in flow canvas
- [ ] Secure credential management (key vault integration)

## Phase 5: Observability & Compliance - Audit Logs, Alerts, RBAC
- [ ] Audit Log / Compliance View
  - [ ] Immutable activity timeline
  - [ ] Who changed what, when
  - [ ] Related metadata
  - [ ] SOC2/HIPAA-ready compliance
- [ ] Alerts System
  - [ ] Cost ceiling alerts
  - [ ] Outage detection
  - [ ] Accuracy degradation alerts
  - [ ] Configurable alert rules
- [ ] Role-Based Access Control (RBAC)
  - [ ] Admin role
  - [ ] Manager role
  - [ ] Viewer role
  - [ ] Permissions matrix UI
  - [ ] Role assignment interface
- [ ] Security Features
  - [ ] SSO/OAuth integration
  - [ ] Secure key vault for API keys/credentials
  - [ ] Never expose credentials in UI
  - [ ] Audit all access attempts

## Phase 6: Polish, Documentation, and Investor Demo Package
- [ ] Enterprise Features
  - [ ] Version control for workflows
  - [ ] Rollback functionality
  - [ ] Testing modes (sandbox/production)
  - [ ] Nested workflows (Flow triggers Flow)
  - [ ] Reusable templates library
- [ ] UI/UX Polish
  - [ ] Loading states and error handling
  - [ ] Responsive design
  - [ ] Accessibility audit
  - [ ] Performance optimization
  - [ ] Smooth animations and transitions
- [ ] Documentation
  - [ ] User guide for Angie (non-technical)
  - [ ] Admin guide for IT teams
  - [ ] API documentation
  - [ ] Integration guides
  - [ ] Compliance documentation (SOC2/HIPAA)
- [ ] Investor Demo Package
  - [ ] Demo video walkthrough
  - [ ] Sales deck with screenshots
  - [ ] ROI calculator
  - [ ] Customer case studies
  - [ ] Technical architecture diagram

## Bugs & Issues
- [ ] Dev server file watcher limit (EMFILE error) - fix before deployment

## Future Enhancements
- [ ] Bulk operations (multi-select workflows)
- [ ] Advanced analytics and reporting
- [ ] A/B testing framework
- [ ] Workflow versioning diff viewer
- [ ] Mobile app for monitoring
- [ ] Webhook marketplace



## Phase 4: API Integration - Connect Frontend to BrikkFlows Backend
- [x] Set up API client infrastructure
  - [x] Create TypeScript types from BrikkFlows schemas (Flow, Execution, AuditEvent, etc.)
  - [x] Implement API client with axios/fetch
  - [x] Add request/response interceptors for auth headers
  - [x] Implement error handling and retry logic
- [x] Create React hooks for data fetching (useFlows, useExecutions, useMetrics, etc.)
- [x] Create ApiProvider context for auth management
- [x] Integrate Flows API
  - [x] GET /v1/flows (list with filters)
  - [x] POST /v1/flows (create draft)
  - [x] GET /v1/flows/{flowId} (detail)
  - [x] PATCH /v1/flows/{flowId} (update)
  - [x] POST /v1/flows/{flowId}:activate
  - [x] POST /v1/flows/{flowId}:simulate
  - [x] DELETE /v1/flows/{flowId}
- [x] Integrate Executions API
  - [x] GET /v1/executions (list with filters)
  - [x] GET /v1/executions/{execId} (detail)
  - [x] GET /v1/executions/{execId}/logs
- [x] Integrate Monitoring API
  - [x] GET /v1/metrics/overview
  - [x] GET /v1/metrics/providers
  - [x] GET /v1/alerts
  - [x] POST /v1/alerts/{alertId}:ack
- [x] Integrate Audit API
  - [x] GET /v1/audit (list with filters)
  - [x] POST /v1/audit/export
- [x] Integrate Integrations API
  - [x] GET /v1/integrations/catalog
  - [x] GET /v1/integrations/status
  - [x] POST /v1/integrations/{key}:connect
- [ ] Replace mock data with real API calls (ready to wire when backend is available)
  - [ ] Dashboard metrics
  - [ ] Workflows list
  - [ ] Monitoring charts
  - [ ] Audit events
  - [ ] Integration status cards



## Phase 5: Real-time Features - WebSocket Streaming & Live Updates
- [x] Create WebSocket client with reconnection logic
- [x] Implement topic-based subscription system
- [x] Create React hooks for WebSocket (useWebSocket, useLiveAlerts, useLiveExecutions, etc.)
- [ ] Integrate live updates into pages
  - [ ] Dashboard: Live metrics and recent activity
  - [ ] Monitoring: Real-time charts and provider health
  - [ ] Alerts: Live alert notifications with toast
  - [ ] Flow Builder: Live execution preview
- [ ] Add connection status indicator in header
- [ ] Implement reconnection UI feedback



## Phase 6: Trinity Demo - Three Interactive Workflow Demonstrations
- [x] Demo Infrastructure
  - [x] Create Demo Gallery page with 3 selectable flows
  - [x] Add Simulation Mode toggle (ON/OFF)
  - [x] Build animated flow execution engine with sequential node highlighting
  - [x] Create ROI metrics cards component
  - [x] Add demo-specific audit log generator
  - [x] Create success overlay with brand quote
- [x] Demo 1: Revenue Rescue (Business/Sales)
  - [x] Flow definition (inventory trigger → Mistral forecast → multi-channel actions)
  - [x] Mock data handlers (Shopify, Mistral, Slack, Meta, Supplier, Snowflake)
  - [x] ROI metrics: "$1,240 ad spend saved • 3h manual time avoided"
  - [x] Visual execution with timing (45 seconds)
- [x] Demo 2: Marketing Maestro (Marketing/Growth)
  - [x] Flow definition (campaign performance → sentiment/CTR check → AI optimization)
  - [x] Mock data handlers (Campaign API, OpenAI, Meta, Google Ads, Slack, Snowflake)
  - [x] ROI metrics: "CTR ↑28% • CPA ↓12% • Response time –30min"
  - [x] Visual execution with timing (50 seconds)
- [x] Demo 3: Operations Genius (Logistics/Ops)
  - [x] Flow definition (ERP batch → demand forecast → logistics optimization)
  - [x] Mock data handlers (ERP, Forecast API, Route optimizer, Slack, Snowflake)
  - [ ] Map widget for warehouse visualization (future enhancement)
  - [x] ROI metrics: "Fulfillment speed ↑17% • Picker travel ↓23% • Stock risk ↓40%"
  - [x] Visual execution with timing (55 seconds)
- [x] Polish & Integration
  - [x] Framer Motion animations for all transitions
  - [x] MSW (Mock Service Worker) installed
  - [x] Demo README documentation
  - [x] Add "🎬 Demo Gallery" to navigation
  - [x] Ensure modular code for standalone/chained execution



## Phase 7: Demo Polish - Realism, Storytelling, Live Integrations, Finale
- [ ] Functional Simulation Mode Toggle
  - [ ] Implement provider that routes API calls (Simulation ON → MSW, OFF → real API)
  - [ ] Add label beside toggle ("Simulated (safe)" / "Live API")
  - [ ] Add environment variables (VITE_API_BASE, VITE_WS_BASE, VITE_USE_MSW, VITE_LIVE_ALLOWED)
  - [ ] Create useSimulationToggle hook with global state
- [ ] Story Overlays & Info Panel
  - [ ] Add 3-second overlay on demo open with scenario description
  - [ ] Add "i" Info button (top-right) with side panel
  - [ ] Info panel: Goal, How Brikk solves it (3 bullets), Business impact (3 metrics)
  - [ ] Dismissible overlay with fade animation
- [ ] Results Pane (Right Side)
  - [ ] Collapsible panel that animates in after each action
  - [ ] Revenue Rescue: Slack message preview, Campaign Paused tile, PO Draft tile
  - [ ] Marketing Maestro: Before/After creative, Budget Shift bar, Slack summary
  - [ ] Operations Genius: Pick Routes card, Restock Plan card, Slack update
  - [ ] Add "✓ Sent live" badge for live executions
  - [ ] Create useResultsPane hook (addSlack, addEmail, addSheet, addBadge)
- [ ] Live Execution Integration
  - [ ] Add "Live Execution" toggle per demo (visible when Simulation OFF)
  - [ ] Show "⚡ LIVE" badge when Live Execution ON
  - [ ] Slack integration (webhook URL, real message posting)
  - [ ] Google Sheets integration (spreadsheet ID, range, write payload)
  - [ ] SendGrid integration (API key, email sending)
  - [ ] Safety: opt-in, secrets via env, never show in UI
- [ ] Micro-animations & Transitions
  - [ ] Signal traveling along step rail on Start Execution
  - [ ] Glow → checkmark → slide-down on step resolution
  - [ ] KPI numbers count up (0 → target in ~800ms)
  - [ ] 1-second interstitial between demos
- [ ] Finale Screen - "Coordinated Enterprise"
  - [ ] Auto-transition after 3rd demo completion
  - [ ] Combined canvas: Brikk Core (center, pulsing) + 3 spokes (Revenue/Marketing/Ops)
  - [ ] Animated signals flowing among nodes (~4 seconds)
  - [ ] Headline: "Brikk doesn't just automate each department — it unites them..."
  - [ ] Footer: Brand tagline
  - [ ] Add "Replay Trilogy" and "Back to Gallery" buttons
- [ ] Documentation & QA
  - [ ] Update README with Slack/Sheets/SendGrid configuration
  - [ ] Add Simulation vs Live mode guide
  - [ ] QA checklist: Simulation ON/OFF, Live Execution ON/OFF, Finale screen

