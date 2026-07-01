// lib/NavigationContext.tsx — in-memory router + drill keyed by item id.

import React, {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
} from 'react';
import type { DrillSignature } from './cxHeadRetailData';
import { DEFAULT_SCREEN, type ScreenId } from './routes';

export interface DrillTarget {
  screenId: ScreenId;
  /** The clicked item's own id — routes to its evidence pack. */
  itemId: string;
  drillSignature: DrillSignature;
}

interface NavigationValue {
  activeScreen: ScreenId;
  drill: DrillTarget | null;
  navigate: (screen: ScreenId) => void;
  openDrill: (target: DrillTarget) => void;
  closeDrill: () => void;
}

const NavigationContext = createContext<NavigationValue | null>(null);

export function useNavigation(): NavigationValue {
  const ctx = useContext(NavigationContext);
  if (!ctx) {
    throw new Error('useNavigation must be used within NavigationProvider');
  }
  return ctx;
}

export function NavigationProvider({
  children,
}: {
  children: React.ReactNode;
}): React.ReactElement {
  const [activeScreen, setActiveScreen] = useState<ScreenId>(DEFAULT_SCREEN);
  const [drill, setDrill] = useState<DrillTarget | null>(null);

  const navigate = useCallback((screen: ScreenId) => {
    setActiveScreen(screen);
    setDrill(null);
  }, []);

  const openDrill = useCallback((target: DrillTarget) => {
    setDrill(target);
  }, []);

  const closeDrill = useCallback(() => setDrill(null), []);

  const value = useMemo<NavigationValue>(
    () => ({ activeScreen, drill, navigate, openDrill, closeDrill }),
    [activeScreen, drill, navigate, openDrill, closeDrill],
  );

  return (
    <NavigationContext.Provider value={value}>
      {children}
    </NavigationContext.Provider>
  );
}
