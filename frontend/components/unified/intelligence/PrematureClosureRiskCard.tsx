"use client";

import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Mail, MessageSquare, Ticket, Phone, AlertCircle, Filter, X, Sparkles, CheckCircle2, Clock, XCircle, Share2 } from "lucide-react";
import { generatePrematureClosureCases, type PrematureClosureCase, type ChannelStatus } from "@/lib/unified/prematureClosureData";

const getChannelColor = (channel: string) => {
  switch (channel) {
    case "email":
      return { bg: "bg-blue-500", border: "border-blue-400", text: "text-blue-100", light: "bg-blue-500/20" };
    case "ticket":
      return { bg: "bg-purple-500", border: "border-purple-400", text: "text-purple-100", light: "bg-purple-500/20" };
    case "chat":
      return { bg: "bg-green-500", border: "border-green-400", text: "text-green-100", light: "bg-green-500/20" };
    case "voice":
      return { bg: "bg-red-500", border: "border-red-400", text: "text-red-100", light: "bg-red-500/20" };
    case "social":
      return { bg: "bg-pink-500", border: "border-pink-400", text: "text-pink-100", light: "bg-pink-500/20" };
    default:
      return { bg: "bg-gray-500", border: "border-gray-400", text: "text-gray-100", light: "bg-gray-500/20" };
  }
};

const getChannelIcon = (channel: string) => {
  switch (channel) {
    case "email":
      return Mail;
    case "ticket":
      return Ticket;
    case "chat":
      return MessageSquare;
    case "voice":
      return Phone;
    case "social":
      return Share2;
    default:
      return Mail;
  }
};

const getRiskLevelColor = (riskLevel: "high" | "medium" | "low") => {
  switch (riskLevel) {
    case "high":
      return {
        bg: "bg-red-500/20",
        border: "border-red-400/40",
        text: "text-red-100",
        badge: "bg-red-500/30 border-red-400/50 text-red-200",
      };
    case "medium":
      return {
        bg: "bg-amber-500/20",
        border: "border-amber-400/40",
        text: "text-amber-100",
        badge: "bg-amber-500/30 border-amber-400/50 text-amber-200",
      };
    case "low":
      return {
        bg: "bg-emerald-500/20",
        border: "border-emerald-400/40",
        text: "text-emerald-100",
        badge: "bg-emerald-500/30 border-emerald-400/50 text-emerald-200",
      };
  }
};

const getSentimentColor = (score: number) => {
  if (score <= 2) return "text-emerald-400";
  if (score <= 3) return "text-amber-400";
  if (score <= 4) return "text-orange-400";
  return "text-red-400";
};

const getStatusIcon = (status: string) => {
  switch (status) {
    case "closed":
      return CheckCircle2;
    case "active":
      return Clock;
    case "pending":
      return XCircle;
    default:
      return Clock;
  }
};

const getStatusColor = (status: string) => {
  switch (status) {
    case "closed":
      return "text-emerald-400";
    case "active":
      return "text-blue-400";
    case "pending":
      return "text-amber-400";
    default:
      return "text-gray-400";
  }
};

