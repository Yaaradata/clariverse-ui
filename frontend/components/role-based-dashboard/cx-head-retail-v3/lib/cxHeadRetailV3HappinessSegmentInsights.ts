import type { FCIInsight, FCIInsightDetails } from "@/components/FCI/AISummaryWall";
import {
  getHappinessSegmentRows,
  type HappinessPeriodKey,
} from "./cxHeadRetailV3CustomerHappinessData";
import {
  segmentRevenueAtRiskCr,
  segmentsRankedByRevenueAtRisk,
  type HappinessSegmentKey,
  type HappinessSegmentRow,
} from "./cxHeadRetailV3HappinessLensData";

/** Same ₹ Cr display as the segment table (₹22.4 / ₹0.3). */
function formatCr(n: number): string {
  const v = Math.round(n * 100) / 100;
  const shown = v % 1 !== 0 ? v.toFixed(1) : String(Math.round(v));
  return `₹${shown}`;
}

/** AOV / ATV in ₹ Cr — same ÷1000 display as the table. */
function formatAovAtvCr(inr: number): string {
  return formatCr(inr / 1000);
}

type InsightShell = {
  id: string;
  severity: FCIInsight["severity"];
  category: FCIInsight["category"];
  title: string;
  detailsBase: Omit<FCIInsightDetails, "rootCause" | "estimatedImpact"> & {
    rootCauseLead: string;
  };
};

const INSIGHT_SHELL: Record<HappinessSegmentKey, InsightShell> = {
  active: {
    id: "HS-001",
    severity: "critical",
    category: "customer-experience",
    title: "Active holds the ₹ at risk",
    detailsBase: {
      rootCauseLead:
        "Active cohort size × churn × GMV concentrates commercial exposure. Delivery ETA first-pass misses force repeat contacts.",
      affectedAreas: ["Active segment", "Delivery ops", "Contact centre", "Happiness index"],
      recommendedActions: [
        "Tighten first-pass resolve on delivery ETA before peak sale",
        "Ring-fence agent capacity on Active vs Dormant win-back",
        "Escalate ETA promise SLAs with logistics hubs",
      ],
      timeToResolve: "This window · before peak sale",
      assignedTo: "CX Ops · Delivery",
      priority: "immediate",
      priorityLabel: "Action Needed",
    },
  },
  occasional: {
    id: "HS-002",
    severity: "alert",
    category: "sla-breach",
    title: "Occasional FCR leak",
    detailsBase: {
      rootCauseLead:
        "Refund and return cases stall for Occasional buyers — resolution drag kills repurchase intent even while AOV stays intact.",
      affectedAreas: ["Occasional segment", "Refund desk", "Returns logistics"],
      recommendedActions: [
        "Route Occasional refund/return cases to the priority queue",
        "Publish refund status SMS within 24h of pickup",
        "Protect next-order window with proactive status nudges",
      ],
      timeToResolve: "3–5 business days",
      assignedTo: "Refunds · CX Ops",
      priority: "high",
      priorityLabel: "Action Needed",
    },
  },
  loyal: {
    id: "HS-003",
    severity: "alert",
    category: "customer-experience",
    title: "Guard Loyal refund SLA",
    detailsBase: {
      rootCauseLead:
        "Loyal holds high GMV with low churn — a single refund SLA miss turns advocates into silence.",
      affectedAreas: ["Loyal segment", "Refund SLA", "Plus desk"],
      recommendedActions: [
        "White-glove refund handling for Loyal this week",
        "No exceptions on delayed credit or pickup",
      ],
      timeToResolve: "This week",
      assignedTo: "CX Ops · Plus",
      priority: "high",
      priorityLabel: "Action Needed",
    },
  },
  seasonal: {
    id: "HS-004",
    severity: "warning",
    category: "operational",
    title: "Prep Seasonal capacity",
    detailsBase: {
      rootCauseLead: "Seasonal spikes around festival windows — unprepared capacity breaks FCR.",
      affectedAreas: ["Seasonal segment", "Capacity", "Refunds"],
      recommendedActions: [
        "Prep capacity before the next sale",
        "Scripted refund paths for first-touch resolve",
      ],
      timeToResolve: "Before next sale",
      assignedTo: "CX Ops",
      priority: "medium",
    },
  },
  frequent: {
    id: "HS-005",
    severity: "warning",
    category: "operational",
    title: "Delivery ETA drives CPU",
    detailsBase: {
      rootCauseLead:
        "Delivery ETA slips on Frequent reorder paths force second contacts and soften sentiment.",
      affectedAreas: ["Delivery ETA", "Frequent buyer", "Active"],
      recommendedActions: [
        "Audit ETA promise accuracy by hub this week",
        "Script first-pass resolve playbook for ETA misses",
        "Alert when CPU on Frequent exceeds 1.8",
      ],
      timeToResolve: "7 days",
      assignedTo: "Logistics · CX Ops",
      priority: "high",
    },
  },
  dormant: {
    id: "HS-006",
    severity: "info",
    category: "operational",
    title: "Dormant churn is noise",
    detailsBase: {
      rootCauseLead:
        "High churn % on a small low-GMV slice — commercial exposure is low versus Active and Occasional.",
      affectedAreas: ["Dormant segment", "Win-back"],
      recommendedActions: [
        "Use light-touch win-back only",
        "Keep voice and chat capacity on Active and Occasional until those queues clear",
      ],
      timeToResolve: "Ongoing monitor",
      assignedTo: "CRM · CX Ops",
      priority: "low",
      priorityLabel: "Monitor",
    },
  },
  reactivated: {
    id: "HS-007",
    severity: "info",
    category: "customer-experience",
    title: "Lock Reactivated wins",
    detailsBase: {
      rootCauseLead: "Fast-growing cohort — first-week friction after return pushes them dormant again.",
      affectedAreas: ["Reactivated segment", "Nurture"],
      recommendedActions: [
        "Post-purchase nurture within 7 days of return",
        "Block first-week friction on ETA and refund status",
      ],
      timeToResolve: "7 days",
      assignedTo: "CRM · CX Ops",
      priority: "medium",
    },
  },
};

