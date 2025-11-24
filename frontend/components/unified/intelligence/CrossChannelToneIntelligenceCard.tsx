"use client";

import { useState, useEffect, useRef, useMemo } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Mail, MessageSquare, Ticket, Phone, AlertCircle, TrendingUp, ArrowRight, Filter, X, Sparkles, Lightbulb } from "lucide-react";
import { generateCustomerJourneys, type CustomerJourney } from "@/lib/unified/escalationData";
import { AreaChart, Area, XAxis, YAxis, ResponsiveContainer, Tooltip } from "recharts";

interface ChannelEscalation {
  channel: "email" | "ticket" | "chat" | "voice";
  count: number;
  escalated: number;
  color: string;
  icon: typeof Mail;
}

interface SankeyLink {
  source: string;
  target: string;
  value: number;
  severity: "high" | "medium" | "low";
  customerIds: string[];
  percentage?: number;
  avgSentiment?: number;
  avgTimeToEscalate?: string;
  avgSteps?: number;
  topIssues?: string[];
  pathStrength?: "primary" | "secondary" | "rare";
}

interface OriginChannelData {
  channel: "email" | "ticket" | "chat" | "voice";
  totalOrigins: number;
  escalationRate: number;
  avgSentimentStart: number;
  avgSentimentEnd: number;
  avgResolutionTime: string;
  topIssues: string[];
  escalationPaths: Array<{
    fromChannel: string;
    toChannel: string;
    customerCount: number;
    percentage: number;
    avgSentiment: number;
    avgTimeToEscalate: string;
    avgSteps: number;
    pathStrength: "primary" | "secondary" | "rare";
    topIssues: string[];
    customerIds: string[];
  }>;
}

interface IntermediateNode {
  channel: string;
  position: number; // 0-1 along the path
  escalated: boolean;
  sentimentScore: number;
  customerIds: string[];
}

interface ChannelMetrics {
  channel: "email" | "ticket" | "chat" | "voice";
  originCount: number;
  escalationCount: number;
  throughputRate: number;
  topPaths: Array<{ target: string; count: number; escalated: boolean }>;
  avgStepsToEscalation: number;
  avgResolutionTime: number; // in hours
  trend: "up" | "down" | "stable";
  trendValue: number;
}

const CHANNEL_CONFIG: Record<string, ChannelEscalation> = {
  email: {
    channel: "email",
    count: 0,
    escalated: 0,
    color: "bg-blue-500",
    icon: Mail,
  },
  ticket: {
    channel: "ticket",
    count: 0,
    escalated: 0,
    color: "bg-purple-500",
    icon: Ticket,
  },
  chat: {
    channel: "chat",
    count: 0,
    escalated: 0,
    color: "bg-green-500",
    icon: MessageSquare,
  },
  voice: {
    channel: "voice",
    count: 0,
    escalated: 0,
    color: "bg-red-500",
    icon: Phone,
  },
};

const CHANNELS: ("email" | "ticket" | "chat" | "voice")[] = ["email", "ticket", "chat", "voice"];

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
    default:
      return Mail;
  }
};

const getSeverityColor = (severity: "high" | "medium" | "low") => {
  switch (severity) {
    case "high":
      return "#ef4444"; // red
    case "medium":
      return "#f59e0b"; // amber
    case "low":
      return "#10b981"; // emerald
  }
};

// Get sentiment color for tooltip (1-5 scale)
const getSentimentColor = (score: number) => {
  if (score <= 2) return "text-emerald-400"; // Green (calm)
  if (score === 3) return "text-amber-400"; // Yellow/Orange (concerned)
  return "text-red-400"; // Red (frustrated)
};

// Get sentiment background color
const getSentimentBgColor = (score: number) => {
  if (score <= 2) return "bg-emerald-500/20 border-emerald-400/40";
  if (score === 3) return "bg-amber-500/20 border-amber-400/40";
  return "bg-red-500/20 border-red-400/40";
};

// Get sentiment label
const getSentimentLabel = (score: number) => {
  if (score <= 2) return "Calm";
  if (score === 3) return "Concerned";
  return "Frustrated";
};

