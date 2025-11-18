# Brikk Dashboard - Complete Endpoint Audit

**Date:** 2025-11-18  
**Backend:** https://brikk-production-9913.up.railway.app  
**Status:** Checking all frontend → backend API mappings

---

## ✅ WORKING ENDPOINTS

### System Health
- `GET /health` → ✅ Backend exists (line 1490)
- `GET /` → ✅ Backend exists (gateway info)

### Usage & Costs
- `GET /api/usage/aggregate` → ✅ Backend exists (line 93)
- `GET /api/costs/by-provider` → ✅ Backend exists (line 149)
- `GET /api/usage/summary` → ✅ Backend exists (line 1018)
- `GET /api/usage/timeseries` → ✅ Backend exists (line 1082)

### Agents
- `GET /api/agents` → ✅ Backend exists (line 196)
- `GET /api/agents/{agent_id}` → ✅ Backend exists (line 237)
- `POST /api/agents/{agent_id}/pause` → ✅ Backend exists (line 281)
- `POST /api/agents/{agent_id}/resume` → ✅ Backend exists (line 293)
- `GET /api/agents/network` → ✅ Backend exists (line 1155)

### Workflows (BrikkFlows)
- `GET /api/workflows` → ✅ Backend exists (line 661)
- `GET /api/workflows/{workflow_id}` → ✅ Backend exists (line 694)
- `POST /api/workflows` → ✅ Backend exists (line 734)
- `PUT /api/workflows/{workflow_id}` → ✅ Backend exists (line 773)
- `DELETE /api/workflows/{workflow_id}` → ✅ Backend exists (line 833)

### Security
- `GET /api/security/api-keys` → ✅ Backend exists (line 309)
- `POST /api/security/api-keys` → ✅ Backend exists (line 346)
- `DELETE /api/security/api-keys/{key_id}` → ✅ Backend exists (line 388)
- `GET /api/security/audit-logs` → ✅ Backend exists (line 414)

### Analytics
- `GET /api/analytics/top-agents` → ✅ Backend exists (line 449)
- `GET /api/analytics/errors` → ✅ Backend exists (line 488)
- `GET /api/analytics/latency` → ✅ Backend exists (line 526)

### Marketplace
- `GET /api/marketplace/agents` → ✅ Backend exists (line 580)
- `POST /api/marketplace/agents/{agent_id}/install` → ✅ Backend exists (line 610)

### Help
- `POST /api/help/chat` → ✅ Backend exists (line 626)

### Billing
- `GET /api/billing/plan` → ✅ Backend exists (line 868)
- `GET /api/billing/invoices` → ✅ Backend exists (line 930)
- `GET /api/subscriptions/current` → ✅ Backend exists (line 1376)
- `POST /api/billing/checkout-complete` → ✅ Backend exists (line 1432)

### Organization & Users
- `GET /api/org/me` → ✅ Backend exists (line 953)
- `GET /api/users/me` → ✅ Backend exists (line 1325)
- `POST /api/users/sync` → ✅ Backend exists (line 1218)

---

## ⚠️ POTENTIAL ISSUES TO CHECK

### 1. Frontend calls `/api/agents` but expects `AgentListResponse`
**Frontend type:**
```typescript
{
  data: Agent[];
  has_more: boolean;
  next_cursor?: string;
}
```

**Backend returns:** `List[AgentListResponse]` (direct array, not wrapped)

**Fix needed:** Backend should return:
```python
{
  "data": [...],
  "has_more": False,
  "next_cursor": None
}
```

### 2. Frontend calls `/api/workflows` but expects `FlowListResponse`
**Frontend type:**
```typescript
{
  data: Flow[];
  has_more: boolean;
  next_cursor?: string;
}
```

**Backend returns:** `List[WorkflowResponse]` (direct array, not wrapped)

**Fix needed:** Same as above - needs pagination wrapper

### 3. Frontend calls `/api/security/api-keys` but expects `ApiKeyListResponse`
**Frontend type:**
```typescript
{
  data: ApiKey[];
  has_more: boolean;
  next_cursor?: string;
}
```

**Backend returns:** `List[ApiKeyResponse]` (direct array, not wrapped)

**Fix needed:** Same pagination wrapper needed

### 4. Frontend calls `/api/billing/invoices` but expects `InvoiceListResponse`
**Frontend type:**
```typescript
{
  data: Invoice[];
  has_more: boolean;
  next_cursor?: string;
}
```

**Backend returns:** `List[InvoiceResponse]` (direct array, not wrapped)

**Fix needed:** Same pagination wrapper needed

### 5. Marketplace endpoint response format
**Frontend expects:**
```typescript
{
  data: MarketplaceAgent[];
  has_more: boolean;
}
```

**Backend returns:** `MarketplaceListResponse` - need to verify structure

---

## 🔧 FIXES REQUIRED

### Priority 1: Add Pagination Wrappers
All list endpoints should return:
```python
{
  "data": [...],
  "has_more": bool,
  "next_cursor": Optional[str]
}
```

**Endpoints to fix:**
1. `GET /api/agents` (line 196)
2. `GET /api/workflows` (line 661)
3. `GET /api/security/api-keys` (line 309)
4. `GET /api/security/audit-logs` (line 414)
5. `GET /api/billing/invoices` (line 930)

### Priority 2: Verify Response Models Match Frontend Types
Need to check:
- `UsageAggregate` structure
- `CostsByProvider` structure (array vs object)
- `MarketplaceListResponse` structure
- `AuditLogResponse` structure

---

## 📋 NEXT STEPS

1. ✅ Auth0 integration added to frontend
2. ⏳ Fix pagination wrappers in backend
3. ⏳ Verify all response model structures
4. ⏳ Test each endpoint with real Auth0 token
5. ⏳ Update frontend types if needed

---

## 🎯 TESTING CHECKLIST

Once Auth0 callback URL is configured:

- [ ] Login with Auth0
- [ ] Overview page loads with real data
- [ ] Agents page loads agent list
- [ ] Workflows page loads workflows
- [ ] Analytics page shows metrics
- [ ] Marketplace shows available agents
- [ ] Security page shows API keys
- [ ] Billing page shows plan info
- [ ] Help chat works
- [ ] All charts render correctly
