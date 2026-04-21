"use client";

import { useState, useEffect, useRef, useMemo } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Mail, MessageSquare, Ticket, Phone, AlertCircle, CheckCircle, AlertTriangle, Sparkles, X, TrendingUp } from "lucide-react";

interface ClosedChannel {
  id: string;
  label: string;
  status: string;
  count: number;
  icon: typeof Ticket;
}

interface ActiveChannel {
  id: string;
  label: string;
  status: string;
  count: number;
  icon: typeof Mail;
}

interface ConflictIndicator {
  sentiment: string;
  sameIntent: boolean;
  timeDelta: string;
}

interface Flow {
  from: string;
  to: string;
  count: number;
  risk: 'high' | 'medium' | 'low';
  conflict: ConflictIndicator;
  topics: string[];
  caseIds: string[];
}

interface PrematureClosureCase {
  id: string;
  risk: 'high' | 'medium' | 'low';
  title: string;
  description: string;
  intentCluster: string;
  timestamp: string;
  closedChannel: string;
  activeChannels: Array<{
    channel: string;
    sentiment: string;
    status: string;
    pendingAction?: string;
  }>;
  action: string;
}

const CLOSED_CHANNELS: ClosedChannel[] = [
  { id: 'ticket', label: 'Ticket', status: 'Marked Resolved', count: 2, icon: Ticket },
  { id: 'chat', label: 'Chat', status: 'Marked Resolved', count: 1, icon: MessageSquare },
  { id: 'voice', label: 'Voice', status: 'Confirmed Complete', count: 1, icon: Phone },
];

const ACTIVE_CHANNELS: ActiveChannel[] = [
  { id: 'voice', label: 'Voice', status: 'Frustrated', count: 2, icon: Phone },
  { id: 'email', label: 'Email', status: 'Awaiting Action', count: 2, icon: Mail },
  { id: 'social', label: 'Social', status: 'Public Complaint', count: 1, icon: MessageSquare },
];

const FLOWS: Flow[] = [
  {
    from: 'ticket',
    to: 'voice',
    count: 2,
    risk: 'high',
    conflict: { sentiment: '4/5', sameIntent: true, timeDelta: '1 min' },
    topics: ['Mortgage Rate Lock'],
    caseIds: ['C-48152', 'C-77204']
  },
  {
    from: 'ticket',
    to: 'email',
    count: 1,
    risk: 'medium',
    conflict: { sentiment: '3.5/5', sameIntent: true, timeDelta: '2h' },
    topics: ['Credit Card Dispute'],
    caseIds: ['C-77204']
  },
  {
    from: 'chat',
    to: 'email',
    count: 1,
    risk: 'medium',
    conflict: { sentiment: '4.2/5', sameIntent: true, timeDelta: '30 min' },
    topics: ['Credit Card Dispute'],
    caseIds: ['C-77204']
  },
  {
    from: 'chat',
    to: 'social',
    count: 1,
    risk: 'high',
    conflict: { sentiment: '4.5/5', sameIntent: true, timeDelta: '1h' },
    topics: ['Credit Card Dispute'],
    caseIds: ['C-77204']
  },
  {
    from: 'voice',
    to: 'email',
    count: 1,
    risk: 'low',
    conflict: { sentiment: '2.5/5', sameIntent: true, timeDelta: '4h' },
    topics: ['Account Inquiry'],
    caseIds: ['C-12345']
  },
];

