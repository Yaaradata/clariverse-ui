'use client';

import { useState } from 'react';
import { 
  AlertTriangle, 
  MessageSquare, 
  Phone, 
  Mail, 
  Ticket, 
  Globe,
  Clock,
  X,
  FileText,
  Sparkles,
  ChevronRight,
  ShieldAlert,
  Ban,
  CheckCircle,
  FileQuestion
} from 'lucide-react';

interface HighRiskCase {
  id: string;
  ticketId: string;
  channel: 'Chat' | 'Voice' | 'Email' | 'Tickets' | 'Social';
  category: 'Fulfillment Fraud' | 'Syndicated Claims' | 'Asset Abuse' | 'Incentive Fraud' | 'Insider Collusion' | 'Brand Extortion' | '3rd Party Fraud' | 'Policy Arbitrage';
  riskScore: number;
  monetaryImpact: number;
  age: string;
  aiRecommendation: 'Deny & Escalate' | 'Ask for Docs' | 'Likely Genuine' | 'Manual Review';
  customerName: string;
  suspiciousPhrases: string[];
  badges: string[];
  aiSummary: string;
}

interface HighRiskCasesTableProps {
  cases?: HighRiskCase[];
}

const getChannelIcon = (channel: string) => {
  switch (channel) {
    case 'Chat': return <MessageSquare className="w-3.5 h-3.5" />;
    case 'Voice': return <Phone className="w-3.5 h-3.5" />;
    case 'Email': return <Mail className="w-3.5 h-3.5" />;
    case 'Tickets': return <Ticket className="w-3.5 h-3.5" />;
    case 'Social': return <Globe className="w-3.5 h-3.5" />;
    default: return <MessageSquare className="w-3.5 h-3.5" />;
  }
};

const getCategoryColor = (category: string) => {
  switch (category) {
    case 'Fulfillment Fraud': return 'bg-red-500/20 text-red-400 border-red-500/30';
    case 'Syndicated Claims': return 'bg-orange-500/20 text-orange-400 border-orange-500/30';
    case 'Asset Abuse': return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
    case 'Incentive Fraud': return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
    case 'Insider Collusion': return 'bg-purple-500/20 text-purple-400 border-purple-500/30';
    case 'Brand Extortion': return 'bg-pink-500/20 text-pink-400 border-pink-500/30';
    case '3rd Party Fraud': return 'bg-amber-500/20 text-amber-400 border-amber-500/30';
    case 'Policy Arbitrage': return 'bg-cyan-500/20 text-cyan-400 border-cyan-500/30';
    default: return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
  }
};

const getRiskScoreColor = (score: number) => {
  if (score >= 80) return 'bg-red-500 text-white';
  if (score >= 60) return 'bg-orange-500 text-white';
  if (score >= 40) return 'bg-yellow-500 text-black';
  return 'bg-green-500 text-white';
};

const getRecommendationStyle = (rec: string) => {
  switch (rec) {
    case 'Deny & Escalate': return { bg: 'bg-red-500/10', text: 'text-red-400', icon: Ban };
    case 'Ask for Docs': return { bg: 'bg-orange-500/10', text: 'text-orange-400', icon: FileQuestion };
    case 'Likely Genuine': return { bg: 'bg-green-500/10', text: 'text-green-400', icon: CheckCircle };
    default: return { bg: 'bg-gray-500/10', text: 'text-gray-400', icon: FileText };
  }
};

const formatCurrency = (value: number) => {
  if (value >= 100000) return `₹${(value / 100000).toFixed(1)}L`;
  return `₹${value.toLocaleString()}`;
};

