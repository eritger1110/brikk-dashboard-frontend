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
  return apiFetch<Org>('/api/org/me', {}, token);
}

export async function getCurrentUser(token?: string): Promise<User> {
  return apiFetch<User>('/api/users/me', {}, token);
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
  const endpoint = `/api/agents${query ? `?${query}` : ''}`;

  return apiFetch<AgentListResponse>(endpoint, {}, params?.token, params?.orgId);
}

export async function createAgent(data: Partial<Agent>, token?: string, orgId?: string): Promise<Agent> {
  return apiFetch<Agent>('/api/agents', {
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
  return apiFetch<Agent>(`/api/agents/${agentId}`, {
    method: 'PATCH',
    body: JSON.stringify(data),
  }, token, orgId);
}

export async function pauseAgent(agentId: string, token?: string, orgId?: string): Promise<void> {
  return apiFetch<void>(`/api/agents/${agentId}/pause`, {
    method: 'POST',
  }, token, orgId);
}

export async function resumeAgent(agentId: string, token?: string, orgId?: string): Promise<void> {
  return apiFetch<void>(`/api/agents/${agentId}/resume`, {
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
  const endpoint = `/api/workflows${query ? `?${query}` : ''}`;

  return apiFetch<FlowListResponse>(endpoint, {}, params?.token, params?.orgId);
}

export async function getFlow(flowId: string, token?: string, orgId?: string): Promise<Flow> {
  return apiFetch<Flow>(`/api/workflows/${flowId}`, {}, token, orgId);
}

export async function createFlow(data: Partial<Flow>, token?: string, orgId?: string): Promise<Flow> {
  return apiFetch<Flow>('/api/workflows', {
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
  return apiFetch<Flow>(`/api/workflows/${flowId}`, {
    method: 'PUT',
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
    `/api/usage/aggregate?${searchParams.toString()}`,
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
    `/api/costs/by-provider?${searchParams.toString()}`,
    {},
    params.token,
    params.orgId
  );
}

// ============================================================================
// Billing Endpoints
// ============================================================================

export async function getBillingPlan(token?: string, orgId?: string): Promise<BillingPlan> {
  return apiFetch<BillingPlan>('/api/billing/plan', {}, token, orgId);
}

export async function getInvoices(params?: PaginationParams & { token?: string; orgId?: string }): Promise<InvoiceListResponse> {
  const searchParams = new URLSearchParams();
  if (params?.limit) searchParams.set('limit', params.limit.toString());
  if (params?.cursor) searchParams.set('cursor', params.cursor);

  const query = searchParams.toString();
  const endpoint = `/api/billing/invoices${query ? `?${query}` : ''}`;

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
  const endpoint = `/api/security/api-keys${query ? `?${query}` : ''}`;

  return apiFetch<ApiKeyListResponse>(endpoint, {}, params?.token, params?.orgId);
}

export async function createApiKey(data: { name?: string; scopes?: string[] }, token?: string, orgId?: string): Promise<ApiKeyCreate> {
  return apiFetch<ApiKeyCreate>('/api/security/api-keys', {
    method: 'POST',
    body: JSON.stringify(data),
  }, token, orgId);
}

export async function revokeApiKey(keyId: string, token?: string, orgId?: string): Promise<void> {
  return apiFetch<void>(`/api/security/api-keys/${keyId}`, {
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
  const endpoint = `/api/security/audit-logs${query ? `?${query}` : ''}`;

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
    `/api/analytics/top-agents?${searchParams.toString()}`,
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
    `/api/analytics/errors?${searchParams.toString()}`,
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
    `/api/analytics/latency?${searchParams.toString()}`,
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
  const endpoint = `/api/marketplace/agents${query ? `?${query}` : ''}`;

  return apiFetch<MarketplaceListResponse>(endpoint, {}, params?.token, params?.orgId);
}

export async function installMarketplaceAgent(agentId: string, token?: string, orgId?: string): Promise<void> {
  return apiFetch<void>(`/api/marketplace/agents/${agentId}/install`, {
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



// ============================================================================
// Custom Agent Builder Endpoints
// ============================================================================

export async function getAgentSkills(token?: string, orgId?: string): Promise<any> {
  return apiFetch<any>('/api/custom-agents/skills', {}, token, orgId);
}

export async function getAgentIntegrations(token?: string, orgId?: string): Promise<any> {
  return apiFetch<any>('/api/custom-agents/integrations', {}, token, orgId);
}

export async function createCustomAgent(data: any, token?: string, orgId?: string): Promise<any> {
  return apiFetch<any>('/api/custom-agents/create', {
    method: 'POST',
    body: JSON.stringify(data),
  }, token, orgId);
}

export async function validateCustomAgent(data: any, token?: string, orgId?: string): Promise<any> {
  return apiFetch<any>('/api/custom-agents/validate', {
    method: 'POST',
    body: JSON.stringify(data),
  }, token, orgId);
}

// ============================================================================
// Workflow Templates Endpoints
// ============================================================================

export async function getWorkflowTemplates(token?: string, orgId?: string): Promise<any> {
  return apiFetch<any>('/api/workflow-templates', {}, token, orgId);
}

export async function installWorkflowTemplate(data: {
  template_id: string;
  customization: any;
  token?: string;
  orgId?: string;
}): Promise<any> {
  return apiFetch<any>('/api/workflow-templates/install', {
    method: 'POST',
    body: JSON.stringify({
      template_id: data.template_id,
      customization: data.customization,
    }),
  }, data.token, data.orgId);
}

// ============================================================================
// Agent Analytics Endpoints (Extended)
// ============================================================================

export async function getAgentPerformance(params: {
  agent_id: string;
  time_range: string;
  token?: string;
  orgId?: string;
}): Promise<any> {
  const searchParams = new URLSearchParams({
    time_range: params.time_range,
  });
  return apiFetch<any>(
    `/api/analytics/agent/${params.agent_id}?${searchParams.toString()}`,
    {},
    params.token,
    params.orgId
  );
}

export async function getROIMetrics(params: {
  time_range: string;
  token?: string;
  orgId?: string;
}): Promise<any> {
  const searchParams = new URLSearchParams({
    time_range: params.time_range,
  });
  return apiFetch<any>(
    `/api/analytics/roi?${searchParams.toString()}`,
    {},
    params.token,
    params.orgId
  );
}

// ============================================================================
// Cost Optimization Endpoints
// ============================================================================

export async function getBudgets(token?: string, orgId?: string): Promise<any> {
  return apiFetch<any>(`/api/cost-optimization/budgets?org_id=${orgId || getOrgId()}`, {}, token, orgId);
}

export async function createBudget(data: any, token?: string, orgId?: string): Promise<any> {
  return apiFetch<any>('/api/cost-optimization/budgets', {
    method: 'POST',
    body: JSON.stringify(data),
  }, token, orgId);
}

export async function getOptimizationRecommendations(token?: string, orgId?: string): Promise<any> {
  return apiFetch<any>(`/api/cost-optimization/recommendations?org_id=${orgId || getOrgId()}`, {}, token, orgId);
}

export async function getCostForecast(params: {
  days: number;
  token?: string;
  orgId?: string;
}): Promise<any> {
  const searchParams = new URLSearchParams({
    org_id: params.orgId || getOrgId() || '',
    days: params.days.toString(),
  });
  return apiFetch<any>(
    `/api/cost-optimization/forecast?${searchParams.toString()}`,
    {},
    params.token,
    params.orgId
  );
}

// ============================================================================
// API Keys & Webhooks Endpoints (Extended)
// ============================================================================

export async function getWebhooks(token?: string, orgId?: string): Promise<any> {
  return apiFetch<any>(`/api/webhooks?org_id=${orgId || getOrgId()}`, {}, token, orgId);
}

export async function createWebhook(data: any, token?: string, orgId?: string): Promise<any> {
  return apiFetch<any>('/api/webhooks', {
    method: 'POST',
    body: JSON.stringify(data),
  }, token, orgId);
}

export async function getWebhookDeliveries(params: {
  webhook_id: string;
  token?: string;
  orgId?: string;
}): Promise<any> {
  return apiFetch<any>(
    `/api/webhooks/${params.webhook_id}/deliveries`,
    {},
    params.token,
    params.orgId
  );
}

// ============================================================================
// A/B Testing Endpoints
// ============================================================================

export async function getABTests(token?: string, orgId?: string): Promise<any> {
  return apiFetch<any>(`/api/ab-testing/tests?org_id=${orgId || getOrgId()}`, {}, token, orgId);
}

export async function createABTest(data: any, token?: string, orgId?: string): Promise<any> {
  return apiFetch<any>('/api/ab-testing/tests', {
    method: 'POST',
    body: JSON.stringify(data),
  }, token, orgId);
}

export async function startABTest(testId: string, token?: string, orgId?: string): Promise<any> {
  return apiFetch<any>(`/api/ab-testing/tests/${testId}/start`, {
    method: 'POST',
  }, token, orgId);
}

export async function stopABTest(testId: string, token?: string, orgId?: string): Promise<any> {
  return apiFetch<any>(`/api/ab-testing/tests/${testId}/stop`, {
    method: 'POST',
  }, token, orgId);
}

export async function startGradualRollout(data: {
  test_id: string;
  schedule: any;
  token?: string;
  orgId?: string;
}): Promise<any> {
  return apiFetch<any>(`/api/ab-testing/tests/${data.test_id}/rollout`, {
    method: 'POST',
    body: JSON.stringify({ schedule: data.schedule }),
  }, data.token, data.orgId);
}

// ============================================================================
// Agent Versioning Endpoints
// ============================================================================

export async function getAgentVersions(agentId: string, token?: string, orgId?: string): Promise<any> {
  return apiFetch<any>(`/api/versioning/agents/${agentId}/versions`, {}, token, orgId);
}

export async function createAgentVersion(data: {
  agent_id: string;
  version: string;
  changes: any;
  token?: string;
  orgId?: string;
}): Promise<any> {
  return apiFetch<any>(`/api/versioning/agents/${data.agent_id}/versions`, {
    method: 'POST',
    body: JSON.stringify({
      version: data.version,
      changes: data.changes,
    }),
  }, data.token, data.orgId);
}

export async function rollbackAgentVersion(data: {
  agent_id: string;
  version_id: string;
  token?: string;
  orgId?: string;
}): Promise<any> {
  return apiFetch<any>(`/api/versioning/agents/${data.agent_id}/rollback`, {
    method: 'POST',
    body: JSON.stringify({ version_id: data.version_id }),
  }, data.token, data.orgId);
}

// ============================================================================
// Simulation Endpoints
// ============================================================================

export async function runSimulation(data: {
  workflow_id: string;
  input: any;
  token?: string;
  orgId?: string;
}): Promise<any> {
  return apiFetch<any>('/api/simulation/run', {
    method: 'POST',
    body: JSON.stringify({
      workflow_id: data.workflow_id,
      input: data.input,
    }),
  }, data.token, data.orgId);
}

export async function getSimulationResults(simulationId: string, token?: string, orgId?: string): Promise<any> {
  return apiFetch<any>(`/api/simulation/${simulationId}/results`, {}, token, orgId);
}

// ============================================================================
// Real-time Collaboration Endpoints
// ============================================================================

export async function joinCollaborationSession(data: {
  workflow_id: string;
  user_id: string;
  token?: string;
  orgId?: string;
}): Promise<any> {
  return apiFetch<any>('/api/collaboration/join', {
    method: 'POST',
    body: JSON.stringify({
      workflow_id: data.workflow_id,
      user_id: data.user_id,
    }),
  }, data.token, data.orgId);
}

export async function getOnlineUsers(token?: string, orgId?: string): Promise<any> {
  return apiFetch<any>(`/api/collaboration/online?org_id=${orgId || getOrgId()}`, {}, token, orgId);
}

export async function getCollaborationActivity(params: {
  limit?: number;
  token?: string;
  orgId?: string;
}): Promise<any> {
  const searchParams = new URLSearchParams({
    org_id: params.orgId || getOrgId() || '',
    limit: (params.limit || 50).toString(),
  });
  return apiFetch<any>(
    `/api/collaboration/activity?${searchParams.toString()}`,
    {},
    params.token,
    params.orgId
  );
}

export async function addComment(data: {
  workflow_id: string;
  content: string;
  position?: any;
  token?: string;
  orgId?: string;
}): Promise<any> {
  return apiFetch<any>('/api/collaboration/comments', {
    method: 'POST',
    body: JSON.stringify(data),
  }, data.token, data.orgId);
}

export async function getComments(workflowId: string, token?: string, orgId?: string): Promise<any> {
  return apiFetch<any>(`/api/collaboration/comments?workflow_id=${workflowId}`, {}, token, orgId);
}

// ============================================================================
// Monitoring Endpoints (Extended)
// ============================================================================

export async function getAgentExecutionMetrics(params: {
  time_range: string;
  token?: string;
  orgId?: string;
}): Promise<any> {
  const searchParams = new URLSearchParams({
    time_range: params.time_range,
  });
  return apiFetch<any>(
    `/api/monitoring/executions?${searchParams.toString()}`,
    {},
    params.token,
    params.orgId
  );
}

export async function getSystemMetrics(token?: string, orgId?: string): Promise<any> {
  return apiFetch<any>('/api/monitoring/system', {}, token, orgId);
}
