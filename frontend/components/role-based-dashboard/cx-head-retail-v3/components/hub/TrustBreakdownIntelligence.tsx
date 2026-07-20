"use client";

import React, { useEffect, useState } from "react";
import {
  Sparkles,
  AlertTriangle,
  ArrowRight,
  ArrowUpRight,
  ArrowDownRight,
  Users,
  MessageSquare,
  MapPin,
  Layers,
  Target,
  ChevronLeft,
  ChevronRight,
  Store,
  type LucideIcon,
} from "lucide-react";
import {
  TRUST_ACTIONS,
  TRUST_DRIVERS,
  TRUST_DRIVER_CUTS,
  TRUST_EVIDENCE,
  TRUST_RANGES,
  TOP_TRUST_DRIVER,
  getTrustPulse,
  scaleTrustCount,
  scaleTrustCrLabel,
  scaleTrustDelta,
  scaleTrustDriverCut,
  sortDriversBySeverity,
  type TrustCategoryCutRow,
  type TrustChannelCutRow,
  type TrustDriver,
  type TrustDriverCut,
  type TrustDriverId,
  type TrustRangeKey,
  type TrustSegmentMatrixRow,
  type TrustSellerSkuCutRow,
} from "../../lib/cxHeadRetailV3TrustBreakdownData";
import { WHATS_FAILING_CHANNEL_COLORS, WHATS_FAILING_SEGMENT_COLORS } from "../../lib/cxHeadRetailV3CustomerFciData";
import { TrustStageLifecyclePie } from "./TrustStageLifecyclePie";
import { TrustLifecycleMatrix } from "./TrustLifecycleMatrix";
import { ConfidenceChip } from "../common/ConfidenceBand";
import { DraftActionFooter } from "../common/DraftActionFooter";
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

function driverIconColor(d: TrustDriver): string {
  return d.cliffOrSlope === "cliff" ? cssVar("severity-high") : cssVar("accent");
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

function RegionBarChart({ rows, accent }: { rows: [string, number][]; accent: string }): React.ReactElement {
  const ranked = [...rows].sort((a, b) => b[1] - a[1]);
  const max = Math.max(...ranked.map((r) => r[1]), 1);

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        height: "100%",
        minHeight: 0,
        gap: 3,
      }}
    >
      {ranked.map(([k, v], index) => {
        const isPrimary = index === 0;
        return (
          <div
            key={k}
            style={{
              display: "grid",
              gridTemplateColumns: "minmax(0, 1.05fr) minmax(48px, 1fr) auto",
              gap: 8,
              alignItems: "center",
              padding: isPrimary ? "5px 8px" : "3px 4px",
              borderRadius: 7,
              flex: "1 1 0",
              minHeight: 0,
              background: isPrimary
                ? `color-mix(in srgb, ${accent} 12%, ${cssVar("surface-raised")})`
                : "transparent",
              border: isPrimary ? `1px solid ${accent}40` : "1px solid transparent",
              borderLeft: isPrimary ? `3px solid ${accent}` : "3px solid transparent",
            }}
          >
            <span
              style={{
                fontSize: isPrimary ? 11.5 : 11,
                fontWeight: isPrimary ? 700 : 600,
                color: cssVar("text-primary"),
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
              }}
            >
              {k}
            </span>
            <div
              style={{
                height: isPrimary ? 7 : 5,
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
                  opacity: isPrimary ? 1 : 0.85,
                }}
              />
            </div>
            <span
              className="lisn-num"
              style={{
                fontSize: isPrimary ? 13 : 11,
                fontWeight: 800,
                color: isPrimary ? accent : cssVar("text-primary"),
                width: 32,
                textAlign: "right",
              }}
            >
              {v}%
            </span>
          </div>
        );
      })}
    </div>
  );
}

function allocateToHundred(weights: number[]): number[] {
  const total = weights.reduce((sum, w) => sum + w, 0);
  if (total <= 0 || weights.length === 0) return weights.map(() => 0);

  const exact = weights.map((w) => (w / total) * 100);
  const floored = exact.map((v) => Math.floor(v));
  let remainder = 100 - floored.reduce((sum, v) => sum + v, 0);
  const byFrac = exact
    .map((v, i) => ({ i, frac: v - floored[i]! }))
    .sort((a, b) => b.frac - a.frac);

  const result = [...floored];
  for (let n = 0; n < remainder; n++) {
    const slot = byFrac[n % byFrac.length];
    if (slot) result[slot.i] = (result[slot.i] ?? 0) + 1;
  }
  return result;
}

