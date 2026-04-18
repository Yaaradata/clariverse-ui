"use client";

import { Hash } from "lucide-react";

type HashtagTrend = {
  hashtag: string;
  sentiment: "positive" | "negative" | "neutral";
  growthPercent: number;
  volume: number;
  summary: string;
};

const HASHTAGS: HashtagTrend[] = [
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

export function RetailMomentumHashtags() {
  return (
    <div className="rounded-2xl bg-[#0D0D0D] border border-[#2b2b2b] shadow-[0_18px_40px_rgba(0,0,0,0.4)] text-white">
      <div className="flex flex-col space-y-1.5 p-6">
        <div className="text-2xl font-semibold leading-none tracking-tight flex items-center gap-2 text-white text-lg">
          <Hash className="h-5 w-5 text-purple-400" />
          Momentum Hashtags
        </div>
        <div className="text-sm text-gray-400">
          Fastest growing conversation entry points
        </div>
      </div>
      <div className="p-6 pt-0 grid gap-3 sm:grid-cols-2 pb-4">
        {HASHTAGS.map(hashtag => (
          <div
            key={hashtag.hashtag}
            className="rounded-2xl border border-white/10 bg-white/[0.03] backdrop-blur-sm space-y-2.5 p-4"
          >
            <div className="flex items-center justify-between gap-3 flex-wrap">
              <p className="text-sm font-semibold text-white break-words">
                {hashtag.hashtag}
              </p>
              <span
                className={`text-xs uppercase tracking-wide px-2 py-0.5 rounded flex-shrink-0 ${
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
            <div className="flex items-end gap-3 flex-wrap">
              <span className="text-3xl text-white font-semibold leading-none">
                {hashtag.growthPercent}%
              </span>
              <span className="text-xs text-gray-400 pb-0.5">
                Growth ·{" "}
                <span className="font-medium">
                  {hashtag.volume.toLocaleString()}
                </span>{" "}
                posts
              </span>
            </div>
            <p className="text-xs text-gray-400 leading-relaxed break-words">
              {hashtag.summary}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
