'use client';

import { useState } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Sector } from 'recharts';
import { ShieldAlert, Lightbulb, AlertTriangle } from 'lucide-react';

interface FraudCategory {
  name: string;
  value: number;
  color: string;
}

interface FraudRiskScoreProps {
  score: number;
  aiInsight: string;
  recommendation: string;
  categories?: FraudCategory[];
}

const defaultCategories: FraudCategory[] = [
  { name: 'DNR Claims', value: 20.4, color: '#FF5A5A' },
  { name: 'Empty Box', value: 16.0, color: '#F97316' },
  { name: 'Promo Abuse', value: 12.4, color: '#10B981' },
  { name: 'Agent Risk', value: 13.1, color: '#A855F7' },
  { name: 'Wardrobing', value: 10.9, color: '#3B82F6' },
];

// Active Shape for hover effect
const renderActiveShape = (props: {
  cx: number;
  cy: number;
  innerRadius: number;
  outerRadius: number;
  startAngle: number;
  endAngle: number;
  fill: string;
}) => {
  const { cx, cy, innerRadius, outerRadius, startAngle, endAngle, fill } = props;
  
  return (
    <g>
      <Sector
        cx={cx}
        cy={cy}
        innerRadius={innerRadius - 2}
        outerRadius={outerRadius + 8}
        startAngle={startAngle}
        endAngle={endAngle}
        fill={fill}
        style={{
          filter: `drop-shadow(0 0 12px ${fill}80)`,
          transition: 'all 0.3s ease-out',
        }}
      />
    </g>
  );
};

