'use client';

import { useMemo, useState, useEffect } from 'react';
import { 
  UserX, AlertTriangle, TrendingUp, TrendingDown, 
  Eye, ChevronRight, Shield, Clock, X, FileText,
  Target, ArrowRight, Calendar, Phone, Mail, Building,
  CheckCircle2, XCircle, AlertCircle, BarChart3, Users,
  MessageSquare, Ticket, Mic, Share2, Euro
} from 'lucide-react';
import { getRegionFlag, Region } from '@/lib/compliance/complianceData';
import type { Violation } from '@/lib/swedbank/voiceData';

interface WatchlistAgent {
  id: string;
  name: string;
  region: Region;
  violationCount: number;
  trend: number;
  lastViolation: string;
  riskLevel: 'critical' | 'high' | 'medium';
  categories: string[];
  regulations?: string[];  // Act/regulation names from violations
  channel: 'email' | 'chat' | 'ticket' | 'voice' | 'social';
}

// Extended agent details
interface AgentDetails {
  email: string;
  phone: string;
  department: string;
  supervisor: string;
  tenure: string;
  totalCalls: number;
  complianceScore: number;
  gaps: {
    area: string;
    description: string;
    severity: 'critical' | 'high' | 'medium' | 'low';
    occurrences: number;
  }[];
  recentViolations: {
    date: string;
    type: string;
    description: string;
    status: 'open' | 'resolved' | 'investigating';
    regulation?: string;  // Act/regulation name
  }[];
  recommendations: string[];
  trainingStatus: {
    name: string;
    completed: boolean;
    dueDate?: string;
  }[];
}

const agentDetailsMap: Record<string, AgentDetails> = {
  'AGT-1823': {
    email: 'sarah.williams@company.com',
    phone: '+44 20 7123 4567',
    department: 'Customer Service - Premium',
    supervisor: 'James Mitchell',
    tenure: '2 years 3 months',
    totalCalls: 15420,
    complianceScore: 62,
    gaps: [
      { area: 'Script Adherence', description: 'Consistently skipping mandatory fee disclosures during sales conversations', severity: 'critical', occurrences: 12 },
      { area: 'Consent Management', description: 'Not obtaining explicit consent before call recordings', severity: 'high', occurrences: 5 },
      { area: 'Documentation', description: 'Incomplete call notes and missing customer verification logs', severity: 'medium', occurrences: 8 }
    ],
    recentViolations: [
      { date: '2 hours ago', type: 'Script Violation', description: 'Skipped risk disclosure during investment product discussion', status: 'open', regulation: 'MiFID II Art. 25 - Suitability & risk disclosure' },
      { date: '1 day ago', type: 'Consent', description: 'Recording started before verbal consent obtained', status: 'investigating', regulation: 'GDPR Art. 13 - Recording disclosure & purpose notice' },
      { date: '3 days ago', type: 'Script Violation', description: 'Missing fee disclosure for premium account upgrade', status: 'resolved', regulation: 'EU Sanctions Regime - Prohibited jurisdictions' }
    ],
    recommendations: [
      'Mandatory re-training on script compliance (Priority: Immediate)',
      'Enable real-time script prompts on agent desktop',
      'Weekly 1-on-1 coaching sessions with supervisor for 4 weeks',
      'Review commission structure to reduce pressure on sales targets'
    ],
    trainingStatus: [
      { name: 'Script Compliance 2024', completed: false, dueDate: 'Overdue by 15 days' },
      { name: 'GDPR Fundamentals', completed: true },
      { name: 'Call Recording Consent', completed: false, dueDate: 'Due in 3 days' },
      { name: 'Customer Data Protection', completed: true }
    ]
  },
  'AGT-2451': {
    email: 'michael.chen@company.com',
    phone: '+852 2123 4567',
    department: 'Wealth Management',
    supervisor: 'Linda Wong',
    tenure: '1 year 8 months',
    totalCalls: 8750,
    complianceScore: 71,
    gaps: [
      { area: 'KYC Verification', description: 'Bypassing identity verification steps for returning customers', severity: 'high', occurrences: 6 },
      { area: 'Documentation', description: 'Incomplete customer risk assessment forms', severity: 'medium', occurrences: 4 }
    ],
    recentViolations: [
      { date: '5 hours ago', type: 'KYC', description: 'Customer identity not verified before high-value transaction', status: 'open', regulation: 'AML/KYC - Identity verification before account access' },
      { date: '2 days ago', type: 'KYC', description: 'Document verification skipped for VIP customer', status: 'investigating', regulation: 'AML Directive Art. 13 - Beneficial ownership identification' }
    ],
    recommendations: [
      'Refresher training on KYC protocols and regulatory requirements',
      'Implement mandatory verification checkpoint in CRM workflow',
      'Review last 30 days of customer interactions for pattern analysis'
    ],
    trainingStatus: [
      { name: 'KYC Compliance 2024', completed: false, dueDate: 'Due in 7 days' },
      { name: 'AML Awareness', completed: true },
      { name: 'Customer Due Diligence', completed: true }
    ]
  },
  'BPO-VN-089': {
    email: 'ops.techserve@vendor.com',
    phone: '+84 28 1234 5678',
    department: 'Third-Party BPO - Data Processing',
    supervisor: 'Vendor Manager: Robert Chen',
    tenure: '18 months contract',
    totalCalls: 0,
    complianceScore: 45,
    gaps: [
      { area: 'Data Access Control', description: 'Unauthorized bulk data exports outside business hours', severity: 'critical', occurrences: 2 },
      { area: 'Security Protocols', description: 'Customer data stored on unencrypted local drives', severity: 'critical', occurrences: 1 },
      { area: 'Access Logging', description: 'Incomplete audit trails for data access', severity: 'high', occurrences: 5 }
    ],
    recentViolations: [
      { date: '8 hours ago', type: 'Data Privacy', description: 'Bulk customer data export detected at 2:15 AM', status: 'open', regulation: 'GDPR Art. 5 - Data minimization & purpose limitation' },
      { date: '2 days ago', type: 'Third-Party', description: '15,000 customer records found on local storage', status: 'investigating', regulation: 'EU Outsourcing Directive - Vendor data security' }
    ],
    recommendations: [
      'IMMEDIATE: Suspend all database access pending investigation',
      'Conduct full forensic audit of vendor systems',
      'Engage legal team for contract review and potential breach',
      'Implement enhanced monitoring for all third-party data access',
      'Review and strengthen vendor onboarding security requirements'
    ],
    trainingStatus: [
      { name: 'Data Protection Agreement', completed: true },
      { name: 'Security Compliance Audit', completed: false, dueDate: 'Suspended' },
      { name: 'GDPR Vendor Requirements', completed: false, dueDate: 'Suspended' }
    ]
  },
  'AGT-2789': {
    email: 'priya.sharma@company.com',
    phone: '+91 22 1234 5678',
    department: 'Fraud Detection',
    supervisor: 'Ankit Patel',
    tenure: '3 years 1 month',
    totalCalls: 22100,
    complianceScore: 78,
    gaps: [
      { area: 'AML Escalation', description: 'Delayed escalation of flagged transactions to investigation team', severity: 'medium', occurrences: 3 },
      { area: 'Documentation', description: 'SAR reports missing key transaction details', severity: 'medium', occurrences: 2 }
    ],
    recentViolations: [
      { date: '1 day ago', type: 'AML', description: 'Flagged transaction approved without supervisor review', status: 'resolved', regulation: 'AML Directive Art. 13 - Beneficial ownership identification' }
    ],
    recommendations: [
      'Additional training on SAR documentation requirements',
      'Review escalation workflow for efficiency improvements',
      'Consider for AML specialist certification program'
    ],
    trainingStatus: [
      { name: 'AML Advanced', completed: true },
      { name: 'SAR Documentation', completed: true },
      { name: 'Fraud Pattern Recognition', completed: true }
    ]
  }
};

