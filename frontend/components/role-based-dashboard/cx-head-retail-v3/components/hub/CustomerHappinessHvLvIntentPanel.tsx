"use client";

import React from "react";
import { Sparkle } from "../common/Sparkle";
import { DetailSection } from "./HubDetailPrimitives";
import {
  HV_SHOPPER_INTENTS,
  LV_SHOPPER_INTENTS,
  type HvLvIntentRow,
} from "../../lib/cxHeadRetailV3HvLvIntentData";
import { cssVar, radius } from "../../theme/tokens";

const INTENT_GRID_COLUMNS = "10px minmax(0, 1fr) 54px 72px 52px";
const HV_COLOR = "#06B6D4";
const LV_COLOR = "#F59E0B";

function sentimentColor(score: number): string {
  if (score > 0.05) return cssVar("positive");
  if (score < -0.05) return cssVar("severity-high");
  return cssVar("severity-med");
}

function sentimentFace(score: number): string {
  if (score > 0.2) return "😊";
  if (score > -0.2) return "😐";
  return "😞";
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
  const nps = Math.round(row.sentiment * 100);

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
      <span className="lisn-num" style={{ textAlign: "right", fontSize: 12, fontWeight: 800, color: sColor }}>
        {nps > 0 ? "+" : ""}
        {nps}
      </span>
    </div>
  );
}

function IntentGroupCard({
  title,
  subtitle,
  color,
  rows,
}: {
  title: string;
  subtitle: string;
  color: string;
  rows: HvLvIntentRow[];
}): React.ReactElement {
  return (
    <div
      style={{
        borderRadius: radius.md,
        background: cssVar("surface-raised"),
        borderTop: `1px solid ${color}30`,
        borderRight: `1px solid ${color}30`,
        borderBottom: `1px solid ${color}30`,
        borderLeft: `3px solid ${color}`,
        overflow: "hidden",
      }}
    >
      <div
        style={{
          display: "grid",
          gridTemplateColumns: INTENT_GRID_COLUMNS,
          columnGap: 10,
          alignItems: "center",
          padding: "10px 14px",
          background: `linear-gradient(90deg, ${color}14 0%, transparent 60%)`,
          borderBottom: `1px solid ${cssVar("border")}`,
        }}
      >
        <span />
        <span style={{ fontSize: 11, fontWeight: 800, color, letterSpacing: 0.8, textTransform: "uppercase" }}>
          {title}
        </span>
        <span style={{ fontSize: 9, fontWeight: 700, color: cssVar("text-muted"), textAlign: "right", letterSpacing: 0.6, textTransform: "uppercase" }}>
          Share
        </span>
        <span style={{ fontSize: 9, fontWeight: 700, color: cssVar("text-muted"), textAlign: "right", letterSpacing: 0.6, textTransform: "uppercase" }}>
          Happiness
        </span>
        <span style={{ fontSize: 9, fontWeight: 700, color: cssVar("text-muted"), textAlign: "right", letterSpacing: 0.6, textTransform: "uppercase" }}>
          NPS
        </span>
      </div>
      <div style={{ padding: "0 2px", fontSize: 10, color: cssVar("text-muted"), margin: "6px 14px 0" }}>{subtitle}</div>
      <div>
        {rows.map((row, index) => (
          <IntentRowCard key={`${title}-${row.intent}`} row={row} color={color} isLast={index === rows.length - 1} />
        ))}
      </div>
    </div>
  );
}

function weightedAvg(rows: HvLvIntentRow[]): number {
  const totalShare = rows.reduce((sum, row) => sum + row.share, 0);
  if (totalShare <= 0) return 0;
  return rows.reduce((sum, row) => sum + row.sentiment * row.share, 0) / totalShare;
}

