'use client';

import { useState } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';
import { ShieldAlert, TrendingUp, TrendingDown, AlertCircle, IndianRupee, ShieldCheck, Target } from 'lucide-react';

interface FraudCategory {
  name: string;
  value: number;
  cases: number;
  color: string;
  riskScore?: number;
  [key: string]: string | number | undefined;
}

interface FraudRiskSnapshotProps {
  score: number;
  totalCases?: number;
  weekChange?: number;
  categories?: FraudCategory[];
  fraudSuspectedPercent?: number;
  estimatedExposure?: number;
  lossAvoided?: number;
  falsePositiveRate?: number;
}

const defaultCategories: FraudCategory[] = [
  { name: 'Fulfillment Fraud', value: 18, cases: 349, color: '#EF4444' },
  { name: 'Syndicated Claims', value: 14, cases: 274, color: '#F97316' },
  { name: 'Incentive Fraud', value: 12, cases: 212, color: '#10B981' },
  { name: 'Insider Collusion', value: 13, cases: 224, color: '#A855F7' },
  { name: 'Asset Abuse', value: 11, cases: 187, color: '#3B82F6' },
  { name: 'Brand Extortion', value: 10, cases: 156, color: '#EC4899' },
  { name: '3rd Party Fraud', value: 12, cases: 198, color: '#F59E0B' },
  { name: 'Policy Arbitrage', value: 10, cases: 147, color: '#06B6D4' },
];

export default function FraudRiskSnapshot({ 
  score = 72.8,
  totalCases = 1247,
  weekChange = 12,
  categories = defaultCategories,
  fraudSuspectedPercent = 8.4,
  estimatedExposure = 4250000,
  lossAvoided = 2180000,
  falsePositiveRate = 12.3,
}: FraudRiskSnapshotProps) {
  const [activeIndex, setActiveIndex] = useState<number | undefined>(undefined);

  const formatCurrency = (value: number) => {
    if (value >= 10000000) return `₹${(value / 10000000).toFixed(1)}Cr`;
    if (value >= 100000) return `₹${(value / 100000).toFixed(1)}L`;
    return `₹${value.toLocaleString()}`;
  };

  return (
    <div className="bg-[#0a0a0f] border border-white/10 rounded-2xl p-5 h-full flex flex-col shadow-lg shadow-black/30">
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <div className="p-1.5 bg-red-500/10 rounded-lg">
            <ShieldAlert className="w-4 h-4 text-red-400" />
          </div>
          <h3 className="text-white font-semibold text-sm">Enterprise Risk Posture</h3>
        </div>
        <div className="text-right">
          <div className="text-white text-lg font-bold">{totalCases.toLocaleString()}</div>
          <div className="text-gray-500 text-[10px] uppercase">Cases</div>
        </div>
      </div>

      {/* Compact Chart + Legend */}
      <div className="flex items-center gap-3 mb-3">
        {/* Mini Donut */}
        <div className="relative w-40 h-40 flex-shrink-0">
          <ResponsiveContainer width="100%" height="100%" minWidth={0}>
            <PieChart>
              <Pie
                data={categories}
                cx="50%"
                cy="50%"
                innerRadius="60%"
                outerRadius="90%"
                paddingAngle={2}
                dataKey="value"
                stroke="transparent"
              >
                {categories.map((entry, index) => (
                  <Cell 
                    key={`cell-${index}`} 
                    fill={entry.color}
                    onMouseEnter={() => setActiveIndex(index)}
                    onMouseLeave={() => setActiveIndex(undefined)}
                    style={{
                      filter: activeIndex === index ? `drop-shadow(0 0 6px ${entry.color})` : 'none',
                      cursor: 'pointer',
                    }}
                  />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-3xl font-bold text-white">{score.toFixed(0)}%</span>
            <span className="text-[10px] text-gray-500 uppercase">Risk Score</span>
          </div>
        </div>

        {/* Legend - full list in single column */}
        <div className="flex-1">
          <div className="grid grid-cols-1 gap-y-1">
            {categories.map((cat, idx) => (
            <div 
              key={cat.name} 
                className="flex items-center justify-between cursor-pointer hover:opacity-80"
              onMouseEnter={() => setActiveIndex(idx)}
              onMouseLeave={() => setActiveIndex(undefined)}
            >
                <div className="flex items-center gap-1.5 flex-1 min-w-0">
                  <div className="w-2 h-2 rounded-full flex-shrink-0" style={{ backgroundColor: cat.color }} />
                  <span className="text-gray-400 text-[10px] truncate ml-1">{cat.name}</span>
                </div>
                <span className="text-white text-[10px] font-medium ml-2 flex-shrink-0">{cat.riskScore !== undefined ? cat.riskScore : cat.value + '%'}</span>
            </div>
          ))}
          </div>
        </div>
      </div>


      {/* 2x2 KPI Grid */}
      <div className="grid grid-cols-2 gap-2 flex-1">
        <div className="bg-[#0d0d14] border border-white/5 rounded-lg p-2.5">
          <div className="flex items-center gap-1.5 mb-1">
            <AlertCircle className="w-3 h-3 text-orange-400" />
            <span className="text-gray-500 text-[9px] uppercase">Fraud Suspected</span>
          </div>
          <div className="text-white text-lg font-bold">{fraudSuspectedPercent}%</div>
          <div className="text-gray-500 text-[9px]">of total contacts</div>
        </div>

        <div className="bg-[#0d0d14] border border-white/5 rounded-lg p-2.5">
          <div className="flex items-center gap-1.5 mb-1">
            <IndianRupee className="w-3 h-3 text-red-400" />
            <span className="text-gray-500 text-[9px] uppercase">Est. Exposure</span>
          </div>
          <div className="text-red-400 text-lg font-bold">{formatCurrency(estimatedExposure)}</div>
          <div className="text-gray-500 text-[9px]">potential loss</div>
        </div>

        <div className="bg-[#0d0d14] border border-white/5 rounded-lg p-2.5">
          <div className="flex items-center gap-1.5 mb-1">
            <ShieldCheck className="w-3 h-3 text-green-400" />
            <span className="text-gray-500 text-[9px] uppercase">Loss Avoided</span>
          </div>
          <div className="text-green-400 text-lg font-bold">{formatCurrency(lossAvoided)}</div>
          <div className="text-gray-500 text-[9px]">saved by AI</div>
        </div>

        <div className="bg-[#0d0d14] border border-white/5 rounded-lg p-2.5">
          <div className="flex items-center gap-1.5 mb-1">
            <Target className="w-3 h-3 text-blue-400" />
            <span className="text-gray-500 text-[9px] uppercase">Customer Friction Rate</span>
          </div>
          <div className="text-blue-400 text-lg font-bold">{falsePositiveRate}%</div>
          <div className="text-gray-500 text-[9px]">AI flags genuine</div>
        </div>
      </div>
    </div>
  );
}
