'use client';

import { useState, useEffect, useMemo, useRef } from 'react';
import { ChevronDown } from 'lucide-react';
import InsightCard from './InsightCard';
import TrustRiskScore from './TrustRiskScore';
import LogisticsBreachPlot from './LogisticsBreachPlot';
import MarketplaceRadar from './MarketplaceRadar';
import GovernanceGrid from './GovernanceGrid';
import ComplianceThemeDriftPlot, { getDriftConfig, TimeFilter } from './ComplianceThemeDriftPlot';
import DriftDetailPanel from './DriftDetailPanel';
import { complianceInsights } from '@/lib/ecom-compliance';

export default function ComplianceInsights() {
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [selectedDriftCategory, setSelectedDriftCategory] = useState<string | null>(null);
  const [timeFilter, setTimeFilter] = useState<TimeFilter>('24h');
  const [selectedChannel, setSelectedChannel] = useState<string>('All Channels');
  const [isChannelDropdownOpen, setIsChannelDropdownOpen] = useState(false);
  const channelDropdownRef = useRef<HTMLDivElement>(null);

  const channels = ['All Channels', 'Email', 'Chat', 'Ticket', 'Voice (Inbound)', 'Voice (Outbound)', 'Social Media'];

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
    
    const observer = new MutationObserver(() => {
      setIsDarkMode(document.documentElement.classList.contains('dark'));
    });
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });
    
    return () => {
      window.removeEventListener('storage', checkTheme);
      observer.disconnect();
    };
  }, []);

  // Close channel dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (channelDropdownRef.current && !channelDropdownRef.current.contains(event.target as Node)) {
        setIsChannelDropdownOpen(false);
      }
    };

    if (isChannelDropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => {
        document.removeEventListener('mousedown', handleClickOutside);
      };
    }
  }, [isChannelDropdownOpen]);

  const driftConfig = useMemo(() => getDriftConfig(timeFilter), [timeFilter]);

  // Filter and sort insights based on selected channel and severity
  const filteredInsights = useMemo(() => {
    let filtered = complianceInsights;
    
    // Filter by channel if not "All Channels"
    if (selectedChannel !== 'All Channels') {
      const channelToFilter: string = selectedChannel;
      filtered = complianceInsights.filter(insight => 
        insight.channels.includes(channelToFilter as 'Chat' | 'Voice' | 'Voice (Inbound)' | 'Voice (Outbound)' | 'Email' | 'Ticket' | 'Social Media')
      );
    }
    
    // Sort by severity: CRITICAL > HIGH > MEDIUM > LOW
    const severityOrder: Record<string, number> = {
      'CRITICAL': 0,
      'HIGH': 1,
      'MEDIUM': 2,
      'LOW': 3
    };
    
    return filtered.sort((a, b) => {
      return severityOrder[a.severity] - severityOrder[b.severity];
    });
  }, [selectedChannel]);

  const criticalCount = filteredInsights.filter(i => i.severity === 'CRITICAL').length;
  const highCount = filteredInsights.filter(i => i.severity === 'HIGH').length;

  const containerBg = isDarkMode ? 'rgb(13, 13, 13)' : 'rgb(255, 255, 255)';
  const containerBorder = isDarkMode ? 'rgb(31, 31, 31)' : 'rgb(229, 231, 235)';
  const headerColor = isDarkMode ? 'rgb(255, 255, 255)' : 'rgb(17, 24, 39)';
  const subtextColor = isDarkMode ? 'rgb(156, 163, 175)' : 'rgb(75, 85, 99)';
  const scrollbarColor = isDarkMode ? 'rgb(51, 51, 51) rgb(26, 26, 26)' : 'rgb(203, 213, 225) rgb(241, 245, 249)';

  return (
    <div className="space-y-4">
      {/* Row 1: Trust Risk Score + AI Insights Cards */}
      <div className="flex gap-4">
        {/* Left - Trust Risk Score */}
        <div className="flex-shrink-0 w-96">
          <TrustRiskScore timeFilter={timeFilter} />
        </div>

        {/* Right - AI Post-Interaction Insights */}
        <div 
          className="flex-1 rounded-2xl p-5 min-w-0" 
          style={{ backgroundColor: containerBg, border: `1px solid ${containerBorder}` }}
        >
          <div className="space-y-3 transition-all duration-500 opacity-100 translate-y-0">
            {/* Header */}
            <div className="flex items-center justify-between gap-3 flex-wrap">
              <div className="flex items-center gap-3 flex-wrap">
                <h2 className="text-base font-semibold flex items-center gap-2" style={{ color: headerColor }}>
                  <span className="text-base">✨</span>
                  AI Post-Interaction Compliance Insights
                </h2>
                {criticalCount > 0 && (
                  <span 
                    className="text-[10px] px-2 py-0.5 rounded-full tracking-wide uppercase font-medium" 
                    style={{ 
                      backgroundColor: isDarkMode ? 'rgba(239, 68, 68, 0.2)' : 'rgba(239, 68, 68, 0.12)', 
                      color: isDarkMode ? 'rgb(252, 165, 165)' : 'rgb(185, 28, 28)' 
                    }}
                  >
                    {criticalCount} Critical
                  </span>
                )}
                {highCount > 0 && (
                  <span 
                    className="text-[10px] px-2 py-0.5 rounded-full tracking-wide uppercase font-medium" 
                    style={{ 
                      backgroundColor: isDarkMode ? 'rgba(251, 146, 60, 0.2)' : 'rgba(249, 115, 22, 0.12)', 
                      color: isDarkMode ? 'rgb(253, 186, 116)' : 'rgb(194, 65, 12)' 
                    }}
                  >
                    {highCount} High
                  </span>
                )}
              </div>
              
              {/* Channel Dropdown */}
              <div className="relative" ref={channelDropdownRef}>
                <button
                  onClick={() => setIsChannelDropdownOpen(!isChannelDropdownOpen)}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-200"
                  style={{ 
                    backgroundColor: isDarkMode ? 'rgb(39, 39, 42)' : 'rgb(244, 244, 245)',
                    color: headerColor,
                    border: `1px solid ${containerBorder}`
                  }}
                >
                  {selectedChannel}
                  <ChevronDown 
                    className={`w-3.5 h-3.5 transition-transform duration-200 ${isChannelDropdownOpen ? 'rotate-180' : ''}`} 
                    style={{ color: subtextColor }}
                  />
                </button>
                
                {isChannelDropdownOpen && (
                  <div 
                    className="absolute right-0 top-full mt-1 z-50 rounded-lg shadow-xl overflow-hidden min-w-[160px]"
                    style={{ 
                      backgroundColor: isDarkMode ? 'rgb(24, 24, 27)' : 'rgb(255, 255, 255)',
                      border: `1px solid ${containerBorder}`
                    }}
                  >
                    {channels.map((channel) => (
                      <button
                        key={channel}
                        onClick={() => {
                          setSelectedChannel(channel);
                          setIsChannelDropdownOpen(false);
                        }}
                        className="w-full text-left px-3 py-2 text-xs font-medium transition-colors duration-150 flex items-center gap-2"
                        style={{ 
                          backgroundColor: selectedChannel === channel 
                            ? (isDarkMode ? 'rgba(83, 50, 255, 0.2)' : 'rgba(83, 50, 255, 0.1)')
                            : 'transparent',
                          color: selectedChannel === channel ? 'rgb(83, 50, 255)' : headerColor,
                        }}
                        onMouseEnter={(e) => {
                          if (selectedChannel !== channel) {
                            e.currentTarget.style.backgroundColor = isDarkMode ? 'rgb(39, 39, 42)' : 'rgb(244, 244, 245)';
                          }
                        }}
                        onMouseLeave={(e) => {
                          if (selectedChannel !== channel) {
                            e.currentTarget.style.backgroundColor = 'transparent';
                          }
                        }}
                      >
                        {selectedChannel === channel && (
                          <span 
                            className="w-1.5 h-1.5 rounded-full" 
                            style={{ backgroundColor: 'rgb(83, 50, 255)' }}
                          ></span>
                        )}
                        <span>{channel}</span>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Subtext */}
            <p className="text-[11px]" style={{ color: subtextColor }}>
              Live detection of compliance violations, policy breaches, and operational risk signals present in customer communications.
            </p>

            {/* Cards Container */}
            <div 
              className="flex gap-3 overflow-x-auto pb-6 pt-6 items-stretch scrollbar-thin"
              style={{ scrollbarColor, height: '455px', minHeight: '455px' }}
            >
              {filteredInsights.map((insight, index) => (
                <InsightCard 
                  key={insight.id} 
                  insight={insight} 
                  delay={index * 50} 
                />
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Row 2: Marketplace Radar + Logistics + Governance Grid */}
      <div className="grid grid-cols-3 gap-4">
        <MarketplaceRadar />
        <LogisticsBreachPlot />
        <GovernanceGrid />
      </div>

      {/* Row 3: Compliance Theme Drift Plot + Detail Panel */}
      <div className="grid grid-cols-12 gap-4">
        <div className="col-span-7 flex" style={{ minHeight: '500px' }}>
          <ComplianceThemeDriftPlot 
            onCategoryClick={setSelectedDriftCategory}
            selectedCategory={selectedDriftCategory}
            timeFilter={timeFilter}
          />
        </div>
        <div className="col-span-5 flex" style={{ minHeight: '500px', height: '500px' }}>
          <DriftDetailPanel 
            selectedCategory={selectedDriftCategory}
            onClose={() => setSelectedDriftCategory(null)}
            isDarkMode={isDarkMode}
            driftConfig={driftConfig}
          />
        </div>
      </div>
    </div>
  );
}
