# API Questions & Data Requirements

**Last Updated:** Nov 9, 2025 1:25 AM CST

## Critical Requirement
❗ **NO FICTIONAL DATA** - All metrics, counts, and statistics must come from real API endpoints.

---

## API Discovery Findings

### ✅ Confirmed Working
- **Health Check:** `GET https://api.getbrikk.com/health`
  - Status: Operational
  - Returns: `{"service":"Brikk Gateway","version":"*1.0.0*","status":"operational"}`

### ❓ API Documentation Status
- **Main Site:** https://www.getbrikk.com - Marketing site only, no developer docs found
- **API Base:** https://api.getbrikk.com - Returns JSON health status, no documentation UI
- **No OpenAPI/Swagger UI found** at common paths (/docs, /swagger, /api-docs)

### 🔍 Need from Eric/Team
Since there's no public API documentation, I need:

1. **API Documentation Link** or internal docs
2. **Available Endpoints** list with:
   - Path
   - Method (GET/POST/etc)
   - Required parameters
   - Response structure
3. **Authentication Method**
   - Currently using Auth0 for dashboard login
   - Does API use same auth? Bearer token? API key?
4. **Sample Response Payloads** for key endpoints

---

## Required Data for Dashboard Modules

### 1. **Overview Dashboard** (Currently showing mock data)
**Need Real Data For:**
- Total requests today (currently shows "12,847")
- Success rate percentage (currently shows "98.7%")
- Total spend today (currently shows "$284.50")
- Active agents count (currently shows "47")
- Requests over time chart (24h hourly data)
- Usage by agent (top 5 agents with request counts)
- Recent events/activity log (last 10-20 events)

**Suggested Endpoints:**
```
GET /api/v1/metrics/overview
GET /api/v1/metrics/timeseries?period=24h&interval=1h
GET /api/v1/events/recent?limit=20
GET /api/v1/agents/usage?period=24h&limit=5
```

### 2. **Agent Management** (Currently showing mock data)
**Need Real Data For:**
- List of all agents with status
- Agent details (name, framework, last_active, request_count, success_rate, latency)
- Agent network/communication topology
- Agent registration/configuration

**Suggested Endpoints:**
```
GET /api/v1/agents
GET /api/v1/agents/{id}
GET /api/v1/agents/network
POST /api/v1/agents (for registration)
```

### 3. **Workflows / BrikkFlows** (Not yet built - need data structure)
**Need Real Data For:**
- List of workflows
- Workflow definitions (triggers, conditions, actions)
- Workflow execution history
- Workflow templates

**Suggested Endpoints:**
```
GET /api/v1/workflows
GET /api/v1/workflows/{id}
POST /api/v1/workflows
GET /api/v1/workflows/templates
```

### 4. **Usage & Billing** (Not yet built)
**Need Real Data For:**
- API usage by time period
- Cost breakdown by service/agent
- Current billing plan
- Usage limits and quotas
- Invoice history

**Suggested Endpoints:**
```
GET /api/v1/usage?start_date=X&end_date=Y
GET /api/v1/billing/current
GET /api/v1/billing/invoices
```

### 5. **Security & Audit** (Not yet built)
**Need Real Data For:**
- Audit log entries
- API keys list
- User roles and permissions
- Security events

**Suggested Endpoints:**
```
GET /api/v1/audit/logs
GET /api/v1/api-keys
GET /api/v1/security/events
```

### 6. **Analytics** (Not yet built)
**Need Real Data For:**
- Performance metrics (latency, throughput)
- Error rates and types
- Cost trends
- Predictive analytics

**Suggested Endpoints:**
```
GET /api/v1/analytics/performance
GET /api/v1/analytics/errors
GET /api/v1/analytics/costs
```

### 7. **Marketplace** (Not yet built - feature flagged)
**Need Real Data For:**
- Available agents in marketplace
- Agent pricing and licensing
- Installed agents

**Suggested Endpoints:**
```
GET /api/v1/marketplace/agents
POST /api/v1/marketplace/agents/{id}/install
GET /api/v1/marketplace/installed
```

---

## Temporary Implementation Strategy

Until API endpoints are confirmed, I will:

1. **Create API Service Layer** with proper error handling
2. **Add Loading States** (skeleton loaders) everywhere
3. **Add Empty States** with clear messaging
4. **Add Error Boundaries** for graceful failures
5. **Build UI Structure** so it's ready to plug in real data
6. **Document Expected Data Shapes** in TypeScript interfaces

**NO MOCK DATA will be shown** - only:
- Loading states while fetching
- Empty states when no data
- Error states when API fails
- Real data when available

---

## Questions to Answer Tomorrow

1. Where is the API documentation?
2. What authentication method should dashboard use for API calls?
3. Are there any existing API client libraries or SDKs?
4. What's the rate limiting policy?
5. Are there different API keys for dev/staging/production?
6. Is there a test/sandbox API environment?
7. What's the expected response time for dashboard queries?
8. Are there any GraphQL endpoints or is it all REST?
9. Is there WebSocket support for real-time updates?
10. What's the pagination strategy for list endpoints?

---

## Next Steps

- [ ] Get API documentation from Eric
- [ ] Test authentication flow with real API
- [ ] Create TypeScript interfaces for all API responses
- [ ] Build API service layer with proper error handling
- [ ] Replace all mock data with real API calls
- [ ] Add loading/empty/error states everywhere
- [ ] Test with real data

