'use client';

import { useState, useEffect, useMemo, useRef } from 'react';
import { Package, AlertCircle, Phone, MapPin, ChevronDown } from 'lucide-react';

type TimeFilter = '24h' | '7d' | '30d';
type Region = 'all' | 'tier1' | 'tier2' | 'tier3' | 'northeast' | 'islands';

const regionLabels: Record<Region, string> = {
  all: 'All Regions',
  tier1: 'Tier 1 Metros',
  tier2: 'Tier 2 Cities',
  tier3: 'Tier 3 & Rural',
  northeast: 'Northeast & Hill States',
  islands: 'Islands & Remote Areas',
};

// Multipliers for each region to generate varied data
const regionMultipliers: Record<Region, { packaging: number; tampering: number; lastMile: number; reverse: number }> = {
  all: { packaging: 1, tampering: 1, lastMile: 1, reverse: 1 },
  tier1: { packaging: 1.2, tampering: 0.8, lastMile: 1.5, reverse: 0.7 },
  tier2: { packaging: 1.0, tampering: 1.1, lastMile: 1.2, reverse: 1.0 },
  tier3: { packaging: 0.8, tampering: 1.5, lastMile: 0.9, reverse: 1.8 },
  northeast: { packaging: 0.6, tampering: 1.3, lastMile: 0.7, reverse: 2.2 },
  islands: { packaging: 0.4, tampering: 1.8, lastMile: 0.5, reverse: 2.5 },
};

// Generate data based on time filter and region - 4 stacks now
const generateBreachData = (filter: TimeFilter, region: Region) => {
  const mult = regionMultipliers[region];
  const applyMult = (base: { packaging: number; tampering: number; lastMile: number; reverse: number }) => ({
    packaging: Math.round(base.packaging * mult.packaging),
    tampering: Math.round(base.tampering * mult.tampering),
    lastMile: Math.round(base.lastMile * mult.lastMile),
    reverse: Math.round(base.reverse * mult.reverse),
  });

  if (filter === '24h') {
    return [
      { time: '00', ...applyMult({ packaging: 5, tampering: 8, lastMile: 20, reverse: 6 }) },
      { time: '02', ...applyMult({ packaging: 3, tampering: 5, lastMile: 25, reverse: 4 }) },
      { time: '04', ...applyMult({ packaging: 2, tampering: 3, lastMile: 15, reverse: 2 }) },
      { time: '06', ...applyMult({ packaging: 4, tampering: 6, lastMile: 28, reverse: 8 }) },
      { time: '08', ...applyMult({ packaging: 8, tampering: 12, lastMile: 45, reverse: 12 }) },
      { time: '10', ...applyMult({ packaging: 12, tampering: 18, lastMile: 55, reverse: 16 }) },
      { time: '12', ...applyMult({ packaging: 10, tampering: 15, lastMile: 60, reverse: 14 }) },
      { time: '14', ...applyMult({ packaging: 14, tampering: 22, lastMile: 72, reverse: 18 }) },
      { time: '16', ...applyMult({ packaging: 12, tampering: 20, lastMile: 65, reverse: 20 }) },
      { time: '18', ...applyMult({ packaging: 9, tampering: 14, lastMile: 50, reverse: 15 }) },
      { time: '20', ...applyMult({ packaging: 6, tampering: 10, lastMile: 38, reverse: 10 }) },
      { time: '22', ...applyMult({ packaging: 4, tampering: 7, lastMile: 28, reverse: 7 }) },
    ];
  } else if (filter === '7d') {
    return [
      { time: 'Mon', ...applyMult({ packaging: 45, tampering: 68, lastMile: 180, reverse: 48 }) },
      { time: 'Tue', ...applyMult({ packaging: 52, tampering: 75, lastMile: 210, reverse: 55 }) },
      { time: 'Wed', ...applyMult({ packaging: 38, tampering: 58, lastMile: 165, reverse: 42 }) },
      { time: 'Thu', ...applyMult({ packaging: 58, tampering: 82, lastMile: 240, reverse: 62 }) },
      { time: 'Fri', ...applyMult({ packaging: 65, tampering: 95, lastMile: 280, reverse: 72 }) },
      { time: 'Sat', ...applyMult({ packaging: 78, tampering: 115, lastMile: 320, reverse: 85 }) },
      { time: 'Sun', ...applyMult({ packaging: 72, tampering: 108, lastMile: 298, reverse: 78 }) },
    ];
  } else {
    return [
      { time: 'W1', ...applyMult({ packaging: 320, tampering: 480, lastMile: 1250, reverse: 340 }) },
      { time: 'W2', ...applyMult({ packaging: 355, tampering: 520, lastMile: 1380, reverse: 380 }) },
      { time: 'W3', ...applyMult({ packaging: 298, tampering: 445, lastMile: 1180, reverse: 320 }) },
      { time: 'W4', ...applyMult({ packaging: 385, tampering: 565, lastMile: 1480, reverse: 410 }) },
    ];
  }
};