function sharePct(row: HappinessSegmentRow, total: number): number {
  if (total <= 0) return 0;
  return Math.round((row.interactions / total) * 1000) / 10;
}

function shortLabel(row: HappinessSegmentRow): string {
  return row.label.replace(/ customer| buyer/i, "").trim();
}

function buildMessage(row: HappinessSegmentRow, total: number): string {
  const share = sharePct(row, total);
  const rev = formatCr(segmentRevenueAtRiskCr(row));
  const gmv = formatCr(row.gmvAtRiskCr);
  const aov = formatAovAtvCr(row.aov);
  const atv = formatAovAtvCr(row.atv);
  const delta = row.wowDelta;
  const deltaStr = `${delta > 0 ? "+" : ""}${delta}%`;

  switch (row.key) {
    case "active":
      return `${shortLabel(row)} is ${share}% of contacts (CPU ${row.cpu}, CSAT ${row.csat}%, FCR ${row.fcr}%) — largest ₹ at risk (${rev} Cr = ${gmv} Cr GMV × ${row.churn}% churn). Delivery ETA first-pass misses are flooding the queue.`;
    case "occasional":
      return `${shortLabel(row)} is next on ₹ at risk (${rev} Cr) with soft FCR ${row.fcr}% and CSAT ${row.csat}% — refund/return stalls kill the next-order window while AOV ${aov} Cr / ATV ${atv} Cr stay intact.`;
    case "loyal":
      return `${shortLabel(row)} holds ${gmv} Cr GMV with churn only ${row.churn}% → ${rev} Cr at risk. CSAT ${row.csat}% / FCR ${row.fcr}% / CPU ${row.cpu} — white-glove refund SLA or advocates go silent.`;
    case "seasonal":
      return `${shortLabel(row)} is ${share}% of contacts (${deltaStr}) — FCR ${row.fcr}% and CSAT ${row.csat}% will break on festival load unless capacity is prepped. GMV ${gmv} Cr → ${rev} Cr at risk.`;
    case "frequent":
      return `${shortLabel(row)} CPU ${row.cpu} (${share}% of contacts) — ETA misses drive repeat contacts. CSAT ${row.csat}% · FCR ${row.fcr}% · AOV ${aov} Cr · ${rev} Cr at risk.`;
    case "dormant":
      return `${row.churn}% churn looks loud but only ${share}% of contacts at ${gmv} Cr GMV → ${rev} Cr at risk. CSAT ${row.csat}% / FCR ${row.fcr}% — keep voice/chat on Active & Occasional, not win-back here.`;
    case "reactivated":
      return `${shortLabel(row)} growing fast (${deltaStr}, ${share}% of contacts) — AOV ${aov} Cr / ATV ${atv} Cr with ${rev} Cr at risk. Lock the win before first-week friction undoes it.`;
    default: {
      const _exhaustive: never = row.key;
      void _exhaustive;
      return "";
    }
  }
}