function CategoryCutTable({
  rows,
  colors,
  periodLabel,
}: {
  rows: TrustCategoryCutRow[];
  colors: string[];
  periodLabel: string;
}): React.ReactElement {
  const ranked = [...rows].sort((a, b) => b.share - a.share);
  const negSplit = allocateToHundred(ranked.map((r) => r.complaints * r.negSentiment));

  const th: React.CSSProperties = {
    fontSize: 9.5,
    fontWeight: 700,
    letterSpacing: "0.05em",
    textTransform: "uppercase",
    color: cssVar("text-muted"),
    lineHeight: 1.1,
    whiteSpace: "nowrap",
  };

  const tdNum: React.CSSProperties = {
    fontSize: 12,
    lineHeight: 1.2,
    textAlign: "right",
    fontVariantNumeric: "tabular-nums",
    whiteSpace: "nowrap",
  };

  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "minmax(0, 1.35fr) minmax(0, 0.85fr) minmax(0, 0.7fr) minmax(0, 0.7fr) minmax(0, 0.7fr)",
        columnGap: 10,
        rowGap: 0,
        alignItems: "center",
        height: "100%",
        minHeight: 0,
        alignContent: "stretch",
      }}
    >
      <span style={th}>Category</span>
      <span style={{ ...th, textAlign: "right" }}>Contacts</span>
      <span style={{ ...th, textAlign: "right" }}>{periodLabel}</span>
      <span style={{ ...th, textAlign: "right" }}>Neg</span>
      <span style={{ ...th, textAlign: "right" }}>Share</span>

      <div
        style={{
          gridColumn: "1 / -1",
          height: 1,
          background: cssVar("border"),
          margin: "6px 0 4px",
        }}
      />

      {ranked.map((row, i) => {
        const color = colors[i % colors.length]!;
        const negPct = negSplit[i] ?? 0;
        return (
          <React.Fragment key={row.label}>
            <span
              style={{
                display: "flex",
                alignItems: "center",
                gap: 6,
                fontSize: 12,
                fontWeight: 650,
                lineHeight: 1.25,
                color: cssVar("text-primary"),
                minWidth: 0,
                padding: "7px 0",
              }}
            >
              <i style={{ width: 7, height: 7, borderRadius: 99, background: color, flexShrink: 0 }} />
              <span style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{row.label}</span>
            </span>
            <span className="lisn-num" style={{ ...tdNum, fontWeight: 700, color: cssVar("text-primary"), padding: "7px 0" }}>
              {fmt(row.complaints)}
            </span>
            <span
              className="lisn-num"
              style={{
                ...tdNum,
                fontWeight: 700,
                color: row.wow >= 0 ? cssVar("severity-high") : cssVar("positive"),
                padding: "7px 0",
              }}
            >
              {row.wow >= 0 ? "+" : ""}
              {row.wow}%
            </span>
            <span className="lisn-num" style={{ ...tdNum, fontWeight: 700, color: cssVar("accent-2"), padding: "7px 0" }}>
              {negPct}%
            </span>
            <span className="lisn-num" style={{ ...tdNum, fontWeight: 800, color: cssVar("text-primary"), padding: "7px 0" }}>
              {row.share}%
            </span>
          </React.Fragment>
        );
      })}
    </div>
  );
}

function TrustAiSummaryBody({ range }: { range: TrustRangeKey }): React.ReactElement {
  const pulse = getTrustPulse(range);
  const periodLabel = TRUST_RANGES[range].delta;
  const primaryDrivers = (
    ["damaged", "refund"] as const
  ).map((id) => TRUST_DRIVERS.find((d) => d.id === id))
    .filter((d): d is TrustDriver => d !== undefined);
  const phrases = TRUST_EVIDENCE.slice(0, 3).map((e) => e.quote);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 14, flex: 1, minHeight: 0 }}>
      <p style={{ margin: 0, fontSize: 14, fontWeight: 700, lineHeight: 1.45, color: cssVar("text-primary") }}>
        {pulse.verdict}
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
                {fmt(scaleTrustCount(d.complaints, range))} contacts · +{Math.round(scaleTrustDelta(d.wow, range))}% {periodLabel} · {d.sentNeg}% neg
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

const SEGMENT_CODE_LABEL: Record<TrustSegmentMatrixRow["code"], string> = {
  HVHF: "High-value · high-frequency",
  HVLF: "High-value · low-frequency",
  LVHF: "Low-value · high-frequency",
  LVLF: "Low-value · low-frequency",
};

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
      title={SEGMENT_CODE_LABEL[row.code]}
    >
      <span style={{ fontSize: 9.5, fontWeight: 700, letterSpacing: "0.02em", color, lineHeight: 1.3 }}>
        {SEGMENT_CODE_LABEL[row.code]}
      </span>
      <span className="lisn-num" style={{ fontSize: 20, fontWeight: 800, color: cssVar("text-primary"), lineHeight: 1, marginTop: 2 }}>
        {row.share}%
      </span>
      <span style={{ fontSize: 9, color: cssVar("text-muted") }}>{fmt(row.complaints)} contacts</span>
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
        alignContent: "stretch",
        flex: 1,
        minHeight: 0,
      }}
    >
      {codes.map((code) => (
        <SegmentKpiCard key={code} row={byCode[code]} />
      ))}
    </div>
  );
}

