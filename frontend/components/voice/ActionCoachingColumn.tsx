'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { AgentPerformance, SkillGapData } from '@/lib/voiceData';
import { AlertCircle, User } from 'lucide-react';

interface ActionCoachingColumnProps {
  agentsNeedingAttention: AgentPerformance[];
  agentLeaderboard?: AgentPerformance[]; // Kept for backward compatibility with other voice pages
  skillGapData: SkillGapData[];
  dateRange?: {
    start: string;
    end: string;
  };
  onAgentClick: (agentId: string) => void;
}

export function ActionCoachingColumn({
  agentsNeedingAttention,
  skillGapData,
  onAgentClick
}: ActionCoachingColumnProps) {
  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'text-red-500 bg-red-500/20 border-red-500/30';
      case 'high': return 'text-orange-500 bg-orange-500/20 border-orange-500/30';
      case 'medium': return 'text-yellow-500 bg-yellow-500/20 border-yellow-500/30';
      default: return 'text-blue-500 bg-blue-500/20 border-blue-500/30';
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 90) return 'text-green-500';
    if (score >= 75) return 'text-yellow-500';
    return 'text-red-500';
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 w-full">
      {/* Agents Needing Attention */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <AlertCircle className="w-5 h-5 text-orange-500" />
            Agents Needing Attention
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 max-h-[340px] overflow-y-auto">
          {agentsNeedingAttention.filter(a => a.severity !== 'low').map((agent) => (
            <Card
              key={agent.agentId}
              className={`p-3 border ${getSeverityColor(agent.severity)} cursor-pointer hover:opacity-80 transition-opacity`}
              onClick={() => onAgentClick(agent.agentId)}
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <User className="w-4 h-4" />
                    <span className="text-sm font-semibold text-white">{agent.agentName}</span>
                  </div>
                  <span className={`text-xs px-2 py-0.5 rounded ${getSeverityColor(agent.severity)}`}>
                    {agent.severity.toUpperCase()}
                  </span>
                </div>
                <p className="text-xs text-muted-foreground">QA Score: <span className={getScoreColor(agent.qaScore)}>{agent.qaScore.toFixed(1)}%</span></p>
                {agent.issues.length > 0 && (
                  <div className="space-y-1">
                    <p className="text-xs text-muted-foreground">Last 3 Issues:</p>
                    <ul className="space-y-0.5">
                      {agent.issues.slice(0, 3).map((issue, idx) => (
                        <li key={idx} className="text-xs text-white flex items-center gap-1">
                          <span className="w-1 h-1 bg-orange-500 rounded-full" />
                          {issue}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </Card>
          ))}
        </CardContent>
      </Card>

      {/* Team Skill Gap Matrix */}
      <Card className="flex flex-col overflow-hidden max-h-[420px]">
        <CardHeader className="py-3">
          <CardTitle className="text-base">Team Skill Gap Matrix</CardTitle>
          <p className="text-xs text-muted-foreground mt-0.5">
            Current vs target. Training needed where gaps exist.
          </p>
        </CardHeader>
        <CardContent className="flex-1 min-h-0 flex flex-col overflow-hidden py-3 pt-0">
          <div className="flex-shrink-0">
            {/* Legend */}
            <div className="flex items-center gap-4 text-xs">
              <div className="flex items-center gap-2">
                <div className="w-6 h-2 rounded bg-gradient-to-r from-[#b90abd] to-[#5332ff]"></div>
                <span className="text-muted-foreground">Current</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-6 h-2 rounded bg-gray-600"></div>
                <span className="text-muted-foreground">Target</span>
              </div>
            </div>
          </div>

          {/* Skills List - scrollbar */}
          <div className="space-y-2 flex-1 min-h-0 max-h-[280px] overflow-y-auto pr-2 mt-3">
              {skillGapData.map((skill, idx) => {
                const gap = skill.expected - skill.current;
                const gapPercent = (gap / skill.expected) * 100;
                const currentPercent = (skill.current / skill.expected) * 100;
                const isCritical = gapPercent > 10;
                const isModerate = gapPercent > 5 && gapPercent <= 10;
                
                return (
                  <div key={idx} className="space-y-1.5 p-2 bg-white/5 rounded-lg border border-white/10 hover:border-white/20 transition-colors">
                    <div className="flex items-center justify-between gap-2">
                      <p className="text-xs font-semibold text-white">{skill.skill}</p>
                      <span className="text-xs font-bold text-white shrink-0">{skill.current}<span className="text-muted-foreground">/{skill.expected}</span> <span className="text-muted-foreground">({currentPercent.toFixed(0)}%)</span></span>
                    </div>
                    
                    {/* Progress Bars */}
                    <div className="space-y-1">
                      <div>
                        <div className="h-2 bg-gray-800 rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-gradient-to-r from-[#b90abd] to-[#5332ff] transition-all" 
                            style={{ width: `${currentPercent}%` }} 
                          />
                        </div>
                      </div>
                    </div>

                    {/* Gap Information */}
                    {gap > 0 && (
                      <div className={`pt-1 border-t border-white/10 ${isCritical ? 'bg-red-500/10' : isModerate ? 'bg-orange-500/10' : 'bg-yellow-500/10'} rounded px-2 py-1`}>
                        <div className="flex items-center gap-2">
                          {isCritical && <span className="text-red-400 text-xs">🔴</span>}
                          {isModerate && <span className="text-orange-400 text-xs">🟡</span>}
                          {!isCritical && !isModerate && <span className="text-yellow-400 text-xs">🟢</span>}
                          <span className="text-xs text-white">
                            Gap {gap.toFixed(0)} pts ({gapPercent.toFixed(0)}% below)
                          </span>
                        </div>
                      </div>
                    )}
                    {gap === 0 && (
                      <div className="pt-1 border-t border-white/10 bg-green-500/10 rounded px-2 py-1">
                        <span className="text-xs font-semibold text-green-400">✓ Target achieved</span>
                      </div>
                    )}
                  </div>
                );
              })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

