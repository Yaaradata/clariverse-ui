"use client";

import React from "react";
import { Sparkles } from "lucide-react";
import type { AnxietyPeriodData, AnxietyStateKey } from "../../lib/cxHeadRetailV3AnxietyData";
import { getAnxietyPeriodMetrics, getWeakestCategory } from "../../lib/cxHeadRetailV3AnxietyMetrics";
import { cssVar, radius, space } from "../../theme/tokens";
import {
  ANXIETY_STATE_META,
  anxietyFmt,
  Delta,
  innerKpiValueStyle,
  InnerKpiCard,
  INNER_KPI_STRIP_MIN_HEIGHT,
} from "./AnxietyPrimitives";
import { useAnimatedNumber } from "../../lib/useAnimatedNumber";

const IPD_TARGET = 92;
const METRIC_ROW_COUNT = 6;
const METRIC_ROW_HEIGHT = 30;
const METRIC_SECTION_TITLE_HEIGHT = 18;
const KPI_INSIGHT_MIN_HEIGHT = 56;
const KPI_HEADER_MIN_HEIGHT = 44;
const KPI_TOP_SECTION_MIN_HEIGHT = 3 * METRIC_ROW_HEIGHT;
const KPI_BODY_BLOCK_MIN_HEIGHT = KPI_TOP_SECTION_MIN_HEIGHT + INNER_KPI_STRIP_MIN_HEIGHT + 8;

type MetricRow = { label: string; value: string; color?: string; numeric?: boolean };

function padMetricRows(rows: MetricRow[], rowCount: number): MetricRow[] {
  const padded = [...rows];
  while (padded.length < rowCount) {
    padded.push({ label: "", value: "" });
  }
  return padded.slice(0, rowCount);
}

function panelMinHeight(rowCount: number, hasSectionTitle = false): number {
  const titleBlock = hasSectionTitle ? METRIC_SECTION_TITLE_HEIGHT + 8 : 0;
  return titleBlock + rowCount * METRIC_ROW_HEIGHT;
}

function anxietyOnlyAccent(pctAnx: number): string {
  if (pctAnx >= 55) return cssVar("severity-med");
  if (pctAnx >= 45) return cssVar("accent");
  return cssVar("severity-high");
}

function ipdTargetAccent(ipd: number, target: number): string {
  if (ipd >= target) return cssVar("positive");
  if (ipd >= target - 1) return cssVar("severity-med");
  return cssVar("severity-high");
}

function ipdDeltaAccent(delta: number): string {
  if (delta > 0) return cssVar("positive");
  if (delta < 0) return cssVar("severity-high");
  return cssVar("text-muted");
}

function indexDeltaAccent(delta: number): string {
  if (delta > 0) return cssVar("severity-high");
  if (delta < 0) return cssVar("positive");
  return cssVar("text-muted");
}

function highBandShareAccent(share: number): string {
  if (share > 25) return cssVar("severity-high");
  if (share > 20) return cssVar("severity-med");
  return cssVar("positive");
}

function containedAccent(contained: number, high: number): string {
  const rate = high > 0 ? (contained / high) * 100 : 0;
  if (rate >= 30) return cssVar("positive");
  if (rate >= 20) return cssVar("severity-med");
  return cssVar("severity-high");
}

function funnelRateAccent(rate: number): string {
  if (rate >= 55) return cssVar("positive");
  if (rate >= 45) return cssVar("severity-med");
  return cssVar("severity-high");
}

function notifyRateAccent(rate: number): string {
  if (rate >= 70) return cssVar("positive");
  if (rate >= 55) return cssVar("severity-med");
  return cssVar("severity-high");
}

function optOutAccent(optOut: number, cap = 3): string {
  if (optOut >= cap) return cssVar("severity-high");
  if (optOut >= cap * 0.7) return cssVar("severity-med");
  return cssVar("positive");
}

