'use client';

import { useState, useEffect } from 'react';
import { Scale, FileText, Shield, Users, AlertTriangle, TrendingUp, TrendingDown } from 'lucide-react';

const governanceData = [
  {
    id: 'fiscal',
    label: 'Fiscal (GST)',
    icon: FileText,
    status: 'CRITICAL',
    count: 142,
    trend: 12,
    trendUp: true,
    description: 'Invoice Denied'
  },
  {
    id: 'consumer',
    label: 'Consumer Rights',
    icon: Users,
    status: 'WARNING',
    count: 89,
    trend: 5,
    trendUp: true,
    description: 'Warranty/Repair'
  },
  {
    id: 'privacy',
    label: 'Data Privacy',
    icon: Shield,
    status: 'STABLE',
    count: 34,
    trend: 8,
    trendUp: false,
    description: 'Delete/Spam'
  },
  {
    id: 'liability',
    label: 'Liability',
    icon: AlertTriangle,
    status: 'WARNING',
    count: 67,
    trend: 3,
    trendUp: true,
    description: 'Offensive Item'
  }
];

const getStatusColors = (status: string) => {
  switch (status) {
    case 'CRITICAL':
      return {
        border: 'rgba(239, 68, 68, 0.5)',
        bg: 'rgba(239, 68, 68, 0.1)',
        text: 'rgb(252, 165, 165)',
        badge: 'rgba(239, 68, 68, 0.2)',
      };
    case 'WARNING':
      return {
        border: 'rgba(245, 158, 11, 0.5)',
        bg: 'rgba(245, 158, 11, 0.1)',
        text: 'rgb(253, 230, 138)',
        badge: 'rgba(245, 158, 11, 0.2)',
      };
    case 'STABLE':
    default:
      return {
        border: 'rgba(16, 185, 129, 0.5)',
        bg: 'rgba(16, 185, 129, 0.1)',
        text: 'rgb(167, 243, 208)',
        badge: 'rgba(16, 185, 129, 0.2)',
      };
  }
};

export default function GovernanceGrid() {
  const [isDarkMode, setIsDarkMode] = useState(true);

  useEffect(() => {
    const checkTheme = () => {
      const theme = localStorage.getItem('theme');
      setIsDarkMode(theme === 'dark');
    };
    checkTheme();
    window.addEventListener('storage', checkTheme);
    return () => window.removeEventListener('storage', checkTheme);
  }, []);

  const containerBg = isDarkMode ? 'rgb(13, 13, 13)' : 'rgb(255, 255, 255)';
  const containerBorder = isDarkMode ? 'rgb(31, 31, 31)' : 'rgb(229, 231, 235)';
  const textColor = isDarkMode ? 'rgb(255, 255, 255)' : 'rgb(31, 41, 55)';
  const subtextColor = isDarkMode ? 'rgb(156, 163, 175)' : 'rgb(107, 114, 128)';

  const criticalCount = governanceData.filter(d => d.status === 'CRITICAL').length;
  const overallStatus = criticalCount > 0 ? 'At Risk' : 'Stable';

  return (
    <div 
      className="rounded-2xl p-5 flex flex-col h-full"
      style={{ backgroundColor: containerBg, border: `1px solid ${containerBorder}` }}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-sm font-semibold flex items-center gap-2" style={{ color: textColor }}>
            <Scale className="w-4 h-4" style={{ color: 'rgb(245, 158, 11)' }} />
            Statutory Governance Monitor
          </h3>
          <p className="text-[10px] mt-1" style={{ color: subtextColor }}>Legal/fiscal compliance status grid</p>
        </div>
        <div 
          className="px-2 py-1 rounded-full text-[10px] font-semibold uppercase"
          style={{ 
            backgroundColor: criticalCount > 0 ? 'rgba(239, 68, 68, 0.2)' : 'rgba(16, 185, 129, 0.2)',
            color: criticalCount > 0 ? 'rgb(252, 165, 165)' : 'rgb(167, 243, 208)'
          }}
        >
          {overallStatus}
        </div>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-2 gap-2 flex-1">
        {governanceData.map((item) => {
          const colors = getStatusColors(item.status);
          const Icon = item.icon;
          return (
            <div 
              key={item.id}
              className="rounded-lg p-3 flex flex-col"
              style={{ backgroundColor: colors.bg, border: `1px solid ${colors.border}` }}
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-1.5">
                  <Icon className="w-3 h-3" style={{ color: colors.text }} />
                  <span className="text-[10px] font-medium" style={{ color: textColor }}>{item.label}</span>
                </div>
                <span 
                  className="text-[8px] px-1.5 py-0.5 rounded-full uppercase font-semibold"
                  style={{ backgroundColor: colors.badge, color: colors.text }}
                >
                  {item.status}
                </span>
              </div>
              <div className="flex items-end justify-between mt-auto">
                <div>
                  <span className="text-lg font-bold" style={{ color: colors.text }}>{item.count}</span>
                  <span className="text-[9px] ml-1" style={{ color: subtextColor }}>reports</span>
                </div>
                <div className="flex items-center gap-0.5" style={{ color: item.trendUp ? 'rgb(239, 68, 68)' : 'rgb(16, 185, 129)' }}>
                  {item.trendUp ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                  <span className="text-[9px] font-medium">{item.trendUp ? '+' : '-'}{item.trend}%</span>
                </div>
              </div>
              <span className="text-[9px] mt-1" style={{ color: subtextColor }}>{item.description}</span>
            </div>
          );
        })}
      </div>

      {/* AI Insight */}
      <div 
        className="mt-3 rounded-lg p-2.5"
        style={{ backgroundColor: 'rgba(239, 68, 68, 0.1)', border: '1px solid rgba(239, 68, 68, 0.2)' }}
      >
        <div className="flex items-center gap-1.5 mb-1">
          <AlertTriangle className="w-3 h-3" style={{ color: 'rgb(239, 68, 68)' }} />
          <span className="text-[9px] uppercase tracking-wider font-medium" style={{ color: 'rgb(239, 68, 68)' }}>
            AI Insight
          </span>
        </div>
        <p className="text-[10px] leading-relaxed" style={{ color: isDarkMode ? 'rgb(254, 202, 202)' : 'rgb(153, 27, 27)' }}>
          <strong>Fiscal Alert:</strong> 'Invoice Generation' failures have crossed the critical threshold (50+ reports/hr). Potential API latency affecting GST compliance.
        </p>
      </div>
    </div>
  );
}

