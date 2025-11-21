/**
 * useApi Hook
 * 
 * Automatically injects Auth0 access tokens into API calls
 * Usage: const api = useApi(); then call api.getAgents(), api.getWorkflows(), etc.
 */

import { useAuth0 } from "@auth0/auth0-react";
import { useCallback } from "react";
import * as apiModule from "@/lib/api";

export function useApi() {
  const { getAccessTokenSilently } = useAuth0();

  // Wrap all API functions to automatically inject token
  const api = {
    // System
    getHealth: useCallback(() => apiModule.getHealth(), []),
    getGatewayInfo: useCallback(() => apiModule.getGatewayInfo(), []),

    // Org & User
    getCurrentOrg: useCallback(async () => {
      const token = await getAccessTokenSilently();
      return apiModule.getCurrentOrg(token);
    }, [getAccessTokenSilently]),

    getCurrentUser: useCallback(async () => {
      const token = await getAccessTokenSilently();
      return apiModule.getCurrentUser(token);
    }, [getAccessTokenSilently]),

    // Agents
    getAgents: useCallback(async (params?: Parameters<typeof apiModule.getAgents>[0]) => {
      const token = await getAccessTokenSilently();
      return apiModule.getAgents({ ...params, token });
    }, [getAccessTokenSilently]),

    createAgent: useCallback(async (data: Parameters<typeof apiModule.createAgent>[0]) => {
      const token = await getAccessTokenSilently();
      return apiModule.createAgent(data, token);
    }, [getAccessTokenSilently]),

    updateAgent: useCallback(async (agentId: string, data: Parameters<typeof apiModule.updateAgent>[1]) => {
      const token = await getAccessTokenSilently();
      return apiModule.updateAgent(agentId, data, token);
    }, [getAccessTokenSilently]),

    pauseAgent: useCallback(async (agentId: string) => {
      const token = await getAccessTokenSilently();
      return apiModule.pauseAgent(agentId, token);
    }, [getAccessTokenSilently]),

    resumeAgent: useCallback(async (agentId: string) => {
      const token = await getAccessTokenSilently();
      return apiModule.resumeAgent(agentId, token);
    }, [getAccessTokenSilently]),

    // Workflows
    getFlows: useCallback(async (params?: Parameters<typeof apiModule.getFlows>[0]) => {
      const token = await getAccessTokenSilently();
      return apiModule.getFlows({ ...params, token });
    }, [getAccessTokenSilently]),

    getFlow: useCallback(async (flowId: string) => {
      const token = await getAccessTokenSilently();
      return apiModule.getFlow(flowId, token);
    }, [getAccessTokenSilently]),

    createFlow: useCallback(async (data: Parameters<typeof apiModule.createFlow>[0]) => {
      const token = await getAccessTokenSilently();
      return apiModule.createFlow(data, token);
    }, [getAccessTokenSilently]),

    updateFlow: useCallback(async (flowId: string, data: Parameters<typeof apiModule.updateFlow>[1]) => {
      const token = await getAccessTokenSilently();
      return apiModule.updateFlow(flowId, data, token);
    }, [getAccessTokenSilently]),

    publishFlow: useCallback(async (flowId: string) => {
      const token = await getAccessTokenSilently();
      return apiModule.publishFlow(flowId, token);
    }, [getAccessTokenSilently]),

    // Usage & Costs
    getUsageAggregate: useCallback(async (params: Parameters<typeof apiModule.getUsageAggregate>[0]) => {
      const token = await getAccessTokenSilently();
      return apiModule.getUsageAggregate({ ...params, token });
    }, [getAccessTokenSilently]),

    getCostsByProvider: useCallback(async (params: Parameters<typeof apiModule.getCostsByProvider>[0]) => {
      const token = await getAccessTokenSilently();
      return apiModule.getCostsByProvider({ ...params, token });
    }, [getAccessTokenSilently]),

    // Billing
    getBillingPlan: useCallback(async () => {
      const token = await getAccessTokenSilently();
      return apiModule.getBillingPlan(token);
    }, [getAccessTokenSilently]),

    getInvoices: useCallback(async (params?: Parameters<typeof apiModule.getInvoices>[0]) => {
      const token = await getAccessTokenSilently();
      return apiModule.getInvoices({ ...params, token });
    }, [getAccessTokenSilently]),

    // Security
    getApiKeys: useCallback(async (params?: Parameters<typeof apiModule.getApiKeys>[0]) => {
      const token = await getAccessTokenSilently();
      return apiModule.getApiKeys({ ...params, token });
    }, [getAccessTokenSilently]),

    createApiKey: useCallback(async (data: Parameters<typeof apiModule.createApiKey>[0]) => {
      const token = await getAccessTokenSilently();
      return apiModule.createApiKey(data, token);
    }, [getAccessTokenSilently]),

    revokeApiKey: useCallback(async (keyId: string) => {
      const token = await getAccessTokenSilently();
      return apiModule.revokeApiKey(keyId, token);
    }, [getAccessTokenSilently]),

    getAuditLogs: useCallback(async (params: Parameters<typeof apiModule.getAuditLogs>[0]) => {
      const token = await getAccessTokenSilently();
      return apiModule.getAuditLogs({ ...params, token });
    }, [getAccessTokenSilently]),

    // Developer Tools
    proxyApiCall: useCallback(async (data: Parameters<typeof apiModule.proxyApiCall>[0]) => {
      const token = await getAccessTokenSilently();
      return apiModule.proxyApiCall({ ...data, token });
    }, [getAccessTokenSilently]),

    getOpenApiSpec: useCallback(async () => {
      const token = await getAccessTokenSilently();
      return apiModule.getOpenApiSpec(token);
    }, [getAccessTokenSilently]),

    // Analytics
    getTopAgents: useCallback(async (params: Parameters<typeof apiModule.getTopAgents>[0]) => {
      const token = await getAccessTokenSilently();
      return apiModule.getTopAgents({ ...params, token });
    }, [getAccessTokenSilently]),

    getTopErrors: useCallback(async (params: Parameters<typeof apiModule.getTopErrors>[0]) => {
      const token = await getAccessTokenSilently();
      return apiModule.getTopErrors({ ...params, token });
    }, [getAccessTokenSilently]),

    getLatencyMetrics: useCallback(async (params: Parameters<typeof apiModule.getLatencyMetrics>[0]) => {
      const token = await getAccessTokenSilently();
      return apiModule.getLatencyMetrics({ ...params, token });
    }, [getAccessTokenSilently]),

    // Marketplace
    getMarketplaceAgents: useCallback(async (params?: Parameters<typeof apiModule.getMarketplaceAgents>[0]) => {
      const token = await getAccessTokenSilently();
      return apiModule.getMarketplaceAgents({ ...params, token });
    }, [getAccessTokenSilently]),

    installMarketplaceAgent: useCallback(async (agentId: string) => {
      const token = await getAccessTokenSilently();
      return apiModule.installMarketplaceAgent(agentId, token);
    }, [getAccessTokenSilently]),

    // Help
    getHelpChecklist: useCallback(async () => {
      const token = await getAccessTokenSilently();
      return apiModule.getHelpChecklist(token);
    }, [getAccessTokenSilently]),
  };

  return api;
}
