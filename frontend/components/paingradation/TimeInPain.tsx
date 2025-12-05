'use client';

import { useState, useEffect } from 'react';
import { Clock, AlertCircle, TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { TimeInPainData } from '@/lib/paingradation-lib';

interface TimeInPainProps {
  data: TimeInPainData;
  isDarkMode?: boolean;
}

export function TimeInPain({ data, isDarkMode = false }: TimeInPainProps) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const TrendIcon = data.trendDirection === 'up' 
    ? TrendingUp 
    : data.trendDirection === 'down' 
    ? TrendingDown 
    : Minus;

  const trendColor = data.trendDirection === 'up' ? '#ef4444' : data.trendDirection === 'down' ? '#22c55e' : '#939394';

  const maxPercentage = Math.max(...data.buckets.map(b => b.percentage));

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
        transitionDelay: '400ms',
      }}
    >
      {/* Header */}
      <div
        className="px-5 py-4"
        style={{
          background: isDarkMode
            ? 'linear-gradient(135deg, rgba(59, 130, 246, 0.1) 0%, #0d0d0d 100%)'
            : 'linear-gradient(135deg, rgba(59, 130, 246, 0.08) 0%, #FFFFFF 100%)',
          borderBottom: `1px solid ${isDarkMode ? '#2a2a2a' : '#E5E5E5'}`,
        }}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div
              className="p-2 rounded-xl"
              style={{
                background: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)',
                boxShadow: '0 4px 12px rgba(59, 130, 246, 0.3)',
              }}
            >
              <Clock className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3
                className="text-sm font-bold"
                style={{ color: isDarkMode ? '#FFFFFF' : '#010101' }}
              >
                Time-in-Pain
              </h3>
              <p className="text-xs" style={{ color: isDarkMode ? '#939394' : '#666666' }}>
                Complaint to resolution
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="p-5">
        {/* Average Duration Display */}
        <div className="flex items-center justify-between mb-5">
          <div>
            <div className="flex items-baseline gap-1">
              <span
                className="text-4xl font-black"
                style={{ color: '#3b82f6' }}
              >
                {data.avgDays}
              </span>
              <span
                className="text-xl font-bold"
                style={{ color: isDarkMode ? '#939394' : '#666666' }}
              >
                days
              </span>
            </div>
            <p className="text-sm mt-1" style={{ color: isDarkMode ? '#CCCCCC' : '#666666' }}>
              average pain duration
            </p>
          </div>

          {/* Trend */}
          <div
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl"
            style={{
              backgroundColor: `${trendColor}15`,
              border: `1px solid ${trendColor}30`,
            }}
          >
            <TrendIcon className="w-4 h-4" style={{ color: trendColor }} />
            <span className="text-sm font-bold" style={{ color: trendColor }}>
              {data.trendDirection === 'up' ? '+' : data.trendDirection === 'down' ? '-' : ''}
              {data.trend}d
            </span>
          </div>
        </div>

        {/* Duration Buckets - Bar Chart */}
        <div className="flex items-end justify-between gap-2 h-24">
          {data.buckets.map((bucket, index) => {
            const heightPercentage = (bucket.percentage / maxPercentage) * 100;
            const isHighlighted = bucket.isHighlighted;
            const baseColor = isHighlighted ? '#ef4444' : '#3b82f6';
            
            return (
              <div key={bucket.label} className="flex-1 flex flex-col items-center">
                <div
                  className="w-full rounded-t-lg transition-all duration-1000 relative group cursor-pointer"
                  style={{
                    height: `${heightPercentage}%`,
                    minHeight: '8px',
                    backgroundColor: baseColor,
                    boxShadow: isHighlighted ? `0 0 20px ${baseColor}40` : undefined,
                    animation: isHighlighted ? 'pulse 2s infinite' : undefined,
                  }}
                >
                  {/* Tooltip */}
                  <div
                    className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 rounded text-[10px] whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity z-10"
                    style={{
                      backgroundColor: isDarkMode ? '#1a1a1a' : '#FFFFFF',
                      color: isDarkMode ? '#FFFFFF' : '#010101',
                      border: `1px solid ${isDarkMode ? '#2a2a2a' : '#E5E5E5'}`,
                      boxShadow: '0 4px 12px rgba(0,0,0,0.2)',
                    }}
                  >
                    {bucket.count.toLocaleString()} cases
                  </div>
                  {/* Percentage label */}
                  <span
                    className="absolute -top-5 left-1/2 transform -translate-x-1/2 text-[10px] font-bold"
                    style={{ color: baseColor }}
                  >
                    {bucket.percentage}%
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Bucket Labels */}
        <div className="flex justify-between gap-2 mt-2">
          {data.buckets.map((bucket) => (
            <div key={bucket.label} className="flex-1 text-center">
              <span
                className="text-[10px] font-medium"
                style={{
                  color: bucket.isHighlighted ? '#ef4444' : (isDarkMode ? '#939394' : '#666666'),
                }}
              >
                {bucket.label}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Alert Footer for Highlighted Bucket */}
      {data.buckets.some(b => b.isHighlighted) && (
        <div
          className="px-5 py-3 border-t flex items-center gap-2"
          style={{
            borderColor: isDarkMode ? '#2a2a2a' : '#E5E5E5',
            backgroundColor: isDarkMode ? 'rgba(239, 68, 68, 0.1)' : 'rgba(239, 68, 68, 0.05)',
          }}
        >
          <AlertCircle className="w-4 h-4" style={{ color: '#ef4444' }} />
          <span className="text-xs font-medium" style={{ color: '#ef4444' }}>
            {data.buckets.find(b => b.isHighlighted)?.count.toLocaleString()} cases waiting over 5 days
          </span>
        </div>
      )}
    </div>
  );
}