function SplitBar({ rows }: { rows: [string, number][] }): React.ReactElement | null {
  if (rows.length < 2) return null;
  const a = rows[0]!;
  const b = rows[1]!;
  return (
    <div style={{ flexShrink: 0 }}>
      <div
        style={{
          display: "flex",
          height: 28,
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
          <span className="lisn-num" style={{ color: "#fff", fontSize: 12, fontWeight: 700 }}>
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
          <span className="lisn-num" style={{ color: "#fff", fontSize: 12, fontWeight: 700 }}>
            {b[1]}%
          </span>
        </div>
      </div>
      <div style={{ display: "flex", justifyContent: "space-between", marginTop: 6, gap: 8 }}>
        <span style={{ fontSize: 11, color: cssVar("text-secondary"), display: "inline-flex", alignItems: "center", gap: 5, minWidth: 0 }}>
          <i style={{ width: 8, height: 8, borderRadius: 2, background: cssVar("severity-high"), flexShrink: 0 }} />
          <span style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{a[0]}</span>
        </span>
        <span style={{ fontSize: 11, color: cssVar("text-secondary"), display: "inline-flex", alignItems: "center", gap: 5, minWidth: 0 }}>
          <i style={{ width: 8, height: 8, borderRadius: 2, background: cssVar("accent"), flexShrink: 0 }} />
          <span style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{b[0]}</span>
        </span>
      </div>
    </div>
  );
}

/** Seller-type mix + segment 2×2 in one deep-breakdown card. */
function SellerTypeSegmentCutTile({
  seller,
  segmentMatrix,
}: {
  seller: [string, number][];
  segmentMatrix: TrustSegmentMatrixRow[];
}): React.ReactElement {
  return (
    <PanelCard
      style={{
        padding: "12px 12px",
        height: "100%",
        width: "100%",
        display: "flex",
        flexDirection: "column",
        gap: 10,
        minHeight: 0,
        boxSizing: "border-box",
        overflow: "hidden",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 7, flexShrink: 0 }}>
        <Users size={14} color={cssVar("text-muted")} strokeWidth={2.2} />
        <span style={{ fontSize: 13, fontWeight: 700, color: cssVar("text-primary") }}>
          Customer segment
        </span>
        <span style={{ fontSize: 10, fontWeight: 700, color: cssVar("text-muted"), marginLeft: "auto" }}>
          + seller type
        </span>
      </div>

      <div style={{ flexShrink: 0 }}>
        <div
          style={{
            fontSize: 9.5,
            fontWeight: 700,
            letterSpacing: "0.04em",
            textTransform: "uppercase",
            color: cssVar("text-muted"),
            marginBottom: 6,
          }}
        >
          By seller type
        </div>
        <SplitBar rows={seller} />
      </div>

      <div
        style={{
          height: 1,
          background: cssVar("border"),
          flexShrink: 0,
        }}
      />

      <div style={{ flex: 1, minHeight: 0, display: "flex", flexDirection: "column", gap: 6 }}>
        <div
          style={{
            fontSize: 9.5,
            fontWeight: 700,
            letterSpacing: "0.04em",
            textTransform: "uppercase",
            color: cssVar("text-muted"),
            flexShrink: 0,
          }}
        >
          By customer segment
        </div>
        <SegmentMatrixViz matrix={segmentMatrix} />
      </div>
    </PanelCard>
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
        padding: "12px 12px",
        height: "100%",
        width: "100%",
        display: "flex",
        flexDirection: "column",
        minHeight: 0,
        boxSizing: "border-box",
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          flexWrap: "wrap",
          gap: "6px 8px",
          marginBottom: 10,
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

      <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 6, minHeight: 0, overflow: "hidden" }}>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "auto 1fr auto",
            gap: 8,
            alignItems: "center",
            flexShrink: 0,
          }}
        >
          <span style={{ fontSize: 11, fontWeight: 800, color, letterSpacing: "0.04em" }}>{channelLabel}</span>
          <span style={{ fontSize: 10, color: cssVar("text-muted") }}>{fmt(row.complaints)} contacts</span>
          <span className="lisn-num" style={{ fontSize: 13, fontWeight: 800, color, minWidth: 32, textAlign: "right" }}>
            {row.share}%
          </span>
        </div>

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            flex: 1,
            minHeight: 0,
            gap: 5,
          }}
        >
          {row.messages.map((quote, i) => (
            <p
              key={`${active}-${i}-${quote.slice(0, 24)}`}
              style={{
                margin: 0,
                padding: "9px 11px",
                borderRadius: 8,
                background: cssVar("surface-raised"),
                border: `1px solid ${cssVar("border")}`,
                fontSize: 12.5,
                lineHeight: 1.4,
                color: cssVar("text-primary"),
                fontStyle: "italic",
                flex: "1 1 0",
                minHeight: 0,
                display: "flex",
                alignItems: "center",
              }}
            >
              <span style={{ fontStyle: "normal", fontWeight: 800, color, marginRight: 7, flexShrink: 0 }}>
                {i + 1}.
              </span>
              <span style={{ minWidth: 0 }}>&ldquo;{quote}&rdquo;</span>
            </p>
          ))}
        </div>
      </div>
    </PanelCard>
  );
}

