'use client';

import { useState } from 'react';
import { usePathname } from 'next/navigation';
import { Flame, Users, Zap, ThumbsUp, Heart, Target, CheckCircle } from 'lucide-react';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select';

interface HeatmapCell {
  score: number;
  caseCount: number;
  trend: 'up' | 'down' | 'stable';
  avgHandleTime: string;
}

interface IntentScoreHeatmapProps {
  isDarkMode?: boolean;
}

const PILLARS = [
  { id: 'takeOwnership', label: 'Take Ownership', icon: ThumbsUp, color: '#3b82f6' },
  { id: 'actWithEmpathy', label: 'Act with Empathy', icon: Heart, color: '#ec4899' },
  { id: 'makeItEasy', label: 'Make it Easy', icon: Zap, color: '#f97316' },
  { id: 'getItRight', label: 'Get it Right', icon: CheckCircle, color: '#22c55e' }
];

const INTENTS = [
  { id: 'accountAccess', label: 'Account Access & Security', shortLabel: 'ACCOUNT ACCESS' },
  { id: 'transactionDisputes', label: 'Transaction Disputes & Fraud', shortLabel: 'DISPUTES & FRAUD' },
  { id: 'creditCard', label: 'Credit Card Services', shortLabel: 'CREDIT CARD' },
  { id: 'loanMortgage', label: 'Loan & Mortgage Inquiries', shortLabel: 'LOAN & MORTGAGE' },
  { id: 'feeComplaints', label: 'Fee Complaints & Waivers', shortLabel: 'FEE COMPLAINTS' },
  { id: 'digitalBanking', label: 'Digital Banking & Technology', shortLabel: 'DIGITAL BANKING' },
  { id: 'branchATM', label: 'Branch & ATM Services', shortLabel: 'BRANCH & ATM' },
  { id: 'investment', label: 'Investment & Wealth', shortLabel: 'INVESTMENT' },
  { id: 'directDeposit', label: 'Direct Deposit & Payroll', shortLabel: 'DIRECT DEPOSIT' },
  { id: 'accountClosure', label: 'Account Closure & Changes', shortLabel: 'ACCOUNT CLOSURE' }
];

