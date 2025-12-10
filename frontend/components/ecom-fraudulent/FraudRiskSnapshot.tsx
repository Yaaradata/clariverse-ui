'use client';

import { useState, useEffect } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';
import { ShieldAlert, AlertCircle, Target, Clock, Users } from 'lucide-react';

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
  detectionRate?: number;
  avgDetectionTime?: string;
  falsePositiveRate?: number;
  activeCases?: number;
  avgCaseDays?: string;
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
  detectionRate = 87.3,
  avgDetectionTime = '1.8h',
  falsePositiveRate = 12.3,
  activeCases = 90,
  avgCaseDays = '3.2 days avg',
}: FraudRiskSnapshotProps) {
  const [activeIndex, setActiveIndex] = useState<number | undefined>(undefined);
  const [isDarkMode, setIsDarkMode] = useState(true);

  useEffect(() => {
    const checkTheme = () => {
      const theme = localStorage.getItem('theme');
      setIsDarkMode(theme === 'dark');
    };
    
    checkTheme();
    window.addEventListener('storage', checkTheme);
    
    const observer = new MutationObserver(() => {
      setIsDarkMode(document.documentElement.classList.contains('dark'));
    });
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });
    
    return () => {
      window.removeEventListener('storage', checkTheme);
      observer.disconnect();
    };
  }, []);

  const containerBg = isDarkMode ? 'rgb(13, 13, 13)' : 'rgb(255, 255, 255)';
  const containerBorder = isDarkMode ? 'rgb(31, 31, 31)' : 'rgb(229, 231, 235)';
  const textColor = isDarkMode ? 'rgb(255, 255, 255)' : 'rgb(17, 24, 39)';
  const subtextColor = isDarkMode ? 'rgb(156, 163, 175)' : 'rgb(75, 85, 99)';
  const labelColor = isDarkMode ? 'rgb(107, 114, 128)' : 'rgb(75, 85, 99)';
  const insightBg = isDarkMode ? 'rgba(0, 0, 0, 0.3)' : 'rgb(243, 244, 246)';
  const insightBorder = isDarkMode ? 'rgba(255, 255, 255, 0.05)' : 'rgb(209, 213, 219)';

  return (
    <div 
      className="rounded-xl p-5 md:p-6 h-full flex flex-col shadow-sm cursor-pointer"
      style={{ backgroundColor: containerBg, border: `1px solid ${containerBorder}` }}
    >
      {/* Header */}
      <div className="flex items-center gap-2 mb-3">
        <div 
          className="p-1.5 rounded-lg border"
          style={{ 
            backgroundColor: isDarkMode ? 'rgba(239, 68, 68, 0.125)' : 'rgba(239, 68, 68, 0.12)',
            borderColor: isDarkMode ? 'rgba(239, 68, 68, 0.3)' : 'rgba(239, 68, 68, 0.25)'
          }}
        >
          <ShieldAlert 
            className="w-4 h-4" 
            style={{ color: 'rgb(239, 68, 68)' }}
          />
        </div>
        <h3 className="font-semibold text-sm" style={{ color: textColor }}>Enterprise Risk Posture</h3>
      </div>

      {/* Chart + Legend - Centered Chart with Legend Below */}
      <div className="flex flex-col items-center gap-3 mb-3">
        {/* Centered Donut */}
        <div className="relative w-56 h-56 flex-shrink-0">
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
            <span className="text-4xl font-bold" style={{ color: textColor }}>{score.toFixed(0)}%</span>
            <span className="text-[11px] uppercase" style={{ color: subtextColor }}>Risk Score</span>
          </div>
        </div>

        {/* Legend - below chart */}
        <div className="w-full">
          <div className="grid grid-cols-1 gap-y-1">
            {categories.map((cat, idx) => (
            <div 
              key={cat.name} 
                className="flex items-center justify-between cursor-pointer"
            >
                <div className="flex items-center gap-1.5 flex-1 min-w-0">
                  <div className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ backgroundColor: cat.color }} />
                  <span className="text-xs truncate ml-1" style={{ color: subtextColor }}>{cat.name}</span>
                </div>
                <span className="text-xs font-medium ml-2 flex-shrink-0" style={{ color: textColor }}>{cat.riskScore !== undefined ? cat.riskScore : cat.value + '%'}</span>
            </div>
          ))}
          </div>
        </div>
      </div>


      {/* 2x2 KPI Grid */}
      <div className="grid grid-cols-2 gap-3 flex-1">
        {/* 1. Fraud Detection Rate */}
        <div 
          className="rounded-lg p-3 border"
          style={{ 
            backgroundColor: isDarkMode ? 'rgba(34, 197, 94, 0.05)' : 'rgba(34, 197, 94, 0.12)',
            borderColor: isDarkMode ? 'rgba(34, 197, 94, 0.3)' : 'rgba(34, 197, 94, 0.25)'
          }}
        >
          <div className="flex items-center gap-1.5 mb-1">
            <Target className="w-3 h-3" style={{ color: 'rgb(34, 197, 94)' }} />
            <span className="text-[9px] uppercase" style={{ color: labelColor }}>Fraud Detection Rate</span>
          </div>
          <div className="text-lg font-bold" style={{ color: 'rgb(34, 197, 94)' }}>{detectionRate}%</div>
          <div className="text-[9px] mt-0.5" style={{ color: subtextColor }}>AI catches {Math.round(detectionRate)}/100 fraud attempts</div>
        </div>

        {/* 2. Avg Detection Time */}
        <div 
          className="rounded-lg p-3 border"
          style={{ 
            backgroundColor: isDarkMode ? 'rgba(59, 130, 246, 0.05)' : 'rgba(59, 130, 246, 0.12)',
            borderColor: isDarkMode ? 'rgba(59, 130, 246, 0.3)' : 'rgba(59, 130, 246, 0.25)'
          }}
        >
          <div className="flex items-center gap-1.5 mb-1">
            <Clock className="w-3 h-3" style={{ color: 'rgb(59, 130, 246)' }} />
            <span className="text-[9px] uppercase" style={{ color: labelColor }}>Avg Detection Time</span>
          </div>
          <div className="text-lg font-bold" style={{ color: 'rgb(59, 130, 246)' }}>{avgDetectionTime}</div>
          <div className="text-[9px] mt-0.5" style={{ color: subtextColor }}>From claim → AI flag • ↓32% vs Q3</div>
        </div>

        {/* 3. False Positive Rate */}
        <div 
          className="rounded-lg p-3 border"
          style={{ 
            backgroundColor: isDarkMode ? 'rgba(249, 115, 22, 0.05)' : 'rgba(249, 115, 22, 0.12)',
            borderColor: isDarkMode ? 'rgba(249, 115, 22, 0.3)' : 'rgba(249, 115, 22, 0.25)'
          }}
        >
          <div className="flex items-center gap-1.5 mb-1">
            <AlertCircle className="w-3 h-3" style={{ color: 'rgb(249, 115, 22)' }} />
            <span className="text-[9px] uppercase" style={{ color: labelColor }}>False Positive Rate</span>
          </div>
          <div className="text-lg font-bold" style={{ color: 'rgb(249, 115, 22)' }}>{falsePositiveRate}%</div>
          <div className="text-[9px] mt-0.5" style={{ color: subtextColor }}>Legit customers flagged • Target &lt;10%</div>
        </div>

        {/* 4. Cases Under Review */}
        <div 
          className="rounded-lg p-3 border"
          style={{ 
            backgroundColor: isDarkMode ? 'rgba(168, 85, 247, 0.05)' : 'rgba(168, 85, 247, 0.12)',
            borderColor: isDarkMode ? 'rgba(168, 85, 247, 0.3)' : 'rgba(168, 85, 247, 0.25)'
          }}
        >
          <div className="flex items-center gap-1.5 mb-1">
            <Users className="w-3 h-3" style={{ color: 'rgb(168, 85, 247)' }} />
            <span className="text-[9px] uppercase" style={{ color: labelColor }}>Cases Under Review</span>
          </div>
          <div className="text-lg font-bold" style={{ color: 'rgb(168, 85, 247)' }}>{activeCases} active</div>
          <div className="text-[9px] mt-0.5" style={{ color: subtextColor }}>Avg resolution: {avgCaseDays}</div>
        </div>
      </div>
    </div>
  );
}
