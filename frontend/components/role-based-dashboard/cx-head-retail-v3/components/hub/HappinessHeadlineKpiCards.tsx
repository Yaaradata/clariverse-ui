"use client";

import React, { useEffect, useState } from "react";
import { ArrowDown, ArrowUp } from "lucide-react";
import {
  HAPPINESS_DATA,
  HAPPINESS_PERIODS,
  type HappinessPeriodKey,
} from "../../lib/cxHeadRetailV3CustomerHappinessData";
import {
  HAPPINESS_SEGMENT_ROWS,
  type HappinessSegmentKey,
} from "../../lib/cxHeadRetailV3HappinessLensData";
import { useAnimatedNumber, usePrefersReducedMotion } from "../../lib/useAnimatedNumber";
import { SpikySparkline } from "../common/MiniSparkline";
import { cssVar, radius, space } from "../../theme/tokens";

type HeadlineKpiId = "happiness" | "nps" | "loyalty" | "repeat";

type HeadlineKpiDef = {
  id: HeadlineKpiId;
  title: string;
  hint: string;
  suffix: string;
  target: number;
  decimals: number;
  sparkViewBox: string;
  /** Driving segment — same keys/labels/colors as the SEGMENT table. */
  segmentKey: HappinessSegmentKey;
};

const KPI_DEFS: readonly HeadlineKpiDef[] = [
  {
    id: "happiness",
    title: "Happiness Index Score",
    hint: "Composite of delivery, returns, support, product & sentiment",
    suffix: "/100",
    target: 70,
    decimals: 0,
    sparkViewBox: "-90 0 120 40",
    segmentKey: "active",
  },
  {
    id: "nps",
    title: "Net Promoter Score",
    hint: "Promoters − detractors from post-interaction surveys",
    suffix: "",
    target: 50,
    decimals: 0,
    sparkViewBox: "-140 0 120 40",
    segmentKey: "occasional",
  },
  {
    id: "loyalty",
    title: "Customer Loyalty Index",
    hint: "Retention strength across RFM Top / Strong / Priority / Risk",
    suffix: "/100",
    target: 70,
    decimals: 0,
    sparkViewBox: "-90 0 120 40",
    segmentKey: "loyal",
  },
  {
    id: "repeat",
    title: "Repeat Purchase Rate",
    hint: "Share of buyers with a second order in-window",
    suffix: "%",
    target: 40,
    decimals: 0,
    sparkViewBox: "-120 0 120 40",
    segmentKey: "frequent",
  },
] as const;

function segmentByKey(key: HappinessSegmentKey): { label: string; color: string } {
  const row = HAPPINESS_SEGMENT_ROWS.find((r) => r.key === key);
  if (row) return { label: row.label, color: row.color };
  return { label: key, color: cssVar("text-muted") };
}

/** Same pill language as the SEGMENT column in the happiness table. */
function CustomerSegmentPill({ segmentKey }: { segmentKey: HappinessSegmentKey }): React.ReactElement {
  const { label, color } = segmentByKey(segmentKey);
  return (
    <span
      title={`Customer segment · ${label}`}
      style={{
        display: "inline-flex",
        alignItems: "center",
        fontSize: 10,
        fontWeight: 700,
        padding: "3px 9px",
        borderRadius: 999,
        background: `${color}18`,
        color,
        border: `1px solid ${color}40`,
        width: "fit-content",
        maxWidth: "100%",
        whiteSpace: "nowrap",
        overflow: "hidden",
        textOverflow: "ellipsis",
        flexShrink: 0,
      }}
    >
      {label}
    </span>
  );
}

function useMountReveal(delay = 0): React.CSSProperties {
  const reducedMotion = usePrefersReducedMotion();
  const [visible, setVisible] = useState(reducedMotion);

  useEffect(() => {
    if (reducedMotion) {
      setVisible(true);
      return;
    }
    const timeout = window.setTimeout(() => setVisible(true), delay);
    return () => window.clearTimeout(timeout);
  }, [delay, reducedMotion]);

  return {
    opacity: visible ? 1 : 0,
    transform: visible ? "translateY(0)" : "translateY(10px)",
    transition: "opacity 0.5s ease, transform 0.5s ease",
  };
}

function ragHigher(value: number, good: number, ok: number): string {
  if (value >= good) return cssVar("positive");
  if (value >= ok) return cssVar("severity-med");
  return cssVar("severity-high");
}

