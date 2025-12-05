'use client';

import { useState, useEffect } from 'react';
import { RefreshCw, TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { RepeatContactRateData, formatNumber } from '@/lib/paingradation-lib';

interface RepeatContactRateProps {
  data: RepeatContactRateData;
  isDarkMode?: boolean;
}

export function RepeatContactRate({ data, isDarkMode = false }: RepeatContactRateProps) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const maxTrend = Math.max(...data.trendlineData);
  const minTrend = Math.min(...data.trendlineData);
  const range = maxTrend - minTrend || 1;

  // Generate smooth curve path
  const trendPoints = data.trendlineData.map((value, index) => {
    const x = (index / (data.trendlineData.length - 1)) * 100;
    const y = 45 - ((value - minTrend) / range) * 40;
    return { x, y };
  });

  // Create bezier curve
  const pathD = trendPoints.reduce((path, point, index) => {
    if (index === 0) return `M ${point.x},${point.y}`;
    const prev = trendPoints[index - 1];
    const cpx1 = prev.x + (point.x - prev.x) / 2;
    const cpx2 = prev.x + (point.x - prev.x) / 2;
    return `${path} C ${cpx1},${prev.y} ${cpx2},${point.y} ${point.x},${point.y}`;
  }, '');

  const TrendIcon = data.trendDirection === 'up' 
    ? TrendingUp 
    : data.trendDirection === 'down' 
    ? TrendingDown 
    : Minus;

  const trendColor = data.trendDirection === 'up' ? '#ef4444' : data.trendDirection === 'down' ? '#22c55e' : '#939394';

  return (
    <div
      className={`rounded-2xl overflow-hidden transition-all duration-700 ${
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
      }`}
      style={{
        backgroundColor: isDarkMode ? '#0d0d0d' : '#FFFFFF',
        border: `1px solid ${isDarkMode ? '#2a2a2a' : '#E5E5E5'}`,
        boxShadow: isDarkMode
          ? '0 4px 24px rgba(0, 0, 0, 0.4)'
          : '0 4px 24px rgba(0, 0, 0, 0.06)',
        transitionDelay: '300ms',
      }}
    >
      {/* Header */}
      <div
        className="px-5 py-4"
        style={{
          background: isDarkMode
            ? 'linear-gradient(135deg, rgba(168, 85, 247, 0.1) 0%, #0d0d0d 100%)'
            : 'linear-gradient(135deg, rgba(168, 85, 247, 0.08) 0%, #FFFFFF 100%)',
          borderBottom: `1px solid ${isDarkMode ? '#2a2a2a' : '#E5E5E5'}`,
        }}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div
              className="p-2 rounded-xl"
              style={{
                background: 'linear-gradient(135deg, #a855f7 0%, #9333ea 100%)',
                boxShadow: '0 4px 12px rgba(168, 85, 247, 0.3)',
              }}
            >
              <RefreshCw className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3
                className="text-sm font-bold"
                style={{ color: isDarkMode ? '#FFFFFF' : '#010101' }}
              >
                Repeat Contact Rate
              </h3>
              <p className="text-xs" style={{ color: isDarkMode ? '#939394' : '#666666' }}>
                Order-level 2+ contacts
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="p-5">
        <div className="flex items-center justify-between mb-4">
          <div>
            <div className="flex items-baseline gap-1">
              <span
                className="text-4xl font-black"
                style={{ color: '#a855f7' }}
              >
                {data.percentage}%
              </span>
            </div>
            <p className="text-sm mt-1" style={{ color: isDarkMode ? '#CCCCCC' : '#666666' }}>
              {formatNumber(data.ordersAffected)} orders
            </p>
          </div>

          {/* Trend Badge */}
          <div
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl"
            style={{
              backgroundColor: `${trendColor}15`,
              border: `1px solid ${trendColor}30`,
            }}
          >
            <TrendIcon className="w-4 h-4" style={{ color: trendColor }} />
            <span className="text-sm font-bold" style={{ color: trendColor }}>
              {data.trendDirection === 'up' ? '↑' : data.trendDirection === 'down' ? '↓' : ''} {data.trend}%
            </span>
          </div>
        </div>

        {/* Trend Line Chart */}
        <div className="h-16 mt-4">
          <svg viewBox="0 0 100 50" className="w-full h-full" preserveAspectRatio="none">
            <defs>
              <linearGradient id="repeatGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#a855f7" stopOpacity="0.3" />
                <stop offset="100%" stopColor="#a855f7" stopOpacity="0" />
              </linearGradient>
            </defs>
            {/* Fill area */}
            <path
              d={`${pathD} L 100,50 L 0,50 Z`}
              fill="url(#repeatGradient)"
            />
            {/* Line */}
            <path
              d={pathD}
              fill="none"
              stroke="#a855f7"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            {/* End dot */}
            <circle
              cx={trendPoints[trendPoints.length - 1].x}
              cy={trendPoints[trendPoints.length - 1].y}
              r="4"
              fill="#a855f7"
              stroke={isDarkMode ? '#0d0d0d' : '#FFFFFF'}
              strokeWidth="2"
            />
          </svg>
        </div>

        {/* Period labels */}
        <div className="flex justify-between mt-2">
          <span className="text-[10px]" style={{ color: isDarkMode ? '#939394' : '#666666' }}>10 days ago</span>
          <span className="text-[10px]" style={{ color: isDarkMode ? '#939394' : '#666666' }}>Today</span>
        </div>
      </div>
    </div>
  );
}

