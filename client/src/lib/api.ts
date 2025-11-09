/**
 * Brikk API Adapter Layer
 * 
 * Centralized API client for Railway backend integration.
 * All pages must import from this adapter - NO direct fetch calls.
 * 
 * Backend: https://brikk-production-9913.up.railway.app
 */

import type {
  Org,
  User,
  Agent,
  AgentListResponse,
  Flow,
  FlowListResponse,
  UsageAggregate,
  CostsByProvider,
  Invoice,
  InvoiceListResponse,
  BillingPlan,
  ApiKey,
  ApiKeyCreate,
  ApiKeyListResponse,
  AuditEvent,
  AuditLogResponse,
  TopAgent,
  TopError,
  LatencyMetrics,
  MarketplaceAgent,
  MarketplaceListResponse,
  HelpChecklist,
  SupportTicket,
  HealthStatus,
  GatewayInfo,
  ApiError,
  PaginationParams,
} from '@/types/api';

// ============================================================================
// Configuration
// ============================================================================

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://brikk-production-9913.up.railway.app';

// Feature Flags
export const FF = {
  analytics: true,
  marketplace: true,
  helpbot: true,
};

// ============================================================================
// Helper Functions
// ============================================================================

/**
 * Get Auth0 access token from localStorage or session
 */
function getAccessToken(): string | null {
  // TODO: Integrate with Auth0 hook/context
  // For now, return null and handle gracefully
  return localStorage.getItem('auth0_access_token');
}

/**
 * Get current organization ID
 */
function getOrgId(): string | null {
  // TODO: Get from user context
  return localStorage.getItem('brikk_org_id') || 'org_default';
}

/**
 * Build headers for API requests
 */
function buildHeaders(token?: string | null, orgId?: string | null): HeadersInit {
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
  };

  const accessToken = token ?? getAccessToken();
  if (accessToken) {
    headers['Authorization'] = `Bearer ${accessToken}`;
  }

  const org = orgId ?? getOrgId();
  if (org) {
    headers['X-Brikk-Org'] = org;
  }

  return headers;
}

/**
 * Handle API errors and log telemetry
 */
function handleApiError(error: any, endpoint: string): never {
  console.error(`[API Error] ${endpoint}:`, error);
  
  // Log telemetry
  const requestId = error.request_id || 'unknown';
  console.error(`[Request ID] ${requestId}`);
  
  throw error;
}

/**
 * Generic API fetch with error handling and telemetry
 */
async function apiFetch<T>(
  endpoint: string,
  options?: RequestInit,
  token?: string | null,
  orgId?: string | null
): Promise<T> {
  const startTime = performance.now();
  const url = `${API_BASE_URL}${endpoint}`;

  try {
    const response = await fetch(url, {
      ...options,
      headers: {
        ...buildHeaders(token, orgId),
        ...options?.headers,
      },
    });

    const endTime = performance.now();
    const duration = endTime - startTime;

    // Log telemetry
    console.log(`[API] ${options?.method || 'GET'} ${endpoint} - ${response.status} (${duration.toFixed(0)}ms)`);

    if (!response.ok) {
      const errorData: ApiError = await response.json().catch(() => ({
        error: response.statusText,
        code: `HTTP_${response.status}`,
      }));
      handleApiError(errorData, endpoint);
    }

    // Handle 204 No Content
    if (response.status === 204) {
      return {} as T;
    }

    return await response.json();
  } catch (error) {
    const endTime = performance.now();
    const duration = endTime - startTime;
    console.error(`[API] ${options?.method || 'GET'} ${endpoint} - ERROR (${duration.toFixed(0)}ms)`, error);
    throw error;
  }
}

// ============================================================================
// System Endpoints
// ============================================================================

export async function getHealth(): Promise<HealthStatus> {
  return apiFetch<HealthStatus>('/health');
}

export async function getGatewayInfo(): Promise<GatewayInfo> {
  return apiFetch<GatewayInfo>('/');
}

// ============================================================================
// Org & User Endpoints
// ============================================================================

export async function getCurrentOrg(token?: string): Promise<Org> {
  return apiFetch<Org>('/v1/orgs/current', {}, token);
}

export async function getCurrentUser(token?: string): Promise<User> {
  return apiFetch<User>('/v1/users/me', {}, token);
}

// ============================================================================
// Agent Endpoints
// ============================================================================

export async function getAgents(params?: {
  status?: 'active' | 'disabled';
  limit?: number;
  cursor?: string;
  token?: string;
  orgId?: string;
}): Promise<AgentListResponse> {
  const searchParams = new URLSearchParams();
  if (params?.status) searchParams.set('status', params.status);
  if (params?.limit) searchParams.set('limit', params.limit.toString());
  if (params?.cursor) searchParams.set('cursor', params.cursor);

  const query = searchParams.toString();
  const endpoint = `/v1/agents${query ? `?${query}` : ''}`;

  return apiFetch<AgentListResponse>(endpoint, {}, params?.token, params?.orgId);
}

