"use client";

import React, { useEffect, useMemo, useState } from "react";
import { ArrowRight, ListChecks } from "lucide-react";
import {
  TRUST_DRIVERS,
  TRUST_LIFECYCLE_STAGES,
  TRUST_RANGES,
  scaleTrustCrLabel,
  type TrustDriver,
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
}: {
  stage: TrustLifecycleStage;
  color: string;
}): React.ReactElement {
  const insight = stage.aiInsight;
  const evidenceLines = stage.evidence.slice(0, 2);
  const statusLabel = ragLabel(stage.rag);

  const beatRow = (label: string, body: string): React.ReactElement => (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "64px minmax(0, 1fr)",
        gap: 10,
        alignItems: "start",
      }}
    >
      <span
        style={{
          fontSize: 10,
          fontWeight: 800,
          letterSpacing: "0.05em",
          textTransform: "uppercase",
          color,
          paddingTop: 2,
        }}
      >
        {label}
      </span>
      <span style={{ fontSize: 13, color: cssVar("text-secondary"), lineHeight: 1.45 }}>{body}</span>
    </div>
  );

  return (
    <aside
      aria-label="Next Action & steps"
      style={{
        display: "flex",
        flexDirection: "column",
        gap: 10,
        minWidth: 0,
        width: "100%",
        height: "100%",
        padding: "16px 18px",
        borderRadius: radius.lg,
        border: `1px solid ${color}44`,
        borderLeft: `4px solid ${color}`,
        background: `linear-gradient(165deg, color-mix(in srgb, ${color} 10%, ${cssVar("surface")}), ${cssVar("surface")})`,
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
            fontSize: 12,
            fontWeight: 800,
            color,
            letterSpacing: "0.05em",
            textTransform: "uppercase",
          }}
        >
          <ListChecks size={14} strokeWidth={2.4} /> Next Action &amp; steps
          <ConfidenceChip conf={insight.confidence} small />
        </span>
        <span style={{ fontSize: 12, color: cssVar("text-muted"), whiteSpace: "nowrap" }}>
          Owner · <b style={{ color: cssVar("text-primary"), fontWeight: 700 }}>{stage.fixOwner}</b>
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
            fontWeight: 800,
            letterSpacing: "0.04em",
            color,
            padding: "3px 8px",
            borderRadius: radius.pill,
            border: `1px solid ${color}44`,
            background: `color-mix(in srgb, ${color} 12%, transparent)`,
          }}
        >
          {statusLabel}
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
      </div>

      <div style={{ fontSize: 16, fontWeight: 800, color: cssVar("text-primary"), lineHeight: 1.35, letterSpacing: "-0.02em" }}>
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
              fontSize: 11,
              fontWeight: 800,
              letterSpacing: "0.05em",
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
                fontSize: 12.5,
                color: cssVar("text-secondary"),
                lineHeight: 1.45,
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
          padding: "10px 12px",
          borderRadius: radius.sm,
          border: `1px solid ${color}44`,
          background: `color-mix(in srgb, ${color} 12%, transparent)`,
          fontSize: 13,
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

function PlainBreakdownRow({
  label,
  value,
  color,
  emphasize,
  metric,
}: {
  label: string;
  value: React.ReactNode;
  color?: string;
  emphasize?: boolean;
  metric?: boolean;
}): React.ReactElement {
  const valueFontSize = emphasize ? 16 : metric ? 14 : 13;
  const valueWeight = emphasize ? 800 : metric ? 700 : 600;

  return (
    <div
      style={{
        display: "flex",
        alignItems: "baseline",
        justifyContent: "space-between",
        gap: 20,
        padding: "10px 0",
        borderBottom: `1px solid ${cssVar("border")}`,
      }}
    >
      <span style={{ fontSize: 12, fontWeight: 600, color: cssVar("text-muted"), flexShrink: 0, lineHeight: 1.3 }}>
        {label}
      </span>
      <span
        className={emphasize || metric ? "lisn-num" : undefined}
        style={{
          fontSize: valueFontSize,
          fontWeight: valueWeight,
          color: color ?? cssVar("text-primary"),
          textAlign: "right",
          lineHeight: 1.35,
        }}
      >
        {value}
      </span>
    </div>
  );
}

function stageDriverMetrics(
  drivers: TrustDriver[],
  scale: (n: number) => number,
): {
  blastRate: string;
  incidentRate: string;
  cliffLines: { label: string; count: number }[];
  slopeLines: { label: string; count: number }[];
} {
  if (drivers.length === 0) {
    return { blastRate: "—", incidentRate: "—", cliffLines: [], slopeLines: [] };
  }

  const totalComplaints = drivers.reduce((sum, d) => sum + d.complaints, 0);
  const blastRate = Math.round(
    drivers.reduce((sum, d) => sum + d.blastRadius * d.complaints, 0) / Math.max(totalComplaints, 1),
  );
  const incidentRate = (
    drivers.reduce((sum, d) => sum + d.incidentRate * d.complaints, 0) / Math.max(totalComplaints, 1)
  ).toFixed(1);

  return {
    blastRate: String(blastRate),
    incidentRate: `${incidentRate} /1k`,
    cliffLines: drivers
      .filter((d) => d.cliffOrSlope === "cliff")
      .map((d) => ({ label: d.label, count: scale(d.complaints) })),
    slopeLines: drivers
      .filter((d) => d.cliffOrSlope === "slope")
      .map((d) => ({ label: d.label, count: scale(d.complaints) })),
  };
}

