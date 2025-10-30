import { useState, useEffect, useCallback } from 'react';
import { apiClient } from '@/lib/api-client';
import type {
  Flow,
  FlowsListParams,
  Execution,
  ExecutionsListParams,
  MetricsOverview,
  ProviderHealth,
  Alert,
  AlertsListParams,
  AuditEvent,
  AuditListParams,
  IntegrationStatus,
  PaginatedResponse,
} from '@/types/api';

interface UseApiState<T> {
  data: T | null;
  loading: boolean;
  error: Error | null;
  refetch: () => Promise<void>;
}

// Generic hook for API calls
function useApi<T>(
  apiCall: () => Promise<T>,
  dependencies: any[] = []
): UseApiState<T> {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const result = await apiCall();
      setData(result);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Unknown error'));
    } finally {
      setLoading(false);
    }
  }, [apiCall]);

  useEffect(() => {
    fetchData();
  }, dependencies);

  return { data, loading, error, refetch: fetchData };
}

// Flows hooks
export function useFlows(params?: FlowsListParams) {
  return useApi<PaginatedResponse<Flow>>(
    () => apiClient.listFlows(params),
    [JSON.stringify(params)]
  );
}

export function useFlow(flowId: string) {
  return useApi<Flow>(
    () => apiClient.getFlow(flowId),
    [flowId]
  );
}

// Executions hooks
export function useExecutions(params?: ExecutionsListParams) {
  return useApi<PaginatedResponse<Execution>>(
    () => apiClient.listExecutions(params),
    [JSON.stringify(params)]
  );
}

export function useExecution(execId: string) {
  return useApi<Execution>(
    () => apiClient.getExecution(execId),
    [execId]
  );
}

// Monitoring hooks
export function useMetricsOverview(window: string = '24h') {
  return useApi<MetricsOverview>(
    () => apiClient.getMetricsOverview(window),
    [window]
  );
}

export function useProviderMetrics(window: string = '24h') {
  return useApi<ProviderHealth[]>(
    () => apiClient.getProviderMetrics(window),
    [window]
  );
}

export function useAlerts(params?: AlertsListParams) {
  return useApi<Alert[]>(
    () => apiClient.listAlerts(params),
    [JSON.stringify(params)]
  );
}

export function useIntegrationHealth() {
  return useApi<IntegrationStatus[]>(
    () => apiClient.getIntegrationHealth(),
    []
  );
}

// Audit hooks
export function useAuditEvents(params?: AuditListParams) {
  return useApi<PaginatedResponse<AuditEvent>>(
    () => apiClient.listAuditEvents(params),
    [JSON.stringify(params)]
  );
}

// Integrations hooks
export function useIntegrationsCatalog() {
  return useApi<any[]>(
    () => apiClient.getIntegrationsCatalog(),
    []
  );
}

export function useIntegrationsStatus() {
  return useApi<IntegrationStatus[]>(
    () => apiClient.getIntegrationsStatus(),
    []
  );
}

// Mutation hooks (for write operations)
export function useFlowMutations() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const createFlow = async (flow: Partial<Flow>) => {
    try {
      setLoading(true);
      setError(null);
      const result = await apiClient.createFlow(flow);
      return result;
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Unknown error');
      setError(error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const updateFlow = async (flowId: string, updates: Partial<Flow>) => {
    try {
      setLoading(true);
      setError(null);
      const result = await apiClient.updateFlow(flowId, updates);
      return result;
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Unknown error');
      setError(error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const activateFlow = async (flowId: string) => {
    try {
      setLoading(true);
      setError(null);
      const result = await apiClient.activateFlow(flowId);
      return result;
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Unknown error');
      setError(error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const deactivateFlow = async (flowId: string) => {
    try {
      setLoading(true);
      setError(null);
      const result = await apiClient.deactivateFlow(flowId);
      return result;
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Unknown error');
      setError(error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const duplicateFlow = async (flowId: string) => {
    try {
      setLoading(true);
      setError(null);
      const result = await apiClient.duplicateFlow(flowId);
      return result;
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Unknown error');
      setError(error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const deleteFlow = async (flowId: string) => {
    try {
      setLoading(true);
      setError(null);
      await apiClient.deleteFlow(flowId);
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Unknown error');
      setError(error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  return {
    createFlow,
    updateFlow,
    activateFlow,
    deactivateFlow,
    duplicateFlow,
    deleteFlow,
    loading,
    error,
  };
}

export function useAlertMutations() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const acknowledgeAlert = async (alertId: string) => {
    try {
      setLoading(true);
      setError(null);
      const result = await apiClient.acknowledgeAlert(alertId);
      return result;
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Unknown error');
      setError(error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const resolveAlert = async (alertId: string) => {
    try {
      setLoading(true);
      setError(null);
      const result = await apiClient.resolveAlert(alertId);
      return result;
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Unknown error');
      setError(error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  return {
    acknowledgeAlert,
    resolveAlert,
    loading,
    error,
  };
}

