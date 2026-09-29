import fs from "node:fs";
import path from "node:path";

import type { Bundle } from "./types";

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

let cache: Bundle | null = null;

export function loadBundle(): Bundle {
  if (cache) return cache;
  cache = {
    themes: read("out", PUBLIC, "themes.json"),
    signals: read("out", PUBLIC, "signals.json"),
    pulse: read("out", PUBLIC, "app_pulse.json"),
    mood: read("out", PUBLIC, "mood.json"),
    briefing: read("out", PUBLIC, "briefing.json"),
    meta: read("out", PUBLIC, "meta.json"),
    evidence: read("out", PUBLIC, "evidence.json"),
    ask: read("out", PUBLIC, "ask.json"),
    internal: read("seed", "internal.json"),
    joined: read("seed", "joined.json"),
    products: read("out", PUBLIC, "products.json"),
    storeSeries: read("out", PUBLIC, "store_series.json"),
    responses: read("out", PUBLIC, "responses.json"),
    v3: read("seed", "internal_v3", "aggregates.json"),
  };
  return cache;
}
