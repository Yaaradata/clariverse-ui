'use client';

import { useState, useEffect, useMemo } from 'react';
import { Package, TrendingUp, AlertCircle, Phone, MapPin } from 'lucide-react';

type TimeFilter = '24h' | '7d' | '30d';

// Generate data based on time filter - 4 stacks now
const generateBreachData = (filter: TimeFilter) => {
  if (filter === '24h') {
    return [
      { time: '00', packaging: 5, tampering: 8, lastMile: 20, reverse: 6 },
      { time: '02', packaging: 3, tampering: 5, lastMile: 25, reverse: 4 },
      { time: '04', packaging: 2, tampering: 3, lastMile: 15, reverse: 2 },
      { time: '06', packaging: 4, tampering: 6, lastMile: 28, reverse: 8 },
      { time: '08', packaging: 8, tampering: 12, lastMile: 45, reverse: 12 },
      { time: '10', packaging: 12, tampering: 18, lastMile: 55, reverse: 16 },
      { time: '12', packaging: 10, tampering: 15, lastMile: 60, reverse: 14 },
      { time: '14', packaging: 14, tampering: 22, lastMile: 72, reverse: 18 },
      { time: '16', packaging: 12, tampering: 20, lastMile: 65, reverse: 20 },
      { time: '18', packaging: 9, tampering: 14, lastMile: 50, reverse: 15 },
      { time: '20', packaging: 6, tampering: 10, lastMile: 38, reverse: 10 },
      { time: '22', packaging: 4, tampering: 7, lastMile: 28, reverse: 7 },
    ];
  } else if (filter === '7d') {
    return [
      { time: 'Mon', packaging: 45, tampering: 68, lastMile: 180, reverse: 48 },
      { time: 'Tue', packaging: 52, tampering: 75, lastMile: 210, reverse: 55 },
      { time: 'Wed', packaging: 38, tampering: 58, lastMile: 165, reverse: 42 },
      { time: 'Thu', packaging: 58, tampering: 82, lastMile: 240, reverse: 62 },
      { time: 'Fri', packaging: 65, tampering: 95, lastMile: 280, reverse: 72 },
      { time: 'Sat', packaging: 78, tampering: 115, lastMile: 320, reverse: 85 },
      { time: 'Sun', packaging: 72, tampering: 108, lastMile: 298, reverse: 78 },
    ];
  } else {
    return [
      { time: 'W1', packaging: 320, tampering: 480, lastMile: 1250, reverse: 340 },
      { time: 'W2', packaging: 355, tampering: 520, lastMile: 1380, reverse: 380 },
      { time: 'W3', packaging: 298, tampering: 445, lastMile: 1180, reverse: 320 },
      { time: 'W4', packaging: 385, tampering: 565, lastMile: 1480, reverse: 410 },
    ];
  }
};

const getFilterInfo = (filter: TimeFilter) => {
  switch (filter) {
    case '24h':
      return { 
        label: 'HOURLY', 
        peakTime: '14:00 - 16:00',
        trend: '+12% vs yesterday',
        total: '1,240',
        topZone: 'North'
      };
    case '7d':
      return { 
        label: 'DAILY', 
        peakTime: 'Weekends (Sat-Sun)',
        trend: '+8% vs last week',
        total: '8,680',
        topZone: 'West'
      };
    case '30d':
      return { 
        label: 'WEEKLY', 
        peakTime: 'Week 4',
        trend: '+5% vs last month',
        total: '34,720',
        topZone: 'North'
      };
  }
};

