'use client';

import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { Ghost, CheckCircle, AlertCircle } from 'lucide-react';
import { EscalationData, GhostEscalationDetail } from '@/lib/ecom-fraudulent';

interface FakeEscalationDetectorProps {
  data: EscalationData[];
  ghostDetails: GhostEscalationDetail[];
}

const COLORS = {
  Legitimate: '#22c55e',
  Ghost: '#ef4444',
};

export default function FakeEscalationDetector({ data, ghostDetails }: FakeEscalationDetectorProps) {
  const totalEscalations = data.reduce((sum, item) => sum + item.count, 0);
  const ghostData = data.find(d => d.type === 'Ghost');

  const CustomTooltip = ({ active, payload }: { active?: boolean; payload?: Array<{ payload: EscalationData }> }) => {
    if (active && payload && payload.length) {
      const item = payload[0].payload;
      return (
        <div className="bg-[#0a0a0f]/95 backdrop-blur-xl border border-gray-700 rounded-lg p-3 shadow-xl">
          <p className="text-white font-semibold text-sm">{item.type} Escalations</p>
          <p className="text-gray-300 text-xs mt-1">
            Count: <span className="text-white font-medium">{item.count.toLocaleString()}</span>
          </p>
          <p className="text-gray-300 text-xs">
            Percentage: <span className="text-white font-medium">{item.percentage}%</span>
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="bg-[#0a0a0f] border border-cyan-500/20 rounded-xl p-4 h-full flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <div className="p-1.5 bg-cyan-500/10 rounded-lg">
            <Ghost className="w-4 h-4 text-cyan-400" />
          </div>
          <div>
            <h3 className="text-white font-semibold text-sm">Fake Escalation Detector</h3>
            <p className="text-gray-500 text-xs">Sentiment mismatch analysis</p>
          </div>
        </div>
      </div>

      {/* Chart and Legend */}
      <div className="flex items-center gap-4 mb-4">
        {/* Donut Chart */}
        <div className="relative w-32 h-32 flex-shrink-0">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                innerRadius={35}
                outerRadius={55}
                paddingAngle={2}
                dataKey="count"
                nameKey="type"
              >
                {data.map((entry) => (
                  <Cell 
                    key={entry.type} 
                    fill={COLORS[entry.type as keyof typeof COLORS]}
                    stroke="transparent"
                  />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
            </PieChart>
          </ResponsiveContainer>
          {/* Center Label */}
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-white text-lg font-bold">{totalEscalations}</span>
            <span className="text-gray-500 text-[9px]">Total</span>
          </div>
        </div>

        {/* Legend */}
        <div className="flex-1 space-y-2">
          <div className="flex items-center justify-between p-2 bg-green-500/10 rounded-lg border border-green-500/20">
            <div className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-green-400" />
              <span className="text-white text-xs font-medium">Legitimate</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-green-400 text-sm font-bold">{data.find(d => d.type === 'Legitimate')?.count}</span>
              <span className="text-green-400/60 text-xs">({data.find(d => d.type === 'Legitimate')?.percentage}%)</span>
            </div>
          </div>
          
          <div className="flex items-center justify-between p-2 bg-red-500/10 rounded-lg border border-red-500/20">
            <div className="flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-red-400" />
              <span className="text-white text-xs font-medium">Ghost</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-red-400 text-sm font-bold">{ghostData?.count}</span>
              <span className="text-red-400/60 text-xs">({ghostData?.percentage}%)</span>
            </div>
          </div>
        </div>
      </div>

      {/* Ghost Escalation Details */}
      <div className="flex-1 overflow-hidden">
        <div className="text-gray-500 text-[10px] uppercase tracking-wider mb-2">Recent Ghost Escalations</div>
        <div className="space-y-2 overflow-y-auto max-h-[140px] pr-1">
          {ghostDetails.map((detail) => (
            <div 
              key={detail.id}
              className="bg-red-500/5 border border-red-500/20 rounded-lg p-2"
            >
              <div className="flex items-center justify-between mb-1">
                <span className="text-gray-400 text-[10px] font-mono">{detail.ticketId}</span>
                <span className="text-gray-500 text-[9px]">
                  {new Date(detail.timestamp).toLocaleTimeString('en-US', { 
                    hour: '2-digit', 
                    minute: '2-digit' 
                  })}
                </span>
              </div>
              <div className="flex items-start gap-2">
                <div className="flex-1">
                  <p className="text-gray-400 text-[10px]">
                    <span className="text-gray-600">Claimed:</span>{' '}
                    <span className="text-red-400">&quot;{detail.escalationReason}&quot;</span>
                  </p>
                  <p className="text-gray-400 text-[10px] mt-0.5">
                    <span className="text-gray-600">Actual:</span>{' '}
                    <span className="text-green-400">{detail.actualCustomerTone}</span>
                  </p>
                </div>
                <div className="text-center">
                  <div className="text-green-400 text-sm font-bold">+{(detail.customerSentiment).toFixed(2)}</div>
                  <div className="text-gray-600 text-[8px]">Sentiment</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Footer */}
      <div className="mt-3 pt-3 border-t border-white/5 flex items-center justify-between">
        <span className="text-gray-600 text-[10px]">Ghost = No anger detected in customer tone</span>
        <span className="text-cyan-400 text-[10px] font-medium">Flagged by NLP Analyzer</span>
      </div>
    </div>
  );
}

