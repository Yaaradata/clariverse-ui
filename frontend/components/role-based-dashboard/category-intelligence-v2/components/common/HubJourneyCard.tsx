"use client";

import React from "react";
import { ChevronRight, Sparkles } from "lucide-react";
import type { HubJourneyCardData } from "../../lib/categoryOverviewData";
import { MiniGauge, MiniSparkline } from "./MiniSparkline";
import { cssVar, radius } from "../../theme/tokens";

export function HubJourneyCard({
  card,
  onClick,
}: {
  card: HubJourneyCardData;
  onClick?: () => void;
}): React.ReactElement {
  const Icon = card.icon;
  const borderAccent = card.isPrimary ? cssVar("accent") : `${card.sparkColor}40`;
  const defaultShadow = card.isPrimary
    ? `0 0 0 2px ${cssVar("accent")}33, 0 8px 28px ${cssVar("accent")}18`
    : String(cssVar("shadow-card"));
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
        border: `1px solid ${borderAccent}`,
        borderRadius: radius.lg,
        padding: "16px 16px 14px",
        cursor: interactive ? "pointer" : "default",
        display: "flex",
        flexDirection: "column",
        gap: 12,
        minWidth: 0,
        width: "100%",
        boxShadow: defaultShadow,
        transition: "box-shadow 0.2s ease",
        fontFamily: "inherit",
      }}
      onMouseEnter={
        interactive
          ? (e) => {
              e.currentTarget.style.boxShadow = `0 8px 32px ${card.sparkColor}22`;
            }
          : undefined
      }
      onMouseLeave={
        interactive
          ? (e) => {
              e.currentTarget.style.boxShadow = defaultShadow;
            }
          : undefined
      }
    >
      <div
        style={{
          display: "grid",
          gridTemplateColumns: interactive ? "36px minmax(0, 1fr) 20px" : "36px minmax(0, 1fr)",
          gap: "10px 12px",
          alignItems: "start",
        }}
      >
        <div
          style={{
            width: 36,
            height: 36,
            borderRadius: 10,
            background: `${card.iconColor}18`,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Icon size={18} color={card.iconColor} />
        </div>
        <h3
          style={{
            margin: 0,
            fontSize: 15,
            fontWeight: 700,
            color: cssVar("text-primary"),
            lineHeight: 1.3,
          }}
        >
          {card.title}
        </h3>
        {interactive ? (
          <ChevronRight
            size={18}
            color={cssVar("text-muted")}
            style={{ marginTop: 2, opacity: 0.5 }}
            strokeWidth={1.75}
          />
        ) : null}
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "minmax(0, 1fr) minmax(0, 1fr)",
          gap: 10,
          alignItems: "start",
        }}
      >
        <div style={{ minWidth: 0, display: "flex", flexDirection: "column", gap: 6 }}>
          <span
            className="lisn-num"
            style={{
              fontSize: typeof card.heroValue === "number" ? 34 : 30,
              fontWeight: 800,
              color: cssVar("text-primary"),
              lineHeight: 1.15,
              whiteSpace: "nowrap",
            }}
          >
            {card.heroValue}
            <span
              style={{
                fontSize: 12,
                fontWeight: 700,
                marginLeft: 6,
                color: card.deltaPositive ? cssVar("positive") : cssVar("severity-high"),
              }}
            >
              {card.heroDelta}
            </span>
          </span>
          <MiniSparkline data={card.spark} color={card.sparkColor} height={44} gradientKey={card.id} />
        </div>

        <div style={{ minWidth: 0, display: "flex", flexDirection: "column", gap: 8 }}>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: 4,
              alignItems: "end",
            }}
          >
            {card.gauges.map((g) => (
              <MiniGauge key={g.label} label={g.label} value={g.value} color={g.color} compact />
            ))}
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: "6px 8px",
              paddingTop: 8,
              borderTop: `1px solid ${cssVar("border")}`,
            }}
          >
            {card.stats.map((s) => (
              <div key={s.label} style={{ textAlign: "center" }}>
                <div
                  style={{
                    fontSize: 9,
                    color: cssVar("text-muted"),
                    textTransform: "uppercase",
                    letterSpacing: 0.35,
                    lineHeight: 1.2,
                  }}
                >
                  {s.label}
                </div>
                <div
                  className="lisn-num"
                  style={{
                    fontSize: 13,
                    fontWeight: 700,
                    color: s.color ?? cssVar("text-primary"),
                    marginTop: 3,
                    lineHeight: 1.2,
                  }}
                >
                  {s.value}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div
        style={{
          background: `linear-gradient(135deg, ${cssVar("severity-med")}10 0%, ${card.iconColor}08 38%)`,
          border: `1px solid ${cssVar("severity-med")}28`,
          borderLeft: `3px solid ${cssVar("severity-med")}`,
          borderRadius: radius.md,
          padding: "10px 12px",
          display: "flex",
          flexDirection: "column",
          gap: 6,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
          <Sparkles size={13} color={cssVar("severity-med")} />
          <span
            style={{
              fontSize: 11,
              fontWeight: 700,
              color: cssVar("severity-med"),
              letterSpacing: 0.45,
              textTransform: "uppercase",
            }}
          >
            AI insight
          </span>
        </div>
        <ul
          style={{
            margin: 0,
            paddingLeft: 16,
            display: "flex",
            flexDirection: "column",
            gap: 5,
            listStyleType: "disc",
          }}
        >
          {card.insightPoints.map((point) => (
            <li
              key={point}
              style={{
                fontSize: 13,
                fontWeight: 500,
                color: cssVar("text-primary"),
                lineHeight: 1.45,
                paddingLeft: 2,
              }}
            >
              {point}
            </li>
          ))}
        </ul>
      </div>
    </Tag>
  );
}
