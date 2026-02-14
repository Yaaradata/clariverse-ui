"use client";

import { useState, useMemo } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { PressureScatterDatum } from "./PressureScatterMap";
import { CompactScatterMap } from "./CompactScatterMap";
import { ChannelKey } from "@/lib/unified/adapters";

const CHANNEL_LABELS: Record<string, string> = {
  email: "Email",
  chat: "Chat",
  ticket: "Ticket",
  social: "Social",
  voice: "Voice",
};

const CHANNEL_ORDER: ChannelKey[] = ["email", "chat", "ticket", "social", "voice"];

const DEFAULT_INSIGHT_WALL_CARDS: InsightWallCard[] = [
  { icon: "🔥", title: "Highest Pressure Cluster", context: "Payment Failures", detail: "Voice dominates backlog at 22%, sentiment 4.3, urgency 0.69.", aiInsight: "Re-route authentication into Chat to reduce Voice escalations and cut handle time." },
  { icon: "⚡", title: "Most Volatile Intent", context: "KYC Resubmission", detail: "Sentiment swings +2.1 → -1.4 with 3 escalation spikes per week.", aiInsight: "Standardize document requirements; surface checklist in Email and Chat concurrently." },
  { icon: "❌", title: "Multi-Channel Conflict", context: "Payment Timeout", detail: "Ticket shows closed; Chat pending customer; Voice escalated with sentiment 4.6.", aiInsight: "Require CRM timeline acknowledgment before agents close any related channel thread." },
  { icon: "📊", title: "Backlog Concentration", context: "Billing Issues", detail: "426 unresolved, sentiment 4.0, urgency flagged high.", aiInsight: "Expand automated refund approval thresholds for P2 tickets to relieve backlog." },
  { icon: "🏢", title: "Accountability Mismatch", context: "Account Recovery", detail: "Company-owned actions at 68%, sentiment 4.5, backlog trending upward.", aiInsight: "Shift low-risk resets to self-service scheduling with biometric verification." },
  { icon: "🔁", title: "Cross-Channel Escalation Loop", context: "Mortgage Rate Lock", detail: "Email → Chat → Voice loop raises sentiment from 2.4 to 4.6 within 48 hours.", aiInsight: "Inject underwriting updates into Chat transcripts and proactive email digests." },
];

const channelDotClass: Record<ChannelKey, string> = {
  email: "bg-blue-400",
  chat: "bg-emerald-400",
  ticket: "bg-purple-400",
  social: "bg-pink-400",
  voice: "bg-orange-400",
};

const channelTextClass: Record<ChannelKey, string> = {
  email: "text-blue-400",
  chat: "text-emerald-400",
  ticket: "text-purple-400",
  social: "text-pink-400",
  voice: "text-orange-400",
};

type ClusterSummary = {
  id: string;
  name: string;
  dominantChannels: ChannelKey[];
  avgSentiment: number;
  avgUrgency: number;
  pressureScore: number;
  unresolved: number;
  topSubtopics: string[];
  aiInsight: string;
};

type IntentSeverity = {
  intent: string;
  severity: "Critical" | "High" | "Medium" | "Low";
  pressure: number;
  owner: "Company" | "Customer";
};

type HighPressureIntent = {
  name: string;
  pressure: number;
  channel: ChannelKey;
};

type CrossChannelConflict = {
  intent: string;
  channels: Array<{ channel: ChannelKey; status: string }>;
  aiFix: string;
};

type AIRecommendation = {
  icon: string;
  text: string;
};

type InsightWallCard = {
  icon: string;
  title: string;
  context: string;
  detail: string;
  aiInsight: string;
};

interface IntentIntelligenceCommandCenterProps {
  scatterData?: PressureScatterDatum[];
  clusters?: ClusterSummary[];
  severityData?: IntentSeverity[];
  highPressureIntents?: HighPressureIntent[];
  conflicts?: CrossChannelConflict[];
  recommendations?: AIRecommendation[];
  /** AI Pressure Insight Wall cards (column 3). When omitted, banking defaults are shown. */
  insightWallCards?: InsightWallCard[];
}

