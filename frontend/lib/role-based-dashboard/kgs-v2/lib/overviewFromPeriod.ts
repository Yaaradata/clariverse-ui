/**
 * Overview snapshot for the active period — all figures from series.json via period.ts.
 */

import overviewJson from "../data/overview.json";
import { recurringForPeriod } from "./drillFromPeriod";
import type { PeriodId } from "./period";
import {
  avgP,
  chartCaption,
  chartPoints,
  lastP,
  prevAvgP,
  prevSumP,
  returningThemeContacts,
  round0,
  round1,
  series,
  signalsHeading,
  sumP,
  timeLabel,
  vsLabelShort,
} from "./period";

export type OverviewPulse = {
  key: string;
  title: string;
  body: string;
};

export type OverviewQuestion = {
  id: "promise" | "recurring" | "install";
  title: string;
  subtitle: string;
  count: number;
  countLabel: string;
  delta: number;
  deltaLabel: string;
  border: "orange" | "teal" | "sky";
  gauges: Array<{ label: string; pct: number }>;
  miniKpis: Array<{ label: string; value: string }>;
  insight: string;
  trend: number[];
  trendEndLabel: string;
  chartCaption: string;
  chartKind: "count" | "pct";
};

export type OverviewSignalMetric = {
  label: string;
  value: string;
  delta?: string;
  sub?: string;
  deltaTone?: "risk" | "opportunity";
};

export type OverviewSignalView = {
  id: string;
  title: string;
  severity: string;
  shape: "slope" | "cliff" | null;
  channel: string;
  topIssue: string;
  time: string;
  confidence: string;
  metrics: [OverviewSignalMetric, OverviewSignalMetric, OverviewSignalMetric];
  recommendation: string;
  owner: string;
  pnlTag: string;
  route: string;
  hero?: boolean;
};

export type OverviewSnapshot = {
  period: PeriodId;
  signalsTitle: string;
  chartCaption: string;
  readStrip: string;
  pulse: OverviewPulse[];
  questionCards: OverviewQuestion[];
  signals: OverviewSignalView[];
};

const PULSE = (
  overviewJson as {
    pulseByPeriod: Record<PeriodId, OverviewPulse[]>;
  }
).pulseByPeriod;

function deltaLabel(delta: number, period: PeriodId): string {
  const vs = vsLabelShort(period);
  if (delta === 0) return `No change ${vs}`;
  const sign = delta > 0 ? "+" : "";
  return `${sign}${delta} ${vs}`;
}

function fmtX(n: number): string {
  return `×${round1(n).toFixed(1)}`;
}

function questionCards(period: PeriodId): OverviewQuestion[] {
  const cap = chartCaption(period);
  const returning = returningThemeContacts();

  const keptAll = round0(avgP(series.promiseKeptAll, period));
  const sameDay = round0(avgP(series.sameDayReply, period));
  const lastMile = round0(avgP(series.lastMileShare, period));
  const repeat = round0(avgP(series.repeatContacts, period));

  const fric = sumP(series.installFriction, period);
  const praise = sumP(series.installPraise, period);
  const frictionShare = round0((fric / (fric + praise || 1)) * 100);

  // Open signals grow slightly with a longer window (more themes cross threshold).
  const promiseCount = period === "7d" ? 2 : 3;
  // Same figures as the Recurring drill (KPI tiles, register, timeline).
  const recurringDrill = recurringForPeriod(period);
  const recurringCount = recurringDrill.backAfterFix;
  const fixWord =
    ["No", "One", "Two", "Three", "Four", "Five", "Six"][recurringCount] ??
    String(recurringCount);
  // Matches the Install drill's Signal Wall: 1 → 2 → 3 friction signals.
  const installCount = period === "7d" ? 1 : period === "30d" ? 2 : 3;

  const promiseDelta = period === "7d" ? 1 : 2;
  const recurringDelta =
    period === "7d" ? 1 : period === "30d" ? 2 : 3;
  const installDelta = period === "7d" ? 0 : 1;

  return [
    {
      id: "promise",
      title: "Are we keeping our promises?",
      subtitle: "Delivery · last-mile · promise dates",
      count: promiseCount,
      countLabel: "signals above threshold",
      delta: promiseDelta,
      deltaLabel: deltaLabel(promiseDelta, period),
      border: "orange",
      gauges: [
        { label: "Promise kept", pct: keptAll },
        { label: "Same-day replies", pct: sameDay },
      ],
      miniKpis: [
        {
          label: "Biggest gap",
          value: "{{region:North}} · 3 distributors",
        },
        {
          label: "Last-mile share",
          value: `~${lastMile}% (candidate)`,
        },
      ],
      insight:
        "Most {{region:North}} misses trace to one allocation queue, not supply.",
      trend: chartPoints(series.promiseKeptAll, period, "pct"),
      trendEndLabel: `${lastP(series.promiseKeptAll)}%`,
      chartCaption: cap,
      chartKind: "pct",
    },
    {
      id: "recurring",
      title: "What keeps coming back?",
      subtitle: "Licence · addressing · order desk",
      count: recurringCount,
      countLabel: "themes back after a fix",
      delta: recurringDelta,
      deltaLabel: deltaLabel(recurringDelta, period),
      border: "teal",
      gauges: [
        { label: "Fix on record", pct: recurringDrill.fixPct },
        { label: "Repeat contacts", pct: repeat },
      ],
      miniKpis: [
        {
          label: "Top returning theme",
          value: "Licence re-activation",
        },
        {
          label: "Days since last fix",
          value: "105",
        },
      ],
      insight: `${fixWord} fixes did not hold. Each is linked to what was done last time.`,
      trend: chartPoints(returning, period, "count"),
      trendEndLabel: `${lastP(returning)} / wk`,
      chartCaption: cap,
      chartKind: "count",
    },
    {
      id: "install",
      title: "What do installers experience?",
      subtitle: "Network · programming · partner voice",
      count: installCount,
      countLabel: "signals above threshold",
      delta: installDelta,
      deltaLabel: deltaLabel(installDelta, period),
      border: "sky",
      gauges: [
        { label: "Friction share", pct: frictionShare },
        { label: "Partner feedback", pct: 18 },
      ],
      miniKpis: [
        {
          label: "Top friction step",
          value: "Network configuration",
        },
        {
          label: "Top praise",
          value: "Ease of programming",
        },
      ],
      insight:
        "Installers describe ~25 extra minutes on network set-up; most first-line feedback sits with partners.",
      trend: chartPoints(series.installFriction, period, "count"),
      trendEndLabel: `${lastP(series.installFriction)} / wk`,
      chartCaption: cap,
      chartKind: "count",
    },
  ];
}

