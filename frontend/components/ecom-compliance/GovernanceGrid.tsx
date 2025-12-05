'use client';

import { useState, useEffect, useMemo } from 'react';
import { FileText, Shield, Users, AlertTriangle, TrendingUp, TrendingDown, Gavel, Mail, Phone, MessageSquare } from 'lucide-react';

type TimeFilter = '24h' | '7d' | '30d';

// Thresholds for status determination
const THRESHOLDS = {
  '24h': { critical: 50, warning: 25 },
  '7d': { critical: 250, warning: 100 },
  '30d': { critical: 800, warning: 400 },
};

const getGovernanceData = (filter: TimeFilter) => {
  const threshold = THRESHOLDS[filter];
  
  if (filter === '24h') {
    return [
      { 
        id: 'fiscal', 
        label: 'Fiscal (GST/ITC)', 
        icon: FileText, 
        count: 142, 
        trend: 12, 
        trendUp: true, 
        signal: 'Invoice Invalid',
        source: 'Grievance Tickets',
        sourceIcon: 'email',
        keyword: '"GST missing"'
      },
      { 
        id: 'consumer', 
        label: 'Consumer Rights', 
        icon: Users, 
        count: 24, 
        trend: -5, 
        trendUp: false, 
        signal: 'Warranty Denied',
        source: 'Voice Calls',
        sourceIcon: 'voice',
        keyword: '"Right to repair"'
      },
      { 
        id: 'privacy', 
        label: 'Data Privacy (DPDP)', 
        icon: Shield, 
        count: 56, 
        trend: 2, 
        trendUp: true, 
        signal: 'Delete Data',
        source: 'Email/Chat',
        sourceIcon: 'chat',
        keyword: '"Remove my data"'
      },
      { 
        id: 'liability', 
        label: 'Intermediary', 
        icon: AlertTriangle, 
        count: 12, 
        trend: 0, 
        trendUp: false, 
        signal: 'Offensive Item',
        source: 'Social Media',
        sourceIcon: 'chat',
        keyword: '"Report content"'
      },
    ];
  } else if (filter === '7d') {
    return [
      { 
        id: 'fiscal', 
        label: 'Fiscal (GST/ITC)', 
        icon: FileText, 
        count: 892, 
        trend: 8, 
        trendUp: true, 
        signal: 'Invoice Invalid',
        source: 'Grievance Tickets',
        sourceIcon: 'email',
        keyword: '"Invoice rejected"'
      },
      { 
        id: 'consumer', 
        label: 'Consumer Rights', 
        icon: Users, 
        count: 156, 
        trend: 3, 
        trendUp: true, 
        signal: 'Warranty Denied',
        source: 'Voice Calls',
        sourceIcon: 'voice',
        keyword: '"Service denied"'
      },
      { 
        id: 'privacy', 
        label: 'Data Privacy (DPDP)', 
        icon: Shield, 
        count: 312, 
        trend: -4, 
        trendUp: false, 
        signal: 'Delete Data',
        source: 'Email/Chat',
        sourceIcon: 'chat',
        keyword: '"Stop spam"'
      },
      { 
        id: 'liability', 
        label: 'Intermediary', 
        icon: AlertTriangle, 
        count: 78, 
        trend: -2, 
        trendUp: false, 
        signal: 'Offensive Item',
        source: 'Social Media',
        sourceIcon: 'chat',
        keyword: '"Harmful product"'
      },
    ];
  } else {
    return [
      { 
        id: 'fiscal', 
        label: 'Fiscal (GST/ITC)', 
        icon: FileText, 
        count: 3420, 
        trend: 5, 
        trendUp: true, 
        signal: 'Invoice Invalid',
        source: 'Grievance Tickets',
        sourceIcon: 'email',
        keyword: '"Tax document"'
      },
      { 
        id: 'consumer', 
        label: 'Consumer Rights', 
        icon: Users, 
        count: 580, 
        trend: -8, 
        trendUp: false, 
        signal: 'Warranty Denied',
        source: 'Voice Calls',
        sourceIcon: 'voice',
        keyword: '"Consumer forum"'
      },
      { 
        id: 'privacy', 
        label: 'Data Privacy (DPDP)', 
        icon: Shield, 
        count: 1180, 
        trend: -12, 
        trendUp: false, 
        signal: 'Delete Data',
        source: 'Email/Chat',
        sourceIcon: 'chat',
        keyword: '"Privacy violation"'
      },
      { 
        id: 'liability', 
        label: 'Intermediary', 
        icon: AlertTriangle, 
        count: 290, 
        trend: -5, 
        trendUp: false, 
        signal: 'Offensive Item',
        source: 'Social Media',
        sourceIcon: 'chat',
        keyword: '"Illegal product"'
      },
    ];
  }
};

