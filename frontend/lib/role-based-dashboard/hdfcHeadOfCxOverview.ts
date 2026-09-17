/**
 * HDFC Head of CX — overview screen overrides (tile series / insights).
 * Route: /role-based/hdfc/head_of_cx only.
 */
import type { RoleDashboardData } from "./registry";

/** Executive Pulse bodies — regulatory / reputational / operational (X + Reddit grounded). */
export const HDFC_HEAD_OF_CX_EXECUTIVE_PULSE = [
  {
    q: "🔴 What's critical",
    main: "Recovery-conduct data-leak + threat and two fraud cases (₹2.4L, ₹10L) escalating to the RBI Ombudsman.",
  },
  {
    q: "🎯 Where's your focus",
    main: "Reputation weakest (46, ↓16) — Swiggy migration + rival-switching; clear re-KYC (612), lift Fee-Dispute SLA (64%).",
  },
  {
    q: "🟢 What's stable/ on-track",
    main: "App self-service (FCR 88%) and routine intents (92–97% SLA) on track; re-KYC the one bottleneck.",
  },
] as const;

/** Apply tile + insight overrides on top of shared head_contact ROLE_DATA. */
export function applyHdfcHeadOfCxOverviewData(
  base: RoleDashboardData,
): RoleDashboardData {
  return {
    ...base,
    tiles: [
      {
        ...base.tiles[0],
        score: 64,
        insight:
          "Post-CSAT 78% and FCR 74% stay under pressure as repeat-contact climbs to 22% — fee-dispute and card-servicing repeats alone drive about half of it. Sentiment-at-close is softening, with avoidable poor endings concentrated in chat and ticket.",
        kpis: [
          { l: "Post-CSAT", v: "78%" },
          { l: "FCR", v: "74%" },
          { l: "Repeat Contact", v: "22%" },
          { l: "Sentiment@Close", v: "68%" },
        ],
      },
      {
        ...base.tiles[1],
        score: 46,
        insight:
          "Public reputation is being set by the forced Swiggy-card migration and 'no-reply / complaint-ignored' threads, and 55% of Reddit posts now benchmark HDFC against ICICI, Axis and SBI. RBI / Banking Ombudsman-risk cases and escalation velocity make contact-centre issues visible as brand risk.",
        kpis: [
          { l: "X Sentiment", v: "0.38" },
          { l: "Reddit Sentiment", v: "0.48" },
          { l: "Trustpilot", v: "3.1★" },
          { l: "App / Play", v: "4.0 / 4.1★" },
        ],
      },
      {
        ...base.tiles[2],
        // Parity with retail "How is our Service delivery?" overview tile
        score: 68,
        color: "#eab308",
        sub: "Best vs Worst SLA · Trend · Bottleneck",
        insight:
          "SLA is best on Card Replacement (91%) and worst on Fee Dispute (64% — avg 3.2 days vs a 1-day target), trending down 6% this week. Re-KYC handoff is the top bottleneck (612 accounts past the 3-day SLA), and BPO Beta (dispute-win 38% vs 71% in-house) remains the biggest operational drag.",
        kpis: [
          { l: "Best SLA", v: "91%" },
          { l: "Worst SLA", v: "64%" },
          { l: "Trend", v: "▼ −6%" },
          { l: "Bottleneck", v: "Re-KYC handoff" },
        ],
      },
    ],
    insights: [
      "Per-contact resolution quality eroding: 22% repeat-contact rate. Fee-dispute and card-servicing repeats drive about half of avoidable repeats across chat and ticket.",
      "Public reputation is being set by the forced Swiggy-card migration and 'no-reply / complaint-ignored' threads; 55% of Reddit posts benchmark HDFC against ICICI, Axis and SBI.",
      "Fee Dispute intent has worst SLA at 64% — avg resolution 3.2 days vs 1-day target. Re-KYC handoff bottleneck: 612 accounts past the 3-day SLA; BPO Beta dispute-win drag persists.",
    ],
  };
}
