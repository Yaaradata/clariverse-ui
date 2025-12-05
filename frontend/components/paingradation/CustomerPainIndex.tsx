'use client';

import { useState, useEffect } from 'react';
import { TrendingUp, TrendingDown, Minus, Activity } from 'lucide-react';
import { CustomerPainIndexData, getPainLevelColor } from '@/lib/paingradation-lib';

interface CustomerPainIndexProps {
  data: CustomerPainIndexData;
  isDarkMode?: boolean;
}

export function CustomerPainIndex({ data, isDarkMode = false }: CustomerPainIndexProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [animatedScore, setAnimatedScore] = useState(0);

  useEffect(() => {
    setIsVisible(true);
    // Animate score
    const duration = 1500;
    const steps = 60;
    const increment = data.score / steps;
    let current = 0;
    const timer = setInterval(() => {
      current += increment;
      if (current >= data.score) {
        setAnimatedScore(data.score);
        clearInterval(timer);
      } else {
        setAnimatedScore(Math.floor(current));
      }
    }, duration / steps);
    return () => clearInterval(timer);
  }, [data.score]);

  const colorConfig = getPainLevelColor(data.score);
  const gaugePercentage = (data.score / 100) * 100;

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
      }}
    >
      {/* Header */}
      <div
        className="px-5 py-4"
        style={{
          background: isDarkMode
            ? `linear-gradient(135deg, ${colorConfig.bg}15 0%, #0d0d0d 100%)`
            : `linear-gradient(135deg, ${colorConfig.bg}10 0%, #FFFFFF 100%)`,
          borderBottom: `1px solid ${isDarkMode ? '#2a2a2a' : '#E5E5E5'}`,
        }}
      >
        <div className="flex items-center gap-3">
          <div
            className="p-2 rounded-xl"
            style={{
              background: `linear-gradient(135deg, ${colorConfig.bg} 0%, ${colorConfig.bg}CC 100%)`,
              boxShadow: `0 4px 12px ${colorConfig.glow}`,
            }}
          >
            <Activity className="w-5 h-5 text-white" />
          </div>
          <div>
            <h3
              className="text-sm font-bold"
              style={{ color: isDarkMode ? '#FFFFFF' : '#010101' }}
            >
              Customer Pain Index
            </h3>
            <p className="text-xs" style={{ color: isDarkMode ? '#939394' : '#666666' }}>
              Composite health score
            </p>
          </div>
        </div>
      </div>

      {/* Gauge Section */}
      <div className="p-6">
        <div className="flex flex-col items-center">
          {/* SVG Gauge */}
          <div className="relative w-40 h-24 mb-4">
            <svg viewBox="0 0 160 90" className="w-full h-full">
              {/* Background arc */}
              <path
                d="M 10 80 A 70 70 0 0 1 150 80"
                fill="none"
                stroke={isDarkMode ? '#2a2a2a' : '#E5E5E5'}
                strokeWidth="12"
                strokeLinecap="round"
              />
              {/* Gradient definition */}
              <defs>
                <linearGradient id="painGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#22c55e" />
                  <stop offset="33%" stopColor="#eab308" />
                  <stop offset="66%" stopColor="#f97316" />
                  <stop offset="100%" stopColor="#ef4444" />
                </linearGradient>
              </defs>
              {/* Active arc */}
              <path
                d="M 10 80 A 70 70 0 0 1 150 80"
                fill="none"
                stroke={colorConfig.bg}
                strokeWidth="12"
                strokeLinecap="round"
                strokeDasharray={`${gaugePercentage * 2.2} 220`}
                style={{
                  transition: 'stroke-dasharray 1.5s ease-out',
                  filter: `drop-shadow(0 0 8px ${colorConfig.glow})`,
                }}
              />
              {/* Needle */}
              <g
                style={{
                  transform: `rotate(${-90 + (gaugePercentage * 1.8)}deg)`,
                  transformOrigin: '80px 80px',
                  transition: 'transform 1.5s ease-out',
                }}
              >
                <line
                  x1="80"
                  y1="80"
                  x2="80"
                  y2="25"
                  stroke={isDarkMode ? '#FFFFFF' : '#010101'}
                  strokeWidth="3"
                  strokeLinecap="round"
                />
                <circle
                  cx="80"
                  cy="80"
                  r="6"
                  fill={colorConfig.bg}
                  stroke={isDarkMode ? '#0d0d0d' : '#FFFFFF'}
                  strokeWidth="2"
                />
              </g>
            </svg>
          </div>

          {/* Score Display */}
          <div className="text-center">
            <div className="flex items-baseline justify-center gap-1">
              <span
                className="text-5xl font-black tracking-tight"
                style={{ color: colorConfig.bg }}
              >
                {animatedScore}
              </span>
              <span
                className="text-2xl font-bold"
                style={{ color: isDarkMode ? '#939394' : '#666666' }}
              >
                /100
              </span>
            </div>
            <div
              className="inline-flex items-center gap-1.5 mt-2 px-3 py-1 rounded-full"
              style={{
                backgroundColor: `${colorConfig.bg}20`,
                border: `1px solid ${colorConfig.bg}40`,
              }}
            >
              <span
                className="text-sm font-bold"
                style={{ color: colorConfig.bg }}
              >
                {data.label} Pain
              </span>
            </div>
          </div>

          {/* Trend */}
          <div className="flex items-center gap-2 mt-4">
            <TrendIcon className="w-4 h-4" style={{ color: trendColor }} />
            <span className="text-sm font-medium" style={{ color: trendColor }}>
              {data.trendDirection === 'up' ? '+' : data.trendDirection === 'down' ? '-' : ''}
              {data.trend}
            </span>
            <span className="text-xs" style={{ color: isDarkMode ? '#939394' : '#666666' }}>
              vs yesterday
            </span>
          </div>
        </div>
      </div>

      {/* Component Breakdown - Mini footer */}
      <div
        className="px-5 py-3 border-t"
        style={{
          borderColor: isDarkMode ? '#2a2a2a' : '#E5E5E5',
          backgroundColor: isDarkMode ? '#0a0a0a' : '#FAFAFA',
        }}
      >
        <div className="flex items-center justify-between text-xs">
          <span style={{ color: isDarkMode ? '#939394' : '#666666' }}>CSAT: {data.components.csat}</span>
          <span style={{ color: isDarkMode ? '#939394' : '#666666' }}>Neg: {data.components.negativeSentiment}%</span>
          <span style={{ color: isDarkMode ? '#939394' : '#666666' }}>Esc: {data.components.escalationRate}%</span>
        </div>
      </div>
    </div>
  );
}