// Mock data
const mockCases: HighRiskCase[] = [
  {
    id: 'HRC-001',
    ticketId: 'TKT-78234',
    channel: 'Chat',
    category: 'Fulfillment Fraud',
    riskScore: 92,
    monetaryImpact: 89999,
    age: '2h',
    aiRecommendation: 'Deny & Escalate',
    customerName: 'Rahul S.',
    suspiciousPhrases: ['GPS mismatch detected', 'Multiple DNR claims', 'Same delivery partner'],
    badges: ['Script Reuse', 'Repeat Offender'],
    aiSummary: 'Customer has 4 prior fulfillment fraud claims in 30 days. GPS data shows delivery completed 2km from claimed address. Pattern matches organized fraud ring.',
  },
  {
    id: 'HRC-002',
    ticketId: 'TKT-78456',
    channel: 'Voice',
    category: 'Syndicated Claims',
    riskScore: 88,
    monetaryImpact: 156000,
    age: '45m',
    aiRecommendation: 'Ask for Docs',
    customerName: 'Priya M.',
    suspiciousPhrases: ['Weight verification failed', 'High-value item', 'No unboxing video'],
    badges: ['Coercion Threat', 'Legal Mention'],
    aiSummary: 'High-value gold item claim. Customer mentioned legal action. Package weight matches expected. Request unboxing proof and seal verification.',
  },
  {
    id: 'HRC-003',
    ticketId: 'TKT-78123',
    channel: 'Email',
    category: 'Asset Abuse',
    riskScore: 75,
    monetaryImpact: 12999,
    age: '3h',
    aiRecommendation: 'Ask for Docs',
    customerName: 'Amit K.',
    suspiciousPhrases: ['Tags removed', 'Signs of use', 'Festival return'],
    badges: ['Asset Abuse Pattern'],
    aiSummary: 'Clothing return after Diwali. Product shows wear patterns. Customer has 3 similar returns in festive periods.',
  },
  {
    id: 'HRC-004',
    ticketId: 'TKT-77998',
    channel: 'Tickets',
    category: 'Incentive Fraud',
    riskScore: 85,
    monetaryImpact: 45000,
    age: '1h',
    aiRecommendation: 'Deny & Escalate',
    customerName: 'Vikram T.',
    suspiciousPhrases: ['Multiple accounts', 'Device fingerprint match', 'Referral abuse'],
    badges: ['Incentive Abuse', 'Fake Escalation'],
    aiSummary: 'Same device ID across 12 accounts. Total incentive fraud value ₹45K. Linked to known fraud telegram group.',
  },
  {
    id: 'HRC-005',
    ticketId: 'TKT-77856',
    channel: 'Social',
    category: 'Insider Collusion',
    riskScore: 68,
    monetaryImpact: 28500,
    age: '4h',
    aiRecommendation: 'Manual Review',
    customerName: 'Sneha R.',
    suspiciousPhrases: ['Agent override', 'No documentation', 'VIP treatment'],
    badges: ['Agent Collusion'],
    aiSummary: 'Refund approved by flagged agent EMP-4521 without standard documentation. Similar pattern in 5 other cases.',
  },
  {
    id: 'HRC-006',
    ticketId: 'TKT-77654',
    channel: 'Social',
    category: 'Brand Extortion',
    riskScore: 82,
    monetaryImpact: 34500,
    age: '25m',
    aiRecommendation: 'Manual Review',
    customerName: 'Karan P.',
    suspiciousPhrases: ['Will post on Twitter', 'Refund or viral review', '10K followers'],
    badges: ['Social Threat', 'Brand Attack'],
    aiSummary: 'Customer posted 1-star review within 8 minutes of refund denial. Pattern of social threats detected across 3 prior interactions.',
  },
  {
    id: 'HRC-007',
    ticketId: 'TKT-77512',
    channel: 'Chat',
    category: '3rd Party Fraud',
    riskScore: 94,
    monetaryImpact: 78000,
    age: '15m',
    aiRecommendation: 'Deny & Escalate',
    customerName: 'Unknown A.',
    suspiciousPhrases: ['DNA method', 'FTID guaranteed', 'Boxing technique'],
    badges: ['Pro Refunder', 'Fraud Slang'],
    aiSummary: 'Chat contains professional refund service slang. Customer likely hired "refund professional". Escalate to fraud investigation team.',
  },
  {
    id: 'HRC-008',
    ticketId: 'TKT-77389',
    channel: 'Voice',
    category: 'Policy Arbitrage',
    riskScore: 79,
    monetaryImpact: 22500,
    age: '1h',
    aiRecommendation: 'Manual Review',
    customerName: 'Meera S.',
    suspiciousPhrases: ['Already spoke to chat', 'Email to CEO', 'Third time calling'],
    badges: ['Channel Hopping', 'Escalation Hunting'],
    aiSummary: 'Customer contacted chatbot (denied), then voice (denied), now emailing exec team. Shopping for approval across channels within 45 minutes.',
  },
];

