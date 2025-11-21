/**
 * OAuth2 Service
 * Handles OAuth2 authorization flows for integrations
 */

export interface OAuth2Provider {
  id: string;
  name: string;
  logo: string;
  authUrl: string;
  tokenUrl: string;
  scopes: string[];
  description: string;
  clientId: string;
  redirectUri: string;
}

// OAuth2 Provider Configurations
export const OAUTH2_PROVIDERS: Record<string, OAuth2Provider> = {
  google: {
    id: "google",
    name: "Google",
    logo: "/logos/google.svg",
    authUrl: "https://accounts.google.com/o/oauth2/v2/auth",
    tokenUrl: "https://oauth2.googleapis.com/token",
    scopes: [
      "Read and send emails via Gmail",
      "Access Google Drive files",
      "View and manage Google Calendar events",
      "Access Google Sheets and Docs",
    ],
    description: "Connect your Google account to enable Gmail, Drive, Calendar, and Sheets integrations.",
    clientId: import.meta.env.VITE_GOOGLE_CLIENT_ID || "",
    redirectUri: `${window.location.origin}/oauth/callback`,
  },
  salesforce: {
    id: "salesforce",
    name: "Salesforce",
    logo: "/logos/salesforce.svg",
    authUrl: "https://login.salesforce.com/services/oauth2/authorize",
    tokenUrl: "https://login.salesforce.com/services/oauth2/token",
    scopes: [
      "Access and manage Salesforce data",
      "Create and update leads, contacts, and opportunities",
      "View reports and dashboards",
      "Manage custom objects",
    ],
    description: "Connect your Salesforce account to sync CRM data and automate sales workflows.",
    clientId: import.meta.env.VITE_SALESFORCE_CLIENT_ID || "",
    redirectUri: `${window.location.origin}/oauth/callback`,
  },
  slack: {
    id: "slack",
    name: "Slack",
    logo: "/logos/slack.svg",
    authUrl: "https://slack.com/oauth/v2/authorize",
    tokenUrl: "https://slack.com/api/oauth.v2.access",
    scopes: [
      "Send messages to channels",
      "Read channel messages and history",
      "Manage files and attachments",
      "Access user profile information",
    ],
    description: "Connect your Slack workspace to send notifications and automate team communication.",
    clientId: import.meta.env.VITE_SLACK_CLIENT_ID || "",
    redirectUri: `${window.location.origin}/oauth/callback`,
  },
  microsoft: {
    id: "microsoft",
    name: "Microsoft 365",
    logo: "/logos/microsoft.svg",
    authUrl: "https://login.microsoftonline.com/common/oauth2/v2.0/authorize",
    tokenUrl: "https://login.microsoftonline.com/common/oauth2/v2.0/token",
    scopes: [
      "Access Outlook emails and calendar",
      "Read and write OneDrive files",
      "Access Microsoft Teams messages",
      "View user profile information",
    ],
    description: "Connect your Microsoft 365 account to enable Outlook, OneDrive, and Teams integrations.",
    clientId: import.meta.env.VITE_MICROSOFT_CLIENT_ID || "",
    redirectUri: `${window.location.origin}/oauth/callback`,
  },
  hubspot: {
    id: "hubspot",
    name: "HubSpot",
    logo: "/logos/hubspot.svg",
    authUrl: "https://app.hubspot.com/oauth/authorize",
    tokenUrl: "https://api.hubapi.com/oauth/v1/token",
    scopes: [
      "Access and manage contacts",
      "Create and update deals",
      "View and manage marketing campaigns",
      "Access CRM data and analytics",
    ],
    description: "Connect your HubSpot account to sync marketing and sales data.",
    clientId: import.meta.env.VITE_HUBSPOT_CLIENT_ID || "",
    redirectUri: `${window.location.origin}/oauth/callback`,
  },
};

/**
 * Generate OAuth2 authorization URL
 */
export function generateAuthUrl(providerId: string, state?: string): string {
  const provider = OAUTH2_PROVIDERS[providerId];
  if (!provider) {
    throw new Error(`Unknown OAuth2 provider: ${providerId}`);
  }

  const params = new URLSearchParams({
    client_id: provider.clientId,
    redirect_uri: provider.redirectUri,
    response_type: "code",
    scope: provider.scopes.join(" "),
    state: state || generateState(),
    access_type: "offline", // Request refresh token
    prompt: "consent", // Always show consent screen
  });

  return `${provider.authUrl}?${params.toString()}`;
}

