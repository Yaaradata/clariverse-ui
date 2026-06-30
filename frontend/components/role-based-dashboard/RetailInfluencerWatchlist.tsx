"use client";

import { Users } from "lucide-react";
import type { RetailBrandDrillVariant } from "./RetailTopTopicsByVirality";

type Influencer = {
  id: string;
  username: string;
  sentiment: "positive" | "negative" | "neutral";
  karma: number;
  followers: number;
  engagementRate: number;
  watchlist: boolean;
  lastPostSummary: string;
};

type FlightRiskAccount = {
  id: string;
  segmentAccount: string;
  balanceAtRisk: number;
  arpau: number;
  daysToExit: number;
  retentionWindow: boolean;
  flightQuote: string;
};

const INFLUENCERS: Influencer[] = [
  {
    id: "u1",
    username: "eu_banking_watch",
    sentiment: "negative",
    karma: 184230,
    followers: 58200,
    engagementRate: 6.2,
    watchlist: true,
    lastPostSummary:
      "Thread analysing hidden FX margins on retail transfers — 2.1k upvotes, amplified by FCA-adjacent accounts.",
  },
  {
    id: "u2",
    username: "fintech_teardowns",
    sentiment: "negative",
    karma: 92410,
    followers: 41600,
    engagementRate: 4.8,
    watchlist: true,
    lastPostSummary:
      "Comparative review vs. two peers · flagged app instability after v3.2 release as top pain point.",
  },
  {
    id: "u3",
    username: "mortgage_nerd",
    sentiment: "negative",
    karma: 64820,
    followers: 29300,
    engagementRate: 5.4,
    watchlist: false,
    lastPostSummary:
      "Weekly mortgage broker wait-time scorecard · put the bank in the bottom quartile for response SLA.",
  },
  {
    id: "u4",
    username: "savings_sherpa",
    sentiment: "positive",
    karma: 51230,
    followers: 38400,
    engagementRate: 7.1,
    watchlist: false,
    lastPostSummary:
      "Recommended the bank's savings product for low-balance first-time savers · AMA drew 1.4k comments.",
  },
  {
    id: "u5",
    username: "crypto_compliance",
    sentiment: "negative",
    karma: 38500,
    followers: 22100,
    engagementRate: 8.3,
    watchlist: true,
    lastPostSummary:
      "Posted screenshots of declined crypto on-ramp transactions · asked followers to share similar experiences.",
  },
  {
    id: "u6",
    username: "retail_ombudsman",
    sentiment: "negative",
    karma: 27450,
    followers: 18600,
    engagementRate: 9.0,
    watchlist: true,
    lastPostSummary:
      "Ran a poll on complaint resolution times — >60% of respondents waited >14 days for fee disputes.",
  },
];

const FLIGHT_RISK_ACCOUNTS: FlightRiskAccount[] = [
  {
    id: "fr1",
    segmentAccount: "HNI · ••4821",
    balanceAtRisk: 480_000,
    arpau: 612,
    daysToExit: 6,
    retentionWindow: true,
    flightQuote: "Moving to Chase — better rate",
  },
  {
    id: "fr2",
    segmentAccount: "Mass Affluent · ••2207",
    balanceAtRisk: 92_000,
    arpau: 318,
    daysToExit: 11,
    retentionWindow: true,
    flightQuote: "3.25% gone, why stay?",
  },
  {
    id: "fr3",
    segmentAccount: "SME · ••5590",
    balanceAtRisk: 210_000,
    arpau: 540,
    daysToExit: 9,
    retentionWindow: true,
    flightQuote: "Switching salary + DDs to Monzo",
  },
];

function formatBalance(value: number): string {
  if (value >= 1_000_000) return `£${(value / 1_000_000).toFixed(1)}M`;
  if (value >= 1_000) return `£${Math.round(value / 1_000)}K`;
  return `£${value.toLocaleString()}`;
}

