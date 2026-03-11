'use client';

import { usePathname } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { LineChart, Line, AreaChart, Area, BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Tooltip, RadialBarChart, RadialBar, Cell } from 'recharts';
import { AlertTriangle, CheckCircle, TrendingUp } from 'lucide-react';
import { AIAfterCallWork } from '@/components/compliance/AIAfterCallWork';

import { GranularComplianceScore } from '@/lib/voiceData';

interface TeamHealthColumnProps {
  qaScore: number;
  qaBreakdown: { empathy: number; compliance: number; tone: number; resolution: number; listening: number };
  qaTrend: number[];
  complianceData: {
    kycRate: number;
    identityConfirmation: number;
    fraudScript: number;
    regulatoryStatement: number;
    privacyDisclaimer: number;
    violations: number;
  };
  granularCompliance?: GranularComplianceScore;
  escalationData: {
    riskScore: number;
    callsAtRisk: number;
    agentsInvolved: string[];
    topCauses: string[];
    trend: number[];
  };
  dateRange?: {
    start: string;
    end: string;
  };
}

export function TeamHealthColumn({
  qaScore,
  qaBreakdown,
  qaTrend,
  complianceData,
  granularCompliance,
  escalationData,
  dateRange
}: TeamHealthColumnProps) {
  const pathname = usePathname();
  const isFlipkartRoute = pathname?.startsWith('/flipkart');
  const isSwedbankRoute = pathname?.startsWith('/swedbank');
  const isStandardCharteredRoute = pathname?.startsWith('/standard-chartered');
  const currencySymbol = isFlipkartRoute ? '₹' : isStandardCharteredRoute ? '$' : isSwedbankRoute ? '€' : '€';
  return (
    <div className="flex flex-col h-full min-h-0 min-w-0 w-full">
      <div className="flex-1 flex flex-col min-h-0 gap-4 overflow-hidden">
      {/* AI Auto-Filled Forms - top of first column */}
      <AIAfterCallWork isDarkMode={true} />

      {/* Team Quality Overview */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Team Quality Overview</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="text-center">
            <p className="text-4xl font-bold text-white">{qaScore.toFixed(1)}%</p>
            <p className="text-sm text-muted-foreground">Overall QA Score</p>
          </div>
          
          <div className="space-y-2">
            {Object.entries(qaBreakdown).map(([key, value]) => (
              <div key={key} className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground capitalize">{key}</span>
                <div className="flex items-center gap-2">
                  <div className="w-24 h-2 bg-gray-800 rounded-full overflow-hidden">
                    <div className="h-full bg-linear-to-r from-[#b90abd] to-[#5332ff]" style={{ width: `${value}%` }} />
                  </div>
                  <span className="text-sm font-semibold text-white w-10 text-right">{value}%</span>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
        </Card>

      {/* Escalation Risk Monitor - flex-1 extends upto High-Risk Calls with scrollbar */}
      <Card className="flex-1 min-h-0 flex flex-col overflow-hidden">
        <CardHeader>
          <CardTitle className="text-lg">Escalation Risk Monitor</CardTitle>
          <p className="text-xs text-muted-foreground mt-1">
            AI predicts how likely calls will escalate to supervisors. Lower % = better. Monitor daily to prevent issues.
          </p>
        </CardHeader>
        <CardContent className="flex-1 min-h-0 flex flex-col overflow-hidden">
          <div className="flex-shrink-0">
          {/* Risk Score with Trend */}
          <div className="text-center">
            <div className="h-48 flex items-center justify-center relative">
              <ResponsiveContainer width="100%" height="100%">
                <RadialBarChart cx="50%" cy="50%" innerRadius={60} outerRadius={90} data={[{ value: escalationData.riskScore }]}>
                  <RadialBar 
                    dataKey="value" 
                    fill={escalationData.riskScore >= 50 ? '#ef4444' : escalationData.riskScore >= 30 ? '#f97316' : '#10b981'} 
                    cornerRadius={10}
                  />
                </RadialBarChart>
              </ResponsiveContainer>
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center">
                  <p className="text-4xl font-bold text-white">{escalationData.riskScore.toFixed(1)}%</p>
                  <p className="text-sm font-semibold mt-1" style={{ color: escalationData.riskScore >= 50 ? '#ef4444' : escalationData.riskScore >= 30 ? '#f97316' : '#10b981' }}>
                    {escalationData.riskScore >= 50 ? '🔴 Critical Risk' : escalationData.riskScore >= 30 ? '🟡 High Risk' : '🟢 Low Risk'}
                  </p>
                </div>
              </div>
            </div>
            {/* Trend Indicator with Explanation */}
            {escalationData.trend && escalationData.trend.length >= 2 && (
              <div className="mt-3 bg-white/5 rounded-lg p-3">
                <div className="flex items-center justify-center gap-2 mb-1">
                  {escalationData.trend[escalationData.trend.length - 1] > escalationData.trend[0] ? (
                    <>
                      <TrendingUp className="w-4 h-4 text-red-400" />
                      <span className="text-sm font-semibold text-red-400">Risk is Increasing</span>
                    </>
                  ) : escalationData.trend[escalationData.trend.length - 1] < escalationData.trend[0] ? (
                    <>
                      <TrendingUp className="w-4 h-4 text-green-400 rotate-180" />
                      <span className="text-sm font-semibold text-green-400">Risk is Decreasing</span>
                    </>
                  ) : (
                    <>
                      <span className="text-sm font-semibold text-gray-400">Risk is Stable</span>
                    </>
                  )}
                </div>
                <p className="text-xs text-muted-foreground">
                  Changed from <span className="text-white font-semibold">{escalationData.trend[0].toFixed(1)}%</span> to <span className="text-white font-semibold">{escalationData.trend[escalationData.trend.length - 1].toFixed(1)}%</span> over 7 days
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  {escalationData.trend[escalationData.trend.length - 1] < escalationData.trend[0] 
                    ? '✓ Good news: Risk is going down. Keep monitoring.' 
                    : escalationData.trend[escalationData.trend.length - 1] > escalationData.trend[0]
                    ? '⚠️ Warning: Risk is rising. Review high-risk calls immediately.'
                    : '→ Risk level unchanged. Continue monitoring.'}
                </p>
              </div>
            )}
          </div>
          </div>

          {/* Scrollable section - Key Metrics, Causes, Agents */}
          <div className="flex-1 min-h-0 overflow-y-auto space-y-4 pt-4 border-t border-white/10">
          {/* Key Metrics */}
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-white/5 rounded p-3">
              <p className="text-xs text-muted-foreground mb-1">Calls at Risk</p>
              <p className="text-2xl font-bold text-white">{escalationData.callsAtRisk}</p>
              <p className="text-xs text-muted-foreground mt-1">
                Calls likely to escalate
              </p>
              <p className="text-xs text-orange-400 mt-0.5">⚠️ Review these calls</p>
            </div>
            <div className="bg-white/5 rounded p-3">
              <p className="text-xs text-muted-foreground mb-1">Agents Involved</p>
              <p className="text-2xl font-bold text-white">{escalationData.agentsInvolved.length}</p>
              <p className="text-xs text-muted-foreground mt-1">
                Agents with risky calls
              </p>
              <p className="text-xs text-orange-400 mt-0.5">👤 Need coaching</p>
            </div>
          </div>

          {/* Top Causes with Impact */}
          <div className="pt-2 border-t border-white/10">
            <div className="space-y-2">
              {escalationData.topCauses.map((cause, idx) => {
                // Assign impact percentages (higher for first items)
                const impact = [45, 30, 25][idx] || 15;
                return (
                  <div key={idx} className="space-y-1">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="w-2 h-2 bg-orange-500 rounded-full" />
                        <span className="text-xs text-white">{cause}</span>
                      </div>
                      <span className="text-xs font-semibold text-orange-400">{impact}% of escalations</span>
                    </div>
                    <div className="h-1.5 bg-gray-800 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-linear-to-r from-orange-500 to-orange-400" 
                        style={{ width: `${impact}%` }} 
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Agents List */}
          {escalationData.agentsInvolved.length > 0 && (
            <div className="pt-2 border-t border-white/10">
              <p className="text-xs font-semibold text-muted-foreground mb-2">Agents at Risk:</p>
              <div className="space-y-1">
                {escalationData.agentsInvolved.map((agent, idx) => (
                  <div key={idx} className="flex items-center justify-between text-xs bg-white/5 rounded px-2 py-1">
                    <span className="text-white">{agent}</span>
                    <span className="text-orange-400">Review needed</span>
                  </div>
                ))}
              </div>
            </div>
          )}
          </div>

        </CardContent>
      </Card>
      </div>
    </div>
  );
}

