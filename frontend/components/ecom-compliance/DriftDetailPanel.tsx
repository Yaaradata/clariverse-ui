'use client';

import React, { useMemo } from 'react';
import { 
  ShieldAlert, RefreshCcw, FileText, IndianRupee, Gavel, Scale, 
  TrendingUp, AlertTriangle, Activity, X, Sparkles, Target, AlertCircle,
  MessageSquare, Mail, Ticket, Phone, Share2
} from 'lucide-react';

type TimeFilter = '24h' | '7d' | '30d';

interface MicroDrift {
  name: string;
  value: number;
}

interface DriftConfig {
  label: string;
  color: string;
  icon: React.ElementType;
  microDrifts: MicroDrift[];
}

interface RootCause {
  name: string;
  percentage: number;
  microDriftKeys: string[];
}

interface ChannelDistribution {
  chat: number;
  email: number;
  tickets: number;
  voice: number;
  social: number;
}

// Channel colors matching the example
const CHANNEL_COLORS = {
  email: 'rgb(59, 130, 246)',    // Blue
  chat: 'rgb(34, 197, 94)',      // Green
  tickets: 'rgb(249, 115, 22)',  // Orange
  voice: 'rgb(139, 92, 246)',    // Purple
  social: 'rgb(236, 72, 153)',   // Pink
};

// Get channel distribution for a micro-drift
const getMicroDriftChannels = (microName: string, categoryKey: string): ChannelDistribution => {
  // Mock channel distribution based on micro-drift name and category
  // In real implementation, this would come from actual data
  const baseDistributions: Record<string, Record<string, ChannelDistribution>> = {
    refund: {
      'Refund Eligibility Obligation': { email: 25, chat: 35, tickets: 20, voice: 15, social: 5 },
      'Escalation / Frustration Loop': { email: 20, chat: 40, tickets: 25, voice: 10, social: 5 },
      'Return Abuse Signal': { email: 15, chat: 45, tickets: 20, voice: 15, social: 5 },
      'Replacement / Exchange Rule': { email: 30, chat: 30, tickets: 25, voice: 10, social: 5 },
      'Redressal Obligation': { email: 25, chat: 30, tickets: 30, voice: 10, social: 5 },
      'Return Window Exception': { email: 20, chat: 40, tickets: 20, voice: 15, social: 5 },
      'Unresolved Loop Drift': { email: 15, chat: 50, tickets: 20, voice: 10, social: 5 },
    },
    privacy: {
      'PII Exposure Handling': { email: 30, chat: 25, tickets: 20, voice: 15, social: 10 },
      'Data Privacy / DPDP Obligation': { email: 35, chat: 20, tickets: 25, voice: 10, social: 10 },
      'Sensitive Doc Mismanagement': { email: 40, chat: 20, tickets: 25, voice: 10, social: 5 },
      'Data Retention / Deletion': { email: 30, chat: 25, tickets: 30, voice: 10, social: 5 },
      'Consent & Purpose Transparency': { email: 25, chat: 30, tickets: 25, voice: 15, social: 5 },
    },
  };
  
  const categoryDist = baseDistributions[categoryKey] || {};
  const specificDist = categoryDist[microName];
  
  if (specificDist) {
    return specificDist;
  }
  
  // Default distribution if not found
  return { email: 25, chat: 30, tickets: 20, voice: 15, social: 10 };
};


