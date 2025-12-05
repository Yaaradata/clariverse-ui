'use client';

import { 
  Radar, 
  RadarChart, 
  PolarGrid, 
  PolarAngleAxis, 
  PolarRadiusAxis,
  ResponsiveContainer,
  Tooltip
} from 'recharts';
import { UserX, Lightbulb } from 'lucide-react';

interface AgentRiskRadarProps {
  data: Array<{
    category: string;
    value: number;
    fullMark: number;
  }>;
  overallScore: number;
  riskLevel: string;
  topRiskAgent: string;
  activeVectors: number;
  aiInsight: string;
}

export default function AgentRiskRadar({ 
  data, 
  overallScore,
  riskLevel,
  topRiskAgent,
  activeVectors,
  aiInsight
}: AgentRiskRadarProps) {
  
  const getRiskColor = (level: string) => {
    switch (level.toLowerCase()) {
      case 'critical': return 'text-red-500';
      case 'high': return 'text-orange-500';
      case 'medium': return 'text-yellow-500';
      default: return 'text-green-500';
    }
  };

  return (
    <div className="bg-[#0a0a0f] border border-white/10 rounded-xl p-5 h-full flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between mb-1">
        <div className="flex items-center gap-2">
          <UserX className="w-5 h-5 text-purple-400" />
          <h3 className="text-white font-semibold text-base">Agent Risk Radar</h3>
        </div>
        <div className="text-right">
          <span className="text-2xl font-bold text-white">{overallScore}</span>
          <span className="text-gray-500 text-xs">/100</span>
          <p className={`text-xs font-semibold ${getRiskColor(riskLevel)}`}>{riskLevel.toUpperCase()} RISK</p>
        </div>
      </div>
      <p className="text-gray-500 text-xs mb-4">Agent behavior patterns from communications</p>

      {/* Radar Chart */}
      <div className="flex-1 min-h-[200px]">
        <ResponsiveContainer width="100%" height="100%">
          <RadarChart cx="50%" cy="50%" outerRadius="70%" data={data}>
            <PolarGrid stroke="rgba(255,255,255,0.1)" />
            <PolarAngleAxis 
              dataKey="category" 
              tick={{ fill: '#9ca3af', fontSize: 10 }}
              stroke="rgba(255,255,255,0.1)"
            />
            <PolarRadiusAxis 
              angle={30} 
              domain={[0, 100]} 
              tick={{ fill: '#6b7280', fontSize: 8 }}
              stroke="rgba(255,255,255,0.05)"
            />
            <Radar
              name="Risk Level"
              dataKey="value"
              stroke="#a855f7"
              fill="#a855f7"
              fillOpacity={0.3}
              strokeWidth={2}
            />
            <Tooltip 
              contentStyle={{
                backgroundColor: 'rgba(10, 10, 15, 0.95)',
                border: '1px solid rgba(255,255,255,0.1)',
                borderRadius: '8px',
                fontSize: '12px',
              }}
              itemStyle={{ color: '#a855f7' }}
            />
          </RadarChart>
        </ResponsiveContainer>
      </div>

      {/* Metrics */}
      <div className="flex items-center gap-6 mt-3 pt-3 border-t border-white/5">
        <div>
          <span className="text-gray-500 text-[10px] uppercase block">Top Risk Agent</span>
          <span className="text-purple-400 text-sm font-semibold">{topRiskAgent}</span>
        </div>
        <div>
          <span className="text-gray-500 text-[10px] uppercase block">Active Vectors</span>
          <span className="text-white text-sm font-medium">{activeVectors} Risk Areas</span>
        </div>
      </div>

      {/* AI Insight */}
      <div className="bg-[#1a1a2e]/50 border border-cyan-500/20 rounded-lg p-3 mt-3">
        <div className="flex items-start gap-2">
          <Lightbulb className="w-4 h-4 text-cyan-400 flex-shrink-0 mt-0.5" />
          <div>
            <span className="text-cyan-400 text-[10px] uppercase tracking-wider font-semibold">AI Insight</span>
            <p className="text-gray-400 text-xs mt-1 leading-relaxed">{aiInsight}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