export function CrossChannelToneIntelligenceCard() {
  const [customerJourneys, setCustomerJourneys] = useState<CustomerJourney[]>([]);
  const [sankeyLinks, setSankeyLinks] = useState<SankeyLink[]>([]);
  const [channelMetrics, setChannelMetrics] = useState<ChannelMetrics[]>([]);
  const [selectedChannel, setSelectedChannel] = useState<string | null>(null); // Default: show all channels
  const [hoveredEscalationChannel, setHoveredEscalationChannel] = useState<string | null>(null);
  const [hoveredCustomerId, setHoveredCustomerId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<Record<string, "action" | "summary">>({});
  const [hoveredNode, setHoveredNode] = useState<{ journeyId: string; stepIdx: number; x: number; y: number } | null>(null);
  const [originChannelData, setOriginChannelData] = useState<Map<string, OriginChannelData>>(new Map());
  const [animationStage, setAnimationStage] = useState<number>(5); // Start at 5 (fully animated)
  const [selectedHeatmapCell, setSelectedHeatmapCell] = useState<{ origin: string; escalation: string } | null>(null);
  const sankeyRef = useRef<HTMLDivElement>(null);
  
  // Animation sequence when channel is selected - make it instant for visibility
  useEffect(() => {
    if (selectedChannel) {
      // Set to fully animated immediately for visibility
      setAnimationStage(5);
      // Optional: could add smooth animation later, but for now make everything visible
    } else {
      setAnimationStage(5); // Reset when no selection
    }
  }, [selectedChannel]);

  useEffect(() => {
    const journeys = generateCustomerJourneys();
    setCustomerJourneys(journeys);

    // Build Sankey links - show ONLY origin → final escalation (not intermediate steps)
    const linkMap = new Map<string, SankeyLink>();
    
    journeys.forEach((journey) => {
      // Only create link from origin to final escalation channel
      const from = journey.originChannel;
      const to = journey.finalChannel; // Final channel is always escalated
      const key = `${from}-${to}`;
      
      if (!linkMap.has(key)) {
        linkMap.set(key, {
          source: from,
          target: to,
          value: 0,
          severity: journey.severity,
          customerIds: [],
          avgSentiment: 0,
          avgSteps: 0,
          topIssues: [],
        });
      }
      
      const link = linkMap.get(key)!;
      link.value++;
      if (!link.customerIds.includes(journey.customerId)) {
        link.customerIds.push(journey.customerId);
      }
      // Use highest severity
      if (journey.severity === "high" || (journey.severity === "medium" && link.severity === "low")) {
        link.severity = journey.severity;
      }
    });

    // Calculate path statistics for each link
    const enhancedLinks = Array.from(linkMap.values()).map((link) => {
      const linkJourneys = journeys.filter(
        (j) => j.originChannel === link.source && j.finalChannel === link.target
      );
      
      const totalOrigins = journeys.filter((j) => j.originChannel === link.source).length;
      const percentage = totalOrigins > 0 ? (link.value / totalOrigins) * 100 : 0;
      
      // Calculate average sentiment (from final step)
      const avgSentiment = linkJourneys.length > 0
        ? linkJourneys.reduce((sum, j) => {
            const finalStep = j.journey[j.journey.length - 1];
            return sum + finalStep.sentimentScore;
          }, 0) / linkJourneys.length
        : 0;
      
      // Calculate average steps
      const avgSteps = linkJourneys.length > 0
        ? linkJourneys.reduce((sum, j) => sum + j.journey.length, 0) / linkJourneys.length
        : 0;
      
      // Calculate average time to escalate
      const avgTimeToEscalate = linkJourneys.length > 0
        ? linkJourneys.reduce((sum, j) => {
            const start = new Date(j.journey[0].timestamp);
            const end = new Date(j.journey[j.journey.length - 1].timestamp);
            return sum + (end.getTime() - start.getTime()) / (1000 * 60 * 60);
          }, 0) / linkJourneys.length
        : 0;
      
      // Get top issues
      const allIssues = linkJourneys.flatMap((j) => 
        j.journey[j.journey.length - 1].subtopics || []
      );
      const issueCounts = new Map<string, number>();
      allIssues.forEach((issue) => {
        issueCounts.set(issue, (issueCounts.get(issue) || 0) + 1);
      });
      const topIssues = Array.from(issueCounts.entries())
        .sort((a, b) => b[1] - a[1])
        .slice(0, 3)
        .map(([issue]) => issue);
      
      // Determine path strength
      let pathStrength: "primary" | "secondary" | "rare" = "rare";
      if (percentage >= 50) pathStrength = "primary";
      else if (percentage >= 10) pathStrength = "secondary";
      
      return {
        ...link,
        percentage: Math.round(percentage * 10) / 10,
        avgSentiment: Math.round(avgSentiment * 10) / 10,
        avgSteps: Math.round(avgSteps * 10) / 10,
        avgTimeToEscalate: `${Math.round(avgTimeToEscalate * 10) / 10}h`,
        topIssues,
        pathStrength,
      };
    });

    setSankeyLinks(enhancedLinks);

    // Calculate channel metrics
    const metrics: ChannelMetrics[] = CHANNELS.map((channel) => {
      const originCustomers = journeys.filter((j) => j.originChannel === channel);
      const escalationCustomers = journeys.filter((j) => j.finalChannel === channel && j.totalEscalations > 0);
      
      // Top paths from this channel
      const pathMap = new Map<string, { count: number; escalated: boolean }>();
      originCustomers.forEach((journey) => {
        journey.journey.forEach((step, idx) => {
          if (idx > 0) {
            const prevStep = journey.journey[idx - 1];
            if (prevStep.channel === channel) {
              const key = step.channel;
              if (!pathMap.has(key)) {
                pathMap.set(key, { count: 0, escalated: false });
              }
              const path = pathMap.get(key)!;
              path.count++;
              if (step.escalated) path.escalated = true;
            }
          }
        });
      });

      const topPaths = Array.from(pathMap.entries())
        .map(([target, data]) => ({ target, ...data }))
        .sort((a, b) => b.count - a.count)
        .slice(0, 3);

      // Calculate averages
      const escalatedJourneys = originCustomers.filter((j) => j.totalEscalations > 0);
      const avgSteps = escalatedJourneys.length > 0
        ? escalatedJourneys.reduce((sum, j) => sum + j.journey.length, 0) / escalatedJourneys.length
        : 0;

      const avgResolutionTime = originCustomers.length > 0
        ? originCustomers.reduce((sum, j) => {
            const start = new Date(j.journey[0].timestamp);
            const end = new Date(j.journey[j.journey.length - 1].timestamp);
            return sum + (end.getTime() - start.getTime()) / (1000 * 60 * 60);
          }, 0) / originCustomers.length
        : 0;

      const throughputRate = originCustomers.length > 0
        ? ((originCustomers.length - escalationCustomers.length) / originCustomers.length) * 100
        : 0;

      return {
        channel,
        originCount: originCustomers.length,
        escalationCount: escalationCustomers.length,
        throughputRate,
        topPaths,
        avgStepsToEscalation: avgSteps,
        avgResolutionTime,
        trend: Math.random() > 0.5 ? "up" : "down",
        trendValue: Math.random() * 10 + 5,
      };
    });

    setChannelMetrics(metrics);

    // Calculate origin channel data for statistics overlay
    const originDataMap = new Map<string, OriginChannelData>();
    CHANNELS.forEach((channel) => {
      const originCustomers = journeys.filter((j) => j.originChannel === channel);
      const totalOrigins = originCustomers.length;
      const escalatedCustomers = originCustomers.filter((j) => j.totalEscalations > 0);
      const escalationRate = totalOrigins > 0 ? (escalatedCustomers.length / totalOrigins) * 100 : 0;
      
      // Calculate average sentiment progression
      const avgSentimentStart = totalOrigins > 0
        ? originCustomers.reduce((sum, j) => sum + j.journey[0].sentimentScore, 0) / totalOrigins
        : 0;
      const avgSentimentEnd = escalatedCustomers.length > 0
        ? escalatedCustomers.reduce((sum, j) => {
            const finalStep = j.journey[j.journey.length - 1];
            return sum + finalStep.sentimentScore;
          }, 0) / escalatedCustomers.length
        : 0;
      
      // Calculate average resolution time
      const avgResolutionTime = totalOrigins > 0
        ? originCustomers.reduce((sum, j) => {
            const start = new Date(j.journey[0].timestamp);
            const end = new Date(j.journey[j.journey.length - 1].timestamp);
            return sum + (end.getTime() - start.getTime()) / (1000 * 60 * 60);
          }, 0) / totalOrigins
        : 0;
      
      // Get top issues
      const allIssues = originCustomers.flatMap((j) => 
        j.journey[0].subtopics || []
      );
      const issueCounts = new Map<string, number>();
      allIssues.forEach((issue) => {
        issueCounts.set(issue, (issueCounts.get(issue) || 0) + 1);
      });
      const topIssues = Array.from(issueCounts.entries())
        .sort((a, b) => b[1] - a[1])
        .slice(0, 3)
        .map(([issue]) => issue);
      
      // Calculate escalation paths
      const pathMap = new Map<string, {
        fromChannel: string;
        toChannel: string;
        customerIds: string[];
        sentiments: number[];
        times: number[];
        steps: number[];
        issues: string[];
      }>();
      
      originCustomers.forEach((journey) => {
        const to = journey.finalChannel;
        const key = `${channel}-${to}`;
        if (!pathMap.has(key)) {
          pathMap.set(key, {
            fromChannel: channel,
            toChannel: to,
            customerIds: [],
            sentiments: [],
            times: [],
            steps: [],
            issues: [],
          });
        }
        const path = pathMap.get(key)!;
        path.customerIds.push(journey.customerId);
        const finalStep = journey.journey[journey.journey.length - 1];
        path.sentiments.push(finalStep.sentimentScore);
        path.issues.push(...(finalStep.subtopics || []));
        path.steps.push(journey.journey.length);
        const start = new Date(journey.journey[0].timestamp);
        const end = new Date(finalStep.timestamp);
        path.times.push((end.getTime() - start.getTime()) / (1000 * 60 * 60));
      });
      
      const escalationPaths = Array.from(pathMap.values()).map((path) => {
        const percentage = totalOrigins > 0 ? (path.customerIds.length / totalOrigins) * 100 : 0;
        const avgSentiment = path.sentiments.length > 0
          ? path.sentiments.reduce((sum, s) => sum + s, 0) / path.sentiments.length
          : 0;
        const avgSteps = path.steps.length > 0
          ? path.steps.reduce((sum, s) => sum + s, 0) / path.steps.length
          : 0;
        const avgTimeToEscalate = path.times.length > 0
          ? path.times.reduce((sum, t) => sum + t, 0) / path.times.length
          : 0;
        
        // Determine path strength
        let pathStrength: "primary" | "secondary" | "rare" = "rare";
        if (percentage >= 50) pathStrength = "primary";
        else if (percentage >= 10) pathStrength = "secondary";
        
        // Get top issues for this path
        const pathIssueCounts = new Map<string, number>();
        path.issues.forEach((issue) => {
          pathIssueCounts.set(issue, (pathIssueCounts.get(issue) || 0) + 1);
        });
        const topPathIssues = Array.from(pathIssueCounts.entries())
          .sort((a, b) => b[1] - a[1])
          .slice(0, 3)
          .map(([issue]) => issue);
        
        return {
          fromChannel: path.fromChannel,
          toChannel: path.toChannel,
          customerCount: path.customerIds.length,
          percentage: Math.round(percentage * 10) / 10,
          avgSentiment: Math.round(avgSentiment * 10) / 10,
          avgTimeToEscalate: `${Math.round(avgTimeToEscalate * 10) / 10}h`,
          avgSteps: Math.round(avgSteps * 10) / 10,
          pathStrength,
          topIssues: topPathIssues,
          customerIds: path.customerIds,
        };
      }).sort((a, b) => b.customerCount - a.customerCount);
      
      originDataMap.set(channel, {
        channel,
        totalOrigins,
        escalationRate: Math.round(escalationRate * 10) / 10,
        avgSentimentStart: Math.round(avgSentimentStart * 10) / 10,
        avgSentimentEnd: Math.round(avgSentimentEnd * 10) / 10,
        avgResolutionTime: `${Math.round(avgResolutionTime * 10) / 10}h`,
        topIssues,
        escalationPaths,
      });
    });
    
    setOriginChannelData(originDataMap);
  }, []);
  
  // Get links to show - if channel selected, only show flows FROM that channel
  const linksToShow = selectedChannel
    ? sankeyLinks.filter((link) => link.source === selectedChannel)
    : sankeyLinks;

  // Calculate intermediate nodes position along the curved path
  const calculateIntermediateNodePosition = (
    sourceX: number, targetX: number, sourceY: number, targetY: number,
    progress: number, // 0 to 1, where to place the node along the path
    verticalOffset: number = 0 // Stagger offset for multiple paths
  ) => {
    const controlPoint1X = sourceX + (targetX - sourceX) * 0.3;
    const controlPoint2X = sourceX + (targetX - sourceX) * 0.7;
    
    // Adjust Y positions with stagger
    const adjustedSourceY = sourceY + verticalOffset;
    const adjustedTargetY = targetY + verticalOffset;
    
    // Use cubic bezier to calculate position at progress (matches the path calculation)
    const t = progress;
    const mt = 1 - t;
    
    // Control points for Y coordinate (smooth curve)
    const controlPoint1Y = adjustedSourceY + (adjustedTargetY - adjustedSourceY) * 0.3;
    const controlPoint2Y = adjustedSourceY + (adjustedTargetY - adjustedSourceY) * 0.7;
    
    // Cubic bezier calculation
    const x = mt * mt * mt * sourceX + 3 * mt * mt * t * controlPoint1X + 3 * mt * t * t * controlPoint2X + t * t * t * targetX;
    const y = mt * mt * mt * adjustedSourceY + 3 * mt * mt * t * controlPoint1Y + 3 * mt * t * t * controlPoint2Y + t * t * t * adjustedTargetY;
    
    return { x, y };
  };

  const getNodePositions = () => {
    const nodeHeight = 70;
    const spacing = 25;
    const positions: Record<string, { y: number; height: number }> = {};
    let currentY = 60;

    // Always show all channels
    CHANNELS.forEach((channel) => {
      const linksFrom = linksToShow.filter((l) => l.source === channel);
      const linksTo = linksToShow.filter((l) => l.target === channel);
      // For unselected channels, also consider all links for sizing
      const allLinksFrom = sankeyLinks.filter((l) => l.source === channel);
      const allLinksTo = sankeyLinks.filter((l) => l.target === channel);
      
      const visibleValue = Math.max(
        linksFrom.reduce((sum, l) => sum + l.value, 0),
        linksTo.reduce((sum, l) => sum + l.value, 0)
      );
      const allValue = Math.max(
        allLinksFrom.reduce((sum, l) => sum + l.value, 0),
        allLinksTo.reduce((sum, l) => sum + l.value, 0)
      );
      // Use visible value for selected, all value for others to maintain consistent sizing
      const totalValue = selectedChannel && channel === selectedChannel ? visibleValue : allValue;
      const height = Math.max(nodeHeight, totalValue * 10 + 30);
      
      positions[channel] = { y: currentY, height };
      currentY += height + spacing;
    });

    return positions;
  };

  const nodePositions = getNodePositions();

  // Calculate all adjusted node positions globally to prevent overlaps
  const adjustedNodePositions = useMemo(() => {
    const sourceX = 170;
    const targetX = 650;
    const nodeRadius = 35;
    const minSpacing = nodeRadius * 3.5; // Increased spacing for better visibility
    
    type NodeWithPosition = {
      linkIdx: number;
      nodeKey: string; // channel + position for matching
      node: IntermediateNode;
      basePos: { x: number; y: number };
      adjustedY?: number;
    };
    
    const allNodes: NodeWithPosition[] = [];
    
    // Collect all nodes from all links
    linksToShow.forEach((link, idx) => {
      const sourcePos = nodePositions[link.source];
      const targetPos = nodePositions[link.target];
      if (!sourcePos || !targetPos) return;

      const sourceY = sourcePos.y + sourcePos.height / 2;
      const targetY = targetPos.y + targetPos.height / 2;
      const verticalOffset = idx * 8;
      
      const linkJourneys = selectedChannel 
        ? customerJourneys.filter(
            (j) => j.originChannel === link.source && j.finalChannel === link.target && j.originChannel === selectedChannel
          )
        : customerJourneys.filter(
            (j) => j.originChannel === link.source && j.finalChannel === link.target
          );
      
      // Track nodes by their unique position in the journey (channel + step position)
      const intermediateMap = new Map<string, IntermediateNode>();
      linkJourneys.forEach((journey) => {
        for (let i = 1; i < journey.journey.length - 1; i++) {
          const step = journey.journey[i];
          // Use channel + step index as key to handle same channel at different positions
          const stepProgress = i / (journey.journey.length - 1);
          const key = `${step.channel}-${stepProgress.toFixed(2)}`;
          
          if (!intermediateMap.has(key)) {
            intermediateMap.set(key, {
              channel: step.channel,
              position: stepProgress, // Actual position in journey (0-1)
              escalated: false,
              sentimentScore: step.sentimentScore,
              customerIds: [],
            });
          }
          const node = intermediateMap.get(key)!;
          if (!node.customerIds.includes(journey.customerId)) {
            node.customerIds.push(journey.customerId);
          }
          if (step.escalated) node.escalated = true;
          node.sentimentScore = (node.sentimentScore + step.sentimentScore) / 2;
        }
      });
      
      Array.from(intermediateMap.values()).forEach((node) => {
        const basePos = calculateIntermediateNodePosition(
          sourceX, targetX, sourceY, targetY, node.position, verticalOffset
        );
        allNodes.push({
          linkIdx: idx,
          nodeKey: `${link.source}-${link.target}-${node.channel}-${node.position.toFixed(2)}`,
          node,
          basePos,
        });
      });
    });
    
    // Sort by X position, then Y position
    allNodes.sort((a, b) => {
      const xDiff = a.basePos.x - b.basePos.x;
      if (Math.abs(xDiff) < 50) {
        return a.basePos.y - b.basePos.y;
      }
      return xDiff;
    });
    
    // Adjust Y positions globally to prevent overlaps
    allNodes.forEach((nodeData, nodeIdx) => {
      let adjustedY = nodeData.basePos.y;
      let attempts = 0;
      const maxAttempts = 20; // Prevent infinite loops
      
      // Keep adjusting until no overlaps found
      while (attempts < maxAttempts) {
        let hasOverlap = false;
        
        for (let prevIdx = 0; prevIdx < nodeIdx; prevIdx++) {
          const prevNode = allNodes[prevIdx];
          const prevY = prevNode.adjustedY !== undefined ? prevNode.adjustedY : prevNode.basePos.y;
          
          // Check if nodes overlap (considering both X and Y)
          const xDistance = Math.abs(nodeData.basePos.x - prevNode.basePos.x);
          const yDistance = Math.abs(adjustedY - prevY);
          
          // If nodes are close horizontally (within 150px) and vertically (less than minSpacing), adjust
          if (xDistance < 150 && yDistance < minSpacing) {
            hasOverlap = true;
            // Determine direction - prefer moving down if possible, otherwise up
            const direction = adjustedY >= prevY ? 1 : -1;
            adjustedY = prevY + (direction * minSpacing);
            break; // Restart check after adjustment
          }
        }
        
        if (!hasOverlap) break;
        attempts++;
      }
      
      nodeData.adjustedY = adjustedY;
    });
    
    // Create a map for quick lookup: linkIdx -> nodeKey -> adjusted position
    const positionMap = new Map<number, Map<string, { x: number; y: number }>>();
    allNodes.forEach((nodeData) => {
      if (!positionMap.has(nodeData.linkIdx)) {
        positionMap.set(nodeData.linkIdx, new Map());
      }
      positionMap.get(nodeData.linkIdx)!.set(nodeData.nodeKey, {
        x: nodeData.basePos.x,
        y: nodeData.adjustedY!,
      });
    });
    
    return positionMap;
  }, [linksToShow, customerJourneys, selectedChannel, nodePositions]);

  // Calculate path for a single customer journey (thin line for one customer)
  const calculateCustomerPath = (sourceY: number, targetY: number, index: number = 0) => {
    const sourceX = 170; // Right edge of origin boxes (50 + 120)
    const targetX = 650; // Left edge of escalation boxes
    
    // Stagger control points to avoid overlaps - add vertical offset based on index
    const verticalOffset = index * 3; // 3px offset per customer for thin lines
    const controlPoint1X = sourceX + (targetX - sourceX) * 0.3;
    const controlPoint2X = sourceX + (targetX - sourceX) * 0.7;
    
    // Adjust Y positions with stagger
    const adjustedSourceY = sourceY + verticalOffset;
    const adjustedTargetY = targetY + verticalOffset;

    // Thin line for single customer (2px height)
    const lineHeight = 2;
    const topSourceY = adjustedSourceY - lineHeight / 2;
    const bottomSourceY = adjustedSourceY + lineHeight / 2;
    const topTargetY = adjustedTargetY - lineHeight / 2;
    const bottomTargetY = adjustedTargetY + lineHeight / 2;

    return `M ${sourceX} ${topSourceY} 
            C ${controlPoint1X} ${topSourceY}, ${controlPoint2X} ${topTargetY}, ${targetX} ${topTargetY}
            L ${targetX} ${bottomTargetY}
            C ${controlPoint2X} ${bottomTargetY}, ${controlPoint1X} ${bottomSourceY}, ${sourceX} ${bottomSourceY}
            Z`;
  };

  // Get origin channels that escalate to a specific channel (matching Sankey diagram: origin → final escalation)
  const getOriginChannelsForEscalation = (targetChannel: string) => {
    const originMap = new Map<string, number>();
    
    customerJourneys.forEach((journey) => {
      // Check if final escalation channel matches target (matching Sankey: origin → final escalation)
      if (journey.finalChannel === targetChannel) {
        const origin = journey.originChannel;
        // Exclude the target channel itself from the origins list
        if (origin !== targetChannel) {
          originMap.set(origin, (originMap.get(origin) || 0) + 1);
        }
      }
    });
    
    return Array.from(originMap.entries())
      .map(([channel, count]) => ({ channel, count }))
      .sort((a, b) => b.count - a.count);
  };

  // Get total count of escalations to a specific channel (matching Sankey diagram: origin → final escalation)
  const getTotalEscalationsToChannel = (targetChannel: string) => {
    return customerJourneys.filter((journey) => {
      // Count journeys where final escalation channel matches target
      return journey.finalChannel === targetChannel;
    }).length;
  };


    return (
    <Card className="border border-[color:var(--border)] bg-[color:var(--card)] p-6 shadow-lg">
      <div className="mb-6">
        <div className="flex items-center justify-between mb-2">
          <h2 className="text-2xl font-bold text-white">Cross channel Escalation</h2>
        </div>
        <p className="text-sm text-gray-400">Customer escalation flow visualization</p>
      </div>

      {/* Heatmap */}
      <div className="mb-6">
        <div className={`grid ${selectedHeatmapCell ? "grid-cols-1 lg:grid-cols-3" : "grid-cols-1"} gap-4`}>
          {/* Heatmap - Left Side */}
          <div className={selectedHeatmapCell ? "lg:col-span-2" : ""}>
            <Card className="border border-white/10 bg-[rgba(26,26,26,0.6)] p-6">
              {(() => {
                // Calculate heatmap data: origin channel -> escalation channel -> count & customer IDs
                const heatmapData = new Map<string, Map<string, { count: number; customerIds: string[] }>>();
                
                CHANNELS.forEach(origin => {
                  heatmapData.set(origin, new Map());
                  CHANNELS.forEach(escalation => {
                    const matchingJourneys = customerJourneys.filter(
                      j => j.originChannel === origin && j.finalChannel === escalation
                    );
                    heatmapData.get(origin)!.set(escalation, {
                      count: matchingJourneys.length,
                      customerIds: matchingJourneys.map(j => j.customerId)
                    });
                  });
                });

                // Find max count for color intensity
                let maxCount = 0;
                heatmapData.forEach(originMap => {
                  originMap.forEach(cell => {
                    if (cell.count > maxCount) maxCount = cell.count;
                  });
                });

                // Function to get gradient color from green (low) to orange (medium) to red (high)
                const getGradientColor = (count: number, max: number): { bg: string; border: string } => {
                  if (count === 0) {
                    return {
                      bg: "rgba(17, 24, 39, 0.5)", // dark gray
                      border: "rgba(31, 41, 55, 0.5)"
                    };
                  }
                  
                  // Normalize count to 0-1 range
                  const normalized = Math.min(count / max, 1);
                  
                  let r, g, b;
                  
                  if (normalized <= 0.5) {
                    // Green to Orange/Yellow transition (0 to 0.5)
                    const ratio = normalized / 0.5; // 0 to 1
                    // Green: rgb(34, 197, 94) to Yellow: rgb(251, 191, 36)
                    r = Math.round(34 + (251 - 34) * ratio);
                    g = Math.round(197 + (191 - 197) * ratio);
                    b = Math.round(94 + (36 - 94) * ratio);
                  } else {
                    // Orange/Yellow to Red transition (0.5 to 1.0)
                    const ratio = (normalized - 0.5) / 0.5; // 0 to 1
                    // Yellow: rgb(251, 191, 36) to Red: rgb(239, 68, 68)
                    r = Math.round(251 + (239 - 251) * ratio);
                    g = Math.round(191 + (68 - 191) * ratio);
                    b = Math.round(36 + (68 - 36) * ratio);
                  }
                  
                  return {
                    bg: `rgba(${r}, ${g}, ${b}, 0.7)`,
                    border: `rgba(${r}, ${g}, ${b}, 0.5)`
                  };
                };

                return (
                  <div className="overflow-x-auto">
                    <table className="w-full border-collapse">
                      <thead>
                        <tr>
                          <th className="p-3 text-left text-sm font-semibold text-gray-300 border-b border-white/10">Origin Channels</th>
                          {CHANNELS.map(escalation => {
                            const colors = getChannelColor(escalation);
                            const Icon = getChannelIcon(escalation);
                            return (
                              <th key={escalation} className="p-3 text-center text-sm font-semibold text-gray-300 border-b border-white/10">
                                <div className="flex flex-col items-center gap-1">
                                  <Icon className={`h-5 w-5 ${colors.text}`} />
                                  <span className="capitalize text-xs">{escalation}</span>
                                </div>
                              </th>
                            );
                          })}
                        </tr>
                      </thead>
                      <tbody>
                        {CHANNELS.map(origin => {
                          const originColors = getChannelColor(origin);
                          const OriginIcon = getChannelIcon(origin);
                          return (
                            <tr key={origin}>
                              <td className="p-3 border-r border-white/10">
                                <div className="flex items-center gap-2">
                                  <OriginIcon className={`h-5 w-5 ${originColors.text}`} />
                                  <span className="capitalize text-sm font-medium text-gray-200">{origin}</span>
                                </div>
                              </td>
                              {CHANNELS.map(escalation => {
                                const cellData = heatmapData.get(origin)?.get(escalation);
                                const count = cellData?.count || 0;
                                const isSelected = selectedHeatmapCell?.origin === origin && selectedHeatmapCell?.escalation === escalation;
                                const gradientColors = getGradientColor(count, maxCount || 1);
                                
                                return (
                                  <td
                                    key={`${origin}-${escalation}`}
                                    className={`p-4 text-center border cursor-pointer transition-all ${
                                      isSelected ? "ring-2 ring-yellow-400/50" : ""
                                    }`}
                                    style={{
                                      backgroundColor: isSelected ? "rgba(251, 191, 36, 0.3)" : gradientColors.bg,
                                      borderColor: isSelected ? "rgba(251, 191, 36, 0.5)" : gradientColors.border,
                                      borderWidth: "1px"
                                    }}
                                    onMouseEnter={(e) => {
                                      if (count > 0 && !isSelected) {
                                        const hoverColors = getGradientColor(count, maxCount || 1);
                                        e.currentTarget.style.backgroundColor = hoverColors.bg.replace("0.7", "0.85");
                                      }
                                    }}
                                    onMouseLeave={(e) => {
                                      if (!isSelected) {
                                        e.currentTarget.style.backgroundColor = gradientColors.bg;
                                      }
                                    }}
                                    onClick={() => {
                                      if (count > 0) {
                                        setSelectedHeatmapCell(
                                          isSelected ? null : { origin, escalation }
                                        );
                                      }
                                    }}
                                  >
                                    {count > 0 ? (
                                      <div className="flex flex-col items-center gap-1">
                                        <span className="text-xl font-bold text-white">{count}</span>
                                        <span className="text-xs text-gray-400">customers</span>
                                      </div>
                                    ) : (
                                      <span className="text-gray-600 text-sm">-</span>
                                    )}
                                  </td>
                                );
                              })}
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                );
              })()}
            </Card>
          </div>

          {/* Customer Details Panel - Right Side */}
          {selectedHeatmapCell && (
            <div className="lg:col-span-1">
              <Card className="border border-[#b90abd]/40 bg-[rgba(26,26,26,0.8)] p-6 shadow-lg h-full">
              {(() => {
                  // Filter customers based on selected heatmap cell
                  const selectedCustomers = customerJourneys.filter(
                    j => j.originChannel === selectedHeatmapCell.origin && 
                         j.finalChannel === selectedHeatmapCell.escalation
                  );
                  const originColors = getChannelColor(selectedHeatmapCell.origin);
                  const escalationColors = getChannelColor(selectedHeatmapCell.escalation);
                  const OriginIcon = getChannelIcon(selectedHeatmapCell.origin);
                  const EscalationIcon = getChannelIcon(selectedHeatmapCell.escalation);

                  return (
                    <>
                      {/* Panel Header */}
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-3">
                          <div className={`p-2 rounded-lg ${originColors.bg} bg-opacity-20`}>
                            <OriginIcon className={`h-6 w-6 ${originColors.text}`} />
                          </div>
                          <ArrowRight className="h-4 w-4 text-gray-400" />
                          <div className={`p-2 rounded-lg ${escalationColors.bg} bg-opacity-20`}>
                            <EscalationIcon className={`h-6 w-6 ${escalationColors.text}`} />
                          </div>
                          <div>
                            <h3 className="text-lg font-bold text-white capitalize">
                              {selectedHeatmapCell.origin} → {selectedHeatmapCell.escalation}
                            </h3>
                            <p className="text-xs text-gray-400">{selectedCustomers.length} customers</p>
                          </div>
                        </div>
                        <button
                          onClick={() => setSelectedHeatmapCell(null)}
                          className="p-2 rounded-lg hover:bg-white/10 transition-colors"
                        >
                          <X className="h-5 w-5 text-gray-400" />
                        </button>
                      </div>

                      {/* Customer Details */}
                      <div className="relative">
                        <h4 className="text-sm font-semibold text-white mb-3">Customer Details</h4>
                        <ScrollArea className="h-[600px] pr-2">
                          <div className="space-y-3 relative">
                            {selectedCustomers.length > 0 ? (
                              selectedCustomers.map((journey) => {
                                const severityColors = {
                                  high: "bg-red-500/20 border-red-400/40 text-red-100",
                                  medium: "bg-amber-500/20 border-amber-400/40 text-amber-100",
                                  low: "bg-emerald-500/20 border-emerald-400/40 text-emerald-100",
                                };

                                return (
                                  <Card
                                    key={journey.id}
                                    className="border border-white/10 bg-[rgba(15,15,15,0.8)] p-4 hover:border-[#b90abd]/40 transition-all"
                                    onMouseEnter={() => setHoveredCustomerId(journey.customerId)}
                                    onMouseLeave={() => setHoveredCustomerId(null)}
                                  >
                                    <div className="flex items-start justify-between mb-3">
                                      <div className="flex-1">
                                        <div className="flex items-center gap-2 mb-2">
                                          <h5 className="text-base font-semibold text-white">{journey.customerId}</h5>
                                          <Badge className={`${severityColors[journey.severity]} text-xs`}>
                                            {journey.severity.toUpperCase()}
                                          </Badge>
                                        </div>
                                        
                                        {/* Journey Summary */}
                                        <div className="flex items-center gap-3 text-xs text-gray-400 mb-2 flex-wrap">
                                          <div className="flex items-center gap-1">
                                            <span>{journey.journey.length} steps</span>
                                            <span>•</span>
                                            <span>Final: {journey.finalChannel}</span>
                                          </div>
                                        </div>
                                      </div>
                                    </div>

                                    {/* Journey Path with Timeline - Complete Path */}
                                    <div className="mb-3 p-3 rounded-lg bg-[rgba(26,26,26,0.6)] border border-white/5">
                                      <div className="text-xs text-gray-400 mb-3 font-semibold uppercase tracking-wide">Journey Timeline</div>
                                      <div className="flex items-center gap-1.5 overflow-x-auto pb-2 scrollbar-thin scrollbar-thumb-gray-600 scrollbar-track-transparent">
                                        {journey.journey.map((step, index) => {
                                          const isLast = index === journey.journey.length - 1;
                                          const isFirst = index === 0;
                                          const stepColors = getChannelColor(step.channel);
                                          const StepIcon = getChannelIcon(step.channel);
                                          const prevStep = index > 0 ? journey.journey[index - 1] : null;
                                          const timeDiff = prevStep
                                            ? Math.round((new Date(step.timestamp).getTime() - new Date(prevStep.timestamp).getTime()) / (1000 * 60 * 60))
                                            : null;

                                          return (
                                            <div key={`${journey.id}-step-${index}`} className="flex items-center gap-1.5 relative shrink-0">
                                              <div
                                                className={`flex items-center gap-1.5 px-2 py-1.5 rounded-lg text-xs transition-all ${
                                                  step.escalated
                                                    ? "bg-red-500/30 border-2 border-red-400 shadow-lg shadow-red-500/20"
                                                    : isFirst
                                                    ? `bg-blue-500/20 border-2 ${stepColors.border} border-opacity-70`
                                                    : `bg-gray-500/20 border ${stepColors.border} border-opacity-60`
                                                } border`}
                                              >
                                                <span className={`${stepColors.text} capitalize font-bold text-[10px] whitespace-nowrap`}>
                                                  {step.channel}
                                                </span>
                                                {step.escalated && (
                                                  <AlertCircle className="h-3 w-3 text-red-400 animate-pulse" />
                                                )}
                                                {isFirst && (
                                                  <span className="text-[8px] text-gray-400 font-medium ml-0.5">Origin</span>
                                                )}
                                                {isLast && step.escalated && (
                                                  <span className="text-[8px] text-red-400 font-bold uppercase ml-0.5">ESCALATED</span>
                                                )}
                                                {timeDiff !== null && (
                                                  <span className="text-[8px] text-gray-500 font-medium ml-0.5">
                                                    +{timeDiff}h
                                                  </span>
                                                )}
                                              </div>
                                              {!isLast && (
                                                <ArrowRight className="h-3 w-3 text-gray-400 shrink-0" />
                                              )}
                                            </div>
                                          );
                                        })}
                                      </div>
                                      
                                      {/* Sentiment Plot */}
                                      <div className="mt-3 pt-3 border-t border-white/10">
                                        <div className="text-[10px] text-gray-400 mb-2 font-semibold uppercase tracking-wide">Sentiment Trend</div>
                                        <div className="h-24 w-full">
                                          <ResponsiveContainer width="100%" height="100%">
                                            {(() => {
                                              const sentimentData = journey.journey.map((step, idx) => ({
                                                step: idx + 1,
                                                channel: step.channel.charAt(0).toUpperCase() + step.channel.slice(1),
                                                sentiment: step.sentimentScore,
                                                timestamp: step.timestamp
                                              }));
                                              
                                              // Function to get color based on sentiment (1-5 scale)
                                              const getSentimentColor = (sentiment: number): string => {
                                                const normalized = (sentiment - 1) / 4;
                                                
                                                if (normalized <= 0.25) {
                                                  const ratio = normalized / 0.25;
                                                  const r = Math.round(34 + (ratio * 100));
                                                  const g = Math.round(197 + (ratio * 58));
                                                  const b = Math.round(94 - (ratio * 94));
                                                  return `rgb(${r}, ${g}, ${b})`;
                                                } else if (normalized <= 0.5) {
                                                  const ratio = (normalized - 0.25) / 0.25;
                                                  const r = Math.round(134 + (ratio * 121));
                                                  const g = Math.round(255 - (ratio * 55));
                                                  const b = Math.round(0);
                                                  return `rgb(${r}, ${g}, ${b})`;
                                                } else if (normalized <= 0.75) {
                                                  const ratio = (normalized - 0.5) / 0.25;
                                                  const r = Math.round(255);
                                                  const g = Math.round(200 - (ratio * 100));
                                                  const b = Math.round(0);
                                                  return `rgb(${r}, ${g}, ${b})`;
                                                } else {
                                                  const ratio = (normalized - 0.75) / 0.25;
                                                  const r = Math.round(255);
                                                  const g = Math.round(100 - (ratio * 100));
                                                  const b = Math.round(0);
                                                  return `rgb(${r}, ${g}, ${b})`;
                                                }
                                              };
                                              
                                              const gradientStops = sentimentData.map((point, idx) => {
                                                const offset = sentimentData.length > 1 
                                                  ? (idx / (sentimentData.length - 1)) * 100 
                                                  : 0;
                                                const color = getSentimentColor(point.sentiment);
                                                return { offset, color, sentiment: point.sentiment };
                                              });
                                              
                                              if (gradientStops.length > 0) {
                                                gradientStops[0].offset = 0;
                                                if (gradientStops.length > 1) {
                                                  gradientStops[gradientStops.length - 1].offset = 100;
                                                }
                                              }
                                              
                                              const avgSentiment = sentimentData.reduce((sum, p) => sum + p.sentiment, 0) / sentimentData.length;
                                              const strokeColor = getSentimentColor(avgSentiment);
                                              
                                              return (
                                                <AreaChart
                                                  data={sentimentData}
                                                  margin={{ top: 5, right: 5, left: 5, bottom: 5 }}
                                                >
              <defs>
                                                    <linearGradient id={`sentimentLineGradient-${journey.id}`} x1="0%" y1="0%" x2="100%" y2="0%">
                                                      {gradientStops.map((stop, idx) => (
                                                        <stop 
                                                          key={idx}
                                                          offset={`${stop.offset}%`} 
                                                          stopColor={stop.color} 
                                                          stopOpacity={1}
                                                        />
                                                      ))}
                                                    </linearGradient>
                                                    <linearGradient 
                                                      id={`sentimentAreaGradient-${journey.id}`} 
                                                      x1="0%" 
                                                      y1="0%" 
                                                      x2="100%" 
                                                      y2="0%"
                                                      spreadMethod="pad"
                                                    >
                                                      {gradientStops.map((stop, idx) => {
                                                        const nextStop = gradientStops[idx + 1];
                                                        const stops = [];
                                                        
                                                        stops.push(
                                                          <stop 
                                                            key={`${idx}-main`}
                                                            offset={`${stop.offset}%`} 
                                                            stopColor={stop.color} 
                                                            stopOpacity={0.6}
                                                          />
                                                        );
                                                        
                                                        if (nextStop && idx < gradientStops.length - 1) {
                                                          const midOffset = (stop.offset + nextStop.offset) / 2;
                                                          const midSentiment = (stop.sentiment + nextStop.sentiment) / 2;
                                                          const midColor = getSentimentColor(midSentiment);
                                                          stops.push(
                                                            <stop 
                                                              key={`${idx}-mid`}
                                                              offset={`${midOffset}%`} 
                                                              stopColor={midColor} 
                                                              stopOpacity={0.6}
                                                            />
                                                          );
                                                        }
                                                        
                                                        return stops;
                                                      }).flat()}
                                                    </linearGradient>
                                                  </defs>
                                                  <XAxis 
                                                    dataKey="channel" 
                                                    tick={{ fill: '#9ca3af', fontSize: 9 }}
                                                    axisLine={{ stroke: '#4b5563' }}
                                                    tickLine={{ stroke: '#4b5563' }}
                                                  />
                                                  <YAxis 
                                                    domain={[1, 5]}
                                                    tick={{ fill: '#9ca3af', fontSize: 9 }}
                                                    axisLine={{ stroke: '#4b5563' }}
                                                    tickLine={{ stroke: '#4b5563' }}
                                                  />
                                                  <Tooltip 
                                                    contentStyle={{ 
                                                      backgroundColor: 'rgba(15, 15, 15, 0.95)', 
                                                      border: '1px solid rgba(255, 255, 255, 0.1)',
                                                      borderRadius: '6px',
                                                      fontSize: '11px'
                                                    }}
                                                    labelStyle={{ color: '#9ca3af' }}
                                                    formatter={(value: number) => [`${value.toFixed(1)}/5`, 'Sentiment']}
                                                  />
                                                  <Area 
                                                    type="monotone" 
                                                    dataKey="sentiment" 
                                                    stroke={`url(#sentimentLineGradient-${journey.id})`}
                                                    strokeWidth={2}
                                                    fill={`url(#sentimentAreaGradient-${journey.id})`}
                                                  />
                                                </AreaChart>
                                              );
                                            })()}
                                          </ResponsiveContainer>
                                        </div>
                                      </div>
                                    </div>

                                    {/* AI Summary and Next Action Suggestion Tabs */}
                                    {(journey.aiSummary || journey.nextActionSuggestion) && (
                                      <div className="rounded-lg border border-white/10 bg-[rgba(15,15,15,0.8)] overflow-hidden">
                                        <div className="flex items-center justify-between border-b border-white/10 bg-[rgba(26,26,26,0.6)] px-4 py-2">
                                          <div className="flex items-center gap-4">
                                            <button
                                              onClick={() => setActiveTab({ ...activeTab, [journey.customerId]: "action" })}
                                              className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-xs font-semibold transition-all ${
                                                (activeTab[journey.customerId] || "action") === "action"
                                                  ? "bg-amber-500/20 text-amber-300 border border-amber-400/30"
                                                  : "text-gray-400 hover:text-gray-300 hover:bg-white/5"
                                              }`}
                                            >
                                              <Lightbulb className="h-3.5 w-3.5" />
                                              <span>Next Action Suggestion</span>
                                            </button>
                                            {journey.aiSummary && (
                                              <button
                                                onClick={() => setActiveTab({ ...activeTab, [journey.customerId]: "summary" })}
                                                className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-xs font-semibold transition-all ${
                                                  activeTab[journey.customerId] === "summary"
                                                    ? "bg-blue-500/20 text-blue-300 border border-blue-400/30"
                                                    : "text-gray-400 hover:text-gray-300 hover:bg-white/5"
                                                }`}
                                              >
                                                <Sparkles className="h-3.5 w-3.5" />
                                                <span>AI Summary</span>
                                              </button>
                                            )}
                                          </div>
                                        </div>
                                        <div className="p-3">
                                          {(activeTab[journey.customerId] || "action") === "action" && journey.nextActionSuggestion && (
                                            <div className="p-3 rounded-lg bg-[rgba(251,191,36,0.1)] border border-amber-400/30">
                                              <p className="text-xs text-gray-200 leading-relaxed">{journey.nextActionSuggestion}</p>
                                            </div>
                                          )}
                                          {activeTab[journey.customerId] === "summary" && journey.aiSummary && (
                                            <div className="p-3 rounded-lg bg-[rgba(59,130,246,0.1)] border border-blue-400/30">
                                              <p className="text-xs text-gray-200 leading-relaxed">{journey.aiSummary}</p>
                                            </div>
                                          )}
                                        </div>
                                      </div>
                                    )}

                                  </Card>
                                );
                              })
                            ) : (
                              <div className="text-center py-8 text-gray-500">
                                <p>No customers found</p>
                              </div>
                            )}
                          </div>
                        </ScrollArea>
                      </div>
                    </>
                  );
                })()}
              </Card>
            </div>
          )}
        </div>
      </div>

    </Card>
  );
}