// Root Cause Mapping Logic - Category Specific
const getRootCauses = (categoryKey: string, microDrifts: MicroDrift[]): RootCause[] => {
  // Category-specific root cause mappings
  const categoryRootCauseMap: Record<string, Record<string, string[]>> = {
    privacy: {
      'Data Privacy Policy Misalignment': [
        'Data Privacy / DPDP Obligation',
        'PII Exposure Handling',
        'Consent & Purpose Transparency'
      ],
      'Outdated Consent Scripts': [
        'Data Retention / Deletion',
        'Sensitive Doc Mismanagement'
      ],
      'Customer Data Handling Gap': [
        'PII Exposure Handling',
        'Sensitive Doc Mismanagement'
      ],
      'Regulatory Compliance Drift': [
        'Data Privacy / DPDP Obligation',
        'Consent & Purpose Transparency'
      ]
    },
    refund: {
      'Policy Misinterpretation': [
        'Refund Eligibility Obligation',
        'Return Window Exception',
        'Replacement / Exchange Rule'
      ],
      'Outdated Scripts / Macro Drift': [
        'Replacement / Exchange Rule',
        'Redressal Obligation'
      ],
      'Customer Expectation Gap': [
        'Unresolved Loop Drift',
        'Escalation / Frustration Loop',
        'Return Abuse Signal'
      ],
      'Seller Override Issues': [
        'Return Abuse Signal',
        'Redressal Obligation'
      ],
      'Redressal Cycle Breakdown': [
        'Redressal Obligation',
        'Unresolved Loop Drift'
      ]
    },
    listing: {
      'Product Information Misalignment': [
        'Listing Accuracy & Representation',
        'Product Description Accuracy',
        'Product Safety Communication'
      ],
      'Seller Misconduct Communication': [
        'Fake / Misleading Claims',
        'Seller Misconduct Comm.',
        'Seller Policy Enforcement'
      ],
      'Outdated Listing Guidelines': [
        'Listing Accuracy & Representation',
        'Product Description Accuracy'
      ],
      'Safety Communication Gap': [
        'Product Safety Communication',
        'Seller Policy Enforcement'
      ]
    },
    price: {
      'Price Transparency Policy Drift': [
        'Price Transparency Drift',
        'Dark Pattern / Unfair Trade'
      ],
      'Terms & Conditions Misinterpretation': [
        'T&C Interpretation',
        'Policy Ambiguity'
      ],
      'Customer Expectation Mismatch': [
        'Dark Pattern / Unfair Trade',
        'Policy Ambiguity'
      ],
      'Outdated Pricing Scripts': [
        'Price Transparency Drift',
        'T&C Interpretation'
      ]
    },
    consumer: {
      'Consumer Protection Act Misalignment': [
        'CPA Alignment Drift',
        'Fair Treatment Drift',
        'Unfair Trade Indicators'
      ],
      'Customer Harm Risk Escalation': [
        'Customer Harm Risk',
        'Safety Obligation (non-product)'
      ],
      'Fair Treatment Communication Gap': [
        'Fair Treatment Drift',
        'Unfair Trade Indicators'
      ],
      'Regulatory Compliance Drift': [
        'CPA Alignment Drift',
        'Customer Harm Risk'
      ]
    },
    warranty: {
      'Warranty Term Miscommunication': [
        'Warranty Term Miscommunication',
        'Warranty Eligibility Confusion'
      ],
      'Outdated Warranty Scripts': [
        'Warranty Obligation Drift',
        'Brand Warranty Clarification'
      ],
      'Brand Partnership Confusion': [
        'Brand Warranty Clarification',
        'Warranty Eligibility Confusion'
      ],
      'Service Obligation Drift': [
        'Warranty Obligation Drift',
        'Warranty Term Miscommunication'
      ]
    }
  };

  const rootCauseMap = categoryRootCauseMap[categoryKey] || categoryRootCauseMap.refund;

  // Calculate percentages based on micro-drift values
  const rootCauseScores: Record<string, number> = {};
  let totalScore = 0;

  Object.entries(rootCauseMap).forEach(([rootCause, driftKeys]) => {
    const matchingDrifts = microDrifts.filter(m => 
      driftKeys.some(key => m.name.includes(key) || key.includes(m.name.split(' ')[0]))
    );
    const score = matchingDrifts.reduce((sum, m) => sum + m.value, 0);
    rootCauseScores[rootCause] = score;
    totalScore += score;
  });

  // Convert to percentages
  const rootCauses: RootCause[] = Object.entries(rootCauseScores)
    .map(([name, score]) => ({
      name,
      percentage: totalScore > 0 ? Math.round((score / totalScore) * 100) : 0,
      microDriftKeys: rootCauseMap[name]
    }))
    .filter(rc => rc.percentage > 0) // Only show root causes with > 0%
    .sort((a, b) => b.percentage - a.percentage);

  return rootCauses;
};

