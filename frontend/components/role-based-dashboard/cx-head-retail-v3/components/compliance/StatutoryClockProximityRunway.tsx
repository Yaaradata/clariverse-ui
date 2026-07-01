"use client";

import React from "react";
import { Clock, Flag } from "lucide-react";
import { COMPLIANCE_PAGE, STATUTORY_CLOCK_RUNWAYS, type StatutoryClockRunway } from "../../lib/cxHeadRetailData";
import { cssVar, radius, space, type } from "../../theme/tokens";

const PROXIMITY_BAND_PCT = 20;
const TOP_RANK_COUNT = 5;

const GRID_COLUMNS = "40px minmax(0, 148px) minmax(0, 1fr) 72px";

function urgencyColor(urgency: StatutoryClockRunway["urgency"]): string {
  if (urgency === "critical") return cssVar("severity-high");
  if (urgency === "high") return cssVar("severity-med");
  return cssVar("severity-med");
}

function milestoneColor(kind: StatutoryClockRunway["milestones"][number]["kind"]): string {
  if (kind === "override") return cssVar("accent-2");
  if (kind === "threshold") return cssVar("severity-med");
  if (kind === "touch") return cssVar("accent");
  return cssVar("text-muted");
}

function elapsedPct(runway: StatutoryClockRunway): number {
  const elapsed = runway.windowHours - runway.hoursLeft;
  return Math.min(100, Math.max(0, (elapsed / runway.windowHours) * 100));
}

function RankBadge({ rank, urgency }: { rank: number; urgency: StatutoryClockRunway["urgency"] }): React.ReactElement {
  const color = urgencyColor(urgency);
  const isLead = rank === 1;

  return (
    <div
      aria-label={`Clock rank ${rank}`}
      className="lisn-num"
      style={{
        width: 40,
        height: 40,
        borderRadius: radius.md,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontWeight: 800,
        fontSize: isLead ? 15 : 13,
        lineHeight: 1,
        color: isLead ? cssVar("severity-high") : color,
        background: isLead ? `${cssVar("severity-high")}16` : `${color}10`,
        border: `1px solid ${isLead ? `${cssVar("severity-high")}55` : `${color}33`}`,
        flexShrink: 0,
      }}
    >
      #{rank}
    </div>
  );
}

function SwimlaneRow({
  runway,
  rank,
  onSelect,
}: {
  runway: StatutoryClockRunway;
  rank: number;
  onSelect?: (id: string) => void;
}): React.ReactElement {
  const color = urgencyColor(runway.urgency);
  const pct = elapsedPct(runway);
  const elapsedHours = runway.windowHours - runway.hoursLeft;

  return (
    <button
      type="button"
      onClick={() => onSelect?.(runway.id)}
      style={{
        width: "100%",
        textAlign: "left",
        padding: `${space["2"]} ${space["3"]}`,
        borderRadius: radius.md,
        border: `1px solid ${color}55`,
        background: `${color}08`,
        cursor: onSelect ? "pointer" : "default",
        display: "grid",
        gridTemplateColumns: GRID_COLUMNS,
        gap: space["3"],
        alignItems: "center",
        transition: "border-color 0.15s, background 0.15s",
      }}
    >
      <RankBadge rank={rank} urgency={runway.urgency} />

      <div style={{ minWidth: 0 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 6, flexWrap: "wrap" }}>
          <span className="lisn-num" style={{ fontSize: 10, fontWeight: type.weight.bold, color: cssVar("accent") }}>
            {runway.id}
          </span>
          {rank === 1 ? (
            <span
              style={{
                fontSize: 8,
                fontWeight: type.weight.bold,
                letterSpacing: 0.3,
                textTransform: "uppercase",
                color: cssVar("severity-high"),
                padding: "1px 5px",
                borderRadius: radius.pill,
                background: `${cssVar("severity-high")}18`,
              }}
            >
              Nearest breach
            </span>
          ) : null}
        </div>
        <div
          style={{
            marginTop: 3,
            fontSize: 10,
            fontWeight: type.weight.semibold,
            color: cssVar("text-primary"),
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
          }}
        >
          &quot;{runway.keyword}&quot;
        </div>
        <div style={{ marginTop: 2, fontSize: 9, color: cssVar("text-muted"), lineHeight: 1.35, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
          {runway.regulation}
        </div>
      </div>

      <div style={{ position: "relative", minWidth: 0 }}>
        <div
          style={{
            position: "relative",
            height: 22,
            borderRadius: radius.pill,
            background: cssVar("border"),
            overflow: "hidden",
          }}
        >
          <div
            style={{
              position: "absolute",
              right: 0,
              top: 0,
              bottom: 0,
              width: `${PROXIMITY_BAND_PCT}%`,
              background: `repeating-linear-gradient(-45deg, ${cssVar("severity-high")}18, ${cssVar("severity-high")}18 4px, ${cssVar("severity-high")}08 4px, ${cssVar("severity-high")}08 8px)`,
              borderLeft: `1px solid ${cssVar("severity-high")}33`,
              zIndex: 0,
            }}
          />
          <div
            style={{
              position: "absolute",
              left: 0,
              top: 0,
              bottom: 0,
              width: `${pct}%`,
              borderRadius: radius.pill,
              background: `linear-gradient(90deg, ${color}dd, ${color}99)`,
              zIndex: 1,
            }}
          />
          <div
            style={{
              position: "absolute",
              left: `${pct}%`,
              top: -2,
              bottom: -2,
              width: 3,
              marginLeft: -1.5,
              borderRadius: 2,
              background: cssVar("text-primary"),
              boxShadow: `0 0 0 2px ${cssVar("surface-raised")}`,
              zIndex: 3,
            }}
            title="Now"
          />
          {runway.milestones.map((m) => {
            const leftPct = ((runway.windowHours - m.hoursBeforeDeadline) / runway.windowHours) * 100;
            const mColor = milestoneColor(m.kind);
            return (
              <div
                key={m.id}
                title={`${m.label} (T−${m.hoursBeforeDeadline}h)`}
                style={{
                  position: "absolute",
                  left: `${Math.min(98, Math.max(1, leftPct))}%`,
                  top: "50%",
                  transform: "translate(-50%, -50%)",
                  width: m.kind === "override" ? 9 : 7,
                  height: m.kind === "override" ? 9 : 7,
                  borderRadius: m.kind === "override" ? 2 : "50%",
                  background: mColor,
                  border: `1.5px solid ${cssVar("surface-raised")}`,
                  zIndex: 2,
                }}
              />
            );
          })}
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", marginTop: 4, fontSize: 8, color: cssVar("text-muted") }}>
          <span>Filed</span>
          <span className="lisn-num">{elapsedHours}h / {runway.windowHours}h</span>
          <span style={{ color, fontWeight: 700 }}>Deadline</span>
        </div>
      </div>

      <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 3, flexShrink: 0 }}>
        <span
          className="lisn-num"
          style={{
            fontSize: 18,
            fontWeight: 800,
            lineHeight: 1,
            color,
          }}
        >
          {runway.hoursLeft}h
        </span>
        <span style={{ fontSize: 8, fontWeight: type.weight.bold, letterSpacing: 0.3, textTransform: "uppercase", color: cssVar("text-muted") }}>
          to breach
        </span>
      </div>
    </button>
  );
}

