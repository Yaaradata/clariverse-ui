"use client";

import React, { useEffect, useMemo, useState } from "react";
import { ListChecks, ArrowRight } from "lucide-react";
import {
  TRUST_DRIVERS,
  TRUST_LIFECYCLE_STAGES,
  TRUST_RANGES,
  scaleTrustCrLabel,
  scaleTrustDelta,
  type TrustLifecycleStage,
  type TrustLifecycleStageId,
  type TrustRangeKey,
  type TrustRagLevel,
} from "../../lib/cxHeadRetailV3TrustBreakdownData";
import { cssVar, radius } from "../../theme/tokens";
import { ConfidenceChip } from "../common/ConfidenceBand";
import { useAnimatedNumber } from "../../lib/useAnimatedNumber";

const nf = new Intl.NumberFormat("en-IN");
const fmt = (n: number): string => nf.format(Math.round(n));

/** Strict Red / Amber / Green — never purple/indigo accent. */
type RagTone = "red" | "amber" | "green";

function ragTone(rag: TrustRagLevel): RagTone {
  switch (rag) {
    case "crit":
    case "high":
      return "red";
    case "watch":
      return "amber";
    case "good":
      return "green";
    default: {
      const _exhaustive: never = rag;
      return _exhaustive;
    }
  }
}

function ragColor(rag: TrustRagLevel): string {
  const tone = ragTone(rag);
  switch (tone) {
    case "red":
      return cssVar("severity-high");
    case "amber":
      return cssVar("severity-med");
    case "green":
      return cssVar("positive");
    default: {
      const _exhaustive: never = tone;
      return _exhaustive;
    }
  }
}

function ragLabel(rag: TrustRagLevel): string {
  const tone = ragTone(rag);
  switch (tone) {
    case "red":
      return rag === "crit" ? "Critical" : "Elevated";
    case "amber":
      return "Watch";
    case "green":
      return "Healthy";
    default: {
      const _exhaustive: never = tone;
      return _exhaustive;
    }
  }
}

