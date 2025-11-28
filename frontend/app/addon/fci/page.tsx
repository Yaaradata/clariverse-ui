'use client';

import { useState, useEffect } from 'react';
import { Calendar, Settings, Users, Clock } from 'lucide-react';
import { FCIKPICards } from '@/components/FCI/FCIKPICards';
import { FailureClusters } from '@/components/FCI/FailureClusters';
import { SmartAgentActionList } from '@/components/FCI/SmartAgentActionList';
import { IntentScoreHeatmap } from '@/components/FCI/IntentScoreHeatmap';
import {
  fciKPIData,
  fciClusters
} from '@/lib/fci-lib/fciData';
import {
  agentActionData
} from '@/lib/fci-lib/fciAdvancedData';

type TimeFilter = '24h' | '7d' | '30d';

export default function FCIPage() {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [timeFilter, setTimeFilter] = useState<TimeFilter>('24h');
  const [isLoading, setIsLoading] = useState(false);
  const [lastRefresh, setLastRefresh] = useState(new Date());

  // Check for dark mode from parent
  useEffect(() => {
    const checkTheme = () => {
      const theme = localStorage.getItem('theme');
      setIsDarkMode(theme === 'dark');
    };
    
    checkTheme();
    
    // Listen for storage changes
    window.addEventListener('storage', checkTheme);
    
    // Poll for changes (since we're in same window)
    const interval = setInterval(checkTheme, 100);
    
    return () => {
      window.removeEventListener('storage', checkTheme);
      clearInterval(interval);
    };
  }, []);

  const handleTimeFilterChange = (filter: TimeFilter) => {
    setIsLoading(true);
    setTimeFilter(filter);
    setTimeout(() => setIsLoading(false), 500);
  };

  const timeFilterOptions: { value: TimeFilter; label: string }[] = [
    { value: '24h', label: 'Last 24 Hours' },
    { value: '7d', label: 'Last 7 Days' },
    { value: '30d', label: 'Last 30 Days' }
  ];

  return (
    <div 
      className="min-h-screen"
      style={{ backgroundColor: isDarkMode ? '#010101' : '#F5F5F5' }}
    >
      <div className="container mx-auto px-6 py-6">
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-6">
          <div>
            <h1
              className="text-2xl font-bold mb-2"
              style={{ color: isDarkMode ? '#FFFFFF' : '#010101' }}
            >
              Failed Customer Interaction (FCI) Dashboard
            </h1>
            <p className="text-sm flex items-center gap-2" style={{ color: '#939394' }}>
              <span>Real-time FCI monitoring and root cause analysis</span>
              <span className="flex items-center gap-1 text-xs" suppressHydrationWarning>
                <Clock className="w-3 h-3" />
                Updated {lastRefresh.toLocaleTimeString()}
              </span>
            </p>
          </div>

          {/* Controls */}
          <div className="flex items-center gap-3">
            {/* Time Filter */}
            <div 
              className="flex items-center rounded-xl p-1"
              style={{ backgroundColor: isDarkMode ? '#1a1a1a' : '#FFFFFF', border: `1px solid ${isDarkMode ? '#2a2a2a' : '#E5E5E5'}` }}
            >
              {timeFilterOptions.map((option) => (
                <button
                  key={option.value}
                  onClick={() => handleTimeFilterChange(option.value)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                    timeFilter === option.value ? 'shadow-sm' : ''
                  }`}
                  style={{
                    backgroundColor: timeFilter === option.value 
                      ? '#5332FF' 
                      : 'transparent',
                    color: timeFilter === option.value 
                      ? '#FFFFFF' 
                      : (isDarkMode ? '#D6D9D8' : '#939394')
                  }}
                >
                  <Calendar className="w-4 h-4" />
                  {option.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* KPI Cards Row (includes AI Summary Wall) */}
        <div className="mb-6">
          <FCIKPICards data={fciKPIData} isDarkMode={isDarkMode} />
        </div>

        {/* What's Failing - Full Width */}
        <div 
          className="rounded-2xl mb-6"
          style={{ 
            backgroundColor: isDarkMode ? '#0d0d0d' : '#FFFFFF',
            border: `1px solid ${isDarkMode ? '#1f1f1f' : '#E5E5E5'}`
          }}
        >
          <FailureClusters clusters={fciClusters} isDarkMode={isDarkMode} />
        </div>

        {/* Agent Actions (Full Width) */}
        <div 
          className="rounded-2xl mb-6"
          style={{ 
            backgroundColor: isDarkMode ? '#0d0d0d' : '#FFFFFF',
            border: `1px solid ${isDarkMode ? '#1f1f1f' : '#E5E5E5'}`
          }}
        >
          <SmartAgentActionList data={agentActionData} isDarkMode={isDarkMode} />
        </div>

        {/* Cross-Intent Performance Heatmap */}
        <div 
          className="rounded-2xl p-6 mb-6"
          style={{ 
            backgroundColor: isDarkMode ? '#0d0d0d' : '#FFFFFF',
            border: `1px solid ${isDarkMode ? '#1f1f1f' : '#E5E5E5'}`
          }}
        >
          <IntentScoreHeatmap isDarkMode={isDarkMode} />
        </div>

        {/* Footer */}
        <div 
          className="mt-8 pt-6 border-t flex items-center justify-between"
          style={{ borderColor: isDarkMode ? '#2a2a2a' : '#E5E5E5' }}
        >
          <p className="text-xs" style={{ color: '#939394' }}>
            © 2024 Yaaralabs FCI Monitoring System • Data refreshed every 5 minutes
          </p>
          <div className="flex items-center gap-4">
            <button 
              className="text-xs flex items-center gap-1.5 hover:opacity-80 transition-opacity"
              style={{ color: '#939394' }}
            >
              <Settings className="w-3.5 h-3.5" />
              Configure Alerts
            </button>
            <button 
              className="text-xs flex items-center gap-1.5 hover:opacity-80 transition-opacity"
              style={{ color: '#939394' }}
            >
              <Users className="w-3.5 h-3.5" />
              Team Settings
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