export default function LogisticsBreachPlot() {
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

  const breachData = useMemo(() => generateBreachData(timeFilter), [timeFilter]);
  const filterInfo = useMemo(() => getFilterInfo(timeFilter), [timeFilter]);
  const maxTotal = useMemo(() => Math.max(...breachData.map(d => d.packaging + d.tampering + d.lastMile + d.reverse)), [breachData]);

  const containerBg = isDarkMode ? 'rgb(13, 13, 13)' : 'rgb(255, 255, 255)';
  const containerBorder = isDarkMode ? 'rgb(31, 31, 31)' : 'rgb(229, 231, 235)';
  const textColor = isDarkMode ? 'rgb(255, 255, 255)' : 'rgb(17, 24, 39)';
  const subtextColor = isDarkMode ? 'rgb(156, 163, 175)' : 'rgb(75, 85, 99)';
  const labelColor = isDarkMode ? 'rgb(82, 82, 91)' : 'rgb(107, 114, 128)';

  // Stack colors
  const colors = {
    packaging: 'rgb(59, 130, 246)',    // Blue - Packaging Norm Violations
    tampering: 'rgb(244, 63, 94)',     // Rose - Tampering Evidence
    lastMile: 'rgb(249, 115, 22)',     // Orange - OBD Failures
    reverse: 'rgb(139, 92, 246)',      // Purple - Reverse Logistics Fraud
  };

  return (
    <div 
      className="rounded-2xl p-5 flex flex-col h-full"
      style={{ backgroundColor: containerBg, border: `1px solid ${containerBorder}` }}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <div>
          <h3 className="text-sm font-semibold flex items-center gap-2" style={{ color: textColor }}>
            <Package className="w-4 h-4" style={{ color: colors.lastMile }} />
            Logistics Custody Chain Fractures
            <span 
              className="text-[8px] px-1.5 py-0.5 rounded font-medium"
              style={{ backgroundColor: isDarkMode ? 'rgb(39, 39, 42)' : 'rgb(244, 244, 245)', color: subtextColor }}
            >
              {filterInfo.label}
            </span>
          </h3>
          <p className="text-[10px] mt-0.5" style={{ color: subtextColor }}>
            Custody violations across logistics journey
          </p>
        </div>
        <div className="text-right">
          <span className="text-lg font-bold font-mono" style={{ color: textColor }}>{filterInfo.total}</span>
          <div className="flex items-center justify-end gap-1 text-[9px]" style={{ color: 'rgb(239, 68, 68)' }}>
            <TrendingUp className="w-2.5 h-2.5" />
            {filterInfo.trend}
          </div>
        </div>
      </div>

      {/* Legend - 4 Stacks */}
      <div className="flex gap-3 mb-3 flex-wrap">
        <div className="flex items-center gap-1">
          <div className="w-2 h-2 rounded-sm" style={{ backgroundColor: colors.packaging }}></div>
          <span className="text-[9px]" style={{ color: subtextColor }}>Packaging</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-2 h-2 rounded-sm" style={{ backgroundColor: colors.tampering }}></div>
          <span className="text-[9px]" style={{ color: subtextColor }}>Tampering</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-2 h-2 rounded-sm" style={{ backgroundColor: colors.lastMile }}></div>
          <span className="text-[9px]" style={{ color: subtextColor }}>Last Mile (OBD)</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-2 h-2 rounded-sm" style={{ backgroundColor: colors.reverse }}></div>
          <span className="text-[9px]" style={{ color: subtextColor }}>Reverse Fraud</span>
        </div>
      </div>

      {/* Stacked Bar Chart */}
      <div className="flex items-end gap-1 h-[120px] mt-5">
        {breachData.map((d, i) => {
          const total = d.packaging + d.tampering + d.lastMile + d.reverse;
          const heightPx = (total / maxTotal) * 100;
          return (
            <div key={i} className="flex-1 flex flex-col items-center justify-end h-full group">
              <div 
                className="w-full rounded-t flex flex-col-reverse overflow-hidden transition-all duration-300 hover:opacity-80 cursor-pointer"
                style={{ height: `${heightPx}px` }}
                title={`Packaging: ${d.packaging} | Tampering: ${d.tampering} | Last Mile: ${d.lastMile} | Reverse: ${d.reverse}`}
              >
                <div style={{ height: `${(d.packaging / total) * 100}%`, backgroundColor: colors.packaging }}></div>
                <div style={{ height: `${(d.tampering / total) * 100}%`, backgroundColor: colors.tampering }}></div>
                <div style={{ height: `${(d.lastMile / total) * 100}%`, backgroundColor: colors.lastMile }}></div>
                <div className="rounded-t" style={{ height: `${(d.reverse / total) * 100}%`, backgroundColor: colors.reverse }}></div>
              </div>
              <span className="text-[8px] mt-1" style={{ color: labelColor }}>{d.time}</span>
            </div>
          );
        })}
      </div>

      {/* Micro Information Row */}
      <div className="grid grid-cols-3 gap-2 mt-8 pt-3" style={{ borderTop: `1px solid ${containerBorder}` }}>
        <div>
          <span className="text-[8px] uppercase tracking-wider flex items-center gap-1" style={{ color: subtextColor }}>
            <Phone className="w-2.5 h-2.5" /> Primary Channel
          </span>
          <p className="text-[10px] font-medium mt-0.5" style={{ color: textColor }}>Voice Transcripts</p>
          <p className="text-[8px]" style={{ color: subtextColor }}>High Confidence</p>
        </div>
        <div>
          <span className="text-[8px] uppercase tracking-wider" style={{ color: subtextColor }}>Peak Fracture</span>
          <p className="text-[10px] font-medium mt-0.5" style={{ color: colors.lastMile }}>{filterInfo.peakTime}</p>
          <p className="text-[8px]" style={{ color: subtextColor }}>OBD Failures</p>
        </div>
        <div>
          <span className="text-[8px] uppercase tracking-wider flex items-center gap-1" style={{ color: subtextColor }}>
            <MapPin className="w-2.5 h-2.5" /> Top Zone
          </span>
          <p className="text-[10px] font-medium mt-0.5" style={{ color: textColor }}>{filterInfo.topZone}</p>
          <p className="text-[8px]" style={{ color: subtextColor }}>62% of volume</p>
        </div>
      </div>

      {/* AI Insight */}
      <div 
        className="mt-8 rounded-lg p-2.5 flex gap-2"
        style={{ 
          background: isDarkMode ? 'linear-gradient(to right, rgba(249, 115, 22, 0.1), transparent)' : 'rgba(249, 115, 22, 0.08)',
          borderLeft: '2px solid rgb(249, 115, 22)'
        }}
      >
        <AlertCircle className="w-3.5 h-3.5 flex-shrink-0 mt-0.5" style={{ color: 'rgb(249, 115, 22)' }} />
        <p className="text-[10px] leading-relaxed" style={{ color: isDarkMode ? 'rgb(212, 212, 216)' : 'rgb(63, 63, 70)' }}>
          <span className="font-bold" style={{ color: 'rgb(249, 115, 22)' }}>AI:</span> Custody fracture in <strong style={{ color: textColor }}>Last Mile (OBD)</strong>; 
          spike correlates with 3PL 'Shadowfax' during peak slots. Keyword: <em>"Seal broken"</em>
        </p>
      </div>
    </div>
  );
}
