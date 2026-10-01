/**
 * Drill-down data for the active period (Last 7 / 30 / 90 days).
 * Base figures come from promise / recurring / install JSON; the window figures are
 * derived from the weekly series in series.json via period.ts, the same way the
 * overview does it. Nothing here is a second data source.
 */

import install from "../data/install.json";
import promise from "../data/promise.json";
import recurring from "../data/recurring.json";
import signalPr01 from "../data/signal_pr01.json";
import { overviewSignals as overviewSignalsFor } from "./overviewFromPeriod";
import {
  avgP,
  lastP,
  type PeriodId,
  prevAvgP,
  prevSumP,
  round0,
  round1,
  series,
  splitByWeights,
  sumP,
  timeLabel,
  weekSlice,
} from "./period";

const WEEKS = 13;

function sum(values: number[]): number {
  return values.reduce((a, b) => a + b, 0);
}

function weeksIn(period: PeriodId): number {
  const { start, end } = weekSlice(period);
  return end - start + 1;
}

/** Share of a 13-week total that falls inside the window, from a weekly series. */
function share(values: number[], period: PeriodId): number {
  const total = sum(values);
  return total ? sumP(values, period) / total : 0;
}

/**
 * Signal Wall trend line for the window.
 * 7d: latest week vs the week before · 30d: window vs prior 30d · 90d: W13 vs W1.
 */
function trendText(
  values: number[],
  period: PeriodId,
  kind: "sum" | "avg",
  unit: string,
): string {
  let diff: number;
  let suffix: string;
  if (period === "7d") {
    diff = lastP(values) - (values[values.length - 2] ?? lastP(values));
    suffix = "vs prior week";
  } else if (period === "30d") {
    const now = kind === "avg" ? avgP(values, period) : sumP(values, period);
    const prev =
      (kind === "avg" ? prevAvgP(values, period) : prevSumP(values, period)) ??
      now;
    diff = now - prev;
    suffix = "vs prior 30 days";
  } else {
    diff = lastP(values) - (values[0] ?? 0);
    suffix = "over 13 weeks";
  }
  const points = unit === " pts";
  const n = points ? round0(Math.abs(diff)) : round1(Math.abs(diff));
  if (n === 0) return `— flat ${suffix}`;
  const u = points && n === 1 ? " pt" : unit;
  return `${diff > 0 ? "▲" : "▼"} ${n}${u} ${suffix}`;
}

export type DrillKpi = { key: string; label: string; value: string; sub?: string };

/* ───────────────────────────── Promise ───────────────────────────── */

export type PromiseWallCard = (typeof promise.signalWall)[number] & {
  /** Suggested action shown in the detail panel (from the overview signal). */
  action?: string;
};

