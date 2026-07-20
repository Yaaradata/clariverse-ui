"use client";

import React, { useMemo, useState } from "react";
import { ArrowRight, MapPin, Package, Store } from "lucide-react";
import {
  LIFECYCLE_MATRIX_CELLS,
  LIFECYCLE_MATRIX_MODEL_NOTE,
  LIFECYCLE_MATRIX_STAGES,
  lifecycleSeverity,
  rankedLifecycleBreakages,
  type CliffSlopeTag,
  type LifecycleMatrixCell,
} from "../../lib/cxHeadRetailV3LifecycleMatrixData";
import { ConfidenceBand } from "../common/ConfidenceBand";
import { DraftActionFooter } from "../common/DraftActionFooter";
import { cssVar, radius, space } from "../../theme/tokens";

function cliffSlopeColor(tag: CliffSlopeTag): string {
  return tag === "cliff" ? cssVar("severity-high") : cssVar("severity-med");
}

function CliffSlopePill({ tag }: { tag: CliffSlopeTag }): React.ReactElement {
  const color = cliffSlopeColor(tag);
  return (
    <span
      style={{
        fontSize: 9,
        fontWeight: 800,
        letterSpacing: "0.04em",
        textTransform: "uppercase",
        color,
        background: `${color}14`,
        border: `1px solid ${color}40`,
        borderRadius: radius.pill,
        padding: "2px 7px",
        flexShrink: 0,
      }}
    >
      {tag}
    </span>
  );
}

function TopBreakageStrip({
  cells,
  selectedId,
  onSelect,
}: {
  cells: LifecycleMatrixCell[];
  selectedId: string;
  onSelect: (id: string) => void;
}): React.ReactElement {
  const top = cells.slice(0, 3);
  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(3, minmax(0, 1fr))",
        gap: 10,
        marginBottom: 12,
      }}
    >
      {top.map((cell, idx) => {
        const active = cell.id === selectedId;
        const accent = cliffSlopeColor(cell.cliffOrSlope);
        return (
          <button
            key={cell.id}
            type="button"
            onClick={() => onSelect(cell.id)}
            style={{
              textAlign: "left",
              padding: "10px 12px",
              borderRadius: radius.md,
              border: active ? `1.5px solid ${accent}` : `1px solid ${cssVar("border")}`,
              background: active ? `${accent}10` : cssVar("surface-raised"),
              cursor: "pointer",
              minWidth: 0,
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 4 }}>
              <span style={{ fontSize: 10, fontWeight: 800, color: cssVar("text-muted") }}>#{idx + 1}</span>
              <CliffSlopePill tag={cell.cliffOrSlope} />
            </div>
            <div
              style={{
                fontSize: 12,
                fontWeight: 700,
                color: cssVar("text-primary"),
                lineHeight: 1.3,
                marginBottom: 4,
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
              }}
              title={cell.topComplaint}
            >
              {cell.topComplaint}
            </div>
            <div style={{ fontSize: 10, color: cssVar("text-muted") }}>
              {cell.stage} · severity {(lifecycleSeverity(cell) / 10).toFixed(0)}
            </div>
          </button>
        );
      })}
    </div>
  );
}

function DrillPath({ cell }: { cell: LifecycleMatrixCell }): React.ReactElement {
  const steps = [
    { icon: Package, label: "Breakage", value: cell.drill.breakage },
    { icon: Package, label: "Category", value: cell.drill.category },
    { icon: MapPin, label: "PIN code", value: cell.drill.pinCode },
    { icon: Store, label: "Marketplace vs own", value: cell.drill.marketplaceVsOwn },
  ] as const;

  return (
    <div
      style={{
        display: "flex",
        flexWrap: "wrap",
        alignItems: "center",
        gap: 6,
        padding: "10px 12px",
        borderRadius: radius.md,
        background: cssVar("surface-raised"),
        border: `1px solid ${cssVar("border")}`,
        marginTop: 10,
      }}
    >
      {steps.map((step, i) => {
        const Icon = step.icon;
        return (
          <React.Fragment key={step.label}>
            {i > 0 ? <ArrowRight size={12} color={cssVar("text-muted")} style={{ flexShrink: 0 }} /> : null}
            <div style={{ display: "flex", alignItems: "center", gap: 5, minWidth: 0 }}>
              <Icon size={11} color={cssVar("accent-2")} style={{ flexShrink: 0 }} />
              <div style={{ minWidth: 0 }}>
                <div style={{ fontSize: 8, fontWeight: 800, color: cssVar("text-muted"), textTransform: "uppercase" }}>
                  {step.label}
                </div>
                <div
                  style={{
                    fontSize: 11,
                    fontWeight: 600,
                    color: cssVar("text-primary"),
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap",
                    maxWidth: 160,
                  }}
                  title={step.value}
                >
                  {step.value}
                </div>
              </div>
            </div>
          </React.Fragment>
        );
      })}
    </div>
  );
}