function InnerKpiStrip({
  children,
  layout = "panel",
}: {
  children: React.ReactNode;
  layout?: "panel" | "aligned";
}): React.ReactElement {
  if (layout === "aligned") {
    return (
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(3, minmax(0, 1fr))",
          columnGap: 6,
          marginTop: 8,
          width: "100%",
          minHeight: INNER_KPI_STRIP_MIN_HEIGHT,
          alignItems: "stretch",
        }}
      >
        {children}
      </div>
    );
  }

  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(3, minmax(0, 1fr))",
        gap: 6,
        marginTop: 8,
        width: "100%",
        minHeight: INNER_KPI_STRIP_MIN_HEIGHT,
        alignItems: "stretch",
      }}
    >
      {children}
    </div>
  );
}

function StateSignalBadge({ state }: { state: AnxietyStateKey }): React.ReactElement {
  const m = ANXIETY_STATE_META[state];
  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 5,
        fontSize: 10,
        fontWeight: 700,
        borderRadius: radius.pill,
        padding: "1px 6px",
        background: m.tint,
        color: m.color,
        border: `1px solid ${m.color}44`,
        whiteSpace: "nowrap",
      }}
    >
      <span
        style={{
          width: 6,
          height: 6,
          borderRadius: "50%",
          background: m.color,
          flexShrink: 0,
          boxShadow: `0 0 0 2px ${m.color}22`,
        }}
      />
      {m.label}
    </span>
  );
}

function ConfidenceSignalBadge({ conf }: { conf: number }): React.ReactElement {
  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 4,
        fontSize: 10,
        fontWeight: 700,
        fontFamily: cssVar("font-numeric"),
        borderRadius: radius.pill,
        padding: "1px 6px",
        background: cssVar("accent-soft"),
        color: cssVar("accent-2"),
        border: `1px solid ${cssVar("accent")}44`,
        whiteSpace: "nowrap",
      }}
    >
      <Sparkles size={10} strokeWidth={2.4} />
      {conf}%
    </span>
  );
}

const METRIC_RING_DURATION_MS = 1000;

