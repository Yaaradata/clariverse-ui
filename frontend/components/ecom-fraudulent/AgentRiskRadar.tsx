'use client';

import { useState } from 'react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  ResponsiveContainer,
  Cell,
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

const getBarColor = (value: number) => {
  if (value >= 80) return '#ef4444'; // red
  if (value >= 60) return '#f97316'; // orange
  if (value >= 40) return '#eab308'; // yellow
  return '#22c55e'; // green
};

const CustomTooltip = ({ 
  active, 
  payload 
}: { 
  active?: boolean; 
  payload?: Array<{ payload: { category: string; value: number } }>;
}) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <div className="bg-[#1a1a2e]/95 backdrop-blur-xl border border-white/20 rounded-lg px-3 py-2 shadow-xl">
        <p className="text-white text-sm font-semibold">{data.category}</p>
        <p className="text-gray-300 text-xs mt-1">
          Risk Score: <span className="text-white font-bold">{data.value}</span>/100
        </p>
      </div>
    );
  }
  return null;
};

export default function AgentRiskRadar({ 
  data, 
  overallScore,
  riskLevel,
  topRiskAgent,
  activeVectors,
  aiInsight
}: AgentRiskRadarProps) {
  const [activeIndex, setActiveIndex] = useState<number | undefined>(undefined);
  
  const getRiskColor = (level: string) => {
    switch (level.toLowerCase()) {
      case 'critical': return 'text-red-500';
      case 'high': return 'text-orange-500';
      case 'medium': return 'text-yellow-500';
      default: return 'text-green-500';
    }
  };

  const getRiskBadgeColor = (level: string) => {
    switch (level.toLowerCase()) {
      case 'critical': return 'bg-red-500/20 text-red-400 border-red-500/40';
      case 'high': return 'bg-orange-500/20 text-orange-400 border-orange-500/40';
      case 'medium': return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/40';
      default: return 'bg-green-500/20 text-green-400 border-green-500/40';
    }
  };

  // Sort data by value descending for better visualization
  const sortedData = [...data].sort((a, b) => b.value - a.value);

  return (
    <div className="bg-[#0a0a0f] border border-white/10 rounded-xl p-5 h-full flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between mb-1">
        <div className="flex items-center gap-2">
          <div className="p-1.5 bg-purple-500/10 rounded-lg">
            <UserX className="w-4 h-4 text-purple-400" />
          </div>
          <h3 className="text-white font-semibold text-base">Insider Collusion Detection</h3>
        </div>
        <div className="text-right">
          <div className="flex items-baseline gap-1">
            <span className="text-2xl font-bold text-white">{overallScore}</span>
            <span className="text-gray-500 text-xs">/100</span>
          </div>
          <span className={`text-[10px] font-semibold px-2 py-0.5 rounded border ${getRiskBadgeColor(riskLevel)}`}>
            {riskLevel.toUpperCase()} RISK
          </span>
        </div>
      </div>
      <p className="text-gray-500 text-xs mb-4">Agent behavior patterns from communications</p>

      {/* Bar Chart */}
      <div className="flex-1 min-h-[200px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart 
            data={sortedData} 
            layout="vertical" 
            margin={{ top: 5, right: 20, left: 0, bottom: 5 }}
          >
            <XAxis 
              type="number" 
              domain={[0, 100]} 
              axisLine={false}
              tickLine={false}
              tick={{ fill: '#6b7280', fontSize: 10 }}
              tickCount={5}
            />
            <YAxis 
              type="category" 
              dataKey="category" 
              axisLine={false}
              tickLine={false}
              tick={{ fill: '#9ca3af', fontSize: 10 }}
              width={90}
            />
            <Tooltip 
              content={<CustomTooltip />}
              cursor={{ fill: 'rgba(255,255,255,0.02)' }}
            />
            <Bar 
              dataKey="value" 
              radius={[0, 4, 4, 0]}
              onMouseEnter={(_, index) => setActiveIndex(index)}
              onMouseLeave={() => setActiveIndex(undefined)}
            >
              {sortedData.map((entry, index) => (
                <Cell 
                  key={`cell-${index}`}
                  fill={getBarColor(entry.value)}
                  style={{
                    filter: activeIndex === index ? `drop-shadow(0 0 8px ${getBarColor(entry.value)}60)` : 'none',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease-out',
                    opacity: activeIndex !== undefined && activeIndex !== index ? 0.5 : 1,
                  }}
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Risk Level Legend */}
      <div className="flex items-center justify-center gap-4 mt-2 mb-3">
        <div className="flex items-center gap-1.5">
          <div className="w-2 h-2 rounded-full bg-red-500" />
          <span className="text-gray-500 text-[9px]">Critical (80+)</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-2 h-2 rounded-full bg-orange-500" />
          <span className="text-gray-500 text-[9px]">High (60+)</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-2 h-2 rounded-full bg-yellow-500" />
          <span className="text-gray-500 text-[9px]">Medium (40+)</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-2 h-2 rounded-full bg-green-500" />
          <span className="text-gray-500 text-[9px]">Low</span>
        </div>
      </div>

      {/* Metrics */}
      <div className="flex items-center gap-6 pt-3 border-t border-white/5">
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
      <div className="bg-gradient-to-r from-cyan-500/5 to-blue-500/5 border border-cyan-500/20 rounded-lg p-3 mt-3 hover:border-cyan-500/40 transition-colors duration-200">
        <div className="flex items-start gap-2">
          <div className="p-1 bg-cyan-500/10 rounded-md mt-0.5">
            <Lightbulb className="w-3.5 h-3.5 text-cyan-400" />
          </div>
          <div>
            <span className="text-cyan-400 text-[10px] uppercase tracking-wider font-semibold">AI Insight</span>
            <p className="text-gray-400 text-xs mt-1 leading-relaxed">{aiInsight}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
