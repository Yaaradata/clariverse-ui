// state/appState.ts — Stage 8 in-memory shape (Pass 1: empty seeded data).

export type PersonaId = "category-head" | "cx-voc-head";
export type ThemeMode = "light" | "dark";
export type WindowMode = "normal" | "sale";
export type SignatureType = "A" | "B" | "C" | "D" | "E" | "F" | "G" | "H";
export type ActionLabel = "Draft" | "Prepare" | "Route";
export type ActionStatus = "draft" | "accepted" | "dismissed";
export type Severity = "S1" | "S2" | "S3";

export interface Action {
  actionLabel: ActionLabel;
  routedOwner: string;
  gated: boolean;
  status: ActionStatus;
}

export interface Signal {
  signalId: string;
  cardId: string;
  title: string;
  severity: Severity;
  behaviourType: string;
  cohortId: string;
  baselineCellId: string;
  deviationStat: string;
  onsetTs: string;
  causeClass: string;
  confidence: string;
  impactValue: string;
  ruledOut: string[];
  honestyLine: string;
  ownerPersona: string;
  signatureType: SignatureType;
  actions: Action[];
}

export interface BaselineCell {
  cellId: string;
  label: string;
  value: number;
  comparisonLabel: string;
}

export interface EvidencePack {
  verbatims: string[];
  resolvedOrderTrail: string[];
  provenance: string;
}

export interface Kpis {
  contribution: number | null;
  returnRate: number | null;
  recoverableMargin: number | null;
  sellerRisk: number | null;
  conductFlag: boolean;
}

export interface UiState {
  selectedSignalId: string | null;
  openDrill: string | null;
  dayGeneratorActive: boolean;
}

export interface AuditEntry {
  signalId: string;
  actionLabel: string;
  accepted_by: string;
  accepted_at: string;
}

export interface AppState {
  personaId: PersonaId;
  theme: ThemeMode;
  scope: {
    category: string;
    laneId: string | null;
    window: WindowMode;
  };
  signals: Signal[];
  baselines: Record<string, BaselineCell>;
  evidencePacks: Record<string, EvidencePack>;
  kpis: Kpis;
  rail: {
    orderedSignalIds: string[];
    suppressed: Signal[];
  };
  ui: UiState;
  audit: AuditEntry[];
}

export const INITIAL_APP_STATE: AppState = {
  personaId: "category-head",
  theme: "light",
  scope: {
    category: "Fashion + Quick-Commerce Grocery",
    laneId: null,
    window: "normal",
  },
  signals: [],
  baselines: {},
  evidencePacks: {},
  kpis: {
    contribution: null,
    returnRate: null,
    recoverableMargin: null,
    sellerRisk: null,
    conductFlag: false,
  },
  rail: {
    orderedSignalIds: [],
    suppressed: [],
  },
  ui: {
    selectedSignalId: null,
    openDrill: null,
    dayGeneratorActive: false,
  },
  audit: [],
};
