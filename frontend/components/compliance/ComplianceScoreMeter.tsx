'use client';

import { useState, useEffect } from 'react';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { ComplianceScore, getScoreRatingColor } from '@/lib/compliance/complianceData';

interface ComplianceScoreMeterProps {
  data: ComplianceScore;
  isDarkMode?: boolean;
}

export function ComplianceScoreMeter({ data, isDarkMode = false }: ComplianceScoreMeterProps) {
  const [animatedValue, setAnimatedValue] = useState(0);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
    const timer = setTimeout(() => {
      const duration = 1500;
      const startTime = Date.now();
      const animate = () => {
        const elapsed = Date.now() - startTime;
        const progress = Math.min(elapsed / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 3);
        setAnimatedValue(data.value * eased);
        if (progress < 1) {
          requestAnimationFrame(animate);
        }
      };
      requestAnimationFrame(animate);
    }, 300);
    return () => clearTimeout(timer);
  }, [data.value]);

  const scoreColor = getScoreRatingColor(data.rating);
  const circumference = 2 * Math.PI * 90;
  const strokeDashoffset = circumference - (animatedValue / 100) * circumference;

  const getTrendIcon = () => {
    if (data.trend > 0) return <TrendingUp className="w-4 h-4" />;
    if (data.trend < 0) return <TrendingDown className="w-4 h-4" />;
    return <Minus className="w-4 h-4" />;
  };

  const getTrendColor = () => {
    // For compliance score, higher is better
    if (data.trend > 0) return '#22c55e';
    if (data.trend < 0) return '#ef4444';
    return '#939394';
  };

  return (
    <div
      className={`relative rounded-2xl p-6 transition-all duration-500 h-full flex flex-col ${
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
      }`}
      style={{
        backgroundColor: isDarkMode ? '#0d0d0d' : '#FFFFFF',
        border: `1px solid ${isDarkMode ? '#2a2a2a' : '#E5E5E5'}`,
        boxShadow: isDarkMode 
          ? '0 4px 24px rgba(0, 0, 0, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.05)'
          : '0 4px 24px rgba(0, 0, 0, 0.06)'
      }}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h3 
          className="text-lg font-bold"
          style={{ color: isDarkMode ? '#FFFFFF' : '#010101' }}
        >
          Compliance Health Score
        </h3>
        <div 
          className="flex items-center gap-1 px-2 py-1 rounded-full text-xs font-semibold"
          style={{
            backgroundColor: isDarkMode ? `${getTrendColor()}20` : `${getTrendColor()}15`,
            color: getTrendColor()
          }}
        >
          {getTrendIcon()}
          <span>{Math.abs(data.trend)}%</span>
        </div>
      </div>

      {/* Gauge */}
      <div className="relative flex items-center justify-center py-4">
        <svg width="220" height="220" className="transform -rotate-90">
          {/* Background circle */}
          <circle
            cx="110"
            cy="110"
            r="90"
            fill="none"
            stroke={isDarkMode ? '#1f1f1f' : '#F0F0F0'}
            strokeWidth="16"
          />
          {/* Animated progress circle */}
          <circle
            cx="110"
            cy="110"
            r="90"
            fill="none"
            stroke={scoreColor}
            strokeWidth="16"
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            style={{
              transition: 'stroke-dashoffset 1.5s cubic-bezier(0.4, 0, 0.2, 1)',
              filter: `drop-shadow(0 0 12px ${scoreColor}60)`
            }}
          />
          {/* Glow effect */}
          <circle
            cx="110"
            cy="110"
            r="90"
            fill="none"
            stroke={scoreColor}
            strokeWidth="4"
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            style={{
              transition: 'stroke-dashoffset 1.5s cubic-bezier(0.4, 0, 0.2, 1)',
              filter: `blur(8px)`,
              opacity: 0.6
            }}
          />
        </svg>

        {/* Center content */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span 
            className="text-5xl font-black tabular-nums"
            style={{ color: scoreColor }}
          >
            {animatedValue.toFixed(1)}
          </span>
          <span 
            className="text-sm font-medium uppercase tracking-wider mt-1"
            style={{ color: '#939394' }}
          >
            {data.rating}
          </span>
        </div>
      </div>

      {/* Footer stats */}
      <div className="flex items-center justify-between pt-4 border-t" style={{ borderColor: isDarkMode ? '#2a2a2a' : '#E5E5E5' }}>
        <div className="text-center">
          <p className="text-xs" style={{ color: '#939394' }}>Previous</p>
          <p className="text-lg font-bold" style={{ color: isDarkMode ? '#FFFFFF' : '#010101' }}>
            {data.previousValue.toFixed(1)}
          </p>
        </div>
        <div 
          className="h-8 w-px"
          style={{ backgroundColor: isDarkMode ? '#2a2a2a' : '#E5E5E5' }}
        />
        <div className="text-center">
          <p className="text-xs" style={{ color: '#939394' }}>Change</p>
          <p className="text-lg font-bold" style={{ color: getTrendColor() }}>
            {data.trend > 0 ? '+' : ''}{data.trend.toFixed(1)}%
          </p>
        </div>
        <div 
          className="h-8 w-px"
          style={{ backgroundColor: isDarkMode ? '#2a2a2a' : '#E5E5E5' }}
        />
        <div className="text-center">
          <p className="text-xs" style={{ color: '#939394' }}>Target</p>
          <p className="text-lg font-bold" style={{ color: isDarkMode ? '#FFFFFF' : '#010101' }}>
            95.0
          </p>
        </div>
      </div>

      {/* AI Insights */}
      <div className="mt-10 space-y-2">
        <div 
          className="p-3 rounded-xl"
          style={{ 
            background: isDarkMode 
              ? 'linear-gradient(135deg, rgba(83, 50, 255, 0.15) 0%, rgba(185, 10, 189, 0.1) 100%)'
              : 'linear-gradient(135deg, rgba(83, 50, 255, 0.08) 0%, rgba(185, 10, 189, 0.05) 100%)',
            border: `1px solid ${isDarkMode ? 'rgba(83, 50, 255, 0.3)' : 'rgba(83, 50, 255, 0.2)'}`
          }}
        >
          <div className="flex items-start gap-2.5">
            <span className="text-sm flex-shrink-0">✨</span>
            <div className="flex-1 min-w-0">
              <p 
                className="text-[10px] font-semibold uppercase tracking-wider mb-1"
                style={{ color: '#5332FF' }}
              >
                AI Insight
              </p>
              <p 
                className="text-xs leading-relaxed"
                style={{ color: isDarkMode ? '#D6D9D8' : '#4a4a4a' }}
              >
                {data.trend < 0 
                  ? `Score dropped ${Math.abs(data.trend).toFixed(1)}% due to increased KYC violations. Focus on agent training for identity verification protocols.`
                  : data.value >= 90 
                    ? `Excellent compliance posture! Maintain current controls and continue monitoring for emerging risks.`
                    : `Score improving steadily. Address pending script violations to reach the 95% target within 2 weeks.`
                }
              </p>
            </div>
          </div>
        </div>

        <div 
          className="p-3 rounded-xl"
          style={{ 
            background: isDarkMode 
              ? 'linear-gradient(135deg, rgba(34, 197, 94, 0.15) 0%, rgba(6, 182, 212, 0.1) 100%)'
              : 'linear-gradient(135deg, rgba(34, 197, 94, 0.08) 0%, rgba(6, 182, 212, 0.05) 100%)',
            border: `1px solid ${isDarkMode ? 'rgba(34, 197, 94, 0.3)' : 'rgba(34, 197, 94, 0.2)'}`
          }}
        >
          <div className="flex items-start gap-2.5">
            <span className="text-sm flex-shrink-0">✨</span>
            <div className="flex-1 min-w-0">
              <p 
                className="text-[10px] font-semibold uppercase tracking-wider mb-1"
                style={{ color: '#22c55e' }}
              >
                Recommendation
              </p>
              <p 
                className="text-xs leading-relaxed"
                style={{ color: isDarkMode ? '#D6D9D8' : '#4a4a4a' }}
              >
                {data.value < 85
                  ? `Enable real-time script monitoring to catch violations before they impact scores. 23% of issues are preventable.`
                  : `Consider automating GLBA disclosure checks on chat channel to reduce manual review backlog by 40%.`
                }
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

