import { createContext, useContext, ReactNode, useState, useEffect } from 'react';

interface SimulationContextValue {
  isSimulationMode: boolean;
  isLiveExecutionEnabled: boolean;
  toggleSimulation: () => void;
  toggleLiveExecution: () => void;
  setSimulationMode: (enabled: boolean) => void;
  setLiveExecutionEnabled: (enabled: boolean) => void;
}

const SimulationContext = createContext<SimulationContextValue | undefined>(undefined);

interface SimulationProviderProps {
  children: ReactNode;
}

export function SimulationProvider({ children }: SimulationProviderProps) {
  // Default to simulation mode ON (safe)
  const [isSimulationMode, setIsSimulationMode] = useState(() => {
    const stored = localStorage.getItem('brikk_simulation_mode');
    return stored !== null ? stored === 'true' : true;
  });

  // Live execution is OFF by default (requires explicit opt-in)
  const [isLiveExecutionEnabled, setIsLiveExecutionEnabled] = useState(() => {
    const stored = localStorage.getItem('brikk_live_execution');
    const liveAllowed = import.meta.env.VITE_LIVE_ALLOWED === 'true';
    return stored !== null && liveAllowed ? stored === 'true' : false;
  });

  useEffect(() => {
    localStorage.setItem('brikk_simulation_mode', String(isSimulationMode));
  }, [isSimulationMode]);

  useEffect(() => {
    localStorage.setItem('brikk_live_execution', String(isLiveExecutionEnabled));
  }, [isLiveExecutionEnabled]);

  const toggleSimulation = () => {
    setIsSimulationMode((prev) => !prev);
    // When turning simulation ON, disable live execution for safety
    if (!isSimulationMode) {
      setIsLiveExecutionEnabled(false);
    }
  };

  const toggleLiveExecution = () => {
    // Can only enable live execution when simulation is OFF
    if (!isSimulationMode) {
      setIsLiveExecutionEnabled((prev) => !prev);
    }
  };

  const setSimulationMode = (enabled: boolean) => {
    setIsSimulationMode(enabled);
    if (enabled) {
      setIsLiveExecutionEnabled(false);
    }
  };

  return (
    <SimulationContext.Provider
      value={{
        isSimulationMode,
        isLiveExecutionEnabled,
        toggleSimulation,
        toggleLiveExecution,
        setSimulationMode,
        setLiveExecutionEnabled: setIsLiveExecutionEnabled,
      }}
    >
      {children}
    </SimulationContext.Provider>
  );
}

export function useSimulation() {
  const context = useContext(SimulationContext);
  if (context === undefined) {
    throw new Error('useSimulation must be used within a SimulationProvider');
  }
  return context;
}

