'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip as RechartsTooltip, BarChart, Bar, XAxis, YAxis, CartesianGrid, LineChart, Line, AreaChart, Area } from 'recharts';
import { HighRiskCall, IssueHeatmapData, CoachingTicket } from '@/lib/voiceData';
import { AlertTriangle, ExternalLink, BookOpen } from 'lucide-react';

interface CoreIntelligenceColumnProps {
  highRiskCalls: HighRiskCall[];
  issueHeatmap: IssueHeatmapData[];
  coachingTickets: CoachingTicket[];
  onCallClick: (callId: string) => void;
  onAgentClick: (agentId: string) => void;
}

export function CoreIntelligenceColumn({
  highRiskCalls,
  issueHeatmap,
  coachingTickets,
  onCallClick,
  onAgentClick
}: CoreIntelligenceColumnProps) {
  const getRiskColor = (score: number) => {
    if (score >= 80) return 'text-red-500';
    if (score >= 60) return 'text-orange-500';
    return 'text-yellow-500';
  };

  const getHeatmapColor = (value: number) => {
    if (value >= 30) return '#ef4444';
    if (value >= 20) return '#f59e0b';
    if (value >= 10) return '#fbbf24';
    return '#10b981';
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'text-red-500 bg-red-500/20 border-red-500/30';
      case 'high': return 'text-orange-500 bg-orange-500/20 border-orange-500/30';
      case 'medium': return 'text-yellow-500 bg-yellow-500/20 border-yellow-500/30';
      default: return 'text-blue-500 bg-blue-500/20 border-blue-500/30';
    }
  };

  return (
    <div className="flex flex-col h-full min-h-0 min-w-0 w-full">
      <div className="flex-1 flex flex-col min-h-0 gap-4 overflow-hidden">
      {/* Issue Heatmap - top of second column */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Issue Heatmap</CardTitle>
          <p className="text-xs text-muted-foreground mt-1">
            Shows issue frequency by call type. Higher numbers = more issues detected. Hover cells for details.
          </p>
        </CardHeader>
        <CardContent className="overflow-auto">
          <TooltipProvider>
            <div className="space-y-3">
              {/* Column Headers */}
              <div className="grid gap-3 text-xs font-semibold text-muted-foreground mb-3 pb-2 border-b border-white/20 min-w-0" style={{ gridTemplateColumns: 'minmax(100px, 140px) repeat(5, minmax(60px, 1fr))' }}>
                <div className="text-left">Call Type</div>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <div className="text-center cursor-help px-2">
                      <div className="truncate">Compliance</div>
                      <div className="text-[10px] text-muted-foreground/70 mt-0.5">Deviation</div>
                    </div>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p className="font-semibold">Compliance Deviation</p>
                    <p className="text-xs">How often agents miss required banking scripts (KYC, fraud protocols, regulatory statements)</p>
                  </TooltipContent>
                </Tooltip>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <div className="text-center cursor-help px-2">
                      <div className="truncate">Tone</div>
                      <div className="text-[10px] text-muted-foreground/70 mt-0.5">Problems</div>
                    </div>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p className="font-semibold">Tone Problems</p>
                    <p className="text-xs">Issues with agent tone, empathy, or communication style that affect customer experience</p>
                  </TooltipContent>
                </Tooltip>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <div className="text-center cursor-help px-2">
                      <div className="truncate">Silence</div>
                      <div className="text-[10px] text-muted-foreground/70 mt-0.5">Issues</div>
                    </div>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p className="font-semibold">Silence Issues</p>
                    <p className="text-xs">Long pauses or awkward silence patterns during calls that indicate confusion or delays</p>
                  </TooltipContent>
                </Tooltip>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <div className="text-center cursor-help px-2">
                      <div className="truncate">Incorrect</div>
                      <div className="text-[10px] text-muted-foreground/70 mt-0.5">Information</div>
                    </div>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p className="font-semibold">Incorrect Information</p>
                    <p className="text-xs">Cases where agents provided wrong information to customers, leading to confusion or errors</p>
                  </TooltipContent>
                </Tooltip>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <div className="text-center cursor-help px-2">
                      <div className="truncate">Emotional</div>
                      <div className="text-[10px] text-muted-foreground/70 mt-0.5">Spikes</div>
                    </div>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p className="font-semibold">Emotional Spikes</p>
                    <p className="text-xs">Moments when customer emotion became negative or escalated during the call</p>
                  </TooltipContent>
                </Tooltip>
              </div>

              {/* Heatmap Rows */}
              <div className="space-y-2 max-h-[500px] overflow-y-auto">
                {issueHeatmap.map((item, idx) => (
                  <div key={idx} className="grid gap-3 items-start py-1.5 hover:bg-white/5 rounded px-1 transition-colors min-w-0" style={{ gridTemplateColumns: 'minmax(100px, 140px) repeat(5, minmax(60px, 1fr))' }}>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <div className="text-sm text-white font-medium cursor-help pr-2 leading-tight" style={{ wordBreak: 'break-word', overflowWrap: 'break-word' }}>
                          <div className="line-clamp-2">{item.intent}</div>
                        </div>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p className="font-semibold">{item.intent}</p>
                        <p className="text-xs">Call type category showing issue frequency</p>
                      </TooltipContent>
                    </Tooltip>
                    {[
                      { value: item.complianceDeviation, key: 'complianceDeviation', label: 'Compliance Deviation', fullLabel: 'Compliance Deviation' },
                      { value: item.toneProblems, key: 'toneProblems', label: 'Tone Problems', fullLabel: 'Tone Problems' },
                      { value: item.silence, key: 'silence', label: 'Silence Issues', fullLabel: 'Silence Issues' },
                      { value: item.incorrectInfo, key: 'incorrectInfo', label: 'Incorrect Information', fullLabel: 'Incorrect Information' },
                      { value: item.emotionalSpikes, key: 'emotionalSpikes', label: 'Emotional Spikes', fullLabel: 'Emotional Spikes' }
                    ].map((issue, vIdx) => {
                      const causes = item.rootCauses?.[issue.key as keyof typeof item.rootCauses];
                      return (
                      <Tooltip key={vIdx}>
                        <TooltipTrigger asChild>
                          <div
                            className="h-10 rounded flex items-center justify-center cursor-help transition-all hover:scale-105 border border-white/10 mx-auto w-full"
                            style={{ backgroundColor: getHeatmapColor(issue.value) }}
                          >
                            <span className="text-sm font-bold text-white">
                              {issue.value.toFixed(0)}
                            </span>
                          </div>
                        </TooltipTrigger>
                        <TooltipContent className="max-w-sm">
                          <div className="space-y-2">
                            <p className="font-semibold">{item.intent}</p>
                            <p className="text-sm">{issue.fullLabel}: <span className="font-bold text-white">{issue.value.toFixed(0)}</span></p>
                            <p className="text-xs text-muted-foreground">
                              {issue.value.toFixed(0)} occurrences detected
                            </p>
                            {causes && causes.length > 0 && (
                              <div className="mt-2 pt-2 border-t border-white/20">
                                <p className="text-xs font-semibold text-amber-400 mb-1">
                                  {causes.length > 1 ? 'Main causes:' : 'Reason:'}
                                </p>
                                <ul className="text-xs text-muted-foreground space-y-0.5 list-disc list-inside">
                                  {causes.map((cause: string, i: number) => (
                                    <li key={i}>{cause}</li>
                                  ))}
                                </ul>
                              </div>
                            )}
                            <p className="text-xs mt-1 pt-1 border-t border-white/20">
                              {issue.value >= 30 ? '🔴 Critical - Immediate attention needed' :
                               issue.value >= 20 ? '🟡 High - Review recommended' :
                               issue.value >= 10 ? '🟠 Moderate - Monitor closely' :
                               '🟢 Low - Within acceptable range'}
                            </p>
                          </div>
                        </TooltipContent>
                      </Tooltip>
                    );
                    })}
                  </div>
                ))}
              </div>
            </div>
          </TooltipProvider>
        </CardContent>
      </Card>

      {/* Coaching Recommendations */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-blue-500" />
            Coaching Recommendations
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 max-h-[520px] overflow-y-auto">
          {coachingTickets.map((ticket) => (
            <Card key={ticket.agentId} className="p-3 border-blue-500/30">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-semibold text-white">{ticket.agentName}</span>
                  <span className={`text-xs px-2 py-0.5 rounded ${getSeverityColor(ticket.severity)}`}>
                    {ticket.severity.toUpperCase()}
                  </span>
                </div>
                <p className="text-xs text-muted-foreground">{ticket.problemSummary}</p>
                <div className="space-y-1">
                  <p className="text-xs text-muted-foreground">Issues:</p>
                  <ul className="space-y-0.5">
                    {ticket.lastIssues.map((issue, idx) => (
                      <li key={idx} className="text-xs text-white flex items-center gap-1">
                        <span className="w-1 h-1 bg-blue-500 rounded-full" />
                        {issue}
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="pt-2 border-t border-white/10">
                  <p className="text-xs text-blue-400 mb-1">Recommended Training:</p>
                  <p className="text-xs text-white">{ticket.recommendedTraining}</p>
                </div>
                <Button
                  size="sm"
                  className="w-full text-xs mt-2"
                  onClick={() => onAgentClick(ticket.agentId)}
                >
                  Schedule Coaching
                </Button>
              </div>
            </Card>
          ))}
        </CardContent>
      </Card>

      {/* High-Risk Calls */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-red-500" />
            High-Risk Calls
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-3 max-h-[490px] overflow-y-auto">
            {highRiskCalls.slice(0, 6).map((call) => (
              <Card key={call.callId} className="p-3 border-red-500/30">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs px-2 py-1 bg-red-500/20 text-red-400 rounded">{call.riskCategory}</span>
                    <span className={`text-sm font-bold ${getRiskColor(call.riskScore)}`}>
                      {call.riskScore.toFixed(0)}%
                    </span>
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-white">{call.intent}</p>
                    <p className="text-xs text-muted-foreground">Agent: {call.agentName}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-xs text-muted-foreground">Customer Emotion Timeline</p>
                    <div className="h-12">
                      <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={call.emotionTimeline.map((v, i) => ({ time: i, emotion: v }))} margin={{ top: 2, right: 2, left: 2, bottom: 2 }}>
                          <defs>
                            {(() => {
                              const timelineData = call.emotionTimeline.map((v, i) => ({ time: i, emotion: v }));
                              const maxTime = timelineData.length > 0 ? Math.max(...timelineData.map(d => d.time)) : 1;
                              
                              const getSentimentColor = (value: number) => {
                                // Red for negative (0-1.5), Yellow/Orange for neutral (1.5-3.5), Green for positive (3.5-5)
                                if (value <= 1.5) {
                                  const ratio = value / 1.5;
                                  if (ratio < 0.33) return '#dc2626'; // Dark red
                                  if (ratio < 0.66) return '#ef4444'; // Red
                                  return '#f87171'; // Light red
                                } else if (value <= 3.5) {
                                  const ratio = (value - 1.5) / 2;
                                  if (ratio < 0.33) return '#f97316'; // Orange
                                  if (ratio < 0.66) return '#fbbf24'; // Yellow-orange
                                  return '#eab308'; // Yellow
                                } else {
                                  const ratio = (value - 3.5) / 1.5;
                                  if (ratio < 0.33) return '#84cc16'; // Light green
                                  if (ratio < 0.66) return '#22c55e'; // Green
                                  return '#10b981'; // Dark green
                                }
                              };

                              // Create gradient stops at each data point
                              const lineStops = timelineData.map((point, idx) => {
                                const color = getSentimentColor(point.emotion);
                                const offset = maxTime > 0 
                                  ? (point.time / maxTime) 
                                  : (idx / Math.max(1, timelineData.length - 1));
                                
                                return {
                                  offset: Math.min(1, Math.max(0, offset)),
                                  color,
                                  opacity: 1
                                };
                              });

                              // Ensure we have stops at 0% and 100%
                              if (lineStops.length > 0) {
                                if (lineStops[0].offset > 0) {
                                  lineStops.unshift({ ...lineStops[0], offset: 0 });
                                }
                                if (lineStops[lineStops.length - 1].offset < 1) {
                                  lineStops.push({ ...lineStops[lineStops.length - 1], offset: 1 });
                                }
                              }

                              const areaStops = lineStops.map(stop => ({
                                ...stop,
                                opacity: 0.4
                              }));

                              return (
                                <>
                                  <linearGradient 
                                    id={`sentimentLineGradient-${call.callId}`} 
                                    x1="0" 
                                    y1="0" 
                                    x2="1" 
                                    y2="0"
                                  >
                                    {lineStops.map((stop, idx) => (
                                      <stop 
                                        key={idx} 
                                        offset={`${stop.offset * 100}%`} 
                                        stopColor={stop.color} 
                                        stopOpacity={stop.opacity} 
                                      />
                                    ))}
                                  </linearGradient>
                                  <linearGradient 
                                    id={`sentimentAreaGradient-${call.callId}`} 
                                    x1="0" 
                                    y1="0" 
                                    x2="1" 
                                    y2="0"
                                  >
                                    {areaStops.map((stop, idx) => (
                                      <stop 
                                        key={idx} 
                                        offset={`${stop.offset * 100}%`} 
                                        stopColor={stop.color} 
                                        stopOpacity={stop.opacity} 
                                      />
                                    ))}
                                  </linearGradient>
                                </>
                              );
                            })()}
                          </defs>
                          <Area 
                            type="monotone" 
                            dataKey="emotion" 
                            stroke={`url(#sentimentLineGradient-${call.callId})`}
                            fill={`url(#sentimentAreaGradient-${call.callId})`}
                            strokeWidth={2} 
                            dot={false}
                            isAnimationActive={false}
                          />
                        </AreaChart>
                      </ResponsiveContainer>
                    </div>
                    <p className="text-xs text-muted-foreground">Lower values = better satisfaction (0-5 scale)</p>
                  </div>
                  <div className="flex flex-wrap gap-1">
                    {call.complianceMisses.map((miss, idx) => (
                      <span key={idx} className="text-xs px-1.5 py-0.5 bg-orange-500/20 text-orange-400 rounded">
                        {miss}
                      </span>
                    ))}
                  </div>
                  <p className="text-xs text-muted-foreground line-clamp-2">{call.aiExplanation}</p>
                  <Button
                    size="sm"
                    className="w-full text-xs"
                    onClick={() => onCallClick(call.callId)}
                  >
                    Open Call
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>
      </div>
    </div>
  );
}

