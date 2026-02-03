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
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [timeFilter, setTimeFilter] = useState<TimeFilter>('24h');
  const [activeTab, setActiveTab] = useState<TabType>('summary');

  useEffect(() => {
    const checkSettings = () => {
      const theme = localStorage.getItem('theme');
      setIsDarkMode(theme === null ? true : theme === 'dark');
      const savedTimeFilter = localStorage.getItem('complianceTimeFilter') as TimeFilter;
      if (savedTimeFilter) setTimeFilter(savedTimeFilter);
    };
    checkSettings();
    window.addEventListener('storage', checkSettings);
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

        {activeTab === 'summary' && (
          <>
            <div className="grid grid-cols-1 xl:grid-cols-4 gap-6 mb-6">
              <div className="xl:col-span-1">
                <ComplianceScoreMeter 
                  data={complianceScoreData[timeFilter]} 
                  isDarkMode={isDarkMode} 
                />
              </div>
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

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
              <ViolationCategoryChart 
                data={violationCategoryData[timeFilter]} 
                isDarkMode={isDarkMode} 
              />
              <RiskAlertPanel 
                data={riskAlertsData} 
                isDarkMode={isDarkMode} 
              />
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 mb-6">
              <ComplianceIssuesTable 
                data={complianceIssuesData} 
                isDarkMode={isDarkMode} 
              />
              <ActiveRisksTable 
                isDarkMode={isDarkMode} 
              />
            </div>
          </>
        )}

        {activeTab === 'workforce' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
              <AIAfterCallWork isDarkMode={isDarkMode} />
              <AgentWatchlist isDarkMode={isDarkMode} />
            </div>
            <CallCenterRiskHeatMap isDarkMode={isDarkMode} />
          </div>
        )}
      </div>
    </div>
  );
}
