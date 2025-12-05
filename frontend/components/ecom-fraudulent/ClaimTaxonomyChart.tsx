'use client';

import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  Tooltip, 
  ResponsiveContainer,
  CartesianGrid
} from 'recharts';
import { Package, Lightbulb } from 'lucide-react';
import { ClaimTaxonomyItem } from '@/lib/ecom-fraudulent';

interface ClaimTaxonomyChartProps {
  data: ClaimTaxonomyItem[];
  timeSeriesData: Array<{
    time: string;
    dnr: number;
    emptyBox: number;
    wardrobing: number;
    itemSwitch: number;
  }>;
  totalSignals: number;
  peakCategory: string;
  topKeyword: string;
  aiInsight: string;
}

const COLORS = {
  dnr: '#ef4444',
  emptyBox: '#f97316',
  wardrobing: '#eab308',
  itemSwitch: '#6366f1',
};

export default function ClaimTaxonomyChart({ 
  data, 
  timeSeriesData,
  totalSignals,
  peakCategory,
  topKeyword,
  aiInsight
}: ClaimTaxonomyChartProps) {
  
  const CustomTooltip = ({ active, payload, label }: { active?: boolean; payload?: Array<{ name: string; value: number; color: string }>; label?: string }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-[#0a0a0f]/95 backdrop-blur-xl border border-white/10 rounded-lg p-3 shadow-xl">
          <p className="text-gray-400 text-xs mb-2">{label}</p>
          {payload.map((entry, index) => (
            <div key={index} className="flex items-center gap-2 text-xs">
              <div className="w-2 h-2 rounded-full" style={{ backgroundColor: entry.color }} />
              <span className="text-gray-400">{entry.name}:</span>
              <span className="text-white font-medium">{entry.value}</span>
            </div>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="bg-[#0a0a0f] border border-white/10 rounded-xl p-5 h-full flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between mb-1">
        <div className="flex items-center gap-2">
          <Package className="w-5 h-5 text-red-400" />
          <h3 className="text-white font-semibold text-base">Customer Claim Patterns</h3>
        </div>
        <div className="text-right">
          <span className="text-2xl font-bold text-white">{totalSignals.toLocaleString()}</span>
          <span className="text-gray-500 text-xs ml-1">TOTAL SIGNALS</span>
        </div>
      </div>
      <p className="text-gray-500 text-xs mb-4">Communication-derived fraud claim signals</p>

      {/* Legend */}
      <div className="flex items-center gap-4 mb-3 flex-wrap">
        <div className="flex items-center gap-1.5">
          <div className="w-2 h-2 rounded-full bg-red-500" />
          <span className="text-gray-400 text-[10px]">DNR</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-2 h-2 rounded-full bg-orange-500" />
          <span className="text-gray-400 text-[10px]">Empty Box</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-2 h-2 rounded-full bg-yellow-500" />
          <span className="text-gray-400 text-[10px]">Wardrobing</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-2 h-2 rounded-full bg-indigo-500" />
          <span className="text-gray-400 text-[10px]">Item Switch</span>
        </div>
      </div>

      {/* Chart */}
      <div className="flex-1 min-h-[160px]">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={timeSeriesData} margin={{ top: 5, right: 5, left: -20, bottom: 5 }}>
            <defs>
              <linearGradient id="dnrGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={COLORS.dnr} stopOpacity={0.3}/>
                <stop offset="95%" stopColor={COLORS.dnr} stopOpacity={0}/>
              </linearGradient>
              <linearGradient id="emptyBoxGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={COLORS.emptyBox} stopOpacity={0.3}/>
                <stop offset="95%" stopColor={COLORS.emptyBox} stopOpacity={0}/>
              </linearGradient>
              <linearGradient id="wardrobingGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={COLORS.wardrobing} stopOpacity={0.3}/>
                <stop offset="95%" stopColor={COLORS.wardrobing} stopOpacity={0}/>
              </linearGradient>
              <linearGradient id="itemSwitchGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={COLORS.itemSwitch} stopOpacity={0.3}/>
                <stop offset="95%" stopColor={COLORS.itemSwitch} stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
            <XAxis 
              dataKey="time" 
              stroke="#6b7280" 
              fontSize={9}
              axisLine={false}
              tickLine={false}
            />
            <YAxis 
              stroke="#6b7280" 
              fontSize={9}
              axisLine={false}
              tickLine={false}
            />
            <Tooltip content={<CustomTooltip />} />
            <Area type="monotone" dataKey="dnr" name="DNR" stroke={COLORS.dnr} fill="url(#dnrGrad)" strokeWidth={2} />
            <Area type="monotone" dataKey="emptyBox" name="Empty Box" stroke={COLORS.emptyBox} fill="url(#emptyBoxGrad)" strokeWidth={2} />
            <Area type="monotone" dataKey="wardrobing" name="Wardrobing" stroke={COLORS.wardrobing} fill="url(#wardrobingGrad)" strokeWidth={2} />
            <Area type="monotone" dataKey="itemSwitch" name="Item Switch" stroke={COLORS.itemSwitch} fill="url(#itemSwitchGrad)" strokeWidth={2} />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* Metrics */}
      <div className="flex items-center gap-6 mt-3 pt-3 border-t border-white/5">
        <div>
          <span className="text-gray-500 text-[10px] uppercase block">Peak Category</span>
          <span className="text-red-400 text-sm font-semibold">{peakCategory}</span>
        </div>
        <div>
          <span className="text-gray-500 text-[10px] uppercase block">Top Keyword</span>
          <span className="text-white text-sm font-medium">{topKeyword}</span>
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

