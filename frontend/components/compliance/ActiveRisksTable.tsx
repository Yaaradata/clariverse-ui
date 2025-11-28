'use client';

import { useState, useEffect, Fragment } from 'react';
import { 
  AlertTriangle, Building2, Clock, RefreshCw, ChevronRight, Filter,
  FileText, Target, ArrowRight, Users, Shield, Zap,
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

const riskData: RiskItem[] = [
  {
    id: 'RSK-001',
    type: 'Regulatory',
    category: 'GDPR Non-Compliance',
    description: 'Customer consent records incomplete for 15% of European accounts processed through voice channel',
    severity: 'critical',
    region: 'Europe',
    status: 'active',
    channel: 'Voice',
    timestamp: new Date(Date.now() - 1800000).toISOString(),
    impactScore: 92,
    likelihood: 85
  },
  {
    id: 'RSK-002',
    type: 'Operational',
    category: 'Third-Party Vendor Risk',
    description: 'BPO vendor security audit revealed unauthorized data retention practices',
    severity: 'critical',
    region: 'APAC',
    status: 'active',
    channel: 'Multi-Channel',
    timestamp: new Date(Date.now() - 7200000).toISOString(),
    impactScore: 95,
    likelihood: 90
  },
  {
    id: 'RSK-003',
    type: 'Financial',
    category: 'AML Alert Backlog',
    description: 'Unreviewed AML alerts exceeding 72-hour SLA threshold by 340%',
    severity: 'high',
    region: 'Americas',
    status: 'active',
    channel: 'Ticket',
    timestamp: new Date(Date.now() - 14400000).toISOString(),
    impactScore: 78,
    likelihood: 70
  },
  {
    id: 'RSK-004',
    type: 'Reputational',
    category: 'Social Media Escalation',
    description: 'Viral customer complaint about fee disclosure gaining traction on Twitter/X',
    severity: 'high',
    region: 'Americas',
    status: 'monitoring',
    channel: 'Social',
    timestamp: new Date(Date.now() - 3600000).toISOString(),
    impactScore: 72,
    likelihood: 65
  },
  {
    id: 'RSK-005',
    type: 'Operational',
    category: 'Script Compliance Drift',
    description: 'Script adherence declining across EMEA voice team - down 12% this week',
    severity: 'medium',
    region: 'Europe',
    status: 'monitoring',
    channel: 'Voice',
    timestamp: new Date(Date.now() - 28800000).toISOString(),
    impactScore: 58,
    likelihood: 55
  },
  {
    id: 'RSK-006',
    type: 'Technology',
    category: 'System Vulnerability',
    description: 'CRM authentication timeout allowing extended sessions without re-verification',
    severity: 'high',
    region: 'India',
    status: 'active',
    channel: 'Chat',
    timestamp: new Date(Date.now() - 10800000).toISOString(),
    impactScore: 68,
    likelihood: 75
  },
  {
    id: 'RSK-007',
    type: 'Regulatory',
    category: 'TCPA Violation Pattern',
    description: 'Callback consent not properly documented in 8% of outbound calls',
    severity: 'medium',
    region: 'Americas',
    status: 'monitoring',
    channel: 'Voice',
    timestamp: new Date(Date.now() - 43200000).toISOString(),
    impactScore: 52,
    likelihood: 60
  },
  {
    id: 'RSK-008',
    type: 'Financial',
    category: 'Fraud Detection Gap',
    description: 'Email phishing attacks bypassing current detection filters - 3 incidents this week',
    severity: 'critical',
    region: 'APAC',
    status: 'active',
    channel: 'Email',
    timestamp: new Date(Date.now() - 5400000).toISOString(),
    impactScore: 88,
    likelihood: 80
  }
];

const riskDetailsMap: Record<string, RiskDetails> = {
  'RSK-001': {
    rootCause: 'IVR consent capture flow not triggering properly for calls transferred from mobile app. Legacy integration issue identified.',
    businessImpact: 'Potential GDPR Article 7 violation. Risk of regulatory investigation and customer complaints.',
    affectedProcesses: ['Voice Onboarding', 'App-to-Agent Transfer', 'Call Recording'],
    financialExposure: '€2M - €10M potential fine',
    mitigationActions: [
      'Deploy emergency IVR patch within 24 hours',
      'Manual consent verification for all affected accounts',
      'Prepare GDPR breach notification template',
      'Engage legal for regulatory impact assessment'
    ],
    controlsInPlace: ['Daily consent audit report', 'QA sampling of calls'],
    owner: 'Data Protection Officer - EU',
    reviewDate: 'Due in 12 hours',
    trend: 15,
    notes: 'Engineering team deployed hotfix at 14:00 UTC. Monitoring consent capture rates.'
  },
  'RSK-002': {
    rootCause: 'Vendor retained customer data on local servers beyond contractual retention period. Discovered during routine audit.',
    businessImpact: 'Data breach potential affecting 50,000+ customer records. Contract violation. Regulatory exposure.',
    affectedProcesses: ['BPO Data Processing', 'Customer Support', 'Back-office Operations'],
    financialExposure: '$5M - $20M potential liability',
    mitigationActions: [
      'Immediate suspension of vendor data access',
      'Forensic audit of vendor systems',
      'Customer notification preparation',
      'Contract termination review with legal',
      'Alternative vendor activation'
    ],
    controlsInPlace: ['Quarterly vendor audits', 'DLP monitoring'],
    owner: 'CISO + Vendor Management',
    reviewDate: 'Immediate escalation',
    trend: 25,
    notes: 'Crisis team activated. Board notification scheduled for 18:00 UTC.'
  },
  'RSK-003': {
    rootCause: 'Staff shortage in AML review team combined with 40% increase in flagged transactions due to new detection rules.',
    businessImpact: 'FinCEN regulatory risk. Potential for missed suspicious activity. SAR filing delays.',
    affectedProcesses: ['AML Monitoring', 'Transaction Review', 'SAR Filing'],
    financialExposure: '$1M - $5M potential fines',
    mitigationActions: [
      'Deploy additional AML analysts from other regions',
      'Implement risk-based triage for alert prioritization',
      'Overtime authorization for existing team',
      'Review alert threshold calibration'
    ],
    controlsInPlace: ['Daily backlog monitoring', 'Escalation at 48-hour threshold'],
    owner: 'AML Compliance Director',
    reviewDate: 'Daily review',
    trend: -8,
    notes: 'Backlog reducing after temporary staff deployment. Target clear within 5 days.'
  },
  'RSK-004': {
    rootCause: 'Customer posted about undisclosed overdraft fee. Post gained 50K+ engagements. Media outlets picking up story.',
    businessImpact: 'Brand reputation damage. Potential regulatory inquiry. Customer trust erosion.',
    affectedProcesses: ['Social Media Response', 'PR Communications', 'Customer Relations'],
    financialExposure: 'Indirect - estimated brand impact $500K - $2M',
    mitigationActions: [
      'Prepare official response statement',
      'Direct outreach to affected customer',
      'Review fee disclosure scripts across all channels',
      'Proactive media briefing'
    ],
    controlsInPlace: ['Social media monitoring', 'Crisis communication protocol'],
    owner: 'Head of Communications',
    reviewDate: 'Hourly monitoring',
    trend: 35,
    notes: 'Customer contacted, resolution in progress. Sentiment tracking shows stabilization.'
  },
  'RSK-005': {
    rootCause: 'New product launch scripts not fully integrated into agent workflow. Training completion at 68%.',
    businessImpact: 'Increased compliance violations. Customer confusion on new product terms.',
    affectedProcesses: ['Voice Sales', 'Product Onboarding', 'Quality Assurance'],
    financialExposure: '$100K - $500K potential regulatory exposure',
    mitigationActions: [
      'Mandatory script training completion by EOW',
      'Enable real-time script prompts',
      'Increase QA sampling rate to 20%',
      'Daily compliance score reporting to team leads'
    ],
    controlsInPlace: ['Weekly script compliance reporting', 'Agent coaching program'],
    owner: 'EMEA Operations Manager',
    reviewDate: 'Weekly review',
    trend: -5,
    notes: 'Training completion trending upward. Expected full compliance by Friday.'
  },
  'RSK-006': {
    rootCause: 'Session timeout extended to 4 hours during holiday period for customer convenience. Never reverted.',
    businessImpact: 'Security vulnerability. Unauthorized access risk. GLBA compliance concern.',
    affectedProcesses: ['CRM Access', 'Customer Data Viewing', 'Chat Support'],
    financialExposure: '$500K - $2M potential breach liability',
    mitigationActions: [
      'Immediate timeout reduction to 15 minutes',
      'Forced re-authentication for sensitive actions',
      'Audit log review for suspicious access patterns',
      'Security awareness reminder to all agents'
    ],
    controlsInPlace: ['Access logging', 'Anomaly detection'],
    owner: 'IT Security Manager',
    reviewDate: 'Immediate fix',
    trend: 0,
    notes: 'Configuration change scheduled for deployment at 02:00 UTC tonight.'
  },
  'RSK-007': {
    rootCause: 'Agents inconsistently using callback consent script. CRM checkbox not mandatory.',
    businessImpact: 'TCPA lawsuit exposure. Class action potential.',
    affectedProcesses: ['Outbound Calls', 'Callback Scheduling', 'Lead Management'],
    financialExposure: '$500 - $1,500 per violation (potential class action)',
    mitigationActions: [
      'Make consent checkbox mandatory in CRM',
      'Script compliance coaching for flagged agents',
      'Implement call recording review for callbacks',
      'Legal review of current consent language'
    ],
    controlsInPlace: ['Call recording', 'Monthly compliance audit'],
    owner: 'US Compliance Manager',
    reviewDate: 'Weekly review',
    trend: -3,
    notes: 'CRM update scheduled for next sprint. Interim manual verification in place.'
  },
  'RSK-008': {
    rootCause: 'Sophisticated phishing campaign mimicking internal communications. Current filters not detecting new patterns.',
    businessImpact: 'Customer account compromise. Financial fraud. Data breach potential.',
    affectedProcesses: ['Email Security', 'Customer Communications', 'Account Security'],
    financialExposure: '$1M - $10M fraud exposure',
    mitigationActions: [
      'Deploy emergency email filter rules',
      'Customer advisory on phishing awareness',
      'Mandatory password reset for compromised accounts',
      'Enhanced monitoring for suspicious login patterns',
      'Vendor engagement for advanced threat protection'
    ],
    controlsInPlace: ['Email filtering', 'Fraud monitoring', 'Customer alerts'],
    owner: 'Fraud Prevention Director',
    reviewDate: 'Continuous monitoring',
    trend: 20,
    notes: '3 accounts compromised, secured. Investigating attack origin with external security firm.'
  }
};

interface ActiveRisksTableProps {
  isDarkMode?: boolean;
}

export function ActiveRisksTable({ isDarkMode = false }: ActiveRisksTableProps) {
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
      case 'Financial': return <DollarSign className="w-4 h-4" />;
      case 'Reputational': return <Globe className="w-4 h-4" />;
      case 'Technology': return <Zap className="w-4 h-4" />;
      default: return <AlertTriangle className="w-4 h-4" />;
    }
  };

  const getRiskScore = (impact: number, likelihood: number) => {
    return Math.round((impact * likelihood) / 100);
  };

  const severityOptions = ['all', 'critical', 'high', 'medium', 'low'];
  const typeOptions = ['all', 'Regulatory', 'Operational', 'Financial', 'Reputational', 'Technology'];

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
            const riskDetails = riskDetailsMap[risk.id];
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
                      className="p-1.5 rounded-lg flex-shrink-0"
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
                      className={`w-4 h-4 flex-shrink-0 transition-transform duration-300 ${isExpanded ? 'rotate-90' : ''}`}
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
                                      className="w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 text-[10px] font-bold mt-0.5"
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

