"use client";

import React, { useMemo, useState } from "react";
import dynamic from "next/dynamic";
import { Sparkles } from "lucide-react";
import type { AnxietyPeriodData, QuadCellId } from "../../lib/cxHeadRetailV3AnxietyData";
import {
  ANXIETY_QUAD_CELLS,
  getQuadDriversForPeriod,
} from "../../lib/cxHeadRetailV3AnxietyData";
import { getAnxietyPeriodMetrics, getWeakestCategory, getStrongestCategory } from "../../lib/cxHeadRetailV3AnxietyMetrics";
import { cssVar, radius } from "../../theme/tokens";
import type { CliffSlopeEventMode } from "./CliffSlopePieCharts";
import {
  ANXIETY_STATE_META,
  AnxietyCard,
  SegButton,
  anxietyFmt,
} from "./AnxietyPrimitives";

const CliffSlopePieCharts = dynamic(
  () => import("./CliffSlopePieCharts").then((m) => m.CliffSlopePieCharts),
  {
    ssr: false,
    loading: () => (
      <div
        style={{
          height: 300,
          display: "grid",
          placeItems: "center",
          fontSize: 12,
          color: cssVar("text-muted"),
        }}
      >
        Loading chart…
      </div>
    ),
  },
);

const QUAD_ORDER: readonly QuadCellId[] = ["bl", "bh", "ml", "mh"];

const QUAD_SHORT_LABEL: Record<QuadCellId, string> = {
  ml: "Healthy",
  mh: "Reassure",
  bl: "Pre-empt",
  bh: "Trust erosion",
};

const QUAD_ANXIETY_LABEL: Record<QuadCellId, string> = {
  bl: "Low anxiety",
  bh: "High anxiety",
  ml: "Low anxiety",
  mh: "High anxiety",
};

const QUAD_ROOT_CAUSE: Record<
  QuadCellId,
  {
    title: string;
    body: string;
    tone: "danger" | "warning" | "info" | "success";
    affected: readonly string[];
  }
> = {
  bh: {
    title: "Promise broken under high anxiety",
    body: "Stuck-at-hub and failed attempts without re-attempt while customers are already anxious — East hubs carry the break. About half of Trust erosion is IPD miss paired with no re-attempt — a reliability failure, not a messaging gap.",
    tone: "danger",
    affected: ["East hubs (Kolkata, Patna, Ranchi)", "Last-mile COD & prepaid", "Customers inside contact window"],
  },
  bl: {
    title: "Silent reliability slip while customers are calm",
    body: "Promise is drifting (IPD) before anxiety shows up — Pre-empt is early reliability erosion, not contact load yet. Silent IPD slip and installation/return schedule lag form most of Pre-empt — customers have not contacted yet because they do not feel the miss.",
    tone: "info",
    affected: ["Installation SLA drift cohorts", "Return schedule lag", "Silent IPD slip shipments"],
  },
  mh: {
    title: "Promise met, anxiety still high",
    body: "Customers want faster than committed; in-transit anxiety sits inside SLA — a perception gap, not a breach. Main load is SLA-intact in-transit anxiety — this cohort is not Trust erosion apology territory.",
    tone: "warning",
    affected: ["In-transit SLA-intact orders", "BBD hub load corridors", "Desired-faster-than-promised"],
  },
  ml: {
    title: "Promise kept and anxiety low",
    body: "On-time last-mile and prepaid in-SLA patterns — the stabilizer cohort in the reliability × anxiety mix. Healthy is the reference group: low contact pressure and no reliability break to explain.",
    tone: "success",
    affected: ["On-time last-mile", "Prepaid in-SLA", "Standard grocery"],
  },
};

const QUAD_DETAILS: Record<QuadCellId, { priority: string }> = {
  bh: { priority: "P1" },
  bl: { priority: "P2" },
  mh: { priority: "P3" },
  ml: { priority: "P4" },
};

