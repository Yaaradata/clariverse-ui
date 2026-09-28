/**
 * Answer-line templates (B4 §6). Filled from data only. British spelling, no exclamation marks.
 */
import { fmt, fmtNum } from "./format";
import {
  improvingItems,
  needsYou,
  routedItems,
  themeMap,
  trendWords,
} from "./selectors";
import type { Bundle } from "./types";

export function execAnswer(b: Bundle): string {
  const n = needsYou(b).length;
  const m = routedItems(b).length;
  const k = improvingItems(b).length;
  return `${n} signal${n === 1 ? "" : "s"} need${n === 1 ? "s" : ""} you today. ${m} routed overnight. ${k} improving.`;
}

export function whatChanged(b: Bundle): string {
  const tm = themeMap(b);
  const lead = tm.complaint_handling;
  const top = b.themes.themes
    .filter((t) => t.score > 0)
    .sort((a, c) => c.score - a.score)[0];
  const parts: string[] = [];
  if (lead)
    parts.push(
      `${lead.label} leads: ${fmt(lead.count)} public items, ${fmt(lead.escalation_count)} of them naming a regulator, court or ombudsman.`,
    );
  if (top && top.id !== lead?.id)
    parts.push(`${top.label} is the fastest riser: ${trendWords(top)}.`);
  return parts.join(" ");
}

export function satisfactionAnswer(b: Bundle): string {
  const ps = [...b.themes.pillars].filter(
    (p) => p.count >= 30 && p.net_sentiment !== null,
  );
  const best = [...ps].sort(
    (a, c) => (c.net_sentiment ?? 0) - (a.net_sentiment ?? 0),
  )[0];
  const worst = [...ps].sort(
    (a, c) => (a.net_sentiment ?? 0) - (c.net_sentiment ?? 0),
  )[0];
  const tiers =
    (b.internal as { tiers?: { tier: string; share_negative: number }[] })
      .tiers ?? [];
  const sharpest = [...tiers].sort(
    (a, c) => c.share_negative - a.share_negative,
  )[0];
  return `Customers are most positive on ${best?.label.toLowerCase()} and least positive on ${worst?.label.toLowerCase()}${
    sharpest
      ? `; ${sharpest.tier} relationships show the highest negative share (illustrative).`
      : "."
  }`;
}

export function marketAnswer(b: Bundle): string {
  const actionable = b.themes.themes.filter(
    (t) =>
      ![
        "general_dissatisfaction",
        "other",
        "market_news",
        "offers_deals",
        "product_advice",
        "app_praise",
        "service_praise",
      ].includes(t.id),
  );
  const top = [...actionable].sort((a, c) => c.count - a.count)[0];
  const riser = [...b.themes.themes]
    .filter((t) => t.score > 0)
    .sort((a, c) => c.score - a.score)[0];
  const praise = b.themes.themes.find((t) => t.id === "app_praise");
  return `Across ${fmt(b.themes.total_items)} public posts and reviews since 1 August, ${top?.label.toLowerCase()} leads; ${riser?.label.toLowerCase()} is rising fastest; ${
    praise
      ? "quick, easy app journeys are where HDFC is praised most"
      : "praise is thin"
  }.`;
}

export function promiseAnswer(b: Bundle): string {
  const pb = b.signals.promise_by_request_type.filter(
    (p) => p.request_type !== "other",
  );
  const top = pb[0];
  const RT: Record<string, string> = {
    card_delivery: "card delivery",
    refund: "refunds",
    reversal: "failed-transaction reversal",
    dispute: "disputes",
    closure: "closure",
    loan_disbursal: "loan disbursal",
    credit_report: "credit-report correction",
    kyc: "KYC and profile updates",
  };
  const share = b.signals.transparency_gap.share ?? 0;
  return `${pb.length} request types missed their timeline in public voice this window; ${RT[top?.request_type] ?? "service requests"} drives the most; ${share.toFixed(
    0,
  )}% of posts are customers asking where something is.`;
}

/** B7 §4.4: mood as the change against the window average. Public voice skews negative, so no raw index. */
export function moodLine(b: Bundle): string {
  const m = b.mood;
  const dir = (m.delta_pts ?? 0) < 0 ? "below" : "above";
  return `The last 7 days sit ${fmtNum(Math.abs(m.delta_pts ?? 0))} points ${dir} the window average. Public voice skews negative, so the change matters more than the level.`;
}