// Mock data generators - expanded dataset for better visualization
const defaultScatterData: PressureScatterDatum[] = [
  // Lower left quadrant (low sentiment, low urgency)
  { id: "1", displayName: "Rewards Redemption", sentiment: 2.3, urgency: 0.35, backlogPercent: 11, pressureScore: 3.4, dominantChannel: "email" },
  { id: "2", displayName: "Account Inquiry", sentiment: 2.6, urgency: 0.30, backlogPercent: 8, pressureScore: 2.8, dominantChannel: "chat" },
  
  // Mid-left (moderate sentiment, low-mid urgency)
  { id: "3", displayName: "Statement Request", sentiment: 3.3, urgency: 0.45, backlogPercent: 15, pressureScore: 4.2, dominantChannel: "ticket" },
  
  // Mid-right cluster (moderate-high sentiment, mid urgency)
  { id: "4", displayName: "Payment Timeout", sentiment: 3.8, urgency: 0.65, backlogPercent: 31, pressureScore: 6.8, dominantChannel: "chat" },
  { id: "5", displayName: "Billing Question", sentiment: 3.9, urgency: 0.68, backlogPercent: 28, pressureScore: 6.5, dominantChannel: "email" },
  { id: "6", displayName: "Card Activation", sentiment: 4.0, urgency: 0.58, backlogPercent: 22, pressureScore: 5.9, dominantChannel: "chat" },
  { id: "7", displayName: "Transaction Inquiry", sentiment: 4.2, urgency: 0.70, backlogPercent: 25, pressureScore: 7.1, dominantChannel: "ticket" },
  { id: "8", displayName: "KYC Resubmission", sentiment: 4.2, urgency: 0.60, backlogPercent: 27, pressureScore: 6.2, dominantChannel: "email" },
  
  // Upper right cluster (high sentiment, high urgency)
  { id: "9", displayName: "Credit Card Dispute", sentiment: 4.4, urgency: 0.75, backlogPercent: 18, pressureScore: 7.6, dominantChannel: "social" },
  { id: "10", displayName: "Debit Card Replacement", sentiment: 4.5, urgency: 0.88, backlogPercent: 24, pressureScore: 8.3, dominantChannel: "voice" },
  { id: "11", displayName: "Mortgage Rate Lock", sentiment: 4.6, urgency: 0.85, backlogPercent: 22, pressureScore: 8.9, dominantChannel: "voice" },
  { id: "12", displayName: "Digital Account Recovery", sentiment: 4.7, urgency: 0.90, backlogPercent: 23, pressureScore: 8.6, dominantChannel: "voice" },
];

const defaultClusters: ClusterSummary[] = [
  {
    id: "1",
    name: "Payment Failures & Disputes",
    dominantChannels: ["voice", "social"],
    avgSentiment: 4.3,
    avgUrgency: 0.69,
    pressureScore: 7.1,
    unresolved: 742,
    topSubtopics: ["ACH Reversal", "Payment Timeout"],
    aiInsight: "Re-route authentication to Chat to decompress Voice escalations",
  },
  {
    id: "2",
    name: "Mortgage & Lending Journey",
    dominantChannels: ["chat", "voice"],
    avgSentiment: 4.2,
    avgUrgency: 0.58,
    pressureScore: 6.5,
    unresolved: 529,
    topSubtopics: ["Rate Lock", "Application Status"],
    aiInsight: "Sync underwriting updates into omni-channel timeline",
  },
  {
    id: "3",
    name: "Identity & Security Access",
    dominantChannels: ["email", "voice"],
    avgSentiment: 4.0,
    avgUrgency: 0.63,
    pressureScore: 6.2,
    unresolved: 418,
    topSubtopics: ["Account Recovery", "KYC Resubmission"],
    aiInsight: "Standardize document ask templates and pre-verify submissions",
  },
  {
    id: "4",
    name: "Billing & Statement Questions",
    dominantChannels: ["email", "ticket"],
    avgSentiment: 3.7,
    avgUrgency: 0.46,
    pressureScore: 5.0,
    unresolved: 332,
    topSubtopics: ["Fee Clarification", "Rewards Redemption"],
    aiInsight: "Automate fee-waiver eligibility and self-service statements",
  },
  {
    id: "5",
    name: "Card Access & Replacement",
    dominantChannels: ["voice", "ticket"],
    avgSentiment: 4.4,
    avgUrgency: 0.73,
    pressureScore: 7.9,
    unresolved: 388,
    topSubtopics: ["Debit Replacement", "Fraud Verification"],
    aiInsight: "Carry fraud verification across channel hops",
  },
  {
    id: "6",
    name: "Loan Application Status",
    dominantChannels: ["chat", "social"],
    avgSentiment: 3.4,
    avgUrgency: 0.51,
    pressureScore: 5.2,
    unresolved: 203,
    topSubtopics: ["Status Updates", "Document Upload"],
    aiInsight: "Proactive status pushes could reduce call deflection",
  },
];