const CASES: PrematureClosureCase[] = [
  {
    id: 'C-48152',
    risk: 'high',
    title: 'Mortgage Rate Lock',
    description: 'Ticket closed while borrower escalated the same rate-lock request via voice with declining sentiment.',
    intentCluster: 'Intent cluster',
    timestamp: 'Nov 6, 2:22 PM',
    closedChannel: 'ticket',
    activeChannels: [
      { channel: 'ticket', sentiment: '2.1 (Bit Irritated)', status: 'Resolution' },
      { channel: 'voice', sentiment: '4.6 (Frustrated)', status: 'Escalation' },
    ],
    action: 'Reopen ticket and assign to compliance QA for premature closure review.'
  },
  {
    id: 'C-77204',
    risk: 'medium',
    title: 'Credit Card Dispute',
    description: 'Chat marked dispute resolved, yet customer continues via email and social with unresolved sentiment and company pending actions.',
    intentCluster: 'Intent cluster',
    timestamp: 'Nov 5, 7:10 PM',
    closedChannel: 'chat',
    activeChannels: [
      { channel: 'chat', sentiment: '2.3 (Bit Irritated)', status: 'Resolution' },
      { channel: 'email', sentiment: '4.2 (Anger)', status: 'Investigation', pendingAction: 'Pending bank action' },
      { channel: 'social', sentiment: '4.5 (Frustrated)', status: 'Awareness', pendingAction: 'Pending bank action' },
    ],
    action: 'Link channels in dispute workflow and launch follow-up audit on closure criteria.'
  },
];

const getChannelColor = (channel: string) => {
  switch (channel) {
    case 'ticket': return { bg: '#60a5fa', border: '#2563eb', text: '#93c5fd' };
    case 'chat': return { bg: '#fb923c', border: '#ea580c', text: '#fdba74' };
    case 'voice': return { bg: '#fb7185', border: '#e11d48', text: '#fda4af' };
    case 'email': return { bg: '#2dd4bf', border: '#0d9488', text: '#5eead4' };
    case 'social': return { bg: '#f472b6', border: '#ec4899', text: '#f9a8d4' };
    default: return { bg: '#6b7280', border: '#4b5563', text: '#9ca3af' };
  }
};

const getRiskColor = (risk: 'high' | 'medium' | 'low') => {
  switch (risk) {
    case 'high': return { start: '#ff385c', end: '#ff6b9d', glow: 'rgba(255,56,92,0.4)' };
    case 'medium': return { start: '#fb923c', end: '#fbbf24', glow: 'rgba(251,146,60,0.4)' };
    case 'low': return { start: '#fbbf24', end: '#fef08a', glow: 'rgba(251,191,36,0.4)' };
  }
};

