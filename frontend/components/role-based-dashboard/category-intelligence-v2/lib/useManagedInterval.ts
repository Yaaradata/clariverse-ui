import { useEffect, useRef } from "react";

export function useManagedInterval(
  callback: () => void,
  delayMs: number | null,
  deps: unknown[] = [],
): void {
  const saved = useRef(callback);
  saved.current = callback;

  useEffect(() => {
    if (delayMs === null) return;
    const id = window.setInterval(() => saved.current(), delayMs);
    return () => window.clearInterval(id);
  }, [delayMs, ...deps]);
}