const getStatus = (count: number, filter: TimeFilter) => {
  const threshold = THRESHOLDS[filter];
  if (count >= threshold.critical) return 'Critical';
  if (count >= threshold.warning) return 'Warning';
  return 'Stable';
};

const getStatusStyles = (status: string, isDarkMode: boolean) => {
  switch (status) {
    case 'Critical':
      return {
        borderColor: 'rgb(239, 68, 68)',
        bg: isDarkMode ? 'rgba(239, 68, 68, 0.08)' : 'rgba(254, 226, 226, 0.8)',
        textColor: isDarkMode ? 'rgb(252, 165, 165)' : 'rgb(185, 28, 28)',
        badgeColor: isDarkMode ? 'rgb(239, 68, 68)' : 'rgb(185, 28, 28)',
        pulse: true,
      };
    case 'Warning':
      return {
        borderColor: 'rgb(245, 158, 11)',
        bg: isDarkMode ? 'rgba(245, 158, 11, 0.08)' : 'rgba(254, 243, 199, 0.8)',
        textColor: isDarkMode ? 'rgb(253, 230, 138)' : 'rgb(146, 64, 14)',
        badgeColor: isDarkMode ? 'rgb(245, 158, 11)' : 'rgb(180, 83, 9)',
        pulse: false,
      };
    case 'Stable':
    default:
      return {
        borderColor: 'rgb(16, 185, 129)',
        bg: isDarkMode ? 'rgba(16, 185, 129, 0.08)' : 'rgba(209, 250, 229, 0.8)',
        textColor: isDarkMode ? 'rgb(167, 243, 208)' : 'rgb(4, 120, 87)',
        badgeColor: isDarkMode ? 'rgb(16, 185, 129)' : 'rgb(4, 120, 87)',
        pulse: false,
      };
  }
};

const SourceIcon = ({ type, className }: { type: string; className?: string }) => {
  switch (type) {
    case 'email':
      return <Mail className={className} />;
    case 'voice':
      return <Phone className={className} />;
    default:
      return <MessageSquare className={className} />;
  }
};

