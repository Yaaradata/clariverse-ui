"use client";

import { Hash } from "lucide-react";
import type { RetailBrandDrillVariant } from "./RetailTopTopicsByVirality";

type HashtagTrend = {
  hashtag: string;
  sentiment: "positive" | "negative" | "neutral";
  growthPercent: number;
  volume: number;
  summary: string;
};

const DEFAULT_HASHTAGS: HashtagTrend[] = [
  {
    hashtag: "#BankAppCrash",
    sentiment: "negative",
    growthPercent: 287,
    volume: 4820,
    summary:
      "Spiking after v3.2 Android release · most posts referencing failed transfers and app restart loops.",
  },
  {
    hashtag: "#HiddenFees",
    sentiment: "negative",
    growthPercent: 164,
    volume: 3610,
    summary:
      "Consumer Duty discourse driving wider adoption · FOS and FCA accounts re-amplifying threads.",
  },
  {
    hashtag: "#RealTimeFX",
    sentiment: "positive",
    growthPercent: 142,
    volume: 2190,
    summary:
      "Feature request narrative · expats and SMB owners asking for live FX quotes in the mobile app.",
  },
  {
    hashtag: "#CardReplacement",
    sentiment: "neutral",
    growthPercent: 98,
    volume: 1870,
    summary:
      "Mix of positive (fast issue) and negative (48h courier delay) · volume flat vs last week.",
  },
  {
    hashtag: "#MortgageAdvice",
    sentiment: "negative",
    growthPercent: 76,
    volume: 1420,
    summary:
      "Complaints about broker wait times · heavy skew toward first-time-buyer segment.",
  },
  {
    hashtag: "#SavingsPots",
    sentiment: "positive",
    growthPercent: 58,
    volume: 1120,
    summary:
      "Competitor launches triggering 'why don't we have this' threads on X and Reddit.",
  },
];

const STERLING_FLIGHT_HASHTAGS: HashtagTrend[] = [
  {
    hashtag: "#SavingsRate",
    sentiment: "negative",
    growthPercent: 214,
    volume: 3280,
    summary:
      "Spike after Easy-Saver rate removal · customers comparing headline rates across UK challengers.",
  },
  {
    hashtag: "#BetterRateElsewhere",
    sentiment: "negative",
    growthPercent: 186,
    volume: 2740,
    summary:
      "Flight-intent posts citing competitor savings rates before outbound transfers complete.",
  },
  {
    hashtag: "#SwitchMyBank",
    sentiment: "negative",
    growthPercent: 152,
    volume: 2190,
    summary:
      "CASS and primacy-switch narratives · salary redirection mentioned in 42% of posts.",
  },
  {
    hashtag: "#PrimacyMove",
    sentiment: "negative",
    growthPercent: 94,
    volume: 1420,
    summary:
      "Direct-debit and salary redirection precursors · silent-switch pattern 3 months ahead of CASS data.",
  },
  {
    hashtag: "#SaveOfferHeld",
    sentiment: "positive",
    growthPercent: 67,
    volume: 980,
    summary:
      "Retention rate-hold posts after draft save-offer · flight-intent neutralised in 38% of flagged cohort.",
  },
  {
    hashtag: "#ServiceStillWins",
    sentiment: "positive",
    growthPercent: 41,
    volume: 720,
    summary:
      "Relationship-primary savers citing branch access and fee-free banking · slower bleed vs rate-only switchers.",
  },
];

