"use client";

import React, { createContext, useCallback, useContext, useMemo, useState } from "react";

import { CX_PERSONA_RAIL_ORDER, DEFAULT_RAIL_ORDER, buildInitialAppState } from "../lib/seedData";
import {
  type AppState,
  type PersonaId,
  type ThemeMode,
  type UiState,
} from "./appState";

interface AppStateContextValue {
  state: AppState;
  setTheme: (theme: ThemeMode) => void;
  setPersonaId: (personaId: PersonaId) => void;
  resetTransientUi: () => void;
  patchUi: (patch: Partial<UiState>) => void;
  reorderRail: (orderedSignalIds: string[]) => void;
  appendAudit: (entry: AppState["audit"][number]) => void;
}

const AppStateContext = createContext<AppStateContextValue | null>(null);

const EMPTY_UI: UiState = {
  selectedSignalId: null,
  openDrill: null,
  dayGeneratorActive: false,
};

export function useAppState(): AppStateContextValue {
  const ctx = useContext(AppStateContext);
  if (!ctx) {
    throw new Error("useAppState must be used within AppStateProvider");
  }
  return ctx;
}

export function AppStateProvider({
  children,
}: {
  children: React.ReactNode;
}): React.ReactElement {
  const [state, setState] = useState<AppState>(buildInitialAppState);

  const setTheme = useCallback((theme: ThemeMode) => {
    setState((prev) => ({ ...prev, theme }));
  }, []);

  const resetTransientUi = useCallback(() => {
    setState((prev) => ({ ...prev, ui: { ...EMPTY_UI } }));
  }, []);

  const setPersonaId = useCallback((personaId: PersonaId) => {
    const railOrder = personaId === "cx-voc-head" ? CX_PERSONA_RAIL_ORDER : DEFAULT_RAIL_ORDER;
    setState((prev) => ({
      ...prev,
      personaId,
      ui: { ...EMPTY_UI },
      rail: { ...prev.rail, orderedSignalIds: railOrder },
    }));
  }, []);

  const patchUi = useCallback((patch: Partial<UiState>) => {
    setState((prev) => ({ ...prev, ui: { ...prev.ui, ...patch } }));
  }, []);

  const reorderRail = useCallback((orderedSignalIds: string[]) => {
    setState((prev) => ({
      ...prev,
      rail: { ...prev.rail, orderedSignalIds },
      ui: { ...prev.ui, dayGeneratorActive: true },
    }));
  }, []);

  const appendAudit = useCallback((entry: AppState["audit"][number]) => {
    setState((prev) => ({ ...prev, audit: [...prev.audit, entry] }));
  }, []);

  const value = useMemo(
    () => ({
      state,
      setTheme,
      setPersonaId,
      resetTransientUi,
      patchUi,
      reorderRail,
      appendAudit,
    }),
    [state, setTheme, setPersonaId, resetTransientUi, patchUi, reorderRail, appendAudit],
  );

  return <AppStateContext.Provider value={value}>{children}</AppStateContext.Provider>;
}