export function PrematureClosureRiskCard() {
  const [cases, setCases] = useState<PrematureClosureCase[]>([]);
  const [riskFilter, setRiskFilter] = useState<"all" | "high" | "medium" | "low">("all");

  useEffect(() => {
    const prematureCases = generatePrematureClosureCases();
    setCases(prematureCases);
  }, []);

  const filteredCases = riskFilter === "all" 
    ? cases 
    : cases.filter(c => c.riskLevel === riskFilter);

  const riskCounts = {
    high: cases.filter(c => c.riskLevel === "high").length,
    medium: cases.filter(c => c.riskLevel === "medium").length,
    low: cases.filter(c => c.riskLevel === "low").length,
  };

  return (
    <Card className="border border-[color:var(--border)] bg-[color:var(--card)] p-6 shadow-lg">
      <div className="mb-6">
        <div className="flex items-center justify-between mb-2">
          <h2 className="text-2xl font-bold text-white">✨ Premature Closure Risk Audit</h2>
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-white/10 bg-[rgba(26,26,26,0.6)]">
              <Filter className="h-4 w-4 text-gray-400" />
              <select
                value={riskFilter}
                onChange={(e) => setRiskFilter(e.target.value as any)}
                className="bg-transparent text-white text-sm border-none outline-none"
              >
                <option value="all">All Risks ({cases.length})</option>
                <option value="high">High ({riskCounts.high})</option>
                <option value="medium">Medium ({riskCounts.medium})</option>
                <option value="low">Low ({riskCounts.low})</option>
              </select>
            </div>
          </div>
        </div>
        <p className="text-sm text-gray-400">
          Cases where tickets were closed but the same issue was raised again in another channel
        </p>
      </div>

      <div className="relative">
        <h4 className="text-sm font-semibold text-white mb-3">Premature Closure Cases</h4>
        <ScrollArea className="h-[600px] pr-2">
          <div className="space-y-3 relative">
            {filteredCases.length > 0 ? (
              filteredCases.map((caseItem) => {
                const severityColors = {
                  high: "bg-red-500/20 border-red-400/40 text-red-100",
                  medium: "bg-amber-500/20 border-amber-400/40 text-amber-100",
                  low: "bg-emerald-500/20 border-emerald-400/40 text-emerald-100",
                };

                return (
                  <Card
                    key={caseItem.id}
                    className="border border-white/10 bg-[rgba(15,15,15,0.8)] p-4 hover:border-[#b90abd]/40 transition-all"
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <h5 className="text-base font-semibold text-white">{caseItem.customerId}</h5>
                          <Badge className={`${severityColors[caseItem.riskLevel]} text-xs`}>
                            {caseItem.riskLevel.toUpperCase()}
                          </Badge>
                        </div>
                        
                        {/* Issue Summary */}
                        <div className="flex items-center gap-3 text-xs text-gray-400 mb-2 flex-wrap">
                          <div className="flex items-center gap-1">
                            <span className="text-sm font-medium text-gray-200">{caseItem.issueType}</span>
                            <span>•</span>
                            <span>{caseItem.intentCluster}</span>
                            <span>•</span>
                            <span>{caseItem.timestamp}</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Description */}
                    <div className="mb-3">
                      <p className="text-xs text-gray-300 leading-relaxed">{caseItem.description}</p>
                    </div>

                    {/* Channel Status Timeline */}
                    <div className="mb-3 p-3 rounded-lg bg-[rgba(26,26,26,0.6)] border border-white/5">
                      <div className="text-xs text-gray-400 mb-2 font-semibold uppercase tracking-wide">Channel Status</div>
                      <div className="flex items-center gap-3 flex-wrap">
                        {caseItem.channels.map((channel, index) => {
                          const channelColors = getChannelColor(channel.channel);
                          const ChannelIcon = getChannelIcon(channel.channel);
                          const StatusIcon = getStatusIcon(channel.status);
                          const isPending = channel.status === "pending";

                          return (
                            <div key={index} className="flex items-center gap-2">
                              {/* Status Icon */}
                              <StatusIcon className={`h-4 w-4 ${getStatusColor(channel.status)} flex-shrink-0`} />
                              
                              {/* Channel Badge */}
                              <div
                                className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded border ${channelColors.border} border-opacity-40 ${channelColors.light}`}
                              >
                                <ChannelIcon className={`h-3.5 w-3.5 ${channelColors.text}`} />
                                <span className={`${channelColors.text} capitalize text-xs font-medium`}>
                                  {channel.channel}
                                </span>
                              </div>

                              {/* Sentiment Score */}
                              <div className="flex items-center gap-1">
                                <span className={`text-sm font-bold ${getSentimentColor(channel.sentiment)}`}>
                                  {channel.sentiment.toFixed(1)}
                                </span>
                                <span className="text-xs text-gray-400">({channel.sentimentLabel})</span>
                              </div>

                              {/* Status Label */}
                              <div className="flex items-center gap-1">
                                <span className="text-xs text-gray-300">{channel.statusLabel}</span>
                                {isPending && (
                                  <span className="text-xs text-amber-400 font-semibold ml-1">Pending bank action</span>
                                )}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>

                    {/* AI Action Suggestion */}
                    <div className="p-3 rounded-lg bg-[rgba(251,191,36,0.1)] border border-amber-400/30">
                      <div className="flex items-center gap-2 mb-2">
                        <Sparkles className="h-4 w-4 text-amber-400" />
                        <div className="text-xs font-semibold text-amber-300 uppercase tracking-wide">
                          ✨ Action
                        </div>
                      </div>
                      <p className="text-xs text-gray-200 leading-relaxed">{caseItem.aiAction}</p>
                    </div>
                  </Card>
                );
              })
            ) : (
              <div className="text-center py-8 text-gray-500">
                <p>No premature closure cases found</p>
              </div>
            )}
          </div>
        </ScrollArea>
      </div>
    </Card>
  );
}

