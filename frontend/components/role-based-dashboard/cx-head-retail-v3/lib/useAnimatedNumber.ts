"use client";

import { useEffect, useState } from "react";

function easeOutCubic(t: number): number {
  return 1 - (1 - t) ** 3;
}

export function usePrefersReducedMotion(): boolean {
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = (): void => setReduced(media.matches);
    update();
    media.addEventListener("change", update);
    return () => media.removeEventListener("change", update);
  }, []);

  return reduced;
}

export function useAnimatedNumber(
  target: number,
  options?: {
    duration?: number;
    decimals?: number;
    delay?: number;
    enabled?: boolean;
  },
): number {
  const { duration = 900, decimals = 0, delay = 0, enabled = true } = options ?? {};
  const reducedMotion = usePrefersReducedMotion();
  const shouldAnimate = enabled && !reducedMotion;
  const [value, setValue] = useState(shouldAnimate ? 0 : target);

  useEffect(() => {
    if (!shouldAnimate) {
      setValue(target);
      return;
    }

    let raf = 0;
    let start: number | null = null;
    const timeout = window.setTimeout(() => {
      const step = (ts: number): void => {
        if (start === null) start = ts;
        const progress = Math.min((ts - start) / duration, 1);
        const current = target * easeOutCubic(progress);
        setValue(decimals > 0 ? Number(current.toFixed(decimals)) : Math.round(current));
        if (progress < 1) raf = window.requestAnimationFrame(step);
      };
      raf = window.requestAnimationFrame(step);
    }, delay);

    return () => {
      window.clearTimeout(timeout);
      window.cancelAnimationFrame(raf);
    };
  }, [target, duration, decimals, delay, shouldAnimate]);

  return shouldAnimate ? value : target;
}