// Region-specific info
const regionInfo: Record<Region, { 
  topIssue: string; 
  partner: string; 
  keyword: string;
  primaryChannel: string;
  channelConfidence: string;
  peakFracture: string;
}> = {
  all: { 
    topIssue: 'Last Mile (OBD)', 
    partner: 'Shadowfax', 
    keyword: 'Seal broken',
    primaryChannel: 'Voice Transcripts',
    channelConfidence: 'High Confidence',
    peakFracture: 'Evening Rush'
  },
  tier1: { 
    topIssue: 'Last Mile (OBD)', 
    partner: 'Delhivery', 
    keyword: 'Wrong address',
    primaryChannel: 'Chat',
    channelConfidence: 'Very High',
    peakFracture: 'Peak Hours'
  },
  tier2: { 
    topIssue: 'Tampering', 
    partner: 'Ecom Express', 
    keyword: 'Package opened',
    primaryChannel: 'Voice Transcripts',
    channelConfidence: 'High Confidence',
    peakFracture: 'Mid-day Surge'
  },
  tier3: { 
    topIssue: 'Reverse Fraud', 
    partner: 'Local Partner', 
    keyword: 'Empty box',
    primaryChannel: 'Ticket',
    channelConfidence: 'Medium',
    peakFracture: 'Post-Delivery'
  },
  northeast: { 
    topIssue: 'Reverse Fraud', 
    partner: 'India Post', 
    keyword: 'Stone inside',
    primaryChannel: 'Email',
    channelConfidence: 'Medium',
    peakFracture: 'Transit Delays'
  },
  islands: { 
    topIssue: 'Tampering', 
    partner: 'Air Cargo', 
    keyword: 'Water damage',
    primaryChannel: 'Social Media',
    channelConfidence: 'Low-Medium',
    peakFracture: 'Weather Events'
  },
};

const getFilterInfo = (filter: TimeFilter, region: Region, data: { packaging: number; tampering: number; lastMile: number; reverse: number }[]) => {
  const total = data.reduce((sum, d) => sum + d.packaging + d.tampering + d.lastMile + d.reverse, 0);
  
  const trendMap: Record<TimeFilter, Record<Region, string>> = {
    '24h': {
      all: '+12% vs yesterday',
      tier1: '+15% vs yesterday',
      tier2: '+8% vs yesterday',
      tier3: '+18% vs yesterday',
      northeast: '+22% vs yesterday',
      islands: '+28% vs yesterday',
    },
    '7d': {
      all: '+8% vs last week',
      tier1: '+6% vs last week',
      tier2: '+10% vs last week',
      tier3: '+14% vs last week',
      northeast: '+19% vs last week',
      islands: '+25% vs last week',
    },
    '30d': {
      all: '+5% vs last month',
      tier1: '+3% vs last month',
      tier2: '+7% vs last month',
      tier3: '+11% vs last month',
      northeast: '+15% vs last month',
      islands: '+20% vs last month',
    },
  };

  const peakMap: Record<TimeFilter, string> = {
    '24h': '14:00 - 16:00',
    '7d': 'Weekends (Sat-Sun)',
    '30d': 'Week 4',
  };

  const labelMap: Record<TimeFilter, string> = {
    '24h': 'HOURLY',
    '7d': 'DAILY',
    '30d': 'WEEKLY',
  };

  return { 
    label: labelMap[filter], 
    peakTime: peakMap[filter],
    trend: trendMap[filter][region],
    total: total.toLocaleString(),
  };
};