export default function GovernanceGrid() {
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [timeFilter, setTimeFilter] = useState<TimeFilter>('24h');

  useEffect(() => {
    const checkTheme = () => {
      const theme = localStorage.getItem('theme');
      setIsDarkMode(theme === 'dark');
    };
    const checkFilter = () => {
      const filter = localStorage.getItem('ecomTimeFilter') as TimeFilter;
      if (filter) setTimeFilter(filter);
    };
    
    checkTheme();
    checkFilter();
    
    // Listen for storage changes (from other tabs)
    const handleStorage = () => {
      checkTheme();
      checkFilter();
    };
    window.addEventListener('storage', handleStorage);
    
    // Listen for class changes on document (same tab theme toggle)
    const observer = new MutationObserver(() => {
      setIsDarkMode(document.documentElement.classList.contains('dark'));
    });
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });
    
    return () => {
      window.removeEventListener('storage', handleStorage);
      observer.disconnect();
    };
  }, []);

  const governanceData = useMemo(() => getGovernanceData(timeFilter), [timeFilter]);
  const enrichedData = useMemo(() => 
    governanceData.map(item => ({
      ...item,
      status: getStatus(item.count, timeFilter),
    })), 
    [governanceData, timeFilter]
  );
  const hasCritical = enrichedData.some(d => d.status === 'Critical');

  const containerBg = isDarkMode ? 'rgb(13, 13, 13)' : 'rgb(255, 255, 255)';
  const containerBorder = isDarkMode ? 'rgb(31, 31, 31)' : 'rgb(229, 231, 235)';
  const textColor = isDarkMode ? 'rgb(255, 255, 255)' : 'rgb(17, 24, 39)';
  const subtextColor = isDarkMode ? 'rgb(156, 163, 175)' : 'rgb(75, 85, 99)';

  return (
    <div 
      className="rounded-2xl p-5 flex flex-col h-full"
      style={{ backgroundColor: containerBg, border: `1px solid ${containerBorder}` }}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-semibold flex items-center gap-2" style={{ color: textColor }}>
          <Gavel className="w-4 h-4" style={{ color: 'rgb(129, 140, 248)' }} />
          Statutory & Fiscal Governance
        </h3>
        {hasCritical && (
          <div 
            className="w-2.5 h-2.5 rounded-full animate-pulse"
            style={{ backgroundColor: 'rgb(239, 68, 68)', boxShadow: '0 0 8px rgb(239, 68, 68)' }}
          />
        )}
      </div>

      {/* 2x2 Grid */}
      <div className="grid grid-cols-2 gap-2 flex-1">
        {enrichedData.map((item) => {
          const styles = getStatusStyles(item.status, isDarkMode);
          const Icon = item.icon;
          return (
            <div 
              key={item.id}
              className="rounded-lg p-3 border-l-2 flex flex-col"
              style={{ 
                backgroundColor: styles.bg, 
                borderLeftColor: styles.borderColor,
              }}
            >
              {/* Top Row: Icon + Status */}
              <div className="flex justify-between items-start mb-1">
                <div className="flex items-center gap-1.5">
                  <Icon className="w-3 h-3" style={{ color: styles.textColor, opacity: 0.8 }} />
                  {styles.pulse && (
                    <div 
                      className="w-1.5 h-1.5 rounded-full animate-pulse"
                      style={{ backgroundColor: styles.badgeColor }}
                    />
                  )}
                </div>
                <span 
                  className="text-[8px] uppercase font-bold tracking-wider"
                  style={{ color: styles.badgeColor }}
                >
                  {item.status}
                </span>
              </div>

              {/* Label */}
              <span className="text-[9px] font-medium" style={{ color: isDarkMode ? 'rgba(255,255,255,0.8)' : 'rgba(0,0,0,0.7)' }}>
                {item.label}
              </span>

              {/* Count + Trend */}
              <div className="flex items-end justify-between mt-1">
                <div>
                  <span className="text-xl font-bold font-mono" style={{ color: textColor }}>{item.count.toLocaleString()}</span>
                  <span className="text-[8px] ml-0.5" style={{ color: subtextColor }}>signals</span>
                </div>
                <span 
                  className="text-[9px] flex items-center gap-0.5 font-medium"
                  style={{ color: item.trendUp ? 'rgb(239, 68, 68)' : 'rgb(16, 185, 129)' }}
                >
                  {item.trendUp ? <TrendingUp className="w-2.5 h-2.5" /> : <TrendingDown className="w-2.5 h-2.5" />}
                  {item.trendUp ? '+' : ''}{item.trend}%
                </span>
              </div>

              {/* Micro Info: Source + Signal */}
              <div className="mt-1.5 pt-1.5 space-y-0.5" style={{ borderTop: `1px solid ${isDarkMode ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)'}` }}>
                <div className="flex items-center gap-1 text-[8px]" style={{ color: subtextColor }}>
                  <SourceIcon type={item.sourceIcon} className="w-2.5 h-2.5" />
                  <span>{item.source}</span>
                </div>
                <div className="text-[8px]" style={{ color: subtextColor }}>
                  Signal: <span style={{ color: styles.textColor }}>{item.signal}</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* AI Insight */}
      <div 
        className="mt-3 rounded-lg p-2.5"
        style={{ 
          background: isDarkMode ? 'linear-gradient(to right, rgba(129, 140, 248, 0.1), transparent)' : 'rgba(129, 140, 248, 0.08)',
          borderLeft: '2px solid rgb(129, 140, 248)'
        }}
      >
        <p className="text-[10px] leading-relaxed" style={{ color: isDarkMode ? 'rgb(212, 212, 216)' : 'rgb(63, 63, 70)' }}>
          <span className="font-bold" style={{ color: 'rgb(129, 140, 248)' }}>AI:</span> High volume of 'Invoice Invalid' tickets via <strong style={{ color: textColor }}>Grievance Officer</strong> suggests potential GST API failure. Keyword: <em>"GST missing"</em>
        </p>
      </div>
    </div>
  );
}
