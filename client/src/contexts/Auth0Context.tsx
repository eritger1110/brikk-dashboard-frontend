/**
 * Auth0 Context Provider for Brikk Dashboard
 * 
 * Enterprise-grade authentication with:
 * - Secure token management
 * - Automatic token refresh
 * - User synchronization with backend
 * - Organization ID management
 */

import { Auth0Provider, useAuth0 as useAuth0Hook } from '@auth0/auth0-react';
import { createContext, useContext, useEffect, useState, ReactNode } from 'react';

// Auth0 Configuration (from environment variables)
const AUTH0_DOMAIN = import.meta.env.VITE_AUTH0_DOMAIN || 'brikk-dashboard.us.auth0.com';
const AUTH0_CLIENT_ID = import.meta.env.VITE_AUTH0_CLIENT_ID || '';
const AUTH0_AUDIENCE = import.meta.env.VITE_AUTH0_AUDIENCE || 'https://api.getbrikk.com';
const REDIRECT_URI = window.location.origin;

interface BrikkAuthContextType {
  isAuthenticated: boolean;
  isLoading: boolean;
  user: any;
  accessToken: string | null;
  orgId: string | null;
  login: () => void;
  logout: () => void;
  getAccessToken: () => Promise<string | null>;
}

const BrikkAuthContext = createContext<BrikkAuthContextType | undefined>(undefined);

/**
 * Auth0 Provider Wrapper with Brikk-specific logic
 */
export function BrikkAuth0Provider({ children }: { children: ReactNode }) {
  // Check if demo mode is enabled
  const isDemoMode = localStorage.getItem('brikk_demo_mode') === 'true';
  
  // Skip Auth0 in demo mode
  if (isDemoMode) {
    return <BrikkDemoAuthWrapper>{children}</BrikkDemoAuthWrapper>;
  }
  
  return (
    <Auth0Provider
      domain={AUTH0_DOMAIN}
      clientId={AUTH0_CLIENT_ID}
      authorizationParams={{
        redirect_uri: REDIRECT_URI,
        audience: AUTH0_AUDIENCE,
        scope: 'openid profile email read:agents write:agents read:flows write:flows read:usage read:billing',
      }}
      cacheLocation="localstorage"
      useRefreshTokens={true}
      useRefreshTokensFallback={true}
    >
      <BrikkAuthWrapper>{children}</BrikkAuthWrapper>
    </Auth0Provider>
  );
}

/**
 * Demo mode wrapper that provides mock auth context
 */
function BrikkDemoAuthWrapper({ children }: { children: ReactNode }) {
  const demoUser = {
    sub: 'demo_user_123',
    name: 'Demo User',
    email: 'demo@getbrikk.com',
    picture: 'https://ui-avatars.com/api/?name=Demo+User&background=0057FF&color=fff',
  };

  const [accessToken] = useState('demo_access_token');
  const [orgId] = useState('org_demo');

  // Set demo tokens in localStorage
  useEffect(() => {
    localStorage.setItem('auth0_access_token', 'demo_access_token');
    localStorage.setItem('brikk_org_id', 'org_demo');
  }, []);

  const login = () => {
    console.log('[Demo] Login called - already in demo mode');
  };

  const logout = () => {
    localStorage.removeItem('brikk_demo_mode');
    localStorage.removeItem('auth0_access_token');
    localStorage.removeItem('brikk_org_id');
    window.location.reload();
  };

  const getAccessToken = async (): Promise<string | null> => {
    return 'demo_access_token';
  };

  const contextValue: BrikkAuthContextType = {
    isAuthenticated: true,
    isLoading: false,
    user: demoUser,
    accessToken,
    orgId,
    login,
    logout,
    getAccessToken,
  };

  return (
    <BrikkAuthContext.Provider value={contextValue}>
      {children}
    </BrikkAuthContext.Provider>
  );
}

/**
 * Internal wrapper to access Auth0 hooks and provide Brikk context
 */
