"use client";

import { useMemo } from "react";
import { TrendingUp } from "lucide-react";

export type RetailBrandDrillVariant =
  | "default"
  | "sterling-deposit-flight"
  | "sterling-brand-reputation";

type DefaultChannelKey = "appStore" | "playStore" | "reddit" | "trustpilot" | "x";
type SterlingChannelKey = "appStore" | "voice" | "chat" | "email" | "social";

const DEFAULT_CHANNEL_META: { key: DefaultChannelKey; label: string; color: string }[] = [
  { key: "appStore", label: "App Store", color: "#9333EA" },
  { key: "playStore", label: "Play Store", color: "#0891B2" },
  { key: "reddit", label: "Reddit", color: "#B45309" },
  { key: "trustpilot", label: "Trustpilot", color: "#65A30D" },
  { key: "x", label: "X (Twitter)", color: "#64748B" },
];

const STERLING_CHANNEL_META: { key: SterlingChannelKey; label: string; color: string }[] = [
  { key: "appStore", label: "App Store", color: "#9333EA" },
  { key: "voice", label: "Voice", color: "#E11D48" },
  { key: "chat", label: "Chat", color: "#EA580C" },
  { key: "email", label: "Email", color: "#0D9488" },
  { key: "social", label: "Social/X", color: "#64748B" },
];

type DefaultTopicRow = {
  topic: string;
  appStore: number;
  playStore: number;
  reddit: number;
  trustpilot: number;
  x: number;
  wow: number;
};

/** Starling Bank head_retail — Brand at risk · single-line topics only */
const STERLING_BRAND_TOPIC_ROWS: DefaultTopicRow[] = [
  { topic: "Account freeze", appStore: 28, playStore: 34, reddit: 62, trustpilot: 48, x: 40, wow: 19 },
  { topic: "Payment declined despite funds", appStore: 32, playStore: 38, reddit: 44, trustpilot: 42, x: 32, wow: 14 },
  { topic: "Savings interest removed", appStore: 36, playStore: 28, reddit: 38, trustpilot: 46, x: 23, wow: 22 },
  { topic: "Account closure", appStore: 22, playStore: 26, reddit: 48, trustpilot: 34, x: 19, wow: 11 },
  { topic: "App and Spaces errors", appStore: 58, playStore: 34, reddit: 18, trustpilot: 14, x: 8, wow: 9 },
  { topic: "Security lockout", appStore: 42, playStore: 22, reddit: 24, trustpilot: 18, x: 15, wow: 7 },
  { topic: "Sole-trader onboarding rejection", appStore: 18, playStore: 14, reddit: 32, trustpilot: 26, x: 14, wow: 6 },
  { topic: "Faster payment delay", appStore: 24, playStore: 20, reddit: 22, trustpilot: 19, x: 12, wow: -3 },
];

type SterlingTopicRow = {
  topic: string;
  appStore: number;
  voice: number;
  chat: number;
  email: number;
  social: number;
  wow: number;
};

const DEFAULT_TOPIC_ROWS: DefaultTopicRow[] = [
  { topic: "Payment Processing Failure", appStore: 74, playStore: 52, reddit: 38, trustpilot: 32, x: 16, wow: 18 },
  { topic: "Mobile App Crashes", appStore: 50, playStore: 44, reddit: 36, trustpilot: 29, x: 25, wow: 12 },
  { topic: "Account Access Problems", appStore: 105, playStore: 25, reddit: 18, trustpilot: 12, x: 7, wow: 9 },
  { topic: "Fee Structure Criticism", appStore: 46, playStore: 37, reddit: 22, trustpilot: 20, x: 16, wow: 14 },
  { topic: "System Outage Frustration", appStore: 44, playStore: 31, reddit: 31, trustpilot: 13, x: 10, wow: 22 },
  { topic: "Cross Border Issues", appStore: 49, playStore: 27, reddit: 21, trustpilot: 13, x: 8, wow: 4 },
  { topic: "Customer Service Disappointment", appStore: 43, playStore: 24, reddit: 20, trustpilot: 11, x: 4, wow: -3 },
  { topic: "Regulatory Compliance Questions", appStore: 50, playStore: 27, reddit: 19, trustpilot: 0, x: 0, wow: -6 },
];

