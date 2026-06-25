// theme/DashboardThemeProvider.tsx
// -----------------------------------------------------------------------------
// Theme context for the CX Head room. Dark is the demo default; a light/dark
// toggle is always present and both modes target WCAG AA (CF-002):
//   - dark  text #F4F2FB on bg #0D0B16  → ~17:1
//   - light text #1A1530 on bg #F6F5FC  → ~14:1
//   - secondary text and accents checked against their own surfaces.
//
// State is in React memory only. No localStorage / sessionStorage anywhere —
// the toggle resets to dark on reload, which is correct for a demo build.
//
// `themeKey` increments on every toggle. Live components (the monitor rail,
// any interval-driven widget) should key their effects off `themeKey` so timers
// are torn down and re-established cleanly on a theme switch (recurring bug
// class: stale closures / leaked intervals on toggle).
// -----------------------------------------------------------------------------

import React, {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
} from 'react';
import { cssVarsFor, type ThemeMode } from './tokens';

interface ThemeContextValue {
  mode: ThemeMode;
  /** Increments on each toggle; use as an effect dependency for live widgets. */
  themeKey: number;
  toggle: () => void;
  setMode: (mode: ThemeMode) => void;
}

const ThemeContext = createContext<ThemeContextValue | null>(null);

export function useTheme(): ThemeContextValue {
  const ctx = useContext(ThemeContext);
  if (!ctx) {
    throw new Error('useTheme must be used within DashboardThemeProvider');
  }
  return ctx;
}

interface ProviderProps {
  /** Demo default is dark. */
  defaultMode?: ThemeMode;
  children: React.ReactNode;
}

export function DashboardThemeProvider({
  defaultMode = 'dark',
  children,
}: ProviderProps): React.ReactElement {
  const [mode, setModeState] = useState<ThemeMode>(defaultMode);
  const [themeKey, setThemeKey] = useState(0);

  const setMode = useCallback((next: ThemeMode) => {
    setModeState((prev) => {
      if (prev !== next) setThemeKey((k) => k + 1);
      return next;
    });
  }, []);

  const toggle = useCallback(() => {
    setModeState((prev) => (prev === 'dark' ? 'light' : 'dark'));
    setThemeKey((k) => k + 1);
  }, []);

  const value = useMemo<ThemeContextValue>(
    () => ({ mode, themeKey, toggle, setMode }),
    [mode, themeKey, toggle, setMode],
  );

  // CSS variables are written onto the shell root as an inline style object, so
  // the whole subtree themes from one place and no global :root is mutated.
  const styleVars = useMemo(
    () => cssVarsFor(mode) as React.CSSProperties,
    [mode],
  );

  return (
    <ThemeContext.Provider value={value}>
      <div
        className="lisn-shell"
        data-theme={mode}
        style={styleVars}
      >
        {children}
      </div>
    </ThemeContext.Provider>
  );
}
