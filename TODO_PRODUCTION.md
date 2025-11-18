# Brikk Dashboard - Production Readiness TODO

**Created:** 2025-11-18  
**Goal:** Make dashboard 100% production-ready with full E2E testing and simple workflow UX

---

## PHASE 1: Environment & Configuration ✅

### Auth0 Configuration
- [x] Auth0 integration added to frontend
- [x] Auth0Provider wraps app
- [x] Callback URLs configured
- [x] Logout URLs configured  
- [x] Web Origins configured
- [ ] Test login/logout flow end-to-end
- [ ] Test session refresh
- [ ] Test unauthorized access redirects

### Environment Variables
- [x] DATABASE_URL configured in Railway
- [x] Auth0 variables configured (VITE_AUTH0_DOMAIN, VITE_AUTH0_CLIENT_ID, VITE_AUTH0_AUDIENCE)
- [ ] Document all required env vars in README
- [ ] Verify Stripe keys if needed
- [ ] Check for any missing env vars

### Database
- [x] marketplace_agents table created
- [x] marketplace_agents seeded with 15 sample agents
- [ ] **BUG: Marketplace API returns 0 agents** - needs investigation
  - Backend connects to correct DB (verified)
  - Data exists in DB (verified)
  - API requires Auth0 token (might need to make marketplace public or fix auth)

---

## PHASE 2: Marketplace Fix 🔧

### Current Issue
- Marketplace page shows "0 Available Agents"
- Backend endpoint `/api/marketplace/agents` returns empty array
- Root cause: Needs valid Auth0 token OR should be made public

### Options to Fix
1. **Option A**: Make marketplace endpoint public (no auth required)
2. **Option B**: Ensure frontend passes valid Auth0 token
3. **Option C**: Use session-based auth instead of JWT

### Action Items
- [ ] Decide on auth strategy for marketplace
- [ ] Implement fix in backend
- [ ] Test marketplace loads agents
- [ ] Verify category filtering works
- [ ] Test agent detail view
- [ ] Test agent installation flow

---

## PHASE 3: Full E2E Testing 🧪

### 3.1 Auth & Sessions
- [ ] Sign up / login (email/password)
- [ ] Social login (if enabled)
- [ ] Logout
- [ ] Session expiry and refresh
- [ ] Unauthorized access redirects
- [ ] Protected routes work correctly

### 3.2 Onboarding / New User State
- [ ] What does a brand new user see?
- [ ] Are they guided to create first workflow?
- [ ] No empty, confusing screens
- [ ] Clear next steps provided

### 3.3 Overview Page
- [ ] Loads without errors
- [ ] Displays correct metrics (requests, cost, success rate)
- [ ] Charts render correctly
- [ ] Real-time data updates
- [ ] Empty states handled gracefully
- [ ] Error states handled gracefully

### 3.4 Agents Page
- [ ] Lists all agents
- [ ] Agent cards display correct data
- [ ] Agent detail view works
- [ ] Pause/resume agent works
- [ ] Agent metrics are accurate
- [ ] Empty state when no agents
- [ ] Loading states

### 3.5 Workflows / BrikkFlows Page
- [ ] Create new workflow
- [ ] Edit existing workflow
- [ ] Clone/duplicate workflow
- [ ] Enable/disable workflow
- [ ] Delete workflow
- [ ] Triggers → Conditions → Actions persist correctly
- [ ] Workflow execution logs
- [ ] Simulation mode toggle works
- [ ] Simulation shows where actions would fire
- [ ] Real mode fires actual actions

### 3.6 Usage & Billing Page
- [ ] Displays current usage
- [ ] Shows billing plan
- [ ] Lists invoices
- [ ] Upgrade/downgrade plan
- [ ] Stripe integration (if applicable)
- [ ] Usage charts render
- [ ] Cost breakdown by provider

### 3.7 Marketplace Page
- [ ] Lists available agents/workflows
- [ ] Category filtering works
- [ ] Search works
- [ ] Agent/workflow detail view
- [ ] Install from marketplace
- [ ] Installed items tracked
- [ ] Rating display

### 3.8 Security Page
- [ ] List API keys
- [ ] Create new API key
- [ ] Revoke API key
- [ ] API key shown only once on creation
- [ ] Audit logs display
- [ ] Audit log filtering

