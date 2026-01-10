'use client';

import { useState, useEffect } from 'react';
import { 
  TrendingUp, 
  TrendingDown, 
  UserCheck,
  ShieldCheck,
  Banknote,
  Globe,
  Building2,
  AlertCircle,
  Search,
  FileBarChart,
  Mail,
  MessageSquare,
  Ticket,
  Mic,
  Share2,
  X,
  CheckCircle2,
  XCircle,
  Brain,
  FileText,
  Clock,
  User,
  DollarSign,
  AlertTriangle,
  CheckCheck
} from 'lucide-react';
import { ViolationData as StandardViolationData, getSeverityColor } from '@/lib/compliance/complianceData';

// Flexible interface that accepts data from either standard or client-specific sources
interface ViolationData {
  category: string;
  count: number;
  trend: number;
  severity: 'critical' | 'high' | 'medium' | 'low';
  percentage: number;
}

interface ChannelBreakdown {
  email: number;
  chat: number;
  ticket: number;
  voice: number;
  social: number;
}

interface SARReport {
  id: string;
  caseNumber: string;
  channel: 'email' | 'chat' | 'ticket' | 'voice' | 'social';
  suspiciousActivity: string;
  category: string;
  customerName: string;
  customerId: string;
  amount: string;
  detectedAt: string;
  confidenceScore: number;
  riskLevel: 'critical' | 'high' | 'medium';
  aiSummary: string;
  status: 'pending' | 'approved' | 'rejected';
  agentName: string;
  location: string;
}