function MatrixRow({
  cell,
  selected,
  onSelect,
}: {
  cell: LifecycleMatrixCell;
  selected: boolean;
  onSelect: () => void;
}): React.ReactElement {
  const accent = cliffSlopeColor(cell.cliffOrSlope);

  return (
    <button
      type="button"
      onClick={onSelect}
      style={{
        display: "grid",
        gridTemplateColumns: "140px minmax(0, 1.4fr) 64px minmax(100px, 0.9fr) minmax(0, 1.3fr) 88px",
        gap: 10,
        alignItems: "center",
        width: "100%",
        textAlign: "left",
        padding: "10px 12px",
        borderRadius: radius.md,
        border: selected ? `1.5px solid ${accent}` : `1px solid ${cssVar("border")}`,
        background: selected ? `${accent}0c` : cssVar("surface"),
        cursor: "pointer",
        boxSizing: "border-box",
      }}
    >
      <div>
        <div style={{ fontSize: 12, fontWeight: 800, color: cssVar("text-primary"), lineHeight: 1.25 }}>
          {cell.stage}
        </div>
      </div>
      <div style={{ minWidth: 0 }}>
        <div
          style={{
            fontSize: 12,
            fontWeight: 700,
            color: cssVar("text-primary"),
            lineHeight: 1.3,
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
          }}
          title={cell.topComplaint}
        >
          {cell.topComplaint}
        </div>
        <div style={{ fontSize: 10, color: cssVar("text-muted"), marginTop: 2 }}>
          Rate {cell.incidentRate.toFixed(1)} /1k · {cell.incidents.toLocaleString("en-IN")} contacts
        </div>
      </div>
      <CliffSlopePill tag={cell.cliffOrSlope} />
      <div style={{ fontSize: 11, fontWeight: 600, color: cssVar("text-secondary"), lineHeight: 1.3 }}>
        {cell.owner}
      </div>
      <div style={{ fontSize: 11, fontWeight: 600, color: cssVar("accent-2"), lineHeight: 1.35 }} title={cell.nextAction}>
        {cell.nextAction}
      </div>
      <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 2 }}>
        <span className="lisn-num" style={{ fontSize: 14, fontWeight: 800, color: accent }}>
          {cell.blastRadius}
        </span>
        <span style={{ fontSize: 8, fontWeight: 700, color: cssVar("text-muted"), textTransform: "uppercase" }}>
          Blast
        </span>
      </div>
    </button>
  );
}

/** Lifecycle × complaint matrix — ranked by incident rate × network effect. */
export function TrustLifecycleMatrix(): React.ReactElement {
  const byStage = useMemo(() => {
    const map = new Map(LIFECYCLE_MATRIX_CELLS.map((c) => [c.stage, c]));
    return LIFECYCLE_MATRIX_STAGES.map((stage) => {
      const cell = map.get(stage);
      if (!cell) {
        throw new Error(`Missing lifecycle matrix cell for stage: ${stage}`);
      }
      return cell;
    });
  }, []);

  const ranked = useMemo(() => rankedLifecycleBreakages(LIFECYCLE_MATRIX_CELLS), []);
  const [selectedId, setSelectedId] = useState(ranked[0]?.id ?? byStage[0].id);
  const selected = byStage.find((c) => c.id === selectedId) ?? ranked[0] ?? byStage[0];

  return (
    <div
      style={{
        padding: 14,
        borderRadius: radius.lg,
        background: cssVar("surface"),
        border: `1px solid ${cssVar("border")}`,
        boxShadow: cssVar("shadow-card"),
      }}
    >
      <div style={{ display: "flex", justifyContent: "space-between", gap: 12, alignItems: "flex-start", marginBottom: 10 }}>
        <div style={{ minWidth: 0 }}>
          <h3 style={{ margin: 0, fontSize: 15, fontWeight: 800, color: cssVar("text-primary") }}>
            Lifecycle × complaint matrix
          </h3>
          <p style={{ margin: `${space["1"]} 0 0`, fontSize: 11, color: cssVar("text-muted"), lineHeight: 1.4 }}>
            {LIFECYCLE_MATRIX_MODEL_NOTE}
          </p>
        </div>
      </div>

      <TopBreakageStrip cells={ranked} selectedId={selectedId} onSelect={setSelectedId} />

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "140px minmax(0, 1.4fr) 64px minmax(100px, 0.9fr) minmax(0, 1.3fr) 88px",
          gap: 10,
          padding: "0 12px 6px",
          fontSize: 9,
          fontWeight: 800,
          letterSpacing: "0.04em",
          textTransform: "uppercase",
          color: cssVar("text-muted"),
        }}
      >
        <span>Stage</span>
        <span>Top complaint</span>
        <span>Tag</span>
        <span>Owner</span>
        <span>Next action</span>
        <span style={{ textAlign: "right" }}>Blast</span>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
        {byStage.map((cell) => (
          <MatrixRow
            key={cell.id}
            cell={cell}
            selected={cell.id === selectedId}
            onSelect={() => setSelectedId(cell.id)}
          />
        ))}
      </div>

      <DrillPath cell={selected} />

      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          alignItems: "center",
          gap: 10,
          marginTop: 10,
          padding: "8px 12px",
          borderRadius: radius.md,
          background: cssVar("accent-soft"),
          border: `1px solid ${cssVar("accent")}28`,
        }}
      >
        <span style={{ fontSize: 11, color: cssVar("text-secondary") }}>
          Blast radius <strong className="lisn-num">{selected.blastRadius}</strong> (inferred · network effect)
        </span>
        <ConfidenceBand band={selected.blastConfidence} />
        <span style={{ fontSize: 11, color: cssVar("text-muted"), marginLeft: "auto" }}>
          Next: {selected.nextAction}
        </span>
      </div>

      <div style={{ marginTop: 12 }}>
        <DraftActionFooter draftText={selected.nextAction} draftKind="route" />
      </div>
    </div>
  );
}
