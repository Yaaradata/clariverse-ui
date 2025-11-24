"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ChevronDown, ChevronUp, ExternalLink, FileText, TrendingUp, X } from "lucide-react";
import { ChannelKey } from "@/lib/unified/adapters";

const CHANNEL_LABELS: Record<ChannelKey, string> = {
  email: "Email",
  chat: "Chat",
  ticket: "Ticket",
  social: "Social",
  voice: "Voice",
};

const CHANNEL_COLORS: Record<ChannelKey, string> = {
  email: "bg-blue-500",
  chat: "bg-emerald-500",
  ticket: "bg-purple-500",
  social: "bg-pink-500",
  voice: "bg-orange-500",
};

export type DominantTopic = {
  id: string;
  name: string;
  count: number;
  channels: ChannelKey[];
  sentiment: number;
  urgency: number;
};

export type ArchaeologyLayer = {
  level: number;
  name: string;
  content: string;
  icon?: string;
  dominantTopics: DominantTopic[];
};

export type ConversationArchaeologyData = {
  customerMessage: string;
  layers: ArchaeologyLayer[];
  conclusion: string;
  businessImpact?: {
    customerTier: string;
    deposits: string;
    annualRevenue: string;
  };
  riskLevel: "Low" | "Medium" | "High" | "Critical";
};

interface ConversationArchaeologyProps {
  data?: ConversationArchaeologyData;
}

const generateMockTopics = (layerName: string, baseCount: number): DominantTopic[] => {
  const topics: DominantTopic[] = [];
  const channelCombos: ChannelKey[][] = [
    ["email"],
    ["chat"],
    ["voice"],
    ["email", "chat"],
    ["ticket", "voice"],
    ["social"],
    ["email", "ticket"],
    ["chat", "voice"],
  ];

  const topicNames: Record<string, string[]> = {
    "Surface Level": [
      "Card assistance request",
      "Account access issue",
      "Payment problem",
      "Transaction inquiry",
      "Balance question",
    ],
    "Explicit Intent": [
      "ATM card malfunction",
      "Card declined at merchant",
      "Card replacement needed",
      "PIN reset request",
      "Card activation issue",
    ],
    "Implicit Need": [
      "Urgent cash access",
      "Medical emergency funding",
      "Time-sensitive payment",
      "Emergency financial need",
      "Critical transaction",
    ],
    "Emotional Core": [
      "Panic and anxiety",
      "Helplessness feeling",
      "Family concern",
      "Trust erosion",
      "Frustration escalation",
    ],
    "Hidden Risk": [
      "Competitor mention",
      "Churn risk indicator",
      "Service dissatisfaction",
      "Relationship strain",
      "Loyalty threat",
    ],
    "Relationship Context": [
      "Recurring technical issues",
      "Patience depletion",
      "Service history pattern",
      "Escalation frequency",
      "Resolution delays",
    ],
    "Business Impact": [
      "Premium customer segment",
      "High deposit account",
      "Significant revenue source",
      "VIP relationship",
      "Strategic account",
    ],
  };

  const names = topicNames[layerName] || ["Topic 1", "Topic 2", "Topic 3", "Topic 4", "Topic 5"];
  
  names.slice(0, 5).forEach((name, idx) => {
    topics.push({
      id: `${layerName}-${idx}`,
      name,
      count: baseCount + Math.floor(Math.random() * 20),
      channels: channelCombos[idx % channelCombos.length],
      sentiment: 2.5 + Math.random() * 2,
      urgency: Math.random(),
    });
  });

  return topics;
};

const defaultData: ConversationArchaeologyData = {
  customerMessage: "I need help with my card",
  layers: [
    {
      level: 1,
      name: "Surface Level",
      content: "Card assistance needed",
      icon: "💬",
      dominantTopics: generateMockTopics("Surface Level", 45),
    },
    {
      level: 2,
      name: "Explicit Intent",
      content: "Card is not working at ATM",
      icon: "🎯",
      dominantTopics: generateMockTopics("Explicit Intent", 38),
    },
    {
      level: 3,
      name: "Implicit Need",
      content: "Need cash urgently for medical emergency",
      icon: "🔍",
      dominantTopics: generateMockTopics("Implicit Need", 32),
    },
    {
      level: 4,
      name: "Emotional Core",
      content: "Panicked, helpless, worried about mother in hospital",
      icon: "💔",
      dominantTopics: generateMockTopics("Emotional Core", 28),
    },
    {
      level: 5,
      name: "Hidden Risk",
      content: "High churn risk - mentioned competitor 3 times in chat",
      icon: "⚠️",
      dominantTopics: generateMockTopics("Hidden Risk", 25),
    },
    {
      level: 6,
      name: "Relationship Context",
      content: "3rd technical issue this month, patience wearing thin",
      icon: "📜",
      dominantTopics: generateMockTopics("Relationship Context", 22),
    },
    {
      level: 7,
      name: "Business Impact",
      content: "Premium customer, ₽8.7M deposits, ₽340K annual revenue",
      icon: "💰",
      dominantTopics: generateMockTopics("Business Impact", 18),
    },
  ],
  conclusion:
    "This is NOT about a card - it's about trust erosion in a high-value relationship during a personal crisis. Needs VP-level intervention with emergency cash solution + relationship repair strategy.",
  businessImpact: {
    customerTier: "Premium",
    deposits: "₽8.7M",
    annualRevenue: "₽340K",
  },
  riskLevel: "Critical",
};

