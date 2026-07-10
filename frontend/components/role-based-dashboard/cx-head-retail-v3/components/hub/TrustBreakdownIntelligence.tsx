"use client";

import React, { useRef, useState } from "react";
import {
  Sparkles,
  AlertTriangle,
  ArrowRight,
  ArrowUpRight,
  ArrowDownRight,
  Users,
  MessageSquare,
  MapPin,
  Truck,
  Tag,
  Target,
  Layers,
  ChevronDown,
  type LucideIcon,
} from "lucide-react";
import {
  TRUST_ACTIONS,
  TRUST_DRIVERS,
  TRUST_DRIVER_CUTS,
  TRUST_EVIDENCE,
  TRUST_PULSE,
  TRUST_RANGES,
  TRUST_SEGMENTS,
  SCATTER_BY,
  SCATTER_IX,
  type TrustCategoryCutRow,
  type TrustChannelCutRow,
  type TrustDriver,
  type TrustDriverCut,
  type TrustDriverId,
  type TrustPathCutRow,
  type TrustQuadKind,
  type TrustRangeKey,
  type TrustSegmentMatrixRow,
} from "../../lib/cxHeadRetailV3TrustBreakdownData";
import { WHATS_FAILING_CHANNEL_COLORS, WHATS_FAILING_SEGMENT_COLORS } from "../../lib/cxHeadRetailV3CustomerFciData";
import { TrustPulseKpiCards } from "./TrustPulseKpiCards";
import { cssVar, radius } from "../../theme/tokens";

const nf = new Intl.NumberFormat("en-IN");
const fmt = (n: number): string => nf.format(Math.round(n));

const TRUST_CHANNEL_COLORS: Record<string, string> = {
  Voice: WHATS_FAILING_CHANNEL_COLORS.Voice,
  Chat: WHATS_FAILING_CHANNEL_COLORS.Chat,
  Email: WHATS_FAILING_CHANNEL_COLORS.Email,
  LinkedIn: "#0A66C2",
  X: "#E7E9EA",
};

const CHANNEL_TABS = [
  { id: "Chat", label: "Chat" },
  { id: "Voice", label: "Voice" },
  { id: "Email", label: "Email" },
  { id: "LinkedIn", label: "Linked in" },
  { id: "X", label: "X" },
] as const;

function classify(d: TrustDriver): TrustQuadKind {
  if (d.blast >= SCATTER_BY && d.incident < SCATTER_IX) return "cliff";
  if (d.blast >= SCATTER_BY && d.incident >= SCATTER_IX) return "hotspot";
  if (d.blast < SCATTER_BY && d.incident >= SCATTER_IX) return "ops";
  return "monitor";
}

const QUAD_META: Record<TrustQuadKind, { color: string; soft: string; label: string; note: string }> = {
  cliff: {
    color: cssVar("severity-high"),
    soft: `${cssVar("severity-high")}18`,
    label: "Cliff risk",
    note: "Rare · high blast radius",
  },
  hotspot: {
    color: cssVar("severity-high"),
    soft: `${cssVar("severity-high")}28`,
    label: "Trust breakdown hotspot",
    note: "Frequent · high blast radius",
  },
  ops: {
    color: cssVar("accent"),
    soft: cssVar("accent-soft"),
    label: "Operational issue",
    note: "Frequent · lower blast radius",
  },
  monitor: {
    color: cssVar("positive"),
    soft: `${cssVar("positive")}18`,
    label: "Monitor",
    note: "Rare · lower blast radius",
  },
};

function InferredChip({
  conf,
  small = false,
}: {
  conf: number;
  small?: boolean;
}): React.ReactElement {
  return (
    <span
      title="Model inference — treat as probabilistic, not fact"
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 4,
        fontSize: small ? 10 : 11,
        fontWeight: 700,
        borderRadius: radius.pill,
        padding: "3px 8px",
        background: cssVar("accent-soft"),
        color: cssVar("accent-2"),
        border: `1px solid ${cssVar("accent")}55`,
      }}
    >
      <Sparkles size={small ? 10 : 11} strokeWidth={2.4} /> Confidence
      <b className="lisn-num" style={{ fontWeight: 600 }}>{conf}%</b>
    </span>
  );
}