function SellerSkuCutTile({ rows }: { rows: TrustSellerSkuCutRow[] }): React.ReactElement | null {
  if (rows.length === 0) return null;

  const ranked = [...rows].sort((a, b) => b.share - a.share);

  return (
    <PanelCard
      style={{
        padding: "12px 12px",
        height: "100%",
        width: "100%",
        display: "flex",
        flexDirection: "column",
        gap: 8,
        minHeight: 0,
        boxSizing: "border-box",
        overflow: "hidden",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 8, flexShrink: 0 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 7, minWidth: 0 }}>
          <Store size={14} color={cssVar("text-muted")} strokeWidth={2.2} />
          <span style={{ fontSize: 13, fontWeight: 700, color: cssVar("text-primary") }}>Flagged sellers</span>
        </div>
        <span style={{ fontSize: 10, fontWeight: 700, color: cssVar("severity-high"), whiteSpace: "nowrap" }}>
          {ranked.length} sellers
        </span>
      </div>

      <div
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          flex: 1,
          minHeight: 0,
          overflow: "hidden",
          gap: 4,
        }}
      >
        {ranked.map((r, index) => {
          const isPrimary = index === 0;
          return (
            <div
              key={r.sellerId}
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                gap: 10,
                padding: "8px 10px",
                borderRadius: 8,
                flex: "1 1 0",
                minHeight: 0,
                background: isPrimary
                  ? `color-mix(in srgb, ${cssVar("severity-high")} 10%, ${cssVar("surface-raised")})`
                  : cssVar("surface-raised"),
                border: `1px solid ${isPrimary ? `${cssVar("severity-high")}44` : cssVar("border")}`,
                borderLeft: `3px solid ${isPrimary ? cssVar("severity-high") : cssVar("border")}`,
              }}
            >
              <div
                style={{
                  minWidth: 0,
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                  flex: 1,
                }}
              >
                <div
                  style={{
                    fontSize: isPrimary ? 12.5 : 12,
                    fontWeight: isPrimary ? 800 : 700,
                    color: cssVar("text-primary"),
                    lineHeight: 1.25,
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap",
                    minWidth: 0,
                    flexShrink: 1,
                  }}
                >
                  {r.sellerName}
                </div>
                <span
                  style={{
                    flexShrink: 0,
                    fontSize: 10,
                    fontWeight: 700,
                    color: cssVar("text-secondary"),
                    padding: "2px 7px",
                    borderRadius: radius.pill,
                    background: cssVar("surface"),
                    border: `1px solid ${cssVar("border")}`,
                    whiteSpace: "nowrap",
                  }}
                >
                  {r.category}
                </span>
              </div>
              <span
                className="lisn-num"
                style={{
                  fontSize: isPrimary ? 15 : 13,
                  fontWeight: 800,
                  color: isPrimary ? cssVar("severity-high") : cssVar("text-primary"),
                  flexShrink: 0,
                }}
              >
                {r.share}%
              </span>
            </div>
          );
        })}
      </div>
    </PanelCard>
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
        padding: "12px 12px",
        height: "100%",
        width: "100%",
        display: "flex",
        flexDirection: "column",
        minHeight: 0,
        boxSizing: "border-box",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 7, marginBottom: 10, flexShrink: 0 }}>
        <Icon size={14} color={cssVar("text-muted")} strokeWidth={2.2} />
        <span style={{ fontSize: 13, fontWeight: 700, color: cssVar("text-primary") }}>{title}</span>
      </div>
      <div style={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "center", minHeight: 0 }}>{children}</div>
    </PanelCard>
  );
}

