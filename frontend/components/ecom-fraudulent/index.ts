// Main dashboard components
export { default as FraudRiskScore } from './FraudRiskScore';
export { default as FraudRiskSnapshot } from './FraudRiskSnapshot';
export { default as FraudInsightCards } from './FraudInsightCards';
export { default as AIPatternBrain } from './AIPatternBrain';
export { default as ClaimTaxonomyChart } from './ClaimTaxonomyChart';
export { default as AgentRiskRadar } from './AgentRiskRadar';
export { default as ThreatIntelligenceGrid } from './ThreatIntelligenceGrid';
export { default as ForensicEvidenceModal } from './ForensicEvidenceModal';

// New command cockpit components
export { default as FraudFiltersStrip } from './FraudFiltersStrip';
export { default as HighRiskCasesTable } from './HighRiskCasesTable';
export { default as RiskyEntitiesPanel } from './RiskyEntitiesPanel';

// Keep old exports for backward compatibility if needed
export { default as EmptyBoxMonitor } from './EmptyBoxMonitor';
export { default as AgentCollusionWatchlist } from './AgentCollusionWatchlist';
export { default as FakeEscalationDetector } from './FakeEscalationDetector';
export { default as CoercionAlertCards } from './CoercionAlertCards';
export { default as PromoAbuseTagCloud } from './PromoAbuseTagCloud';

// Export types
export type { FraudInsight } from './FraudInsightCards';
export type { FraudPattern } from './AIPatternBrain';