// Deterministic heatmap data (no random values to avoid hydration errors)
const heatmapData: Record<string, Record<string, HeatmapCell>> = {
  takeOwnership: {
    accountAccess: { score: 72, caseCount: 1447, trend: 'up', avgHandleTime: '7m 1s' },
    transactionDisputes: { score: 45, caseCount: 739, trend: 'down', avgHandleTime: '6m 37s' },
    creditCard: { score: 68, caseCount: 850, trend: 'stable', avgHandleTime: '6m 11s' },
    loanMortgage: { score: 58, caseCount: 442, trend: 'stable', avgHandleTime: '4m 43s' },
    feeComplaints: { score: 38, caseCount: 972, trend: 'down', avgHandleTime: '6m 17s' },
    digitalBanking: { score: 75, caseCount: 517, trend: 'up', avgHandleTime: '10m 17s' },
    branchATM: { score: 82, caseCount: 594, trend: 'up', avgHandleTime: '8m 18s' },
    investment: { score: 65, caseCount: 287, trend: 'stable', avgHandleTime: '5m 56s' },
    directDeposit: { score: 78, caseCount: 408, trend: 'up', avgHandleTime: '4m 48s' },
    accountClosure: { score: 42, caseCount: 517, trend: 'down', avgHandleTime: '8m 11s' }
  },
  actWithEmpathy: {
    accountAccess: { score: 65, caseCount: 1151, trend: 'stable', avgHandleTime: '9m 18s' },
    transactionDisputes: { score: 52, caseCount: 1032, trend: 'stable', avgHandleTime: '9m 9s' },
    creditCard: { score: 61, caseCount: 663, trend: 'stable', avgHandleTime: '10m 1s' },
    loanMortgage: { score: 55, caseCount: 359, trend: 'stable', avgHandleTime: '8m 46s' },
    feeComplaints: { score: 35, caseCount: 1210, trend: 'down', avgHandleTime: '6m 6s' },
    digitalBanking: { score: 70, caseCount: 517, trend: 'up', avgHandleTime: '5m 9s' },
    branchATM: { score: 76, caseCount: 575, trend: 'up', avgHandleTime: '10m 8s' },
    investment: { score: 48, caseCount: 238, trend: 'down', avgHandleTime: '8m 47s' },
    directDeposit: { score: 72, caseCount: 349, trend: 'up', avgHandleTime: '9m 57s' },
    accountClosure: { score: 40, caseCount: 666, trend: 'down', avgHandleTime: '4m 49s' }
  },
  makeItEasy: {
    accountAccess: { score: 58, caseCount: 1148, trend: 'stable', avgHandleTime: '4m 53s' },
    transactionDisputes: { score: 42, caseCount: 1026, trend: 'down', avgHandleTime: '9m 45s' },
    creditCard: { score: 55, caseCount: 859, trend: 'stable', avgHandleTime: '6m 29s' },
    loanMortgage: { score: 48, caseCount: 451, trend: 'down', avgHandleTime: '4m 7s' },
    feeComplaints: { score: 45, caseCount: 1204, trend: 'down', avgHandleTime: '9m 31s' },
    digitalBanking: { score: 68, caseCount: 561, trend: 'stable', avgHandleTime: '5m 17s' },
    branchATM: { score: 72, caseCount: 515, trend: 'up', avgHandleTime: '6m 6s' },
    investment: { score: 52, caseCount: 298, trend: 'stable', avgHandleTime: '9m 16s' },
    directDeposit: { score: 65, caseCount: 381, trend: 'stable', avgHandleTime: '7m 2s' },
    accountClosure: { score: 38, caseCount: 527, trend: 'down', avgHandleTime: '8m 27s' }
  },
  getItRight: {
    accountAccess: { score: 78, caseCount: 1044, trend: 'up', avgHandleTime: '11m 14s' },
    transactionDisputes: { score: 55, caseCount: 741, trend: 'stable', avgHandleTime: '9m 16s' },
    creditCard: { score: 72, caseCount: 687, trend: 'up', avgHandleTime: '11m 49s' },
    loanMortgage: { score: 62, caseCount: 476, trend: 'stable', avgHandleTime: '8m 15s' },
    feeComplaints: { score: 48, caseCount: 964, trend: 'down', avgHandleTime: '10m 5s' },
    digitalBanking: { score: 82, caseCount: 598, trend: 'up', avgHandleTime: '7m 53s' },
    branchATM: { score: 85, caseCount: 446, trend: 'up', avgHandleTime: '10m 59s' },
    investment: { score: 58, caseCount: 309, trend: 'stable', avgHandleTime: '11m 23s' },
    directDeposit: { score: 80, caseCount: 406, trend: 'up', avgHandleTime: '4m 9s' },
    accountClosure: { score: 52, caseCount: 514, trend: 'stable', avgHandleTime: '5m 36s' }
  }
};

// Get color based on score
const getScoreColor = (score: number): string => {
  if (score >= 80) return '#22c55e'; // Green - Excellent
  if (score >= 70) return '#84cc16'; // Light green - Good
  if (score >= 60) return '#eab308'; // Yellow - Average
  if (score >= 50) return '#f97316'; // Orange - Below average
  if (score >= 40) return '#ef4444'; // Red - Poor
  return '#dc2626'; // Dark red - Critical
};

