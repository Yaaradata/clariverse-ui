'use client';

import { useState, useEffect } from 'react';
import InsightCard from './InsightCard';
import TrustRiskScore from './TrustRiskScore';
import LogisticsBreachPlot from './LogisticsBreachPlot';
import MarketplaceRadar from './MarketplaceRadar';
import GovernanceGrid from './GovernanceGrid';
import { complianceInsights } from '@/lib/ecom-compliance';

export default function ComplianceInsights() {
  const [isDarkMode, setIsDarkMode] = useState(true);

  useEffect(() => {
    const checkTheme = () => {
      const theme = localStorage.getItem('theme');
      setIsDarkMode(theme === 'dark');
    };
    
    checkTheme();
    window.addEventListener('storage', checkTheme);
    
    const observer = new MutationObserver(() => {
      setIsDarkMode(document.documentElement.classList.contains('dark'));
    });
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });
    
    return () => {
      window.removeEventListener('storage', checkTheme);
      observer.disconnect();
    };
  }, []);

  const criticalCount = complianceInsights.filter(i => i.severity === 'CRITICAL').length;
  const highCount = complianceInsights.filter(i => i.severity === 'HIGH').length;

  const containerBg = isDarkMode ? 'rgb(13, 13, 13)' : 'rgb(255, 255, 255)';
  const containerBorder = isDarkMode ? 'rgb(31, 31, 31)' : 'rgb(229, 231, 235)';
  const headerColor = isDarkMode ? 'rgb(255, 255, 255)' : 'rgb(31, 41, 55)';
  const subtextColor = isDarkMode ? 'rgb(156, 163, 175)' : 'rgb(107, 114, 128)';
  const scrollbarColor = isDarkMode ? 'rgb(51, 51, 51) rgb(26, 26, 26)' : 'rgb(203, 213, 225) rgb(241, 245, 249)';

  return (
    <div className="space-y-4">
      {/* Row 1: Trust Risk Score + AI Insights Cards */}
      <div className="flex gap-4">
        {/* Left - Trust Risk Score */}
        <div className="flex-shrink-0 w-80">
          <TrustRiskScore />
        </div>

        {/* Right - AI Post-Interaction Insights */}
        <div 
          className="flex-1 rounded-2xl p-5 min-w-0" 
          style={{ backgroundColor: containerBg, border: `1px solid ${containerBorder}` }}
        >
          <div className="space-y-3 transition-all duration-500 opacity-100 translate-y-0">
            {/* Header */}
            <div className="flex items-center gap-3 flex-wrap">
              <h2 className="text-base font-semibold flex items-center gap-2" style={{ color: headerColor }}>
                <span className="text-base">✨</span>
                AI Post-Interaction Compliance Insights
              </h2>
              {criticalCount > 0 && (
                <span 
                  className="text-[10px] px-2 py-0.5 rounded-full tracking-wide uppercase font-medium" 
                  style={{ backgroundColor: 'rgba(239, 68, 68, 0.2)', color: 'rgb(252, 165, 165)' }}
                >
                  {criticalCount} Critical
                </span>
              )}
              {highCount > 0 && (
                <span 
                  className="text-[10px] px-2 py-0.5 rounded-full tracking-wide uppercase font-medium" 
                  style={{ backgroundColor: 'rgba(251, 146, 60, 0.2)', color: 'rgb(253, 186, 116)' }}
                >
                  {highCount} High
                </span>
              )}
            </div>

            {/* Subtext */}
            <p className="text-[11px]" style={{ color: subtextColor }}>
              Live detection of compliance violations, policy breaches, and operational risk signals present in customer communications.
            </p>

            {/* Cards Container */}
            <div 
              className="flex gap-3 overflow-x-auto pb-3 pt-4 items-stretch scrollbar-thin"
              style={{ scrollbarColor }}
            >
              {complianceInsights.map((insight, index) => (
                <InsightCard 
                  key={insight.id} 
                  insight={insight} 
                  delay={index * 50} 
                />
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Row 2: Logistics + Marketplace Radar + Governance Grid */}
      <div className="grid grid-cols-3 gap-4">
        <LogisticsBreachPlot />
        <MarketplaceRadar />
        <GovernanceGrid />
      </div>
    </div>
  );
}