export function promiseForPeriod(period: PeriodId) {
  const t = timeLabel(period);
  const base = Object.fromEntries(promise.kpis.map((k) => [k.key, k.value]));

  const keptAll = round0(avgP(series.promiseKeptAll, period));
  const keptRevised = Math.min(
    100,
    keptAll + (base.kept_revised - base.kept_original),
  );
  const slip = round1(
    (base.avg_slip * (100 - keptAll)) / (100 - base.kept_original || 1),
  );
  const ordersDue = round0((base.orders_due * weeksIn(period)) / WEEKS);
  const complaints = sumP(series.deliveryComplaints, period);

  const kpis: DrillKpi[] = [
    {
      key: "orders_due",
      label: "Orders due",
      value: ordersDue.toLocaleString("en-GB"),
      sub: t,
    },
    { key: "kept_original", label: "Kept vs original", value: `${keptAll}%` },
    { key: "kept_revised", label: "Kept vs revised", value: `${keptRevised}%` },
    { key: "avg_slip", label: "Average slip", value: `${slip} days` },
    {
      key: "complaints",
      label: "Delivery complaints",
      value: complaints.toLocaleString("en-GB"),
      sub: t,
    },
  ];

  // Distributor rows: kept % follows the region's weekly line for the window.
  const complaintScale =
    complaints / (sumP(series.deliveryComplaints, "30d") || 1);
  const regionShift = (regionId: string): number => {
    const s = promise.weeklyByRegion.series.find(
      (r) => r.regionId === regionId,
    );
    return s ? round0(avgP(s.values, period) - lastP(s.values)) : 0;
  };
  const distributors = promise.distributors.map((d) => {
    const kept = Math.min(
      100,
      d.keptVsOriginalPct + regionShift(d.regionId),
    );
    return {
      ...d,
      ordersDue: Math.max(1, round0((d.ordersDue * weeksIn(period)) / WEEKS)),
      keptVsOriginalPct: kept,
      averageSlipDays: round1(
        (d.averageSlipDays * (100 - kept)) / (100 - d.keptVsOriginalPct || 1),
      ),
      complaints: round0(d.complaints4w * complaintScale),
    };
  });

  // Candidate causes: base split is the 4-week view; scale by lines affected.
  const causeScale =
    sumP(series.northLinesAffected, period) /
    (sumP(series.northLinesAffected, "30d") || 1);
  // Last-mile share follows the same weekly series as the overview's
  // "Last-mile share" figure; the rest stays on the KGS side.
  const baseTotal = sum(
    promise.causeSplitByRegion.map(
      (r) => r.kgs.allocation + r.kgs.backorder + r.kgs.orderChange + r.lastMile,
    ),
  );
  const baseLastMileShare =
    sum(promise.causeSplitByRegion.map((r) => r.lastMile)) / (baseTotal || 1);
  const lastMileFactor =
    avgP(series.lastMileShare, period) / 100 / (baseLastMileShare || 1);
  const causeSplitByRegion = promise.causeSplitByRegion.map((r) => {
    const kgsWeights = [r.kgs.allocation, r.kgs.backorder, r.kgs.orderChange];
    const regionTotal = round0((sum(kgsWeights) + r.lastMile) * causeScale);
    const lastMile = Math.min(
      regionTotal,
      round0(
        ((regionTotal * r.lastMile) / (sum(kgsWeights) + r.lastMile || 1)) *
          lastMileFactor,
      ),
    );
    const [allocation, backorder, orderChange] = splitByWeights(
      regionTotal - lastMile,
      kgsWeights,
    );
    return { ...r, kgs: { allocation, backorder, orderChange }, lastMile };
  });

  // Signal Wall: same formulas as the overview signal cards.
  const northKept = round0(avgP(series.promiseKeptNorth, period));
  const northLines = sumP(series.northLinesAffected, period);
  const hubDays = round1(avgP(series.gurugramHubToSiteDays, period));
  const seaKept = round0(avgP(series.promiseKeptSEA, period));
  const overviewSignals = Object.fromEntries(
    overviewSignalsFor(period).map((s) => [s.id, s]),
  );
  const signalWall: PromiseWallCard[] = promise.signalWall.map((card) => {
    if (card.id === "PR-01") {
      return {
        ...card,
        body: `Three distributors, ${northLines} order lines, 2 projects facing fire NOC inspection.`,
        metric: `${northKept}% vs own 88%`,
        trend: trendText(series.promiseKeptNorth, period, "avg", " pts"),
      };
    }
    if (card.id === "PR-02") {
      return {
        ...card,
        body: `Hub-to-site days stretched after on-time hub arrival · ${sumP(series.gurugramLines, period)} lines.`,
        metric: `2.1 → ${hubDays.toFixed(1)} days`,
        trend: trendText(series.gurugramHubToSiteDays, period, "avg", " days"),
      };
    }
    if (card.id === "SEA-IMPROVING") {
      return {
        ...card,
        metric: `${seaKept}% kept`,
        trend: trendText(series.promiseKeptSEA, period, "avg", " pts"),
      };
    }
    return card;
  });
  // Longer windows bring one more signal over threshold (overview counts 2 → 3).
  const twoDates = overviewSignals["PR-03"];
  if (period !== "7d" && twoDates) {
    const improvingAt = signalWall.findIndex((c) => c.level === "improving");
    signalWall.splice(improvingAt < 0 ? signalWall.length : improvingAt, 0, {
      id: twoDates.id,
      title: twoDates.title,
      severity: twoDates.severity,
      level: "warning",
      hero: false,
      body: `Sales and support quote different dates: ${twoDates.metrics[1].value} orders across ${twoDates.metrics[2].value} distributors.`,
      metric: `${twoDates.metrics[0].value} contacts`,
      trend: trendText(series.twoDatesContacts, period, "sum", ""),
      cta: null,
      action: twoDates.recommendation,
    });
  }

  // What partners said vs what the orders show: partner contacts dated inside
  // the window, each joined to its first linked order line. Largest slip first.
  const asOf = new Date(`${series.asOf}T23:59:59Z`).getTime();
  const windowDays = period === "7d" ? 7 : period === "30d" ? 30 : 90;
  const from = asOf - windowDays * 24 * 60 * 60 * 1000;
  const year = series.asOf.slice(0, 4);
  const CAUSE: Record<string, string> = {
    allocation: "allocation",
    "last-mile": "last mile",
    "order-change": "order change",
  };
  const dayMonth = (iso: string) =>
    new Date(`${iso}T12:00:00Z`)
      .toLocaleDateString("en-GB", { day: "numeric", month: "short" })
      .replace("Sept", "Sep");
  const daysBetween = (a: string, b: string) =>
    Math.round(
      (new Date(`${b}T12:00:00Z`).getTime() -
        new Date(`${a}T12:00:00Z`).getTime()) /
        (24 * 60 * 60 * 1000),
    );
  const inWindow = signalPr01.snippets.flatMap((sn) => {
    const at = new Date(`${sn.localDateLabel} ${year} 12:00:00 UTC`).getTime();
    if (Number.isNaN(at) || at < from || at > asOf) return [];
    const line = signalPr01.orderLines.find((o) => o.contactIds.includes(sn.id));
    if (!line) return [];
    const slipDays = daysBetween(line.originalDate, line.revisedDate);
    return [
      {
        id: sn.id,
        featuredOrder: sn.featured ? (sn.featuredOrder ?? 99) : 99,
        partner: sn.partnerId,
        phrase: sn.text,
        date: sn.localDateLabel,
        slipDays,
        orderFacts: `Promised ${dayMonth(line.originalDate)} → now ${dayMonth(line.revisedDate)} · ${slipDays} days late · ${CAUSE[line.candidateCause] ?? line.candidateCause}`,
      },
    ];
  });
  // 7 / 30 days: the contacts with the largest slip in the window.
  // 90 days: the quarter's featured contacts (the ones the signal is built on).
  const quarter = period === "90d";
  const saidVsShows = [...inWindow]
    .sort((a, b) =>
      quarter
        ? a.featuredOrder - b.featuredOrder
        : b.slipDays - a.slipDays,
    )
    .slice(0, 4);

  return {
    timeLabel: t,
    kpis,
    distributors,
    causeSplitByRegion,
    signalWall,
    saidVsShows,
    saidVsShowsTotal: inWindow.length,
    saidVsShowsRule: quarter ? "featured this quarter" : "largest slip first",
  };
}