function getRiskColor(risk: ConversationArchaeologyData["riskLevel"]) {
  switch (risk) {
    case "Critical":
      return "text-red-400 border-red-500/30 bg-red-500/10";
    case "High":
      return "text-orange-400 border-orange-500/30 bg-orange-500/10";
    case "Medium":
      return "text-yellow-400 border-yellow-500/30 bg-yellow-500/10";
    case "Low":
      return "text-green-400 border-green-500/30 bg-green-500/10";
  }
}

function getRiskBadge(risk: ConversationArchaeologyData["riskLevel"]) {
  switch (risk) {
    case "Critical":
      return "🔴 Critical Risk";
    case "High":
      return "🟠 High Risk";
    case "Medium":
      return "🟡 Medium Risk";
    case "Low":
      return "🟢 Low Risk";
  }
}

function getSentimentColor(sentiment: number): string {
  if (sentiment <= 2) return "text-red-400";
  if (sentiment <= 3) return "text-yellow-400";
  return "text-green-400";
}

export function ConversationArchaeology({ data = defaultData }: ConversationArchaeologyProps) {
  const [expandedLayers, setExpandedLayers] = useState<Set<number>>(new Set([1, 2, 3, 4, 5, 6, 7]));
  const [showFullExcavation, setShowFullExcavation] = useState(false);
  const [selectedLayer, setSelectedLayer] = useState<ArchaeologyLayer | null>(null);
  const [selectedChannels, setSelectedChannels] = useState<Set<ChannelKey>>(new Set(["email", "chat", "ticket", "social", "voice"]));

  const toggleLayer = (level: number) => {
    const newExpanded = new Set(expandedLayers);
    if (newExpanded.has(level)) {
      newExpanded.delete(level);
    } else {
      newExpanded.add(level);
    }
    setExpandedLayers(newExpanded);
  };

  const toggleAll = () => {
    if (expandedLayers.size === data.layers.length) {
      setExpandedLayers(new Set());
    } else {
      setExpandedLayers(new Set(data.layers.map((l) => l.level)));
    }
  };

  const handleLayerClick = (layer: ArchaeologyLayer) => {
    setSelectedLayer(layer);
  };

  const toggleChannel = (channel: ChannelKey) => {
    const newChannels = new Set(selectedChannels);
    if (newChannels.has(channel)) {
      newChannels.delete(channel);
    } else {
      newChannels.add(channel);
    }
    setSelectedChannels(newChannels);
  };

  const filteredTopics = selectedLayer
    ? selectedLayer.dominantTopics.filter((topic) =>
        topic.channels.some((ch) => selectedChannels.has(ch))
      )
    : [];

  const totalTopicCount = filteredTopics.reduce((sum, topic) => sum + topic.count, 0);

  return (
    <>
      <Card className="border border-white/10 bg-black/30 shadow-lg">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-white flex items-center gap-2">
                <span className="text-2xl">🏺</span>
                Conversation Archaeology
              </CardTitle>
              <CardDescription className="text-gray-400 mt-1">
                Deep-layered analysis revealing hidden intents, emotions, and business impact
              </CardDescription>
            </div>
            <div className={`px-3 py-1 rounded-full border text-xs font-semibold ${getRiskColor(data.riskLevel)}`}>
              {getRiskBadge(data.riskLevel)}
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {/* Customer Message */}
            <div className="rounded-lg border border-purple-500/30 bg-purple-500/10 p-4">
              <div className="text-xs uppercase tracking-wide text-purple-300 mb-2">Customer Message</div>
              <div className="text-white text-lg font-medium italic">"{data.customerMessage}"</div>
            </div>

            {/* Layer KPI Cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-3">
              {data.layers.map((layer) => (
                <Card
                  key={layer.level}
                  className="border border-white/10 bg-black/40 hover:border-purple-500/50 cursor-pointer transition-all"
                  onClick={() => handleLayerClick(layer)}
                >
                  <CardContent className="p-4">
                    <div className="text-center space-y-2">
                      <div className="text-2xl">{layer.icon || "📋"}</div>
                      <div className="text-xs font-semibold text-gray-400">Layer {layer.level}</div>
                      <div className="text-sm font-semibold text-white line-clamp-2">{layer.name}</div>
                      <div className="pt-2 border-t border-white/10">
                        <div className="text-2xl font-bold text-purple-400">{layer.dominantTopics.length}</div>
                        <div className="text-xs text-gray-400">Topics</div>
                        <div className="text-xs text-gray-500 mt-1">
                          {layer.dominantTopics.reduce((sum, t) => sum + t.count, 0)} total
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Layers Detail */}
            <div className="space-y-2">
              <div className="flex items-center justify-between mb-3">
                <div className="text-xs uppercase tracking-wide text-gray-400">Archaeological Layers</div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={toggleAll}
                  className="text-xs text-gray-400 hover:text-white h-6"
                >
                  {expandedLayers.size === data.layers.length ? "Collapse All" : "Expand All"}
                </Button>
              </div>

              {data.layers.map((layer) => {
                const isExpanded = expandedLayers.has(layer.level);
                return (
                  <div
                    key={layer.level}
                    className="rounded-lg border border-white/10 bg-black/40 overflow-hidden transition-all"
                  >
                    <button
                      onClick={() => toggleLayer(layer.level)}
                      className="w-full flex items-center justify-between p-3 hover:bg-white/5 transition-colors"
                    >
                      <div className="flex items-center gap-3 flex-1 text-left">
                        <div className="text-lg">{layer.icon || "📋"}</div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-semibold text-gray-400">Layer {layer.level}</span>
                            <span className="text-sm font-semibold text-white">{layer.name}</span>
                          </div>
                          {isExpanded && (
                            <div className="text-sm text-gray-300 mt-1">{layer.content}</div>
                          )}
                        </div>
                      </div>
                      <div className="ml-2">
                        {isExpanded ? (
                          <ChevronUp className="w-4 h-4 text-gray-400" />
                        ) : (
                          <ChevronDown className="w-4 h-4 text-gray-400" />
                        )}
                      </div>
                    </button>
                  </div>
                );
              })}
            </div>

            {/* Archaeological Conclusion */}
            <div className="rounded-lg border border-amber-500/30 bg-amber-500/10 p-4">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-lg">🎯</span>
                <div className="text-xs uppercase tracking-wide text-amber-300 font-semibold">
                  Archaeological Conclusion
                </div>
              </div>
              <div className="text-white text-sm leading-relaxed">{data.conclusion}</div>
            </div>

            {/* Business Impact */}
            {data.businessImpact && (
              <div className="rounded-lg border border-blue-500/30 bg-blue-500/10 p-4">
                <div className="flex items-center gap-2 mb-3">
                  <TrendingUp className="w-4 h-4 text-blue-300" />
                  <div className="text-xs uppercase tracking-wide text-blue-300 font-semibold">Business Impact</div>
                </div>
                <div className="grid grid-cols-3 gap-4 text-sm">
                  <div>
                    <div className="text-gray-400 text-xs mb-1">Customer Tier</div>
                    <div className="text-white font-semibold">{data.businessImpact.customerTier}</div>
                  </div>
                  <div>
                    <div className="text-gray-400 text-xs mb-1">Total Deposits</div>
                    <div className="text-white font-semibold">{data.businessImpact.deposits}</div>
                  </div>
                  <div>
                    <div className="text-gray-400 text-xs mb-1">Annual Revenue</div>
                    <div className="text-white font-semibold">{data.businessImpact.annualRevenue}</div>
                  </div>
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex flex-wrap gap-2 pt-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowFullExcavation(!showFullExcavation)}
                className="text-xs border-white/10 hover:bg-white/5"
              >
                <FileText className="w-3 h-3 mr-1" />
                {showFullExcavation ? "Hide Full Excavation" : "View Full Excavation"}
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="text-xs border-white/10 hover:bg-white/5"
              >
                <ExternalLink className="w-3 h-3 mr-1" />
                Similar Cases
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="text-xs border-white/10 hover:bg-white/5"
              >
                Action Plan
              </Button>
            </div>

            {/* Full Excavation Details */}
            {showFullExcavation && (
              <div className="mt-4 rounded-lg border border-white/10 bg-black/40 p-4 space-y-3">
                <div className="text-xs uppercase tracking-wide text-gray-400 mb-2">Full Excavation Report</div>
                {data.layers.map((layer) => (
                  <div key={layer.level} className="border-l-2 border-purple-500/30 pl-3 py-2">
                    <div className="text-xs font-semibold text-purple-300 mb-1">
                      Layer {layer.level} - {layer.name}
                    </div>
                    <div className="text-sm text-gray-300">{layer.content}</div>
                  </div>
                ))}
                <div className="pt-2 border-t border-white/10">
                  <div className="text-xs font-semibold text-amber-300 mb-1">Recommended Actions</div>
                  <ul className="text-sm text-gray-300 space-y-1 list-disc list-inside">
                    <li>Immediate VP-level escalation for relationship repair</li>
                    <li>Emergency cash solution deployment within 2 hours</li>
                    <li>Proactive follow-up with personalized apology</li>
                    <li>Competitor threat mitigation strategy</li>
                    <li>Technical issue root cause analysis and prevention</li>
                  </ul>
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Topics Dialog */}
      <Dialog open={!!selectedLayer} onOpenChange={() => setSelectedLayer(null)}>
        <DialogContent className="max-w-4xl max-h-[90vh] bg-black/95 border-white/10">
          <DialogHeader>
            <DialogTitle className="text-white flex items-center gap-2">
              <span className="text-xl">{selectedLayer?.icon}</span>
              <span>Layer {selectedLayer?.level} - {selectedLayer?.name}</span>
            </DialogTitle>
            <DialogDescription className="text-gray-400">
              Dominant topics and their distribution across channels
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            {/* Channel Filters */}
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-xs text-gray-400 uppercase tracking-wide">Filter by Channel:</span>
              {(["email", "chat", "ticket", "social", "voice"] as ChannelKey[]).map((channel) => (
                <Badge
                  key={channel}
                  variant={selectedChannels.has(channel) ? "default" : "outline"}
                  className={`cursor-pointer transition-all ${
                    selectedChannels.has(channel)
                      ? `${CHANNEL_COLORS[channel]} text-white border-0`
                      : "bg-transparent border-white/20 text-gray-400 hover:border-white/40"
                  }`}
                  onClick={() => toggleChannel(channel)}
                >
                  {CHANNEL_LABELS[channel]}
                </Badge>
              ))}
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  if (selectedChannels.size === 5) {
                    setSelectedChannels(new Set());
                  } else {
                    setSelectedChannels(new Set(["email", "chat", "ticket", "social", "voice"]));
                  }
                }}
                className="text-xs h-6 ml-auto"
              >
                {selectedChannels.size === 5 ? "Clear All" : "Select All"}
              </Button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-4 p-3 rounded-lg border border-white/10 bg-black/40">
              <div>
                <div className="text-xs text-gray-400 mb-1">Total Topics</div>
                <div className="text-xl font-bold text-white">{filteredTopics.length}</div>
              </div>
              <div>
                <div className="text-xs text-gray-400 mb-1">Total Count</div>
                <div className="text-xl font-bold text-purple-400">{totalTopicCount}</div>
              </div>
              <div>
                <div className="text-xs text-gray-400 mb-1">Active Channels</div>
                <div className="text-xl font-bold text-blue-400">{selectedChannels.size}</div>
              </div>
            </div>

            {/* Topics List */}
            <ScrollArea className="h-[400px] pr-4">
              <div className="space-y-3">
                {filteredTopics.length === 0 ? (
                  <div className="text-center py-8 text-gray-400">
                    No topics found for selected channels
                  </div>
                ) : (
                  filteredTopics
                    .sort((a, b) => b.count - a.count)
                    .map((topic) => (
                      <Card
                        key={topic.id}
                        className="border border-white/10 bg-black/40 hover:border-purple-500/50 transition-colors"
                      >
                        <CardContent className="p-4">
                          <div className="flex items-start justify-between gap-4">
                            <div className="flex-1">
                              <div className="text-sm font-semibold text-white mb-2">{topic.name}</div>
                              <div className="flex items-center gap-4 text-xs">
                                <div>
                                  <span className="text-gray-400">Count: </span>
                                  <span className="text-purple-400 font-semibold">{topic.count}</span>
                                </div>
                                <div>
                                  <span className="text-gray-400">Sentiment: </span>
                                  <span className={getSentimentColor(topic.sentiment)}>
                                    {topic.sentiment.toFixed(1)}
                                  </span>
                                </div>
                                <div>
                                  <span className="text-gray-400">Urgency: </span>
                                  <span className="text-orange-400">
                                    {(topic.urgency * 100).toFixed(0)}%
                                  </span>
                                </div>
                              </div>
                            </div>
                            <div className="flex items-center gap-1.5">
                              {topic.channels.map((channel) => (
                                <div
                                  key={channel}
                                  className={`w-6 h-6 rounded-full ${CHANNEL_COLORS[channel]} flex items-center justify-center text-white text-[10px] font-semibold`}
                                  title={CHANNEL_LABELS[channel]}
                                >
                                  {CHANNEL_LABELS[channel][0]}
                                </div>
                              ))}
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))
                )}
              </div>
            </ScrollArea>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
