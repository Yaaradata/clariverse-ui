'use client';

import { useState, useEffect } from 'react';
import { VendorDashboardData } from '@/lib/swedbank/vendor/types';
import { getVendorDashboardData } from '@/lib/swedbank/vendor/data';
import { getKPICards } from '@/lib/swedbank/vendor/kpiCards';
import { Card } from '@/components/ui/card';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Pie, PieChart, ResponsiveContainer, Cell } from '@/components/ui/chart';
import { getVendorSignalsData } from '@/lib/swedbank/vendor/vendorSignals';
import { VendorSignalsBarChart } from '@/components/vendor/VendorSignalsBarChart';
import { RedFlagDistributionChart } from '@/components/vendor/RedFlagDistributionChart';
import { VoCFrictionDrivers } from '@/components/vendor/VoCFrictionDrivers';
import { AIActionSuggestionWall } from '@/components/vendor/AIActionSuggestionWall';

export default function VendorDashboard() {
  const [data, setData] = useState<VendorDashboardData | null>(null);
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [hoveredOutcome, setHoveredOutcome] = useState<{ cardId: string; outcomeIndex: number } | null>(null);

  useEffect(() => {
    const dashboardData = getVendorDashboardData();
    setData(dashboardData);
  }, []);

  // Check for dark mode from localStorage, default to dark mode
  useEffect(() => {
    const checkTheme = () => {
      const theme = localStorage.getItem('theme');
      // Default to dark mode if no theme is saved
      setIsDarkMode(theme === null ? true : theme === 'dark');
    };

    checkTheme();
    window.addEventListener('storage', checkTheme);
    const interval = setInterval(checkTheme, 100);

    return () => {
      clearInterval(interval);
      window.removeEventListener('storage', checkTheme);
    };
  }, []);

  if (!data) {
    return (
      <div 
        className="flex items-center justify-center min-h-screen"
        style={{ backgroundColor: isDarkMode ? '#0a0a0a' : '#F5F5F5' }}
      >
        <div style={{ color: isDarkMode ? '#FFFFFF' : '#1a1a1a' }}>Loading dashboard...</div>
      </div>
    );
  }

  // Get KPI cards configuration from lib
  const kpiCards = getKPICards(data);
  const vendorSignalsData = getVendorSignalsData(data);

  // Mock complaint phrases data for VoC Friction Drivers - Replace with actual API data
  const complaintPhrases = [
    {
      phrase: 'I need to send money to my family in Iran for medical expenses',
      category: 'Sanctions',
      count: 189,
      percentage: 22.5,
      trend: 'up' as const,
    },
    {
      phrase: 'Why are you asking me all these questions about who told me to come here?',
      category: 'Money Mule',
      count: 156,
      percentage: 18.6,
      trend: 'up' as const,
    },
    {
      phrase: 'My grandson needs bail money immediately! Why won\'t you let me send this wire?',
      category: 'Scam Victim',
      count: 142,
      percentage: 16.9,
      trend: 'stable' as const,
    },
    {
      phrase: 'I wanted to deposit $12,000 but now you\'re saying that\'s a problem?',
      category: 'Structuring',
      count: 128,
      percentage: 15.2,
      trend: 'up' as const,
    },
    {
      phrase: 'My employer asked me to open this account for client payments',
      category: 'Third-Party',
      count: 115,
      percentage: 13.7,
      trend: 'down' as const,
    },
    {
      phrase: 'Why are you suddenly questioning where my money comes from?',
      category: 'Sanctions',
      count: 98,
      percentage: 11.7,
      trend: 'up' as const,
    },
    {
      phrase: 'I didn\'t know there was a $10,000 reporting limit',
      category: 'Structuring',
      count: 87,
      percentage: 10.4,
      trend: 'stable' as const,
    },
    {
      phrase: 'I moved last month and need to update my address. Why does this require manager approval?',
      category: 'Money Mule',
      count: 76,
      percentage: 9.1,
      trend: 'up' as const,
    },
    {
      phrase: 'My financial advisor is helping me optimize my withdrawals. Why are you blocking my money?',
      category: 'Scam Victim',
      count: 64,
      percentage: 7.6,
      trend: 'down' as const,
    },
    {
      phrase: 'I\'m adding my business partner to my account today. This delay is costing me money!',
      category: 'Third-Party',
      count: 52,
      percentage: 6.2,
      trend: 'stable' as const,
    },
  ];

  return (
    <div 
      className="min-h-screen p-6 space-y-8"
      style={{ backgroundColor: isDarkMode ? '#0a0a0a' : '#F5F5F5' }}
    >
      {/* Compliance Signals - Full Width on Top */}
      <div className="w-full">
        <VendorSignalsBarChart data={vendorSignalsData} isDarkMode={isDarkMode} />
      </div>

      {/* 6 KPI Cards Grid - Compact Style */}
      <TooltipProvider>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-6">
          {kpiCards.map((kpi) => {
            const totalValue = kpi.integrationOutcomes.reduce((sum, outcome) => sum + outcome.value, 0);
            const chartData = kpi.integrationOutcomes.map((outcome) => ({
              name: outcome.label,
              value: outcome.value,
              color: outcome.color
            }));
            
            // Get the currently hovered outcome value for this card
            const hoveredValue = hoveredOutcome?.cardId === kpi.id 
              ? kpi.integrationOutcomes[hoveredOutcome.outcomeIndex]?.value 
              : null;

            return (
              <Tooltip key={kpi.id}>
                <TooltipTrigger asChild>
                  <Card
                    className="p-6 transition-all duration-200 hover:border-[#b90abd]/40 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#b90abd] cursor-pointer flex flex-col h-full"
                    style={{
                      backgroundColor: isDarkMode ? 'rgba(0, 0, 0, 0.3)' : '#FFFFFF',
                      borderColor: isDarkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)'
                    }}
                  >
                    {/* KPI Title Section - Fixed height for alignment */}
                    <div className="shrink-0" style={{ height: '85px', marginBottom: '0' }}>
                      <div className="flex items-start justify-between mb-2">
                        <div 
                          className="text-sm font-bold leading-tight flex-1"
                          style={{ color: isDarkMode ? '#FFFFFF' : '#1a1a1a' }}
                        >
                          {kpi.title}
                        </div>
                        <div className="text-right ml-2 shrink-0">
                          <div 
                            className="text-2xl font-bold"
                            style={{ color: isDarkMode ? '#FFFFFF' : '#1a1a1a' }}
                          >
                            {totalValue}
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Integration Outcomes Section - Aligned at same plane */}
                    <div className="flex-1 flex flex-col pt-3 border-t"
                      style={{ borderTopColor: isDarkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)' }}
                    >
                      <div 
                        className="text-[10px] uppercase tracking-wider mb-2 shrink-0"
                        style={{ 
                          color: isDarkMode ? '#6b7280' : '#9ca3af',
                          height: '14px',
                          lineHeight: '14px'
                        }}
                      >
                        Integration Outcomes
                      </div>
                      <div className="flex items-center gap-3 flex-1">
                        {/* Donut Chart */}
                        <div className="relative shrink-0" style={{ width: '70px', height: '70px' }}>
                          <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                              <Pie
                                data={chartData}
                                cx="50%"
                                cy="50%"
                                innerRadius={22}
                                outerRadius={32}
                                paddingAngle={2}
                                dataKey="value"
                                stroke="transparent"
                                isAnimationActive={false}
                              >
                                {chartData.map((entry, index) => (
                                  <Cell key={`cell-${index}`} fill={entry.color} />
                                ))}
                              </Pie>
                            </PieChart>
                          </ResponsiveContainer>
                          {/* Center Value - Shows only on hover over Integration Outcomes */}
                          {hoveredValue !== null && (
                            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                              <div className="text-center">
                                <div 
                                  className="text-sm font-bold leading-none transition-all duration-200"
                                  style={{ 
                                    color: isDarkMode ? '#FFFFFF' : '#1a1a1a'
                                  }}
                                >
                                  {hoveredValue}
                                </div>
                              </div>
                            </div>
                          )}
                        </div>

                        {/* Legend */}
                        <div className="flex-1 space-y-1.5">
                          {kpi.integrationOutcomes.map((outcome, idx) => {
                            const isHovered = hoveredOutcome?.cardId === kpi.id && hoveredOutcome?.outcomeIndex === idx;
                            return (
                              <div 
                                key={idx} 
                                className="flex items-center gap-2 cursor-pointer transition-opacity"
                                style={{ opacity: hoveredOutcome?.cardId === kpi.id && !isHovered ? 0.5 : 1 }}
                                onMouseEnter={() => setHoveredOutcome({ cardId: kpi.id, outcomeIndex: idx })}
                                onMouseLeave={() => setHoveredOutcome(null)}
                              >
                                <div 
                                  className="w-2 h-2 rounded-full shrink-0 transition-transform"
                                  style={{ 
                                    backgroundColor: outcome.color,
                                    transform: isHovered ? 'scale(1.3)' : 'scale(1)'
                                  }}
                                />
                                <div className="flex-1 min-w-0">
                                  <div 
                                    className="text-[10px] truncate"
                                    style={{ color: isDarkMode ? '#d1d5db' : '#4b5563' }}
                                  >
                                    {outcome.label}
                                  </div>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    </div>
                  </Card>
                </TooltipTrigger>
                <TooltipContent 
                  className="max-w-xs text-sm"
                  style={{ backgroundColor: isDarkMode ? '#1a1a1a' : '#FFFFFF' }}
                >
                  <div className="space-y-1">
                    <p 
                      className="font-medium"
                      style={{ color: isDarkMode ? '#FFFFFF' : '#1a1a1a' }}
                    >
                      {kpi.title}
                    </p>
                    <p 
                      className="text-xs"
                      style={{ color: isDarkMode ? '#9ca3af' : '#6b7280' }}
                    >
                      {kpi.description}
                    </p>
                    <div className="mt-2 space-y-1">
                      {kpi.integrationOutcomes.map((outcome, idx) => (
                        <div key={idx} className="flex items-center justify-between text-xs">
                          <span style={{ color: isDarkMode ? '#9ca3af' : '#6b7280' }}>
                            {outcome.label}:
                          </span>
                          <span 
                            className="font-semibold"
                            style={{ color: outcome.color }}
                          >
                            {outcome.value}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </TooltipContent>
              </Tooltip>
            );
          })}
      </div>
      </TooltipProvider>

      {/* Three Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Column 1: Red Flag Distribution */}
        <div className="lg:col-span-1">
          <RedFlagDistributionChart isDarkMode={isDarkMode} />
        </div>

        {/* Column 2: VoC Friction Drivers */}
        <div className="lg:col-span-1" style={{ minHeight: '600px' }}>
          <VoCFrictionDrivers phrases={complaintPhrases} isDarkMode={isDarkMode} />
        </div>

        {/* Column 3: AI Action Suggestion Wall */}
        <div className="lg:col-span-1" style={{ minHeight: '600px' }}>
          <AIActionSuggestionWall isDarkMode={isDarkMode} />
        </div>
      </div>
    </div>
  );
}