function DriverAiHowToDeal({ points }: { points: readonly [string, string, string] }): React.ReactElement {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: 8,
        padding: "10px 12px",
        background: cssVar("accent-soft"),
        borderRadius: radius.md,
        border: `1px solid ${cssVar("accent")}28`,
        width: "100%",
        boxSizing: "border-box",
        textAlign: "left",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
        <Sparkles size={14} strokeWidth={2.4} color={cssVar("accent-2")} style={{ flexShrink: 0 }} />
        <span style={{ fontSize: 12, fontWeight: 600, color: cssVar("text-secondary"), lineHeight: 1.45 }}>
          How to Deal?
        </span>
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 4, minWidth: 0 }}>
        {points.map((point, index) => (
          <div
            key={`${index}-${point}`}
            title={point}
            style={{
              display: "flex",
              alignItems: "flex-start",
              gap: 8,
              minWidth: 0,
            }}
          >
            <span
              aria-hidden
              style={{
                flexShrink: 0,
                width: 5,
                marginTop: 5,
                fontSize: 11,
                lineHeight: 1,
                color: cssVar("accent-2"),
                textAlign: "center",
              }}
            >
              •
            </span>
            <span
              style={{
                fontSize: 11,
                color: cssVar("text-secondary"),
                lineHeight: 1.35,
                fontWeight: 500,
                whiteSpace: "nowrap",
                overflow: "hidden",
                textOverflow: "ellipsis",
                minWidth: 0,
                flex: 1,
              }}
            >
              {point}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

function Delta({
  value,
  good = "down",
  suffix = "%",
  label,
}: {
  value: number;
  good?: "down" | "up";
  suffix?: string;
  label?: string;
}): React.ReactElement {
  const up = value >= 0;
  const isGood = good === "down" ? !up : up;
  const color = isGood ? cssVar("positive") : cssVar("severity-high");
  const Icon = up ? ArrowUpRight : ArrowDownRight;

  return (
    <span style={{ display: "inline-flex", alignItems: "center", gap: 4, color, fontWeight: 700, fontSize: 12.5 }}>
      <Icon size={14} strokeWidth={2.6} />
      <span className="lisn-num">
        {up ? "+" : ""}
        {value}
        {suffix}
      </span>
      {label ? <span style={{ color: cssVar("text-muted"), fontWeight: 600, fontSize: 11 }}>{label}</span> : null}
    </span>
  );
}

function SectionHead({
  n,
  icon: Icon,
  title,
  sub,
  right,
  titleBesideBadge = false,
}: {
  n: string;
  icon?: LucideIcon;
  title: React.ReactNode;
  sub?: string;
  right?: React.ReactNode;
  titleBesideBadge?: boolean;
}): React.ReactElement {
  const badge = titleBesideBadge ? (
    <span
      className="lisn-num"
      style={{
        display: "inline-grid",
        placeItems: "center",
        width: 44,
        height: 44,
        fontSize: 18,
        fontWeight: 800,
        letterSpacing: "0.08em",
        fontVariantNumeric: "tabular-nums",
        color: cssVar("accent-2"),
        background: "transparent",
        borderRadius: 12,
        border: `2px solid ${cssVar("accent")}`,
        boxShadow: cssVar("shadow-card"),
        lineHeight: 1,
        flexShrink: 0,
      }}
    >
      {n}
    </span>
  ) : (
    <span
      className="lisn-num"
      style={{
        fontSize: 11,
        fontWeight: 700,
        color: cssVar("accent"),
        background: cssVar("accent-soft"),
        borderRadius: 6,
        padding: "2px 7px",
        lineHeight: 1,
        flexShrink: 0,
      }}
    >
      {n}
    </span>
  );

  return (
    <div
      style={{
        display: "flex",
        alignItems: titleBesideBadge ? "center" : "flex-end",
        justifyContent: "space-between",
        gap: 16,
        marginBottom: titleBesideBadge ? 18 : 14,
        flexWrap: "wrap",
      }}
    >
      <div style={{ minWidth: titleBesideBadge ? 0 : 260, flex: titleBesideBadge ? "1 1 0%" : undefined }}>
        {titleBesideBadge ? (
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 12,
              flexWrap: "wrap",
              width: "100%",
            }}
          >
            {badge}
            {Icon ? (
              <div
                style={{
                  width: 36,
                  height: 36,
                  borderRadius: 10,
                  display: "grid",
                  placeItems: "center",
                  background: cssVar("accent-soft"),
                  border: `1px solid ${cssVar("accent")}35`,
                  flexShrink: 0,
                }}
              >
                <Icon size={18} color={cssVar("accent")} strokeWidth={2.2} />
              </div>
            ) : null}
            <h2
              style={{
                margin: 0,
                fontSize: 22,
                fontWeight: 800,
                color: cssVar("text-primary"),
                letterSpacing: "-0.03em",
                lineHeight: 1.2,
              }}
            >
              {title}
            </h2>
          </div>
        ) : (
          <>
            <div style={{ display: "flex", alignItems: "center", gap: 9, marginBottom: 3 }}>
              {badge}
              {Icon ? <Icon size={14} color={cssVar("text-muted")} strokeWidth={2.2} /> : null}
              {sub ? (
                <span
                  style={{
                    fontSize: 11.5,
                    fontWeight: 700,
                    letterSpacing: "0.08em",
                    textTransform: "uppercase",
                    color: cssVar("text-muted"),
                  }}
                >
                  {sub}
                </span>
              ) : null}
            </div>
            <h3 style={{ margin: 0, fontSize: 18, fontWeight: 700, color: cssVar("text-primary"), letterSpacing: "-0.02em" }}>
              {title}
            </h3>
          </>
        )}
      </div>
      {right}
    </div>
  );
}

function PanelCard({
  children,
  style,
}: {
  children: React.ReactNode;
  style?: React.CSSProperties;
}): React.ReactElement {
  return (
    <div
      style={{
        background: cssVar("surface"),
        border: `1px solid ${cssVar("border")}`,
        borderRadius: radius.lg,
        boxShadow: cssVar("shadow-card"),
        ...style,
      }}
    >
      {children}
    </div>
  );
}

function donutSlice(cx: number, cy: number, Ro: number, Ri: number, a0: number, a1: number): string {
  const rad = (d: number) => ((d - 90) * Math.PI) / 180;
  const x0o = cx + Ro * Math.cos(rad(a0));
  const y0o = cy + Ro * Math.sin(rad(a0));
  const x1o = cx + Ro * Math.cos(rad(a1));
  const y1o = cy + Ro * Math.sin(rad(a1));
  const x0i = cx + Ri * Math.cos(rad(a1));
  const y0i = cy + Ri * Math.sin(rad(a1));
  const x1i = cx + Ri * Math.cos(rad(a0));
  const y1i = cy + Ri * Math.sin(rad(a0));
  const large = a1 - a0 > 180 ? 1 : 0;
  return `M ${x0o} ${y0o} A ${Ro} ${Ro} 0 ${large} 1 ${x1o} ${y1o} L ${x0i} ${y0i} A ${Ri} ${Ri} 0 ${large} 0 ${x1i} ${y1i} Z`;
}

function DonutChart({ rows, colors }: { rows: TrustCategoryCutRow[]; colors: string[] }): React.ReactElement {
  const total = rows.reduce((sum, row) => sum + row.share, 0);
  let angle = 0;
  const cx = 54;
  const cy = 54;
  const slices = rows.map((row, i) => {
    const sweep = (row.share / total) * 360;
    const start = angle;
    const end = angle + sweep;
    angle = end;
    return { ...row, path: donutSlice(cx, cy, 40, 26, start, end), color: colors[i % colors.length] };
  });

  const colTemplate = "minmax(0, 1fr) 48px 38px 34px 38px";

  const th: React.CSSProperties = {
    fontSize: 9,
    fontWeight: 700,
    letterSpacing: "0.06em",
    textTransform: "uppercase",
    color: cssVar("text-muted"),
    lineHeight: 1.1,
    whiteSpace: "nowrap",
  };

  const tdNum: React.CSSProperties = {
    fontSize: 10,
    lineHeight: 1.2,
    textAlign: "right",
    fontVariantNumeric: "tabular-nums",
    whiteSpace: "nowrap",
  };

  return (
    <div style={{ display: "flex", gap: 12, alignItems: "center", height: "100%", minHeight: 0 }}>
      <svg viewBox="0 0 108 108" width={88} height={88} style={{ flexShrink: 0 }} aria-hidden>
        {slices.map((s) => (
          <path key={s.label} d={s.path} fill={s.color} />
        ))}
      </svg>
      <div
        style={{
          flex: 1,
          minWidth: 0,
          display: "grid",
          gridTemplateColumns: colTemplate,
          columnGap: 8,
          rowGap: 5,
          alignItems: "center",
        }}
      >
        <span style={th}>Category</span>
        <span style={{ ...th, textAlign: "right" }}>Cx</span>
        <span style={{ ...th, textAlign: "right" }}>WoW</span>
        <span style={{ ...th, textAlign: "right" }}>Neg</span>
        <span style={{ ...th, textAlign: "right" }}>Share</span>

        <div
          style={{
            gridColumn: "1 / -1",
            height: 1,
            background: cssVar("border"),
            margin: "1px 0 2px",
          }}
        />

        {slices.map((s) => (
          <React.Fragment key={s.label}>
            <span
              style={{
                display: "flex",
                alignItems: "center",
                gap: 5,
                fontSize: 10,
                lineHeight: 1.2,
                color: cssVar("text-secondary"),
                minWidth: 0,
              }}
            >
              <i style={{ width: 6, height: 6, borderRadius: 99, background: s.color, flexShrink: 0 }} />
              <span style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{s.label}</span>
            </span>
            <span className="lisn-num" style={{ ...tdNum, fontWeight: 600, color: cssVar("text-primary") }}>
              {fmt(s.complaints)}
            </span>
            <span
              className="lisn-num"
              style={{
                ...tdNum,
                fontWeight: 700,
                color: s.wow >= 0 ? cssVar("severity-high") : cssVar("positive"),
              }}
            >
              {s.wow >= 0 ? "+" : ""}
              {s.wow}%
            </span>
            <span className="lisn-num" style={{ ...tdNum, fontWeight: 600, color: cssVar("accent-2") }}>
              {s.negSentiment}%
            </span>
            <span className="lisn-num" style={{ ...tdNum, fontWeight: 700, color: cssVar("text-primary") }}>
              {s.share}%
            </span>
          </React.Fragment>
        ))}
      </div>
    </div>
  );
}

function RegionBarChart({ rows, accent }: { rows: [string, number][]; accent: string }): React.ReactElement {
  const max = Math.max(...rows.map((r) => r[1]));
  return (
    <div style={{ display: "grid", gap: 9, height: "100%", alignContent: "center" }}>
      {rows.map(([k, v]) => (
        <div key={k} style={{ display: "grid", gridTemplateColumns: "minmax(0, 0.9fr) 1fr auto", gap: 8, alignItems: "center" }}>
          <span style={{ fontSize: 11, color: cssVar("text-secondary"), overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{k}</span>
          <div
            style={{
              height: 8,
              borderRadius: 4,
              background: cssVar("surface-raised"),
              overflow: "hidden",
            }}
          >
            <div
              style={{
                width: `${(v / max) * 100}%`,
                height: "100%",
                background: accent,
                borderRadius: 4,
              }}
            />
          </div>
          <span className="lisn-num" style={{ fontSize: 11, fontWeight: 700, color: cssVar("text-primary"), width: 30, textAlign: "right" }}>{v}%</span>
        </div>
      ))}
    </div>
  );
}

function PathFlowViz({ rows, colors }: { rows: TrustPathCutRow[]; colors: string[] }): React.ReactElement {
  const columnTemplate = rows.map((r) => `${r.share}fr`).join(" ");

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: 10,
        height: "100%",
        minHeight: 168,
        justifyContent: "center",
      }}
    >
      <div
        style={{
          display: "flex",
          height: 32,
          borderRadius: 9,
          overflow: "hidden",
          border: `1px solid ${cssVar("border")}`,
        }}
      >
        {rows.map((row, i) => {
          const color = colors[i % colors.length];
          return (
            <div
              key={row.label}
              title={`${row.label} · ${row.share}% · ${fmt(row.complaints)} cx`}
              style={{
                width: `${row.share}%`,
                background: color,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                minWidth: row.share >= 12 ? undefined : 4,
                borderRight: i < rows.length - 1 ? `1px solid ${cssVar("surface")}44` : undefined,
              }}
            >
              {row.share >= 18 ? (
                <span className="lisn-num" style={{ fontSize: 10, fontWeight: 800, color: "#fff" }}>
                  {row.share}%
                </span>
              ) : null}
            </div>
          );
        })}
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: columnTemplate,
          gap: 8,
          alignItems: "stretch",
        }}
      >
        {rows.map((row, i) => {
          const color = colors[i % colors.length];
          return (
            <div
              key={row.label}
              style={{
                minWidth: 0,
                padding: "8px 8px 10px",
                borderRadius: "0 0 8px 8px",
                background: cssVar("surface-raised"),
                border: `1px solid ${cssVar("border")}`,
                borderTop: `3px solid ${color}`,
              }}
            >
              <div
                style={{
                  fontSize: 11,
                  fontWeight: 800,
                  color: cssVar("text-primary"),
                  lineHeight: 1.3,
                  letterSpacing: "-0.01em",
                }}
              >
                {row.label}
              </div>
              <div
                style={{
                  display: "flex",
                  alignItems: "baseline",
                  gap: 4,
                  marginTop: 8,
                }}
              >
                <span
                  className="lisn-num"
                  style={{
                    fontSize: 16,
                    fontWeight: 800,
                    color,
                    lineHeight: 1,
                  }}
                >
                  {fmt(row.complaints)}
                </span>
                <span
                  style={{
                    fontSize: 10,
                    fontWeight: 700,
                    letterSpacing: "0.04em",
                    textTransform: "uppercase",
                    color: cssVar("text-muted"),
                  }}
                >
                  CX
                </span>
              </div>
              <div
                style={{
                  fontSize: 10,
                  fontWeight: 500,
                  color: cssVar("text-secondary"),
                  marginTop: 8,
                  lineHeight: 1.45,
                }}
              >
                {row.detail}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function TrustAiSummaryBody(): React.ReactElement {
  const primaryDrivers = (
    ["damaged", "refund"] as const
  ).map((id) => TRUST_DRIVERS.find((d) => d.id === id))
    .filter((d): d is TrustDriver => d !== undefined);
  const phrases = TRUST_EVIDENCE.slice(0, 3).map((e) => e.quote);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 14, flex: 1, minHeight: 0 }}>
      <p style={{ margin: 0, fontSize: 14, fontWeight: 700, lineHeight: 1.45, color: cssVar("text-primary") }}>
        {TRUST_PULSE.verdict}
      </p>

      <div>
        <span
          style={{
            display: "block",
            marginBottom: 8,
            fontSize: 10,
            fontWeight: 700,
            letterSpacing: "0.06em",
            textTransform: "uppercase",
            color: cssVar("text-muted"),
          }}
        >
          Primary drivers
        </span>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(2, minmax(0, 1fr))", gap: 8 }}>
          {primaryDrivers.map((d) => (
            <div
              key={d.id}
              style={{
                padding: "10px 11px",
                borderRadius: 8,
                background: cssVar("surface-raised"),
                border: `1px solid ${cssVar("border")}`,
                borderLeft: `3px solid ${d.id === "damaged" ? cssVar("severity-high") : cssVar("accent-2")}`,
              }}
            >
              <div style={{ fontSize: 12, fontWeight: 700, color: cssVar("text-primary"), lineHeight: 1.25 }}>{d.label}</div>
              <div style={{ fontSize: 10.5, color: cssVar("text-muted"), marginTop: 4 }}>
                {fmt(d.complaints)} contacts · +{d.wow}% WoW · {d.sentNeg}% neg
              </div>
            </div>
          ))}
        </div>
      </div>

      <div style={{ flex: 1, minHeight: 0 }}>
        <span
          style={{
            display: "block",
            marginBottom: 8,
            fontSize: 10,
            fontWeight: 700,
            letterSpacing: "0.06em",
            textTransform: "uppercase",
            color: cssVar("text-muted"),
          }}
        >
          Repeated customer language
        </span>
        <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
          {phrases.map((phrase) => (
            <div
              key={phrase}
              style={{
                display: "flex",
                gap: 8,
                alignItems: "flex-start",
                padding: "7px 9px",
                borderRadius: 7,
                background: cssVar("accent-soft"),
                border: `1px solid ${cssVar("accent")}22`,
              }}
            >
              <span style={{ fontSize: 10, fontWeight: 800, color: cssVar("accent-2"), flexShrink: 0, lineHeight: 1.4 }}>↳</span>
              <span style={{ fontSize: 11.5, fontStyle: "italic", color: cssVar("text-secondary"), lineHeight: 1.4 }}>
                &ldquo;{phrase}&rdquo;
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function SegmentAiInsight({ insight }: { insight: string }): React.ReactElement {
  return (
    <div
      style={{
        padding: "8px 9px",
        borderRadius: radius.md,
        background: cssVar("accent-soft"),
        border: `1px solid ${cssVar("accent")}28`,
        flex: 1,
        display: "flex",
        flexDirection: "column",
        minHeight: 0,
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 4, marginBottom: 4 }}>
        <Sparkles size={11} strokeWidth={2.4} color={cssVar("accent-2")} style={{ flexShrink: 0 }} />
        <span
          style={{
            fontSize: 10,
            fontWeight: 700,
            color: cssVar("accent-2"),
            letterSpacing: "0.04em",
            textTransform: "uppercase",
          }}
        >
          AI · Segment risk
        </span>
      </div>
      <p style={{ margin: 0, fontSize: 11, lineHeight: 1.4, color: cssVar("text-secondary") }}>{insight}</p>
    </div>
  );
}

function SegmentKpiCard({ row }: { row: TrustSegmentMatrixRow }): React.ReactElement {
  const color = WHATS_FAILING_SEGMENT_COLORS[row.code];

  return (
    <div
      style={{
        borderRadius: 8,
        padding: "8px 10px",
        background: cssVar("surface-raised"),
        border: `1px solid ${cssVar("border")}`,
        display: "flex",
        flexDirection: "column",
        gap: 2,
        minHeight: 0,
      }}
    >
      <span style={{ fontSize: 9, fontWeight: 700, letterSpacing: "0.06em", color }}>{row.code}</span>
      <span className="lisn-num" style={{ fontSize: 20, fontWeight: 800, color: cssVar("text-primary"), lineHeight: 1 }}>
        {row.share}%
      </span>
      <span style={{ fontSize: 9, color: cssVar("text-muted") }}>{fmt(row.complaints)} cx</span>
    </div>
  );
}

function SegmentMatrixViz({ matrix }: { matrix: TrustSegmentMatrixRow[] }): React.ReactElement {
  const byCode = Object.fromEntries(matrix.map((m) => [m.code, m])) as Record<
    TrustSegmentMatrixRow["code"],
    TrustSegmentMatrixRow
  >;
  const codes: TrustSegmentMatrixRow["code"][] = ["HVHF", "HVLF", "LVHF", "LVLF"];

  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "1fr 1fr",
        gap: 8,
        height: "100%",
        minHeight: 96,
        alignContent: "center",
      }}
    >
      {codes.map((code) => (
        <SegmentKpiCard key={code} row={byCode[code]} />
      ))}
    </div>
  );
}

function ChannelEvidenceCutTile({ rows }: { rows: TrustChannelCutRow[] }): React.ReactElement {
  const [active, setActive] = useState<(typeof CHANNEL_TABS)[number]["id"]>("Chat");
  const byLabel = Object.fromEntries(rows.map((r) => [r.label, r])) as Record<string, TrustChannelCutRow>;
  const row = byLabel[active] ?? rows[0];
  const color = TRUST_CHANNEL_COLORS[active] ?? cssVar("accent");
  const channelLabel = active === "LinkedIn" ? "Linked in" : active;

  return (
    <PanelCard
      style={{
        padding: "14px 16px",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        minHeight: 200,
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          flexWrap: "wrap",
          gap: "6px 8px",
          marginBottom: 12,
          flexShrink: 0,
        }}
      >
        <MessageSquare size={14} color={cssVar("text-muted")} strokeWidth={2.2} />
        <span style={{ fontSize: 13, fontWeight: 700, color: cssVar("text-primary") }}>By channel</span>
        <div
          style={{
            display: "inline-flex",
            flexWrap: "wrap",
            gap: 4,
            marginLeft: "auto",
          }}
        >
          {CHANNEL_TABS.map(({ id, label }) => {
            const tabColor = TRUST_CHANNEL_COLORS[id] ?? cssVar("accent");
            const isActive = active === id;
            return (
              <button
                key={id}
                type="button"
                onClick={() => setActive(id)}
                style={{
                  border: `1px solid ${isActive ? tabColor : cssVar("border")}`,
                  background: isActive ? `${tabColor}18` : cssVar("surface-raised"),
                  color: isActive ? tabColor : cssVar("text-muted"),
                  fontSize: 10.5,
                  fontWeight: 700,
                  padding: "3px 8px",
                  borderRadius: 6,
                  cursor: "pointer",
                  lineHeight: 1.2,
                }}
              >
                {label}
              </button>
            );
          })}
        </div>
      </div>

      <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 8, minHeight: 0 }}>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "auto 1fr auto",
            gap: 8,
            alignItems: "center",
          }}
        >
          <span style={{ fontSize: 10, fontWeight: 800, color, letterSpacing: "0.04em" }}>{channelLabel}</span>
          <span style={{ fontSize: 9, color: cssVar("text-muted") }}>{fmt(row.complaints)} contacts</span>
          <span className="lisn-num" style={{ fontSize: 11, fontWeight: 800, color, minWidth: 30, textAlign: "right" }}>
            {row.share}%
          </span>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 6, marginTop: 2 }}>
          {row.messages.map((quote, i) => (
            <p
              key={quote}
              style={{
                margin: 0,
                padding: "7px 9px",
                borderRadius: 7,
                background: cssVar("surface-raised"),
                border: `1px solid ${cssVar("border")}`,
                fontSize: 10.5,
                lineHeight: 1.4,
                color: cssVar("text-secondary"),
                fontStyle: "italic",
              }}
            >
              <span style={{ fontStyle: "normal", fontWeight: 700, color: cssVar("text-muted"), marginRight: 6 }}>
                {i + 1}.
              </span>
              &ldquo;{quote}&rdquo;
            </p>
          ))}
        </div>
      </div>
    </PanelCard>
  );
}

