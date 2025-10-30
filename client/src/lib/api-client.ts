import type {
  Flow,
  FlowsListParams,
  Execution,
  ExecutionsListParams,
  AuditEvent,
  AuditListParams,
  MetricsOverview,
  ProviderHealth,
  Alert,
  AlertsListParams,
  IntegrationStatus,
  Graph,
  SimulateRequest,
  SimulateResponse,
  PaginatedResponse,
  ApiError,
} from '@/types/api';

// API Configuration
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://api.brikk.dev';
const API_VERSION = 'v1';

class BrikkFlowsApiClient {
  private baseUrl: string;
  private authToken: string | null = null;
  private tenant: string | null = null;

  constructor(baseUrl: string = API_BASE_URL) {
    this.baseUrl = `${baseUrl}/${API_VERSION}`;
  }

  // Auth configuration
  setAuth(token: string, tenant: string) {
    this.authToken = token;
    this.tenant = tenant;
  }

  // Generic request handler
  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      ...(options.headers as Record<string, string>),
    };

    if (this.authToken) {
      headers['Authorization'] = `Bearer ${this.authToken}`;
    }

    if (this.tenant) {
      headers['X-Brikk-Tenant'] = this.tenant;
    }

    const response = await fetch(`${this.baseUrl}${endpoint}`, {
      ...options,
      headers,
    });

    if (!response.ok) {
      const error: ApiError = await response.json().catch(() => ({
        error: {
          code: 'UNKNOWN_ERROR',
          message: response.statusText,
        },
      }));
      throw new Error(error.error.message || 'API request failed');
    }

    // Handle 204 No Content
    if (response.status === 204) {
      return {} as T;
    }

    return response.json();
  }

  // Flows API
  async listFlows(params?: FlowsListParams): Promise<PaginatedResponse<Flow>> {
    const searchParams = new URLSearchParams();
    if (params?.status) searchParams.append('status', params.status);
    if (params?.q) searchParams.append('q', params.q);
    if (params?.page) searchParams.append('page', params.page.toString());
    if (params?.sort) searchParams.append('sort', params.sort);

    const query = searchParams.toString();
    return this.request<PaginatedResponse<Flow>>(
      `/flows${query ? `?${query}` : ''}`
    );
  }

  async getFlow(flowId: string): Promise<Flow> {
    return this.request<Flow>(`/flows/${flowId}`);
  }

  async createFlow(flow: Partial<Flow>): Promise<Flow> {
    return this.request<Flow>('/flows', {
      method: 'POST',
      body: JSON.stringify(flow),
      headers: {
        'X-Idempotency-Key': crypto.randomUUID(),
      },
    });
  }

  async updateFlow(flowId: string, updates: Partial<Flow>): Promise<Flow> {
    return this.request<Flow>(`/flows/${flowId}`, {
      method: 'PATCH',
      body: JSON.stringify(updates),
    });
  }

  async activateFlow(flowId: string): Promise<Flow> {
    return this.request<Flow>(`/flows/${flowId}:activate`, {
      method: 'POST',
      headers: {
        'X-Idempotency-Key': crypto.randomUUID(),
      },
    });
  }

  async deactivateFlow(flowId: string): Promise<Flow> {
    return this.request<Flow>(`/flows/${flowId}:deactivate`, {
      method: 'POST',
      headers: {
        'X-Idempotency-Key': crypto.randomUUID(),
      },
    });
  }

  async duplicateFlow(flowId: string): Promise<Flow> {
    return this.request<Flow>(`/flows/${flowId}:duplicate`, {
      method: 'POST',
      headers: {
        'X-Idempotency-Key': crypto.randomUUID(),
      },
    });
  }

  async deleteFlow(flowId: string): Promise<void> {
    return this.request<void>(`/flows/${flowId}`, {
      method: 'DELETE',
    });
  }

  async simulateFlow(
    flowId: string,
    request: SimulateRequest
  ): Promise<SimulateResponse> {
    return this.request<SimulateResponse>(`/flows/${flowId}:simulate`, {
      method: 'POST',
      body: JSON.stringify(request),
    });
  }

  // Executions API
  async listExecutions(
    params?: ExecutionsListParams
  ): Promise<PaginatedResponse<Execution>> {
    const searchParams = new URLSearchParams();
    if (params?.flowId) searchParams.append('flowId', params.flowId);
    if (params?.state) searchParams.append('state', params.state);
    if (params?.from) searchParams.append('from', params.from);
    if (params?.to) searchParams.append('to', params.to);
    if (params?.page) searchParams.append('page', params.page.toString());

    const query = searchParams.toString();
    return this.request<PaginatedResponse<Execution>>(
      `/executions${query ? `?${query}` : ''}`
    );
  }

  async getExecution(execId: string): Promise<Execution> {
    return this.request<Execution>(`/executions/${execId}`);
  }

  async getExecutionLogs(execId: string): Promise<any> {
    return this.request<any>(`/executions/${execId}/logs`);
  }

  // Monitoring API
  async getMetricsOverview(window: string = '24h'): Promise<MetricsOverview> {
    return this.request<MetricsOverview>(`/metrics/overview?window=${window}`);
  }

  async getProviderMetrics(window: string = '24h'): Promise<ProviderHealth[]> {
    return this.request<ProviderHealth[]>(`/metrics/providers?window=${window}`);
  }

  async getTopFlows(by: 'runs' | 'cost' | 'latency' = 'runs'): Promise<Flow[]> {
    return this.request<Flow[]>(`/metrics/flows/top?by=${by}`);
  }

  async listAlerts(params?: AlertsListParams): Promise<Alert[]> {
    const searchParams = new URLSearchParams();
    if (params?.state) searchParams.append('state', params.state);
    if (params?.type) searchParams.append('type', params.type);

    const query = searchParams.toString();
    return this.request<Alert[]>(`/alerts${query ? `?${query}` : ''}`);
  }

  async acknowledgeAlert(alertId: string): Promise<Alert> {
    return this.request<Alert>(`/alerts/${alertId}:ack`, {
      method: 'POST',
    });
  }

  async resolveAlert(alertId: string): Promise<Alert> {
    return this.request<Alert>(`/alerts/${alertId}:resolve`, {
      method: 'POST',
    });
  }

  async getIntegrationHealth(): Promise<IntegrationStatus[]> {
    return this.request<IntegrationStatus[]>('/health/integrations');
  }

  // Audit API
  async listAuditEvents(
    params?: AuditListParams
  ): Promise<PaginatedResponse<AuditEvent>> {
    const searchParams = new URLSearchParams();
    if (params?.type) searchParams.append('type', params.type);
    if (params?.actor) searchParams.append('actor', params.actor);
    if (params?.from) searchParams.append('from', params.from);
    if (params?.to) searchParams.append('to', params.to);
    if (params?.page) searchParams.append('page', params.page.toString());

    const query = searchParams.toString();
    return this.request<PaginatedResponse<AuditEvent>>(
      `/audit${query ? `?${query}` : ''}`
    );
  }

  async exportAudit(format: 'pdf' | 'csv', window: string = '7d'): Promise<Blob> {
    const response = await fetch(
      `${this.baseUrl}/audit/export?format=${format}&window=${window}`,
      {
        headers: {
          Authorization: `Bearer ${this.authToken}`,
          'X-Brikk-Tenant': this.tenant || '',
        },
      }
    );

    if (!response.ok) {
      throw new Error('Export failed');
    }

    return response.blob();
  }

  // Integrations API
  async getIntegrationsCatalog(): Promise<any[]> {
    return this.request<any[]>('/integrations/catalog');
  }

  async getIntegrationsStatus(): Promise<IntegrationStatus[]> {
    return this.request<IntegrationStatus[]>('/integrations/status');
  }

  async connectIntegration(key: string, config: any): Promise<IntegrationStatus> {
    return this.request<IntegrationStatus>(`/integrations/${key}:connect`, {
      method: 'POST',
      body: JSON.stringify(config),
    });
  }

  async disconnectIntegration(key: string): Promise<void> {
    return this.request<void>(`/integrations/${key}:disconnect`, {
      method: 'DELETE',
    });
  }

  // Coordination Map
  async getCoordinationGraph(window: string = '24h'): Promise<Graph> {
    return this.request<Graph>(`/metrics/graph?window=${window}`);
  }

  // Health check
  async healthCheck(): Promise<{ status: string }> {
    return this.request<{ status: string }>('/health');
  }
}

// Export singleton instance
export const apiClient = new BrikkFlowsApiClient();

// Export class for testing
export { BrikkFlowsApiClient };