function StageWhatNext({
  stage,
  color,
  range,
}: {
  stage: TrustLifecycleStage;
  color: string;
  range: TrustRangeKey;
}): React.ReactElement {
  const insight = stage.aiInsight;
  const evidenceLines = stage.evidence.slice(0, 2);

  const beatRow = (label: string, body: string): React.ReactElement => (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "72px minmax(0, 1fr)",
        gap: 10,
        alignItems: "start",
      }}
    >
      <span
        style={{
          fontSize: 10,
          fontWeight: 800,
          letterSpacing: "0.04em",
          textTransform: "uppercase",
          color: cssVar("accent-2"),
          paddingTop: 1,
        }}
      >
        {label}
      </span>
      <span style={{ fontSize: 12.5, color: cssVar("text-secondary"), lineHeight: 1.4 }}>{body}</span>
    </div>
  );

  return (
    <aside
      aria-label="What to do next"
      style={{
        display: "flex",
        flexDirection: "column",
        gap: 10,
        minWidth: 0,
        width: "100%",
        height: "100%",
        padding: "14px 16px",
        borderRadius: radius.lg,
        border: `1px solid ${cssVar("accent")}44`,
        borderLeft: `4px solid ${cssVar("accent")}`,
        background: `linear-gradient(165deg, ${cssVar("accent-soft")}, ${cssVar("surface")})`,
        boxShadow: cssVar("shadow-card"),
        boxSizing: "border-box",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 10, flexWrap: "wrap" }}>
        <span
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 6,
            fontSize: 11,
            fontWeight: 800,
            color: cssVar("accent-2"),
            letterSpacing: "0.05em",
            textTransform: "uppercase",
          }}
        >
          <ListChecks size={13} strokeWidth={2.4} /> What to do next?
          <ConfidenceChip conf={insight.confidence} small />
        </span>
        <span style={{ fontSize: 11, color: cssVar("text-muted"), whiteSpace: "nowrap" }}>
          Owner · <b style={{ color: cssVar("text-primary") }}>{stage.fixOwner}</b>
        </span>
      </div>

      <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
        <span
          style={{
            fontSize: 10,
            fontWeight: 800,
            letterSpacing: "0.04em",
            color,
            padding: "3px 8px",
            borderRadius: radius.pill,
            border: `1px solid ${color}44`,
            background: `color-mix(in srgb, ${color} 12%, transparent)`,
          }}
        >
          {stage.id} · {stage.shortLabel}
        </span>
        <span
          style={{
            fontSize: 10,
            fontWeight: 700,
            color: cssVar("text-secondary"),
            padding: "3px 8px",
            borderRadius: radius.pill,
            border: `1px solid ${cssVar("border")}`,
            background: cssVar("surface-raised"),
          }}
        >
          {stage.sharePct}% of break
        </span>
        <span
          style={{
            fontSize: 10,
            fontWeight: 700,
            color: stage.cliffCount > 0 ? cssVar("severity-high") : cssVar("text-muted"),
            padding: "3px 8px",
            borderRadius: radius.pill,
            border: `1px solid ${stage.cliffCount > 0 ? `${cssVar("severity-high")}44` : cssVar("border")}`,
            background: cssVar("surface-raised"),
          }}
        >
          {stage.cliffCount > 0 ? `${stage.cliffCount} cliff live` : "No cliff"}
        </span>
        <span
          style={{
            fontSize: 10,
            fontWeight: 700,
            color: cssVar("text-secondary"),
            padding: "3px 8px",
            borderRadius: radius.pill,
            border: `1px solid ${cssVar("border")}`,
            background: cssVar("surface-raised"),
          }}
        >
          GMV · {scaleTrustCrLabel(stage.pnlAtRisk, range)}
        </span>
      </div>

      <div style={{ fontSize: 15, fontWeight: 800, color: cssVar("text-primary"), lineHeight: 1.3, letterSpacing: "-0.01em" }}>
        {insight.headline}
      </div>

      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: 8,
          padding: "10px 11px",
          borderRadius: radius.md,
          border: `1px solid ${cssVar("border")}`,
          background: cssVar("surface-raised"),
        }}
      >
        {beatRow("Now", insight.signal)}
        <div style={{ height: 1, background: cssVar("border") }} />
        {beatRow("Why", insight.impact)}
        <div style={{ height: 1, background: cssVar("border") }} />
        {beatRow("Watch", stage.cxSignal)}
      </div>

      {evidenceLines.length > 0 ? (
        <div style={{ display: "flex", flexDirection: "column", gap: 5, flex: 1, minHeight: 0 }}>
          <div
            style={{
              fontSize: 10,
              fontWeight: 800,
              letterSpacing: "0.04em",
              textTransform: "uppercase",
              color: cssVar("text-muted"),
            }}
          >
            Evidence to use
          </div>
          {evidenceLines.map((line) => (
            <div
              key={line}
              style={{
                display: "flex",
                alignItems: "flex-start",
                gap: 7,
                fontSize: 12,
                color: cssVar("text-secondary"),
                lineHeight: 1.4,
              }}
            >
              <span style={{ color, fontWeight: 800, flexShrink: 0, marginTop: 1 }}>·</span>
              <span>{line}</span>
            </div>
          ))}
        </div>
      ) : (
        <div style={{ flex: 1 }} />
      )}

      <div
        style={{
          marginTop: "auto",
          padding: "9px 11px",
          borderRadius: radius.sm,
          border: `1px solid ${color}44`,
          background: `color-mix(in srgb, ${color} 12%, transparent)`,
          fontSize: 12.5,
          fontWeight: 700,
          color: cssVar("text-primary"),
          lineHeight: 1.4,
          display: "flex",
          alignItems: "flex-start",
          gap: 7,
        }}
      >
        <ArrowRight size={14} color={color} style={{ flexShrink: 0, marginTop: 2 }} strokeWidth={2.4} />
        <span>{insight.action}</span>
      </div>
    </aside>
  );
}