function SplitBar({ rows }: { rows: [string, number][] }): React.ReactElement {
  const [a, b] = rows;
  return (
    <div>
      <div
        style={{
          display: "flex",
          height: 30,
          borderRadius: 8,
          overflow: "hidden",
          border: `1px solid ${cssVar("border")}`,
        }}
      >
        <div
          style={{
            width: `${a[1]}%`,
            background: cssVar("severity-high"),
            display: "flex",
            alignItems: "center",
            paddingLeft: 8,
          }}
        >
          <span className="lisn-num" style={{ color: "#fff", fontSize: 12, fontWeight: 600 }}>
            {a[1]}%
          </span>
        </div>
        <div
          style={{
            width: `${b[1]}%`,
            background: cssVar("accent"),
            display: "flex",
            alignItems: "center",
            justifyContent: "flex-end",
            paddingRight: 8,
          }}
        >
          <span className="lisn-num" style={{ color: "#fff", fontSize: 12, fontWeight: 600 }}>
            {b[1]}%
          </span>
        </div>
      </div>
      <div style={{ display: "flex", justifyContent: "space-between", marginTop: 7 }}>
        <span style={{ fontSize: 11.5, color: cssVar("text-secondary"), display: "inline-flex", alignItems: "center", gap: 5 }}>
          <i style={{ width: 8, height: 8, borderRadius: 2, background: cssVar("severity-high") }} />
          {a[0]}
        </span>
        <span style={{ fontSize: 11.5, color: cssVar("text-secondary"), display: "inline-flex", alignItems: "center", gap: 5 }}>
          <i style={{ width: 8, height: 8, borderRadius: 2, background: cssVar("accent") }} />
          {b[0]}
        </span>
      </div>
    </div>
  );
}

