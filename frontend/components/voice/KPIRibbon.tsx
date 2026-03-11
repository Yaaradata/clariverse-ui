'use client';

import { Card, CardContent } from '@/components/ui/card';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { KPIData } from '@/lib/voiceData';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';

interface KPIRibbonProps {
  data: KPIData;
}

export function KPIRibbon({ data }: KPIRibbonProps) {
  const complianceCategories = Object.values(data.euComplianceScore.byRegulation);
  const primaryComplianceCategory = complianceCategories[0];
  const complianceTrend = primaryComplianceCategory && primaryComplianceCategory.trend.length > 1
    ? primaryComplianceCategory.trend[primaryComplianceCategory.trend.length - 1] > primaryComplianceCategory.trend[0]
      ? 'up'
      : primaryComplianceCategory.trend[primaryComplianceCategory.trend.length - 1] < primaryComplianceCategory.trend[0]
        ? 'down'
        : 'stable'
    : 'stable';

  const kpis = [
    {
      label: 'Team QA Score',
      description: 'Overall communication quality score calculated from compliance adherence, empathy, tone, resolution accuracy, and listening patterns. Higher scores indicate better team performance.',
      value: data.overallTeamQAScore.value.toFixed(1),
      unit: '%',
      trend: data.overallTeamQAScore.trend[6] > data.overallTeamQAScore.trend[0] ? 'up' : 'down',
      subtitle: null,
      tooltipExtra: null
    },
    {
      label: 'Compliance Score',
      description: 'Weighted compliance score built from transcript-detectable checks: consent disclosures, identity challenges, sanctions refusals, and suitability conversations.',
      value: data.euComplianceScore.overallScore.toFixed(1),
      unit: '%',
      trend: complianceTrend,
      subtitle: null,
      tooltipExtra: null
    },
    {
      label: 'Customer Emotion',
      description: 'Aggregated emotional state of customers based on AI sentiment analysis. Scale 1-5; lower = happier.',
      value: data.customerEmotionIndex.value.toFixed(1),
      unit: ' /5',
      trend: data.customerEmotionIndex.trend[6] < data.customerEmotionIndex.trend[0] ? 'up' : 'down',
      subtitle: null,
      tooltipExtra: null
    },
    {
      label: 'High-Risk Calls',
      description: 'Number of calls flagged as critical or risky due to escalation likelihood, angry customers, or compliance violations.',
      value: data.highRiskCallsCount.value.toString(),
      unit: '',
      trend: data.highRiskCallsCount.trend,
      subtitle: null,
      tooltipExtra: null
    },
    {
      label: 'Escalation Risk',
      description: 'AI-predicted probability of call escalations based on customer sentiment, agent behavior, and call patterns. Lower = better.',
      value: data.escalationRiskScore.value.toFixed(1),
      unit: '%',
      trend: 'down' as const,
      subtitle: null,
      tooltipExtra: null
    },
    {
      label: 'Total Calls',
      description: 'Total calls handled by the team during the selected timeframe.',
      value: data.totalCallsHandled.value.toString(),
      unit: ' calls',
      trend: 'up' as const,
      subtitle: null,
      tooltipExtra: null
    }
  ];

  const TrendIcon = ({ trend }: { trend: string }) => {
    if (trend === 'up') return <TrendingUp className="w-3 h-3 text-green-500" />;
    if (trend === 'down') return <TrendingDown className="w-3 h-3 text-red-500" />;
    return <Minus className="w-3 h-3 text-gray-500" />;
  };

  return (
    <TooltipProvider>
      <div className="grid grid-cols-6 gap-3 mb-6">
        {kpis.map((kpi, idx) => (
          <Tooltip key={idx}>
            <TooltipTrigger asChild>
              <Card className="p-3 cursor-help relative hover:border-white/20 transition-colors">
                <div className="absolute top-2 left-2 text-lg">✨</div>
                <CardContent className="p-0 space-y-1.5">
                  <div className="flex flex-col items-center justify-center text-center">
                    <div className="flex items-center gap-1.5">
                      <p className="text-2xl font-bold text-white">{kpi.value}{kpi.unit}</p>
                      <TrendIcon trend={kpi.trend} />
                    </div>
                    <p className="text-xs text-muted-foreground mt-0.5">{kpi.label}</p>
                    {kpi.subtitle && (
                      <p className="text-[10px] text-muted-foreground/80 mt-1 line-clamp-2 px-1">
                        {kpi.subtitle}
                      </p>
                    )}
                  </div>
                </CardContent>
              </Card>
            </TooltipTrigger>
            <TooltipContent side="top" className="max-w-sm">
              <p className="font-semibold mb-1">{kpi.label}</p>
              <p className="text-sm text-muted-foreground">{kpi.description}</p>
              {kpi.tooltipExtra}
            </TooltipContent>
          </Tooltip>
        ))}
      </div>
    </TooltipProvider>
  );
}
