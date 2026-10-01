"use client";

import promise from "@kgs2/data/promise.json";
import { useDemo2, useLabel2, useV2K } from "@kgs2/lib/demoState";
import {
  type PromiseWallCard,
  promiseForPeriod,
} from "@kgs2/lib/drillFromPeriod";
import { seriesForRange } from "@kgs2/lib/periodData";
import type { V2View } from "@kgs2/types";
import { type CSSProperties, useMemo, useState } from "react";
import { withAlpha } from "@/components/role-based-dashboard/kgs/shared/tokens";
import { DrillHeader2 } from "../shared/DrillHeader2";
import { KpiRow2 } from "../shared/KpiRow2";
import { Panel } from "../shared/Panel2";
import {
  SignalWall2,
  type SignalWall2Data,
  type WallLevel2,
  wallFooter,
} from "../shared/SignalWall2";
import type { V2Tokens } from "../shared/themeTokens";
import { CauseStackedBar } from "./CauseStackedBar";
import {
  PromiseRegionChart,
  REGION_ORDER,
  regionStroke,
} from "./PromiseRegionChart";

const VISIBLE_DISTRIBUTORS = 6;

function keptColour(K: V2Tokens, pct: number): string {
  if (pct < 75) return K.red;
  if (pct < 85) return K.amber;
  return K.green;
}

function trendGlyph(
  K: V2Tokens,
  trend: string,
): { text: string; color: string } {
  if (trend === "down") return { text: "▼", color: K.red };
  if (trend === "up") return { text: "▲", color: K.green };
  return { text: "—", color: K.textMut };
}

function wallLevel(card: { level?: string; severity: string }): WallLevel2 {
  if (
    card.level === "critical" ||
    card.level === "alert" ||
    card.level === "warning" ||
    card.level === "improving"
  ) {
    return card.level;
  }
  if (card.severity === "improving") return "improving";
  if (card.severity === "S2") return "critical";
  if (card.severity === "S3") return "alert";
  return "warning";
}

function buildPromiseWall(
  signalWall: PromiseWallCard[],
  periodLabel: string,
): SignalWall2Data {
  const openFor: Record<string, V2View | undefined> = {
    "PR-01": "promiseHero",
  };
  const cards = signalWall.map((card) => ({ ...card, level: wallLevel(card) }));
  return {
    title: "LiSN Signal Wall",
    sub: `Promise signals · ${periodLabel} · click for detail`,
    footer: wallFooter(cards),
    cards: signalWall.map((card) => {
      const level = wallLevel(card);
      return {
        id: card.id,
        level,
        tag: level === "improving" ? "Improving" : card.severity,
        title: card.title,
        body: card.body,
        metric: card.metric,
        trend: card.trend,
        detail: {
          cause: card.body,
          areas:
            card.id === "PR-01"
              ? ["North", "Allocation queue N-2"]
              : card.id === "PR-02"
                ? ["{{place:Gurugram hub}}", "Last mile"]
                : card.id === "SEA-IMPROVING"
                  ? ["SEA"]
                  : [],
          actions:
            card.id === "PR-01"
              ? ["Open signal"]
              : card.action
                ? [card.action]
                : card.cta
                  ? [card.cta.replace(" →", "")]
                  : ["Hold · no action needed"],
          timeline: card.trend,
          owner:
            card.id === "SEA-IMPROVING" ? "Regional GM" : "Operations lead",
          priority: level === "improving" ? "Watching" : "Needs action",
        },
        openView: openFor[card.id],
      };
    }),
  };
}

/**
 * Promise view — SPEC §5a.
 */
