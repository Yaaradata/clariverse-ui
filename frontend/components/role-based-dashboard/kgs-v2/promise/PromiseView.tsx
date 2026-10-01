"use client";

import promise from "@kgs2/data/promise.json";
import { useLabel2 } from "@kgs2/lib/demoState";
import type { V2View } from "@kgs2/types";
import { Sparkles } from "lucide-react";
import { type CSSProperties, useState } from "react";
import { Panel } from "@/components/role-based-dashboard/kgs/drill/Panel";
import {
  K,
  withAlpha,
} from "@/components/role-based-dashboard/kgs/shared/tokens";
import { DrillHeader2 } from "../shared/DrillHeader2";
import { KpiRow2 } from "../shared/KpiRow2";
import {
  type SignalWall2Data,
  type WallLevel2,
  SignalWall2,
} from "../shared/SignalWall2";
import { CauseStackedBar } from "./CauseStackedBar";
import { PromiseRegionChart } from "./PromiseRegionChart";

const VISIBLE_DISTRIBUTORS = 6;

function formatKpiValue(value: number, unit?: string): string {
  if (unit === "%") return `${value}%`;
  if (unit === "days") return `${value} days`;
  return value.toLocaleString("en-GB");
}

function keptColour(pct: number): string {
  if (pct < 75) return K.red;
  if (pct < 85) return K.amber;
  return K.green;
}

function trendGlyph(trend: string): { text: string; color: string } {
  if (trend === "down") return { text: "▼", color: K.red };
  if (trend === "up") return { text: "▲", color: K.green };
  return { text: "—", color: K.textMut };
}

function wallLevel(card: {
  level?: string;
  severity: string;
}): WallLevel2 {
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

function buildPromiseWall(): SignalWall2Data {
  const openFor: Record<string, V2View | undefined> = {
    "PR-01": "promiseHero",
  };
  return {
    title: "Signal Wall",
    sub: "Open North for the hero deep dive",
    pill: "Live",
    cards: promise.signalWall.map((card) => {
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
                : ["SEA"],
          actions: card.cta
            ? [card.cta.replace(" →", "")]
            : ["Hold · no action needed"],
          timeline: card.trend,
          owner:
            card.id === "SEA-IMPROVING"
              ? "Regional GM"
              : "Operations lead",
          priority: level === "improving" ? "Watching" : "Needs action",
        },
        openView: openFor[card.id],
      };
    }),
    footer: [
      { label: "Critical", value: promise.signalWallFooter.critical },
      { label: "Needs action", value: promise.signalWallFooter.needsAction },
      { label: "Improving", value: promise.signalWallFooter.improving },
    ],
  };
}

/**
 * Promise view — InstalledBase-style three-column drill (SPEC §5a / R3).
 */
