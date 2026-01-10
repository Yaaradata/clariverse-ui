'use client';

import { useState, useEffect, Fragment } from 'react';
import { usePathname } from 'next/navigation';
import { 
  AlertTriangle, Building2, Clock, RefreshCw, ChevronRight, Filter,
  FileText, Target, ArrowRight, Users, Shield,
  MessageSquare, CheckCircle2, XCircle, TrendingUp, TrendingDown,
  DollarSign, Globe, Activity
} from 'lucide-react';
import { getSeverityColor, getRegionFlag, Region } from '@/lib/compliance/complianceData';

interface RiskItem {
  id: string;
  type: string;
  category: string;
  description: string;
  severity: 'critical' | 'high' | 'medium' | 'low';
  region: Region;
  status: 'active' | 'monitoring' | 'mitigated';
  channel: string;
  timestamp: string;
  impactScore: number;
  likelihood: number;
}

interface RiskDetails {
  rootCause: string;
  businessImpact: string;
  affectedProcesses: string[];
  financialExposure: string;
  mitigationActions: string[];
  controlsInPlace: string[];
  owner: string;
  reviewDate: string;
  trend: number;
  notes: string;
}

// Generate risk data with counts: Fraud: 20, Operational: 18, Reputation: 12, Third-Party: 15
const generateRiskData = (): RiskItem[] => {
  const risks: RiskItem[] = [];
  const regions: Region[] = ['APAC', 'India', 'Europe', 'Americas'];
  const channels = ['Voice', 'Chat', 'Email', 'Ticket', 'Social', 'Multi-Channel'];
  const severities: ('critical' | 'high' | 'medium' | 'low')[] = ['critical', 'high', 'medium', 'low'];
  const statuses: ('active' | 'monitoring' | 'mitigated')[] = ['active', 'monitoring', 'mitigated'];

  // Fraud risks (20) - mapped to Financial type
  const fraudCategories = [
    'Transaction Fraud Alert', 'Account Takeover Risk', 'Identity Theft Pattern', 'Wire Fraud Detection',
    'Card Fraud Attempt', 'Phishing Attack', 'Money Laundering Flag', 'Check Fraud Alert',
    'ACH Fraud Pattern', 'Loan Fraud Risk', 'Duplicate Transaction', 'Counterfeit Alert',
    'Social Engineering', 'Internal Fraud Risk', 'Vendor Payment Fraud', 'Invoice Fraud',
    'Payroll Fraud', 'Refund Fraud', 'Credit Fraud', 'Debit Fraud'
  ];
  fraudCategories.forEach((cat, i) => {
    risks.push({
      id: `RSK-FR-${String(i + 1).padStart(3, '0')}`,
      type: 'Financial',
      category: cat,
      description: `${cat} detected - immediate investigation required to prevent financial loss`,
      severity: i < 3 ? 'critical' : i < 8 ? 'high' : i < 14 ? 'medium' : 'low',
      region: regions[i % regions.length],
      status: i < 12 ? 'active' : i < 16 ? 'monitoring' : 'mitigated',
      channel: channels[i % channels.length],
      timestamp: new Date(Date.now() - i * 3600000).toISOString(),
      impactScore: 95 - i * 2,
      likelihood: 90 - i * 2
    });
  });

  // Operational risks (18)
  const operationalCategories = [
    'System Outage', 'Process Failure', 'SLA Breach', 'Capacity Exceeded',
    'Queue Overflow', 'Batch Failure', 'Integration Error', 'Database Issue',
    'Service Degradation', 'Workflow Disruption', 'Resource Constraint', 'Config Drift',
    'Backup Failure', 'Monitoring Gap', 'Audit Trail Gap', 'Compliance Tool Down',
    'Report Failure', 'Data Sync Issue'
  ];
  operationalCategories.forEach((cat, i) => {
    risks.push({
      id: `RSK-OP-${String(i + 1).padStart(3, '0')}`,
      type: 'Operational',
      category: cat,
      description: `${cat} - operations team to investigate and resolve`,
      severity: i < 2 ? 'critical' : i < 7 ? 'high' : i < 13 ? 'medium' : 'low',
      region: regions[i % regions.length],
      status: i < 10 ? 'active' : i < 14 ? 'monitoring' : 'mitigated',
      channel: channels[i % channels.length],
      timestamp: new Date(Date.now() - i * 3000000).toISOString(),
      impactScore: 88 - i * 2,
      likelihood: 80 - i * 2
    });
  });

  // Reputation risks (12) - mapped to Reputational type
  const reputationCategories = [
    'Negative Media', 'Social Media Crisis', 'Customer Escalation', 'Brand Damage',
    'PR Risk Alert', 'Influencer Criticism', 'Review Alert', 'Regulatory Notice',
    'Executive Risk', 'Competitor Attack', 'Viral Content', 'Trust Decline'
  ];
  reputationCategories.forEach((cat, i) => {
    risks.push({
      id: `RSK-RP-${String(i + 1).padStart(3, '0')}`,
      type: 'Reputational',
      category: cat,
      description: `${cat} - communications team to prepare response`,
      severity: i < 2 ? 'critical' : i < 5 ? 'high' : i < 9 ? 'medium' : 'low',
      region: regions[i % regions.length],
      status: i < 7 ? 'active' : i < 10 ? 'monitoring' : 'mitigated',
      channel: channels[i % channels.length],
      timestamp: new Date(Date.now() - i * 5000000).toISOString(),
      impactScore: 85 - i * 3,
      likelihood: 75 - i * 3
    });
  });

  // Third-Party risks (15) - mapped to Regulatory type
  const thirdPartyCategories = [
    'Vendor Non-Compliance', 'Third-Party Breach', 'Supplier Risk', 'Contract Violation',
    'Vendor Performance', 'Outsourcing Risk', 'Partner Security', 'Subcontractor Audit',
    'Vendor Financial Risk', 'Access Violation', 'BPO Compliance', 'Cloud Provider Risk',
    'Payment Processor', 'API Partner Risk', 'Continuity Risk'
  ];
  thirdPartyCategories.forEach((cat, i) => {
    risks.push({
      id: `RSK-TP-${String(i + 1).padStart(3, '0')}`,
      type: 'Regulatory',
      category: cat,
      description: `${cat} - vendor management team to review`,
      severity: i < 2 ? 'critical' : i < 6 ? 'high' : i < 11 ? 'medium' : 'low',
      region: regions[i % regions.length],
      status: i < 9 ? 'active' : i < 12 ? 'monitoring' : 'mitigated',
      channel: channels[i % channels.length],
      timestamp: new Date(Date.now() - i * 4800000).toISOString(),
      impactScore: 90 - i * 3,
      likelihood: 82 - i * 3
    });
  });

  return risks;
};

