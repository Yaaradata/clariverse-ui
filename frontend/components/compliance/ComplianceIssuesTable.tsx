'use client';

import { useState, useEffect, Fragment } from 'react';
import { 
  AlertCircle, User, Clock, RefreshCw, ChevronRight, Filter,
  FileText, Target, ArrowRight, Users, Calendar, Shield, 
  MessageSquare, CheckCircle2, XCircle
} from 'lucide-react';
import { ComplianceIssue, getSeverityColor, getRegionFlag } from '@/lib/compliance/complianceData';

// Extended issue details
interface IssueDetails {
  rootCause: string;
  investigation: string;
  affectedCustomers: number;
  potentialFine: string;
  recommendedActions: string[];
  previousOccurrences: number;
  assignedTo: string;
  escalationLevel: string;
  notes: string;
}

const issueDetailsMap: Record<string, IssueDetails> = {
  'CI-001': {
    rootCause: 'Agent failed to verify customer identity using two-factor authentication before processing account changes.',
    investigation: 'Call recording reviewed. Agent skipped identity verification step during high-volume period.',
    affectedCustomers: 1,
    potentialFine: '$5,000 - $15,000',
    recommendedActions: [
      'Mandatory re-training on KYC protocols for agent',
      'Enable mandatory ID verification checkpoint in CRM',
      'Review last 50 calls from agent for pattern analysis'
    ],
    previousOccurrences: 0,
    assignedTo: 'Maria Santos - Compliance Team',
    escalationLevel: 'Level 2 - Supervisor Review',
    notes: 'Customer account secured. No unauthorized transactions detected.'
  },
  'CI-002': {
    rootCause: 'Transaction monitoring system flagged unusual pattern - multiple high-value transfers to new beneficiaries within 24 hours.',
    investigation: 'Agent processed transactions without escalating to AML team as per protocol.',
    affectedCustomers: 3,
    potentialFine: '$50,000 - $200,000',
    recommendedActions: [
      'Immediately escalate to AML Investigation Unit',
      'Freeze related accounts pending review',
      'File SAR (Suspicious Activity Report) within 24 hours',
      'Review agent training completion status'
    ],
    previousOccurrences: 1,
    assignedTo: 'AML Investigation Unit',
    escalationLevel: 'Level 4 - Regulatory',
    notes: 'High priority - potential money laundering indicators detected.'
  },
  'CI-003': {
    rootCause: 'Third-party vendor accessed customer PII database and exported records to unauthorized external storage.',
    investigation: 'Security logs show bulk data export at 2:15 AM local time. Vendor claims it was for "backup purposes".',
    affectedCustomers: 2500,
    potentialFine: '$500,000 - $2,000,000',
    recommendedActions: [
      'Immediately suspend vendor database access',
      'Conduct forensic audit of all exported data',
      'Notify Data Protection Officer for GDPR assessment',
      'Prepare breach notification if required',
      'Review and update vendor access policies'
    ],
    previousOccurrences: 0,
    assignedTo: 'CISO Office + Legal Team',
    escalationLevel: 'Level 5 - Executive',
    notes: 'Critical data breach potential. Legal team engaged. Vendor contract under review.'
  },
  'CI-004': {
    rootCause: 'Agent processed transactions flagged by AML system without proper documentation and supervisor approval.',
    investigation: 'System shows 3 flagged transactions approved by agent without escalation in past 48 hours.',
    affectedCustomers: 3,
    potentialFine: '$25,000 - $100,000',
    recommendedActions: [
      'Review all agent approvals from past 30 days',
      'Implement dual-approval for flagged transactions',
      'Schedule refresher training on AML protocols'
    ],
    previousOccurrences: 2,
    assignedTo: 'Rajesh Kumar - AML Supervisor',
    escalationLevel: 'Level 3 - Management',
    notes: 'Repeat offense - agent previously coached on same issue. Consider formal warning.'
  },
  'CI-005': {
    rootCause: 'Call recording started before agent obtained verbal consent from customer, violating GDPR Article 6.',
    investigation: 'IVR system auto-started recording. Agent failed to pause and obtain explicit consent.',
    affectedCustomers: 1,
    potentialFine: '$10,000 - $50,000',
    recommendedActions: [
      'Update IVR flow to require explicit consent acknowledgment',
      'Delete non-compliant recording',
      'Document incident in compliance register'
    ],
    previousOccurrences: 0,
    assignedTo: 'Emma Johnson - EU Compliance',
    escalationLevel: 'Level 2 - Supervisor Review',
    notes: 'Recording deleted. Customer notified and satisfied with resolution.'
  },
  'CI-006': {
    rootCause: 'Agent consistently skipping mandatory disclosure statements during sales calls, particularly fee disclosures.',
    investigation: 'Quality assurance review of 20 calls showed disclosure missing in 85% of cases.',
    affectedCustomers: 17,
    potentialFine: '$15,000 - $75,000',
    recommendedActions: [
      'Immediate 1-on-1 coaching session',
      'Enable real-time script compliance prompts',
      'Review compensation structure for potential pressure',
      'Consider formal performance improvement plan'
    ],
    previousOccurrences: 3,
    assignedTo: 'Team Lead - Europe Region',
    escalationLevel: 'Level 3 - Management',
    notes: 'Third occurrence. HR notified for formal documentation.'
  },
  'CI-007': {
    rootCause: 'BPO vendor downloaded customer financial data without authorization and stored on unsecured local drive.',
    investigation: 'Vendor workstation audit revealed 15,000+ customer records stored locally without encryption.',
    affectedCustomers: 15000,
    potentialFine: '$1,000,000 - $5,000,000',
    recommendedActions: [
      'Terminate vendor access immediately',
      'Secure and wipe vendor workstations',
      'Engage external forensic team',
      'Prepare regulatory breach notification',
      'Review all third-party vendor agreements'
    ],
    previousOccurrences: 0,
    assignedTo: 'CISO + DPO + Legal',
    escalationLevel: 'Level 5 - Executive',
    notes: 'Board notification required. Crisis management team activated.'
  },
  'CI-008': {
    rootCause: 'Agent bypassed standard KYC document verification for VIP customer citing "relationship history".',
    investigation: 'No enhanced due diligence performed despite high-risk jurisdiction and transaction amount.',
    affectedCustomers: 1,
    potentialFine: '$20,000 - $80,000',
    recommendedActions: [
      'Complete retroactive KYC verification',
      'Review VIP exception process',
      'Update policy to remove relationship-based bypasses',
      'Coach agent on regulatory requirements'
    ],
    previousOccurrences: 0,
    assignedTo: 'Senior Compliance Officer - APAC',
    escalationLevel: 'Level 3 - Management',
    notes: 'VIP customer cooperative. Document verification in progress.'
  }
};