const sarReportsData: SARReport[] = [
  {
    id: 'SAR-001',
    caseNumber: 'SAR-2024-11-001',
    channel: 'voice',
    suspiciousActivity: 'Structuring - Multiple cash deposits below reporting threshold',
    category: 'AML Compliance',
    customerName: 'Robert M. ****7823',
    customerId: 'CUST-892341',
    amount: '$9,500 x 4 deposits',
    detectedAt: '15 min ago',
    confidenceScore: 96.8,
    riskLevel: 'critical',
    aiSummary: 'Customer made 4 separate cash deposits of $9,500 each within 48 hours across different branches. Pattern indicates potential structuring to avoid CTR filing. Agent conversation revealed customer became evasive when asked about source of funds.',
    status: 'pending',
    agentName: 'Sarah Williams',
    location: 'Charlotte HQ'
  },
  {
    id: 'SAR-002',
    caseNumber: 'SAR-2024-11-002',
    channel: 'chat',
    suspiciousActivity: 'Unusual wire transfer to high-risk jurisdiction',
    category: 'Cross-Border Compliance',
    customerName: 'Elena K. ****4521',
    customerId: 'CUST-445678',
    amount: '$75,000',
    detectedAt: '32 min ago',
    confidenceScore: 94.2,
    riskLevel: 'critical',
    aiSummary: 'First-time wire transfer to Cyprus from account with no prior international activity. Customer requested urgent processing and declined to provide business purpose documentation. Chat history shows inconsistent explanations for transfer reason.',
    status: 'pending',
    agentName: 'Michael Chen',
    location: 'Singapore Hub'
  },
  {
    id: 'SAR-003',
    caseNumber: 'SAR-2024-11-003',
    channel: 'email',
    suspiciousActivity: 'Identity verification inconsistency',
    category: 'Customer Identification Program',
    customerName: 'James T. ****9012',
    customerId: 'CUST-334521',
    amount: 'N/A',
    detectedAt: '1 hour ago',
    confidenceScore: 89.5,
    riskLevel: 'high',
    aiSummary: 'Customer email requests account access recovery but provided SSN and DOB combination that does not match records. IP address traced to different country than registered address. Multiple failed authentication attempts from various locations.',
    status: 'pending',
    agentName: 'Emily Rodriguez',
    location: 'Dublin EU HQ'
  },
  {
    id: 'SAR-004',
    caseNumber: 'SAR-2024-11-004',
    channel: 'ticket',
    suspiciousActivity: 'Rapid account-to-account transfers',
    category: 'AML Compliance',
    customerName: 'David W. ****3456',
    customerId: 'CUST-778923',
    amount: '$125,000 total',
    detectedAt: '2 hours ago',
    confidenceScore: 92.1,
    riskLevel: 'high',
    aiSummary: 'Series of rapid transfers between 5 linked accounts in a circular pattern. Funds ultimately moved to an external account in Cayman Islands. Pattern suggests layering activity. Customer ticket requested increase in daily transfer limits.',
    status: 'pending',
    agentName: 'Priya Sharma',
    location: 'Mumbai GBS'
  },
  {
    id: 'SAR-005',
    caseNumber: 'SAR-2024-11-005',
    channel: 'social',
    suspiciousActivity: 'Phishing attempt via social media impersonation',
    category: 'Fraud Detection',
    customerName: 'Maria L. ****7890',
    customerId: 'CUST-556734',
    amount: '$12,500',
    detectedAt: '3 hours ago',
    confidenceScore: 97.3,
    riskLevel: 'critical',
    aiSummary: 'Customer reported being contacted via fake bank social media account requesting account verification. Provided credentials before realizing fraud. Unauthorized transfer initiated. Social media team detected and blocked transfer.',
    status: 'pending',
    agentName: 'James Thompson',
    location: 'Phoenix Regional'
  },
  {
    id: 'SAR-006',
    caseNumber: 'SAR-2024-11-006',
    channel: 'voice',
    suspiciousActivity: 'PEP transaction monitoring alert',
    category: 'Sanctions / PEP Screening',
    customerName: 'Alexander P. ****2345',
    customerId: 'CUST-889012',
    amount: '$250,000',
    detectedAt: '4 hours ago',
    confidenceScore: 91.8,
    riskLevel: 'high',
    aiSummary: 'Large incoming wire from entity linked to known Politically Exposed Person. Customer is business associate of foreign government official. Enhanced due diligence required. Voice call revealed customer was unaware of PEP connection.',
    status: 'pending',
    agentName: 'Anna Martinez',
    location: 'New York Hub'
  },
  {
    id: 'SAR-007',
    caseNumber: 'SAR-2024-11-007',
    channel: 'email',
    suspiciousActivity: 'Unusual credit card dispute pattern',
    category: 'Fraud Detection',
    customerName: 'Jennifer S. ****6789',
    customerId: 'CUST-223456',
    amount: '$8,750',
    detectedAt: '5 hours ago',
    confidenceScore: 85.4,
    riskLevel: 'medium',
    aiSummary: 'Customer filed 12 chargebacks in 30 days, all claiming unauthorized transactions. Merchant records show matching IP addresses for all transactions. Pattern suggests friendly fraud. Email correspondence shows scripted responses.',
    status: 'pending',
    agentName: 'Thomas Lee',
    location: 'Dallas Operations'
  },
  {
    id: 'SAR-008',
    caseNumber: 'SAR-2024-11-008',
    channel: 'chat',
    suspiciousActivity: 'Third-party account takeover attempt',
    category: 'Customer Identification Program',
    customerName: 'William B. ****0123',
    customerId: 'CUST-667890',
    amount: '$45,000',
    detectedAt: '6 hours ago',
    confidenceScore: 93.7,
    riskLevel: 'high',
    aiSummary: 'Chat session initiated with valid credentials but behavioral analysis flagged anomalies. Typing pattern, response time, and vocabulary significantly different from customer baseline. Attempted to change contact information and request new card.',
    status: 'pending',
    agentName: 'Rachel Kim',
    location: 'Seattle Hub'
  }
];

const channelConfigFull = {
  email: { label: 'Email', icon: Mail, color: '#3b82f6' },
  chat: { label: 'Chat', icon: MessageSquare, color: '#22c55e' },
  ticket: { label: 'Ticket', icon: Ticket, color: '#f97316' },
  voice: { label: 'Voice', icon: Mic, color: '#8b5cf6' },
  social: { label: 'Social', icon: Share2, color: '#ec4899' }
};

interface ViolationCategoryChartProps {
  data: ViolationData[];
  isDarkMode?: boolean;
}

