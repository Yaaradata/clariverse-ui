"use client";

import { ArrowLeft } from "lucide-react";
import {
  createContext,
  type CSSProperties,
  type Dispatch,
  type ReactNode,
  type SetStateAction,
  useContext,
  useEffect,
  useState,
} from "react";

import { T as REGISTRY_THEME } from "@/lib/role-based-dashboard/registry";
import {
  DashboardThemeProvider,
  type DashboardThemeTokens,
} from "./DashboardThemeContext";

const TIME_WINDOWS = ["Today", "7 Days", "30 Days"] as const;
type TimeWindow = (typeof TIME_WINDOWS)[number];

const TimeWindowContext = createContext<TimeWindow>("Today");
function useTimeWindow(): TimeWindow {
  return useContext(TimeWindowContext);
}

type WindowFacts = {
  /** Multiplier for cumulative internal counts (contacts, calls, tickets). */
  mult: number;
  /** Cohort label used in subtitles. */
  cohortLabel: string;
  /** Risk pulse score for the window. */
  riskScore: number;
  /** Risk status label. */
  riskStatus: string;
  /** Public-review scale: 0..1 of the lifetime data we observed. */
  reviewScale: number;
  /** How constellation spark intervals aggregate for this window. */
  cadence: string;
};

function windowFacts(w: TimeWindow): WindowFacts {
  switch (w) {
    case "Today":
      return {
        mult: 0.14,
        cohortLabel: "today",
        riskScore: 58,
        riskStatus: "Watch",
        reviewScale: 0.012,
        cadence: "intraday slices",
      };
    case "7 Days":
      return {
        mult: 1,
        cohortLabel: "last 7 days",
        riskScore: 67,
        riskStatus: "Elevated",
        reviewScale: 0.14,
        cadence: "daily rollups",
      };
    case "30 Days":
      return {
        mult: 4.2,
        cohortLabel: "last 30 days",
        riskScore: 74,
        riskStatus: "Critical",
        reviewScale: 1,
        cadence: "weekly rollups",
      };
  }
}

function arcSectionTitle(w: TimeWindow): string {
  switch (w) {
    case "Today":
      return "Today's Arc · cross-channel pattern";
    case "7 Days":
      return "7-day Arc · cross-channel pattern";
    case "30 Days":
      return "30-day Arc · cross-channel pattern";
  }
}

/** Scale a base "7 Days" count to the active window. */
function scaleCount(base: number, w: TimeWindow): number {
  return Math.max(1, Math.round(base * windowFacts(w).mult));
}

/** Format a count with thousand separators. */
function fmt(n: number): string {
  return n.toLocaleString("en-US");
}

/** Scale a base $M figure to the active window. */
function scaleDollarsM(baseM: number, w: TimeWindow): string {
  const v = baseM * windowFacts(w).mult;
  if (v >= 1) {
    return `$${v.toFixed(1)}M`;
  }
  return `$${Math.round(v * 1000)}K`;
}

const COLORS = {
  bg: "#070707",
  card: "#0d0d0d",
  card2: "#121212",
  inset: "#1a1a1a",
  border: "#242424",
  border2: "#3a3a3a",
  text: "#ffffff",
  muted: "#939394",
  dim: "#6b7280",
  purple: "#5332FF",
  red: "#ef4444",
  amber: "#f59e0b",
  yellow: "#eab308",
  green: "#22c55e",
  cyan: "#38bdf8",
  blue: "#60a5fa",
} as const;

const severityColor = {
  Critical: COLORS.red,
  High: COLORS.amber,
  Watch: COLORS.yellow,
  Good: COLORS.green,
  Improving: COLORS.green,
  Working: COLORS.green,
  New: COLORS.purple,
  Pending: COLORS.dim,
  "Needs owner": COLORS.red,
} as const;

type SeverityKey = keyof typeof severityColor;

function cx(...items: Array<string | false | null | undefined>): string {
  return items.filter(Boolean).join(" ");
}

function list<T>(value: ReadonlyArray<T> | null | undefined): T[] {
  return value?.length ? [...value] : [];
}

function colorFor(severity: string): string {
  if (severity in severityColor) {
    return severityColor[severity as SeverityKey];
  }
  return COLORS.purple;
}

/** Intro strip above constellation-style stacks (Internal Voice Constellation grammar). */
const DASH_CONSTELLATION_INTRO =
  "mb-3 rounded-xl border border-white/10 bg-black/25 px-3 py-2 text-[11px] font-semibold leading-relaxed text-zinc-400";

/** Scroll region for stacked severity-tinted rows. */
const DASH_CONSTELLATION_STACK_SCROLL =
  "min-h-0 flex-1 space-y-3 overflow-y-auto overscroll-y-contain pr-1 [scrollbar-gutter:stable]";

/** Small caps label used inside constellation rows and matching surfaces. */
const DASH_CONSTELLATION_LABEL =
  "text-[10px] font-black uppercase tracking-wide text-zinc-500";

/** Nested metric / fact cell inside a tinted row. */
const DASH_CONSTELLATION_NEST = "rounded-xl border border-white/10 bg-black/25 p-2.5";

function dashConstellationRowSurface(severity: string): { className: string; style: CSSProperties } {
  const c = colorFor(severity);
  return {
    className: "rounded-2xl border p-3.5",
    style: { borderColor: `${c}55`, background: `${c}0c` },
  };
}

type HeadlineSignal = {
  id: string;
  severity: "Critical" | "High" | "Watch" | "Good";
  title: string;
  outcome: string;
  impact: string;
  insight: string;
  chain: ReadonlyArray<{ label: string; value: string }>;
  metrics: readonly string[];
};

function getHeadlineSignals(w: TimeWindow): readonly HeadlineSignal[] {
  const s = (n: number) => fmt(scaleCount(n, w));
  switch (w) {
    case "Today": {
      const repeatPct = 41;
      return [
        {
          id: "funding",
          severity: "Critical" as const,
          title: "Intraday spike: first deposit still reads as “frozen”",
          outcome: "Same-day money panic",
          impact: `${s(214)} contacts, ${s(43)} “when does this clear?” pivots, ${s(18)} closure-intent cues`,
          insight:
            "The queue is reacting to overnight holds and app balance refresh lag. Customers are not waiting for policy — they want a timestamp and a single coherent story before noon.",
          chain: [
            { label: "Push / SMS", value: "Deposit received alert" },
            { label: "App", value: "Available ≠ pending" },
            { label: "Voice", value: "I need it today" },
            { label: "Chat", value: "Bot → human bump" },
            { label: "Risk", value: "Threat to leave" },
          ],
          metrics: [
            "88% confidence",
            "+12% vs yesterday open",
            "12h oldest case",
            `${scaleDollarsM(1.8, w)} in-flight balance`,
          ],
        },
        {
          id: "auth",
          severity: "High" as const,
          title: "OTP + device swap is jamming the morning login path",
          outcome: "Self-service recovery is breaking",
          impact: `${s(86)} auth calls, ${s(31)} bounce-backs, ${s(41)} device-trust mismatches`,
          insight:
            "Hourly pattern: new phone + SMS delay + trusted-device step customers cannot complete. Support is becoming the only unlock, which shows up as repeat dial-ins within minutes.",
          chain: [
            { label: "Login / OTP event", value: "OTP failed after phone change" },
            { label: "App", value: "Trusted device loop" },
            { label: "Voice", value: "Cannot authenticate" },
            { label: "Ticket", value: "ID queue backlog" },
            { label: "Risk", value: "Same-day lockout" },
          ],
          metrics: [
            "84% confidence",
            `${s(31)} hourly loops`,
            `+${scaleCount(9, w)} “locked out” phrases`,
            "2.4 contacts/case (intraday)",
          ],
        },
        {
          id: "handoff",
          severity: "High" as const,
          title: "Live channel swaps are erasing the last thing the customer said",
          outcome: "Instant repeat explanation",
          impact: `${s(142)} warm transfers, ${s(23)} “you have no notes” moments, 4 tools`,
          insight:
            "Today’s failures are speed problems: chat escalates to voice without payload, so the customer repeats PII and story while the clock runs. It feels careless, not complex.",
          chain: [
            { label: "Chat", value: "Case link missing" },
            { label: "Voice", value: "Warm transfer, cold start" },
            { label: "CRM", value: "Two ticket IDs" },
            { label: "Email", value: "Conflicting ETA" },
            { label: "Risk", value: "Supervisor demand" },
          ],
          metrics: [
            "81% confidence",
            `${s(142)} handoffs`,
            "4 channels touched",
            `${repeatPct - 20}% likely second contact`,
          ],
        },
      ];
    }
    case "7 Days": {
      const repeatPct = 47;
      return [
        {
          id: "funding",
          severity: "Critical" as const,
          title: "First funding is the trust break",
          outcome: "Money-access anxiety",
          impact: `${s(214)} contacts, ${s(43)} past promise, ${s(18)} closure-intent signals`,
          insight:
            "Customers are not only asking when the transfer clears. They are asking whether their money is safe because available balance, hold period, and support explanation do not align.",
          chain: [
            { label: "Account activity", value: "First deposit hold" },
            { label: "Voice", value: "Where is my money?" },
            { label: "Chat", value: "Balance looks wrong" },
            { label: "Ticket", value: "No owner after 48h" },
            { label: "Risk", value: "Complaint language" },
          ],
          metrics: [
            "91% confidence",
            `+${repeatPct - 29}% repeat`,
            "14d oldest",
            `${scaleDollarsM(1.8, w)} balance affected`,
          ],
        },
        {
          id: "auth",
          severity: "High" as const,
          title: "Phone-change users cannot recover access without support",
          outcome: "Self-service recovery is breaking",
          impact: `${s(86)} auth calls, ${s(31)} loops, ${s(41)} failed auth events`,
          insight:
            "Phone-change and OTP issues are not isolated login failures. They create multi-contact loops because the recovery path requires the unavailable trusted device.",
          chain: [
            { label: "Login / OTP event", value: "OTP failed after phone change" },
            { label: "Voice", value: "New phone" },
            { label: "Ticket", value: "Verification pending" },
            { label: "Email", value: "Generic reset note" },
            { label: "Risk", value: "Blocked access" },
          ],
          metrics: [
            "87% confidence",
            `${s(31)} loops`,
            `+${scaleCount(9, w)} complaint phrases`,
            "3.1 contacts/case",
          ],
        },
        {
          id: "handoff",
          severity: "High" as const,
          title: "Case context is not traveling across channels",
          outcome: "Repeat-contact loop",
          impact: `${s(142)} repeat contacts, 4 channels, ${s(23)} complaint phrases`,
          insight:
            "Customers are re-explaining the same issue across voice, chat, email, and tickets. The failure is not a single interaction; it is lack of persistent case ownership.",
          chain: [
            { label: "Voice", value: "Explained once" },
            { label: "Chat", value: "Explained again" },
            { label: "Email", value: "Different answer" },
            { label: "Ticket", value: "No continuity" },
            { label: "Risk", value: "Escalation intent" },
          ],
          metrics: [
            "84% confidence",
            `${s(142)} repeats`,
            "4 channels",
            `${repeatPct - 20}% likely repeat`,
          ],
        },
      ];
    }
    case "30 Days": {
      const repeatPct = 53;
      return [
        {
          id: "funding",
          severity: "Critical" as const,
          title: "Month-long hold narrative is hardening into “you’re holding my money”",
          outcome: "Structural trust loss on availability",
          impact: `${s(214)} contacts, ${s(52)} multi-week tickets, ${s(28)} regulator-language mentions`,
          insight:
            "Over 30 days the story stops being a single transfer and becomes identity-level doubt: customers compare notes in reviews and forums, then bring that language back into calls.",
          chain: [
            { label: "Public reviews", value: "ACH delay thread" },
            { label: "Voice", value: "Week 2 still pending" },
            { label: "Ticket", value: "Doc ping-pong" },
            { label: "Email", value: "Contradictory dates" },
            { label: "Risk", value: "Formal complaint intent" },
          ],
          metrics: [
            "94% confidence",
            `+${repeatPct - 29}% repeat vs month open`,
            "31d oldest active",
            `${scaleDollarsM(1.8, w)} balance affected`,
          ],
        },
        {
          id: "auth",
          severity: "High" as const,
          title: "Digital access recovery is a chronic multi-week effort, not a login glitch",
          outcome: "Self-service recovery is breaking",
          impact: `${s(86)} auth calls, ${s(44)} chronic loops, ${s(41)} device events`,
          insight:
            "The monthly view shows the same households cycling through OTP, paper checks on identity, and branch-adjacent workarounds. Each cycle adds complaint vocabulary and screenshots.",
          chain: [
            { label: "Login / OTP event", value: "OTP failed after phone change" },
            { label: "Ticket", value: "Week-old verification" },
            { label: "Voice", value: "Third explanation" },
            { label: "Email", value: "Template loop" },
            { label: "Risk", value: "Funds behind a lock" },
          ],
          metrics: [
            "90% confidence",
            `${s(44)} chronic loops`,
            `+${scaleCount(14, w)} complaint phrases`,
            "4.6 contacts/case (30d)",
          ],
        },
        {
          id: "handoff",
          severity: "High" as const,
          title: "Cross-channel “case debt” — nobody owns the full timeline",
          outcome: "Repeat-contact loop",
          impact: `${s(142)} repeat contacts, ${s(31)} supervisor climbs, ${s(23)} complaint phrases`,
          insight:
            "Monthly aggregation shows customers accumulating partial answers in each channel. By week three they arrive with timelines, screen names, and prior agent IDs — and still no single owner.",
          chain: [
            { label: "Voice", value: "Case #1 story" },
            { label: "Chat", value: "Case #2 story" },
            { label: "Email", value: "Case #3 story" },
            { label: "Ticket", value: "Merged late" },
            { label: "Risk", value: "Exec / regulator threat" },
          ],
          metrics: [
            "88% confidence",
            `${s(142)} repeats`,
            "4+ channels typical",
            `${repeatPct - 20}% likely repeat`,
          ],
        },
      ];
    }
  }
}

