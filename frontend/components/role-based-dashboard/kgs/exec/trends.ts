/**
 * Question-card AreaTrend series (04 §2.5), selected from the files each card's
 * `trend.ref` points at. No values are computed — rows are the JSON series by week.
 */
import { channel, separation, signalFw41 } from "@kgs/lib/data";
import type { QuestionCardData } from "@kgs/types";
import { K } from "../shared/tokens";
import type { TrendMarker, TrendSeries } from "./AreaTrend";

export type TrendSpec = {
  data: Array<Record<string, number | null>>;
  series: TrendSeries[];
  markers: TrendMarker[];
};

export function trendFor(
  card: QuestionCardData,
  L: (s: string) => string,
): TrendSpec {
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