function TrustDriverCard({
  d,
  scale,
  periodLabel,
  range,
  laneAccent,
}: {
  d: TrustDriver;
  scale: (n: number) => number;
  periodLabel: string;
  range: TrustRangeKey;
  laneAccent?: string;
}): React.ReactElement {
  const Icon = d.icon;
  const edge = laneAccent ?? (d.cliffOrSlope === "cliff" ? cssVar("severity-high") : cssVar("severity-med"));

  return (
    <div
      style={{
        textAlign: "left",
        padding: 15,
        background: cssVar("surface"),
        border: `1px solid ${edge}55`,
        borderRadius: radius.lg,
        boxShadow: cssVar("shadow-card"),
        display: "flex",
        flexDirection: "column",
        gap: 10,
        fontFamily: "inherit",
        width: "100%",
        maxWidth: 360,
        boxSizing: "border-box",
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
          gap: 10,
          minHeight: 32,
          flexShrink: 0,
        }}
      >
        <div style={{ display: "flex", gap: 10, alignItems: "center", flex: 1, minWidth: 0 }}>
          <Icon size={18} color={driverIconColor(d)} strokeWidth={2.3} style={{ flexShrink: 0 }} />
          <span
            style={{
              fontSize: 16,
              fontWeight: 700,
              color: cssVar("text-primary"),
              lineHeight: 1.2,
              minWidth: 0,
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
            }}
            title={d.label}
          >
            {d.label}
          </span>
          <span style={{ marginLeft: "auto", flexShrink: 0 }}>
            <ConfidenceChip conf={d.confidence} small />
          </span>
        </div>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 6, width: "100%" }}>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: 6,
            width: "100%",
          }}
        >
          {(
            [
              {
                label: "Blast rate",
                value: String(d.blastRadius),
                color: cssVar("severity-high"),
              },
              {
                label: "Incident rate",
                value: `${d.incidentRate}%`,
                color: cssVar("severity-med"),
              },
            ] as const
          ).map((item) => (
            <div
              key={item.label}
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                gap: 3,
                padding: "7px 8px",
                borderRadius: radius.md,
                border: `1px solid ${cssVar("border")}`,
                background: cssVar("surface-raised"),
                minWidth: 0,
                boxSizing: "border-box",
              }}
            >
              <span
                style={{
                  fontSize: 9,
                  fontWeight: 700,
                  letterSpacing: "0.04em",
                  textTransform: "uppercase",
                  color: cssVar("text-muted"),
                  whiteSpace: "nowrap",
                }}
              >
                {item.label}
              </span>
              <span
                className="lisn-num"
                style={{
                  fontSize: 13,
                  fontWeight: 800,
                  color: item.color,
                  lineHeight: 1.15,
                  textAlign: "center",
                }}
              >
                {item.value}
              </span>
            </div>
          ))}
        </div>

        <div
          title={`${d.originationStage} → ${d.fixOwner}`}
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            gap: 3,
            padding: "7px 10px",
            borderRadius: radius.md,
            border: `1px solid ${cssVar("border")}`,
            background: cssVar("surface-raised"),
            width: "100%",
            boxSizing: "border-box",
          }}
        >
          <span
            style={{
              fontSize: 9,
              fontWeight: 700,
              letterSpacing: "0.04em",
              textTransform: "uppercase",
              color: cssVar("text-muted"),
            }}
          >
            Owner
          </span>
          <span
            style={{
              fontSize: 12,
              fontWeight: 700,
              color: cssVar("text-primary"),
              lineHeight: 1.25,
              textAlign: "center",
              whiteSpace: "normal",
            }}
          >
            {d.fixOwner}
          </span>
        </div>
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: "9px 14px",
          margin: "2px 0 4px",
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
          <span style={{ fontSize: 10.5, color: cssVar("text-muted"), fontWeight: 600 }}>{periodLabel}</span>
          <div style={{ display: "flex", justifyContent: "center" }}>
            <Delta value={Math.round(scaleTrustDelta(d.wow, range))} good="down" />
          </div>
        </div>
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", width: "100%" }}>
          <span style={{ fontSize: 10.5, color: cssVar("text-muted"), fontWeight: 600 }}>Neg. sentiment</span>
          <div className="lisn-num" style={{ fontSize: 15, fontWeight: 700, color: cssVar("severity-high") }}>
            {d.sentNeg}%
          </div>
        </div>
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", width: "100%" }}>
          <span style={{ fontSize: 10.5, color: cssVar("text-muted"), fontWeight: 600 }}>GMV exposure</span>
          <div
            className="lisn-num"
            style={{ fontSize: 15, fontWeight: 800, color: cssVar("severity-high") }}
            title={d.pnlMetric}
          >
            {scaleTrustCrLabel(d.pnlValue, range)}
          </div>
        </div>
      </div>

      <DriverAiHowToDeal points={d.dealPoints} />
    </div>
  );
}