const STERLING_TOPIC_ROWS: SterlingTopicRow[] = [
  { topic: "Interest removed / rate cut", appStore: 42, voice: 68, chat: 28, email: 34, social: 56, wow: 22 },
  { topic: "Moving savings to competitor", appStore: 38, voice: 44, chat: 22, email: 18, social: 76, wow: 18 },
  { topic: "Easy-Saver rate uncompetitive", appStore: 52, voice: 48, chat: 26, email: 24, social: 22, wow: 14 },
  { topic: "Salary / primary-account redirection", appStore: 18, voice: 62, chat: 24, email: 28, social: 24, wow: 16 },
  { topic: "CASS switch initiated", appStore: 22, voice: 38, chat: 18, email: 32, social: 24, wow: 12 },
  { topic: "ISA transfer out", appStore: 28, voice: 24, chat: 16, email: 36, social: 14, wow: 8 },
  { topic: "Fair-value of savings (PRIN 2A)", appStore: 16, voice: 28, chat: 22, email: 18, social: 12, wow: 6 },
  { topic: "Balance drawdown / partial exit", appStore: 14, voice: 34, chat: 12, email: 10, social: 8, wow: 10 },
];

type TierKey = "critical" | "high" | "watch" | "stable";
const TIERS: Record<TierKey, { label: string; color: string; min: number }> = {
  critical: { label: "Critical", color: "#EF4444", min: 150 },
  high: { label: "High", color: "#F59E0B", min: 100 },
  watch: { label: "Watch", color: "#E8B931", min: 50 },
  stable: { label: "Stable", color: "#64748B", min: 0 },
};

function tierFor(count: number): TierKey {
  if (count >= TIERS.critical.min) return "critical";
  if (count >= TIERS.high.min) return "high";
  if (count >= TIERS.watch.min) return "watch";
  return "stable";
}

type PreparedRow = {
  topic: string;
  total: number;
  wow: number;
  tier: TierKey;
  channels: { key: string; label: string; color: string }[];
};

function prepareDefaultRows(): PreparedRow[] {
  return DEFAULT_TOPIC_ROWS.map((r) => {
    const total = r.appStore + r.playStore + r.reddit + r.trustpilot + r.x;
    const channels = DEFAULT_CHANNEL_META.filter((m) => r[m.key] > 0);
    return { topic: r.topic, total, wow: r.wow, tier: tierFor(total), channels };
  })
    .sort((a, b) => b.total - a.total);
}

function prepareSterlingRows(): PreparedRow[] {
  return STERLING_TOPIC_ROWS.map((r) => {
    const total = r.appStore + r.voice + r.chat + r.email + r.social;
    const channels = STERLING_CHANNEL_META.filter((m) => r[m.key] > 0);
    return { topic: r.topic, total, wow: r.wow, tier: tierFor(total), channels };
  })
    .sort((a, b) => b.total - a.total);
}

function prepareSterlingBrandRows(): PreparedRow[] {
  return STERLING_BRAND_TOPIC_ROWS.map((r) => {
    const total = r.appStore + r.playStore + r.reddit + r.trustpilot + r.x;
    const channels = DEFAULT_CHANNEL_META.filter((m) => r[m.key] > 0);
    return { topic: r.topic, total, wow: r.wow, tier: tierFor(total), channels };
  }).sort((a, b) => b.total - a.total);
}

/** Fills fixed card height — no inner scroll (retail default + Sterling brand). */
type TopicsListLayout = {
  headerPadding: string;
  listClassName: string;
  rowGridColumns: string;
  rowFlex: boolean;
  rowPadding: string;
  rowGap: number;
  rankFontSize: number;
  topicFontSize: number;
  countFontSize: number;
  wowFontSize: number;
  showChannelDots: boolean;
};

