"use client";

import React, { useMemo, useState } from "react";
import dynamic from "next/dynamic";
import { Sparkles } from "lucide-react";
import type { AnxietyPeriodData, QuadCellId } from "../../lib/cxHeadRetailV3AnxietyData";
import {
  ANXIETY_QUAD_CELLS,
  getQuadDriversForPeriod,
} from "../../lib/cxHeadRetailV3AnxietyData";
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

const QUAD_AI_INSIGHTS: Record<
  QuadCellId,
  readonly { title: string; body: string; tone: "danger" | "warning" | "info" | "success" }[]
> = {
  bh: [
    {
      title: "Contain trust break in East hubs now",
      body: "Promise miss + high anxiety on stuck-at-hub — approve revised-ETA outreach before contact window closes.",
      tone: "danger",
    },
    {
      title: "Clear IPD miss + stuck-at-hub first",
      body: "Half of Trust erosion — escalate no-reattempt to hub lead today; CX messaging alone won't hold.",
      tone: "warning",
    },
  ],
  bl: [
    {
      title: "Pre-empt before anxiety builds",
      body: "Reliability slipping while customers are calm — send honest re-promise now, before this cohort tips into Trust erosion.",
      tone: "info",
    },
    {
      title: "Silent IPD slip is the lead signal",
      body: "Over half of Pre-empt is silent promise drift — surface revised ETAs on app/SMS before customers contact.",
      tone: "warning",
    },
  ],
  mh: [
    {
      title: "Reassure — do not over-resolve",
      body: "Promise still met but customers feel late — contain with progress updates; avoid unnecessary compensation.",
      tone: "warning",
    },
    {
      title: "Keep out of trust-break queues",
      body: "In-transit anxiety is the main load and still inside SLA — separate reassure templates from breach apology flows.",
      tone: "info",
    },
  ],
  ml: [
    {
      title: "Hold — no outreach needed",
      body: "Promise kept and anxiety low — protect on-time last-mile and prepaid in-SLA as the stabilizers.",
      tone: "success",
    },
    {
      title: "Do not pull capacity from here",
      body: "Leave Healthy out of intervention queues so CX capacity stays on Pre-empt and Trust erosion.",
      tone: "warning",
    },
  ],
};

const QUAD_DETAILS: Record<
  QuadCellId,
  {
    rootCause: string;
    affected: readonly string[];
    actions: readonly string[];
    owner: string;
    timeToAct: string;
    priority: string;
  }
> = {
  bh: {
    rootCause: "Delivery promise broken while anxiety is already high — stuck-at-hub and failed attempts without re-attempt.",
    affected: ["East hubs (Kolkata, Patna, Ranchi)", "Last-mile COD & prepaid", "Customers inside contact window"],
    actions: [
      "Approve revised-ETA outreach for Trust erosion clusters",
      "Escalate no-reattempt cases to hub ops lead",
      "Clear IPD miss + stuck-at-hub before other drivers",
    ],
    owner: "CX Ops · Last-mile",
    timeToAct: "Immediate · before contact window",
    priority: "P1",
  },
  bl: {
    rootCause: "Silent reliability slip while customers are still calm — IPD drift not yet felt as anxiety.",
    affected: ["Installation SLA drift cohorts", "Return schedule lag", "Silent IPD slip shipments"],
    actions: [
      "Send honest re-promise before anxiety builds",
      "Push revised ETA on app/SMS for silent IPD slip",
      "Hold installation/return SLAs inside service window",
    ],
    owner: "CX Ops · Promise desk",
    timeToAct: "Same day · prevent Trust erosion",
    priority: "P2",
  },
  mh: {
    rootCause: "Promise still met, but customers want faster than committed — in-transit anxiety without breach.",
    affected: ["In-transit SLA-intact orders", "BBD hub load corridors", "Desired-faster-than-promised"],
    actions: [
      "Send progress / tracking reassure (no compensation)",
      "Keep cohort out of Trust erosion apology flows",
      "Separate reassure templates from breach templates",
    ],
    owner: "CX · Proactive messaging",
    timeToAct: "Within service window",
    priority: "P3",
  },
  ml: {
    rootCause: "Promise kept and anxiety low — on-time last-mile and prepaid in-SLA patterns.",
    affected: ["On-time last-mile", "Prepaid in-SLA", "Standard grocery"],
    actions: [
      "No outreach — hold as control benchmark",
      "Do not pull CX capacity from this cohort",
      "Compare other quadrants against Healthy mix",
    ],
    owner: "CX Head · Monitor only",
    timeToAct: "No action required",
    priority: "P4",
  },
};

