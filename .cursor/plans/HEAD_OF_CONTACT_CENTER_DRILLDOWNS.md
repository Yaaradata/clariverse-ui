# Head of Contact Center — Drill-down Build Spec (Cursor Prompt)

> **For Cursor**: Build the three drill-down screens for the `head_contact` role inside `RoleDashboardView.tsx`, parallel to what already exists for `head_retail` and `head_cards`. Follow the structure, file layout, and visual language used by the existing retail / cards drill-downs. **Do not invent new design tokens** — reuse the existing Outfit / JetBrains Mono fonts, gradient cards, MiniGauge, TileScoreGauge, Recharts, and Lucide icons. **Source data** for each panel must come from the existing components in `frontend/app/swedbank/*` listed under each drill-down — import them directly where possible; mock the data where component props need shimming.
>
> Color palette for Head of Contact Center (parallel to gold/navy for Retail and cyan for Cards): **teal + emerald** (`#14b8a6` primary, `#10b981` accent, `#0f766e` deep) so the role visually reads as "Operations / Service Engine". Apply via the existing `accentClass` / `gradientClass` props on shared shells.

---

## 0 · Context for Cursor

You're editing the **Yaaralabs Fluid Intelligence / CX Anomaly Intelligence Platform**. The platform has a five-screen drill-down architecture per role:

```
Screen 1: Industry  →  Screen 2: Role  →  Screen 3: 3-tile Dashboard  →  Screen 4: Drill-down (one of 3)  →  Screen 5: Root Cause + Action
```

Three roles already wired:

| Role           | Drill 1                                  | Drill 2                                    | Drill 3                                    |
|----------------|------------------------------------------|--------------------------------------------|--------------------------------------------|
| Head of Retail | Are our Customers happy?                 | Is the Brand at risk?                      | How is our Service delivery?               |
| Head of Cards  | Are cardholders satisfied with journey?  | What is the market saying about us?        | Are we keeping our service promise?        |
| **Head of CC** | **Are contacts ending well?**            | **Is service hurting our reputation?**     | **Can the engine deliver?**                |

The contact-center tile shells in `RoleDashboardView.tsx` already exist (`contactTileInfo`, `contactTileTrendMeta`, three placeholder drill components). This spec fills them out.

---

## 1 · Research synthesis — what a US Head of Contact Center actually wants

