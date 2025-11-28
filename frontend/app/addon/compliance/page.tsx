'use client';

import { useState, useEffect } from 'react';
import { Calendar, Settings, TrendingUp, TrendingDown, AlertTriangle, CheckCircle2, Clock, Users } from 'lucide-react';
import { ComplianceScoreMeter } from '@/components/compliance/ComplianceScoreMeter';
import { ViolationCategoryChart } from '@/components/compliance/ViolationCategoryChart';
import { ComplianceIssuesTable } from '@/components/compliance/ComplianceIssuesTable';
import { InsightsPanel } from '@/components/compliance/InsightsPanel';
import { RiskAlertPanel } from '@/components/compliance/RiskAlertPanel';
import { AgentWatchlist } from '@/components/compliance/AgentWatchlist';
import { RegionalComplianceMap } from '@/components/compliance/RegionalComplianceMap';
import {
  TimeFilter,
  complianceScoreData,
  violationCategoryData,
  complianceIssuesData,
  complianceInsightsData,
  riskAlertsData,
  complianceMetricsData
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

  const metrics = complianceMetricsData[timeFilter];

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

        {/* Quick Stats Row */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-6">
          {[
            { 
              label: 'Total Violations', 
              value: metrics.totalViolations.toLocaleString(), 
              icon: AlertTriangle, 
              color: '#ef4444',
              trend: -12
            },
            { 
              label: 'Resolved Today', 
              value: metrics.resolvedToday.toLocaleString(), 
              icon: CheckCircle2, 
              color: '#22c55e',
              trend: 8
            },
            { 
              label: 'Pending Review', 
              value: metrics.pendingReview.toLocaleString(), 
              icon: Clock, 
              color: '#f97316',
              trend: -5
            },
            { 
              label: 'Critical Issues', 
              value: metrics.criticalIssues.toLocaleString(), 
              icon: AlertTriangle, 
              color: '#ef4444',
              trend: 3
            },
            { 
              label: 'Avg Resolution', 
              value: metrics.avgResolutionTime, 
              icon: Clock, 
              color: '#5332FF',
              trend: -10
            },
            { 
              label: 'Compliance Rate', 
              value: `${metrics.complianceRate}%`, 
              icon: CheckCircle2, 
              color: '#22c55e',
              trend: 2.5
            }
          ].map((stat, index) => (
            <div
              key={stat.label}
              className="rounded-xl p-4 transition-all duration-300 hover:scale-[1.02]"
              style={{
                backgroundColor: isDarkMode ? '#0d0d0d' : '#FFFFFF',
                border: `1px solid ${isDarkMode ? '#2a2a2a' : '#E5E5E5'}`,
                boxShadow: isDarkMode 
                  ? '0 2px 12px rgba(0, 0, 0, 0.3)'
                  : '0 2px 12px rgba(0, 0, 0, 0.04)',
                animationDelay: `${index * 50}ms`
              }}
            >
              <div className="flex items-start justify-between mb-2">
                <div 
                  className="p-2 rounded-lg"
                  style={{ backgroundColor: `${stat.color}15` }}
                >
                  <stat.icon className="w-4 h-4" style={{ color: stat.color }} />
                </div>
                <div 
                  className="flex items-center gap-1 text-xs font-medium"
                  style={{ color: stat.trend > 0 ? '#ef4444' : '#22c55e' }}
                >
                  {stat.trend > 0 ? (
                    <TrendingUp className="w-3 h-3" />
                  ) : (
                    <TrendingDown className="w-3 h-3" />
                  )}
                  <span>{Math.abs(stat.trend)}%</span>
                </div>
              </div>
              <p 
                className="text-2xl font-bold mb-1"
                style={{ color: isDarkMode ? '#FFFFFF' : '#010101' }}
              >
                {stat.value}
              </p>
              <p className="text-xs" style={{ color: '#939394' }}>
                {stat.label}
              </p>
            </div>
          ))}
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          {/* Left Column - Compliance Health */}
          <div className="xl:col-span-2 space-y-6">
            {/* Score & Violations Row */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-stretch">
              {/* Compliance Score Meter */}
              <div className="h-full">
                <ComplianceScoreMeter 
                  data={complianceScoreData[timeFilter]} 
                  isDarkMode={isDarkMode} 
                />
              </div>
              
              {/* Violations by Category */}
              <div className="h-full">
                <ViolationCategoryChart 
                  data={violationCategoryData[timeFilter]} 
                  isDarkMode={isDarkMode} 
                />
              </div>
            </div>

            {/* Issues Table */}
            <ComplianceIssuesTable 
              data={complianceIssuesData} 
              isDarkMode={isDarkMode} 
            />
          </div>

          {/* Right Column - Insights & Risk Alerts */}
          <div className="space-y-6">
            {/* AI Insights Panel */}
            <InsightsPanel 
              data={complianceInsightsData} 
              isDarkMode={isDarkMode} 
            />

            {/* Risk Alert Panel */}
            <RiskAlertPanel 
              data={riskAlertsData} 
              isDarkMode={isDarkMode} 
            />

            {/* Agent Watchlist */}
            <AgentWatchlist 
              isDarkMode={isDarkMode} 
            />
          </div>
        </div>

        {/* Regional Compliance Map */}
        <div className="mt-6">
          <RegionalComplianceMap isDarkMode={isDarkMode} />
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