const channelConfig = {
  email: { label: 'Email', icon: Mail, color: '#3b82f6' },
  chat: { label: 'Chat', icon: MessageSquare, color: '#22c55e' },
  ticket: { label: 'Ticket', icon: Ticket, color: '#f97316' },
  voice: { label: 'Voice', icon: Mic, color: '#8b5cf6' },
  social: { label: 'Social', icon: Share2, color: '#ec4899' }
};

const baseWatchlistData: WatchlistAgent[] = [
  {
    id: 'AGT-1823',
    name: 'Sarah Williams',
    region: 'Europe',
    violationCount: 5,
    trend: 40,
    lastViolation: '2 hours ago',
    riskLevel: 'critical',
    categories: ['Script Violation', 'Consent'],
    regulations: ['GDPR Art. 13 - Recording disclosure', 'EU Sanctions Regime - Prohibited jurisdictions', 'MiFID II Art. 25 - Suitability & risk disclosure'],
    channel: 'voice'
  },
  {
    id: 'AGT-2451',
    name: 'Michael Chen',
    region: 'APAC',
    violationCount: 3,
    trend: 15,
    lastViolation: '5 hours ago',
    riskLevel: 'high',
    categories: ['KYC'],
    regulations: ['AML/KYC - Identity verification before account access'],
    channel: 'chat'
  },
  {
    id: 'BPO-VN-089',
    name: 'TechServe Asia (Vendor)',
    region: 'APAC',
    violationCount: 4,
    trend: 25,
    lastViolation: '8 hours ago',
    riskLevel: 'critical',
    categories: ['Data Privacy', 'Third-Party'],
    regulations: ['GDPR Art. 5 - Data minimization', 'EU Outsourcing Directive - Vendor data security'],
    channel: 'email'
  },
  {
    id: 'AGT-2789',
    name: 'Priya Sharma',
    region: 'India',
    violationCount: 2,
    trend: -10,
    lastViolation: '1 day ago',
    riskLevel: 'medium',
    categories: ['AML'],
    regulations: ['AML Directive Art. 13 - Beneficial ownership identification'],
    channel: 'ticket'
  }
];

// Map violation agent names to watchlist agent ids (for merging transcript-derived violations)
const violationAgentToWatchlistId: Record<string, string> = {
  'Sarah Johnson': 'AGT-1823',
  'Sarah Williams': 'AGT-1823',
  'Michael Chen': 'AGT-2451',
  'Emily Rodriguez': 'AGT-1823',  // Maps to same unit for display
  'David Kim': 'AGT-2789',
  'Jessica Martinez': 'AGT-2789',
};

interface AgentWatchlistProps {
  isDarkMode?: boolean;
  violations?: Violation[];  // Transcript-derived violations (from Violation Center) - merged into watchlist
}

function useViolationSummary(violations: Violation[]) {
  return useMemo(() => {
    if (violations.length === 0) return null;
    const critical = violations.filter((v) => v.severity === 'critical').length;
    const high = violations.filter((v) => v.severity === 'high').length;
    const overdue = violations.filter((v) => {
      if (v.remediation.deadline) {
        return new Date(v.remediation.deadline) < new Date() && v.remediation.status !== 'completed';
      }
      return false;
    }).length;
    const totalExpectedLoss = violations.reduce((sum, v) => sum + v.financialImpact.expectedLoss, 0);
    return { critical, high, overdue, totalExpectedLoss };
  }, [violations]);
}