// Generate Root Cause Summary as 1 long sentence (≈3 lines)
const getRootCauseSummary = (categoryKey: string): string => {
  const summaryMap: Record<string, string> = {
    refund: 'The drift stems from **inconsistent refund-eligibility messaging** and the continued use of **outdated return-window scripts**, which together create repeated customer confusion and escalate into **policy misinterpretation** across multiple communication channels.',
    privacy: 'The drift originates from **unclear consent disclosures**, irregular use of **DPDP-mandated privacy language**, and multiple instances of **improper PII handling** across chat, email, and voice interactions that weaken compliance posture.',
    listing: 'The drift is driven by customer-reported **product description mismatches**, recurring **seller-driven misinformation**, and rising use of **non-compliant representation language** that collectively weaken the accuracy of marketplace communication.',
    price: 'The drift results from **unclear price breakdowns**, **ambiguous explanations** of fees, discounts, and T&C, and frequent instances of **incomplete disclosure**, which collectively undermine customer trust in transparent pricing.',
    warranty: 'The drift is caused by **inconsistent warranty explanations**, inaccurate or vague **manufacturer warranty statements**, and repeated deviations from standard **service-obligation communication**, which collectively confuse customers.',
    consumer: 'The drift emerges from **inconsistent fair-treatment communication**, customer-reported dissatisfaction linked to **unclear redressal steps**, and escalating patterns of **consumer-harm sentiment** across chat and social channels.'
  };

  return summaryMap[categoryKey] || summaryMap.refund;
};

// Channel Distribution (mock data - would come from actual communication data)
const getChannelDistribution = (categoryKey: string): ChannelDistribution => {
  const distributions: Record<string, ChannelDistribution> = {
    privacy: { chat: 35, email: 25, tickets: 20, voice: 12, social: 8 },
    refund: { chat: 43, email: 22, tickets: 18, voice: 9, social: 8 },
    listing: { chat: 38, email: 28, tickets: 15, voice: 12, social: 7 },
    price: { chat: 40, email: 30, tickets: 15, voice: 10, social: 5 },
    consumer: { chat: 32, email: 25, tickets: 22, voice: 15, social: 6 },
    warranty: { chat: 45, email: 20, tickets: 20, voice: 10, social: 5 }
  };
  return distributions[categoryKey] || { chat: 40, email: 25, tickets: 18, voice: 10, social: 7 };
};

// AI Next Action - Category Specific (1 long sentence ≈3 lines with bold)
const getAIAction = (categoryKey: string): string => {
  const actionMap: Record<string, string> = {
    refund: 'AI recommends **standardizing refund and return-window templates**, enforcing **real-time policy guardrails** to prevent contradictory statements, and automatically **flagging seller override contradictions** that put the platform at compliance risk.',
    privacy: 'AI recommends **reinforcing mandatory consent wording**, implementing **automatic PII redaction safeguards**, and **guiding agents with real-time prompts** whenever their phrasing deviates from approved DPDP compliance language.',
    listing: 'AI recommends **enabling misleading-claim detection**, enforcing usage of **policy-approved description phrasing**, and **escalating sellers with recurring discrepancies** to automated accuracy compliance review workflows.',
    price: 'AI recommends **enforcing standardized fee-breakdown messaging**, triggering alerts for **missing or ambiguous T&C statements**, and **reviewing agent replies** for full transparency compliance before final submission.',
    warranty: 'AI recommends **adopting verified warranty scripts**, providing **corrective prompts for inexact warranty phrasing**, and **escalating conversations** that show persistent service-obligation misalignment for supervisory review.',
    consumer: 'AI recommends **enforcing fair-treatment phrasing**, prompting agents to provide **clear, transparent reasoning** for decisions, and **escalating conversations** that show indicators of customer detriment or perceived unfairness.'
  };

  return actionMap[categoryKey] || actionMap.refund;
};