function CutTile({
  icon: Icon,
  title,
  children,
}: {
  icon: LucideIcon;
  title: string;
  children: React.ReactNode;
}): React.ReactElement {
  return (
    <PanelCard
      style={{
        padding: "14px 16px",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        minHeight: 200,
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 7, marginBottom: 12, flexShrink: 0 }}>
        <Icon size={14} color={cssVar("text-muted")} strokeWidth={2.2} />
        <span style={{ fontSize: 13, fontWeight: 700, color: cssVar("text-primary") }}>{title}</span>
      </div>
      <div style={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "center", minHeight: 0 }}>{children}</div>
    </PanelCard>
  );
}

export function TrustRangeSelector({
  range,
  onChange,
}: {
  range: TrustRangeKey;
  onChange: (k: TrustRangeKey) => void;
}): React.ReactElement {
  return (
    <div
      style={{
        display: "inline-flex",
        background: cssVar("surface-raised"),
        border: `1px solid ${cssVar("border")}`,
        borderRadius: 9,
        padding: 2,
      }}
    >
      {(Object.keys(TRUST_RANGES) as TrustRangeKey[]).map((k) => (
        <button
          key={k}
          type="button"
          onClick={() => onChange(k)}
          className="lisn-num"
          style={{
            border: 0,
            background: range === k ? cssVar("surface") : "transparent",
            fontSize: 11.5,
            fontWeight: 600,
            color: range === k ? cssVar("accent") : cssVar("text-muted"),
            padding: "5px 10px",
            borderRadius: 7,
            cursor: "pointer",
            boxShadow: range === k ? cssVar("shadow-card") : undefined,
          }}
        >
          {k}
        </button>
      ))}
    </div>
  );
}

