import type { Period, PeriodId, PeriodsFile } from "./periods";
import {
  fastestRiser,
  releasePulse,
  sayingThemes,
  topPainTheme,
} from "./selectors";
import type { Bundle, Evidence } from "./types";

/**
 * Server-side slicing (review finding #1). A page passes its client component only the evidence it renders, never the
 * whole bundle: every other page gets an empty evidence map. Full quote text and title go only to the
 * signal page, the one screen that shows them; elsewhere a quote is its summary alone.
 */
export type Slice =
  | { view: "exec" | "business" | "priority" | "customer" | "action-queue" }
  | { view: "deliverables" | "satisfaction" | "market" }
  | { view: "module"; id: "cards" | "digital" }
  | { view: "signal"; id: string };

const first = (ids: string[] | undefined, n = 1) => (ids ?? []).slice(0, n);

function idsFor(b: Bundle, s: Slice): { ids: string[]; full: boolean } {
  switch (s.view) {
    case "exec":
      return {
        ids: [
          ...first(topPainTheme(b)?.exemplars),
          ...first(fastestRiser(b)?.exemplars),
          ...first(b.signals.promise_by_request_type[0]?.exemplars),
        ],
        full: false,
      };
    case "module":
      if (s.id === "digital") {
        const rp = releasePulse(b);
        return {
          ids: rp ? [...rp.exemplars, ...first(rp.praise_exemplars, 2)] : [],
          full: false,
        };
      }
      return {
        ids: [
          "card_variant_migration",
          "card_fees_charges",
          "rewards_value",
        ].flatMap((t) =>
          first(b.themes.themes.find((x) => x.id === t)?.exemplars),
        ),
        full: false,
      };
    case "signal": {
      if (s.id === "release-pulse")
        return idsFor(b, { view: "module", id: "digital" });
      const t = b.themes.themes.find((x) => x.id === s.id);
      return { ids: first(t?.exemplars, 5), full: true };
    }
    case "market":
      return {
        ids: [
          ...b.pulse.apps.flatMap((a) =>
            a.fix_list.slice(0, 5).flatMap((f) => first(f.example_ids)),
          ),
          ...b.signals.voices_with_reach.slice(0, 5).map((v) => v.id),
        ],
        full: false,
      };
    case "satisfaction":
      return {
        ids: [
          ...first(b.signals.closure_intent.exemplars, 2),
          // Three per theme, so the page can skip a quote already shown under another theme.
          ...sayingThemes(b).flatMap((t) => first(t.exemplars, 3)),
        ],
        full: false,
      };
    case "deliverables":
      return {
        ids: [
          ...first(b.signals.cure_watch.exemplars, 2),
          ...first(b.signals.closure_intent.exemplars),
        ],
        full: false,
      };
    default:
      return { ids: [], full: false };
  }
}

function summaryOnly(e: Evidence): Evidence {
  return { ...e, redacted_text: "", title: null };
}

/**
 * Period figures (30 Sep views) are large: the MD view gets every period without the Cards block, the Cards view gets
 * the Cards block only, and every other page gets an empty shell.
 */
function slicePeriods(b: Bundle, s: Slice): PeriodsFile {
  const file = b.periods;
  const periods = {} as PeriodsFile["periods"];
  for (const id of Object.keys(file.periods) as PeriodId[]) {
    const p = file.periods[id];
    if (s.view === "exec") {
      periods[id] = { ...p, cards: {} as Period["cards"] };
    } else if (s.view === "business") {
      periods[id] = {
        id: p.id,
        label: p.label,
        short: p.short,
        start: p.start,
        end: p.end,
        public_start: p.public_start,
        public_end: p.public_end,
        compare: p.compare,
        cards: p.cards,
      } as Period;
    }
  }
  return { ...file, periods };
}

/** The bundle a page hands to its client component. */
export function sliceBundle(b: Bundle, s: Slice): Bundle {
  const { ids, full } = idsFor(b, s);
  const evidence: Record<string, Evidence> = {};
  for (const id of ids) {
    const e = b.evidence[id];
    if (e) evidence[id] = full ? e : summaryOnly(e);
  }
  return { ...b, evidence, periods: slicePeriods(b, s) };
}
