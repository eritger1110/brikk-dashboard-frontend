/**
 * Brikk API TypeScript Types
 * 
 * Based on the official API contract for Railway backend:
 * https://brikk-production-9913.up.railway.app
 */

// ============================================================================
// Core Types
// ============================================================================

export type Org = {
  id: string;
  name: string;
  plan: 'free' | 'starter' | 'pro' | 'enterprise';
  limits: Record<string, number>;
};

export type User = {
  id: string;
  email: string;
  roles: string[];
};

// ============================================================================
// Agent Types
// ============================================================================

export type AgentStatus = 'active' | 'paused' | 'error';

export type Agent = {
  id: string;
  name: string;
  status: AgentStatus;
  throughput_1h: number;
  success_rate_24h: number;
  owner: string;
  tags: string[];
  last_seen: string;
};

export type AgentListResponse = {
  data: Agent[];
  has_more: boolean;
  next_cursor?: string;
};

// ============================================================================
// Workflow (BrikkFlows) Types
// ============================================================================

export type FlowNode = {
  id: string;
  type: string;
  label: string;
};

export type FlowEdge = {
  id: string;
  from: string;
  to: string;
};

export type Flow = {
  id: string;
  name: string;
  published: boolean;
  graph: {
    nodes: FlowNode[];
    edges: FlowEdge[];
  };
};

export type FlowListResponse = {
  data: Flow[];
  has_more: boolean;
  next_cursor?: string;
};

// ============================================================================
// Usage & Cost Types
// ============================================================================

export type SeriesPoint = [string, number]; // [ISO8601 timestamp, value]

export type MetricSeries = {
  metric: string;
  points: SeriesPoint[];
};

export type UsageAggregate = {
  series: MetricSeries[];
};

export type ProviderCostSeries = {
  name: string;
  currency: 'USD';
  points: SeriesPoint[];
};

export type CostsByProvider = {
  providers: ProviderCostSeries[];
  forecast_30d: number;
};

// ============================================================================
// Billing Types
// ============================================================================

export type InvoiceStatus = 'paid' | 'open' | 'void';

export type Invoice = {
  id: string;
  period: string;
  amount: number;
  currency: 'USD' | 'EUR';
  status: InvoiceStatus;
  url?: string;
};

export type InvoiceListResponse = {
  data: Invoice[];
  has_more: boolean;
  next_cursor?: string;
};

export type BillingPlan = {
  plan: string;
  limits: Record<string, number>;
  overages?: Record<string, number>;
};

// ============================================================================
// Security Types
// ============================================================================

export type ApiKey = {
  id: string;
  name?: string;
  created_at: string;
  last_used?: string;
  scopes: string[];
  masked: string;
};

export type ApiKeyCreate = {
  id: string;
  secret: string; // Only shown once
};

export type ApiKeyListResponse = {
  data: ApiKey[];
  has_more: boolean;
  next_cursor?: string;
};

export type AuditEvent = {
  ts: string;
  actor: string;
  action: string;
  target?: string;
  ip?: string;
  meta?: Record<string, any>;
};

export type AuditLogResponse = {
  data: AuditEvent[];
  has_more: boolean;
  next_cursor?: string;
};

// ============================================================================
// Analytics Types
// ============================================================================

export type TopAgent = {
  id: string;
  name: string;
  requests: number;
  success_rate: number;
};

export type TopError = {
  error_type: string;
  count: number;
  recent_samples: Array<{
    timestamp: string;
    message: string;
    agent_id?: string;
  }>;
};

export type LatencyMetrics = {
  series: Array<{
    metric: 'p50' | 'p95' | 'p99';
    points: SeriesPoint[];
  }>;
};

// ============================================================================
// Marketplace Types
// ============================================================================

export type MarketplaceAgent = {
  id: string;
  name: string;
  description: string;
  category: string;
  pricing: {
    type: 'free' | 'paid' | 'subscription';
    amount?: number;
  };
  rating: number;
  installs: number;
  tags: string[];
  icon_url?: string;
};

export type MarketplaceListResponse = {
  data: MarketplaceAgent[];
  has_more: boolean;
  next_cursor?: string;
};

// ============================================================================
// Help & Onboarding Types
// ============================================================================

export type ChecklistStep = {
  id: string;
  title: string;
  description: string;
  completed: boolean;
  url?: string;
};

export type HelpChecklist = {
  steps: ChecklistStep[];
  completion_percentage: number;
};

export type SupportTicket = {
  subject: string;
  message: string;
  priority?: 'low' | 'medium' | 'high';
};

// ============================================================================
// System Types
// ============================================================================

export type HealthStatus = {
  status: 'healthy' | 'degraded' | 'down';
  timestamp: string;
};

export type GatewayInfo = {
  service: string;
  version: string;
  status: 'operational' | 'maintenance';
};

// ============================================================================
// Error Types
// ============================================================================

export type ApiError = {
  error: string;
  code: string;
  hint?: string;
  request_id?: string;
};

// ============================================================================
// Pagination Types
// ============================================================================

export type PaginationParams = {
  limit?: number;
  cursor?: string;
};

export type PaginatedResponse<T> = {
  data: T[];
  has_more: boolean;
  next_cursor?: string;
};