const defaultSeverityData: IntentSeverity[] = [
  { intent: "Payment Failures", severity: "Critical", pressure: 92, owner: "Company" },
  { intent: "Delivery Delays", severity: "High", pressure: 86, owner: "Company" },
  { intent: "Account Access", severity: "Medium", pressure: 64, owner: "Customer" },
  { intent: "Billing Questions", severity: "Medium", pressure: 58, owner: "Company" },
  { intent: "Rewards Redemption", severity: "Low", pressure: 32, owner: "Customer" },
];

const defaultHighPressureIntents: HighPressureIntent[] = [
  { name: "Mortgage Rate Lock", pressure: 8.9, channel: "voice" },
  { name: "Digital Account Recovery", pressure: 8.6, channel: "voice" },
  { name: "Debit Card Replacement", pressure: 8.3, channel: "voice" },
  { name: "Credit Card Dispute", pressure: 7.6, channel: "social" },
  { name: "Payment Timeout", pressure: 6.8, channel: "chat" },
];

const defaultConflicts: CrossChannelConflict[] = [
  {
    intent: "Payment Timeout",
    channels: [
      { channel: "email", status: "Closed" },
      { channel: "chat", status: "Pending" },
      { channel: "voice", status: "Escalated" },
    ],
    aiFix: "Require CRM timeline acknowledgment before close",
  },
  {
    intent: "Mortgage Rate Lock",
    channels: [
      { channel: "ticket", status: "Closed" },
      { channel: "voice", status: "Escalated" },
    ],
    aiFix: "Reopen ticket and assign to compliance QA",
  },
  {
    intent: "Credit Card Dispute",
    channels: [
      { channel: "chat", status: "Closed" },
      { channel: "email", status: "Open" },
      { channel: "social", status: "Open" },
    ],
    aiFix: "Link channels in dispute workflow and launch follow-up audit",
  },
];

const defaultRecommendations: AIRecommendation[] = [
  { icon: "🔥", text: "Resolve Payment Failures first; Voice backlog up 22%." },
  { icon: "⚠️", text: "Unify KYC document requests across channels." },
  { icon: "⏳", text: "Ticket queue delay rising—initiate auto-triage." },
  { icon: "🎧", text: "Voice escalation loops detected for \"Rate Lock\"." },
  { icon: "🔁", text: "Carry security verification across channels." },
];

function getSeverityColor(severity: IntentSeverity["severity"]) {
  switch (severity) {
    case "Critical":
      return "text-red-400";
    case "High":
      return "text-orange-400";
    case "Medium":
      return "text-yellow-400";
    case "Low":
      return "text-green-400";
  }
}

function getSeverityIcon(severity: IntentSeverity["severity"]) {
  switch (severity) {
    case "Critical":
      return "🔴";
    case "High":
      return "🟠";
    case "Medium":
      return "🟡";
    case "Low":
      return "🟢";
  }
}

