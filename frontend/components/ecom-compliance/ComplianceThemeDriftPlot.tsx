'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { 
  AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Label 
} from 'recharts';
import { 
  ShieldAlert, RefreshCcw, FileText, IndianRupee, Gavel, Scale, Info 
} from 'lucide-react';

export type TimeFilter = '24h' | '7d' | '30d';

export interface MicroDrift {
  name: string;
  value: number;
}

export interface DriftConfig {
  label: string;
  color: string;
  icon: React.ElementType;
  microDrifts: MicroDrift[];
}

// Configuration: Parents & Micro-Drifts
export const getDriftConfig = (filter: TimeFilter): Record<string, DriftConfig> => {
  const multiplier = filter === '24h' ? 1 : filter === '7d' ? 0.92 : 0.85;
  
  return {
    privacy: {
      label: "Privacy & Consent (DPDP)",
      color: "#f43f5e",
      icon: ShieldAlert,
      microDrifts: [
        { name: "Data Privacy / DPDP Obligation", value: Math.round(88 * multiplier) },
        { name: "PII Exposure Handling", value: Math.round(92 * multiplier) },
        { name: "Sensitive Doc Mismanagement", value: Math.round(72 * multiplier) },
        { name: "Data Retention / Deletion", value: Math.round(85 * multiplier) },
        { name: "Consent & Purpose Transparency", value: Math.round(80 * multiplier) },
      ]
    },
    refund: {
      label: "Refund / Return Obligation",
      color: "#3b82f6",
      icon: RefreshCcw,
      microDrifts: [
        { name: "Refund Eligibility Obligation", value: Math.round(85 * multiplier) },
        { name: "Return Window Exception", value: Math.round(68 * multiplier) },
        { name: "Replacement / Exchange Rule", value: Math.round(72 * multiplier) },
        { name: "Redressal Obligation", value: Math.round(70 * multiplier) },
        { name: "Escalation / Frustration Loop", value: Math.round(82 * multiplier) },
        { name: "Unresolved Loop Drift", value: Math.round(65 * multiplier) },
        { name: "Return Abuse Signal", value: Math.round(78 * multiplier) },
      ]
    },
    listing: {
      label: "Listing Accuracy",
      color: "#f97316",
      icon: FileText,
      microDrifts: [
        { name: "Listing Accuracy & Representation", value: Math.round(58 * multiplier) },
        { name: "Product Description Accuracy", value: Math.round(52 * multiplier) },
        { name: "Product Safety Communication", value: Math.round(45 * multiplier) },
        { name: "Fake / Misleading Claims", value: Math.round(62 * multiplier) },
        { name: "Seller Misconduct Comm.", value: Math.round(48 * multiplier) },
        { name: "Seller Policy Enforcement", value: Math.round(55 * multiplier) },
      ]
    },
    price: {
      label: "Price Transparency",
      color: "#eab308",
      icon: IndianRupee,
      microDrifts: [
        { name: "Price Transparency Drift", value: Math.round(68 * multiplier) },
        { name: "T&C Interpretation", value: Math.round(62 * multiplier) },
        { name: "Policy Ambiguity", value: Math.round(58 * multiplier) },
        { name: "Dark Pattern / Unfair Trade", value: Math.round(72 * multiplier) },
      ]
    },
    consumer: {
      label: "Consumer Protection",
      color: "#a855f7",
      icon: Scale,
      microDrifts: [
        { name: "CPA Alignment Drift", value: Math.round(62 * multiplier) },
        { name: "Fair Treatment Drift", value: Math.round(55 * multiplier) },
        { name: "Unfair Trade Indicators", value: Math.round(68 * multiplier) },
        { name: "Customer Harm Risk", value: Math.round(58 * multiplier) },
        { name: "Safety Obligation (non-product)", value: Math.round(48 * multiplier) },
      ]
    },
    warranty: {
      label: "Warranty & Service",
      color: "#10b981",
      icon: Gavel,
      microDrifts: [
        { name: "Warranty Obligation Drift", value: Math.round(42 * multiplier) },
        { name: "Warranty Term Miscommunication", value: Math.round(38 * multiplier) },
        { name: "Warranty Eligibility Confusion", value: Math.round(35 * multiplier) },
        { name: "Brand Warranty Clarification", value: Math.round(32 * multiplier) },
      ]
    },
  };
};

