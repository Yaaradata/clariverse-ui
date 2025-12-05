'use client';

import { UserX, AlertTriangle, ShieldAlert, ChevronRight } from 'lucide-react';
import { AgentCollusionRisk } from '@/lib/ecom-fraudulent';

interface AgentCollusionWatchlistProps {
  agents: AgentCollusionRisk[];
}

const getRiskLevel = (score: number) => {
  if (score >= 90) return { label: 'CRITICAL', color: 'text-red-400', bg: 'bg-red-500/20', border: 'border-red-500/40' };
  if (score >= 75) return { label: 'HIGH', color: 'text-orange-400', bg: 'bg-orange-500/20', border: 'border-orange-500/40' };
  if (score >= 60) return { label: 'MEDIUM', color: 'text-yellow-400', bg: 'bg-yellow-500/20', border: 'border-yellow-500/40' };
  return { label: 'LOW', color: 'text-blue-400', bg: 'bg-blue-500/20', border: 'border-blue-500/40' };
};

const getRiskBarColor = (score: number) => {
  if (score >= 90) return 'bg-gradient-to-r from-red-600 to-red-400';
  if (score >= 75) return 'bg-gradient-to-r from-orange-600 to-orange-400';
  if (score >= 60) return 'bg-gradient-to-r from-yellow-600 to-yellow-400';
  return 'bg-gradient-to-r from-blue-600 to-blue-400';
};

export default function AgentCollusionWatchlist({ agents }: AgentCollusionWatchlistProps) {
  const sortedAgents = [...agents].sort((a, b) => b.collusionRiskScore - a.collusionRiskScore);

  return (
    <div className="bg-[#0a0a0f] border border-purple-500/20 rounded-xl p-4 h-full flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className="p-1.5 bg-purple-500/10 rounded-lg">
            <UserX className="w-4 h-4 text-purple-400" />
          </div>
          <div>
            <h3 className="text-white font-semibold text-sm">Agent Collusion Watchlist</h3>
            <p className="text-gray-500 text-xs">Suspicious text patterns detected</p>
          </div>
        </div>
        <div className="flex items-center gap-1 px-2 py-1 bg-purple-500/10 rounded-full">
          <ShieldAlert className="w-3 h-3 text-purple-400" />
          <span className="text-purple-400 text-xs font-medium">{agents.length} Flagged</span>
        </div>
      </div>

      {/* Table */}
      <div className="flex-1 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-white/5">
                <th className="text-left py-2 px-2 text-gray-500 text-[10px] uppercase tracking-wider font-medium">Agent</th>
                <th className="text-left py-2 px-2 text-gray-500 text-[10px] uppercase tracking-wider font-medium">Risk Score</th>
                <th className="text-left py-2 px-2 text-gray-500 text-[10px] uppercase tracking-wider font-medium">Flagged Phrase</th>
                <th className="text-center py-2 px-2 text-gray-500 text-[10px] uppercase tracking-wider font-medium">OOP</th>
                <th className="text-left py-2 px-2 text-gray-500 text-[10px] uppercase tracking-wider font-medium"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {sortedAgents.map((agent) => {
                const risk = getRiskLevel(agent.collusionRiskScore);
                
                return (
                  <tr 
                    key={agent.id} 
                    className="hover:bg-white/[0.02] transition-colors cursor-pointer group"
                  >
                    <td className="py-2.5 px-2">
                      <div className="flex flex-col">
                        <span className="text-white text-xs font-medium">{agent.agentName}</span>
                        <span className="text-gray-600 text-[10px]">{agent.agentId}</span>
                      </div>
                    </td>
                    <td className="py-2.5 px-2">
                      <div className="flex flex-col gap-1">
                        <div className="flex items-center gap-2">
                          <span className={`${risk.color} text-sm font-bold`}>{agent.collusionRiskScore}</span>
                          <span className={`${risk.bg} ${risk.color} text-[9px] px-1.5 py-0.5 rounded font-medium`}>
                            {risk.label}
                          </span>
                        </div>
                        <div className="w-full h-1.5 bg-white/5 rounded-full overflow-hidden">
                          <div 
                            className={`h-full ${getRiskBarColor(agent.collusionRiskScore)} rounded-full transition-all`}
                            style={{ width: `${agent.collusionRiskScore}%` }}
                          />
                        </div>
                      </div>
                    </td>
                    <td className="py-2.5 px-2">
                      <div className="flex items-center gap-1">
                        <AlertTriangle className="w-3 h-3 text-amber-500 flex-shrink-0" />
                        <span className="text-amber-300 text-[11px] font-medium italic truncate max-w-[140px]">
                          &quot;{agent.flaggedPhrase}&quot;
                        </span>
                      </div>
                    </td>
                    <td className="py-2.5 px-2 text-center">
                      <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-red-500/10 text-red-400 text-xs font-bold">
                        {agent.outOfPolicyApprovals}
                      </span>
                    </td>
                    <td className="py-2.5 px-2">
                      <ChevronRight className="w-4 h-4 text-gray-600 group-hover:text-gray-400 transition-colors" />
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Footer Legend */}
      <div className="mt-3 pt-3 border-t border-white/5 flex items-center justify-between">
        <span className="text-gray-600 text-[10px]">OOP = Out of Policy Approvals</span>
        <div className="flex items-center gap-2">
          <span className="text-gray-600 text-[10px]">Risk:</span>
          <div className="flex items-center gap-1">
            <div className="w-2 h-2 rounded-full bg-red-500" />
            <span className="text-gray-500 text-[9px]">&gt;90</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-2 h-2 rounded-full bg-orange-500" />
            <span className="text-gray-500 text-[9px]">&gt;75</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-2 h-2 rounded-full bg-yellow-500" />
            <span className="text-gray-500 text-[9px]">&gt;60</span>
          </div>
        </div>
      </div>
    </div>
  );
}

