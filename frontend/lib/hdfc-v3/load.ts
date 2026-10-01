import fs from "node:fs";
import path from "node:path";

import type { Bundle, Evidence } from "./types";

/**
 * Server-side loader. The pipeline writes to the repo root (data/out/app, data/seed); the frontend reads those files at
 * build time, so every figure on screen comes from one seeded dataset.
 */
const ROOT = path.resolve(process.cwd(), "..", "data");
/** V2 reads the Jul–Sep 2026 public data; V1 (lib/hdfc-pulse-v1) keeps data/out/app. */
const PUBLIC = "app_jul_sep";

function read<T>(...parts: string[]): T {
  return JSON.parse(fs.readFileSync(path.join(ROOT, ...parts), "utf-8")) as T;
}

/**
 * Post URLs stay in evidence.json on the server, for audit only. They are dropped here, so no page payload can carry a
 * link to the original post (follow-up fix 1); each quote carries a plain place label instead.
 */
function withoutLinks(raw: Record<string, Evidence & { url?: string }>) {
  const out: Record<string, Evidence> = {};
  for (const [id, { url: _url, ...e }] of Object.entries(raw)) out[id] = e;
  return out;
}

let cache: Bundle | null = null;
let stamp = 0;

export function loadBundle(): Bundle {
  // The period figures are regenerated most often: when that file changes, read everything again, so a running dev
  // server never serves data older than the files on disk.
  const changed = fs.statSync(
    path.join(ROOT, "out", PUBLIC, "periods.json"),
  ).mtimeMs;
  if (cache && changed === stamp) return cache;
  stamp = changed;
  cache = {
    themes: read("out", PUBLIC, "themes.json"),
    signals: read("out", PUBLIC, "signals.json"),
    pulse: read("out", PUBLIC, "app_pulse.json"),
    mood: read("out", PUBLIC, "mood.json"),
    briefing: read("out", PUBLIC, "briefing.json"),
    meta: read("out", PUBLIC, "meta.json"),
    evidence: withoutLinks(read("out", PUBLIC, "evidence.json")),
    ask: read("out", PUBLIC, "ask.json"),
    products: read("out", PUBLIC, "products.json"),
    storeSeries: read("out", PUBLIC, "store_series.json"),
    responses: read("out", PUBLIC, "responses.json"),
    v3: read("seed", "internal_v3", "aggregates.json"),
    periods: read("out", PUBLIC, "periods.json"),
  };
  return cache;
}
