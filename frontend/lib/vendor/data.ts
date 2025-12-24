// Vendor Dashboard Mock Data - 6 Process-Specific KPI Cards
import { VendorDashboardData } from './types';

export function getVendorDashboardData(): VendorDashboardData {
  return {
    wireTransferRisk: {
      totalHighRiskWires: 47,
      totalWireConversations: 382,
      vendorSignals: {
        omilia: {
          wireIntent: 47,
          structuringLanguage: 18,
          urgencyWithoutRationale: 12,
          thirdPartySender: 17
        },
        lexisnexis: {
          sanctionedCountryProximity: 8,
          pepEntityRisk: 5
        },
        pindrop: {
          behavioralPressure: 15,
          fraudRiskEscalation: 9
        }
      },
      integrationOutcomes: {
        wireHoldAlerts: 32,
        sarRecommendationCandidates: 18,
        customerRiskScoreElevation: 24
      },
      hasWireData: true
    },
    accountOpeningRisk: {
      totalRiskyOpenings: 67,
      totalOnboardingAttempts: 456,
      vendorSignals: {
        omilia: {
          coachedResponses: 23,
          vagueAccountPurpose: 19,
          thirdPartyInvolvement: 25
        },
        lexisnexis: {
          pepIndicators: 12,
          identityInconsistencies: 18,
          addressMismatch: 15
        },
        pindrop: {
          behavioralAnomalies: 14
        }
      },
      integrationOutcomes: {
        eddTriggers: 42,
        onboardingHolds: 28,
        moneyMuleFlags: 19,
        documentationRequests: 35
      },
      hasOnboardingData: true
    },
    structuringCashRisk: {
      totalStructuringEvents: 28,
      totalCashConversations: 234,
      vendorSignals: {
        omilia: {
          reportingLimitQuestions: 15,
          multipleTransactionPlanning: 10,
          sourceOfFundsAmbiguity: 12
        },
        pindrop: {
          nervousnessStressIndicators: 18,
          repeatedInquiryPatterns: 9
        }
      },
      integrationOutcomes: {
        structuringAlerts: 28,
        ctrNarrativeEnrichment: 22,
        branchManagerAlerts: 15
      },
      hasCashData: true
    },
    accountChangeRisk: {
      totalHighRiskChanges: 45,
      totalChangeRequests: 289,
      vendorSignals: {
        omilia: {
          beneficiaryChangeIntent: 18,
          urgentAccessRequests: 12,
          multipleRapidChanges: 15
        },
        pindrop: {
          voiceMismatch: 14,
          takeoverBehavior: 11
        },
        lexisnexis: {
          addressChangesHighRisk: 8,
          identityRelationshipInconsistencies: 7
        }
      },
      integrationOutcomes: {
        changeVerificationHolds: 32,
        accountTakeoverAlerts: 18,
        ownerOutOfBandNotifications: 24
      },
      hasChangeData: true
    },
    complaintElderRisk: {
      totalComplaintRisks: 141,
      totalComplaintInteractions: 423,
      vendorSignals: {
        omilia: {
          scamLanguage: 47, // "IRS called", "grandson in jail"
          confusionUrgencyIndicators: 56,
          fairLendingComplaintLanguage: 38
        },
        pindrop: {
          stressFearVocalPatterns: 42
        },
        lexisnexis: {
          contextualEnrichment: 28
        }
      },
      integrationOutcomes: {
        regulatoryComplaintFlags: 34,
        elderAbuseReports: 23,
        scamPreventionHolds: 84
      },
      hasComplaintData: true
    },
    investmentAdvisoryRisk: {
      totalAdvisoryRisks: 34,
      totalAdvisoryConversations: 187,
      vendorSignals: {
        omilia: {
          suitabilityMismatch: 12,
          pressureTactics: 15,
          insiderInformationHints: 7
        },
        lexisnexis: {
          sourceOfFundsRisk: 11,
          pepAdverseContext: 8
        },
        pindrop: {
          voicePressurePatterns: 9
        }
      },
      integrationOutcomes: {
        tradeSurveillanceFlags: 18,
        regBISuitabilityReviews: 12,
        amlEscalations: 9
      },
      hasAdvisoryData: true
    }
  };
}

