"use client";

import React, { useMemo, useState } from "react";
import { Flame, Users, Zap } from "lucide-react";
import {
  ECOMMERCE_FCI_HEATMAP,
  ECOMMERCE_FCI_INTENTS,
  ECOMMERCE_FCI_PILLARS,
  computeEfficiencyInsight,
  computeFciBottleneck,
  computeOwnershipAverage,
  fciScoreBg,
  fciScoreColor,
  fciScoreLabel,
} from "../../lib/ecommerceFciHeatmapData";
import { cssVar, radius } from "../../theme/tokens";

export function EcommerceFciIntentHeatmap(): React.ReactElement {
  const [hoveredCell, setHoveredCell] = useState<{ pillar: string; intent: string } | null>(null);

  const bottleneck = useMemo(() => computeFciBottleneck(), []);
  const ownershipAvg = useMemo(() => computeOwnershipAverage(), []);
  const efficiency = useMemo(() => computeEfficiencyInsight(), []);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      <div style={{ overflowX: "auto" }}>
        <div style={{ minWidth: 860 }}>
          <div style={{ display: "flex" }}>
            <div style={{ width: 132, flexShrink: 0 }} />
            {ECOMMERCE_FCI_INTENTS.map((intent) => (
              <div key={intent.id} style={{ flex: 1, padding: "0 4px 12px", textAlign: "center" }}>
                <span style={{ fontSize: 11, fontWeight: 600, lineHeight: 1.35, color: cssVar("text-muted") }}>
                  {intent.label}
                </span>
              </div>
            ))}
          </div>

          {ECOMMERCE_FCI_PILLARS.map((pillar) => (
            <div key={pillar.id} style={{ display: "flex", marginBottom: 4 }}>
              <div style={{ width: 132, flexShrink: 0, display: "flex", alignItems: "center", gap: 8, paddingRight: 10 }}>
                <pillar.icon size={16} color={pillar.color} />
                <span
                  style={{
                    fontSize: 11,
                    fontWeight: 700,
                    textTransform: "uppercase",
                    letterSpacing: 0.35,
                    color: cssVar("text-primary"),
                    lineHeight: 1.25,
                  }}
                >
                  {pillar.label}
                </span>
              </div>

              {ECOMMERCE_FCI_INTENTS.map((intent) => {
                const cell = ECOMMERCE_FCI_HEATMAP[pillar.id][intent.id];
                const isHovered = hoveredCell?.pillar === pillar.id && hoveredCell?.intent === intent.id;
                const scoreColor = fciScoreColor(cell.score);

                return (
                  <div
                    key={intent.id}
                    style={{ flex: 1, padding: "0 2px" }}
                    onMouseEnter={() => setHoveredCell({ pillar: pillar.id, intent: intent.id })}
                    onMouseLeave={() => setHoveredCell(null)}
                  >
                    <div
                      style={{
                        position: "relative",
                        padding: 8,
                        borderRadius: radius.md,
                        cursor: "pointer",
                        background: fciScoreBg(cell.score),
                        border: isHovered ? `2px solid ${scoreColor}` : `1px solid ${cssVar("border")}`,
                        transform: isHovered ? "scale(1.02)" : "scale(1)",
                        boxShadow: isHovered ? `0 4px 12px ${scoreColor}40` : "none",
                        transition: "transform 0.15s ease, box-shadow 0.15s ease, border-color 0.15s ease",
                      }}
                    >
                      <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", marginBottom: 4 }}>
                        <span className="lisn-num" style={{ fontSize: 18, fontWeight: 800, color: scoreColor, lineHeight: 1 }}>
                          {cell.score}
                        </span>
                        <span style={{ fontSize: 9, fontWeight: 700, color: scoreColor, letterSpacing: 0.3 }}>
                          {fciScoreLabel(cell.score)}
                        </span>
                      </div>
                      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 4 }}>
                        <span style={{ fontSize: 9, color: cssVar("text-muted") }}>Cases {cell.caseCount.toLocaleString()}</span>
                        <span style={{ fontSize: 9, color: cssVar("text-muted") }}>{cell.avgHandleTime}</span>
                      </div>

                      {isHovered ? (
                        <div
                          style={{
                            position: "absolute",
                            zIndex: 50,
                            bottom: "100%",
                            left: "50%",
                            transform: "translateX(-50%)",
                            marginBottom: 8,
                            minWidth: 188,
                            padding: 12,
                            borderRadius: radius.lg,
                            background: cssVar("surface-raised"),
                            border: `1px solid ${cssVar("border-strong")}`,
                            boxShadow: "0 8px 24px rgba(0,0,0,0.45)",
                          }}
                        >
                          <p style={{ margin: "0 0 6px", fontSize: 12, fontWeight: 700, color: cssVar("text-primary") }}>
                            {intent.label}
                          </p>
                          <p style={{ margin: "0 0 8px", fontSize: 10, color: cssVar("text-muted") }}>
                            {pillar.label} performance
                          </p>
                          <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                            <div style={{ display: "flex", justifyContent: "space-between", gap: 12 }}>
                              <span style={{ fontSize: 10, color: cssVar("text-muted") }}>Score</span>
                              <span className="lisn-num" style={{ fontSize: 12, fontWeight: 800, color: scoreColor }}>
                                {cell.score}/100
                              </span>
                            </div>
                            <div style={{ display: "flex", justifyContent: "space-between", gap: 12 }}>
                              <span style={{ fontSize: 10, color: cssVar("text-muted") }}>Total cases</span>
                              <span className="lisn-num" style={{ fontSize: 12, fontWeight: 600, color: cssVar("text-primary") }}>
                                {cell.caseCount.toLocaleString()}
                              </span>
                            </div>
                            <div style={{ display: "flex", justifyContent: "space-between", gap: 12 }}>
                              <span style={{ fontSize: 10, color: cssVar("text-muted") }}>Avg handle time</span>
                              <span className="lisn-num" style={{ fontSize: 12, fontWeight: 600, color: cssVar("text-primary") }}>
                                {cell.avgHandleTime}
                              </span>
                            </div>
                          </div>
                        </div>
                      ) : null}
                    </div>
                  </div>
                );
              })}
            </div>
          ))}
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, minmax(0, 1fr))", gap: 12 }}>
        <InsightCard
          icon={Flame}
          iconColor="#ef4444"
          iconBg="#ef444420"
          title="Bottleneck"
          body={
            <>
              <span style={{ color: "#ef4444" }}>{bottleneck.pillar}</span> for{" "}
              <span style={{ color: "#ef4444" }}>{bottleneck.intent}</span> has lowest score ({bottleneck.score}).
            </>
          }
        />
        <InsightCard
          icon={Users}
          iconColor="#3b82f6"
          iconBg="#3b82f620"
          title="Ownership"
          body={
            <>
              Average &ldquo;Take Ownership&rdquo; score across all intents is{" "}
              <span style={{ color: fciScoreColor(ownershipAvg), fontWeight: 700 }}>{ownershipAvg}%</span>.
            </>
          }
        />
        <InsightCard
          icon={Zap}
          iconColor="#f97316"
          iconBg="#f9731620"
          title="Efficiency"
          body={
            <>
              <span style={{ color: "#22c55e" }}>{efficiency.better}</span> ({efficiency.betterScore}) outperforms{" "}
              <span style={{ color: "#ef4444" }}>{efficiency.worse}</span> ({efficiency.worseScore}) in ease of resolution.
            </>
          }
        />
      </div>
    </div>
  );
}

function InsightCard({
  icon: Icon,
  iconColor,
  iconBg,
  title,
  body,
}: {
  icon: React.ComponentType<{ size?: number; color?: string }>;
  iconColor: string;
  iconBg: string;
  title: string;
  body: React.ReactNode;
}): React.ReactElement {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "flex-start",
        gap: 12,
        padding: 14,
        borderRadius: radius.lg,
        background: cssVar("surface-raised"),
        border: `1px solid ${cssVar("border")}`,
        minWidth: 0,
      }}
    >
      <div style={{ padding: 8, borderRadius: radius.md, background: iconBg, flexShrink: 0 }}>
        <Icon size={18} color={iconColor} />
      </div>
      <div style={{ minWidth: 0 }}>
        <h4 style={{ margin: "0 0 4px", fontSize: 13, fontWeight: 700, color: cssVar("text-primary") }}>{title}</h4>
        <p style={{ margin: 0, fontSize: 12, lineHeight: 1.45, color: cssVar("text-muted") }}>{body}</p>
      </div>
    </div>
  );
}