export function TrustBreakdownIntelligence({ range }: { range: TrustRangeKey }): React.ReactElement {
  const [selected, setSelected] = useState<TrustDriverId>("damaged");
  const deepRef = useRef<HTMLDivElement>(null);

  const R = TRUST_RANGES[range];
  const scale = (n: number): number => n * R.f;
  const driver = TRUST_DRIVERS.find((d) => d.id === selected) ?? TRUST_DRIVERS[0];
  const cut: TrustDriverCut = TRUST_DRIVER_CUTS[selected];

  const pickDriver = (id: TrustDriverId): void => {
    setSelected(id);
    setTimeout(() => deepRef.current?.scrollIntoView({ behavior: "smooth", block: "start" }), 40);
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 22 }}>
      {/* S1 — Trust KPIs */}
      <section>
        <TrustPulseKpiCards range={range} />
      </section>

      {/* S2 — Why trust breaks */}
      <section>
        <SectionHead
          n="01"
          title={
            <>
              Why trust is <span style={{ color: cssVar("accent") }}>breaking?</span>
            </>
          }
          titleBesideBadge
          right={
            <span style={{ fontSize: 12, color: cssVar("text-muted"), display: "inline-flex", alignItems: "center", gap: 6 }}>
              <Target size={14} strokeWidth={2.2} /> Selected: <b style={{ color: cssVar("text-primary") }}>{driver.label}</b>
            </span>
          }
        />
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: 14 }}>
          {TRUST_DRIVERS.map((d) => {
            const q = QUAD_META[classify(d)];
            const active = d.id === selected;
            const Icon = d.icon;
            return (
              <button
                key={d.id}
                type="button"
                onClick={() => pickDriver(d.id)}
                style={{
                  textAlign: "left",
                  padding: 15,
                  cursor: "pointer",
                  background: cssVar("surface"),
                  border: `1px solid ${active ? cssVar("accent") : cssVar("border")}`,
                  borderRadius: radius.lg,
                  boxShadow: active ? `0 0 0 1px ${cssVar("accent")}, ${cssVar("shadow-card")}` : cssVar("shadow-card"),
                }}
              >
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    gap: 12,
                    height: 32,
                    flexShrink: 0,
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      gap: 10,
                      alignItems: "center",
                      flex: 1,
                      minWidth: 0,
                      overflow: "hidden",
                    }}
                  >
                    <Icon size={18} color={q.color} strokeWidth={2.3} style={{ flexShrink: 0 }} />
                    <span
                      style={{
                        fontSize: 16,
                        fontWeight: 700,
                        color: cssVar("text-primary"),
                        lineHeight: 1,
                        minWidth: 0,
                        flex: 1,
                        whiteSpace: "nowrap",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                      }}
                      title={d.label}
                    >
                      {d.label}
                    </span>
                  </div>
                  <ChevronDown
                    size={16}
                    color={cssVar("text-muted")}
                    strokeWidth={2.4}
                    style={{ transform: active ? "rotate(180deg)" : "none", flexShrink: 0 }}
                  />
                </div>

                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "1fr 1fr",
                    gap: "9px 14px",
                    margin: "6px 0 12px",
                    padding: "10px 0",
                    borderTop: `1px solid ${cssVar("border")}`,
                    borderBottom: `1px solid ${cssVar("border")}`,
                    justifyItems: "center",
                    textAlign: "center",
                  }}
                >
                  <div style={{ display: "flex", flexDirection: "column", alignItems: "center", width: "100%" }}>
                    <span style={{ fontSize: 10.5, color: cssVar("text-muted"), fontWeight: 600 }}>Complaints</span>
                    <div className="lisn-num" style={{ fontSize: 15, fontWeight: 700, color: cssVar("text-primary") }}>
                      {fmt(scale(d.complaints))}
                    </div>
                  </div>
                  <div style={{ display: "flex", flexDirection: "column", alignItems: "center", width: "100%" }}>
                    <span style={{ fontSize: 10.5, color: cssVar("text-muted"), fontWeight: 600 }}>{R.delta}</span>
                    <div style={{ display: "flex", justifyContent: "center" }}>
                      <Delta value={d.wow} good="down" />
                    </div>
                  </div>
                  <div style={{ display: "flex", flexDirection: "column", alignItems: "center", width: "100%" }}>
                    <span style={{ fontSize: 10.5, color: cssVar("text-muted"), fontWeight: 600 }}>Neg. sentiment</span>
                    <div className="lisn-num" style={{ fontSize: 15, fontWeight: 700, color: cssVar("severity-high") }}>
                      {d.sentNeg}%
                    </div>
                  </div>
                  <div style={{ display: "flex", flexDirection: "column", alignItems: "center", width: "100%" }}>
                    <span style={{ fontSize: 10.5, color: cssVar("text-muted"), fontWeight: 600 }}>Repeat contact</span>
                    <div className="lisn-num" style={{ fontSize: 15, fontWeight: 700, color: cssVar("severity-med") }}>
                      {d.repeat}×
                    </div>
                  </div>
                </div>

                <DriverAiHowToDeal points={d.dealPoints} />
              </button>
            );
          })}
        </div>
      </section>

      {/* S3 — Deep dive */}
      <section ref={deepRef} style={{ scrollMarginTop: 24 }}>
        <SectionHead
          n="02"
          titleBesideBadge
          title={
            <>
              Driver deep-dive · <span style={{ color: cssVar("accent") }}>{driver.label}</span>
            </>
          }
          right={
            <div style={{ display: "flex", gap: 6, flexWrap: "wrap", justifyContent: "flex-end" }}>
              <span
                className="lisn-num"
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 5,
                  fontSize: 11.5,
                  fontWeight: 600,
                  padding: "4px 9px",
                  borderRadius: 8,
                  background: cssVar("surface-raised"),
                  border: `1px solid ${cssVar("border")}`,
                }}
              >
                {fmt(scale(driver.complaints))} complaints
              </span>
              <span style={{ display: "inline-flex", alignItems: "center", gap: 5, fontSize: 11.5, padding: "4px 9px", borderRadius: 8, background: cssVar("surface-raised"), border: `1px solid ${cssVar("border")}` }}>
                {R.delta} <Delta value={driver.wow} good="down" />
              </span>
              <span
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 5,
                  fontSize: 11.5,
                  padding: "4px 9px",
                  borderRadius: 8,
                  background: cssVar("accent-soft"),
                  border: `1px solid ${cssVar("accent")}44`,
                  color: cssVar("accent-2"),
                }}
              >
                {driver.sentNeg}% neg · {driver.conf}%
              </span>
            </div>
          }
        />

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(3, minmax(0, 1fr))",
            gridTemplateRows: "repeat(2, minmax(200px, auto))",
            gap: 14,
            alignItems: "stretch",
          }}
        >
          <CutTile icon={Layers} title="By category">
            <DonutChart
              rows={cut.category}
              colors={[cssVar("accent"), cssVar("accent-2"), cssVar("severity-med"), cssVar("severity-high"), cssVar("text-muted")]}
            />
          </CutTile>
          <CutTile icon={Tag} title="By seller type">
            <SplitBar rows={cut.seller} />
          </CutTile>
          <CutTile icon={MapPin} title="By region · pincode">
            <RegionBarChart rows={cut.region} accent={cssVar("severity-high")} />
          </CutTile>
          <CutTile icon={Truck} title="By fulfilment path">
            <PathFlowViz
              rows={cut.path}
              colors={[cssVar("severity-med"), cssVar("accent"), cssVar("accent-2")]}
            />
          </CutTile>
          <CutTile icon={Users} title="By customer segment">
            <SegmentMatrixViz matrix={cut.segmentMatrix} />
          </CutTile>
          <ChannelEvidenceCutTile rows={cut.channel} />
        </div>
      </section>

      {/* S4 — Segments */}
      <section>
        <SectionHead
          n="03"
          titleBesideBadge
          title={
            <>
              Trust impact by <span style={{ color: cssVar("accent") }}>customer segment</span>
            </>
          }
        />
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
            gap: 14,
            alignItems: "stretch",
          }}
        >
          {TRUST_SEGMENTS.map((s) => (
            <PanelCard
              key={s.label}
              style={{
                padding: 14,
                display: "flex",
                flexDirection: "column",
                gap: 8,
                height: "100%",
              }}
            >
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "minmax(0, 1fr) auto",
                  gridTemplateRows: "auto auto",
                  columnGap: 10,
                  rowGap: 6,
                  alignItems: "center",
                }}
              >
                <span
                  style={{
                    fontSize: 13,
                    fontWeight: 700,
                    color: cssVar("text-primary"),
                    lineHeight: 1.25,
                    gridColumn: 1,
                    gridRow: 1,
                  }}
                >
                  {s.label}
                </span>
                <span
                  style={{
                    gridColumn: 2,
                    gridRow: 1,
                    justifySelf: "end",
                    whiteSpace: "nowrap",
                  }}
                >
                  <Delta value={s.wow} good="down" label={R.delta} />
                </span>
                <div
                  style={{
                    display: "flex",
                    alignItems: "baseline",
                    gap: 5,
                    gridColumn: 1,
                    gridRow: 2,
                    minWidth: 0,
                  }}
                >
                  <span
                    className="lisn-num"
                    style={{ fontSize: 24, fontWeight: 700, color: cssVar("text-primary"), lineHeight: 1 }}
                  >
                    {fmt(scale(s.affected))}
                  </span>
                  <span style={{ fontSize: 10, color: cssVar("text-muted") }}>affected</span>
                </div>
              </div>
              <SegmentAiInsight insight={s.aiInsight} />
            </PanelCard>
          ))}
        </div>
      </section>

      {/* S5 — Evidence */}
      <section>
        <SectionHead
          n="04"
          titleBesideBadge
          title={
            <>
              Evidence & <span style={{ color: cssVar("accent") }}>explainability</span>
            </>
          }
        />
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
            gap: 16,
            alignItems: "stretch",
          }}
        >
          <PanelCard
            style={{
              padding: 18,
              height: "100%",
              display: "flex",
              flexDirection: "column",
              background: `linear-gradient(180deg, ${cssVar("surface")}, ${cssVar("accent-soft")})`,
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 8,
                marginBottom: 12,
                minHeight: 28,
                flexShrink: 0,
                width: "100%",
              }}
            >
              <Sparkles size={16} color={cssVar("accent-2")} strokeWidth={2.4} />
              <span style={{ fontSize: 13.5, fontWeight: 700, color: cssVar("text-primary") }}>AI summary</span>
              <span style={{ marginLeft: "auto" }}>
                <InferredChip conf={TRUST_PULSE.modelConfidence} small />
              </span>
            </div>
            <TrustAiSummaryBody />
            <div
              style={{
                marginTop: "auto",
                paddingTop: 14,
                borderTop: `1px solid ${cssVar("border")}`,
                display: "grid",
                gap: 10,
                flexShrink: 0,
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", fontSize: 12, gap: 12 }}>
                <span style={{ color: cssVar("text-muted"), flexShrink: 0 }}>Signal type</span>
                <b style={{ color: cssVar("accent-2"), textAlign: "right" }}>Inference</b>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", fontSize: 12, gap: 12 }}>
                <span style={{ color: cssVar("text-muted"), flexShrink: 0 }}>Sources used</span>
                <b style={{ textAlign: "right" }}>Chat · Email · Voice · Tickets · X</b>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", fontSize: 12, gap: 12 }}>
                <span style={{ color: cssVar("text-muted"), flexShrink: 0 }}>Missing validation</span>
                <b style={{ color: cssVar("severity-high"), textAlign: "right" }}>CSAT &amp; Relational NPS</b>
              </div>
            </div>
          </PanelCard>

          <PanelCard style={{ padding: 18, height: "100%", display: "flex", flexDirection: "column" }}>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 8,
                marginBottom: 12,
                minHeight: 28,
                flexShrink: 0,
              }}
            >
              <MessageSquare size={16} color={cssVar("accent-2")} strokeWidth={2.4} />
              <span style={{ fontSize: 13.5, fontWeight: 700, color: cssVar("text-primary") }}>Real interaction evidence</span>
            </div>
            <div style={{ display: "flex", flexDirection: "column", flex: 1, minHeight: 0 }}>
              {TRUST_EVIDENCE.map((e, i) => {
                const Icon = e.icon;
                return (
                  <div
                    key={`${e.src}-${e.tag}`}
                    style={{
                      display: "flex",
                      gap: 11,
                      padding: "12px 0",
                      flex: 1,
                      alignItems: "flex-start",
                      borderTop: i > 0 ? `1px solid ${cssVar("border")}` : undefined,
                    }}
                  >
                    <div
                      style={{
                        width: 30,
                        height: 30,
                        borderRadius: 8,
                        background: cssVar("surface-raised"),
                        border: `1px solid ${cssVar("border")}`,
                        display: "grid",
                        placeItems: "center",
                        flexShrink: 0,
                      }}
                    >
                      <Icon size={15} color={cssVar("text-muted")} strokeWidth={2.2} />
                    </div>
                    <div style={{ minWidth: 0, flex: 1 }}>
                      <div
                        style={{
                          display: "flex",
                          alignItems: "flex-start",
                          justifyContent: "space-between",
                          gap: 10,
                          flexWrap: "wrap",
                        }}
                      >
                        <p style={{ margin: 0, fontSize: 13, lineHeight: 1.45, color: cssVar("text-primary"), fontStyle: "italic", flex: 1, minWidth: 0 }}>
                          &ldquo;{e.quote}&rdquo;
                        </p>
                        <span
                          style={{
                            fontSize: 10.5,
                            fontWeight: 700,
                            color: cssVar("accent"),
                            background: cssVar("accent-soft"),
                            borderRadius: 6,
                            padding: "2px 7px",
                            flexShrink: 0,
                            alignSelf: "flex-start",
                          }}
                        >
                          {e.src}
                        </span>
                      </div>
                      <span style={{ display: "block", marginTop: 5, fontSize: 11, color: cssVar("text-muted") }}>{e.tag}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </PanelCard>
        </div>
      </section>

      {/* S6 — Actions */}
      <section>
        <SectionHead
          n="05"
          titleBesideBadge
          title={
            <>
              Recommended <span style={{ color: cssVar("accent") }}>actions</span>
            </>
          }
        />
        <PanelCard style={{ padding: 0, overflow: "hidden" }}>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "minmax(0, 1.3fr) minmax(0, 1.5fr) minmax(0, 1fr) minmax(0, 1.7fr) auto",
              gap: 14,
              alignItems: "center",
              padding: "12px 18px",
              background: cssVar("surface-raised"),
              borderBottom: `1px solid ${cssVar("border")}`,
            }}
          >
            {["Trust issue", "Root-cause signal", "Owner team", "Suggested action", ""].map((label) => (
              <span
                key={label || "action"}
                style={{
                  fontSize: 10.5,
                  fontWeight: 700,
                  letterSpacing: "0.06em",
                  textTransform: "uppercase",
                  color: cssVar("text-muted"),
                }}
              >
                {label}
              </span>
            ))}
          </div>
          {TRUST_ACTIONS.map((a, i) => {
            const btnColor =
              a.kind === "Escalate"
                ? cssVar("severity-high")
                : a.kind === "Act now"
                  ? cssVar("positive")
                  : cssVar("accent");
            return (
              <div
                key={a.issue}
                style={{
                  display: "grid",
                  gridTemplateColumns: "minmax(0, 1.3fr) minmax(0, 1.5fr) minmax(0, 1fr) minmax(0, 1.7fr) auto",
                  gap: 14,
                  padding: "13px 18px",
                  borderBottom: i < TRUST_ACTIONS.length - 1 ? `1px solid ${cssVar("border")}` : undefined,
                  alignItems: "center",
                }}
              >
                <span style={{ fontWeight: 600, color: cssVar("text-primary"), fontSize: 12.5, lineHeight: 1.4 }}>{a.issue}</span>
                <span style={{ color: cssVar("text-secondary"), fontSize: 12.5, lineHeight: 1.4 }}>{a.cause}</span>
                <span>
                  <span
                    style={{
                      display: "inline-flex",
                      fontSize: 11,
                      fontWeight: 700,
                      color: cssVar("accent"),
                      background: cssVar("accent-soft"),
                      borderRadius: 6,
                      padding: "3px 8px",
                      lineHeight: 1.3,
                      whiteSpace: "nowrap",
                    }}
                  >
                    {a.team}
                  </span>
                </span>
                <span style={{ color: cssVar("text-secondary"), fontSize: 12.5, lineHeight: 1.4 }}>{a.action}</span>
                <span
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: 5,
                    border: `1px solid ${btnColor}55`,
                    background: `${btnColor}14`,
                    color: btnColor,
                    fontSize: 11.5,
                    fontWeight: 700,
                    padding: "6px 10px",
                    borderRadius: 8,
                    whiteSpace: "nowrap",
                    justifySelf: "end",
                  }}
                >
                  {a.kind} <ArrowRight size={13} strokeWidth={2.6} />
                </span>
              </div>
            );
          })}
        </PanelCard>
      </section>
    </div>
  );
}
