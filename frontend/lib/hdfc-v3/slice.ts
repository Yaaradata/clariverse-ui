import {
  fastestRiser,
  releasePulse,
  sayingThemes,
  topPainTheme,
} from "./selectors";
import type { Bundle, Evidence } from "./types";

/**
 * Server-side slicing (review finding #1). A page passes its client component only the evidence it renders, never the
 * whole bundle: every other page gets an empty evidence map. Full quote text, source link and title go only to the
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
          ...sayingThemes(b).flatMap((t) => first(t.exemplars)),
        ],
        full: false,
      };
    case "deliverables":
      return { ids: first(b.signals.cure_watch.exemplars, 2), full: false };
    default:
      return { ids: [], full: false };
  }
}

function summaryOnly(e: Evidence): Evidence {
  return { ...e, redacted_text: "", url: "", title: null };
}

/** The bundle a page hands to its client component. */
export function sliceBundle(b: Bundle, s: Slice): Bundle {
  const { ids, full } = idsFor(b, s);
  const evidence: Record<string, Evidence> = {};
  for (const id of ids) {
    const e = b.evidence[id];
    if (e) evidence[id] = full ? e : summaryOnly(e);
  }
  return { ...b, evidence };
}