function DriverLaneHeader({
  label,
  accent,
  index,
  total,
  onPrev,
  onNext,
}: {
  label: string;
  accent: string;
  index: number;
  total: number;
  onPrev: () => void;
  onNext: () => void;
}): React.ReactElement {
  const canPrev = index > 0;
  const canNext = index < total - 1;

  const navBtn = (dir: "prev" | "next"): React.CSSProperties => ({
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    width: 34,
    height: 34,
    borderRadius: 9,
    border: `1px solid ${cssVar("border")}`,
    background: cssVar("surface-raised"),
    color: (dir === "prev" ? canPrev : canNext) ? accent : cssVar("text-muted"),
    cursor: (dir === "prev" ? canPrev : canNext) ? "pointer" : "default",
    opacity: (dir === "prev" ? canPrev : canNext) ? 1 : 0.35,
    flexShrink: 0,
    padding: 0,
    fontFamily: "inherit",
  });

  return (
    <div style={{ display: "flex", alignItems: "center", gap: 8, minHeight: 34 }}>
      <span
        style={{
          fontSize: 12,
          fontWeight: 800,
          letterSpacing: "0.05em",
          textTransform: "uppercase",
          color: accent,
          flexShrink: 0,
        }}
      >
        {label}
      </span>
      <span style={{ fontSize: 11, color: cssVar("text-muted"), flexShrink: 0 }}>
        {index + 1} / {total}
      </span>
      <div style={{ flex: 1, height: 1, background: cssVar("border") }} />
      <div style={{ display: "inline-flex", alignItems: "center", gap: 6 }}>
        <button type="button" aria-label={`Previous ${label}`} disabled={!canPrev} onClick={onPrev} style={navBtn("prev")}>
          <ChevronLeft size={18} strokeWidth={2.4} />
        </button>
        <button type="button" aria-label={`Next ${label}`} disabled={!canNext} onClick={onNext} style={navBtn("next")}>
          <ChevronRight size={18} strokeWidth={2.4} />
        </button>
      </div>
    </div>
  );
}

function DeepBreakdownHeader({ accent }: { accent: string }): React.ReactElement {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 8, minHeight: 34 }}>
      <span
        style={{
          fontSize: 12,
          fontWeight: 800,
          letterSpacing: "0.05em",
          textTransform: "uppercase",
          color: accent,
          flexShrink: 0,
        }}
      >
        Event Breakdown
      </span>
      <div style={{ flex: 1, height: 1, background: cssVar("border") }} />
    </div>
  );
}

function DriverDeepDivePanel({
  cut,
  periodLabel,
}: {
  cut: TrustDriverCut;
  periodLabel: string;
}): React.ReactElement {
  const tiles: React.ReactNode[] = [
    <SellerSkuCutTile key="seller-sku" rows={cut.sellerSku} />,
    <SellerTypeSegmentCutTile key="seller-segment" seller={cut.seller} segmentMatrix={cut.segmentMatrix} />,
    <CutTile key="region" icon={MapPin} title="By region · pincode">
      <RegionBarChart rows={cut.region} accent={cssVar("severity-high")} />
    </CutTile>,
    <CutTile key="category" icon={Layers} title="By category">
      <CategoryCutTable
        rows={cut.category}
        periodLabel={periodLabel}
        colors={[
          cssVar("accent"),
          cssVar("accent-2"),
          cssVar("severity-med"),
          cssVar("severity-high"),
          cssVar("text-muted"),
        ]}
      />
    </CutTile>,
  ];

  const pages: React.ReactNode[][] = [];
  for (let i = 0; i < tiles.length; i += 2) {
    pages.push(tiles.slice(i, i + 2));
  }

  return (
    <aside
      style={{
        minWidth: 0,
        height: "100%",
        padding: "10px 12px",
        borderRadius: radius.lg,
        background: cssVar("surface"),
        border: `1px solid ${cssVar("border")}`,
        boxShadow: cssVar("shadow-card"),
        overflow: "hidden",
        display: "flex",
        flexDirection: "column",
        boxSizing: "border-box",
      }}
    >
      <div
        style={{
          flex: 1,
          minHeight: 0,
          display: "flex",
          flexDirection: "row",
          overflowX: "auto",
          overflowY: "hidden",
          scrollSnapType: "x mandatory",
          WebkitOverflowScrolling: "touch",
        }}
      >
        {pages.map((page, pageIndex) => (
          <div
            key={pageIndex}
            style={{
              flex: "0 0 100%",
              width: "100%",
              height: "100%",
              display: "grid",
              gridTemplateColumns: page.length === 1 ? "1fr" : "minmax(0, 1fr) minmax(0, 1fr)",
              gap: 8,
              scrollSnapAlign: "start",
              scrollSnapStop: "always",
              boxSizing: "border-box",
              paddingRight: pageIndex < pages.length - 1 ? 8 : 0,
            }}
          >
            {page.map((tile, tileIndex) => (
              <div
                key={tileIndex}
                style={{
                  minWidth: 0,
                  minHeight: 0,
                  height: "100%",
                  overflow: "hidden",
                  display: "flex",
                  flexDirection: "column",
                }}
              >
                {tile}
              </div>
            ))}
          </div>
        ))}
      </div>
    </aside>
  );
}