function accentFor(id: HeadlineKpiId, value: number): string {
  switch (id) {
    case "happiness":
    case "loyalty":
      return ragHigher(value, 70, 55);
    case "nps":
      return ragHigher(value, 50, 30);
    case "repeat":
      return ragHigher(value, 40, 30);
    default: {
      const _exhaustive: never = id;
      return _exhaustive;
    }
  }
}

function resolveKpi(
  id: HeadlineKpiId,
  period: HappinessPeriodKey,
): { value: number; delta: number; spark: number[] } {
  const d = HAPPINESS_DATA[period];
  switch (id) {
    case "happiness":
      return { value: d.headline.score, delta: d.headline.delta, spark: d.spark };
    case "nps":
      return { value: d.headline.nps, delta: d.headline.npsD, spark: d.npsSpark };
    case "loyalty":
      return {
        value: d.headline.loyalty,
        delta: d.headline.loyaltyD,
        spark: d.loyaltySpark,
      };
    case "repeat":
      return {
        value: d.headline.repeatPurchase,
        delta: d.headline.repeatD,
        spark: d.repeatSpark,
      };
    default: {
      const _exhaustive: never = id;
      return _exhaustive;
    }
  }
}

function TargetGapBadge({ gap }: { gap: TargetGapMeta }): React.ReactElement {
  const GapArrow = gap.direction === "up" ? ArrowUp : ArrowDown;

  if (gap.direction === "flat") {
    return (
      <span
        className="lisn-num"
        style={{
          fontSize: 11,
          fontWeight: 700,
          color: gap.color,
          lineHeight: 1.3,
          whiteSpace: "nowrap",
        }}
      >
        On target
      </span>
    );
  }

  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 4,
        whiteSpace: "nowrap",
      }}
    >
      <span
        className="lisn-num"
        style={{
          display: "inline-flex",
          alignItems: "center",
          gap: 2,
          fontSize: 11,
          fontWeight: 800,
          color: gap.color,
          lineHeight: 1,
        }}
      >
        {gap.amount}
        <GapArrow size={12} strokeWidth={2.6} />
      </span>
      <span
        style={{
          fontSize: 11,
          fontWeight: 700,
          color: gap.color,
          lineHeight: 1.2,
        }}
      >
        {gap.caption}
      </span>
    </span>
  );
}

type TargetGapMeta = {
  amount: string;
  direction: "down" | "up" | "flat";
  caption: string;
  color: string;
};

function gapToTargetMeta(value: number, target: number): TargetGapMeta {
  const gap = Math.round((target - value) * 10) / 10;
  if (gap === 0) {
    return { amount: "0", direction: "flat", caption: "On target", color: cssVar("positive") };
  }
  if (gap > 0) {
    return {
      amount: String(gap),
      direction: "down",
      caption: "Target",
      color: cssVar("severity-med"),
    };
  }
  return {
    amount: String(Math.abs(gap)),
    direction: "up",
    caption: "Target",
    color: cssVar("positive"),
  };
}

