'use client';

import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';
import { ShieldAlert, TrendingUp, Lightbulb, AlertTriangle, Package, UserX, Repeat, Tag } from 'lucide-react';

interface FraudCategory {
  name: string;
  value: number;
  color: string;
  icon: 'package' | 'user' | 'repeat' | 'tag';
}

interface FraudRiskScoreProps {
  score: number;
  previousScore: number;
  threshold: number;
  aiInsight: string;
  recommendation: string;
  categories?: FraudCategory[];
}

const defaultCategories: FraudCategory[] = [
  { name: 'DNR Claims', value: 35, color: '#ef4444', icon: 'package' },
  { name: 'Empty Box', value: 25, color: '#f97316', icon: 'package' },
  { name: 'Agent Risk', value: 22, color: '#a855f7', icon: 'user' },
  { name: 'Wardrobing', value: 18, color: '#6366f1', icon: 'repeat' },
];

const getIconComponent = (icon: string) => {
  switch (icon) {
    case 'package': return Package;
    case 'user': return UserX;
    case 'repeat': return Repeat;
    case 'tag': return Tag;
    default: return Package;
  }
};

export default function FraudRiskScore({ 
  score, 
  previousScore, 
  threshold,
  aiInsight,
  recommendation,
  categories = defaultCategories
}: FraudRiskScoreProps) {
  const change = score - previousScore;
  const changePercent = ((change / previousScore) * 100).toFixed(1);
  const totalValue = categories.reduce((sum, cat) => sum + cat.value, 0);
  
  const getRiskLevel = (score: number) => {
    if (score >= 75) return { label: 'CRITICAL RISK', color: 'text-red-500', bgColor: 'bg-red-500/20', borderColor: 'border-red-500/40' };
    if (score >= 60) return { label: 'ELEVATED RISK', color: 'text-orange-500', bgColor: 'bg-orange-500/20', borderColor: 'border-orange-500/40' };
    if (score >= 40) return { label: 'MODERATE RISK', color: 'text-yellow-500', bgColor: 'bg-yellow-500/20', borderColor: 'border-yellow-500/40' };
    return { label: 'LOW RISK', color: 'text-green-500', bgColor: 'bg-green-500/20', borderColor: 'border-green-500/40' };
  };

  const riskLevel = getRiskLevel(score);

  return (
    <div className="bg-[#0a0a0f] border border-white/10 rounded-xl p-5 h-full flex flex-col">
      {/* Header */}
      <div className="flex items-center gap-2 mb-2">
        <ShieldAlert className="w-5 h-5 text-red-400" />
        <h3 className="text-white font-semibold text-base">Fraud Risk Score</h3>
      </div>
      <p className="text-gray-500 text-xs mb-4">Communication-Based Fraud Assessment</p>

      {/* Donut Chart */}
      <div className="relative h-44 mb-3">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={categories}
              cx="50%"
              cy="50%"
              innerRadius={50}
              outerRadius={70}
              paddingAngle={3}
              dataKey="value"
              startAngle={90}
              endAngle={-270}
              stroke="transparent"
            >
              {categories.map((entry, index) => (
                <Cell 
                  key={`cell-${index}`} 
                  fill={entry.color}
                  style={{
                    filter: `drop-shadow(0 0 6px ${entry.color}50)`,
                  }}
                />
              ))}
            </Pie>
          </PieChart>
        </ResponsiveContainer>

        {/* Center Score */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-4xl font-bold text-white">{score.toFixed(1)}</span>
          <span className="text-gray-500 text-[10px] uppercase tracking-wider">Risk Score</span>
        </div>
      </div>

      {/* Category Legend - 2x2 Grid */}
      <div className="grid grid-cols-2 gap-2 mb-3">
        {categories.map((category) => {
          const IconComponent = getIconComponent(category.icon);
          const percentage = ((category.value / totalValue) * 100).toFixed(0);
          
          return (
            <div 
              key={category.name}
              className="flex items-center gap-2 p-2 rounded-lg bg-black/30"
            >
              <div 
                className="w-2.5 h-2.5 rounded-full flex-shrink-0"
                style={{ backgroundColor: category.color }}
              />
              <div className="flex-1 min-w-0">
                <span className="text-white text-[11px] font-medium block truncate">{category.name}</span>
                <span className="text-gray-500 text-[10px]">{percentage}%</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* AI Insight */}
      <div className="bg-[#1a1a2e]/50 border border-cyan-500/20 rounded-lg p-2.5 mb-2">
        <div className="flex items-center gap-1.5 mb-1">
          <Lightbulb className="w-3 h-3 text-cyan-400" />
          <span className="text-cyan-400 text-[9px] uppercase tracking-wider font-semibold">AI Insight</span>
        </div>
        <p className="text-gray-400 text-[11px] leading-relaxed">{aiInsight}</p>
      </div>

      {/* Recommendation */}
      <div className="bg-[#1a1a2e]/50 border border-amber-500/20 rounded-lg p-2.5 mt-auto">
        <div className="flex items-center gap-1.5 mb-1">
          <AlertTriangle className="w-3 h-3 text-amber-400" />
          <span className="text-amber-400 text-[9px] uppercase tracking-wider font-semibold">Recommendation</span>
        </div>
        <p className="text-gray-400 text-[11px] leading-relaxed">{recommendation}</p>
      </div>
    </div>
  );
}