### 3.9 Developer Page
- [ ] API documentation accessible
- [ ] API proxy works
- [ ] OpenAPI spec available
- [ ] Code examples provided

### 3.10 Analytics Page
- [ ] Top agents chart
- [ ] Error tracking
- [ ] Latency metrics
- [ ] Time series charts
- [ ] Date range filtering

### 3.11 Help Page
- [ ] Help chat works
- [ ] Documentation links
- [ ] Support contact info

### 3.12 Settings Page
- [ ] User profile editable
- [ ] Organization settings
- [ ] Notification preferences
- [ ] Theme toggle (if applicable)

### 3.13 Navigation & Layout
- [ ] All sidebar links work
- [ ] All topbar links work
- [ ] Breadcrumbs correct
- [ ] No dead routes
- [ ] No placeholder pages with errors
- [ ] Mobile responsive

### 3.14 Error & Edge Cases
- [ ] Invalid form input shows clear errors
- [ ] Network failure handled gracefully
- [ ] Backend errors show user-friendly messages
- [ ] No raw stack traces shown
- [ ] UI doesn't get stuck in loading state
- [ ] 404 page works
- [ ] 500 error page works

---

## PHASE 4: Annie the Admin - Simple Workflow UX 👩‍💼

### Requirements
- [ ] Non-technical user can create workflows
- [ ] Plain language, no jargon
- [ ] Step-by-step wizard
- [ ] Template gallery
- [ ] One-click template installation

### Wizard Steps
- [ ] Step 1: Choose trigger (plain language)
- [ ] Step 2: Add conditions (optional, simple rules)
- [ ] Step 3: Choose actions (clear options)
- [ ] Step 4: Review & test (simulation)
- [ ] Step 5: Activate

### UX Elements
- [ ] Helpful tooltips
- [ ] Short, clear labels
- [ ] Examples for each step
- [ ] Visual clean and intuitive
- [ ] Advanced options hidden behind "Advanced" section

### In-Dashboard Guidance
- [ ] Explain what a workflow is
- [ ] Explain what simulation toggle does
- [ ] Explain what happens on Execute/Activate
- [ ] Help icons with explanations
- [ ] Onboarding tour (optional)

### Template Gallery
- [ ] Category filters
- [ ] Search templates
- [ ] Template preview
- [ ] One-click "Use this template"
- [ ] Pre-filled trigger/conditions/actions
- [ ] Annie can tweak after installation

### Optional: Natural Language Helper
- [ ] Text box: "Describe what you want to automate"
- [ ] Generate suggested workflow
- [ ] Annie can review and edit

---

## PHASE 5: Demo / Showcase Workflow 🎬

- [ ] Create at least one "showcase" workflow
- [ ] Runs from dashboard
- [ ] Logs clearly what happened
- [ ] Shows visible, real-world effect (email, Slack, webhook)
- [ ] Can be demonstrated live

---

## PHASE 6: Documentation 📚

### README Updates
- [ ] List all required env vars
- [ ] Which services need which vars
- [ ] SSL requirements for DB
- [ ] Deployment instructions
- [ ] Local development setup

### QA Report
- [ ] What was tested
- [ ] Bugs found + fixed
- [ ] Bugs found but NOT fixed yet
- [ ] Missing tests or risky areas
- [ ] Performance notes

### User Documentation
- [ ] How to create a workflow
- [ ] How to use templates
- [ ] How to test in simulation mode
- [ ] How to activate workflows
- [ ] How to view logs
- [ ] How to manage API keys

---

## PHASE 7: Final Checks ✅

- [ ] All critical bugs fixed
- [ ] All E2E tests passing
- [ ] Annie workflow UX complete
- [ ] Documentation complete
- [ ] QA report written
- [ ] Demo workflow ready
- [ ] Production deployment tested
- [ ] Performance acceptable
- [ ] Security review done
- [ ] Ready for handoff

---

## KNOWN ISSUES

### Critical
1. **Marketplace returns 0 agents** - Backend auth issue or DB connection

### Medium
- TBD

### Low
- TBD

---

## NOTES

- Railway backend: https://brikk-production-9913.up.railway.app
- Frontend dev: https://3000-ih2tfb2dem8fn2r8jod4z-63be2eba.manusvm.computer
- Frontend prod: https://dashboard.getbrikk.com
- Database: Render PostgreSQL (connected to Railway)
- Auth: Auth0
- Payments: Stripe (if applicable)