export function PrematureClosureRiskAuditCard() {
  const [selectedFlow, setSelectedFlow] = useState<Flow | null>(null);
  const [hoveredFlow, setHoveredFlow] = useState<Flow | null>(null);
  const [hoveredNode, setHoveredNode] = useState<string | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [viewportWidth, setViewportWidth] = useState(1400);

  useEffect(() => {
    const updateViewport = () => {
      if (containerRef.current) {
        setViewportWidth(containerRef.current.offsetWidth);
      }
    };
    updateViewport();
    window.addEventListener('resize', updateViewport);
    return () => window.removeEventListener('resize', updateViewport);
  }, []);

  const isSmallViewport = viewportWidth < 1400;

  // Calculate node positions
  const nodePositions = useMemo(() => {
    const leftX = 100;
    const rightX = viewportWidth - 300;
    const middleX = (leftX + rightX) / 2;
    const nodeSpacing = 160;
    const startY = 100;

    const closedPositions: Record<string, { x: number; y: number }> = {};
    CLOSED_CHANNELS.forEach((channel, idx) => {
      closedPositions[channel.id] = {
        x: leftX,
        y: startY + idx * nodeSpacing,
      };
    });

    const activePositions: Record<string, { x: number; y: number }> = {};
    ACTIVE_CHANNELS.forEach((channel, idx) => {
      activePositions[channel.id] = {
        x: rightX,
        y: startY + idx * nodeSpacing,
      };
    });

    return { closed: closedPositions, active: activePositions, middleX };
  }, [viewportWidth]);

  // Calculate flow paths
  const flowPaths = useMemo(() => {
    return FLOWS.map((flow, idx) => {
      const fromPos = nodePositions.closed[flow.from];
      const toPos = nodePositions.active[flow.to];
      
      if (!fromPos || !toPos) return null;

      const startX = fromPos.x + 200;
      const startY = fromPos.y + 60;
      const endX = toPos.x;
      const endY = toPos.y + 60;
      
      // Control points for smooth S-curve
      const control1X = startX + (endX - startX) * 0.3;
      const control1Y = startY;
      const control2X = startX + (endX - startX) * 0.7;
      const control2Y = endY;

      // Vertical offset for multiple flows between same nodes
      const verticalOffset = idx * 8;
      
      const path = `M ${startX} ${startY + verticalOffset} C ${control1X} ${control1Y + verticalOffset}, ${control2X} ${control2Y + verticalOffset}, ${endX} ${endY + verticalOffset}`;
      
      // Conflict indicator position (mid-point along curve)
      const conflictX = startX + (endX - startX) * 0.5;
      const conflictY = (startY + endY) / 2 + verticalOffset;

      return {
        ...flow,
        path,
        startX,
        startY: startY + verticalOffset,
        endX,
        endY: endY + verticalOffset,
        conflictX,
        conflictY,
        width: Math.min(8 + flow.count * 4, 40),
      };
    }).filter(Boolean) as Array<Flow & {
      path: string;
      startX: number;
      startY: number;
      endX: number;
      endY: number;
      conflictX: number;
      conflictY: number;
      width: number;
    }>;
  }, [nodePositions]);

  const filteredCases = selectedFlow
    ? CASES.filter(c => selectedFlow.caseIds.includes(c.id))
    : CASES;

  const getChannelIcon = (channelId: string) => {
    const allChannels = [...CLOSED_CHANNELS, ...ACTIVE_CHANNELS];
    const channel = allChannels.find(c => c.id === channelId);
    return channel?.icon || Ticket;
  };

  return (
    <div className="w-full h-full bg-[#0a0a0a] p-10" ref={containerRef}>
      <div className="mb-6">
        <div className="flex items-center gap-2 mb-2">
          <Sparkles className="h-5 w-5 text-yellow-400" />
          <h1 className="text-2xl font-bold text-white">Cross-Channel Interaction Breakdown Audit</h1>
        </div>
        <p className="text-sm text-gray-400">
          Cases where tickets were closed but the same issue was raised again in another channel.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Sankey Flow Diagram - Left Side (60%) */}
        <div className="lg:col-span-2">
          <Card className="border border-white/10 bg-[rgba(26,26,26,0.6)] p-6">
            <div className="relative" style={{ minHeight: '600px' }}>
              <svg width="100%" height="600" className="overflow-visible">
                <defs>
                  {['high', 'medium', 'low'].map(risk => {
                    const colors = getRiskColor(risk as 'high' | 'medium' | 'low');
                    return (
                      <linearGradient key={risk} id={`gradient-${risk}`} x1="0%" y1="0%" x2="100%" y2="0%">
                        <stop offset="0%" stopColor={colors.start} />
                        <stop offset="100%" stopColor={colors.end} />
                      </linearGradient>
                    );
                  })}
                  <filter id="glow">
                    <feGaussianBlur stdDeviation="4" result="coloredBlur"/>
                    <feMerge>
                      <feMergeNode in="coloredBlur"/>
                      <feMergeNode in="SourceGraphic"/>
                    </feMerge>
                  </filter>
                </defs>

                {/* Flow Paths */}
                {flowPaths.map((flowPath, idx) => {
                  const colors = getRiskColor(flowPath.risk);
                  const isSelected = selectedFlow?.from === flowPath.from && selectedFlow?.to === flowPath.to;
                  const isHovered = hoveredFlow?.from === flowPath.from && hoveredFlow?.to === flowPath.to;
                  const opacity = isSelected || isHovered ? 1 : (hoveredFlow ? 0.3 : 0.6);

                  return (
                    <g key={`flow-${flowPath.from}-${flowPath.to}-${idx}`}>
                      <path
                        d={flowPath.path}
                        fill="none"
                        stroke={`url(#gradient-${flowPath.risk})`}
                        strokeWidth={isHovered ? flowPath.width + 4 : flowPath.width}
                        opacity={opacity}
                        style={{
                          filter: flowPath.risk === 'high' ? 'url(#glow)' : 'none',
                          cursor: 'pointer',
                          transition: 'all 0.3s ease-out',
                          animation: flowPath.risk === 'high' ? 'pulse-glow 2s infinite' : 'none',
                        }}
                        onMouseEnter={() => setHoveredFlow(flowPath)}
                        onMouseLeave={() => setHoveredFlow(null)}
                        onClick={() => setSelectedFlow(isSelected ? null : flowPath)}
                      />
                      
                      {/* Conflict Indicator */}
                      <foreignObject
                        x={flowPath.conflictX - 90}
                        y={flowPath.conflictY - 50}
                        width="180"
                        height="100"
                        style={{ pointerEvents: 'none' }}
                      >
                        <div className="bg-[rgba(26,26,26,0.9)] border border-[#ff385c] rounded-lg p-3 backdrop-blur-sm">
                          <div className="flex items-center gap-2 mb-2">
                            <AlertTriangle className="h-4 w-4 text-[#ff385c]" />
                            <span className="text-xs font-bold text-white">CONFLICT</span>
                          </div>
                          <div className="text-[10px] text-gray-300 mb-1">
                            Sentiment: <span className="text-red-400 font-semibold">{flowPath.conflict.sentiment}</span>
                          </div>
                          <div className="text-[10px] text-gray-300 mb-1">
                            Same Intent: <span className="text-green-400">✓</span>
                          </div>
                          <div className="text-[10px] text-gray-300">
                            Time: <span className="text-yellow-400">{flowPath.conflict.timeDelta} after</span>
                          </div>
                        </div>
                      </foreignObject>

                      {/* Topic Pills */}
                      {flowPath.topics.map((topic, topicIdx) => (
                        <foreignObject
                          key={topic}
                          x={flowPath.conflictX - 60 + topicIdx * 10}
                          y={flowPath.conflictY + 60 + topicIdx * 35}
                          width="auto"
                          height="32"
                          style={{ pointerEvents: 'none' }}
                        >
                          <div className="bg-[rgba(139,92,246,0.3)] border border-[rgba(139,92,246,0.5)] rounded-2xl px-3.5 py-1.5 text-xs font-medium text-white whitespace-nowrap">
                            {topic}
                          </div>
                        </foreignObject>
                      ))}
                    </g>
                  );
                })}

                {/* Closed Channel Nodes (Left) */}
                {CLOSED_CHANNELS.map((channel) => {
                  const pos = nodePositions.closed[channel.id];
                  if (!pos) return null;
                  const colors = getChannelColor(channel.id);
                  const Icon = channel.icon;
                  const isHovered = hoveredNode === `closed-${channel.id}`;
                  const connectedFlows = flowPaths.filter(f => f.from === channel.id);

                  return (
                    <g
                      key={`closed-${channel.id}`}
                      onMouseEnter={() => setHoveredNode(`closed-${channel.id}`)}
                      onMouseLeave={() => setHoveredNode(null)}
                      style={{ cursor: 'pointer' }}
                    >
                      <rect
                        x={pos.x}
                        y={pos.y}
                        width={isSmallViewport ? 160 : 200}
                        height={isSmallViewport ? 96 : 120}
                        rx="12"
                        fill="linear-gradient(135deg, #1a1a1a, #252525)"
                        stroke={colors.border}
                        strokeWidth="2"
                        opacity={isHovered ? 1 : (hoveredNode && !isHovered ? 0.4 : 1)}
                        style={{
                          transition: 'all 0.3s ease',
                          boxShadow: '0 4px 12px rgba(0,0,0,0.4)',
                        }}
                      />
                      <foreignObject
                        x={pos.x}
                        y={pos.y}
                        width={isSmallViewport ? 160 : 200}
                        height={isSmallViewport ? 96 : 120}
                        style={{ pointerEvents: 'none' }}
                      >
                        <div className="flex flex-col items-center justify-center h-full text-white p-4">
                          <div className="flex items-center gap-2 mb-2">
                            <Icon className={`${isSmallViewport ? 'h-6 w-6' : 'h-8 w-8'}`} style={{ color: colors.text }} />
                            <CheckCircle className={`${isSmallViewport ? 'h-4 w-4' : 'h-5 w-5'} text-[#06b6d4]`} />
                          </div>
                          <span className={`${isSmallViewport ? 'text-xs' : 'text-sm'} font-bold capitalize mb-1`}>{channel.label}</span>
                          <span className={`${isSmallViewport ? 'text-[10px]' : 'text-xs'} text-gray-400 mb-1`}>({channel.status})</span>
                          <span className={`${isSmallViewport ? 'text-[10px]' : 'text-xs'} text-[#06b6d4]`}>[{channel.count}]</span>
                        </div>
                      </foreignObject>
                    </g>
                  );
                })}

                {/* Active Channel Nodes (Right) */}
                {ACTIVE_CHANNELS.map((channel) => {
                  const pos = nodePositions.active[channel.id];
                  if (!pos) return null;
                  const colors = getChannelColor(channel.id);
                  const Icon = channel.icon;
                  const isHovered = hoveredNode === `active-${channel.id}`;
                  const connectedFlows = flowPaths.filter(f => f.to === channel.id);

                  return (
                    <g
                      key={`active-${channel.id}`}
                      onMouseEnter={() => setHoveredNode(`active-${channel.id}`)}
                      onMouseLeave={() => setHoveredNode(null)}
                      style={{ cursor: 'pointer' }}
                    >
                      <rect
                        x={pos.x}
                        y={pos.y}
                        width={isSmallViewport ? 160 : 200}
                        height={isSmallViewport ? 96 : 120}
                        rx="12"
                        fill="linear-gradient(135deg, #1a1a1a, #252525)"
                        stroke="#f97316"
                        strokeWidth="2"
                        opacity={isHovered ? 1 : (hoveredNode && !isHovered ? 0.4 : 1)}
                        style={{
                          transition: 'all 0.3s ease',
                          boxShadow: '0 4px 12px rgba(0,0,0,0.4)',
                        }}
                      />
                      <foreignObject
                        x={pos.x}
                        y={pos.y}
                        width={isSmallViewport ? 160 : 200}
                        height={isSmallViewport ? 96 : 120}
                        style={{ pointerEvents: 'none' }}
                      >
                        <div className="flex flex-col items-center justify-center h-full text-white p-4">
                          <div className="flex items-center gap-2 mb-2">
                            <Icon className={`${isSmallViewport ? 'h-6 w-6' : 'h-8 w-8'}`} style={{ color: colors.text }} />
                            <AlertTriangle className={`${isSmallViewport ? 'h-4 w-4' : 'h-5 w-5'} text-[#f97316]`} />
                          </div>
                          <span className={`${isSmallViewport ? 'text-xs' : 'text-sm'} font-bold capitalize mb-1`}>{channel.label}</span>
                          <span className={`${isSmallViewport ? 'text-[10px]' : 'text-xs'} text-gray-400 mb-1`}>({channel.status})</span>
                          <span className={`${isSmallViewport ? 'text-[10px]' : 'text-xs'} text-[#f97316]`}>[{channel.count}]</span>
                        </div>
                      </foreignObject>
                    </g>
                  );
                })}
              </svg>

              <style jsx>{`
                @keyframes pulse-glow {
                  0%, 100% { filter: drop-shadow(0 0 20px rgba(255,56,92,0.4)); }
                  50% { filter: drop-shadow(0 0 30px rgba(255,56,92,0.8)); }
                }
              `}</style>
            </div>
          </Card>
        </div>

        {/* Cases Panel - Right Side */}
        <div className="lg:col-span-1">
          <Card className="border border-white/10 bg-[rgba(26,26,26,0.8)] p-6 shadow-lg h-full">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-white">Premature Closure Cases</h3>
              {selectedFlow && (
                <span className="text-xs text-gray-400">
                  Viewing {filteredCases.length} of {CASES.length} cases
                </span>
              )}
            </div>
            <ScrollArea className="h-[600px] pr-2">
              <div className="space-y-4">
                {filteredCases.map((caseItem) => {
                  const riskColors = {
                    high: 'bg-red-500/20 border-red-400/40 text-red-100',
                    medium: 'bg-amber-500/20 border-amber-400/40 text-amber-100',
                    low: 'bg-yellow-500/20 border-yellow-400/40 text-yellow-100',
                  };

                  return (
                    <Card
                      key={caseItem.id}
                      className={`border border-white/10 bg-[rgba(15,15,15,0.8)] p-4 hover:border-[#b90abd]/40 transition-all ${
                        selectedFlow?.caseIds.includes(caseItem.id) ? 'border-[#b90abd]/60 bg-[rgba(185,10,189,0.1)]' : ''
                      }`}
                    >
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <h5 className="text-base font-semibold text-white">{caseItem.id}</h5>
                            <Badge className={`${riskColors[caseItem.risk]} text-xs`}>
                              {caseItem.risk.toUpperCase()}
                            </Badge>
                          </div>
                          <h6 className="text-sm font-bold text-white mb-1">{caseItem.title}</h6>
                          <div className="flex items-center gap-2 text-xs text-gray-400 mb-2">
                            <span>{caseItem.intentCluster}</span>
                            <span>•</span>
                            <span>{caseItem.timestamp}</span>
                          </div>
                          <p className="text-xs text-gray-300 mb-3">{caseItem.description}</p>

                          {/* Channel Status */}
                          <div className="mb-3 space-y-2">
                            <div className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-2">
                              Channel Status
                            </div>
                            {caseItem.activeChannels.map((ac, idx) => {
                              const channelColors = getChannelColor(ac.channel);
                              const ChannelIcon = getChannelIcon(ac.channel);
                              const isResolved = ac.status === 'Resolution';
                              const sentimentColor = parseFloat(ac.sentiment.split(' ')[0]) >= 4 ? 'text-red-400' : 'text-gray-400';

                              return (
                                <div key={idx} className="flex items-center gap-2 text-xs">
                                  {isResolved ? (
                                    <CheckCircle className="h-4 w-4 text-green-400" />
                                  ) : (
                                    <X className="h-4 w-4 text-red-400" />
                                  )}
                                  <Badge
                                    className="text-xs px-2 py-0.5"
                                    style={{
                                      backgroundColor: `${channelColors.bg}40`,
                                      borderColor: channelColors.border,
                                      color: channelColors.text,
                                    }}
                                  >
                                    <ChannelIcon className="h-3 w-3 inline mr-1" />
                                    {ac.channel.charAt(0).toUpperCase() + ac.channel.slice(1)}
                                  </Badge>
                                  <span className={sentimentColor}>{ac.sentiment}</span>
                                  <span className="text-gray-500 text-[10px]">({ac.status})</span>
                                  {ac.pendingAction && (
                                    <span className="text-orange-400 text-[10px]">• {ac.pendingAction}</span>
                                  )}
                                </div>
                              );
                            })}
                          </div>

                          {/* Action Section */}
                          <div className="bg-gradient-to-r from-yellow-500/20 to-amber-500/20 border border-yellow-400/30 rounded-lg p-3">
                            <div className="flex items-center gap-2 mb-2">
                              <Sparkles className="h-4 w-4 text-yellow-400" />
                              <span className="text-xs font-bold text-yellow-300 uppercase">Action</span>
                            </div>
                            <p className="text-xs text-white leading-relaxed">{caseItem.action}</p>
                          </div>
                        </div>
                      </div>
                    </Card>
                  );
                })}
              </div>
            </ScrollArea>
          </Card>
        </div>
      </div>
    </div>
  );
}

