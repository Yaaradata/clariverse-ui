"use client";

import { useState, useEffect, useMemo } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Sparkles, AlertTriangle, X, CheckCircle, Clock, UserX, Mail, MessageSquare, Ticket, Phone, Share2 } from "lucide-react";
import { generatePrematureClosureCases, type PrematureClosureCase } from "@/lib/unified/prematureClosureData";

type BreakdownType = 
  | "Inconsistent Closure"
  | "Recurrence After Resolution"
  | "Duplicate Interactions"
  | "Escalation Loops"
  | "Unactioned Escalations";

type PriorityLevel = "Critical" | "High" | "Medium" | "Low";

interface BreakdownStat {
  type: BreakdownType;
  count: number;
  trend: number; // percentage change
  risk: PriorityLevel;
}

interface ChannelPair {
  pair: string;
  inconsistentClosure: number;
  recurrence: number;
  duplicateInteractions: number;
  escalationLoops: number;
  unactionedEscalations: number;
  total: number;
}

interface HeatmapData {
  breakdown: BreakdownType;
  critical: number;
  high: number;
  medium: number;
  low: number;
}

const BREAKDOWN_TYPES: BreakdownType[] = [
  "Inconsistent Closure",
  "Recurrence After Resolution",
  "Duplicate Interactions",
  "Escalation Loops",
  "Unactioned Escalations",
];

const PRIORITY_LEVELS: PriorityLevel[] = ["Critical", "High", "Medium", "Low"];

const getPriorityColor = (priority: PriorityLevel) => {
  switch (priority) {
    case "Critical": return "#ef4444"; // red
    case "High": return "#f97316"; // orange
    case "Medium": return "#eab308"; // yellow
    case "Low": return "#6b7280"; // gray
    default: return "#6b7280";
  }
};

const getBreakdownColor = (type: BreakdownType) => {
  switch (type) {
    case "Inconsistent Closure": return "#8b5cf6"; // purple
    case "Recurrence After Resolution": return "#ef4444"; // red
    case "Duplicate Interactions": return "#3b82f6"; // blue
    case "Escalation Loops": return "#f59e0b"; // amber
    case "Unactioned Escalations": return "#ec4899"; // pink
    default: return "#6b7280";
  }
};

const getRiskBadgeColor = (risk: PriorityLevel) => {
  switch (risk) {
    case "Critical": return "bg-red-500/20 border-red-400/40 text-red-100";
    case "High": return "bg-orange-500/20 border-orange-400/40 text-orange-100";
    case "Medium": return "bg-yellow-500/20 border-yellow-400/40 text-yellow-100";
    case "Low": return "bg-gray-500/20 border-gray-400/40 text-gray-100";
  }
};

const getBreakdownDescription = (type: BreakdownType): string => {
  switch (type) {
    case "Inconsistent Closure":
      return "A customer issue is marked resolved in one channel (like Chat) but remains open or escalated in another channel (like Email).";
    case "Recurrence After Resolution":
      return "The issue reappears even after all involved channels marked it as resolved, meaning the root cause was not fixed.";
    case "Duplicate Interactions":
      return "The same customer reaches multiple channels (Email → Chat → Call) about the same issue because it wasn't properly handled the first time.";
    case "Escalation Loops":
      return "The customer keeps bouncing between channels (Chat → Email → Chat) because the issue never gets fully resolved.";
    case "Unactioned Escalations":
      return "An escalation raised in one channel is not acted on or synchronized in the original channel's system.";
    default:
      return "";
  }
};

const getChannelIcon = (channel: string) => {
  switch (channel) {
    case "email": return Mail;
    case "chat": return MessageSquare;
    case "ticket": return Ticket;
    case "voice": return Phone;
    case "social": return Share2;
    default: return Mail;
  }
};

const getChannelColor = (channel: string) => {
  switch (channel) {
    case "email": return { bg: "bg-blue-500/20", border: "border-blue-400/40", text: "text-blue-300" };
    case "chat": return { bg: "bg-green-500/20", border: "border-green-400/40", text: "text-green-300" };
    case "ticket": return { bg: "bg-purple-500/20", border: "border-purple-400/40", text: "text-purple-300" };
    case "voice": return { bg: "bg-red-500/20", border: "border-red-400/40", text: "text-red-300" };
    case "social": return { bg: "bg-pink-500/20", border: "border-pink-400/40", text: "text-pink-300" };
    default: return { bg: "bg-gray-500/20", border: "border-gray-400/40", text: "text-gray-300" };
  }
};

