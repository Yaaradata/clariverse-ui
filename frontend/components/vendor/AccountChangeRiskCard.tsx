'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Settings, Info } from 'lucide-react';
import { AccountChangeRisk } from '@/lib/vendor/types';
import { Badge } from '@/components/ui/badge';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

interface AccountChangeRiskCardProps {
  data: AccountChangeRisk;
  isDarkMode: boolean;
}

export function AccountChangeRiskCard({ data, isDarkMode }: AccountChangeRiskCardProps) {
  if (!data || !data.hasChangeData) {
    return null;
  }

  const percentage = data.totalChangeRequests > 0
    ? ((data.totalHighRiskChanges / data.totalChangeRequests) * 100).toFixed(1)
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
            <Settings className="w-5 h-5" style={{ color: '#ef4444' }} />
            High-Risk Account Change Requests
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
                  Account modification requests flagged for account takeover or ownership abuse.
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
              {data.totalHighRiskChanges}
            </div>
            <div 
              className="text-sm"
              style={{ color: isDarkMode ? '#9ca3af' : '#6b7280' }}
            >
              High-Risk Change Requests
            </div>
            <div 
              className="text-xs mt-1"
              style={{ color: isDarkMode ? '#6b7280' : '#9ca3af' }}
            >
              {percentage}% of {data.totalChangeRequests} total change requests
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
                  Beneficiary change: <span style={{ color: isDarkMode ? '#FFFFFF' : '#1a1a1a', fontWeight: '600' }}>{data.vendorSignals.omilia.beneficiaryChangeIntent}</span>
                </div>
                <div style={{ color: isDarkMode ? '#9ca3af' : '#6b7280' }}>
                  Urgent access: <span style={{ color: isDarkMode ? '#FFFFFF' : '#1a1a1a', fontWeight: '600' }}>{data.vendorSignals.omilia.urgentAccessRequests}</span>
                </div>
                <div style={{ color: isDarkMode ? '#9ca3af' : '#6b7280' }}>
                  Rapid changes: <span style={{ color: isDarkMode ? '#FFFFFF' : '#1a1a1a', fontWeight: '600' }}>{data.vendorSignals.omilia.multipleRapidChanges}</span>
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
                  Voice mismatch: <span style={{ color: isDarkMode ? '#FFFFFF' : '#1a1a1a', fontWeight: '600' }}>{data.vendorSignals.pindrop.voiceMismatch}</span>
                </div>
                <div style={{ color: isDarkMode ? '#9ca3af' : '#6b7280' }}>
                  Takeover behavior: <span style={{ color: isDarkMode ? '#FFFFFF' : '#1a1a1a', fontWeight: '600' }}>{data.vendorSignals.pindrop.takeoverBehavior}</span>
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
                  High-risk address: <span style={{ color: isDarkMode ? '#FFFFFF' : '#1a1a1a', fontWeight: '600' }}>{data.vendorSignals.lexisnexis.addressChangesHighRisk}</span>
                </div>
                <div style={{ color: isDarkMode ? '#9ca3af' : '#6b7280' }}>
                  Identity issues: <span style={{ color: isDarkMode ? '#FFFFFF' : '#1a1a1a', fontWeight: '600' }}>{data.vendorSignals.lexisnexis.identityRelationshipInconsistencies}</span>
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
                  backgroundColor: isDarkMode ? 'rgba(234, 179, 8, 0.1)' : 'rgba(234, 179, 8, 0.05)',
                  borderColor: isDarkMode ? 'rgba(234, 179, 8, 0.3)' : 'rgba(234, 179, 8, 0.2)',
                  borderWidth: '1px',
                  borderStyle: 'solid'
                }}
              >
                <div className="text-xs" style={{ color: isDarkMode ? '#9ca3af' : '#6b7280' }}>Verification Holds</div>
                <div className="text-lg font-bold" style={{ color: '#eab308' }}>{data.integrationOutcomes.changeVerificationHolds}</div>
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
                <div className="text-xs" style={{ color: isDarkMode ? '#9ca3af' : '#6b7280' }}>Takeover Alerts</div>
                <div className="text-lg font-bold" style={{ color: '#ef4444' }}>{data.integrationOutcomes.accountTakeoverAlerts}</div>
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
                <div className="text-xs" style={{ color: isDarkMode ? '#9ca3af' : '#6b7280' }}>Out-of-Band Notify</div>
                <div className="text-lg font-bold" style={{ color: '#3b82f6' }}>{data.integrationOutcomes.ownerOutOfBandNotifications}</div>
              </div>
            </div>
          </div>

        </CardContent>
      </Card>
    </TooltipProvider>
  );
}

