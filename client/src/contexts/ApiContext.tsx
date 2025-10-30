import { createContext, useContext, ReactNode, useEffect, useState } from 'react';
import { apiClient } from '@/lib/api-client';

interface ApiContextValue {
  isAuthenticated: boolean;
  tenant: string | null;
  setAuth: (token: string, tenant: string) => void;
  clearAuth: () => void;
}

const ApiContext = createContext<ApiContextValue | undefined>(undefined);

interface ApiProviderProps {
  children: ReactNode;
}

export function ApiProvider({ children }: ApiProviderProps) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [tenant, setTenant] = useState<string | null>(null);

  useEffect(() => {
    // Try to load auth from localStorage on mount
    const storedToken = localStorage.getItem('brikk_auth_token');
    const storedTenant = localStorage.getItem('brikk_tenant');

    if (storedToken && storedTenant) {
      apiClient.setAuth(storedToken, storedTenant);
      setIsAuthenticated(true);
      setTenant(storedTenant);
    } else {
      // For demo/development: use mock credentials
      const mockToken = 'demo_token_' + Date.now();
      const mockTenant = 'demo_tenant';
      apiClient.setAuth(mockToken, mockTenant);
      setIsAuthenticated(true);
      setTenant(mockTenant);
    }
  }, []);

  const setAuth = (token: string, tenantId: string) => {
    localStorage.setItem('brikk_auth_token', token);
    localStorage.setItem('brikk_tenant', tenantId);
    apiClient.setAuth(token, tenantId);
    setIsAuthenticated(true);
    setTenant(tenantId);
  };

  const clearAuth = () => {
    localStorage.removeItem('brikk_auth_token');
    localStorage.removeItem('brikk_tenant');
    setIsAuthenticated(false);
    setTenant(null);
  };

  return (
    <ApiContext.Provider value={{ isAuthenticated, tenant, setAuth, clearAuth }}>
      {children}
    </ApiContext.Provider>
  );
}

export function useApiAuth() {
  const context = useContext(ApiContext);
  if (context === undefined) {
    throw new Error('useApiAuth must be used within an ApiProvider');
  }
  return context;
}