// Generate wave data based on time filter
const generateWaveData = (filter: TimeFilter) => {
  const points = filter === '24h' ? 12 : filter === '7d' ? 7 : 4;
  const labels = filter === '24h' 
    ? ['00', '02', '04', '06', '08', '10', '12', '14', '16', '18', '20', '22']
    : filter === '7d'
    ? ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
    : ['W1', 'W2', 'W3', 'W4'];

  // Wave amplitude based on time filter: 24h = very small, 7d = medium, 30d = large
  const waveAmplitude = filter === '24h' ? 2 : filter === '7d' ? 12 : 18;

  // Generate smooth wave-like data with some randomness but trending upward
  return labels.slice(0, points).map((time, i) => {
    const trend = i / points;
    const wave = Math.sin(i * 0.8) * waveAmplitude;
    
    return {
      time,
      privacy: Math.round(40 + trend * 20 + wave + Math.random() * 15),
      refund: Math.round(35 + trend * 15 + wave * 0.8 + Math.random() * 12),
      listing: Math.round(25 + trend * 10 + wave * 0.6 + Math.random() * 10),
      price: Math.round(20 + trend * 12 + wave * 0.5 + Math.random() * 8),
      consumer: Math.round(18 + trend * 8 + wave * 0.4 + Math.random() * 8),
      warranty: Math.round(12 + trend * 5 + wave * 0.3 + Math.random() * 6),
    };
  });
};

// Custom Tooltip Component with Micro-Drift Progress Bars
interface CustomTooltipProps {
  active?: boolean;
  payload?: Array<{ dataKey: string; value: number; color: string }>;
  label?: string;
  hoveredKey: string | null;
  driftConfig: Record<string, DriftConfig>;
  isDarkMode: boolean;
}

