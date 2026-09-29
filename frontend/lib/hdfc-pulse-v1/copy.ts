/**
 * Answer-line templates (B4 §6). Filled from data only. British spelling, no exclamation marks.
 */
import { fmt, fmtNum, fmtSigned } from "./format";
import {
  improvingItems,
  needsYou,
  releasePulse,
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
  const scored = b.themes.themes
    .filter((t) => t.score > 0)
    .sort((a, c) => c.score - a.score);
  const top = scored[0];
  const rp = releasePulse(b);
  const parts: string[] = [];
  if (rp && rp.new_app_avg !== null && rp.old_app_avg !== null) {
    parts.push(
      `The new HDFC Bank app averages ${rp.new_app_avg.toFixed(1)} stars across ${fmt(rp.new_app_n)} reviews on versions 11.x, against ${rp.old_app_avg.toFixed(
        1,
      )} on the previous app.`,
    );
  }
  if (top && tm[top.id])
    parts.push(
      `${top.label} is the fastest riser: ${fmt(top.count)} items, ${trendWords(top)}.`,
    );
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
  return `${pb.length} promise types were broken in public voice this window; ${RT[top?.request_type] ?? "service requests"} drives the most; ${share.toFixed(
    0,
  )}% of posts are customers asking where something is.`;
}

export function moodLine(b: Bundle): string {
  const m = b.mood;
  return `Mood index ${fmtNum(m.value)} over the last 7 days (${fmtSigned(m.delta_pts, " pts")} vs the window average of ${fmtNum(m.window_average)}).`;
}
