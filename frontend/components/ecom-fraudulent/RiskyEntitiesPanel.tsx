'use client';

import { useState } from 'react';
import { Users, UserX, MapPin, AlertTriangle, Shield, TrendingUp } from 'lucide-react';

interface RiskyCustomer {
  id: string;
  maskedPhone: string;
  fraudContacts: number;
  refundsReplacements: number;
  riskTag: 'Abuse' | 'Suspicious' | 'Likely ATO';
}

interface RiskyAgent {
  id: string;
  name: string;
  agentId: string;
  riskScore: number;
  fraudContacts: number;
  policyOverrides: number;
}

interface RiskyPincode {
  pincode: string;
  fraudContacts: number;
  topCategory: string;
  trend: number;
}

interface RiskyEntitiesPanelProps {
  customers?: RiskyCustomer[];
  agents?: RiskyAgent[];
  pincodes?: RiskyPincode[];
}

// Mock data
const defaultCustomers: RiskyCustomer[] = [
  { id: 'C-001', maskedPhone: '98XX-XXX-234', fraudContacts: 12, refundsReplacements: 8, riskTag: 'Abuse' },
  { id: 'C-002', maskedPhone: '77XX-XXX-891', fraudContacts: 8, refundsReplacements: 6, riskTag: 'Likely ATO' },
  { id: 'C-003', maskedPhone: '91XX-XXX-456', fraudContacts: 6, refundsReplacements: 5, riskTag: 'Suspicious' },
  { id: 'C-004', maskedPhone: '88XX-XXX-123', fraudContacts: 5, refundsReplacements: 4, riskTag: 'Abuse' },
  { id: 'C-005', maskedPhone: '85XX-XXX-321', fraudContacts: 4, refundsReplacements: 3, riskTag: 'Suspicious' },
  { id: 'C-006', maskedPhone: '90XX-XXX-999', fraudContacts: 9, refundsReplacements: 7, riskTag: 'Abuse' },
  { id: 'C-007', maskedPhone: '70XX-XXX-567', fraudContacts: 3, refundsReplacements: 2, riskTag: 'Likely ATO' },
  { id: 'C-008', maskedPhone: '99XX-XXX-890', fraudContacts: 7, refundsReplacements: 5, riskTag: 'Suspicious' },
];

const defaultAgents: RiskyAgent[] = [
  { id: 'A-001', name: 'Rajesh M.', agentId: 'EMP-4521', riskScore: 94, fraudContacts: 47, policyOverrides: 23 },
  { id: 'A-002', name: 'Priya S.', agentId: 'EMP-3892', riskScore: 87, fraudContacts: 38, policyOverrides: 18 },
  { id: 'A-003', name: 'Amit K.', agentId: 'EMP-5673', riskScore: 78, fraudContacts: 29, policyOverrides: 12 },
  { id: 'A-004', name: 'Sneha R.', agentId: 'EMP-2341', riskScore: 72, fraudContacts: 23, policyOverrides: 9 },
  { id: 'A-005', name: 'Vikram T.', agentId: 'EMP-6789', riskScore: 65, fraudContacts: 18, policyOverrides: 7 },
];

const defaultPincodes: RiskyPincode[] = [
  { pincode: '110001', fraudContacts: 156, topCategory: 'Fulfillment Fraud', trend: 23 },
  { pincode: '400001', fraudContacts: 134, topCategory: 'Syndicated Claims', trend: 18 },
  { pincode: '560001', fraudContacts: 98, topCategory: 'Incentive Fraud', trend: -5 },
  { pincode: '600001', fraudContacts: 87, topCategory: 'Asset Abuse', trend: 12 },
  { pincode: '700001', fraudContacts: 76, topCategory: 'Insider Collusion', trend: 8 },
  { pincode: '500001', fraudContacts: 65, topCategory: 'Brand Extortion', trend: 31 },
  { pincode: '380001', fraudContacts: 54, topCategory: '3rd Party Fraud', trend: 45 },
  { pincode: '302001', fraudContacts: 43, topCategory: 'Policy Arbitrage', trend: 22 },
];

const getRiskTagColor = (tag: string) => {
  switch (tag) {
    case 'Abuse': return 'bg-red-500/20 text-red-400';
    case 'Likely ATO': return 'bg-purple-500/20 text-purple-400';
    case 'Suspicious': return 'bg-orange-500/20 text-orange-400';
    default: return 'bg-gray-500/20 text-gray-400';
  }
};

const getRiskScoreColor = (score: number) => {
  if (score >= 80) return 'text-red-400';
  if (score >= 60) return 'text-orange-400';
  return 'text-yellow-400';
};

