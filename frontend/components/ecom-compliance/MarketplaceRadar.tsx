'use client';

import { useState, useEffect, useMemo } from 'react';
import { ShieldAlert, TrendingUp, TrendingDown, MessageCircle, Mail, Phone, Hash } from 'lucide-react';

type TimeFilter = '24h' | '7d' | '30d';

const getRiskData = (filter: TimeFilter) => {
  // Risk values vary based on time period (dilution effect over longer periods)
  if (filter === '24h') {
    return [
      { 
        name: 'Counterfeit / IP Infringement', 
        value: 85, 
        delta: 12, 
        critical: true,
        channel: 'Social Media',
        channelIcon: 'social',
        keyword: '"First Copy"',
        category: 'Sneakers'
      },
      { 
        name: 'MRP & Price Manipulation', 
        value: 62, 
        delta: 8, 
        critical: false,
        channel: 'Chat',
        channelIcon: 'chat',
        keyword: '"Higher than tag"',
        category: 'Electronics'
      },
      { 
        name: 'Misleading Claims (CPA 2019)', 
        value: 78, 
        delta: -3, 
        critical: true,
        channel: 'Tickets',
        channelIcon: 'email',
        keyword: '"Wrong specs"',
        category: 'Mobiles'
      },
      { 
        name: 'Seller Conduct', 
        value: 45, 
        delta: 5, 
        critical: false,
        channel: 'Voice',
        channelIcon: 'voice',
        keyword: '"Direct UPI"',
        category: 'Fashion'
      },
    ];
  } else if (filter === '7d') {
    return [
      { 
        name: 'Counterfeit / IP Infringement', 
        value: 72, 
        delta: 8, 
        critical: false,
        channel: 'Social Media',
        channelIcon: 'social',
        keyword: '"Fake product"',
        category: 'Footwear'
      },
      { 
        name: 'MRP & Price Manipulation', 
        value: 55, 
        delta: 4, 
        critical: false,
        channel: 'Tickets',
        channelIcon: 'email',
        keyword: '"Overpriced"',
        category: 'Appliances'
      },
      { 
        name: 'Misleading Claims (CPA 2019)', 
        value: 68, 
        delta: -5, 
        critical: false,
        channel: 'Chat',
        channelIcon: 'chat',
        keyword: '"Not as shown"',
        category: 'Electronics'
      },
      { 
        name: 'Seller Conduct', 
        value: 38, 
        delta: 2, 
        critical: false,
        channel: 'Voice',
        channelIcon: 'voice',
        keyword: '"Rude behavior"',
        category: 'General'
      },
    ];
  } else {
    return [
      { 
        name: 'Counterfeit / IP Infringement', 
        value: 65, 
        delta: 5, 
        critical: false,
        channel: 'Social Media',
        channelIcon: 'social',
        keyword: '"Duplicate"',
        category: 'Fashion'
      },
      { 
        name: 'MRP & Price Manipulation', 
        value: 48, 
        delta: -2, 
        critical: false,
        channel: 'Tickets',
        channelIcon: 'email',
        keyword: '"Price mismatch"',
        category: 'FMCG'
      },
      { 
        name: 'Misleading Claims (CPA 2019)', 
        value: 58, 
        delta: -8, 
        critical: false,
        channel: 'Chat',
        channelIcon: 'chat',
        keyword: '"Wrong features"',
        category: 'Mobiles'
      },
      { 
        name: 'Seller Conduct', 
        value: 32, 
        delta: -4, 
        critical: false,
        channel: 'Voice',
        channelIcon: 'voice',
        keyword: '"Unprofessional"',
        category: 'Services'
      },
    ];
  }
};

const CRITICAL_THRESHOLD = 80;

const ChannelIcon = ({ type, className }: { type: string; className?: string }) => {
  switch (type) {
    case 'social':
      return <MessageCircle className={className} />;
    case 'email':
      return <Mail className={className} />;
    case 'voice':
      return <Phone className={className} />;
    default:
      return <MessageCircle className={className} />;
  }
};

