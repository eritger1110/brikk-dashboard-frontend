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

