'use client';

import { useState, useEffect } from 'react';
import {
  AlertTriangle,
  Shield,
  UserX,
  Eye,
  FileWarning,
  Scale,
  CreditCard,
  Users,
  Home,
  Mail,
  Phone,
  MessageSquare,
  Settings,
  RefreshCw
} from 'lucide-react';

interface ComplianceInsight {
  id: string;
  title: string;
  severity: 'critical' | 'high' | 'medium' | 'warning';
  tag: string;
  channel: string;
  regulation: string;
  detected: string;
  impact: string;
  rootCause: string;
  correctiveAction: string;
  preventiveStep: string;
  affectedCount?: number;
  timeAgo: string;
}

interface ComplianceInsightsCardsProps {
  isDarkMode?: boolean;
}

const insightsData: ComplianceInsight[] = [
  {
    id: '1',
    title: 'KYC/Identity Verification Failure',
    severity: 'critical',
    tag: 'POST-ISSUE',
    channel: 'Voice',
    regulation: 'OCC / BSA',
    detected: '2,900+ interactions contained incorrect KYC instructions (e.g., "Any address proof is fine", "You don\'t need a SSN for this").',
    impact: 'Risk of regulatory fines (OCC), false onboarding attempts, customer churn',
    rootCause: 'KYC policy update (Jan 2025) not reflected in agent scripts.',
    correctiveAction: 'Update KYC checklist + force banner in agent desktop.',
    preventiveStep: 'Enable "KYC Script Drift Guard"',
    affectedCount: 2900,
    timeAgo: '2h ago'
  },
  {
    id: '2',
    title: 'AML Suspicious Activity Not Escalated',
    severity: 'critical',
    tag: 'POST-ISSUE',
    channel: 'Voice',
    regulation: 'CFPB / FinCEN',
    detected: '67 calls where customers described potential fraud/scams but agents didn\'t escalate as required by AML protocols.',
    impact: 'CFPB + FinCEN non-compliance, regulatory penalties',
    rootCause: 'Agents unaware of red-flag criteria.',
    correctiveAction: 'Instant refresher on AML escalation triggers.',
    preventiveStep: 'Add automated "Scam Keyword Detector" → forces escalation',
    affectedCount: 67,
    timeAgo: '45m ago'
  },
  {
    id: '3',
    title: 'Data Privacy (GLBA) Breach Indicators',
    severity: 'high',
    tag: 'POST-ISSUE',
    channel: 'Chat',
    regulation: 'GLBA',
    detected: 'Agents shared account balances or last 4 digits without full verification in 412 interactions.',
    impact: 'GLBA privacy violation risk, customer data exposure',
    rootCause: 'Shortcuts during peak hours → skipping full authentication.',
    correctiveAction: 'Enforce mandatory authentication field in agent UI.',
    preventiveStep: 'Trigger real-time "Verification Missing" popup',
    affectedCount: 412,
    timeAgo: '1h ago'
  },
  {
    id: '4',
    title: 'Incorrect Dispute Rights (Reg E)',
    severity: 'high',
    tag: 'POST-ISSUE',
    channel: 'Chat',
    regulation: 'Regulation E',
    detected: '58 interactions where agents said: "We can\'t file a dispute unless the merchant responds."',
    impact: 'Violates Regulation E (customer has right to dispute unauthorized transfers)',
    rootCause: 'Outdated dispute script in Credit & Debit queues.',
    correctiveAction: 'Update Reg E dispute explanation.',
    preventiveStep: 'Train agents on "Customer Liability Limits" (Reg E §1005.6)',
    affectedCount: 58,
    timeAgo: '3h ago'
  },
  {
    id: '5',
    title: 'Incorrect Credit Reporting (FCRA)',
    severity: 'medium',
    tag: 'POST-ISSUE',
    channel: 'Email',
    regulation: 'FCRA',
    detected: 'Agents incorrectly stated: "Missed payments are removed after 6 months." (correct: 7 years)',
    impact: 'CFPB regulatory breach, customer misinformation',
    rootCause: 'Outdated KB article on credit reporting.',
    correctiveAction: 'Fix KB article + enforce standard wording.',
    preventiveStep: 'Add FCRA script guardrail',
    affectedCount: 89,
    timeAgo: '4h ago'
  },
  {
    id: '6',
    title: 'Fair Lending Risk Words (ECOA)',
    severity: 'critical',
    tag: 'POST-ISSUE',
    channel: 'Voice',
    regulation: 'ECOA',
    detected: 'Agents used discriminatory phrases: "Your age may affect loan terms", "People with your background usually get this card."',
    impact: 'High compliance risk, Fair Lending violation',
    rootCause: 'Untrained agents in new lending product line.',
    correctiveAction: 'Immediate Fair Lending training for affected teams.',
    preventiveStep: 'Enable "Sensitive Attribute Phrase Blocker"',
    affectedCount: 23,
    timeAgo: '30m ago'
  },
  {
    id: '7',
    title: 'Misquoting Grace Period (TILA)',
    severity: 'high',
    tag: 'POST-ISSUE',
    channel: 'Chat',
    regulation: 'TILA',
    detected: '240+ chats incorrectly stated "Credit card grace period is 5 days" (it depends on statement cycle).',
    impact: 'Truth in Lending Act error, customer confusion',
    rootCause: 'Incorrect shortcut in agent quick responses.',
    correctiveAction: 'Correct KB + sync Erica model.',
    preventiveStep: 'TILA-specific script guardrails',
    affectedCount: 240,
    timeAgo: '2h ago'
  },
  {
    id: '8',
    title: 'Misleading Fee Explanations (UDAAP)',
    severity: 'warning',
    tag: 'POST-ISSUE',
    channel: 'Voice',
    regulation: 'UDAAP',
    detected: 'Agents told customers: "This maintenance fee can\'t be waived." (waiver is eligible for minimum balance)',
    impact: 'UDAAP ("Deceptive") violation risk',
    rootCause: 'Fee waiver criteria not visible in agent desktop.',
    correctiveAction: 'Update fee waiver script + push correct criteria.',
    preventiveStep: 'Enable "Fee Waiver Eligibility Checker"',
    affectedCount: 156,
    timeAgo: '5h ago'
  },
  {
    id: '9',
    title: 'Poor Handling of Elderly Fraud',
    severity: 'critical',
    tag: 'POST-ISSUE',
    channel: 'Voice',
    regulation: 'CFPB / Older Americans Act',
    detected: 'Agents failed to apply "heightened vigilance" when interacting with elderly customers reporting scams.',
    impact: 'Regulatory + reputational exposure, elder protection failure',
    rootCause: 'No age-based vulnerability indicators in CRM.',
    correctiveAction: 'Reinforce "Elder Abuse Red-Flag Playbook."',
    preventiveStep: 'Add "Elder Vulnerability Detector" in transcripts',
    affectedCount: 34,
    timeAgo: '1h ago'
  },
  {
    id: '10',
    title: 'Incorrect Mortgage Escrow Info (RESPA)',
    severity: 'high',
    tag: 'POST-ISSUE',
    channel: 'Email',
    regulation: 'RESPA',
    detected: 'Agents telling customers incorrect timelines for escrow analysis.',
    impact: 'Potential RESPA violation, mortgage servicing compliance risk',
    rootCause: 'Scripts not updated after RESPA rule clarification.',
    correctiveAction: 'Update mortgage scripts + escalate to Mortgage Servicing Compliance.',
    preventiveStep: 'Enable "RESPA Guidance Guardrail"',
    affectedCount: 78,
    timeAgo: '6h ago'
  },
  {
    id: '11',
    title: 'Written Disputes Not Routed (CFPB)',
    severity: 'medium',
    tag: 'POST-ISSUE',
    channel: 'Secure Message',
    regulation: 'CFPB',
    detected: 'Written secure messages not escalated per policy.',
    impact: 'Risk of customer complaints → regulatory action',
    rootCause: 'Routing rules misconfigured after system update.',
    correctiveAction: 'Reconfigure routing → dedicated dispute mailbox.',
    preventiveStep: 'Monitor secure message queues for delays',
    affectedCount: 112,
    timeAgo: '3h ago'
  },
  {
    id: '12',
    title: 'Improper Consent for Callbacks (TCPA)',
    severity: 'high',
    tag: 'POST-ISSUE',
    channel: 'Voice',
    regulation: 'TCPA',
    detected: 'Call centre agents offered callbacks without obtaining "clear & affirmative consent".',
    impact: 'TCPA violations lead to lawsuits & fines',
    rootCause: 'Callback script missing explicit consent line.',
    correctiveAction: 'Modify callback script with explicit consent line.',
    preventiveStep: 'Auto-block callback scheduling unless consent tagged',
    affectedCount: 203,
    timeAgo: '2h ago'
  },
  {
    id: '13',
    title: 'Erica Generated Incorrect Advice',
    severity: 'medium',
    tag: 'POST-ISSUE',
    channel: 'Erica (AI)',
    regulation: 'UDAAP',
    detected: 'Erica advised customers "Zelle transfers reversible" — incorrect.',
    impact: 'Inaccurate guidance → UDAAP risk, customer financial harm',
    rootCause: 'NLU model not synced with latest Zelle policies.',
    correctiveAction: 'Retrain NLU + sync with KB.',
    preventiveStep: 'Enable "AI Output QA" for regulated topics',
    affectedCount: 1240,
    timeAgo: '30m ago'
  },
  {
    id: '14',
    title: 'Cross-Channel Auth Breakdown',
    severity: 'medium',
    tag: 'POST-ISSUE',
    channel: 'Multi-Channel',
    regulation: 'GLBA',
    detected: 'Chat allowed authentication bypass → voice agent still asked full verification → confusion.',
    impact: 'GLBA risk + customer frustration, inconsistent experience',
    rootCause: 'Authentication tokens not shared across channels.',
    correctiveAction: 'Unify authentication tokens across channels.',
    preventiveStep: 'Enable "Cross-Channel Authentication Consistency Monitor"',
    affectedCount: 89,
    timeAgo: '4h ago'
  },
  {
    id: '15',
    title: 'Written Escalations Misrouted (CFPB)',
    severity: 'high',
    tag: 'POST-ISSUE',
    channel: 'Email',
    regulation: 'CFPB Rule',
    detected: '40 emails tagged as "written complaints" but not routed to the office of the customer advocate.',
    impact: 'CFPB violation, regulatory reporting failure',
    rootCause: 'Email classification rules outdated.',
    correctiveAction: 'Fix email classification rules.',
    preventiveStep: 'Enable "Written Complaint Identifier" using NLP',
    affectedCount: 40,
    timeAgo: '5h ago'
  }
];

