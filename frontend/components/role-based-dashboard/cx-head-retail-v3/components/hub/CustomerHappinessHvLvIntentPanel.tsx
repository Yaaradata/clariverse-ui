"use client";

import React, { useState } from "react";
import { ConfidenceBand } from "../common/ConfidenceBand";
import { DetailSection } from "./HubDetailPrimitives";
import {
  HAPPINESS_BASE_WIDE,
  type ValueLens,
} from "../../lib/cxHeadRetailV3HappinessLensData";
import {
  HV_SHOPPER_INTENTS,
  LV_SHOPPER_INTENTS,
  type HvLvIntentRow,
} from "../../lib/cxHeadRetailV3HvLvIntentData";
import { cssVar, radius } from "../../theme/tokens";

const INTENT_GRID_COLUMNS = "10px minmax(0, 1fr) 54px 72px";
const HV_COLOR = "#06B6D4";
const LV_COLOR = "#F59E0B";

function sentimentColor(score: number): string {
  if (score > 0.05) return cssVar("positive");
  if (score < -0.05) return cssVar("severity-high");
  return cssVar("severity-med");
}

function IntentRowCard({
  row,
  color,
  isLast,
}: {
  row: HvLvIntentRow;
  color: string;
  isLast: boolean;
}): React.ReactElement {
  const sColor = sentimentColor(row.sentiment);

  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: INTENT_GRID_COLUMNS,
        columnGap: 10,
        alignItems: "center",
        padding: "10px 14px",
        borderBottom: isLast ? "none" : `1px solid ${cssVar("border")}`,
      }}
      title={`"${row.sampleQuote}"`}
    >
      <span
        style={{
          width: 8,
          height: 8,
          borderRadius: 999,
          background: color,
          boxShadow: `0 0 0 3px ${color}22`,
        }}
      />
      <span
        style={{
          fontSize: 12,
          fontWeight: 700,
          color: cssVar("text-primary"),
          overflow: "hidden",
          textOverflow: "ellipsis",
          whiteSpace: "nowrap",
        }}
      >
        {row.intent}
      </span>
      <span className="lisn-num" style={{ textAlign: "right", fontSize: 13, fontWeight: 800, color: cssVar("text-primary") }}>
        {row.share}%
      </span>
      <span
        className="lisn-num"
        style={{
          textAlign: "right",
          fontSize: 11,
          fontWeight: 800,
          color: sColor,
          whiteSpace: "nowrap",
        }}
      >
        {row.sentiment > 0 ? "+" : ""}
        {row.sentiment.toFixed(2)}
      </span>
    </div>
  );
}

function ValueLensToggle({
  valueLens,
  onChange,
}: {
  valueLens: ValueLens;
  onChange: (lens: ValueLens) => void;
}): React.ReactElement {
  return (
    <div
      style={{
        display: "inline-flex",
        gap: 4,
        padding: 3,
        borderRadius: radius.pill,
        background: cssVar("surface-raised"),
        border: `1px solid ${cssVar("border")}`,
      }}
      role="group"
      aria-label="Value lens"
    >
      {(
        [
          { id: "hv" as const, label: "High-value", note: "Plus + high-GMV" },
          { id: "lv" as const, label: "Low-value", note: "Managed · not dropped" },
        ] as const
      ).map((opt) => {
        const active = valueLens === opt.id;
        const color = opt.id === "hv" ? HV_COLOR : LV_COLOR;
        return (
          <button
            key={opt.id}
            type="button"
            onClick={() => onChange(opt.id)}
            title={opt.note}
            style={{
              fontSize: 11,
              fontWeight: 700,
              padding: "5px 12px",
              borderRadius: radius.pill,
              border: active ? `1px solid ${color}` : "1px solid transparent",
              background: active ? `${color}18` : "transparent",
              color: active ? color : cssVar("text-muted"),
              cursor: "pointer",
            }}
          >
            {opt.label}
          </button>
        );
      })}
    </div>
  );
}

