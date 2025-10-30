import { useEffect, useState, useCallback } from 'react';
import { wsClient, WebSocketTopic, WebSocketMessage } from '@/lib/websocket';

export function useWebSocket(topics: WebSocketTopic[]) {
  const [isConnected, setIsConnected] = useState(false);
  const [lastMessage, setLastMessage] = useState<WebSocketMessage | null>(null);

  useEffect(() => {
    // Subscribe to topics
    wsClient.subscribe(topics);

    // Set up message handler
    const unsubscribe = wsClient.onMessage((message) => {
      setLastMessage(message);
    });

    // Check connection status periodically
    const checkConnection = setInterval(() => {
      setIsConnected(wsClient.isConnected());
    }, 1000);

    // Cleanup
    return () => {
      wsClient.unsubscribe(topics);
      unsubscribe();
      clearInterval(checkConnection);
    };
  }, [topics.join(',')]);

  return { isConnected, lastMessage };
}

// Hook for specific topic filtering
export function useWebSocketTopic<T = any>(
  topic: WebSocketTopic,
  filter?: (message: WebSocketMessage) => boolean
) {
  const [data, setData] = useState<T | null>(null);
  const { isConnected, lastMessage } = useWebSocket([topic]);

  useEffect(() => {
    if (lastMessage && lastMessage.topic === topic) {
      if (!filter || filter(lastMessage)) {
        setData(lastMessage.data);
      }
    }
  }, [lastMessage, topic, filter]);

  return { data, isConnected };
}

// Hook for live alerts
export function useLiveAlerts() {
  const [alerts, setAlerts] = useState<any[]>([]);
  const { lastMessage } = useWebSocket(['alerts.*']);

  useEffect(() => {
    if (lastMessage && lastMessage.topic.startsWith('alerts.')) {
      setAlerts((prev) => [lastMessage.data, ...prev].slice(0, 50)); // Keep last 50
    }
  }, [lastMessage]);

  return alerts;
}

// Hook for live execution updates
export function useLiveExecutions(flowId?: string) {
  const topics: WebSocketTopic[] = flowId
    ? [`exec.updates.flow:${flowId}`]
    : [];
  
  const [executions, setExecutions] = useState<any[]>([]);
  const { lastMessage } = useWebSocket(topics);

  useEffect(() => {
    if (lastMessage && lastMessage.topic.startsWith('exec.updates')) {
      setExecutions((prev) => [lastMessage.data, ...prev].slice(0, 100));
    }
  }, [lastMessage]);

  return executions;
}

// Hook for live provider health
export function useLiveProviderHealth() {
  const { data } = useWebSocketTopic<any>('providers.health');
  return data;
}

// Hook for live metrics
export function useLiveMetrics() {
  const { data } = useWebSocketTopic<any>('metrics.overview');
  return data;
}