function metricRow(
  label: string,
  value: string,
  delta?: string,
  deltaTone?: "risk" | "opportunity",
  sub?: string,
): OverviewSignalMetric {
  return { label, value, delta, deltaTone, sub };
}

/** Signal cards for the period. The drills read their figures from here. */
export function overviewSignals(period: PeriodId): OverviewSignalView[] {
  const t = timeLabel(period);
  const northLines = sumP(series.northLinesAffected, period);
  const northKept = round0(avgP(series.promiseKeptNorth, period));
  const northPts = 88 - northKept;

  const gDays = round1(avgP(series.gurugramHubToSiteDays, period));
  const gLines = sumP(series.gurugramLines, period);
  const gMult = round1(gDays / 2.1);

  const licAvg = round1(avgP(series.licenceContacts, period));
  const licMult = round1(licAvg / 2);
  const licPartners = period === "7d" ? 7 : period === "30d" ? 9 : 12;

  const addrAvg = round1(avgP(series.deviceAddrContacts, period));
  const addrMult = round1(addrAvg / 2);
  const addrPartners = period === "7d" ? 4 : period === "30d" ? 5 : 8;

  const netMentions = sumP(series.networkFriction, period);
  const netInstallers = period === "7d" ? 2 : period === "30d" ? 5 : 9;

  const legacy = sumP(series.legacyPanelContacts, period);
  const legacyPartners = period === "7d" ? 3 : period === "30d" ? 4 : 6;

  const orderAvg = round1(avgP(series.orderStatusContacts, period));
  const orderMult = round1(orderAvg / 4);
  const orderPartners = period === "7d" ? 6 : period === "30d" ? 9 : 11;

  const twoDates = sumP(series.twoDatesContacts, period);
  const twoOrders = period === "7d" ? 4 : period === "30d" ? 9 : 13;
  const twoDist = period === "7d" ? 3 : period === "30d" ? 5 : 6;

  const pipeNow = sumP(series.pipelineRiskOpps, period);
  const pipePrev =
    period === "90d"
      ? series.prev90.pipelineRiskOpps
      : (prevSumP(series.pipelineRiskOpps, period) ?? 0);

  const seaNow = round0(avgP(series.promiseKeptSEA, period));
  const seaPrev =
    period === "90d"
      ? series.prev90.promiseKeptSEA
      : period === "7d"
        ? series.promiseKeptSEA[11]
        : round0(prevAvgP(series.promiseKeptSEA, period) ?? seaNow);

  // SEA delivery complaints (region slice — not the all-region series)
  const seaDeliveryComplaints = period === "7d" ? 2 : period === "30d" ? 9 : 31;

  const praiseNow = sumP(series.programmingPraise, period);
  const praisePrev =
    period === "90d"
      ? series.prev90.programmingPraise
      : (prevSumP(series.programmingPraise, period) ?? 0);
  const praisePartners = period === "7d" ? 1 : period === "30d" ? 4 : 9;

  return [
    {
      id: "PR-01",
      title: "{{region:North}} promises slipping",
      severity: "S2",
      shape: "slope",
      channel: "email · calls +2",
      topIssue: "Date moved after confirm",
      time: t,
      confidence: "M 0.68",
      metrics: [
        metricRow(
          "Promise kept",
          `88% → ${northKept}%`,
          `−${northPts} pts`,
          "risk",
        ),
        metricRow("Order lines affected", String(northLines)),
        metricRow("Projects at inspection risk", "2"),
      ],
      recommendation:
        "Operations lead: confirm dates for the 2 projects with fire NOC inspections; one confirmed date per distributor.",
      owner: "Operations lead",
      pnlTag: "On-time delivery · partner loyalty",
      route: "promiseHero",
      hero: true,
    },
    {
      id: "PR-02",
      title: "{{place:Gurugram}} last-mile delays",
      severity: "S3",
      shape: "slope",
      channel: "email · calls +1",
      topIssue: "Slow hub-to-site delivery",
      time: t,
      confidence: "M 0.55",
      metrics: [
        metricRow(
          "Hub-to-site days",
          `2.1 → ${gDays.toFixed(1)}`,
          fmtX(gMult),
          "risk",
        ),
        metricRow("Distributors", "1"),
        metricRow("Lines", String(gLines)),
      ],
      recommendation:
        "Operations lead: open a last-mile review for the {{place:Gurugram}} carrier.",
      owner: "Operations lead",
      pnlTag: "On-time delivery",
      route: "promise",
    },
    {
      id: "RC-01",
      title: "Licence re-activation is back",
      severity: "S3",
      shape: "cliff",
      channel: "help desk · email +1",
      topIssue: "Licence reset on new laptop",
      time: t,
      confidence: "H 0.81",
      metrics: [
        metricRow(
          "Contacts / week",
          `2 → ${licAvg % 1 === 0 ? String(licAvg) : licAvg.toFixed(1)}`,
          fmtX(licMult),
          "risk",
        ),
        metricRow("Partners", String(licPartners)),
        metricRow("Days since fix", "105"),
      ],
      recommendation:
        "Technical support lead: update the knowledge article and confirm the portal change with the US product team.",
      owner: "Technical support lead",
      pnlTag: "Cost-to-serve",
      route: "recurringTheme",
    },
    {
      id: "RC-02",
      title: "Device addressing is back",
      severity: "S3",
      shape: "slope",
      channel: "calls · help desk",
      topIssue: "After a panel swap",
      time: "Since 5 Sep",
      confidence: "M 0.64",
      metrics: [
        metricRow(
          "Contacts / week",
          `2 → ${addrAvg % 1 === 0 ? String(addrAvg) : addrAvg.toFixed(1)}`,
          fmtX(addrMult),
          "risk",
        ),
        metricRow("Partners", String(addrPartners)),
        metricRow("Back since", "5 Sep"),
      ],
      recommendation:
        "Technical support lead: re-run the addressing training with partners who swapped panels.",
      owner: "Technical support lead",
      pnlTag: "Cost-to-serve",
      route: "recurring",
    },
    {
      id: "IN-01",
      title: "Network set-up is slower",
      severity: "S3",
      shape: "slope",
      channel: "calls · help desk",
      topIssue: "Network set-up time",
      time: t,
      confidence: "M 0.58",
      metrics: [
        metricRow("Mentions", String(netMentions)),
        metricRow("Stated extra time", "~25 min"),
        metricRow("Installers stating it", String(netInstallers)),
      ],
      recommendation:
        "Product liaison: share a one-page set-up guide with partners; send a feedback note to the US product team.",
      owner: "Product liaison",
      pnlTag: "Partner experience",
      route: "install",
    },
    {
      id: "RC-04",
      title: "Legacy panel upgrades",
      severity: "S3",
      shape: "slope",
      channel: "help desk · email",
      topIssue: "No upgrade guide",
      time: t,
      confidence: "M 0.60",
      metrics: [
        metricRow("Contacts", String(legacy)),
        metricRow("Partners", String(legacyPartners)),
        metricRow("Fix on record", "none"),
      ],
      recommendation:
        "Technical support lead: publish an upgrade path guide for legacy panels still in the field.",
      owner: "Technical support lead",
      pnlTag: "Partner experience",
      route: "recurring",
    },
    {
      id: "RC-03",
      title: "Order status on wrong desk",
      severity: "S4",
      shape: "slope",
      channel: "help desk · email",
      topIssue: "Where is my order?",
      time: t,
      confidence: "M 0.62",
      metrics: [
        metricRow(
          "Queries / week",
          `4 → ${orderAvg % 1 === 0 ? String(orderAvg) : orderAvg.toFixed(1)}`,
          fmtX(orderMult),
          "risk",
        ),
        metricRow("Partners", String(orderPartners)),
        metricRow("Auto-reply live since", "3 Jul"),
      ],
      recommendation:
        "Technical support lead: refresh the auto-reply with a clearer order-desk path.",
      owner: "Technical support lead",
      pnlTag: "Cost-to-serve",
      route: "recurring",
    },
    {
      id: "PR-03",
      title: "Two dates for one order",
      severity: "S4",
      shape: "slope",
      channel: "help desk · calls +1",
      topIssue: "Sales vs support dates",
      time: t,
      confidence: "M 0.52",
      metrics: [
        metricRow("Contacts", String(twoDates)),
        metricRow("Orders affected", String(twoOrders)),
        metricRow("Distributors", String(twoDist)),
      ],
      recommendation:
        "Operations lead: one confirmed date per order, shared by sales and support.",
      owner: "Operations lead",
      pnlTag: "On-time delivery",
      route: "promise",
    },
    {
      id: "SO-01",
      title: "Delivery worry in deals",
      severity: "S4",
      shape: "slope",
      channel: "Salesforce",
      topIssue: "Delivery risk in notes",
      time: t,
      confidence: "M 0.50",
      metrics: [
        metricRow(
          "Opportunities with delivery-risk notes",
          `${pipePrev} → ${pipeNow}`,
        ),
        metricRow("Mostly in", "{{region:North}}"),
        metricRow("Source", "Salesforce notes"),
      ],
      recommendation:
        "Sales ops: review {{region:North}} deals noting delivery risk with Operations.",
      owner: "Sales ops",
      pnlTag: "Partner loyalty",
      route: "promise",
    },
    {
      id: "PR-04",
      title: "{{region:SEA}} promise improving",
      severity: "improving",
      shape: null,
      channel: "email · calls",
      topIssue: "Fewer late-order queries",
      time: t,
      confidence: "H 0.78",
      metrics: [
        metricRow(
          "Promise kept",
          `${seaPrev}% → ${seaNow}%`,
          `+${seaNow - seaPrev} pts`,
          "opportunity",
        ),
        metricRow("Delivery complaints", String(seaDeliveryComplaints)),
        metricRow("Regions holding", "{{region:SEA}}"),
      ],
      recommendation:
        "No action needed — keep watching. {{region:SEA}} promise kept is holding.",
      owner: "Operations lead",
      pnlTag: "On-time delivery",
      route: "promise",
    },
    {
      id: "IN-02",
      title: "Programming praise holding",
      severity: "improving",
      shape: null,
      channel: "calls · Salesforce",
      topIssue: "Easiest panel to program",
      time: t,
      confidence: "H 0.80",
      metrics: [
        metricRow(
          "Praise mentions",
          `${praisePrev} → ${praiseNow}`,
          undefined,
          "opportunity",
        ),
        metricRow("Partners praising", String(praisePartners)),
        metricRow("Top praise step", "Programming"),
      ],
      recommendation:
        "Marketing: use the programming praise quote with partners in the next install brief.",
      owner: "Product liaison",
      pnlTag: "Partner experience",
      route: "install",
    },
  ];
}

function readStrip(period: PeriodId): string {
  const n = sumP(series.interactions, period);
  const days = period === "7d" ? 5 : period === "30d" ? 20 : 65;
  const perDay = round0(n / days);
  if (period === "7d") {
    return `LiSN read ${n.toLocaleString("en-GB")} partner and installer interactions in the last 7 days, about ${perDay} a working day, across email, help desk, service calls and Salesforce.`;
  }
  if (period === "30d") {
    return `LiSN read ${n.toLocaleString("en-GB")} partner and installer interactions in the last 30 days, about ${perDay} a working day.`;
  }
  return `LiSN read ${n.toLocaleString("en-GB")} partner and installer interactions across the last 90 days (~13 weeks), about ${perDay} a working day.`;
}

export function overviewForPeriod(period: PeriodId): OverviewSnapshot {
  return {
    period,
    signalsTitle: signalsHeading(period),
    chartCaption: chartCaption(period),
    readStrip: readStrip(period),
    pulse: PULSE[period],
    questionCards: questionCards(period),
    signals: overviewSignals(period),
  };
}