export function PromiseView() {
  const K = useV2K();
  const REGION_STROKE = regionStroke(K);
  const th: CSSProperties = {
    textAlign: "left",
    padding: "8px 10px",
    fontSize: 11,
    fontWeight: 700,
    color: K.textMut,
    borderBottom: `1px solid ${K.borderLight}`,
    whiteSpace: "nowrap",
  };
  const td: CSSProperties = {
    padding: "8px 10px",
    fontSize: 13,
    color: K.body,
    borderBottom: `1px solid ${K.borderLight}`,
    whiteSpace: "nowrap",
  };
  const L = useLabel2();
  const { state } = useDemo2();
  const [showAllDistributors, setShowAllDistributors] = useState(false);

  const drill = useMemo(
    () => promiseForPeriod(state.dateRange),
    [state.dateRange],
  );
  const distributors = [...drill.distributors].sort(
    (a, b) => a.keptVsOriginalPct - b.keptVsOriginalPct,
  );
  const visible = showAllDistributors
    ? distributors
    : distributors.slice(0, VISIBLE_DISTRIBUTORS);

  const weekly = useMemo(() => {
    const weeks = promise.weeklyByRegion.weeks;
    const n = seriesForRange(
      weeks.map((_, i) => i),
      state.dateRange,
    ).length;
    const slicedWeeks = weeks.slice(-n);
    return {
      weeks: slicedWeeks,
      series: promise.weeklyByRegion.series.map((s) => ({
        ...s,
        values: seriesForRange(s.values, state.dateRange),
      })),
      targetPct: promise.weeklyByRegion.targetPct,
    };
  }, [state.dateRange]);

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: 16,
      }}
    >
      <DrillHeader2
        title={promise.title}
        subtitle="Delivery against the original promised date, by region and distributor."
      />

      <KpiRow2
        tiles={drill.kpis}
      />

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "minmax(0, 1.45fr) minmax(300px, 0.95fr)",
          gap: 12,
          alignItems: "stretch",
        }}
      >
        <Panel
          title="Promise kept by region, weekly"
          sub={
            state.dateRange === "7d"
              ? "Recent weeks · North highlighted · 90% target"
              : state.dateRange === "30d"
                ? "Last ~10 weeks · North highlighted · 90% target"
                : "13 weeks · North · South · East · West · SEA · 90% target"
          }
          style={{ height: "100%", display: "flex", flexDirection: "column" }}
        >
          <PromiseRegionChart
            weeks={weekly.weeks}
            series={weekly.series}
            targetPct={weekly.targetPct}
            labelFn={L}
            height={260}
          />
          <div
            style={{
              display: "flex",
              columnGap: 14,
              rowGap: 8,
              marginTop: 10,
              fontSize: 12,
              flexWrap: "wrap",
              alignItems: "center",
            }}
          >
            {REGION_ORDER.map((id) => {
              const stroke = REGION_STROKE[id];
              const isNorth = id === "North";
              return (
                <span
                  key={id}
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: 7,
                    fontWeight: isNorth ? 700 : 600,
                    color: isNorth ? K.text : K.textSec,
                  }}
                >
                  <span
                    aria-hidden
                    style={{
                      width: 18,
                      height: 3,
                      borderRadius: 2,
                      background: stroke.color,
                      flexShrink: 0,
                      boxShadow: isNorth
                        ? "none"
                        : `0 0 0 1px ${withAlpha(K.text, 0.2)}`,
                    }}
                  />
                  {L(`{{region:${id}}}`)}
                </span>
              );
            })}
            <span
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 7,
                fontWeight: 500,
                color: K.textMut,
              }}
            >
              <span
                aria-hidden
                style={{
                  width: 18,
                  borderTop: `2px dashed ${K.textMut}`,
                  flexShrink: 0,
                }}
              />
              90% target
            </span>
          </div>
        </Panel>

        <div style={{ minWidth: 0, minHeight: 0, display: "flex" }}>
          <div style={{ flex: 1, minHeight: 0, width: "100%" }}>
            <SignalWall2 wall={buildPromiseWall(drill.signalWall, drill.timeLabel)} compact />
          </div>
        </div>
      </div>

      {/* Distributor table — 8 columns, sorted by kept % ascending */}
      <Panel
        title="Distributors"
        sub={`${drill.timeLabel} · sorted by kept vs original %, worst first`}
      >
        <div style={{ overflowX: "auto" }}>
          <table
            style={{
              width: "100%",
              borderCollapse: "collapse",
              fontSize: 13,
            }}
          >
            <thead>
              <tr>
                {[
                  "Distributor",
                  "Region",
                  "Orders due",
                  "Kept vs original %",
                  "Avg slip days",
                  "Complaints",
                  "Trend",
                  "Top candidate cause",
                ].map((h) => (
                  <th key={h} style={th}>
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {visible.map((row) => {
                const t = trendGlyph(K, row.trend);
                return (
                  <tr key={row.distributorId}>
                    <td style={{ ...td, color: K.text, fontWeight: 700 }}>
                      {L(row.distributor)}
                    </td>
                    <td style={td}>{L(row.region)}</td>
                    <td style={{ ...td, fontFamily: K.mono }}>
                      {row.ordersDue}
                    </td>
                    <td
                      style={{
                        ...td,
                        fontFamily: K.mono,
                        fontWeight: 800,
                        color: keptColour(K, row.keptVsOriginalPct),
                      }}
                    >
                      {row.keptVsOriginalPct}%
                    </td>
                    <td style={{ ...td, fontFamily: K.mono }}>
                      {row.averageSlipDays}
                    </td>
                    <td style={{ ...td, fontFamily: K.mono }}>
                      {row.complaints}
                    </td>
                    <td
                      style={{
                        ...td,
                        color: t.color,
                        fontWeight: 700,
                        textAlign: "center",
                      }}
                      title={row.trend}
                    >
                      {t.text}
                    </td>
                    <td style={{ ...td, whiteSpace: "normal", maxWidth: 220 }}>
                      {L(row.topCandidateCause)}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        {distributors.length > VISIBLE_DISTRIBUTORS ? (
          <button
            type="button"
            className="kgs2-focus"
            onClick={() => setShowAllDistributors((v) => !v)}
            style={{
              marginTop: 10,
              alignSelf: "flex-start",
              background: "transparent",
              border: "none",
              color: K.violet300,
              fontSize: 12,
              fontWeight: 700,
              cursor: "pointer",
              fontFamily: "inherit",
              padding: 0,
            }}
          >
            {showAllDistributors
              ? "Show fewer"
              : `Show all ${distributors.length}`}
          </button>
        ) : null}
      </Panel>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "minmax(0, 1.2fr) minmax(0, 1fr)",
          gap: 12,
          alignItems: "stretch",
        }}
      >
        <Panel
          title="What partners said vs what the orders show"
          sub={`${drill.timeLabel} · ${drill.saidVsShows.length} of ${drill.saidVsShowsTotal} partner contacts · ${drill.saidVsShowsRule}`}
          right={
            <span
              style={{
                fontSize: 11,
                fontWeight: 700,
                letterSpacing: "0.04em",
                textTransform: "uppercase",
                padding: "4px 10px",
                borderRadius: K.radius.pill,
                background: withAlpha(K.violet400, 0.15),
                color: K.violet300,
                border: `1px solid ${withAlpha(K.violet400, 0.4)}`,
                whiteSpace: "nowrap",
              }}
            >
              joined with order data
            </span>
          }
        >
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {drill.saidVsShows.map((row) => (
              <div
                key={row.id}
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  gap: 12,
                  padding: "10px 12px",
                  background: K.inset,
                  borderRadius: 10,
                  border: `1px solid ${K.borderLight}`,
                }}
              >
                <div>
                  <div
                    style={{
                      fontSize: 11,
                      color: K.textMut,
                      marginBottom: 4,
                      letterSpacing: "0.04em",
                    }}
                  >
                    PARTNER SAID · {L(row.partner)} · {row.date}
                  </div>
                  <div
                    style={{ fontSize: 14, color: K.text, lineHeight: 1.45 }}
                  >
                    “{L(row.phrase)}”
                  </div>
                </div>
                <div>
                  <div
                    style={{
                      fontSize: 11,
                      color: K.textMut,
                      marginBottom: 4,
                      letterSpacing: "0.04em",
                    }}
                  >
                    ORDERS SHOW
                  </div>
                  <div
                    style={{
                      fontSize: 14,
                      color: K.body,
                      lineHeight: 1.45,
                    }}
                  >
                    {L(row.orderFacts)}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Panel>

        <Panel
          title="Candidate causes by region"
          sub={`${drill.timeLabel} · candidate causes — owner confirms`}
        >
          <CauseStackedBar
            rows={drill.causeSplitByRegion}
            labelFn={L}
            height={220}
          />
        </Panel>
      </div>
    </div>
  );
}