export async function createAgent(data: Partial<Agent>, token?: string, orgId?: string): Promise<Agent> {
  return apiFetch<Agent>('/v1/agents', {
    method: 'POST',
    body: JSON.stringify(data),
  }, token, orgId);
}

export async function updateAgent(
  agentId: string,
  data: Partial<Agent>,
  token?: string,
  orgId?: string
): Promise<Agent> {
  return apiFetch<Agent>(`/v1/agents/${agentId}`, {
    method: 'PATCH',
    body: JSON.stringify(data),
  }, token, orgId);
}

export async function pauseAgent(agentId: string, token?: string, orgId?: string): Promise<void> {
  return apiFetch<void>(`/v1/agents/${agentId}:pause`, {
    method: 'POST',
  }, token, orgId);
}

export async function resumeAgent(agentId: string, token?: string, orgId?: string): Promise<void> {
  return apiFetch<void>(`/v1/agents/${agentId}:resume`, {
    method: 'POST',
  }, token, orgId);
}

// ============================================================================
// BrikkFlows Endpoints
// ============================================================================

export async function getFlows(params?: PaginationParams & { token?: string; orgId?: string }): Promise<FlowListResponse> {
  const searchParams = new URLSearchParams();
  if (params?.limit) searchParams.set('limit', params.limit.toString());
  if (params?.cursor) searchParams.set('cursor', params.cursor);

  const query = searchParams.toString();
  const endpoint = `/v1/flows${query ? `?${query}` : ''}`;

  return apiFetch<FlowListResponse>(endpoint, {}, params?.token, params?.orgId);
}

export async function getFlow(flowId: string, token?: string, orgId?: string): Promise<Flow> {
  return apiFetch<Flow>(`/v1/flows/${flowId}`, {}, token, orgId);
}

export async function createFlow(data: Partial<Flow>, token?: string, orgId?: string): Promise<Flow> {
  return apiFetch<Flow>('/v1/flows', {
    method: 'POST',
    body: JSON.stringify(data),
  }, token, orgId);
}

export async function updateFlow(
  flowId: string,
  data: Partial<Flow>,
  token?: string,
  orgId?: string
): Promise<Flow> {
  return apiFetch<Flow>(`/v1/flows/${flowId}`, {
    method: 'PATCH',
    body: JSON.stringify(data),
  }, token, orgId);
}

export async function publishFlow(flowId: string, token?: string, orgId?: string): Promise<void> {
  return apiFetch<void>(`/v1/flows/${flowId}:publish`, {
    method: 'POST',
  }, token, orgId);
}

// ============================================================================
// Usage & Cost Endpoints
// ============================================================================

export async function getUsageAggregate(params: {
  range: string; // e.g., "7d", "24h", "30d"
  granularity: string; // e.g., "hour", "day"
  token?: string;
  orgId?: string;
}): Promise<UsageAggregate> {
  const searchParams = new URLSearchParams({
    range: params.range,
    granularity: params.granularity,
  });

  return apiFetch<UsageAggregate>(
    `/v1/usage/aggregate?${searchParams.toString()}`,
    {},
    params.token,
    params.orgId
  );
}

export async function getCostsByProvider(params: {
  range: string; // e.g., "30d"
  granularity: string; // e.g., "day"
  token?: string;
  orgId?: string;
}): Promise<CostsByProvider> {
  const searchParams = new URLSearchParams({
    range: params.range,
    granularity: params.granularity,
  });

  return apiFetch<CostsByProvider>(
    `/v1/costs/by-provider?${searchParams.toString()}`,
    {},
    params.token,
    params.orgId
  );
}

// ============================================================================
// Billing Endpoints
// ============================================================================

export async function getBillingPlan(token?: string, orgId?: string): Promise<BillingPlan> {
  return apiFetch<BillingPlan>('/v1/billing/plan', {}, token, orgId);
}

export async function getInvoices(params?: PaginationParams & { token?: string; orgId?: string }): Promise<InvoiceListResponse> {
  const searchParams = new URLSearchParams();
  if (params?.limit) searchParams.set('limit', params.limit.toString());
  if (params?.cursor) searchParams.set('cursor', params.cursor);

  const query = searchParams.toString();
  const endpoint = `/v1/billing/invoices${query ? `?${query}` : ''}`;

  return apiFetch<InvoiceListResponse>(endpoint, {}, params?.token, params?.orgId);
}

// ============================================================================
// Security Endpoints
// ============================================================================

export async function getApiKeys(params?: PaginationParams & { token?: string; orgId?: string }): Promise<ApiKeyListResponse> {
  const searchParams = new URLSearchParams();
  if (params?.limit) searchParams.set('limit', params.limit.toString());
  if (params?.cursor) searchParams.set('cursor', params.cursor);

  const query = searchParams.toString();
  const endpoint = `/v1/api-keys${query ? `?${query}` : ''}`;

  return apiFetch<ApiKeyListResponse>(endpoint, {}, params?.token, params?.orgId);
}

