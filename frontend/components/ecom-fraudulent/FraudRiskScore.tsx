'use client';

import { useState } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';
import { ShieldAlert, TrendingUp } from 'lucide-react';

interface FraudCategory {
  name: string;
  value: number;
  cases: number;
  color: string;
  [key: string]: string | number;
}

interface FraudRiskScoreProps {
  score: number;
  totalCases?: number;
  weekChange?: number;
  categories?: FraudCategory[];
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

export default function FraudRiskScore({ 
  score = 72.8,
  totalCases = 1247,
  weekChange = 12,
  categories = defaultCategories
}: FraudRiskScoreProps) {
  const [activeIndex, setActiveIndex] = useState<number | undefined>(undefined);

  const handleCellMouseEnter = (index: number) => {
    setActiveIndex(index);
  };

  const handleCellMouseLeave = () => {
    setActiveIndex(undefined);
  };

  return (
    <div className="bg-[#0a0a0f] border border-white/10 rounded-xl p-5 h-full flex flex-col">
      {/* Header */}
      <div className="flex items-center gap-2 mb-4">
        <div className="p-1.5 bg-red-500/10 rounded-lg">
          <ShieldAlert className="w-4 h-4 text-red-400" />
        </div>
        <h3 className="text-white font-semibold text-base">Fraud Risk Distribution</h3>
      </div>

      {/* Main Content: Legend + Chart */}
      <div className="flex items-center gap-4 flex-1">
        {/* Left: Legend */}
        <div className="flex flex-col gap-2.5">
          {categories.map((category, index) => {
            const isActive = activeIndex === index;
            return (
              <div 
                key={category.name}
                className={`flex items-center gap-2 cursor-pointer transition-all duration-200 ${isActive ? 'scale-105' : ''}`}
                onMouseEnter={() => setActiveIndex(index)}
                onMouseLeave={() => setActiveIndex(undefined)}
              >
                <div 
                  className="w-2.5 h-2.5 rounded-full flex-shrink-0"
                  style={{ 
                    backgroundColor: category.color,
                    boxShadow: isActive ? `0 0 8px ${category.color}` : 'none'
                  }}
                />
                <div className="min-w-0">
                  <span className="text-white text-sm font-medium">{category.name}</span>
                  <div className="text-gray-500 text-xs">
                    {category.value}% • {category.cases.toLocaleString()} cases
                  </div>
                </div>
        </div>
            );
          })}
      </div>

        {/* Right: Donut Chart */}
        <div className="relative flex-1 h-44">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={categories}
              cx="50%"
              cy="50%"
                innerRadius="60%"
                outerRadius="85%"
              paddingAngle={2}
              dataKey="value"
              startAngle={90}
              endAngle={-270}
              stroke="transparent"
            >
              {categories.map((entry, index) => (
                <Cell 
                  key={`cell-${index}`} 
                  fill={entry.color}
                    onMouseEnter={() => handleCellMouseEnter(index)}
                    onMouseLeave={handleCellMouseLeave}
                  style={{
                      filter: activeIndex === index ? `drop-shadow(0 0 8px ${entry.color})` : 'none',
                    cursor: 'pointer',
                      transition: 'all 0.2s ease-out',
                  }}
                />
              ))}
            </Pie>
          </PieChart>
        </ResponsiveContainer>

        {/* Center Score */}
        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
            <span className="text-3xl font-bold text-white">{score.toFixed(1)}</span>
            <span className="text-gray-500 text-[10px] uppercase tracking-wider">Risk Score</span>
          </div>
        </div>
      </div>

      {/* Bottom Stats */}
      <div className="grid grid-cols-3 gap-3 mt-4 pt-4 border-t border-white/10">
        <div className="text-center">
          <div className="text-white text-xl font-bold">{totalCases.toLocaleString()}</div>
          <div className="text-gray-500 text-[10px] uppercase tracking-wider">Total Cases</div>
        </div>
        <div className="text-center">
          <div className="text-white text-xl font-bold">{score.toFixed(1)}</div>
          <div className="text-gray-500 text-[10px] uppercase tracking-wider">Risk Score</div>
          </div>
        <div className="text-center">
          <div className="flex items-center justify-center gap-1">
            <TrendingUp className="w-4 h-4 text-emerald-400" />
            <span className="text-emerald-400 text-xl font-bold">+{weekChange}%</span>
          </div>
          <div className="text-gray-500 text-[10px] uppercase tracking-wider">VS Last Week</div>
        </div>
      </div>
    </div>
  );
}