const QUAD_GROUPS: readonly {
  promiseLabel: string;
  promiseColor: string;
  cells: readonly [QuadCellId, QuadCellId];
}[] = [
  {
    promiseLabel: "Promise breached",
    promiseColor: cssVar("severity-high"),
    cells: ["bl", "bh"],
  },
  {
    promiseLabel: "Promise met",
    promiseColor: cssVar("positive"),
    cells: ["ml", "mh"],
  },
];

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
}: {
  cell: QuadCellId;
  drivers: readonly (readonly [string, number])[];
  driverColor: string;
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
      }}
    >
      <div style={{ position: "relative", display: "grid", gridTemplateColumns: "1fr 1fr", borderBottom: `1px solid ${cssVar("border")}` }}>
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

      <div style={{ padding: "12px 14px", minHeight: 220 }}>
        <QuadAiSummaryContent
          tab={tab}
          cell={cell}
          drivers={drivers}
          driverColor={driverColor}
        />
      </div>
    </div>
  );
}

function QuadAiSummaryContent({
  tab,
  cell,
  drivers,
  driverColor,
}: {
  tab: "summary" | "details";
  cell: QuadCellId;
  drivers: readonly (readonly [string, number])[];
  driverColor: string;
}): React.ReactElement {
  const insights = QUAD_AI_INSIGHTS[cell];
  const details = QUAD_DETAILS[cell];

  if (tab === "summary") {
    return (
      <div style={{ display: "flex", flexDirection: "column", gap: 10, height: "100%" }}>
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            gap: 6,
            alignItems: "center",
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
          {insights.map((insight) => {
            const tone = insightToneStyles(insight.tone);
            return (
              <div
                key={insight.title}
                style={{
                  borderRadius: radius.md,
                  border: `1px solid ${tone.border}`,
                  background: tone.background,
                  padding: "12px 14px",
                  flex: 1,
                }}
              >
                <div style={{ fontSize: 14, fontWeight: 700, color: cssVar("text-primary"), lineHeight: 1.3, marginBottom: 5 }}>
                  {insight.title}
                </div>
                <div
                  style={{
                    fontSize: 13,
                    color: cssVar("text-secondary"),
                    lineHeight: 1.4,
                    whiteSpace: "nowrap",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                  }}
                  title={insight.body}
                >
                  {insight.body}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 10, maxHeight: 280, overflowY: "auto" }}>
      <div
        style={{
          padding: "10px 12px",
          borderRadius: radius.md,
          background: `color-mix(in srgb, ${driverColor} 10%, ${cssVar("surface-raised")})`,
          border: `1px solid ${driverColor}33`,
          borderLeft: `3px solid ${driverColor}`,
        }}
      >
        <div style={{ fontSize: 9, fontWeight: 800, letterSpacing: 0.35, textTransform: "uppercase", color: cssVar("text-muted"), marginBottom: 5 }}>
          Root cause
        </div>
        <div style={{ fontSize: 12, fontWeight: 600, color: cssVar("text-primary"), lineHeight: 1.45 }}>{details.rootCause}</div>
      </div>

      <div style={{ display: "flex", flexWrap: "wrap", alignItems: "center", gap: 8 }}>
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
          Who's affected
        </span>
        {details.affected.map((item) => (
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

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "minmax(0, 1.55fr) minmax(140px, 0.75fr)",
          gridTemplateRows: "auto 1fr",
          columnGap: 10,
          rowGap: 6,
          alignItems: "stretch",
        }}
      >
        <div style={{ fontSize: 9, fontWeight: 800, letterSpacing: 0.35, textTransform: "uppercase", color: cssVar("text-muted") }}>
          Recommended actions
        </div>
        <div style={{ fontSize: 9, fontWeight: 800, letterSpacing: 0.35, textTransform: "uppercase", color: cssVar("text-muted") }}>
          Ownership
        </div>

        <div style={{ minWidth: 0, display: "flex", flexDirection: "column", gap: 6, height: "100%" }}>
          {details.actions.map((action, idx) => (
            <div
              key={action}
              style={{
                flex: 1,
                display: "grid",
                gridTemplateColumns: "22px 1fr",
                gap: 8,
                alignItems: "center",
                padding: "8px 10px",
                borderRadius: radius.md,
                border: `1px solid ${cssVar("border")}`,
                background: cssVar("surface-raised"),
                minHeight: 40,
              }}
            >
              <span
                className="lisn-num"
                style={{
                  width: 22,
                  height: 22,
                  borderRadius: "50%",
                  display: "inline-flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: 10,
                  fontWeight: 800,
                  color: driverColor,
                  background: `color-mix(in srgb, ${driverColor} 16%, transparent)`,
                  flexShrink: 0,
                }}
              >
                {idx + 1}
              </span>
              <span style={{ fontSize: 11, color: cssVar("text-secondary"), lineHeight: 1.4 }}>{action}</span>
            </div>
          ))}
        </div>

        <div
          style={{
            minWidth: 0,
            display: "grid",
            gridTemplateRows: "1fr 1fr",
            gap: 6,
            height: "100%",
          }}
        >
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              padding: "10px 12px",
              borderRadius: radius.md,
              background: cssVar("surface-raised"),
              border: `1px solid ${cssVar("border")}`,
              minHeight: 0,
            }}
          >
            <div style={{ fontSize: 9, fontWeight: 800, letterSpacing: 0.35, textTransform: "uppercase", color: cssVar("text-muted"), marginBottom: 4 }}>
              Owner
            </div>
            <div style={{ fontSize: 12, fontWeight: 700, color: cssVar("text-primary"), lineHeight: 1.35 }}>{details.owner}</div>
          </div>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              padding: "10px 12px",
              borderRadius: radius.md,
              background: cssVar("surface-raised"),
              border: `1px solid ${cssVar("border")}`,
              minHeight: 0,
            }}
          >
            <div style={{ fontSize: 9, fontWeight: 800, letterSpacing: 0.35, textTransform: "uppercase", color: cssVar("text-muted"), marginBottom: 4 }}>
              Time to act
            </div>
            <div style={{ fontSize: 12, fontWeight: 700, color: driverColor, lineHeight: 1.35 }}>{details.timeToAct}</div>
          </div>
        </div>
      </div>
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

          return (
            <div
              key={group.promiseLabel}
              style={{
                flex: `0 0 ${Math.max(28, groupWidth)}%`,
                minWidth: 0,
                display: "flex",
                flexDirection: "column",
                gap: 8,
                padding: "10px 10px 8px",
                borderRadius: radius.lg,
                border: `1px solid ${group.promiseColor}66`,
                background: `color-mix(in srgb, ${group.promiseColor} 6%, ${cssVar("surface")})`,
                boxSizing: "border-box",
              }}
            >
              <div
                style={{
                  fontSize: 10,
                  fontWeight: 800,
                  letterSpacing: 0.3,
                  textTransform: "uppercase",
                  color: group.promiseColor,
                  textAlign: "center",
                }}
              >
                {group.promiseLabel}
              </div>

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
    <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
      <div style={{ display: "grid", gridTemplateColumns: "1.35fr 1fr", gap: 12, alignItems: "start" }}>
        <AnxietyCard pad={16}>
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

          <div style={{ marginTop: 14, paddingTop: 14, borderTop: `1px solid ${cssVar("border")}` }}>
            <QuadDriversAndAiPanel
              cell={cell}
              drivers={drivers}
              driverColor={toneMeta.color}
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
    </div>
  );
}
