'use client';

import { useState } from 'react';

// Components
import {
  FraudRiskSnapshot,
  AIPatternBrain,
  ThreatIntelligenceGrid,
  ForensicEvidenceModal,
} from '@/components/ecom-fraudulent';
import { getPatternStats, getPatternRiskScore, getPatternAgentsCount, patternStats } from '@/components/ecom-fraudulent/ForensicEvidenceModal';
import type { FraudPattern } from '@/components/ecom-fraudulent';

// Data
import {
  fraudRiskScoreData,
  fraudInsightsData,
  threatIntelligenceData,
} from '@/lib/ecom-fraudulent';

// Category mapping for each pattern
const patternCategories = [
  'Fulfillment Fraud',    // Delivery Liability Risk
  'Insider Collusion',    // Internal Policy Violations
  'Asset Abuse',          // Non-Resalable Returns
  'Incentive Fraud',      // Marketing Budget Waste
  'Syndicated Claims',    // Organized Fraud Rings
  'Brand Extortion',      // Reputation Ransom Attacks
  '3rd Party Fraud',      // RaaS Signals
  'Policy Arbitrage',     // Cross-Channel Arbitration
];

// Calculate severity based on risk score ranges
const getSeverityFromRiskScore = (riskScore: number): 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW' => {
  if (riskScore >= 76) return 'CRITICAL';
  if (riskScore >= 65) return 'HIGH';
  if (riskScore >= 50) return 'MEDIUM';
  if (riskScore >= 40) return 'LOW';
  return 'LOW'; // Default to LOW for scores below 40
};

// Get color based on risk score ranges
const getColorFromRiskScore = (riskScore: number): string => {
  if (riskScore >= 76) return '#EF4444'; // Red - Critical
  if (riskScore >= 65) return '#F97316'; // Orange - High
  if (riskScore >= 50) return '#F59E0B'; // Yellow/Amber - Moderate
  if (riskScore >= 40) return '#10B981'; // Light Green/Teal - Low
  return '#10B981'; // Default to green for scores below 40
};

// Calculate exposure from affected cases (realistic average per case based on pattern type)
const calculateExposure = (patternId: string, affected: number): number => {
  // Average case values by pattern (in rupees)
  const avgCaseValues: Record<string, number> = {
    'FI-001': 1000,  // Fulfillment Fraud - lower value per case
    'FI-002': 1000,  // Insider Collusion - policy violations
    'FI-003': 1000,  // Asset Abuse - return fraud, lower value
    'FI-004': 1000,  // Incentive Fraud - promo abuse
    'FI-005': 1000,  // Syndicated Claims - organized fraud
    'FI-006': 4171,  // Brand Extortion - reputation ransom (higher value)
    'FI-007': 5000,  // RaaS Signals - professional fraud (higher value)
    'FI-008': 1205,  // Policy Arbitrage - cross-channel
  };
  
  const avgValue = avgCaseValues[patternId] || 1000;
  return affected * avgValue;
};

// Transform fraud insights to patterns for AIPatternBrain
const fraudPatterns: FraudPattern[] = fraudInsightsData.map((insight, idx) => {
  const stats = getPatternStats(insight.id);
  const volume = stats.volume || insight.affected;
  const exposure = stats.exposure || calculateExposure(insight.id, volume);
  const riskScore = getPatternRiskScore(insight.id);
  
  return {
  id: insight.id,
  title: insight.title,
  severity: getSeverityFromRiskScore(riskScore), // Calculate severity from risk score
    category: patternCategories[idx] || 'Unknown',
  channels: insight.channels,
  detected: insight.detected,
    affected: volume,
    exposure: exposure,
    riskScore: riskScore,
    trend: [23, 18, 8, 15, 12, 31, 45, 22][idx] || 10,
  description: insight.description,
    aiSummary: insight.description,
  rootCause: insight.rootCause,
  correctiveAction: insight.correctiveAction,
  icon: insight.icon,
    relatedAgents: getPatternAgentsCount(insight.id),
    relatedPincodes: [12, 8, 15, 6, 9, 0, 5, 0][idx] || 5,
  };
});