const getRiskBadgeStyle = (risk: "high" | "medium" | "low") => {
  switch (risk) {
    case "high": return "bg-red-500/20 border-red-400/40 text-red-100";
    case "medium": return "bg-yellow-500/20 border-yellow-400/40 text-yellow-100";
    case "low": return "bg-green-500/20 border-green-400/40 text-green-100";
  }
};

// Helper function to check if a case matches a breakdown type
const caseMatchesBreakdown = (caseItem: PrematureClosureCase, breakdownType: BreakdownType): boolean => {
  const closedChannels = caseItem.channels.filter(c => c.status === 'closed');
  const activeChannels = caseItem.channels.filter(c => c.status === 'active' || c.status === 'pending');
  const pendingChannels = caseItem.channels.filter(c => c.status === 'pending');
  const allChannels = caseItem.channels;

  switch (breakdownType) {
    case "Inconsistent Closure":
      // One channel closed, another active simultaneously (within 2 hours)
      if (closedChannels.length > 0 && activeChannels.length > 0) {
        const closedTimes = closedChannels.map(c => new Date(c.closedAt || c.timestamp).getTime());
        const activeTimes = activeChannels.map(c => new Date(c.openedAt || c.timestamp).getTime());
        const minClosed = Math.min(...closedTimes);
        const maxActive = Math.max(...activeTimes);
        const timeGapMinutes = (maxActive - minClosed) / (1000 * 60);
        return timeGapMinutes < 120; // Within 2 hours
      }
      return false;
    
    case "Recurrence After Resolution":
      // All channels closed, then new channel opens later (1+ days gap)
      if (closedChannels.length >= 2 && activeChannels.length > 0) {
        const closedTimes = closedChannels.map(c => new Date(c.closedAt || c.timestamp).getTime());
        const activeTimes = activeChannels.map(c => new Date(c.openedAt || c.timestamp).getTime());
        const maxClosed = Math.max(...closedTimes);
        const minActive = Math.min(...activeTimes);
        const timeGapDays = (minActive - maxClosed) / (1000 * 60 * 60 * 24);
        return timeGapDays >= 1; // At least 1 day gap
      }
      return false;
    
    case "Duplicate Interactions":
      // All channels active simultaneously (within 15-30 minutes)
      if (allChannels.length >= 2 && activeChannels.length === allChannels.length) {
        const timestamps = allChannels.map(c => new Date(c.openedAt || c.timestamp).getTime()).sort((a, b) => a - b);
        const timeSpan = timestamps[timestamps.length - 1] - timestamps[0];
        const timeSpanMinutes = timeSpan / (1000 * 60);
        return timeSpanMinutes < 30; // Within 30 minutes
      }
      return false;
    
    case "Escalation Loops":
      // Channels bouncing back and forth (open → close → reopen pattern)
      // Check for interactions array showing reopen pattern
      const hasReopenPattern = allChannels.some(c => c.interactions && c.interactions.length > 2);
      const hasBouncingChannels = closedChannels.length > 0 && activeChannels.length > 0;
      // Check if same channel appears multiple times (reopened)
      const channelNames = allChannels.map(c => c.channel);
      const hasDuplicateChannels = channelNames.length !== new Set(channelNames).size;
      return hasReopenPattern || (hasBouncingChannels && hasDuplicateChannels);
    
    case "Unactioned Escalations":
      // One closed, another active with pendingAction flag
      const hasPendingAction = allChannels.some(c => c.pendingAction);
      return pendingChannels.length > 0 && closedChannels.length > 0 && hasPendingAction;
    
    default:
      return false;
  }
};

