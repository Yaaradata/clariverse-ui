"use client";

import React from "react";
import { Bot, ChevronRight } from "lucide-react";
import type { GrowthSharePanel, HubJourneyCardData } from "../../lib/categoryOverviewData";
import { cssVar, radius } from "../../theme/tokens";
import { MiniGauge } from "./MiniSparkline";

function ConversationInsightLines({ text }: { text: string }): React.ReactElement {
  const lines = text
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean)
    .slice(0, 3);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
      {lines.map((line, index) => (
        <p
          key={`insight-line-${index}`}
          style={{
            margin: 0,
            fontSize: 13,
            lineHeight: 1.45,
            fontWeight: 500,
            color: cssVar("text-secondary"),
            whiteSpace: "normal",
            overflowWrap: "break-word",
          }}
        >
          {line}
        </p>
      ))}
    </div>
  );
}

function GrowthShareBody({ panel }: { panel: GrowthSharePanel }): React.ReactElement {
  const rows = [
    {
      label: "Growing Cat.",
      sector: panel.growing,
      namePrefix: "🟢",
      arrow: "↑",
      color: cssVar("positive"),
      showValue: true,
    },
    {
      label: "Falling Cat.",
      sector: panel.losing,
      namePrefix: "🔴",
      arrow: "↓",
      color: cssVar("severity-high"),
      showValue: true,
    },
    {
      label: "Neutral Cat.",
      sector: panel.neutral,
      namePrefix: "🟠",
      arrow: "−",
      color: "#f5a623",
      showValue: false,
    },
  ] as const;

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        flexShrink: 0,
        width: "fit-content",
        maxWidth: "100%",
        minWidth: 168,
      }}
    >
      {rows.map((col, index) => {
        const value = col.sector.gmvGrowth.replace(/^\+/, "");
        return (
          <div
            key={col.label}
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              gap: 16,
              width: "100%",
              padding: "8px 0",
              borderBottom: index < rows.length - 1 ? `1px solid ${cssVar("border")}` : "none",
              boxSizing: "border-box",
            }}
          >
            <div style={{ display: "flex", flexDirection: "column", gap: 3, minWidth: 0 }}>
              <div
                style={{
                  fontSize: 9.5,
                  fontWeight: 650,
                  color: cssVar("text-muted"),
                  textTransform: "uppercase",
                  letterSpacing: 0.45,
                  lineHeight: 1.2,
                }}
              >
                {col.label}
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 5, minWidth: 0 }}>
                <span style={{ fontSize: 10, lineHeight: 1, flexShrink: 0 }} aria-hidden>
                  {col.namePrefix}
                </span>
                <span
                  style={{
                    fontSize: 12,
                    fontWeight: 700,
                    color: cssVar("text-primary"),
                    lineHeight: 1.2,
                    whiteSpace: "nowrap",
                  }}
                >
                  {col.sector.name}
                </span>
              </div>
            </div>

            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: col.showValue ? "flex-end" : "center",
                gap: 5,
                flexShrink: 0,
                minWidth: 58,
              }}
            >
              {col.showValue ? (
                <>
                  <span
                    aria-hidden
                    style={{
                      fontSize: 15,
                      fontWeight: 700,
                      color: col.color,
                      lineHeight: 1,
                    }}
                  >
                    {col.arrow}
                  </span>
                  <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-start", gap: 1 }}>
                    <span
                      className="lisn-num"
                      style={{
                        fontSize: 13,
                        fontWeight: 800,
                        color: col.color,
                        lineHeight: 1.1,
                      }}
                    >
                      {value}
                    </span>
                    <span
                      style={{
                        fontSize: 11,
                        fontWeight: 600,
                        color: cssVar("text-muted"),
                        letterSpacing: 0.35,
                        textTransform: "lowercase",
                        lineHeight: 1.1,
                      }}
                    >
                      wow
                    </span>
                  </div>
                </>
              ) : (
                <span
                  aria-hidden
                  style={{
                    fontSize: 21,
                    fontWeight: 700,
                    color: "rgb(245, 166, 35)",
                    lineHeight: 1,
                  }}
                >
                  −
                </span>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}

/** Hub card — previous metrics format + Conversation AI. */
export function HubJourneyCard({
  card,
  onClick,
}: {
  card: HubJourneyCardData;
  onClick?: () => void;
}): React.ReactElement {
  const Icon = card.icon;
  const interactive = Boolean(onClick);
  const Tag = interactive ? "button" : "div";

  return (
    <Tag
      type={interactive ? "button" : undefined}
      onClick={onClick}
      style={{
        position: "relative",
        textAlign: "left",
        background: cssVar("surface"),
        border: `1px solid ${card.sparkColor}40`,
        borderRadius: radius.lg,
        padding: "18px 18px 16px",
        cursor: interactive ? "pointer" : "default",
        display: "flex",
        flexDirection: "column",
        gap: 14,
        minWidth: 0,
        width: "100%",
        height: "100%",
        boxShadow: String(cssVar("shadow-card")),
        transition: "box-shadow 0.2s ease",
        fontFamily: "inherit",
      }}
      onMouseEnter={
        interactive
          ? (e) => {
              e.currentTarget.style.boxShadow = `0 8px 32px ${card.sparkColor}15`;
            }
          : undefined
      }
      onMouseLeave={
        interactive
          ? (e) => {
              e.currentTarget.style.boxShadow = String(cssVar("shadow-card"));
            }
          : undefined
      }
    >
      <div
        style={{
          display: "flex",
          alignItems: "flex-start",
          justifyContent: "space-between",
          gap: 10,
          minHeight: 64,
        }}
      >
        <div style={{ display: "flex", alignItems: "flex-start", gap: 10, minWidth: 0, flex: 1 }}>
          <div
            style={{
              width: 34,
              height: 34,
              borderRadius: 9,
              background: `${card.iconColor}18`,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexShrink: 0,
              marginTop: 1,
            }}
          >
            <Icon size={17} color={card.iconColor} />
          </div>
          <div style={{ minWidth: 0, flex: 1 }}>
            <div
              style={{
                fontSize: 15,
                fontWeight: 700,
                color: cssVar("text-primary"),
                lineHeight: 1.3,
                display: "-webkit-box",
                WebkitLineClamp: 2,
                WebkitBoxOrient: "vertical",
                overflow: "hidden",
              }}
            >
              {card.title}
            </div>
            <div
              style={{
                fontSize: 12.5,
                color: cssVar("text-muted"),
                lineHeight: 1.35,
                marginTop: 4,
              }}
            >
              {card.subtitle}
            </div>
          </div>
        </div>
        <ChevronRight
          size={22}
          color={cssVar("text-muted")}
          style={{ flexShrink: 0, opacity: interactive ? 0.45 : 0.2, marginTop: 4 }}
          strokeWidth={1.75}
          aria-hidden={!interactive}
        />
      </div>

      {card.growthPanel || card.gauges.length > 0 ? (
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: 16,
            width: "100%",
            minWidth: 0,
          }}
        >
          {card.gauges.length > 0 ? (
            <div
              style={{
                display: "flex",
                alignItems: "flex-end",
                gap: 10,
                flex: "1 1 0",
                minWidth: 0,
                maxWidth: 200,
              }}
            >
              {card.gauges.slice(0, 2).map((gauge) => (
                <MiniGauge
                  key={`${gauge.topLabel ?? ""}-${gauge.label}`}
                  value={gauge.value}
                  label={gauge.label}
                  topLabel={gauge.topLabel}
                  color={gauge.color}
                  showPercent
                />
              ))}
            </div>
          ) : null}
          {card.growthPanel ? <GrowthShareBody panel={card.growthPanel} /> : null}
        </div>
      ) : null}

      {card.bottleneck ? (
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: 3,
            paddingTop: 2,
          }}
        >
          <div
            style={{
              fontSize: 11,
              fontWeight: 650,
              color: cssVar("text-muted"),
              textTransform: "uppercase",
              letterSpacing: 0.4,
              lineHeight: 1.2,
            }}
          >
            Bottleneck
          </div>
          <div
            className="lisn-num"
            style={{
              fontSize: 14,
              fontWeight: 700,
              color: cssVar("severity-med"),
              lineHeight: 1.25,
            }}
          >
            {card.bottleneck}
          </div>
        </div>
      ) : null}

      <div
        style={{
          marginTop: "auto",
          background: `linear-gradient(135deg, ${cssVar("severity-med")}10 0%, ${card.iconColor}08 38%)`,
          border: `1px solid ${cssVar("severity-med")}28`,
          borderLeft: `4px solid ${cssVar("severity-med")}`,
          borderRadius: radius.md,
          padding: "11px 13px",
          minHeight: 110,
          display: "flex",
          flexDirection: "column",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 8 }}>
          <Bot size={12} color={cssVar("severity-med")} />
          <span
            style={{
              fontSize: 11,
              fontWeight: 700,
              color: cssVar("severity-med"),
              letterSpacing: 0.55,
              textTransform: "uppercase",
            }}
          >
            Conversation AI
          </span>
        </div>
        <ConversationInsightLines text={card.conversationInsight} />
      </div>
    </Tag>
  );
}
