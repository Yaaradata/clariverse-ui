"use client";

import { meta, signalById } from "@kgs/lib/data";
import type { JoinTag } from "@kgs/types";
import {
  createContext,
  type ReactNode,
  useCallback,
  useContext,
  useMemo,
  useState,
} from "react";

const ALL_BRANDS = meta.filters.brand[0];
const ALL_REGIONS = meta.filters.region[0];

/** Join-tag region → Region filter option (01 §2: "NA (US regions + Canada)"; UK-EU countries). */
const REGION_GROUP: Record<string, string> = {
  NA: "NA",
  "US-SE": "NA",
  "US-SW": "NA",
  "US-NE": "NA",
  "US-MW": "NA",
  "US-W": "NA",
  Canada: "NA",
  "UK-EU": "UK-EU",
  UK: "UK-EU",
  DE: "UK-EU",
  NL: "UK-EU",
  FR: "UK-EU",
  APAC: "APAC/AUS",
};

const REGION_TOKEN = /^\{\{region:([^}]+)\}\}$/;

function tagValue(tags: JoinTag[], key: string): string | undefined {
  return tags.find((t) => t.key === key)?.value;
}

function regionsOf(tags: JoinTag[]): string[] {
  const v = tagValue(tags, "REGION");
  if (!v) return [];
  return v
    .split(" · ")
    .map((part) => part.trim())
    .map((part) => REGION_TOKEN.exec(part)?.[1] ?? part)
    .map((name) => REGION_GROUP[name] ?? name);
}

type Scope = {
  brand: string;
  region: string;
  setBrand: (b: string) => void;
  setRegion: (r: string) => void;
  reset: () => void;
  /** Any filter other than "All". */
  active: boolean;
  /** Whether a signal's BRAND / REGION join tags fall inside the current scope. */
  inScope: (signalId: string) => boolean;
};

const ScopeContext = createContext<Scope | null>(null);

/**
 * Brand / Region scope (04 §1.4 P1): re-scopes monitor cards and walls by their join tags. Counts
 * are never recomputed — out-of-scope cards simply disappear. In memory only.
 */
export function ScopeProvider({ children }: { children: ReactNode }) {
  const [brand, setBrand] = useState(ALL_BRANDS);
  const [region, setRegion] = useState(ALL_REGIONS);
  const reset = useCallback(() => {
    setBrand(ALL_BRANDS);
    setRegion(ALL_REGIONS);
  }, []);
  const value = useMemo<Scope>(() => {
    const inScope = (signalId: string) => {
      const tags = signalById[signalId]?.joinTags ?? [];
      const brandOk =
        brand === ALL_BRANDS || tagValue(tags, "BRAND")?.includes(brand);
      const regionOk =
        region === ALL_REGIONS || regionsOf(tags).includes(region);
      return Boolean(brandOk && regionOk);
    };
    return {
      brand,
      region,
      setBrand,
      setRegion,
      reset,
      active: brand !== ALL_BRANDS || region !== ALL_REGIONS,
      inScope,
    };
  }, [brand, region, reset]);
  return (
    <ScopeContext.Provider value={value}>{children}</ScopeContext.Provider>
  );
}

export function useScope(): Scope {
  const ctx = useContext(ScopeContext);
  if (!ctx) throw new Error("useScope must be used inside ScopeProvider");
  return ctx;
}