export function ComplianceInsightsCards({ isDarkMode = false }: ComplianceInsightsCardsProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [hoveredCard, setHoveredCard] = useState<string | null>(null);

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 100);
    return () => clearTimeout(timer);
  }, []);

  const getSeverityConfig = (severity: ComplianceInsight['severity']) => {
    switch (severity) {
      case 'critical':
        return {
          borderColor: 'rgba(239, 68, 68, 0.6)',
          bgColor: 'rgba(239, 68, 68, 0.05)',
          shadowColor: 'rgba(239, 68, 68, 0.3)',
          badgeBg: 'rgba(239, 68, 68, 0.2)',
          badgeText: '#fca5a5',
          accentColor: '#ef4444'
        };
      case 'high':
        return {
          borderColor: 'rgba(251, 146, 60, 0.6)',
          bgColor: 'rgba(251, 146, 60, 0.05)',
          shadowColor: 'rgba(251, 146, 60, 0.2)',
          badgeBg: 'rgba(251, 146, 60, 0.2)',
          badgeText: '#fdba74',
          accentColor: '#f97316'
        };
      case 'medium':
        return {
          borderColor: 'rgba(250, 204, 21, 0.4)',
          bgColor: 'rgba(250, 204, 21, 0.05)',
          shadowColor: 'rgba(250, 204, 21, 0.1)',
          badgeBg: 'rgba(250, 204, 21, 0.2)',
          badgeText: '#fde047',
          accentColor: '#eab308'
        };
      case 'warning':
        return {
          borderColor: 'rgba(147, 197, 253, 0.4)',
          bgColor: 'rgba(147, 197, 253, 0.05)',
          shadowColor: 'rgba(147, 197, 253, 0.1)',
          badgeBg: 'rgba(147, 197, 253, 0.2)',
          badgeText: '#93c5fd',
          accentColor: '#3b82f6'
        };
    }
  };

  const getChannelIcon = (channel: string) => {
    switch (channel.toLowerCase()) {
      case 'voice':
        return <Phone className="w-3 h-3" />;
      case 'chat':
        return <MessageSquare className="w-3 h-3" />;
      case 'email':
        return <Mail className="w-3 h-3" />;
      case 'secure message':
        return <Shield className="w-3 h-3" />;
      case 'erica (ai)':
        return <span className="text-xs">✨</span>;
      case 'multi-channel':
        return <RefreshCw className="w-3 h-3" />;
      default:
        return <MessageSquare className="w-3 h-3" />;
    }
  };

  const getInsightIcon = (title: string) => {
    if (title.includes('KYC') || title.includes('Identity')) return <UserX className="w-4 h-4" />;
    if (title.includes('AML') || title.includes('Suspicious')) return <AlertTriangle className="w-4 h-4" />;
    if (title.includes('Privacy') || title.includes('GLBA')) return <Eye className="w-4 h-4" />;
    if (title.includes('Dispute') || title.includes('Reg E')) return <FileWarning className="w-4 h-4" />;
    if (title.includes('Credit') || title.includes('FCRA')) return <CreditCard className="w-4 h-4" />;
    if (title.includes('Fair') || title.includes('ECOA')) return <Scale className="w-4 h-4" />;
    if (title.includes('Elderly') || title.includes('Elder')) return <Users className="w-4 h-4" />;
    if (title.includes('Mortgage') || title.includes('RESPA')) return <Home className="w-4 h-4" />;
    if (title.includes('Erica') || title.includes('AI')) return <span className="text-sm">✨</span>;
    return <Shield className="w-4 h-4" />;
  };

  // Sort by severity
  const sortedInsights = [...insightsData].sort((a, b) => {
    const order = { critical: 0, high: 1, medium: 2, warning: 3 };
    return order[a.severity] - order[b.severity];
  });

  return (
    <div
      className={`space-y-4 transition-all duration-500 ${
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
      }`}
    >
      {/* Header */}
      <div className="flex items-center gap-3 flex-wrap">
        <h2
          className="text-lg font-semibold flex items-center gap-2"
          style={{ color: isDarkMode ? '#FFFFFF' : '#010101' }}
        >
          <span className="text-lg">✨</span>
          AI Post-Interaction Compliance Insights
        </h2>
        <span
          className="text-xs px-2 py-1 rounded-full tracking-wide uppercase font-medium"
          style={{
            backgroundColor: 'rgba(239, 68, 68, 0.2)',
            color: '#fca5a5'
          }}
        >
          {sortedInsights.filter(i => i.severity === 'critical').length} Critical
        </span>
        <span
          className="text-xs px-2 py-1 rounded-full tracking-wide uppercase font-medium"
          style={{
            backgroundColor: 'rgba(251, 146, 60, 0.2)',
            color: '#fdba74'
          }}
        >
          {sortedInsights.filter(i => i.severity === 'high').length} High
        </span>
      </div>
      
      <p
        className="text-xs"
        style={{ color: isDarkMode ? '#9ca3af' : '#6b7280' }}
      >
        Live detection of compliance violations, regulatory risks, and policy drift.
      </p>

      {/* Scrollable Cards */}
      <div 
        className="flex gap-4 overflow-x-auto pb-4 items-stretch scrollbar-thin"
        style={{
          scrollbarColor: isDarkMode ? '#333 #1a1a1a' : '#ccc #f0f0f0'
        }}
      >
        {sortedInsights.map((insight, index) => {
          const config = getSeverityConfig(insight.severity);
          const isHovered = hoveredCard === insight.id;
          
          return (
            <div
              key={insight.id}
              className={`w-80 min-w-[20rem] rounded-2xl border px-5 py-5 text-sm shadow-lg flex flex-col transition-all duration-300 cursor-pointer ${
                isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
              }`}
              style={{
                transitionDelay: `${index * 50}ms`,
                borderColor: config.borderColor,
                backgroundColor: isDarkMode ? config.bgColor : `${config.bgColor}`,
                boxShadow: isHovered 
                  ? `0 20px 40px -12px ${config.shadowColor}, 0 0 0 1px ${config.borderColor}`
                  : `0 4px 20px -4px ${config.shadowColor}`,
                transform: isHovered ? 'translateY(-4px)' : 'translateY(0)'
              }}
              onMouseEnter={() => setHoveredCard(insight.id)}
              onMouseLeave={() => setHoveredCard(null)}
            >
              {/* Card Header */}
              <div className="flex items-start justify-between gap-2 mb-3">
                <div className="flex items-center gap-2">
                  <div
                    className="p-1.5 rounded-lg"
                    style={{ backgroundColor: `${config.accentColor}20` }}
                  >
                    <span style={{ color: config.accentColor }}>
                      {getInsightIcon(insight.title)}
                    </span>
                  </div>
                  <span
                    className="font-semibold text-sm leading-tight"
                    style={{ color: isDarkMode ? '#f3f4f6' : '#1f2937' }}
                  >
                    {insight.title}
                  </span>
                </div>
              </div>

              {/* Tags Row */}
              <div className="flex items-center gap-2 mb-3 flex-wrap">
                <span
                  className="text-[10px] px-2 py-0.5 rounded-full uppercase tracking-wider font-semibold"
                  style={{
                    backgroundColor: config.badgeBg,
                    color: config.badgeText
                  }}
                >
                  {insight.severity}
                </span>
              </div>

              {/* Meta Info */}
              <div
                className="space-y-1.5 text-[11px] mb-4"
                style={{ color: isDarkMode ? '#9ca3af' : '#6b7280' }}
              >
                <div className="flex justify-between items-center">
                  <span className="uppercase tracking-wide" style={{ color: isDarkMode ? '#6b7280' : '#9ca3af' }}>
                    Channel
                  </span>
                  <span
                    className="flex items-center gap-1.5"
                    style={{ color: isDarkMode ? '#FFFFFF' : '#1f2937' }}
                  >
                    {getChannelIcon(insight.channel)}
                    {insight.channel}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="uppercase tracking-wide" style={{ color: isDarkMode ? '#6b7280' : '#9ca3af' }}>
                    Regulation
                  </span>
                  <span style={{ color: isDarkMode ? '#FFFFFF' : '#1f2937' }}>
                    {insight.regulation}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="uppercase tracking-wide" style={{ color: isDarkMode ? '#6b7280' : '#9ca3af' }}>
                    Detected
                  </span>
                  <span style={{ color: isDarkMode ? '#FFFFFF' : '#1f2937' }}>
                    {insight.timeAgo}
                  </span>
                </div>
                {insight.affectedCount && (
                  <div className="flex justify-between items-center">
                    <span className="uppercase tracking-wide" style={{ color: isDarkMode ? '#6b7280' : '#9ca3af' }}>
                      Affected
                    </span>
                    <span
                      className="font-semibold"
                      style={{ color: config.accentColor }}
                    >
                      {insight.affectedCount.toLocaleString()} interactions
                    </span>
                  </div>
                )}
              </div>

              {/* Detection Details */}
              <div
                className="flex-1 rounded-xl border p-3 text-xs mb-4"
                style={{
                  backgroundColor: isDarkMode ? 'rgba(0,0,0,0.3)' : 'rgba(255,255,255,0.5)',
                  borderColor: isDarkMode ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)',
                  color: isDarkMode ? '#d1d5db' : '#4b5563'
                }}
              >
                <p className="line-clamp-3 leading-relaxed">
                  {insight.detected}
                </p>
              </div>

              {/* Root Cause */}
              <div className="mb-3">
                <span
                  className="text-[10px] uppercase tracking-wider font-medium"
                  style={{ color: isDarkMode ? '#6b7280' : '#9ca3af' }}
                >
                  Root Cause
                </span>
                <p
                  className="text-xs mt-1 line-clamp-2"
                  style={{ color: isDarkMode ? '#d1d5db' : '#4b5563' }}
                >
                  {insight.rootCause}
                </p>
              </div>

              {/* Actions Section */}
              <div
                className="rounded-xl border p-3 text-xs space-y-2"
                style={{
                  borderColor: `${config.accentColor}40`,
                  backgroundColor: `${config.accentColor}10`
                }}
              >
                <div className="flex items-start gap-2">
                  <Settings className="w-3.5 h-3.5 flex-shrink-0 mt-0.5" style={{ color: config.accentColor }} />
                  <div>
                    <span
                      className="text-[10px] uppercase tracking-wider font-medium block mb-0.5"
                      style={{ color: config.accentColor }}
                    >
                      Corrective Action
                    </span>
                    <span style={{ color: isDarkMode ? '#e5e7eb' : '#374151' }}>
                      {insight.correctiveAction}
                    </span>
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <Shield className="w-3.5 h-3.5 flex-shrink-0 mt-0.5" style={{ color: config.accentColor }} />
                  <div>
                    <span
                      className="text-[10px] uppercase tracking-wider font-medium block mb-0.5"
                      style={{ color: config.accentColor }}
                    >
                      Prevention
                    </span>
                    <span style={{ color: isDarkMode ? '#e5e7eb' : '#374151' }}>
                      {insight.preventiveStep}
                    </span>
                  </div>
                </div>
              </div>

            </div>
          );
        })}
      </div>

    </div>
  );
}