const getScoreBgColor = (score: number, isDarkMode: boolean): string => {
  if (score >= 80) return isDarkMode ? 'rgba(34, 197, 94, 0.25)' : 'rgba(34, 197, 94, 0.2)';
  if (score >= 70) return isDarkMode ? 'rgba(132, 204, 22, 0.25)' : 'rgba(132, 204, 22, 0.2)';
  if (score >= 60) return isDarkMode ? 'rgba(234, 179, 8, 0.25)' : 'rgba(234, 179, 8, 0.2)';
  if (score >= 50) return isDarkMode ? 'rgba(249, 115, 22, 0.25)' : 'rgba(249, 115, 22, 0.2)';
  if (score >= 40) return isDarkMode ? 'rgba(239, 68, 68, 0.25)' : 'rgba(239, 68, 68, 0.2)';
  return isDarkMode ? 'rgba(220, 38, 38, 0.3)' : 'rgba(220, 38, 38, 0.25)';
};

const STANDARD_CHARTERED_CONTACT_CENTER_UNITS = [
  { value: 'chennai', label: 'India (Chennai)' },
  { value: 'bengaluru', label: 'India (Bengaluru)' },
  { value: 'kualalumpur', label: 'Malaysia (Kuala Lumpur)' },
  { value: 'shanghai', label: 'China (Shanghai)' },
  { value: 'manila', label: 'Philippines (Manila)' },
  { value: 'singapore', label: 'Singapore' },
  { value: 'hongkong', label: 'Hong Kong' },
  { value: 'london', label: 'United Kingdom (London)' },
  { value: 'warsaw', label: 'Poland (Warsaw)' },
  { value: 'frankfurt', label: 'Germany (Frankfurt)' },
  { value: 'newyork', label: 'United States (New York)' },
  { value: 'nairobi', label: 'Kenya (Nairobi)' }
];

const STANDARD_CONTACT_CENTER_UNITS = [
  { value: 'manila', label: 'Manila (Taguig)' },
  { value: 'newark', label: 'Newark, DE' },
  { value: 'chester', label: 'Chester, UK' },
  { value: 'belfast', label: 'Belfast, ME' },
  { value: 'addison', label: 'Addison, TX' },
  { value: 'jacksonville', label: 'Jacksonville, FL' },
  { value: 'sanjose', label: 'San Jose (Heredia)' },
  { value: 'greensboro', label: 'Greensboro, NC' },
  { value: 'phoenix', label: 'Phoenix, AZ' }
];

const SWEDBANK_CONTACT_CENTER_UNITS = [
  { value: 'stockholm', label: 'Sweden (Stockholm - Sundbyberg)' },
  { value: 'tallinn', label: 'Estonia (Tallinn)' },
  { value: 'riga', label: 'Latvia (Riga)' },
  { value: 'vilnius', label: 'Lithuania (Vilnius)' },
  { value: 'oslo', label: 'Norway (Oslo)' },
  { value: 'helsinki', label: 'Finland (Helsinki)' },
  { value: 'shanghai', label: 'China (Shanghai)' },
  { value: 'newyork', label: 'USA (New York)' }
];