const QUAD_GROUPS: readonly {
  id: "breached" | "met";
  promiseLabel: string;
  promiseColor: string;
  cells: readonly [QuadCellId, QuadCellId];
}[] = [
  {
    id: "breached",
    promiseLabel: "Promise breached",
    promiseColor: cssVar("severity-high"),
    cells: ["bl", "bh"],
  },
  {
    id: "met",
    promiseLabel: "Promise met",
    promiseColor: cssVar("positive"),
    cells: ["ml", "mh"],
  },
];

function leadCellInGroup(
  cells: readonly [QuadCellId, QuadCellId],
  data: Record<QuadCellId, number>,
): QuadCellId {
  return data[cells[0]] >= data[cells[1]] ? cells[0] : cells[1];
}

function isBreachedCell(cell: QuadCellId): boolean {
  return cell === "bl" || cell === "bh";
}

function insightToneStyles(tone: "danger" | "warning" | "info" | "success"): {
  border: string;
  background: string;
} {
  switch (tone) {
    case "danger":
      return {
        border: `${cssVar("severity-high")}55`,
        background: `color-mix(in srgb, ${cssVar("severity-high")} 12%, transparent)`,
      };
    case "warning":
      return {
        border: `${cssVar("severity-med")}55`,
        background: `color-mix(in srgb, ${cssVar("severity-med")} 12%, transparent)`,
      };
    case "info":
      return {
        border: `${cssVar("accent")}55`,
        background: cssVar("accent-soft"),
      };
    case "success":
      return {
        border: `${cssVar("positive")}55`,
        background: `color-mix(in srgb, ${cssVar("positive")} 12%, transparent)`,
      };
    default: {
      const _exhaustive: never = tone;
      return _exhaustive;
    }
  }
}

function QuadDriversAndAiPanel({
  cell,
  drivers,
  driverColor,
  d,
}: {
  cell: QuadCellId;
  drivers: readonly (readonly [string, number])[];
  driverColor: string;
  d: AnxietyPeriodData;
}): React.ReactElement {
  const [tab, setTab] = useState<"summary" | "details">("summary");

  const tabs = [
    { id: "summary" as const, label: "AI Summary Wall" },
    { id: "details" as const, label: "Details" },
  ] as const;

  const activeIdx = tabs.findIndex((t) => t.id === tab);

  return (
    <div
      style={{
        borderRadius: radius.lg,
        border: `1px solid ${cssVar("border")}`,
        background: cssVar("surface"),
        overflow: "hidden",
        display: "flex",
        flexDirection: "column",
        flex: 1,
        minHeight: 0,
      }}
    >
      <div style={{ position: "relative", display: "grid", gridTemplateColumns: "1fr 1fr", borderBottom: `1px solid ${cssVar("border")}`, flexShrink: 0 }}>
        {tabs.map((item) => {
          const active = tab === item.id;
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => setTab(item.id)}
              style={{
                border: 0,
                background: "transparent",
                padding: "10px 8px",
                cursor: "pointer",
                fontSize: 15,
                fontWeight: 700,
                color: active ? cssVar("text-primary") : cssVar("text-muted"),
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                gap: 6,
                whiteSpace: "nowrap",
              }}
            >
              {item.id === "summary" ? <Sparkles size={14} color={active ? cssVar("accent-2") : cssVar("text-muted")} /> : null}
              {item.label}
            </button>
          );
        })}
        <div
          style={{
            position: "absolute",
            bottom: 0,
            left: `${(activeIdx / tabs.length) * 100}%`,
            width: `${100 / tabs.length}%`,
            height: 2,
            background: cssVar("severity-high"),
            transition: "left 0.2s ease",
          }}
        />
      </div>

      <div style={{ padding: "12px 14px", flex: 1, minHeight: 0, display: "flex", flexDirection: "column" }}>
        <QuadAiSummaryContent
          tab={tab}
          cell={cell}
          drivers={drivers}
          driverColor={driverColor}
          d={d}
        />
      </div>
    </div>
  );
}

function anxietyCompact(n: number): string {
  if (Math.abs(n) >= 1000) return `${(n / 1000).toFixed(1)}k`;
  return String(Math.round(n));
}