function RunwayLegend(): React.ReactElement {
  const items = [
    { color: cssVar("severity-high"), label: "Elapsed window" },
    { color: cssVar("border"), label: "Remaining" },
    { swatch: "band" as const, label: "Breach proximity band" },
    { color: cssVar("accent-2"), label: "Keyword override" },
    { color: cssVar("severity-med"), label: "Threshold crossed" },
  ];

  return (
    <div
      style={{
        display: "flex",
        flexWrap: "wrap",
        justifyContent: "center",
        gap: space["3"],
        fontSize: 10,
        color: cssVar("text-muted"),
        width: "100%",
      }}
    >
      {items.map((item) => (
        <span key={item.label} style={{ display: "inline-flex", alignItems: "center", gap: 6 }}>
          {item.swatch === "band" ? (
            <span
              style={{
                width: 14,
                height: 10,
                borderRadius: 2,
                background: `repeating-linear-gradient(-45deg, ${cssVar("severity-high")}44, ${cssVar("severity-high")}44 3px, transparent 3px, transparent 6px)`,
                border: `1px solid ${cssVar("severity-high")}33`,
                flexShrink: 0,
              }}
            />
          ) : (
            <span style={{ width: 10, height: 10, borderRadius: 2, background: item.color, flexShrink: 0 }} />
          )}
          {item.label}
        </span>
      ))}
    </div>
  );
}

/** S3 clock-proximity swimlane — shared statutory window axis with breach proximity band. */
export function StatutoryClockProximityRunway({
  onSelect,
}: {
  onSelect?: (id: string) => void;
}): React.ReactElement {
  const sorted = [...STATUTORY_CLOCK_RUNWAYS]
    .sort((a, b) => a.clockRank - b.clockRank)
    .slice(0, TOP_RANK_COUNT);

  return (
    <div
      style={{
        padding: space["4"],
        borderRadius: radius.lg,
        background: cssVar("surface"),
        border: `1px solid ${cssVar("border")}`,
        minWidth: 0,
        height: "100%",
        display: "flex",
        flexDirection: "column",
        gap: space["3"],
      }}
    >
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: space["3"], flexWrap: "wrap" }}>
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: space["2"] }}>
            <Clock size={16} color={cssVar("accent")} aria-hidden />
            <div style={{ fontSize: type.scale.body, fontWeight: type.weight.bold, color: cssVar("text-primary") }}>
              {COMPLIANCE_PAGE.sections.clocks}
            </div>
          </div>
        </div>
        <div
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 6,
            padding: "4px 10px",
            borderRadius: radius.pill,
            fontSize: 10,
            fontWeight: type.weight.semibold,
            color: cssVar("severity-med"),
            background: `${cssVar("severity-med")}14`,
            border: `1px solid ${cssVar("severity-med")}33`,
          }}
        >
          <Flag size={11} aria-hidden />
          {COMPLIANCE_PAGE.sections.clocksHint}
        </div>
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: GRID_COLUMNS,
          gap: space["3"],
          padding: `0 ${space["3"]}`,
          fontSize: 8,
          fontWeight: type.weight.bold,
          letterSpacing: 0.35,
          textTransform: "uppercase",
          color: cssVar("text-muted"),
        }}
      >
        <span>Rank</span>
        <span>Grievance</span>
        <span>Window · now</span>
        <span style={{ textAlign: "right" }}>Breach clock</span>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: space["2"], flex: 1 }}>
        {sorted.map((runway) => (
          <SwimlaneRow key={runway.id} runway={runway} rank={runway.clockRank} onSelect={onSelect} />
        ))}
      </div>

      <RunwayLegend />
    </div>
  );
}
