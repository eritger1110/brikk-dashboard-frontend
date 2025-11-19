import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface DemoModeContextType {
  isDemoMode: boolean;
  toggleDemoMode: () => void;
  demoUser: {
    name: string;
    email: string;
    organization: string;
    role: string;
  };
}

const DemoModeContext = createContext<DemoModeContextType | undefined>(undefined);

export function DemoModeProvider({ children }: { children: ReactNode }) {
  const [isDemoMode, setIsDemoMode] = useState(() => {
    // Check localStorage for demo mode preference
    const stored = localStorage.getItem('brikk_demo_mode');
    return stored === 'true';
  });

  const demoUser = {
    name: 'Demo User',
    email: 'demo@getbrikk.com',
    organization: 'Brikk Demo Organization',
    role: 'Admin'
  };

  const toggleDemoMode = () => {
    setIsDemoMode(prev => {
      const newValue = !prev;
      localStorage.setItem('brikk_demo_mode', String(newValue));
      // Reload to apply auth changes
      window.location.reload();
      return newValue;
    });
  };

  useEffect(() => {
    // Store demo mode state
    localStorage.setItem('brikk_demo_mode', String(isDemoMode));
  }, [isDemoMode]);

  return (
    <DemoModeContext.Provider value={{ isDemoMode, toggleDemoMode, demoUser }}>
      {children}
    </DemoModeContext.Provider>
  );
}

export function useDemoMode() {
  const context = useContext(DemoModeContext);
  if (context === undefined) {
    throw new Error('useDemoMode must be used within a DemoModeProvider');
  }
  return context;
}
