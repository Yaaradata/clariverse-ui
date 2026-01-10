// Vendor Signals Mapping for Bar Charts
import { VendorDashboardData } from './types';

export interface VendorSignalSegment {
  vendor: string;
  label: string;
  value: number;
  color: string;
  details: Array<{ label: string; value: number; color: string }>;
}

export interface VendorSignalData {
  kpiId: string;
  kpiTitle: string;
  segments: VendorSignalSegment[];
}

/**
 * Maps VendorDashboardData to vendor signal bar chart data
 * @param data - The vendor dashboard data
 * @returns Array of vendor signal data for each KPI
 */
export function getVendorSignalsData(data: VendorDashboardData): VendorSignalData[] {
  return [
    {
      kpiId: 'wire-transfer',
      kpiTitle: 'High-Risk Wire Transfer Conversations',
      segments: [
        {
          vendor: 'Omilia',
          label: 'Omilia',
          value: Object.values(data.wireTransferRisk.vendorSignals.omilia).reduce((sum, val) => sum + val, 0),
          color: '#3b82f6',
          details: [
            { label: 'Wire Intent', value: data.wireTransferRisk.vendorSignals.omilia.wireIntent, color: '#2563eb' },
            { label: 'Structuring Language', value: data.wireTransferRisk.vendorSignals.omilia.structuringLanguage, color: '#3b82f6' },
            { label: 'Urgency w/o Rationale', value: data.wireTransferRisk.vendorSignals.omilia.urgencyWithoutRationale, color: '#60a5fa' },
            { label: 'Third-party Sender', value: data.wireTransferRisk.vendorSignals.omilia.thirdPartySender, color: '#93c5fd' }
          ]
        },
        {
          vendor: 'LexisNexis',
          label: 'LexisNexis',
          value: Object.values(data.wireTransferRisk.vendorSignals.lexisnexis).reduce((sum, val) => sum + val, 0),
          color: '#22c55e',
          details: [
            { label: 'Sanctioned Country', value: data.wireTransferRisk.vendorSignals.lexisnexis.sanctionedCountryProximity, color: '#16a34a' },
            { label: 'PEP/Entity Risk', value: data.wireTransferRisk.vendorSignals.lexisnexis.pepEntityRisk, color: '#22c55e' }
          ]
        },
        {
          vendor: 'Pindrop',
          label: 'Pindrop',
          value: Object.values(data.wireTransferRisk.vendorSignals.pindrop).reduce((sum, val) => sum + val, 0),
          color: '#a855f7',
          details: [
            { label: 'Behavioral Pressure', value: data.wireTransferRisk.vendorSignals.pindrop.behavioralPressure, color: '#9333ea' },
            { label: 'Fraud Escalation', value: data.wireTransferRisk.vendorSignals.pindrop.fraudRiskEscalation, color: '#a855f7' }
          ]
        }
      ]
    },
    {
      kpiId: 'account-change',
      kpiTitle: 'High-Risk Account Change Requests',
      segments: [
        {
          vendor: 'Omilia',
          label: 'Omilia',
          value: Object.values(data.accountChangeRisk.vendorSignals.omilia).reduce((sum, val) => sum + val, 0),
          color: '#3b82f6',
          details: [
            { label: 'Beneficiary Change', value: data.accountChangeRisk.vendorSignals.omilia.beneficiaryChangeIntent, color: '#2563eb' },
            { label: 'Urgent Access', value: data.accountChangeRisk.vendorSignals.omilia.urgentAccessRequests, color: '#3b82f6' },
            { label: 'Rapid Changes', value: data.accountChangeRisk.vendorSignals.omilia.multipleRapidChanges, color: '#60a5fa' }
          ]
        },
        {
          vendor: 'Pindrop',
          label: 'Pindrop',
          value: Object.values(data.accountChangeRisk.vendorSignals.pindrop).reduce((sum, val) => sum + val, 0),
          color: '#a855f7',
          details: [
            { label: 'Voice Mismatch', value: data.accountChangeRisk.vendorSignals.pindrop.voiceMismatch, color: '#9333ea' },
            { label: 'Takeover Behavior', value: data.accountChangeRisk.vendorSignals.pindrop.takeoverBehavior, color: '#a855f7' }
          ]
        },
        {
          vendor: 'LexisNexis',
          label: 'LexisNexis',
          value: Object.values(data.accountChangeRisk.vendorSignals.lexisnexis).reduce((sum, val) => sum + val, 0),
          color: '#22c55e',
          details: [
            { label: 'High-risk Address', value: data.accountChangeRisk.vendorSignals.lexisnexis.addressChangesHighRisk, color: '#16a34a' },
            { label: 'Identity Issues', value: data.accountChangeRisk.vendorSignals.lexisnexis.identityRelationshipInconsistencies, color: '#22c55e' }
          ]
        }
      ]
    },
    {
      kpiId: 'structuring-cash',
      kpiTitle: 'Structuring & Large Cash Risk Events',
      segments: [
        {
          vendor: 'Omilia',
          label: 'Omilia',
          value: Object.values(data.structuringCashRisk.vendorSignals.omilia).reduce((sum, val) => sum + val, 0),
          color: '#3b82f6',
          details: [
            { label: 'Reporting Limit Qs', value: data.structuringCashRisk.vendorSignals.omilia.reportingLimitQuestions, color: '#2563eb' },
            { label: 'Multi-transaction', value: data.structuringCashRisk.vendorSignals.omilia.multipleTransactionPlanning, color: '#3b82f6' },
            { label: 'Source Ambiguity', value: data.structuringCashRisk.vendorSignals.omilia.sourceOfFundsAmbiguity, color: '#60a5fa' }
          ]
        },
        {
          vendor: 'Pindrop',
          label: 'Pindrop',
          value: Object.values(data.structuringCashRisk.vendorSignals.pindrop).reduce((sum, val) => sum + val, 0),
          color: '#a855f7',
          details: [
            { label: 'Nervousness/Stress', value: data.structuringCashRisk.vendorSignals.pindrop.nervousnessStressIndicators, color: '#9333ea' },
            { label: 'Repeated Inquiries', value: data.structuringCashRisk.vendorSignals.pindrop.repeatedInquiryPatterns, color: '#a855f7' }
          ]
        }
      ]
    },
    {
      kpiId: 'complaint-elder',
      kpiTitle: 'Complaint-Driven Risk & Elder Exploitation',
      segments: [
        {
          vendor: 'Omilia',
          label: 'Omilia',
          value: Object.values(data.complaintElderRisk.vendorSignals.omilia).reduce((sum, val) => sum + val, 0),
          color: '#3b82f6',
          details: [
            { label: 'Scam Language', value: data.complaintElderRisk.vendorSignals.omilia.scamLanguage, color: '#2563eb' },
            { label: 'Confusion + Urgency', value: data.complaintElderRisk.vendorSignals.omilia.confusionUrgencyIndicators, color: '#3b82f6' },
            { label: 'Fair Lending', value: data.complaintElderRisk.vendorSignals.omilia.fairLendingComplaintLanguage, color: '#60a5fa' }
          ]
        },
        {
          vendor: 'Pindrop',
          label: 'Pindrop',
          value: Object.values(data.complaintElderRisk.vendorSignals.pindrop).reduce((sum, val) => sum + val, 0),
          color: '#a855f7',
          details: [
            { label: 'Stress/Fear Patterns', value: data.complaintElderRisk.vendorSignals.pindrop.stressFearVocalPatterns, color: '#a855f7' }
          ]
        },
        {
          vendor: 'LexisNexis',
          label: 'LexisNexis',
          value: Object.values(data.complaintElderRisk.vendorSignals.lexisnexis).reduce((sum, val) => sum + val, 0),
          color: '#22c55e',
          details: [
            { label: 'Contextual Enrichment', value: data.complaintElderRisk.vendorSignals.lexisnexis.contextualEnrichment, color: '#22c55e' }
          ]
        }
      ]
    },
    {
      kpiId: 'account-opening',
      kpiTitle: 'Risky New Account Openings',
      segments: [
        {
          vendor: 'Omilia',
          label: 'Omilia',
          value: Object.values(data.accountOpeningRisk.vendorSignals.omilia).reduce((sum, val) => sum + val, 0),
          color: '#3b82f6',
          details: [
            { label: 'Coached Responses', value: data.accountOpeningRisk.vendorSignals.omilia.coachedResponses, color: '#2563eb' },
            { label: 'Third-party', value: data.accountOpeningRisk.vendorSignals.omilia.thirdPartyInvolvement, color: '#3b82f6' },
            { label: 'Vague Purpose', value: data.accountOpeningRisk.vendorSignals.omilia.vagueAccountPurpose, color: '#60a5fa' }
          ]
        },
        {
          vendor: 'LexisNexis',
          label: 'LexisNexis',
          value: Object.values(data.accountOpeningRisk.vendorSignals.lexisnexis).reduce((sum, val) => sum + val, 0),
          color: '#22c55e',
          details: [
            { label: 'PEP Indicators', value: data.accountOpeningRisk.vendorSignals.lexisnexis.pepIndicators, color: '#16a34a' },
            { label: 'Identity Issues', value: data.accountOpeningRisk.vendorSignals.lexisnexis.identityInconsistencies, color: '#22c55e' },
            { label: 'Address Mismatch', value: data.accountOpeningRisk.vendorSignals.lexisnexis.addressMismatch, color: '#4ade80' }
          ]
        },
        {
          vendor: 'Pindrop',
          label: 'Pindrop',
          value: Object.values(data.accountOpeningRisk.vendorSignals.pindrop).reduce((sum, val) => sum + val, 0),
          color: '#a855f7',
          details: [
            { label: 'Behavioral Anomalies', value: data.accountOpeningRisk.vendorSignals.pindrop.behavioralAnomalies, color: '#a855f7' }
          ]
        }
      ]
    },
    {
      kpiId: 'investment-advisory',
      kpiTitle: 'Investment / Advisory Conduct Risk',
      segments: [
        {
          vendor: 'Omilia',
          label: 'Omilia',
          value: Object.values(data.investmentAdvisoryRisk.vendorSignals.omilia).reduce((sum, val) => sum + val, 0),
          color: '#3b82f6',
          details: [
            { label: 'Suitability Mismatch', value: data.investmentAdvisoryRisk.vendorSignals.omilia.suitabilityMismatch, color: '#2563eb' },
            { label: 'Pressure Tactics', value: data.investmentAdvisoryRisk.vendorSignals.omilia.pressureTactics, color: '#3b82f6' },
            { label: 'Insider Hints', value: data.investmentAdvisoryRisk.vendorSignals.omilia.insiderInformationHints, color: '#60a5fa' }
          ]
        },
        {
          vendor: 'LexisNexis',
          label: 'LexisNexis',
          value: Object.values(data.investmentAdvisoryRisk.vendorSignals.lexisnexis).reduce((sum, val) => sum + val, 0),
          color: '#22c55e',
          details: [
            { label: 'Source of Funds Risk', value: data.investmentAdvisoryRisk.vendorSignals.lexisnexis.sourceOfFundsRisk, color: '#16a34a' },
            { label: 'PEP/Adverse', value: data.investmentAdvisoryRisk.vendorSignals.lexisnexis.pepAdverseContext, color: '#22c55e' }
          ]
        },
        {
          vendor: 'Pindrop',
          label: 'Pindrop',
          value: data.investmentAdvisoryRisk.vendorSignals.pindrop 
            ? Object.values(data.investmentAdvisoryRisk.vendorSignals.pindrop).reduce((sum, val) => sum + val, 0)
            : 0,
          color: '#a855f7',
          details: data.investmentAdvisoryRisk.vendorSignals.pindrop
            ? [
                { label: 'Voice Pressure Patterns', value: data.investmentAdvisoryRisk.vendorSignals.pindrop.voicePressurePatterns, color: '#a855f7' }
              ]
            : []
        }
      ]
    }
  ];
}

