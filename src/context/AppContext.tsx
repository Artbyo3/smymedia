// Simplified App Context for Media Vault
import React, { createContext, useContext, ReactNode } from 'react';

// Simple app state
interface AppState {
  theme: 'light' | 'dark';
}

// Context type
interface AppContextType {
  state: AppState;
  toggleTheme: () => void;
}

// Initial state
const initialState: AppState = {
  theme: 'dark',
};

// Create context
const AppContext = createContext<AppContextType | undefined>(undefined);

// Provider component
interface AppProviderProps {
  children: ReactNode;
}

export function AppProvider({ children }: AppProviderProps) {
  const [state, setState] = React.useState<AppState>(initialState);

  const toggleTheme = () => {
    setState(prev => ({
      ...prev,
      theme: prev.theme === 'light' ? 'dark' : 'light'
    }));
  };

  const contextValue: AppContextType = {
    state,
    toggleTheme,
  };

  return (
    <AppContext.Provider value={contextValue}>
      {children}
    </AppContext.Provider>
  );
}

// Hook to use the context
export function useAppContext() {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
}

// Theme hook
export function useTheme() {
  const { state, toggleTheme } = useAppContext();
  return {
    theme: state.theme,
    toggleTheme,
  };
}
