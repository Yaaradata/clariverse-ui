/**
 * Period-aware overview snapshots — Last 7 / 30 / 90 days.
 * Base figures stay consistent with SPEC; longer windows show more history and softer deltas.
 */

import type { DateRangeId } from "@kgs2/types";
import base from "../data/overview.json";

type OverviewSnapshot = typeof base;

function cloneBase(): OverviewSnapshot {
  return JSON.parse(JSON.stringify(base)) as OverviewSnapshot;
}

function overview7d(): OverviewSnapshot {
  const o = cloneBase();
  o.readStrip =
    "LiSN read 386 partner and installer interactions in the last 7 days, about 77 a working day, across email, help desk, service calls and Salesforce.";
  return o;
}

function overview30d(): OverviewSnapshot {
  const o = cloneBase();
  o.readStrip =
    "LiSN read 1,540 partner and installer interactions in the last 30 days, about 73 a working day. North promise kept still the outlier.";
  o.brief =
    "Over 30 days, {{region:North}} promise kept slipped to 74% from 86%; licence re-activation returned twice; network set-up friction stayed the top install mention.";
  o.pulse = [
    {
      key: "critical",
      title: "What's critical",
      body: "{{region:North}}: promise kept 74% over 30 days (was 86%). 4 distributors, 62 order lines, 2 fire-NOC projects still open.",
    },
    {
      key: "focus",
      title: "Where's your focus",
      body: "Licence re-activation returned twice in 30 days — 38 contacts since the June fix. Device addressing added 19 more.",
    },
    {
      key: "stable",
      title: "What's stable",
      body: "Programming praise held at 41 mentions over 30 days. {{region:South}} and {{region:West}} promise kept stayed above 90%.",
    },
  ];
  o.questionCards = [
    {
      id: "promise",
      title: "Are we keeping our promises?",
      subtitle: "Delivery · last-mile · promise dates",
      count: 3,
      countLabel: "signals above threshold",
      delta: 1,
      deltaLabel: "+1 vs prior 30d",
      border: "orange",
      gauges: [
        { label: "Promise kept", pct: 78 },
        { label: "Same-day replies", pct: 61 },
      ],
      miniKpis: [
        {
          label: "Biggest gap",
          value: "{{region:North}} · 4 distributors",
        },
        {
          label: "Last-mile share",
          value: "~27% (candidate)",
        },
      ],
      insight:
        "{{region:North}} misses still cluster on one allocation queue across the month.",
      trend13: [88, 87, 86, 85, 84, 83, 82, 80, 79, 77, 76, 75, 78],
    },
    {
      id: "recurring",
      title: "What keeps coming back?",
      subtitle: "Licence · addressing · order desk",
      count: 4,
      countLabel: "themes back after a fix",
      delta: 1,
      deltaLabel: "+1 vs prior 30d",
      border: "teal",
      gauges: [
        { label: "Fix on record", pct: 54 },
        { label: "Repeat contacts", pct: 26 },
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
      insight:
        "Four themes re-opened in 30 days. Licence and addressing drove most of the volume.",
      trend13: [16, 17, 18, 19, 18, 20, 22, 24, 26, 28, 30, 33, 36],
    },
    {
      id: "install",
      title: "What do installers experience?",
      subtitle: "Network · programming · partner voice",
      count: 2,
      countLabel: "signals above threshold",
      delta: 0,
      deltaLabel: "0 vs prior 30d",
      border: "sky",
      gauges: [
        { label: "Friction share", pct: 63 },
        { label: "Partner feedback", pct: 20 },
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
        "Network set-up stayed the top friction step for the full 30 days; praise on programming held.",
      trend13: [6, 7, 8, 9, 10, 11, 12, 13, 14, 16, 17, 19, 21],
    },
  ];
  // Soften / extend signal metrics for the month
  for (const s of o.signals) {
    if (s.id === "PR-01") {
      s.metrics = [
        { label: "Promise kept", value: "86% → 74%", delta: "−12 pts" },
        { label: "Order lines affected", value: "62" },
        { label: "Projects at inspection risk", value: "2" },
      ];
      s.time = "Last 30 days";
      s.recommendation =
        "Operations lead: confirm dates for the 2 fire-NOC projects; re-check allocation for 4 {{region:North}} distributors.";
    } else if (s.id === "PR-02") {
      s.metrics = [
        { label: "Hub-to-site days", value: "2.3 → 4.8", delta: "×2.1" },
        { label: "Distributors", value: "2" },
        { label: "Lines", value: "18" },
      ];
      s.time = "Last 30 days";
    } else if (s.id === "RC-01") {
      s.metrics = [
        { label: "Contacts / week", value: "avg 9", delta: "38 in 30d" },
        { label: "Partners", value: "9" },
        { label: "Days since fix", value: "105" },
      ];
      s.time = "Last 30 days";
    } else if (s.id === "RC-02") {
      s.metrics = [
        { label: "Contacts / week", value: "avg 5", delta: "19 in 30d" },
        { label: "Partners", value: "6" },
        { label: "Since training fade", value: "5 Sep" },
      ];
      s.time = "Last 30 days";
    } else if (s.id === "PR-04") {
      s.metrics = [
        {
          label: "Promise kept",
          value: "88% → 91%",
          delta: "+3 pts",
          deltaTone: "opportunity",
        },
        { label: "Late-order queries", value: "Down" },
        { label: "Regions holding", value: "{{region:SEA}}" },
      ];
      s.time = "Last 30 days";
    } else if (s.id === "IN-02") {
      s.metrics = [
        {
          label: "Praise mentions",
          value: "41",
          delta: "last 30 days",
          deltaTone: "opportunity",
        },
        { label: "Friction : praise", value: "63 : 37" },
        { label: "Top praise step", value: "Programming" },
      ];
      s.time = "Last 30 days";
    } else {
      s.time = "Last 30 days";
    }
  }
  return o;
}

function overview90d(): OverviewSnapshot {
  const o = cloneBase();
  o.readStrip =
    "LiSN read 4,940 partner and installer interactions across the last 90 days (~13 weeks). Same sources: email, help desk, service calls, Salesforce.";
  o.brief =
    "Quarter view: {{region:North}} promise kept recovered slightly after week 10 but remains below peer regions; three recurring themes never fully closed; install friction on network set-up is structural.";
  o.pulse = [
    {
      key: "critical",
      title: "What's critical",
      body: "{{region:North}} promise kept averaged 79% over 90 days (peers 90%+). 5 distributors touched; 2 fire-NOC projects carried the whole quarter.",
    },
    {
      key: "focus",
      title: "Where's your focus",
      body: "Three themes back after a fix across the quarter — licence, addressing, order-desk misroute. 112 contacts on licence alone.",
    },
    {
      key: "stable",
      title: "What's stable",
      body: "{{region:SEA}} promise kept finished at 92%. Programming praise: 74 mentions in 90 days. Capture from partners still thin at ~18%.",
    },
  ];
  o.questionCards = [
    {
      id: "promise",
      title: "Are we keeping our promises?",
      subtitle: "Delivery · last-mile · promise dates",
      count: 4,
      countLabel: "signals above threshold",
      delta: 2,
      deltaLabel: "+2 vs prior 90d",
      border: "orange",
      gauges: [
        { label: "Promise kept", pct: 81 },
        { label: "Same-day replies", pct: 58 },
      ],
      miniKpis: [
        {
          label: "Biggest gap",
          value: "{{region:North}} · 5 distributors",
        },
        {
          label: "Last-mile share",
          value: "~29% (candidate)",
        },
      ],
      insight:
        "Quarter pattern: {{region:North}} allocation queue, not supply. Peer regions held above 90%.",
      trend13: [91, 90, 89, 88, 87, 86, 85, 83, 81, 78, 76, 74, 81],
    },
    {
      id: "recurring",
      title: "What keeps coming back?",
      subtitle: "Licence · addressing · order desk",
      count: 5,
      countLabel: "themes back after a fix",
      delta: 2,
      deltaLabel: "+2 vs prior 90d",
      border: "teal",
      gauges: [
        { label: "Fix on record", pct: 49 },
        { label: "Repeat contacts", pct: 28 },
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
      insight:
        "Five themes re-opened in 90 days. Fixes hold for weeks, then contacts climb again.",
      trend13: [12, 14, 15, 16, 18, 17, 19, 22, 25, 28, 32, 36, 41],
    },
    {
      id: "install",
      title: "What do installers experience?",
      subtitle: "Network · programming · partner voice",
      count: 3,
      countLabel: "signals above threshold",
      delta: 1,
      deltaLabel: "+1 vs prior 90d",
      border: "sky",
      gauges: [
        { label: "Friction share", pct: 61 },
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
        "Network set-up friction is structural across the quarter; programming praise is the counterweight.",
      trend13: [8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 21],
    },
  ];
  for (const s of o.signals) {
    s.time =
      s.id === "IN-02"
        ? "This quarter"
        : s.id === "PR-04"
          ? "Last 13 weeks"
          : "Last 90 days";
    if (s.id === "PR-01") {
      s.metrics = [
        { label: "Promise kept", value: "88% → 71%", delta: "−17 pts trough" },
        { label: "Order lines affected", value: "96" },
        { label: "Projects at inspection risk", value: "2" },
      ];
      s.recommendation =
        "Operations lead: close the quarter with confirmed dates for the 2 NOC projects; keep {{region:North}} allocation on a weekly watch.";
    } else if (s.id === "RC-01") {
      s.metrics = [
        { label: "Contacts / week", value: "peak 11", delta: "112 in 90d" },
        { label: "Partners", value: "11" },
        { label: "Days since fix", value: "105" },
      ];
    } else if (s.id === "IN-02") {
      s.metrics = [
        {
          label: "Praise mentions",
          value: "74",
          delta: "this quarter",
          deltaTone: "opportunity",
        },
        { label: "Friction : praise", value: "61 : 39" },
        { label: "Top praise step", value: "Programming" },
      ];
    } else if (s.id === "PR-04") {
      s.metrics = [
        {
          label: "Promise kept",
          value: "86% → 92%",
          delta: "+6 pts",
          deltaTone: "opportunity",
        },
        { label: "Late-order queries", value: "Down" },
        { label: "Regions holding", value: "{{region:SEA}}" },
      ];
    }
  }
  return o;
}

const CACHE: Record<DateRangeId, OverviewSnapshot> = {
  "7d": overview7d(),
  "30d": overview30d(),
  "90d": overview90d(),
};

export function overviewForRange(range: DateRangeId): OverviewSnapshot {
  return CACHE[range];
}

export function signalsHeading(range: DateRangeId): string {
  switch (range) {
    case "7d":
      return "This week's signals";
    case "30d":
      return "Last 30 days' signals";
    case "90d":
      return "Last 90 days' signals";
    default: {
      const _exhaustive: never = range;
      return _exhaustive;
    }
  }
}

export function trendFooterLabel(range: DateRangeId): string {
  switch (range) {
    case "7d":
      return "13 wks";
    case "30d":
      return "13 wks";
    case "90d":
      return "13 wks";
    default: {
      const _exhaustive: never = range;
      return _exhaustive;
    }
  }
}

/** Slice or reshape a weekly series for the active range (charts stay readable). */
export function seriesForRange(values: number[], range: DateRangeId): number[] {
  if (!values.length) return values;
  if (range === "7d") {
    // Emphasise the recent movement: last 7 points of the weekly series.
    return values.length <= 7 ? values : values.slice(-7);
  }
  if (range === "30d") {
    return values.length <= 10 ? values : values.slice(-10);
  }
  return values;
}