A US Head of Contact Center / VP Customer Care at a bank (sources: Horace Mann VP Customer Care & Contact Center JD, US Bank's Customer Contact Center org structure, RingCentral RingCX, Sprinklr CX dashboards, Nextiva, ICMI, Aceyus, BlueTweak, callforce.global) lives at the intersection of **three pressures**:

### 1.1 Customer outcome quality (per-interaction)
- **Post-contact CSAT** (typical target: ≥85% top-2-box) — survey sent immediately after contact close
- **First Contact Resolution (FCR)** — % issues resolved without callback. The single most-watched CX metric in US banking contact centers.
- **Customer Effort Score (CES)** — "how easy was it to get this resolved" (1–7 scale)
- **Repeat-contact rate** — same customer contacts within 7 days = FCR failure signal
- **Transfer rate** — % calls bounced agent-to-agent (proxy for routing/skill mismatch)
- **NPS** at relationship level (longer cadence)
- **Sentiment-at-close** — AI-derived emotion at end of interaction
- **Complaint backlog** — open complaints aging > SLA. **CFPB complaint pipeline** is uniquely US-specific and a board-level concern; every US bank exec watches CFPB submission rate by topic.

### 1.2 Brand & reputational fallout from service
- Service-driven complaints that bleed into **Trustpilot / App Store / Reddit / X** — share-of-voice on negative service themes
- Escalation patterns — "I'm closing my account", "I want a manager", executive complaint letters
- **CFPB risk cases** — complaints with regulatory-trigger language
- Social spillover from service issues — what % of negative social mentions originate from a contact-center failure
- App store rating drift attributed to service themes (e.g., "can't reach support", "agent was rude")
- Churn intent surfaced in transcripts

### 1.3 The service engine itself (capacity + workforce)
- **Service Level (SL)** — target typically `80/20` (80% of calls answered in 20 seconds). Industry-standard banking SLA.
- **Average Handle Time (AHT)** — talk + hold + after-call work. Watched per channel per intent.
- **Abandon rate** — % callers hang up before reaching agent (typical target ≤5%)
- **Average Speed of Answer (ASA)** — average wait
- **Occupancy** — % of logged-in time agent is on contacts (target 80–85%; >90% = burnout risk)
- **Schedule adherence** — % of scheduled time agent is actually available
- **Shrinkage** — planned (training, breaks, meetings) + unplanned (sick, attrition) % of paid time unavailable
- **Forecast variance** — actual vs. forecast volume. Drives staffing emergencies.
- **Agent attrition** — annual turnover (US banking CC industry avg ~30–45%, target <25%)
- **BPO / outsourced partner SLA** — if BPO is in the mix, BPO performance vs. in-house side-by-side
- **Channel mix & containment** — % of contacts deflected to self-service / bot, bot-to-human handoff rate, **avoidable contacts** by intent
- **QA / coaching effectiveness** — quality scores, coaching-ticket closure rate, skill-gap matrix

### 1.4 The C-suite translation layer (this is the piece that's missing in most CC dashboards)
At C-suite level (Aceyus, Sprinklr, RingCentral, ICMI all converge here), the Head of CC has to **translate operational metrics into dollars**:
- Cost per contact (by channel, by intent)
- Revenue at risk from escalation (open complaints × estimated churn × CLV)
- BPO penalties (when partner SLA breached)
- Cost of avoidable contacts (volume × CPC) — the "we shouldn't have received this call" pile

### 1.5 The 2025–2026 omnichannel shift
Voice is no longer the only lens. Chat, email, social DMs, in-app messaging, and chatbot-to-agent handoffs all sit under this leader. The dashboard **must** unify across channel and report channel-mix as a first-class signal — not just a filter.

---

## 2 · The three drill-downs

| # | Drill title (the question) | What it answers | Anchor metrics | C-suite money line |
|---|---------------------------|-----------------|----------------|--------------------|
| 1 | **Are contacts ending well?** | Per-interaction customer outcome quality | Post-CSAT, FCR, repeat-contact %, transfer %, CES, sentiment-at-close, AI tone-drift | Revenue at risk from poor outcomes |
| 2 | **Is service hurting our reputation?** | Brand + regulatory risk created by CC failures | Complaint backlog, CFPB-risk cases, escalation rate, social spillover from service, app store drift, churn intent | Estimated brand-equity exposure $ |
| 3 | **Can the engine deliver?** | Workforce + SLA + capacity health | SL 80/20, AHT, abandon %, ASA, shrinkage, schedule adherence, forecast variance, BPO SLA, attrition, staffing gap, containment | Weekly cost of SLA breach + avoidable contacts |

Each drill-down has the same shape: **headline KPI strip → 2–3 mid-tier visualisations → bottom watchlist / action queue → "View root cause" CTA into Screen 5.**

---

## 3 · DRILL-DOWN 1 · "Are contacts ending well?"

### 3.1 Tile in Screen 3 (already wired in `contactTileInfo[0]`)

Title: `Customer Experience` · Subtitle: `Per-interaction outcome quality`
Score gauge: weighted blend of `Post-CSAT × 0.4 + FCR × 0.4 + (100 - repeatContactPct) × 0.2`
Three mini-stat rows:
- **Post-CSAT** · 87% · ▲ +1.2 pp WoW
- **FCR** · 78% · ▼ -2.1 pp WoW
- **Repeat-contact** · 14% · ▲ +0.8 pp WoW (bad direction)

### 3.2 Sub-screen layout (`ContactExperienceDrillDown`)

```
┌─ Header strip ───────────────────────────────────────────────────────┐
│ "Are contacts ending well?"   |  Period: 7d ▾  |  Channel: All ▾    │
└──────────────────────────────────────────────────────────────────────┘

┌─ KPI Ribbon (5 cards across) ────────────────────────────────────────┐
│ Post-CSAT  |  FCR  |  CES  |  Repeat-Contact  |  Sentiment-at-Close │
│   87%     | 78%  | 5.1   |     14%          |    72% positive     │
└──────────────────────────────────────────────────────────────────────┘

┌─ Row 1 (2 cards) ────────────────────────────────────────────────────┐
│ ┌─ Outcome Trend Chart (2/3 width) ─┐  ┌─ Tone Drift Wall (1/3) ──┐ │
│ │ Stacked area: % calls by outcome  │  │ Heatmap of tone drift    │ │
│ │   Resolved | Escalated | Repeat   │  │ across last 200 contacts │ │
│ │   Last 14d, dual y-axis (CSAT)    │  │ (premature closure flag) │ │
│ └────────────────────────────────────┘  └──────────────────────────┘ │
└──────────────────────────────────────────────────────────────────────┘

┌─ Row 2 (3 cards) ────────────────────────────────────────────────────┐
│ ┌─ Emotion Shockboard ─┐ ┌─ Resolution Integrity ─┐ ┌─ AI Risk Spike ─┐
│ │ Anger / frustration  │ │ Premature-closure      │ │ "Things ending  │
│ │ spikes by hour       │ │ Risk Card (per agent)  │ │  badly NOW"     │
│ └──────────────────────┘ └────────────────────────┘ └─────────────────┘
└──────────────────────────────────────────────────────────────────────┘

┌─ Bottom watchlist ───────────────────────────────────────────────────┐
│ Worst-outcome contacts last 24h (table, click-through to detail)    │
│  Channel | Customer | Intent | Sentiment | Outcome | [Open]         │
└──────────────────────────────────────────────────────────────────────┘

┌─ CTA ────────────────────────────────────────────────────────────────┐
│ [ Investigate root cause →  ]   (routes to Screen 5)                │
└──────────────────────────────────────────────────────────────────────┘
```

### 3.3 Existing components to reuse

| Slot in layout | Existing component | Source path |
|---|---|---|
| KPI ribbon | `KPIRibbon` (voice) + `KPICards` (email) | `/swedbank/voice`, `/swedbank/email` |
| Outcome trend | `SentimentTrendChart` + `ThreadsOverTimeChart` | `/swedbank/email` |
| Tone Drift Wall | `ToneDriftWall` | `/swedbank/main-page/Channel Analysis` |
| Emotion Shockboard | `EmotionShockboard` | `/swedbank/main-page/Channel Analysis` |
| Resolution Integrity | `ResolutionIntegrityMonitor` + `PrematureClosureRiskCard` | `/swedbank/main-page/Channel Analysis` |
| AI Risk Spike | `AIRiskSpikeMonitor` + `AutoInsightsTicker` | `/swedbank/main-page/Channel Analysis`, `/swedbank/email/executive` |
| Detail drawer | `ThreadDetailDrawer` (email) + `CallDetailModal` (voice) | `/swedbank/email`, `/swedbank/voice` |
| Cross-channel layer | `CrossChannelToneIntelligenceCard` | `/swedbank/main-page/Channel Analysis` |

### 3.4 TSX scaffold

```tsx
// frontend/components/role-based-dashboard/drill-downs/ContactExperienceDrillDown.tsx
"use client";

import { useState } from "react";
import { ArrowRight, Headphones, Mail, MessageSquare } from "lucide-react";
import { KPIRibbon } from "@/app/swedbank/voice/components/KPIRibbon";
import { ToneDriftWall } from "@/app/swedbank/main-page/components/ToneDriftWall";
import { EmotionShockboard } from "@/app/swedbank/main-page/components/EmotionShockboard";
import { ResolutionIntegrityMonitor } from "@/app/swedbank/main-page/components/ResolutionIntegrityMonitor";
import { PrematureClosureRiskCard } from "@/app/swedbank/main-page/components/PrematureClosureRiskCard";
import { AIRiskSpikeMonitor } from "@/app/swedbank/main-page/components/AIRiskSpikeMonitor";
import { AutoInsightsTicker } from "@/app/swedbank/email/executive/components/AutoInsightsTicker";
import { CrossChannelToneIntelligenceCard } from "@/app/swedbank/main-page/components/CrossChannelToneIntelligenceCard";
import { ThreadDetailDrawer } from "@/app/swedbank/email/components/ThreadDetailDrawer";

type Props = { onInvestigate: () => void };

const ACCENT = "from-teal-500 to-emerald-500";
const RING = "ring-teal-400/40";

export default function ContactExperienceDrillDown({ onInvestigate }: Props) {
  const [period, setPeriod] = useState<"24h" | "7d" | "30d">("7d");
  const [channel, setChannel] = useState<"all" | "voice" | "email" | "chat">("all");
  const [openThreadId, setOpenThreadId] = useState<string | null>(null);

  return (
    <div className="space-y-5">
      {/* Header strip */}
      <div className="flex items-center justify-between rounded-2xl border border-white/10 bg-gradient-to-r from-slate-900/80 to-slate-900/40 px-6 py-4 backdrop-blur">
        <div>
          <h2 className="font-outfit text-2xl font-semibold text-white">
            Are contacts ending well?
          </h2>
          <p className="mt-1 text-sm text-white/60">
            Per-interaction customer outcome quality — Post-CSAT, FCR, sentiment-at-close
          </p>
        </div>
        <div className="flex items-center gap-2">
          <PeriodPicker value={period} onChange={setPeriod} />
          <ChannelPicker value={channel} onChange={setChannel} />
        </div>
      </div>

      {/* KPI ribbon — 5 cards */}
      <div className="grid grid-cols-5 gap-3">
        <KPICard label="Post-CSAT"        value="87%"  delta="+1.2pp"  good />
        <KPICard label="FCR"              value="78%"  delta="-2.1pp"  bad  />
        <KPICard label="CES"              value="5.1"  delta="+0.2"    good />
        <KPICard label="Repeat-Contact"   value="14%"  delta="+0.8pp"  bad  />
        <KPICard label="Sentiment@Close"  value="72%"  delta="-1.4pp"  bad  />
      </div>

      {/* Row 1 — Trend + Tone drift */}
      <div className="grid grid-cols-3 gap-4">
        <div className="col-span-2 rounded-2xl border border-white/10 bg-slate-900/50 p-5">
          <h3 className="mb-3 font-outfit text-base text-white/90">Outcome trend (14d)</h3>
          <CrossChannelToneIntelligenceCard period={period} channel={channel} />
        </div>
        <div className="rounded-2xl border border-white/10 bg-slate-900/50 p-5">
          <h3 className="mb-3 font-outfit text-base text-white/90">Tone drift wall</h3>
          <ToneDriftWall compact />
        </div>
      </div>

      {/* Row 2 — Emotion shock / Resolution integrity / AI risk spike */}
      <div className="grid grid-cols-3 gap-4">
        <Panel title="Emotion shocks (last 24h)">
          <EmotionShockboard compact />
        </Panel>
        <Panel title="Resolution integrity">
          <ResolutionIntegrityMonitor />
          <PrematureClosureRiskCard />
        </Panel>
        <Panel title="Risk spikes happening NOW">
          <AIRiskSpikeMonitor />
          <AutoInsightsTicker />
        </Panel>
      </div>

      {/* Bottom watchlist */}
      <Panel title="Worst-outcome contacts (24h)">
        <WorstOutcomesTable onOpen={setOpenThreadId} />
      </Panel>

      {/* CTA */}
      <button
        onClick={onInvestigate}
        className={`flex w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r ${ACCENT} py-3 font-outfit text-sm font-semibold text-white transition hover:scale-[1.01]`}
      >
        Investigate root cause <ArrowRight className="h-4 w-4" />
      </button>

      {openThreadId && (
        <ThreadDetailDrawer threadId={openThreadId} onClose={() => setOpenThreadId(null)} />
      )}
    </div>
  );
}

/* — small helpers — */
function KPICard({ label, value, delta, good }: { label: string; value: string; delta: string; good?: boolean }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-slate-900/60 p-4">
      <div className="text-xs text-white/50">{label}</div>
      <div className="mt-1 font-jetbrains text-2xl font-semibold text-white">{value}</div>
      <div className={`mt-1 text-xs ${good ? "text-emerald-400" : "text-rose-400"}`}>{delta}</div>
    </div>
  );
}

function Panel({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-slate-900/50 p-5">
      <h3 className="mb-3 font-outfit text-base text-white/90">{title}</h3>
      <div className="space-y-3">{children}</div>
    </div>
  );
}

function PeriodPicker({ value, onChange }: { value: string; onChange: (v: any) => void }) {
  return (
    <div className="flex rounded-lg border border-white/10 bg-slate-800/60 p-1 text-xs">
      {["24h", "7d", "30d"].map(p => (
        <button
          key={p}
          onClick={() => onChange(p)}
          className={`px-2 py-1 rounded ${value === p ? "bg-teal-500/30 text-teal-100" : "text-white/60"}`}
        >{p}</button>
      ))}
    </div>
  );
}

function ChannelPicker({ value, onChange }: { value: string; onChange: (v: any) => void }) {
  const opts: Array<[string, any]> = [
    ["All", "all"], ["Voice", "voice"], ["Email", "email"], ["Chat", "chat"]
  ];
  return (
    <div className="flex rounded-lg border border-white/10 bg-slate-800/60 p-1 text-xs">
      {opts.map(([label, v]) => (
        <button
          key={v}
          onClick={() => onChange(v)}
          className={`px-2 py-1 rounded ${value === v ? "bg-teal-500/30 text-teal-100" : "text-white/60"}`}
        >{label}</button>
      ))}
    </div>
  );
}

function WorstOutcomesTable({ onOpen }: { onOpen: (id: string) => void }) {
  // Replace with live query; mock for now to match retail/cards pattern.
  const rows = [
    { id: "T-9821", channel: "Voice",  customer: "M. Andersson", intent: "Disputed Charge",  sentiment: -0.78, outcome: "Escalated"          },
    { id: "T-9817", channel: "Email",  customer: "L. Bergström", intent: "Account Locked",   sentiment: -0.65, outcome: "Repeat (3rd contact)"},
    { id: "T-9803", channel: "Chat",   customer: "P. Ek",        intent: "Card Replacement", sentiment: -0.54, outcome: "Premature close"     },
    { id: "T-9799", channel: "Voice",  customer: "E. Nilsson",   intent: "Fraud Alert",      sentiment: -0.81, outcome: "Transferred 3×"      },
  ];
  return (
    <table className="w-full text-sm">
      <thead className="text-left text-xs uppercase text-white/50">
        <tr><th>Channel</th><th>Customer</th><th>Intent</th><th>Sentiment</th><th>Outcome</th><th></th></tr>
      </thead>
      <tbody className="font-jetbrains">
        {rows.map(r => (
          <tr key={r.id} className="border-t border-white/5">
            <td className="py-2 text-white/80">{r.channel}</td>
            <td className="text-white/80">{r.customer}</td>
            <td className="text-white/60">{r.intent}</td>
            <td className="text-rose-400">{r.sentiment.toFixed(2)}</td>
            <td className="text-amber-300">{r.outcome}</td>
            <td><button onClick={() => onOpen(r.id)} className="text-teal-300 underline">Open</button></td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
```

---

## 4 · DRILL-DOWN 2 · "Is service hurting our reputation?"

### 4.1 Tile in Screen 3 (already wired in `contactTileInfo[1]`)

Title: `Service Reputation` · Subtitle: `Brand & regulatory exposure from CC failures`
Score gauge: weighted blend of `(100 - serviceComplaintShare) × 0.5 + appStoreServiceRating × 0.3 + (100 - cfpbRiskCases × 5) × 0.2`
Three mini-stat rows (bars showing channel concentration):
- **Trustpilot** service-driven negative · 38%
- **App Store** service-related 1-star · 24%
- **Reddit / X** complaint share-of-voice · 18%

### 4.2 Sub-screen layout (`ServiceReputationDrillDown`)

```
┌─ Header strip ────────────────────────────────────────────────────────┐
│ "Is service hurting our reputation?"  | Period 30d ▾ | Risk lens ▾  │
└───────────────────────────────────────────────────────────────────────┘

┌─ Risk KPI ribbon (5 cards) ──────────────────────────────────────────┐
│ Open Complaints | CFPB-Risk Cases | Escalation % | Social Spillover │
│      247       |       18         |    12%       |   38% (▲6pp)     │
│        + App-Store Service-Drift   1-star ▲ 24%                     │
└──────────────────────────────────────────────────────────────────────┘

┌─ Row 1 (2 cards) ────────────────────────────────────────────────────┐
│ ┌─ Risk Radar Polar (1/2) ──┐  ┌─ Channel Sentiment Split (1/2) ──┐ │
│ │ 6 axes: CFPB / Press /     │  │ Filtered to service-driven       │ │
│ │ Social / App / Trustpilot/ │  │ topics (Account Access, Fee      │ │
│ │ Internal Escalation        │  │ Dispute, System Outage…)         │ │
│ └────────────────────────────┘  └──────────────────────────────────┘ │
└──────────────────────────────────────────────────────────────────────┘

┌─ Row 2 (3 cards) ────────────────────────────────────────────────────┐
│ ┌─ Compliance Score Meter ┐ ┌─ Violation Categories ┐ ┌─ Active Risks ┐
│ │ Overall CC compliance   │ │ Bar chart by category  │ │ Table of live │
│ │ Score (gauge)            │ │ (mis-statement, late   │ │ risk cases    │
│ │                          │ │  resolution, missing   │ │ (drillable)   │
│ │                          │ │  disclosure)           │ │               │
│ └──────────────────────────┘ └────────────────────────┘ └───────────────┘
└──────────────────────────────────────────────────────────────────────┘

┌─ Row 3 ──────────────────────────────────────────────────────────────┐
│ Eisenhower Matrix (filtered to "complaint→social" + "escalation→reg")│
│                                                                      │
│ Intent Flow Map: how a single complaint flows from CC to social/reg  │
└──────────────────────────────────────────────────────────────────────┘

┌─ Bottom watchlist ───────────────────────────────────────────────────┐
│ AI Action Suggestions (red-flag cases) — accept / reroute / escalate│
└──────────────────────────────────────────────────────────────────────┘

┌─ CTA ────────────────────────────────────────────────────────────────┐
│ [ Investigate root cause →  ]                                       │
└──────────────────────────────────────────────────────────────────────┘
```

### 4.3 Existing components to reuse

| Slot in layout | Existing component | Source path |
|---|---|---|
| Risk KPI ribbon | `RiskAssessmentCard` + custom CFPB-Risk card (new) | `/swedbank/email` |
| Risk Radar Polar | `RiskRadarPolar` | `/swedbank/email/executive` |
| Channel Sentiment Split | `ChannelSentimentSplitChart` (filtered to service topics) | `/swedbank/social/*` |
| Compliance Score Meter | `ComplianceScoreMeter` | `/swedbank/compliance-fci/compliance` |
| Violation Categories | `ViolationCategoryChart` | `/swedbank/compliance-fci/compliance` |
| Active Risks | `ActiveRisksTable` + `RiskAlertPanel` | `/swedbank/compliance-fci/compliance` |
| Red-flag distribution | `RedFlagDistributionChart` | `/swedbank/compliance-fci/compliance-signals` |
| Eisenhower Matrix | `EisenhowerMatrix` (filter prop) | `/swedbank/email` |
| Intent Flow | `IntentFlowMap` | `/swedbank/email/executive` |
| AI suggestions | `AIActionSuggestionWall` | `/swedbank/compliance-fci/compliance-signals` |
| Topic volume | `PositiveNegativeTopicVolumeChart` | `/swedbank/social/*` |

### 4.4 Critical filter — service-driven topic whitelist

```tsx
export const SERVICE_DRIVEN_TOPICS = [
  "Account Access",
  "Fee Dispute",
  "Customer Service Disappointment",
  "System Outage Frustration",
  "Payment Processing Failure",
  "Hold Time Complaint",
  "Agent Behavior",
  "Transfer Loop",
  "Resolution Failure",
  "Disclosure Missing",
] as const;
```

All `/swedbank/social/*` charts must be filtered through this list — that's what turns "brand sentiment" into "service-driven brand sentiment".

### 4.5 TSX scaffold

```tsx
// frontend/components/role-based-dashboard/drill-downs/ServiceReputationDrillDown.tsx
"use client";

import { useState } from "react";
import { ArrowRight, ShieldAlert } from "lucide-react";
import { RiskRadarPolar } from "@/app/swedbank/email/executive/components/RiskRadarPolar";
import { ChannelSentimentSplitChart } from "@/app/swedbank/social/components/ChannelSentimentSplitChart";
import { PositiveNegativeTopicVolumeChart } from "@/app/swedbank/social/components/PositiveNegativeTopicVolumeChart";
import { ComplianceScoreMeter } from "@/app/swedbank/compliance-fci/compliance/components/ComplianceScoreMeter";
import { ViolationCategoryChart } from "@/app/swedbank/compliance-fci/compliance/components/ViolationCategoryChart";
import { ActiveRisksTable } from "@/app/swedbank/compliance-fci/compliance/components/ActiveRisksTable";
import { RiskAlertPanel } from "@/app/swedbank/compliance-fci/compliance/components/RiskAlertPanel";
import { RedFlagDistributionChart } from "@/app/swedbank/compliance-fci/compliance-signals/components/RedFlagDistributionChart";
import { EisenhowerMatrix } from "@/app/swedbank/email/components/EisenhowerMatrix";
import { IntentFlowMap } from "@/app/swedbank/email/executive/components/IntentFlowMap";
import { AIActionSuggestionWall } from "@/app/swedbank/compliance-fci/compliance-signals/components/AIActionSuggestionWall";

export const SERVICE_DRIVEN_TOPICS = [
  "Account Access", "Fee Dispute", "Customer Service Disappointment",
  "System Outage Frustration", "Payment Processing Failure",
  "Hold Time Complaint", "Agent Behavior", "Transfer Loop",
  "Resolution Failure", "Disclosure Missing",
] as const;

type Props = { onInvestigate: () => void };

export default function ServiceReputationDrillDown({ onInvestigate }: Props) {
  const [period, setPeriod] = useState<"7d" | "30d" | "90d">("30d");
  const [riskLens, setRiskLens] = useState<"all" | "cfpb" | "social" | "appstore">("all");

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between rounded-2xl border border-white/10 bg-gradient-to-r from-slate-900/80 to-slate-900/40 px-6 py-4">
        <div>
          <h2 className="font-outfit text-2xl font-semibold text-white">
            Is service hurting our reputation?
          </h2>
          <p className="mt-1 text-sm text-white/60">
            Brand + regulatory risk created by contact-centre failures
          </p>
        </div>
        <div className="flex gap-2">
          <Picker value={period} onChange={setPeriod} options={[["7d","7d"],["30d","30d"],["90d","90d"]]} />
          <Picker value={riskLens} onChange={setRiskLens} options={[
            ["All risk","all"],["CFPB","cfpb"],["Social","social"],["App Store","appstore"]
          ]} />
        </div>
      </div>

      {/* Risk KPI ribbon */}
      <div className="grid grid-cols-5 gap-3">
        <RiskKPI label="Open complaints"       value="247" delta="+12"   />
        <RiskKPI label="CFPB-risk cases"        value="18"  delta="+3"    severity="critical" />
        <RiskKPI label="Escalation %"           value="12%" delta="+1.4pp"/>
        <RiskKPI label="Social spillover"       value="38%" delta="+6pp"  severity="high" />
        <RiskKPI label="App-store service drift" value="24%" delta="+5pp" />
      </div>

      {/* Row 1 */}
      <div className="grid grid-cols-2 gap-4">
        <Panel title="Risk radar — CFPB / press / social / app / Trustpilot / internal">
          <RiskRadarPolar />
        </Panel>
        <Panel title="Service-driven brand sentiment by channel">
          <ChannelSentimentSplitChart topicFilter={SERVICE_DRIVEN_TOPICS} />
        </Panel>
      </div>

      {/* Row 2 */}
      <div className="grid grid-cols-3 gap-4">
        <Panel title="CC compliance score">
          <ComplianceScoreMeter />
        </Panel>
        <Panel title="Violation categories">
          <ViolationCategoryChart />
          <RedFlagDistributionChart compact />
        </Panel>
        <Panel title="Active risks">
          <RiskAlertPanel />
          <ActiveRisksTable />
        </Panel>
      </div>

      {/* Row 3 */}
      <div className="grid grid-cols-2 gap-4">
        <Panel title="Service complaints by urgency × impact">
          <EisenhowerMatrix filter="service-driven" />
        </Panel>
        <Panel title="Complaint → social → regulator pathway">
          <IntentFlowMap mode="escalation" />
        </Panel>
      </div>

      {/* Service-driven topic volume */}
      <Panel title="Service-driven topic volume (positive vs negative)">
        <PositiveNegativeTopicVolumeChart topicFilter={SERVICE_DRIVEN_TOPICS} />
      </Panel>

      {/* AI suggestions */}
      <Panel title="AI action suggestions (red-flag cases)">
        <AIActionSuggestionWall />
      </Panel>

      <button
        onClick={onInvestigate}
        className="flex w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-teal-500 to-emerald-500 py-3 font-outfit text-sm font-semibold text-white"
      >
        Investigate root cause <ArrowRight className="h-4 w-4" />
      </button>
    </div>
  );
}

function RiskKPI({ label, value, delta, severity }: {
  label: string; value: string; delta: string; severity?: "critical" | "high"
}) {
  const ring =
    severity === "critical" ? "ring-2 ring-rose-500/60"
    : severity === "high"   ? "ring-2 ring-amber-500/60"
    : "";
  return (
    <div className={`rounded-2xl border border-white/10 bg-slate-900/60 p-4 ${ring}`}>
      <div className="text-xs text-white/50">{label}</div>
      <div className="mt-1 font-jetbrains text-2xl font-semibold text-white">{value}</div>
      <div className="mt-1 text-xs text-rose-400">{delta}</div>
    </div>
  );
}

function Panel({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-slate-900/50 p-5">
      <h3 className="mb-3 font-outfit text-base text-white/90">{title}</h3>
      <div className="space-y-3">{children}</div>
    </div>
  );
}

function Picker<T extends string>({ value, onChange, options }: {
  value: T; onChange: (v: T) => void; options: Array<[string, T]>;
}) {
  return (
    <div className="flex rounded-lg border border-white/10 bg-slate-800/60 p-1 text-xs">
      {options.map(([label, v]) => (
        <button key={v} onClick={() => onChange(v)}
          className={`px-2 py-1 rounded ${value === v ? "bg-teal-500/30 text-teal-100" : "text-white/60"}`}
        >{label}</button>
      ))}
    </div>
  );
}
```

---

## 5 · DRILL-DOWN 3 · "Can the engine deliver?"

This is the most operationally-loaded screen — workforce + SLA + capacity + BPO + containment + cost-of-bad-service. This is also the screen where the **two recommended enhancements** live: **(a) cost-of-bad-service overlay**, **(b) containment & avoidable-contacts panel**.

### 5.1 Tile in Screen 3 (already wired in `contactTileInfo[2]`)

Title: `Service Operations` · Subtitle: `Workforce, SLA, BPO, capacity`
Score gauge: weighted blend of `(SL_actual / SL_target) × 0.4 + (1 - abandonRate) × 0.3 + scheduleAdherence × 0.2 + (1 - bpoBreachRate) × 0.1`
Three mini-stat rows (with In-house vs BPO Beta side-by-side):
- **In-house FCR** · 81% · ▼ -1.2pp
- **BPO Beta FCR** · 62% · ▼ -3.8pp (red flag)
- **SL 80/20** · 76/22 · ▼ below target

### 5.2 Sub-screen layout (`ServiceOperationsDrillDown`)

```
┌─ Header strip ───────────────────────────────────────────────────────┐
│ "Can the engine deliver?"  | Live ▾ | Vendor ▾ | Channel ▾          │
└──────────────────────────────────────────────────────────────────────┘

┌─ SLA / Engine Ribbon (6 cards across) ───────────────────────────────┐
│ SL 80/20 | AHT | Abandon | ASA | Occupancy | Sched Adherence        │
│  76/22  |6:42 |  6.4%   |42s |   88%      |     91%                │
└──────────────────────────────────────────────────────────────────────┘

┌─ NEW · Cost-of-bad-service overlay ─────────────────────────────────┐
│ Weekly $ at risk: $312,400  ▲ +18%                                  │
│  Breakdown: SLA breach $112K | BPO penalty $84K | Avoidable $116K   │
└──────────────────────────────────────────────────────────────────────┘

┌─ Row 1 (2 cards) ────────────────────────────────────────────────────┐
│ ┌─ Queue Health Monitor (1/2) ───┐  ┌─ Bottleneck Heatmap (1/2) ─┐ │
│ │ Live SL by queue, depth, ASA   │  │ Hour × queue heatmap of    │ │
│ │ (the single best operations    │  │ where work stalls          │ │
│ │  anchor for this drill-down)   │  │                            │ │
│ └────────────────────────────────┘  └────────────────────────────┘ │
└──────────────────────────────────────────────────────────────────────┘

┌─ Row 2 (3 cards) ────────────────────────────────────────────────────┐
│ ┌─ In-house vs BPO Health ┐ ┌─ Call Center Risk ┐ ┌─ Anomaly Alerts ┐
│ │ (ComplianceHealth         │ │ Heat Map (unit ×  │ │ (forecast       │
│ │  SummaryCard side-by-side)│ │  metric grid)     │ │  variance, etc) │
│ └───────────────────────────┘ └───────────────────┘ └─────────────────┘
└──────────────────────────────────────────────────────────────────────┘

┌─ Row 3 (2 cards) ────────────────────────────────────────────────────┐
│ ┌─ Team Health (Voice) ─────────┐  ┌─ Action Coaching ──────────┐  │
│ │ QA, compliance, escalation,    │  │ Coaching tickets, agent     │  │
│ │ schedule adherence — voice     │  │ leaderboard, skill-gap grid │  │
│ │ + agent watchlist underneath   │  │                             │  │
│ └────────────────────────────────┘  └─────────────────────────────┘  │
└──────────────────────────────────────────────────────────────────────┘

┌─ NEW · Containment & avoidable contacts ─────────────────────────────┐
│ Self-service containment %  |  Bot→human handoff %  |  Avoidable    │
│        62%                  |        18%             |  contacts by  │
│                                                       |  intent       │
└──────────────────────────────────────────────────────────────────────┘

┌─ Row 4 ──────────────────────────────────────────────────────────────┐
│ System Health Ribbon  +  Cross-channel trend chart                  │
└──────────────────────────────────────────────────────────────────────┘

┌─ CTA ────────────────────────────────────────────────────────────────┐
│ [ Investigate root cause →  ]                                       │
└──────────────────────────────────────────────────────────────────────┘
```

### 5.3 Existing components to reuse

| Slot in layout | Existing component | Source path |
|---|---|---|
| Queue Health | `QueueHealthMonitor` | `/swedbank/email/manager` |
| Bottleneck Heatmap | `BottleneckHeatmap` | `/swedbank/email/manager` |
| In-house vs BPO | `ComplianceHealthSummaryCard` (side-by-side) | `/swedbank/compliance-fci/unit-performance` |
| Call Center Risk | `CallCenterRiskHeatMap` | `/swedbank/compliance-fci/unit-performance` |
| Anomaly Alerts | `AnomalyAlertsPanel` + `DecisionDebtTracker` | `/swedbank/email/manager` |
| Team Health | `TeamHealthColumn` | `/swedbank/voice` |
| Agent Watchlist | `AgentWatchlist` | `/swedbank/compliance-fci/unit-performance` |
| Action Coaching | `ActionCoachingColumn` (uses `agentLeaderboard`, `skillGapData`, `coachingTickets`) | `/swedbank/voice` |
| System Health | `SystemHealthRibbon` | `/swedbank/main-page/Channel Analysis` |
| Cross-channel trend | `CrossChannelTrendChart` | `/swedbank/main-page/Channel Analysis` |
| Intent distribution | `IntentDistribution` (drives avoidable-contacts panel) | `/swedbank/email` |
| Intent intelligence | `IntentIntelligenceCommandCenter` | `/swedbank/main-page/Intent Analysis` |
| **NEW · Cost-of-bad-service** | **Build new — pattern lifted from `/swedbank/email/finance`** | new |
| **NEW · Containment & avoidable** | **Build new — composes `IntentIntelligenceCommandCenter` + `topicDistribution`** | new |

### 5.4 NEW · `CostOfBadServiceOverlay` (build this)

```tsx
// frontend/components/role-based-dashboard/widgets/CostOfBadServiceOverlay.tsx
import { TrendingUp, AlertTriangle, Banknote, Repeat } from "lucide-react";

type Breakdown = { label: string; amount: number; icon: React.ComponentType<any>; tone: string };

export function CostOfBadServiceOverlay({
  weeklyAtRisk = 312_400,
  weekOverWeek = 0.18,
  breakdown = [
    { label: "SLA breach",      amount: 112_000, icon: AlertTriangle, tone: "text-rose-400"   },
    { label: "BPO penalty",     amount:  84_000, icon: Banknote,      tone: "text-amber-400"  },
    { label: "Avoidable contacts", amount: 116_400, icon: Repeat,     tone: "text-teal-300"   },
  ] as Breakdown[],
}) {
  return (
    <div className="rounded-2xl border border-rose-500/30 bg-gradient-to-r from-rose-950/40 to-slate-900/60 p-5">
      <div className="flex items-baseline justify-between">
        <div>
          <div className="flex items-center gap-2 text-xs uppercase tracking-wide text-rose-300/80">
            <TrendingUp className="h-3.5 w-3.5" />
            Weekly $ at risk from bad service
          </div>
          <div className="mt-1 font-jetbrains text-3xl font-semibold text-white">
            ${weeklyAtRisk.toLocaleString()}
          </div>
        </div>
        <div className="text-sm text-rose-300">
          ▲ +{(weekOverWeek * 100).toFixed(0)}% WoW
        </div>
      </div>

      <div className="mt-4 grid grid-cols-3 gap-3">
        {breakdown.map(b => (
          <div key={b.label} className="rounded-xl border border-white/10 bg-slate-900/50 p-3">
            <div className={`flex items-center gap-2 text-xs ${b.tone}`}>
              <b.icon className="h-3.5 w-3.5" />
              {b.label}
            </div>
            <div className="mt-1 font-jetbrains text-lg font-semibold text-white">
              ${b.amount.toLocaleString()}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
```

### 5.5 NEW · `ContainmentAvoidableContactsPanel` (build this)

```tsx
// frontend/components/role-based-dashboard/widgets/ContainmentAvoidableContactsPanel.tsx
import { Bot, ArrowRightLeft, AlertCircle } from "lucide-react";
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip } from "recharts";

const AVOIDABLE_BY_INTENT = [
  { intent: "Card activation",     volume: 1240, deflectable: 0.78 },
  { intent: "Balance enquiry",     volume:  980, deflectable: 0.92 },
  { intent: "Statement download",  volume:  720, deflectable: 0.85 },
  { intent: "PIN reset",           volume:  640, deflectable: 0.55 },
  { intent: "Transfer status",     volume:  510, deflectable: 0.71 },
];

export function ContainmentAvoidableContactsPanel() {
  return (
    <div className="rounded-2xl border border-white/10 bg-slate-900/50 p-5">
      <h3 className="mb-3 font-outfit text-base text-white/90">
        Containment & avoidable contacts
      </h3>

      <div className="grid grid-cols-3 gap-3">
        <Stat icon={Bot}            label="Self-service containment" value="62%" delta="+2.1pp" good />
        <Stat icon={ArrowRightLeft} label="Bot → human handoff"      value="18%" delta="-0.6pp" good />
        <Stat icon={AlertCircle}    label="Avoidable contacts (wk)"   value="4,090" delta="+312"  bad />
      </div>

      <div className="mt-5">
        <div className="mb-2 text-xs text-white/50">Avoidable by intent (deflection potential)</div>
        <div className="h-44">
          <ResponsiveContainer>
            <BarChart data={AVOIDABLE_BY_INTENT} layout="vertical">
              <XAxis type="number" hide />
              <YAxis type="category" dataKey="intent" tick={{ fill: "#cbd5e1", fontSize: 11 }} width={140} />
              <Tooltip cursor={{ fill: "rgba(20,184,166,0.08)" }} />
              <Bar dataKey="volume" fill="#14b8a6" radius={[0, 4, 4, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}

function Stat({ icon: Icon, label, value, delta, good, bad }: any) {
  return (
    <div className="rounded-xl border border-white/10 bg-slate-950/40 p-3">
      <div className="flex items-center gap-2 text-xs text-white/60">
        <Icon className="h-3.5 w-3.5 text-teal-300" />
        {label}
      </div>
      <div className="mt-1 font-jetbrains text-xl font-semibold text-white">{value}</div>
      <div className={`mt-0.5 text-xs ${good ? "text-emerald-400" : bad ? "text-rose-400" : "text-white/50"}`}>{delta}</div>
    </div>
  );
}
```

### 5.6 Full TSX scaffold for `ServiceOperationsDrillDown`

```tsx
// frontend/components/role-based-dashboard/drill-downs/ServiceOperationsDrillDown.tsx
"use client";

import { useState } from "react";
import { ArrowRight } from "lucide-react";
import { QueueHealthMonitor } from "@/app/swedbank/email/manager/components/QueueHealthMonitor";
import { BottleneckHeatmap } from "@/app/swedbank/email/manager/components/BottleneckHeatmap";
import { AnomalyAlertsPanel } from "@/app/swedbank/email/manager/components/AnomalyAlertsPanel";
import { DecisionDebtTracker } from "@/app/swedbank/email/manager/components/DecisionDebtTracker";
import { TeamHealthColumn } from "@/app/swedbank/voice/components/TeamHealthColumn";
import { ActionCoachingColumn } from "@/app/swedbank/voice/components/ActionCoachingColumn";
import { CallCenterRiskHeatMap } from "@/app/swedbank/compliance-fci/unit-performance/components/CallCenterRiskHeatMap";
import { AgentWatchlist } from "@/app/swedbank/compliance-fci/unit-performance/components/AgentWatchlist";
import { ComplianceHealthSummaryCard } from "@/app/swedbank/compliance-fci/unit-performance/components/ComplianceHealthSummaryCard";
import { SystemHealthRibbon } from "@/app/swedbank/main-page/components/SystemHealthRibbon";
import { CrossChannelTrendChart } from "@/app/swedbank/main-page/components/CrossChannelTrendChart";
import { CostOfBadServiceOverlay } from "../widgets/CostOfBadServiceOverlay";
import { ContainmentAvoidableContactsPanel } from "../widgets/ContainmentAvoidableContactsPanel";

type Props = { onInvestigate: () => void };

export default function ServiceOperationsDrillDown({ onInvestigate }: Props) {
  const [view, setView] = useState<"live" | "today" | "7d">("live");
  const [vendor, setVendor] = useState<"all" | "inhouse" | "bpo-beta">("all");
  const [channel, setChannel] = useState<"all" | "voice" | "email" | "chat">("all");

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between rounded-2xl border border-white/10 bg-gradient-to-r from-slate-900/80 to-slate-900/40 px-6 py-4">
        <div>
          <h2 className="font-outfit text-2xl font-semibold text-white">
            Can the engine deliver?
          </h2>
          <p className="mt-1 text-sm text-white/60">
            Workforce · SLA · capacity · BPO · containment · cost-at-risk
          </p>
        </div>
        <div className="flex gap-2">
          <Picker value={view} onChange={setView} options={[
            ["Live","live"],["Today","today"],["7d","7d"]
          ]} />
          <Picker value={vendor} onChange={setVendor} options={[
            ["All","all"],["In-house","inhouse"],["BPO Beta","bpo-beta"]
          ]} />
          <Picker value={channel} onChange={setChannel} options={[
            ["All","all"],["Voice","voice"],["Email","email"],["Chat","chat"]
          ]} />
        </div>
      </div>

      {/* SLA / Engine ribbon */}
      <div className="grid grid-cols-6 gap-3">
        <EngineKPI label="SL 80/20"       value="76/22" delta="-4pp"   bad />
        <EngineKPI label="AHT"            value="6:42"  delta="+0:12"  bad />
        <EngineKPI label="Abandon"        value="6.4%"  delta="+0.8pp" bad />
        <EngineKPI label="ASA"            value="42s"   delta="+8s"    bad />
        <EngineKPI label="Occupancy"      value="88%"   delta="+1pp"   warn />
        <EngineKPI label="Sched adherence" value="91%"  delta="-0.3pp" />
      </div>

      {/* NEW: cost-of-bad-service overlay */}
      <CostOfBadServiceOverlay />

      {/* Row 1 */}
      <div className="grid grid-cols-2 gap-4">
        <Panel title="Queue health (live SL · depth · ASA)">
          <QueueHealthMonitor />
        </Panel>
        <Panel title="Where work is stalling">
          <BottleneckHeatmap />
        </Panel>
      </div>

      {/* Row 2 */}
      <div className="grid grid-cols-3 gap-4">
        <Panel title="In-house vs BPO Beta">
          <ComplianceHealthSummaryCard mode="vendor-split" />
        </Panel>
        <Panel title="Risk heat map (unit × metric)">
          <CallCenterRiskHeatMap />
        </Panel>
        <Panel title="Anomalies & forecast variance">
          <AnomalyAlertsPanel />
          <DecisionDebtTracker />
        </Panel>
      </div>

      {/* Row 3 */}
      <div className="grid grid-cols-2 gap-4">
        <Panel title="Team health">
          <TeamHealthColumn />
          <AgentWatchlist />
        </Panel>
        <Panel title="Action & coaching">
          <ActionCoachingColumn />
        </Panel>
      </div>

      {/* NEW: containment & avoidable */}
      <ContainmentAvoidableContactsPanel />

      {/* Row 4 */}
      <div className="grid grid-cols-2 gap-4">
        <Panel title="System health">
          <SystemHealthRibbon />
        </Panel>
        <Panel title="Cross-channel trend">
          <CrossChannelTrendChart />
        </Panel>
      </div>

      <button
        onClick={onInvestigate}
        className="flex w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-teal-500 to-emerald-500 py-3 font-outfit text-sm font-semibold text-white"
      >
        Investigate root cause <ArrowRight className="h-4 w-4" />
      </button>
    </div>
  );
}

function EngineKPI({ label, value, delta, bad, warn }: any) {
  const ring = bad ? "ring-1 ring-rose-500/40" : warn ? "ring-1 ring-amber-500/40" : "";
  return (
    <div className={`rounded-2xl border border-white/10 bg-slate-900/60 p-4 ${ring}`}>
      <div className="text-xs text-white/50">{label}</div>
      <div className="mt-1 font-jetbrains text-2xl font-semibold text-white">{value}</div>
      <div className={`mt-1 text-xs ${bad ? "text-rose-400" : warn ? "text-amber-300" : "text-white/40"}`}>{delta}</div>
    </div>
  );
}

function Panel({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-slate-900/50 p-5">
      <h3 className="mb-3 font-outfit text-base text-white/90">{title}</h3>
      <div className="space-y-3">{children}</div>
    </div>
  );
}

function Picker<T extends string>({ value, onChange, options }: any) {
  return (
    <div className="flex rounded-lg border border-white/10 bg-slate-800/60 p-1 text-xs">
      {options.map(([label, v]: any) => (
        <button key={v} onClick={() => onChange(v)}
          className={`px-2 py-1 rounded ${value === v ? "bg-teal-500/30 text-teal-100" : "text-white/60"}`}
        >{label}</button>
      ))}
    </div>
  );
}
```

---

## 6 · Wiring into `RoleDashboardView.tsx`

The shell already renders the right tile concept for `head_contact`. Three changes:

### 6.1 Update tile titles + subtitles
In `contactTileInfo` set:

```ts
const contactTileInfo = [
  { title: "Customer Experience",   subtitle: "Are contacts ending well?",       drill: "experience"   },
  { title: "Service Reputation",    subtitle: "Is service hurting our reputation?", drill: "reputation" },
  { title: "Service Operations",    subtitle: "Can the engine deliver?",         drill: "operations"  },
];
```

### 6.2 Route the tile click → drill component

```tsx
// inside RoleDashboardView.tsx, where retail/cards drill components are switched
import ContactExperienceDrillDown    from "./drill-downs/ContactExperienceDrillDown";
import ServiceReputationDrillDown    from "./drill-downs/ServiceReputationDrillDown";
import ServiceOperationsDrillDown    from "./drill-downs/ServiceOperationsDrillDown";

const contactDrills = {
  experience: ContactExperienceDrillDown,
  reputation: ServiceReputationDrillDown,
  operations: ServiceOperationsDrillDown,
};

// inside Screen 4 render for head_contact:
const ActiveDrill = contactDrills[selectedDrill];
return <ActiveDrill onInvestigate={() => goToScreen5(selectedDrill)} />;
```

### 6.3 Pass the right accent

`RoleDashboardView` already has an `accentClass` token for retail (`from-amber-500 to-yellow-600`) and cards (`from-cyan-500 to-sky-500`). Add:

```ts
const ACCENT_BY_ROLE: Record<RoleId, string> = {
  head_retail:  "from-amber-500 to-yellow-600",
  head_cards:   "from-cyan-500 to-sky-500",
  head_contact: "from-teal-500 to-emerald-500",
};
```

### 6.4 File structure

```
frontend/
└── components/
    └── role-based-dashboard/
        ├── RoleDashboardView.tsx           (existing — minor edits per §6.1–6.3)
        ├── drill-downs/
        │   ├── ContactExperienceDrillDown.tsx     (NEW · §3.4)
        │   ├── ServiceReputationDrillDown.tsx     (NEW · §4.5)
        │   └── ServiceOperationsDrillDown.tsx     (NEW · §5.6)
        └── widgets/
            ├── CostOfBadServiceOverlay.tsx        (NEW · §5.4)
            └── ContainmentAvoidableContactsPanel.tsx  (NEW · §5.5)
```

---

## 7 · Cursor execution checklist

When Cursor starts:

1. ✅ Read `frontend/components/role-based-dashboard/RoleDashboardView.tsx` — confirm `contactTileInfo`, `contactTileTrendMeta`, and the three placeholder drill components exist.
2. ✅ Confirm the 30+ component files referenced under `/swedbank/*` exist with the names listed in §3.3 / §4.3 / §5.3. If a name differs, do a project-wide grep before editing (e.g., `ToneDriftWall` may be exported from a different file).
3. ✅ Create the three new drill-down files in `drill-downs/` (§3.4, §4.5, §5.6).
4. ✅ Create the two new widgets in `widgets/` (§5.4, §5.5).
5. ✅ Edit `RoleDashboardView.tsx` per §6.1–§6.3.
6. ✅ Verify imports — every `@/app/swedbank/...` import must resolve. If not, fall back to a relative `../../app/swedbank/...` path or fix the tsconfig path alias.
7. ✅ Each drill-down must render in isolation **without errors** even when child components mock-fall-back. Wrap any uncertain child component in a `<ErrorBoundary>` or a `try/catch`-style fallback panel ("Component unavailable") so the parent screen never blank-pages.
8. ✅ Apply the **teal/emerald** accent (`from-teal-500 to-emerald-500`) consistently. No purple, no cyan, no gold on the head_contact role.
9. ✅ Do not add new fonts — only `font-outfit` and `font-jetbrains` (already configured).
10. ✅ Type-check: `pnpm tsc --noEmit` must pass.

---

## 8 · Two enhancements vs. what's there today (rationale)

These two are explicitly called out because every modern US bank CC head reports them up to the C-suite:

1. **Cost-of-bad-service overlay (§5.4)** — translates SLA breach + abandon + BPO underperformance into estimated weekly $. The pattern already exists in `/swedbank/email/finance` (€312K exposure). Lifting it to the operations drill-down makes the dashboard speak C-suite language.

2. **Containment & avoidable-contacts panel (§5.5)** — self-service containment %, bot-to-human handoff rate, and avoidable-contacts by intent. Drives the "demand management" conversation. Data already exists in `IntentIntelligenceCommandCenter` and `topicDistribution` — just needs the panel.

---

## 9 · Research sources (for reference)

- Horace Mann VP Customer Care & Contact Center JD
- US Bank Customer Contact Center org structure
- RingCentral RingCX (250+ pre-built contact-center reports, 350+ metrics)
- Sprinklr Contact Center Dashboards (CX, agent productivity, compliance, multichannel)
- Nextiva contact-center KPIs
- ICMI (International Customer Management Institute) — translating CC metrics to C-suite dollars
- Aceyus — C-level metrics framework ("ABCD: always be collecting data")
- BlueTweak, callforce.global — banking CC operational benchmarks
- Unblu — top 10 call center KPIs in digital banking
- ClearPoint Strategy — banking KPI taxonomy

---

**End of spec. Cursor: build everything in §3.4, §4.5, §5.4, §5.5, §5.6, then apply the edits in §6.**
