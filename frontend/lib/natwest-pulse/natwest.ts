import fs from "node:fs";
import path from "node:path";

import { loadBundle } from "./load";
import {
  type AskQA,
  BRAND_IDS,
  type BrandId,
  DEFAULT_WINDOW,
  type NwDoc,
  type NwFrame,
  type Peer,
  type RegisterEntry,
  type Slice,
  type SourceRow,
  WINDOW_IDS,
  type WindowId,
} from "./nw";

/**
 * Server-side loader for the NatWest internal layer (data/out/natwest_pulse/natwest.json), the register and the answer
 * bank. The public files are read by the copied loader (load.ts, unchanged). Each page takes one window × brand slice
 * and passes each component only its block (HL-01).
 */
const ROOT = path.resolve(process.cwd(), "..", "data");

function read<T>(...parts: string[]): T {
  return JSON.parse(fs.readFileSync(path.join(ROOT, ...parts), "utf-8")) as T;
}

type Cache = {
  stamp: number;
  doc: NwDoc;
  register: { entries: RegisterEntry[]; peers: Peer[] };
  ask: { slices: Record<string, AskQA[]>; fallback: string };
};
let cache: Cache | null = null;

function all(): Cache {
  const stamp = fs.statSync(
    path.join(ROOT, "out", "natwest_pulse", "natwest.json"),
  ).mtimeMs;
  if (cache && cache.stamp === stamp) return cache;
  cache = {
    stamp,
    doc: read("out", "natwest_pulse", "natwest.json"),
    register: read("public", "natwest_register.json"),
    ask: read("out", "natwest_pulse", "ask.json"),
  };
  return cache;
}

export type SearchParams = Promise<
  Record<string, string | string[] | undefined>
>;

function one(v: string | string[] | undefined): string | undefined {
  return Array.isArray(v) ? v[0] : v;
}

/** The selected window and brand from the URL (anything unknown falls back to the defaults). */
export async function selection(
  sp?: SearchParams,
): Promise<{ w: WindowId; b: BrandId }> {
  const p = sp ? await sp : {};
  const w = one(p.w);
  const b = one(p.b);
  return {
    w: WINDOW_IDS.includes(w as WindowId) ? (w as WindowId) : DEFAULT_WINDOW,
    b: BRAND_IDS.includes(b as BrandId) ? (b as BrandId) : "all",
  };
}

export function nwSlice(w: WindowId, b: BrandId): Slice {
  return all().doc.slices[`${w}|${b}`];
}

/** The register entries a page cites, by id. */
export function registerEntries(ids: string[]): RegisterEntry[] {
  const reg = all().register.entries;
  return ids
    .map((id) => reg.find((e) => e.id === id))
    .filter((e): e is RegisterEntry => Boolean(e));
}

export function peers(): Peer[] {
  return all().register.peers;
}

export function sources(): SourceRow[] {
  return (loadBundle().meta as unknown as { sources: SourceRow[] }).sources;
}

export function frame(w: WindowId, b: BrandId): NwFrame {
  const { doc } = all();
  const meta = loadBundle().meta as unknown as {
    scope_note: string;
    public_loaded: boolean;
  };
  return {
    freezeLabel: doc.freeze_label,
    scopeNote: meta.scope_note,
    window: doc.windows.find((x) => x.id === w) ?? doc.windows[0],
    windows: doc.windows,
    brand: doc.brands.find((x) => x.id === b) ?? doc.brands[0],
    brands: doc.brands,
    w,
    b,
    publicLoaded: meta.public_loaded,
  };
}

export function askFor(
  w: WindowId,
  b: BrandId,
): { qa: AskQA[]; fallback: string } {
  const { ask } = all();
  return { qa: ask.slices[`${w}|${b}`] ?? [], fallback: ask.fallback };
}

export function nwDoc() {
  const { doc } = all();
  return {
    products: doc.products,
    journeys: doc.journeys,
    outcomes: doc.outcomes,
    segments: doc.segments,
  };
}