export function IntentIntelligenceCommandCenter({
  scatterData = defaultScatterData,
  clusters = defaultClusters,
  severityData = defaultSeverityData,
  highPressureIntents = defaultHighPressureIntents,
  conflicts = defaultConflicts,
  recommendations = defaultRecommendations,
  insightWallCards,
}: IntentIntelligenceCommandCenterProps) {
  const insightCards = insightWallCards ?? DEFAULT_INSIGHT_WALL_CARDS;
  // State for selected filter: null means "All", otherwise a single channel
  const [selectedFilter, setSelectedFilter] = useState<ChannelKey | "all" | null>("all");

  // Filter scatter data based on selected filter
  const filteredScatterData = useMemo(() => {
    if (selectedFilter === "all" || selectedFilter === null) {
      return scatterData;
    }
    return scatterData.filter((item) => item.dominantChannel === selectedFilter);
  }, [scatterData, selectedFilter]);

  // Handle filter selection
  const handleFilterClick = (channel: ChannelKey | "all") => {
    // If clicking the same filter, toggle back to "all"
    if (selectedFilter === channel) {
      setSelectedFilter("all");
    } else {
      setSelectedFilter(channel);
    }
  };

  // Determine if a channel is selected
  const isChannelSelected = (channel: ChannelKey | "all") => {
    return selectedFilter === channel;
  };

  // Get the number of active channels based on filter
  const getActiveChannelCount = () => {
    if (selectedFilter === "all" || selectedFilter === null) {
      return CHANNEL_ORDER.length;
    }
    return 1;
  };

  return (
    <div className="w-full grid grid-cols-1 lg:grid-cols-3 gap-4 mb-6 items-stretch">
      {/* COLUMN 1 - Intent Landscape Map */}
      <Card className="border border-white/10 bg-black/30 shadow-lg flex flex-col overflow-hidden min-h-0">
        <CardHeader className="pb-3 shrink-0 min-h-20">
          <CardTitle className="text-sm font-semibold text-white">Intent Landscape Map</CardTitle>
          <CardDescription className="text-xs text-gray-400">High-level distribution of 100+ intents</CardDescription>
        </CardHeader>
        <CardContent className="p-4 flex-1 min-h-0">
          {/* Dominant Channel Legend - Now clickable filters */}
          <div className="mb-3 flex flex-wrap items-center gap-2 text-xs text-gray-300">
            <span className="font-semibold">Dominant Channel •</span>
            
            {/* "All" filter button */}
            <button
              onClick={() => handleFilterClick("all")}
              className={`flex items-center gap-1 px-2 py-1 rounded transition-all ${
                isChannelSelected("all")
                  ? "bg-white/10 border border-white/20 opacity-100"
                  : "opacity-40 hover:opacity-60 border border-transparent"
              } hover:bg-white/5 cursor-pointer`}
              title={isChannelSelected("all") ? "Showing all channels" : "Show all channels"}
            >
              <span className="text-gray-300">All</span>
            </button>

            {/* Individual channel filter buttons */}
            {CHANNEL_ORDER.map((channel) => {
              const isSelected = isChannelSelected(channel);
              const channelLabel = CHANNEL_LABELS[channel];
              const channelColor = channelTextClass[channel];
              const emoji = channel === "email" ? "🔵" : channel === "chat" ? "🟢" : channel === "ticket" ? "🟣" : channel === "social" ? "🟠" : "🔴";
              
              return (
                <button
                  key={channel}
                  onClick={() => handleFilterClick(channel)}
                  className={`flex items-center gap-1 px-2 py-1 rounded transition-all ${
                    isSelected
                      ? "bg-white/10 border border-white/20 opacity-100"
                      : "opacity-40 hover:opacity-60 border border-transparent"
                  } hover:bg-white/5 cursor-pointer`}
                  title={isSelected ? `Showing only ${channelLabel}. Click to show all.` : `${channelLabel}`}
                >
                  <span className={channelColor}>
                    {channelLabel} {emoji}
                  </span>
                </button>
              );
            })}
          </div>
          
          <CompactScatterMap data={filteredScatterData} height={260} />
          <div className="mt-2 flex flex-wrap gap-1 text-[9px] text-gray-400 mb-4">
            <span>X: Sentiment</span>
            <span>•</span>
            <span>Y: Urgency</span>
            <span>•</span>
            <span>Size: Volume</span>
            <span>•</span>
            <span>Glow: Pressure</span>
          </div>

          {/* Statistics Panel */}
          <div className="rounded-lg border border-white/10 bg-black/40 p-4 space-y-4">
            {/* Scope */}
            <div>
              <div className="text-[10px] uppercase tracking-wide text-gray-400 mb-1">Scope</div>
              <div className="text-2xl font-bold text-white">{filteredScatterData.length}</div>
              <div className="text-[10px] text-gray-500">
                Active intents mapped across {getActiveChannelCount()} {getActiveChannelCount() === 1 ? "channel" : "channels"}
                {selectedFilter !== "all" && selectedFilter !== null && ` (${CHANNEL_LABELS[selectedFilter]})`}
              </div>
            </div>

            {/* Avg Pressure */}
            <div>
              <div className="text-[10px] uppercase tracking-wide text-gray-400 mb-1">Avg Pressure</div>
              <div className="text-xl font-bold text-white">
                {filteredScatterData.length > 0
                  ? (
                      filteredScatterData.reduce((sum, item) => sum + item.pressureScore, 0) / filteredScatterData.length
                    ).toFixed(1)
                  : "0.0"}
              </div>
              <div className="text-[10px] text-gray-500">Weighted by sentiment tension & backlog</div>
            </div>

            {/* Top Pressure Nodes */}
            <div>
              <div className="text-[10px] uppercase tracking-wide text-gray-400 mb-2">Top Pressure Nodes</div>
              <div className="space-y-1 text-[10px]">
                {filteredScatterData.length > 0 ? (
                  filteredScatterData
                    .slice()
                    .sort((a, b) => b.pressureScore - a.pressureScore)
                    .slice(0, 5)
                    .map((node, idx) => (
                      <div key={node.id} className="flex items-center justify-between">
                        <span className="font-semibold text-gray-100">{node.displayName}</span>
                        <div className="flex items-center gap-2">
                          <span className="text-gray-300">{CHANNEL_LABELS[node.dominantChannel]}</span>
                          <span className="text-purple-200 font-semibold">{node.pressureScore.toFixed(1)}</span>
                        </div>
                      </div>
                    ))
                ) : (
                  <div className="text-gray-500 text-[10px]">No data for selected channels</div>
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
      {/* COLUMN 2 - Cluster Summary Board */}
      <Card className="border border-white/10 bg-black/30 shadow-lg flex flex-col overflow-hidden min-h-0">
        <CardHeader className="pb-3 shrink-0 min-h-20">
          <CardTitle className="text-sm font-semibold text-white">Cluster Summary Board</CardTitle>
          <CardDescription className="text-xs text-gray-400">AI-clustered intents with sentiment, urgency & pressure</CardDescription>
        </CardHeader>
        <CardContent className="p-4 flex-1 min-h-0">
          <ScrollArea className="h-[680px]">
            <div className="space-y-3 pr-2">
              {clusters.map((cluster) => (
                <div
                  key={cluster.id}
                  className="rounded-lg border border-white/10 bg-black/40 p-4 shadow-inner hover:border-amber-400/40 transition-colors"
                >
                  <div className="flex flex-wrap items-center gap-2 text-[10px] font-semibold uppercase tracking-wide text-indigo-200/80 mb-3">
                    <span className="rounded-full border border-indigo-400/40 bg-indigo-500/10 px-2 py-1 text-indigo-100">
                      Cluster
                    </span>
                    <span className="rounded-full border border-white/10 bg-white/5 px-2 py-1 text-gray-200">
                      Dominant: {cluster.dominantChannels.map((channel) => CHANNEL_LABELS[channel]).join(" • ")}
                    </span>
                  </div>
                  
                  <div className="mb-3">
                    <h3 className="text-base font-semibold text-white mb-1">{cluster.name}</h3>
                    <div className="text-xs text-gray-400">{cluster.topSubtopics.join(" • ")}</div>
                  </div>

                  <div className="grid grid-cols-3 gap-2 mb-3">
                    <div>
                      <div className="text-[10px] uppercase tracking-wide text-gray-500 mb-1">Sentiment</div>
                      <div className="text-sm font-semibold text-white">{cluster.avgSentiment.toFixed(1)}</div>
                    </div>
                    <div>
                      <div className="text-[10px] uppercase tracking-wide text-gray-500 mb-1">Urgency</div>
                      <div className="text-sm font-semibold text-white">{(cluster.avgUrgency * 100).toFixed(0)}%</div>
                    </div>
                    <div>
                      <div className="text-[10px] uppercase tracking-wide text-gray-500 mb-1">Pressure</div>
                      <div className="text-sm font-semibold text-white">{cluster.pressureScore.toFixed(1)}</div>
                    </div>
                  </div>

                  <div className="rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-xs text-gray-300 mb-3">
                    Unresolved load: <span className="font-semibold text-white">{cluster.unresolved.toLocaleString()}</span>
                  </div>

                  <div className="text-xs text-purple-300">
                    ✨ {cluster.aiInsight}
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>
        </CardContent>
      </Card>

      {/* COLUMN 3 - AI Pressure Insight Wall */}
      <Card className="border border-white/10 bg-black/30 shadow-lg flex flex-col overflow-hidden min-h-0">
        <CardHeader className="pb-3 shrink-0 min-h-20">
          <CardTitle className="text-sm font-semibold text-white">AI Pressure Insight Wall</CardTitle>
          <CardDescription className="text-xs text-gray-400">Critical insights and AI-driven recommendations</CardDescription>
        </CardHeader>
        <CardContent className="p-4 flex-1 min-h-0">
          <ScrollArea className="h-[680px]">
            <div className="space-y-3 pr-2">
              {insightCards.map((card, idx) => (
                <div key={idx} className="rounded-xl border border-white/10 bg-[rgba(26,26,26,0.45)] p-4 text-sm text-gray-200 shadow-inner">
                  <div className="flex items-center gap-2 text-xs uppercase tracking-wide text-indigo-200/80 mb-2">
                    <span className="text-base">{card.icon}</span>
                    <span>{card.title}</span>
                  </div>
                  <div className="text-base font-semibold text-white mb-1">{card.context}</div>
                  <p className="text-xs text-gray-400 mb-2">{card.detail}</p>
                  <p className="text-xs text-purple-300">✨ {card.aiInsight}</p>
                </div>
              ))}
            </div>
          </ScrollArea>
        </CardContent>
      </Card>
    </div>
  );
}