export default function LogisticsBreachPlot() {
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [timeFilter, setTimeFilter] = useState<TimeFilter>('24h');
  const [region, setRegion] = useState<Region>('all');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };

    if (isDropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isDropdownOpen]);

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

  const breachData = useMemo(() => generateBreachData(timeFilter, region), [timeFilter, region]);
  const filterInfo = useMemo(() => getFilterInfo(timeFilter, region, breachData), [timeFilter, region, breachData]);
  const maxTotal = useMemo(() => Math.max(...breachData.map(d => d.packaging + d.tampering + d.lastMile + d.reverse)), [breachData]);
  const currentRegionInfo = useMemo(() => regionInfo[region], [region]);

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
            Logistics Chain Fractures
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
        
        {/* Region Filter Dropdown */}
        <div className="relative" ref={dropdownRef}>
          <button
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-[10px] font-medium transition-all duration-200"
            style={{ 
              backgroundColor: isDarkMode ? 'rgb(39, 39, 42)' : 'rgb(244, 244, 245)',
              color: textColor,
              border: `1px solid ${containerBorder}`
            }}
          >
            <MapPin className="w-3 h-3" style={{ color: colors.lastMile }} />
            {regionLabels[region]}
            <ChevronDown className={`w-3 h-3 transition-transform duration-200 ${isDropdownOpen ? 'rotate-180' : ''}`} />
          </button>
          
          {isDropdownOpen && (
            <div 
              className="absolute right-0 top-full mt-1 z-50 rounded-lg shadow-xl overflow-hidden min-w-[180px]"
              style={{ 
                backgroundColor: isDarkMode ? 'rgb(24, 24, 27)' : 'rgb(255, 255, 255)',
                border: `1px solid ${containerBorder}`
              }}
            >
              {(Object.keys(regionLabels) as Region[]).map((r) => (
                <button
                  key={r}
                  onClick={() => {
                    setRegion(r);
                    setIsDropdownOpen(false);
                  }}
                  className="w-full text-left px-3 py-2 text-[10px] font-medium transition-colors duration-150 flex items-center gap-2"
                  style={{ 
                    backgroundColor: region === r 
                      ? (isDarkMode ? 'rgba(83, 50, 255, 0.2)' : 'rgba(83, 50, 255, 0.1)')
                      : 'transparent',
                    color: region === r ? 'rgb(83, 50, 255)' : textColor,
                  }}
                  onMouseEnter={(e) => {
                    if (region !== r) {
                      e.currentTarget.style.backgroundColor = isDarkMode ? 'rgb(39, 39, 42)' : 'rgb(244, 244, 245)';
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (region !== r) {
                      e.currentTarget.style.backgroundColor = 'transparent';
                    }
                  }}
                >
                  {region === r && <span className="w-1.5 h-1.5 rounded-full bg-[#5332FF]"></span>}
                  {regionLabels[r]}
                </button>
              ))}
            </div>
          )}
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
          <p className="text-[10px] font-medium mt-0.5" style={{ color: textColor }}>{currentRegionInfo.primaryChannel}</p>
          <p className="text-[8px]" style={{ color: subtextColor }}>{currentRegionInfo.channelConfidence}</p>
        </div>
        <div>
          <span className="text-[8px] uppercase tracking-wider" style={{ color: subtextColor }}>Peak Fracture</span>
          <p className="text-[10px] font-medium mt-0.5" style={{ color: colors.lastMile }}>{currentRegionInfo.peakFracture}</p>
          <p className="text-[8px]" style={{ color: subtextColor }}>{currentRegionInfo.topIssue}</p>
        </div>
        <div>
          <span className="text-[8px] uppercase tracking-wider flex items-center gap-1" style={{ color: subtextColor }}>
            <Package className="w-2.5 h-2.5" /> Top Partner
          </span>
          <p className="text-[10px] font-medium mt-0.5" style={{ color: textColor }}>{currentRegionInfo.partner}</p>
          <p className="text-[8px]" style={{ color: subtextColor }}>{region === 'all' ? '62% of volume' : regionLabels[region]}</p>
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
          <span style={{ color: 'rgb(249, 115, 22)' }}>✨</span> Custody fracture in <strong style={{ color: textColor }}>{currentRegionInfo.topIssue}</strong>; 
          spike correlates with 3PL &apos;{currentRegionInfo.partner}&apos; during peak slots. Keyword: <em>&quot;{currentRegionInfo.keyword}&quot;</em>
        </p>
      </div>
    </div>
  );
}
