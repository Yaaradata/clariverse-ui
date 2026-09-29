/**
 * Question-card AreaTrend series. Overview uses compact.trend (12 weeks) when present;
 * legacy multi-series sources remain for drawers / non-overview callers.
 */
import { channel, separation, signalFw41 } from "@kgs/lib/data";
import type { QuestionCardData } from "@kgs/types";
import { ACCENT, K } from "../shared/tokens";
import type { TrendMarker, TrendSeries } from "./AreaTrend";

export type TrendSpec = {
  data: Array<Record<string, number | null>>;
  series: TrendSeries[];
  markers: TrendMarker[];
};

type CompactWithTrend = { trend?: number[] };

const COMPACT_LABEL: Record<QuestionCardData["id"], string> = {
  "installed-base": "Fault contacts / 1k panel-weeks",
  channel: "{{partner:ESD-SE-07}} interactions / wk",
  separation: "{{region:US}} remit-to contacts / wk",
};

export function trendFor(
  card: QuestionCardData,
  L: (s: string) => string,
): TrendSpec {
  const compactTrend = (card.compact as CompactWithTrend | undefined)?.trend;
  if (compactTrend?.length) {
    return {
      data: compactTrend.map((v, i) => ({ x: i + 1, v })),
      series: [
        {
          key: "v",
          label: L(COMPACT_LABEL[card.id]),
          color: ACCENT[card.accent],
          area: true,
        },
      ],
      markers: [],
    };
  }

  if (card.trend.kind === "fw-lineage") {
    const [prior, next] = signalFw41.lineage.series;
    const byWeek = new Map(next.points.map((p) => [p.week, p.rate]));
    return {
      data: prior.points.map((p) => ({
        x: p.week,
        prior: p.rate,
        next: byWeek.get(p.week) ?? null,
      })),
      series: [
        { key: "prior", label: L(prior.label), color: K.slate, dashed: true },
        { key: "next", label: L(next.label), color: next.colour, area: true },
      ],
      markers: signalFw41.lineage.markers
        .filter((m) => m.style === "release")
        .map((m) => ({ x: m.week, label: L(m.label), color: K.orange })),
    };
  }
  if (card.trend.kind === "partner-dual") {
    const t = channel.partnerTimeline;
    return {
      data: t.friction.map((v, i) => ({
        x: i + 1,
        friction: v,
        sellIn: t.sellIn[i] ?? null,
      })),
      series: [
        {
          key: "friction",
          label: L(t.partnerId),
          color: K.teal,
          area: true,
        },
        {
          key: "sellIn",
          label: L(t.partnerId),
          color: K.slate,
          dashed: true,
          axis: "right",
        },
      ],
      markers: t.markers
        .filter((m) => m.style === "threshold")
        .map((m) => ({ x: m.week, label: L(m.label), color: K.teal })),
    };
  }
  const [remit, , control] = separation.cutoverTimeline.series;
  return {
    data: remit.values.map((v, i) => ({
      x: i + 1,
      remit: v,
      control: control.values[i] ?? null,
    })),
    series: [
      { key: "remit", label: L(remit.name), color: K.sky, area: true },
      {
        key: "control",
        label: L(control.name),
        color: K.slate,
        dashed: true,
      },
    ],
    markers: separation.cutoverTimeline.markers
      .filter((m) => m.style === "cutover")
      .map((m) => ({ x: m.week, label: L(m.label), color: K.sky })),
  };
}
