/**
 * LiSN × KGS v2 — Regional GM, Asia ex China.
 * Reuses v1 Severity / Confidence / JoinTag / PnLDestination / EvidenceSnippet /
 * AnonymiseMap shapes. Role and HumanGate are v2-scoped (six regional roles).
 * Everything here is a SYNTHETIC SCENARIO — illustrative only.
 */

export type {
  AnonymiseMap,
  Confidence,
  ConfidenceLevel,
  EvidenceSnippet,
  GateStatus,
  ISODate,
  ISODateTime,
  JoinTag,
  PnLDestination,
  Severity,
  SeverityClass,
  SeverityType,
  TokenKind,
  TokenString,
} from "@kgs/types";

import type {
  GateStatus,
  HumanGate as V1HumanGate,
  ISODate,
  JoinTag,
  TokenString,
} from "@kgs/types";

/** Alias used in SPEC ("JoinTags"). */
export type JoinTags = JoinTag[];

/** On-screen roles only — never a real person's name. */
export type Role =
  | "Regional GM"
  | "Operations lead"
  | "Technical support lead"
  | "Partner manager"
  | "Product liaison"
  | "Sales ops"
  | "Partner service manager";

export type V2View =
  | "overview"
  | "promise"
  | "promiseHero"
  | "recurring"
  | "recurringTheme"
  | "install"
  | "partner";

export type ProductFamily = "A" | "B" | "C" | "D";

export type CandidateCause =
  | "allocation"
  | "backorder"
  | "order-change"
  | "last-mile";

export interface PromiseLine {
  id: string;
  distributor: TokenString;
  region: TokenString;
  family: ProductFamily;
  originalDate: ISODate;
  revisedDate: ISODate;
  deliveredDate?: ISODate;
  slipDays: number;
  contactIds: string[];
  candidateCause: CandidateCause;
}

export interface LoopStatus {
  step: "open" | "approved" | "watching" | "closed";
  nextCheck?: ISODate;
  approvedAt?: string;
  approvedBy?: Role;
}

export type FixType = "kb" | "training" | "process" | "product-feedback";

export interface FixRecord {
  date: ISODate;
  type: FixType;
  owner: string;
  before: number;
  after: number;
}

export type ThemeStatus = "holding" | "back-after-fix" | "no-fix";

export interface Theme {
  id: string;
  name: string;
  firstSeen: ISODate;
  contacts13w: number;
  channels: string[];
  partners: number;
  status: ThemeStatus;
  fixes: FixRecord[];
  lastFixLabel?: string;
}

export interface InstallFeedback {
  step: string;
  polarity: "friction" | "praise";
  text: TokenString;
  statedMinutes?: number;
  partner: TokenString;
  date: ISODate;
}

export interface SharingScope {
  themes: boolean;
  promise: boolean;
  commissioning: boolean;
  identities: false;
  pricing: false;
}

export interface SourceConnection {
  name: string;
  owner: "kgs" | "partner";
  connected: boolean;
}

/**
 * Same gate shape as v1, with v2 Role and a few extra artefact kinds for drafts.
 */
export type HumanGate = Omit<
  V1HumanGate,
  "owner" | "approveEnabledFor" | "artefactType"
> & {
  owner: Role;
  approveEnabledFor: Role[];
  artefactType:
    | V1HumanGate["artefactType"]
    | "partner-update"
    | "allocation-note"
    | "carrier-review"
    | "kb-update"
    | "product-feedback-note"
    | "training-tip";
  status: GateStatus;
};

export interface DemoStateV2 {
  role: Role;
  anonymise: boolean;
  approvals: Record<string, { ts: string }>;
  decisionRequested: Record<string, { ts: string }>;
  loop: Record<string, LoopStatus>;
  view: V2View;
}
