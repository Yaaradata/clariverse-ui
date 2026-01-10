'use client';

import { useState, useEffect } from 'react';
import { LayoutGrid, UserCircle } from 'lucide-react';
import { FCIKPICards } from '@/components/FCI/FCIKPICards';
import { FCIEisenhowerDistribution } from '@/components/FCI/FCIEisenhowerDistribution';
import { FailureClusters } from '@/components/FCI/FailureClusters';
import { SmartAgentActionList } from '@/components/FCI/SmartAgentActionList';
import { IntentScoreHeatmap } from '@/components/FCI/IntentScoreHeatmap';
import {
  fciKPIData,
  fciClusters
} from '@/lib/swedbank/fci-lib/fciData';
import {
  agentActionData
} from '@/lib/swedbank/fci-lib/fciAdvancedData';

type FCITab = 'summary' | 'workforce';

const tabs: { id: FCITab; label: string; icon: typeof LayoutGrid }[] = [
  { id: 'summary', label: 'Summary', icon: LayoutGrid },
  { id: 'workforce', label: 'Workforce Performance', icon: UserCircle },
];

export default function FCIPage() {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [activeTab, setActiveTab] = useState<FCITab>('summary');

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
    <div 
      className="min-h-screen"
      style={{ backgroundColor: isDarkMode ? '#010101' : '#F5F5F5' }}
    >
      <div className="container mx-auto px-6 py-6">
        {/* Sub-Tabs - Full Width Pill Style */}
        <div className="mb-6">
          <div 
            className="flex w-full rounded-xl p-1.5"
            style={{ backgroundColor: isDarkMode ? '#1a1a1a' : '#E5E5E5', border: `1px solid ${isDarkMode ? '#2a2a2a' : '#D6D9D8'}` }}
          >
            {tabs.map((tab) => {
              const isActive = activeTab === tab.id;
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className="flex-1 flex items-center justify-center gap-2 py-3 rounded-lg text-sm font-medium transition-all duration-200"
                  style={{
                    backgroundColor: isActive ? '#5332FF' : 'transparent',
                    color: isActive ? '#FFFFFF' : (isDarkMode ? '#939394' : '#6B7280'),
                    boxShadow: isActive ? '0 2px 8px rgba(83, 50, 255, 0.3)' : 'none'
                  }}
                >
                  <Icon className="w-4 h-4" />
                  {tab.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Summary Tab Content */}
        {activeTab === 'summary' && (
          <>
            {/* KPI Cards Row (includes AI Summary Wall) */}
            <div className="mb-6">
              <FCIKPICards data={fciKPIData} isDarkMode={isDarkMode} />
            </div>

            {/* Eisenhower Quadrant Distribution */}
            <FCIEisenhowerDistribution isDarkMode={isDarkMode} />

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
          </>
        )}

        {/* Workforce Performance Tab Content */}
        {activeTab === 'workforce' && (
          <>
            {/* Cross-Intent Performance Grid */}
            <div 
              className="rounded-2xl p-6 mb-6"
              style={{ 
                backgroundColor: isDarkMode ? '#0d0d0d' : '#FFFFFF',
                border: `1px solid ${isDarkMode ? '#1f1f1f' : '#E5E5E5'}`
              }}
            >
              <IntentScoreHeatmap isDarkMode={isDarkMode} />
            </div>

            {/* Agents Requiring Training */}
            <div 
              className="rounded-2xl mb-6"
              style={{ 
                backgroundColor: isDarkMode ? '#0d0d0d' : '#FFFFFF',
                border: `1px solid ${isDarkMode ? '#1f1f1f' : '#E5E5E5'}`
              }}
            >
              <SmartAgentActionList data={agentActionData} isDarkMode={isDarkMode} />
            </div>
          </>
        )}

      </div>
    </div>
  );
}
