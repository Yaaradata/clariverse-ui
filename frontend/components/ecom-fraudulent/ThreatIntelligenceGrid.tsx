'use client';

import { ShieldAlert, Scale, Twitter, Clock, TrendingUp, TrendingDown, Minus, AlertTriangle, Lightbulb } from 'lucide-react';

interface ThreatCategory {
  id: string;
  title: string;
  status: 'CRITICAL' | 'WARNING' | 'STABLE' | 'LOW';
  count: number;
  trend: number; // percentage change
  subLabel: string;
  icon: 'legal' | 'social' | 'urgency' | 'abuse';
}

interface ThreatIntelligenceGridProps {
  categories: ThreatCategory[];
  overallStatus: 'AT RISK' | 'ELEVATED' | 'STABLE';
  aiInsight: string;
}

const getIconComponent = (icon: string) => {
  switch (icon) {
    case 'legal': return Scale;
    case 'social': return Twitter;
    case 'urgency': return Clock;
    case 'abuse': return ShieldAlert;
    default: return ShieldAlert;
  }
};

const getStatusColors = (status: string) => {
  switch (status) {
    case 'CRITICAL':
      return {
        badge: 'bg-red-500/20 text-red-400 border-red-500/40',
        iconBg: 'bg-red-500/10',
        iconColor: 'text-red-400',
      };
    case 'WARNING':
      return {
        badge: 'bg-orange-500/20 text-orange-400 border-orange-500/40',
        iconBg: 'bg-orange-500/10',
        iconColor: 'text-orange-400',
      };
    case 'STABLE':
      return {
        badge: 'bg-green-500/20 text-green-400 border-green-500/40',
        iconBg: 'bg-green-500/10',
        iconColor: 'text-green-400',
      };
    default:
      return {
        badge: 'bg-blue-500/20 text-blue-400 border-blue-500/40',
        iconBg: 'bg-blue-500/10',
        iconColor: 'text-blue-400',
      };
  }
};

const getOverallStatusColors = (status: string) => {
  switch (status) {
    case 'AT RISK':
      return 'bg-red-500/20 text-red-400 border-red-500/40';
    case 'ELEVATED':
      return 'bg-orange-500/20 text-orange-400 border-orange-500/40';
    default:
      return 'bg-green-500/20 text-green-400 border-green-500/40';
  }
};

const getTrendIcon = (trend: number) => {
  if (trend > 0) return <TrendingUp className="w-3 h-3 text-red-400" />;
  if (trend < 0) return <TrendingDown className="w-3 h-3 text-green-400" />;
  return <Minus className="w-3 h-3 text-gray-400" />;
};

const getTrendColor = (trend: number) => {
  if (trend > 0) return 'text-red-400';
  if (trend < 0) return 'text-green-400';
  return 'text-gray-400';
};

export default function ThreatIntelligenceGrid({ 
  categories, 
  overallStatus,
  aiInsight
}: ThreatIntelligenceGridProps) {
  return (
    <div className="bg-[#0a0a0f] border border-white/10 rounded-xl p-5 h-full flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between mb-1">
        <div className="flex items-center gap-2">
          <AlertTriangle className="w-5 h-5 text-rose-400" />
          <h3 className="text-white font-semibold text-base">Adversarial Pressure Index</h3>
        </div>
        <span className={`text-xs font-semibold px-2.5 py-1 rounded border ${getOverallStatusColors(overallStatus)}`}>
          {overallStatus}
        </span>
      </div>
      <p className="text-gray-500 text-xs mb-4">Coercion &amp; social engineering status grid</p>

      {/* 2x2 Grid */}
      <div className="grid grid-cols-2 gap-3 flex-1">
        {categories.map((category) => {
          const colors = getStatusColors(category.status);
          const IconComponent = getIconComponent(category.icon);
          
          return (
            <div 
              key={category.id}
              className="bg-[#0d0d14] border border-white/5 rounded-lg p-3 hover:border-white/10 transition-all cursor-pointer"
            >
              {/* Category Header */}
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <div className={`p-1.5 rounded-lg ${colors.iconBg}`}>
                    <IconComponent className={`w-3.5 h-3.5 ${colors.iconColor}`} />
                  </div>
                  <span className="text-white text-xs font-medium">{category.title}</span>
                </div>
                <span className={`text-[9px] px-1.5 py-0.5 rounded border font-semibold ${colors.badge}`}>
                  {category.status}
                </span>
              </div>

              {/* Count and Trend */}
              <div className="flex items-end justify-between">
                <div>
                  <span className="text-2xl font-bold text-white">{category.count}</span>
                  <span className="text-gray-500 text-xs ml-1">reports</span>
                </div>
                <div className="flex items-center gap-1">
                  {getTrendIcon(category.trend)}
                  <span className={`text-xs font-medium ${getTrendColor(category.trend)}`}>
                    {category.trend > 0 ? '+' : ''}{category.trend}%
                  </span>
                </div>
              </div>

              {/* Sub Label */}
              <p className="text-gray-500 text-[10px] mt-1.5">{category.subLabel}</p>
            </div>
          );
        })}
      </div>

      {/* AI Insight */}
      <div className="bg-[#1a1a2e]/50 border border-cyan-500/20 rounded-lg p-2.5 mt-3">
        <div className="flex items-start gap-2">
          <Lightbulb className="w-3.5 h-3.5 text-cyan-400 flex-shrink-0 mt-0.5" />
          <div>
            <span className="text-cyan-400 text-[9px] uppercase tracking-wider font-semibold">AI Insight</span>
            <p className="text-gray-400 text-[10px] mt-0.5 leading-relaxed">{aiInsight}</p>
          </div>
        </div>
      </div>

      {/* Recent Coercion Phrases */}
      <div className="mt-3 pt-3 border-t border-white/5">
        <span className="text-gray-500 text-[9px] uppercase tracking-wider">Recent Coercion Phrases</span>
        <ul className="mt-1.5 space-y-1">
          <li className="text-gray-400 text-[10px] flex items-start gap-1.5">
            <span className="text-red-400">•</span>
            &quot;I will file Consumer Forum case tomorrow...&quot;
          </li>
          <li className="text-gray-400 text-[10px] flex items-start gap-1.5">
            <span className="text-orange-400">•</span>
            &quot;My 50K Twitter followers will destroy you...&quot;
          </li>
          <li className="text-gray-400 text-[10px] flex items-start gap-1.5">
            <span className="text-yellow-400">•</span>
            &quot;Flight in 2 hours, refund NOW or else...&quot;
          </li>
        </ul>
      </div>
    </div>
  );
}

