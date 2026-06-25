// lib/useManagedInterval.ts
// -----------------------------------------------------------------------------
// The live monitor rail and any streaming widget must never leak a timer. This
// hook is the project convention: every interval/timeout in the app goes through
// here so it is cleared on unmount AND torn down + re-created whenever the theme
// toggles (pass `themeKey` from useTheme as a resetDep). This pre-empts the
// recurring "stale closure / leaked interval on theme toggle" bug class.
//
// Usage:
//   const { themeKey } = useTheme();
//   useManagedInterval(() => tick(), 4000, [themeKey]);   // paused when delay=null
// -----------------------------------------------------------------------------

import { useEffect, useRef } from 'react';

export function useManagedInterval(
  callback: () => void,
  /** Pass null to pause without unmounting. */
  delay: number | null,
  /** Reset dependencies — include `themeKey` so toggling re-keys the timer. */
  resetDeps: ReadonlyArray<unknown> = [],
): void {
  const saved = useRef(callback);

  useEffect(() => {
    saved.current = callback;
  }, [callback]);

  useEffect(() => {
    if (delay === null) return;
    const id = window.setInterval(() => saved.current(), delay);
    return () => window.clearInterval(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [delay, ...resetDeps]);
}
