import fs from "node:fs";
import path from "node:path";

/**
 * IndusInd · server-side loader. Each page reads only its own payload from data/out/indusind_v1/ (written by
 * scripts/build_indusind.py), so no page carries data it does not render. Re-read when the file changes, so a running
 * dev server never serves stale figures.
 */
const DIR = path.resolve(process.cwd(), "..", "data", "out", "indusind_v1");

const cache = new Map<string, { mtime: number; data: unknown }>();

export function loadPage<T>(name: string): T {
  const file = path.join(DIR, `${name}.json`);
  const mtime = fs.statSync(file).mtimeMs;
  const hit = cache.get(name);
  if (hit && hit.mtime === mtime) return hit.data as T;
  const data = JSON.parse(fs.readFileSync(file, "utf-8")) as T;
  cache.set(name, { mtime, data });
  return data;
}