function chainFromSignal(
  signal: HeadlineSignal,
): Array<{ label: string; value: string }> {
  return signal.chain.map((n) => ({ label: n.label, value: n.value }));
}

function metricsFromSignal(signal: HeadlineSignal): string[] {
  return [...signal.metrics];
}

type ChannelSignal = {
  channel: string;
  count: string;
  share: string;
  issue: string;
  phrase: string;
  severity: "Critical" | "High" | "Watch" | "Good";
  delta: string;
  topDispute: string;
  disputeCount: string;
  repeat: string;
  owner: string;
  sentiment: string;
};

function formatVolume(baseThousands: number, w: TimeWindow): string {
  const v = baseThousands * windowFacts(w).mult;
  if (v >= 1) {
    return `${v.toFixed(1)}K`;
  }
  return `${Math.round(v * 1000)}`;
}

function getChannelSignals(w: TimeWindow): readonly ChannelSignal[] {
  const s = (n: number) => fmt(scaleCount(n, w));
  const vol = (baseK: number) => formatVolume(baseK, w);

  switch (w) {
    case "Today":
      return [
        {
          channel: "Voice",
          count: vol(43),
          share: "56%",
          issue: "money-access anxiety",
          phrase: `"It still shows pending — I need access today"`,
          severity: "Critical",
          delta: "+14% vs yesterday",
          topDispute: "First-deposit hold / available balance",
          disputeCount: `${s(214)} cases`,
          repeat: "47% repeat",
          owner: "Deposit Ops",
          sentiment: "−0.63",
        },
        {
          channel: "Chat",
          count: vol(18.5),
          share: "24%",
          issue: "balance confusion",
          phrase: `"The bot said available but the app does not match"`,
          severity: "High",
          delta: "+9% vs yesterday",
          topDispute: "Hold explanation / ETA mismatch",
          disputeCount: `${s(163)} cases`,
          repeat: "31% repeat",
          owner: "CX Ops",
          sentiment: "2.1",
        },
        {
          channel: "Email",
          count: vol(9.8),
          share: "13%",
          issue: "generic replies",
          phrase: `"Please allow 3–5 business days" (no calendar anchor)"`,
          severity: "Watch",
          delta: "+6% vs yesterday",
          topDispute: "Clarification loop on availability",
          disputeCount: `${s(88)} cases`,
          repeat: "39% repeat",
          owner: "Email Ops",
          sentiment: "1.8",
        },
        {
          channel: "Tickets",
          count: vol(6.2),
          share: "8%",
          issue: "owner gap",
          phrase: `"I have been transferred three times and nobody owns this"`,
          severity: "Critical",
          delta: "+19% vs yesterday",
          topDispute: "Cross-channel handoff without payload",
          disputeCount: `${s(142)} cases`,
          repeat: "52% repeat",
          owner: "Back Office Ops",
          sentiment: "−0.55",
        },
      ];
    case "7 Days":
      return [
        {
          channel: "Voice",
          count: vol(42.8),
          share: "55%",
          issue: "money-access anxiety",
          phrase: `"I need to know when this clears"`,
          severity: "Critical",
          delta: "+18% WoW",
          topDispute: "First-deposit hold / available balance",
          disputeCount: `${s(214)} cases`,
          repeat: "47% repeat",
          owner: "Deposit Ops",
          sentiment: "−0.61",
        },
        {
          channel: "Chat",
          count: vol(18.4),
          share: "24%",
          issue: "balance confusion",
          phrase: `"Why is my transfer still on hold?"`,
          severity: "High",
          delta: "+11% WoW",
          topDispute: "Transfer hold + bot-to-human bump",
          disputeCount: `${s(163)} cases`,
          repeat: "31% repeat",
          owner: "CX Ops",
          sentiment: "2.0",
        },
        {
          channel: "Email",
          count: vol(9.7),
          share: "13%",
          issue: "generic replies",
          phrase: `"I already explained this in chat — read the thread"`,
          severity: "Watch",
          delta: "+9% WoW",
          topDispute: "Policy paragraph without dollars/dates",
          disputeCount: `${s(88)} cases`,
          repeat: "39% repeat",
          owner: "Email Ops",
          sentiment: "1.7",
        },
        {
          channel: "Tickets",
          count: vol(6.2),
          share: "8%",
          issue: "owner gap",
          phrase: `"Nobody has called me back — this is day five"`,
          severity: "Critical",
          delta: "+22% WoW",
          topDispute: "Merged late / no single owner",
          disputeCount: `${s(142)} cases`,
          repeat: "52% repeat",
          owner: "Back Office Ops",
          sentiment: "−0.52",
        },
      ];
    case "30 Days":
      return [
        {
          channel: "Voice",
          count: vol(42.8),
          share: "54%",
          issue: "money-access anxiety",
          phrase: `"I have called four times about the same hold"`,
          severity: "Critical",
          delta: "+21% MoM",
          topDispute: "First-deposit hold / available balance",
          disputeCount: `${s(214)} cases`,
          repeat: "49% repeat",
          owner: "Deposit Ops",
          sentiment: "−0.59",
        },
        {
          channel: "Chat",
          count: vol(18.6),
          share: "24%",
          issue: "balance confusion",
          phrase: `"Your app and your agent disagree on the balance"`,
          severity: "High",
          delta: "+14% MoM",
          topDispute: "Transfer hold + bot-to-human bump",
          disputeCount: `${s(168)} cases`,
          repeat: "33% repeat",
          owner: "CX Ops",
          sentiment: "1.9",
        },
        {
          channel: "Email",
          count: vol(9.9),
          share: "13%",
          issue: "generic replies",
          phrase: `"Stop sending templates — I need the post date"`,
          severity: "Watch",
          delta: "+10% MoM",
          topDispute: "Clarification loop on availability",
          disputeCount: `${s(92)} cases`,
          repeat: "41% repeat",
          owner: "Email Ops",
          sentiment: "1.6",
        },
        {
          channel: "Tickets",
          count: vol(6.4),
          share: "9%",
          issue: "owner gap",
          phrase: `"Escalated twice — still no written resolution"`,
          severity: "Critical",
          delta: "+26% MoM",
          topDispute: "Cross-channel handoff without payload",
          disputeCount: `${s(148)} cases`,
          repeat: "54% repeat",
          owner: "Back Office Ops",
          sentiment: "−0.54",
        },
      ];
  }
}

type CallRow = {
  rank: number;
  score: number;
  severity: "Critical" | "High" | "Watch" | "Good";
  title: string;
  reason: string;
  pattern: string;
  proof: string;
  evidence: string;
};

function getBestCalls(w: TimeWindow): readonly CallRow[] {
  const s = (n: number) => fmt(scaleCount(n, w));
  switch (w) {
    case "Today":
      return [
        {
          rank: 1,
          score: 96,
          severity: "Good" as const,
          title: "Supervisor pull saved a same-day funds panic",
          reason:
            "Lead agent summarized holds in plain dollars, added a named follow-up time, and stayed on until the customer saw the in-app message update.",
          pattern: "Use for intraday hold spikes when sentiment is already hot.",
          proof: "Voice · 22 min · 1 transfer",
          evidence: `${s(36)} comparable same-day saves`,
        },
        {
          rank: 2,
          score: 93,
          severity: "Good" as const,
          title: "OTP failure cleared in one live session (no ticket bounce)",
          reason:
            "Agent walked alternate verification, disabled the bad device flag, and confirmed login before hang-up — customer did not redial within the hour.",
          pattern: "Copy for device-swap mornings when SMS latency spikes.",
          proof: "Voice + auth log match",
          evidence: `${s(24)} same-shift resolutions`,
        },
        {
          rank: 3,
          score: 90,
          severity: "Good" as const,
          title: "Chat agent pasted the exact hold rule + calendar date",
          reason:
            "Instead of a policy paragraph, the agent sent one sentence with the business-day count and the expected post date — customer stayed in chat.",
          pattern: "Train as the default chat macro for first-deposit questions.",
          proof: "Chat transcript + CRM note",
          evidence: `${s(19)} deflected escalations`,
        },
      ];
    case "7 Days":
      return [
        {
          rank: 1,
          score: 94,
          severity: "Good" as const,
          title: "Funds-hold call converted frustration into wait confidence",
          reason:
            "Agent explained current vs available balance, gave the exact clearing window, and confirmed follow-up.",
          pattern: "Replicate for first-deposit confusion.",
          proof: "Voice + ticket match",
          evidence: `${s(48)} similar calls`,
        },
        {
          rank: 2,
          score: 91,
          severity: "Good" as const,
          title: "Trusted-device reset handled without bounce-back",
          reason:
            "Agent verified identity once and stayed with the customer until the next step was visible.",
          pattern: "Replicate for phone-change and OTP recovery.",
          proof: "Voice + auth-event match",
          evidence: `${s(31)} similar loops`,
        },
        {
          rank: 3,
          score: 88,
          severity: "Good" as const,
          title: "Rate shopper retained after app limitation concern",
          reason:
            "Agent acknowledged limitations and reframed the account as savings-first, not checking replacement.",
          pattern: "Replicate when APY attraction meets transfer concern.",
          proof: "Voice + chat match",
          evidence: `${s(22)} similar calls`,
        },
      ];
    case "30 Days":
      return [
        {
          rank: 1,
          score: 95,
          severity: "Good" as const,
          title: "Weekly coaching pod cut repeat funding calls by naming the “why”",
          reason:
            "Team lead reviewed ten transcripts, changed the opening line to acknowledge hold fear first, then data — complaints in that pod dropped before product shipped.",
          pattern: "Scale as a monthly ritual tied to new marketing pushes.",
          proof: "QM sample + repeat metric",
          evidence: `${s(112)} calls influenced`,
        },
        {
          rank: 2,
          score: 92,
          severity: "Good" as const,
          title: "Auth recovery playbook reduced chronic OTP loops over four weeks",
          reason:
            "Agents stopped restarting flows; they verified channel, escalated device flags once, and booked a single callback — loop rate fell in the pilot queue.",
          pattern: "Institutionalize for any region above 3 contacts per auth case.",
          proof: "Pilot queue vs control",
          evidence: `${s(58)} loop exits`,
        },
        {
          rank: 3,
          score: 89,
          severity: "Good" as const,
          title: "Proactive email after failed transfer cut silent churn",
          reason:
            "Ops sent a plain-language “what happened + next step” note within 24h of failure; customers replied in-channel instead of venting publicly.",
          pattern: "Pair with monitoring on return-code spikes.",
          proof: "Journey trigger + reply rate",
          evidence: `${s(41)} saves attributed`,
        },
      ];
  }
}

function getWorstCalls(w: TimeWindow): readonly CallRow[] {
  const s = (n: number) => fmt(scaleCount(n, w));
  switch (w) {
    case "Today":
      return [
        {
          rank: 1,
          score: 18,
          severity: "Critical" as const,
          title: "App update + login loop — customer gave up after chatbot circle",
          reason:
            "Customer hit a forced update, then OTP, then “something went wrong” with no status page. Chatbot kept resetting the flow; human queue time exceeded patience.",
          pattern: "Ship a status banner + bypass path before the next release window.",
          proof: "App build + chatbot path",
          evidence: `${s(27)} abandon signals today`,
        },
        {
          rank: 2,
          score: 24,
          severity: "Critical" as const,
          title: "Hold music + dead air — customer thought the bank hung up on a transfer",
          reason:
            "Mid-explanation silence while the agent researched; customer interpreted it as dismissal and posted while still on the line.",
          pattern: "Mandate talk-tracks during research pauses on money movement.",
          proof: "Voice recording QA flag",
          evidence: `${s(33)} similar friction marks`,
        },
        {
          rank: 3,
          score: 31,
          severity: "High" as const,
          title: "Two agents quoted different availability dates in one hour",
          reason:
            "No shared calculation view; second agent contradicted the first without acknowledging it, destroying credibility.",
          pattern: "Single source of truth for availability math on the desktop.",
          proof: "Back-to-back calls same ANI",
          evidence: `${s(14)} contradiction pairs`,
        },
      ];
    case "7 Days":
      return [
        {
          rank: 1,
          score: 22,
          severity: "Critical" as const,
          title: "Blocked-account issue repeated across four contacts",
          reason:
            "Customer moved chat to phone to email to supervisor without one accountable owner.",
          pattern: "Fix owner gap for multi-contact account-access cases.",
          proof: "3-day loop, 4 contacts",
          evidence: `${s(31)} similar loops`,
        },
        {
          rank: 2,
          score: 28,
          severity: "Critical" as const,
          title: "Funds-availability answer sounded like policy, not help",
          reason:
            "Agent gave a generic hold explanation but no customer-specific availability date.",
          pattern:
            "Fix scripts that explain policy without resolving the customer question.",
          proof: "Voice + email match",
          evidence: `${s(56)} similar calls`,
        },
        {
          rank: 3,
          score: 34,
          severity: "High" as const,
          title: "Fraud case required customer to re-explain everything",
          reason:
            "Case number existed, but context was not carried into the next interaction.",
          pattern: "Fix case-continuity between fraud notes and frontline support.",
          proof: "Voice + case-note match",
          evidence: `${s(19)} similar calls`,
        },
      ];
    case "30 Days":
      return [
        {
          rank: 1,
          score: 19,
          severity: "Critical" as const,
          title: "Month-long ticket ping-pong — customer still has no single owner",
          reason:
            "Twelve updates, three departments, zero consolidated timeline. Customer started citing BBB and CFPB language in the thirteenth contact.",
          pattern: "Executive escalation path + forced merge on day 5 for money-access.",
          proof: "Ticket age 27d · 12 public notes",
          evidence: `${s(67)} chronic no-owner cases`,
        },
        {
          rank: 2,
          score: 26,
          severity: "Critical" as const,
          title: "Payoff quote mismatch created “you stole my payment” narrative",
          reason:
            "Customer paid the number in the app; backend applied a different balance. Agent could not reconcile in real time.",
          pattern: "Reconcile payoff engine vs customer-facing quote monthly.",
          proof: "Ledger vs UI diff",
          evidence: `${s(44)} payoff disputes`,
        },
        {
          rank: 3,
          score: 33,
          severity: "High" as const,
          title: "Outbound promo email triggered regulator threat after a known service failure",
          reason:
            "Customer was mid-dispute on access; marketing blast landed the same week. Call opened with “I am filing” before product was mentioned.",
          pattern: "Suppress promos on active complaint / lockout cohorts.",
          proof: "Marketing send + case tag overlap",
          evidence: `${s(22)} overlap events`,
        },
      ];
  }
}