/* ──────────────────────────── Recurring ──────────────────────────── */

/** Recurring theme → the overview signal card that tracks it. */
const THEME_SIGNAL: Record<string, string> = {
  "rc-01": "RC-01",
  "rc-03": "RC-03",
  "rc-05": "RC-02",
  "rc-07": "RC-04",
};

/** Themes with their own weekly series; the rest follow overall volume. */
const THEME_SERIES: Record<string, number[]> = {
  "rc-01": series.licenceContacts,
  "rc-03": series.orderStatusContacts,
  "rc-05": series.deviceAddrContacts,
  "rc-07": series.legacyPanelContacts,
  "rc-09": series.networkConfigContacts,
  "rc-26": series.labelPrinterContacts,
  // Themes that came back earlier in the quarter carry their weekly series
  // on the timeline itself.
  ...Object.fromEntries(
    recurring.backAfterFixEarlier.flatMap((c) => {
      const drawn = recurring.timeline.series.find((s) => s.id === c.id);
      return drawn ? [[c.id, drawn.values] as const] : [];
    }),
  ),
};

export function recurringForPeriod(period: PeriodId) {
  const t = timeLabel(period);
  // Themes with their own weekly series get their exact window total; the rest
  // follow overall volume, and drop out of short windows when they had no contact.
  const contactsFor = (id: string, contacts13w: number): number => {
    const own = THEME_SERIES[id];
    return own
      ? round0(contacts13w * share(own, period))
      : Math.floor(contacts13w * share(series.interactions, period));
  };

  // Themes that came back after a fix earlier in the quarter count as
  // "back after fix" only in the windows that reach back to their return.
  const earlier = recurring.backAfterFixEarlier.filter((c) =>
    c.periods.includes(period),
  );
  const earlierIds = new Set(earlier.map((c) => c.id));

  // Partners for themes that also sit on the overview come from that signal
  // card, so the register and the overview always show the same number.
  const signalPartners = (themeId: string): number | undefined => {
    const signal = overviewSignalsFor(period).find(
      (s) => s.id === THEME_SIGNAL[themeId],
    );
    const value = signal?.metrics.find((m) => m.label === "Partners")?.value;
    return value === undefined ? undefined : Number(value);
  };

  const themes = recurring.themes
    .map((th) => {
      const contacts = contactsFor(th.id, th.contacts13w);
      return {
        ...th,
        status: earlierIds.has(th.id) ? "back-after-fix" : th.status,
        contacts13w: contacts,
        partners: signalPartners(th.id) ?? Math.min(th.partners, contacts),
      };
    })
    .filter((th) => th.contacts13w > 0);

  // Fix-on-record share moves with which themes are active in the window.
  const fixShare = (list: Array<{ status: string }>): number =>
    list.length
      ? list.filter((th) => th.status !== "no-fix").length / list.length
      : 0;
  const baseFixPct =
    recurring.kpis.find((k) => k.key === "with_fix")?.value ?? 0;
  const fixPct = round0(
    (baseFixPct * fixShare(themes)) / (fixShare(recurring.themes) || 1),
  );
  const backAfterFix = themes.filter(
    (th) => th.status === "back-after-fix",
  ).length;

  // Weekly contacts in the window vs the level right after the fix.
  const deltaOf = (weeklyDelta: string): number =>
    Number.parseFloat(weeklyDelta.replace("−", "-")) || 0;
  const backAfterFixWall = [
    ...recurring.backAfterFixWall.map((card) => {
      const own = THEME_SERIES[card.id];
      const after = recurring.themes.find((th) => th.id === card.id)?.fixes[0]
        ?.after;
      if (!own || after === undefined) return card;
      // Whole numbers, except a small rise keeps one decimal instead of "+0".
      const raw = avgP(own, period) - after;
      const delta = Math.abs(raw) >= 1 ? round0(raw) : round1(raw);
      return {
        ...card,
        weeklyDelta: `${delta >= 0 ? "+" : "−"}${Math.abs(delta)} vs post-fix`,
      };
    }),
    ...earlier.map(({ periods: _periods, ...card }) => card),
  ].sort((a, b) => deltaOf(b.weeklyDelta) - deltaOf(a.weeklyDelta));
  const contactsById = Object.fromEntries(
    themes.map((th) => [th.id, th.contacts13w]),
  );

  // Channel split for exactly the "Back after fix" themes of the window, in the
  // register's order — same set as the highlighted rows and the timeline.
  const backIds = themes
    .filter((th) => th.status === "back-after-fix")
    .sort((a, b) => b.contacts13w - a.contacts13w)
    .map((th) => th.id);
  const channelSplit = backIds.flatMap((id) => {
    const row = recurring.channelSplit.find((r) => r.id === id);
    if (!row) return [];
    const weights = [
      row.help_desk,
      row.email,
      row.service_calls,
      row.salesforce,
      row.partner_portal,
    ];
    const [help_desk, email, service_calls, salesforce, partner_portal] =
      splitByWeights(contactsById[row.id] ?? sum(weights), weights);
    return [
      {
        ...row,
        help_desk,
        email,
        service_calls,
        salesforce,
        partner_portal,
      },
    ];
  });

  const repeat = round0(avgP(series.repeatContacts, period));
  const kpis: DrillKpi[] = recurring.kpis.map((k) => {
    if (k.key === "repeat_contacts") {
      return {
        key: k.key,
        label: k.label,
        value: `${repeat}%`,
        sub: `of help-desk volume · ${t}`,
      };
    }
    if (k.key === "themes_quarter") {
      return {
        key: k.key,
        label: "Themes",
        value: String(themes.length),
        sub: t,
      };
    }
    if (k.key === "with_fix") {
      return { key: k.key, label: k.label, value: `${fixPct}%`, sub: t };
    }
    if (k.key === "back_after_fix") {
      return {
        key: k.key,
        label: k.label,
        value: String(backAfterFix),
        sub: t,
      };
    }
    return {
      key: k.key,
      label: k.label,
      value: k.unit === "%" ? `${k.value}%` : k.value.toLocaleString("en-GB"),
    };
  });

  // Theme timeline: exactly the "Back after fix" themes of the window — the same
  // rows the register highlights and the same count as the KPI tile.
  const timelineSeries = themes
    .filter((th) => th.status === "back-after-fix")
    .sort((a, b) => b.contacts13w - a.contacts13w)
    .flatMap((th) => {
      const drawn = recurring.timeline.series.find((s) => s.id === th.id);
      return drawn ? [{ ...drawn, windowContacts: th.contacts13w }] : [];
    });

  return {
    timeLabel: t,
    kpis,
    themes,
    channelSplit,
    backAfterFixWall,
    timelineSeries,
    fixPct,
    backAfterFix,
    repeat,
  };
}