export default function HighRiskCasesTable({ cases = mockCases }: HighRiskCasesTableProps) {
  const [selectedCase, setSelectedCase] = useState<HighRiskCase | null>(null);
  const [severityFilter, setSeverityFilter] = useState<'all' | 'critical' | 'high'>('all');

  const filteredCases = cases.filter(c => {
    if (severityFilter === 'critical') return c.riskScore >= 80;
    if (severityFilter === 'high') return c.riskScore >= 60 && c.riskScore < 80;
    return true;
  });

  const criticalCount = cases.filter(c => c.riskScore >= 80).length;

  return (
    <>
      <div className="bg-[#0a0a0f] border border-white/10 rounded-xl p-4 h-full flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <div className="p-1.5 bg-red-500/10 rounded-lg">
              <ShieldAlert className="w-4 h-4 text-red-400" />
            </div>
            <div>
              <h3 className="text-white font-semibold text-sm">High-Risk Fraud Cases</h3>
              <p className="text-gray-500 text-[10px]">{cases.length} cases • {criticalCount} critical</p>
            </div>
          </div>
          <div className="flex gap-1">
            {(['all', 'critical', 'high'] as const).map(filter => (
              <button
                key={filter}
                onClick={() => setSeverityFilter(filter)}
                className={`px-2 py-1 text-[10px] font-medium rounded transition-all ${
                  severityFilter === filter
                    ? 'bg-red-500/20 text-red-400'
                    : 'text-gray-500 hover:bg-white/5'
                }`}
              >
                {filter === 'all' ? 'All' : filter === 'critical' ? '≥80' : '60-79'}
              </button>
            ))}
          </div>
        </div>

        {/* Table */}
        <div className="flex-1 overflow-auto scrollbar-thin">
          <table className="w-full text-left">
            <thead className="sticky top-0 bg-[#0a0a0f] z-10">
              <tr className="text-gray-500 text-[10px] uppercase tracking-wider border-b border-white/5">
                <th className="pb-2 pr-2">Case ID</th>
                <th className="pb-2 px-2">Ch</th>
                <th className="pb-2 px-2">Category</th>
                <th className="pb-2 px-2">Risk</th>
                <th className="pb-2 px-2">Impact</th>
                <th className="pb-2 px-2">Age</th>
                <th className="pb-2 pl-2">AI Rec.</th>
              </tr>
            </thead>
            <tbody>
              {filteredCases.map((c) => {
                const recStyle = getRecommendationStyle(c.aiRecommendation);
                const RecIcon = recStyle.icon;
                return (
                  <tr 
                    key={c.id}
                    onClick={() => setSelectedCase(c)}
                    className="border-b border-white/5 hover:bg-white/5 cursor-pointer transition-all group"
                  >
                    <td className="py-2 pr-2">
                      <div className="flex items-center gap-1.5">
                        <span className="text-white text-xs font-medium">{c.ticketId}</span>
                        <ChevronRight className="w-3 h-3 text-gray-600 opacity-0 group-hover:opacity-100 transition-opacity" />
                      </div>
                    </td>
                    <td className="py-2 px-2">
                      <div className="text-gray-400">{getChannelIcon(c.channel)}</div>
                    </td>
                    <td className="py-2 px-2">
                      <span className={`text-[10px] px-1.5 py-0.5 rounded border ${getCategoryColor(c.category)}`}>
                        {c.category}
                      </span>
                    </td>
                    <td className="py-2 px-2">
                      <span className={`text-[10px] px-1.5 py-0.5 rounded font-bold ${getRiskScoreColor(c.riskScore)}`}>
                        {c.riskScore}
                      </span>
                    </td>
                    <td className="py-2 px-2">
                      <span className="text-red-400 text-xs font-medium">{formatCurrency(c.monetaryImpact)}</span>
                    </td>
                    <td className="py-2 px-2">
                      <span className="text-gray-400 text-xs flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {c.age}
                      </span>
                    </td>
                    <td className="py-2 pl-2">
                      <span className={`text-[10px] px-1.5 py-0.5 rounded flex items-center gap-1 w-fit ${recStyle.bg} ${recStyle.text}`}>
                        <RecIcon className="w-3 h-3" />
                        <span className="hidden xl:inline">{c.aiRecommendation}</span>
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Scrollbar styling */}
        <style jsx>{`
          .scrollbar-thin::-webkit-scrollbar {
            width: 4px;
            height: 4px;
          }
          .scrollbar-thin::-webkit-scrollbar-track {
            background: rgba(255,255,255,0.02);
          }
          .scrollbar-thin::-webkit-scrollbar-thumb {
            background: rgba(255,255,255,0.1);
            border-radius: 2px;
          }
        `}</style>
      </div>

      {/* Case Detail Slide-over */}
      {selectedCase && (
        <div className="fixed inset-0 z-50 flex justify-end">
          <div className="absolute inset-0 bg-black/60" onClick={() => setSelectedCase(null)} />
          <div className="relative w-full max-w-md bg-[#0a0a0f] border-l border-white/10 p-5 overflow-y-auto">
            {/* Close Button */}
            <button 
              onClick={() => setSelectedCase(null)}
              className="absolute top-4 right-4 p-1 text-gray-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Header */}
            <div className="mb-4">
              <div className="flex items-center gap-2 mb-2">
                <span className={`text-xs px-2 py-0.5 rounded font-bold ${getRiskScoreColor(selectedCase.riskScore)}`}>
                  Risk: {selectedCase.riskScore}
                </span>
                <span className={`text-xs px-2 py-0.5 rounded border ${getCategoryColor(selectedCase.category)}`}>
                  {selectedCase.category}
                </span>
              </div>
              <h2 className="text-white text-lg font-semibold">{selectedCase.ticketId}</h2>
              <p className="text-gray-500 text-sm">{selectedCase.customerName} • {selectedCase.channel} • {selectedCase.age} ago</p>
            </div>

            {/* AI Summary */}
            <div className="bg-purple-500/10 border border-purple-500/20 rounded-lg p-3 mb-4">
              <div className="flex items-start gap-2">
                <Sparkles className="w-4 h-4 text-purple-400 flex-shrink-0 mt-0.5" />
                <div>
                  <span className="text-purple-400 text-[10px] uppercase tracking-wider font-semibold">AI Summary</span>
                  <p className="text-gray-300 text-sm mt-1">{selectedCase.aiSummary}</p>
                </div>
              </div>
            </div>

            {/* Monetary Impact */}
            <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-3 mb-4">
              <span className="text-gray-500 text-[10px] uppercase">Est. Monetary Impact</span>
              <div className="text-red-400 text-2xl font-bold">{formatCurrency(selectedCase.monetaryImpact)}</div>
            </div>

            {/* Suspicious Phrases */}
            <div className="mb-4">
              <h4 className="text-white text-sm font-medium mb-2">Key Suspicious Phrases</h4>
              <ul className="space-y-1.5">
                {selectedCase.suspiciousPhrases.map((phrase, i) => (
                  <li key={i} className="flex items-start gap-2 text-gray-400 text-sm">
                    <AlertTriangle className="w-3.5 h-3.5 text-orange-400 flex-shrink-0 mt-0.5" />
                    {phrase}
                  </li>
                ))}
              </ul>
            </div>

            {/* Badges */}
            <div className="mb-6">
              <h4 className="text-white text-sm font-medium mb-2">Fraud Indicators</h4>
              <div className="flex flex-wrap gap-2">
                {selectedCase.badges.map((badge, i) => (
                  <span key={i} className="text-xs px-2 py-1 rounded-full bg-red-500/10 text-red-400 border border-red-500/20">
                    {badge}
                  </span>
                ))}
              </div>
            </div>

            {/* AI Recommendation */}
            <div className="mb-6">
              <h4 className="text-white text-sm font-medium mb-2">AI Recommendation</h4>
              {(() => {
                const style = getRecommendationStyle(selectedCase.aiRecommendation);
                const Icon = style.icon;
                return (
                  <div className={`flex items-center gap-2 p-3 rounded-lg ${style.bg}`}>
                    <Icon className={`w-5 h-5 ${style.text}`} />
                    <span className={`font-semibold ${style.text}`}>{selectedCase.aiRecommendation}</span>
                  </div>
                );
              })()}
            </div>

            {/* Actions */}
            <div className="grid grid-cols-2 gap-3">
              <button className="px-4 py-2 bg-red-500/20 text-red-400 rounded-lg font-medium text-sm hover:bg-red-500/30 transition-all">
                Deny Claim
              </button>
              <button className="px-4 py-2 bg-white/5 text-white rounded-lg font-medium text-sm hover:bg-white/10 transition-all">
                Request Docs
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
