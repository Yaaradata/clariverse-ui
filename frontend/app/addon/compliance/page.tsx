'use client';

import { useState, useEffect } from 'react';
import ThreatBar from '@/components/compliance/ThreatBar';
import RiskScoreBoard from '@/components/compliance/RiskScoreBoard';
import IncidentDetector from '@/components/compliance/IncidentDetector';
import PolicyDriftAlerts from '@/components/compliance/PolicyDriftAlerts';
import RootCauseAggregator from '@/components/compliance/RootCauseAggregator';
import InvestigationQueue from '@/components/compliance/InvestigationQueue';
import RiskHeatmap from '@/components/compliance/RiskHeatmap';

export default function CompliancePage() {
  const [isDarkMode, setIsDarkMode] = useState(false);

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

  return (
    <div className="min-h-screen" style={{ backgroundColor: isDarkMode ? '#010101' : '#F5F5F5' }}>
      {/* ZONE 1 — 🔥 Compliance Threat Bar */}
      <ThreatBar />

      <div className="container mx-auto px-6 py-6">
        {/* ZONE 7 — 📈 Risk Compliance Score Board (Top KPIs) */}
        <RiskScoreBoard isDarkMode={isDarkMode} />

        {/* ZONE 2 — ✨ AI Compliance Incident Detector */}
        <IncidentDetector isDarkMode={isDarkMode} />

        {/* Main Layout: 3 Columns */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          
          {/* COLUMN 1: SIGNALS & DETECTION */}
          <div className="space-y-6">
            {/* ZONE 6 — 🧠 Governance & Policy Drift Analyzer */}
            <PolicyDriftAlerts isDarkMode={isDarkMode} />
          </div>

          {/* COLUMN 2: AI ACTIONS */}
          <div className="space-y-6">
            {/* ZONE 4 — 🧩 AI Root-Cause Aggregator */}
            <RootCauseAggregator isDarkMode={isDarkMode} />

            {/* ZONE 5 — 🔍 Compliance Investigation Queue */}
            <InvestigationQueue isDarkMode={isDarkMode} />
          </div>

          {/* COLUMN 3: HEATMAPS & SUMMARY */}
          <div className="space-y-6">
            {/* ZONE 3 — 🛰️ Cross-Channel Risk Heatmap */}
            <RiskHeatmap isDarkMode={isDarkMode} />
          </div>
        </div>
      </div>
    </div>
  );
}
