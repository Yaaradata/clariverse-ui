'use client';

import { useEffect, useState } from 'react';

// Components
import {
  FraudRiskScore,
  FraudInsightCards,
  ClaimTaxonomyChart,
  AgentRiskRadar,
  ThreatIntelligenceGrid,
} from '@/components/ecom-fraudulent';

// Data
import {
  fraudRiskScoreData,
  fraudInsightsData,
  claimTaxonomyData,
  claimTimeSeriesData,
  agentRiskRadarData,
  threatIntelligenceData,
} from '@/lib/ecom-fraudulent';

export default function FraudulentPage() {
  const [isDarkMode, setIsDarkMode] = useState(true);

  // Listen for theme changes
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

  // Calculate totals for the insight cards
  const criticalCount = fraudInsightsData.filter(i => i.severity === 'CRITICAL').length;
  const highCount = fraudInsightsData.filter(i => i.severity === 'HIGH').length;

  // Calculate total signals for claim taxonomy
  const totalClaimSignals = claimTaxonomyData.reduce((sum, item) => sum + item.count, 0);

  return (
    <div className="min-h-screen bg-[#030308] p-6 space-y-6">
      {/* Row 1: Fraud Risk Score (left) + AI Fraud Pattern Insights (right) */}
      <div className="grid grid-cols-12 gap-6">
        {/* Left: Fraud Risk Score - 3 columns */}
        <div className="col-span-3">
          <FraudRiskScore 
            score={fraudRiskScoreData.score}
            previousScore={fraudRiskScoreData.previousScore}
            threshold={fraudRiskScoreData.threshold}
            aiInsight={fraudRiskScoreData.aiInsight}
            recommendation={fraudRiskScoreData.recommendation}
            categories={fraudRiskScoreData.categories}
          />
        </div>
        
        {/* Right: AI Fraud Pattern Insights - 9 columns */}
        <div className="col-span-9">
          <FraudInsightCards 
            insights={fraudInsightsData}
            criticalCount={criticalCount}
            highCount={highCount}
          />
        </div>
      </div>

      {/* Row 2: Three equal-width widgets */}
      <div className="grid grid-cols-3 gap-6">
        {/* Left: Customer Claim Patterns (Area Chart) */}
        <ClaimTaxonomyChart 
          data={claimTaxonomyData}
          timeSeriesData={claimTimeSeriesData}
          totalSignals={totalClaimSignals}
          peakCategory="DNR (45%)"
          topKeyword="Empty Box Claim"
          aiInsight="Claim Spike: 40% surge in 'Empty Box' claims for electronics between 14:00-18:00, correlated with specific courier partner."
        />

        {/* Middle: Agent Risk Radar */}
        <AgentRiskRadar 
          data={agentRiskRadarData.data}
          overallScore={agentRiskRadarData.overallScore}
          riskLevel={agentRiskRadarData.riskLevel}
          topRiskAgent={agentRiskRadarData.topRiskAgent}
          activeVectors={agentRiskRadarData.activeVectors}
          aiInsight={agentRiskRadarData.aiInsight}
        />

        {/* Right: External Threat Monitor (2x2 Grid) */}
        <ThreatIntelligenceGrid 
          categories={threatIntelligenceData.categories}
          overallStatus={threatIntelligenceData.overallStatus}
          aiInsight={threatIntelligenceData.aiInsight}
        />
      </div>
    </div>
  );
}