export function RetailInfluencerWatchlist({
  variant = "default",
}: {
  variant?: RetailBrandDrillVariant;
}) {
  const isSterling = variant === "sterling-deposit-flight";

  if (isSterling) {
    return (
      <div className="flex h-full min-h-0 flex-col rounded-2xl border border-[#2b2b2b] bg-[#0D0D0D] text-white shadow-[0_18px_40px_rgba(0,0,0,0.4)]">
        <div className="flex flex-col space-y-1.5 px-6 pt-6 pb-3">
          <div className="text-2xl font-semibold leading-none tracking-tight flex items-center gap-2 text-white text-lg">
            <Users className="h-5 w-5 text-purple-400" />
            Flight-Risk Account Watchlist
          </div>
          <div className="text-sm text-gray-400">
            High-balance accounts showing flight-intent voice — caught before the balance clears.
            Draft save-offer (never auto-send).
          </div>
        </div>
        <div className="min-h-0 flex-1 space-y-3 overflow-y-auto px-6 pb-6">
          {FLIGHT_RISK_ACCOUNTS.map((account) => (
            <div
              key={account.id}
              className="rounded-2xl border border-white/10 bg-white/[0.03] space-y-2.5 p-4"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-white break-words">
                    {account.segmentAccount}
                  </p>
                  <p className="text-xs text-red-400 mt-0.5 font-medium">
                    ▼ Flight-intent voice detected
                  </p>
                </div>
                <div className="text-right text-xs text-gray-400 whitespace-nowrap leading-relaxed flex-shrink-0">
                  <div className="font-medium">
                    {formatBalance(account.balanceAtRisk)} balance at risk
                  </div>
                  <div className="font-medium">ARPAU £{account.arpau}</div>
                </div>
              </div>
              <p className="text-xs text-gray-300 leading-relaxed break-words italic">
                &ldquo;{account.flightQuote}&rdquo;
              </p>
              <div className="flex items-center justify-between text-xs text-gray-400 flex-wrap gap-2">
                <span className="font-medium">
                  Days to likely exit: {account.daysToExit}
                </span>
                {account.retentionWindow ? (
                  <span className="text-amber-400 text-[10px] uppercase tracking-wide font-semibold">
                    Retention window
                  </span>
                ) : null}
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-full min-h-0 flex-col rounded-2xl border border-[#2b2b2b] bg-[#0D0D0D] text-white shadow-[0_18px_40px_rgba(0,0,0,0.4)]">
      <div className="flex flex-col space-y-1.5 px-6 pt-6 pb-3">
        <div className="text-2xl font-semibold leading-none tracking-tight flex items-center gap-2 text-white text-lg">
          <Users className="h-5 w-5 text-purple-400" />
          Influencer & Watchlist Accounts
        </div>
        <div className="text-sm text-gray-400">
          Monitor high-reach creators shaping sentiment around EU retail banking topics
        </div>
      </div>
      <div className="min-h-0 flex-1 space-y-3 overflow-y-auto px-6 pb-6">
        {INFLUENCERS.map((profile) => (
          <div
            key={profile.id}
            className="rounded-2xl border border-white/10 bg-white/[0.03] space-y-2.5 p-4"
          >
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-white break-words">
                  u/{profile.username}
                </p>
                <p
                  className="text-xs capitalize mt-0.5 font-medium"
                  style={{
                    color:
                      profile.sentiment === "positive"
                        ? "#22c55e"
                        : profile.sentiment === "negative"
                          ? "#ef4444"
                          : "#9ca3af",
                  }}
                >
                  {profile.sentiment === "positive"
                    ? "▲ Positive posts trending"
                    : profile.sentiment === "negative"
                      ? "▼ Negative posts trending"
                      : "→ Neutral post trend"}
                </p>
              </div>
              <div className="text-right text-xs text-gray-400 whitespace-nowrap leading-relaxed flex-shrink-0">
                <div className="font-medium">{profile.karma.toLocaleString()} karma</div>
                <div className="font-medium">{profile.followers.toLocaleString()} followers</div>
              </div>
            </div>
            <p className="text-xs text-gray-400 leading-relaxed break-words">
              {profile.lastPostSummary}
            </p>
            <div className="flex items-center justify-between text-xs text-gray-400 flex-wrap gap-2">
              <span className="font-medium">Engagement rate: {profile.engagementRate}%</span>
              {profile.watchlist ? (
                <span className="text-red-400 text-[10px] uppercase tracking-wide font-semibold">
                  Watch closely
                </span>
              ) : null}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
