# Brikk Dashboard - Complete Transformation TODO

## Phase 1: Brand System & Design Tokens
- [x] Configure Brikk color palette in tailwind.config.ts
- [x] Set up CSS variables for light/dark mode in index.css
- [x] Add Brikk logos to client/public directory
- [x] Configure Inter font (already using it, verify)
- [x] Create brand gradient utilities
- [ ] Set up theme toggle with persistence
- [x] Create palette.ts for chart colors

## Phase 2: Core Layout & Navigation
- [x] Build DashboardLayout with topbar and left rail
- [x] Add collapsible sidebar (w-64 → w-20)
- [x] Implement global search bar
- [x] Add org switcher component
- [x] Add notifications bell with badge
- [x] Add user menu dropdown
- [x] Configure all main routes
- [ ] Add role-based route middleware

## Phase 3: Overview Dashboard
- [x] Create Overview page with KPI cards
- [x] Add real-time activity summary
- [x] Integrate /health endpoint check
- [x] Add area chart for requests over time
- [x] Add bar chart for usage by agent
- [x] Create recent events table
- [x] Add quick action buttons
- [ ] Add right rail with limits/plan info

## Phase 4: Agent Management
- [ ] Create Agents list page with search/filter
- [ ] Build agent detail page with metrics
- [ ] Add live agent network map visualization
- [ ] Implement agent status indicators
- [ ] Add latency metrics (P50/P95)
- [ ] Create watchlist/starred feature
- [ ] Add threshold alert notifications
- [ ] Build agent edit drawer

## Phase 5: BrikkFlows Workflow Builder
- [ ] Create Flows list page
- [ ] Build visual flow builder canvas (React Flow)
- [ ] Add drag/drop Triggers → Conditions → Actions
- [ ] Implement JSON/YAML sync
- [ ] Add versioning and rollback
- [ ] Create draft vs production modes
- [ ] Add simulation/test feature
- [ ] Implement cron scheduling
- [ ] Add rollback on failure

## Phase 6: Usage & Billing
- [ ] Create Usage analytics page
- [ ] Add live cost tracking
- [ ] Build breakdown by org/team/flow
- [ ] Add cost forecasting
- [ ] Implement plan management UI
- [ ] Integrate Stripe billing portal
- [ ] Add invoices table with download
- [ ] Create usage meters with thresholds

## Phase 7: Security & Compliance
- [ ] Create Security dashboard
- [ ] Build RBAC role editor
- [ ] Add audit logs with filters/export
- [ ] Create compliance checklist panels (HIPAA, SOC2, GDPR)
- [ ] Add key rotation alerts
- [ ] Implement encryption status display
- [ ] Build access policy editor
- [ ] Add behavioral anomaly detection

## Phase 8: Developer Tools
- [ ] Create API Explorer with live testing
- [ ] Add WebSocket log viewer
- [ ] Build SDK download center
- [ ] Create webhook tester
- [ ] Embed Swagger UI
- [ ] Add code examples (Python, JS, cURL)
- [ ] Create API key management UI
- [ ] Add token injection for testing

## Phase 9: Analytics & Insights
- [ ] Create Analytics dashboard
- [ ] Add agent interaction heatmaps
- [ ] Build custom KPI metrics
- [ ] Add predictive analytics
- [ ] Implement anomaly detection
- [ ] Create custom report builder
- [ ] Add CSV/PDF export
- [ ] Build coordination efficiency metrics

## Phase 10: Agent Marketplace (Feature-Flagged)
- [ ] Create Marketplace browse page
- [ ] Add agent detail pages
- [ ] Implement trust score display
- [ ] Add purchase/license flow
- [ ] Integrate Stripe micro-transactions
- [ ] Build marketplace analytics
- [ ] Add trending agents section
- [ ] Create revenue tracking

## Phase 11: Help & Onboarding
- [ ] Create interactive onboarding wizard
- [ ] Add embedded video tutorials
- [ ] Build glossary page
- [ ] Create guided demo mode
- [ ] Implement BrikkBot AI assistant
- [ ] Add contextual help drawers
- [ ] Create "Simulate workflow" demo
- [ ] Build help search

## Phase 12: Final Polish & Production
- [ ] Run full TypeScript type check
- [ ] Add unit tests (Vitest + RTL, 90% coverage)
- [ ] Add E2E tests (Playwright smoke suite)
- [ ] Performance optimization (Lighthouse ≥90)
- [ ] Add telemetry events
- [ ] Create /status endpoint
- [ ] Add /changelog page
- [ ] Security hardening (CSP, rate limiting)
- [ ] Final QA pass
- [ ] Production deployment to Netlify
- [ ] Verify live API connection
- [ ] Tag release v1.0.0-dashboard

## API Integration Endpoints
- [ ] GET /health
- [ ] GET /v1/overview
- [ ] GET /v1/agents
- [ ] GET /v1/agents/{id}
- [ ] POST /v1/agents
- [ ] PATCH /v1/agents/{id}
- [ ] GET /v1/flows
- [ ] POST /v1/flows
- [ ] PATCH /v1/flows/{id}
- [ ] POST /v1/flows/{id}:simulate
- [ ] POST /v1/flows/{id}:run
- [ ] GET /v1/usage
- [ ] GET /v1/billing/invoices
- [ ] POST /v1/billing/portal
- [ ] GET /v1/security/audit
- [ ] GET /v1/dev/logs
- [ ] POST /v1/keys
- [ ] DELETE /v1/keys/{id}

## Environment Variables to Configure
- [ ] NEXT_PUBLIC_API_BASE=https://api.getbrikk.com
- [ ] NEXT_PUBLIC_FLAGS=flows,marketplace,ceo_mode
- [ ] AUTH0_DOMAIN (already set)
- [ ] AUTH0_CLIENT_ID (already set)
- [ ] AUTH0_SECRET (already set)
- [ ] STRIPE_PUBLIC_KEY
- [ ] STRIPE_SECRET_KEY
- [ ] NEXTAUTH_URL (already set)