function StageKpiTile({
  label,
  value,
  sub,
  color,
  emphasize,
}: {
  label: string;
  value: string;
  sub?: string;
  color: string;
  emphasize?: boolean;
}): React.ReactElement {
  return (
    <div
      style={{
        padding: "10px 10px 9px",
        borderRadius: radius.md,
        border: `1px solid ${emphasize ? `${color}40` : cssVar("border")}`,
        background: emphasize
          ? `linear-gradient(165deg, color-mix(in srgb, ${color} 10%, ${cssVar("surface-raised")}), ${cssVar("surface-raised")})`
          : cssVar("surface-raised"),
        minWidth: 0,
        display: "flex",
        flexDirection: "column",
        gap: 3,
        height: "100%",
        boxSizing: "border-box",
      }}
    >
      <div
        style={{
          fontSize: 9,
          fontWeight: 700,
          letterSpacing: "0.05em",
          textTransform: "uppercase",
          color: cssVar("text-muted"),
        }}
      >
        {label}
      </div>
      <div
        className="lisn-num"
        style={{
          fontSize: emphasize ? 18 : 16,
          fontWeight: 800,
          color: emphasize ? color : cssVar("text-primary"),
          lineHeight: 1.1,
        }}
      >
        {value}
      </div>
      {sub ? <div style={{ fontSize: 10, color: cssVar("text-muted"), lineHeight: 1.25, marginTop: 1 }}>{sub}</div> : null}
    </div>
  );
}

function CxSignalEvidenceCard({
  stage,
  color,
}: {
  stage: TrustLifecycleStage;
  color: string;
}): React.ReactElement {
  return (
    <div
      style={{
        padding: "12px 13px",
        borderRadius: radius.md,
        border: `1px solid ${cssVar("border")}`,
        background: cssVar("surface"),
        display: "flex",
        flexDirection: "column",
        gap: 8,
        minWidth: 0,
        flex: 1,
      }}
    >
      <div style={{ fontSize: 10, fontWeight: 800, letterSpacing: "0.05em", textTransform: "uppercase", color: cssVar("text-muted") }}>
        CX signal → evidence
      </div>
      <p style={{ margin: 0, fontSize: 13, fontWeight: 600, color: cssVar("text-primary"), lineHeight: 1.4 }}>{stage.cxSignal}</p>
      <ul style={{ margin: 0, paddingLeft: 16, display: "flex", flexDirection: "column", gap: 4 }}>
        {stage.evidence.map((line) => (
          <li key={line} style={{ fontSize: 12, color: cssVar("text-secondary"), lineHeight: 1.4 }}>
            {line}
          </li>
        ))}
      </ul>
      <div
        style={{
          marginTop: "auto",
          paddingTop: 8,
          borderTop: `1px solid ${cssVar("border")}`,
          fontSize: 12.5,
          fontWeight: 700,
          color: cssVar("text-primary"),
          lineHeight: 1.4,
          display: "flex",
          alignItems: "flex-start",
          gap: 6,
        }}
      >
        <ArrowRight size={13} color={color} style={{ flexShrink: 0, marginTop: 2 }} strokeWidth={2.4} />
        <span>{stage.action}</span>
      </div>
    </div>
  );
}

