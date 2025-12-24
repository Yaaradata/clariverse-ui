'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { TrendingUp, Info } from 'lucide-react';
import { InvestmentAdvisoryRisk } from '@/lib/vendor/types';
import { Badge } from '@/components/ui/badge';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

interface InvestmentAdvisoryRiskCardProps {
  data: InvestmentAdvisoryRisk;
  isDarkMode: boolean;
}

export function InvestmentAdvisoryRiskCard({ data, isDarkMode }: InvestmentAdvisoryRiskCardProps) {
  if (!data || !data.hasAdvisoryData) {
    return null;
  }

  const percentage = data.totalAdvisoryConversations > 0
    ? ((data.totalAdvisoryRisks / data.totalAdvisoryConversations) * 100).toFixed(1)
    : '0';

  return (
    <TooltipProvider>
      <Card 
        className="transition-all"
        style={{ 
          backgroundColor: isDarkMode ? '#010101' : '#FFFFFF',
          borderColor: isDarkMode ? 'rgba(239, 68, 68, 0.3)' : 'rgba(239, 68, 68, 0.5)'
        }}
      >
        <CardHeader>
          <CardTitle 
            className="text-lg font-semibold flex items-center gap-2"
            style={{ color: isDarkMode ? '#FFFFFF' : '#1a1a1a' }}
          >
            <TrendingUp className="w-5 h-5" style={{ color: '#ef4444' }} />
            Investment & Advisory Conduct Risk
            <Badge 
              className="text-xs"
              style={{ 
                backgroundColor: isDarkMode ? 'rgba(239, 68, 68, 0.2)' : 'rgba(239, 68, 68, 0.1)',
                color: '#ef4444',
                borderColor: isDarkMode ? 'rgba(239, 68, 68, 0.5)' : 'rgba(239, 68, 68, 0.3)'
              }}
            >
              HIGH
            </Badge>
            <Tooltip>
              <TooltipTrigger asChild>
                <Info 
                  className="w-4 h-4 cursor-help" 
                  style={{ color: isDarkMode ? '#9ca3af' : '#6b7280' }}
                />
              </TooltipTrigger>
              <TooltipContent>
                <p className="text-sm">
                  Advisory conversations flagged for suitability, market conduct, or AML escalation risk.
                </p>
              </TooltipContent>
            </Tooltip>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Primary Metric */}
          <div 
            className="text-center p-4 rounded-lg"
            style={{ 
              backgroundColor: isDarkMode ? 'rgba(239, 68, 68, 0.1)' : 'rgba(239, 68, 68, 0.05)',
              borderColor: isDarkMode ? 'rgba(239, 68, 68, 0.3)' : 'rgba(239, 68, 68, 0.2)',
              borderWidth: '1px',
              borderStyle: 'solid'
            }}
          >
            <div 
              className="text-4xl font-bold mb-1"
              style={{ color: isDarkMode ? '#FFFFFF' : '#1a1a1a' }}
            >
              {data.totalAdvisoryRisks}
            </div>
            <div 
              className="text-sm"
              style={{ color: isDarkMode ? '#9ca3af' : '#6b7280' }}
            >
              Advisory Risk Signals
            </div>
            <div 
              className="text-xs mt-1"
              style={{ color: isDarkMode ? '#6b7280' : '#9ca3af' }}
            >
              {percentage}% of {data.totalAdvisoryConversations} total advisory conversations
            </div>
          </div>

          {/* Vendor Signals */}
          <div 
            className="space-y-3 pt-4"
            style={{ borderTopColor: isDarkMode ? '#1f2937' : '#e5e7eb', borderTopWidth: '1px', borderTopStyle: 'solid' }}
          >
            <div 
              className="text-sm font-semibold mb-3"
              style={{ color: isDarkMode ? '#FFFFFF' : '#1a1a1a' }}
            >
              Vendor-Deliverable Signals
            </div>
            
            {/* Omilia */}
            <div 
              className="p-3 rounded-lg"
              style={{ 
                backgroundColor: isDarkMode ? 'rgba(59, 130, 246, 0.1)' : 'rgba(59, 130, 246, 0.05)',
                borderColor: isDarkMode ? 'rgba(59, 130, 246, 0.3)' : 'rgba(59, 130, 246, 0.2)',
                borderWidth: '1px',
                borderStyle: 'solid'
              }}
            >
              <div className="flex items-center gap-2 mb-2">
                <Badge 
                  style={{ 
                    backgroundColor: isDarkMode ? 'rgba(59, 130, 246, 0.2)' : 'rgba(59, 130, 246, 0.1)',
                    color: '#3b82f6',
                    borderColor: isDarkMode ? 'rgba(59, 130, 246, 0.5)' : 'rgba(59, 130, 246, 0.3)'
                  }}
                >
                  Omilia
                </Badge>
              </div>
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div style={{ color: isDarkMode ? '#9ca3af' : '#6b7280' }}>
                  Suitability mismatch: <span style={{ color: isDarkMode ? '#FFFFFF' : '#1a1a1a', fontWeight: '600' }}>{data.vendorSignals.omilia.suitabilityMismatch}</span>
                </div>
                <div style={{ color: isDarkMode ? '#9ca3af' : '#6b7280' }}>
                  Pressure tactics: <span style={{ color: isDarkMode ? '#FFFFFF' : '#1a1a1a', fontWeight: '600' }}>{data.vendorSignals.omilia.pressureTactics}</span>
                </div>
                <div style={{ color: isDarkMode ? '#9ca3af' : '#6b7280' }}>
                  Insider hints: <span style={{ color: isDarkMode ? '#FFFFFF' : '#1a1a1a', fontWeight: '600' }}>{data.vendorSignals.omilia.insiderInformationHints}</span>
                </div>
              </div>
            </div>

            {/* LexisNexis */}
            <div 
              className="p-3 rounded-lg"
              style={{ 
                backgroundColor: isDarkMode ? 'rgba(34, 197, 94, 0.1)' : 'rgba(34, 197, 94, 0.05)',
                borderColor: isDarkMode ? 'rgba(34, 197, 94, 0.3)' : 'rgba(34, 197, 94, 0.2)',
                borderWidth: '1px',
                borderStyle: 'solid'
              }}
            >
              <div className="flex items-center gap-2 mb-2">
                <Badge 
                  style={{ 
                    backgroundColor: isDarkMode ? 'rgba(34, 197, 94, 0.2)' : 'rgba(34, 197, 94, 0.1)',
                    color: '#22c55e',
                    borderColor: isDarkMode ? 'rgba(34, 197, 94, 0.5)' : 'rgba(34, 197, 94, 0.3)'
                  }}
                >
                  LexisNexis
                </Badge>
              </div>
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div style={{ color: isDarkMode ? '#9ca3af' : '#6b7280' }}>
                  Source of funds risk: <span style={{ color: isDarkMode ? '#FFFFFF' : '#1a1a1a', fontWeight: '600' }}>{data.vendorSignals.lexisnexis.sourceOfFundsRisk}</span>
                </div>
                <div style={{ color: isDarkMode ? '#9ca3af' : '#6b7280' }}>
                  PEP/Adverse: <span style={{ color: isDarkMode ? '#FFFFFF' : '#1a1a1a', fontWeight: '600' }}>{data.vendorSignals.lexisnexis.pepAdverseContext}</span>
                </div>
              </div>
            </div>

            {/* Pindrop (Optional) */}
            {data.vendorSignals.pindrop && (
              <div 
                className="p-3 rounded-lg"
                style={{ 
                  backgroundColor: isDarkMode ? 'rgba(168, 85, 247, 0.1)' : 'rgba(168, 85, 247, 0.05)',
                  borderColor: isDarkMode ? 'rgba(168, 85, 247, 0.3)' : 'rgba(168, 85, 247, 0.2)',
                  borderWidth: '1px',
                  borderStyle: 'solid'
                }}
              >
                <div className="flex items-center gap-2 mb-2">
                  <Badge 
                    style={{ 
                      backgroundColor: isDarkMode ? 'rgba(168, 85, 247, 0.2)' : 'rgba(168, 85, 247, 0.1)',
                      color: '#a855f7',
                      borderColor: isDarkMode ? 'rgba(168, 85, 247, 0.5)' : 'rgba(168, 85, 247, 0.3)'
                    }}
                  >
                    Pindrop
                  </Badge>
                  <Badge 
                    className="text-xs"
                    style={{ 
                      backgroundColor: isDarkMode ? 'rgba(107, 114, 128, 0.2)' : 'rgba(107, 114, 128, 0.1)',
                      color: isDarkMode ? '#9ca3af' : '#6b7280',
                      borderColor: isDarkMode ? 'rgba(107, 114, 128, 0.5)' : 'rgba(107, 114, 128, 0.3)'
                    }}
                  >
                    Optional
                  </Badge>
                </div>
                <div className="text-xs" style={{ color: isDarkMode ? '#9ca3af' : '#6b7280' }}>
                  Voice pressure patterns: <span style={{ color: isDarkMode ? '#FFFFFF' : '#1a1a1a', fontWeight: '600' }}>{data.vendorSignals.pindrop.voicePressurePatterns}</span>
                </div>
              </div>
            )}
          </div>

          {/* Integration Outcomes */}
          <div 
            className="pt-4"
            style={{ borderTopColor: isDarkMode ? '#1f2937' : '#e5e7eb', borderTopWidth: '1px', borderTopStyle: 'solid' }}
          >
            <div 
              className="text-sm font-semibold mb-3"
              style={{ color: isDarkMode ? '#FFFFFF' : '#1a1a1a' }}
            >
              Integration Outcomes
            </div>
            <div className="grid grid-cols-3 gap-2">
              <div 
                className="p-2 rounded"
                style={{ 
                  backgroundColor: isDarkMode ? 'rgba(249, 115, 22, 0.1)' : 'rgba(249, 115, 22, 0.05)',
                  borderColor: isDarkMode ? 'rgba(249, 115, 22, 0.3)' : 'rgba(249, 115, 22, 0.2)',
                  borderWidth: '1px',
                  borderStyle: 'solid'
                }}
              >
                <div className="text-xs" style={{ color: isDarkMode ? '#9ca3af' : '#6b7280' }}>Trade Surveillance</div>
                <div className="text-lg font-bold" style={{ color: '#f97316' }}>{data.integrationOutcomes.tradeSurveillanceFlags}</div>
              </div>
              <div 
                className="p-2 rounded"
                style={{ 
                  backgroundColor: isDarkMode ? 'rgba(59, 130, 246, 0.1)' : 'rgba(59, 130, 246, 0.05)',
                  borderColor: isDarkMode ? 'rgba(59, 130, 246, 0.3)' : 'rgba(59, 130, 246, 0.2)',
                  borderWidth: '1px',
                  borderStyle: 'solid'
                }}
              >
                <div className="text-xs" style={{ color: isDarkMode ? '#9ca3af' : '#6b7280' }}>Reg BI Reviews</div>
                <div className="text-lg font-bold" style={{ color: '#3b82f6' }}>{data.integrationOutcomes.regBISuitabilityReviews}</div>
              </div>
              <div 
                className="p-2 rounded"
                style={{ 
                  backgroundColor: isDarkMode ? 'rgba(239, 68, 68, 0.1)' : 'rgba(239, 68, 68, 0.05)',
                  borderColor: isDarkMode ? 'rgba(239, 68, 68, 0.3)' : 'rgba(239, 68, 68, 0.2)',
                  borderWidth: '1px',
                  borderStyle: 'solid'
                }}
              >
                <div className="text-xs" style={{ color: isDarkMode ? '#9ca3af' : '#6b7280' }}>AML Escalations</div>
                <div className="text-lg font-bold" style={{ color: '#ef4444' }}>{data.integrationOutcomes.amlEscalations}</div>
              </div>
            </div>
          </div>

        </CardContent>
      </Card>
    </TooltipProvider>
  );
}

