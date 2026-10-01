/**
 * Theme deep-dive data for every "Back after fix" theme.
 * rc-01 has its own authored file (theme_rc01.json). The other themes are
 * assembled from recurring.json and the matching overview signal, so their
 * deep dive carries the same sections without a second data source.
 */

import overviewJson from "../data/overview.json";
import recurring from "../data/recurring.json";
import rc01 from "../data/theme_rc01.json";
import type { DateRangeId, Role } from "../types";
import { recurringForPeriod } from "./drillFromPeriod";
import { timeLabel } from "./period";

export type ThemeMarker = { weekIndex: number; label: string };

export type ThemeDetail = {
  id: string;
  /** Key for approvals / loop state. */
  signalId: string;
  title: string;
  headline: string;
  /** Short name used in the draft heading and chart label. */
  shortName: string;
  chart: {
    weeks: string[];
    values: number[];
    fixMarkers: ThemeMarker[];
    returnMarkers: ThemeMarker[];
  };
  severity: {
    class: string;
    word: string;
    typeNote: string;
    blastRadius: { headline: string };
  };
  confidence?: {
    level: string;
    p: number;
    known: { count: number; label: string };
    inferred: { count: number; label: string };
  };
  joinTags: Array<{ key: string; value: string }>;
  pnl: { compact: string };
  fixHistory: Array<{
    date: string;
    what: string;
    by: string;
    contactsPerWeekBefore: number;
    contactsPerWeekAfter: number;
  }>;
  drafts: Array<{ id: string; title: string; status: string; awaiting: string }>;
  loop: { nextCheck: string };
  humanGate: {
    title: string;
    chip: string;
    owner: Role;
    approveEnabledFor: string[];
    approveLabel: string;
    disabledTooltip: string;
  };
};

/** Overview signal that tracks the same theme (severity, confidence, action). */
const OVERVIEW_SIGNAL: Record<string, string> = {
  "rc-03": "RC-03",
  "rc-05": "RC-02",
};

/** Recurring themes sit with this role (owner of every recurring signal). */
const THEME_OWNER: Role = "Technical support lead";

const FIX_WORD: Record<string, string> = {
  kb: "knowledge article",
  process: "process change",
  training: "training session",
  "product-feedback": "product feedback note",
};

type OverviewSignal = {
  id: string;
  severity: string;
  shape: string | null;
  confidence: string;
  recommendation: string;
  owner: string;
  pnlTag: string;
};

function shortDate(iso: string): string {
  return new Date(`${iso}T12:00:00Z`)
    .toLocaleDateString("en-GB", { day: "numeric", month: "short" })
    .replace("Sept", "Sep");
}

function sentenceCase(text: string): string {
  return `${text.charAt(0).toUpperCase()}${text.slice(1)}`;
}

/**
 * Deep dive for one theme. Partners and the "known" contact count follow the
 * active period, so they agree with the register row the page was opened from.
 */
