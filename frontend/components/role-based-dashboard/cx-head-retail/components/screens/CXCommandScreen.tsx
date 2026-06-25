"use client";

import React from "react";
import {
  COMMAND_TIME_COMPARE,
  EXEC_SUMMARY,
  EXECUTIVE_TILES,
  HEADLINE_SIGNAL,
  KPI_RIBBON,
  RADAR_SIGNALS,
  type RadarSignal,
} from "../../lib/cxHeadRetailData";
import { useNavigation } from "../../lib/NavigationContext";
import { AiExecSummaryBar } from "../common/AiExecSummaryBar";
import { ExecutiveTile } from "../common/ExecutiveTile";
import { FloatingAIDayGenerator } from "../common/FloatingAIDayGenerator";
import { RadarRail } from "../common/RadarRail";
import { cssVar, layout, radius, type } from "../../theme/tokens";

function kpiToneColor(tone: "warn" | "down" | "up" | "flat"): string {
  if (tone === "warn" || tone === "down") return cssVar("severity-high");
  if (tone === "up") return cssVar("positive");
  return cssVar("text-muted");
}

/** Pass 2 + 3 — S1 CX Command: triad, KPI ribbon, emerging-issue radar + drill hooks. */
export function CXCommandScreen(): React.ReactElement {
  const { openDrill } = useNavigation();

  const handleOpenSignal = (signal: RadarSignal) => {
    openDrill({
      screenId: "command-centre",
      itemId: signal.id,
      drillSignature: signal.drillSignature,
    });
  };

  return (
    <>
      <div
        className="lisn-anim-fade"
        style={{
          maxWidth: layout.contentMaxWidth,
          margin: "0 auto",
          padding: "24px 32px 48px",
          display: "flex",
          flexDirection: "column",
          gap: 18,
        }}
      >
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 16 }}>
          <div style={{ flex: 1, minWidth: 0 }}>
            <p
              style={{
                margin: 0,
                fontSize: type.scale.caption,
                fontWeight: type.weight.semibold,
                letterSpacing: 0.6,
                textTransform: "uppercase",
                color: cssVar("accent"),
              }}
            >
              What is breaking right now, and who owns it?
            </p>
            <h2
              style={{
                margin: "10px 0 0",
                fontSize: type.scale.display,
                fontWeight: type.weight.bold,
                color: cssVar("text-primary"),
                lineHeight: type.leading.tight,
                letterSpacing: -0.4,
                maxWidth: 920,
              }}
            >
              {HEADLINE_SIGNAL.title}
            </h2>
            <p
              style={{
                margin: "12px 0 0",
                fontSize: type.scale.body,
                color: cssVar("text-secondary"),
                lineHeight: type.leading.normal,
                maxWidth: 820,
              }}
            >
              {HEADLINE_SIGNAL.soWhat}
            </p>
            <p
              style={{
                margin: "8px 0 0",
                fontSize: type.scale.small,
                color: cssVar("text-muted"),
                lineHeight: 1.45,
                maxWidth: 820,
              }}
            >
              {HEADLINE_SIGNAL.explainability}
            </p>
          </div>

          <span
            style={{
              flexShrink: 0,
              padding: "6px 12px",
              borderRadius: radius.pill,
              fontSize: type.scale.caption,
              fontWeight: type.weight.semibold,
              color: cssVar("text-secondary"),
              background: cssVar("surface-raised"),
              border: `1px solid ${cssVar("border")}`,
              whiteSpace: "nowrap",
            }}
          >
            {COMMAND_TIME_COMPARE}
          </span>
        </div>

        <AiExecSummaryBar {...EXEC_SUMMARY} />

        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, minmax(0, 1fr))", gap: 14 }}>
          {EXECUTIVE_TILES.map((tile, index) => (
            <ExecutiveTile key={tile.id} tile={tile} isPrimary={index === 0} />
          ))}
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(4, minmax(0, 1fr))",
            gap: 10,
            padding: "12px 16px",
            borderRadius: radius.md,
            background: cssVar("surface"),
            border: `1px solid ${cssVar("border")}`,
          }}
        >
          {KPI_RIBBON.map((k) => (
            <div key={k.label}>
              <div style={{ fontSize: 11, color: cssVar("text-muted") }}>{k.label}</div>
              <div
                className="lisn-num"
                style={{
                  fontSize: 17,
                  fontWeight: type.weight.bold,
                  color: cssVar("text-primary"),
                  marginTop: 2,
                }}
              >
                {k.value}
              </div>
              <div
                className="lisn-num"
                style={{
                  fontSize: 11,
                  color: kpiToneColor(k.tone),
                  marginTop: 2,
                }}
              >
                {k.delta}
              </div>
            </div>
          ))}
        </div>

        <RadarRail signals={RADAR_SIGNALS} onOpen={handleOpenSignal} />
      </div>

      <FloatingAIDayGenerator />
    </>
  );
}