const riskData: RiskItem[] = generateRiskData();

// Dynamic function to generate risk details based on risk item
const generateRiskDetails = (risk: RiskItem, isSwedbankRoute: boolean = false, isStandardCharteredRoute: boolean = false): RiskDetails => {
  const typeDetails: Record<string, { 
    processes: string[], 
    controls: string[], 
    owner: string,
    actions: string[]
  }> = {
    'Financial': {
      processes: ['Transaction Monitoring', 'Fraud Detection', 'AML Review', 'Account Security'],
      controls: ['Real-time alerts', 'Daily audit reports', 'Automated flagging'],
      owner: 'Fraud Prevention Director',
      actions: [
        'Initiate immediate investigation',
        'Block suspicious accounts if necessary',
        'Notify affected customers',
        'Engage fraud investigation team',
        'Document incident for regulatory reporting'
      ]
    },
    'Operational': {
      processes: ['Service Delivery', 'Process Management', 'Quality Assurance', 'Resource Planning'],
      controls: ['Performance monitoring', 'SLA tracking', 'Escalation protocols'],
      owner: 'Operations Manager',
      actions: [
        'Activate business continuity plan',
        'Deploy additional resources',
        'Implement workaround procedures',
        'Communicate with stakeholders',
        'Document lessons learned'
      ]
    },
    'Reputational': {
      processes: ['Communications', 'Social Media Management', 'Customer Relations', 'PR Response'],
      controls: ['Social listening tools', 'Crisis protocols', 'Media monitoring'],
      owner: 'Head of Communications',
      actions: [
        'Prepare official response statement',
        'Engage with affected parties directly',
        'Monitor sentiment and media coverage',
        'Coordinate internal messaging',
        'Plan proactive communications'
      ]
    },
    'Regulatory': {
      processes: ['Vendor Management', 'Compliance Monitoring', 'Contract Management', 'Audit Support'],
      controls: ['Vendor assessments', 'Contract reviews', 'Compliance audits'],
      owner: 'Compliance / Vendor Management Lead',
      actions: [
        'Review vendor contract terms',
        'Conduct emergency audit',
        'Prepare regulatory notification if required',
        'Implement enhanced oversight',
        'Evaluate alternative vendors'
      ]
    }
  };

  const details = typeDetails[risk.type] || typeDetails['Operational'];
  
  // Format exposure based on route
  let exposureBase: string;
  if (isSwedbankRoute) {
    exposureBase = risk.severity === 'critical' ? '€5M - €20M' : 
                   risk.severity === 'high' ? '€1M - €5M' : 
                   risk.severity === 'medium' ? '€500K - €2M' : '€100K - €500K';
  } else if (isStandardCharteredRoute) {
    exposureBase = risk.severity === 'critical' ? '$5M - $20M' : 
                   risk.severity === 'high' ? '$1M - $5M' : 
                   risk.severity === 'medium' ? '$500K - $2M' : '$100K - $500K';
  } else {
    exposureBase = risk.severity === 'critical' ? '$5M - $20M' : 
                   risk.severity === 'high' ? '$1M - $5M' : 
                   risk.severity === 'medium' ? '$500K - $2M' : '$100K - $500K';
  }

  return {
    rootCause: `${risk.category} identified in ${risk.channel} channel within ${risk.region} region. Investigation ongoing to determine full scope and contributing factors.`,
    businessImpact: `Potential impact on operations and customer trust. Risk score indicates ${risk.severity} priority for immediate action.`,
    affectedProcesses: details.processes,
    financialExposure: exposureBase,
    mitigationActions: details.actions,
    controlsInPlace: details.controls,
    owner: details.owner,
    reviewDate: risk.severity === 'critical' ? 'Immediate' : risk.severity === 'high' ? 'Within 24 hours' : 'Within 48 hours',
    trend: risk.impactScore > 70 ? Math.floor(Math.random() * 20) + 5 : -Math.floor(Math.random() * 10),
    notes: `Risk ${risk.id} is currently ${risk.status}. Team assigned and monitoring progress. Last updated: ${new Date().toLocaleTimeString()}.`
  };
};