function StageBreakdownPanel({
  stage,
  color,
  range,
  scale,
}: {
  stage: TrustLifecycleStage;
  color: string;
  range: TrustRangeKey;
  scale: (n: number) => number;
}): React.ReactElement {
  const { breakdown } = stage;
  const gmvExposure = scaleTrustCrLabel(stage.pnlAtRisk, range);
  const drivers = stage.driverIds
    .map((id) => TRUST_DRIVERS.find((d) => d.id === id))
    .filter((d): d is TrustDriver => d != null);
  const metrics = stageDriverMetrics(drivers, scale);
  const statusLabel = ragLabel(stage.rag);
  const cliffColor = cssVar("severity-high");
  const slopeColor = cssVar("severity-med");

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        minWidth: 0,
        height: "100%",
        padding: "16px 18px",
        borderRadius: radius.lg,
        border: `1px solid ${color}40`,
        borderLeft: `4px solid ${color}`,
        background: `linear-gradient(165deg, color-mix(in srgb, ${color} 8%, ${cssVar("surface")}), ${cssVar("surface")})`,
        boxShadow: cssVar("shadow-card"),
        boxSizing: "border-box",
      }}
    >
      <div style={{ marginBottom: 12, display: "flex", alignItems: "center", justifyContent: "space-between", gap: 10, flexWrap: "wrap" }}>
        <span style={{ fontSize: 15, fontWeight: 800, color: cssVar("text-primary"), lineHeight: 1.25, letterSpacing: "-0.01em" }}>
          {stage.label}
        </span>
        <span
          style={{
            fontSize: 10,
            fontWeight: 800,
            letterSpacing: "0.04em",
            textTransform: "uppercase",
            color,
            padding: "3px 8px",
            borderRadius: radius.pill,
            border: `1px solid ${color}44`,
            background: `color-mix(in srgb, ${color} 12%, transparent)`,
          }}
        >
          {statusLabel}
        </span>
      </div>

      <PlainBreakdownRow label="Categories" value={breakdown.categories} />
      <PlainBreakdownRow label="Pincode" value={breakdown.pincode} />
      <PlainBreakdownRow label="Top complaint" value={breakdown.topComplaint} />
      <PlainBreakdownRow label="GMV exposure" value={gmvExposure} color={color} emphasize />
      <PlainBreakdownRow label="Blast rate" value={metrics.blastRate} metric />
      <PlainBreakdownRow label="Incident rate" value={metrics.incidentRate} metric />

      {metrics.cliffLines.length > 0 ? (
        metrics.cliffLines.map((line) => (
          <PlainBreakdownRow
            key={`cliff-${line.label}`}
            label="Cliff · complaint"
            value={
              <span style={{ display: "inline-flex", alignItems: "baseline", gap: 6, flexWrap: "wrap", justifyContent: "flex-end" }}>
                <span style={{ fontSize: 13, fontWeight: 600, color: cssVar("text-primary") }}>{line.label}</span>
                <span style={{ fontSize: 13, fontWeight: 400, color: cssVar("text-muted") }}>·</span>
                <span className="lisn-num" style={{ fontSize: 14, fontWeight: 800, color: cliffColor }}>
                  {fmt(line.count)}
                </span>
              </span>
            }
          />
        ))
      ) : (
        <PlainBreakdownRow label="Cliff · complaint" value="—" />
      )}

      {metrics.slopeLines.length > 0 ? (
        metrics.slopeLines.map((line) => (
          <PlainBreakdownRow
            key={`slope-${line.label}`}
            label="Slope · complaint"
            value={
              <span style={{ display: "inline-flex", alignItems: "baseline", gap: 6, flexWrap: "wrap", justifyContent: "flex-end" }}>
                <span style={{ fontSize: 13, fontWeight: 600, color: cssVar("text-primary") }}>{line.label}</span>
                <span style={{ fontSize: 13, fontWeight: 400, color: cssVar("text-muted") }}>·</span>
                <span className="lisn-num" style={{ fontSize: 14, fontWeight: 800, color: slopeColor }}>
                  {fmt(line.count)}
                </span>
              </span>
            }
          />
        ))
      ) : (
        <PlainBreakdownRow label="Slope · complaint" value="—" />
      )}
    </div>
  );
}

function StageDetailBreakdown({
  stage,
  color,
  scale,
  range,
}: {
  stage: TrustLifecycleStage;
  color: string;
  scale: (n: number) => number;
  periodLabel: string;
  range: TrustRangeKey;
}): React.ReactElement {
  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "minmax(0, 0.82fr) minmax(320px, 1.18fr)",
        gap: 14,
        alignItems: "stretch",
        minWidth: 0,
      }}
    >
      <StageBreakdownPanel stage={stage} color={color} range={range} scale={scale} />

      <div style={{ minWidth: 0, minHeight: 0, display: "flex", alignSelf: "stretch" }}>
        <StageWhatNext stage={stage} color={color} />
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
          padding: 1,
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
