"use client";

import { useMemo } from "react";
import { TrendingUp } from "lucide-react";

/**
 * Top Topics Causing Reputational Risk — simple ranked list with discrete
 * risk tiers (no rainbow gradient). Ordered descending by mentions, small
 * channel dots under each topic name provide cross-channel context.
 */

type ChannelKey = "appStore" | "playStore" | "reddit" | "trustpilot" | "x";

const CHANNEL_META: { key: ChannelKey; label: string; color: string }[] = [
  { key: "appStore",   label: "App Store",    color: "#9333EA" },
  { key: "playStore",  label: "Play Store",   color: "#0891B2" },
  { key: "reddit",     label: "Reddit",       color: "#B45309" },
  { key: "trustpilot", label: "Trustpilot",   color: "#65A30D" },
  { key: "x",          label: "X (Twitter)",  color: "#64748B" },
];

type TopicRow = {
  topic: string;
  appStore: number;
  playStore: number;
  reddit: number;
  trustpilot: number;
  x: number;
  wow: number; // week-over-week % change
};

const TOPIC_ROWS: TopicRow[] = [
  { topic: "Payment Processing Failure",      appStore: 74,  playStore: 52, reddit: 38, trustpilot: 32, x: 16, wow: 18 },
  { topic: "Mobile App Crashes",              appStore: 50,  playStore: 44, reddit: 36, trustpilot: 29, x: 25, wow: 12 },
  { topic: "Account Access Problems",         appStore: 105, playStore: 25, reddit: 18, trustpilot: 12, x: 7,  wow: 9  },
  { topic: "Fee Structure Criticism",         appStore: 46,  playStore: 37, reddit: 22, trustpilot: 20, x: 16, wow: 14 },
  { topic: "System Outage Frustration",       appStore: 44,  playStore: 31, reddit: 31, trustpilot: 13, x: 10, wow: 22 },
  { topic: "Cross Border Issues",             appStore: 49,  playStore: 27, reddit: 21, trustpilot: 13, x: 8,  wow: 4  },
  { topic: "Customer Service Disappointment", appStore: 43,  playStore: 24, reddit: 20, trustpilot: 11, x: 4,  wow: -3 },
  { topic: "Regulatory Compliance Questions", appStore: 50,  playStore: 27, reddit: 19, trustpilot: 0,  x: 0,  wow: -6 },
];

// Discrete risk tiers — matches the shared section legend.
// Cutoffs are inclusive of the lower bound.
type TierKey = "critical" | "high" | "watch" | "stable";
const TIERS: Record<TierKey, { label: string; color: string; min: number }> = {
  critical: { label: "Critical", color: "#EF4444", min: 150 },
  high:     { label: "High",     color: "#F59E0B", min: 100 },
  watch:    { label: "Watch",    color: "#E8B931", min: 50  },
  stable:   { label: "Stable",   color: "#64748B", min: 0   },
};

function tierFor(count: number): TierKey {
  if (count >= TIERS.critical.min) return "critical";
  if (count >= TIERS.high.min)     return "high";
  if (count >= TIERS.watch.min)    return "watch";
  return "stable";
}

export function RetailTopTopicsByVirality() {
  const rows = useMemo(() => {
    const prepared = TOPIC_ROWS.map((r) => {
      const total = r.appStore + r.playStore + r.reddit + r.trustpilot + r.x;
      const channels = CHANNEL_META.filter((m) => r[m.key] > 0);
      return { ...r, total, channels, tier: tierFor(total) };
    });
    prepared.sort((a, b) => b.total - a.total);
    return prepared;
  }, []);

  return (
    <div className="rounded-2xl border border-white/10 bg-[#0D0D0D] shadow-xl h-full flex flex-col overflow-hidden">
      <div className="flex flex-col space-y-1 p-5 pb-3 flex-shrink-0">
        <h3 className="text-[15px] font-semibold leading-none tracking-tight flex items-center gap-2 text-white">
          <TrendingUp className="h-4 w-4 text-red-400" />
          Top Topics at Risk
        </h3>
        <p className="text-[11px] text-slate-400">
          Ranked by total mentions — highest reputational risk first
        </p>
      </div>
      <div className="px-5 pb-5 flex-1 min-h-0 flex flex-col gap-[6px] overflow-y-auto">
        {rows.map((r, i) => {
          const tier = TIERS[r.tier];
          const wowPositive = r.wow > 0;
          const wowColor = wowPositive ? "#EF4444" : r.wow < 0 ? "#22C55E" : "#94A3B8";
          const wowArrow = wowPositive ? "▲" : r.wow < 0 ? "▼" : "→";
          return (
            <div
              key={r.topic}
              style={{
                display: "grid",
                gridTemplateColumns: "22px minmax(0, 1fr) 62px 60px",
                alignItems: "center",
                gap: 10,
                padding: "8px 4px",
              }}
            >
              <span
                style={{
                  fontFamily: "var(--mono)",
                  fontSize: 11,
                  fontWeight: 700,
                  color: "#64748B",
                  textAlign: "right",
                }}
              >
                {i + 1}.
              </span>

              <div style={{ minWidth: 0, display: "flex", alignItems: "center", gap: 8 }}>
                <span
                  style={{
                    fontSize: 12.5,
                    color: "#E2E8F0",
                    fontWeight: 500,
                    whiteSpace: "nowrap",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                  }}
                  title={r.topic}
                >
                  {r.topic}
                </span>
                <span style={{ display: "inline-flex", gap: 3, flexShrink: 0 }}>
                  {r.channels.map((c) => (
                    <span
                      key={c.key}
                      title={c.label}
                      style={{
                        width: 6,
                        height: 6,
                        borderRadius: "50%",
                        background: c.color,
                        display: "inline-block",
                      }}
                    />
                  ))}
                </span>
              </div>

              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "flex-end",
                  gap: 4,
                  fontFamily: "var(--mono)",
                  fontSize: 12,
                  fontWeight: 700,
                  color: tier.color,
                }}
              >
                {r.total.toLocaleString()}
              </div>

              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "flex-end",
                  gap: 3,
                  fontFamily: "var(--mono)",
                  fontSize: 10.5,
                  fontWeight: 700,
                  color: wowColor,
                }}
              >
                {wowArrow} {Math.abs(r.wow)}%
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