/**
 * Generate random state parameter for CSRF protection
 */
export function generateState(): string {
  return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
}

/**
 * Store OAuth2 state in sessionStorage for verification
 */
export function storeOAuthState(state: string, providerId: string): void {
  sessionStorage.setItem("oauth_state", state);
  sessionStorage.setItem("oauth_provider", providerId);
}

/**
 * Verify OAuth2 state from callback
 */
export function verifyOAuthState(state: string): boolean {
  const storedState = sessionStorage.getItem("oauth_state");
  return storedState === state;
}

/**
 * Get OAuth2 provider from stored state
 */
export function getStoredProvider(): string | null {
  return sessionStorage.getItem("oauth_provider");
}

/**
 * Clear OAuth2 state after successful authorization
 */
export function clearOAuthState(): void {
  sessionStorage.removeItem("oauth_state");
  sessionStorage.removeItem("oauth_provider");
}

/**
 * Exchange authorization code for access token
 */
export async function exchangeCodeForToken(
  providerId: string,
  code: string
): Promise<{
  access_token: string;
  refresh_token?: string;
  expires_in: number;
}> {
  const provider = OAUTH2_PROVIDERS[providerId];
  if (!provider) {
    throw new Error(`Unknown OAuth2 provider: ${providerId}`);
  }

  const response = await fetch(provider.tokenUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: new URLSearchParams({
      client_id: provider.clientId,
      client_secret: import.meta.env[`VITE_${providerId.toUpperCase()}_CLIENT_SECRET`] || "",
      code,
      redirect_uri: provider.redirectUri,
      grant_type: "authorization_code",
    }),
  });

  if (!response.ok) {
    throw new Error(`Token exchange failed: ${response.statusText}`);
  }

  return response.json();
}

/**
 * Store OAuth2 tokens securely
 */
export function storeOAuthTokens(
  providerId: string,
  tokens: {
    access_token: string;
    refresh_token?: string;
    expires_in: number;
  }
): void {
  const expiresAt = Date.now() + tokens.expires_in * 1000;

  localStorage.setItem(
    `oauth_${providerId}`,
    JSON.stringify({
      access_token: tokens.access_token,
      refresh_token: tokens.refresh_token,
      expires_at: expiresAt,
    })
  );
}

/**
 * Get stored OAuth2 tokens
 */
export function getOAuthTokens(providerId: string): {
  access_token: string;
  refresh_token?: string;
  expires_at: number;
} | null {
  const stored = localStorage.getItem(`oauth_${providerId}`);
  if (!stored) return null;

  try {
    return JSON.parse(stored);
  } catch {
    return null;
  }
}

/**
 * Check if OAuth2 token is expired
 */
export function isTokenExpired(providerId: string): boolean {
  const tokens = getOAuthTokens(providerId);
  if (!tokens) return true;

  return Date.now() >= tokens.expires_at;
}

/**
 * Refresh OAuth2 access token
 */
export async function refreshAccessToken(providerId: string): Promise<void> {
  const tokens = getOAuthTokens(providerId);
  if (!tokens || !tokens.refresh_token) {
    throw new Error("No refresh token available");
  }

  const provider = OAUTH2_PROVIDERS[providerId];
  if (!provider) {
    throw new Error(`Unknown OAuth2 provider: ${providerId}`);
  }

  const response = await fetch(provider.tokenUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: new URLSearchParams({
      client_id: provider.clientId,
      client_secret: import.meta.env[`VITE_${providerId.toUpperCase()}_CLIENT_SECRET`] || "",
      refresh_token: tokens.refresh_token,
      grant_type: "refresh_token",
    }),
  });

  if (!response.ok) {
    throw new Error(`Token refresh failed: ${response.statusText}`);
  }

  const newTokens = await response.json();
  storeOAuthTokens(providerId, {
    ...newTokens,
    refresh_token: tokens.refresh_token, // Keep existing refresh token
  });
}

/**
 * Revoke OAuth2 access
 */
export function revokeOAuthAccess(providerId: string): void {
  localStorage.removeItem(`oauth_${providerId}`);
}
