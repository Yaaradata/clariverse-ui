/**
 * values.ts — the single values module 02 asks for.
 *
 * Every value figure (V-01…V-14) is stored once in exec.json › valueRegister and
 * re-exported here. Components import from this module; they never recompute,
 * re-round or total these figures, and never add $ and £.
 */
import exec from '../data/exec.json';
import type { MoneyEntry, UnitCosts, ValueItem } from '../types';

export const valueRegister = exec.valueRegister as ValueItem[];

/** Lookup by id: VALUES['V-02'].figure / .method (method = tooltip text). */
export const VALUES: Record<string, ValueItem> = Object.fromEntries(valueRegister.map((v) => [v.id, v]));

/** Tooltip text for a tile or line that cites one or more V-ids ("V-01,V-02" or ['V-02', 'V-05']). */
export function methodFor(ids: string | string[]): string[] {
  const list = Array.isArray(ids) ? ids : ids.split(',');
  return list.map((id) => id.trim()).filter((id) => VALUES[id]).map((id) => `${id} · ${VALUES[id].method}`);
}

export const unitCosts = exec.unitCosts as UnitCosts;

/** Typed money values (amount + currency + FIXED display) for IllustrativeChip and tooltips. */
export const money = exec.money as Record<string, MoneyEntry>;

export const valueStatements: string[] = exec.valueStatements;
export const neverOnScreen: string = exec.neverOnScreen;
