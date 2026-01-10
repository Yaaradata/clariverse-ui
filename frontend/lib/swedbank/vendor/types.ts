// Vendor Dashboard Types - 6 Process-Specific KPI Cards

// KPI Card 1: High-Risk Wire Transfer Conversations
export interface WireTransferRisk {
  totalHighRiskWires: number;
  totalWireConversations: number;
  vendorSignals: {
    omilia: {
      wireIntent: number;
      structuringLanguage: number;
      urgencyWithoutRationale: number;
      thirdPartySender: number;
    };
    lexisnexis: {
      sanctionedCountryProximity: number;
      pepEntityRisk: number;
    };
    pindrop: {
      behavioralPressure: number;
      fraudRiskEscalation: number;
    };
  };
  integrationOutcomes: {
    wireHoldAlerts: number;
    sarRecommendationCandidates: number;
    customerRiskScoreElevation: number;
  };
  hasWireData: boolean;
}

// KPI Card 2: Risky New Account Openings Detected
export interface AccountOpeningRisk {
  totalRiskyOpenings: number;
  totalOnboardingAttempts: number;
  vendorSignals: {
    omilia: {
      coachedResponses: number;
      vagueAccountPurpose: number;
      thirdPartyInvolvement: number;
    };
    lexisnexis: {
      pepIndicators: number;
      identityInconsistencies: number;
      addressMismatch: number;
    };
    pindrop: {
      behavioralAnomalies: number;
    };
  };
  integrationOutcomes: {
    eddTriggers: number;
    onboardingHolds: number;
    moneyMuleFlags: number;
    documentationRequests: number;
  };
  hasOnboardingData: boolean;
}

// KPI Card 3: Structuring & Large Cash Risk Events
export interface StructuringCashRisk {
  totalStructuringEvents: number;
  totalCashConversations: number;
  vendorSignals: {
    omilia: {
      reportingLimitQuestions: number;
      multipleTransactionPlanning: number;
      sourceOfFundsAmbiguity: number;
    };
    pindrop: {
      nervousnessStressIndicators: number;
      repeatedInquiryPatterns: number;
    };
  };
  integrationOutcomes: {
    structuringAlerts: number;
    ctrNarrativeEnrichment: number;
    branchManagerAlerts: number;
  };
  hasCashData: boolean;
}

// KPI Card 4: High-Risk Account Change Requests
export interface AccountChangeRisk {
  totalHighRiskChanges: number;
  totalChangeRequests: number;
  vendorSignals: {
    omilia: {
      beneficiaryChangeIntent: number;
      urgentAccessRequests: number;
      multipleRapidChanges: number;
    };
    pindrop: {
      voiceMismatch: number;
      takeoverBehavior: number;
    };
    lexisnexis: {
      addressChangesHighRisk: number;
      identityRelationshipInconsistencies: number;
    };
  };
  integrationOutcomes: {
    changeVerificationHolds: number;
    accountTakeoverAlerts: number;
    ownerOutOfBandNotifications: number;
  };
  hasChangeData: boolean;
}

// KPI Card 5: Complaint-Driven Risk & Elder Exploitation Signals
export interface ComplaintElderRisk {
  totalComplaintRisks: number;
  totalComplaintInteractions: number;
  vendorSignals: {
    omilia: {
      scamLanguage: number; // "IRS called", "grandson in jail"
      confusionUrgencyIndicators: number;
      fairLendingComplaintLanguage: number;
    };
    pindrop: {
      stressFearVocalPatterns: number;
    };
    lexisnexis: {
      contextualEnrichment: number;
    };
  };
  integrationOutcomes: {
    regulatoryComplaintFlags: number;
    elderAbuseReports: number;
    scamPreventionHolds: number;
  };
  hasComplaintData: boolean;
}

// KPI Card 6: Investment & Advisory Conduct Risk
export interface InvestmentAdvisoryRisk {
  totalAdvisoryRisks: number;
  totalAdvisoryConversations: number;
  vendorSignals: {
    omilia: {
      suitabilityMismatch: number;
      pressureTactics: number;
      insiderInformationHints: number;
    };
    lexisnexis: {
      sourceOfFundsRisk: number;
      pepAdverseContext: number;
    };
    pindrop?: {
      voicePressurePatterns: number;
    };
  };
  integrationOutcomes: {
    tradeSurveillanceFlags: number;
    regBISuitabilityReviews: number;
    amlEscalations: number;
  };
  hasAdvisoryData: boolean;
}

export interface VendorDashboardData {
  wireTransferRisk: WireTransferRisk;
  accountOpeningRisk: AccountOpeningRisk;
  structuringCashRisk: StructuringCashRisk;
  accountChangeRisk: AccountChangeRisk;
  complaintElderRisk: ComplaintElderRisk;
  investmentAdvisoryRisk: InvestmentAdvisoryRisk;
}