export function themeDetailFor(
  id: string,
  period: DateRangeId,
): ThemeDetail | null {
  const row = recurringForPeriod(period).themes.find((t) => t.id === id);
  const partners = row?.partners;
  const windowContacts = row?.contacts13w;
  const window = timeLabel(period).toLowerCase();

  if (id === rc01.id) {
    return {
      ...rc01,
      signalId: "RC-01",
      shortName: "licence re-activation",
      humanGate: { ...rc01.humanGate, owner: rc01.humanGate.owner as Role },
      severity: {
        ...rc01.severity,
        blastRadius: {
          headline:
            partners === undefined
              ? rc01.severity.blastRadius.headline
              : rc01.severity.blastRadius.headline.replace(
                  /^\d+ partners/,
                  `${partners} partners`,
                ),
        },
      },
      confidence: {
        ...rc01.confidence,
        known:
          windowContacts === undefined
            ? rc01.confidence.known
            : {
                count: windowContacts,
                label: `${windowContacts} contacts in the ${window}`,
              },
      },
      joinTags: rc01.joinTags.map((tag) =>
        tag.key === "PARTNERS" && partners !== undefined
          ? { ...tag, value: String(partners) }
          : tag,
      ),
    };
  }

  const theme = recurring.themes.find((t) => t.id === id);
  const card = [
    ...recurring.backAfterFixWall,
    ...recurring.backAfterFixEarlier,
  ].find((c) => c.id === id);
  const drawn = recurring.timeline.series.find((s) => s.id === id);
  const fix = theme?.fixes[0];
  if (!theme || !card || !drawn || !fix) return null;

  const signal = (overviewJson.signals as OverviewSignal[]).find(
    (s) => s.id === OVERVIEW_SIGNAL[id],
  );
  const owner = (signal?.owner as Role | undefined) ?? THEME_OWNER;
  const fixWord = FIX_WORD[fix.type] ?? fix.type;
  const returnIndex = drawn.returnMarkers[0] ?? drawn.values.length - 1;
  const sinceReturn = drawn.values.slice(returnIndex);
  const sinceReturnTotal = sinceReturn.reduce((a, b) => a + b, 0);
  const latest = drawn.values[drawn.values.length - 1] ?? 0;
  const peak = Math.max(0, ...sinceReturn);
  const partnerCount = partners ?? theme.partners;
  const knownCount = windowContacts ?? theme.contacts13w;
  // Themes that have settled again read from the return week, not this week.
  const stillUp = latest > fix.after;

  const [level, p] = (signal?.confidence ?? "").split(" ");

  return {
    id,
    signalId: `THEME-${id}`,
    title: card.title,
    headline: stillUp
      ? `${theme.name}: back after the ${shortDate(fix.date)} ${fixWord}. ${latest} contacts this week against ${fix.after} a week after the fix.`
      : `${theme.name}: came back on ${shortDate(card.returnDate)} after the ${shortDate(fix.date)} ${fixWord}. ${peak} contacts that week against ${fix.after} a week after the fix.`,
    shortName: drawn.name.toLowerCase(),
    chart: {
      weeks: recurring.timeline.weeks,
      values: drawn.values,
      fixMarkers: drawn.fixMarkers.map((weekIndex) => ({
        weekIndex,
        label: `${shortDate(fix.date)} ${fixWord}`,
      })),
      returnMarkers: drawn.returnMarkers.map((weekIndex) => ({
        weekIndex,
        label: "return",
      })),
    },
    severity: {
      class: signal?.severity ?? "S4",
      word: "Operational",
      typeNote: signal?.shape ?? "slope",
      blastRadius: {
        headline: `${partnerCount} partners · ${theme.channels.join(", ")}`,
      },
    },
    confidence:
      level && p
        ? {
            level,
            p: Number(p),
            known: {
              count: knownCount,
              label: `${knownCount} contacts in the ${window}`,
            },
            inferred: {
              // Never more than the contacts known in the window.
              count: Math.min(sinceReturnTotal, knownCount),
              label: `${Math.min(sinceReturnTotal, knownCount)} of them since the return on ${shortDate(card.returnDate)}`,
            },
          }
        : undefined,
    joinTags: [
      { key: "CHANNELS", value: theme.channels.join(", ") },
      { key: "PARTNERS", value: String(partnerCount) },
      { key: "LAST FIX", value: theme.lastFixLabel },
    ],
    pnl: { compact: signal?.pnlTag ?? "Cost-to-serve" },
    fixHistory: [
      {
        date: fix.date,
        what: sentenceCase(fixWord),
        by: fix.owner,
        contactsPerWeekBefore: fix.before,
        contactsPerWeekAfter: fix.after,
      },
      {
        date: card.returnDate,
        what: "Contacts returned",
        by: "—",
        contactsPerWeekBefore: fix.after,
        contactsPerWeekAfter: peak,
      },
    ],
    drafts: [
      {
        id: `draft-${id}`,
        title: sentenceCase(
          signal?.recommendation.replace(/^[^:]+:\s*/, "") ??
            `Re-issue the ${shortDate(fix.date)} ${fixWord} to the partners who contacted again`,
        ),
        status: "Not sent",
        awaiting: owner,
      },
    ],
    loop: { nextCheck: rc01.loop.nextCheck },
    humanGate: {
      title: `Draft — awaiting ${owner} approval`,
      chip: "Awaiting approval",
      owner,
      approveEnabledFor: [owner],
      approveLabel: "Approve",
      disabledTooltip: `Approval sits with the ${owner}`,
    },
  };
}