// Generate channel breakdown based on category total
const getChannelBreakdown = (category: string, total: number): ChannelBreakdown => {
  const distributions: Record<string, number[]> = {
    'Sanctions / PEP Screening': [0.15, 0.20, 0.35, 0.25, 0.05],
    'AML Compliance': [0.10, 0.15, 0.30, 0.40, 0.05],
    'Customer Identification Program': [0.20, 0.30, 0.20, 0.25, 0.05],
    'Regulatory Reporting': [0.40, 0.10, 0.35, 0.10, 0.05],
    'Data Privacy Compliance': [0.25, 0.25, 0.20, 0.15, 0.15],
    'GDPR Compliance': [0.25, 0.25, 0.20, 0.15, 0.15],
    'Cross-Border Compliance': [0.30, 0.15, 0.25, 0.20, 0.10],
    'Vendor Compliance': [0.35, 0.20, 0.30, 0.10, 0.05]
  };
  
  const dist = distributions[category] || [0.20, 0.20, 0.20, 0.20, 0.20];
  
  return {
    email: Math.round(total * dist[0]),
    chat: Math.round(total * dist[1]),
    ticket: Math.round(total * dist[2]),
    voice: Math.round(total * dist[3]),
    social: Math.round(total * dist[4])
  };
};

export function ViolationCategoryChart({ data, isDarkMode = false }: ViolationCategoryChartProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [hoveredBar, setHoveredBar] = useState<{ categoryIndex: number; channel: string } | null>(null);
  const [showSARModal, setShowSARModal] = useState(false);
  const [sarReports, setSarReports] = useState<SARReport[]>(sarReportsData);

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 200);
    return () => clearTimeout(timer);
  }, []);

  const maxCount = Math.max(...data.map(d => d.count));
  const totalViolations = data.reduce((sum, d) => sum + d.count, 0);

  const getCategoryIcon = (category: string, color: string) => {
    const iconProps = { className: "w-4 h-4", style: { color } };
    switch (category) {
      case 'Sanctions / PEP Screening': return <Search {...iconProps} />;
      case 'AML Compliance': return <Banknote {...iconProps} />;
      case 'Customer Identification Program': return <UserCheck {...iconProps} />;
      case 'Regulatory Reporting': return <FileBarChart {...iconProps} />;
      case 'Data Privacy Compliance':
      case 'GDPR Compliance': return <ShieldCheck {...iconProps} />;
      case 'Cross-Border Compliance': return <Globe {...iconProps} />;
      case 'Vendor Compliance': return <Building2 {...iconProps} />;
      default: return <AlertCircle {...iconProps} />;
    }
  };

  const channelConfig = [
    { key: 'email', label: 'Email', icon: Mail, color: '#3b82f6' },
    { key: 'chat', label: 'Chat', icon: MessageSquare, color: '#22c55e' },
    { key: 'ticket', label: 'Ticket', icon: Ticket, color: '#f97316' },
    { key: 'voice', label: 'Voice', icon: Mic, color: '#8b5cf6' },
    { key: 'social', label: 'Social', icon: Share2, color: '#ec4899' }
  ];

  const getRiskColor = (level: SARReport['riskLevel']) => {
    switch (level) {
      case 'critical': return '#ef4444';
      case 'high': return '#f97316';
      case 'medium': return '#eab308';
      default: return '#939394';
    }
  };

  const handleApprove = (id: string) => {
    setSarReports(prev => prev.map(r => r.id === id ? { ...r, status: 'approved' as const } : r));
  };

  const handleReject = (id: string) => {
    setSarReports(prev => prev.map(r => r.id === id ? { ...r, status: 'rejected' as const } : r));
  };

  const handleApproveAll = () => {
    setSarReports(prev => prev.map(r => r.status === 'pending' ? { ...r, status: 'approved' as const } : r));
  };

  const pendingCount = sarReports.filter(r => r.status === 'pending').length;
  const approvedCount = sarReports.filter(r => r.status === 'approved').length;

  return (
    <>
      <div
        className={`rounded-2xl p-6 transition-all duration-500 flex flex-col overflow-hidden ${
          isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
        }`}
        style={{
          backgroundColor: isDarkMode ? '#0d0d0d' : '#FFFFFF',
          border: `1px solid ${isDarkMode ? '#2a2a2a' : '#E5E5E5'}`,
          boxShadow: isDarkMode 
            ? '0 4px 24px rgba(0, 0, 0, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.05)'
            : '0 4px 24px rgba(0, 0, 0, 0.06)',
          maxHeight: '600px'
        }}
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 
              className="text-lg font-bold mb-1"
              style={{ color: isDarkMode ? '#FFFFFF' : '#010101' }}
            >
              Violations by Category
            </h3>
            <p className="text-xs" style={{ color: '#939394' }}>
              {totalViolations.toLocaleString()} total violations detected
            </p>
          </div>
          <button 
            onClick={() => setShowSARModal(true)}
            className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all hover:opacity-90 hover:scale-105"
            style={{ 
              background: 'linear-gradient(135deg, #5332FF 0%, #7c3aed 100%)',
              color: '#FFFFFF',
              boxShadow: '0 4px 12px rgba(83, 50, 255, 0.3)'
            }}
          >
            <span>✨</span>
            Automated SAR Report
            {pendingCount > 0 && (
              <span 
                className="ml-1 px-1.5 py-0.5 rounded-full text-[10px] font-bold"
                style={{ backgroundColor: '#ef4444', color: '#FFFFFF' }}
              >
                {pendingCount}
              </span>
            )}
          </button>
        </div>

        {/* Bar Chart */}
        <div className="space-y-4 flex-1">
          {data.map((item, index) => {
            const barWidth = (item.count / maxCount) * 100;
            const severityColor = getSeverityColor(item.severity);
            const channelBreakdown = getChannelBreakdown(item.category, item.count);

            return (
              <div
                key={item.category}
                className={`transition-all duration-300 ${
                  isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-4'
                }`}
                style={{ transitionDelay: `${index * 100}ms` }}
              >
                {/* Category Label Row */}
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <div 
                      className="p-1.5 rounded-lg"
                      style={{ backgroundColor: `${severityColor}15` }}
                    >
                      {getCategoryIcon(item.category, severityColor)}
                    </div>
                    <span 
                      className="text-sm font-medium"
                      style={{ color: isDarkMode ? '#FFFFFF' : '#010101' }}
                    >
                      {item.category}
                    </span>
                    <span 
                      className="px-2 py-0.5 rounded text-xs font-medium uppercase"
                      style={{ 
                        backgroundColor: `${severityColor}20`,
                        color: severityColor
                      }}
                    >
                      {item.severity}
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span 
                      className="text-sm font-bold tabular-nums"
                      style={{ color: isDarkMode ? '#FFFFFF' : '#010101' }}
                    >
                      {item.count.toLocaleString()}
                    </span>
                    <div 
                      className="flex items-center gap-1 text-xs font-medium"
                      style={{ color: item.trend > 0 ? '#ef4444' : '#22c55e' }}
                    >
                      {item.trend > 0 ? (
                        <TrendingUp className="w-3 h-3" />
                      ) : (
                        <TrendingDown className="w-3 h-3" />
                      )}
                      <span>{Math.abs(item.trend)}%</span>
                    </div>
                  </div>
                </div>

                {/* Segmented Progress Bar with Channels */}
                <div 
                  className="relative h-3 rounded-full overflow-hidden"
                  style={{ backgroundColor: isDarkMode ? '#1a1a1a' : '#F0F0F0' }}
                >
                  <div 
                    className="h-full flex rounded-full overflow-hidden transition-all duration-700 ease-out"
                    style={{
                      width: isVisible ? `${barWidth}%` : '0%',
                      transitionDelay: `${index * 100}ms`
                    }}
                  >
                    {channelConfig.map((channel) => {
                      const channelCount = channelBreakdown[channel.key as keyof ChannelBreakdown];
                      const channelPercentage = (channelCount / item.count) * 100;
                      const isHovered = hoveredBar?.categoryIndex === index && hoveredBar?.channel === channel.key;
                      
                      if (channelCount === 0) return null;
                      
                      return (
                        <div
                          key={channel.key}
                          className="h-full flex items-center justify-center relative group cursor-pointer transition-all duration-300"
                          style={{ 
                            width: `${channelPercentage}%`,
                            backgroundColor: channel.color,
                            opacity: isHovered ? 1 : 0.9,
                            transform: isHovered ? 'scaleY(1.3)' : 'scaleY(1)',
                            boxShadow: isHovered ? `inset 0 0 0 1px ${isDarkMode ? '#FFFFFF' : '#000000'}60` : 'none'
                          }}
                          onMouseEnter={() => setHoveredBar({ categoryIndex: index, channel: channel.key })}
                          onMouseLeave={() => setHoveredBar(null)}
                        >
                          {/* Show percentage inside bar only on hover */}
                          {isHovered && (
                            <span 
                              className="text-[9px] font-bold text-white z-10"
                              style={{ 
                                textShadow: '0 1px 2px rgba(0,0,0,0.5)',
                                whiteSpace: 'nowrap'
                              }}
                            >
                              {Math.round(channelPercentage)}%
                            </span>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Channel Legend (replacing severity legend) */}
        <div className="mt-6 pt-4 border-t flex-shrink-0" style={{ borderColor: isDarkMode ? '#2a2a2a' : '#E5E5E5' }}>
          <div className="flex items-center justify-between gap-2 overflow-x-auto">
            <span className="text-xs font-semibold flex-shrink-0" style={{ color: '#939394' }}>
              Channels:
            </span>
            {channelConfig.map((channel) => {
              const Icon = channel.icon;
              return (
                <div key={channel.key} className="flex items-center gap-1 flex-shrink-0">
                  <Icon className="w-3 h-3" style={{ color: channel.color }} />
                  <span className="text-[11px]" style={{ color: '#939394' }}>
                    {channel.label}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* SAR Report Modal */}
      {showSARModal && (
        <>
          {/* Backdrop */}
          <div 
            className="fixed inset-0 z-50 animate-in fade-in duration-300"
            style={{
              backgroundColor: isDarkMode ? 'rgba(0, 0, 0, 0.85)' : 'rgba(0, 0, 0, 0.7)',
              backdropFilter: 'blur(8px)',
            }}
            onClick={() => setShowSARModal(false)}
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
              boxShadow: '0 25px 80px -12px rgba(0, 0, 0, 0.6)'
            }}
          >
            {/* Modal Header */}
            <div 
              className="p-5 border-b flex-shrink-0"
              style={{ 
                borderColor: isDarkMode ? '#2a2a2a' : '#E5E5E5',
                background: isDarkMode 
                  ? 'linear-gradient(135deg, #1a0d2e 0%, #0d0d0d 100%)'
                  : 'linear-gradient(135deg, #F5F0FF 0%, #FFFFFF 100%)'
              }}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div 
                    className="p-3 rounded-xl"
                    style={{ 
                      background: 'linear-gradient(135deg, #5332FF 0%, #7c3aed 100%)',
                      boxShadow: '0 4px 12px rgba(83, 50, 255, 0.3)'
                    }}
                  >
                    <FileText className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h2 
                      className="text-xl font-bold flex items-center gap-2"
                      style={{ color: isDarkMode ? '#FFFFFF' : '#010101' }}
                    >
                      ✨ AI Automated SAR Reports
                    </h2>
                    <p className="text-sm" style={{ color: '#939394' }}>
                      Suspicious Activity Reports auto-generated from customer interactions
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  {/* Stats */}
                  <div className="flex items-center gap-4 mr-4">
                    <div className="text-center">
                      <p className="text-2xl font-bold" style={{ color: '#f97316' }}>{pendingCount}</p>
                      <p className="text-[10px] uppercase" style={{ color: '#939394' }}>Pending</p>
                    </div>
                    <div className="text-center">
                      <p className="text-2xl font-bold" style={{ color: '#22c55e' }}>{approvedCount}</p>
                      <p className="text-[10px] uppercase" style={{ color: '#939394' }}>Approved</p>
                    </div>
                  </div>
                  {pendingCount > 0 && (
                    <button 
                      onClick={handleApproveAll}
                      className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all hover:opacity-90"
                      style={{ 
                        backgroundColor: '#22c55e',
                        color: '#FFFFFF'
                      }}
                    >
                      <CheckCheck className="w-4 h-4" />
                      Approve All ({pendingCount})
                    </button>
                  )}
                  <button 
                    onClick={() => setShowSARModal(false)}
                    className="p-2 rounded-xl transition-all hover:scale-105"
                    style={{ 
                      backgroundColor: isDarkMode ? '#1a1a1a' : '#F5F5F5',
                      border: `1px solid ${isDarkMode ? '#2a2a2a' : '#E5E5E5'}`
                    }}
                  >
                    <X className="w-5 h-5" style={{ color: '#939394' }} />
                  </button>
                </div>
              </div>
            </div>

            {/* SAR Reports List */}
            <div 
              className="flex-1 overflow-y-auto p-5"
              style={{ 
                scrollbarWidth: 'thin',
                scrollbarColor: isDarkMode ? '#3a3a3a #1a1a1a' : '#d1d1d1 #f5f5f5'
              }}
            >
              <div className="space-y-4">
                {sarReports.map((report) => {
                  const channelInfo = channelConfigFull[report.channel];
                  const ChannelIcon = channelInfo.icon;
                  const riskColor = getRiskColor(report.riskLevel);
                  
                  return (
                    <div 
                      key={report.id}
                      className={`p-5 rounded-xl transition-all duration-300 ${
                        report.status !== 'pending' ? 'opacity-60' : ''
                      }`}
                      style={{ 
                        backgroundColor: isDarkMode ? '#1a1a1a' : '#F8F8F8',
                        border: `1px solid ${report.status === 'approved' ? '#22c55e40' : report.status === 'rejected' ? '#ef444440' : (isDarkMode ? '#2a2a2a' : '#E5E5E5')}`
                      }}
                    >
                      {/* Report Header */}
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <span 
                              className="text-sm font-bold"
                              style={{ color: isDarkMode ? '#FFFFFF' : '#010101' }}
                            >
                              {report.caseNumber}
                            </span>
                            <span 
                              className="text-[10px] px-2 py-0.5 rounded-full uppercase font-medium"
                              style={{ backgroundColor: `${riskColor}20`, color: riskColor }}
                            >
                              {report.riskLevel}
                            </span>
                            <span 
                              className="flex items-center gap-1 text-[10px] px-2 py-0.5 rounded-full"
                              style={{ backgroundColor: `${channelInfo.color}15`, color: channelInfo.color }}
                            >
                              <ChannelIcon className="w-3 h-3" />
                              {channelInfo.label}
                            </span>
                            <span 
                              className="text-[10px] px-2 py-0.5 rounded"
                              style={{ 
                                backgroundColor: isDarkMode ? '#2a2a2a' : '#E5E5E5',
                                color: '#939394'
                              }}
                            >
                              {report.category}
                            </span>
                            {report.status !== 'pending' && (
                              <span 
                                className="flex items-center gap-1 text-[10px] px-2 py-0.5 rounded-full font-medium"
                                style={{ 
                                  backgroundColor: report.status === 'approved' ? '#22c55e20' : '#ef444420',
                                  color: report.status === 'approved' ? '#22c55e' : '#ef4444'
                                }}
                              >
                                {report.status === 'approved' ? <CheckCircle2 className="w-3 h-3" /> : <XCircle className="w-3 h-3" />}
                                {report.status === 'approved' ? 'Approved' : 'Rejected'}
                              </span>
                            )}
                          </div>
                          <h3 
                            className="text-base font-semibold mb-2"
                            style={{ color: isDarkMode ? '#FFFFFF' : '#010101' }}
                          >
                            {report.suspiciousActivity}
                          </h3>
                          <div className="grid grid-cols-2 lg:grid-cols-5 gap-3 text-xs mb-3">
                            <div className="flex items-center gap-1.5">
                              <User className="w-3 h-3" style={{ color: '#939394' }} />
                              <span style={{ color: '#939394' }}>Customer:</span>
                              <span style={{ color: isDarkMode ? '#D6D9D8' : '#4a4a4a' }}>{report.customerName}</span>
                            </div>
                            <div className="flex items-center gap-1.5">
                              <DollarSign className="w-3 h-3" style={{ color: '#939394' }} />
                              <span style={{ color: '#939394' }}>Amount:</span>
                              <span style={{ color: isDarkMode ? '#D6D9D8' : '#4a4a4a' }}>{report.amount}</span>
                            </div>
                            <div className="flex items-center gap-1.5">
                              <Clock className="w-3 h-3" style={{ color: '#939394' }} />
                              <span style={{ color: '#939394' }}>Detected:</span>
                              <span style={{ color: isDarkMode ? '#D6D9D8' : '#4a4a4a' }}>{report.detectedAt}</span>
                            </div>
                            <div className="flex items-center gap-1.5">
                              <User className="w-3 h-3" style={{ color: '#939394' }} />
                              <span style={{ color: '#939394' }}>Agent:</span>
                              <span style={{ color: isDarkMode ? '#D6D9D8' : '#4a4a4a' }}>{report.agentName}</span>
                            </div>
                            <div className="flex items-center gap-1.5">
                              <Building2 className="w-3 h-3" style={{ color: '#939394' }} />
                              <span style={{ color: '#939394' }}>Location:</span>
                              <span style={{ color: isDarkMode ? '#D6D9D8' : '#4a4a4a' }}>{report.location}</span>
                            </div>
                          </div>
                        </div>
                        
                        {/* Confidence Score */}
                        <div 
                          className="flex flex-col items-center p-3 rounded-xl ml-4"
                          style={{ 
                            backgroundColor: report.confidenceScore >= 90 ? '#22c55e15' : report.confidenceScore >= 80 ? '#eab30815' : '#f9731615',
                          }}
                        >
                          <Brain 
                            className="w-5 h-5 mb-1" 
                            style={{ color: report.confidenceScore >= 90 ? '#22c55e' : report.confidenceScore >= 80 ? '#eab308' : '#f97316' }} 
                          />
                          <span 
                            className="text-xl font-bold"
                            style={{ color: report.confidenceScore >= 90 ? '#22c55e' : report.confidenceScore >= 80 ? '#eab308' : '#f97316' }}
                          >
                            {report.confidenceScore}%
                          </span>
                          <span className="text-[9px] uppercase" style={{ color: '#939394' }}>Confidence</span>
                        </div>
                      </div>

                      {/* AI Summary */}
                      <div 
                        className="p-3 rounded-lg mb-4"
                        style={{ 
                          backgroundColor: isDarkMode ? '#0d0d0d' : '#FFFFFF',
                          border: `1px solid ${isDarkMode ? '#2a2a2a' : '#E5E5E5'}`
                        }}
                      >
                        <div className="flex items-center gap-2 mb-2">
                          <Brain className="w-4 h-4" style={{ color: '#5332FF' }} />
                          <span className="text-xs font-semibold" style={{ color: '#5332FF' }}>AI Analysis Summary</span>
                        </div>
                        <p className="text-sm leading-relaxed" style={{ color: isDarkMode ? '#D6D9D8' : '#4a4a4a' }}>
                          {report.aiSummary}
                        </p>
                      </div>

                      {/* Action Buttons */}
                      {report.status === 'pending' && (
                        <div className="flex items-center justify-end gap-3">
                          <button 
                            onClick={() => handleReject(report.id)}
                            className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all hover:opacity-90"
                            style={{ 
                              backgroundColor: '#ef444420',
                              color: '#ef4444'
                            }}
                          >
                            <XCircle className="w-4 h-4" />
                            Reject
                          </button>
                          <button 
                            onClick={() => handleApprove(report.id)}
                            className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all hover:opacity-90"
                            style={{ 
                              backgroundColor: '#22c55e',
                              color: '#FFFFFF'
                            }}
                          >
                            <CheckCircle2 className="w-4 h-4" />
                            Approve SAR
                          </button>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Modal Footer */}
            <div 
              className="p-4 border-t flex items-center justify-between flex-shrink-0"
              style={{ 
                borderColor: isDarkMode ? '#2a2a2a' : '#E5E5E5',
                backgroundColor: isDarkMode ? '#0a0a0a' : '#FAFAFA'
              }}
            >
              <div className="flex items-center gap-2">
                <AlertTriangle className="w-4 h-4" style={{ color: '#f97316' }} />
                <span className="text-xs" style={{ color: '#939394' }}>
                  SAR reports are auto-generated by AI and require human review before filing with FinCEN
                </span>
              </div>
              <button 
                onClick={() => setShowSARModal(false)}
                className="px-4 py-2 rounded-lg text-sm font-medium"
                style={{ 
                  backgroundColor: isDarkMode ? '#1a1a1a' : '#FFFFFF',
                  color: isDarkMode ? '#FFFFFF' : '#010101',
                  border: `1px solid ${isDarkMode ? '#2a2a2a' : '#E5E5E5'}`
                }}
              >
                Close
              </button>
            </div>
          </div>
        </>
      )}
    </>
  );
}
