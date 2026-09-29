"use client";

import { useLayoutEffect, useRef, useState } from "react";
import { useReducedMotion } from "./motion";

const NUM = /\d[\d,]*(?:\.\d+)?/g;
const DURATION_MS = 700;

type Part = {
  text: string;
  value?: number;
  decimals: number;
  grouped: boolean;
};

function parts(text: string, only?: string[]): Part[] {
  const out: Part[] = [];
  const pending = only ? [...only] : undefined;
  let last = 0;
  for (const m of text.matchAll(NUM)) {
    const idx = m.index ?? 0;
    if (idx > last)
      out.push({ text: text.slice(last, idx), decimals: 0, grouped: false });
    const s = m[0];
    const take = pending ? pending.indexOf(s) : 0;
    if (take >= 0) {
      pending?.splice(take, 1);
      out.push({
        text: s,
        value: Number(s.replace(/,/g, "")),
        decimals: s.split(".")[1]?.length ?? 0,
        grouped: s.includes(","),
      });
    } else {
      out.push({ text: s, decimals: 0, grouped: false });
    }
    last = idx + s.length;
  }
  if (last < text.length)
    out.push({ text: text.slice(last), decimals: 0, grouped: false });
  return out;
}

function frame(ps: Part[], k: number): string {
  return ps
    .map((p) =>
      p.value === undefined
        ? p.text
        : (p.value * k).toLocaleString("en-GB", {
            minimumFractionDigits: p.decimals,
            maximumFractionDigits: p.decimals,
            useGrouping: p.grouped,
          }),
    )
    .join("");
}

/**
 * Count-up (04 §6): first mount only, 700ms ease-out, en-GB formatted every frame, always
 * ending on the exact text it was given. The server render and reduced motion show the final
 * text. `only` limits the animation to those numbers (first occurrence of each).
 */
export function CountUp({
  text,
  only,
}: {
  text: string | number;
  only?: string[];
}) {
  const final = String(text);
  const reduced = useReducedMotion();
  const [shown, setShown] = useState<string | null>(null);
  const initial = useRef({ final, only });

  useLayoutEffect(() => {
    const ps = parts(initial.current.final, initial.current.only);
    if (reduced || !ps.some((p) => p.value !== undefined)) {
      setShown(null);
      return;
    }
    const t0 = performance.now();
    let raf = 0;
    const tick = (now: number) => {
      const t = Math.min(1, (now - t0) / DURATION_MS);
      if (t >= 1) {
        setShown(null);
        return;
      }
      setShown(frame(ps, 1 - (1 - t) ** 3));
      raf = requestAnimationFrame(tick);
    };
    setShown(frame(ps, 0));
    raf = requestAnimationFrame(tick);
    return () => {
      cancelAnimationFrame(raf);
      setShown(null);
    };
  }, [reduced]);

  return <>{shown ?? final}</>;
}