function CliffSlopeDataTile({
  drivers,
  scale,
}: {
  drivers: (typeof TRUST_DRIVERS)[number][];
  scale: (n: number) => number;
}): React.ReactElement {
  const cliffs = drivers.filter((d) => d.cliffOrSlope === "cliff");
  const slopes = drivers.filter((d) => d.cliffOrSlope === "slope");
  const cliffContacts = cliffs.reduce((sum, d) => sum + scale(d.complaints), 0);
  const slopeContacts = slopes.reduce((sum, d) => sum + scale(d.complaints), 0);
  const topCliff = cliffs[0];
  const topSlope = slopes[0];

  return (
    <div
      style={{
        padding: "10px 10px 9px",
        borderRadius: radius.md,
        border: `1px solid ${cssVar("border")}`,
        background: cssVar("surface-raised"),
        minWidth: 0,
        height: "100%",
        boxSizing: "border-box",
        display: "flex",
        flexDirection: "column",
        gap: 6,
      }}
    >
      <div
        style={{
          fontSize: 9,
          fontWeight: 700,
          letterSpacing: "0.05em",
          textTransform: "uppercase",
          color: cssVar("text-muted"),
        }}
      >
        Cliff &amp; slope
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 5, marginTop: "auto" }}>
        <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", gap: 6, minWidth: 0 }}>
          <span style={{ display: "inline-flex", alignItems: "center", gap: 5, minWidth: 0 }}>
            <span style={{ width: 3, height: 12, borderRadius: 2, background: cssVar("severity-high"), flexShrink: 0 }} />
            <span
              style={{
                fontSize: 11,
                fontWeight: 700,
                color: cssVar("text-primary"),
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
              }}
              title={topCliff?.label ?? "No cliff"}
            >
              {topCliff ? topCliff.label : "No cliff"}
            </span>
          </span>
          <span className="lisn-num" style={{ fontSize: 13, fontWeight: 800, color: cssVar("severity-high"), flexShrink: 0 }}>
            {cliffs.length > 0 ? fmt(cliffContacts) : "—"}
          </span>
        </div>
        <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", gap: 6, minWidth: 0 }}>
          <span style={{ display: "inline-flex", alignItems: "center", gap: 5, minWidth: 0 }}>
            <span style={{ width: 3, height: 12, borderRadius: 2, background: cssVar("severity-med"), flexShrink: 0 }} />
            <span
              style={{
                fontSize: 11,
                fontWeight: 700,
                color: cssVar("text-primary"),
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
              }}
              title={topSlope?.label ?? "No slope"}
            >
              {topSlope ? topSlope.label : "No slope"}
            </span>
          </span>
          <span className="lisn-num" style={{ fontSize: 13, fontWeight: 800, color: cssVar("severity-med"), flexShrink: 0 }}>
            {slopes.length > 0 ? fmt(slopeContacts) : "—"}
          </span>
        </div>
      </div>
    </div>
  );
}

function StageDetailBreakdown({
  stage,
  color,
  scale,
  periodLabel,
  range,
}: {
  stage: TrustLifecycleStage;
  color: string;
  scale: (n: number) => number;
  periodLabel: string;
  range: TrustRangeKey;
}): React.ReactElement {
  const drivers = stage.driverIds
    .map((id) => TRUST_DRIVERS.find((d) => d.id === id))
    .filter((d): d is (typeof TRUST_DRIVERS)[number] => d != null);
  const velocity = Math.round(scaleTrustDelta(stage.wow, range));
  const dropPts = Math.max(1, Math.round(stage.trustDropPts * (range === "24H" ? 0.5 : range === "30D" ? 1.15 : 1)));

  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "minmax(0, 0.88fr) minmax(320px, 1.12fr)",
        gap: 14,
        alignItems: "stretch",
        minWidth: 0,
      }}
    >
      <div style={{ display: "flex", flexDirection: "column", gap: 12, minWidth: 0 }}>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gridTemplateRows: "1fr 1fr",
            gap: 8,
            minWidth: 0,
            minHeight: 0,
          }}
        >
          <CliffSlopeDataTile drivers={drivers} scale={scale} />
          <StageKpiTile label="Trust drop" value={`−${dropPts} pts`} sub={periodLabel} color={color} />
          <StageKpiTile
            label="Velocity"
            value={`${velocity >= 0 ? "+" : ""}${velocity}%`}
            sub={periodLabel}
            color={color}
          />
          <StageKpiTile
            label="GMV exposure"
            value={scaleTrustCrLabel(stage.pnlAtRisk, range)}
            sub={stage.cliffCount > 0 ? `${stage.cliffCount} cliff live` : "No live cliff"}
            color={color}
            emphasize
          />
        </div>

        <CxSignalEvidenceCard stage={stage} color={color} />
      </div>

      <div style={{ minWidth: 0, minHeight: 0, display: "flex", alignSelf: "stretch" }}>
        <StageWhatNext stage={stage} color={color} range={range} />
      </div>
    </div>
  );
}