/** Top intents × sentiment — HV vs LV (head_retail pattern) */
export function CustomerHappinessHvLvIntentPanel(): React.ReactElement {
  const avgHV = weightedAvg(HV_SHOPPER_INTENTS);
  const avgLV = weightedAvg(LV_SHOPPER_INTENTS);
  const hvNps = Math.round(avgHV * 100);
  const lvNps = Math.round(avgLV * 100);

  return (
    <DetailSection
      premium
      title="Top Intents × Sentiment — HV vs LV"
      subtitle="What Flipkart Plus & mass shoppers are calling about, and how they feel about each intent (last 30 days)"
      trailing={
        <span
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 4,
            fontSize: 9,
            fontWeight: 800,
            letterSpacing: 0.6,
            textTransform: "uppercase",
            color: HV_COLOR,
            padding: "3px 8px",
            borderRadius: radius.pill,
            background: `${HV_COLOR}15`,
            border: `1px solid ${HV_COLOR}40`,
          }}
        >
          <Sparkle size={9} />
          AI
        </span>
      }
    >
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 14 }}>
        {[
          { label: "HV Shoppers", color: HV_COLOR, count: "284 Plus · 1.2K high-GMV", avg: avgHV, nps: hvNps, note: "Flipkart Plus · frequent buyers" },
          { label: "LV Shoppers", color: LV_COLOR, count: "4.8K standard · mass", avg: avgLV, nps: lvNps, note: "Value-seeking · high volume" },
        ].map((meta) => {
          const avgColor = sentimentColor(meta.avg);
          const dialPct = ((meta.avg + 1) / 2) * 100;
          return (
            <div
              key={meta.label}
              style={{
                display: "grid",
                gridTemplateColumns: "1fr auto",
                gap: 14,
                padding: "12px 16px",
                borderRadius: radius.md,
                background: `linear-gradient(135deg, ${meta.color}10 0%, transparent 70%), ${cssVar("surface-raised")}`,
                borderTop: `1px solid ${meta.color}35`,
                borderRight: `1px solid ${meta.color}35`,
                borderBottom: `1px solid ${meta.color}35`,
                borderLeft: `3px solid ${meta.color}`,
              }}
            >
              <div style={{ minWidth: 0 }}>
                <div style={{ fontSize: 11, fontWeight: 800, letterSpacing: 0.7, textTransform: "uppercase", color: meta.color }}>
                  {meta.label}
                </div>
                <div style={{ fontSize: 10, color: cssVar("text-muted"), marginTop: 3 }}>{meta.note}</div>
                <div className="lisn-num" style={{ fontSize: 10, color: cssVar("text-muted"), marginTop: 8 }}>
                  {meta.count}
                </div>
              </div>
              <div style={{ textAlign: "right", minWidth: 110 }}>
                <div style={{ fontSize: 9, color: cssVar("text-muted"), textTransform: "uppercase", letterSpacing: 0.65 }}>
                  Happiness score
                </div>
                <div
                  className="lisn-num"
                  style={{
                    fontSize: 22,
                    fontWeight: 800,
                    color: avgColor,
                    lineHeight: 1.05,
                    display: "flex",
                    alignItems: "center",
                    gap: 6,
                    justifyContent: "flex-end",
                  }}
                >
                  <span style={{ fontSize: 18 }}>{sentimentFace(meta.avg)}</span>
                  <span>
                    {meta.avg > 0 ? "+" : ""}
                    {meta.avg.toFixed(2)}
                  </span>
                </div>
                <div style={{ marginTop: 4, fontSize: 10, color: cssVar("text-muted"), textTransform: "uppercase", letterSpacing: 0.65 }}>
                  NPS{" "}
                  <span className="lisn-num" style={{ color: avgColor, fontWeight: 800 }}>
                    {meta.nps > 0 ? "+" : ""}
                    {meta.nps}
                  </span>
                </div>
                <div
                  style={{
                    marginTop: 8,
                    position: "relative",
                    height: 4,
                    borderRadius: 999,
                    background: `linear-gradient(90deg, ${cssVar("severity-high")} 0%, ${cssVar("severity-med")} 50%, ${cssVar("positive")} 100%)`,
                    opacity: 0.6,
                  }}
                >
                  <div
                    style={{
                      position: "absolute",
                      top: -3,
                      left: `calc(${dialPct}% - 5px)`,
                      width: 10,
                      height: 10,
                      borderRadius: 999,
                      background: avgColor,
                      boxShadow: `0 0 0 2px ${cssVar("surface")}, 0 0 8px ${avgColor}99`,
                    }}
                  />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
        <IntentGroupCard
          title="HV · Top Intents"
          subtitle="Ranked by share of HV contact volume"
          color={HV_COLOR}
          rows={HV_SHOPPER_INTENTS}
        />
        <IntentGroupCard
          title="LV · Top Intents"
          subtitle="Ranked by share of LV contact volume"
          color={LV_COLOR}
          rows={LV_SHOPPER_INTENTS}
        />
      </div>
    </DetailSection>
  );
}
