'use client';

import { Card, CardHeader, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { GranularComplianceScore } from '@/lib/voiceData';

interface ComplianceHealthSummaryCardProps {
  granularCompliance: GranularComplianceScore;
  isDarkMode?: boolean;
  currencySymbol?: string;
}

export function ComplianceHealthSummaryCard({
  granularCompliance,
  isDarkMode = true,
  currencySymbol = '€',
}: ComplianceHealthSummaryCardProps) {
  const getColor = (score: number) => {
    if (score >= 90) return 'text-green-400';
    if (score >= 80) return 'text-yellow-400';
    if (score >= 70) return 'text-orange-400';
    return 'text-red-400';
  };

  const getBarColor = (score: number) => {
    if (score >= 90) return 'bg-green-500';
    if (score >= 80) return 'bg-yellow-500';
    if (score >= 70) return 'bg-orange-500';
    return 'bg-red-500';
  };

  const riskLevelColor =
    granularCompliance.riskLevel === 'critical'
      ? 'text-red-400'
      : granularCompliance.riskLevel === 'high'
        ? 'text-orange-400'
        : granularCompliance.riskLevel === 'medium'
          ? 'text-yellow-400'
          : 'text-green-400';

  return (
    <Card
      className="border border-white/10 bg-black/30 shadow-lg"
      style={{
        backgroundColor: isDarkMode ? 'rgba(0,0,0,0.3)' : undefined,
        borderColor: isDarkMode ? 'rgba(255,255,255,0.1)' : undefined,
      }}
    >
      <CardHeader>
        <div className="flex items-center justify-between">
          <h3
            className="text-2xl font-semibold leading-none tracking-tight text-lg"
            style={{ color: isDarkMode ? '#fff' : '#1a1a1a' }}
          >
            Compliance Health
          </h3>
          <div className="text-right">
            <div
              className="text-2xl font-bold"
              style={{ color: isDarkMode ? '#fff' : '#1a1a1a' }}
            >
              {granularCompliance.overallScore.toFixed(1)}%
            </div>
            <div className="text-xs text-muted-foreground">Overall Score</div>
          </div>
        </div>
        <p className="text-xs text-muted-foreground mt-2">
          Expected Loss: {currencySymbol}
          {(granularCompliance.financialRisk.expectedLoss / 1000000).toFixed(1)}M | Risk Level:{' '}
          <span className={`font-semibold ${riskLevelColor}`}>
            {granularCompliance.riskLevel.toUpperCase()}
          </span>
        </p>
      </CardHeader>
      <CardContent className="p-6 pt-0 space-y-4 max-h-[420px] overflow-y-auto pr-2">
        {/* Regulation Breakdown */}
        <div className="space-y-3">
          {Object.entries(granularCompliance.byRegulation).map(([key, regulation]) => (
            <div key={key} className="bg-gray-800/50 rounded-lg p-3 border border-gray-700">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-sm font-semibold text-white">{regulation.label}</span>
                  {regulation.unit && (
                    <Badge
                      variant="outline"
                      className="text-[10px] border-blue-500/40 text-blue-400 bg-blue-500/10"
                    >
                      {regulation.unit}
                    </Badge>
                  )}
                  <Badge
                    className="bg-white/10 text-xs text-white/80 border border-white/10"
                    title={regulation.regulatoryReference}
                  >
                    {regulation.violations} voice flags
                  </Badge>
                  {regulation.criticalViolations > 0 && (
                    <Badge className="bg-red-500/20 text-red-400 border-red-500/50">
                      {regulation.criticalViolations} critical
                    </Badge>
                  )}
                </div>
                <div className="text-right">
                  <div className={`text-lg font-bold ${getColor(regulation.score)}`}>
                    {regulation.score.toFixed(1)}%
                  </div>
                  <div className="text-xs text-muted-foreground">
                    Weight: {(regulation.weight * 100).toFixed(0)}%
                  </div>
                </div>
              </div>
              <div className="w-full bg-gray-700 rounded-full h-2">
                <div
                  className={`h-2 rounded-full ${getBarColor(regulation.score)}`}
                  style={{ width: `${regulation.score}%` }}
                />
              </div>
              <div className="mt-2 grid grid-cols-1 gap-1">
                {regulation.focusAreas.map((area) => (
                  <div
                    key={area.label}
                    className="flex items-center justify-between text-xs text-muted-foreground bg-white/5 border border-white/10 rounded px-2 py-1"
                  >
                    <span>{area.label}</span>
                    <span className={getColor(area.score)}>{area.score}%</span>
                  </div>
                ))}
              </div>
              <div className="mt-2 text-[10px] text-white/40 uppercase tracking-wide">
                Transcript cues: {regulation.transcriptSignals.join(' • ')}
              </div>
            </div>
          ))}
        </div>

        {/* Financial Risk Summary */}
        <div className="pt-3 border-t border-white/10">
          <div className="grid grid-cols-3 gap-2">
            <div className="bg-gray-800/50 rounded p-2">
              <div className="text-xs text-muted-foreground mb-1">Potential Fines</div>
              <div className="text-sm font-semibold text-red-400">
                {currencySymbol}
                {(granularCompliance.financialRisk.totalPotentialFines / 1000000).toFixed(0)}M
              </div>
            </div>
            <div className="bg-gray-800/50 rounded p-2">
              <div className="text-xs text-muted-foreground mb-1">Expected Loss</div>
              <div className="text-sm font-semibold text-orange-400">
                {currencySymbol}
                {(granularCompliance.financialRisk.expectedLoss / 1000000).toFixed(1)}M
              </div>
            </div>
            <div className="bg-gray-800/50 rounded p-2">
              <div className="text-xs text-muted-foreground mb-1">Worst Case</div>
              <div className="text-sm font-semibold text-red-400">
                {currencySymbol}
                {(granularCompliance.financialRisk.worstCaseScenario / 1000000).toFixed(0)}M
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