/* ───────────────────────────── Install ───────────────────────────── */

export function installForPeriod(period: PeriodId) {
  const t = timeLabel(period);
  const frictionTotal = sumP(series.installFriction, period);
  const praiseTotal = sumP(series.installPraise, period);

  // Network friction and programming praise have their own weekly series (the
  // overview signal cards use them), so those two steps take the exact window
  // figure and the remaining mentions are spread over the other steps.
  const spread = (
    total: number,
    weights: number[],
    pinnedIndex: number,
    pinned: number,
  ): number[] => {
    const fixed = Math.min(total, pinned);
    const others = splitByWeights(
      total - fixed,
      weights.map((w, i) => (i === pinnedIndex ? 0 : w)),
    );
    return others.map((v, i) => (i === pinnedIndex ? fixed : v));
  };
  const networkIndex = install.steps.findIndex(
    (s) => s.step === "Network configuration",
  );
  const programmingIndex = install.steps.findIndex(
    (s) => s.step === "Panel programming",
  );
  const friction = spread(
    frictionTotal,
    install.steps.map((s) => s.friction),
    networkIndex,
    sumP(series.networkFriction, period),
  );
  const praise = spread(
    praiseTotal,
    install.steps.map((s) => s.praise),
    programmingIndex,
    sumP(series.programmingPraise, period),
  );
  const steps = install.steps.map((s, i) => ({
    ...s,
    friction: friction[i],
    praise: praise[i],
  }));

  // Family × region heat follows the friction total for the window.
  const heat = install.familyRegionHeat;
  const flat = heat.values.flat();
  const cols = heat.regions.length;
  const scaled = splitByWeights(
    round0((sum(flat) * frictionTotal) / (install.frictionTotal || 1)),
    flat,
  );
  const heatValues = heat.values.map((_, ri) =>
    scaled.slice(ri * cols, ri * cols + cols),
  );

  // "Mentions" here = installers who stated a time; same figure as the
  // overview's "Installers stating it".
  const stating = Number(
    overviewSignalsFor(period)
      .find((s) => s.id === "IN-01")
      ?.metrics.find((m) => m.label === "Installers stating it")?.value ?? 0,
  );
  const timeRows = install.timeInstallersMention.rows.map((row) => {
    const mentions = Math.max(1, stating || row.mentions);
    return { ...row, mentions, partners: Math.min(row.partners, mentions) };
  });

  // Praise topics read the same step figures as the chart.
  const TOPIC_STEP: Record<string, string> = {
    "Ease of programming": "Panel programming",
    "Wiring clarity": "Wiring & device addressing",
  };
  const praiseTopics = install.topics
    .filter((topic) => topic.tone === "PRAISE")
    .map((topic) => ({
      ...topic,
      mentions:
        steps.find((s) => s.step === TOPIC_STEP[topic.topic])?.praise ?? 0,
    }))
    .filter((topic) => topic.mentions > 0);

  const programmingPraise =
    steps.find((s) => s.step === "Panel programming")?.praise ?? 0;
  const networkFriction =
    steps.find((s) => s.step === "Network configuration")?.friction ?? 0;
  const signalWall = install.signalWall.map((card) => {
    if (card.id === "IN-01") {
      return {
        ...card,
        metric: `${networkFriction} mentions · ~25 min extra`,
        trend: trendText(series.networkFriction, period, "sum", ""),
      };
    }
    if (card.id === "IN-02") {
      return {
        ...card,
        metric: `${programmingPraise} praise ${programmingPraise === 1 ? "mention" : "mentions"}`,
      };
    }
    return card;
  });

  // Longer windows bring more friction topics over threshold. The topics, their
  // wording and growth come from install.json; mentions follow the step's
  // friction for the window, so the wall agrees with the chart beside it.
  const extraTopics: Array<{ topic: string; step: string }> = [];
  if (period !== "7d") {
    extraTopics.push({
      topic: "Device addressing after swap",
      step: "Wiring & device addressing",
    });
  }
  if (period === "90d") {
    extraTopics.push({
      topic: "Handover paperwork for fire NOC",
      step: "Testing & handover (fire NOC inspection)",
    });
  }
  for (const extra of extraTopics) {
    const topic = install.topics.find((x) => x.topic === extra.topic);
    const mentions = steps.find((s) => s.step === extra.step)?.friction ?? 0;
    if (!topic || mentions <= 0) continue;
    const improvingAt = signalWall.findIndex((c) => c.level === "improving");
    signalWall.splice(improvingAt < 0 ? signalWall.length : improvingAt, 0, {
      id: topic.topic,
      title: topic.topic,
      severity: "S4",
      level: "warning",
      type: "slope",
      owner: "Product liaison",
      body: topic.why,
      metric: `${mentions} mentions`,
      trend: `▲ ${topic.growthPct}% mentions`,
    });
  }

  return {
    timeLabel: t,
    steps,
    frictionTotal,
    praiseTotal,
    heatValues,
    timeRows,
    praiseTopics,
    signalWall,
  };
}