export function AgentWatchlist({ isDarkMode = false, violations = [] }: AgentWatchlistProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [hoveredAgent, setHoveredAgent] = useState<string | null>(null);
  const [selectedAgent, setSelectedAgent] = useState<WatchlistAgent | null>(null);
  const [showAllAgents, setShowAllAgents] = useState(false);

  // Merge violations into watchlist: enrich with regulations from transcript-derived violations
  const watchlistData = useMemo(() => {
    if (violations.length === 0) return baseWatchlistData;
    const regulationByAgentId = new Map<string, Set<string>>();
    for (const v of violations) {
      const watchlistId = violationAgentToWatchlistId[v.agentName] ?? v.agentId;
      if (!regulationByAgentId.has(watchlistId)) regulationByAgentId.set(watchlistId, new Set());
      regulationByAgentId.get(watchlistId)!.add(v.regulation);
    }
    return baseWatchlistData.map((agent) => {
      const fromViolations = Array.from(regulationByAgentId.get(agent.id) ?? []);
      const mergedRegulations = fromViolations.length > 0 ? fromViolations : (agent.regulations ?? []);
      return { ...agent, regulations: mergedRegulations.length > 0 ? mergedRegulations : agent.regulations };
    });
  }, [violations]);

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 600);
    return () => clearTimeout(timer);
  }, []);

  const getRiskConfig = (level: WatchlistAgent['riskLevel']) => {
    switch (level) {
      case 'critical':
        return { color: '#ef4444', bg: '#ef444420', label: 'Critical Risk' };
      case 'high':
        return { color: '#f97316', bg: '#f9731620', label: 'High Risk' };
      case 'medium':
        return { color: '#eab308', bg: '#eab30820', label: 'Medium Risk' };
      default:
        return { color: '#939394', bg: '#93939420', label: 'Unknown' };
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return '#ef4444';
      case 'high': return '#f97316';
      case 'medium': return '#eab308';
      case 'low': return '#22c55e';
      default: return '#939394';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'open': return '#ef4444';
      case 'investigating': return '#f97316';
      case 'resolved': return '#22c55e';
      default: return '#939394';
    }
  };

  const handleAgentClick = (agent: WatchlistAgent) => {
    setSelectedAgent(agent);
  };

  const closeAgentDetail = () => {
    setSelectedAgent(null);
  };

  const selectedDetails = selectedAgent ? agentDetailsMap[selectedAgent.id] : null;
  const selectedRiskConfig = selectedAgent ? getRiskConfig(selectedAgent.riskLevel) : null;

  const violationSummary = useViolationSummary(violations);

  // Violations from transcript (Violation Center data) for the selected agent
  const agentViolations = useMemo(() => {
    if (!selectedAgent || violations.length === 0) return [];
    return violations.filter(
      (v) => violationAgentToWatchlistId[v.agentName] === selectedAgent.id || v.agentName === selectedAgent.name
    );
  }, [selectedAgent, violations]);

  return (
    <>
      <div
        className={`rounded-2xl overflow-hidden transition-all duration-500 flex flex-col ${
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
        <div 
          className="p-5"
          style={{ 
            background: isDarkMode 
              ? 'linear-gradient(135deg, #1a1a0a 0%, #0d0d0d 100%)'
              : 'linear-gradient(135deg, #FFFBF5 0%, #FFFFFF 100%)',
            borderBottom: `1px solid ${isDarkMode ? '#2a2a2a' : '#E5E5E5'}`
          }}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div 
                className="p-2 rounded-xl"
                style={{ 
                  background: 'linear-gradient(135deg, #f97316 0%, #ef4444 100%)',
                  boxShadow: '0 4px 12px rgba(249, 115, 22, 0.3)'
                }}
              >
                <UserX className="w-5 h-5 text-white" />
              </div>
              <div>
                <h3 
                  className="text-base font-bold"
                  style={{ color: isDarkMode ? '#FFFFFF' : '#010101' }}
                >
                  Workforce Watchlist
                </h3>
                <p className="text-xs" style={{ color: '#939394' }}>
                  {watchlistData.length} agents requiring attention
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              {violationSummary && (
                <div className="flex items-center gap-1.5">
                  <span 
                    className="px-2 py-0.5 rounded text-[10px] font-medium"
                    style={{ backgroundColor: '#ef444420', color: '#ef4444' }}
                  >
                    {violationSummary.critical} Critical
                  </span>
                  <span 
                    className="px-2 py-0.5 rounded text-[10px] font-medium"
                    style={{ backgroundColor: '#f9731620', color: '#f97316' }}
                  >
                    {violationSummary.high} High
                  </span>
                  <span 
                    className="px-2 py-0.5 rounded text-[10px] font-medium flex items-center gap-1"
                    style={{ backgroundColor: '#eab30820', color: '#eab308' }}
                  >
                    <Euro className="w-3 h-3" />
                    {(violationSummary.totalExpectedLoss / 1000000).toFixed(1)}M risk
                  </span>
                </div>
              )}
              {(!violationSummary || violationSummary.critical === 0) && (
                <div 
                  className="flex items-center gap-1.5 px-2 py-1 rounded-full text-xs font-medium"
                  style={{ backgroundColor: '#ef444420', color: '#ef4444' }}
                >
                  <AlertTriangle className="w-3 h-3" />
                  {watchlistData.filter(a => a.riskLevel === 'critical').length} Critical
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Agent List */}
        <div className="overflow-y-auto" style={{ maxHeight: showAllAgents ? '600px' : '450px' }}>
          {watchlistData.map((agent, index) => {
            const riskConfig = getRiskConfig(agent.riskLevel);
            const isHovered = hoveredAgent === agent.id;

            return (
              <div
                key={agent.id}
                className={`p-4 border-b cursor-pointer transition-all duration-300 ${
                  isVisible ? 'opacity-100' : 'opacity-0'
                }`}
                style={{ 
                  transitionDelay: `${index * 80}ms`,
                  borderColor: isDarkMode ? '#1f1f1f' : '#F0F0F0',
                  backgroundColor: isHovered 
                    ? (isDarkMode ? '#141414' : '#FAFAFA')
                    : 'transparent'
                }}
                onMouseEnter={() => setHoveredAgent(agent.id)}
                onMouseLeave={() => setHoveredAgent(null)}
                onClick={() => handleAgentClick(agent)}
              >
                <div className="flex items-start gap-3">
                  {/* Avatar with risk indicator */}
                  <div className="relative">
                    <div 
                      className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold"
                      style={{ 
                        backgroundColor: isDarkMode ? '#2a2a2a' : '#F0F0F0',
                        color: isDarkMode ? '#FFFFFF' : '#010101'
                      }}
                    >
                      {agent.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                    </div>
                    <div 
                      className="absolute -bottom-0.5 -right-0.5 w-4 h-4 rounded-full border-2 flex items-center justify-center"
                      style={{ 
                        backgroundColor: riskConfig.color,
                        borderColor: isDarkMode ? '#0d0d0d' : '#FFFFFF'
                      }}
                    >
                      <AlertTriangle className="w-2 h-2 text-white" />
                    </div>
                  </div>

                  {/* Agent Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span 
                        className="text-sm font-semibold truncate"
                        style={{ color: isDarkMode ? '#FFFFFF' : '#010101' }}
                      >
                        {agent.name}
                      </span>
                      <span 
                        className="text-[10px] px-1.5 py-0.5 rounded"
                        style={{ 
                          backgroundColor: isDarkMode ? '#2a2a2a' : '#F0F0F0',
                          color: '#939394'
                        }}
                      >
                        {agent.id}
                      </span>
                    </div>

                    <div className="flex items-center gap-2 mb-2">
                      <span 
                        className="text-[10px] font-medium px-1.5 py-0.5 rounded uppercase"
                        style={{ 
                          backgroundColor: riskConfig.bg,
                          color: riskConfig.color
                        }}
                      >
                        {riskConfig.label}
                      </span>
                      <span 
                        className="flex items-center gap-1 text-[10px]"
                        style={{ color: '#939394' }}
                      >
                        {getRegionFlag(agent.region)} {agent.region}
                      </span>
                      {(() => {
                        const channel = channelConfig[agent.channel];
                        const ChannelIcon = channel.icon;
                        return (
                          <span 
                            className="flex items-center gap-1 text-[10px] px-1.5 py-0.5 rounded"
                            style={{ 
                              backgroundColor: `${channel.color}15`,
                              color: channel.color
                            }}
                          >
                            <ChannelIcon className="w-3 h-3" />
                            {channel.label}
                          </span>
                        );
                      })()}
                    </div>

                    <div className="flex items-center gap-3">
                      <div className="flex items-center gap-1">
                        <Shield className="w-3 h-3" style={{ color: riskConfig.color }} />
                        <span 
                          className="text-xs font-bold"
                          style={{ color: riskConfig.color }}
                        >
                          {agent.violationCount}
                        </span>
                        <span className="text-[10px]" style={{ color: '#939394' }}>
                          violations
                        </span>
                      </div>
                      <div 
                        className="flex items-center gap-1 text-[10px]"
                        style={{ color: agent.trend > 0 ? '#ef4444' : '#22c55e' }}
                      >
                        {agent.trend > 0 ? (
                          <TrendingUp className="w-3 h-3" />
                        ) : (
                          <TrendingDown className="w-3 h-3" />
                        )}
                        <span>{Math.abs(agent.trend)}%</span>
                      </div>
                    </div>

                    {/* Categories & Act names (regulations) */}
                    <div className="flex flex-col gap-1.5 mt-2">
                      <div className="flex items-center gap-1.5 flex-wrap">
                        {agent.categories.slice(0, 2).map((cat, i) => (
                          <span 
                            key={i}
                            className="text-[9px] px-1.5 py-0.5 rounded"
                            style={{ 
                              backgroundColor: isDarkMode ? '#1a1a1a' : '#F5F5F5',
                              color: '#939394'
                            }}
                          >
                            {cat}
                          </span>
                        ))}
                        {agent.categories.length > 2 && (
                          <span 
                            className="text-[9px]"
                            style={{ color: '#939394' }}
                          >
                            +{agent.categories.length - 2}
                          </span>
                        )}
                      </div>
                      {agent.regulations && agent.regulations.length > 0 && (
                        <div className="flex items-center gap-1 flex-wrap">
                          {agent.regulations.slice(0, 2).map((reg, i) => (
                            <span 
                              key={i}
                              className="text-[9px] px-1.5 py-0.5 rounded border"
                              style={{ 
                                backgroundColor: '#5332FF15',
                                color: '#5332FF',
                                borderColor: '#5332FF40'
                              }}
                              title={reg}
                            >
                              {reg.length > 40 ? reg.slice(0, 37) + '…' : reg}
                            </span>
                          ))}
                          {agent.regulations.length > 2 && (
                            <span className="text-[9px]" style={{ color: '#939394' }}>
                              +{agent.regulations.length - 2} acts
                            </span>
                          )}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Action & Time */}
                  <div className="flex flex-col items-end gap-2">
                    <div 
                      className="flex items-center gap-1 text-[10px]"
                      style={{ color: '#939394' }}
                    >
                      <Clock className="w-3 h-3" />
                      <span suppressHydrationWarning>{agent.lastViolation}</span>
                    </div>
                    <div
                      className={`flex items-center gap-1 text-[10px] font-medium transition-all duration-200 ${
                        isHovered ? 'opacity-100' : 'opacity-0'
                      }`}
                      style={{ color: '#5332FF' }}
                    >
                      <span>View Details</span>
                      <ChevronRight className="w-3 h-3" />
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Footer */}
        <div 
          className="p-4 border-t"
          style={{ 
            borderColor: isDarkMode ? '#2a2a2a' : '#E5E5E5',
            backgroundColor: isDarkMode ? '#0a0a0a' : '#FAFAFA'
          }}
        >
          <button 
            className="w-full flex items-center justify-center gap-2 py-2 rounded-lg text-xs font-medium transition-colors hover:opacity-80"
            style={{ 
              backgroundColor: '#5332FF',
              color: '#FFFFFF'
            }}
            onClick={() => setShowAllAgents(!showAllAgents)}
          >
            <Users className="w-4 h-4" />
            {showAllAgents ? 'Show Less' : 'View All Agents'}
            <ChevronRight className={`w-4 h-4 transition-transform ${showAllAgents ? 'rotate-90' : ''}`} />
          </button>
        </div>
      </div>

      {/* Agent Detail Modal */}
      {selectedAgent && selectedDetails && selectedRiskConfig && (
        <>
          {/* Backdrop */}
          <div 
            className="fixed top-0 left-0 right-0 bottom-0 z-50 animate-in fade-in duration-300"
            style={{
              backgroundColor: isDarkMode ? 'rgba(0, 0, 0, 0.85)' : 'rgba(0, 0, 0, 0.7)',
              backdropFilter: 'blur(8px)',
              WebkitBackdropFilter: 'blur(8px)',
              width: '100vw',
              height: '100vh',
              position: 'fixed'
            }}
            onClick={closeAgentDetail}
          />

          {/* Modal */}
          <div 
            className="fixed z-50 rounded-2xl overflow-hidden animate-in zoom-in-95 fade-in duration-300 flex flex-col"
            style={{ 
              top: '1rem',
              left: '1rem',
              right: '1rem',
              bottom: '1rem',
              backgroundColor: isDarkMode ? '#0d0d0d' : '#FFFFFF',
              border: `1px solid ${isDarkMode ? '#2a2a2a' : '#E5E5E5'}`,
              boxShadow: `0 25px 80px -12px rgba(0, 0, 0, 0.6), 0 0 0 1px ${selectedRiskConfig.color}30`
            }}
          >
            {/* Modal Header */}
            <div 
              className="p-4 border-b flex-shrink-0"
              style={{ 
                borderColor: isDarkMode ? '#2a2a2a' : '#E5E5E5',
                background: isDarkMode 
                  ? `linear-gradient(135deg, ${selectedRiskConfig.color}10 0%, transparent 100%)`
                  : `linear-gradient(135deg, ${selectedRiskConfig.color}08 0%, transparent 100%)`
              }}
            >
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-4">
                  <div className="relative">
                    <div 
                      className="w-16 h-16 rounded-2xl flex items-center justify-center text-xl font-bold"
                      style={{ 
                        backgroundColor: isDarkMode ? '#2a2a2a' : '#F0F0F0',
                        color: isDarkMode ? '#FFFFFF' : '#010101'
                      }}
                    >
                      {selectedAgent.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                    </div>
                    <div 
                      className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full border-2 flex items-center justify-center"
                      style={{ 
                        backgroundColor: selectedRiskConfig.color,
                        borderColor: isDarkMode ? '#0d0d0d' : '#FFFFFF'
                      }}
                    >
                      <AlertTriangle className="w-3 h-3 text-white" />
                    </div>
                  </div>
                  <div>
                    <div className="flex items-center gap-3 mb-1">
                      <h2 
                        className="text-xl font-bold"
                        style={{ color: isDarkMode ? '#FFFFFF' : '#010101' }}
                      >
                        {selectedAgent.name}
                      </h2>
                      <span 
                        className="text-xs px-2 py-1 rounded-full font-medium uppercase"
                        style={{ 
                          backgroundColor: selectedRiskConfig.bg,
                          color: selectedRiskConfig.color
                        }}
                      >
                        {selectedRiskConfig.label}
                      </span>
                    </div>
                    <div className="flex items-center gap-4 text-sm" style={{ color: '#939394' }}>
                      <span>{selectedAgent.id}</span>
                      <span className="flex items-center gap-1">
                        {getRegionFlag(selectedAgent.region)} {selectedAgent.region}
                      </span>
                      <span>{selectedDetails.department}</span>
                    </div>
                  </div>
                </div>
                <button 
                  onClick={closeAgentDetail}
                  className="p-2 rounded-xl transition-all hover:scale-105"
                  style={{ 
                    backgroundColor: isDarkMode ? '#1a1a1a' : '#F5F5F5',
                    border: `1px solid ${isDarkMode ? '#2a2a2a' : '#E5E5E5'}`
                  }}
                >
                  <X className="w-5 h-5" style={{ color: '#939394' }} />
                </button>
              </div>

              {/* Quick Stats */}
              <div className="grid grid-cols-4 gap-3 mt-4">
                <div 
                  className="p-3 rounded-xl text-center"
                  style={{ backgroundColor: isDarkMode ? '#1a1a1a' : '#F5F5F5' }}
                >
                  <p className="text-2xl font-bold" style={{ color: selectedRiskConfig.color }}>
                    {selectedDetails.complianceScore}%
                  </p>
                  <p className="text-[10px] uppercase tracking-wide" style={{ color: '#939394' }}>
                    Compliance Score
                  </p>
                </div>
                <div 
                  className="p-3 rounded-xl text-center"
                  style={{ backgroundColor: isDarkMode ? '#1a1a1a' : '#F5F5F5' }}
                >
                  <p className="text-2xl font-bold" style={{ color: '#ef4444' }}>
                    {selectedAgent.violationCount}
                  </p>
                  <p className="text-[10px] uppercase tracking-wide" style={{ color: '#939394' }}>
                    Active Violations
                  </p>
                </div>
                <div 
                  className="p-3 rounded-xl text-center"
                  style={{ backgroundColor: isDarkMode ? '#1a1a1a' : '#F5F5F5' }}
                >
                  <p className="text-2xl font-bold" style={{ color: isDarkMode ? '#FFFFFF' : '#010101' }}>
                    {selectedDetails.gaps.length}
                  </p>
                  <p className="text-[10px] uppercase tracking-wide" style={{ color: '#939394' }}>
                    Compliance Gaps
                  </p>
                </div>
                <div 
                  className="p-3 rounded-xl text-center"
                  style={{ backgroundColor: isDarkMode ? '#1a1a1a' : '#F5F5F5' }}
                >
                  <p 
                    className="text-2xl font-bold flex items-center justify-center gap-1"
                    style={{ color: selectedAgent.trend > 0 ? '#ef4444' : '#22c55e' }}
                  >
                    {selectedAgent.trend > 0 ? <TrendingUp className="w-5 h-5" /> : <TrendingDown className="w-5 h-5" />}
                    {Math.abs(selectedAgent.trend)}%
                  </p>
                  <p className="text-[10px] uppercase tracking-wide" style={{ color: '#939394' }}>
                    Trend
                  </p>
                </div>
              </div>
            </div>

            {/* Modal Content */}
            <div 
              className="flex-1 overflow-y-auto p-4 min-h-0"
              style={{ 
                scrollbarWidth: 'thin',
                scrollbarColor: isDarkMode ? '#3a3a3a #1a1a1a' : '#d1d1d1 #f5f5f5'
              }}
            >
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 items-stretch content-start lg:grid-rows-[auto_auto_1fr]">
                {/* Row 1 Col 1: Compliance Gaps */}
                <div
                  className="rounded-xl p-4 min-w-0 flex flex-col lg:col-start-1 lg:row-start-1"
                  style={{
                    backgroundColor: isDarkMode ? '#1a1a1a' : '#F8F8F8',
                    border: `1px solid ${isDarkMode ? '#2a2a2a' : '#E5E5E5'}`
                  }}
                >
                  <div className="flex items-center gap-2 mb-4">
                    <Target className="w-5 h-5 flex-shrink-0" style={{ color: selectedRiskConfig.color }} />
                    <h3
                      className="text-sm font-bold uppercase tracking-wide"
                      style={{ color: isDarkMode ? '#FFFFFF' : '#010101' }}
                    >
                      Compliance Gaps
                    </h3>
                  </div>
                  <div className="space-y-3">
                    {selectedDetails.gaps.map((gap, i) => (
                      <div
                        key={i}
                        className="p-3 rounded-lg"
                        style={{
                          backgroundColor: isDarkMode ? '#0d0d0d' : '#FFFFFF',
                          border: `1px solid ${getSeverityColor(gap.severity)}30`
                        }}
                      >
                        <div className="flex items-center justify-between mb-2">
                          <span
                            className="text-sm font-semibold"
                            style={{ color: isDarkMode ? '#FFFFFF' : '#010101' }}
                          >
                            {gap.area}
                          </span>
                          <span
                            className="text-[10px] px-2 py-0.5 rounded-full uppercase font-medium"
                            style={{
                              backgroundColor: `${getSeverityColor(gap.severity)}20`,
                              color: getSeverityColor(gap.severity)
                            }}
                          >
                            {gap.severity}
                          </span>
                        </div>
                        <p
                          className="text-xs leading-relaxed mb-2"
                          style={{ color: isDarkMode ? '#D6D9D8' : '#4a4a4a' }}
                        >
                          {gap.description}
                        </p>
                        <p
                          className="text-[10px]"
                          style={{ color: getSeverityColor(gap.severity) }}
                        >
                          {gap.occurrences} occurrences recorded
                        </p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Row 2 Col 1: Recent Violations */}
                <div
                  className="rounded-xl p-4 min-w-0 flex flex-col min-h-0 lg:col-start-1 lg:row-start-2"
                  style={{
                    backgroundColor: isDarkMode ? '#1a1a1a' : '#F8F8F8',
                    border: `1px solid ${isDarkMode ? '#2a2a2a' : '#E5E5E5'}`
                  }}
                >
                  <div className="flex items-center gap-2 mb-4">
                    <AlertCircle className="w-5 h-5 flex-shrink-0" style={{ color: '#ef4444' }} />
                    <h3
                      className="text-sm font-bold uppercase tracking-wide"
                      style={{ color: isDarkMode ? '#FFFFFF' : '#010101' }}
                    >
                      Recent Violations
                    </h3>
                  </div>
                  <div
                    className="space-y-3 overflow-y-auto pr-1"
                    style={{ maxHeight: '200px', scrollbarWidth: 'thin', scrollbarColor: isDarkMode ? '#3a3a3a #1a1a1a' : '#d1d1d1 #f5f5f5' }}
                  >
                    {selectedDetails.recentViolations.map((violation, i) => (
                      <div
                        key={i}
                        className="p-3 rounded-lg flex items-start gap-3"
                        style={{
                          backgroundColor: isDarkMode ? '#0d0d0d' : '#FFFFFF',
                          border: `1px solid ${isDarkMode ? '#2a2a2a' : '#E5E5E5'}`
                        }}
                      >
                        <div
                          className="w-2 h-2 rounded-full mt-1.5 flex-shrink-0 self-start"
                          style={{ backgroundColor: getStatusColor(violation.status) }}
                        />
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between gap-2 mb-1">
                            <span
                              className="text-xs font-semibold truncate"
                              style={{ color: isDarkMode ? '#FFFFFF' : '#010101' }}
                            >
                              {violation.type}
                            </span>
                            <span className="text-[10px] flex-shrink-0" style={{ color: '#939394' }}>
                              {violation.date}
                            </span>
                          </div>
                          {violation.regulation && (
                            <div
                              className="text-[10px] mb-1.5 px-2 py-1 rounded block w-full break-words"
                              style={{
                                backgroundColor: '#5332FF15',
                                color: '#5332FF',
                                border: '1px solid #5332FF40'
                              }}
                            >
                              <span className="font-medium">Act:</span> {violation.regulation}
                            </div>
                          )}
                          <p
                            className="text-xs leading-relaxed break-words"
                            style={{ color: isDarkMode ? '#D6D9D8' : '#4a4a4a' }}
                          >
                            {violation.description}
                          </p>
                          <span
                            className="inline-block mt-2 text-[10px] px-2 py-0.5 rounded-full capitalize"
                            style={{
                              backgroundColor: `${getStatusColor(violation.status)}20`,
                              color: getStatusColor(violation.status)
                            }}
                          >
                            {violation.status}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Row 3 Col 1: Training Status */}
                <div
                  className="rounded-xl p-4 min-w-0 flex flex-col min-h-0 lg:col-start-1 lg:row-start-3"
                  style={{
                    backgroundColor: isDarkMode ? '#1a1a1a' : '#F8F8F8',
                    border: `1px solid ${isDarkMode ? '#2a2a2a' : '#E5E5E5'}`
                  }}
                >
                  <div className="flex items-center gap-2 mb-4">
                    <BarChart3 className="w-5 h-5 flex-shrink-0" style={{ color: '#22c55e' }} />
                    <h3
                      className="text-sm font-bold uppercase tracking-wide"
                      style={{ color: isDarkMode ? '#FFFFFF' : '#010101' }}
                    >
                      Training Status
                    </h3>
                  </div>
                  <div className="space-y-2">
                    {selectedDetails.trainingStatus.map((training, i) => (
                      <div
                        key={i}
                        className="flex items-center justify-between p-3 rounded-lg"
                        style={{
                          backgroundColor: isDarkMode ? '#0d0d0d' : '#FFFFFF',
                          border: `1px solid ${isDarkMode ? '#2a2a2a' : '#E5E5E5'}`
                        }}
                      >
                        <div className="flex items-center gap-2 min-w-0">
                          {training.completed ? (
                            <CheckCircle2 className="w-4 h-4 flex-shrink-0" style={{ color: '#22c55e' }} />
                          ) : (
                            <XCircle className="w-4 h-4 flex-shrink-0" style={{ color: '#ef4444' }} />
                          )}
                          <span
                            className="text-sm truncate"
                            style={{ color: isDarkMode ? '#FFFFFF' : '#010101' }}
                          >
                            {training.name}
                          </span>
                        </div>
                        {training.dueDate && (
                          <span
                            className="text-[10px] flex-shrink-0"
                            style={{ color: training.dueDate.includes('Overdue') ? '#ef4444' : '#939394' }}
                          >
                            {training.dueDate}
                          </span>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Row 1 Col 2: Transcript-Detected Violations */}
                <div
                  className="rounded-xl p-4 min-w-0 flex flex-col min-h-0 lg:col-start-2 lg:row-start-1"
                  style={{
                    backgroundColor: isDarkMode ? '#1a1a1a' : '#F8F8F8',
                    border: `1px solid ${isDarkMode ? '#2a2a2a' : '#E5E5E5'}`
                  }}
                >
                  <div className="flex items-center gap-2 mb-4 flex-wrap">
                    <AlertTriangle className="w-5 h-5 flex-shrink-0" style={{ color: '#ef4444' }} />
                    <h3
                      className="text-sm font-bold uppercase tracking-wide"
                      style={{ color: isDarkMode ? '#FFFFFF' : '#010101' }}
                    >
                      Transcript-Detected Violations
                    </h3>
                    {agentViolations.length > 0 && (
                      <span
                        className="text-[10px] px-2 py-0.5 rounded-full flex-shrink-0"
                        style={{ backgroundColor: '#ef444420', color: '#ef4444' }}
                      >
                        {agentViolations.length} active
                      </span>
                    )}
                  </div>
                  <div className="space-y-3 flex-1 min-h-0 overflow-y-auto">
                    {agentViolations.length > 0 ? agentViolations.slice(0, 5).map((v) => (
                        <div
                          key={v.violationId}
                          className="p-3 rounded-lg"
                          style={{
                            backgroundColor: isDarkMode ? '#0d0d0d' : '#FFFFFF',
                            border: `1px solid ${getSeverityColor(v.severity)}40`
                          }}
                        >
                          <div
                            className="text-[10px] mb-2 px-2 py-1 rounded block w-full break-words"
                            style={{ backgroundColor: '#5332FF15', color: '#5332FF', border: '1px solid #5332FF40' }}
                          >
                            {v.regulation}
                          </div>
                          <div className="flex items-center gap-2 mb-2 flex-wrap">
                            <span
                              className="text-[10px] px-2 py-0.5 rounded-full uppercase"
                              style={{ backgroundColor: `${getSeverityColor(v.severity)}20`, color: getSeverityColor(v.severity) }}
                            >
                              {v.severity}
                            </span>
                            <span className="text-[10px] flex items-center gap-1" style={{ color: '#22c55e' }}>
                              <Euro className="w-3 h-3" />
                              {(v.financialImpact.expectedLoss / 1000).toFixed(0)} expected loss
                            </span>
                          </div>
                          <p className="text-xs leading-relaxed mb-2" style={{ color: isDarkMode ? '#D6D9D8' : '#4a4a4a' }}>
                            {v.severityReason}
                          </p>
                          {v.evidence.transcriptExcerpt && (
                            <p className="text-[10px] italic" style={{ color: '#939394' }}>
                              &quot;{v.evidence.transcriptExcerpt.length > 120
                                ? v.evidence.transcriptExcerpt.slice(0, 120) + '...'
                                : v.evidence.transcriptExcerpt}&quot;
                            </p>
                          )}
                        </div>
                      )) : (
                        <div
                          className="py-8 text-center text-sm"
                          style={{ color: isDarkMode ? '#939394' : '#6b7280' }}
                        >
                          No transcript violations detected for this agent
                        </div>
                      )}
                  </div>
                </div>

                {/* Row 2 Col 2: Recommendations */}
                <div
                  className="rounded-xl p-4 min-w-0 flex flex-col min-h-0 lg:col-start-2 lg:row-start-2"
                  style={{
                    backgroundColor: isDarkMode ? '#1a1a1a' : '#F8F8F8',
                    border: `1px solid ${isDarkMode ? '#2a2a2a' : '#E5E5E5'}`
                  }}
                >
                  <div className="flex items-center gap-2 mb-4">
                    <ArrowRight className="w-5 h-5 flex-shrink-0" style={{ color: '#5332FF' }} />
                    <h3
                      className="text-sm font-bold uppercase tracking-wide"
                      style={{ color: isDarkMode ? '#FFFFFF' : '#010101' }}
                    >
                      Recommended Actions
                    </h3>
                  </div>
                  <ul className="space-y-2">
                    {selectedDetails.recommendations.map((rec, i) => (
                      <li
                        key={i}
                        className="flex items-start gap-3 text-sm p-3 rounded-lg"
                        style={{
                          backgroundColor: isDarkMode ? '#0d0d0d' : '#FFFFFF',
                          color: isDarkMode ? '#D6D9D8' : '#4a4a4a'
                        }}
                      >
                        <span
                          className="w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 text-[10px] font-bold mt-0.5"
                          style={{
                            backgroundColor: '#5332FF20',
                            color: '#5332FF'
                          }}
                        >
                          {i + 1}
                        </span>
                        <span className="flex-1 min-w-0 break-words pt-px">{rec}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Row 3 Col 2: Agent Information */}
                <div
                  className="rounded-xl p-4 min-w-0 flex flex-col min-h-0 lg:col-start-2 lg:row-start-3"
                  style={{
                    backgroundColor: isDarkMode ? '#1a1a1a' : '#F8F8F8',
                    border: `1px solid ${isDarkMode ? '#2a2a2a' : '#E5E5E5'}`
                  }}
                >
                  <div className="flex items-center gap-2 mb-4">
                    <FileText className="w-5 h-5 flex-shrink-0" style={{ color: '#939394' }} />
                    <h3
                      className="text-sm font-bold uppercase tracking-wide"
                      style={{ color: isDarkMode ? '#FFFFFF' : '#010101' }}
                    >
                      Agent Information
                    </h3>
                  </div>
                  <div className="space-y-3">
                    <div className="flex items-center gap-3 min-w-0">
                      <Mail className="w-4 h-4 flex-shrink-0" style={{ color: '#939394' }} />
                      <span className="text-sm break-words flex-1 min-w-0" style={{ color: isDarkMode ? '#D6D9D8' : '#4a4a4a' }}>
                        {selectedDetails.email}
                      </span>
                    </div>
                    <div className="flex items-center gap-3 min-w-0">
                      <Phone className="w-4 h-4 flex-shrink-0" style={{ color: '#939394' }} />
                      <span className="text-sm break-words flex-1 min-w-0" style={{ color: isDarkMode ? '#D6D9D8' : '#4a4a4a' }}>
                        {selectedDetails.phone}
                      </span>
                    </div>
                    <div className="flex items-center gap-3 min-w-0">
                      <Building className="w-4 h-4 flex-shrink-0" style={{ color: '#939394' }} />
                      <span className="text-sm break-words flex-1 min-w-0" style={{ color: isDarkMode ? '#D6D9D8' : '#4a4a4a' }}>
                        {selectedDetails.department}
                      </span>
                    </div>
                    <div className="flex items-center gap-3 min-w-0">
                      <Users className="w-4 h-4 flex-shrink-0" style={{ color: '#939394' }} />
                      <span className="text-sm break-words flex-1 min-w-0" style={{ color: isDarkMode ? '#D6D9D8' : '#4a4a4a' }}>
                        Supervisor: {selectedDetails.supervisor}
                      </span>
                    </div>
                    <div className="flex items-center gap-3 min-w-0">
                      <Calendar className="w-4 h-4 flex-shrink-0" style={{ color: '#939394' }} />
                      <span className="text-sm break-words flex-1 min-w-0" style={{ color: isDarkMode ? '#D6D9D8' : '#4a4a4a' }}>
                        Tenure: {selectedDetails.tenure}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div 
              className="px-4 py-3 border-t flex items-center justify-between flex-shrink-0 gap-4"
              style={{ 
                borderColor: isDarkMode ? '#2a2a2a' : '#E5E5E5',
                backgroundColor: isDarkMode ? '#0a0a0a' : '#FAFAFA'
              }}
            >
              <button 
                className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium"
                style={{ 
                  backgroundColor: '#ef444420',
                  color: '#ef4444'
                }}
              >
                <AlertTriangle className="w-4 h-4" />
                Escalate to HR
              </button>
              <div className="flex items-center gap-3">
                <button 
                  className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium"
                  style={{ 
                    backgroundColor: isDarkMode ? '#1a1a1a' : '#FFFFFF',
                    color: isDarkMode ? '#FFFFFF' : '#010101',
                    border: `1px solid ${isDarkMode ? '#2a2a2a' : '#E5E5E5'}`
                  }}
                >
                  <Eye className="w-4 h-4" />
                  View Full History
                </button>
                <button 
                  className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium"
                  style={{ 
                    backgroundColor: '#5332FF',
                    color: '#FFFFFF'
                  }}
                >
                  <CheckCircle2 className="w-4 h-4" />
                  Schedule Coaching
                </button>
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
}
