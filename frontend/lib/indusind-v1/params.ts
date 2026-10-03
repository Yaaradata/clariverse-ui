import type { ViewId, WindowId } from "./types";

/**
 * IndusInd · view, window and business live in the URL (?v=&w=&b=), so the server slices each page payload to the one
 * view it renders and the browser never receives the other windows.
 */
export const BASE = "/indusind-v1";

const WINDOWS: WindowId[] = ["week", "w4", "w13"];
const VIEWS: ViewId[] = ["ceo", "cx"];
export const BUSINESSES = [
  "all",
  "deposits",
  "vehicle",
  "micro",
  "cards",
  "digital",
];

export type Sel = { v: ViewId; w: WindowId; b: string };

type SP = Record<string, string | string[] | undefined>;

const one = (x: string | string[] | undefined) => (Array.isArray(x) ? x[0] : x);

export function readSel(sp: SP, defaultWindow: WindowId = "w4"): Sel {
  const v = one(sp.v) as ViewId | undefined;
  const w = one(sp.w) as WindowId | undefined;
  const b = one(sp.b);
  return {
    v: v && VIEWS.includes(v) ? v : "ceo",
    w: w && WINDOWS.includes(w) ? w : defaultWindow,
    b: b && BUSINESSES.includes(b) ? b : "all",
  };
}

/** A link that keeps the current selection and changes one part of it. Defaults are left out of the URL. */
export function hrefWith(path: string, sel: Sel, patch: Partial<Sel> = {}) {
  const s = { ...sel, ...patch };
  const q = new URLSearchParams();
  if (s.v !== "ceo") q.set("v", s.v);
  if (s.w !== "w4") q.set("w", s.w);
  if (s.b !== "all") q.set("b", s.b);
  const qs = q.toString();
  return qs ? `${path}?${qs}` : path;
}