function BrikkAuthWrapper({ children }: { children: ReactNode }) {
  const {
    isAuthenticated,
    isLoading,
    user,
    loginWithRedirect,
    logout: auth0Logout,
    getAccessTokenSilently,
  } = useAuth0Hook();

  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [orgId, setOrgId] = useState<string | null>(null);

  // Get access token on mount and when auth state changes
  useEffect(() => {
    if (isAuthenticated && !isLoading && user) {
      getAccessTokenSilently()
        .then(async (token) => {
          setAccessToken(token);
          
          // Store token in localStorage for API adapter
          localStorage.setItem('auth0_access_token', token);
          
          // Sync user with backend to get org_id
          try {
            const response = await fetch(`${import.meta.env.VITE_API_BASE_URL || 'https://brikk-production-9913.up.railway.app'}/api/users/sync`, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
              },
              body: JSON.stringify({
                sub: user.sub,
                email: user.email,
                name: user.name,
                picture: user.picture,
              }),
            });
            
            if (response.ok) {
              const syncData = await response.json();
              const backendOrgId = syncData.organization_id;
              setOrgId(backendOrgId);
              localStorage.setItem('brikk_org_id', backendOrgId);
              
              console.log('[Auth] User authenticated and synced:', {
                userId: user.sub,
                orgId: backendOrgId,
                isNewUser: syncData.is_new_user,
              });
            } else {
              // Fallback: use default org_id
              const fallbackOrgId = 'org_default';
              setOrgId(fallbackOrgId);
              localStorage.setItem('brikk_org_id', fallbackOrgId);
              console.warn('[Auth] User sync failed, using fallback org_id');
            }
          } catch (syncError) {
            console.error('[Auth] Failed to sync user with backend:', syncError);
            
            // Fallback: use default org_id
            const fallbackOrgId = 'org_default';
            setOrgId(fallbackOrgId);
            localStorage.setItem('brikk_org_id', fallbackOrgId);
          }
        })
        .catch((error) => {
          console.error('[Auth] Failed to get access token:', error);
          localStorage.removeItem('auth0_access_token');
          localStorage.removeItem('brikk_org_id');
        });
    }
  }, [isAuthenticated, isLoading, user, getAccessTokenSilently]);

  // Refresh token every 50 minutes (tokens expire after 60 minutes)
  useEffect(() => {
    if (isAuthenticated) {
      const refreshInterval = setInterval(() => {
        getAccessTokenSilently({ cacheMode: 'off' })
          .then((token) => {
            setAccessToken(token);
            localStorage.setItem('auth0_access_token', token);
            console.log('[Auth] Token refreshed');
          })
          .catch((error) => {
            console.error('[Auth] Token refresh failed:', error);
          });
      }, 50 * 60 * 1000); // 50 minutes

      return () => clearInterval(refreshInterval);
    }
  }, [isAuthenticated, getAccessTokenSilently]);

  const login = () => {
    loginWithRedirect({
      appState: {
        returnTo: window.location.pathname,
      },
    });
  };

  const logout = () => {
    localStorage.removeItem('auth0_access_token');
    localStorage.removeItem('brikk_org_id');
    
    console.log('[Auth] User logged out:', {
      userId: user?.sub,
      timestamp: new Date().toISOString(),
    });
    
    auth0Logout({
      logoutParams: {
        returnTo: window.location.origin,
      },
    });
  };

  const getAccessToken = async (): Promise<string | null> => {
    if (!isAuthenticated) return null;
    
    try {
      const token = await getAccessTokenSilently();
      setAccessToken(token);
      localStorage.setItem('auth0_access_token', token);
      return token;
    } catch (error) {
      console.error('[Auth] Failed to get access token:', error);
      return null;
    }
  };

  const contextValue: BrikkAuthContextType = {
    isAuthenticated,
    isLoading,
    user,
    accessToken,
    orgId,
    login,
    logout,
    getAccessToken,
  };

  return (
    <BrikkAuthContext.Provider value={contextValue}>
      {children}
    </BrikkAuthContext.Provider>
  );
}

/**
 * Hook to access Brikk auth context
 */
export function useBrikkAuth() {
  const context = useContext(BrikkAuthContext);
  if (!context) {
    throw new Error('useBrikkAuth must be used within BrikkAuth0Provider');
  }
  return context;
}

/**
 * Protected Route Component
 */
export function ProtectedRoute({ children }: { children: ReactNode }) {
  const { isAuthenticated, isLoading } = useBrikkAuth();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-background">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    // Show landing page instead of auto-redirecting
    return null;
  }

  return <>{children}</>;
}