export default function MarketplaceRadar() {
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
    window.addEventListener('storage', () => {
      checkTheme();
      checkFilter();
    });
    return () => window.removeEventListener('storage', () => {});
  }, []);

  const riskData = useMemo(() => getRiskData(timeFilter), [timeFilter]);
  const riskScore = useMemo(() => Math.round(riskData.reduce((acc, r) => acc + r.value, 0) / riskData.length), [riskData]);
  const hasCritical = riskData.some(r => r.critical);
  const topRisk = riskData.reduce((max, r) => r.value > max.value ? r : max, riskData[0]);

  const containerBg = isDarkMode ? 'rgb(13, 13, 13)' : 'rgb(255, 255, 255)';
  const containerBorder = isDarkMode ? 'rgb(31, 31, 31)' : 'rgb(229, 231, 235)';
  const textColor = isDarkMode ? 'rgb(255, 255, 255)' : 'rgb(31, 41, 55)';
  const subtextColor = isDarkMode ? 'rgb(156, 163, 175)' : 'rgb(107, 114, 128)';
  const barBg = isDarkMode ? 'rgb(39, 39, 42)' : 'rgb(228, 228, 231)';

  const getBarColor = (value: number, critical: boolean) => {
    if (critical || value >= CRITICAL_THRESHOLD) return 'rgb(239, 68, 68)';
    if (value >= 60) return 'rgb(245, 158, 11)';
    return 'rgb(16, 185, 129)';
  };

  return (
    <div 
      className="rounded-2xl p-5 flex flex-col h-full"
      style={{ backgroundColor: containerBg, border: `1px solid ${containerBorder}` }}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-semibold" style={{ color: textColor }}>Marketplace Integrity Risk</h3>
        <div 
          className="flex items-center gap-2 px-2 py-1 rounded"
          style={{ 
            backgroundColor: hasCritical ? 'rgba(239, 68, 68, 0.1)' : 'rgba(245, 158, 11, 0.1)',
            border: hasCritical ? '1px solid rgba(239, 68, 68, 0.2)' : '1px solid rgba(245, 158, 11, 0.2)'
          }}
        >
          <ShieldAlert className="w-3 h-3" style={{ color: hasCritical ? 'rgb(239, 68, 68)' : 'rgb(245, 158, 11)' }} />
          <span 
            className="text-[10px] font-bold"
            style={{ color: hasCritical ? 'rgb(239, 68, 68)' : 'rgb(245, 158, 11)' }}
          >
            {hasCritical ? 'CRITICAL' : 'MODERATE'}: {riskScore}/100
          </span>
        </div>
      </div>

      {/* Risk Meters with Micro Info */}
      <div className="space-y-3 flex-1">
        {riskData.map((risk) => {
          const barColor = getBarColor(risk.value, risk.critical);
          const isUp = risk.delta > 0;
          return (
            <div key={risk.name} className="group">
              {/* Risk Name Row */}
              <div className="flex justify-between items-center mb-1">
                <span 
                  className="text-[10px] font-medium"
                  style={{ color: textColor, opacity: 0.9 }}
                >
                  {risk.name}
                </span>
                <div className="flex items-center gap-2">
                  <span 
                    className="text-[10px] font-mono font-bold"
                    style={{ color: barColor }}
                  >
                    {risk.value}%
                  </span>
                  <span 
                    className="text-[8px] flex items-center gap-0.5"
                    style={{ color: isUp ? 'rgb(239, 68, 68)' : 'rgb(16, 185, 129)' }}
                  >
                    {isUp ? <TrendingUp className="w-2 h-2" /> : <TrendingDown className="w-2 h-2" />}
                    {isUp ? '+' : ''}{risk.delta}%
                  </span>
                </div>
              </div>
              
              {/* Progress Bar */}
              <div className="relative h-2 w-full rounded-full overflow-hidden" style={{ backgroundColor: barBg }}>
                {/* Threshold line at 80% */}
                <div 
                  className="absolute top-0 bottom-0 w-px z-10"
                  style={{ 
                    left: `${CRITICAL_THRESHOLD}%`, 
                    borderRight: '1px dashed',
                    borderColor: isDarkMode ? 'rgb(113, 113, 122)' : 'rgb(161, 161, 170)'
                  }}
                />
                {/* Bar fill */}
                <div 
                  className="h-full rounded-full transition-all duration-500"
                  style={{ 
                    width: `${risk.value}%`, 
                    backgroundColor: barColor,
                    boxShadow: risk.critical ? `0 0 8px ${barColor}50` : 'none'
                  }}
                />
              </div>

              {/* Micro Info Row */}
              <div className="flex items-center gap-3 mt-1">
                <span className="text-[8px] flex items-center gap-0.5" style={{ color: subtextColor }}>
                  <ChannelIcon type={risk.channelIcon} className="w-2.5 h-2.5" />
                  {risk.channel}
                </span>
                <span className="text-[8px] flex items-center gap-0.5" style={{ color: subtextColor }}>
                  <Hash className="w-2.5 h-2.5" />
                  {risk.keyword}
                </span>
                <span className="text-[8px]" style={{ color: subtextColor }}>
                  {risk.category}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Micro Information Row */}
      <div className="grid grid-cols-3 gap-2 mt-3 pt-3" style={{ borderTop: `1px solid ${containerBorder}` }}>
        <div>
          <span className="text-[8px] uppercase tracking-wider" style={{ color: subtextColor }}>Top Offender</span>
          <p className="text-[10px] font-medium mt-0.5" style={{ color: 'rgb(239, 68, 68)' }}>{topRisk.category}</p>
          <p className="text-[8px]" style={{ color: subtextColor }}>{topRisk.value}% risk density</p>
        </div>
        <div>
          <span className="text-[8px] uppercase tracking-wider" style={{ color: subtextColor }}>Critical Threshold</span>
          <p className="text-[10px] font-medium mt-0.5" style={{ color: textColor }}>{CRITICAL_THRESHOLD}%</p>
          <p className="text-[8px]" style={{ color: subtextColor }}>{riskData.filter(r => r.critical).length} vectors breached</p>
        </div>
        <div>
          <span className="text-[8px] uppercase tracking-wider" style={{ color: subtextColor }}>Primary Channel</span>
          <p className="text-[10px] font-medium mt-0.5" style={{ color: textColor }}>{topRisk.channel}</p>
          <p className="text-[8px]" style={{ color: subtextColor }}>High signal volume</p>
        </div>
      </div>

      {/* AI Insight */}
      <div 
        className="mt-3 rounded-lg p-2.5"
        style={{ 
          background: isDarkMode ? 'linear-gradient(to right, rgba(245, 158, 11, 0.1), transparent)' : 'rgba(245, 158, 11, 0.08)',
          borderLeft: '2px solid rgb(245, 158, 11)'
        }}
      >
        <p className="text-[10px] leading-relaxed" style={{ color: isDarkMode ? 'rgb(212, 212, 216)' : 'rgb(63, 63, 70)' }}>
          <span className="font-bold" style={{ color: 'rgb(245, 158, 11)' }}>AI:</span> '{topRisk.name.split('/')[0].trim()}' risk crossed threshold ({CRITICAL_THRESHOLD}%) via <strong style={{ color: textColor }}>{topRisk.channel}</strong>. 
          Trigger: <em>{topRisk.keyword}</em> in {topRisk.category}.
        </p>
      </div>
    </div>
  );
}