export default function RiskyEntitiesPanel({
  customers = defaultCustomers,
  agents = defaultAgents,
  pincodes = defaultPincodes,
}: RiskyEntitiesPanelProps) {
  const [activeTab, setActiveTab] = useState<'customers' | 'agents' | 'pincodes'>('customers');

  return (
    <div className="bg-[#0a0a0f] border border-white/10 rounded-xl p-4 h-full flex flex-col">
      {/* Header */}
      <div className="flex items-center gap-2 mb-3">
        <div className="p-1.5 bg-orange-500/10 rounded-lg">
          <AlertTriangle className="w-4 h-4 text-orange-400" />
        </div>
        <h3 className="text-white font-semibold text-sm">Risky Entities</h3>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 mb-3 p-0.5 bg-white/5 rounded-lg">
        <button
          onClick={() => setActiveTab('customers')}
          className={`flex-1 flex items-center justify-center gap-1 py-1.5 text-[10px] font-medium rounded transition-all ${
            activeTab === 'customers' ? 'bg-red-500/20 text-red-400' : 'text-gray-500 hover:text-gray-300'
          }`}
        >
          <Users className="w-3 h-3" />
          Customers
        </button>
        <button
          onClick={() => setActiveTab('agents')}
          className={`flex-1 flex items-center justify-center gap-1 py-1.5 text-[10px] font-medium rounded transition-all ${
            activeTab === 'agents' ? 'bg-purple-500/20 text-purple-400' : 'text-gray-500 hover:text-gray-300'
          }`}
        >
          <UserX className="w-3 h-3" />
          Agents
        </button>
        <button
          onClick={() => setActiveTab('pincodes')}
          className={`flex-1 flex items-center justify-center gap-1 py-1.5 text-[10px] font-medium rounded transition-all ${
            activeTab === 'pincodes' ? 'bg-blue-500/20 text-blue-400' : 'text-gray-500 hover:text-gray-300'
          }`}
        >
          <MapPin className="w-3 h-3" />
          Pincodes
        </button>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto space-y-2 scrollbar-thin">
        {activeTab === 'customers' && (
          <>
            {customers.map((customer) => (
              <div 
                key={customer.id}
                className="bg-[#0d0d14] border border-white/5 rounded-lg p-2.5 hover:border-white/10 cursor-pointer transition-all"
              >
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-white text-xs font-medium">{customer.maskedPhone}</span>
                  <span className={`text-[9px] px-1.5 py-0.5 rounded ${getRiskTagColor(customer.riskTag)}`}>
                    {customer.riskTag}
                  </span>
                </div>
                <div className="flex items-center gap-3 text-[10px]">
                  <span className="text-gray-500">
                    Fraud: <span className="text-red-400 font-medium">{customer.fraudContacts}</span>
                  </span>
                  <span className="text-gray-500">
                    Refunds: <span className="text-orange-400 font-medium">{customer.refundsReplacements}</span>
                  </span>
                </div>
              </div>
            ))}
          </>
        )}

        {activeTab === 'agents' && (
          <>
            {agents.map((agent) => (
              <div 
                key={agent.id}
                className="bg-[#0d0d14] border border-white/5 rounded-lg p-2.5 hover:border-white/10 cursor-pointer transition-all"
              >
                <div className="flex items-center justify-between mb-1.5">
                  <div>
                    <span className="text-white text-xs font-medium">{agent.name}</span>
                    <span className="text-gray-500 text-[10px] ml-1">({agent.agentId})</span>
                  </div>
                  <span className={`text-sm font-bold ${getRiskScoreColor(agent.riskScore)}`}>
                    {agent.riskScore}
                  </span>
                </div>
                <div className="flex items-center gap-3 text-[10px]">
                  <span className="text-gray-500">
                    Fraud: <span className="text-red-400 font-medium">{agent.fraudContacts}</span>
                  </span>
                  <span className="text-gray-500">
                    Overrides: <span className="text-purple-400 font-medium">{agent.policyOverrides}</span>
                  </span>
                </div>
              </div>
            ))}
          </>
        )}

        {activeTab === 'pincodes' && (
          <>
            {pincodes.map((pincode) => (
              <div 
                key={pincode.pincode}
                className="bg-[#0d0d14] border border-white/5 rounded-lg p-2.5 hover:border-white/10 cursor-pointer transition-all"
              >
                <div className="flex items-center justify-between mb-1.5">
                  <div className="flex items-center gap-1.5">
                    <MapPin className="w-3 h-3 text-blue-400" />
                    <span className="text-white text-xs font-medium">{pincode.pincode}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <TrendingUp className={`w-3 h-3 ${pincode.trend > 0 ? 'text-red-400' : 'text-green-400'}`} />
                    <span className={`text-[10px] ${pincode.trend > 0 ? 'text-red-400' : 'text-green-400'}`}>
                      {pincode.trend > 0 ? '+' : ''}{pincode.trend}%
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-3 text-[10px]">
                  <span className="text-gray-500">
                    Cases: <span className="text-white font-medium">{pincode.fraudContacts}</span>
                  </span>
                  <span className="text-gray-500">
                    Top: <span className="text-orange-400 font-medium">{pincode.topCategory}</span>
                  </span>
                </div>
              </div>
            ))}
          </>
        )}
      </div>

      {/* Scrollbar styling */}
      <style jsx>{`
        .scrollbar-thin::-webkit-scrollbar {
          width: 4px;
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
  );
}