function HeadlineKpiCard({
  def,
  period,
  revealDelay,
}: {
  def: HeadlineKpiDef;
  period: HappinessPeriodKey;
  revealDelay: number;
}): React.ReactElement {
  const meta = HAPPINESS_PERIODS[period];
  const { value, delta, spark } = resolveKpi(def.id, period);
  const accent = accentFor(def.id, value);
  const revealStyle = useMountReveal(revealDelay);
  const animatedValue = useAnimatedNumber(value, {
    duration: 1000,
    delay: revealDelay + 40,
    decimals: def.decimals,
  });
  const displayValue =
    def.decimals > 0 ? animatedValue.toFixed(def.decimals) : String(Math.round(animatedValue));
  const gapMeta = gapToTargetMeta(value, def.target);
  const { color: segmentColor } = segmentByKey(def.segmentKey);
  const periodDecimals = Math.abs(delta) % 1 !== 0 ? 1 : 0;
  const periodAmount =
    periodDecimals > 0 ? Math.abs(delta).toFixed(periodDecimals) : String(Math.abs(delta));
  const periodUp = delta > 0;
  const periodFlat = delta === 0;
  const periodColor = periodFlat
    ? cssVar("text-muted")
    : periodUp
      ? cssVar("positive")
      : cssVar("severity-high");
  const PeriodArrow = periodUp || periodFlat ? ArrowUp : ArrowDown;

  return (
    <article
      title={def.hint}
      style={{
        display: "flex",
        flexDirection: "column",
        gap: space["3"],
        minHeight: 148,
        height: "100%",
        padding: `${space["4"]} ${space["4"]} ${space["3"]}`,
        borderRadius: radius.lg,
        background: `linear-gradient(155deg, ${cssVar("surface-raised")} 0%, ${cssVar("surface")} 58%)`,
        border: `1px solid ${segmentColor}55`,
        boxShadow: `0 0 0 1px ${segmentColor}22, ${cssVar("shadow-card")}`,
        position: "relative",
        overflow: "hidden",
        minWidth: 0,
        ...revealStyle,
      }}
    >
      <div
        aria-hidden
        style={{
          position: "absolute",
          left: 0,
          top: 0,
          bottom: 0,
          width: 3,
          background: `linear-gradient(180deg, ${segmentColor} 0%, ${segmentColor}55 100%)`,
        }}
      />

      <header style={{ paddingLeft: 4 }}>
        <div
          style={{
            fontSize: 11,
            fontWeight: 800,
            letterSpacing: "0.04em",
            textTransform: "uppercase",
            color: cssVar("text-muted"),
            lineHeight: 1.25,
          }}
        >
          {def.title}
        </div>
      </header>

      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: 8,
          paddingLeft: 4,
          flex: 1,
          minHeight: 0,
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "flex-end",
            gap: 10,
            minWidth: 0,
          }}
        >
          <div style={{ display: "flex", alignItems: "baseline", gap: 4, flexShrink: 0 }}>
            <span
              className="lisn-num"
              style={{
                fontSize: 40,
                fontWeight: 800,
                letterSpacing: "-0.03em",
                color: accent,
                lineHeight: 1,
                fontVariantNumeric: "tabular-nums",
                fontFamily: cssVar("font-numeric"),
              }}
            >
              {displayValue}
            </span>
            {def.suffix ? (
              <span
                className="lisn-num"
                style={{
                  fontSize: 16,
                  fontWeight: 700,
                  color: cssVar("text-secondary"),
                  lineHeight: 1,
                }}
              >
                {def.suffix}
              </span>
            ) : null}
          </div>
          <div style={{ flex: 1, minWidth: 56, maxWidth: 110, height: 40, paddingBottom: 2 }}>
            <SpikySparkline
              data={spark}
              color={accent}
              height={40}
              strokeWidth={2.4}
              viewBox={def.sparkViewBox}
            />
          </div>
        </div>
        <div
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 5,
            flexWrap: "wrap",
            lineHeight: 1.2,
          }}
        >
          <span
            className="lisn-num"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 2,
              fontSize: 11,
              fontWeight: 800,
              color: periodColor,
              lineHeight: 1,
            }}
          >
            {periodFlat ? "0" : periodAmount}
            <PeriodArrow size={12} strokeWidth={2.6} style={{ opacity: periodFlat ? 0.45 : 1 }} />
          </span>
          <span style={{ fontSize: 10, color: cssVar("text-muted"), fontWeight: 600 }}>
            {meta.label}
          </span>
        </div>
        <div
          style={{
            marginTop: -2,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: 8,
            width: "100%",
          }}
        >
          <TargetGapBadge gap={gapMeta} />
          <span
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 6,
              marginTop: -10,
              minWidth: 0,
            }}
          >
            <span
              style={{
                fontSize: 11,
                fontWeight: 700,
                color: cssVar("text-muted"),
                letterSpacing: "0.02em",
                whiteSpace: "nowrap",
                flexShrink: 0,
              }}
            >
              Top Cont.
            </span>
            <CustomerSegmentPill segmentKey={def.segmentKey} />
          </span>
        </div>
      </div>
    </article>
  );
}

/** Top-row happiness headline — Index · NPS · Loyalty · Repeat. */
export function HappinessHeadlineKpiCards({
  period,
}: {
  period: HappinessPeriodKey;
}): React.ReactElement {
  return (
    <section
      aria-label="Happiness headline KPIs"
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(4, minmax(0, 1fr))",
        gap: space["3"],
        alignItems: "stretch",
      }}
    >
      {KPI_DEFS.map((def, i) => (
        <HeadlineKpiCard key={def.id} def={def} period={period} revealDelay={i * 70} />
      ))}
    </section>
  );
}