export default function FraudulentPage() {
  const [selectedPattern, setSelectedPattern] = useState<FraudPattern | null>(null);
  const [modalType, setModalType] = useState<'cases' | 'agents' | 'pincodes' | null>(null);

  // Calculate totals
  const criticalCount = fraudInsightsData.filter(i => i.severity === 'CRITICAL').length;
  const highCount = fraudInsightsData.filter(i => i.severity === 'HIGH').length;

  const totalPatternVolume = Object.values(patternStats).reduce((sum, p) => sum + p.volume, 0);
  const totalPatternExposure = Object.values(patternStats).reduce((sum, p) => sum + p.exposure, 0);

  // Calculate overall risk score as average of all pattern risk scores
  const overallRiskScore = fraudPatterns.length > 0
    ? fraudPatterns.reduce((sum, p) => sum + p.riskScore, 0) / fraudPatterns.length
    : 0;

  // Pattern-level legend (pattern names instead of categories)
  const patternLegendColors = [
    '#EF4444', '#F97316', '#10B981', '#A855F7',
    '#3B82F6', '#EC4899', '#F59E0B', '#06B6D4',
  ];

  // Calculate total risk score for proportional donut segments
  const totalRiskScore = fraudPatterns.reduce((sum, p) => sum + p.riskScore, 0);

  const dynamicCategories = fraudPatterns.map((pattern, idx) => {
    // Calculate share based on risk score instead of exposure
    const share = totalRiskScore > 0
      ? Math.round((pattern.riskScore / totalRiskScore) * 100)
      : 0;
    return {
      name: pattern.title,
      value: share, // Donut chart segments based on risk score proportion
      cases: pattern.affected,
      riskScore: pattern.riskScore, // Risk score for legend display
      color: getColorFromRiskScore(pattern.riskScore), // Color based on risk score range
    };
  });

  const handleViewCases = (patternId: string) => {
    const pattern = fraudPatterns.find(p => p.id === patternId);
    if (pattern) {
      setSelectedPattern(pattern);
      setModalType('cases');
    }
  };

  const handleViewAgents = (patternId: string) => {
    const pattern = fraudPatterns.find(p => p.id === patternId);
    if (pattern) {
      setSelectedPattern(pattern);
      setModalType('agents');
    }
  };

  const handleViewPincodes = (patternId: string) => {
    const pattern = fraudPatterns.find(p => p.id === patternId);
    if (pattern) {
      setSelectedPattern(pattern);
      setModalType('pincodes');
    }
  };

  const handleCloseModal = () => {
    setSelectedPattern(null);
    setModalType(null);
  };

  return (
    <div className="min-h-screen w-full px-0 space-y-3">
        
        {/* ROW 1: Two-column grid, equal widths, 16px gap */}
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
          {/* Left: Fraud Risk Snapshot */}
          <div className="w-full h-full">
            <FraudRiskSnapshot 
              score={overallRiskScore}
              totalCases={totalPatternVolume}
              weekChange={fraudRiskScoreData.weekChange}
              categories={dynamicCategories}
              fraudSuspectedPercent={8.4}
              estimatedExposure={totalPatternExposure}
              lossAvoided={2180000}
              falsePositiveRate={12.3}
            />
          </div>
          
          {/* Right: AI Pattern Brain */}
          <div className="w-full h-full">
            <AIPatternBrain 
              patterns={fraudPatterns}
              onViewCases={handleViewCases}
              onViewAgents={handleViewAgents}
              onViewPincodes={handleViewPincodes}
            />
          </div>
        </div>

        {/* ROW 3: Threat Monitor */}
        <div className="grid grid-cols-12 gap-4">
          <div className="col-span-12">
            <ThreatIntelligenceGrid 
              categories={threatIntelligenceData.categories}
              overallStatus={threatIntelligenceData.overallStatus}
              aiInsight={threatIntelligenceData.aiInsight}
            />
          </div>
        </div>

        {/* Forensic Evidence Modal */}
        {selectedPattern && modalType && (
          <ForensicEvidenceModal
            isOpen={!!selectedPattern}
            onClose={handleCloseModal}
            patternTitle={selectedPattern.title}
            patternId={selectedPattern.id}
            totalExposure={selectedPattern.exposure}
            totalVolume={selectedPattern.affected}
            viewType={modalType}
          />
        )}
    </div>
  );
}
