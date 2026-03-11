'use client';

import { useState, useEffect } from 'react';
import { ComplianceScoreMeter } from '@/components/compliance/ComplianceScoreMeter';
import { ViolationCategoryChart } from '@/components/compliance/ViolationCategoryChart';
import { ComplianceIssuesTable } from '@/components/compliance/ComplianceIssuesTable';
import { RiskAlertPanel } from '@/components/compliance/RiskAlertPanel';
import { ComplianceInsightsCards } from '@/components/compliance/ComplianceInsightsCards';
import { ActiveRisksTable } from '@/components/compliance/ActiveRisksTable';
import {
  TimeFilter,
  complianceScoreData,
  violationCategoryData,
  complianceIssuesData,
  riskAlertsData
} from '@/lib/swedbank/compliance/complianceData';

export default function CompliancePage() {
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [timeFilter, setTimeFilter] = useState<TimeFilter>('24h');

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
        {/* Compliance and Risk content (formerly Summary) */}
            {/* Compliance Health Score + AI Post-Interaction Compliance Insights */}
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
                  border: `1px solid ${isDarkMode ? '#1f1f1f' : '#E5E5E5'}`,
                }}
              >
                <ComplianceInsightsCards isDarkMode={isDarkMode} />
              </div>
            </div>

            {/* Violations & Risk Alert Row */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
              <ViolationCategoryChart
                data={violationCategoryData[timeFilter]}
                isDarkMode={isDarkMode}
              />
              <RiskAlertPanel data={riskAlertsData} isDarkMode={isDarkMode} />
            </div>

            {/* Active Compliance Issues & Active Risks */}
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 mb-6">
              <ComplianceIssuesTable data={complianceIssuesData} isDarkMode={isDarkMode} />
              <ActiveRisksTable isDarkMode={isDarkMode} />
            </div>
      </div>
    </div>
  );
}