type RecoveryVerdict = "No movement" | "Improving" | "Working" | "New baseline";

type RecoveryBoardItem = {
  id: string;
  insight: string;
  severity: "Critical" | "High" | "Watch" | "Good";
  status: RecoveryVerdict;
  detected: string;
  customerPain: string;
  interventionSignal: string;
  howWeKnow: readonly string[];
  target: string;
  measured: string;
  confidence: number;
  progress: number;
  beforeStrip: string;
  afterStrip: string;
  verdict: RecoveryVerdict;
};

function getRecoveryBoard(w: TimeWindow): readonly RecoveryBoardItem[] {
  const s = (n: number) => fmt(scaleCount(n, w));
  switch (w) {
    case "Today":
      return [
        {
          id: "funding-copy",
          severity: "Critical" as const,
          insight: "Intraday funds-availability clarity",
          status: "No movement",
          detected: `${s(214)} same-day touches`,
          customerPain: "“The money showed up and then disappeared from available”",
          interventionSignal:
            "No confirmed messaging or hold-tool change yet; observed signal only — customers still quote conflicting app vs agent lines.",
          howWeKnow: [
            "Morning repeat cluster unchanged vs yesterday",
            "“Post today” language still spiking hourly",
            "Sentiment dip concentrated in first 3 hours of queue",
          ],
          target: "intraday repeat -20%",
          measured: "flat vs prior day open",
          confidence: 88,
          progress: 22,
          beforeStrip: `${s(214)} contacts · 41% intraday repeat · −0.52 sentiment`,
          afterStrip: `${s(214)} contacts · 41% intraday repeat · −0.51 sentiment`,
          verdict: "No movement",
        },
        {
          id: "auth-route",
          severity: "High" as const,
          insight: "Live-session OTP recovery",
          status: "Improving",
          detected: `${s(31)} hourly loops`,
          customerPain: "“I need access before the end of the business day”",
          interventionSignal:
            "Observed signal: agents completing verification in one sitting more often today; not confirmed as policy change.",
          howWeKnow: [
            "Second-call-within-60m down vs yesterday",
            "“Start over” phrases down in auth queue",
            "Chat abandon after OTP slightly improved",
          ],
          target: "same-hour bounce -25%",
          measured: "bounce -18% (intraday)",
          confidence: 84,
          progress: 58,
          beforeStrip: `${s(31)} loops · 2.4 contacts/case · −0.48 sentiment`,
          afterStrip: `${s(25)} loops · 2.0 contacts/case · −0.41 sentiment`,
          verdict: "Improving",
        },
        {
          id: "single-owner",
          severity: "Good" as const,
          insight: "Warm-transfer note quality",
          status: "Working",
          detected: `${s(142)} handoffs`,
          customerPain: "“Do I have to tell the whole story again?”",
          interventionSignal:
            "Observed signal: voice agents referencing prior chat ID unprompted in pilot pod — workflow confirmation pending.",
          howWeKnow: [
            "“Already explained” down in pilot pod only",
            "Transfer time-to-resolution improved in sample",
            "Customer thanks language up slightly post-transfer",
          ],
          target: "re-explain rate -15%",
          measured: "re-explain -12% (pilot)",
          confidence: 81,
          progress: 68,
          beforeStrip: `${s(142)} handoffs · 38% friction phrases`,
          afterStrip: `${s(142)} handoffs · 33% friction phrases`,
          verdict: "Working",
        },
        {
          id: "fraud-context",
          severity: "Watch" as const,
          insight: "Fraud queue continuity (today)",
          status: "New baseline",
          detected: `${s(19)} active fraud touches`,
          customerPain: "“Security said one thing, you say another”",
          interventionSignal:
            "Baseline: small sample but rising mentions of cross-team contradiction within single day.",
          howWeKnow: [
            "Contradiction phrases emerging in AM block",
            "Case ID references without attached notes",
            "Escalation keyword density up slightly",
          ],
          target: "contradiction mentions -10%",
          measured: "baseline (1 day)",
          confidence: 76,
          progress: 30,
          beforeStrip: `${s(19)} cases · same-day multi-touch`,
          afterStrip: "Watch next business day",
          verdict: "New baseline",
        },
      ];
    case "7 Days":
      return [
        {
          id: "funding-copy",
          severity: "Critical" as const,
          insight: "Funds-availability message",
          status: "No movement",
          detected: `${s(214)} contacts`,
          customerPain: "“I cannot access my money”",
          interventionSignal:
            "No confirmed workflow change detected in customer-facing explanation (observed recovery signal only).",
          howWeKnow: [
            "Repeat contact still 47%",
            "Unresolved language unchanged",
            "Available-balance confusion still rising",
          ],
          target: "repeat calls -30%",
          measured: "0% movement",
          confidence: 91,
          progress: 18,
          beforeStrip: `${s(214)} contacts · 47% repeat · −0.61 sentiment`,
          afterStrip: `${s(214)} contacts · 47% repeat · −0.60 sentiment`,
          verdict: "No movement",
        },
        {
          id: "auth-route",
          severity: "High" as const,
          insight: "Trusted-device recovery route",
          status: "Improving",
          detected: `${s(31)} loops`,
          customerPain: "“I changed my phone and cannot get back in”",
          interventionSignal:
            "Observed recovery signal: change in recovery language and lower repeat-contact loops (not workflow-confirmed).",
          howWeKnow: [
            "Repeat loops down 29%",
            "Lockout phrases down 18%",
            "“Cannot get back in” mentions down 24%",
          ],
          target: "loops -25%",
          measured: "loops -29%",
          confidence: 87,
          progress: 62,
          beforeStrip: `${s(31)} loops · 3.1 contacts/case · −0.54 sentiment`,
          afterStrip: `${s(22)} loops · 2.2 contacts/case · −0.38 sentiment`,
          verdict: "Improving",
        },
        {
          id: "single-owner",
          severity: "Good" as const,
          insight: "Single-owner repeat-contact rule",
          status: "Working",
          detected: `${s(142)} repeats`,
          customerPain: "“I keep getting a different answer”",
          interventionSignal:
            "Observed recovery signal: case-context language improved across follow-up contacts.",
          howWeKnow: [
            "Repeat contacts down 27%",
            "“Already explained” mentions down 21%",
            "Reopened tickets down 16%",
          ],
          target: "repeats -20%",
          measured: "repeats -27%",
          confidence: 84,
          progress: 74,
          beforeStrip: `${s(142)} repeats · 39% repeat · −0.49 sentiment`,
          afterStrip: `${s(104)} repeats · 28% repeat · −0.32 sentiment`,
          verdict: "Working",
        },
        {
          id: "fraud-context",
          severity: "Watch" as const,
          insight: "Fraud case continuity",
          status: "New baseline",
          detected: `${s(19)} cases`,
          customerPain: "“I have a case number but nobody has the history”",
          interventionSignal:
            "Baseline created from conversation pattern; no movement window yet (observed recovery signal only).",
          howWeKnow: [
            "Repeat history phrases detected",
            "Case-number mentions detected",
            "Escalation language detected",
          ],
          target: "handoffs -20%",
          measured: "baseline pending",
          confidence: 78,
          progress: 28,
          beforeStrip: `${s(19)} cases · 4.2 contacts/case · −0.57 sentiment`,
          afterStrip: "Baseline pending",
          verdict: "New baseline",
        },
      ];
    case "30 Days":
      return [
        {
          id: "funding-copy",
          severity: "Critical" as const,
          insight: "Month-scale funds narrative",
          status: "No movement",
          detected: `${s(214)} cumulative contacts`,
          customerPain: "“You have been holding my money for weeks”",
          interventionSignal:
            "No durable fix in customer-visible copy; public review language is reinforcing internal anxiety (observed signal only).",
          howWeKnow: [
            "Repeat still elevated week-over-week",
            "Regulator-keyword density up in voice",
            "Ticket age p95 worsened",
          ],
          target: "30d repeat -25%",
          measured: "repeat still +8% vs month start",
          confidence: 94,
          progress: 14,
          beforeStrip: `${s(214)} contacts · 53% repeat · −0.66 sentiment`,
          afterStrip: `${s(214)} contacts · 53% repeat · −0.65 sentiment`,
          verdict: "No movement",
        },
        {
          id: "auth-route",
          severity: "High" as const,
          insight: "Chronic digital lockout recovery",
          status: "Improving",
          detected: `${s(44)} chronic loops`,
          customerPain: "“Every week I get a different document request”",
          interventionSignal:
            "Observed signal: pilot markets show shorter loop length after playbook refresh — not rolled out globally.",
          howWeKnow: [
            "Loop length down in pilot vs control",
            "Screenshot uploads declining as % of sessions",
            "Supervisor pulls down slightly",
          ],
          target: "chronic loops -30%",
          measured: "loops -14% (pilot only)",
          confidence: 90,
          progress: 55,
          beforeStrip: `${s(44)} loops · 4.6 contacts/case · −0.58 sentiment`,
          afterStrip: `${s(38)} loops · 3.9 contacts/case · −0.50 sentiment`,
          verdict: "Improving",
        },
        {
          id: "single-owner",
          severity: "Good" as const,
          insight: "Executive escalation ownership",
          status: "Working",
          detected: `${s(142)} exec-tagged cases`,
          customerPain: "“Only a manager seems to move this”",
          interventionSignal:
            "Observed signal: exec queue shows cleaner closure language and fewer rouge re-opens after month-end review.",
          howWeKnow: [
            "Reopen rate down on exec cohort",
            "Median days-to-resolution improved",
            "Customer “thank you” closing lines up",
          ],
          target: "exec queue reopen -15%",
          measured: "reopen -18%",
          confidence: 86,
          progress: 72,
          beforeStrip: `${s(142)} cases · 31d avg age · high tension`,
          afterStrip: `${s(118)} cases · 24d avg age · cooling`,
          verdict: "Working",
        },
        {
          id: "fraud-context",
          severity: "Watch" as const,
          insight: "Fraud / disputes cross-team memory",
          status: "New baseline",
          detected: `${s(19)} month-long threads`,
          customerPain: "“Fraud and customer care give opposite instructions”",
          interventionSignal:
            "Baseline month: contradiction stories stable but loud — needs joint huddle metric next month.",
          howWeKnow: [
            "Contradiction phrases flat but high",
            "Multi-department tags per case rising",
            "Formal complaint cross-reference up",
          ],
          target: "contradiction rate -20%",
          measured: "flat (baseline month)",
          confidence: 79,
          progress: 32,
          beforeStrip: `${s(19)} threads · multi-week · high emotion`,
          afterStrip: "Compare to next 30d window",
          verdict: "New baseline",
        },
      ];
  }
}

/** Maps each arc / headline pattern to the recovery row shown in Customer Pain Recovery. */
function recoveryBoardItemForHeadlineSignal(w: TimeWindow, signalId: string): RecoveryBoardItem {
  const board = getRecoveryBoard(w);
  let recoveryId: string;
  switch (signalId) {
    case "funding":
      recoveryId = "funding-copy";
      break;
    case "auth":
      recoveryId = "auth-route";
      break;
    case "handoff":
      recoveryId = "single-owner";
      break;
    default:
      recoveryId = "funding-copy";
  }
  return board.find((row) => row.id === recoveryId) ?? board[0];
}

function verdictSeverity(v: RecoveryVerdict): string {
  switch (v) {
    case "No movement":
      return "Critical";
    case "Improving":
      return "High";
    case "Working":
      return "Good";
    case "New baseline":
      return "Watch";
  }
}

