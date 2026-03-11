'use client';

import { useState, useEffect } from 'react';
import { CallCenterRiskHeatMap } from '@/components/compliance/CallCenterRiskHeatMap';
import { AgentWatchlist } from '@/components/compliance/AgentWatchlist';
import { ComplianceHealthSummaryCard } from '@/components/compliance/ComplianceHealthSummaryCard';
import { getGranularComplianceScore, getViolations } from '@/lib/swedbank/voiceData';

export default function UnitPerformancePage() {
  const [isDarkMode, setIsDarkMode] = useState(true);
  const granularCompliance = getGranularComplianceScore();
  const violations = getViolations();

  useEffect(() => {
    const checkSettings = () => {
      const theme = localStorage.getItem('theme');
      setIsDarkMode(theme === null ? true : theme === 'dark');
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
        <div className="space-y-6">
          {/* Contact Centre Units Risk Map - First */}
          <CallCenterRiskHeatMap isDarkMode={isDarkMode} />

          {/* Compliance Health + Workforce Watchlist (with merged Violation Center / act names) - side by side */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <ComplianceHealthSummaryCard
              granularCompliance={granularCompliance}
              isDarkMode={isDarkMode}
              currencySymbol="€"
            />
            <AgentWatchlist isDarkMode={isDarkMode} violations={violations} />
          </div>
        </div>
      </div>
    </div>
  );
}