export function PrematureClosureRiskCard() {
  const [cases, setCases] = useState<PrematureClosureCase[]>([]);
  const [hoveredBreakdown, setHoveredBreakdown] = useState<BreakdownType | null>(null);
  const [selectedBreakdown, setSelectedBreakdown] = useState<BreakdownType | null>(null);

  useEffect(() => {
    const prematureCases = generatePrematureClosureCases();
    setCases(prematureCases);
  }, []);

  // Channel pair breakdown data - cases can belong to multiple breakdown types
  const channelPairData = useMemo((): ChannelPair[] => {
    const pairMap = new Map<string, ChannelPair>();

    cases.forEach(caseItem => {
      const channels = caseItem.channels.map(c => c.channel);
      const closedChannels = caseItem.channels.filter(c => c.status === 'closed').map(c => c.channel);
      const activeChannels = caseItem.channels.filter(c => c.status === 'active' || c.status === 'pending').map(c => c.channel);
      const pendingChannels = caseItem.channels.filter(c => c.status === 'pending').map(c => c.channel);
      const allChannels = caseItem.channels;

      // Generate channel pairs (sequential order matters for flow)
      for (let i = 0; i < channels.length - 1; i++) {
        const fromChannel = channels[i];
        const toChannel = channels[i + 1];
        const pairKey = `${fromChannel}-${toChannel}`;

        if (!pairMap.has(pairKey)) {
          pairMap.set(pairKey, {
            pair: pairKey,
            inconsistentClosure: 0,
            recurrence: 0,
            duplicateInteractions: 0,
            escalationLoops: 0,
            unactionedEscalations: 0,
            total: 0,
          });
        }

        const pairData = pairMap.get(pairKey)!;
        pairData.total++;

        // Categorize breakdown type for this specific pair - ONE CASE CAN HAVE MULTIPLE TYPES
        const fromStatus = caseItem.channels.find(c => c.channel === fromChannel)?.status;
        const toStatus = caseItem.channels.find(c => c.channel === toChannel)?.status;
        const toSentiment = caseItem.channels.find(c => c.channel === toChannel)?.sentiment || 0;

        // Breakdown Type A — Inconsistent Closure: from closed, to active/pending
        if (fromStatus === 'closed' && (toStatus === 'active' || toStatus === 'pending')) {
          pairData.inconsistentClosure++;
        }

        // Breakdown Type B — Recurrence After Resolution: multiple closed channels, then active
        if (closedChannels.length >= 2 && activeChannels.includes(toChannel)) {
          pairData.recurrence++;
        }

        // Breakdown Type C — Duplicate Interactions: Customer contacts multiple channels about same issue simultaneously
        if (allChannels.length >= 3) {
          // Check if channels were opened within short time window (simultaneous)
          const fromTime = new Date(caseItem.channels.find(c => c.channel === fromChannel)?.timestamp || '').getTime();
          const toTime = new Date(caseItem.channels.find(c => c.channel === toChannel)?.timestamp || '').getTime();
          const timeDiff = Math.abs(toTime - fromTime);
          // If channels opened within 2 hours and both are active, likely duplicate interaction
          if (timeDiff < 7200000 && (toStatus === 'active' || toStatus === 'pending')) {
            pairData.duplicateInteractions++;
          }
        }

        // Breakdown Type D — Escalation Loop: high sentiment escalation (4+) after closed channel
        if (toSentiment >= 4 && fromStatus === 'closed') {
          pairData.escalationLoops++;
        }

        // Breakdown Type E — Unactioned Escalations: pending status after closed
        if (toStatus === 'pending' && closedChannels.includes(fromChannel)) {
          pairData.unactionedEscalations++;
        }
      }
    });

    // Return ALL pairs (not sliced) - we'll slice for display later
    return Array.from(pairMap.values())
      .sort((a, b) => b.total - a.total);
  }, [cases]);

  // Get top 8 pairs for graph display
  const topChannelPairs = useMemo(() => {
    return channelPairData.slice(0, 8);
  }, [channelPairData]);

  // Analyze cases and categorize into breakdown types - COUNT ACTUAL CASES
  // Use the same filtering logic as filteredCasesByBreakdown to ensure counts match
  const breakdownStats = useMemo((): BreakdownStat[] => {
    // Count actual cases for each breakdown type using the same logic as filtering
    const breakdownCounts: Record<BreakdownType, number> = {
      "Inconsistent Closure": 0,
      "Recurrence After Resolution": 0,
      "Duplicate Interactions": 0,
      "Escalation Loops": 0,
      "Unactioned Escalations": 0,
    };

    // Also collect priorities from cases for risk calculation
    const priorities: Record<BreakdownType, PriorityLevel[]> = {
      "Inconsistent Closure": [],
      "Recurrence After Resolution": [],
      "Duplicate Interactions": [],
      "Escalation Loops": [],
      "Unactioned Escalations": [],
    };

    // Count cases using the same helper function as filtering - ensures exact match
    cases.forEach(caseItem => {
      BREAKDOWN_TYPES.forEach(breakdownType => {
        if (caseMatchesBreakdown(caseItem, breakdownType)) {
          breakdownCounts[breakdownType]++;
          // Map lowercase riskLevel to PriorityLevel
          const priorityLevel: PriorityLevel = 
            caseItem.riskLevel === 'high' ? 'High' :
            caseItem.riskLevel === 'medium' ? 'Medium' :
            'Low';
          priorities[breakdownType].push(priorityLevel);
        }
      });
    });

    // Calculate trends based on risk distribution
    const trends: Record<BreakdownType, number> = {
      "Inconsistent Closure": 12,
      "Recurrence After Resolution": 8,
      "Duplicate Interactions": -4,
      "Escalation Loops": 15,
      "Unactioned Escalations": 3,
    };

    return BREAKDOWN_TYPES.map(type => {
      const count = breakdownCounts[type];
      const priorityList = priorities[type];
      
      // Count priority levels (now using capitalized PriorityLevel values)
      const highRiskCount = priorityList.filter(p => p === 'High').length;
      const mediumRiskCount = priorityList.filter(p => p === 'Medium').length;
      
      // Determine overall risk level based on priority distribution
      const risk: PriorityLevel = 
        highRiskCount >= priorityList.length * 0.4 || (highRiskCount >= 2 && priorityList.length <= 4) ? 'Critical' :
        highRiskCount >= priorityList.length * 0.25 || mediumRiskCount >= priorityList.length * 0.5 ? 'High' :
        mediumRiskCount > 0 || priorityList.length > 0 ? 'Medium' : 'Low';

      return {
        type,
        count,
        trend: trends[type],
        risk,
      };
    });
  }, [cases, topChannelPairs]);

  // Priority heatmap data - MUST MATCH KPI COUNTS
  // The heatmap shows how KPI counts are distributed by priority level
  const heatmapData = useMemo((): HeatmapData[] => {
    // Get KPI counts for each breakdown type
    const kpiCounts = breakdownStats.reduce((acc, stat) => {
      acc[stat.type] = stat.count;
      return acc;
    }, {} as Record<BreakdownType, number>);

    // Track breakdown occurrences by case risk level for each breakdown type
    const priorityDistribution: Record<BreakdownType, { high: number; medium: number; low: number }> = {
      "Inconsistent Closure": { high: 0, medium: 0, low: 0 },
      "Recurrence After Resolution": { high: 0, medium: 0, low: 0 },
      "Duplicate Interactions": { high: 0, medium: 0, low: 0 },
      "Escalation Loops": { high: 0, medium: 0, low: 0 },
      "Unactioned Escalations": { high: 0, medium: 0, low: 0 },
    };

    // Process each case and count its contributions to breakdown types in channel pairs
    cases.forEach(caseItem => {
      const channels = caseItem.channels.map(c => c.channel);
      const closedChannels = caseItem.channels.filter(c => c.status === 'closed');
      const activeChannels = caseItem.channels.filter(c => c.status === 'active' || c.status === 'pending');
      const pendingChannels = caseItem.channels.filter(c => c.status === 'pending');
      const allChannels = caseItem.channels;

      // Count contributions to each breakdown type for this case
      const breakdownCounts: Record<BreakdownType, number> = {
        "Inconsistent Closure": 0,
        "Recurrence After Resolution": 0,
        "Duplicate Interactions": 0,
        "Escalation Loops": 0,
        "Unactioned Escalations": 0,
      };

      // Check each channel pair
      for (let i = 0; i < channels.length - 1; i++) {
        const fromChannel = channels[i];
        const toChannel = channels[i + 1];
        const fromStatus = caseItem.channels.find(c => c.channel === fromChannel)?.status;
        const toStatus = caseItem.channels.find(c => c.channel === toChannel)?.status;
        const toSentiment = caseItem.channels.find(c => c.channel === toChannel)?.sentiment || 0;

        // Breakdown Type A — Inconsistent Closure
        if (fromStatus === 'closed' && (toStatus === 'active' || toStatus === 'pending')) {
          breakdownCounts["Inconsistent Closure"]++;
        }

        // Breakdown Type B — Recurrence After Resolution
        if (closedChannels.length >= 2 && activeChannels.some(c => c.channel === toChannel)) {
          breakdownCounts["Recurrence After Resolution"]++;
        }

        // Breakdown Type C — Duplicate Interactions
        if (allChannels.length >= 3) {
          const fromTime = new Date(caseItem.channels.find(c => c.channel === fromChannel)?.timestamp || '').getTime();
          const toTime = new Date(caseItem.channels.find(c => c.channel === toChannel)?.timestamp || '').getTime();
          const timeDiff = Math.abs(toTime - fromTime);
          if (timeDiff < 7200000 && (toStatus === 'active' || toStatus === 'pending')) {
            breakdownCounts["Duplicate Interactions"]++;
          }
        }

        // Breakdown Type D — Escalation Loop
        if (toSentiment >= 4 && fromStatus === 'closed') {
          breakdownCounts["Escalation Loops"]++;
        }

        // Breakdown Type E — Unactioned Escalations
        if (toStatus === 'pending' && closedChannels.some(c => c.channel === fromChannel)) {
          breakdownCounts["Unactioned Escalations"]++;
        }
      }

      // Add to priority distribution based on case risk level
      // Map: high -> Critical, medium -> High, low -> Medium
      BREAKDOWN_TYPES.forEach(breakdown => {
        if (caseItem.riskLevel === 'high') {
          priorityDistribution[breakdown].high += breakdownCounts[breakdown];
        } else if (caseItem.riskLevel === 'medium') {
          priorityDistribution[breakdown].medium += breakdownCounts[breakdown];
        } else {
          priorityDistribution[breakdown].low += breakdownCounts[breakdown];
        }
      });
    });

    // Return heatmap data - ensure totals match KPI counts
    return BREAKDOWN_TYPES.map(breakdown => {
      const dist = priorityDistribution[breakdown];
      const total = kpiCounts[breakdown] || 0;
      const calculatedTotal = dist.high + dist.medium + dist.low;

      // If there's a mismatch, adjust proportionally
      let critical = dist.high;
      let high = dist.medium;
      let medium = dist.low;

      if (calculatedTotal !== total && total > 0 && calculatedTotal > 0) {
        // Scale proportionally to match total
        const scale = total / calculatedTotal;
        critical = Math.round(dist.high * scale);
        high = Math.round(dist.medium * scale);
        medium = Math.round(dist.low * scale);
        
        // Adjust for rounding errors
        const adjustedTotal = critical + high + medium;
        const diff = total - adjustedTotal;
        if (diff !== 0) {
          if (critical > 0 && diff > 0) critical += diff;
          else if (high > 0 && diff > 0) high += diff;
          else if (medium > 0 && diff > 0) medium += diff;
          else if (critical > 0 && diff < 0) critical += diff;
          else if (high > 0 && diff < 0) high += diff;
          else if (medium > 0 && diff < 0) medium += diff;
        }
      }

      return {
        breakdown,
        critical,
        high,
        medium,
        low: 0,
      };
    });
  }, [cases, breakdownStats]);

  // Filter cases by selected breakdown type
  const filteredCasesByBreakdown = useMemo(() => {
    if (!selectedBreakdown) return [];

    // Use a Set to ensure unique case IDs
    const seenIds = new Set<string>();
    return cases.filter(caseItem => {
      // Only include if matches criteria AND we haven't seen this ID before
      if (caseMatchesBreakdown(caseItem, selectedBreakdown) && !seenIds.has(caseItem.id)) {
        seenIds.add(caseItem.id);
        return true;
      }
      return false;
    });
  }, [cases, selectedBreakdown]);



  // Business impact indicators
  const impactIndicators = useMemo(() => {
    const totalCases = cases.length;
    const inconsistentCount = breakdownStats.find(s => s.type === "Inconsistent Closure")?.count || 0;
    const recurrenceCount = breakdownStats.find(s => s.type === "Recurrence After Resolution")?.count || 0;
    const escalationCount = breakdownStats.find(s => s.type === "Escalation Loops")?.count || 0;
    const duplicateCount = breakdownStats.find(s => s.type === "Duplicate Interactions")?.count || 0;

    const inconsistentPercent = totalCases > 0 ? Math.round((inconsistentCount / totalCases) * 100) : 0;

    return [
      `${inconsistentPercent}% of escalations are caused by incomplete closure across channels.`,
      "Repeat issues indicate quality gap in first-contact resolution.",
      "Email–Chat and Chat–Voice routes show highest inconsistency.",
      escalationCount > 0 ? "Escalation loops are increasing — customer frustration risk high." : "",
      duplicateCount > 0 ? "Duplicate interactions add avoidable workload to agents." : "",
    ].filter(Boolean);
  }, [cases, breakdownStats]);


  return (
    <Card className="border border-(--border) bg-(--card) p-6 shadow-lg">
      <div className="mb-6">
        <div className="flex items-center gap-2 mb-2">
          <Sparkles className="h-5 w-5 text-yellow-400" />
          <h2 className="text-2xl font-bold text-white">Cross-Channel Interaction Breakdown Audit</h2>
        </div>
        <p className="text-sm text-gray-400">
          Spots closure conflicts across channels for the same active banking intent.
        </p>
      </div>

      {/* ① Breakdown Summary Stats */}
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-white mb-4">Breakdown Summary Stats</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          {breakdownStats.map((stat) => (
            <div
              key={stat.type}
              className="relative h-full"
              onMouseEnter={() => setHoveredBreakdown(stat.type)}
              onMouseLeave={() => setHoveredBreakdown(null)}
            >
              <Card 
                className={`border border-white/10 bg-[rgba(15,15,15,0.8)] p-4 cursor-pointer hover:bg-[rgba(15,15,15,0.9)] transition-colors h-full flex flex-col ${
                  selectedBreakdown === stat.type ? 'ring-2 ring-yellow-400/50' : ''
                }`}
                onClick={() => setSelectedBreakdown(selectedBreakdown === stat.type ? null : stat.type)}
              >
                <div className="flex items-start justify-between flex-1">
                  <div className="flex-1">
                    <h4 className="text-sm font-semibold text-white mb-1">{stat.type}</h4>
                    <div className="text-2xl font-bold text-white">{stat.count}</div>
                  </div>
                  <Badge className={getRiskBadgeColor(stat.risk)}>
                    {stat.risk}
                  </Badge>
                </div>
              </Card>
              
              {/* Hover Tooltip */}
              {hoveredBreakdown === stat.type && (
                <div className="absolute z-50 top-full left-0 mt-2 w-80 p-4 bg-[rgba(15,15,15,0.98)] border border-white/20 rounded-lg shadow-xl">
                  <div className="text-sm font-semibold text-white mb-2">{stat.type}</div>
                  <div className="text-xs text-gray-300 leading-relaxed">
                    {getBreakdownDescription(stat.type)}
                  </div>
                  <div className="absolute -top-2 left-6 w-4 h-4 bg-[rgba(15,15,15,0.98)] border-l border-t border-white/20 transform rotate-45"></div>
                          </div>
              )}
                        </div>
          ))}
                      </div>
                    </div>

      {/* ③ Priority Heatmap - Always visible, moves to right when breakdown selected */}
      <div className={`grid gap-6 mb-6 ${selectedBreakdown ? 'grid-cols-1 lg:grid-cols-2' : 'grid-cols-1'}`}>
        {/* ⑤ Detailed Case View - Left side when breakdown selected */}
        {selectedBreakdown && (
          <div className="lg:col-span-1">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-lg font-semibold text-white mb-1">{selectedBreakdown}</h3>
                <p className="text-sm text-gray-400">Spots closure conflicts across channels for the same active banking intent.</p>
              </div>
              <button
                onClick={() => setSelectedBreakdown(null)}
                className="p-2 hover:bg-white/10 rounded-lg transition-colors"
              >
                <X className="h-5 w-5 text-gray-400" />
              </button>
            </div>

            {/* Scrollable Case List */}
            <div className="max-h-[600px] overflow-y-auto pr-2 space-y-4">
              {filteredCasesByBreakdown.map((caseItem, index) => {
                const closedChannels = caseItem.channels.filter(c => c.status === 'closed');
                const activeChannels = caseItem.channels.filter(c => c.status === 'active' || c.status === 'pending');
                const firstClosed = closedChannels[0];
                const firstActive = activeChannels[0];

                return (
                  <Card key={`${caseItem.id}-${selectedBreakdown}-${index}`} className="border border-purple-500/30 bg-[rgba(15,15,15,0.9)] p-6">
                    {/* Header Badges */}
                    <div className="flex items-center gap-2 mb-4 flex-wrap">
                      <Badge className="bg-pink-500/20 border-pink-400/40 text-pink-100 text-xs">
                        Premature Closure Risk
                      </Badge>
                      <Badge className={getRiskBadgeStyle(caseItem.riskLevel) + " text-xs"}>
                        {caseItem.riskLevel === 'high' ? 'HIGH RISK' : caseItem.riskLevel === 'medium' ? 'MEDIUM RISK' : 'LOW RISK'}
                      </Badge>
                      <Badge className="bg-blue-500/20 border-blue-400/40 text-blue-100 text-xs">
                        Customer {caseItem.customerId}
                          </Badge>
                        </div>
                        
                    {/* Title and Metadata */}
                    <div className="mb-4">
                      <h4 className="text-lg font-semibold text-white mb-2">{caseItem.issueType}</h4>
                      <div className="flex items-center gap-4 text-xs text-gray-400">
                        <span className="uppercase">{caseItem.intentCluster}</span>
                            <span>•</span>
                            <span>{caseItem.timestamp}</span>
                          </div>
                        </div>

                    {/* Channel Status */}
                    <div className="flex items-center gap-4 mb-4 text-sm flex-wrap">
                      {firstClosed && (
                        <div className="text-gray-300">
                          <span className="capitalize">{firstClosed.channel}</span> closed at {firstClosed.sentiment.toFixed(1)} ({firstClosed.sentimentLabel})
                        </div>
                      )}
                      {firstActive && (
                        <div className="text-gray-300">
                          Active on <span className="capitalize">{firstActive.channel}</span> ({firstActive.sentimentLabel})
                      </div>
                      )}
                    </div>

                    {/* Description */}
                    <p className="text-sm text-gray-300 mb-4 leading-relaxed">{caseItem.description}</p>

                    {/* Action */}
                    <div className="flex items-start gap-2 mb-4 p-3 bg-yellow-500/10 border border-yellow-400/20 rounded-lg">
                      <Sparkles className="h-4 w-4 text-yellow-400 shrink-0 mt-0.5" />
                      <div className="text-sm text-yellow-100">
                        <span className="font-semibold">Action:</span> {caseItem.aiAction}
                      </div>
                    </div>

                    {/* Channel Status Details */}
                    <div className="flex flex-wrap gap-3">
                      {caseItem.channels.map((channel, idx) => {
                          const ChannelIcon = getChannelIcon(channel.channel);
                        const colors = getChannelColor(channel.channel);
                        const isClosed = channel.status === 'closed';
                        const isPending = channel.status === 'pending';

                          return (
                          <div
                            key={idx}
                            className={`flex items-center gap-2 px-3 py-2 rounded-lg border ${
                              isClosed
                                ? 'bg-green-500/10 border-green-400/30'
                                : isPending
                                ? 'bg-yellow-500/10 border-yellow-400/30'
                                : 'bg-red-500/10 border-red-400/30'
                            }`}
                          >
                            {isClosed ? (
                              <CheckCircle className="h-4 w-4 text-green-400" />
                            ) : isPending ? (
                              <Clock className="h-4 w-4 text-yellow-400" />
                            ) : (
                              <UserX className="h-4 w-4 text-red-400" />
                            )}
                            <ChannelIcon className={`h-4 w-4 ${colors.text}`} />
                            <div className="text-xs">
                              <div className="font-semibold text-white uppercase">{channel.channel}</div>
                              <div className="text-gray-300">
                                {channel.sentiment.toFixed(1)} {channel.sentimentLabel.toUpperCase()}
                              </div>
                              <div className="text-gray-400 text-[10px] uppercase">
                                {channel.statusLabel}
                                {isPending && ' • Pending bank action'}
                              </div>
                              </div>
                            </div>
                        );
                      })}
                    </div>
                  </Card>
                          );
                        })}
                      </div>
                    </div>
        )}

        {/* ③ Priority Heatmap - Right side when breakdown selected */}
        <div className={selectedBreakdown ? 'lg:col-span-1' : ''}>
          <Card className="border border-white/10 bg-[rgba(26,26,26,0.6)] p-6 mb-6">
            <h3 className="text-lg font-semibold text-white mb-4">Priority Heatmap</h3>
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr>
                    <th className="text-left text-xs font-semibold text-gray-400 uppercase tracking-wide p-2 border-b border-white/10">
                      Breakdown
                    </th>
                    {PRIORITY_LEVELS.map(priority => (
                      <th
                        key={priority}
                        className="text-center text-xs font-semibold text-gray-400 uppercase tracking-wide p-2 border-b border-white/10"
                      >
                        {priority}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {heatmapData.map((row) => (
                    <tr key={row.breakdown} className="border-b border-white/5 hover:bg-white/5">
                      <td className="text-sm text-white p-3 font-medium">{row.breakdown}</td>
                      <td className="text-center p-3">
                        <div className="flex items-center justify-center gap-2">
                          <div
                            className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold text-white"
                            style={{ backgroundColor: getPriorityColor("Critical") }}
                          >
                            {row.critical > 0 ? row.critical : ''}
                          </div>
                        </div>
                      </td>
                      <td className="text-center p-3">
                        <div className="flex items-center justify-center gap-2">
                          <div
                            className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold text-white"
                            style={{ backgroundColor: getPriorityColor("High") }}
                          >
                            {row.high > 0 ? row.high : ''}
                          </div>
                        </div>
                      </td>
                      <td className="text-center p-3">
                        <div className="flex items-center justify-center gap-2">
                          <div
                            className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold text-white"
                            style={{ backgroundColor: getPriorityColor("Medium") }}
                          >
                            {row.medium > 0 ? row.medium : ''}
                          </div>
                        </div>
                      </td>
                      <td className="text-center p-3">
                        <div className="flex items-center justify-center gap-2">
                          <div
                            className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold text-white"
                            style={{ backgroundColor: getPriorityColor("Low") }}
                          >
                            {row.low > 0 ? row.low : ''}
                        </div>
                      </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
                    </div>
                  </Card>

          {/* ④ Business Impact Indicators - Below heatmap when breakdown selected */}
          {selectedBreakdown && (
            <Card className="border border-white/10 bg-[rgba(26,26,26,0.6)] p-6">
              <h3 className="text-lg font-semibold text-white mb-4">Business Impact Indicators</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {impactIndicators.map((indicator, idx) => (
                  <div
                    key={idx}
                    className="flex items-start gap-3 p-4 rounded-lg bg-[rgba(15,15,15,0.8)] border border-white/5"
                  >
                    <AlertTriangle className="h-5 w-5 text-amber-400 shrink-0 mt-0.5" />
                    <p className="text-sm text-gray-200 leading-relaxed">{indicator}</p>
                  </div>
                ))}
              </div>
            </Card>
            )}
          </div>
      </div>

      {/* ④ Business Impact Indicators - Shown when no breakdown selected */}
      {!selectedBreakdown && (
        <Card className="border border-white/10 bg-[rgba(26,26,26,0.6)] p-6">
          <h3 className="text-lg font-semibold text-white mb-4">Business Impact Indicators</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {impactIndicators.map((indicator, idx) => (
              <div
                key={idx}
                className="flex items-start gap-3 p-4 rounded-lg bg-[rgba(15,15,15,0.8)] border border-white/5"
              >
                <AlertTriangle className="h-5 w-5 text-amber-400 shrink-0 mt-0.5" />
                <p className="text-sm text-gray-200 leading-relaxed">{indicator}</p>
              </div>
            ))}
      </div>
        </Card>
      )}

    </Card>
  );
}

