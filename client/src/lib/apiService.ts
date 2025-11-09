/**
 * Brikk API Service Layer
 * 
 * Centralized API client for all dashboard API calls.
 * Uses real API endpoints - NO MOCK DATA.
 * 
 * All functions return proper loading/error states.
 */

const API_BASE_URL = "https://api.getbrikk.com";

export interface ApiResponse<T> {
  data: T | null;
  error: string | null;
  loading: boolean;
}

export interface ApiError {
  message: string;
  status?: number;
  code?: string;
}

/**
 * Generic API fetch with error handling
 */
async function apiFetch<T>(
  endpoint: string,
  options?: RequestInit
): Promise<T> {
  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...options,
      headers: {
        "Content-Type": "application/json",
        ...options?.headers,
      },
    });

    if (!response.ok) {
      throw new Error(`API Error: ${response.status} ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error(`API fetch error for ${endpoint}:`, error);
    throw error;
  }
}

/**
 * Health Check
 */
export interface HealthStatus {
  service: string;
  version: string;
  status: string;
}

export async function getHealthStatus(): Promise<HealthStatus> {
  return apiFetch<HealthStatus>("/health");
}

/**
 * Dashboard Overview Metrics
 * TODO: Update endpoint when API documentation is available
 */
export interface OverviewMetrics {
  totalRequestsToday: number;
  successRate: number;
  totalSpend: number;
  activeAgents: number;
  timestamp: string;
}

export async function getOverviewMetrics(): Promise<OverviewMetrics> {
  // TODO: Replace with real endpoint once API docs are available
  // return apiFetch<OverviewMetrics>("/api/v1/metrics/overview");
  throw new Error("API endpoint not yet configured. See API_QUESTIONS.md");
}

/**
 * Time Series Data for Charts
 */
export interface TimeSeriesDataPoint {
  time: string;
  requests: number;
}

export async function getTimeSeriesData(
  period: string = "24h",
  interval: string = "1h"
): Promise<TimeSeriesDataPoint[]> {
  // TODO: Replace with real endpoint
  // return apiFetch<TimeSeriesDataPoint[]>(`/api/v1/metrics/timeseries?period=${period}&interval=${interval}`);
  throw new Error("API endpoint not yet configured. See API_QUESTIONS.md");
}

/**
 * Agent Usage Data
 */
export interface AgentUsage {
  name: string;
  requests: number;
}

export async function getAgentUsage(
  period: string = "24h",
  limit: number = 5
): Promise<AgentUsage[]> {
  // TODO: Replace with real endpoint
  // return apiFetch<AgentUsage[]>(`/api/v1/agents/usage?period=${period}&limit=${limit}`);
  throw new Error("API endpoint not yet configured. See API_QUESTIONS.md");
}

/**
 * Recent Events
 */
export interface Event {
  id: string;
  type: "success" | "warning" | "error" | "info";
  agent: string;
  message: string;
  timestamp: string;
}

export async function getRecentEvents(limit: number = 20): Promise<Event[]> {
  // TODO: Replace with real endpoint
  // return apiFetch<Event[]>(`/api/v1/events/recent?limit=${limit}`);
  throw new Error("API endpoint not yet configured. See API_QUESTIONS.md");
}

/**
 * Agent List
 */
export interface Agent {
  id: string;
  name: string;
  status: "active" | "idle" | "error";
  framework: string;
  lastActive: string;
  requests24h: number;
  successRate: number;
  avgLatency: number;
  starred?: boolean;
}

export async function getAgents(): Promise<Agent[]> {
  // TODO: Replace with real endpoint
  // return apiFetch<Agent[]>("/api/v1/agents");
  throw new Error("API endpoint not yet configured. See API_QUESTIONS.md");
}

/**
 * Agent Details
 */
export interface AgentDetails extends Agent {
  description?: string;
  createdAt: string;
  updatedAt: string;
  configuration?: Record<string, any>;
}

export async function getAgentDetails(agentId: string): Promise<AgentDetails> {
  // TODO: Replace with real endpoint
  // return apiFetch<AgentDetails>(`/api/v1/agents/${agentId}`);
  throw new Error("API endpoint not yet configured. See API_QUESTIONS.md");
}

/**
 * Agent Network Topology
 */
export interface AgentConnection {
  source: string;
  target: string;
  messageCount: number;
  active: boolean;
}

export interface AgentNetworkTopology {
  agents: Agent[];
  connections: AgentConnection[];
}

export async function getAgentNetwork(): Promise<AgentNetworkTopology> {
  // TODO: Replace with real endpoint
  // return apiFetch<AgentNetworkTopology>("/api/v1/agents/network");
  throw new Error("API endpoint not yet configured. See API_QUESTIONS.md");
}

/**
 * Workflows
 */
export interface Workflow {
  id: string;
  name: string;
  description?: string;
  status: "active" | "paused" | "draft";
  triggers: any[];
  actions: any[];
  createdAt: string;
  updatedAt: string;
}

export async function getWorkflows(): Promise<Workflow[]> {
  // TODO: Replace with real endpoint
  // return apiFetch<Workflow[]>("/api/v1/workflows");
  throw new Error("API endpoint not yet configured. See API_QUESTIONS.md");
}

/**
 * Usage & Billing
 */
export interface UsageData {
  period: string;
  apiCalls: number;
  tokensUsed: number;
  cost: number;
}

export interface BillingInfo {
  plan: string;
  usageLimit: number;
  currentUsage: number;
  billingCycle: string;
  nextBillingDate: string;
}

export async function getUsageData(
  startDate: string,
  endDate: string
): Promise<UsageData[]> {
  // TODO: Replace with real endpoint
  // return apiFetch<UsageData[]>(`/api/v1/usage?start_date=${startDate}&end_date=${endDate}`);
  throw new Error("API endpoint not yet configured. See API_QUESTIONS.md");
}

export async function getBillingInfo(): Promise<BillingInfo> {
  // TODO: Replace with real endpoint
  // return apiFetch<BillingInfo>("/api/v1/billing/current");
  throw new Error("API endpoint not yet configured. See API_QUESTIONS.md");
}

/**
 * Audit Logs
 */
export interface AuditLogEntry {
  id: string;
  timestamp: string;
  user: string;
  action: string;
  resource: string;
  details?: Record<string, any>;
}

export async function getAuditLogs(
  limit: number = 50,
  offset: number = 0
): Promise<AuditLogEntry[]> {
  // TODO: Replace with real endpoint
  // return apiFetch<AuditLogEntry[]>(`/api/v1/audit/logs?limit=${limit}&offset=${offset}`);
  throw new Error("API endpoint not yet configured. See API_QUESTIONS.md");
}

/**
 * Analytics
 */
export interface PerformanceMetrics {
  avgLatency: number;
  p50Latency: number;
  p95Latency: number;
  p99Latency: number;
  throughput: number;
  errorRate: number;
}

export async function getPerformanceMetrics(
  period: string = "24h"
): Promise<PerformanceMetrics> {
  // TODO: Replace with real endpoint
  // return apiFetch<PerformanceMetrics>(`/api/v1/analytics/performance?period=${period}`);
  throw new Error("API endpoint not yet configured. See API_QUESTIONS.md");
}

/**
 * Marketplace
 */
export interface MarketplaceAgent {
  id: string;
  name: string;
  description: string;
  category: string;
  pricing: {
    type: "free" | "paid" | "subscription";
    amount?: number;
  };
  rating: number;
  installs: number;
}

export async function getMarketplaceAgents(): Promise<MarketplaceAgent[]> {
  // TODO: Replace with real endpoint
  // return apiFetch<MarketplaceAgent[]>("/api/v1/marketplace/agents");
  throw new Error("API endpoint not yet configured. See API_QUESTIONS.md");
}

