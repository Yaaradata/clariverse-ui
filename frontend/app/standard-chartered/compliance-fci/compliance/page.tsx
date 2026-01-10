'use client';

import { useState, useEffect } from 'react';
import { LayoutDashboard, UserCog } from 'lucide-react';
import { ComplianceScoreMeter } from '@/components/compliance/ComplianceScoreMeter';
import { ViolationCategoryChart } from '@/components/compliance/ViolationCategoryChart';
import { ComplianceIssuesTable } from '@/components/compliance/ComplianceIssuesTable';
import { RiskAlertPanel } from '@/components/compliance/RiskAlertPanel';
import { AgentWatchlist } from '@/components/compliance/AgentWatchlist';
import { ComplianceInsightsCards } from '@/components/compliance/ComplianceInsightsCards';
import { ActiveRisksTable } from '@/components/compliance/ActiveRisksTable';
import { AIAfterCallWork } from '@/components/compliance/AIAfterCallWork';
import { CallCenterRiskHeatMap } from '@/components/compliance/CallCenterRiskHeatMap';
import {
  TimeFilter,
  complianceScoreData,
  violationCategoryData,
  complianceIssuesData,
  riskAlertsData
} from '@/lib/compliance/complianceData';

type TabType = 'summary' | 'workforce';

export default function CompliancePage() {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [timeFilter, setTimeFilter] = useState<TimeFilter>('24h');
  const [activeTab, setActiveTab] = useState<TabType>('summary');

  // Check for dark mode and time filter from layout
  useEffect(() => {
    const checkSettings = () => {
      const theme = localStorage.getItem('theme');
      setIsDarkMode(theme === 'dark');
      
      const savedTimeFilter = localStorage.getItem('complianceTimeFilter') as TimeFilter;
      if (savedTimeFilter) {
        setTimeFilter(savedTimeFilter);
      }
    };
    
    checkSettings();
    
    // Listen for storage changes
    window.addEventListener('storage', checkSettings);
    
    // Poll for changes (since we're in same window)
    const interval = setInterval(checkSettings, 100);
    
    return () => {
      window.removeEventListener('storage', checkSettings);
      clearInterval(interval);
    };
  }, []);

  return (
    <div 
      className="min-h-screen"
      style={{ backgroundColor: isDarkMode ? '#010101' : '#F5F5F5' }}
    >
      <div className="container mx-auto px-6 py-6">
        {/* Tabs */}
        <div className="mb-6">
          <div 
            className="flex items-center gap-1 p-1 rounded-xl w-full"
            style={{ 
              backgroundColor: isDarkMode ? '#1a1a1a' : '#FFFFFF',
              border: `1px solid ${isDarkMode ? '#2a2a2a' : '#E5E5E5'}`
            }}
          >
            <button
              onClick={() => setActiveTab('summary')}
              className={`flex-1 flex items-center justify-center gap-2 px-5 py-2.5 rounded-lg text-sm font-medium transition-all duration-200`}
              style={{
                backgroundColor: activeTab === 'summary' ? '#5332FF' : 'transparent',
                color: activeTab === 'summary' ? '#FFFFFF' : (isDarkMode ? '#D6D9D8' : '#939394')
              }}
            >
              <LayoutDashboard className="w-4 h-4" />
              Summary
            </button>
            <button
              onClick={() => setActiveTab('workforce')}
              className={`flex-1 flex items-center justify-center gap-2 px-5 py-2.5 rounded-lg text-sm font-medium transition-all duration-200`}
              style={{
                backgroundColor: activeTab === 'workforce' ? '#5332FF' : 'transparent',
                color: activeTab === 'workforce' ? '#FFFFFF' : (isDarkMode ? '#D6D9D8' : '#939394')
              }}
            >
              <UserCog className="w-4 h-4" />
              Workforce Performance
            </button>
          </div>
        </div>

        {/* Tab Content */}
        {activeTab === 'summary' && (
          <>
            {/* Compliance Health Score + AI Post-Interaction Compliance Insights */}
            <div className="grid grid-cols-1 xl:grid-cols-4 gap-6 mb-6">
              {/* Compliance Score Meter - Takes 1 column (LEFT) */}
              <div className="xl:col-span-1">
                <ComplianceScoreMeter 
                  data={complianceScoreData[timeFilter]} 
                  isDarkMode={isDarkMode} 
                />
              </div>

              {/* AI Insights Cards - Takes 3 columns (RIGHT) */}
              <div 
                className="xl:col-span-3 rounded-2xl p-6"
                style={{ 
                  backgroundColor: isDarkMode ? '#0d0d0d' : '#FFFFFF',
                  border: `1px solid ${isDarkMode ? '#1f1f1f' : '#E5E5E5'}`
                }}
              >
                <ComplianceInsightsCards isDarkMode={isDarkMode} />
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
          </>
        )}

        {activeTab === 'workforce' && (
          <div className="space-y-6">
            {/* Top Row - Forms Filled & Agent Watchlist */}
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
              {/* AI After-Call Work - Forms Filled */}
              <AIAfterCallWork 
                isDarkMode={isDarkMode} 
              />
              
              {/* Agent Watchlist */}
              <AgentWatchlist 
                isDarkMode={isDarkMode} 
              />
            </div>

            {/* Bottom Row - Risk Heat Map */}
            <CallCenterRiskHeatMap 
              isDarkMode={isDarkMode} 
            />
          </div>
        )}

      </div>
    </div>
  );
}