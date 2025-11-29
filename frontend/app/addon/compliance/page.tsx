'use client';

import { useState, useEffect } from 'react';
import { Calendar, Settings, Clock, Users } from 'lucide-react';
import { ComplianceScoreMeter } from '@/components/compliance/ComplianceScoreMeter';
import { ViolationCategoryChart } from '@/components/compliance/ViolationCategoryChart';
import { ComplianceIssuesTable } from '@/components/compliance/ComplianceIssuesTable';
import { RiskAlertPanel } from '@/components/compliance/RiskAlertPanel';
import { AgentWatchlist } from '@/components/compliance/AgentWatchlist';
import { ComplianceInsightsCards } from '@/components/compliance/ComplianceInsightsCards';
import { ActiveRisksTable } from '@/components/compliance/ActiveRisksTable';
import {
  TimeFilter,
  complianceScoreData,
  violationCategoryData,
  complianceIssuesData,
  riskAlertsData
} from '@/lib/compliance/complianceData';

export default function CompliancePage() {
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
              Compliance Overview Dashboard
            </h1>
            <p className="text-sm flex items-center gap-2" style={{ color: '#939394' }}>
              <span>Real-time compliance health monitoring and risk assessment</span>
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

        {/* AI Post-Interaction Compliance Insights + Compliance Health Score */}
        <div className="grid grid-cols-1 xl:grid-cols-4 gap-6 mb-6">
          {/* AI Insights Cards - Takes 3 columns */}
          <div 
            className="xl:col-span-3 rounded-2xl p-6"
            style={{ 
              backgroundColor: isDarkMode ? '#0d0d0d' : '#FFFFFF',
              border: `1px solid ${isDarkMode ? '#1f1f1f' : '#E5E5E5'}`
            }}
          >
            <ComplianceInsightsCards isDarkMode={isDarkMode} />
          </div>

          {/* Compliance Score Meter - Takes 1 column */}
          <div className="xl:col-span-1">
            <ComplianceScoreMeter 
              data={complianceScoreData[timeFilter]} 
              isDarkMode={isDarkMode} 
            />
          </div>
        </div>

        {/* Violations & Risk Alert Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          {/* Violations by Category */}
          <ViolationCategoryChart 
            data={violationCategoryData[timeFilter]} 
            isDarkMode={isDarkMode} 
          />

          {/* Risk Alert Panel */}
          <RiskAlertPanel 
            data={riskAlertsData} 
            isDarkMode={isDarkMode} 
          />
        </div>

        {/* Active Compliance Issues & Active Risks - Side by Side */}
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 mb-6">
          {/* Issues Table */}
          <ComplianceIssuesTable 
            data={complianceIssuesData} 
            isDarkMode={isDarkMode} 
          />

          {/* Active Risks Table */}
          <ActiveRisksTable 
            isDarkMode={isDarkMode} 
          />
        </div>

        {/* Agent Watchlist */}
        <div className="mb-6">
          <AgentWatchlist 
            isDarkMode={isDarkMode} 
          />
        </div>

        {/* Footer */}
        <div 
          className="mt-8 pt-6 border-t flex items-center justify-between"
          style={{ borderColor: isDarkMode ? '#2a2a2a' : '#E5E5E5' }}
        >
          <p className="text-xs" style={{ color: '#939394' }}>
            © 2024 Yaaralabs Compliance Monitoring System • Data refreshed every 5 minutes
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