function layoutForVariant(variant: RetailBrandDrillVariant): TopicsListLayout {
  if (variant === "sterling-brand-reputation") {
    return {
      headerPadding: "p-2.5 pb-0.5",
      listClassName: "flex-1 min-h-0 flex flex-col justify-evenly overflow-hidden px-2.5 pb-2",
      rowGridColumns: "20px minmax(0, 1fr) 52px 48px",
      rowFlex: true,
      rowPadding: "0",
      rowGap: 3,
      rankFontSize: 12.5,
      topicFontSize: 15,
      countFontSize: 13.5,
      wowFontSize: 12,
      showChannelDots: false,
    };
  }

  const compactFill = variant === "default";
  const showChannelDots = true;

  if (compactFill) {
    return {
      headerPadding: "p-4 pb-2",
      listClassName: "flex-1 min-h-0 flex flex-col justify-evenly overflow-hidden px-4 pb-4",
      rowGridColumns: "20px minmax(0, 1fr) 56px 54px",
      rowFlex: true,
      rowPadding: "5px 2px",
      rowGap: 8,
      rankFontSize: 10.5,
      topicFontSize: 12,
      countFontSize: 11.5,
      wowFontSize: 10,
      showChannelDots,
    };
  }

  return {
    headerPadding: "p-5 pb-3",
    listClassName: "flex-1 min-h-0 flex flex-col gap-[6px] overflow-y-auto px-5 pb-5",
    rowGridColumns: "20px minmax(0, 1fr) 56px 54px",
    rowFlex: false,
    rowPadding: "8px 4px",
    rowGap: 10,
    rankFontSize: 11,
    topicFontSize: 12.5,
    countFontSize: 12,
    wowFontSize: 10.5,
    showChannelDots,
  };
}

export function RetailTopTopicsByVirality({
  variant = "default",
}: {
  variant?: RetailBrandDrillVariant;
}) {
  const isDepositFlight = variant === "sterling-deposit-flight";
  const isSterlingBrand = variant === "sterling-brand-reputation";
  const layout = layoutForVariant(variant);
  const rows = useMemo(() => {
    if (variant === "sterling-brand-reputation") return prepareSterlingBrandRows();
    if (isDepositFlight) return prepareSterlingRows();
    return prepareDefaultRows();
  }, [variant, isDepositFlight]);

  return (
    <div className="rounded-2xl border border-white/10 bg-[#0D0D0D] shadow-xl h-full flex flex-col overflow-hidden">
      <div className={`flex flex-col flex-shrink-0 space-y-1 ${layout.headerPadding}`}>
        <h3
          className={`font-semibold leading-none tracking-tight flex items-center gap-2 text-white ${
            isSterlingBrand ? "text-[17px]" : "text-[15px]"
          }`}
        >
          <TrendingUp className="h-4 w-4 text-red-400" />
          {isDepositFlight ? "Top Deposit-Flight Drivers" : "Top Topics at Risk"}
        </h3>
        <p className={isSterlingBrand ? "text-[12.5px] leading-tight text-slate-400" : "text-[11px] text-slate-400"}>
          {isDepositFlight
            ? "Ranked by flight-intent mentions — highest balance-at-risk first"
            : "Ranked by total mentions — highest reputational risk first"}
        </p>
      </div>
      <div className={layout.listClassName}>
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
                gridTemplateColumns: layout.rowGridColumns,
                alignItems: "center",
                gap: layout.rowGap,
                padding: layout.rowPadding,
                flex: layout.rowFlex ? "1 1 0" : undefined,
                minHeight: layout.rowFlex ? 0 : undefined,
              }}
            >
              <span
                style={{
                  fontFamily: "var(--mono)",
                  fontSize: layout.rankFontSize,
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
                    fontSize: layout.topicFontSize,
                    lineHeight: isSterlingBrand ? 1.15 : undefined,
                    color: "#E2E8F0",
                    fontWeight: isSterlingBrand ? 600 : 500,
                    whiteSpace: "nowrap",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                  }}
                  title={r.topic}
                >
                  {r.topic}
                </span>
                {layout.showChannelDots ? (
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
                ) : null}
              </div>

              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "flex-end",
                  gap: 4,
                  fontFamily: "var(--mono)",
                  fontSize: layout.countFontSize,
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
                  fontSize: layout.wowFontSize,
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