type RiskLayerCard = {
  title: string;
  serviceDispute: string;
  customerIntent: string;
  regulatoryLanes: readonly string[];
  evidenceVolume: string;
  sourceEvidence: readonly string[];
  whyItMatters: string;
  urgency: string;
  severity: "Critical" | "High" | "Watch" | "Good";
};

type RiskPulseHeader = {
  score: number;
  status: string;
  mainExposure: string;
  whyItMatters: string;
  activeLanes: readonly string[];
  urgencyChips: readonly string[];
};

function getRiskPulseHeader(w: TimeWindow): RiskPulseHeader {
  const facts = windowFacts(w);
  return {
    score: facts.riskScore,
    status: facts.riskStatus,
    mainExposure:
      w === "Today"
        ? "Money access + transfer dispute (early signal)"
        : w === "7 Days"
          ? "Money access + transfer dispute + no-answer patterns"
          : "Sustained money-access disputes + formal complaint language + public echo",
    whyItMatters:
      w === "Today"
        ? "Intraday: small errors feel existential — customers act on balances immediately and amplify on social the same day."
        : w === "7 Days"
          ? "Customer cannot access money, repeats contact, and starts using complaint language."
          : "Monthly view: stories compound with screenshots, timelines, and regulator vocabulary carried into every channel.",
    activeLanes:
      w === "Today"
        ? ["CFPB complaint watch", "Reg E review"]
        : w === "7 Days"
          ? [
              "CFPB complaint watch",
              "UDAAP watch",
              "Reg E review",
              "Vulnerable customer review",
            ]
          : [
              "CFPB complaint watch",
              "UDAAP watch",
              "Reg E review",
              "Vulnerable customer review",
              "OCC inquiry watch",
            ],
    urgencyChips:
      w === "Today"
        ? ["CFPB 15d / 60d", "Reg E clock may apply"]
        : ["CFPB 15d / 60d", "Reg E clock may apply", "UDAAP harm + unclear terms"],
  };
}

function getRiskLayerCards(w: TimeWindow): readonly RiskLayerCard[] {
  const s = (n: number) => fmt(scaleCount(n, w));
  switch (w) {
    case "Today":
      return [
        {
          title: "Intraday funds access / hold mismatch",
          serviceDispute: "Same-day deposit shows pending with conflicting agent guidance",
          customerIntent: "“It should be available today — who is wrong?”",
          regulatoryLanes: ["CFPB complaint watch", "UDAAP watch"],
          evidenceVolume: `${s(214)} contacts · 41% intraday repeat · ${s(28)} “post today” phrases`,
          sourceEvidence: ["Voice", "Chat", "Push log"],
          whyItMatters: "Speed amplifies harm: customers act on balances in real time; mismatch reads as negligence.",
          urgency: "Same-shift review",
          severity: "Critical" as const,
        },
        {
          title: "Live auth / OTP failure cluster",
          serviceDispute: "Device swap + SMS latency + trusted-device dead ends",
          customerIntent: "“I cannot authenticate and I am locked out now”",
          regulatoryLanes: ["CFPB complaint watch", "Vulnerable customer review"],
          evidenceVolume: `${s(86)} auth calls · ${s(31)} hourly loops · ${s(7)} vulnerable cues`,
          sourceEvidence: ["Voice", "Auth events", "Chat"],
          whyItMatters: "Same-day lockout intersecting with funds need is a high-escalation pattern.",
          urgency: "Command-center watch",
          severity: "High" as const,
        },
        {
          title: "Warm-transfer payload gap",
          serviceDispute: "Chat escalates to voice without case context",
          customerIntent: "“I already typed everything — why are you asking again?”",
          regulatoryLanes: ["UDAAP watch"],
          evidenceVolume: `${s(142)} handoffs · ${s(18)} contradiction flags · 4 tools`,
          sourceEvidence: ["Chat", "Voice", "CRM"],
          whyItMatters: "Feels deceptive even when unintentional — drives complaint language and social posts.",
          urgency: "Daily huddle",
          severity: "High" as const,
        },
        {
          title: "Ops comms vs marketing sends",
          serviceDispute: "Promo or statement email lands during active service pain",
          customerIntent: "“Stop emailing me offers while you block my account”",
          regulatoryLanes: ["UDAAP watch", "FDCPA watch — where collection conduct applies"],
          evidenceVolume: `${s(12)} overlap events · ${s(9)} complaint phrases · email + case ID match`,
          sourceEvidence: ["Email", "Marketing", "Case notes"],
          whyItMatters: "Perceived bad faith — small volume but high reputational acceleration.",
          urgency: "Suppress-list audit",
          severity: "Watch" as const,
        },
      ];
    case "7 Days":
      return [
        {
          title: "Money Access / Funds Availability",
          serviceDispute: "Deposit hold / transfer availability",
          customerIntent: "“I cannot access my money”",
          regulatoryLanes: ["CFPB complaint watch", "UDAAP watch"],
          evidenceVolume: `${s(214)} contacts · 47% repeat · ${s(43)} overdue cases`,
          sourceEvidence: ["Voice", "Chat", "Tickets"],
          whyItMatters: "Monetary harm + unclear explanation + repeat contact can become complaint risk.",
          urgency: "48h watch",
          severity: "Critical" as const,
        },
        {
          title: "Transfer Error / EFT Dispute",
          serviceDispute: "Failed transfer / cancelled transfer / wrong amount",
          customerIntent: "“The transfer failed or the money moved incorrectly”",
          regulatoryLanes: ["Reg E review"],
          evidenceVolume: `${s(31)} tickets · ${s(11)} complaint notes · ${s(18)} clarification requests`,
          sourceEvidence: ["Tickets", "Complaint notes", "Email"],
          whyItMatters: "EFT error-resolution timelines may apply.",
          urgency: "Reg E clock",
          severity: "High" as const,
        },
        {
          title: "Account Access / Lockout",
          serviceDispute: "OTP / trusted-device / phone-change recovery",
          customerIntent: "“I am locked out and need access”",
          regulatoryLanes: ["CFPB complaint watch", "Vulnerable customer review"],
          evidenceVolume: `${s(86)} auth calls · ${s(31)} repeat loops · ${s(7)} vulnerable-customer cues`,
          sourceEvidence: ["Voice", "Chat", "Case notes"],
          whyItMatters: "Access failure becomes serious when the customer cannot reach funds.",
          urgency: "Same-day review",
          severity: "High" as const,
        },
        {
          title: "Payment / Collection Pressure",
          serviceDispute: "Payment website failure / payoff confusion / collection pressure",
          customerIntent: "“I tried to pay but the system failed”",
          regulatoryLanes: ["UDAAP watch", "FDCPA watch — where collection conduct applies"],
          evidenceVolume: `${s(27)} calls · ${s(18)} emails · ${s(9)} collection-pressure phrases`,
          sourceEvidence: ["Voice", "Email", "Complaint notes"],
          whyItMatters: "Customer may be penalized for a bank-side payment or communication failure.",
          urgency: "Weekly review",
          severity: "Watch" as const,
        },
      ];
    case "30 Days":
      return [
        {
          title: "Sustained funds-hold / availability crisis",
          serviceDispute: "Multi-week holds, doc ping-pong, and divergent agent math",
          customerIntent: "“You have been holding my money for weeks”",
          regulatoryLanes: ["CFPB complaint watch", "UDAAP watch", "OCC inquiry watch"],
          evidenceVolume: `${s(214)} contacts · 53% repeat · ${s(52)} aged tickets`,
          sourceEvidence: ["Voice", "Tickets", "Public reviews"],
          whyItMatters: "Chronic monetary harm stories become regulator-ready narratives with screenshots and timelines.",
          urgency: "Exec + legal read",
          severity: "Critical" as const,
        },
        {
          title: "EFT / payoff quote integrity",
          serviceDispute: "Customer-facing payoff or transfer amount does not match backend application",
          customerIntent: "“I paid what the app said — you took something else”",
          regulatoryLanes: ["Reg E review", "UDAAP watch"],
          evidenceVolume: `${s(44)} payoff disputes · ${s(31)} tickets · ${s(14)} ledger/UI mismatches`,
          sourceEvidence: ["Tickets", "Ledger", "Email"],
          whyItMatters: "Perceived theft beats ordinary service noise — drives formal complaints.",
          urgency: "Reg E + product war room",
          severity: "High" as const,
        },
        {
          title: "Chronic digital lockout with funds behind the wall",
          serviceDispute: "OTP / device recovery loops exceeding one week",
          customerIntent: "“Every document request starts the clock over”",
          regulatoryLanes: ["CFPB complaint watch", "Vulnerable customer review"],
          evidenceVolume: `${s(86)} auth calls · ${s(44)} chronic loops · ${s(11)} vulnerable cues`,
          sourceEvidence: ["Voice", "Case notes", "Chat"],
          whyItMatters: "Access + funds is the worst intersection for vulnerable-customer scrutiny.",
          urgency: "30d remediation track",
          severity: "High" as const,
        },
        {
          title: "Marketing / servicing collision",
          serviceDispute: "Promotions or rate messaging during known service failures",
          customerIntent: "“You market trust while I cannot withdraw”",
          regulatoryLanes: ["UDAAP watch"],
          evidenceVolume: `${s(22)} cohort overlaps · ${s(18)} complaint phrases · ${s(9)} social echoes`,
          sourceEvidence: ["Marketing", "CRM", "Public Voice Wall"],
          whyItMatters: "UDAAP story: unfairness + unclear terms when pain and promotion overlap.",
          urgency: "Monthly governance",
          severity: "Watch" as const,
        },
      ];
  }
}

type EscalationItem = { id: string; label: string; detail: string };

function getRiskEscalationQueue(w: TimeWindow): readonly EscalationItem[] {
  if (w === "Today") {
    return [
      { id: "e1", label: "Money-access cluster", detail: "Early complaint-intent language detected" },
      { id: "e2", label: "Auth loop spike", detail: "Trusted-device recovery friction rising" },
    ];
  }
  if (w === "7 Days") {
    return [
      { id: "e1", label: "Money-access cluster", detail: "47% repeat + complaint-intent language rising" },
      { id: "e2", label: "Reg E documentation", detail: "Clarification requests without clear resolution clock" },
      { id: "e3", label: "Lockout + funds need", detail: "Same-day vulnerable cue + auth loop" },
    ];
  }
  return [
    { id: "e1", label: "Money-access cluster", detail: "53% repeat + sustained complaint-intent escalation" },
    { id: "e2", label: "Reg E documentation", detail: "Clarification requests without clear resolution clock" },
    { id: "e3", label: "Lockout + funds need", detail: "Vulnerable cues + chronic auth loops" },
    { id: "e4", label: "BBB / CFPB filings", detail: "Formal complaints rising month-over-month" },
    { id: "e5", label: "OCC inquiry watch", detail: "Pattern visible in regulator-facing language" },
  ];
}

type PublicTrendItem = {
  title: string;
  meta: string;
  signal: string;
};

type ThemeBar = { label: string; pct: number };

type SeveritySlice = { label: string; pct: number };

type PublicVoiceChannel = {
  id: string;
  channel: string;
  score: string;
  metric: string;
  severity: "Critical" | "High" | "Watch" | "Good";
  dominantIssue: string;
  sentimentSkew: string;
  publicVolume: string;
  internalEchoSummary: string;
  themeBreakdown: readonly ThemeBar[];
  trendingItems: readonly PublicTrendItem[];
  echoBox: {
    external: string;
    internal: string;
    businessRead: string;
  };
  severityMix: readonly SeveritySlice[];
  positiveSignal?: { title: string; body: string };
};

/**
 * Real ground-truth public-review data from May 2026:
 *  - Trustpilot openbank.us:           1.5/5 across ~902 lifetime reviews ("Bad")
 *  - Play Store us.openbank.digital:   ~3.0/5, 457+ ratings
 *  - App Store id6504042600:           ~4.5/5, 3,900+ ratings (some divergence; HYS app stronger)
 *  - BBB (Miami) openbank-by-santander:  Not BBB Accredited; HQ aggregate negative
 *  - Reddit r/personalfinance + r/banking discussions: "money held" / HYSA evaluation threads
 *
 * Per-window views slice this lifetime data into the active cohort.
 */