interface ComplianceIssuesTableProps {
  data: ComplianceIssue[];
  isDarkMode?: boolean;
}

export function ComplianceIssuesTable({ data, isDarkMode = false }: ComplianceIssuesTableProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [selectedSeverity, setSelectedSeverity] = useState<string>('all');
  const [selectedRegion, setSelectedRegion] = useState<string>('all');
  const [expandedRow, setExpandedRow] = useState<string | null>(null);

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 300);
    return () => clearTimeout(timer);
  }, []);

  const filteredData = data.filter(issue => {
    if (selectedSeverity !== 'all' && issue.severity !== selectedSeverity) return false;
    if (selectedRegion !== 'all' && issue.region !== selectedRegion) return false;
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
      case 'open': return '#ef4444';
      case 'investigating': return '#f97316';
      case 'resolved': return '#22c55e';
      default: return '#939394';
    }
  };

  const severityOptions = ['all', 'critical', 'high', 'medium', 'low'];
  const regionOptions = ['all', 'APAC', 'India', 'Europe', 'Americas', 'MEA'];

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
              Active Compliance Issues
            </h3>
            <p className="text-xs" style={{ color: '#939394' }}>
              {filteredData.length} issues requiring attention • Click to expand details
            </p>
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

          {/* Region Filter */}
          <select
            value={selectedRegion}
            onChange={(e) => setSelectedRegion(e.target.value)}
            className="text-xs px-3 py-1.5 rounded-lg border-none outline-none cursor-pointer"
            style={{ 
              backgroundColor: isDarkMode ? '#1a1a1a' : '#F5F5F5',
              color: isDarkMode ? '#FFFFFF' : '#010101'
            }}
          >
            {regionOptions.map(opt => (
              <option key={opt} value={opt}>
                {opt === 'all' ? 'All Regions' : opt}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr style={{ backgroundColor: isDarkMode ? '#141414' : '#FAFAFA' }}>
              <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider" style={{ color: '#939394' }}>
                Issue
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider" style={{ color: '#939394' }}>
                Agent
              </th>
              <th className="px-4 py-3 text-center text-xs font-semibold uppercase tracking-wider" style={{ color: '#939394' }}>
                Severity
              </th>
              <th className="px-4 py-3 text-center text-xs font-semibold uppercase tracking-wider" style={{ color: '#939394' }}>
                Region
              </th>
              <th className="px-4 py-3 text-center text-xs font-semibold uppercase tracking-wider" style={{ color: '#939394' }}>
                Status
              </th>
              <th className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wider" style={{ color: '#939394' }}>
                Time
              </th>
            </tr>
          </thead>
          <tbody>
            {filteredData.map((issue, index) => {
              const severityColor = getSeverityColor(issue.severity);
              const statusColor = getStatusColor(issue.status);
              const isExpanded = expandedRow === issue.id;
              const issueDetails = issueDetailsMap[issue.id];

              return (
                <Fragment key={issue.id}>
                  <tr
                    className={`cursor-pointer transition-all duration-300 hover:bg-opacity-50 ${
                      isVisible ? 'opacity-100' : 'opacity-0'
                    }`}
                    style={{ 
                      transitionDelay: `${index * 50}ms`,
                      backgroundColor: isExpanded 
                        ? (isDarkMode ? '#1a1a1a' : '#F9F9F9') 
                        : 'transparent',
                      borderBottom: isExpanded ? 'none' : `1px solid ${isDarkMode ? '#1f1f1f' : '#F0F0F0'}`
                    }}
                    onClick={() => setExpandedRow(isExpanded ? null : issue.id)}
                  >
                    {/* Issue */}
                    <td className="px-4 py-4">
                      <div className="flex items-start gap-3">
                        <div 
                          className="mt-0.5 p-1.5 rounded-lg"
                          style={{ backgroundColor: `${severityColor}15` }}
                        >
                          <AlertCircle className="w-4 h-4" style={{ color: severityColor }} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <span 
                              className="text-xs font-mono px-1.5 py-0.5 rounded"
                              style={{ 
                                backgroundColor: isDarkMode ? '#2a2a2a' : '#F0F0F0',
                                color: '#939394'
                              }}
                            >
                              {issue.id}
                            </span>
                            <span 
                              className="px-2 py-0.5 rounded text-xs font-medium"
                              style={{ 
                                backgroundColor: isDarkMode ? '#5332FF20' : '#5332FF10',
                                color: '#5332FF'
                              }}
                            >
                              {issue.category}
                            </span>
                            {issue.repeatOffense && (
                              <span 
                                className="px-2 py-0.5 rounded text-xs font-medium"
                                style={{ 
                                  backgroundColor: '#ef444420',
                                  color: '#ef4444'
                                }}
                              >
                                ⚠️ Repeat
                              </span>
                            )}
                          </div>
                          <p 
                            className={`text-sm mt-1 ${isExpanded ? '' : 'line-clamp-2'}`}
                            style={{ color: isDarkMode ? '#E0E0E0' : '#333333' }}
                          >
                            {issue.issue}
                          </p>
                        </div>
                        <ChevronRight 
                          className={`w-4 h-4 transition-transform duration-300 ${isExpanded ? 'rotate-90' : ''}`}
                          style={{ color: '#939394' }}
                        />
                      </div>
                    </td>

                    {/* Agent */}
                    <td className="px-4 py-4">
                      <div className="flex items-center gap-2">
                        <div 
                          className="w-8 h-8 rounded-full flex items-center justify-center"
                          style={{ backgroundColor: isDarkMode ? '#2a2a2a' : '#F0F0F0' }}
                        >
                          <User className="w-4 h-4" style={{ color: '#939394' }} />
                        </div>
                        <div>
                          <p 
                            className="text-sm font-medium"
                            style={{ color: isDarkMode ? '#FFFFFF' : '#010101' }}
                          >
                            {issue.agentName}
                          </p>
                          <p className="text-xs" style={{ color: '#939394' }}>
                            {issue.agentId}
                          </p>
                        </div>
                      </div>
                    </td>

                    {/* Severity */}
                    <td className="px-4 py-4 text-center">
                      <span 
                        className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold uppercase"
                        style={{ 
                          backgroundColor: `${severityColor}20`,
                          color: severityColor
                        }}
                      >
                        <span 
                          className="w-2 h-2 rounded-full"
                          style={{ backgroundColor: severityColor }}
                        />
                        {issue.severity}
                      </span>
                    </td>

                    {/* Region */}
                    <td className="px-4 py-4 text-center">
                      <span 
                        className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium"
                        style={{ 
                          backgroundColor: isDarkMode ? '#2a2a2a' : '#F0F0F0',
                          color: isDarkMode ? '#FFFFFF' : '#010101'
                        }}
                      >
                        <span>{getRegionFlag(issue.region)}</span>
                        {issue.region}
                      </span>
                    </td>

                    {/* Status */}
                    <td className="px-4 py-4 text-center">
                      <span 
                        className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium capitalize"
                        style={{ 
                          backgroundColor: `${statusColor}15`,
                          color: statusColor
                        }}
                      >
                        <span 
                          className="w-1.5 h-1.5 rounded-full animate-pulse"
                          style={{ backgroundColor: statusColor }}
                        />
                        {issue.status}
                      </span>
                    </td>

                    {/* Time */}
                    <td className="px-4 py-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <Clock className="w-3.5 h-3.5" style={{ color: '#939394' }} />
                        <span className="text-xs" style={{ color: '#939394' }} suppressHydrationWarning>
                          {formatTimestamp(issue.timestamp)}
                        </span>
                      </div>
                    </td>
                  </tr>

                  {/* Expanded Details Row */}
                  {isExpanded && issueDetails && (
                    <tr>
                      <td 
                        colSpan={6} 
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
                            {/* Left Column - Root Cause & Investigation */}
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
                                  {issueDetails.rootCause}
                                </p>
                              </div>

                              {/* Investigation */}
                              <div>
                                <div className="flex items-center gap-2 mb-2">
                                  <Target className="w-4 h-4" style={{ color: severityColor }} />
                                  <span 
                                    className="text-xs font-semibold uppercase tracking-wide"
                                    style={{ color: isDarkMode ? '#FFFFFF' : '#010101' }}
                                  >
                                    Investigation
                                  </span>
                                </div>
                                <p 
                                  className="text-sm leading-relaxed"
                                  style={{ color: isDarkMode ? '#D6D9D8' : '#4a4a4a' }}
                                >
                                  {issueDetails.investigation}
                                </p>
                              </div>
                            </div>

                            {/* Middle Column - Recommended Actions */}
                            <div>
                              <div className="flex items-center gap-2 mb-3">
                                <ArrowRight className="w-4 h-4" style={{ color: severityColor }} />
                                <span 
                                  className="text-xs font-semibold uppercase tracking-wide"
                                  style={{ color: isDarkMode ? '#FFFFFF' : '#010101' }}
                                >
                                  Recommended Actions
                                </span>
                              </div>
                              <ul className="space-y-2">
                                {issueDetails.recommendedActions.map((action, i) => (
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
                            </div>

                            {/* Right Column - Meta Info */}
                            <div className="space-y-3">
                              {/* Impact Stats */}
                              <div 
                                className="grid grid-cols-2 gap-3 p-3 rounded-lg"
                                style={{ backgroundColor: isDarkMode ? '#1a1a1a' : '#F5F5F5' }}
                              >
                                <div>
                                  <p className="text-[10px] uppercase tracking-wide mb-1" style={{ color: '#939394' }}>
                                    Affected Customers
                                  </p>
                                  <p 
                                    className="text-lg font-bold"
                                    style={{ color: severityColor }}
                                  >
                                    {issueDetails.affectedCustomers.toLocaleString()}
                                  </p>
                                </div>
                                <div>
                                  <p className="text-[10px] uppercase tracking-wide mb-1" style={{ color: '#939394' }}>
                                    Previous Occurrences
                                  </p>
                                  <p 
                                    className="text-lg font-bold"
                                    style={{ color: issueDetails.previousOccurrences > 0 ? '#ef4444' : '#22c55e' }}
                                  >
                                    {issueDetails.previousOccurrences}
                                  </p>
                                </div>
                              </div>

                              {/* Potential Fine */}
                              <div 
                                className="p-3 rounded-lg"
                                style={{ 
                                  backgroundColor: `${severityColor}10`,
                                  border: `1px solid ${severityColor}30`
                                }}
                              >
                                <p className="text-[10px] uppercase tracking-wide mb-1" style={{ color: '#939394' }}>
                                  Potential Fine
                                </p>
                                <p 
                                  className="text-sm font-bold"
                                  style={{ color: severityColor }}
                                >
                                  {issueDetails.potentialFine}
                                </p>
                              </div>

                              {/* Assignment Info */}
                              <div className="space-y-2">
                                <div className="flex items-center gap-2">
                                  <Users className="w-3.5 h-3.5" style={{ color: '#939394' }} />
                                  <span className="text-xs" style={{ color: '#939394' }}>
                                    {issueDetails.assignedTo}
                                  </span>
                                </div>
                                <div className="flex items-center gap-2">
                                  <Shield className="w-3.5 h-3.5" style={{ color: '#939394' }} />
                                  <span className="text-xs" style={{ color: '#939394' }}>
                                    {issueDetails.escalationLevel}
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
                                  {issueDetails.notes}
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
                                  Resolve
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
                      </td>
                    </tr>
                  )}
                </Fragment>
              );
            })}
          </tbody>
        </table>
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
          Showing {filteredData.length} of {data.length} issues
        </span>
        <button 
          className="text-xs font-medium px-4 py-2 rounded-lg transition-colors"
          style={{ 
            backgroundColor: '#5332FF',
            color: '#FFFFFF'
          }}
        >
          View All Issues →
        </button>
      </div>
    </div>
  );
}