interface DriftDetailPanelProps {
  selectedCategory: string | null;
  onClose: () => void;
  isDarkMode: boolean;
  driftConfig: Record<string, DriftConfig>;
}

export default function DriftDetailPanel({ 
  selectedCategory, 
  onClose, 
  isDarkMode, 
  driftConfig 
}: DriftDetailPanelProps) {
  const containerBg = isDarkMode ? 'rgb(13, 13, 13)' : 'rgb(255, 255, 255)';
  const containerBorder = isDarkMode ? 'rgb(31, 31, 31)' : 'rgb(229, 231, 235)';
  const textColor = isDarkMode ? 'rgb(244, 244, 245)' : 'rgb(24, 24, 27)';
  const subtextColor = isDarkMode ? 'rgb(161, 161, 170)' : 'rgb(113, 113, 122)';
  const sectionBg = isDarkMode ? 'rgb(24, 24, 27)' : 'rgb(249, 250, 251)';
  const sectionBorder = isDarkMode ? 'rgb(39, 39, 42)' : 'rgb(228, 228, 231)';

  // Memoize allMicroDrifts to ensure stable reference
  const allMicroDrifts = useMemo(() => {
    const categoryKeys = Object.keys(driftConfig);
    return categoryKeys.flatMap(key => driftConfig[key].microDrifts);
  }, [driftConfig]);
  
  // Calculate overall stats for overview
  const overallAvg = useMemo(() => {
    return Math.round(allMicroDrifts.reduce((acc, m) => acc + m.value, 0) / allMicroDrifts.length);
  }, [allMicroDrifts]);
  
  const criticalCount = useMemo(() => {
    return allMicroDrifts.filter(m => m.value >= 70).length;
  }, [allMicroDrifts]);
  
  const warningCount = useMemo(() => {
    return allMicroDrifts.filter(m => m.value >= 50 && m.value < 70).length;
  }, [allMicroDrifts]);
  
  // Find highest drift category
  const categoryScores = useMemo(() => {
    const categoryKeys = Object.keys(driftConfig);
    return categoryKeys.map(key => {
      const avg = Math.round(driftConfig[key].microDrifts.reduce((acc, m) => acc + m.value, 0) / driftConfig[key].microDrifts.length);
      return { key, label: driftConfig[key].label, avg, color: driftConfig[key].color };
    }).sort((a, b) => b.avg - a.avg);
  }, [driftConfig]);
  
  const topCategory = categoryScores[0];
  
  // Calculate top rising drift areas (vs previous period)
  const topRisingDrifts = useMemo(() => {
    // Mock data: Simulate previous period values (current - change)
    // This is descriptive, showing trend movement, NOT predictive
    const risingDrifts = [
      { name: 'PII Exposure Handling', current: 92, previous: 80, change: 12 },
      { name: 'Refund Eligibility Obligation', current: 85, previous: 76, change: 9 },
      { name: 'Price Transparency Drift', current: 68, previous: 60, change: 8 },
      { name: 'Data Privacy / DPDP Obligation', current: 88, previous: 82, change: 6 },
      { name: 'Escalation / Frustration Loop', current: 82, previous: 77, change: 5 },
    ];
    
    return risingDrifts
      .sort((a, b) => b.change - a.change)
      .slice(0, 3); // Top 3 rising drifts
  }, []);

  // Detail view hooks - always call these hooks, but conditionally use them
  const detailConfig = selectedCategory && driftConfig[selectedCategory] ? driftConfig[selectedCategory] : null;
  
  const rootCauses = useMemo(() => {
    if (!selectedCategory || !detailConfig) return [];
    return getRootCauses(selectedCategory, detailConfig.microDrifts);
  }, [selectedCategory, detailConfig]);
  
  const rootCauseSummary = useMemo(() => {
    if (!selectedCategory) return '';
    return getRootCauseSummary(selectedCategory);
  }, [selectedCategory]);
  
  const channelDist = useMemo(() => {
    if (!selectedCategory) return { chat: 0, email: 0, tickets: 0, voice: 0, social: 0 };
    return getChannelDistribution(selectedCategory);
  }, [selectedCategory]);
  
  const aiAction = useMemo(() => {
    if (!selectedCategory) return '';
    return getAIAction(selectedCategory);
  }, [selectedCategory]);

  // If a category is selected, show detail view
  if (selectedCategory && detailConfig) {
    const config = detailConfig;
    const Icon = config.icon;
    const avgScore = Math.round(config.microDrifts.reduce((acc, m) => acc + m.value, 0) / config.microDrifts.length);

    return (
      <div 
        className="rounded-2xl p-4 h-full flex flex-col overflow-hidden"
        style={{ backgroundColor: containerBg, border: `1px solid ${containerBorder}`, height: '100%' }}
      >
        {/* Header with Close Button */}
        <div className="flex items-start justify-between mb-3 flex-shrink-0">
          <div className="flex items-center gap-2">
            <div 
              className="p-2 rounded-lg"
              style={{ backgroundColor: `${config.color}20` }}
            >
              <Icon size={16} style={{ color: config.color }} />
            </div>
            <div>
              <p 
                className="text-sm font-semibold"
                style={{ color: textColor }}
              >
                {config.label}
              </p>
              <span className="text-xl font-mono font-bold" style={{ color: config.color }}>
                {avgScore}%
              </span>
            </div>
          </div>
          <div className="flex items-center gap-3">
            {/* Channel Legend */}
            <div className="flex items-center gap-2">
              <span 
                className="text-[10px] font-semibold flex-shrink-0"
                style={{ color: subtextColor }}
              >
                Channels:
              </span>
              <div className="flex items-center gap-1.5 flex-shrink-0">
                <div className="flex items-center gap-1">
                  <Mail size={11} style={{ color: CHANNEL_COLORS.email }} />
                  <span className="text-[10px]" style={{ color: subtextColor }}>Email</span>
                </div>
                <div className="flex items-center gap-1">
                  <MessageSquare size={11} style={{ color: CHANNEL_COLORS.chat }} />
                  <span className="text-[10px]" style={{ color: subtextColor }}>Chat</span>
                </div>
                <div className="flex items-center gap-1">
                  <Ticket size={11} style={{ color: CHANNEL_COLORS.tickets }} />
                  <span className="text-[10px]" style={{ color: subtextColor }}>Ticket</span>
                </div>
                <div className="flex items-center gap-1">
                  <Phone size={11} style={{ color: CHANNEL_COLORS.voice }} />
                  <span className="text-[10px]" style={{ color: subtextColor }}>Voice</span>
                </div>
                <div className="flex items-center gap-1">
                  <Share2 size={11} style={{ color: CHANNEL_COLORS.social }} />
                  <span className="text-[10px]" style={{ color: subtextColor }}>Social</span>
                </div>
              </div>
            </div>
            <button 
              onClick={onClose}
              className="p-1.5 rounded-lg transition-colors"
              style={{ color: subtextColor }}
            >
              <X size={14} />
            </button>
          </div>
        </div>

        {/* Main Content: Root Cause Analysis (Top) + Micro-Drift Signals & AI Action (Bottom, Side by Side) */}
        <div className="flex flex-col gap-3 flex-shrink-0">
          {/* Top: Root Cause Analysis (Full Width) */}
          <div 
            className="rounded-xl p-4"
            style={{ 
              backgroundColor: sectionBg,
              border: `1px solid ${sectionBorder}`
            }}
          >
            <h4 
              className="text-xs font-semibold mb-2.5 uppercase tracking-wider"
              style={{ color: textColor }}
            >
              Root Cause Analysis
            </h4>
            <p 
              className="text-[11px] leading-relaxed"
              style={{ color: subtextColor }}
            >
              {(() => {
                // Parse bold text (**text**) and render with proper styling
                const parts = rootCauseSummary.split(/(\*\*.*?\*\*)/g);
                return parts.map((part, partIdx) => {
                  if (part.startsWith('**') && part.endsWith('**')) {
                    const boldText = part.slice(2, -2);
                    return (
                      <strong key={partIdx} style={{ color: textColor, fontWeight: 600 }}>
                        {boldText}
                      </strong>
                    );
                  }
                  return <span key={partIdx}>{part}</span>;
                });
              })()}
            </p>
          </div>

          {/* Bottom: Micro-Drift Signals (Left) + AI Next Action (Right) */}
          <div className="grid grid-cols-2 gap-3">
            {/* Left: Micro-Drift Progress Bars */}
            <div 
              className="rounded-xl p-4"
              style={{ 
                backgroundColor: sectionBg,
                border: `1px solid ${sectionBorder}`
              }}
            >
              <h4 
                className="text-xs font-semibold mb-2 uppercase tracking-wider"
                style={{ color: textColor }}
              >
                Micro-Drift Signals
              </h4>
              
              <div className="space-y-1.5">
                {config.microDrifts
                  .sort((a, b) => b.value - a.value)
                  .map((micro, idx) => {
                    const statusColor = micro.value >= 70 ? 'rgb(239, 68, 68)' : micro.value >= 50 ? 'rgb(245, 158, 11)' : 'rgb(59, 130, 246)';
                    const channelDist = getMicroDriftChannels(micro.name, selectedCategory || '');
                    
                    // Calculate channel percentages relative to the micro-drift value
                    const totalChannelPercent = channelDist.email + channelDist.chat + channelDist.tickets + channelDist.voice + channelDist.social;
                    const channelWidths = {
                      email: (channelDist.email / totalChannelPercent) * 100,
                      chat: (channelDist.chat / totalChannelPercent) * 100,
                      tickets: (channelDist.tickets / totalChannelPercent) * 100,
                      voice: (channelDist.voice / totalChannelPercent) * 100,
                      social: (channelDist.social / totalChannelPercent) * 100,
                    };
                    
                    return (
                      <div 
                        key={idx}
                      >
                        <div className="flex items-center justify-between mb-1">
                          <span 
                            className="text-[10px] font-medium"
                            style={{ color: textColor }}
                          >
                            {micro.name}
                          </span>
                          <span 
                            className="text-[10px] font-mono font-semibold"
                            style={{ color: statusColor }}
                          >
                            {micro.value}%
                          </span>
                        </div>
                        <div 
                          className="relative h-2 w-full rounded-full overflow-hidden"
                          style={{ backgroundColor: isDarkMode ? 'rgb(26, 26, 26)' : 'rgb(228, 228, 231)' }}
                        >
                          <div 
                            className="h-full flex rounded-full overflow-hidden transition-all duration-700 ease-out"
                            style={{ width: `${micro.value}%` }}
                          >
                            <div 
                              className="h-full"
                              style={{ 
                                width: `${channelWidths.email}%`, 
                                backgroundColor: CHANNEL_COLORS.email,
                                opacity: 0.9,
                              }} 
                            />
                            <div 
                              className="h-full"
                              style={{ 
                                width: `${channelWidths.chat}%`, 
                                backgroundColor: CHANNEL_COLORS.chat,
                                opacity: 0.9,
                              }} 
                            />
                            <div 
                              className="h-full"
                              style={{ 
                                width: `${channelWidths.tickets}%`, 
                                backgroundColor: CHANNEL_COLORS.tickets,
                                opacity: 0.9,
                              }} 
                            />
                            <div 
                              className="h-full"
                              style={{ 
                                width: `${channelWidths.voice}%`, 
                                backgroundColor: CHANNEL_COLORS.voice,
                                opacity: 0.9,
                              }} 
                            />
                            <div 
                              className="h-full"
                              style={{ 
                                width: `${channelWidths.social}%`, 
                                backgroundColor: CHANNEL_COLORS.social,
                                opacity: 0.9,
                              }} 
                            />
                          </div>
                        </div>
                      </div>
                    );
                  })}
              </div>
            </div>

            {/* Right: AI Next Action */}
            <div 
              className="rounded-xl p-4"
              style={{ 
                backgroundColor: sectionBg,
                border: `1px solid ${sectionBorder}`
              }}
            >
              <h4 
                className="text-xs font-semibold mb-2.5 uppercase tracking-wider flex items-center gap-1.5"
                style={{ color: textColor }}
              >
                <Sparkles size={12} style={{ color: 'rgb(129, 140, 248)' }} />
                AI Recommended Next Action
              </h4>
              <p 
                className="text-[11px] leading-relaxed"
                style={{ color: subtextColor }}
              >
                {(() => {
                  // Parse bold text (**text**) and render with proper styling
                  const parts = aiAction.split(/(\*\*.*?\*\*)/g);
                  return parts.map((part, partIdx) => {
                    if (part.startsWith('**') && part.endsWith('**')) {
                      const boldText = part.slice(2, -2);
                      return (
                        <strong key={partIdx} style={{ color: textColor, fontWeight: 600 }}>
                          {boldText}
                        </strong>
                      );
                    }
                    return <span key={partIdx}>{part}</span>;
                  });
                })()}
              </p>
              <p 
                className="text-[10px] mt-3 pt-3 border-t italic"
                style={{ color: subtextColor, borderColor: sectionBorder }}
              >
                Most violations observed in Chat ({channelDist.chat}%) and Email ({channelDist.email}%).
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Default: Overview Panel
  return (
    <div 
      className="rounded-2xl p-4 h-full flex flex-col overflow-hidden"
      style={{ backgroundColor: containerBg, border: `1px solid ${containerBorder}`, height: '100%' }}
    >
      {/* Header */}
      <div className="mb-3 flex-shrink-0">
        <h4 
          className="text-base font-semibold mb-1"
          style={{ color: textColor }}
        >
          Drift Overview
        </h4>
        <p className="text-[9px]" style={{ color: subtextColor }}>
          Click on chart waves to drill down
        </p>
      </div>

      {/* Overview Summary */}
      <div 
        className="rounded-xl p-4 mb-3 flex-shrink-0"
        style={{ 
          backgroundColor: sectionBg,
          border: `1px solid ${sectionBorder}`
        }}
      >
        <h4 
          className="text-xs font-semibold mb-2.5 uppercase tracking-wider"
          style={{ color: textColor }}
        >
          Overview Summary
        </h4>
        <p 
          className="text-[11px] leading-relaxed mb-2"
          style={{ color: subtextColor }}
        >
          Overall compliance drift across <strong style={{ color: textColor, fontWeight: 600 }}>{categoryScores.length} categories</strong> shows an average of <strong style={{ color: textColor, fontWeight: 600 }}>{overallAvg}%</strong> with <strong style={{ color: textColor, fontWeight: 600 }}>{criticalCount} critical</strong> and <strong style={{ color: textColor, fontWeight: 600 }}>{warningCount} warning</strong> signals requiring attention across <strong style={{ color: textColor, fontWeight: 600 }}>{allMicroDrifts.length} micro-drift indicators</strong>.
        </p>
        <p 
          className="text-[11px] leading-relaxed"
          style={{ color: subtextColor }}
        >
          The highest risk category is <strong style={{ color: textColor, fontWeight: 600 }}>{topCategory.label}</strong> with an average drift of <strong style={{ color: topCategory.color, fontWeight: 600 }}>{topCategory.avg}%</strong>.
        </p>
      </div>

      {/* Middle Row: Critical, Warning, Highest Risk */}
      <div className="grid grid-cols-3 gap-3 mb-3 flex-shrink-0">
        {/* Left: Critical */}
        <div 
          className="rounded-lg p-2.5"
          style={{ backgroundColor: 'rgba(239, 68, 68, 0.1)', border: '1px solid rgba(239, 68, 68, 0.2)' }}
        >
          <div className="flex items-center gap-1.5 mb-1">
            <AlertTriangle size={10} style={{ color: 'rgb(239, 68, 68)' }} />
            <span className="text-[8px] uppercase font-medium" style={{ color: 'rgb(239, 68, 68)' }}>Critical</span>
          </div>
          <span className="text-lg font-mono font-bold" style={{ color: 'rgb(239, 68, 68)' }}>{criticalCount}</span>
        </div>
        
        {/* Center: Warning */}
        <div 
          className="rounded-lg p-2.5"
          style={{ backgroundColor: 'rgba(245, 158, 11, 0.1)', border: '1px solid rgba(245, 158, 11, 0.2)' }}
        >
          <div className="flex items-center gap-1.5 mb-1">
            <TrendingUp size={10} style={{ color: 'rgb(245, 158, 11)' }} />
            <span className="text-[8px] uppercase font-medium" style={{ color: 'rgb(245, 158, 11)' }}>Warning</span>
          </div>
          <span className="text-lg font-mono font-bold" style={{ color: 'rgb(245, 158, 11)' }}>{warningCount}</span>
        </div>
        
        {/* Right: Highest Risk */}
        <div 
          className="rounded-lg p-2.5"
          style={{ 
            backgroundColor: `${topCategory.color}10`,
            border: `1px solid ${topCategory.color}30`
          }}
        >
          <span className="text-[8px] uppercase tracking-wider font-medium block mb-1" style={{ color: subtextColor }}>
            Highest Risk
          </span>
          <p className="text-[10px] font-semibold" style={{ color: topCategory.color }}>
            {topCategory.label}
          </p>
          <span className="text-[9px] font-mono" style={{ color: subtextColor }}>
            {topCategory.avg}% avg drift
          </span>
        </div>
      </div>

      {/* Bottom Row: Top Rising Drift Areas (Left) + AI Insight (Right) */}
      <div className="grid grid-cols-2 gap-3 flex-shrink-0">
        {/* Left: Top Rising Drift Areas */}
        <div 
          className="rounded-xl p-4"
          style={{ 
            backgroundColor: sectionBg,
            border: `1px solid ${sectionBorder}`
          }}
        >
          <h4 
            className="text-xs font-semibold mb-3 uppercase tracking-wider"
            style={{ color: textColor }}
          >
            Top Rising Drift Areas
          </h4>
          <p 
            className="text-[9px] mb-3 italic"
            style={{ color: subtextColor }}
          >
            Trend movement vs previous period (descriptive, not predictive)
          </p>
          <div className="space-y-2.5">
            {topRisingDrifts.map((drift, idx) => {
              const changeColor = drift.change >= 10 ? 'rgb(239, 68, 68)' : drift.change >= 5 ? 'rgb(245, 158, 11)' : 'rgb(59, 130, 246)';
              
              return (
                <div 
                  key={idx}
                  className="flex items-center justify-between"
                >
                  <span 
                    className="text-[10px] font-medium flex-1"
                    style={{ color: textColor }}
                  >
                    {drift.name}
                  </span>
                  <span 
                    className="text-[10px] font-mono font-semibold ml-2"
                    style={{ color: changeColor }}
                  >
                    +{drift.change}%
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right: AI Insight */}
        <div 
          className="rounded-xl p-4"
          style={{ 
            background: isDarkMode ? 'linear-gradient(to bottom, rgba(129, 140, 248, 0.1), transparent)' : 'rgba(129, 140, 248, 0.08)',
            borderLeft: '2px solid rgb(129, 140, 248)',
            border: `1px solid ${sectionBorder}`
          }}
        >
          <h4 
            className="text-xs font-semibold mb-2.5 uppercase tracking-wider flex items-center gap-1.5"
            style={{ color: 'rgb(129, 140, 248)' }}
          >
            <Sparkles size={12} style={{ color: 'rgb(129, 140, 248)' }} />
            AI Insight
          </h4>
          <p 
            className="text-[11px] leading-relaxed"
            style={{ color: subtextColor }}
          >
            <strong style={{ color: textColor, fontWeight: 600 }}>{topCategory.label}</strong> shows elevated drift. 
            Focus on PII handling and consent transparency. {criticalCount} signals need immediate attention.
          </p>
        </div>
      </div>
    </div>
  );
}