/** Value × reach operating panel — HV default; LV is a toggle, never dropped. */
export function CustomerHappinessHvLvIntentPanel({
  valueLens: controlledLens,
  onValueLensChange,
}: {
  valueLens?: ValueLens;
  onValueLensChange?: (lens: ValueLens) => void;
} = {}): React.ReactElement {
  const [internalLens, setInternalLens] = useState<ValueLens>("hv");
  const valueLens = controlledLens ?? internalLens;
  const setValueLens = onValueLensChange ?? setInternalLens;

  const intentRows = valueLens === "hv" ? HV_SHOPPER_INTENTS : LV_SHOPPER_INTENTS;
  const intentColor = valueLens === "hv" ? HV_COLOR : LV_COLOR;
  const intentTitle = valueLens === "hv" ? "HV · Top Intents (Plus + high-GMV)" : "LV · Top Intents (managed)";

  return (
    <DetailSection premium>
      {/* Base-wide happy rate reminder — independent of value lens */}
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          alignItems: "center",
          gap: 12,
          marginBottom: 14,
          padding: "10px 14px",
          borderRadius: radius.md,
          background: cssVar("surface-raised"),
          border: `1px solid ${cssVar("border")}`,
        }}
        data-testid="happiness-base-wide-rate"
        data-happy-rate={HAPPINESS_BASE_WIDE.happyRate}
      >
        <div>
          <div style={{ fontSize: 10, fontWeight: 800, color: cssVar("text-muted"), textTransform: "uppercase" }}>
            Happy rate · base-wide
          </div>
          <div className="lisn-num" style={{ fontSize: 26, fontWeight: 800, color: cssVar("text-primary"), lineHeight: 1.1 }}>
            {HAPPINESS_BASE_WIDE.happyRate}%
          </div>
        </div>
        <div style={{ fontSize: 11, color: cssVar("text-secondary"), maxWidth: 360, lineHeight: 1.4 }}>
          {HAPPINESS_BASE_WIDE.note} Measured {HAPPINESS_BASE_WIDE.measuredSharePct}% · inferred{" "}
          {HAPPINESS_BASE_WIDE.inferredSharePct}%.
        </div>
        <ConfidenceBand band={HAPPINESS_BASE_WIDE.confidence} />
        <div style={{ marginLeft: "auto" }}>
          <ValueLensToggle valueLens={valueLens} onChange={setValueLens} />
        </div>
      </div>

      <div
        style={{
          borderRadius: radius.md,
          background: cssVar("surface-raised"),
          borderTop: `1px solid ${intentColor}30`,
          borderRight: `1px solid ${intentColor}30`,
          borderBottom: `1px solid ${intentColor}30`,
          borderLeft: `3px solid ${intentColor}`,
          overflow: "hidden",
        }}
        data-testid="happiness-intent-detail"
        data-value-lens={valueLens}
      >
        <div
          style={{
            display: "grid",
            gridTemplateColumns: INTENT_GRID_COLUMNS,
            columnGap: 10,
            alignItems: "center",
            padding: "10px 14px",
            background: `linear-gradient(90deg, ${intentColor}14 0%, transparent 60%)`,
            borderBottom: `1px solid ${cssVar("border")}`,
          }}
        >
          <span />
          <span style={{ fontSize: 11, fontWeight: 800, color: intentColor, letterSpacing: 0.8, textTransform: "uppercase" }}>
            {intentTitle}
          </span>
          <span style={{ fontSize: 9, fontWeight: 700, color: cssVar("text-muted"), textAlign: "right", letterSpacing: 0.6, textTransform: "uppercase" }}>
            Share
          </span>
          <span style={{ fontSize: 9, fontWeight: 700, color: cssVar("text-muted"), textAlign: "right", letterSpacing: 0.6, textTransform: "uppercase" }}>
            Happiness
          </span>
        </div>
        <div>
          {intentRows.map((row, index) => (
            <IntentRowCard
              key={`${valueLens}-${row.intent}`}
              row={row}
              color={intentColor}
              isLast={index === intentRows.length - 1}
            />
          ))}
        </div>
      </div>
    </DetailSection>
  );
}