interface ActiveRisksTableProps {
  isDarkMode?: boolean;
}

export function ActiveRisksTable({ isDarkMode = false }: ActiveRisksTableProps) {
  const pathname = usePathname();
  const isSwedbankRoute = pathname?.startsWith('/swedbank');
  const isStandardCharteredRoute = pathname?.startsWith('/standard-chartered');
  const [isVisible, setIsVisible] = useState(false);
  const [selectedSeverity, setSelectedSeverity] = useState<string>('all');
  const [selectedType, setSelectedType] = useState<string>('all');
  const [expandedRow, setExpandedRow] = useState<string | null>(null);

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 400);
    return () => clearTimeout(timer);
  }, []);

  const filteredData = riskData.filter(risk => {
    if (selectedSeverity !== 'all' && risk.severity !== selectedSeverity) return false;
    if (selectedType !== 'all' && risk.type !== selectedType) return false;
    return true;
  });

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    return date.toLocaleDateString();
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return '#ef4444';
      case 'monitoring': return '#f97316';
      case 'mitigated': return '#22c55e';
      default: return '#939394';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'Regulatory': return <Shield className="w-4 h-4" />;
      case 'Operational': return <Activity className="w-4 h-4" />;
      case 'Financial': 
        if (isSwedbankRoute) {
          return <span className="text-[14px] font-semibold">€</span>;
        } else if (isStandardCharteredRoute) {
          return <DollarSign className="w-4 h-4" />;
        } else {
          return <DollarSign className="w-4 h-4" />;
        }
      case 'Reputational': return <Globe className="w-4 h-4" />;
      default: return <AlertTriangle className="w-4 h-4" />;
    }
  };

  const getRiskScore = (impact: number, likelihood: number) => {
    return Math.round((impact * likelihood) / 100);
  };

  const severityOptions = ['all', 'critical', 'high', 'medium', 'low'];
  const typeOptions = ['all', 'Regulatory', 'Operational', 'Financial', 'Reputational'];

  return (
    <div
      className={`rounded-2xl overflow-hidden transition-all duration-500 ${
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
      }`}
      style={{
        backgroundColor: isDarkMode ? '#0d0d0d' : '#FFFFFF',
        border: `1px solid ${isDarkMode ? '#2a2a2a' : '#E5E5E5'}`,
        boxShadow: isDarkMode 
          ? '0 4px 24px rgba(0, 0, 0, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.05)'
          : '0 4px 24px rgba(0, 0, 0, 0.06)'
      }}
    >
      {/* Header */}
      <div className="p-6 border-b" style={{ borderColor: isDarkMode ? '#2a2a2a' : '#E5E5E5' }}>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 
              className="text-lg font-bold mb-1"
              style={{ color: isDarkMode ? '#FFFFFF' : '#010101' }}
            >
              Active Risk Detected
            </h3>
            <p className="text-xs" style={{ color: '#939394' }}>
              {filteredData.length} risks requiring attention • Click to expand details
            </p>
          </div>
          <div className="flex items-center gap-3">
            <div 
              className="flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium"
              style={{ 
                backgroundColor: '#ef444420',
                color: '#ef4444'
              }}
            >
              <AlertTriangle className="w-3 h-3" />
              {riskData.filter(r => r.severity === 'critical').length} Critical
            </div>
            <button 
              className="p-2 rounded-lg transition-colors"
              style={{ 
                backgroundColor: isDarkMode ? '#1a1a1a' : '#F5F5F5',
                color: '#939394'
              }}
            >
              <RefreshCw className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Filters */}
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4" style={{ color: '#939394' }} />
            <span className="text-xs" style={{ color: '#939394' }}>Filters:</span>
          </div>
          
          {/* Severity Filter */}
          <select
            value={selectedSeverity}
            onChange={(e) => setSelectedSeverity(e.target.value)}
            className="text-xs px-3 py-1.5 rounded-lg border-none outline-none cursor-pointer"
            style={{ 
              backgroundColor: isDarkMode ? '#1a1a1a' : '#F5F5F5',
              color: isDarkMode ? '#FFFFFF' : '#010101'
            }}
          >
            {severityOptions.map(opt => (
              <option key={opt} value={opt}>
                {opt === 'all' ? 'All Severities' : opt.charAt(0).toUpperCase() + opt.slice(1)}
              </option>
            ))}
          </select>

          {/* Type Filter */}
          <select
            value={selectedType}
            onChange={(e) => setSelectedType(e.target.value)}
            className="text-xs px-3 py-1.5 rounded-lg border-none outline-none cursor-pointer"
            style={{ 
              backgroundColor: isDarkMode ? '#1a1a1a' : '#F5F5F5',
              color: isDarkMode ? '#FFFFFF' : '#010101'
            }}
          >
            {typeOptions.map(opt => (
              <option key={opt} value={opt}>
                {opt === 'all' ? 'All Types' : opt}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* List */}
      <div className="overflow-y-auto" style={{ maxHeight: '500px' }}>
        <div className="divide-y" style={{ borderColor: isDarkMode ? '#1f1f1f' : '#F0F0F0' }}>
          {filteredData.map((risk, index) => {
            const severityColor = getSeverityColor(risk.severity);
            const statusColor = getStatusColor(risk.status);
            const isExpanded = expandedRow === risk.id;
            const riskDetails = generateRiskDetails(risk, isSwedbankRoute, isStandardCharteredRoute);
            const riskScore = getRiskScore(risk.impactScore, risk.likelihood);

            return (
              <Fragment key={risk.id}>
                <div
                  className={`p-4 cursor-pointer transition-all duration-300 ${
                    isVisible ? 'opacity-100' : 'opacity-0'
                  }`}
                  style={{ 
                    transitionDelay: `${index * 50}ms`,
                    backgroundColor: isExpanded 
                      ? (isDarkMode ? '#1a1a1a' : '#F9F9F9') 
                      : 'transparent',
                    borderBottom: `1px solid ${isDarkMode ? '#1f1f1f' : '#F0F0F0'}`
                  }}
                  onClick={() => setExpandedRow(isExpanded ? null : risk.id)}
                >
                  {/* Main Row */}
                  <div className="flex items-start gap-3">
                    <div 
                      className="p-1.5 rounded-lg shrink-0"
                      style={{ backgroundColor: `${severityColor}15` }}
                    >
                      <AlertTriangle className="w-4 h-4" style={{ color: severityColor }} />
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      {/* Top Row - ID, Category, Type, Severity */}
                      <div className="flex items-center gap-2 flex-wrap mb-1">
                        <span 
                          className="text-[10px] font-mono px-1.5 py-0.5 rounded"
                          style={{ 
                            backgroundColor: isDarkMode ? '#2a2a2a' : '#F0F0F0',
                            color: '#939394'
                          }}
                        >
                          {risk.id}
                        </span>
                        <span 
                          className="px-1.5 py-0.5 rounded text-[10px] font-medium"
                          style={{ 
                            backgroundColor: isDarkMode ? '#5332FF20' : '#5332FF10',
                            color: '#5332FF'
                          }}
                        >
                          {risk.category}
                        </span>
                        <span 
                          className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-medium"
                          style={{ 
                            backgroundColor: isDarkMode ? '#2a2a2a' : '#F0F0F0',
                            color: isDarkMode ? '#FFFFFF' : '#010101'
                          }}
                        >
                          {getTypeIcon(risk.type)}
                          {risk.type}
                        </span>
                        <span 
                          className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-full text-[10px] font-semibold uppercase"
                          style={{ 
                            backgroundColor: `${severityColor}20`,
                            color: severityColor
                          }}
                        >
                          <span 
                            className="w-1.5 h-1.5 rounded-full"
                            style={{ backgroundColor: severityColor }}
                          />
                          {risk.severity}
                        </span>
                      </div>
                      
                      {/* Description */}
                      <p 
                        className={`text-sm leading-relaxed ${isExpanded ? '' : 'line-clamp-1'}`}
                        style={{ color: isDarkMode ? '#E0E0E0' : '#333333' }}
                      >
                        {risk.description}
                      </p>
                      
                      {/* Bottom Row - Channel, Region, Status, Risk Score, Time */}
                      <div className="flex items-center gap-3 mt-2 flex-wrap">
                        <span 
                          className="text-[10px] px-1.5 py-0.5 rounded"
                          style={{ 
                            backgroundColor: isDarkMode ? '#1a1a1a' : '#F5F5F5',
                            color: '#939394'
                          }}
                        >
                          {risk.channel}
                        </span>
                        <span className="text-[11px]" style={{ color: '#939394' }}>
                          {getRegionFlag(risk.region)} {risk.region}
                        </span>
                        <span 
                          className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-medium capitalize"
                          style={{ 
                            backgroundColor: `${statusColor}15`,
                            color: statusColor
                          }}
                        >
                          <span 
                            className="w-1 h-1 rounded-full animate-pulse"
                            style={{ backgroundColor: statusColor }}
                          />
                          {risk.status}
                        </span>
                        <span 
                          className="text-[11px] font-bold"
                          style={{ 
                            color: riskScore >= 80 ? '#ef4444' 
                              : riskScore >= 60 ? '#f97316' 
                              : riskScore >= 40 ? '#eab308' 
                              : '#22c55e' 
                          }}
                        >
                          Score: {riskScore}
                        </span>
                        <span className="text-[10px] flex items-center gap-1" style={{ color: '#939394' }} suppressHydrationWarning>
                          <Clock className="w-3 h-3" />
                          {formatTimestamp(risk.timestamp)}
                        </span>
                      </div>
                    </div>
                    
                    <ChevronRight 
                      className={`w-4 h-4 shrink-0 transition-transform duration-300 ${isExpanded ? 'rotate-90' : ''}`}
                      style={{ color: '#939394' }}
                    />
                  </div>
                </div>

                {/* Expanded Details */}
                {isExpanded && riskDetails && (
                  <div 
                    className="px-4 pb-4"
                    style={{ 
                      backgroundColor: isDarkMode ? '#1a1a1a' : '#F9F9F9',
                      borderBottom: `1px solid ${isDarkMode ? '#1f1f1f' : '#F0F0F0'}`
                    }}
                  >
                        <div 
                          className="rounded-xl p-5 animate-in slide-in-from-top-2 duration-300"
                          style={{ 
                            backgroundColor: isDarkMode ? '#0d0d0d' : '#FFFFFF',
                            border: `1px solid ${isDarkMode ? '#2a2a2a' : '#E5E5E5'}`
                          }}
                        >
                          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                            {/* Left Column - Root Cause & Business Impact */}
                            <div className="space-y-4">
                              {/* Root Cause */}
                              <div>
                                <div className="flex items-center gap-2 mb-2">
                                  <FileText className="w-4 h-4" style={{ color: severityColor }} />
                                  <span 
                                    className="text-xs font-semibold uppercase tracking-wide"
                                    style={{ color: isDarkMode ? '#FFFFFF' : '#010101' }}
                                  >
                                    Root Cause
                                  </span>
                                </div>
                                <p 
                                  className="text-sm leading-relaxed"
                                  style={{ color: isDarkMode ? '#D6D9D8' : '#4a4a4a' }}
                                >
                                  {riskDetails.rootCause}
                                </p>
                              </div>

                              {/* Business Impact */}
                              <div>
                                <div className="flex items-center gap-2 mb-2">
                                  <Target className="w-4 h-4" style={{ color: severityColor }} />
                                  <span 
                                    className="text-xs font-semibold uppercase tracking-wide"
                                    style={{ color: isDarkMode ? '#FFFFFF' : '#010101' }}
                                  >
                                    Business Impact
                                  </span>
                                </div>
                                <p 
                                  className="text-sm leading-relaxed"
                                  style={{ color: isDarkMode ? '#D6D9D8' : '#4a4a4a' }}
                                >
                                  {riskDetails.businessImpact}
                                </p>
                              </div>

                              {/* Affected Processes */}
                              <div>
                                <div className="flex items-center gap-2 mb-2">
                                  <Activity className="w-4 h-4" style={{ color: '#939394' }} />
                                  <span 
                                    className="text-xs font-semibold uppercase tracking-wide"
                                    style={{ color: isDarkMode ? '#FFFFFF' : '#010101' }}
                                  >
                                    Affected Processes
                                  </span>
                                </div>
                                <div className="flex flex-wrap gap-1.5">
                                  {riskDetails.affectedProcesses.map((process, i) => (
                                    <span 
                                      key={i}
                                      className="text-xs px-2 py-1 rounded"
                                      style={{ 
                                        backgroundColor: isDarkMode ? '#1a1a1a' : '#F5F5F5',
                                        color: isDarkMode ? '#D6D9D8' : '#4a4a4a'
                                      }}
                                    >
                                      {process}
                                    </span>
                                  ))}
                                </div>
                              </div>
                            </div>

                            {/* Middle Column - Mitigation Actions */}
                            <div>
                              <div className="flex items-center gap-2 mb-3">
                                <ArrowRight className="w-4 h-4" style={{ color: severityColor }} />
                                <span 
                                  className="text-xs font-semibold uppercase tracking-wide"
                                  style={{ color: isDarkMode ? '#FFFFFF' : '#010101' }}
                                >
                                  Mitigation Actions
                                </span>
                              </div>
                              <ul className="space-y-2">
                                {riskDetails.mitigationActions.map((action, i) => (
                                  <li 
                                    key={i}
                                    className="flex items-start gap-2 text-sm"
                                    style={{ color: isDarkMode ? '#D6D9D8' : '#4a4a4a' }}
                                  >
                                    <span 
                                      className="w-5 h-5 rounded-full flex items-center justify-center shrink-0 text-[10px] font-bold mt-0.5"
                                      style={{ 
                                        backgroundColor: `${severityColor}20`,
                                        color: severityColor
                                      }}
                                    >
                                      {i + 1}
                                    </span>
                                    {action}
                                  </li>
                                ))}
                              </ul>

                              {/* Controls in Place */}
                              <div className="mt-4">
                                <div className="flex items-center gap-2 mb-2">
                                  <Shield className="w-4 h-4" style={{ color: '#22c55e' }} />
                                  <span 
                                    className="text-xs font-semibold uppercase tracking-wide"
                                    style={{ color: isDarkMode ? '#FFFFFF' : '#010101' }}
                                  >
                                    Controls in Place
                                  </span>
                                </div>
                                <div className="flex flex-wrap gap-1.5">
                                  {riskDetails.controlsInPlace.map((control, i) => (
                                    <span 
                                      key={i}
                                      className="text-xs px-2 py-1 rounded"
                                      style={{ 
                                        backgroundColor: '#22c55e15',
                                        color: '#22c55e'
                                      }}
                                    >
                                      ✓ {control}
                                    </span>
                                  ))}
                                </div>
                              </div>
                            </div>

                            {/* Right Column - Meta Info */}
                            <div className="space-y-3">
                              {/* Financial Exposure */}
                              <div 
                                className="p-3 rounded-lg"
                                style={{ 
                                  backgroundColor: `${severityColor}10`,
                                  border: `1px solid ${severityColor}30`
                                }}
                              >
                                <p className="text-[10px] uppercase tracking-wide mb-1" style={{ color: '#939394' }}>
                                  Financial Exposure
                                </p>
                                <p 
                                  className="text-sm font-bold"
                                  style={{ color: severityColor }}
                                >
                                  {riskDetails.financialExposure}
                                </p>
                              </div>

                              {/* Risk Trend */}
                              <div 
                                className="p-3 rounded-lg flex items-center justify-between"
                                style={{ backgroundColor: isDarkMode ? '#1a1a1a' : '#F5F5F5' }}
                              >
                                <div>
                                  <p className="text-[10px] uppercase tracking-wide mb-1" style={{ color: '#939394' }}>
                                    Risk Trend
                                  </p>
                                  <div 
                                    className="flex items-center gap-1"
                                    style={{ color: riskDetails.trend > 0 ? '#ef4444' : '#22c55e' }}
                                  >
                                    {riskDetails.trend > 0 ? (
                                      <TrendingUp className="w-4 h-4" />
                                    ) : (
                                      <TrendingDown className="w-4 h-4" />
                                    )}
                                    <span className="text-sm font-bold">
                                      {riskDetails.trend > 0 ? '+' : ''}{riskDetails.trend}%
                                    </span>
                                  </div>
                                </div>
                                <div className="text-right">
                                  <p className="text-[10px] uppercase tracking-wide mb-1" style={{ color: '#939394' }}>
                                    Review Due
                                  </p>
                                  <p 
                                    className="text-xs font-medium"
                                    style={{ color: riskDetails.reviewDate.includes('Immediate') ? '#ef4444' : (isDarkMode ? '#FFFFFF' : '#010101') }}
                                  >
                                    {riskDetails.reviewDate}
                                  </p>
                                </div>
                              </div>

                              {/* Assignment Info */}
                              <div className="space-y-2">
                                <div className="flex items-center gap-2">
                                  <Users className="w-3.5 h-3.5" style={{ color: '#939394' }} />
                                  <span className="text-xs" style={{ color: '#939394' }}>
                                    {riskDetails.owner}
                                  </span>
                                </div>
                              </div>

                              {/* Notes */}
                              <div 
                                className="p-3 rounded-lg"
                                style={{ backgroundColor: isDarkMode ? '#1a1a1a' : '#F5F5F5' }}
                              >
                                <div className="flex items-center gap-2 mb-1.5">
                                  <MessageSquare className="w-3.5 h-3.5" style={{ color: '#939394' }} />
                                  <span className="text-[10px] uppercase tracking-wide" style={{ color: '#939394' }}>
                                    Notes
                                  </span>
                                </div>
                                <p 
                                  className="text-xs leading-relaxed"
                                  style={{ color: isDarkMode ? '#D6D9D8' : '#4a4a4a' }}
                                >
                                  {riskDetails.notes}
                                </p>
                              </div>

                              {/* Action Buttons */}
                              <div className="flex items-center gap-2 pt-2">
                                <button 
                                  className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg text-xs font-medium transition-colors"
                                  style={{ 
                                    backgroundColor: '#22c55e20',
                                    color: '#22c55e'
                                  }}
                                >
                                  <CheckCircle2 className="w-3.5 h-3.5" />
                                  Mitigate
                                </button>
                                <button 
                                  className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg text-xs font-medium transition-colors"
                                  style={{ 
                                    backgroundColor: '#ef444420',
                                    color: '#ef4444'
                                  }}
                                >
                                  <XCircle className="w-3.5 h-3.5" />
                                  Escalate
                                </button>
                              </div>
                            </div>
                          </div>
                        </div>
                  </div>
                )}
              </Fragment>
            );
          })}
        </div>
      </div>

      {/* Footer */}
      <div 
        className="px-6 py-4 flex items-center justify-between border-t"
        style={{ 
          borderColor: isDarkMode ? '#2a2a2a' : '#E5E5E5',
          backgroundColor: isDarkMode ? '#0a0a0a' : '#FAFAFA'
        }}
      >
        <span className="text-xs" style={{ color: '#939394' }}>
          Showing {filteredData.length} of {riskData.length} risks
        </span>
        <button 
          className="text-xs font-medium px-4 py-2 rounded-lg transition-colors"
          style={{ 
            backgroundColor: '#5332FF',
            color: '#FFFFFF'
          }}
        >
          View Risk Register →
        </button>
      </div>
    </div>
  );
}

