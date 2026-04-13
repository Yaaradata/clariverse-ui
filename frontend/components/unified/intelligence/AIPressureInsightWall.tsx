"use client";

import { Flame, Zap, XCircle, BarChart3, Building2, RefreshCw, Sparkles, type LucideIcon } from "lucide-react";
import type { IntentIntelligenceInsightCard } from "@/lib/unified/intentIntelligenceData";
import { getBankingIntentIntelligenceData } from "@/lib/unified/intentIntelligenceData";

const defaultCards = getBankingIntentIntelligenceData().insightWallCards;

const EMOJI_TO_ICON: Record<string, LucideIcon> = {
  "🔥": Flame,
  "⚡": Zap,
  "❌": XCircle,
  "📊": BarChart3,
  "🏢": Building2,
  "🔁": RefreshCw,
};

const DEFAULT_ICON = BarChart3;

interface AIPressureInsightWallProps {
  /** When omitted, banking default insight cards are used. Pass e.g. getEcommerceIntentIntelligenceData().insightWallCards for e-commerce. */
  cards?: IntentIntelligenceInsightCard[];
}

export function AIPressureInsightWall({ cards = defaultCards }: AIPressureInsightWallProps) {
  return (
    <div className="space-y-3">
      <div className="flex items-center gap-3">
        <h2 className="text-lg font-semibold text-white flex items-center gap-2">
          <span>✨</span>
          Intent Pressure Alerts
        </h2>
      </div>
      <p className="text-xs text-gray-400">
        Critical insights and AI-driven recommendations across pressure clusters, volatility, conflicts, and backlog.
      </p>
      <div className="flex w-full min-w-0 gap-4 overflow-x-auto pb-6 items-stretch">
        {cards.map((card, idx) => (
          <InsightCardBlock key={`${card.title}-${idx}`} card={card} index={idx} />
        ))}
      </div>
    </div>
  );
}

const CARD_COLORS = [
  { border: "border-amber-500/40", bg: "bg-amber-500/5", icon: "text-amber-400", recommendationBorder: "border-amber-500/40", recommendationBg: "bg-amber-500/10", recommendationText: "text-amber-100", sparkle: "text-amber-300" },
  { border: "border-rose-500/40", bg: "bg-rose-500/5", icon: "text-rose-400", recommendationBorder: "border-rose-500/40", recommendationBg: "bg-rose-500/10", recommendationText: "text-rose-100", sparkle: "text-rose-300" },
  { border: "border-indigo-500/40", bg: "bg-indigo-500/5", icon: "text-indigo-400", recommendationBorder: "border-indigo-500/40", recommendationBg: "bg-indigo-500/10", recommendationText: "text-indigo-100", sparkle: "text-indigo-300" },
  { border: "border-emerald-500/40", bg: "bg-emerald-500/5", icon: "text-emerald-400", recommendationBorder: "border-emerald-500/40", recommendationBg: "bg-emerald-500/10", recommendationText: "text-emerald-100", sparkle: "text-emerald-300" },
  { border: "border-cyan-500/40", bg: "bg-cyan-500/5", icon: "text-cyan-400", recommendationBorder: "border-cyan-500/40", recommendationBg: "bg-cyan-500/10", recommendationText: "text-cyan-100", sparkle: "text-cyan-300" },
  { border: "border-violet-500/40", bg: "bg-violet-500/5", icon: "text-violet-400", recommendationBorder: "border-violet-500/40", recommendationBg: "bg-violet-500/10", recommendationText: "text-violet-100", sparkle: "text-violet-300" },
] as const;

function InsightCardBlock({ card, index }: { card: IntentIntelligenceInsightCard; index: number }) {
  const IconComponent = EMOJI_TO_ICON[card.icon] ?? DEFAULT_ICON;
  const colors = CARD_COLORS[index % CARD_COLORS.length];
  return (
    <div className={`min-w-[15rem] min-h-[15.5rem] flex-1 basis-0 rounded-2xl border px-5 py-5 text-sm shadow-lg flex flex-col bg-black/30 text-gray-200 sm:min-w-[16rem] ${colors.border} ${colors.bg}`}>
      <div className="flex items-center gap-2 text-sm font-semibold text-white">
        <IconComponent className={`h-4 w-4 shrink-0 ${colors.icon}`} aria-hidden />
        <span>{card.title}</span>
      </div>
      <div className="mt-3 text-[11px]">
        <div className="mb-1 uppercase tracking-wide text-gray-500">Cluster</div>
        <div className="font-semibold text-white">{card.context}</div>
      </div>
      <div className="mt-5 min-h-[7.75rem] rounded-xl border border-white/10 bg-black/40 p-3.5 text-xs leading-snug flex-1 flex flex-col justify-center text-gray-300">
        {card.detail}
      </div>
      <div className={`mt-4 rounded-xl border p-3.5 text-xs leading-snug flex items-start gap-2 ${colors.recommendationBorder} ${colors.recommendationBg} ${colors.recommendationText}`}>
        <Sparkles className={`h-3.5 w-3.5 shrink-0 mt-0.5 ${colors.sparkle}`} aria-hidden />
        <span>{card.aiInsight}</span>
      </div>
    </div>
  );
}