function getPublicChannels(w: TimeWindow): readonly PublicVoiceChannel[] {
  const scale = windowFacts(w).reviewScale;
  // Total lifetime review counts (May 2026 snapshot).
  const tpLifetime = 902;
  const playLifetime = 457;
  const appLifetime = 3900;
  const bbbHqLifetime = 69;
  // Per-window review counts derived from the lifetime totals.
  const tpCount = Math.max(1, Math.round(tpLifetime * scale));
  const playCount = Math.max(1, Math.round(playLifetime * scale));
  const appCount = Math.max(1, Math.round(appLifetime * scale));
  const bbbHqCount = Math.max(1, Math.round(bbbHqLifetime * scale));
  // Per-window star score (newer cohorts skew worse for negative channels).
  const tpScore = w === "Today" ? "1.3" : w === "7 Days" ? "1.5" : "1.5";
  const playScore = w === "Today" ? "2.7" : w === "7 Days" ? "3.0" : "3.0";
  const appScore = w === "Today" ? "4.3" : w === "7 Days" ? "4.5" : "4.5";
  const internalContacts = fmt(scaleCount(214, w));
  const authContacts = fmt(scaleCount(86, w));

  // Recent dated review snippets sourced from BBB Miami / Trustpilot recent pages.
  const bbbItemsByWindow: Record<TimeWindow, readonly PublicTrendItem[]> = {
    Today: [
      {
        title: "Locked out and cannot access deposit funds",
        meta: "today · 1 star",
        signal: "real-time funds-access escalation",
      },
      {
        title: "App update crash leaves account inaccessible",
        meta: "today · 1 star",
        signal: "release-induced access failure",
      },
      {
        title: "No response after submitting complaint",
        meta: "today · 1 star",
        signal: "complaint-handling gap",
      },
    ],
    "7 Days": [
      {
        title: "Paperless statement emails to non-customer",
        meta: "04/23/2026 · 1 star",
        signal: "wrong-recipient / unsubscribe failure",
      },
      {
        title: "Card cancelled and deposit hold left account unusable",
        meta: "04/22/2026 · 1 star",
        signal: "fraud action + funds availability confusion",
      },
      {
        title: "Locked out and cannot access money",
        meta: "02/12/2026 · 1 star",
        signal: "push notification / account access failure",
      },
    ],
    "30 Days": [
      {
        title: "Account blocked for 90-day back-office review",
        meta: "Sep 2025 cluster · multiple 1 star",
        signal: "no-notice account freeze pattern",
      },
      {
        title: "Customer locked out after phone number change",
        meta: "30-day cohort · multiple 1 star",
        signal: "trusted-device recovery dead-end",
      },
      {
        title: "BBB / CFPB / OCC complaints filed",
        meta: "regulator referral cluster",
        signal: "formal escalation pipeline",
      },
    ],
  };

  const trustpilotTrendingByWindow: Record<TimeWindow, readonly PublicTrendItem[]> = {
    Today: [
      {
        title: "Balance updated overnight — available cash still zero",
        meta: "1 star · posted in last 24h",
        signal: "intraday hold panic",
      },
      {
        title: "Cannot log in after app update + OTP never arrives",
        meta: "1 star · same-day thread",
        signal: "release + auth collision",
      },
      {
        title: "Chat said one date, phone said another",
        meta: "1 star · contradiction",
        signal: "multi-channel truth gap",
      },
    ],
    "7 Days": [
      {
        title: "Funds withdrawn, unavailable for days",
        meta: "1 star · recent review",
        signal: "money-access anxiety",
      },
      {
        title: "Phone number change blocks account access",
        meta: "1 star · multi-contact story",
        signal: "trusted-device recovery",
      },
      {
        title: "ACH transfer held 7-9 business days, no explanation",
        meta: "1 star · recurring complaint",
        signal: "deposit-hold expectation gap",
      },
    ],
    "30 Days": [
      {
        title: "Weeks of holds while “back office reviews” with no owner",
        meta: "1 star · long-thread pattern",
        signal: "chronic case debt",
      },
      {
        title: "Public review language now mirrors CFPB complaint wording",
        meta: "1 star · escalation vocabulary",
        signal: "regulator-ready narrative",
      },
      {
        title: "Marketing rate story does not match withdrawal reality",
        meta: "1 star · promise vs access",
        signal: "UDAAP-shaped frustration",
      },
    ],
  };

  const trustpilotDominantByWindow: Record<TimeWindow, string> = {
    Today: "Same-day app balance vs hold messaging + login friction after releases",
    "7 Days": "Payment process, funds access, and inconsistent support answers",
    "30 Days": "Multi-week holds, contradictory answers, and marketing vs servicing clash",
  };

  return [
    {
      id: "trustpilot",
      channel: "Trustpilot",
      score: tpScore,
      metric: `${fmt(tpCount)} reviews`,
      severity: "Critical",
      dominantIssue: trustpilotDominantByWindow[w],
      sentimentSkew: "Negative skew",
      publicVolume: `${fmt(tpCount)} public reviews (openbank.us)`,
      internalEchoSummary: `${internalContacts} contacts cite funds availability, access, or unclear timelines`,
      themeBreakdown: [
        { label: "Funds / account access", pct: 34 },
        { label: "Poor customer service", pct: 28 },
        { label: "Inconsistent information", pct: 22 },
        { label: "Long response times", pct: 16 },
      ],
      trendingItems: [...trustpilotTrendingByWindow[w]],
      echoBox: {
        external:
          w === "Today"
            ? "Trustpilot’s newest 24h cluster skews to app-update login failures and same-day hold panic — sharper than the lifetime 1.5/5 average."
            : w === "7 Days"
              ? "Trustpilot reviewers (1.5/5 lifetime) repeatedly cite payment process friction, funds access, and slow or contradictory support answers."
              : "Trustpilot’s 30-day slice shows chronic hold stories hardening into regulator-style language and screenshots.",
        internal: `Voice + chat + tickets show ${internalContacts} related contacts; repeat pressure clusters around availability wording and hold timing.`,
        businessRead:
          "Public pain matches internal first-funding and access confusion — treat as one trust thread, not a separate “reviews” problem.",
      },
      severityMix: [
        { label: "Critical", pct: 42 },
        { label: "High", pct: 31 },
        { label: "Watch", pct: 18 },
        { label: "Positive", pct: 9 },
      ],
      positiveSignal: {
        title: "Positive signal to protect",
        body: "Verified acquisition stories still mention rate value — keep APY story aligned with funds-availability reality.",
      },
    },
    {
      id: "play",
      channel: "Play Store",
      score: playScore,
      metric: `${fmt(playCount)} ratings`,
      severity: "High",
      dominantIssue: "Transfer hold + app sign-out + support gap",
      sentimentSkew: "Negative skew",
      publicVolume: `${fmt(playCount)} public ratings (Google Play · us.openbank.digital)`,
      internalEchoSummary: `${internalContacts} contacts on transfer availability · ${authContacts} auth events tied to device / OTP`,
    themeBreakdown: [
      { label: "Transfer hold", pct: 38 },
      { label: "App sign-out / access", pct: 26 },
      { label: "Support gap", pct: 19 },
      { label: "Trusted device / OTP", pct: 12 },
      { label: "Other", pct: 5 },
    ],
    trendingItems: [
      {
        title: "Initial transfer on hold",
        meta: "3 stars · helpful votes",
        signal: "deposit-hold expectation",
      },
      {
        title: "Transfer cancelled and account locked",
        meta: "1 star · helpful votes",
        signal: "transfer-out anxiety",
      },
      {
        title: "Trusted device and OTP friction",
        meta: "review cluster",
        signal: "digital recovery friction",
      },
    ],
    echoBox: {
      external: "Customers say transfers are held, cancelled, or unclear in the public store narrative.",
      internal: `Voice + chat + tickets show ${internalContacts} related contacts and strong repeat pressure on available balance and hold explanations.`,
      businessRead: "First-funding confusion is visible publicly and internally — close the loop on one narrative, not two.",
    },
    severityMix: [
      { label: "Critical", pct: 38 },
      { label: "High", pct: 33 },
      { label: "Watch", pct: 21 },
      { label: "Positive", pct: 8 },
    ],
    positiveSignal: {
      title: "Positive signal to protect",
      body: "Play listing still advertises trusted device, OTP, password reset, and transfers — keep in-app reality aligned with review promises.",
    },
  },
  {
    id: "appstore",
    channel: "App Store",
    score: appScore,
    metric: `${fmt(appCount)} ratings`,
    severity: "Good",
    dominantIssue: "Transfer friction after otherwise strong onboarding",
    sentimentSkew: "Balanced · positive skew on value",
    publicVolume: `${fmt(appCount)} ratings (App Store · id6504042600)`,
    internalEchoSummary: "Positive onboarding signal; transfer concern still appears in 1-star clusters",
    themeBreakdown: [
      { label: "High-yield praise", pct: 36 },
      { label: "Biometrics / sign-in", pct: 24 },
      { label: "Trusted device flows", pct: 22 },
      { label: "Transfer friction", pct: 18 },
    ],
    trendingItems: [
      {
        title: "Positive HYS account experience",
        meta: "5 stars",
        signal: "strength to protect",
      },
      {
        title: "Double-draw transfer issue",
        meta: "1 star · detailed review",
        signal: "payment-routing risk",
      },
      {
        title: "High rate, but access concern",
        meta: "1 star · detailed review",
        signal: "promise vs access",
      },
    ],
    echoBox: {
      external: "App Store narrative praises rate and app polish while a minority of reviews spike on transfer and access fear.",
      internal:
        "Internal onboarding sentiment is warmer than Trustpilot / Play — watch for divergence after first funding.",
      businessRead: "Protect the App Store strength while fixing transfer clarity — do not let negative channels define the whole story.",
    },
    severityMix: [
      { label: "Critical", pct: 12 },
      { label: "High", pct: 24 },
      { label: "Watch", pct: 28 },
      { label: "Positive", pct: 36 },
    ],
    positiveSignal: {
      title: "Positive signal to protect",
      body: `App Store shows Openbank U.S. at ${appScore} with ${fmt(appCount)} ratings — materially stronger than Trustpilot / Play; lead recovery work, not panic.`,
    },
  },
  {
    id: "reddit",
    channel: "Reddit",
    score: "8",
    metric: "top thread votes",
    severity: "Watch",
    dominantIssue: "HYSA evaluation · money held · rate vs reliability",
    sentimentSkew: "Mixed · consideration-stage friction",
    publicVolume: "High-engagement threads (votes as proxy)",
    internalEchoSummary: "Consideration-stage friction and funds-access escalation language in threads",
    themeBreakdown: [
      { label: "HYSA evaluation", pct: 33 },
      { label: "Money held narrative", pct: 29 },
      { label: "Rate vs reliability", pct: 22 },
      { label: "Other", pct: 16 },
    ],
    trendingItems: [
      {
        title: "Openbank HYSA evaluation thread",
        meta: "many comments",
        signal: "consideration-stage friction",
      },
      {
        title: "Openbank is holding my money",
        meta: "regulator comments",
        signal: "funds-access escalation",
      },
      {
        title: "Is Openbank any good?",
        meta: "mixed thread",
        signal: "market trust comparison",
      },
    ],
    echoBox: {
      external: "Reddit amplifies “held money” and comparison shopping before commit — high emotion, partial context.",
      internal:
        "Internal queues echo availability and hold language during the same consideration window for digital-first prospects.",
      businessRead: "Treat Reddit as early-warning on promise-vs-access, not as full-funnel truth.",
    },
    severityMix: [
      { label: "Critical", pct: 22 },
      { label: "High", pct: 28 },
      { label: "Watch", pct: 38 },
      { label: "Positive", pct: 12 },
    ],
  },
  {
    id: "bbb",
    channel: "BBB",
    score: "1.5/5",
    metric: `Openbank file · HQ 1.03/5 (${fmt(bbbHqCount)})`,
    severity: "Critical",
    dominantIssue: "Formal complaint visibility + access / payoff anxiety (HQ signal)",
    sentimentSkew: "Negative on HQ aggregate · profile not rated",
    publicVolume: `BBB business file + ${fmt(bbbHqCount)} HQ reviews (separate signals)`,
    internalEchoSummary: "Escalation language on access, payoff errors, and handoff failures aligns with HQ review themes",
    themeBreakdown: [
      { label: "Access to money", pct: 32 },
      { label: "Payment / payoff errors", pct: 26 },
      { label: "No-notice changes", pct: 20 },
      { label: "Support handoff failure", pct: 22 },
    ],
    trendingItems: [...bbbItemsByWindow[w]],
    echoBox: {
      external:
        "BBB-facing narratives emphasize identity verification, withdrawal access, and complaint response visibility — distinct from app-store tone.",
      internal:
        "Internal notes on formal complaints and access blocks correlate with HQ review themes; keep BBB response cadence visible to frontline.",
      businessRead: "Profile credibility and HQ aggregate both matter — address the formal file and the operational themes separately.",
    },
    severityMix: [
      { label: "Critical", pct: 44 },
      { label: "High", pct: 29 },
      { label: "Watch", pct: 19 },
      { label: "Positive", pct: 8 },
    ],
  },
  ];
}

function themeBarColor(idx: number, accent: string): string {
  const palette = [accent, COLORS.amber, COLORS.cyan, COLORS.purple, COLORS.dim];
  return palette[idx % palette.length] ?? accent;
}

