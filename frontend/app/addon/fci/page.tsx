'use client';

import { useState, useEffect } from 'react';
import { Settings, Users } from 'lucide-react';
import { FCIKPICards } from '@/components/FCI/FCIKPICards';
import { FCIEisenhowerDistribution } from '@/components/FCI/FCIEisenhowerDistribution';
import { FailureClusters } from '@/components/FCI/FailureClusters';
import { SmartAgentActionList } from '@/components/FCI/SmartAgentActionList';
import { IntentScoreHeatmap } from '@/components/FCI/IntentScoreHeatmap';
import {
  fciKPIData,
  fciClusters
} from '@/lib/fci-lib/fciData';
import {
  agentActionData
} from '@/lib/fci-lib/fciAdvancedData';

type FCITab = 'summary' | 'workforce';

const tabs: { id: FCITab; label: string }[] = [
  { id: 'summary', label: 'Summary' },
  { id: 'workforce', label: 'Workforce Performance' },
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
        {/* Sub-Tabs */}
        <div 
          className="flex gap-6 mb-6"
          style={{ borderBottom: `1px solid ${isDarkMode ? '#1f1f1f' : '#E5E5E5'}` }}
        >
          {tabs.map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className="relative pb-3 transition-all duration-200"
              >
                <span 
                  className="text-sm font-medium"
                  style={{ 
                    color: isActive ? '#A855F7' : (isDarkMode ? '#939394' : '#6B7280')
                  }}
                >
                  {tab.label}
                </span>
                {isActive && (
                  <div 
                    className="absolute bottom-0 left-0 right-0 h-0.5"
                    style={{ backgroundColor: '#A855F7' }}
                  />
                )}
              </button>
            );
          })}
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

        {/* Footer */}
        <div 
          className="mt-8 pt-6 border-t flex items-center justify-between"
          style={{ borderColor: isDarkMode ? '#2a2a2a' : '#E5E5E5' }}
        >
          <p className="text-xs" style={{ color: '#939394' }}>
            © 2024 Yaaralabs FCI Monitoring System • Data refreshed every 5 minutes
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
