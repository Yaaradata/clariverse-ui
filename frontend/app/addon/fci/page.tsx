'use client';

import { useState, useEffect } from 'react';
import { FCIKPICards } from '@/components/FCI/FCIKPICards';
import { FailureClusters } from '@/components/FCI/FailureClusters';
import { CustomerEmotion } from '@/components/FCI/CustomerEmotion';
import { AIActionCenter } from '@/components/FCI/AIActionCenter';
import {
  fciKPIData,
  fciClusters,
  customerEmotionData,
  aiActions
} from '@/lib/fci-lib/fciData';

export default function FCIPage() {
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
    <div className="min-h-screen" style={{ backgroundColor: isDarkMode ? '#010101' : '#FFFFFF' }}>
      <div className="container mx-auto px-6 py-6">
        {/* Header */}
        <div className="mb-6">
          <h1
            className="text-2xl font-bold mb-2"
            style={{ color: isDarkMode ? '#FFFFFF' : '#010101' }}
          >
            Failed Customer Interaction (FCI) Dashboard
          </h1>
          <p className="text-sm" style={{ color: '#939394' }}>
            Root cause analysis, business impact, and resolution recommendations
          </p>
        </div>

        {/* Top — KPI Card Row */}
        <div className="mb-8">
          <FCIKPICards data={fciKPIData} isDarkMode={isDarkMode} />
        </div>

        {/* Below — 3-Column Power Insight View */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          {/* Column 1 — What's Failing? (FCI Clusters / Reasons) */}
          <div>
            <FailureClusters clusters={fciClusters} isDarkMode={isDarkMode} />
          </div>

          {/* Column 2 — Customer Emotion & Friction Indicators */}
          <div>
            <CustomerEmotion data={customerEmotionData} isDarkMode={isDarkMode} />
          </div>

          {/* Column 3 — What To Do Next (AI Action Center) */}
          <div>
            <AIActionCenter actions={aiActions} isDarkMode={isDarkMode} />
          </div>
        </div>
      </div>
    </div>
  );
}