const CustomTooltip = ({ active, payload, label, hoveredKey, driftConfig, isDarkMode }: CustomTooltipProps) => {
  if (!active || !payload || payload.length === 0) return null;

  // Determine which category to show
  let activeKey = hoveredKey;
  
  if (!activeKey) {
    // Fallback: Find the data key with the highest value
    const sorted = [...payload].sort((a, b) => b.value - a.value);
    activeKey = sorted[0].dataKey;
  }

  const config = driftConfig[activeKey];
  if (!config) return null;

  const Icon = config.icon;
  const avgScore = Math.round(config.microDrifts.reduce((acc, m) => acc + m.value, 0) / config.microDrifts.length);
  
  // Sort by score descending (highest drift = worst = show first)
  const sortedMicroDrifts = [...config.microDrifts].sort((a, b) => b.value - a.value);

  return (
    <div 
      className="p-3 rounded-xl shadow-2xl backdrop-blur-md"
      style={{ 
        backgroundColor: isDarkMode ? 'rgba(9, 9, 11, 0.95)' : 'rgba(255, 255, 255, 0.98)',
        border: `1px solid ${isDarkMode ? 'rgb(39, 39, 42)' : 'rgb(228, 228, 231)'}`,
        minWidth: '480px'
      }}
    >
      {/* Header: Parent Category with Score */}
      <div 
        className="flex items-center justify-between mb-3 pb-2"
        style={{ borderBottom: `1px solid ${isDarkMode ? 'rgb(39, 39, 42)' : 'rgb(228, 228, 231)'}` }}
      >
        <div className="flex items-center gap-2">
          <div 
            className="p-1.5 rounded-lg"
            style={{ backgroundColor: `${config.color}20` }}
          >
            <Icon size={14} style={{ color: config.color }} />
          </div>
          <p 
            className="text-[11px] font-semibold"
            style={{ color: isDarkMode ? 'rgb(244, 244, 245)' : 'rgb(24, 24, 27)' }}
          >
            {config.label}
          </p>
        </div>
        <span className="text-sm font-mono font-bold" style={{ color: config.color }}>
          {avgScore}%
        </span>
      </div>

      {/* Body: Multi-Column Grid Layout */}
      <div className="grid grid-cols-2 gap-x-6 gap-y-1.5">
        {sortedMicroDrifts.map((micro) => (
          <div key={micro.name} className="flex items-center justify-between gap-3">
            <span 
              className="text-[9px] whitespace-nowrap"
              style={{ color: isDarkMode ? 'rgb(161, 161, 170)' : 'rgb(82, 82, 91)' }}
            >
              {micro.name}
            </span>
            <div className="flex items-center gap-1.5 flex-shrink-0">
              <div 
                className="w-12 h-1 rounded-full overflow-hidden"
                style={{ backgroundColor: isDarkMode ? 'rgb(39, 39, 42)' : 'rgb(228, 228, 231)' }}
              >
                <div 
                  className="h-full rounded-full"
                  style={{ 
                    width: `${micro.value}%`, 
                    backgroundColor: micro.value >= 70 ? 'rgb(239, 68, 68)' : micro.value >= 50 ? 'rgb(245, 158, 11)' : 'rgb(59, 130, 246)'
                  }} 
                />
              </div>
              <span 
                className="text-[9px] font-mono font-medium w-6 text-right"
                style={{ color: micro.value >= 70 ? 'rgb(239, 68, 68)' : micro.value >= 50 ? 'rgb(245, 158, 11)' : (isDarkMode ? 'rgb(161, 161, 170)' : 'rgb(82, 82, 91)') }}
              >
                {micro.value}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// Props interface
interface ComplianceThemeDriftPlotProps {
  onCategoryClick?: (category: string | null) => void;
  selectedCategory?: string | null;
  timeFilter?: TimeFilter;
}

// Main Component
export default function ComplianceThemeDriftPlot({ 
  onCategoryClick, 
  selectedCategory,
  timeFilter: timeFilterProp
}: ComplianceThemeDriftPlotProps) {
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [timeFilter, setTimeFilter] = useState<TimeFilter>(timeFilterProp || '24h');
  const [hoveredSeries, setHoveredSeries] = useState<string | null>(null);

  useEffect(() => {
    const checkTheme = () => {
      const theme = localStorage.getItem('theme');
      setIsDarkMode(theme === 'dark');
    };
    const checkFilter = () => {
      if (timeFilterProp) {
        setTimeFilter(timeFilterProp);
      } else {
        const filter = localStorage.getItem('ecomTimeFilter') as TimeFilter;
        if (filter) setTimeFilter(filter);
      }
    };
    
    checkTheme();
    checkFilter();
    
    const handleStorage = () => {
      checkTheme();
      if (!timeFilterProp) {
        checkFilter();
      }
    };
    window.addEventListener('storage', handleStorage);
    
    const observer = new MutationObserver(() => {
      setIsDarkMode(document.documentElement.classList.contains('dark'));
    });
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });
    
    return () => {
      window.removeEventListener('storage', handleStorage);
      observer.disconnect();
    };
  }, [timeFilterProp]);

  // Update timeFilter when prop changes
  useEffect(() => {
    if (timeFilterProp) {
      setTimeFilter(timeFilterProp);
    }
  }, [timeFilterProp]);

  const driftConfig = useMemo(() => getDriftConfig(timeFilter), [timeFilter]);
  const waveData = useMemo(() => generateWaveData(timeFilter), [timeFilter]);
  
  const totalMicroDrifts = Object.values(driftConfig).reduce((acc, d) => acc + d.microDrifts.length, 0);

  const containerBg = isDarkMode ? 'rgb(13, 13, 13)' : 'rgb(255, 255, 255)';
  const containerBorder = isDarkMode ? 'rgb(31, 31, 31)' : 'rgb(229, 231, 235)';
  const textColor = isDarkMode ? 'rgb(244, 244, 245)' : 'rgb(24, 24, 27)';
  const subtextColor = isDarkMode ? 'rgb(161, 161, 170)' : 'rgb(113, 113, 122)';
  const gridColor = isDarkMode ? 'rgb(39, 39, 42)' : 'rgb(228, 228, 231)';

  const categoryKeys = Object.keys(driftConfig);

  return (
    <div 
      className="rounded-2xl p-5 flex flex-col h-full"
      style={{ backgroundColor: containerBg, border: `1px solid ${containerBorder}` }}
    >
      {/* Header */}
      <div className="flex justify-between items-start mb-3">
        <div>
          <h3 className="text-sm font-semibold" style={{ color: textColor }}>
            Compliance Drift Trends
          </h3>
          <p className="text-[10px] mt-0.5" style={{ color: subtextColor }}>
            Wave volume = Aggregate drift signals • {totalMicroDrifts} micro-drifts tracked
          </p>
        </div>
      </div>

      {/* Top Legend - Full Categories with Scores */}
      <div 
        className="mb-4 pb-3 flex flex-wrap gap-x-4 gap-y-2"
        style={{ borderBottom: `1px solid ${containerBorder}` }}
      >
        {categoryKeys.map((key) => {
          const config = driftConfig[key];
          const avgScore = Math.round(config.microDrifts.reduce((acc, m) => acc + m.value, 0) / config.microDrifts.length);
          const Icon = config.icon;
          
          return (
            <div 
              key={key}
              className="flex items-center gap-2 cursor-pointer transition-opacity"
              style={{ opacity: hoveredSeries && hoveredSeries !== key ? 0.4 : 1 }}
              onMouseEnter={() => setHoveredSeries(key)}
              onMouseLeave={() => setHoveredSeries(null)}
            >
              <div 
                className="p-1 rounded"
                style={{ backgroundColor: `${config.color}20` }}
              >
                <Icon size={10} style={{ color: config.color }} />
              </div>
              <span className="text-[9px]" style={{ color: subtextColor }}>
                {config.label}
              </span>
              <span 
                className="text-[9px] font-mono font-semibold"
                style={{ color: config.color }}
              >
                {avgScore}%
              </span>
            </div>
          );
        })}
      </div>

      {/* Wave Chart */}
      <div 
        className="w-full flex-1"
        onMouseLeave={() => setHoveredSeries(null)}
      >
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart 
            data={waveData}
            margin={{ top: 10, right: 15, left: 10, bottom: 30 }}
          >
            <defs>
              {/* Gradients for the Waves */}
              {categoryKeys.map((key) => (
                <linearGradient key={key} id={`gradient-${key}`} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={driftConfig[key].color} stopOpacity={0.5}/>
                  <stop offset="95%" stopColor={driftConfig[key].color} stopOpacity={0.05}/>
                </linearGradient>
              ))}
            </defs>
            
            <CartesianGrid 
              strokeDasharray="3 3" 
              stroke={gridColor} 
              vertical={false} 
            />
            
            {/* X AXIS WITH LABEL */}
            <XAxis 
              dataKey="time" 
              stroke={subtextColor} 
              fontSize={9} 
              tickLine={false} 
              axisLine={false}
              dy={5}
            >
              <Label 
                value="Timeline" 
                offset={-5} 
                position="insideBottom" 
                fill={subtextColor} 
                fontSize={10} 
              />
            </XAxis>
            
            {/* Y AXIS WITH LABEL */}
            <YAxis 
              stroke={subtextColor}
              fontSize={9}
              tickLine={false}
              axisLine={false}
              domain={[0, 'auto']}
              tick={{ fill: subtextColor }}
              width={35}
            >
              <Label 
                value="Drift Score" 
                angle={-90} 
                position="insideLeft" 
                style={{ textAnchor: 'middle' }}
                fill={subtextColor} 
                fontSize={10}
                dx={-10}
              />
            </YAxis>
            
            {/* Render Areas (Waves) - in reverse order for proper stacking */}
            {[...categoryKeys].reverse().map((key) => (
              <Area
                key={key}
                type="monotone"
                dataKey={key}
                stackId="1"
                stroke={driftConfig[key].color}
                fill={`url(#gradient-${key})`}
                strokeWidth={hoveredSeries === key || selectedCategory === key ? 2.5 : 1}
                fillOpacity={(hoveredSeries && hoveredSeries !== key) || (selectedCategory && selectedCategory !== key) ? 0.3 : 1}
                onMouseEnter={() => setHoveredSeries(key)}
                onClick={() => onCategoryClick?.(selectedCategory === key ? null : key)}
                dot={false}
                activeDot={hoveredSeries === key ? { 
                  r: 5, 
                  strokeWidth: 0, 
                  fill: driftConfig[key].color,
                  cursor: 'pointer',
                  onClick: () => onCategoryClick?.(selectedCategory === key ? null : key)
                } : false}
                style={{ 
                  transition: 'all 0.2s ease',
                  cursor: 'pointer'
                }}
              />
            ))}
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* AI Insight */}
      <div 
        className="mt-3 rounded-lg p-2.5"
        style={{ 
          background: isDarkMode ? 'linear-gradient(to right, rgba(244, 63, 94, 0.1), transparent)' : 'rgba(244, 63, 94, 0.08)',
          borderLeft: '2px solid rgb(244, 63, 94)'
        }}
      >
        <p className="text-[10px] leading-relaxed" style={{ color: isDarkMode ? 'rgb(212, 212, 216)' : 'rgb(63, 63, 70)' }}>
          <span style={{ color: 'rgb(244, 63, 94)' }}>✨</span> Peak drift detected in <strong style={{ color: textColor }}>Privacy & Consent (DPDP)</strong> category. 
          PII Exposure Handling at critical threshold. Hover over waves to explore micro-drifts.
        </p>
      </div>
    </div>
  );
}