export async function createApiKey(data: { name?: string; scopes?: string[] }, token?: string, orgId?: string): Promise<ApiKeyCreate> {
  return apiFetch<ApiKeyCreate>('/v1/api-keys', {
    method: 'POST',
    body: JSON.stringify(data),
  }, token, orgId);
}

export async function revokeApiKey(keyId: string, token?: string, orgId?: string): Promise<void> {
  return apiFetch<void>(`/v1/api-keys/${keyId}:revoke`, {
    method: 'POST',
  }, token, orgId);
}

export async function getAuditLogs(params: {
  actor?: string;
  action?: string;
  range?: string;
  limit?: number;
  cursor?: string;
  token?: string;
  orgId?: string;
}): Promise<AuditLogResponse> {
  const searchParams = new URLSearchParams();
  if (params.actor) searchParams.set('actor', params.actor);
  if (params.action) searchParams.set('action', params.action);
  if (params.range) searchParams.set('range', params.range);
  if (params.limit) searchParams.set('limit', params.limit.toString());
  if (params.cursor) searchParams.set('cursor', params.cursor);

  const query = searchParams.toString();
  const endpoint = `/v1/audit${query ? `?${query}` : ''}`;

  return apiFetch<AuditLogResponse>(endpoint, {}, params.token, params.orgId);
}

// ============================================================================
// Developer Tools Endpoints
// ============================================================================

export async function proxyApiCall(data: {
  method: string;
  endpoint: string;
  body?: any;
  token?: string;
  orgId?: string;
}): Promise<any> {
  return apiFetch<any>('/v1/dev/proxy', {
    method: 'POST',
    body: JSON.stringify({
      method: data.method,
      endpoint: data.endpoint,
      body: data.body,
    }),
  }, data.token, data.orgId);
}

export async function getOpenApiSpec(token?: string, orgId?: string): Promise<any> {
  return apiFetch<any>('/v1/dev/openapi.json', {}, token, orgId);
}

// ============================================================================
// Analytics Endpoints (Phase 9)
// ============================================================================

export async function getTopAgents(params: {
  range: string;
  token?: string;
  orgId?: string;
}): Promise<{ data: TopAgent[] }> {
  const searchParams = new URLSearchParams({ range: params.range });
  return apiFetch<{ data: TopAgent[] }>(
    `/v1/analytics/top-agents?${searchParams.toString()}`,
    {},
    params.token,
    params.orgId
  );
}

export async function getTopErrors(params: {
  range: string;
  token?: string;
  orgId?: string;
}): Promise<{ data: TopError[] }> {
  const searchParams = new URLSearchParams({ range: params.range });
  return apiFetch<{ data: TopError[] }>(
    `/v1/analytics/top-errors?${searchParams.toString()}`,
    {},
    params.token,
    params.orgId
  );
}

export async function getLatencyMetrics(params: {
  range: string;
  granularity: string;
  token?: string;
  orgId?: string;
}): Promise<LatencyMetrics> {
  const searchParams = new URLSearchParams({
    range: params.range,
    granularity: params.granularity,
  });
  return apiFetch<LatencyMetrics>(
    `/v1/analytics/latency?${searchParams.toString()}`,
    {},
    params.token,
    params.orgId
  );
}

// ============================================================================
// Marketplace Endpoints (Phase 10)
// ============================================================================

export async function getMarketplaceAgents(params?: PaginationParams & { token?: string; orgId?: string }): Promise<MarketplaceListResponse> {
  const searchParams = new URLSearchParams();
  if (params?.limit) searchParams.set('limit', params.limit.toString());
  if (params?.cursor) searchParams.set('cursor', params.cursor);

  const query = searchParams.toString();
  const endpoint = `/v1/marketplace/agents${query ? `?${query}` : ''}`;

  return apiFetch<MarketplaceListResponse>(endpoint, {}, params?.token, params?.orgId);
}

export async function installMarketplaceAgent(agentId: string, token?: string, orgId?: string): Promise<void> {
  return apiFetch<void>(`/v1/marketplace/agents/${agentId}:install`, {
    method: 'POST',
  }, token, orgId);
}

// ============================================================================
// Help & Onboarding Endpoints (Phase 11)
// ============================================================================

export async function getHelpChecklist(token?: string, orgId?: string): Promise<HelpChecklist> {
  return apiFetch<HelpChecklist>('/v1/help/checklist', {}, token, orgId);
}

export async function createSupportTicket(data: SupportTicket, token?: string, orgId?: string): Promise<void> {
  return apiFetch<void>('/v1/help/contact', {
    method: 'POST',
    body: JSON.stringify(data),
  }, token, orgId);
}



// Chat message type for BrikkBot
export interface ChatMessage {
  role: "user" | "assistant";
  content: string;
  timestamp: string;
}

export async function chatWithBrikkBot(params: {
  message: string;
  context?: Record<string, any>;
  token?: string;
  orgId?: string;
}): Promise<{ message: string }> {
  return apiFetch<{ message: string }>('/v1/help/chat', {
    method: 'POST',
    body: JSON.stringify({
      message: params.message,
      context: params.context,
    }),
  }, params.token, params.orgId);
}