export function IntentScoreHeatmap({ isDarkMode = false }: IntentScoreHeatmapProps) {
  const pathname = usePathname();
  const isSwedbankRoute = pathname?.startsWith('/swedbank');
  const isStandardCharteredRoute = pathname?.startsWith('/standard-chartered');
  const CONTACT_CENTER_UNITS = isSwedbankRoute 
    ? SWEDBANK_CONTACT_CENTER_UNITS 
    : isStandardCharteredRoute 
    ? STANDARD_CHARTERED_CONTACT_CENTER_UNITS 
    : STANDARD_CONTACT_CENTER_UNITS;
  const [hoveredCell, setHoveredCell] = useState<{ pillar: string; intent: string } | null>(null);
  const [selectedUnit, setSelectedUnit] = useState<string>('');

  // Calculate insights
  const getBottleneck = () => {
    let worstScore = 100;
    let worstPillar = '';
    let worstIntent = '';
    
    PILLARS.forEach(pillar => {
      INTENTS.forEach(intent => {
        const score = heatmapData[pillar.id][intent.id].score;
        if (score < worstScore) {
          worstScore = score;
          worstPillar = pillar.label;
          worstIntent = intent.label;
        }
      });
    });
    
    return { pillar: worstPillar, intent: worstIntent, score: worstScore };
  };

  const getOwnershipInsight = () => {
    let totalScore = 0;
    let count = 0;
    INTENTS.forEach(intent => {
      totalScore += heatmapData['takeOwnership'][intent.id].score;
      count++;
    });
    return Math.round(totalScore / count);
  };

  const getEfficiencyInsight = () => {
    const digitalScore = heatmapData['makeItEasy']['digitalBanking'].score;
    const feeScore = heatmapData['makeItEasy']['feeComplaints'].score;
    return { better: 'Digital Banking', betterScore: digitalScore, worse: 'Fee Complaints', worseScore: feeScore };
  };

  const bottleneck = getBottleneck();
  const ownershipAvg = getOwnershipInsight();
  const efficiency = getEfficiencyInsight();

  return (
    <div>
      {/* Header */}
      <div className="mb-4">
        <div className="flex items-center gap-4 mb-3 flex-wrap">
          <h3 className="text-lg font-bold" style={{ color: isDarkMode ? '#FFFFFF' : '#010101' }}>
            How well are we serving customers?
          </h3>
          {/* Contact Center Units Filter */}
          <Select value={selectedUnit} onValueChange={setSelectedUnit}>
            <SelectTrigger
              className="w-[180px] h-8 rounded-md text-xs"
              style={{
                backgroundColor: isDarkMode ? '#1a1a1a' : '#FFFFFF',
                border: `1px solid ${isDarkMode ? '#3a3a3a' : '#D1D5DB'}`,
                color: isDarkMode ? '#FFFFFF' : '#010101',
                boxShadow: isDarkMode ? '0 1px 3px rgba(0, 0, 0, 0.3)' : '0 1px 2px rgba(0, 0, 0, 0.05)'
              }}
            >
              <SelectValue placeholder="All" />
            </SelectTrigger>
            <SelectContent
              className="rounded-lg"
              style={{
                backgroundColor: isDarkMode ? '#1a1a1a' : '#FFFFFF',
                border: `1px solid ${isDarkMode ? '#3a3a3a' : '#D1D5DB'}`,
                boxShadow: isDarkMode 
                  ? '0 4px 12px rgba(0, 0, 0, 0.5)' 
                  : '0 4px 12px rgba(0, 0, 0, 0.15)',
                opacity: 1,
                backdropFilter: 'none',
                background: isDarkMode ? '#1a1a1a' : '#FFFFFF',
                backgroundImage: 'none',
                WebkitBackdropFilter: 'none'
              }}
            >
              {CONTACT_CENTER_UNITS.map((unit) => (
                <SelectItem
                  key={unit.value}
                  value={unit.value}
                  className="rounded-sm text-xs"
                  style={{
                    color: isDarkMode ? '#FFFFFF' : '#010101'
                  }}
                >
                  {unit.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <p className="text-xs mt-1" style={{ color: '#939394' }}>
          Heatmap of FCI pillar scores across dominant customer intents
        </p>
      </div>

      {/* Heatmap Grid */}
      <div className="overflow-x-auto">
        <div className="min-w-[900px]">
          {/* Column Headers */}
          <div className="flex">
            <div className="w-36 shrink-0" />
            {INTENTS.map(intent => (
              <div
                key={intent.id}
                className="flex-1 px-1 pb-3 text-center"
              >
                <span 
                  className="text-[11px] font-semibold leading-snug"
                  style={{ color: '#939394' }}
                >
                  {intent.label}
                </span>
              </div>
            ))}
          </div>

          {/* Rows */}
          {PILLARS.map((pillar, pillarIdx) => (
            <div key={pillar.id} className="flex mb-1">
              {/* Row Label */}
              <div 
                className="w-36 shrink-0 flex items-center gap-2 pr-3 py-2"
              >
                <pillar.icon className="w-4 h-4" style={{ color: pillar.color }} />
                <span 
                  className="text-xs font-semibold uppercase"
                  style={{ color: isDarkMode ? '#FFFFFF' : '#010101' }}
                >
                  {pillar.label}
                </span>
              </div>

              {/* Cells */}
              {INTENTS.map((intent, intentIdx) => {
                const cell = heatmapData[pillar.id][intent.id];
                const isHovered = hoveredCell?.pillar === pillar.id && hoveredCell?.intent === intent.id;
                
                return (
                  <div
                    key={intent.id}
                    className="flex-1 px-0.5"
                    onMouseEnter={() => setHoveredCell({ pillar: pillar.id, intent: intent.id })}
                    onMouseLeave={() => setHoveredCell(null)}
                  >
                    <div
                      className="relative p-2 rounded-lg cursor-pointer transition-all duration-200"
                      style={{
                        backgroundColor: getScoreBgColor(cell.score, isDarkMode),
                        border: isHovered 
                          ? `2px solid ${getScoreColor(cell.score)}` 
                          : `1px solid ${isDarkMode ? '#2a2a2a' : '#E5E5E5'}`,
                        transform: isHovered ? 'scale(1.02)' : 'scale(1)',
                        boxShadow: isHovered ? `0 4px 12px ${getScoreColor(cell.score)}40` : 'none'
                      }}
                    >
                      {/* Score */}
                      <div className="flex items-baseline justify-between mb-1">
                        <span 
                          className="text-lg font-bold"
                          style={{ color: getScoreColor(cell.score) }}
                        >
                          {cell.score}
                        </span>
                        <span 
                          className="text-[9px] font-medium uppercase"
                          style={{ color: getScoreColor(cell.score) }}
                        >
                          {cell.score >= 70 ? 'GOOD' : cell.score >= 50 ? 'AVG' : 'LOW'}
                        </span>
                      </div>

                      {/* Case Count */}
                      <div className="flex items-center justify-between">
                        <span className="text-[9px]" style={{ color: '#939394' }}>
                          Cases {cell.caseCount.toLocaleString()}
                        </span>
                        <span className="text-[9px]" style={{ color: '#939394' }}>
                          {cell.avgHandleTime}
                        </span>
                      </div>

                      {/* Hover Tooltip */}
                      {isHovered && (
                        <div
                          className="absolute z-50 p-3 rounded-xl shadow-2xl"
                          style={{
                            bottom: '100%',
                            left: '50%',
                            transform: 'translateX(-50%)',
                            marginBottom: '8px',
                            backgroundColor: isDarkMode ? '#1a1a1a' : '#FFFFFF',
                            border: `1px solid ${isDarkMode ? '#3a3a3a' : '#E5E5E5'}`,
                            minWidth: '180px'
                          }}
                        >
                          <p className="text-xs font-bold mb-2" style={{ color: isDarkMode ? '#FFFFFF' : '#010101' }}>
                            {intent.label}
                          </p>
                          <p className="text-[10px] mb-2" style={{ color: '#939394' }}>
                            {pillar.label} Performance
                          </p>
                          <div className="space-y-1">
                            <div className="flex justify-between">
                              <span className="text-[10px]" style={{ color: '#939394' }}>Score</span>
                              <span className="text-xs font-bold" style={{ color: getScoreColor(cell.score) }}>{cell.score}/100</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-[10px]" style={{ color: '#939394' }}>Total Cases</span>
                              <span className="text-xs font-medium" style={{ color: isDarkMode ? '#FFFFFF' : '#010101' }}>{cell.caseCount.toLocaleString()}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-[10px]" style={{ color: '#939394' }}>Avg Handle Time</span>
                              <span className="text-xs font-medium" style={{ color: isDarkMode ? '#FFFFFF' : '#010101' }}>{cell.avgHandleTime}</span>
                            </div>
                          </div>
                          {/* Tooltip arrow */}
                          <div 
                            className="absolute w-2 h-2 rotate-45"
                            style={{
                              bottom: '-5px',
                              left: '50%',
                              transform: 'translateX(-50%)',
                              backgroundColor: isDarkMode ? '#1a1a1a' : '#FFFFFF',
                              borderRight: `1px solid ${isDarkMode ? '#3a3a3a' : '#E5E5E5'}`,
                              borderBottom: `1px solid ${isDarkMode ? '#3a3a3a' : '#E5E5E5'}`
                            }}
                          />
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          ))}
        </div>
      </div>

      {/* Insights Row */}
      <div className="grid grid-cols-3 gap-4 mt-6">
        {/* Bottleneck */}
        <div 
          className="p-4 rounded-xl flex items-start gap-3"
          style={{ 
            backgroundColor: isDarkMode ? '#1a1a1a' : '#FFFFFF',
            border: `1px solid ${isDarkMode ? '#2a2a2a' : '#E5E5E5'}`
          }}
        >
          <div 
            className="p-2 rounded-lg"
            style={{ backgroundColor: '#ef444420' }}
          >
            <Flame className="w-5 h-5" style={{ color: '#ef4444' }} />
          </div>
          <div>
            <h4 className="text-sm font-bold mb-1" style={{ color: isDarkMode ? '#FFFFFF' : '#010101' }}>
              Bottleneck
            </h4>
            <p className="text-xs leading-relaxed" style={{ color: '#939394' }}>
              <span style={{ color: '#ef4444' }}>{bottleneck.pillar}</span> for{' '}
              <span style={{ color: '#ef4444' }}>{bottleneck.intent}</span> has lowest score ({bottleneck.score}).
            </p>
          </div>
        </div>

        {/* Ownership */}
        <div 
          className="p-4 rounded-xl flex items-start gap-3"
          style={{ 
            backgroundColor: isDarkMode ? '#1a1a1a' : '#FFFFFF',
            border: `1px solid ${isDarkMode ? '#2a2a2a' : '#E5E5E5'}`
          }}
        >
          <div 
            className="p-2 rounded-lg"
            style={{ backgroundColor: '#3b82f620' }}
          >
            <Users className="w-5 h-5" style={{ color: '#3b82f6' }} />
          </div>
          <div>
            <h4 className="text-sm font-bold mb-1" style={{ color: isDarkMode ? '#FFFFFF' : '#010101' }}>
              Ownership
            </h4>
            <p className="text-xs leading-relaxed" style={{ color: '#939394' }}>
              Average "Take Ownership" score across all intents is{' '}
              <span style={{ color: getScoreColor(ownershipAvg) }}>{ownershipAvg}%</span>.
            </p>
          </div>
        </div>

        {/* Efficiency */}
        <div 
          className="p-4 rounded-xl flex items-start gap-3"
          style={{ 
            backgroundColor: isDarkMode ? '#1a1a1a' : '#FFFFFF',
            border: `1px solid ${isDarkMode ? '#2a2a2a' : '#E5E5E5'}`
          }}
        >
          <div 
            className="p-2 rounded-lg"
            style={{ backgroundColor: '#f9731620' }}
          >
            <Zap className="w-5 h-5" style={{ color: '#f97316' }} />
          </div>
          <div>
            <h4 className="text-sm font-bold mb-1" style={{ color: isDarkMode ? '#FFFFFF' : '#010101' }}>
              Efficiency
            </h4>
            <p className="text-xs leading-relaxed" style={{ color: '#939394' }}>
              <span style={{ color: '#22c55e' }}>{efficiency.better}</span> ({efficiency.betterScore}) outperforms{' '}
              <span style={{ color: '#ef4444' }}>{efficiency.worse}</span> ({efficiency.worseScore}) in ease of resolution.
            </p>
          </div>
        </div>
      </div>

    </div>
  );
}