export default function FraudRiskScore({ 
  score = 72.8,
  aiInsight = 'Spike in "Empty Box" claims correlated with specific courier partner in North region. 34% of claims trace back to 3 fulfillment centers.',
  recommendation = 'Implement mandatory photo/video proof for high-value orders and deploy weight verification at handoff points.',
  categories = defaultCategories
}: FraudRiskScoreProps) {
  const [activeIndex, setActiveIndex] = useState<number | undefined>(undefined);
  const totalValue = categories.reduce((sum, cat) => sum + cat.value, 0);

  const onPieEnter = (_: unknown, index: number) => {
    setActiveIndex(index);
  };

  const onPieLeave = () => {
    setActiveIndex(undefined);
  };

  const activeCategory = activeIndex !== undefined ? categories[activeIndex] : null;

  return (
    <div className="bg-[#0a0a0f] border border-white/10 rounded-xl p-4 sm:p-5 h-full flex flex-col">
      {/* Header */}
      <div className="flex items-center gap-2 mb-1">
        <div className="p-1.5 bg-red-500/10 rounded-lg">
          <ShieldAlert className="w-4 h-4 sm:w-5 sm:h-5 text-red-400" />
        </div>
        <h3 className="text-white font-semibold text-sm sm:text-base">Fraud Risk Score</h3>
      </div>
      <p className="text-gray-500 text-[10px] sm:text-xs mb-3 sm:mb-4">Communication-Based Fraud Assessment</p>

      {/* Donut Chart */}
      <div className="relative h-40 sm:h-48 mb-2">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={categories}
              cx="50%"
              cy="50%"
              innerRadius="55%"
              outerRadius="80%"
              paddingAngle={2}
              dataKey="value"
              startAngle={90}
              endAngle={-270}
              stroke="transparent"
              activeIndex={activeIndex}
              activeShape={renderActiveShape}
              onMouseEnter={onPieEnter}
              onMouseLeave={onPieLeave}
            >
              {categories.map((entry, index) => (
                <Cell 
                  key={`cell-${index}`} 
                  fill={entry.color}
                  style={{
                    filter: activeIndex === index ? `drop-shadow(0 0 10px ${entry.color}60)` : `drop-shadow(0 0 4px ${entry.color}30)`,
                    cursor: 'pointer',
                    transition: 'all 0.3s ease-out',
                  }}
                />
              ))}
            </Pie>
          </PieChart>
        </ResponsiveContainer>

        {/* Center Score */}
        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
          <span className="text-3xl sm:text-4xl font-bold text-white tracking-tight">{score.toFixed(1)}</span>
          <span className="text-gray-500 text-[9px] sm:text-[10px] uppercase tracking-widest mt-0.5">Risk Score</span>
        </div>
      </div>

      {/* Hover Info Display */}
      <div className={`
        h-12 mb-2 rounded-lg border flex items-center justify-center
        transition-all duration-300 ease-out
        ${activeCategory 
          ? 'bg-white/5 border-white/20' 
          : 'bg-transparent border-transparent'
        }
      `}>
        {activeCategory ? (
          <div className="flex items-center gap-3 px-3 animate-in fade-in duration-200">
            <div 
              className="w-3 h-3 rounded-sm"
              style={{ backgroundColor: activeCategory.color, boxShadow: `0 0 8px ${activeCategory.color}60` }}
            />
            <span className="text-white text-sm font-semibold">{activeCategory.name}</span>
            <span className="text-gray-400 text-sm">|</span>
            <span className="text-white text-sm">
              <span className="font-bold">{activeCategory.value.toFixed(1)}</span>
              <span className="text-gray-400 text-xs ml-1">
                ({((activeCategory.value / totalValue) * 100).toFixed(1)}%)
              </span>
            </span>
          </div>
        ) : (
          <span className="text-gray-600 text-xs">Hover over chart for details</span>
        )}
      </div>

      {/* Category Legend - Responsive Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-2 gap-1.5 sm:gap-2 mb-3">
        {categories.map((category, index) => {
          const percentage = ((category.value / totalValue) * 100).toFixed(0);
          const isActive = activeIndex === index;
          
          return (
            <div 
              key={category.name}
              className={`
                flex items-center gap-2 px-2 sm:px-3 py-2 rounded-lg 
                bg-black/30 border border-transparent
                hover:bg-black/50 hover:border-white/10
                transition-all duration-200 cursor-pointer
                ${isActive ? 'bg-black/50 border-white/10 scale-[1.02]' : ''}
              `}
              onMouseEnter={() => setActiveIndex(index)}
              onMouseLeave={() => setActiveIndex(undefined)}
            >
              <div 
                className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-sm flex-shrink-0 transition-transform duration-200"
                style={{ 
                  backgroundColor: category.color,
                  boxShadow: isActive ? `0 0 8px ${category.color}60` : 'none',
                  transform: isActive ? 'scale(1.2)' : 'scale(1)',
                }}
              />
              <div className="flex-1 min-w-0">
                <span className="text-white text-[10px] sm:text-[11px] font-medium block truncate">
                  {category.name}
                </span>
                <div className="flex items-center gap-1">
                  <span className="text-gray-400 text-[9px] sm:text-[10px] font-semibold">
                    {category.value.toFixed(1)}
                  </span>
                  <span className="text-gray-600 text-[8px] sm:text-[9px]">
                    ({percentage}%)
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* AI Insight Card */}
      <div className="bg-gradient-to-r from-cyan-500/5 to-blue-500/5 border border-cyan-500/20 rounded-lg p-2.5 sm:p-3 mb-2 hover:border-cyan-500/40 transition-colors duration-200">
        <div className="flex items-start gap-2">
          <div className="p-1 bg-cyan-500/10 rounded-md mt-0.5">
            <Lightbulb className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-cyan-400" />
          </div>
          <div className="flex-1 min-w-0">
            <span className="text-cyan-400 text-[9px] sm:text-[10px] uppercase tracking-wider font-semibold block mb-1">
              AI Insight
            </span>
            <p className="text-gray-400 text-[10px] sm:text-[11px] leading-relaxed">
              {aiInsight}
            </p>
          </div>
        </div>
      </div>

      {/* Recommendation Card */}
      <div className="bg-gradient-to-r from-amber-500/5 to-orange-500/5 border border-amber-500/20 rounded-lg p-2.5 sm:p-3 mt-auto hover:border-amber-500/40 transition-colors duration-200">
        <div className="flex items-start gap-2">
          <div className="p-1 bg-amber-500/10 rounded-md mt-0.5">
            <AlertTriangle className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-amber-400" />
          </div>
          <div className="flex-1 min-w-0">
            <span className="text-amber-400 text-[9px] sm:text-[10px] uppercase tracking-wider font-semibold block mb-1">
              Recommendation
            </span>
            <p className="text-gray-400 text-[10px] sm:text-[11px] leading-relaxed">
              {recommendation}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
