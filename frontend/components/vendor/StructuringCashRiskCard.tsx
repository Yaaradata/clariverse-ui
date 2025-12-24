'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Coins, Info } from 'lucide-react';
import { StructuringCashRisk } from '@/lib/vendor/types';
import { Badge } from '@/components/ui/badge';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

interface StructuringCashRiskCardProps {
  data: StructuringCashRisk;
  isDarkMode: boolean;
}

export function StructuringCashRiskCard({ data, isDarkMode }: StructuringCashRiskCardProps) {
  if (!data || !data.hasCashData) {
    return null;
  }

  const percentage = data.totalCashConversations > 0
    ? ((data.totalStructuringEvents / data.totalCashConversations) * 100).toFixed(1)
    : '0';

  return (
    <TooltipProvider>
      <Card 
        className="transition-all"
        style={{ 
          backgroundColor: isDarkMode ? '#010101' : '#FFFFFF',
          borderColor: isDarkMode ? 'rgba(249, 115, 22, 0.3)' : 'rgba(249, 115, 22, 0.5)'
        }}
      >
        <CardHeader>
          <CardTitle 
            className="text-lg font-semibold flex items-center gap-2"
            style={{ color: isDarkMode ? '#FFFFFF' : '#1a1a1a' }}
          >
            <Coins className="w-5 h-5" style={{ color: '#f97316' }} />
            Structuring & Large Cash Risk Events
            <Badge 
              className="text-xs"
              style={{ 
                backgroundColor: isDarkMode ? 'rgba(249, 115, 22, 0.2)' : 'rgba(249, 115, 22, 0.1)',
                color: '#f97316',
                borderColor: isDarkMode ? 'rgba(249, 115, 22, 0.5)' : 'rgba(249, 115, 22, 0.3)'
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
                  Customer conversations indicating CTR evasion or structuring intent.
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
              backgroundColor: isDarkMode ? 'rgba(249, 115, 22, 0.1)' : 'rgba(249, 115, 22, 0.05)',
              borderColor: isDarkMode ? 'rgba(249, 115, 22, 0.3)' : 'rgba(249, 115, 22, 0.2)',
              borderWidth: '1px',
              borderStyle: 'solid'
            }}
          >
            <div 
              className="text-4xl font-bold mb-1"
              style={{ color: isDarkMode ? '#FFFFFF' : '#1a1a1a' }}
            >
              {data.totalStructuringEvents}
            </div>
            <div 
              className="text-sm"
              style={{ color: isDarkMode ? '#9ca3af' : '#6b7280' }}
            >
              Structuring Events Detected
            </div>
            <div 
              className="text-xs mt-1"
              style={{ color: isDarkMode ? '#6b7280' : '#9ca3af' }}
            >
              {percentage}% of {data.totalCashConversations} total cash conversations
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
                  Reporting limit Qs: <span style={{ color: isDarkMode ? '#FFFFFF' : '#1a1a1a', fontWeight: '600' }}>{data.vendorSignals.omilia.reportingLimitQuestions}</span>
                </div>
                <div style={{ color: isDarkMode ? '#9ca3af' : '#6b7280' }}>
                  Multi-transaction: <span style={{ color: isDarkMode ? '#FFFFFF' : '#1a1a1a', fontWeight: '600' }}>{data.vendorSignals.omilia.multipleTransactionPlanning}</span>
                </div>
                <div style={{ color: isDarkMode ? '#9ca3af' : '#6b7280' }}>
                  Source ambiguity: <span style={{ color: isDarkMode ? '#FFFFFF' : '#1a1a1a', fontWeight: '600' }}>{data.vendorSignals.omilia.sourceOfFundsAmbiguity}</span>
                </div>
              </div>
            </div>

            {/* Pindrop */}
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
              </div>
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div style={{ color: isDarkMode ? '#9ca3af' : '#6b7280' }}>
                  Nervousness/stress: <span style={{ color: isDarkMode ? '#FFFFFF' : '#1a1a1a', fontWeight: '600' }}>{data.vendorSignals.pindrop.nervousnessStressIndicators}</span>
                </div>
                <div style={{ color: isDarkMode ? '#9ca3af' : '#6b7280' }}>
                  Repeated inquiries: <span style={{ color: isDarkMode ? '#FFFFFF' : '#1a1a1a', fontWeight: '600' }}>{data.vendorSignals.pindrop.repeatedInquiryPatterns}</span>
                </div>
              </div>
            </div>
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
                <div className="text-xs" style={{ color: isDarkMode ? '#9ca3af' : '#6b7280' }}>Structuring Alerts</div>
                <div className="text-lg font-bold" style={{ color: '#f97316' }}>{data.integrationOutcomes.structuringAlerts}</div>
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
                <div className="text-xs" style={{ color: isDarkMode ? '#9ca3af' : '#6b7280' }}>CTR Enrichment</div>
                <div className="text-lg font-bold" style={{ color: '#3b82f6' }}>{data.integrationOutcomes.ctrNarrativeEnrichment}</div>
              </div>
              <div 
                className="p-2 rounded"
                style={{ 
                  backgroundColor: isDarkMode ? 'rgba(234, 179, 8, 0.1)' : 'rgba(234, 179, 8, 0.05)',
                  borderColor: isDarkMode ? 'rgba(234, 179, 8, 0.3)' : 'rgba(234, 179, 8, 0.2)',
                  borderWidth: '1px',
                  borderStyle: 'solid'
                }}
              >
                <div className="text-xs" style={{ color: isDarkMode ? '#9ca3af' : '#6b7280' }}>Branch Alerts</div>
                <div className="text-lg font-bold" style={{ color: '#eab308' }}>{data.integrationOutcomes.branchManagerAlerts}</div>
              </div>
            </div>
          </div>

        </CardContent>
      </Card>
    </TooltipProvider>
  );
}

