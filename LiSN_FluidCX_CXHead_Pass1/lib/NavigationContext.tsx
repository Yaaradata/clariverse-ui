// lib/NavigationContext.tsx
// -----------------------------------------------------------------------------
// The whole router. In-memory only (no URL, no storage) — correct for a single-
// session demo. Two concerns:
//   1. activeScreen — which of the five locked screens is showing.
//   2. drill        — the open drill-down, ALWAYS carried as { screenId, itemId,
//      cardType }. Drill-downs in later passes render by the item's own id, so a
//      row routes to its own evidence, never a shared constant (recurring bug
//      class: every drill cell opening the same target).
//
// Pass 1 wires the scaffold; no drills are opened yet.
// -----------------------------------------------------------------------------

import React, {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
} from 'react';
import { DEFAULT_SCREEN, type ScreenId } from './routes';

/** Identifies which card/widget the drill belongs to, for the distinct-per-card
 *  drill signature dispatch added in later passes. */
export type CardType =
  | 'cc-radar'
  | 'ds-outbreak'
  | 'ds-fssai'
  | 'seller-trust'
  | 'rating-velocity'
  | 'return-text'
  | 'dark-pattern'
  | 'sla-clock'
  | 'agent-quality'
  | 'repeat-pareto'
  | 'suppression-watch'
  | 'refund-friction'
  | 'bridge';

export interface DrillTarget {
  screenId: ScreenId;
  /** The clicked item's OWN id — the thing that makes the drill specific. */
  itemId: string;
  cardType: CardType;
}

interface NavigationValue {
  activeScreen: ScreenId;
  drill: DrillTarget | null;
  navigate: (screen: ScreenId) => void;
  /** Open a drill keyed to the clicked row's own id. */
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
    setDrill(null); // changing rooms closes any open drill
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
