// BrikkFlows API Types
// Generated from brikkflows_schemas.json

export type FlowStatus = 'active' | 'paused' | 'draft';

export type ExecutionState = 'succeeded' | 'failed' | 'running' | 'canceled';

export type AlertType = 'latency' | 'error' | 'cost' | 'other';

export type AlertState = 'open' | 'acked' | 'resolved';

export type ProviderStatus = 'operational' | 'degraded' | 'down';

export type IntegrationState = 'connected' | 'needs_attention' | 'error' | 'disconnected';

export interface Node {
  type: string;
  config: Record<string, any>;
}

export interface Flow {
  id: string;
  name: string;
  status: FlowStatus;
  version?: string;
  triggers: Node[];
  conditions?: Node[];
  actions: Node[];
  tags?: string[];
  createdBy?: string;
  updatedAt: string;
}

export interface Execution {
  id: string;
  flowId: string;
  state: ExecutionState;
  startedAt: string;
  endedAt?: string;
  latencyMs?: number;
  costUsd?: number;
  providerBreakdown?: Record<string, number>;
}

export interface AuditEvent {
  id: string;
  type: string;
  actor: {
    id: string;
    ip?: string;
  };
  target?: Record<string, any>;
  diff?: Record<string, any>;
  hash?: string;
  ts: string;
}

export interface MetricsOverview {
  activeFlows?: number;
  exec24h?: number;
  successRate?: number;
  cost24h?: number;
  sparklines?: Record<string, any>;
}

export interface ProviderHealth {
  provider: string;
  status: ProviderStatus;
  avgLatencyMs?: number;
  calls24h?: number;
}

export interface Alert {
  id: string;
  type: AlertType;
  state: AlertState;
  message?: string;
  flowId?: string;
  createdAt: string;
}

export interface IntegrationStatus {
  key: string;
  state: IntegrationState;
  updatedAt?: string;
}

export interface GraphNode {
  id: string;
  type: string;
}

export interface GraphEdge {
  from: string;
  to: string;
  latencyMs?: number;
  tps?: number;
  errorRate?: number;
}

export interface Graph {
  nodes?: GraphNode[];
  edges?: GraphEdge[];
}

// Request/Response types

export interface FlowsListParams {
  status?: FlowStatus;
  q?: string;
  page?: number;
  sort?: string;
}

export interface ExecutionsListParams {
  flowId?: string;
  state?: ExecutionState;
  from?: string;
  to?: string;
  page?: number;
}

export interface AuditListParams {
  type?: string;
  actor?: string;
  from?: string;
  to?: string;
  page?: number;
}

export interface AlertsListParams {
  state?: AlertState;
  type?: AlertType;
}

export interface SimulateRequest {
  input: Record<string, any>;
  trace?: boolean;
}

export interface SimulateResponse {
  wouldTrigger: boolean;
  path: string[];
  estimatedCostUsd: number;
  traceId: string;
}

export interface ApiError {
  error: {
    code: string;
    message: string;
    fields?: Record<string, string>;
  };
}

// Pagination wrapper
export interface PaginatedResponse<T> {
  data: T[];
  page: number;
  pageSize: number;
  total: number;
  hasMore: boolean;
}