export function PromiseView() {
  const L = useLabel2();
  const [showAllDistributors, setShowAllDistributors] = useState(false);

  const north = promise.weeklyByRegion.series.find(
    (s) => s.regionId === "North",
  );
  const northLabel = L(north?.region ?? "{{region:North}}");

  const distributors = [...promise.distributors].sort(
    (a, b) => a.keptVsOriginalPct - b.keptVsOriginalPct,
  );
  const visible = showAllDistributors
    ? distributors
    : distributors.slice(0, VISIBLE_DISTRIBUTORS);

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: 16,
        padding: "16px 24px 24px",
      }}
    >
      <DrillHeader2
        title={promise.title}
        subtitle="Delivery against the original promised date, by region and distributor."
      />

      <KpiRow2
        tiles={promise.kpis.map((tile) => ({
          key: tile.key,
          label: tile.label,
          value: formatKpiValue(tile.value, tile.unit),
        }))}
      />

      {/* Three-column row — v1 InstalledBase grid */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(3, minmax(0, 1fr))",
          gap: 12,
          alignItems: "stretch",
        }}
      >
        {/* Left: distributors furthest behind */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            minWidth: 0,
            minHeight: 0,
          }}
        >
          <Panel
            title="Distributors furthest behind"
            sub="Worst kept % first"
            style={{
              flex: 1,
              minHeight: 0,
              height: "100%",
              overflow: "hidden",
            }}
          >
            <div
              style={{
                flex: 1,
                minHeight: 0,
                overflowY: "auto",
                display: "flex",
                flexDirection: "column",
                gap: 6,
              }}
            >
              {visible.map((row) => {
                const t = trendGlyph(row.trend);
                const pctColor = keptColour(row.keptVsOriginalPct);
                return (
                  <div
                    key={row.distributorId}
                    style={{
                      display: "grid",
                      gridTemplateColumns: "1fr auto auto",
                      gap: 8,
                      alignItems: "center",
                      padding: "8px 10px",
                      background: K.surface,
                      borderRadius: 8,
                      border: `1px solid ${K.borderLight}`,
                    }}
                  >
                    <div style={{ minWidth: 0 }}>
                      <div
                        style={{
                          fontSize: 13,
                          fontWeight: 700,
                          color: K.text,
                          lineHeight: 1.3,
                          whiteSpace: "nowrap",
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                        }}
                      >
                        {L(row.distributor)}
                      </div>
                      <div style={{ fontSize: 11, color: K.textMut }}>
                        {L(row.region)}
                      </div>
                    </div>
                    <span
                      style={{
                        fontSize: 14,
                        fontWeight: 800,
                        fontFamily: K.mono,
                        fontVariantNumeric: "tabular-nums",
                        color: pctColor,
                      }}
                    >
                      {row.keptVsOriginalPct}%
                    </span>
                    <span
                      style={{
                        fontSize: 14,
                        fontWeight: 700,
                        color: t.color,
                        width: 16,
                        textAlign: "center",
                      }}
                      aria-label={row.trend}
                    >
                      {t.text}
                    </span>
                  </div>
                );
              })}
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
        </div>

        {/* Middle: North chart + causes */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: 12,
            minWidth: 0,
          }}
        >
          <Panel
            title={`${northLabel} fell from 88% to 71% in 4 weeks`}
            sub="Other regions as grey range · 90% target"
          >
            <PromiseRegionChart
              weeks={promise.weeklyByRegion.weeks}
              series={promise.weeklyByRegion.series}
              targetPct={promise.weeklyByRegion.targetPct}
              northLabel={northLabel}
              height={220}
              endLabel="71%"
            />
            <div
              style={{
                display: "flex",
                gap: 14,
                marginTop: 6,
                fontSize: 11,
                color: K.textMut,
                flexWrap: "wrap",
              }}
            >
              <span>
                <span style={{ color: K.orange }}>━</span> {northLabel}
              </span>
              <span>
                <span
                  style={{
                    display: "inline-block",
                    width: 12,
                    height: 7,
                    background: withAlpha(K.slate, 0.35),
                    marginRight: 4,
                    verticalAlign: "middle",
                  }}
                />
                Other regions
              </span>
              <span>— — 90% target</span>
            </div>
          </Panel>

          <Panel
            title="What's causing the misses"
            sub="KGS allocation · backorder · order change · last mile"
          >
            <CauseStackedBar
              rows={promise.causeSplitByRegion}
              labelFn={L}
              height={200}
            />
          </Panel>
        </div>

        {/* Right: Signal Wall */}
        <div
          style={{
            minWidth: 0,
            minHeight: 0,
            display: "flex",
            flexDirection: "column",
          }}
        >
          <div style={{ flex: 1, minHeight: 0 }}>
            <SignalWall2 wall={buildPromiseWall()} />
          </div>
        </div>
      </div>

      {/* Said vs shows */}
      <Panel title="What partners said vs what the orders show">
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {promise.saidVsShows.map((row) => (
            <div
              key={`${row.partner}-${row.phrase}`}
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: 12,
                padding: "10px 12px",
                background: K.surface,
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
                  PARTNER SAID · {L(row.partner)}
                </div>
                <div style={{ fontSize: 14, color: K.text, lineHeight: 1.45 }}>
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
                    fontFamily: K.font,
                  }}
                >
                  {L(row.orderFacts)}
                </div>
              </div>
            </div>
          ))}
        </div>
      </Panel>

      {/* LiSN evidence summary */}
      <section
        aria-label="LiSN evidence summary"
        style={{
          background: withAlpha(K.brand, 0.08),
          border: `1px solid ${withAlpha(K.violet400, 0.35)}`,
          borderRadius: K.radius.card,
          padding: 18,
          display: "flex",
          flexDirection: "column",
          gap: 12,
        }}
      >
        <h2
          style={{
            margin: 0,
            fontSize: 18,
            fontWeight: 800,
            color: K.text,
            display: "flex",
            alignItems: "center",
            gap: 8,
          }}
        >
          <Sparkles size={18} color={K.violet400} aria-hidden />
          LiSN evidence summary
        </h2>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(3, minmax(0, 1fr))",
            gap: 16,
          }}
        >
          <p style={summaryP}>
            <strong style={{ color: K.text }}>Main signal:</strong>{" "}
            {L(promise.evidenceSummary.mainSignal)}
          </p>
          <p style={summaryP}>
            <strong style={{ color: K.text }}>What changed:</strong>{" "}
            {L(promise.evidenceSummary.whatChanged)}
          </p>
          <p style={summaryP}>
            <strong style={{ color: K.text }}>Decide first:</strong>{" "}
            {L(promise.evidenceSummary.decideFirst)}
          </p>
        </div>
      </section>
    </div>
  );
}

const summaryP: CSSProperties = {
  margin: 0,
  fontSize: 14,
  lineHeight: 1.55,
  color: K.body,
};
