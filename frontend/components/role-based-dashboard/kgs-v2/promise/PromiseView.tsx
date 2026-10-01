"use client";

import overview from "@kgs2/data/overview.json";
import promise from "@kgs2/data/promise.json";
import { useLabel2 } from "@kgs2/lib/demoState";
import type { V2View } from "@kgs2/types";
import { Sparkles } from "lucide-react";
import type { CSSProperties } from "react";
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

function trendCell(trend: string): string {
  if (trend === "down") return "▼ down";
  if (trend === "up") return "▲ up";
  return "— flat";
}

function formatKpiValue(value: number, unit?: string): string {
  if (unit === "%") return `${value}%`;
  if (unit === "days") return `${value} days`;
  return value.toLocaleString("en-GB");
}

function severityLevel(sev: string): WallLevel2 {
  if (sev === "improving") return "improving";
  if (sev === "S2") return "critical";
  if (sev === "S3") return "alert";
  return "warning";
}

function buildPromiseWall(): SignalWall2Data {
  const byId = Object.fromEntries(
    overview.signals.map((s) => [s.id, s] as const),
  );
  const openFor: Record<string, V2View | undefined> = {
    "PR-01": "promiseHero",
    "PR-02": "promise",
  };
  return {
    title: "Signal Wall",
    sub: "AI Summary · open the hero for PR-01",
    pill: "Live",
    cards: promise.signalWall.map((card) => {
      const sig = byId[card.id];
      const level = severityLevel(card.severity);
      return {
        id: card.id,
        level,
        tag: card.severity === "improving" ? "Improving" : card.severity,
        title: card.title,
        body: sig?.topIntent ?? card.title,
        metric: sig
          ? `${sig.beforeAfter.after}`
          : level === "improving"
            ? "Holding"
            : "—",
        trend: sig
          ? `${sig.beforeAfter.before} → ${sig.beforeAfter.after}`
          : "SEA trend up",
        detail: {
          cause: sig?.topIntent ?? card.title,
          areas: sig ? [sig.pnlTag, sig.timeWindow] : ["SEA"],
          actions: sig ? [sig.recommendation] : ["Hold · no action needed"],
          timeline: sig?.timeWindow ?? "This week",
          owner: sig?.owner ?? "Operations lead",
          priority: card.severity === "improving" ? "Watching" : "Needs action",
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
 * Promise view — Are we keeping our promises? (SPEC §5a).
 */
export function PromiseView() {
  const L = useLabel2();
  const north = promise.weeklyByRegion.series.find(
    (s) => s.regionId === "North",
  );
  const northLabel = L(north?.region ?? "{{region:North}}");

  const distributors = [...promise.distributors].sort(
    (a, b) => a.keptVsOriginalPct - b.keptVsOriginalPct,
  );

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
        subtitle="Promise kept vs original date · by region and distributor"
      />

      <KpiRow2
        tiles={promise.kpis.map((tile) => ({
          key: tile.key,
          label: tile.label,
          value: formatKpiValue(tile.value, tile.unit),
        }))}
      />

      {/* 2. Promise kept by region */}
      <Panel
        title={`${northLabel} fell from 88% to 71% in 4 weeks`}
        sub="Promise kept by region, weekly · other regions as grey band · 90% target"
      >
        <PromiseRegionChart
          weeks={promise.weeklyByRegion.weeks}
          series={promise.weeklyByRegion.series}
          targetPct={promise.weeklyByRegion.targetPct}
          northLabel={northLabel}
        />
        <div
          style={{
            display: "flex",
            gap: 16,
            marginTop: 8,
            fontSize: 12,
            color: K.textMut,
          }}
        >
          <span>
            <span style={{ color: K.orange }}>━</span> {northLabel}
          </span>
          <span>
            <span
              style={{
                display: "inline-block",
                width: 14,
                height: 8,
                background: withAlpha(K.slate, 0.35),
                marginRight: 4,
                verticalAlign: "middle",
              }}
            />
            Other regions (range)
          </span>
          <span>— — 90% target</span>
        </div>
      </Panel>

      {/* 3. Distributor table */}
      <Panel
        title="Distributors — worst first"
        sub="12 partners · sorted by kept vs original %"
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
                  "Kept vs original",
                  "Avg slip",
                  "Complaints (4 wks)",
                  "Trend",
                  "Top candidate cause",
                ].map((h) => (
                  <th
                    key={h}
                    style={{
                      textAlign: "left",
                      padding: "8px 10px",
                      color: K.textMut,
                      fontWeight: 600,
                      borderBottom: `1px solid ${K.borderLight}`,
                      whiteSpace: "nowrap",
                    }}
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {distributors.map((row) => (
                <tr key={row.distributorId}>
                  <td style={td}>{L(row.distributor)}</td>
                  <td style={td}>{L(row.region)}</td>
                  <td style={{ ...td, fontFamily: K.mono }}>{row.ordersDue}</td>
                  <td
                    style={{
                      ...td,
                      fontFamily: K.mono,
                      color: row.keptVsOriginalPct < 80 ? K.orange : K.text,
                      fontWeight: row.keptVsOriginalPct < 80 ? 700 : 500,
                    }}
                  >
                    {row.keptVsOriginalPct}%
                  </td>
                  <td style={{ ...td, fontFamily: K.mono }}>
                    {row.averageSlipDays}d
                  </td>
                  <td style={{ ...td, fontFamily: K.mono }}>
                    {row.complaints4w}
                  </td>
                  <td
                    style={{
                      ...td,
                      color:
                        row.trend === "down"
                          ? K.red
                          : row.trend === "up"
                            ? K.green
                            : K.textMut,
                    }}
                  >
                    {trendCell(row.trend)}
                  </td>
                  <td style={td}>{L(row.topCandidateCause)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Panel>

      {/* 4. Said vs shows */}
      <Panel
        title="What partners said vs what the order system shows"
        right={
          <span
            style={{
              fontSize: 11,
              fontWeight: 700,
              padding: "4px 8px",
              borderRadius: K.radius.pill,
              background: withAlpha(K.violet400, 0.15),
              color: K.violet300,
              border: `1px solid ${withAlpha(K.violet400, 0.4)}`,
            }}
          >
            joined with order data
          </span>
        }
      >
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {promise.saidVsShows.map((row) => (
            <div
              key={row.phrase}
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
                  ORDER SYSTEM SHOWS
                </div>
                <div
                  style={{
                    fontSize: 14,
                    color: K.body,
                    lineHeight: 1.45,
                    fontFamily: K.mono,
                  }}
                >
                  {L(row.orderFacts)}
                </div>
              </div>
            </div>
          ))}
        </div>
      </Panel>

      {/* 5. Candidate causes */}
      <Panel
        title="Candidate causes by region"
        sub="candidate causes — owner confirms · KGS-side vs last mile"
      >
        <CauseStackedBar rows={promise.causeSplitByRegion} labelFn={L} />
      </Panel>

      {/* 6. Signal Wall */}
      <SignalWall2 wall={buildPromiseWall()} />

      {/* 7. LiSN evidence summary */}
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

const td: CSSProperties = {
  padding: "8px 10px",
  borderBottom: `1px solid ${K.borderLight}`,
  color: K.body,
  verticalAlign: "top",
};

const summaryP: CSSProperties = {
  margin: 0,
  fontSize: 14,
  lineHeight: 1.55,
  color: K.body,
};
