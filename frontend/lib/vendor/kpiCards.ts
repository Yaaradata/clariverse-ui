// KPI Card Configuration and Mapping
import { VendorDashboardData } from './types';
import { 
  Send, 
  UserPlus, 
  DollarSign, 
  Settings, 
  AlertCircle, 
  TrendingUp,
  type LucideIcon
} from 'lucide-react';

export type KPICardCategory = 'Risk' | 'Compliance';

export interface IntegrationOutcome {
  label: string;
  value: number;
  color: string;
}

export interface KPICardConfig {
  id: string;
  title: string;
  category: KPICardCategory;
  icon: LucideIcon;
  color: string;
  riskCount: number;
  totalCount: number;
  integrationOutcomes: IntegrationOutcome[];
  description: string;
}

/**
 * Maps VendorDashboardData to KPI Card configurations
 * @param data - The vendor dashboard data
 * @returns Array of KPI card configurations
 */
export function getKPICards(data: VendorDashboardData): KPICardConfig[] {
  return [
    {
      id: 'wire-transfer',
      title: 'High-Risk Wire Transfer Conversations',
      category: 'Risk',
      icon: Send,
      color: 'bg-red-500',
      riskCount: data.wireTransferRisk.totalHighRiskWires,
      totalCount: data.wireTransferRisk.totalWireConversations,
      integrationOutcomes: [
        { label: 'Wire Holds', value: data.wireTransferRisk.integrationOutcomes.wireHoldAlerts, color: '#eab308' },
        { label: 'SAR Candidates', value: data.wireTransferRisk.integrationOutcomes.sarRecommendationCandidates, color: '#f97316' },
        { label: 'Risk Elevated', value: data.wireTransferRisk.integrationOutcomes.customerRiskScoreElevation, color: '#ef4444' }
      ],
      description: 'High-risk wire transfer conversations detected'
    },
    {
      id: 'account-change',
      title: 'High-Risk Account Change Requests',
      category: 'Risk',
      icon: Settings,
      color: 'bg-purple-500',
      riskCount: data.accountChangeRisk.totalHighRiskChanges,
      totalCount: data.accountChangeRisk.totalChangeRequests,
      integrationOutcomes: [
        { label: 'Verification Holds', value: data.accountChangeRisk.integrationOutcomes.changeVerificationHolds, color: '#eab308' },
        { label: 'Takeover Alerts', value: data.accountChangeRisk.integrationOutcomes.accountTakeoverAlerts, color: '#ef4444' },
        { label: 'Out-of-Band Notify', value: data.accountChangeRisk.integrationOutcomes.ownerOutOfBandNotifications, color: '#3b82f6' }
      ],
      description: 'High-risk account change requests'
    },
    {
      id: 'structuring-cash',
      title: 'Structuring & Large Cash Risk Events',
      category: 'Risk',
      icon: DollarSign,
      color: 'bg-yellow-500',
      riskCount: data.structuringCashRisk.totalStructuringEvents,
      totalCount: data.structuringCashRisk.totalCashConversations,
      integrationOutcomes: [
        { label: 'Structuring Alerts', value: data.structuringCashRisk.integrationOutcomes.structuringAlerts, color: '#eab308' },
        { label: 'CTR Enrichment', value: data.structuringCashRisk.integrationOutcomes.ctrNarrativeEnrichment, color: '#3b82f6' },
        { label: 'Branch Alerts', value: data.structuringCashRisk.integrationOutcomes.branchManagerAlerts, color: '#f97316' }
      ],
      description: 'Structuring & large cash risk events'
    },
    {
      id: 'complaint-elder',
      title: 'Complaint-Driven Risk & Elder Exploitation',
      category: 'Risk',
      icon: AlertCircle,
      color: 'bg-pink-500',
      riskCount: data.complaintElderRisk.totalComplaintRisks,
      totalCount: data.complaintElderRisk.totalComplaintInteractions,
      integrationOutcomes: [
        { label: 'Regulatory Flags', value: data.complaintElderRisk.integrationOutcomes.regulatoryComplaintFlags, color: '#eab308' },
        { label: 'Elder Abuse Reports', value: data.complaintElderRisk.integrationOutcomes.elderAbuseReports, color: '#ef4444' },
        { label: 'Scam Holds', value: data.complaintElderRisk.integrationOutcomes.scamPreventionHolds, color: '#a855f7' }
      ],
      description: 'Complaint-driven risk & elder exploitation signals'
    },
    {
      id: 'account-opening',
      title: 'Risky New Account Openings',
      category: 'Compliance',
      icon: UserPlus,
      color: 'bg-orange-500',
      riskCount: data.accountOpeningRisk.totalRiskyOpenings,
      totalCount: data.accountOpeningRisk.totalOnboardingAttempts,
      integrationOutcomes: [
        { label: 'EDD Triggers', value: data.accountOpeningRisk.integrationOutcomes.eddTriggers, color: '#eab308' },
        { label: 'Onboarding Holds', value: data.accountOpeningRisk.integrationOutcomes.onboardingHolds, color: '#ef4444' },
        { label: 'Money Mule Flags', value: data.accountOpeningRisk.integrationOutcomes.moneyMuleFlags, color: '#f97316' }
      ],
      description: 'Risky new account openings detected'
    },
    {
      id: 'investment-advisory',
      title: 'Investment / Advisory Conduct Risk',
      category: 'Compliance',
      icon: TrendingUp,
      color: 'bg-blue-500',
      riskCount: data.investmentAdvisoryRisk.totalAdvisoryRisks,
      totalCount: data.investmentAdvisoryRisk.totalAdvisoryConversations,
      integrationOutcomes: [
        { label: 'Trade Surveillance', value: data.investmentAdvisoryRisk.integrationOutcomes.tradeSurveillanceFlags, color: '#eab308' },
        { label: 'Reg BI Reviews', value: data.investmentAdvisoryRisk.integrationOutcomes.regBISuitabilityReviews, color: '#3b82f6' },
        { label: 'AML Escalations', value: data.investmentAdvisoryRisk.integrationOutcomes.amlEscalations, color: '#ef4444' }
      ],
      description: 'Investment & advisory conduct risk'
    }
  ];
}