function DriverEventLane({
  label,
  accent,
  drivers,
  scale,
  periodLabel,
  range,
  onVisible,
}: {
  label: string;
  accent: string;
  drivers: TrustDriver[];
  scale: (n: number) => number;
  periodLabel: string;
  range: TrustRangeKey;
  onVisible: (id: TrustDriverId) => void;
}): React.ReactElement | null {
  const [index, setIndex] = useState(0);
  const safeIndex = drivers.length === 0 ? 0 : Math.min(index, drivers.length - 1);
  const current = drivers[safeIndex];

  useEffect(() => {
    if (current) onVisible(current.id);
  }, [current?.id, onVisible]);

  if (!current) return null;

  const cut = scaleTrustDriverCut(TRUST_DRIVER_CUTS[current.id], range);

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: 12,
        padding: "14px 14px 16px",
        borderRadius: radius.lg,
        border: `1.5px solid ${accent}66`,
        background: `linear-gradient(165deg, color-mix(in srgb, ${accent} 10%, ${cssVar("surface")}), color-mix(in srgb, ${accent} 3%, ${cssVar("surface-raised")}))`,
        boxShadow: `inset 3px 0 0 0 ${accent}`,
        boxSizing: "border-box",
      }}
    >
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "minmax(0, 360px) minmax(0, 1fr)",
          gap: 16,
          alignItems: "center",
        }}
      >
        <DriverLaneHeader
          label={label}
          accent={accent}
          index={safeIndex}
          total={drivers.length}
          onPrev={() => setIndex((i) => Math.max(0, i - 1))}
          onNext={() => setIndex((i) => Math.min(drivers.length - 1, i + 1))}
        />
        <DeepBreakdownHeader accent={accent} />
      </div>

      <div
        style={{
          display: "flex",
          gap: 16,
          alignItems: "stretch",
          width: "100%",
        }}
      >
        <div style={{ flex: "0 0 auto", width: 360, maxWidth: 360, minWidth: 0 }}>
          <TrustDriverCard
            key={`${current.id}-${range}`}
            d={current}
            scale={scale}
            periodLabel={periodLabel}
            range={range}
            laneAccent={accent}
          />
        </div>
        <div
          id={`event-breakdown-${current.id}`}
          style={{
            flex: 1,
            minWidth: 0,
            minHeight: 0,
            overflow: "hidden",
            alignSelf: "stretch",
          }}
        >
          <DriverDeepDivePanel cut={cut} periodLabel={periodLabel} />
        </div>
      </div>
    </div>
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
  const R = TRUST_RANGES[range];
  const pulse = getTrustPulse(range);
  const scale = (n: number): number => n * R.f;
  const ranked = sortDriversBySeverity(TRUST_DRIVERS);
  const cliffDrivers = ranked.filter((d) => d.cliffOrSlope === "cliff");
  const slopeDrivers = ranked.filter((d) => d.cliffOrSlope === "slope");

  const [selectedCliff, setSelectedCliff] = useState<TrustDriverId | null>(cliffDrivers[0]?.id ?? null);
  const [selectedSlope, setSelectedSlope] = useState<TrustDriverId | null>(slopeDrivers[0]?.id ?? null);
  const [draftingIssue, setDraftingIssue] = useState<string | null>(null);

  const cliffDriver = selectedCliff ? TRUST_DRIVERS.find((d) => d.id === selectedCliff) ?? null : null;
  const slopeDriver = selectedSlope ? TRUST_DRIVERS.find((d) => d.id === selectedSlope) ?? null : null;
  const evidenceDriverId = selectedCliff ?? selectedSlope ?? TOP_TRUST_DRIVER.id;
  const evidenceChannelRows = scaleTrustDriverCut(TRUST_DRIVER_CUTS[evidenceDriverId], range).channel;

  const selectedSummary =
    cliffDriver || slopeDriver ? (
      <>
        {cliffDriver ? (
          <>
            Cliff: <b style={{ color: cssVar("text-primary") }}>{cliffDriver.label}</b>
          </>
        ) : null}
        {cliffDriver && slopeDriver ? <span style={{ color: cssVar("border") }}>·</span> : null}
        {slopeDriver ? (
          <>
            Slope: <b style={{ color: cssVar("text-primary") }}>{slopeDriver.label}</b>
          </>
        ) : null}
      </>
    ) : (
      <span>Browse cliff / slope events for Event Breakdown</span>
    );

  return (
    <div key={range} style={{ display: "flex", flexDirection: "column", gap: 22 }}>
      {/* 00 — Lifecycle × complaint matrix + top breakages + actions (above the fold) */}
      <section>
        <SectionHead
          n="00"
          titleBesideBadge
          title={
            <>
              Where trust breaks across the <span style={{ color: cssVar("accent") }}>lifecycle</span>
            </>
          }
        />
        <TrustLifecycleMatrix />
      </section>

      {/* 01 — Stage where trust breaks */}
      <section>
        <SectionHead
          n="01"
          titleBesideBadge
          title={
            <>
              Stage where trust got <span style={{ color: cssVar("accent") }}>broken?</span>
            </>
          }
        />
        <PanelCard style={{ padding: 14 }}>
          <TrustStageLifecyclePie range={range} />
        </PanelCard>
      </section>

      {/* 02 — Why trust breaks · separate cliff / slope lanes */}
      <section>
        <SectionHead
          n="02"
          title={
            <>
              Why trust is <span style={{ color: cssVar("accent") }}>breaking?</span>
            </>
          }
          titleBesideBadge
          right={
            <span style={{ fontSize: 12, color: cssVar("text-muted"), display: "inline-flex", alignItems: "center", gap: 6, flexWrap: "wrap" }}>
              <Target size={14} strokeWidth={2.2} /> {selectedSummary}
            </span>
          }
        />
        <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
          <DriverEventLane
            label="Cliff events"
            accent={cssVar("severity-high")}
            drivers={cliffDrivers}
            scale={scale}
            periodLabel={R.delta}
            range={range}
            onVisible={setSelectedCliff}
          />
          <DriverEventLane
            label="Slope events"
            accent={cssVar("severity-med")}
            drivers={slopeDrivers}
            scale={scale}
            periodLabel={R.delta}
            range={range}
            onVisible={setSelectedSlope}
          />
        </div>
      </section>

      {/* 03 — Evidence */}
      <section>
        <SectionHead
          n="03"
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
            minHeight: 420,
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
                <ConfidenceChip conf={pulse.modelConfidence} small />
              </span>
            </div>
            <TrustAiSummaryBody range={range} />
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

          <div style={{ minHeight: 0, height: "100%", display: "flex", flexDirection: "column" }}>
            <ChannelEvidenceCutTile rows={evidenceChannelRows} />
          </div>
        </div>
      </section>

      {/* 04 — Actions */}
      <section>
        <SectionHead
          n="04"
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
            const draftKind = a.kind === "Act now" ? "prepare" : "route";
            const isDrafting = draftingIssue === a.issue;
            return (
              <div key={a.issue}>
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "minmax(0, 1.3fr) minmax(0, 1.5fr) minmax(0, 1fr) minmax(0, 1.7fr) auto",
                    gap: 14,
                    padding: "13px 18px",
                    borderBottom: !isDrafting && i < TRUST_ACTIONS.length - 1 ? `1px solid ${cssVar("border")}` : undefined,
                    alignItems: "center",
                  }}
                >
                  <span style={{ fontWeight: 600, color: cssVar("text-primary"), fontSize: 12.5, lineHeight: 1.4 }}>
                    {a.issue.replace(/WoW/g, R.delta)}
                  </span>
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
                  <button
                    type="button"
                    onClick={() => setDraftingIssue(isDrafting ? null : a.issue)}
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
                      cursor: "pointer",
                      fontFamily: "inherit",
                    }}
                  >
                    {a.kind} <ArrowRight size={13} strokeWidth={2.6} />
                  </button>
                </div>
                {isDrafting ? (
                  <div style={{ padding: "0 18px 14px", borderBottom: i < TRUST_ACTIONS.length - 1 ? `1px solid ${cssVar("border")}` : undefined }}>
                    <DraftActionFooter draftText={a.action} draftKind={draftKind} embedded />
                  </div>
                ) : null}
              </div>
            );
          })}
        </PanelCard>
      </section>
    </div>
  );
}