function buildDetails(row: HappinessSegmentRow, total: number): FCIInsightDetails {
  const shell = INSIGHT_SHELL[row.key];
  const share = sharePct(row, total);
  const rev = formatCr(segmentRevenueAtRiskCr(row));
  const gmv = formatCr(row.gmvAtRiskCr);
  return {
    ...shell.detailsBase,
    rootCause: `${shell.detailsBase.rootCauseLead} Table read: ${share}% of contacts · CSAT ${row.csat}% · FCR ${row.fcr}% · CPU ${row.cpu} · AOV ${formatAovAtvCr(row.aov)} Cr · ATV ${formatAovAtvCr(row.atv)} Cr · GMV ${gmv} Cr × churn ${row.churn}% = ${rev} Cr at risk.`,
    estimatedImpact: `${rev} Cr revenue at risk · ${row.interactions.toLocaleString("en-IN")} contacts (${share}% share)`,
  };
}

function impactLabel(
  severity: FCIInsight["severity"],
): "Critical" | "High" | "Medium" | "Low" {
  switch (severity) {
    case "critical":
      return "Critical";
    case "alert":
      return "High";
    case "warning":
      return "Medium";
    case "info":
      return "Low";
    default: {
      const _exhaustive: never = severity;
      return _exhaustive;
    }
  }
}

/**
 * AI Summary Wall cards — one per segment table row, same order (₹ at risk desc),
 * same period figures for share / CSAT / FCR / CPU / AOV / ATV / GMV / rev at risk.
 */
export function getHappinessSegmentInsights(period: HappinessPeriodKey = "7D"): {
  insights: FCIInsight[];
  details: Record<string, FCIInsightDetails>;
} {
  const rows = segmentsRankedByRevenueAtRisk(getHappinessSegmentRows(period));
  const total = rows.reduce((s, r) => s + r.interactions, 0);

  const insights: FCIInsight[] = [];
  const details: Record<string, FCIInsightDetails> = {};

  for (const row of rows) {
    const shell = INSIGHT_SHELL[row.key];
    const share = sharePct(row, total);
    const wow = Math.round(Math.abs(row.wowDelta) * 10) / 10;
    const trend: NonNullable<FCIInsight["trend"]> =
      Math.abs(row.wowDelta) < 0.05 ? "stable" : row.wowDelta > 0 ? "up" : "down";

    insights.push({
      id: shell.id,
      severity: shell.severity,
      category: shell.category,
      title: shell.title,
      message: buildMessage(row, total),
      trend,
      change: wow,
      metrics: {
        volume: row.interactions,
        volumeLabel: `${shortLabel(row)} · ${share}% · ${formatCr(segmentRevenueAtRiskCr(row))} Cr risk`,
        customerImpact: impactLabel(shell.severity),
      },
    });
    details[shell.id] = buildDetails(row, total);
  }

  return { insights, details };
}

/** @deprecated Prefer getHappinessSegmentInsights(period) */
export const HAPPINESS_SEGMENT_INSIGHTS: FCIInsight[] = getHappinessSegmentInsights("7D").insights;

/** @deprecated Prefer getHappinessSegmentInsights(period) */
export const HAPPINESS_SEGMENT_INSIGHT_DETAILS: Record<string, FCIInsightDetails> =
  getHappinessSegmentInsights("7D").details;