function JourneyStageNode({
  stage,
  selected,
  maxContacts,
  scale,
  onSelect,
}: {
  stage: TrustLifecycleStage;
  selected: boolean;
  maxContacts: number;
  scale: (n: number) => number;
  onSelect: (id: TrustLifecycleStageId) => void;
}): React.ReactElement {
  const tone = ragTone(stage.rag);
  const color = ragColor(stage.rag);
  const loadPct = Math.max(8, Math.round((stage.contacts / Math.max(maxContacts, 1)) * 100));
  const animatedContacts = useAnimatedNumber(scale(stage.contacts), { duration: 700, delay: 40 });

  const softFill =
    tone === "red"
      ? selected
        ? `color-mix(in srgb, ${color} 16%, ${cssVar("surface")})`
        : `color-mix(in srgb, ${color} 8%, ${cssVar("surface-raised")})`
      : tone === "amber"
        ? selected
          ? `color-mix(in srgb, ${color} 15%, ${cssVar("surface")})`
          : `color-mix(in srgb, ${color} 7%, ${cssVar("surface-raised")})`
        : selected
          ? `color-mix(in srgb, ${color} 14%, ${cssVar("surface")})`
          : `color-mix(in srgb, ${color} 6%, ${cssVar("surface-raised")})`;

  return (
    <button
      type="button"
      onClick={() => onSelect(stage.id)}
      aria-pressed={selected}
      title={`${stage.label} · ${ragLabel(stage.rag)}`}
      style={{
        flex: "1 1 0",
        minWidth: 96,
        height: "100%",
        display: "grid",
        gridTemplateRows: "auto auto 1fr 40px",
        gap: 8,
        padding: "10px 9px 10px 11px",
        borderRadius: radius.md,
        border: `1.5px solid ${selected ? color : `${color}66`}`,
        background: softFill,
        boxShadow: selected
          ? `inset 3px 0 0 0 ${color}, 0 0 0 1px ${color}55, 0 8px 18px color-mix(in srgb, ${color} 14%, transparent)`
          : `inset 3px 0 0 0 ${color}`,
        cursor: "pointer",
        textAlign: "left",
        fontFamily: "inherit",
        boxSizing: "border-box",
        position: "relative",
        overflow: "hidden",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 6, minWidth: 0 }}>
        <span style={{ fontSize: 11, fontWeight: 800, letterSpacing: "0.05em", color, flexShrink: 0 }}>{stage.id}</span>
        <span
          aria-label={ragLabel(stage.rag)}
          style={{
            width: 8,
            height: 8,
            borderRadius: "50%",
            background: color,
            boxShadow: `0 0 0 2px color-mix(in srgb, ${color} 22%, transparent)`,
            flexShrink: 0,
          }}
        />
      </div>

      <div
        title={stage.shortLabel}
        style={{
          fontSize: 14,
          fontWeight: 800,
          color: cssVar("text-primary"),
          lineHeight: 1.2,
          letterSpacing: "-0.02em",
          display: "-webkit-box",
          WebkitLineClamp: 2,
          WebkitBoxOrient: "vertical",
          overflow: "hidden",
          minHeight: 34,
        }}
      >
        {stage.shortLabel}
      </div>

      <div style={{ display: "flex", flexDirection: "column", justifyContent: "flex-end", minHeight: 0, gap: 3 }}>
        <div className="lisn-num" style={{ fontSize: 20, fontWeight: 800, color, lineHeight: 1 }}>
          {fmt(animatedContacts)}
        </div>
        <div style={{ fontSize: 10, color: cssVar("text-muted"), lineHeight: 1.2 }}>{stage.sharePct}% of break</div>
        <div
          style={{
            fontSize: 9,
            fontWeight: 800,
            letterSpacing: "0.04em",
            textTransform: "uppercase",
            color,
            marginTop: 2,
          }}
        >
          {ragLabel(stage.rag)}
        </div>
      </div>

      <div style={{ display: "flex", alignItems: "flex-end", minHeight: 0 }}>
        <div
          aria-hidden
          style={{
            width: "100%",
            height: `${Math.max(12, loadPct)}%`,
            minHeight: 5,
            borderRadius: "5px 5px 2px 2px",
            background: `linear-gradient(180deg, ${color}, color-mix(in srgb, ${color} 45%, transparent))`,
            opacity: selected ? 1 : 0.8,
          }}
        />
      </div>
    </button>
  );
}

