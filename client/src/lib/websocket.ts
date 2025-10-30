// WebSocket service for real-time BrikkFlows updates

const WS_BASE_URL = import.meta.env.VITE_WS_BASE_URL || 'wss://api.brikk.dev/v1/stream';

export type WebSocketTopic =
  | 'alerts.*'
  | `exec.updates.flow:${string}`
  | 'providers.health'
  | 'metrics.overview';

export interface WebSocketMessage {
  topic: string;
  data: any;
}

export interface WebSocketSubscription {
  type: 'subscribe';
  topics: WebSocketTopic[];
}

type MessageHandler = (message: WebSocketMessage) => void;

export class BrikkFlowsWebSocket {
  private ws: WebSocket | null = null;
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 5;
  private reconnectDelay = 1000; // Start with 1 second
  private messageHandlers: Set<MessageHandler> = new Set();
  private subscribedTopics: Set<WebSocketTopic> = new Set();
  private authToken: string | null = null;
  private tenant: string | null = null;
  private isIntentionallyClosed = false;

  constructor() {
    // Auto-connect on instantiation
    this.connect();
  }

  setAuth(token: string, tenant: string) {
    this.authToken = token;
    this.tenant = tenant;
  }

  connect() {
    if (this.ws?.readyState === WebSocket.OPEN) {
      return; // Already connected
    }

    this.isIntentionallyClosed = false;

    try {
      // Build URL with auth params
      const url = new URL(WS_BASE_URL);
      if (this.authToken) {
        url.searchParams.set('token', this.authToken);
      }
      if (this.tenant) {
        url.searchParams.set('tenant', this.tenant);
      }

      this.ws = new WebSocket(url.toString());

      this.ws.onopen = () => {
        console.log('[BrikkFlows WS] Connected');
        this.reconnectAttempts = 0;
        this.reconnectDelay = 1000;

        // Resubscribe to topics
        if (this.subscribedTopics.size > 0) {
          this.subscribe(Array.from(this.subscribedTopics));
        }
      };

      this.ws.onmessage = (event) => {
        try {
          const message: WebSocketMessage = JSON.parse(event.data);
          this.messageHandlers.forEach((handler) => handler(message));
        } catch (error) {
          console.error('[BrikkFlows WS] Failed to parse message:', error);
        }
      };

      this.ws.onerror = (error) => {
        console.error('[BrikkFlows WS] Error:', error);
      };

      this.ws.onclose = () => {
        console.log('[BrikkFlows WS] Disconnected');
        this.ws = null;

        // Attempt reconnection with exponential backoff
        if (!this.isIntentionallyClosed && this.reconnectAttempts < this.maxReconnectAttempts) {
          this.reconnectAttempts++;
          const delay = this.reconnectDelay * Math.pow(2, this.reconnectAttempts - 1);
          console.log(`[BrikkFlows WS] Reconnecting in ${delay}ms (attempt ${this.reconnectAttempts}/${this.maxReconnectAttempts})`);
          
          setTimeout(() => {
            this.connect();
          }, delay);
        }
      };
    } catch (error) {
      console.error('[BrikkFlows WS] Connection failed:', error);
    }
  }

  subscribe(topics: WebSocketTopic[]) {
    topics.forEach((topic) => this.subscribedTopics.add(topic));

    if (this.ws?.readyState === WebSocket.OPEN) {
      const subscription: WebSocketSubscription = {
        type: 'subscribe',
        topics,
      };
      this.ws.send(JSON.stringify(subscription));
      console.log('[BrikkFlows WS] Subscribed to:', topics);
    }
  }

  unsubscribe(topics: WebSocketTopic[]) {
    topics.forEach((topic) => this.subscribedTopics.delete(topic));

    if (this.ws?.readyState === WebSocket.OPEN) {
      const message = {
        type: 'unsubscribe',
        topics,
      };
      this.ws.send(JSON.stringify(message));
      console.log('[BrikkFlows WS] Unsubscribed from:', topics);
    }
  }

  onMessage(handler: MessageHandler) {
    this.messageHandlers.add(handler);

    // Return cleanup function
    return () => {
      this.messageHandlers.delete(handler);
    };
  }

  disconnect() {
    this.isIntentionallyClosed = true;
    if (this.ws) {
      this.ws.close();
      this.ws = null;
    }
    this.subscribedTopics.clear();
    this.messageHandlers.clear();
  }

  getReadyState(): number {
    return this.ws?.readyState ?? WebSocket.CLOSED;
  }

  isConnected(): boolean {
    return this.ws?.readyState === WebSocket.OPEN;
  }
}

// Export singleton instance
export const wsClient = new BrikkFlowsWebSocket();

