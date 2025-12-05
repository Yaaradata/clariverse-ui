'use client';

import { useState, useEffect } from 'react';
import { TrendingUp, AlertTriangle, Lightbulb } from 'lucide-react';

export default function TrustRiskScore() {
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

  const score = 64.3;
  const previousScore = 61.7;
  const change = 4.1;
  const threshold = 50.0;
  
  // Calculate ring progress (score out of 100)
  const circumference = 2 * Math.PI * 54;
  const progress = (score / 100) * circumference;

  const containerBg = isDarkMode ? 'rgb(13, 13, 13)' : 'rgb(255, 255, 255)';
  const containerBorder = isDarkMode ? 'rgb(31, 31, 31)' : 'rgb(229, 231, 235)';
  const textColor = isDarkMode ? 'rgb(255, 255, 255)' : 'rgb(31, 41, 55)';
  const subtextColor = isDarkMode ? 'rgb(156, 163, 175)' : 'rgb(107, 114, 128)';
  const labelColor = isDarkMode ? 'rgb(107, 114, 128)' : 'rgb(107, 114, 128)';
  const ringBg = isDarkMode ? 'rgb(38, 38, 38)' : 'rgb(229, 231, 235)';
  const insightBg = isDarkMode ? 'rgba(0, 0, 0, 0.3)' : 'rgb(249, 250, 251)';
  const insightBorder = isDarkMode ? 'rgba(255, 255, 255, 0.05)' : 'rgb(229, 231, 235)';

  return (
    <div 
      className="rounded-2xl p-5 h-fit"
      style={{ backgroundColor: containerBg, border: `1px solid ${containerBorder}` }}
    >
      {/* Header */}
      <div className="flex items-center gap-2 mb-4">
        <span className="text-lg">⭐</span>
        <h3 className="text-lg font-semibold" style={{ color: textColor }}>
          Customer Trust Risk Score
        </h3>
      </div>
      <p className="text-[10px] mb-4" style={{ color: subtextColor }}>
        C&R Communication-Based Risk Assessment
      </p>

      {/* Score Ring */}
      <div className="flex flex-col items-center mb-4">
        <div className="relative w-32 h-32">
          <svg className="w-full h-full transform -rotate-90">
            {/* Background ring */}
            <circle
              cx="64"
              cy="64"
              r="54"
              fill="none"
              stroke={ringBg}
              strokeWidth="10"
            />
            {/* Progress ring */}
            <circle
              cx="64"
              cy="64"
              r="54"
              fill="none"
              stroke="url(#riskGradient)"
              strokeWidth="10"
              strokeLinecap="round"
              strokeDasharray={circumference}
              strokeDashoffset={circumference - progress}
              className="transition-all duration-1000"
            />
            <defs>
              <linearGradient id="riskGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="rgb(249, 115, 22)" />
                <stop offset="100%" stopColor="rgb(239, 68, 68)" />
              </linearGradient>
            </defs>
          </svg>
          {/* Center content */}
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-2xl font-bold" style={{ color: 'rgb(249, 115, 22)' }}>
              {score}
            </span>
            <span className="text-[9px] uppercase tracking-wider font-medium" style={{ color: subtextColor }}>
              Risk Score
            </span>
          </div>
        </div>

        {/* Status Badge */}
        <div 
          className="mt-2 px-3 py-1 rounded-full text-[10px] font-semibold uppercase tracking-wider"
          style={{ 
            backgroundColor: 'rgba(249, 115, 22, 0.15)', 
            color: 'rgb(253, 186, 116)' 
          }}
        >
          Elevated Risk
        </div>

        {/* Trend Badge */}
        <div 
          className="mt-2 flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-medium"
          style={{ 
            backgroundColor: 'rgba(239, 68, 68, 0.15)', 
            color: 'rgb(252, 165, 165)' 
          }}
        >
          <TrendingUp className="w-3 h-3" />
          <span>+{change}%</span>
        </div>
      </div>

      {/* Mini Metrics */}
      <div className="grid grid-cols-3 gap-2 mb-4">
        <div className="text-center p-2 rounded-lg" style={{ backgroundColor: insightBg }}>
          <span className="text-[9px] uppercase tracking-wider block mb-1" style={{ color: labelColor }}>Previous</span>
          <span className="text-sm font-semibold" style={{ color: textColor }}>{previousScore}</span>
        </div>
        <div className="text-center p-2 rounded-lg" style={{ backgroundColor: insightBg }}>
          <span className="text-[9px] uppercase tracking-wider block mb-1" style={{ color: labelColor }}>Change</span>
          <span className="text-sm font-semibold" style={{ color: 'rgb(239, 68, 68)' }}>+{change}%</span>
        </div>
        <div className="text-center p-2 rounded-lg" style={{ backgroundColor: insightBg }}>
          <span className="text-[9px] uppercase tracking-wider block mb-1" style={{ color: labelColor }}>Threshold</span>
          <span className="text-sm font-semibold" style={{ color: textColor }}>{threshold}</span>
        </div>
      </div>

      {/* AI Insight */}
      <div 
        className="rounded-xl p-3 mb-3"
        style={{ backgroundColor: insightBg, border: `1px solid ${insightBorder}` }}
      >
        <div className="flex items-center gap-1.5 mb-1.5">
          <Lightbulb className="w-3 h-3" style={{ color: 'rgb(250, 204, 21)' }} />
          <span className="text-[9px] uppercase tracking-wider font-medium" style={{ color: 'rgb(250, 204, 21)' }}>
            AI Insight
          </span>
        </div>
        <p className="text-[11px] leading-relaxed" style={{ color: subtextColor }}>
          Rise in customer expressions of dissatisfaction linked to replacement denials and repeated delay complaints.
        </p>
      </div>

      {/* Recommendation */}
      <div 
        className="rounded-xl p-3"
        style={{ 
          backgroundColor: 'rgba(249, 115, 22, 0.08)', 
          border: '1px solid rgba(249, 115, 22, 0.2)' 
        }}
      >
        <div className="flex items-center gap-1.5 mb-1.5">
          <AlertTriangle className="w-3 h-3" style={{ color: 'rgb(249, 115, 22)' }} />
          <span className="text-[9px] uppercase tracking-wider font-medium" style={{ color: 'rgb(249, 115, 22)' }}>
            Recommendation
          </span>
        </div>
        <p className="text-[11px] leading-relaxed" style={{ color: isDarkMode ? 'rgb(253, 186, 116)' : 'rgb(154, 52, 18)' }}>
          Add mandatory clarity message on return/replacement eligibility to reduce frustration-triggered escalations.
        </p>
      </div>
    </div>
  );
}

