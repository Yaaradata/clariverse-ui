import {
  usesRetailBankingDashboard,
  type Industry,
  type Role,
} from "@/lib/role-based-dashboard/registry";

/** Head of Contact Centre lands on KPI Signals (staffing) instead of Executive. */
export function skipExecutiveScreen(industry: Industry, role: Role): boolean {
  return usesRetailBankingDashboard(industry.id) && role.id === "head_contact";
}

export function initialKpiSignalFilter(roleId: string): string {
  const map: Record<string, string> = {
    ceo: "all",
    coo: "ops",
    cro: "fraud",
    head_retail: "ops",
    head_contact: "staffing",
    head_compliance: "all",
    head_cx: "training",
    head_cx_retail: "training",
    head_client_experience: "training",
  };
  return map[roleId] ?? "all";
}

export function showExecTrendCharts(roleId: string): boolean {
  return roleId === "ceo" || roleId === "coo";
}

export function showExecSystemHealthRibbon(roleId: string): boolean {
  return roleId === "ceo" || roleId === "coo";
}

export function showScreen2Eisenhower(roleId: string): boolean {
  return ["ceo", "coo", "head_retail"].includes(roleId);
}

export function showScreen2PressureWall(roleId: string): boolean {
  return ["ceo", "coo", "cro"].includes(roleId);
}

export function showScreen3IntentCommandCenter(roleId: string): boolean {
  return ["coo", "head_retail", "head_contact"].includes(roleId);
}

export function showScreen3EmotionShockboard(roleId: string): boolean {
  return [
    "head_cx",
    "head_cx_retail",
    "head_client_experience",
    "head_contact",
  ].includes(roleId);
}

export function showScreen3ToneIntelligence(roleId: string): boolean {
  return [
    "head_cx",
    "head_cx_retail",
    "head_client_experience",
    "head_compliance",
  ].includes(roleId);
}

export function showScreen3ComplianceInsights(roleId: string): boolean {
  return ["cro", "head_compliance"].includes(roleId);
}

export function showScreen3FciKpis(roleId: string): boolean {
  return ["coo", "head_contact"].includes(roleId);
}

// ═══════════════════════════
// HEAD OF RETAIL BANKING FLAGS (Ranjith feedback)
// ═══════════════════════════

/** Screen 1: Show retail-specific bottom cards (happiness distribution, brand insights, intent spikes) */
export function showRetailScreen1Cards(roleId: string): boolean {
  return roleId === "head_retail";
}

/** Screen 2: Show valuable customer segmentation + pain points */
export function showRetailValuedCustomers(roleId: string): boolean {
  return roleId === "head_retail";
}

/** Screen 3: Show cross-channel sentiment + intent SLA tracking + bottlenecks */
export function showRetailChannelSentiment(roleId: string): boolean {
  return roleId === "head_retail";
}

/** Screen 3: Full unified intelligence wall (same UI as unified operational pages). */
export function showRetailUnifiedIntelligenceWall(roleId: string): boolean {
  return roleId === "head_retail";
}

/** Screen 4: Show intent heat map (moved from contact centre to retail) */
export function showRetailIntentHeatmap(roleId: string): boolean {
  return ["head_retail", "ceo", "coo"].includes(roleId);
}

// ═══════════════════════════
// HEAD OF CONTACT CENTRE FLAGS (Ranjith feedback)
// ═══════════════════════════

/** Screen 2: Show outsourced vs insourced agent health + cross-centre monitor */
export function showContactAgentHealth(roleId: string): boolean {
  return roleId === "head_contact";
}

/** Screen 3: Show promise adherence + developing issues (intent spikes) */
export function showContactPromiseAdherence(roleId: string): boolean {
  return roleId === "head_contact";
}

/** Screen 4: Show cluster summary (moved from retail to contact centre) */
export function showContactClusterSummary(roleId: string): boolean {
  return ["head_contact", "coo"].includes(roleId);
}

// ═══════════════════════════
// CRO-SPECIFIC FLAGS (Shridar meeting insights)
// ═══════════════════════════

/** CRO Screen 1: Show executive risk cockpit KPIs (Risk Appetite, Consumer Duty, FinCrime, Vulnerable) */
export function showCroRiskCockpit(roleId: string): boolean {
  return roleId === "cro";
}

/** CRO Screen 2: Show customer risk profiling by LOB */
export function showCroLobRiskProfiling(roleId: string): boolean {
  return roleId === "cro";
}

/** CRO Screen 3: Show Financial Crime & AML section */
export function showCroFinancialCrime(roleId: string): boolean {
  return ["cro", "head_compliance"].includes(roleId);
}

/** CRO Screen 4: Show Consumer Duty scorecard (FCA 4 pillars) */
export function showCroConsumerDuty(roleId: string): boolean {
  return ["cro", "head_compliance"].includes(roleId);
}

/** CRO Screen 4: Show vulnerable customer detection panel */
export function showCroVulnerableCustomer(roleId: string): boolean {
  return [
    "cro",
    "head_compliance",
    "head_cx",
    "head_cx_retail",
    "head_client_experience",
  ].includes(roleId);
}

/** CRO Screen 4: Show cross-jurisdiction compliance heatmap */
export function showCroCrossJurisdiction(roleId: string): boolean {
  return roleId === "cro";
}

/** CRO Screen 4: Show SMCR accountability map */
export function showCroSmcrAccountability(roleId: string): boolean {
  return ["cro", "head_compliance"].includes(roleId);
}

/** CRO Screen 5: Show CRO-specific investigation cards */
export function showCroInvestigations(roleId: string): boolean {
  return roleId === "cro";
}
