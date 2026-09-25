import fs from "node:fs";
import path from "node:path";

import type { Bundle } from "./types";

/**
 * Server-side loader. The pipeline writes to the repo root (data/out/app, data/seed); the frontend reads those files at
 * build time, so every figure on screen comes from one seeded dataset.
 */
const ROOT = path.resolve(process.cwd(), "..", "data");

function read<T>(...parts: string[]): T {
  return JSON.parse(fs.readFileSync(path.join(ROOT, ...parts), "utf-8")) as T;
}

let cache: Bundle | null = null;

export function loadBundle(): Bundle {
  if (cache) return cache;
  cache = {
    themes: read("out", "app", "themes.json"),
    signals: read("out", "app", "signals.json"),
    pulse: read("out", "app", "app_pulse.json"),
    mood: read("out", "app", "mood.json"),
    briefing: read("out", "app", "briefing.json"),
    meta: read("out", "app", "meta.json"),
    evidence: read("out", "app", "evidence.json"),
    ask: read("out", "app", "ask.json"),
    internal: read("seed", "internal.json"),
    joined: read("seed", "joined.json"),
  };
  return cache;
}
