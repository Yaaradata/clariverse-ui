"use client";

import { ChevronRight, Cpu, Handshake, Split } from "lucide-react";
import Link from "next/link";
import { AreaTrend } from "./AreaTrend";
import { SemiGauge } from "./SemiGauge";
import { MiniKPI } from "./MiniKPI";
import { InsightBox } from "./InsightBox";
import { WhatsCountedPopover } from "./WhatsCountedPopover";
import { useLabel } from "../shell/DemoProvider";

type QuestionCardData = {
  id: string;
  route: string;
  icon: "Cpu" | "Handshake" | "Split";
  accent: string;
  highlighted: boolean;
  title: string;
  caption: string;
  count: number;
  countLabel: string;
  lastWeekCount: number;
  deltaLabel: string;
  fourWeekLabel: string;
  severityMix: string;
  counted: Array<{ signalId: string; text: string }>;
  notCounted: string;
  countedFooter: string;
  gauges: Array<{ pct: number; label: string; sub: string; tone: "green" | "amber" | "red" }>;
  trend: { kind: string; ref: string };
  miniKpis: Array<{ label: string; value: string; caption?: string; money?: boolean }>;
  insightLabel: string;
  insight: string;
};

type QuestionCardProps = {
  card: QuestionCardData;
  trendData: Array<{ week: string; value: number | null }>;
};

const ICONS = {
  Cpu,
  Handshake,
  Split,
};

export function QuestionCard({ card, trendData }: QuestionCardProps) {
  const L = useLabel();
  const Icon = ICONS[card.icon];

  const delta = card.count - card.lastWeekCount;
  const deltaStr = delta > 0 ? `+${delta}` : delta === 0 ? "0" : `${delta}`;
  const isAmber = delta > 0;

  const borderColor = card.accent === "orange" ? "#f97316" : card.accent === "teal" ? "#14b8a6" : "#0ea5e9";
  const glowColor = card.highlighted
    ? `0 0 0 2px ${borderColor}, 0 8px 32px ${borderColor}22`
    : `0 8px 24px ${borderColor}14`;

  return (
    <Link
      href={card.route}
      style={{
        textDecoration: "none",
        display: "block",
        background: "#0d0d0d",
        border: card.highlighted ? `2px solid ${borderColor}` : `1px solid ${borderColor}50`,
        borderRadius: 16,
        padding: "20px 22px",
        boxShadow: glowColor,
        transition: "transform 0.15s, box-shadow 0.15s",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = "translateY(-2px)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = "translateY(0)";
      }}
    >
      {/* Header */}
      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 16 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12, flex: 1, minWidth: 0 }}>
          <div
            style={{
              width: 40,
              height: 40,
              borderRadius: 10,
              background: `${borderColor}20`,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexShrink: 0,
            }}
          >
            <Icon size={20} color={borderColor} />
          </div>
          <div style={{ minWidth: 0, flex: 1 }}>
            <div
              style={{
                fontSize: 16,
                fontWeight: 700,
                color: "#ffffff",
                lineHeight: 1.25,
                marginBottom: 4,
              }}
            >
              {card.title}
            </div>
            <div style={{ fontSize: 12, color: "#939394" }}>{L(card.caption)}</div>
          </div>
        </div>
        <ChevronRight size={20} color="#939394" style={{ flexShrink: 0, marginTop: 8 }} />
      </div>

      {/* Score Delta */}
      <div style={{ marginBottom: 16 }}>
        <div style={{ display: "flex", alignItems: "baseline", gap: 8, marginBottom: 6 }}>
          <div
            style={{
              fontSize: 40,
              fontWeight: 700,
              color: "#ffffff",
              fontFamily: "var(--mono, monospace)",
              fontVariantNumeric: "tabular-nums",
              lineHeight: 1,
            }}
          >
            {card.count}
          </div>
          <WhatsCountedPopover
            counted={card.counted}
            notCounted={card.notCounted}
            countedFooter={card.countedFooter}
          />
        </div>
        <div style={{ fontSize: 13, color: "#a3a3a3", marginBottom: 6 }}>{card.countLabel}</div>
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 2 }}>
          <span
            style={{
              fontSize: 13,
              fontWeight: 700,
              fontFamily: "var(--mono, monospace)",
              color: isAmber ? "#fbbf24" : "#a3a3a3",
              padding: "2px 8px",
              borderRadius: 6,
              background: isAmber ? "rgba(245, 158, 11, 0.15)" : "#2a2a2a",
              border: `1px solid ${isAmber ? "rgba(245, 158, 11, 0.3)" : "#2a2a2a"}`,
            }}
          >
            {deltaStr}
          </span>
          <span style={{ fontSize: 13, color: "#939394" }}>{card.deltaLabel}</span>
        </div>
        <div style={{ fontSize: 11, color: "#737373" }}>{card.fourWeekLabel}</div>
        <div style={{ fontSize: 12, color: "#a3a3a3", marginTop: 6 }}>{card.severityMix}</div>
      </div>

      {/* Trend Chart */}
      <div style={{ marginBottom: 16 }}>
        <AreaTrend data={trendData} color={borderColor} />
      </div>

      {/* Gauges */}
      <div style={{ display: "flex", gap: 16, marginBottom: 16 }}>
        {card.gauges.map((gauge, idx) => (
          <SemiGauge key={idx} {...gauge} label={L(gauge.label)} sub={L(gauge.sub)} />
        ))}
      </div>

      {/* Mini KPIs */}
      <div style={{ display: "flex", gap: 16, marginBottom: 16 }}>
        {card.miniKpis.map((kpi, idx) => (
          <MiniKPI key={idx} {...kpi} label={L(kpi.label)} />
        ))}
      </div>

      {/* Insight */}
      <InsightBox label={card.insightLabel} text={card.insight} accent={borderColor} />
    </Link>
  );
}