function MetricRing({
  value,
  color,
  label,
  unit = "%",
  displayDecimals = 0,
}: {
  value: number;
  color: string;
  label: string;
  unit?: string;
  displayDecimals?: number;
}): React.ReactElement {
  const size = 96;
  const stroke = 9;
  const r = size / 2 - stroke / 2 - 2;
  const c = size / 2;
  const displayUnit = unit === "" ? "" : unit;
  const animated = useAnimatedNumber(value, {
    duration: METRIC_RING_DURATION_MS,
    delay: 40,
    decimals: displayDecimals,
  });
  const arcValue = Math.min(100, Math.max(0, animated));
  const displayValue =
    displayDecimals > 0 ? animated.toFixed(displayDecimals) : String(Math.round(animated));

  return (
    <div style={{ position: "relative", width: size, height: size, flexShrink: 0 }}>
      <svg width={size} height={size} aria-hidden>
        <circle cx={c} cy={c} r={r} fill="none" stroke={cssVar("border")} strokeWidth={stroke} />
        <circle
          cx={c}
          cy={c}
          r={r}
          fill="none"
          stroke={color}
          strokeWidth={stroke}
          strokeLinecap="round"
          pathLength={100}
          strokeDasharray={`${arcValue} 100`}
          transform={`rotate(-90 ${c} ${c})`}
          style={{ transition: "stroke 0.35s ease" }}
        />
      </svg>
      <div
        style={{
          position: "absolute",
          inset: 0,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <span className="lisn-num" style={{ fontSize: 28, fontWeight: 700, color, lineHeight: 1 }}>
          {displayValue}
          {displayUnit ? (
            <span style={{ fontSize: 14, color: cssVar("text-secondary") }}>{displayUnit}</span>
          ) : null}
        </span>
        <span
          style={{
            fontSize: 9,
            fontWeight: 800,
            letterSpacing: 0.35,
            textTransform: "uppercase",
            color: cssVar("text-muted"),
            marginTop: 2,
          }}
        >
          {label}
        </span>
      </div>
    </div>
  );
}

function KpiMetricPanel({
  sectionTitle,
  rows,
  rowCount = METRIC_ROW_COUNT,
}: {
  sectionTitle?: string;
  rows: MetricRow[];
  rowCount?: number;
}): React.ReactElement {
  const paddedRows = padMetricRows(rows, rowCount);
  const hasSectionTitle = Boolean(sectionTitle);
  const minHeight = panelMinHeight(rowCount, hasSectionTitle);

  return (
    <div
      style={{
        flex: 1,
        minWidth: 0,
        display: "flex",
        flexDirection: "column",
        minHeight,
      }}
    >
      {hasSectionTitle ? (
        <div
          style={{
            fontSize: 10,
            fontWeight: 800,
            letterSpacing: 0.35,
            textTransform: "uppercase",
            color: cssVar("text-primary"),
            marginBottom: 8,
            minHeight: METRIC_SECTION_TITLE_HEIGHT,
            lineHeight: 1.2,
          }}
        >
          {sectionTitle}
        </div>
      ) : null}
      <div>
        {paddedRows.map((row, i) => {
          const isSpacer = !row.label && !row.value;
          return (
            <div
              key={`${row.label || "spacer"}-${i}`}
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                fontSize: 12,
                color: cssVar("text-secondary"),
                minHeight: METRIC_ROW_HEIGHT,
                padding: "0",
                borderBottom: isSpacer ? "1px solid transparent" : `1px solid ${cssVar("border")}`,
                visibility: isSpacer ? "hidden" : "visible",
              }}
            >
              <span>{row.label || "\u00a0"}</span>
              <span
                className={row.numeric === false ? undefined : "lisn-num"}
                style={{ fontWeight: 700, color: row.color ?? cssVar("text-primary"), textAlign: "right" }}
              >
                {row.value || "\u00a0"}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function AnxietyKpiShell({
  accent,
  title,
  state,
  signal,
  body,
  insight,
}: {
  accent: string;
  title: string;
  state: AnxietyStateKey;
  signal: React.ReactNode;
  body: React.ReactNode;
  insight: string;
}): React.ReactElement {
  return (
    <article
      style={{
        display: "grid",
        gridTemplateRows: "auto 1fr auto",
        minHeight: 328,
        height: "100%",
        padding: `${space["4"]} ${space["4"]} ${space["3"]}`,
        borderRadius: radius.lg,
        background: `linear-gradient(160deg, ${cssVar("surface-raised")} 0%, ${cssVar("surface")} 58%)`,
        border: `1px solid ${cssVar("border")}`,
        borderTop: `1px solid ${accent}66`,
        boxShadow: cssVar("shadow-card"),
        position: "relative",
        overflow: "hidden",
        minWidth: 0,
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
          background: `linear-gradient(180deg, ${accent} 0%, ${accent}55 100%)`,
        }}
      />

      <header
        style={{
          display: "flex",
          alignItems: "center",
          gap: space["2"],
          paddingLeft: 4,
          flexWrap: "nowrap",
          minHeight: KPI_HEADER_MIN_HEIGHT,
        }}
      >
        <h3
          style={{
            margin: 0,
            fontSize: 15,
            fontWeight: 700,
            color: cssVar("text-primary"),
            lineHeight: 1.3,
            minWidth: 0,
          }}
        >
          {title}
        </h3>
        <StateSignalBadge state={state} />
        <div style={{ flex: 1, minWidth: 8 }} />
        <div style={{ flexShrink: 0 }}>{signal}</div>
      </header>

      <div
        style={{
          paddingLeft: 4,
          marginTop: space["2"],
          display: "flex",
          alignItems: "stretch",
          flex: 1,
          minHeight: KPI_BODY_BLOCK_MIN_HEIGHT,
          width: "100%",
          height: "100%",
        }}
      >
        {body}
      </div>

      <div
        style={{
          marginTop: space["3"],
          padding: "10px 12px",
          marginLeft: 4,
          borderRadius: radius.md,
          background: cssVar("accent-soft"),
          border: `1px solid ${cssVar("accent")}33`,
          display: "flex",
          gap: 8,
          alignItems: "flex-start",
          minHeight: KPI_INSIGHT_MIN_HEIGHT,
        }}
      >
        <Sparkles size={14} color={cssVar("accent-2")} style={{ flexShrink: 0, marginTop: 1 }} />
        <p style={{ margin: 0, fontSize: 12, color: cssVar("text-secondary"), lineHeight: 1.45, whiteSpace: "pre-line" }}>{insight}</p>
      </div>
    </article>
  );
}

export function AnxietyTriadKpiCards({
  d,
  periodLabel,
}: {
  d: AnxietyPeriodData;
  periodLabel: string;
}): React.ReactElement {
  const m = getAnxietyPeriodMetrics(d);
  const worstCategory = getWeakestCategory(d);
  const ipdRounded = Math.round(d.ipd);
  const stateColor = ANXIETY_STATE_META[d.state].color;
  const ipdColor = ipdTargetAccent(ipdRounded, IPD_TARGET);
  const anxietyOnlyColor = anxietyOnlyAccent(m.promiseKeptPct);
  const ipdDeltaColor = ipdDeltaAccent(d.ipdDelta);
  const animatedAnxietyOnly = useAnimatedNumber(m.anxietyOnly, { duration: 900, delay: 120 });
  const animatedIpdDelta = useAnimatedNumber(d.ipdDelta, { duration: 900, delay: 220, decimals: 1 });
  const animatedContained = useAnimatedNumber(d.contained, { duration: 900, delay: 120 });
  const animatedIndexDelta = useAnimatedNumber(d.deltaIndex, { duration: 900, delay: 220, decimals: 0 });
  const animatedHighBandShare = useAnimatedNumber(m.highBandShare, { duration: 900, delay: 180 });
  const animatedNotified = useAnimatedNumber(d.funnelNotified, { duration: 900, delay: 120 });
  const animatedFunnelRate = useAnimatedNumber(m.funnelRate, { duration: 900, delay: 180 });
  const animatedOptOut = useAnimatedNumber(d.optOut, { duration: 900, delay: 220, decimals: 1 });
  const animatedBreachSignals = useAnimatedNumber(m.breachSignals, { duration: 900, delay: 100 });
  const animatedHigh = useAnimatedNumber(d.high, { duration: 900, delay: 60 });
  const animatedScored = useAnimatedNumber(d.scored, { duration: 900, delay: 80 });
  const animatedBreachUnits = useAnimatedNumber(d.breachUnits, { duration: 900, delay: 100 });
  const animatedTtc = useAnimatedNumber(d.ttc, { duration: 900, delay: 80 });
  const animatedTtContact = useAnimatedNumber(d.ttContact, { duration: 900, delay: 100 });
  const animatedHeadroom = useAnimatedNumber(m.headroomMin, { duration: 900, delay: 120 });
  const animatedPContact = useAnimatedNumber(d.pContact, { duration: 900, delay: 140, decimals: 2 });
  const indexDeltaColor = indexDeltaAccent(d.deltaIndex);
  const highBandShareColor = highBandShareAccent(m.highBandShare);
  const containedColor = containedAccent(d.contained, d.high);
  const funnelRateColor = funnelRateAccent(m.funnelRate);
  const notifyRateColor = notifyRateAccent(m.notifyRate);
  const optOutColor = optOutAccent(d.optOut);
  const containAccent = d.ttc < d.ttContact ? cssVar("positive") : cssVar("severity-med");

  const kpiBodyRow = (
    ring: React.ReactNode,
    panel: React.ReactNode,
    innerKpis?: React.ReactNode,
    innerKpisLayout: "panel" | "aligned" = "panel",
  ): React.ReactElement => {
    if (innerKpis && innerKpisLayout === "aligned") {
      return (
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            width: "100%",
            flex: 1,
            height: "100%",
            minHeight: KPI_BODY_BLOCK_MIN_HEIGHT,
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "flex-start",
              gap: 14,
              width: "100%",
              minHeight: KPI_TOP_SECTION_MIN_HEIGHT,
              flexShrink: 0,
            }}
          >
            <div style={{ width: 96, flexShrink: 0, display: "flex", justifyContent: "center" }}>{ring}</div>
            <div style={{ flex: 1, minWidth: 0 }}>{panel}</div>
          </div>
          <div style={{ marginTop: "auto", width: "100%", flexShrink: 0 }}>{innerKpis}</div>
        </div>
      );
    }

    return (
      <div
        style={{
          display: "flex",
          alignItems: "flex-start",
          gap: 14,
          width: "100%",
        }}
      >
        <div style={{ width: 96, flexShrink: 0, display: "flex", justifyContent: "center" }}>{ring}</div>
        <div style={{ flex: 1, minWidth: 0, display: "flex", flexDirection: "column" }}>
          {panel}
          {innerKpis}
        </div>
      </div>
    );
  };

  return (
    <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 12, alignItems: "stretch" }}>
      <AnxietyKpiShell
        accent={stateColor}
        title="Anxiety vs contact window"
        state={d.state}
        signal={<ConfidenceSignalBadge conf={d.conf} />}
        insight={`${d.driverPct}% of high-anxiety units trace to IPD breach + stuck-at-hub in East — fire containment before the ~${d.ttContact} min contact window closes.`}
        body={kpiBodyRow(
          <MetricRing value={d.index} color={stateColor} label="index" unit="" />,
          <KpiMetricPanel
            rowCount={3}
            rows={[
              { label: "High band units", value: anxietyFmt(animatedHigh), color: cssVar("severity-high") },
              { label: "Scored units", value: anxietyFmt(animatedScored) },
              { label: "p(contact)", value: animatedPContact.toFixed(2), color: stateColor },
            ]}
          />,
          <InnerKpiStrip layout="aligned">
            <InnerKpiCard
              label="Contained units"
              accent={containedColor}
              hint={`${m.containedRate}% of high band`}
            >
              <span
                className="lisn-num"
                style={{ ...innerKpiValueStyle, color: containedColor }}
              >
                {anxietyFmt(animatedContained)}
              </span>
            </InnerKpiCard>
            <InnerKpiCard
              label={`Index delta · ${periodLabel}`}
              accent={indexDeltaColor}
              hint={d.deltaIndex === 0 ? "Flat vs prior" : d.deltaIndex > 0 ? "Pressure rising" : "Easing"}
            >
              <Delta v={animatedIndexDelta} unit=" pts" invert size={14} />
            </InnerKpiCard>
            <InnerKpiCard
              label="High band share"
              accent={highBandShareColor}
              hint={m.highBandShare > 25 ? "Above watch band" : "Within watch band · of scored"}
            >
              <span
                className="lisn-num"
                style={{ ...innerKpiValueStyle, color: highBandShareColor }}
              >
                {Math.round(animatedHighBandShare)}%
              </span>
            </InnerKpiCard>
          </InnerKpiStrip>,
          "aligned",
        )}
      />

      <AnxietyKpiShell
        accent={ipdColor}
        title="Promise reliability"
        state={ipdRounded >= IPD_TARGET ? "strong" : "shift"}
        signal={<ConfidenceSignalBadge conf={d.splitConf} />}
        insight={`${anxietyFmt(m.breachSignals)} signals sit in breach quadrants\nvs ${anxietyFmt(m.anxietyOnly)} anxiety-only\n${worstCategory.k} is the weakest category at ${worstCategory.v.toFixed(1)}% IPD-met.`}
        body={kpiBodyRow(
          <MetricRing value={ipdRounded} color={ipdColor} label="IPD-met" unit="%" />,
          <KpiMetricPanel
            rowCount={3}
            rows={[
              { label: "Breach units", value: anxietyFmt(animatedBreachUnits), color: cssVar("severity-high") },
              { label: "Weakest category", value: worstCategory.k, color: cssVar("severity-med"), numeric: false },
              { label: "Trust breach signals", value: anxietyFmt(animatedBreachSignals), color: cssVar("severity-high") },
            ]}
          />,
          <InnerKpiStrip layout="aligned">
            <InnerKpiCard
              label="Anxiety signals"
              accent={anxietyOnlyColor}
              hint={`${m.promiseKeptPct}% promise kept`}
            >
              <span
                className="lisn-num"
                style={{ ...innerKpiValueStyle, color: anxietyOnlyColor }}
              >
                {anxietyFmt(animatedAnxietyOnly)}
              </span>
            </InnerKpiCard>
            <InnerKpiCard
              label={`IPD delta · ${periodLabel}`}
              accent={ipdDeltaColor}
              hint={d.ipdDelta === 0 ? "Flat vs prior" : d.ipdDelta > 0 ? "Improving" : "Slipping"}
            >
              <Delta v={animatedIpdDelta} unit="%" size={14} />
            </InnerKpiCard>
            <InnerKpiCard
              label="IPD target"
              accent={cssVar("accent-2")}
              hint="Promise reliability bar"
            >
              <span
                className="lisn-num"
                style={{ ...innerKpiValueStyle, color: cssVar("accent-2") }}
              >
                {IPD_TARGET}%
              </span>
            </InnerKpiCard>
          </InnerKpiStrip>,
          "aligned",
        )}
      />

      <AnxietyKpiShell
        accent={containAccent}
        title="Containment vs contact window"
        state={d.ttc < d.ttContact ? "strong" : "shift"}
        signal={<ConfidenceSignalBadge conf={d.conf} />}
        insight={`Headroom of +${m.headroomMin} min before untreated units likely contact\n${m.notifyRate}% notified · ${m.contactAvoidedOfNotifiedPct}% of notified avoided contact\n${m.funnelRate}% contact avoided vs high band.`}
        body={kpiBodyRow(
          <MetricRing value={m.coverageRate} color={containAccent} label="coverage" unit="%" />,
          <KpiMetricPanel
            rowCount={3}
            rows={[
              { label: "Time-to-contain", value: `${animatedTtc} min`, color: containAccent },
              { label: "Time-to-contact", value: `${animatedTtContact} min` },
              { label: "Headroom", value: `+${animatedHeadroom} min`, color: containAccent },
            ]}
          />,
          <InnerKpiStrip layout="aligned">
            <InnerKpiCard
              label="Units notified"
              accent={notifyRateColor}
              hint={`${m.notifyRate}% of high band`}
            >
              <span
                className="lisn-num"
                style={{ ...innerKpiValueStyle, color: notifyRateColor }}
              >
                {anxietyFmt(animatedNotified)}
              </span>
            </InnerKpiCard>
            <InnerKpiCard
              label="Contact avoided"
              accent={funnelRateColor}
              hint={
                m.funnelRate >= 55
                  ? `Strong avoidance · ${m.contactAvoidedOfNotifiedPct}% of notified`
                  : m.funnelRate >= 45
                    ? `Watch rate · ${m.contactAvoidedOfNotifiedPct}% of notified`
                    : `Below target · ${m.contactAvoidedOfNotifiedPct}% of notified`
              }
            >
              <span
                className="lisn-num"
                style={{ ...innerKpiValueStyle, color: funnelRateColor }}
              >
                {Math.round(animatedFunnelRate)}%
              </span>
            </InnerKpiCard>
            <InnerKpiCard
              label="Opt-out guardrail"
              accent={optOutColor}
              hint={d.optOut < 3 ? "Within 3% cap" : "Cap breached"}
            >
              <span
                className="lisn-num"
                style={{ ...innerKpiValueStyle, color: optOutColor }}
              >
                {animatedOptOut.toFixed(1)}%
              </span>
            </InnerKpiCard>
          </InnerKpiStrip>,
          "aligned",
        )}
      />
    </div>
  );
}