/** Starling Bank head_retail — Brand at risk · restriction / closure complaint momentum */
const STERLING_BRAND_HASHTAGS: HashtagTrend[] = [
  {
    hashtag: "#AccountFrozen",
    sentiment: "negative",
    growthPercent: 248,
    volume: 4120,
    summary:
      "Restriction threads spiking on Trustpilot and X after pay-in freezes — no reason given in most posts.",
  },
  {
    hashtag: "#StarlingFrozeMyMoney",
    sentiment: "negative",
    growthPercent: 214,
    volume: 3680,
    summary:
      "Customer voice quote reposted across Reddit and X — Distil flags matching phrases in chat transcripts.",
  },
  {
    hashtag: "#InterestGone",
    sentiment: "negative",
    growthPercent: 186,
    volume: 2940,
    summary:
      "Savings rate removal discourse — reviewers cite rejected new saver applications in the same thread.",
  },
  {
    hashtag: "#LetMeSpendMyMoney",
    sentiment: "negative",
    growthPercent: 152,
    volume: 2410,
    summary:
      "Payment-block complaints despite available balance — Play Store and Trustpilot co-trending.",
  },
  {
    hashtag: "#ClosedMyAccount",
    sentiment: "negative",
    growthPercent: 128,
    volume: 1980,
    summary:
      "'No longer welcome' closure language — FOS-decision amplifiers picking up verbatim quotes.",
  },
  {
    hashtag: "#StuckWithBot",
    sentiment: "negative",
    growthPercent: 94,
    volume: 1560,
    summary:
      "Security lockout loops in app chat — cannot reach a human before account closed.",
  },
  {
    hashtag: "#BestBankingApp",
    sentiment: "positive",
    growthPercent: 62,
    volume: 1120,
    summary:
      "Counter-signal — App Store praise for Spaces and UX; healthiest channel on the brand screen.",
  },
];

export function RetailMomentumHashtags({
  variant = "default",
}: {
  variant?: RetailBrandDrillVariant;
}) {
  const isDepositFlight = variant === "sterling-deposit-flight";
  const isBrandReputation = variant === "sterling-brand-reputation";
  const hashtags = isBrandReputation
    ? STERLING_BRAND_HASHTAGS
    : isDepositFlight
      ? STERLING_FLIGHT_HASHTAGS
      : DEFAULT_HASHTAGS;

  return (
    <div className="flex h-full min-h-0 flex-col rounded-2xl bg-[#0D0D0D] border border-[#2b2b2b] shadow-[0_18px_40px_rgba(0,0,0,0.4)] text-white overflow-hidden">
      <div className="flex flex-col space-y-1.5 px-6 pt-6 pb-3 flex-shrink-0">
        <div className="text-lg font-semibold leading-none tracking-tight flex items-center gap-2 text-white">
          <Hash className="h-5 w-5 text-purple-400" />
          {isDepositFlight ? "Flight-Intent Social Themes" : "Momentum Hashtags"}
        </div>
        <div className="text-sm text-gray-400">
          {isDepositFlight
            ? "Fastest-growing deposit-flight conversation entry points"
            : "Fastest growing conversation entry points"}
        </div>
      </div>
      <div className="min-h-0 flex-1 overflow-y-auto px-6 pb-4 grid gap-2.5 sm:grid-cols-2 content-start">
        {hashtags.map((hashtag) => (
          <div
            key={hashtag.hashtag}
            className="rounded-xl border border-white/10 bg-white/[0.03] backdrop-blur-sm space-y-1.5 p-3"
          >
            <div className="flex items-center justify-between gap-3 flex-wrap">
              <p className="text-[13px] font-semibold text-white break-words">
                {hashtag.hashtag}
              </p>
              <span
                className={`text-[10px] uppercase tracking-wide px-1.5 py-0.5 rounded flex-shrink-0 ${
                  hashtag.sentiment === "positive"
                    ? "text-emerald-400"
                    : hashtag.sentiment === "negative"
                      ? "text-red-400"
                      : "text-gray-400"
                }`}
              >
                {hashtag.sentiment}
              </span>
            </div>
            <div className="flex items-end gap-2.5 flex-wrap">
              <span className="text-[40px] text-white font-semibold leading-none">
                {hashtag.growthPercent}%
              </span>
              <span className="text-[11px] text-gray-400 pb-0.5">
                Growth ·{" "}
                <span className="font-medium">{hashtag.volume.toLocaleString()}</span> posts
              </span>
            </div>
            <p className="text-[11px] text-gray-400 leading-relaxed break-words">
              {hashtag.summary}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
