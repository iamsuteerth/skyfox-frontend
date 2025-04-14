import React, { createContext, useContext, useState, useCallback } from 'react';

interface ShowsContextType {
  refreshShows: () => void;
  lastRefreshTime: number;
}

const ShowsContext = createContext<ShowsContextType>({
  refreshShows: () => {},
  lastRefreshTime: 0
});

export const ShowsProvider: React.FC<{children: React.ReactNode}> = ({ children }) => {
  const [lastRefreshTime, setLastRefreshTime] = useState(Date.now());

  const refreshShows = useCallback(() => {
    setLastRefreshTime(Date.now());
  }, []);

  return (
    <ShowsContext.Provider value={{ refreshShows, lastRefreshTime }}>
      {children}
    </ShowsContext.Provider>
  );
};

export const useShows = () => {
  const context = useContext(ShowsContext);
  if (context === undefined) {
    throw new Error('useShows must be used within a ShowsProvider');
  }
  return context;
};