/** Lifecycle journey strip — S1…S9 where trust breaks. Click a stage for detail. */
export function TrustStageLifecyclePie({ range }: { range: TrustRangeKey }): React.ReactElement {
  const stages = TRUST_LIFECYCLE_STAGES;
  const R = TRUST_RANGES[range];
  const rangeFactor = R.f;
  const scale = (n: number): number => n * rangeFactor;

  /** Default to S1 — highest-severity origination signal. */
  const [selectedId, setSelectedId] = useState<TrustLifecycleStageId>("S1");

  useEffect(() => {
    setSelectedId("S1");
  }, [range]);

  const maxContacts = useMemo(() => Math.max(...stages.map((s) => s.contacts), 1), [stages]);
  const selected = stages.find((s) => s.id === selectedId) ?? stages[0]!;
  const selectedColor = ragColor(selected.rag);

  return (
    <div
      key={range}
      style={{
        display: "flex",
        flexDirection: "column",
        gap: 14,
        minHeight: 0,
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 12,
          flexWrap: "wrap",
          flexShrink: 0,
          minHeight: 24,
        }}
      >
        <div
          style={{
            fontSize: 11,
            fontWeight: 700,
            letterSpacing: "0.04em",
            textTransform: "uppercase",
            color: cssVar("text-muted"),
            lineHeight: 1,
          }}
        >
          Order lifecycle · S1 → S9
        </div>
        <div style={{ display: "inline-flex", alignItems: "center", gap: 10 }}>
          {(
            [
              { tone: "red" as const, label: "Critical / Elevated", color: cssVar("severity-high") },
              { tone: "amber" as const, label: "Watch", color: cssVar("severity-med") },
              { tone: "green" as const, label: "Healthy", color: cssVar("positive") },
            ] as const
          ).map((item) => (
            <span
              key={item.tone}
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 5,
                fontSize: 10,
                fontWeight: 700,
                color: cssVar("text-muted"),
              }}
            >
              <span style={{ width: 7, height: 7, borderRadius: "50%", background: item.color }} />
              {item.label}
            </span>
          ))}
        </div>
      </div>

      <div
        style={{
          display: "flex",
          alignItems: "stretch",
          gap: 6,
          overflowX: "auto",
          paddingBottom: 2,
          flexShrink: 0,
          minHeight: 168,
        }}
      >
        {stages.map((stage, index) => (
          <React.Fragment key={stage.id}>
            <JourneyStageNode
              stage={stage}
              selected={selectedId === stage.id}
              maxContacts={maxContacts}
              scale={scale}
              onSelect={setSelectedId}
            />
            {index < stages.length - 1 ? (
              <div
                aria-hidden
                style={{
                  width: 10,
                  flexShrink: 0,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: cssVar("text-muted"),
                  opacity: 0.45,
                }}
              >
                <ArrowRight size={12} strokeWidth={2.4} />
              </div>
            ) : null}
          </React.Fragment>
        ))}
      </div>

      <div
        style={{
          padding: "16px 16px",
          borderRadius: radius.lg,
          border: `1px solid ${selectedColor}44`,
          background: `linear-gradient(180deg, color-mix(in srgb, ${selectedColor} 9%, ${cssVar("surface")}), ${cssVar("surface")})`,
          boxShadow: cssVar("shadow-card"),
          minHeight: 0,
        }}
      >
        <StageDetailBreakdown stage={selected} color={selectedColor} scale={scale} periodLabel={R.delta} range={range} />
      </div>
    </div>
  );
}
