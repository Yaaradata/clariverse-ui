"use client";

import { useEffect, useRef, useState } from "react";

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
  /** `null` = first mount; animate from 0. Otherwise resume from last rendered value. */
  const valueRef = useRef<number | null>(null);
  const [value, setValue] = useState(0);

  useEffect(() => {
    const finalize = (next: number): void => {
      const resolved = decimals > 0 ? Number(next.toFixed(decimals)) : Math.round(next);
      valueRef.current = resolved;
      setValue(resolved);
    };

    if (!shouldAnimate) {
      finalize(target);
      return;
    }

    const from = valueRef.current ?? 0;
    const threshold = decimals > 0 ? 10 ** -decimals : 0.001;
    if (valueRef.current !== null && Math.abs(from - target) < threshold) {
      finalize(target);
      return;
    }

    let raf = 0;
    let cancelled = false;
    let start: number | null = null;
    const timeout = window.setTimeout(() => {
      const step = (ts: number): void => {
        if (cancelled) return;
        if (start === null) start = ts;
        const progress = Math.min((ts - start) / duration, 1);
        const current = from + (target - from) * easeOutCubic(progress);
        const next = decimals > 0 ? Number(current.toFixed(decimals)) : Math.round(current);
        valueRef.current = next;
        setValue(next);
        if (progress < 1) {
          raf = window.requestAnimationFrame(step);
        } else {
          finalize(target);
        }
      };
      raf = window.requestAnimationFrame(step);
    }, delay);

    return () => {
      cancelled = true;
      window.clearTimeout(timeout);
      window.cancelAnimationFrame(raf);
    };
  }, [target, duration, decimals, delay, shouldAnimate]);

  return shouldAnimate ? value : target;
}