function CommandSignalDetailRows({
  d,
  cell,
}: {
  d: AnxietyPeriodData;
  cell: QuadCellId;
}): React.ReactElement {
  const m = getAnxietyPeriodMetrics(d);
  const worst = getWeakestCategory(d);
  const best = getStrongestCategory(d);
  const drivers = getQuadDriversForPeriod(cell, d);
  const topDriver = drivers[0]?.[0] ?? worst.k;
  const stateColor = ANXIETY_STATE_META[d.state].color;
  const reachAccent = cssVar("accent");
  const ipdColor =
    Math.round(d.ipd) >= 91 ? cssVar("positive") : Math.round(d.ipd) >= 89 ? cssVar("severity-med") : cssVar("severity-high");

  // Scale period volumes to the selected cell's share of the reliability × anxiety mix (timeframe-accurate).
  const cellShare = d.negTotal > 0 ? d.quad[cell] / d.negTotal : 0;
  const scale = (n: number): number => Math.max(0, Math.round(n * cellShare));
  const breachedSide = isBreachedCell(cell);
  const groupCount = breachedSide ? d.quad.bl + d.quad.bh : d.quad.ml + d.quad.mh;
  const groupSharePct = d.negTotal > 0 ? Math.round((groupCount / d.negTotal) * 100) : 0;

  const rows = [
    {
      title: "Promise reliability",
      color: ipdColor,
      items: [
        {
          k: "Promises kept",
          v: breachedSide
            ? `${m.promiseKeptPct}% · ${anxietyCompact(m.anxietyOnly)}`
            : `${groupSharePct}% · ${anxietyCompact(groupCount)}`,
        },
        { k: "Kept, still unhappy", v: anxietyCompact(d.quad.mh) },
        {
          k: "Promises breached",
          v: breachedSide
            ? `${groupSharePct}% · ${anxietyCompact(groupCount)}`
            : `${m.breachSharePct}% · ${anxietyCompact(m.breachSignals)}`,
        },
        { k: "Strongest", v: best.k },
      ],
    },
    {
      title: "Anxiety load",
      color: stateColor,
      items: [
        { k: "Building anxiety", v: anxietyCompact(scale(d.high)) },
        { k: "Silent, not contacted", v: anxietyCompact(scale(m.silentNotContacted)) },
        { k: "Top Issue", v: topDriver },
        { k: "Escalation likelihood", v: d.pContact.toFixed(2) },
      ],
    },
    {
      title: "Proactive outreach",
      color: reachAccent,
      items: [
        { k: "Reached first", v: `${m.coverageRate}% · ${anxietyCompact(scale(d.funnelNotified))}` },
        { k: "Contacts avoided", v: `${m.funnelRate}% · ${anxietyCompact(scale(d.funnelAvoided))}` },
        {
          k: "May contact",
          v: `${m.customerMayContactPct}% · ${anxietyCompact(scale(m.mayContactCount))}`,
        },
        { k: "Top Contacted Cat.", v: worst.k },
      ],
    },
  ] as const;

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 10, flex: 1, minHeight: 0 }}>
      <div style={{ fontSize: 11, fontWeight: 800, letterSpacing: 0.35, textTransform: "uppercase", color: cssVar("text-muted"), flexShrink: 0 }}>
        Command signals
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, minmax(0, 1fr))", gap: 8, flex: 1, minHeight: 0 }}>
        {rows.map((row) => (
          <div
            key={row.title}
            style={{
              padding: "12px 14px",
              borderRadius: radius.md,
              border: `1px solid ${row.color}33`,
              borderLeft: `3px solid ${row.color}`,
              background: cssVar("surface-raised"),
              minWidth: 0,
              minHeight: 0,
              display: "flex",
              flexDirection: "column",
              height: "100%",
            }}
          >
            <div style={{ fontSize: 13, fontWeight: 700, color: row.color, marginBottom: 10, flexShrink: 0 }}>{row.title}</div>
            <div style={{ display: "flex", flexDirection: "column", justifyContent: "space-between", flex: 1, gap: 8 }}>
              {row.items.map((item) => (
                <div key={item.k} style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", gap: 8, minWidth: 0 }}>
                  <span
                    style={{
                      fontSize: 12,
                      color: cssVar("text-muted"),
                      lineHeight: 1.25,
                      minWidth: 0,
                      flex: "1 1 auto",
                    }}
                  >
                    {item.k}
                  </span>
                  <span
                    className="lisn-num"
                    style={{
                      fontSize: 13,
                      fontWeight: 700,
                      color: cssVar("text-primary"),
                      textAlign: "right",
                      whiteSpace: "nowrap",
                      flexShrink: 0,
                      fontVariantNumeric: "tabular-nums",
                    }}
                  >
                    {item.v}
                  </span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function QuadAiSummaryContent({
  tab,
  cell,
  drivers,
  driverColor,
  d,
}: {
  tab: "summary" | "details";
  cell: QuadCellId;
  drivers: readonly (readonly [string, number])[];
  driverColor: string;
  d: AnxietyPeriodData;
}): React.ReactElement {
  const rootCause = QUAD_ROOT_CAUSE[cell];

  if (tab === "summary") {
    const tone = insightToneStyles(rootCause.tone);
    return (
      <div style={{ display: "flex", flexDirection: "column", gap: 10, flex: 1, minHeight: 0 }}>
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            gap: 6,
            alignItems: "center",
            flexShrink: 0,
          }}
        >
          <span
            style={{
              fontSize: 11,
              fontWeight: 800,
              letterSpacing: 0.3,
              textTransform: "uppercase",
              color: cssVar("text-muted"),
              marginRight: 2,
            }}
          >
            Drivers
          </span>
          {drivers.map(([k, v]) => (
            <span
              key={k}
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 5,
                padding: "5px 9px",
                borderRadius: radius.sm,
                border: `1px solid ${driverColor}44`,
                background: `color-mix(in srgb, ${driverColor} 12%, transparent)`,
                fontSize: 12,
                color: cssVar("text-secondary"),
                lineHeight: 1.2,
              }}
            >
              <span style={{ fontWeight: 600 }}>{k}</span>
              <span className="lisn-num" style={{ fontWeight: 800, color: driverColor }}>
                {v}%
              </span>
            </span>
          ))}
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 8, flex: 1 }}>
          <div
            style={{
              fontSize: 11,
              fontWeight: 800,
              letterSpacing: 0.3,
              textTransform: "uppercase",
              color: cssVar("text-muted"),
            }}
          >
            Root cause
          </div>
          <div
            style={{
              borderRadius: radius.md,
              border: `1px solid ${tone.border}`,
              background: tone.background,
              padding: "12px 14px",
            }}
          >
            <div style={{ fontSize: 14, fontWeight: 700, color: cssVar("text-primary"), lineHeight: 1.3, marginBottom: 5 }}>
              {rootCause.title}
            </div>
            <div style={{ fontSize: 13, color: cssVar("text-secondary"), lineHeight: 1.45 }}>
              {rootCause.body}
            </div>
          </div>

          <div style={{ display: "flex", flexWrap: "wrap", alignItems: "center", gap: 8, marginTop: 2 }}>
            <span
              style={{
                fontSize: 9,
                fontWeight: 800,
                letterSpacing: 0.35,
                textTransform: "uppercase",
                color: cssVar("severity-high"),
                flexShrink: 0,
              }}
            >
              Who&apos;s affected
            </span>
            {rootCause.affected.map((item) => (
              <span
                key={item}
                style={{
                  fontSize: 11,
                  color: cssVar("text-secondary"),
                  lineHeight: 1.3,
                  padding: "5px 9px",
                  borderRadius: radius.sm,
                  border: `1px solid ${cssVar("border")}`,
                  background: cssVar("surface-raised"),
                }}
              >
                {item}
              </span>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 10, flex: 1, minHeight: 0 }}>
      <CommandSignalDetailRows d={d} cell={cell} />
    </div>
  );
}

function QuadStackedBar({
  data,
  shares,
  active,
  onSelect,
}: {
  data: Record<QuadCellId, number>;
  shares: Record<QuadCellId, number>;
  active: QuadCellId;
  onSelect: (id: QuadCellId) => void;
}): React.ReactElement {
  const total = QUAD_ORDER.reduce((sum, id) => sum + data[id], 0) || 1;

  return (
    <div style={{ minWidth: 0 }}>
      <div style={{ display: "flex", gap: 10 }}>
        {QUAD_GROUPS.map((group) => {
          const groupShare = group.cells.reduce((sum, id) => sum + data[id], 0);
          const groupWidth = (groupShare / total) * 100;
          const groupActive = group.cells.includes(active);
          const lead = leadCellInGroup(group.cells, data);

          return (
            <div
              key={group.id}
              style={{
                flex: `0 0 ${Math.max(28, groupWidth)}%`,
                minWidth: 0,
                display: "flex",
                flexDirection: "column",
                gap: 8,
                padding: "10px 10px 8px",
                borderRadius: radius.lg,
                border: groupActive ? `1.5px solid ${group.promiseColor}` : `1px solid ${group.promiseColor}66`,
                background: `color-mix(in srgb, ${group.promiseColor} ${groupActive ? 12 : 6}%, ${cssVar("surface")})`,
                boxSizing: "border-box",
                boxShadow: groupActive ? `0 0 0 1px ${group.promiseColor}44` : undefined,
              }}
            >
              <button
                type="button"
                onClick={() => onSelect(lead)}
                title={`Focus ${group.promiseLabel} · updates AI Summary & Details`}
                style={{
                  border: 0,
                  background: "transparent",
                  cursor: "pointer",
                  fontSize: 10,
                  fontWeight: 800,
                  letterSpacing: 0.3,
                  textTransform: "uppercase",
                  color: group.promiseColor,
                  textAlign: "center",
                  padding: "2px 4px",
                  borderRadius: radius.sm,
                  outline: groupActive ? `1px solid ${group.promiseColor}66` : undefined,
                }}
              >
                {group.promiseLabel}
              </button>

              <div
                style={{
                  display: "flex",
                  gap: 4,
                  minHeight: 72,
                }}
              >
                {group.cells.map((id) => {
                  const accent = ANXIETY_STATE_META[ANXIETY_QUAD_CELLS[id].tone].color;
                  const widthPct = groupShare > 0 ? (data[id] / groupShare) * 100 : 50;
                  const selected = active === id;

                  return (
                    <button
                      key={id}
                      type="button"
                      onClick={() => onSelect(id)}
                      style={{
                        flex: `0 0 ${Math.max(28, widthPct)}%`,
                        minWidth: 0,
                        border: selected ? `1.5px solid ${cssVar("text-primary")}` : `1px solid ${accent}55`,
                        borderRadius: radius.md,
                        background: `linear-gradient(180deg, ${accent} 0%, color-mix(in srgb, ${accent} 78%, #000) 100%)`,
                        boxShadow: selected ? `0 0 0 1px ${accent}88` : undefined,
                        cursor: "pointer",
                        padding: "8px 6px",
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        justifyContent: "center",
                        gap: 3,
                        textAlign: "center",
                        position: "relative",
                      }}
                    >
                      <span
                        style={{
                          position: "absolute",
                          top: 5,
                          right: 5,
                          fontSize: 9,
                          fontWeight: 800,
                          letterSpacing: 0.2,
                          color: "#000000",
                          background: "rgba(255,255,255,0.85)",
                          borderRadius: 4,
                          padding: "2px 5px",
                          lineHeight: 1.2,
                        }}
                      >
                        {QUAD_DETAILS[id].priority}
                      </span>
                      <span
                        style={{
                          fontSize: 10,
                          fontWeight: 700,
                          color: "#ffffff",
                          lineHeight: 1.15,
                          textShadow: "0 1px 2px rgba(0,0,0,0.35)",
                          whiteSpace: "nowrap",
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          maxWidth: "100%",
                        }}
                      >
                        {QUAD_SHORT_LABEL[id]}
                      </span>
                      <span
                        className="lisn-num"
                        style={{
                          fontSize: 15,
                          fontWeight: 800,
                          color: "#ffffff",
                          lineHeight: 1,
                          textShadow: "0 1px 2px rgba(0,0,0,0.35)",
                        }}
                      >
                        {shares[id]}%
                      </span>
                    </button>
                  );
                })}
              </div>

              <div style={{ display: "flex", gap: 4 }}>
                {group.cells.map((id) => {
                  const groupCellShare = groupShare > 0 ? (data[id] / groupShare) * 100 : 50;
                  return (
                    <div
                      key={`${id}-axis`}
                      style={{
                        flex: `0 0 ${Math.max(28, groupCellShare)}%`,
                        minWidth: 0,
                        textAlign: "center",
                        fontSize: 9,
                        fontWeight: 700,
                        letterSpacing: 0.2,
                        textTransform: "uppercase",
                        color: "#ffffff",
                      }}
                    >
                      {QUAD_ANXIETY_LABEL[id]}
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export function ReliabilityVsAnxietyPanel({
  d,
}: {
  d: AnxietyPeriodData;
}): React.ReactElement {
  const [cell, setCell] = useState<QuadCellId>("bh");
  const [cliffSlopeMode, setCliffSlopeMode] = useState<CliffSlopeEventMode>("cliff");
  const meta = ANXIETY_QUAD_CELLS[cell];
  const toneMeta = ANXIETY_STATE_META[meta.tone];

  const quadShares = useMemo(() => {
    return Object.fromEntries(
      (Object.keys(d.quad) as QuadCellId[]).map((id) => [
        id,
        d.negTotal > 0 ? Math.round((d.quad[id] / d.negTotal) * 100) : 0,
      ]),
    ) as Record<QuadCellId, number>;
  }, [d.negTotal, d.quad]);

  const drivers = useMemo(() => getQuadDriversForPeriod(cell, d), [cell, d]);

  return (
    <div style={{ display: "grid", gridTemplateColumns: "1.35fr 1fr", gap: 12, alignItems: "stretch" }}>
      <AnxietyCard pad={16} style={{ display: "flex", flexDirection: "column", minWidth: 0, minHeight: 0 }}>
        <QuadStackedBar data={d.quad} shares={quadShares} active={cell} onSelect={setCell} />

        <div
          style={{
            marginTop: 12,
            padding: "10px 12px",
            borderRadius: radius.md,
            background: `color-mix(in srgb, ${toneMeta.color} 10%, transparent)`,
            border: `1px solid ${toneMeta.color}44`,
            fontSize: 12,
            color: cssVar("text-secondary"),
            lineHeight: 1.4,
            display: "flex",
            alignItems: "baseline",
            justifyContent: "space-between",
            gap: 10,
            flexShrink: 0,
          }}
        >
          <div>
            <span style={{ fontWeight: 700, color: toneMeta.color }}>{QUAD_SHORT_LABEL[cell]}</span>
            {" — "}
            {meta.note}
          </div>
          <span className="lisn-num" style={{ fontWeight: 800, color: cssVar("text-primary"), flexShrink: 0 }}>
            {anxietyFmt(d.quad[cell])}
          </span>
        </div>

        <div style={{ marginTop: 14, paddingTop: 14, borderTop: `1px solid ${cssVar("border")}`, flex: 1, minHeight: 0, display: "flex", flexDirection: "column" }}>
          <QuadDriversAndAiPanel
            cell={cell}
            drivers={drivers}
            driverColor={toneMeta.color}
            d={d}
          />
        </div>
      </AnxietyCard>

      <AnxietyCard pad={16} style={{ display: "flex", flexDirection: "column", minWidth: 0, overflow: "hidden" }}>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: 8,
            marginBottom: 6,
            flexShrink: 0,
          }}
        >
          <div style={{ fontSize: 11, fontWeight: 800, letterSpacing: 0.35, textTransform: "uppercase", color: cssVar("text-muted") }}>
            Cliff vs slope events
          </div>
          <div style={{ display: "flex", gap: 6, flexShrink: 0 }}>
            <SegButton active={cliffSlopeMode === "cliff"} onClick={() => setCliffSlopeMode("cliff")}>
              Cliff
            </SegButton>
            <SegButton active={cliffSlopeMode === "slope"} onClick={() => setCliffSlopeMode("slope")}>
              Slope
            </SegButton>
          </div>
        </div>
        <CliffSlopePieCharts mode={cliffSlopeMode} negTotal={d.negTotal} />
      </AnxietyCard>
    </div>
  );
}
