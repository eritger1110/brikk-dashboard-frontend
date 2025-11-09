/**
 * API Client for Brikk Rules Dashboard
 * 
 * Connects to the Flask backend at api.getbrikk.com
 */

const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://api.getbrikk.com';

export interface Policy {
  id: number;
  name: string;
  description: string;
  goal: 'cost' | 'latency' | 'quality' | 'reliability' | 'compliance';
  status: 'draft' | 'pending_approval' | 'approved' | 'active' | 'paused' | 'archived';
  scope: Record<string, any>;
  conditions: Record<string, any>;
  actions: Record<string, any>;
  priority: number;
  tags: string[];
  hit_count: number;
  error_count: number;
  last_hit_at: string | null;
  created_by: number;
  org_id: number;
  created_at: string;
  updated_at: string;
  deployed_at: string | null;
}

export interface PolicyCreate {
  name: string;
  description: string;
  goal: string;
  scope: Record<string, any>;
  conditions: Record<string, any>;
  actions: Record<string, any>;
  priority?: number;
  tags?: string[];
}

export interface SimulationResult {
  policy_id: number;
  policy_name: string;
  simulation_window_minutes: number;
  total_requests_analyzed: number;
  would_match_count: number;
  match_percentage: number;
  estimated_impact: {
    latency_change_ms: number;
    cost_change_usd: number;
    provider_distribution_before: Record<string, number>;
    provider_distribution_after: Record<string, number>;
    routing_changes: number;
  };
  risk_flags: string[];
  recommendation: string;
}

export interface DashboardMetrics {
  provider_uptime: Record<string, number>;
  fallback_frequency: Record<string, number>;
  total_requests_24h: number;
  total_requests_7d: number;
  traffic_by_provider: Record<string, number>;
  active_rules_count: number;
  total_rules_count: number;
  top_rules_by_hits: Array<{
    id: number;
    name: string;
    hit_count: number;
  }>;
  recent_changes: Array<{
    id: number;
    policy_id: number;
    action: string;
    timestamp: string;
  }>;
  avg_latency_ms: number;
  p95_latency_ms: number;
  total_cost_24h: number;
  cost_savings_24h: number;
  active_alerts: any[];
}

class ApiClient {
  private baseUrl: string;
  private token: string | null = null;

  constructor(baseUrl: string = API_BASE_URL) {
    this.baseUrl = baseUrl;
    // TODO: Get token from auth context
    this.token = localStorage.getItem('auth_token');
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      ...(options.headers as Record<string, string> || {}),
    };

    if (this.token) {
      headers['Authorization'] = `Bearer ${this.token}`;
    }

    const response = await fetch(`${this.baseUrl}${endpoint}`, {
      ...options,
      headers,
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ error: response.statusText }));
      throw new Error(error.error || `HTTP ${response.status}`);
    }

    return response.json();
  }

  // Policy CRUD
  async listPolicies(params?: {
    status?: string;
    tags?: string[];
    page?: number;
    page_size?: number;
  }): Promise<{ policies: Policy[]; total: number; page: number; page_size: number }> {
    const query = new URLSearchParams();
    if (params?.status) query.append('status', params.status);
    if (params?.tags) params.tags.forEach(tag => query.append('tags', tag));
    if (params?.page) query.append('page', params.page.toString());
    if (params?.page_size) query.append('page_size', params.page_size.toString());

    return this.request(`/api/v1/policies?${query}`);
  }

  async getPolicy(id: number): Promise<Policy> {
    return this.request(`/api/v1/policies/${id}`);
  }

  async createPolicy(data: PolicyCreate): Promise<Policy> {
    return this.request(`/api/v1/policies`, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async updatePolicy(id: number, data: Partial<PolicyCreate>): Promise<Policy> {
    return this.request(`/api/v1/policies/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async deletePolicy(id: number): Promise<void> {
    return this.request(`/api/v1/policies/${id}`, {
      method: 'DELETE',
    });
  }

  // Simulation
  async simulatePolicy(
    id: number,
    params?: { window_minutes?: number }
  ): Promise<SimulationResult> {
    return this.request(`/api/v1/policies/${id}/simulate`, {
      method: 'POST',
      body: JSON.stringify(params || {}),
    });
  }

  // Approval Workflow
  async submitForApproval(
    id: number,
    data: { notes?: string; deployment_strategy?: string }
  ): Promise<any> {
    return this.request(`/api/v1/policies/${id}/submit`, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async approvePolicy(
    id: number,
    approvalId: number,
    data: { approved: boolean; notes?: string }
  ): Promise<any> {
    return this.request(`/api/v1/policies/${id}/approve?approval_id=${approvalId}`, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  // Deployment
  async deployPolicy(
    id: number,
    data: {
      environment?: string;
      strategy?: string;
      max_error_rate?: number;
      max_latency_ms?: number;
    }
  ): Promise<any> {
    return this.request(`/api/v1/policies/${id}/deploy`, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async rollbackDeployment(
    id: number,
    deploymentId: number,
    reason: string
  ): Promise<any> {
    return this.request(
      `/api/v1/policies/${id}/rollback?deployment_id=${deploymentId}&reason=${encodeURIComponent(reason)}`,
      { method: 'POST' }
    );
  }

  // Utility
  async explainPolicy(id: number): Promise<{
    summary: string;
    trigger_conditions: string;
    actions_taken: string;
    potential_impact: string;
    recommendations: string[];
  }> {
    return this.request(`/api/v1/policies/${id}/explain`);
  }

  async getDashboardMetrics(): Promise<DashboardMetrics> {
    return this.request(`/api/v1/policies/dashboard/metrics`);
  }
}

export const api = new ApiClient();