function SeverityMixBars({
  items,
}: {
  items: readonly { label: string; pct: number }[];
}) {
  return (
    <div className="space-y-1.5">
      <p className="text-[10px] font-black uppercase tracking-[0.14em] text-zinc-500">Review severity mix</p>
      <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
        {items.map((s) => {
          const c = colorFor(s.label === "Positive" ? "Good" : s.label === "Watch" ? "Watch" : s.label === "Critical" ? "Critical" : "High");
          return (
            <div key={s.label} className="rounded-xl border border-white/10 bg-black/30 px-2 py-2 text-center">
              <p className="text-[9px] font-black uppercase tracking-wide text-zinc-500">{s.label}</p>
              <p className="mt-0.5 text-lg font-black tabular-nums" style={{ color: c }}>
                {s.pct}%
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function ExternalThemeBars({
  items,
  accent,
}: {
  items: readonly ThemeBar[];
  accent: string;
}) {
  return (
    <div className="space-y-2.5">
      <p className="text-[10px] font-black uppercase tracking-[0.14em] text-zinc-500">External theme breakdown</p>
      <div className="space-y-2">
        {items.map((t, i) => (
          <div key={t.label} className="grid grid-cols-1 gap-1.5 sm:grid-cols-[minmax(0,1fr)_2.5rem_6.5rem] sm:items-center">
            <span className="truncate text-[11px] font-semibold text-zinc-300">{t.label}</span>
            <span className="text-right text-[11px] font-black tabular-nums text-zinc-400 sm:text-left">{t.pct}%</span>
            <div className="h-2 overflow-hidden rounded-full bg-white/10 sm:col-span-1">
              <div
                className="h-full rounded-full transition-[width]"
                style={{ width: `${t.pct}%`, background: themeBarColor(i, accent) }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function Pill({
  children,
  severity = "Watch",
}: {
  children: ReactNode;
  severity?: string;
}) {
  const color = colorFor(severity);
  return (
    <span
      className="inline-flex items-center rounded-full border px-2 py-0.5 text-[10px] font-black uppercase tracking-[0.12em]"
      style={{
        color,
        borderColor: `${color}55`,
        backgroundColor: `${color}14`,
      }}
    >
      {children}
    </span>
  );
}

function ShellCard({
  title,
  subtitle,
  accent = COLORS.border,
  children,
  className = "",
}: {
  title: string;
  subtitle?: string;
  accent?: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <section
      className={cx(
        "rounded-2xl border bg-[#0d0d0d] p-4 shadow-[0_18px_50px_rgba(0,0,0,0.35)]",
        className,
      )}
      style={{
        borderColor: COLORS.border,
        borderTopColor: accent,
        borderTopWidth: 3,
      }}
    >
      <div className="mb-3 shrink-0">
        <h3 className="text-sm font-black text-white">{title}</h3>
        {subtitle ? (
          <p className="mt-1 text-xs leading-snug text-zinc-500">{subtitle}</p>
        ) : null}
      </div>
      {children}
    </section>
  );
}

function SignalStory({
  active,
  setActive,
}: {
  active: HeadlineSignal;
  setActive: Dispatch<SetStateAction<HeadlineSignal>>;
}) {
  const w = useTimeWindow();
  const headlineSignals = getHeadlineSignals(w);
  const current = active ?? headlineSignals[0];
  const color = colorFor(current.severity);
  const patternHeroSurface = dashConstellationRowSurface(current.severity);
  const chain = chainFromSignal(current);
  const metrics = metricsFromSignal(current);
  const cohort = windowFacts(w).cohortLabel;

  return (
    <ShellCard
      title={`✨${arcSectionTitle(w)}`}
      subtitle={`Pattern switcher drives this arc and Customer Pain Recovery — cohort: ${cohort}.`}
      accent={color}
      className="min-h-[470px]"
    >
      <div className="grid h-full gap-4 xl:grid-cols-[360px_minmax(0,1fr)]">
        <div className="rounded-3xl border border-white/10 bg-[#151515] p-3">
          <div className="mb-3 flex items-center justify-between gap-2">
            <div>
              <p className="text-[10px] font-black uppercase tracking-[0.16em] text-zinc-500">
                Pattern switcher
              </p>
              <p className="mt-1 text-xs text-zinc-500">
                Choose the arc to brief — Customer Pain Recovery updates to the matching recovery lens.
              </p>
            </div>
          </div>

          <div className="space-y-3">
            {headlineSignals.map((signal, index) => {
              const signalColor = colorFor(signal.severity);
              const selected = signal.id === current.id;
              return (
                <button
                  key={signal.id}
                  type="button"
                  onClick={() => setActive(signal)}
                  className="w-full rounded-2xl border p-3.5 text-left transition hover:-translate-y-0.5"
                  style={{
                    borderColor: selected ? `${signalColor}55` : COLORS.border2,
                    background: selected ? `${signalColor}0c` : COLORS.inset,
                  }}
                >
                  <div className="mb-2 flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <span
                        className="grid h-6 w-6 place-items-center rounded-full text-[11px] font-black"
                        style={{
                          color: signalColor,
                          background: `${signalColor}18`,
                        }}
                      >
                        {index + 1}
                      </span>
                      <Pill severity={signal.severity}>{signal.severity}</Pill>
                    </div>
                    <span
                      className="h-2.5 w-2.5 rounded-full"
                      style={{ background: signalColor }}
                      aria-hidden
                    />
                  </div>
                  <p className="text-sm font-black leading-tight text-white">
                    {signal.title}
                  </p>
                  <p className="mt-1 line-clamp-2 text-xs text-zinc-500">
                    {signal.impact}
                  </p>
                  <div className={cx(DASH_CONSTELLATION_NEST, "p-2")}>
                    <p className="text-[9px] font-black uppercase tracking-[0.12em] text-zinc-500">
                      Briefing angle
                    </p>
                    <p className="mt-1 line-clamp-2 text-[11px] font-semibold text-zinc-300">
                      {signal.outcome}
                    </p>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        <div className="max-h-[min(70vh,800px)] min-h-[630px] space-y-3 overflow-y-auto overscroll-y-contain pr-1 [scrollbar-gutter:stable] xl:max-h-[min(72vh,760px)]">
          <div
            className={cx(patternHeroSurface.className, "p-4")}
            style={patternHeroSurface.style}
          >
            <div className="mb-3 flex flex-wrap items-center justify-between gap-3">
              <div className="flex flex-wrap items-center gap-2">
                <Pill severity={current.severity}>{current.severity}</Pill>
              </div>
              <span className="rounded-full border border-white/10 bg-black/25 px-3 py-1 text-[10px] font-black uppercase tracking-[0.14em] text-zinc-500">
                Selected pattern view
              </span>
            </div>

            <div className="grid gap-4 lg:grid-cols-[1.15fr_0.85fr]">
              <div>
                <p className="text-[10px] font-black uppercase tracking-[0.16em] text-zinc-500">
                ✨Detected pattern
                </p>
                <h2 className="mt-2 text-3xl font-black leading-tight text-white">
                  {current.title}
                </h2>
                <p className="mt-3 text-sm leading-relaxed text-zinc-300">
                  {current.insight}
                </p>
              </div>
              <div className="rounded-2xl border border-white/10 bg-black/30 p-4">
                <p className="text-[10px] font-black uppercase tracking-[0.16em] text-zinc-500">
                  Executive readout
                </p>
                <p
                  className="mt-2 text-2xl font-black leading-tight"
                  style={{ color }}
                >
                  {current.outcome}
                </p>
                <p className="mt-3 text-xs font-semibold leading-relaxed text-zinc-400">
                  {current.impact}
                </p>
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-white/10 bg-black/25 p-4">
            <div className="mb-3 flex items-center justify-between gap-3">
              <div>
                <p className="text-[10px] font-black uppercase tracking-[0.16em] text-zinc-500">
                  Signal trail
                </p>
                <p className="mt-1 text-xs text-zinc-500">
                  How the same customer pain travels across systems and
                  channels.
                </p>
              </div>

            </div>

            <div className="grid gap-2 md:grid-cols-5">
              {chain.map((node, index) => (
                <div
                  key={`${node.label}-${node.value}`}
                  className={cx(DASH_CONSTELLATION_NEST, "relative overflow-hidden p-3")}
                >
                  <div className="mb-3 flex items-center justify-between gap-2">
                    <span
                      className="grid h-6 w-6 place-items-center rounded-full text-[11px] font-black"
                      style={{ color, background: `${color}18` }}
                    >
                      {index + 1}
                    </span>
                    {index < chain.length - 1 ? (
                      <span className="text-lg text-zinc-600" aria-hidden>
                        ›
                      </span>
                    ) : (
                      <span className="text-[10px] font-black text-zinc-600">
                        END
                      </span>
                    )}
                  </div>
                  <p className="text-[9px] font-black uppercase tracking-[0.12em] text-zinc-500">
                    {node.label}
                  </p>
                  <p className="mt-1 text-xs font-black leading-tight text-white">
                    {node.value}
                  </p>
                </div>
              ))}
            </div>
          </div>

          <div className="grid gap-2 md:grid-cols-4">
            {metrics.map((metric, index) => (
              <div
                key={metric}
                className={cx(DASH_CONSTELLATION_NEST, "p-3")}
              >
                <p className="text-[9px] font-black uppercase tracking-[0.12em] text-zinc-500">
                  {index === 0
                    ? "Confidence"
                    : index === 1
                      ? "Movement"
                      : index === 2
                        ? "Age"
                        : "Exposure"}
                </p>
                <p className="mt-1 text-sm font-black text-white">{metric}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </ShellCard>
  );
}

function CallsColumn({
  title,
  subtitle,
  data,
  accent,
  className = "",
  itemClassName = "",
}: {
  title: string;
  subtitle: string;
  data: readonly CallRow[];
  accent: string;
  className?: string;
  /** Extra classes on each call card (e.g. min-height for Worst Calls). */
  itemClassName?: string;
}) {
  return (
    <ShellCard title={title} subtitle={subtitle} accent={accent} className={className}>
      <div className="space-y-3">
        {data.map((call) => {
          const surf = dashConstellationRowSurface(call.severity);
          return (
            <div
              key={call.rank}
              className={cx(surf.className, itemClassName || "")}
              style={surf.style}
            >
              <div className="flex items-start gap-3">
                <div
                  className="grid h-8 w-8 shrink-0 place-items-center rounded-full text-sm font-black"
                  style={{ color: colorFor(call.severity), background: `${colorFor(call.severity)}18` }}
                >
                  {call.rank}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <Pill severity={call.severity}>{call.score}</Pill>
                    <span className="text-[10px] font-black uppercase tracking-[0.12em] text-zinc-500">
                      AI call score
                    </span>
                  </div>
                  <h4 className="mt-2 text-sm font-black leading-tight text-white">
                    {call.title}
                  </h4>
                  <p className="mt-2 text-xs leading-relaxed text-zinc-300">
                    {call.reason}
                  </p>
                  <div className={cx(DASH_CONSTELLATION_NEST, "mt-2 p-2")}>
                    <p className={cx(DASH_CONSTELLATION_LABEL, "tracking-[0.12em]")}>
                      Pattern
                    </p>
                    <p className="mt-1 text-xs font-bold text-white">
                      {call.pattern}
                    </p>
                  </div>
                  <div className="mt-2 grid gap-2 text-[11px] font-semibold md:grid-cols-2">
                    <span className={cx(DASH_CONSTELLATION_NEST, "p-2 text-zinc-400")}>
                      {call.proof}
                    </span>
                    <span className={cx(DASH_CONSTELLATION_NEST, "p-2 text-zinc-300")}>
                      {call.evidence}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </ShellCard>
  );
}

/** Unicode − or ASCII - prefix ⇒ polarity average (−1…+1); otherwise 0–5 warmth (higher is better). */
function channelSentimentIsPolarityScale(sentiment: string): boolean {
  const t = sentiment.trim();
  return t.startsWith("−") || t.startsWith("-");
}

function channelSentimentValueClass(ch: ChannelSignal): string {
  if (channelSentimentIsPolarityScale(ch.sentiment)) {
    return "text-white";
  }
  switch (ch.severity) {
    case "Good":
      return "text-emerald-200";
    case "High":
    case "Watch":
      return "text-amber-200";
    default:
      return "text-amber-200";
  }
}

/** "47% repeat" → "47%" for compact metric cells. */
function repeatContactPctLabel(repeat: string): string {
  return repeat.replace(/\s*repeat\s*$/i, "").trim();
}

function ChannelConstellation() {
  const w = useTimeWindow();
  const facts = windowFacts(w);
  const channels = getChannelSignals(w);

  return (
    <ShellCard
      title="Internal Voice Constellation"
      subtitle={`Channel-level internal evidence (${facts.cohortLabel}) · ${facts.cadence}.`}
      accent={COLORS.cyan}
      className="flex min-h-[668px] max-h-[min(72vh,820px)] flex-col overflow-hidden"
    >
      <p className={DASH_CONSTELLATION_INTRO}>
        Proof after the Signal Story: volume, repeat contact, dispute concentration, representative phrasing, and sentiment
        (avg) per channel — internal channels only (public voice sits below).
      </p>
      <div className={DASH_CONSTELLATION_STACK_SCROLL}>
        {list(channels).map((ch) => {
          const row = dashConstellationRowSurface(ch.severity);
          return (
            <div key={ch.channel} className={row.className} style={row.style}>
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <h4 className="text-sm font-black text-white">{ch.channel}</h4>
                    <Pill severity={ch.severity}>{ch.issue}</Pill>
                  </div>
                  <p className={cx(DASH_CONSTELLATION_LABEL, "mt-2")}>Representative phrase</p>
                  <p className="mt-0.5 text-xs font-semibold leading-snug italic text-zinc-200">{ch.phrase}</p>
                </div>
                <div className="flex shrink-0 flex-col items-end gap-1 text-right">
                  <p className="text-lg font-black tabular-nums text-white">{ch.count}</p>
                  <p className="text-[10px] font-bold text-zinc-500">{ch.delta}</p>
                </div>
              </div>

              <div className="mt-3 grid gap-2 sm:grid-cols-2">
                <div className={DASH_CONSTELLATION_NEST}>
                  <p className="text-[9px] font-black uppercase tracking-wide text-zinc-500">Repeat-contact %</p>
                  <p className="mt-1 text-sm font-black tabular-nums tracking-tight text-amber-200">
                    {repeatContactPctLabel(ch.repeat)}
                  </p>
                </div>
                <div className={DASH_CONSTELLATION_NEST}>
                  <p className="text-[9px] font-black uppercase tracking-wide text-zinc-500">Sentiment (avg)</p>
                  <p className={cx("mt-1 text-sm font-black tabular-nums tracking-tight", channelSentimentValueClass(ch))}>
                    {ch.sentiment}
                  </p>
                </div>
              </div>

              <p className={cx(DASH_CONSTELLATION_LABEL, "mt-2")}>Top service dispute</p>
              <p className="mt-0.5 text-xs font-semibold text-zinc-200">{ch.topDispute}</p>
              <div className="mt-2 flex flex-wrap items-center justify-between gap-2 text-[11px]">
                <span className="font-bold tabular-nums text-zinc-300">{ch.disputeCount}</span>
                <span className="rounded-full border border-white/10 bg-black/35 px-2 py-0.5 text-[9px] font-black uppercase tracking-wide text-zinc-400">
                  Owner: {ch.owner}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </ShellCard>
  );
}

function RecoveryRoom({
  className = "",
  compact = false,
  headlineSignalId,
}: {
  className?: string;
  /** Narrow rail beside the arc — controls scroll height. */
  compact?: boolean;
  /** Active arc from the Pattern switcher; selects which recovery row to show. */
  headlineSignalId: string;
}) {
  const w = useTimeWindow();
  const active = recoveryBoardItemForHeadlineSignal(w, headlineSignalId);
  const color = colorFor(active.severity);
  const how = list(active.howWeKnow);
  const recoveryRow = dashConstellationRowSurface(active.severity);

  return (
    <ShellCard
      title="Customer Pain Recovery"
      subtitle={`Did the customer signal actually improve? Matches the arc you select — ${windowFacts(w).cohortLabel}.`}
      accent={color}
      className={cx(className, "flex flex-col overflow-hidden")}
    >
      <p className={DASH_CONSTELLATION_INTRO}>
        Recovery is measured from customer-signal movement: repeat contact, unresolved language, sentiment, reopen rate, and
        complaint-intent phrases.{" "}
        <span className="font-black text-zinc-500">Observed recovery signal</span> unless workflow / ticket / CRM confirms an
        intervention.
      </p>

      <div
        className={cx(
          DASH_CONSTELLATION_STACK_SCROLL,
          compact ? "max-h-[min(82vh,600px)]" : "max-h-[min(72vh,680px)]",
        )}
      >
        <div className={cx(recoveryRow.className, "space-y-3")} style={recoveryRow.style}>
          <div className="flex flex-wrap items-start justify-between gap-2">
            <div>
              <p className={cx(DASH_CONSTELLATION_LABEL, "tracking-[0.14em]")}>Selected pain detail</p>
              <h4 className="mt-1 text-lg font-black text-white">{active.insight}</h4>
            </div>
            <Pill severity={verdictSeverity(active.verdict)}>{active.verdict}</Pill>
          </div>

          <div className={cx(DASH_CONSTELLATION_NEST, "bg-black/30 p-3")}>
            <p className="text-[9px] font-black uppercase tracking-[0.12em] text-zinc-500">Customer pain</p>
            <p className="mt-1 text-sm font-semibold leading-snug text-zinc-100">{active.customerPain}</p>
          </div>

          <div className={cx(DASH_CONSTELLATION_NEST, "p-3")}>
            <p className="text-[9px] font-black uppercase tracking-[0.12em] text-zinc-500">Intervention signal</p>
            <p className="mt-1 text-xs font-semibold leading-relaxed text-zinc-300">{active.interventionSignal}</p>
          </div>

          <div>
            <p className="text-[9px] font-black uppercase tracking-[0.12em] text-zinc-500">How we know</p>
            <ul className="mt-2 space-y-1.5">
              {how.map((line) => (
                <li
                  key={line}
                  className="flex items-start gap-2 rounded-lg border border-white/10 bg-black/30 px-2.5 py-1.5 text-[11px] font-semibold text-zinc-300"
                >
                  <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-zinc-500" aria-hidden />
                  <span>{line}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="grid gap-2 sm:grid-cols-3">
            <div className={cx(DASH_CONSTELLATION_NEST, "p-3")}>
              <p className="text-[9px] font-black uppercase tracking-[0.12em] text-zinc-500">Target movement</p>
              <p className="mt-1 text-sm font-black text-white">{active.target}</p>
            </div>
            <div className={cx(DASH_CONSTELLATION_NEST, "p-3")}>
              <p className="text-[9px] font-black uppercase tracking-[0.12em] text-zinc-500">Measured movement</p>
              <p className="mt-1 text-sm font-black" style={{ color }}>
                {active.measured}
              </p>
            </div>
            <div className={cx(DASH_CONSTELLATION_NEST, "p-3")}>
              <p className="text-[9px] font-black uppercase tracking-[0.12em] text-zinc-500">Recovery confidence</p>
              <p className="mt-1 text-sm font-black tabular-nums text-white">{active.confidence}%</p>
            </div>
          </div>

          <div className={cx(DASH_CONSTELLATION_NEST, "bg-black/30 p-3")}>
            <p className="text-[10px] font-black uppercase tracking-[0.14em] text-zinc-500">Signal movement strip</p>
            <div className="mt-3 grid gap-3 md:grid-cols-3">
              <div>
                <p className="text-[9px] font-black uppercase text-zinc-600">Before</p>
                <p className="mt-1 text-xs font-semibold leading-snug text-zinc-300">{active.beforeStrip}</p>
              </div>
              <div>
                <p className="text-[9px] font-black uppercase text-zinc-600">After</p>
                <p className="mt-1 text-xs font-semibold leading-snug text-zinc-300">{active.afterStrip}</p>
              </div>
              <div className="rounded-xl border px-3 py-2" style={{ borderColor: `${color}44`, background: `${color}0d` }}>
                <p className="text-[9px] font-black uppercase text-zinc-500">Verdict</p>
                <p className="mt-1 text-sm font-black" style={{ color: colorFor(verdictSeverity(active.verdict)) }}>
                  {active.verdict}
                </p>
                <p className="mt-1 text-[10px] font-semibold leading-snug text-zinc-500">
                  {active.verdict === "No movement"
                    ? "Customer signal flat — no observed reduction in pain markers yet."
                    : active.verdict === "Improving"
                      ? "Repeat, lockout language, and contacts-per-case are moving in the right direction."
                      : active.verdict === "Working"
                        ? "Repeat and reopen signals beat target; sustain conversation patterns that caused the lift."
                        : "Baseline window only — compare future intervals before calling recovery."}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </ShellCard>
  );
}

function PublicVoiceWall() {
  const w = useTimeWindow();
  const publicChannels = getPublicChannels(w);
  const [selectedPublicChannel, setSelectedPublicChannel] = useState<PublicVoiceChannel>(
    () => publicChannels[0],
  );

  useEffect(() => {
    const channels = getPublicChannels(w);
    setSelectedPublicChannel((prev) => channels.find((c) => c.id === prev.id) ?? channels[0]);
  }, [w]);

  const active = selectedPublicChannel ?? publicChannels[0];
  const color = colorFor(active.severity);
  const publicDetailSurface = dashConstellationRowSurface(active.severity);
  const trending = list(active.trendingItems).slice(0, 3);
  const themes = list(active.themeBreakdown);
  const mix = list(active.severityMix);

  return (
    <ShellCard
      title="Public Voice Wall"
      subtitle={`External reputation pulse across Trustpilot, Play Store, App Store, Reddit, and BBB (${windowFacts(w).cohortLabel}) — the only public-grounding surface in this room.`}
      accent={color}
    >
      <p className={DASH_CONSTELLATION_INTRO}>
        Public channels validate whether internal pain is visible externally — same card density as Internal Voice Constellation;
        numbers and quotes still follow the active time window.
      </p>
      <div className="grid min-h-0 gap-4 xl:grid-cols-[minmax(0,280px)_1fr] xl:items-start">
        <div className="space-y-2">
          <p className={cx(DASH_CONSTELLATION_LABEL, "tracking-[0.14em]")}>Channel rail</p>
          <div className="grid grid-cols-2 gap-2 xl:grid-cols-1">
            {publicChannels.map((channel) => {
              const chColor = colorFor(channel.severity);
              const selected = channel.id === active.id;
              const rowSurface = dashConstellationRowSurface(channel.severity);
              return (
                <button
                  key={channel.id}
                  type="button"
                  onClick={() => setSelectedPublicChannel(channel)}
                  className="w-full rounded-2xl border p-3.5 text-left transition-colors"
                  style={
                    selected
                      ? rowSurface.style
                      : { borderColor: COLORS.border2, background: COLORS.inset }
                  }
                >
                  <div className="flex items-center justify-between gap-2">
                    <p className="text-[10px] font-black uppercase tracking-[0.12em] text-zinc-500">
                      {channel.channel}
                    </p>
                    <span className="h-2 w-2 shrink-0 rounded-full" style={{ background: chColor }} aria-hidden />
                  </div>
                  <div className="mt-2 flex items-end justify-between gap-2">
                    <p className="text-xl font-black tabular-nums leading-none" style={{ color: chColor }}>
                      {channel.score}
                    </p>
                    <p className="max-w-[55%] text-right text-[10px] font-bold leading-snug text-zinc-400">
                      {channel.metric}
                    </p>
                  </div>
                  <p className="mt-2 truncate text-[10px] font-semibold text-zinc-500">{channel.dominantIssue}</p>
                </button>
              );
            })}
          </div>
        </div>

        <div
          className={cx(
            publicDetailSurface.className,
            "min-h-0 min-w-0 max-h-[min(72vh,680px)] space-y-4 overflow-y-auto overscroll-y-contain p-4 [scrollbar-gutter:stable]",
          )}
          style={publicDetailSurface.style}
        >
          <div>
            <p className={cx(DASH_CONSTELLATION_LABEL, "tracking-[0.14em]")}>
              Selected channel intelligence
            </p>
            <div className="mt-2 flex flex-wrap items-start justify-between gap-3">
              <div className="min-w-0">
                <h4 className="text-xl font-black text-white">{active.channel}</h4>
                <p className="mt-1 text-[11px] font-bold text-zinc-400">
                  {active.score}
                  {active.id === "bbb" ? "" : " rating"} · {active.metric}
                </p>
                <p className="mt-2 text-xs font-semibold leading-snug text-zinc-300">
                  <span className="font-black text-zinc-500">Dominant external issue: </span>
                  {active.dominantIssue}
                </p>
                <p className="mt-1 text-xs font-semibold leading-snug text-zinc-400">
                  <span className="font-black text-zinc-500">Internal echo: </span>
                  {active.internalEchoSummary}
                </p>
              </div>
              <Pill severity={active.severity}>{active.severity}</Pill>
            </div>
          </div>

          <div>
            <p className={cx(DASH_CONSTELLATION_LABEL, "tracking-[0.14em]")}>External signal summary</p>
            <div className="mt-2 grid grid-cols-2 gap-2 lg:grid-cols-4">
              {[
                { k: "Dominant theme", v: active.dominantIssue },
                { k: "Sentiment skew", v: active.sentimentSkew },
                { k: "Public volume", v: active.publicVolume },
                { k: "Internal echo", v: active.internalEchoSummary },
              ].map((row) => (
                <div key={row.k} className={cx(DASH_CONSTELLATION_NEST, "px-2.5 py-2")}>
                  <p className="text-[9px] font-black uppercase tracking-wide text-zinc-500">{row.k}</p>
                  <p className="mt-1 line-clamp-3 text-[11px] font-semibold leading-snug text-zinc-200">{row.v}</p>
                </div>
              ))}
            </div>
          </div>

          <ExternalThemeBars items={themes} accent={color} />
          <SeverityMixBars items={mix} />

          <div>
            <p className={cx(DASH_CONSTELLATION_LABEL, "tracking-[0.14em]")}>Top trending public items</p>
            <ol className="mt-2 space-y-3">
              {trending.map((post, idx) => (
                <li
                  key={post.title}
                  className={cx(DASH_CONSTELLATION_NEST, "p-3")}
                >
                  <div className="flex flex-wrap items-baseline gap-2">
                    <span className="text-xs font-black tabular-nums text-zinc-500">{idx + 1}.</span>
                    <h5 className="min-w-0 flex-1 text-sm font-black leading-tight text-white">{post.title}</h5>
                  </div>
                  <p className="mt-1 text-[10px] font-black uppercase tracking-[0.1em] text-zinc-500">{post.meta}</p>
                  <p className="mt-2 text-[11px] font-bold" style={{ color }}>
                    Signal: {post.signal}
                  </p>
                </li>
              ))}
            </ol>
          </div>

          <div className={cx(DASH_CONSTELLATION_NEST, "p-3")} style={{ borderColor: `${color}44`, background: `${color}0d` }}>
            <p className="text-[10px] font-black uppercase tracking-[0.14em] text-zinc-500">Public voice → internal echo</p>
            <p className="mt-2 text-[11px] font-semibold leading-relaxed text-zinc-300">
              <span className="font-black text-zinc-500">External signal: </span>
              {active.echoBox.external}
            </p>
            <p className="mt-2 text-[11px] font-semibold leading-relaxed text-zinc-300">
              <span className="font-black text-zinc-500">Internal echo: </span>
              {active.echoBox.internal}
            </p>
            <p className="mt-2 text-[11px] font-semibold leading-relaxed text-zinc-200">
              <span className="font-black text-zinc-500">Business read: </span>
              {active.echoBox.businessRead}
            </p>
          </div>

          {active.positiveSignal ? (
            <div className="rounded-xl border border-emerald-500/30 bg-emerald-500/5 p-3">
              <p className="text-[10px] font-black uppercase tracking-[0.14em] text-emerald-300/90">
                {active.positiveSignal.title}
              </p>
              <p className="mt-1.5 text-[11px] font-semibold leading-relaxed text-zinc-300">{active.positiveSignal.body}</p>
            </div>
          ) : null}
        </div>
      </div>
    </ShellCard>
  );
}

function RiskLayer() {
  const w = useTimeWindow();
  const riskPulseHeader = getRiskPulseHeader(w);
  const riskLayerCards = getRiskLayerCards(w);
  const riskEscalationQueue = getRiskEscalationQueue(w);
  const lanes = list(riskPulseHeader.activeLanes);
  const urgencyChips = list(riskPulseHeader.urgencyChips);

  return (
    <ShellCard
      title="Risk Signal Layer"
      subtitle={`What service disputes are becoming regulatory exposure? (${windowFacts(w).cohortLabel})`}
      accent={COLORS.red}
      className="flex min-h-[668px] max-h-[min(72vh,820px)] flex-col overflow-hidden"
    >
      <p className={DASH_CONSTELLATION_INTRO}>
        Regulatory exposure reads from service-dispute volume, repeat contact, complaint language, and evidence trails — same
        density rules as channel intelligence above.
      </p>
      <div className={cx(DASH_CONSTELLATION_STACK_SCROLL, "pr-2")}>
        <div className="space-y-3">
          <div
            className="grid gap-3 rounded-2xl border p-3.5 lg:grid-cols-[minmax(0,7.5rem)_1fr] lg:items-start"
            style={{ borderColor: `${COLORS.red}55`, background: `${COLORS.red}0c` }}
          >
            <div className="flex flex-col items-start gap-1.5 border-b border-white/10 pb-3 lg:border-b-0 lg:border-r lg:pb-0 lg:pr-3">
              <p className="text-[9px] font-black uppercase tracking-[0.14em] text-zinc-500">Risk pulse</p>
              <p className="text-3xl font-black tabular-nums leading-none text-white">
                {riskPulseHeader.score}
                <span className="text-xs font-bold text-zinc-500"> /100</span>
              </p>
              <Pill severity="High">{riskPulseHeader.status}</Pill>
            </div>
            <div className="min-w-0 space-y-2">
              <div>
                <p className="text-[9px] font-black uppercase tracking-[0.12em] text-zinc-500">Main exposure</p>
                <p className="mt-0.5 text-xs font-semibold leading-snug text-zinc-100">{riskPulseHeader.mainExposure}</p>
              </div>
              <div>
                <p className="text-[9px] font-black uppercase tracking-[0.12em] text-zinc-500">Why it matters</p>
                <p className="mt-0.5 text-[11px] font-semibold leading-snug text-zinc-400">{riskPulseHeader.whyItMatters}</p>
              </div>
              <div>
                <p className="text-[9px] font-black uppercase tracking-[0.12em] text-zinc-500">Active lanes</p>
                <div className="mt-1 flex flex-wrap gap-1">
                  {lanes.map((lane) => (
                    <span
                      key={lane}
                      className="rounded-full border border-red-500/45 bg-black/45 px-2 py-0.5 text-[9px] font-black uppercase tracking-wide text-red-100/95"
                    >
                      {lane}
                    </span>
                  ))}
                </div>
              </div>
              <div>
                <p className="text-[9px] font-black uppercase tracking-[0.12em] text-zinc-500">Regulatory urgency</p>
                <div className="mt-1 flex flex-wrap gap-1">
                  {urgencyChips.map((chip) => (
                    <span
                      key={chip}
                      className="rounded-full border border-white/15 bg-black/35 px-2 py-0.5 text-[9px] font-bold text-zinc-400"
                    >
                      {chip}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-3">
            <p className="text-[10px] font-black uppercase tracking-[0.14em] text-zinc-500">Service dispute → exposure</p>
            {list(riskLayerCards).map((risk) => {
              const row = dashConstellationRowSurface(risk.severity);
              return (
                <div key={risk.title} className={row.className} style={row.style}>
                  <div className="flex flex-wrap items-start justify-between gap-2">
                    <h4 className="min-w-0 flex-1 text-sm font-black leading-tight text-white">{risk.title}</h4>
                    <span
                      className="shrink-0 rounded-full border px-2 py-0.5 text-[9px] font-black uppercase tracking-wide text-zinc-300"
                      style={{ borderColor: `${colorFor(risk.severity)}55`, background: `${colorFor(risk.severity)}14` }}
                    >
                      {risk.urgency}
                    </span>
                  </div>

                  <p className={cx(DASH_CONSTELLATION_LABEL, "mt-2")}>Service dispute</p>
                  <p className="mt-0.5 text-xs font-semibold text-zinc-200">{risk.serviceDispute}</p>

                  <p className={cx(DASH_CONSTELLATION_LABEL, "mt-2")}>Customer intent</p>
                  <p className="mt-0.5 text-xs font-semibold italic text-zinc-300">{risk.customerIntent}</p>

                  <p className={cx(DASH_CONSTELLATION_LABEL, "mt-2")}>Exposure lane</p>
                  <div className="mt-1 flex flex-wrap gap-1">
                    {list(risk.regulatoryLanes).map((lane) => (
                      <span
                        key={lane}
                        className="rounded-full border px-2 py-0.5 text-[9px] font-black uppercase tracking-wide"
                        style={{
                          borderColor: `${colorFor(risk.severity)}66`,
                          color: colorFor(risk.severity),
                          background: `${colorFor(risk.severity)}12`,
                        }}
                      >
                        {lane}
                      </span>
                    ))}
                  </div>

                  <p className={cx(DASH_CONSTELLATION_LABEL, "mt-2")}>Evidence volume</p>
                  <p className="mt-0.5 text-xs font-bold tabular-nums text-zinc-200">{risk.evidenceVolume}</p>

                  <p className={cx(DASH_CONSTELLATION_LABEL, "mt-2")}>Source evidence</p>
                  <div className="mt-1 flex flex-wrap gap-1">
                    {list(risk.sourceEvidence).map((s) => (
                      <span
                        key={s}
                        className="rounded-full border border-white/10 bg-black/35 px-2 py-0.5 text-[9px] font-bold uppercase tracking-wide text-zinc-400"
                      >
                        {s}
                      </span>
                    ))}
                  </div>

                  <p className="mt-2 border-t border-white/10 pt-2 text-[11px] font-semibold leading-snug text-zinc-400">
                    <span className="font-black text-zinc-600">Why this matters: </span>
                    {risk.whyItMatters}
                  </p>
                </div>
              );
            })}
          </div>

          <div className={cx(DASH_CONSTELLATION_NEST, "p-3")}>
            <p className="text-[10px] font-black uppercase tracking-[0.14em] text-zinc-500">Escalation queue</p>
            <ul className="mt-2 space-y-2">
              {list(riskEscalationQueue).map((q) => (
                <li key={q.id} className="flex flex-wrap items-baseline justify-between gap-2 text-[11px]">
                  <span className="font-black text-white">{q.label}</span>
                  <span className="min-w-0 text-right font-semibold text-zinc-400">{q.detail}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </ShellCard>
  );
}

/** Main signal-room UI (stateful). Wrapped by `OpenbankInsightExecutiveDashboard` for role-based routing. */
export function OpenbankCXSignalRoom() {
  const w = useTimeWindow();
  const cohortLabel = windowFacts(w).cohortLabel;
  const [activeSignal, setActiveSignal] = useState<HeadlineSignal>(
    () => getHeadlineSignals("Today")[0],
  );

  useEffect(() => {
    const next = getHeadlineSignals(w);
    setActiveSignal((prev) => next.find((s) => s.id === prev.id) ?? next[0]);
  }, [w]);

  return (
    <div className="min-h-screen w-full min-w-0 bg-[#070707] text-white">
      <div className="pointer-events-none fixed inset-0 bg-[radial-gradient(circle_at_top_left,rgba(83,50,255,.18),transparent_28%),radial-gradient(circle_at_top_right,rgba(245,158,11,.08),transparent_30%)]" />
      <div className="relative mx-auto w-full max-w-[1840px] min-w-0 space-y-4 px-4 py-4">
        <div className="grid grid-cols-12 gap-4">
          <div className="col-span-12 xl:col-span-8">
            <SignalStory active={activeSignal} setActive={setActiveSignal} />
          </div>
          <div className="col-span-12 min-h-0 xl:col-span-4">
            <RecoveryRoom compact className="min-h-[600px]" headlineSignalId={activeSignal.id} />
          </div>
        </div>

        <div className="grid grid-cols-12 items-stretch gap-4">
          <div className="col-span-12 lg:col-span-6">
            <CallsColumn
              title="✨Top 3 Best Calls"
              subtitle={`Excellence patterns ranked for ${cohortLabel} — different stories than longer windows.`}
              data={getBestCalls(w)}
              accent={COLORS.green}
            />
          </div>
          <div className="col-span-12 lg:col-span-6">
            <CallsColumn
              title="✨Top 3 Worst Calls"
              subtitle={`Failure patterns ranked for ${cohortLabel} — not the same failures as weekly view.`}
              data={getWorstCalls(w)}
              accent={COLORS.red}
              className="min-h-[760px]"
              itemClassName="min-h-[80px] p-4"
            />
          </div>
        </div>

        <div className="grid min-h-0 grid-cols-12 gap-4 xl:items-stretch">
          <div className="col-span-12 min-h-0 xl:col-span-7">
            <RiskLayer />
          </div>
          <div className="col-span-12 min-h-0 xl:col-span-5">
            <ChannelConstellation />
          </div>
        </div>

        <PublicVoiceWall />
      </div>
    </div>
  );
}

const OPENBANK_FALLBACK_THEME: DashboardThemeTokens = {
  ...REGISTRY_THEME,
  bg: "#070707",
  surface: "#121212",
  card: "#0d0d0d",
  elevated: "#1a1a1a",
  border: "#242424",
  borderLight: "#3a3a3a",
};

export type OpenbankInsightExecutiveDashboardProps = {
  industryName: string;
  industryColor: string;
  onExit: () => void;
  theme?: DashboardThemeTokens;
};

export function OpenbankInsightExecutiveDashboard({
  industryName: _industryName,
  industryColor,
  onExit,
  theme,
}: OpenbankInsightExecutiveDashboardProps) {
  const [timeWindow, setTimeWindow] = useState<TimeWindow>("Today");

  return (
    <DashboardThemeProvider value={theme ?? OPENBANK_FALLBACK_THEME}>
      <div className="min-h-screen w-full min-w-0 bg-[#070707]">
        <header className="relative w-full min-w-0 border-b border-white/10 bg-[#070707]">
          <div className="mx-auto w-full max-w-[1840px] min-w-0 px-4 py-3">
            <div className="flex w-full min-w-0 flex-col items-stretch gap-4 border-t border-white/10 pt-4 md:flex-row md:items-center md:justify-between md:gap-6 lg:gap-10">
              <button
                type="button"
                onClick={onExit}
                className="inline-flex shrink-0 items-center justify-center gap-2 self-center rounded-xl border border-white/15 bg-white/[0.06] py-2 pr-3 pl-2.5 text-sm font-semibold text-zinc-200 transition hover:bg-white/10 md:self-auto"
                style={{ borderLeftWidth: 3, borderLeftColor: industryColor }}
              >
                <ArrowLeft className="size-4 shrink-0" aria-hidden />
                Back
              </button>

              <div className="flex min-w-0 flex-1 flex-col items-center text-center">
                <h1 className="text-3xl font-black tracking-tight text-white md:text-5xl">
                  Openbank CX Signal Room
                </h1>
                <p className="mx-auto mt-2 max-w-5xl text-sm leading-relaxed text-zinc-400">
                  A daily intelligence room for customer trust: internal calls,
                  chats, emails, tickets, account activity, risk language, and
                  one public-voice validation layer.
                </p>
              </div>

              <div className="grid w-full max-w-sm shrink-0 grid-cols-3 gap-1.5 self-center rounded-2xl border border-white/10 bg-white/[0.035] p-1.5 sm:max-w-[280px] md:w-[min(100%,280px)] md:max-w-none">
                {TIME_WINDOWS.map((item) => (
                  <button
                    key={item}
                    type="button"
                    onClick={() => setTimeWindow(item)}
                    className={cx(
                      "rounded-xl px-3 py-2 text-xs font-black transition",
                      item === timeWindow
                        ? "bg-violet-600 text-white"
                        : "text-zinc-400 hover:bg-white/5 hover:text-white",
                    )}
                  >
                    {item}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </header>
        <TimeWindowContext.Provider value={timeWindow}>
          <OpenbankCXSignalRoom />
        </TimeWindowContext.Provider>
      </div>
    </DashboardThemeProvider>
  );
}

export default OpenbankInsightExecutiveDashboard;
