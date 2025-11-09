# Brikk Dashboard - Complete Transformation with Real API Integration

## Phase 1: API Adapter Layer (NEW)
- [x] Create src/types/api.ts with all TypeScript types
- [x] Create src/lib/api.ts adapter with Railway backend
- [x] Add environment variable NEXT_PUBLIC_API_BASE
- [x] Implement feature flags (analytics, marketplace, helpbot)
- [x] Add Auth0 token + X-Brikk-Org header handling
- [x] Implement error handling with toast notifications
- [x] Add request telemetry (timing, error capture)
- [ ] Test /health and / endpoints

## Phase 2: Wire Existing Pages to Real API
- [x] Overview: Wire /v1/usage/aggregate and /v1/costs/by-provider
- [x] Agents: Wire /v1/agents with pause/resume actions
- [ ] BrikkFlows: Wire /v1/flows endpoints
- [ ] Billing: Wire /v1/billing/invoices
- [ ] Security: Wire /v1/api-keys and /v1/audit
- [ ] Developer: Wire /v1/dev/proxy for API explorer
- [ ] Add "Partial Data" badges where endpoints not ready
- [ ] Replace all loading states with real data fetching

## Phase 3: Analytics & Insights Module
- [ ] Create Analytics page
- [ ] Wire /v1/analytics/top-agents endpoint
- [ ] Wire /v1/analytics/top-errors endpoint
- [ ] Wire /v1/analytics/latency (p50/p95) endpoint
- [ ] Add performance metrics charts
- [ ] Add error analysis dashboard
- [ ] Add latency distribution visualization
- [ ] Add export functionality

## Phase 4: Agent Marketplace Module
- [ ] Create Marketplace page
- [ ] Wire /v1/marketplace/agents endpoint
- [ ] Implement agent discovery with search/filter
- [ ] Add agent detail view with ratings
- [ ] Wire POST /v1/marketplace/agents/{id}:install
- [ ] Add installation confirmation flow
- [ ] Add "My Installed Agents" section
- [ ] Feature flag marketplace module

## Phase 5: Help & Onboarding Module
- [ ] Create Help page
- [ ] Wire /v1/help/checklist endpoint
- [ ] Implement onboarding checklist UI
- [ ] Wire POST /v1/help/contact for support tickets
- [ ] Add BrikkBot AI assistant interface
- [ ] Add documentation links
- [ ] Add video tutorials section
- [ ] Feature flag helpbot module

## Phase 6: Final Polish & Deployment
- [ ] Test all API endpoints with real Railway backend
- [ ] Verify Auth0 token flow
- [ ] Test pagination on all list views
- [ ] Add retry logic for failed requests
- [ ] Optimize bundle size (code splitting)
- [ ] Add loading skeletons for all data fetches
- [ ] Test mobile responsiveness
- [ ] Create API_INTEGRATION_NOTES.md documentation
- [ ] Final production build test
- [ ] Deploy to production

## Previously Completed (Phases 1-8)
- [x] Brikk brand system setup
- [x] Dashboard layout with sidebar
- [x] Overview page UI
- [x] Agent Management UI
- [x] BrikkFlows UI
- [x] Billing UI
- [x] Security UI
- [x] Developer Tools UI

